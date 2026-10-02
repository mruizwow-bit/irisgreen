# -*- coding: utf-8 -*-
"""Color · variante AGE_0_12 (R65 · fase 2).

**Mismo estudio, mismo proceso, misma calidad.** Menos cosas y mayores.

La escena base pone sobre la mesa la paleta con siete pocillos, el estudio de
las tres manzanas, la escala de valor de seis pasos, la carta de
complementarios, el tarro de agua turbia, dos tubos y el trapo. Es una mesa de
verdad, y por eso está llena. A los siete años, llena es ilegible.

Aquí queda **una sola cosa pasando, y grande**:

* **el pocillo de mezcla** en el centro, ocupando casi un tercio de la tarjeta:
  dos colores entrando y el pincel dentro, con las vetas de pigmento a medio
  girar y el verde saliendo ya en el centro. Mezclar es el estudio entero, y
  aquí se ve el momento exacto;
* **tres pocillos** alrededor con los tres primarios, en lugar de siete con
  primarios y secundarios;
* **una sola manzana pintada**, al lado y grande, **a medio modelar**: la mitad
  izquierda ya tiene su luz, su sombra violeta y su rebote, y la derecha sigue
  en color plano, con la línea de por dónde va. Esa es la lección: el color no
  es el tono;
* **tres pinceladas de la escala de valor**, no seis, pintadas con la misma
  función que en la base —estría de cerda, salida deshilachada y reborde de
  pigmento—;
* un tubo apretado con su hilo de pintura.

Ni tarro, ni trapo, ni carta de complementarios, ni escala de seis pasos. El
mismo dibujo, el mismo material y el mismo acabado: **solo que hay menos**.
"""
from taller_suite.escenas_ricas import C, W, H, svg
from taller_suite import rica_comun as M
from taller_suite import rica_color as B

k = C
P = B.P
MESA = 116


def _estudio_grande():
    """Una sola manzana, grande y a medio modelar."""
    x, y, w, h = 346, 150, 256, 216
    d = f'M{x} {y + 8} L{x + w - 8} {y} L{x + w} {y + h - 8} L{x + 8} {y + h} Z'
    g = [M.sombra(x, y, w, h, op=.3, dx=9, dy=12, rx=2),
         f'<path d="{d}" fill="url(#{P}_pliego)"/>',
         f'<path d="{d}" fill="none" stroke="#b5ac9b" stroke-width="1.2" opacity=".8"/>',
         f'<g clip-path="url(#{P}_cp_hoja_inf)">']
    cx, cy, r = x + 122, y + 92, 66
    lado = .34                                    # hasta aquí llega lo modelado
    # la sombra proyectada, en violeta: la sombra tiene color
    g.append(f'<ellipse cx="{M.r1(cx + r * .5)}" cy="{M.r1(cy + r * 1.02)}" '
             f'rx="{M.r1(r * .95)}" ry="{M.r1(r * .26)}" fill="{B.SEC[2]}" '
             f'opacity=".42" filter="url(#b5)"/>')
    g.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{B.PRIM[0]}" opacity=".94"/>')
    g.append(f'<clipPath id="{P}_cp_manzana"><circle cx="{cx}" cy="{cy}" r="{r}"/>'
             f'</clipPath>')
    g.append(f'<g clip-path="url(#{P}_cp_manzana)">')
    g.append(f'<circle cx="{M.r1(cx + r * .42)}" cy="{M.r1(cy + r * .44)}" '
             f'r="{r}" fill="{B.SEC[2]}" opacity=".4" filter="url(#b5)"/>')
    g.append(f'<circle cx="{M.r1(cx + r * .62)}" cy="{M.r1(cy + r * .6)}" '
             f'r="{M.r1(r * .7)}" fill="#4a2340" opacity=".32" filter="url(#b5)"/>')
    g.append(f'<circle cx="{M.r1(cx - r * .38)}" cy="{M.r1(cy - r * .42)}" '
             f'r="{M.r1(r * .62)}" fill="{B.SEC[0]}" opacity=".5" filter="url(#b5)"/>')
    g.append(f'<ellipse cx="{M.r1(cx - r * .42)}" cy="{M.r1(cy - r * .48)}" '
             f'rx="{M.r1(r * .2)}" ry="{M.r1(r * .13)}" fill="#fff3d8" opacity=".8" '
             f'filter="url(#b2)" transform="rotate(-30 {M.r1(cx - r * .42)} '
             f'{M.r1(cy - r * .48)})"/>')
    g.append(f'<path d="M{M.r1(cx - r)} {M.r1(cy + r * .5)} '
             f'a{r} {r} 0 0 0 {M.r1(r * 2)} 0" fill="none" stroke="{B.PRIM[1]}" '
             f'stroke-width="{M.r1(r * .2)}" opacity=".38" filter="url(#b2)"/>')
    g.append('</g>')
    # lo que todavía está plano: la mitad derecha
    g.append(f'<path d="M{M.r1(cx + r * lado)} {M.r1(cy - r)} '
             f'A{r} {r} 0 0 1 {M.r1(cx + r * lado)} {M.r1(cy + r)} Z" '
             f'fill="{B.PRIM[0]}" opacity=".94"/>')
    g.append(f'<path d="M{M.r1(cx + r * lado)} {M.r1(cy - r * .94)} '
             f'V{M.r1(cy + r * .94)}" stroke="{k["grafito"]}" stroke-width="1.6" '
             f'stroke-dasharray="7 5" opacity=".5"/>')
    # las tres pinceladas de la escala de valor
    for i in range(3):
        g.append(B._pincelada(x + 28 + i * 74, y + h - 40, 62, 30, B.PRIM[2],
                              s=i * 3 + 1, op=M.r2(1 - i * .26), cerdas=7))
    g.append(M.trazo(f'M{x + 24} {y + h - 64} h208', k['grafito'], w=1.2, op=.35,
                     halo=False))
    g.append('</g>')
    return ''.join(g)


