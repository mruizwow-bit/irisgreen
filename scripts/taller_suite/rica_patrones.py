# -*- coding: utf-8 -*-
"""Escena rica de Patrones y arte generativo (R65 · tanda 2).

El puesto de estampar, y al lado la regla que genera el patrón.

Lo que se ve:

* la **plancha tallada**: el motivo en hueco, con la pared del corte y su
  sombra dentro, y la superficie que queda en alto **ya entintada**, brillante;
* la **losa de vidrio** con la tinta extendida y el rodillo encima, con su
  huella de paso y el borde de tinta acumulado;
* el pliego con el motivo **repetido en retícula**: la primera fila completa, la
  segunda a medias y una estampación más pálida porque le faltó tinta. Eso es lo
  que se ve en una mesa de estampar de verdad;
* las líneas de registro a lápiz bajo las estampaciones, para que la repetición
  case;
* la **hoja de la regla**: el mismo motivo en cuatro pasos —tal cual, girado,
  espejado y repetido—, que es de donde sale el patrón. El arte generativo no es
  una imagen bonita: es una regla que se aplica;
* la tira de variaciones: la misma regla con el parámetro cambiado, seis veces,
  y una marcada como la elegida;
* el compás, la regla de acero y la gubia con la viruta de linóleo al lado.

Sin personajes. El motivo es geométrico y propio: una hoja de seis lóbulos
inscrita en un hexágono.
"""
import math

from taller_suite.escenas_ricas import C, W, H, svg, lg, rg
from taller_suite import rica_comun as M

k = C
P = 'pa'

MESA = 140

TINTA = '#1f4f6b'
TINTA_L = '#3d7ea3'


def _motivo(cx, cy, r, *, giro=0, espejo=False, lobulos=6, color=None, op=1.0):
    """El motivo: una flor de pétalos de almendra inscrita en un hexágono.

    Se genera, no se dibuja a mano: cambiar `lobulos` o `giro` da otro patrón con
    la misma regla, que es justo lo que enseña este estudio. La primera versión
    repartía el círculo entero en gajos y salía un parasol; los pétalos separados,
    con hueco entre ellos y un rombo en el hueco, es lo que de verdad se talla en
    una plancha.
    """
    col = color or TINTA
    e = -1 if espejo else 1
    partes = []
    paso = 360.0 / lobulos
    # el hexágono de encaje, muy tenue: la celda que se repite
    hexa = ' '.join(
        f'{M.r1(cx + r * math.cos(math.radians(giro + 60 * i)) * e)},'
        f'{M.r1(cy + r * math.sin(math.radians(giro + 60 * i)))}'
        for i in range(6))
    partes.append(f'<polygon points="{hexa}" fill="none" stroke="{col}" '
                  f'stroke-width="{M.r2(r * .05)}" opacity="{M.r2(op * .3)}"/>')
    for i in range(lobulos):
        a = math.radians(giro + paso * i)
        an = math.radians(paso * .34)
        # punta del pétalo
        tx = cx + r * .94 * math.cos(a) * e
        ty = cy + r * .94 * math.sin(a)
        # los dos hombros, que dan la forma de almendra
        h1x = cx + r * .52 * math.cos(a - an) * e
        h1y = cy + r * .52 * math.sin(a - an)
        h2x = cx + r * .52 * math.cos(a + an) * e
        h2y = cy + r * .52 * math.sin(a + an)
        partes.append(
            f'<path d="M{M.r1(cx)} {M.r1(cy)} Q{M.r1(h1x)} {M.r1(h1y)} '
            f'{M.r1(tx)} {M.r1(ty)} Q{M.r1(h2x)} {M.r1(h2y)} {M.r1(cx)} {M.r1(cy)} Z" '
            f'fill="{col}" opacity="{M.r2(op)}"/>')
        # el nervio del pétalo, reservado en blanco
        partes.append(
            f'<path d="M{M.r1(cx + r * .2 * math.cos(a) * e)} '
            f'{M.r1(cy + r * .2 * math.sin(a))} L{M.r1(cx + r * .74 * math.cos(a) * e)} '
            f'{M.r1(cy + r * .74 * math.sin(a))}" stroke="#ffffff" '
            f'stroke-width="{M.r2(r * .07)}" opacity="{M.r2(op * .55)}" '
            f'stroke-linecap="round"/>')
        # el rombo en el hueco entre dos pétalos
        am = a + math.radians(paso * .5)
        mx = cx + r * .66 * math.cos(am) * e
        my = cy + r * .66 * math.sin(am)
        d = r * .12
        partes.append(f'<polygon points="{M.r1(mx)},{M.r1(my - d)} {M.r1(mx + d)},'
                      f'{M.r1(my)} {M.r1(mx)},{M.r1(my + d)} {M.r1(mx - d)},{M.r1(my)}" '
                      f'fill="{col}" opacity="{M.r2(op * .85)}"/>')
    # el corazón: anillo reservado, no un punto blanco suelto
    partes.append(f'<circle cx="{M.r1(cx)}" cy="{M.r1(cy)}" r="{M.r1(r * .26)}" '
                  f'fill="{col}" opacity="{M.r2(op)}"/>')
    partes.append(f'<circle cx="{M.r1(cx)}" cy="{M.r1(cy)}" r="{M.r1(r * .17)}" '
                  f'fill="none" stroke="#ffffff" stroke-width="{M.r2(r * .07)}" '
                  f'opacity="{M.r2(op * .75)}"/>')
    return ''.join(partes)


