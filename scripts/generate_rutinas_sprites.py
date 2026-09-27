#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

FORBIDDEN = ('<metadata', 'c2pa', 'com.anthropic', 'id="Layer_1"', "id='Layer_1'")


def plan(rows: list[dict]) -> list[tuple[str, list[dict]]]:
    """Agrupa las filas por la columna `sprite` de sources.csv.

    El reparto vive en los datos, no en el código: cada fila declara a qué
    archivo pertenece. Así el generador no depende de que haya 58, 93 ni
    ninguna otra cantidad, y las tandas de tamaños distintos (las primeras de
    ocho, las últimas de siete) salen solas.
    """
    if not rows:
        raise AssertionError('sources.csv está vacío')
    if 'sprite' not in rows[0]:
        raise AssertionError('sources.csv no declara la columna «sprite»')
    groups: dict[str, list[dict]] = {}
    order: list[str] = []
    for row in rows:
        name = (row.get('sprite') or '').strip()
        if not name:
            raise AssertionError(f'La fila «{row.get("id")}» no declara sprite')
        if not re.fullmatch(r'sprite-\d+\.svg', name):
            raise AssertionError(f'Nombre de sprite inesperado: {name}')
        if name not in groups:
            groups[name] = []
            order.append(name)
        groups[name].append(row)
    ids = [row['id'] for row in rows]
    duplicated = sorted({i for i in ids if ids.count(i) > 1})
    if duplicated:
        raise AssertionError(f'Identificadores repetidos en sources.csv: {duplicated}')
    return [(name, groups[name]) for name in order]


def sanitize(text: str) -> str:
    text = re.sub(r'<metadata\b[^>]*>.*?</metadata\s*>', '', text, flags=re.I | re.S)
    text = re.sub(r'<metadata\b[^>]*/\s*>', '', text, flags=re.I | re.S)
    text = re.sub(r'\s+xmlns:c2pa=(?:\"[^\"]*\"|\'[^\']*\')', '', text, flags=re.I)
    text = re.sub(r'\s+c2pa:[A-Za-z0-9_.:-]+=(?:\"[^\"]*\"|\'[^\']*\')', '', text, flags=re.I)
    text = re.sub(r'\s+id=(?:\"Layer_1\"|\'Layer_1\')', '', text)
    return text

def inner_svg(text: str) -> tuple[str, str]:
    text = sanitize(text)
    text = re.sub(r'<\?xml[^>]*>\s*', '', text, flags=re.I)
    m = re.search(r'<svg\b([^>]*)>(.*)</svg>\s*$', text, flags=re.I | re.S)
    if not m:
        raise ValueError('SVG raíz no reconocido')
    attrs, inner = m.group(1), m.group(2)
    vm = re.search(r'\bviewBox=["\']([^"\']+)["\']', attrs, flags=re.I)
    if not vm:
        wm = re.search(r'\bwidth=["\']([^"\']+)["\']', attrs, flags=re.I)
        hm = re.search(r'\bheight=["\']([^"\']+)["\']', attrs, flags=re.I)
        if not (wm and hm):
            raise ValueError('SVG sin viewBox ni width/height')
        viewbox = f'0 0 {wm.group(1)} {hm.group(1)}'
    else:
        viewbox = vm.group(1)
    return viewbox, inner


def build(zip_path: Path, sources: Path, dest: Path) -> None:
    rows = list(csv.DictReader(sources.open(encoding='utf-8-sig', newline='')))
    groups = plan(rows)
    dest.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(zip_path) as z:
        for sprite_name, members in groups:
            parts = ['<svg xmlns="http://www.w3.org/2000/svg">']
            for row in members:
                name = 'EN-symbols/' + row['archivo_mulberry']
                raw = z.read(name).decode('utf-8-sig')
                clean = sanitize(raw)
                low = clean.lower()
                if any(token.lower() in low for token in FORBIDDEN):
                    raise AssertionError(f'Metadato prohibido tras saneado en {name}')
                viewbox, inner = inner_svg(clean)
                parts.append(f'<symbol id="{row["id"]}" viewBox="{viewbox}">{inner}</symbol>')
            parts.append('</svg>\n')
            (dest / sprite_name).write_text(''.join(parts), encoding='utf-8')

    written = sorted(dest.glob('sprite-*.svg'))
    text = ''.join(p.read_text(encoding='utf-8') for p in written)
    ids = re.findall(r'<symbol\s+id=["\']([^"\']+)["\']', text)
    expected = {row['id'] for row in rows}
    if len(ids) != len(set(ids)):
        repeated = sorted({i for i in ids if ids.count(i) > 1})
        raise AssertionError(f'Símbolos duplicados en la salida: {repeated}')
    missing = sorted(expected - set(ids))
    extra = sorted(set(ids) - expected)
    if missing or extra:
        raise AssertionError(f'Cobertura incompleta. Faltan: {missing}. Sobran: {extra}')
    if len(ids) != len(rows):
        raise AssertionError(f'Se esperaban {len(rows)} símbolos y se generaron {len(ids)}')
    low = text.lower()
    if any(token.lower() in low for token in FORBIDDEN):
        raise AssertionError('Los sprites generados contienen metadatos prohibidos')
    in_order = sorted(groups, key=lambda g: int(re.search(r'\d+', g[0]).group()))
    print({'sources': len(rows), 'sprites': len(groups), 'symbols': len(ids),
           'per_sprite': {name: len(members) for name, members in in_order},
           'missing': 0, 'duplicated': 0, 'dest': str(dest)})


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('zip', type=Path)
    ap.add_argument('--sources', type=Path, default=Path('assets/mulberry-rutinas/sources.csv'))
    ap.add_argument('--dest', type=Path, default=Path('assets/mulberry-rutinas'))
    args = ap.parse_args()
    build(args.zip, args.sources, args.dest)

if __name__ == '__main__':
    main()
