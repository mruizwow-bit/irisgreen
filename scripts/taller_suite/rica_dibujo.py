# -*- coding: utf-8 -*-
"""Escena rica de Dibujo (R54 R2 · acabado NORMA_SEP2026).

No se enseña el dibujo terminado: se enseña **la mesa donde se dibuja**, con la
lámina a medio construir y el objeto real delante. El concepto no cambia; lo que
sube es la materia.

Lo que cuenta la escena, de atrás a adelante:

* la ventana desenfocada, que es de donde entra la luz —una sola dirección,
  arriba a la izquierda—; la pared es yeso: moteado, manchas de tono no lineales
  y el canto del alféizar con grosor y su sombra;
* la mesa de taller: veta en dos escalas, juntas de tablas, nudos, brillo
  especular que sigue la fibra y marcas de uso;
* el tablero de dibujo con sus pinzas metálicas mordiendo la lámina;
* la lámina es **papel**: grano grueso, fibra con dirección, la ondulación del
  pliego con su luz y su sombra, el borde recortado con grosor, irregularidades
  y una esquina levantada;
* sobre la lámina, un estudio de la jarra **en construcción**: eje, caja,
  elipses de perspectiva, línea de horizonte y el asa ya empezada en firme, todo
  con grano de grafito; encima, el trazo definitivo con presión variable, grueso
  donde apoya y fino al salir;
* el sombreado empezado: tramado con separación real, densidad creciente y
  grumo de grafito; la cara de luz sigue en blanco;
* las correcciones a la vista, la escala de valores, el apunte pequeño, el lápiz
  y la goma, cada uno con su sombra de contacto;
* y a la derecha, **la jarra de verdad** sobre la mesa, cerámica vidriada con el
  reflejo de la ventana, rebote cálido de la madera y oclusión bajo la base.

Nada de personajes. Nada de mascotas. Nada con cara.
"""
import math

from taller_suite.escenas_ricas import C, W, H, svg, lg, rg, sombra_suelo

k = C

MESA = 168               # línea donde la pared se encuentra con la mesa

# ── el estudio dibujado sobre el papel ──────────────────────────────────
# Misma jarra que la real, a escala 1.15, para que se lea que es el mismo objeto.
AX = 186
RIM_Y, RIM_RX, RIM_RY = 206, 25, 8.5     # boca
BEL_Y, BEL_RX, BEL_RY = 289, 51, 16      # panza
BAS_Y, BAS_RX, BAS_RY = 337, 32, 11      # base
CAJA = (AX - BEL_RX - 6, RIM_Y - 12, AX + BEL_RX + 6, BAS_Y + 13)

SIL = ('M161 206 C156 229 135 252 135 289 C135 314 142 331 154 337 '
       'Q186 349 218 337 C230 331 237 314 237 289 C237 252 216 229 211 206 Z')

# contorno definitivo, partido en tres tramos para poder variar la presión:
# entra fino, apoya en la curva baja y sale afinando.
FIRME_A = 'M161 206 C156 229 135 252 135 289'
FIRME_B = 'M135 289 C135 314 142 331 154 337'
FIRME_C = 'M154 337 Q170 343 196 344'

# ── la lámina: el borde no es recto, el pliego ondula ───────────────────
LAMINA = ('M66 196 C146 192.6 306 187.2 386 185 '
          'C393.2 246 401 307 408 368 '
          'C298 372.4 152 366.6 46 360 '
          'C53 305 60 250.4 66 196 Z')

# ── la jarra de verdad, sobre la mesa ───────────────────────────────────
JX, JRIM, JBASE = 500, 190, 302
JARRA = (f'M{JX - 22} {JRIM} C{JX - 26} {JRIM + 20} {JX - 44} {JRIM + 40} {JX - 44} {JRIM + 68} '
         f'C{JX - 44} {JRIM + 90} {JX - 38} {JRIM + 105} {JX - 28} {JBASE - 1} '
         f'Q{JX} {JBASE + 11} {JX + 28} {JBASE - 1} '
         f'C{JX + 38} {JRIM + 105} {JX + 44} {JRIM + 90} {JX + 44} {JRIM + 68} '
         f'C{JX + 44} {JRIM + 40} {JX + 26} {JRIM + 20} {JX + 22} {JRIM} Z')


def _n(i, s=1.0):
    """Ruido determinista en [0,1). Sirve para que nada quede clonado."""
    v = math.sin(i * 12.9898 + s * 78.233) * 43758.5453
    return round(v - math.floor(v), 4)


def _tramado(n, x0, paso, y0, dx, dy, col, w, o0, o1, s=1.0):
    """Trazos de grafito: densidad creciente, y ninguno igual a otro.

    Cada trazo lleva su propio desplazamiento, su largo, su grosor y su
    opacidad; la `stroke-dasharray` corta el trazo de forma irregular, que es lo
    que hace el grano del papel bajo la mina.
    """
    out = []
    for i in range(n):
        t = i / max(n - 1, 1)
        a, b = _n(i, s), _n(i, s + 7.3)
        ex, ey = dx * (.86 + b * .28), dy * (.86 + a * .28)
        # la mano no traza recto: el trazo se arquea, y cada uno a su manera
        arco = (a - .45) * 7 + 2.5
        out.append(
            '<path d="M%s %s q%s %s %s %s" fill="none" stroke="%s" stroke-width="%s" '
            'stroke-linecap="round" stroke-dasharray="%s %s" opacity="%s"/>'
            % (round(x0 + i * paso + (a - .5) * paso * .42, 1),
               round(y0 + (b - .5) * 3.4, 1),
               round(ex * .5 + arco, 1), round(ey * .5 - arco * .55, 1),
               round(ex, 1), round(ey, 1),
               col, round(w * (.68 + a * .7), 2),
               round(6 + b * 11, 1), round(.45 + a * 1.35, 2),
               round((o0 + (o1 - o0) * t) * (.76 + b * .46), 3)))
    return ''.join(out)


def _lapiz(d, col, w, op, s=1.0, dash=True):
    """Una línea de construcción: mina irregular, no un stroke vectorial."""
    da = (' stroke-dasharray="%s %s"' % (round(7 + _n(s, 3.1) * 14, 1),
                                         round(.5 + _n(s, 5.7) * 1.4, 2))) if dash else ''
    return (f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{round(w * 1.7, 2)}" '
            f'opacity="{round(op * .32, 3)}" filter="url(#b2)"/>'
            f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{w}"{da} '
            f'stroke-linecap="round" opacity="{op}"/>')


