#!/usr/bin/env python3
"""Rehace SOLO la capa vectorial de la lámina de causalidad de P03.

La orden `R62_P03_QA_REWORK_2_GAMEPLAY_PASS_CAUSALITY_LAYOUT_FIX_REQUIRED` dice
«solo SVG/layout» y «no rerender de escena». Los dos paneles ya renderizados
viven dentro del propio SVG como `data:image/webp;base64`, así que se
recuperan de ahí y se vuelven a montar con la banda 1→4 corregida. El resultado
es idéntico a un render completo —los dos caminos codifican el mismo webp una
sola vez— y cuesta segundos en vez de cinco minutos y medio.
"""
from __future__ import annotations
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / 'scripts'))

import ig_render_e4 as e4          # noqa: E402
import r62_p03_render as p         # noqa: E402

URI = re.compile(r'href="(data:image/webp;base64,[^"]+)"')


def rehacer(tema, carpeta):
    ruta = carpeta / f'causalidad-{tema}.svg'
    uris = URI.findall(ruta.read_text(encoding='utf-8'))
    # `findall` los da en orden de aparición y cada panel se escribe dos veces
    # (href y xlink:href), así que hay cuatro y valen el primero y el tercero.
    if len(uris) < 4:
        raise SystemExit(f'{ruta}: esperaba cuatro URIs de panel, hay {len(uris)}')
    izq, der = uris[0], uris[2]
    e4.set_theme(tema)
    p.configure(1180, 900, ventana=p.VENTANA_CAUSALIDAD, z_rango=p.Z_CAUSALIDAD)
    svg = p.lamina_causalidad(lambda con_divisor, w, h: der if con_divisor else izq)
    ruta.write_text(svg, encoding='utf-8')
    print(f'Reescrito {ruta}')


def main():
    carpeta = Path(sys.argv[1]) if len(sys.argv) > 1 else REPO / 'editorial/r62/p03-rutas-de-luz'
    for tema in ('navy', 'claro'):
        rehacer(tema, carpeta)


if __name__ == '__main__':
    main()
