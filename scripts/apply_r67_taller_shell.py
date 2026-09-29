#!/usr/bin/env python3
"""R67 A2 · migrate Workshop hubs ES/EN to the real global R49/R50 shell.

Scope is deliberately limited to the two Workshop hub pages. It does not alter
studio cards, study routes, R54/R65 artwork, tools, storage or workshop runtime.
"""
from __future__ import annotations
import argparse,re
from pathlib import Path

ROUTES=(
    ("es/taller/index.html","workspace","R67_TALLER"),
    ("en/workshop/index.html","workspace","R67_TALLER"),
)
BODY_RE=re.compile(r"<body\b([^>]*)>",re.I)

CSS=(
    "/assets/ig-global-ui-tokens-2026.css",
    "/assets/ig-r49-transversal.css",
)
JS=(
    ("/assets/ig-theme.js",False),
    ("/assets/ig-r49-lang-bootstrap.js",False),
    ("/assets/ig-audience.js",False),
    ("/assets/ig-r49-transversal.js",True),
)

def set_attr(attrs:str,name:str,value:str)->str:
    pat=re.compile(r'(\s'+re.escape(name)+r'=)(["\']).*?\2',re.I|re.S)
    if pat.search(attrs):
        return pat.sub(lambda m:m.group(1)+'"'+value+'"',attrs,count=1)
    return attrs.rstrip()+f' {name}="{value}"'

def add_head_asset(text:str,html:str,bare:str)->str:
    if bare in text:
        return text
    out,n=re.subn(r"</head\\s*>",html+"</head>",text,count=1,flags=re.I)
    if n!=1:
        raise AssertionError("Workshop hub has no </head>")
    return out

def apply_one(path:Path,profile:str,owner:str)->bool:
    before=path.read_text(encoding="utf-8")
    m=BODY_RE.search(before)
    if not m:
        raise AssertionError(f"Workshop hub has no body: {path}")
    attrs=m.group(1)
    for key,val in (
        ("data-ig-r49","1"),
        ("data-ig-profile",profile),
        ("data-ig-materials","r42"),
        ("data-ig-r49-owner",owner),
    ):
        attrs=set_attr(attrs,key,val)
    after=before[:m.start()]+"<body"+attrs+">"+before[m.end():]
    for href in CSS:
        after=add_head_asset(after,f'<link rel="stylesheet" href="{href}">',href)
    for src,defer in JS:
        after=add_head_asset(after,f'<script{" defer" if defer else ""} src="{src}"></script>',src)
    if after!=before:
        path.write_text(after,encoding="utf-8")
        return True
    return False

def main()->None:
    ap=argparse.ArgumentParser()
    ap.add_argument("--root",type=Path,required=True)
    root=ap.parse_args().root.resolve()
    changed=0
    for rel,profile,owner in ROUTES:
        p=root/rel
        if not p.is_file():
            raise AssertionError(f"Missing Workshop hub: {rel}")
        changed+=int(apply_one(p,profile,owner))
    print({"routes":len(ROUTES),"changed":changed,"scope":"workshop hubs shell only"})

if __name__=="__main__":
    main()
