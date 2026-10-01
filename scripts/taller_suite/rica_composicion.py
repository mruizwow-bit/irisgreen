# -*- coding: utf-8 -*-
"""Escena rica de Composición (R65 · tanda 5).

El teclado, el rollo perforado y el papel pautado: la misma música en tres
soportes, y ninguno de ellos es una pantalla.

Lo que se ve:

* el **teclado**, de canto, con sus teclas blancas de marfil amarilleado y sus
  negras con el bisel; las **tres teclas del acorde están hundidas**, con su
  sombra dentro y el fieltro rojo asomando por el frontal;
* el **rollo perforado** desenrollándose sobre la mesa: los agujeros son los
  mismos que suenan —las notas del acorde y la melodía—, y el papel se curva al
  salir del carrete, con el canto grueso y la sombra por debajo. Se ve **el
  tramo ya tocado** y el que viene;
* el **papel pautado** con la melodía escrita a mano: pentagrama, clave,
  plicas que suben o bajan según la altura, corchetes unidos, una ligadura, y
  **el último compás vacío** con el compás siguiente todavía sin barra;
* la corrección: un compás borrado y reescrito encima, con la marca del borrado;
* el **metrónomo** de madera con la pesa a media varilla y la varilla inclinada,
  no vertical: está andando;
* el lápiz encima del pautado y la goma con su polvo.

Nada de personajes. Lo que se enseña es que una idea musical se puede tocar,
perforar y escribir, y que son la misma.
"""
import math

from taller_suite.escenas_ricas import C, W, H, svg, lg, rg
from taller_suite import rica_comun as M

k = C
P = 'cp'

MESA = 122

# El acorde que suena, en semitonos desde la primera tecla dibujada.
ACORDE = (2, 6, 9)
# La melodía: (paso, altura en grados de pentagrama, duración)
MELODIA = [(0, 2, 2), (2, 4, 1), (3, 5, 1), (4, 3, 2), (6, 6, 1), (7, 4, 1),
           (8, 2, 2), (10, 1, 2)]

TX, TY, TW = 36, 200, 366        # teclado
BLANCAS = 15
AB = TW / BLANCAS                # ancho de tecla blanca
NEGRAS = {0, 1, 3, 4, 5}         # dentro de cada octava de siete


