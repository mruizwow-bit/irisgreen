#!/usr/bin/env python3
"""Hace legibles sin JavaScript las cinco páginas de plantilla, en orden.

Ejecuta lo que hay que ejecutar y en el orden en que hay que hacerlo:

  1. Investigación, desde el JSON que la página ya lleva dentro (prerender_noscript.py).
  2. Construye dist con las páginas de hoy.
  3. Vídeos, Juegos, Cuestionarios y Sobre, desde lo que el navegador monta (snapshot_noscript.py).
  4. Vuelve a construir dist, ya con el contenido dentro.
  5. Comprueba que no queda ninguna página ilegible sin JavaScript.

No redacta ni cambia ningún texto. Libros queda fuera: esa página la lleva la autora.
"""
from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PASOS = [
    ('Investigación, desde su JSON', ['scripts/prerender_noscript.py']),
    ('Construir dist con las páginas de hoy', ['scripts/build_site.py']),
    ('Vídeos, Juegos, Cuestionarios y Sobre, desde el navegador', ['scripts/snapshot_noscript.py']),
    ('Construir dist con el contenido dentro', ['scripts/build_site.py']),
    ('Comprobar que todo se lee sin JavaScript', ['scripts/audit_sin_js.py', '--root', 'dist']),
]


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--check', action='store_true', help='no escribe: solo dice si falta regenerar algo')
    args = ap.parse_args()

    for numero, (nombre, orden) in enumerate(PASOS, start=1):
        argumentos = list(orden)
        if args.check and argumentos[0] in ('scripts/prerender_noscript.py', 'scripts/snapshot_noscript.py'):
            argumentos.append('--check')
        if args.check and argumentos[0] == 'scripts/build_site.py':
            print(f'{numero}/5 · {nombre}: se omite en modo comprobación')
            continue
        print(f'{numero}/5 · {nombre}')
        resultado = subprocess.run([sys.executable, str(ROOT / argumentos[0])] + argumentos[1:], cwd=ROOT)
        if resultado.returncode != 0:
            raise SystemExit(f'Se ha detenido en el paso {numero}: {nombre}')
    print('Listo: las cinco páginas se leen sin JavaScript.')


if __name__ == '__main__':
    main()
