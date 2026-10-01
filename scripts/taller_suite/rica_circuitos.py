# -*- coding: utf-8 -*-
"""Escena rica de Circuitos (R65 · tanda 4).

El circuito montado sobre la mesa, con **una rama encendida y otra a medias**.

Lo que se ve:

* la pila de petaca con sus dos bornes y la etiqueta despegándose por una
  esquina;
* los cables de pinza de cocodrilo: la funda de goma, la pinza con sus dientes,
  el muelle a la vista y el cable que cae con su propia caída, no con un arco
  dibujado;
* **la bombilla encendida**: el filamento al rojo dentro del vidrio, el halo que
  reparte sobre la madera y el reflejo del casquillo. La luz que emite es una
  fuente real en la escena y por eso el entorno cambia de color a su alrededor;
* **el interruptor de palanca cerrado** en esa rama, con el contacto tocando;
* la **segunda rama, sin terminar**: su bombilla apagada, con el filamento frío
  y gris, y el cable **todavía suelto** sobre la mesa, con la pinza abierta.
  Falta ese salto para que encienda, y se ve cuál es;
* el **zumbador** y su rama con el interruptor abierto: la palanca levantada y
  el hueco entre los contactos;
* el esquema a lápiz al lado, con los símbolos normalizados —pila, lámpara,
  interruptor— y una rama tachada porque no funcionó;
* el portapilas de repuesto, las tijeras de pelar y un trozo de cable pelado con
  el cobre a la vista.

Nada de personajes. Lo que se enseña es el camino de la corriente: dónde está
cerrado y dónde falta cerrar.
"""
import math

from taller_suite.escenas_ricas import C, W, H, svg, lg, rg
from taller_suite import rica_comun as M

k = C
P = 'ci'

MESA = 122

COBRE = '#c8813a'
ROJO = '#c0392b'
NEGRO = '#232a31'
LUZ = '#ffe9a8'


def _portalamparas(cx, cy):
    """El portalámparas: base con sus dos bornes de tornillo."""
    return (M.contacto(cx - 24, cy + 22, 48, op=.42, alto=6)
            + M.sombra(cx - 24, cy - 6, 48, 26, op=.3, dx=6, dy=9, rx=4, blur='b2')
            + f'<rect x="{cx - 24}" y="{cy - 6}" width="48" height="24" rx="4" '
              f'fill="url(#{P}_base_int)"/>'
            + f'<rect x="{cx - 24}" y="{cy - 6}" width="48" height="6" rx="3" '
              f'fill="#ffffff" opacity=".25"/>'
            + f'<ellipse cx="{cx}" cy="{cy - 6}" rx="13" ry="5" fill="#9aa4ae"/>'
            + ''.join(f'<circle cx="{M.r1(cx + dx)}" cy="{cy + 10}" r="4.6" '
                      f'fill="url(#{P}_metal)"/>'
                      f'<path d="M{M.r1(cx + dx - 3)} {cy + 10} h6" '
                      f'stroke="{k["noche"]}" stroke-width="1.4" opacity=".5"/>'
                      for dx in (-17, 17)))


