#!/usr/bin/env python3
"""R62 · P01 · Habitación imposible · escena.

`R62_P01_HABITACION_E4_HUMAN_APPROVED` · primera referencia E4 aprobada.

El motor vivía aquí dentro. La referencia E4 dejó escrito que el reparto entre
motor y escena «lo dirá el segundo piloto que lo use», y P02 ya está delante,
así que el rasterizado, la sombra, la oclusión, la atmósfera, la composición y
la capa de chrome se han ido a `scripts/ig_render_e4.py`. Lo que queda aquí es
lo que de verdad es P01: su cámara axonométrica, sus materiales de sillería, su
geometría, su luz y su vacío.

**La lámina no cambia.** La extracción sólo vale si las cuatro salidas siguen
siendo idénticas byte a byte, y eso lo comprueba
`scripts/test_e4_motor_identico.py`. Si alguna vez deja de cumplirse, el fallo
es de la extracción y no de P01.

Qué hace el motor, en corto: rasterizado diferido sobre búferes —cada cara es
un paralelogramo en pantalla, así que la bilineal se invierte con un 2×2 y cada
píxel sabe su posición exacta en el mundo—, texturas fBm por coordenadas de
mundo con proyección triplanar, clave direccional con Blinn-Phong por rugosidad
y ambiente hemisférico, sombra por marcha de rayo con cuatro direcciones
promediadas, oclusión por horizonte, y niebla, grano y viñeta al final.

Determinista: semilla fija, sin reloj.

Uso:  python3 scripts/r62_p01_render.py
"""
import argparse
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
import ig_render_e4 as e4
from ig_render_e4 import blit_quad, box, T, label_plate, chrome_bands

REPO = Path(__file__).resolve().parent.parent

SS = 2                       # supermuestreo
OUT_W, OUT_H = 1180, 880
TOP_ROOM = 0.0               # banda reservada arriba, en píxeles internos
BOT_ROOM = 0.0
TOP_OUT = BOT_OUT = 0.0      # las mismas bandas, en píxeles de salida

S = 6.0                      # lado de la sala cúbica

# Sillería: (albedo, rugosidad, fuerza de relieve, escala de textura)
MATS = {
    'caliza':   ((0.82, 0.73, 0.59), 0.74, 0.85, 1.6),
    'clara':    ((0.90, 0.83, 0.70), 0.70, 0.70, 1.9),
    'umbra':    ((0.53, 0.35, 0.24), 0.66, 1.05, 2.1),
    'fria':     ((0.34, 0.44, 0.47), 0.40, 0.72, 2.6),
    'suelo':    ((0.56, 0.47, 0.34), 0.82, 1.45, 1.15),
    'muro':     ((0.62, 0.54, 0.42), 0.80, 1.10, 1.35),
    'laton':    ((0.86, 0.68, 0.36), 0.22, 0.30, 3.0),
}

# Despiece: (ancho de pieza, altura de hilada, traba). None = pieza única.
COURSING = {
    'muro': (0.98, 0.44, 0.5),      # sillería a soga
    'suelo': (1.00, 1.00, 0.0),     # losas a junta corrida
    'caliza': (0.62, 0.40, 0.5),
    'clara': None,
    'umbra': None,
    'fria': None,
    'laton': None,
}

# Rasgos por material. La humedad sube en toda la sala: es una sala de piedra
# enterrada. Los estratos sólo en los materiales que representan roca en banco.
FEATURES = {m: {'humedad'} for m in MATS}
for m in ('caliza', 'clara', 'muro', 'suelo'):
    FEATURES[m].add('estratos')

LIGHT = np.array([-0.46, -0.30, 0.84])
LIGHT /= np.linalg.norm(LIGHT)


def _fit(W, H, margin=0.055):
    """Escala y centro para que la sala llene el lienzo con margen."""
    c30, s30 = math.cos(math.radians(30)), math.sin(math.radians(30))
    pts = [((x - y) * c30, (x + y) * s30 - z)
           for x in (-0.34, S) for y in (-0.34, S) for z in (0.0, S)]
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    avail_h = H - TOP_ROOM - BOT_ROOM
    u = min(W * (1 - 2 * margin) / (max(xs) - min(xs)),
            avail_h * (1 - 2 * margin) / (max(ys) - min(ys)))
    cy = TOP_ROOM + avail_h / 2
    return u, W / 2 - (max(xs) + min(xs)) / 2 * u, cy - (max(ys) + min(ys)) / 2 * u


