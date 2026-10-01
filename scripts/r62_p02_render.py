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
    'roca':      ((0.104, 0.116, 0.092), 0.54, 1.40, 3.30),
    # Piedra recién puesta en una orilla húmeda: más oscura que la seca, porque
    # el agua le rellena el microrrelieve.
    #
    # La primera vez la hice además muy pulida, pensando en el brillo mojado, y
    # salió peor: un domo liso con un especular ancho es una mancha blanca. Y
    # medido, el problema no era el brillo sino el **color**: el difuso de la
    # roca valía lo mismo que el del sustrato, pero la roca era gris neutra en
    # un mundo verde y marrón, así que saltaba por saturación y no por
    # luminosidad. Lleva verde y tierra dentro, que es lo que la integra.
    'roca-humeda':((0.056, 0.066, 0.051), 0.58, 1.95, 4.40),
    # Musgo recién prendido: más claro y más ralo que el establecido. Da un
    # gradiente de densidad en vez de una mancha de sí/no.
    # Musgo recién prendido. Sube de tono respecto a la primera versión: medido,
    # salía más oscuro que el sustrato, así que la mancha nueva no se distinguía
    # del suelo en sombra —cambiaba el color y no la claridad, y a esa escala el
    # ojo lee antes la claridad—. El musgo joven de verdad es amarillo verdoso y
    # más claro que la hojarasca que tiene al lado.
    'musgo-joven':((0.168, 0.292, 0.124), 0.95, 2.70, 8.60),
    'pared':     ((0.062, 0.078, 0.074), 0.76, 1.25, 2.40),
    'madera':    ((0.40, 0.30, 0.195), 0.68, 1.35, 2.60),
    'musgo':     ((0.072, 0.135, 0.058), 0.96, 2.90, 7.80),
    'hoja':      ((0.085, 0.215, 0.098), 0.58, 0.85, 4.20),
    'hoja-clara':((0.155, 0.315, 0.120), 0.55, 0.80, 4.60),
    'hoja-honda':((0.026, 0.062, 0.035), 0.78, 0.95, 3.60),
    # Las familias nuevas llevan su propio verde, pero poco: lo que las
    # distingue a distancia tiene que ser la silueta. El tono sólo evita que
    # dos especies vecinas parezcan la misma mata cortada de otra manera.
    'hoja-cinta':((0.072, 0.190, 0.115), 0.60, 0.85, 4.80),
    'hoja-disco':((0.118, 0.248, 0.098), 0.52, 0.75, 3.90),
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
    'roca-humeda': {'humedad'},
    'musgo-joven': set(),
    'pared':    {'humedad', 'estratos'},
    'madera':   {'humedad'},
    'musgo':    set(),
    'hoja':     set(),
    'hoja-clara': set(),
    'hoja-honda': set(),
    'hoja-cinta': set(),
    'hoja-disco': set(),
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
# cosas se calculan a partir de la lista de rocas. La cadena causal no está
# dibujada: está computada.
#
# Sitio y tamaño elegidos por lo que hacen, no por dónde quedan bien. Antes
# estaba medio metida en el charco: su sombra caía sobre el agua, así que el
# primer eslabón —tapa la luz que llegaba a la ladera— no se veía, y sin ese
# eslabón la cadena empieza con un hueco. Ahora está en ladera abierta, con
# suelo seco por donde cae la sombra, y cerca del charco, que es lo que sostiene
# el tercer eslabón.
#
# Y es más grande. Con la luz a unos 38°, una roca de 0,60 proyecta apenas
# 0,75 de sombra: del tamaño de la propia roca, invisible como consecuencia. A
# 0,96 la sombra mide más de un metro y se lee. Probé 1,25 y era peor de
# otra manera: la roca pasaba a dominar el panel y tapaba lo que había
# antes, así que el «antes» dejaba de poder compararse con el «después».
ROCA_DEMO = (7.85, 1.45, 1.00, 0.68, 0.96)

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
    z_lo, z_hi = z_rango or ((1.62, 4.92) if ventana is None else (1.05, 3.35))
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
    """Tinte del sustrato: oscurece donde hay agua cerca y donde da sombra.

    Es el estado real del sistema hecho visible sin números: la celda junto al
    charco retiene humedad, y la tierra húmeda es más oscura y más fría que la
    seca. La sombra entra con la **misma** función que decide el musgo, así que
    la mancha oscura del suelo, la sombra que dibuja el render y el musgo que
    prende coinciden en el sitio. Cuando cada uno usaba su propia aproximación,
    la cadena se medía bien y no se veía.
    """
    seco = dist_agua(x, y)
    mojado = 1.0 - seco
    sombra = sombra_solar(x, y)
    # 0,58 y no 0,78: con la sombra geométrica la zona oscura es mucho más
    # marcada que con la elipse de antes, y a 0,78 se tragaba el musgo que
    # tiene que verse dentro.
    k = np.clip(mojado + 0.58 * sombra, 0, 1)[..., None]
    oscuro = np.array([0.44, 0.53, 0.56], np.float32)[None, None, :]
    humedo = (1.0 - k) + k * oscuro

    # Grumos y hojarasca. El grano fino del material solo daba una moqueta
    # uniforme, y una imperfección uniforme se lee como patrón, no como uso.
    grumo = e4.sample_tex(x * 0.85, y * 0.85)
    hojarasca = e4.sample_grain(x * 2.4 + 11.0, y * 2.4)
    v = (0.80 + 0.40 * grumo) * (0.90 + 0.22 * hojarasca)
    calido = np.stack([v * 1.04, v * 0.98, v * 0.90], -1)
    return humedo * calido


