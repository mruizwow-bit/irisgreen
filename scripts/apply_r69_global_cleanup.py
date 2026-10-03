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
import argparse,re,html as html_lib
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
CRUMB_BLOCK_RE=re.compile(
    r'<p\b(?=[^>]*class=["\'][^"\']*\bcrumb\b[^"\']*["\'])[^>]*>.*?</p>\s*',
    re.I|re.S,
)
SITUATION_NOTICE_RE=re.compile(
    r'<p\b(?=[^>]*class=["\'][^"\']*\bnotice\b[^"\']*["\'])[^>]*>'
    r'(?:(?!</p>).)*(?:Esta página describe una situación del día a día|This page describes an everyday situation)'
    r'.*?</p>\s*',
    re.I|re.S,
)

def _plain(fragment:str)->str:
    return re.sub(r'\s+',' ',html_lib.unescape(re.sub(r'<[^>]+>',' ',fragment))).strip()

def remove_redundant_home_crumbs(text:str)->tuple[str,int]:
    removed=0
    def repl(m):
        nonlocal removed
        plain=_plain(m.group(0))
        if re.search(r'(^|\s)(Inicio|Home)(\s|$|›|>)',plain,re.I):
            removed+=1
            return ''
        return m.group(0)
    return CRUMB_BLOCK_RE.sub(repl,text),removed

def local_fonts(text:str)->str:
    text=GOOGLE_LINK_RE.sub('',text)
    # One final unlayered compatibility sheet until all legacy skins migrate.
    text=R69_UI_LINK_RE.sub('',text)
    additions=[]
    if '/assets/ig-fonts.css' not in text:
        additions.append('<link rel="stylesheet" href="/assets/ig-fonts.css">')
    additions.append('<link rel="stylesheet" href="/assets/ig-r69-unified-ui.css">')
    text,n=HEAD_CLOSE_RE.subn(''.join(additions)+'</head>',text,count=1)
    if n!=1:
        raise AssertionError('HTML without </head>')
    # Invalidate stale per-product palettes and controls in existing browsers.
    text=text.replace('/assets/ig-tokens.css', '/assets/ig-global-ui-tokens-2026.css')
    text=re.sub(r"(/assets/(?:ig-global-ui-tokens-2026\.css|ig-r69-unified-ui\.css|ig-r42-shell\.(?:css|js)|ig-suite-launcher\.(?:css|js)|juegos-iris\.js|ig-r49-transversal\.js))(?:\?[^\"\']*)?", r"\1?v=20261001-controls", text)
    return text

def main()->None:
    ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True)
    root=ap.parse_args().root.resolve()
    htmls=[]
    for base in (root/'es',root/'en'):
        if base.is_dir(): htmls.extend(p for p in base.rglob('*.html') if p.is_file())
    for p in (root/'index.html',root/'en'/'index.html'):
        if p.is_file(): htmls.append(p)
    changed=0;google_left=[];resource_removed=0;workshop_age_removed=0;home_crumbs_removed=0;situation_notices_removed=0
    for p in sorted(set(htmls)):
        before=p.read_text(encoding='utf-8')
        rel=p.relative_to(root).as_posix()
        after=local_fonts(before)
        after,n=remove_redundant_home_crumbs(after)
        home_crumbs_removed+=n
        if rel.startswith(('es/situaciones/','en/situations/')):
            after,n=SITUATION_NOTICE_RE.subn('',after)
            situation_notices_removed+=n
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
    for rel in ('es/recursos/index.html','en/resources/index.html'):
        if RESOURCE_STAGE_RE.search((root/rel).read_text(encoding='utf-8')):
            raise AssertionError('Redundant resource age block remains: '+rel)
    if workshop_age_removed!=2:
        raise AssertionError(f'Expected 2 redundant Workshop age navs removed, got {workshop_age_removed}')
    leftover_crumbs=[]
    leftover_situation_notices=[]
    for p in sorted(set(htmls)):
        final=p.read_text(encoding='utf-8')
        for m in CRUMB_BLOCK_RE.finditer(final):
            if re.search(r'(^|\s)(Inicio|Home)(\s|$|›|>)',_plain(m.group(0)),re.I):
                leftover_crumbs.append(p.relative_to(root).as_posix())
                break
        if p.relative_to(root).as_posix().startswith(('es/situaciones/','en/situations/')) and SITUATION_NOTICE_RE.search(final):
            leftover_situation_notices.append(p.relative_to(root).as_posix())
    if leftover_crumbs:
        raise AssertionError('Redundant Inicio/Home crumbs remain: '+', '.join(leftover_crumbs[:12]))
    if leftover_situation_notices:
        raise AssertionError('Repeated situation disclaimer remains: '+', '.join(leftover_situation_notices[:12]))
    print({'html':len(set(htmls)),'changed':changed,'google_fonts':0,
           'resource_age_blocks_removed':resource_removed,'workshop_age_navs_removed':workshop_age_removed,
           'redundant_home_crumbs_removed':home_crumbs_removed,
           'situation_disclaimers_removed':situation_notices_removed})

if __name__=='__main__':
    main()