def configure(out_w, out_h, top=0.0, bot=0.0, margin=0.055):
    """Fija lienzo y encuadre. El móvil reserva banda para la interfaz."""
    global OUT_W, OUT_H, TOP_ROOM, BOT_ROOM, TOP_OUT, BOT_OUT
    OUT_W, OUT_H = out_w, out_h
    W, H = out_w * SS, out_h * SS
    TOP_ROOM, BOT_ROOM = top * SS, bot * SS
    TOP_OUT, BOT_OUT = top, bot
    u, ox, oy = _fit(W, H, margin)
    e4.setup(e4.Axonometric(u, ox, oy), MATS, out_w, out_h, ss=SS,
             coursing=COURSING, features=FEATURES, top=top, bot=bot)


def backdrop(W, H):
    """El vacío de la sala. Es obra, no fondo de página."""
    bg = np.zeros((H, W, 3), np.float32)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    r = np.sqrt(((xx - W * 0.44) / (W * 0.74)) ** 2 + ((yy - H * 0.42) / (H * 0.74)) ** 2)
    bg += np.array([0.062, 0.052, 0.040])[None, None, :] * np.clip(1.25 - r, 0, 1)[..., None]
    bg += np.array([0.013, 0.012, 0.010])[None, None, :]
    return bg


def lighting(buf):
    """Clave, ambiente hemisférico, derrame del vano alto y rebote del suelo."""
    return e4.shade(
        buf, LIGHT,
        key=np.array([1.00, 0.88, 0.70], np.float32),
        sky=np.array([0.30, 0.37, 0.46], np.float32),
        bounce=np.array([0.30, 0.21, 0.13], np.float32),
        bounce_k=np.array([0.36, 0.26, 0.16], np.float32),
        fog=np.array([0.055, 0.046, 0.038], np.float32),
        spill=(np.array([0.0, 4.8, 3.4], np.float32),
               np.array([1.00, 0.86, 0.62], np.float32), 3.2, 0.55))


# --------------------------------------------------------------- geometría ---

def wall_with_hole(buf, plane, hole, mat='muro'):
    """Muro con vano: se pinta en cuatro bandas para dejar el hueco vacío."""
    lo, hi, z0, z1 = hole
    bands = [(0, lo, 0, S), (hi, S, 0, S), (lo, hi, 0, z0), (lo, hi, z1, S)]
    for a, b, c, d in bands:
        if b - a <= 1e-6 or d - c <= 1e-6:
            continue
        if plane == 'x0':
            blit_quad(buf, [(0, a, c), (0, b, c), (0, b, d), (0, a, d)], mat)
        else:
            blit_quad(buf, [(a, 0, c), (b, 0, c), (b, 0, d), (a, 0, d)], mat)
    # mocheta: da espesor al vano
    t = 0.34
    if plane == 'x0':
        blit_quad(buf, [(-t, lo, z0), (-t, hi, z0), (-t, hi, z1), (-t, lo, z1)], mat, 0.42)
        blit_quad(buf, [(-t, lo, z0), (0, lo, z0), (0, lo, z1), (-t, lo, z1)], mat, 0.7)
    else:
        blit_quad(buf, [(lo, -t, z0), (hi, -t, z0), (hi, -t, z1), (lo, -t, z1)], mat, 0.42)
        blit_quad(buf, [(lo, -t, z0), (lo, 0, z0), (lo, 0, z1), (lo, -t, z1)], mat, 0.7)


