#!/usr/bin/env python3
"""R62 · P01 · Habitación imposible · arte de concepto.

Genera las dos imágenes originales que pide la orden R62 §4: la principal de
gameplay y el detalle de interacción. Son SVG autorados aquí: toda la
geometría sale de la proyección axonométrica que calcula este archivo. Sin
assets de terceros, sin stock, sin calcar obra ajena.

## Por qué esta mecánica y no la obvia

El tópico del género —girar una pieza hasta que dos bordes que en 3D no se
tocan coinciden en la proyección y se vuelven transitables— es la mecánica
central de una IP muy reconocible. La orden la prohíbe, así que P01 usa otra.

Aquí la habitación tiene **cuatro suelos posibles**. La persona elige cuál de
las caras interiores hace de suelo y la gravedad se reorienta: nada cambia de
sitio, pero lo que era un alféizar a media altura pasa a ser un escalón a ras,
y una rampa que subía pasa a bajar. El puzle está en combinar dos verbos
—recolocar piezas y cambiar el suelo— hasta que haya camino continuo entre las
dos aperturas.

La imposibilidad no es un truco de cámara: la sala es coherente de cuatro
maneras incompatibles a la vez.

Tampoco es un puzle de luz: eso es P03, y los seis pilotos deben ser
mecánicamente distintos. Aquí la luz es material, no mecánica.

## Cómo se dibuja

Pintor por profundidad: cada volumen entra en una lista con su clave de
orden (x+y, luego z) y se emite de lejos a cerca, que es lo que evita que una
rampa se cuele por delante de la columna que tiene detrás.

Cada material lleva tres degradados —cara superior, cara +y y cara +x— más
oclusión de contacto contra el suelo y filo claro en las aristas que miran a
la luz. La caliza cálida se lee sobre un vacío oscuro para que la sala sea un
objeto iluminado y no una ficha sobre papel. El camino transitable es piedra
fría con ranura de latón: se distingue por material y por relieve, nunca sólo
por color.

Uso:  python3 scripts/r62_p01_concepto.py
"""
import argparse
import math
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent

U = 62.0
KX = U * math.cos(math.radians(30))
KY = U * math.sin(math.radians(30))
KZ = U

# material -> (cara sup. clara, sup. oscura, +y clara, +y oscura,
#              +x clara, +x oscura, filo, luz de arista)
MAT = {
    'caliza':      ('#F4E9D6', '#DFCFB2', '#C9B08C', '#AD9370', '#977E60', '#7C6549', '#5E4D3A', '#FFF6E6'),
    'caliza_baja': ('#E6D8BE', '#CFBD9C', '#B79E7B', '#9B8161', '#856F53', '#6B563E', '#54442F', '#F6EAD3'),
    'muro':        ('#DCCBAE', '#C3AE8C', '#AE9573', '#937A5B', '#8A7254', '#6E5940', '#51412F', '#F0E2C6'),
    'fria':        ('#CFE1E2', '#AFC8CB', '#9AB5BA', '#7E9BA1', '#74929A', '#5C7A82', '#435C63', '#E8F3F3'),
    'umbra':       ('#C08F68', '#A87753', '#96684A', '#7A5138', '#74513A', '#5A3D2B', '#3B291D', '#E4BC96'),
}
HUECO = '#1E1811'
LATON = '#E3C583'
SOMBRA = '#0E0B08'


def P(x, y, z):
    return ((x - y) * KX, (x + y) * KY - z * KZ)


def pts(seq):
    return ' '.join(f'{a:.1f},{b:.1f}' for a, b in seq)


def poly(seq, fill, stroke=None, width=1.0, opacity=None, extra=''):
    s = f'<polygon points="{pts(seq)}" fill="{fill}"'
    if stroke:
        s += f' stroke="{stroke}" stroke-width="{width}" stroke-linejoin="round"'
    if opacity is not None:
        s += f' opacity="{opacity}"'
    return s + extra + '/>'


