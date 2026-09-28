#!/usr/bin/env python3
"""R62 · P02 · Terrario vivo · render first-party.

Rework visual E4. La mecánica del concepto no se toca: lo que cambia es que
deja de ser ilustración vectorial plana y pasa por el motor de
`scripts/ig_render_e4.py`, el mismo que sostiene P01.

## Qué hereda de P01 y qué no

La `REFERENCIA-E4` dice que lo que se hereda es el nivel de exigencia, no el
lenguaje: ni la paleta de caliza, ni la axonometría, ni la sillería. P02 es
húmedo y frontal, así que cambia la cámara, cambian los materiales y cambia la
luz. Lo que se conserva es la lista: una fuente comprensible con penumbra,
contacto, oclusión y una segunda fuente; ninguna superficie grande resuelta con
color plano; ninguna imperfección uniforme; y composición propia a 390.

## De dónde sale el volumen

El terreno **es** una función de altura, no un dibujo de un terreno. De ahí
sale todo lo demás y por eso la mecánica se sostiene:

  - el agua existe sólo donde el terreno cae por debajo del nivel, así que se
    queda en el punto bajo porque es el punto bajo;
  - las rocas son domos sumados a esa misma función, así que hacen bulto en el
    relieve, dan sombra ladera abajo y el agua las rodea;
  - la humedad del sustrato se calcula por distancia al agua y por sombra, y se
    ve en el tono y el grano, no en un número.

Uso:  python3 scripts/r62_p02_render.py
"""
import argparse
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

sys.path.insert(0, str(Path(__file__).resolve().parent))
import ig_render_e4 as e4
from ig_render_e4 import blit_quad, blit_heightfield, T, label_plate, chrome_bands

REPO = Path(__file__).resolve().parent.parent

SS = 2
OUT_W, OUT_H = 1180, 900
TOP_OUT = BOT_OUT = 0.0

# --- caja del terrario, en unidades de mundo -------------------------------
TW, TD, TH = 10.0, 4.4, 6.4      # ancho, fondo, alto interiores
NIVEL_AGUA = 1.30                # cota de la lámina de agua

# --- materiales ------------------------------------------------------------
# (albedo, rugosidad, relieve, escala de textura)
MATS = {
    'sustrato':  ((0.135, 0.092, 0.058), 0.94, 1.70, 2.30),
    'turba':     ((0.098, 0.068, 0.046), 0.95, 1.55, 2.90),
    'arena':     ((0.215, 0.180, 0.130), 0.88, 1.30, 3.60),
    'grava':     ((0.165, 0.163, 0.152), 0.70, 1.80, 4.20),
    'roca':      ((0.125, 0.138, 0.126), 0.46, 1.40, 3.30),
    'pared':     ((0.062, 0.078, 0.074), 0.76, 1.25, 2.40),
    'madera':    ((0.40, 0.30, 0.195), 0.68, 1.35, 2.60),
    'musgo':     ((0.072, 0.135, 0.058), 0.96, 2.90, 7.80),
    'hoja':      ((0.085, 0.215, 0.098), 0.58, 0.85, 4.20),
    'hoja-clara':((0.155, 0.315, 0.120), 0.55, 0.80, 4.60),
    'hoja-honda':((0.026, 0.062, 0.035), 0.78, 0.95, 3.60),
    'agua':      ((0.06, 0.15, 0.16),  0.05, 0.22, 6.00),
}

# Rasgos. La humedad sube desde el sustrato en todo lo que toca tierra; los
# estratos sólo en lo que representa roca o suelo en banco.
FEATURES = {
    'sustrato': {'humedad', 'estratos'},
    'turba':    {'humedad', 'estratos'},
    'arena':    {'humedad', 'estratos'},
    'grava':    {'humedad'},
    'roca':     {'humedad'},
    'pared':    {'humedad', 'estratos'},
    'madera':   {'humedad'},
    'musgo':    set(),
    'hoja':     set(),
    'hoja-clara': set(),
    'hoja-honda': set(),
    'agua':     set(),
}

# Una sola luz cálida entrando por arriba a la izquierda, por delante del
# cristal. En este sistema +Y se aleja del observador, así que la componente
# negativa en Y es lo que la pone delante.
LUZ = np.array([-0.66, -0.42, 0.620])
LUZ /= np.linalg.norm(LUZ)


# --- relieve ---------------------------------------------------------------

# La roca de la segunda lámina. No está en la escena por defecto: se añade
# para el «después» del díptico, y todo lo demás —la sombra, la humedad que se
# retiene, el musgo que prende— sale solo de haberla añadido, porque esas tres
# cosas ya se calculan a partir de la lista de rocas. La cadena causal no está
# dibujada: está computada.
ROCA_DEMO = (6.38, 1.58, 0.92, 0.60, 0.74)

ROCAS = [
    # (cx, cy, radio x, radio y, altura)
    (4.62, 1.32, 1.02, 0.66, 0.78),   # la que tapa la luz de la ladera
    (7.94, 2.42, 0.86, 0.58, 0.54),
    (1.32, 2.30, 0.74, 0.52, 0.46),
    (8.90, 1.05, 0.52, 0.40, 0.30),
]


def _ruido(a, b):
    """Ruido de la tesela del motor, tolerante a la forma de lo que le llegue.

    El terreno se evalúa con formas muy distintas: la rejilla entera de la
    imagen, una columna, y un punto suelto cuando hay que saber a qué altura
    se planta un helecho. `map_coordinates` necesita al menos una dimensión y
    las dos coordenadas con la misma forma, así que se normaliza aquí y no en
    cada sitio donde se llama.
    """
    a = np.atleast_1d(np.asarray(a, np.float64))
    b = np.atleast_1d(np.asarray(b, np.float64))
    a, b = np.broadcast_arrays(a, b)
    return e4.sample_tex(a, b)


def con_roca_demo(activa):
    """Añade o quita la roca de demostración de la escena entera."""
    global ROCAS
    ROCAS = [r for r in ROCAS if r != ROCA_DEMO]
    if activa:
        ROCAS = ROCAS + [ROCA_DEMO]


def _suelo(x, y):
    """Terreno desnudo: loma a la izquierda, hondonada a la derecha.

    Es la misma silueta del concepto, en unidades de mundo en vez de píxeles,
    más una subida hacia el fondo —el sustrato se acumula contra la pared, como
    en un terrario de verdad— y una ondulación menor que rompe la simetría.
    """
    t = x / TW
    yy = np.clip(y, 0.0, None)
    z = (1.44
         + 1.30 * (yy / TD) ** 1.05                      # el sustrato se acumula
         + 1.26 * np.exp(-((t - 0.20) ** 2) / 0.030)     # loma
         - 1.34 * np.exp(-((t - 0.63) ** 2) / 0.018)     # hondonada
         + 0.48 * np.exp(-((t - 0.90) ** 2) / 0.020)     # repecho derecho
         + 0.13 * np.sin(t * 9.0 + 0.6)                  # ondulación menor
         + 0.080 * np.sin(t * 23.0 - 1.3) * np.cos(yy * 3.1)
         + 0.105 * (_ruido(x * 0.62, yy * 0.62) - 0.5))
    # suelo del vaso: por debajo de esto no hay sustrato
    return np.maximum(z, 0.34)


def _domo(x, y, cx, cy, rx, ry, h):
    """Canto rodado: un domo achatado con el mismo contorno roto.

    El exponente 0.62 en vez de la raíz cuadrada aplana la cima y endurece el
    hombro, que es la diferencia entre un canto y una media esfera.
    """
    k = _radio_roto(x, y, cx, cy)
    q = np.clip(1.0 - ((x - cx) / (rx * k)) ** 2 - ((y - cy) / (ry * k)) ** 2, 0.0, None)
    # El borde del domo tenía pendiente infinita y la marcha en profundidad lo
    # resolvía a flecos. Un suavizado en la falda le da pendiente finita: el
    # canto se hunde en la tierra en vez de estar posado encima.
    falda = np.clip(q / 0.14, 0.0, 1.0)
    falda = falda * falda * (3.0 - 2.0 * falda)
    return h * np.power(q, 0.62) * falda


