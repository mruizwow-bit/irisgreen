# -*- coding: utf-8 -*-
"""Escenas del Taller (R54).

Cada estudio entra por una mini-escena, no por un icono. Reglas del sistema:

* Lienzo 320 × 200 (16:10), el mismo que la tarjeta.
* Tres planos: fondo (ambiente), medio (el objeto o la superficie de trabajo) y
  primer plano (la acción: una mano, una herramienta, una pieza a medio colocar).
* Siempre hay algo a medio hacer. La escena responde «¿qué puedo crear aquí?».
* Paleta común, para que las 27 se lean como una familia, con un acento propio
  por estudio para que se distingan sin leer el título.
* Todo original: sin marcas, sin personajes conocidos, sin material de terceros.
* Decorativas: la tarjeta ya lleva el nombre y la descripción en texto, así que
  el SVG va con aria-hidden. Si una escena comunicara algo que el texto no dice,
  llevaría alternativa real.
* Sin animación: nada se mueve solo.
"""

# ---------- Paleta común ----------
P = {
    'tinta': '#101820', 'navy': '#17395c', 'azul': '#1f5f8b', 'cielo': '#6fa8dc', 'cielo2': '#bcd9f0',
    'violeta': '#5a49a8', 'lila': '#c9c0f0', 'turquesa': '#0b8f8f', 'menta': '#bfe6df',
    'oro': '#e0b000', 'sol': '#f6e27a', 'coral': '#d86b00', 'rojo': '#b3261e', 'rosa': '#e7a3b8',
    'verde': '#2e7d32', 'hoja': '#7cc36b', 'gris': '#7d8b99', 'gris2': '#aebac6',
    'papel': '#ffffff', 'papel2': '#f4f1e8', 'arena': '#e9d8b4', 'madera': '#a9784f', 'madera2': '#c79a६6',
    'piel1': '#f0c9a4', 'piel2': '#c98c5e', 'piel3': '#8d5a3b',
}
P['madera2'] = '#c79a66'

# Fondos por perfil (los mismos que ya usa la portada)
BG = {'lienzo': '#efeafb', 'construir': '#e4eef7', 'tiempo': '#fdefe3', 'codigo': '#e3f3ea', 'documento': '#f5efe0'}


def _(s):
    return s


# ---------- Piezas reutilizables ----------
def mesa(y=146, color=None, sombra=True):
    """Superficie de trabajo que cruza la escena: da suelo y profundidad."""
    c = color or P['madera2']
    out = f'<rect x="0" y="{y}" width="320" height="{200 - y}" fill="{c}"/>'
    out += f'<rect x="0" y="{y}" width="320" height="4" fill="{P["madera"]}" opacity=".55"/>'
    if sombra:
        out += f'<rect x="0" y="{y + 4}" width="320" height="10" fill="{P["tinta"]}" opacity=".07"/>'
    return out


def pared(color='#ffffff', alto=146):
    return f'<rect x="0" y="0" width="320" height="{alto}" fill="{color}"/>'


def sombra_bajo(cx, cy, rx, ry=None, op=.16):
    ry = ry if ry is not None else max(3, rx * 0.22)
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{P["tinta"]}" opacity="{op}"/>'


def hoja(x, y, w, h, rot=0, color=None, borde=True):
    """Hoja de papel con esquina levantada: aparece en muchos estudios."""
    c = color or P['papel']
    t = f' transform="rotate({rot} {x + w / 2} {y + h / 2})"' if rot else ''
    b = f' stroke="{P["gris2"]}" stroke-width="1.5"' if borde else ''
    return (f'<g{t}><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="{c}"{b}/>'
            f'<path d="M{x + w - 14} {y + h} l14 -14 v14z" fill="{P["gris2"]}" opacity=".45"/></g>')


def fantasma(d, color=None, w=3):
    """Contorno punteado del sitio donde va a ir una pieza: muestra que algo está a medio hacer."""
    return f'<path d="{d}" fill="none" stroke="{color or P["gris"]}" stroke-width="{w}" stroke-dasharray="6 5" stroke-linejoin="round"/>'


def chispas(x, y, color=None, n=3):
    """Marcas cortas de movimiento o de «acaba de pasar algo»."""
    c = color or P['oro']
    d = ''
    for i in range(n):
        a = -30 + i * 34
        d += (f'<path d="M{x} {y} l{10 + i * 2} {-6 + i * 5}" stroke="{c}" stroke-width="3" '
              f'stroke-linecap="round" transform="rotate({a} {x} {y})"/>')
    return d


def lapiz(x, y, largo=54, rot=-38, cuerpo=None):
    c = cuerpo or P['oro']
    return (f'<g transform="rotate({rot} {x} {y})">'
            f'<rect x="{x}" y="{y}" width="{largo}" height="11" rx="2" fill="{c}"/>'
            f'<rect x="{x}" y="{y}" width="{largo}" height="4" fill="#fff" opacity=".35"/>'
            f'<path d="M{x} {y} l-13 5.5 l13 5.5z" fill="{P["arena"]}"/>'
            f'<path d="M{x - 8} {y + 3.2} l-5 2.3 l5 2.3z" fill="{P["tinta"]}"/>'
            f'<rect x="{x + largo - 9}" y="{y}" width="9" height="11" fill="{P["rosa"]}"/></g>')


def pincel(x, y, largo=56, rot=-40, mango=None, punta=None):
    m = mango or P['madera']
    p = punta or P['violeta']
    return (f'<g transform="rotate({rot} {x} {y})">'
            f'<rect x="{x}" y="{y}" width="{largo}" height="9" rx="4" fill="{m}"/>'
            f'<rect x="{x - 12}" y="{y - 1}" width="13" height="11" rx="2" fill="{P["gris2"]}"/>'
            f'<path d="M{x - 12} {y + 4.5} l-14 -6 v12z" fill="{p}"/></g>')


def ventana(x, y, w=86, h=62):
    return (f'<g><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="4" fill="{P["cielo2"]}" '
            f'stroke="{P["gris2"]}" stroke-width="3"/>'
            f'<circle cx="{x + w - 22}" cy="{y + 20}" r="10" fill="{P["sol"]}"/>'
            f'<path d="M{x} {y + h - 18} q{w / 4} -14 {w / 2} -2 q{w / 4} 12 {w / 2} -4 v22 h-{w}z" fill="{P["hoja"]}" opacity=".75"/>'
            f'<path d="M{x + w / 2} {y} v{h} M{x} {y + h / 2} h{w}" stroke="{P["gris2"]}" stroke-width="2.5"/></g>')


def taza(x, y, c=None):
    c = c or P['coral']
    return (f'<g><path d="M{x} {y} h26 v14 a13 13 0 0 1 -26 0z" fill="{c}"/>'
            f'<path d="M{x + 26} {y + 3} a7 7 0 0 1 0 10" fill="none" stroke="{c}" stroke-width="3.5"/>'
            f'<rect x="{x}" y="{y}" width="26" height="4" fill="#fff" opacity=".4"/></g>')


def svg(cuerpo, clase='igk-art-svg'):
    return (f'<svg class="{clase}" viewBox="0 0 320 200" aria-hidden="true" focusable="false" '
            f'preserveAspectRatio="xMidYMid slice">{cuerpo}</svg>')


# =============================================================================
# ESCENAS · una por estudio. Clave: el slug español.
# Cada una: fondo con ambiente, objeto de trabajo a medio hacer y acción visible.
# =============================================================================
S = {}


def escena(slug):
    def deco(fn):
        S[slug] = fn
        return fn
    return deco


@escena('dibujo')
def _dibujo():
    k = P
    return (
        pared('#f7f2ff')
        + ventana(206, 16)
        + mesa(150, k['madera2'])
        # lámina grande sobre la mesa, ya con dibujo empezado
        + '<g transform="rotate(-4 120 96)">'
        + f'<rect x="34" y="34" width="176" height="124" rx="3" fill="{k["papel"]}" stroke="{k["gris2"]}" stroke-width="2"/>'
        # boceto: un pájaro a medio terminar, con línea de construcción
        + f'<path d="M62 132 q28 -56 74 -52 q26 2 38 22" fill="none" stroke="{k["gris2"]}" stroke-width="2" stroke-dasharray="5 4"/>'
        # cuerpo
        + f'<path d="M74 122 c0 -24 18 -40 42 -40 c14 0 24 5 30 13 l20 -9 l-6 16 c4 6 6 13 6 20 '
          f'c0 16 -16 26 -40 26 c-30 0 -52 -10 -52 -26z" fill="{k["lila"]}" stroke="{k["violeta"]}" '
          f'stroke-width="3.5" stroke-linejoin="round"/>'
        # ala
        + f'<path d="M96 110 q24 -16 50 -6 q-14 20 -40 18 q-8 -4 -10 -12z" fill="{k["violeta"]}" opacity=".6"/>'
        + f'<path d="M104 112 q18 -8 34 -3 M100 120 q20 -6 36 0" stroke="{k["violeta"]}" stroke-width="2" fill="none" opacity=".7"/>'
        # ojo y pico
        + f'<circle cx="146" cy="96" r="4.6" fill="{k["papel"]}"/><circle cx="147" cy="96" r="2.6" fill="{k["tinta"]}"/>'
        + f'<path d="M158 97 l22 6 -21 7z" fill="{k["oro"]}"/>'
        # patas apoyadas en la línea del suelo del dibujo
        + f'<path d="M106 145 v9 M106 154 l-6 4 M106 154 l6 4 M126 145 v9 M126 154 l-6 4 M126 154 l6 4" '
          f'stroke="{k["oro"]}" stroke-width="3" stroke-linecap="round" fill="none"/>'
        + '</g>'
        # bote de lápices y color al lado
        + sombra_bajo(256, 156, 26)
        + f'<path d="M238 118 h36 v34 a4 4 0 0 1 -4 4 h-28 a4 4 0 0 1 -4 -4z" fill="{k["turquesa"]}"/>'
        + f'<rect x="242" y="96" width="7" height="26" rx="2" fill="{k["rojo"]}"/>'
        + f'<rect x="252" y="90" width="7" height="32" rx="2" fill="{k["oro"]}"/>'
        + f'<rect x="262" y="100" width="7" height="22" rx="2" fill="{k["verde"]}"/>'
        # mano con lápiz, dibujando
        + fantasma('M82 150 q40 14 96 2', k['gris2'], 2.5)
        + lapiz(186, 136, 62, -34, k['coral'])
        + chispas(180, 152, k['oro'], 2)
    )


@escena('estructuras')
def _estructuras():
    k = P
    return (
        f'<rect x="0" y="0" width="320" height="200" fill="#e6f0f8"/>'
        # cielo con nubes y colinas al fondo
        + f'<ellipse cx="58" cy="34" rx="30" ry="13" fill="#fff" opacity=".9"/>'
        + f'<ellipse cx="84" cy="30" rx="20" ry="11" fill="#fff" opacity=".9"/>'
        + f'<path d="M0 118 q54 -34 104 -6 q46 26 96 -6 q52 -32 120 -2 v96 H0z" fill="{k["hoja"]}" opacity=".45"/>'
        # río
        + f'<path d="M0 150 q80 -14 160 0 q80 14 160 0 v50 H0z" fill="{k["cielo"]}"/>'
        + f'<path d="M22 162 h44 M120 170 h50 M226 160 h48" stroke="#fff" stroke-width="3" opacity=".55" stroke-linecap="round"/>'
        # pilares y tablero del puente
        + f'<rect x="22" y="120" width="26" height="42" fill="{k["arena"]}"/>'
        + f'<rect x="272" y="120" width="26" height="42" fill="{k["arena"]}"/>'
        + f'<rect x="22" y="116" width="276" height="10" fill="{k["madera"]}"/>'
        # celosía triangulada
        + f'<path d="M34 116 L80 66 L126 116 L172 66 L218 116 L264 66 L286 116" fill="none" '
          f'stroke="{k["navy"]}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>'
        + f'<path d="M80 66 h92 M172 66 h92" stroke="{k["navy"]}" stroke-width="6" stroke-linecap="round"/>'
        # una barra todavía suelta, en la mano
        + fantasma('M218 116 L264 66', k['navy'], 4)
        + f'<g transform="rotate(-46 236 40)"><rect x="206" y="34" width="62" height="9" rx="4.5" fill="{k["coral"]}"/>'
          f'<rect x="206" y="34" width="62" height="3" rx="1.5" fill="#fff" opacity=".4"/></g>'
        + f'<path d="M244 62 v14 M244 78 l-4 -6 M244 78 l4 -6" stroke="{k["coral"]}" stroke-width="3" '
          f'stroke-linecap="round" fill="none"/>' 
        # camión de prueba cruzando
        + sombra_bajo(150, 118, 30, 4, .18)
        + f'<rect x="124" y="94" width="42" height="20" rx="3" fill="{k["rojo"]}"/>'
        + f'<rect x="164" y="100" width="20" height="14" rx="3" fill="{k["rojo"]}"/>'
        + f'<rect x="168" y="102" width="11" height="8" rx="2" fill="{k["cielo2"]}"/>'
        + f'<circle cx="136" cy="116" r="7" fill="{k["tinta"]}"/><circle cx="136" cy="116" r="3" fill="{k["gris2"]}"/>'
        + f'<circle cx="172" cy="116" r="7" fill="{k["tinta"]}"/><circle cx="172" cy="116" r="3" fill="{k["gris2"]}"/>'
        # flechas de carga
        + f'<path d="M104 78 v14 M104 92 l-4 -5 M104 92 l4 -5" stroke="{k["violeta"]}" stroke-width="3" stroke-linecap="round"/>'
        + f'<path d="M210 78 v14 M210 92 l-4 -5 M210 92 l4 -5" stroke="{k["violeta"]}" stroke-width="3" stroke-linecap="round"/>'
    )


@escena('programacion')
def _programacion():
    k = P
    return (
        pared('#eaf6ee')
        + mesa(152, '#cbb08a')
        # pantalla con el escenario y el personaje que obedece
        + sombra_bajo(200, 158, 62, 7, .16)
        + f'<rect x="126" y="28" width="164" height="112" rx="8" fill="{k["navy"]}"/>'
        + f'<rect x="134" y="36" width="148" height="96" rx="4" fill="#dff0ff"/>'
        + f'<rect x="184" y="140" width="46" height="12" rx="3" fill="{k["gris"]}"/>'
        # escenario: suelo, meta y gato-robot avanzando por un camino
        + f'<path d="M134 112 h148 v20 h-148z" fill="{k["hoja"]}" opacity=".7"/>'
        + f'<path d="M146 112 q34 -36 72 -8 q26 20 56 -12" fill="none" stroke="{k["gris2"]}" '
          f'stroke-width="3" stroke-dasharray="6 5"/>'
        + f'<rect x="262" y="52" width="4" height="30" fill="{k["gris"]}"/>'
        + f'<path d="M266 52 l20 6 -20 6z" fill="{k["rojo"]}"/>'
        + f'<g><rect x="170" y="80" width="26" height="22" rx="6" fill="{k["violeta"]}"/>'
          f'<circle cx="177" cy="89" r="3.2" fill="#fff"/><circle cx="189" cy="89" r="3.2" fill="#fff"/>'
          f'<path d="M183 80 v-8" stroke="{k["tinta"]}" stroke-width="2"/><circle cx="183" cy="70" r="3" fill="{k["oro"]}"/>'
          f'<rect x="172" y="102" width="7" height="7" rx="2" fill="{k["tinta"]}"/>'
          f'<rect x="187" y="102" width="7" height="7" rx="2" fill="{k["tinta"]}"/></g>'
        + f'<path d="M204 92 l16 0 M216 88 l5 4 -5 4" stroke="{k["coral"]}" stroke-width="3" '
          f'stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
        # pila de bloques encajados a la izquierda
        + f'<rect x="18" y="44" width="96" height="22" rx="7" fill="{k["oro"]}"/>'
        + f'<path d="M40 66 h16 v6 h-16z" fill="{k["oro"]}"/>'
        + f'<rect x="18" y="72" width="96" height="22" rx="7" fill="{k["violeta"]}"/>'
        + f'<circle cx="98" cy="83" r="6" fill="#fff" opacity=".85"/>'
        + f'<path d="M40 94 h16 v6 h-16z" fill="{k["violeta"]}"/>'
        + f'<rect x="18" y="100" width="70" height="22" rx="7" fill="{k["azul"]}"/>'
        + f'<path d="M40 122 h16 v6 h-16z" fill="{k["azul"]}"/>'
        # bloque que la mano está a punto de encajar
        + fantasma('M18 128 h70 v22 h-70z', k['gris'], 2.5)
        + f'<g transform="rotate(-7 78 150)"><rect x="38" y="138" width="80" height="22" rx="7" fill="{k["verde"]}"/>'
          f'<rect x="38" y="138" width="80" height="6" rx="3" fill="#fff" opacity=".3"/>'
          f'<path d="M60 160 h16 v6 h-16z" fill="{k["verde"]}"/></g>'
        + f'<path d="M96 128 l-8 8 M88 136 l0 -7 M88 136 l7 0" stroke="{k["coral"]}" stroke-width="3" '
          f'stroke-linecap="round" fill="none"/>' 
    )


# =============================================================================
# GRUPO · tiempo y sonido (ritmo, composicion, sintesis-sonido, videomapping)
# + robotica y videojuegos. Piezas propias, con nombre prefijado para no chocar.
# =============================================================================
import math as _ts_math


def _ts_rejilla(x, y, cols, filas, cw, ch, color, op='.45', w=1.5):
    """Líneas de una rejilla en un solo path (barato en bytes)."""
    d = ''
    for c in range(cols + 1):
        d += f'M{x + c * cw} {y}v{filas * ch}'
    for f in range(filas + 1):
        d += f'M{x} {y + f * ch}h{cols * cw}'
    return f'<path d="{d}" stroke="{color}" stroke-width="{w}" opacity="{op}" fill="none"/>'


def _ts_mando(cx, cy, r, ang, cuerpo=None, marca=None):
    """Mando giratorio con su marca de posición."""
    c = cuerpo or P['gris2']
    m = marca or P['navy']
    a = _ts_math.radians(ang)
    x2, y2 = cx + (r - 3) * _ts_math.cos(a), cy + (r - 3) * _ts_math.sin(a)
    return (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{c}"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r - 5}" fill="{P["papel2"]}"/>'
            f'<path d="M{cx} {cy}L{x2:.0f} {y2:.0f}" stroke="{m}" stroke-width="3.5" stroke-linecap="round"/>')


