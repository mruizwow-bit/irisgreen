# -*- coding: utf-8 -*-
"""Escena rica de Juegos de mesa (R65 · tanda 7).

El prototipo en pleno ensayo: **la partida está a medias**.

Lo que se ve:

* el **tablero de prueba**, dibujado a mano sobre cartón: el recorrido de
  casillas serpenteando, con la salida y la meta marcadas, algunas casillas de
  color y **dos casillas tachadas** porque no funcionaban;
* las **fichas** en juego: cilindros de madera de cuatro colores, tres sobre el
  recorrido en casillas distintas —no alineadas ni en la salida— y una cuarta
  todavía fuera del tablero. Se ve que alguien está jugando;
* los **dados**: uno en reposo con sus puntos, otro apoyado de canto contra el
  borde del tablero;
* el **mazo de cartas**: unas cuantas boca abajo con su reverso tramado, dos
  boca arriba con su símbolo dibujado, y **una carta en blanco** con el lápiz
  encima: esa es la que se está escribiendo ahora;
* la **hoja de reglas** con tachones y una regla reescrita al margen, y debajo
  la **tabla de las partidas de prueba**, con palotes y una duración anotada;
* la caja de cartón sin rotular, con la tapa apoyada de canto;
* las tijeras y los recortes de las casillas que se retiraron.

Nada de personajes: las fichas son piezas, no muñecos. Lo que se enseña es que
un juego se prueba, se tacha y se vuelve a probar.
"""
import math

from taller_suite.escenas_ricas import C, W, H, svg, lg, rg
from taller_suite import rica_comun as M

k = C
P = 'jm'

MESA = 122

COLORES = ['#c8322c', '#2f6f87', '#4d8a4d', '#e0a020']

# El recorrido del tablero: una serpiente de casillas.
def _recorrido():
    """Las casillas del recorrido, en coordenadas del tablero."""
    pts = []
    filas = 4
    por_fila = 7
    for j in range(filas):
        for i in range(por_fila):
            ii = i if j % 2 == 0 else por_fila - 1 - i
            pts.append((30 + ii * 42, 34 + j * 44))
    return pts


CASILLAS = _recorrido()
BX, BY = 46, 190            # esquina del tablero


def _tablero():
    """El tablero de prueba, dibujado a mano sobre cartón."""
    w, h = 320, 206
    g = [M.sombra(BX, BY, w, h, op=.32, dx=10, dy=13, rx=3),
         f'<path d="M{BX} {BY + 8} L{BX + w - 6} {BY} L{BX + w} {BY + h - 8} '
         f'L{BX + 6} {BY + h} Z" fill="url(#{P}_carton)"/>',
         f'<path d="M{BX} {BY + 8} L{BX + w - 6} {BY} L{BX + w} {BY + h - 8} '
         f'L{BX + 6} {BY + h} Z" fill="none" stroke="#9a7040" stroke-width="1.2" '
         f'opacity=".7"/>',
         # el canto: el cartón tiene grosor
         f'<path d="M{BX + 6} {BY + h} L{BX + w} {BY + h - 8} v7 l-314 8 Z" '
         f'fill="#8a6134"/>']
    # la línea que une las casillas, trazada a mano
    d = 'M' + ' L'.join(f'{M.r1(BX + x)} {M.r1(BY + y)}' for x, y in CASILLAS)
    g.append(f'<path d="{d}" fill="none" stroke="{k["tinta"]}" stroke-width="2.4" '
             f'opacity=".5" stroke-linejoin="round"/>')
    # las casillas
    retiradas = (9, 22)
    coloreadas = {2: 0, 6: 1, 11: 2, 15: 3, 19: 0, 24: 1}
    for n, (x, y) in enumerate(CASILLAS):
        cx, cy = BX + x, BY + y
        col = COLORES[coloreadas[n]] if n in coloreadas else None
        g.append(f'<rect x="{M.r1(cx - 15)}" y="{M.r1(cy - 14)}" width="30" '
                 f'height="28" rx="4" fill="{col or "#f2e6d0"}" '
                 f'opacity="{.9 if col else .82}" '
                 f'transform="rotate({M.r1((M.n(n, 3.1) - .5) * 5)} {M.r1(cx)} {M.r1(cy)})"/>')
        g.append(f'<rect x="{M.r1(cx - 15)}" y="{M.r1(cy - 14)}" width="30" '
                 f'height="28" rx="4" fill="none" stroke="{k["tinta"]}" '
                 f'stroke-width="1.4" opacity=".72" '
                 f'transform="rotate({M.r1((M.n(n, 3.1) - .5) * 5)} {M.r1(cx)} {M.r1(cy)})"/>')
        if n in retiradas:
            g.append(M.trazo(f'M{M.r1(cx - 15)} {M.r1(cy - 13)} l30 26', '#c8322c',
                             w=2.4, op=.9, halo=False))
            g.append(M.trazo(f'M{M.r1(cx + 15)} {M.r1(cy - 13)} l-30 26', '#c8322c',
                             w=2.4, op=.9, halo=False))
        elif n % 5 == 3:
            # un símbolo a mano en algunas casillas
            g.append(f'<path d="M{M.r1(cx - 5)} {M.r1(cy + 3)} l5 -7 l5 7 Z" '
                     f'fill="none" stroke="{k["tinta"]}" stroke-width="1.4" '
                     f'opacity=".6"/>')
    # salida y meta
    g.append(f'<path d="M{M.r1(BX + CASILLAS[0][0] - 22)} {M.r1(BY + CASILLAS[0][1] + 22)} '
             f'l12 -10 m-12 10 l12 10" fill="none" stroke="{k["tinta"]}" '
             f'stroke-width="2" opacity=".7" stroke-linecap="round"/>')
    mx, my = BX + CASILLAS[-1][0], BY + CASILLAS[-1][1]
    for i in range(4):
        for j in range(3):
            if (i + j) % 2:
                continue
            g.append(f'<rect x="{M.r1(mx - 14 + i * 7)}" y="{M.r1(my - 13 + j * 9)}" '
                     f'width="7" height="9" fill="{k["tinta"]}" opacity=".55"/>')
    return ''.join(g)


