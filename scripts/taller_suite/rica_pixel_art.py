# -*- coding: utf-8 -*-
"""Escena rica de Pixel art (R65 · tanda 1).

El puesto donde se dibuja píxel a píxel, no el sprite terminado.

Lo que se ve:

* la pared del taller y su ventana, la misma luz de siempre;
* **la tableta con pantalla**, un objeto real con su marco, su pie, su cable y
  el reflejo de la ventana cruzando el vidrio en diagonal;
* dentro, el lienzo ampliado con su **cuadrícula** y el damero de transparencia
  asomando donde todavía no hay nada: eso es lo que distingue este estudio de
  cualquier otro dibujo;
* el sprite **a medio sombrear**: la mitad de la izquierda ya tiene su rampa de
  tres tonos y su luz; la de la derecha sigue en color plano. Se ve el trabajo en
  el momento exacto en que se está haciendo;
* la rampa de color en construcción, abajo, con un hueco todavía sin decidir;
* la tira de fotogramas de la animación: tres hechos y el cuarto vacío;
* el marco de selección con su borde discontinuo sobre la zona en la que se
  trabaja;
* fuera de la pantalla, sobre la mesa, **el papel cuadriculado** donde el sprite
  se empezó a mano, con casillas rellenas a lápiz y la cuenta de anchura al
  margen: el pixel art no nace en la pantalla;
* el lápiz óptico apoyado en el borde de la tableta, y una tira de muestras de
  color impresas.

Sin personajes con cara. El sprite es una planta en un tiesto, que es el
ejercicio con el que de verdad se aprende una rampa de color.
"""
from taller_suite.escenas_ricas import C, W, H, svg, lg, rg
from taller_suite import rica_comun as M

k = C
P = 'px'

MESA = 150

# ── la pantalla ─────────────────────────────────────────────────────────────
SX, SY, SW, SH = 214, 54, 366, 232          # marco exterior
VX, VY, VW, VH = SX + 13, SY + 13, SW - 26, SH - 26   # área de vidrio

# El lienzo ampliado: 26 x 18 celdas. Cada celda es un píxel del sprite.
CEL = 9.4
LX, LY = VX + 12, VY + 10
COLS, FILAS = 26, 18

# Rampas propias. Tres tonos por familia, que es lo que se enseña aquí.
VERDE = ['#1e4d2b', '#2f7a3f', '#54a85a', '#8fd47a']
BARRO = ['#5d3a22', '#8a5630', '#b8794a', '#d9a06a']
TIERRA = ['#3a2a1c', '#5a4229']

#: El sprite, celda a celda. 0 = vacío. Las claves son (columna, fila).
#: Se escribe como un mapa de texto porque así se lee y se corrige como lo haría
#: quien lo dibuja: una fila por línea.
MAPA = [
    '..........hhh.............',
    '........hhHHHh............',
    '.......hHHHHHHh...........',
    '......hHHHHHHHHh..........',
    '.....hHHHHHmHHHHh.........',
    '.....hHHHmmmmHHHh.........',
    '......hHHmmmmmHHh.........',
    '.......hHmmmmmmh..........',
    '.........tttt.............',
    '.........tttt.............',
    '.........tttt.............',
    '.....RRRRRRRRRRRR.........',
    '.....RRRRRRRRRRRR.........',
    '......TTTTTTTTTT..........',
    '......TTTTTTTTTT..........',
    '.......TTTTTTTT...........',
    '.......TTTTTTTT...........',
    '..........................',
]

#: Hasta qué columna está ya sombreado. A la derecha de esta línea el sprite
#: sigue en color plano: es el trabajo a medias, y se ve.
FRONTERA = 11


