#!/usr/bin/env python3
"""R50 A2 · apply R42/R02 transversal UI only to Research."""
from __future__ import annotations
import argparse,json,re
from pathlib import Path
BODY_RE=re.compile(r"<body\b([^>]*)>",re.I)
MAIN_RE=re.compile(r"<main\b([^>]*)>",re.I)
ASSETS=(
 ('css','/assets/ig-r42-materials.css?v=r50-research-1'),
 ('css','/assets/ig-audience.css?v=r50-research-1'),
 ('css','/assets/ig-r49-transversal.css?v=r50-research-1'),
 ('js','/assets/ig-r49-lang-bootstrap.js?v=r50-research-1'),
 ('js','/assets/ig-audience.js?v=r50-research-1'),
 ('js','/assets/ig-child-safe.js?v=r50-research-1'),
 ('js','/assets/interfaz-comun.js?v=r50-research-1'),
 ('js','/assets/musica.js?v=r50-research-1'),
 ('js','/assets/ig-r49-transversal.js?v=r50-research-1'),
)
def set_attr(attrs,name,value):
 pat=re.compile(r'(\s'+re.escape(name)+r'=)(["\']).*?\2',re.I|re.S)
 if pat.search(attrs):return pat.sub(lambda m:m.group(1)+'"'+value+'"',attrs,count=1)
 return attrs.rstrip()+f' {name}="{value}"'
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True);root=ap.parse_args().root.resolve()
 p=root/'es/investigacion/index.html'
 if not p.is_file():raise FileNotFoundError(p)
 before=p.read_text(encoding='utf-8');m=BODY_RE.search(before)
 if not m:raise AssertionError('Research page without body')
 attrs=m.group(1)
 for k,v in [('data-ig-r49','1'),('data-ig-profile','browse'),('data-ig-materials','r42'),('data-ig-r49-owner','R50_RESEARCH')]:attrs=set_attr(attrs,k,v)
 after=before[:m.start()]+'<body'+attrs+'>'+before[m.end():]
 mm=MAIN_RE.search(after)
 if mm and not re.search(r'\bid=["\']',mm.group(1),re.I):
  a=mm.group(1).rstrip()+' id="main"';after=after[:mm.start()]+'<main'+a+'>'+after[mm.end():]
 inject=[]
 if '/assets/preferencias-lectura.js' not in after:inject.append('<script src="/assets/preferencias-lectura.js"></script>')
 for kind,url in ASSETS:
  bare=url.split('?')[0]
  if bare in after:continue
  if kind=='css':inject.append(f'<link rel="stylesheet" href="{url}">')
  else:
   defer=' defer' if any(x in bare for x in ('ig-child-safe.js','interfaz-comun.js','musica.js','ig-r49-transversal.js')) else ''
   inject.append(f'<script{defer} src="{url}"></script>')
 if 'name="ig-r50-section"' not in after:inject.insert(0,'<meta name="ig-r50-section" content="research">')
 if inject:after=re.sub(r'</head>',''.join(inject)+'</head>',after,count=1,flags=re.I)
 if after!=before:p.write_text(after,encoding='utf-8')
 payload={'version':'R50-RESEARCH-1','section':'research','total_routes':1,'profiles':{'browse':1},'routes':[{'route':'/es/investigacion/','file':'es/investigacion/index.html','profile':'browse','locales':['es','en']}]}
 (root/'assets/r50-research-route-profiles.json').write_text(json.dumps(payload,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
 print(json.dumps({'section':'research','routes':1,'locales':['es','en']},ensure_ascii=False))
if __name__=='__main__':main()
