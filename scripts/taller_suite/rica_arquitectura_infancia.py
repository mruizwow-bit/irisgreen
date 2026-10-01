# -*- coding: utf-8 -*-
"""Arquitectura y planos · variante AGE_0_12 (R65 · fase 2).

**Mismo estudio, mismo proceso, misma calidad.** Lo que baja es la densidad.

La escena base enseña un plano completo de oficina técnica: ejes de replanteo,
cadenas de cotas, escalera con flecha de subida, ventana partida en tres trazos,
escuadra, regla paralela y escalímetro. Todo eso es verdad y está bien, pero es
convención profesional: a 172 px y a los siete años no dice nada.

Aquí queda **lo que sí dice algo**, y grande:

* **una sola habitación**, con sus cuatro muros gruesos;
* **una puerta con su arco de barrido**, tan grande que se entiende que la
  puerta se abre girando;
* **una ventana**, en su hueco del muro;
* y **la maqueta del mismo cuarto**, al lado y mayor que en la base, con los
  muros levantados, la cubierta todavía sin poner y **el hueco de la puerta en
  el mismo sitio que en el plano**. Esa correspondencia es el estudio entero:
  esto de aquí plano, esto mismo de pie.

Se conservan el muro a lápiz sin entintar y la esquina sin cerrar, porque la
escena tiene que seguir enseñando algo a medio hacer. Se va el resto.
"""
from taller_suite.escenas_ricas import C, W, H, svg
from taller_suite import rica_comun as M
from taller_suite import rica_arquitectura as B

k = C
P = B.P
MESA = 112


def _plano():
    """Una sola habitación: cuatro muros, una puerta y una ventana."""
    g = [f'<g clip-path="url(#{P}_cp_lamina)">']
    e = B._lamina_pt
    # la retícula del papel, más espaciada: menos ruido de fondo
    for i in range(9):
        a, b = e(i / 8, 0), e(i / 8, 1)
        g.append(f'<path d="M{a[0]} {a[1]} L{b[0]} {b[1]}" stroke="{B.AZUL}" '
                 f'stroke-width=".6" opacity=".3"/>')
    for j in range(7):
        a, b = e(0, j / 6), e(1, j / 6)
        g.append(f'<path d="M{a[0]} {a[1]} L{b[0]} {b[1]}" stroke="{B.AZUL}" '
                 f'stroke-width=".6" opacity=".3"/>')

    esq = [e(.12, .20), e(.86, .14), e(.90, .82), e(.16, .88)]
    # tres muros entintados y el cuarto todavía a lápiz
    g.append(B._muro(*esq[0], *esq[1], grosor=15))
    g.append(B._muro(*esq[3], *esq[2], grosor=15))
    g.append(B._muro(*esq[0], *esq[3], grosor=15))
    g.append(B._muro(*esq[1], *esq[2], grosor=15, lapiz=True))
    # la ventana: el hueco del muro de arriba, en tres trazos
    v0, v1 = e(.30, .187), e(.52, .174)
    g.append(f'<rect x="{v0[0]}" y="{M.r1(v0[1] - 9)}" '
             f'width="{M.r1(v1[0] - v0[0])}" height="18" fill="#fdfbf3"/>')
    for dy in (-6, 0, 6):
        g.append(f'<path d="M{v0[0]} {M.r1(v0[1] + dy)} L{v1[0]} {M.r1(v1[1] + dy)}" '
                 f'stroke="{k["tinta"]}" stroke-width="1.6" opacity=".85"/>')
    # la puerta, con su arco de barrido bien grande
    px, py = e(.40, .855)
    g.append(f'<rect x="{M.r1(px - 34)}" y="{M.r1(py - 9)}" width="68" height="18" '
             f'fill="#fdfbf3"/>')
    g.append(B._puerta(px - 32, py, 62, -88, sentido=1))
    # la esquina que falta por cerrar
    cx, cy = e(.88, .17)
    g.append(f'<circle cx="{cx}" cy="{cy}" r="20" fill="none" stroke="#c8322c" '
             f'stroke-width="2.4" opacity=".8" stroke-dasharray="20 7"/>')
    g.append('</g>')
    return ''.join(g)


def escena():
    c = M.pared(P, MESA + 6, vx=444, vy=6, vw=150, vh=86)
    c += M.banco(P, MESA, juntas=(), nudos=((596, 372, 8),))
    c += (f'<ellipse cx="220" cy="210" rx="260" ry="160" fill="url(#{P}_focosuelo)" '
          f'opacity=".45" filter="url(#b22)"/>')

    # el tablero se estrecha un poco para que la maqueta pueda crecer: las dos
    # cosas tienen que verse enteras y del mismo tamaño de importancia
    c += '<g transform="translate(4 30) scale(.86)">'
    c += B._tablero()
    c += _plano()
    c += '</g>'
    # la maqueta, mayor que en la escena base y con el hueco de la puerta en el
    # mismo sitio que en el plano: esa correspondencia es el estudio entero
    c += '<g transform="translate(-166 -44) scale(1.2)">'
    c += B._maqueta()
    c += '</g>'
    c += '<g transform="translate(4 30) scale(.86)">'
    c += B._portaminas()
    c += '</g>'

    c += M.velo(P, MESA - 6, 42, op=.24)
    c += M.vineta(P, .82)
    return svg(c, B._defs())
