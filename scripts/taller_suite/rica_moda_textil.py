# -*- coding: utf-8 -*-
"""Escena rica de Moda y textil (R65 · tanda 3).

La mesa de corte, con el patrón puesto sobre la tela y el corte empezado.

Lo que se ve:

* la **tela doblada** sobre la mesa: el orillo por un lado, el doblez por el
  otro, la caída con sus pliegues, y el **tejido de verdad** —trama y urdimbre
  cruzándose, con el brillo del hilo donde le da la luz—, no un relleno de color;
* encima, la **pieza de patrón** de papel fino, con lo que lleva un patrón de
  verdad: la línea de hilo con su flecha en los dos extremos, los piquetes en el
  borde, la marca del doblez, los puntos de las pinzas y el margen de costura
  dibujado por fuera del contorno;
* el patrón está **sujeto con alfileres**, cada uno con su cabeza de color y su
  sombra;
* la **línea de jaboncillo ya trazada** en la mitad de arriba y todavía sin
  trazar en la de abajo: ahí es donde va la mano ahora;
* las **tijeras de sastre a medio corte**, con la tela ya separada detrás de la
  hoja y todavía unida delante;
* el metro de costura enrollado, con sus números al borde;
* el jaboncillo gastado, con el polvo que ha dejado;
* la carta de muestras de tejido: seis calidades distintas —plano, sarga, punto,
  pana, gasa y espiga—, cada una con su textura, no seis cuadrados de color;
* los carretes de hilo, con el hilo enrollado de verdad y la hebra suelta.

Sin personas, sin figurines con cara: lo que se enseña es el oficio de cortar.
"""
import math

from taller_suite.escenas_ricas import C, W, H, svg, lg, rg
from taller_suite import rica_comun as M

k = C
P = 'mt'

MESA = 130

TELA = '#2f6f87'
TELA_L = '#4d93ac'
TELA_S = '#1b4a5e'


def _tejido(x, y, w, h, *, paso=5.0, col=TELA, opacidad=.3):
    """Trama y urdimbre: el tejido se ve, no se supone."""
    g = []
    n = int(w / paso) + 1
    m = int(h / paso) + 1
    for i in range(n):
        g.append(f'<path d="M{M.r1(x + i * paso)} {M.r1(y)} V{M.r1(y + h)}" '
                 f'stroke="#ffffff" stroke-width="{M.r2(paso * .3)}" '
                 f'opacity="{M.r2(opacidad * .5)}"/>')
    for j in range(m):
        g.append(f'<path d="M{M.r1(x)} {M.r1(y + j * paso)} H{M.r1(x + w)}" '
                 f'stroke="{k["noche"]}" stroke-width="{M.r2(paso * .3)}" '
                 f'opacity="{M.r2(opacidad * .45)}"/>')
    return ''.join(g)