def _color(ch, col, fila):
    """Color de una celda. A la izquierda de la frontera, con rampa; a la derecha, plano."""
    if ch == '.':
        return None
    sombreado = col < FRONTERA
    if ch in 'hH':                                  # hoja
        if not sombreado:
            return VERDE[2]
        # luz arriba a la izquierda: el tono sube según se acerca a la esquina
        t = (col / COLS) * .5 + (fila / FILAS) * .5
        if ch == 'h':
            return VERDE[0] if t > .34 else VERDE[1]
        return VERDE[3] if t < .22 else (VERDE[2] if t < .38 else VERDE[1])
    if ch == 'm':                                   # nervio central
        return VERDE[0] if sombreado else VERDE[1]
    if ch == 't':                                   # tallo
        return BARRO[0] if sombreado else BARRO[1]
    if ch in 'TR':                                  # tiesto (T) y su borde (R)
        if not sombreado:
            return BARRO[3] if ch == 'R' else BARRO[2]
        t = (col / COLS) * .75 + (fila / FILAS) * .25
        if ch == 'R':                               # el borde recibe más luz
            return BARRO[3] if t < .32 else BARRO[2]
        return BARRO[2] if t < .28 else (BARRO[1] if t < .46 else BARRO[0])
    return None


def _lienzo():
    """El lienzo: damero de transparencia, sprite, cuadrícula y selección."""
    g = [f'<g clip-path="url(#{P}_cp_lienzo)">']
    # damero de transparencia
    for f in range(FILAS):
        for c in range(COLS):
            claro = (c + f) % 2 == 0
            g.append(f'<rect x="{M.r1(LX + c * CEL)}" y="{M.r1(LY + f * CEL)}" '
                     f'width="{M.r2(CEL)}" height="{M.r2(CEL)}" '
                     f'fill="{"#3a4553" if claro else "#2e3844"}"/>')
    # el sprite
    for f, fila in enumerate(MAPA):
        for c, ch in enumerate(fila):
            col = _color(ch, c, f)
            if col is None:
                continue
            g.append(f'<rect x="{M.r1(LX + c * CEL)}" y="{M.r1(LY + f * CEL)}" '
                     f'width="{M.r2(CEL + .2)}" height="{M.r2(CEL + .2)}" fill="{col}"/>')
    # cuadrícula del lienzo, fina y discreta
    for c in range(COLS + 1):
        g.append(f'<path d="M{M.r1(LX + c * CEL)} {M.r1(LY)} '
                 f'V{M.r1(LY + FILAS * CEL)}" stroke="#7d8ea0" stroke-width=".5" '
                 f'opacity="{.34 if c % 8 else .6}"/>')
    for f in range(FILAS + 1):
        g.append(f'<path d="M{M.r1(LX)} {M.r1(LY + f * CEL)} '
                 f'H{M.r1(LX + COLS * CEL)}" stroke="#7d8ea0" stroke-width=".5" '
                 f'opacity="{.34 if f % 8 else .6}"/>')
    # la frontera del sombreado, marcada: aquí es donde está la mano ahora
    g.append(f'<path d="M{M.r1(LX + FRONTERA * CEL)} {M.r1(LY)} '
             f'V{M.r1(LY + FILAS * CEL)}" stroke="#ffd45e" stroke-width="1.2" '
             f'opacity=".5" stroke-dasharray="4 3"/>')
    # marco de selección alrededor de la zona en la que se trabaja
    g.append(f'<rect x="{M.r1(LX + 5 * CEL - 1)}" y="{M.r1(LY - 1)}" '
             f'width="{M.r1(7 * CEL + 2)}" height="{M.r1(8 * CEL + 2)}" fill="none" '
             f'stroke="#ffffff" stroke-width="1.2" stroke-dasharray="5 4" opacity=".85"/>')
    g.append(f'<rect x="{M.r1(LX + 5 * CEL - 1)}" y="{M.r1(LY - 1)}" '
             f'width="{M.r1(7 * CEL + 2)}" height="{M.r1(8 * CEL + 2)}" fill="none" '
             f'stroke="{k["noche"]}" stroke-width="1.2" stroke-dasharray="4 5" '
             f'stroke-dashoffset="2" opacity=".6"/>')
    g.append('</g>')
    return ''.join(g)