def _bombilla(cx, cy, *, encendida, s=1.0):
    """Una bombilla en su portalámparas: vidrio, filamento y casquillo."""
    g = [_portalamparas(cx, cy + 32)]
    if encendida:
        # el halo: lo que la convierte en fuente de luz de la escena
        # el charco de luz que reparte sobre la mesa: es lo que la hace fuente
        g.append(f'<ellipse cx="{cx}" cy="{cy + 46}" rx="128" ry="62" '
                 f'fill="url(#{P}_halo)" filter="url(#b22)"/>')
        g.append(f'<circle cx="{cx}" cy="{cy}" r="92" fill="url(#{P}_halo)" '
                 f'filter="url(#b22)"/>')
        g.append(f'<circle cx="{cx}" cy="{cy}" r="34" fill="{LUZ}" opacity=".6" '
                 f'filter="url(#b12)"/>')
        g.append(f'<circle cx="{cx}" cy="{cy}" r="16" fill="#fffbe8" opacity=".7" '
                 f'filter="url(#b5)"/>')
    # el casquillo
    g.append(f'<path d="M{cx - 11} {cy + 16} h22 l-1 16 h-20 Z" '
             f'fill="url(#{P}_metal)"/>')
    for i in range(3):
        g.append(f'<path d="M{cx - 11} {M.r1(cy + 19 + i * 5)} h22" '
                 f'stroke="{k["noche"]}" stroke-width="1.4" opacity=".3"/>')
    g.append(f'<path d="M{cx - 6} {cy + 32} h12 l-2 5 h-8 Z" fill="#6d7780"/>')
    # el vidrio
    g.append(f'<path d="M{cx - 11} {cy + 17} C{cx - 24} {cy + 6} {cx - 22} {cy - 20} '
             f'{cx} {cy - 22} C{cx + 22} {cy - 20} {cx + 24} {cy + 6} {cx + 11} '
             f'{cy + 17} Z" fill="url(#{P}_vidrio_b)"/>')
    # el filamento: en zigzag entre dos soportes
    col = '#ffd24a' if encendida else '#8d97a1'
    g.append(f'<path d="M{cx - 5} {cy + 14} V{cy + 2} M{cx + 5} {cy + 14} V{cy + 2}" '
             f'stroke="{col}" stroke-width="1.4" opacity=".9"/>')
    zig = f'M{cx - 5} {cy + 2} ' + ' '.join(
        f'L{M.r1(cx - 5 + (i + 1) * 10 / 6)} {M.r1(cy + 2 - (8 if i % 2 else 0))}'
        for i in range(6))
    if encendida:
        g.append(f'<path d="{zig}" fill="none" stroke="#fff3c4" stroke-width="5" '
                 f'opacity=".8" filter="url(#b2)"/>')
    g.append(f'<path d="{zig}" fill="none" stroke="{col}" stroke-width="1.8" '
             f'opacity="{.95 if encendida else .8}"/>')
    # el brillo del vidrio
    g.append(f'<ellipse cx="{cx - 7}" cy="{cy - 10}" rx="4.4" ry="7" fill="#ffffff" '
             f'opacity="{.5 if encendida else .35}" filter="url(#b2)" '
             f'transform="rotate(-24 {cx - 7} {cy - 10})"/>')
    return ''.join(g)


def _pila(x, y):
    """La pila de petaca, con sus dos bornes y la etiqueta despegada."""
    g = [M.contacto(x - 4, y + 78, 96, op=.42, alto=7),
         M.sombra(x, y, 92, 76, op=.32, dx=10, dy=13, rx=4, sesgo=-.2),
         f'<rect x="{x}" y="{y}" width="92" height="76" rx="4" '
         f'fill="url(#{P}_pila)"/>',
         f'<rect x="{x}" y="{y}" width="92" height="12" rx="4" fill="#ffffff" '
         f'opacity=".18"/>']
    # la etiqueta, con una esquina levantada
    g.append(f'<path d="M{x + 7} {y + 20} h66 v40 l-12 4 h-54 Z" fill="#e9e2d2"/>')
    g.append(f'<path d="M{x + 73} {y + 60} l-12 4 l2 -12 Z" fill="#c9c0ac"/>')
    for i in range(3):
        g.append(f'<rect x="{x + 14}" y="{M.r1(y + 28 + i * 9)}" '
                 f'width="{M.r1(50 - i * 12)}" height="3" rx="1.5" fill="{NEGRO}" '
                 f'opacity=".45"/>')
    # los dos bornes: uno corto y uno largo, como en una petaca
    for dx, alto, col in ((26, 20, '#c9c9c9'), (62, 30, '#c9c9c9')):
        g.append(f'<rect x="{M.r1(x + dx - 4)}" y="{M.r1(y - alto)}" width="8" '
                 f'height="{alto + 4}" rx="2" fill="url(#{P}_metal)"/>')
        g.append(f'<path d="M{M.r1(x + dx)} {M.r1(y - alto)} a5 5 0 0 1 0 -2" '
                 f'stroke="#ffffff" stroke-width="2" opacity=".5" fill="none"/>')
    return ''.join(g)


def _cable(d, col, *, w=5.5, brillo=True):
    """Un cable con funda: sombra debajo, cuerpo y filo de luz encima."""
    g = [f'<path d="{d}" fill="none" stroke="{k["noche"]}" stroke-width="{w + 2}" '
         f'opacity=".2" filter="url(#b2)" transform="translate(3 5)"/>',
         f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{w}" '
         f'stroke-linecap="round"/>']
    if brillo:
        g.append(f'<path d="{d}" fill="none" stroke="#ffffff" '
                 f'stroke-width="{M.r2(w * .28)}" opacity=".3" '
                 f'transform="translate(-1 -1.4)"/>')
    return ''.join(g)


