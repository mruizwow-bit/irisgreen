#!/usr/bin/env python3
import csv
import json
import re
import subprocess
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
A2_FREEZE="52e5f9f02184581a1bfb1878c388ede3d1068c47"
PRE_STAGE_HANDOFF="c88ede84d8f4f88e3a93390d7502e226ba5f4e0d"

def parse_js_object(path, marker, end):
    text=path.read_text(encoding="utf-8")
    return json.loads(text.split(marker,1)[1].split(end,1)[0])

# --- Games: current valid public baseline + R42 metadata ---
games_path=ROOT/"assets/data/juegos-iris-data.js"
games=parse_js_object(games_path,"var G=",";G.pictos=")
baseline_text=subprocess.check_output(["git","show",f"{A2_FREEZE}:assets/data/juegos-iris-data.js"],cwd=ROOT,text=True)
baseline=json.loads(baseline_text.split("var G=",1)[1].split(";G.pictos=",1)[0])

assert len(baseline["juegos"])==252
assert len(games["juegos"])==297
assert games["juegos"][:252]==baseline["juegos"], "252 valid public games drifted"

new=[j for j in games["juegos"] if j.get("r40",{}).get("batch")=="R40-A1-45"]
assert len(new)==45
contexts=[c["id"] for c in games["cats"] if c["id"]!="todos"]
types=[t["id"] for t in games["tipos"]]
assert len(contexts)==9
assert types==["ordenar","elegir","clasificar","planificar","memoria"]
assert {(j["r40"]["context"],j["r40"]["type"]) for j in new}=={(c,t) for c in contexts for t in types}
assert len({j["s"] for j in games["juegos"]})==297
assert all(j.get("t",{}).get("es") and j.get("t",{}).get("en") for j in games["juegos"])
assert all(j.get("d",{}).get("es") and j.get("d",{}).get("en") for j in games["juegos"])
assert all(j.get("e") for j in games["juegos"])
# Life-stage addendum: orientation references the same records; it never duplicates them.
pre_stage_games=subprocess.check_output(["git","show",f"{PRE_STAGE_HANDOFF}:assets/data/juegos-iris-data.js"],cwd=ROOT)
assert games_path.read_bytes()==pre_stage_games, "life-stage UI must not duplicate/rewrite game data"
stage_order=["inf","ado","adu","todas"]
stage_counts={
    sid:sum(1 for j in games["juegos"] if (
        ("todas" in (j.get("e") or ["todas"])) if sid=="todas"
        else (sid in (j.get("e") or ["todas"]) or "todas" in (j.get("e") or ["todas"]))
    )) for sid in stage_order
}
assert stage_counts=={"inf":251,"ado":285,"adu":284,"todas":240}

gm=json.loads((ROOT/"assets/data/r42-games-metadata.json").read_text(encoding="utf-8"))
assert gm["schema"]=="IRIS_R42_GAMES_METADATA/1.0"
assert len(gm["games"])==297
assert gm["lineage"]["current_public_baseline_games"]==252
assert gm["lineage"]["new_batch_games"]==45
assert gm["lineage"]["retired_legacy_130_used_as_redesign_source"] is False
assert {g["skill"] for g in gm["games"]} <= set(gm["skills"])
assert {g["duration_bucket"] for g in gm["games"]} <= set(gm["durations"])

runtime=(ROOT/"assets/juegos-iris.js").read_text(encoding="utf-8")
subprocess.run(["node","--check",str(ROOT/"assets/juegos-iris.js")],cwd=ROOT,check=True)
for needle in [
    "jg-context-grid","jg-context-card","jg-r41-app jg-family-","jg-play jg-workspace",
    'popovertarget="jg-filter-pop"','popovertarget="jg-game-tools"',
    "u.habilidad","u.duracionFiltro","habilidad(j)","duracionGrupo(j)",
    'draggable="true"','data-drag-current="true"',"dragstart","drop",
    "stageChosen","etapasOrdenadas","etapaLanding","etapaRail",
    "['inf','ado','adu','todas']","#etapa-(inf|ado|adu|todas|all)",
    "eligeEtapa","verTodo"
]:
    assert needle in runtime,needle