def _veteado_roca(x, y, z):
    """Veta y chorretones de la roca que se coloca.

    Medida, la roca salía casi dos veces más clara que el sustrato con **el
    mismo albedo**: la diferencia era sólo la luz, porque un domo convexo mira
    a la clave y casi no tiene oclusión, mientras que la tierra de alrededor
    está en sombra o de canto. Eso es correcto físicamente y aun así se leía
    como tiza, porque era una forma grande, clara y lisa.

    Lo que lo arregla no es bajar más el albedo —eso daría una piedra
    antinatural— sino romperle la superficie: banda mineral, y agua que
    escurre desde la cima y oscurece por donde cae. Una piedra con variación
    de tono dentro deja de leerse como una mancha.
    """
    cx, cy, _, _, h = ROCA_DEMO
    # bandas minerales, inclinadas respecto al eje del canto
    banda = 0.5 + 0.5 * np.sin((x - cx) * 5.1 + (y - cy) * 2.3 + z * 3.6)
    fino = e4.sample_tex(x * 3.1, y * 3.1)
    # chorretón: desde la cima hacia abajo, más oscuro donde el agua escurre
    alto = np.clip((z - terreno(np.array(x), np.array(y)) + h) / max(h, 1e-6), 0, 1)
    escurre = e4.sample_grain(x * 2.2 + 3.0, y * 0.45)
    mojado = np.clip(0.55 - alto, 0, 1) * (0.35 + 0.9 * escurre)
    # La cima más clara que la base, y no sólo por la luz: una piedra en una
    # orilla está mojada abajo y se va secando hacia arriba. Esto es lo que
    # separa la roca de su propia sombra —corona iluminada contra suelo
    # oscuro— y sin ello las dos se fundían en una sola mancha oscura y el
    # segundo eslabón de la cadena desaparecía.
    v = (0.70 + 0.58 * alto) * (0.84 + 0.30 * banda * fino) * (1.0 - 0.40 * mojado)
    return np.stack([v * 1.00, v * 1.04, v * 0.96], -1)


def _en_roca_demo(x, y):
    """Huella de la roca de demostración, con el mismo contorno roto."""
    cx, cy, rx, ry, _ = ROCA_DEMO
    k = _radio_roto(x, y, cx, cy)
    return ((x - cx) / (rx * k)) ** 2 + ((y - cy) / (ry * k)) ** 2 <= 1.0


def sustrato(buf):
    """El terreno, y las rocas que son parte de él.

    La roca de demostración se pinta con el material mojado, no con el seco.
    El R2 decía que salía blanquecina y robaba protagonismo, y tenía razón:
    una piedra recién puesta en una orilla húmeda está mojada, y mojada es más
    oscura. Lo que la sigue identificando como nueva es que el musgo todavía no
    la ha alcanzado.
    """
    demo = ROCA_DEMO in ROCAS
    blit_heightfield(buf, 'sustrato', terreno, 0, TW, 0, TD, steps=150,
                     tint=_humedad, alpha=lambda x, y, z: ~en_roca(x, y))
    blit_heightfield(buf, 'roca', terreno, 0, TW, 0, TD, steps=150,
                     alpha=lambda x, y, z: en_roca(x, y)
                                           & (~_en_roca_demo(x, y) if demo else True))
    if demo:
        blit_heightfield(buf, 'roca-humeda', terreno, 0, TW, 0, TD, steps=150,
                         alpha=lambda x, y, z: _en_roca_demo(x, y),
                         tint=_veteado_roca, bump_scale=1.8)


