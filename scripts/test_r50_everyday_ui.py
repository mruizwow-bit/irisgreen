#!/usr/bin/env python3
"""R50 Everyday life static gate."""
from pathlib import Path
import argparse,json
REQ=['/assets/ig-r42-materials.css','/assets/ig-audience.css','/assets/ig-r49-transversal.css','/assets/ig-r49-lang-bootstrap.js','/assets/ig-audience.js','/assets/ig-child-safe.js','/assets/interfaz-comun.js','/assets/musica.js','/assets/ig-r49-transversal.js']
def need(v,m):
 if not v:raise AssertionError(m)
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True);root=ap.parse_args().root.resolve()
 data=json.loads((root/'assets/r50-everyday-route-profiles.json').read_text(encoding='utf-8'))
 need(data['section']=='everyday-life' and data['total_routes']>=90,'Everyday life manifest incomplete')
 for row in data['routes']:
  txt=(root/row['file']).read_text(encoding='utf-8')
  need('data-ig-r49="1"' in txt,'R50 marker missing '+row['route'])
  need(f'data-ig-profile="{row["profile"]}"' in txt,'profile mismatch '+row['route'])
  need('data-ig-r49-owner="R50_EVERYDAY"' in txt,'owner mismatch '+row['route'])
  for asset in REQ:need(txt.count(asset)==1,f'{asset} count !=1 on '+row['route'])
 need('name="ig-r50-section" content="everyday-life"' not in (root/'es/investigacion/index.html').read_text(encoding='utf-8'),'Everyday life leaked into Research')
 print(json.dumps({'section':'everyday-life','routes':data['total_routes'],'static':'PASS'},ensure_ascii=False))
if __name__=='__main__':main()
