#!/usr/bin/env python3
"""R62 · P01 · Habitación imposible · render first-party.

Bajo `IRIS_GREEN_VISUAL_STANDARD_SEP_2026`. La mecánica y la geometría de P01
quedan como estaban —el §16 sólo reabre la calidad visual—; lo que cambia es
cómo se pinta.

## Por qué deja de ser SVG

Dos entregas seguidas dije que el vector plano tocaba techo: sin materia, sin
microdetalle, sin atmósfera. El §2 de la norma resuelve la duda —«la técnica se
elige para alcanzar el resultado, no al revés»— y el §5 autoriza pre-render y
procedimientos first-party. Así que esto es un renderizador, no un dibujo.

## Cómo funciona

Rasterizado diferido sobre búferes, todo con numpy:

  1. Cada cara de la geometría es un paralelogramo en pantalla, porque la
     proyección axonométrica de un rectángulo alineado lo es. Eso permite
     invertir la interpolación bilineal con un sistema 2×2 y obtener, para cada
     píxel, su posición exacta en el mundo. De ahí salen albedo, normal,
     profundidad y material sin aproximar nada.
  2. Las texturas son fBm procedural muestreado por coordenadas de mundo, con
     proyección triplanar: el grano de la piedra continúa de una cara a otra en
     vez de cortarse en la arista. La misma altura de fBm perturba la normal,
     que es lo que da rugosidad a la luz.
  3. La luz es una direccional con Lambert y especular Blinn-Phong según la
     rugosidad del material, más ambiente hemisférico —cielo arriba, rebote
     cálido del suelo abajo—.
  4. Las sombras son marcha de rayo en espacio de pantalla contra el búfer de
     profundidad: da sombra de contacto y autosombra reales, no elipses
     dibujadas a mano.
  5. Oclusión ambiental por horizonte sobre el mismo búfer.
  6. Niebla por profundidad, grano y viñeta al final.

Determinista: semilla fija, sin reloj, sin azar de ejecución.

Uso:  python3 scripts/r62_p01_render.py
"""
import argparse
import math
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, map_coordinates

REPO = Path(__file__).resolve().parent.parent

SS = 2                       # supermuestreo
OUT_W, OUT_H = 1180, 880
W, H = OUT_W * SS, OUT_H * SS
TOP_ROOM = 0.0               # banda reservada arriba, en píxeles internos
BOT_ROOM = 0.0               # banda reservada abajo
TOP_OUT = BOT_OUT = 0.0      # las mismas bandas, en píxeles de salida

S = 6.0                      # lado de la sala cúbica
def _fit(margin=0.055):
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


U = OX = OY = KX = KY = KZ = 0.0


def configure(out_w, out_h, top=0.0, bot=0.0, margin=0.055):
    """Fija lienzo y encuadre. El móvil reserva banda para la interfaz."""
    global OUT_W, OUT_H, W, H, TOP_ROOM, BOT_ROOM, TOP_OUT, BOT_OUT, U, OX, OY, KX, KY, KZ
    OUT_W, OUT_H = out_w, out_h
    W, H = out_w * SS, out_h * SS
    TOP_ROOM, BOT_ROOM = top * SS, bot * SS
    TOP_OUT, BOT_OUT = top, bot
    U, OX, OY = _fit(margin)
    KX = U * math.cos(math.radians(30))
    KY = U * math.sin(math.radians(30))
    KZ = U

