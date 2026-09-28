#!/usr/bin/env python3
from pathlib import Path
import argparse,json
REQ=['/assets/ig-r42-materials.css','/assets/ig-audience.css','/assets/ig-r49-transversal.css','/assets/ig-r49-lang-bootstrap.js','/assets/ig-audience.js','/assets/ig-child-safe.js','/assets/interfaz-comun.js','/assets/musica.js','/assets/ig-r49-transversal.js','/assets/preferencias-lectura.js']
def need(v,m):
 if not v:raise AssertionError(m)
def main():
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);root=p.parse_args().root.resolve()
 prof=json.loads((root/'assets/r50-iris-card-route-profiles.json').read_text());need(prof['total_routes']==2,'Iris Card routes !=2')
 for row in prof['routes']:
  txt=(root/row['file']).read_text(encoding='utf-8');need('data-ig-r49-owner="R50_IRIS_CARD"' in txt,'owner '+row['route']);need('data-ig-profile="workspace"' in txt,'workspace '+row['route'])
  for a in REQ:need(txt.count(a)==1,a+' count '+row['route'])
  for token in ['id="ti-cuesta"','id="ti-ayuda"','id="ti-necesito"','id="ti-preview"','/assets/tarjeta-iris.js']:need(token in txt,'Iris Card surface lost '+token)
 js=(root/'assets/tarjeta-iris.js').read_text(encoding='utf-8');need('localStorage' not in js,'Iris Card must not use localStorage');need('sessionStorage' in js,'Iris Card session-only state missing')
 print(json.dumps({'section':'iris-card','routes':2,'storage':'session-only','static':'PASS'}))
if __name__=='__main__':main()