def terreno(x, y):
    """Suelo con las rocas sumadas: una sola superficie, no objetos encima."""
    z = _suelo(x, y)
    for cx, cy, rx, ry, h in ROCAS:
        z = z + _domo(x, y, cx, cy, rx, ry, h)
    return z


def _radio_roto(x, y, cx, cy):
    """Radio perturbado por ruido: el contorno de un canto no es una elipse.

    Sin esto el límite entre roca y tierra es un óvalo perfecto y se lee como
    una pegatina. Con la perturbación el borde entra y sale, y además cada roca
    la rompe de otra manera porque el desfase depende de su centro.
    """
    ang = np.arctan2(y - cy, x - cx)
    return (1.0
            + 0.13 * np.sin(ang * 3.0 + cx * 5.1)
            + 0.08 * np.sin(ang * 5.0 - cy * 7.3)
            + 0.05 * np.sin(ang * 9.0 + cx * 2.7))


def en_roca(x, y, margen=0.0):
    m = np.zeros(np.shape(x), bool)
    for cx, cy, rx, ry, _ in ROCAS:
        k = _radio_roto(x, y, cx, cy)
        m |= (((x - cx) / ((rx - margen) * k)) ** 2
              + ((y - cy) / ((ry - margen) * k)) ** 2) <= 1.0
    return m


def hay_agua(x, y):
    return _suelo(x, y) < NIVEL_AGUA


def dist_agua(x, y):
    """Distancia horizontal aproximada al borde del charco.

    No hace falta exactitud: se usa para teñir la humedad del sustrato, que es
    un degradado. Se mide sobre el suelo desnudo, que es lo que decide dónde
    llega el agua.
    """
    return np.clip((_suelo(x, y) - NIVEL_AGUA) / 0.55, 0.0, 1.0)


# --- encuadre --------------------------------------------------------------

def configure(out_w, out_h, top=0.0, bot=0.0, margen=0.012, rise=0.46,
              ventana=None, z_rango=None):
    """Fija lienzo y cámara.

    El terrario llena el ancho y se recorta por arriba: el aire vacío sobre la
    vegetación no aporta nada y en la primera versión del concepto dejaba el
    tanque vacío dos tercios. Lo que se encuadra es la franja donde pasa algo.
    """
    global OUT_W, OUT_H, TOP_OUT, BOT_OUT
    OUT_W, OUT_H = out_w, out_h
    TOP_OUT, BOT_OUT = top, bot
    W, H = out_w * SS, out_h * SS
    x0, x1 = ventana if ventana else (0.0, TW)
    u = W * (1 - 2 * margen) / (x1 - x0)
    ox = W * margen - x0 * u
    # encuadre vertical: desde algo por debajo del punto bajo del terreno hasta
    # bien entrada la vegetación colgante
    z_lo, z_hi = z_rango or ((1.46, 4.86) if ventana is None else (1.05, 3.35))
    alto = (z_hi - z_lo) * u + TD * u * rise
    banda_sup = top * SS
    oy = banda_sup + (H - banda_sup - bot * SS - alto) / 2 + z_hi * u + TD * u * rise
    e4.setup(e4.Frontal(u, ox, oy, depth_rise=rise), MATS, out_w, out_h, ss=SS,
             features=FEATURES, top=top, bot=bot)


# --- escena ----------------------------------------------------------------

def pared_fondo(buf):
    """Pared de roca al fondo, con repisas. Da límite al volumen."""
    blit_quad(buf, [(0, TD, 0), (TW, TD, 0), (TW, TD, TH), (0, TD, TH)], 'pared')
    for x0, z0, w, h, prof in ((1.05, 3.05, 2.35, 0.20, 0.42),
                               (5.30, 3.72, 2.05, 0.17, 0.34),
                               (7.95, 2.52, 1.75, 0.22, 0.50),
                               (0.35, 4.35, 1.55, 0.16, 0.30)):
        y0 = TD - prof
        blit_quad(buf, [(x0, y0, z0 + h), (x0 + w, y0, z0 + h),
                        (x0 + w, TD, z0 + h), (x0, TD, z0 + h)], 'roca', 0.62)
        blit_quad(buf, [(x0, y0, z0), (x0 + w, y0, z0),
                        (x0 + w, y0, z0 + h), (x0, y0, z0 + h)], 'roca', 0.44)


def _humedad(x, y, z):
    """Tinte del sustrato: oscurece donde hay agua cerca.

    Es el estado real del sistema hecho visible sin números: la celda junto al
    charco retiene humedad, y la tierra húmeda es más oscura y más saturada que
    la seca. También entra la sombra de las rocas, que reduce la pérdida.
    """
    seco = dist_agua(x, y)
    mojado = 1.0 - seco
    sombra = np.zeros(np.shape(x), np.float32)
    for cx, cy, rx, ry, h in ROCAS:
        # ladera abajo y a la derecha de cada roca, que es donde cae su sombra
        d = np.sqrt(((x - cx - 0.62) / (rx * 2.4)) ** 2 + ((y - cy - 0.34) / (ry * 2.6)) ** 2)
        sombra = np.maximum(sombra, np.clip(1.0 - d, 0, 1))
    k = np.clip(mojado + 0.42 * sombra, 0, 1)[..., None]
    oscuro = np.array([0.55, 0.60, 0.58], np.float32)[None, None, :]
    humedo = (1.0 - k) + k * oscuro

    # Grumos y hojarasca. El grano fino del material solo daba una moqueta
    # uniforme, y una imperfección uniforme se lee como patrón, no como uso:
    # es la segunda de las cinco preguntas de la referencia E4. Esto mete
    # variación de tono a escala de palmo, que es la que de verdad se ve.
    grumo = e4.sample_tex(x * 0.85, y * 0.85)
    hojarasca = e4.sample_grain(x * 2.4 + 11.0, y * 2.4)
    v = (0.80 + 0.40 * grumo) * (0.90 + 0.22 * hojarasca)
    calido = np.stack([v * 1.04, v * 0.98, v * 0.90], -1)
    return humedo * calido


def sustrato(buf):
    """El terreno, y las rocas que son parte de él."""
    blit_heightfield(buf, 'sustrato', terreno, 0, TW, 0, TD, steps=150,
                     tint=_humedad, alpha=lambda x, y, z: ~en_roca(x, y))
    blit_heightfield(buf, 'roca', terreno, 0, TW, 0, TD, steps=150,
                     alpha=lambda x, y, z: en_roca(x, y))


def seccion_frontal(buf):
    """Las capas del sustrato, vistas en sección a través del cristal.

    Es lo que distingue un terrario de un decorado: se ve de qué está hecho.
    Cada capa es un cuadrilátero recortado por arriba con la curva del terreno,
    así que la sección sigue el relieve en vez de ser una franja recta.

    Y lleva el nivel freático dibujado, que no es adorno: bajo el charco el
    sustrato está saturado y se ve más oscuro, y la mancha se va apagando al
    alejarse. Es el mismo campo de humedad que decide dónde prende el musgo,
    enseñado por su corte. Sin esto la sección era una banda plana ocupando el
    tercio inferior de la lámina.
    """
    def freatico(u, v):
        x = u * TW
        z = v * TH
        moja = 1.0 - dist_agua(x, np.zeros_like(x))
        # la saturación sube desde el fondo del vaso y se desvanece con la cota
        alto = np.clip(1.0 - (z - 0.25) / 1.35, 0.0, 1.0)
        veta = 0.86 + 0.28 * e4.sample_tex(x * 1.15, z * 2.1)
        return veta * (1.0 - 0.42 * moja * alto)

    def capa(mat, z0, z1, oscuro=1.0):
        blit_quad(buf, [(0, 0, 0), (TW, 0, 0), (TW, 0, TH), (0, 0, TH)], mat, oscuro,
                  alpha=lambda u, v, a=z0, b=z1:
                      (v * TH >= a) & (v * TH < np.minimum(b, terreno(u * TW, 0.0))),
                  modula=freatico)

    # Tras el cristal no entra luz directa: la sección va oscurecida.
    capa('grava', 0.00, 0.62, 0.30)
    capa('arena', 0.62, 0.95, 0.28)
    capa('turba', 0.95, 1.45, 0.32)
    capa('sustrato', 1.45, TH, 0.38)


