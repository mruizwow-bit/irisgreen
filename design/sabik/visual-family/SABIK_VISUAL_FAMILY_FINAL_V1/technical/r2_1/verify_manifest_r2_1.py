#!/usr/bin/env python3
from pathlib import Path
import hashlib, json

def sha(p):
    h=hashlib.sha256()
    with open(p,'rb') as f:
        for c in iter(lambda:f.read(1024*1024),b''): h.update(c)
    return h.hexdigest()

def main():
    root=Path(__file__).resolve().parents[1]
    manifest=json.loads((root/'MANIFEST.json').read_text(encoding='utf-8'))
    listed={i['path']:i for i in manifest['files']}
    actual={p.relative_to(root).as_posix():p for p in root.rglob('*') if p.is_file() and p.name!='MANIFEST.json'}
    missing=sorted(set(listed)-set(actual)); extra=sorted(set(actual)-set(listed)); bad=[]
    for rel in sorted(set(listed)&set(actual)):
        p=actual[rel]; i=listed[rel]
        if p.stat().st_size!=i['bytes'] or sha(p)!=i['sha256']: bad.append(rel)
    ok=(not missing and not extra and not bad and manifest.get('file_count')==len(actual) and manifest.get('package')=='SABIK_VISUAL_FAMILY_FINAL_V1_R2_1')
    if not ok:
        print(f'MANIFEST_R2_1_VERIFY_FAIL missing={len(missing)} extra={len(extra)} bad_hash={len(bad)}')
        raise SystemExit(1)
    print(f'MANIFEST_R2_1_VERIFY_PASS {len(actual)} files')

if __name__=='__main__': main()
