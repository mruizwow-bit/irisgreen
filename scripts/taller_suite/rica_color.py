# -*- coding: utf-8 -*-
"""Escena rica de Color (R65 · tanda 2).

La mesa donde se mezcla, no la rueda de color de manual.

Lo que se ve:

* la paleta de porcelana con sus pocillos: los primarios puestos, y en el
  pocillo grande **dos colores entrando y todavía sin mezclar del todo**, con la
  espiral a medio girar. Ese es el momento que cuenta la escena;
* la pintura es materia: los charcos tienen brillo especular, borde más oscuro
  donde el pigmento se acumula y un poco de espesor;
* el pincel **dentro** del pocillo grande, con el mango apoyado en el canto y
  la carga de color en la punta;
* los tubos apretados, con la abolladura y el hilo de pintura saliendo;
* la tira de pruebas secándose: seis manchas pintadas con la **escala de valor**
  de una de ellas debajo, de la más clara a la más oscura, y las anotaciones a
  lápiz al margen;
* el tarro con agua turbia y los pinceles dentro, con la refracción quebrando
  los mangos al cruzar la superficie;
* la carta de complementarios a un lado, de papel y ya manchada de uso.

Nada de personajes. La rueda no es el tema: el tema es mezclar.
"""
from taller_suite.escenas_ricas import C, W, H, svg, lg, rg
from taller_suite import rica_comun as M

k = C
P = 'co'

MESA = 142

# Primarios y secundarios de la escena. Pigmentos, no tinta de imprenta.
PRIM = ['#c8322c', '#f0b419', '#1f5fa8']
SEC = ['#e2701f', '#2f8f4e', '#5f3f97']

PALETA_CX, PALETA_CY = 236, 288          # la paleta grande
POCILLO = (236, 268, 56, 40)             # el pocillo donde se está mezclando



def _pincelada(x, y, largo, alto, color, *, s=1.0, op=.92, cerdas=7):
    """Una pincelada: borde irregular, estrías de cerda y pigmento acumulado.

    Pintar con elipses es lo que hacía que la escena pareciera un adhesivo. Una
    pincelada real tiene el canto de entrada limpio, el de salida deshilachado,
    surcos donde separan las cerdas y un reborde más oscuro donde el agua
    arrastra el pigmento al secarse.
    """
    g = []
    # el cuerpo, con el perfil superior e inferior ondulado
    arr = ' '.join(f'Q{M.r1(x + largo * (i + .5) / 5)} '
                   f'{M.r1(y - alto / 2 + (M.n(i, s) - .5) * alto * .34)} '
                   f'{M.r1(x + largo * (i + 1) / 5)} '
                   f'{M.r1(y - alto / 2 + (M.n(i, s + 3) - .5) * alto * .2)}'
                   for i in range(5))
    aba = ' '.join(f'Q{M.r1(x + largo * (5 - i - .5) / 5)} '
                   f'{M.r1(y + alto / 2 + (M.n(i, s + 7) - .5) * alto * .34)} '
                   f'{M.r1(x + largo * (5 - i - 1) / 5)} '
                   f'{M.r1(y + alto / 2 + (M.n(i, s + 11) - .5) * alto * .2)}'
                   for i in range(5))
    d = f'M{M.r1(x)} {M.r1(y - alto / 2)} {arr} {aba} Z'
    g.append(f'<path d="{d}" fill="{color}" opacity="{op}"/>')
    # reborde de pigmento acumulado
    g.append(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="2.4" '
             f'opacity="{M.r2(op * .5)}" filter="url(#b2)"/>')
    # estrías de cerda: unas claras, otras oscuras
    for i in range(cerdas):
        yy = y - alto * .38 + i * (alto * .76 / max(cerdas - 1, 1))
        x0 = x + largo * (.06 + M.n(i, s + 13) * .2)
        x1 = x + largo * (.72 + M.n(i, s + 17) * .26)
        g.append(f'<path d="M{M.r1(x0)} {M.r1(yy)} '
                 f'Q{M.r1((x0 + x1) / 2)} {M.r1(yy + (M.n(i, s + 19) - .5) * 3)} '
                 f'{M.r1(x1)} {M.r1(yy)}" fill="none" '
                 f'stroke="{"#ffffff" if i % 2 else k["noche"]}" '
                 f'stroke-width="{M.r2(.6 + M.n(i, s + 23) * 1.1)}" '
                 f'opacity="{M.r2(.08 + M.n(i, s + 29) * .13)}" stroke-linecap="round"/>')
    # la salida, deshilachada
    for i in range(4):
        yy = y - alto * .3 + i * alto * .2
        g.append(f'<path d="M{M.r1(x + largo * .92)} {M.r1(yy)} '
                 f'l{M.r1(4 + M.n(i, s + 31) * 12)} {M.r1((M.n(i, s + 37) - .5) * 4)}" '
                 f'fill="none" stroke="{color}" '
                 f'stroke-width="{M.r2(1 + M.n(i, s + 41) * 2)}" '
                 f'opacity="{M.r2(op * (.35 + M.n(i, s + 43) * .4))}" '
                 f'stroke-linecap="round"/>')
    return ''.join(g)