def _construccion():
    """Ejes, caja, elipses de perspectiva, horizonte y asa: todo en trazo claro."""
    g = k['grafito']
    x1, y1, x2, y2 = CAJA
    p = [
        # línea de horizonte (altura de los ojos) cruzando toda la lámina
        _lapiz(f'M64 {RIM_Y - 3} H386', g, 1.1, .26, 1.2),
        _lapiz(f'M96 {RIM_Y - 8} v10 M340 {RIM_Y - 8} v10', g, 1.1, .3, 2.4, False),
        # caja envolvente y diagonales
        _lapiz(f'M{x1} {y1} H{x2} V{y2} H{x1} Z', g, 1.3, .34, 3.1),
        _lapiz(f'M{x1} {y1} L{x2} {y2} M{x2} {y1} L{x1} {y2}', g, 1, .2, 4.6),
        # eje de simetría, pasado por arriba y por abajo
        _lapiz(f'M{AX} {y1 - 12} V{y2 + 8}', g, 1.4, .44, 5.5),
        # el asa, ya nacida del cuerpo: la curva de fuera resuelta en firme y la
        # de dentro todavía tanteada. Es lo que dice «jarra» y no «botella».
        f'<path d="M212 223 C248 226 256 256 238 283" fill="none" stroke="{k["tinta"]}" '
        f'stroke-width="4.4" stroke-linecap="round" opacity=".18" filter="url(#b2)"/>',
        f'<path d="M212 223 C248 226 256 256 238 283" fill="none" stroke="{k["tinta"]}" '
        f'stroke-width="2.6" stroke-linecap="round" opacity=".82"/>',
        _lapiz('M214 235 C240 240 245 260 232 276', g, 1.6, .38, 6.2),
        _lapiz('M216 220 C252 224 262 258 242 288', g, 1.3, .22, 7.4),
        # arranque del asa sobre la panza: un trazo corto y seguro
        f'<path d="M230 281 q8 3 12 8" fill="none" stroke="{k["tinta"]}" stroke-width="2.2" '
        f'stroke-linecap="round" opacity=".6"/>',
    ]
    # elipses de perspectiva completas, también la mitad de atrás
    for i, (cy, rx, ry, op) in enumerate(
            ((RIM_Y, RIM_RX, RIM_RY, .46), (BEL_Y, BEL_RX, BEL_RY, .32),
             (BAS_Y, BAS_RX, BAS_RY, .38))):
        p.append(f'<ellipse cx="{AX}" cy="{cy}" rx="{rx}" ry="{ry}" fill="none" '
                 f'stroke="{g}" stroke-width="1.3" stroke-dasharray="{11 + i * 4} '
                 f'{round(.6 + _n(i, 9.1), 2)}" opacity="{op}"/>')
        p.append(_lapiz(f'M{AX - rx - 10} {cy} H{AX + rx + 10}', g, 1, .24, 8.3 + i))
    return ''.join(p)


def _apunte():
    """Apunte de valores pequeno: la misma jarra resuelta en tres manchas."""
    g = k['grafito']
    mini = ('M316 250 C314 257 307 263 307 271 C307 276 310 279 314 281 '
            'Q322 284 330 281 C334 279 337 276 337 271 C337 263 330 257 328 250 Z')
    return (f'<rect x="298" y="238" width="76" height="56" fill="none" stroke="{g}" '
            f'stroke-width="1.2" stroke-dasharray="14 1" opacity=".42"/>'
            + _lapiz('M298 281 H374', g, 1, .28, 11.2)
            + _tramado(8, 300, 4.6, 278, 12, -20, g, 1.4, .28, .09, 12.5)
            + f'<path d="{mini}" fill="{g}" opacity=".1"/>'
            f'<path d="{mini}" fill="none" stroke="{g}" stroke-width="1.2" opacity=".58"/>'
            f'<path d="M322 250 C326 258 337 263 337 271 C337 277 330 284 322 284z" '
            f'fill="{g}" opacity=".22"/>'
            f'<ellipse cx="346" cy="283" rx="16" ry="3.4" fill="{g}" opacity=".3" '
            f'filter="url(#b2)"/>'
            + _tramado(6, 340, 4.2, 290, 10, -16, g, 1.3, .24, .07, 13.7))


def _vetas():
    """Veta larga de la mesa: líneas que corren, se abren y no se repiten."""
    out = []
    for i in range(13):
        a, b, c = _n(i, 21.1), _n(i, 22.7), _n(i, 23.9)
        y = round(182 + i * 17 + (a - .5) * 9, 1)
        col = k['madS'] if b > .42 else k['madLL']
        out.append('<path d="M%s %s C%s %s %s %s %s %s" fill="none" stroke="%s" '
                   'stroke-width="%s" opacity="%s"/>'
                   % (round(-20 + a * 40, 1), y,
                      round(120 + b * 90, 1), round(y - 3 - c * 5, 1),
                      round(380 + c * 100, 1), round(y + 2 + a * 6, 1),
                      660, round(y - 2 + b * 7, 1),
                      col, round(.8 + c * 1.5, 2), round(.07 + b * .11, 3)))
    # nudos: la fibra los rodea, y responden distinto a la luz
    for cx, cy, r in ((556, 356, 9), (118, 386, 7), (612, 232, 5.5)):
        out.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{r * 1.9}" ry="{r}" '
                   f'fill="{k["madS"]}" opacity=".3" filter="url(#b5)"/>')
        for j in range(3):
            out.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{round(r * (1.5 - j * .42), 1)}" '
                       f'ry="{round(r * (.78 - j * .22), 1)}" fill="none" '
                       f'stroke="{k["madS"]}" stroke-width="1.1" opacity="{.3 + j * .12}"/>')
        out.append(f'<ellipse cx="{cx - r * .4}" cy="{cy - r * .3}" rx="{round(r * .5, 1)}" '
                   f'ry="{round(r * .26, 1)}" fill="{k["madLL"]}" opacity=".3"/>')
    return ''.join(out)


def _uso():
    """Marcas de uso de una mesa de taller: arañazos, cortes y un cerco."""
    out = [f'<ellipse cx="596" cy="336" rx="23" ry="7" fill="none" stroke="{k["madS"]}" '
           f'stroke-width="2.2" opacity=".17"/>',
           f'<ellipse cx="596" cy="336" rx="23" ry="7" fill="{k["madS"]}" opacity=".05"/>']
    for i in range(14):
        a, b, c = _n(i, 31.3), _n(i, 33.7), _n(i, 37.1)
        x = round(24 + a * 600, 1)
        y = round(184 + b * 208, 1)
        ln = round(6 + c * 26, 1)
        out.append('<path d="M%s %s l%s %s" stroke="%s" stroke-width="%s" '
                   'stroke-linecap="round" opacity="%s"/>'
                   % (x, y, ln, round((a - .5) * 5, 1),
                      k['madLL'] if c > .5 else k['madS'],
                      round(.7 + a * .9, 2), round(.1 + b * .17, 3)))
    for i in range(7):
        a, b = _n(i, 41.9), _n(i, 43.3)
        out.append('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="%s" opacity="%s"/>'
                   % (round(30 + a * 590, 1), round(190 + b * 200, 1),
                      round(1.4 + b * 3, 1), round(.9 + a * 1.6, 1),
                      k['madS'], round(.12 + a * .16, 3)))
    return ''.join(out)