PIECES = [
    # escalera, con mamperlán volado en cada peldaño
    ((1.6, 3.5, 0, 0.7, 1.3, 0.62), 'clara'),
    ((1.56, 3.46, 0.56, 0.78, 1.38, 0.07), 'clara'),
    ((2.3, 3.5, 0, 0.7, 1.3, 1.24), 'clara'),
    ((2.26, 3.46, 1.18, 0.78, 1.38, 0.07), 'clara'),
    ((3.0, 3.5, 0, 0.7, 1.3, 1.86), 'clara'),
    ((2.96, 3.46, 1.80, 0.78, 1.38, 0.07), 'clara'),
    # plinto, con tapa achaflanada
    ((3.4, 1.9, 0, 1.2, 1.2, 1.30), 'umbra'),
    ((3.32, 1.82, 1.30, 1.36, 1.36, 0.14), 'umbra'),
    # columna, con basa y capitel
    ((1.38, 0.78, 0, 1.14, 1.14, 0.22), 'umbra'),
    ((1.5, 0.9, 0.22, 0.9, 0.9, 3.16), 'umbra'),
    ((1.38, 0.78, 3.38, 1.14, 1.14, 0.24), 'umbra'),
    # repisa fría bajo el vano alto
    ((0, 3.9, 1.55, 1.25, 1.8, 0.32), 'fria'),
]

