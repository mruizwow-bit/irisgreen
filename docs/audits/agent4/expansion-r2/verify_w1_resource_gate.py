#!/usr/bin/env python3
"""Static W1-R2 resource gate for the first corrected ES/EN resource pair.

The check is deliberately strict about the global Iris Green header contract and
about resource-specific regressions that caused W1-R0 to be frozen. It does not
claim browser-level WCAG conformance; browser CI remains a separate gate.
"""
from __future__ import annotations
import argparse, json, re, sys
from pathlib import Path

PAGES={
 "es/recursos/juegos/autonomia-cotidiana/index.html": {
   "lang":"es",
   "other":"/en/resources/games/daily-autonomy/",
   "required":["/","/es/neurodiversidad/condiciones/","/es/situaciones/","/es/biblioteca/","/es/videos/","/es/investigacion/","/es/datos/","/es/tramites/directorio/","/es/libros/","/es/recursos/juegos/","/es/intereses/","/es/taller/","/es/sitio-tranquilo/"],
 },
 "en/resources/games/daily-autonomy/index.html": {
   "lang":"en",
   "other":"/es/recursos/juegos/autonomia-cotidiana/",
   "required":["/","/en/neurodiversity/conditions/","/en/situations/","/en/everyday-life/","/es/videos/","/es/investigacion/","/en/data/","/es/tramites/directorio/","/es/libros/","/es/recursos/juegos/","/en/interests/","/es/taller/","/en/quiet-space/"],
 },
}

def header(text:str)->str:
    m=re.search(r"<header\b[\s\S]*?</header>",text,re.I)
    return m.group(0) if m else ""

def main(root:Path)->int:
    errors=[]; details={}
    for rel,cfg in PAGES.items():
        p=root/rel
        if not p.is_file():
            errors.append(f"{rel}: missing")
            continue
        text=p.read_text(encoding="utf-8")
        h=header(text)
        per=[]
        if not h: per.append("header missing")
        for dest in cfg["required"]:
            if f'href="{dest}"' not in h: per.append("nav missing "+dest)
        for ident,label in [("a11yBtn","Reading"),("plBtn","Music")]:
            if h.count(f'id="{ident}"')!=1: per.append(f"{label} control count != 1")
        if h.count('class="langs"')!=1: per.append("language selector count != 1")
        if h.count('class="ig-menu-button"')!=1: per.append("shared mobile menu trigger count != 1")
        if f'href="{cfg["other"]}"' not in h: per.append("reciprocal language href missing")
        if 'id="a11y"' not in text or 'id="pl"' not in text: per.append("Reading/Music panel missing")
        for asset in ["preferencias-lectura.js","lectura-accesible.js","interfaz-comun.js","musica.js"]:
            if asset not in text: per.append("shared asset missing "+asset)
        if 'name="viewport"' not in text: per.append("viewport missing")
        if 'prefers-reduced-motion:reduce' not in text.replace(" ",""): per.append("reduced-motion rule missing")
        if '@media(max-width:760px)' not in text.replace(" ",""): per.append("small-screen reflow rule missing")
        if len(re.findall(r'<article\s+class="game"',text,re.I))!=4: per.append("expected four task activities")
        low=text.lower()
        for forbidden in ["youtube.com/watch","youtube-nocookie.com","<audio","<video","<iframe","autoplay","setinterval("]:
            if forbidden in low: per.append("blocked media/timing token: "+forbidden)
        if "cddft.nhs.uk/services/childrens-occupational-therapy/tips-FAQ" not in text: per.append("institutional shoelace source missing")
        if text.count('aria-live="polite"')<1: per.append("text feedback region missing")
        if text.count('aria-pressed="false"')<1: per.append("toggle state not exposed")
        if per:
            errors.extend(f"{rel}: {x}" for x in per)
        details[rel]={"errors":per,"game_count":len(re.findall(r'<article\s+class="game"',text,re.I))}

    # ES/EN parity for the resource pair.
    if all((root/r).is_file() for r in PAGES):
        es=(root/next(r for r in PAGES if r.startswith("es/"))).read_text(encoding="utf-8")
        en=(root/next(r for r in PAGES if r.startswith("en/"))).read_text(encoding="utf-8")
        for token_es,token_en in [
            ('id="cordones"','id="shoelaces"'),('id="mochila"','id="backpack"'),
            ('id="salir"','id="leaving"'),('id="lavadora"','id="washing-machine"'),
        ]:
            if token_es not in es or token_en not in en: errors.append("ES/EN activity parity missing: "+token_es+" / "+token_en)
        if 'hreflang="en" href="https://irisgreen.eu/en/resources/games/daily-autonomy/"' not in es: errors.append("ES hreflang EN missing")
        if 'hreflang="es" href="https://irisgreen.eu/es/recursos/juegos/autonomia-cotidiana/"' not in en: errors.append("EN hreflang ES missing")

    out={"pass":not errors,"pages_checked":len(PAGES),"browser_conformance_claimed":False,"errors":errors,"details":details}
    print(json.dumps(out,ensure_ascii=False,indent=2))
    return 1 if errors else 0

if __name__=="__main__":
    ap=argparse.ArgumentParser(); ap.add_argument("--root",type=Path,default=None); args=ap.parse_args(); root=args.root if args.root is not None else Path(__file__).resolve().parents[5]; sys.exit(main(root))
