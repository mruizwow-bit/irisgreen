#!/usr/bin/env python3
from __future__ import annotations
import argparse, json, subprocess
from pathlib import Path

def sh(root,*args):
    return subprocess.check_output(list(args),cwd=root,text=True).strip()

def git_exists(root, spec):
    return subprocess.run(["git","cat-file","-e",spec],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL).returncode==0

def baseline(root, c):
    errors=[]
    obs={}
    base=c["preview_base"]["sha"]
    if sh(root,"git","rev-parse",f"{base}^{{tree}}") != c["preview_base"]["tree"]:
        errors.append("preview base tree drift")
    for name,item in c["closed_candidates"].items():
        if not git_exists(root,item["head"]+"^{commit}"):
            errors.append(f"{name}: missing commit object")
            continue
        tree=sh(root,"git","rev-parse",item["head"]+"^{tree}")
        obs[name]={"head":item["head"],"tree":tree}
        if tree!=item["tree"]:
            errors.append(f"{name}: tree drift {tree}")
    a01=c["closed_candidates"]["A01"]["head"]
    a03=c["closed_candidates"]["A03"]["head"]
    parent=sh(root,"git","rev-parse",a03+"^")
    obs["a03_parent"]=parent
    if parent!=a01:
        errors.append(f"I02: A03 parent {parent} != A01 {a01}")

    a02=c["closed_candidates"]["A02"]
    mergebase=sh(root,"git","merge-base",a02["base"],a02["head"])
    obs["a02_merge_base"]=mergebase
    if mergebase!=a02["base"]:
        errors.append("I03: A02 merge-base drift")
    files=sh(root,"git","diff","--name-only",a02["base"],a02["head"]).splitlines()
    obs["a02_changed_files"]=files
    expected=[".github/workflows/sabik-a02-lateral.yml","sabik/sabik-page.css","tools/test-sabik-a02-lateral.js"]
    if files!=expected:
        errors.append(f"I03: A02 changed files drift {files!r}")
    d=c["future_recipe"]["a02_product_delta"]
    if sh(root,"git","rev-parse",f"{d['source_base']}:{d['path']}")!=d["base_blob"]:
        errors.append("I03: A02 CSS base blob drift")
    if sh(root,"git","rev-parse",f"{d['source_head']}:{d['path']}")!=d["a02_blob"]:
        errors.append("I03: A02 CSS head blob drift")

    fixture_results=[]
    for f in c["regression_fixtures"]:
        got=sh(root,"git","rev-parse",f"{f['ref']}:{f['path']}")
        fixture_results.append({"source":f["source"],"path":f["path"],"expected_blob":f["blob"],"actual_blob":got,"ok":got==f["blob"]})
        if got!=f["blob"]:
            errors.append(f"fixture blob drift: {f['source']} {f['path']}")
    obs["regression_fixtures"]=fixture_results

    b3=c["b3_identity"]
    if sh(root,"git","rev-parse",b3["authority_head"]+"^{tree}")!=b3["authority_tree"]:
        errors.append("I15: B3 authority tree drift")
    ids=[r[0] for r in c["s1_manual"]["rows"]]
    if len(ids)!=23 or len(set(ids))!=23:
        errors.append("I11: manual S1 row identity/count drift")
    if len(c["cases"])!=26 or list(c["cases"].keys())!=[f"I{i:02d}" for i in range(1,27)]:
        errors.append("I01-I26 case map drift")
    for forbidden,value in {
        "product_edits_in_freeze":0,
        "combined_branch_in_freeze":False,
        "duplicate_A01":False,
        "motion_activation":False,
        "voice_runtime_activation":False,
        "cloud_api_activation":False,
        "merge":False,
        "deploy":False,
        "production":False,
    }.items():
        if c["final_rules"].get(forbidden)!=value:
            errors.append(f"scope rule drift: {forbidden}")
    return {
        "schema":"SABIK_WEB_R01_INTEGRATION_GATE_REPORT/1.0",
        "phase":"baseline",
        "contract_id":c["contract_id"],
        "observations":obs,
        "manual_s1":{"historical_result":c["s1_manual"]["historical_result"],"future_status":c["s1_manual"]["future_initial_status"],"rows":len(ids)},
        "visual_binding":{"required":c["visual_presentation_required"]["id"],"status":"WAIT_ACCEPTED_VISUAL_FOR_FUTURE_CANDIDATE"},
        "cases_frozen":len(c["cases"]),
        "errors":errors
    }

