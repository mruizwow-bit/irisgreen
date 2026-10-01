# -*- coding: utf-8 -*-
"""Escena rica de Arquitectura y planos (R65 · tanda 3).

El tablero de delineación: **la planta y la maqueta a la vez**, que es
exactamente lo que dice este estudio.

Lo que se ve:

* el tablero inclinado con su superficie de trabajo y la regla paralela apoyada
  en la guía, que es lo que hace que las líneas salgan paralelas de verdad;
* **la planta dibujada**: muros de doble línea con el hueco relleno, puertas con
  su **arco de barrido**, ventanas partiendo el muro en tres trazos, la escalera
  con sus peldaños y su flecha de subida, cotas con sus líneas de referencia y
  sus remates inclinados, y los ejes de replanteo con su círculo numerado;
* una parte de la planta está **todavía en construcción**: el muro de la derecha
  va solo a lápiz, sin entintar, y falta cerrar una esquina;
* al lado, **la maqueta de cartón gris del mismo edificio**, con los muros
  levantados, la cubierta aún no puesta y apoyada de canto contra el tablero, y
  el hueco de la puerta coincidiendo con el del plano;
* la maqueta proyecta sombra dura: es un volumen, no un dibujo;
* el escalímetro triangular, con sus tres caras y sus graduaciones;
* la escuadra de 45 grados, translúcida, con el bisel levantado del papel;
* el portaminas y el compás, y las gomas de borrar del rapado del papel.

Nada de personas. Lo que se enseña es el oficio: dibujar y comprobar en volumen.
"""
import math

from taller_suite.escenas_ricas import C, W, H, svg, lg, rg
from taller_suite import rica_comun as M

k = C
P = 'ar'

MESA = 116

AZUL = '#2b5d84'
LAPIZ = '#7d8996'
CARTON = '#b9b4a8'
CARTON_S = '#8c877c'

# La lámina sobre el tablero
LX, LY, LW, LH = 24, 138, 356, 252


def _lamina_pt(u, v):
    """Punto (u,v) en [0,1]² dentro de la lámina, con su escorzo."""
    x = LX + 14 + u * (LW - 34) + v * 10
    y = LY + 12 + v * (LH - 30) - u * 8
    return M.r1(x), M.r1(y)


def _muro(x0, y0, x1, y1, *, grosor=9, lapiz=False):
    """Un muro: dos líneas y el hueco relleno, como en un plano de verdad."""
    dx, dy = x1 - x0, y1 - y0
    ln = max((dx * dx + dy * dy) ** .5, .001)
    nx, ny = -dy / ln * grosor / 2, dx / ln * grosor / 2
    col = LAPIZ if lapiz else k['tinta']
    op = .55 if lapiz else .92
    d = (f'M{M.r1(x0 + nx)} {M.r1(y0 + ny)} L{M.r1(x1 + nx)} {M.r1(y1 + ny)} '
         f'L{M.r1(x1 - nx)} {M.r1(y1 - ny)} L{M.r1(x0 - nx)} {M.r1(y0 - ny)} Z')
    if lapiz:
        return (f'<path d="{d}" fill="none" stroke="{col}" stroke-width="1.6" '
                f'opacity="{op}" stroke-dasharray="7 3"/>')
    return (f'<path d="{d}" fill="{col}" opacity="{op}"/>'
            f'<path d="{d}" fill="none" stroke="{col}" stroke-width="1.1" '
            f'opacity="{op}"/>')


def _puerta(cx, cy, r, a0, sentido=1):
    """Una puerta: la hoja y su arco de barrido. Sin el arco no es una puerta."""
    a1 = a0 + 90 * sentido
    x0, y0 = cx + r * math.cos(math.radians(a0)), cy + r * math.sin(math.radians(a0))
    x1, y1 = cx + r * math.cos(math.radians(a1)), cy + r * math.sin(math.radians(a1))
    barrido = 1 if sentido > 0 else 0
    return (f'<path d="M{M.r1(x0)} {M.r1(y0)} A{r} {r} 0 0 {barrido} '
            f'{M.r1(x1)} {M.r1(y1)}" fill="none" stroke="{k["tinta"]}" '
            f'stroke-width="1" opacity=".55" stroke-dasharray="4 3"/>'
            f'<path d="M{M.r1(cx)} {M.r1(cy)} L{M.r1(x0)} {M.r1(y0)}" '
            f'stroke="{k["tinta"]}" stroke-width="2.6" opacity=".85" '
            f'stroke-linecap="round"/>')


