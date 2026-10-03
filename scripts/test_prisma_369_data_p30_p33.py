#!/usr/bin/env python3
from pathlib import Path
import argparse,re

FORBIDDEN_ES=[
 'Están montadas las 49 páginas de la sección.',
 'Ámbitos incluidos',
 'Fuentes y mantenimiento',
 'sin construir rankings falsos',
]
FORBIDDEN_EN=[
 'The 49 pages in this section are mounted.',
 'Areas included',
 'Sources and maintenance',
 'without creating false rankings',
]

def need(v,msg):
 if not v: raise AssertionError(msg)

def check(path,lang):
 txt=path.read_text(encoding='utf-8')
 prefix='ES' if lang=='es' else 'EN'
 need('id="ig-data-search"' in txt,prefix+' search')
 need('id="ig-data-region"' in txt,prefix+' region')
 need('id="ig-data-topic"' in txt,prefix+' topic')
 need('id="ig-data-reset"' in txt,prefix+' reset')
 need('id="ig-data-count"' in txt and 'role="status"' in txt,prefix+' live count')
 need('id="ig-data-results"' in txt,prefix+' results grid')
 need(txt.count('data-region=')==49,prefix+' 49 region-tagged cards')
 need(txt.count('data-topic=')==49,prefix+' 49 topic-tagged cards')
 need(txt.count('<h2>World</h2>')==0 and txt.count('<h2>Mundo</h2>')==0,prefix+' no geography sections')
 need('ig-data-method' in txt,prefix+' compact method')
 for phrase in (FORBIDDEN_ES if lang=='es' else FORBIDDEN_EN):
  need(phrase not in txt,prefix+' forbidden copy: '+phrase)
 need('/assets/ig-data-hub-r50.css' in txt,prefix+' css')
 need('/assets/ig-data-hub-r50.js' in txt,prefix+' js')

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True)
 root=ap.parse_args().root.resolve()
 check(root/'es/datos/index.html','es')
 check(root/'en/data/index.html','en')
 js=(root/'assets/ig-data-hub-r50.js').read_text(encoding='utf-8')
 need('.normalize(' in js,'normalized search')
 need("card.hidden=!show" in js,'filter hides nonmatches')
 print('ISSUE_369_P30_P33_DATA_HUB_PASS')

if __name__=='__main__':main()