def agua(lit, buf):
    """El agua es un volumen, no una cara. Se compone después de sombrear.

    Pintarla como material opaco daba una mancha de color, que es justo lo que
    el concepto dice que no puede ser. Pero tratarla sólo como una lámina
    tampoco vale, y el render lo enseñó: el fondo del charco que se ve por
    delante, a través del cristal, no está debajo de la superficie en la
    dirección de la vista —el rayo sale por el cristal frontal antes de llegar
    a la lámina—, así que aparecía seco e iluminado dentro del charco.

    Lo correcto es medir el camino dentro del agua. Para cada píxel sumergido,
    el rayo hacia el observador sale del agua por lo primero que encuentre: la
    lámina o el cristal frontal. Esa distancia es la que absorbe, y de ahí sale
    solo lo que hay que dibujar: el borde claro porque el camino es corto, el
    centro oscuro porque es largo, y el rojo antes que el verde y el azul
    porque el agua es así.
    """
    x, y, z = buf.world[..., 0], buf.world[..., 1], buf.world[..., 2]
    v = e4.CAM.view                      # hacia el observador, normalizado

    # Cuánto agua hay ENTRE el punto y el observador, no si el punto está
    # mojado. La diferencia importa y el render la enseñó: la ladera del fondo
    # del charco no está sumergida —está por encima del nivel— pero se ve a
    # través de toda la columna de agua, y al mirar sólo el punto salía seca e
    # iluminada, con una banda pálida en medio del charco.
    #
    # Se integra el trozo del rayo que va por dentro del agua. El agua ocupa
    # las celdas que están por debajo del nivel, dentro del vaso del charco y
    # por encima del terreno; el rayo sale por la lámina o por el cristal, lo
    # que llegue antes.
    t_lamina = (NIVEL_AGUA - z) / max(v[2], 1e-6)
    t_cristal = y / max(-v[1], 1e-6)
    tmax = np.clip(np.minimum(t_lamina, t_cristal), 0.0, None)
    pasos = 26
    dt = tmax / pasos
    camino = np.zeros_like(tmax)
    for i in range(pasos):
        t = (i + 0.5) * dt
        zz = z + t * v[2]
        yy = y + t * v[1]
        en = ((zz < NIVEL_AGUA) & (yy >= 0.0) & (zz > terreno(x, np.clip(yy, 0.0, None)) - 0.01)
              & hay_agua(x, np.clip(yy, 0.0, None)))
        camino = camino + en * dt
    dentro = buf.mask & (camino > 0.004)
    if not dentro.any():
        return lit
    por_lamina = dentro & (t_lamina <= t_cristal)

    k = np.array([3.10, 1.05, 0.80], np.float32)      # el rojo se va antes
    absorbe = np.exp(-camino[..., None] * k[None, None, :])
    disperso = np.array([0.040, 0.105, 0.115], np.float32)[None, None, :]
    out = np.where(dentro[..., None],
                   lit * absorbe * 0.60 + disperso * (1.0 - absorbe) * 0.20,
                   lit)

    # --- la superficie, sólo donde el rayo sale por ella ------------------
    sx = x
    sy = y - t_lamina * (-v[1])
    on = e4.sample_grain(sx * 1.15, sy * 1.15)
    on2 = e4.sample_grain(sx * 3.30 + 4.0, sy * 3.30)
    n = np.stack([(on - 0.5) * 0.46 + (on2 - 0.5) * 0.22,
                  (on2 - 0.5) * 0.46 + (on - 0.5) * 0.22,
                  np.ones_like(on)], -1)
    n /= np.linalg.norm(n, axis=-1, keepdims=True)
    h = LUZ + v
    h = h / np.linalg.norm(h)
    ndh = np.clip((n * h[None, None, :]).sum(-1), 0, 1)
    # destellos: pocos y pequeños. Es lo que dice «superficie» sin dibujar
    # ondas, y lo que distingue agua de un cristal esmerilado.
    brillo = np.power(ndh, 120.0) * 2.6
    ndv = np.clip((n * v[None, None, :]).sum(-1), 0, 1)
    fres = 0.028 + 0.972 * (1.0 - ndv) ** 5
    # Refleja lo que hay encima, que en un terrario es dosel y sombra. Poner
    # ahí un gris de cielo era lo que dejaba el charco lechoso: un espejo del
    # cielo dentro de una caja cerrada.
    dosel = np.array([0.050, 0.082, 0.072], np.float32)[None, None, :]
    sup = (out * (1.0 - fres[..., None]) + dosel * fres[..., None]
           + np.array([1.00, 0.906, 0.706], np.float32)[None, None, :] * brillo[..., None])
    out = np.where(por_lamina[..., None], sup, out)

    # orilla: el agua se aclara donde muere contra la tierra, porque ahí el
    # camino dentro del agua es casi cero
    orilla = np.clip(1.0 - camino / 0.085, 0, 1) ** 2 * dentro
    out = out + np.array([0.26, 0.34, 0.31], np.float32)[None, None, :] * orilla[..., None] * 0.32
    return out


# --- vegetación ------------------------------------------------------------
# Una hoja es un cuadrilátero en el espacio recortado por su propio perfil. No
# hace falta teselar nada: el rasterizador ya acepta una máscara sobre (u, v),
# así que el contorno de la hoja se describe con una función en vez de con
# geometría. Eso permite que cada hoja tenga su orientación propia en tres
# dimensiones, que es lo que hace que la luz caiga distinta en cada una; una
# hoja plana de frente sería una calcomanía.

def _ancho_hoja(u, punta=1.15):
    """Media anchura de la hoja a lo largo de su eje, de 0 en la base a 0 en la
    punta. Cada mitad de la hoja se recorta con esto."""
    return np.clip(np.sin(np.pi * np.clip(u, 0, 1)) ** punta, 0, 1)


def _dibujo_hoja(u, v):
    """Nervio y filo, en coordenadas de la media hoja: v = 0 en el nervio."""
    nervio = np.exp(-(v ** 2) / 0.012)
    filo = np.clip(v, 0, 1) ** 2
    largo = 0.84 + 0.30 * np.clip(u, 0, 1)
    return largo * (1.0 - 0.38 * nervio) * (0.90 + 0.26 * filo)


def hoja(buf, base, eje, ancho, mat, tint=1.0, pliegue=0.26):
    """Una hoja, en dos mitades con un ángulo entre ellas.

    `base` es el arranque, `eje` la dirección y el largo, `ancho` el vector
    transversal. Plana de una pieza la hoja es una calcomanía: las dos mitades
    reciben exactamente la misma luz y el ojo lo lee como papel. Doblada por el
    nervio, cada mitad tiene su normal, una queda hacia la luz y la otra se va
    a la sombra, y eso es lo que da carnosidad sin añadir geometría.

    Cada mitad va del nervio al filo, así que su coordenada transversal es 0 en
    el nervio y 1 en el borde: el recorte es `v <= ancho(u)` y el nervio se
    dibuja donde v vale cero.
    """
    b = np.asarray(base, float)
    e = np.asarray(eje, float)
    a = np.asarray(ancho, float)
    alza = np.cross(e, a)
    n = np.linalg.norm(alza)
    alza = alza / n * np.linalg.norm(a) * pliegue if n > 1e-9 else a * 0.0
    for lado in (-1, 1):
        d = a / 2 * lado + alza
        blit_quad(buf, [b, b + e, b + e + d, b + d], mat, tint,
                  alpha=lambda u, v: v <= _ancho_hoja(u),
                  modula=_dibujo_hoja)


def _raquis(x, y, z0, alto, giro, t):
    cg, sg = math.cos(giro), math.sin(giro)
    return (x + cg * alto * 0.46 * t ** 1.5,
            y + sg * alto * 0.30 * t ** 1.5,
            z0 + alto * (1.18 * t - 0.42 * t ** 2.4))


