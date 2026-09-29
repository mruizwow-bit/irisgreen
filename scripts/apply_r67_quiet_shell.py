#!/usr/bin/env python3
"""R67 A2 · migrate Quiet Space hubs ES/EN to the global R49/R50 shell.

Only the outer Iris Green shell is migrated. Quiet Space scenes, audio, WebGL,
immersive controls and their current R42 runtime remain untouched.
"""
from __future__ import annotations
import argparse,re
from pathlib import Path

ROUTES=("es/sitio-tranquilo/index.html","en/quiet-space/index.html")
BODY_RE=re.compile(r"<body\b([^>]*)>",re.I)
CSS=("/assets/ig-global-ui-tokens-2026.css","/assets/ig-r49-transversal.css")
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

def add_head(text:str,markup:str,bare:str)->str:
    if bare in text:
        return text
    out,n=re.subn(r"</head\s*>",markup+"</head>",text,count=1,flags=re.I)
    if n!=1:
        raise AssertionError("Quiet Space hub has no </head>")
    return out

def apply_one(path:Path)->bool:
    before=path.read_text(encoding="utf-8")
    m=BODY_RE.search(before)
    if not m:
        raise AssertionError(f"Quiet Space hub has no body: {path}")
    attrs=m.group(1)
    for key,val in (
        ("data-ig-r49","1"),
        ("data-ig-profile","workspace"),
        ("data-ig-materials","r42"),
        ("data-ig-r49-owner","R67_QUIET"),
    ):
        attrs=set_attr(attrs,key,val)
    after=before[:m.start()]+"<body"+attrs+">"+before[m.end():]
    for href in CSS:
        after=add_head(after,f'<link rel="stylesheet" href="{href}">',href)
    for src,defer in JS:
        after=add_head(after,f'<script{" defer" if defer else ""} src="{src}"></script>',src)
    if after!=before:
        path.write_text(after,encoding="utf-8")
        return True
    return False

def main()->None:
    ap=argparse.ArgumentParser()
    ap.add_argument("--root",type=Path,required=True)
    root=ap.parse_args().root.resolve()
    changed=0
    for rel in ROUTES:
        p=root/rel
        if not p.is_file():
            raise AssertionError("Missing Quiet Space hub: "+rel)
        changed+=int(apply_one(p))
    print({"routes":len(ROUTES),"changed":changed,"scope":"quiet outer shell only"})

if __name__=="__main__":
    main()