def _charco(cx, cy, rx, ry, color, *, brillo=.5, id_=''):
    """Un charco de pintura: borde acumulado, cuerpo y brillo especular."""
    return (
        # el pigmento se acumula en el borde y ahí es más oscuro
        f'<ellipse cx="{M.r1(cx)}" cy="{M.r1(cy)}" rx="{M.r1(rx)}" ry="{M.r1(ry)}" '
        f'fill="{color}"/>'
        f'<ellipse cx="{M.r1(cx)}" cy="{M.r1(cy)}" rx="{M.r1(rx)}" ry="{M.r1(ry)}" '
        f'fill="none" stroke="{k["noche"]}" stroke-width="{M.r2(rx * .12)}" '
        f'opacity=".28"/>'
        f'<ellipse cx="{M.r1(cx)}" cy="{M.r1(cy + ry * .12)}" rx="{M.r1(rx * .82)}" '
        f'ry="{M.r1(ry * .78)}" fill="#ffffff" opacity=".08" filter="url(#b2)"/>'
        # el brillo: la ventana reflejada en la superficie húmeda
        f'<ellipse cx="{M.r1(cx - rx * .34)}" cy="{M.r1(cy - ry * .38)}" '
        f'rx="{M.r1(rx * .3)}" ry="{M.r1(ry * .22)}" fill="#ffffff" '
        f'opacity="{M.r2(brillo)}" filter="url(#b2)" '
        f'transform="rotate(-24 {M.r1(cx - rx * .34)} {M.r1(cy - ry * .38)})"/>')


