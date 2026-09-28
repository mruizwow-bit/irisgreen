#!/usr/bin/env python3
"""R62 · P01 · Habitación imposible · arte de concepto (R2).

Genera las láminas originales que pide la orden R62 §4. Todo es SVG autorado
aquí: la geometría sale de la proyección axonométrica que calcula este archivo.
Sin assets de terceros, sin stock, sin calcar obra ajena.

## La mecánica, y por qué el cubo

El tópico del género —girar una pieza hasta que dos bordes que en 3D no se
tocan coinciden en la proyección y se vuelven transitables— es el núcleo de una
IP muy reconocible. La orden lo prohíbe, así que P01 usa otra cosa.

La sala **es un cubo**, y cualquiera de sus seis caras puede hacer de suelo.
Elegir otra cara reorienta la gravedad: las piezas no se mueven ni un milímetro
respecto a la sala, pero lo que era una repisa alta pasa a ser un escalón a
ras, una columna que se alzaba pasa a ser una viga que sobresale de la pared, y
un vano inalcanzable a 2,4 de altura queda a la altura del pie.

Que la sala sea un cubo no es decoración: es lo que hace la regla evidente sin
explicarla, y lo que permite que el selector de suelo sea una miniatura de la
propia sala en vez de un mando direccional.

En R2 los cuatro suelos son **rotaciones de verdad**, no dos dibujos distintos:

    d0  identidad                    cara z=0 hace de suelo
    d1  (x,y,z) → (S−z, y, x)        cara x=0 hace de suelo
    d2  (x,y,z) → (x, z, S−y)        cara y=S hace de suelo
    d3  (x,y,z) → (S−x, y, S−z)      cara z=S hace de suelo

Las cuatro son rotaciones propias (determinante +1), así que la sala no se
espeja nunca. Las piezas y los vanos se definen una sola vez en coordenadas de
la sala y se transforman; por eso el Estado B de la lámina 2 es literalmente el
Estado A visto con otra gravedad, y no una ilustración aparte que podría
mentir.

Tampoco es un puzle de luz: eso es P03. Aquí la luz es material, no mecánica.

## Cómo se dibuja

Pintor por profundidad sobre coordenadas ya transformadas. Cada material lleva
tres degradados —cara superior, cara +y y cara +x—, oclusión de contacto contra
el suelo, filo claro en las aristas que miran a la luz y luz fría de rebote en
las que le dan la espalda. Encima, grano de piedra por turbulencia, velo
atmosférico en el fondo y viñeta.

Uso:  python3 scripts/r62_p01_concepto.py
"""
import argparse
import math
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent

S = 6.0
U = 66.0
KX = U * math.cos(math.radians(30))
KY = U * math.sin(math.radians(30))
KZ = U

MAT = {
    'caliza':  ('#F6ECDA', '#DFCEB0', '#CBB18C', '#A98E6B', '#98805F', '#7A6146', '#5C4B38', '#FFF8EA'),
    'clara':   ('#FBF3E4', '#E6D8BE', '#D3BE9B', '#B29873', '#A08961', '#82694C', '#63503C', '#FFFCF3'),
    'umbra':   ('#B8845C', '#9C6C48', '#8C603F', '#6E482F', '#6A4833', '#4F3324', '#37241A', '#DEB088'),
    'fria':    ('#D5E4E4', '#B2CACD', '#9DB9BD', '#7E9CA3', '#78969D', '#5C7B84', '#405A61', '#ECF6F6'),
}
HUECO = '#191309'
LATON = '#E8CB8A'
SOMBRA = '#0B0806'
REBOTE = '#7FA8B8'

LUZ = (1.02, 0.28)
HAZ = (1.16, 0.32)

DATUMS = {
    0: (lambda x, y, z: (x, y, z), 'z=0'),
    1: (lambda x, y, z: (S - z, y, x), 'x=0'),
    2: (lambda x, y, z: (x, z, S - y), 'y=S'),
    3: (lambda x, y, z: (S - x, y, S - z), 'z=S'),
}


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