# ---------------------------------------------------------------- tokens ---
# IRIS_GREEN_GLOBAL_UI_TOKENS_2026_ADOPTED. Gobiernan el cromo de la lámina:
# fondo, texto, texto secundario y acento. NO gobiernan la materia representada
# —la caliza, su luz, su latón—, que es obra y responde al §6 y §10 de la norma
# visual. La frontera está declarada en el informe; si hay que moverla, se mueve
# aquí y se vuelve a renderizar.
THEMES = {
    # IRIS_GREEN_GLOBAL_UI_TOKENS_2026, §3 y §4. Nombres canónicos sin el
    # prefijo --ig-, para que el mapeo a CSS sea uno a uno.
    'claro': {
        'bg-page': '#F6F8FB', 'bg-surface': '#F4F7FA', 'bg-surface-soft': '#EEF2F6',
        'text': '#17395C', 'text-muted': '#435268',
        'button-primary-bg': '#17395C', 'button-primary-fg': '#EEF4F8',
        'button-secondary-bg': '#E6F1F8', 'button-secondary-fg': '#17395C',
        'link': '#1F5F8B', 'accent': '#5A49A8', 'accent-secondary': '#197991',
        'border-control': '#7A869D', 'separator': '#D5E1EC', 'focus': '#5A49A8',
        'error': '#8A2942', 'success': '#1D6B3A',
    },
    'navy': {
        'bg-page': '#0B1A2B', 'bg-surface': '#15304A', 'bg-surface-soft': '#1D3D5C',
        'text': '#EEF4F8', 'text-muted': '#C9D5DD',
        'button-primary-bg': '#DCE8F2', 'button-primary-fg': '#0B1A2B',
        'button-secondary-bg': '#15304A', 'button-secondary-fg': '#EEF4F8',
        'link': '#9FDCEA', 'accent': '#C3B8FF', 'accent-secondary': '#9FDCEA',
        'border-control': '#8494A8', 'separator': '#2A4460', 'focus': '#C3B8FF',
        'error': '#FFB3C1', 'success': '#9BE0B4',
    },
}
THEME = THEMES['navy']


def hx(h):
    return np.array([int(h[i:i + 2], 16) / 255.0 for i in (1, 3, 5)], np.float32)


LIGHT = np.array([-0.46, -0.30, 0.84])
LIGHT /= np.linalg.norm(LIGHT)
VIEW = np.array([1.0, 1.0, 1.0]) / math.sqrt(3.0)

# material -> (albedo, rugosidad, fuerza de relieve, escala de textura)
MATS = {
    'caliza':   ((0.82, 0.73, 0.59), 0.74, 0.85, 1.6),
    'clara':    ((0.90, 0.83, 0.70), 0.70, 0.70, 1.9),
    'umbra':    ((0.53, 0.35, 0.24), 0.66, 1.05, 2.1),
    'fria':     ((0.34, 0.44, 0.47), 0.40, 0.72, 2.6),
    'suelo':    ((0.56, 0.47, 0.34), 0.82, 1.45, 1.15),
    'muro':     ((0.62, 0.54, 0.42), 0.80, 1.10, 1.35),
    'laton':    ((0.86, 0.68, 0.36), 0.22, 0.30, 3.0),
}
MAT_IDS = {k: i for i, k in enumerate(MATS)}

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


def project(p):
    x, y, z = p
    return (OX + (x - y) * KX, OY + (x + y) * KY - z * KZ)


# ---------------------------------------------------------------- texturas ---

def fbm_tile(size=1024, octaves=6, seed=7, gain=0.52, lowest=32):
    rng = np.random.default_rng(seed)
    out = np.zeros((size, size), np.float32)
    amp, total = 1.0, 0.0
    for o in range(octaves):
        n = min(size, lowest << o)
        g = rng.random((n, n)).astype(np.float32)
        zoom = size / n
        yy, xx = np.meshgrid(np.arange(size) / zoom, np.arange(size) / zoom, indexing='ij')
        out += map_coordinates(g, [yy % n, xx % n], order=1, mode='wrap') * amp
        total += amp
        amp *= gain
    out /= total
    return ((out - out.min()) / (np.ptp(out) + 1e-6)).astype(np.float32)


class Buffers:
    def __init__(self):
        self.albedo = np.zeros((H, W, 3), np.float32)
        self.normal = np.zeros((H, W, 3), np.float32)
        self.world = np.zeros((H, W, 3), np.float32)
        self.matid = np.full((H, W), -1, np.int16)
        self.mask = np.zeros((H, W), bool)
        self.depth = np.full((H, W), -1e9, np.float32)


