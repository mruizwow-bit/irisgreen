#!/usr/bin/env python3
"""Retira la antigua optimización de layout de Investigación.

`content-visibility:auto` sobre todas las tarjetas reducía trabajo de renderizado,
pero Chromium podía mover el foco por teclado hasta el pie sin desplazar el
viewport: el control quedaba enfocado y completamente fuera de pantalla. La
carga diferida de los datos se conserva; únicamente se elimina esa regla CSS.

El script permanece como limpieza defensiva por si una fuente o artefacto antiguo
contiene todavía el marcador previo.
"""
from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LEGACY_MARK = '<style id="ig-investigacion-layout">main article{content-visibility:auto;contain-intrinsic-size:auto 420px}</style>'


def apply(path: Path) -> bool:
    text = path.read_text(encoding='utf-8')
    if LEGACY_MARK not in text:
        return False
    text = text.replace(LEGACY_MARK + '\n', '', 1)
    if LEGACY_MARK in text:
        text = text.replace(LEGACY_MARK, '', 1)
    path.write_text(text, encoding='utf-8')
    return True


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root', type=Path, default=ROOT / 'dist')
    args = ap.parse_args()
    page = args.root.resolve() / 'es/investigacion/index.html'
    if not page.is_file():
        raise FileNotFoundError(page)
    changed = apply(page)
    print({
        'pagina': 'es/investigacion/index.html',
        'content_visibility': False,
        'legacy_rule_removed': changed,
        'lazy_data_preserved': True,
    })


if __name__ == '__main__':
    main()