class Scene:
    """Lista de dibujo ordenada por profundidad."""

    def __init__(self):
        self.items = []
        self.minx = self.miny = 1e9
        self.maxx = self.maxy = -1e9

    def add(self, key, svg, points=()):
        self.items.append((key, len(self.items), svg))
        for a, b in points:
            self.minx, self.maxx = min(self.minx, a), max(self.maxx, a)
            self.miny, self.maxy = min(self.miny, b), max(self.maxy, b)

    def render(self):
        return ''.join(s for _, _, s in sorted(self.items, key=lambda t: (t[0], t[1])))


def grad_defs():
    out = []
    for name, c in MAT.items():
        out.append(f'<linearGradient id="g-{name}-t" x1="0" y1="0" x2="0.9" y2="1">'
                   f'<stop offset="0" stop-color="{c[0]}"/><stop offset="1" stop-color="{c[1]}"/></linearGradient>')
        out.append(f'<linearGradient id="g-{name}-l" x1="0" y1="0" x2="0.35" y2="1">'
                   f'<stop offset="0" stop-color="{c[2]}"/><stop offset="1" stop-color="{c[3]}"/></linearGradient>')
        out.append(f'<linearGradient id="g-{name}-r" x1="1" y1="0" x2="0.2" y2="1">'
                   f'<stop offset="0" stop-color="{c[4]}"/><stop offset="1" stop-color="{c[5]}"/></linearGradient>')
    return ''.join(out)


def face(seq, mat, which, ao=None):
    c = MAT[mat]
    svg = poly(seq, f'url(#g-{mat}-{which})', c[6], 1.0)
    if ao:
        svg += poly(seq, f'url(#{ao})', None, opacity=1.0)
    return svg


def rim(seq, mat, idx=(3, 0, 1)):
    """Filo claro en las aristas que miran a la luz."""
    c = MAT[mat]
    p = [seq[i] for i in idx]
    return (f'<polyline points="{pts(p)}" fill="none" stroke="{c[7]}" '
            f'stroke-width="1.3" opacity="0.5" stroke-linecap="round"/>')


def box(x, y, z, dx, dy, dz, mat='caliza'):
    top = [P(x, y, z + dz), P(x + dx, y, z + dz), P(x + dx, y + dy, z + dz), P(x, y + dy, z + dz)]
    left = [P(x, y + dy, z), P(x + dx, y + dy, z), P(x + dx, y + dy, z + dz), P(x, y + dy, z + dz)]
    right = [P(x + dx, y, z), P(x + dx, y + dy, z), P(x + dx, y + dy, z + dz), P(x + dx, y, z + dz)]
    svg = (face(right, mat, 'r', 'ao-v') + face(left, mat, 'l', 'ao-v')
           + face(top, mat, 't') + rim(top, mat))
    return svg, top + left + right, top


def ramp(x, y, dx, dy, h, mat='caliza', high='max'):
    """Rampa entre z=0 y z=h. `high` dice en qué extremo de x está lo alto."""
    if high == 'max':
        end = [P(x + dx, y, 0), P(x + dx, y + dy, 0), P(x + dx, y + dy, h), P(x + dx, y, h)]
        side = [P(x, y + dy, 0), P(x + dx, y + dy, 0), P(x + dx, y + dy, h)]
        top = [P(x, y, 0), P(x + dx, y, h), P(x + dx, y + dy, h), P(x, y + dy, 0)]
        svg = (face(end, mat, 'r', 'ao-v') + face(side, mat, 'l', 'ao-v')
               + face(top, mat, 't') + rim(top, mat, (0, 1, 2)))
    else:
        end = [P(x, y, 0), P(x, y + dy, 0), P(x, y + dy, h), P(x, y, h)]
        side = [P(x, y + dy, h), P(x, y + dy, 0), P(x + dx, y + dy, 0)]
        top = [P(x, y, h), P(x + dx, y, 0), P(x + dx, y + dy, 0), P(x, y + dy, h)]
        svg = (face(side, mat, 'l', 'ao-v') + face(end, mat, 'r', 'ao-v')
               + face(top, mat, 't') + rim(top, mat, (0, 3, 2)))
    return svg, end + side + top


