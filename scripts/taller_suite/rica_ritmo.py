# -*- coding: utf-8 -*-
"""Escena rica de Ritmo y secuenciador (R65 · tanda 5).

La caja de ritmos como **aparato**, no como interfaz en una pantalla.

Lo que se ve:

* el **secuenciador de dieciséis pasos**, una caja real con su chasis metálico,
  su canto biselado y sus tornillos: los botones son piezas de plástico con
  espesor, los que están activos **encendidos por dentro** y repartiendo su luz
  sobre el chasis, y el paso que suena ahora **más brillante que los demás**;
* cuatro pistas de altura distinta —bombo, caja, charles y aro—, con su fila de
  pasos y su piloto a la izquierda;
* los **potenciómetros**, con su cuerpo estriado, su índice apuntando a un sitio
  concreto y la escala grabada alrededor;
* el **medidor de nivel**, con sus segmentos: los primeros encendidos, el último
  apagado, porque no está saturando;
* el **parche de estudio** de goma con la baqueta rebotando encima y la marca
  de uso en el centro, y la otra baqueta rodando;
* la **rejilla en papel** donde el patrón se escribió a mano antes de tocarlo:
  cuatro pistas por dieciséis casillas, con aspas, una fila a medias y los
  números de compás; encima, el lápiz;
* el cable de audio que sale por detrás y cae por el canto de la mesa.

Sin personajes. Lo que se enseña es que un ritmo se **escribe** y se **enciende**.
"""
import math

from taller_suite.escenas_ricas import C, W, H, svg, lg, rg
from taller_suite import rica_comun as M

k = C
P = 'ri'

MESA = 126

# El patrón, el mismo en el aparato y en el papel.
PISTAS = [
    ('bombo',   '#e0473c', [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0]),
    ('caja',    '#f0b419', [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1]),
    ('charles', '#4dc4bd', [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1]),
    ('aro',     '#a48bff', [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]),
]
PASO_ACTUAL = 6

CX, CY, CW, CH = 44, 150, 384, 158        # el chasis del aparato
PX, PY, PASO, ALTO = CX + 26, CY + 44, 21.4, 24


def _boton(x, y, w, h, col, *, encendido, actual=False):
    """Un botón: pieza de plástico con espesor; encendido, ilumina por dentro."""
    g = []
    if encendido:
        r = max(w, h)
        g.append(f'<ellipse cx="{M.r1(x + w / 2)}" cy="{M.r1(y + h / 2)}" '
                 f'rx="{M.r1(r * (1.15 if actual else .85))}" '
                 f'ry="{M.r1(r * (.95 if actual else .7))}" fill="{col}" '
                 f'opacity="{.32 if actual else .16}" filter="url(#b5)"/>')
    # el canto: el botón sobresale del panel
    g.append(f'<rect x="{M.r1(x)}" y="{M.r1(y + 2.4)}" width="{M.r1(w)}" '
             f'height="{M.r1(h)}" rx="3" fill="{k["noche"]}" opacity=".5"/>')
    base = col if encendido else '#3b444f'
    g.append(f'<rect x="{M.r1(x)}" y="{M.r1(y)}" width="{M.r1(w)}" height="{M.r1(h)}" '
             f'rx="3" fill="{base}" opacity="{1 if encendido else .95}"/>')
    if encendido:
        g.append(f'<rect x="{M.r1(x + 1.6)}" y="{M.r1(y + 1.6)}" '
                 f'width="{M.r1(w - 3.2)}" height="{M.r1(h - 3.2)}" rx="2" '
                 f'fill="#ffffff" opacity="{.5 if actual else .28}"/>')
    g.append(f'<rect x="{M.r1(x)}" y="{M.r1(y)}" width="{M.r1(w)}" height="{M.r1(h * .34)}" '
             f'rx="3" fill="#ffffff" opacity="{.3 if encendido else .12}"/>')
    g.append(f'<rect x="{M.r1(x)}" y="{M.r1(y)}" width="{M.r1(w)}" height="{M.r1(h)}" '
             f'rx="3" fill="none" stroke="{k["noche"]}" stroke-width=".9" '
             f'opacity=".45"/>')
    return ''.join(g)