def _plancha():
    """La plancha de linóleo tallada: hueco con pared de corte, alto entintado."""
    x, y, w, h = 44, 236, 168, 138
    g = [M.sombra(x, y, w, h, op=.36, dx=11, dy=14, rx=3),
         f'<g transform="rotate(-5 {x + w / 2} {y + h / 2})">',
         # el canto de la plancha: tiene espesor
         f'<rect x="{x}" y="{y + 8}" width="{w}" height="{h}" rx="3" fill="#6d5233"/>',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" fill="url(#{P}_lino)"/>']
    # el motivo tallado en hueco: primero el fondo rebajado
    g.append(f'<g clip-path="url(#{P}_cp_plancha)">')
    g.append(_motivo(x + w / 2, y + h / 2, 56, color='#7d5f3d', op=1))
    # la pared del corte, con su sombra dentro
    g.append(f'<g opacity=".55" filter="url(#b2)">')
    g.append(_motivo(x + w / 2 - 2.5, y + h / 2 - 2.5, 56, color=k['noche'], op=.9))
    g.append('</g>')
    g.append(_motivo(x + w / 2, y + h / 2, 53, color='#8f6e47', op=1))
    g.append('</g>')
    # la superficie en alto, ya entintada: brillo húmedo
    g.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" fill="{TINTA}" '
             f'opacity=".82" mask="url(#{P}_mask_alto)"/>')
    g.append(f'<rect x="{x + 6}" y="{y + 5}" width="{w - 12}" height="16" rx="8" '
             f'fill="#ffffff" opacity=".18" filter="url(#b5)"/>')
    g.append(M.brillo_borde(f'M{x + 4} {y + 1.5} h{w - 8}', w=1.6, op=.4))
    g.append('</g>')
    return ''.join(g)


def _losa():
    """La losa de vidrio con la tinta extendida y el rodillo."""
    x, y, w, h = 202, 226, 150, 92
    g = [M.sombra(x, y, w, h, op=.3, dx=9, dy=12, rx=2),
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" '
         f'fill="url(#{P}_losa)"/>']
    # la tinta extendida, con la textura de los pases del rodillo
    g.append(f'<g clip-path="url(#{P}_cp_losa)">')
    g.append(f'<rect x="{x + 8}" y="{y + 10}" width="{w - 22}" height="{h - 26}" '
             f'rx="6" fill="{TINTA}" opacity=".92"/>')
    for i in range(14):
        yy = y + 14 + i * 4.8
        g.append(f'<path d="M{M.r1(x + 10 + M.n(i, 3.1) * 14)} {M.r1(yy)} '
                 f'h{M.r1(w - 40 - M.n(i, 5.7) * 26)}" stroke="#ffffff" '
                 f'stroke-width="{M.r2(.8 + M.n(i, 7.3) * 1.4)}" '
                 f'opacity="{M.r2(.05 + M.n(i, 9.1) * .11)}"/>')
    # el borde de tinta acumulado donde el rodillo da la vuelta
    g.append(f'<path d="M{x + 10} {y + h - 18} h{w - 26}" stroke="{k["noche"]}" '
             f'stroke-width="5" opacity=".3" filter="url(#b2)"/>')
    g.append('</g>')
    g.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="none" '
             f'stroke="#e8f2f8" stroke-width="2" opacity=".7"/>')
    # el rodillo, apoyado a medio pase
    rx0, ry0 = x + 82, y + 32
    g.append(M.sombra(rx0 - 44, ry0 + 12, 90, 28, op=.3, dx=5, dy=8, rx=14, sesgo=-.12))
    # el cilindro, con sus dos tapas: sin ellas se lee como una pastilla
    g.append(f'<rect x="{rx0 - 38}" y="{ry0 - 2}" width="76" height="32" '
             f'fill="url(#{P}_rodillo)"/>')
    g.append(f'<rect x="{rx0 - 38}" y="{ry0 - 2}" width="76" height="32" '
             f'fill="{TINTA}" opacity=".6"/>')
    g.append(f'<ellipse cx="{rx0 - 38}" cy="{ry0 + 14}" rx="9" ry="16" '
             f'fill="#26323d"/>')
    g.append(f'<ellipse cx="{rx0 + 38}" cy="{ry0 + 14}" rx="9" ry="16" '
             f'fill="url(#{P}_rodillo)"/>')
    g.append(f'<ellipse cx="{rx0 + 38}" cy="{ry0 + 14}" rx="9" ry="16" '
             f'fill="{TINTA}" opacity=".45"/>')
    g.append(f'<ellipse cx="{rx0 + 38}" cy="{ry0 + 14}" rx="3.4" ry="5" '
             f'fill="url(#{P}_metal)"/>')
    g.append(f'<rect x="{rx0 - 34}" y="{ry0 + 1}" width="68" height="7" rx="3.5" '
             f'fill="#ffffff" opacity=".28" filter="url(#b2)"/>')
    # el bastidor en horquilla y el mango, que es lo que dice que es un rodillo
    g.append(f'<path d="M{rx0 - 38} {ry0 + 14} L{rx0 - 4} {ry0 - 24} '
             f'M{rx0 + 38} {ry0 + 14} L{rx0 + 4} {ry0 - 24}" stroke="url(#{P}_metal)" '
             f'stroke-width="5" stroke-linecap="round" fill="none"/>')
    g.append(f'<path d="M{rx0} {ry0 - 22} L{rx0} {ry0 - 52}" stroke="url(#{P}_metal)" '
             f'stroke-width="6" stroke-linecap="round"/>')
    g.append(f'<rect x="{rx0 - 9}" y="{ry0 - 78}" width="19" height="34" rx="9" '
             f'fill="#7b4a2c"/>')
    g.append(f'<rect x="{rx0 - 6}" y="{ry0 - 75}" width="5" height="28" rx="2.5" '
             f'fill="#b9714f" opacity=".75"/>')
    return ''.join(g)