def _ts_caja(x, y, w, h, dx, dy, frente, tapa, lado):
    """Caja en perspectiva sencilla: cara frontal, tapa y costado."""
    return (f'<path d="M{x + w} {y}l{dx} {-dy}v{h}l{-dx} {dy}z" fill="{lado}"/>'
            f'<path d="M{x} {y}l{dx} {-dy}h{w}l{-dx} {dy}z" fill="{tapa}"/>'
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{frente}"/>')


def _ts_moneda(cx, cy, r=9):
    return (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{P["oro"]}"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r - 3.5}" fill="{P["sol"]}"/>')


@escena('ritmo')
def _ritmo():
    k = P
    fil = [k['oro'], k['coral'], k['menta'], k['rosa']]
    pat = [[0, 2, 4, 6], [2, 6], [0, 3, 4, 7], [1, 5]]
    cel = ''
    for r, cols in enumerate(pat):
        d = ''.join(f'M{27 + c * 22} {50 + r * 22}h16v14h-16z' for c in cols)
        cel += f'<path d="{d}" fill="{fil[r]}"/>'
    return (
        pared('#fdeee0')
        + mesa(160, k['madera2'])
        # secuenciador: caja, pistas y rejilla
        + sombra_bajo(112, 152, 96, 8, .14)
        + f'<rect x="12" y="32" width="200" height="114" rx="9" fill="{k["navy"]}"/>'
        + f'<rect x="24" y="46" width="176" height="88" fill="#0d2438"/>'
        + f'<path d="M24 68h176M24 112h176" stroke="#1d4870" stroke-width="22"/>'
        + _ts_rejilla(24, 46, 8, 4, 22, 22, '#5f86ab', '.7')
        + cel
        # línea de reproducción cruzando la rejilla
        + f'<rect x="112" y="46" width="22" height="88" fill="#fff" opacity=".13"/>'
        + f'<path d="M123 40v100" stroke="{k["papel"]}" stroke-width="3"/>'
        + f'<path d="M116 30h14l-7 9z" fill="{k["papel"]}"/>'
        # casilla todavía apagada, a punto de encenderse
        + fantasma('M115 72h16v14h-16z', k['papel'], 2)
        # instrumentos: platillo, caja y bombo
        + f'<path d="M276 58v46" stroke="{k["gris"]}" stroke-width="4"/>'
        + f'<ellipse cx="276" cy="56" rx="32" ry="7.5" fill="{k["oro"]}"/>'
        + f'<ellipse cx="276" cy="54" rx="19" ry="4" fill="{k["sol"]}"/>'
        + chispas(244, 46, k['oro'], 2)
        + f'<path d="M240 122l-6 16M292 122l6 16" stroke="{k["gris"]}" stroke-width="3.5"/>'
        + f'<rect x="232" y="96" width="68" height="27" rx="4" fill="{k["papel2"]}" stroke="{k["gris"]}" stroke-width="2"/>'
        + f'<path d="M232 100h68M232 119h68" stroke="{k["coral"]}" stroke-width="4"/>'
        + f'<path d="M248 100v19M266 100v19M284 100v19" stroke="{k["gris2"]}" stroke-width="2"/>'
        + sombra_bajo(258, 186, 32, 6, .16)
        + f'<circle cx="258" cy="158" r="27" fill="{k["navy"]}"/>'
        + f'<circle cx="258" cy="158" r="19" fill="{k["papel2"]}"/>'
        + f'<circle cx="258" cy="158" r="8" fill="{k["menta"]}"/>'
        + f'<path d="M228 182h22" stroke="{k["gris"]}" stroke-width="5" stroke-linecap="round"/>'
        + chispas(222, 150, k['menta'], 2)
    )


@escena('composicion')
def _composicion():
    k = P
    mel = [(70, 139, 24), (98, 124, 18), (120, 109, 28), (152, 94, 20),
           (176, 79, 30), (210, 94, 18), (232, 109, 26)]
    notas = ''.join(f'<rect x="{x}" y="{y}" width="{w}" height="11" rx="5" fill="{k["azul"]}"/>'
                    for x, y, w in mel)
    ac = ''
    for x, y0 in ((96, 31), (214, 38)):
        for i in range(3):
            ac += f'<rect x="{x}" y="{y0 + i * 15}" width="30" height="11" rx="5" fill="{k["violeta"]}"/>'
    return (
        pared('#f1eefc')
        + mesa(168, '#c9a97d')
        + sombra_bajo(160, 164, 132, 7, .13)
        # lámina del editor: piano roll sobre la mesa
        + f'<rect x="22" y="20" width="276" height="138" rx="6" fill="{k["papel2"]}" stroke="{k["gris2"]}" stroke-width="2"/>'
        + f'<path d="M66 43h226M66 58h226M66 73h226M66 88h226M66 103h226M66 118h226M66 133h226M66 148h226" '
          f'stroke="{k["gris2"]}" stroke-width="1.2" opacity=".55"/>'
        # teclado vertical con dos teclas pulsadas
        + f'<rect x="28" y="28" width="34" height="120" fill="{k["papel"]}" stroke="{k["gris2"]}" stroke-width="1.5"/>'
        + f'<rect x="29" y="89" width="32" height="14" fill="{k["lila"]}"/>'
        + f'<rect x="29" y="119" width="32" height="14" fill="{k["lila"]}"/>'
        + f'<path d="M28 43h34M28 58h34M28 73h34M28 88h34M28 103h34M28 118h34M28 133h34" '
          f'stroke="{k["gris2"]}" stroke-width="1.5"/>'
        + f'<path d="M28 39h21M28 66h21M28 96h21M28 111h21M28 141h21" stroke="{k["tinta"]}" stroke-width="7"/>'
        + f'<rect x="28" y="52" width="21" height="7" fill="{k["violeta"]}"/>'
        + f'<path d="M66 89a13 13 0 0 1 0 15M72 84a22 22 0 0 1 0 25" fill="none" stroke="{k["violeta"]}" stroke-width="2.5"/>'
        # acordes marcados arriba
        + ac
        + fantasma('M92 27h38v46h-38z', k['coral'], 2)
        + fantasma('M210 34h38v46h-38z', k['coral'], 2)
        # melodía que sube y baja, y el hueco de la nota siguiente
        + notas
        + fantasma('M262 124h26v11h-26z', k['coral'], 2)
    )


@escena('sintesis-sonido')
def _sintesis_sonido():
    k = P
    a = [6, 14, 24, 34, 40, 40, 34, 28, 22, 17, 13, 10, 7, 5]
    d = 'M22 68'
    for i, v in enumerate(a):
        d += f'q9.5 {-v if i % 2 == 0 else v} 19 0'
    return (
        f'<rect x="0" y="0" width="320" height="200" fill="#e9f5f1"/>'
        # osciloscopio: onda grande cruzando la escena
        + f'<rect x="12" y="14" width="296" height="110" rx="9" fill="#0f2b42"/>'
        + fantasma('M22 68h266', k['cielo'], 1.5)
        + f'<path d="M22 112L60 26L96 58H196L286 112z" fill="{k["coral"]}" opacity=".16"/>'
        + f'<path d="{d}" fill="none" stroke="{k["menta"]}" stroke-width="3.5" stroke-linecap="round"/>'
        # envolvente encima, con sus tiradores
        + fantasma('M22 112L44 40L82 66H196L286 112', k['gris2'], 2)
        + f'<path d="M22 112L60 26L96 58H196L286 112" fill="none" stroke="{k["coral"]}" stroke-width="3.5" stroke-linejoin="round"/>'
        + ''.join(f'<rect x="{x - 4}" y="{y - 4}" width="8" height="8" rx="2" fill="{k["sol"]}" '
                  f'stroke="{k["coral"]}" stroke-width="2"/>' for x, y in ((60, 26), (96, 58), (196, 58)))
        # panel del sintetizador
        + f'<rect x="0" y="126" width="320" height="74" fill="{k["navy"]}"/>'
        + f'<rect x="0" y="126" width="320" height="3" fill="#fff" opacity=".22"/>'
        # el filtro, como curva en su pantallita
        + f'<rect x="16" y="136" width="84" height="52" rx="5" fill="#0f2b42" stroke="{k["azul"]}" stroke-width="2"/>'
        + f'<path d="M24 180h68M24 180v-34" stroke="{k["gris"]}" stroke-width="1.5" opacity=".7"/>'
        + f'<path d="M24 166h30q8 0 12-18q4-14 10 26q4 10 12 12" fill="none" stroke="{k["menta"]}" stroke-width="3"/>'
        + fantasma('M66 144v40', k['coral'], 1.5)
        # mandos giratorios, uno recién girado
        + _ts_mando(136, 160, 18, -40)
        + _ts_mando(186, 160, 18, 25)
        + _ts_mando(236, 160, 18, 112, k['sol'], k['coral'])
        + f'<path d="M256 148a26 26 0 0 0-14-14" fill="none" stroke="{k["coral"]}" stroke-width="2.5"/>'
        + f'<path d="M256 148l1-9 7 5z" fill="{k["coral"]}"/>'
        + chispas(236, 136, k['sol'], 2)
        # fader de volumen
        + f'<rect x="282" y="138" width="10" height="48" rx="5" fill="#0f2b42"/>'
        + f'<rect x="276" y="150" width="22" height="10" rx="3" fill="{k["coral"]}"/>'
    )


@escena('videomapping')
def _videomapping():
    k = P
    return (
        f'<rect x="0" y="0" width="320" height="200" fill="#16283d"/>'
        + f'<path d="M0 150L320 134V200H0z" fill="#20394f"/>'
        + f'<path d="M0 150L320 134" stroke="#375a79" stroke-width="2"/>'
        # cono de luz del proyector
        + f'<path d="M68 104L300 38V172L68 118z" fill="{k["sol"]}" opacity=".1"/>'
        + f'<path d="M68 107L286 60V150L68 115z" fill="{k["sol"]}" opacity=".09"/>'
        # cajas apiladas en la penumbra, con la luz encajada en sus caras
        + f'<ellipse cx="200" cy="172" rx="120" ry="20" fill="{k["sol"]}" opacity=".07"/>'
        + sombra_bajo(212, 170, 62, 8, .3)
        + _ts_caja(176, 104, 70, 62, 22, 16, '#3b5d79', '#48708f', '#22374b')
        + f'<rect x="186" y="114" width="50" height="42" fill="none" stroke="{k["menta"]}" stroke-width="2.5"/>'
        + f'<rect x="196" y="124" width="30" height="22" fill="none" stroke="{k["menta"]}" stroke-width="2.5" opacity=".7"/>'
        + f'<circle cx="211" cy="135" r="7" fill="{k["coral"]}"/>'
        + _ts_caja(186, 64, 46, 40, 18, 12, '#3b5d79', '#48708f', '#22374b')
        + f'<circle cx="209" cy="84" r="13" fill="none" stroke="{k["sol"]}" stroke-width="3"/>'
        + f'<circle cx="209" cy="84" r="5" fill="{k["sol"]}"/>'
        + sombra_bajo(276, 170, 26, 5, .28)
        + _ts_caja(256, 126, 38, 40, 10, 9, '#2d4a64', '#3e6280', '#22374b')
        + f'<path d="M260 160l12-30M272 160l12-30M284 160l8-20" stroke="{k["turquesa"]}" stroke-width="3"/>'
        # esquinas de ajuste con sus tiradores, una todavía descolocada
        + fantasma('M172 98L252 94L254 172L176 168z', k['sol'], 2)
        + ''.join(f'<rect x="{x - 5}" y="{y - 5}" width="10" height="10" rx="2" fill="{k["papel"]}" '
                  f'stroke="{k["coral"]}" stroke-width="2"/>'
                  for x, y in ((172, 98), (252, 94), (254, 172), (176, 168)))
        + f'<path d="M258 86l12-10M270 76l-8 1M270 76l1 8" stroke="{k["coral"]}" stroke-width="2.5" fill="none"/>'
        # proyector
        + f'<rect x="30" y="86" width="28" height="7" rx="3" fill="#3d5163"/>'
        + f'<path d="M34 124l-8 26M58 124l8 26" stroke="#3d5163" stroke-width="4"/>'
        + f'<rect x="16" y="92" width="54" height="32" rx="7" fill="#5f7385"/>'
        + f'<circle cx="70" cy="110" r="14" fill="{k["sol"]}" opacity=".22"/>'
        + f'<circle cx="70" cy="110" r="9" fill="{k["cielo2"]}"/>'
        + f'<circle cx="70" cy="110" r="4.5" fill="{k["papel"]}"/>'
    )


@escena('robotica')
def _robotica():
    k = P
    linea = 'M14 184C56 184 70 162 112 154C154 146 172 130 216 126C254 122 282 128 306 124'
    arcos = ''
    for r in (14, 22, 30):
        arcos += (f'<path d="M{210 + r * 0.79:.0f} {119 - r * 0.62:.0f}A{r} {r} 0 0 1 '
                  f'{210 + r * 0.79:.0f} {119 + r * 0.62:.0f}" fill="none" stroke="{k["turquesa"]}" stroke-width="2.5"/>')
    return (
        pared('#e8eff4', 96)
        + f'<rect x="0" y="96" width="320" height="104" fill="#ded3bd"/>'
        + f'<rect x="0" y="90" width="320" height="8" fill="#c3b79c"/>'
        + f'<path d="M0 128h320M0 164h320" stroke="{k["gris2"]}" stroke-width="1.5" opacity=".4"/>'
        # base de carga al fondo
        + sombra_bajo(34, 97, 22, 4, .14)
        + f'<rect x="14" y="66" width="36" height="30" rx="4" fill="{k["gris2"]}"/>'
        + f'<rect x="50" y="74" width="8" height="5" fill="{k["gris"]}"/>'
        + f'<rect x="50" y="84" width="8" height="5" fill="{k["gris"]}"/>'
        + f'<circle cx="24" cy="76" r="3.5" fill="{k["verde"]}"/>'
        # línea negra pintada en el suelo y traza ya recorrida
        + f'<path d="{linea}" fill="none" stroke="{k["tinta"]}" stroke-width="11" stroke-linecap="round"/>'
        + fantasma('M14 184C56 184 70 162 112 154', k['turquesa'], 3.5)
        # obstáculo por delante, sobre la línea
        + sombra_bajo(268, 133, 24, 5, .18)
        + _ts_caja(250, 102, 36, 30, 10, 8, k['coral'], '#ef8b2a', '#a85300')
        # robot con ruedas
        + sombra_bajo(156, 160, 46, 7, .14)
        + f'<circle cx="132" cy="144" r="14" fill="{k["tinta"]}"/><circle cx="132" cy="144" r="6" fill="{k["gris2"]}"/>'
        + f'<circle cx="182" cy="144" r="14" fill="{k["tinta"]}"/><circle cx="182" cy="144" r="6" fill="{k["gris2"]}"/>'
        + f'<path d="M156 98v-14" stroke="{k["gris"]}" stroke-width="3"/><circle cx="156" cy="82" r="4.5" fill="{k["oro"]}"/>'
        + f'<rect x="118" y="98" width="76" height="42" rx="11" fill="{k["azul"]}"/>'
        + f'<rect x="118" y="98" width="76" height="9" rx="4.5" fill="#fff" opacity=".2"/>'
        + f'<circle cx="140" cy="118" r="7" fill="{k["papel"]}"/><circle cx="141" cy="118" r="3.2" fill="{k["tinta"]}"/>'
        + f'<circle cx="164" cy="118" r="7" fill="{k["papel"]}"/><circle cx="165" cy="118" r="3.2" fill="{k["tinta"]}"/>'
        + f'<path d="M104 118h-15M104 130h-11" stroke="{k["gris"]}" stroke-width="3" stroke-linecap="round"/>'
        # sensores mirando al suelo, con sus conos
        + f'<rect x="188" y="132" width="22" height="9" rx="2" fill="{k["gris"]}"/>'
        + f'<path d="M193 141l-11 20h21z" fill="{k["oro"]}" opacity=".45"/>'
        + f'<path d="M206 141l-7 18h20z" fill="{k["oro"]}" opacity=".45"/>'
        + f'<circle cx="193" cy="155" r="2.5" fill="{k["sol"]}"/><circle cx="208" cy="152" r="2.5" fill="{k["sol"]}"/>'
        + arcos
    )


@escena('videojuegos')
def _videojuegos():
    k = P
    return (
        f'<rect x="0" y="0" width="320" height="200" fill="#cfe7fb"/>'
        + f'<path d="M28 28h28v10h-28zM38 20h22v9h-22zM240 26h30v10h-30zM250 18h20v9h-20z" '
          f'fill="{k["papel"]}" opacity=".95"/>'
        + f'<path d="M0 152V132H36V116H72V136H116V108H160V128H208V118H252V140H296V128H320V200H0z" '
          f'fill="{k["hoja"]}" opacity=".4"/>'
        # suelo de baldosas
        + f'<rect x="0" y="168" width="320" height="32" fill="#8a6a45"/>'
        + f'<rect x="0" y="168" width="320" height="8" fill="{k["verde"]}"/>'
        + f'<path d="M32 176v24M96 176v24M160 176v24M224 176v24M288 176v24M0 188h320" '
          f'stroke="{k["tinta"]}" stroke-width="1.5" opacity=".2"/>'
        # dos plataformas flotantes
        + f'<rect x="56" y="126" width="66" height="16" rx="4" fill="#8a6a45"/>'
        + f'<rect x="56" y="126" width="66" height="5" rx="2.5" fill="{k["verde"]}"/>'
        + f'<rect x="184" y="96" width="72" height="16" rx="4" fill="#8a6a45"/>'
        + f'<rect x="184" y="96" width="72" height="5" rx="2.5" fill="{k["verde"]}"/>'
        # arco de salto punteado y personaje en el aire
        + fantasma('M104 122Q150 56 206 92', k['navy'], 2.5)
        + sombra_bajo(96, 124, 16, 3, .18)
        + f'<path d="M140 82h9v7h-9zM157 82h9v7h-9z" fill="#8a3f00"/>'
        + f'<rect x="138" y="52" width="30" height="31" rx="9" fill="{k["coral"]}"/>'
        + f'<circle cx="147" cy="65" r="5" fill="{k["papel"]}"/><circle cx="148" cy="65" r="2.6" fill="{k["tinta"]}"/>'
        + f'<circle cx="159" cy="65" r="5" fill="{k["papel"]}"/><circle cx="160" cy="65" r="2.6" fill="{k["tinta"]}"/>'
        + f'<path d="M147 74q6 5 12 0" fill="none" stroke="{k["tinta"]}" stroke-width="2" stroke-linecap="round"/>'
        + chispas(110, 116, k['sol'], 2)
        # monedas, una ya recogida
        + _ts_moneda(118, 100) + _ts_moneda(186, 66) + _ts_moneda(230, 82)
        + fantasma('M92 84a9 9 0 1 0 0.1 0', k['oro'], 2)
        # bandera de meta
        + f'<rect x="278" y="110" width="5" height="58" fill="{k["gris"]}"/>'
        + f'<circle cx="280" cy="108" r="4" fill="{k["oro"]}"/>'
        + f'<path d="M283 112L306 121L283 130z" fill="{k["turquesa"]}"/>'
        # enemigo sencillo caminando
        + f'<path d="M216 160h8v8h-8zM236 160h8v8h-8z" fill="{k["tinta"]}"/>'
        + f'<rect x="212" y="144" width="36" height="20" rx="10" fill="{k["violeta"]}"/>'
        + f'<circle cx="223" cy="152" r="4.5" fill="{k["papel"]}"/><circle cx="222" cy="152" r="2.3" fill="{k["tinta"]}"/>'
        + f'<circle cx="237" cy="152" r="4.5" fill="{k["papel"]}"/><circle cx="236" cy="152" r="2.3" fill="{k["tinta"]}"/>'
        + f'<path d="M254 148h11M254 157h8" stroke="{k["violeta"]}" stroke-width="2.5" opacity=".7" stroke-linecap="round"/>'
    )


# =============================================================================
# GRUPO «construir y probar»: moda-textil, arquitectura, modelado-3d,
# maquinas, circuitos, papiroflexia. Piezas propias prefijadas con _ .
# =============================================================================
import math as _math


def _engranaje(cx, cy, r, n=8, color=None, eje=None):
    """Rueda dentada de dientes trapeciales (solo la usa este grupo)."""
    c = color or P['oro']
    e = eje or P['tinta']
    p = []
    st = 2 * _math.pi / n
    for i in range(n):
        for f, rr in ((.02, r * .76), (.13, r), (.37, r), (.48, r * .76)):
            a = i * st + st * f
            p.append(f'{cx + rr * _math.cos(a):.0f},{cy + rr * _math.sin(a):.0f}')
    return (f'<polygon points="{" ".join(p)}" fill="{c}"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r * .36:.0f}" fill="#fff" opacity=".55"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r * .15:.0f}" fill="{e}"/>')


@escena('moda-textil')
def _moda_textil():
    k = P
    ac = '#c2185b'          # acento del estudio: fucsia del estampado

    def est(pts):           # estampado propio: rombo + punto, repetido
        r = ''.join(f'M{x} {y - 7} l6 7 -6 7 -6 -7z ' for x, y in pts)
        d = ''.join(f'M{x + 10} {y} a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0 ' for x, y in pts)
        return f'<path d="{r}" fill="{ac}"/><path d="{d}" fill="{k["turquesa"]}"/>'

    return (
        pared('#fdeef4')
        + mesa(148, k['madera2'])
        # muestras de color tendidas de un hilo
        + f'<path d="M14 26 q34 9 68 1" fill="none" stroke="{k["gris"]}" stroke-width="1.5"/>'
        + f'<rect x="18" y="28" width="18" height="28" rx="2" fill="{k["turquesa"]}"/>'
        + f'<rect x="40" y="31" width="18" height="28" rx="2" fill="{ac}"/>'
        + f'<rect x="62" y="29" width="18" height="28" rx="2" fill="{k["sol"]}"/>'
        # rollo de tela con el mismo estampado, cayendo hasta la mesa
        + sombra_bajo(262, 150, 32, 5)
        + f'<path d="M234 82 v60 q14 7 28 0 q14 -7 28 0 v-60z" fill="{k["papel2"]}" '
          f'stroke="{k["gris2"]}" stroke-width="1.5"/>'
        + est([(248, 102), (274, 102), (260, 126)])
        + f'<rect x="230" y="56" width="64" height="28" fill="{k["papel2"]}" stroke="{k["gris2"]}" stroke-width="1.5"/>'
        + est([(252, 70)])
        + f'<ellipse cx="230" cy="70" rx="7" ry="14" fill="{k["arena"]}" stroke="{k["gris2"]}" stroke-width="1.5"/>'
        + f'<ellipse cx="294" cy="70" rx="7" ry="14" fill="{k["arena"]}" stroke="{k["gris2"]}" stroke-width="1.5"/>'
        # percha y camiseta de frente, con el estampado ya dentro
        + f'<path d="M101 43 q-3 -13 7 -13 q8 0 8 8" fill="none" stroke="{k["gris"]}" stroke-width="3"/>'
        + f'<path d="M70 60 L101 43 L126 60" fill="none" stroke="{k["gris"]}" stroke-width="4" stroke-linejoin="round"/>'
        + f'<path d="M68 58 H126 L148 76 L138 94 L126 86 V136 H68 V86 L56 94 L46 76z" '
          f'fill="{k["papel"]}" stroke="{k["gris2"]}" stroke-width="2" stroke-linejoin="round"/>'
        + f'<path d="M84 58 q13 13 26 0" fill="#fdeef4" stroke="{k["gris2"]}" stroke-width="2"/>'
        + f'<path d="M68 128 H126" stroke="{ac}" stroke-width="2" opacity=".45"/>'
        + est([(84, 100), (110, 100), (97, 120)])
        # patrón de papel sobre la mesa: pieza recortada y costura punteada
        + hoja(48, 152, 116, 40, -3)
        + '<g transform="rotate(-3 106 172)">'
        + f'<path d="M58 188 q2 -26 30 -28 q36 -3 58 10 l-6 18z" fill="#fff" stroke="{k["navy"]}" '
          f'stroke-width="2.5" stroke-linejoin="round"/>'
        + fantasma('M66 186 q4 -20 26 -22 q30 -2 46 8', ac, 2)
        + f'<path d="M94 158 v7 M116 159 v7" stroke="{k["navy"]}" stroke-width="2"/>'
        + '</g>'
        # carrete e hilo enhebrado que sigue la costura
        + f'<rect x="196" y="158" width="26" height="30" fill="{ac}"/>'
        + f'<path d="M192 154 h34 v6 h-34z M192 186 h34 v6 h-34z" fill="{k["madera"]}"/>'
        + f'<path d="M196 168 q-16 5 -30 15" fill="none" stroke="{ac}" stroke-width="2.5"/>'
        + f'<path d="M190 166 l-30 13" stroke="{k["gris"]}" stroke-width="3.5" stroke-linecap="round"/>'
        + f'<path d="M190 166 l-8 3.5" stroke="{k["tinta"]}" stroke-width="3.5" stroke-linecap="round"/>'
        + chispas(180, 160, ac, 2)
    )


@escena('arquitectura')
def _arquitectura():
    k = P
    n = k['navy']
    rej = ''
    for i in range(1, 8):
        rej += f'M{10 + i * 24} 42 v146 '
    for j in range(1, 6):
        rej += f'M10 {42 + j * 24} h188 '
    tic = ''
    for i in range(9):
        tic += f'M{34 + i * 16} 179 v5 '
    return (
        pared('#e9f1f9', 152)
        + mesa(152, '#b8c9d8')
        # papel de plano sobre la mesa
        + f'<rect x="10" y="42" width="188" height="146" fill="#d9e8f7" stroke="{k["azul"]}" stroke-width="2"/>'
        + f'<path d="{rej}" stroke="#fff" stroke-width="1" opacity=".55" fill="none"/>'
        # planta: muros gruesos
        + f'<rect x="31.5" y="61.5" width="143" height="93" fill="#fff" opacity=".85" stroke="{n}" stroke-width="7"/>'
        + f'<path d="M97 58 h6 v32 h-6z M97 112 h6 v46 h-6z M103 109 h50 v6 h-50z M171 109 h7 v6 h-7z" fill="{n}"/>'
        # puertas: hoja abierta + arco de apertura
        + f'<path d="M100 112 H122 M153 112 V92" stroke="{n}" stroke-width="4"/>'
        + f'<path d="M100 90 A22 22 0 0 1 122 112 M153 92 A20 20 0 0 1 173 112" fill="none" '
          f'stroke="{n}" stroke-width="1.8"/>'
        # hueco de ventana en el muro
        + f'<rect x="56" y="151" width="30" height="7" fill="#eef5fb"/>'
        + f'<path d="M56 154.5 H86" stroke="{n}" stroke-width="1.5"/>'
        # muebles dentro de la planta
        + f'<rect x="112" y="68" width="30" height="36" rx="2" fill="{k["lila"]}" stroke="{k["violeta"]}" stroke-width="1.5"/>'
        + f'<rect x="114" y="70" width="26" height="9" rx="2" fill="#fff"/>'
        + f'<circle cx="62" cy="84" r="12" fill="{k["madera2"]}" stroke="{k["madera"]}" stroke-width="1.5"/>'
        + f'<rect x="44" y="120" width="48" height="24" rx="4" fill="{k["menta"]}" stroke="{k["turquesa"]}" stroke-width="1.5"/>'
        + f'<path d="M44 132 h48" stroke="{k["turquesa"]}" stroke-width="1.5"/>'
        # cotas con flechas
        + f'<path d="M28 168 H178 M28 158 v13 M178 158 v13 M18 58 V158 M12 58 h12 M12 158 h12" '
          f'stroke="{k["azul"]}" stroke-width="1.5" fill="none"/>'
        + f'<path d="M28 168 l8 -3.5 v7z M178 168 l-8 -3.5 v7z M18 58 l-3.5 8 h7z M18 158 l-3.5 -8 h7z" fill="{k["azul"]}"/>'
        # muro que falta: hueco punteado y el tabique bajando a su sitio
        + fantasma('M103 134 H153', n, 5)
        + '<g transform="rotate(-11 130 118)">'
        + f'<rect x="104" y="114" width="54" height="8" rx="2" fill="{k["coral"]}"/>'
        + f'<rect x="104" y="114" width="54" height="3" fill="#fff" opacity=".4"/></g>'
        + f'<path d="M146 124 v8 M146 134 l-4 -6 M146 134 l4 -6" stroke="{k["coral"]}" stroke-width="3" '
          f'stroke-linecap="round" fill="none"/>'
        + chispas(156, 140, k['coral'], 2)
        # escalímetro apoyado en el borde del plano
        + '<g transform="rotate(-5 108 184)">'
        + f'<rect x="28" y="178" width="152" height="12" rx="2" fill="{k["oro"]}"/>'
        + f'<rect x="28" y="178" width="152" height="4" fill="#fff" opacity=".35"/>'
        + f'<path d="{tic}" stroke="{k["tinta"]}" stroke-width="1.2" opacity=".6"/></g>'
        # la misma casa levantada en volumen, sobre la mesa
        + f'<path d="M180 62 L214 90 M180 156 L214 140" stroke="{k["gris"]}" stroke-width="1.5" '
          f'stroke-dasharray="4 4" fill="none"/>'
        + sombra_bajo(256, 146, 50, 7)
        + f'<path d="M216 92 h50 v48 h-50z" fill="{k["papel2"]}" stroke="{n}" stroke-width="2"/>'
        + f'<path d="M266 92 l26 -15 v48 l-26 15z" fill="{k["arena"]}" stroke="{n}" stroke-width="2"/>'
        + f'<path d="M216 92 L241 72 L266 92z" fill="{k["papel2"]}" stroke="{n}" stroke-width="2"/>'
        + f'<path d="M241 72 L267 57 L292 77 L266 92z" fill="{k["coral"]}" stroke="{n}" stroke-width="2"/>'
        + f'<rect x="224" y="116" width="14" height="24" fill="{k["madera"]}"/>'
        + f'<rect x="246" y="100" width="16" height="14" fill="{k["cielo2"]}" stroke="{n}" stroke-width="1.5"/>'
        + f'<path d="M254 100 v14 M246 107 h16" stroke="{n}" stroke-width="1.2"/>'
    )


@escena('modelado-3d')
def _modelado3d():
    k = P
    # Visor de modelado: una taza con asa, con volumen real y caras de distinta luz.
    return (
        f'<rect x="0" y="0" width="320" height="200" fill="#eef4fa"/>'
        + f'<rect x="0" y="0" width="320" height="86" fill="#dfeaf5"/>'
        # rejilla de suelo en perspectiva
        + ''.join(f'<path d="M{160 + (x - 4) * 16} 86 L{160 + (x - 4) * 74} 200" stroke="{k["gris2"]}" '
                  f'stroke-width="1.2" opacity=".55"/>' for x in range(9))
        + ''.join(f'<path d="M0 {96 + i * i * 4.2} H320" stroke="{k["gris2"]}" stroke-width="1.2" opacity=".5"/>'
                  for i in range(6))
        # barra de herramientas del visor
        + f'<rect x="10" y="12" width="26" height="92" rx="7" fill="#fff" stroke="{k["gris2"]}" stroke-width="1.5"/>'
        + ''.join(f'<rect x="16" y="{20 + n * 22}" width="14" height="14" rx="3" '
                  f'fill="{[k["violeta"], k["turquesa"], k["coral"]][n]}" opacity="{1 if n == 1 else .45}"/>' for n in range(3))
        + sombra_bajo(168, 172, 62, 10, .18)
        # taza: cuerpo con tres caras de luz distinta
        + f'<path d="M116 92 h96 l-10 68 a10 10 0 0 1 -10 9 h-56 a10 10 0 0 1 -10 -9z" fill="{k["azul"]}"/>'
        + f'<path d="M116 92 h48 l-4 77 h-28 a10 10 0 0 1 -10 -9z" fill="#2b74a6"/>'
        + f'<path d="M188 92 h24 l-10 68 a10 10 0 0 1 -10 9 h-10z" fill="{k["navy"]}"/>'
        # boca elíptica, con interior visible
        + f'<ellipse cx="164" cy="92" rx="48" ry="15" fill="#3f8cc0"/>'
        + f'<ellipse cx="164" cy="92" rx="38" ry="10" fill="{k["tinta"]}" opacity=".42"/>'
        # asa
        + f'<path d="M212 106 a30 26 0 0 1 0 44" fill="none" stroke="{k["azul"]}" stroke-width="15" stroke-linecap="round"/>'
        + f'<path d="M212 110 a24 20 0 0 1 0 36" fill="none" stroke="#3f8cc0" stroke-width="5" stroke-linecap="round"/>'
        # aristas y vértices seleccionados
        + f'<ellipse cx="164" cy="92" rx="48" ry="15" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/>'
        + ''.join(f'<rect x="{x - 4}" y="{y - 4}" width="8" height="8" fill="{k["oro"]}" stroke="{k["tinta"]}" '
                  f'stroke-width="1.2"/>' for x, y in [(116, 92), (212, 92), (164, 107), (164, 77)])
        # el asa nueva, todavía sin aplicar, en contorno punteado
        + fantasma('M116 106 a30 26 0 0 0 0 44', k['violeta'], 3)
        + chispas(110, 128, k['violeta'], 2)
        # ejes de manipulación
        + f'<path d="M164 172 h44" stroke="{k["rojo"]}" stroke-width="3.5"/><path d="M208 172 l10 -5 v10z" fill="{k["rojo"]}"/>'
        + f'<path d="M164 172 v-34" stroke="{k["verde"]}" stroke-width="3.5"/><path d="M164 138 l-5 10 h10z" fill="{k["verde"]}"/>'
        + f'<path d="M164 172 l-32 16" stroke="{k["azul"]}" stroke-width="3.5"/><path d="M132 188 l11 0 -5 -9z" fill="{k["azul"]}"/>'
        # cubo de vista
        + f'<g opacity=".95"><path d="M276 26 l18 -9 18 9 -18 9z" fill="{k["gris2"]}"/>'
          f'<path d="M276 26 v18 l18 9 v-18z" fill="{k["gris"]}"/>'
          f'<path d="M312 26 v18 l-18 9 v-18z" fill="{k["navy"]}" opacity=".75"/></g>'
    )


@escena('maquinas')
def _maquinas():
    k = P
    return (
        pared('#f8efdd', 152)
        + f'<rect x="0" y="16" width="320" height="12" fill="{k["madera"]}"/>'
        + f'<rect x="0" y="16" width="320" height="4" fill="#fff" opacity=".25"/>'
        + mesa(152, k['madera2'])
        # placa con el tren de engranajes
        + f'<rect x="20" y="46" width="152" height="90" rx="8" fill="{k["arena"]}" stroke="{k["madera"]}" stroke-width="3"/>'
        + _engranaje(64, 100, 30, 9, k['oro'])
        + _engranaje(108, 88, 20, 7, k['turquesa'])
        + _engranaje(136, 76, 13, 6, k['coral'])
        # sentido de giro
        + f'<path d="M42 78 a26 26 0 0 1 26 -10" fill="none" stroke="{k["violeta"]}" stroke-width="2.5"/>'
        + f'<path d="M68 68 l-9 -3 2 8z" fill="{k["violeta"]}"/>'
        + f'<path d="M126 56 a16 16 0 0 0 -18 6" fill="none" stroke="{k["violeta"]}" stroke-width="2.5"/>'
        + f'<path d="M108 62 l3 -8 -8 1z" fill="{k["violeta"]}"/>'
        # hueco del cuarto engranaje y la pieza que va a entrar
        + fantasma('M150 118 a18 18 0 1 0 0.1 0', k['gris'], 2.5)
        + _engranaje(196, 116, 15, 7, k['hoja'])
        + f'<path d="M176 116 H164 M164 116 l7 -4 v8z" fill="{k["verde"]}" stroke="{k["verde"]}" stroke-width="2.5"/>'
        + chispas(122, 78, k['oro'], 2)
        # polea con su cuerda y el peso colgando
        + f'<rect x="246" y="26" width="6" height="14" fill="{k["gris"]}"/>'
        + f'<circle cx="249" cy="54" r="16" fill="{k["gris2"]}" stroke="{k["gris"]}" stroke-width="3"/>'
        + f'<circle cx="249" cy="54" r="5" fill="{k["tinta"]}"/>'
        + f'<path d="M233 54 V96 M265 54 L284 142" stroke="{k["tinta"]}" stroke-width="2.5" fill="none"/>'
        + f'<path d="M276 142 h16 v10 h-16z" fill="{k["gris"]}"/>'
        + f'<path d="M227 98 a6 6 0 0 1 12 0" fill="none" stroke="{k["tinta"]}" stroke-width="2.5"/>'
        + f'<rect x="220" y="100" width="28" height="26" rx="3" fill="{k["navy"]}"/>'
        + f'<path d="M226 110 h16" stroke="#fff" stroke-width="2.5" opacity=".7"/>'
        # palanca sobre su punto de apoyo, con la carga en el extremo alto
        + f'<path d="M164 188 L188 188 L176 168z" fill="{k["madera"]}"/>'
        + '<g transform="rotate(9 176 172)">'
        + f'<rect x="110" y="168" width="132" height="9" rx="4" fill="{k["coral"]}"/></g>'
        + f'<rect x="106" y="142" width="26" height="20" rx="2" fill="{k["rojo"]}"/>'
        + f'<path d="M258 106 v18 M258 128 l-4 -7 M258 128 l4 -7 M242 158 v14 M242 176 l-4 -7 M242 176 l4 -7" '
          f'stroke="{k["violeta"]}" stroke-width="3" stroke-linecap="round" fill="none"/>'
    )


@escena('circuitos')
def _circuitos():
    k = P
    rej = ''
    for i in range(1, 13):
        rej += f'M{i * 26} 0 v200 '
    for j in range(1, 8):
        rej += f'M0 {j * 26} h320 '
    ray = ''
    for a in (-175, -150, -115, -80, -45, -10):
        c, s = _math.cos(_math.radians(a)), _math.sin(_math.radians(a))
        ray += f'M{252 + 24 * c:.0f} {54 + 24 * s:.0f} L{252 + 33 * c:.0f} {54 + 33 * s:.0f} '
    return (
        f'<rect x="0" y="0" width="320" height="200" fill="#e7eff7"/>'
        + f'<path d="{rej}" stroke="{k["gris2"]}" stroke-width="1" opacity=".55" fill="none"/>'
        # cableado en ángulos rectos
        + f'<path d="M44 150 V79 H120 M158 79 H240 M264 79 H286 V150 H180 M116 150 H44" fill="none" '
          f'stroke="{k["azul"]}" stroke-width="3.5" stroke-linejoin="miter"/>'
        # pila
        + f'<rect x="116" y="140" width="58" height="20" rx="2" fill="{k["oro"]}"/>'
        + f'<rect x="116" y="140" width="58" height="6" fill="#fff" opacity=".35"/>'
        + f'<rect x="174" y="146" width="6" height="8" fill="{k["gris"]}"/>'
        + f'<path d="M160 146 v8 M156 150 h8 M124 150 h8" stroke="{k["tinta"]}" stroke-width="2"/>'
        # interruptor cerrado
        + f'<circle cx="120" cy="79" r="4" fill="{k["tinta"]}"/><circle cx="158" cy="79" r="4" fill="{k["tinta"]}"/>'
        + f'<path d="M120 79 L157 73" stroke="{k["rojo"]}" stroke-width="5" stroke-linecap="round"/>'
        + f'<rect x="112" y="84" width="54" height="7" rx="3" fill="{k["gris"]}"/>'
        # resistencia con sus bandas
        + f'<rect x="278" y="100" width="16" height="32" rx="5" fill="{k["arena"]}" stroke="{k["madera"]}" stroke-width="1.5"/>'
        + f'<path d="M278 108 h16 M278 116 h16 M278 124 h16" stroke="{k["rojo"]}" stroke-width="3"/>'
        + f'<path d="M278 116 h16" stroke="{k["navy"]}" stroke-width="3"/>'
        # bombilla encendida
        + f'<path d="{ray}" stroke="{k["oro"]}" stroke-width="3" stroke-linecap="round" fill="none"/>'
        + f'<circle cx="252" cy="54" r="20" fill="{k["sol"]}" stroke="{k["oro"]}" stroke-width="2.5"/>'
        + f'<path d="M246 64 V52 l6 8 6 -8 v12" fill="none" stroke="{k["coral"]}" stroke-width="2.5"/>'
        + f'<rect x="240" y="72" width="24" height="14" rx="2" fill="{k["gris2"]}" stroke="{k["gris"]}" stroke-width="1.5"/>'
        + f'<path d="M240 77 h24 M240 82 h24" stroke="{k["gris"]}" stroke-width="1.2"/>'
        # chip ya soldado en la placa
        + f'<rect x="58" y="100" width="30" height="22" rx="2" fill="#2b3a45"/>'
        + f'<path d="M58 106 h-7 M58 116 h-7 M88 106 h7 M88 116 h7" stroke="{k["gris"]}" stroke-width="2.5"/>'
        + f'<circle cx="64" cy="106" r="2.5" fill="{k["gris2"]}"/>'
        # componente que baja a su hueco
        + fantasma('M148 120 h46 v16 h-46z', k['gris'], 2.5)
        + '<g transform="rotate(-13 172 102)">'
        + f'<rect x="150" y="94" width="42" height="16" rx="5" fill="{k["turquesa"]}"/>'
        + f'<path d="M156 94 v16 M170 94 v16" stroke="{k["menta"]}" stroke-width="3"/>'
        + f'<path d="M150 102 h-12 M192 102 h12" stroke="{k["gris"]}" stroke-width="2.5"/></g>'
        + f'<path d="M200 116 v10 M200 130 l-4 -7 M200 130 l4 -7" stroke="{k["coral"]}" stroke-width="3" '
          f'stroke-linecap="round" fill="none"/>'
        # puerta lógica en el rincón: dos entradas y una salida
        + f'<path d="M28 22 h16 a16 16 0 0 1 0 32 h-16z" fill="{k["violeta"]}"/>'
        + f'<path d="M14 30 h14 M14 46 h14 M60 38 h16" stroke="{k["navy"]}" stroke-width="2.5"/>'
        + f'<circle cx="14" cy="30" r="3" fill="{k["navy"]}"/><circle cx="14" cy="46" r="3" fill="{k["navy"]}"/>'
        + f'<circle cx="76" cy="38" r="3" fill="{k["navy"]}"/>'
    )


@escena('papiroflexia')
def _papiroflexia():
    k = P
    # icosaedro: caras visibles de papel de color, tono por orientación
    caras = [
        ('226,85 203,71 189,108', k['sol']),
        ('226,85 249,71 203,71', k['menta']),
        ('226,85 249,71 263,108', k['lila']),
        ('226,85 226,131 189,108', k['turquesa']),
        ('226,85 263,108 226,131', k['oro']),
        ('226,131 189,108 203,145', k['violeta']),
        ('263,108 249,145 226,131', k['coral']),
        ('249,145 226,131 203,145', k['rojo']),
    ]
    ico = ''.join(f'<polygon points="{p}" fill="{c}" stroke="#fff" stroke-width="1.5"/>' for p, c in caras)
    # red desplegada: tira de triángulos con sus pliegues
    val, mon = '', ''
    for i in range(6):
        x = 76 + i * 16
        if i % 2:
            mon += f'M{x} 190 L{x + 16} 162 '
        else:
            val += f'M{x} 162 L{x + 16} 190 '
    return (
        pared('#fbf1e2')
        + mesa(150, '#d9b98c')
        # papeles de color apoyados en la pared
        + hoja(14, 44, 54, 74, -7, k['menta'])
        + hoja(32, 38, 54, 74, 5, k['rosa'])
        # cartel con la leyenda de pliegues
        + hoja(112, 24, 76, 48, -2)
        + '<g transform="rotate(-2 150 48)">'
        + f'<path d="M120 40 h60" stroke="{k["turquesa"]}" stroke-width="2.5" stroke-dasharray="6 5"/>'
        + f'<path d="M120 56 h60" stroke="{k["coral"]}" stroke-width="2.5" stroke-dasharray="10 4 2 4"/>'
        + '</g>'
        # el poliedro, con volumen
        + '<g transform="translate(16 0)">' + sombra_bajo(226, 149, 34, 5) + ico + '</g>'
        # la red sobre la mesa, con pestañas de pegado
        + f'<path d="M82 162 L86 150 L102 150 L106 162z M146 162 L150 150 L166 150 L170 162z" '
          f'fill="{k["arena"]}" stroke="{k["gris2"]}" stroke-width="1.2"/>'
        + f'<polygon points="60,190 156,190 172,162 76,162" fill="#fff" stroke="{k["gris"]}" stroke-width="2"/>'
        + f'<path d="{val}" stroke="{k["turquesa"]}" stroke-width="2.2" stroke-dasharray="7 5" fill="none"/>'
        + f'<path d="{mon}" stroke="{k["coral"]}" stroke-width="2.2" stroke-dasharray="11 4 2 4" fill="none"/>'
        # el triángulo que se está plegando hacia su sitio
        + fantasma('M156 190 L172 162 L188 190z', k['gris'], 2.5)
        + f'<path d="M146 150 L178 142 L162 114z" fill="{k["rosa"]}" stroke="{k["gris"]}" stroke-width="1.8"/>'
        + f'<path d="M146 150 L170 128" stroke="{k["coral"]}" stroke-width="1.8" stroke-dasharray="8 4"/>'
        + f'<path d="M186 146 a30 30 0 0 1 -4 28" fill="none" stroke="{k["verde"]}" stroke-width="2.5"/>'
        + f'<path d="M182 178 l-5 -10 9 1z" fill="{k["verde"]}"/>'
        + chispas(180, 134, k['oro'], 2)
        # pila de papeles de color en la mesa
        + f'<path d="M256 182 h44 v7 h-44z" fill="{k["rosa"]}"/>'
        + f'<path d="M260 175 h42 v7 h-42z" fill="{k["menta"]}"/>'
        + f'<path d="M258 168 h43 v7 h-43z" fill="{k["sol"]}"/>'
    )


# =============================================================================
# GRUPO · PERFIL DE IMAGEN (diseño gráfico, pixel art, cómic, color,
# patrones, fotografía). Piezas propias con prefijo _img_.
# =============================================================================
# ---------------------------------------------------------------------------
# Piezas propias del grupo de imagen (prefijo _img_ para no chocar con nadie)
# ---------------------------------------------------------------------------


def _img_n(v):
    """Número compacto: 12 en vez de 12.0."""
    v = round(float(v), 1)
    return str(int(v)) if v == int(v) else str(v)


def _img_sprite(x, y, c, bm, cmap):
    """Mapa de bits por tramos horizontales: un solo path por color."""
    acc = {}
    for j, fila in enumerate(bm):
        i = 0
        while i < len(fila):
            ch = fila[i]
            if ch in cmap:
                k = i
                while k + 1 < len(fila) and fila[k + 1] == ch:
                    k += 1
                n = (k - i + 1) * c
                acc[ch] = acc.get(ch, '') + (f'M{_img_n(x + i * c)} {_img_n(y + j * c)}'
                                             f'h{_img_n(n)}v{_img_n(c)}h-{_img_n(n)}z')
                i = k + 1
            else:
                i += 1
    return ''.join(f'<path d="{d}" fill="{cmap[ch]}"/>' for ch, d in acc.items())


def _img_piezas(x, y, s, giro=0):
    """Trozos del motivo de la teselación, por color, para poder encadenarlos."""
    n = _img_n
    i, q, r = s * .13, s * .3, s * .1
    if giro:
        cu = (f'M{n(x + s)} {n(y)}l0 {n(q)}a{n(q)} {n(q)} 0 0 1 -{n(q)} -{n(q)}z'
              f'M{n(x)} {n(y + s)}l0 -{n(q)}a{n(q)} {n(q)} 0 0 1 {n(q)} {n(q)}z')
    else:
        cu = (f'M{n(x)} {n(y)}l{n(q)} 0a{n(q)} {n(q)} 0 0 1 -{n(q)} {n(q)}z'
              f'M{n(x + s)} {n(y + s)}l-{n(q)} 0a{n(q)} {n(q)} 0 0 1 {n(q)} -{n(q)}z')
    ro = (f'M{n(x + s / 2)} {n(y + i)}L{n(x + s - i)} {n(y + s / 2)}'
          f'L{n(x + s / 2)} {n(y + s - i)}L{n(x + i)} {n(y + s / 2)}z')
    pu = (f'M{n(x + s / 2 - r)} {n(y + s / 2)}a{n(r)} {n(r)} 0 1 0 {n(r * 2)} 0'
          f'a{n(r)} {n(r)} 0 1 0 -{n(r * 2)} 0z')
    return cu, ro, pu


def _img_motivo(x, y, s, giro=0):
    """El motivo completo, suelto."""
    cu, ro, pu = _img_piezas(x, y, s, giro)
    return (f'<path d="{cu}" fill="{P["oro"]}"/><path d="{ro}" fill="{P["turquesa"]}"/>'
            f'<path d="{pu}" fill="{P["coral"]}"/>')


def _img_tarta(cx, cy, r, a0, a1, color):
    """Sector de la rueda de color."""
    import math
    n = _img_n
    x0, y0 = cx + r * math.cos(math.radians(a0)), cy + r * math.sin(math.radians(a0))
    x1, y1 = cx + r * math.cos(math.radians(a1)), cy + r * math.sin(math.radians(a1))
    return (f'<path d="M{cx} {cy}L{n(x0)} {n(y0)}A{r} {r} 0 0 1 {n(x1)} {n(y1)}z" fill="{color}"/>')


def _img_bocadillo(x, y, w, h, tw, k, cola='izq'):
    """Bocadillo de cómic con dos líneas de texto simulado."""
    t = (f'M{x + 14} {y + h}l-4 10l14 -10z' if cola == 'izq'
         else f'M{x + w - 16} {y + h}l6 10l-16 -10z')
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{h / 2}" fill="#fff" '
            f'stroke="{k["tinta"]}" stroke-width="2"/>'
            f'<path d="{t}" fill="#fff" stroke="{k["tinta"]}" stroke-width="2"/>'
            f'<path d="M{x + 9} {y + h / 2 - 4}h{tw}M{x + 9} {y + h / 2 + 3}h{tw - 12}" '
            f'stroke="{k["gris"]}" stroke-width="2.5" stroke-linecap="round"/>')


# ---------------------------------------------------------------------------
# 1 · Diseño gráfico
# ---------------------------------------------------------------------------
@escena('diseno-grafico')
def _diseno_grafico():
    k = P
    fichas = ''
    for i, c in enumerate([k['rojo'], k['coral'], k['oro'], k['turquesa'], k['violeta']]):
        x, t = 188 + i * 23, f' transform="rotate({-12 + i * 6} {188 + i * 23 + 15} 52)"'
        fichas += (f'<rect{t} x="{x}" y="30" width="30" height="44" fill="{c}"/>'
                   f'<rect{t} x="{x}" y="62" width="30" height="12" fill="#fff" opacity=".92"/>')
    marcas = ''.join(f'M{196 + i * 10} 124v{12 if i % 5 == 0 else 7}' for i in range(1, 11))
    return (
        pared('#f1ebf8', 156)
        + mesa(156, '#d9c5ab')
        + sombra_bajo(98, 162, 78, 8, .12)
        # cartel a medio maquetar, con rejilla de composición
        + '<g transform="rotate(-3 96 90)">'
        + f'<rect x="26" y="20" width="140" height="140" fill="#fff" stroke="{k["gris2"]}" stroke-width="2"/>'
        + f'<path d="M60 26V154M96 26V154M132 26V154M32 96H160" stroke="{k["gris2"]}" stroke-width="1.5" stroke-dasharray="4 4"/>'
        # titular de dos líneas
        + f'<path d="M36 37.5h120M36 57.5h84" stroke="{k["navy"]}" stroke-width="15"/>'
        # imagen dentro del cartel
        + f'<rect x="36" y="72" width="120" height="40" fill="{k["cielo2"]}"/>'
        + f'<circle cx="52" cy="84" r="7" fill="{k["oro"]}"/>'
        + f'<path d="M36 112L60 90L78 104L100 82L156 112z" fill="{k["verde"]}" opacity=".85"/>'
        # cuerpo de texto
        + f'<path d="M36 124h56M36 134h48M36 144h38" stroke="{k["gris2"]}" stroke-width="5"/>'
        # hueco del bloque que se está recolocando
        + fantasma('M100 118h56v34h-56z', k['gris'], 2.5)
        # guías de alineación
        + f'<path d="M26 118H166M100 20V160" stroke="{k["coral"]}" stroke-width="1.5" stroke-dasharray="5 4" opacity=".75"/>'
        + '</g>'
        + fichas
        # regla con marcas
        + '<g transform="rotate(-5 252 133)">'
        + f'<rect x="196" y="124" width="112" height="18" rx="2" fill="{k["arena"]}" stroke="{k["madera"]}" stroke-width="1.5"/>'
        + f'<path d="{marcas}" stroke="{k["tinta"]}" stroke-width="1.5" opacity=".55"/></g>'
        # bloque de titular bajando a su hueco
        + sombra_bajo(130, 138, 17, 4, .1)
        + '<g transform="rotate(-11 186 100)">'
        + f'<rect x="158" y="88" width="56" height="24" rx="2" fill="{k["coral"]}"/>'
        + f'<path d="M164 96.5h44M164 104.5h28" stroke="#fff" stroke-width="5"/></g>'
        + f'<path d="M156 116l-14 12M142 128l1-8M142 128l8 0" stroke="{k["coral"]}" stroke-width="3" stroke-linecap="round" fill="none"/>'
        + chispas(154, 114, k['oro'], 2)
    )


# ---------------------------------------------------------------------------
# 2 · Pixel art
# ---------------------------------------------------------------------------
_IMG_GATO = [
    '....d.....d.....',
    '...dod...dod....',
    '...dooooooood...',
    '...doodoodood...',
    '...doooppoood...',
    '...dooooooood...',
    '....dooooood....',
    '....dooooood....',
    '....daaooaad....',
    '....dddddddd....',
    'ggggggggggg.....',
    'ggggggggggg.....',
]
_IMG_GATITO = ['.d..d.', 'dooood', 'd.oo.d']


@escena('pixel-art')
def _pixel_art():
    k = P
    cm = {'d': k['tinta'], 'o': k['coral'], 'p': k['rosa'], 'a': k['arena'], 'g': k['hoja']}
    rej = ''.join(f'M{28 + i * 9} 24V132' for i in range(1, 16))
    rej += ''.join(f'M28 {24 + j * 9}H172' for j in range(1, 12))
    tira = '<rect x="188" y="20" width="124" height="44" rx="4" fill="#20303c"/>'
    for i in range(3):
        fx = 191 + i * 41
        tira += (f'<rect x="{fx}" y="25" width="36" height="34" fill="#0f1a22"/>'
                 + _img_sprite(fx, 29 + i, 6, _IMG_GATITO, cm)
                 + f'<rect x="{fx + 5}" y="51" width="26" height="4" fill="{k["hoja"]}" opacity="{.9 - i * .25}"/>')
    pal = f'<g stroke="{k["gris"]}" stroke-width="1">'
    for i, c in enumerate([k['tinta'], k['coral'], k['rosa'], k['arena'],
                           k['hoja'], k['verde'], k['cielo'], '#fff']):
        pal += f'<rect x="{190 + (i % 4) * 25}" y="{80 + (i // 4) * 25}" width="21" height="21" fill="{c}"/>'
    pal += f'</g><rect x="213" y="78" width="25" height="25" fill="none" stroke="{k["oro"]}" stroke-width="3"/>'
    return (
        pared('#e9eff7', 150)
        + mesa(150, '#b4c0cc')
        + sombra_bajo(100, 156, 62, 6, .12)
        # tablero de trabajo sobre su pie
        + f'<path d="M86 138h28v16h-28zM60 152h80v8h-80z" fill="{k["gris"]}"/>'
        + f'<rect x="18" y="14" width="164" height="128" rx="6" fill="#20303c"/>'
        + f'<path d="{rej}" stroke="#4a6275" stroke-width="1" opacity=".85"/>'
        + _img_sprite(28, 24, 9, _IMG_GATO, cm)
        # esquina sin pintar, con la celda activa marcada
        + fantasma('M127 114h45v18h-45z', k['sol'], 2.5)
        + f'<rect x="127" y="114" width="9" height="9" fill="{k["hoja"]}" opacity=".4"/>'
        + f'<rect x="127" y="114" width="9" height="9" fill="none" stroke="{k["oro"]}" stroke-width="2.5"/>'
        + tira
        + pal
        # estilete pintando el píxel
        + '<g transform="rotate(-41 131 119)">'
        + f'<rect x="131" y="114" width="54" height="10" rx="5" fill="{k["turquesa"]}"/>'
        + f'<rect x="170" y="113" width="13" height="12" rx="3" fill="{k["gris2"]}"/>'
        + f'<path d="M131 114l-11 5l11 5z" fill="{k["tinta"]}"/></g>'
        + chispas(130, 118, k['oro'], 2)
    )


# ---------------------------------------------------------------------------
# 3 · Cómic y guion gráfico
# ---------------------------------------------------------------------------
@escena('comic')
def _comic():
    k = P
    # Página de cómic sobre la mesa: viñetas de tamaños distintos, con marco grueso.
    def vin(x, y, w, h):
        return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{k["papel"]}" '
                f'stroke="{k["tinta"]}" stroke-width="4"/>')
    return (
        pared('#fdf3ea')
        + mesa(160, k['madera2'])
        + f'<g transform="rotate(-3 132 92)">'
        # la página
        + f'<rect x="26" y="16" width="212" height="156" rx="2" fill="{k["papel"]}" stroke="{k["gris2"]}" stroke-width="2"/>'
        # viñeta 1: alguien mirando por la ventana, de espaldas (silueta)
        + vin(36, 26, 92, 58)
        + f'<rect x="40" y="30" width="84" height="50" fill="{k["cielo2"]}"/>'
        + f'<path d="M40 66 h84 v14 h-84z" fill="{k["hoja"]}"/>'
        + f'<circle cx="106" cy="44" r="9" fill="{k["sol"]}"/>'
        + f'<path d="M58 80 c0 -18 8 -28 18 -28 c10 0 18 10 18 28z" fill="{k["violeta"]}"/>'
        + f'<circle cx="76" cy="46" r="9" fill="{k["violeta"]}"/>'
        + f'<path d="M48 34 h34 a6 6 0 0 1 6 6 v9 a6 6 0 0 1 -6 6 h-22 l-8 7 v-7 h-4 a6 6 0 0 1 -6 -6 v-9 '
          f'a6 6 0 0 1 6 -6z" fill="{k["papel"]}" stroke="{k["tinta"]}" stroke-width="2"/>'
        + f'<path d="M54 42 h20 M54 47 h14" stroke="{k["gris"]}" stroke-width="2.4" stroke-linecap="round"/>'
        # viñeta 2: primer plano, vertical
        + vin(134, 26, 96, 58)
        + f'<rect x="138" y="30" width="88" height="50" fill="{k["sol"]}" opacity=".5"/>'
        + f'<circle cx="182" cy="62" r="22" fill="{k["rosa"]}"/>'
        + f'<circle cx="174" cy="58" r="3.4" fill="{k["tinta"]}"/><circle cx="191" cy="58" r="3.4" fill="{k["tinta"]}"/>'
        + f'<path d="M172 70 q10 8 20 0" fill="none" stroke="{k["tinta"]}" stroke-width="2.6" stroke-linecap="round"/>'
        + f'<path d="M160 36 l8 -8 M204 36 l-8 -8" stroke="{k["coral"]}" stroke-width="3" stroke-linecap="round"/>'
        # viñeta 3: banda ancha de paisaje
        + vin(36, 90, 194, 48)
        + f'<rect x="40" y="94" width="186" height="40" fill="{k["cielo2"]}"/>'
        + f'<path d="M40 122 q40 -22 84 -4 q46 18 102 -8 v24 h-186z" fill="{k["hoja"]}"/>'
        + f'<path d="M156 118 l14 -18 14 18z" fill="{k["gris"]}"/>'
        + f'<path d="M64 124 v-12 M60 112 h8" stroke="{k["verde"]}" stroke-width="3"/>'
        + f'<path d="M196 100 h24 a5 5 0 0 1 5 5 v8 a5 5 0 0 1 -5 5 h-10 l-9 7 v-7 h-5 a5 5 0 0 1 -5 -5 v-8 '
          f'a5 5 0 0 1 5 -5z" fill="{k["papel"]}" stroke="{k["tinta"]}" stroke-width="2"/>'
        + f'<path d="M202 107 h14 M202 112 h9" stroke="{k["gris"]}" stroke-width="2.2" stroke-linecap="round"/>'
        # viñeta 4: la que falta, vacía y punteada
        + f'<rect x="36" y="144" width="194" height="24" fill="{k["papel2"]}" stroke="{k["gris"]}" '
          f'stroke-width="3" stroke-dasharray="7 5"/>'
        + '</g>'
        # guion gráfico al lado, con tres miniaturas
        + f'<rect x="248" y="34" width="60" height="112" rx="3" fill="{k["papel"]}" stroke="{k["gris2"]}" stroke-width="2"/>'
        + ''.join(f'<rect x="256" y="{42 + n * 34}" width="44" height="24" fill="{k["papel2"]}" '
                  f'stroke="{k["gris"]}" stroke-width="1.6"/>'
                  f'<path d="M260 {60 + n * 34} h12 M260 {64 + n * 34} h22" stroke="{k["gris2"]}" stroke-width="2"/>'
                  for n in range(3))
        # rotulador apoyado, señalando la viñeta vacía
        + f'<g transform="rotate(-24 196 176)"><rect x="176" y="170" width="56" height="10" rx="3" fill="{k["tinta"]}"/>'
          f'<rect x="176" y="170" width="56" height="3" rx="1.5" fill="#fff" opacity=".28"/>'
          f'<path d="M176 170 l-12 5 l12 5z" fill="{k["gris2"]}"/></g>'
    )


