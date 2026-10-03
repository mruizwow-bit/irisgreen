from __future__ import annotations
import hashlib, json, os, sys
from pathlib import Path

ROOT = Path(os.environ.get("SABIKVOICE_ROOT", r"C:\Users\mruiz\SabikVoice"))
EXPECTED = {
  "es": ("SABIK_ES_R01_FINAL", "8100e9770471094efae26c186c9020056c35c55e9b0822aaec800f1affd1c291"),
  "en": ("SABIK_EN_R02_FINAL", "3aec07b84f81b199af25e170a044b51c96b54f9ec24ed4b77bc3a13b4f47e9df"),
}

def sha256(p: Path) -> str:
    h=hashlib.sha256()
    with p.open('rb') as f:
        for b in iter(lambda:f.read(8*1024*1024),b''): h.update(b)
    return h.hexdigest()

if not ROOT.is_dir():
    print(json.dumps({"gate":"R66_PRIVATE_ROOT_NOT_FOUND","root":str(ROOT)}));sys.exit(2)

candidates=[]
for p in ROOT.rglob("model.safetensors"):
    try:
        size=p.stat().st_size
        digest=sha256(p)
        candidates.append({"path":str(p),"size_bytes":size,"sha256":digest})
    except Exception as exc:
        candidates.append({"path":str(p),"error":type(exc).__name__})

found={}
for lang,(mid,expected) in EXPECTED.items():
    matches=[c for c in candidates if c.get("sha256")==expected]
    if len(matches)==1:
        found[lang]={"model_id":mid,**matches[0]}
    elif len(matches)>1:
        found[lang]={"model_id":mid,"ambiguous":matches}
    else:
        found[lang]={"model_id":mid,"match":None}

known_hints=[
 str(ROOT / "SABIK_EN_SFT_R02_EXACT" / "checkpoint-epoch-0" / "model.safetensors"),
 str(ROOT / "SABIK_EN_V1" / "model.safetensors"),
]
report={
 "gate":"R66_PRIVATE_MODEL_DISCOVERY",
 "root":str(ROOT),
 "expected":{k:{"model_id":v[0],"sha256":v[1]} for k,v in EXPECTED.items()},
 "found":found,
 "candidate_count":len(candidates),
 "known_hints":known_hints,
 "candidates":candidates,
}
print(json.dumps(report,ensure_ascii=False,indent=2))
if all(found[k].get("sha256")==EXPECTED[k][1] for k in EXPECTED):
    sys.exit(0)
sys.exit(3)
