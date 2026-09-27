#!/usr/bin/env python3
from __future__ import annotations
import argparse,json,re
from pathlib import Path
S2={5:"research-005",36:"research-036",37:"research-037",45:"research-045",46:"research-046",71:"research-071"}
def main():
 ap=argparse.ArgumentParser();ap.add_argument("--root",type=Path,required=True);a=ap.parse_args();root=a.root.resolve()
 data=json.loads((root/"es/investigacion/estudios-textos.json").read_text(encoding="utf-8"))
 nums={int(r.get("n",0)) for r in data}
 assert not (nums & set(S2)), nums & set(S2)
 split=json.loads((root/"assets/content-safety/research-split.json").read_text(encoding="utf-8"))
 assert split["safe_records"]==len(data)
 assert split["full_records"]==len(data)+6
 assert split["s2_studies"]==sorted(S2)
 for n,cid in S2.items():
  for lang in ("es","en"):
   p=root/f"assets/content/full/{cid}.{lang}.json";assert p.is_file(),p
   row=json.loads(p.read_text(encoding="utf-8"))
   assert row["study"]==n and row["content_id"]==cid and row["lang"]==lang
 page=(root/"es/investigacion/index.html").read_text(encoding="utf-8")
 assert "/assets/ig-child-safety-research.js?v=r42-child-1" in page
 assert "/assets/ig-child-safety.js?v=r42-child-1" in page
 assert "<noscript>" in page
 for title in ("Pensamientos y conductas suicidas en personas autistas","Riesgo de autolesión y suicidabilidad en personas autistas"):
  assert title not in re.search(r'<noscript\b[^>]*>.*?</noscript>',page,re.I|re.S).group(0)
 controller=(root/"assets/ig-child-safety-research.js").read_text(encoding="utf-8")
 assert "explicitAction:true" in controller and "fetch('/assets/content/full/'" in controller
 assert "prefetch" not in controller.lower() and "preload" not in controller.lower()
 print("R42_CHILD_SAFE_RESEARCH_PASS")
if __name__=="__main__":main()
