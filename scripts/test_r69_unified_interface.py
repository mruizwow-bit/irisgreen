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
 "/assets/ig-r69-workshop-guard.js",
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

    google=[];finder_duplicates=[];static_age=[]
    for p in pages:
        s=p.read_text(encoding="utf-8")
        rel=p.relative_to(root).as_posix()
        if any(x in s for x in GOOGLE): google.append(rel)
        if s.count('id="ig-page-finder"')>1: finder_duplicates.append(rel)
        if ('data-ig-audience-picker' in s or 'data-ig-audience-stage' in s) and rel not in ('index.html','en/index.html'): static_age.append(rel)
        need('/assets/ig-fonts.css' in s,'Local fonts missing: '+rel)
    need(not google,"External Google Fonts remain: "+", ".join(google[:12]))
    need(not finder_duplicates,"Duplicate page finder remains: "+", ".join(finder_duplicates[:12]))
    need(not static_age,"Static local age picker remains outside the global shell: "+", ".join(static_age[:12]))

    unified=(root/"assets/ig-r69-unified-ui.css").read_text(encoding="utf-8")
    shell_css=(root/"assets/ig-r49-transversal.css").read_text(encoding="utf-8")
    need("@layer ig-r69-unified" not in unified,"R69 compatibility CSS must remain unlayered")
    for legacy,semantic in {
        "--tinta":"--ig-text","--azul":"--ig-link","--lila":"--ig-accent",
        "--turq":"--ig-accent-secondary","--papel":"--ig-bg-surface",
        "--niebla":"--ig-bg-page","--linea":"--ig-separator","--suave":"--ig-text-muted"
    }.items():
        need(f"{legacy}:var({semantic}" in shell_css,f"R49 does not own legacy palette alias {legacy} -> {semantic}")
    need(".ig-r49-global-header" not in unified and ".ig-r49-global-footer" not in unified,"R69 must not own the global shell")
    final_ui=re.compile(r'<link rel="stylesheet" href="/assets/ig-r69-unified-ui\.css(?:\?[^"]*)?">$')
    for p in pages:
        rel=p.relative_to(root).as_posix()
        head=p.read_text(encoding="utf-8").split("</head>",1)[0].rstrip()
        need(final_ui.search(head) is not None,"R69 compatibility stylesheet is not final in head: "+rel)
        need(head.count('/assets/ig-r69-unified-ui.css')==1,"R69 compatibility stylesheet count != 1: "+rel)

    # Home exposes the one canonical visible AGE picker; other products consume that session state without duplicating it.
    homes=[root/"index.html",root/"en"/"index.html"]
    for p in homes:
        need(p.is_file(),"Missing Home "+str(p))
        s=p.read_text(encoding="utf-8")
        need('data-ig-r49="1"' in s,"Home not enrolled in global shell: "+p.as_posix())
        need(s.count('data-ig-audience-picker')==1,"Home canonical age picker count !=1: "+p.as_posix())
        need(s.count('data-ig-audience-stage=')==3,"Home public age buttons count !=3: "+p.as_posix())
        need('data-ig-audience-stage="GENERAL"' not in s,"GENERAL must not be a public Home age button: "+p.as_posix())
        need('data-ig-audience-stage="ALL_AGES"' not in s,"ALL_AGES must not be a public Home age button: "+p.as_posix())
        need('ig-home-v4-safety-state' in s,"Home child-safe state is not visible: "+p.as_posix())
        need('/assets/ig-r49-lang-bootstrap.js' in s,"Home lacks first-paint R49 bootstrap: "+p.as_posix())
        need('/assets/ig-fonts.css' in s,"Home lacks local fonts: "+p.as_posix())

    # Resources must no longer show the legacy Infancia/Adolescencia card chooser.
    for rel in ("es/recursos/index.html","en/resources/index.html"):
        p=root/rel; need(p.is_file(),"Missing Resources hub "+rel)
        s=p.read_text(encoding="utf-8")
        need('ri-stage-section' not in s,"Legacy Resources age section remains: "+rel)

    # The three destinations have distinct inventories and working links in both locales.
    for lang,base,workshop,money in (("es","es/recursos/","es/taller/","contar-y-pagar/"),("en","en/resources/","en/workshop/","count-and-pay/")):
        visual=(root/base/"index.html").read_text(encoding="utf-8")
        games=(root/base/("juegos" if lang=="es" else "games")/"index.html").read_text(encoding="utf-8")
        hub=(root/workshop/"index.html").read_text(encoding="utf-8")
        need(visual.count('class="ig-activity-card"')==3,"Expected three visual support tools")
        need('/'+base+money not in visual,"Money is still in visual supports")
        need('href="/'+base+money+'"' in games,"Money missing from Games")
        need('igk-start-sec' not in hub and 'igk-prof-sec' not in hub,"Duplicate studio launchers remain")
        need(len(re.findall(r'data-studio="',hub))==27,"Each studio must appear exactly once")
        for text in (visual,games,hub):
            need('class="ig-activity-nav"' not in text,"Redundant secondary activity navigation remains")
            for href in re.findall(r'href="(/[^"?#]+/)"',text):
                need((root/href.strip('/')/'index.html').is_file(),"Broken activity link: "+href)
    need("dlg.showModal()" not in (root/'assets/ig-suite-launcher.js').read_text(encoding="utf-8"),"Workshop catalogue must remain inline")

    # Workshop uses only the global Content/AGE lens, never the old «Para ti» row.
    for rel in ("es/taller/index.html","en/workshop/index.html"):
        p=root/rel; need(p.is_file(),"Missing Workshop hub "+rel)
        s=p.read_text(encoding="utf-8")
        need('class="igk-para"' not in s,"Legacy Workshop local age nav remains: "+rel)

    # Every generated study has a deterministic R42 layer in normal defer order.
    studies=[];suite=[]
    for base in (root/"es"/"taller",root/"en"/"workshop"):
        if not base.is_dir(): continue
        for p in base.rglob("index.html"):
            s=p.read_text(encoding="utf-8")
            if 'data-igs-engine=' in s and '/assets/ig-suite-core.js' in s:
                suite.append((p,s))
            if 'id="igt-app"' in s and '/assets/ig-taller-estudio.js' in s:
                studies.append((p,s))
    need(studies or suite,"No Workshop study pages found")
    if suite:
        need(len(suite)==54,"Expected all 27 suite studios in ES and EN")
    for p,s in suite:
        rel=p.relative_to(root).as_posix()
        need('/assets/ig-taller-estudio.js' not in s,"Legacy and suite engines collide: "+rel)
        assets=re.findall(r'<script\s+defer\s+src="([^"?]+)',s)
        for asset in ('/assets/ig-r42-shell.js','/assets/ig-suite-core.js'):
            need(assets.count(asset)==1,"Suite deferred shell/core missing or duplicated: "+rel)
        need(assets.index('/assets/ig-r42-shell.js')<assets.index('/assets/ig-suite-core.js'),"Suite shell must precede core: "+rel)
        for asset in assets:
            need((root/asset.lstrip('/')).is_file(),"Missing suite dependency "+asset+": "+rel)
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
    need("root.setTimeout(go,0)" not in taller,
         "Workshop shell still defers its mount by an event-loop turn")
    need("else go();" in taller,
         "Workshop shell does not mount synchronously when defer parsing is complete")
    for old in ("Cualquier edad","Infancia","Adolescencia","Adultez","Any age","Childhood","Teens","Adults"):
        need(old not in taller,"Workshop emits legacy age UI: "+old)

    shell=(root/"assets/ig-r49-transversal.js").read_text(encoding="utf-8")
    need("footer.replaceChildren(inner)" in shell,"Global footer does not replace legacy footer")
    need("if(D.body)start()" in shell,"Global shell still waits for a later DOMContentLoaded paint")
    need("retireLegacyChrome" not in shell,
         "Legacy panels must not be deleted at runtime; cleanup belongs to the build layer")

    # Workshop visual layer consumes global semantic surfaces, not a white parallel palette.
    taller_css=(root/"assets/ig-taller-r42.css").read_text(encoding="utf-8")
    need("@layer ig42-taller" not in taller_css,
         "Workshop final CSS must be unlayered so legacy unlayered rules cannot override it")
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
      "workshop_studies":len(studies)+len(suite),
      "external_google_fonts":0,
      "legacy_page_finder":0,
      "duplicate_resource_age_ui":0,
      "home_duplicate_age_ui":0,
      "home_age_picker":"VISIBLE_CANONICAL",
      "workshop_static_shell":"PASS",
      "global_footer_replacement":"PASS",
      "canonical_age_runtime":"PASS",
      "sabik_r37_static":"PASS"
    },ensure_ascii=False))

if __name__=="__main__":
    main()