def _pinza(cx, cy, ang, col, *, abierta=False):
    """Pinza de cocodrilo: dientes, muelle y funda."""
    a = 9 if abierta else 0
    g = [f'<g transform="rotate({ang} {cx} {cy})">']
    for lado, signo in ((0, -1), (1, 1)):
        g.append(f'<g transform="rotate({M.r1(signo * a)} {cx} {cy})">')
        g.append(f'<path d="M{cx - 2} {M.r1(cy + signo * 1)} l26 {M.r1(signo * 3)} '
                 f'l0 {M.r1(signo * 5)} l-26 {M.r1(-signo * 2)} Z" '
                 f'fill="url(#{P}_metal)"/>')
        for i in range(4):
            g.append(f'<path d="M{M.r1(cx + 8 + i * 4.6)} {M.r1(cy + signo * 4)} '
                     f'l2 {M.r1(signo * 3.4)}" stroke="#9aa4ae" stroke-width="1.4"/>')
        g.append('</g>')
    # el muelle
    for i in range(4):
        g.append(f'<circle cx="{M.r1(cx - 6 + i * 2.4)}" cy="{cy}" r="4" fill="none" '
                 f'stroke="#8d97a1" stroke-width="1.2" opacity=".85"/>')
    # la funda de goma
    g.append(f'<path d="M{cx - 20} {cy - 7} h16 v14 h-16 q-5 -7 0 -14 Z" fill="{col}"/>')
    g.append(f'<path d="M{cx - 20} {cy - 7} h16 v4 h-16 Z" fill="#ffffff" '
             f'opacity=".25"/>')
    g.append('</g>')
    return ''.join(g)


def _interruptor(x, y, *, cerrado):
    """Interruptor de palanca: cerrado toca el contacto, abierto deja el hueco."""
    g = [M.sombra(x, y, 64, 26, op=.28, dx=5, dy=8, rx=3, blur='b2'),
         f'<rect x="{x}" y="{y}" width="64" height="26" rx="3" '
         f'fill="url(#{P}_base_int)"/>',
         f'<rect x="{x}" y="{y}" width="64" height="6" rx="3" fill="#ffffff" '
         f'opacity=".2"/>']
    # los dos contactos
    for dx in (12, 52):
        g.append(f'<circle cx="{M.r1(x + dx)}" cy="{y + 13}" r="5" '
                 f'fill="url(#{P}_metal)"/>')
        g.append(f'<circle cx="{M.r1(x + dx)}" cy="{y + 13}" r="2" fill="{k["noche"]}" '
                 f'opacity=".45"/>')
    # la palanca
    if cerrado:
        g.append(f'<path d="M{x + 12} {y + 13} L{x + 52} {y + 13}" '
                 f'stroke="url(#{P}_metal)" stroke-width="6" stroke-linecap="round"/>')
        g.append(M.brillo_borde(f'M{x + 15} {y + 11} h34', w=1.6, op=.7))
    else:
        g.append(f'<path d="M{x + 12} {y + 13} L{x + 46} {y - 12}" '
                 f'stroke="url(#{P}_metal)" stroke-width="6" stroke-linecap="round"/>')
        g.append(M.brillo_borde(f'M{x + 15} {y + 10} L{x + 44} {y - 11}', w=1.6, op=.7))
        # el hueco entre los contactos, señalado
        g.append(f'<path d="M{x + 46} {y - 6} L{x + 52} {y + 7}" stroke="{ROJO}" '
                 f'stroke-width="1.4" opacity=".55" stroke-dasharray="3 3"/>')
    return ''.join(g)


def _zumbador(cx, cy):
    """El zumbador: cilindro negro con su rejilla y sus dos patas."""
    g = [M.contacto(cx - 22, cy + 22, 44, op=.4, alto=5),
         M.sombra(cx - 22, cy - 20, 44, 42, op=.3, dx=7, dy=10, rx=20, sesgo=-.2),
         f'<ellipse cx="{cx}" cy="{cy + 18}" rx="22" ry="7" fill="#161c22"/>',
         f'<rect x="{cx - 22}" y="{cy - 14}" width="44" height="32" fill="#1d242b"/>',
         f'<ellipse cx="{cx}" cy="{cy - 14}" rx="22" ry="7" fill="#2b343c"/>',
         f'<circle cx="{cx}" cy="{cy - 14}" r="5" fill="#0d1116"/>',
         f'<rect x="{cx - 22}" y="{cy - 12}" width="7" height="30" fill="#ffffff" '
         f'opacity=".1"/>']
    for i in range(3):
        g.append(f'<ellipse cx="{cx}" cy="{M.r1(cy - 14)}" rx="{M.r1(9 + i * 4.5)}" '
                 f'ry="{M.r1(2.8 + i * 1.4)}" fill="none" stroke="#39434e" '
                 f'stroke-width="1.2" opacity=".7"/>')
    return ''.join(g)


