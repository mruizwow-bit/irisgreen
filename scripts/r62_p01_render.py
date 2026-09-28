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

S = 6.0                      # lado de la sala cúbica
def _fit(margin=0.055):
    """Escala y centro para que la sala llene el lienzo con margen."""
    c30, s30 = math.cos(math.radians(30)), math.sin(math.radians(30))
    pts = [((x - y) * c30, (x + y) * s30 - z)
           for x in (-0.34, S) for y in (-0.34, S) for z in (0.0, S)]
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    u = min(W * (1 - 2 * margin) / (max(xs) - min(xs)),
            H * (1 - 2 * margin) / (max(ys) - min(ys)))
    return u, W / 2 - (max(xs) + min(xs)) / 2 * u, H / 2 - (max(ys) + min(ys)) / 2 * u


U, OX, OY = _fit()
KX = U * math.cos(math.radians(30))
KY = U * math.sin(math.radians(30))
KZ = U

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

    # desgaste de arista: la piedra no tiene cantos perfectos
    ew = np.minimum(np.minimum(u, 1 - u) * du_len, np.minimum(v, 1 - v) * dv_len)
    wear = np.clip(ew / 0.085, 0, 1)

    alb = np.stack([np.full_like(tex, base[i]) for i in range(3)], -1)
    alb *= (0.80 + 0.34 * tex)[..., None]
    alb *= (0.93 + 0.15 * grn)[..., None]
    if mat in ('caliza', 'clara', 'muro', 'suelo'):
        strat = 0.5 + 0.5 * np.sin(wz * 5.2 + 3.4 * tex + 1.7 * grn)
        alb *= (0.93 + 0.15 * strat)[..., None]
    alb *= (0.86 + 0.16 * wear)[..., None] * tint

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


def shadow_mask(buf):
    sd = screen_dir_for_light()          # desplazamiento en pantalla por unidad de mundo
    sn = float(np.linalg.norm(sd))
    d = sd / (sn + 1e-9)
    dd = float(LIGHT.sum())              # ganancia de profundidad por unidad de mundo
    shade = np.zeros((H, W), np.float32)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    for i in range(1, 64):
        t = (i ** 1.28) * 1.7 * SS       # pasos crecientes: fino cerca, basto lejos
        world_t = t / sn
        sx = np.clip(xx + d[0] * t, 0, W - 1)
        sy = np.clip(yy + d[1] * t, 0, H - 1)
        samp = map_coordinates(buf.depth, [sy, sx], order=1, mode='nearest')
        inside = map_coordinates(buf.mask.astype(np.float32), [sy, sx], order=1,
                                 mode='constant', cval=0.0) > 0.5
        ray = buf.depth + dd * world_t
        hit = inside & (samp > ray + 0.035) & buf.mask
        shade = np.maximum(shade, hit * (1.0 - 0.45 * i / 64.0))
    return gaussian_filter(shade, 1.8 * SS)


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

    key = np.array([1.00, 0.88, 0.70], np.float32)
    lit = buf.albedo * (amb * 0.34 + key[None, None, :] * (ndl * sh)[..., None] * 0.95)
    lit += key[None, None, :] * (spec * sh)[..., None] * 0.55

    # niebla por profundidad: lo lejano pierde contraste
    dep = np.where(buf.mask, buf.depth, 0)
    lo, hi = np.percentile(dep[buf.mask], [2, 98])
    f = np.clip((hi - dep) / (hi - lo + 1e-6), 0, 1) ** 1.9
    fog = np.array([0.055, 0.046, 0.038], np.float32)
    k = 0.30 * f[..., None]
    return lit * (1 - k) + fog[None, None, :] * k


def compose(lit, buf):
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

LATON = '#E8CB8A'


def po(p):
    """Proyecta a coordenadas de la imagen de salida."""
    x, y = project(p)
    return (x / SS, y / SS)


def mini_room(cx, cy, s, datum, active):
    kx, ky, kz = s * 0.866, s * 0.5, s
    c = {(i, j, k): (cx + (i - j) * kx, cy + (i + j) * ky - k * kz - s * 0.2)
         for i in (0, 1) for j in (0, 1) for k in (0, 1)}
    ink = LATON if active else '#6E6250'
    faces = {0: [(0,0,0),(1,0,0),(1,1,0),(0,1,0)], 1: [(0,0,0),(0,1,0),(0,1,1),(0,0,1)],
             2: [(0,1,0),(1,1,0),(1,1,1),(0,1,1)], 3: [(0,0,1),(1,0,1),(1,1,1),(0,1,1)]}
    pts = ' '.join(f'{c[v][0]:.1f},{c[v][1]:.1f}' for v in faces[datum])
    out = [f'<polygon points="{pts}" fill="{LATON}" opacity="{0.42 if active else 0.20}"/>']
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


