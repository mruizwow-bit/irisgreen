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
import ig_render_e4 as e4        # noqa: E402


def ruta(tramos):
    """Identidad de una solución: por dónde pasa la luz, redondeado."""
    return tuple(sorted((round(a, 2), round(b, 2), round(c, 2), round(d, 2))
                        for a, b, c, d, _ in tramos))


def _banda_causalidad():
    """Cajas reales de la banda 1→4: nada se sale de su columna ni se solapa."""
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        return {'fallos': ['banda de causalidad: falta playwright para medirla'],
                'medido': False}
    import tempfile
    ancho, alto = 1180, 900
    paso = (ancho - 88) / 4.0
    cols = [44 + i * paso for i in range(4)]
    # El límite de cada columna es donde empieza su flecha, no donde empieza la
    # columna siguiente: entre las dos hay un medianil que el texto tampoco
    # puede invadir.
    topes = [cols[i] + paso - 38 for i in range(3)] + [ancho - 44]
    fallos, cajas_por_lamina = [], {}
    with sync_playwright() as pw:
        navegador = pw.chromium.launch()
        for tema in ('navy', 'claro'):
            ruta = REPO / f'editorial/r62/p03-rutas-de-luz/causalidad-{tema}.svg'
            if not ruta.exists():
                fallos.append(f'falta {ruta.name}')
                continue
            with tempfile.NamedTemporaryFile('w', suffix='.html', delete=False,
                                             encoding='utf-8') as fh:
                fh.write('<body style="margin:0">'
                         + ruta.read_text(encoding='utf-8') + '</body>')
                tmp = Path(fh.name)
            pagina = navegador.new_page(viewport={'width': ancho, 'height': alto})
            pagina.goto(tmp.as_uri())
            pagina.wait_for_timeout(250)
            cajas = pagina.evaluate("""()=>[...document.querySelectorAll('svg text')]
                .map(t=>{const b=t.getBBox();
                  return {t:t.textContent.slice(0,30),x:b.x,y:b.y,w:b.width,h:b.height};})""")
            pagina.close()
            tmp.unlink()
            # la banda: por debajo del díptico y por encima del pie
            banda = [c for c in cajas if 660 < c['y'] < 860]
            cajas_por_lamina[tema] = len(banda)
            for c in banda:
                i = max(j for j in range(4) if c['x'] >= cols[j] - 16)
                if c['x'] + c['w'] > topes[i] + 0.5:
                    fallos.append(f'{tema}: el paso {i+1} se sale de su columna '
                                  f'{c["x"]+c["w"]-topes[i]:.1f} px ({c["t"]!r})')
            for i in range(4):
                dela = sorted((c for c in banda
                               if max(j for j in range(4) if c['x'] >= cols[j] - 16) == i),
                              key=lambda c: c['y'])
                for arriba, abajo in zip(dela, dela[1:]):
                    if abajo['y'] < arriba['y'] + arriba['h'] - 0.5:
                        fallos.append(f'{tema}: el paso {i+1} se solapa consigo mismo '
                                      f'({arriba["t"]!r} / {abajo["t"]!r})')
        navegador.close()
    return {'medido': True, 'cajas': cajas_por_lamina, 'fallos': fallos}


def _materias():
    """Color medio de cada familia de material sobre la imagen compuesta."""
    import numpy as np
    p.SS = 1
    e4.set_textures(e4.fbm_tile(octaves=6, gain=0.55, lowest=22, seed=17),
                    e4.fbm_tile(octaves=6, gain=0.61, lowest=40, seed=53))
    e4.set_theme('navy')
    p.configure(1180, 900, 104, 120)
    _, enc = p.trazar(p.ESPEJOS_BASE, {})
    buf = e4.Buffers()
    p.build_scene(buf, p.ESPEJOS_BASE, {}, enc, True)
    img = e4.compose(p.lighting(buf), buf, p.backdrop, exposure=1.80,
                     vignette=(1.18, 0.62, 1.45), contraste=0.30, pivote=0.36)
    familias = {'piedra': ['muro', 'revoco', 'revoco-roto', 'zocalo', 'suelo',
                           'pilar', 'mensula'],
                'madera': ['viga'], 'laton': ['laton', 'laton-mate'],
                'hierro': ['hierro'], 'papel': ['papel', 'papel-luz']}
    medias = {}
    for fam, mats in familias.items():
        sel = np.isin(buf.matid, [e4.MAT_IDS[m] for m in mats if m in e4.MAT_IDS])
        sel &= buf.mask
        if int(sel.sum()) < 40:
            continue
        medias[fam] = img[sel].mean(0)
    ks = list(medias)
    pares = sorted((round(float(np.linalg.norm(medias[a] - medias[b])), 4), a, b)
                   for i, a in enumerate(ks) for b in ks[i + 1:])
    return {'luminancia': {k: round(float(0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]), 4)
                           for k, v in medias.items()},
            'peor_par': list(pares[0]), 'segundo_par': list(pares[1])}


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

    # Separación de materias, sobre la imagen compuesta y por familia de
    # material. Estaba en «no medido», y por eso pasó un render entero en el
    # que el hierro salía *más claro* que la piedra: bajarle el albedo no lo
    # oscurecía porque el especular de este motor no va multiplicado por el
    # albedo. Lo que no se mide, se afirma.
    # Banda 1→4 de la lámina de causalidad, medida sobre el render real del
    # navegador. La vuelta anterior la dio por buena mirándola: el paso 3
    # llegaba a tocar la flecha y la columna 4, y el 4 se pegaba al margen.
    # Un texto sin medir es un texto que se sale.
    r['banda_causalidad'] = banda = _banda_causalidad()
    fallos.extend(banda['fallos'])

    r['separacion_de_materias'] = sep = _materias()
    if sep['peor_par'][0] < 0.045:
        fallos.append('materias indistinguibles: {} y {} a {}'.format(
            sep['peor_par'][1], sep['peor_par'][2], sep['peor_par'][0]))

    r['no_medido'] = [
        'si la sala parece una sala',
        'si el haz se lee como luz en el aire y no como una línea encima',
        'si el segundo estado se entiende sin leer los pies',
    ]
    r['fallos'] = fallos
    r['gate'] = 'R62_P03_RUTAS_LUZ_MEASURED_PASS' if not fallos else 'FAIL'
    print(json.dumps(r, ensure_ascii=False, indent=1))
    return 1 if fallos else 0


if __name__ == '__main__':
    raise SystemExit(main())
