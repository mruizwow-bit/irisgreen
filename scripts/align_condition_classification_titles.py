#!/usr/bin/env python3
"""Alinea los nombres del registro de clasificación con los 185 títulos reales del catálogo ES.

No cambia ninguna letra. Evita que abreviaturas editoriales antiguas (CAA, DCD, OSFED,
PDA, etc.) bloqueen la aplicación de una clasificación que ya está fijada por ficha y
por posición en el inventario de 185 entradas.
"""
from __future__ import annotations
import html
import json
import re
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'editorial/standards/condition-classifications-2026-09-10.json'
INDEX = ROOT / 'es/neurodiversidad/condiciones/index.html'
CARD_RE = re.compile(r'<a\s+class="card"[^>]*href="(?P<href>[^"]+)"[^>]*>.*?<strong>(?P<title>.*?)</strong>.*?</a>', re.S)


def plain(markup: str) -> str:
    return ' '.join(html.unescape(re.sub(r'<[^>]+>', '', markup)).split())


def href_to_rel(href: str) -> str:
    path = urlsplit(href).path
    parts = [p for p in path.split('/') if p not in ('', '.', '..')]
    for i, part in enumerate(parts):
        if part in ('es', 'en'):
            return '/'.join(parts[i:]).rstrip('/') + '/index.html'
    return ''


def main() -> None:
    data = json.loads(DATA.read_text(encoding='utf-8'))
    entries = data['entries']
    cards = list(CARD_RE.finditer(INDEX.read_text(encoding='utf-8')))
    titles = [plain(m.group('title')) for m in cards]
    if len(entries) != 185 or len(titles) != 185:
        raise AssertionError((len(entries), len(titles)))
    if len(set(titles)) != 185:
        raise AssertionError('El catálogo ES contiene títulos duplicados')
    changed = []
    for i, ((old, grade), title) in enumerate(zip(entries, titles), 1):
        if old != title:
            changed.append({'n': i, 'from': old, 'to': title})
        entries[i-1] = [title, grade]
    DATA.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')

    missing_en = []
    for i, m in enumerate(cards, 1):
        rel = href_to_rel(m.group('href'))
        page = ROOT / rel
        text = page.read_text(encoding='utf-8')
        if not re.search(r'<link\b[^>]*hreflang="en"[^>]*>', text, flags=re.I):
            missing_en.append({'n': i, 'title': titles[i-1], 'path': rel})

    print(json.dumps({'entries':185, 'letters_changed':0, 'titles_aligned':len(changed), 'changes':changed, 'missing_en_hreflang':missing_en}, ensure_ascii=False))


if __name__ == '__main__':
    main()