def _potenciometro(cx, cy, r, ang, col):
    """Un mando: cuerpo estriado, índice y escala grabada alrededor."""
    g = [f'<ellipse cx="{M.r1(cx + 2)}" cy="{M.r1(cy + 4)}" rx="{M.r1(r)}" '
         f'ry="{M.r1(r)}" fill="{k["noche"]}" opacity=".4" filter="url(#b2)"/>']
    # la escala grabada
    for i in range(11):
        a = math.radians(-220 + i * 26)
        g.append(f'<path d="M{M.r1(cx + (r + 4) * math.cos(a))} '
                 f'{M.r1(cy + (r + 4) * math.sin(a))} '
                 f'l{M.r1(3.4 * math.cos(a))} {M.r1(3.4 * math.sin(a))}" '
                 f'stroke="#8d97a1" stroke-width="1.2" opacity=".75"/>')
    g.append(f'<circle cx="{M.r1(cx)}" cy="{M.r1(cy)}" r="{M.r1(r)}" '
             f'fill="url(#{P}_mando)"/>')
    # las estrías del cuerpo
    for i in range(18):
        a = math.radians(i * 20)
        g.append(f'<path d="M{M.r1(cx + r * .82 * math.cos(a))} '
                 f'{M.r1(cy + r * .82 * math.sin(a))} '
                 f'L{M.r1(cx + r * .98 * math.cos(a))} '
                 f'{M.r1(cy + r * .98 * math.sin(a))}" stroke="{k["noche"]}" '
                 f'stroke-width="1.1" opacity=".4"/>')
    a = math.radians(ang)
    g.append(f'<path d="M{M.r1(cx)} {M.r1(cy)} L{M.r1(cx + r * .82 * math.cos(a))} '
             f'{M.r1(cy + r * .82 * math.sin(a))}" stroke="{col}" stroke-width="2.6" '
             f'stroke-linecap="round"/>')
    g.append(f'<ellipse cx="{M.r1(cx - r * .3)}" cy="{M.r1(cy - r * .36)}" '
             f'rx="{M.r1(r * .36)}" ry="{M.r1(r * .22)}" fill="#ffffff" opacity=".28" '
             f'filter="url(#b2)"/>')
    return ''.join(g)


def _aparato():
    """El secuenciador: chasis, pistas, mandos y medidor."""
    g = [M.contacto(CX - 6, CY + CH + 10, CW + 12, op=.44, alto=9),
         M.sombra(CX, CY, CW, CH, op=.36, dx=12, dy=15, rx=8),
         # el canto inferior del chasis: el aparato tiene grosor
         f'<rect x="{CX}" y="{CY + 8}" width="{CW}" height="{CH}" rx="9" '
         f'fill="#151b22"/>',
         f'<rect x="{CX}" y="{CY}" width="{CW}" height="{CH}" rx="9" '
         f'fill="url(#{P}_chasis)"/>',
         f'<rect x="{CX}" y="{CY}" width="{CW}" height="7" rx="3.5" fill="#ffffff" '
         f'opacity=".22"/>',
         f'<rect x="{CX}" y="{CY}" width="{CW}" height="{CH}" rx="9" fill="none" '
         f'stroke="{k["noche"]}" stroke-width="1.4" opacity=".5"/>']
    # los cuatro tornillos del chasis
    for x, y in ((CX + 12, CY + 12), (CX + CW - 12, CY + 12),
                 (CX + 12, CY + CH - 12), (CX + CW - 12, CY + CH - 12)):
        g.append(f'<circle cx="{x}" cy="{y}" r="4.4" fill="url(#{P}_metal)"/>')
        g.append(f'<path d="M{x - 3} {y} h6" stroke="{k["noche"]}" stroke-width="1.4" '
                 f'opacity=".55"/>')
    # las cuatro pistas
    for j, (nombre, col, pasos) in enumerate(PISTAS):
        y = PY + j * (ALTO + 3)
        # el piloto de la pista
        g.append(f'<circle cx="{CX + 15}" cy="{M.r1(y + ALTO / 2)}" r="4.6" '
                 f'fill="{col}" opacity=".9"/>')
        g.append(f'<circle cx="{CX + 15}" cy="{M.r1(y + ALTO / 2)}" r="9" fill="{col}" '
                 f'opacity=".2" filter="url(#b2)"/>')
        for i, v in enumerate(pasos):
            x = PX + i * PASO
            g.append(_boton(x, y, PASO - 4.4, ALTO, col,
                            encendido=bool(v), actual=(i == PASO_ACTUAL and v)))
    # la línea del paso que suena, cruzando las cuatro pistas
    lx = PX + PASO_ACTUAL * PASO + (PASO - 4.4) / 2
    g.append(f'<path d="M{M.r1(lx)} {M.r1(PY - 8)} V{M.r1(PY + 4 * (ALTO + 3))}" '
             f'stroke="#ffffff" stroke-width="1.6" opacity=".45"/>')
    g.append(f'<path d="M{M.r1(lx)} {M.r1(PY - 10)} l-4 -6 h8 Z" fill="#ffffff" '
             f'opacity=".7"/>')
    # los compases marcados cada cuatro pasos
    for i in range(0, 16, 4):
        x = PX + i * PASO - 2.2
        g.append(f'<path d="M{M.r1(x)} {M.r1(PY - 6)} v-6" stroke="#8d97a1" '
                 f'stroke-width="1.4" opacity=".7"/>')
    # los mandos
    for i, (dx, ang, col) in enumerate(((0, -140, '#e0473c'), (46, -60, '#f0b419'),
                                        (92, 20, '#4dc4bd'))):
        g.append(_potenciometro(CX + 66 + dx, CY + 24, 13, ang, col))
    # el medidor de nivel
    mx, my = CX + 254, CY + 16
    g.append(f'<rect x="{mx}" y="{my}" width="112" height="17" rx="3" fill="#141a20"/>')
    for i in range(10):
        on = i < 7
        col = '#4dc4bd' if i < 5 else ('#f0b419' if i < 7 else '#e0473c')
        g.append(f'<rect x="{M.r1(mx + 4 + i * 10.6)}" y="{my + 4}" width="8" '
                 f'height="9" rx="1.5" fill="{col if on else "#2b333c"}" '
                 f'opacity="{1 if on else .9}"/>')
        if on:
            g.append(f'<rect x="{M.r1(mx + 4 + i * 10.6)}" y="{my + 4}" width="8" '
                     f'height="9" rx="1.5" fill="{col}" opacity=".5" '
                     f'filter="url(#b2)"/>')
    return ''.join(g)


