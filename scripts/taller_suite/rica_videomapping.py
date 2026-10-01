# -*- coding: utf-8 -*-
"""Escena rica de Videomapping (R65 · tanda 6).

El proyector, el objeto real y la luz **encajando** en él.

Esta es la única escena del Taller donde la luz principal no entra por la
ventana: la manda el proyector. Por eso el banco está más oscuro que en las
demás, la ventana queda apagada al fondo y lo que se ve brillar es lo que la
proyección toca. Es el estudio entero contado con la iluminación.

Lo que se ve:

* el **proyector** sobre su trípode de mesa, con el objetivo, el anillo de
  enfoque, la rejilla de ventilación y el piloto encendido;
* el **haz**, un cono de luz con volumen: más denso al salir, deshaciéndose
  hacia el objeto, con el polvo del aire cruzándolo;
* el **objeto real**: tres volúmenes de cartón apilados, cada cara con su tono
  según hacia dónde mira;
* la **proyección encajada** en dos de las caras: la retícula sigue la
  perspectiva de cada cara, no está pegada plana encima;
* y la tercera cara **todavía sin ajustar**: ahí la retícula se sale del borde y
  cae sobre la mesa, deformada. Ese desajuste es el trabajo que falta, y es lo
  que hace que la escena enseñe el oficio y no el resultado;
* los **tiradores de las esquinas** sobre la cara en ajuste, con uno cogido;
* la sombra del objeto, proyectada por la luz del proyector y por tanto tirada
  hacia el lado contrario al haz;
* la hoja de ajuste, con el objeto dibujado y las cuatro esquinas numeradas.

Sin personajes. Lo que se enseña es hacer que la luz encaje en algo real.
"""
import math

from taller_suite.escenas_ricas import C, W, H, svg, lg, rg
from taller_suite import rica_comun as M

k = C
P = 'vm'

MESA = 132

PROY = (108, 250)            # el objetivo del proyector
LUZC = '#bfe4ff'


def _proyector():
    """El proyector sobre su trípode de mesa."""
    x, y = 44, 222
    g = [M.contacto(x + 4, y + 82, 112, op=.44, alto=8),
         M.sombra(x, y, 116, 64, op=.34, dx=10, dy=13, rx=6)]
    # el trípode
    for dx in (18, 58, 96):
        g.append(f'<path d="M{M.r1(x + dx)} {y + 56} L{M.r1(x + dx - 6 + dx * .08)} '
                 f'{y + 84}" stroke="url(#{P}_metal)" stroke-width="5" '
                 f'stroke-linecap="round"/>')
    # el cuerpo
    g.append(f'<rect x="{x}" y="{y}" width="116" height="58" rx="8" '
             f'fill="url(#{P}_cuerpo)"/>')
    g.append(f'<rect x="{x}" y="{y}" width="116" height="9" rx="4.5" fill="#ffffff" '
             f'opacity=".16"/>')
    # la rejilla de ventilación
    for i in range(7):
        g.append(f'<rect x="{M.r1(x + 12 + i * 7)}" y="{y + 18}" width="3.4" '
                 f'height="26" rx="1.7" fill="#0f151b"/>')
        g.append(f'<rect x="{M.r1(x + 12 + i * 7)}" y="{y + 18}" width="1.2" '
                 f'height="26" fill="#ffffff" opacity=".1"/>')
    # el piloto encendido
    g.append(f'<circle cx="{x + 12}" cy="{y + 50}" r="3.4" fill="#7dfaa8"/>')
    g.append(f'<circle cx="{x + 12}" cy="{y + 50}" r="7" fill="#7dfaa8" opacity=".35" '
             f'filter="url(#b2)"/>')
    # el objetivo, con su anillo de enfoque
    cx, cy = PROY
    g.append(f'<ellipse cx="{cx - 4}" cy="{cy}" rx="16" ry="20" '
             f'fill="url(#{P}_metal)"/>')
    g.append(f'<ellipse cx="{cx}" cy="{cy}" rx="13" ry="17" fill="#121a22"/>')
    for i in range(9):
        a = math.radians(-120 + i * 30)
        g.append(f'<path d="M{M.r1(cx - 4 + 15 * math.cos(a))} '
                 f'{M.r1(cy + 19 * math.sin(a))} l{M.r1(3 * math.cos(a))} '
                 f'{M.r1(3 * math.sin(a))}" stroke="#8d97a1" stroke-width="1.2" '
                 f'opacity=".75"/>')
    g.append(f'<ellipse cx="{cx + 2}" cy="{cy}" rx="10" ry="13" fill="url(#{P}_optica)"/>')
    g.append(f'<ellipse cx="{cx + 2}" cy="{cy - 3}" rx="6" ry="7" fill="{LUZC}" '
             f'opacity=".85"/>')
    g.append(f'<ellipse cx="{cx + 2}" cy="{cy}" rx="20" ry="24" fill="{LUZC}" '
             f'opacity=".3" filter="url(#b5)"/>')
    return ''.join(g)


