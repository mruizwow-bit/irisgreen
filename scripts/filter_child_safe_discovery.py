#!/usr/bin/env python3
"""Remove incidental S2 discovery links from the published safe-default HTML.

- S2 cards are removed entirely before publication.
- Other incidental links to an S2 route are neutralised to non-clickable text.
- Canonical/hreflang metadata is untouched because only <a> elements are processed.
- The S2 pages themselves remain directly addressable and are already safe shells.
Adult discovery metadata is written separately; full S2 bodies are never embedded here.
"""
from __future__ import annotations
import argparse, html, json, re
from pathlib import Path
from urllib.parse import urljoin, urlparse

from apply_child_safe_pages import ROUTES

A_RE=re.compile(r'<a\b(?P<attrs>[^>]*)>(?P<body>.*?)</a>',re.I|re.S)
HREF_RE=re.compile(r'\bhref=(["\'])(?P<href>.*?)\1',re.I|re.S)
CLASS_RE=re.compile(r'\bclass=(["\'])(?P<class>.*?)\1',re.I|re.S)
TAG_RE=re.compile(r'<[^>]+>')
SITE='https://irisgreen.eu'

def route_from_rel(rel:str)->str:
    return '/'+rel[:-10] if rel.endswith('index.html') else '/'+rel

def clean_route(value:str,base:str)->str:
    try:
        u=urlparse(urljoin(base,value))
    except Exception:
        return ''
    if u.netloc and u.netloc not in ('irisgreen.eu','www.irisgreen.eu'):
        return ''
    path=u.path.rstrip('/') or '/'
    return path

def cardlike(attrs:str,body:str)->bool:
    m=CLASS_RE.search(attrs)
    classes=(m.group('class') if m else '').lower().split()
    if any(c in {'card','vd-card','lib-card','resource-card','result-card'} or 'card' in c for c in classes):
        return True
    # Existing catalog cards use <strong> plus metadata/chips inside the link.
    return '<strong' in body.lower() and ('chip' in body.lower() or 'meta' in body.lower())

def plain_body(body:str)->str:
    # Preserve meaningful inline text without a navigable S2 target.
    return '<span data-ig-s2-link-suppressed="true">'+body+'</span>'

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True);a=ap.parse_args()
    root=a.root.resolve()
    s2=set()
    records=[]
    for cid,(group,es_rel,en_rel) in ROUTES.items():
        for lang,rel in (('es',es_rel),('en',en_rel)):
            route=route_from_rel(rel).rstrip('/') or '/'
            s2.add(route)
            records.append({'content_id':cid,'lang':lang,'route':route,'group':group})

    changed=removed_cards=neutralized=0
    touched=[]
    for p in sorted(root.rglob('*.html')):
        rel=p.relative_to(root).as_posix()
        page_url=SITE+'/'+rel
        text=p.read_text(encoding='utf-8')
        original=text
        local_cards=local_links=0
        def repl(m):
            nonlocal removed_cards,neutralized,local_cards,local_links
            hrefm=HREF_RE.search(m.group('attrs'))
            if not hrefm:return m.group(0)
            target=clean_route(hrefm.group('href'),page_url)
            if target not in s2:return m.group(0)
            # A direct link from the S2 page to itself is not discovery.
            current=('/'+rel[:-10]).rstrip('/') if rel.endswith('index.html') else '/'+rel
            current=current or '/'
            if current==target:return m.group(0)
            if cardlike(m.group('attrs'),m.group('body')):
                removed_cards+=1;local_cards+=1;return ''
            neutralized+=1;local_links+=1
            return plain_body(m.group('body'))
        text=A_RE.sub(repl,text)
        if text!=original:
            p.write_text(text,encoding='utf-8');changed+=1
            touched.append({'page':rel,'cards_removed':local_cards,'links_neutralized':local_links})

    out=root/'assets/content-safety/s2-discovery-routes.json'
    out.parent.mkdir(parents=True,exist_ok=True)
    out.write_text(json.dumps({'schema':'iris-green-s2-discovery-routes-v1','records':records},ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')

    # Default catalogs must have zero S2 hrefs in their source HTML.
    for rel in ('es/neurodiversidad/condiciones/index.html','en/neurodiversity/conditions/index.html','es/biblioteca/index.html','en/everyday-life/index.html'):
        p=root/rel
        if not p.is_file():raise FileNotFoundError(p)
        s=p.read_text(encoding='utf-8')
        for route in s2:
            assert route not in s or not re.search(r'<a\b[^>]*href=["\'][^"\']*'+re.escape(route)+r'/?["\']',s,re.I), (rel,route)

    report={'status':'PASS','pages_changed':changed,'cards_removed':removed_cards,'links_neutralized':neutralized,'s2_routes':len(s2),'touched':touched}
    report_path=root/'assets/content-safety/discovery-filter-report.json'
    report_path.write_text(json.dumps(report,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')
    print({k:v for k,v in report.items() if k!='touched'})

if __name__=='__main__':main()