def _tela():
    """La tela doblada: orillo, doblez, pliegues y tejido."""
    cuerpo = ('M18 176 C120 166 250 162 372 170 C420 173 452 182 470 196 '
              'C478 234 480 300 470 366 C452 382 418 392 366 396 '
              'C246 404 116 398 20 386 C12 316 12 240 18 176 Z')
    g = [M.sombra(16, 168, 456, 230, op=.34, dx=12, dy=15, rx=10),
         f'<path d="{cuerpo}" fill="url(#{P}_tela)"/>',
         f'<g clip-path="url(#{P}_cp_tela)">']
    g.append(_tejido(10, 158, 476, 250, paso=5.6, opacidad=.17))
    # los pliegues: cada uno con su cresta y su valle
    for i, (d, w0) in enumerate((
            ('M60 172 C74 240 66 320 48 390', 26),
            ('M182 166 C196 238 190 316 176 398', 30),
            ('M318 166 C330 236 332 318 320 400', 24),
            ('M424 176 C436 240 438 310 428 382', 20))):
        g.append(f'<path d="{d}" fill="none" stroke="{k["noche"]}" '
                 f'stroke-width="{w0}" opacity=".16" filter="url(#b12)"/>')
        g.append(f'<path d="{d}" fill="none" stroke="#ffffff" '
                 f'stroke-width="{M.r1(w0 * .55)}" opacity=".16" '
                 f'filter="url(#b12)" transform="translate(-14 0)"/>')
    g.append('</g>')
    # el orillo: el canto tejido de la pieza, más denso
    g.append(f'<path d="M18 176 C120 166 250 162 372 170 C420 173 452 182 470 196" '
             f'fill="none" stroke="{TELA_S}" stroke-width="7" opacity=".75"/>')
    for i in range(30):
        t = i / 29
        x = 22 + t * 444
        y = 176 - 12 * math.sin(t * 2.2) + 14 * t * t
        g.append(f'<path d="M{M.r1(x)} {M.r1(y - 3)} v7" stroke="#8fc2d4" '
                 f'stroke-width="1.4" opacity="{M.r2(.3 + M.n(i, 3.1) * .3)}"/>')
    # el doblez de abajo: el canto redondeado que hace la tela al doblarse
    g.append(f'<path d="M20 386 C116 398 246 404 366 396 C418 392 452 382 470 366" '
             f'fill="none" stroke="#ffffff" stroke-width="5" opacity=".22" '
             f'filter="url(#b2)"/>')
    g.append(f'<path d="{cuerpo}" fill="none" stroke="{TELA_S}" stroke-width="1.4" '
             f'opacity=".5"/>')
    return ''.join(g)


PATRON = ('M118 212 C152 200 214 196 268 204 C292 208 306 220 310 238 '
          'C316 272 312 306 300 334 C286 346 236 352 186 348 '
          'C150 345 128 334 122 316 C114 282 112 244 118 212 Z')
PATRON_MARGEN = ('M108 206 C146 192 218 188 276 197 C304 202 318 216 322 238 '
                 'C329 276 324 312 310 342 C294 356 238 362 184 358 '
                 'C144 355 119 342 112 320 C103 282 101 240 108 206 Z')


def _patron():
    """La pieza de patrón, con todo lo que lleva un patrón de verdad."""
    g = [M.sombra(104, 190, 224, 172, op=.28, dx=7, dy=9, rx=6, blur='b2'),
         # el margen de costura, por fuera del contorno
         f'<path d="{PATRON_MARGEN}" fill="url(#{P}_papel_patron)"/>',
         f'<path d="{PATRON_MARGEN}" fill="none" stroke="{k["grafito"]}" '
         f'stroke-width="1" stroke-dasharray="7 4" opacity=".5"/>',
         # el contorno de costura
         f'<path d="{PATRON}" fill="none" stroke="{k["tinta"]}" stroke-width="1.6" '
         f'opacity=".8"/>']
    # la línea de hilo, con flecha en los dos extremos
    g.append(M.trazo('M156 232 L268 320', k['tinta'], w=1.6, op=.8, halo=False))
    # las dos puntas de flecha, cada una abierta hacia fuera de la línea
    for (ax, ay, sx, sy) in ((156, 232, 1, 1), (268, 320, -1, -1)):
        g.append(f'<path d="M{ax} {ay} l{M.r1(sx * 13)} {M.r1(sy * 3)} '
                 f'M{ax} {ay} l{M.r1(sx * 4)} {M.r1(sy * 13)}" fill="none" '
                 f'stroke="{k["tinta"]}" stroke-width="1.6" opacity=".8" '
                 f'stroke-linecap="round"/>')
    # los piquetes del borde
    for x, y, dx, dy in ((196, 199, 0, 9), (256, 202, 0, 9), (308, 262, -9, 0),
                         (222, 350, 0, -9), (120, 280, 9, 0)):
        g.append(f'<path d="M{x} {y} l{dx} {dy}" stroke="{k["tinta"]}" '
                 f'stroke-width="1.8" opacity=".85" stroke-linecap="round"/>')
    # las pinzas: dos triángulos con su punto
    for px, py in ((186, 300), (256, 246)):
        g.append(f'<path d="M{px - 16} {py + 22} L{px} {py} L{px + 16} {py + 22}" '
                 f'fill="none" stroke="{k["tinta"]}" stroke-width="1.2" opacity=".7"/>')
        g.append(f'<circle cx="{px}" cy="{py}" r="2" fill="{k["tinta"]}" opacity=".8"/>')
    # la marca del doblez
    g.append(M.guia('M126 226 L126 330', '#c8322c', w=1.6, op=.7, s=3))
    # renglones de anotación, sin texto legible
    for i in range(3):
        g.append(f'<rect x="{M.r1(196 + i * 4)}" y="{M.r1(272 + i * 9)}" '
                 f'width="{M.r1(64 - i * 12)}" height="2.6" rx="1.3" '
                 f'fill="{k["grafito"]}" opacity=".45"/>')
    return ''.join(g)


