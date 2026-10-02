# -*- coding: utf-8 -*-
"""Escena rica de Ideas e inventos (R65 · tanda 3).

El laboratorio de ideas: pensar en sucio y probarlo en cartón.

Lo que se ve:

* el **cuaderno abierto** por la mitad, con la costura del cosido y la sombra
  del canal entre las dos páginas;
* dentro, un **mapa de ideas de verdad**: nodos de distinto tamaño según lo que
  han crecido, ramas que se cruzan, **dos tachadas** —las ideas que no salieron—,
  una rodeada dos veces porque es la que se está probando, y una rama a lápiz muy
  flojo que aún no se sabe si va a ninguna parte;
* al margen, la lista de preguntas con una marcada;
* el **tablero de notas** con las notas adhesivas en cuadrícula, cada una con su
  color, su curva de despegado y su sombra propia; una está **fuera de su sitio,
  a medio mover**, con el hueco vacío que ha dejado;
* delante, **el prototipo en cartón**: una palanca sobre su pivote, sujeta con
  cinta, con una goma tensada y un contrapeso de arandelas. Está a medio hacer:
  un lado ya pegado, el otro solo apoyado y con la cinta todavía sin cortar. En
  el cartón se ven las capas del corrugado por el canto;
* el rollo de cinta con el extremo levantado, las tijeras, y los recortes de
  cartón que han ido saliendo;
* el lápiz y la goma, con el borrado marcado en una de las ramas.

Nada de bombillas: una idea no es un icono. Lo que se enseña es el desorden
ordenado de quien está probando algo.
"""
import math

from taller_suite.escenas_ricas import C, W, H, svg, lg, rg
from taller_suite import rica_comun as M

k = C
P = 'id'

MESA = 132

CARTON = '#c89a5e'
CARTON_S = '#9a6f3c'
NOTAS = ['#f2d24e', '#8fd48a', '#8bc4ec', '#f2a0a8', '#d8c2f0']


def _cuaderno():
    """El cuaderno abierto, con el mapa de ideas dentro."""
    x, y, w, h = 36, 150, 300, 214
    g = [M.sombra(x, y, w, h, op=.34, dx=11, dy=14, rx=4),
         # las tapas
         f'<path d="M{x - 6} {y + 6} L{x + w + 6} {y - 2} L{x + w + 10} {y + h + 2} '
         f'L{x - 10} {y + h + 8} Z" fill="#3c4a5a"/>',
         # las dos páginas
         f'<path d="M{x} {y + 10} L{x + w / 2 - 2} {y + 4} L{x + w / 2 - 2} {y + h - 4} '
         f'L{x + 2} {y + h + 2} Z" fill="url(#{P}_pliego)"/>',
         f'<path d="M{x + w / 2 + 2} {y + 4} L{x + w} {y} L{x + w + 4} {y + h - 6} '
         f'L{x + w / 2 + 2} {y + h - 4} Z" fill="url(#{P}_pliego)"/>',
         # el canal entre páginas, con su sombra
         f'<path d="M{x + w / 2} {y + 4} V{y + h - 4}" stroke="{k["noche"]}" '
         f'stroke-width="14" opacity=".2" filter="url(#b5)"/>']
    # la costura del cosido
    for i in range(9):
        yy = y + 18 + i * 22
        g.append(f'<path d="M{x + w / 2 - 5} {M.r1(yy)} h10" stroke="#6b7a8c" '
                 f'stroke-width="1.6" opacity=".6"/>')
    # el pautado, muy tenue
    for i in range(14):
        yy = y + 22 + i * 14
        g.append(f'<path d="M{x + 12} {M.r1(yy + 4)} L{x + w - 10} {M.r1(yy - 4)}" '
                 f'stroke="#9fb6c8" stroke-width=".6" opacity=".35"/>')
    g.append(f'<g clip-path="url(#{P}_cp_cuaderno)">')
    g.append(_mapa(x, y, w, h))
    g.append('</g>')
    return ''.join(g)


