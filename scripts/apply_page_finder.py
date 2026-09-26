#!/usr/bin/env python3
"""A server-rendered section index, enhanced with a local filter. No stored data."""
import argparse,hashlib,html,re
from pathlib import Path
from html_spans import Document,edit

def apply(root):
 count=0
 versions={name:hashlib.sha256((root/'assets'/name).read_bytes()).hexdigest()[:12] for name in ['ig-cielo.css','ig-cielo.js','ig-cielo-vivo.js','ig-sistema-solar.js','ig-exoplanetas.js','rincon-calma.js','rincon-calma.css','tarjeta-iris.css']}
 for path in sorted(root.rglob('*.html')):
  text=path.read_text()
  if path.relative_to(root).parts[0]=='en':
   text=text.replace('href="/es/taller/"','href="/en/workshop/"')
  for name,version in versions.items():
   text=re.sub(r'(/assets/'+re.escape(name)+r')(?:\?[^\"\s>]*)?',lambda m:m[1]+'?v='+version,text)
  path.write_text(text)
  doc=Document(text);main=next((n for n in doc.nodes if n['tag']=='main' and not any(a['tag'] in {'noscript','template'} and a['start']<n['start']<a.get('close_start',0) for a in doc.nodes)),None);head=doc.one('head');body=doc.one('body')
  if not main or not head or not body or 'id="ig-page-finder"' in text:continue
  if '/imprimir/' in str(path) or '/print/' in str(path):continue
  headings=[n for n in doc.nodes if n['tag']=='h2' and main['open_end']<=n['start']<main['close_start']]
  headings=[n for n in headings if not any(a['start']<n['start']<a.get('close_start',0) and (a['tag'] in {'template','noscript','dialog'} or 'hidden' in a['attrs'] or a['attrs'].get('aria-hidden')=='true') for a in doc.nodes)]
  if len(headings)<2:continue
  en=doc.one('html')['attrs'].get('lang','es').startswith('en');changes=[];links=[]
  ids={n['attrs'].get('id') for n in doc.nodes}
  for i,n in enumerate(headings):
   label=html.unescape(re.sub('<[^>]*>',' ',text[n['open_end']:n['close_start']])).strip();label=re.sub(r'\s+',' ',label)
   # Un heading DC puede contener una expresión que solo cobra sentido tras
   # hidratar. No la copies al índice estático: html.unescape convertiría las
   # entidades seguras de nuevo en {{...}} dentro del HTML publicado.
   if not label or '{{' in label or '}}' in label:continue
   ident=n['attrs'].get('id')
   if not ident:
    ident=f'ig-section-{i+1}'
    while ident in ids:ident+='x'
    ids.add(ident);changes.append((n['open_end']-1,n['open_end']-1,f' id="{ident}"'))
   links.append(f'<li><a href="#{html.escape(ident,quote=True)}">{html.escape(label)}</a></li>')
  title='Find a section on this page' if en else 'Buscar una sección en esta página'
  label='Section name' if en else 'Nombre de la sección'
  empty='No matching sections.' if en else 'No hay secciones con ese nombre.'
  nav=f'<details id="ig-page-finder" class="ig-page-finder"><summary>{title}</summary><nav aria-label="{title}"><div class="ig-page-filter" hidden><label for="ig-section-query">{label}</label><input id="ig-section-query" type="search" autocomplete="off" aria-controls="ig-section-list"></div><ul id="ig-section-list">'+''.join(links)+f'</ul><p class="ig-section-empty" hidden>{empty}</p><p class="ig-section-status" role="status"></p></nav></details>'
  changes.append((main['open_end'],main['open_end'],nav))
  for name,tag in [('page-finder.css','style'),('page-finder.js','script')]:
   version=hashlib.sha256((root/'assets'/name).read_bytes()).hexdigest()[:12]
   insert=f'<link rel="stylesheet" href="/assets/{name}?v={version}">' if tag=='style' else f'<script defer src="/assets/{name}?v={version}"></script>'
   target=head if tag=='style' else body;changes.append((target['close_start'],target['close_start'],insert))
  path.write_text(edit(text,changes));count+=1
 print(f'Section finder: {count} pages')
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);apply(p.parse_args().root)
