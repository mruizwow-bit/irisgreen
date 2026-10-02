# -*- coding: utf-8 -*-
"""Escena rica de Simulaciones (R65 · tanda 5).

La regla y lo que pasa cuando se aplica, sobre la mesa y con fichas.

Una simulación no es una pantalla: es **una regla que se repite y produce algo
que nadie había dibujado**. Por eso aquí se enseña con fichas, que es como se
entiende.

Lo que se ve:

* el **tablero grande** con su retícula y las fichas colocadas: la generación
  que se está calculando ahora, con **tres celdas marcadas a lápiz** —las que
  van a nacir en el paso siguiente— y una ficha levantada a medio poner;
* las fichas son objetos: canto biselado, brillo arriba a la izquierda y sombra
  de contacto propia, no círculos pintados sobre la cuadrícula;
* **las tres generaciones anteriores**, en tableros pequeños clavados encima, en
  orden: se ve que el dibujo no lo hizo nadie, salió de repetir la regla. Las
  generaciones **están calculadas de verdad**, aplicando la regla paso a paso;
* la **tarjeta de la regla**, con los casos dibujados: cuántas vecinas hacen que
  una celda siga, nazca o muera, con sus flechas;
* la **hoja de recuento**, con la curva de población trazada a mano punto a
  punto y los puntos marcados, más las cifras de cada paso como bloques;
* el bote de fichas de repuesto, volcado, con las que se han salido;
* la lupa sobre una zona del tablero, porque en una simulación siempre hay un
  rincón que hay que mirar de cerca.

Sin personajes, sin pantallas, sin gráficos de ordenador: la regla y su efecto.
"""
import math

from taller_suite.escenas_ricas import C, W, H, svg, lg, rg
from taller_suite import rica_comun as M

k = C
P = 'si'

MESA = 130

FICHA = '#2f6f87'
FICHA_L = '#63a8c0'
FICHA_S = '#1b4a5e'

# El tablero grande
TX, TY, CEL, COLS, FILAS = 40, 186, 20.0, 15, 10


def _paso(estado, cols, filas):
    """Una generación de un autómata de vecindad, calculada de verdad.

    Regla: una celda viva sigue viva con 2 o 3 vecinas; una vacía nace con
    exactamente 3. Es la regla que hay escrita en la tarjeta de la escena, y las
    generaciones que se ven en los tableros pequeños salen de aplicarla, no de
    colocar fichas a gusto. Si la regla de la tarjeta cambiara, cambiarían.
    """
    nuevo = set()
    for y in range(filas):
        for x in range(cols):
            n = sum(1 for dx in (-1, 0, 1) for dy in (-1, 0, 1)
                    if (dx or dy) and ((x + dx) % cols, (y + dy) % filas) in estado)
            if ((x, y) in estado and n in (2, 3)) or ((x, y) not in estado and n == 3):
                nuevo.add((x, y))
    return nuevo


#: siembra inicial: un planeador y un bloque, que dan un dibujo que se mueve
SIEMBRA = {(2, 1), (3, 2), (1, 3), (2, 3), (3, 3),
           (8, 4), (9, 4), (8, 5), (9, 5),
           (11, 7), (12, 7), (13, 7), (12, 6)}

GEN = [SIEMBRA]
for _ in range(3):
    GEN.append(_paso(GEN[-1], COLS, FILAS))


def _ficha(cx, cy, r, *, col=FICHA, alto=3.2, op=1.0):
    """Una ficha: canto biselado, cara y brillo. Un objeto, no un círculo."""
    return (f'<ellipse cx="{M.r1(cx + 1.4)}" cy="{M.r1(cy + alto + 1.6)}" '
            f'rx="{M.r1(r)}" ry="{M.r1(r * .5)}" fill="{k["noche"]}" '
            f'opacity="{M.r2(op * .34)}" filter="url(#b2)"/>'
            f'<ellipse cx="{M.r1(cx)}" cy="{M.r1(cy + alto)}" rx="{M.r1(r)}" '
            f'ry="{M.r1(r * .55)}" fill="{FICHA_S}" opacity="{op}"/>'
            f'<ellipse cx="{M.r1(cx)}" cy="{M.r1(cy)}" rx="{M.r1(r)}" '
            f'ry="{M.r1(r * .55)}" fill="{col}" opacity="{op}"/>'
            f'<ellipse cx="{M.r1(cx)}" cy="{M.r1(cy)}" rx="{M.r1(r * .68)}" '
            f'ry="{M.r1(r * .37)}" fill="none" stroke="{FICHA_S}" stroke-width=".9" '
            f'opacity="{M.r2(op * .5)}"/>'
            f'<ellipse cx="{M.r1(cx - r * .32)}" cy="{M.r1(cy - r * .2)}" '
            f'rx="{M.r1(r * .32)}" ry="{M.r1(r * .16)}" fill="#ffffff" '
            f'opacity="{M.r2(op * .5)}" filter="url(#b2)"/>')