def _rampa():
    """La rampa de color en construcción, con un hueco sin decidir."""
    g = []
    x0, y0 = VX + 12, VY + VH - 38
    for i, c in enumerate(VERDE + BARRO):
        x = x0 + i * 17
        if i == 6:                                   # el hueco: falta ese tono
            g.append(f'<rect x="{M.r1(x)}" y="{y0}" width="14" height="14" rx="1.5" '
                     f'fill="none" stroke="#8fa0b2" stroke-width="1" '
                     f'stroke-dasharray="2.5 2" opacity=".8"/>')
            continue
        g.append(f'<rect x="{M.r1(x)}" y="{y0}" width="14" height="14" rx="1.5" fill="{c}"/>'
                 f'<rect x="{M.r1(x)}" y="{y0}" width="14" height="4" rx="1.5" '
                 f'fill="#ffffff" opacity=".16"/>')
    # el tono activo, con su marco
    g.append(f'<rect x="{M.r1(x0 + 2 * 17 - 2)}" y="{y0 - 2}" width="18" height="18" '
             f'rx="2" fill="none" stroke="#ffd45e" stroke-width="1.6"/>')
    return ''.join(g)


def _fotogramas():
    """La tira de fotogramas: tres hechos, el cuarto todavía vacío."""
    g = []
    x0, y0 = VX + VW - 92, VY + 10
    for i in range(4):
        y = y0 + i * 36
        hecho = i < 3
        g.append(f'<rect x="{x0}" y="{M.r1(y)}" width="82" height="30" rx="2" '
                 f'fill="{"#39445200" if hecho else "#2b3542"}" '
                 f'stroke="#6d7d8f" stroke-width=".8" opacity=".95"/>')
        g.append(f'<rect x="{x0}" y="{M.r1(y)}" width="82" height="30" rx="2" '
                 f'fill="#323d4a" opacity=".85"/>')
        if hecho:
            # una miniatura del sprite, desplazada un píxel en cada fotograma
            for f, fila in enumerate(MAPA[:17]):
                for c, ch in enumerate(fila):
                    col = _color(ch, c, f)
                    if col is None:
                        continue
                    g.append(f'<rect x="{M.r2(x0 + 22 + c * 1.5 + (i - 1) * .8)}" '
                             f'y="{M.r2(y + 3 + f * 1.6)}" width="1.6" height="1.7" '
                             f'fill="{col}" opacity=".95"/>')
        else:
            g.append(f'<path d="M{x0 + 34} {M.r1(y + 15)} h14 M{x0 + 41} {M.r1(y + 8)} '
                     f'v14" stroke="#6d7d8f" stroke-width="1.6" opacity=".8" '
                     f'stroke-linecap="round"/>')
    g.append(f'<rect x="{x0 - 3}" y="{M.r1(y0 + 2 * 36 - 3)}" width="88" height="36" '
             f'rx="3" fill="none" stroke="#ffd45e" stroke-width="1.6" opacity=".9"/>')
    return ''.join(g)