def _pliego():
    """El pliego con el patrón estampado: una fila entera, otra a medias."""
    x, y, w, h = 360, 112, 266, 216
    d = f'M{x} {y + 8} L{x + w - 6} {y} L{x + w} {y + h - 8} L{x + 6} {y + h} Z'
    g = [M.sombra(x, y, w, h, op=.3, dx=9, dy=12, rx=2),
         f'<path d="{d}" fill="url(#{P}_pliego)"/>',
         f'<path d="{d}" fill="none" stroke="#b5ac9b" stroke-width="1" opacity=".8"/>',
         f'<g clip-path="url(#{P}_cp_pliego)">']
    # las líneas de registro a lápiz: es lo que hace que la repetición case
    for i in range(6):
        g.append(M.guia(f'M{M.r1(x + 14 + i * 50)} {y + 4} l6 {h - 8}', '#7fa8c8',
                        w=.8, op=.55, s=i * 3 + 1))
    for j in range(5):
        g.append(M.guia(f'M{x + 4} {M.r1(y + 20 + j * 46)} l{w - 8} -7', '#7fa8c8',
                        w=.8, op=.55, s=j * 5 + 2))
    # las estampaciones
    for j in range(4):
        for i in range(5):
            cx = x + 40 + i * 50 + (25 if j % 2 else 0)
            cy = y + 44 + j * 46 - (i * 1.6)
            if j == 2 and i > 2:
                continue                      # la fila va por la mitad
            if j == 3:
                continue
            op = .5 if (j == 1 and i == 3) else .95      # a esta le faltó tinta
            g.append(_motivo(cx, cy, 21, giro=(15 if j % 2 else 0),
                             espejo=(j == 1), op=op))
            # el grano de la estampación: la tinta no cubre parejo
            g.append(f'<circle cx="{M.r1(cx + 4)}" cy="{M.r1(cy - 5)}" r="7" '
                     f'fill="#ffffff" opacity="{M.r2(.1 + M.n(i * 4 + j, 3.3) * .12)}" '
                     f'filter="url(#b2)"/>')
    # la siguiente, marcada a lápiz pero sin estampar
    cx, cy = x + 190, y + 136
    g.append(f'<circle cx="{M.r1(cx)}" cy="{M.r1(cy)}" r="21" fill="none" '
             f'stroke="{k["grafito"]}" stroke-width="1" stroke-dasharray="4 3" '
             f'opacity=".5"/>')
    g.append('</g>')
    return ''.join(g)


