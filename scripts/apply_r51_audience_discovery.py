#!/usr/bin/env python3
"""R51 A2 · connect the canonical 965-record age matrix to every discovery surface."""
from __future__ import annotations
import argparse,json,re
from pathlib import Path
from urllib.parse import urljoin,urlsplit

A_RE=re.compile(r'<a\b([^>]*)>',re.I)
BODY_RE=re.compile(r'<body\b([^>]*)>',re.I)
HREF_RE=re.compile(r'\bhref=(["\'])(.*?)\1',re.I|re.S)
ATTR_RE=lambda name:re.compile(r'(\s'+re.escape(name)+r'=)(["\']).*?\2',re.I|re.S)
ALLOWED=('AGE_0_12','AGE_13_17','AGE_18_PLUS','ALL_AGES')
ALLOWED_SET=set(ALLOWED)
SURFACE_ROOTS={
 'condition':('/es/neurodiversidad/condiciones/','/en/neurodiversity/conditions/'),
 'situation':('/es/situaciones/','/en/situations/'),
 'library':('/es/biblioteca/','/en/everyday-life/'),
 'data':('/es/datos/','/en/data/'),
 'research':('/es/investigacion/','/en/research/'),
 'support_directory':('/es/tramites/','/es/tramites/directorio/','/en/support-directory/'),
}
SEARCH_FILES=('search-safe-default.json','search-intentional-safe.json','search-adult-full-catalog.json')

def set_attr(attrs,name,value):
 pat=ATTR_RE(name)
 if pat.search(attrs):return pat.sub(lambda m:m.group(1)+'"'+value+'"',attrs,count=1)
 return attrs.rstrip()+f' {name}="{value}"'

def key_for(value,base_path='/'):
 if not value:return ''
 if '{{' in str(value):return ''
 base='https://irisgreen.eu'+(base_path if str(base_path).startswith('/') else '/'+str(base_path))
 try:u=urlsplit(urljoin(base,str(value)))
 except Exception:return ''
 if u.netloc and u.netloc not in ('irisgreen.eu','www.irisgreen.eu'):return ''
 path=re.sub(r'/+','/',u.path or '/')
 if path!='/' and path.endswith('/'):path=path[:-1]
 return path+(('#'+u.fragment) if u.fragment else '')

def route_for(path,root):
 rel=path.relative_to(root).as_posix()
 if rel=='index.html':return '/'
 if rel.endswith('/index.html'):return '/'+rel[:-10]
 return '/'+rel

def ordered_bands(values):
 s=set(values)
 return [x for x in ALLOWED if x in s]

def matrix(root):
 p=root/'assets/safety/age-classification-r51-global.json'
 g=json.loads(p.read_text(encoding='utf-8'))
 assert g['schema']=='R51_A2_GLOBAL_AGE_CLASSIFICATION/1.0'
 assert g['source_records']==965 and len(g['records'])==965
 assert g['totals']['unclassified']==0
 by_url={};by_id={};surface={k:set() for k in SURFACE_ROOTS}
 for r in g['records']:
  bands=r.get('age_bands') or []
  assert bands and set(bands)<=ALLOWED_SET,(r.get('content_id'),bands)
  assert not (r.get('sensitivity')=='S2_HIGH_SENSITIVITY' and 'ALL_AGES' in bands)
  cid=r['content_id'];by_id[cid]=bands
  surface[r['surface']].update(bands)
  for field in ('url_es','url_en'):
   k=key_for(r.get(field),'/')
   if k:
    if k in by_url and by_url[k]!=bands:raise AssertionError('Conflicting age route '+k)
    by_url[k]=bands
  if r['surface']=='research':
   n=int(cid.rsplit('-',1)[1])
   by_url[key_for(f'/es/investigacion/#estudio-{n}','/')]=bands
   by_url[key_for(f'/en/research/#study-{n}','/')]=bands
 surface_out={k:ordered_bands(v) for k,v in surface.items()}
 for name,roots in SURFACE_ROOTS.items():
  for route in roots:by_url[key_for(route,'/')]=surface_out[name]
 return g,by_id,by_url,surface_out

