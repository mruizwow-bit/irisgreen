#!/usr/bin/env python3
"""R62 · P07 · El refugio · lámina de concepto.

`R62_P07_REFUGIO_CONCEPT_READY_FOR_ASTRA_AURA_MARIA`. Sobre `ig_render_e4.py`,
que no se toca.

## Lo que esta lámina tiene que enseñar

Un rincón de casa donde se ve, sin leer nada: **cuánta luz entra** —por las
tiras de la persiana en el suelo, no por el brillo general—, **cuánta cosa hay
a la vista**, y **qué superficies están desnudas y cuáles cubiertas**. Son tres
de los cuatro canales del juego, y no hacen falta indicadores: ya son la
escena. El cuarto, el sonido, tiene cuerpo: el disco de papel que tiembla.

## Lo aprendido en P05 y P06, aplicado antes de medir y no después

1. **Colocar respecto a lo que hay, no a una cota absoluta.** En P05 puse un
   animal a media agua sin mirar dónde estaba el fondo y quedó enterrado: ocho
   píxeles en la lámina. Aquí todo lo que se apoya usa `sobre()`, que parte de
   la superficie de debajo.
2. **Comprobar el tamaño en píxeles, no en metros.** Un cebo de tres
   centímetros son dos píxeles. `comprobar_tamanos()` lo verifica al generar y
   avisa en vez de dejarlo pasar.
3. **Una señal de estado tiene que quitar, no sólo sumar.** En P06 el charco de
   foco sólo sumaba y una vitrina apagada salía casi tan clara como una
   encendida. Aquí la persiana **quita luz de verdad**: menos lamas abiertas,
   menos tiras y más cortas.
4. **Las capas propias tiñen, no sobrescriben.** En P05 mi capa de alga escribía
   un verde fijo sobre la rama y la volvía insensible a su propio albedo. Aquí
   el desgaste y el pelo del tejido multiplican.
5. **La paleta se reparte de una vez**, con la calibración
   `mostrado = a·albedo + b`, y no empujando albedos de dos en dos.

Uso:  python3 scripts/r62_p07_render.py [--rapido]
"""
import argparse
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
import ig_render_e4 as e4
from ig_render_e4 import blit_quad, box

REPO = Path(__file__).resolve().parent.parent

SS = 2
OUT_W, OUT_H = 1180, 900
TOP_OUT = BOT_OUT = 0.0

# --- el rincón, en metros --------------------------------------------------
RX0, RX1 = 0.00, 3.05            # ventana de cámara a lo ancho
RY0, RY1 = 0.00, 2.05            # hacia dentro: el fondo está cerca
RZ1 = 2.30
GX0, GX1 = -0.70, 3.80           # la geometría sobra por los lados
GY0, GY1 = -0.60, 2.05

# La persiana: seis lamas, y cuántas quedan abiertas es el estado que la lámina
# cuenta. Cuatro de seis: entra luz, pero ya no toda.
LAMAS, LAMAS_ABIERTAS = 6, 4
VENT_Z0, VENT_Z1 = 0.92, 1.96    # hueco de la ventana en el testero
ZUMBIDO = 0.0                    # la lámpara está apagada en esta lámina

BANCO_Z = 0.42
ESTANTE_X0, ESTANTE_X1 = 2.06, 2.98

