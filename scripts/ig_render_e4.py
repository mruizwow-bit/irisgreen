#!/usr/bin/env python3
"""Motor de render E4 · común a los pilotos de Juegos.

La referencia E4 (`editorial/r62/REFERENCIA-E4.md`) dejó escrita una deuda: el
motor vivía dentro del script de P01, y el reparto correcto entre motor y
escena «lo dirá el segundo piloto que lo use». Este módulo es ese reparto,
hecho con P02 delante y no a ciegas.

**Qué es motor y qué es escena.** Motor: rasterizado diferido, muestreo de
textura, sombra, oclusión, atmósfera, composición y la capa de chrome. Escena:
la cámara, la tabla de materiales, la geometría, la luz y el vacío. Nada de lo
segundo está aquí dentro; todo se pasa desde el piloto.

**La cámara es sustituible, y ahí estaba el nudo.** P01 es axonométrico, y en
axonometría la profundidad de un punto es `x+y+z` y un rectángulo alineado se
proyecta como paralelogramo. P02 es frontal, mira el terrario a través del
cristal, y su profundidad es la coordenada que se aleja. Las dos cumplen el
mismo contrato —proyectar, ordenar en profundidad y decir hacia dónde corre la
luz en pantalla—, así que el rasterizador no necesita saber cuál tiene delante.

**Condición de la extracción.** P01 está `HUMAN_APPROVED`. Sacarlo de su script
sólo vale si sus cuatro láminas salen idénticas byte a byte, y eso se comprueba
con `scripts/test_e4_motor_identico.py`. Si algún día deja de cumplirse, el
fallo es de la extracción, no de P01.

Determinista: semilla fija, sin reloj, sin azar de ejecución.
"""
import math

import numpy as np
from scipy.ndimage import gaussian_filter, map_coordinates

# ------------------------------------------------------------------ estado ---
# El motor guarda su configuración en el módulo, igual que hacía dentro de P01.
# Un piloto llama a setup() una vez por lámina.

SS = 2
W = H = 0
OUT_W = OUT_H = 0
TOP_OUT = BOT_OUT = 0.0
CAM = None
MATS = {}
MAT_IDS = {}
COURSING = {}
FEATURES = {}
TEX = None
GRAIN = None


class Camera:
    """Contrato de cámara. `view` es el vector hacia el observador."""

    view = np.array([0.0, -1.0, 0.0])

    def project(self, p):
        raise NotImplementedError

    def depth(self, wx, wy, wz):
        """Mayor = más cerca del observador."""
        raise NotImplementedError

    def screen_dir(self, L):
        """Hacia dónde avanza en pantalla un rayo que sigue la luz L."""
        raise NotImplementedError

    def depth_per_world(self, L):
        """Cuánta profundidad gana ese rayo por unidad de mundo."""
        raise NotImplementedError


class Axonometric(Camera):
    """La de P01. Un rectángulo alineado se proyecta como paralelogramo, que es
    lo que permite invertir la bilineal con un 2×2 y tener posición de mundo
    exacta por píxel."""

    def __init__(self, u, ox, oy, angle=30.0):
        self.u = u
        self.ox, self.oy = ox, oy
        self.kx = u * math.cos(math.radians(angle))
        self.ky = u * math.sin(math.radians(angle))
        self.kz = u
        self.view = np.array([1.0, 1.0, 1.0]) / math.sqrt(3.0)

    def project(self, p):
        x, y, z = p
        return (self.ox + (x - y) * self.kx, self.oy + (x + y) * self.ky - z * self.kz)

    def depth(self, wx, wy, wz):
        return wx + wy + wz

    def screen_dir(self, L):
        return np.array([(L[0] - L[1]) * self.kx,
                         (L[0] + L[1]) * self.ky - L[2] * self.kz])

    def depth_per_world(self, L):
        return float(L.sum())


class Frontal(Camera):
    """La de P02. Se mira de frente: X a la derecha, Z arriba, Y hacia dentro.

    Es ortográfica a propósito y no en perspectiva. Con perspectiva un
    rectángulo deja de proyectarse como paralelogramo, la inversión bilineal
    deja de ser un 2×2 y habría que dividir por w en cada píxel; a la
    profundidad que tiene un terrario —treinta centímetros— la perspectiva no
    se vería y la complicación no se pagaría. La sensación de fondo la dan la
    escala, la bruma y el contraste, que es como funciona de verdad mirar algo
    a través de un cristal húmedo.

    Una inclinación pequeña hacia abajo deja ver la superficie del sustrato y
    del agua en vez de sólo su canto. Sin ella el terreno sería una línea.
    """

    def __init__(self, u, ox, oy, tilt=0.30, depth_rise=0.34, skew=0.0):
        self.u = u
        self.ox, self.oy = ox, oy
        # `skew` desplaza lateralmente lo que se aleja. Con skew = 0 un plano de
        # x constante —un testero— proyecta sobre una recta y desaparece: la
        # sala se lee como alzado por geometría, no por iluminación. Con un
        # sesgo pequeño el testero se abre y la sala tiene retorno. Por defecto
        # 0, que es lo que P01 y P02 aprobados tienen dibujado.
        self.skew = skew
        self.tilt = tilt              # desempate de superficies coplanarias
        self.depth_rise = depth_rise  # cuánto sube en pantalla lo que se aleja
        # Hacia dónde está el observador. No es (0,-1,0): un desplazamiento
        # (0, dy, dz) no mueve el píxel si dz = -rise·dy, así que la dirección
        # que apunta a la cámara es (0, -1, rise) normalizada. Dicho de otro
        # modo, `depth_rise` no es sólo cómo se dibuja: es cuánto se mira desde
        # arriba, y con rise = 0,92 la cámara está a unos 43°.
        # Tomarlo por (0,-1,0) ponía el ángulo de visión a ras del suelo, y con
        # eso el Fresnel del agua salía 1 en toda la lámina: espejo opaco en vez
        # de agua.
        v = np.array([skew, -1.0, depth_rise])
        self.view = v / np.linalg.norm(v)

    def project(self, p):
        x, y, z = p
        return (self.ox + x * self.u + y * self.u * self.skew,
                self.oy - z * self.u - y * self.u * self.depth_rise)

    def depth(self, wx, wy, wz):
        # más cerca del cristal = mayor. La altura entra con peso pequeño para
        # desempatar superficies coplanarias sin alterar el orden real.
        return -wy + wz * self.tilt * 0.01

    def screen_dir(self, L):
        return np.array([L[0] * self.u + L[1] * self.u * self.skew,
                         -L[2] * self.u - L[1] * self.u * self.depth_rise])

    def depth_per_world(self, L):
        return float(-L[1] + L[2] * self.tilt * 0.01)


