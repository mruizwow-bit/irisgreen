# -*- coding: utf-8 -*-
"""Escena rica de Fotografía y composición (R65 · tanda 2).

La mesa de luz donde se elige y se recorta, no una cámara de icono.

Lo que se ve:

* la **mesa de luz encendida**: un panel que emite, no una superficie clara.
  Su resplandor frío es la segunda fuente de la escena y tiñe todo lo que tiene
  alrededor —el canto de la cámara, la mano del compás de recorte, la madera—,
  lo que la separa de cualquier otro banco del Taller;
* encima, **la tira de negativos**: los fotogramas en negativo de verdad
  —el cielo oscuro, el suelo claro—, con la perforación a los dos lados y el
  número de fotograma al margen;
* sobre la tira, las marcas de lápiz graso: **uno rodeado** y dos tachados. Esa
  es la decisión que se está tomando;
* la **hoja de contactos** al lado, con los mismos fotogramas en positivo y las
  mismas marcas;
* las **escuadras de recorte** formando una ventana sobre una copia: el encuadre
  se está buscando ahora mismo, y se ve lo que queda dentro y lo que queda fuera;
* la copia debajo, con la retícula de tercios trazada a lápiz y el horizonte
  todavía torcido, con la corrección marcada;
* la cámara apoyada de canto, con el objetivo, el anillo de diafragma y el
  reflejo azulado de la mesa de luz en el vidrio;
* el lápiz graso rojo, gastado y con el papel arrollado a medio pelar.

Sin personajes y sin caras: lo fotografiado es paisaje. Nada de marcas.
"""
import math

from taller_suite.escenas_ricas import C, W, H, svg, lg, rg
from taller_suite import rica_comun as M

k = C
P = 'fo'

MESA = 136

# La mesa de luz
LX, LY, LW, LH = 44, 174, 306, 150
ROJO = '#d1372e'


def _paisaje(x, y, w, h, i, *, negativo=False, op=1.0):
    """Un fotograma: paisaje con horizonte, cerro y un árbol. En positivo o en
    negativo, que es lo que cambia sobre la mesa de luz."""
    hy = y + h * (.52 + M.n(i, 3.1) * .16)
    if negativo:
        cielo, suelo, masa = '#5a3520', '#9d8aa8', '#ecdfd2'
    else:
        cielo, suelo, masa = '#b3cde0', '#616d56', '#232c21'
    g = [f'<rect x="{M.r1(x)}" y="{M.r1(y)}" width="{M.r1(w)}" height="{M.r1(h)}" '
         f'fill="{cielo}" opacity="{op}"/>',
         f'<rect x="{M.r1(x)}" y="{M.r1(hy)}" width="{M.r1(w)}" '
         f'height="{M.r1(y + h - hy)}" fill="{suelo}" opacity="{op}"/>']
    # el cerro
    g.append(f'<path d="M{M.r1(x)} {M.r1(hy)} q{M.r1(w * .26)} {M.r1(-h * (.14 + M.n(i, 5.7) * .12))} '
             f'{M.r1(w * .5)} {M.r1(-h * .02)} q{M.r1(w * .26)} {M.r1(h * .08)} '
             f'{M.r1(w * .5)} {M.r1(-h * .04)} V{M.r1(hy + 2)} H{M.r1(x)} Z" '
             f'fill="{masa}" opacity="{M.r2(op * .7)}"/>')
    # el árbol, desplazado según el fotograma: cada toma encuadra distinto
    tx = x + w * (.2 + M.n(i, 7.3) * .6)
    g.append(f'<path d="M{M.r1(tx)} {M.r1(hy + h * .12)} v{M.r1(-h * .2)}" '
             f'stroke="{masa}" stroke-width="{M.r2(w * .035)}" opacity="{op}"/>')
    g.append(f'<ellipse cx="{M.r1(tx)}" cy="{M.r1(hy - h * .2)}" rx="{M.r1(w * .085)}" '
             f'ry="{M.r1(h * .1)}" fill="{masa}" opacity="{op}"/>')
    return ''.join(g)