def _cantos(u, v, densidad, radio, semilla):
    """Cantos rodados en la sección: rejilla desplazada, con relieve fingido.

    Cada celda lleva un canto con su centro y su radio propios, sacados de un
    hash de la celda, así que el resultado es determinista y no se repite a
    ojo. El relieve no viene del motor —esto es una cara plana— sino de
    aclarar el cuarto superior izquierdo de cada canto y oscurecer el inferior
    derecho, que es de donde viene la luz de la escena. A este tamaño basta.
    """
    gx, gy = u * densidad, v * densidad * 0.62
    cx, cy = np.floor(gx), np.floor(gy)
    h1 = np.modf(np.sin(cx * 12.9898 + cy * 78.233 + semilla) * 43758.5453)[0]
    h2 = np.modf(np.sin(cx * 39.3468 + cy * 11.135 + semilla) * 24634.6345)[0]
    h3 = np.modf(np.sin(cx * 7.1234 + cy * 53.771 + semilla) * 15731.7431)[0]
    fx = gx - cx - 0.18 - 0.64 * h1
    fy = gy - cy - 0.18 - 0.64 * h2
    rr = radio * (0.55 + 0.75 * h3)
    d = np.sqrt((fx / rr) ** 2 + (fy / (rr * 0.82)) ** 2)
    dentro = np.clip(1.0 - d, 0, 1)
    # el cuarto que mira a la luz se aclara; el opuesto se hunde
    luz = np.clip(-(fx + fy) / (rr * 1.6), -1, 1)
    return 1.0 + dentro * (0.30 * luz + 0.16 * (h3 - 0.5))


def _raices(buf):
    """Raíces bajando desde el terreno por la cara del cristal.

    Salen de la planta que tienen encima, no de sitios al azar: se reparten
    alrededor de las posiciones plantadas que caen cerca del frente. Por eso
    hay más donde hay más planta, que es lo que uno ve en un terrario de
    verdad y lo que evita que esto sea ruido decorativo.
    """
    r = np.random.default_rng(613)
    # Pocas y agrupadas. La primera versión sacaba tres o cuatro por cada
    # planta cercana al frente y el resultado era una hilera de puntadas
    # verticales de lado a lado: un patrón, que es justo lo que el R2 llama
    # ruido gratuito. Con una de cada tres plantas y una o dos raíces por
    # planta, se leen como raíces sueltas que asoman.
    focos = [(x, alto) for x, y, alto in MATAS if y < 1.2][::3] + \
            [(x, alto * 0.7) for x, y, alto, _ in HELECHOS if y < 1.3][::2]
    for fx, fuerza in focos:
        for _ in range(1 + int(r.random() * 2)):
            x0 = fx + (r.random() - 0.5) * 1.15
            z0 = float(np.ravel(terreno(np.array([x0]), np.array([0.0])))[0]) - 0.02
            largo = (0.22 + 1.45 * r.random() ** 1.8) * (0.6 + fuerza)
            tramos = 6
            px, pz = x0, z0
            deriva = (r.random() - 0.5) * 1.35
            for t in range(tramos):
                dz = -largo / tramos
                dx = deriva * largo / tramos + (r.random() - 0.5) * 0.14
                g = 0.011 * (1.0 - 0.75 * t / tramos)
                blit_quad(buf, [(px - g, 0, pz), (px + dx - g, 0, pz + dz),
                                (px + dx + g, 0, pz + dz), (px + g, 0, pz)],
                          'madera', 0.26)
                px, pz = px + dx, pz + dz


def seccion_frontal(buf):
    """Las capas del sustrato, vistas en sección a través del cristal.

    Es lo que distingue un terrario de un decorado: se ve de qué está hecho.

    El R2 la señaló como la zona más floja, y tenía razón: cuatro bandas de
    tono plano con el canto superior siguiendo una curva suave se leen como lo
    que eran, un degradado por tramos. Lo que la arregla no es más ruido, es
    **estructura**:

      - los límites entre capas ondulan, porque un sustrato se asienta;
      - la capa de drenaje tiene cantos con su propio relieve;
      - la de arena, grano más fino y más claro;
      - bajan raíces desde las plantas que están cerca del frente;
      - y sigue el nivel freático, que ya estaba y no es adorno: bajo el charco
        el sustrato está saturado y se ve más oscuro.

    Además la franja ocupa menos: el encuadre sube y le quita altura, que es la
    otra salida que el R2 dejaba abierta.
    """
    def limite(z, amp, fase):
        """Un límite de capa que ondula en vez de ser una recta."""
        return lambda u: z + amp * (_ruido(np.array(u) * TW * 0.55 + fase,
                                           np.full_like(np.array(u), fase)) - 0.5)

    def freatico(u, v):
        x = u * TW
        z = v * TH
        moja = 1.0 - dist_agua(x, np.zeros_like(x))
        alto = np.clip(1.0 - (z - 0.25) / 1.35, 0.0, 1.0)
        veta = 0.86 + 0.28 * e4.sample_tex(x * 1.15, z * 2.1)
        # gradación de profundidad: lo más hondo recibe menos luz por el canto
        hondo = 0.78 + 0.22 * np.clip(z / 1.6, 0, 1)
        return veta * hondo * (1.0 - 0.46 * moja * alto)

    def capa(mat, z0f, z1f, oscuro=1.0, extra=None):
        def mod(u, v):
            base = freatico(u, v)
            return base if extra is None else base * extra(u, v)
        blit_quad(buf, [(0, 0, 0), (TW, 0, 0), (TW, 0, TH), (0, 0, TH)], mat, oscuro,
                  alpha=lambda u, v: (v * TH >= z0f(u))
                                     & (v * TH < np.minimum(z1f(u), terreno(u * TW, 0.0))),
                  modula=mod)

    suelo = lambda u: np.zeros_like(np.array(u, float))
    techo = lambda u: np.full_like(np.array(u, float), TH)
    l1 = limite(0.60, 0.16, 3.0)
    l2 = limite(0.94, 0.13, 8.5)
    l3 = limite(1.46, 0.19, 1.7)

    # Tras el cristal no entra luz directa: la sección va oscurecida.
    capa('grava', suelo, l1, 0.30,
         extra=lambda u, v: _cantos(u, v, 46.0, 0.52, 3.0))
    capa('arena', l1, l2, 0.28,
         extra=lambda u, v: _cantos(u, v, 128.0, 0.42, 17.0))
    capa('turba', l2, l3, 0.32)
    capa('sustrato', l3, techo, 0.38,
         extra=lambda u, v: _cantos(u, v, 34.0, 0.30, 41.0))
    _raices(buf)


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