def _regla():
    """La hoja de la regla: motivo, girado, espejado y repetido."""
    x, y, w, h = 176, 96, 150, 104
    g = [M.sombra(x, y, w, h, op=.24, dx=5, dy=7, rx=2),
         f'<g transform="rotate(-3 {x + w / 2} {y + h / 2})">',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" '
         f'fill="url(#{P}_pliego)"/>',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="none" '
         f'stroke="#b5ac9b" stroke-width=".8" opacity=".8"/>']
    pasos = ((0, False, 1), (30, False, 1), (30, True, 1), (0, False, 4))
    for i, (giro, esp, n) in enumerate(pasos):
        cx = x + 24 + (i % 2) * 74
        cy = y + 28 + (i // 2) * 50
        if n == 1:
            g.append(_motivo(cx, cy, 16, giro=giro, espejo=esp, op=.9))
        else:
            for j in range(4):
                g.append(_motivo(cx - 8 + (j % 2) * 17, cy - 8 + (j // 2) * 17, 8,
                                 giro=30 * (j % 2), espejo=(j > 1), op=.85))
        # la flecha al paso siguiente
        if i < 3:
            fx = cx + 26
            fy = cy
            if i == 1:
                fx, fy = x + 74, y + 54
            g.append(f'<path d="M{M.r1(fx)} {M.r1(fy)} l16 0 m-5 -4 l5 4 l-5 4" '
                     f'fill="none" stroke="{k["grafito"]}" stroke-width="1.2" '
                     f'opacity=".55" stroke-linecap="round"/>')
    g.append('</g>')
    return ''.join(g)


def _variaciones():
    """La tira de variaciones: la misma regla con el parámetro cambiado."""
    x, y = 336, 344
    g = [M.sombra(x, y, 262, 48, op=.24, dx=5, dy=7, rx=2),
         f'<g transform="rotate(3 {x + 131} {y + 24})">',
         f'<rect x="{x}" y="{y}" width="{262}" height="48" rx="2" '
         f'fill="url(#{P}_pliego)"/>']
    for i in range(6):
        cx = x + 24 + i * 43
        g.append(_motivo(cx, y + 24, 15, giro=i * 12, lobulos=3 + i, op=.85))
    # la elegida, rodeada a lápiz
    g.append(f'<rect x="{x + 111}" y="{y + 5}" width="38" height="38" rx="8" '
             f'fill="none" stroke="#c8322c" stroke-width="1.8" opacity=".8"/>')
    g.append('</g>')
    return ''.join(g)


def _gubia():
    """La gubia y la viruta de linóleo que acaba de salir del corte."""
    g = ['<g transform="rotate(-16 150 396)">',
         M.sombra(66, 388, 150, 13, op=.28, dx=4, dy=6, rx=6, sesgo=-.1),
         f'<rect x="96" y="388" width="112" height="13" rx="6" fill="#8a5a33"/>',
         f'<rect x="96" y="389" width="112" height="3.6" rx="1.8" fill="#c08a58" '
         f'opacity=".8"/>',
         f'<rect x="80" y="389" width="20" height="11" rx="2" fill="url(#{P}_metal)"/>',
         f'<path d="M66 391 L84 390 L84 399 L66 398 Z" fill="url(#{P}_metal)"/>',
         M.brillo_borde('M67 392 L83 391.2', w=1.4, op=.9),
         '</g>']
    # la viruta: una cinta enrollada
    g.append(f'<path d="M228 380 q12 -14 26 -6 q12 7 4 18 q-9 12 -22 6 q-11 -6 -8 -18 Z" '
             f'fill="#a07a4e"/>')
    g.append(f'<path d="M234 378 q10 -9 20 -3" fill="none" stroke="#d3b183" '
             f'stroke-width="2.4" opacity=".7"/>')
    g.append(M.contacto(226, 400, 36, op=.3, alto=4))
    return ''.join(g)


def escena():
    defs = (
        M.defs_taller(P, tabla=('#c6a476', '#a4804f', '#7d5b35', '#523b22'))
        + M.defs_papel(P)
        + M.defs_metal(P)
        + lg(f'{P}_lino', .1, 0, .85, 1,
             [(0, '#c69a62', None), (.32, '#ab8250', None), (1, '#87643c', None)])
        + lg(f'{P}_losa', 0, 0, .7, 1,
             [(0, '#e8f1f6', None), (.4, '#cfdde6', None), (1, '#adbfcb', None)])
        + lg(f'{P}_rodillo', 0, 0, 0, 1,
             [(0, '#5b6a78', None), (.4, '#3d4b58', None), (1, '#212c37', None)])
        + rg(f'{P}_focosuelo', .5, .5, .5, [(0, '#fff0cf', .5), (1, '#fff0cf', 0)])
        + M.clip_rect(f'{P}_cp_plancha', 44, 236, 168, 138, 3)
        + M.clip_rect(f'{P}_cp_losa', 202, 226, 150, 92, 2)
        + M.clip(f'{P}_cp_pliego',
                 'M360 120 L628 112 L626 320 L366 328 Z')
        # la máscara que deja entintada solo la superficie en alto de la plancha
        + (f'<mask id="{P}_mask_alto">'
           f'<rect x="44" y="236" width="168" height="138" rx="3" fill="#ffffff"/>'
           + _motivo(128, 305, 56, color='#000000', op=1)
           + '</mask>')
    )

    c = M.pared(P, MESA + 6, vx=30, vy=12, vw=132, vh=100)
    c += M.banco(P, MESA, juntas=(228, 486), nudos=((300, 372, 8),))
    c += (f'<ellipse cx="210" cy="240" rx="240" ry="140" fill="url(#{P}_focosuelo)" '
          f'opacity=".48" filter="url(#b22)"/>')

    c += _regla()
    c += _pliego()
    c += _losa()
    c += _plancha()
    c += _variaciones()
    c += _gubia()

    c += M.velo(P, MESA - 6, 52, op=.32)
    c += M.vineta(P, .85)
    return svg(c, defs)
