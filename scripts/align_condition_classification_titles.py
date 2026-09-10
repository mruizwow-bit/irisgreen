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

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'editorial/standards/condition-classifications-2026-09-10.json'
INDEX = ROOT / 'es/neurodiversidad/condiciones/index.html'
CARD_RE = re.compile(r'<a\s+class="card"[^>]*>.*?<strong>(.*?)</strong>.*?</a>', re.S)


def plain(markup: str) -> str:
    return ' '.join(html.unescape(re.sub(r'<[^>]+>', '', markup)).split())


def main() -> None:
    data = json.loads(DATA.read_text(encoding='utf-8'))
    entries = data['entries']
    titles = [plain(x) for x in CARD_RE.findall(INDEX.read_text(encoding='utf-8'))]
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
    print(json.dumps({'entries':185, 'letters_changed':0, 'titles_aligned':len(changed), 'changes':changed}, ensure_ascii=False))


if __name__ == '__main__':
    main()
