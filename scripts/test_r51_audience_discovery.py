#!/usr/bin/env python3
"""R51 audience/discovery static gate."""
from __future__ import annotations
import argparse,json,re
from pathlib import Path
from urllib.parse import urljoin,urlsplit
A_RE=re.compile(r'<a\b([^>]*)>',re.I);HREF_RE=re.compile(r'\bhref=(["\'])(.*?)\1',re.I|re.S)
def need(v,m):
 if not v:raise AssertionError(m)
def route_for(path,root):
 rel=path.relative_to(root).as_posix()
 if rel=='index.html':return '/'
 if rel.endswith('/index.html'):return '/'+rel[:-10]
 return '/'+rel
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True);root=ap.parse_args().root.resolve()
 reg=json.loads((root/'assets/safety/audience-surface-r51.json').read_text(encoding='utf-8'))
 need(reg['source_record_count']==965,'approved registry record count mismatch')
 need(reg['surfaces']['research']['audience']==['ADOLESCENCIA','ADULTEZ'],'Research audience mismatch')
 need(reg['surfaces']['support_directory']['audience']==['ADULTEZ'],'Support audience mismatch')
 es=(root/'index.html').read_text(encoding='utf-8');en=(root/'en/index.html').read_text(encoding='utf-8')
 for txt in (es,en):
  need('data-ig-audience-values="ADOLESCENCIA ADULTEZ"' in txt,'Research Home link not audience-tagged')
  need('data-ig-audience-values="ADULTEZ"' in txt,'Support Home link not audience-tagged')
 research=(root/'es/investigacion/index.html').read_text(encoding='utf-8')
 need('data-ig-page-audience="ADOLESCENCIA ADULTEZ"' in research,'Research direct gate missing')
 for path in [root/'es/tramites/index.html',root/'es/tramites/directorio/index.html']:
  need('data-ig-page-audience="ADULTEZ"' in path.read_text(encoding='utf-8'),'Support direct gate missing '+str(path))
 missing=[];tagged=0
 pages=[root/'index.html',root/'404.html']
 for lang in ('es','en'):
  base=root/lang
  if base.is_dir():pages.extend(base.rglob('*.html'))
 for p in pages:
  if not p.is_file():continue
  route=route_for(p,root);txt=p.read_text(encoding='utf-8');base='https://irisgreen.eu'+route
  for m in A_RE.finditer(txt):
   attrs=m.group(1);hm=HREF_RE.search(attrs)
   if not hm:continue
   href=hm.group(2)
   if href.startswith(('#','mailto:','tel:','javascript:')):continue
   u=urlsplit(urljoin(base,href))
   if u.netloc and u.netloc not in ('irisgreen.eu','www.irisgreen.eu'):continue
   path=u.path
   expected=None
   if path.startswith(('/es/investigacion/','/en/research/')):expected='ADOLESCENCIA ADULTEZ'
   elif path.startswith(('/es/tramites/','/en/support-directory/')):expected='ADULTEZ'
   if not expected:continue
   if f'data-ig-audience-values="{expected}"' not in attrs:missing.append((route,href,expected))
   else:tagged+=1
 need(not missing,'Unfiltered audience-limited links: '+repr(missing[:10]))
 print(json.dumps({'audience_registry':'PASS','tagged_limited_links':tagged,'unfiltered':0},ensure_ascii=False))
if __name__=='__main__':main()