def _mezcla():
    """El pocillo grande: dos colores entrando y la espiral a medio girar."""
    cx, cy, rx, ry = POCILLO
    g = [f'<g clip-path="url(#{P}_cp_pocillo)">']
    # el fondo del pocillo, ya con la base amarilla
    g.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{PRIM[1]}"/>')
    # el azul entrando por la derecha, todavía en lengua
    g.append(f'<path d="M{cx + rx} {cy - ry * .5} C{cx + 10} {cy - 30} {cx - 6} {cy - 4} '
             f'{cx + 12} {cy + 14} C{cx + 26} {cy + 28} {cx + rx} {cy + ry * .5} '
             f'{cx + rx} {cy} Z" fill="{PRIM[2]}" opacity=".95"/>')
    # El arrastre del pincel. No es una espiral de dibujo animado: son vetas de
    # pigmento de anchura y opacidad desiguales, cada una con su propio arco, que
    # es lo que hace la cerda al girar dentro de la pintura. En el centro ya se
    # han tocado del todo y sale el verde; hacia fuera siguen separados.
    import math as _m
    for i in range(26):
        t = i / 25
        a0 = -2.4 + t * 5.6 + M.n(i, 3.7) * .5
        rr = rx * (.94 - t * .66) * (.9 + M.n(i, 5.1) * .22)
        ry2 = rr * ry / rx
        x0 = cx + rr * _m.cos(a0)
        y0 = cy + ry2 * _m.sin(a0)
        a1 = a0 + 1.5 + M.n(i, 9.3) * 1.3
        x1 = cx + rr * .82 * _m.cos(a1)
        y1 = cy + ry2 * .82 * _m.sin(a1)
        xm = cx + rr * 1.06 * _m.cos((a0 + a1) / 2)
        ym = cy + ry2 * 1.06 * _m.sin((a0 + a1) / 2)
        col = SEC[1] if t > .55 else (PRIM[2] if i % 2 else SEC[1])
        g.append(f'<path d="M{M.r1(x0)} {M.r1(y0)} Q{M.r1(xm)} {M.r1(ym)} '
                 f'{M.r1(x1)} {M.r1(y1)}" fill="none" stroke="{col}" '
                 f'stroke-width="{M.r2(2 + M.n(i, 7.9) * 6)}" '
                 f'opacity="{M.r2(.35 + M.n(i, 11.3) * .5)}" stroke-linecap="round"/>')
    # el centro, ya mezclado del todo
    g.append(f'<ellipse cx="{cx - 8}" cy="{cy + 4}" rx="20" ry="13" fill="{SEC[1]}" '
             f'opacity=".7" filter="url(#b5)"/>')
    # el surco que deja la cerda: líneas finas más claras encima
    for i in range(9):
        a0 = -1.9 + i * .38
        g.append(f'<path d="M{M.r1(cx + rx * .8 * _m.cos(a0))} '
                 f'{M.r1(cy + ry * .8 * _m.sin(a0))} '
                 f'Q{M.r1(cx + rx * .3 * _m.cos(a0 + .8))} '
                 f'{M.r1(cy + ry * .3 * _m.sin(a0 + .8))} {M.r1(cx)} {M.r1(cy)}" '
                 f'fill="none" stroke="#ffffff" stroke-width=".9" '
                 f'opacity="{M.r2(.1 + M.n(i, 2.7) * .14)}"/>')
    g.append('</g>')
    # borde y brillo del pocillo
    g.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="none" '
             f'stroke="#cfcac0" stroke-width="3.4"/>')
    g.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="none" '
             f'stroke="{k["noche"]}" stroke-width="1.2" opacity=".3"/>')
    g.append(M.brillo_borde(f'M{cx - rx + 6} {cy - ry * .5} A{rx} {ry} 0 0 1 {cx + 6} '
                            f'{cy - ry + 1}', w=2.4, op=.55))
    return ''.join(g)


def _paleta(pocillos=None):
    """La paleta de porcelana: pocillos pequeños alrededor del grande.

    `pocillos` permite quedarse con menos, que es lo que hace la variante
    AGE_0_12. Sin argumento, la paleta es exactamente la misma de siempre.
    """
    g = [M.sombra(140, 232, 196, 108, op=.32, dx=10, dy=13, rx=52),
         f'<ellipse cx="{PALETA_CX}" cy="{PALETA_CY}" rx="98" ry="56" '
         f'fill="url(#{P}_porcelana)"/>',
         # el canto: la paleta tiene espesor, no es un recorte
         f'<path d="M{PALETA_CX - 98} {PALETA_CY} a98 56 0 0 0 196 0 v7 '
         f'a98 56 0 0 1 -196 0 Z" fill="#b6ae9f"/>',
         f'<ellipse cx="{PALETA_CX}" cy="{PALETA_CY}" rx="98" ry="56" fill="none" '
         f'stroke="{k["noche"]}" stroke-width="1.6" opacity=".3"/>',
         # sombra interior del borde que mira a la luz
         f'<ellipse cx="{PALETA_CX - 3}" cy="{PALETA_CY - 3}" rx="94" ry="52" '
         f'fill="none" stroke="{k["noche"]}" stroke-width="6" opacity=".12" '
         f'filter="url(#b5)"/>',
         M.brillo_borde(f'M{PALETA_CX - 84} {PALETA_CY - 26} A98 56 0 0 1 '
                        f'{PALETA_CX + 10} {PALETA_CY - 55}', w=3, op=.6)]
    # pocillos pequeños: los primarios y dos secundarios ya mezclados
    pocillos = pocillos or [(-72, -14, PRIM[0]), (-58, 24, PRIM[1]), (0, 36, PRIM[2]),
                            (62, 22, SEC[0]), (74, -16, SEC[2])]
    for i, (dx, dy, col) in enumerate(pocillos):
        cx, cy = PALETA_CX + dx, PALETA_CY + dy
        # el hueco: canto iluminado arriba, sombra interior abajo
        g.append(f'<ellipse cx="{cx}" cy="{cy}" rx="19.5" ry="13.5" fill="#e8e3d9"/>')
        g.append(f'<ellipse cx="{cx}" cy="{cy + 1.5}" rx="17.5" ry="11.5" '
                 f'fill="#b9b3a7"/>')
        g.append(f'<ellipse cx="{cx - 1}" cy="{cy - 1}" rx="17" ry="11" '
                 f'fill="{k["noche"]}" opacity=".18" filter="url(#b2)"/>')
        g.append(_charco(cx, cy + 2, 15, 9.5, col, brillo=.45))
        # espesor: el pigmento no es una capa lisa
        for j in range(5):
            g.append(f'<ellipse cx="{M.r1(cx - 9 + M.n(i * 7 + j, 3.1) * 18)}" '
                     f'cy="{M.r1(cy - 3 + M.n(i * 7 + j, 6.7) * 10)}" '
                     f'rx="{M.r1(2 + M.n(i * 7 + j, 8.9) * 4)}" '
                     f'ry="{M.r1(1.4 + M.n(i * 7 + j, 4.3) * 2.4)}" '
                     f'fill="{"#ffffff" if j % 2 else k["noche"]}" '
                     f'opacity="{M.r2(.07 + M.n(i * 7 + j, 2.1) * .1)}" '
                     f'filter="url(#b2)"/>')
    return ''.join(g)