def _cota(x0, y0, x1, y1, *, desfase=16):
    """Una cota: línea, remates inclinados y líneas de referencia."""
    dx, dy = x1 - x0, y1 - y0
    ln = max((dx * dx + dy * dy) ** .5, .001)
    nx, ny = -dy / ln * desfase, dx / ln * desfase
    ax, ay, bx, by = x0 + nx, y0 + ny, x1 + nx, y1 + ny
    g = [f'<path d="M{M.r1(ax)} {M.r1(ay)} L{M.r1(bx)} {M.r1(by)}" '
         f'stroke="{AZUL}" stroke-width=".9" opacity=".75"/>']
    for px, py in ((x0, y0), (x1, y1)):
        g.append(f'<path d="M{M.r1(px)} {M.r1(py)} L{M.r1(px + nx * 1.25)} '
                 f'{M.r1(py + ny * 1.25)}" stroke="{AZUL}" stroke-width=".7" '
                 f'opacity=".55"/>')
    for px, py in ((ax, ay), (bx, by)):
        g.append(f'<path d="M{M.r1(px - dx / ln * 4 - nx * .16)} '
                 f'{M.r1(py - dy / ln * 4 - ny * .16)} '
                 f'L{M.r1(px + dx / ln * 4 + nx * .16)} '
                 f'{M.r1(py + dy / ln * 4 + ny * .16)}" stroke="{AZUL}" '
                 f'stroke-width="1.4" opacity=".8"/>')
    # la cifra, como bloque: no se lee texto en una tarjeta de 172 px
    mx, my = (ax + bx) / 2, (ay + by) / 2
    g.append(f'<rect x="{M.r1(mx - 9)}" y="{M.r1(my - 7)}" width="18" height="2.6" '
             f'rx="1.3" fill="{AZUL}" opacity=".8"/>')
    return ''.join(g)


