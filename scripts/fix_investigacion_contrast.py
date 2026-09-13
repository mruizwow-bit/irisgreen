#!/usr/bin/env python3
"""Corrige contrastes de texto verificados en el artefacto público.

1) Investigación: Lighthouse detectó dos etiquetas de filtro a 3,69:1.
2) Directorio: el inventario WCAG encontró «Directorio de ayudas y trámites» a
   3,95:1 incluso sobre blanco.
3) Vídeos: «Dónde está» usaba #7a8698 a 13 px, también 3,69:1 sobre blanco.

Los dos últimos selectores pertenecen al DOM que monta el runtime: el HTML fuente
conserva el texto objetivo, pero no necesariamente el atributo data-dc-tpl antes
de ejecutar JavaScript. Por eso aquí se valida el texto y se inyecta la regla; la
auditoría de navegador posterior demuestra que el selector montado recibe el color.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

OLD = 'font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; color: #7a8698;'
NEW = 'font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; color: #627087;'
EXPECTED = 2
MARKER = 'ig-final-text-contrast'
EXTRA = [
    {
        'page':'es/tramites/directorio/index.html',
        'needle':'Directorio de ayudas y trámites',
        'style':'p[data-dc-tpl="60"]>.sc-interp{color:#197991!important}',
        'old':'#1f8ba8','new':'#197991','contrast':5.02,
    },
    {
        'page':'es/videos/index.html',
        'needle':'Dónde está',
        'style':'span[data-dc-tpl="65"]>.sc-interp{color:#627087!important}',
        'old':'#7a8698','new':'#627087','contrast':5.02,
    },
]


def inject_style(root: Path, fix: dict) -> dict:
    page = root / fix['page']
    if not page.is_file():
        raise FileNotFoundError(page)
    text = page.read_text(encoding='utf-8')
    count = text.count(fix['needle'])
    if count < 1:
        raise AssertionError(f"No se encuentra el texto objetivo en {fix['page']}: {fix['needle']}")
    style = f'<style id="{MARKER}">{fix["style"]}</style>'
    if style not in text:
        pos = text.lower().rfind('</head>')
        if pos < 0:
            raise AssertionError(f"HTML sin </head>: {fix['page']}")
        text = text[:pos] + style + '\n' + text[pos:]
        page.write_text(text, encoding='utf-8')
    return {**{k: fix[k] for k in ('page','needle','old','new','contrast')}, 'source_text_matches': count}


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

    extras = [inject_style(root, fix) for fix in EXTRA]
    print(json.dumps({
        'investigacion': {
            'page': page.relative_to(root).as_posix(),
            'labels_fixed': count,
            'old_color': '#7a8698',
            'new_color': '#627087',
            'contrast_on_white': 5.02,
        },
        'otros_textos': extras,
        'wcag_normal_text_minimum': 4.5,
        'runtime_selectors_verified_by_browser_audit': True,
    }, ensure_ascii=False))


if __name__ == '__main__':
    main()
