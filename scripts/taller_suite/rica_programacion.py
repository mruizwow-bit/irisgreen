# -*- coding: utf-8 -*-
"""Escena rica de Programación (R54 R2).

No el programa terminado: **el sistema en marcha, sobre el banco donde se hace**.

Tres planos. Al fondo, la pared cálida del taller con la luz de la lámpara
entrando por arriba a la izquierda y un rollo de cable colgado, fuera de foco.
En medio, apoyado en el banco de madera con su canto, su pie y su sombra, un
panel ancho de programación visual: dentro, el grafo de módulos con puertos,
cables y señales, y el visor donde se ve el efecto —la rejilla del campo que
está calculando y la curva de respuesta que se pasa del límite—. Delante, en
la madera y bien cerca, las cosas del mundo: la placa con sus pines y su cable
subiendo a conectarse al panel, el cuaderno con el mismo grafo tanteado a mano
y el mando apoyado.

Lo que está a medias, que es lo que cuenta:

* un módulo levantado del lienzo, todavía colocándose, con su cable **a medio
  trazar**: la punta encendida se ha quedado corta y el conector de destino
  espera punteado en el borde del visor;
* un parámetro del módulo grande **fuera de rango**: el relleno se sale de la
  pista y el módulo va marcado con aro de aviso;
* y la consecuencia, medida: el pico de la curva cruza la línea roja de tope.

Los encajables del estudio siguen ahí, pero ya no son barras de color plano:
son piezas mecanizadas con pestaña y muesca —el módulo de fuente encaja en el
de ganancia— con bisel inferior, ruido de material y canto cálido a la
izquierda.

Luz: una sola clave cálida desde arriba a la izquierda, sobre pared, madera y
objetos. El panel encendido es lo único frío, y ese contraste es el que separa
el sitio del sistema.
"""
import math

from taller_suite.escenas_ricas import C, W, H, svg, lg, rg

k = C

CAL = '#ffdca8'          # canto cálido: la clave, por la izquierda
FRI = '#9fd8f5'          # canto frío: el panel encendido, por la derecha
OSC = '#0b1620'          # alma oscura de los cables

MESA = 286                                   # donde la pared se encuentra con el banco
FX0, FY0, FW0, FH0 = 112, 56, 452, 226       # marco del panel (antes de girarlo)
SX, SY, SW, SH = 124, 68, 428, 202           # su pantalla
# apoyado y un punto más lejos, para que el taller respire alrededor
GIRO = ('translate(0 6) translate(338 169) scale(.94) translate(-338 -169) '
        'rotate(-2 338 169)')