MATS = {
    'yeso':      ((0.560, 0.536, 0.492), 0.97, 0.80, 1.10),
    'pino':      ((0.330, 0.240, 0.146), 0.74, 1.05, 0.90),
    'rodapie':   ((0.250, 0.182, 0.110), 0.68, 0.95, 1.80),
    'mueble':    ((0.205, 0.146, 0.090), 0.70, 0.95, 1.30),
    # Tejidos: rugosidad muy alta y relieve alto. Lo que distingue la lana del
    # algodón no es el tono, es el pelo: la lana devuelve por el canto con la
    # luz rasante y el algodón no.
    # La lana bajaba a 0,0266 del yeso, por debajo del mínimo. Movida en los
    # **tres** canales a la vez, que es la lección de P05: moverla en uno solo
    # mientras otro sube deja la distancia igual, porque la medida es la media
    # de los tres.
    'lana':      ((0.502, 0.346, 0.227), 0.98, 1.65, 3.40),
    'algodon':   ((0.430, 0.388, 0.322), 0.95, 0.80, 2.40),
    'trapo':     ((0.304, 0.251, 0.216), 0.96, 1.35, 2.10),
    'papel':     ((0.520, 0.470, 0.374), 0.92, 0.45, 2.00),
    # El mimbre y el trapo se tocan —la cesta se apoya en la alfombra— y la
    # calibración dice que con a = 0,238 y b = 0,1005 el mimbre llega a 0,23
    # con el albedo de abajo. Paja clara a la luz, que es lo que es.
    'mimbre':    ((0.745, 0.571, 0.320), 0.84, 1.45, 3.60),
    'hoja':      ((0.112, 0.206, 0.108), 0.80, 0.70, 2.80),
    'ceramica':  ((0.300, 0.158, 0.098), 0.52, 0.60, 2.20),
    'hilo':      ((0.180, 0.172, 0.150), 0.70, 0.35, 1.00),
}

COURSING = {'pino': (1.95, 0.136, 0.37)}
FEATURES = {'yeso': {'humedad'}, 'rodapie': {'sin-canto'}}

# La luz entra por la ventana del testero izquierdo: viene de la izquierda, de
# fuera y de arriba.
LUZ = np.array([-0.62, -0.40, 0.675], np.float32)
LUZ /= np.linalg.norm(LUZ)


def _ruido(a, b):
    a, b = np.broadcast_arrays(np.asarray(a, np.float32), np.asarray(b, np.float32))
    return e4.sample_tex(np.atleast_1d(a), np.atleast_1d(b)).reshape(a.shape)


def px(metros):
    """Cuántos píxeles mide eso en la lámina. La unidad en la que se juzga."""
    return metros * e4.CAM.u / SS


# --- lo que el juego calcula ----------------------------------------------

PIEZAS = {
    # pieza          luz    sonido  vista   tacto     puesta ahora
    'persiana':    (-1.00,  0.00,   0.00,   0.00,     True),
    'lampara':     (+0.55, +0.40,   0.00,   0.00,     False),
    'alfombra':    (0.00,  -0.45,  +0.20,  -0.35,     True),
    'cortina':     (-0.40, -0.30,  +0.25,   0.00,     False),
    'manta':       (0.00,  -0.20,  +0.15,  -0.40,     True),
    'cosas':       (0.00,   0.00,  +0.60,   0.00,     True),
    'puerta':      (0.00,  +0.35,   0.00,   0.00,     True),
    'planta':      (0.00,  -0.10,  +0.20,   0.00,     True),
}


def canales():
    """Los cuatro canales del rincón, sumando lo que hay puesto.

    `luz` lleva además la persiana, que es continua: cuántas lamas quedan
    abiertas. Es el único canal cuyo valor se ve directamente en la lámina,
    como tiras en el suelo.
    """
    c = {'luz': 0.0, 'sonido': 0.0, 'vista': 0.0, 'tacto': 0.0}
    for nombre, (l, s, v, t, puesta) in PIEZAS.items():
        if not puesta:
            continue
        k = (LAMAS_ABIERTAS / LAMAS) if nombre == 'persiana' else 1.0
        c['luz'] += l * k
        c['sonido'] += s
        c['vista'] += v
        c['tacto'] += t
    c['luz'] += LAMAS_ABIERTAS / LAMAS      # lo que entra por el hueco abierto
    return c


def zumbido():
    """Cuánto tiembla el disco de papel. Sale de lo que zumba, no de un ajuste."""
    return sum(s for n, (l, s, v, t, p) in PIEZAS.items() if p and s > 0)


# --- geometría -------------------------------------------------------------

def sobre(z_base, alto=0.0):
    """Lo que se apoya parte de la superficie de abajo, no del origen."""
    return z_base + alto