def helecho(buf, x, y, alto, giro, mat, mat_clara, n=16):
    """Fronda: un raquis que arquea y folíolos alternados que menguan.

    Los folíolos no son simétricos a propósito: cada lado sale con un ángulo y
    un tamaño ligeramente distintos. Una fronda perfectamente simétrica se lee
    como un patrón y no como una planta.
    """
    r = np.random.default_rng(int(abs(x) * 9721 + abs(y) * 5303) % 99991)
    z0 = float(np.ravel(terreno(np.array([float(x)]), np.array([float(y)])))[0]) + 0.02
    for i in range(n - 1):
        p0 = _raquis(x, y, z0, alto, giro, i / n)
        p1 = _raquis(x, y, z0, alto, giro, (i + 1) / n)
        d = np.array([0.030, 0.0, 0.0])
        blit_quad(buf, [p0, p1, tuple(np.array(p1) + d), tuple(np.array(p0) + d)],
                  'madera', 0.78)
    for i in range(n):
        t = (i + 1) / n
        px, py, pz = _raquis(x, y, z0, alto, giro, t)
        largo = alto * 0.30 * (1.0 - 0.52 * t) * (0.85 + 0.3 * r.random())
        for lado in (-1, 1):
            ang = giro + lado * (1.05 + 0.34 * r.random()) + 0.2 * (r.random() - 0.5)
            caida = 0.34 + 0.5 * t + 0.3 * (r.random() - 0.5)
            eje = np.array([math.cos(ang) * largo, math.sin(ang) * largo * 0.55,
                            -caida * largo * 0.5])
            ancho = np.array([-math.sin(ang), math.cos(ang) * 0.6, 0.42 + 0.5 * r.random()])
            ancho = ancho / np.linalg.norm(ancho) * largo * 0.26
            m = mat_clara if (i + lado) % 3 == 0 else mat
            hoja(buf, (px, py, pz), eje, ancho, m, 0.86 + 0.28 * r.random())


def mata(buf, x, y, alto, mat, mat_clara, hojas=11, seed=0, tono=1.0):
    """Mata de hojas lanceoladas saliendo de un punto."""
    r = np.random.default_rng(seed)
    z0 = float(np.ravel(terreno(np.array([float(x)]), np.array([float(y)])))[0])
    for i in range(hojas):
        ang = 2 * math.pi * i / hojas + 0.35 * r.random()
        inc = 0.55 + 0.75 * r.random()
        largo = alto * (0.72 + 0.5 * r.random())
        eje = np.array([math.cos(ang) * largo * inc * 0.7,
                        math.sin(ang) * largo * inc * 0.45,
                        largo * (1.25 - inc * 0.55)])
        ancho = np.array([-math.sin(ang), math.cos(ang) * 0.6, 0.30 + 0.4 * r.random()])
        ancho = ancho / np.linalg.norm(ancho) * largo * 0.32
        m = mat_clara if i % 3 == 0 else mat
        hoja(buf, (x, y, z0), eje, ancho, m, tono * (0.82 + 0.3 * r.random()))


def colgante(buf, x, y, z, largo, mat, mat_clara, seed=0):
    """Vegetación que cuelga desde el borde superior del tanque."""
    r = np.random.default_rng(seed)
    n = 18
    for i in range(n):
        t = (i + 1) / n
        pz = z - largo * t
        px = x + math.sin(t * 2.4 + seed) * largo * 0.22
        for lado in (-1, 1):
            lh = largo * 0.155 * (0.7 + 0.5 * r.random())
            ang = lado * (1.2 + 0.4 * r.random())
            eje = np.array([math.cos(ang) * lh, 0.35 * (r.random() - 0.5) * lh,
                            -lh * (0.3 + 0.5 * r.random())])
            ancho = np.array([-math.sin(ang) * 0.8, 0.55, 0.25])
            ancho = ancho / np.linalg.norm(ancho) * lh * 0.66
            m = mat_clara if i % 3 == 1 else mat
            hoja(buf, (px, y, pz), eje, ancho, m, 0.80 + 0.3 * r.random())


def tapiz(buf):
    """Tapiz bajo sobre el sustrato: hojarasca y brotes.

    Sin esto la tierra es un campo continuo, y un campo continuo de un solo
    material es exactamente lo que la tercera pregunta de la referencia E4
    señala: una superficie grande resuelta de una sola manera. En un terrario
    plantado el suelo casi nunca se ve limpio.
    """
    def donde(x, y, z):
        n1 = e4.sample_tex(x * 0.95 + 3.0, y * 0.95)
        n2 = e4.sample_grain(x * 2.6, y * 2.6 + 7.0)
        return (n1 * 0.78 + n2 * 0.50 > 0.50) & (~hay_agua(x, y))

    blit_heightfield(buf, 'hoja-honda', lambda x, y: terreno(x, y) + 0.012,
                     0, TW, 0, TD, steps=130, alpha=donde, bump_scale=2.2,
                     tint=0.85)


def musgo_parches(buf):
    """El musgo prende donde hay sombra y humedad: es estado, no decoración.

    Se pinta como relieve propio ligeramente por encima del terreno, recortado
    por la misma condición que lo hace prender. Donde no se cumple no hay
    musgo, y eso se ve sin leer nada.
    """
    def prende(x, y, z):
        humedo = 1.0 - dist_agua(x, y)
        sombra = np.zeros(np.shape(x), np.float32)
        for cx, cy, rx, ry, _ in ROCAS:
            d = np.sqrt(((x - cx - 0.62) / (rx * 2.4)) ** 2
                        + ((y - cy - 0.34) / (ry * 2.6)) ** 2)
            sombra = np.maximum(sombra, np.clip(1.0 - d, 0, 1))
        moteado = e4.sample_grain(x * 1.7, y * 1.7)
        return (humedo * 0.62 + sombra * 1.25 + moteado * 0.30 > 0.80) & (~hay_agua(x, y))

    blit_heightfield(buf, 'musgo', lambda x, y: terreno(x, y) + 0.030,
                     0, TW, 0, TD, steps=130, alpha=prende, bump_scale=1.7)


HELECHOS = ((1.05, 2.95, 1.15, 0.6), (2.35, 2.55, 1.42, -0.5),
            (8.60, 2.80, 1.10, 2.4), (9.55, 2.15, 1.35, 2.9),
            (0.55, 1.75, 1.70, 0.2), (3.35, 1.15, 1.52, -1.1),
            (6.15, 2.65, 1.08, 1.8), (7.30, 1.95, 1.50, 2.1),
            (4.55, 3.15, 0.95, 0.9), (5.25, 0.85, 1.35, -1.6),
            (2.05, 0.60, 1.25, -0.8), (9.05, 3.25, 0.90, 2.6),
            (0.30, 3.20, 0.98, 0.4), (7.80, 0.70, 1.30, 2.3))