def _tablero():
    """El tablero grande con la generación actual y las celdas marcadas."""
    w, h = COLS * CEL, FILAS * CEL
    g = [M.sombra(TX - 8, TY - 8, w + 16, h + 16, op=.32, dx=10, dy=13, rx=5),
         f'<rect x="{TX - 9}" y="{TY - 9}" width="{M.r1(w + 18)}" '
         f'height="{M.r1(h + 18)}" rx="6" fill="url(#{P}_marco)"/>',
         f'<rect x="{TX - 9}" y="{TY - 9}" width="{M.r1(w + 18)}" height="5" rx="2.5" '
         f'fill="#ffffff" opacity=".3"/>',
         f'<rect x="{TX}" y="{TY}" width="{M.r1(w)}" height="{M.r1(h)}" '
         f'fill="url(#{P}_tabla_juego)"/>']
    for i in range(COLS + 1):
        g.append(f'<path d="M{M.r1(TX + i * CEL)} {TY} v{M.r1(h)}" stroke="{k["noche"]}" '
                 f'stroke-width="{1.2 if i % 5 == 0 else .7}" '
                 f'opacity="{.32 if i % 5 == 0 else .18}"/>')
    for j in range(FILAS + 1):
        g.append(f'<path d="M{TX} {M.r1(TY + j * CEL)} h{M.r1(w)}" stroke="{k["noche"]}" '
                 f'stroke-width="{1.2 if j % 5 == 0 else .7}" '
                 f'opacity="{.32 if j % 5 == 0 else .18}"/>')
    # las fichas de la generación actual
    for (x, y) in sorted(GEN[3]):
        g.append(_ficha(TX + (x + .5) * CEL, TY + (y + .5) * CEL, CEL * .38))
    # las celdas que nacen en el paso siguiente, marcadas a lápiz
    nacen = sorted(_paso(GEN[3], COLS, FILAS) - GEN[3])[:3]
    for i, (x, y) in enumerate(nacen):
        cx, cy = TX + (x + .5) * CEL, TY + (y + .5) * CEL
        g.append(f'<circle cx="{M.r1(cx)}" cy="{M.r1(cy)}" r="{M.r1(CEL * .34)}" '
                 f'fill="none" stroke="#c8322c" stroke-width="1.6" opacity=".8" '
                 f'stroke-dasharray="4 3"/>')
    return ''.join(g)


def _ficha_en_mano():
    """Una ficha levantada, a medio poner: la escena está en marcha."""
    cx, cy = TX + 11.6 * CEL, TY + 2.2 * CEL
    return (f'<ellipse cx="{M.r1(cx + 6)}" cy="{M.r1(cy + 26)}" rx="11" ry="4.6" '
            f'fill="{k["noche"]}" opacity=".3" filter="url(#b5)"/>'
            + _ficha(cx, cy - 12, CEL * .4))


def _generaciones():
    """Los tres tableros pequeños con las generaciones anteriores, en orden."""
    g = []
    lado = 7.0
    for n in range(3):
        bx, by = 350 + n * 94, 22
        g.append(M.sombra(bx, by, 78, 78, op=.26, dx=5, dy=7, rx=3, blur='b2'))
        g.append(f'<g transform="rotate({M.r1((M.n(n, 3.1) - .5) * 6)} '
                 f'{M.r1(bx + 39)} {M.r1(by + 39)})">')
        g.append(f'<rect x="{bx - 4}" y="{by - 4}" width="86" height="86" rx="4" '
                 f'fill="url(#{P}_marco)"/>')
        g.append(f'<rect x="{bx}" y="{by}" width="78" height="78" '
                 f'fill="url(#{P}_tabla_juego)"/>')
        for i in range(12):
            g.append(f'<path d="M{M.r1(bx + i * lado)} {by} v78" stroke="{k["noche"]}" '
                     f'stroke-width=".5" opacity=".16"/>')
            g.append(f'<path d="M{bx} {M.r1(by + i * lado)} h78" stroke="{k["noche"]}" '
                     f'stroke-width=".5" opacity=".16"/>')
        for (x, y) in sorted(GEN[n]):
            if x >= 11 or y >= 11:
                continue
            g.append(f'<circle cx="{M.r1(bx + (x + .5) * lado)}" '
                     f'cy="{M.r1(by + (y + .5) * lado)}" r="{M.r1(lado * .34)}" '
                     f'fill="{FICHA}"/>')
        # la chincheta
        g.append(f'<circle cx="{bx + 39}" cy="{by - 6}" r="4.6" fill="#c8322c"/>')
        g.append(f'<circle cx="{bx + 37.4}" cy="{by - 7.4}" r="1.6" fill="#f4b3a2" '
                 f'opacity=".9"/>')
        # la flecha al siguiente
        if n < 2:
            g.append(f'<path d="M{bx + 84} {by + 39} h10 m-4 -4 l4 4 l-4 4" '
                     f'fill="none" stroke="{k["tinta"]}" stroke-width="1.6" '
                     f'opacity=".55" stroke-linecap="round"/>')
        g.append('</g>')
    return ''.join(g)


