#!/usr/bin/env python3
import json, pathlib, re, sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
def fail(msg): print("FAIL:",msg); raise SystemExit(1)
es=json.loads((ROOT/"assets/data/r40-interests.es.json").read_text(encoding="utf-8"))
en=json.loads((ROOT/"assets/data/r40-interests.en.json").read_text(encoding="utf-8"))
routes=json.loads((ROOT/"assets/data/r40-interest-routes.json").read_text(encoding="utf-8"))["routes"]
if len(es["groups"])!=11 or len(en["groups"])!=11: fail("groups")
if len(es["interests"])!=72 or len(en["interests"])!=72: fail("interests")
if sum(x["availability"]=="ready" for x in es["interests"])!=43: fail("ready count")
if sum(x["availability"]=="source-review" for x in es["interests"])!=29: fail("review count")
if set(x["id"] for x in es["interests"])!=set(x["id"] for x in en["interests"]): fail("ES/EN ids")
for lang,data in [("es",es),("en",en)]:
  for x in data["interests"]:
    p=ROOT/(x["route"].lstrip("/")+"index.html")
    if not p.exists(): fail("missing "+str(p))
    t=p.read_text(encoding="utf-8")
    for anchor in ['id="explorar"','id="catalogo"','id="experiencia"','id="coleccion"','id="taller"','id="fuentes"']:
      if anchor not in t: fail(f"{x['id']} missing {anchor}")
    if x["availability"]=="source-review" and ("Fuente en revisión" not in t and "Source under review" not in t): fail(x["id"]+" review message")
for p in [ROOT/"es/intereses/index.html",ROOT/"en/interests/index.html"]:
  t=p.read_text(encoding="utf-8")
  if t.count("r40-group-card")!=11: fail("index group cards")
  if "data-r40-search" not in t: fail("search")
for p in [ROOT/"es/intereses/cuaderno-de-campo/index.html",ROOT/"en/interests/field-notebook/index.html"]:
  t=p.read_text(encoding="utf-8")
  for token in ["REAL_DATA","SIMULATION","USER_CREATED","FICTIONAL","data-field-place","data-field-month","data-field-hour","data-field-category","data-field-museum","data-field-diary","data-field-corner"]:
    if token not in t: fail("field notebook "+token)
for path in ["assets/r40-interests.js","assets/r40-field-notebook.js"]:
  t=(ROOT/path).read_text(encoding="utf-8")
  if "localStorage" in t or "sessionStorage" in t: fail(path+" owns persistence")
  if re.search(r'https?://',t): fail(path+" external network literal")
print("PASS R40-A4 static contract: 72/72 interests, 11 groups, 43 ready, 29 source-review, ES/EN routes and Field Notebook")
