#!/usr/bin/env python3
"""R67 A2 · static gate for Workshop global shell migration."""
from __future__ import annotations
import argparse
from pathlib import Path

ROUTES=("es/taller/index.html","en/workshop/index.html")
REQ=(
    "/assets/ig-global-ui-tokens-2026.css",
    "/assets/ig-r49-transversal.css",
    "/assets/ig-theme.js",
    "/assets/ig-r49-lang-bootstrap.js",
    "/assets/ig-audience.js",
    "/assets/ig-r49-transversal.js",
)

def need(v:bool,msg:str)->None:
    if not v:
        raise AssertionError(msg)

def main()->None:
    ap=argparse.ArgumentParser()
    ap.add_argument("--root",type=Path,required=True)
    root=ap.parse_args().root.resolve()
    for rel in ROUTES:
        p=root/rel
        need(p.is_file(),"missing "+rel)
        txt=p.read_text(encoding="utf-8")
        need('data-ig-r49="1"' in txt,"R49 marker missing "+rel)
        need('data-ig-profile="workspace"' in txt,"workspace profile missing "+rel)
        need('data-ig-r49-owner="R67_TALLER"' in txt,"owner missing "+rel)
        for asset in REQ:
            need(txt.count(asset)==1,f"{asset} count != 1 on {rel}")
        need(txt.count('<header class="hd"')==1,"legacy source header shape changed unexpectedly "+rel)
        need('class="ig-r49-global-header"' not in txt,"runtime R49 header leaked statically "+rel)
    print({"status":"PASS","routes":len(ROUTES),"scope":"workshop hubs shell only"})

if __name__=="__main__":
    main()
