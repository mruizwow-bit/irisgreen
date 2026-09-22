#!/usr/bin/env python3
import json,subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[2]
m=json.loads((root/"qa/sabik-web-r01/freeze-manifest-v1.json").read_text(encoding="utf-8"))
errors=[]
for item in m["artifacts"]:
    p=root/item["path"]
    if not p.is_file():
        errors.append("missing "+item["path"]); continue
    b=subprocess.check_output(["git","hash-object",str(p)],cwd=root,text=True).strip()
    if b!=item["blob_sha"]: errors.append(f"{item['path']}: {b} != {item['blob_sha']}")
print(json.dumps({"checked":len(m["artifacts"]),"errors":errors},indent=2))
raise SystemExit(1 if errors else 0)
