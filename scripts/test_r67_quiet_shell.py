#!/usr/bin/env python3
"""R67 A2 · static gate for Quiet Space outer-shell migration."""
from __future__ import annotations
import argparse
from pathlib import Path

ROUTES=("es/sitio-tranquilo/index.html","en/quiet-space/index.html")
REQ=(
    "/assets/ig-global-ui-tokens-2026.css",
    "/assets/ig-r49-transversal.css",
    "/assets/ig-theme.js",
    "/assets/ig-r49-lang-bootstrap.js",
    "/assets/ig-audience.js",
    "/assets/ig-r49-transversal.js",
)
QUIET_CONTROLS=("r40Workspace","r40StartAV","r40ImageOnly","r40Mute","stopVideo","stopAudio","startBreath","stopBreath")

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
        need('data-ig-r49-owner="R67_QUIET"' in txt,"owner missing "+rel)
        for asset in REQ:
            need(txt.count(asset)==1,f"{asset} count != 1 on {rel}")
        for cid in QUIET_CONTROLS:
            need(f'id="{cid}"' in txt,f"Quiet control lost {cid} on {rel}")
        need(txt.count('<header class="hd"')==1,"legacy source header shape changed unexpectedly "+rel)
        need('class="ig-r49-global-header"' not in txt,"runtime global header leaked statically "+rel)
    print({"status":"PASS","routes":len(ROUTES),"quiet_controls":len(QUIET_CONTROLS)})

if __name__=="__main__":
    main()