def _mesa_luz():
    """El panel: emite luz, no la refleja."""
    g = [M.sombra(LX, LY, LW, LH, op=.34, dx=11, dy=14, rx=6),
         # el marco
         f'<rect x="{LX - 8}" y="{LY - 8}" width="{LW + 16}" height="{LH + 16}" rx="8" '
         f'fill="url(#{P}_marco)"/>',
         f'<rect x="{LX - 8}" y="{LY - 8}" width="{LW + 16}" height="6" rx="3" '
         f'fill="#ffffff" opacity=".35"/>',
         # el difusor encendido
         f'<rect x="{LX}" y="{LY}" width="{LW}" height="{LH}" rx="3" '
         f'fill="url(#{P}_difusor)"/>',
         # el derrame: lo que hace que se lea como encendida
         f'<rect x="{LX - 30}" y="{LY - 30}" width="{LW + 60}" height="{LH + 60}" '
         f'rx="30" fill="#e8f6ff" opacity=".75" filter="url(#b22)"/>',
         # el difusor otra vez, ya sin el derrame encima: el panel es lo más claro
         f'<rect x="{LX}" y="{LY}" width="{LW}" height="{LH}" rx="3" '
         f'fill="url(#{P}_difusor)"/>']
    return ''.join(g)


def _tira_negativos():
    """La tira de negativos sobre la mesa de luz, con la perforación."""
    x, y, w, h = LX + 18, LY + 26, 268, 62
    g = [f'<g transform="rotate(-2 {x + w / 2} {y + h / 2})">',
         M.sombra(x, y, w, h, op=.24, dx=4, dy=6, rx=1, blur='b2'),
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#2b2f33"/>']
    # perforación arriba y abajo
    for j, yy in ((0, y + 3), (1, y + h - 9)):
        for i in range(24):
            g.append(f'<rect x="{M.r1(x + 6 + i * 11)}" y="{M.r1(yy)}" width="6" '
                     f'height="6" rx="1.4" fill="url(#{P}_difusor)"/>')
    # cuatro fotogramas
    for i in range(4):
        fx = x + 7 + i * 66
        g.append(f'<g clip-path="url(#{P}_cp_f{i})">')
        g.append(_paisaje(fx, y + 13, 60, 36, i, negativo=True))
        g.append('</g>')
        g.append(f'<rect x="{M.r1(fx)}" y="{y + 13}" width="60" height="36" fill="none" '
                 f'stroke="#15181b" stroke-width="1.4"/>')
        # el número de fotograma, como marcas al margen
        for j in range(2):
            g.append(f'<rect x="{M.r1(fx + 4 + j * 5)}" y="{y + 52}" width="3" '
                     f'height="6" fill="#8d959c" opacity=".8"/>')
    # las marcas de lápiz graso: uno rodeado, dos tachados
    g.append(f'<ellipse cx="{M.r1(x + 170)}" cy="{y + 31}" rx="36" ry="24" fill="none" '
             f'stroke="{ROJO}" stroke-width="3.4" opacity=".92" '
             f'stroke-linecap="round"/>')
    g.append(f'<ellipse cx="{M.r1(x + 170)}" cy="{y + 31}" rx="38" ry="26" fill="none" '
             f'stroke="{ROJO}" stroke-width="2" opacity=".45" '
             f'stroke-dasharray="26 14"/>')
    for i in (0, 3):
        fx = x + 7 + i * 66
        g.append(M.trazo(f'M{M.r1(fx + 4)} {y + 16} L{M.r1(fx + 56)} {y + 46}',
                         ROJO, w=3.2, op=.9, halo=False))
        g.append(M.trazo(f'M{M.r1(fx + 56)} {y + 16} L{M.r1(fx + 4)} {y + 46}',
                         ROJO, w=3.2, op=.9, halo=False))
    g.append('</g>')
    return ''.join(g)


def _contactos():
    """La hoja de contactos: los mismos fotogramas en positivo."""
    x, y, w, h = 372, 156, 176, 132
    g = [M.sombra(x, y, w, h, op=.3, dx=8, dy=11, rx=2),
         f'<g transform="rotate(4 {x + w / 2} {y + h / 2})">',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="1.5" '
         f'fill="url(#{P}_pliego)"/>',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="1.5" fill="none" '
         f'stroke="#b5ac9b" stroke-width=".8" opacity=".8"/>']
    for j in range(3):
        for i in range(3):
            fx, fy = x + 12 + i * 53, y + 12 + j * 40
            g.append(f'<g clip-path="url(#{P}_cp_c{j * 3 + i})">')
            g.append(_paisaje(fx, fy, 46, 31, j * 3 + i))
            g.append('</g>')
            g.append(f'<rect x="{fx}" y="{fy}" width="46" height="31" fill="none" '
                     f'stroke="#9d958a" stroke-width=".7"/>')
    # las mismas marcas que en la tira
    g.append(f'<ellipse cx="{x + 88}" cy="{y + 67}" rx="27" ry="19" fill="none" '
             f'stroke="{ROJO}" stroke-width="2.8" opacity=".9" stroke-linecap="round"/>')
    for i, j in ((0, 0), (2, 2)):
        fx, fy = x + 12 + i * 53, y + 12 + j * 40
        g.append(M.trazo(f'M{fx + 3} {fy + 3} L{fx + 43} {fy + 28}', ROJO,
                         w=2.6, op=.85, halo=False))
        g.append(M.trazo(f'M{fx + 43} {fy + 3} L{fx + 3} {fy + 28}', ROJO,
                         w=2.6, op=.85, halo=False))
    g.append('</g>')
    return ''.join(g)


def _copia_y_escuadras():
    """La copia con la retícula de tercios y las escuadras buscando el encuadre."""
    x, y, w, h = 356, 288, 214, 108
    g = [M.sombra(x, y, w, h, op=.3, dx=8, dy=11, rx=2),
         f'<g transform="rotate(-3 {x + w / 2} {y + h / 2})">',
         f'<g clip-path="url(#{P}_cp_copia)">']
    g.append(_paisaje(x, y, w, h, 2))
    # el horizonte torcido y su corrección, a lápiz
    g.append(M.guia(f'M{x + 4} {M.r1(y + h * .62)} L{x + w - 4} {M.r1(y + h * .52)}',
                    '#f4f0e6', w=1.4, op=.5, s=3))
    g.append(M.trazo(f'M{x + 4} {M.r1(y + h * .58)} L{x + w - 4} {M.r1(y + h * .58)}',
                     ROJO, w=1.8, op=.75, halo=False))
    # retícula de tercios
    for t in (1 / 3, 2 / 3):
        g.append(f'<path d="M{M.r1(x + w * t)} {y} V{y + h}" stroke="#ffffff" '
                 f'stroke-width=".9" opacity=".45" stroke-dasharray="6 5"/>')
        g.append(f'<path d="M{x} {M.r1(y + h * t)} H{x + w}" stroke="#ffffff" '
                 f'stroke-width=".9" opacity=".45" stroke-dasharray="6 5"/>')
    g.append('</g>')
    g.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="none" '
             f'stroke="#efe9dc" stroke-width="5"/>')
    g.append(f'<rect x="{x - 2.5}" y="{y - 2.5}" width="{w + 5}" height="{h + 5}" '
             f'fill="none" stroke="{k["noche"]}" stroke-width="1" opacity=".3"/>')

    # las dos escuadras de recorte, en L, formando la ventana
    def ele(px, py, rot):
        return (f'<g transform="rotate({rot} {px} {py})">'
                + M.sombra(px, py, 78, 16, op=.32, dx=4, dy=6, rx=2, blur='b2')
                + f'<path d="M{px} {py} h78 v14 h-64 v48 h-14 Z" '
                  f'fill="url(#{P}_carton)"/>'
                + f'<path d="M{px} {py} h78 v3 h-75 v59 h-3 Z" fill="#ffffff" '
                  f'opacity=".5"/>'
                + f'<path d="M{px} {py} h78 v14 h-64 v48 h-14 Z" fill="none" '
                  f'stroke="{k["noche"]}" stroke-width=".9" opacity=".35"/>'
                + '</g>')
    g.append(ele(x + 30, y + 14, 0))
    g.append(ele(x + 178, y + 92, 180))
    g.append('</g>')
    return ''.join(g)