def _teclado():
    """El teclado de canto, con tres teclas hundidas."""
    g = [M.contacto(TX - 4, TY + 96, TW + 8, op=.44, alto=8),
         M.sombra(TX, TY - 26, TW, 120, op=.34, dx=12, dy=15, rx=6)]
    # el mueble
    g.append(f'<rect x="{TX - 10}" y="{TY - 30}" width="{TW + 20}" height="126" rx="7" '
             f'fill="url(#{P}_mueble)"/>')
    g.append(f'<rect x="{TX - 10}" y="{TY - 30}" width="{TW + 20}" height="7" rx="3.5" '
             f'fill="#ffffff" opacity=".2"/>')
    # el atril y el frontal
    g.append(f'<rect x="{TX - 6}" y="{TY - 24}" width="{TW + 12}" height="20" rx="3" '
             f'fill="#241a12"/>')
    # las teclas blancas
    for i in range(BLANCAS):
        x = TX + i * AB
        semitono = (i // 7) * 12 + [0, 2, 4, 5, 7, 9, 11][i % 7]
        hundida = semitono in ACORDE
        dy = 3 if hundida else 0
        g.append(f'<rect x="{M.r1(x + .6)}" y="{M.r1(TY + dy)}" '
                 f'width="{M.r1(AB - 1.2)}" height="{M.r1(86 - dy)}" rx="2" '
                 f'fill="url(#{P}_marfil)"/>')
        if hundida:
            # la sombra dentro del hueco y el fieltro rojo del frontal
            g.append(f'<rect x="{M.r1(x + .6)}" y="{M.r1(TY + dy)}" '
                     f'width="{M.r1(AB - 1.2)}" height="10" fill="{k["noche"]}" '
                     f'opacity=".3" filter="url(#b2)"/>')
            g.append(f'<rect x="{M.r1(x + .6)}" y="{M.r1(TY - 4)}" '
                     f'width="{M.r1(AB - 1.2)}" height="5" fill="#a8291f"/>')
        g.append(f'<rect x="{M.r1(x + .6)}" y="{M.r1(TY + 78 + dy)}" '
                 f'width="{M.r1(AB - 1.2)}" height="8" rx="2" fill="#d8d0bc" '
                 f'opacity=".9"/>')
        g.append(f'<path d="M{M.r1(x + .6)} {M.r1(TY + dy)} v{M.r1(86 - dy)}" '
                 f'stroke="{k["noche"]}" stroke-width=".9" opacity=".22"/>')
    # las negras
    for i in range(BLANCAS):
        if i % 7 not in NEGRAS or i == BLANCAS - 1:
            continue
        semitono = (i // 7) * 12 + [1, 3, 0, 6, 8, 10, 0][i % 7]
        x = TX + (i + 1) * AB - AB * .32
        hundida = semitono in ACORDE
        dy = 2 if hundida else 0
        g.append(f'<rect x="{M.r1(x)}" y="{M.r1(TY + dy)}" width="{M.r1(AB * .64)}" '
                 f'height="{M.r1(56 - dy)}" rx="2" fill="url(#{P}_negra)"/>')
        g.append(f'<rect x="{M.r1(x + AB * .1)}" y="{M.r1(TY + dy + 2)}" '
                 f'width="{M.r1(AB * .18)}" height="46" rx="1.4" fill="#ffffff" '
                 f'opacity=".16"/>')
        if hundida:
            g.append(f'<rect x="{M.r1(x)}" y="{M.r1(TY + dy)}" '
                     f'width="{M.r1(AB * .64)}" height="8" fill="{k["noche"]}" '
                     f'opacity=".45" filter="url(#b2)"/>')
    return ''.join(g)


def _rollo():
    """El rollo perforado saliendo del carrete: los agujeros son las notas."""
    g = []
    # el carrete
    cx, cy = 118, 316
    g.append(M.contacto(cx - 40, cy + 26, 80, op=.4, alto=6))
    g.append(M.sombra(cx - 38, cy - 24, 76, 50, op=.3, dx=8, dy=11, rx=24, sesgo=-.2))
    for i in range(4):
        g.append(f'<ellipse cx="{cx}" cy="{M.r1(cy - i * 1.4)}" '
                 f'rx="{M.r1(36 - i * 1.6)}" ry="{M.r1(24 - i * 1.2)}" '
                 f'fill="#efe7d4" opacity="{M.r2(.95 - i * .05)}"/>')
        g.append(f'<ellipse cx="{cx}" cy="{M.r1(cy - i * 1.4)}" '
                 f'rx="{M.r1(36 - i * 1.6)}" ry="{M.r1(24 - i * 1.2)}" fill="none" '
                 f'stroke="#c6bda6" stroke-width=".9" opacity=".7"/>')
    g.append(f'<ellipse cx="{cx}" cy="{cy - 6}" rx="9" ry="6" fill="#8a6a3a"/>')

    # la banda que sale, curvándose
    banda = ('M150 300 C214 286 300 288 372 302 C424 312 470 328 502 346 '
             'L498 386 C462 366 414 350 362 340 C292 326 208 324 146 338 Z')
    g.append(f'<path d="{banda}" fill="{k["noche"]}" opacity=".26" '
             f'filter="url(#b5)" transform="translate(6 10)"/>')
    g.append(f'<path d="{banda}" fill="url(#{P}_rollo)"/>')
    g.append(f'<path d="M150 300 C214 286 300 288 372 302 C424 312 470 328 502 346" '
             f'fill="none" stroke="#ffffff" stroke-width="2.2" opacity=".5"/>')
    g.append(f'<path d="M146 338 C208 324 292 326 362 340 C414 350 462 366 498 386" '
             f'fill="none" stroke="#b7ac92" stroke-width="2" opacity=".75"/>')
    # Las perforaciones. Siguen la banda: el rollo cae en diagonal sobre la mesa,
    # así que las pistas bajan con él. Cada agujero tiene su canto oscuro y su
    # sombra dentro, porque es un hueco en el papel y no una raya pintada.
    def _borde(x):
        """Borde superior de la banda a una abscisa dada."""
        return 292 + (x - 150) / 350 * 50

    g.append(f'<g clip-path="url(#{P}_cp_rollo)">')

    def _agujero(x0, ancho, carril):
        y0 = _borde(x0) + 6 + carril * 6.0
        return (f'<rect x="{M.r1(x0)}" y="{M.r1(y0 + 1.6)}" width="{M.r1(ancho)}" '
                f'height="5.4" rx="2.7" fill="{k["noche"]}" opacity=".3" '
                f'filter="url(#b2)"/>'
                f'<rect x="{M.r1(x0)}" y="{M.r1(y0)}" width="{M.r1(ancho)}" '
                f'height="5.4" rx="2.7" fill="#2f2a20"/>'
                f'<rect x="{M.r1(x0)}" y="{M.r1(y0)}" width="{M.r1(ancho)}" '
                f'height="2" rx="1" fill="{k["noche"]}" opacity=".5"/>'
                f'<rect x="{M.r1(x0)}" y="{M.r1(y0 + 4.2)}" width="{M.r1(ancho)}" '
                f'height="1.2" rx=".6" fill="#ffffff" opacity=".35"/>')

    # el acorde, sostenido: tres carriles seguidos a lo largo del tramo tocado
    for j, carril in enumerate((3.6, 4.5, 5.4)):
        g.append(_agujero(166, 142, carril))
    # la melodía, por encima, cada nota en su carril según la altura
    for paso, altura, dur in MELODIA:
        x0 = 176 + paso * 27
        g.append(_agujero(x0, dur * 20, (6 - altura) * .55))
    # y el tramo que viene, con las notas siguientes ya perforadas
    for i, (paso, altura) in enumerate(((0, 3), (2, 5), (3, 2), (5, 4))):
        g.append(_agujero(418 + paso * 20, 16, (6 - altura) * .55))
    g.append('</g>')
    # la marca de por dónde va: lo ya tocado queda a la izquierda
    g.append(f'<path d="M296 286 C300 312 300 334 296 356" fill="none" '
             f'stroke="#c8322c" stroke-width="2" opacity=".8"/>')
    g.append(f'<path d="M296 282 l-4 -6 h8 Z" fill="#c8322c" opacity=".85"/>')
    return ''.join(g)


def _pautado():
    """El papel pautado con la melodía escrita a mano."""
    x, y, w, h = 350, 146, 262, 158
    g = [M.sombra(x, y, w, h, op=.28, dx=7, dy=10, rx=2),
         f'<g transform="rotate(-4 {x + w / 2} {y + h / 2})">',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" '
         f'fill="url(#{P}_pliego)"/>',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="none" '
         f'stroke="#b5ac9b" stroke-width=".8" opacity=".8"/>']
    t = k['tinta']

    def pentagrama(y0):
        out = []
        for i in range(5):
            out.append(f'<path d="M{x + 16} {M.r1(y0 + i * 7)} H{x + w - 16}" '
                       f'stroke="{t}" stroke-width=".9" opacity=".75"/>')
        # la clave: una espiral con su cola, dibujada, no un glifo
        out.append(f'<path d="M{x + 30} {M.r1(y0 + 26)} C{x + 22} {M.r1(y0 + 20)} '
                   f'{x + 24} {M.r1(y0 + 6)} {x + 33} {M.r1(y0 + 4)} '
                   f'C{x + 41} {M.r1(y0 + 3)} {x + 43} {M.r1(y0 + 13)} '
                   f'{x + 35} {M.r1(y0 + 19)} C{x + 27} {M.r1(y0 + 25)} '
                   f'{x + 24} {M.r1(y0 + 34)} {x + 31} {M.r1(y0 + 36)}" fill="none" '
                   f'stroke="{t}" stroke-width="2.2" opacity=".85" '
                   f'stroke-linecap="round"/>')
        # la indicación de compás, como dos bloques
        for i in range(2):
            out.append(f'<rect x="{x + 50}" y="{M.r1(y0 + 3 + i * 15)}" width="9" '
                       f'height="4" rx="2" fill="{t}" opacity=".8"/>')
        return ''.join(out)

    for n, y0 in enumerate((y + 34, y + 96)):
        g.append(pentagrama(y0))
        # las barras de compás
        for i in range(1, 4):
            bx = x + 66 + i * 44
            g.append(f'<path d="M{M.r1(bx)} {M.r1(y0)} V{M.r1(y0 + 28)}" '
                     f'stroke="{t}" stroke-width="1.2" opacity=".7"/>')
        if n == 0:
            # la melodía escrita
            for i, (paso, altura, dur) in enumerate(MELODIA):
                nx = x + 72 + paso * 15.6
                ny = y0 + 28 - altura * 3.5
                lleno = dur < 2
                g.append(f'<ellipse cx="{M.r1(nx)}" cy="{M.r1(ny)}" rx="4.2" ry="3.2" '
                         f'fill="{t if lleno else "none"}" stroke="{t}" '
                         f'stroke-width="1.6" opacity=".9" '
                         f'transform="rotate(-18 {M.r1(nx)} {M.r1(ny)})"/>')
                # la plica: arriba si la nota es baja, abajo si es alta
                arriba = altura < 4
                g.append(f'<path d="M{M.r1(nx + (4 if arriba else -4))} {M.r1(ny)} '
                         f'v{-22 if arriba else 22}" stroke="{t}" stroke-width="1.5" '
                         f'opacity=".9"/>')
            # dos corcheas unidas por su barra
            g.append(f'<path d="M{x + 103} {M.r1(y0 + 28 - 4 * 3.5 - 22)} '
                     f'L{x + 119} {M.r1(y0 + 28 - 5 * 3.5 - 22)}" stroke="{t}" '
                     f'stroke-width="3.4" opacity=".9"/>')
            # una ligadura
            g.append(f'<path d="M{x + 72} {M.r1(y0 + 34)} q22 12 44 0" fill="none" '
                     f'stroke="{t}" stroke-width="1.6" opacity=".75"/>')
            # el compás corregido: el borrado y lo reescrito encima
            g.append(f'<ellipse cx="{x + 176}" cy="{M.r1(y0 + 16)}" rx="26" ry="14" '
                     f'fill="#e8e0cf" opacity=".6" filter="url(#b2)"/>')
            g.append(f'<ellipse cx="{x + 172}" cy="{M.r1(y0 + 12)}" rx="4.2" ry="3.2" '
                     f'fill="{t}" opacity=".35" '
                     f'transform="rotate(-18 {x + 172} {M.r1(y0 + 12)})"/>')
            g.append(f'<ellipse cx="{x + 180}" cy="{M.r1(y0 + 19)}" rx="4.2" ry="3.2" '
                     f'fill="{t}" opacity=".9" '
                     f'transform="rotate(-18 {x + 180} {M.r1(y0 + 19)})"/>')
            g.append(f'<path d="M{x + 184} {M.r1(y0 + 19)} v-22" stroke="{t}" '
                     f'stroke-width="1.5" opacity=".9"/>')
        else:
            # el segundo pentagrama, todavía vacío: solo dos notas y la barra que falta
            for i, (paso, altura) in enumerate(((0, 2), (2, 3))):
                nx = x + 72 + paso * 15.6
                ny = y0 + 28 - altura * 3.5
                g.append(f'<ellipse cx="{M.r1(nx)}" cy="{M.r1(ny)}" rx="4.2" ry="3.2" '
                         f'fill="none" stroke="{t}" stroke-width="1.6" opacity=".8" '
                         f'transform="rotate(-18 {M.r1(nx)} {M.r1(ny)})"/>')
                g.append(f'<path d="M{M.r1(nx + 4)} {M.r1(ny)} v-22" stroke="{t}" '
                         f'stroke-width="1.5" opacity=".8"/>')
            g.append(f'<path d="M{x + 154} {M.r1(y0)} V{M.r1(y0 + 28)}" stroke="{t}" '
                     f'stroke-width="1.2" opacity=".28" stroke-dasharray="4 3"/>')
    g.append('</g>')
    return ''.join(g)


def _metronomo():
    """El metrónomo: pesa a media varilla y la varilla inclinada, andando."""
    cx, cy = 566, 322
    g = [M.contacto(cx - 42, cy + 56, 84, op=.42, alto=7),
         M.sombra(cx - 40, cy - 66, 80, 122, op=.32, dx=10, dy=13, rx=4, sesgo=-.2)]
    # la caja piramidal
    g.append(f'<path d="M{cx - 40} {cy + 56} L{cx - 17} {cy - 66} L{cx + 17} {cy - 66} '
             f'L{cx + 40} {cy + 56} Z" fill="url(#{P}_metronomo)"/>')
    g.append(f'<path d="M{cx - 40} {cy + 56} L{cx - 17} {cy - 66} L{cx - 8} {cy - 66} '
             f'L{cx - 26} {cy + 56} Z" fill="#ffffff" opacity=".16"/>')
    g.append(f'<path d="M{cx + 22} {cy + 56} L{cx + 8} {cy - 66} L{cx + 17} {cy - 66} '
             f'L{cx + 40} {cy + 56} Z" fill="{k["noche"]}" opacity=".26"/>')
    # la ventana con la escala
    g.append(f'<path d="M{cx - 15} {cy + 44} L{cx - 7} {cy - 56} L{cx + 7} {cy - 56} '
             f'L{cx + 15} {cy + 44} Z" fill="#241a12"/>')
    for i in range(12):
        yy = cy + 38 - i * 8
        g.append(f'<path d="M{M.r1(cx - 12 + i * .35)} {M.r1(yy)} h7" '
                 f'stroke="#d8c9a8" stroke-width="1" '
                 f'opacity="{.8 if i % 3 == 0 else .5}"/>')
    # la varilla, inclinada, y la pesa a media altura
    g.append('<g transform="rotate(13 %s %s)">' % (cx, cy + 44))
    g.append(f'<path d="M{cx} {cy + 44} V{cy - 62}" stroke="url(#{P}_metal)" '
             f'stroke-width="3.4" stroke-linecap="round"/>')
    g.append(f'<rect x="{cx - 11}" y="{cy - 22}" width="22" height="13" rx="2" '
             f'fill="url(#{P}_metal)"/>')
    g.append(f'<rect x="{cx - 11}" y="{cy - 22}" width="22" height="4" rx="2" '
             f'fill="#ffffff" opacity=".4"/>')
    g.append('</g>')
    # la tapa apoyada al lado
    g.append(M.contacto(596, 392, 54, op=.34, alto=5))
    g.append(f'<path d="M604 344 L638 356 L634 390 L600 378 Z" '
             f'fill="url(#{P}_metronomo)"/>')
    return ''.join(g)


def _lapiz_goma():
    g = ['<g transform="rotate(-18 452 330)">',
         M.sombra(390, 324, 132, 12, op=.24, dx=4, dy=6, rx=6, blur='b2'),
         f'<rect x="402" y="324" width="112" height="12" rx="6" fill="#2f6f87"/>',
         f'<rect x="402" y="325" width="112" height="3.4" rx="1.7" fill="#63a8c0" '
         f'opacity=".8"/>',
         f'<path d="M390 327 l14 -3 v12 l-14 -3 Z" fill="{k["madL"]}"/>',
         f'<path d="M384 330 l7 -1.6 v6 Z" fill="{k["tinta"]}"/>',
         '</g>']
    g.append(M.contacto(462, 370, 42, op=.3, alto=4))
    g.append(f'<path d="M446 350 q16 -8 32 -2 q12 6 8 14 q-5 9 -20 8 q-20 -2 -20 -20 Z" '
             f'fill="#e3e8ec"/>')
    g.append(f'<ellipse cx="464" cy="374" rx="24" ry="5" fill="#ffffff" opacity=".2" '
             f'filter="url(#b2)"/>')
    return ''.join(g)


def _defs():
    """Los gradientes, filtros y recortes de esta escena.

    Vive aparte para que la variante AGE_0_12 pueda reutilizar
    exactamente los mismos, sin duplicarlos y sin que puedan divergir.
    """
    return (
        M.defs_taller(P, tabla=('#b1906a', '#8f7043', '#6a4e2e', '#43301a'))
        + M.defs_papel(P)
        + M.defs_metal(P)
        + lg(f'{P}_mueble', 0, 0, .25, 1,
             [(0, '#5a3c26', None), (.3, '#432c1b', None), (1, '#241710', None)])
        + lg(f'{P}_marfil', 0, 0, .3, 1,
             [(0, '#fffdf4', None), (.5, '#f6f0dd', None), (1, '#ded5bd', None)])
        + lg(f'{P}_negra', 0, 0, .6, 1,
             [(0, '#4a5058', None), (.4, '#242a31', None), (1, '#0f1318', None)])
        + lg(f'{P}_rollo', 0, 0, 0, 1,
             [(0, '#f7f1de', None), (.45, '#eee6cf', None), (1, '#d5cab0', None)])
        + lg(f'{P}_metronomo', .1, 0, .9, 1,
             [(0, '#a9703f', None), (.35, '#8a5730', None), (1, '#5c3a1e', None)])
        + rg(f'{P}_focosuelo', .5, .5, .5, [(0, '#fff0cf', .42), (1, '#fff0cf', 0)])
        + M.clip(f'{P}_cp_rollo',
                 'M150 300 C214 286 300 288 372 302 C424 312 470 328 502 346 '
                 'L498 386 C462 366 414 350 362 340 C292 326 208 324 146 338 Z')
    )


def escena():
    defs = _defs()

    c = M.pared(P, MESA + 6, vx=206, vy=6, vw=136, vh=96)
    c += M.banco(P, MESA, juntas=(468,), nudos=((330, 380, 8),))
    c += (f'<ellipse cx="230" cy="216" rx="250" ry="140" fill="url(#{P}_focosuelo)" '
          f'opacity=".42" filter="url(#b22)"/>')

    c += _pautado()
    c += _teclado()
    c += _rollo()
    c += _metronomo()
    c += _lapiz_goma()

    c += M.velo(P, MESA - 6, 44, op=.26)
    c += M.vineta(P, .85)
    return svg(c, defs)