def blit_quad(buf, world_corners, mat, tint=1.0, emissive=None):
    """Pinta un paralelogramo: W0 + u·(W1−W0) + v·(W3−W0)."""
    w0, w1, _, w3 = [np.asarray(c, np.float64) for c in world_corners]
    s0, s1, s3 = project(w0), project(w1), project(w3)
    e1 = np.array([s1[0] - s0[0], s1[1] - s0[1]])
    e2 = np.array([s3[0] - s0[0], s3[1] - s0[1]])
    det = e1[0] * e2[1] - e1[1] * e2[0]
    if abs(det) < 1e-9:
        return

    xs = [s0[0], s1[0], s3[0], s0[0] + e1[0] + e2[0]]
    ys = [s0[1], s1[1], s3[1], s0[1] + e1[1] + e2[1]]
    x0, x1 = max(0, int(min(xs)) - 1), min(W, int(max(xs)) + 2)
    y0, y1 = max(0, int(min(ys)) - 1), min(H, int(max(ys)) + 2)
    if x1 <= x0 or y1 <= y0:
        return

    gx, gy = np.meshgrid(np.arange(x0, x1), np.arange(y0, y1))
    px, py = gx - s0[0], gy - s0[1]
    u = (px * e2[1] - py * e2[0]) / det
    v = (e1[0] * py - e1[1] * px) / det
    inside = (u >= 0) & (u <= 1) & (v >= 0) & (v <= 1)
    if not inside.any():
        return

    du, dv = w1 - w0, w3 - w0
    wx = w0[0] + u * du[0] + v * dv[0]
    wy = w0[1] + u * du[1] + v * dv[1]
    wz = w0[2] + u * du[2] + v * dv[2]
    depth = wx + wy + wz

    sub = buf.depth[y0:y1, x0:x1]
    win = inside & (depth > sub)
    if not win.any():
        return

    n = np.cross(du, dv)
    n = n / (np.linalg.norm(n) + 1e-9)
    if np.dot(n, VIEW) < 0:
        n = -n

    base, rough, bump, tscale = MATS[mat]
    du_len = float(np.linalg.norm(du)) + 1e-6
    dv_len = float(np.linalg.norm(dv)) + 1e-6
    # triplanar: la coordenada de textura sale de las dos componentes de mundo
    # más alineadas con la cara, así el grano cruza las aristas sin cortarse.
    ax = np.argmax(np.abs(n))
    ta, tb = ([wy, wz], [wx, wz], [wx, wy])[ax]
    tex = sample_tex(ta * tscale, tb * tscale)
    grn = sample_grain(ta * tscale, tb * tscale)
    dga = sample_grain(ta * tscale + 0.016, tb * tscale) - grn
    dgb = sample_grain(ta * tscale, tb * tscale + 0.016) - grn
    dta = sample_tex(ta * tscale + 0.05, tb * tscale) - tex
    dtb = sample_tex(ta * tscale, tb * tscale + 0.05) - tex

    # desgaste de arista, desigual: unos sillares están más desportillados
    ew = np.minimum(np.minimum(u, 1 - u) * du_len, np.minimum(v, 1 - v) * dv_len)
    chip = 0.55 + 1.15 * sample_grain(ta * 0.85, tb * 0.85)
    wear = np.clip(ew / (0.085 * chip), 0, 1)

    alb = np.stack([np.full_like(tex, base[i]) for i in range(3)], -1)
    alb *= (0.80 + 0.34 * tex)[..., None]
    alb *= (0.93 + 0.15 * grn)[..., None]
    if mat in ('caliza', 'clara', 'muro', 'suelo'):
        strat = 0.5 + 0.5 * np.sin(wz * 5.2 + 3.4 * tex + 1.7 * grn)
        alb *= (0.93 + 0.15 * strat)[..., None]
    alb *= (0.86 + 0.16 * wear)[..., None] * tint

    # manchas: humedad que sube del suelo y veladura general
    stain = sample_tex(ta * 0.30, tb * 0.30)
    damp = np.clip(1.0 - wz / 2.1, 0.0, 1.0) ** 1.6
    alb *= (1.0 - 0.34 * stain * damp - 0.09 * stain)[..., None]

    joint = None
    cs = COURSING.get(mat)
    if cs:
        bw, ch, bond = cs
        row = np.floor(tb / ch)
        off = (np.mod(row, 2.0) * bond) * bw
        colf = (ta + off) / bw
        col = np.floor(colf)
        # variación de tono pieza a pieza: hash determinista del índice
        hsh = np.modf(np.sin(col * 12.9898 + row * 78.233) * 43758.5453)[0]
        alb *= (0.90 + 0.19 * hsh)[..., None]
        # junta: distancia al borde de la pieza, en unidades de mundo
        du_e = np.minimum(colf - col, 1.0 - (colf - col)) * bw
        dv_e = np.minimum(tb / ch - row, 1.0 - (tb / ch - row)) * ch
        jw = 0.028
        joint = np.clip(1.0 - np.minimum(du_e, dv_e) / jw, 0.0, 1.0) ** 1.5
        alb *= (1.0 - 0.42 * joint)[..., None]

    tan_a = np.zeros(3); tan_a[(ax + 1) % 3] = 1.0
    tan_b = np.zeros(3); tan_b[(ax + 2) % 3] = 1.0
    da = 1.3 * dta + 2.6 * dga
    db = 1.3 * dtb + 2.6 * dgb
    if joint is not None:
        # la junta rehunde: la normal gira hacia dentro a cada lado del surco
        gj = 0.55
        da = da + gj * np.gradient(joint, axis=1) * 34.0
        db = db + gj * np.gradient(joint, axis=0) * 34.0
    nn = (n[None, None, :] - bump * (da[..., None] * tan_a[None, None, :]
                                     + db[..., None] * tan_b[None, None, :]))
    # bisel: cerca del canto la normal se inclina hacia fuera del plano
    bev = (1.0 - wear) ** 2
    ea = np.where(u < 0.5, -1.0, 1.0) * (np.minimum(u, 1 - u) * du_len < np.minimum(v, 1 - v) * dv_len)
    eb = np.where(v < 0.5, -1.0, 1.0) * (np.minimum(v, 1 - v) * dv_len <= np.minimum(u, 1 - u) * du_len)
    edge_dir = (du / du_len)[None, None, :] * (ea * bev)[..., None] \
             + (dv / dv_len)[None, None, :] * (eb * bev)[..., None]
    nn = nn + 0.85 * edge_dir
    nn /= (np.linalg.norm(nn, axis=-1, keepdims=True) + 1e-9)

    ys_, xs_ = np.where(win)
    Y, X = ys_ + y0, xs_ + x0
    buf.albedo[Y, X] = alb[win]
    buf.normal[Y, X] = nn[win]
    buf.world[Y, X] = np.stack([wx[win], wy[win], wz[win]], -1)
    buf.matid[Y, X] = MAT_IDS[mat]
    buf.mask[Y, X] = True
    buf.depth[Y, X] = depth[win]