class Scene:
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


def xform(d):
    return DATUMS[d][0]


def xbox(d, x, y, z, dx, dy, dz):
    """Caja en coordenadas de sala -> caja alineada en coordenadas de gravedad."""
    f = xform(d)
    cs = [f(x + i * dx, y + j * dy, z + k * dz)
          for i in (0, 1) for j in (0, 1) for k in (0, 1)]
    xs, ys, zs = zip(*cs)
    return (min(xs), min(ys), min(zs),
            max(xs) - min(xs), max(ys) - min(ys), max(zs) - min(zs))


def xrect(d, corners):
    f = xform(d)
    return [f(*c) for c in corners]


def grads():
    out = []
    for name, c in MAT.items():
        out += [
            f'<linearGradient id="g-{name}-t" x1="0.05" y1="0" x2="0.85" y2="1">'
            f'<stop offset="0" stop-color="{c[0]}"/><stop offset="1" stop-color="{c[1]}"/></linearGradient>',
            f'<linearGradient id="g-{name}-l" x1="0" y1="0" x2="0.3" y2="1">'
            f'<stop offset="0" stop-color="{c[2]}"/><stop offset="1" stop-color="{c[3]}"/></linearGradient>',
            f'<linearGradient id="g-{name}-r" x1="1" y1="0" x2="0.15" y2="1">'
            f'<stop offset="0" stop-color="{c[4]}"/><stop offset="1" stop-color="{c[5]}"/></linearGradient>']
    return ''.join(out)


def face(seq, mat, which):
    return poly(seq, f'url(#g-{mat}-{which})', MAT[mat][6], 1.0)


def bevel(seq, mat, idx):
    p = [seq[i] for i in idx]
    return (f'<polyline points="{pts(p)}" fill="none" stroke="{MAT[mat][7]}" '
            f'stroke-width="1.6" opacity="0.55" stroke-linecap="round"/>')


def rimlight(seq, idx):
    p = [seq[i] for i in idx]
    return (f'<polyline points="{pts(p)}" fill="none" stroke="{REBOTE}" '
            f'stroke-width="1.4" opacity="0.28" stroke-linecap="round"/>')


def box_svg(x, y, z, dx, dy, dz, mat='caliza'):
    top = [P(x, y, z + dz), P(x + dx, y, z + dz), P(x + dx, y + dy, z + dz), P(x, y + dy, z + dz)]
    left = [P(x, y + dy, z), P(x + dx, y + dy, z), P(x + dx, y + dy, z + dz), P(x, y + dy, z + dz)]
    right = [P(x + dx, y, z), P(x + dx, y + dy, z), P(x + dx, y + dy, z + dz), P(x + dx, y, z + dz)]
    svg = (face(right, mat, 'r') + poly(right, 'url(#ao)') + rimlight(right, (0, 3))
           + face(left, mat, 'l') + poly(left, 'url(#ao)')
           + face(top, mat, 't') + bevel(top, mat, (3, 0, 1)))
    return svg, top + left + right, top


def cast(footprint, height, blur='blur7'):
    base = [P(a, b, 0) for a, b in footprint]
    far = [P(a + LUZ[0] * height, b + LUZ[1] * height, 0) for a, b in footprint]
    tight = [P(a, b, 0.005) for a, b in footprint]
    return (poly(hull(base + far), SOMBRA, opacity=0.44, extra=f' filter="url(#{blur})"')
            + poly(tight, SOMBRA, opacity=0.40, extra=' filter="url(#blur3)"'))


# ---------------------------------------------------------------- la sala ---

OPENINGS = {
    'entrada': [(4.4, 0, 0), (5.9, 0, 0), (5.9, 0, 2.2), (4.4, 0, 2.2)],
    'salida': [(0, 3.9, 2.4), (0, 5.7, 2.4), (0, 5.7, 4.4), (0, 3.9, 4.4)],
}