# Plantado denso y repartido con semilla fija. La tierra tiene que ser
# textura de apoyo, no el asunto de la lámina: con seis matas el terrario
# parecía una ladera pelada con adornos.
MATAS = ((2.47, 0.66, 0.48),
         (1.69, 0.52, 0.48),
         (9.01, 3.45, 0.66),
         (2.33, 2.4, 0.42),
         (1.86, 0.67, 0.39),
         (9.1, 3.57, 0.68),
         (7.88, 1.02, 0.43),
         (6.22, 3.18, 0.71),
         (8.65, 0.6, 0.58),
         (6.65, 2.27, 0.37),
         (4.75, 0.61, 0.75),
         (8.51, 2.44, 0.43),
         (8.93, 2.54, 0.72),
         (8.34, 2.28, 0.49),
         (5.95, 1.97, 0.36),
         (3.13, 3.5, 0.3),
         (0.64, 2.76, 0.42),
         (5.33, 2.13, 0.45),
         (9.77, 1.03, 0.49),
         (2.15, 2.78, 0.42),
         (3.62, 3.24, 0.44),
         (5.56, 3.87, 0.33),
         (0.79, 1.17, 0.66),
         (6.11, 1.2, 0.45),
         (1.9, 2.09, 0.3),
         (6.89, 3.83, 0.76),
         (7.25, 4.09, 0.29),
         (2.97, 4.11, 0.67),
         (4.14, 4.02, 0.59),
         (8.05, 1.42, 0.38),
         (4.46, 0.8, 0.47),
         (9.43, 1.58, 0.28),
         (0.63, 0.93, 0.67),
         (3.68, 1.41, 0.33),
         (9.62, 1.95, 0.38),
         (0.77, 0.47, 0.36),
         (6.7, 0.85, 0.3),
         (4.91, 1.25, 0.78),
         (1.37, 2.37, 0.67),
         (4.13, 4.2, 0.52),
         (2.52, 1.89, 0.3),
         (4.24, 1.24, 0.72),
         (8.18, 2.24, 0.3),
         (2.64, 1.22, 0.38),
         (2.42, 3.73, 0.35),
         (0.69, 3.96, 0.56),
         (9.71, 1.86, 0.73),
         (6.48, 3.41, 0.65),
         (4.95, 0.62, 0.39),
         (8.59, 3.85, 0.74),
         (3.43, 2.88, 0.68),
         (6.37, 3.51, 0.54))

COLGANTES = ((1.75, 5.20, 1.55), (4.55, 5.35, 1.25),
             (7.05, 5.25, 1.70), (9.10, 5.10, 1.30),
             (0.60, 5.05, 1.85), (3.15, 5.30, 1.05),
             (5.85, 5.15, 1.45), (8.20, 5.35, 1.15))
# Primer plano: hojas cortadas por el marco. Son la capa más cercana y la más
# oscura, y su trabajo es enmarcar, no lucirse.
PRIMER_PLANO = ((-0.15, 1.35, 0.42, 1.85), (0.35, 1.95, 0.72, 1.35),
                (10.10, 1.65, 2.62, 1.95), (9.55, 2.25, 2.25, 1.30),
                (4.75, 1.02, 1.28, 1.25), (6.45, 1.05, 1.85, 1.15))


def _en_seco(x, y):
    """Una planta no se planta dentro del charco.

    Al ahondar la hondonada, varias posiciones del concepto quedaron bajo el
    agua y las plantas salían sumergidas. Se filtran por la misma función que
    decide dónde hay agua, no por una lista aparte: si mañana cambia el
    relieve, el filtro sigue siendo correcto.
    """
    return not bool(np.ravel(hay_agua(np.array([float(x)]), np.array([float(y)])))[0])


def madera(buf, x0, y0, x1, y1, z1, grueso, n=14):
    """Madera flotada: una vara que se levanta del suelo y se afina.

    Va por segmentos, cada uno un cuadrilátero propio, así que la vara puede
    curvarse y adelgazar sin dejar de ser geometría de verdad: coge la luz por
    su cara y da sombra sobre el sustrato.
    """
    z0 = float(np.ravel(terreno(np.array([x0]), np.array([y0])))[0]) - 0.06
    for i in range(n):
        t0, t1 = i / n, (i + 1) / n
        def pt(t):
            return (x0 + (x1 - x0) * t ** 1.35,
                    y0 + (y1 - y0) * t,
                    z0 + (z1 - z0) * (1.25 * t - 0.25 * t * t))
        a, b = np.array(pt(t0)), np.array(pt(t1))
        g0 = grueso * (1.0 - 0.55 * t0)
        g1 = grueso * (1.0 - 0.55 * t1)
        blit_quad(buf, [a - (g0, 0, 0), b - (g1, 0, 0), b + (g1, 0, 0), a + (g0, 0, 0)],
                  'madera', 0.95)
        blit_quad(buf, [a - (0, g0, 0), b - (0, g1, 0), b + (0, g1, 0), a + (0, g0, 0)],
                  'madera', 0.72)


# El helecho que se está colocando, suspendido sobre su huella. Es el asunto
# de la lámina: enseña la mecánica A → B, no un terrario terminado.
# Sitio elegido a propósito: terreno seco, junto a la orilla y dentro del
# encuadre. Junto a la orilla porque ahí la colocación significa algo —el
# sustrato retiene más humedad cerca del charco—, que es el argumento entero
# del juguete: el sitio importa.
EN_VUELO = (5.10, 2.60, 0.92)      # x, y, alzado sobre el terreno


def elemento_en_vuelo(buf):
    x, y, alzado = EN_VUELO
    z0 = float(np.ravel(terreno(np.array([x]), np.array([y])))[0])
    # mismo generador que el resto de las plantas: lo que se coloca es una
    # planta de verdad, no un icono de una planta
    r = np.random.default_rng(31)
    for i in range(13):
        ang = 2 * math.pi * i / 13 + 0.3 * r.random()
        inc = 0.52 + 0.7 * r.random()
        largo = 0.78 * (0.75 + 0.45 * r.random())
        eje = np.array([math.cos(ang) * largo * inc * 0.70,
                        math.sin(ang) * largo * inc * 0.45,
                        largo * (1.25 - inc * 0.55)])
        ancho = np.array([-math.sin(ang), math.cos(ang) * 0.6, 0.30 + 0.4 * r.random()])
        ancho = ancho / np.linalg.norm(ancho) * largo * 0.34
        m = 'hoja-clara' if i % 3 == 0 else 'hoja'
        hoja(buf, (x, y, z0 + alzado), eje, ancho, m, 0.92 + 0.22 * r.random())
    # cepellón
    blit_quad(buf, [(x - 0.17, y - 0.02, z0 + alzado - 0.16),
                    (x + 0.17, y - 0.02, z0 + alzado - 0.16),
                    (x + 0.17, y - 0.02, z0 + alzado + 0.02),
                    (x - 0.17, y - 0.02, z0 + alzado + 0.02)], 'turba', 1.0,
              alpha=lambda u, v: ((2 * u - 1) ** 2 + (1.6 * (v - 0.85)) ** 2) < 1.0)


MOSTRAR_EN_VUELO = True


def vegetacion(buf):
    madera(buf, 2.95, 0.95, 4.05, 2.15, 2.95, 0.115)
    madera(buf, 8.05, 0.70, 7.15, 1.55, 1.85, 0.085)
    for x, y, alto, giro in HELECHOS:
        if not _en_seco(x, y):
            continue
        helecho(buf, x, y, alto, giro, 'hoja', 'hoja-clara')
    for i, (x, y, alto) in enumerate(MATAS):
        if not _en_seco(x, y):
            continue
        # tono por planta: un terrario tiene especies distintas, y sin esta
        # variación todas las matas salen del mismo verde y se leen como
        # copias del mismo recorte
        mata(buf, x, y, alto, 'hoja', 'hoja-clara', seed=7 + i,
             tono=0.72 + 0.62 * ((i * 37 % 19) / 19.0))
    for i, (x, z, largo) in enumerate(COLGANTES):
        # cuelgan por delante de la pared, no pegadas a ella
        colgante(buf, x, 0.95 + 0.36 * (i % 4), z, largo, 'hoja', 'hoja-clara', seed=3 + i)
    # primer plano: hojas grandes y oscuras cortadas por el marco
    if MOSTRAR_EN_VUELO:
        elemento_en_vuelo(buf)
    for x, z, ang, largo in PRIMER_PLANO:
        eje = np.array([math.cos(ang) * largo, 0.12, math.sin(ang) * largo])
        ancho = np.array([-math.sin(ang), 0.5, math.cos(ang)])
        ancho = ancho / np.linalg.norm(ancho) * largo * 0.46
        # el primer plano es la capa más oscura: enmarca, no luce
        hoja(buf, (x, 0.10, z), eje, ancho, 'hoja-honda', 0.42)


def build_scene(buf):
    pared_fondo(buf)
    sustrato(buf)
    tapiz(buf)
    musgo_parches(buf)
    seccion_frontal(buf)
    vegetacion(buf)


# --- luz -------------------------------------------------------------------