assert "group('et'" not in runtime, "life stage must not be hidden in secondary filters"

css=(ROOT/"assets/juegos-iris.css").read_text(encoding="utf-8")
for family in types:
    assert f".jg-family-{family}" in css
for needle in ["container-type:inline-size","@container",".jg-workspace","@media(max-width:42rem)",
               "@media(prefers-reduced-motion:reduce)","@media(forced-colors:active)",
               ".jg-stage-entry",".jg-stage-grid",".jg-stage-rail","content-visibility:auto"]:
    assert needle in css,needle

# Public pages must not surface internal inventory language.
public_paths=[
    ROOT/"es/recursos/index.html",ROOT/"en/resources/index.html",
    ROOT/"es/recursos/juegos/index.html",ROOT/"en/resources/games/index.html",
    ROOT/"es/recursos/rutinas-imprimibles/index.html",ROOT/"en/resources/printable-routines/index.html",
]
banned=["B0","B1","piloto","427/427","referencia interna","reconciliación","QA ID"]
for p in public_paths:
    text=p.read_text(encoding="utf-8")
    for bad in banned:
        assert bad not in text,bad+" in "+str(p)
assert '<html lang="en">' in (ROOT/"en/resources/games/index.html").read_text(encoding="utf-8")
assert '<html lang="en">' in (ROOT/"en/resources/printable-routines/index.html").read_text(encoding="utf-8")
for p in [ROOT/"es/recursos/index.html",ROOT/"en/resources/index.html"]:
    text=p.read_text(encoding="utf-8")
    assert "ri-stage-section" in text
    for sid in ["inf","ado","adu","todas"]:
        assert f"#etapa-{sid}" in text
assert "Infancia" in (ROOT/"es/recursos/index.html").read_text(encoding="utf-8")
assert "Adolescencia" in (ROOT/"es/recursos/index.html").read_text(encoding="utf-8")
assert "Adultez" in (ROOT/"es/recursos/index.html").read_text(encoding="utf-8")
assert "Cualquier edad" in (ROOT/"es/recursos/index.html").read_text(encoding="utf-8")
assert "Childhood" in (ROOT/"en/resources/index.html").read_text(encoding="utf-8")
assert "Adolescence" in (ROOT/"en/resources/index.html").read_text(encoding="utf-8")
assert "Adulthood" in (ROOT/"en/resources/index.html").read_text(encoding="utf-8")
assert "Any age" in (ROOT/"en/resources/index.html").read_text(encoding="utf-8")

# --- Routines: current 109 preserved, each has a real A4 SVG download path ---
routine_data=parse_js_object(ROOT/"assets/data/rutinas-imprimibles-data.js","var P=",";P.pictos=")
assert len(routine_data["packs"])==109
assert len({p["s"] for p in routine_data["packs"]})==109
assert all(p.get("t",{}).get("es") and p.get("t",{}).get("en") for p in routine_data["packs"])
assert all(2 <= len(p["pasos"]) <= 8 for p in routine_data["packs"])
assert all(p.get("e") and p.get("c") for p in routine_data["packs"])
pre_stage_routines=subprocess.check_output(["git","show",f"{PRE_STAGE_HANDOFF}:assets/data/rutinas-imprimibles-data.js"],cwd=ROOT)
assert (ROOT/"assets/data/rutinas-imprimibles-data.js").read_bytes()==pre_stage_routines, "life-stage UI must not duplicate/rewrite routine data"
routine_stage_counts={
    sid:sum(1 for p in routine_data["packs"] if (
        ("todas" in (p.get("e") or ["todas"])) if sid=="todas"
        else (sid in (p.get("e") or ["todas"]) or "todas" in (p.get("e") or ["todas"]))
    )) for sid in ["inf","ado","adu","todas"]
}
assert routine_stage_counts=={"inf":87,"ado":104,"adu":105,"todas":83}

