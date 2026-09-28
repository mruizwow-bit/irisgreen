#!/usr/bin/env python3
"""R62 · P02 · Terrario vivo · arte de concepto.

Genera las láminas originales que pide la orden R62 §15. Todo es SVG autorado
aquí: formas orgánicas por curvas de Bézier, variación por semilla fija —el
dibujo sale idéntico cada vez— y perspectiva atmosférica calculada. Sin assets
de terceros, sin stock, sin calcar obra ajena.

## Por qué vista frontal y no axonométrica

P01 es axonométrico. Un terrario pide mirarlo de frente, a través del cristal:
es lo que deja ver las capas de sustrato en sección —media belleza del objeto
real— y lo que permite que el fondo se pierda en bruma. Los seis pilotos tienen
que diferenciarse también en lenguaje visual, no sólo en mecánica.

## Lo que hace que no sea una caja plana

El terreno **no es un plano**: es una silueta con relieve, `terrain_top(x)`,
que sube en una loma a la izquierda y cae en una hondonada a la derecha. El
agua se queda en la hondonada porque es el punto bajo, no porque alguien la
dibuje ahí. Esa curva es la que convierte una vitrina en un pequeño mundo, y de
ella cuelga todo lo demás: las plantas se plantan sobre la curva, el musgo se
acumula donde la pendiente es suave, la sombra se proyecta ladera abajo.

Cada elemento lleva una profundidad `d` entre 0 (pegado al cristal) y 1
(contra el fondo) que decide a la vez su escala, su altura en el encuadre, su
contraste y cuánto se mezcla con la bruma. Las hojas se dibujan en dos tonos
—cuerpo y cara iluminada desplazada hacia la luz— más filo de canto, que es lo
que les da volumen sin necesidad de degradado por hoja.

## Lo que el sistema simula de verdad

Dos campos sobre una rejilla: **luz** y **humedad**. Una roca ocupa celdas y
proyecta sombra en la dirección de la luz; el agua sube la humedad de sus
celdas y de las vecinas, con caída por distancia; la pendiente hace que el agua
busque el punto bajo; el tipo de sustrato modula cuánto retiene. Las plantas
tienen un rango preferido de cada campo, y su aspecto —color, orientación de la
hoja, cuánto musgo prende alrededor— sale de lo bien que la celda encaja.

Eso es todo. No hay fotosíntesis, ni ciclo de nutrientes, ni especies reales
modeladas. La segunda lámina muestra esa cadena y nada más:

    roca → sombra ladera abajo → la celda retiene humedad → el musgo prende →
    la hoja se orienta hacia la zona húmeda

Uso:  python3 scripts/r62_p02_concepto.py
"""
import argparse
import math
import random
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent

W, H = 1180, 900
LX, RX = 126, 1054
TY, BY = 118, 812

BRUMA = '#20302A'
LUZ = '#FFE7B4'
LUZ_DIR = (0.62, 0.78)      # de arriba-izquierda


def mix(c1, c2, t):
    a = [int(c1[i:i + 2], 16) for i in (1, 3, 5)]
    b = [int(c2[i:i + 2], 16) for i in (1, 3, 5)]
    t = max(0.0, min(1.0, t))
    return '#%02x%02x%02x' % tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def haze(col, d):
    return mix(col, BRUMA, min(0.86, d * 0.82))


def scale_at(d):
    return 1.0 - 0.46 * d


def terrain_top(x):
    """Silueta del terreno: loma a la izquierda, hondonada a la derecha."""
    t = (x - LX) / (RX - LX)
    y = (612
         - 96 * math.exp(-((t - 0.20) ** 2) / 0.035)      # loma
         + 54 * math.exp(-((t - 0.63) ** 2) / 0.012)      # hondonada
         - 34 * math.exp(-((t - 0.90) ** 2) / 0.020)      # repecho derecho
         - 10 * math.sin(t * 9.0))                        # ondulación menor
    return y


def ground_y(x, d):
    """Donde se planta algo a profundidad d: el terreno sube al alejarse."""
    return terrain_top(x) - d * 132


class Art:
    def __init__(self, seed=17):
        self.r = random.Random(seed)
        self.layers = {0: [], 1: [], 2: [], 3: []}

    def put(self, d, svg):
        band = 0 if d > 0.66 else 1 if d > 0.36 else 2 if d > 0.12 else 3
        self.layers[band].append(svg)

    def flat(self, svg):
        self.layers[0].append(svg)

    def render(self):
        return ''.join(''.join(self.layers[k]) for k in (0, 1, 2, 3))


# --------------------------------------------------------------- materia ---