def _ficha(cx, cy, col, *, alto=15):
    """Una ficha: cilindro de madera con su canto y su sombra de contacto."""
    return (f'<ellipse cx="{M.r1(cx + 3)}" cy="{M.r1(cy + 5)}" rx="11" ry="5" '
            f'fill="{k["noche"]}" opacity=".38" filter="url(#b2)"/>'
            f'<path d="M{M.r1(cx - 10)} {M.r1(cy)} v{-alto} h20 v{alto} Z" '
            f'fill="{col}"/>'
            f'<path d="M{M.r1(cx - 10)} {M.r1(cy)} v{-alto} h6 v{alto} Z" '
            f'fill="#ffffff" opacity=".22"/>'
            f'<path d="M{M.r1(cx + 4)} {M.r1(cy)} v{-alto} h6 v{alto} Z" '
            f'fill="{k["noche"]}" opacity=".2"/>'
            f'<ellipse cx="{M.r1(cx)}" cy="{M.r1(cy)}" rx="10" ry="4.4" '
            f'fill="{col}"/>'
            f'<ellipse cx="{M.r1(cx)}" cy="{M.r1(cy - alto)}" rx="10" ry="4.4" '
            f'fill="{col}"/>'
            f'<ellipse cx="{M.r1(cx)}" cy="{M.r1(cy - alto)}" rx="10" ry="4.4" '
            f'fill="#ffffff" opacity=".28"/>'
            f'<ellipse cx="{M.r1(cx - 3)}" cy="{M.r1(cy - alto - 1)}" rx="4" ry="1.8" '
            f'fill="#ffffff" opacity=".35"/>')


def _fichas_en_juego():
    """Tres fichas sobre el recorrido, en casillas distintas, y una fuera."""
    g = []
    for n, ci in ((0, 4), (1, 12), (2, 18)):
        x, y = CASILLAS[ci]
        g.append(_ficha(BX + x, BY + y + 6, COLORES[n]))
    g.append(_ficha(392, 376, COLORES[3]))
    return ''.join(g)