TEX = None      # variación de tono, baja frecuencia
GRAIN = None    # grano de piedra, alta frecuencia


def _samp(tile, a, b, k):
    n = tile.shape[0]
    return map_coordinates(tile, [(b * k) % n, (a * k) % n], order=1, mode='wrap')


def sample_tex(a, b):
    return _samp(TEX, a, b, 74)


def sample_grain(a, b):
    return _samp(GRAIN, a, b, 150)


# ------------------------------------------------------------- geometría ---

def box(buf, x, y, z, dx, dy, dz, mat):
    blit_quad(buf, [(x, y, z + dz), (x + dx, y, z + dz),
                    (x + dx, y + dy, z + dz), (x, y + dy, z + dz)], mat)
    blit_quad(buf, [(x, y + dy, z), (x + dx, y + dy, z),
                    (x + dx, y + dy, z + dz), (x, y + dy, z + dz)], mat)
    blit_quad(buf, [(x + dx, y, z), (x + dx, y + dy, z),
                    (x + dx, y + dy, z + dz), (x + dx, y, z + dz)], mat)


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


# --------------------------------------------------------------- sombreado ---

def screen_dir_for_light():
    l = LIGHT
    return np.array([(l[0] - l[1]) * KX, (l[0] + l[1]) * KY - l[2] * KZ])


JITTER = [(0.0, 0.0), (0.075, -0.045), (-0.062, 0.070), (0.030, 0.085)]


SHADOW_DOWN = 2      # la marcha va a media resolución: la penumbra es suave