def _camara():
    """La cámara de canto: cuerpo, objetivo, anillo y el reflejo de la mesa de luz."""
    cx, cy = 152, 362
    g = ['<g transform="rotate(-6 152 362)">',
         M.contacto(cx - 62, cy + 30, 124, op=.44, alto=8),
         M.sombra(cx - 60, cy - 34, 122, 62, op=.34, dx=10, dy=12, rx=7, sesgo=-.2),
         # cuerpo
         f'<rect x="{cx - 60}" y="{cy - 34}" width="122" height="62" rx="8" '
         f'fill="url(#{P}_cuerpo)"/>',
         f'<rect x="{cx - 60}" y="{cy - 34}" width="122" height="14" rx="7" '
         f'fill="#ffffff" opacity=".12"/>',
         # el prisma
         f'<path d="M{cx - 22} {cy - 34} l12 -16 h30 l12 16 Z" fill="url(#{P}_cuerpo)"/>',
         # empuñadura con su textura
         f'<rect x="{cx + 24}" y="{cy - 30}" width="36" height="54" rx="7" '
         f'fill="#1c242c"/>']
    for i in range(7):
        g.append(f'<rect x="{cx + 28}" y="{M.r1(cy - 26 + i * 6.6)}" width="28" '
                 f'height="2.4" rx="1.2" fill="#2f3b46"/>')
    # el objetivo
    g.append(f'<ellipse cx="{cx - 24}" cy="{cy - 2}" rx="30" ry="29" '
             f'fill="url(#{P}_metal)"/>')
    g.append(f'<ellipse cx="{cx - 24}" cy="{cy - 2}" rx="26" ry="25" fill="#11181f"/>')
    # el anillo de diafragma, con sus marcas
    for i in range(10):
        a = math.radians(-150 + i * 26)
        g.append(f'<path d="M{M.r1(cx - 24 + 28 * math.cos(a))} '
                 f'{M.r1(cy - 2 + 27 * math.cos(a) * 0 + 27 * math.sin(a))} '
                 f'l{M.r1(3 * math.cos(a))} {M.r1(3 * math.sin(a))}" '
                 f'stroke="#c8d2da" stroke-width="1.4" opacity=".8" '
                 f'stroke-linecap="round"/>')
    # el vidrio, con el reflejo azulado de la mesa de luz
    g.append(f'<ellipse cx="{cx - 24}" cy="{cy - 2}" rx="20" ry="19" '
             f'fill="url(#{P}_optica)"/>')
    g.append(f'<ellipse cx="{cx - 33}" cy="{cy - 12}" rx="9" ry="6" fill="#dff0ff" '
             f'opacity=".6" filter="url(#b2)" '
             f'transform="rotate(-30 {cx - 33} {cy - 12})"/>')
    g.append(f'<ellipse cx="{cx - 15}" cy="{cy + 8}" rx="6" ry="4" fill="#7fc4e8" '
             f'opacity=".35" filter="url(#b2)"/>')
    g.append(M.brillo_borde(f'M{cx - 52} {cy - 30} h84', w=1.6, op=.35))
    g.append('</g>')
    return ''.join(g)