#: nodos del mapa: (x relativo, y relativo, radio, estado)
NODOS = [
    (.24, .30, 20, 'centro'), (.10, .13, 11, 'ok'), (.40, .12, 13, 'ok'),
    (.09, .52, 12, 'tachado'), (.40, .50, 15, 'elegido'), (.24, .72, 10, 'ok'),
    (.62, .20, 12, 'ok'), (.86, .14, 9, 'tachado'), (.62, .46, 14, 'ok'),
    (.88, .44, 10, 'flojo'), (.66, .74, 11, 'ok'), (.90, .70, 8, 'flojo'),
]
RAMAS = [(0, 1), (0, 2), (0, 3), (0, 4), (0, 5), (2, 6), (6, 7), (4, 8),
         (8, 9), (8, 10), (10, 11), (4, 5)]


def _mapa(x, y, w, h):
    """El mapa de ideas: nodos, ramas, dos tachadas y una rodeada dos veces."""
    g = []
    pts = [(x + 14 + u * (w - 34), y + 16 + v * (h - 40)) for u, v, _, _ in NODOS]

    def estado(i):
        return NODOS[i][3]

    for a, b in RAMAS:
        ax, ay = pts[a]
        bx, by = pts[b]
        mx, my = (ax + bx) / 2 + (M.n(a * 7 + b, 3.1) - .5) * 26, (ay + by) / 2 - 10
        flojo = 'flojo' in (estado(a), estado(b))
        # una rama que aún no se sabe si va a alguna parte va a trazo flojo
        guiones = ' stroke-dasharray="5 4"' if flojo else ''
        g.append(f'<path d="M{M.r1(ax)} {M.r1(ay)} Q{M.r1(mx)} {M.r1(my)} '
                 f'{M.r1(bx)} {M.r1(by)}" fill="none" stroke="{k["grafito"]}" '
                 f'stroke-width="{1 if flojo else 1.7}" '
                 f'opacity="{.28 if flojo else .68}"{guiones}/>')
    for i, (u, v, r, est) in enumerate(NODOS):
        cx, cy = pts[i]
        col = k['tinta'] if est != 'flojo' else k['grafito']
        op = .3 if est == 'flojo' else .8
        # el nodo: un óvalo a mano, no un círculo perfecto
        g.append(f'<ellipse cx="{M.r1(cx)}" cy="{M.r1(cy)}" rx="{M.r1(r)}" '
                 f'ry="{M.r1(r * .72)}" fill="none" stroke="{col}" '
                 f'stroke-width="{1.4 if est != "centro" else 2.2}" opacity="{op}" '
                 f'transform="rotate({M.r1((M.n(i, 5.7) - .5) * 16)} {M.r1(cx)} {M.r1(cy)})"/>')
        # renglones dentro, sin texto legible
        for j in range(2 if r > 11 else 1):
            g.append(f'<rect x="{M.r1(cx - r * .6)}" y="{M.r1(cy - 3 + j * 5)}" '
                     f'width="{M.r1(r * (1.2 - j * .35))}" height="2.2" rx="1.1" '
                     f'fill="{col}" opacity="{M.r2(op * .7)}"/>')
        if est == 'tachado':
            g.append(M.trazo(f'M{M.r1(cx - r - 3)} {M.r1(cy - r * .8)} '
                             f'L{M.r1(cx + r + 3)} {M.r1(cy + r * .8)}', '#c8322c',
                             w=2, op=.8, halo=False))
            g.append(M.trazo(f'M{M.r1(cx + r + 3)} {M.r1(cy - r * .8)} '
                             f'L{M.r1(cx - r - 3)} {M.r1(cy + r * .8)}', '#c8322c',
                             w=2, op=.8, halo=False))
        if est == 'elegido':
            for j in range(2):
                g.append(f'<ellipse cx="{M.r1(cx)}" cy="{M.r1(cy)}" '
                         f'rx="{M.r1(r + 5 + j * 4)}" ry="{M.r1(r * .72 + 5 + j * 4)}" '
                         f'fill="none" stroke="#c8322c" stroke-width="1.8" '
                         f'opacity="{M.r2(.85 - j * .3)}" '
                         f'stroke-dasharray="{28 + j * 9} {4 + j * 3}"/>')
    # la lista de preguntas al margen, con una marcada
    for i in range(5):
        yy = y + h - 58 + i * 11
        g.append(f'<rect x="{M.r1(x + w - 92)}" y="{M.r1(yy)}" '
                 f'width="{M.r1(56 - i * 5)}" height="2.4" rx="1.2" '
                 f'fill="{k["grafito"]}" opacity=".5"/>')
        g.append(f'<rect x="{M.r1(x + w - 102)}" y="{M.r1(yy - 3)}" width="7" '
                 f'height="7" rx="1.4" fill="none" stroke="{k["grafito"]}" '
                 f'stroke-width="1" opacity=".55"/>')
        if i == 2:
            g.append(M.trazo(f'M{M.r1(x + w - 101)} {M.r1(yy + 1)} l3 3 l6 -8',
                             '#2f8f4e', w=2, op=.9, halo=False))
    # el borrado: una rama que se quitó y dejó marca
    g.append(f'<ellipse cx="{M.r1(x + 74)}" cy="{M.r1(y + 152)}" rx="26" ry="12" '
             f'fill="#e8e0cf" opacity=".55" filter="url(#b2)"/>')
    g.append(f'<path d="M{M.r1(x + 54)} {M.r1(y + 156)} q22 -10 42 -2" fill="none" '
             f'stroke="{k["grafito"]}" stroke-width="1.2" opacity=".16"/>')
    return ''.join(g)


