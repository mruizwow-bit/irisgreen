#!/usr/bin/env python3
"""R51 A2 canonical 965-record age filter static gate."""
from __future__ import annotations
import argparse,json,re
from pathlib import Path
from urllib.parse import urljoin,urlsplit
A_RE=re.compile(r'<a\b([^>]*)>',re.I);HREF_RE=re.compile(r'\bhref=(["\'])(.*?)\1',re.I|re.S)
ALLOWED={'AGE_0_12','AGE_13_17','AGE_18_PLUS','ALL_AGES'}
LEGACY={'INFANCIA','ADOLESCENCIA','ADULTEZ','TRANSVERSAL','children','teenagers','adults','any'}
def need(v,m):
 if not v:raise AssertionError(m)
def key_for(value,base='/'):
 if not value or '{{' in str(value):return ''
 try:u=urlsplit(urljoin('https://irisgreen.eu'+base,str(value)))
 except Exception:return ''
 if u.netloc and u.netloc not in ('irisgreen.eu','www.irisgreen.eu'):return ''
 p=re.sub(r'/+','/',u.path or '/')
 if p!='/' and p.endswith('/'):p=p[:-1]
 return p+(('#'+u.fragment) if u.fragment else '')
def route_for(path,root):
 rel=path.relative_to(root).as_posix()
 if rel=='index.html':return '/'
 if rel.endswith('/index.html'):return '/'+rel[:-10]
 return '/'+rel
