#!/usr/bin/env python3
"""R62 · P04 · Ritmo de colores · concepto visual y mecánica.

`R62_P04_RITMO_CONCEPT_READY_FOR_ASTRA_AURA_MARIA`. Sobre el motor
`ig_render_e4.py`, que queda como está: P04 no lo toca.

## Qué es

Una caja de música de taller. Un barrilete de madera gira despacio sobre su
eje. Encima se colocan piedras. Delante hay un peine de láminas de latón de
distinta longitud, y cuando una piedra alcanza su lámina, la lámina suena.

La persona coloca, escucha, mueve una piedra, vuelve a escuchar. El barrilete
no se para nunca y no pide nada: la vuelta es siempre la misma y lo único que
cambia es lo que hay puesto encima.

## La regla que ordena todo lo demás

**El sonido es un choque que se ve.** No hay una pista de audio disparada por
un temporizador: hay una piedra que llega a una lámina. Dónde está la piedra
a lo largo del barrilete dice *qué* lámina —y por tanto qué nota, porque la
lámina larga suena grave y la corta aguda—, y en qué ángulo del barrilete está
dice *cuándo*. Las dos cosas se leen mirando el objeto, sin números y sin
rejilla.

De ahí salen solas las cosas que pide el encargo:

  - **superponer**: dos piedras en el mismo ángulo y distinta lámina llegan a
    la vez, y eso es un acorde, no una puntuación;
  - **repetir**: el barrilete da la vuelta, y la vuelta es el compás;
  - **descubrir**: mover una piedra un dedo cambia el sitio del golpe dentro
    de la vuelta, y eso se oye antes de entenderse;
  - **el color no es el único canal**: la nota está en la longitud de la
    lámina, la familia de la piedra está en su forma —canto, cuña, varilla— y
    el color acompaña, no informa solo.

## Lo que no es

No es un examen de ritmo, no puntúa, no hay nota correcta y no hay prisa. El
barrilete gira a una vuelta cada doce segundos.

Uso:  python3 scripts/r62_p04_render.py
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

SS = 2
OUT_W, OUT_H = 1180, 900
TOP_OUT = BOT_OUT = 0.0

# --- el taller, en unidades de mundo (metros) ------------------------------
TW, TD = 3.40, 1.40              # ancho y fondo de la mesa
Y_MURO = 1.34                    # el muro del fondo, cerca: la sombra cuenta
Z_MESA = 0.92                    # altura del tablero

EJE_Y, EJE_Z = 0.62, 1.58        # eje del barrilete
RADIO = 0.255
BX0, BX1 = 0.52, 2.86            # el barrilete, a lo largo de x

# El peine: nueve láminas, de larga a corta. La longitud ES el tono, y por eso
# se ve. La más larga suena grave.
LAMINAS = 9
LAM_X0, LAM_PASO = 0.62, 0.262
# Los largos de las barras. Van EN VERTICAL: colgadas, no tumbadas. Tumbadas
# —dos intentos— la longitud se proyectaba con el escorzo de profundidad y
# nueve barras de 2,6 a 1 de proporción se veían todas iguales. Colgando, la
# longitud es alto en pantalla y la nota se lee de un vistazo.
LAM_LARGO = [0.620, 0.575, 0.532, 0.492, 0.455, 0.420, 0.388, 0.358, 0.330]
LAM_ANCHO = 0.088
Y_BARRAS = 0.34                  # el plano donde cuelgan
Z_COLGADO = 1.60                 # de dónde cuelgan
# El peine se ancla DELANTE y sus puntas van hacia dentro, a morir justo en la
# cara delantera-baja del barrilete. Dos intentos anteriores fallaron por
# geometría: de pie delante, las láminas tapaban el golpe; tumbado por detrás,
# el barrilete tapaba el peine entero. El golpe ocurre en el cuadrante de
# delante y abajo, que es el único sitio donde se ve la piedra tocar la lámina.
# El golpe ocurre cerca del punto más adelantado del barrilete, un poco por
# debajo del eje: ahí la cara mira de frente y el choque se ve entero. Con el
# contacto abajo del todo —a −60°, que fue un intento— caía en la silueta, y
# el cilindro se tapa a sí mismo ahí.
ANG_CONTACTO = -19.4

# Las piedras puestas ahora mismo: (lámina, ángulo en grados, familia).
# El barrilete gira de ángulo alto a ángulo bajo, así que **lo que aún no ha
# sonado está a la vista** y lo ya sonado se va por detrás. Al revés —que fue
# el primer reparto— la persona no podía ver lo que venía, que en un
# secuenciador es justo lo que hay que ver.
PIEDRAS = [
    (3, 0, 'canto'),        # justo ahora, contra su lámina
    (0, 22, 'canto'),       # y dentro de un momento, dos a la vez:
    (5, 22, 'varilla'),     # eso es un acorde, no un acierto
    (1, 52, 'cuna'),
    (7, 78, 'cuna'),
    (2, 106, 'canto'),
    (6, 106, 'varilla'),
    (4, 140, 'cuna'),
    (8, -20, 'canto'),      # acaba de sonar y se va por detrás
]
GIRO = 0.0                       # el barrilete, en este instante

MATS = {
    'muro':    ((0.150, 0.138, 0.122), 0.92, 1.05, 1.60),
    'tablero': ((0.215, 0.112, 0.046), 0.66, 0.95, 1.10),
    'canto-mesa': ((0.160, 0.082, 0.034), 0.70, 1.10, 1.70),
    # Escala de textura grande y relieve bajo: con 0,95 y 0,80 el barrilete
    # salía rayado como una persiana, y lo que tiene que parecer es madera
    # torneada.
    # Rugosidad alta a propósito. Con 0,58 el barrilete salía a 0,45 de
    # luminancia contra 0,17 del muro y con la saturación caída a 0,34: el
    # especular ancho de este motor no va multiplicado por el albedo, así que
    # un cilindro entero cabe dentro del brillo y se blanquea. Es el mismo
    # velo gris que en P03 hacía que el hierro saliera más claro que la piedra.
    'barril':  ((0.300, 0.186, 0.086), 0.86, 0.32, 0.26),
    'aro':     ((0.46, 0.330, 0.132), 0.26, 0.50, 2.60),
    # El latón salía color crema. La causa no era el albedo sino que las
    # barras miran de frente y reciben la clave plana: sin sombra propia no
    # hay metal. Albedo más bajo y saturado, y brillo concentrado.
    'laton':   ((0.44, 0.300, 0.108), 0.15, 0.35, 3.40),
    'laton-viva': ((0.60, 0.430, 0.170), 0.13, 0.30, 3.40),
    'hierro':  ((0.034, 0.038, 0.050), 0.22, 0.95, 2.60),
    # Las tres familias de piedra. El tono acompaña; la forma es lo que manda.
    'piedra-ambar': ((0.72, 0.360, 0.095), 0.44, 1.05, 3.10),
    'piedra-verde': ((0.145, 0.405, 0.205), 0.48, 1.05, 3.10),
    'piedra-azul':  ((0.120, 0.245, 0.520), 0.46, 1.05, 3.10),
}

FEATURES = {k: {'humedad'} for k in MATS}
FEATURES['laton'] = FEATURES['laton-viva'] = set()
# Sin desgaste de canto en las piezas facetadas. El rasterizador oscurece el
# borde de cada cuadrilátero, y un cilindro hecho de ciento cuatro facetas se
# llenaba de ciento cuatro costuras: parecía una persiana, no madera torneada.
FEATURES['barril'] = FEATURES['aro'] = {'sin-canto'}

# El muro va sin despiece. Con aparejo era otra vez una retícula perfecta
# ocupando media lámina, que es el defecto que costó dos vueltas en P03.
COURSING = {}

# Luz de taller: de arriba y de la izquierda, cálida y baja.
LUZ = np.array([-0.52, -0.40, 0.76])
LUZ /= np.linalg.norm(LUZ)

COLOR_FAMILIA = {'canto': 'piedra-ambar', 'cuna': 'piedra-verde',
                 'varilla': 'piedra-azul'}


def _superficie(ang, r=RADIO):
    """Punto del barrilete en ese ángulo. 0 = el que toca el peine."""
    a = math.radians(ang + GIRO + ANG_CONTACTO)
    return EJE_Y - r * math.cos(a), EJE_Z + r * math.sin(a)


def _normal_dentro(ang):
    a = math.radians(ang + GIRO + ANG_CONTACTO)
    return -math.cos(a), math.sin(a)


def mesa(buf):
    """Muro, tablero y canto. La mesa es lo que da escala al instrumento."""
    blit_quad(buf, [(-0.4, Y_MURO, 0.0), (TW + 0.4, Y_MURO, 0.0),
                    (TW + 0.4, Y_MURO, 2.60), (-0.4, Y_MURO, 2.60)], 'muro')
    blit_quad(buf, [(0.0, 0.0, Z_MESA), (TW, 0.0, Z_MESA),
                    (TW, TD, Z_MESA), (0.0, TD, Z_MESA)], 'tablero')
    blit_quad(buf, [(0.0, 0.0, Z_MESA - 0.075), (TW, 0.0, Z_MESA - 0.075),
                    (TW, 0.0, Z_MESA), (0.0, 0.0, Z_MESA)], 'canto-mesa', 0.88)


def barrilete(buf, facetas=104):
    """El cilindro, por facetas. Cada faceta lleva su normal, así que la luz
    lo redondea sola: no hay degradado pintado en ninguna parte."""
    paso = 300.0 / facetas
    for i in range(facetas):
        a0, a1 = -150 + i * paso, -150 + (i + 1) * paso
        y0, z0 = _superficie(a0)
        y1, z1 = _superficie(a1)
        blit_quad(buf, [(BX0, y0, z0), (BX1, y0, z0), (BX1, y1, z1), (BX0, y1, z1)],
                  'barril')
    # Aros de latón en los dos extremos, y el eje asomando
    for x, lado in ((BX0, -1), (BX1, 1)):
        for i in range(facetas):
            a0, a1 = -150 + i * paso, -150 + (i + 1) * paso
            y0, z0 = _superficie(a0, RADIO + 0.012)
            y1, z1 = _superficie(a1, RADIO + 0.012)
            blit_quad(buf, [(x, y0, z0), (x + lado * 0.045, y0, z0),
                            (x + lado * 0.045, y1, z1), (x, y1, z1)], 'aro', 1.05)
    for x, lado in ((BX0, -1), (BX1, 1)):
        box(buf, x + (0.0 if lado < 0 else 0.045), EJE_Y - 0.028, EJE_Z - 0.028,
            0.105, 0.056, 0.056, 'hierro')


def _forma(familia):
    """Recorte de cada familia. La forma es el canal que no es color."""
    if familia == 'canto':
        return lambda u, v: ((2 * u - 1) ** 2 + (2 * v - 1) ** 2) < 1.0
    if familia == 'cuna':
        return lambda u, v: (np.abs(2 * u - 1) + np.abs(2 * v - 1)) < 1.25
    return lambda u, v: np.abs(2 * v - 1) < 0.52


TAMANO = {'canto': (0.115, 0.115), 'cuna': (0.125, 0.125), 'varilla': (0.185, 0.095)}


def piedras(buf):
    """Las piedras puestas sobre el barrilete."""
    for lam, ang, familia in PIEDRAS:
        x = LAM_X0 + lam * LAM_PASO
        ax, az = TAMANO[familia]
        alto = 0.042
        ny, nz = _normal_dentro(ang)
        yb, zb = _superficie(ang)
        yt, zt = yb + ny * alto, zb + nz * alto
        # canto de la piedra, para que tenga grosor
        for s in (-1, 1):
            blit_quad(buf, [(x + s * ax / 2, yb, zb), (x + s * ax / 2, yt, zt),
                            (x + s * ax / 2 - s * 0.012, yt, zt),
                            (x + s * ax / 2 - s * 0.012, yb, zb)],
                      COLOR_FAMILIA[familia], 0.72)
        # cara de arriba
        ty, tz = -nz, ny          # tangente a la superficie
        blit_quad(buf, [(x - ax / 2, yt - ty * az / 2, zt - tz * az / 2),
                        (x + ax / 2, yt - ty * az / 2, zt - tz * az / 2),
                        (x + ax / 2, yt + ty * az / 2, zt + tz * az / 2),
                        (x - ax / 2, yt + ty * az / 2, zt + tz * az / 2)],
                  COLOR_FAMILIA[familia], alpha=_forma(familia))


def _sonando():
    """Qué láminas están recibiendo un golpe ahora mismo."""
    return {lam for lam, ang, _ in PIEDRAS if abs((ang + GIRO) % 360) < 7
            or abs((ang + GIRO) % 360 - 360) < 7}


def peine(buf):
    """Las barras de latón, colgadas. La longitud es el tono, y por eso se ve."""
    vivas = _sonando()
    # la percha
    box(buf, LAM_X0 - 0.16, Y_BARRAS - 0.022, Z_COLGADO,
        LAM_PASO * (LAMINAS - 1) + 0.32, 0.044, 0.030, 'aro')
    for i in range(LAMINAS):
        x = LAM_X0 + i * LAM_PASO
        viva = i in vivas
        z0, z1 = Z_COLGADO - 0.016, Z_COLGADO - 0.016 - LAM_LARGO[i]
        mat = 'laton-viva' if viva else 'laton'
        # una barra golpeada se aparta: el desplazamiento es lo que se ve de
        # un golpe, y no hace falta ningún destello para contarlo
        dy = -0.030 if viva else 0.0
        blit_quad(buf, [(x - LAM_ANCHO / 2, Y_BARRAS + dy, z0),
                        (x + LAM_ANCHO / 2, Y_BARRAS + dy, z0),
                        (x + LAM_ANCHO / 2, Y_BARRAS + dy, z1),
                        (x - LAM_ANCHO / 2, Y_BARRAS + dy, z1)], mat,
                  1.16 if viva else 1.0)
        # Prisma de tres caras en vez de una plancha: una cara coge la luz,
        # otra se va en sombra, y con eso la barra deja de ser un recorte
        # plano y se lee como metal con volumen.
        for lado, t in ((-1, 0.62), (1, 0.42)):
            blit_quad(buf, [(x + lado * LAM_ANCHO / 2, Y_BARRAS + dy, z0),
                            (x + lado * LAM_ANCHO * 0.30, Y_BARRAS + dy + 0.040, z0),
                            (x + lado * LAM_ANCHO * 0.30, Y_BARRAS + dy + 0.040, z1),
                            (x + lado * LAM_ANCHO / 2, Y_BARRAS + dy, z1)], mat, t)
        # el cordón del que cuelga
        blit_quad(buf, [(x - 0.006, Y_BARRAS + dy, Z_COLGADO),
                        (x + 0.006, Y_BARRAS + dy, Z_COLGADO),
                        (x + 0.006, Y_BARRAS + dy, z0),
                        (x - 0.006, Y_BARRAS + dy, z0)], 'hierro', 1.4)


def bastidor(buf):
    """Los dos montantes que sostienen el eje, y el pie de la percha."""
    for x in (0.30, 3.06):
        box(buf, x - 0.055, EJE_Y - 0.075, Z_MESA, 0.110, 0.150, EJE_Z - Z_MESA + 0.10,
            'canto-mesa')
        box(buf, x - 0.080, EJE_Y - 0.100, EJE_Z - 0.085, 0.160, 0.200, 0.170, 'canto-mesa')
    for x in (0.30, 3.06):
        box(buf, x - 0.030, Y_BARRAS - 0.030, Z_MESA, 0.060, 0.080,
            Z_COLGADO - Z_MESA + 0.030, 'canto-mesa')


def backdrop(W, H):
    """El aire del taller. Es obra."""
    bg = np.zeros((H, W, 3), np.float32)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    r = np.sqrt(((xx - W * 0.30) / (W * 0.95)) ** 2 + ((yy - H * 0.20) / (H * 1.05)) ** 2)
    bg += np.array([0.060, 0.050, 0.040])[None, None, :] * np.clip(1.20 - r, 0, 1)[..., None]
    bg += np.array([0.013, 0.012, 0.011])[None, None, :]
    return bg


def lighting(buf):
    return e4.shade(
        buf, LUZ,
        key=np.array([1.00, 0.885, 0.680], np.float32),
        sky=np.array([0.27, 0.29, 0.35], np.float32),
        bounce=np.array([0.28, 0.22, 0.16], np.float32),
        bounce_k=np.array([0.32, 0.26, 0.18], np.float32),
        fog=np.array([0.032, 0.029, 0.025], np.float32),
        fill=(np.array([0.74, -0.44, 0.50], np.float32),
              np.array([0.30, 0.38, 0.54], np.float32), 0.32),
        fog_k=0.26, amb_k=0.21, key_k=0.52, spec_k=0.20, shadow_k=0.84)


def configure(out_w, out_h, top=0.0, bot=0.0, margen=0.02, rise=0.40,
              ventana=None, z_rango=None, skew=0.24):
    global OUT_W, OUT_H, TOP_OUT, BOT_OUT
    OUT_W, OUT_H = out_w, out_h
    TOP_OUT, BOT_OUT = top, bot
    W, H = out_w * SS, out_h * SS
    x0, x1 = ventana if ventana else (-0.05, TW + 0.05)
    u = W * (1 - 2 * margen) / (x1 - x0 + TD * skew)
    ox = W * margen - x0 * u
    z_lo, z_hi = z_rango or (Z_MESA - 0.12, EJE_Z + RADIO + 0.16)
    pie = H - bot * SS
    oy = pie + z_lo * u
    e4.setup(e4.Frontal(u, ox, oy, depth_rise=rise, skew=skew), MATS, out_w, out_h,
             ss=SS, coursing=COURSING, features=FEATURES, top=top, bot=bot)


def render_escena():
    buf = e4.Buffers()
    mesa(buf)
    bastidor(buf)
    barrilete(buf)
    piedras(buf)
    peine(buf)
    return e4.compose(lighting(buf), buf, backdrop, exposure=1.52,
                      vignette=(1.16, 0.64, 1.40), contraste=0.24, pivote=0.40)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', type=Path, default=REPO / 'editorial/r62/p04-ritmo-de-colores')
    ap.add_argument('--rapido', action='store_true')
    args = ap.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    global SS
    if args.rapido:
        SS = 1
    e4.set_textures(e4.fbm_tile(octaves=6, gain=0.55, lowest=22, seed=23),
                    e4.fbm_tile(octaves=6, gain=0.60, lowest=40, seed=61))
    e4.set_theme('navy')
    configure(1180, 900, 104, 120)
    img = render_escena()
    Image.fromarray((img * 255 + 0.5).astype(np.uint8)).resize(
        (OUT_W, OUT_H), Image.LANCZOS).save(args.out / 'prueba.png')
    print(f'Escrito {args.out}/prueba.png')


if __name__ == '__main__':
    main()