def _tablero():
    """El tablero de notas: una está fuera de su sitio y ha dejado el hueco."""
    x, y, w, h = 356, 24, 258, 168
    g = [M.sombra(x, y, w, h, op=.3, dx=8, dy=11, rx=3),
         f'<rect x="{x - 7}" y="{y - 7}" width="{w + 14}" height="{h + 14}" rx="5" '
         f'fill="#7b5a34"/>',
         f'<rect x="{x - 7}" y="{y - 7}" width="{w + 14}" height="5" rx="2.5" '
         f'fill="#b28a55" opacity=".8"/>',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" '
         f'fill="url(#{P}_corcho)"/>']
    # el grano del corcho
    for i in range(70):
        g.append(f'<ellipse cx="{M.r1(x + M.n(i, 3.1) * w)}" '
                 f'cy="{M.r1(y + M.n(i, 7.7) * h)}" '
                 f'rx="{M.r2(1 + M.n(i, 5.3) * 4)}" ry="{M.r2(.8 + M.n(i, 9.1) * 2.6)}" '
                 f'fill="{"#8a5f30" if i % 2 else "#d8ab6c"}" '
                 f'opacity="{M.r2(.1 + M.n(i, 11.3) * .16)}"/>')

    def nota(nx, ny, col, rot, i, *, despegada=False):
        out = [f'<g transform="rotate({rot} {M.r1(nx + 28)} {M.r1(ny + 28)})">']
        out.append(M.sombra(nx, ny, 56, 56, op=.3 if not despegada else .4,
                            dx=4 if not despegada else 9,
                            dy=6 if not despegada else 12, rx=1, blur='b2'))
        # la nota, con la esquina inferior despegada
        out.append(f'<path d="M{M.r1(nx)} {M.r1(ny)} h56 v44 q-12 12 -28 12 '
                   f'q-16 0 -28 -10 Z" fill="{col}"/>')
        out.append(f'<path d="M{M.r1(nx)} {M.r1(ny)} h56 v10 h-56 Z" fill="#ffffff" '
                   f'opacity=".22"/>')
        out.append(f'<path d="M{M.r1(nx)} {M.r1(ny + 42)} q12 12 28 12 q16 0 28 -12" '
                   f'fill="none" stroke="{k["noche"]}" stroke-width="4" opacity=".1" '
                   f'filter="url(#b2)"/>')
        for j in range(3):
            out.append(f'<rect x="{M.r1(nx + 7)}" y="{M.r1(ny + 12 + j * 9)}" '
                       f'width="{M.r1(42 - j * 9 - M.n(i * 3 + j, 2.1) * 8)}" '
                       f'height="2.4" rx="1.2" fill="{k["tinta"]}" opacity=".5"/>')
        out.append('</g>')
        return ''.join(out)

    sitios = [(x + 12, y + 12), (x + 80, y + 10), (x + 148, y + 14), (x + 194, y + 88),
              (x + 12, y + 88), (x + 80, y + 92)]
    for i, (nx, ny) in enumerate(sitios):
        if i == 2:
            # el hueco: la nota que falta, con la sombra de la chincheta
            g.append(f'<rect x="{M.r1(nx)}" y="{M.r1(ny)}" width="56" height="56" '
                     f'rx="1" fill="{k["noche"]}" opacity=".1"/>')
            g.append(f'<rect x="{M.r1(nx)}" y="{M.r1(ny)}" width="56" height="56" '
                     f'rx="1" fill="none" stroke="{k["noche"]}" stroke-width="1" '
                     f'stroke-dasharray="4 4" opacity=".28"/>')
            continue
        g.append(nota(nx, ny, NOTAS[i % 5], (M.n(i, 3.7) - .5) * 9, i))
    # la nota que se está moviendo, a medio camino y más alta
    g.append(nota(x + 138, y + 52, NOTAS[2], 13, 9, despegada=True))
    return ''.join(g)