def _esquema():
    """El esquema a lápiz, con símbolos normalizados y una rama tachada."""
    x, y, w, h = 400, 122, 214, 142
    g = [M.sombra(x, y, w, h, op=.28, dx=7, dy=10, rx=2),
         f'<g transform="rotate(4 {x + w / 2} {y + h / 2})">',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" '
         f'fill="url(#{P}_pliego)"/>',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="none" '
         f'stroke="#b5ac9b" stroke-width=".8" opacity=".8"/>']
    t = k['tinta']
    # el lazo del circuito
    g.append(f'<path d="M{x + 30} {y + 44} H{x + 186} V{y + 112} H{x + 30} Z" '
             f'fill="none" stroke="{t}" stroke-width="1.6" opacity=".78"/>')
    # símbolo de pila: dos rayas, una larga y una corta, repetidas
    for i, (dx, alto) in enumerate(((0, 13), (6, 7), (12, 13), (18, 7))):
        g.append(f'<path d="M{M.r1(x + 66 + dx)} {M.r1(y + 44 - alto / 2)} '
                 f'v{alto}" stroke="{t}" stroke-width="1.8" opacity=".85"/>')
    g.append(f'<path d="M{x + 30} {y + 44} H{x + 66} M{x + 84} {y + 44} H{x + 186}" '
             f'stroke="url(#{P}_pliego)" stroke-width="4"/>')
    g.append(f'<path d="M{x + 30} {y + 44} H{x + 66} M{x + 84} {y + 44} H{x + 186}" '
             f'stroke="{t}" stroke-width="1.6" opacity=".78"/>')
    # símbolo de lámpara: círculo con aspa
    lx, ly = x + 186, y + 78
    g.append(f'<circle cx="{lx}" cy="{ly}" r="12" fill="url(#{P}_pliego)" '
             f'stroke="{t}" stroke-width="1.6" opacity=".85"/>')
    g.append(f'<path d="M{lx - 8.5} {ly - 8.5} l17 17 M{lx + 8.5} {ly - 8.5} '
             f'l-17 17" stroke="{t}" stroke-width="1.4" opacity=".8"/>')
    # símbolo de interruptor: la palanca levantada
    g.append(f'<path d="M{x + 92} {y + 112} h18 M{x + 132} {y + 112} h18" '
             f'stroke="{t}" stroke-width="1.6" opacity=".78"/>')
    g.append(f'<path d="M{x + 110} {y + 112} L{x + 130} {y + 100}" stroke="{t}" '
             f'stroke-width="1.8" opacity=".85" stroke-linecap="round"/>')
    for cx0 in (x + 110, x + 132):
        g.append(f'<circle cx="{cx0}" cy="{y + 112}" r="2.4" fill="{t}" opacity=".85"/>')
    # la rama que no funcionó, tachada
    g.append(f'<path d="M{x + 60} {y + 112} V{y + 136} H{x + 150}" fill="none" '
             f'stroke="{t}" stroke-width="1.4" opacity=".4" stroke-dasharray="6 4"/>')
    g.append(M.trazo(f'M{x + 62} {y + 124} L{x + 148} {y + 140}', '#c8322c',
                     w=2.4, op=.85, halo=False))
    g.append(M.trazo(f'M{x + 148} {y + 124} L{x + 62} {y + 140}', '#c8322c',
                     w=2.4, op=.85, halo=False))
    # dos renglones de nota
    for i in range(2):
        g.append(f'<rect x="{x + 26}" y="{M.r1(y + 18 + i * 8)}" '
                 f'width="{M.r1(96 - i * 30)}" height="2.6" rx="1.3" '
                 f'fill="{k["grafito"]}" opacity=".45"/>')
    g.append('</g>')
    return ''.join(g)


def _cable_pelado():
    """Un trozo de cable pelado, con el cobre trenzado a la vista."""
    g = ['<g transform="rotate(-12 300 396)">',
         M.sombra(248, 390, 108, 10, op=.24, dx=4, dy=6, rx=5, blur='b2'),
         f'<rect x="272" y="390" width="84" height="9" rx="4.5" fill="{ROJO}"/>',
         f'<rect x="272" y="391" width="84" height="2.6" rx="1.3" fill="#e8776a" '
         f'opacity=".75"/>']
    for i in range(6):
        g.append(f'<path d="M272 {M.r1(391 + i * 1.5)} q-12 {M.r2((M.n(i, 3.1) - .5) * 5)} '
                 f'-24 {M.r2((M.n(i, 5.7) - .5) * 4)}" fill="none" stroke="{COBRE}" '
                 f'stroke-width="1.3" opacity=".95"/>')
    g.append('</g>')
    return ''.join(g)