PIECES = [
    ('escalon-1', 'box', (1.6, 3.5, 0, 0.7, 1.3, 0.62), 'clara'),
    ('escalon-2', 'box', (2.3, 3.5, 0, 0.7, 1.3, 1.24), 'clara'),
    ('escalon-3', 'box', (3.0, 3.5, 0, 0.7, 1.3, 1.86), 'clara'),
    ('plinto', 'box', (3.4, 1.9, 0, 1.2, 1.2, 1.3), 'umbra'),
    ('columna', 'box', (1.5, 0.9, 0, 0.9, 0.9, 3.6), 'umbra'),
    ('repisa', 'box', (0, 3.9, 1.55, 1.25, 1.8, 0.32), 'fria'),
]


def which_plane(corners, tol=1e-6):
    if all(abs(c[0]) < tol for c in corners):
        return 'x0'
    if all(abs(c[1]) < tol for c in corners):
        return 'y0'
    if all(abs(c[2]) < tol for c in corners):
        return 'z0'
    return None


def build(d, path_cells, gap=None, show_gap_to=None, labels=True, glow_exit=False,
          you_are_here=None):
    sc = Scene()
    t = 0.32

    holes = {'x0': [], 'y0': [], 'z0': []}
    for name, corners in OPENINGS.items():
        tc = xrect(d, corners)
        pl = which_plane(tc)
        if pl:
            holes[pl].append((name, tc))

    # --- los dos muros del fondo ---
    for pl in ('x0', 'y0'):
        if pl == 'x0':
            plane = [P(0, 0, 0), P(0, S, 0), P(0, S, S), P(0, 0, S)]
            outw = lambda p: P(-t, p[1], p[2])
            which = 'l'
        else:
            plane = [P(0, 0, 0), P(S, 0, 0), P(S, 0, S), P(0, 0, S)]
            outw = lambda p: P(p[0], -t, p[2])
            which = 'r'
        hole_paths = ''
        for name, tc in holes[pl]:
            rev = [outw(c) for c in tc]
            sc.add(-200, poly(rev, HUECO), rev)
            if glow_exit and name == 'salida':
                sc.add(-199, poly(rev, '#FFE7BE', opacity=0.5, extra=' filter="url(#blur7)"'))
            hole_paths += ' M' + 'L'.join(f'{a:.1f} {b:.1f}' for a, b in [P(*c) for c in tc]) + 'Z'
        d_attr = ('M' + 'L'.join(f'{a:.1f} {b:.1f}' for a, b in plane) + 'Z' + hole_paths)
        sc.add(-198, f'<path d="{d_attr}" fill="url(#g-caliza-{which})" fill-rule="evenodd" '
                     f'stroke="{MAT["caliza"][6]}" stroke-width="1.1" stroke-linejoin="round"/>', plane)
        sc.add(-197, f'<path d="{d_attr}" fill="url(#ao-wall)" fill-rule="evenodd"/>')
        cap = ([P(0, 0, S), P(0, S, S), P(-t, S, S), P(-t, 0, S)] if pl == 'x0'
               else [P(0, 0, S), P(S, 0, S), P(S, -t, S), P(0, -t, S)])
        sc.add(-196, poly(cap, MAT['caliza'][1], MAT['caliza'][6], 1.0), cap)

    # --- suelo ---
    floor = [P(0, 0, 0), P(S, 0, 0), P(S, S, 0), P(0, S, 0)]
    sc.add(-190, poly(floor, 'url(#g-floor)'), floor)
    n = int(S)
    grid = ''.join(
        f'<line x1="{P(i,0,0)[0]:.1f}" y1="{P(i,0,0)[1]:.1f}" x2="{P(i,S,0)[0]:.1f}" y2="{P(i,S,0)[1]:.1f}" '
        f'stroke="#8E7757" stroke-width="0.9" opacity="0.32"/>'
        f'<line x1="{P(0,i,0)[0]:.1f}" y1="{P(0,i,0)[1]:.1f}" x2="{P(S,i,0)[0]:.1f}" y2="{P(S,i,0)[1]:.1f}" '
        f'stroke="#8E7757" stroke-width="0.9" opacity="0.32"/>' for i in range(1, n))
    sc.add(-189, grid)

    # haz de luz por el vano que quede alto, y su huella en el suelo
    for pl in ('x0', 'y0'):
        for name, tc in holes[pl]:
            zmin = min(c[2] for c in tc)
            if zmin < 1.0:
                # vano a ras: derrame cálido en el umbral
                cx = sum(c[0] for c in tc) / 4
                cy = sum(c[1] for c in tc) / 4
                p = P(cx + 0.9, cy + 0.9, 0)
                sc.add(-188, f'<g clip-path="url(#floorclip)"><ellipse cx="{p[0]:.0f}" cy="{p[1]:.0f}" '
                             f'rx="185" ry="104" fill="#FFE2B4" opacity="0.26" filter="url(#blur30)"/></g>')
                continue
            top3 = [(c[0], c[1], c[2]) for c in tc]
            land = [(a + c * HAZ[0], b + c * HAZ[1], 0.0) for a, b, c in top3]
            beam = hull([P(*q) for q in top3] + [P(*q) for q in land])
            land_svg = poly([P(*q) for q in land], '#FFEBCA', opacity=0.30,
                            extra=' filter="url(#blur7)"')
            sc.add(-187, f'<g clip-path="url(#floorclip)">{land_svg}</g>')
            sc.add(760, poly(beam, 'url(#beam)', None, opacity=0.9, extra=' filter="url(#blur7)"'))

    for a, b in (((0, 0), (0, S)), ((0, 0), (S, 0))):
        p0, p1 = P(*a, 0), P(*b, 0)
        sc.add(-186, f'<line x1="{p0[0]:.1f}" y1="{p0[1]:.1f}" x2="{p1[0]:.1f}" y2="{p1[1]:.1f}" '
                     f'stroke="{SOMBRA}" stroke-width="26" opacity="0.34" filter="url(#blur7)"/>')
    sc.add(-185, poly(floor, 'none', '#5C4B38', 1.5), floor)

    # --- camino ---
    for i, (cx, cy) in enumerate(path_cells):
        q = [P(cx, cy, 0.02), P(cx + 1, cy, 0.02), P(cx + 1, cy + 1, 0.02), P(cx, cy + 1, 0.02)]
        groove = (f'<line x1="{P(cx+0.5,cy+0.16,0.02)[0]:.1f}" y1="{P(cx+0.5,cy+0.16,0.02)[1]:.1f}" '
                  f'x2="{P(cx+0.5,cy+0.84,0.02)[0]:.1f}" y2="{P(cx+0.5,cy+0.84,0.02)[1]:.1f}" '
                  f'stroke="{LATON}" stroke-width="2.4" opacity="0.85" stroke-linecap="round"/>')
        sc.add(cx + cy - 0.6, face(q, 'fria', 't') + bevel(q, 'fria', (3, 0, 1)) + groove, q)

    if path_cells:
        def anchor(cell):
            cx, cy = cell
            if cy == 0:
                return P(cx + 0.5, 0, 0.05)
            if cx == 0:
                return P(0, cy + 0.5, 0.05)
            return None
        centres = [P(cx + 0.5, cy + 0.5, 0.05) for cx, cy in path_cells]
        head, tail = anchor(path_cells[0]), anchor(path_cells[-1])
        if head:
            centres.insert(0, head)
        if tail:
            centres.append(tail)
        sc.add(700, f'<polyline points="{pts(centres)}" fill="none" stroke="{LATON}" '
                    f'stroke-width="3.4" opacity="0.92" stroke-linecap="round" '
                    f'stroke-linejoin="round"/>')
        a, b = centres[0], centres[-1]
        sc.add(701, f'<circle cx="{a[0]:.1f}" cy="{a[1]:.1f}" r="7" fill="{LATON}"/>'
                    f'<circle cx="{b[0]:.1f}" cy="{b[1]:.1f}" r="7" fill="none" '
                    f'stroke="{LATON}" stroke-width="3"/>')

    if gap:
        cx, cy = gap
        q = [P(cx, cy, 0.02), P(cx + 1, cy, 0.02), P(cx + 1, cy + 1, 0.02), P(cx, cy + 1, 0.02)]
        inn = [P(cx + .14, cy + .14, 0.02), P(cx + .86, cy + .14, 0.02),
               P(cx + .86, cy + .86, 0.02), P(cx + .14, cy + .86, 0.02)]
        sc.add(cx + cy - 0.6, poly(q, '#7E6950') + poly(q, SOMBRA, opacity=0.4, extra=' filter="url(#blur3)"')
               + poly(inn, 'none', LATON, 1.8, 0.5), q)

    # --- piezas ---
    for name, kind, spec, mat in PIECES:
        x, y, z, dx, dy, dz = xbox(d, *spec)
        fp = [(x + LUZ[0] * z, y + LUZ[1] * z), (x + dx + LUZ[0] * z, y + LUZ[1] * z),
              (x + dx + LUZ[0] * z, y + dy + LUZ[1] * z), (x + LUZ[0] * z, y + dy + LUZ[1] * z)]
        sc.add(-180 if z > 0.02 else x + y - 0.02, cast(fp, dz, 'blur7' if z < 0.02 else 'blur30'))
        svg, ps, _ = box_svg(x, y, z, dx, dy, dz, mat)
        sc.add(x + y, svg, ps)

    # --- entrada, salida y el salto que falta ---
    if labels:
        for pl in ('x0', 'y0'):
            for name, tc in holes[pl]:
                cx = sum(c[0] for c in tc) / 4
                cy = sum(c[1] for c in tc) / 4
                cz = max(c[2] for c in tc)
                px, py = P(cx, cy, cz + 0.35)
                sc.add(800, f'<text x="{px:.0f}" y="{py:.0f}" font-family="Georgia, serif" '
                            f'font-size="21" fill="{LATON}" text-anchor="middle" '
                            f'letter-spacing="1.6">{name.upper()}</text>')

    if you_are_here:
        cx, cy = you_are_here
        p0 = P(cx + 0.5, cy + 0.5, 0.06)
        sc.add(795, f'<circle cx="{p0[0]:.1f}" cy="{p0[1]:.1f}" r="14" fill="none" '
                    f'stroke="{LATON}" stroke-width="2.6" opacity="0.92"/>'
                    f'<circle cx="{p0[0]:.1f}" cy="{p0[1]:.1f}" r="5.5" fill="{LATON}"/>'
                    f'<line x1="{p0[0]:.1f}" y1="{p0[1]-14:.1f}" x2="{p0[0]:.1f}" y2="{p0[1]-40:.1f}" '
                    f'stroke="{LATON}" stroke-width="2"/>'
                    f'<rect x="{p0[0]-78:.1f}" y="{p0[1]-70:.1f}" width="156" height="30" rx="7" '
                    f'fill="#191207" stroke="{LATON}" stroke-width="1.3"/>'
                    f'<text x="{p0[0]:.1f}" y="{p0[1]-49:.1f}" font-family="Georgia, serif" '
                    f'font-size="17" fill="{LATON}" text-anchor="middle" letter-spacing="1.4">ESTÁS AQUÍ</text>',
               [(p0[0] - 86, p0[1] - 78), (p0[0] + 86, p0[1] + 16)])

    if show_gap_to:
        (gx, gy), zt = show_gap_to
        a, b = P(gx, gy, 0.05), P(gx, gy, zt)
        sc.add(790, f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" '
                    f'stroke="{LATON}" stroke-width="3" stroke-dasharray="9 7" opacity="0.95"/>'
                    f'<path d="M{a[0]-9:.1f} {a[1]:.1f} h18 M{b[0]-9:.1f} {b[1]:.1f} h18" '
                    f'stroke="{LATON}" stroke-width="3" stroke-linecap="round"/>'
                    f'<rect x="{b[0]+10:.1f}" y="{(a[1]+b[1])/2-15:.1f}" width="54" height="30" rx="6" '
                    f'fill="#191207" stroke="{LATON}" stroke-width="1.3"/>'
                    f'<text x="{b[0]+37:.1f}" y="{(a[1]+b[1])/2+6:.1f}" font-family="Georgia, serif" '
                    f'font-size="18" fill="{LATON}" text-anchor="middle">2,4</text>',
               [a, b, (b[0] + 70, b[1])])
    return sc


