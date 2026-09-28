#!/usr/bin/env python3
from pathlib import Path
import argparse,json
REQ=['/assets/ig-r42-materials.css','/assets/ig-audience.css','/assets/ig-r49-transversal.css','/assets/ig-r49-lang-bootstrap.js','/assets/ig-audience.js','/assets/ig-child-safe.js','/assets/interfaz-comun.js','/assets/musica.js','/assets/ig-r49-transversal.js']
def need(v,m):
 if not v:raise AssertionError(m)
def main():
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);root=p.parse_args().root.resolve();txt=(root/'es/sobre-iris-green/index.html').read_text(encoding='utf-8')
 need('data-ig-r49-owner="R50_ABOUT"' in txt,'About owner missing');need('data-ig-profile="content"' in txt,'About content profile missing')
 for a in REQ:need(txt.count(a)==1,a+' count')
 for token in ['"title": "About Iris Green"','Sobre Iris Green','/es/metodologia/?lang=en']:need(token in txt,'About translation/content lost '+token)
 print(json.dumps({'section':'about','static':'PASS'}))
if __name__=='__main__':main()
