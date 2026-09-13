#!/usr/bin/env python3
"""Inventaría qué páginas públicas cargan los runtimes que requieren unsafe-eval.

Diagnóstico únicamente: no modifica la salida ni declara que un archivo sea seguro
para borrar. Distingue archivos publicados, referencias directas desde HTML,
referencias literales desde otros JavaScript y uso del cargador ``x-import``.
"""
from __future__ import annotations

import argparse
import json
from collections import Counter, defaultdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

TARGETS = (
    'assets/runtime/8fe7df74405f3c55.js',
    'assets/games/dc-runtime.js',
    'support.js',
)


def normalize_src(value: str) -> str | None:
    if not value:
        return None
    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc:
        return None
    path = parsed.path.lstrip('/')
    if not path or path.startswith('../'):
        return None
    return path


class Page(HTMLParser):
    def __init__(self, text: str):
        super().__init__(convert_charrefs=True)
        self.scripts: list[str] = []
        self.x_dc = False
        self.x_import = False
        self.dc_logic = 'class Component extends DCLogic' in text
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        if tag == 'x-dc':
            self.x_dc = True
        elif tag == 'x-import':
            self.x_import = True
        if tag == 'script':
            src = dict(attrs).get('src')
            if src:
                self.scripts.append(src)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root', type=Path, default=Path('dist'))
    args = ap.parse_args()
    root = args.root.resolve()
    if not root.is_dir():
        raise FileNotFoundError(root)

    for rel in TARGETS:
        if not (root / rel).is_file():
            raise AssertionError(f'Falta runtime esperado en la salida pública: {rel}')

    html_refs: dict[str, list[str]] = defaultdict(list)
    xdc_pages: list[dict] = []
    x_import_pages: list[str] = []
    x_import_text_pages: list[str] = []
    script_counts: Counter[str] = Counter()

    html_files = sorted(root.rglob('*.html'))
    for path in html_files:
        rel = path.relative_to(root).as_posix()
        text = path.read_text(encoding='utf-8', errors='strict')
        doc = Page(text)
        normalized = [normalize_src(src) for src in doc.scripts]
        normalized = [src for src in normalized if src]
        script_counts.update(normalized)
        for target in TARGETS:
            if target in normalized:
                html_refs[target].append(rel)
        if doc.x_import:
            x_import_pages.append(rel)
        if 'x-import' in text.lower():
            x_import_text_pages.append(rel)
        if doc.x_dc or doc.dc_logic:
            xdc_pages.append({
                'page': rel,
                'x_dc': doc.x_dc,
                'dc_logic': doc.dc_logic,
                'x_import': doc.x_import,
                'target_runtimes': [target for target in TARGETS if target in normalized],
                'scripts': normalized,
            })

    js_refs: dict[str, list[str]] = defaultdict(list)
    x_import_js: list[str] = []
    js_files = sorted(root.rglob('*.js'))
    for path in js_files:
        rel = path.relative_to(root).as_posix()
        text = path.read_text(encoding='utf-8', errors='ignore')
        if 'x-import' in text.lower() and rel not in TARGETS:
            x_import_js.append(rel)
        for target in TARGETS:
            tokens = {target, '/' + target, Path(target).name}
            if rel != target and any(token in text for token in tokens):
                js_refs[target].append(rel)

    runtimes = []
    for target in TARGETS:
        direct = sorted(set(html_refs.get(target, [])))
        indirect = sorted(set(js_refs.get(target, [])))
        runtimes.append({
            'archivo': target,
            'bytes': (root / target).stat().st_size,
            'referencias_html': len(direct),
            'paginas_html': direct,
            'referencias_js': len(indirect),
            'archivos_js': indirect,
            'sin_referencias_encontradas': not direct and not indirect,
        })

    xdc_without_target = [row['page'] for row in xdc_pages if not row['target_runtimes']]
    report = {
        'html_revisados': len(html_files),
        'js_revisados': len(js_files),
        'paginas_x_dc_o_dc_logic': len(xdc_pages),
        'paginas_dinamicas': xdc_pages,
        'x_import': {
            'elementos_html': len(x_import_pages),
            'paginas_html': sorted(set(x_import_pages)),
            'menciones_html': len(set(x_import_text_pages)),
            'paginas_con_mencion': sorted(set(x_import_text_pages)),
            'menciones_js_fuera_de_runtimes': len(set(x_import_js)),
            'archivos_js': sorted(set(x_import_js)),
        },
        'runtimes_unsafe_eval': runtimes,
        'paginas_dinamicas_sin_runtime_objetivo_directo': xdc_without_target,
        'nota': (
            'Referencia no equivale por sí sola a ejecución de new Function; ausencia de referencias '
            'directas/JS sí identifica un candidato huérfano que debe validarse antes de eliminarse. '
            'El segundo new Function del runtime pertenece al cargador x-import: cero elementos/menciones '
            'fuera del runtime lo convierten en candidato a retirada separada, no en prueba automática.'
        ),
    }
    out = root / 'reports/publicacion'
    out.mkdir(parents=True, exist_ok=True)
    (out / 'csp-runtime-reachability.json').write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8'
    )
    print(json.dumps({
        'html_revisados': len(html_files),
        'paginas_dinamicas': len(xdc_pages),
        'x_import_elementos_html': len(x_import_pages),
        'x_import_menciones_html': len(set(x_import_text_pages)),
        'x_import_menciones_js_fuera_runtime': len(set(x_import_js)),
        'runtimes': [
            {
                'archivo': row['archivo'],
                'html': row['referencias_html'],
                'js': row['referencias_js'],
                'huerfano_candidato': row['sin_referencias_encontradas'],
            }
            for row in runtimes
        ],
        'dinamicas_sin_runtime_objetivo': len(xdc_without_target),
    }, ensure_ascii=False))


if __name__ == '__main__':
    main()