# ------------------------------------------------------------- selector ---

def mini_room(cx, cy, s, d, active):
    """Miniatura del cubo con la cara que hace de suelo resaltada."""
    kx, ky, kz = s * 0.866, s * 0.5, s
    def q(x, y, z):
        return (cx + (x - y) * kx, cy + (x + y) * ky - z * kz - s * 0.2)
    c = {(i, j, k): q(i, j, k) for i in (0, 1) for j in (0, 1) for k in (0, 1)}
    ink = LATON if active else '#6E6250'
    out = []
    # la cara que pasa a ser suelo, en coordenadas de sala
    faces = {0: [(0,0,0),(1,0,0),(1,1,0),(0,1,0)],
             1: [(0,0,0),(0,1,0),(0,1,1),(0,0,1)],
             2: [(0,1,0),(1,1,0),(1,1,1),(0,1,1)],
             3: [(0,0,1),(1,0,1),(1,1,1),(0,1,1)]}
    fill = [c[v] for v in faces[d]]
    out.append(poly(fill, LATON if active else '#5A5142', opacity=0.42 if active else 0.24))
    edges = [((0,0,0),(1,0,0)), ((1,0,0),(1,1,0)), ((1,1,0),(0,1,0)), ((0,1,0),(0,0,0)),
             ((0,0,1),(1,0,1)), ((1,0,1),(1,1,1)), ((1,1,1),(0,1,1)), ((0,1,1),(0,0,1)),
             ((0,0,0),(0,0,1)), ((1,0,0),(1,0,1)), ((1,1,0),(1,1,1)), ((0,1,0),(0,1,1))]
    hidden = {((0,0,0),(1,0,0)), ((0,1,0),(0,0,0)), ((0,0,0),(0,0,1))}
    for e in edges:
        a, b = c[e[0]], c[e[1]]
        dash = ' stroke-dasharray="3 3"' if e in hidden else ''
        out.append(f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" '
                   f'stroke="{ink}" stroke-width="{1.5 if active else 1.0}" opacity="'
                   f'{1 if active else 0.62}"{dash}/>')
    # chevron de gravedad
    gy = cy + s * 1.05
    out.append(f'<path d="M{cx-7:.1f} {gy:.1f} L{cx:.1f} {gy+8:.1f} L{cx+7:.1f} {gy:.1f}" '
               f'fill="none" stroke="{ink}" stroke-width="{2.2 if active else 1.4}" '
               f'stroke-linecap="round" stroke-linejoin="round" opacity="{1 if active else 0.6}"/>')
    return ''.join(out)