def _dado(cx, cy, cara, *, rot=0, canto=False):
    """Un dado con sus puntos. Si va de canto, se ve una segunda cara."""
    s = 22
    puntos = {1: [(0, 0)], 2: [(-1, -1), (1, 1)], 3: [(-1, -1), (0, 0), (1, 1)],
              4: [(-1, -1), (1, -1), (-1, 1), (1, 1)],
              5: [(-1, -1), (1, -1), (0, 0), (-1, 1), (1, 1)],
              6: [(-1, -1), (1, -1), (-1, 0), (1, 0), (-1, 1), (1, 1)]}
    g = [f'<g transform="rotate({rot} {M.r1(cx)} {M.r1(cy)})">',
         M.sombra(cx - s / 2, cy - s / 2, s, s, op=.34, dx=5, dy=8, rx=4, blur='b2'),
         f'<rect x="{M.r1(cx - s / 2)}" y="{M.r1(cy - s / 2)}" width="{s}" '
         f'height="{s}" rx="5" fill="url(#{P}_dado)"/>',
         f'<rect x="{M.r1(cx - s / 2)}" y="{M.r1(cy - s / 2)}" width="{s}" '
         f'height="6" rx="3" fill="#ffffff" opacity=".4"/>']
    for dx, dy in puntos[cara]:
        g.append(f'<circle cx="{M.r1(cx + dx * 6)}" cy="{M.r1(cy + dy * 6)}" r="2.6" '
                 f'fill="{k["tinta"]}"/>')
        g.append(f'<circle cx="{M.r1(cx + dx * 6 - .6)}" cy="{M.r1(cy + dy * 6 - .8)}" '
                 f'r="1.6" fill="{k["noche"]}" opacity=".5"/>')
    if canto:
        g.append(f'<path d="M{M.r1(cx + s / 2)} {M.r1(cy - s / 2)} l8 -4 v{s} l-8 4 Z" '
                 f'fill="#d8cdb4"/>')
        for dx, dy in puntos[3]:
            g.append(f'<circle cx="{M.r1(cx + s / 2 + 4 + dx * 1.4)}" '
                     f'cy="{M.r1(cy + dy * 6 - 2)}" r="1.8" fill="{k["tinta"]}" '
                     f'opacity=".8"/>')
    g.append('</g>')
    return ''.join(g)


def _mazo():
    """El mazo: cartas boca abajo, dos boca arriba y una en blanco."""
    g = []
    # el montón boca abajo
    for i in range(7):
        x = 400 + M.n(i, 3.1) * 5
        y = 206 - i * 3
        g.append(f'<g transform="rotate({M.r1((M.n(i, 5.7) - .5) * 5)} {M.r1(x + 34)} '
                 f'{M.r1(y + 24)})">')
        g.append(f'<rect x="{M.r1(x)}" y="{M.r1(y)}" width="68" height="48" rx="4" '
                 f'fill="url(#{P}_reverso)"/>')
        g.append(f'<rect x="{M.r1(x + 4)}" y="{M.r1(y + 4)}" width="60" height="40" '
                 f'rx="2" fill="none" stroke="#ffffff" stroke-width="1" '
                 f'opacity=".35"/>')
        g.append('</g>')
    # la trama del reverso de la de arriba
    g.append(f'<g clip-path="url(#{P}_cp_reverso)" opacity=".22">')
    for i in range(22):
        g.append(f'<path d="M{M.r1(392 + i * 7)} 182 l20 54" stroke="#ffffff" '
                 f'stroke-width=".9"/>')
        g.append(f'<path d="M{M.r1(392 + i * 7)} 236 l20 -54" stroke="#ffffff" '
                 f'stroke-width=".9"/>')
    g.append('</g>')
    # dos boca arriba, con su símbolo
    for i, (x, y, rot, simbolo) in enumerate(((494, 236, 12, 0), (528, 292, -8, 1))):
        g.append(f'<g transform="rotate({rot} {x + 34} {y + 24})">')
        g.append(M.sombra(x, y, 68, 48, op=.26, dx=4, dy=6, rx=4, blur='b2'))
        g.append(f'<rect x="{x}" y="{y}" width="68" height="48" rx="4" '
                 f'fill="url(#{P}_pliego)"/>')
        g.append(f'<rect x="{x}" y="{y}" width="68" height="48" rx="4" fill="none" '
                 f'stroke="#b5ac9b" stroke-width=".8" opacity=".8"/>')
        cxx, cyy = x + 18, y + 24
        if simbolo == 0:
            g.append(f'<path d="M{cxx} {cyy - 9} l9 9 l-9 9 l-9 -9 Z" '
                     f'fill="{COLORES[0]}" opacity=".85"/>')
        else:
            g.append(f'<circle cx="{cxx}" cy="{cyy}" r="9" fill="none" '
                     f'stroke="{COLORES[1]}" stroke-width="3" opacity=".85"/>')
        for j in range(3):
            g.append(f'<rect x="{x + 34}" y="{M.r1(y + 14 + j * 9)}" '
                     f'width="{M.r1(26 - j * 7)}" height="2.6" rx="1.3" '
                     f'fill="{k["tinta"]}" opacity=".5"/>')
        g.append('</g>')
    # la carta en blanco, con el lápiz encima
    g.append('<g transform="rotate(-14 302 366)">')
    g.append(M.sombra(268, 342, 68, 48, op=.26, dx=4, dy=6, rx=4, blur='b2'))
    g.append(f'<rect x="268" y="342" width="68" height="48" rx="4" '
             f'fill="url(#{P}_pliego)"/>')
    g.append(f'<rect x="268" y="342" width="68" height="48" rx="4" fill="none" '
             f'stroke="#b5ac9b" stroke-width=".8" opacity=".8"/>')
    g.append(f'<rect x="278" y="356" width="30" height="2.4" rx="1.2" '
             f'fill="{k["grafito"]}" opacity=".3"/>')
    g.append('</g>')
    return ''.join(g)