def hull(points):
    ps = sorted(set(points))
    if len(ps) < 3:
        return ps

    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    lo = []
    for p in ps:
        while len(lo) >= 2 and cross(lo[-2], lo[-1], p) <= 0:
            lo.pop()
        lo.append(p)
    up = []
    for p in reversed(ps):
        while len(up) >= 2 and cross(up[-2], up[-1], p) <= 0:
            up.pop()
        up.append(p)
    return lo[:-1] + up[:-1]


LUZ = (1.05, 0.30)
# Recorrido horizontal del haz por cada unidad que desciende.
HAZ = (1.18, 0.34)


def light_shaft(opening, spread=0.0):
    """Prisma de luz desde un vano del muro izquierdo hasta el suelo."""
    top3d = [(0.0, a, b) for a, b in opening]
    floor3d = [(x + z * HAZ[0], y + z * HAZ[1] - spread, 0.0) for x, y, z in top3d]
    shaft = hull([P(*q) for q in top3d] + [P(*q) for q in floor3d])
    land = [P(*q) for q in floor3d]
    return (poly(shaft, 'url(#beam)', None, opacity=0.85, extra=' filter="url(#blur6)"'),
            poly(land, '#FFE9C4', None, opacity=0.26, extra=' filter="url(#blur6)"'))


def cast_shadow(footprint, height):
    base = [P(a, b, 0) for a, b in footprint]
    far = [P(a + LUZ[0] * height, b + LUZ[1] * height, 0) for a, b in footprint]
    quad = [P(a, b, 0.004) for a, b in footprint]
    return (poly(hull(base + far), SOMBRA, opacity=0.40, extra=' filter="url(#blur6)"')
            + poly(quad, SOMBRA, opacity=0.34, extra=' filter="url(#blur3)"'))