def _prototipo():
    """El prototipo de cartón: palanca, pivote, goma tensada y contrapeso."""
    g = []
    # la base de cartón, con el canto corrugado a la vista
    bx, by = 306, 316
    g.append(M.sombra(bx, by, 244, 56, op=.34, dx=10, dy=13, rx=3))
    g.append(f'<path d="M{bx} {by + 10} L{bx + 236} {by} L{bx + 244} {by + 44} '
             f'L{bx + 8} {by + 56} Z" fill="url(#{P}_carton)"/>')
    # el canto: las capas del corrugado
    g.append(f'<path d="M{bx + 8} {by + 56} L{bx + 244} {by + 44} v9 l-236 12 Z" '
             f'fill="{CARTON_S}"/>')
    onda = ' '.join(f'q2 5 3.9 0 q1.9 -5 3.9 0' for _ in range(30))
    g.append(f'<path d="M{bx + 12} {by + 60} {onda}" fill="none" stroke="#e8c89a" '
             f'stroke-width="1.3" opacity=".6"/>')
    g.append(f'<path d="M{bx + 12} {by + 62} {onda}" fill="none" stroke="{k["noche"]}" '
             f'stroke-width="1.1" opacity=".2"/>')
    # el pivote: un taco de cartón de pie
    px, py = bx + 96, by + 4
    g.append(f'<path d="M{px} {py} l26 -2 l2 -42 l-26 2 Z" fill="{CARTON}"/>')
    g.append(f'<path d="M{px + 26} {py - 2} l10 -5 l2 -41 l-10 4 Z" fill="{CARTON_S}"/>')
    g.append(f'<path d="M{px} {py - 42} l26 -2 l10 -5 l-26 2 Z" fill="#e0b071"/>')
    # la palanca, inclinada sobre el pivote
    g.append('<g transform="rotate(-13 402 272)">')
    g.append(M.sombra(320, 262, 190, 18, op=.3, dx=6, dy=9, rx=2, sesgo=-.12))
    g.append(f'<rect x="320" y="262" width="190" height="17" rx="2" fill="{CARTON}"/>')
    g.append(f'<rect x="320" y="262" width="190" height="5" rx="2" fill="#e8c89a" '
             f'opacity=".7"/>')
    g.append(f'<rect x="320" y="274" width="190" height="5" fill="{CARTON_S}"/>')
    # la cinta que la sujeta al pivote: un lado pegado y el otro todavía suelto
    g.append(f'<rect x="392" y="256" width="24" height="30" rx="2" fill="#f2efe2" '
             f'opacity=".72"/>')
    g.append(f'<rect x="392" y="256" width="24" height="30" rx="2" fill="none" '
             f'stroke="#ffffff" stroke-width="1" opacity=".5"/>')
    g.append('</g>')
    # la cinta del otro extremo, aún sin cortar y colgando
    # la tira se estrecha donde se retuerce y se ensancha otra vez: eso es lo que
    # la separa de un tubo
    g.append(f'<path d="M486 250 q20 8 25 26 q5 20 -7 34 l-11 -3 q10 -13 6 -29 '
             f'q-4 -16 -19 -22 Z" fill="#f4f1e4" opacity=".82"/>')
    g.append(f'<path d="M486 250 q20 8 25 26 q5 20 -7 34" fill="none" '
             f'stroke="#ffffff" stroke-width="1.6" opacity=".6"/>')
    g.append(f'<path d="M503 278 l8 2" stroke="{k["noche"]}" stroke-width="3" '
             f'opacity=".12" filter="url(#b2)"/>')
    # la goma tensada entre la palanca y la base
    g.append(f'<path d="M347 252 C339 286 335 316 343 346" fill="none" '
             f'stroke="#b45f44" stroke-width="7" stroke-linecap="round" opacity=".35" '
             f'filter="url(#b2)"/>')
    g.append(f'<path d="M347 252 C339 286 335 316 343 346" fill="none" '
             f'stroke="#d17b5e" stroke-width="5.4" stroke-linecap="round"/>')
    g.append(f'<path d="M347 252 C339 286 335 316 343 346" fill="none" '
             f'stroke="#f3b79c" stroke-width="1.6" opacity=".65"/>')
    # los dos anclajes: arriba pasa por una muesca, abajo por un taco pegado
    g.append(f'<path d="M340 248 h16 v7 h-16 Z" fill="{CARTON_S}"/>')
    g.append(f'<path d="M335 344 l18 -2 l2 10 l-18 2 Z" fill="{CARTON}"/>')
    g.append(f'<path d="M335 344 l18 -2" stroke="#e8c89a" stroke-width="1.6" '
             f'opacity=".7"/>')
    # el contrapeso: arandelas apiladas en el extremo bajo
    g.append(M.contacto(528, 352, 40, op=.4, alto=5))
    g.append(M.sombra(528, 322, 42, 30, op=.3, dx=6, dy=9, rx=16, sesgo=-.18))
    for i in range(4):
        cy0 = 348 - i * 7
        g.append(f'<ellipse cx="548" cy="{M.r1(cy0)}" rx="20" ry="7.6" '
                 f'fill="url(#{P}_metal)"/>')
        g.append(f'<ellipse cx="548" cy="{M.r1(cy0)}" rx="20" ry="7.6" fill="none" '
                 f'stroke="{k["noche"]}" stroke-width=".9" opacity=".3"/>')
        g.append(f'<ellipse cx="548" cy="{M.r1(cy0 - .6)}" rx="7" ry="2.8" '
                 f'fill="#2a333c"/>')
        g.append(f'<ellipse cx="548" cy="{M.r1(cy0 - 1.2)}" rx="7" ry="2.8" '
                 f'fill="none" stroke="#ffffff" stroke-width=".8" opacity=".35"/>')
    # el eje que las atraviesa y las sujeta a la palanca
    g.append(f'<path d="M548 316 v26" stroke="#39434e" stroke-width="3" '
             f'stroke-linecap="round"/>')
    return ''.join(g)