def _parche():
    """El parche de estudio con la baqueta rebotando y la marca de uso."""
    cx, cy = 530, 254
    g = [M.contacto(cx - 66, cy + 25, 132, op=.42, alto=8),
         M.sombra(cx - 66, cy - 28, 132, 50, op=.3, dx=9, dy=12, rx=25, sesgo=-.2),
         f'<ellipse cx="{cx}" cy="{cy}" rx="66" ry="25" fill="url(#{P}_aro)"/>',
         f'<ellipse cx="{cx}" cy="{cy - 2}" rx="57" ry="20" fill="#2b323a"/>',
         f'<ellipse cx="{cx}" cy="{cy - 3}" rx="57" ry="20" fill="url(#{P}_goma)"/>']
    # la marca de uso en el centro, donde siempre cae la baqueta
    g.append(f'<ellipse cx="{cx - 4}" cy="{cy - 5}" rx="17" ry="7" fill="#151b21" '
             f'opacity=".55" filter="url(#b2)"/>')
    g.append(f'<ellipse cx="{cx - 4}" cy="{cy - 5}" rx="9" ry="3.6" fill="#0d1116" '
             f'opacity=".5"/>')
    # el brillo de la goma
    g.append(f'<ellipse cx="{cx - 20}" cy="{cy - 10}" rx="18" ry="5" fill="#ffffff" '
             f'opacity=".16" filter="url(#b2)" '
             f'transform="rotate(-8 {cx - 20} {cy - 10})"/>')
    # la baqueta que rebota: en el aire, con su sombra en el parche
    g.append(f'<ellipse cx="{cx + 6}" cy="{cy - 4}" rx="22" ry="6" fill="{k["noche"]}" '
             f'opacity=".34" filter="url(#b2)"/>')
    g.append('<g transform="rotate(-34 546 218)">')
    g.append(f'<rect x="476" y="212" width="128" height="10" rx="5" fill="#d9b177"/>')
    g.append(f'<rect x="476" y="213" width="128" height="3" rx="1.5" fill="#f3dcb4" '
             f'opacity=".8"/>')
    g.append(f'<ellipse cx="608" cy="217" rx="10" ry="8" fill="#d9b177"/>')
    g.append(f'<ellipse cx="605" cy="214" rx="4" ry="3" fill="#f6e5c4" opacity=".8"/>')
    g.append('</g>')
    # la otra baqueta, rodando sobre la mesa
    g.append('<g transform="rotate(8 480 318)">')
    g.append(M.sombra(410, 312, 146, 11, op=.28, dx=4, dy=7, rx=5, blur='b2'))
    g.append(f'<rect x="418" y="312" width="126" height="10" rx="5" fill="#d9b177"/>')
    g.append(f'<rect x="418" y="313" width="126" height="3" rx="1.5" fill="#f3dcb4" '
             f'opacity=".8"/>')
    g.append(f'<ellipse cx="412" cy="317" rx="9" ry="7" fill="#d9b177"/>')
    g.append('</g>')
    return ''.join(g)