def selector(x, y, active, gap=84, s=21):
    out = [f'<text x="{x + gap*1.5:.0f}" y="{y - 34:.0f}" font-family="Georgia, serif" '
           f'font-size="13" fill="#9C8C74" text-anchor="middle" letter-spacing="1.1">'
           f'QUÉ CARA HACE DE SUELO</text>']
    for i in range(4):
        out.append(mini_room(x + i * gap, y, s, i, i == active))
    return ''.join(out)


def arrow_glyph(x, y, angle, size=7, colour='#A2937B'):
    return (f'<path d="M{-size} {-size*0.7} L0 {size*0.55} L{size} {-size*0.7}" fill="none" '
            f'stroke="{colour}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" '
            f'transform="translate({x} {y}) rotate({angle})"/>')


def keycaps(x, y):
    """Flechas dibujadas, no glifos de fuente."""
    out, cx = [], x
    for ang in (180, 0, 90, -90):
        out.append(f'<rect x="{cx:.0f}" y="{y-13:.0f}" width="24" height="24" rx="5" '
                   f'fill="none" stroke="#5E5344" stroke-width="1.2"/>')
        out.append(arrow_glyph(cx + 12, y - 1, ang, 5.5))
        cx += 28
    out.append(f'<text x="{cx+6:.0f}" y="{y+5:.0f}" font-family="Georgia, serif" font-size="14.5" '
               f'fill="#A2937B">Flechas: mover la pieza · R: girar · 1–4: cambiar de suelo</text>')
    return ''.join(out)


