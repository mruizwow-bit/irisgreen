#!/usr/bin/env python3
from __future__ import annotations

import argparse
import copy
import json
import re
import subprocess
from pathlib import Path

import yaml

BOOL_TAG = "tag:yaml.org,2002:bool"
class WorkflowLoader(yaml.SafeLoader):
    pass
for ch, resolvers in list(WorkflowLoader.yaml_implicit_resolvers.items()):
    WorkflowLoader.yaml_implicit_resolvers[ch] = [
        (tag, rx) for tag, rx in resolvers if tag != BOOL_TAG
    ]

HEX40 = re.compile(r"^[0-9a-f]{40}$")
GIT_WRITE = re.compile(r"\bgit\s+(add|commit|push)\b")

def sh(*args: str, cwd: Path) -> str:
    return subprocess.check_output(list(args), cwd=cwd, text=True).strip()

def yaml_load(text: str):
    doc = yaml.load(text, Loader=WorkflowLoader)
    if not isinstance(doc, dict):
        raise ValueError("workflow YAML root must be a mapping")
    if "on" not in doc:
        raise ValueError("workflow YAML missing on:")
    if "jobs" not in doc or not isinstance(doc["jobs"], dict) or not doc["jobs"]:
        raise ValueError("workflow YAML missing jobs")
    return doc

def file_doc(root: Path, path: str):
    return yaml_load((root / path).read_text(encoding="utf-8"))

def baseline_doc(root: Path, baseline: str, path: str):
    return yaml_load(sh("git", "show", f"{baseline}:{path}", cwd=root))

def uses_inventory(doc):
    out=[]
    for job_id, job in doc.get("jobs", {}).items():
        for idx, step in enumerate((job or {}).get("steps", []) or []):
            if isinstance(step, dict) and "uses" in step:
                out.append({
                    "job": job_id,
                    "index": idx,
                    "name": step.get("name"),
                    "uses": step.get("uses"),
                })
    return out

def repo_write_inventory(doc):
    out=[]
    for job_id, job in doc.get("jobs", {}).items():
        for idx, step in enumerate((job or {}).get("steps", []) or []):
            if not isinstance(step, dict):
                continue
            run=step.get("run")
            if not isinstance(run, str):
                continue
            ops=[]
            for m in GIT_WRITE.finditer(run):
                op=m.group(1)
                if op not in ops:
                    ops.append(op)
            if ops:
                out.append({
                    "job":job_id,
                    "index":idx,
                    "name":step.get("name"),
                    "git_ops":ops,
                })
    return out

def checkout_refs(doc):
    refs=[]
    for item in uses_inventory(doc):
        use=item["uses"]
        if isinstance(use, str) and use.startswith("actions/checkout@"):
            ref=use.split("@",1)[1]
            refs.append({**item, "ref":ref, "immutable":bool(HEX40.fullmatch(ref))})
    return refs

def explicit_permissions(doc):
    return copy.deepcopy(doc.get("permissions")) if "permissions" in doc else None

def sanitized_semantics(doc):
    d=copy.deepcopy(doc)
    d.pop("permissions", None)
    for job in d.get("jobs", {}).values():
        if not isinstance(job, dict):
            continue
        for step in job.get("steps", []) or []:
            if isinstance(step, dict):
                use=step.get("uses")
                if isinstance(use, str) and use.startswith("actions/checkout@"):
                    step["uses"]="actions/checkout@<PINNED>"
    return d

def external_action_families(doc):
    fam=[]
    for item in uses_inventory(doc):
        use=item["uses"]
        if isinstance(use,str):
            fam.append(use.split("@",1)[0])
    return fam

