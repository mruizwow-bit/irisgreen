# -*- coding: utf-8 -*-
"""Escena rica de Robótica (R65 · tanda 6).

El robot a medio montar sobre la mesa, con su recorrido ya medido en papel.

Nada de mascotas: un robot no es un muñeco con cara. Lo que se enseña es el
chasis, lo que lleva dentro y **la prueba que ya se ha hecho**.

Lo que se ve:

* el **chasis** de metacrilato con sus taladros y su canto translúcido, apoyado
  sobre sus dos motores;
* los **motores** amarillos con su reductora y su eje, uno con la **rueda
  puesta** —neumático con dibujo y llanta con radios— y el otro **sin rueda**,
  con el eje desnudo y la rueda, los tornillos y la llave allanadera al lado. Se
  ve qué falta por montar;
* la **rueda loca** delantera, una bola en su cazoleta;
* la **placa controladora** con sus tiras de pines, su chip, sus condensadores y
  su piloto encendido, sujeta con separadores;
* el **sensor de distancia** montado al frente, con sus dos cápsulas y su rejilla,
  y el **cono de detección** apuntando hacia adelante, apenas insinuado;
* el **portapilas** con las pilas dentro y su cable de dos hilos trenzado;
* los cables de la placa a los motores, con su brida sujetándolos;
* la **hoja de la pista**: la línea negra que el robot sigue, dibujada con sus
  curvas, y **encima, en rojo, el recorrido que hizo de verdad**, que se sale en
  las curvas cerradas. Ahí está el trabajo: corregir eso;
* el destornillador y los tornillos que han ido saliendo.
"""
import math

from taller_suite.escenas_ricas import C, W, H, svg, lg, rg
from taller_suite import rica_comun as M

k = C
P = 'rb'

MESA = 124

AMARILLO = '#e8b422'
PLACA = '#1d5a4a'


def _rueda(cx, cy, r, *, giro=0):
    """Una rueda: neumático con dibujo y llanta con radios."""
    g = [f'<ellipse cx="{M.r1(cx + 3)}" cy="{M.r1(cy + 6)}" rx="{M.r1(r)}" '
         f'ry="{M.r1(r)}" fill="{k["noche"]}" opacity=".3" filter="url(#b2)"/>',
         f'<circle cx="{M.r1(cx)}" cy="{M.r1(cy)}" r="{M.r1(r)}" '
         f'fill="url(#{P}_neumatico)"/>']
    # el dibujo del neumático
    for i in range(16):
        a = math.radians(giro + i * 22.5)
        g.append(f'<path d="M{M.r1(cx + r * .82 * math.cos(a))} '
                 f'{M.r1(cy + r * .82 * math.sin(a))} '
                 f'L{M.r1(cx + r * .99 * math.cos(a + .1))} '
                 f'{M.r1(cy + r * .99 * math.sin(a + .1))}" stroke="{k["noche"]}" '
                 f'stroke-width="2.4" opacity=".55" stroke-linecap="round"/>')
    g.append(f'<circle cx="{M.r1(cx)}" cy="{M.r1(cy)}" r="{M.r1(r * .62)}" '
             f'fill="url(#{P}_llanta)"/>')
    for i in range(6):
        a = math.radians(giro + i * 60)
        g.append(f'<path d="M{M.r1(cx + r * .16 * math.cos(a))} '
                 f'{M.r1(cy + r * .16 * math.sin(a))} '
                 f'L{M.r1(cx + r * .56 * math.cos(a))} '
                 f'{M.r1(cy + r * .56 * math.sin(a))}" stroke="#8d97a1" '
                 f'stroke-width="4" opacity=".9" stroke-linecap="round"/>')
    g.append(f'<circle cx="{M.r1(cx)}" cy="{M.r1(cy)}" r="{M.r1(r * .17)}" '
             f'fill="url(#{P}_metal)"/>')
    g.append(f'<path d="M{M.r1(cx - r * .7)} {M.r1(cy - r * .5)} '
             f'A{M.r1(r)} {M.r1(r)} 0 0 1 {M.r1(cx + r * .2)} {M.r1(cy - r * .95)}" '
             f'fill="none" stroke="#ffffff" stroke-width="{M.r1(r * .12)}" '
             f'opacity=".2"/>')
    return ''.join(g)


