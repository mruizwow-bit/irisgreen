#!/usr/bin/env python3
"""Corrige el contraste de las etiquetas de filtro de Investigación en ``dist``.

Lighthouse detectó en /es/investigacion/ un contraste 3,69:1 para las etiquetas
«TIPO DE ESTUDIO» y «TEMA» (13 px, peso normal) sobre blanco. WCAG 2.x exige
4,5:1 para texto normal. El nuevo tono conserva el carácter gris azulado y ofrece
aprox. 5,02:1 sobre #fff.

El cambio es deliberadamente estrecho: solo sustituye las dos declaraciones
inline exactas de esas etiquetas en el artefacto público. Si cambia la plantilla,
la construcción falla para que la corrección se vuelva a revisar en lugar de
aplicarse a otro contenido por accidente.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

OLD = 'font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; color: #7a8698;'
NEW = 'font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; color: #627087;'
EXPECTED = 2


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path('dist'))
    args = parser.parse_args()
    root = args.root.resolve()
    page = root / 'es/investigacion/index.html'
    if not page.is_file():
        raise FileNotFoundError(page)

    text = page.read_text(encoding='utf-8')
    count = text.count(OLD)
    if count != EXPECTED:
        raise AssertionError(
            f'Se esperaban {EXPECTED} etiquetas de filtro con el color antiguo; encontradas: {count}. '
            'Revisar la plantilla antes de modificar el contrato de contraste.'
        )
    fixed = text.replace(OLD, NEW)
    if OLD in fixed or fixed.count(NEW) < EXPECTED:
        raise AssertionError('No se pudo aplicar de forma completa la corrección de contraste')
    page.write_text(fixed, encoding='utf-8')

    print(json.dumps({
        'page': page.relative_to(root).as_posix(),
        'labels_fixed': count,
        'old_color': '#7a8698',
        'new_color': '#627087',
        'contrast_on_white': 5.02,
        'wcag_normal_text_minimum': 4.5,
    }, ensure_ascii=False))


if __name__ == '__main__':
    main()
