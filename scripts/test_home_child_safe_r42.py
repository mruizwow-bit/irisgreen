#!/usr/bin/env python3
"""Deterministic acceptance checks for R42 A8 Home + child safety."""
from __future__ import annotations
import argparse,json,re
from pathlib import Path

S2_ES=[
'/es/neurodiversidad/condiciones/abuso-y-explotacion/','/es/neurodiversidad/condiciones/anorexia-nerviosa/','/es/neurodiversidad/condiciones/trastorno-por-atracon/','/es/neurodiversidad/condiciones/bulimia-nerviosa/','/es/neurodiversidad/condiciones/trastornos-de-la-conducta-alimentaria-tca/','/es/neurodiversidad/condiciones/otros-trastornos-alimentarios-especificados-osfed/','/es/neurodiversidad/condiciones/tept-trastorno-por-estres-postraumatico/','/es/neurodiversidad/condiciones/tept-complejo/','/es/biblioteca/arfid-tca-y-pica-cuando-el-apoyo-cotidiano-necesita-atencion-clinica/','/es/biblioteca/abuso-explotacion-y-relaciones-seguras/']
IDS=['global-188','global-200','global-212','global-224','global-237','global-320','global-360','global-395','library-022','library-057']
RIDS=['research-005','research-036','research-037','research-045','research-046','research-071']

def need(cond,msg):
    if not cond:raise AssertionError(msg)
def page(root,url):
    return root/url.strip('/')/'index.html'
def main():
    ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True);root=ap.parse_args().root.resolve()
    es=(root/'index.html').read_text(encoding='utf-8');en=(root/'en/index.html').read_text(encoding='utf-8')
    for text,labels in [(es,['Contenido para…','Infancia','Adolescencia','Adultez','Cualquier edad']),(en,['Content for…','Children','Teenagers','Adults','Any age'])]:
        for label in labels:need(label in text,'Home missing '+label)
        need('data-ig-home-search' in text,'Home search missing');need('sabik-panel' in text,'Sabik access missing');need('data-ig-materials="r42"' in text,'R02 material hook missing')
    safe=json.loads((root/'assets/safety/search-safe-default.json').read_text());intent=json.loads((root/'assets/safety/search-intentional-safe.json').read_text());adult=json.loads((root/'assets/safety/search-adult-full-catalog.json').read_text())
    need(len(intent)==7,'Expected 7 searchable S2 records on the current A2 baseline; global-395 is R01-new');need(all(x['sensitivity']!='S2_HIGH_SENSITIVITY' for x in safe),'S2 leaked into safe autocomplete payload');need(all(x['sensitivity']=='S2_HIGH_SENSITIVITY' for x in intent),'Intentional safe file contains non-S2');need(len(adult)==len(safe)+len(intent),'Adult metadata catalogue mismatch')
    protected=0
    for url,cid in zip(S2_ES,IDS):
        p=page(root,url)
        if not p.is_file():
            need(cid=='global-395','Unexpected missing S2 page '+url)
            continue
        protected+=1;text=p.read_text(encoding='utf-8')
        need('data-ig-s2-safe' in text,'Full S2 not replaced '+url);need('data-ig-s2-actions' in text,'Adult explicit action mount missing '+url)
        need(re.search(r'<aside\\b[^>]*class=["\\'][^"\\']*\\biris-mini-card\\b',text,re.I) is None,'Derived Tarjeta Iris leaked into initial S2 safe payload '+url)
        need('prefetch' not in text.lower() and 'preload' not in text.lower(),'S2 prefetch/preload found '+url)
        full=root/'assets/safety/full'/f'{cid}-es.html';need(full.is_file(),'Missing full S2 chunk '+cid);need(full.read_text(encoding='utf-8') not in text,'Full S2 body leaked into initial HTML '+cid)
    conditions=(root/'es/neurodiversidad/condiciones/index.html').read_text(encoding='utf-8')
    for url in S2_ES[:8]:need(url.rstrip('/') not in conditions,'S2 card leaked into safe Conditions catalogue '+url)
    need(protected==9,'Expected 9 existing S2 page records on current baseline')
    lib=(root/'es/biblioteca/index.html').read_text(encoding='utf-8');need('data-ig-library-s2' in lib,'Adult library S2 mount missing')
    for url in S2_ES[8:]:need(url.rstrip('/') not in lib,'S2 card leaked into safe Everyday-life catalogue '+url)
    research=json.loads((root/'es/investigacion/estudios-textos.json').read_text(encoding='utf-8'))
    tagged={x.get('ig_s2_id') for x in research if x.get('ig_s2_id')};need(tagged==set(RIDS),'Research S2 safe variants mismatch')
    intentional={int(x.get('n',0) or 0) for x in research if x.get('ig_intentional_only')};need(intentional=={35,42,43,89},'Research INTENTIONAL_ONLY mismatch')
    for rid in RIDS:
        need((root/'assets/safety/full'/f'{rid}-es.html').is_file(),'Missing research full chunk '+rid)
        need((root/'assets/safety/full'/f'{rid}-en.html').is_file(),'Missing research EN full chunk '+rid)
    research_html=(root/'es/investigacion/index.html').read_text(encoding='utf-8');need('data-ig-research-s2' in research_html,'Research S2 renderer not wired');need('window.IGAudience && window.IGAudience.isAdult()' in research_html,'Research safe listing rule missing')
    loader=(root/'assets/ig-child-safe.js').read_text(encoding='utf-8');need("addEventListener('click'" in loader and 'isAdult()' in loader,'Adult full loader is not explicitly gated')
    search=(root/'assets/buscador-comun.js').read_text(encoding='utf-8');need('search-safe-default.json' in search and 'search-intentional-safe.json' in search and 'search-adult-full-catalog.json' in search,'New search contracts not used')
    css=(root/'assets/home-r42-child-safe.css').read_text(encoding='utf-8');need('forced-colors' in css and 'prefers-reduced-motion' in css and 'prefers-reduced-transparency' in css,'Accessibility media modes missing')
    print(json.dumps({'home_es_en':'PASS','safe_search':len(safe),'intentional_s2':len(intent),'adult_catalog':len(adult),'s2_pages':protected*2,'research_s2':len(RIDS),'forced_colors':'PASS','reduced_motion':'PASS','reduced_transparency':'PASS'}))
if __name__=='__main__':main()
