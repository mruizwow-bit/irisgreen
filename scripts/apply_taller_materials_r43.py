#!/usr/bin/env python3
"""Design R02 material coverage for every public Workshop page, without changing engines."""
from __future__ import annotations
import argparse,re
from pathlib import Path
MAT='/assets/ig-r42-materials.css?v=r42-design-1'
BRIDGE='/assets/ig-taller-material-r43.css?v=r43-integration-1'
BODY=re.compile(r'<body(?P<a>[^>]*)>',re.I)
def set_attr(text,name,value):
    m=BODY.search(text)
    if not m: raise AssertionError('missing body')
    a=m.group('a');p=re.compile(rf'\s{name}=(["\'])(.*?)\1',re.I);f=p.search(a);token=f' {name}="{value}"'
    a=a[:f.start()]+token+a[f.end():] if f else a+token
    return text[:m.start()]+'<body'+a+'>'+text[m.end():]
def inject(text,href):
    if href in text:return text
    if '</head>' not in text:raise AssertionError('missing head')
    return text.replace('</head>',f'<link rel="stylesheet" href="{href}"></head>',1)
def main():
    ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True);a=ap.parse_args();root=a.root.resolve()
    files=[]
    for base in (root/'es/taller',root/'en/workshop'):
        if (base/'index.html').is_file():files.append(base/'index.html')
        files+=sorted(base.glob('*/index.html'))
    changed=0
    for p in files:
        s=p.read_text(encoding='utf-8');old=s
        s=set_attr(s,'data-ig-materials','r42');s=inject(s,MAT);s=inject(s,BRIDGE)
        if s!=old:p.write_text(s,encoding='utf-8');changed+=1
    if len(files)<54:raise AssertionError(f'Workshop coverage too small: {len(files)} pages; expected >=54 ES+EN')
    print({'workshop_pages':len(files),'changed':changed})
if __name__=='__main__':main()
