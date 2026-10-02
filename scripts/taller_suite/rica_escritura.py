# -*- coding: utf-8 -*-
"""Escena rica de Escritura con restricciones (R65 · tanda 7).

La restricción, hecha objeto: **la tecla tapada**.

Lo que se ve:

* la **máquina de escribir** de canto: el carro con su cilindro de goma, las
  palancas de los tipos en abanico, el teclado escalonado con las teclas
  redondas de su aro metálico, la cinta con sus dos carretes y la palanca de
  retorno;
* **una tecla tapada con cinta**, y en la cinta una letra tachada: esa es la
  regla, y está en el aparato, no en un cartel. Se ve incluso sin leer nada;
* la **hoja en el rodillo**, escrita a medias: renglones tecleados, el último
  cortado donde se quedó, una palabra **tachada con equis de máquina** y otra
  escrita encima a mano;
* la **tarjeta de la regla** apoyada contra el carro, con la letra prohibida
  grande y su aspa;
* el **fichero de palabras**: una caja con fichas de pie, unas cuantas
  levantadas y dos sobre la mesa, una de ellas **descartada** con su tachón;
* la **cuenta de sílabas** al margen, en palotes agrupados de cinco;
* el diccionario abierto y bocabajo para no perder la página;
* el lápiz sobre la hoja y la goma con su polvo.

Nada de texto legible: los renglones son bloques, que es lo que se ve de un
escrito a esta distancia. Lo único que se lee es la letra prohibida, y se lee
porque es la regla.
"""
import math

from taller_suite.escenas_ricas import C, W, H, svg, lg, rg
from taller_suite import rica_comun as M

k = C
P = 'es'

MESA = 126

# La letra prohibida. Se dibuja como trazos, no como texto de fuente.
def _letra_E(x, y, alto, w, col, op=1.0):
    """Una E dibujada con trazos: la misma en la tecla y en la tarjeta."""
    a = alto
    return (f'<path d="M{M.r1(x)} {M.r1(y)} v{M.r1(a)} M{M.r1(x)} {M.r1(y)} '
            f'h{M.r1(a * .58)} M{M.r1(x)} {M.r1(y + a / 2)} h{M.r1(a * .46)} '
            f'M{M.r1(x)} {M.r1(y + a)} h{M.r1(a * .58)}" fill="none" stroke="{col}" '
            f'stroke-width="{w}" opacity="{op}" stroke-linecap="round"/>')