# ── piezas del sistema ──────────────────────────────────────────────────────
def _modulo(x, y, w, h, grad, cS, cab, rx=7, hh=15, pestana=False, muesca=False):
    """Módulo del sistema: cuerpo mecanizado con bisel inferior, cabecera de
    color, ruido de material y los dos cantos de luz. `pestana`/`muesca` son el
    encaje entre dos piezas apiladas."""
    hx = (f'M{x} {y + hh} V{y + rx} a{rx} {rx} 0 0 1 {rx} -{rx} h{w - 2 * rx} '
          f'a{rx} {rx} 0 0 1 {rx} {rx} V{y + hh}z')
    s = ''
    if pestana:                                  # el tetón que entra en la muesca
        s += (f'<rect x="{x + 26}" y="{y + h - 6}" width="24" height="14" rx="5" fill="{cS}"/>'
              f'<rect x="{x + 26}" y="{y + h - 6}" width="24" height="10" rx="4.5" '
              f'fill="url(#{grad})"/>')
    s += (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{cS}"/>'
          f'<rect x="{x}" y="{y}" width="{w}" height="{h - 3}" rx="{rx - .5}" fill="url(#{grad})"/>'
          f'<path d="{hx}" fill="{cab}"/><path d="{hx}" fill="url(#pg_hdr)"/>'
          f'<path d="M{x} {y + hh} h{w}" stroke="{cS}" stroke-width="1.4" opacity=".6"/>'
          f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" filter="url(#grano)" '
          f'style="mix-blend-mode:multiply" opacity=".1"/>'
          f'<path d="M{x + 7} {y + 1.8} h{w - 14}" stroke="#fff" stroke-width="1.9" '
          f'stroke-linecap="round" opacity=".5"/>'
          f'<path d="M{x + 1.4} {y + 8} v{h - 17}" stroke="{CAL}" stroke-width="2" '
          f'stroke-linecap="round" opacity=".55"/>'
          f'<path d="M{x + w - 1.5} {y + 9} v{h - 19}" stroke="{FRI}" stroke-width="1.7" '
          f'stroke-linecap="round" opacity=".4"/>'
          f'<path d="M{x + 7} {y + h - 1.4} h{w - 14}" stroke="{k["noche"]}" stroke-width="2.2" '
          f'stroke-linecap="round" opacity=".42"/>')
    if muesca:
        s += (f'<rect x="{x + 25}" y="{y - 1}" width="26" height="9" rx="4" fill="{cS}"/>'
              f'<ellipse cx="{x + 38}" cy="{y + 2}" rx="12" ry="4" fill="{k["noche"]}" '
              f'opacity=".6" filter="url(#b2)"/>')
    return s


def _txt(x, y, t, s=11, col='#f2fbff', op=.95, ancla='start', peso='600', ls=.5):
    return (f'<text x="{x}" y="{y}" font-family="system-ui,sans-serif" font-size="{s}" '
            f'font-weight="{peso}" letter-spacing="{ls}" text-anchor="{ancla}" fill="{col}" '
            f'opacity="{op}">{t}</text>')


def _puerto(px, py, col, r=5.2):
    return (f'<circle cx="{px}" cy="{py}" r="{r + 3}" fill="{col}" opacity=".3" filter="url(#b2)"/>'
            f'<circle cx="{px}" cy="{py}" r="{r}" fill="#0e1822"/>'
            f'<circle cx="{px}" cy="{py}" r="{r}" fill="none" stroke="#a8bfd0" stroke-width="1.1" '
            f'opacity=".55"/>'
            f'<circle cx="{px}" cy="{py}" r="{r - 2.3}" fill="{col}"/>'
            f'<circle cx="{px - .5}" cy="{py - .8}" r="{r - 3.8}" fill="#fff" opacity=".6"/>')


def _puerto_frio(px, py, r=5.2):
    return (f'<circle cx="{px}" cy="{py}" r="{r}" fill="#0e1822"/>'
            f'<circle cx="{px}" cy="{py}" r="{r}" fill="none" stroke="#7d93a6" stroke-width="1.1" '
            f'opacity=".45"/>'
            f'<circle cx="{px}" cy="{py}" r="{r - 2.6}" fill="#2b3946"/>')


def _fantasma(px, py, col='#bfe6ff'):
    return (f'<circle cx="{px}" cy="{py}" r="10" fill="{col}" opacity=".15" filter="url(#b5)"/>'
            f'<circle cx="{px}" cy="{py}" r="7.4" fill="none" stroke="{col}" stroke-width="1.7" '
            f'stroke-dasharray="3.2 3.4" opacity=".88"/>'
            f'<circle cx="{px}" cy="{py}" r="2" fill="{col}" opacity=".55"/>')


def _cable(dp, col, colL, w=3.8, sig=True, esp=16, dz=0):
    """Cable tendido: sombra sobre el lienzo, alma oscura, color, filo de luz
    arriba y las señales como puntos espaciados."""
    s = (f'<path d="{dp}" fill="none" stroke="#040b12" stroke-width="{w + 2}" '
         f'stroke-linecap="round" opacity=".38" filter="url(#b5)" transform="translate(4 8)"/>'
         f'<path d="{dp}" fill="none" stroke="{col}" stroke-width="{w + 6}" stroke-linecap="round" '
         f'opacity=".15" filter="url(#b5)"/>'
         f'<path d="{dp}" fill="none" stroke="{OSC}" stroke-width="{w + 2}" stroke-linecap="round" '
         f'opacity=".6"/>'
         f'<path d="{dp}" fill="none" stroke="{col}" stroke-width="{w}" stroke-linecap="round"/>'
         f'<path d="{dp}" fill="none" stroke="{colL}" stroke-width="1.1" stroke-linecap="round" '
         f'opacity=".5" transform="translate(0 -1)"/>')
    if sig:
        s += (f'<path d="{dp}" fill="none" stroke="{colL}" stroke-width="{w + 2}" '
              f'stroke-linecap="round" stroke-dasharray="0.1 {esp}" stroke-dashoffset="{dz}" '
              f'opacity=".35" filter="url(#b2)"/>'
              f'<path d="{dp}" fill="none" stroke="#f4ffff" stroke-width="{w - 1.4}" '
              f'stroke-linecap="round" stroke-dasharray="0.1 {esp}" stroke-dashoffset="{dz}" '
              f'opacity=".95"/>')
    return s


def _carril(x, y, w, llenado, col, colL, alto=6, punteado=False, rebosa=False):
    """Carril de parámetro. Punteado = sin asignar. Rebosa = fuera de rango."""
    if punteado:
        return (f'<rect x="{x}" y="{y}" width="{w}" height="{alto}" rx="{alto / 2}" '
                f'fill="{k["noche"]}" opacity=".4"/>'
                f'<rect x="{x}" y="{y}" width="{w}" height="{alto}" rx="{alto / 2}" fill="none" '
                f'stroke="#9fb6c8" stroke-width="1.1" stroke-dasharray="3.5 4" opacity=".5"/>')
    lw = w * llenado
    s = (f'<rect x="{x}" y="{y}" width="{w}" height="{alto}" rx="{alto / 2}" '
         f'fill="{k["noche"]}" opacity=".45"/>'
         f'<rect x="{x}" y="{y}" width="{lw:.1f}" height="{alto}" rx="{alto / 2}" fill="{col}"/>'
         f'<rect x="{x + 1.2}" y="{y + 1}" width="{max(lw - 2.4, 1):.1f}" height="1.8" rx=".9" '
         f'fill="{colL}" opacity=".6"/>')
    if rebosa:      # el relleno se sale de la pista: el valor no cabe
        s += (f'<path d="M{x + w} {y - 3} v{alto + 6}" stroke="{k["roj"]}" stroke-width="1.7" '
              f'opacity=".9"/>'
              f'<rect x="{x + w}" y="{y}" width="11" height="{alto}" rx="{alto / 2}" '
              f'fill="{k["rojL"]}"/>'
              f'<rect x="{x + w}" y="{y}" width="11" height="2" rx="1" fill="{k["rojLL"]}" '
              f'opacity=".6"/>')
    return s


# ── lo que el sistema está calculando, dentro del visor ─────────────────────
MX, MY, MC, MCOLS, MROWS = 351.0, 118.0, 13.8, 13, 4
PAL = ['#12313f', '#17505f', '#1d7380', '#2f9c8e', '#63c19e', '#c6c791']


def _malla():
    out = []
    for j in range(MROWS):
        for i in range(MCOLS):
            v = (math.sin((i - j * 1.6) * .46) * .72 + math.cos(j * .78 - i * .13) * .38
                 + math.sin(i * i * .011 + j * .62) * .3)
            n = min(.999, max(0., (v + 1.34) / 2.68)) ** 1.45
            idx = int(n * len(PAL))
            x, y = MX + i * MC, MY + j * MC
            out.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="9.6" height="9.6" rx="1.9" '
                       f'fill="{PAL[idx]}"/>')
            if idx == 5:                         # frente de onda: celdas recién resueltas
                out.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="9.6" height="9.6" rx="1.9" '
                           f'fill="none" stroke="#fff3cf" stroke-width="1" opacity=".45"/>')
    return ''.join(out)


