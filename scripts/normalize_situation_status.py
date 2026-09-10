#!/usr/bin/env python3
"""Elimina únicamente el estado técnico provisional de las fichas de Situaciones."""
from pathlib import Path
import argparse, json


def main():
    ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,default=Path('dist'));args=ap.parse_args()
    root=args.root; changed=0; pages=0
    for pattern in ('es/situaciones/*/index.html','en/situations/*/index.html'):
        for p in sorted(root.glob(pattern)):
            pages+=1
            text=p.read_text(encoding='utf-8')
            new=text.replace('data-editorial-status="generated-draft"','data-editorial-status="validated"')
            if new!=text:
                p.write_text(new,encoding='utf-8');changed+=1
    if pages!=374: raise AssertionError(f'Se esperaban 374 fichas ES/EN; encontradas: {pages}')
    print(json.dumps({'situations_pages':pages,'status_pages_changed':changed,'status':'validated'},ensure_ascii=False))

if __name__=='__main__': main()
