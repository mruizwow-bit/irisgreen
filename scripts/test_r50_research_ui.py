#!/usr/bin/env python3
"""R50 Research static gate."""
from pathlib import Path
import argparse,json
REQ=['/assets/ig-r42-materials.css','/assets/ig-audience.css','/assets/ig-r49-transversal.css','/assets/ig-r49-lang-bootstrap.js','/assets/ig-audience.js','/assets/ig-child-safe.js','/assets/interfaz-comun.js','/assets/musica.js','/assets/ig-r49-transversal.js']
def need(v,m):
 if not v:raise AssertionError(m)
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True);root=ap.parse_args().root.resolve()
 txt=(root/'es/investigacion/index.html').read_text(encoding='utf-8')
 need('data-ig-r49="1"' in txt and 'data-ig-profile="content"' in txt and 'data-ig-r49-owner="R50_RESEARCH"' in txt,'Research R50 contract missing')
 for asset in REQ:need(txt.count(asset)==1,f'{asset} count != 1')
 need('data-ig-research-s2' in txt,'Research child-safe renderer lost')
 need('window.IGAudience && window.IGAudience.isAdult()' in txt,'Research adult gate lost')
 data=json.loads((root/'assets/r50-research-route-profiles.json').read_text(encoding='utf-8'))
 need(data['total_routes']==1 and data['routes'][0]['locales']==['es','en'],'Research route manifest mismatch')
 need('name="ig-r50-section" content="research"' not in (root/'es/datos/index.html').read_text(encoding='utf-8'),'Research leaked into Data')
 print(json.dumps({'section':'research','static':'PASS','child_safe':'PASS','locales':['es','en']},ensure_ascii=False))
if __name__=='__main__':main()
