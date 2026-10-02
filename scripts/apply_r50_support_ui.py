#!/usr/bin/env python3
"""R50 A2 · apply R42/R02 transversal UI only to Support and procedures."""
from __future__ import annotations
import argparse,json,re
from pathlib import Path
BODY_RE=re.compile(r"<body\b([^>]*)>",re.I);MAIN_RE=re.compile(r"<main\b([^>]*)>",re.I)
ASSETS=(('css','/assets/ig-r42-materials.css?v=r50-support-1'),('css','/assets/ig-audience.css?v=r50-support-1'),('css','/assets/ig-r49-transversal.css?v=r50-support-1'),('js','/assets/ig-r49-lang-bootstrap.js?v=r50-support-1'),('js','/assets/ig-audience.js?v=r50-support-1'),('js','/assets/ig-child-safe.js?v=r50-support-1'),('js','/assets/interfaz-comun.js?v=r50-support-1'),('js','/assets/musica.js?v=r50-support-1'),('js','/assets/ig-r49-transversal.js?v=r50-support-1'))
ROUTES=('/es/tramites/','/es/tramites/directorio/')
def route_for(path,root):
 rel=path.relative_to(root).as_posix();return '/'+(rel[:-10] if rel.endswith('/index.html') else rel)
def set_attr(attrs,name,value):
 pat=re.compile(r'(\s'+re.escape(name)+r'=)(["\']).*?\2',re.I|re.S)
 return pat.sub(lambda m:m.group(1)+'"'+value+'"',attrs,count=1) if pat.search(attrs) else attrs.rstrip()+f' {name}="{value}"'
def one(path,root):
 before=path.read_text(encoding='utf-8');route=route_for(path,root)
 if route not in ROUTES:raise AssertionError('Unexpected Support route '+route)
 m=BODY_RE.search(before)
 if not m:raise AssertionError('Support page without body '+route)
 attrs=m.group(1)
 for k,v in [('data-ig-r49','1'),('data-ig-profile','browse'),('data-ig-materials','r42'),('data-ig-r49-owner','R50_SUPPORT')]:attrs=set_attr(attrs,k,v)
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
 if 'name="ig-r50-section"' not in after:inject.insert(0,'<meta name="ig-r50-section" content="support">')
 if inject:after=re.sub(r'</head>',''.join(inject)+'</head>',after,count=1,flags=re.I)
 if after!=before:path.write_text(after,encoding='utf-8')
 return {'route':route,'file':path.relative_to(root).as_posix(),'profile':'browse','locale_mode':'query-es-en'}
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True);root=ap.parse_args().root.resolve()
 pages=[root/'es/tramites/index.html',root/'es/tramites/directorio/index.html']
 if not all(p.is_file() for p in pages):raise AssertionError('Support routes missing')
 rows=[one(p,root) for p in pages]
 payload={'version':'R50-SUPPORT-1','section':'support','total_routes':len(rows),'profiles':{'browse':2},'routes':rows}
 (root/'assets/r50-support-route-profiles.json').write_text(json.dumps(payload,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
 print(json.dumps({'section':'support','routes':len(rows),'profiles':payload['profiles']},ensure_ascii=False))
if __name__=='__main__':main()
