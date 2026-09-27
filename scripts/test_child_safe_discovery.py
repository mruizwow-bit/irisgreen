#!/usr/bin/env python3
from __future__ import annotations
import argparse,json,re
from pathlib import Path
from urllib.parse import urljoin,urlparse

A_RE=re.compile(r'<a\b(?P<attrs>[^>]*)>(?P<body>.*?)</a>',re.I|re.S)
HREF_RE=re.compile(r'\bhref=(["\'])(?P<href>.*?)\1',re.I|re.S)
CATALOGS=(
 'es/neurodiversidad/condiciones/index.html',
 'en/neurodiversity/conditions/index.html',
 'es/biblioteca/index.html',
 'en/everyday-life/index.html',
)
SITE='https://irisgreen.eu'

def clean(value,base):
 u=urlparse(urljoin(base,value))
 if u.netloc and u.netloc not in ('irisgreen.eu','www.irisgreen.eu'):return ''
 return u.path.rstrip('/') or '/'

def current_route(rel):
 return ('/'+rel[:-10]).rstrip('/') if rel.endswith('index.html') else ('/'+rel).rstrip('/')

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True);a=ap.parse_args();root=a.root.resolve()
 meta=root/'assets/content-safety/s2-discovery-routes.json';assert meta.is_file(),meta
 data=json.loads(meta.read_text(encoding='utf-8'));rows=data.get('records') or []
 assert rows, 'No present S2 discovery metadata'
 routes={str(r['route']).rstrip('/') or '/' for r in rows}
 assert all(r.get('title') and r.get('lang') in ('es','en') and r.get('surface') in ('condition','everyday_life') for r in rows)

 for rel in CATALOGS:
  p=root/rel;assert p.is_file(),p
  s=p.read_text(encoding='utf-8')
  assert '/assets/ig-child-safety.js?v=r42-child-1' in s,rel
  assert '/assets/ig-child-safety-discovery.js?v=r42-child-1' in s,rel
  for m in A_RE.finditer(s):
   hm=HREF_RE.search(m.group('attrs'))
   if hm:
    assert clean(hm.group('href'),SITE+'/'+rel) not in routes,(rel,hm.group('href'))

 leftovers=[]
 for p in root.rglob('*.html'):
  rel=p.relative_to(root).as_posix()
  here=current_route(rel)
  s=p.read_text(encoding='utf-8')
  for m in A_RE.finditer(s):
   hm=HREF_RE.search(m.group('attrs'))
   if not hm:continue
   target=clean(hm.group('href'),SITE+'/'+rel)
   if target in routes and target!=here:
    leftovers.append((rel,hm.group('href')))
 assert not leftovers,leftovers[:20]

 js=(root/'assets/ig-child-safety-discovery.js').read_text(encoding='utf-8')
 assert "policy.getAudience()==='adult'" in js
 assert "/assets/content-safety/s2-discovery-routes.json" in js
 assert "/assets/content/full/" not in js
 assert "localStorage" not in js and "sessionStorage" not in js

 report=json.loads((root/'assets/content-safety/discovery-filter-report.json').read_text(encoding='utf-8'))
 assert report['status']=='PASS'
 print('R42_CHILD_SAFE_DISCOVERY_PASS',{'records':len(rows),'routes':len(routes),'cards_removed':report['cards_removed'],'links_neutralized':report['links_neutralized']})
if __name__=='__main__':main()