def leaf(x, y, L, wid, ang, body, lit, rim=None, op=1.0):
    """Hoja en dos tonos: cuerpo y cara iluminada desplazada hacia la luz."""
    d = (f'M0 0 C{wid} {-L*0.28} {wid*0.70} {-L*0.76} 0 {-L} '
         f'C{-wid*0.70} {-L*0.76} {-wid} {-L*0.28} 0 0 Z')
    inner = (f'M0 {-L*0.06} C{wid*0.66} {-L*0.32} {wid*0.46} {-L*0.74} 0 {-L*0.93} '
             f'C{-wid*0.20} {-L*0.72} {-wid*0.30} {-L*0.34} 0 {-L*0.06} Z')
    g = [f'<path d="{d}" fill="{body}"/>',
         f'<path d="{inner}" fill="{lit}" opacity="0.85"/>']
    if rim:
        g.append(f'<path d="M0 0 C{wid} {-L*0.28} {wid*0.70} {-L*0.76} 0 {-L}" fill="none" '
                 f'stroke="{rim}" stroke-width="1.5" opacity="0.55" stroke-linecap="round"/>')
    return (f'<g transform="translate({x:.1f} {y:.1f}) rotate({ang:.1f})" '
            f'opacity="{op:.2f}">{"".join(g)}</g>')


def contact(x, y, rx, d, k=0.44):
    return (f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{rx:.1f}" ry="{rx*0.22:.1f}" '
            f'fill="#0A0F0C" opacity="{k*(1-d*0.55):.2f}" filter="url(#b8)"/>')