def _pinza(x, y, h, yp):
    """Pinza metálica que **muerde** el papel: mordaza, oclusión y abolladura."""
    return (
        # el papel se abomba justo delante de la mordaza, y solo ahí
        f'<path d="M{x + 2} {yp + 1} q21 5 42 0 l0 5 q-21 5-42 0z" fill="#fff" '
        f'opacity=".26" filter="url(#b2)"/>'
        f'<g filter="url(#sombraC)">'
        f'<rect x="{x}" y="{y}" width="46" height="{h}" rx="3" fill="url(#djmet)"/>'
        f'<rect x="{x}" y="{y}" width="46" height="3" rx="1.5" fill="#fff" opacity=".75"/>'
        f'<rect x="{x + 5}" y="{y + 3}" width="4" height="{h - 8}" fill="#fff" opacity=".3"/>'
        f'<rect x="{x + 26}" y="{y + 4}" width="3.4" height="{h - 9}" fill="{k["noche"]}" opacity=".26"/>'
        f'<rect x="{x + 15}" y="{y + 4}" width="2" height="{h - 9}" fill="#fff" opacity=".16"/>'
        # marcas de uso del metal: dos rayas y una mella
        f'<path d="M{x + 33} {y + 5} v{h - 11}" stroke="{k["noche"]}" stroke-width=".9" opacity=".2"/>'
        f'<path d="M{x + 11} {y + 6} v{h - 13}" stroke="{k["noche"]}" stroke-width=".7" opacity=".14"/>'
        # la mordaza, que es la que baja a apretar la lámina
        f'<rect x="{x - 2}" y="{y + h - 7}" width="50" height="7" rx="2" fill="#6f7e8d"/>'
        f'<rect x="{x - 2}" y="{y + h - 7}" width="50" height="2" fill="#dbe4ec" opacity=".8"/>'
        f'<rect x="{x - 2}" y="{y + h - 2.4}" width="50" height="2.4" fill="{k["noche"]}" opacity=".35"/>'
        f'</g>'
        # oclusión en el punto de contacto: corta, estrecha y muy oscura
        f'<path d="M{x - 2} {yp - 1} h50 l-4 5.4 h-43z" fill="{k["noche"]}" opacity=".55" '
        f'filter="url(#b2)"/>'
        f'<path d="M{x + 1} {yp + 4} h44" stroke="{k["noche"]}" stroke-width="5" opacity=".16" '
        f'filter="url(#b5)"/>')


