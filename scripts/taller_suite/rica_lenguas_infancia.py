# -*- coding: utf-8 -*-
"""Lenguas inventadas · variante AGE_0_12 (R65 · fase 2).

**Mismo estudio, mismo proceso, misma calidad.** Un papel en vez de cinco.

La escena base pone sobre la mesa la tabla de sonidos, el cuadro de vocales, la
hoja del alfabeto, el paradigma de la gramática y el fichero del diccionario.
Las cinco cosas son de verdad y las cinco hacen falta para inventar una lengua,
pero a los siete años lo que engancha es una sola: **inventarse las letras**.

Aquí queda eso:

* **seis signos grandes** en vez de dieciséis pequeños, en su cuadrícula, con
  los mismos trazos generados sobre la rejilla de tres por tres, así que siguen
  siendo de la misma familia;
* **el último, solo esbozado a lápiz**: el que se está inventando ahora;
* **la hoja de pruebas de trazo** al lado, con el mismo signo repetido cinco
  veces hasta que sale, cada vez un poco más firme. Eso es el oficio: repetir
  hasta que el trazo salga;
* la pluma destapada y el tintero, mayores que en la base;
* y **una sola ficha del diccionario**, grande, con su signo y su significado.

Sin tabla de sonidos, sin trapecio de vocales, sin paradigma. Los mismos signos
con el mismo trazo: **hay menos y son mayores**.
"""
from taller_suite.escenas_ricas import C, W, H, svg
from taller_suite import rica_comun as M
from taller_suite import rica_lenguas as B

k = C
P = B.P
MESA = 116


def _alfabeto_grande():
    """Seis signos grandes; el último todavía a lápiz."""
    x, y, w, h = 36, 152, 340, 200
    g = []
    cw, ch = 104, 88
    ox, oy = x + 18, y + 22
    for n in range(6):
        i, j = n % 3, n // 3
        cx = ox + i * cw + 40
        cy = oy + j * ch + 40
        g.append(f'<rect x="{M.r1(ox + i * cw)}" y="{M.r1(oy + j * ch)}" '
                 f'width="{M.r1(cw - 10)}" height="{M.r1(ch - 12)}" rx="4" '
                 f'fill="none" stroke="{k["grafito"]}" stroke-width="1.1" '
                 f'opacity=".4"/>')
        g.append(B._signo(cx, cy, 21, n * 4 + 3, w=5.4, op=.9, esbozo=(n == 5)))
        # el valor sonoro debajo, como bloque
        g.append(f'<rect x="{M.r1(cx - 16)}" y="{M.r1(cy + 30)}" '
                 f'width="{M.r1(24 + (n % 3) * 7)}" height="4" rx="2" '
                 f'fill="{k["grafito"]}" opacity="{.5 if n < 5 else .22}"/>')
    return B._hoja(x, y, w, h, -2, ''.join(g))


def _pruebas():
    """La hoja de pruebas: el mismo signo, cinco veces, cada vez más firme."""
    x, y, w, h = 386, 160, 216, 108
    g = ''.join(B._signo(x + 34 + i * 38, y + 54 + (i % 2) * 4, 15, 23,
                         w=4.2, op=.35 + i * .16, esbozo=(i == 0))
                for i in range(5))
    return B._hoja(x, y, w, h, 6, g)


def _ficha_grande():
    """Una sola ficha del diccionario, grande y escrita."""
    x, y = 358, 296
    g = ['<g transform="rotate(7 %s %s)">' % (x + 84, y + 34),
         M.sombra(x, y, 168, 68, op=.28, dx=6, dy=9, rx=3),
         f'<rect x="{x}" y="{y}" width="168" height="68" rx="3" '
         f'fill="url(#{P}_ficha)"/>',
         f'<rect x="{x}" y="{y}" width="168" height="68" rx="3" fill="none" '
         f'stroke="#b5ac9b" stroke-width=".9" opacity=".85"/>',
         B._signo(x + 34, y + 34, 18, 41, w=4.6, op=.9)]
    for j in range(3):
        g.append(f'<rect x="{x + 70}" y="{M.r1(y + 20 + j * 13)}" '
                 f'width="{M.r1(78 - j * 22)}" height="3.4" rx="1.7" '
                 f'fill="{k["grafito"]}" opacity=".55"/>')
    g.append('</g>')
    return ''.join(g)


def escena():
    c = M.pared(P, MESA + 6, vx=200, vy=6, vw=136, vh=90)
    c += M.banco(P, MESA, juntas=(), nudos=((320, 388, 8),))
    c += (f'<ellipse cx="210" cy="206" rx="260" ry="150" fill="url(#{P}_focosuelo)" '
          f'opacity=".46" filter="url(#b22)"/>')

    c += _alfabeto_grande()
    c += _pruebas()
    c += _ficha_grande()
    # la pluma y el tintero, mayores que en la base
    c += '<g transform="translate(-126 -54) scale(1.18)">'
    c += B._pluma_y_tintero(con_pruebas=False)
    c += '</g>'

    c += M.velo(P, MESA - 6, 40, op=.24)
    c += M.vineta(P, .82)
    return svg(c, B._defs())