def _planta():
    """La planta: muros, puertas, ventanas, escalera, cotas y ejes."""
    g = [f'<g clip-path="url(#{P}_cp_lamina)">']
    # la retícula del papel milimetrado, muy tenue
    for i in range(24):
        a = _lamina_pt(i / 23, 0)
        b = _lamina_pt(i / 23, 1)
        g.append(f'<path d="M{a[0]} {a[1]} L{b[0]} {b[1]}" stroke="{AZUL}" '
                 f'stroke-width=".5" opacity="{.22 if i % 5 else .38}"/>')
    for j in range(17):
        a = _lamina_pt(0, j / 16)
        b = _lamina_pt(1, j / 16)
        g.append(f'<path d="M{a[0]} {a[1]} L{b[0]} {b[1]}" stroke="{AZUL}" '
                 f'stroke-width=".5" opacity="{.22 if j % 5 else .38}"/>')

    e = _lamina_pt
    # el perímetro: cuatro muros, el de la derecha todavía a lápiz
    esq = [e(.10, .18), e(.72, .13), e(.76, .74), e(.14, .80)]
    g.append(_muro(*esq[0], *esq[1]))
    g.append(_muro(*esq[3], *esq[2]))
    g.append(_muro(*esq[0], *esq[3]))
    g.append(_muro(*esq[1], *esq[2], lapiz=True))       # sin entintar
    # un tabique interior, y el hueco de la puerta
    t0, t1 = e(.40, .155), e(.43, .55)
    g.append(_muro(*t0, *t1, grosor=7))
    g.append(_puerta(*e(.43, .56), 26, -86, sentido=1))
    # la ventana: el muro partido en tres trazos
    v0, v1 = e(.20, .19), e(.34, .185)
    g.append(f'<rect x="{v0[0]}" y="{M.r1(v0[1] - 4)}" '
             f'width="{M.r1(v1[0] - v0[0])}" height="8" fill="#fdfbf3"/>')
    for dy in (-3.2, 0, 3.2):
        g.append(f'<path d="M{v0[0]} {M.r1(v0[1] + dy)} L{v1[0]} {M.r1(v1[1] + dy)}" '
                 f'stroke="{k["tinta"]}" stroke-width="1" opacity=".8"/>')
    # la escalera: peldaños y flecha de subida
    ex0, ey0 = e(.50, .32)
    for i in range(9):
        g.append(f'<path d="M{M.r1(ex0 + i * 11)} {M.r1(ey0 - i * .9)} '
                 f'l4 62" stroke="{k["tinta"]}" stroke-width="1.1" opacity=".72"/>')
    g.append(f'<path d="M{M.r1(ex0 - 2)} {M.r1(ey0 - 2)} l4 64 l100 -9 l-4 -64 Z" '
             f'fill="none" stroke="{k["tinta"]}" stroke-width="1.2" opacity=".8"/>')
    g.append(M.trazo(f'M{M.r1(ex0 + 6)} {M.r1(ey0 + 30)} l90 -8', k['tinta'],
                     w=1.2, op=.8, halo=False))
    g.append(f'<path d="M{M.r1(ex0 + 96)} {M.r1(ey0 + 22)} l-9 -4 m9 4 l-8 5" '
             f'fill="none" stroke="{k["tinta"]}" stroke-width="1.2" opacity=".8" '
             f'stroke-linecap="round"/>')
    # los ejes de replanteo, con su círculo
    for i, u in enumerate((.10, .43, .76)):
        a = e(u, .04)
        b = e(u, .90)
        g.append(f'<path d="M{a[0]} {a[1]} L{b[0]} {b[1]}" stroke="{AZUL}" '
                 f'stroke-width=".8" opacity=".5" stroke-dasharray="14 4 3 4"/>')
        g.append(f'<circle cx="{a[0]}" cy="{M.r1(a[1] - 6)}" r="8" fill="#fdfbf3" '
                 f'stroke="{AZUL}" stroke-width="1" opacity=".9"/>')
        g.append(f'<rect x="{M.r1(a[0] - 4)}" y="{M.r1(a[1] - 7.4)}" width="8" '
                 f'height="2.6" rx="1.3" fill="{AZUL}" opacity=".85"/>')
    # cotas: una abajo y otra a la izquierda
    g.append(_cota(*e(.10, .80), *e(.43, .775), desfase=18))
    g.append(_cota(*e(.43, .775), *e(.76, .745), desfase=18))
    g.append(_cota(*e(.095, .18), *e(.14, .80), desfase=-18))
    # la esquina que falta por cerrar, marcada
    cx, cy = e(.74, .155)
    g.append(f'<circle cx="{cx}" cy="{cy}" r="13" fill="none" stroke="#c8322c" '
             f'stroke-width="1.8" opacity=".8" stroke-dasharray="17 5"/>')
    g.append('</g>')
    return ''.join(g)


def _tablero():
    """El tablero inclinado con la lámina y la regla paralela."""
    g = [M.sombra(8, 104, 404, 296, op=.36, dx=13, dy=15, rx=4),
         f'<path d="M14 108 L400 96 L418 400 L6 400 Z" fill="url(#{P}_tablero)"/>',
         f'<path d="M14 108 L400 96" stroke="#aebecb" stroke-width="2.4" opacity=".55"/>',
         # la lámina
         M.sombra(LX, LY, LW, LH, op=.26, dx=6, dy=8, rx=2, blur='b2'),
         f'<path d="M{LX} {LY + 8} L{LX + LW - 6} {LY} L{LX + LW} {LY + LH - 8} '
         f'L{LX + 6} {LY + LH} Z" fill="url(#{P}_pliego)"/>',
         f'<path d="M{LX} {LY + 8} L{LX + LW - 6} {LY} L{LX + LW} {LY + LH - 8} '
         f'L{LX + 6} {LY + LH} Z" fill="none" stroke="#c0b7a5" stroke-width="1" '
         f'opacity=".8"/>']
    return ''.join(g)