# El objeto: tres volúmenes apilados. Cada uno por su base y su altura.
def _proy3(u, v, w, ox, oy):
    """Proyección isométrica ligera: u a la derecha, v al fondo, w hacia arriba."""
    return (M.r1(ox + u * 58 + v * 34), M.r1(oy - u * 11 + v * 22 - w * 52))


OBJ = (316, 322)


def _objeto():
    """Los tres volúmenes de cartón, con cada cara a su tono."""
    g = []
    cajas = [(0, 0, 0, 2.2, 1.6, 1.5), (0.35, 0.25, 1.5, 1.3, 1.0, 1.2),
             (1.5, 0.15, 0, 0.7, 0.9, 2.3)]
    # sombra proyectada: la luz viene de la izquierda, así que cae a la derecha
    g.append(f'<path d="M{_proy3(0, 0, 0, *OBJ)[0]} {_proy3(0, 0, 0, *OBJ)[1]} '
             f'L{_proy3(4.6, .4, 0, *OBJ)[0]} {_proy3(4.6, .4, 0, *OBJ)[1]} '
             f'L{_proy3(4.9, 2.2, 0, *OBJ)[0]} {_proy3(4.9, 2.2, 0, *OBJ)[1]} '
             f'L{_proy3(0, 1.6, 0, *OBJ)[0]} {_proy3(0, 1.6, 0, *OBJ)[1]} Z" '
             f'fill="{k["noche"]}" opacity=".42" filter="url(#b5)"/>')
    for (u0, v0, w0, du, dv, dw) in cajas:
        p = lambda a, b, c: _proy3(u0 + a, v0 + b, w0 + c, *OBJ)
        # cara superior
        g.append('<path d="M%s %s L%s %s L%s %s L%s %s Z" fill="%s"/>' % (
            *p(0, 0, dw), *p(du, 0, dw), *p(du, dv, dw), *p(0, dv, dw), '#e4ded2'))
        # cara izquierda, la que mira al proyector
        g.append('<path d="M%s %s L%s %s L%s %s L%s %s Z" fill="%s"/>' % (
            *p(0, 0, 0), *p(0, dv, 0), *p(0, dv, dw), *p(0, 0, dw), '#cfc8ba'))
        # cara frontal, en sombra
        g.append('<path d="M%s %s L%s %s L%s %s L%s %s Z" fill="%s"/>' % (
            *p(0, dv, 0), *p(du, dv, 0), *p(du, dv, dw), *p(0, dv, dw), '#a79f91'))
        # las aristas
        for a, b in (((0, 0, dw), (du, 0, dw)), ((du, 0, dw), (du, dv, dw)),
                     ((0, 0, dw), (0, dv, dw)), ((0, dv, dw), (du, dv, dw)),
                     ((0, dv, 0), (0, dv, dw)), ((du, dv, 0), (du, dv, dw)),
                     ((0, 0, 0), (0, 0, dw))):
            g.append('<path d="M%s %s L%s %s" stroke="%s" stroke-width=".9" '
                     'opacity=".4"/>' % (*p(*a), *p(*b), '#7d7466'))
    return ''.join(g)


