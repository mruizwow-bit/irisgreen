#!/usr/bin/env python3
"""Apply Maria's shared Iris brief without reserializing editorial HTML."""
import argparse,json,re,shutil,hashlib
from collections import Counter
from pathlib import Path
from html_spans import Document,edit
ROOT=Path(__file__).resolve().parents[1]
FLOWER=re.compile(r'(?:v40-brand-symbol|iris[-_]?(?:logo|flower)|logo[-_]?iris)',re.I)
TOP={'/es/taller/','/en/workshop/','/es/intereses/','/en/interests/','/es/sitio-tranquilo/','/en/quiet-space/'}

def apply(root):
 root=Path(root);inventory=[];families=Counter()
 for p in sorted(root.rglob('*.html')):
  text=p.read_text();doc=Document(text);changes=[];removed=0;rel=p.relative_to(root).as_posix()
  for n in doc.nodes:
   attrs=n['attrs']
   if n['tag']=='img' and (FLOWER.search(attrs.get('src','')) or 'flor de iris' in attrs.get('alt','').lower()):changes.append((n['start'],n['end'],''));removed+=1
   if n['tag']=='link' and 'icon' in attrs.get('rel','').split():changes.append((n['start'],n['end'],'<link rel="icon" href="/assets/iris-favicon.svg">'))
  head=doc.one('head');kind='secondary';classes=' '.join(n['attrs'].get('class','') for n in doc.nodes)
  if 'jg-main' in classes:kind='resources-catalogue'
  elif 'ri-main' in classes:kind='resources-hub'
  elif 'rv-page' in classes:kind='visual-routines'
  elif '/taller/' in rel or '/workshop/' in rel:kind='workshop'
  elif '/intereses/' in rel or '/interests/' in rel:kind='interests'
  elif '/sitio-tranquilo/' in rel or '/quiet-space/' in rel:kind='quiet-space'
  if rel in ['es/recursos/index.html','en/resources/index.html']:
   for a in doc.nodes:
    if a['tag']=='a' and 'ri-card' in a['attrs'].get('class','').split() and a['attrs'].get('href') in TOP:
     parents=[n for n in doc.nodes if n['tag']=='li' and n['start']<a['start'] and n.get('end',0)>a['end']];li=min(parents,key=lambda n:n['end']-n['start']);changes.append((li['start'],li['end'],''))
  brief_hash=hashlib.sha256((ROOT/'assets/iris-brief-r08.css').read_bytes()).hexdigest()[:12]
  styles=f'<link rel="stylesheet" href="/assets/iris-brief-r08.css?v={brief_hash}">'
  if rel=='index.html':
   kind='home';home=doc.one(id='home-view');body=doc.one('body');nav=doc.one('nav',**{'class':'nav'})
   changes.append((home['open_end'],home['open_end'],'<div class="iris-home-content">'))
   changes.append((home['close_start'],home['close_start'],'</div>'+(ROOT/'sabik/iris-panel.html').read_text()))
   mount_hash=hashlib.sha256((ROOT/'sabik/iris-mount.css').read_bytes()).hexdigest()[:12]
   styles+=f'<link rel="stylesheet" href="/sabik/iris-mount.css?v={mount_hash}">'
   scripts=''.join(f'<script defer src="{src}"></script>' for src in ['/sabik/sabik-motion-r37.js','/sabik/sabik-web-r01.js','/sabik/retrieval-panel.js','/assets/iris-brief-r08.js'])+'<script type="module" src="/sabik/iris-mount.mjs"></script>'
   changes.append((body['close_start'],body['close_start'],scripts))
   changes.append((nav['close_start'],nav['close_start'],'<a href="/es/intereses/" data-iris-top="interests">Tus intereses</a><a href="/es/taller/" data-iris-top="workshop">El taller</a>'))
  changes.append((head['close_start'],head['close_start'],styles))
  result=edit(text,changes).replace('https://irisgreen.eu/img/v40-brand-symbol.webp','https://irisgreen.eu/assets/iris-wordmark.svg').replace('Símbolo de Iris Green: una flor de iris','Iris Green').replace('Iris Green symbol: an iris flower','Iris Green')
  p.write_text(result);families[kind]+=1;inventory.append({'path':rel,'template':kind,'flower_images_removed':removed,'shared_brief':True,'lang':doc.one('html')['attrs'].get('lang')})
 dest=root/'sabik';dest.mkdir(exist_ok=True)
 for p in (ROOT/'sabik').rglob('*'):
  if p.is_file() and p.suffix in {'.js','.mjs','.png','.svg'}:
   target=dest/p.relative_to(ROOT/'sabik');target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,target)
 shutil.copy2(ROOT/'sabik/iris-mount.css',dest/'iris-mount.css')
 report=ROOT/'reports/iris-brief-r08';report.mkdir(parents=True,exist_ok=True)
 (report/'inventory.json').write_text(json.dumps({'pages':inventory,'templates':dict(families),'scope':'shared presentation only; printables and visual scenes retain their own formats'},ensure_ascii=False,indent=2))
 print(json.dumps({'brief_pages':len(inventory),'templates':dict(families),'flower_images_removed':sum(x['flower_images_removed'] for x in inventory),'sabik_transport_enabled':False}))
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',required=True);apply(p.parse_args().root)
