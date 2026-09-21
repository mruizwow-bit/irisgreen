#!/usr/bin/env python3
from __future__ import annotations
import argparse, json, re
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

new_pages={
 "es/recursos/juegos/autonomia-cotidiana/index.html":"https://irisgreen.eu/es/recursos/juegos/autonomia-cotidiana/",
 "es/recursos/tablero-necesidades/index.html":"https://irisgreen.eu/es/recursos/tablero-necesidades/",
 "es/biblioteca/lgtbi-preparar-conversaciones-y-limites/index.html":"https://irisgreen.eu/es/biblioteca/lgtbi-preparar-conversaciones-y-limites/",
}
for rel,canonical in new_pages.items():
    text=read(rel)
    if '<main id="main"' not in text: errors.append(rel+": no main")
    if "<h1" not in text: errors.append(rel+": no h1")
    if f'href="{canonical}"' not in text or 'rel="canonical"' not in text: errors.append(rel+": canonical")
    if 'name="robots" content="index,follow"' not in text and 'content="index,follow" name="robots"' not in text: errors.append(rel+": robots")

aut=read("es/recursos/juegos/autonomia-cotidiana/index.html")
for token in ['id="cordones"','id="mochila"','id="salir"','id="lavadora"',"RTAx8pSgzoo"]:
    if token not in aut: errors.append("autonomia missing "+token)
if "setInterval" in aut: errors.append("autonomia contains timer interval")

board=read("es/recursos/tablero-necesidades/index.html")
for token in ["Mulberry Symbols","CC BY-SA 4.0","LICENSE-MULBERRY.txt","descansar","tengo-hambre","tengo-sed","necesito-ir-al-bano","silencio","auriculares","sentarse","esperar","salir","terminado"]:
    if token not in board: errors.append("needs board missing "+token)

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
required_refs={"RTAx8pSgzoo","9Tls8PyUVKc","aPknwW8mPAM"}
by_ref={v.get("ref"):v for v in videos}
for ref in required_refs:
    v=by_ref.get(ref)
    if not v:
        errors.append("video missing "+ref);continue
    for field in ["idioma","fuente","fechaComprobacion","resumen","subtitulos","transcripcion"]:
        if not str(v.get(field,"")).strip(): errors.append(ref+": metadata "+field)

video_page=read("es/videos/index.html")
for ref in required_refs:
    if ref not in video_page: errors.append("video page missing "+ref)
for topic in ["Autonomía","Discapacidad intelectual","Procesamiento sensorial"]:
    if topic not in video_page: errors.append("video topic missing "+topic)

resources=read("es/recursos/index.html")
for href in ["/es/recursos/juegos/autonomia-cotidiana/","/es/recursos/tablero-necesidades/"]:
    if href not in resources: errors.append("resources index missing "+href)
games=read("es/recursos/juegos/coleccion/index.html")
if "/es/recursos/juegos/autonomia-cotidiana/" not in games: errors.append("games collection missing autonomy")

lgbt_target="/es/biblioteca/lgtbi-preparar-conversaciones-y-limites/"
for rel in ["es/neurodiversidad/condiciones/lgtbi-y-neurodiversidad/index.html","es/biblioteca/lgtbi-y-neurodiversidad-nombre-pronombres-identidad-y-atencion-respetuosa/index.html"]:
    if lgbt_target not in read(rel): errors.append(rel+": practical LGTBI link missing")

sitemap=read("sitemap.xml")
for canonical in new_pages.values():
    if canonical not in sitemap: errors.append("sitemap missing "+canonical)

out={
 "pass":not errors,
 "new_pages":len(new_pages),
 "video_total":len(videos),
 "new_video_refs":sorted(required_refs),
 "quiet_pause_low_demand":not any("breathing phrase" in e for e in errors),
 "errors":errors,
}
print(json.dumps(out,ensure_ascii=False,indent=2))
if errors: raise SystemExit(1)
