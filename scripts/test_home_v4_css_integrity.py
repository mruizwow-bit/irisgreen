#!/usr/bin/env python3
"""Fail-closed integrity gate for the canonical Home v4 stylesheet."""
from __future__ import annotations
import argparse,re
from pathlib import Path

REQUIRED={
    '.ig-home-v4-wrap':('var(--ig-content-wide,104rem)','margin:0 auto'),
    '.ig-home-v4-hero,.ig-home-v4-sabik':('display:block','background:var(--ig-bg-surface)','border:1px solid var(--ig-separator)'),
    '.ig-home-v4-hero':('display:flex','padding:clamp(1.25rem,3vw,2.25rem)'),
    '.ig-home-v4-search-row':('display:flex','gap:.6rem'),
    '.ig-home-v4-main':('width:100%','margin-inline:auto'),
    '.ig-home-v4-use-grid':('display:grid','grid-template-columns:repeat(3,minmax(0,1fr))','width:100%','max-width:none'),
    '.ig-home-v4-card':('display:grid','background:var(--ig-bg-surface)'),
    '.ig-home-v4-media':('display:grid','min-height:112px'),
    '.ig-home-v4-discover-grid':('display:grid','grid-template-columns:repeat(3,minmax(0,1fr))','width:100%','max-width:none'),
    '.ig-home-v4 .ig-home-v4-sabik-panel .sabik-widget':('display:grid','grid-template-columns:minmax(22rem,.82fr)minmax(28rem,1.18fr)'),
    '.ig-home-v4 .ig-home-v4-sabik-panel .sabik-web-presentation':('width:clamp(300px,27vw,410px)','max-width:100%','margin-inline:auto'),
    '.ig-home-v4 .ig-home-v4-sabik-panel .sabik-web-visual.sabik-visual':('width:100%','aspect-ratio:1065/760','overflow:visible'),
    '.ig-home-v4-footer':('display:flex','justify-content:space-between','var(--ig-content-wide,104rem)'),
}
CONTROL_ALLOWED={9,10,13}

def need(v,m):
    if not v: raise AssertionError(m)

def blocks(css,selector):
    matches=re.findall(re.escape(selector)+r'\s*\{([^{}]*)\}',css,re.S)
    need(matches,'Missing CSS block '+selector)
    return ''.join(re.sub(r'\s+','',m) for m in matches)

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
        b=blocks(css,selector)
        for prop in props: need(re.sub(r'\s+','',prop) in b,f'{selector} missing required rule {prop}')
    for legacy in ['#ffffff','#fff;','background:white','background: white']:
        need(legacy not in css.lower(),'Pure white UI hardcode in Home v4 CSS: '+legacy)
    need('.ig-home-v4 .sabik-widget' in css,'Sabik Home chassis rule missing')
    need('grid-template-columns:minmax(22rem,.82fr) minmax(28rem,1.18fr)' in css,'Approved compact Sabik two-column layout missing')
    need('.ig-home-v4-use-pair' not in css,'Obsolete nested Explore pair layout must not return')
    need('.ig-home-v4-safety-state' not in css,'Visible child-safety status styling must not return')
    need('html[data-ig-theme="light"]' in css,'LIGHT alternate theme integration missing')
    print({'css':'PASS','bytes':len(raw),'controls':0,'braces':css.count('{'),'required':len(REQUIRED)})

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,default=Path('.'))
    check(ap.parse_args().root.resolve())

if __name__=='__main__': main()
