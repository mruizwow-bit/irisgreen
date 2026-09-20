#!/usr/bin/env python3
from pathlib import Path
import tempfile, shutil, subprocess, hashlib, json, sys

def sha(p):
    h=hashlib.sha256()
    with open(p,'rb') as f:
        for c in iter(lambda:f.read(1024*1024),b''): h.update(c)
    return h.hexdigest()

def main():
    root=Path(__file__).resolve().parents[1]
    with tempfile.TemporaryDirectory(prefix='sabik-r1-repro-') as td:
        tmp=Path(td)/'pkg'; tmp.mkdir()
        shutil.copytree(root/'audit',tmp/'audit')
        shutil.copytree(root/'scripts',tmp/'scripts')
        shutil.copytree(root/'brand',tmp/'brand')
        subprocess.run([sys.executable,str(tmp/'scripts/clean_masters.py'),'--root',str(tmp)],check=True,capture_output=True,text=True)
        subprocess.run([sys.executable,str(tmp/'scripts/build_assets.py'),'--root',str(tmp)],check=True,capture_output=True,text=True)
        subprocess.run([sys.executable,str(tmp/'scripts/build_proofs.py'),'--root',str(tmp)],check=True,capture_output=True,text=True)
        mismatches=[]; checked=0
        for relbase in ('masters','assets','proofs'):
            for p in sorted((root/relbase).rglob('*')):
                if not p.is_file(): continue
                if relbase=='masters' and not p.name.endswith('_master_raster.png'): continue
                q=tmp/p.relative_to(root)
                if not q.exists() or sha(p)!=sha(q): mismatches.append(str(p.relative_to(root)))
                checked+=1
        report={'status':'REPRODUCIBILITY_PASS' if not mismatches else 'REPRODUCIBILITY_FAIL','checked_files':checked,'mismatches':mismatches}
        (root/'tests'/'REPRODUCIBILITY_REPORT.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
        print(report['status'])
        if mismatches: raise SystemExit(1)
if __name__=='__main__': main()
