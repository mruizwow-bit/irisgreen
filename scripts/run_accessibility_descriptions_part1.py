#!/usr/bin/env python3
"""Run the approved Part 1 accessibility-copy integrator with safe route fallbacks."""
from __future__ import annotations
import argparse, json
from pathlib import Path
from urllib.parse import urljoin, urlsplit
import apply_accessibility_descriptions_part1 as core
import sentidos_author as sentidos
import sueno_author as sueno

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

def check(root: Path, approved=None):
    approved=approved or map_routes(root,core.rows())
    indexes={}
    for lang,rel in core.INDEXES.items():
        text=(root/rel).read_text(encoding='utf-8')
        tree,cards=core.card_nodes(text,rel)
        indexes[lang]=(text,tree,{c['url']:c for c in cards})
    search={x.get('u'):x for x in json.loads((root/'buscador.json').read_text(encoding='utf-8'))}
    for row in approved:
        for lang in ('es','en'):
            path=root/row[lang+'_path']
            text=path.read_text(encoding='utf-8')
            tree,h,lead=core.page_nodes(text)
            expected_title=row['title_es'] if lang=='es' else row['title_en']
            if tree.text(h)!=expected_title or tree.text(lead)!=row[lang]:
                raise ValueError('Approved wording mismatch: '+str(path))
            desc=[n.attrs.get('content') for n in tree.nodes if n.tag=='meta' and (n.attrs.get('name')=='description' or n.attrs.get('property')=='og:description')]
            if desc!=[row[lang],row[lang]]:
                raise ValueError('Stale metadata: '+str(path))
            _,index_tree,by=indexes[lang]
            card=by[row[lang+'_route']]
            if index_tree.text(card['lead'])!=row[lang]:
                raise ValueError('Stale catalogue description: '+str(path))
            # Spanish titles are part of the approved source. English titles were
            # not supplied in it and therefore remain exactly as they already were.
            if lang=='es' and index_tree.text(card['title'])!=row['title_es']:
                raise ValueError('Stale catalogue title: '+str(path))
        rec=search.get(row['es_route'])
        if not rec or rec.get('t')!=row['title_es'] or rec.get('d')!=row['es'] or rec.get('en',{}).get('d')!=row['en']:
            raise ValueError('Stale search record: '+row['es_route'])
    return {
        'source':core.SOURCE_NAME,
        'source_sha256':core.SOURCE_SHA256,
        'entries':141,
        'descriptions':282,
        'spanish_titles':141,
        'english_titles':'preserved',
        'pages_checked':282,
        'catalogue_cards_checked':282,
        'search_records_checked':141,
    }

_generic_rows = core.rows


def combined_rows():
    """Sentidos y Sueño usan sus fuentes editoriales protegidas; el resto conserva el paquete general."""
    approved = _generic_rows()
    sensory = {row['number']: row for row in sentidos.approved_rows()}
    sleep = {row['number']: row for row in sueno.approved_rows()}
    for row in approved:
        if row.get('area') == 'Sentidos':
            src = sensory[row['number']]
        elif row.get('area') == 'Sueño':
            src = sleep[row['number']]
        else:
            continue
        row['title_es'] = src['title_es']
        row['es'] = src['es']
        row['en'] = src['en']
    return approved


core.rows=combined_rows
core.map_routes=map_routes
core.check=check

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root',type=Path,default=core.REPO_ROOT)
    ap.add_argument('--apply',action='store_true')
    args=ap.parse_args()
    result=core.apply(args.root.resolve()) if args.apply else check(args.root.resolve())
    print(json.dumps(result,ensure_ascii=False,indent=2))

if __name__=='__main__':
    main()
