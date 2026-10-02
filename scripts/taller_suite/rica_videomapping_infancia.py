# -*- coding: utf-8 -*-
"""Videomapping · variante AGE_0_12 (R65 · fase 2).

**Mismo estudio, mismo proceso, misma calidad.** Un volumen en vez de tres, y
la sala menos oscura.

La escena base apila tres volúmenes, encaja la retícula en dos caras, la
desencaja en una tercera y deja el taller en penumbra cerrada. La penumbra es lo
que hace que se entienda que la luz la manda el proyector, y eso no se toca. Lo
que sí cambia:

* **un solo cubo, grande**, en vez de tres volúmenes apilados. Se ve entero, y
  se ven sus tres caras con su tono según hacia dónde miran;
* **la retícula encajada en dos caras** y **saliéndose en la tercera**, cayendo
  sobre la mesa. Es la misma idea y el mismo trabajo pendiente, pero con una
  cara contra la que compararlo, no con cinco;
* **los tiradores de esquina mayores**, con uno cogido y su flecha;
* el proyector, más grande y más cerca, con su haz;
* **la sala menos cerrada**: sigue mandando el proyector, pero se distingue el
  banco y la pared. A esta edad una escena muy oscura no se lee en un móvil, y
  bajar la penumbra no baja el detalle de nada.

Sin hoja de ajuste con esquinas numeradas: esa es la parte de oficina.
"""
import math

from taller_suite.escenas_ricas import C, W, H, svg
from taller_suite import rica_comun as M
from taller_suite import rica_videomapping as B

k = C
P = B.P
MESA = 128

LUZC = B.LUZC
OBJ = (300, 356)
E, F, A = 96, 56, 92          # vectores de la proyección del cubo


def _p(u, v, w=0):
    return (M.r1(OBJ[0] + u * E + v * F), M.r1(OBJ[1] - u * 18 + v * 36 - w * A))


def _cubo():
    """Un solo cubo, grande, con cada cara a su tono."""
    g = [f'<path d="M{_p(0,0)[0]} {_p(0,0)[1]} L{_p(2.4,0.2)[0]} {_p(2.4,0.2)[1]} '
         f'L{_p(2.6,1.4)[0]} {_p(2.6,1.4)[1]} L{_p(0,1.2)[0]} {_p(0,1.2)[1]} Z" '
         f'fill="{k["noche"]}" opacity=".45" filter="url(#b5)"/>']
    caras = ((((0, 0, 1), (1, 0, 1), (1, 1, 1), (0, 1, 1)), '#e6e0d4'),   # arriba
             (((0, 0, 0), (0, 1, 0), (0, 1, 1), (0, 0, 1)), '#d0c9bb'),   # izquierda
             (((0, 1, 0), (1, 1, 0), (1, 1, 1), (0, 1, 1)), '#a49c8e'))   # frente
    for pts, col in caras:
        g.append('<path d="M%s %s L%s %s L%s %s L%s %s Z" fill="%s"/>'
                 % (*_p(*pts[0]), *_p(*pts[1]), *_p(*pts[2]), *_p(*pts[3]), col))
        g.append('<path d="M%s %s L%s %s L%s %s L%s %s Z" fill="none" stroke="%s" '
                 'stroke-width="1.2" opacity=".45"/>'
                 % (*_p(*pts[0]), *_p(*pts[1]), *_p(*pts[2]), *_p(*pts[3]), '#7d7466'))
    # el canto del cartón por arriba
    for a, b in (((0, 0, 1), (1, 0, 1)), ((0, 0, 1), (0, 1, 1)),
                 ((0, 1, 1), (1, 1, 1)), ((1, 0, 1), (1, 1, 1))):
        g.append('<path d="M%s %s L%s %s" stroke="#f2ede1" stroke-width="3.4" '
                 'opacity=".85"/>' % (*_p(*a), *_p(*b)))
    return ''.join(g)


