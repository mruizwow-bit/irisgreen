# -*- coding: utf-8 -*-
"""Síntesis y paisajes sonoros · variante AGE_0_12 (R65 · fase 2).

**Mismo estudio, mismo proceso, misma calidad.** Un módulo en vez de tres.

La escena base tiene tres módulos en su bastidor, nueve jacks, tres cables
cruzados, cuatro deslizadores, seis mandos, un osciloscopio, la hoja del paisaje
sonoro y los auriculares. Es un modular de verdad, y un modular de verdad
abruma; de hecho abruma también a los mayores la primera vez.

Aquí queda **un solo módulo, grande**, y dentro de él lo que de verdad enseña
este estudio:

* **el osciloscopio**, ocupando media tarjeta, con la misma onda calculada de la
  base —fundamental más tres armónicos— y su estela de fósforo. Se ve el sonido;
* **tres mandos grandes**, con su cuerpo estriado, su índice y su escala grabada;
* **dos jacks y un cable gordo** que va de uno a otro, colgando por su peso: se
  sigue con el dedo de un extremo al otro;
* **un segundo cable con la clavija en el aire** y su jack libre esperando. Eso
  es lo único que queda por hacer;
* los auriculares al lado, apoyados.

Sin bastidor de tres, sin deslizadores, sin hoja de capas. El mismo aparato
dibujado con el mismo detalle: **hay menos y es mayor**.
"""
import math

from taller_suite.escenas_ricas import C, W, H, svg
from taller_suite import rica_comun as M
from taller_suite import rica_sintesis as B

k = C
P = B.P
MESA = 112

MX, MY, MW, MH = 52, 146, 356, 186


def _modulo():
    """Un solo módulo, con el osciloscopio grande y tres mandos."""
    g = [M.contacto(MX - 6, MY + MH + 8, MW + 12, op=.44, alto=9),
         M.sombra(MX, MY, MW, MH, op=.36, dx=13, dy=16, rx=7),
         f'<rect x="{MX - 11}" y="{MY - 11}" width="{MW + 22}" height="{MH + 22}" '
         f'rx="8" fill="url(#{P}_rack)"/>',
         f'<rect x="{MX - 11}" y="{MY - 11}" width="{MW + 22}" height="7" rx="3.5" '
         f'fill="#ffffff" opacity=".22"/>',
         f'<rect x="{MX}" y="{MY}" width="{MW}" height="{MH}" rx="4" '
         f'fill="url(#{P}_panel)"/>',
         f'<rect x="{MX}" y="{MY}" width="{MW}" height="5" rx="2.5" fill="#ffffff" '
         f'opacity=".24"/>']
    # los cuatro tornillos
    for ty in (MY + 11, MY + MH - 11):
        for tx in (MX + 15, MX + MW - 15):
            g.append(f'<circle cx="{tx}" cy="{ty}" r="4.6" fill="url(#{P}_metal)"/>')
            g.append(f'<path d="M{tx - 3} {ty} h6" stroke="{k["noche"]}" '
                     f'stroke-width="1.4" opacity=".55"/>')
    # el osciloscopio, grande
    g.append(B._osciloscopio(MX + 26, MY + 22, MW - 52, 88))
    # los tres mandos
    for dx, ang, col in ((0, -140, '#e0473c'), (78, -40, '#f0b419'), (156, 40, '#4dc4bd')):
        g.append(B._mando(MX + 62 + dx, MY + 142, 22, ang, col=col))
    # los dos jacks
    g.append(B._jack(MX + 296, MY + 130, conectado=True, col='#4dc4bd'))
    g.append(B._jack(MX + 296, MY + 164, conectado=False, col='#4dc4bd'))
    return ''.join(g)


def escena():
    c = M.pared(P, MESA + 6, vx=452, vy=6, vw=140, vh=90)
    c += M.banco(P, MESA, juntas=(), nudos=((520, 372, 8),))
    c += (f'<ellipse cx="220" cy="200" rx="260" ry="150" fill="url(#{P}_focosuelo)" '
          f'opacity=".42" filter="url(#b22)"/>')
    c += (f'<ellipse cx="{MX + MW / 2}" cy="{MY + 66}" rx="150" ry="94" '
          f'fill="{B.VERDE}" opacity=".07" filter="url(#b22)"/>')

    c += _modulo()
    # el cable que sí está puesto, de un jack al otro lado del módulo
    c += B._cable_parcheo(MX + 296, MY + 130, MX + 34, MY + 166, '#4dc4bd', 86)
    # el que falta: sale del jack libre y su clavija espera en el aire
    c += B._cable_parcheo(MX + 296, MY + 164, 470, 316, '#e0473c', 42)
    c += B._clavija_suelta(478, 310, 26, '#e0473c')
    # los auriculares, apoyados
    c += '<g transform="translate(196 -16) scale(.95)">'
    c += B._auriculares()
    c += '</g>'

    c += M.velo(P, MESA - 6, 40, op=.24)
    c += M.vineta(P, .82)
    return svg(c, B._defs())