def build(sc, n=7, h=5.2, selected=None, ghost=None, gap=None, path_tiles=()):
    wall_t = 0.34

    # --- muros, lo más lejano ---
    for plane in ('izq', 'der'):
        if plane == 'izq':
            f = lambda a, b: P(-wall_t, a, b)
            inner = lambda a, b: P(0, a, b)
            which, lo, hi, z0, z1 = 'l', 1.5, 3.4, 2.2, 4.2
        else:
            f = lambda a, b: P(a, -wall_t, b)
            inner = lambda a, b: P(a, 0, b)
            which, lo, hi, z0, z1 = 'r', 3.7, 5.6, 0.0, 2.3

        outer = [inner(0, 0), inner(n, 0), inner(n, h), inner(0, h)]
        hole = [inner(lo, z0), inner(hi, z0), inner(hi, z1), inner(lo, z1)]
        reveal = [f(lo, z0), f(hi, z0), f(hi, z1), f(lo, z1)]
        sc.add(-100, poly(reveal, HUECO), reveal)
        d = ('M' + 'L'.join(f'{a:.1f} {b:.1f}' for a, b in outer) + 'Z M'
             + 'L'.join(f'{a:.1f} {b:.1f}' for a, b in hole) + 'Z')
        sc.add(-99, f'<path d="{d}" fill="url(#g-muro-{which})" fill-rule="evenodd" '
                    f'stroke="{MAT["muro"][6]}" stroke-width="1.1" stroke-linejoin="round"/>',
               outer)
        # Canto superior: da espesor al muro.
        cap = [inner(0, h), inner(n, h), f(n, h), f(0, h)]
        sc.add(-98, poly(cap, MAT['muro'][1], MAT['muro'][6], 1.0), cap)
        # Jamba iluminada del vano.
        jamb = [inner(lo, z0), f(lo, z0), f(lo, z1), inner(lo, z1)]
        sc.add(-97, poly(jamb, MAT['muro'][3], None), jamb)

    # --- suelo ---
    quad = [P(0, 0, 0), P(n, 0, 0), P(n, n, 0), P(0, n, 0)]
    sc.add(-90, poly(quad, 'url(#g-suelo)'), quad)
    grid = ''.join(
        f'<line x1="{P(i,0,0)[0]:.1f}" y1="{P(i,0,0)[1]:.1f}" x2="{P(i,n,0)[0]:.1f}" '
        f'y2="{P(i,n,0)[1]:.1f}" stroke="#8D7757" stroke-width="0.9" opacity="0.40"/>'
        f'<line x1="{P(0,i,0)[0]:.1f}" y1="{P(0,i,0)[1]:.1f}" x2="{P(n,i,0)[0]:.1f}" '
        f'y2="{P(n,i,0)[1]:.1f}" stroke="#8D7757" stroke-width="0.9" opacity="0.40"/>'
        for i in range(1, n))
    sc.add(-89, grid)
    # Pozo de luz sobre el suelo, recortado al propio suelo.
    sc.add(-88, f'<g clip-path="url(#floorclip)"><ellipse cx="{P(4.4,3.0,0)[0]:.0f}" '
                f'cy="{P(4.4,3.0,0)[1]:.0f}" rx="230" ry="150" fill="#FFEFD0" opacity="0.16" '
                f'filter="url(#blur30)"/></g>')
    # Oclusión donde el suelo encuentra los muros.
    for a, b in (((0, 0), (0, n)), ((0, 0), (n, 0))):
        p0, p1 = P(*a, 0), P(*b, 0)
        sc.add(-87, f'<line x1="{p0[0]:.1f}" y1="{p0[1]:.1f}" x2="{p1[0]:.1f}" '
                    f'y2="{p1[1]:.1f}" stroke="{SOMBRA}" stroke-width="22" opacity="0.30" '
                    f'filter="url(#blur6)"/>')
    sc.add(-86, poly(quad, 'none', '#5E4D3A', 1.5), quad)
    # Haz por el vano alto y derrame cálido por el arco de entrada.
    beam, land = light_shaft([(1.5, 4.2), (3.4, 4.2), (3.4, 2.2), (1.5, 2.2)])
    sc.add(-85.5, f'<g clip-path="url(#floorclip)">{land}</g>')
    sc.add(500, beam)
    sc.add(-85.4, f'<g clip-path="url(#floorclip)"><ellipse cx="{P(4.6,0.9,0)[0]:.0f}" '
                  f'cy="{P(4.6,0.9,0)[1]:.0f}" rx="170" ry="96" fill="#FFE4B8" '
                  f'opacity="0.22" filter="url(#blur30)"/></g>')

    # --- losetas del camino ---
    for x, y in path_tiles:
        q = [P(x, y, 0.02), P(x + 1, y, 0.02), P(x + 1, y + 1, 0.02), P(x, y + 1, 0.02)]
        sc.add(x + y - 0.5, face(q, 'fria', 't') + rim(q, 'fria')
               + f'<line x1="{P(x+0.5,y+0.14,0.02)[0]:.1f}" y1="{P(x+0.5,y+0.14,0.02)[1]:.1f}" '
                 f'x2="{P(x+0.5,y+0.86,0.02)[0]:.1f}" y2="{P(x+0.5,y+0.86,0.02)[1]:.1f}" '
                 f'stroke="{LATON}" stroke-width="2.2" opacity="0.8" stroke-linecap="round"/>', q)

    if gap:
        x, y = gap
        q = [P(x, y, 0.02), P(x + 1, y, 0.02), P(x + 1, y + 1, 0.02), P(x, y + 1, 0.02)]
        inner_q = [P(x + .13, y + .13, 0.02), P(x + .87, y + .13, 0.02),
                   P(x + .87, y + .87, 0.02), P(x + .13, y + .87, 0.02)]
        sc.add(x + y - 0.5, poly(q, '#8A7254') + poly(q, SOMBRA, opacity=0.35,
               extra=' filter="url(#blur3)"') + poly(inner_q, 'none', LATON, 1.8, 0.55), q)

    # --- volúmenes ---
    def place(key, svg, points=()):
        sc.add(key, svg, points)

    # rampa que sube hacia el plinto
    s, p = ramp(1.3, 4.6, 1.8, 1.1, 1.5, high='min')
    place(1.3 + 4.6 - 0.01, cast_shadow([(1.3, 4.6), (3.1, 4.6), (3.1, 5.7), (1.3, 5.7)], 1.5))
    place(1.3 + 4.6, s, p)

    # escalera contra el muro izquierdo
    for i in range(3):
        s, p, _ = box(0.5 + i * 0.52, 2.0, 0, 0.52, 1.2, 0.58 * (i + 1), 'caliza_baja')
        place(0.5 + i * 0.52 + 2.0 - 0.01,
              cast_shadow([(0.5 + i * .52, 2.0), (1.02 + i * .52, 2.0),
                           (1.02 + i * .52, 3.2), (0.5 + i * .52, 3.2)], 0.58 * (i + 1)))
        place(0.5 + i * 0.52 + 2.0, s, p)

    # columna
    place(2.2 + 1.2 - 0.01, cast_shadow([(2.2, 1.2), (3.0, 1.2), (3.0, 2.0), (2.2, 2.0)], 3.6))
    s, p, _ = box(2.2, 1.2, 0, 0.8, 0.8, 3.6, 'umbra')
    place(2.2 + 1.2, s, p)

    # balcón volado desde el muro izquierdo, a la altura del vano alto
    s, p, _ = box(0, 1.5, 2.2, 1.4, 1.9, 0.30, 'fria')
    place(0 + 1.5, s, p)

    # plinto (la pieza que se manipula)
    px, py = (selected or (4.4, 1.7))
    place(px + py - 0.01, cast_shadow([(px, py), (px + 1.2, py), (px + 1.2, py + 1.2), (px, py + 1.2)], 2.7))
    s, p, top = box(px, py, 0, 1.2, 1.2, 2.7, 'umbra')
    sel = ''
    if selected:
        sel = poly(top, 'none', LATON, 2.8)
        for cx, cy in top:
            sel += (f'<rect x="{cx-4.8:.1f}" y="{cy-4.8:.1f}" width="9.6" height="9.6" '
                    f'fill="{LATON}" stroke="#241C13" stroke-width="1.1"/>')
    place(px + py, s + sel, p)

    if ghost:
        gx, gy = ghost
        q = [P(gx, gy, 0.03), P(gx + 1.2, gy, 0.03), P(gx + 1.2, gy + 1.2, 0.03), P(gx, gy + 1.2, 0.03)]
        sc.add(gx + gy + 0.2, poly(q, LATON, opacity=0.12)
               + poly(q, 'none', LATON, 1.8, 0.8, extra=' stroke-dasharray="7 5"'), q)
    return sc