def _reglas():
    """La hoja de reglas con tachones y la tabla de partidas de prueba."""
    x, y, w, h = 370, 100, 214, 108
    g = []
    for i in range(6):
        ancho = 150 - M.n(i, 3.1) * 40
        g.append(f'<rect x="{x + 16}" y="{M.r1(y + 18 + i * 12)}" '
                 f'width="{M.r1(ancho)}" height="2.8" rx="1.4" fill="{k["tinta"]}" '
                 f'opacity=".55"/>')
    # dos renglones tachados y la corrección al margen
    for i in (2, 3):
        g.append(M.trazo(f'M{x + 14} {M.r1(y + 19 + i * 12)} '
                         f'l{M.r1(146 - M.n(i, 3.1) * 40)} 2', '#c8322c',
                         w=2.2, op=.85, halo=False))
    g.append(M.trazo(f'M{x + 22} {y + 74} q30 -8 58 -2 q26 6 52 -3', '#c8322c',
                     w=1.8, op=.8, halo=False))
    g.append(M.trazo(f'M{x + 22} {y + 82} q26 -6 48 0', '#c8322c', w=1.8, op=.8,
                     halo=False))
    return (M.sombra(x, y, w, h, op=.26, dx=6, dy=9, rx=2)
            + f'<g transform="rotate(4 {x + w / 2} {y + h / 2})">'
            + f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" '
              f'fill="url(#{P}_pliego)"/>'
            + f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="none" '
              f'stroke="#b5ac9b" stroke-width=".8" opacity=".8"/>'
            + ''.join(g) + '</g>')


