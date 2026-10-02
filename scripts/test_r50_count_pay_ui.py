#!/usr/bin/env python3
from pathlib import Path
import argparse,json
REQ=['/assets/ig-r42-materials.css','/assets/ig-audience.css','/assets/ig-r49-transversal.css','/assets/ig-r49-lang-bootstrap.js','/assets/ig-audience.js','/assets/ig-child-safe.js','/assets/interfaz-comun.js','/assets/musica.js','/assets/ig-r49-transversal.js']
def need(v,m):
 if not v:raise AssertionError(m)
def main():
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);root=p.parse_args().root.resolve()
 prof=json.loads((root/'assets/r50-count-pay-route-profiles.json').read_text());need(prof['total_routes']==2,'Count/pay routes !=2')
 for row in prof['routes']:
  txt=(root/row['file']).read_text(encoding='utf-8');need('data-ig-r49-owner="R50_COUNT_PAY"' in txt,'owner '+row['route']);need('data-ig-profile="workspace"' in txt,'workspace profile '+row['route'])
  for a in REQ:need(txt.count(a)==1,a+' count '+row['route'])
  for token in ['id="tab-caja"','id="tab-cambio"','id="calc-toggle"','/assets/juego-contar-pagar.js']:need(token in txt,'Count/pay engine surface lost '+token)
 print(json.dumps({'section':'count-pay','routes':2,'static':'PASS'}))
if __name__=='__main__':main()
