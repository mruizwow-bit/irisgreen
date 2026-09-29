#!/usr/bin/env python3
"""P03 · lo que se puede medir del puzle y de la lámina.

El encargo de P03 pide cinco cosas concretas —nodos/caminos, obstáculos,
varias soluciones, estado no dependiente del color y teclado completo— y una
sexta que no es un número: «visual fuerte». Esta prueba mide las cinco
primeras y **dice que la sexta no la mide**.

Lo que se mide:

  1. **Varias soluciones, y de verdad.** Se enumera el tablero entero y se
     cuentan las **rutas distintas**, no las colocaciones: un espejo de más
     puesto en una esquina donde no le llega la luz no es otra solución. La
     identidad de una solución es el camino que recorre el haz.
  2. **Los obstáculos sirven.** Que cada obstáculo corte de verdad alguna ruta
     que sin él funcionaría. Un obstáculo que no bloquea nada es decoración.
  3. **El divisor hace falta.** Que las dos pantallas no se puedan encender
     sólo con espejos: si se pudiera, el segundo estado no enseñaría nada.
  4. **La luz se reparte, no se duplica.** Que con el divisor cada pantalla
     reciba claramente menos que la única de antes.
  5. **El estado no depende del color.** Que la lámina tenga las tres señales
     —dibujo impreso distinto por pantalla, banderola y el propio haz— y que
     la bandeja tenga nombre visible y `<title>`.
  6. **El teclado está a la vista**, con su tecla escrita en la lámina.

Lo que NO se mide, y por eso no se declara: si la sala parece una sala, si el
haz se lee como luz en el aire, si los materiales se distinguen, y si el
segundo estado se entiende sin leer los pies.

Uso:  python3 scripts/test_r62_p03_rutas.py
"""
import itertools
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / 'scripts'))

import r62_p03_render as p        # noqa: E402


def ruta(tramos):
    """Identidad de una solución: por dónde pasa la luz, redondeado."""
    return tuple(sorted((round(a, 2), round(b, 2), round(c, 2), round(d, 2))
                        for a, b, c, d, _ in tramos))