CX0, CX1, CYB, CAMP, CLIM = 351.0, 529.0, 240.0, 26.0, 207.0


def _pts():
    """Escalón medido: un tramo plano antes del salto y luego el timbre."""
    p = []
    for t in range(81):
        u = t / 80.0
        if u <= .13:
            y = CYB
        else:
            v = (u - .13) / .87
            y = CYB - CAMP * (1 - math.exp(-2.2 * v) * math.cos(12.0 * v))
        p.append((CX0 + u * (CX1 - CX0), y))
    return p


def _curva():
    p = _pts()
    dp = 'M' + ' L'.join(f'{a:.1f} {b:.1f}' for a, b in p)
    fuera = [c for c in p if c[1] < CLIM]
    s = (f'<path d="{dp} L{CX1} {CYB} L{CX0} {CYB}z" fill="url(#pg_area)"/>'
         f'<path d="M{CX0} {CYB - CAMP} H{CX1}" stroke="#9fd8f5" stroke-width="1.1" '
         f'stroke-dasharray="5 5" opacity=".45"/>'
         f'<path d="M{CX0} {CLIM} H{CX1}" stroke="{k["rojL"]}" stroke-width="1.3" '
         f'stroke-dasharray="4 4.5" opacity=".8"/>'
         f'<path d="M{CX0} {CYB} H{CX1}" stroke="#9fd8f5" stroke-width="1" opacity=".35"/>'
         f'<path d="{dp}" fill="none" stroke="{k["oroL"]}" stroke-width="4" stroke-linecap="round" '
         f'opacity=".28" filter="url(#b2)"/>'
         f'<path d="{dp}" fill="none" stroke="{k["oroLL"]}" stroke-width="2.1" '
         f'stroke-linecap="round" stroke-linejoin="round"/>')
    if fuera:
        df = 'M' + ' L'.join(f'{a:.1f} {b:.1f}' for a, b in fuera)
        mx, my = min(fuera, key=lambda c: c[1])
        s += (f'<path d="{df}" fill="none" stroke="{k["rojL"]}" stroke-width="4" '
              f'stroke-linecap="round" opacity=".3" filter="url(#b2)"/>'
              f'<path d="{df}" fill="none" stroke="{k["rojL"]}" stroke-width="2.3" '
              f'stroke-linecap="round"/>'
              f'<path d="M{mx:.1f} {my:.1f} V{CLIM}" stroke="{k["rojL"]}" stroke-width="1.2" '
              f'stroke-dasharray="2.5 2.5" opacity=".8"/>'
              f'<circle cx="{mx:.1f}" cy="{my:.1f}" r="6.5" fill="{k["rojL"]}" opacity=".35" '
              f'filter="url(#b2)"/>'
              f'<circle cx="{mx:.1f}" cy="{my:.1f}" r="2.9" fill="{k["rojLL"]}"/>'
              + _txt(mx + 8, my + 2, '9.8', 11.5, k['rojLL'], .95, 'start', '700', .4))
    hx, hy = p[-1]
    s += (f'<circle cx="{hx:.1f}" cy="{hy:.1f}" r="7" fill="{k["oroL"]}" opacity=".35" '
          f'filter="url(#b2)"/>'
          f'<circle cx="{hx:.1f}" cy="{hy:.1f}" r="2.8" fill="#fff8e2"/>')
    return s