def escena():
    c = M.pared(P, MESA + 6, vx=40, vy=6, vw=150, vh=98)
    c += M.banco(P, MESA, juntas=(), nudos=((324, 372, 9),))
    c += (f'<ellipse cx="200" cy="228" rx="260" ry="160" fill="url(#{P}_focosuelo)" '
          f'opacity=".5" filter="url(#b22)"/>')

    c += _estudio_grande()

    # la paleta y el pocillo de mezcla, a escala 1,4: el centro de la escena
    c += '<g transform="translate(-72 -142) scale(1.42)">'
    c += B._paleta([(-76, -10, B.PRIM[0]), (-46, 34, B.PRIM[1]), (34, 34, B.PRIM[2])])
    c += B._mezcla()
    c += B._pincel_en_pocillo()
    c += '</g>'

    # un solo tubo, apretado, con su hilo de pintura
    c += '<g transform="translate(-14 26) scale(1.15)">'
    c += (f'<g transform="rotate(-8 {36 + 46} {300 + 12})">'
          + M.sombra(36, 300, 96, 26, op=.3, dx=6, dy=9, rx=8)
          + f'<rect x="36" y="300" width="92" height="25" rx="7" '
            f'fill="url(#{P}_tubo)"/>'
          + ''.join(f'<path d="M{M.r1(58 + j * 15)} 301 q{M.r1(3 - j)} 12 0 23" '
                    f'fill="none" stroke="{k["noche"]}" stroke-width="1.6" '
                    f'opacity="{M.r2(.16 + j * .05)}"/>' for j in range(3))
          + f'<rect x="36" y="300" width="26" height="25" rx="4" fill="{B.PRIM[2]}" '
            f'opacity=".9"/>'
          + f'<rect x="124" y="307" width="14" height="11" rx="2" '
            f'fill="url(#{P}_metal)"/>'
          + M.brillo_borde('M44 304 h72', w=2.4, op=.4)
          + '</g>')
    c += '</g>'
    c += (f'<path d="M172 386 q16 5 30 0 q14 -5 26 2" fill="none" '
          f'stroke="{B.PRIM[2]}" stroke-width="9" stroke-linecap="round"/>')
    c += (f'<path d="M174 383 q16 5 28 0" fill="none" stroke="#6b9fd8" '
          f'stroke-width="2.4" opacity=".5" stroke-linecap="round"/>')

    c += M.velo(P, MESA - 6, 42, op=.24)
    c += M.vineta(P, .82)
    # el recorte de la hoja de esta variante, que es mayor que la de la base
    defs = B._defs() + M.clip(
        f'{P}_cp_hoja_inf',
        'M346 158 L594 150 L602 358 L354 366 Z')
    return svg(c, defs)