# Zócalo corrido al pie de los dos muros: articula el encuentro con el suelo.
SKIRTING = [
    ((0.0, 0.0, 0.0, 0.14, S, 0.42), 'muro'),
    ((0.0, 0.0, 0.0, S, 0.14, 0.42), 'muro'),
]
PATH = [(5, 0), (5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (4, 5), (3, 5), (2, 5), (1, 5)]


def build_scene(buf):
    wall_with_hole(buf, 'x0', (3.9, 5.7, 2.4, 4.4))
    wall_with_hole(buf, 'y0', (4.4, 5.9, 0.0, 2.2))
    blit_quad(buf, [(0, 0, 0), (S, 0, 0), (S, S, 0), (0, S, 0)], 'suelo')
    for cx, cy in PATH:
        blit_quad(buf, [(cx, cy, 0.02), (cx + 1, cy, 0.02),
                        (cx + 1, cy + 1, 0.02), (cx, cy + 1, 0.02)], 'fria')
        blit_quad(buf, [(cx + 0.44, cy + 0.08, 0.035), (cx + 0.56, cy + 0.08, 0.035),
                        (cx + 0.56, cy + 0.92, 0.035), (cx + 0.44, cy + 0.92, 0.035)], 'laton')
    for spec, mat in SKIRTING:
        box(buf, *spec, mat)
    for spec, mat in PIECES:
        box(buf, *spec, mat)


# ----------------------------- capa vectorial de chrome sobre el raster ---

def po(p):
    """Proyecta a coordenadas de la imagen de salida."""
    x, y = e4.CAM.project(p)
    return (x / SS, y / SS)


def mini_room(cx, cy, s, datum, active):
    kx, ky, kz = s * 0.866, s * 0.5, s
    c = {(i, j, k): (cx + (i - j) * kx, cy + (i + j) * ky - k * kz - s * 0.2)
         for i in (0, 1) for j in (0, 1) for k in (0, 1)}
    ink = T("accent") if active else T("border-control")
    faces = {0: [(0,0,0),(1,0,0),(1,1,0),(0,1,0)], 1: [(0,0,0),(0,1,0),(0,1,1),(0,0,1)],
             2: [(0,1,0),(1,1,0),(1,1,1),(0,1,1)], 3: [(0,0,1),(1,0,1),(1,1,1),(0,1,1)]}
    pts = ' '.join(f'{c[v][0]:.1f},{c[v][1]:.1f}' for v in faces[datum])
    out = [f'<polygon points="{pts}" fill="{T("accent")}" '
           f'opacity="{0.42 if active else 0.20}"/>']
    edges = [((0,0,0),(1,0,0)),((1,0,0),(1,1,0)),((1,1,0),(0,1,0)),((0,1,0),(0,0,0)),
             ((0,0,1),(1,0,1)),((1,0,1),(1,1,1)),((1,1,1),(0,1,1)),((0,1,1),(0,0,1)),
             ((0,0,0),(0,0,1)),((1,0,0),(1,0,1)),((1,1,0),(1,1,1)),((0,1,0),(0,1,1))]
    hidden = {((0,0,0),(1,0,0)), ((0,1,0),(0,0,0)), ((0,0,0),(0,0,1))}
    for e in edges:
        a, b = c[e[0]], c[e[1]]
        dash = ' stroke-dasharray="3 3"' if e in hidden else ''
        out.append(f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" '
                   f'stroke="{ink}" stroke-width="{1.5 if active else 1.0}" '
                   f'opacity="{1 if active else 0.6}"{dash}/>')
    out.append(f'<path d="M{cx-7:.1f} {cy+s*1.05:.1f} L{cx:.1f} {cy+s*1.05+8:.1f} '
               f'L{cx+7:.1f} {cy+s*1.05:.1f}" fill="none" stroke="{ink}" '
               f'stroke-width="{2.2 if active else 1.4}" stroke-linecap="round" '
               f'stroke-linejoin="round"/>')
    return ''.join(out)


def overlay_movil(data_uri):
    """Composición vertical propia. El §12 permite cambiar la disposición y
    ocultar detalle secundario; lo que prohíbe es encoger el escritorio."""
    o = []
    pts = [po((5.5, 0.0, 0.05))] + [po((cx + 0.5, cy + 0.5, 0.05)) for cx, cy in PATH]
    o.append('<polyline points="' + ' '.join(f'{a:.1f},{b:.1f}' for a, b in pts) +
             f'" fill="none" stroke="{T("accent")}" stroke-width="3" opacity="0.95" '
             f'stroke-linecap="round" stroke-linejoin="round"/>')
    a0, end = pts[0], pts[-1]
    o.append(f'<circle cx="{a0[0]:.1f}" cy="{a0[1]:.1f}" r="6" fill="{T("accent")}"/>'
             f'<circle cx="{end[0]:.1f}" cy="{end[1]:.1f}" r="6" fill="none" '
             f'stroke="{T("accent")}" stroke-width="2.6"/>')

    lo, hi = po((0.5, 5.5, 0.05)), po((0.5, 5.5, 2.4))
    o.append(f'<line x1="{lo[0]:.1f}" y1="{lo[1]:.1f}" x2="{hi[0]:.1f}" y2="{hi[1]:.1f}" '
             f'stroke="{T("accent")}" stroke-width="2.4" stroke-dasharray="8 6" opacity="0.95"/>'
             f'<rect x="{hi[0]-24:.1f}" y="{(lo[1]+hi[1])/2-14:.1f}" width="48" height="28" '
             f'rx="6" fill="{T("bg-surface")}" fill-opacity="0.92" stroke="{T("accent")}" stroke-width="1.2"/>'
             f'<text x="{hi[0]:.1f}" y="{(lo[1]+hi[1])/2+6:.1f}" font-family="Georgia, serif" '
             f'font-size="16" fill="{T("accent")}" text-anchor="middle">2,4</text>')

    for label, wp in (('ENTRADA', (5.15, 0.0, 2.6)), ('SALIDA', (0.0, 4.8, 4.8))):
        px, py = po(wp)
        px = min(max(px, 62), OUT_W - 62)
        o.append(label_plate(px, py, label, 15, 1.4))

    # selector: fila de objetivos de 60 px bajo la escena, no miniaturas
    base = OUT_H - 104
    o.append(f'<text x="{OUT_W/2}" y="{base-16:.0f}" font-family="Georgia, serif" '
             f'font-size="12.5" fill="{T("text-muted")}" text-anchor="middle" letter-spacing="1">'
             f'QUÉ CARA HACE DE SUELO</text>')
    for i in range(4):
        cx = OUT_W / 2 - 133 + i * 89
        # Objetivo táctil de 60 px. El seleccionado se marca con acento y no con
        # latón: el latón es el material del suelo dentro de la escena, y aquí
        # esto es un control. Medido sobre la banda clara, el anillo de latón
        # daba 1,48:1 —por debajo del 3:1 que pide el 1.4.11— mientras que el
        # acento da 6,68:1 en claro y 9,71:1 en navy. El blanco al 7 % que había
        # de relleno también se va: la §3 lo retira como superficie.
        sel = i == 0
        o.append(f'<rect x="{cx-30:.0f}" y="{base:.0f}" width="60" height="60" rx="11" '
                 f'fill="{T("bg-surface-soft") if sel else T("bg-surface")}" '
                 f'stroke="{T("accent") if sel else T("border-control")}" '
                 f'stroke-width="{2 if sel else 1}"/>')
        o.append(mini_room(cx, base + 40, 14, i, i == 0))

    o.append(f'<text x="{OUT_W/2}" y="{OUT_H-16}" font-family="Georgia, serif" font-size="14.5" '
             f'fill="{T("text-muted")}" text-anchor="middle">Toca una pieza y luego su destino</text>')

    return (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
            f'viewBox="0 0 {OUT_W} {OUT_H}" width="{OUT_W}" height="{OUT_H}" role="img" '
            f'aria-label="Habitación imposible en vertical. Sala cúbica de piedra con el '
            f'recorrido entre la entrada y la salida, y el selector de suelo debajo.">'
            f'<image href="{data_uri}" xlink:href="{data_uri}" x="0" y="0" '
            f'width="{OUT_W}" height="{OUT_H}"/>'
            + chrome_bands() +
            f'<text x="18" y="36" font-family="Georgia, serif" font-size="24" fill="{T("text")}">'
            f'Habitación imposible</text>'
            f'<text x="18" y="58" font-family="Georgia, serif" font-size="13" fill="{T("text-muted")}">'
            f'La sala es un cubo. Cualquier cara puede ser el suelo.</text>'
            + ''.join(o) + '</svg>')


def overlay_svg(data_uri):
    o = []
    # recorrido: eje de latón que toca los dos vanos
    pts = [po((5.5, 0.0, 0.05))] + [po((cx + 0.5, cy + 0.5, 0.05)) for cx, cy in PATH]
    o.append('<polyline points="' + ' '.join(f'{a:.1f},{b:.1f}' for a, b in pts) +
             f'" fill="none" stroke="{T("accent")}" stroke-width="3.2" opacity="0.92" '
             f'stroke-linecap="round" stroke-linejoin="round"/>')
    a0 = pts[0]
    o.append(f'<circle cx="{a0[0]:.1f}" cy="{a0[1]:.1f}" r="6.5" fill="{T("accent")}"/>')
    end = pts[-1]
    o.append(f'<circle cx="{end[0]:.1f}" cy="{end[1]:.1f}" r="6.5" fill="none" '
             f'stroke="{T("accent")}" stroke-width="2.8"/>')

    # la cota del salto que bloquea
    lo, hi = po((0.5, 5.5, 0.05)), po((0.5, 5.5, 2.4))
    o.append(f'<line x1="{lo[0]:.1f}" y1="{lo[1]:.1f}" x2="{hi[0]:.1f}" y2="{hi[1]:.1f}" '
             f'stroke="{T("accent")}" stroke-width="2.6" stroke-dasharray="9 7" opacity="0.95"/>'
             f'<path d="M{lo[0]-9:.1f} {lo[1]:.1f} h18 M{hi[0]-9:.1f} {hi[1]:.1f} h18" '
             f'stroke="{T("accent")}" stroke-width="2.6" stroke-linecap="round"/>'
             f'<rect x="{hi[0]+12:.1f}" y="{(lo[1]+hi[1])/2-15:.1f}" width="52" height="30" '
             f'rx="6" fill="{T("bg-surface")}" fill-opacity="0.92" stroke="{T("accent")}" stroke-width="1.2"/>'
             f'<text x="{hi[0]+38:.1f}" y="{(lo[1]+hi[1])/2+6:.1f}" font-family="Georgia, serif" '
             f'font-size="17" fill="{T("accent")}" text-anchor="middle">2,4</text>')

    # rótulos de los vanos
    for label, wp in (('ENTRADA', (5.15, 0.0, 2.55)), ('SALIDA', (0.0, 4.8, 4.75))):
        px, py = po(wp)
        o.append(label_plate(px, py, label, 19, 1.8))

    # Selector espacial. El rótulo va al lado de los cubos y no encima: encima
    # caía dentro del stage, o sea texto de interfaz sobre la piedra, que es
    # justo lo que la placa existe para evitar. Al lado cabe en la banda de
    # chrome, donde `text-muted` tiene su propio fondo detrás.
    o.append(f'<text x="{OUT_W-362}" y="{OUT_H-88}" font-family="Georgia, serif" font-size="12.5" '
             f'fill="{T("text-muted")}" text-anchor="end" letter-spacing="1.1">QUÉ CARA HACE DE SUELO</text>')
    for i in range(4):
        o.append(mini_room(OUT_W - 300 + i * 76, OUT_H - 94, 19, i, i == 0))

    # teclas dibujadas, no glifos de fuente
    kx = 44
    for ang in (180, 0, 90, -90):
        o.append(f'<rect x="{kx}" y="{OUT_H-76}" width="24" height="24" rx="5" fill="none" '
                 f'stroke="{T("text-muted")}" stroke-width="1.2"/>'
                 f'<path d="M-5.5 -4 L0 3 L5.5 -4" fill="none" stroke="{T("text-muted")}" stroke-width="2" '
                 f'stroke-linecap="round" stroke-linejoin="round" '
                 f'transform="translate({kx+12} {OUT_H-63}) rotate({ang})"/>')
        kx += 28
    o.append(f'<text x="{kx+8}" y="{OUT_H-57}" font-family="Georgia, serif" font-size="14.5" '
             f'fill="{T("text-muted")}">Flechas: mover la pieza · R: girar · 1–4: cambiar de suelo</text>')

    return (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
            f'viewBox="0 0 {OUT_W} {OUT_H}" width="{OUT_W}" height="{OUT_H}" role="img" '
            f'aria-label="Habitación imposible. Render de concepto de Iris Green: sala cúbica '
            f'de piedra con el recorrido marcado entre la entrada y la salida.">'
            f'<image href="{data_uri}" xlink:href="{data_uri}" x="0" y="0" '
            f'width="{OUT_W}" height="{OUT_H}"/>'
            + chrome_bands() +
            f'<text x="44" y="58" font-family="Georgia, serif" font-size="33" fill="{T("text")}" '
            f'letter-spacing="0.3">Habitación imposible</text>'
            f'<text x="44" y="86" font-family="Georgia, serif" font-size="16" fill="{T("text-muted")}">'
            f'La sala es un cubo. Cualquiera de sus caras puede hacer de suelo.</text>'
            + ''.join(o) +
            f'<text x="{OUT_W-44}" y="{OUT_H-26}" font-family="Georgia, serif" font-size="14" '
            f'fill="{T("text-muted")}" text-anchor="end">P01 · render first-party · norma visual sep 2026</text>'
            f'</svg>')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', type=Path, default=REPO / 'editorial/r62/p01-habitacion-imposible')
    args = ap.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)

    e4.set_textures(e4.fbm_tile(octaves=5, gain=0.55, lowest=8, seed=7),
                    e4.fbm_tile(octaves=5, gain=0.60, lowest=24, seed=23))

    import base64, io

    def render(name, w, h, overlay, top=0.0, bot=0.0, margin=0.055):
        configure(w, h, top, bot, margin)
        buf = e4.Buffers()
        build_scene(buf)
        im = Image.fromarray((e4.compose(lighting(buf), buf, backdrop) * 255 + 0.5).astype(np.uint8))
        im = im.resize((OUT_W, OUT_H), Image.LANCZOS)
        im.save(args.out / f'{name}.webp', quality=92, method=6)
        bio = io.BytesIO()
        im.save(bio, 'WEBP', quality=90, method=6)
        uri = 'data:image/webp;base64,' + base64.b64encode(bio.getvalue()).decode('ascii')
        (args.out / f'{name}.svg').write_text(overlay(uri), encoding='utf-8')
        print(f'Escrito {args.out}/{name}.svg  ({OUT_W}x{OUT_H})')

    # escritorio y móvil son dos composiciones, no una escalada
    for tema in ('navy', 'claro'):
        e4.set_theme(tema)
        render(f'gameplay-{tema}', 1180, 880, overlay_svg, top=104, bot=120)
    e4.set_theme('navy')
    render('gameplay-movil-navy', 390, 730, overlay_movil, top=62, bot=150, margin=0.004)
    e4.set_theme('claro')
    render('gameplay-movil-claro', 390, 730, overlay_movil, top=62, bot=150, margin=0.004)


if __name__ == '__main__':
    main()