def _alfileres():
    """Los alfileres que sujetan el patrón: cabeza de color y sombra propia."""
    g = []
    sitios = ((132, 214, -34), (208, 196, 12), (282, 206, 40), (316, 268, 96),
              (296, 338, 146), (206, 356, 178), (124, 322, -142), (114, 256, -96))
    for i, (x, y, ang) in enumerate(sitios):
        col = ('#e0473c', '#f0b419', '#2f8f4e', '#5f3f97')[i % 4]
        a = math.radians(ang)
        ex, ey = x + 22 * math.cos(a), y + 22 * math.sin(a)
        g.append(f'<path d="M{x} {y} L{M.r1(ex)} {M.r1(ey)}" stroke="{k["noche"]}" '
                 f'stroke-width="3" opacity=".22" filter="url(#b2)" '
                 f'transform="translate(3 4)"/>')
        g.append(f'<path d="M{x} {y} L{M.r1(ex)} {M.r1(ey)}" stroke="url(#{P}_metal)" '
                 f'stroke-width="2.4" stroke-linecap="round"/>')
        g.append(f'<circle cx="{M.r1(ex)}" cy="{M.r1(ey)}" r="4.6" fill="{col}"/>')
        g.append(f'<circle cx="{M.r1(ex - 1.4)}" cy="{M.r1(ey - 1.6)}" r="1.6" '
                 f'fill="#ffffff" opacity=".65"/>')
    return ''.join(g)


def _jaboncillo_trazo():
    """La línea de jaboncillo: trazada arriba, todavía sin trazar abajo."""
    g = []
    # el trazo hecho: polvo de tiza con grano
    d = 'M100 202 C142 186 220 182 280 192 C312 198 326 214 331 238'
    g.append(f'<path d="{d}" fill="none" stroke="#f4f1e6" stroke-width="8" '
             f'opacity=".35" filter="url(#b2)"/>')
    g.append(f'<path d="{d}" fill="none" stroke="#fdfbf3" stroke-width="3" '
             f'opacity=".95" stroke-dasharray="16 3 8 2"/>')
    for i in range(22):
        t = i / 21
        g.append(f'<circle cx="{M.r1(100 + t * 231 + (M.n(i, 3.3) - .5) * 9)}" '
                 f'cy="{M.r1(199 - 17 * math.sin(t * 2.1) + 48 * t * t + (M.n(i, 7.1) - .5) * 7)}" '
                 f'r="{M.r2(.6 + M.n(i, 5.3) * 1.4)}" fill="#fdfbf3" '
                 f'opacity="{M.r2(.3 + M.n(i, 9.7) * .4)}"/>')
    # lo que falta por trazar, marcado a puntos
    g.append(f'<path d="M331 238 C338 278 332 316 317 348" fill="none" '
             f'stroke="#fdfbf3" stroke-width="1.6" opacity=".32" '
             f'stroke-dasharray="3 9"/>')
    return ''.join(g)