def _reticula_en_cara(p0, p1, p2, p3, n=6, *, col=LUZC, op=.85, ancho=1.5):
    """Una retícula que sigue la perspectiva de una cara.

    Los puntos se interpolan **dentro del cuadrilátero de la cara**, así que las
    líneas convergen como convergen sus bordes. Pegar una cuadrícula recta encima
    es lo que hace que un videomapping parezca una pegatina.
    """
    def punto(s, t):
        ax = p0[0] + (p1[0] - p0[0]) * s
        ay = p0[1] + (p1[1] - p0[1]) * s
        bx = p3[0] + (p2[0] - p3[0]) * s
        by = p3[1] + (p2[1] - p3[1]) * s
        return M.r1(ax + (bx - ax) * t), M.r1(ay + (by - ay) * t)
    g = []
    for i in range(n + 1):
        s = i / n
        a, b = punto(s, 0), punto(s, 1)
        g.append(f'<path d="M{a[0]} {a[1]} L{b[0]} {b[1]}" stroke="{col}" '
                 f'stroke-width="{ancho}" opacity="{op}"/>')
    for j in range(n + 1):
        t = j / n
        a, b = punto(0, t), punto(1, t)
        g.append(f'<path d="M{a[0]} {a[1]} L{b[0]} {b[1]}" stroke="{col}" '
                 f'stroke-width="{ancho}" opacity="{op}"/>')
    return ''.join(g)