def _pincel_en_pocillo():
    """El pincel dentro del pocillo, con el mango apoyado en el canto."""
    return ('<g transform="rotate(-38 300 250)">'
            + M.sombra(268, 190, 18, 116, op=.24, dx=5, dy=8, rx=6, sesgo=-.1)
            + f'<rect x="271" y="112" width="11" height="118" rx="5.5" fill="#7b3f2a"/>'
            + f'<rect x="272.5" y="112" width="3.4" height="118" rx="1.7" fill="#b9714f" '
              f'opacity=".8"/>'
            + f'<rect x="268" y="228" width="17" height="22" rx="2" '
              f'fill="url(#{P}_metal)"/>'
            + f'<path d="M269 248 C266 262 268 278 276.5 288 C285 278 287 262 284 248 Z" '
              f'fill="#2f4a66"/>'
            + f'<path d="M272 256 C270 266 272 278 276.5 284 C281 278 283 266 281 256 Z" '
              f'fill="{SEC[1]}"/>'
            + M.brillo_borde('M273.5 116 L273.5 224', color='#e6a582', w=1.6, op=.5)
            + '</g>')


def _tubos():
    """Tubos apretados, con su abolladura y el hilo de pintura saliendo."""
    g = []
    for i, (x, y, rot, col) in enumerate(((36, 300, -8, PRIM[0]),
                                          (52, 350, 6, PRIM[2]))):
        g.append(f'<g transform="rotate({rot} {x + 46} {y + 12})">')
        g.append(M.sombra(x, y, 96, 26, op=.3, dx=6, dy=9, rx=8))
        g.append(f'<rect x="{x}" y="{y}" width="92" height="25" rx="7" '
                 f'fill="url(#{P}_tubo)"/>')
        # la abolladura: dos pliegues y una sombra
        for j in range(3):
            g.append(f'<path d="M{M.r1(x + 22 + j * 15)} {y + 1} '
                     f'q{M.r1(3 - j)} 12 0 23" fill="none" stroke="{k["noche"]}" '
                     f'stroke-width="1.6" opacity="{M.r2(.16 + j * .05)}"/>')
        g.append(f'<rect x="{x}" y="{y}" width="26" height="25" rx="4" fill="{col}" '
                 f'opacity=".9"/>')
        g.append(f'<rect x="{x + 88}" y="{y + 7}" width="14" height="11" rx="2" '
                 f'fill="url(#{P}_metal)"/>')
        g.append(M.brillo_borde(f'M{x + 8} {y + 4} h72', w=2.4, op=.4))
        g.append('</g>')
    # el hilo de pintura que ha salido del segundo tubo
    g.append(f'<path d="M158 372 q14 4 26 0 q12 -4 22 2" fill="none" stroke="{PRIM[2]}" '
             f'stroke-width="7" stroke-linecap="round"/>')
    g.append(f'<path d="M160 370 q14 4 24 0" fill="none" stroke="#6b9fd8" '
             f'stroke-width="2" opacity=".5" stroke-linecap="round"/>')
    return ''.join(g)


