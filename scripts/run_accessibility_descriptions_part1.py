#!/usr/bin/env python3
"""Run the approved Part 1 accessibility-copy integrator with route fallbacks."""
from __future__ import annotations
import argparse, json
from pathlib import Path
from urllib.parse import urljoin, urlsplit
import apply_accessibility_descriptions_part1 as core

SPECIAL_COUNTERPARTS={
    '/es/situaciones/necesito-que-me-repitan-las-instrucciones/':
        '/en/situations/i-need-instructions-repeated/'
}

def map_routes(root: Path, approved: list[dict]) -> list[dict]:
    rel=core.INDEXES['es']
    text=(root/rel).read_text(encoding='utf-8')
    _,cards=core.card_nodes(text,rel)
    for area,expected in core.AREAS:
        cs=[c for c in cards if c['area']==area]
        rs=[r for r in approved if r['area']==area]
        if len(cs)!=expected:
            raise ValueError(f'{area}: catalogue has {len(cs)} cards, expected {expected}')
        for row,card in zip(rs,cs):
            row['es_route']=card['url']
            row['es_path']=core.file_from_route(card['url'])
            es=(root/row['es_path']).read_text(encoding='utf-8')
            tree,_,_=core.page_nodes(es)
            links=[n for n in tree.nodes if n.tag=='a' and n.attrs.get('lang')=='en' and core.has(n,'lang')]
            if len(links)==1:
                er=urlsplit(urljoin('https://irisgreen.eu/'+row['es_path'],links[0].attrs['href'])).path
            elif not links and row['es_route'] in SPECIAL_COUNTERPARTS:
                er=SPECIAL_COUNTERPARTS[row['es_route']]
            else:
                raise ValueError(f"English counterpart for {row['es_route']}: expected one link or approved fallback, got {len(links)}")
            if not er.startswith('/en/situations/'):
                raise ValueError('Invalid English counterpart: '+er)
            row['en_route']=er
            row['en_path']=core.file_from_route(er)
            en=(root/row['en_path']).read_text(encoding='utf-8')
            et,eh,_=core.page_nodes(en)
            row['title_en']=et.text(eh)
    if len({r['es_path'] for r in approved})!=141 or len({r['en_path'] for r in approved})!=141:
        raise ValueError('Duplicate route mapping')
    return approved

core.map_routes=map_routes

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root',type=Path,default=core.REPO_ROOT)
    ap.add_argument('--apply',action='store_true')
    args=ap.parse_args()
    result=core.apply(args.root.resolve()) if args.apply else core.check(args.root.resolve())
    print(json.dumps(result,ensure_ascii=False,indent=2))

if __name__=='__main__':
    main()