def cinta(buf, x, y, alto, mat, mat_clara, hojas=9, seed=0, tono=1.0):
    """Planta de hoja acintada: hojas largas y estrechas que arquean y caen.

    Primera de las tres familias nuevas. Se distingue de la mata a distancia
    por la silueta —larga, fina, colgando— y no por el tono, que es lo que el
    R2 pide: con tamaño, tono y orientación el mundo seguía leyéndose como la
    misma planta repetida.

    La hoja no es recta: se dibuja por tramos y cada tramo cae un poco más,
    porque una cinta sostiene su propio peso hasta que deja de hacerlo.
    """
    r = np.random.default_rng(seed)
    z0 = float(np.ravel(terreno(np.array([float(x)]), np.array([float(y)])))[0])
    for i in range(hojas):
        ang = 2 * math.pi * i / hojas + 0.6 * r.random()
        largo = alto * (0.95 + 0.55 * r.random())
        tramos = 4
        px, py, pz = x, y, z0
        subida = 1.05 + 0.45 * r.random()
        for t in range(tramos):
            f = t / tramos
            # el arco: sube al principio y se vence al final
            dz = largo / tramos * (subida - 2.35 * f ** 1.6)
            dr = largo / tramos * (0.30 + 0.85 * f)
            eje = np.array([math.cos(ang) * dr, math.sin(ang) * dr * 0.5, dz])
            ancho = np.array([-math.sin(ang), math.cos(ang) * 0.55, 0.22])
            ancho = ancho / np.linalg.norm(ancho) * largo * (0.085 - 0.045 * f)
            m = mat_clara if i % 4 == 0 else mat
            hoja(buf, (px, py, pz), eje, ancho, m,
                 tono * (0.86 + 0.24 * r.random()), pliegue=0.45)
            px, py, pz = px + eje[0], py + eje[1], pz + eje[2]


def _perfil_disco(u, v):
    """Media hoja redonda: el ancho máximo está a media hoja, no en la punta."""
    return v <= np.sqrt(np.clip(1.0 - (2 * np.clip(u, 0, 1) - 1) ** 2, 0, 1))


def redonda(buf, x, y, alto, mat, mat_clara, hojas=8, seed=0, tono=1.0):
    """Planta de hoja redonda sobre peciolo: discos a distintas alturas.

    Segunda familia. Rompe la lectura de todo-lanceolado, y además da masas
    claras en medio del follaje fino, que es lo que hace que un grupo de
    plantas no parezca un solo arbusto.
    """
    r = np.random.default_rng(seed + 991)
    z0 = float(np.ravel(terreno(np.array([float(x)]), np.array([float(y)])))[0])
    for i in range(hojas):
        ang = 2 * math.pi * i / hojas + 0.5 * r.random()
        h = alto * (0.45 + 0.75 * r.random())
        rad = alto * (0.26 + 0.16 * r.random())
        cx = x + math.cos(ang) * alto * 0.30 * (0.5 + r.random())
        cy = y + math.sin(ang) * alto * 0.20 * (0.5 + r.random())
        # peciolo
        blit_quad(buf, [(x, y, z0), (cx, cy, z0 + h),
                        (cx + 0.022, cy, z0 + h), (x + 0.022, y, z0)], 'madera', 0.7)
        # el disco, casi horizontal y con una caída leve
        caida = 0.18 + 0.22 * r.random()
        e_ = np.array([math.cos(ang) * rad * 2, math.sin(ang) * rad * 1.1, -caida * rad])
        a_ = np.array([-math.sin(ang) * rad * 2, math.cos(ang) * rad * 1.9, 0.0])
        m = mat_clara if i % 3 == 0 else mat
        b = np.array([cx, cy, z0 + h]) - e_ / 2
        alza = np.cross(e_, a_)
        n = np.linalg.norm(alza)
        alza = alza / n * np.linalg.norm(a_) * 0.16 if n > 1e-9 else a_ * 0.0
        for lado in (-1, 1):
            d = a_ / 2 * lado + alza
            blit_quad(buf, [b, b + e_, b + e_ + d, b + d], m,
                      tono * (0.88 + 0.22 * r.random()),
                      alpha=_perfil_disco, modula=_dibujo_hoja)


