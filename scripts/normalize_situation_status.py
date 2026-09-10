#!/usr/bin/env python3
"""Retira el atributo técnico de estado editorial (data-editorial-status) de Situaciones en dist.
Es un dato de control interno: no se publica ningún estado, ni provisional ni «validated»."""
from pathlib import Path
import argparse, json, re


def main():
    ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,default=Path('dist'));args=ap.parse_args()
    root=args.root; changed=0; pages=0; attrs=0
    files=[root/'es/situaciones/index.html',root/'en/situations/index.html']
    for pattern in ('es/situaciones/*/index.html','en/situations/*/index.html'):
        found=sorted(root.glob(pattern)); pages+=len(found); files+=found
    if pages!=374: raise AssertionError(f'Se esperaban 374 fichas ES/EN; encontradas: {pages}')
    for p in files:
        text=p.read_text(encoding='utf-8')
        new,n=re.subn(r'\s*data-editorial-status="[^"]*"','',text)
        if n:
            attrs+=n; changed+=1; p.write_text(new,encoding='utf-8')
    print(json.dumps({'situations_pages':pages,'files_changed':changed,'status_attributes_removed':attrs,'public_status':None},ensure_ascii=False))

if __name__=='__main__': main()