def backdrop(W, H):
    """El aire del terrario por encima de la vegetación. Es obra."""
    bg = np.zeros((H, W, 3), np.float32)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    r = np.sqrt(((xx - W * 0.30) / (W * 0.80)) ** 2 + ((yy - H * 0.18) / (H * 0.95)) ** 2)
    bg += np.array([0.085, 0.105, 0.098])[None, None, :] * np.clip(1.20 - r, 0, 1)[..., None]
    bg += np.array([0.016, 0.022, 0.024])[None, None, :]
    return bg


def lighting(buf):
    """Clave cálida por arriba a la izquierda, ambiente frío, y el agua como
    segunda fuente: devuelve luz verdosa a lo que tiene encima."""
    return e4.shade(
        buf, LUZ,
        key=np.array([1.00, 0.906, 0.706], np.float32),      # #FFE7B4
        sky=np.array([0.27, 0.36, 0.40], np.float32),
        bounce=np.array([0.19, 0.24, 0.17], np.float32),
        bounce_k=np.array([0.20, 0.30, 0.24], np.float32),
        fog=np.array([0.022, 0.034, 0.032], np.float32),
        spill=(np.array([6.4, 1.5, NIVEL_AGUA], np.float32),
               np.array([0.52, 0.86, 0.80], np.float32), 2.6, 0.40),
        fog_k=0.52, amb_k=0.105, key_k=1.55, spec_k=0.16, shadow_k=0.92,
        translucent=([e4.MAT_IDS[m] for m in ('hoja', 'hoja-clara', 'hoja-honda')],
                     np.array([0.55, 0.95, 0.40], np.float32), 0.85))


def cristal(img):
    """El cristal del tanque: canto, un reflejo y condensación.

    El §7 del concepto lo pide así: que exista y no estorbe. Va al final, sobre
    la imagen ya compuesta, porque es lo que hay entre la escena y el
    observador y no participa de su iluminación.

    La condensación va sólo donde tiene sentido —arriba, que es donde el
    cristal está más frío— y agrupada por ruido, no repartida: una retícula de
    gotas se lee como una textura de gotas, no como vaho.
    """
    H, W = img.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    u, v = xx / W, yy / H
    out = img.copy()

    # reflejo: una banda diagonal suave, más viva arriba a la izquierda
    banda = np.exp(-(((u * 1.5 + v * 0.55) - 0.46) ** 2) / 0.020)
    banda = banda * np.clip(1.25 - v * 1.5, 0, 1)
    out = out + banda[..., None] * np.array([0.085, 0.100, 0.105], np.float32) * 0.85

    # condensación: agrupada, y sólo en la mitad alta
    gx, gy = (xx / W) * 26.0, (yy / H) * 20.0
    cel_x, cel_y = np.floor(gx), np.floor(gy)
    h1 = np.modf(np.sin(cel_x * 12.9898 + cel_y * 78.233) * 43758.5453)[0]
    h2 = np.modf(np.sin(cel_x * 39.3468 + cel_y * 11.135) * 24634.6345)[0]
    fx, fy = gx - cel_x - 0.15 - 0.7 * h1, gy - cel_y - 0.15 - 0.7 * h2
    rad = 0.10 + 0.24 * h1
    d = np.sqrt(fx ** 2 + fy ** 2) / np.maximum(rad, 1e-3)
    zona = np.clip(1.35 - v * 2.3, 0, 1) * np.clip(e4.sample_tex(u * 5.0, v * 5.0) * 1.7 - 0.45, 0, 1)
    gota = np.clip(1.0 - d, 0, 1) ** 0.55 * (h2 > 0.30) * zona
    # una gota es una lente: aclara arriba y oscurece abajo
    luz = np.clip(-(fy / np.maximum(rad, 1e-3)), 0, 1) ** 1.4
    out = out + gota[..., None] * (luz[..., None] * 0.22 - 0.10)

    # canto del vaso
    borde = (np.clip(1.0 - u * W / 5.0, 0, 1) + np.clip(1.0 - (1 - u) * W / 5.0, 0, 1)
             + np.clip(1.0 - v * H / 5.0, 0, 1))
    out = out + np.clip(borde, 0, 1)[..., None] * np.array([0.10, 0.12, 0.13], np.float32)
    return np.clip(out, 0, 1)



# ----------------------------- capa vectorial de chrome sobre el raster ---
# El §5 de la norma permite composición híbrida: el raster lleva la materia y
# la luz; el vector, el texto y la interfaz, que tienen que quedar nítidos a
# cualquier tamaño y ser legibles por un lector de pantalla.

def po(p):
    """Proyecta a coordenadas de la imagen de salida."""
    x, y = e4.CAM.project(p)
    return (x / SS, y / SS)


BANDEJA = (('Sustrato', 'sustrato'), ('Piedra', 'piedra'), ('Madera', 'madera'),
           ('Musgo', 'musgo'), ('Planta', 'planta'), ('Agua', 'agua'),
           ('Refugio', 'refugio'))


def _icono(cx, cy, r, clase, ink):
    """Silueta del elemento, dibujada, no un pictograma de catálogo."""
    if clase == 'sustrato':
        return (f'<path d="M{cx-r:.1f} {cy+r*0.45:.1f} q{r*0.5:.1f} {-r*0.55:.1f} {r:.1f} 0 '
                f'q{r*0.5:.1f} {r*0.55:.1f} {r:.1f} 0" fill="none" stroke="{ink}" stroke-width="1.6"/>'
                f'<path d="M{cx-r:.1f} {cy-r*0.1:.1f} q{r*0.5:.1f} {-r*0.5:.1f} {r:.1f} 0 '
                f'q{r*0.5:.1f} {r*0.5:.1f} {r:.1f} 0" fill="none" stroke="{ink}" stroke-width="1.2" opacity="0.7"/>')
    if clase == 'piedra':
        return (f'<path d="M{cx-r:.1f} {cy+r*0.55:.1f} L{cx-r*0.72:.1f} {cy-r*0.25:.1f} '
                f'L{cx-r*0.1:.1f} {cy-r*0.62:.1f} L{cx+r*0.68:.1f} {cy-r*0.2:.1f} '
                f'L{cx+r:.1f} {cy+r*0.55:.1f} Z" fill="none" stroke="{ink}" stroke-width="1.6" '
                f'stroke-linejoin="round"/>')
    if clase == 'madera':
        return (f'<path d="M{cx-r:.1f} {cy+r*0.5:.1f} q{r*0.7:.1f} {-r*0.5:.1f} {r*1.0:.1f} {-r*0.95:.1f} '
                f'q{r*0.35:.1f} {-r*0.3:.1f} {r:.1f} {-r*0.25:.1f}" fill="none" stroke="{ink}" '
                f'stroke-width="2.4" stroke-linecap="round"/>')
    if clase == 'musgo':
        d = []
        for i in range(7):
            x = cx - r + 2 * r * i / 6.0
            d.append(f'M{x:.1f} {cy+r*0.5:.1f} q{r*0.12:.1f} {-r*0.55:.1f} {r*0.24:.1f} 0')
        return (f'<path d="{" ".join(d)}" fill="none" stroke="{ink}" stroke-width="1.5" '
                f'stroke-linecap="round"/>')
    if clase == 'planta':
        d = []
        for a in (-1.0, -0.45, 0.0, 0.45, 1.0):
            d.append(f'M{cx:.1f} {cy+r*0.6:.1f} q{a*r*0.55:.1f} {-r*0.55:.1f} {a*r*0.85:.1f} {-r*1.15:.1f}')
        return (f'<path d="{" ".join(d)}" fill="none" stroke="{ink}" stroke-width="1.6" '
                f'stroke-linecap="round"/>')
    if clase == 'agua':
        return (f'<path d="M{cx-r:.1f} {cy+r*0.1:.1f} q{r*0.5:.1f} {-r*0.42:.1f} {r:.1f} 0 '
                f'q{r*0.5:.1f} {r*0.42:.1f} {r:.1f} 0" fill="none" stroke="{ink}" stroke-width="1.7"/>'
                f'<path d="M{cx-r*0.7:.1f} {cy+r*0.62:.1f} q{r*0.35:.1f} {-r*0.3:.1f} {r*0.7:.1f} 0 '
                f'q{r*0.35:.1f} {r*0.3:.1f} {r*0.7:.1f} 0" fill="none" stroke="{ink}" '
                f'stroke-width="1.3" opacity="0.65"/>')
    return (f'<path d="M{cx-r:.1f} {cy+r*0.55:.1f} L{cx-r*0.55:.1f} {cy-r*0.45:.1f} '
            f'L{cx+r*0.55:.1f} {cy-r*0.45:.1f} L{cx+r:.1f} {cy+r*0.55:.1f}" fill="none" '
            f'stroke="{ink}" stroke-width="1.6" stroke-linejoin="round"/>')


