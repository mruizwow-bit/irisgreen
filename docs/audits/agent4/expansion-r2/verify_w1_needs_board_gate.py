#!/usr/bin/env python3
"""Static resource-gate check for the rebuilt ES/EN needs board pair."""
from pathlib import Path
import argparse, json, re, sys

PAGES={
 "es":("es/recursos/tablero-necesidades/index.html",[
   "/","/es/neurodiversidad/condiciones/","/es/situaciones/","/es/biblioteca/",
   "/es/videos/","/es/investigacion/","/es/datos/","/es/tramites/directorio/",
   "/es/libros/","/es/recursos/","/es/intereses/","/es/taller/","/es/sitio-tranquilo/"
 ]),
 "en":("en/resources/needs-board/index.html",[
   "/","/en/neurodiversity/conditions/","/en/situations/","/en/everyday-life/",
   "/es/videos/","/es/investigacion/","/en/data/","/es/tramites/directorio/",
   "/es/libros/","/en/resources/","/en/interests/","/es/taller/","/en/quiet-space/"
 ])
}
SYMBOLS=["descansar","tengo-hambre","tengo-sed","necesito-ir-al-bano","silencio",
         "auriculares","sentarse","esperar","salir","terminado"]

def main(root:Path)->int:
    errors=[]; details={}
    texts={}
    for lang,(rel,required) in PAGES.items():
        p=root/rel
        if not p.is_file():
            errors.append(f"{rel}: missing")
            continue
        t=p.read_text(encoding="utf-8"); texts[lang]=t
        m=re.search(r"<header\b[\s\S]*?</header>",t,re.I)
        h=m.group(0) if m else ""
        e=[]
        if not h: e.append("header missing")
        for d in required:
            if f'href="{d}"' not in h: e.append("nav missing "+d)
        for ident in ("a11yBtn","plBtn"):
            if h.count(f'id="{ident}"')!=1: e.append(ident+" count != 1")
        if h.count('class="langs"')!=1: e.append("language selector count != 1")
        if h.count('class="ig-menu-button"')!=1: e.append("shared mobile menu count != 1")
        if t.count('class="need"')!=10: e.append("expected 10 static need buttons")
        if t.count('aria-pressed="false"')!=10: e.append("expected 10 exposed toggle states")
        if 'aria-live="polite"' not in t: e.append("live text feedback missing")
        if "CC BY-SA 4.0" not in t: e.append("Mulberry licence attribution missing")
        if "/assets/mulberry-rutinas/LICENSE-MULBERRY.txt" not in t: e.append("local licence link missing")
        if "/assets/mulberry-rutinas/sources.csv" not in t: e.append("source mapping disclosure missing")
        low=t.lower()
        for token in ("<audio","<video","<iframe","autoplay","setinterval("):
            if token in low: e.append("blocked media/timing token: "+token)
        compact=t.replace(" ","")
        if "@media(max-width:480px)" not in compact: e.append("small-screen rule missing")
        if "prefers-reduced-motion:reduce" not in compact: e.append("reduced-motion rule missing")
        if "@media print" not in t: e.append("print rule missing")
        if lang=="es" and 'href="/en/resources/needs-board/"' not in h: e.append("reciprocal EN link missing")
        if lang=="en" and 'href="/es/recursos/tablero-necesidades/"' not in h: e.append("reciprocal ES link missing")
        details[lang]=e
        errors.extend(f"{rel}: {x}" for x in e)

    for symbol in SYMBOLS:
        for lang,t in texts.items():
            if f"#{symbol}" not in t: errors.append(f"{lang}: missing mapped symbol {symbol}")

    source_map=root/"assets/mulberry-rutinas/sources.csv"
    licence=root/"assets/mulberry-rutinas/LICENSE-MULBERRY.txt"
    if not source_map.is_file(): errors.append("Mulberry sources.csv missing")
    else:
        s=source_map.read_text(encoding="utf-8-sig")
        for symbol in SYMBOLS:
            if not re.search(rf"(?m)^{re.escape(symbol)},",s):
                errors.append("sources.csv missing "+symbol)
    if not licence.is_file(): errors.append("Mulberry licence file missing")
    elif "Creative Commons Attribution-Share Alike" not in licence.read_text(encoding="utf-8"):
        errors.append("unexpected Mulberry licence text")

    print(json.dumps({
      "pass":not errors,
      "pages_checked":len(texts),
      "static_options_per_page":10,
      "javascript_required_to_read_options":False,
      "browser_conformance_claimed":False,
      "errors":errors,
      "details":details
    },ensure_ascii=False,indent=2))
    return 1 if errors else 0

if __name__=="__main__":
    ap=argparse.ArgumentParser()
    ap.add_argument("--root",type=Path,default=None)
    args=ap.parse_args()
    root=args.root if args.root is not None else Path(__file__).resolve().parents[5]
    sys.exit(main(root))