def annotate_html(root,by_url):
 pages=[root/'index.html',root/'404.html']
 for lang in ('es','en'):
  base=root/lang
  if base.is_dir():pages.extend(base.rglob('*.html'))
 tagged=0;gated=0
 for p in sorted(set(x for x in pages if x.is_file())):
  before=p.read_text(encoding='utf-8');route=route_for(p,root);after=before
  page_bands=by_url.get(key_for(route,'/'))
  if page_bands:
   m=BODY_RE.search(after)
   if not m:raise AssertionError('Age-gated page without body '+route)
   attrs=set_attr(m.group(1),'data-ig-page-age-bands',' '.join(page_bands))
   after=after[:m.start()]+'<body'+attrs+'>'+after[m.end():];gated+=1
  base_url='https://irisgreen.eu'+route
  def repl(m):
   nonlocal tagged
   attrs=m.group(1);hm=HREF_RE.search(attrs)
   if not hm:return m.group(0)
   href=hm.group(2)
   if href.startswith(('mailto:','tel:','javascript:')) or '{{' in href:return m.group(0)
   k=key_for(href,route)
   bands=by_url.get(k)
   if not bands:return m.group(0)
   new=set_attr(attrs,'data-ig-age-bands',' '.join(bands))
   if new!=attrs:tagged+=1
   return '<a'+new+'>'
  after=A_RE.sub(repl,after)
  if after!=before:p.write_text(after,encoding='utf-8')
 return tagged,gated

def enrich_search(root,by_url):
 out=root/'assets/safety';counts={}
 for name in SEARCH_FILES:
  p=out/name
  rows=json.loads(p.read_text(encoding='utf-8'));missing=[]
  for r in rows:
   candidates=[]
   for field in ('url_es','url_en'):
    k=key_for(r.get(field),'/')
    if k and k in by_url:candidates.append(by_url[k])
   if not candidates:missing.append(r.get('id') or r.get('url_es'));continue
   if any(x!=candidates[0] for x in candidates[1:]):raise AssertionError('Search ES/EN age mismatch')
   r['age_bands']=candidates[0]
   r.pop('audience',None)
  if missing:raise AssertionError('Search rows missing canonical age bands: '+repr(missing[:10]))
  p.write_text(json.dumps(rows,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
  counts[name]=len(rows)
 return counts

def enrich_research(root,by_id):
 p=root/'es/investigacion/estudios-textos.json'
 rows=json.loads(p.read_text(encoding='utf-8'));seen=set()
 for r in rows:
  n=int(r.get('n',0) or 0);cid=f'research-{n:03d}'
  bands=by_id.get(cid)
  if not bands:raise AssertionError('Research record missing age bands '+cid)
  r['ig_age_bands']=bands;seen.add(cid)
 if len(seen)!=132:raise AssertionError(f'Research age coverage {len(seen)}/132')
 p.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 htmlp=root/'es/investigacion/index.html';text=htmlp.read_text(encoding='utf-8')
 hook="      if (window.IGAudience && !window.IGAudience.allowedAgeBands(s.ig_age_bands || [])) return false;"
 if hook not in text:
  needle='    const rows = all.filter((s) => {'
  if needle not in text:raise AssertionError('Research renderer hook not found')
  text=text.replace(needle,needle+'\n'+hook,1)
  htmlp.write_text(text,encoding='utf-8')
 return len(seen)

def write_runtime(root,g,by_url,surface):
 payload={
  'schema':'R51_A2_AGE_RUNTIME/1.0',
  'source_schema':g['schema'],
  'source_manifest_sha256':g['source_manifest_sha256'],
  'source_records':965,
  'taxonomy':list(ALLOWED),
  'visible_by_filter':g['totals']['visible_by_filter'],
  'by_surface':surface,
  'by_url':{k:by_url[k] for k in sorted(by_url)},
 }
 p=root/'assets/safety/age-runtime-r51.json'
 p.write_text(json.dumps(payload,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
 return len(payload['by_url'])

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True);root=ap.parse_args().root.resolve()
 g,by_id,by_url,surface=matrix(root)
 search=enrich_search(root,by_url)
 research=enrich_research(root,by_id)
 runtime_routes=write_runtime(root,g,by_url,surface)
 tagged,gated=annotate_html(root,by_url)
 report={
  'schema':'R51_A2_GLOBAL_AGE_FILTER/1.0','records':965,'unclassified':0,
  'visible':g['totals']['visible_by_filter'],'search':search,'research':research,
  'runtime_routes':runtime_routes,'tagged_links':tagged,'gated_pages':gated,
  'filter_before_render':True
 }
 (root/'assets/r51-age-discovery-report.json').write_text(json.dumps(report,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
 print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__':main()
