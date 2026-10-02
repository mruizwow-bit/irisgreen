#!/usr/bin/env python3
from pathlib import Path
import argparse,json,re
REQ=['/assets/ig-r42-materials.css','/assets/ig-audience.css','/assets/ig-r49-transversal.css','/assets/ig-r49-lang-bootstrap.js','/assets/ig-audience.js','/assets/ig-child-safe.js','/assets/interfaz-comun.js','/assets/musica.js','/assets/ig-r49-transversal.js']
def need(v,m):
 if not v:raise AssertionError(m)
def main():
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);root=p.parse_args().root.resolve()
 prof=json.loads((root/'assets/r50-printable-routines-route-profiles.json').read_text());need(prof['total_routes']==2,'Printable routine routes !=2')
 for row in prof['routes']:
  txt=(root/row['file']).read_text(encoding='utf-8');need('data-ig-r49-owner="R50_PRINTABLE_ROUTINES"' in txt,'owner '+row['route']);need('data-ig-profile="browse"' in txt,'profile '+row['route'])
  for a in REQ:need(txt.count(a)==1,a+' count '+row['route'])
 data=(root/'assets/data/rutinas-imprimibles-data.js').read_text(encoding='utf-8');m=re.search(r'var P=(\{.*\});P\.pictos=',data,re.S);need(bool(m),'Routine data missing');d=json.loads(m.group(1));packs=d['packs'];need(len(packs)==109,'Routine count changed')
 counts={k:sum(k in x.get('e',[]) for x in packs) for k in ('inf','ado','adu','todas')};need(counts=={'inf':8,'ado':21,'adu':22,'todas':83},'Routine metadata changed '+repr(counts))
 js=(root/'assets/rutinas-imprimibles.js').read_text(encoding='utf-8')
 for token in ['window.IGAudience','audienceEtapa','etapaAplicaPack(p,locked)','ig:audience-change']:need(token in js,'Printable routines audience integration missing '+token)
 print(json.dumps({'section':'printable-routines','routines':109,'stage_counts':counts,'static':'PASS'},ensure_ascii=False))
if __name__=='__main__':main()
