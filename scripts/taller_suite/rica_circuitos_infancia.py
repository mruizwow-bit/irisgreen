# -*- coding: utf-8 -*-
"""Circuitos · variante AGE_0_12 (R65 · fase 2).

**Mismo estudio, mismo proceso, misma calidad.** Lo que cambia es la densidad.

La escena base enseña tres ramas a la vez —encendida, zumbador y sin terminar—,
un esquema con símbolos normalizados y el pelacables. Son muchas cosas
mirándose entre ellas, y a 172 px una persona de siete años no sabe dónde mirar.

Aquí hay **un solo circuito**, y ocupa la escena entera:

* la pila, grande y de frente;
* **dos cables gordos** que van de la pila al interruptor y del interruptor a la
  bombilla, y se pueden seguir con el dedo de punta a punta;
* el interruptor cerrado, con la palanca tocando;
* **la bombilla encendida**, que es lo primero que se ve: filamento al rojo y su
  charco de luz sobre la madera;
* y, aparte, una segunda bombilla apagada con su cable suelto y la pinza
  abierta. Es lo único que queda por hacer, y se ve cuál es.

No hay esquema, ni zumbador, ni herramientas, ni segunda rama compitiendo. Los
mismos objetos dibujados con el mismo detalle —el mismo portalámparas, la misma
pinza con sus dientes y su muelle, el mismo filamento—, solo que **hay menos y
son mayores**. Nada de estética bebé, nada con cara.
"""
from taller_suite.escenas_ricas import C, W, H, svg
from taller_suite import rica_comun as M
from taller_suite import rica_circuitos as B

k = C
P = B.P
MESA = 118


def escena():
    c = M.pared(P, MESA + 6, vx=452, vy=8, vw=150, vh=100)
    c += M.banco(P, MESA, juntas=(),
                 nudos=((96, 356, 9),))
    c += (f'<ellipse cx="300" cy="230" rx="280" ry="160" '
          f'fill="url(#{P}_focosuelo)" opacity=".42" filter="url(#b22)"/>')

    # ── el circuito, uno solo y grande ───────────────────────────────────────
    # A 1,45 de escala los mismos objetos de la escena base llenan la tarjeta y
    # cada pieza se distingue a 172 px sin apretar la vista.
    c += '<g transform="translate(26 -48) scale(1.45)">'
    c += B._pila(28, 214)
    c += B._cable('M54 196 C58 160 92 142 134 142', B.ROJO, w=7)
    c += B._interruptor(136, 132, cerrado=True)
    c += B._cable('M200 145 C226 154 236 172 240 190', B.ROJO, w=7)
    c += B._bombilla(258, 168, encendida=True)
    c += B._cable('M275 210 C286 240 264 262 232 268', B.NEGRO, w=7)
    c += B._cable('M232 268 C176 280 124 288 94 292', B.NEGRO, w=7)
    c += B._pinza(66, 202, -74, B.ROJO)
    c += B._pinza(96, 296, 8, B.NEGRO)
    c += '</g>'

    # ── lo único que queda por hacer ─────────────────────────────────────────
    # La segunda bombilla y su cable, con la pinza abierta justo encima del
    # cable negro del circuito: el salto que falta es corto y se ve de un golpe,
    # que es lo que cambia respecto a la escena base.
    c += '<g transform="translate(317 115) scale(1.25)">'
    c += B._bombilla(122, 108, encendida=False)
    c += B._cable('M105 150 C88 166 70 172 56 172', B.ROJO, w=7)
    c += B._pinza(50, 170, 196, B.ROJO, abierta=True)
    c += '</g>'
    # el salto que falta, con la misma marca que en la escena base
    c += (f'<path d="M372 338 C368 330 366 324 368 318" fill="none" '
          f'stroke="{B.ROJO}" stroke-width="2.4" opacity=".6" '
          f'stroke-dasharray="5 5"/>')

    c += M.velo(P, MESA - 6, 42, op=.24)
    c += M.vineta(P, .82)
    return svg(c, B._defs())