def _motor(x, y, *, con_rueda):
    """Un motor amarillo con su reductora y su eje."""
    g = [M.sombra(x, y, 86, 34, op=.3, dx=7, dy=10, rx=4, sesgo=-.18),
         f'<rect x="{x}" y="{y}" width="60" height="34" rx="4" '
         f'fill="url(#{P}_motor)"/>',
         f'<rect x="{x}" y="{y}" width="60" height="7" rx="3.5" fill="#ffffff" '
         f'opacity=".28"/>',
         # el cuerpo cilíndrico del motor
         f'<rect x="{x + 58}" y="{y + 6}" width="28" height="22" rx="10" '
         f'fill="url(#{P}_metal)"/>',
         f'<rect x="{x + 58}" y="{y + 8}" width="28" height="5" rx="2.5" '
         f'fill="#ffffff" opacity=".4"/>']
    # los tornillos de la reductora
    for dx, dy in ((7, 7), (7, 25), (50, 7), (50, 25)):
        g.append(f'<circle cx="{M.r1(x + dx)}" cy="{M.r1(y + dy)}" r="2.6" '
                 f'fill="#8a6c15"/>')
    # el eje
    g.append(f'<rect x="{x - 14}" y="{y + 14}" width="18" height="7" rx="2" '
             f'fill="url(#{P}_metal)"/>')
    if not con_rueda:
        g.append(f'<rect x="{x - 20}" y="{y + 15}" width="8" height="5" rx="1.4" '
                 f'fill="#9aa4ae"/>')
    return ''.join(g)


def _placa(x, y):
    """La placa controladora: pines, chip, condensadores y piloto."""
    g = [M.sombra(x, y, 116, 76, op=.3, dx=7, dy=10, rx=3, blur='b2'),
         # los separadores que la levantan del chasis
         f'<rect x="{x + 6}" y="{y + 70}" width="7" height="14" rx="2" fill="#5b6773"/>',
         f'<rect x="{x + 102}" y="{y + 70}" width="7" height="14" rx="2" fill="#5b6773"/>',
         f'<rect x="{x}" y="{y}" width="116" height="76" rx="4" fill="{PLACA}"/>',
         f'<rect x="{x}" y="{y}" width="116" height="76" rx="4" fill="none" '
         f'stroke="#0d3329" stroke-width="1.2"/>',
         f'<rect x="{x}" y="{y}" width="116" height="7" rx="3.5" fill="#ffffff" '
         f'opacity=".14"/>']
    # las pistas del circuito
    for i in range(9):
        y0 = y + 12 + i * 7
        g.append(f'<path d="M{M.r1(x + 8)} {M.r1(y0)} h{M.r1(36 + M.n(i, 3.1) * 40)} '
                 f'l8 8" fill="none" stroke="#2f8f6e" stroke-width="1.1" '
                 f'opacity=".5"/>')
    # las tiras de pines
    for fila, y0 in ((0, y + 4), (1, y + 66)):
        for i in range(14):
            g.append(f'<rect x="{M.r1(x + 7 + i * 7.6)}" y="{M.r1(y0)}" width="4.6" '
                     f'height="6" rx="1" fill="url(#{P}_metal)"/>')
            g.append(f'<rect x="{M.r1(x + 7 + i * 7.6)}" y="{M.r1(y0)}" width="4.6" '
                     f'height="2" fill="#ffffff" opacity=".4"/>')
    # el chip
    g.append(f'<rect x="{x + 38}" y="{y + 28}" width="42" height="24" rx="2" '
             f'fill="#1a1f25"/>')
    g.append(f'<rect x="{x + 38}" y="{y + 28}" width="42" height="7" rx="2" '
             f'fill="#ffffff" opacity=".1"/>')
    g.append(f'<circle cx="{x + 44}" cy="{y + 46}" r="2.4" fill="#3c454e"/>')
    for i in range(7):
        g.append(f'<rect x="{M.r1(x + 41 + i * 5.6)}" y="{y + 24}" width="2.6" '
                 f'height="5" fill="#b9c2ca"/>')
        g.append(f'<rect x="{M.r1(x + 41 + i * 5.6)}" y="{y + 51}" width="2.6" '
                 f'height="5" fill="#b9c2ca"/>')
    # dos condensadores
    for dx in (18, 96):
        g.append(f'<ellipse cx="{M.r1(x + dx)}" cy="{y + 40}" rx="9" ry="9" '
                 f'fill="#26323d"/>')
        g.append(f'<ellipse cx="{M.r1(x + dx)}" cy="{y + 38}" rx="9" ry="9" '
                 f'fill="#3b4a58"/>')
        g.append(f'<path d="M{M.r1(x + dx - 6)} {y + 34} a7 7 0 0 1 8 -2" '
                 f'fill="none" stroke="#ffffff" stroke-width="1.6" opacity=".3"/>')
    # el piloto encendido
    g.append(f'<circle cx="{x + 96}" cy="{y + 62}" r="3.2" fill="#7dfaa8"/>')
    g.append(f'<circle cx="{x + 96}" cy="{y + 62}" r="7.4" fill="#7dfaa8" '
             f'opacity=".35" filter="url(#b2)"/>')
    return ''.join(g)