def rock(a, x, y, s, d, tone='#6C7168'):
    rr = a.r
    n = 11
    pts = []
    for i in range(n):
        ang = math.pi + math.pi * i / (n - 1)
        rad = s * (0.60 + rr.uniform(-0.10, 0.18))
        pts.append((x + math.cos(ang) * rad, y - abs(math.sin(ang)) * rad * 0.84))
    body = 'M' + 'L'.join(f'{px:.1f} {py:.1f}' for px, py in pts) + f'L{pts[0][0]:.1f} {y:.1f}Z'
    lit = haze(mix(tone, LUZ, 0.10), d)
    dark = haze(mix(tone, '#10160F', 0.62), d)
    out = [contact(x, y, s * 0.72, d),
           f'<path d="{body}" fill="{lit}"/>']
    facet = [pts[i] for i in range(n // 2 + 1, n)] + [(x + s * 0.06, y)]
    out.append('<path d="M' + 'L'.join(f'{px:.1f} {py:.1f}' for px, py in facet)
               + f'Z" fill="{dark}" opacity="0.9"/>')
    top = pts[2:7]
    out.append('<polyline points="' + ' '.join(f'{px:.1f},{py:.1f}' for px, py in top) +
               f'" fill="none" stroke="{haze(mix(tone, "#EAF2E4", 0.6), d)}" '
               f'stroke-width="{2.6*scale_at(d):.1f}" opacity="{0.5*(1-d*0.6):.2f}" '
               f'stroke-linecap="round"/>')
    for _ in range(int(16 * (1 - d * 0.6))):
        px = x + rr.uniform(-s * 0.5, s * 0.5)
        py = y - rr.uniform(0.05, 0.55) * s
        out.append(f'<path d="M{px:.1f} {py:.1f} l{rr.uniform(-6,6):.1f} {rr.uniform(-3,3):.1f}" '
                   f'stroke="{dark}" stroke-width="1" opacity="0.30"/>')
    return ''.join(out)


def broadleaf(a, x, y, s, d, hue='#3E7B4A', lean=0.0):
    body_c = haze(mix(hue, '#0E1A11', 0.30), d)
    lit_c = haze(mix(hue, LUZ, 0.26), d)
    rim_c = haze(mix(hue, '#E8F6C9', 0.55), d)
    out = [contact(x, y, s * 0.40, d)]
    plan = [(-58, 0.74, 0.30), (-30, 0.94, 0.33), (-6, 1.0, 0.34),
            (20, 0.88, 0.31), (46, 0.70, 0.27), (-16, 0.48, 0.20)]
    for i, (ang, L, wd) in enumerate(plan):
        ang += lean + a.r.uniform(-4, 4)
        faces_light = ang < 4
        b = mix(body_c, '#0A120C', 0.0 if faces_light else 0.28)
        l = mix(lit_c, body_c, 0.0 if faces_light else 0.55)
        out.append(leaf(x, y, s * L, s * wd, ang, b, l, rim_c if faces_light else None))
    return ''.join(out)


def fern(a, x, y, s, d, hue='#568C4C'):
    body_c = haze(mix(hue, '#0F1D10', 0.22), d)
    lit_c = haze(mix(hue, LUZ, 0.30), d)
    out = [contact(x, y, s * 0.26, d)]
    for k, side in enumerate((-1, 1, -1, 1)):
        tipx = x + side * s * (0.34 + 0.12 * k)
        tipy = y - s * (1.02 - 0.13 * k)
        cx1, cy1 = x + side * s * 0.06, y - s * 0.50
        out.append(f'<path d="M{x:.1f} {y:.1f} Q{cx1:.1f} {cy1:.1f} {tipx:.1f} {tipy:.1f}" '
                   f'fill="none" stroke="{mix(body_c,"#16260F",0.4)}" '
                   f'stroke-width="{2.2*scale_at(d):.1f}" stroke-linecap="round"/>')
        n = 10
        for i in range(1, n):
            t = i / n
            px = (1 - t) ** 2 * x + 2 * (1 - t) * t * cx1 + t ** 2 * tipx
            py = (1 - t) ** 2 * y + 2 * (1 - t) * t * cy1 + t ** 2 * tipy
            ll = s * 0.29 * (1 - t * 0.68)
            for sg in (-1, 1):
                ang = sg * (60 - 18 * t) + side * 10
                up = ang < 0
                out.append(leaf(px, py, ll, ll * 0.32, ang,
                                mix(body_c, '#0A140A', 0.0 if up else 0.3),
                                mix(lit_c, body_c, 0.0 if up else 0.6)))
    return ''.join(out)


def moss(a, x, y, w, h, d, wet=1.0):
    rr = a.r
    base = haze(mix('#2A4622', '#4A7431', wet), d)
    deep = haze(mix('#192C16', '#2C481C', wet), d)
    tip = haze(mix('#42592C', '#7D9C4A', wet), d)
    seg = 9
    path = [f'M{x-w/2:.1f} {y:.1f}']
    for i in range(1, seg + 1):
        px = x - w / 2 + w * i / seg
        hh = h * math.sin(math.pi * i / seg) ** 0.65 * rr.uniform(0.80, 1.12)
        path.append(f'Q{px - w/(2*seg):.1f} {y - hh:.1f} {px:.1f} {y - hh*0.55:.1f}')
    out = [f'<path d="{" ".join(path)} Z" fill="{deep}"/>']
    out.append(f'<path d="{" ".join(path)} Z" fill="{base}" opacity="0.75" '
               f'transform="translate(0 {-h*0.12:.1f})"/>')
    for _ in range(int(48 * (1 - d * 0.55))):
        px = x + rr.uniform(-w / 2.1, w / 2.1)
        hh = h * math.sin(math.pi * (px - x + w / 2) / w) ** 0.65
        py = y - hh * rr.uniform(0.45, 1.02)
        out.append(f'<path d="M{px:.1f} {py:.1f} l{rr.uniform(-1.6,1.6):.1f} '
                   f'{-rr.uniform(2.6,6.0)*scale_at(d):.1f}" stroke="{tip}" '
                   f'stroke-width="{1.5*scale_at(d):.1f}" stroke-linecap="round" '
                   f'opacity="{rr.uniform(0.45,0.95):.2f}"/>')
    return ''.join(out)


def driftwood(a, x, y, s, d, ang=-30):
    col = haze('#634C34', d)
    lit = haze(mix('#8A6C49', LUZ, 0.2), d)
    dark = haze('#2E2117', d)
    L = s
    body = (f'M0 0 C{L*0.06:.0f} {-L*0.34:.0f} {L*0.26:.0f} {-L*0.58:.0f} {L*0.50:.0f} {-L*0.96:.0f} '
            f'l{L*0.13:.0f} {L*0.06:.0f} C{L*0.32:.0f} {-L*0.56:.0f} {L*0.14:.0f} {-L*0.32:.0f} '
            f'{L*0.11:.0f} {L*0.02:.0f} Z')
    out = [contact(x, y, s * 0.24, d),
           f'<g transform="translate({x:.1f} {y:.1f}) rotate({ang})">',
           f'<path d="{body}" fill="{col}"/>',
           f'<path d="{body}" fill="{dark}" opacity="0.55" '
           f'transform="translate({s*0.05:.0f} 0)"/>',
           f'<path d="M{L*0.03:.0f} {-L*0.06:.0f} C{L*0.09:.0f} {-L*0.36:.0f} '
           f'{L*0.28:.0f} {-L*0.58:.0f} {L*0.50:.0f} {-L*0.93:.0f}" fill="none" '
           f'stroke="{lit}" stroke-width="{3.2*scale_at(d):.1f}" opacity="0.7"/>']
    for i in range(7):
        t = 0.10 + i * 0.12
        out.append(f'<path d="M{L*0.09*t:.0f} {-L*t:.0f} q{L*0.05:.0f} {-L*0.02:.0f} '
                   f'{L*0.09:.0f} {-L*0.012:.0f}" fill="none" stroke="{dark}" '
                   f'stroke-width="1.1" opacity="0.5"/>')
    out.append('</g>')
    return ''.join(out)


def creeper(a, x, y, s, d, hue='#6A9E55', sweep=1):
    """Planta colgante: guía curva con hojas pequeñas."""
    body_c = haze(mix(hue, '#132211', 0.22), d)
    lit_c = haze(mix(hue, LUZ, 0.28), d)
    out = []
    ex, ey = x + sweep * s * 0.55, y + s * 0.92
    cx, cy = x + sweep * s * 0.62, y + s * 0.26
    out.append(f'<path d="M{x:.1f} {y:.1f} Q{cx:.1f} {cy:.1f} {ex:.1f} {ey:.1f}" fill="none" '
               f'stroke="{mix(body_c,"#101C0E",0.3)}" stroke-width="{2.0*scale_at(d):.1f}"/>')
    for i in range(1, 13):
        t = i / 13
        px = (1 - t) ** 2 * x + 2 * (1 - t) * t * cx + t ** 2 * ex
        py = (1 - t) ** 2 * y + 2 * (1 - t) * t * cy + t ** 2 * ey
        sg = -1 if i % 2 else 1
        ll = s * 0.20 * (1 - t * 0.45) * a.r.uniform(0.78, 1.18)
        ang = sg * a.r.uniform(58, 96) + 16 + t * 22
        lit = lit_c if sg < 0 else mix(lit_c, body_c, 0.55)
        out.append(leaf(px, py, ll, ll * 0.44, ang, body_c, lit))
    return ''.join(out)


def backwall(a, d=0.92):
    """Pared de roca al fondo: losas irregulares, repisas y musgo en bruma."""
    rr = a.r
    out = []
    x = LX - 20
    while x < RX + 20:
        w = rr.uniform(64, 128)
        tone = rr.choice(['#54574E', '#4A4E46', '#5E6157', '#424639'])
        top = TY + rr.uniform(-14, 40)
        pts = [(x, BY), (x, top + rr.uniform(-10, 10))]
        steps = 5
        for i in range(1, steps + 1):
            pts.append((x + w * i / steps, top + rr.uniform(-16, 18)))
        pts.append((x + w, BY))
        out.append('<path d="M' + 'L'.join(f'{px:.0f} {py:.0f}' for px, py in pts)
                   + f'Z" fill="{haze(tone, d)}"/>')
        out.append(f'<path d="M{x:.0f} {top:.0f} L{x:.0f} {BY}" stroke="{haze("#2E322B", d)}" '
                   f'stroke-width="2" opacity="0.6"/>')
        # repisa con musgo
        if rr.random() < 0.45:
            ly = top + rr.uniform(90, 260)
            lw = w * rr.uniform(0.75, 1.15)
            out.append(f'<path d="M{x-6:.0f} {ly:.0f} q{lw*0.5:.0f} {rr.uniform(-14,-4):.0f} '
                       f'{lw:.0f} {rr.uniform(-6,8):.0f} l0 16 q{-lw*0.5:.0f} 6 {-lw:.0f} 0 Z" '
                       f'fill="{haze(mix(tone, LUZ, 0.14), d)}" opacity="0.9"/>')
            out.append(moss(a, x + lw * 0.45, ly + 8, lw * 1.05, rr.uniform(14, 26), d,
                            wet=rr.uniform(0.45, 0.85)))
        x += w * rr.uniform(0.78, 0.98)
    return ''.join(out)


def canopy(a, spots):
    """Vegetación que cuelga desde el borde superior, cortada por el marco."""
    out = []
    for x, d, s, sweep in spots:
        out.append(creeper(a, x, TY - 30, s, d, sweep=sweep))
        for k in range(3):
            out.append(leaf(x + sweep * k * s * 0.16, TY + 10 + k * 18,
                            s * (0.46 - 0.07 * k), s * 0.17,
                            sweep * (150 + k * 9),
                            haze(mix('#2E6A40', '#0C1710', 0.25), d),
                            haze(mix('#2E6A40', LUZ, 0.22), d)))
    return ''.join(out)


# ------------------------------------------------------------- la vitrina ---

def terrain_path():
    steps = 48
    pts = [f'M{LX} {terrain_top(LX):.1f}']
    for i in range(1, steps + 1):
        x = LX + (RX - LX) * i / steps
        pts.append(f'L{x:.1f} {terrain_top(x):.1f}')
    pts.append(f'L{RX} {BY} L{LX} {BY} Z')
    return ' '.join(pts)


def ground(a, damp=()):
    out = [f'<path d="{terrain_path()}" fill="url(#g-soil)"/>']
    # capas en sección, recortadas al terreno
    out.append('<g clip-path="url(#soilclip)">')
    for y0, hgt, col in ((690, 58, '#31241A'), (748, 46, '#4A4136'), (794, 60, '#5A5145')):
        wob = ''.join(f'Q{LX + (RX-LX)*(i+0.5)/9:.0f} {y0 + (7 if i % 2 else -7)} '
                      f'{LX + (RX-LX)*(i+1)/9:.0f} {y0}' for i in range(9))
        out.append(f'<path d="M{LX} {y0} {wob} L{RX} {BY} L{LX} {BY} Z" fill="{col}"/>')
    for _ in range(190):
        px, py = a.r.uniform(LX, RX), a.r.uniform(762, BY)
        r = a.r.uniform(2.2, 5.6)
        out.append(f'<circle cx="{px:.0f}" cy="{py:.0f}" r="{r:.1f}" '
                   f'fill="{a.r.choice(["#6A6154","#7B7263","#504839"])}" opacity="0.92"/>')
        out.append(f'<circle cx="{px-r*0.3:.0f}" cy="{py-r*0.35:.0f}" r="{r*0.34:.1f}" '
                   f'fill="#9A9281" opacity="0.32"/>')
    out.append('</g>')
    # zonas húmedas
    out.append('<g clip-path="url(#soilclip)">')
    for cx, cy, rx, ry, k in damp:
        out.append(f'<ellipse cx="{cx:.0f}" cy="{cy:.0f}" rx="{rx:.0f}" ry="{ry:.0f}" '
                   f'fill="#1A1108" opacity="{k:.2f}" filter="url(#b26)"/>')
    out.append('</g>')
    # grano de superficie siguiendo la curva
    for _ in range(420):
        px = a.r.uniform(LX + 4, RX - 4)
        ty = terrain_top(px)
        py = ty + a.r.uniform(0, 30)
        r = a.r.uniform(0.9, 2.6)
        out.append(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="{r:.1f}" '
                   f'fill="{a.r.choice(["#8A7150","#584225","#9C8560"])}" '
                   f'opacity="{a.r.uniform(0.18,0.5):.2f}"/>')
    # piedrecillas sueltas sobre la ladera
    for _ in range(46):
        px = a.r.uniform(LX + 30, RX - 30)
        ty = terrain_top(px)
        py = ty + a.r.uniform(2, 26)
        r = a.r.uniform(2.6, 7.0)
        tone = a.r.choice(['#6B6A5C', '#7C7868', '#57554A'])
        out.append(f'<ellipse cx="{px:.0f}" cy="{py:.0f}" rx="{r:.1f}" ry="{r*0.72:.1f}" '
                   f'fill="{tone}" opacity="0.85"/>')
        out.append(f'<ellipse cx="{px-r*0.28:.0f}" cy="{py-r*0.3:.0f}" rx="{r*0.4:.1f}" '
                   f'ry="{r*0.28:.1f}" fill="#A9A594" opacity="0.32"/>')
    # canto iluminado de la loma
    edge = ' '.join(f'{LX + (RX-LX)*i/48:.0f},{terrain_top(LX + (RX-LX)*i/48):.1f}'
                    for i in range(49))
    out.append(f'<polyline points="{edge}" fill="none" stroke="{mix("#C9A874", LUZ, 0.4)}" '
               f'stroke-width="2.2" opacity="0.38"/>')
    return ''.join(out)


def pool(a, level):
    """Agua donde el terreno cae por debajo del nivel. En ningún otro sitio."""
    xs = [LX + (RX - LX) * i / 260 for i in range(261)]
    wet = [x for x in xs if terrain_top(x) > level]
    if not wet:
        return ''
    x0, x1 = wet[0], wet[-1]
    span = [x for x in xs if x0 <= x <= x1]
    d = ('M' + f'{x0:.1f} {level:.1f}'
         + ''.join(f'L{x:.1f} {level:.1f}' for x in span)
         + ''.join(f'L{x:.1f} {terrain_top(x):.1f}' for x in reversed(span)) + 'Z')
    out = [f'<path d="{d}" fill="#16302F" opacity="0.94"/>',
           f'<path d="{d}" fill="url(#g-water)"/>']
    for i in range(4):
        yy = level + 4 + i * 4.5
        out.append(f'<path d="M{x0+26+i*10:.0f} {yy:.0f} q{(x1-x0)*0.20:.0f} {3-i:.0f} '
                   f'{(x1-x0)*0.40:.0f} 0" fill="none" stroke="#BFE7E0" stroke-width="1.4" '
                   f'opacity="{0.20-0.04*i:.2f}"/>')
    out.append(f'<path d="M{x0:.0f} {level:.0f} L{x1:.0f} {level:.0f}" stroke="#DCF2EB" '
               f'stroke-width="1.6" opacity="0.55"/>')
    out.append(f'<ellipse cx="{(x0+x1)/2:.0f}" cy="{level+2:.0f}" rx="{(x1-x0)*0.30:.0f}" '
               f'ry="7" fill="{LUZ}" opacity="0.12"/>')
    return ''.join(out)


def glasswork(a, condens=()):
    out = []
    for (cx, cy, rad, n) in condens:
        for _ in range(n):
            px, py = cx + a.r.gauss(0, rad), cy + a.r.gauss(0, rad * 0.7)
            if not (LX + 8 < px < RX - 8 and TY + 8 < py < BY - 8):
                continue
            r = abs(a.r.gauss(1.9, 1.2)) + 0.6
            out.append(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="{r:.1f}" fill="#CBE4E1" '
                       f'opacity="{a.r.uniform(0.10,0.28):.2f}"/>')
            out.append(f'<circle cx="{px-r*0.32:.1f}" cy="{py-r*0.36:.1f}" r="{r*0.3:.1f}" '
                       f'fill="#FFFFFF" opacity="{a.r.uniform(0.2,0.5):.2f}"/>')
    out.append(f'<path d="M{LX+62} {TY} L{LX+150} {TY} L{LX+72} {BY} L{LX+22} {BY} Z" '
               f'fill="#E4F4EC" opacity="0.022"/>')
    out.append(f'<rect x="{LX}" y="{TY}" width="{RX-LX}" height="{BY-TY}" fill="none" '
               f'stroke="#A8BFB6" stroke-width="2.2" opacity="0.34" rx="5"/>')
    out.append(f'<rect x="{LX-7}" y="{TY-7}" width="{RX-LX+14}" height="{BY-TY+14}" fill="none" '
               f'stroke="#0C110F" stroke-width="13" opacity="0.55" rx="9"/>')
    return ''.join(out)


def defs():
    return f'''<defs>
<radialGradient id="room" cx="40%" cy="30%" r="82%">
 <stop offset="0" stop-color="#26332C"/><stop offset="0.5" stop-color="#161F1B"/><stop offset="1" stop-color="#070A09"/>
</radialGradient>
<linearGradient id="g-back" x1="0.1" y1="0" x2="0.4" y2="1">
 <stop offset="0" stop-color="#31463A"/><stop offset="0.55" stop-color="#22322B"/><stop offset="1" stop-color="{BRUMA}"/>
</linearGradient>
<linearGradient id="g-soil" x1="0.1" y1="0" x2="0.6" y2="1">
 <stop offset="0" stop-color="#7A6039"/><stop offset="0.28" stop-color="#5A4529"/><stop offset="1" stop-color="#2A2016"/>
</linearGradient>
<radialGradient id="g-water" cx="36%" cy="26%" r="76%">
 <stop offset="0" stop-color="#6FAEA6" stop-opacity="0.5"/><stop offset="1" stop-color="#12292B" stop-opacity="0.9"/>
</radialGradient>
<linearGradient id="beam" x1="0" y1="0" x2="0.55" y2="1">
 <stop offset="0" stop-color="{LUZ}" stop-opacity="0.26"/><stop offset="0.7" stop-color="{LUZ}" stop-opacity="0.06"/>
 <stop offset="1" stop-color="{LUZ}" stop-opacity="0"/>
</linearGradient>
<radialGradient id="pool-light" cx="50%" cy="50%" r="50%">
 <stop offset="0" stop-color="{LUZ}" stop-opacity="0.30"/><stop offset="1" stop-color="{LUZ}" stop-opacity="0"/>
</radialGradient>
<radialGradient id="vig" cx="47%" cy="44%" r="72%">
 <stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.66"/>
</radialGradient>
<filter id="b8" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="9"/></filter>
<filter id="b26" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="30"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%">
 <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="5"/>
 <feColorMatrix type="saturate" values="0"/>
</filter>
<clipPath id="tank"><rect x="{LX}" y="{TY}" width="{RX-LX}" height="{BY-TY}" rx="5"/></clipPath>
<clipPath id="soilclip"><path d="{terrain_path()}"/></clipPath>
</defs>'''


def compose(state='a', seed=17):
    a = Art(seed)
    damp = [(300, 600, 150, 46, 0.42)]
    if state == 'b':
        damp.append((742, 596, 190, 60, 0.80))

    g = [f'<g clip-path="url(#tank)">',
         f'<rect x="{LX}" y="{TY}" width="{RX-LX}" height="{BY-TY}" fill="url(#g-back)"/>']

    g.append(backwall(a))
    # --- fondo: siluetas en bruma que cierran el volumen ---
    for x, d, s in ((250, 0.92, 168), (470, 0.88, 140), (700, 0.94, 152), (900, 0.86, 130)):
        g.append(fern(a, x, ground_y(x, d), s, d, '#3E6B3E'))
    g.append(rock(a, 590, ground_y(590, 0.80), 96, 0.80))
    g.append(broadleaf(a, 356, ground_y(356, 0.76), 104, 0.76, '#2F6642'))
    g.append(creeper(a, 836, ground_y(836, 0.82) - 150, 150, 0.82))

    # --- haz de luz entrando por arriba a la izquierda ---
    g.append(f'<path d="M{LX} {TY} L{LX+286} {TY} L{LX+196} {BY} L{LX} {BY} Z" '
             f'fill="url(#beam)" opacity="0.55"/>')
    g.append(f'<ellipse cx="{LX+210}" cy="{terrain_top(LX+210):.0f}" rx="190" ry="72" '
             f'fill="url(#pool-light)"/>')

    # --- el terreno ---
    g.append(ground(a, damp))

    # --- plano medio ---
    g.append(driftwood(a, 560, ground_y(560, 0.44), 320, 0.44, ang=-26))
    g.append(moss(a, 300, terrain_top(300) + 6, 230, 46, 0.34, wet=0.85))
    g.append(moss(a, 396, terrain_top(396) + 12, 150, 22, 0.24, wet=0.55))
    g.append(moss(a, 560, terrain_top(560) + 20, 120, 18, 0.16, wet=0.45))
    g.append(rock(a, 432, terrain_top(432) + 2, 86, 0.36))
    g.append(fern(a, 236, terrain_top(236) + 4, 176, 0.30, '#5C9450'))
    g.append(fern(a, 344, terrain_top(344) + 2, 268, 0.40, '#4E8748'))
    g.append(fern(a, 726, terrain_top(726) - 6, 230, 0.52, '#437B44'))
    g.append(broadleaf(a, 636, terrain_top(636) - 4, 120, 0.42, '#376F46', lean=-10))

    if state == 'b':
        sx = 806
        sy = terrain_top(sx)
        shade = ['M%.0f %.0f' % (sx - 92, sy + 6)]
        for i in range(1, 15):
            xx = sx - 92 + i * 16
            shade.append('L%.0f %.0f' % (xx, terrain_top(xx) + 8 + i * 1.2))
        shade.append('L%.0f %.0f' % (sx + 168, sy + 66))
        shade.append('L%.0f %.0f Z' % (sx - 92, sy + 52))
        g.append(f'<path d="{" ".join(shade)}" fill="#0A0F0A" opacity="0.46" '
                 f'filter="url(#b26)"/>')
        g.append(rock(a, sx, sy + 2, 104, 0.26, '#7A7B70'))
        g.append(moss(a, 878, terrain_top(878) + 8, 168, 42, 0.22, wet=1.0))

    # --- agua en la hondonada ---
    g.append(pool(a, 636 if state == 'a' else 628))

    # --- dosel: hojas que entran desde arriba ---
    g.append(canopy(a, [(258, 0.30, 220, 1), (612, 0.46, 170, -1), (946, 0.22, 240, -1)]))

    # --- primer plano, cortado por el marco ---
    g.append(broadleaf(a, 1024, terrain_top(1024) + 54, 200, 0.05, '#2A6440', lean=16))
    g.append(moss(a, 186, terrain_top(186) + 16, 250, 52, 0.06, wet=0.7))
    g.append(rock(a, 520, terrain_top(520) + 26, 92, 0.04, '#585E55'))
    g.append(fern(a, 96, terrain_top(140) + 40, 210, 0.02, '#4E8A46'))

    if state == 'a':
        # elemento en proceso de colocación: helecho suspendido y su huella
        px = 452
        gy = terrain_top(px) + 18
        g.append(f'<ellipse cx="{px}" cy="{gy:.0f}" rx="74" ry="19" fill="{LUZ}" opacity="0.10"/>')
        g.append(f'<ellipse cx="{px}" cy="{gy:.0f}" rx="74" ry="19" fill="none" '
                 f'stroke="{LUZ}" stroke-width="2.4" opacity="0.82" stroke-dasharray="8 7"/>')
        g.append(f'<line x1="{px}" y1="{gy-14:.0f}" x2="{px}" y2="{gy-150:.0f}" stroke="{LUZ}" '
                 f'stroke-width="1.6" opacity="0.38" stroke-dasharray="4 8"/>')
        g.append(f'<ellipse cx="{px}" cy="{gy-6:.0f}" rx="52" ry="13" fill="#070A08" '
                 f'opacity="0.34" filter="url(#b8)"/>')
        g.append(fern(a, px, gy - 156, 150, 0.02, '#6BAA59'))

    g.append('</g>')
    cond = [(258, 236, 86, 44), (930, 214, 52, 18)]
    if state == 'b':
        cond.append((846, 330, 104, 74))
    g.append(glasswork(a, cond))
    return ''.join(g)


def detail(state, px, py, pw, ph, cx, cy, zoom, cid):
    """Recorte ampliado de la escena, para leer la consecuencia de cerca."""
    tx = px + pw / 2 - cx * zoom
    ty = py + ph / 2 - cy * zoom
    return (f'<clipPath id="{cid}"><rect x="{px}" y="{py}" width="{pw}" height="{ph}" rx="6"/></clipPath>'
            f'<g clip-path="url(#{cid})"><g transform="translate({tx:.1f} {ty:.1f}) '
            f'scale({zoom})">{compose(state)}</g></g>'
            f'<rect x="{px}" y="{py}" width="{pw}" height="{ph}" fill="none" '
            f'stroke="#8CA298" stroke-width="2" opacity="0.4" rx="6"/>')


def marker(x, y, n, label):
    return (f'<circle cx="{x}" cy="{y}" r="15" fill="#0E1512" stroke="{LUZ}" stroke-width="1.8"/>'
            f'<text x="{x}" y="{y+5.5}" font-family="Georgia, serif" font-size="15" '
            f'fill="{LUZ}" text-anchor="middle">{n}</text>'
            f'<text x="{x+22}" y="{y+5.5}" font-family="Georgia, serif" font-size="16" '
            f'fill="#D7E4D6">{label}</text>')


def page(body, title, subtitle, caption, extra=''):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="{title}. Arte de concepto original de Iris Green para el piloto Terrario vivo.">
{defs()}
<rect width="{W}" height="{H}" fill="url(#room)"/>
{body}
<rect width="{W}" height="{H}" filter="url(#grain)" opacity="0.11" style="mix-blend-mode:overlay" pointer-events="none"/>
<rect width="{W}" height="{H}" fill="url(#vig)" pointer-events="none"/>
<text x="56" y="62" font-family="Georgia, serif" font-size="34" fill="#EAF1E5" letter-spacing="0.3">{title}</text>
<text x="56" y="90" font-family="Georgia, serif" font-size="16.5" fill="#93A497">{subtitle}</text>
{extra}
<text x="{W-56}" y="{H-28}" font-family="Georgia, serif" font-size="14.5" fill="#7F9085" text-anchor="end">{caption}</text>
</svg>'''


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', type=Path, default=REPO / 'editorial/r62/p02-terrario-vivo')
    args = ap.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)

    (args.out / 'gameplay.svg').write_text(
        page(compose('a'), 'Terrario vivo',
             'Colocar, ver cómo responde, ajustar. No hay victoria ni final.',
             'P02 · imagen principal de gameplay'), encoding='utf-8')

    cx, cy, zoom = 858, 596, 1.95
    pw, ph = 486, 430
    left = detail('a', 56, 150, pw, ph, cx, cy, zoom, 'cropA')
    right = detail('b', 638, 150, pw, ph, cx, cy, zoom, 'cropB')
    mid = (f'<circle cx="{56+pw+48}" cy="365" r="30" fill="#101815" stroke="{LUZ}" '
           f'stroke-width="1.6"/>'
           f'<path d="M{56+pw+38} 355 l14 10 l-14 10" fill="none" stroke="{LUZ}" '
           f'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'
           f'<text x="{56+pw+48}" y="425" font-family="Georgia, serif" font-size="14" '
           f'fill="#93A497" text-anchor="middle">colocas</text>'
           f'<text x="{56+pw+48}" y="444" font-family="Georgia, serif" font-size="14" '
           f'fill="#93A497" text-anchor="middle">una roca</text>')
    caps = (f'<text x="{56+pw/2}" y="614" font-family="Georgia, serif" font-size="19" '
            f'fill="#D7E4D6" text-anchor="middle">Antes</text>'
            f'<text x="{56+pw/2}" y="640" font-family="Georgia, serif" font-size="15" '
            f'fill="#8FA093" text-anchor="middle">ladera seca y clara, sin musgo</text>'
            f'<text x="{638+pw/2}" y="614" font-family="Georgia, serif" font-size="19" '
            f'fill="#D7E4D6" text-anchor="middle">Después</text>'
            f'<text x="{638+pw/2}" y="640" font-family="Georgia, serif" font-size="15" '
            f'fill="#8FA093" text-anchor="middle">la misma ladera, cuatro pasos más tarde</text>')
    chain = ''.join([
        marker(96, 700, '1', 'la roca ocupa celdas y tapa la luz'),
        marker(96, 738, '2', 'la sombra cae ladera abajo'),
        marker(638, 700, '3', 'esas celdas retienen la humedad del charco'),
        marker(638, 738, '4', 'el musgo prende donde hay sombra y humedad'),
    ])
    (args.out / 'causalidad.svg').write_text(
        page(left + mid + right, 'La roca cambia el sitio',
             'Una sola acción, cuatro pasos observables. Mismo encuadre, mismo terrario.',
             'P02 · segundo estado · consecuencia',
             caps + chain), encoding='utf-8')

    print(f'Escritos en {args.out}')


if __name__ == '__main__':
    main()