def cojin(buf, x, y, ancho_, mat, mat_clara, hojas=46, seed=0, tono=1.0):
    """Cojín tapizante: muchas hojas diminutas formando un montículo bajo.

    Tercera familia. No tiene estructura visible, y esa es su gracia: al lado
    de una fronda o de una cinta da una masa compacta que descansa la vista y
    marca el suelo como ocupado.
    """
    r = np.random.default_rng(seed + 4423)
    for i in range(hojas):
        a = 2 * math.pi * r.random()
        rr = ancho_ * math.sqrt(r.random())
        px, py = x + math.cos(a) * rr, y + math.sin(a) * rr * 0.62
        pz = float(np.ravel(terreno(np.array([px]), np.array([py])))[0])
        alto_h = ancho_ * (0.22 + 0.26 * r.random()) * (1.0 - 0.55 * rr / ancho_)
        ang = 2 * math.pi * r.random()
        eje = np.array([math.cos(ang) * alto_h * 0.55, math.sin(ang) * alto_h * 0.35,
                        alto_h])
        anc = np.array([-math.sin(ang), math.cos(ang) * 0.6, 0.35])
        anc = anc / np.linalg.norm(anc) * alto_h * 0.52
        m = mat_clara if i % 4 == 0 else mat
        hoja(buf, (px, py, pz), eje, anc, m, tono * (0.80 + 0.30 * r.random()))


def _rama(buf, p0, dir0, largo, grueso, mat, mat_clara, r, nivel=0, tono=1.0):
    """Un tallo que cae, se curva, engorda desigual y echa hojas y ramas.

    Recursiva hasta dos niveles. Lo que el R2 señalaba —«cuerdas verdes contra
    la pared»— venía de tres cosas a la vez: una sola vertical sin ramificar,
    grosor constante y todo a la misma profundidad. Aquí el tallo avanza por
    tramos con la dirección girando poco a poco, el grueso cae con el recorrido,
    las hojas salen alternas a lado y lado, y cada rama hija arranca con su
    propia desviación en profundidad, así que unas pasan por delante de otras.
    """
    tramos = 9 if nivel == 0 else 6
    pos = np.array(p0, float)
    d = np.array(dir0, float)
    d /= np.linalg.norm(d)
    paso = largo / tramos
    for i in range(tramos):
        f = i / tramos
        # la dirección gira: la gravedad tira, y el tallo serpentea
        # el arco: deriva lateral fuerte al principio y caída al final, para
        # que el tallo describa una curva y no una vertical con temblor
        d = d + np.array([(r.random() - 0.5) * 0.52 + 0.16 * math.sin(f * 3.1 + nivel),
                          (r.random() - 0.5) * 0.44,
                          -0.10 - 0.34 * f])
        d /= np.linalg.norm(d)
        sig = pos + d * paso
        g0 = grueso * (1.0 - 0.55 * f) * (0.85 + 0.3 * r.random())
        g1 = grueso * (1.0 - 0.55 * (f + 1 / tramos))
        # Dos caras y no una: una cinta plana de una sola cara se lee como un
        # listón visto de frente, que es en lo que se me convirtieron los
        # tallos al engordarlos. Y el tallo va oscuro: es tallo tierno a la
        # sombra, no una estaca de madera clara contra la pared.
        blit_quad(buf, [pos - (g0, 0, 0), sig - (g1, 0, 0),
                        sig + (g1, 0, 0), pos + (g0, 0, 0)], 'madera', 0.30 * tono)
        blit_quad(buf, [pos - (0, g0, 0), sig - (0, g1, 0),
                        sig + (0, g1, 0), pos + (0, g0, 0)], 'madera', 0.22 * tono)
        # hojas alternas
        for lado in (-1, 1):
            if r.random() > (0.96 if nivel == 0 else 0.88):
                continue
            lh = largo * (0.135 + 0.095 * r.random()) * (1.0 - 0.25 * f)
            ang = math.atan2(d[1], d[0]) + lado * (1.15 + 0.5 * r.random())
            eje = np.array([math.cos(ang) * lh, math.sin(ang) * lh * 0.55,
                            -lh * (0.25 + 0.45 * r.random())])
            anc = np.array([-math.sin(ang) * 0.8, 0.55, 0.28])
            anc = anc / np.linalg.norm(anc) * lh * 0.70
            m = mat_clara if r.random() < 0.28 else mat
            hoja(buf, tuple(sig), eje, anc, m, tono * (0.82 + 0.28 * r.random()))
        # ramas hijas, con su propia desviación en profundidad
        if nivel == 0 and 1 <= i <= tramos - 2 and r.random() < 0.72:
            desv = np.array([(r.random() - 0.5) * 1.5,
                             (r.random() - 0.5) * 1.9,     # cruza planos
                             -0.35 - 0.4 * r.random()])
            _rama(buf, tuple(sig), d + desv, largo * (0.42 + 0.22 * r.random()),
                  grueso * 0.62, mat, mat_clara, r, nivel + 1, tono)
        pos = sig


