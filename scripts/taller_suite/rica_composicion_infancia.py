# -*- coding: utf-8 -*-
"""Composición · variante AGE_0_12 (R65 · fase 2).

**Mismo estudio, mismo proceso, misma calidad.** Menos soportes a la vez.

La escena base enseña **tres** soportes de lo mismo —teclado, rollo perforado y
papel pautado—, más el metrónomo, el lápiz y la goma. La idea es preciosa y es la
que define el estudio, pero pedirle a alguien de siete años que relacione tres
notaciones a la vez, a 172 px, es pedirle demasiado.

Aquí quedan **dos**, y la relación entre ellas es directa:

* **el teclado, grande**, con las tres teclas del acorde hundidas y el fieltro
  rojo asomando: se ve qué se está tocando;
* **el rollo perforado**, saliendo del carrete justo debajo, con los agujeros de
  **ese mismo acorde** y de la melodía, mayores que en la base y menos
  apretados. Teclas abajo, agujeros arriba, y se entiende que son lo mismo;
* el metrónomo, con la varilla inclinada: está andando.

Fuera el papel pautado con sus plicas, sus corcheas unidas, su ligadura y su
compás borrado. Eso es notación culta y tiene su momento, pero no aquí.

El mismo teclado, el mismo rollo y los mismos agujeros con su canto oscuro y su
sombra dentro. **Hay menos y son mayores**, nada más.
"""
from taller_suite.escenas_ricas import C, W, H, svg
from taller_suite import rica_comun as M
from taller_suite import rica_composicion as B

k = C
P = B.P
MESA = 108


def escena():
    c = M.pared(P, MESA + 6, vx=232, vy=6, vw=144, vh=86)
    c += M.banco(P, MESA, juntas=(), nudos=((596, 366, 8),))
    c += (f'<ellipse cx="250" cy="200" rx="270" ry="150" fill="url(#{P}_focosuelo)" '
          f'opacity=".46" filter="url(#b22)"/>')

    # el teclado y el rollo, a escala 1,22 y bien centrados: son lo único
    c += '<g transform="translate(-24 -74) scale(1.22)">'
    c += B._teclado()
    c += B._rollo()
    c += '</g>'

    # el metrónomo, algo mayor y arrinconado a la derecha
    c += '<g transform="translate(-90 -30) scale(1.05)">'
    c += B._metronomo()
    c += '</g>'

    c += M.velo(P, MESA - 6, 40, op=.24)
    c += M.vineta(P, .82)
    return svg(c, B._defs())