@escena('color')
def _color():
    k = P
    cx, cy, r = 86, 92, 52
    hues = [k['rojo'], k['coral'], k['oro'], k['sol'], k['hoja'], k['verde'],
            k['turquesa'], k['menta'], k['cielo'], k['azul'], k['violeta'], k['lila']]
    rueda = ''.join(_img_tarta(cx, cy, r, -90 + i * 30, -60 + i * 30, c) for i, c in enumerate(hues))
    ys = [18 + i * 22 for i in range(5)]
    pal = ''.join(f'<rect x="164" y="{y}" width="40" height="18" fill="{c}"/>' for y, c in
                  zip(ys, [k['navy'], k['turquesa'], k['oro'], k['coral'], k['rosa']]))
    pal += ('<path d="' + ''.join(f'M208 {y}h26v18h-26z' for y in ys) + '" fill="#fff"/><path d="'
            + ''.join(f'M212 {y + 9}h{18 - i * 2}' for i, y in enumerate(ys))
            + f'" stroke="{k["tinta"]}" stroke-width="6" opacity=".8"/>')
    sx, sy = 107, 62
    return (
        pared('#f6f0fa', 152)
        + mesa(152, '#d4bfa0')
        + sombra_bajo(86, 152, 54, 7, .12)
        # rueda de color
        + rueda
        + f'<circle cx="{cx}" cy="{cy}" r="19" fill="#fff" stroke="{k["gris2"]}" stroke-width="1.5"/>'
        + f'<path d="M{cx} {cy}L{sx} {sy}" stroke="{k["tinta"]}" stroke-width="2" opacity=".5"/>'
        # selector marcado sobre la rueda
        + f'<circle cx="{sx}" cy="{sy}" r="10" fill="none" stroke="#fff" stroke-width="4"/>'
        + f'<circle cx="{sx}" cy="{sy}" r="10" fill="none" stroke="{k["tinta"]}" stroke-width="1.5"/>'
        + f'<path d="M{sx - 15} {sy}h7M{sx + 8} {sy}h7M{sx} {sy - 15}v7M{sx} {sy + 8}v7" stroke="{k["tinta"]}" stroke-width="2"/>'
        # paleta en formación, con etiquetas de contraste
        + pal
        # el color viaja del selector al hueco de la sexta muestra
        + f'<path d="M116 76q18 36 38 48" fill="none" stroke="{k["oro"]}" stroke-width="2.5" stroke-dasharray="5 5"/>'
        + fantasma('M164 128h40v18h-40z', k['coral'], 2.5)
        + f'<path d="M156 118c5 7 8 10 8 14a8 8 0 0 1 -16 0c0-4 3-7 8-14z" fill="{k["oro"]}"/>'
        # escena de ejemplo pintada con esa paleta
        + f'<rect x="240" y="18" width="72" height="64" fill="{k["cielo2"]}" stroke="{k["gris2"]}" stroke-width="1.5"/>'
        + f'<circle cx="298" cy="30" r="8" fill="{k["oro"]}"/>'
        + f'<rect x="240" y="66" width="72" height="16" fill="{k["hoja"]}"/>'
        + f'<rect x="252" y="46" width="28" height="20" fill="{k["papel2"]}" stroke="{k["navy"]}" stroke-width="1.5"/>'
        + f'<path d="M247 46l19-14l19 14z" fill="{k["coral"]}"/>'
        + f'<rect x="262" y="54" width="8" height="12" fill="{k["navy"]}"/>'
        + f'<rect x="292" y="54" width="5" height="12" fill="{k["madera"]}"/>'
        + f'<ellipse cx="294.5" cy="50" rx="11" ry="10" fill="{k["turquesa"]}"/>'
        # cuentagotas tomando color de la rueda
        + f'<g transform="rotate(-35 {sx} {sy})">'
        + f'<rect x="{sx}" y="{sy - 5}" width="46" height="10" rx="5" fill="{k["gris2"]}"/>'
        + f'<ellipse cx="{sx + 52}" cy="{sy}" rx="10" ry="9" fill="{k["lila"]}"/>'
        + f'<rect x="{sx + 20}" y="{sy - 5}" width="14" height="10" fill="{k["oro"]}"/>'
        + f'<path d="M{sx} {sy - 5}l-12 5l12 5z" fill="{k["tinta"]}"/></g>'
        + chispas(sx - 4, sy + 4, k['oro'], 2)
        + sombra_bajo(272, 148, 20, 5, .16)
        + taza(258, 124, k['turquesa'])
    )