def datum_dial(cx, cy, active=0):
    out = [f'<circle cx="{cx}" cy="{cy}" r="37" fill="#171309" fill-opacity="0.75" '
           f'stroke="#4E4130" stroke-width="1.2"/>']
    for i in range(4):
        a = math.radians(45 + i * 90)
        px, py = cx + math.cos(a) * 24, cy + math.sin(a) * 24
        on = (i == active)
        out.append(f'<rect x="{px-7:.1f}" y="{py-7:.1f}" width="14" height="14" '
                   f'transform="rotate(45 {px:.1f} {py:.1f})" '
                   f'fill="{LATON if on else "none"}" stroke="{LATON if on else "#7E6C52"}" '
                   f'stroke-width="{2.2 if on else 1.2}"/>')
    out.append(f'<circle cx="{cx}" cy="{cy}" r="3" fill="#7E6C52"/>')
    return ''.join(out)


def emit(sc, width, height, title, subtitle, caption, dial=0, hints=None, n=7):
    pad = 58
    w, hh = sc.maxx - sc.minx, sc.maxy - sc.miny
    scale = min((width - pad * 2) / w, (height - 210) / hh)
    tx = (width - w * scale) / 2 - sc.minx * scale
    ty = 128 - sc.miny * scale + max(0, (height - 210 - hh * scale) / 2)

    floorclip = ('<clipPath id="floorclip"><polygon points="'
                 + pts([P(0, 0, 0), P(n, 0, 0), P(n, n, 0), P(0, n, 0)]) + '"/></clipPath>')

    hint_svg = ''
    if hints:
        hy = height - 40
        for line in reversed(hints):
            hint_svg = (f'<text x="{pad}" y="{hy}" font-family="ui-monospace, Menlo, monospace" '
                        f'font-size="13.5" fill="#9A8A70">{line}</text>') + hint_svg
            hy -= 22

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}" role="img" aria-label="{title} · arte de concepto de Iris Green">
<defs>
{grad_defs()}
<radialGradient id="void" cx="46%" cy="44%" r="68%">
 <stop offset="0" stop-color="#241F19"/><stop offset="0.55" stop-color="#191511"/><stop offset="1" stop-color="#0E0C0A"/>