def _maquina():
    """La máquina de escribir, de tres cuartos."""
    g = [M.contacto(88, 350, 300, op=.46, alto=9),
         M.sombra(96, 216, 286, 136, op=.36, dx=13, dy=16, rx=8)]
    # el cuerpo
    g.append(f'<path d="M104 344 L112 262 L370 250 L378 340 Q240 356 104 344 Z" '
             f'fill="url(#{P}_cuerpo)"/>')
    g.append(f'<path d="M112 262 L370 250 L368 262 L114 274 Z" fill="#ffffff" '
             f'opacity=".14"/>')
    # el carro, encima
    g.append(f'<path d="M96 258 L106 214 L376 204 L384 250 Z" '
             f'fill="url(#{P}_carro)"/>')
    g.append(f'<path d="M106 214 L376 204 L375 212 L107 222 Z" fill="#ffffff" '
             f'opacity=".2"/>')
    # el cilindro de goma del rodillo
    g.append(f'<rect x="120" y="206" width="244" height="22" rx="11" fill="#1d2228" '
             f'transform="rotate(-2 242 217)"/>')
    g.append(f'<rect x="120" y="208" width="244" height="6" rx="3" fill="#4b545e" '
             f'opacity=".7" transform="rotate(-2 242 217)"/>')
    for cx in (114, 372):
        g.append(f'<circle cx="{cx}" cy="{216 if cx < 200 else 210}" r="13" '
                 f'fill="url(#{P}_metal)"/>')
        g.append(f'<circle cx="{cx}" cy="{216 if cx < 200 else 210}" r="5" '
                 f'fill="{k["noche"]}" opacity=".45"/>')
    # las palancas de los tipos, en abanico
    for i in range(15):
        a = math.radians(-118 + i * 8.2)
        x0, y0 = 242 + 96 * math.cos(a), 300 + 60 * math.sin(a)
        x1, y1 = 242 + 42 * math.cos(a), 292 + 26 * math.sin(a)
        g.append(f'<path d="M{M.r1(x0)} {M.r1(y0)} L{M.r1(x1)} {M.r1(y1)}" '
                 f'stroke="url(#{P}_metal)" stroke-width="2.4" opacity=".85"/>')
    g.append(f'<path d="M150 292 Q242 268 336 288 Q242 300 150 292 Z" '
             f'fill="#1a1f25" opacity=".7"/>')
    # los dos carretes de la cinta
    for cx in (162, 322):
        g.append(f'<circle cx="{cx}" cy="256" r="17" fill="url(#{P}_metal)"/>')
        g.append(f'<circle cx="{cx}" cy="256" r="12" fill="#2b2118"/>')
        g.append(f'<circle cx="{cx}" cy="256" r="4" fill="#8d97a1"/>')
    g.append(f'<path d="M162 256 Q242 276 322 256" fill="none" stroke="#2b2118" '
             f'stroke-width="5" opacity=".9"/>')
    # el teclado escalonado
    letras = ('#e8e2d4', '#dcd5c4')
    for fila in range(4):
        n = 11 - fila % 2
        for i in range(n):
            x = 128 + i * 21.6 + fila * 5.4
            y = 300 + fila * 13
            g.append(f'<ellipse cx="{M.r1(x)}" cy="{M.r1(y + 3)}" rx="9.4" ry="7" '
                     f'fill="{k["noche"]}" opacity=".35" filter="url(#b2)"/>')
            g.append(f'<circle cx="{M.r1(x)}" cy="{M.r1(y)}" r="9.4" '
                     f'fill="url(#{P}_metal)"/>')
            g.append(f'<circle cx="{M.r1(x)}" cy="{M.r1(y)}" r="7.4" '
                     f'fill="{letras[(fila + i) % 2]}"/>')
            g.append(f'<circle cx="{M.r1(x - 2.4)}" cy="{M.r1(y - 2.8)}" r="2.6" '
                     f'fill="#ffffff" opacity=".55"/>')
            # el glifo de cada tecla, como marca
            g.append(f'<rect x="{M.r1(x - 2.6)}" y="{M.r1(y - 1.4)}" width="5.2" '
                     f'height="2.4" rx="1.2" fill="{k["tinta"]}" opacity=".45"/>')
    # la palanca de retorno
    g.append(f'<path d="M92 226 L58 210 L52 220 L86 238 Z" fill="url(#{P}_metal)"/>')
    g.append(f'<circle cx="55" cy="215" r="7" fill="#2b2118"/>')
    return ''.join(g)


def _tecla_tapada():
    """La tecla tapada con cinta: la regla puesta en el aparato."""
    x, y = 128 + 4 * 21.6 + 5.4, 313
    g = [f'<g transform="rotate(-7 {M.r1(x)} {M.r1(y)})">',
         # la cinta, con su brillo y sus bordes irregulares
         f'<path d="M{M.r1(x - 17)} {M.r1(y - 11)} l35 -2 l2 24 l-36 2 Z" '
         f'fill="#f2efe2" opacity=".93"/>',
         f'<path d="M{M.r1(x - 17)} {M.r1(y - 11)} l35 -2 l1 5 l-36 2 Z" '
         f'fill="#ffffff" opacity=".6"/>',
         f'<path d="M{M.r1(x - 17)} {M.r1(y - 11)} l35 -2 l2 24 l-36 2 Z" '
         f'fill="none" stroke="{k["noche"]}" stroke-width=".9" opacity=".22"/>',
         '</g>']
    # la letra prohibida, escrita en la cinta y tachada
    g.append(_letra_E(x - 7, y - 6, 13, 2.2, '#c0392b', .95))
    g.append(M.trazo(f'M{M.r1(x - 13)} {M.r1(y - 9)} l26 19', '#c0392b',
                     w=2.6, op=.95, halo=False))
    return ''.join(g)