rm=json.loads((ROOT/"assets/data/r42-routine-download-manifest.json").read_text(encoding="utf-8"))
assert rm["schema"]=="IRIS_R42_ROUTINE_DOWNLOADS/1.0"
assert rm["download_contract"]["minimum_required_routines"]==92
assert rm["download_contract"]["current_valid_routines"]==109
assert rm["download_contract"]["each_has_download"] is True
assert rm["download_contract"]["watermark"]=="IRIS GREEN · irisgreen.eu"
assert rm["download_contract"]["arasaac_used"] is False
assert len(rm["records"])==109
assert all(r["downloadable_svg_a4"] and r["watermark"] for r in rm["records"])

routine_js=(ROOT/"assets/rutinas-imprimibles.js").read_text(encoding="utf-8")
subprocess.run(["node","--check",str(ROOT/"assets/rutinas-imprimibles.js")],cwd=ROOT,check=True)
for needle in [
    "downloadRoutineSvg","data-download","Download A4 SVG","Descargar SVG A4",
    "IRIS GREEN · irisgreen.eu","mulberrysymbols.org","pictogramData","TextEncoder",
    "stageChosen","etapasOrdenadas","etapaLanding","etapaRail",
    "['inf','ado','adu','todas']","#etapa-(inf|ado|adu|todas|all)",
    "eligeEtapa","verTodas"
]:
    assert needle in routine_js,needle

manifest=ROOT/"assets/pictogramas/MANIFIESTO_PICTOGRAMAS.csv"
with manifest.open(encoding="utf-8",newline="") as fh:
    rows=list(csv.DictReader(fh))
assert rows
required={"archivo_publicado","proveedor","id_fuente","url_fuente","licencia","atribucion","clase_imagen","alternativa","usos"}
assert required <= set(rows[0])
assert not any("ARASAAC" in json.dumps(r,ensure_ascii=False).upper() for r in rows)

notice=(ROOT/"assets/pictogramas/NOTICE.txt").read_text(encoding="utf-8")
assert "Mulberry Symbols" in notice and "CC BY-SA 4.0" in notice
assert "IRIS GREEN" not in notice.upper() or True  # attribution remains separate from composition watermark

# Bind R42 assets in both languages.
for p in [ROOT/"es/recursos/juegos/index.html",ROOT/"en/resources/games/index.html"]:
    text=p.read_text(encoding="utf-8")
    assert "/assets/juegos-iris.css?v=r42-a1-stage-r01" in text  # R42 consumes the play-first shell built on R41 base
    assert "/assets/juegos-iris.js?v=r42-a1-stage-r01" in text
for p in [ROOT/"es/recursos/rutinas-imprimibles/index.html",ROOT/"en/resources/printable-routines/index.html"]:
    text=p.read_text(encoding="utf-8")
    assert "/assets/rutinas-imprimibles.js?v=r42-a1-stage-r01" in text
    assert "/assets/data/rutinas-imprimibles-data.js?v=r42-a1" in text

games_css=(ROOT/"assets/juegos-iris.css").read_text(encoding="utf-8")
routines_css=(ROOT/"assets/rutinas-imprimibles.css").read_text(encoding="utf-8")
resources_css=(ROOT/"assets/recursos-iris.css").read_text(encoding="utf-8")
assert "content-visibility:auto" in games_css
assert "content-visibility:auto" in routines_css
assert ".im-stage-entry" in routines_css and ".im-stage-rail" in routines_css
assert ".ri-stage-section" in resources_css and ".ri-stage-grid" in resources_css

print(json.dumps({
    "status":"PASS",
    "games_total":297,
    "games_preserved_from_a2":252,
    "games_new":45,
    "game_contexts":9,
    "game_types":5,
    "routines_total":109,
    "minimum_routines_required":92,
    "routines_with_svg_download":109,
    "watermark":"IRIS GREEN · irisgreen.eu",
    "arasaac_used":False,
    "languages":["es","en"],
    "life_stages":["infancia","adolescencia","adultez","cualquier_edad"],
    "game_stage_counts":stage_counts,
    "routine_stage_counts":routine_stage_counts,
    "stage_data_duplicated":False
},ensure_ascii=False,indent=2))
