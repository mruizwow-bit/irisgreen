# -*- coding: utf-8 -*-
"""Escena rica de Lenguas inventadas (R65 · tanda 7).

La mesa donde se construye una lengua: sonidos, alfabeto, gramática y
diccionario, cada uno en su papel y a medio hacer.

Los signos del alfabeto **se generan**: cada uno sale de una rejilla de tres por
tres uniendo puntos según una semilla, así que el conjunto tiene coherencia
—mismo trazo, mismos ángulos, mismo aire— sin parecerse a ninguna escritura
real. Es exactamente lo que se le pide a quien inventa una: que sus letras
parezcan de la misma familia.

Lo que se ve:

* la **tabla de sonidos**: una rejilla con los puntos de articulación en
  columnas y los modos en filas, con las casillas ocupadas marcadas y **dos
  huecos** todavía por decidir;
* el **cuadro de vocales**, el trapecio clásico, con cuatro vocales puestas y
  una tachada porque se ha quitado;
* la **hoja del alfabeto**: dieciséis signos en cuadrícula, cada uno con su
  casilla y su trazo, y los tres últimos **solo esbozados a lápiz**;
* el **paradigma de la gramática**: una tabla de cinco por cuatro con algunas
  celdas rellenas, otras en blanco y una con un interrogante;
* el **fichero del diccionario** con sus fichas de pie y una fuera, escrita por
  las dos caras;
* la pluma estilográfica con el capuchón quitado, el tintero y una hoja de
  pruebas de trazo, con el mismo signo repetido hasta que sale.

Sin personajes y sin caras, y sin ningún signo de una escritura de verdad.
"""
import math

from taller_suite.escenas_ricas import C, W, H, svg, lg, rg
from taller_suite import rica_comun as M

k = C
P = 'lg'

MESA = 124

TINTA = '#1f3550'