# ---------------------------------------------------------------------------
# 5 · Patrones y arte generativo
# ---------------------------------------------------------------------------
@escena('patrones')
def _patrones():
    k = P
    px, py, c = 18, 20, 44
    cu = ro = pu = ''
    for j in range(3):
        for i in range(4):
            if i == 3 and j == 2:
                continue
            a, b, d = _img_piezas(px + i * c, py + j * c, c, 90 if (i + j) % 2 else 0)
            cu += a
            ro += b
            pu += d
    return (
        pared('#e7e0f5', 152)
        + mesa(152, '#c4a882')
        # lienzo del mosaico
        + f'<rect x="{px}" y="{py}" width="176" height="132" fill="{k["papel2"]}" stroke="{k["gris2"]}" stroke-width="1.5"/>'
        + f'<path d="{cu}" fill="{k["oro"]}"/><path d="{ro}" fill="{k["turquesa"]}"/>'
        + f'<path d="{pu}" fill="{k["coral"]}"/>'
        + f'<path d="M62 20V152M106 20V152M150 20V152M18 64H194M18 108H194" stroke="{k["gris"]}" stroke-width="1" opacity=".35"/>'
        # celda fundamental marcada
        + f'<rect x="62" y="20" width="44" height="44" fill="none" stroke="{k["violeta"]}" stroke-width="3"/>'
        + f'<g fill="{k["violeta"]}"><rect x="58" y="16" width="8" height="8"/>'
        + f'<rect x="102" y="16" width="8" height="8"/><rect x="58" y="60" width="8" height="8"/>'
        + f'<rect x="102" y="60" width="8" height="8"/></g>'
        # la celda que falta: solo van puestos los cuartos de disco
        + f'<path d="{_img_piezas(150, 108, c, 90)[0]}" fill="{k["oro"]}"/>'
        + fantasma('M150 108h44v44h-44z', k['coral'], 2.5)
        + fantasma('M172 114L188 130L172 146L156 130z', k['turquesa'], 2)
        # el motivo suelto, grande, que genera todo lo demás
        + f'<rect x="212" y="26" width="96" height="96" fill="#fff" stroke="{k["gris2"]}" stroke-width="2"/>'
        + _img_motivo(218, 32, 84)
        # de la pieza a la repetición
        + f'<path d="M210 106q-12 10 -20 20" fill="none" stroke="{k["navy"]}" stroke-width="3" stroke-linecap="round"/>'
        + f'<path d="M186 132l11-5l-2 11z" fill="{k["navy"]}"/>'
        + chispas(196, 116, k['oro'], 2)
    )


