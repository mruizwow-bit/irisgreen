#!/usr/bin/env python3
"""Juegos · separar el índice del contenido.

`ROOM_GAMES_S0_SPLIT_PASS`. Hoy `assets/data/juegos-iris-data.js` lleva los 297
juegos **con su contenido dentro**, y cualquier página que quiera uno se trae
los 297. Para la web de casa da igual; para una pantalla en una sala con mal
wifi es la diferencia entre jugar y no jugar.

Esto parte el fichero en dos sin tocar el original:

  - `juegos-iris-index.js`: lo que necesita el catálogo para listar y filtrar
    —taxonomías, y de cada juego su slug, categoría, títulos, descripciones,
    etapa y mínimos—, sin el campo `f`;
  - `juegos/<slug>.js`: **un juego entero y suelto** —su fila del índice más su
    contenido—, que se carga cuando ese juego se abre. Se basta solo: una
    pantalla de sala que abre un juego concreto no necesita el índice.

El original se deja como está: esto es aditivo, y nada de producción cambia
hasta que alguien decida consumirlo.

La prueba de que el corte es correcto no es leerlo: es **volver a juntarlo** y
comprobar que sale el mismo objeto. Eso es lo que hace `--verificar`.

Uso:  python3 scripts/split_juegos_data.py [--verificar]
"""
from __future__ import annotations
import argparse
import json
import shutil
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
FUENTE = REPO / 'assets/data/juegos-iris-data.js'
INDICE = REPO / 'assets/data/juegos-iris-index.js'
CARPETA = REPO / 'assets/data/juegos'

CABECERA_INDICE = ('/* Iris Green · Juegos · índice: 297 juegos sin su contenido.\n'
                   '   El contenido de cada juego vive en assets/data/juegos/<slug>.js\n'
                   '   y se carga sólo cuando ese juego se abre. */\n')
CABECERA_JUEGO = '/* Iris Green · Juegos · contenido de un solo juego. */\n'


def leer_fuente():
    texto = FUENTE.read_text(encoding='utf-8')
    i = texto.index('var G=') + 6
    datos, _ = json.JSONDecoder().raw_decode(texto[i:])
    return datos


def _js(obj):
    return json.dumps(obj, ensure_ascii=False, separators=(',', ':'))


def partir(datos):
    indice = {k: v for k, v in datos.items() if k != 'juegos'}
    indice['juegos'] = [{k: v for k, v in j.items() if k != 'f'} for j in datos['juegos']]
    # Cada archivo de juego se basta solo: lleva su propia fila del índice
    # —slug, categoría, títulos, descripciones, etapa, mínimos— además del
    # contenido. Así una página de sala que abre un juego concreto no necesita
    # descargar el índice entero: con 92 KB de catálogo para jugar a uno, el
    # corte no habría servido de nada.
    contenido = {j['s']: j for j in datos['juegos'] if 'f' in j}
    return indice, contenido


def escribir(indice, contenido):
    INDICE.write_text(
        CABECERA_INDICE + '(function(){window.IG_JUEGOS_INDEX=' + _js(indice) + ';})();\n',
        encoding='utf-8')
    if CARPETA.exists():
        shutil.rmtree(CARPETA)
    CARPETA.mkdir(parents=True)
    for slug, juego in contenido.items():
        (CARPETA / f'{slug}.js').write_text(
            CABECERA_JUEGO + '(function(){(window.IG_JUEGO=window.IG_JUEGO||{})'
            + f'[{json.dumps(slug, ensure_ascii=False)}]=' + _js(juego) + ';})();\n',
            encoding='utf-8')


def verificar(datos, indice, contenido):
    """Volver a juntarlo tiene que dar el mismo objeto. Si no, el corte está mal."""
    rehecho = {k: v for k, v in indice.items() if k != 'juegos'}
    rehecho['juegos'] = []
    for j in indice['juegos']:
        entero = dict(j)
        if j['s'] in contenido:
            entero['f'] = contenido[j['s']]['f']
        rehecho['juegos'].append(entero)
    # el orden de las claves de cada juego puede cambiar al rehacerlo, así que
    # se comparan los objetos, no el texto
    return rehecho == datos


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--verificar', action='store_true',
                    help='sólo comprobar, sin escribir nada')
    args = ap.parse_args()

    datos = leer_fuente()
    indice, contenido = partir(datos)
    ok = verificar(datos, indice, contenido)

    b = lambda o: len(_js(o).encode())
    informe = {
        'juegos': len(datos['juegos']),
        'con_contenido': len(contenido),
        'bytes_fuente': b(datos),
        'bytes_indice': b(indice),
        'bytes_contenido_total': b(contenido),
        'juego_suelto_mediana': sorted(b(v) for v in contenido.values())[len(contenido) // 2],
        'juego_suelto_mayor': max(b(v) for v in contenido.values()),
        'recomponer_da_lo_mismo': ok,
    }
    if not args.verificar:
        escribir(indice, contenido)
        informe['indice_escrito'] = str(INDICE.relative_to(REPO))
        informe['fichas_escritas'] = len(list(CARPETA.glob('*.js')))
        informe['bytes_indice_en_disco'] = INDICE.stat().st_size
    print(json.dumps(informe, ensure_ascii=False, indent=1))
    return 0 if ok else 1


if __name__ == '__main__':
    raise SystemExit(main())
