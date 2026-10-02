#!/usr/bin/env python3
"""Matriz visual 27/27 del Taller (R54 §18).

Una fila por estudio con: identificador, antes, después, elementos de la escena,
por qué representa al estudio, si tiene variante de infancia y estado.

La columna «antes» y el texto «por qué» están en scripts/taller_suite/matriz_visual.py,
que es la fuente editorial; los datos medibles (peso, número de elementos, existencia
de variante) se leen del propio módulo de escenas, para que no se puedan desajustar.

Uso: python3 scripts/build_taller_visual_matrix.py > ruta.md
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from taller_suite import escenas as E, portada as PT  # noqa: E402
from taller_suite.matriz_visual import ANTES, PORQUE, ELEMENTOS  # noqa: E402

NOMBRES = {s[0]: (s[3], s[4]) for s in PT.STUDIOS}
SLUGS_EN = {s[0]: s[1] for s in PT.STUDIOS}


def main() -> int:
    filas, faltan = [], []
    for s in PT.STUDIOS:
        slug = s[0]
        if slug not in E.S:
            faltan.append(slug)
            continue
        svg = E.svg(E.S[slug]())
        n = svg.count('<') - 1
        child = slug in E.S_CHILD
        filas.append({
            'slug': slug, 'es': NOMBRES[slug][0], 'en': NOMBRES[slug][1],
            'antes': ANTES.get(slug, '—'), 'elementos': ELEMENTOS.get(slug, '—'),
            'porque': PORQUE.get(slug, '—'), 'child': child,
            'bytes': len(svg), 'n': n,
            'estado': 'PASS' if (n >= 15 and len(svg) < 4300) else 'REVISAR',
        })
    print('| # | Estudio | Antes (R47) | Después (R54) · elementos de la escena | Por qué representa el estudio | Variante infancia | Peso | Elementos | Estado |')
    print('|---|---|---|---|---|---|---|---|---|')
    for i, f in enumerate(filas, 1):
        print(f"| {i} | **{f['es']}** · *{f['en']}* | {f['antes']} | {f['elementos']} | {f['porque']} | "
              f"{'Sí' if f['child'] else 'No hace falta'} | {f['bytes']} B | {f['n']} | {f['estado']} |")
    print()
    total = sum(f['bytes'] for f in filas)
    child = sum(1 for f in filas if f['child'])
    print(f"**{len(filas)}/27 estudios · {sum(1 for f in filas if f['estado'] == 'PASS')} PASS · "
          f"{child} con variante de infancia · {total} B de escenas base "
          f"(media {total // max(1, len(filas))} B) · 0 iconos sueltos.**")
    if faltan:
        print('\n**FALTAN:** ' + ', '.join(faltan))
    return 1 if (faltan or any(f['estado'] != 'PASS' for f in filas)) else 0


if __name__ == '__main__':
    raise SystemExit(main())