def _proyeccion():
    """Encajada en dos caras y saliéndose en la tercera."""
    g = [f'<g opacity=".92">']
    # cara de arriba
    g.append(f'<path d="M{_p(0,0,1)[0]} {_p(0,0,1)[1]} L{_p(1,0,1)[0]} {_p(1,0,1)[1]} '
             f'L{_p(1,1,1)[0]} {_p(1,1,1)[1]} L{_p(0,1,1)[0]} {_p(0,1,1)[1]} Z" '
             f'fill="{LUZC}" opacity=".24"/>')
    g.append(B._reticula_en_cara(_p(0, 0, 1), _p(1, 0, 1), _p(1, 1, 1), _p(0, 1, 1),
                                 5, op=.95, ancho=1.8))
    # cara izquierda
    g.append(f'<path d="M{_p(0,0,0)[0]} {_p(0,0,0)[1]} L{_p(0,1,0)[0]} {_p(0,1,0)[1]} '
             f'L{_p(0,1,1)[0]} {_p(0,1,1)[1]} L{_p(0,0,1)[0]} {_p(0,0,1)[1]} Z" '
             f'fill="{LUZC}" opacity=".22"/>')
    g.append(B._reticula_en_cara(_p(0, 0, 0), _p(0, 1, 0), _p(0, 1, 1), _p(0, 0, 1),
                                 5, op=.9, ancho=1.8))
    g.append('</g>')

    # la cara del frente, descuadrada: la retícula se sale y cae sobre la mesa
    a, b = _p(0, 1, 0), _p(1, 1, 0)
    cc, d = _p(1, 1, 1), _p(0, 1, 1)
    despl = 30
    a2 = (a[0] - 6, a[1] + despl)
    b2 = (b[0] + 40, b[1] + despl + 16)
    g.append(f'<path d="M{a[0]} {a[1]} L{b[0]} {b[1]} L{M.r1(b2[0])} {M.r1(b2[1])} '
             f'L{M.r1(a2[0])} {M.r1(a2[1])} Z" fill="{LUZC}" opacity=".2"/>')
    g.append(B._reticula_en_cara(a, b, b2, a2, 4, op=.6, ancho=1.5))
    g.append(f'<path d="M{d[0]} {d[1]} L{M.r1(cc[0] + 34)} {M.r1(cc[1] - 8)} '
             f'L{M.r1(b[0] + 34)} {M.r1(b[1] - 8)} L{a[0]} {a[1]} Z" fill="{LUZC}" '
             f'opacity=".24"/>')
    g.append(B._reticula_en_cara(d, (cc[0] + 34, cc[1] - 8), (b[0] + 34, b[1] - 8), a,
                                 4, op=.95, ancho=1.8))
    # los tiradores, mayores que en la base
    for i, (px, py) in enumerate((d, (cc[0] + 34, cc[1] - 8),
                                  (b[0] + 34, b[1] - 8), a)):
        cogido = i == 2
        r = 11 if cogido else 8
        g.append(f'<rect x="{M.r1(px - r)}" y="{M.r1(py - r)}" width="{r * 2}" '
                 f'height="{r * 2}" rx="3" '
                 f'fill="{"#ffd45e" if cogido else "#ffffff"}" '
                 f'opacity="{.95 if cogido else .85}"/>')
        g.append(f'<rect x="{M.r1(px - r)}" y="{M.r1(py - r)}" width="{r * 2}" '
                 f'height="{r * 2}" rx="3" fill="none" stroke="{k["noche"]}" '
                 f'stroke-width="1.2" opacity=".5"/>')
    g.append(f'<path d="M{M.r1(b[0] + 50)} {M.r1(b[1] - 4)} l28 14 m-8 -11 l8 11 '
             f'l-12 3" fill="none" stroke="#ffd45e" stroke-width="2.6" opacity=".9" '
             f'stroke-linecap="round"/>')
    return ''.join(g)


def _haz():
    cx, cy = 116, 268
    g = [f'<path d="M{cx + 8} {cy - 18} L560 150 L580 392 L{cx + 8} {cy + 18} Z" '
         f'fill="url(#{P}_haz)" opacity=".5"/>']
    for i in range(20):
        t = M.n(i, 3.1)
        px = cx + 24 + t * 400
        py = cy + (M.n(i, 7.7) - .5) * (36 + t * 170) - t * 50
        g.append(f'<circle cx="{M.r1(px)}" cy="{M.r1(py)}" '
                 f'r="{M.r2(.8 + M.n(i, 5.3) * 2)}" fill="#ffffff" '
                 f'opacity="{M.r2(.14 + M.n(i, 9.1) * .3)}"/>')
    return ''.join(g)


def escena():
    # la sala se cierra menos que en la base: sigue mandando el proyector, pero a
    # esta edad una escena muy oscura no se lee en un móvil
    c = M.pared(P, MESA + 6, vx=480, vy=8, vw=128, vh=86)
    c += f'<rect width="{W}" height="{MESA + 8}" fill="#1c2733" opacity=".32"/>'
    c += M.banco(P, MESA, juntas=(), nudos=((540, 376, 8),), brillo=False)
    c += (f'<rect x="0" y="{MESA}" width="{W}" height="{H - MESA}" fill="#101a24" '
          f'opacity=".26"/>')

    c += _cubo()
    c += _haz()
    c += _proyeccion()
    # el proyector, mayor y más cerca
    c += '<g transform="translate(6 30) scale(1.2)">'
    c += B._proyector()
    c += '</g>'

    c += M.vineta(P, .95)
    return svg(c, B._defs())
