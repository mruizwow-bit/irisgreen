#!/usr/bin/env python3
"""W07-R1 QA freeze runner. QA-only; does not implement build exclusions."""
from __future__ import annotations
import argparse, hashlib, json, re, subprocess, sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[3]
FIXTURE=json.loads((ROOT/"tests/specs/build-hygiene/w07-r1-fixture-v1.json").read_text(encoding="utf-8"))
CONTRACT=json.loads((ROOT/"tests/specs/build-hygiene/w07-r1-contract-v1.json").read_text(encoding="utf-8"))
BASE=FIXTURE["baseline_sha"]
ALLOWED_PREFIXES=("tests/specs/build-hygiene/","docs/qa/W07_R1_",".github/workflows/w07-r1-qa-freeze.yml")

def sh(*args:str,check:bool=True)->str:
    p=subprocess.run(args,cwd=ROOT,text=True,capture_output=True)
    if check and p.returncode:
        raise RuntimeError(f"{' '.join(args)}\n{p.stdout}\n{p.stderr}")
    return p.stdout.strip()

def sha256(path:Path)->str:
    h=hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda:f.read(1024*1024),b""):
            h.update(chunk)
    return h.hexdigest()

def git_blob(path:str)->str:
    return sh("git","hash-object",path)

def current_identity()->dict:
    return {
        "head":sh("git","rev-parse","HEAD"),
        "tree":sh("git","rev-parse","HEAD^{tree}"),
        "baseline":BASE,
    }

def source_checks()->dict:
    ancestor=subprocess.run(["git","merge-base","--is-ancestor",BASE,"HEAD"],cwd=ROOT).returncode
    assert ancestor==0,"baseline is not an ancestor of QA freeze HEAD"
    changed=sh("git","diff","--name-only",BASE+"...HEAD").splitlines()
    bad=[p for p in changed if p and not (p.startswith(ALLOWED_PREFIXES[0]) or p.startswith(ALLOWED_PREFIXES[1]) or p==ALLOWED_PREFIXES[2])]
    assert not bad, f"product/build path changed in freeze branch: {bad}"

    rows=[]
    for item in FIXTURE["exclusions"]:
        p=ROOT/item["path"]
        assert p.is_file(), item["path"]
        assert p.stat().st_size==item["bytes"], (item["path"],p.stat().st_size,item["bytes"])
        assert git_blob(item["path"])==item["git_blob_sha1"], item["path"]
        assert sh("git","rev-parse",BASE+":"+item["path"])==item["git_blob_sha1"], item["path"]
        rows.append({"path":item["path"],"bytes":item["bytes"],"git_blob_sha1":item["git_blob_sha1"]})
    assert len(rows)==17 and sum(x["bytes"] for x in rows)==288960

    for item in FIXTURE["protected_runtime"]:
        p=ROOT/item["path"]; assert p.is_file(),item["path"]
        assert git_blob(item["path"])==item["git_blob_sha1"],item["path"]

    for p in FIXTURE["protected_flipbooks"]+FIXTURE["protected_licenses"]:
        assert (ROOT/p).is_file(),p

    react=[]
    for a,b in FIXTURE["react_false_positive_pairs"]:
        assert (ROOT/a).is_file() and (ROOT/b).is_file(),(a,b)
        ha,hb=git_blob(a),git_blob(b)
        assert ha==hb,(a,b,ha,hb)
        react.append({"a":a,"b":b,"blob":ha})

    for p,expected in FIXTURE["build_blobs"].items():
        assert sh("git","rev-parse",BASE+":"+p)==expected,(p,expected)

    build=(ROOT/"scripts/build_site.py").read_text(encoding="utf-8")
    repair=(ROOT/"scripts/repair_routes.py").read_text(encoding="utf-8")
    assert not re.search(r"\bffmpeg\b|\btranscod",build+"\n"+repair,re.I),"W07 must not become W11 media conversion"

    return {
        **current_identity(),
        "changed_paths":changed,
        "product_files_changed":len(bad),
        "exclusions":rows,
        "exclusion_count":len(rows),
        "exclusion_bytes":sum(x["bytes"] for x in rows),
        "react_false_positive_pairs":react,
        "runtime_sources_preserved":len(FIXTURE["protected_runtime"]),
        "flipbooks_preserved":len(FIXTURE["protected_flipbooks"]),
        "licenses_preserved":len(FIXTURE["protected_licenses"]),
    }

def build_manifest(root:Path)->dict:
    entries=[]
    for p in sorted(x for x in root.rglob("*") if x.is_file()):
        rel=p.relative_to(root).as_posix()
        entries.append({"path":rel,"bytes":p.stat().st_size,"sha256":sha256(p)})
    return {"files":len(entries),"bytes":sum(x["bytes"] for x in entries),"entries":entries}

def manifest_map(m:dict)->dict:
    return {x["path"]:(x["bytes"],x["sha256"]) for x in m["entries"]}

