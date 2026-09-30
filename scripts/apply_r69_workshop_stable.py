#!/usr/bin/env python3
"""R69 · deterministic Workshop shell.

Inject the R42 workspace layer as normal deferred assets after each existing
studio engine. The previous runtime loaded four scripts after DOMContentLoaded,
so users saw the old study first and then a second interface jumped into place.

This build pass does not change study engines or content. It only fixes loading
order and marks the pages so the shared CSS can suppress the legacy first paint
while JavaScript is available.
"""
from __future__ import annotations
import argparse,re
from pathlib import Path

BODY_RE=re.compile(r"<body\b([^>]*)>",re.I)
META='<meta name="ig-r69-taller-static-shell" content="1">'
CSS='<link rel="stylesheet" href="/assets/ig-taller-r42.css?v=r69-stable-1" data-ig42-taller="true">'
SCRIPTS=(
    '/assets/data/taller-r42-paths.js?v=r69-stable-1',
    '/assets/ig-taller-r42-platform.js?v=r69-stable-1',
    '/assets/ig-taller-r42-direct.js?v=r69-stable-1',
    '/assets/ig-taller-r42.js?v=r69-stable-1',
)

def set_body_marker(text:str)->str:
    m=BODY_RE.search(text)
    if not m:
        raise AssertionError("Workshop page has no body")
    attrs=m.group(1)
    if 'data-ig-r69-workshop=' not in attrs:
        attrs=attrs.rstrip()+' data-ig-r69-workshop="1"'
    return text[:m.start()]+'<body'+attrs+'>'+text[m.end():]

def add_head(text:str,markup:str,needle:str)->str:
    if needle in text:
        return text
    out,n=re.subn(r"</head\s*>",markup+"</head>",text,count=1,flags=re.I)
    if n!=1:
        raise AssertionError("Workshop page has no </head>")
    return out

def apply_page(path:Path)->bool:
    before=path.read_text(encoding='utf-8')
    if 'id="igt-app"' not in before or '/assets/ig-taller-estudio.js' not in before:
        return False
    after=set_body_marker(before)
    after=add_head(after,META,'name="ig-r69-taller-static-shell"')
    after=add_head(after,CSS,'/assets/ig-taller-r42.css')
    missing=[src for src in SCRIPTS if src.split('?')[0] not in after]
    if missing:
        bundle=''.join(f'<script defer src="{src}"></script>' for src in missing)
        out,n=re.subn(r"</body\s*>",bundle+"</body>",after,count=1,flags=re.I)
        if n!=1:
            raise AssertionError("Workshop page has no </body>")
        after=out
    if after!=before:
        path.write_text(after,encoding='utf-8')
        return True
    return False

def main()->None:
    ap=argparse.ArgumentParser()
    ap.add_argument('--root',type=Path,required=True)
    root=ap.parse_args().root.resolve()
    pages=[]
    for base in (root/'es'/'taller',root/'en'/'workshop'):
        if base.is_dir():
            pages.extend(p for p in base.rglob('index.html') if p.parent!=base)
    eligible=0;changed=0
    for p in sorted(set(pages)):
        text=p.read_text(encoding='utf-8')
        if 'id="igt-app"' in text and '/assets/ig-taller-estudio.js' in text:
            eligible+=1
            changed+=int(apply_page(p))
    if eligible==0:
        raise AssertionError('R69 found no Workshop study pages')
    print({'eligible':eligible,'changed':changed,'mode':'STATIC_DEFERRED_R42'})

if __name__=='__main__':
    main()
