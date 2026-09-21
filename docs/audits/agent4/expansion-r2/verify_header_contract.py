#!/usr/bin/env python3
"""W1-R2-A: prove the accepted Iris Green header/navigation architecture has not changed.

This test is intentionally read-only. It does not normalise or repair pages.
It compares representative pages and global UI assets with the accepted baseline,
then checks the functional source contract for navigation, Reading, Music, language,
keyboard/menu behaviour and responsive rules.
"""
from __future__ import annotations
import hashlib, json, re, sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[5]
MANIFEST_PATH=Path(__file__).with_name("architecture-baseline-manifest.json")
M=json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
errors=[]

def git_blob_sha(path: Path)->str:
    data=path.read_bytes()
    return hashlib.sha1(b"blob "+str(len(data)).encode()+b"\0"+data).hexdigest()

for rel,expected in M["files"].items():
    path=ROOT/rel
    if not path.is_file():
        errors.append(f"missing baseline file: {rel}")
        continue
    got=git_blob_sha(path)
    if got!=expected:
        errors.append(f"baseline drift: {rel}: {got} != {expected}")

ES_PAGES=[
 "es/recursos/index.html",
 "es/neurodiversidad/condiciones/autismo/index.html",
 "es/situaciones/necesito-que-me-repitan-las-instrucciones/index.html",
 "es/biblioteca/index.html",
 "es/datos/index.html",
 "es/sitio-tranquilo/index.html",
]
EN_PAGES=[
 "en/neurodiversity/conditions/autism/index.html",
 "en/situations/i-need-instructions-repeated/index.html",
 "en/everyday-life/index.html",
 "en/data/index.html",
 "en/quiet-space/index.html",
]
ES_DEST=[
 "/", "/es/neurodiversidad/condiciones/", "/es/situaciones/", "/es/biblioteca/",
 "/es/videos/", "/es/investigacion/", "/es/datos/", "/es/tramites/directorio/",
 "/es/libros/", "/es/intereses/", "/es/taller/", "/es/sitio-tranquilo/",
]
EN_DEST=[
 "/", "/en/neurodiversity/conditions/", "/en/situations/", "/en/everyday-life/",
 "/es/videos/", "/es/investigacion/", "/en/data/", "/es/tramites/directorio/",
 "/es/libros/", "/en/interests/", "/es/taller/", "/en/quiet-space/",
]

def header_of(text:str)->str:
    m=re.search(r"<header\b[\s\S]*?</header>",text,re.I)
    return m.group(0) if m else ""

def check_page(rel:str,dests:list[str],other_lang:str):
    text=(ROOT/rel).read_text(encoding="utf-8")
    header=header_of(text)
    if not header:
        errors.append(rel+": header missing"); return
    for dest in dests:
        if f'href="{dest}"' not in header:
            errors.append(rel+": nav destination missing "+dest)
    if 'id="a11yBtn"' not in header:
        errors.append(rel+": Reading control missing")
    if 'id="plBtn"' not in header:
        errors.append(rel+": Music control missing")
    if header.count('class="ig-menu-button"')!=1:
        errors.append(rel+": expected one shared mobile/menu trigger")
    # Baseline templates vary between showing only the alternate language and showing
    # both ES/EN buttons. The invariant is: one language-control area, never duplicates.
    lang_groups=header.count('class="langs"')
    if lang_groups>1:
        errors.append(rel+": duplicated language selector")
    labels=re.findall(r">\s*(ES|EN)\s*<",header,re.I)
    if labels.count(other_lang)==0:
        errors.append(rel+": alternate language control missing: "+other_lang)
    for asset in ["/assets/lectura-accesible.js","/assets/interfaz-comun.js","/assets/musica.js"]:
        if asset not in text and asset.replace("/","../../",1) not in text and asset.replace("/","../../../",1) not in text and asset.replace("/","../../../../",1) not in text:
            # Some accepted templates use relative asset URLs; check basename too.
            if asset.rsplit("/",1)[1] not in text:
                errors.append(rel+": shared asset missing "+asset)

for rel in ES_PAGES: check_page(rel,ES_DEST,"EN")
for rel in EN_PAGES: check_page(rel,EN_DEST,"ES")

css=(ROOT/"assets/site-v23.css").read_text(encoding="utf-8")
for token in [
 "@media (min-width:94rem)",
 "@media (max-width:93.99rem)",
 "@media (max-width:42rem)",
 "overflow-x:auto",
 ".tools{order:2",
 ".langs{order:3",
 ".nav{order:4",
]:
    if token not in css:
        errors.append("responsive header CSS contract missing: "+token)

interface=(ROOT/"assets/interfaz-comun.js").read_text(encoding="utf-8")
for token in [".ig-menu-button","aria-expanded","event.key === 'Escape'","IGReading"]:
    if token not in interface:
        errors.append("shared interface contract missing: "+token)
reading=(ROOT/"assets/lectura-accesible.js").read_text(encoding="utf-8")
for token in ["a11yBtn","Música la controla exclusivamente assets/musica.js"]:
    if token not in reading:
        errors.append("Reading contract missing: "+token)
music=(ROOT/"assets/musica.js").read_text(encoding="utf-8")
if "plBtn" not in music:
    errors.append("Music contract missing plBtn")

out={
 "pass":not errors,
 "baseline_sha":M["baseline_sha"],
 "baseline_files_checked":len(M["files"]),
 "es_header_samples":len(ES_PAGES),
 "en_header_samples":len(EN_PAGES),
 "production_mutation":False,
 "errors":errors,
}
print(json.dumps(out,ensure_ascii=False,indent=2))
if errors: sys.exit(1)