def setup(cam, mats, out_w, out_h, ss=2, coursing=None, features=None,
          top=0.0, bot=0.0):
    """Fija cámara, materiales y lienzo para la lámina que viene.

    `mats`:     nombre -> (albedo, rugosidad, relieve, escala de textura)
    `coursing`: nombre -> (ancho, hilada, traba) o None, para despiece
    `features`: nombre -> conjunto de rasgos opcionales del material:
                'estratos'  franjas por la coordenada vertical
                'humedad'   mancha que sube desde abajo
                'sin-canto' no desgastar los bordes de la pieza
    """
    global SS, W, H, OUT_W, OUT_H, TOP_OUT, BOT_OUT, CAM, MATS, MAT_IDS
    global COURSING, FEATURES
    SS = ss
    OUT_W, OUT_H = out_w, out_h
    W, H = out_w * ss, out_h * ss
    TOP_OUT, BOT_OUT = top, bot
    CAM = cam
    MATS = mats
    MAT_IDS = {k: i for i, k in enumerate(mats)}
    COURSING = coursing or {}
    FEATURES = features or {}


def hx(h):
    return np.array([int(h[i:i + 2], 16) / 255.0 for i in (1, 3, 5)], np.float32)


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


def set_textures(tex, grain):
    global TEX, GRAIN
    TEX, GRAIN = tex, grain


def _samp(tile, a, b, k):
    n = tile.shape[0]
    return map_coordinates(tile, [(b * k) % n, (a * k) % n], order=1, mode='wrap')


def sample_tex(a, b):
    return _samp(TEX, a, b, 74)


def sample_grain(a, b):
    return _samp(GRAIN, a, b, 150)


# ------------------------------------------------------------------ búferes ---

class Buffers:
    def __init__(self):
        self.albedo = np.zeros((H, W, 3), np.float32)
        self.normal = np.zeros((H, W, 3), np.float32)
        self.world = np.zeros((H, W, 3), np.float32)
        self.matid = np.full((H, W), -1, np.int16)
        self.mask = np.zeros((H, W), bool)
        self.depth = np.full((H, W), -1e9, np.float32)


def blit_quad(buf, world_corners, mat, tint=1.0, emissive=None,
              damp_height=2.1, alpha=None, modula=None):
    """Pinta un paralelogramo: W0 + u·(W1−W0) + v·(W3−W0).

    `alpha`, si se da, es una función de (u, v) que devuelve qué píxeles del
    paralelogramo pertenecen de verdad a la pieza. Con eso una hoja, un canto
    rodado o la lámina de agua se recortan dentro del cuadrilátero sin tener
    que teselar nada: es el recurso que permite a P02 tener formas orgánicas
    con el mismo rasterizador que pinta sillares rectos en P01.
    """
    w0, w1, _, w3 = [np.asarray(c, np.float64) for c in world_corners]
    s0, s1, s3 = CAM.project(w0), CAM.project(w1), CAM.project(w3)
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
    if alpha is not None:
        inside = inside & alpha(u, v)
    if not inside.any():
        return

    du, dv = w1 - w0, w3 - w0
    wx = w0[0] + u * du[0] + v * dv[0]
    wy = w0[1] + u * du[1] + v * dv[1]
    wz = w0[2] + u * du[2] + v * dv[2]
    depth = CAM.depth(wx, wy, wz)

    sub = buf.depth[y0:y1, x0:x1]
    win = inside & (depth > sub)
    if not win.any():
        return

    n = np.cross(du, dv)
    n = n / (np.linalg.norm(n) + 1e-9)
    if np.dot(n, CAM.view) < 0:
        n = -n

    base, rough, bump, tscale = MATS[mat]
    feats = FEATURES.get(mat, ())
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
    if 'sin-canto' in feats:
        wear = np.ones_like(wear)

    alb = np.stack([np.full_like(tex, base[i]) for i in range(3)], -1)
    alb *= (0.80 + 0.34 * tex)[..., None]
    alb *= (0.93 + 0.15 * grn)[..., None]
    if 'estratos' in feats:
        strat = 0.5 + 0.5 * np.sin(wz * 5.2 + 3.4 * tex + 1.7 * grn)
        alb *= (0.93 + 0.15 * strat)[..., None]
    alb *= (0.86 + 0.16 * wear)[..., None] * tint
    if modula is not None:
        # Modulación por coordenada de pieza, no de mundo. La textura triplanar
        # da materia; esto da dibujo propio de la pieza: el nervio de una hoja,
        # el degradado de la base a la punta. Sin ello una hoja es un recorte
        # de cartulina del mismo verde en toda su superficie.
        alb = alb * modula(u, v)[..., None]

    # manchas: humedad que sube desde abajo y veladura general
    if 'humedad' in feats:
        stain = sample_tex(ta * 0.30, tb * 0.30)
        damp = np.clip(1.0 - wz / damp_height, 0.0, 1.0) ** 1.6
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


