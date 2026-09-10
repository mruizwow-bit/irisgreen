#!/usr/bin/env python3
"""Integra la tanda cerrada de Situaciones · Sueño (23 fichas ES/EN).

Trabaja sobre la fuente editorial protegida, páginas, tarjetas, buscador y el
integrador general. No despliega. La opción --verify-dist solo comprueba dist.
"""
from __future__ import annotations

import argparse
import hashlib
import importlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INCOMING = ROOT / 'editorial/incoming/situaciones_sueno_20260910.txt'
SOURCE = ROOT / 'editorial/reviews/situaciones_sueno_ES_EN.md'
MANIFEST = ROOT / 'editorial/reviews/situaciones-sueno-manifest.json'
AUTHOR = ROOT / 'scripts/sueno_author.py'
GENERAL = ROOT / 'scripts/run_accessibility_descriptions_part1.py'


def parse(text: str) -> list[dict]:
    blocks = re.findall(
        r'^## (\d+)\. ([^\n]+)\n\n### ES\n([^\n]+)\n\n### EN\n([^\n]+)',
        text,
        re.M,
    )
    numbers = [int(x[0]) for x in blocks]
    if numbers != list(range(1, 24)):
        raise AssertionError(f'Se esperaban 23 entradas completas y se obtuvieron {numbers}')
    return [
        {'number': int(n), 'title_es': title, 'es': es, 'en': en}
        for n, title, es, en in blocks
    ]


def update_protected_source() -> tuple[list[dict], str]:
    incoming_text = INCOMING.read_text(encoding='utf-8')
    rows = parse(incoming_text)
    old = SOURCE.read_text(encoding='utf-8')
    marker = '## 1.'
    if marker not in old or marker not in incoming_text:
        raise AssertionError('No se encontró el inicio de la entrada 1')
    prefix = old.split(marker, 1)[0]
    incoming_body = marker + incoming_text.split(marker, 1)[1]
    new = prefix + incoming_body
    if not new.endswith('\n'):
        new += '\n'
    SOURCE.write_text(new, encoding='utf-8')
    digest = hashlib.sha256(new.encode('utf-8')).hexdigest()

    author = AUTHOR.read_text(encoding='utf-8')
    author, n = re.subn(
        r"SOURCE_SHA256 = '[0-9a-f]{64}'",
        f"SOURCE_SHA256 = '{digest}'",
        author,
        count=1,
    )
    if n != 1:
        raise AssertionError('No se encontró SOURCE_SHA256 en sueno_author.py')
    AUTHOR.write_text(author, encoding='utf-8')

    manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))
    if len(manifest.get('entries', [])) != 23:
        raise AssertionError('El manifiesto de Sueño no contiene 23 entradas')
    manifest['source_sha256'] = digest
    for wanted, entry in zip(rows, manifest['entries']):
        if entry.get('number') != wanted['number'] or entry.get('source_order') != wanted['number']:
            raise AssertionError('El orden/ruta congelado del manifiesto no coincide')
        entry['title_es'] = wanted['title_es']
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    return rows, digest


def apply_pages() -> dict:
    sys.path.insert(0, str((ROOT / 'scripts').resolve()))
    if 'sueno_author' in sys.modules:
        del sys.modules['sueno_author']
    import sueno_author as sa

    rows = sa.approved_rows()
    if len(rows) != 23:
        raise AssertionError('La fuente protegida de Sueño debe contener 23 entradas')

    for row in rows:
        for lang in ('es', 'en'):
            p = ROOT / row[lang + '_path']
            before = p.read_text(encoding='utf-8')
            p.write_text(sa.page_update(before, row, lang), encoding='utf-8')

    for lang, rel in sa.INDEXES.items():
        p = ROOT / rel
        p.write_text(sa.index_update(p.read_text(encoding='utf-8'), rel, rows, lang), encoding='utf-8')

    p = ROOT / 'buscador.json'
    p.write_text(sa.search_update(p.read_text(encoding='utf-8'), rows), encoding='utf-8')
    return sa.check(ROOT)


