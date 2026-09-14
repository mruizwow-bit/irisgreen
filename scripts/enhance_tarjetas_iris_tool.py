#!/usr/bin/env python3
"""Aplica a la herramienta personal el ejemplo editorial B de Tarjeta Iris.

La asociación símbolo–texto no se adivina. Los tres pictogramas corresponden
únicamente a los textos del ejemplo aprobado. Si la persona modifica uno de esos
textos, el runtime retira ese pictograma y conserva el texto completo.
"""
from __future__ import annotations

import argparse
import html
from pathlib import Path

CSS = '<link rel="stylesheet" href="/assets/tarjetas-iris-pictogramas.css">'
JS = '<script defer src="/assets/tarjetas-iris-pictogramas.js"></script>'
NOTE = ('<p class="iris-picto-note" data-iris-picto-note>'
        'El ejemplo incluye apoyos visuales elegidos para estos textos. '
        'Si cambias un texto, su pictograma se quita para no asignar un símbolo que no corresponda.'</p>)

APPROVED = {
    'dificultad': {
        'picto': 'hablar',
        'text': 'Recordar varias indicaciones seguidas cuando me las explican solo de palabra.',
    },
    'ayuda': {
        'picto': 'escribir',
        'text': 'Que me expliquen una cosa cada vez y poder consultar los pasos por escrito.',
    },
    'necesito': {
        'picto': 'esperar',
        'text': 'Llevarme por escrito las indicaciones importantes que tengo que seguir después de la cita.',
    },
}


def support_markup(field: str, picto: str, approved_text: str) -> str:
    return (
        f'<div class="iris-tool-support has-picto" data-iris-approved-field="{field}" '
        f'data-iris-approved-text="{html.escape(approved_text, quote=True)}">'
        f'<img class="iris-tool-picto" src="/assets/mulberry/{picto}.svg" '
        'width="64" height="64" alt="" aria-hidden="true">'
        f'<p id="preview-{field}"></p></div>'
    )


def run(root: Path) -> dict:
    root = root.resolve()
    page = root / 'es/tarjetas-iris/index.html'
    if not page.is_file():
        raise FileNotFoundError(page)
    for asset in ('tarjetas-iris-pictogramas.css', 'tarjetas-iris-pictogramas.js'):
        if not (root / 'assets' / asset).is_file():
            raise FileNotFoundError(root / 'assets' / asset)
    for spec in APPROVED.values():
        picto_path = root / 'assets/mulberry' / f"{spec['picto']}.svg"
        if not picto_path.is_file():
            raise FileNotFoundError(picto_path)

    text = page.read_text(encoding='utf-8')
    original = text
    if CSS not in text:
        if '</head>' not in text:
            raise AssertionError('Tarjetas Iris sin </head>')
        text = text.replace('</head>', CSS + '\n</head>', 1)

    for field, spec in APPROVED.items():
        old = f'<p id="preview-{field}"></p>'
        if f'data-iris-approved-field="{field}"' not in text:
            if text.count(old) != 1:
                raise AssertionError(f'Vista previa inesperada para {field}')
            text = text.replace(old, support_markup(field, spec['picto'], spec['text']), 1)

    if 'data-iris-picto-note' not in text:
        marker = '<div class="iris-actions">'
        if text.count(marker) != 1:
            raise AssertionError('No se encuentra el bloque de acciones de la herramienta personal')
        text = text.replace(marker, NOTE + marker, 1)

    if JS not in text:
        if '</body>' not in text:
            raise AssertionError('Tarjetas Iris sin </body>')
        text = text.replace('</body>', JS + '\n</body>', 1)

    if text != original:
        page.write_text(text, encoding='utf-8')

    final = page.read_text(encoding='utf-8')
    for field, spec in APPROVED.items():
        assert final.count(f'data-iris-approved-field="{field}"') == 1
        assert f'src="/assets/mulberry/{spec["picto"]}.svg"' in final
    assert 'data-iris-picto-picker' not in final
    assert 'queue' not in final and 'confirmar__correct' not in final
    assert '/assets/tarjetas-iris-pictogramas.js' in final
    assert '/assets/tarjetas-iris-pictogramas.css' in final

    result = {
        'route': '/es/tarjetas-iris/',
        'default_variant': 'B',
        'approved_example': {
            'Esto me cuesta': 'hablar',
            'Me ayuda': 'escribir',
            'Necesito': 'esperar',
        },
        'pictogram_size_px': 64,
        'automatic_keyword_mapping': False,
        'custom_text_removes_unvalidated_picto': True,
        'browser_storage': False,
        'text_always_visible': True,
        'result': 'accepted',
    }
    print(result)
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=Path, default=Path('dist'))
    args = parser.parse_args()
    run(args.root)