def box(buf, x, y, z, dx, dy, dz, mat):
    blit_quad(buf, [(x, y, z + dz), (x + dx, y, z + dz),
                    (x + dx, y + dy, z + dz), (x, y + dy, z + dz)], mat)
    blit_quad(buf, [(x, y + dy, z), (x + dx, y + dy, z),
                    (x + dx, y + dy, z + dz), (x, y + dy, z + dz)], mat)
    blit_quad(buf, [(x + dx, y, z), (x + dx, y + dy, z),
                    (x + dx, y + dy, z + dz), (x + dx, y, z + dz)], mat)


# --------------------------------------------------------------- sombreado ---

JITTER = [(0.0, 0.0), (0.075, -0.045), (-0.062, 0.070), (0.030, 0.085)]
SHADOW_DOWN = 2      # la marcha va a media resolución: la penumbra es suave


def shadow_mask(buf, light, steps=58, bias=0.035):
    """Sombra de área: varias direcciones cercanas promediadas dan penumbra
    que se abre con la distancia al ocluyente, en vez de un canto duro."""
    k = SHADOW_DOWN
    dep = buf.depth[::k, ::k].copy()
    msk = buf.mask[::k, ::k].astype(np.float32)
    total = np.zeros(dep.shape, np.float32)
    for jx, jy in JITTER:
        lj = light + np.array([jx, jy, 0.0])
        total += _march(dep, msk, lj / np.linalg.norm(lj), k, steps, bias)
    total = gaussian_filter(total / len(JITTER), 1.4 * SS / k)
    hh, ww = buf.depth.shape
    yy, xx = np.mgrid[0:hh, 0:ww].astype(np.float32)
    return map_coordinates(total, [yy / k, xx / k], order=1, mode='nearest')


def _march(dep, msk, L, k, steps=58, bias=0.035):
    h, w = dep.shape
    sd = CAM.screen_dir(L) / k
    sn = float(np.linalg.norm(sd))
    d = sd / (sn + 1e-9)
    dd = CAM.depth_per_world(L)
    shade_ = np.zeros((h, w), np.float32)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    solid = msk > 0.5
    for i in range(1, steps):
        t = (i ** 1.30) * 1.6 * SS / k
        world_t = t / sn
        sx = np.clip(xx + d[0] * t, 0, w - 1)
        sy = np.clip(yy + d[1] * t, 0, h - 1)
        samp = map_coordinates(dep, [sy, sx], order=1, mode='nearest')
        inside = map_coordinates(msk, [sy, sx], order=1, mode='constant', cval=0.0) > 0.5
        hit = inside & (samp > dep + dd * world_t + bias) & solid
        shade_ = np.maximum(shade_, hit * (1.0 - 0.45 * i / steps))
    return shade_


def ambient_occlusion(buf, radii=(2, 5, 9, 15, 24), scale=0.10):
    ao = np.zeros((H, W), np.float32)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    rng = np.random.default_rng(3)
    for k in range(12):
        ang = 2 * math.pi * k / 12 + rng.random() * 0.2
        dx, dy = math.cos(ang), math.sin(ang)
        best = np.zeros((H, W), np.float32)
        for r in radii:
            sx = np.clip(xx + dx * r * SS, 0, W - 1)
            sy = np.clip(yy + dy * r * SS, 0, H - 1)
            samp = map_coordinates(buf.depth, [sy, sx], order=1, mode='nearest')
            best = np.maximum(best, np.clip((samp - buf.depth) / (r * scale), 0, 1))
        ao += best
    ao /= 12.0
    return gaussian_filter(np.clip(1.0 - 0.85 * ao, 0.0, 1.0), 2.0 * SS)


def roughness_map(buf):
    rough = np.ones((H, W), np.float32) * 0.7
    for name, i in MAT_IDS.items():
        rough[buf.matid == i] = MATS[name][1]
    return rough