def _signo(cx, cy, r, semilla, *, col=TINTA, w=2.4, op=.9, esbozo=False):
    """Un signo del alfabeto, generado sobre una rejilla de 3x3.

    Se eligen tres o cuatro nodos de la rejilla en un orden que depende de la
    semilla, se unen con trazos rectos, y a veces se cierra con un arco o se le
    añade un punto diacrítico. Todos los signos comparten la rejilla y el grosor,
    así que se leen como una familia.
    """
    nodos = [(cx + (i % 3 - 1) * r, cy + (i // 3 - 1) * r) for i in range(9)]
    n = 3 + int(M.n(semilla, 3.1) * 2)
    idx = []
    j = int(M.n(semilla, 5.7) * 9)
    for i in range(n + 1):
        j = (j + 1 + int(M.n(semilla + i, 7.3) * 7)) % 9
        if j not in idx:
            idx.append(j)
    if len(idx) < 3:
        idx = [0, 4, 8]
    d = 'M' + ' L'.join(f'{M.r1(nodos[i][0])} {M.r1(nodos[i][1])}' for i in idx)
    g = [f'<path d="{d}" fill="none" stroke="{col}" '
         f'stroke-width="{w if not esbozo else w * .55}" '
         f'opacity="{op if not esbozo else op * .38}" stroke-linecap="round" '
         f'stroke-linejoin="round"'
         + (' stroke-dasharray="4 3"' if esbozo else '') + '/>']
    # un arco de cierre, en la mitad de los signos
    if M.n(semilla, 11.3) > .5:
        a, b = nodos[idx[0]], nodos[idx[-1]]
        g.append(f'<path d="M{M.r1(a[0])} {M.r1(a[1])} A{M.r1(r * 1.3)} '
                 f'{M.r1(r * 1.3)} 0 0 {1 if M.n(semilla, 13.1) > .5 else 0} '
                 f'{M.r1(b[0])} {M.r1(b[1])}" fill="none" stroke="{col}" '
                 f'stroke-width="{w if not esbozo else w * .55}" '
                 f'opacity="{op * (1 if not esbozo else .38)}" '
                 f'stroke-linecap="round"'
                 + (' stroke-dasharray="4 3"' if esbozo else '') + '/>')
    # un punto diacrítico, en un tercio
    if M.n(semilla, 17.7) > .66:
        g.append(f'<circle cx="{M.r1(cx + r * .75)}" cy="{M.r1(cy - r * 1.05)}" '
                 f'r="{M.r2(w * .8)}" fill="{col}" '
                 f'opacity="{op * (1 if not esbozo else .38)}"/>')
    return ''.join(g)


def _hoja(x, y, w, h, rot, extra=''):
    return (M.sombra(x, y, w, h, op=.26, dx=6, dy=9, rx=2)
            + f'<g transform="rotate({rot} {M.r1(x + w / 2)} {M.r1(y + h / 2)})">'
            + f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" '
              f'fill="url(#{P}_pliego)"/>'
            + f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="none" '
              f'stroke="#b5ac9b" stroke-width=".8" opacity=".8"/>'
            + extra + '</g>')


def _tabla_sonidos():
    """La rejilla de sonidos: puntos de articulación por modos."""
    x, y, w, h = 30, 148, 214, 128
    g = []
    cols, filas = 6, 5
    cw, ch = 28, 17
    ox, oy = x + 24, y + 30
    for i in range(cols + 1):
        g.append(f'<path d="M{M.r1(ox + i * cw)} {M.r1(oy)} '
                 f'V{M.r1(oy + filas * ch)}" stroke="{k["grafito"]}" '
                 f'stroke-width="{.9 if i in (0, cols) else .6}" opacity=".5"/>')
    for j in range(filas + 1):
        g.append(f'<path d="M{M.r1(ox)} {M.r1(oy + j * ch)} '
                 f'H{M.r1(ox + cols * cw)}" stroke="{k["grafito"]}" '
                 f'stroke-width="{.9 if j in (0, filas) else .6}" opacity=".5"/>')
    # las casillas ocupadas: cada una con su signo
    ocupadas = [(0, 0), (1, 0), (3, 0), (5, 0), (0, 1), (2, 1), (4, 1),
                (1, 2), (3, 2), (5, 2), (0, 3), (2, 3), (1, 4), (4, 4)]
    huecos = [(4, 2), (3, 4)]
    for n, (i, j) in enumerate(ocupadas):
        g.append(_signo(ox + (i + .5) * cw, oy + (j + .5) * ch, 4.6, n * 3 + 1,
                        w=1.8, op=.85))
    for i, j in huecos:
        g.append(f'<rect x="{M.r1(ox + i * cw + 3)}" y="{M.r1(oy + j * ch + 2.5)}" '
                 f'width="{M.r1(cw - 6)}" height="{M.r1(ch - 5)}" rx="2" fill="none" '
                 f'stroke="#c8322c" stroke-width="1.4" opacity=".7" '
                 f'stroke-dasharray="4 3"/>')
    # las cabeceras, como bloques
    for i in range(cols):
        g.append(f'<rect x="{M.r1(ox + i * cw + 5)}" y="{M.r1(oy - 11)}" '
                 f'width="{M.r1(cw - 10)}" height="2.6" rx="1.3" '
                 f'fill="{k["grafito"]}" opacity=".55"/>')
    for j in range(filas):
        g.append(f'<rect x="{M.r1(x + 6)}" y="{M.r1(oy + j * ch + ch / 2 - 1.3)}" '
                 f'width="15" height="2.6" rx="1.3" fill="{k["grafito"]}" '
                 f'opacity=".55"/>')
    return _hoja(x, y, w, h, -3, ''.join(g))


def _cuadro_vocales():
    """El trapecio de las vocales, con una tachada."""
    x, y, w, h = 256, 160, 134, 116
    g = []
    p = [(x + 26, y + 26), (x + 112, y + 26), (x + 92, y + 94), (x + 44, y + 94)]
    g.append('<path d="M%s %s L%s %s L%s %s L%s %s Z" fill="none" stroke="%s" '
             'stroke-width="1.2" opacity=".7"/>'
             % (*p[0], *p[1], *p[2], *p[3], k['grafito']))
    # las dos líneas intermedias del trapecio
    for t in (1 / 3, 2 / 3):
        ax = p[0][0] + (p[3][0] - p[0][0]) * t
        ay = p[0][1] + (p[3][1] - p[0][1]) * t
        bx = p[1][0] + (p[2][0] - p[1][0]) * t
        by = p[1][1] + (p[2][1] - p[1][1]) * t
        g.append(f'<path d="M{M.r1(ax)} {M.r1(ay)} L{M.r1(bx)} {M.r1(by)}" '
                 f'stroke="{k["grafito"]}" stroke-width=".8" opacity=".45" '
                 f'stroke-dasharray="5 4"/>')
    # cuatro vocales puestas y una tachada
    sitios = [(0, 0, False), (1, 0, False), (0, 1, False), (.55, .62, False),
              (1, .34, True)]
    for n, (u, v, tachada) in enumerate(sitios):
        ax = p[0][0] + (p[3][0] - p[0][0]) * v
        ay = p[0][1] + (p[3][1] - p[0][1]) * v
        bx = p[1][0] + (p[2][0] - p[1][0]) * v
        by = p[1][1] + (p[2][1] - p[1][1]) * v
        cx = ax + (bx - ax) * u
        cy = ay + (by - ay) * u
        g.append(f'<circle cx="{M.r1(cx)}" cy="{M.r1(cy)}" r="8" fill="url(#{P}_pliego)" '
                 f'stroke="{k["grafito"]}" stroke-width=".9" opacity=".9"/>')
        g.append(_signo(cx, cy, 3.8, n * 5 + 2, w=1.6, op=.9))
        if tachada:
            g.append(M.trazo(f'M{M.r1(cx - 11)} {M.r1(cy - 9)} l22 18', '#c8322c',
                             w=2, op=.85, halo=False))
            g.append(M.trazo(f'M{M.r1(cx + 11)} {M.r1(cy - 9)} l-22 18', '#c8322c',
                             w=2, op=.85, halo=False))
    return _hoja(x, y, w, h, 5, ''.join(g))


def _hoja_alfabeto():
    """El alfabeto: dieciséis signos, los tres últimos solo esbozados."""
    x, y, w, h = 44, 268, 234, 128
    g = []
    cw, ch = 50, 27
    ox, oy = x + 20, y + 22
    for n in range(16):
        i, j = n % 4, n // 4
        cx = ox + i * cw + cw / 2 - 10
        cy = oy + j * ch + ch / 2
        g.append(f'<rect x="{M.r1(ox + i * cw)}" y="{M.r1(oy + j * ch)}" '
                 f'width="{M.r1(cw - 4)}" height="{M.r1(ch - 3)}" rx="2" fill="none" '
                 f'stroke="{k["grafito"]}" stroke-width=".7" opacity=".38"/>')
        g.append(_signo(cx, cy, 7, n * 4 + 3, w=2.4, op=.9, esbozo=(n >= 13)))
        # el valor sonoro al lado, como bloque
        g.append(f'<rect x="{M.r1(cx + 13)}" y="{M.r1(cy - 1.4)}" '
                 f'width="{M.r1(8 + (n % 3) * 4)}" height="2.6" rx="1.3" '
                 f'fill="{k["grafito"]}" opacity="{.5 if n < 13 else .22}"/>')
    return _hoja(x, y, w, h, 2, ''.join(g))


def _paradigma():
    """La tabla de la gramática: celdas rellenas, vacías y una con interrogante."""
    x, y, w, h = 372, 250, 176, 130
    g = []
    cols, filas = 4, 5
    cw, ch = 34, 18
    ox, oy = x + 26, y + 26
    for i in range(cols + 1):
        g.append(f'<path d="M{M.r1(ox + i * cw)} {M.r1(oy)} '
                 f'V{M.r1(oy + filas * ch)}" stroke="{k["grafito"]}" '
                 f'stroke-width="{.9 if i in (0, cols) else .6}" opacity=".5"/>')
    for j in range(filas + 1):
        g.append(f'<path d="M{M.r1(ox)} {M.r1(oy + j * ch)} '
                 f'H{M.r1(ox + cols * cw)}" stroke="{k["grafito"]}" '
                 f'stroke-width="{.9 if j in (0, filas) else .6}" opacity=".5"/>')
    rellenas = [(0, 0), (1, 0), (2, 0), (0, 1), (1, 1), (3, 1), (0, 2), (2, 2),
                (1, 3), (0, 4), (2, 4)]
    for n, (i, j) in enumerate(rellenas):
        cx = ox + i * cw + 6
        cy = oy + j * ch + ch / 2
        g.append(_signo(cx + 6, cy, 4.4, n * 7 + 5, w=1.7, op=.85))
        g.append(f'<rect x="{M.r1(cx + 14)}" y="{M.r1(cy - 1.3)}" '
                 f'width="{M.r1(10 + (n % 3) * 3)}" height="2.4" rx="1.2" '
                 f'fill="{k["grafito"]}" opacity=".5"/>')
    # la celda con interrogante
    qx, qy = ox + 3 * cw + cw / 2, oy + 3 * ch + ch / 2
    g.append(f'<path d="M{M.r1(qx - 3.6)} {M.r1(qy - 5)} q0 -5 4 -5 q5 0 5 4.4 '
             f'q0 3.6 -4.4 4.6 v2" fill="none" stroke="#c8322c" stroke-width="1.8" '
             f'opacity=".85" stroke-linecap="round"/>')
    g.append(f'<circle cx="{M.r1(qx + .4)}" cy="{M.r1(qy + 6)}" r="1.4" '
             f'fill="#c8322c" opacity=".85"/>')
    # cabeceras
    for i in range(cols):
        g.append(f'<rect x="{M.r1(ox + i * cw + 6)}" y="{M.r1(oy - 11)}" '
                 f'width="{M.r1(cw - 12)}" height="2.6" rx="1.3" '
                 f'fill="{k["grafito"]}" opacity=".55"/>')
    for j in range(filas):
        g.append(f'<rect x="{M.r1(x + 6)}" y="{M.r1(oy + j * ch + ch / 2 - 1.3)}" '
                 f'width="16" height="2.6" rx="1.3" fill="{k["grafito"]}" '
                 f'opacity=".55"/>')
    return _hoja(x, y, w, h, -4, ''.join(g))


def _fichero():
    """El fichero del diccionario, con una ficha fuera."""
    x, y = 448, 142
    g = [M.contacto(x + 4, y + 88, 150, op=.4, alto=7),
         M.sombra(x, y, 150, 84, op=.3, dx=9, dy=12, rx=4, sesgo=-.2)]
    for i in range(10):
        fx = x + 14 + i * 12.6
        alto = 48 + M.n(i, 3.1) * 14
        g.append(f'<path d="M{M.r1(fx)} {M.r1(y + 76 - alto)} l11 -2 l0 {M.r1(alto)} '
                 f'l-11 2 Z" fill="url(#{P}_ficha)"/>')
        g.append(f'<path d="M{M.r1(fx)} {M.r1(y + 76 - alto)} l11 -2" '
                 f'stroke="#ffffff" stroke-width="1.4" opacity=".6"/>')
        if i % 2 == 0:
            g.append(_signo(fx + 5.5, y + 76 - alto + 10, 3.4, i * 9 + 7,
                            w=1.3, op=.6))
    g.append(f'<path d="M{x} {y + 34} L{x + 150} {y + 26} L{x + 150} {y + 84} '
             f'L{x} {y + 92} Z" fill="url(#{P}_caja)"/>')
    g.append(f'<path d="M{x} {y + 34} L{x + 150} {y + 26} L{x + 150} {y + 34} '
             f'L{x} {y + 42} Z" fill="#ffffff" opacity=".18"/>')
    # la ficha que está fuera, escrita
    g.append('<g transform="rotate(10 596 232)">')
    g.append(M.sombra(552, 214, 88, 34, op=.26, dx=4, dy=6, rx=2, blur='b2'))
    g.append(f'<rect x="552" y="214" width="88" height="34" rx="2" '
             f'fill="url(#{P}_ficha)"/>')
    g.append(_signo(566, 228, 6, 41, w=2.2, op=.9))
    for j in range(2):
        g.append(f'<rect x="580" y="{M.r1(224 + j * 8)}" width="{M.r1(50 - j * 16)}" '
                 f'height="2.6" rx="1.3" fill="{k["grafito"]}" opacity=".55"/>')
    g.append('</g>')
    return ''.join(g)


def _hoja_pruebas():
    """La hoja de pruebas: el mismo signo repetido hasta que sale."""
    return _hoja(268, 336, 150, 62, 7, ''.join(
        _signo(288 + i * 26, 366 + (i % 2) * 2, 8, 23,
               w=2.2, op=.4 + i * .15, esbozo=(i == 0)) for i in range(5)))


def _pluma_y_tintero(con_pruebas=True):
    """La estilográfica destapada y el tintero.

    `con_pruebas` deja fuera la hoja de pruebas, que la variante AGE_0_12 dibuja
    por su cuenta y más grande. Con el valor por defecto la escena base no cambia.
    """
    g = []
    if con_pruebas:
        g.append(_hoja_pruebas())
    # el tintero
    cx, cy = 574, 336
    g.append(M.contacto(cx - 30, cy + 34, 60, op=.42, alto=6))
    g.append(M.sombra(cx - 28, cy - 18, 56, 52, op=.3, dx=8, dy=11, rx=6, sesgo=-.2))
    g.append(f'<path d="M{cx - 28} {cy + 32} L{cx - 23} {cy - 12} L{cx + 23} {cy - 12} '
             f'L{cx + 28} {cy + 32} Z" fill="url(#{P}_vidriocuerpo)"/>')
    g.append(f'<path d="M{cx - 26} {cy + 32} L{cx - 22} {cy + 4} L{cx + 22} {cy + 4} '
             f'L{cx + 26} {cy + 32} Z" fill="{TINTA}"/>')
    g.append(f'<ellipse cx="{cx}" cy="{cy + 4}" rx="22" ry="5" fill="#2f4a6b"/>')
    g.append(f'<ellipse cx="{cx - 8}" cy="{cy + 3}" rx="8" ry="2.2" fill="#8fa8c4" '
             f'opacity=".5" filter="url(#b2)"/>')
    g.append(f'<ellipse cx="{cx}" cy="{cy - 12}" rx="23" ry="6" fill="none" '
             f'stroke="#cfe0ea" stroke-width="2" opacity=".85"/>')
    g.append(M.brillo_borde(f'M{cx - 22} {cy + 26} L{cx - 19} {cy - 8}',
                            color='#ffffff', w=2.6, op=.45))
    # la pluma, destapada
    g.append('<g transform="rotate(-24 458 384)">')
    g.append(M.sombra(392, 378, 150, 14, op=.26, dx=4, dy=7, rx=7, blur='b2'))
    g.append(f'<rect x="418" y="376" width="108" height="16" rx="8" fill="#22303f"/>')
    g.append(f'<rect x="418" y="378" width="108" height="4" rx="2" fill="#5b7186" '
             f'opacity=".7"/>')
    g.append(f'<rect x="504" y="375" width="22" height="18" rx="4" '
             f'fill="url(#{P}_metal)"/>')
    g.append(f'<path d="M392 380 L420 378 L420 390 L392 388 Z" '
             f'fill="url(#{P}_metal)"/>')
    g.append(f'<path d="M392 384 h20" stroke="{k["noche"]}" stroke-width="1.2" '
             f'opacity=".6"/>')
    g.append(f'<circle cx="410" cy="384" r="2.4" fill="{k["noche"]}" opacity=".5"/>')
    g.append('</g>')
    # el capuchón, al lado
    g.append(M.contacto(556, 398, 46, op=.3, alto=4))
    g.append(f'<rect x="536" y="382" width="52" height="15" rx="7.5" fill="#22303f" '
             f'transform="rotate(6 562 390)"/>')
    g.append(f'<rect x="572" y="383" width="12" height="13" rx="4" '
             f'fill="url(#{P}_metal)" transform="rotate(6 562 390)"/>')
    return ''.join(g)


def _defs():
    """Los gradientes, filtros y recortes de esta escena.

    Vive aparte para que la variante AGE_0_12 pueda reutilizar
    exactamente los mismos, sin duplicarlos y sin que puedan divergir.
    """
    return (
        M.defs_taller(P, tabla=('#b1906a', '#8f7043', '#6a4e2e', '#43301a'))
        + M.defs_papel(P)
        + M.defs_metal(P)
        + lg(f'{P}_ficha', .1, 0, .9, 1,
             [(0, '#fdfaf0', None), (.5, '#f3ecda', None), (1, '#ddd4bd', None)])
        + lg(f'{P}_caja', 0, 0, .3, 1,
             [(0, '#4f6a7e', None), (.4, '#3a5064', None), (1, '#22323f', None)])
        + lg(f'{P}_vidriocuerpo', 0, 0, 1, .2,
             [(0, '#eef6fb', .85), (.3, '#cadde8', .72), (.56, '#a3bccd', .66),
              (.74, '#e7f2f8', .8), (1, '#84a0b2', .72)])
        + rg(f'{P}_focosuelo', .5, .5, .5, [(0, '#fff0cf', .44), (1, '#fff0cf', 0)])
    )


def escena():
    defs = _defs()

    c = M.pared(P, MESA + 6, vx=190, vy=6, vw=134, vh=92)
    c += M.banco(P, MESA, juntas=(420,), nudos=((356, 396, 8),))
    c += (f'<ellipse cx="220" cy="214" rx="250" ry="140" fill="url(#{P}_focosuelo)" '
          f'opacity=".44" filter="url(#b22)"/>')

    c += _fichero()
    c += _tabla_sonidos()
    c += _cuadro_vocales()
    c += _paradigma()
    c += _hoja_alfabeto()
    c += _pluma_y_tintero()

    c += M.velo(P, MESA - 6, 44, op=.26)
    c += M.vineta(P, .85)
    return svg(c, defs)