def shadow_mask(buf):
    """Sombra de área: varias direcciones cercanas promediadas dan penumbra
    que se abre con la distancia al ocluyente, en vez de un canto duro."""
    k = SHADOW_DOWN
    dep = buf.depth[::k, ::k].copy()
    msk = buf.mask[::k, ::k].astype(np.float32)
    total = np.zeros(dep.shape, np.float32)
    for jx, jy in JITTER:
        lj = LIGHT + np.array([jx, jy, 0.0])
        total += _march(dep, msk, lj / np.linalg.norm(lj), k)
    total = gaussian_filter(total / len(JITTER), 1.4 * SS / k)
    hh, ww = buf.depth.shape
    yy, xx = np.mgrid[0:hh, 0:ww].astype(np.float32)
    return map_coordinates(total, [yy / k, xx / k], order=1, mode='nearest')


def _march(dep, msk, L, k):
    h, w = dep.shape
    sd = np.array([(L[0] - L[1]) * KX, (L[0] + L[1]) * KY - L[2] * KZ]) / k
    sn = float(np.linalg.norm(sd))
    d = sd / (sn + 1e-9)
    dd = float(L.sum())
    shade = np.zeros((h, w), np.float32)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    solid = msk > 0.5
    for i in range(1, 58):
        t = (i ** 1.30) * 1.6 * SS / k
        world_t = t / sn
        sx = np.clip(xx + d[0] * t, 0, w - 1)
        sy = np.clip(yy + d[1] * t, 0, h - 1)
        samp = map_coordinates(dep, [sy, sx], order=1, mode='nearest')
        inside = map_coordinates(msk, [sy, sx], order=1, mode='constant', cval=0.0) > 0.5
        hit = inside & (samp > dep + dd * world_t + 0.035) & solid
        shade = np.maximum(shade, hit * (1.0 - 0.45 * i / 58.0))
    return shade


def ambient_occlusion(buf):
    ao = np.zeros((H, W), np.float32)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    rng = np.random.default_rng(3)
    for k in range(12):
        ang = 2 * math.pi * k / 12 + rng.random() * 0.2
        dx, dy = math.cos(ang), math.sin(ang)
        best = np.zeros((H, W), np.float32)
        for r in (2, 5, 9, 15, 24):
            sx = np.clip(xx + dx * r * SS, 0, W - 1)
            sy = np.clip(yy + dy * r * SS, 0, H - 1)
            samp = map_coordinates(buf.depth, [sy, sx], order=1, mode='nearest')
            best = np.maximum(best, np.clip((samp - buf.depth) / (r * 0.10), 0, 1))
        ao += best
    ao /= 12.0
    return gaussian_filter(np.clip(1.0 - 0.85 * ao, 0.0, 1.0), 2.0 * SS)


def shade(buf):
    n = buf.normal
    ndl = np.clip((n * LIGHT[None, None, :]).sum(-1), 0, 1)

    rough = np.ones((H, W), np.float32) * 0.7
    for name, i in MAT_IDS.items():
        rough[buf.matid == i] = MATS[name][1]

    hvec = LIGHT + VIEW
    hvec = hvec / np.linalg.norm(hvec)
    ndh = np.clip((n * hvec[None, None, :]).sum(-1), 0, 1)
    spec = np.power(ndh, np.clip(2.0 / (rough ** 2 + 1e-3), 4, 260)) * (1.0 - rough) * 1.25

    sh = 1.0 - 0.82 * shadow_mask(buf)
    ao = ambient_occlusion(buf)

    up = np.clip(n[..., 2], 0, 1)
    sky = np.array([0.30, 0.37, 0.46], np.float32)
    bounce = np.array([0.30, 0.21, 0.13], np.float32)
    amb = (sky[None, None, :] * up[..., None] + bounce[None, None, :] * (1.0 - up[..., None]))
    amb *= ao[..., None]

    # derrame del vano alto: fuente secundaria en la salida, con caída
    opening = np.array([0.0, 4.8, 3.4], np.float32)
    to_op = opening[None, None, :] - buf.world
    dist = np.linalg.norm(to_op, axis=-1) + 1e-6
    l2 = to_op / dist[..., None]
    fall = 1.0 / (1.0 + (dist / 3.2) ** 2)
    ndl2 = np.clip((n * l2).sum(-1), 0, 1) * fall * buf.mask

    # rebote cálido del suelo hacia las caras que miran hacia abajo
    down = np.clip(-n[..., 2], 0, 1)
    bounce_k = np.array([0.36, 0.26, 0.16], np.float32)

    key = np.array([1.00, 0.88, 0.70], np.float32)
    spill = np.array([1.00, 0.86, 0.62], np.float32)
    lit = buf.albedo * (amb * 0.34
                        + key[None, None, :] * (ndl * sh)[..., None] * 0.95
                        + spill[None, None, :] * ndl2[..., None] * 0.55
                        + bounce_k[None, None, :] * (down * ao)[..., None] * 0.45)
    lit += key[None, None, :] * (spec * sh)[..., None] * 0.55

    # niebla por profundidad: lo lejano pierde contraste
    dep = np.where(buf.mask, buf.depth, 0)
    lo, hi = np.percentile(dep[buf.mask], [2, 98])
    f = np.clip((hi - dep) / (hi - lo + 1e-6), 0, 1) ** 1.9
    # Atmósfera de la sala. NO es el fondo de página: el interior está iluminado
    # y su profundidad no puede depender del tema de la web.
    fog = np.array([0.055, 0.046, 0.038], np.float32)
    k = 0.30 * f[..., None]
    return lit * (1 - k) + fog[None, None, :] * k


