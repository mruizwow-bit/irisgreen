#!/usr/bin/env python3
from pathlib import Path
import hashlib, json, zipfile, shutil, re, sys

ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/"prototypes"/"construction-playable-r01"
OUT=ROOT/"artifacts"/"construction-playable-r01"
ZIP=ROOT/"PRISMA_CONSTRUCTION_PLAYABLE_R01.zip"
SHA=ROOT/"PRISMA_CONSTRUCTION_PLAYABLE_R01.sha256"

FILES=["juegos.html","game.css","game.js","README.md","QA_PRISMA.json"]
if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir(parents=True)

for name in FILES:
    src=SRC/name
    if not src.is_file():
        raise SystemExit(f"Missing source: {src}")
    shutil.copy2(src,OUT/name)

html=(OUT/"juegos.html").read_text(encoding="utf-8")
js=(OUT/"game.js").read_text(encoding="utf-8")
css=(OUT/"game.css").read_text(encoding="utf-8")
all_text="\n".join([html,js,css])

if re.search(r'https?://',all_text,re.I):
    raise SystemExit("External network URL found")
if "fetch(" in js or "XMLHttpRequest" in js:
    raise SystemExit("Network runtime found")
for required in [
    'id="scene"','id="build-mode"','id="roam-mode"',
    'id="place-btn"','id="remove-btn"','id="undo-btn"',
    'id="motion"','id="start-dialog"'
]:
    if required not in html:
        raise SystemExit(f"Missing HTML contract: {required}")
for required in [
    "routePlatformSupported","validatePlacement","removeAtCursor",
    "undo()","saveGame","localStorage","stairsUnlocked","freeMode",
    "__IG_CONSTRUCTION_QA__"
]:
    if required not in js:
        raise SystemExit(f"Missing JS contract: {required}")
if '[hidden]{display:none!important}' not in css:
    raise SystemExit("Hidden contract missing")

manifest={
    "schema":"iris-green.prisma.construction-playable-r01.v1",
    "date":"2026-10-05",
    "entry":"juegos.html",
    "offline_file_open":True,
    "network_dependencies":False,
    "source_order_comment":5996165622,
    "gate":"PRISMA_CONSTRUCTION_PLAYABLE_R01_READY_FOR_AXIOMA",
    "files":[]
}
for p in sorted(OUT.iterdir()):
    manifest["files"].append({
        "name":p.name,
        "bytes":p.stat().st_size,
        "sha256":hashlib.sha256(p.read_bytes()).hexdigest()
    })
(OUT/"manifest.json").write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")

with zipfile.ZipFile(ZIP,"w",zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in sorted(OUT.iterdir()):
        zi=zipfile.ZipInfo(p.name,date_time=(2026,10,5,16,0,0))
        zi.compress_type=zipfile.ZIP_DEFLATED
        z.writestr(zi,p.read_bytes())
with zipfile.ZipFile(ZIP) as z:
    bad=z.testzip()
    if bad:
        raise SystemExit(f"Corrupt ZIP member: {bad}")
    names=set(z.namelist())
    for required in ["juegos.html","game.css","game.js","manifest.json","README.md","QA_PRISMA.json"]:
        if required not in names:
            raise SystemExit(f"Missing ZIP member {required}")

sha=hashlib.sha256(ZIP.read_bytes()).hexdigest()
SHA.write_text(f"{sha}  {ZIP.name}\n",encoding="utf-8")
print(f"ZIP={ZIP}")
print(f"SHA256={sha}")
print(f"FILES={len(list(OUT.iterdir()))}")
print("PACKAGE_QA=PASS")