def _sensor(cx, cy):
    """El sensor de distancia: dos cápsulas, su rejilla y el cono de detección."""
    g = [f'<path d="M{cx - 60} {cy + 6} L{cx + 60} {cy + 6} L{cx + 108} {cy - 84} '
         f'L{cx - 108} {cy - 84} Z" fill="url(#{P}_cono)" opacity=".3"/>',
         M.sombra(cx - 30, cy - 14, 60, 28, op=.28, dx=5, dy=8, rx=3, blur='b2'),
         f'<rect x="{cx - 30}" y="{cy - 14}" width="60" height="28" rx="3" '
         f'fill="#123f52"/>',
         f'<rect x="{cx - 30}" y="{cy - 14}" width="60" height="6" rx="3" '
         f'fill="#ffffff" opacity=".14"/>']
    for dx in (-14, 14):
        g.append(f'<circle cx="{M.r1(cx + dx)}" cy="{cy}" r="11" '
                 f'fill="url(#{P}_metal)"/>')
        g.append(f'<circle cx="{M.r1(cx + dx)}" cy="{cy}" r="8.4" fill="#1a222a"/>')
        for i in range(4):
            g.append(f'<circle cx="{M.r1(cx + dx)}" cy="{cy}" r="{M.r1(2 + i * 2)}" '
                     f'fill="none" stroke="#4b5763" stroke-width=".9" opacity=".7"/>')
        g.append(f'<circle cx="{M.r1(cx + dx - 3)}" cy="{cy - 3.4}" r="2.4" '
                 f'fill="#ffffff" opacity=".22"/>')
    return ''.join(g)