def _hoja():
    """La hoja en el rodillo, escrita a medias."""
    x, y, w, h = 138, 88, 212, 126
    g = [M.sombra(x, y, w, h, op=.26, dx=6, dy=9, rx=2, blur='b5'),
         f'<path d="M{x} {y + 6} L{x + w - 4} {y} L{x + w + 6} {y + h} L{x + 8} {y + h + 6} Z" '
         f'fill="url(#{P}_pliego)"/>',
         f'<path d="M{x} {y + 6} L{x + w - 4} {y}" stroke="#c9c0ac" stroke-width="1" '
         f'opacity=".8"/>']
    # los renglones tecleados: bloques de palabra con espacios
    y0 = y + 24
    for fila in range(8):
        cx = x + 16
        ancho_total = 170 if fila < 7 else 88       # el último se quedó cortado
        restante = ancho_total
        i = 0
        while restante > 8:
            palabra = min(restante, 10 + M.n(fila * 7 + i, 3.1) * 26)
            g.append(f'<rect x="{M.r1(cx)}" y="{M.r1(y0 + fila * 12 - (cx - x) * .02)}" '
                     f'width="{M.r1(palabra)}" height="4" rx="1.6" fill="{k["tinta"]}" '
                     f'opacity="{M.r2(.6 + M.n(fila * 7 + i, 5.7) * .22)}"/>')
            cx += palabra + 6
            restante -= palabra + 6
            i += 1
    # una palabra tachada con equis de máquina y otra escrita a mano encima
    tx, ty = x + 96, y0 + 3 * 12
    g.append(f'<rect x="{M.r1(tx)}" y="{M.r1(ty - 2)}" width="44" height="4" rx="1.6" '
             f'fill="{k["tinta"]}" opacity=".45"/>')
    for i in range(6):
        g.append(f'<path d="M{M.r1(tx + i * 7.4)} {M.r1(ty - 4)} l6 8 m0 -8 l-6 8" '
                 f'stroke="{k["tinta"]}" stroke-width="1" opacity=".75"/>')
    g.append(M.trazo(f'M{M.r1(tx + 2)} {M.r1(ty - 12)} q14 -6 26 -1 q10 4 20 -2',
                     '#2f6f87', w=1.8, op=.85, halo=False))
    # el cursor: donde se quedó
    g.append(f'<rect x="{M.r1(x + 16 + 88)}" y="{M.r1(y0 + 7 * 12 - 4)}" width="7" '
             f'height="8" fill="{k["tinta"]}" opacity=".5"/>')
    # la cuenta de sílabas al margen, en palotes de cinco
    for grupo in range(4):
        gx = x + w - 34
        gy = y + 30 + grupo * 18
        for i in range(4):
            g.append(f'<path d="M{M.r1(gx + i * 4.4)} {M.r1(gy)} v11" '
                     f'stroke="{k["grafito"]}" stroke-width="1.4" opacity=".7"/>')
        if grupo < 3:
            g.append(f'<path d="M{M.r1(gx - 3)} {M.r1(gy + 10)} l22 -9" '
                     f'stroke="{k["grafito"]}" stroke-width="1.4" opacity=".7"/>')
    return ''.join(g)


