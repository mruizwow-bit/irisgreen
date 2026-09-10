#!/usr/bin/env python3
"""Protege y aplica los 23 títulos ES y las 46 descripciones ES/EN aprobadas de Alimentación."""
from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path
from urllib.parse import urljoin, urlsplit

import apply_accessibility_descriptions_part1 as core

ROOT = Path(__file__).resolve().parents[1]
SOURCE = 'editorial/reviews/situaciones_alimentacion_ES_EN.md'
MANIFEST = 'editorial/reviews/situaciones-alimentacion-manifest.json'
SOURCE_SHA256 = '02bba44e8c94d955561cdb0bbf9158a05529b46a91c7c930ffb03c71c2ed16ba'
INDEXES = {'es': 'es/situaciones/index.html', 'en': 'en/situations/index.html'}
AREA = 'Alimentación'


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def load_source() -> list[dict]:
    raw = (ROOT / SOURCE).read_bytes()
    if sha(raw) != SOURCE_SHA256:
        raise ValueError('La fuente editorial de Alimentación cambió sin actualizar su hash protegido.')
    blocks = re.findall(
        r'^## (\d+)\. ([^\n]+)\n\n### ES\n([^\n]+)\n\n### EN\n([^\n]+)',
        raw.decode('utf-8'), re.M,
    )
    if [int(x[0]) for x in blocks] != list(range(1, 24)):
        raise ValueError('Se esperaban 23 entradas completas ES/EN de Alimentación.')
    return [
        {'number': int(i), 'area': AREA, 'title_es': title, 'es': es, 'en': en}
        for i, title, es, en in blocks
    ]


def discover_mapping(root: Path, rows: list[dict]) -> list[dict]:
    rel = INDEXES['es']
    text = (root / rel).read_text(encoding='utf-8')
    _, cards = core.card_nodes(text, rel)
    cards = [c for c in cards if c['area'] == AREA]
    if len(cards) != 23:
        raise ValueError(f'Se esperaban 23 tarjetas de Alimentación y hay {len(cards)}.')
    for row, card in zip(rows, cards):
        row['es_route'] = card['url']
        row['es_path'] = core.file_from_route(card['url'])
        es_text = (root / row['es_path']).read_text(encoding='utf-8')
        es_tree, _, _ = core.page_nodes(es_text)
        links = [n for n in es_tree.nodes if n.tag == 'a' and n.attrs.get('lang') == 'en' and core.has(n, 'lang')]
        if len(links) != 1:
            raise ValueError(f'Contraparte EN no resuelta para {row["es_route"]}: {len(links)} enlaces.')
        en_route = urlsplit(urljoin('https://irisgreen.eu/' + row['es_path'], links[0].attrs['href'])).path
        if not en_route.startswith('/en/situations/'):
            raise ValueError('Ruta EN inválida: ' + en_route)
        row['en_route'] = en_route
        row['en_path'] = core.file_from_route(en_route)
        en_text = (root / row['en_path']).read_text(encoding='utf-8')
        en_tree, en_title, _ = core.page_nodes(en_text)
        row['retained_title_en'] = en_tree.text(en_title)
    if len({r['es_path'] for r in rows}) != 23 or len({r['en_path'] for r in rows}) != 23:
        raise ValueError('Mapeo duplicado en Alimentación.')
    return rows


def approved_rows() -> list[dict]:
    rows = load_source()
    mp = ROOT / MANIFEST
    if not mp.is_file():
        raise ValueError('Falta el manifiesto protegido de Alimentación.')
    manifest = json.loads(mp.read_text(encoding='utf-8'))
    if manifest.get('source_sha256') != SOURCE_SHA256 or len(manifest.get('entries', [])) != 23:
        raise ValueError('Manifiesto de Alimentación inválido.')
    for row, entry in zip(rows, manifest['entries']):
        if entry.get('number') != row['number'] or entry.get('title_es') != row['title_es']:
            raise ValueError('El título o el orden de Alimentación no coincide con el manifiesto.')
        row.update(entry)
    return rows