def _lapiz_graso():
    """El lápiz graso rojo, con el papel arrollado a medio pelar."""
    return ('<g transform="rotate(14 300 388)">'
            + M.sombra(238, 382, 132, 14, op=.28, dx=4, dy=6, rx=7, blur='b2')
            + f'<rect x="248" y="382" width="116" height="14" rx="7" fill="{ROJO}"/>'
            + f'<rect x="248" y="383.5" width="116" height="4" rx="2" fill="#f08a7f" '
              f'opacity=".8"/>'
            # el papel arrollado, con su hélice
            + ''.join(f'<path d="M{262 + i * 13} 382 l7 14" stroke="#f6e3d8" '
                      f'stroke-width="3" opacity=".8"/>' for i in range(7))
            + f'<path d="M238 385 l14 -1 v11 l-14 -1 Z" fill="#8f231d"/>'
            + f'<path d="M232 388 l8 -1.6 v6 Z" fill="#5e1512"/>'
            + '</g>')


def _defs():
    """Los gradientes, filtros y recortes de esta escena.

    Vive aparte para que la variante AGE_0_12 pueda reutilizar
    exactamente los mismos, sin duplicarlos y sin que puedan divergir.
    """
    return (
        M.defs_taller(P, pared=('#cdc6b7', '#8e8577'),
                      tabla=('#9c7f5c', '#7d6140', '#5b442b', '#3a2a18'))
        + M.defs_papel(P)
        + M.defs_metal(P)
        + lg(f'{P}_marco', 0, 0, .3, 1,
             [(0, '#e7ebef', None), (.35, '#c3cbd3', None), (1, '#8d97a1', None)])
        + rg(f'{P}_difusor', .38, .3, .9,
             [(0, '#ffffff', None), (.55, '#f2f9ff', None), (1, '#d5e7f4', None)])
        + lg(f'{P}_cuerpo', 0, 0, .2, 1,
             [(0, '#55606b', None), (.3, '#39434e', None), (1, '#1a222a', None)])
        + rg(f'{P}_optica', .34, .3, .9,
             [(0, '#33526b', None), (.45, '#16293a', None), (1, '#070c12', None)])
        + lg(f'{P}_carton', 0, 0, .3, 1,
             [(0, '#8d949b', None), (.4, '#6e767e', None), (1, '#4c545c', None)])
        + rg(f'{P}_focosuelo', .5, .5, .5, [(0, '#fff0cf', .42), (1, '#fff0cf', 0)])
        + rg(f'{P}_luzmesa', .5, .5, .5,
             [(0, '#cfe8fb', .72), (.5, '#cfe8fb', .32), (1, '#cfe8fb', 0)])
        + ''.join(M.clip_rect(f'{P}_cp_f{i}', LX + 25 + i * 66, LY + 39, 60, 36)
                  for i in range(4))
        + ''.join(M.clip_rect(f'{P}_cp_c{j * 3 + i}', 384 + i * 53, 168 + j * 40, 46, 31)
                  for j in range(3) for i in range(3))
        + M.clip_rect(f'{P}_cp_copia', 356, 288, 214, 108)
    )


def escena():
    defs = _defs()

    c = M.pared(P, MESA + 6, vx=474, vy=10, vw=136, vh=98)
    c += M.banco(P, MESA, juntas=(392,), nudos=((250, 172, 8),))
    c += (f'<ellipse cx="480" cy="230" rx="210" ry="120" fill="url(#{P}_focosuelo)" '
          f'opacity=".45" filter="url(#b22)"/>')
    # el resplandor de la mesa de luz sobre la madera: la segunda fuente
    c += (f'<ellipse cx="{LX + LW / 2}" cy="{LY + LH / 2}" rx="280" ry="190" '
          f'fill="url(#{P}_luzmesa)" filter="url(#b22)"/>')

    c += _mesa_luz()
    c += _tira_negativos()
    c += _contactos()
    c += _copia_y_escuadras()
    c += _camara()
    c += _lapiz_graso()

    c += M.velo(P, MESA - 6, 50, op=.3)
    c += M.vineta(P, .85)
    return svg(c, defs)