def _proyeccion():
    """La proyección: encajada en dos caras y desajustada en la tercera."""
    g = [f'<g opacity=".9">']
    # ── cara superior de la caja grande: encajada
    p = lambda a, b, c: _proy3(a, b, c, *OBJ)
    g.append(f'<path d="M{p(0,0,1.5)[0]} {p(0,0,1.5)[1]} L{p(2.2,0,1.5)[0]} '
             f'{p(2.2,0,1.5)[1]} L{p(2.2,1.6,1.5)[0]} {p(2.2,1.6,1.5)[1]} '
             f'L{p(0,1.6,1.5)[0]} {p(0,1.6,1.5)[1]} Z" fill="{LUZC}" opacity=".22"/>')
    g.append(_reticula_en_cara(p(0, 0, 1.5), p(2.2, 0, 1.5), p(2.2, 1.6, 1.5),
                               p(0, 1.6, 1.5), 6, op=.92))
    # ── cara izquierda de la caja alta: encajada
    g.append(f'<path d="M{p(1.5,0.15,0)[0]} {p(1.5,0.15,0)[1]} '
             f'L{p(1.5,1.05,0)[0]} {p(1.5,1.05,0)[1]} '
             f'L{p(1.5,1.05,2.3)[0]} {p(1.5,1.05,2.3)[1]} '
             f'L{p(1.5,0.15,2.3)[0]} {p(1.5,0.15,2.3)[1]} Z" fill="{LUZC}" '
             f'opacity=".2"/>')
    g.append(_reticula_en_cara(p(1.5, 0.15, 0), p(1.5, 1.05, 0), p(1.5, 1.05, 2.3),
                               p(1.5, 0.15, 2.3), 5, op=.85))
    g.append('</g>')

    # ── la cara en ajuste: la retícula se sale y cae sobre la mesa ───────────
    a = p(0.35, 1.25, 1.5)
    b = p(1.65, 1.25, 1.5)
    cc = p(1.65, 1.25, 2.7)
    d = p(0.35, 1.25, 2.7)
    # el trozo que cae fuera, deformado sobre la mesa
    fuera_a = (a[0] - 30, a[1] + 74)
    fuera_b = (b[0] + 46, b[1] + 88)
    g.append(f'<path d="M{a[0]} {a[1]} L{b[0]} {b[1]} L{M.r1(fuera_b[0])} '
             f'{M.r1(fuera_b[1])} L{M.r1(fuera_a[0])} {M.r1(fuera_a[1])} Z" '
             f'fill="{LUZC}" opacity=".2"/>')
    g.append(_reticula_en_cara(a, b, fuera_b, fuera_a, 5, op=.62, ancho=1.3))
    # la parte que sí cae en la cara, pero descuadrada: se desborda por un lado
    g.append(f'<path d="M{d[0]} {d[1]} L{M.r1(cc[0] + 22)} {M.r1(cc[1] - 6)} '
             f'L{M.r1(b[0] + 22)} {M.r1(b[1] - 6)} L{a[0]} {a[1]} Z" fill="{LUZC}" '
             f'opacity=".2"/>')
    g.append(_reticula_en_cara(d, (cc[0] + 22, cc[1] - 6), (b[0] + 22, b[1] - 6), a,
                               5, op=.95))
    # los tiradores de esquina, uno cogido
    for i, (px, py) in enumerate((d, (cc[0] + 22, cc[1] - 6), (b[0] + 22, b[1] - 6), a)):
        cogido = i == 2
        r = 7 if cogido else 5
        g.append(f'<rect x="{M.r1(px - r)}" y="{M.r1(py - r)}" width="{r * 2}" '
                 f'height="{r * 2}" rx="2" fill="{"#ffd45e" if cogido else "#ffffff"}" '
                 f'opacity="{.95 if cogido else .8}"/>')
        g.append(f'<rect x="{M.r1(px - r)}" y="{M.r1(py - r)}" width="{r * 2}" '
                 f'height="{r * 2}" rx="2" fill="none" stroke="{k["noche"]}" '
                 f'stroke-width="1" opacity=".5"/>')
    # la flecha del ajuste que falta
    g.append(f'<path d="M{M.r1(b[0] + 30)} {M.r1(b[1] + 2)} l20 10 m-6 -8 l6 8 l-9 2" '
             f'fill="none" stroke="#ffd45e" stroke-width="2" opacity=".85" '
             f'stroke-linecap="round"/>')
    return ''.join(g)


def _haz():
    """El haz: un cono con volumen, más denso al salir, con polvo cruzándolo."""
    cx, cy = PROY
    g = [f'<path d="M{cx + 6} {cy - 14} L{OBJ[0] + 210} {OBJ[1] - 178} '
         f'L{OBJ[0] + 226} {OBJ[1] + 26} L{cx + 6} {cy + 14} Z" '
         f'fill="url(#{P}_haz)" opacity=".5"/>',
         f'<path d="M{cx + 6} {cy - 8} L{OBJ[0] + 200} {OBJ[1] - 150} '
         f'L{OBJ[0] + 210} {OBJ[1] - 10} L{cx + 6} {cy + 8} Z" '
         f'fill="{LUZC}" opacity=".12" filter="url(#b12)"/>']
    # el polvo del aire, que es lo que hace visible un haz
    for i in range(26):
        t = M.n(i, 3.1)
        px = cx + 20 + t * 430
        py = cy + (M.n(i, 7.7) - .5) * (30 + t * 150) - t * 60
        g.append(f'<circle cx="{M.r1(px)}" cy="{M.r1(py)}" '
                 f'r="{M.r2(.6 + M.n(i, 5.3) * 1.6)}" fill="#ffffff" '
                 f'opacity="{M.r2(.12 + M.n(i, 9.1) * .3)}"/>')
    return ''.join(g)