def shade(buf, light, key, sky, bounce, bounce_k, fog, spill=None,
          amb_k=0.34, key_k=0.95, spec_k=0.55, shadow_k=0.82, fog_k=0.30,
          fog_pow=1.9, bounce_amt=0.45, ao_radii=(2, 5, 9, 15, 24), ao_scale=0.10,
          translucent=None):
    """Una clave direccional, ambiente hemisférico, sombra de área, oclusión,
    y opcionalmente una fuente secundaria puntual y translucidez por material.

    `spill`: (posición, color, caída, fuerza) para el derrame de un vano o de
    una lámina de agua. `translucent`: (ids de material, color, fuerza), para
    la hoja que deja pasar la luz por detrás, que es lo que distingue una hoja
    de un recorte de cartulina verde.
    """
    n = buf.normal
    ndl = np.clip((n * light[None, None, :]).sum(-1), 0, 1)

    rough = roughness_map(buf)
    hvec = light + CAM.view
    hvec = hvec / np.linalg.norm(hvec)
    ndh = np.clip((n * hvec[None, None, :]).sum(-1), 0, 1)
    spec = np.power(ndh, np.clip(2.0 / (rough ** 2 + 1e-3), 4, 260)) * (1.0 - rough) * 1.25

    sh = 1.0 - shadow_k * shadow_mask(buf, light)
    ao = ambient_occlusion(buf, ao_radii, ao_scale)

    up = np.clip(n[..., 2], 0, 1)
    amb = (sky[None, None, :] * up[..., None] + bounce[None, None, :] * (1.0 - up[..., None]))
    amb *= ao[..., None]

    lit = buf.albedo * (amb * amb_k + key[None, None, :] * (ndl * sh)[..., None] * key_k)

    if spill is not None:
        pos, col, fall_d, strength = spill
        to_op = np.asarray(pos, np.float32)[None, None, :] - buf.world
        dist = np.linalg.norm(to_op, axis=-1) + 1e-6
        l2 = to_op / dist[..., None]
        fall = 1.0 / (1.0 + (dist / fall_d) ** 2)
        ndl2 = np.clip((n * l2).sum(-1), 0, 1) * fall * buf.mask
        lit += buf.albedo * col[None, None, :] * ndl2[..., None] * strength

    down = np.clip(-n[..., 2], 0, 1)
    lit += buf.albedo * bounce_k[None, None, :] * (down * ao)[..., None] * bounce_amt
    lit += key[None, None, :] * (spec * sh)[..., None] * spec_k

    if translucent is not None:
        ids, col, strength = translucent
        sel = np.isin(buf.matid, list(ids))
        # luz que entra por detrás: máxima donde la normal se aparta de la luz
        back = np.clip(-(n * light[None, None, :]).sum(-1), 0, 1) ** 1.4
        lit += buf.albedo * col[None, None, :] * (back * sel * ao)[..., None] * strength

    # niebla por profundidad: lo lejano pierde contraste
    dep = np.where(buf.mask, buf.depth, 0)
    lo, hi = np.percentile(dep[buf.mask], [2, 98])
    f = np.clip((hi - dep) / (hi - lo + 1e-6), 0, 1) ** fog_pow
    k = fog_k * f[..., None]
    return lit * (1 - k) + fog[None, None, :] * k


def compose(lit, buf, backdrop, exposure=1.55, grain_amt=0.020, seed=11,
            bloom=0.26, bloom_col=(1.0, 0.90, 0.72), vignette=(1.22, 0.62, 1.7),
            contraste=0.0, pivote=0.42):
    """Escena sobre su propio vacío, con bloom, tonemap, grano y viñeta.

    El vacío es obra, no interfaz. Atarlo al fondo de página no funciona: la
    exposición y el tonemap se aplican también al fondo, así que el token sale
    convertido en otro color y deja costura en el borde de la lámina. El chrome
    va encima, en vector, con `chrome_bands()`.
    """
    bg = backdrop(W, H)
    img = np.where(buf.mask[..., None], lit, bg)

    lum = img.mean(-1)
    hi = np.clip(lum - 0.80, 0, None)
    img += gaussian_filter(hi, 10 * SS)[..., None] * np.array(bloom_col, np.float32)[None, None, :] * bloom

    img = np.clip(img, 0, None) * exposure
    img = img / (1.0 + img)
    img = np.power(np.clip(img, 0, 1), 1 / 2.2)

    # Curva de contraste opcional, en espacio de gamma. El tonemap x/(1+x)
    # comprime mucho y deja la imagen entera en una banda estrecha de medios:
    # sirve para una sala de piedra con una entrada de luz fuerte, y no sirve
    # para una escena de sombra donde todo el rango útil está junto. `pivote`
    # es lo que no se mueve; por debajo se oscurece y por encima se abre.
    if contraste:
        d = img - pivote
        img = pivote + d * (1.0 + contraste * (1.0 - np.abs(d) / max(pivote, 1 - pivote)))

    rng = np.random.default_rng(seed)
    img += (rng.random((H, W, 1)).astype(np.float32) - 0.5) * grain_amt

    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    a, b, p = vignette
    vig = np.clip(a - b * np.sqrt(((xx - W / 2) / (W / 2)) ** 2
                                  + ((yy - H / 2) / (H / 2)) ** 2) ** p, 0, 1)
    img *= vig[..., None]
    return np.clip(img, 0, 1)


# ------------------------------------------------- capa de chrome en vector ---
# El §5 de la norma visual permite composición híbrida: el raster lleva la
# materia y la luz, el vector lleva texto e interfaz, que tienen que quedar
# nítidos a cualquier tamaño y ser legibles por un lector de pantalla.