def cuarto(buf):
    """Suelo, paramento del fondo y testero de la ventana.

    El testero es un plano de x constante: sólo se ve gracias al sesgo lateral
    de la cámara. Es la lección de P03, y aquí es crítica porque la ventana
    está justo ahí.
    """
    blit_quad(buf, [(GX0, GY0, 0.0), (GX1, GY0, 0.0), (GX1, GY1, 0.0), (GX0, GY1, 0.0)],
              'pino', 1.0)
    blit_quad(buf, [(GX0, GY1, 0.0), (GX1, GY1, 0.0), (GX1, GY1, RZ1), (GX0, GY1, RZ1)],
              'yeso', 1.0)
    # el testero izquierdo, con el hueco de la ventana recortado
    blit_quad(buf, [(0.0, GY0, 0.0), (0.0, GY1, 0.0), (0.0, GY1, RZ1), (0.0, GY0, RZ1)],
              'yeso', 0.86,
              alpha=lambda u, v: ~((v * RZ1 > VENT_Z0) & (v * RZ1 < VENT_Z1)
                                   & (u > 0.18) & (u < 0.76)))
    box(buf, GX0, GY1 - 0.055, 0.0, GX1 - GX0, 0.055, 0.105, 'rodapie')


def persiana(buf):
    """Las lamas. Las abiertas dejan hueco; las bajadas tapan.

    El estado del canal «luz» **es** esta geometría: menos lamas abiertas,
    menos tiras de luz en el suelo. No hay indicador que mantener sincronizado
    con el modelo, porque el modelo y el dibujo son la misma cosa.
    """
    alto = (VENT_Z1 - VENT_Z0) / LAMAS
    for i in range(LAMAS):
        z = VENT_Z0 + i * alto
        abierta = i >= LAMAS - LAMAS_ABIERTAS
        grosor = 0.012 if abierta else alto * 0.92
        box(buf, -0.012, GY0 + 0.74, z + (alto - grosor) * 0.5,
            0.014, 0.52, grosor, 'mueble')


def blando(buf, mat, x, y, z, ancho, alto, hundido=0.25, pliegues=0):
    """Una cosa blanda: perfil con los cantos caídos y, si hace falta, pliegues.

    `hundido` es cuánto se hunde el canto superior —un cojín se hunde, una
    manta doblada casi no—. Los pliegues son una modulación, no geometría.
    """
    def perfil(u, v):
        caida = 1.0 - hundido * np.sin(np.clip(u, 0, 1) * np.pi)
        return (v < caida) & (np.abs(u - 0.5) < 0.5 - 0.10 * np.sin(v * np.pi))

    def mod(u, v):
        m = 0.80 + 0.34 * e4.sample_grain(u * 7.0, v * 7.0)
        if pliegues:
            m = m * (0.86 + 0.26 * (0.5 + 0.5 * np.cos(v * pliegues * np.pi * 2)))
        return m

    blit_quad(buf, [(x - ancho / 2, y, z), (x + ancho / 2, y, z),
                    (x + ancho / 2, y, z + alto), (x - ancho / 2, y, z + alto)],
              mat, 1.0, alpha=perfil, modula=mod)


def banco(buf):
    """El banco bajo la ventana, con el cojín y la manta doblada."""
    box(buf, 0.10, 0.34, 0.0, 1.16, 0.56, BANCO_Z, 'mueble')
    # Cojín y manta. Con `box` salían dos cubos: un cojín de aristas vivas no
    # es un cojín, y el criterio 4 del PASS —ver qué está desnudo y qué
    # cubierto— se apoya justo en que lo blando parezca blando. Van como
    # cuadriláteros recortados por su perfil, que es el recurso con el que P02
    # hace las hojas.
    blando(buf, 'algodon', 0.43, 0.42, sobre(BANCO_Z), 0.46, 0.17, hundido=0.30)
    blando(buf, 'lana', 0.97, 0.44, sobre(BANCO_Z), 0.44, 0.19, hundido=0.10, pliegues=3)