# ── el grafo, dentro de la pantalla ─────────────────────────────────────────
def _grafo():
    # visor de resultado, encajado en el lienzo
    VX, VY, VW, VH = 344, 88, 194, 170
    IX, IY, IW, IH = 351, 95, 180, 156
    visor = (
        f'<rect x="{VX + 4}" y="{VY + 7}" width="{VW}" height="{VH}" rx="8" fill="#030a12" '
        f'opacity=".45" filter="url(#b5)"/>'
        f'<rect x="{VX}" y="{VY}" width="{VW}" height="{VH}" rx="7" fill="url(#pg_visor)"/>'
        f'<rect x="{VX - 8}" y="190" width="14" height="14" rx="3" fill="url(#pg_visor)"/>'
        f'<path d="M{VX + 8} {VY + 1.3} h{VW - 16}" stroke="#dfeaf3" stroke-width="1.8" '
        f'stroke-linecap="round" opacity=".6"/>'
        f'<rect x="{IX}" y="{IY}" width="{IW}" height="{IH}" rx="3" fill="url(#pg_scr)"/>'
        f'<rect x="{IX}" y="{IY}" width="{IW}" height="16" fill="#0d2f42"/>'
        f'<rect x="{IX}" y="{IY}" width="{IW}" height="16" fill="url(#pg_hdr)" opacity=".3"/>'
        + _txt(IX + 6, IY + 11.5, 'sim', 10, '#bfe6ff', .9)
        + ''.join(f'<rect x="{IX + 30 + i * 7}" y="{IY + 5}" width="4" height="6" rx="1.2" '
                  f'fill="#5fa3c8" opacity="{.75 - i * .18}"/>' for i in range(3))
        + _carril(IX + 122, IY + 5, 52, .68, k['oroL'], k['oroLL'], 6)
        + _malla() + _curva()
        + f'<rect x="{IX}" y="{IY}" width="{IW}" height="{IH}" fill="url(#pg_scrl)"/>'
        f'<rect x="{IX}" y="{IY}" width="{IW}" height="{IH}" fill="url(#pg_vinp)"/>'
        f'<rect x="{IX}" y="{IY}" width="{IW}" height="{IH}" rx="3" fill="none" stroke="#bfe6ff" '
        f'stroke-width="1.1" opacity=".4"/>'
    )

    # módulos
    osc = (f'<g filter="url(#sombraC)">'
           + _modulo(134, 94, 70, 36, 'pg_src', k['turqS'], k['turq'], pestana=True) + '</g>'
           + f'<rect x="141" y="112" width="56" height="15" rx="3" fill="{k["noche"]}" '
           f'opacity=".42"/>'
           f'<path d="M145 120 q5-9 10 0 t10 0 t10 0 t10 0" fill="none" stroke="{k["turqLL"]}" '
           f'stroke-width="1.7" stroke-linecap="round" opacity=".95"/>')

    amt = (f'<g filter="url(#sombraC)">'
           + _modulo(134, 140, 70, 34, 'pg_par', k['violS'], k['viol'], muesca=True) + '</g>'
           + _txt(141, 169, '0.6', 15, '#fbf7ff', .97, 'start', '700', .3)
           + _carril(176, 161, 22, .6, k['violLL'], '#fff', 5))

    mix = (f'<circle cx="326" cy="90" r="20" fill="{k["rojL"]}" opacity=".14" filter="url(#b12)"/>'
           f'<g filter="url(#sombra)">'
           + _modulo(248, 90, 78, 98, 'pg_hub', '#1c242d', k['azul']) + '</g>'
           + _txt(256, 101.5, 'mix', 10.5)
           + _carril(256, 107, 62, .62, k['turqLL'], '#fff')
           + _carril(256, 129, 62, .34, k['violLL'], '#fff')
           + _carril(256, 151, 62, 0, '', '', punteado=True)
           + _carril(256, 173, 50, 1, k['oroLL'], '#fff', rebosa=True)
           + f'<rect x="244.5" y="86.5" width="85" height="105" rx="10" fill="none" '
           f'stroke="{k["rojL"]}" stroke-width="4" opacity=".22" filter="url(#b5)"/>'
           f'<rect x="244.5" y="86.5" width="85" height="105" rx="10" fill="none" '
           f'stroke="{k["rojLL"]}" stroke-width="1.3" opacity=".55" stroke-dasharray="10 6"/>')

    # el módulo que se está colocando: levantado del lienzo, con su sombra
    mapm = (f'<ellipse cx="190" cy="242" rx="52" ry="8" fill="#030a12" opacity=".45" '
            f'filter="url(#b12)"/>'
            f'<g transform="rotate(-4 185 215)">'
            f'<g filter="url(#sombra)">'
            + _modulo(142, 196, 86, 38, 'pg_flo', k['verdS'], k['verd'], pestana=True) + '</g>'
            + _txt(150, 227, 'x2', 15, '#f2fff0', .97, 'start', '700', .3)
            + _carril(184, 213, 36, .45, k['verdLL'], '#fff', 5)
            + _carril(184, 223, 36, .78, k['verdL'], k['verdLL'], 5)
            + _puerto(142, 215, k['verdL'], 4.6)
            + _puerto(228, 215, k['verdLL'], 4.6)
            + '</g>')

    cables = (_cable('M204 112 C220 112 232 110 248 110', k['turq'], k['turqLL'], 3.8, True, 15, 3)
              + _cable('M204 157 C222 157 230 132 248 132', k['viol'], k['violLL'], 3.8, True, 15, 9)
              + _cable('M326 110 C352 110 374 88 400 88', k['azul'], k['azulLL'], 4.2, True, 14, 2))

    medio = (_cable('M228 212 C256 222 280 220 300 210', k['verd'], k['verdLL'], 3.8, True, 14, 4)
             + f'<circle cx="300" cy="210" r="8" fill="{k["verdLL"]}" opacity=".35" '
             f'filter="url(#b5)"/>'
             f'<circle cx="300" cy="210" r="3.6" fill="#f0fff0"/>'
             f'<path d="M300 210 C312 206 320 202 330 199" fill="none" stroke="#cfeedd" '
             f'stroke-width="1.4" stroke-dasharray="2.6 5" opacity=".6"/>'
             + _fantasma(337, 197, '#b9ecd2'))

    return (
        # lienzo del editor: retícula, no color plano
        f'<rect x="{SX}" y="{SY}" width="{SW}" height="{SH}" fill="url(#pg_lienzo)"/>'
        + ''.join(f'<circle cx="{SX + 20 + i * 48}" cy="{SY + 28 + j * 40}" r="1.1" fill="#c6dcec" '
                  f'opacity=".15"/>' for i in range(9) for j in range(5))
        # barra de herramienta del editor
        + f'<rect x="{SX}" y="{SY}" width="{SW}" height="16" fill="#132635" opacity=".85"/>'
        + ''.join(f'<rect x="{SX + 8 + i * 22}" y="{SY + 5}" width="16" height="7" rx="2.5" '
                  f'fill="{c}" opacity=".7"/>'
                  for i, c in enumerate((k['turqL'], k['violL'], k['oroL'], '#7d93a6')))
        + f'<rect x="{SX + SW - 74}" y="{SY + 5}" width="64" height="7" rx="3.5" fill="#22415a"/>'
        f'<rect x="{SX + SW - 74}" y="{SY + 5}" width="40" height="7" rx="3.5" fill="{k["turqL"]}" '
        f'opacity=".75"/>'
        f'<path d="M{SX} {SY + 16.6} h{SW}" stroke="#bfe6ff" stroke-width="1" opacity=".16"/>'
        # el grafo: cables debajo, módulos encima
        + cables + visor + osc + amt + mix
        + _puerto(204, 112, k['turqL']) + _puerto(204, 157, k['violL'])
        + _puerto(248, 110, k['turqL']) + _puerto(248, 132, k['violL'])
        + _puerto_frio(248, 154)
        + _puerto(326, 110, k['azulL']) + _puerto(400, 88, k['azulL'])
        # lo que está a medias, encima de todo
        + mapm + medio
        # la pantalla emite y tiene su propio viñeteado
        + f'<rect x="{SX}" y="{SY}" width="{SW}" height="{SH}" fill="url(#pg_scrl)"/>'
        f'<rect x="{SX}" y="{SY}" width="{SW}" height="{SH}" fill="url(#pg_vinp)"/>'
    )