def _cinta_y_tijeras():
    """El rollo de cinta con el extremo levantado, y las tijeras."""
    g = [M.contacto(168, 400, 84, op=.4, alto=6),
         M.sombra(130, 344, 84, 56, op=.3, dx=8, dy=11, rx=28, sesgo=-.2)]
    g.append(f'<ellipse cx="172" cy="372" rx="42" ry="30" fill="url(#{P}_carton)"/>')
    g.append(f'<ellipse cx="172" cy="372" rx="42" ry="30" fill="none" '
             f'stroke="{CARTON_S}" stroke-width="1.4" opacity=".6"/>')
    g.append(f'<ellipse cx="172" cy="372" rx="17" ry="12" fill="#6b4a28"/>')
    g.append(f'<ellipse cx="172" cy="372" rx="17" ry="12" fill="none" '
             f'stroke="{k["noche"]}" stroke-width="2" opacity=".3"/>')
    for i in range(7):
        g.append(f'<ellipse cx="172" cy="372" rx="{M.r1(18 + i * 3.4)}" '
                 f'ry="{M.r1(12.6 + i * 2.5)}" fill="none" stroke="#ffffff" '
                 f'stroke-width=".9" opacity="{M.r2(.1 + M.n(i, 3.1) * .12)}"/>')
    # el extremo levantado
    g.append(f'<path d="M212 366 q24 -6 42 4 q-20 8 -42 4 Z" fill="#f2efe2" '
             f'opacity=".82"/>')
    g.append(f'<path d="M212 366 q24 -6 42 4" fill="none" stroke="#ffffff" '
             f'stroke-width="1.2" opacity=".6"/>')
    # las tijeras, cerradas y apoyadas
    g.append('<g transform="rotate(24 72 322)">')
    g.append(M.sombra(18, 306, 150, 20, op=.28, dx=6, dy=9, rx=4, sesgo=-.14))
    g.append(f'<path d="M18 314 L92 310 L94 318 L20 322 Z" fill="url(#{P}_metal)"/>')
    g.append(M.brillo_borde('M19 315 L91 311', w=1.6, op=.9))
    g.append(f'<circle cx="98" cy="314" r="5" fill="url(#{P}_metal)"/>')
    for cx0, cy0 in ((124, 306), (124, 326)):
        g.append(f'<ellipse cx="{cx0}" cy="{cy0}" rx="20" ry="12" fill="none" '
                 f'stroke="#17202a" stroke-width="8"/>')
    g.append('</g>')
    # recortes de cartón sueltos
    for i, (rx0, ry0, rot) in enumerate(((246, 386, 24), (278, 398, -16), (216, 396, 52))):
        g.append(f'<path d="M{rx0} {ry0} l22 -5 l4 10 l-22 6 Z" fill="{CARTON}" '
                 f'transform="rotate({rot} {rx0} {ry0})" opacity=".95"/>')
    return ''.join(g)