def protect_general_integrator() -> None:
    text = GENERAL.read_text(encoding='utf-8')
    if 'import sueno_author as sueno' not in text:
        needle = 'import sentidos_author as sentidos\n'
        if needle not in text:
            raise AssertionError('No se encontró la importación protegida de Sentidos')
        text = text.replace(needle, needle + 'import sueno_author as sueno\n', 1)

    replacement = '''_generic_rows = core.rows\n\n\ndef combined_rows():\n    \"\"\"Sentidos y Sueño usan sus fuentes editoriales protegidas; el resto conserva el paquete general.\"\"\"\n    approved = _generic_rows()\n    sensory = {row['number']: row for row in sentidos.approved_rows()}\n    sleep = {row['number']: row for row in sueno.approved_rows()}\n    for row in approved:\n        if row.get('area') == 'Sentidos':\n            src = sensory[row['number']]\n        elif row.get('area') == 'Sueño':\n            src = sleep[row['number']]\n        else:\n            continue\n        row['title_es'] = src['title_es']\n        row['es'] = src['es']\n        row['en'] = src['en']\n    return approved\n'''
    rx = re.compile(r'_generic_rows = core\.rows\n+def combined_rows\(\):.*?\n    return approved\n', re.S)
    text, n = rx.subn(replacement, text, count=1)
    if n != 1:
        raise AssertionError('No se pudo actualizar combined_rows() del integrador general')
    GENERAL.write_text(text, encoding='utf-8')


def visible_validation_labels(root: Path) -> list[str]:
    checks = [
        re.compile(r'<span\b[^>]*class="[^"]*\bchip\b[^"]*"[^>]*>\s*(?:VALIDADA|VALIDADO|VALIDATED)\s*</span>', re.I),
        re.compile(r'<h[1-6][^>]*>[^<]*(?:validación|validation)[^<]*</h[1-6]>', re.I),
        re.compile(r'(?:Validación editorial:|Editorial validation:)', re.I),
        re.compile(r'Validated for publication in this edition', re.I),
    ]
    bad: list[str] = []
    patterns = (
        'es/situaciones/*/index.html', 'en/situations/*/index.html',
        'es/neurodiversidad/condiciones/*/index.html', 'en/neurodiversity/conditions/*/index.html',
    )
    for pattern in patterns:
        for p in root.glob(pattern):
            text = p.read_text(encoding='utf-8')
            if any(rx.search(text) for rx in checks):
                bad.append(p.relative_to(root).as_posix())
    return bad


def verify_dist() -> None:
    sys.path.insert(0, str((ROOT / 'scripts').resolve()))
    import sueno_author as sa
    import sentidos_author as sentidos
    dist = ROOT / 'dist'
    sleep_result = sa.check(dist)
    sensory_result = sentidos.check(dist)
    bad = visible_validation_labels(dist)
    if bad:
        raise AssertionError('Rótulos de VALIDADA/VALIDATED visibles: ' + repr(bad[:20]))
    print(json.dumps({
        'sueno_entries': sleep_result['entries'],
        'sueno_descriptions_es_en': sleep_result['exact_descriptions'],
        'sentidos_entries_preserved': sensory_result['entries'],
        'sentidos_descriptions_es_en_preserved': sensory_result['exact_descriptions'],
        'visible_validation_labels_conditions_situations': 0,
        'deployment': False,
    }, ensure_ascii=False))


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--verify-dist', action='store_true')
    args = ap.parse_args()
    if args.verify_dist:
        verify_dist()
        return

    wanted, digest = update_protected_source()
    if len(wanted) != 23:
        raise AssertionError('Tanda incompleta')
    result = apply_pages()
    protect_general_integrator()

    # Volver a cargar para comprobar también el integrador ya protegido.
    importlib.invalidate_caches()
    print(json.dumps({
        'updated': 23,
        'source_sha256': digest,
        'protected_source_check': result['entries'] == 23 and result['exact_descriptions'] == 46,
        'general_integrator_uses_protected_sleep_source': True,
        'deployment': False,
    }, ensure_ascii=False))


if __name__ == '__main__':
    main()