def _estudio():
    """El estudio que se está pintando: la misma forma tres veces.

    Plana, modelada y **la tercera a medio hacer**. Es lo que se aprende en este
    estudio: que el color no es el tono, y que la luz se construye. Debajo, la
    escala de valor de uno de los pigmentos, pintada a mano.
    """
    x, y, w, h = 350, 168, 244, 148
    d = f'M{x} {y + 6} L{x + w - 7} {y} L{x + w} {y + h - 7} L{x + 7} {y + h} Z'
    g = [M.sombra(x, y, w, h, op=.3, dx=8, dy=11, rx=2),
         f'<path d="{d}" fill="url(#{P}_pliego)"/>',
         f'<path d="{d}" fill="none" stroke="#b5ac9b" stroke-width="1" opacity=".8"/>',
         f'<g clip-path="url(#{P}_cp_papel)">']

    def manzana(cx, cy, r, etapa):
        """Etapa 0: plana. 1: modelada. 2: a medio modelar."""
        out = [f'<circle cx="{M.r1(cx)}" cy="{M.r1(cy)}" r="{M.r1(r)}" fill="{PRIM[0]}" '
               f'opacity=".93"/>']
        if etapa == 0:
            return ''.join(out)
        # la sombra propia, en violeta: el color de la sombra no es el negro
        lado = 1 if etapa == 1 else .42          # a medias solo llega hasta aquí
        out.append(f'<clipPath id="{P}_cpm{etapa}"><circle cx="{M.r1(cx)}" '
                   f'cy="{M.r1(cy)}" r="{M.r1(r)}"/></clipPath>')
        out.append(f'<g clip-path="url(#{P}_cpm{etapa})">')
        out.append(f'<circle cx="{M.r1(cx + r * .42)}" cy="{M.r1(cy + r * .44)}" '
                   f'r="{M.r1(r * 1.0)}" fill="{SEC[2]}" opacity=".55" '
                   f'filter="url(#b5)"/>')
        out.append(f'<circle cx="{M.r1(cx + r * .62)}" cy="{M.r1(cy + r * .6)}" '
                   f'r="{M.r1(r * .7)}" fill="#4a2340" opacity=".5" filter="url(#b5)"/>')
        # la luz, en naranja cálido, y el especular
        out.append(f'<circle cx="{M.r1(cx - r * .38)}" cy="{M.r1(cy - r * .42)}" '
                   f'r="{M.r1(r * .62)}" fill="{SEC[0]}" opacity=".5" filter="url(#b5)"/>')
        out.append(f'<ellipse cx="{M.r1(cx - r * .42)}" cy="{M.r1(cy - r * .48)}" '
                   f'rx="{M.r1(r * .2)}" ry="{M.r1(r * .13)}" fill="#fff3d8" '
                   f'opacity=".75" filter="url(#b2)" '
                   f'transform="rotate(-30 {M.r1(cx - r * .42)} {M.r1(cy - r * .48)})"/>')
        # rebote frío del papel por debajo
        out.append(f'<path d="M{M.r1(cx - r)} {M.r1(cy + r * .5)} '
                   f'a{M.r1(r)} {M.r1(r)} 0 0 0 {M.r1(r * 2)} 0" fill="none" '
                   f'stroke="{PRIM[1]}" stroke-width="{M.r1(r * .2)}" opacity=".35" '
                   f'filter="url(#b2)"/>')
        out.append('</g>')
        if etapa == 2:
            # lo que aún está plano: se tapa la mitad derecha con el color base
            out.append(f'<path d="M{M.r1(cx + r * lado)} {M.r1(cy - r)} '
                       f'A{M.r1(r)} {M.r1(r)} 0 0 1 {M.r1(cx + r * lado)} {M.r1(cy + r)} Z" '
                       f'fill="{PRIM[0]}" opacity=".93"/>')
            out.append(f'<path d="M{M.r1(cx + r * lado)} {M.r1(cy - r * .92)} '
                       f'V{M.r1(cy + r * .92)}" stroke="{k["grafito"]}" '
                       f'stroke-width=".9" stroke-dasharray="4 3" opacity=".45"/>')
        # sombra proyectada sobre el papel
        out.insert(0, f'<ellipse cx="{M.r1(cx + r * .5)}" cy="{M.r1(cy + r * 1.02)}" '
                      f'rx="{M.r1(r * .95)}" ry="{M.r1(r * .26)}" fill="{SEC[2]}" '
                      f'opacity=".4" filter="url(#b5)"/>')
        return ''.join(out)

    for i in range(3):
        g.append(manzana(x + 46 + i * 74, y + 50, 27, i))
    # la escala de valor, pintada a mano
    for i in range(6):
        g.append(_pincelada(x + 24 + i * 34, y + h - 34, 30, 19, PRIM[2],
                            s=i * 3 + 1, op=M.r2(1 - i * .15), cerdas=5))
    g.append(M.trazo(f'M{x + 20} {y + h - 50} h206', k['grafito'], w=1, op=.35,
                     halo=False))
    # anotaciones a lápiz bajo cada manzana
    for i in range(3):
        cx = x + 46 + i * 74
        g.append(f'<rect x="{M.r1(cx - 22)}" y="{y + 92}" width="{M.r1(30 + i * 6)}" '
                 f'height="2.6" rx="1.3" fill="{k["grafito"]}" opacity=".45"/>')
    g.append('</g>')
    return ''.join(g)