def alfombra(buf):
    """Alfombra de trapo: tiras cosidas en direcciones distintas.

    La irregularidad tiene que ser desigual, que es el criterio 2 de la
    referencia. Las tiras tienen anchos distintos y cada una su propio tono por
    un hash de su índice, así que no se lee como un rayado regular.
    """
    x0, x1, y0, y1 = 0.74, 2.42, 0.18, 1.34
    n, acc = 14, 0.0
    for i in range(n):
        ancho = (x1 - x0) / n * (0.72 + 0.56 * ((np.sin(i * 7.31) + 1) / 2))
        h = (np.sin(i * 12.9898) * 43758.5453) % 1.0
        blit_quad(buf, [(x0 + acc, y0, 0.004), (x0 + acc + ancho, y0, 0.004),
                        (x0 + acc + ancho, y1, 0.004), (x0 + acc, y1, 0.004)],
                  'trapo', 0.78 + 0.42 * h,
                  modula=lambda u, v, hh=h: 0.80 + 0.36 * e4.sample_grain(
                      (u * 4.0 + hh * 9.0), v * 22.0))
        acc += ancho
        if acc > x1 - x0:
            break


def estanteria(buf):
    """El estante con sus cosas. «Cuánta cosa hay a la vista» no se representa:
    las cosas están ahí o no están, y se cuentan mirando."""
    for z in (0.52, 1.02, 1.52):
        box(buf, ESTANTE_X0, 1.62, z, ESTANTE_X1 - ESTANTE_X0, 0.34, 0.034, 'mueble')
    for x in (ESTANTE_X0, ESTANTE_X1 - 0.05):
        box(buf, x, 1.62, 0.0, 0.05, 0.34, 1.75, 'mueble')
    # las cosas: cajas, papeles y cacharros, cada uno con su tamaño
    cosas = [(0.52, 2.16, 0.22, 0.17, 'mimbre'), (0.52, 2.50, 0.17, 0.21, 'ceramica'),
             (0.52, 2.78, 0.13, 0.12, 'ceramica'),
             (1.02, 2.14, 0.26, 0.13, 'papel'), (1.02, 2.52, 0.19, 0.19, 'mimbre'),
             (1.52, 2.20, 0.21, 0.15, 'mimbre'), (1.52, 2.60, 0.15, 0.17, 'papel')]
    for z, x, w, h, mat in cosas:
        box(buf, x - w / 2, 1.66, sobre(z, 0.034), w, 0.26, h, mat)


def lampara_y_movil(buf):
    """La lámpara de papel —apagada— y el móvil con el disco.

    El disco es el cuerpo del canal «sonido». Aquí no tiembla, porque la
    lámpara está apagada y no hay zumbido: la quietud también es la señal.
    """
    box(buf, 1.58, 0.92, 1.62, 0.012, 0.012, RZ1 - 1.62, 'hilo')
    blit_quad(buf, [(1.42, 0.86, 1.30), (1.74, 0.86, 1.30),
                    (1.74, 0.86, 1.64), (1.42, 0.86, 1.64)], 'papel', 1.0,
              alpha=lambda u, v: (np.abs(u - 0.5) < 0.5 - 0.42 * np.abs(v - 0.46) ** 1.6),
              modula=lambda u, v: 0.82 + 0.30 * (0.5 + 0.5 * np.cos(u * 7 * np.pi)))
    # el móvil, colgado del marco de la ventana
    box(buf, 0.42, 0.52, 1.30, 0.008, 0.008, 0.62, 'hilo')
    tiembla = min(zumbido(), 1.0)
    blit_quad(buf, [(0.33, 0.52, 1.22), (0.51, 0.52, 1.22),
                    (0.51, 0.52, 1.40), (0.33, 0.52, 1.40)], 'papel', 1.0,
              alpha=lambda u, v: ((u - 0.5) ** 2 + (v - 0.5) ** 2) < 0.235)
    if tiembla > 0.02:
        for lado in (-1, 1):
            d = lado * 0.035 * tiembla
            blit_quad(buf, [(0.33 + d, 0.521, 1.22), (0.51 + d, 0.521, 1.22),
                            (0.51 + d, 0.521, 1.40), (0.33 + d, 0.521, 1.40)],
                      'papel', 0.45,
                      alpha=lambda u, v: ((u - 0.5) ** 2 + (v - 0.5) ** 2) < 0.235)