def _pantalla():
    """La tableta: marco, vidrio, reflejo, pie y cable. Un objeto, no una interfaz."""
    g = [M.sombra(SX, SY + 40, SW, SH, op=.36, dx=14, dy=18, rx=8)]
    # el pie, detrás
    g.append(f'<path d="M{SX + SW / 2 - 16} {SY + SH - 6} h32 l10 46 h-52 Z" '
             f'fill="url(#{P}_metal)"/>')
    g.append(f'<ellipse cx="{SX + SW / 2}" cy="{SY + SH + 42}" rx="72" ry="12" '
             f'fill="url(#{P}_metal)"/>')
    g.append(M.contacto(SX + SW / 2 - 72, SY + SH + 50, 144, op=.4, alto=7))
    # marco
    g.append(f'<rect x="{SX}" y="{SY}" width="{SW}" height="{SH}" rx="9" '
             f'fill="url(#{P}_marco)"/>')
    g.append(f'<rect x="{SX}" y="{SY}" width="{SW}" height="{SH}" rx="9" fill="none" '
             f'stroke="{k["noche"]}" stroke-width="1.2" opacity=".5"/>')
    g.append(M.brillo_borde(f'M{SX + 9} {SY + 1.2} H{SX + SW - 9}', w=1.6, op=.5))
    # vidrio
    g.append(f'<rect x="{VX}" y="{VY}" width="{VW}" height="{VH}" rx="2" fill="#242e3a"/>')
    g.append(_lienzo())
    g.append(_rampa())
    g.append(_fotogramas())
    # el reflejo de la ventana cruzando el vidrio: esto es lo que lo hace vidrio
    g.append(f'<g clip-path="url(#{P}_cp_vidrio)" opacity=".13">'
             f'<path d="M{VX - 10} {VY + VH} L{VX + 120} {VY - 10} L{VX + 196} {VY - 10} '
             f'L{VX + 66} {VY + VH} Z" fill="#ffffff"/>'
             f'<path d="M{VX + 150} {VY + VH} L{VX + 280} {VY - 10} L{VX + 300} {VY - 10} '
             f'L{VX + 170} {VY + VH} Z" fill="#ffffff"/></g>')
    g.append(f'<rect x="{VX}" y="{VY}" width="{VW}" height="{VH}" rx="2" '
             f'fill="url(#{P}_vidrio)" opacity=".2"/>')
    # cable, cayendo por detrás hasta la mesa
    g.append(f'<path d="M{SX + SW - 30} {SY + SH} C{SX + SW + 18} {SY + SH + 40} '
             f'{SX + SW + 44} {MESA + 18} {SX + SW + 26} {MESA + 46}" fill="none" '
             f'stroke="{k["tinta"]}" stroke-width="5" stroke-linecap="round" opacity=".9"/>')
    g.append(f'<path d="M{SX + SW - 30} {SY + SH} C{SX + SW + 18} {SY + SH + 40} '
             f'{SX + SW + 44} {MESA + 18} {SX + SW + 26} {MESA + 46}" fill="none" '
             f'stroke="#54637a" stroke-width="1.6" stroke-linecap="round" opacity=".5"/>')
    return ''.join(g)


def _cuadricula_papel():
    """El papel cuadriculado donde el sprite se empezó a mano."""
    x, y, w, h = 20, 262, 176, 126
    d = f'M{x} {y + 6} L{x + w - 8} {y} L{x + w} {y + h - 8} L{x + 8} {y + h} Z'
    g = [M.sombra(x, y, w, h, op=.3, dx=8, dy=11, rx=2),
         f'<path d="{d}" fill="url(#{P}_pliego)"/>',
         f'<path d="{d}" fill="none" stroke="#b5ac9b" stroke-width="1" opacity=".8"/>',
         f'<g clip-path="url(#{P}_cp_cuadri)">']
    paso = 11.4
    for i in range(17):
        g.append(f'<path d="M{M.r1(x + i * paso)} {y - 6} l6 {h + 12}" stroke="#7fa8c8" '
                 f'stroke-width=".7" opacity="{.5 if i % 5 else .8}"/>')
    for j in range(13):
        g.append(f'<path d="M{x - 6} {M.r1(y + j * paso + 4)} l{w + 12} -7" '
                 f'stroke="#7fa8c8" stroke-width=".7" opacity="{.5 if j % 5 else .8}"/>')
    # casillas rellenas a lápiz: la misma planta, empezada a mano
    for f, fila in enumerate(MAPA[:13]):
        for c, ch in enumerate(fila):
            if ch == '.' or c < 4 or c > 17:
                continue
            cx = x + (c - 3) * paso * .78 + 14
            cy = y + f * paso * .82 + 12
            g.append(f'<rect x="{M.r1(cx)}" y="{M.r1(cy + (cx - x) * .035)}" '
                     f'width="{M.r2(paso * .74)}" height="{M.r2(paso * .74)}" '
                     f'fill="{k["grafito"]}" opacity="{M.r2(.3 + M.n(c * 5 + f, 2.1) * .35)}"/>')
    g.append('</g>')
    # la cuenta de anchura al margen, a lápiz
    g.append(M.trazo(f'M{x + 18} {y + h - 18} h96', k['grafito'], w=1.2, op=.5, halo=False))
    for i in range(6):
        g.append(f'<path d="M{M.r1(x + 18 + i * 19)} {M.r1(y + h - 22)} v8" '
                 f'stroke="{k["grafito"]}" stroke-width="1" opacity=".45"/>')
    return ''.join(g)