def colgante(buf, x, y, z, largo, mat, mat_clara, seed=0, tono=1.0):
    """Vegetación que cuelga del borde superior del tanque."""
    r = np.random.default_rng(seed + 77)
    _rama(buf, (x, y, z), (0.18 * (r.random() - 0.5), 0.12 * (r.random() - 0.5), -1.0),
          largo, 0.017, mat, mat_clara, r, 0, tono)


def tapiz(buf):
    """Tapiz bajo sobre el sustrato: hojarasca y brotes.

    Sin esto la tierra es un campo continuo, y un campo continuo de un solo
    material es exactamente lo que la tercera pregunta de la referencia E4
    señala. En un terrario plantado el suelo casi nunca se ve limpio.
    """
    def donde(x, y, z):
        n1 = e4.sample_tex(x * 0.95 + 3.0, y * 0.95)
        n2 = e4.sample_grain(x * 2.6, y * 2.6 + 7.0)
        return (n1 * 0.78 + n2 * 0.50 > 0.50) & (~hay_agua(x, y))

    blit_heightfield(buf, 'hoja-honda', lambda x, y: terreno(x, y) + 0.012,
                     0, TW, 0, TD, steps=130, alpha=donde, bump_scale=2.2,
                     tint=0.85)


def sombra_solar(x, y, pasos=22, alcance=2.6):
    """Cuánta luz directa pierde el punto (x, y) del terreno, de 0 a 1.

    Se marcha desde la superficie hacia la luz y se mira si el terreno se
    interpone. Como las rocas están sumadas a la función de altura, una roca
    tapa la luz sin que haya que tratarla aparte: es el mismo cálculo que hace
    que una loma se dé sombra a sí misma.

    **Por qué importa que sea esto y no una elipse.** Antes la sombra que
    decidía el musgo era un óvalo dibujado a mano junto a cada roca, con su
    desplazamiento a ojo. Funcionaba como número —el musgo cambiaba— y fallaba
    como imagen: la mancha de musgo no tenía nada que ver con la sombra que el
    render dibujaba, así que la persona veía dos cosas sueltas en vez de una
    consecuencia. Calculada contra el mismo terreno y la misma luz, **la mancha
    de musgo tiene la forma de la sombra**, y esa coincidencia es lo que hace
    legible la cadena sin explicarla.

    El resultado se suaviza con la distancia al ocluyente: la penumbra se abre,
    igual que en la sombra del render, así que el borde del musgo tampoco es un
    recorte duro.
    """
    z = terreno(x, y)
    dentro = np.zeros(np.shape(x), np.float32)
    for i in range(1, pasos + 1):
        t = alcance * (i / pasos) ** 1.35
        px = x + LUZ[0] * t
        py = y + LUZ[1] * t
        pz = z + LUZ[2] * t
        tapado = pz < terreno(px, np.clip(py, 0.0, None))
        # cuanto más cerca está el ocluyente, más cerrada es la sombra
        dentro = np.maximum(dentro, tapado * (1.0 - 0.55 * (i - 1) / pasos))
    return dentro


def _favorable(x, y):
    """Cuánto le conviene el sitio al musgo: sombra y humedad, de 0 a 1.

    Es el campo que el concepto describe, y se usa dos veces: para decidir
    dónde prende el musgo y con qué densidad. Sacarlo a una función es lo que
    permite que las dos láminas —la de gameplay y la de causalidad— hablen del
    mismo cálculo y no de dos aproximaciones parecidas.
    """
    humedo = 1.0 - dist_agua(x, y)
    sombra = sombra_solar(x, y)
    moteado = e4.sample_grain(x * 1.7, y * 1.7)
    return humedo * 0.58 + sombra * 1.32 + moteado * 0.28


def musgo_parches(buf):
    """El musgo prende donde hay sombra y humedad, y prende más donde más hay.

    Dos capas y no una. La de abajo es el musgo establecido, con su umbral; la
    de arriba es musgo joven, más claro y con un umbral más alto, así que sólo
    sale en el corazón de la zona favorable. El resultado es un gradiente de
    densidad, que es lo que hace que un cambio en el microentorno se vea a
    simple vista: con una sola capa el musgo estaba o no estaba, y el ojo sólo
    registraba el contorno.
    """
    def prende(umbral):
        return lambda x, y, z: (_favorable(x, y) > umbral) & (~hay_agua(x, y))

    blit_heightfield(buf, 'musgo', lambda x, y: terreno(x, y) + 0.030,
                     0, TW, 0, TD, steps=130, alpha=prende(0.80), bump_scale=1.7)
    blit_heightfield(buf, 'musgo-joven', lambda x, y: terreno(x, y) + 0.042,
                     0, TW, 0, TD, steps=130, alpha=prende(1.04), bump_scale=2.1)


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

