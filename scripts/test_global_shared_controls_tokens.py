#!/usr/bin/env python3
"""#357 · shared controls must remain on canonical semantic tokens."""
from __future__ import annotations
import argparse,re
from pathlib import Path

def need(v,msg):
    if not v: raise AssertionError(msg)

def main():
    ap=argparse.ArgumentParser();ap.add_argument("--root",type=Path,required=True)
    root=ap.parse_args().root.resolve()
    p=root/"assets/controles-comunes.css"
    need(p.is_file(),"missing controles-comunes.css")
    css=p.read_text(encoding="utf-8")

    required=[
        "--ig-control-bg:var(--ig-button-secondary-bg",
        "--ig-control-fg:var(--ig-button-secondary-fg",
        "--ig-control-active:var(--ig-button-primary-bg",
        "--ig-control-active-fg:var(--ig-button-primary-fg",
        "--ig-control-focus:var(--ig-focus",
        "--ig-control-line:var(--ig-border-control",
        "--ig-control-hover-bg:var(--ig-bg-surface-soft",
        "background:var(--ig-control-bg)!important",
        "color:var(--ig-control-fg)!important",
        "background:var(--ig-control-active)!important",
        "color:var(--ig-control-active-fg)!important",
        "outline:3px solid var(--ig-control-focus)!important",
    ]
    for marker in required:
        need(marker in css,"missing semantic token contract: "+marker)

    forbidden=[
        r"background\s*:\s*#fff\s*!important",
        r"color\s*:\s*#fff\s*!important",
        r"background\s*:\s*#(?:17395c|1f5f8b|f2f6f9)\s*!important",
        r"outline\s*:\s*3px solid #5a49a8",
    ]
    for pattern in forbidden:
        need(not re.search(pattern,css,re.I),"direct UI colour returned: "+pattern)

    need("min-width:44px!important" in css,"44px shared target contract missing")
    need(":focus-visible" in css,"focus-visible contract missing")
    need(":disabled" in css,"disabled state contract missing")
    print("GLOBAL_SHARED_CONTROLS_TOKENS_REGRESSION_PASS")

if __name__=="__main__":
    main()
