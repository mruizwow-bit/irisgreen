#!/usr/bin/env python3
from pathlib import Path
import argparse,json
REQ=['/assets/ig-r42-materials.css','/assets/ig-audience.css','/assets/ig-r49-transversal.css','/assets/ig-r49-lang-bootstrap.js','/assets/ig-audience.js','/assets/ig-child-safe.js','/assets/interfaz-comun.js','/assets/musica.js','/assets/ig-r49-transversal.js']
def need(v,m):
 if not v:raise AssertionError(m)
def main():
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);root=p.parse_args().root.resolve()
 prof=json.loads((root/'assets/r50-games-route-profiles.json').read_text())
 need(prof['total_routes']==2,'Games manifest must contain 2 routes')
 for row in prof['routes']:
  txt=(root/row['file']).read_text(encoding='utf-8');need('data-ig-r49-owner="R50_GAMES"' in txt,'owner '+row['route']);need('data-ig-profile="browse"' in txt,'profile '+row['route'])
  for a in REQ:need(txt.count(a)==1,a+' count '+row['route'])
 meta=json.loads((root/'assets/data/r42-games-metadata.json').read_text());games=meta['games'];need(len(games)==297,'Game count changed')
 counts={k:sum(k in g.get('stages',[]) for g in games) for k in ('inf','ado','adu','todas')}
 need(counts=={'inf':11,'ado':45,'adu':44,'todas':240},'Stage metadata changed '+repr(counts))
 js=(root/'assets/juegos-iris.js').read_text(encoding='utf-8')
 for token in ['window.IGAudience','audienceEtapa','etapaAplica(D.juegos[gi],locked)','ig:audience-change']:need(token in js,'Games audience integration missing '+token)
 print(json.dumps({'section':'games','routes':2,'games':297,'stage_counts':counts,'static':'PASS'},ensure_ascii=False))
if __name__=='__main__':main()