def planta_y_puerta(buf):
    """La planta en el suelo y la puerta entreabierta del fondo."""
    box(buf, 1.86, 0.30, 0.0, 0.24, 0.24, 0.26, 'mimbre')
    rng = np.random.default_rng(9)
    for i in range(13):
        a = rng.random() * 2 * np.pi
        largo = 0.26 + rng.random() * 0.30
        blit_quad(buf, [(1.98, 0.42, sobre(0.26)), (1.98 + 0.055, 0.42, sobre(0.26)),
                        (1.98 + 0.055 + np.cos(a) * largo * 0.6, 0.42,
                         sobre(0.26) + largo),
                        (1.98 + np.cos(a) * largo * 0.6, 0.42, sobre(0.26) + largo)],
                  'hoja', 0.70 + 0.50 * rng.random(),
                  alpha=lambda u, v: v < 1.0 - 0.30 * u)
    # la puerta entreabierta: se ve la hoja y la rendija oscura
    box(buf, 2.38, RY1 - 0.06, 0.0, 0.040, 0.06, 2.00, 'mueble')
    box(buf, 2.42, RY1 - 0.26, 0.0, 0.035, 0.22, 2.00, 'mueble')


def colocando(buf):
    """La manta, suspendida sobre su sitio. El anillo punteado va en vector."""
    z = sobre(BANCO_Z) + 0.40
    blando(buf, 'lana', 0.97, 0.40, z, 0.44, 0.19, hundido=0.10, pliegues=3)
    # su huella en el banco y la vertical de caída: la convención de P02, P03 y
    # P06, y la señal que faltaba en la primera vuelta de P06
    blit_quad(buf, [(0.72, 0.40, sobre(BANCO_Z) + 0.002), (1.22, 0.40, sobre(BANCO_Z) + 0.002),
                    (1.22, 0.84, sobre(BANCO_Z) + 0.002), (0.72, 0.84, sobre(BANCO_Z) + 0.002)],
              'mueble', 0.42,
              alpha=lambda u, v: ((u - 0.52) ** 2 / 0.26 + (v - 0.5) ** 2 / 0.26) < 0.92)
    blit_quad(buf, [(0.96, 0.80, sobre(BANCO_Z)), (0.968, 0.80, sobre(BANCO_Z)),
                    (0.968, 0.80, z - 0.02), (0.96, 0.80, z - 0.02)], 'hilo', 0.70)


# --- luz y composición -----------------------------------------------------

def backdrop(W, H):
    """El aire del rincón. Es obra."""
    bg = np.zeros((H, W, 3), np.float32)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    r = np.sqrt(((xx - W * 0.18) / (W * 1.0)) ** 2 + ((yy - H * 0.22) / (H * 1.1)) ** 2)
    bg += np.array([0.090, 0.076, 0.058])[None, None, :] * np.clip(1.15 - r, 0, 1)[..., None]
    bg += np.array([0.016, 0.015, 0.014])[None, None, :]
    return bg


def lighting(buf):
    return e4.shade(
        buf, LUZ,
        key=np.array([1.00, 0.862, 0.650], np.float32),
        sky=np.array([0.27, 0.29, 0.34], np.float32),
        bounce=np.array([0.34, 0.26, 0.17], np.float32),
        bounce_k=np.array([0.38, 0.29, 0.19], np.float32),
        fog=np.array([0.026, 0.024, 0.022], np.float32),
        fill=(np.array([0.70, -0.44, 0.46], np.float32),
              np.array([0.28, 0.33, 0.42], np.float32), 0.30),
        # spec_k bajo desde el principio: con 0,18 el término que no depende del
        # albedo domina y los materiales dejan de separarse. Es lo que en P05
        # costó tres vueltas descubrir.
        # El ambiente y la clave bajan mucho: en este rincón **la luz es la
        # cuña**. Con el cuarto iluminado por igual, las tiras caían sobre un
        # suelo que ya estaba claro y no se leían, y entonces «cuánta luz
        # entra» dejaba de verse, que es el §11 entero. Una habitación con la
        # persiana a media altura está en penumbra, y lo que la alumbra es lo
        # que entra por el hueco.
        fog_k=0.20, amb_k=0.13, key_k=0.26, spec_k=0.07, shadow_k=0.86)


