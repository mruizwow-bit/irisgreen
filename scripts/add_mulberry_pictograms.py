#!/usr/bin/env python3
"""Añade apoyos Mulberry únicamente a Tarjetas Iris con mapeo editorial explícito."""
from __future__ import annotations

import argparse
import re
from pathlib import Path

CSS_LINK = '<link rel="stylesheet" href="/assets/mulberry-pictograms.css">'
CARD_MARKER = 'data-iris-card-cta="true"'
CREDIT = 'Mulberry Symbols · Steve Lee · CC BY-SA 4.0'
ASSET_DIR = Path('assets/mulberry')
APPROVED = {
    'hablar.svg',
    'escribir.svg',
    'esperar.svg',
    'preguntar.svg',
    'carpeta.svg',
}

# No se deducen pictogramas por palabras. Cada asociación se revisa editorialmente.
PAGE_MAP: dict[str, dict[str, str]] = {
    'es/situaciones/necesito-que-me-repitan-las-instrucciones/index.html': {
        'Esto me cuesta': 'hablar.svg',
        'Me ayuda': 'escribir.svg',
    },
}


def add_css(text: str) -> str:
    if CSS_LINK in text:
        return text
    if '</head>' not in text:
        raise AssertionError('Página sin </head>')
    return text.replace('</head>', CSS_LINK + '\n</head>', 1)


def decorate_block(text: str, heading: str, filename: str) -> str:
    if filename not in APPROVED:
        raise AssertionError(f'Pictograma no aprobado: {filename}')
    if f'data-mulberry-picto="{filename}"' in text:
        return text

    pattern = re.compile(
        r'(<section class="iris-mini-block(?: [^"]*)?">\s*'
        r'<h3>' + re.escape(heading) + r'</h3>\s*)'
        r'(<p>.*?</p>)'
        r'(\s*</section>)',
        flags=re.S,
    )
    matches = list(pattern.finditer(text))
    if len(matches) != 1:
        raise AssertionError(
            f'Se esperaba un bloque «{heading}» y se encontraron {len(matches)}'
        )

    image = (
        f'<img class="iris-mini-picto" src="/assets/mulberry/{filename}" '
        f'width="64" height="64" alt="" aria-hidden="true">'
    )
    replacement = (
        matches[0].group(1)
        + f'<div class="iris-mini-support" data-mulberry-picto="{filename}">'
        + image
        + matches[0].group(2)
        + '</div>'
        + matches[0].group(3)
    )
    return text[:matches[0].start()] + replacement + text[matches[0].end():]


def add_credit(text: str) -> str:
    if 'class="iris-mini-picto-credit"' in text:
        return text
    anchor = '<a class="iris-mini-own"'
    pos = text.find(anchor)
    if pos < 0:
        raise AssertionError('Tarjeta Iris sin enlace «Crear mi propia tarjeta»')
    credit = f'<p class="iris-mini-picto-credit">{CREDIT}</p>'
    return text[:pos] + credit + text[pos:]


def validate_assets(root: Path) -> None:
    asset_dir = root / ASSET_DIR
    missing = sorted(name for name in APPROVED if not (asset_dir / name).is_file())
    if missing:
        raise FileNotFoundError('Faltan pictogramas Mulberry: ' + ', '.join(missing))


def apply_page(root: Path, rel: str, mapping: dict[str, str]) -> bool:
    path = root / rel
    if not path.is_file():
        raise FileNotFoundError(path)
    text = path.read_text(encoding='utf-8')
    if CARD_MARKER not in text:
        raise AssertionError(f'Tarjeta Iris no generada en {rel}')

    updated = add_css(text)
    for heading, filename in mapping.items():
        updated = decorate_block(updated, heading, filename)
    updated = add_credit(updated)

    if updated == text:
        return False
    path.write_text(updated, encoding='utf-8')
    return True


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path('dist'))
    args = parser.parse_args()
    root = args.root.resolve()

    validate_assets(root)
    changed = [rel for rel, mapping in PAGE_MAP.items() if apply_page(root, rel, mapping)]
    print(f'Mulberry: {len(changed)} página(s) con apoyos editoriales explícitos.')


if __name__ == '__main__':
    main()