# (x, cota de arranque, largo, profundidad). La profundidad va repartida a
# propósito: una colgando a 0,55 pasa por delante de las plantas del suelo, y
# es lo que quita la lectura de cuerdas pegadas al fondo.
COLGANTES = ((1.75, 5.20, 1.75, 2.35), (4.55, 5.35, 1.45, 0.62),
             (7.05, 5.25, 1.95, 1.85), (9.10, 5.10, 1.50, 0.95),
             (0.60, 5.05, 2.05, 1.25), (3.15, 5.30, 1.25, 3.05),
             (5.85, 5.15, 1.65, 2.60), (8.20, 5.35, 1.35, 0.55),
             (2.45, 5.28, 1.55, 1.55), (6.35, 5.32, 1.20, 3.35))

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


MOSTRAR_EN_VUELO = True


def familia(x, y):
    """Qué especie va en un punto. Por manchas, no alternando.

    El R2 avisa de que el mundo se leía como «estrella + helecho + estrella +
    helecho». Repartir las familias por turnos no lo arregla: lo cambia por
    otro patrón. Lo que hace que un plantado parezca natural es que las
    especies salgan **agrupadas**, porque en un sitio prende una y al lado otra.
    Así que la familia la decide un ruido de baja frecuencia sobre el terreno:
    vecinos comparten especie y los límites entre manchas son irregulares.
    """
    n = float(np.ravel(_ruido(np.array([x * 0.34]), np.array([y * 0.34])))[0])
    m = float(np.ravel(_ruido(np.array([x * 0.71 + 5.0]), np.array([y * 0.71])))[0])
    if n < 0.44:
        return 'cojin' if m < 0.46 else 'mata'
    if n < 0.58:
        return 'redonda' if m > 0.38 else 'mata'
    return 'cinta' if m > 0.36 else 'redonda'