def _regla_paralela():
    """La regla paralela sobre su guía: es lo que da las horizontales."""
    g = ['<g transform="rotate(-2 210 330)">',
         M.sombra(6, 324, 404, 20, op=.3, dx=5, dy=8, rx=3, sesgo=-.1),
         f'<rect x="6" y="324" width="404" height="19" rx="3" '
         f'fill="url(#{P}_acrilico)"/>',
         f'<rect x="6" y="324" width="404" height="5" rx="2.5" fill="#ffffff" '
         f'opacity=".5"/>',
         f'<path d="M6 341 H410" stroke="{k["noche"]}" stroke-width="1.4" '
         f'opacity=".35"/>']
    for i in range(40):
        x = 14 + i * 10
        largo = 9 if i % 5 == 0 else 5
        g.append(f'<path d="M{M.r1(x)} 343 v{-largo}" stroke="{k["tinta"]}" '
                 f'stroke-width=".8" opacity=".6"/>')
    # los carros de los cables, a los extremos
    for cx in (22, 394):
        g.append(f'<rect x="{cx - 11}" y="318" width="22" height="31" rx="4" '
                 f'fill="url(#{P}_metal)"/>')
        g.append(f'<circle cx="{cx}" cy="333" r="4" fill="{k["noche"]}" opacity=".45"/>')
    g.append('</g>')
    return ''.join(g)


def _escuadra():
    """La escuadra de 45 grados, translúcida y con el bisel levantado."""
    g = ['<g transform="rotate(14 300 176) scale(.62) translate(112 48)">',
         M.sombra(158, 176, 188, 132, op=.22, dx=6, dy=9, rx=3, blur='b2'),
         f'<path d="M160 180 L344 180 L160 300 Z" fill="url(#{P}_acrilico)" '
         f'opacity=".62"/>',
         f'<path d="M160 180 L344 180 L160 300 Z" fill="none" stroke="#9fc4d8" '
         f'stroke-width="2.4" opacity=".9"/>',
         # el hueco central, que toda escuadra lleva
         f'<path d="M186 200 L296 200 L186 272 Z" fill="none" stroke="#9fc4d8" '
         f'stroke-width="2.2" opacity=".7"/>',
         # el bisel: la escuadra no toca el papel, y por eso su sombra va separada
         f'<path d="M160 180 L344 180" stroke="#ffffff" stroke-width="3.4" '
         f'opacity=".65"/>']
    for i in range(14):
        x = 176 + i * 12
        g.append(f'<path d="M{M.r1(x)} 182 v10" stroke="{k["tinta"]}" '
                 f'stroke-width="1.2" opacity=".45"/>')
    g.append('</g>')
    return ''.join(g)