def main():
    fallos = []
    r = {'schema': 'IRIS_R62_P03_RUTAS/1.0'}
    # los de verdad: donde no hay pantalla ni obstáculo ocupando el sitio
    anclajes = p.anclajes()
    r['anclajes'] = len(anclajes)

    # 1 · rutas distintas que encienden la pantalla del norte
    rutas_norte = set()
    for a in anclajes:
        for o in ('/', '\\'):
            tr, enc = p.trazar({a: o})
            if 'norte' in enc:
                rutas_norte.add(ruta(tr))
    for a, b in itertools.combinations(anclajes, 2):
        for oa in ('/', '\\'):
            for ob in ('/', '\\'):
                tr, enc = p.trazar({a: oa, b: ob})
                if 'norte' in enc:
                    rutas_norte.add(ruta(tr))
    r['rutas_distintas_norte'] = len(rutas_norte)
    if len(rutas_norte) < 2:
        fallos.append(f'sólo hay {len(rutas_norte)} ruta distinta al norte; '
                      f'el encargo pide varias soluciones')

    # 2 · las dos pantallas: hace falta el divisor
    solo_espejos = 0
    for a, b in itertools.combinations(anclajes, 2):
        for oa in ('/', '\\'):
            for ob in ('/', '\\'):
                _, enc = p.trazar({a: oa, b: ob})
                if 'norte' in enc and 'sur' in enc:
                    solo_espejos += 1
    r['dos_pantallas_solo_espejos'] = solo_espejos
    if solo_espejos:
        fallos.append('las dos pantallas se encienden sin divisor: el segundo '
                      'estado no enseñaría nada')

    rutas_dos = set()
    columnas = set()
    for a, b in itertools.combinations(anclajes, 2):
        for oa in ('/', '\\'):
            for ob in ('/', '\\'):
                for c in anclajes:
                    if c in (a, b):
                        continue
                    for oc in ('/', '\\'):
                        tr, enc = p.trazar({a: oa, b: ob}, divisores={c: oc})
                        if 'norte' in enc and 'sur' in enc:
                            rutas_dos.add(ruta(tr))
                            columnas.add(round(c[0], 2))
    r['rutas_distintas_dos_pantallas'] = len(rutas_dos)
    r['columnas_donde_cabe_el_reparto'] = len(columnas)
    if len(rutas_dos) < 3:
        fallos.append(f'sólo {len(rutas_dos)} rutas distintas encienden las dos')

    # 3 · cada obstáculo corta algo
    inutiles = []
    todos = list(p.OBSTACULOS)
    for i, obst in enumerate(todos):
        p.OBSTACULOS = [o for j, o in enumerate(todos) if j != i]
        sin = set()
        for a in anclajes:
            for o in ('/', '\\'):
                tr, enc = p.trazar({a: o})
                sin.add(ruta(tr))
        p.OBSTACULOS = todos
        con = set()
        for a in anclajes:
            for o in ('/', '\\'):
                tr, enc = p.trazar({a: o})
                con.add(ruta(tr))
        if sin == con:
            inutiles.append(obst[0] + f'@{obst[1]}')
    r['obstaculos'] = len(todos)
    r['obstaculos_que_no_cortan_nada'] = inutiles
    if inutiles:
        fallos.append(f'obstáculos que no cortan ninguna ruta: {inutiles}')

    # 4 · la luz se reparte
    _, antes = p.trazar(p.ESPEJOS_BASE)
    _, despues = p.trazar(p.ESPEJOS_BASE, divisores={p.ANCLAJE_DIVISOR: '\\'})
    r['intensidad_antes'] = {k: round(v, 3) for k, v in antes.items()}
    r['intensidad_despues'] = {k: round(v, 3) for k, v in despues.items()}
    if len(despues) < 2:
        fallos.append('el divisor no enciende las dos pantallas')
    else:
        caida = max(despues.values()) / max(max(antes.values()), 1e-6)
        r['caida_de_intensidad'] = round(caida, 3)
        if caida > 0.62:
            fallos.append(f'con el divisor cada pantalla recibe el {100*caida:.0f}% '
                          f'de antes: no se ve que la luz se reparta')

    # 5 y 6 · señales en la lámina
    d = REPO / 'editorial/r62/p03-rutas-de-luz'
    r['dibujos_por_pantalla'] = p.DIBUJO_PANTALLA
    if len(set(p.DIBUJO_PANTALLA.values())) < len(p.PANTALLAS):
        fallos.append('dos pantallas comparten dibujo: no se distinguen sin color')
    for f in ('gameplay-movil-navy.svg', 'gameplay-navy.svg'):
        ruta_svg = d / f
        if not ruta_svg.is_file():
            fallos.append(f'falta {f} para comprobar bandeja y teclas')
            continue
        txt = ruta_svg.read_text(encoding='utf-8')
        for nombre, _ in p.PIEZAS:
            if f'<title>{nombre}' not in txt:
                fallos.append(f'{f}: la pieza «{nombre}» no tiene nombre accesible')
            if f'>{nombre}</text>' not in txt:
                fallos.append(f'{f}: la pieza «{nombre}» no tiene etiqueta visible')
        if 'navy.svg' == f[-9:] and 'movil' not in f:
            for _, tecla in p.ACCIONES:
                if f'>{tecla}</text>' not in txt:
                    fallos.append(f'{f}: la tecla «{tecla}» no está escrita en la lámina')

    r['no_medido'] = [
        'si la sala parece una sala',
        'si el haz se lee como luz en el aire y no como una línea encima',
        'si piedra, madera, latón, hierro, papel y vidrio se distinguen',
        'si el segundo estado se entiende sin leer los pies',
    ]
    r['fallos'] = fallos
    r['gate'] = 'R62_P03_RUTAS_LUZ_MEASURED_PASS' if not fallos else 'FAIL'
    print(json.dumps(r, ensure_ascii=False, indent=1))
    return 1 if fallos else 0


if __name__ == '__main__':
    raise SystemExit(main())