def _rejilla_papel():
    """La rejilla donde el patrón se escribió a mano antes de tocarlo."""
    x, y, w, h = 42, 306, 296, 90
    g = [M.sombra(x, y, w, h, op=.26, dx=6, dy=9, rx=2),
         f'<g transform="rotate(3 {x + w / 2} {y + h / 2})">',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" '
         f'fill="url(#{P}_pliego)"/>',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="none" '
         f'stroke="#b5ac9b" stroke-width=".8" opacity=".8"/>']
    cw, ch = 14.4, 14.2
    ox, oy = x + 46, y + 22
    for j in range(4):
        for i in range(16):
            cx0, cy0 = ox + i * cw, oy + j * ch
            g.append(f'<rect x="{M.r1(cx0)}" y="{M.r1(cy0)}" width="{M.r1(cw)}" '
                     f'height="{M.r1(ch)}" fill="none" stroke="{k["grafito"]}" '
                     f'stroke-width="{.9 if i % 4 == 0 else .55}" '
                     f'opacity="{.55 if i % 4 == 0 else .3}"/>')
    # las aspas, con el patrón real, y la última pista a medias
    for j, (_, col, pasos) in enumerate(PISTAS):
        for i, v in enumerate(pasos):
            if not v:
                continue
            if j == 3 and i > 9:
                continue                     # esa fila se quedó a medio escribir
            cx0, cy0 = ox + i * cw + cw / 2, oy + j * ch + ch / 2
            g.append(M.trazo(f'M{M.r1(cx0 - 4.6)} {M.r1(cy0 - 4.6)} '
                             f'l9.2 9.2 m0 -9.2 l-9.2 9.2', k['tinta'],
                             w=1.7, op=.82, halo=False))
        # el nombre de la pista, como bloque
        g.append(f'<rect x="{x + 10}" y="{M.r1(oy + j * ch + ch / 2 - 1.4)}" '
                 f'width="{M.r1(28 - j * 3)}" height="2.8" rx="1.4" fill="{col}" '
                 f'opacity=".8"/>')
    # los números de compás
    for i in range(0, 16, 4):
        g.append(f'<rect x="{M.r1(ox + i * cw + 3)}" y="{M.r1(oy - 10)}" width="7" '
                 f'height="2.6" rx="1.3" fill="{k["grafito"]}" opacity=".6"/>')
    g.append('</g>')
    return ''.join(g)


def _lapiz():
    return ('<g transform="rotate(-16 232 372)">'
            + M.sombra(170, 366, 132, 12, op=.24, dx=4, dy=6, rx=6, blur='b2')
            + f'<rect x="182" y="366" width="112" height="12" rx="6" fill="#2b3d52"/>'
            + f'<rect x="182" y="367" width="112" height="3.4" rx="1.7" '
              f'fill="#5f7d9c" opacity=".8"/>'
            + f'<path d="M170 369 l14 -3 v12 l-14 -3 Z" fill="{k["madL"]}"/>'
            + f'<path d="M164 372 l7 -1.6 v6 Z" fill="{k["tinta"]}"/>'
            + '</g>')


def _cable():
    """El cable de audio que sale por detrás y cae por el canto de la mesa."""
    d = 'M418 224 C472 244 500 300 490 346 C480 382 444 396 406 400'
    return (f'<path d="{d}" fill="none" stroke="{k["noche"]}" stroke-width="9" '
            f'opacity=".2" filter="url(#b2)" transform="translate(4 6)"/>'
            f'<path d="{d}" fill="none" stroke="#1d242b" stroke-width="7" '
            f'stroke-linecap="round"/>'
            f'<path d="{d}" fill="none" stroke="#5a6874" stroke-width="1.8" '
            f'opacity=".5" transform="translate(-1.4 -1.8)"/>')


def escena():
    defs = (
        M.defs_taller(P, tabla=('#b1906a', '#8f7043', '#6a4e2e', '#43301a'))
        + M.defs_papel(P)
        + M.defs_metal(P)
        + lg(f'{P}_chasis', 0, 0, .25, 1,
             [(0, '#55606c', None), (.22, '#3d4854', None), (.7, '#2b343d', None),
              (1, '#1b222a', None)])
        + rg(f'{P}_mando', .34, .3, .9,
             [(0, '#6d7883', None), (.55, '#464f59', None), (1, '#232a32', None)])
        + lg(f'{P}_aro', 0, 0, .3, 1,
             [(0, '#b9c2ca', None), (.4, '#8d97a1', None), (1, '#4e5760', None)])
        + rg(f'{P}_goma', .34, .3, .95,
             [(0, '#3d454e', None), (.6, '#272e36', None), (1, '#161c22', None)])
        + rg(f'{P}_focosuelo', .5, .5, .5, [(0, '#fff0cf', .4), (1, '#fff0cf', 0)])
    )

    c = M.pared(P, MESA + 6, vx=470, vy=6, vw=140, vh=96)
    c += M.banco(P, MESA, juntas=(360,), nudos=((596, 340, 8),))
    c += (f'<ellipse cx="230" cy="220" rx="250" ry="140" fill="url(#{P}_focosuelo)" '
          f'opacity=".42" filter="url(#b22)"/>')

    c += _cable()
    c += _rejilla_papel()
    c += _parche()
    c += _aparato()
    c += _lapiz()

    c += M.velo(P, MESA - 6, 44, op=.26)
    c += M.vineta(P, .85)
    return svg(c, defs)