def bandeja(x0, y0, lado, paso, sel=4, etiquetas=True):
    """Bandeja de elementos. Objetivos de `lado` px, nunca menos de 44.

    El §10 del concepto lo fija: el arrastre no puede ser la única vía, así que
    esto es una lista de opciones que se recorre y se activa, y el terrario es
    el segundo paso. Lo seleccionado se marca con acento y con marco, no sólo
    con color.
    """
    o = []
    for i, (nombre, clase) in enumerate(BANDEJA):
        x = x0 + i * paso
        activo = i == sel
        o.append(f'<rect x="{x:.0f}" y="{y0:.0f}" width="{lado}" height="{lado}" rx="9" '
                 f'fill="{T("bg-surface-soft") if activo else T("bg-surface")}" '
                 f'stroke="{T("accent") if activo else T("border-control")}" '
                 f'stroke-width="{2 if activo else 1}"/>')
        o.append(_icono(x + lado / 2, y0 + lado * 0.44, lado * 0.24, clase,
                        T('accent') if activo else T('text-muted')))
        if etiquetas:
            o.append(f'<text x="{x + lado / 2:.0f}" y="{y0 + lado - 7:.0f}" '
                     f'font-family="Georgia, serif" font-size="9.5" text-anchor="middle" '
                     f'fill="{T("accent") if activo else T("text-muted")}">{nombre}</text>')
    return ''.join(o)


def destino():
    """El anillo del destino y la vertical de caída: la mecánica A → B.

    Sin esto la lámina es un terrario bonito. Con esto se ve qué se está
    haciendo: hay un elemento cogido, tiene un sitio al que va, y ese sitio
    está señalado sobre el terreno, no en un panel.
    """
    x, y, alzado = EN_VUELO
    z0 = float(np.ravel(terreno(np.array([x]), np.array([y])))[0])
    cx, cy = po((x, y, z0))
    px, py = po((x, y, z0 + alzado))
    rx = abs(po((x + 0.42, y, z0))[0] - cx)
    ry = rx * 0.46
    o = [f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="none" '
         f'stroke="{T("accent")}" stroke-width="2.4" stroke-dasharray="7 6"/>',
         f'<line x1="{px:.1f}" y1="{py:.1f}" x2="{cx:.1f}" y2="{cy:.1f}" '
         f'stroke="{T("accent")}" stroke-width="1.8" stroke-dasharray="4 6" opacity="0.9"/>']
    return ''.join(o)


def overlay_svg(data_uri):
    o = [destino()]
    px, py = po((EN_VUELO[0], EN_VUELO[1],
                 float(np.ravel(terreno(np.array([EN_VUELO[0]]), np.array([EN_VUELO[1]])))[0])
                 + EN_VUELO[2] + 0.95))
    o.append(label_plate(px, py, 'HELECHO', 17, 1.6))
    o.append(bandeja(44, OUT_H - 96, 62, 78))
    o.append(f'<text x="{OUT_W-44}" y="{OUT_H-64}" font-family="Georgia, serif" font-size="13.5" '
             f'fill="{T("text-muted")}" text-anchor="end">Elige un elemento · elige un sitio · '
             f'coloca</text>')
    o.append(f'<text x="{OUT_W-44}" y="{OUT_H-42}" font-family="Georgia, serif" font-size="13.5" '
             f'fill="{T("text-muted")}" text-anchor="end">Sin objetivo, sin puntuación, '
             f'sin final</text>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
            f'viewBox="0 0 {OUT_W} {OUT_H}" width="{OUT_W}" height="{OUT_H}" role="img" '
            f'aria-label="Terrario vivo. Render de concepto de Iris Green: terrario visto de '
            f'frente a través del cristal, con loma a la izquierda, charco en la hondonada y un '
            f'helecho suspendido sobre el sitio donde se va a plantar.">'
            f'<image href="{data_uri}" xlink:href="{data_uri}" x="0" y="0" '
            f'width="{OUT_W}" height="{OUT_H}"/>'
            + chrome_bands() +
            f'<text x="44" y="58" font-family="Georgia, serif" font-size="33" fill="{T("text")}" '
            f'letter-spacing="0.3">Terrario vivo</text>'
            f'<text x="44" y="86" font-family="Georgia, serif" font-size="16" fill="{T("text-muted")}">'
            f'Colocar, ver cómo responde, ajustar. El sitio importa.</text>'
            + ''.join(o) +
            f'<text x="{OUT_W-44}" y="{OUT_H-20}" font-family="Georgia, serif" font-size="12.5" '
            f'fill="{T("text-muted")}" text-anchor="end" opacity="0.85">P02 · render first-party · '
            f'norma visual sep 2026</text>'
            f'</svg>')


def overlay_movil(data_uri):
    """Composición vertical propia, no la de escritorio encogida.

    El §10 del concepto lo pide explícito: a 320–390 el terrario ocupa el ancho
    completo y la bandeja es una tira horizontal debajo, nunca un panel lateral
    diminuto y nunca encima del terrario. Los objetivos suben a 60 px porque
    aquí se tocan con el dedo.
    """
    o = [destino()]
    o.append(bandeja(9, OUT_H - 126, 60, 58, etiquetas=False))
    o.append(f'<text x="{OUT_W/2:.0f}" y="{OUT_H-142}" font-family="Georgia, serif" '
             f'font-size="12" fill="{T("text-muted")}" text-anchor="middle" '
             f'letter-spacing="1">QUÉ VAS A COLOCAR</text>')
    o.append(f'<text x="{OUT_W/2:.0f}" y="{OUT_H-34}" font-family="Georgia, serif" '
             f'font-size="14.5" fill="{T("text-muted")}" text-anchor="middle">'
             f'Toca el sitio y suéltalo</text>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
            f'viewBox="0 0 {OUT_W} {OUT_H}" width="{OUT_W}" height="{OUT_H}" role="img" '
            f'aria-label="Terrario vivo en vertical. El terrario ocupa el ancho y la bandeja de '
            f'elementos va en una tira debajo.">'
            f'<image href="{data_uri}" xlink:href="{data_uri}" x="0" y="0" '
            f'width="{OUT_W}" height="{OUT_H}"/>'
            + chrome_bands() +
            f'<text x="18" y="36" font-family="Georgia, serif" font-size="24" fill="{T("text")}">'
            f'Terrario vivo</text>'
            f'<text x="18" y="58" font-family="Georgia, serif" font-size="13" fill="{T("text-muted")}">'
            f'El sitio importa: el agua se queda en el punto bajo.</text>'
            + ''.join(o) + '</svg>')



# ------------------------------------------------------ lámina de causalidad ---

CADENA = (
    ('1', 'La roca ocupa su sitio', 'y tapa la luz que llegaba a la ladera.'),
    ('2', 'Esas celdas quedan en sombra', 'y pierden menos humedad.'),
    ('3', 'Están junto al charco', 'así que reciben agua y ahora la retienen.'),
    ('4', 'El musgo pide sombra y humedad', 'y en esas celdas prende.'),
)