def _pelacables():
    return ('<g transform="rotate(20 132 384)">'
            + M.sombra(60, 374, 142, 20, op=.26, dx=5, dy=8, rx=4, blur='b2')
            + f'<path d="M62 378 L136 374 L138 384 L64 388 Z" fill="url(#{P}_metal)"/>'
            + f'<path d="M62 388 L136 384 L138 392 L64 396 Z" fill="url(#{P}_metal)" '
              f'opacity=".9"/>'
            + f'<circle cx="82" cy="383" r="4" fill="{k["noche"]}" opacity=".5"/>'
            + f'<circle cx="98" cy="382" r="3.2" fill="{k["noche"]}" opacity=".5"/>'
            + f'<circle cx="142" cy="384" r="5" fill="url(#{P}_metal)"/>'
            + f'<path d="M148 380 q30 -6 36 6 q-6 12 -36 6 Z" fill="none" '
              f'stroke="#e0473c" stroke-width="7" stroke-linejoin="round"/>'
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
        + lg(f'{P}_pila', .1, 0, .9, 1,
             [(0, '#4f5a66', None), (.3, '#39434e', None), (1, '#1d242b', None)])
        + lg(f'{P}_base_int', 0, 0, .3, 1,
             [(0, '#e9e2d2', None), (.4, '#d3cab5', None), (1, '#a79d85', None)])
        + rg(f'{P}_vidrio_b', .34, .3, .9,
             [(0, '#ffffff', .55), (.5, '#e2eef5', .3), (1, '#a9c2d2', .35)])
        + rg(f'{P}_halo', .5, .5, .5,
             [(0, LUZ, .85), (.3, LUZ, .4), (.62, LUZ, .13), (1, LUZ, 0)])
        + rg(f'{P}_focosuelo', .5, .5, .5, [(0, '#fff0cf', .4), (1, '#fff0cf', 0)])
    )


def escena():
    defs = _defs()

    c = M.pared(P, MESA + 6, vx=36, vy=6, vw=128, vh=94)
    c += M.banco(P, MESA, juntas=(372,), nudos=((196, 372, 8),))
    c += (f'<ellipse cx="220" cy="210" rx="240" ry="140" fill="url(#{P}_focosuelo)" '
          f'opacity=".42" filter="url(#b22)"/>')

    c += _esquema()

    # ── rama encendida: pila → interruptor cerrado → bombilla ────────────────
    # Cada tramo sale de un borne y llega a otro: la corriente tiene camino, y
    # se puede seguir con el dedo desde la pila hasta el filamento y de vuelta.
    c += _pila(58, 244)
    c += _cable('M84 226 C88 190 116 170 152 168', ROJO)
    c += _interruptor(154, 160, cerrado=True)
    c += _cable('M218 173 C240 180 250 198 254 214', ROJO)
    c += _bombilla(272, 192, encendida=True)
    c += _cable('M289 234 C300 262 282 286 250 294', NEGRO)
    c += _cable('M250 294 C196 304 150 312 124 320', NEGRO)

    # ── rama del zumbador: el interruptor está abierto y no pasa ─────────────
    c += _cable('M120 216 C150 232 170 262 186 288', NEGRO)
    c += _interruptor(188, 286, cerrado=False)
    c += _zumbador(330, 330)
    c += _cable('M252 300 C282 306 302 316 312 326', NEGRO)

    # ── rama sin terminar: la bombilla apagada y la pinza todavía suelta ─────
    c += _bombilla(452, 326, encendida=False)
    c += _cable('M469 368 C486 380 510 384 540 380', ROJO)
    c += _cable('M370 344 C396 356 408 372 412 386', ROJO)
    c += _pinza(416, 390, 64, ROJO, abierta=True)
    # el salto que falta para cerrar: eso es lo que hay que hacer ahora
    c += (f'<path d="M424 380 C430 372 432 368 435 364" fill="none" stroke="{ROJO}" '
          f'stroke-width="1.8" opacity=".55" stroke-dasharray="4 4"/>')

    c += _pinza(96, 226, -74, ROJO)
    c += _pinza(126, 322, 8, NEGRO)
    c += _cable_pelado()
    c += _pelacables()

    c += M.velo(P, MESA - 6, 44, op=.26)
    c += M.vineta(P, .85)
    return svg(c, defs)