# ---------------------------------------------------------------- salida ---

def defs_block():
    return f'''<defs>
{grads()}
<radialGradient id="void" cx="44%" cy="42%" r="70%">
 <stop offset="0" stop-color="#282018"/><stop offset="0.5" stop-color="#1A1610"/><stop offset="1" stop-color="#0B0907"/>
</radialGradient>
<linearGradient id="g-floor" x1="0.05" y1="0" x2="0.9" y2="1">
 <stop offset="0" stop-color="#E0CEAC"/><stop offset="0.5" stop-color="#C6AF8A"/><stop offset="1" stop-color="#9C8464"/>
</linearGradient>
<linearGradient id="ao" x1="0" y1="1" x2="0" y2="0">
 <stop offset="0" stop-color="#1B1208" stop-opacity="0.48"/><stop offset="0.5" stop-color="#1B1208" stop-opacity="0"/>
</linearGradient>
<linearGradient id="ao-wall" x1="0" y1="1" x2="0" y2="0">
 <stop offset="0" stop-color="#160F07" stop-opacity="0.46"/><stop offset="0.38" stop-color="#160F07" stop-opacity="0"/>
</linearGradient>
<linearGradient id="beam" x1="0.15" y1="0" x2="0.8" y2="1">
 <stop offset="0" stop-color="#FFEFD2" stop-opacity="0.42"/>
 <stop offset="0.55" stop-color="#FFE3B6" stop-opacity="0.17"/>
 <stop offset="1" stop-color="#FFDCA6" stop-opacity="0.02"/>
</linearGradient>
<radialGradient id="vig" cx="47%" cy="47%" r="68%">
 <stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.6"/>
</radialGradient>
<filter id="blur3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="blur7" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="blur30" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="36"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%">
 <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" seed="7" result="n"/>
 <feColorMatrix in="n" type="saturate" values="0"/>
 <feComponentTransfer><feFuncA type="linear" slope="0.5" intercept="0"/></feComponentTransfer>
</filter>
<clipPath id="floorclip"><polygon points="{pts([P(0,0,0), P(S,0,0), P(S,S,0), P(0,S,0)])}"/></clipPath>
</defs>'''


