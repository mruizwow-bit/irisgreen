#!/usr/bin/env python3
from pathlib import Path
import hashlib, json

LOCKS = (
    ('R1_VISUAL_ASSET_LOCK.json', 'R1_VISUAL_ASSET_LOCK_PASS'),
    ('R2_WORDMARK_VISUAL_LOCK.json', 'R2_WORDMARK_VISUAL_LOCK_PASS'),
    ('SYSTEM_CONTENT_LOCK.json', 'SYSTEM_CONTENT_LOCK_PASS'),
)

def sha(p):
    h=hashlib.sha256()
    with open(p,'rb') as f:
        for c in iter(lambda:f.read(1024*1024),b''): h.update(c)
    return h.hexdigest()

def main():
    root=Path(__file__).resolve().parents[1]
    failed=[]
    for filename,label in LOCKS:
        data=json.loads((root/'tests'/filename).read_text(encoding='utf-8'))
        mismatches=[]
        for item in data['files']:
            p=root/item['path']
            if not p.is_file() or p.stat().st_size!=item['bytes'] or sha(p)!=item['sha256']:
                mismatches.append(item['path'])
        if mismatches:
            failed.extend(mismatches)
            print(f'{label.replace("PASS","FAIL")} {len(mismatches)} mismatches')
        else:
            print(f'{label} {data["locked_file_count"]} files')
    if failed:
        print('VISUAL_LOCKS_FAIL')
        raise SystemExit(1)
    print('VISUAL_LOCKS_PASS')

if __name__=='__main__': main()
