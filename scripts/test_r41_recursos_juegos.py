#!/usr/bin/env python3
import json
import re
import subprocess
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
R40_BASE="52e5f9f02184581a1bfb1878c388ede3d1068c47"
R40_FUNCTIONAL="ea8d309e77fd1ade0c1315e650cb85ec24d8e60c"

def parse_data(text):
    return json.loads(text.split("var G=",1)[1].split(";G.pictos=",1)[0])

# 1) Keep the complete functional dataset from #261 untouched.
current=(ROOT/"assets/data/juegos-iris-data.js").read_bytes()
prior=subprocess.check_output(["git","show",f"{R40_FUNCTIONAL}:assets/data/juegos-iris-data.js"],cwd=ROOT)
assert current==prior, "R41 must not rewrite the 297-game dataset"

data=parse_data(current.decode("utf-8"))
baseline=parse_data(subprocess.check_output(
    ["git","show",f"{R40_BASE}:assets/data/juegos-iris-data.js"],cwd=ROOT,text=True
))
assert len(baseline["juegos"])==252
assert len(data["juegos"])==297
assert data["juegos"][:252]==baseline["juegos"]
new=[j for j in data["juegos"] if j.get("r40",{}).get("batch")=="R40-A1-45"]
assert len(new)==45

contexts=[c["id"] for c in data["cats"] if c["id"]!="todos"]
types=[t["id"] for t in data["tipos"]]
assert len(contexts)==9
assert types==["ordenar","elegir","clasificar","planificar","memoria"]
assert {(j["r40"]["context"],j["r40"]["type"]) for j in new}=={(c,t) for c in contexts for t in types}

# 2) JS syntax + play-first shell.
subprocess.run(["node","--check",str(ROOT/"assets/juegos-iris.js")],check=True,cwd=ROOT)
js=(ROOT/"assets/juegos-iris.js").read_text(encoding="utf-8")
for needle in [
    "jg-context-grid",
    "jg-context-card",
    "jg-r41-browser",
    'popovertarget="jg-filter-pop"',
    "jg-r41-app jg-family-",
    "jg-play jg-workspace",
    'popovertarget="jg-game-tools"',
    'draggable="true"',
    'data-drag-current="true"',
    "dragstart",
    "drop",
]:
    assert needle in js, needle

# Initial state is context-first; the 297-card list is only produced after context/search.
assert "if(S.cat==='todos'&&!q)" in js
assert "D.cats.filter(function(c){return c.id!=='todos';}).map(contextoCard)" in js
assert "vis.map(function(o){return gameCard(o,cats);})" in js

# 3) Distinct visual language for each new family and mobile/product gates.
css=(ROOT/"assets/juegos-iris.css").read_text(encoding="utf-8")
for family in types:
    assert f".jg-family-{family}" in css
for needle in [
    "container-type:inline-size",
    "@container",
    ".jg-workspace",
    "min-height:min(68vh,43rem)",
    ".jg-filter-pop",
    "@media(max-width:42rem)",
    "position:fixed",
    "@media(prefers-reduced-motion:reduce)",
    "@media(forced-colors:active)",
]:
    assert needle in css, needle

# 4) Resources is a visual hub, with Games visually dominant and secondary exploration reduced.
resources_css=(ROOT/"assets/recursos-iris.css").read_text(encoding="utf-8")
for needle in [
    ".ri-grid-primary>li:first-child",
    "grid-column:span 8",
    ".ri-grid-explore{display:flex",
    "@media(prefers-reduced-motion:reduce)",
]:
    assert needle in resources_css, needle

# 5) ES/EN pages bind the R41 assets, not cached R40 shell assets.
for rel in [
    "es/recursos/index.html",
    "en/resources/index.html",
    "es/recursos/juegos/index.html",
    "en/resources/games/index.html",
]:
    html=(ROOT/rel).read_text(encoding="utf-8")
    if "/recursos/juegos/" in rel or "/resources/games/" in rel:
        assert "/assets/juegos-iris.css?v=r41-a1" in html
        assert "/assets/juegos-iris.js?v=r41-a1" in html
        assert "/assets/data/juegos-iris-data.js?v=r41-a1" in html
    else:
        assert "/assets/recursos-iris.css?v=r41-a1" in html

# 6) The legacy/new functional regression from R40 must remain green.
subprocess.run(["python3","scripts/test_r40_recursos_juegos.py"],cwd=ROOT,check=True)

print(json.dumps({
    "status":"PASS",
    "baseline_games":252,
    "new_games":45,
    "total_games":297,
    "contexts":9,
    "types":types,
    "play_first":True,
    "context_first":True,
    "workspace_first":True,
    "popover_secondary_actions":True,
    "drag_plus_keyboard":True,
    "dataset_unchanged_from_r40_functional":True
},ensure_ascii=False,indent=2))