def compose(lit, buf):
    """Compone la escena sobre su propio vacío.

    El vacío es obra, no interfaz. Lo probé atado a `bg-page` y el resultado
    fue peor de las dos maneras: el exponente y el tonemap se aplican también
    al fondo, así que `#0B1A2B` salía convertido en un gris azulado que no
    coincidía con el fondo de la página y dejaba una costura visible en el
    borde de la lámina. Y aunque coincidiera, repintar una lámina ya aprobada
    para que siga el tema no es lo que pide la norma: la §2 permite
    explícitamente que un stage inmersivo tenga su propia iluminación, y la §6
    dice que el arte no cambia con el tema. Lo que cambia con el tema es el
    texto, las placas, el selector y el borde de la lámina, que sí son chrome.

    Consecuencia buscada: en LIGHT la lámina sigue siendo oscura. Es lo mismo
    que ya hace Rincón por la §8.
    """
    bg = np.zeros((H, W, 3), np.float32)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    r = np.sqrt(((xx - W * 0.44) / (W * 0.74)) ** 2 + ((yy - H * 0.42) / (H * 0.74)) ** 2)
    bg += np.array([0.062, 0.052, 0.040])[None, None, :] * np.clip(1.25 - r, 0, 1)[..., None]
    bg += np.array([0.013, 0.012, 0.010])[None, None, :]

    img = np.where(buf.mask[..., None], lit, bg)

    # bloom suave sobre lo más iluminado
    lum = img.mean(-1)
    hi = np.clip(lum - 0.80, 0, None)
    img += gaussian_filter(hi, 10 * SS)[..., None] * np.array([1.0, 0.90, 0.72])[None, None, :] * 0.26

    img = np.clip(img, 0, None) * 1.55            # exposición
    img = img / (1.0 + img)                       # tonemap
    img = np.power(np.clip(img, 0, 1), 1 / 2.2)   # gamma

    rng = np.random.default_rng(11)
    img += (rng.random((H, W, 1)).astype(np.float32) - 0.5) * 0.020

    vig = np.clip(1.22 - 0.62 * np.sqrt(((xx - W / 2) / (W / 2)) ** 2
                                        + ((yy - H / 2) / (H / 2)) ** 2) ** 1.7, 0, 1)
    img *= vig[..., None]
    return np.clip(img, 0, 1)



# ------------------------------------------- capa vectorial sobre el raster ---
# El §5 de la norma permite composición híbrida. El raster lleva la materia y
# la luz; el vector, el texto y la interfaz, que deben quedar nítidos a
# cualquier tamaño y ser legibles por lectores de pantalla.

# El latón vive en la tabla de materiales del render, dentro de la escena. La
# capa vectorial no lo usa: aquí todo es chrome, y el chrome sale de tokens.

def T(k):
    return THEME[k]