# ── las cosas del mundo, en la madera y en primer plano ─────────────────────
def _placa():
    """Placa con sus pines: lo que el sistema controla de verdad."""
    return (
        f'<ellipse cx="94" cy="378" rx="76" ry="11" fill="#2a1a0c" opacity=".42" '
        f'filter="url(#b12)"/>'
        f'<g transform="rotate(5 88 346)">'
        f'<g filter="url(#sombra)">'
        f'<rect x="24" y="318" width="128" height="56" rx="4" fill="#0f3a2c"/>'
        f'<rect x="24" y="318" width="128" height="52" rx="3.5" fill="url(#pg_pcb)"/></g>'
        f'<rect x="24" y="318" width="128" height="56" rx="4" filter="url(#grano)" '
        f'style="mix-blend-mode:multiply" opacity=".14"/>'
        f'<path d="M30 319.6 h116" stroke="#cdf0d8" stroke-width="1.6" stroke-linecap="round" '
        f'opacity=".45"/>'
        f'<path d="M25.6 324 v44" stroke="{CAL}" stroke-width="2" stroke-linecap="round" '
        f'opacity=".5"/>'
        # serigrafía y pistas
        f'<path d="M34 356 h30 v-14 h26 M100 330 h34 v22" fill="none" '
        f'stroke="#9fd8b4" stroke-width="1.2" opacity=".3"/>'
        f'<rect x="32" y="330" width="22" height="9" rx="1.5" fill="#c9e8d4" opacity=".22"/>'
        # chip con su bisel y sus patillas
        f'<rect x="62" y="330" width="34" height="24" rx="2.5" fill="#101820"/>'
        f'<rect x="62" y="330" width="34" height="21" rx="2.5" fill="url(#pg_chip)"/>'
        f'<path d="M64 331.6 h30" stroke="#8fa3b4" stroke-width="1.4" opacity=".6"/>'
        f'<circle cx="68" cy="336" r="2" fill="#0a1017" opacity=".8"/>'
        + ''.join(f'<rect x="{62 + 4 + i * 8}" y="354" width="4" height="4" fill="#9aa8b4"/>'
                  for i in range(4))
        # tira de pines dorados: aquí se enchufa el mundo
        + f'<rect x="104" y="356" width="44" height="12" rx="2" fill="#141b22"/>'
        + ''.join(f'<rect x="{107 + i * 7}" y="350" width="4" height="12" rx="1" '
                  f'fill="url(#pg_pin)"/>'
                  f'<rect x="{107 + i * 7}" y="350" width="1.6" height="12" fill="#ffeeb8" '
                  f'opacity=".7"/>' for i in range(6))
        + f'<circle cx="140" cy="326" r="4.4" fill="#0d2a20"/>'
        f'<circle cx="140" cy="326" r="4.4" fill="none" stroke="#d8e6dc" stroke-width="1.4" '
        f'opacity=".5"/>'
        f'<circle cx="34" cy="366" r="4.4" fill="#0d2a20"/>'
        f'<circle cx="34" cy="366" r="4.4" fill="none" stroke="#d8e6dc" stroke-width="1.4" '
        f'opacity=".5"/>'
        # diodo encendido: la placa está viva
        f'<circle cx="120" cy="334" r="5.5" fill="{k["verdL"]}" opacity=".45" filter="url(#b2)"/>'
        f'<circle cx="120" cy="334" r="2.4" fill="#e6ffe2"/>'
        f'</g>'
    )


