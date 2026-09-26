#!/usr/bin/env python3
import json, re, subprocess
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
A2_FREEZE="52e5f9f02184581a1bfb1878c388ede3d1068c47"

def parse_var(path, marker, end):
    text=(ROOT/path).read_text(encoding="utf-8")
    return json.loads(text.split(marker,1)[1].split(end,1)[0])

games=parse_var("assets/data/juegos-iris-data.js","var G=",";G.pictos=")
baseline_text=subprocess.check_output(["git","show",f"{A2_FREEZE}:assets/data/juegos-iris-data.js"],cwd=ROOT,text=True)
baseline=json.loads(baseline_text.split("var G=",1)[1].split(";G.pictos=",1)[0])
assert len(baseline["juegos"])==252
assert len(games["juegos"])==297
assert games["juegos"][:252]==baseline["juegos"], "the frozen 252-game baseline changed"
assert len({j["s"] for j in games["juegos"]})==297

new=[j for j in games["juegos"] if j.get("r40",{}).get("batch")=="R40-A1-45"]
assert len(new)==45
contexts=[c["id"] for c in games["cats"] if c["id"]!="todos"]
types=[t["id"] for t in games["tipos"]]
assert len(contexts)==9 and len(types)==5
assert {(j["r40"]["context"],j["r40"]["type"]) for j in new}=={(c,t) for c in contexts for t in types}

def n(s):
    import unicodedata
    return " ".join("".join(ch for ch in unicodedata.normalize("NFD",s or "") if unicodedata.category(ch)!="Mn").lower().split())

titles=[n(j["t"]["es"]) for j in games["juegos"]]
pairs=[n(j["t"]["es"])+"|"+n(j["d"]["es"]) for j in games["juegos"]]
assert len(set(titles))==297
assert len(set(pairs))==297
assert all(j["t"].get("es") and j["t"].get("en") and j["d"].get("es") and j["d"].get("en") for j in games["juegos"])
assert any("ado" in (j.get("e") or []) for j in games["juegos"])
assert any("adu" in (j.get("e") or []) for j in games["juegos"])
assert any("todas" in (j.get("e") or []) for j in games["juegos"])

meta_text=(ROOT/"assets/data/juegos-iris-meta-r42.js").read_text(encoding="utf-8")
meta=json.loads(meta_text.split("window.IG_JUEGOS_META_R42=",1)[1].rstrip().rstrip(";"))
assert meta["count"]==297 and len(meta["games"])==297
assert {x["id"] for x in meta["games"]}=={j["s"] for j in games["juegos"]}
assert set(meta["skills"])=={"secuenciacion","decision","clasificacion","planificacion","memoria_visual","gestion_tiempo","asociacion","atencion_visual","seguimiento"}
assert set(meta["durations"])=={"breve","media"}
assert all(x["stages"] and x["context"] and x["activity_type"] and x["skill"] and x["duration_band"] for x in meta["games"])

# Syntax and play-first mechanics.
subprocess.run(["node","--check",str(ROOT/"assets/juegos-iris.js")],check=True,cwd=ROOT)
js=(ROOT/"assets/juegos-iris.js").read_text(encoding="utf-8")
for needle in [
    "jg-context-grid","map(contextoCard)","if(S.cat==='todos'&&!q)",
    "jg-r41-app jg-family-","jg-play jg-workspace",
    'popovertarget="jg-filter-pop"','popovertarget="jg-game-tools"',
    "S.habilidad","S.duracion","META.skills","META.durations",
    'draggable="true"','data-drag-current="true"',"dragstart","drop",
    "document.startViewTransition","prefers-reduced-motion: reduce"
]:
    assert needle in js, needle

css=(ROOT/"assets/juegos-iris.css").read_text(encoding="utf-8")
for needle in [
    "container-type:inline-size","@container",".jg-workspace",
    ".jg-family-ordenar",".jg-family-elegir",".jg-family-clasificar",
    ".jg-family-planificar",".jg-family-memoria",
    "@media(max-width:42rem)","position:fixed",
    "@media(prefers-reduced-motion:reduce)","@media(forced-colors:active)",
    "view-transition-name:ig-games-stage"
]:
    assert needle in css, needle