def publication_contract(root:Path)->dict:
    pages=list(root.rglob("*.html"))
    counts={"index,follow":0,"noindex,follow":0,"otro_o_ninguno":0}
    pat1=re.compile(r'<meta[^>]*name=["\']robots["\'][^>]*content=["\']([^"\']*)["\']',re.I)
    pat2=re.compile(r'<meta[^>]*content=["\']([^"\']*)["\'][^>]*name=["\']robots["\']',re.I)
    for p in pages:
        s=p.read_text(encoding="utf-8",errors="ignore")
        m=pat1.search(s) or pat2.search(s)
        v=m.group(1).strip().lower() if m else None
        counts[v if v in counts else "otro_o_ninguno"]+=1
    sitemap=(root/"sitemap.xml").read_text(encoding="utf-8")
    return {"html":len(pages),**counts,"sitemap_urls":len(re.findall(r"<url(?:\s|>)",sitemap))}

def sensitive_scan(root:Path)->dict:
    forbidden_names=[]
    for p in root.rglob("*"):
        if not p.is_file(): continue
        rel=p.relative_to(root).as_posix().lower()
        if rel=="netlify.toml" or rel.startswith(".netlify/") or "/.netlify/" in rel or Path(rel).name.startswith(".env"):
            forbidden_names.append(rel)
    patterns=[
        re.compile(br"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
        re.compile(br"\bghp_[A-Za-z0-9]{30,}\b"),
        re.compile(br"\bgithub_pat_[A-Za-z0-9_]{30,}\b"),
        re.compile(br"\bsk-[A-Za-z0-9]{30,}\b"),
        re.compile(br"NETLIFY_AUTH_TOKEN\s*="),
    ]
    hits=[]
    text_ext={".html",".js",".json",".css",".txt",".csv",".xml",".svg",".b64",""}
    for p in root.rglob("*"):
        if not p.is_file() or p.suffix.lower() not in text_ext or p.stat().st_size>5_000_000: continue
        try: data=p.read_bytes()
        except OSError: continue
        for pat in patterns:
            if pat.search(data):
                hits.append({"path":p.relative_to(root).as_posix(),"pattern":pat.pattern.decode("ascii",errors="ignore")})
    return {"forbidden_names":forbidden_names,"strong_secret_hits":hits}

def dist_checks(root:Path,mode:str,manifest_out:Path|None,compare:Path|None)->dict:
    assert root.is_dir(),root
    m=build_manifest(root)
    if manifest_out:
        manifest_out.parent.mkdir(parents=True,exist_ok=True)
        manifest_out.write_text(json.dumps(m,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    mm=manifest_map(m)
    exclusion_paths=[x["path"] for x in FIXTURE["exclusions"]]
    present=[p for p in exclusion_paths if p in mm]
    absent=[p for p in exclusion_paths if p not in mm]

    if mode=="baseline":
        assert len(present)==17 and not absent,(present,absent)
        for item in FIXTURE["exclusions"]:
            assert mm[item["path"]][0]==item["bytes"],(item["path"],mm[item["path"]][0],item["bytes"])
        assert sum(mm[p][0] for p in exclusion_paths)==288960
    else:
        assert not present,present
        assert len(absent)==17

    for item in FIXTURE["protected_runtime"]:
        assert item["path"] in mm,item["path"]
    for p in FIXTURE["protected_flipbooks"]+FIXTURE["protected_licenses"]:
        assert p in mm,p
    for a,b in FIXTURE["react_false_positive_pairs"]:
        assert a in mm and b in mm,(a,b)
        assert mm[a]==mm[b],(a,b)

    pub=publication_contract(root)
    assert pub==FIXTURE["w04"]["publication_contract"],(pub,FIXTURE["w04"]["publication_contract"])
    sec=sensitive_scan(root)
    assert not sec["forbidden_names"],sec
    assert not sec["strong_secret_hits"],sec
    assert "netlify.toml" not in mm

    comparison=None
    if compare:
        old=json.loads(compare.read_text(encoding="utf-8"))
        om=manifest_map(old)
        added=sorted(set(mm)-set(om))
        removed=sorted(set(om)-set(mm))
        changed=sorted(p for p in set(mm)&set(om) if mm[p]!=om[p])
        comparison={"added":added,"removed":removed,"changed":changed}
        if mode=="baseline":
            assert not added and not removed and not changed,comparison
        else:
            assert not added and not changed,comparison
            assert removed==sorted(exclusion_paths),(removed,sorted(exclusion_paths))

    media_suffix={".mp3",".m4a",".wav",".ogg",".webp",".png",".jpg",".jpeg",".gif",".svg",".pdf",".woff2"}
    media=[x for x in m["entries"] if Path(x["path"]).suffix.lower() in media_suffix]
    return {
        **current_identity(),
        "mode":mode,
        "artifact":{"files":m["files"],"bytes":m["bytes"]},
        "manifest_sha256":sha256(manifest_out) if manifest_out and manifest_out.exists() else None,
        "exclusions_present":present,
        "exclusions_absent":absent,
        "publication_contract":pub,
        "sensitive_scan":sec,
        "protected_media":{"files":len(media),"bytes":sum(x["bytes"] for x in media)},
        "comparison":comparison,
    }

def parse_error_count(obj)->int:
    if isinstance(obj.get("errores"),int): return obj["errores"]
    if isinstance(obj.get("errores"),list): return len(obj["errores"])
    if isinstance(obj.get("errors"),int): return obj["errors"]
    if isinstance(obj.get("errors"),list): return len(obj["errors"])
    raise AssertionError("cannot parse storage error count")

def run_cmd(args:list[str],allow_fail:bool=False)->dict:
    p=subprocess.run(args,cwd=ROOT,text=True,capture_output=True)
    if p.returncode and not allow_fail:
        raise RuntimeError(f"{' '.join(args)}\n{p.stdout}\n{p.stderr}")
    return {"cmd":args,"returncode":p.returncode,"stdout_tail":p.stdout[-3000:],"stderr_tail":p.stderr[-3000:]}

def gate_checks(mode:str)->dict:
    dist=ROOT/"dist"; assert dist.is_dir()
    route=run_cmd([sys.executable,"scripts/test_routes.py","--baseline","."],allow_fail=True)
    storage=run_cmd([sys.executable,"scripts/audit_privacidad_almacenamiento.py","--root","dist"],allow_fail=True)
    storage_path=dist/"reports/publicacion/privacidad-almacenamiento.json"
    assert storage_path.is_file(),storage
    storage_obj=json.loads(storage_path.read_text(encoding="utf-8"))
    errors=parse_error_count(storage_obj)
    if mode=="baseline":
        assert errors==FIXTURE["baseline_storage_errors"],(errors,FIXTURE["baseline_storage_errors"])
    else:
        assert errors<=FIXTURE["baseline_storage_errors"],(errors,FIXTURE["baseline_storage_errors"])
    privacy=run_cmd([sys.executable,"scripts/audit_privacidad.py","--root","dist"])
    csp=run_cmd([sys.executable,"scripts/audit_csp_dependencies.py","--root","dist","--max-eval-like","0"])
    headers=run_cmd([sys.executable,"scripts/audit_security_headers.py","--root","dist"])
    evalscope=run_cmd([sys.executable,"scripts/check_csp_eval_scope.py","--root","dist"])
    route_report=ROOT/"reports/routes/tests.json"
    assert route_report.is_file()
    rr=json.loads(route_report.read_text(encoding="utf-8"))
    route_failures=rr.get("failures") or []
    frozen_route=FIXTURE["w06_route_baseline"]
    if mode=="baseline":
        assert route["returncode"]==frozen_route["returncode"],(route["returncode"],frozen_route["returncode"])
        assert route_failures==frozen_route["failures"],(route_failures,frozen_route["failures"])
    else:
        # W07 does not reopen W06. The exact preexisting checker red may remain, but
        # no additional route-checker failure is allowed.
        assert route_failures in ([],frozen_route["failures"]),(route_failures,frozen_route["failures"])
        assert route["returncode"] in (0,frozen_route["returncode"]),route["returncode"]
    return {
        **current_identity(),
        "mode":mode,
        "w06_route_checker":{"returncode":route["returncode"],"report":str(route_report.relative_to(ROOT)),"failures":route_failures,"classification":("EXPECTED_BASELINE_FAIL_PREEXISTING_CHECKER_CONTRACT" if route_failures==frozen_route["failures"] else "PASS")},
        "storage":{"returncode":storage["returncode"],"errors":errors,"baseline_errors":FIXTURE["baseline_storage_errors"]},
        "privacy_returncode":privacy["returncode"],
        "csp_returncode":csp["returncode"],
        "security_headers_returncode":headers["returncode"],
        "eval_scope_returncode":evalscope["returncode"],
    }

def write_report(obj:dict,out:Path|None):
    if out:
        out.parent.mkdir(parents=True,exist_ok=True)
        out.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(obj,ensure_ascii=False))

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--phase",choices=["source","dist","gates"],required=True)
    ap.add_argument("--mode",choices=["baseline","candidate"],default="baseline")
    ap.add_argument("--root",default="dist")
    ap.add_argument("--out")
    ap.add_argument("--manifest-out")
    ap.add_argument("--compare-manifest")
    a=ap.parse_args()
    out=Path(a.out) if a.out else None
    if a.phase=="source":
        obj=source_checks()
    elif a.phase=="dist":
        obj=dist_checks(ROOT/a.root,a.mode,Path(a.manifest_out) if a.manifest_out else None,Path(a.compare_manifest) if a.compare_manifest else None)
    else:
        obj=gate_checks(a.mode)
    obj["contract_cases"]=len(CONTRACT["cases"])
    obj["status"]="W07_R1_BASELINE_REPRODUCED" if a.mode=="baseline" else "W07_R1_CANDIDATE_CHECKED"
    write_report(obj,out)

if __name__=="__main__":
    main()
