#!/usr/bin/env python3
from __future__ import annotations
import argparse,hashlib,http.server,json,re,shutil,socketserver,subprocess,sys,tempfile,threading,urllib.request
from pathlib import Path

TEN_MB=10_000_000
SITE_ID="40042464-343c-4587-b6b7-f6159836e291"
SITE_NAME="irisgreen-home"

def run(cmd,cwd,logs,name):
    p=subprocess.run(cmd,cwd=cwd,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
    (logs/f"{name}.log").write_text(p.stdout or "",encoding="utf-8")
    return {"name":name,"cmd":cmd,"returncode":p.returncode,"ok":p.returncode==0}

def git(root,*args):
    return subprocess.check_output(["git",*args],cwd=root,text=True).strip()

def manifest(dist):
    rows=[]
    for p in sorted(dist.rglob("*")):
        if not p.is_file(): continue
        h=hashlib.sha256()
        with p.open("rb") as f:
            for chunk in iter(lambda:f.read(1048576),b""): h.update(chunk)
        rows.append({"path":p.relative_to(dist).as_posix(),"bytes":p.stat().st_size,"sha256":h.hexdigest()})
    return {"files":len(rows),"bytes":sum(x["bytes"] for x in rows),"entries":rows}

def diffm(a,b):
    x={r["path"]:r for r in a["entries"]};y={r["path"]:r for r in b["entries"]}
    added=[y[p] for p in sorted(y.keys()-x.keys())]
    removed=[x[p] for p in sorted(x.keys()-y.keys())]
    changed=[{"path":p,"base":x[p],"candidate":y[p]} for p in sorted(x.keys()&y.keys()) if x[p]["sha256"]!=y[p]["sha256"]]
    return {
        "added":added,"removed":removed,"changed":changed,
        "counts":{"added":len(added),"removed":len(removed),"changed":len(changed)},
        "new_files_over_10mb":[r for r in added if r["bytes"]>TEN_MB],
        "size_delta_bytes":b["bytes"]-a["bytes"],
    }

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def smoke(dist):
    handler=lambda *a,**k:QuietHandler(*a,directory=str(dist),**k)
    srv=socketserver.TCPServer(("127.0.0.1",0),handler)
    threading.Thread(target=srv.serve_forever,daemon=True).start()
    port=srv.server_address[1];rows=[];errors=[]
    try:
        for path in ["/","/es/tramites/directorio/","/es/tarjetas-iris/","/es/recursos/tarjeta-iris/","/es/privacidad/"]:
            try:
                with urllib.request.urlopen(f"http://127.0.0.1:{port}{path}",timeout=5) as r:
                    rows.append({"path":path,"status":r.status,"bytes":len(r.read())})
            except Exception as e:
                errors.append(f"{path}: {e}")
    finally:
        srv.shutdown();srv.server_close()

    legacy=(dist/"es/tarjetas-iris/index.html").read_text(encoding="utf-8",errors="ignore")
    if not re.search(r"<main\b",legacy,re.I): errors.append("/es/tarjetas-iris/: falta <main>")
    if not re.search(r"<h1\b",legacy,re.I): errors.append("/es/tarjetas-iris/: falta <h1>")

    canonical=(dist/"es/recursos/tarjeta-iris/index.html").read_text(encoding="utf-8",errors="ignore")
    for token in ['id="ti-copy"','id="ti-card-status"','role="status"','aria-live="polite"','aria-atomic="true"']:
        if token not in canonical: errors.append("Tarjeta Iris canónica: falta "+token)
    return {"requests":rows,"errors":errors,"ok":not errors}

def contrast(path):
    if not path.is_file(): return {"ok":False,"error":"No existe results.json"}
    data=json.loads(path.read_text())
    bad=[]
    def lum(rgb):
        vals=[]
        for x in rgb:
            c=x/255
            vals.append(c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4)
        return .2126*vals[0]+.7152*vals[1]+.0722*vals[2]
    def ratio(a):
        x,y=sorted((lum(a),lum((255,255,255))),reverse=True)
        return (x+.05)/(y+.05)
    for row in data.get("signatures",[]):
        s=row["style"]
        m=re.fullmatch(r"rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)",s["color"])
        if not m: continue
        rgb=tuple(float(z) for z in m.group(1,2,3))
        alpha=float(m.group(4) or s.get("opacity") or 1)
        fg=tuple(c*alpha+255*(1-alpha) for c in rgb)
        size=float(s["fontSize"].replace("px",""))
        weight=float(s["fontWeight"]) if str(s["fontWeight"]).replace(".","",1).isdigit() else 400
        required=3 if size>=24 or (size>=18.666 and weight>=700) else 4.5
        value=ratio(fg)
        if value+1e-6<required:
            bad.append({"ratio":round(value,3),"required":required,"examples":row.get("examples",[])[:3],"style":s})
    px=data.get("pixel_probe_signatures_with_failures",0)
    return {"ok":not bad and not px,"best_case_white_failures":bad,"pixel_probe_failures":px}

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--base",required=True)
    ap.add_argument("--candidate",default="HEAD")
    ap.add_argument("--browser-python",required=True)
    ap.add_argument("--axe",required=True)
    ap.add_argument("--rollback-deploy-id",required=True)
    ap.add_argument("--output",type=Path,default=Path("/tmp/irisgreen-web-rel-r0"))
    a=ap.parse_args()

    root=Path(git(Path.cwd(),"rev-parse","--show-toplevel"))
    before=git(root,"status","--porcelain=v1","--untracked-files=all")
    if before: raise SystemExit("WEB-REL-R0 exige checkout limpio.")
    base=git(root,"rev-parse",a.base);cand=git(root,"rev-parse",a.candidate)
    out=a.output.resolve()
    if out.exists(): shutil.rmtree(out)
    logs=out/"logs";logs.mkdir(parents=True)
    results=[];fail=[]

    try:
        with tempfile.TemporaryDirectory(prefix="ig-web-rel-r0-") as td:
            wb=Path(td)/"base";wc=Path(td)/"candidate"
            subprocess.run(["git","worktree","add","--detach",str(wb),base],cwd=root,check=True,stdout=subprocess.DEVNULL)
            subprocess.run(["git","worktree","add","--detach",str(wc),cand],cwd=root,check=True,stdout=subprocess.DEVNULL)
            try:
                for label,w in [("base",wb),("candidate",wc)]:
                    r=run([sys.executable,"scripts/build_site.py"],w,logs,"build-"+label)
                    results.append(r)
                    if not r["ok"]: fail.append("build-"+label)
                if fail: raise RuntimeError("build falló")

                mb,mc=manifest(wb/"dist"),manifest(wc/"dist")
                (out/"artifact-base.json").write_text(json.dumps(mb,indent=2))
                (out/"artifact-candidate.json").write_text(json.dumps(mc,indent=2))
                md=diffm(mb,mc)
                (out/"artifact-diff.json").write_text(json.dumps(md,indent=2))
                if md["new_files_over_10mb"]: fail.append("archivo nuevo >10 MB")

                tests=[
                    ([sys.executable,"scripts/test_audit_accesibilidad_refs.py"],wc,"a11y-refs"),
                    ([sys.executable,"scripts/audit_accesibilidad.py","--root","dist"],wc,"a11y-structural"),
                    ([sys.executable,"scripts/audit_privacidad.py","--root","dist"],wc,"privacy"),
                    ([sys.executable,"scripts/audit_privacidad_almacenamiento.py","--root","dist"],wc,"privacy-storage"),
                    ([sys.executable,"scripts/audit_sin_js.py","--root","dist"],wc,"no-js"),
                    ([sys.executable,"scripts/audit_security_headers.py","--root","dist"],wc,"headers"),
                    ([sys.executable,"scripts/audit_csp_dependencies.py","--root","dist"],wc,"csp"),
                    ([a.browser_python,"../scripts/test_keyboard_flows.py"],wc/"dist","keyboard"),
                    ([a.browser_python,"../scripts/test_coherence.py"],wc/"dist","coherence"),
                    ([a.browser_python,"../scripts/test_reading_preferences.py","--phase","after"],wc/"dist","preferences"),
                    ([a.browser_python,"../scripts/test_video_thumbnails.py"],wc/"dist","thumbnails"),
                    ([a.browser_python,"scripts/audit_contrast_signatures.py","--root","dist","--axe",str(Path(a.axe).resolve())],wc,"contrast-scan"),
                ]
                for cmd,cwd,name in tests:
                    r=run(cmd,cwd,logs,name);results.append(r)
                    if not r["ok"]: fail.append(name)

                cc=contrast(wc/"dist/reports/wcag-contrast-signatures/results.json")
                (out/"contrast.json").write_text(json.dumps(cc,indent=2))
                if not cc["ok"]: fail.append("contrast-result")

                sm=smoke(wc/"dist")
                (out/"smoke.json").write_text(json.dumps(sm,indent=2))
                if not sm["ok"]: fail.append("smoke")

                rollback={
                    "git_base_sha":base,"candidate_sha":cand,
                    "netlify_site":SITE_NAME,"netlify_site_id":SITE_ID,
                    "production_deploy_id":a.rollback_deploy_id,
                    "rule":"Archive exact known-good dist + manifest before production; rollback by republishing that exact artifact or Netlify Publish deploy.",
                }
                (out/"rollback.json").write_text(json.dumps(rollback,indent=2))
                final={
                    "gate":"WEB-REL-R0","status":"PASS" if not fail else "FAIL",
                    "base_sha":base,"candidate_sha":cand,
                    "artifact":{
                        "base_files":mb["files"],"candidate_files":mc["files"],
                        "base_bytes":mb["bytes"],"candidate_bytes":mc["bytes"],
                        "new_files_over_10mb":len(md["new_files_over_10mb"]),
                        "diff_counts":md["counts"],"size_delta_bytes":md["size_delta_bytes"],
                    },
                    "commands":results,"failures":sorted(set(fail)),
                }
                (out/"gate.json").write_text(json.dumps(final,indent=2))
                print(json.dumps(final,indent=2))
                return 0 if not fail else 1
            finally:
                subprocess.run(["git","worktree","remove","--force",str(wb)],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
                subprocess.run(["git","worktree","remove","--force",str(wc)],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    finally:
        after=git(root,"status","--porcelain=v1","--untracked-files=all")
        if after!=before: print("ERROR: gate modificó checkout real",file=sys.stderr)

if __name__=="__main__":
    raise SystemExit(main())
