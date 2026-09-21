#!/usr/bin/env python3
from __future__ import annotations
import argparse, json
from pathlib import Path

ap=argparse.ArgumentParser()
ap.add_argument("--root",type=Path,default=Path("dist"))
args=ap.parse_args()
root=args.root.resolve()
errors=[]

def read(rel):
    p=root/rel
    if not p.is_file():
        errors.append(f"missing: {rel}")
        return ""
    return p.read_text(encoding="utf-8",errors="strict")

pages={
 "es/recursos/juegos/autonomia-cotidiana/index.html":"https://irisgreen.eu/es/recursos/juegos/autonomia-cotidiana/",
 "en/resources/games/daily-autonomy/index.html":"https://irisgreen.eu/en/resources/games/daily-autonomy/",
 "es/recursos/tablero-necesidades/index.html":"https://irisgreen.eu/es/recursos/tablero-necesidades/",
 "en/resources/needs-board/index.html":"https://irisgreen.eu/en/resources/needs-board/",
 "es/biblioteca/lgtbi-preparar-conversaciones-y-limites/index.html":"https://irisgreen.eu/es/biblioteca/lgtbi-preparar-conversaciones-y-limites/",
 "en/everyday-life/lgbti-prepare-conversations-and-boundaries/index.html":"https://irisgreen.eu/en/everyday-life/lgbti-prepare-conversations-and-boundaries/",
 "en/resources/index.html":"https://irisgreen.eu/en/resources/",
}
for rel,canonical in pages.items():
    text=read(rel)
    if '<main id="main"' not in text: errors.append(rel+": no main")
    if "<h1" not in text: errors.append(rel+": no h1")
    if canonical not in text or 'rel="canonical"' not in text: errors.append(rel+": canonical")
    if "index,follow" not in text: errors.append(rel+": robots")

pairs=[
 ("es/recursos/juegos/autonomia-cotidiana/index.html","https://irisgreen.eu/en/resources/games/daily-autonomy/"),
 ("en/resources/games/daily-autonomy/index.html","https://irisgreen.eu/es/recursos/juegos/autonomia-cotidiana/"),
 ("es/recursos/tablero-necesidades/index.html","https://irisgreen.eu/en/resources/needs-board/"),
 ("en/resources/needs-board/index.html","https://irisgreen.eu/es/recursos/tablero-necesidades/"),
 ("es/biblioteca/lgtbi-preparar-conversaciones-y-limites/index.html","https://irisgreen.eu/en/everyday-life/lgbti-prepare-conversations-and-boundaries/"),
 ("en/everyday-life/lgbti-prepare-conversations-and-boundaries/index.html","https://irisgreen.eu/es/biblioteca/lgtbi-preparar-conversaciones-y-limites/"),
 ("es/recursos/index.html","https://irisgreen.eu/en/resources/"),
 ("en/resources/index.html","https://irisgreen.eu/es/recursos/"),
]
for rel,target in pairs:
    text=read(rel)
    if target not in text or "hreflang=" not in text: errors.append(rel+": reciprocal hreflang "+target)

for rel,tokens in {
 "es/recursos/juegos/autonomia-cotidiana/index.html":['id="cordones"','id="mochila"','id="salir"','id="lavadora"',"RTAx8pSgzoo"],
 "en/resources/games/daily-autonomy/index.html":['id="shoelaces"','id="backpack"','id="leaving"','id="washing-machine"',"RTAx8pSgzoo"],
}.items():
    text=read(rel)
    for token in tokens:
        if token not in text: errors.append(rel+": missing "+token)
    if "setInterval" in text: errors.append(rel+": contains timer interval")

symbol_ids=["descansar","tengo-hambre","tengo-sed","necesito-ir-al-bano","silencio","auriculares","sentarse","esperar","salir","terminado"]
for rel in ["es/recursos/tablero-necesidades/index.html","en/resources/needs-board/index.html"]:
    text=read(rel)
    for token in ["Mulberry Symbols","CC BY-SA 4.0","LICENSE-MULBERRY.txt",*symbol_ids]:
        if token not in text: errors.append(rel+": needs board missing "+token)

for rel in ["es/sitio-tranquilo/index.html","en/quiet-space/index.html"]:
    text=read(rel)
    for banned in ["Inspira despacio","Suelta el aire despacio","Breathe in slowly","Breathe out slowly"]:
        if banned in text: errors.append(rel+": forced breathing phrase "+banned)
    for token in ['id="startBreath"','id="startPause3"','id="startPause5"']:
        if token not in text: errors.append(rel+": missing "+token)

catalog=json.loads(read("videoteca-listado.json") or "{}")
videos=catalog.get("videos",[])
if catalog.get("total")!=len(videos) or len(videos)!=55:
    errors.append(f"video count: declared={catalog.get('total')} actual={len(videos)}")
refs={"RTAx8pSgzoo","9Tls8PyUVKc","aPknwW8mPAM"}
by_ref={v.get("ref"):v for v in videos}
for ref in refs:
    v=by_ref.get(ref)
    if not v:
        errors.append("video missing "+ref)
        continue
    for field in ["idioma","fuente","fechaComprobacion","resumen","subtitulos","transcripcion","idioma_en","comoLeer_en","resumen_en","subtitulos_en","transcripcion_en"]:
        if not str(v.get(field,"")).strip(): errors.append(ref+": metadata "+field)

video_page=read("es/videos/index.html")
for ref in refs:
    if ref not in video_page: errors.append("video page missing "+ref)
for token in ["Daily living","Learning disability","Sensory processing","Subtitles and transcript not verified"]:
    if token not in video_page: errors.append("video EN mode missing "+token)

lgbt_targets=[
 ("es/neurodiversidad/condiciones/lgtbi-y-neurodiversidad/index.html","/es/biblioteca/lgtbi-preparar-conversaciones-y-limites/"),
 ("es/biblioteca/lgtbi-y-neurodiversidad-nombre-pronombres-identidad-y-atencion-respetuosa/index.html","/es/biblioteca/lgtbi-preparar-conversaciones-y-limites/"),
 ("en/neurodiversity/conditions/lgbtqia-and-neurodiversity/index.html","/en/everyday-life/lgbti-prepare-conversations-and-boundaries/"),
 ("en/everyday-life/lgbti-and-neurodiversity-name-pronouns-identity-and-respectful-care/index.html","/en/everyday-life/lgbti-prepare-conversations-and-boundaries/"),
]
for rel,target in lgbt_targets:
    if target not in read(rel): errors.append(rel+": practical LGBTI link missing")

en_index=read("en/everyday-life/index.html")
if "/en/everyday-life/lgbti-prepare-conversations-and-boundaries/" not in en_index: errors.append("EN everyday index missing practical LGBTI page")
if "Forty-nine" not in en_index: errors.append("EN everyday index still reports old count")

for rel,hrefs in {
 "es/recursos/index.html":["/es/recursos/juegos/autonomia-cotidiana/","/es/recursos/tablero-necesidades/"],
 "en/resources/index.html":["/en/resources/games/daily-autonomy/","/en/resources/needs-board/","/en/resources/games/count-and-pay/"],
}.items():
    text=read(rel)
    for href in hrefs:
        if href not in text: errors.append(rel+": missing resource link "+href)

sitemap=read("sitemap.xml")
for canonical in pages.values():
    if canonical not in sitemap: errors.append("sitemap missing "+canonical)

out={"pass":not errors,"new_indexable_pages":len(pages),"video_total":len(videos),"bilingual_pairs":4,"errors":errors}
print(json.dumps(out,ensure_ascii=False,indent=2))
if errors:
    raise SystemExit(1)
