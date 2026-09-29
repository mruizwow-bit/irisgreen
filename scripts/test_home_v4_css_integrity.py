#!/usr/bin/env python3
"""Fail-closed integrity gate for the canonical Home v4 stylesheet."""
from __future__ import annotations
import argparse,re
from pathlib import Path

REQUIRED={
    '.ig-home-v4-use-grid':('display:grid','grid-template-columns'),
    '.ig-home-v4-card':('display:grid','background:var(--ig-bg-surface)'),
    '.ig-home-v4-sabik':('display:grid','background:var(--ig-bg-surface)'),
    '.ig-home-v4-discover-grid':('display:grid','grid-template-columns'),
    '.ig-home-v4-footer':('display:flex','justify-content:space-between'),
    '.ig-home-v4-age-state':('color:var(--ig-text-muted)','font-size:.92rem'),
}
CONTROL_ALLOWED={9,10,13}

def need(v,m):
    if not v: raise AssertionError(m)

def block(css,selector):
    m=re.search(re.escape(selector)+r'\s*\{([^{}]*)\}',css,re.S)
    need(m is not None,'Missing CSS block '+selector)
    return re.sub(r'\s+','',m.group(1))

def check(root:Path):
    path=root/'assets/home-r42-child-safe.css'
    raw=path.read_bytes()
    try:
        css=raw.decode('utf-8','strict')
    except UnicodeDecodeError as e:
        raise AssertionError(f'CSS is not valid UTF-8: {e}') from e
    bad=[(i,ord(ch)) for i,ch in enumerate(css) if (ord(ch)<32 and ord(ch) not in CONTROL_ALLOWED) or 127<=ord(ch)<=159]
    need(not bad,'CSS contains forbidden control characters: '+repr(bad[:20]))
    need('\ufffd' not in css,'CSS contains Unicode replacement character')
    need(css.count('{')==css.count('}'),f'Unbalanced CSS braces: {css.count("{")} / {css.count("}")}')
    need(len(css)>9000,'Home v4 CSS unexpectedly short/truncated')
    for selector,props in REQUIRED.items():
        b=block(css,selector)
        for prop in props: need(prop in b,f'{selector} missing required rule {prop}')
    for legacy in ['#ffffff','#fff;','background:white','background: white']:
        need(legacy not in css.lower(),'Pure white UI hardcode in Home v4 CSS: '+legacy)
    need('.ig-home-v4 .sabik-widget' in css,'Sabik Home chassis rule missing')
    need('html[data-ig-theme="light"]' in css,'LIGHT alternate theme integration missing')
    print({'css':'PASS','bytes':len(raw),'controls':0,'braces':css.count('{'),'required':len(REQUIRED)})

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,default=Path('.'))
    check(ap.parse_args().root.resolve())

if __name__=='__main__': main()
