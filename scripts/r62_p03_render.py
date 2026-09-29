#!/usr/bin/env python3
"""R62 · P03 · Rutas de luz · concepto visual y mecánica.

`R62_P03_RUTAS_LUZ_CONCEPT_AUTHORIZED`. Sobre el motor `ig_render_e4.py`, que
queda como está: P03 no lo toca.

## Qué es

Un puzle de caminos. Entra una hoja de luz de tarde por un postigo, y la
persona la lleva hasta unas pantallas de papel colocando y girando espejos de
latón sobre ménsulas fijas. Cuando la luz llega a una pantalla, la pantalla
revela el dibujo que tiene impreso y su banderola se levanta.

## La regla que ordena todo lo demás

**La ruta no se dibuja: se calcula.** El haz sale del postigo con una
dirección, rebota en los espejos que hay puestos —reflexión de verdad respecto
a la normal de cada espejo—, se parte en el divisor y se corta contra los
obstáculos. De ahí salen solas las tres cosas que el encargo pide:

  - **varias soluciones**, porque hay más de una geometría que lleva al mismo
    sitio, y el juego no sabe cuál «esperaba»;
  - **obstáculos que importan**, porque cortan el rayo de verdad;
  - **una segunda lámina con consecuencia computada**, que es la lección que
    dejó P02: si la consecuencia se dibuja a mano, se mide bien y no se ve.

## Por qué el haz se ve

El camino tiene que leerse como luz en el aire y no como una línea pintada
encima. Para cada píxel se integra el tramo del rayo de vista que va por dentro
del haz, ocluido por lo que haya delante. Es el mismo recurso que hizo creíble
el agua de P02, aplicado a polvo en suspensión en vez de a agua.

Uso:  python3 scripts/r62_p03_render.py
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
from ig_render_e4 import blit_quad, box, T, label_plate, chrome_bands

REPO = Path(__file__).resolve().parent.parent

SS = 2
OUT_W, OUT_H = 1180, 900
TOP_OUT = BOT_OUT = 0.0

# --- la sala, en unidades de mundo ----------------------------------------
AW, AD, AH = 11.0, 4.2, 8.5      # ancho, fondo, alto
Y_MURO = AD                      # plano del muro del fondo
HAZ_Y0, HAZ_Y1 = 0.62, 1.58      # el haz es una lámina con grosor en profundidad

MATS = {
    # La sala va oscura a propósito. El asunto de la lámina es el aire con luz
    # dentro, y con el muro a albedo alto lo que se veía era un muro de ladrillo
    # muy bien texturado con una raya encima.
    'muro':     ((0.145, 0.128, 0.108), 0.86, 1.15, 2.60),
    'zocalo':   ((0.105, 0.092, 0.078), 0.84, 1.30, 3.00),
    'suelo':    ((0.115, 0.102, 0.086), 0.88, 1.45, 2.20),
    'viga':     ((0.115, 0.086, 0.058), 0.72, 1.35, 2.30),
    'mensula':  ((0.185, 0.166, 0.140), 0.80, 1.20, 2.60),
    'laton':    ((0.72, 0.545, 0.245), 0.16, 0.35, 3.40),
    'laton-mate': ((0.52, 0.415, 0.225), 0.52, 0.70, 2.90),
    'papel':    ((0.82, 0.775, 0.665), 0.92, 0.55, 3.10),
    'papel-luz':((0.94, 0.885, 0.760), 0.90, 0.55, 3.10),
    'vidrio':   ((0.62, 0.680, 0.672), 0.10, 0.22, 5.00),
    'hierro':   ((0.135, 0.135, 0.140), 0.44, 0.95, 2.60),
    # Los obstáculos llevan material propio y sin despiece: con el aparejo del
    # muro encima, un contrafuerte se leía como una escalera de mano.
    'pilar':    ((0.130, 0.116, 0.098), 0.82, 1.55, 3.20),
}

FEATURES = {
    'muro': {'humedad', 'estratos'}, 'zocalo': {'humedad', 'estratos'},
    'suelo': {'humedad'}, 'viga': {'humedad'}, 'mensula': {'humedad'},
    'laton': set(), 'laton-mate': set(), 'papel': set(), 'papel-luz': set(),
    'vidrio': set(), 'hierro': {'humedad'},
}

# Despiece pequeño: con la hilada a 0,46 el muro competía en escala con los
# espejos, y un espejo tiene que ser un objeto de mano, no un sillar.
COURSING = {
    'muro': (0.62, 0.285, 0.5),
    'zocalo': (0.46, 0.24, 0.5),
    'suelo': (0.72, 0.72, 0.0),
}
FEATURES['pilar'] = {'humedad'}

# Luz de la sala: rasante, de tarde, entrando por la izquierda.
LUZ = np.array([-0.62, -0.34, 0.71])
LUZ /= np.linalg.norm(LUZ)


# ---------------------------------------------------------------- el puzle ---
# Todo ocurre en el plano x–z. Que el puzle sea plano no es una simplificación
# de dibujo: es lo que permite recorrerlo con el teclado por una rejilla, y lo
# que hace que el haz quede casi paralelo al plano de la imagen y se vea.

REJILLA_X = [1.55 + i * 1.42 for i in range(7)]
# Seis alturas, no cinco. Con cinco sólo había **una** ruta distinta hasta la
# pantalla del norte, y el encargo pide varias soluciones: sin una fila a la
# altura de las pantallas, la única manera de entrar era por abajo y por una
# sola columna. La fila de arriba abre la entrada lateral.
REJILLA_Z = [1.40 + j * 1.12 for j in range(5)] + [6.44]

# El postigo se alinea con una fila de la rejilla a propósito: así el primer
# tramo del haz corre por la misma altura que las ménsulas y la persona ve de
# entrada que la rejilla y la luz hablan el mismo idioma.
FUENTE = (0.02, 4.76)            # el postigo, en el muro de la izquierda
FUENTE_DIR = (1.0, 0.0)
LADO_ESPEJO = 0.86               # la hoja de latón, de tamaño de mano

# Obstáculos: contrafuertes de piedra y una reja colgada. Cortan el rayo.
OBSTACULOS = [
    ('contrafuerte', 4.30, 0.00, 0.62, 2.28),    # x, z, ancho, alto
    ('contrafuerte', 8.55, 0.00, 0.66, 2.60),
    # La reja tapa la bajada por la segunda columna: es la ruta corta que a
    # primera vista parece la buena, y por eso está ahí.
    ('reja',         2.28, 3.26, 1.58, 0.18),
]

# Pantallas de papel en hornacinas. Se encienden cuando les llega el haz.
# Pantallas colocadas donde una ruta puede llegar de verdad: la del norte,
# justo encima de una ménsula; la del sur, por encima del contrafuerte, que es
# lo que convierte el contrafuerte en un obstáculo con sentido y no en adorno.
PANTALLAS = [
    ('norte', 8.20, 6.20, 1.10, 0.90),           # x, z, ancho, alto
    ('sur',  10.18, 3.20, 0.82, 1.00),
]


def _libre(x, z):
    """¿Cabe un anclaje aquí? No, si hay pantalla u obstáculo ocupando el sitio.

    La rejilla es regular, pero el tablero no: donde hay una pantalla colgada o
    un contrafuerte, no hay collarín. Dicho de otro modo, el bastidor se monta
    en la sala y la sala ya estaba.
    """
    for _, x0, z0, w, h in PANTALLAS:
        if x0 - 0.18 <= x <= x0 + w + 0.18 and z0 - 0.18 <= z <= z0 + h + 0.18:
            return False
    for _, x0, z0, w, h in OBSTACULOS:
        if x0 - 0.18 <= x <= x0 + w + 0.18 and z0 - 0.18 <= z <= z0 + h + 0.18:
            return False
    return True


def anclajes():
    return [(x, z) for x in REJILLA_X for z in REJILLA_Z if _libre(x, z)]


def _refleja(d, ori):
    """Refleja una dirección en un espejo de 45°. `ori` es '/' o '\\'."""
    dx, dz = d
    return (dz, dx) if ori == '/' else (-dz, -dx)


def _corta_segmento(p, d, a, b):
    """Primer corte del rayo p+t·d con el segmento a→b. Devuelve t o None."""
    rx, rz = d
    sx, sz = b[0] - a[0], b[1] - a[1]
    den = rx * sz - rz * sx
    if abs(den) < 1e-9:
        return None
    qx, qz = a[0] - p[0], a[1] - p[1]
    t = (qx * sz - qz * sx) / den
    u = (qx * rz - qz * rx) / den
    if t > 1e-4 and -1e-6 <= u <= 1 + 1e-6:
        return t
    return None


def _corta_caja(p, d, x0, z0, w, h):
    """Primer corte del rayo con una caja alineada. Devuelve t o None."""
    ts = []
    for a, b in (((x0, z0), (x0 + w, z0)), ((x0 + w, z0), (x0 + w, z0 + h)),
                 ((x0 + w, z0 + h), (x0, z0 + h)), ((x0, z0 + h), (x0, z0))):
        t = _corta_segmento(p, d, a, b)
        if t is not None:
            ts.append(t)
    return min(ts) if ts else None


def _hoja(x, z, ori):
    """Los dos extremos de la hoja de un espejo puesto en (x, z)."""
    m = LADO_ESPEJO / 2
    k = m / math.sqrt(2.0)
    if ori == '/':
        return (x - k, z - k), (x + k, z + k)
    return (x - k, z + k), (x + k, z - k)


def trazar(espejos, divisores=(), max_rebotes=14):
    """Recorre el haz desde el postigo y devuelve sus tramos.

    Cada tramo es `(x0, z0, x1, z1, intensidad)`. Además devuelve un diccionario
    de las pantallas alcanzadas con la intensidad que les llega.

    No hay solución «correcta» guardada en ninguna parte: el juego no sabe qué
    ruta esperaba, sólo sabe dónde acaba la luz. Eso es lo que permite que haya
    varias soluciones sin tener que enumerarlas.
    """
    tramos = []
    encendidas = {}
    pila = [((FUENTE[0], FUENTE[1]), FUENTE_DIR, 1.0, 0)]
    while pila:
        p, d, inten, prof = pila.pop()
        if prof > max_rebotes or inten < 0.12:
            continue
        mejor_t, accion = None, None

        for (x, z), ori in espejos.items():
            a, b = _hoja(x, z, ori)
            t = _corta_segmento(p, d, a, b)
            if t is not None and (mejor_t is None or t < mejor_t):
                mejor_t, accion = t, ('espejo', ori)

        for (x, z), ori in dict(divisores).items():
            a, b = _hoja(x, z, ori)
            t = _corta_segmento(p, d, a, b)
            if t is not None and (mejor_t is None or t < mejor_t):
                mejor_t, accion = t, ('divisor', ori)

        for clase, x0, z0, w, h in OBSTACULOS:
            t = _corta_caja(p, d, x0, z0, w, h)
            if t is not None and (mejor_t is None or t < mejor_t):
                mejor_t, accion = t, ('corta', clase)

        for nombre, x0, z0, w, h in PANTALLAS:
            t = _corta_caja(p, d, x0, z0, w, h)
            if t is not None and (mejor_t is None or t < mejor_t):
                mejor_t, accion = t, ('pantalla', nombre)

        # paredes de la sala
        for a, b in (((0, 0), (AW, 0)), ((AW, 0), (AW, AH)),
                     ((AW, AH), (0, AH)), ((0, AH), (0, 0))):
            t = _corta_segmento(p, d, a, b)
            if t is not None and (mejor_t is None or t < mejor_t):
                mejor_t, accion = t, ('corta', 'pared')

        if mejor_t is None:
            continue
        q = (p[0] + d[0] * mejor_t, p[1] + d[1] * mejor_t)
        tramos.append((p[0], p[1], q[0], q[1], inten))
        tipo, dato = accion
        if tipo == 'espejo':
            pila.append((q, _refleja(d, dato), inten * 0.94, prof + 1))
        elif tipo == 'divisor':
            # mitad sigue recto, mitad gira: es lo que permite encender dos
            pila.append((q, d, inten * 0.48, prof + 1))
            pila.append((q, _refleja(d, dato), inten * 0.46, prof + 1))
        elif tipo == 'pantalla':
            # se guarda CUÁNTA luz llega, no sólo que llega: el divisor
            # reparte, y repartir tiene que verse
            encendidas[dato] = max(encendidas.get(dato, 0.0), inten)
    return tramos, encendidas


# --------------------------------------------------------------- geometría ---
# Todo lo que participa en el puzle vive a la profundidad del haz. El muro del
# fondo es contexto: da materia y bruma, y nada más. Esa separación es lo que
# permite leer de un vistazo qué cosas juegan y cuáles no.

Y_PLANO = 0.5 * (HAZ_Y0 + HAZ_Y1)     # profundidad del plano de juego


def muro_y_sala(buf):
    blit_quad(buf, [(0, Y_MURO, 0), (AW, Y_MURO, 0), (AW, Y_MURO, AH), (0, Y_MURO, AH)], 'muro')
    # zócalo corrido
    blit_quad(buf, [(0, Y_MURO - 0.16, 0), (AW, Y_MURO - 0.16, 0),
                    (AW, Y_MURO - 0.16, 1.15), (0, Y_MURO - 0.16, 1.15)], 'zocalo')
    blit_quad(buf, [(0, Y_MURO - 0.16, 1.15), (AW, Y_MURO - 0.16, 1.15),
                    (AW, Y_MURO, 1.15), (0, Y_MURO, 1.15)], 'zocalo', 1.18)
    # suelo
    blit_quad(buf, [(0, 0, 0), (AW, 0, 0), (AW, Y_MURO, 0), (0, Y_MURO, 0)], 'suelo')
    # vigas del techo
    for x0 in (0.9, 3.4, 5.9, 8.4):
        box(buf, x0, 0.30, AH - 0.62, 0.34, Y_MURO - 0.30, 0.44, 'viga')
    blit_quad(buf, [(0, 0.30, AH - 0.18), (AW, 0.30, AH - 0.18),
                    (AW, Y_MURO, AH - 0.18), (0, Y_MURO, AH - 0.18)], 'viga', 0.72)


def postigo(buf):
    """El postigo por donde entra la hoja de luz, en el muro de la izquierda."""
    z = FUENTE[1]
    blit_quad(buf, [(0.0, 0.30, z - 0.62), (0.0, Y_MURO, z - 0.62),
                    (0.0, Y_MURO, z + 0.62), (0.0, 0.30, z + 0.62)], 'muro', 0.55)
    # jambas y derrame
    for dz in (-0.52, 0.52):
        box(buf, 0.0, 0.42, z + dz - 0.06, 0.22, 1.30, 0.12, 'mensula')
    box(buf, 0.0, 0.42, z - 0.52, 0.22, 1.30, 0.06, 'mensula')
    # la contraventana, abierta
    blit_quad(buf, [(0.20, 0.42, z - 0.50), (0.86, 0.10, z - 0.50),
                    (0.86, 0.10, z + 0.50), (0.20, 0.42, z + 0.50)], 'viga', 0.9)


def bastidor(buf):
    """Varillas de hierro de suelo a techo: son las que fijan la rejilla.

    Sin ellas los espejos estarían flotando y la rejilla sería una convención
    invisible. Con ellas se ve por qué un espejo sólo puede ir donde puede ir.
    """
    for x in REJILLA_X:
        box(buf, x - 0.026, Y_PLANO - 0.026, 0.0, 0.052, 0.052, AH - 0.20, 'hierro')
    for x, z in anclajes():
        if True:
            # collarín del anclaje, siempre visible aunque no haya espejo
            box(buf, x - 0.058, Y_PLANO - 0.058, z - 0.045, 0.116, 0.116, 0.09,
                'laton-mate')


def espejo(buf, x, z, ori, mat='laton'):
    """Hoja de latón sobre su brazo, girada 45°."""
    (ax, az), (bx, bz) = _hoja(x, z, ori)
    g = 0.055
    nx, nz = (bz - az), -(bx - ax)
    n = math.hypot(nx, nz)
    nx, nz = nx / n * g, nz / n * g
    blit_quad(buf, [(ax, Y_PLANO - 0.24, az), (bx, Y_PLANO - 0.24, bz),
                    (bx, Y_PLANO + 0.24, bz), (ax, Y_PLANO + 0.24, az)], mat)
    blit_quad(buf, [(ax + nx, Y_PLANO - 0.24, az + nz), (bx + nx, Y_PLANO - 0.24, bz + nz),
                    (bx + nx, Y_PLANO + 0.24, bz + nz), (ax + nx, Y_PLANO + 0.24, az + nz)],
              'laton-mate', 0.72)
    # pinza sobre la varilla
    box(buf, x - 0.10, Y_PLANO - 0.10, z - 0.09, 0.20, 0.20, 0.18, 'laton-mate')


def obstaculos(buf):
    """Lo que corta el paso. Cortan el rayo de verdad, no de mentira."""
    for clase, x0, z0, w, h in OBSTACULOS:
        if clase == 'contrafuerte':
            blit_quad(buf, [(x0, Y_PLANO - 0.34, z0), (x0 + w, Y_PLANO - 0.34, z0),
                            (x0 + w, Y_PLANO - 0.34, z0 + h), (x0, Y_PLANO - 0.34, z0 + h)],
                      'pilar')
            blit_quad(buf, [(x0 + w, Y_PLANO - 0.34, z0), (x0 + w, Y_PLANO + 0.34, z0),
                            (x0 + w, Y_PLANO + 0.34, z0 + h), (x0 + w, Y_PLANO - 0.34, z0 + h)],
                      'pilar', 0.58)
            # imposta: le da remate y dice hasta dónde llega
            blit_quad(buf, [(x0 - 0.09, Y_PLANO - 0.42, z0 + h),
                            (x0 + w + 0.09, Y_PLANO - 0.42, z0 + h),
                            (x0 + w + 0.09, Y_PLANO + 0.42, z0 + h),
                            (x0 - 0.09, Y_PLANO + 0.42, z0 + h)], 'mensula', 1.05)
            blit_quad(buf, [(x0 - 0.09, Y_PLANO - 0.42, z0 + h - 0.13),
                            (x0 + w + 0.09, Y_PLANO - 0.42, z0 + h - 0.13),
                            (x0 + w + 0.09, Y_PLANO - 0.42, z0 + h),
                            (x0 - 0.09, Y_PLANO - 0.42, z0 + h)], 'mensula', 0.74)
        else:
            # reja colgada: barrotes verticales bajo un travesaño
            blit_quad(buf, [(x0, Y_PLANO - 0.06, z0), (x0 + w, Y_PLANO - 0.06, z0),
                            (x0 + w, Y_PLANO - 0.06, z0 + h), (x0, Y_PLANO - 0.06, z0 + h)],
                      'hierro')
            for i in range(9):
                bx = x0 + 0.07 + i * (w - 0.14) / 8.0
                blit_quad(buf, [(bx, Y_PLANO - 0.05, z0 - 0.58), (bx + 0.028, Y_PLANO - 0.05, z0 - 0.58),
                                (bx + 0.028, Y_PLANO - 0.05, z0), (bx, Y_PLANO - 0.05, z0)],
                          'hierro', 0.9)


DIBUJO_PANTALLA = {'norte': 'anillos', 'sur': 'espiga'}


def _dibujo(nombre, viva):
    """El dibujo impreso en el papel, en coordenadas de la propia pantalla.

    Cada pantalla lleva **una forma distinta**, y se ve tenue aunque esté
    apagada. Las dos cosas son deliberadas: la forma identifica la pantalla sin
    recurrir al color, y verla apagada permite saber cuál es cuál antes de
    encenderla. Al llegar la luz el dibujo no aparece: se afirma.
    """
    clase = DIBUJO_PANTALLA[nombre]
    fuerza = 0.62 if viva else 0.17

    def mod(u, v):
        a, b = u - 0.5, v - 0.5
        if clase == 'anillos':
            r = np.sqrt(a * a + b * b) * 2.6
            trama = 0.5 + 0.5 * np.cos(r * 11.0)
            trama = np.clip((trama - 0.45) * 3.2, 0, 1) * np.clip(1.25 - r, 0, 1)
        else:
            t = np.abs(np.mod(a * 9.0 + np.abs(b) * 5.5, 2.0) - 1.0)
            trama = np.clip((0.42 - t) * 3.4, 0, 1) * np.clip(1.0 - np.abs(b) * 2.1, 0, 1)
        return 1.0 - fuerza * trama

    return mod


def pantallas(buf, encendidas):
    """Pantallas de papel. Encendida revela su dibujo y levanta la banderola."""
    for nombre, x0, z0, w, h in PANTALLAS:
        inten = encendidas.get(nombre, 0.0)
        viva = inten > 0.02
        # El papel brilla según lo que le llega. Con dos estados —encendida o
        # apagada— el divisor no se notaría: las dos pantallas se verían igual
        # de encendidas que la única de antes, y el reparto de luz, que es lo
        # que enseña la lámina, desaparecería.
        brillo = 0.48 + 0.92 * inten
        blit_quad(buf, [(x0, Y_PLANO + 0.10, z0), (x0 + w, Y_PLANO + 0.10, z0),
                        (x0 + w, Y_PLANO + 0.10, z0 + h), (x0, Y_PLANO + 0.10, z0 + h)],
                  'papel-luz' if viva else 'papel', brillo if viva else 0.48,
                  modula=_dibujo(nombre, viva))
        # marco de madera
        for a, b, c, d in ((x0 - 0.07, z0 - 0.07, w + 0.14, 0.07),
                           (x0 - 0.07, z0 + h, w + 0.14, 0.07),
                           (x0 - 0.07, z0, 0.07, h), (x0 + w, z0, 0.07, h)):
            blit_quad(buf, [(a, Y_PLANO + 0.04, b), (a + c, Y_PLANO + 0.04, b),
                            (a + c, Y_PLANO + 0.04, b + d), (a, Y_PLANO + 0.04, b + d)],
                      'viga', 1.15)
        # banderola: en pie si llega la luz, caída si no
        fx = x0 + w + 0.12
        zc = z0 + h * 0.5
        if viva:
            blit_quad(buf, [(fx, Y_PLANO - 0.02, zc), (fx + 0.13, Y_PLANO - 0.02, zc),
                            (fx + 0.13, Y_PLANO - 0.02, zc + 0.62), (fx, Y_PLANO - 0.02, zc + 0.62)],
                      'laton', 1.35)
        else:
            blit_quad(buf, [(fx, Y_PLANO - 0.02, zc - 0.05), (fx + 0.46, Y_PLANO - 0.02, zc - 0.05),
                            (fx + 0.46, Y_PLANO - 0.02, zc + 0.04), (fx, Y_PLANO - 0.02, zc + 0.04)],
                      'laton-mate', 0.85)



# ------------------------------------------------------------- el haz de luz ---

def _dist_xz(px, pz, x0, z0, x1, z1):
    """Distancia al segmento y recorrido a lo largo de él, en el plano del puzle."""
    dx, dz = x1 - x0, z1 - z0
    L2 = dx * dx + dz * dz + 1e-9
    u = np.clip(((px - x0) * dx + (pz - z0) * dz) / L2, 0.0, 1.0)
    return np.hypot(px - (x0 + u * dx), pz - (z0 + u * dz)), u * math.sqrt(L2)


def haz(img, buf, tramos, ancho=0.20, pasos=26):
    """Pinta el haz como luz en el aire, integrando por el rayo de vista.

    Para cada píxel se recorre el trozo del rayo que va del punto de la escena
    hacia el observador y se suma cuánto de ese trozo cae dentro del haz. Así
    el haz queda **detrás de lo que tiene delante** sin tener que ordenarlo a
    mano, se hace más denso donde el rayo lo cruza en diagonal, y se corta solo
    donde hay algo por medio.

    Dibujarlo como una línea encima habría sido mucho más corto y habría
    convertido el camino en una anotación sobre la imagen. El camino no es una
    anotación: es el asunto.

    El tramo útil se acota antes de marchar. El haz ocupa una franja de
    profundidad conocida, así que el rayo sólo puede estar dentro entre dos
    valores de `t`; recorrer todo el fondo de la sala sería tirar el 80 % de
    las muestras.
    """
    v = e4.CAM.view
    px, py, pz = buf.world[..., 0], buf.world[..., 1], buf.world[..., 2]
    # el fondo no tiene mundo: se le da el del muro para que el haz lo cruce
    py = np.where(buf.mask, py, Y_MURO)
    pz = np.where(buf.mask, pz, pz)
    t_frente = np.clip(py / max(-v[1], 1e-6), 0.0, None)
    t_lo = np.clip((py - HAZ_Y1) / max(-v[1], 1e-6), 0.0, None)
    t_hi = np.clip((py - HAZ_Y0) / max(-v[1], 1e-6), 0.0, None)
    t_lo = np.minimum(t_lo, t_frente)
    t_hi = np.minimum(t_hi, t_frente)
    dt = np.clip(t_hi - t_lo, 0.0, None) / pasos

    acumulado = np.zeros(px.shape, np.float32)
    for x0, z0, x1, z1, inten in tramos:
        for i in range(pasos):
            t = t_lo + (i + 0.5) * dt
            zz = pz + t * v[2]
            d, rec = _dist_xz(px, zz, x0, z0, x1, z1)
            # El aire se come el haz: cuanto más lleva recorrido, menos queda.
            # Sin esto la barra tiene el mismo brillo a un metro del postigo y
            # a nueve, que es lo que la delata como raya pintada.
            extincion = np.exp(-0.085 * rec)
            # y se abre un poco, porque el postigo no es un punto
            w = ancho * (1.0 + 0.055 * rec)
            perfil = np.clip(1.0 - (d / w) ** 2, 0.0, 1.0) ** 1.5
            acumulado += perfil * dt * inten * extincion

    if acumulado.max() <= 0:
        return img
    # polvo: el aire no es homogéneo, y sin esto el haz es una barra pintada
    polvo = 0.72 + 0.56 * e4.sample_tex(px * 0.9, pz * 0.9) * e4.sample_grain(px * 3.1, pz * 3.1)
    acumulado = acumulado * polvo
    acumulado = gaussian_filter(acumulado, 1.2 * SS)
    color = np.array([1.00, 0.855, 0.615], np.float32)[None, None, :]
    return np.clip(img + color * (acumulado * 0.62)[..., None], 0, 1)


def resplandor(img, buf, tramos, encendidas):
    """Lo que el haz deja al chocar: un halo corto donde muere el tramo.

    No es decoración: es la señal de que la luz **llega** a ese sitio, y en las
    pantallas es lo que acompaña al cambio de dibujo y a la banderola. Tres
    señales distintas para el mismo estado, ninguna de ellas el color.
    """
    yy, xx = np.mgrid[0:img.shape[0], 0:img.shape[1]].astype(np.float32)
    halo = np.zeros(img.shape[:2], np.float32)
    for x0, z0, x1, z1, inten in tramos:
        sx, sy = e4.CAM.project((x1, Y_PLANO, z1))
        r = np.hypot(xx - sx, yy - sy) / (0.20 * e4.CAM.u)
        halo += np.clip(1.0 - r, 0, 1) ** 2.4 * inten
    color = np.array([1.00, 0.88, 0.66], np.float32)[None, None, :]
    # Corto y flojo. La primera versión tenía radio de medio metro y fuerza
    # 0,42: reventaba la pantalla a blanco justo donde el dibujo tenía que
    # verse, o sea que la señal de «ha llegado la luz» borraba la otra señal.
    return np.clip(img + color * (halo * 0.20)[..., None], 0, 1)


# --------------------------------------------------------------- encuadre ---

def configure(out_w, out_h, top=0.0, bot=0.0, margen=0.014, rise=0.17,
              ventana=None, z_rango=None):
    """Casi alzado: `rise` bajo a propósito.

    P02 mira el terrario desde 24° y eso le da el suelo. Aquí el suelo no
    importa y lo que importa es el aire, así que la cámara se endereza hasta
    casi el alzado puro. Es la misma clase de cámara con otro parámetro, y por
    eso el motor no cambia.
    """
    global OUT_W, OUT_H, TOP_OUT, BOT_OUT
    OUT_W, OUT_H = out_w, out_h
    TOP_OUT, BOT_OUT = top, bot
    W, H = out_w * SS, out_h * SS
    x0, x1 = ventana if ventana else (0.0, AW)
    u = W * (1 - 2 * margen) / (x1 - x0)
    ox = W * margen - x0 * u
    z_lo, z_hi = z_rango or (0.10, AH - 0.05)
    alto = (z_hi - z_lo) * u + AD * u * rise
    banda = top * SS
    oy = banda + (H - banda - bot * SS - alto) / 2 + z_hi * u + AD * u * rise
    e4.setup(e4.Frontal(u, ox, oy, depth_rise=rise), MATS, out_w, out_h, ss=SS,
             coursing=COURSING, features=FEATURES, top=top, bot=bot)


def backdrop(W, H):
    """El aire de la sala. Es obra."""
    bg = np.zeros((H, W, 3), np.float32)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    r = np.sqrt(((xx - W * 0.22) / (W * 0.95)) ** 2 + ((yy - H * 0.22) / (H * 1.05)) ** 2)
    bg += np.array([0.052, 0.046, 0.038])[None, None, :] * np.clip(1.20 - r, 0, 1)[..., None]
    bg += np.array([0.012, 0.011, 0.010])[None, None, :]
    return bg


def lighting(buf):
    """Luz de sala, baja, y el postigo como segunda fuente cálida."""
    return e4.shade(
        buf, LUZ,
        key=np.array([1.00, 0.875, 0.660], np.float32),
        sky=np.array([0.26, 0.28, 0.33], np.float32),
        bounce=np.array([0.26, 0.21, 0.15], np.float32),
        bounce_k=np.array([0.30, 0.24, 0.17], np.float32),
        fog=np.array([0.030, 0.027, 0.023], np.float32),
        spill=(np.array([0.2, 1.4, FUENTE[1]], np.float32),
               np.array([1.00, 0.86, 0.62], np.float32), 3.4, 0.85),
        # Ambiente algo más alto que en la primera vuelta: con 0,11 la sala
        # quedaba tan cerrada que la pantalla apagada y los espejos sin usar
        # desaparecían, y desaparecer no es lo mismo que estar apagado.
        fog_k=0.52, amb_k=0.185, key_k=0.42, spec_k=0.42, shadow_k=0.86)


# ----------------------------- capa vectorial de chrome sobre el raster ---
# El §5 de la norma permite composición híbrida: el raster lleva la materia y
# la luz; el vector, el texto y la interfaz.

def po(pt):
    x, y = e4.CAM.project(pt)
    return (x / SS, y / SS)


PIEZAS = (('Espejo', 'espejo'), ('Divisor', 'divisor'))
ACCIONES = (('Girar', 'R'), ('Retirar', 'Supr'), ('Deshacer', 'Ctrl+Z'))


def _glifo(cx, cy, r, clase, ink):
    if clase == 'espejo':
        return (f'<path d="M{cx-r:.1f} {cy+r:.1f} L{cx+r:.1f} {cy-r:.1f}" stroke="{ink}" '
                f'stroke-width="2.6" stroke-linecap="round"/>'
                f'<path d="M{cx-r*0.95:.1f} {cy+r*1.25:.1f} L{cx+r*1.05:.1f} {cy-r*0.75:.1f}" '
                f'stroke="{ink}" stroke-width="1.1" opacity="0.55" stroke-linecap="round"/>')
    return (f'<path d="M{cx-r:.1f} {cy+r:.1f} L{cx+r:.1f} {cy-r:.1f}" stroke="{ink}" '
            f'stroke-width="1.5" stroke-dasharray="3 2.4" stroke-linecap="round"/>'
            f'<path d="M{cx-r*1.15:.1f} {cy:.1f} h{r*1.1:.1f}" stroke="{ink}" stroke-width="1.6"/>'
            f'<path d="M{cx+r*0.05:.1f} {cy:.1f} h{r*1.1:.1f} M{cx+r*0.05:.1f} {cy:.1f} '
            f'v{r*1.15:.1f}" stroke="{ink}" stroke-width="1.6"/>')


def bandeja(x0, y0, lado, paso, sel=1, etiquetas=True, tam_etiqueta=9.5):
    """Las dos piezas que se pueden colocar. Nombre visible y `<title>` siempre.

    Dos piezas y no siete: el puzle no necesita inventario, necesita que se
    entienda qué hace cada una. Lo que sí hay que enseñar es que **todo tiene
    tecla**, y eso va al lado, en la leyenda.
    """
    o = []
    for i, (nombre, clase) in enumerate(PIEZAS):
        x = x0 + i * paso
        activo = i == sel
        o.append(f'<g role="img"><title>{nombre}{" · seleccionado" if activo else ""}</title>')
        o.append(f'<rect x="{x:.0f}" y="{y0:.0f}" width="{lado}" height="{lado}" rx="9" '
                 f'fill="{T("bg-surface-soft") if activo else T("bg-surface")}" '
                 f'stroke="{T("accent") if activo else T("border-control")}" '
                 f'stroke-width="{2 if activo else 1}"/>')
        o.append(_glifo(x + lado / 2, y0 + lado * (0.40 if etiquetas else 0.46),
                        lado * 0.21, clase, T('accent') if activo else T('text-muted')))
        if etiquetas:
            o.append(f'<text x="{x + lado/2:.0f}" y="{y0 + lado - 7:.0f}" '
                     f'font-family="Georgia, serif" font-size="{tam_etiqueta}" '
                     f'text-anchor="middle" '
                     f'fill="{T("accent") if activo else T("text-muted")}">{nombre}</text>')
        o.append('</g>')
    return ''.join(o)


def leyenda_teclado(x, y, paso=124, tam=13):
    """Cada acción con su tecla, a la vista.

    El encargo pide teclado completo. Decirlo en el CONCEPTO y no enseñarlo en
    la lámina deja la duda de si es un añadido posterior; enseñarlo aquí lo
    convierte en parte del producto.
    """
    o = []
    for i, (nombre, tecla) in enumerate(ACCIONES):
        cx = x + i * paso
        o.append(f'<rect x="{cx:.0f}" y="{y-13:.0f}" width="{max(30, 9*len(tecla)+14)}" '
                 f'height="19" rx="4" fill="none" stroke="{T("border-control")}" '
                 f'stroke-width="1"/>')
        o.append(f'<text x="{cx+7:.0f}" y="{y+1:.0f}" font-family="Georgia, serif" '
                 f'font-size="11.5" fill="{T("text-muted")}">{tecla}</text>')
        o.append(f'<text x="{cx + max(30, 9*len(tecla)+14) + 8:.0f}" y="{y+1:.0f}" '
                 f'font-family="Georgia, serif" font-size="{tam}" '
                 f'fill="{T("text-muted")}">{nombre}</text>')
    return ''.join(o)


def destino():
    """Anillo del anclaje y vertical de caída: la mecánica A → B."""
    ax, az = ANCLAJE_DIVISOR
    cx, cy = po((ax, Y_PLANO, az))
    px, py = po((ax, Y_PLANO, az + ALZADO_MANO))
    r = abs(po((ax + 0.42, Y_PLANO, az))[0] - cx)
    return (f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{r:.1f}" ry="{r*0.94:.1f}" fill="none" '
            f'stroke="{T("accent")}" stroke-width="2.4" stroke-dasharray="7 6"/>'
            f'<line x1="{px:.1f}" y1="{py:.1f}" x2="{cx:.1f}" y2="{cy:.1f}" '
            f'stroke="{T("accent")}" stroke-width="1.8" stroke-dasharray="4 6" opacity="0.9"/>')


def nombre_seleccionado(x, y, tam=19, anchor='start', nombre='Divisor'):
    return (f'<text x="{x:.0f}" y="{y:.0f}" font-family="Georgia, serif" font-size="{tam}" '
            f'fill="{T("accent")}" text-anchor="{anchor}">{nombre}</text>'
            f'<text x="{x:.0f}" y="{y + tam*0.98:.0f}" font-family="Georgia, serif" '
            f'font-size="{tam*0.66:.1f}" fill="{T("text-muted")}" '
            f'text-anchor="{anchor}">en la mano</text>')


def overlay_svg(uri):
    ax, az = ANCLAJE_DIVISOR
    px, py = po((ax, Y_PLANO, az + ALZADO_MANO + 0.62))
    o = [destino(), label_plate(px, py, 'DIVISOR', 17, 1.6),
         bandeja(44, OUT_H - 96, 62, 78),
         nombre_seleccionado(44 + 2 * 78 + 16, OUT_H - 66),
         leyenda_teclado(OUT_W - 430, OUT_H - 70)]
    return (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
            f'viewBox="0 0 {OUT_W} {OUT_H}" width="{OUT_W}" height="{OUT_H}" role="img" '
            f'aria-label="Rutas de luz. Render de concepto de Iris Green: una sala en penumbra '
            f'con una hoja de luz que entra por un postigo, gira en un espejo de latón y llega '
            f'a una pantalla de papel, que revela su dibujo y levanta su banderola.">'
            f'<image href="{uri}" xlink:href="{uri}" x="0" y="0" '
            f'width="{OUT_W}" height="{OUT_H}"/>'
            + chrome_bands() +
            f'<text x="44" y="58" font-family="Georgia, serif" font-size="33" fill="{T("text")}" '
            f'letter-spacing="0.3">Rutas de luz</text>'
            f'<text x="44" y="86" font-family="Georgia, serif" font-size="16" '
            f'fill="{T("text-muted")}">Una sola luz. Más de un camino para llevarla.</text>'
            + ''.join(o) +
            f'<text x="{OUT_W-44}" y="{OUT_H-20}" font-family="Georgia, serif" font-size="12.5" '
            f'fill="{T("text-muted")}" text-anchor="end" opacity="0.85">P03 · render first-party '
            f'· norma visual sep 2026</text>'
            f'</svg>')



VENTANA_CAUSALIDAD = (4.90, 11.05)
Z_CAUSALIDAD = (2.70, 7.55)

CADENA = (
    ('1', 'El divisor parte el haz', 'la mitad sigue recto y la mitad gira.'),
    ('2', 'Una mitad sube por el espejo de arriba', 'y llega a la pantalla del norte.'),
    ('3', 'La otra baja y gira', 'pasa por encima del contrafuerte y llega al sur.'),
    ('4', 'Las dos se encienden', 'con la mitad de luz cada una. La luz no se duplica.'),
)


def overlay_movil(uri):
    """Composición vertical propia, no la de escritorio encogida.

    En vertical no cabe la sala entera, y meterla entera la dejaría diminuta en
    el centro. Lo que cabe es el tramo donde pasa algo: el giro, la pantalla y
    el anclaje que se está usando.
    """
    ax, az = ANCLAJE_DIVISOR
    px, py = po((ax, Y_PLANO, az + ALZADO_MANO + 0.62))
    o = [destino(), label_plate(px, py, 'DIVISOR', 15, 1.4),
         bandeja(12, OUT_H - 122, 60, 70, etiquetas=True, tam_etiqueta=8.5),
         nombre_seleccionado(OUT_W - 14, OUT_H - 148, tam=17, anchor='end'),
         f'<text x="16" y="{OUT_H-142}" font-family="Georgia, serif" font-size="11.5" '
         f'fill="{T("text-muted")}" letter-spacing="1">QUÉ VAS A COLOCAR</text>',
         f'<text x="{OUT_W/2:.0f}" y="{OUT_H-26}" font-family="Georgia, serif" font-size="14" '
         f'fill="{T("text-muted")}" text-anchor="middle">Toca el anclaje · R gira · Supr retira</text>']
    return (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
            f'viewBox="0 0 {OUT_W} {OUT_H}" width="{OUT_W}" height="{OUT_H}" role="img" '
            f'aria-label="Rutas de luz en vertical. El giro del haz, la pantalla encendida y el '
            f'anclaje donde va la pieza que se tiene en la mano.">'
            f'<image href="{uri}" xlink:href="{uri}" x="0" y="0" '
            f'width="{OUT_W}" height="{OUT_H}"/>'
            + chrome_bands() +
            f'<text x="18" y="36" font-family="Georgia, serif" font-size="24" fill="{T("text")}">'
            f'Rutas de luz</text>'
            f'<text x="18" y="58" font-family="Georgia, serif" font-size="13" '
            f'fill="{T("text-muted")}">Una sola luz. Más de un camino para llevarla.</text>'
            + ''.join(o) + '</svg>')


def lamina_causalidad(panel, ancho=1180, alto=900):
    """Díptico del mismo encuadre, antes y después de poner el divisor.

    Como en P02, los dos paneles corren el mismo generador y lo único que
    cambia entre ellos es una pieza en la lista. La ruta, las pantallas que se
    encienden y **cuánta luz llega a cada una** salen del trazado, no de la
    mano.
    """
    pan_w = (ancho - 44 * 2 - 26) // 2
    pan_h = 470
    top, cad = 104, alto - 214
    izq, der = panel(False, pan_w, pan_h), panel(True, pan_w, pan_h)
    o = []
    for i, (uri, titulo) in enumerate(((izq, 'ANTES'), (der, 'DESPUÉS'))):
        x = 44 + i * (pan_w + 26)
        o.append(f'<image href="{uri}" xlink:href="{uri}" x="{x}" y="{top + 34}" '
                 f'width="{pan_w}" height="{pan_h}"/>')
        o.append(f'<rect x="{x}" y="{top + 34}" width="{pan_w}" height="{pan_h}" fill="none" '
                 f'stroke="{T("separator")}" stroke-width="1"/>')
        o.append(f'<text x="{x}" y="{top + 22}" font-family="Georgia, serif" font-size="12.5" '
                 f'fill="{T("text-muted")}" letter-spacing="1.4">{titulo}</text>')
    paso = (ancho - 88) / 4.0
    for i, (n, fuerte, resto) in enumerate(CADENA):
        x = 44 + i * paso
        o.append(f'<circle cx="{x + 13:.0f}" cy="{cad + 13}" r="13" fill="none" '
                 f'stroke="{T("accent")}" stroke-width="1.6"/>')
        o.append(f'<text x="{x + 13:.0f}" y="{cad + 18}" font-family="Georgia, serif" '
                 f'font-size="14" fill="{T("accent")}" text-anchor="middle">{n}</text>')
        o.append(f'<text x="{x:.0f}" y="{cad + 48}" font-family="Georgia, serif" font-size="14.5" '
                 f'fill="{T("text")}">{fuerte}</text>')
        o.append(f'<text x="{x:.0f}" y="{cad + 69}" font-family="Georgia, serif" font-size="13" '
                 f'fill="{T("text-muted")}">{resto}</text>')
        if i < 3:
            o.append(f'<path d="M{x + paso - 34:.0f} {cad + 13} h16 m-5 -5 l5 5 l-5 5" '
                     f'fill="none" stroke="{T("text-muted")}" stroke-width="1.6" '
                     f'stroke-linecap="round" stroke-linejoin="round"/>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
            f'viewBox="0 0 {ancho} {alto}" width="{ancho}" height="{alto}" role="img" '
            f'aria-label="Rutas de luz, segundo estado. La misma sala antes y después de poner '
            f'un divisor: con él, el haz se parte y las dos pantallas se encienden, cada una con '
            f'la mitad de luz.">'
            f'<rect x="0" y="0" width="{ancho}" height="{alto}" fill="{T("bg-page")}"/>'
            f'<text x="44" y="58" font-family="Georgia, serif" font-size="33" fill="{T("text")}" '
            f'letter-spacing="0.3">Una pieza, dos caminos</text>'
            f'<text x="44" y="86" font-family="Georgia, serif" font-size="16" '
            f'fill="{T("text-muted")}">Mismo encuadre, misma luz. Lo único que cambia entre las '
            f'dos es el divisor.</text>'
            + ''.join(o) +
            f'<text x="{ancho-44}" y="{alto-20}" font-family="Georgia, serif" font-size="12.5" '
            f'fill="{T("text-muted")}" text-anchor="end" opacity="0.85">P03 · segundo estado · '
            f'norma visual sep 2026</text>'
            f'</svg>')


# ------------------------------------------------------------------ escena ---

# Estado que enseña la lámina principal: una ruta resuelta, otra pantalla a
# oscuras, y el divisor en la mano sobre el anclaje donde va a ir.
ESPEJOS_BASE = {(REJILLA_X[5], REJILLA_Z[3]): '/',
                (REJILLA_X[3], REJILLA_Z[2]): '\\'}
ANCLAJE_DIVISOR = (REJILLA_X[3], REJILLA_Z[3])
ALZADO_MANO = 0.95


def build_scene(buf, espejos, divisores, encendidas, en_mano=True):
    muro_y_sala(buf)
    postigo(buf)
    obstaculos(buf)
    bastidor(buf)
    for (x, z), ori in espejos.items():
        espejo(buf, x, z, ori)
    for (x, z), ori in dict(divisores).items():
        espejo(buf, x, z, ori, 'vidrio')
    pantallas(buf, encendidas)
    if en_mano:
        x, z = ANCLAJE_DIVISOR
        espejo(buf, x, z + ALZADO_MANO, '\\', 'vidrio')
        # marco: una lámina de vidrio sola en penumbra no se ve, y la pieza que
        # se está colocando es justo la que tiene que verse
        (ax, az), (bx, bz) = _hoja(x, z + ALZADO_MANO, '\\')
        for dz in (-0.055, 0.055):
            blit_quad(buf, [(ax, Y_PLANO - 0.26, az + dz), (bx, Y_PLANO - 0.26, bz + dz),
                            (bx, Y_PLANO + 0.26, bz + dz), (ax, Y_PLANO + 0.26, az + dz)],
                      'laton', 1.25)


def render_escena(espejos, divisores, en_mano):
    tramos, encendidas = trazar(espejos, divisores)
    buf = e4.Buffers()
    build_scene(buf, espejos, divisores, encendidas, en_mano)
    img = e4.compose(lighting(buf), buf, backdrop, exposure=1.80,
                     vignette=(1.18, 0.62, 1.45), contraste=0.30, pivote=0.36)
    img = haz(img, buf, tramos)
    img = resplandor(img, buf, tramos, encendidas)
    return img, tramos, encendidas


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', type=Path, default=REPO / 'editorial/r62/p03-rutas-de-luz')
    ap.add_argument('--rapido', action='store_true')
    ap.add_argument('--solo', default=None)
    args = ap.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    global SS
    if args.rapido:
        SS = 1
    e4.set_textures(e4.fbm_tile(octaves=6, gain=0.55, lowest=22, seed=17),
                    e4.fbm_tile(octaves=6, gain=0.61, lowest=40, seed=53))

    import base64, io

    def escribe(nombre, img, overlay):
        im = Image.fromarray((img * 255 + 0.5).astype(np.uint8))
        im = im.resize((OUT_W, OUT_H), Image.LANCZOS)
        bio = io.BytesIO()
        # una sola codificación: el archivo suelto y el incrustado son los
        # mismos bytes, como en P02, para que rehacer el chrome no cambie nada
        im.save(bio, 'WEBP', quality=76, method=6)
        crudo = bio.getvalue()
        (args.out / f'{nombre}.webp').write_bytes(crudo)
        uri = 'data:image/webp;base64,' + base64.b64encode(crudo).decode('ascii')
        (args.out / f'{nombre}.svg').write_text(overlay(uri), encoding='utf-8')
        print(f'Escrito {args.out}/{nombre}.svg  ({OUT_W}x{OUT_H})')

    VENT_MOVIL, Z_MOVIL = (4.55, 9.45), (3.05, 7.45)
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
        configure(w, h, top, bot, ventana=vent, z_rango=zr)
        img, _, _ = render_escena(ESPEJOS_BASE, {}, True)
        escribe(nombre, img, ov)

    if args.solo and 'causalidad' not in args.solo:
        return

    def panel(con_divisor, w, h):
        configure(w, h, ventana=VENTANA_CAUSALIDAD, z_rango=Z_CAUSALIDAD)
        div = {ANCLAJE_DIVISOR: '\\'} if con_divisor else {}
        img, _, _ = render_escena(ESPEJOS_BASE, div, False)
        im = Image.fromarray((img * 255 + 0.5).astype(np.uint8)).resize((w, h), Image.LANCZOS)
        bio = io.BytesIO()
        im.save(bio, 'WEBP', quality=76, method=6)
        return 'data:image/webp;base64,' + base64.b64encode(bio.getvalue()).decode('ascii')

    for tema in ('navy', 'claro'):
        e4.set_theme(tema)
        svg = lamina_causalidad(panel)
        (args.out / f'causalidad-{tema}.svg').write_text(svg, encoding='utf-8')
        print(f'Escrito {args.out}/causalidad-{tema}.svg')


if __name__ == '__main__':
    main()