# ---------------------------------------------------------------------------
# 6 · Fotografía y composición
# ---------------------------------------------------------------------------
@escena('fotografia')
def _fotografia():
    k = P
    alturas = [10, 18, 27, 38, 52, 62, 56, 44, 33, 24, 15, 8]
    barras = ''.join(f'<rect x="{231 + i * 6}" y="{104 - h}" width="5" height="{h}"/>'
                     for i, h in enumerate(alturas))
    return (
        pared('#e7eef4', 154)
        + mesa(154, '#a89681')
        + sombra_bajo(114, 158, 90, 8, .14)
        # fotografía apoyada, con su paisaje dentro
        + '<g transform="rotate(-2 116 86)">'
        + f'<rect x="22" y="24" width="188" height="124" fill="#fff" stroke="{k["gris2"]}" stroke-width="1.5"/>'
        + f'<rect x="30" y="32" width="172" height="58" fill="{k["cielo"]}"/>'
        + f'<circle cx="150" cy="62" r="11" fill="{k["sol"]}"/>'
        + f'<path d="M30 90L70 60L98 80L130 56L202 90z" fill="{k["verde"]}"/>'
        + f'<rect x="30" y="90" width="172" height="50" fill="{k["hoja"]}"/>'
        + f'<path d="M30 112q44-10 86 0q44 10 86 0v28h-172z" fill="{k["azul"]}" opacity=".5"/>'
        + f'<rect x="56" y="96" width="7" height="30" fill="{k["madera"]}"/>'
        + f'<ellipse cx="59.5" cy="92" rx="17" ry="15" fill="{k["verde"]}"/>'
        # zonas fuera del recorte
        + f'<path d="M30 32h172v108h-172zM54 48h116v70h-116z" fill-rule="evenodd" '
          f'fill="{k["tinta"]}" opacity=".32"/>'
        # rejilla de tercios y marco de recorte
        + f'<g stroke="#fff"><path d="M93 48V118M132 48V118M54 71H170M54 95H170" stroke-width="1.2" opacity=".75"/>'
        + f'<rect x="54" y="48" width="116" height="70" fill="none" stroke-width="2.5"/></g>'
        + fantasma('M38 38h150v94h-150z', k['sol'], 2)
        + f'<path d="M50 44h9v9h-9zM165 44h9v9h-9zM50 113h9v9h-9zM165 113h9v9h-9z" fill="#fff" '
          f'stroke="{k["tinta"]}" stroke-width="1.5"/>'
        + '</g>'
        + chispas(174, 120, k['oro'], 2)
        # histograma
        + f'<rect x="222" y="34" width="86" height="80" rx="4" fill="#fff" stroke="{k["gris2"]}" stroke-width="1.5"/>'
        + f'<g fill="{k["navy"]}">{barras}</g>'
        + f'<path d="M228 104h76" stroke="{k["gris"]}" stroke-width="2"/>'
        + f'<path d="M228 42h30" stroke="{k["gris2"]}" stroke-width="3"/>'
        # cámara sobre la mesa
        + sombra_bajo(266, 156, 36, 6, .16)
        + f'<path d="M237 124h60a5 5 0 0 1 5 5v18a5 5 0 0 1-5 5h-60a5 5 0 0 1-5-5v-18a5 5 0 0 1 5-5z'
          f'M238 118h18v8h-18z" fill="{k["tinta"]}"/>'
        + f'<circle cx="262" cy="138" r="12" fill="{k["gris"]}"/>'
        + f'<circle cx="262" cy="138" r="6.5" fill="{k["azul"]}"/>'
        + f'<circle cx="294" cy="130" r="4" fill="{k["coral"]}"/>'
    )


# =============================================================================
# GRUPO «documento y conocimiento»: escritura con restricciones, mundos,
# lenguas inventadas, juegos de mesa, ideas e inventos, simulaciones.
# Piezas propias del grupo, con nombre prefijado para no chocar con nadie.
# =============================================================================
import re as _dk_re


def _dk_num(d):
    """Recorta decimales largos en un atributo d para no engordar el SVG."""
    return _dk_re.sub(r'\d+\.\d{2,}', lambda m: f'{float(m.group(0)):.1f}', d)


def _dk_lineas(x, y, w, n, gap=10, color=None, gw=2.4, corta=.6, op=.5):
    """Renglones simulados: texto sin letras, en un solo path."""
    d = ''
    for i in range(n):
        ww = w if i < n - 1 else w * corta
        d += f'M{x} {y + i * gap} h{ww} '
    return (f'<path d="{_dk_num(d)}" stroke="{color or P["gris"]}" stroke-width="{gw}" '
            f'stroke-linecap="round" opacity="{op}"/>')


def _dk_rejilla(x, y, cols, rows, cw, ch=None, color=None, gw=1.6, op=.7):
    ch = ch or cw
    d = ''.join(f'M{x + i * cw} {y} v{rows * ch} ' for i in range(cols + 1))
    d += ''.join(f'M{x} {y + j * ch} h{cols * cw} ' for j in range(rows + 1))
    return f'<path d="{d}" fill="none" stroke="{color or P["gris2"]}" stroke-width="{gw}" opacity="{op}"/>'


def _dk_celdas(cells, x, y, cw, ch=None, color=None, m=2.4):
    """Celdas rellenas de una rejilla (autómata, calendario), en un solo path."""
    ch = ch or cw
    w = cw - 2 * m
    h = ch - 2 * m
    d = ''.join(f'M{x + c * cw + m} {y + r * ch + m} h{w} v{h} h{-w}z ' for c, r in cells)
    return f'<path d="{_dk_num(d)}" fill="{color or P["turquesa"]}"/>'


def _dk_puntos(pts, r=2.6, color=None, op=1):
    d = ''.join(f'M{x - r} {y} a{r} {r} 0 1 0 {2 * r} 0 a{r} {r} 0 1 0 {-2 * r} 0 ' for x, y in pts)
    return f'<path d="{_dk_num(d)}" fill="{color or P["tinta"]}" opacity="{op}"/>'


