#!/usr/bin/env python3
"""Inject the R35 global visual system into the generated site only."""
from __future__ import annotations
import argparse,re
from pathlib import Path

LINK='<link rel="stylesheet" href="/assets/irisglass-r35.css">'
FLOWER=re.compile(r'<img\\b[^>]*(?:v40-brand-symbol\\.webp|brand-symbol\\.webp)[^>]*>',re.I)

def apply(root: Path):
    changed=0;flowers=0
    for page in sorted(root.rglob('*.html')):
        text=page.read_text(encoding='utf-8')
        old=text
        text,n=FLOWER.subn('',text);flowers+=n
        if LINK not in text:
            if '</head>' not in text:
                raise AssertionError(f'No </head> in {page}')
            text=text.replace('</head>',LINK+'\\n</head>',1)
        text=re.sub(r'<meta name="theme-color" content="[^"]*">','<meta name="theme-color" content="#f5fafc">',text,count=1)
        if text!=old:
            page.write_text(text,encoding='utf-8',newline='\\n');changed+=1
    if not (root/'assets/irisglass-r35.css').is_file():
        raise FileNotFoundError(root/'assets/irisglass-r35.css')
    print({'r35_pages_changed':changed,'flower_logo_imgs_removed':flowers,'stylesheet':'/assets/irisglass-r35.css'})
    return changed,flowers

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--root',required=True,type=Path);a=p.parse_args();apply(a.root.resolve())