def _tarro():
    """El tarro de agua turbia con los pinceles: la refracción quiebra los mangos."""
    cx, cy = 566, 306
    g = [M.contacto(cx - 40, cy + 62, 80, op=.42, alto=8),
         M.sombra(cx - 38, cy - 38, 76, 96, op=.3, dx=10, dy=12, rx=8, sesgo=-.2)]
    # los mangos, por encima de la línea del agua
    for dx, rot, col in ((-14, -14, '#7b3f2a'), (6, 9, '#2b4257'), (18, 20, '#8a6a3a')):
        g.append(f'<g transform="rotate({rot} {cx + dx} {cy - 26})">'
                 f'<rect x="{cx + dx - 5}" y="{cy - 128}" width="10" height="104" rx="5" '
                 f'fill="{col}"/>'
                 f'<rect x="{cx + dx - 3}" y="{cy - 128}" width="3" height="104" rx="1.5" '
                 f'fill="#ffffff" opacity=".28"/></g>')
    # el vidrio del tarro
    g.append(f'<path d="M{cx - 36} {cy - 38} L{cx - 33} {cy + 58} '
             f'Q{cx} {cy + 68} {cx + 33} {cy + 58} L{cx + 36} {cy - 38} Z" '
             f'fill="url(#{P}_vidriocuerpo)"/>')
    # el agua turbia, con el verde de haber lavado
    g.append(f'<g clip-path="url(#{P}_cp_tarro)">')
    g.append(f'<path d="M{cx - 35} {cy - 12} L{cx - 33} {cy + 58} '
             f'Q{cx} {cy + 68} {cx + 33} {cy + 58} L{cx + 35} {cy - 12} Z" '
             f'fill="url(#{P}_agua)"/>')
    # los mangos, quebrados y desplazados dentro del agua
    for dx, rot in ((-14, -6), (6, 4), (18, 9)):
        g.append(f'<g transform="rotate({rot} {cx + dx} {cy + 20})">'
                 f'<rect x="{cx + dx - 7}" y="{cy - 10}" width="12" height="62" rx="4" '
                 f'fill="#2c3f52" opacity=".5"/></g>')
    # nubes de pigmento suspendidas
    for i in range(5):
        g.append(f'<ellipse cx="{M.r1(cx - 24 + M.n(i, 3.1) * 50)}" '
                 f'cy="{M.r1(cy + 4 + M.n(i, 7.7) * 46)}" '
                 f'rx="{M.r1(9 + M.n(i, 5.3) * 14)}" ry="{M.r1(5 + M.n(i, 9.1) * 7)}" '
                 f'fill="{SEC[1] if i % 2 else PRIM[2]}" opacity=".2" '
                 f'filter="url(#b5)"/>')
    g.append('</g>')
    # la lámina de agua y el menisco
    g.append(f'<ellipse cx="{cx}" cy="{cy - 12}" rx="35" ry="9" fill="#5e7a6a" '
             f'opacity=".75"/>')
    g.append(f'<ellipse cx="{cx - 11}" cy="{cy - 14}" rx="12" ry="3.4" fill="#cfe3d6" '
             f'opacity=".55" filter="url(#b2)"/>')
    # borde del tarro y brillos
    g.append(f'<ellipse cx="{cx}" cy="{cy - 38}" rx="36" ry="9" fill="none" '
             f'stroke="#d5e6ef" stroke-width="2.6" opacity=".85"/>')
    g.append(M.brillo_borde(f'M{cx - 30} {cy + 46} L{cx - 28} {cy - 32}',
                            color='#ffffff', w=3.4, op=.45))
    g.append(M.brillo_borde(f'M{cx + 28} {cy + 40} L{cx + 27} {cy - 26}',
                            color='#ffffff', w=1.6, op=.28))
    return ''.join(g)