def _dk_pluma(x, y, largo=52, rot=-34, cuerpo=None):
    """Pluma. Sin girar, la punta cae en (x-15, y+5): se apoya donde se escribe."""
    c = cuerpo or P['navy']
    return (f'<g transform="rotate({rot} {x} {y})">'
            f'<rect x="{x}" y="{y}" width="{largo}" height="10" rx="5" fill="{c}"/>'
            f'<rect x="{x}" y="{y}" width="{largo}" height="3" rx="1.5" fill="#fff" opacity=".3"/>'
            f'<rect x="{x + largo - 15}" y="{y}" width="8" height="10" fill="{P["oro"]}"/>'
            f'<path d="M{x} {y} l-15 5 l15 5z" fill="{P["gris2"]}"/>'
            f'<path d="M{x - 15} {y + 5} l9 -2.6 v5.2z" fill="{P["tinta"]}"/></g>')


def _dk_nota(x, y, w, h, rot=0, color=None, n=3):
    """Nota adhesiva con renglones y la esquina doblada."""
    c = color or P['sol']
    t = f' transform="rotate({rot} {x + w / 2} {y + h / 2})"' if rot else ''
    return (f'<g{t}><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="{c}"/>'
            f'<path d="M{x + w - 11} {y + h} l11 -11 v11z" fill="{P["tinta"]}" opacity=".2"/>'
            + _dk_lineas(x + 8, y + 13, w - 19, n, 10, P['tinta'], 2.3, .6, .55) + '</g>')


def _dk_pin(x, y, color=None, r=5.4):
    """Marcador de mapa en forma de gota. La punta queda en (x, y)."""
    return f'<path d="M{x} {y} l{-r} {-r * 1.7} a{r} {r} 0 1 1 {2 * r} 0z" fill="{color or P["rojo"]}"/>'


def _dk_gota(x, y, r=.7):
    """Punto grueso para los signos: sale del mismo trazo."""
    return f'M{x - r} {y} a{r} {r} 0 1 0 {2 * r} 0 a{r} {r} 0 1 0 {-2 * r} 0'


# Alfabeto inventado: doce signos geométricos propios, todos distintos entre sí.
_DK_SIGNOS = [
    lambda x, y, s: f'M{x - s} {y - s} h{2 * s} v{2 * s} h{-2 * s}z M{x} {y - s * .3} v{s * .9}',
    lambda x, y, s: f'M{x} {y - s} L{x + s} {y + s} L{x - s} {y + s}z ' + _dk_gota(x, y + s * .35),
    lambda x, y, s: f'M{x - s} {y} L{x} {y - s} L{x + s} {y} L{x} {y + s}z ' + _dk_gota(x, y),
    lambda x, y, s: (f'M{x - s} {y - s * .6} L{x} {y + s * .1} L{x + s} {y - s * .6} '
                     f'M{x - s} {y + s * .4} L{x} {y + s} L{x + s} {y + s * .4}'),
    lambda x, y, s: f'M{x - s} {y - s} h{2 * s} L{x} {y + s}z M{x - s * .7} {y - s * .2} h{s * 1.4}',
    lambda x, y, s: f'M{x} {y - s} a{s} {s} 0 1 0 .1 0 M{x - s} {y} h{2 * s}',
    lambda x, y, s: f'M{x - s} {y - s} h{2 * s} v{2 * s} h{-2 * s}z M{x - s} {y - s} l{2 * s} {2 * s}',
    lambda x, y, s: (f'M{x - s} {y - s * .7} h{2 * s} M{x - s * .7} {y} h{s * 1.4} '
                     f'M{x - s * .35} {y + s * .7} h{s * .7}'),
    lambda x, y, s: f'M{x - s} {y + s} v{-s * .4} a{s} {s} 0 0 1 {2 * s} 0 v{s * .4}',
    lambda x, y, s: f'M{x - s} {y + s} v{-s} h{s} v{-s} h{s}',
    lambda x, y, s: f'M{x - s * .5} {y - s} h{s} l{s * .5} {s} l{-s * .5} {s} h{-s} l{-s * .5} {-s}z',
    lambda x, y, s: (f'M{x} {y - s} a{s * .55} {s * .55} 0 1 0 .1 0 M{x} {y + s * .1} v{s * .9} '
                     f'M{x - s * .6} {y + s} h{s * 1.2}'),
]


def _dk_signos(items, s=7, color=None, gw=2.6, op=1):
    """items: (indice, cx, cy). Todos los signos van en un solo path."""
    d = ' '.join(_DK_SIGNOS[i % len(_DK_SIGNOS)](x, y, s) for i, x, y in items)
    return (f'<path d="{_dk_num(d)}" fill="none" stroke="{color or P["tinta"]}" stroke-width="{gw}" '
            f'stroke-linecap="round" stroke-linejoin="round" opacity="{op}"/>')


@escena('escritura-restricciones')
def _escritura_restricciones():
    k = P
    return (
        pared('#f8f1e0', 150)
        # estante con libros: el cuarto donde se escribe
        + f'<rect x="18" y="20" width="12" height="26" fill="{k["coral"]}"/>'
        + f'<rect x="32" y="24" width="9" height="22" fill="{k["turquesa"]}"/>'
        + f'<rect x="43" y="18" width="14" height="28" fill="{k["violeta"]}"/>'
        + f'<rect x="14" y="46" width="100" height="6" rx="2" fill="{k["madera"]}"/>'
        + mesa(150, '#c08a55')
        # cuaderno abierto, con el texto ya empezado y revisado
        + sombra_bajo(132, 158, 100, 8, .15)
        + f'<rect x="30" y="56" width="204" height="100" rx="3" fill="{k["papel"]}" stroke="{k["gris2"]}" stroke-width="2"/>'
        + f'<rect x="128" y="56" width="4" height="100" fill="{k["gris2"]}" opacity=".55"/>'
        + f'<path d="M124 70 a7 7 0 0 1 14 0 M124 88 a7 7 0 0 1 14 0 M124 106 a7 7 0 0 1 14 0 '
          f'M124 124 a7 7 0 0 1 14 0 M124 142 a7 7 0 0 1 14 0" fill="none" stroke="{k["gris"]}" stroke-width="2.6"/>'
        + _dk_lineas(40, 72, 74, 7, 12, k['tinta'], 2.5, .6, .6)
        # huecos de las palabras que faltan y marcas de revisión
        + f'<path d="M66 90 h26 v12 h-26z M48 126 h22 v12 h-22z" fill="{k["papel"]}"/>'
        + f'<path d="M66 100 h26 M48 136 h22" stroke="{k["coral"]}" stroke-width="2.6" stroke-dasharray="5 4"/>'
        + f'<ellipse cx="92" cy="84" rx="20" ry="8" fill="none" stroke="{k["rojo"]}" stroke-width="2"/>'
        + f'<path d="M44 108 h50" stroke="{k["rojo"]}" stroke-width="2.6"/>'
        + f'<path d="M60 126 l5 -7 l5 7" fill="none" stroke="{k["rojo"]}" stroke-width="2.4" stroke-linejoin="round"/>'
        # página derecha: la frase se corta a media línea
        + _dk_lineas(140, 72, 66, 4, 12, k['tinta'], 2.5, .6, .6)
        + fantasma('M140 122 h58', k['gris2'], 2.4)
        # la regla de la restricción, clavada en la pared
        + f'<rect x="244" y="16" width="68" height="76" rx="5" fill="{k["papel"]}" stroke="{k["navy"]}" stroke-width="2.5"/>'
        + _dk_lineas(254, 26, 48, 2, 8, k['navy'], 2.2, .55, .5)
        + f'<circle cx="278" cy="50" r="17" fill="{k["sol"]}" stroke="{k["navy"]}" stroke-width="2.5"/>'
        + f'<text x="278" y="59" font-family="system-ui,sans-serif" font-size="24" font-weight="700" '
          f'fill="{k["navy"]}" text-anchor="middle">e</text>'
        + f'<path d="M264 64 L292 36" stroke="{k["rojo"]}" stroke-width="3.5" stroke-linecap="round"/>'
        + f'<path d="M252 78 h9 v9 h-9z M264 78 h9 v9 h-9z M276 78 h9 v9 h-9z M288 78 h9 v9 h-9z" '
          f'fill="none" stroke="{k["navy"]}" stroke-width="1.8"/>'
        + f'<path d="M252 78 h9 v9 h-9z M264 78 h9 v9 h-9z" fill="{k["turquesa"]}"/>'
        + f'<circle cx="278" cy="12" r="4.5" fill="{k["coral"]}"/>'
        # el intento anterior, arrugado sobre la mesa
        + sombra_bajo(272, 184, 18, 4, .18)
        + f'<path d="M256 178 l4 -11 l10 -5 l10 6 l2 10 l-9 6 l-13 -2z" fill="{k["papel2"]}" '
          f'stroke="{k["gris2"]}" stroke-width="1.8" stroke-linejoin="round"/>'
        # pluma apoyada justo donde se ha parado la frase
        + _dk_pluma(195, 116, 50, 42, k['navy'])
        + chispas(188, 100, k['oro'], 2)
    )


@escena('mundos')
def _mundos():
    k = P
    return (
        f'<rect x="0" y="0" width="320" height="200" fill="#dae7f1"/>'
        + mesa(168, '#8f6a44')
        # mapa del mundo inventado, extendido sobre la mesa
        + sombra_bajo(126, 170, 104, 8, .16)
        + '<g transform="rotate(-2 126 94)">'
        + f'<rect x="24" y="24" width="204" height="140" rx="2" fill="#f3e3c0" stroke="{k["madera"]}" stroke-width="2"/>'
        + f'<rect x="30" y="30" width="192" height="128" fill="#cfe6ef"/>'
        + f'<path d="M40 136 q6 -4 12 0 q6 4 12 0 M40 146 q6 -4 12 0 q6 4 12 0 M192 44 q6 -4 12 0 q6 4 12 0" '
          f'fill="none" stroke="{k["papel"]}" stroke-width="2" opacity=".8"/>'
        + f'<path d="M72 66 q26 -18 54 -8 q30 -12 52 12 q16 22 0 38 q10 22 -20 30 q-26 12 -52 0 '
          f'q-30 -4 -34 -30 q-8 -24 0 -42z" fill="#d7dfa6" stroke="#4b7a3a" stroke-width="2.6"/>'
        + f'<path d="M96 98 l15 -24 l15 24z M119 100 l11 -17 l11 17z" fill="#8d8474"/>'
        + f'<path d="M105 83 l6 -9 l6 9 l-6 -3z M126 88 l4 -5 l4 5 l-4 -2z" fill="{k["papel"]}"/>'
        + f'<path d="M124 98 q-6 20 -18 26 q-10 6 -8 18" fill="none" stroke="{k["cielo"]}" stroke-width="3.2"/>'
        + f'<path d="M78 124 l6 -12 l6 12z M90 128 l6 -12 l6 12z M100 121 l6 -12 l6 12z" fill="{k["verde"]}"/>'
        + _dk_pin(154, 72, k['rojo']) + _dk_pin(176, 122, k['violeta']) + _dk_pin(108, 134, k['turquesa'])
        + f'<path d="M160 66 h20 M182 116 h14 M114 128 h18" stroke="{k["tinta"]}" stroke-width="2" opacity=".45"/>'
        + f'<path d="M202 152 l4 -16 l4 16 l-4 -5z" fill="{k["navy"]}"/>'
        + '</g>'
        # fichas del mundo, unidas al mapa por hilos finos
        + f'<path d="M196 58 L242 42 M200 106 L242 96 M178 146 L242 146" stroke="{k["gris"]}" stroke-width="1.4" opacity=".8"/>'
        + f'<rect x="242" y="22" width="70" height="44" rx="5" fill="{k["papel"]}" stroke="{k["gris2"]}" stroke-width="2"/>'
        + f'<ellipse cx="262" cy="46" rx="14" ry="11" fill="{k["violeta"]}"/>'
        + f'<path d="M252 37 l-3 -8 l7 4 M272 37 l3 -8 l-7 4" fill="{k["violeta"]}"/>'
        + f'<circle cx="266" cy="43" r="4" fill="{k["papel"]}"/><circle cx="267" cy="43" r="2" fill="{k["tinta"]}"/>'
        + f'<rect x="242" y="76" width="70" height="42" rx="5" fill="{k["papel"]}" stroke="{k["gris2"]}" stroke-width="2"/>'
        + f'<rect x="252" y="84" width="3.5" height="28" fill="{k["madera"]}"/>'
        + f'<path d="M255 86 h26 l-6 7 l6 7 h-26z" fill="{k["turquesa"]}"/>'
        + f'<path d="M264 90 l4 4 l-4 4 l-4 -4z" fill="{k["sol"]}"/>'
        + f'<path d="M282 40 h24 M282 49 h14 M288 92 h20 M288 101 h12" stroke="{k["tinta"]}" '
          f'stroke-width="2.2" stroke-linecap="round" opacity=".45"/>'
        + f'<rect x="242" y="126" width="70" height="42" rx="5" fill="{k["papel"]}" stroke="{k["gris2"]}" stroke-width="2"/>'
        + f'<rect x="242" y="126" width="70" height="11" rx="5" fill="{k["coral"]}"/>'
        + _dk_celdas([(2, 1)], 248, 140, 15, 9, k['sol'], 1.4)
        + _dk_rejilla(248, 140, 4, 3, 15, 9, k['gris2'], 1.4, .8)
        # marcador nuevo bajando a su hueco
        + fantasma('M135 114 a9 9 0 1 1 18 0 a9 9 0 1 1 -18 0', k['gris'], 2.4)
        + '<g transform="rotate(-14 144 98)">' + _dk_pin(144, 98, k['oro'], 6.4) + '</g>'
        + chispas(158, 90, k['oro'], 2)
    )


@escena('lenguas-inventadas')
def _lenguas_inventadas():
    k = P
    return (
        pared('#efeafb', 152)
        + mesa(152, '#bfa47f')
        # hoja con el alfabeto propio, signo a signo
        + sombra_bajo(112, 156, 88, 7, .14)
        + '<g transform="rotate(-2 112 88)">'
        + f'<rect x="22" y="26" width="180" height="124" rx="2" fill="{k["papel"]}" stroke="{k["gris2"]}" stroke-width="2"/>'
        + _dk_lineas(32, 36, 60, 2, 8, k['violeta'], 2.4, .5, .6)
        + _dk_rejilla(32, 48, 4, 3, 38, 30, k['gris2'], 1.8, .9)
        + _dk_signos([(0, 51, 63), (1, 89, 63), (2, 127, 63), (3, 165, 63),
                      (4, 51, 93), (5, 89, 93), (6, 127, 93), (7, 165, 93),
                      (8, 51, 123), (9, 89, 123), (10, 127, 123)], 9, k['tinta'], 2.6)
        + fantasma('M148 110 h34 v26 h-34z', k['violeta'], 2.2)
        + f'<path d="M158 130 v-8 h8" fill="none" stroke="{k["violeta"]}" stroke-width="2.6" stroke-linecap="round"/>'
        + '</g>'
        # una frase escrita con esos signos, con su glosa debajo
        + f'<rect x="206" y="26" width="104" height="60" rx="4" fill="{k["papel2"]}" stroke="{k["gris2"]}" stroke-width="2"/>'
        + _dk_signos([(9, 224, 44), (2, 250, 44), (11, 276, 44), (3, 298, 44)], 7, k['navy'], 2.4)
        + f'<path d="M212 58 h94" stroke="{k["gris2"]}" stroke-width="1.6"/>'
        + _dk_lineas(214, 66, 88, 2, 10, k['gris'], 2.4, .55, .6)
        # tabla de sonidos, a medio rellenar
        + f'<rect x="206" y="94" width="104" height="56" rx="4" fill="{k["papel"]}" stroke="{k["navy"]}" stroke-width="2.2"/>'
        + _dk_celdas([(1, 1)], 214, 104, 26, 14, k['menta'], 1.2)
        + _dk_rejilla(214, 104, 3, 3, 26, 14, k['gris2'], 1.5, .9)
        + _dk_signos([(2, 227, 111), (6, 253, 111), (9, 279, 111), (5, 227, 125), (1, 253, 125),
                      (8, 227, 139)], 4.4, k['tinta'], 1.9, .85)
        # tintero y pluma trazando el signo que falta
        + f'<path d="M30 172 h30 v16 a6 6 0 0 1 -6 6 h-18 a6 6 0 0 1 -6 -6z" fill="{k["turquesa"]}"/>'
        + f'<rect x="36" y="166" width="18" height="7" rx="2" fill="{k["navy"]}"/>'
        + _dk_pluma(158, 138, 48, 135, k['violeta'])
        + chispas(186, 112, k['oro'], 2)
    )