def _maqueta():
    """La maqueta de cartón gris: los mismos muros, levantados."""
    ox, oy = 452, 268                       # origen de la planta de la maqueta
    ex, ey = 46, -20                        # vector "derecha" en proyección
    fx, fy = 32, 24                         # vector "fondo"
    alto = 52

    def p(u, v, w=0):
        return M.r1(ox + u * ex + v * fx), M.r1(oy + u * ey + v * fy - w * alto)

    g = [M.sombra(408, 250, 220, 150, op=.36, dx=16, dy=12, rx=4, sesgo=-.5)]
    # la base
    b = [p(0, 0), p(3, 0), p(3, 2.4), p(0, 2.4)]
    g.append('<path d="M%s %s L%s %s L%s %s L%s %s Z" fill="%s"/>'
             % (*b[0], *b[1], *b[2], *b[3], '#cfcabd'))
    g.append('<path d="M%s %s L%s %s L%s %s L%s %s Z" fill="none" stroke="%s" '
             'stroke-width="1" opacity=".5"/>' % (*b[0], *b[1], *b[2], *b[3], CARTON_S))

    def pared(u0, v0, u1, v1, cara):
        a, b2 = p(u0, v0), p(u1, v1)
        c1, d1 = p(u1, v1, 1), p(u0, v0, 1)
        return ('<path d="M%s %s L%s %s L%s %s L%s %s Z" fill="%s"/>'
                % (*a, *b2, *c1, *d1, cara)
                + '<path d="M%s %s L%s %s L%s %s L%s %s Z" fill="none" stroke="%s" '
                  'stroke-width=".9" opacity=".45"/>' % (*a, *b2, *c1, *d1, CARTON_S))

    # muros: los del fondo primero
    g.append(pared(0, 0, 3, 0, '#b0aa9d'))          # fondo, en sombra
    g.append(pared(0, 0, 0, 2.4, '#dcd7ca'))        # izquierda, a la luz
    g.append(pared(3, 0, 3, 2.4, '#9a9488'))        # derecha, en sombra
    # el frente, con el hueco de la puerta recortado
    a, b2 = p(0, 2.4), p(3, 2.4)
    c1, d1 = p(3, 2.4, 1), p(0, 2.4, 1)
    pa, pb = p(1.1, 2.4), p(1.8, 2.4)
    pc, pd = p(1.8, 2.4, .72), p(1.1, 2.4, .72)
    g.append('<path d="M%s %s L%s %s L%s %s L%s %s Z M%s %s L%s %s L%s %s L%s %s Z" '
             'fill="%s" fill-rule="evenodd"/>'
             % (*a, *b2, *c1, *d1, *pa, *pb, *pc, *pd, '#c6c1b4'))
    g.append('<path d="M%s %s L%s %s L%s %s L%s %s Z" fill="none" stroke="%s" '
             'stroke-width="1.2" opacity=".6"/>' % (*pa, *pb, *pc, *pd, CARTON_S))
    # el canto del cartón: las capas se ven por arriba
    for u0, v0, u1, v1 in ((0, 0, 3, 0), (0, 0, 0, 2.4), (3, 0, 3, 2.4),
                           (0, 2.4, 3, 2.4)):
        a, b2 = p(u0, v0, 1), p(u1, v1, 1)
        g.append('<path d="M%s %s L%s %s" stroke="#f0ece1" stroke-width="3" '
                 'opacity=".85"/>' % (*a, *b2))
    # la cubierta, todavía sin poner, apoyada de canto
    g.append('<g transform="rotate(-76 604 330)">')
    g.append(M.sombra(546, 300, 116, 76, op=.28, dx=8, dy=10, rx=2, blur='b2'))
    g.append(f'<rect x="546" y="300" width="116" height="74" rx="2" fill="{CARTON}"/>')
    g.append(f'<rect x="546" y="300" width="116" height="74" rx="2" fill="none" '
             f'stroke="{CARTON_S}" stroke-width="1" opacity=".6"/>')
    g.append(f'<rect x="546" y="300" width="116" height="5" fill="#efeade" '
             f'opacity=".8"/>')
    g.append('</g>')
    return ''.join(g)


def _escalimetro():
    """El escalímetro triangular: tres caras y sus graduaciones."""
    g = ['<g transform="rotate(-9 508 380)">',
         M.sombra(418, 366, 182, 30, op=.3, dx=6, dy=9, rx=3, sesgo=-.14),
         f'<path d="M418 380 L600 368 L602 380 L420 392 Z" fill="#f2f2ee"/>',
         f'<path d="M418 380 L600 368 L598 360 L416 372 Z" fill="#dcdcd6"/>',
         f'<path d="M420 392 L602 380 L600 388 L422 400 Z" fill="#b9b9b2"/>']
    for i in range(34):
        x = 424 + i * 5.2
        largo = 7 if i % 5 == 0 else 4
        g.append(f'<path d="M{M.r1(x)} {M.r1(380.6 - i * .066)} v-{largo}" '
                 f'stroke="{k["tinta"]}" stroke-width=".7" opacity=".6"/>')
    g.append(M.brillo_borde('M418 374 L600 362', w=1.6, op=.5))
    g.append('</g>')
    return ''.join(g)