def _tarjeta_regla():
    """La tarjeta con la regla dibujada caso por caso."""
    x, y, w, h = 372, 176, 196, 180
    g = [M.sombra(x, y, w, h, op=.26, dx=6, dy=9, rx=2),
         f'<g transform="rotate(-5 {x + w / 2} {y + h / 2})">',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" '
         f'fill="url(#{P}_pliego)"/>',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" fill="none" '
         f'stroke="#b5ac9b" stroke-width=".8" opacity=".8"/>',
         f'<rect x="{x + 18}" y="{y + 16}" width="84" height="3.4" rx="1.7" '
         f'fill="{k["tinta"]}" opacity=".6"/>']
    # tres casos: sigue, nace, muere
    for i, (vivas, resultado) in enumerate(((2, 'sigue'), (3, 'nace'), (1, 'muere'))):
        cy = y + 52 + i * 42
        # la celda central y sus vecinas
        for j in range(3):
            for l in range(3):
                cx = x + 22 + j * 13
                yy = cy - 13 + l * 13
                centro = j == 1 and l == 1
                lleno = centro or (j * 3 + l) in ([0, 8], [0, 2, 8], [4])[i]
                g.append(f'<rect x="{M.r1(cx)}" y="{M.r1(yy)}" width="11.4" '
                         f'height="11.4" rx="1.4" '
                         f'fill="{FICHA if lleno and not centro else "none"}" '
                         f'stroke="{k["grafito"]}" stroke-width=".7" opacity=".8"/>')
                if centro:
                    g.append(f'<circle cx="{M.r1(cx + 5.7)}" cy="{M.r1(yy + 5.7)}" '
                             f'r="4" fill="{FICHA if i != 1 else "none"}" '
                             f'stroke="{FICHA_S}" stroke-width=".8"/>')
        g.append(f'<path d="M{x + 68} {M.r1(cy)} h20 m-6 -5 l6 5 l-6 5" fill="none" '
                 f'stroke="{k["tinta"]}" stroke-width="1.2" opacity=".6" '
                 f'stroke-linecap="round"/>')
        col = FICHA if resultado != 'muere' else '#c8322c'
        if resultado == 'muere':
            g.append(f'<path d="M{x + 98} {M.r1(cy - 7)} l14 14 m0 -14 l-14 14" '
                     f'stroke="{col}" stroke-width="2" opacity=".85" '
                     f'stroke-linecap="round"/>')
        else:
            g.append(_ficha(x + 105, cy, 9.5, col=col, alto=2.6))
        for j in range(2):
            g.append(f'<rect x="{x + 126}" y="{M.r1(cy - 5 + j * 8)}" '
                     f'width="{M.r1(52 - j * 18)}" height="2.4" rx="1.2" '
                     f'fill="{k["grafito"]}" opacity=".45"/>')
    g.append('</g>')
    return ''.join(g)


def _bote():
    """El bote de fichas volcado, con las que se han salido."""
    g = [M.contacto(60, 392, 96, op=.4, alto=6)]
    g.append('<g transform="rotate(104 104 372)">')
    g.append(M.sombra(78, 330, 52, 86, op=.3, dx=8, dy=10, rx=6, sesgo=-.2))
    g.append(f'<path d="M80 336 L78 408 Q104 416 130 408 L128 336 Z" '
             f'fill="url(#{P}_bote)"/>')
    g.append(f'<ellipse cx="104" cy="336" rx="24" ry="8" fill="#e8e2d4"/>')
    g.append(f'<ellipse cx="104" cy="336" rx="21" ry="6" fill="#b6ae9f"/>')
    g.append(M.brillo_borde('M86 402 L85 344', color='#ffffff', w=3.4, op=.4))
    g.append('</g>')
    # las fichas derramadas
    for i in range(7):
        cx = 118 + M.n(i, 3.1) * 120
        cy = 356 + M.n(i, 7.7) * 34
        g.append(_ficha(cx, cy, 9.2, alto=2.6))
    return ''.join(g)


