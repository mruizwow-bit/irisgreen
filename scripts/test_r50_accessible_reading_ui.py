#!/usr/bin/env python3
from pathlib import Path
import argparse,json
REQ=['/assets/ig-r42-materials.css','/assets/ig-audience.css','/assets/ig-r49-transversal.css','/assets/ig-r49-lang-bootstrap.js','/assets/ig-audience.js','/assets/ig-child-safe.js','/assets/interfaz-comun.js','/assets/musica.js','/assets/ig-r49-transversal.js','/assets/preferencias-lectura.js']
def need(v,m):
 if not v:raise AssertionError(m)
def main():
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);root=p.parse_args().root.resolve()
 prof=json.loads((root/'assets/r50-accessible-reading-route-profiles.json').read_text());need(prof['total_routes']==1,'Accessible reading routes !=1')
 txt=(root/'es/lectura-accesible/index.html').read_text(encoding='utf-8')
 need('data-ig-r49-owner="R50_ACCESSIBLE_READING"' in txt,'owner missing');need('data-ig-profile="content"' in txt,'content profile missing')
 for a in REQ:need(txt.count(a)==1,a+' count')
 need('<html lang="es"' in txt or "<html lang='es'" in txt,'Accessible reading must stay Spanish')
 need('Lectura accesible' in txt,'Accessible reading content lost')
 print(json.dumps({'section':'accessible-reading','locale':'es','static':'PASS'},ensure_ascii=False))
if __name__=='__main__':main()
