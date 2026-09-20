#!/usr/bin/env python3
from pathlib import Path
import tempfile, subprocess, sys, hashlib, json

def sha(p):
    h=hashlib.sha256()
    with open(p,'rb') as f:
        for c in iter(lambda:f.read(1024*1024),b''): h.update(c)
    return h.hexdigest()

def main():
    root=Path(__file__).resolve().parents[1]
    with tempfile.TemporaryDirectory(prefix='sabik-b3-static-') as td:
        td=Path(td)
        subprocess.run([sys.executable,str(root/'scripts'/'build_b3_static.py'),'--root',str(root),'--out-root',str(td)],check=True)
        mismatches=[]; checked=0
        for section in ('assets','proofs'):
            dist=root/section; gen=td/section
            for p in sorted(dist.rglob('*')):
                if not p.is_file(): continue
                q=gen/p.relative_to(dist)
                if not q.is_file() or p.stat().st_size!=q.stat().st_size or sha(p)!=sha(q):
                    mismatches.append(f'{section}/{p.relative_to(dist).as_posix()}')
                checked+=1
        report={'status':'B3_STATIC_REPRODUCIBILITY_PASS' if not mismatches else 'B3_STATIC_REPRODUCIBILITY_FAIL','checked_files':checked,'mismatches':mismatches}
        (root/'tests'/'REPRODUCIBILITY_REPORT.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
        print(report['status'], checked, 'files')
        if mismatches: raise SystemExit(1)

if __name__=='__main__': main()