#!/usr/bin/env python3
from pathlib import Path
import argparse,json
REQ=['/assets/ig-r42-materials.css','/assets/ig-audience.css','/assets/ig-r49-transversal.css','/assets/ig-r49-lang-bootstrap.js','/assets/ig-audience.js','/assets/ig-child-safe.js','/assets/interfaz-comun.js','/assets/musica.js','/assets/ig-r49-transversal.js']
def need(v,m):
 if not v:raise AssertionError(m)
def main():
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);root=p.parse_args().root.resolve()
 prof=json.loads((root/'assets/r50-living-abroad-route-profiles.json').read_text());need(prof['total_routes']==1,'Living abroad routes !=1')
 txt=(root/'es/vivir-fuera/index.html').read_text(encoding='utf-8')
 need('data-ig-r49-owner="R50_LIVING_ABROAD"' in txt,'owner missing');need('data-ig-profile="browse"' in txt,'browse profile missing')
 for a in REQ:need(txt.count(a)==1,a+' count')
 for token in ['El sistema de cada país','Portugal','data-ig-filter="chips"','langButtons']:need(token in txt,'Living abroad content/runtime lost '+token)
 print(json.dumps({'section':'living-abroad','static':'PASS'}))
if __name__=='__main__':main()
