#!/usr/bin/env python3
from pathlib import Path
import argparse,json
REQ=['/assets/ig-r42-materials.css','/assets/ig-audience.css','/assets/ig-r49-transversal.css','/assets/ig-r49-lang-bootstrap.js','/assets/ig-audience.js','/assets/ig-child-safe.js','/assets/interfaz-comun.js','/assets/musica.js','/assets/ig-r49-transversal.js']
def need(v,m):
 if not v:raise AssertionError(m)
def main():
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);root=p.parse_args().root.resolve();data=json.loads((root/'assets/r50-data-route-profiles.json').read_text())
 need(data['total_routes']>=90,'Data manifest incomplete')
 for row in data['routes']:
  txt=(root/row['file']).read_text(encoding='utf-8');need('data-ig-r49-owner="R50_DATA"' in txt,'owner '+row['route']);need(f'data-ig-profile="{row["profile"]}"' in txt,'profile '+row['route'])
  for a in REQ:need(txt.count(a)==1,a+' count '+row['route'])
 need('name="ig-r50-section" content="data"' not in (root/'es/recursos/index.html').read_text(encoding='utf-8'),'Data leaked into Resources')
 print(json.dumps({'section':'data','routes':data['total_routes'],'static':'PASS'}))
if __name__=='__main__':main()
