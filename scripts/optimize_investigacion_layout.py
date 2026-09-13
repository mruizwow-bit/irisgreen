#!/usr/bin/env python3
"""Reduce el coste de layout inicial de Investigación sin ocultar contenido.

Solo modifica el artefacto de publicación. Los artículos siguen en el DOM,
continúan siendo buscables y accesibles; Chromium puede omitir el renderizado
de los que están lejos del viewport hasta que se acercan a pantalla.
"""
from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MARK = '<style id="ig-investigacion-layout">main article{content-visibility:auto;contain-intrinsic-size:auto 420px}</style>'


def apply(path: Path) -> bool:
    text = path.read_text(encoding='utf-8')
    if MARK in text:
        return False
    if '</head>' not in text:
        raise ValueError(f'No se encuentra </head> en {path}')
    text = text.replace('</head>', MARK + '\n</head>', 1)
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
    print({'pagina': 'es/investigacion/index.html', 'content_visibility': True, 'changed': changed})


if __name__ == '__main__':
    main()
