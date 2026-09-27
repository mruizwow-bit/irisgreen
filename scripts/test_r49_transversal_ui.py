#!/usr/bin/env python3
"""Static coverage/idempotence gate for R49 transversal R42/R02."""
from __future__ import annotations
import argparse, hashlib, json, subprocess, sys
from collections import Counter
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
APPLY=ROOT/'scripts/apply_r49_transversal_ui.py'
REQ_ASSETS=[
 '/assets/ig-r42-materials.css',
 '/assets/ig-audience.css',
 '/assets/ig-r49-transversal.css',
 '/assets/ig-r49-lang-bootstrap.js',
 '/assets/ig-audience.js',
 '/assets/ig-child-safe.js',
 '/assets/ig-r49-transversal.js',
]
CORE_PAIRS=[
 ('/es/neurodiversidad/condiciones/','/en/neurodiversity/conditions/'),
 ('/es/situaciones/','/en/situations/'),
 ('/es/biblioteca/','/en/everyday-life/'),
 ('/es/datos/','/en/data/'),
 ('/es/taller/','/en/workshop/'),
 ('/es/intereses/','/en/interests/'),
 ('/es/sitio-tranquilo/','/en/quiet-space/'),
]

def need(c,msg):
    if not c:raise AssertionError(msg)

def route(rel:str)->str:
    if rel=='index.html':return '/'
    if rel.endswith('/index.html'):return '/'+rel[:-10]
    return '/'+rel

def digest(paths):
    h=hashlib.sha256()
    for p in sorted(paths):
        h.update(p.as_posix().encode());h.update(b'\0');h.update(p.read_bytes());h.update(b'\0')
    return h.hexdigest()

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True);args=ap.parse_args()
    root=args.root.resolve();manifest_path=root/'assets/r49-route-profiles.json'
    need(manifest_path.is_file(),'route/profile manifest missing')
    data=json.loads(manifest_path.read_text(encoding='utf-8'))
    pages=[]
    for name in ('index.html','404.html'):
        p=root/name
        if p.is_file():pages.append(p)
    for lang in ('es','en'):
        base=root/lang
        if base.is_dir():pages.extend(p for p in base.rglob('*.html') if p.is_file())
    pages=sorted(set(pages))
    need(data['total_routes']==len(pages),'manifest total does not equal public HTML')
    need(data['unclassified']==0,'public routes remain unclassified')
    need(sum(data['profiles'].values())==len(pages),'profile counts do not sum to total')
    need(set(data['profiles'])=={'browse','content','workspace'},'unexpected profile set')
    rows={x['route']:x for x in data['routes']}
    need(len(rows)==len(pages),'duplicate or missing route records')
    for p in pages:
        rel=p.relative_to(root).as_posix();r=route(rel);row=rows.get(r);need(row is not None,'manifest missing '+r)
        txt=p.read_text(encoding='utf-8')
        need('data-ig-r49="1"' in txt,'R49 body marker missing '+r)
        need(f'data-ig-profile="{row["profile"]}"' in txt,'profile body marker mismatch '+r)
        need('data-ig-materials="r42"' in txt,'R02 not active '+r)
        for asset in REQ_ASSETS:
            need(txt.count(asset)==1,f'{asset} count != 1 on {r}')
        need(row['common_header'] and row['common_footer'],'common chrome flag false '+r)
        need(row['preferences'] and row['audience'] and row['child_safe'],'common contract flag false '+r)
    for es,en in CORE_PAIRS:
        need(es in rows and en in rows,'core ES/EN pair missing '+es+' '+en)
        need(rows[es]['profile']==rows[en]['profile'],'core ES/EN profile mismatch '+es)
    for prefix,owner in [
        ('/es/taller/','R47_TALLER'),('/en/workshop/','R47_TALLER'),
        ('/es/intereses/','R48_INTERESES'),('/en/interests/','R48_INTERESES'),
        ('/es/sitio-tranquilo/','R46_RINCON'),('/en/quiet-space/','R46_RINCON')]:
        subset=[x for x in data['routes'] if x['route'].startswith(prefix)]
        need(subset,'owner lane has no routes '+prefix)
        need(all(x['profile']=='workspace' and x['owner_lane']==owner for x in subset),'owner/profile mismatch '+prefix)
    css=(root/'assets/ig-r49-transversal.css').read_text(encoding='utf-8')
    need('--ig-reading-measure' in css and '--ig-layout-gutter' in css and '--ig-workspace-gutter' in css,'semantic layout tokens missing')
    need('html[data-ig-contrast="on"] body[data-ig-r49="1"] main{filter:none!important}' in css,'high contrast filter override missing')
    need('@media(forced-colors:active)' in css and '@media(prefers-reduced-motion:reduce)' in css and '@media(prefers-reduced-transparency:reduce)' in css,'a11y media modes missing')
    js=(root/'assets/ig-r49-transversal.js').read_text(encoding='utf-8')
    for token in ['openSearch','openAudience','openSettings','upgradeHeader','upgradeFooter']:
        need(token in js,'global chrome function missing '+token)
    common_bytes=sum((root/p.lstrip('/').split('?')[0]).stat().st_size for p in ['/assets/ig-r49-transversal.css','/assets/ig-r49-transversal.js','/assets/ig-r49-lang-bootstrap.js','/assets/ig-audience.css','/assets/ig-audience.js','/assets/ig-child-safe.js'])
    need(common_bytes<90000,f'R49 common assets too large: {common_bytes}')
    tracked=pages+[manifest_path]
    before=digest(tracked)
    subprocess.run([sys.executable,str(APPLY),'--root',str(root)],cwd=ROOT,check=True,stdout=subprocess.PIPE,text=True)
    after=digest(tracked)
    need(before==after,'R49 transform is not byte-idempotent')
    report={
      'total_html':len(pages),'profiles':data['profiles'],'locales':data['locales'],'owners':data['owners'],
      'unclassified':0,'duplicate_common_assets':0,'idempotent':True,'common_asset_bytes':common_bytes,
      'core_es_en_pairs':len(CORE_PAIRS),'reading_width_not_product_width':True,
      'forced_colors':True,'reduced_motion':True,'reduced_transparency':True,'high_contrast_filter_removed':True
    }
    print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__':main()