def update_search(text: str, rows: list[dict]) -> str:
    data = json.loads(text)
    by_url = {item.get('u'): item for item in data}
    changed = 0
    for row in rows:
        item = by_url.get(row['es_route'])
        if not item or item.get('a') != AREA:
            raise ValueError('Registro de buscador inválido: ' + row['es_route'])
        if item.get('en', {}).get('u') != row['en_route']:
            raise ValueError('Contraparte EN del buscador inválida: ' + row['es_route'])
        item['t'] = row['title_es']
        item['d'] = row['es']
        item['en']['d'] = row['en']
        changed += 1
    if changed != 23:
        raise ValueError(f'Se actualizaron {changed} registros; se esperaban 23.')
    return json.dumps(data, ensure_ascii=False, indent=2) + '\n'


def check(root: Path) -> dict:
    rows = approved_rows()
    search = {x.get('u'): x for x in json.loads((root / 'buscador.json').read_text(encoding='utf-8'))}
    indexes = {}
    for lang, rel in INDEXES.items():
        text = (root / rel).read_text(encoding='utf-8')
        tree, cards = core.card_nodes(text, rel)
        indexes[lang] = (tree, {c['url']: c for c in cards})
    checked = []
    for row in rows:
        for lang in ('es', 'en'):
            path = root / row[lang + '_path']
            text = path.read_text(encoding='utf-8')
            tree, title, lead = core.page_nodes(text)
            expected_title = row['title_es'] if lang == 'es' else row['retained_title_en']
            if tree.text(title) != expected_title or tree.text(lead) != row[lang]:
                raise ValueError('Texto aprobado no coincide: ' + str(path))
            metas = [n.attrs.get('content') for n in tree.nodes if n.tag == 'meta' and (n.attrs.get('name') == 'description' or n.attrs.get('property') == 'og:description')]
            if metas != [row[lang], row[lang]]:
                raise ValueError('Metadatos desactualizados: ' + str(path))
            index_tree, cards = indexes[lang]
            card = cards[row[lang + '_route']]
            if index_tree.text(card['lead']) != row[lang]:
                raise ValueError('Tarjeta desactualizada: ' + str(path))
            if lang == 'es' and index_tree.text(card['title']) != row['title_es']:
                raise ValueError('Título de tarjeta desactualizado: ' + str(path))
            checked.append(row[lang + '_path'])
        item = search.get(row['es_route'])
        if not item or item.get('t') != row['title_es'] or item.get('d') != row['es'] or item.get('en', {}).get('d') != row['en']:
            raise ValueError('Buscador desactualizado: ' + row['es_route'])
    return {
        'entries': 23,
        'exact_descriptions': 46,
        'spanish_titles': 23,
        'english_titles': 'preserved',
        'checked_pages': checked,
        'catalogue_cards': 46,
        'search_entries': 23,
        'source_sha256': SOURCE_SHA256,
        'mode': 'protected author source',
    }


def apply() -> dict:
    if (ROOT / MANIFEST).exists():
        rows = approved_rows()
    else:
        rows = discover_mapping(ROOT, load_source())
        manifest = {
            'source': SOURCE,
            'source_sha256': SOURCE_SHA256,
            'scope': '23 títulos ES y 46 descripciones ES/EN. Títulos EN, rutas, fuentes, controles y demás secciones permanecen como estaban.',
            'entries': [
                {k: r[k] for k in ('number', 'title_es', 'es_route', 'es_path', 'en_route', 'en_path', 'retained_title_en')}
                for r in rows
            ],
        }
        (ROOT / MANIFEST).write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    for row in rows:
        for lang in ('es', 'en'):
            p = ROOT / row[lang + '_path']
            p.write_text(core.page_update(p.read_text(encoding='utf-8'), row, lang), encoding='utf-8')
    for lang, rel in INDEXES.items():
        p = ROOT / rel
        p.write_text(core.index_update(p.read_text(encoding='utf-8'), rel, rows, lang), encoding='utf-8')
    p = ROOT / 'buscador.json'
    p.write_text(update_search(p.read_text(encoding='utf-8'), rows), encoding='utf-8')
    return check(ROOT)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true')
    parser.add_argument('--root', type=Path, default=ROOT)
    args = parser.parse_args()
    result = apply() if args.apply else check(args.root.resolve())
    print(json.dumps(result, ensure_ascii=False, indent=2))