def _lupa():
    """La lupa sobre una zona del tablero."""
    cx, cy, r = 232, 300, 42
    g = [M.sombra(cx - r, cy - r + 10, r * 2, r * 2, op=.3, blur='b5', rx=42,
                  dx=9, dy=12)]
    g.append(f'<g clip-path="url(#{P}_cp_lupa)">')
    # lo de debajo, aumentado: la retícula y las fichas, al doble
    aum = 2.0
    g.append(f'<rect x="{cx - r}" y="{cy - r}" width="{r * 2}" height="{r * 2}" '
             f'fill="url(#{P}_tabla_juego)"/>')
    for i in range(-4, 5):
        g.append(f'<path d="M{M.r1(cx + i * CEL * aum)} {cy - r} v{r * 2}" '
                 f'stroke="{k["noche"]}" stroke-width="1" opacity=".22"/>')
        g.append(f'<path d="M{cx - r} {M.r1(cy + i * CEL * aum)} h{r * 2}" '
                 f'stroke="{k["noche"]}" stroke-width="1" opacity=".22"/>')
    for (x, y) in sorted(GEN[3]):
        px = cx + ((TX + (x + .5) * CEL) - cx) * aum
        py = cy + ((TY + (y + .5) * CEL) - cy) * aum
        if abs(px - cx) > r + 20 or abs(py - cy) > r + 20:
            continue
        g.append(_ficha(px, py, CEL * .38 * aum, alto=5))
    g.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#{P}_vidrio)" '
             f'opacity=".4"/>')
    g.append(f'<ellipse cx="{cx - 13}" cy="{cy - 16}" rx="20" ry="12" fill="#ffffff" '
             f'opacity=".45" filter="url(#b5)" transform="rotate(-28 {cx - 13} {cy - 16})"/>')
    g.append('</g>')
    g.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="url(#{P}_metal)" '
             f'stroke-width="7"/>')
    g.append(f'<circle cx="{cx}" cy="{cy}" r="{r + 3.5}" fill="none" '
             f'stroke="{k["noche"]}" stroke-width="1" opacity=".35"/>')
    g.append(M.brillo_borde(f'M{cx - 31} {cy - 28} A{r} {r} 0 0 1 {cx + 5} {cy - r - 1}',
                            w=2.2, op=.6))
    # el mango
    g.append(f'<path d="M{cx + 30} {cy + 30} l52 52" stroke="#7b4a2c" '
             f'stroke-width="13" stroke-linecap="round"/>')
    g.append(f'<path d="M{cx + 32} {cy + 28} l50 50" stroke="#b9714f" '
             f'stroke-width="3.4" opacity=".7" stroke-linecap="round"/>')
    return ''.join(g)


def escena():
    defs = (
        M.defs_taller(P, tabla=('#b99a72', '#96774b', '#705431', '#48331c'))
        + M.defs_papel(P)
        + M.defs_metal(P)
        + M.defs_vidrio(P)
        + lg(f'{P}_marco', 0, 0, .3, 1,
             [(0, '#5d6b78', None), (.4, '#44515c', None), (1, '#28323b', None)])
        + lg(f'{P}_tabla_juego', .1, 0, .9, 1,
             [(0, '#f3efe3', None), (.4, '#e6e0cf', None), (1, '#cdc5b0', None)])
        + lg(f'{P}_bote', 0, 0, 1, .2,
             [(0, '#eef6fb', .82), (.3, '#c9dce7', .7), (.58, '#a3bccd', .66),
              (.76, '#e7f2f8', .78), (1, '#84a0b2', .7)])
        + rg(f'{P}_focosuelo', .5, .5, .5, [(0, '#fff0cf', .46), (1, '#fff0cf', 0)])
        + f'<clipPath id="{P}_cp_lupa"><circle cx="232" cy="300" r="42"/></clipPath>'
    )

    c = M.pared(P, MESA + 6, vx=182, vy=6, vw=128, vh=96)
    c += M.banco(P, MESA, juntas=(330,), nudos=((520, 380, 8),))
    c += (f'<ellipse cx="200" cy="230" rx="240" ry="140" fill="url(#{P}_focosuelo)" '
          f'opacity=".46" filter="url(#b22)"/>')

    c += _generaciones()
    c += _tablero()
    c += _tarjeta_regla()
    c += _ficha_en_mano()
    c += _bote()
    c += _lupa()

    c += M.velo(P, MESA - 6, 46, op=.28)
    c += M.vineta(P, .85)
    return svg(c, defs)
