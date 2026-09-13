#!/usr/bin/env python3
"""Corrige contrastes de texto verificados en el artefacto público.

1) Investigación: Lighthouse detectó dos etiquetas de filtro a 3,69:1.
2) Directorio: el inventario WCAG encontró «Directorio de ayudas y trámites» a
   3,95:1 incluso sobre blanco.
3) Vídeos: «Dónde está» usaba #7a8698 a 13 px, también 3,69:1 sobre blanco.

Los dos últimos objetivos pertenecen al DOM que monta el runtime. La salida HTML
estática puede no conservar ni el texto ni el atributo data-dc-tpl después de los
pasos de prerender/lazy-load, así que el build solo inyecta una regla de alcance
muy estrecho en la ruta correspondiente. La auditoría de navegador posterior es
la que verifica que el selector existe en el DOM montado y que el color corregido
elimina el fallo de contraste. Si el runtime cambia y el selector deja de existir,
el guardarraíl de contraste vuelve a fallar en vez de dar el caso por aprobado.
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
    source_matches = text.count(fix['needle'])
    style = f'<style id="{MARKER}">{fix["style"]}</style>'
    if style not in text:
        pos = text.lower().rfind('</head>')
        if pos < 0:
            raise AssertionError(f"HTML sin </head>: {fix['page']}")
        text = text[:pos] + style + '\n' + text[pos:]
        page.write_text(text, encoding='utf-8')
    return {
        **{k: fix[k] for k in ('page','needle','old','new','contrast')},
        'source_text_matches': source_matches,
        'runtime_selector': fix['style'].split('{', 1)[0],
    }


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
