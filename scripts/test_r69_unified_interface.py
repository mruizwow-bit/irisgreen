#!/usr/bin/env python3
"""R69 · static gate for the unified Iris Green interface.

The gate deliberately checks the built artifact, not source intentions. It protects
against the exact HUMAN QA regressions reported by María: legacy shell flashes,
duplicate age/search controls, duplicated footer, external font swaps and late
Workshop shell replacement.
"""
from __future__ import annotations
import argparse,re,json
from pathlib import Path

GOOGLE=("fonts.googleapis.com","fonts.gstatic.com")
WORKSHOP_SCRIPTS=(
 "/assets/data/taller-r42-paths.js",
 "/assets/ig-taller-r42-platform.js",
 "/assets/ig-taller-r42-direct.js",
 "/assets/ig-taller-r42.js",
)

def need(ok:bool,msg:str)->None:
    if not ok: raise AssertionError(msg)

def main()->None:
    ap=argparse.ArgumentParser();ap.add_argument("--root",type=Path,required=True)
    root=ap.parse_args().root.resolve()

    pages=[]
    for base in (root/"es",root/"en"):
        if base.is_dir(): pages.extend(p for p in base.rglob("*.html") if p.is_file())
    for p in (root/"index.html",root/"en"/"index.html"):
        if p.is_file(): pages.append(p)
    pages=sorted(set(pages))
    need(pages,"No public HTML")

    google=[];finder=[]
    for p in pages:
        s=p.read_text(encoding="utf-8")
        rel=p.relative_to(root).as_posix()
        if any(x in s for x in GOOGLE): google.append(rel)
        if 'id="ig-page-finder"' in s: finder.append(rel)
        need('/assets/ig-r69-unified-ui.css' in s,'R69 visual layer missing: '+rel)
    need(not google,"External Google Fonts remain: "+", ".join(google[:12]))
    need(not finder,"Legacy page finder remains: "+", ".join(finder[:12]))

    unified=(root/"assets/ig-r69-unified-ui.css").read_text(encoding="utf-8")
    need("@layer ig-r69-unified" not in unified,
         "R69 compatibility CSS must be unlayered so it can override unlayered legacy route CSS")
    for p in pages:
        s=p.read_text(encoding="utf-8")
        hrefs=re.findall(r'<link\\b[^>]*rel=["\\\'][^"\\\']*stylesheet[^"\\\']*["\\\'][^>]*href=["\\\']([^"\\\']+)["\\\']|<link\\b[^>]*href=["\\\']([^"\\\']+)["\\\'][^>]*rel=["\\\'][^"\\\']*stylesheet[^"\\\']*["\\\']',s,re.I)
        hrefs=[a or b for a,b in hrefs]
        need(hrefs and hrefs[-1].split("?")[0]=="/assets/ig-r69-unified-ui.css",
             "R69 compatibility stylesheet is not last: "+p.relative_to(root).as_posix())

    # Home uses the same global shell and must not expose a second age picker.
    homes=[root/"index.html",root/"en"/"index.html"]
    for p in homes:
        need(p.is_file(),"Missing Home "+str(p))
        s=p.read_text(encoding="utf-8")
        need('data-ig-r49="1"' in s,"Home not enrolled in global shell: "+p.as_posix())
        need('ig-home-v4-age' not in s,"Duplicate Home age picker remains: "+p.as_posix())
        need('/assets/ig-r49-lang-bootstrap.js' in s,"Home lacks first-paint R49 bootstrap: "+p.as_posix())
        need('/assets/ig-fonts.css' in s,"Home lacks local fonts: "+p.as_posix())

    # Resources must no longer show the legacy Infancia/Adolescencia card chooser.
    for rel in ("es/recursos/index.html","en/resources/index.html"):
        p=root/rel; need(p.is_file(),"Missing Resources hub "+rel)
        s=p.read_text(encoding="utf-8")
        need('ri-stage-section' not in s,"Legacy Resources age section remains: "+rel)

    # Every generated study has a deterministic R42 layer in normal defer order.
    studies=[]
    for base in (root/"es"/"taller",root/"en"/"workshop"):
        if not base.is_dir(): continue
        for p in base.rglob("index.html"):
            s=p.read_text(encoding="utf-8")
            if 'id="igt-app"' in s and '/assets/ig-taller-estudio.js' in s:
                studies.append((p,s))
    need(studies,"No Workshop study pages found")
    for p,s in studies:
        rel=p.relative_to(root).as_posix()
        need('data-ig-r69-workshop="1"' in s,"Workshop R69 marker missing: "+rel)
        need('name="ig-r69-taller-static-shell"' in s,"Workshop static shell meta missing: "+rel)
        need(s.count('/assets/ig-taller-r42.css')==1,"Workshop R42 CSS duplicate/missing: "+rel)
        positions=[]
        for asset in WORKSHOP_SCRIPTS:
            need(s.count(asset)==1,f"Workshop asset duplicate/missing {asset}: {rel}")
            positions.append(s.index(asset))
        need(positions==sorted(positions),"Workshop R42 defer order is not deterministic: "+rel)

    # Single global AGE_* taxonomy in product runtimes.
    games=(root/"assets/juegos-iris.js").read_text(encoding="utf-8")
    printable=(root/"assets/rutinas-imprimibles.js").read_text(encoding="utf-8")
    visual=(root/"assets/rutinas-visuales.js").read_text(encoding="utf-8")
    for name,s in (("games",games),("printable",printable),("visual",visual)):
        for token in ("AGE_0_12","AGE_13_17","AGE_18_PLUS","ALL_AGES"):
            need(token in s,f"{name} runtime missing canonical {token}")
    need("if(window.IGAudience)return ''" in printable,"Printable routines still expose a second age rail")
    need("!window.IGAudience&&!S.stageChosen" in printable,"Printable routines still expose local age landing")
    need("if(window.IGAudience)return ''" in games,"Games still expose a second age rail")
    need("!window.IGAudience&&!S.stageChosen" in games,"Games still expose local age landing")

    taller=(root/"assets/ig-taller-r42.js").read_text(encoding="utf-8")
    for old in ("Cualquier edad","Infancia","Adolescencia","Adultez","Any age","Childhood","Teens","Adults"):
        need(old not in taller,"Workshop emits legacy age UI: "+old)

    shell=(root/"assets/ig-r49-transversal.js").read_text(encoding="utf-8")
    need("footer.replaceChildren(inner)" in shell,"Global footer does not replace legacy footer")
    need("if(D.body)start()" in shell,"Global shell still waits for a later DOMContentLoaded paint")
    need("retireLegacyChrome()" in shell,"Legacy chrome cleanup missing")

    # Workshop visual layer consumes global semantic surfaces, not a white parallel palette.
    taller_css=(root/"assets/ig-taller-r42.css").read_text(encoding="utf-8")
    need("--ig42-surface:var(--ig-bg-surface)" in taller_css,"Workshop does not consume global surface token")
    need("#fff" not in taller_css.lower(),"Workshop retains pure-white interface surface")

    # Current Sabik artwork and R37 five-state motion remain present.
    motion=(root/"sabik/sabik-motion-r37.js").read_text(encoding="utf-8")
    web=(root/"sabik/sabik-web-r01.js").read_text(encoding="utf-8")
    for state in ("presente","orientar","transicion","pausa","confirmar"):
        need(state in motion,"Sabik R37 state missing: "+state)
    need("sabik-motion-r37" in web.lower() or "SabikMotionR37" in web,"Sabik Web does not load/use R37 motion")

    print(json.dumps({
      "r69_unified_interface":"PASS",
      "html_pages":len(pages),
      "workshop_studies":len(studies),
      "external_google_fonts":0,
      "legacy_page_finder":0,
      "duplicate_resource_age_ui":0,
      "home_duplicate_age_ui":0,
      "workshop_static_shell":"PASS",
      "global_footer_replacement":"PASS",
      "canonical_age_runtime":"PASS",
      "sabik_r37_static":"PASS"
    },ensure_ascii=False))

if __name__=="__main__":
    main()
