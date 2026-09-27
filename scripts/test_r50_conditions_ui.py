#!/usr/bin/env python3
"""R50 Conditions static gate."""
from pathlib import Path
import argparse,json
REQ=['/assets/ig-r42-materials.css','/assets/ig-audience.css','/assets/ig-r49-transversal.css','/assets/ig-r49-lang-bootstrap.js','/assets/ig-audience.js','/assets/ig-child-safe.js','/assets/interfaz-comun.js','/assets/musica.js','/assets/ig-r49-transversal.js']
def need(v,m):
 if not v:raise AssertionError(m)
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True);root=ap.parse_args().root.resolve()
 data=json.loads((root/'assets/r50-conditions-route-profiles.json').read_text(encoding='utf-8'))
 need(data['section']=='conditions' and data['total_routes']>=4,'Conditions manifest incomplete')
 for row in data['routes']:
  p=root/row['file'];txt=p.read_text(encoding='utf-8')
  need('data-ig-r49="1"' in txt,'R50 marker missing '+row['route'])
  need(f'data-ig-profile="{row["profile"]}"' in txt,'profile mismatch '+row['route'])
  need('data-ig-r49-owner="R50_CONDITIONS"' in txt,'owner mismatch '+row['route'])
  for asset in REQ:need(txt.count(asset)==1,f'{asset} count !=1 on '+row['route'])
 need((root/'es/situaciones/index.html').is_file(),'Situations control route missing')
 need('name="ig-r50-section" content="conditions"' not in (root/'es/situaciones/index.html').read_text(encoding='utf-8'),'R50 Conditions leaked into Situations')
 js=(root/'assets/ig-r49-transversal.js').read_text(encoding='utf-8')
 hs=js[js.index('function upgradeHeader(){'):js.index('function upgradeFooter(){')]
 for token in ["data-ig-r49-search","data-ig-r49-stage","data-ig-r49-more","ig-r49-primary"]:need(token not in hs,'forbidden top-bar control '+token)
 for token in ["data-ig-r49-settings","data-ig-music","ig-r49-lang","Accesibilidad","Accessibility"]:need(token in js,'missing global utility '+token)
 print(json.dumps({'section':'conditions','routes':data['total_routes'],'static':'PASS'},ensure_ascii=False))
if __name__=='__main__':main()