def chrome_bands():
    """Pinta las bandas de chrome con el token, sobre el raster.

    La lámina representa una pantalla entera, y una pantalla tiene dos cosas
    distintas: el stage —obra, con su luz y su vacío, §2— y el chrome que lo
    rodea —título, entradilla, teclas, selector, crédito—, que es interfaz y
    sale de los tokens.

    Antes las bandas eran el propio vacío de la escena, así que el texto de
    interfaz iba sobre obra y había que elegir entre placa o mala lectura. Con
    la banda en `bg-page`, el título vuelve a ser texto sobre su propio fondo:
    11,1:1 en claro y 15,8:1 en navy, sin placa y sin tocar el render.

    Las placas siguen haciendo falta, pero sólo donde tienen que estar: los
    rótulos que van DENTRO del stage, encima de la piedra.

    El filo entre banda y stage lleva un `separator`: así el corte se lee como
    un inset deliberado y no como una costura.
    """
    if not (TOP_OUT or BOT_OUT):
        return ''
    b = []
    if TOP_OUT:
        b.append(f'<rect x="0" y="0" width="{OUT_W}" height="{TOP_OUT:.0f}" fill="{T("bg-page")}"/>'
                 f'<line x1="0" y1="{TOP_OUT:.0f}" x2="{OUT_W}" y2="{TOP_OUT:.0f}" '
                 f'stroke="{T("separator")}" stroke-width="1"/>')
    if BOT_OUT:
        y = OUT_H - BOT_OUT
        b.append(f'<rect x="0" y="{y:.0f}" width="{OUT_W}" height="{BOT_OUT:.0f}" fill="{T("bg-page")}"/>'
                 f'<line x1="0" y1="{y:.0f}" x2="{OUT_W}" y2="{y:.0f}" '
                 f'stroke="{T("separator")}" stroke-width="1"/>')
    return ''.join(b)


def po(p):
    """Proyecta a coordenadas de la imagen de salida."""
    x, y = project(p)
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


def label_plate(px, py, text, size, ls):
    """Rótulo sobre la escena: siempre con plaquita de superficie.

    Un token de acento garantiza contraste contra el fondo de SU tema, no
    contra la obra que hay debajo. Medido en esta lámina, el acento sobre la
    caliza daba 1,17:1 en claro; sobre bg-surface da 6,6:1.
    """
    w = len(text) * (size * 0.60 + ls) + 22
    return (f'<rect x="{px - w / 2:.1f}" y="{py - size:.1f}" width="{w:.1f}" '
            f'height="{size * 1.45:.1f}" rx="{size * 0.42:.1f}" '
            f'fill="{T("bg-surface")}" fill-opacity="0.94"/>'
            f'<text x="{px:.0f}" y="{py:.0f}" font-family="Georgia, serif" '
            f'font-size="{size}" fill="{T("accent")}" text-anchor="middle" '
            f'letter-spacing="{ls}">{text}</text>')


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
    global TEX
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', type=Path, default=REPO / 'editorial/r62/p01-habitacion-imposible')
    args = ap.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)

    global GRAIN
    TEX = fbm_tile(octaves=5, gain=0.55, lowest=8, seed=7)
    GRAIN = fbm_tile(octaves=5, gain=0.60, lowest=24, seed=23)

    import base64, io

    def render(name, w, h, overlay, top=0.0, bot=0.0, margin=0.055):
        configure(w, h, top, bot, margin)
        buf = Buffers()
        build_scene(buf)
        im = Image.fromarray((compose(shade(buf), buf) * 255 + 0.5).astype(np.uint8))
        im = im.resize((OUT_W, OUT_H), Image.LANCZOS)
        im.save(args.out / f'{name}.webp', quality=92, method=6)
        bio = io.BytesIO()
        im.save(bio, 'WEBP', quality=90, method=6)
        uri = 'data:image/webp;base64,' + base64.b64encode(bio.getvalue()).decode('ascii')
        (args.out / f'{name}.svg').write_text(overlay(uri), encoding='utf-8')
        print(f'Escrito {args.out}/{name}.svg  ({OUT_W}x{OUT_H})')

    # escritorio y móvil son dos composiciones, no una escalada
    global THEME
    for tema in ('navy', 'claro'):
        THEME = THEMES[tema]
        render(f'gameplay-{tema}', 1180, 880, overlay_svg, top=104, bot=120)
    THEME = THEMES['navy']
    render('gameplay-movil-navy', 390, 730, overlay_movil, top=62, bot=150, margin=0.004)
    THEME = THEMES['claro']
    render('gameplay-movil-claro', 390, 730, overlay_movil, top=62, bot=150, margin=0.004)

if __name__ == '__main__':
    main()