def body_attr(text,name):
 m=re.search(r'<body\b([^>]*)>',text,re.I)
 if not m:return None
 x=re.search(r'\b'+re.escape(name)+r'=(["\'])(.*?)\1',m.group(1),re.I|re.S)
 return x.group(2) if x else None
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True);root=ap.parse_args().root.resolve()
 g=json.loads((root/'assets/safety/age-classification-r51-global.json').read_text(encoding='utf-8'))
 need(g['source_records']==965 and len(g['records'])==965,'global matrix coverage mismatch')
 need(g['totals']['unclassified']==0,'global matrix has unclassified rows')
 need(g['totals']['visible_by_filter']=={'AGE_0_12':334,'AGE_13_17':623,'AGE_18_PLUS':955,'ALL_AGES':321},'visible totals changed')
 for r in g['records']:
  need(r['age_bands'] and set(r['age_bands'])<=ALLOWED,'invalid age bands '+r['content_id'])
  need(not(set(r['age_bands'])&LEGACY),'legacy age taxonomy emitted '+r['content_id'])
  need(not(r['sensitivity']=='S2_HIGH_SENSITIVITY' and 'ALL_AGES' in r['age_bands']),'S2 classified ALL_AGES '+r['content_id'])
 runtime=json.loads((root/'assets/safety/age-runtime-r51.json').read_text(encoding='utf-8'))
 need(runtime['schema']=='R51_A2_AGE_RUNTIME/1.0','runtime schema mismatch')
 need(runtime['source_manifest_sha256']==g['source_manifest_sha256'],'runtime source mismatch')
 need(runtime['visible_by_filter']==g['totals']['visible_by_filter'],'runtime totals mismatch')
 need(set(runtime['taxonomy'])==ALLOWED and not(set(runtime['taxonomy'])&LEGACY),'runtime taxonomy mismatch')
 for name in ('search-safe-default.json','search-intentional-safe.json'):
  rows=json.loads((root/'assets/safety'/name).read_text(encoding='utf-8'))
  need(rows,'empty search contract '+name)
  for r in rows:
   need(r.get('age_bands') and set(r['age_bands'])<=ALLOWED,'search row missing canonical age '+name)
   need('audience' not in r,'legacy audience emitted by search contract '+name)
 need(not (root/'assets/safety/search-adult-full-catalog.json').exists(),'adult-full search catalogue must not be public in P0')
 research=json.loads((root/'es/investigacion/estudios-textos.json').read_text(encoding='utf-8'))
 need(len(research)==120,'published research catalogue count mismatch')
 need(g['totals']['by_surface']['research']==132,'research matrix count mismatch')
 need(all(x.get('ig_age_bands') and set(x['ig_age_bands'])<=ALLOWED for x in research),'research age bands incomplete')
 research_html=(root/'es/investigacion/index.html').read_text(encoding='utf-8')
 need('allowedAgeBands(s.ig_age_bands || [])' in research_html,'research filter is not before render')
 home=(root/'index.html').read_text(encoding='utf-8')
 for href,bands in [
  ('/es/datos/','AGE_13_17 AGE_18_PLUS'),
  ('/es/investigacion/','AGE_13_17 AGE_18_PLUS'),
  ('/es/tramites/directorio/','AGE_18_PLUS')]:
  m=re.search(r'<a\b([^>]*)href=["\']'+re.escape(href)+r'["\']([^>]*)>',home,re.I|re.S)
  need(m and ('data-ig-age-bands="'+bands+'"' in (m.group(1)+m.group(2))),'Home canonical age tag missing '+href)
 support=(root/'es/tramites/directorio/index.html').read_text(encoding='utf-8')
 need(body_attr(support,'data-ig-page-age-bands')=='AGE_18_PLUS','Support page gate is not canonical adult-only')
 adult=(root/'es/neurodiversidad/condiciones/menopausia/index.html').read_text(encoding='utf-8')
 need(body_attr(adult,'data-ig-page-age-bands')=='AGE_18_PLUS','adult-only deep-link gate missing')
 need('/assets/ig-age-gate-r51.css' in adult,'final pre-render gate stylesheet missing')
 # Every static link that points to a classified record or classified surface is annotated.
 missing=[];tagged=0
 pages=[root/'index.html',root/'404.html']
 for lang in ('es','en'):
  base=root/lang
  if base.is_dir():pages.extend(base.rglob('*.html'))
 by=runtime['by_url']
 for p in pages:
  if not p.is_file():continue
  route=route_for(p,root);txt=p.read_text(encoding='utf-8')
  for m in A_RE.finditer(txt):
   attrs=m.group(1);hm=HREF_RE.search(attrs)
   if not hm:continue
   href=hm.group(2)
   if href.startswith(('mailto:','tel:','javascript:')) or '{{' in href:continue
   k=key_for(href,route)
   bands=by.get(k)
   if not bands and '#' in k:bands=by.get(k.split('#',1)[0])
   if not bands:continue
   expected=' '.join(bands)
   if 'data-ig-age-bands="'+expected+'"' not in attrs:missing.append((route,href,expected))
   else:tagged+=1
 need(not missing,'classified links missing pre-render age tags: '+repr(missing[:10]))
 audience=(root/'assets/ig-audience.js').read_text(encoding='utf-8')
 search=(root/'assets/buscador-comun.js').read_text(encoding='utf-8')
 sabik=(root/'sabik/retrieval-panel.js').read_text(encoding='utf-8')
 mount=(root/'sabik/iris-mount.mjs').read_text(encoding='utf-8')
 need('allowedAgeBands' in audience and 'age-runtime-r51.json' in audience,'canonical runtime API missing')
 need('AGE_UNSET' in audience,'mandatory AGE_UNSET state missing')
 need('isAdultClaimed' in audience and 'hasAdultAssurance' in audience and 'canAccessRestrictedAdultContent' in audience,'adult claim/assurance separation missing')
 need("function hasAdultAssurance(){return false;}" in audience,'P0 assurance must fail closed')
 need("function isAdult(){return canAccessRestrictedAdultContent();}" in audience,'legacy 18+ adult authority returned')
 need('allowedAgeBands(r.age_bands||[])' in search,'search/autocomplete not using canonical age bands')
 need('allowedUrl(group.url)' in sabik and 'filterEnvelopeByAge' in sabik,'Sabik does not filter before render')
 need("function ageSelected()" in mount and "function restrictedAdultAccess()" in mount,'Sabik age/assurance guards missing')
 need("if(!ageSelected())return Object.freeze" in mount,'Sabik retrieval does not fail closed for AGE_UNSET')
 need("if(connection && restrictedAdultAccess())" in mount,'Sabik Cloud path is not gated by independent adult assurance')
 need("addEventListener('ig:audience-change'" in mount,'Sabik stale results are not cleared on age change')
 print('SABIK_NO_AGE_GATE_BYPASS_PASS')
 print(json.dumps({'records':965,'visible':g['totals']['visible_by_filter'],'tagged_links':tagged,'static_unfiltered':0,'search_contracts':'PASS','research':'PASS','deep_links':'PASS','sabik':'PASS','adult_claim_safe_only':'PASS'},ensure_ascii=False))
if __name__=='__main__':main()
