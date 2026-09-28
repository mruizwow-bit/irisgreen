#!/usr/bin/env python3
"""R51 A2 · annotate audience-limited discovery and direct routes from approved safety registry."""
from __future__ import annotations
import argparse,json,re
from pathlib import Path
from urllib.parse import urljoin,urlsplit
BODY_RE=re.compile(r'<body\b([^>]*)>',re.I)
A_RE=re.compile(r'<a\b([^>]*)>',re.I)
HREF_RE=re.compile(r'\bhref=(["\'])(.*?)\1',re.I|re.S)
ATTR_RE=lambda name:re.compile(r'(\s'+re.escape(name)+r'=)(["\']).*?\2',re.I|re.S)
SOURCE=Path(__file__).resolve().parents[1]
REGISTRY=SOURCE/'assets/safety/audience-surface-r51.json'
def set_attr(attrs,name,value):
 pat=ATTR_RE(name)
 if pat.search(attrs):return pat.sub(lambda m:m.group(1)+'"'+value+'"',attrs,count=1)
 return attrs.rstrip()+f' {name}="{value}"'
def route_for(path,root):
 rel=path.relative_to(root).as_posix()
 if rel=='index.html':return '/'
 if rel.endswith('/index.html'):return '/'+rel[:-10]
 return '/'+rel
def rule_for(path,rules):
 for rule in rules:
  if any(path.startswith(p) for p in rule['prefixes']):return rule
 return None
def annotate_links(text,route,rules):
 count=0;base='https://irisgreen.eu'+route
 def repl(m):
  nonlocal count
  attrs=m.group(1);hm=HREF_RE.search(attrs)
  if not hm:return m.group(0)
  href=hm.group(2)
  if href.startswith(('#','mailto:','tel:','javascript:')):return m.group(0)
  try:
   u=urlsplit(urljoin(base,href))
  except Exception:return m.group(0)
  if u.netloc and u.netloc not in ('irisgreen.eu','www.irisgreen.eu'):return m.group(0)
  rule=rule_for(u.path,rules)
  if not rule:return m.group(0)
  value=' '.join(rule['audience']);new=set_attr(attrs,'data-ig-audience-values',value);count+=new!=attrs
  return '<a'+new+'>'
 return A_RE.sub(repl,text),count
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True);root=ap.parse_args().root.resolve()
 reg=json.loads(REGISTRY.read_text(encoding='utf-8'));rules=reg['route_rules'];pages=[]
 for name in ('index.html','404.html'):
  p=root/name
  if p.is_file():pages.append(p)
 for lang in ('es','en'):
  base=root/lang
  if base.is_dir():pages.extend(p for p in base.rglob('*.html') if p.is_file())
 annotated=0;gated=0
 for p in sorted(set(pages)):
  before=p.read_text(encoding='utf-8');route=route_for(p,root);after=before
  page_rule=rule_for(route,rules)
  if page_rule:
   m=BODY_RE.search(after)
   if not m:raise AssertionError('Audience-gated page without body '+route)
   attrs=set_attr(m.group(1),'data-ig-page-audience',' '.join(page_rule['audience']))
   after=after[:m.start()]+'<body'+attrs+'>'+after[m.end():];gated+=1
  after,n=annotate_links(after,route,rules);annotated+=n
  if after!=before:p.write_text(after,encoding='utf-8')
 report={'schema':reg['schema'],'source_record_count':reg['source_record_count'],'annotated_links':annotated,'gated_pages':gated}
 (root/'assets/r51-audience-discovery-report.json').write_text(json.dumps(report,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
 print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__':main()