def _cuaderno():
    """El mismo grafo, tanteado a mano antes de montarlo."""
    g = k['grafito']
    return (
        f'<ellipse cx="540" cy="382" rx="88" ry="11" fill="#2a1a0c" opacity=".38" '
        f'filter="url(#b12)"/>'
        f'<g transform="rotate(-5 534 341)">'
        f'<g filter="url(#sombra)">'
        f'<rect x="452" y="306" width="164" height="70" rx="3" fill="url(#pg_pap)"/></g>'
        f'<rect x="452" y="306" width="164" height="70" rx="3" filter="url(#fibra)" '
        f'style="mix-blend-mode:multiply" opacity=".22"/>'
        f'<path d="M452 306 h164" stroke="#fff" stroke-width="1.6" opacity=".7"/>'
        f'<path d="M466 306 v70" stroke="{k["rojL"]}" stroke-width="1" opacity=".22"/>'
        # el grafo a lápiz: tres cajas, sus hilos y una tachada
        f'<rect x="476" y="322" width="30" height="16" rx="2.5" fill="none" stroke="{g}" '
        f'stroke-width="1.7" opacity=".72"/>'
        f'<rect x="476" y="346" width="30" height="16" rx="2.5" fill="none" stroke="{g}" '
        f'stroke-width="1.7" opacity=".66"/>'
        f'<rect x="530" y="332" width="34" height="22" rx="2.5" fill="none" stroke="{g}" '
        f'stroke-width="1.9" opacity=".78"/>'
        f'<path d="M506 330 q14 0 24 6 M506 354 q14 0 24-8" fill="none" stroke="{g}" '
        f'stroke-width="1.6" opacity=".62"/>'
        f'<path d="M564 343 q16 2 22-8" fill="none" stroke="{g}" stroke-width="1.5" '
        f'stroke-dasharray="4 4" opacity=".55"/>'
        f'<path d="M530 332 l34 22 M564 332 l-34 22" stroke="{k["rojL"]}" stroke-width="1.5" '
        f'opacity=".5"/>'
        # la curva tanteada al margen
        f'<path d="M478 372 q10 0 14-12 q5-14 10 2 q4 11 8-3 q4-9 8 1 q4 7 8 0" fill="none" '
        f'stroke="{g}" stroke-width="1.6" opacity=".62"/>'
        f'</g>'
    )


def _mando():
    """Mando apoyado: el sistema se ajusta con la mano, aunque no haya manos."""
    return (
        f'<ellipse cx="356" cy="374" rx="42" ry="9" fill="#2a1a0c" opacity=".45" '
        f'filter="url(#b12)"/>'
        f'<ellipse cx="342" cy="370" rx="30" ry="9" fill="#2a1a0c" opacity=".3" '
        f'filter="url(#b5)"/>'
        f'<ellipse cx="338" cy="366" rx="34" ry="11" fill="#252d36"/>'
        f'<ellipse cx="338" cy="364" rx="34" ry="11" fill="url(#pg_base)"/>'
        f'<path d="M310 348 h56 v12 a28 11 0 0 1 -56 0z" fill="url(#pg_mando)"/>'
        f'<ellipse cx="338" cy="348" rx="28" ry="10" fill="#1b232c"/>'
        f'<ellipse cx="338" cy="346.5" rx="28" ry="10" fill="url(#pg_mandoT)"/>'
        + ''.join(f'<path d="M{338 + 26 * math.cos(a):.1f} {346.5 + 9.4 * math.sin(a):.1f} '
                  f'L{338 + 28 * math.cos(a):.1f} {347.5 + 10 * math.sin(a):.1f}" '
                  f'stroke="#0d141b" stroke-width="1.6" opacity=".62"/>'
                  for a in [i * math.pi / 9 for i in range(18)])
        + f'<ellipse cx="338" cy="345" rx="17" ry="6" fill="#39444f"/>'
        f'<ellipse cx="333" cy="343.5" rx="11" ry="3.4" fill="#6d7b88" opacity=".55"/>'
        f'<path d="M338 345 l-14 -4.6" stroke="{k["oroLL"]}" stroke-width="2.4" '
        f'stroke-linecap="round"/>'
        f'<path d="M312 340 a28 10 0 0 1 22 -7" fill="none" stroke="{CAL}" stroke-width="2" '
        f'stroke-linecap="round" opacity=".5"/>'
    )