def escena():
    d = (
        lg('djpared', .05, 0, 1, 1, [(0, '#f4f7fa', None), (.35, '#e2e9f1', None),
                                     (.72, '#cbd6e2', None), (1, '#adbccd', None)])
        + rg('djglow', .2, .14, .68, [(0, '#fff8e2', .95), (.42, '#fff0c9', .38), (1, '#fff0c9', 0)])
        + rg('djmancha', .5, .5, .5, [(0, '#8fa6bb', .17), (1, '#8fa6bb', 0)])
        + lg('djcaida', 0, 0, 1, 0, [(0, '#0d1b2a', 0), (.5, '#0d1b2a', .07), (1, '#0d1b2a', .16)])
        + lg('djesq', 0, 0, 1, 0, [(0, '#0d1b2a', 0), (.16, '#0d1b2a', .1),
                                   (.55, '#0d1b2a', .2), (1, '#0d1b2a', .3)])
        + lg('djcris', .1, 0, .9, 1, [(0, '#f6fbff', None), (.5, '#cfe7f7', None), (1, '#a2c8e2', None)])
        + lg('djmesa', 0, 0, 0, 1, [(0, k['madL'], None), (.3, k['mad'], None), (1, k['madS'], None)])
        + lg('djmluz', 0, 0, 1, .4, [(0, '#fff3d4', .55), (.3, '#fff3d4', .2),
                                     (.7, '#0d1b2a', .06), (1, '#0d1b2a', .2)])
        + lg('djtab', .1, 0, .9, 1, [(0, k['mad'], None), (.5, k['madS'], None), (1, '#4e3417', None)])
        + lg('djpap', .1, 0, 1, .92, [(0, '#fffefb', None), (.3, k['papL'], None),
                                      (.62, k['pap'], None), (.86, k['papS'], None),
                                      (1, '#c9c2b1', None)])
        + lg('djmet', 0, 0, 1, 1, [(0, '#f4f8fb', None), (.3, '#9fadbb', None),
                                   (.58, '#e8eff5', None), (1, '#6f7e8d', None)])
        + rg('djjar', .32, .22, .88, [(0, k['azulLL'], None), (.34, k['azulL'], None),
                                      (.72, k['azul'], None), (1, k['azulS'], None)])
        + lg('djglaz', 0, 0, 1, .7, [(0, '#fff', 0), (.3, '#fff', .34), (.42, '#fff', 0),
                                     (.82, '#fff', .16), (1, '#fff', 0)])
        + lg('djbote', 0, 0, 1, 0, [(0, '#232e3a', None), (.3, '#465869', None),
                                    (.68, '#5f7488', None), (1, '#1f2833', None)])
        + lg('djlap', 0, 0, 0, 1, [(0, '#5a6b7c', None), (.35, k['grafito'], None), (1, '#16202c', None)])
        + lg('djgoma', 0, 0, .4, 1, [(0, k['papL'], None), (.5, '#e9e4d8', None), (1, '#c2bcac', None)])
        + lg('djhoja', .1, 0, .9, 1, [(0, k['madLL'], None), (.5, k['madL'], None), (1, k['madS'], None)])
        # ── texturas propias de esta escena ─────────────────────────────
        # yeso de la pared: manchón grande y desigual
        + '<filter id="djyeso" x="0" y="0" width="100%" height="100%">'
        '<feTurbulence type="fractalNoise" baseFrequency=".035 .05" numOctaves="5" seed="7"/>'
        '<feColorMatrix type="saturate" values="0"/><feComponentTransfer>'
        '<feFuncA type="linear" slope=".62" intercept="-.26"/></feComponentTransfer></filter>'
        # polvillo del yeso: el grano fino encima del manchón
        '<filter id="djpolvo" x="0" y="0" width="100%" height="100%">'
        '<feTurbulence type="fractalNoise" baseFrequency=".78" numOctaves="2" seed="3"/>'
        '<feColorMatrix type="saturate" values="0"/><feComponentTransfer>'
        '<feFuncA type="linear" slope=".38" intercept="-.19"/></feComponentTransfer></filter>'
        # grano grueso del papel de dibujo
        '<filter id="djpapg" x="0" y="0" width="100%" height="100%">'
        '<feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="3" seed="11"/>'
        '<feColorMatrix type="saturate" values="0"/><feComponentTransfer>'
        '<feFuncA type="linear" slope=".5" intercept="-.21"/></feComponentTransfer></filter>'
        # fibra del papel, con dirección
        '<filter id="djpapf" x="0" y="0" width="100%" height="100%">'
        '<feTurbulence type="fractalNoise" baseFrequency=".028 .9" numOctaves="3" seed="5"/>'
        '<feColorMatrix type="saturate" values="0"/><feComponentTransfer>'
        '<feFuncA type="linear" slope=".3" intercept="-.12"/></feComponentTransfer></filter>'
        # segunda veta de la madera, a otra escala: rompe la uniformidad
        '<filter id="djveta2" x="0" y="0" width="100%" height="100%">'
        '<feTurbulence type="fractalNoise" baseFrequency=".0032 .42" numOctaves="4" seed="9"/>'
        '<feColorMatrix type="saturate" values="0"/><feComponentTransfer>'
        '<feFuncA type="linear" slope=".5" intercept="-.24"/></feComponentTransfer></filter>'
        # grumo del grafito dentro de la mancha sombreada
        '<filter id="djgraf" x="0" y="0" width="100%" height="100%">'
        '<feTurbulence type="fractalNoise" baseFrequency=".46" numOctaves="3" seed="2"/>'
        '<feColorMatrix type="saturate" values="0"/><feComponentTransfer>'
        '<feFuncA type="linear" slope=".62" intercept="-.33"/></feComponentTransfer></filter>'
        + f'<clipPath id="djclip"><path d="{SIL}"/></clipPath>'
        + '<clipPath id="djclip2"><ellipse cx="250" cy="346" rx="62" ry="13"/></clipPath>'
        + f'<clipPath id="djclipj"><path d="{JARRA}"/></clipPath>'
        + f'<clipPath id="djclipl"><path d="{LAMINA}"/></clipPath>'
        + f'<clipPath id="djclipm"><rect x="0" y="{MESA}" width="{W}" height="{H - MESA}"/></clipPath>'
        + '<clipPath id="djclipc"><path d="M420 292 L442 282 L464 292 L464 314 L442 324 '
          'L420 314 Z"/></clipPath>'
    )

    cuerpo = (
        # ── pared de yeso: fondo, pero fondo con materia ────────────────
        f'<rect width="{W}" height="{H}" fill="url(#djpared)"/>'
        # variación de tono no lineal: manchones de yeso mal igualado, no un degradado
        f'<path d="M300 0 C420 22 560 8 640 40 L640 96 C520 118 380 86 268 104 '
        f'C180 118 70 96 0 112 L0 46 C110 26 210 -16 300 0 Z" fill="#8fa6bb" '
        f'opacity=".075" filter="url(#b22)"/>'
        f'<path d="M0 118 C130 104 250 136 392 122 C500 112 580 132 640 120 L640 {MESA} '
        f'L0 {MESA} Z" fill="#8fa6bb" opacity=".06" filter="url(#b22)"/>'
        f'<ellipse cx="508" cy="52" rx="120" ry="58" fill="url(#djmancha)"/>'
        f'<rect width="{W}" height="{MESA + 4}" filter="url(#djyeso)" '
        f'style="mix-blend-mode:multiply" opacity=".6"/>'
        f'<rect width="{W}" height="{MESA + 4}" filter="url(#djpolvo)" '
        f'style="mix-blend-mode:multiply" opacity=".26"/>'
        # marcas de llana: el yeso se extendió a mano y se nota en la luz rasante
        f'<path d="M300 8 C420 30 520 16 640 44" fill="none" stroke="#fff" '
        f'stroke-width="26" opacity=".05" filter="url(#b12)"/>'
        f'<path d="M262 70 C392 92 500 74 640 100" fill="none" stroke="{k["noche"]}" '
        f'stroke-width="18" opacity=".035" filter="url(#b12)"/>'
        f'<path d="M290 120 C400 136 520 118 640 140" fill="none" stroke="#fff" '
        f'stroke-width="20" opacity=".045" filter="url(#b12)"/>'
        f'<rect x="330" y="0" width="310" height="{MESA + 2}" fill="url(#djcaida)"/>'
        # el rincón de la habitación: la pared gira y pierde luz de golpe
        f'<rect x="590" y="0" width="50" height="{MESA}" fill="url(#djesq)"/>'
        f'<path d="M597 0 V{MESA}" stroke="#fff" stroke-width="2.6" opacity=".3" '
        f'filter="url(#b2)"/>'
        f'<path d="M601 0 V{MESA}" stroke="{k["noche"]}" stroke-width="3" opacity=".16" '
        f'filter="url(#b2)"/>'
        # aristas que no son perfectas: dos saltados del yeso junto al rincón
        f'<path d="M604 74 q5 3 4 9 q-6-2-4-9z" fill="{k["noche"]}" opacity=".1"/>'
        f'<path d="M578 126 q7-1 9 4 q-8 2-9-4z" fill="{k["noche"]}" opacity=".07"/>'
        f'<path d="M624 36 v14" stroke="{k["noche"]}" stroke-width="1.2" opacity=".08"/>'
        f'<g filter="url(#b22)"><rect x="-70" y="-60" width="440" height="280" fill="url(#djglow)"/></g>'
        f'<g filter="url(#b5)" opacity=".95">'
        f'<rect x="30" y="12" width="206" height="138" rx="6" fill="url(#djcris)" '
        f'stroke="#bcc8d5" stroke-width="7"/>'
        f'<circle cx="80" cy="54" r="22" fill="#ffe7a6" opacity=".95"/>'
        f'<path d="M30 112 q48-24 98-8 q50 16 108-10v56H30z" fill="#a5c698" opacity=".82"/>'
        f'<path d="M133 12v138M30 80h206" stroke="#bcc8d5" stroke-width="6"/></g>'
        # el alféizar: canto con grosor, menos desenfocado que el vidrio
        f'<g filter="url(#b2)">'
        f'<path d="M20 150 H246 L242 160 H24 Z" fill="#e6edf4"/>'
        f'<path d="M20 150 H246 L245 153.4 H21 Z" fill="#fcfdff" opacity=".92"/>'
        f'<path d="M24 160 H242 L239 164 H27 Z" fill="{k["noche"]}" opacity=".26"/></g>'
        f'<path d="M26 161 H240 L250 {MESA} H16 Z" fill="{k["noche"]}" opacity=".12" '
        f'filter="url(#b5)"/>'
        # lo que la ventana derrama sobre la pared, abriéndose hacia abajo
        f'<path d="M34 16 L232 16 L420 168 L96 168 Z" fill="#fff4d6" opacity=".3" '
        f'filter="url(#b22)"/>'

        # ── la mesa ─────────────────────────────────────────────────────
        f'<rect x="0" y="{MESA}" width="{W}" height="{H - MESA}" fill="url(#djmesa)"/>'
        f'<rect x="0" y="{MESA}" width="{W}" height="{H - MESA}" filter="url(#veta)" '
        f'style="mix-blend-mode:multiply" opacity=".3"/>'
        f'<rect x="0" y="{MESA}" width="{W}" height="{H - MESA}" filter="url(#djveta2)" '
        f'style="mix-blend-mode:multiply" opacity=".26"/>'
        f'<g clip-path="url(#djclipm)">' + _vetas()
        # juntas entre tablas: la mesa está hecha de tablones
        + f'<path d="M0 214 C180 211 420 213 640 209" fill="none" stroke="{k["madS"]}" '
        f'stroke-width="2.4" opacity=".3"/>'
        f'<path d="M0 217 C180 214 420 216 640 212" fill="none" stroke="{k["madLL"]}" '
        f'stroke-width="1.4" opacity=".24"/>'
        f'<path d="M0 316 C200 312 430 315 640 310" fill="none" stroke="{k["madS"]}" '
        f'stroke-width="2.8" opacity=".28"/>'
        f'<path d="M0 320 C200 316 430 319 640 314" fill="none" stroke="{k["madLL"]}" '
        f'stroke-width="1.5" opacity=".2"/>'
        + _uso()
        # brillo especular: se alarga siguiendo la fibra, no es un velo uniforme
        + f'<path d="M0 238 C170 231 400 234 640 226 L640 266 C400 274 170 271 0 280 Z" '
        f'fill="#fff" opacity=".1" filter="url(#b12)"/>'
        f'<path d="M0 348 C190 342 420 345 640 338 L640 362 C420 369 190 366 0 372 Z" '
        f'fill="#fff" opacity=".055" filter="url(#b12)"/>'
        f'</g>'
        f'<rect x="0" y="{MESA}" width="{W}" height="{H - MESA}" fill="url(#djmluz)"/>'
        f'<rect x="0" y="{MESA - 3}" width="{W}" height="4" fill="{k["madLL"]}" opacity=".55"/>'
        f'<rect x="0" y="{MESA}" width="{W}" height="22" fill="{k["noche"]}" opacity=".13" '
        f'filter="url(#b5)"/>'
        # oclusión de la mesa contra la pared: corta y oscura
        f'<rect x="0" y="{MESA}" width="{W}" height="5" fill="{k["noche"]}" opacity=".3" '
        f'filter="url(#b2)"/>'

        # ── bote de material, al fondo a la derecha ─────────────────────
        + sombra_suelo(606, 250, 44, 10, .34)
        + ''.join(
            f'<g transform="rotate({r} {x} 232)">'
            f'<rect x="{x - 5}" y="{y}" width="10" height="{232 - y}" rx="2" fill="{c}"/>'
            f'<rect x="{x - 5}" y="{y}" width="3.4" height="{232 - y}" fill="#fff" opacity=".3"/>'
            f'<rect x="{x + 1.6}" y="{y}" width="3.4" height="{232 - y}" fill="{k["noche"]}" opacity=".2"/>'
            f'{cab}</g>'
            for x, y, r, c, cab in (
                (562, 146, -9, '#7c6a52',
                 f'<path d="M557 146 l5-13 l5 13z" fill="{k["madLL"]}"/>'
                 f'<path d="M559.6 139.4 l2.4-6.4 l2.4 6.4z" fill="{k["tinta"]}"/>'),
                (578, 132, -3, '#3d4a57',
                 f'<path d="M573 132 l5-13 l5 13z" fill="{k["madL"]}"/>'
                 f'<path d="M575.6 125.4 l2.4-6.4 l2.4 6.4z" fill="{k["tinta"]}"/>'),
                (594, 140, 4, '#1e242c',
                 f'<rect x="589" y="136" width="10" height="5" fill="#0e1318"/>'),
                (606, 152, 7, '#d9cdb4',
                 f'<path d="M601 152 l5-12 l5 12z" fill="#efe6d2"/>'),
            ))
        # contacto del bote con la mesa
        + f'<ellipse cx="580" cy="246" rx="30" ry="6" fill="{k["noche"]}" opacity=".5" '
        f'filter="url(#b2)"/>'
        f'<path d="M548 196 L552 243 Q580 254 608 243 L612 196 Z" fill="url(#djbote)"/>'
        f'<path d="M553 199 q-1 24 3 42" fill="none" stroke="#fff" stroke-width="5" '
        f'opacity=".22" filter="url(#b2)"/>'
        f'<path d="M604 200 q2 24-2 40" fill="none" stroke="{k["oroLL"]}" stroke-width="4" '
        f'opacity=".2" filter="url(#b2)"/>'
        f'<ellipse cx="580" cy="196" rx="32" ry="9" fill="#5e7286"/>'
        f'<ellipse cx="580" cy="194.5" rx="32" ry="9" fill="#7b90a4"/>'
        f'<ellipse cx="580" cy="196" rx="26" ry="6.6" fill="#161e26" opacity=".92"/>'

        # ── la jarra de verdad: la referencia que se está mirando ───────
        + sombra_suelo(540, 306, 64, 13, .38)
        + f'<ellipse cx="508" cy="303" rx="36" ry="7" fill="{k["noche"]}" opacity=".32" filter="url(#b5)"/>'
        # oclusión bajo la base: corta, pegada y oscura de verdad
        + f'<ellipse cx="500" cy="311" rx="34" ry="7" fill="{k["noche"]}" opacity=".5" '
        f'filter="url(#b2)"/>'
        f'<ellipse cx="500" cy="310" rx="27" ry="4" fill="{k["noche"]}" opacity=".42"/>'
        # asa
        + f'<path d="M{JX + 22} {JRIM + 16} C{JX + 60} {JRIM + 20} {JX + 66} {JRIM + 54} '
        f'{JX + 38} {JRIM + 74}" fill="none" stroke="{k["azul"]}" stroke-width="11" '
        f'stroke-linecap="round"/>'
        f'<path d="M{JX + 24} {JRIM + 14} C{JX + 58} {JRIM + 19} {JX + 62} {JRIM + 50} '
        f'{JX + 38} {JRIM + 70}" fill="none" stroke="{k["azulL"]}" stroke-width="3.4" '
        f'stroke-linecap="round" opacity=".65"/>'
        # cuerpo
        + f'<path d="{JARRA}" fill="url(#djjar)"/>'
        f'<g clip-path="url(#djclipj)">'
        f'<rect x="440" y="180" width="130" height="140" fill="url(#djglaz)"/>'
        f'<path d="M{JX + 8} {JRIM} C{JX + 24} {JRIM + 40} {JX + 30} {JRIM + 80} '
        f'{JX + 18} {JBASE + 12} L{JX + 60} {JBASE + 12} L{JX + 60} {JRIM}z" '
        f'fill="{k["azulS"]}" opacity=".5" filter="url(#b5)"/>'
        # rebote cálido de la madera en la parte baja
        f'<path d="M{JX - 44} {JRIM + 92} q44 30 92 6 l0 26 l-96 0z" fill="{k["oroLL"]}" '
        f'opacity=".34" filter="url(#b5)"/>'
        f'<path d="M{JX + 30} {JRIM + 96} C{JX + 40} {JRIM + 104} {JX + 34} {JBASE - 4} '
        f'{JX + 22} {JBASE + 6}" fill="none" stroke="{k["oroL"]}" stroke-width="5" '
        f'opacity=".38" filter="url(#b2)"/>'
        # el reflejo de la ventana, con su cruz: se reconoce lo que refleja
        f'<g filter="url(#b2)">'
        f'<path d="M464 216 C472 210 484 209 492 212 C495 232 494 248 491 258 '
        f'C482 263 470 262 462 257 C465 244 465 228 464 216 Z" fill="#fff" opacity=".6"/>'
        f'<path d="M463 236 C472 240 484 240 492.6 236 M478.6 210.6 C480 230 480 246 477.6 260" '
        f'stroke="{k["azulL"]}" stroke-width="2.6" fill="none" opacity=".75"/>'
        f'<path d="M464 216 C472 210 484 209 492 212" stroke="#fff" stroke-width="2" '
        f'fill="none" opacity=".9"/></g>'
        f'<ellipse cx="{JX - 30}" cy="{JRIM + 86}" rx="5" ry="16" fill="#fff" opacity=".3" '
        f'filter="url(#b2)"/></g>'
        f'<path d="M{JX - 22} {JRIM + 2} C{JX - 26} {JRIM + 22} {JX - 43} {JRIM + 42} '
        f'{JX - 43} {JRIM + 66}" fill="none" stroke="#fff" stroke-width="3" opacity=".45" '
        f'filter="url(#b2)"/>'
        # boca: el borde tiene grosor —labio de fuera, canto y hueco de dentro—
        f'<ellipse cx="{JX}" cy="{JRIM + 2.2}" rx="22" ry="7.5" fill="{k["azulS"]}"/>'
        f'<ellipse cx="{JX}" cy="{JRIM}" rx="22" ry="7.5" fill="{k["azul"]}"/>'
        f'<ellipse cx="{JX}" cy="{JRIM - 1.8}" rx="22" ry="7.5" fill="{k["azulL"]}"/>'
        f'<ellipse cx="{JX}" cy="{JRIM - 0.4}" rx="16.5" ry="5" fill="{k["noche"]}" opacity=".62"/>'
        f'<path d="M{JX - 15} {JRIM + 2.6} Q{JX} {JRIM + 8} {JX + 15} {JRIM + 2}" fill="none" '
        f'stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".5"/>'
        f'<path d="M{JX - 17} {JRIM - 3.4} Q{JX} {JRIM - 9} {JX + 17} {JRIM - 3.4}" fill="none" '
        f'stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity=".6"/>'
        f'<path d="M{JX - 22} {JRIM - 1} q-10-6-4-11 q8 2 12 8z" fill="{k["azulLL"]}"/>'
        f'<path d="M{JX - 22} {JRIM - 1} q-8-4-4-9" fill="none" stroke="#fff" stroke-width="1.6" '
        f'opacity=".6"/>'
        # dos hojas secas al pie del montaje: el resto del natural
        + f'<ellipse cx="470" cy="326" rx="52" ry="9" fill="{k["noche"]}" opacity=".26" filter="url(#b5)"/>'
        # cubo de escayola: el solido que se pone delante para estudiar la luz
        f'<path d="M420 292 L442 282 L464 292 L442 302 Z" fill="{k["papL"]}"/>'
        f'<path d="M420 292 L442 302 L442 324 L420 314 Z" fill="{k["papS"]}"/>'
        f'<path d="M464 292 L442 302 L442 324 L464 314 Z" fill="#b8b0a0"/>'
        f'<path d="M464 292 L442 302 L442 324 L464 314 Z" fill="{k["noche"]}" opacity=".14"/>'
        f'<g clip-path="url(#djclipc)">'
        f'<rect x="416" y="278" width="52" height="50" filter="url(#djpolvo)" '
        f'style="mix-blend-mode:multiply" opacity=".55"/></g>'
        f'<path d="M420 292 L442 282 L464 292" fill="none" stroke="#fff" stroke-width="1.4" opacity=".75"/>'
        # aristas del yeso: ni rectas ni limpias
        f'<path d="M420 292.6 L442 282.6" stroke="{k["papS"]}" stroke-width="1" opacity=".6"/>'
        f'<path d="M464 292 L442 302" stroke="{k["noche"]}" stroke-width="1" opacity=".12"/>'
        f'<path d="M442 302 L442 324" fill="none" stroke="{k["noche"]}" stroke-width="1" opacity=".18"/>'
        # contacto del cubo con la mesa
        f'<path d="M420 313 L442 323.5 L464 313.5" fill="none" stroke="{k["noche"]}" '
        f'stroke-width="4" opacity=".42" filter="url(#b2)"/>'
        f'<path d="M442 324 L464 314 L494 322 L462 332 Z" fill="{k["noche"]}" opacity=".26" '
        f'filter="url(#b5)"/>'
        # una hoja seca, delante de la base de la jarra
        f'<g transform="rotate(14 500 322)">'
        f'<ellipse cx="500" cy="329" rx="22" ry="4" fill="{k["noche"]}" opacity=".4" filter="url(#b2)"/>'
        f'<path d="M478 323 q12-12 24-10 q13 2 21 9 q-11 9-23 9 q-14 0-22-8z" fill="url(#djhoja)"/>'
        f'<path d="M478 323 q22 2 45-1" fill="none" stroke="{k["madS"]}" stroke-width="1.2" opacity=".75"/>'
        f'<path d="M472 324 h8" stroke="{k["madS"]}" stroke-width="2" stroke-linecap="round"/></g>'

        # ── tablero de dibujo con la lámina sujeta ──────────────────────
        + f'<g filter="url(#sombra)">'
        f'<path d="M52 182 L400 170 L424 380 L30 372 Z" fill="url(#djtab)"/></g>'
        f'<path d="M52 182 L400 170 L424 380 L30 372 Z" filter="url(#veta)" '
        f'style="mix-blend-mode:multiply" opacity=".4"/>'
        f'<path d="M52 182 L400 170" fill="none" stroke="{k["madLL"]}" stroke-width="2.2" opacity=".5"/>'
        # oclusión del tablero sobre la mesa: el canto de delante muerde la madera
        f'<path d="M30 372 L424 380 L424 386 L28 378 Z" fill="{k["noche"]}" opacity=".5" '
        f'filter="url(#b2)"/>'

        # ── la lámina: papel de verdad ──────────────────────────────────
        + f'<g filter="url(#sombraC)"><path d="{LAMINA}" fill="url(#djpap)"/></g>'
        f'<g clip-path="url(#djclipl)">'
        # ondulación del pliego: dos crestas con su luz y su valle con su sombra
        f'<path d="M36 236 C150 228 290 222 418 220 L418 238 C290 240 150 246 36 254 Z" '
        f'fill="#fff" opacity=".72" filter="url(#b12)"/>'
        f'<path d="M36 258 C150 250 290 244 418 242 L418 256 C290 258 150 264 36 272 Z" '
        f'fill="{k["noche"]}" opacity=".13" filter="url(#b12)"/>'
        f'<path d="M36 314 C150 306 290 300 418 298 L418 314 C290 316 150 322 36 330 Z" '
        f'fill="#fff" opacity=".6" filter="url(#b12)"/>'
        f'<path d="M36 334 C150 326 290 320 418 318 L418 330 C290 332 150 338 36 346 Z" '
        f'fill="{k["noche"]}" opacity=".11" filter="url(#b12)"/>'
        # grano y fibra: el papel se ve
        f'<path d="{LAMINA}" filter="url(#djpapg)" style="mix-blend-mode:multiply" opacity=".4"/>'
        f'<path d="{LAMINA}" filter="url(#djpapf)" style="mix-blend-mode:multiply" opacity=".3"/>'
        f'<path d="{LAMINA}" filter="url(#fibra)" style="mix-blend-mode:overlay" opacity=".3"/>'
        # el papel de taller no es blanco perfecto: manchas de manejo y dos pliegues
        f'<ellipse cx="120" cy="300" rx="52" ry="34" fill="{k["papS"]}" opacity=".26" '
        f'filter="url(#b12)"/>'
        f'<ellipse cx="352" cy="330" rx="46" ry="26" fill="{k["madLL"]}" opacity=".12" '
        f'filter="url(#b12)"/>'
        f'<path d="M92 200 C104 250 96 310 84 358" fill="none" stroke="{k["noche"]}" '
        f'stroke-width="2.6" opacity=".05" filter="url(#b2)"/>'
        f'<path d="M96 200 C108 250 100 310 88 358" fill="none" stroke="#fff" '
        f'stroke-width="2" opacity=".3" filter="url(#b2)"/>'
        # grafito corrido con el canto de la mano, al pie del dibujo
        f'<ellipse cx="150" cy="352" rx="40" ry="11" fill="{k["grafito"]}" opacity=".08" '
        f'filter="url(#b12)" transform="rotate(-4 150 352)"/>'
        f'<ellipse cx="256" cy="356" rx="34" ry="8" fill="{k["grafito"]}" opacity=".06" '
        f'filter="url(#b12)"/>'
        f'</g>'
        # borde recortado: canto claro arriba, grosor y sombra de contacto abajo
        f'<path d="M66 196 C146 192.6 306 187.2 386 185" fill="none" stroke="#fff" '
        f'stroke-width="1.8" opacity=".8"/>'
        f'<path d="M46 360 C152 366.6 298 372.4 408 368" fill="none" stroke="{k["papS"]}" '
        f'stroke-width="2.6" opacity=".9"/>'
        f'<path d="M47 362.4 C152 369 298 374.8 408 370.4" fill="none" stroke="{k["noche"]}" '
        f'stroke-width="3.4" opacity=".34" filter="url(#b2)"/>'
        f'<path d="M408 368 C401 307 393.2 246 386 185" fill="none" stroke="{k["papS"]}" '
        f'stroke-width="2" opacity=".75"/>'
        f'<path d="M410.4 366 C403 306 395 246 388 186" fill="none" stroke="{k["noche"]}" '
        f'stroke-width="3" opacity=".26" filter="url(#b2)"/>'
        # irregularidades del corte: el canto no tiene el mismo grosor en todo el largo
        f'<path d="M46 360 C152 366.6 298 372.4 408 368" fill="none" stroke="{k["papS"]}" '
        f'stroke-width="4" stroke-dasharray="26 38 62 30 44 70" opacity=".5"/>'
        f'<path d="M168 366 q9 1.6 16 .6" fill="none" stroke="{k["madS"]}" stroke-width="1.4" '
        f'opacity=".3"/>'
        f'<path d="M296 371.4 q11 .8 18-.4" fill="none" stroke="{k["madS"]}" stroke-width="1.2" '
        f'opacity=".26"/>'
        # esquina levantada, con su sombra debajo: el pliego no está plano
        f'<path d="M388 362 q14 2 21 6 q-10 6-23 1z" fill="{k["noche"]}" opacity=".34" '
        f'filter="url(#b2)"/>'
        f'<path d="M390 360.4 C397 359.6 404 362 408.4 366 C401 369.6 393 368.4 387 365.6 Z" '
        f'fill="{k["pap"]}"/>'
        f'<path d="M390 360.4 C397 359.6 404 362 408.4 366" fill="none" stroke="#fff" '
        f'stroke-width="1.2" opacity=".7"/>'

        # ── el estudio, sobre la lámina ─────────────────────────────────
        f'<g transform="rotate(-2.1 224 277)">'
        + _construccion()
        # sombreado empezado: tramado, cruzado en lo oscuro y difuminado en un punto
        + f'<path d="{SIL}" fill="none" stroke="{k["grafito"]}" stroke-width="1.4" '
        f'stroke-dasharray="16 1.2" opacity=".36"/>'
        + f'<g clip-path="url(#djclip)">'
        + _tramado(19, 124, 6.8, 354, 50, -82, k['grafito'], 1.8, .1, .52, 51.3)
        + _tramado(10, 176, 6.6, 292, 44, -72, k['grafito'], 1.7, .14, .46, 52.7)
        + _tramado(8, 180, 7.6, 238, 46, 72, k['grafito'], 1.5, .07, .3, 53.9)
        + f'<ellipse cx="224" cy="276" rx="21" ry="80" fill="{k["grafito"]}" opacity=".16" '
        f'filter="url(#b5)"/>'
        f'<ellipse cx="194" cy="341" rx="46" ry="10" fill="{k["grafito"]}" opacity=".17" '
        f'filter="url(#b5)"/>'
        # grumo: la mina se agarra al grano del papel, no cubre plano
        f'<path d="{SIL}" filter="url(#djgraf)" style="mix-blend-mode:multiply" opacity=".34"/>'
        # luz reflejada: el canto de la derecha se levanta, y el volumen gira
        f'<ellipse cx="233" cy="294" rx="9" ry="44" fill="#fff" opacity=".34" filter="url(#b5)"/>'
        # el grafito apretado brilla
        f'<ellipse cx="216" cy="302" rx="13" ry="28" fill="#fff" opacity=".1" filter="url(#b5)"/>'
        f'<ellipse cx="228" cy="256" rx="7" ry="15" fill="#fff" opacity=".07" filter="url(#b2)"/>'
        f'</g>'
        # la sombra proyectada, dibujada solo a medias
        + f'<g clip-path="url(#djclip2)">'
        + _tramado(11, 198, 8.4, 356, 20, -22, k['grafito'], 1.6, .34, .08, 54.1)
        + f'</g>'
        # línea tanteada que se va a corregir, por fuera del contorno bueno
        + _lapiz('M168 210 C161 233 126 256 126 290 C126 312 132 328 144 336',
                 k['grafito'], 1.6, .34, 61.2)
        # zona borrada a medias sobre la esquina de la caja
        + f'<path d="M208 196 q36-6 44 12 q-10 22-44 16 q-14-14 0-28z" fill="{k["papL"]}" '
        f'opacity=".62" filter="url(#b5)"/>'
        f'<path d="M212 202 q30 10 40 2" fill="none" stroke="{k["grafito"]}" stroke-width="1.1" '
        f'stroke-dasharray="4 2" opacity=".15"/>'
        # trazo definitivo: presión variable, apoya abajo y sale afinando
        + f'<path d="{FIRME_A}{FIRME_B[1:]}{FIRME_C[1:]}" fill="none" stroke="{k["tinta"]}" '
        f'stroke-width="4.4" stroke-linecap="round" opacity=".2" filter="url(#b2)"/>'
        f'<path d="{FIRME_A}" fill="none" stroke="{k["tinta"]}" stroke-width="2.1" '
        f'stroke-linecap="round" opacity=".8"/>'
        f'<path d="{FIRME_B}" fill="none" stroke="{k["noche"]}" stroke-width="3.6" '
        f'stroke-linecap="round" opacity=".95"/>'
        f'<path d="{FIRME_C}" fill="none" stroke="{k["tinta"]}" stroke-width="2.3" '
        f'stroke-linecap="round" opacity=".8"/>'
        f'<path d="M176 341.6 Q186 343.4 196 344" fill="none" stroke="{k["tinta"]}" '
        f'stroke-width="1.2" stroke-linecap="round" stroke-dasharray="7 2.4" opacity=".55"/>'
        f'<path d="M158 220 C150 244 136 262 135 288" fill="none" stroke="{k["noche"]}" '
        f'stroke-width="3.4" stroke-linecap="round" opacity=".55"/>'
        # boca: arco de delante en firme, el de atrás se queda en construcción
        + f'<path d="M161 206 Q186 218 211 206" fill="none" stroke="{k["tinta"]}" '
        f'stroke-width="2.6" stroke-linecap="round" opacity=".92"/>'
        f'<path d="M161 206 Q186 218 211 206" fill="none" stroke="{k["tinta"]}" '
        f'stroke-width="4.6" stroke-linecap="round" opacity=".16" filter="url(#b2)"/>'
        # el pico, apenas insinuado: se resuelve despues
        f'<path d="M161 205 q-11-6-6-12" fill="none" stroke="{k["tinta"]}" '
        f'stroke-width="2.3" stroke-linecap="round" opacity=".8"/>'
        f'<path d="M155 193 q9 3 12 9" fill="none" stroke="{k["grafito"]}" '
        f'stroke-width="1.4" stroke-linecap="round" stroke-dasharray="5 2" opacity=".35"/>'
        # escala de valores y apunte pequeño en la esquina
        + ''.join(
            f'<rect x="{300 + i * 15}" y="196" width="15" height="17" fill="{c}"/>'
            for i, c in enumerate((k['papL'], '#dcd7cb', '#aba599', '#6e6b63', '#3a3936')))
        + f'<rect x="300" y="196" width="75" height="17" filter="url(#djgraf)" '
        f'style="mix-blend-mode:multiply" opacity=".3"/>'
        f'<rect x="300" y="196" width="75" height="17" fill="none" stroke="{k["grafito"]}" '
        f'stroke-width="1.1" opacity=".5"/>'
        + _apunte()
        # el lápiz, apoyado sobre la obra
        + f'<g transform="rotate(-19 322 322)">'
        f'<path d="M258 330 h126 l4 6 h-130z" fill="{k["noche"]}" opacity=".45" filter="url(#b2)"/>'
        f'<g filter="url(#sombraC)">'
        f'<rect x="262" y="315" width="120" height="14" rx="2.5" fill="url(#djlap)"/>'
        f'<rect x="262" y="315" width="120" height="4" fill="#fff" opacity=".24"/>'
        f'<rect x="262" y="326" width="120" height="3" fill="{k["noche"]}" opacity=".26"/>'
        f'<path d="M262 315 l-24 7 l24 7z" fill="{k["madL"]}"/>'
        f'<path d="M262 315 l-24 7 l24 2z" fill="{k["madLL"]}"/>'
        f'<path d="M240 321.4 l-9 .6 l9 3z" fill="{k["tinta"]}"/>'
        f'<rect x="374" y="315" width="8" height="14" rx="2" fill="#11161e"/></g></g>'
        # la goma, con su sombra y el grafito que ha levantado
        + f'<g transform="rotate(-7 96 344)">'
        f'<path d="M72 352 h48 l3 5 h-52z" fill="{k["noche"]}" opacity=".42" filter="url(#b2)"/>'
        f'<g filter="url(#sombraC)">'
        f'<rect x="74" y="334" width="44" height="20" rx="4" fill="url(#djgoma)"/>'
        f'<rect x="74" y="334" width="44" height="5" rx="2.5" fill="#fff" opacity=".5"/>'
        f'<rect x="74" y="348" width="44" height="6" rx="3" fill="{k["noche"]}" opacity=".2"/>'
        f'<rect x="74" y="334" width="44" height="20" rx="4" fill="none" stroke="{k["papS"]}" '
        f'stroke-width="1" opacity=".9"/>'
        f'<path d="M106 346 q10-2 12-7 l0 11 q-4 4-12 4z" fill="{k["grafito"]}" opacity=".45"/>'
        f'</g></g>'
        f'<ellipse cx="128" cy="352" rx="26" ry="9" fill="{k["grafito"]}" opacity=".18" '
        f'filter="url(#b5)"/>'
        + ''.join(
            '<circle cx="%s" cy="%s" r="%s" fill="%s" opacity="%s"/>'
            % (round(126 + _n(i, 71.3) * 32, 1), round(344 + _n(i, 73.7) * 18, 1),
               round(.9 + _n(i, 77.1) * 1.8, 2), k['grafito'],
               round(.3 + _n(i, 79.3) * .3, 3))
            for i in range(7))
        + f'</g>'

        # ── pinzas metálicas mordiendo la lámina ────────────────────────
        + _pinza(108, 174, 21, 194.6)
        + _pinza(300, 168, 21, 188)

        # ── viñeteado y grano ───────────────────────────────────────────
        + f'<rect width="{W}" height="{H}" filter="url(#grano)" '
        f'style="mix-blend-mode:overlay" opacity=".13"/>'
        f'<rect width="{W}" height="{H}" fill="url(#djvin)"/>'
    )

    return svg(cuerpo, d + rg('djvin', .5, .45, .78,
                              [(.55, '#000', 0), (1, '#0d1b2a', .22)]))