def _tarjeta_regla():
    """La tarjeta de la regla apoyada contra el carro."""
    x, y, w, h = 396, 148, 132, 94
    g = [M.sombra(x, y, w, h, op=.3, dx=8, dy=11, rx=3),
         f'<g transform="rotate(-8 {x + w / 2} {y + h / 2})">',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" '
         f'fill="url(#{P}_pliego)"/>',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" fill="none" '
         f'stroke="#b5ac9b" stroke-width="1" opacity=".85"/>',
         # la letra grande y su aspa
         _letra_E(x + 38, y + 24, 46, 6.4, k['tinta'], .9),
         M.trazo(f'M{x + 26} {y + 16} L{x + 100} {y + 78}', '#c0392b', w=5,
                 op=.9, halo=False),
         M.trazo(f'M{x + 100} {y + 16} L{x + 26} {y + 78}', '#c0392b', w=5,
                 op=.9, halo=False),
         '</g>']
    return ''.join(g)


def _fichero():
    """La caja de fichas, con dos sobre la mesa y una descartada."""
    x, y = 402, 262
    g = [M.contacto(x, y + 92, 168, op=.42, alto=7),
         M.sombra(x, y, 168, 92, op=.32, dx=10, dy=13, rx=4, sesgo=-.2)]
    # las fichas de pie, asomando
    for i in range(11):
        fx = x + 14 + i * 12.4
        alto = 56 + M.n(i, 3.1) * 16
        levantada = i in (4, 5)
        g.append(f'<path d="M{M.r1(fx)} {M.r1(y + 84 - alto - (8 if levantada else 0))} '
                 f'l11 -2 l0 {M.r1(alto)} l-11 2 Z" fill="url(#{P}_ficha)"/>')
        g.append(f'<path d="M{M.r1(fx)} {M.r1(y + 84 - alto - (8 if levantada else 0))} '
                 f'l11 -2" stroke="#ffffff" stroke-width="1.6" opacity=".6"/>')
        if i % 3 == 0:
            g.append(f'<rect x="{M.r1(fx + 2)}" '
                     f'y="{M.r1(y + 84 - alto + 6 - (8 if levantada else 0))}" '
                     f'width="7" height="2" rx="1" fill="{k["tinta"]}" opacity=".4"/>')
    # la caja
    g.append(f'<path d="M{x} {y + 40} L{x + 168} {y + 32} L{x + 168} {y + 92} '
             f'L{x} {y + 100} Z" fill="url(#{P}_caja)"/>')
    g.append(f'<path d="M{x} {y + 40} L{x + 168} {y + 32} L{x + 168} {y + 40} '
             f'L{x} {y + 48} Z" fill="#ffffff" opacity=".18"/>')
    g.append(f'<path d="M{x + 60} {y + 66} h48 v10 h-48 Z" fill="#8a6134" '
             f'opacity=".6"/>')
    # dos fichas sobre la mesa, una descartada
    for i, (fx, fy, rot, descartada) in enumerate(((330, 366, -12, False),
                                                   (432, 386, 9, True))):
        g.append(f'<g transform="rotate({rot} {fx + 36} {fy + 12})">')
        g.append(M.sombra(fx, fy, 74, 26, op=.26, dx=4, dy=6, rx=2, blur='b2'))
        g.append(f'<rect x="{fx}" y="{fy}" width="74" height="26" rx="2" '
                 f'fill="url(#{P}_ficha)"/>')
        for j in range(2):
            g.append(f'<rect x="{fx + 8}" y="{M.r1(fy + 8 + j * 7)}" '
                     f'width="{M.r1(50 - j * 18)}" height="2.8" rx="1.4" '
                     f'fill="{k["tinta"]}" opacity=".55"/>')
        if descartada:
            g.append(M.trazo(f'M{fx + 6} {fy + 5} L{fx + 68} {fy + 21}', '#c0392b',
                             w=2.4, op=.85, halo=False))
        g.append('</g>')
    return ''.join(g)