def _carta():
    """La tira de complementarios, pintada a mano y ya manchada de uso."""
    x, y = 366, 330
    g = [M.sombra(x, y, 170, 62, op=.26, dx=6, dy=8, rx=2),
         f'<g transform="rotate(-6 {x + 85} {y + 31})">',
         f'<rect x="{x}" y="{y}" width="170" height="62" rx="2" '
         f'fill="url(#{P}_pliego)"/>']
    pares = ((PRIM[0], SEC[1]), (PRIM[1], SEC[2]), (PRIM[2], SEC[0]))
    for i, (a, b) in enumerate(pares):
        cx = x + 14 + i * 52
        g.append(_pincelada(cx, y + 18, 42, 20, a, s=i * 5 + 2, cerdas=5))
        g.append(_pincelada(cx, y + 44, 42, 20, b, s=i * 5 + 4, cerdas=5))
    g.append(f'<ellipse cx="{x + 152}" cy="{y + 12}" rx="9" ry="6" fill="{PRIM[0]}" '
             f'opacity=".4" filter="url(#b2)" '
             f'transform="rotate(20 {x + 152} {y + 12})"/>')
    g.append('</g>')
    return ''.join(g)


def _trapo():
    """El trapo arrugado: pliegues con luz y sombra, y el color de lo limpiado.

    La primera versión era una mancha blanca con lunares y se leía como una
    segunda paleta. Un trapo se reconoce por los pliegues, no por las manchas.
    """
    g = [M.contacto(38, 244, 108, op=.34, alto=7),
         M.sombra(30, 176, 120, 70, op=.28, dx=9, dy=12, rx=20)]
    cuerpo = ('M32 214 q6 -30 34 -36 q26 -6 40 8 q10 -14 30 -8 q22 7 18 28 '
              'q-3 18 -24 24 q-26 8 -54 4 q-30 -4 -38 -12 q-8 -8 -6 -8 Z')
    g.append(f'<path d="{cuerpo}" fill="url(#{P}_trapo)"/>')
    # los pliegues: cada uno con su cresta iluminada y su valle en sombra
    pliegues = [('M44 206 q20 -20 44 -14 q18 5 22 18', 1),
                ('M40 222 q26 -8 52 -2 q20 3 38 -6', -1),
                ('M58 236 q22 6 48 0 q18 -4 30 -12', -1),
                ('M96 186 q14 -6 26 2 q10 7 8 16', 1)]
    for i, (d, lado) in enumerate(pliegues):
        g.append(f'<path d="{d}" fill="none" stroke="{k["noche"]}" '
                 f'stroke-width="{M.r2(4 + M.n(i, 3.3) * 3)}" opacity=".16" '
                 f'filter="url(#b2)"/>')
        g.append(f'<path d="{d}" fill="none" stroke="#ffffff" '
                 f'stroke-width="{M.r2(2.4 + M.n(i, 5.9) * 2)}" opacity=".5" '
                 f'transform="translate(0 {-2 * lado})" filter="url(#b2)"/>')
    # el color de lo que se ha limpiado, absorbido por la tela
    for i, col in enumerate(PRIM + SEC[:2]):
        g.append(f'<ellipse cx="{M.r1(46 + M.n(i, 2.3) * 84)}" '
                 f'cy="{M.r1(190 + M.n(i, 6.1) * 44)}" '
                 f'rx="{M.r1(8 + M.n(i, 4.7) * 11)}" ry="{M.r1(5 + M.n(i, 8.3) * 7)}" '
                 f'fill="{col}" opacity="{M.r2(.28 + M.n(i, 1.9) * .24)}" '
                 f'filter="url(#b5)"/>')
    g.append(f'<path d="{cuerpo}" fill="none" stroke="{k["noche"]}" stroke-width="1" '
             f'opacity=".18"/>')
    return ''.join(g)


