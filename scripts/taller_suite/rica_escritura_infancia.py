# -*- coding: utf-8 -*-
"""Escritura con restricciones · variante AGE_0_12 (R65 · fase 2).

**Mismo estudio, mismo proceso, misma calidad.** Un objeto y una regla.

La escena base tiene la máquina, la hoja escrita, la tarjeta de la regla, el
fichero de palabras con una ficha descartada, el diccionario bocabajo, el lápiz
y la cuenta de sílabas. Todo eso es el oficio, pero la idea que hay que entender
primero es una sola, y cabe en un objeto.

Aquí queda esa:

* **la máquina de escribir, grande y de frente**, con **la tecla tapada** y la
  letra prohibida tachada encima de la cinta. La regla está en el aparato: se
  entiende sin saber leer;
* **la tarjeta de la regla**, mayor que en la base, con la misma letra y su aspa,
  apoyada al lado. La misma cosa dicha dos veces, que a esta edad ayuda;
* **la hoja en el rodillo**, escrita a medias, con el último renglón cortado
  donde se quedó.

Sin fichero de palabras, sin diccionario, sin cuenta de sílabas y sin la palabra
tachada con equis de máquina. La misma máquina dibujada con el mismo detalle
—los tipos en abanico, los carretes de la cinta, las teclas con su aro—:
**hay menos y es mayor**.
"""
from taller_suite.escenas_ricas import C, W, H, svg
from taller_suite import rica_comun as M
from taller_suite import rica_escritura as B

k = C
P = B.P
MESA = 120


def _hoja_simple():
    """La hoja en el rodillo, escrita a medias y sin la corrección."""
    x, y, w, h = 138, 88, 212, 126
    g = [M.sombra(x, y, w, h, op=.26, dx=6, dy=9, rx=2, blur='b5'),
         f'<path d="M{x} {y + 6} L{x + w - 4} {y} L{x + w + 6} {y + h} '
         f'L{x + 8} {y + h + 6} Z" fill="url(#{P}_pliego)"/>',
         f'<path d="M{x} {y + 6} L{x + w - 4} {y}" stroke="#c9c0ac" '
         f'stroke-width="1" opacity=".8"/>']
    y0 = y + 26
    for fila in range(6):
        cx = x + 18
        restante = 168 if fila < 5 else 76        # el último se quedó cortado
        i = 0
        while restante > 10:
            palabra = min(restante, 14 + M.n(fila * 7 + i, 3.1) * 30)
            g.append(f'<rect x="{M.r1(cx)}" '
                     f'y="{M.r1(y0 + fila * 16 - (cx - x) * .02)}" '
                     f'width="{M.r1(palabra)}" height="5.4" rx="2.2" '
                     f'fill="{k["tinta"]}" '
                     f'opacity="{M.r2(.6 + M.n(fila * 7 + i, 5.7) * .22)}"/>')
            cx += palabra + 8
            restante -= palabra + 8
            i += 1
    g.append(f'<rect x="{M.r1(x + 18 + 76)}" y="{M.r1(y0 + 5 * 16 - 1)}" width="9" '
             f'height="10" fill="{k["tinta"]}" opacity=".5"/>')
    return ''.join(g)


def escena():
    c = M.pared(P, MESA + 6, vx=452, vy=6, vw=140, vh=92)
    c += M.banco(P, MESA, juntas=(), nudos=((92, 384, 8),))
    c += (f'<ellipse cx="240" cy="208" rx="270" ry="150" fill="url(#{P}_focosuelo)" '
          f'opacity=".46" filter="url(#b22)"/>')

    # la tarjeta de la regla, mayor y desplazada para que quepa entera
    c += '<g transform="translate(-21 26) scale(1.24)">'
    c += B._tarjeta_regla()
    c += '</g>'

    # la máquina, grande y de frente: ocupa la escena
    c += '<g transform="translate(-28 -58) scale(1.24)">'
    c += _hoja_simple()
    c += B._maquina()
    c += B._tecla_tapada()
    c += '</g>'

    c += M.velo(P, MESA - 6, 40, op=.24)
    c += M.vineta(P, .82)
    return svg(c, B._defs())