def escena():
    d = (
        # ── el sitio
        lg('pg_pared', .08, 0, .85, 1, [(0, '#f4e2c2', None), (.35, '#dcc3a2', None),
                                        (.72, '#b79b80', None), (1, '#8f7865', None)])
        + rg('pg_luz', .07, .0, .95, [(0, '#fff3d6', .75), (.36, '#ffe3b0', .3),
                                      (1, '#ffe3b0', 0)])
        + lg('pg_mesa', 0, 0, 0, 1, [(0, k['madL'], None), (.22, k['mad'], None),
                                     (1, k['madS'], None)])
        # ── el panel
        + lg('pg_marco', .12, 0, .88, 1, [(0, '#a8998a', None), (.22, '#7b6f65', None),
                                          (.62, '#4e4842', None), (1, '#2b2823', None)])
        + lg('pg_pie', 0, 0, 0, 1, [(0, '#8c98a2', None), (.3, '#4e5862', None),
                                    (1, '#262d35', None)])
        + lg('pg_lienzo', .1, 0, .8, 1, [(0, '#16212c', None), (.45, '#1d2833', None),
                                         (1, '#2b3743', None)])
        + lg('pg_visor', .12, 0, .88, 1, [(0, '#7e8b96', None), (.3, '#4d5860', None),
                                          (1, '#262d35', None)])
        + lg('pg_scr', 0, 0, .4, 1, [(0, '#07202e', None), (.5, '#0a2a3c', None),
                                     (1, '#0d3a4c', None)])
        + lg('pg_scrl', .05, 0, .95, 1, [(0, '#ffffff', .14), (.3, '#ffffff', .04),
                                         (.32, '#ffffff', 0), (1, '#ffffff', 0)])
        + lg('pg_hdr', 0, 0, 0, 1, [(0, '#ffffff', .34), (1, '#ffffff', .02)])
        + lg('pg_area', 0, 0, 0, 1, [(0, k['oroL'], .3), (1, k['oroL'], 0)])
        # ── módulos
        + lg('pg_src', .15, 0, .85, 1, [(0, k['turqL'], None), (.45, k['turq'], None),
                                        (1, k['turqS'], None)])
        + lg('pg_par', .15, 0, .85, 1, [(0, k['violL'], None), (.45, k['viol'], None),
                                        (1, k['violS'], None)])
        + lg('pg_hub', .15, 0, .85, 1, [(0, '#7f8f9e', None), (.42, '#4d5b69', None),
                                        (1, '#28323d', None)])
        + lg('pg_flo', .15, 0, .85, 1, [(0, k['verdL'], None), (.45, k['verd'], None),
                                        (1, k['verdS'], None)])
        # ── cosas del mundo
        + lg('pg_pcb', .1, 0, .9, 1, [(0, '#3f8a68', None), (.35, '#24664c', None),
                                      (1, '#123c2d', None)])
        + lg('pg_chip', .1, 0, .9, 1, [(0, '#5a6874', None), (.4, '#313b45', None),
                                       (1, '#171d24', None)])
        + lg('pg_pin', 0, 0, 1, 0, [(0, k['oroS'], None), (.4, k['oroL'], None),
                                    (1, k['oro'], None)])
        + lg('pg_pap', .15, 0, .9, 1, [(0, k['papL'], None), (.55, k['pap'], None),
                                       (1, k['papS'], None)])
        + lg('pg_mando', 0, 0, 1, 0, [(0, '#242c35', None), (.3, '#4e5a66', None),
                                      (.62, '#2c3540', None), (1, '#161c23', None)])
        + lg('pg_mandoT', .2, 0, .9, 1, [(0, '#6e7d8a', None), (.45, '#414c57', None),
                                         (1, '#232a32', None)])
        + lg('pg_base', 0, 0, 1, 0, [(0, '#39434e', None), (.35, '#5e6a76', None),
                                     (1, '#22292f', None)])
    )

    panel = (
        f'<g transform="{GIRO}">'
        # se apoya en la madera por su canto, sobre dos pies: no lleva pedestal
        f'<rect x="{FX0 + 36}" y="{FY0 + FH0 - 2}" width="56" height="13" rx="4" '
        f'fill="url(#pg_pie)"/>'
        f'<rect x="{FX0 + FW0 - 92}" y="{FY0 + FH0 - 2}" width="56" height="13" rx="4" '
        f'fill="url(#pg_pie)"/>'
        f'<rect x="{FX0 + 16}" y="{FY0 + FH0 - 6}" width="{FW0 - 32}" height="9" rx="3.5" '
        f'fill="#241f1a"/>'
        f'<path d="M{FX0 + 22} {FY0 + FH0 - 4.6} h{FW0 - 44}" stroke="{CAL}" stroke-width="1.4" '
        f'opacity=".35"/>'
        # marco con canto
        f'<rect x="{FX0}" y="{FY0}" width="{FW0}" height="{FH0}" rx="12" fill="url(#pg_marco)"/>'
        f'<path d="M{FX0 + 13} {FY0 + 1.4} h{FW0 - 26}" stroke="#ffe9c6" stroke-width="2" '
        f'stroke-linecap="round" opacity=".85"/>'
        f'<path d="M{FX0 + 13} {FY0 + 3.6} h{FW0 - 26}" stroke="#2b2823" stroke-width="1.2" '
        f'stroke-linecap="round" opacity=".35"/>'
        f'<path d="M{FX0 + 1.8} {FY0 + 14} v{FH0 - 28}" stroke="{CAL}" stroke-width="3" '
        f'stroke-linecap="round" opacity=".6"/>'
        f'<path d="M{FX0 + 13} {FY0 + FH0 - 1.8} h{FW0 - 26}" stroke="{k["noche"]}" '
        f'stroke-width="3" stroke-linecap="round" opacity=".5"/>'
        f'<rect x="{FX0}" y="{FY0}" width="{FW0}" height="{FH0}" rx="12" filter="url(#grano)" '
        f'style="mix-blend-mode:multiply" opacity=".12"/>'
        f'<g clip-path="url(#pg_clip)">{_grafo()}</g>'
        f'<rect x="{SX}" y="{SY}" width="{SW}" height="{SH}" rx="3" fill="none" stroke="#bfe6ff" '
        f'stroke-width="1.3" opacity=".4"/>'
        f'<rect x="{SX - 3}" y="{SY - 3}" width="{SW + 6}" height="{SH + 6}" rx="6" fill="none" '
        f'stroke="#a8ddf7" stroke-width="8" opacity=".16" filter="url(#b5)"/>'
        # conector de la placa en el canto inferior del panel
        f'<rect x="216" y="{FY0 + FH0 - 14}" width="34" height="13" rx="3" fill="#1d242c"/>'
        f'<rect x="216" y="{FY0 + FH0 - 14}" width="34" height="4" rx="2" fill="#7e8b96" '
        f'opacity=".5"/>'
        f'<circle cx="256" cy="{FY0 + FH0 - 8}" r="3.4" fill="#7ce8c4" opacity=".4" '
        f'filter="url(#b2)"/>'
        f'<circle cx="256" cy="{FY0 + FH0 - 8}" r="1.6" fill="#d9fff0"/>'
        f'</g>'
    )

    return svg(
        # ═══ plano 1: la pared del taller, cálida y fuera de foco
        f'<rect width="{W}" height="{H}" fill="url(#pg_pared)"/>'
        f'<rect width="{W}" height="{H}" fill="url(#pg_luz)"/>'
        f'<path d="M-40 -20 L292 -20 L150 320 L-40 236z" fill="#fff1d4" opacity=".4" '
        f'filter="url(#b22)"/>'
        f'<path d="M-40 -20 L168 -20 L74 300 L-40 250z" fill="#fffaec" opacity=".34" '
        f'filter="url(#b22)"/>'
        # rollo de cable colgado y esquina de la habitación: fondo sin contraste
        f'<g filter="url(#b12)" opacity=".55">'
        f'<circle cx="50" cy="126" r="40" fill="none" stroke="#5a4633" stroke-width="18"/>'
        f'<circle cx="50" cy="126" r="40" fill="none" stroke="#9b8060" stroke-width="7"/>'
        f'<path d="M50 78 v-42" stroke="#6b5640" stroke-width="5"/>'
        f'<rect x="20" y="28" width="62" height="9" rx="4" fill="#7a6247"/></g>'
        f'<g filter="url(#b12)" opacity=".55">'
        f'<rect x="604" y="0" width="60" height="{MESA}" fill="#6d5a4a" opacity=".7"/>'
        f'<rect x="572" y="188" width="76" height="12" rx="4" fill="#a48a68"/>'
        f'<rect x="596" y="150" width="30" height="38" rx="4" fill="#8a725a"/>'
        f'<rect x="630" y="160" width="22" height="28" rx="3" fill="#7a6247"/></g>'
        # ═══ plano 2: el banco de madera
        + f'<rect x="0" y="{MESA}" width="{W}" height="{H - MESA}" fill="url(#pg_mesa)"/>'
        f'<rect x="0" y="{MESA}" width="{W}" height="{H - MESA}" filter="url(#veta)" '
        f'style="mix-blend-mode:multiply" opacity=".32"/>'
        f'<path d="M0 330 q180-12 340 4 q150 14 300 0 M0 372 q210 12 372-8 q140-14 268 4" '
        f'fill="none" stroke="{k["madS"]}" stroke-width="2.2" opacity=".28"/>'
        f'<rect x="0" y="{MESA}" width="{W}" height="3.5" fill="{k["madLL"]}" opacity=".8"/>'
        f'<rect x="0" y="{MESA + 3.5}" width="{W}" height="13" fill="{k["noche"]}" opacity=".13"/>'
        f'<ellipse cx="70" cy="340" rx="200" ry="66" fill="#ffd9a0" opacity=".34" '
        f'filter="url(#b22)"/>'
        f'<ellipse cx="452" cy="318" rx="200" ry="48" fill="#79c8f0" opacity=".2" '
        f'filter="url(#b22)"/>'
        # sombra del panel sobre la madera y sobre la pared
        + f'<path d="M136 290 h394 l80 40 h-442z" fill="#301d0c" opacity=".38" '
        f'filter="url(#b12)"/>'
        f'<ellipse cx="338" cy="297" rx="200" ry="13" fill="#2a1a0c" opacity=".5" '
        f'filter="url(#b5)"/>'
        f'<path d="M122 62 h432 v206 h-432z" fill="#3a2716" opacity=".22" filter="url(#b22)" '
        f'transform="translate(18 14)"/>'
        # ═══ el panel, apoyado
        + panel
        # ═══ plano 3: las cosas del mundo, nítidas y cálidas
        + _placa()
        # el cable real de la placa al panel: sale de los pines y se enchufa
        + _cable('M148 328 C184 330 214 312 240 288', '#7a5a3a', '#e0b788', 5.2, False)
        + '<path d="M232 292 l16 -13 l7 9 l-16 13z" fill="#2f3a45"/>'
        '<path d="M234 290 l15 -12" stroke="#b9c8d6" stroke-width="2" opacity=".6"/>'
        + _cuaderno() + _mando()
        # ═══ grano y viñeteado
        + f'<rect width="{W}" height="{H}" filter="url(#grano)" style="mix-blend-mode:overlay" '
        f'opacity=".09"/>'
        f'<rect width="{W}" height="{H}" fill="url(#pg_vin)"/>',
        d
        + f'<clipPath id="pg_clip"><rect x="{SX}" y="{SY}" width="{SW}" height="{SH}" rx="3"/></clipPath>'
        + rg('pg_vinp', .5, .42, .8, [(.5, '#000', 0), (1, '#02101c', .4)])
        + rg('pg_vin', .5, .46, .8, [(.52, '#000', 0), (1, '#1d1206', .32)]))