THEMES = {
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


def set_theme(name):
    global THEME
    THEME = THEMES[name]


def T(k):
    return THEME[k]


def chrome_bands():
    """Bandas de chrome en `bg-page`, con filo de `separator`.

    Una lámina representa una pantalla entera, y una pantalla tiene dos
    regiones que no obedecen a la misma regla: el stage es obra y no cambia con
    el tema (§2 y §6); el chrome es interfaz y sale de tokens. Con la banda
    puesta, el título es texto sobre su propio fondo y no necesita placa.
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


def label_plate(px, py, text, size, ls):
    """Rótulo sobre la escena: siempre con plaquita de superficie.

    Un token de acento garantiza contraste contra el fondo de SU tema, no
    contra la obra que hay debajo. Medido en P01, el acento sobre la caliza
    daba 1,17:1 en claro y 2,82:1 en navy; sobre `bg-surface`, 6,61:1 y
    7,48:1. Si el texto es chrome va en la banda; si tiene que ir encima de la
    obra, lleva placa.
    """
    w = len(text) * (size * 0.60 + ls) + 22
    return (f'<rect x="{px - w / 2:.1f}" y="{py - size:.1f}" width="{w:.1f}" '
            f'height="{size * 1.45:.1f}" rx="{size * 0.42:.1f}" '
            f'fill="{T("bg-surface")}" fill-opacity="0.94"/>'
            f'<text x="{px:.0f}" y="{py:.0f}" font-family="Georgia, serif" '
            f'font-size="{size}" fill="{T("accent")}" text-anchor="middle" '
            f'letter-spacing="{ls}">{text}</text>')


# ------------------------------------------------------------- relieve ---

def blit_heightfield(buf, mat, height, x0, x1, y0, y1, steps=96,
                     tint=1.0, tex_scale=None, alpha=None, damp_height=2.1,
                     bump_scale=1.0):
    """Rasteriza una superficie z = height(x, y) marchando en profundidad.

    El rasterizador de paralelogramos no sirve para esto: una celda de un
    terreno con relieve tiene sus cuatro esquinas a alturas distintas y deja de
    ser plana, así que la bilineal ya no se invierte con un 2×2. Se podría
    teselar en escalones, pero un terreno escalonado se lee como bancales, y el
    relieve de P02 no es decoración: es de donde cuelga la mecánica entera.

    Con cámara frontal ortográfica hay un camino mejor y más corto. Para cada
    píxel, fijada una profundidad `y`, la altura de mundo que le corresponde
    sale de invertir la proyección. Así que basta recorrer `y` de delante atrás
    y quedarse con el primer sitio donde el terreno alcanza esa altura. Es una
    marcha de rayo, pero como todos los rayos son paralelos se hace de una vez
    para toda la imagen.

    La normal sale de la pendiente real del terreno, no de un mapa de relieve:
    (-dz/dx, -dz/dy, 1) normalizado. Por eso una loma da sombra de verdad y
    recibe la luz por su cara correcta.
    """
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    u = CAM.u
    wx = (xx - CAM.ox) / u
    rise = CAM.depth_rise

    hit = np.zeros((H, W), bool)
    lo_y = np.zeros((H, W), np.float32)   # último paso por encima del terreno
    hi_y = np.zeros((H, W), np.float32)   # primer paso por debajo
    prev_d = None
    prev_y = None
    for i in range(steps + 1):
        wy = y0 + (y1 - y0) * i / steps
        # altura de mundo que ese píxel representa a esa profundidad
        z_pix = (CAM.oy - yy - wy * u * rise) / u
        z_sur = height(wx, wy)
        d = z_pix - z_sur          # >0 el píxel está por encima del terreno
        if prev_d is not None:
            cross = (prev_d > 0) & (d <= 0) & (~hit)
            if cross.any():
                lo_y = np.where(cross, prev_y, lo_y)
                hi_y = np.where(cross, wy, hi_y)
                hit |= cross
        prev_d, prev_y = d, wy

    # Afinado por bisección, una sola vez y sólo sobre el intervalo que la
    # marcha ya acotó. La interpolación lineal basta donde la superficie es
    # tendida, pero en la falda de un canto llega a ser casi paralela al rayo,
    # y ahí el corte no está donde dice la recta entre dos muestras: el
    # resultado eran flecos en la silueta. Siete bisecciones dividen el paso
    # por 128 y los quitan.
    wyc = 0.5 * (lo_y + hi_y)
    for _ in range(7):
        zc = (CAM.oy - yy - wyc * u * rise) / u
        dm = zc - height(wx, wyc)
        lo_y = np.where(dm > 0, wyc, lo_y)
        hi_y = np.where(dm > 0, hi_y, wyc)
        wyc = 0.5 * (lo_y + hi_y)
    hy = wyc
    hz = (CAM.oy - yy - hy * u * rise) / u

    inside = hit & (wx >= x0) & (wx <= x1)
    if alpha is not None:
        inside = inside & alpha(wx, hy, hz)
    if not inside.any():
        return

    depth = CAM.depth(wx, hy, hz)
    win = inside & (depth > buf.depth)
    if not win.any():
        return

    base, rough, bump, tscale = MATS[mat]
    feats = FEATURES.get(mat, ())
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
    if 'sin-canto' in feats:
        wear = np.ones_like(wear)

    alb = np.stack([np.full_like(tex, base[i]) for i in range(3)], -1)
    alb *= (0.80 + 0.34 * tex)[..., None]
    alb *= (0.93 + 0.15 * grn)[..., None]
    if 'estratos' in feats:
        strat = 0.5 + 0.5 * np.sin(wz * 5.2 + 3.4 * tex + 1.7 * grn)
        alb *= (0.93 + 0.15 * strat)[..., None]
    alb *= (0.86 + 0.16 * wear)[..., None] * tint
    if modula is not None:
        # Modulación por coordenada de pieza, no de mundo. La textura triplanar
        # da materia; esto da dibujo propio de la pieza: el nervio de una hoja,
        # el degradado de la base a la punta. Sin ello una hoja es un recorte
        # de cartulina del mismo verde en toda su superficie.
        alb = alb * modula(u, v)[..., None]

    # manchas: humedad que sube desde abajo y veladura general
    if 'humedad' in feats:
        stain = sample_tex(ta * 0.30, tb * 0.30)
        damp = np.clip(1.0 - wz / damp_height, 0.0, 1.0) ** 1.6
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


def box(buf, x, y, z, dx, dy, dz, mat):
    blit_quad(buf, [(x, y, z + dz), (x + dx, y, z + dz),
                    (x + dx, y + dy, z + dz), (x, y + dy, z + dz)], mat)
    blit_quad(buf, [(x, y + dy, z), (x + dx, y + dy, z),
                    (x + dx, y + dy, z + dz), (x, y + dy, z + dz)], mat)
    blit_quad(buf, [(x + dx, y, z), (x + dx, y + dy, z),
                    (x + dx, y + dy, z + dz), (x + dx, y, z + dz)], mat)


# --------------------------------------------------------------- sombreado ---

JITTER = [(0.0, 0.0), (0.075, -0.045), (-0.062, 0.070), (0.030, 0.085)]
SHADOW_DOWN = 2      # la marcha va a media resolución: la penumbra es suave


def shadow_mask(buf, light, steps=58, bias=0.035):
    """Sombra de área: varias direcciones cercanas promediadas dan penumbra
    que se abre con la distancia al ocluyente, en vez de un canto duro."""
    k = SHADOW_DOWN
    dep = buf.depth[::k, ::k].copy()
    msk = buf.mask[::k, ::k].astype(np.float32)
    total = np.zeros(dep.shape, np.float32)
    for jx, jy in JITTER:
        lj = light + np.array([jx, jy, 0.0])
        total += _march(dep, msk, lj / np.linalg.norm(lj), k, steps, bias)
    total = gaussian_filter(total / len(JITTER), 1.4 * SS / k)
    hh, ww = buf.depth.shape
    yy, xx = np.mgrid[0:hh, 0:ww].astype(np.float32)
    return map_coordinates(total, [yy / k, xx / k], order=1, mode='nearest')


def _march(dep, msk, L, k, steps=58, bias=0.035):
    h, w = dep.shape
    sd = CAM.screen_dir(L) / k
    sn = float(np.linalg.norm(sd))
    d = sd / (sn + 1e-9)
    dd = CAM.depth_per_world(L)
    shade_ = np.zeros((h, w), np.float32)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    solid = msk > 0.5
    for i in range(1, steps):
        t = (i ** 1.30) * 1.6 * SS / k
        world_t = t / sn
        sx = np.clip(xx + d[0] * t, 0, w - 1)
        sy = np.clip(yy + d[1] * t, 0, h - 1)
        samp = map_coordinates(dep, [sy, sx], order=1, mode='nearest')
        inside = map_coordinates(msk, [sy, sx], order=1, mode='constant', cval=0.0) > 0.5
        hit = inside & (samp > dep + dd * world_t + bias) & solid
        shade_ = np.maximum(shade_, hit * (1.0 - 0.45 * i / steps))
    return shade_


def ambient_occlusion(buf, radii=(2, 5, 9, 15, 24), scale=0.10):
    ao = np.zeros((H, W), np.float32)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    rng = np.random.default_rng(3)
    for k in range(12):
        ang = 2 * math.pi * k / 12 + rng.random() * 0.2
        dx, dy = math.cos(ang), math.sin(ang)
        best = np.zeros((H, W), np.float32)
        for r in radii:
            sx = np.clip(xx + dx * r * SS, 0, W - 1)
            sy = np.clip(yy + dy * r * SS, 0, H - 1)
            samp = map_coordinates(buf.depth, [sy, sx], order=1, mode='nearest')
            best = np.maximum(best, np.clip((samp - buf.depth) / (r * scale), 0, 1))
        ao += best
    ao /= 12.0
    return gaussian_filter(np.clip(1.0 - 0.85 * ao, 0.0, 1.0), 2.0 * SS)


def roughness_map(buf):
    rough = np.ones((H, W), np.float32) * 0.7
    for name, i in MAT_IDS.items():
        rough[buf.matid == i] = MATS[name][1]
    return rough


def shade(buf, light, key, sky, bounce, bounce_k, fog, spill=None,
          amb_k=0.34, key_k=0.95, spec_k=0.55, shadow_k=0.82, fog_k=0.30,
          fog_pow=1.9, bounce_amt=0.45, ao_radii=(2, 5, 9, 15, 24), ao_scale=0.10,
          translucent=None):
    """Una clave direccional, ambiente hemisférico, sombra de área, oclusión,
    y opcionalmente una fuente secundaria puntual y translucidez por material.

    `spill`: (posición, color, caída, fuerza) para el derrame de un vano o de
    una lámina de agua. `translucent`: (ids de material, color, fuerza), para
    la hoja que deja pasar la luz por detrás, que es lo que distingue una hoja
    de un recorte de cartulina verde.
    """
    n = buf.normal
    ndl = np.clip((n * light[None, None, :]).sum(-1), 0, 1)

    rough = roughness_map(buf)
    hvec = light + CAM.view
    hvec = hvec / np.linalg.norm(hvec)
    ndh = np.clip((n * hvec[None, None, :]).sum(-1), 0, 1)
    spec = np.power(ndh, np.clip(2.0 / (rough ** 2 + 1e-3), 4, 260)) * (1.0 - rough) * 1.25

    sh = 1.0 - shadow_k * shadow_mask(buf, light)
    ao = ambient_occlusion(buf, ao_radii, ao_scale)

    up = np.clip(n[..., 2], 0, 1)
    amb = (sky[None, None, :] * up[..., None] + bounce[None, None, :] * (1.0 - up[..., None]))
    amb *= ao[..., None]

    lit = buf.albedo * (amb * amb_k + key[None, None, :] * (ndl * sh)[..., None] * key_k)

    if spill is not None:
        pos, col, fall_d, strength = spill
        to_op = np.asarray(pos, np.float32)[None, None, :] - buf.world
        dist = np.linalg.norm(to_op, axis=-1) + 1e-6
        l2 = to_op / dist[..., None]
        fall = 1.0 / (1.0 + (dist / fall_d) ** 2)
        ndl2 = np.clip((n * l2).sum(-1), 0, 1) * fall * buf.mask
        lit += buf.albedo * col[None, None, :] * ndl2[..., None] * strength

    down = np.clip(-n[..., 2], 0, 1)
    lit += buf.albedo * bounce_k[None, None, :] * (down * ao)[..., None] * bounce_amt
    lit += key[None, None, :] * (spec * sh)[..., None] * spec_k

    if translucent is not None:
        ids, col, strength = translucent
        sel = np.isin(buf.matid, list(ids))
        # luz que entra por detrás: máxima donde la normal se aparta de la luz
        back = np.clip(-(n * light[None, None, :]).sum(-1), 0, 1) ** 1.4
        lit += buf.albedo * col[None, None, :] * (back * sel * ao)[..., None] * strength

    # niebla por profundidad: lo lejano pierde contraste
    dep = np.where(buf.mask, buf.depth, 0)
    lo, hi = np.percentile(dep[buf.mask], [2, 98])
    f = np.clip((hi - dep) / (hi - lo + 1e-6), 0, 1) ** fog_pow
    k = fog_k * f[..., None]
    return lit * (1 - k) + fog[None, None, :] * k


def compose(lit, buf, backdrop, exposure=1.55, grain_amt=0.020, seed=11,
            bloom=0.26, bloom_col=(1.0, 0.90, 0.72), vignette=(1.22, 0.62, 1.7),
            contraste=0.0, pivote=0.42):
    """Escena sobre su propio vacío, con bloom, tonemap, grano y viñeta.

    El vacío es obra, no interfaz. Atarlo al fondo de página no funciona: la
    exposición y el tonemap se aplican también al fondo, así que el token sale
    convertido en otro color y deja costura en el borde de la lámina. El chrome
    va encima, en vector, con `chrome_bands()`.
    """
    bg = backdrop(W, H)
    img = np.where(buf.mask[..., None], lit, bg)

    lum = img.mean(-1)
    hi = np.clip(lum - 0.80, 0, None)
    img += gaussian_filter(hi, 10 * SS)[..., None] * np.array(bloom_col, np.float32)[None, None, :] * bloom

    img = np.clip(img, 0, None) * exposure
    img = img / (1.0 + img)
    img = np.power(np.clip(img, 0, 1), 1 / 2.2)

    # Curva de contraste opcional, en espacio de gamma. El tonemap x/(1+x)
    # comprime mucho y deja la imagen entera en una banda estrecha de medios:
    # sirve para una sala de piedra con una entrada de luz fuerte, y no sirve
    # para una escena de sombra donde todo el rango útil está junto. `pivote`
    # es lo que no se mueve; por debajo se oscurece y por encima se abre.
    if contraste:
        d = img - pivote
        img = pivote + d * (1.0 + contraste * (1.0 - np.abs(d) / max(pivote, 1 - pivote)))

    rng = np.random.default_rng(seed)
    img += (rng.random((H, W, 1)).astype(np.float32) - 0.5) * grain_amt

    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    a, b, p = vignette
    vig = np.clip(a - b * np.sqrt(((xx - W / 2) / (W / 2)) ** 2
                                  + ((yy - H / 2) / (H / 2)) ** 2) ** p, 0, 1)
    img *= vig[..., None]
    return np.clip(img, 0, 1)


# ------------------------------------------------- capa de chrome en vector ---
# El §5 de la norma visual permite composición híbrida: el raster lleva la
# materia y la luz, el vector lleva texto e interfaz, que tienen que quedar
# nítidos a cualquier tamaño y ser legibles por un lector de pantalla.

THEMES = {
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


def set_theme(name):
    global THEME
    THEME = THEMES[name]


def T(k):
    return THEME[k]


def chrome_bands():
    """Bandas de chrome en `bg-page`, con filo de `separator`.

    Una lámina representa una pantalla entera, y una pantalla tiene dos
    regiones que no obedecen a la misma regla: el stage es obra y no cambia con
    el tema (§2 y §6); el chrome es interfaz y sale de tokens. Con la banda
    puesta, el título es texto sobre su propio fondo y no necesita placa.
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


def label_plate(px, py, text, size, ls):
    """Rótulo sobre la escena: siempre con plaquita de superficie.

    Un token de acento garantiza contraste contra el fondo de SU tema, no
    contra la obra que hay debajo. Medido en P01, el acento sobre la caliza
    daba 1,17:1 en claro y 2,82:1 en navy; sobre `bg-surface`, 6,61:1 y
    7,48:1. Si el texto es chrome va en la banda; si tiene que ir encima de la
    obra, lleva placa.
    """
    w = len(text) * (size * 0.60 + ls) + 22
    return (f'<rect x="{px - w / 2:.1f}" y="{py - size:.1f}" width="{w:.1f}" '
            f'height="{size * 1.45:.1f}" rx="{size * 0.42:.1f}" '
            f'fill="{T("bg-surface")}" fill-opacity="0.94"/>'
            f'<text x="{px:.0f}" y="{py:.0f}" font-family="Georgia, serif" '
            f'font-size="{size}" fill="{T("accent")}" text-anchor="middle" '
            f'letter-spacing="{ls}">{text}</text>')


# ------------------------------------------------------------- relieve ---

def blit_heightfield(buf, mat, height, x0, x1, y0, y1, steps=96,
                     tint=1.0, tex_scale=None, alpha=None, damp_height=2.1,
                     bump_scale=1.0):
    """Rasteriza una superficie z = height(x, y) marchando en profundidad.

    El rasterizador de paralelogramos no sirve para esto: una celda de un
    terreno con relieve tiene sus cuatro esquinas a alturas distintas y deja de
    ser plana, así que la bilineal ya no se invierte con un 2×2. Se podría
    teselar en escalones, pero un terreno escalonado se lee como bancales, y el
    relieve de P02 no es decoración: es de donde cuelga la mecánica entera.

    Con cámara frontal ortográfica hay un camino mejor y más corto. Para cada
    píxel, fijada una profundidad `y`, la altura de mundo que le corresponde
    sale de invertir la proyección. Así que basta recorrer `y` de delante atrás
    y quedarse con el primer sitio donde el terreno alcanza esa altura. Es una
    marcha de rayo, pero como todos los rayos son paralelos se hace de una vez
    para toda la imagen.

    La normal sale de la pendiente real del terreno, no de un mapa de relieve:
    (-dz/dx, -dz/dy, 1) normalizado. Por eso una loma da sombra de verdad y
    recibe la luz por su cara correcta.
    """
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    u = CAM.u
    wx = (xx - CAM.ox) / u
    rise = CAM.depth_rise

    hit = np.zeros((H, W), bool)
    lo_y = np.zeros((H, W), np.float32)   # último paso por encima del terreno
    hi_y = np.zeros((H, W), np.float32)   # primer paso por debajo
    prev_d = None
    prev_y = None
    for i in range(steps + 1):
        wy = y0 + (y1 - y0) * i / steps
        # altura de mundo que ese píxel representa a esa profundidad
        z_pix = (CAM.oy - yy - wy * u * rise) / u
        z_sur = height(wx, wy)
        d = z_pix - z_sur          # >0 el píxel está por encima del terreno
        if prev_d is not None:
            cross = (prev_d > 0) & (d <= 0) & (~hit)
            if cross.any():
                lo_y = np.where(cross, prev_y, lo_y)
                hi_y = np.where(cross, wy, hi_y)
                hit |= cross
        prev_d, prev_y = d, wy

    # Afinado por bisección, una sola vez y sólo sobre el intervalo que la
    # marcha ya acotó. La interpolación lineal basta donde la superficie es
    # tendida, pero en la falda de un canto llega a ser casi paralela al rayo,
    # y ahí el corte no está donde dice la recta entre dos muestras: el
    # resultado eran flecos en la silueta. Siete bisecciones dividen el paso
    # por 128 y los quitan.
    wyc = 0.5 * (lo_y + hi_y)
    for _ in range(7):
        zc = (CAM.oy - yy - wyc * u * rise) / u
        dm = zc - height(wx, wyc)
        lo_y = np.where(dm > 0, wyc, lo_y)
        hi_y = np.where(dm > 0, hi_y, wyc)
        wyc = 0.5 * (lo_y + hi_y)
    hy = wyc
    hz = (CAM.oy - yy - hy * u * rise) / u

    inside = hit & (wx >= x0) & (wx <= x1)
    if alpha is not None:
        inside = inside & alpha(wx, hy, hz)
    if not inside.any():
        return

    depth = CAM.depth(wx, hy, hz)
    win = inside & (depth > buf.depth)
    if not win.any():
        return

    # normal por pendiente real del terreno
    e = 0.02
    dzdx = (height(wx + e, hy) - height(wx - e, hy)) / (2 * e)
    dzdy = (height(wx, hy + e) - height(wx, hy - e)) / (2 * e)
    n = np.stack([-dzdx, -dzdy, np.ones_like(dzdx)], -1)
    n /= (np.linalg.norm(n, axis=-1, keepdims=True) + 1e-9)

    base, rough, bump, tscale = MATS[mat]
    feats = FEATURES.get(mat, ())
    ts = tex_scale if tex_scale is not None else tscale

    # Triplanar, igual que en el rasterizador de caras. Muestrear siempre por
    # (x, y) parece natural en un terreno, y funciona mientras el terreno sea
    # tendido. En la falda de un canto la superficie avanza mucho en y para
    # moverse poco en pantalla, así que la textura se estira y el resultado son
    # chorreones verticales. Mezclando las tres proyecciones por el peso de la
    # normal, la falda se textura por (y, z) y la cima por (x, y).
    wn = np.abs(n) ** 4
    wn = wn / (wn.sum(-1, keepdims=True) + 1e-9)
    pares = ((hy, hz), (wx, hz), (wx, hy))

    def tri(fn, da=0.0, db=0.0):
        out = 0.0
        for i, (a, b) in enumerate(pares):
            out = out + fn((a + da) * ts, (b + db) * ts) * wn[..., i]
        return out

    tex = tri(sample_tex)
    grn = tri(sample_grain)
    dga = tri(sample_grain, da=0.016) - grn
    dgb = tri(sample_grain, db=0.016) - grn

    alb = np.stack([np.full_like(tex, base[i]) for i in range(3)], -1)
    alb *= (0.80 + 0.34 * tex)[..., None]
    alb *= (0.93 + 0.15 * grn)[..., None]
    if 'estratos' in feats:
        strat = 0.5 + 0.5 * np.sin(hz * 5.2 + 3.4 * tex + 1.7 * grn)
        alb *= (0.93 + 0.15 * strat)[..., None]
    if 'humedad' in feats:
        stain = sample_tex(wx * 0.30, hy * 0.30)
        damp = np.clip(1.0 - hz / damp_height, 0.0, 1.0) ** 1.6
        alb *= (1.0 - 0.34 * stain * damp - 0.09 * stain)[..., None]
    # `tint` puede ser un número o una función de (x, y, z): así una zona
    # húmeda, una sombra de suelo o una veta se pintan por posición sin tener
    # que trocear el terreno en piezas.
    alb = alb * (tint(wx, hy, hz) if callable(tint) else tint)

    # el grano perturba la normal: sin esto el terreno es una tela lisa
    nn = n.copy()
    nn[..., 0] -= bump * bump_scale * 2.6 * dga
    nn[..., 1] -= bump * bump_scale * 2.6 * dgb
    nn /= (np.linalg.norm(nn, axis=-1, keepdims=True) + 1e-9)

    Y, X = np.where(win)
    buf.albedo[Y, X] = alb[win]
    buf.normal[Y, X] = nn[win]
    buf.world[Y, X] = np.stack([wx[win], hy[win], hz[win]], -1)
    buf.matid[Y, X] = MAT_IDS[mat]
    buf.mask[Y, X] = True
    buf.depth[Y, X] = depth[win]
