#!/usr/bin/env python3
from pathlib import Path
import hashlib,json

def sha(p):
    h=hashlib.sha256()
    with open(p,'rb') as f:
        for c in iter(lambda:f.read(1024*1024),b''): h.update(c)
    return h.hexdigest()

def main():
    root=Path(__file__).resolve().parents[1]; files=[]
    for p in sorted(root.rglob('*')):
        if not p.is_file() or p.name=='MANIFEST.json': continue
        files.append({'path':p.relative_to(root).as_posix(),'sha256':sha(p),'bytes':p.stat().st_size})
    data={'package':'SABIK_VISUAL_FAMILY_FINAL_V1_R1','date':'2026-09-20','status':'SABIK_VISUAL_FAMILY_FINAL_V1_R1_READY','manifest_excludes':['MANIFEST.json (self-reference)'],'file_count':len(files),'files':files}
    (root/'MANIFEST.json').write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    print(f'MANIFEST_PASS {len(files)} files')
if __name__=='__main__': main()