def _defs():
    """Los gradientes, filtros y recortes de esta escena.

    Vive aparte para que la variante AGE_0_12 pueda reutilizar
    exactamente los mismos, sin duplicarlos y sin que puedan divergir.
    """
    return (
        M.defs_taller(P, tabla=('#c8a67c', '#a78352', '#805e38', '#553d24'))
        + M.defs_papel(P)
        + M.defs_metal(P)
        + M.defs_vidrio(P)
        + lg(f'{P}_trapo', .1, 0, .8, 1,
             [(0, '#fbf8f1', None), (.4, '#ebe5d8', None), (1, '#c8c0b0', None)])
        + rg(f'{P}_porcelana', .32, .26, .86,
             [(0, '#ffffff', None), (.4, '#f0ece3', None), (1, '#cdc6b9', None)])
        + lg(f'{P}_tubo', 0, 0, .25, 1,
             [(0, '#f6f7f8', None), (.26, '#d8dce0', None), (.6, '#a9b0b8', None),
              (1, '#79818b', None)])
        + lg(f'{P}_vidriocuerpo', 0, 0, 1, .2,
             [(0, '#eef6fb', .85), (.3, '#cadde8', .7), (.56, '#a3bccd', .65),
              (.74, '#e7f2f8', .78), (1, '#84a0b2', .7)])
        + lg(f'{P}_agua', 0, 0, 0, 1,
             [(0, '#6f8f7c', .85), (.5, '#55726a', .9), (1, '#3a5350', .95)])
        + rg(f'{P}_focosuelo', .5, .5, .5, [(0, '#fff0cf', .55), (1, '#fff0cf', 0)])
        + (f'<clipPath id="{P}_cp_pocillo"><ellipse cx="{POCILLO[0]}" cy="{POCILLO[1]}" '
           f'rx="{POCILLO[2]}" ry="{POCILLO[3]}"/></clipPath>')
        + M.clip(f'{P}_cp_tarro',
                 'M528 268 L531 364 Q566 374 599 364 L602 268 Z')
        + M.clip(f'{P}_cp_papel',
                 'M350 174 L587 168 L594 309 L357 316 Z')
    )


def escena():
    defs = _defs()

    c = M.pared(P, MESA + 6, vx=42, vy=12, vw=152, vh=110)
    c += M.banco(P, MESA, juntas=(348,), nudos=((132, 200, 8), (438, 372, 9)))
    c += (f'<ellipse cx="220" cy="248" rx="240" ry="140" fill="url(#{P}_focosuelo)" '
          f'opacity=".5" filter="url(#b22)"/>')

    c += _trapo()
    c += _estudio()
    c += _carta()
    c += _paleta()
    c += _mezcla()
    c += _tarro()
    c += _tubos()
    c += _pincel_en_pocillo()

    c += M.velo(P, MESA - 6, 54, op=.34)
    c += M.vineta(P, .85)
    return svg(c, defs)
