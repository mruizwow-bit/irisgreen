#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

BATCHES = [8,8,8,8,8,8,8,2]
FORBIDDEN = ('<metadata', 'c2pa', 'com.anthropic', 'id="Layer_1"', "id='Layer_1'")


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
    if len(rows) != 58:
        raise AssertionError(f'Se esperaban 58 pictogramas y hay {len(rows)}')
    if sum(BATCHES) != len(rows):
        raise AssertionError('Reparto de sprites incorrecto')
    dest.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(zip_path) as z:
        offset = 0
        for number, size in enumerate(BATCHES, 1):
            parts = ['<svg xmlns="http://www.w3.org/2000/svg">']
            for row in rows[offset:offset+size]:
                name = 'EN-symbols/' + row['archivo_mulberry']
                raw = z.read(name).decode('utf-8-sig')
                clean = sanitize(raw)
                low = clean.lower()
                if any(token.lower() in low for token in FORBIDDEN):
                    raise AssertionError(f'Metadato prohibido tras saneado en {name}')
                viewbox, inner = inner_svg(clean)
                parts.append(f'<symbol id="{row["id"]}" viewBox="{viewbox}">{inner}</symbol>')
            parts.append('</svg>\n')
            (dest / f'sprite-{number}.svg').write_text(''.join(parts), encoding='utf-8')
            offset += size

    text = ''.join(p.read_text(encoding='utf-8') for p in sorted(dest.glob('sprite-*.svg')))
    ids = re.findall(r'<symbol\s+id=["\']([^"\']+)["\']', text)
    if len(ids) != 58 or len(set(ids)) != 58:
        raise AssertionError(f'Símbolos generados: {len(ids)} / únicos: {len(set(ids))}')
    if set(ids) != {r['id'] for r in rows}:
        raise AssertionError('Los IDs generados no coinciden con sources.csv')
    low = text.lower()
    if any(token.lower() in low for token in FORBIDDEN):
        raise AssertionError('Los sprites generados contienen metadatos prohibidos')
    print({'sprites': 8, 'symbols': 58, 'dest': str(dest)})


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('zip', type=Path)
    ap.add_argument('--sources', type=Path, default=Path('assets/mulberry-rutinas/sources.csv'))
    ap.add_argument('--dest', type=Path, default=Path('assets/mulberry-rutinas'))
    args = ap.parse_args()
    build(args.zip, args.sources, args.dest)

if __name__ == '__main__':
    main()