def _tijeras():
    """Tijeras de sastre a medio corte: detrás ya está separado, delante no."""
    g = ['<g transform="rotate(-14 392 300)">']
    g.append(M.sombra(330, 276, 190, 46, op=.32, dx=8, dy=11, rx=6, sesgo=-.16))
    # las dos hojas
    g.append(f'<path d="M330 296 L438 286 L444 294 L336 306 Z" '
             f'fill="url(#{P}_metal)"/>')
    g.append(f'<path d="M332 306 L440 300 L444 292 L336 288 Z" '
             f'fill="url(#{P}_metal)" opacity=".92"/>')
    g.append(M.brillo_borde('M332 297.5 L437 288', w=1.8, op=.95))
    g.append(M.brillo_borde('M334 305 L439 299.6', w=1.2, op=.5))
    # el eje
    g.append(f'<circle cx="446" cy="296" r="7" fill="url(#{P}_metal)"/>')
    g.append(f'<circle cx="446" cy="296" r="2.6" fill="{k["noche"]}" opacity=".5"/>')
    # los anillos del mango, de distinto tamaño como en unas de sastre
    # los dos anillos, de distinto tamaño como en unas de sastre: el pequeño para
    # el pulgar y el grande para los dedos
    for cx0, cy0, rx0, ry0, rot in ((488, 290, 32, 21, -12), (480, 330, 24, 17, 16)):
        g.append(f'<g transform="rotate({rot} {cx0} {cy0})">'
                 f'<ellipse cx="{cx0}" cy="{cy0}" rx="{rx0}" ry="{ry0}" fill="none" '
                 f'stroke="#141c24" stroke-width="11"/>'
                 f'<ellipse cx="{cx0}" cy="{cy0}" rx="{rx0}" ry="{ry0}" fill="none" '
                 f'stroke="#3a4650" stroke-width="5"/>'
                 f'<ellipse cx="{cx0}" cy="{cy0 - 2}" rx="{rx0}" ry="{ry0}" fill="none" '
                 f'stroke="#68757f" stroke-width="1.8" opacity=".7"/>'
                 f'</g>')
    # el cuello que une el eje con los anillos
    g.append(f'<path d="M448 294 L462 288 M448 300 L458 318" stroke="#1f2a33" '
             f'stroke-width="10" stroke-linecap="round"/>')
    g.append('</g>')
    return ''.join(g)


def _corte():
    """El canto ya cortado de la tela, detrás de la hoja."""
    return (f'<path d="M336 350 C306 358 268 364 232 366" fill="none" '
            f'stroke="{k["noche"]}" stroke-width="4" opacity=".3" filter="url(#b2)"/>'
            f'<path d="M336 348 C306 356 268 362 232 364" fill="none" '
            f'stroke="#8fc2d4" stroke-width="1.6" opacity=".6"/>'
            # las hilachas del canto recién cortado
            + ''.join(f'<path d="M{M.r1(238 + i * 9)} {M.r1(364 - i * .5)} '
                      f'l{M.r1((M.n(i, 3.1) - .5) * 5)} {M.r1(3 + M.n(i, 7.7) * 4)}" '
                      f'stroke="{TELA_L}" stroke-width="1" opacity=".55" '
                      f'stroke-linecap="round"/>' for i in range(11)))