def check_baseline_binding(root, contract):
    errors=[]
    observations={}
    baseline=contract["baseline_sha"]
    for wf in contract["target_workflows"]:
        path=wf["path"]
        try:
            bdoc=baseline_doc(root, baseline, path)
        except Exception as exc:
            errors.append(f"{path}: cannot parse baseline: {exc}")
            continue
        blob=sh("git","rev-parse",f"{baseline}:{path}",cwd=root)
        observations[path]={
            "blob":blob,
            "uses":uses_inventory(bdoc),
            "permissions":explicit_permissions(bdoc),
            "repo_write_steps":repo_write_inventory(bdoc),
            "on":bdoc.get("on"),
            "jobs":list(bdoc.get("jobs",{}).keys()),
        }
        if blob != wf["baseline_blob"]:
            errors.append(f"{path}: baseline blob {blob} != frozen {wf['baseline_blob']}")
        if observations[path]["uses"] != wf["baseline_uses"]:
            errors.append(f"{path}: baseline uses inventory drift")
        if observations[path]["permissions"] != wf["baseline_permissions"]:
            errors.append(f"{path}: baseline permissions drift")
        if observations[path]["repo_write_steps"] != wf["baseline_repo_write_steps"]:
            errors.append(f"{path}: baseline repo-write inventory drift")
        if observations[path]["on"] != wf["baseline_on"]:
            errors.append(f"{path}: baseline trigger inventory drift")
        if observations[path]["jobs"] != wf["expected_jobs"]:
            errors.append(f"{path}: baseline jobs drift")
    return observations, errors

def changed_files(root: Path, baseline: str):
    return sh("git","diff","--name-only",f"{baseline}...HEAD",cwd=root).splitlines()

def phase_baseline(root, contract):
    observations, errors=check_baseline_binding(root,contract)
    current={}
    mutable=[]
    explicit_count=0
    yaml_parse=True
    for wf in contract["target_workflows"]:
        path=wf["path"]
        try:
            doc=file_doc(root,path)
        except Exception as exc:
            yaml_parse=False
            errors.append(f"{path}: current YAML parse error: {exc}")
            continue
        blob=sh("git","hash-object",path,cwd=root)
        refs=checkout_refs(doc)
        mutable.extend([{"path":path,**r} for r in refs if not r["immutable"]])
        if "permissions" in doc:
            explicit_count+=1
        current[path]={
            "blob":blob,
            "uses":uses_inventory(doc),
            "permissions":explicit_permissions(doc),
            "repo_write_steps":repo_write_inventory(doc),
            "on":doc.get("on"),
            "jobs":list(doc.get("jobs",{}).keys()),
            "checkout_refs":refs,
        }
        if blob != wf["baseline_blob"]:
            errors.append(f"{path}: freeze baseline target changed from exact blob")
    exact_mutable = len(mutable)==3 and all(x["uses"]=="actions/checkout@v4" for x in mutable)
    if not exact_mutable:
        errors.append(f"S01 baseline must reproduce exactly 3 mutable checkout@v4 refs, got {mutable!r}")
    baseline_red=[]
    if len(mutable)!=0:
        baseline_red.append("S06")
    if explicit_count!=3:
        baseline_red.append("S07")
    rut=current.get(".github/workflows/rutinas-visuales.yml",{})
    if rut.get("permissions") != {"contents":"read"}:
        baseline_red.append("S11")
    if baseline_red != contract["baseline_expected_candidate_gate_failures"]:
        errors.append(f"baseline expected red drift: {baseline_red!r}")
    pub=current.get(".github/workflows/publicar-investigacion-120.yml",{})
    diag=current.get(".github/workflows/diagnostico-build-investigacion.yml",{})
    cases={
        "S01":{"pass":exact_mutable,"mutable_refs":mutable},
        "S02":{"pass":all(current.get(w["path"],{}).get("uses")==w["baseline_uses"] for w in contract["target_workflows"])},
        "S03":{"pass":all(current.get(w["path"],{}).get("permissions")==w["baseline_permissions"] for w in contract["target_workflows"])},
        "S04":{"pass":all(current.get(w["path"],{}).get("repo_write_steps")==w["baseline_repo_write_steps"] for w in contract["target_workflows"])},
        "S05":{"pass":all(current.get(w["path"],{}).get("on")==w["baseline_on"] for w in contract["target_workflows"])},
        "S06":{"pass":False,"expected_baseline_red":True,"mutable_count":len(mutable)},
        "S07":{"pass":False,"expected_baseline_red":True,"explicit_permissions_count":explicit_count},
        "S08":{"pass":True,"baseline_reference_only":True},
        "S09":{"pass":pub.get("permissions")=={"contents":"write"} and pub.get("repo_write_steps")==contract["target_workflows"][1]["baseline_repo_write_steps"]},
        "S10":{"pass":diag.get("permissions")=={"contents":"read"} and diag.get("repo_write_steps")==[]},
        "S11":{"pass":False,"expected_baseline_red":True,"permissions":rut.get("permissions")},
        "S12":{"pass":all(external_action_families(file_doc(root,w["path"]))==["actions/checkout"] for w in contract["target_workflows"])},
        "S13":{"pass":yaml_parse},
        "S14":{"pass":yaml_parse,"static_internal":"parsed + structural semantics frozen","actionlint":"optional_external"},
        "S15":{"pass":True,"checked_by_workflow_scope_gate":True},
        "S16":{"pass":True,"checked_by_workflow_git_diff_check":True},
        "S17":{"pass":all(current.get(w["path"],{}).get("blob")==w["baseline_blob"] for w in contract["target_workflows"]),
               "rollback":{"baseline_sha":contract["baseline_sha"],"blobs":{w["path"]:w["baseline_blob"] for w in contract["target_workflows"]}}},
        "S18":{"pass":True,"procedural":"freeze has no merge/deploy/production action"},
    }
    return {
        "phase":"baseline",
        "baseline_sha":contract["baseline_sha"],
        "current":current,
        "baseline_expected_candidate_gate_failures":baseline_red,
        "cases":cases,
        "errors":errors,
    }