def _portaminas():
    return ('<g transform="rotate(-38 176 372)">'
            + M.sombra(112, 366, 140, 12, op=.26, dx=4, dy=6, rx=6, blur='b2')
            + f'<rect x="124" y="366" width="118" height="12" rx="6" fill="#1f3550"/>'
            + f'<rect x="124" y="367" width="118" height="3.2" rx="1.6" '
              f'fill="#5a7a9c" opacity=".8"/>'
            + f'<rect x="200" y="365" width="26" height="14" rx="2" '
              f'fill="url(#{P}_metal)"/>'
            + f'<path d="M112 369 L126 367 L126 377 L112 375 Z" '
              f'fill="url(#{P}_metal)"/>'
            + f'<path d="M106 372 l7 -1.2 v4.4 Z" fill="{k["tinta"]}"/>'
            + '</g>')


def _gomas():
    """El rapado de la goma: las virutas que quedan sobre la lámina."""
    g = []
    for i in range(9):
        x = 60 + M.n(i, 3.1) * 300
        y = 350 + M.n(i, 7.7) * 42
        g.append(f'<ellipse cx="{M.r1(x)}" cy="{M.r1(y)}" '
                 f'rx="{M.r2(2 + M.n(i, 5.3) * 4)}" ry="{M.r2(1.2 + M.n(i, 9.1) * 1.8)}" '
                 f'fill="#e2dbc9" opacity="{M.r2(.5 + M.n(i, 11.3) * .3)}" '
                 f'transform="rotate({M.r1(M.n(i, 2.7) * 180)} {M.r1(x)} {M.r1(y)})"/>')
    return ''.join(g)


def _defs():
    """Los gradientes, filtros y recortes de esta escena.

    Vive aparte para que la variante AGE_0_12 pueda reutilizar
    exactamente los mismos, sin duplicarlos y sin que puedan divergir.
    """
    return (
        M.defs_taller(P, tabla=('#b99b73', '#96784c', '#705334', '#48331d'))
        + M.defs_papel(P, base=('#fdfbf3', '#f6f2e6', '#ddd6c4'))
        + M.defs_metal(P)
        + lg(f'{P}_tablero', 0, 0, .2, 1,
             [(0, '#5d7183', None), (.4, '#47596a', None), (1, '#2c3946', None)])
        + lg(f'{P}_acrilico', 0, 0, .6, 1,
             [(0, '#eaf6fb', .78), (.4, '#cfe6f0', .62), (1, '#a8c9db', .6)])
        + rg(f'{P}_focosuelo', .5, .5, .5, [(0, '#fff0cf', .45), (1, '#fff0cf', 0)])
        + M.clip(f'{P}_cp_lamina',
                 f'M{LX} {LY + 8} L{LX + LW - 6} {LY} L{LX + LW} {LY + LH - 8} '
                 f'L{LX + 6} {LY + LH} Z')
    )


def escena():
    defs = _defs()

    c = M.pared(P, MESA + 6, vx=432, vy=8, vw=150, vh=90)
    c += M.banco(P, MESA, juntas=(430,), nudos=((560, 372, 8),))
    c += (f'<ellipse cx="200" cy="220" rx="250" ry="150" fill="url(#{P}_focosuelo)" '
          f'opacity=".45" filter="url(#b22)"/>')

    c += _tablero()
    c += _planta()
    c += _gomas()
    c += _escalimetro()
    c += _maqueta()
    c += _escuadra()
    c += _regla_paralela()
    c += _portaminas()

    c += M.velo(P, MESA - 6, 46, op=.28)
    c += M.vineta(P, .85)
    return svg(c, defs)