def _muestras():
    """Carta de muestras: seis tejidos, cada uno con su textura."""
    x, y = 468, 150
    g = [M.sombra(x, y, 150, 150, op=.26, dx=6, dy=8, rx=2),
         f'<g transform="rotate(5 {x + 75} {y + 75})">',
         f'<rect x="{x}" y="{y}" width="150" height="150" rx="2" '
         f'fill="url(#{P}_pliego)"/>']
    tejidos = [('#8d3f4e', 'plano'), ('#3f6b8d', 'sarga'), ('#6b8d3f', 'punto'),
               ('#8d6b3f', 'pana'), ('#b9a8c4', 'gasa'), ('#3f8d7e', 'espiga')]
    for i, (col, tipo) in enumerate(tejidos):
        sx = x + 10 + (i % 2) * 72
        sy = y + 10 + (i // 2) * 46
        g.append(f'<rect x="{M.r1(sx)}" y="{M.r1(sy)}" width="62" height="36" rx="1.5" '
                 f'fill="{col}"/>')
        g.append(f'<g clip-path="url(#{P}_cp_m{i})">')
        if tipo == 'plano':
            g.append(_tejido(sx, sy, 62, 36, paso=3.4, opacidad=.5))
        elif tipo == 'sarga':
            for j in range(22):
                g.append(f'<path d="M{M.r1(sx - 36 + j * 5)} {M.r1(sy + 38)} l36 -40" '
                         f'stroke="#ffffff" stroke-width="1.6" opacity=".26"/>')
        elif tipo == 'punto':
            for r in range(7):
                for c in range(12):
                    g.append(f'<path d="M{M.r1(sx + 2 + c * 5.4)} {M.r1(sy + 3 + r * 5.4)} '
                             f'q2.6 4 5.2 0" fill="none" stroke="#ffffff" '
                             f'stroke-width="1.3" opacity=".3"/>')
        elif tipo == 'pana':
            for c in range(11):
                g.append(f'<rect x="{M.r1(sx + 1 + c * 5.6)}" y="{sy}" width="3.4" '
                         f'height="36" fill="#ffffff" opacity=".18"/>')
                g.append(f'<rect x="{M.r1(sx + 4.4 + c * 5.6)}" y="{sy}" width="1.6" '
                         f'height="36" fill="{k["noche"]}" opacity=".22"/>')
        elif tipo == 'gasa':
            g.append(_tejido(sx, sy, 62, 36, paso=7.4, opacidad=.75))
            g.append(f'<rect x="{sx}" y="{sy}" width="62" height="36" fill="#ffffff" '
                     f'opacity=".3"/>')
        else:                                           # espiga
            for j in range(9):
                yy = sy + 1 + j * 4.2
                g.append(f'<path d="M{sx} {M.r1(yy)} l8 -4 l8 4 l8 -4 l8 4 l8 -4 l8 4 '
                         f'l8 -4 l8 4" fill="none" stroke="#ffffff" stroke-width="1.2" '
                         f'opacity=".3"/>')
        g.append('</g>')
        g.append(f'<rect x="{M.r1(sx)}" y="{M.r1(sy)}" width="62" height="36" rx="1.5" '
                 f'fill="none" stroke="{k["noche"]}" stroke-width=".8" opacity=".3"/>')
        # la grapa que lo sujeta a la carta
        g.append(f'<rect x="{M.r1(sx + 26)}" y="{M.r1(sy - 3)}" width="10" height="5" '
                 f'rx="1" fill="url(#{P}_metal)"/>')
    g.append('</g>')
    return ''.join(g)


def _carretes():
    """Carretes con el hilo enrollado de verdad y la hebra suelta."""
    g = []
    for i, (cx, cy, col) in enumerate(((548, 344, '#c8322c'), (596, 330, '#f0b419'))):
        g.append(M.contacto(cx - 20, cy + 26, 40, op=.4, alto=5))
        g.append(M.sombra(cx - 18, cy - 24, 36, 50, op=.3, dx=7, dy=9, rx=4, sesgo=-.2))
        g.append(f'<ellipse cx="{cx}" cy="{cy - 24}" rx="18" ry="6" fill="#d8bd93"/>')
        g.append(f'<rect x="{cx - 15}" y="{cy - 22}" width="30" height="46" fill="{col}"/>')
        # el hilo, vuelta a vuelta
        for j in range(22):
            yy = cy - 21 + j * 2.1
            g.append(f'<path d="M{cx - 15} {M.r1(yy)} q15 {M.r2(1.4 + M.n(j, 3.1))} '
                     f'30 0" fill="none" stroke="#ffffff" stroke-width=".9" '
                     f'opacity="{M.r2(.12 + M.n(j, 5.7) * .2)}"/>')
        g.append(f'<rect x="{cx - 15}" y="{cy - 22}" width="8" height="46" '
                 f'fill="#ffffff" opacity=".14"/>')
        g.append(f'<rect x="{cx + 8}" y="{cy - 22}" width="7" height="46" '
                 f'fill="{k["noche"]}" opacity=".2"/>')
        g.append(f'<ellipse cx="{cx}" cy="{cy + 24}" rx="18" ry="6" fill="#c2a578"/>')
    # la hebra suelta del primero
    g.append(f'<path d="M530 344 C500 352 470 360 442 356" fill="none" stroke="#c8322c" '
             f'stroke-width="1.6" opacity=".85"/>')
    return ''.join(g)


def _metro_y_tiza():
    """El metro enrollado y el jaboncillo gastado, con su polvo."""
    g = [M.contacto(78, 402, 92, op=.36, alto=5)]
    for i in range(5):
        r = 44 - i * 7
        g.append(f'<ellipse cx="108" cy="388" rx="{M.r1(r)}" ry="{M.r1(r * .32)}" '
                 f'fill="none" stroke="#f0d98a" stroke-width="7" '
                 f'opacity="{M.r2(.9 - i * .04)}"/>')
        g.append(f'<ellipse cx="108" cy="386" rx="{M.r1(r)}" ry="{M.r1(r * .32)}" '
                 f'fill="none" stroke="{k["noche"]}" stroke-width="1.6" '
                 f'opacity=".14"/>')
    for i in range(14):
        a = math.radians(i * 26)
        g.append(f'<path d="M{M.r1(108 + 44 * math.cos(a))} '
                 f'{M.r1(388 + 14 * math.sin(a))} l0 4" stroke="{k["tinta"]}" '
                 f'stroke-width="1.2" opacity=".5"/>')
    # el jaboncillo, un triángulo gastado, y el polvo que ha dejado
    g.append(M.contacto(178, 396, 40, op=.3, alto=4))
    g.append(f'<path d="M166 396 L196 380 L206 396 Z" fill="#f2eee0"/>')
    g.append(f'<path d="M166 396 L196 380 L199 386 L172 398 Z" fill="#ffffff" '
             f'opacity=".6"/>')
    g.append(f'<ellipse cx="186" cy="400" rx="26" ry="6" fill="#ffffff" opacity=".2" '
             f'filter="url(#b2)"/>')
    return ''.join(g)


def escena():
    defs = (
        M.defs_taller(P, tabla=('#c3a077', '#a07c4e', '#795a35', '#4f3a22'))
        + M.defs_papel(P)
        + M.defs_metal(P)
        + lg(f'{P}_tela', .08, 0, .92, 1,
             [(0, TELA_L, None), (.28, TELA, None), (.7, TELA, None), (1, TELA_S, None)])
        + lg(f'{P}_papel_patron', .1, 0, .9, 1,
             [(0, '#fbf6e6', None), (.4, '#f3ecd8', None), (1, '#ddd3ba', None)])
        + rg(f'{P}_focosuelo', .5, .5, .5, [(0, '#fff0cf', .5), (1, '#fff0cf', 0)])
        + M.clip(f'{P}_cp_tela',
                 'M18 176 C120 166 250 162 372 170 C420 173 452 182 470 196 '
                 'C478 234 480 300 470 366 C452 382 418 392 366 396 '
                 'C246 404 116 398 20 386 C12 316 12 240 18 176 Z')
        + ''.join(M.clip_rect(f'{P}_cp_m{i}', 478 + (i % 2) * 72, 160 + (i // 2) * 46,
                              62, 36, 1.5) for i in range(6))
    )

    c = M.pared(P, MESA + 6, vx=228, vy=8, vw=150, vh=104)
    c += M.banco(P, MESA, juntas=(506,), nudos=((556, 388, 8),))
    c += (f'<ellipse cx="240" cy="230" rx="250" ry="140" fill="url(#{P}_focosuelo)" '
          f'opacity=".48" filter="url(#b22)"/>')

    c += _muestras()
    c += _tela()
    c += _corte()
    c += _patron()
    c += _jaboncillo_trazo()
    c += _alfileres()
    c += _carretes()
    c += _metro_y_tiza()
    c += _tijeras()

    c += M.velo(P, MESA - 6, 50, op=.3)
    c += M.vineta(P, .85)
    return svg(c, defs)
