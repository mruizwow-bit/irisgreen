#!/usr/bin/env python3
from pathlib import Path
import argparse,json
REQ=['/assets/ig-r42-materials.css','/assets/ig-audience.css','/assets/ig-r49-transversal.css','/assets/ig-r49-lang-bootstrap.js','/assets/ig-audience.js','/assets/ig-child-safe.js','/assets/interfaz-comun.js','/assets/musica.js','/assets/ig-r49-transversal.js']
def need(v,m):
 if not v:raise AssertionError(m)
def main():
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);root=p.parse_args().root.resolve()
 prof=json.loads((root/'assets/r50-privacy-route-profiles.json').read_text());need(prof['total_routes']==2,'Privacy routes !=2')
 for row in prof['routes']:
  txt=(root/row['file']).read_text(encoding='utf-8');need('data-ig-r49-owner="R50_PRIVACY"' in txt,'owner '+row['route']);need('data-ig-profile="content"' in txt,'content '+row['route'])
  for a in REQ:need(txt.count(a)==1,a+' count '+row['route'])
 need('>Privacidad<' in (root/'es/privacidad/index.html').read_text(encoding='utf-8'),'ES privacy heading missing')
 need('>Privacy<' in (root/'en/privacy/index.html').read_text(encoding='utf-8'),'EN privacy heading missing')
 print(json.dumps({'section':'privacy','routes':2,'static':'PASS'}))
if __name__=='__main__':main()
