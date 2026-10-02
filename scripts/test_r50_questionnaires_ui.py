#!/usr/bin/env python3
from pathlib import Path
import argparse,json
REQ=['/assets/ig-r42-materials.css','/assets/ig-audience.css','/assets/ig-r49-transversal.css','/assets/ig-r49-lang-bootstrap.js','/assets/ig-audience.js','/assets/ig-child-safe.js','/assets/interfaz-comun.js','/assets/musica.js','/assets/ig-r49-transversal.js']
def need(v,m):
 if not v:raise AssertionError(m)
def main():
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);root=p.parse_args().root.resolve()
 prof=json.loads((root/'assets/r50-questionnaires-route-profiles.json').read_text());need(prof['total_routes']==1,'Questionnaires routes !=1');need(prof['audience']==['ADULTEZ'],'Questionnaires audience mismatch')
 txt=(root/'es/cuestionarios/index.html').read_text(encoding='utf-8')
 need('data-ig-r49-owner="R50_QUESTIONNAIRES"' in txt,'owner missing');need('data-ig-profile="workspace"' in txt,'workspace missing');need('data-ig-page-audience="ADULTEZ"' in txt,'adult page gate missing')
 for a in REQ:need(txt.count(a)==1,a+' count')
 for token in ['Orientan. No diagnostican.','Solo para mayores de 18 años','AQ-10']:need(token in txt,'Questionnaires content lost '+token)
 print(json.dumps({'section':'questionnaires','audience':'ADULTEZ','static':'PASS'}))
if __name__=='__main__':main()