def _lapiz_optico():
    """El lápiz óptico, apoyado en el canto de la mesa."""
    return ('<g transform="rotate(-13 400 352)">'
            + M.sombra(318, 344, 168, 13, op=.3, dx=6, dy=9, rx=6)
            + f'<rect x="318" y="344" width="150" height="13" rx="6.5" fill="{k["tinta"]}"/>'
            + f'<rect x="318" y="345" width="150" height="4" rx="2" fill="#5c6b7e" '
              f'opacity=".8"/>'
            + f'<rect x="386" y="344" width="26" height="13" rx="2" fill="url(#{P}_metal)"/>'
            + f'<path d="M468 344 L494 349 L494 352 L468 357 Z" fill="#8e9dae"/>'
            + f'<path d="M490 349.6 L502 350.5 L490 351.8 Z" fill="{k["noche"]}"/>'
            + '</g>')


def _muestras():
    """Tira de muestras impresas: la rampa, también en papel."""
    g = [M.sombra(500, 318, 128, 34, op=.28, dx=6, dy=8, rx=2),
         '<g transform="rotate(7 564 335)">',
         f'<rect x="500" y="318" width="128" height="34" rx="2" fill="url(#{P}_pliego)"/>']
    for i, c in enumerate(VERDE + BARRO):
        g.append(f'<rect x="{M.r1(505 + i * 15)}" y="323" width="13" height="18" '
                 f'fill="{c}"/>')
    g.append(f'<rect x="505" y="345" width="118" height="2" rx="1" fill="{k["grafito"]}" '
             f'opacity=".4"/>')
    g.append('</g>')
    return ''.join(g)


def escena():
    defs = (
        M.defs_taller(P, tabla=('#cdae82', '#ad8a58', '#87643d', '#5a4128'))
        + M.defs_papel(P)
        + M.defs_metal(P)
        + M.defs_vidrio(P)
        + lg(f'{P}_marco', 0, 0, .3, 1,
             [(0, '#4a5464', None), (.3, '#333d4b', None), (1, '#1b232e', None)])
        + rg(f'{P}_brillopant', .5, .5, .62,
             [(0, '#8fd4ea', .16), (1, '#8fd4ea', 0)])
        + M.clip_rect(f'{P}_cp_lienzo', LX, LY, COLS * CEL, FILAS * CEL)
        + M.clip_rect(f'{P}_cp_vidrio', VX, VY, VW, VH, 2)
        + M.clip(f'{P}_cp_cuadri',
                 f'M20 268 L188 262 L196 380 L28 388 Z')
    )

    c = M.pared(P, MESA + 6, vx=36, vy=14, vw=150, vh=112)
    c += M.banco(P, MESA, juntas=(126, 492), nudos=((84, 300, 8), (592, 216, 7)))
    # la pantalla ilumina la mesa: un rebote frío delante de ella
    c += (f'<ellipse cx="{SX + SW / 2}" cy="{MESA + 96}" rx="250" ry="86" '
          f'fill="url(#{P}_brillopant)" filter="url(#b22)"/>')

    c += _pantalla()
    c += _muestras()
    c += _cuadricula_papel()
    c += _lapiz_optico()

    c += M.velo(P, MESA - 6, 56, op=.34)
    c += M.vineta(P, .85)
    return svg(c, defs)