def _hoja_ajuste():
    """La hoja de ajuste: el objeto dibujado y las esquinas numeradas."""
    x, y, w, h = 54, 328, 186, 76
    g = [M.sombra(x, y, w, h, op=.28, dx=6, dy=9, rx=2),
         f'<g transform="rotate(-6 {x + w / 2} {y + h / 2})">',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" '
         f'fill="url(#{P}_pliego)"/>',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="none" '
         f'stroke="#b5ac9b" stroke-width=".8" opacity=".8"/>']
    # el objeto dibujado a lápiz, en pequeño
    g.append(f'<path d="M{x + 18} {y + 54} l26 -10 l22 8 l-26 10 Z" fill="none" '
             f'stroke="{k["tinta"]}" stroke-width="1.2" opacity=".7"/>')
    g.append(f'<path d="M{x + 18} {y + 54} v-18 l26 -10 v18 M{x + 44} {y + 26} '
             f'l22 8 v18 l-22 -8" fill="none" stroke="{k["tinta"]}" '
             f'stroke-width="1.2" opacity=".7"/>')
    # las cuatro esquinas numeradas
    for i, (dx, dy) in enumerate(((18, 36), (44, 26), (66, 34), (44, 44))):
        g.append(f'<circle cx="{M.r1(x + dx)}" cy="{M.r1(y + dy)}" r="5.6" '
                 f'fill="none" stroke="#c8322c" stroke-width="1.2" opacity=".85"/>')
        g.append(f'<rect x="{M.r1(x + dx - 2)}" y="{M.r1(y + dy - 1.2)}" '
                 f'width="{M.r1(2 + i)}" height="2.4" rx="1.2" fill="#c8322c" '
                 f'opacity=".85"/>')
    # las filas de valores
    for i in range(4):
        g.append(f'<rect x="{x + 96}" y="{M.r1(y + 20 + i * 12)}" width="16" '
                 f'height="2.6" rx="1.3" fill="{k["grafito"]}" opacity=".55"/>')
        g.append(f'<rect x="{x + 118}" y="{M.r1(y + 20 + i * 12)}" '
                 f'width="{M.r1(24 + i * 8)}" height="2.6" rx="1.3" '
                 f'fill="{k["grafito"]}" opacity=".4"/>')
    g.append('</g>')
    return ''.join(g)


def _defs():
    """Los gradientes, filtros y recortes de esta escena.

    Vive aparte para que la variante AGE_0_12 pueda reutilizar
    exactamente los mismos, sin duplicarlos y sin que puedan divergir.
    """
    return (
        M.defs_taller(P, pared=('#7d7a72', '#4d4b46'),
                      tabla=('#7e6547', '#63502f', '#473820', '#2c2213'),
                      luz='#8fa4b4')
        + M.defs_papel(P)
        + M.defs_metal(P)
        + lg(f'{P}_cuerpo', 0, 0, .25, 1,
             [(0, '#515c67', None), (.3, '#39434e', None), (1, '#1b222a', None)])
        + rg(f'{P}_optica', .34, .3, .9,
             [(0, '#4a7f9e', None), (.45, '#1d3a4e', None), (1, '#08131c', None)])
        + lg(f'{P}_haz', 0, .5, 1, .5,
             [(0, LUZC, .55), (.4, LUZC, .22), (1, LUZC, .12)])
        + rg(f'{P}_focosuelo', .5, .5, .5, [(0, '#cfe4f4', .2), (1, '#cfe4f4', 0)])
    )


def escena():
    defs = _defs()

    # el taller está en penumbra: la ventana queda apagada y el proyector manda
    c = M.pared(P, MESA + 6, vx=470, vy=8, vw=126, vh=86)
    c += f'<rect width="{W}" height="{MESA + 8}" fill="#1c2733" opacity=".5"/>'
    c += M.banco(P, MESA, juntas=(300,), nudos=((520, 372, 8),), brillo=False)
    c += f'<rect x="0" y="{MESA}" width="{W}" height="{H - MESA}" fill="#101a24" opacity=".42"/>'

    c += _hoja_ajuste()
    c += _objeto()
    c += _haz()
    c += _proyeccion()
    c += _proyector()

    c += M.vineta(P, 1.0)
    return svg(c, defs)