def tiras_de_luz(lit, buf):
    """Las tiras de la persiana. **Es** el canal «luz», no su indicador.

    La luz entra por el hueco y la cortan las lamas, así que lo que cae son
    bandas. Cuántas y hasta dónde llegan sale de `LAMAS_ABIERTAS`: bajar la
    persiana quita tiras y las acorta. Una señal de estado que **quita**, que es
    la corrección que P06 necesitó.
    """
    x, y, z = buf.world[..., 0], buf.world[..., 1], buf.world[..., 2]
    frac = LAMAS_ABIERTAS / LAMAS
    paso = (VENT_Z1 - VENT_Z0) / LAMAS
    # Coordenada a lo largo del haz. Con 0,62 las bandas salían a 32° y se
    # leían como lluvia o como un papel pintado: unas lamas horizontales dan
    # bandas casi horizontales en el paramento del fondo y paralelogramos
    # estirados en el suelo, no rayas en diagonal por todo.
    s = z + x * 0.17
    banda = 0.5 + 0.5 * np.cos(2 * np.pi * (s - VENT_Z0) / paso)
    banda = np.clip((banda - 0.42) / 0.58, 0, 1)
    # Hasta dónde llega. Antes era una caída con la x y las tiras se quedaban
    # en la pared: en el suelo apenas se veían, y el suelo es justo donde el
    # §11 dice que se lee cuánta luz entra.
    #
    # La cuña de verdad es geométrica: lo que entra por el hueco entre
    # VENT_Z0 y VENT_Z1 viaja con la pendiente de la luz, así que a distancia x
    # de la ventana la franja iluminada está entre VENT_Z0 − x·k y VENT_Z1 − x·k.
    # Con eso la cuña baja por la pared, cruza el suelo y se acaba sola donde
    # tiene que acabarse.
    k = float(LUZ[2] / abs(LUZ[0]))
    lo = VENT_Z0 - x * k - 0.10
    hi = VENT_Z1 - x * k + 0.10
    alcance = np.clip(np.minimum(z - lo, hi - z) / 0.22, 0, 1)
    alcance = alcance * np.clip(1.0 - (x - 0.2) / (1.2 + 2.4 * frac), 0, 1) ** 0.8
    # sólo donde la cara mira a la ventana
    mira = np.clip((buf.normal * LUZ[None, None, :]).sum(-1), 0, 1)
    # Y no caen sobre el propio testero de la ventana: la luz sale de ahí.
    # Dibujar la sombra de una persiana sobre la pared que la sostiene es el
    # tipo de cosa que delata que las tiras están pintadas y no proyectadas.
    tira = banda * alcance * mira * buf.mask * frac * (x > 0.03)
    # El suelo recibe la luz de canto y por eso el aporte se nota menos que en
    # el paramento; se compensa para que la señal viva donde se lee.
    plano = np.clip(buf.normal[..., 2], 0, 1)
    # Y la tira **multiplica por el albedo** de lo que toca. Sumar luz blanca
    # plana es el mismo error que ya me costó tres vueltas en P05 con la capa
    # de alga y una más en P06 con el charco de foco: una capa aditiva que
    # ignora el color del material le pone un suelo, y a partir de ahí el
    # albedo deja de decidir cómo se ve algo. Medido aquí: bajar la lana un
    # 30 % movía su distancia al yeso de 0,0266 a 0,0263, o sea nada.
    #
    # Una tira de sol sobre lana oscura y sobre yeso claro no es la misma
    # mancha: es la misma luz sobre dos cosas distintas.
    luz_tira = np.array([1.00, 0.84, 0.60], np.float32)[None, None, :] * buf.albedo
    out = lit + luz_tira * (tira * (0.62 + 0.75 * plano))[..., None] * 2.30
    # polvo en la cuña, en el aire
    polvo = e4.sample_grain(x * 9.0 + 1.0, z * 9.0)
    aire = (banda * alcance * (1.0 - buf.mask.astype(np.float32))
            * (0.30 + 0.70 * polvo) * frac)
    return out + (np.array([1.00, 0.86, 0.64], np.float32)[None, None, :]
                  * aire[..., None] * 0.075)