def _diccionario():
    """El diccionario abierto y bocabajo, para no perder la página."""
    g = [M.contacto(24, 384, 130, op=.4, alto=6),
         M.sombra(20, 328, 136, 56, op=.3, dx=9, dy=12, rx=3, sesgo=-.24)]
    g.append(f'<path d="M20 340 L88 328 L156 342 L156 380 L88 368 L20 382 Z" '
             f'fill="#6b3f2c"/>')
    g.append(f'<path d="M20 340 L88 328 L156 342 L88 352 Z" fill="#8a5238"/>')
    # el corte de las hojas
    for i in range(7):
        g.append(f'<path d="M{M.r1(22 + i * .8)} {M.r1(344 + i * 4.8)} '
                 f'L{M.r1(86)} {M.r1(334 + i * 4.6)} L{M.r1(154 - i * .8)} '
                 f'{M.r1(346 + i * 4.8)}" fill="none" stroke="#efe8d6" '
                 f'stroke-width="2.6" opacity="{M.r2(.9 - i * .07)}"/>')
    g.append(f'<path d="M88 328 v40" stroke="{k["noche"]}" stroke-width="3" '
             f'opacity=".3" filter="url(#b2)"/>')
    return ''.join(g)


def _lapiz():
    return ('<g transform="rotate(-22 262 386)">'
            + M.sombra(200, 380, 132, 12, op=.24, dx=4, dy=6, rx=6, blur='b2')
            + f'<rect x="212" y="380" width="112" height="12" rx="6" fill="#2f6f87"/>'
            + f'<rect x="212" y="381" width="112" height="3.4" rx="1.7" '
              f'fill="#63a8c0" opacity=".8"/>'
            + f'<path d="M200 383 l14 -3 v12 l-14 -3 Z" fill="{k["madL"]}"/>'
            + f'<path d="M194 386 l7 -1.6 v6 Z" fill="{k["tinta"]}"/>'
            + '</g>')


def _defs():
    """Los gradientes, filtros y recortes de esta escena.

    Vive aparte para que la variante AGE_0_12 pueda reutilizar
    exactamente los mismos, sin duplicarlos y sin que puedan divergir.
    """
    return (
        M.defs_taller(P, tabla=('#b1906a', '#8f7043', '#6a4e2e', '#43301a'))
        + M.defs_papel(P)
        + M.defs_metal(P)
        + lg(f'{P}_cuerpo', 0, 0, .25, 1,
             [(0, '#4e5a5f', None), (.3, '#36414a', None), (1, '#1b2228', None)])
        + lg(f'{P}_carro', 0, 0, .3, 1,
             [(0, '#5c686e', None), (.4, '#404a52', None), (1, '#232b32', None)])
        + lg(f'{P}_ficha', .1, 0, .9, 1,
             [(0, '#fdfaf0', None), (.5, '#f3ecda', None), (1, '#ddd4bd', None)])
        + lg(f'{P}_caja', 0, 0, .3, 1,
             [(0, '#c08a4e', None), (.4, '#a06f38', None), (1, '#6f4a21', None)])
        + rg(f'{P}_focosuelo', .5, .5, .5, [(0, '#fff0cf', .44), (1, '#fff0cf', 0)])
    )


def escena():
    defs = _defs()

    c = M.pared(P, MESA + 6, vx=470, vy=6, vw=134, vh=94)
    c += M.banco(P, MESA, juntas=(392,), nudos=((236, 384, 8),))
    c += (f'<ellipse cx="220" cy="214" rx="250" ry="140" fill="url(#{P}_focosuelo)" '
          f'opacity=".44" filter="url(#b22)"/>')

    c += _tarjeta_regla()
    c += _hoja()
    c += _maquina()
    c += _tecla_tapada()
    c += _fichero()
    c += _diccionario()
    c += _lapiz()

    c += M.velo(P, MESA - 6, 44, op=.26)
    c += M.vineta(P, .85)
    return svg(c, defs)