def candidate(root,c,evidence):
    errors=[]
    head=sh(root,"git","rev-parse","HEAD")
    tree=sh(root,"git","rev-parse","HEAD^{tree}")
    if evidence.get("candidate_head")!=head: errors.append("I01/I24 candidate HEAD identity mismatch")
    if evidence.get("candidate_tree")!=tree: errors.append("I01/I24 candidate tree identity mismatch")
    a03=c["closed_candidates"]["A03"]["head"]
    if subprocess.run(["git","merge-base","--is-ancestor",a03,head],cwd=root).returncode!=0:
        errors.append("I02 candidate does not descend from exact A03")
    recipe=evidence.get("recipe",{})
    if recipe.get("a03_head")!=a03: errors.append("I02 recipe A03 mismatch")
    if recipe.get("a01_reapplied") not in (False,0): errors.append("I02 duplicate A01 forbidden")
    d=c["future_recipe"]["a02_product_delta"]
    if recipe.get("a02_source_head")!=d["source_head"] or recipe.get("a02_base_blob")!=d["base_blob"] or recipe.get("a02_head_blob")!=d["a02_blob"]:
        errors.append("I03 A02 product delta provenance mismatch")
    visual=evidence.get("visual",{})
    if visual.get("delivery_id")!=c["visual_presentation_required"]["id"] or visual.get("accepted") is not True:
        errors.append("I16 accepted visual presentation binding missing")
    if visual.get("core_master_changed") is not False:
        errors.append("I15/I16 visual core master changed")

    gates=evidence.get("gates",{})
    for i in range(1,26):
        cid=f"I{i:02d}"
        if gates.get(cid)!="PASS":
            errors.append(f"{cid} not PASS")
    manual=evidence.get("manual_s1",{})
    rows=manual.get("rows",{})
    expected=[x[0] for x in c["s1_manual"]["rows"]]
    if set(rows)!=set(expected) or any(rows.get(x)!="PASS_REAL" for x in expected):
        errors.append("I11 manual S1 is not 23/23 PASS_REAL on final candidate")
    if manual.get("candidate_head")!=head or manual.get("candidate_tree")!=tree:
        errors.append("I11 manual S1 not bound to exact final HEAD/tree")
    if evidence.get("identity_rechecked_after_qa") is not True:
        errors.append("I26 remote identity not rechecked after QA")
    if evidence.get("final_head_after_qa")!=head or evidence.get("final_tree_after_qa")!=tree:
        errors.append("I26 final identity drift")
    return {
        "schema":"SABIK_WEB_R01_INTEGRATION_GATE_REPORT/1.0",
        "phase":"candidate",
        "contract_id":c["contract_id"],
        "candidate_head":head,
        "candidate_tree":tree,
        "manual_s1_pass_real":sum(1 for x in expected if rows.get(x)=="PASS_REAL"),
        "cases_evidence_pass":sum(1 for i in range(1,26) if gates.get(f"I{i:02d}")=="PASS"),
        "verdict":"SABIK_WEB_R01_INTEGRATION_QA_PASS" if not errors else "SABIK_WEB_R01_INTEGRATION_QA_BLOCKED",
        "errors":errors
    }

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--phase",choices=["baseline","candidate"],required=True)
    ap.add_argument("--root",type=Path,required=True)
    ap.add_argument("--contract",type=Path,required=True)
    ap.add_argument("--evidence",type=Path)
    ap.add_argument("--output",type=Path,required=True)
    a=ap.parse_args()
    c=json.loads(a.contract.read_text(encoding="utf-8"))
    root=a.root.resolve()
    if a.phase=="baseline":
        report=baseline(root,c)
    else:
        if not a.evidence: raise SystemExit("--evidence required for candidate phase")
        report=candidate(root,c,json.loads(a.evidence.read_text(encoding="utf-8")))
    a.output.parent.mkdir(parents=True,exist_ok=True)
    a.output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(report,ensure_ascii=False,indent=2))
    raise SystemExit(1 if report["errors"] else 0)
if __name__=="__main__": main()
