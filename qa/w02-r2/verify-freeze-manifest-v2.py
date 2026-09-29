#!/usr/bin/env python3
import json,subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[2]
manifest=json.loads((root/'qa/w02-r2/freeze-manifest-v2.json').read_text(encoding='utf-8'))
errors=[]
for item in manifest['artifacts']:
    p=root/item['path']
    if not p.is_file():
        errors.append(f"missing {item['path']}")
        continue
    blob=subprocess.check_output(['git','hash-object',str(p)],cwd=root,text=True).strip()
    if blob!=item['blob_sha']:
        errors.append(f"{item['path']}: blob {blob} != {item['blob_sha']}")
print(json.dumps({'checked':len(manifest['artifacts']),'errors':errors},indent=2))
raise SystemExit(1 if errors else 0)