def phase_candidate(root, contract):
    observations, errors=check_baseline_binding(root,contract)
    baseline=contract["baseline_sha"]
    current={}
    mutable=[]
    pinned=[]
    parse_ok=True
    semantic_equal=True
    for wf in contract["target_workflows"]:
        path=wf["path"]
        try:
            doc=file_doc(root,path)
            bdoc=baseline_doc(root,baseline,path)
        except Exception as exc:
            parse_ok=False
            semantic_equal=False
            errors.append(f"{path}: YAML parse error: {exc}")
            continue
        refs=checkout_refs(doc)
        mutable.extend([{"path":path,**r} for r in refs if not r["immutable"]])
        pinned.extend([{"path":path,**r} for r in refs if r["immutable"]])
        sem=(sanitized_semantics(doc)==sanitized_semantics(bdoc))
        semantic_equal &= sem
        if not sem:
            errors.append(f"{path}: functional semantics drift outside checkout ref/permissions")
        current[path]={
            "blob":sh("git","hash-object",path,cwd=root),
            "uses":uses_inventory(doc),
            "permissions":explicit_permissions(doc),
            "repo_write_steps":repo_write_inventory(doc),
            "on":doc.get("on"),
            "jobs":list(doc.get("jobs",{}).keys()),
            "checkout_refs":refs,
            "semantic_equal_except_allowed_fields":sem,
        }

    expected_paths=contract["candidate_rules"]["exact_changed_files"]
    changed=changed_files(root,baseline)
    changed_exact=(changed==expected_paths)
    if not changed_exact:
        errors.append(f"S15 candidate changed files drift: {changed!r}")

    required_use=contract["candidate_rules"]["required_checkout_uses"]
    all_uses=[]
    for wf in contract["target_workflows"]:
        all_uses.extend(current.get(wf["path"],{}).get("uses",[]))
    checkout_uses=[x["uses"] for x in all_uses if isinstance(x.get("uses"),str) and x["uses"].startswith("actions/checkout@")]
    pinned_ok=(len(checkout_uses)==3 and all(x==required_use for x in checkout_uses) and not mutable)
    if not pinned_ok:
        errors.append(f"S06 checkout pinning failed: {checkout_uses!r}; mutable={mutable!r}")

    perms_ok=True
    for wf in contract["target_workflows"]:
        got=current.get(wf["path"],{}).get("permissions")
        if got != wf["candidate_permissions"]:
            perms_ok=False
            errors.append(f"{wf['path']}: permissions {got!r} != required {wf['candidate_permissions']!r}")

    pub=current.get(".github/workflows/publicar-investigacion-120.yml",{})
    diag=current.get(".github/workflows/diagnostico-build-investigacion.yml",{})
    rut=current.get(".github/workflows/rutinas-visuales.yml",{})
    write_ok=(
        pub.get("permissions")=={"contents":"write"} and
        pub.get("repo_write_steps")==contract["target_workflows"][1]["baseline_repo_write_steps"] and
        diag.get("permissions")=={"contents":"read"} and diag.get("repo_write_steps")==[] and
        rut.get("permissions")=={"contents":"read"} and rut.get("repo_write_steps")==[]
    )
    if not write_ok:
        errors.append("S08/S09/S10/S11 least-privilege or controlled write semantics failed")

    no_new_actions=True
    for wf in contract["target_workflows"]:
        path=wf["path"]
        try:
            cdoc=file_doc(root,path); bdoc=baseline_doc(root,baseline,path)
        except Exception:
            no_new_actions=False
            continue
        if external_action_families(cdoc)!=external_action_families(bdoc):
            no_new_actions=False
    if not no_new_actions:
        errors.append("S12 external action family inventory changed")

    cases={
        "S01":{"pass":True,"frozen_baseline_mutable_refs":3},
        "S02":{"pass":True,"baseline_inventory_bound":not any("baseline uses inventory drift" in e for e in errors)},
        "S03":{"pass":True,"baseline_permissions_bound":not any("baseline permissions drift" in e for e in errors)},
        "S04":{"pass":True,"baseline_write_inventory_bound":not any("baseline repo-write inventory drift" in e for e in errors)},
        "S05":{"pass":True,"baseline_triggers_bound":not any("baseline trigger inventory drift" in e for e in errors)},
        "S06":{"pass":pinned_ok,"mutable_refs":mutable,"checkout_uses":checkout_uses},
        "S07":{"pass":perms_ok,"permissions":{p:x.get("permissions") for p,x in current.items()}},
        "S08":{"pass":write_ok},
        "S09":{"pass":pub.get("permissions")=={"contents":"write"} and pub.get("repo_write_steps")==contract["target_workflows"][1]["baseline_repo_write_steps"] and semantic_equal},
        "S10":{"pass":diag.get("permissions")=={"contents":"read"} and diag.get("repo_write_steps")==[] and semantic_equal},
        "S11":{"pass":rut.get("permissions")=={"contents":"read"} and rut.get("repo_write_steps")==[] and semantic_equal},
        "S12":{"pass":no_new_actions},
        "S13":{"pass":parse_ok},
        "S14":{"pass":parse_ok and semantic_equal,"static_internal":"parsed + exact structural semantic comparison","actionlint":"optional_external"},
        "S15":{"pass":changed_exact,"changed_files":changed},
        "S16":{"pass":True,"checked_by_invoker":"git diff --check required"},
        "S17":{"pass":not any("baseline blob" in e for e in errors),
               "rollback":{"baseline_sha":baseline,"blobs":{w["path"]:w["baseline_blob"] for w in contract["target_workflows"]}}},
        "S18":{"pass":True,"procedural":"candidate gate does not authorize merge/deploy"},
    }
    return {
        "phase":"candidate",
        "baseline_sha":baseline,
        "current":current,
        "cases":cases,
        "errors":errors,
    }

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--phase",choices=["baseline","candidate"],required=True)
    ap.add_argument("--contract",type=Path,required=True)
    ap.add_argument("--root",type=Path,required=True)
    ap.add_argument("--output",type=Path,required=True)
    args=ap.parse_args()
    contract=json.loads(args.contract.read_text(encoding="utf-8"))
    root=args.root.resolve()
    report=phase_baseline(root,contract) if args.phase=="baseline" else phase_candidate(root,contract)
    report["contract_id"]=contract["contract_id"]
    report["schema"]="SEC_IW_02_ACTIONS_GATE_REPORT/1.0"
    args.output.parent.mkdir(parents=True,exist_ok=True)
    args.output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(report,ensure_ascii=False,indent=2))
    raise SystemExit(1 if report["errors"] else 0)

if __name__=="__main__":
    main()
