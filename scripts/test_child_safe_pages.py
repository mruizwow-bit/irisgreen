#!/usr/bin/env python3
from __future__ import annotations
import argparse, json, re
from pathlib import Path

IDS=("global-188","global-200","global-212","global-224","global-237","global-320","global-360","global-395","library-022","library-057")
ROUTES=(
"es/neurodiversidad/condiciones/abuso-y-explotacion/index.html","en/neurodiversity/conditions/abuse-and-exploitation/index.html",
"es/neurodiversidad/condiciones/anorexia-nerviosa/index.html","en/neurodiversity/conditions/anorexia-nervosa/index.html",
"es/neurodiversidad/condiciones/trastorno-por-atracon/index.html","en/neurodiversity/conditions/binge-eating-disorder/index.html",
"es/neurodiversidad/condiciones/bulimia-nerviosa/index.html","en/neurodiversity/conditions/bulimia-nervosa/index.html",
"es/neurodiversidad/condiciones/trastornos-de-la-conducta-alimentaria-tca/index.html","en/neurodiversity/conditions/eating-disorders/index.html",
"es/neurodiversidad/condiciones/otros-trastornos-alimentarios-especificados-osfed/index.html","en/neurodiversity/conditions/other-specified-feeding-or-eating-disorder-osfed/index.html",
"es/neurodiversidad/condiciones/tept-trastorno-por-estres-postraumatico/index.html","en/neurodiversity/conditions/ptsd-post-traumatic-stress-disorder/index.html",
"es/neurodiversidad/condiciones/tept-complejo/index.html","en/neurodiversity/conditions/complex-ptsd/index.html",
"es/biblioteca/arfid-tca-y-pica-cuando-el-apoyo-cotidiano-necesita-atencion-clinica/index.html","en/everyday-life/arfid-eating-disorders-and-pica-when-everyday-support-needs-clinical-care/index.html",
"es/biblioteca/abuso-explotacion-y-relaciones-seguras/index.html","en/everyday-life/abuse-exploitation-and-safe-relationships/index.html",
)

def main():
 ap=argparse.ArgumentParser();ap.add_argument("--root",type=Path,required=True);a=ap.parse_args();root=a.root.resolve()
 present=[]
 for i,cid in enumerate(IDS):
  es_rel=ROUTES[i*2];en_rel=ROUTES[i*2+1]
  es_exists=(root/es_rel).is_file();en_exists=(root/en_rel).is_file()
  assert es_exists==en_exists,(cid,es_exists,en_exists)
  if not es_exists:
   continue
  present.append(cid)
  for rel in (es_rel,en_rel):
   p=root/rel
   s=p.read_text(encoding="utf-8")
   assert 'data-ig-s2-shell="true"' in s,rel
   assert 'data-ig-s2-safe' in s,rel
   assert 'data-ig-audience-select' in s,rel
   assert '/assets/ig-child-safety.js?v=r42-child-1' in s,rel
   assert '/assets/ig-child-safety-content.js?v=r42-child-1' in s,rel
   assert not re.search(r'data-ig-s2-full(?:\\s|=|>)',s),rel
   assert '<link rel="preload"' not in s.lower() or '/assets/content/full/' not in s,rel
  for lang in ("es","en"):
   p=root/f"assets/content/full/{cid}.{lang}.json";assert p.is_file(),p
   data=json.loads(p.read_text(encoding="utf-8"))
   assert data["content_id"]==cid and data["lang"]==lang
   assert isinstance(data["html"],str) and "<h1" in data["html"].lower()
 assert present,'No audited S2 route pair was found'
 controller=(root/"assets/ig-child-safety-content.js").read_text(encoding="utf-8")
 assert "data-ig-load-full" in controller
 assert "explicitAction:true" in controller
 assert "fetch('/assets/content/full/'" in controller
 assert "prefetch" not in controller.lower() and "preload" not in controller.lower()
 print("R42_CHILD_SAFE_DEEP_LINKS_PASS",{"present_ids":len(present),"audited_ids":len(IDS)})

if __name__=="__main__":main()