@escena('juegos-de-mesa')
def _juegos_de_mesa():
    k = P
    return (
        f'<rect x="0" y="0" width="320" height="200" fill="#5d9a74"/>'
        + f'<rect x="0" y="0" width="320" height="28" fill="#e9f0e6"/>'
        + f'<rect x="0" y="28" width="320" height="4" fill="{k["tinta"]}" opacity=".14"/>'
        + mesa(182, '#8a6440')
        # tablero de recorrido, con la partida ya empezada
        + sombra_bajo(116, 176, 94, 7, .2)
        + f'<rect x="20" y="38" width="192" height="136" rx="9" fill="#f6ecd5" stroke="#8a5f3a" stroke-width="3.5"/>'
        + f'<path d="M44 158h110q20 0 20-20v-24q0-20-20-20h-80q-20 0-20-20v-16" '
          f'fill="none" stroke="#e3d2ab" stroke-width="23" stroke-linecap="round"/>'
        + f'<path d="M44 158h110q20 0 20-20v-24q0-20-20-20h-80q-20 0-20-20v-16" '
          f'fill="none" stroke="#a9784f" stroke-width="23" stroke-dasharray="2 20" opacity=".55"/>'
        + _dk_puntos([(66, 158), (84, 158), (92, 158), (104, 158), (110, 158), (116, 158)], 1.9, k['tinta'], .7)
        # salida, casilla especial, casilla de flecha y meta
        + f'<circle cx="44" cy="158" r="9.5" fill="{k["menta"]}"/>'
        + f'<path d="M174 130 l3.5 -9 l3.5 9 l9 1 -7 6 2 9 -7.5 -5 -7.5 5 2 -9 -7 -6z" fill="{k["oro"]}"/>'
        + f'<path d="M84 94 l12 0 M92 89 l6 5 -6 5" fill="none" stroke="{k["coral"]}" stroke-width="3" '
          f'stroke-linecap="round" stroke-linejoin="round"/>'
        + f'<circle cx="54" cy="58" r="10" fill="{k["sol"]}"/>'
        + f'<rect x="53" y="42" width="3" height="18" fill="{k["tinta"]}"/>'
        + f'<path d="M56 42 h16 l-4 6 l4 6 h-16z" fill="{k["rojo"]}"/>'
        # fichas de dos colores sobre el recorrido
        + _dk_puntos([(44, 158), (120, 94), (152, 94)], 8.6, k['tinta'], .28)
        + _dk_puntos([(44, 156)], 7.4, k['coral'])
        + _dk_puntos([(120, 92), (152, 92)], 7.4, k['azul'])
        # mazo: dos cartas asomando, con su título y su icono
        + f'<rect x="236" y="42" width="60" height="76" rx="6" fill="{k["violeta"]}" stroke="{k["navy"]}" stroke-width="2.5"/>'
        + '<g transform="rotate(9 262 76)">'
        + f'<rect x="242" y="34" width="60" height="76" rx="6" fill="{k["papel"]}" stroke="{k["navy"]}" stroke-width="2.5"/>'
        + _dk_lineas(250, 44, 44, 2, 8, k['navy'], 2.4, .6, .65)
        + f'<path d="M272 62 l18 8 v16 q0 12 -18 18 q-18 -6 -18 -18 v-16z" fill="{k["turquesa"]}"/>'
        + f'<path d="M272 72 l6 6 l-6 8 l-6 -8z" fill="{k["sol"]}"/>'
        + '</g>'
        # dado recién tirado
        + sombra_bajo(258, 170, 20, 5, .22)
        + '<g transform="rotate(-8 258 148)">'
        + f'<rect x="240" y="130" width="36" height="36" rx="7" fill="{k["papel"]}" stroke="{k["gris2"]}" stroke-width="2"/>'
        + _dk_puntos([(249, 139), (267, 139), (258, 148), (249, 157), (267, 157)], 3.2, k['tinta'])
        + '</g>'
        + chispas(232, 134, k['oro'], 2)
        # ficha a medio mover, con su casilla marcada
        + fantasma('M123 158 a9 9 0 1 1 18 0 a9 9 0 1 1 -18 0', k['navy'], 2.4)
        + sombra_bajo(132, 158, 8, 3, .25)
        + _dk_puntos([(132, 144)], 8, k['coral'])
        + f'<path d="M132 138 a5 5 0 0 1 5 -3" fill="none" stroke="{k["papel"]}" stroke-width="2" opacity=".7"/>'
    )


@escena('ideas')
def _ideas():
    k = P
    return (
        pared('#f2ead9', 200)
        # tablero de corcho
        + f'<rect x="12" y="12" width="216" height="164" rx="6" fill="#d9b286" stroke="#8a5f3a" stroke-width="4"/>'
        + _dk_puntos([(40, 92), (70, 60), (100, 160), (150, 40), (196, 96), (214, 152), (58, 168), (176, 168)],
                     1.8, '#8a5f3a', .3)
        # hilos y flechas del mapa mental (por detrás de las notas)
        + f'<path d="M84 52 L112 44 M78 70 L126 96 M74 132 L122 122 M150 66 L154 90" fill="none" '
          f'stroke="{k["tinta"]}" stroke-width="2" opacity=".45"/>'
        + f'<path d="M112 44 l-9 -1 l3 6z M126 96 l-10 -2 l2 7z M122 122 l-9 3 l-1 -7z M154 90 l-6 -7 l9 -1z" '
          f'fill="{k["tinta"]}" opacity=".55"/>'
        + _dk_nota(26, 30, 58, 46, -4, k['sol'], 3)
        + _dk_nota(108, 22, 54, 42, 4, k['menta'], 3)
        + _dk_nota(24, 112, 56, 44, 3, k['rosa'], 3)
        + f'<circle cx="135" cy="27" r="4.5" fill="{k["coral"]}"/>'
        # la nota destacada: la idea con su boceto rápido
        + '<g transform="rotate(-2 145 119)">'
        + f'<rect x="104" y="86" width="82" height="66" rx="2" fill="{k["lila"]}" stroke="{k["violeta"]}" stroke-width="2.5"/>'
        + _dk_lineas(112, 96, 60, 1, 10, k['tinta'], 2.4, 1, .55)
        + f'<rect x="120" y="110" width="34" height="22" rx="3" fill="none" stroke="{k["tinta"]}" stroke-width="2.4"/>'
        + f'<path d="M124 138 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 M144 138 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 '
          f'M154 116 h10 M164 116 v-8 M160 104 h10 M137 110 v-9 M129 98 q8 -6 16 0" fill="none" '
          f'stroke="{k["tinta"]}" stroke-width="2.2" stroke-linecap="round"/>'
        + '</g>'
        # nota nueva entrando en su hueco
        + fantasma('M172 26 h46 v42 h-46z', k['tinta'], 2.4)
        + sombra_bajo(212, 146, 24, 5, .18)
        + _dk_nota(186, 100, 50, 42, -10, k['cielo2'], 3)
        + chispas(238, 94, k['oro'], 2)
        # ficha del invento, con sus casillas marcadas
        + f'<rect x="244" y="28" width="68" height="112" rx="5" fill="{k["papel"]}" stroke="{k["navy"]}" stroke-width="2.5"/>'
        + f'<path d="M244 33 a5 5 0 0 1 5 -5 h58 a5 5 0 0 1 5 5 v9 h-68z" fill="{k["coral"]}"/>'
        + f'<path d="M252 52 h10 v10 h-10z M252 70 h10 v10 h-10z M252 88 h10 v10 h-10z M252 106 h10 v10 h-10z '
          f'M252 124 h10 v10 h-10z" fill="none" stroke="{k["navy"]}" stroke-width="1.8"/>'
        + f'<path d="M253 57 l3.5 4 l6 -8 M253 75 l3.5 4 l6 -8 M253 111 l3.5 4 l6 -8" fill="none" '
          f'stroke="{k["verde"]}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'
        + _dk_lineas(268, 57, 36, 5, 18, k['tinta'], 2.4, .7, .45)
    )


@escena('simulaciones')
def _simulaciones():
    k = P
    return (
        f'<rect x="0" y="0" width="320" height="200" fill="#e6f1f1"/>'
        + _dk_rejilla(0, 0, 16, 9, 20, 20, '#cadedd', 1, .85)
        + mesa(168, '#a9804f')
        # autómata: la rejilla con sus células vivas
        + f'<rect x="16" y="26" width="136" height="124" rx="5" fill="{k["papel"]}" stroke="{k["navy"]}" stroke-width="2.5"/>'
        + _dk_celdas([(1, 0), (2, 1), (0, 2), (1, 2), (2, 2)], 22, 32, 18, 18, k['turquesa'])
        + _dk_celdas([(4, 4), (5, 4), (6, 4)], 22, 32, 18, 18, k['violeta'])
        + _dk_rejilla(22, 32, 7, 6, 18, 18, k['gris2'], 1.4, .8)
        + f'<path d="M26 145 l5 -4 l-5 -4 M36 145 l5 -4 l-5 -4" fill="none" stroke="{k["gris"]}" stroke-width="2"/>'
        + _dk_lineas(48, 141, 40, 1, 8, k['gris'], 2.4, 1, .6)
        # una célula bajando a su hueco
        + fantasma('M112 50 h18 v18 h-18z', k['coral'], 2.4)
        + sombra_bajo(121, 66, 9, 3, .2)
        + '<g transform="rotate(-12 122 28)">'
        + f'<rect x="112" y="18" width="20" height="20" rx="2" fill="{k["turquesa"]}"/>'
        + f'<rect x="112" y="18" width="20" height="5" rx="2" fill="{k["papel"]}" opacity=".4"/>'
        + '</g>'
        + chispas(138, 22, k['oro'], 2)
        # gráfico de las dos poblaciones, subiendo y bajando
        + f'<rect x="164" y="52" width="142" height="98" rx="5" fill="{k["papel"]}" stroke="{k["navy"]}" stroke-width="2.5"/>'
        + _dk_rejilla(176, 62, 6, 4, 20, 18, '#d8e6ee', 1.2, .9)
        + f'<path d="M176 62 v76 h120" fill="none" stroke="{k["tinta"]}" stroke-width="2.4" stroke-linecap="round"/>'
        + f'<path d="M230 62 v76" stroke="{k["gris"]}" stroke-width="1.6" stroke-dasharray="4 4"/>'
        + f'<path d="M176 118 C188 76 200 74 212 108 C224 136 236 132 248 100 C260 70 272 72 284 104 '
          f'C289 117 292 122 296 126" fill="none" stroke="{k["verde"]}" stroke-width="3" stroke-linecap="round"/>'
        + f'<path d="M176 94 C188 122 200 130 212 118 C224 100 236 82 248 92 C260 104 272 124 284 116 '
          f'C289 111 293 104 296 98" fill="none" stroke="{k["coral"]}" stroke-width="3" stroke-linecap="round"/>'
        + f'<circle cx="230" cy="107" r="4.4" fill="{k["sol"]}" stroke="{k["tinta"]}" stroke-width="2"/>'
        + f'<rect x="194" y="141" width="9" height="7" rx="1.5" fill="{k["verde"]}"/>'
        + f'<rect x="240" y="141" width="9" height="7" rx="1.5" fill="{k["coral"]}"/>'
        + f'<path d="M207 145 h22 M253 145 h22" stroke="{k["gris"]}" stroke-width="2.4" opacity=".6"/>'
        # mandos de los parámetros, sobre la mesa
        + f'<circle cx="74" cy="182" r="12" fill="{k["papel2"]}" stroke="{k["navy"]}" stroke-width="2.5"/>'
        + f'<path d="M74 182 L81 174 M60 176 h4 M88 176 h4" fill="none" stroke="{k["navy"]}" '
          f'stroke-width="2.4" stroke-linecap="round"/>'
        + f'<path d="M196 184 h90" stroke="{k["gris2"]}" stroke-width="6" stroke-linecap="round"/>'
        + f'<path d="M212 176 v4 M240 176 v4 M268 176 v4" stroke="{k["gris"]}" stroke-width="2" opacity=".7"/>'
        + f'<circle cx="248" cy="184" r="8" fill="{k["coral"]}" stroke="{k["papel"]}" stroke-width="2"/>'
    )


# =============================================================================
# VARIANTES DE INFANCIA (R54): cuando la persona elige «Contenido para…
# Infancia», estos nueve estudios entraban por convención técnica (rejilla,
# osciloscopio, cotas, tablas) o por objetos demasiado pequeños. Aquí se cuentan
# con menos piezas y más grandes, color cálido y la actividad lo más literal
# posible. Mismas reglas: 320 × 200, tres planos, algo a medio hacer, sin manos.
# =============================================================================
S_CHILD = {}


def escena_child(slug):
    def deco(fn):
        S_CHILD[slug] = fn
        return fn
    return deco


import math as _ch_math


def _ch_estrella_d(cx, cy, r):
    """Contorno de estrella de cinco puntas."""
    pts = []
    for i in range(10):
        a = _ch_math.radians(-90 + i * 36)
        rr = r if i % 2 == 0 else r * .46
        pts.append(f'{cx + rr * _ch_math.cos(a):.0f} {cy + rr * _ch_math.sin(a):.0f}')
    return f'M{"L".join(pts)}z'


def _ch_estrella(cx, cy, r, color, borde=None, gw=3):
    """Estrella de cinco puntas, de una pieza."""
    b = f' stroke="{borde}" stroke-width="{gw}" stroke-linejoin="round"' if borde else ''
    return f'<path d="{_ch_estrella_d(cx, cy, r)}" fill="{color}"{b}/>'


def _ch_sol(cx, cy, r, color=None, rayo=None, n=8):
    """Sol grande con sus rayos: el objeto más reconocible que hay."""
    d = ''
    for i in range(n):
        a = _ch_math.radians(i * (360 / n))
        co, si = _ch_math.cos(a), _ch_math.sin(a)
        d += (f'M{cx + (r + 5) * co:.0f} {cy + (r + 5) * si:.0f}'
              f'L{cx + (r + 14) * co:.0f} {cy + (r + 14) * si:.0f}')
    return (f'<path d="{d}" stroke="{rayo or P["oro"]}" stroke-width="5" stroke-linecap="round"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{color or P["sol"]}" '
            f'stroke="{rayo or P["oro"]}" stroke-width="3"/>')


def _ch_lapiz_gordo(x, y, largo=70, rot=-30, cuerpo=None):
    """Lápiz de cuerpo alto: se lee como lápiz aunque la tarjeta sea pequeña."""
    c = cuerpo or P['coral']
    return (f'<g transform="rotate({rot} {x} {y})">'
            f'<rect x="{x}" y="{y}" width="{largo}" height="18" rx="4" fill="{c}"/>'
            f'<rect x="{x}" y="{y + 3}" width="{largo}" height="5" fill="#fff" opacity=".35"/>'
            f'<path d="M{x} {y} l-20 9 l20 9z" fill="{P["arena"]}"/>'
            f'<path d="M{x - 12} {y + 4.6} l-8 4.4 l8 4.4z" fill="{P["tinta"]}"/>'
            f'<rect x="{x + largo - 15}" y="{y}" width="15" height="18" rx="4" fill="{P["rosa"]}"/></g>')


def _ch_casita(x, y, w, h, k, tejado=None, muro=None):
    """Casa en volumen: cuerpo, tejado a dos aguas, puerta y dos ventanas."""
    t = tejado or k['coral']
    m = muro or k['arena']
    b = k['madera']
    cx = x + w / 2
    px = x + w / 2 - 17
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{m}" stroke="{b}" stroke-width="3"/>'
            f'<path d="M{x - 9} {y}L{cx} {y - 46}L{x + w + 9} {y}z" fill="{t}" stroke="{b}" stroke-width="3"/>'
            f'<rect x="{px}" y="{y + h - 42}" width="34" height="42" fill="{b}"/>'
            f'<circle cx="{px + 27}" cy="{y + h - 21}" r="3.6" fill="{k["sol"]}"/>')


def _ch_ventanuca(x, y, w, h, k):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{k["cielo2"]}" '
            f'stroke="{k["madera"]}" stroke-width="3"/>'
            f'<path d="M{x + w / 2} {y}v{h}M{x} {y + h / 2}h{w}" stroke="{k["madera"]}" stroke-width="2.5"/>')


def _ch_arbol(cx, suelo, k, alto=44, r=26):
    return (f'<rect x="{cx - 9}" y="{suelo - alto}" width="18" height="{alto}" fill="{k["madera"]}"/>'
            f'<circle cx="{cx - 17}" cy="{suelo - alto - 10}" r="{r - 9}" fill="{k["verde"]}"/>'
            f'<circle cx="{cx + 15}" cy="{suelo - alto - 8}" r="{r - 10}" fill="{k["verde"]}"/>'
            f'<circle cx="{cx}" cy="{suelo - alto - 20}" r="{r}" fill="{k["hoja"]}"/>')


@escena_child('circuitos')
def _c_circuitos():
    k = P
    ray = ''
    for a in (-178, -142, -106, -70, -34, 2):
        c, s = _ch_math.cos(_ch_math.radians(a)), _ch_math.sin(_ch_math.radians(a))
        ray += (f'M{252 + 38 * c:.0f} {62 + 38 * s:.0f}L{252 + 51 * c:.0f} {62 + 51 * s:.0f}')
    return (
        pared('#ffeec9', 152)
        + ventana(16, 14, 70, 50)
        + mesa(152, '#d79a52')
        # bombilla enorme encendida, con su halo y sus rayos
        + f'<circle cx="252" cy="62" r="44" fill="{k["sol"]}" opacity=".45"/>'
        + f'<path d="{ray}" stroke="{k["coral"]}" stroke-width="6" stroke-linecap="round" fill="none"/>'
        + f'<circle cx="252" cy="62" r="32" fill="{k["sol"]}" stroke="{k["oro"]}" stroke-width="4"/>'
        + f'<path d="M238 70q7-18 14 0q7 18 14 0" fill="none" stroke="{k["coral"]}" stroke-width="5" '
          f'stroke-linecap="round"/>'
        + f'<rect x="236" y="92" width="32" height="20" rx="5" fill="{k["gris2"]}" stroke="{k["gris"]}" stroke-width="2.5"/>'
        # pila grande, apoyada en la mesa
        + sombra_bajo(68, 158, 48, 7, .16)
        + f'<rect x="22" y="112" width="88" height="44" rx="5" fill="{k["oro"]}" stroke="{k["coral"]}" stroke-width="3"/>'
        + f'<rect x="22" y="116" width="88" height="9" rx="4" fill="#fff" opacity=".35"/>'
        + f'<rect x="110" y="124" width="12" height="18" rx="2" fill="{k["gris2"]}" stroke="{k["gris"]}" stroke-width="2"/>'
        + f'<path d="M94 134h16M102 126v16M34 134h16" stroke="{k["tinta"]}" stroke-width="4" stroke-linecap="round"/>'
        # cable grueso de color y un interruptor de palanca bien claro
        + f'<path d="M122 133h16M198 133h18" stroke="{k["turquesa"]}" stroke-width="9" stroke-linecap="round"/>'
        + f'<path d="M252 112v8" stroke="{k["turquesa"]}" stroke-width="9" stroke-linecap="round"/>'
        + f'<rect x="138" y="124" width="60" height="24" rx="7" fill="{k["navy"]}"/>'
        + f'<circle cx="152" cy="124" r="5" fill="{k["sol"]}"/><circle cx="184" cy="124" r="5" fill="{k["sol"]}"/>'
        + f'<path d="M152 124L185 104" stroke="{k["rojo"]}" stroke-width="9" stroke-linecap="round"/>'
        + f'<circle cx="187" cy="102" r="9" fill="{k["coral"]}" stroke="{k["rojo"]}" stroke-width="2.5"/>'
        # el último tramo de cable todavía no está: sube a su hueco
        + fantasma('M216 133h36v-13', k['gris'], 4)
        + '<g transform="rotate(-14 258 176)">'
        + f'<rect x="234" y="170" width="48" height="12" rx="6" fill="{k["turquesa"]}"/>'
        + f'<rect x="234" y="172" width="48" height="3.5" rx="1.75" fill="#fff" opacity=".4"/></g>'
        + f'<path d="M258 164v-12M258 148l-5 8M258 148l5 8" stroke="{k["coral"]}" stroke-width="3.5" '
          f'stroke-linecap="round" fill="none"/>'
        + chispas(226, 122, k['oro'], 2)
    )