def overlay_svg(data_uri):
    o = []
    # recorrido: eje de latón que toca los dos vanos
    pts = [po((5.5, 0.0, 0.05))] + [po((cx + 0.5, cy + 0.5, 0.05)) for cx, cy in PATH]
    o.append('<polyline points="' + ' '.join(f'{a:.1f},{b:.1f}' for a, b in pts) +
             f'" fill="none" stroke="{LATON}" stroke-width="3.2" opacity="0.92" '
             f'stroke-linecap="round" stroke-linejoin="round"/>')
    a0 = pts[0]
    o.append(f'<circle cx="{a0[0]:.1f}" cy="{a0[1]:.1f}" r="6.5" fill="{LATON}"/>')
    end = pts[-1]
    o.append(f'<circle cx="{end[0]:.1f}" cy="{end[1]:.1f}" r="6.5" fill="none" '
             f'stroke="{LATON}" stroke-width="2.8"/>')

    # la cota del salto que bloquea
    lo, hi = po((0.5, 5.5, 0.05)), po((0.5, 5.5, 2.4))
    o.append(f'<line x1="{lo[0]:.1f}" y1="{lo[1]:.1f}" x2="{hi[0]:.1f}" y2="{hi[1]:.1f}" '
             f'stroke="{LATON}" stroke-width="2.6" stroke-dasharray="9 7" opacity="0.95"/>'
             f'<path d="M{lo[0]-9:.1f} {lo[1]:.1f} h18 M{hi[0]-9:.1f} {hi[1]:.1f} h18" '
             f'stroke="{LATON}" stroke-width="2.6" stroke-linecap="round"/>'
             f'<rect x="{hi[0]+12:.1f}" y="{(lo[1]+hi[1])/2-15:.1f}" width="52" height="30" '
             f'rx="6" fill="#171008" fill-opacity="0.88" stroke="{LATON}" stroke-width="1.2"/>'
             f'<text x="{hi[0]+38:.1f}" y="{(lo[1]+hi[1])/2+6:.1f}" font-family="Georgia, serif" '
             f'font-size="17" fill="{LATON}" text-anchor="middle">2,4</text>')

    # rótulos de los vanos
    for label, wp in (('ENTRADA', (5.15, 0.0, 2.55)), ('SALIDA', (0.0, 4.8, 4.75))):
        px, py = po(wp)
        o.append(f'<text x="{px:.0f}" y="{py:.0f}" font-family="Georgia, serif" font-size="19" '
                 f'fill="{LATON}" text-anchor="middle" letter-spacing="1.8">{label}</text>')

    # selector espacial
    o.append(f'<text x="{OUT_W-186}" y="{OUT_H-150}" font-family="Georgia, serif" font-size="12.5" '
             f'fill="#A4937A" text-anchor="middle" letter-spacing="1.1">QUÉ CARA HACE DE SUELO</text>')
    for i in range(4):
        o.append(mini_room(OUT_W - 300 + i * 76, OUT_H - 94, 19, i, i == 0))

    # teclas dibujadas, no glifos de fuente
    kx = 44
    for ang in (180, 0, 90, -90):
        o.append(f'<rect x="{kx}" y="{OUT_H-76}" width="24" height="24" rx="5" fill="none" '
                 f'stroke="#6B5F4C" stroke-width="1.2"/>'
                 f'<path d="M-5.5 -4 L0 3 L5.5 -4" fill="none" stroke="#A4937A" stroke-width="2" '
                 f'stroke-linecap="round" stroke-linejoin="round" '
                 f'transform="translate({kx+12} {OUT_H-63}) rotate({ang})"/>')
        kx += 28
    o.append(f'<text x="{kx+8}" y="{OUT_H-57}" font-family="Georgia, serif" font-size="14.5" '
             f'fill="#A4937A">Flechas: mover la pieza · R: girar · 1–4: cambiar de suelo</text>')

    return (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
            f'viewBox="0 0 {OUT_W} {OUT_H}" width="{OUT_W}" height="{OUT_H}" role="img" '
            f'aria-label="Habitación imposible. Render de concepto de Iris Green: sala cúbica '
            f'de piedra con el recorrido marcado entre la entrada y la salida.">'
            f'<image href="{data_uri}" xlink:href="{data_uri}" x="0" y="0" '
            f'width="{OUT_W}" height="{OUT_H}"/>'
            f'<text x="44" y="58" font-family="Georgia, serif" font-size="33" fill="#F3EAD8" '
            f'letter-spacing="0.3">Habitación imposible</text>'
            f'<text x="44" y="86" font-family="Georgia, serif" font-size="16" fill="#A4937A">'
            f'La sala es un cubo. Cualquiera de sus caras puede hacer de suelo.</text>'
            + ''.join(o) +
            f'<text x="{OUT_W-44}" y="{OUT_H-26}" font-family="Georgia, serif" font-size="14" '
            f'fill="#8B7C66" text-anchor="end">P01 · render first-party · norma visual sep 2026</text>'
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
    buf = Buffers()
    build_scene(buf)
    img = compose(shade(buf), buf)

    arr = (img * 255 + 0.5).astype(np.uint8)
    im = Image.fromarray(arr).resize((OUT_W, OUT_H), Image.LANCZOS)
    im.save(args.out / 'render-gameplay.png', optimize=True)
    im.save(args.out / 'render-gameplay.webp', quality=92, method=6)
    import base64, io
    buf_io = io.BytesIO()
    im.save(buf_io, 'WEBP', quality=90, method=6)
    uri = 'data:image/webp;base64,' + base64.b64encode(buf_io.getvalue()).decode('ascii')
    (args.out / 'gameplay-compuesta.svg').write_text(overlay_svg(uri), encoding='utf-8')
    print(f'Escrito {args.out}/render-gameplay.png ({im.size[0]}×{im.size[1]})')
    print(f'Escrito {args.out}/gameplay-compuesta.svg (raster + vector)')


if __name__ == '__main__':
    main()