</radialGradient>
<linearGradient id="g-suelo" x1="0.1" y1="0" x2="0.9" y2="1">
 <stop offset="0" stop-color="#D8C6A6"/><stop offset="0.55" stop-color="#C3AC88"/><stop offset="1" stop-color="#A28B69"/>
</linearGradient>
<linearGradient id="beam" x1="0.1" y1="0" x2="0.75" y2="1">
 <stop offset="0" stop-color="#FFEBC8" stop-opacity="0.30"/>
 <stop offset="0.6" stop-color="#FFE0AE" stop-opacity="0.13"/>
 <stop offset="1" stop-color="#FFD9A0" stop-opacity="0.03"/>
</linearGradient>
<radialGradient id="vig" cx="48%" cy="48%" r="66%">
 <stop offset="0.55" stop-color="#000000" stop-opacity="0"/>
 <stop offset="1" stop-color="#000000" stop-opacity="0.55"/>
</radialGradient>
<linearGradient id="ao-v" x1="0" y1="1" x2="0" y2="0">
 <stop offset="0" stop-color="#20180F" stop-opacity="0.42"/><stop offset="0.45" stop-color="#20180F" stop-opacity="0"/>
</linearGradient>
<filter id="blur3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="blur6" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
<filter id="blur30" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="34"/></filter>
{floorclip}
</defs>
<rect width="{width}" height="{height}" fill="url(#void)"/>
<text x="{pad}" y="64" font-family="Georgia, serif" font-size="35" fill="#F1E6D2" letter-spacing="0.3">{title}</text>
<text x="{pad}" y="94" font-family="Georgia, serif" font-size="16.5" fill="#9A8A70">{subtitle}</text>
{datum_dial(width - pad - 38, 74, dial)}
<text x="{width - pad - 38}" y="132" font-family="Georgia, serif" font-size="12.5" fill="#8B7C67" text-anchor="middle">suelo activo</text>
<g transform="translate({tx:.1f} {ty:.1f}) scale({scale:.4f})">{sc.render()}</g>
<rect width="{width}" height="{height}" fill="url(#vig)" pointer-events="none"/>
{hint_svg}
<text x="{width - pad}" y="{height - 40}" font-family="Georgia, serif" font-size="14.5" fill="#8B7C67" text-anchor="end">{caption}</text>
</svg>'''


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', type=Path, default=REPO / 'editorial/r62/p01-habitacion-imposible')
    args = ap.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)

    sc = build(Scene(), path_tiles=[(5, 5), (4, 5), (3, 5)])
    (args.out / 'gameplay.svg').write_text(
        emit(sc, 1180, 860, 'Habitación imposible',
             'La misma sala es coherente de cuatro maneras incompatibles',
             'P01 · imagen principal de gameplay', dial=0), encoding='utf-8')

    sc2 = build(Scene(), selected=(4.4, 1.7), ghost=(4.4, 3.1), gap=(3, 5),
                path_tiles=[(5, 5), (4, 5)])
    (args.out / 'interaccion.svg').write_text(
        emit(sc2, 1180, 860, 'El momento de decidir',
             'Falta una loseta. Girar el plinto la cubre; cambiar de suelo, también',
             'P01 · detalle de interacción', dial=0,
             hints=['↑↓←→ mover la pieza · R girar · 1–4 cambiar de suelo',
                    'Enter soltar · Esc deshacer la selección · Tab siguiente pieza']),
        encoding='utf-8')

    print(f'Escritos en {args.out}')


if __name__ == '__main__':
    main()
