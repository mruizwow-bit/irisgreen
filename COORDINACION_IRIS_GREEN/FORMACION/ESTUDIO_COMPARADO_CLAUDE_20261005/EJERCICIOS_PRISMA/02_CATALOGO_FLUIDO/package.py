#!/usr/bin/env python3
from pathlib import Path
import hashlib, json, shutil, zipfile

HERE=Path(__file__).resolve().parent
ROOT=Path(__file__).resolve().parents[5]
OUT=HERE/"portable"
ZIP=HERE/"PRISMA_EJERCICIO_CATALOGO_FLUIDO_R01.zip"
if OUT.exists(): shutil.rmtree(OUT)
OUT.mkdir()
for name in ("index.html","cielo.html","app.js","catalogo-data.js","styles.css"):
    shutil.copy2(HERE/name,OUT/name)

fonts=OUT/"fonts"; fonts.mkdir()
for name in (
  "atkinson-hyperlegible-latin-400-normal.woff2",
  "atkinson-hyperlegible-latin-700-normal.woff2",
  "newsreader-latin-wght-normal.woff2",
):
    shutil.copy2(ROOT/"assets"/"fonts"/name,fonts/name)

css=(OUT/"styles.css").read_text(encoding="utf-8")
css=css.replace("../../../../../assets/fonts/","fonts/")
(OUT/"styles.css").write_text(css,encoding="utf-8")
if "../../../../../" in css or "http://" in css or "https://" in css:
    raise SystemExit("portable conserva dependencia externa o de repo")

manifest={"entry":"index.html","source_of_catalog":"catalogo-data.js","files":[]}
for p in sorted(x for x in OUT.rglob("*") if x.is_file()):
    manifest["files"].append({"path":p.relative_to(OUT).as_posix(),"sha256":hashlib.sha256(p.read_bytes()).hexdigest()})
(OUT/"manifest.json").write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")

with zipfile.ZipFile(ZIP,"w",zipfile.ZIP_DEFLATED) as z:
    for p in sorted(x for x in OUT.rglob("*") if x.is_file()):
        z.write(p,p.relative_to(OUT))
with zipfile.ZipFile(ZIP) as z:
    assert z.testzip() is None
print("PACKAGE",ZIP)
print("SHA256",hashlib.sha256(ZIP.read_bytes()).hexdigest())
print("FILES",len([p for p in OUT.rglob("*") if p.is_file()]))