def configure(out_w, out_h, top=0.0, bot=0.0, margen=0.018, rise=0.40, skew=0.26,
              ventana=None, z_rango=None):
    global OUT_W, OUT_H, TOP_OUT, BOT_OUT
    OUT_W, OUT_H = out_w, out_h
    TOP_OUT, BOT_OUT = top, bot
    W, H = out_w * SS, out_h * SS
    x0, x1 = ventana if ventana else (RX0 - 0.06, RX1)
    z_lo, z_hi = z_rango or (0.0, 2.12)
    u_alto = H * (1 - 2 * margen) / ((z_hi - z_lo) + (RY1 - RY0) * rise)
    u_ancho = W * (1 - 2 * margen) / ((x1 - x0) + (RY1 - RY0) * skew)
    u = min(u_alto, u_ancho)
    ox = W * margen - x0 * u
    oy = (H - bot * SS) + z_lo * u
    e4.setup(e4.Frontal(u, ox, oy, depth_rise=rise, skew=skew), MATS, out_w, out_h,
             ss=SS, coursing=COURSING, features=FEATURES, top=top, bot=bot)


def comprobar_tamanos():
    """¿Se ve? La unidad de esta pregunta es el píxel, no el metro.

    En P05 el aparejo entero medía dos o tres píxeles porque lo dimensioné en
    centímetros de verdad. Las piezas de un juguete son del tamaño en que se
    ven. Esto avisa al generar, no tres vueltas después.
    """
    minimos = {'lama de persiana': ((VENT_Z1 - VENT_Z0) / LAMAS, 10),
               'disco del móvil': (0.18, 24),
               'manta': (0.42, 40),
               'cosa del estante': (0.13, 16),
               'tira de luz': ((VENT_Z1 - VENT_Z0) / LAMAS, 10)}
    avisos = []
    for nombre, (metros, minimo) in minimos.items():
        p = px(metros)
        if p < minimo:
            avisos.append(f'{nombre}: {p:.0f} px, por debajo de {minimo}')
    return avisos


def escena_y_buffers():
    buf = e4.Buffers()
    cuarto(buf)
    persiana(buf)
    banco(buf)
    alfombra(buf)
    estanteria(buf)
    planta_y_puerta(buf)
    lampara_y_movil(buf)
    colocando(buf)
    lit = tiras_de_luz(lighting(buf), buf)
    img = e4.compose(lit, buf, backdrop, exposure=1.46,
                     vignette=(1.16, 0.66, 1.42), contraste=0.30, pivote=0.44)
    return img, buf


def render_escena():
    return escena_y_buffers()[0]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', type=Path, default=REPO / 'editorial/r62/p07-el-refugio')
    ap.add_argument('--rapido', action='store_true')
    args = ap.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    global SS
    if args.rapido:
        SS = 1
    e4.set_textures(e4.fbm_tile(octaves=6, gain=0.55, lowest=22, seed=41),
                    e4.fbm_tile(octaves=6, gain=0.62, lowest=46, seed=71))
    e4.set_theme('navy')
    configure(1180, 900, 104, 120)
    for aviso in comprobar_tamanos():
        print(f'  AVISO de tamaño · {aviso}')
    img = render_escena()
    Image.fromarray((img * 255 + 0.5).astype(np.uint8)).resize(
        (OUT_W, OUT_H), Image.LANCZOS).save(args.out / 'rincon-trabajo.png')
    print(f'Escrito {args.out}/rincon-trabajo.png')
    c = canales()
    print(f'  lamas abiertas {LAMAS_ABIERTAS}/{LAMAS} · zumbido {zumbido():.2f}')
    print('  canales: ' + ' · '.join(f'{k} {v:+.2f}' for k, v in c.items()))


if __name__ == '__main__':
    main()