def _robot():
    """El robot a medio montar."""
    g = []
    bx, by = 128, 198
    # las ruedas traseras: una puesta, el eje de la otra desnudo
    g.append(_rueda(bx + 6, by + 96, 34, giro=12))
    g.append(_motor(bx + 34, by + 78, con_rueda=True))
    g.append(_motor(bx + 34, by + 26, con_rueda=False))
    # la rueda loca delantera
    g.append(f'<path d="M{bx + 214} {by + 58} h26 v18 h-26 Z" fill="#8d97a1"/>')
    g.append(f'<circle cx="{bx + 232}" cy="{by + 84}" r="14" fill="url(#{P}_bola)"/>')
    g.append(f'<ellipse cx="{bx + 227}" cy="{by + 78}" rx="5" ry="3.6" '
             f'fill="#ffffff" opacity=".6" filter="url(#b2)" '
             f'transform="rotate(-30 {bx + 227} {by + 78})"/>')
    g.append(M.contacto(bx + 218, by + 98, 28, op=.4, alto=4))
    # el chasis de metacrilato
    chasis = (f'M{bx} {by + 34} L{bx + 214} {by + 14} L{bx + 240} {by + 60} '
              f'L{bx + 214} {by + 88} L{bx + 10} {by + 76} Z')
    g.append(M.sombra(bx, by + 14, 240, 76, op=.3, dx=9, dy=12, rx=6, sesgo=-.24))
    g.append(f'<path d="{chasis}" fill="url(#{P}_metacrilato)"/>')
    g.append(f'<path d="{chasis}" fill="none" stroke="#9fc4d8" stroke-width="2" '
             f'opacity=".85"/>')
    # los taladros del chasis
    for i in range(12):
        cx0 = bx + 22 + (i % 6) * 34
        cy0 = by + 34 + (i // 6) * 26 - (i % 6) * 2.4
        g.append(f'<circle cx="{M.r1(cx0)}" cy="{M.r1(cy0)}" r="3.4" fill="#6f8fa4" '
                 f'opacity=".55"/>')
        g.append(f'<circle cx="{M.r1(cx0 - .6)}" cy="{M.r1(cy0 - .8)}" r="2.6" '
                 f'fill="{k["noche"]}" opacity=".3"/>')
    # el portapilas
    g.append(f'<rect x="{bx + 18}" y="{by + 20}" width="74" height="30" rx="3" '
             f'fill="#2b333c" transform="rotate(-5 {bx + 55} {by + 35})"/>')
    g.append(f'<rect x="{bx + 18}" y="{by + 20}" width="74" height="7" rx="3" '
             f'fill="#ffffff" opacity=".12" transform="rotate(-5 {bx + 55} {by + 35})"/>')
    for i in range(3):
        g.append(f'<rect x="{M.r1(bx + 24 + i * 22)}" y="{by + 26}" width="18" '
                 f'height="18" rx="2" fill="#4a5560" '
                 f'transform="rotate(-5 {bx + 55} {by + 35})"/>')
    # la placa, encima
    g.append(_placa(bx + 104, by + 8))
    # el sensor, al frente
    g.append(_sensor(bx + 240, by + 46))
    # los cables de la placa a los motores, con su brida
    for i, col in enumerate(('#e0473c', '#1d242b', '#f0b419')):
        d = (f'M{bx + 112 + i * 5} {by + 84} C{bx + 92} {by + 104} '
             f'{bx + 70} {by + 96 + i * 4} {bx + 48} {by + 88 + i * 5}')
        g.append(f'<path d="{d}" fill="none" stroke="{col}" stroke-width="3.4" '
                 f'stroke-linecap="round"/>')
    g.append(f'<rect x="{bx + 74}" y="{by + 90}" width="9" height="20" rx="2" '
             f'fill="#e8e2d4" opacity=".9" transform="rotate(-18 {bx + 78} {by + 100})"/>')
    return ''.join(g)


def _rueda_suelta():
    """La rueda que falta por montar, con sus tornillos y la llave."""
    g = [_rueda(104, 356, 30, giro=40)]
    for i, (x, y) in enumerate(((168, 372), (186, 356), (156, 346))):
        g.append(f'<g transform="rotate({M.r1(M.n(i, 3.1) * 180)} {x} {y})">'
                 f'<rect x="{x - 9}" y="{y - 2}" width="15" height="4" rx="1" '
                 f'fill="#b9c2ca"/>'
                 f'<circle cx="{x + 8}" cy="{y}" r="4" fill="#cdd5dc"/>'
                 f'<path d="M{x + 6} {y} h4" stroke="{k["noche"]}" stroke-width="1.2" '
                 f'opacity=".5"/></g>')
    # la llave allen
    g.append('<g transform="rotate(-24 232 366)">')
    g.append(M.sombra(204, 360, 62, 8, op=.24, dx=3, dy=5, rx=3, blur='b2'))
    g.append(f'<path d="M204 362 h56 v7 h-56 Z" fill="url(#{P}_metal)"/>')
    g.append(f'<path d="M258 362 v-22 h7 v22 Z" fill="url(#{P}_metal)"/>')
    g.append('</g>')
    return ''.join(g)


def _pista():
    """La hoja de la pista: la línea a seguir y el recorrido que hizo de verdad."""
    x, y, w, h = 348, 216, 254, 142
    g = [M.sombra(x, y, w, h, op=.28, dx=7, dy=10, rx=2),
         f'<g transform="rotate(4 {x + w / 2} {y + h / 2})">',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" '
         f'fill="url(#{P}_pliego)"/>',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="none" '
         f'stroke="#b5ac9b" stroke-width=".8" opacity=".8"/>']
    # la línea negra que hay que seguir
    linea = (f'M{x + 24} {y + 110} C{x + 44} {y + 40} {x + 96} {y + 26} '
             f'{x + 128} {y + 62} C{x + 156} {y + 94} {x + 148} {y + 122} '
             f'{x + 180} {y + 120} C{x + 214} {y + 118} {x + 222} {y + 60} '
             f'{x + 238} {y + 38}')
    g.append(f'<path d="{linea}" fill="none" stroke="{k["tinta"]}" stroke-width="9" '
             f'opacity=".9" stroke-linecap="round"/>')
    g.append(f'<path d="{linea}" fill="none" stroke="#ffffff" stroke-width="1.4" '
             f'opacity=".12" transform="translate(0 -3)"/>')
    # el recorrido de verdad: encima, y se sale en las curvas cerradas
    real = (f'M{x + 26} {y + 108} C{x + 50} {y + 36} {x + 104} {y + 20} '
            f'{x + 136} {y + 58} C{x + 166} {y + 98} {x + 144} {y + 134} '
            f'{x + 182} {y + 128} C{x + 220} {y + 122} {x + 214} {y + 54} '
            f'{x + 236} {y + 34}')
    g.append(f'<path d="{real}" fill="none" stroke="#c8322c" stroke-width="2.4" '
             f'opacity=".9" stroke-dasharray="9 5" stroke-linecap="round"/>')
    # los dos puntos donde más se sale, rodeados
    for cx0, cy0 in ((x + 140, y + 62), (x + 178, y + 128)):
        g.append(f'<circle cx="{M.r1(cx0)}" cy="{M.r1(cy0)}" r="14" fill="none" '
                 f'stroke="#c8322c" stroke-width="1.6" opacity=".7" '
                 f'stroke-dasharray="6 4"/>')
    # las notas del margen
    for i in range(3):
        g.append(f'<rect x="{x + 176}" y="{M.r1(y + 14 + i * 9)}" '
                 f'width="{M.r1(66 - i * 18)}" height="2.6" rx="1.3" '
                 f'fill="{k["grafito"]}" opacity=".5"/>')
    g.append('</g>')
    return ''.join(g)


def _destornillador():
    return ('<g transform="rotate(16 356 396)">'
            + M.sombra(288, 388, 150, 16, op=.26, dx=4, dy=7, rx=7, blur='b2')
            + f'<rect x="326" y="386" width="86" height="19" rx="9" fill="#c0392b"/>'
            + f'<rect x="326" y="388" width="86" height="5" rx="2.5" fill="#e8776a" '
              f'opacity=".8"/>'
            + f'<rect x="288" y="392" width="44" height="7" rx="2" '
              f'fill="url(#{P}_metal)"/>'
            + f'<path d="M282 392 h8 v7 h-8 Z" fill="#9aa4ae"/>'
            + '</g>')


def escena():
    defs = (
        M.defs_taller(P, tabla=('#b1906a', '#8f7043', '#6a4e2e', '#43301a'))
        + M.defs_papel(P)
        + M.defs_metal(P)
        + lg(f'{P}_motor', 0, 0, .3, 1,
             [(0, '#ffdc7a', None), (.35, AMARILLO, None), (1, '#a37c0d', None)])
        + lg(f'{P}_metacrilato', 0, 0, .6, 1,
             [(0, '#eaf6fb', .62), (.4, '#cfe6f0', .48), (1, '#a8c9db', .5)])
        + rg(f'{P}_neumatico', .34, .3, .95,
             [(0, '#4a535c', None), (.55, '#2b323a', None), (1, '#12171c', None)])
        + rg(f'{P}_llanta', .34, .3, .9,
             [(0, '#e4eaef', None), (.5, '#b4bec7', None), (1, '#717c87', None)])
        + rg(f'{P}_bola', .34, .3, .88,
             [(0, '#eef4f8', None), (.45, '#a9b6c1', None), (1, '#525d68', None)])
        + lg(f'{P}_cono', 0, 0, 0, 1,
             [(0, '#7fd4e8', 0), (1, '#7fd4e8', .5)])
        + rg(f'{P}_focosuelo', .5, .5, .5, [(0, '#fff0cf', .44), (1, '#fff0cf', 0)])
    )

    c = M.pared(P, MESA + 6, vx=36, vy=6, vw=130, vh=94)
    c += M.banco(P, MESA, juntas=(330,), nudos=((284, 388, 8),))
    c += (f'<ellipse cx="230" cy="216" rx="250" ry="140" fill="url(#{P}_focosuelo)" '
          f'opacity=".44" filter="url(#b22)"/>')

    c += _pista()
    c += _robot()
    c += _rueda_suelta()
    c += _destornillador()

    c += M.velo(P, MESA - 6, 44, op=.26)
    c += M.vineta(P, .85)
    return svg(c, defs)