# Printable routines: current valid library exceeds the brief minimum.
routines=parse_var("assets/data/rutinas-imprimibles-data.js","var P=",";P.pictos=")
assert len(routines["packs"])==109 and len(routines["packs"])>=92
assert len({p["s"] for p in routines["packs"]})==109
assert all(p["t"].get("es") and p["t"].get("en") for p in routines["packs"])
assert any("ado" in (p.get("e") or []) for p in routines["packs"])
assert any("adu" in (p.get("e") or []) for p in routines["packs"])
assert routines["marca"]=="IRIS GREEN · irisgreen.eu"
assert "Mulberry Symbols" in routines["atrib"]["es"] and "Mulberry Symbols" in routines["atrib"]["en"]

subprocess.run(["node","--check",str(ROOT/"assets/rutinas-imprimibles.js")],check=True,cwd=ROOT)
rjs=(ROOT/"assets/rutinas-imprimibles.js").read_text(encoding="utf-8")
for needle in [
    "data-download","downloadId","fileDataUrl","URL.createObjectURL",
    "self", "U.licencia","U.etapa","U.contexto","IRIS GREEN · irisgreen.eu"
]:
    if needle=="IRIS GREEN · irisgreen.eu":
        assert needle in (ROOT/"assets/data/rutinas-imprimibles-data.js").read_text(encoding="utf-8")
    else:
        assert needle in rjs, needle
assert "window.print()" in rjs

manifest=json.loads((ROOT/"assets/data/r42-routines-pictogram-manifest.json").read_text(encoding="utf-8"))
assert manifest["routine_count"]==109
assert manifest["unique_pictogram_count"]==498
assert manifest["mulberry_authority"]["release"]=="v3.6.1"
assert manifest["mulberry_authority"]["commit"]=="9cbab9f400c5de44e2bc58839cca07294aadb086"
assert manifest["mulberry_authority"]["license"]=="CC BY-SA 4.0"
assert all(r["public_outputs"]["print_save_pdf"] and r["public_outputs"]["self_contained_html_download"] for r in manifest["routines"])

# ES/EN bindings and real Downloads hub.
for rel in ("es/recursos/juegos/index.html","en/resources/games/index.html"):
    h=(ROOT/rel).read_text(encoding="utf-8")
    assert "juegos-iris-meta-r42.js?v=r42-a1" in h
    assert "juegos-iris.js?v=r42-a1" in h
    assert "juegos-iris.css?v=r42-a1" in h
for rel in ("es/recursos/rutinas-imprimibles/index.html","en/resources/printable-routines/index.html"):
    h=(ROOT/rel).read_text(encoding="utf-8")
    assert "rutinas-imprimibles.js?v=r42-a1" in h
    assert "rutinas-imprimibles.css?v=r42-a1" in h
for rel in ("es/recursos/descargas/index.html","en/resources/downloads/index.html"):
    h=(ROOT/rel).read_text(encoding="utf-8")
    assert "109" in h
    assert "IRIS GREEN · irisgreen.eu" in h

esres=(ROOT/"es/recursos/index.html").read_text(encoding="utf-8")
enres=(ROOT/"en/resources/index.html").read_text(encoding="utf-8")
assert "/es/recursos/descargas/" in esres and "/en/resources/downloads/" in enres

# Internal vocabulary must not leak into R42 public surfaces.
for rel in (
    "es/recursos/index.html","en/resources/index.html",
    "es/recursos/juegos/index.html","en/resources/games/index.html",
    "es/recursos/rutinas-imprimibles/index.html","en/resources/printable-routines/index.html",
    "es/recursos/descargas/index.html","en/resources/downloads/index.html"
):
    h=(ROOT/rel).read_text(encoding="utf-8").lower()
    for forbidden in ("b0","b1","piloto","pilot b1","427/427","mapeo interno","qa id"):
        assert forbidden not in h, (rel,forbidden)

print(json.dumps({
    "status":"PASS",
    "games":{"baseline":252,"new":45,"total":297,"exact_title_duplicates":0,"matrix":"9x5"},
    "game_filters":["stage","context","skill","duration","activity_type"],
    "routines":{"total":109,"minimum_required":92,"direct_file_download":True,"print_save_pdf":True},
    "languages":["es","en"],
    "mulberry":{"release":"v3.6.1","commit":"9cbab9f400c5de44e2bc58839cca07294aadb086","license":"CC BY-SA 4.0"}
},ensure_ascii=False,indent=2))
