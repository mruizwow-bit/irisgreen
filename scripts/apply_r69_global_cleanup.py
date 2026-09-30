#!/usr/bin/env python3
"""R69 · final cross-route compatibility pass.

- self-host the approved Iris Green fonts on every public HTML page;
- remove obsolete local age choosers where the global AGE_* lens owns state;
- load route-family compatibility last and unlayered so older unlayered product
  skins cannot override it;
- leave global shell/theme ownership in R49;
- leave content, product engines and immersive art untouched.
"""
from __future__ import annotations
import argparse,re
from pathlib import Path

GOOGLE_LINK_RE=re.compile(
    r'<link\b[^>]*(?:fonts\.googleapis\.com|fonts\.gstatic\.com)[^>]*>\s*',
    re.I,
)
HEAD_CLOSE_RE=re.compile(r'</head\s*>',re.I)
R69_UI_LINK_RE=re.compile(r'<link\b(?=[^>]*href=["\']/assets/ig-r69-unified-ui\.css(?:\?[^"\']*)?["\'])[^>]*>\s*',re.I)
RESOURCE_STAGE_RE=re.compile(
    r'<section\s+class=["\']ri-stage-section["\'][^>]*>.*?</section>',
    re.I|re.S,
)
WORKSHOP_LOCAL_AGE_RE=re.compile(
    r'<nav\s+class=["\']igk-para["\'][^>]*>.*?</nav>',
    re.I|re.S,
)

def local_fonts(text:str)->str:
    text=GOOGLE_LINK_RE.sub('',text)
    # Remove any earlier copy, regardless of attribute order/version, then append
    # one canonical copy immediately before </head>. This makes cascade order
    # deterministic instead of merely relying on the file being present.
    text=R69_UI_LINK_RE.sub('',text)
    additions=[]
    if '/assets/ig-fonts.css' not in text:
        additions.append('<link rel="stylesheet" href="/assets/ig-fonts.css">')
    additions.append('<link rel="stylesheet" href="/assets/ig-r69-unified-ui.css">')
    text,n=HEAD_CLOSE_RE.subn(''.join(additions)+'</head>',text,count=1)
    if n!=1:
        raise AssertionError('HTML without </head>')
    return text

def main()->None:
    ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True)
    root=ap.parse_args().root.resolve()
    htmls=[]
    for base in (root/'es',root/'en'):
        if base.is_dir(): htmls.extend(p for p in base.rglob('*.html') if p.is_file())
    for p in (root/'index.html',root/'en'/'index.html'):
        if p.is_file(): htmls.append(p)
    changed=0;google_left=[];resource_removed=0;workshop_age_removed=0
    for p in sorted(set(htmls)):
        before=p.read_text(encoding='utf-8')
        after=local_fonts(before)
        rel=p.relative_to(root).as_posix()
        if rel in ('es/recursos/index.html','en/resources/index.html'):
            after,n=RESOURCE_STAGE_RE.subn('',after,count=1)
            resource_removed+=n
        if rel in ('es/taller/index.html','en/workshop/index.html'):
            after,n=WORKSHOP_LOCAL_AGE_RE.subn('',after,count=1)
            workshop_age_removed+=n
        if after!=before:
            p.write_text(after,encoding='utf-8');changed+=1
        if 'fonts.googleapis.com' in after or 'fonts.gstatic.com' in after:
            google_left.append(rel)
    if google_left:
        raise AssertionError('External Google Fonts remain: '+', '.join(google_left[:12]))
    if resource_removed!=2:
        raise AssertionError(f'Expected 2 redundant Resource age blocks removed, got {resource_removed}')
    if workshop_age_removed!=2:
        raise AssertionError(f'Expected 2 redundant Workshop age navs removed, got {workshop_age_removed}')
    print({'html':len(set(htmls)),'changed':changed,'google_fonts':0,'resource_age_blocks_removed':resource_removed,'workshop_age_navs_removed':workshop_age_removed})

if __name__=='__main__':
    main()