@escena_child('arquitectura')
def _c_arquitectura():
    k = P
    return (
        '<rect width="320" height="200" fill="#ffe7c0"/>'
        + _ch_sol(44, 40, 19)
        + f'<path d="M0 146q62-16 124-4q74 14 196-8v66H0z" fill="{k["hoja"]}"/>'
        + f'<path d="M0 162q70-10 150 2q80 12 170-6" fill="none" stroke="{k["verde"]}" stroke-width="3" opacity=".5"/>'
        # la casa en volumen, de protagonista
        + sombra_bajo(152, 158, 66, 9, .14)
        + _ch_casita(96, 90, 112, 62, k)
        + _ch_ventanuca(108, 100, 30, 26, k)
        # el árbol al lado
        + sombra_bajo(258, 158, 30, 6, .14)
        + _ch_arbol(258, 152, k, 44, 26)
        # falta una ventana: el cristal espera delante, apoyado en la hierba
        + fantasma('M166 100h32v28h-32z', k['madera'], 3)
        + '<g transform="rotate(9 196 170)">'
        + _ch_ventanuca(176, 150, 40, 36, k)
        + '</g>'
        + f'<path d="M198 146v-12M198 130l-5 8M198 130l5-8" stroke="{k["coral"]}" stroke-width="3.5" '
          f'stroke-linecap="round" fill="none"/>'
        + chispas(222, 136, k['oro'], 2)
        # el plano, pequeño y apoyado delante: cuatro muros y una puerta
        + '<g transform="rotate(-6 56 164)">'
        + f'<rect x="16" y="138" width="80" height="52" rx="3" fill="{k["papel2"]}" stroke="{k["gris2"]}" stroke-width="2.5"/>'
        + f'<rect x="26" y="146" width="60" height="36" fill="none" stroke="{k["navy"]}" stroke-width="7"/>'
        + f'<path d="M46 182h20" stroke="{k["papel2"]}" stroke-width="8"/>'
        + f'<path d="M46 182h20" stroke="{k["coral"]}" stroke-width="3" stroke-dasharray="5 4"/></g>'
    )


@escena_child('composicion')
def _c_composicion():
    k = P
    col = [k['coral'], k['oro'], k['rosa'], k['violeta'], k['turquesa']]
    xs = [46, 92, 138, 184, 230]
    ys = [96, 82, 68, 54, 40]
    pel = ''.join(f'<path d="M{x - 13} {y + 13}h26" stroke="{k["oro"]}" stroke-width="5" '
                  f'stroke-linecap="round" opacity=".5"/>' for x, y in zip(xs, ys))
    nts = ''.join(f'<path d="M{x + 12} {y}v-24" stroke="{c}" stroke-width="4.5" stroke-linecap="round"/>'
                  f'<ellipse cx="{x}" cy="{y}" rx="14" ry="12" fill="{c}"/>'
                  for x, y, c in zip(xs, ys, col))
    sep = ''.join(f'M{16 + i * 40} 118v66' for i in range(1, 7))
    neg = ''.join(f'<rect x="{x}" y="118" width="20" height="38" rx="3" fill="{k["tinta"]}"/>'
                  for x in (46, 86, 166, 206, 246))
    return (
        pared('#ffeedc', 148)
        + mesa(148, '#cf9a5e')
        + sombra_bajo(158, 186, 130, 8, .13)
        # escalera de notas, grandes y redondas
        + pel
        + nts
        + fantasma('M262 30a14 14 0 1 0 28 0a14 14 0 1 0-28 0', k['coral'], 3)
        + chispas(254, 22, k['oro'], 2)
        # teclado grande, teclas gordas, tres pulsadas con sus ondas
        + f'<rect x="16" y="112" width="288" height="8" rx="4" fill="{k["madera"]}"/>'
        + f'<rect x="16" y="118" width="280" height="66" fill="{k["papel"]}" stroke="{k["madera"]}" stroke-width="3"/>'
        + f'<path d="M56 118h40v66h-40zM136 118h40v66h-40zM216 118h40v66h-40z" fill="{k["sol"]}"/>'
        + f'<path d="{sep}" stroke="{k["madera"]}" stroke-width="2.5" opacity=".8"/>'
        + neg
        + f'<path d="M74 110a16 16 0 0 0 0-22M154 110a16 16 0 0 0 0-22M234 110a16 16 0 0 0 0-22" '
          f'fill="none" stroke="{k["coral"]}" stroke-width="4.5" stroke-linecap="round"/>'
        + f'<path d="M86 110a26 26 0 0 0 0-34M166 110a26 26 0 0 0 0-34M246 110a26 26 0 0 0 0-34" '
          f'fill="none" stroke="{k["coral"]}" stroke-width="4" stroke-linecap="round" opacity=".55"/>'
    )


@escena_child('sintesis-sonido')
def _c_sintesis_sonido():
    k = P
    d = 'M112 92'
    for i, v in enumerate((30, 30, 26, 26)):
        d += f'q15 {-v if i % 2 == 0 else v} 30 0'
    return (
        pared('#ffeacd', 152)
        + mesa(152, '#cf9a5e')
        # altavoz de madera, del que salen las ondas
        + sombra_bajo(56, 158, 44, 7, .16)
        + f'<rect x="16" y="46" width="80" height="110" rx="12" fill="{k["madera"]}" stroke="{k["tinta"]}" '
          f'stroke-width="2.5"/>'
        + f'<circle cx="56" cy="110" r="28" fill="{k["coral"]}" stroke="{k["rojo"]}" stroke-width="3"/>'
        + f'<circle cx="56" cy="110" r="11" fill="{k["sol"]}"/>'
        + f'<circle cx="56" cy="68" r="12" fill="{k["oro"]}" stroke="{k["coral"]}" stroke-width="2.5"/>'
        + f'<path d="M94 84a44 44 0 0 1 0 52M102 76a56 56 0 0 1 0 68" fill="none" stroke="{k["oro"]}" '
          f'stroke-width="5" stroke-linecap="round"/>'
        # la onda, gruesa y alegre, cruzando la escena
        + f'<path d="{d}" fill="none" stroke="{k["turquesa"]}" stroke-width="10" stroke-linecap="round"/>'
        + fantasma('M232 92q15 26 30 0q15-26 30 0', k['gris'], 3.5)
        # un solo mando, grande y de colores
        + sombra_bajo(226, 188, 54, 7, .16)
        + f'<rect x="172" y="156" width="108" height="30" rx="10" fill="{k["papel2"]}" stroke="{k["madera"]}" stroke-width="2.5"/>'
        + f'<circle cx="226" cy="156" r="34" fill="{k["oro"]}" stroke="{k["coral"]}" stroke-width="4"/>'
        + f'<circle cx="226" cy="156" r="22" fill="{k["sol"]}"/>'
        + f'<path d="M226 156L210 134" stroke="{k["rojo"]}" stroke-width="7" stroke-linecap="round"/>'
        + f'<circle cx="188" cy="176" r="4.5" fill="{k["turquesa"]}"/>'
        + f'<circle cx="226" cy="178" r="4.5" fill="{k["coral"]}"/>'
        + f'<circle cx="264" cy="176" r="4.5" fill="{k["violeta"]}"/>'
        + f'<path d="M264 130a44 44 0 0 0-24-20" fill="none" stroke="{k["coral"]}" stroke-width="3.5"/>'
        + f'<path d="M264 130l-2-11 10 5z" fill="{k["coral"]}"/>'
        + chispas(196, 128, k['oro'], 2)
    )


@escena_child('videomapping')
def _c_videomapping():
    k = P
    return (
        pared('#fdf2de', 150)
        + mesa(150, '#e7c48f')
        # cono de luz de colores, con luz en la sala
        + f'<path d="M92 96L300 34V188L92 124z" fill="{k["sol"]}" opacity=".55"/>'
        + f'<path d="M92 102L300 66V160L92 122z" fill="{k["coral"]}" opacity=".22"/>'
        # dos cajas grandes con formas sencillas dentro
        + sombra_bajo(190, 168, 58, 8, .16)
        + _ts_caja(144, 90, 86, 74, 20, 14, k['papel2'], k['arena'], '#d9b483')
        + _ch_sol(176, 114, 18, k['sol'], k['coral'], 8)
        + f'<circle cx="216" cy="146" r="15" fill="{k["turquesa"]}"/>'
        + sombra_bajo(276, 168, 28, 6, .16)
        + _ts_caja(246, 104, 56, 60, 14, 11, k['papel2'], k['arena'], '#d9b483')
        # la estrella todavía no está colocada en su caja
        + f'<path d="{_ch_estrella_d(274, 136, 22)}" fill="{k["arena"]}" opacity=".65"/>'
        + fantasma(_ch_estrella_d(274, 136, 22), k['coral'], 3)
        + _ch_estrella(272, 62, 22, k['oro'], k['coral'], 3)
        + f'<path d="M272 90v12M272 106l-5-8M272 106l5-8" stroke="{k["coral"]}" stroke-width="3.5" '
          f'stroke-linecap="round" fill="none"/>'
        + chispas(240, 76, k['oro'], 2)
        # proyector simpático
        + sombra_bajo(52, 164, 34, 6, .16)
        + f'<rect x="22" y="146" width="20" height="12" rx="3" fill="{k["madera"]}"/>'
        + f'<rect x="62" y="146" width="20" height="12" rx="3" fill="{k["madera"]}"/>'
        + f'<rect x="16" y="94" width="72" height="54" rx="14" fill="{k["turquesa"]}" stroke="{k["navy"]}" stroke-width="2.5"/>'
        + f'<rect x="26" y="102" width="26" height="10" rx="5" fill="{k["menta"]}"/>'
        + f'<circle cx="88" cy="112" r="17" fill="{k["oro"]}" stroke="{k["coral"]}" stroke-width="3"/>'
        + f'<circle cx="88" cy="112" r="8" fill="{k["sol"]}"/>'
    )


@escena_child('color')
def _c_color():
    k = P
    hues = [k['rojo'], k['coral'], k['oro'], k['hoja'], k['turquesa']]
    rueda = ''.join(_img_tarta(84, 72, 52, -90 + i * 60, -30 + i * 60, c)
                    for i, c in enumerate(hues))
    pots = ''
    for x, c in zip((20, 76, 132), (k['coral'], k['turquesa'], k['oro'])):
        pots += (f'<path d="M{x} 126h46l-5 40a5 5 0 0 1-5 5h-26a5 5 0 0 1-5-5z" fill="{k["papel2"]}" '
                 f'stroke="{k["gris2"]}" stroke-width="2"/>'
                 f'<rect x="{x - 4}" y="118" width="54" height="11" rx="5" fill="{c}"/>'
                 f'<path d="M{x + 13} 136h20v28h-20z" fill="{c}" opacity=".85"/>'
                 f'<path d="M{x + 23} 174c3 6 6 8 6 11a6 6 0 0 1-12 0c0-3 3-5 6-11z" fill="{c}"/>')
    return (
        pared('#fff0d8', 150)
        + mesa(150, '#cf9a5e')
        # rueda de seis sectores bien grandes, uno todavía sin pintar
        + rueda
        + fantasma('M84 72L39 46A52 52 0 0 1 84 20z', k['violeta'], 3)
        + f'<circle cx="84" cy="72" r="16" fill="{k["papel"]}" stroke="{k["gris2"]}" stroke-width="2"/>'
        + chispas(56, 34, k['oro'], 2)
        # tres botes de pintura, cada uno con su gota cayendo
        + sombra_bajo(102, 176, 80, 7, .13)
        + pots
        # la escena de ejemplo, grande, pintada con esos colores
        + f'<rect x="196" y="20" width="112" height="120" rx="4" fill="{k["cielo2"]}" '
          f'stroke="{k["gris2"]}" stroke-width="2.5"/>'
        + _ch_sol(282, 46, 13, k['sol'], k['oro'], 8)
        + f'<rect x="196" y="112" width="112" height="28" fill="{k["hoja"]}"/>'
        + _ch_casita(212, 84, 54, 28, k)
        + _ch_arbol(290, 112, k, 20, 15)
    )


@escena_child('fotografia')
def _c_fotografia():
    k = P
    return (
        pared('#ffeedb', 156)
        + mesa(156, '#cf9a5e')
        # cámara grande y simpática, de frente
        + sombra_bajo(86, 160, 66, 8, .16)
        + f'<rect x="58" y="42" width="56" height="16" rx="6" fill="{k["coral"]}"/>'
        + f'<rect x="18" y="54" width="138" height="102" rx="18" fill="{k["coral"]}" stroke="{k["rojo"]}" stroke-width="3"/>'
        + f'<circle cx="38" cy="72" r="9" fill="{k["rojo"]}" stroke="{k["papel2"]}" stroke-width="2.5"/>'
        + f'<rect x="118" y="66" width="30" height="20" rx="4" fill="{k["sol"]}" stroke="{k["oro"]}" stroke-width="2.5"/>'
        + f'<circle cx="84" cy="110" r="40" fill="{k["gris2"]}" stroke="{k["gris"]}" stroke-width="3"/>'
        + f'<circle cx="84" cy="110" r="29" fill="{k["azul"]}"/>'
        + f'<circle cx="84" cy="110" r="16" fill="{k["cielo"]}"/>'
        + f'<circle cx="75" cy="101" r="6" fill="{k["papel"]}" opacity=".85"/>'
        # delante, la foto del paisaje con su marco de recorte
        + '<g transform="rotate(-2 228 116)">'
        + sombra_bajo(228, 172, 70, 7, .16)
        + f'<rect x="156" y="64" width="144" height="102" rx="3" fill="{k["papel"]}" stroke="{k["gris2"]}" stroke-width="2"/>'
        + f'<rect x="164" y="72" width="128" height="48" fill="{k["cielo2"]}"/>'
        + f'<circle cx="268" cy="92" r="13" fill="{k["sol"]}" stroke="{k["oro"]}" stroke-width="3"/>'
        + f'<path d="M164 120L198 90L226 110L250 86L292 120z" fill="{k["verde"]}"/>'
        + f'<rect x="164" y="116" width="128" height="42" fill="{k["hoja"]}"/>'
        + _ch_arbol(214, 152, k, 20, 16)
        # marco de recorte: esquinas gruesas y el borde punteado
        + fantasma('M176 84h104v64h-104z', k['coral'], 2.5)
        + f'<path d="M176 106V84h22M258 84h22v22M280 126v22h-22M198 148h-22v-22" fill="none" '
          f'stroke="{k["coral"]}" stroke-width="7" stroke-linejoin="round"/>'
        + '</g>'
        + chispas(156, 58, k['oro'], 2)
    )


@escena_child('lenguas-inventadas')
def _c_lenguas_inventadas():
    k = P
    cols = [k['coral'], k['sol'], k['menta'], k['rosa'], k['lila'], k['hoja']]
    tar = ''
    for i, c in enumerate(cols):
        x = 18 + (i % 3) * 96
        y = 18 + (i // 3) * 62
        tar += (f'<rect x="{x}" y="{y}" width="86" height="54" rx="7" fill="{c}" '
                f'stroke="{k["madera"]}" stroke-width="2.5"/>')
    sig = _dk_signos([(i, 18 + (i % 3) * 96 + 43, 18 + (i // 3) * 62 + 27) for i in range(6)],
                     16, k['tinta'], 4.5)
    return (
        pared('#fff0da', 142)
        + mesa(142, '#cf9a5e')
        # seis signos inventados, enormes, cada uno en su tarjeta de color
        + tar
        + sig
        # debajo, una palabra escrita con tres de ellos
        + sombra_bajo(146, 188, 92, 7, .14)
        + f'<rect x="56" y="146" width="180" height="44" rx="4" fill="{k["papel"]}" stroke="{k["gris2"]}" stroke-width="2.5"/>'
        + _dk_signos([(0, 92, 166), (4, 142, 166)], 14, k['navy'], 4.2)
        + fantasma('M176 150h32v34h-32z', k['coral'], 2.5)
        + f'<path d="M68 182h150" stroke="{k["oro"]}" stroke-width="3" opacity=".6"/>'
        # la tarjeta del tercer signo baja a su hueco
        + '<g transform="rotate(14 276 164)">'
        + f'<rect x="252" y="142" width="48" height="44" rx="6" fill="{k["rosa"]}" stroke="{k["madera"]}" stroke-width="2.5"/>'
        + _dk_signos([(3, 276, 164)], 13, k['tinta'], 4)
        + '</g>'
        + f'<path d="M246 166h-18M222 166l9-5M222 166l9 5" stroke="{k["coral"]}" stroke-width="3.5" '
          f'stroke-linecap="round" fill="none"/>'
        + chispas(250, 138, k['oro'], 2)
    )


@escena_child('escritura-restricciones')
def _c_escritura_restricciones():
    k = P
    return (
        pared('#fff0d6', 150)
        # dos libros gordos en su estante
        + f'<rect x="20" y="16" width="26" height="44" rx="3" fill="{k["coral"]}" stroke="{k["rojo"]}" stroke-width="2.5"/>'
        + f'<rect x="50" y="24" width="24" height="36" rx="3" fill="{k["turquesa"]}" stroke="{k["navy"]}" stroke-width="2.5"/>'
        + f'<rect x="14" y="60" width="72" height="8" rx="3" fill="{k["madera"]}"/>'
        + mesa(150, '#cf9a5e')
        # cuaderno grande y abierto, con pocos renglones gruesos
        + sombra_bajo(124, 186, 100, 8, .15)
        + f'<rect x="18" y="80" width="204" height="104" rx="4" fill="{k["papel2"]}" stroke="{k["madera"]}" stroke-width="3"/>'
        + f'<rect x="118" y="80" width="6" height="104" fill="{k["madera"]}" opacity=".45"/>'
        + f'<path d="M112 96a9 9 0 0 1 18 0M112 124a9 9 0 0 1 18 0M112 152a9 9 0 0 1 18 0" '
          f'fill="none" stroke="{k["gris"]}" stroke-width="3.5"/>'
        + _dk_lineas(32, 100, 74, 3, 28, k['navy'], 6, .55, .75)
        + _dk_lineas(134, 100, 74, 2, 28, k['navy'], 6, .6, .75)
        + fantasma('M134 156h50', k['coral'], 4)
        # la regla del reto: tarjeta grande con la letra tachada
        + f'<rect x="236" y="26" width="76" height="92" rx="7" fill="{k["papel2"]}" stroke="{k["navy"]}" stroke-width="3"/>'
        + f'<circle cx="274" cy="16" r="6" fill="{k["coral"]}"/>'
        + f'<circle cx="274" cy="72" r="30" fill="{k["sol"]}" stroke="{k["navy"]}" stroke-width="3.5"/>'
        + f'<text x="274" y="87" font-family="system-ui,sans-serif" font-size="46" font-weight="700" '
          f'fill="{k["navy"]}" text-anchor="middle">e</text>'
        + f'<path d="M252 94L296 50" stroke="{k["rojo"]}" stroke-width="7" stroke-linecap="round"/>'
        + f'<path d="M248 36h52" stroke="{k["oro"]}" stroke-width="5" stroke-linecap="round" opacity=".8"/>'
        # el lápiz gordo, parado justo donde se corta la frase
        + _ch_lapiz_gordo(184, 154, 72, -34, k['coral'])
        + chispas(180, 142, k['oro'], 2)
    )
