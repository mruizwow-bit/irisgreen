#!/usr/bin/env python3
from __future__ import annotations
import argparse, re
from pathlib import Path

ROOT=Path.cwd()
EXCLUDE={'.git','dist','node_modules','reports'}
NAV_RE=re.compile(r'(<nav\b[^>]*\bid=["\']ig-main-nav["\'][^>]*>)(.*?)(</nav>)',re.I|re.S)
HELP_A_RE=re.compile(r'<a\b(?=[^>]*\bhref=["\']/es/tramites/["\'])[^>]*>.*?</a>',re.I|re.S)
ARRAY_RE=re.compile(r',\s*\[\s*(["\'])/es/tramites/\1\s*,\s*(["\'])(?:Cómo pedirlo|How to ask|Como pedir)\2\s*\]',re.I)

def files():
    for p in ROOT.rglob('*.html'):
        if any(part in EXCLUDE for part in p.parts): continue
        yield p

def fix_text(text:str)->tuple[str,int]:
    changes=0
    def nav_sub(m):
        nonlocal changes
        body,n=HELP_A_RE.subn('',m.group(2)); changes+=n
        return m.group(1)+body+m.group(3)
    text=NAV_RE.sub(nav_sub,text)
    text,n=ARRAY_RE.subn('',text); changes+=n
    return text,changes

def audit():
    problems=[]; main_nav_hits=[]; array_hits=[]
    for p in files():
        text=p.read_text(encoding='utf-8',errors='replace')
        for m in NAV_RE.finditer(text):
            if re.search(r'href=["\']/es/tramites/["\']',m.group(2),re.I): main_nav_hits.append(str(p))
        if re.search(r'\[\s*["\']/es/tramites/["\']\s*,\s*["\'](?:Cómo pedirlo|How to ask|Como pedir)["\']\s*\]',text,re.I): array_hits.append(str(p))
    if main_nav_hits: problems.append('Enlace /es/tramites/ aún presente en ig-main-nav: '+', '.join(sorted(set(main_nav_hits))[:20]))
    if array_hits: problems.append('Entrada Cómo pedirlo aún presente en NAVL: '+', '.join(sorted(set(array_hits))[:20]))
    d=ROOT/'es/tramites/directorio/index.html'
    if not d.exists(): problems.append('Falta el directorio de Ayudas')
    else:
        t=d.read_text(encoding='utf-8',errors='replace')
        if not re.search(r'<nav\b[^>]*class=["\'][^"\']*ig-subtabs[^"\']*["\'][^>]*>.*?href=["\']/es/tramites/["\'].*?Cómo pedirlo.*?</nav>',t,re.I|re.S):
            problems.append('Cómo pedirlo ya no está accesible dentro de las pestañas de Ayudas')
    return problems

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--check',action='store_true'); args=ap.parse_args()
    if not args.check:
        changed=[]; edits=0
        for p in files():
            old=p.read_text(encoding='utf-8',errors='replace'); new,n=fix_text(old)
            if n:
                p.write_text(new,encoding='utf-8'); changed.append((str(p),n)); edits+=n
        print(f'Archivos modificados: {len(changed)} · entradas retiradas del menú principal: {edits}')
        for path,n in changed: print(f'- {path}: {n}')
    problems=audit()
    if problems:
        print('\n'.join('ERROR: '+x for x in problems)); raise SystemExit(1)
    print('OK: Cómo pedirlo no aparece en el menú principal y sigue dentro de Ayudas.')

if __name__=='__main__': main()