def fitted(sc, w, h, top=0):
    bw, bh = sc.maxx - sc.minx, sc.maxy - sc.miny
    k = min(w / bw, h / bh)
    tx = (w - bw * k) / 2 - sc.minx * k
    ty = top + (h - bh * k) / 2 - sc.miny * k
    return f'<g transform="translate({tx:.1f} {ty:.1f}) scale({k:.4f})">{sc.render()}</g>'


def page(width, height, body, title, subtitle, caption, foot=''):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}" role="img" aria-label="{title}. Arte de concepto original de Iris Green para el piloto Habitación imposible.">
{defs_block()}
<rect width="{width}" height="{height}" fill="url(#void)"/>
<text x="58" y="66" font-family="Georgia, serif" font-size="36" fill="#F4EAD7" letter-spacing="0.3">{title}</text>
<text x="58" y="97" font-family="Georgia, serif" font-size="17" fill="#9C8C74">{subtitle}</text>
{body}
<rect width="{width}" height="{height}" filter="url(#grain)" opacity="0.16" style="mix-blend-mode:overlay" pointer-events="none"/>
<rect width="{width}" height="{height}" fill="url(#vig)" pointer-events="none"/>
{foot}
<text x="{width-58}" y="{height-38}" font-family="Georgia, serif" font-size="15" fill="#8D7E68" text-anchor="end">{caption}</text>
</svg>'''


PATH_A = [(5, 0), (5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (4, 5), (3, 5), (2, 5), (1, 5)]
PATH_B = [(4, 4), (3, 4), (3, 3), (2, 3), (1, 3)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', type=Path, default=REPO / 'editorial/r62/p01-habitacion-imposible')
    args = ap.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)

    # Lámina 1 · Estado A a tamaño completo
    a = build(0, PATH_A, gap=(0, 5), show_gap_to=((0.5, 5.5), 2.4))
    body = fitted(a, 1010, 600, top=132)
    foot = selector(836, 790, 0) + keycaps(58, 846)
    (args.out / 'gameplay.svg').write_text(
        page(1180, 920, body, 'Habitación imposible',
             'La sala es un cubo. Cualquiera de sus caras puede hacer de suelo.',
             'P01 · R2 · imagen principal de gameplay', foot), encoding='utf-8')

    # Lámina 2 · el cambio de suelo, que es la mecánica diferencial
    left = build(0, PATH_A, gap=(0, 5), show_gap_to=((0.5, 5.5), 2.4))
    right = build(2, PATH_B + [(0, 3)], glow_exit=True, you_are_here=(4, 4))
    half = 560
    body2 = (f'<g transform="translate(20 0)">{fitted(left, half, 430, top=160)}'
             f'{selector(148, 640, 0)}'
             f'<text x="222" y="700" font-family="Georgia, serif" font-size="19" fill="#D9CAB0" text-anchor="middle">Estado A · suelo actual</text>'
             f'<text x="222" y="726" font-family="Georgia, serif" font-size="15" fill="#9C8C74" text-anchor="middle">la ruta muere al pie del muro: la salida queda 2,4 por encima</text></g>'
             f'<g transform="translate({half+40} 0)">{fitted(right, half, 430, top=160)}'
             f'{selector(148, 640, 2)}'
             f'<text x="222" y="700" font-family="Georgia, serif" font-size="19" fill="#D9CAB0" text-anchor="middle">Estado B · otra cara hace de suelo</text>'
             f'<text x="222" y="726" font-family="Georgia, serif" font-size="15" fill="#9C8C74" text-anchor="middle">nada se ha movido: la misma salida queda ahora a la altura del pie</text></g>'
             f'<g transform="translate({half+10} 330)">'
             f'<circle cx="0" cy="0" r="27" fill="#1A140D" stroke="{LATON}" stroke-width="1.4"/>'
             f'{arrow_glyph(0, -2, -90, 9, LATON)}'
             f'<text x="0" y="52" font-family="Georgia, serif" font-size="13.5" fill="{LATON}" text-anchor="middle">tecla 3</text></g>')
    (args.out / 'cambio-de-suelo.svg').write_text(
        page(1180, 800, body2, 'Cambiar de suelo',
             'La mecánica diferencial de P01: la misma sala, otra gravedad, otras relaciones.',
             'P01 · R2 · segundo estado'), encoding='utf-8')

    print(f'Escritos en {args.out}')


if __name__ == '__main__':
    main()