def lamina_causalidad(render_panel, ancho=1180, alto=900):
    """Díptico del mismo encuadre, antes y después de colocar una roca.

    Una sola imagen no puede enseñar una causa: enseña un estado. Por eso van
    las dos, con el mismo encuadre y la misma luz, y lo único que cambia entre
    ellas es la roca. Debajo, la cadena numerada, que es literalmente lo que el
    sistema calcula y no una metáfora.
    """
    pan_w = (ancho - 44 * 2 - 26) // 2
    pan_h = 512
    top, cad = 104, alto - 196
    izq = render_panel(False, pan_w, pan_h)
    der = render_panel(True, pan_w, pan_h)
    o = []
    for i, (uri, titulo) in enumerate(((izq, 'ANTES'), (der, 'DESPUÉS'))):
        x = 44 + i * (pan_w + 26)
        o.append(f'<image href="{uri}" xlink:href="{uri}" x="{x}" y="{top + 34}" '
                 f'width="{pan_w}" height="{pan_h}"/>')
        o.append(f'<rect x="{x}" y="{top + 34}" width="{pan_w}" height="{pan_h}" fill="none" '
                 f'stroke="{T("separator")}" stroke-width="1"/>')
        o.append(f'<text x="{x}" y="{top + 22}" font-family="Georgia, serif" font-size="12.5" '
                 f'fill="{T("text-muted")}" letter-spacing="1.4">{titulo}</text>')
    # la cadena, numerada
    paso = (ancho - 88) / 4.0
    for i, (n, fuerte, resto) in enumerate(CADENA):
        x = 44 + i * paso
        o.append(f'<circle cx="{x + 13:.0f}" cy="{cad + 13}" r="13" fill="none" '
                 f'stroke="{T("accent")}" stroke-width="1.6"/>')
        o.append(f'<text x="{x + 13:.0f}" y="{cad + 18}" font-family="Georgia, serif" '
                 f'font-size="14" fill="{T("accent")}" text-anchor="middle">{n}</text>')
        o.append(f'<text x="{x:.0f}" y="{cad + 48}" font-family="Georgia, serif" font-size="15" '
                 f'fill="{T("text")}">{fuerte}</text>')
        o.append(f'<text x="{x:.0f}" y="{cad + 70}" font-family="Georgia, serif" font-size="13.5" '
                 f'fill="{T("text-muted")}">{resto}</text>')
        if i < 3:
            o.append(f'<path d="M{x + paso - 34:.0f} {cad + 13} h16 m-5 -5 l5 5 l-5 5" '
                     f'fill="none" stroke="{T("text-muted")}" stroke-width="1.6" '
                     f'stroke-linecap="round" stroke-linejoin="round"/>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
            f'viewBox="0 0 {ancho} {alto}" width="{ancho}" height="{alto}" role="img" '
            f'aria-label="Terrario vivo, segundo estado. Dos veces la misma ladera: antes y '
            f'después de colocar una roca. Después, la ladera queda en sombra, retiene humedad '
            f'y el musgo prende.">'
            f'<rect x="0" y="0" width="{ancho}" height="{alto}" fill="{T("bg-page")}"/>'
            f'<text x="44" y="58" font-family="Georgia, serif" font-size="33" fill="{T("text")}" '
            f'letter-spacing="0.3">Una roca, cuatro consecuencias</text>'
            f'<text x="44" y="86" font-family="Georgia, serif" font-size="16" '
            f'fill="{T("text-muted")}">Mismo encuadre, misma luz. Lo único que cambia entre las '
            f'dos es la roca.</text>'
            + ''.join(o) +
            f'<text x="{ancho-44}" y="{alto-20}" font-family="Georgia, serif" font-size="12.5" '
            f'fill="{T("text-muted")}" text-anchor="end" opacity="0.85">P02 · segundo estado · '
            f'norma visual sep 2026</text>'
            f'</svg>')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', type=Path, default=REPO / 'editorial/r62/p02-terrario-vivo')
    ap.add_argument('--rapido', action='store_true',
                    help='media resolución, para iterar mirando')
    ap.add_argument('--solo', default=None, help='renderizar una sola lámina')
    args = ap.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)

    global SS
    if args.rapido:
        SS = 1

    e4.set_textures(e4.fbm_tile(octaves=6, gain=0.56, lowest=26, seed=11),
                    e4.fbm_tile(octaves=6, gain=0.62, lowest=44, seed=29))

    import base64, io

    def render(nombre, w, h, overlay, top, bot, ventana=None, z_rango=None):
        configure(w, h, top, bot, ventana=ventana, z_rango=z_rango)
        buf = e4.Buffers()
        build_scene(buf)
        img = cristal(e4.compose(agua(lighting(buf), buf), buf, backdrop,
                                 exposure=1.95, vignette=(1.20, 0.62, 1.55),
                                 contraste=0.34, pivote=0.38))
        im = Image.fromarray((img * 255 + 0.5).astype(np.uint8))
        im = im.resize((OUT_W, OUT_H), Image.LANCZOS)
        im.save(args.out / f'{nombre}.webp', quality=92, method=6)
        bio = io.BytesIO()
        # El raster incrustado va a calidad 76 y no 90. P02 tiene mucho más
        # detalle de alta frecuencia que P01 —follaje, grano, musgo—, y a 90 la
        # lámina de escritorio se iba a 638 KB. A 76 pesa 257 KB y, comparadas
        # a 1440, no se distingue cuál es cuál. El .webp suelto se queda en 92,
        # que es el archivo del que se parte si hay que recomponer.
        im.save(bio, 'WEBP', quality=76, method=6)
        uri = 'data:image/webp;base64,' + base64.b64encode(bio.getvalue()).decode('ascii')
        (args.out / f'{nombre}.svg').write_text(overlay(uri), encoding='utf-8')
        print(f'Escrito {args.out}/{nombre}.svg  ({OUT_W}x{OUT_H})')

    # escritorio y móvil son dos composiciones, no una escalada
    # Escritorio y móvil son dos composiciones, no una escalada. En vertical no
    # cabe el terrario entero: si se mete entero queda diminuto en el centro con
    # el aire vacío alrededor, que es exactamente el error que el §12 prohíbe.
    # Lo que cabe es la parte donde pasa algo —la orilla, el charco y el sitio
    # donde se está colocando—, a tamaño de poder tocarlo.
    VENT_MOVIL, Z_MOVIL = (3.55, 7.25), (1.30, 3.95)
    laminas = [('gameplay-navy', 'navy', 1180, 900, overlay_svg, 104, 120, None, None),
               ('gameplay-claro', 'claro', 1180, 900, overlay_svg, 104, 120, None, None),
               ('gameplay-movil-navy', 'navy', 390, 730, overlay_movil, 62, 160,
                VENT_MOVIL, Z_MOVIL),
               ('gameplay-movil-claro', 'claro', 390, 730, overlay_movil, 62, 160,
                VENT_MOVIL, Z_MOVIL)]
    for nombre, tema, w, h, ov, top, bot, vent, zr in laminas:
        if args.solo and args.solo not in nombre:
            continue
        e4.set_theme(tema)
        con_roca_demo(False)
        render(nombre, w, h, ov, top, bot, vent, zr)

    if args.solo and 'causalidad' not in args.solo:
        return

    def panel(con_roca, w, h):
        global MOSTRAR_EN_VUELO
        MOSTRAR_EN_VUELO = False
        con_roca_demo(con_roca)
        configure(w, h, ventana=(3.95, 8.35))
        buf = e4.Buffers()
        build_scene(buf)
        img = cristal(e4.compose(agua(lighting(buf), buf), buf, backdrop,
                                 exposure=1.95, vignette=(1.12, 0.38, 1.55),
                                 contraste=0.34, pivote=0.38))
        im = Image.fromarray((img * 255 + 0.5).astype(np.uint8)).resize((w, h), Image.LANCZOS)
        bio = io.BytesIO()
        im.save(bio, 'WEBP', quality=76, method=6)
        return 'data:image/webp;base64,' + base64.b64encode(bio.getvalue()).decode('ascii')

    for tema in ('navy', 'claro'):
        e4.set_theme(tema)
        svg = lamina_causalidad(panel)
        (args.out / f'causalidad-{tema}.svg').write_text(svg, encoding='utf-8')
        print(f'Escrito {args.out}/causalidad-{tema}.svg')
    con_roca_demo(False)


if __name__ == '__main__':
    main()
