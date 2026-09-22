#!/usr/bin/env python3
import hashlib,json
from pathlib import Path
root=Path(__file__).resolve().parents[2]
manifest=json.loads((root/'qa/w02-r1/freeze-manifest-v1.json').read_text(encoding='utf-8'))
errors=[]
for item in manifest['artifacts']:
    p=root/item['path']
    if not p.is_file():
        errors.append(f"missing {item['path']}")
        continue
    sha=hashlib.sha256(p.read_bytes()).hexdigest()
    if sha!=item['sha256']:
        errors.append(f"{item['path']}: sha256 {sha} != {item['sha256']}")
print(json.dumps({'checked':len(manifest['artifacts']),'errors':errors},indent=2))
raise SystemExit(1 if errors else 0)