def _lapiz():
    return ('<g transform="rotate(-28 250 240)">'
            + M.sombra(188, 234, 132, 12, op=.26, dx=4, dy=6, rx=6, blur='b2')
            + f'<rect x="200" y="234" width="112" height="12" rx="6" fill="#f0b419"/>'
            + f'<rect x="200" y="235" width="112" height="3.4" rx="1.7" '
              f'fill="#ffdf8a" opacity=".8"/>'
            + f'<path d="M188 237 l14 -3 v12 l-14 -3 Z" fill="{k["madL"]}"/>'
            + f'<path d="M184 240 l7 -1.6 v6 Z" fill="{k["tinta"]}"/>'
            + f'<rect x="306" y="233" width="14" height="14" rx="2" fill="#e3728a"/>'
            + '</g>')


def escena():
    defs = (
        M.defs_taller(P, tabla=('#c0a279', '#9d7f52', '#765a37', '#4c3821'))
        + M.defs_papel(P)
        + M.defs_metal(P)
        + lg(f'{P}_carton', .1, 0, .9, 1,
             [(0, '#e2b87c', None), (.3, CARTON, None), (1, CARTON_S, None)])
        + lg(f'{P}_corcho', .1, 0, .8, 1,
             [(0, '#d3a468', None), (.4, '#c1914f', None), (1, '#9e7237', None)])
        + rg(f'{P}_focosuelo', .5, .5, .5, [(0, '#fff0cf', .48), (1, '#fff0cf', 0)])
        + M.clip(f'{P}_cp_cuaderno',
                 'M36 160 L186 154 L186 360 L38 366 Z '
                 'M190 154 L336 150 L340 358 L190 360 Z')
    )

    c = M.pared(P, MESA + 6, vx=214, vy=8, vw=124, vh=98)
    c += M.banco(P, MESA, juntas=(300,), nudos=((252, 386, 8),))
    c += (f'<ellipse cx="200" cy="230" rx="240" ry="140" fill="url(#{P}_focosuelo)" '
          f'opacity=".48" filter="url(#b22)"/>')

    c += _tablero()
    c += _cuaderno()
    c += _prototipo()
    c += _cinta_y_tijeras()
    c += _lapiz()

    c += M.velo(P, MESA - 6, 50, op=.3)
    c += M.vineta(P, .85)
    return svg(c, defs)