def vegetacion(buf):
    madera(buf, 2.95, 0.95, 4.05, 2.15, 2.95, 0.115)
    madera(buf, 8.05, 0.70, 7.15, 1.55, 1.85, 0.085)
    demo = ROCA_DEMO in ROCAS
    def libre(x, y):
        # no se planta dentro del charco ni debajo de la roca que se coloca
        return _en_seco(x, y) and not (demo and bool(np.ravel(
            _en_roca_demo(np.array([float(x)]), np.array([float(y)])))[0]))

    for x, y, alto, giro in HELECHOS:
        if not libre(x, y):
            continue
        helecho(buf, x, y, alto, giro, 'hoja', 'hoja-clara')
    for i, (x, y, alto) in enumerate(MATAS):
        if not libre(x, y):
            continue
        # tono por planta, además de la familia: dos ejemplares de la misma
        # especie tampoco son idénticos
        tono = 0.78 + 0.46 * ((i * 37 % 19) / 19.0)
        f = familia(x, y)
        if f == 'cinta':
            cinta(buf, x, y, alto * 1.15, 'hoja-cinta', 'hoja-clara', seed=7 + i, tono=tono)
        elif f == 'redonda':
            redonda(buf, x, y, alto * 1.05, 'hoja-disco', 'hoja-clara', seed=7 + i, tono=tono)
        elif f == 'cojin':
            cojin(buf, x, y, alto * 0.95, 'hoja', 'hoja-clara', seed=7 + i, tono=tono)
        else:
            mata(buf, x, y, alto, 'hoja', 'hoja-clara', seed=7 + i, tono=tono)
    for i, (x, z, largo, prof) in enumerate(COLGANTES):
        colgante(buf, x, prof, z, largo, 'hoja-disco' if i % 3 == 0 else 'hoja',
                 'hoja-clara', seed=3 + i, tono=0.86 + 0.24 * ((i * 29 % 11) / 11.0))
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
        translucent=([e4.MAT_IDS[m] for m in ('hoja', 'hoja-clara', 'hoja-honda',
                                              'hoja-cinta', 'hoja-disco')],
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


def bandeja(x0, y0, lado, paso, sel=4, etiquetas=True, tam_etiqueta=9.5):
    """Bandeja de elementos. Objetivos de `lado` px, nunca menos de 44.

    El §10 del concepto lo fija: el arrastre no puede ser la única vía, así que
    esto es una lista de opciones que se recorre y se activa, y el terrario es
    el segundo paso. Lo seleccionado se marca con acento y con marco, no sólo
    con color.

    **El nombre va en tres sitios, y por tres motivos distintos.** El R2 avisó
    de que a 390 px los elementos se identificaban sólo por un glifo abstracto,
    y un glifo abstracto no es un nombre: obliga a aprenderse siete dibujos
    antes de poder jugar.

      1. Etiqueta breve dentro de la casilla, mientras quepa a un tamaño que se
         lea. Es lo que resuelve el caso normal.
      2. `<title>` en cada casilla, siempre, quepa o no la etiqueta. Es el
         nombre accesible, y no depende de que haya sitio en pantalla.
      3. El nombre del seleccionado, grande y fuera de la bandeja, que lo pone
         `nombre_seleccionado()`. Es lo que contesta «¿qué estoy colocando?»
         sin tener que localizar cuál de las siete casillas está marcada.
    """
    o = []
    for i, (nombre, clase) in enumerate(BANDEJA):
        x = x0 + i * paso
        activo = i == sel
        o.append(f'<g role="img"><title>{nombre}'
                 f'{" · seleccionado" if activo else ""}</title>')
        o.append(f'<rect x="{x:.0f}" y="{y0:.0f}" width="{lado}" height="{lado}" rx="9" '
                 f'fill="{T("bg-surface-soft") if activo else T("bg-surface")}" '
                 f'stroke="{T("accent") if activo else T("border-control")}" '
                 f'stroke-width="{2 if activo else 1}"/>')
        cy = y0 + lado * (0.40 if etiquetas else 0.44)
        o.append(_icono(x + lado / 2, cy, lado * (0.21 if etiquetas else 0.24), clase,
                        T('accent') if activo else T('text-muted')))
        if etiquetas:
            o.append(f'<text x="{x + lado / 2:.0f}" y="{y0 + lado - 7:.0f}" '
                     f'font-family="Georgia, serif" font-size="{tam_etiqueta}" '
                     f'text-anchor="middle" '
                     f'fill="{T("accent") if activo else T("text-muted")}">{nombre}</text>')
        o.append('</g>')
    return ''.join(o)


def nombre_seleccionado(x, y, sel=4, tam=17, anchor='start'):
    """El nombre del elemento cogido, fuera de la bandeja y permanente."""
    nombre = BANDEJA[sel][0]
    return (f'<text x="{x:.0f}" y="{y:.0f}" font-family="Georgia, serif" '
            f'font-size="{tam}" fill="{T("accent")}" text-anchor="{anchor}">{nombre}</text>'
            f'<text x="{x:.0f}" y="{y + tam * 0.98:.0f}" font-family="Georgia, serif" '
            f'font-size="{tam * 0.66:.1f}" fill="{T("text-muted")}" '
            f'text-anchor="{anchor}">en la mano</text>')


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
    # a la derecha de la bandeja y con aire: pegado al borde de la última
    # casilla el nombre se comía el rótulo de «Refugio»
    o.append(nombre_seleccionado(44 + 6 * 78 + 62 + 26, OUT_H - 66, tam=19))
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
    o.append(bandeja(9, OUT_H - 122, 60, 58, etiquetas=True, tam_etiqueta=8.5))
    o.append(f'<text x="14" y="{OUT_H-142}" font-family="Georgia, serif" '
             f'font-size="11.5" fill="{T("text-muted")}" letter-spacing="1">'
             f'QUÉ VAS A COLOCAR</text>')
    o.append(nombre_seleccionado(OUT_W - 14, OUT_H - 148, tam=17, anchor='end'))
    o.append(f'<text x="{OUT_W/2:.0f}" y="{OUT_H-26}" font-family="Georgia, serif" '
             f'font-size="14" fill="{T("text-muted")}" text-anchor="middle">'
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

# El díptico se ciñe a donde pasa el cambio. Con el encuadre ancho los dos
# paneles estaban dominados por lo que no cambia —las colgantes, el helecho
# grande, el charco— y la diferencia quedaba en una esquina.
VENTANA_CAUSALIDAD = (6.15, 9.95)
Z_CAUSALIDAD = (1.50, 3.60)

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
        # El .webp de disco y el incrustado en el SVG son **los mismos bytes**.
        # Antes el suelto iba a 92 y el incrustado a 76, y entonces rehacer
        # sólo la capa vectorial desde el .webp metía una generación más de
        # compresión: la lámina salía parecida pero no idéntica, y eso rompe
        # que la entrega sea reproducible. Una sola codificación y se acabó.
        #
        # 76 y no 90: P02 tiene mucho más detalle de alta frecuencia que P01
        # —follaje, grano, musgo— y a 90 la lámina de escritorio se iba a
        # 638 KB. Comparadas a 1440 no se distingue cuál es cuál.
        bio = io.BytesIO()
        im.save(bio, 'WEBP', quality=76, method=6)
        crudo = bio.getvalue()
        (args.out / f'{nombre}.webp').write_bytes(crudo)
        uri = 'data:image/webp;base64,' + base64.b64encode(crudo).decode('ascii')
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
        configure(w, h, ventana=VENTANA_CAUSALIDAD, z_rango=Z_CAUSALIDAD)
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