def _partidas():
    """La tabla de las partidas de prueba, con palotes y una duración."""
    x, y, w, h = 32, 332, 172, 66
    g = []
    for j in range(3):
        yy = y + 20 + j * 16
        g.append(f'<rect x="{x + 12}" y="{M.r1(yy - 2)}" width="22" height="2.6" '
                 f'rx="1.3" fill="{k["grafito"]}" opacity=".55"/>')
        n = (4, 7, 2)[j]
        for i in range(n):
            gx = x + 46 + (i // 5) * 26 + (i % 5) * 4.6
            g.append(f'<path d="M{M.r1(gx)} {M.r1(yy - 7)} v12" '
                     f'stroke="{k["tinta"]}" stroke-width="1.5" opacity=".75"/>')
            if i % 5 == 4:
                g.append(f'<path d="M{M.r1(gx - 19)} {M.r1(yy + 5)} l24 -11" '
                         f'stroke="{k["tinta"]}" stroke-width="1.5" opacity=".75"/>')
        g.append(f'<rect x="{x + 132}" y="{M.r1(yy - 2)}" '
                 f'width="{M.r1(20 + j * 5)}" height="2.6" rx="1.3" '
                 f'fill="{k["grafito"]}" opacity=".5"/>')
    g.append(f'<path d="M{x + 10} {y + 12} H{x + w - 10}" stroke="{k["grafito"]}" '
             f'stroke-width="1" opacity=".5"/>')
    return (M.sombra(x, y, w, h, op=.24, dx=5, dy=8, rx=2)
            + f'<g transform="rotate(-5 {x + w / 2} {y + h / 2})">'
            + f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" '
              f'fill="url(#{P}_pliego)"/>'
            + f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="none" '
              f'stroke="#b5ac9b" stroke-width=".8" opacity=".8"/>'
            + ''.join(g) + '</g>')


def _caja():
    """La caja de cartón sin rotular, con la tapa apoyada de canto."""
    g = [M.contacto(452, 398, 148, op=.4, alto=6)]
    g.append('<g transform="rotate(-6 524 372)">')
    g.append(M.sombra(452, 344, 148, 50, op=.3, dx=8, dy=11, rx=3, sesgo=-.2))
    g.append(f'<path d="M452 358 L582 344 L600 366 L470 382 Z" '
             f'fill="url(#{P}_carton)"/>')
    g.append(f'<path d="M470 382 L600 366 v16 l-130 16 Z" fill="#9a7040"/>')
    g.append(f'<path d="M452 358 L470 382 v16 l-18 -24 Z" fill="#7d5a30"/>')
    g.append('</g>')
    # la tapa, de canto
    g.append(M.contacto(596, 392, 44, op=.3, alto=4))
    g.append(f'<path d="M598 300 L636 312 L632 388 L594 376 Z" '
             f'fill="url(#{P}_carton)"/>')
    g.append(f'<path d="M598 300 L636 312 L634 320 L596 308 Z" fill="#e2bd8c" '
             f'opacity=".8"/>')
    return ''.join(g)


def _tijeras_recortes():
    g = ['<g transform="rotate(30 224 388)">',
         M.sombra(158, 380, 140, 18, op=.24, dx=4, dy=7, rx=4, blur='b2'),
         f'<path d="M158 386 L226 382 L228 390 L160 394 Z" fill="url(#{P}_metal)"/>',
         M.brillo_borde('M159 387 L225 383', w=1.4, op=.9),
         f'<circle cx="234" cy="386" r="5" fill="url(#{P}_metal)"/>']
    for cy0 in (376, 396):
        g.append(f'<ellipse cx="260" cy="{cy0}" rx="19" ry="11" fill="none" '
                 f'stroke="#17202a" stroke-width="7.4"/>')
    g.append('</g>')
    # recortes de las casillas retiradas
    for i in range(4):
        x = 226 + M.n(i, 3.1) * 90
        y = 340 + M.n(i, 7.7) * 22
        g.append(f'<rect x="{M.r1(x)}" y="{M.r1(y)}" width="22" height="20" rx="3" '
                 f'fill="#f2e6d0" opacity=".9" '
                 f'transform="rotate({M.r1(M.n(i, 5.3) * 180)} {M.r1(x)} {M.r1(y)})"/>')
    return ''.join(g)


def _lapiz():
    return ('<g transform="rotate(-30 300 350)">'
            + M.sombra(240, 344, 128, 12, op=.24, dx=4, dy=6, rx=6, blur='b2')
            + f'<rect x="252" y="344" width="108" height="12" rx="6" fill="#4d8a4d"/>'
            + f'<rect x="252" y="345" width="108" height="3.4" rx="1.7" '
              f'fill="#8fd48a" opacity=".8"/>'
            + f'<path d="M240 347 l14 -3 v12 l-14 -3 Z" fill="{k["madL"]}"/>'
            + f'<path d="M234 350 l7 -1.6 v6 Z" fill="{k["tinta"]}"/>'
            + '</g>')


def escena():
    defs = (
        M.defs_taller(P, tabla=('#b1906a', '#8f7043', '#6a4e2e', '#43301a'))
        + M.defs_papel(P)
        + M.defs_metal(P)
        + lg(f'{P}_carton', .1, 0, .9, 1,
             [(0, '#e2c091', None), (.3, '#c49a63', None), (1, '#946a36', None)])
        + lg(f'{P}_reverso', .1, 0, .9, 1,
             [(0, '#3a6a8c', None), (.4, '#2a5070', None), (1, '#17334a', None)])
        + rg(f'{P}_dado', .34, .3, .9,
             [(0, '#fffdf4', None), (.5, '#f2ecd8', None), (1, '#cfc5aa', None)])
        + rg(f'{P}_focosuelo', .5, .5, .5, [(0, '#fff0cf', .44), (1, '#fff0cf', 0)])
        + M.clip_rect(f'{P}_cp_reverso', 400, 188, 68, 48, 4)
    )

    c = M.pared(P, MESA + 6, vx=196, vy=6, vw=134, vh=92)
    c += M.banco(P, MESA, juntas=(360,), nudos=((250, 392, 8),))
    c += (f'<ellipse cx="220" cy="214" rx="250" ry="140" fill="url(#{P}_focosuelo)" '
          f'opacity=".44" filter="url(#b22)"/>')

    c += _reglas()
    c += _caja()
    c += _tablero()
    c += _fichas_en_juego()
    c += _mazo()
    c += _dado(330, 340, 5, rot=12)
    c += _dado(372, 314, 2, rot=-18, canto=True)
    c += _partidas()
    c += _tijeras_recortes()
    c += _lapiz()

    c += M.velo(P, MESA - 6, 44, op=.26)
    c += M.vineta(P, .85)
    return svg(c, defs)
