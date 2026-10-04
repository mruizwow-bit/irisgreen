#!/usr/bin/env python3
"""R62 · P06 · Mi museo · lámina de concepto. Cierra la serie de seis.

`R62_P06_MUSEO_CONCEPT_READY_FOR_ASTRA_AURA_MARIA`. Sobre el motor
`ig_render_e4.py`, que queda como está: P06 no lo toca y
`test_e4_motor_identico.py` sigue devolviendo las cuatro láminas de P01
idénticas byte a byte.

## Lo que esta lámina tiene que enseñar

Una sala con tres vitrinas, lo que hay dentro de cada una, **cuál está
alumbrada y cuál no**, y una pieza a punto de cambiar de sitio. La tensión del
juego —lo que más se quiere enseñar pide luz, y la luz es lo que no aguanta lo
frágil— se ve en que la vitrina del papel está en penumbra con su foco
recogido.

## Las tres lecciones de la serie que se aplican aquí

1. **De P03, el sesgo lateral.** Sin `skew`, un plano de x constante proyecta
   sobre una recta: los costados de las vitrinas y el testero de la izquierda
   quedarían dibujados y matemáticamente invisibles, y la sala se leería como
   un alzado. Con `skew = 0.26` hay retorno.
2. **De P03, el alcance de la sombra.** La marcha de sombras en espacio de
   pantalla llega a unas 3,5 unidades de mundo. El paramento del fondo está a
   3,0 y las vitrinas a 1,1: dentro de alcance. Si el fondo se alejara, las
   vitrinas dejarían de proyectar sobre él sin ningún aviso.
3. **De P03 y P04, la rugosidad.** El especular de este motor no va
   multiplicado por el albedo, así que con rugosidad media todo lo que mira a
   la luz se va a un velo gris. Lo que hace que el latón parezca latón y el
   yeso yeso es la rugosidad, no el color.

## Qué está modelado y qué está dibujado

Modelado: la luz que llega a cada pieza según su foco, la lectura de cada
conjunto a partir de los rasgos que comparten sus piezas, y el recorrido de la
visita. De ahí sale la traza del suelo, que no es un guion.

Dibujado: el polvo de la lama de claraboya, el reflejo de las lunas y el canto
verde del vidrio. El reparto está en `CONCEPTO.md`.

Uso:  python3 scripts/r62_p06_render.py [--rapido]
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

# --- la sala, en metros ----------------------------------------------------
SX0, SX1 = 0.00, 5.00
SY0, SY1 = 0.00, 3.00
SZ1 = 2.92                       # altura libre

# Las tres vitrinas: x del eje, fondo, ancho, alto de la urna, cota del estante.
# Alturas distintas a propósito: tres urnas iguales se leen como un patrón, y
# lo que tiene que leerse es que son tres cosas distintas.
VITRINAS = [
    {'x': 1.05, 'y': 1.16, 'ancho': 0.86, 'alto': 0.72, 'pie': 0.86, 'foco': 0.92},
    {'x': 2.52, 'y': 1.02, 'ancho': 0.96, 'alto': 0.62, 'pie': 0.74, 'foco': 0.78},
    # La del papel. Su foco está recogido: 0,10 es casi nada, y por eso esta
    # vitrina queda en penumbra. Es el estado que la lámina tiene que contar.
    {'x': 3.98, 'y': 1.22, 'ancho': 0.78, 'alto': 0.96, 'pie': 0.66, 'foco': 0.10},
]

# Las nueve piezas: (vitrina, sitio, material, oficio, época, fragilidad).
# Los rasgos no son adorno: de ellos sale la lectura de cada conjunto.
PIEZAS = [
    (0, 0, 'canto',   'pulido',  'antigua', 0.10),
    (0, 1, 'canto',   'pulido',  'antigua', 0.10),
    (0, 2, 'canto',   'tallado', 'media',   0.12),
    (1, 0, 'barro',   'cocido',  'media',   0.30),
    (1, 1, 'barro',   'cocido',  'media',   0.30),
    (1, 2, 'barro',   'pulido',  'antigua', 0.34),
    (2, 0, 'papel',   'escrito', 'reciente', 0.92),
    (2, 1, 'papel',   'escrito', 'reciente', 0.92),
    (2, 2, 'canto',   'tallado', 'reciente', 0.14),
]

# La pieza que se está colocando: suspendida sobre su hueco de la vitrina 1.
COLOCANDO = {'vitrina': 1, 'sitio': 2, 'material': 'canto', 'alto': 0.46}

MATS = {
    # Medido: yeso y tarima quedaban a 0,0144 en la lámina compuesta, por
    # debajo del mínimo. Un paramento de yeso y un roble no se parecen en
    # nada, y aquí se parecían porque los dos estaban en la misma banda de
    # valor. El yeso sube y se enfría; el roble baja y se calienta.
    'yeso':     ((0.232, 0.222, 0.208), 0.97, 0.95, 1.15),
    'tarima':   ((0.122, 0.074, 0.036), 0.70, 1.15, 1.05),
    'rodapie':  ((0.120, 0.076, 0.040), 0.66, 0.95, 1.80),
    'banco':    ((0.108, 0.068, 0.036), 0.64, 0.90, 1.40),
    # Latón: albedo bajo y saturado con brillo concentrado. Es la corrección
    # que P04 tuvo que hacer cuando el latón salía color crema.
    'laton':    ((0.300, 0.206, 0.082), 0.20, 0.40, 3.20),
    # El vidrio no se pinta claro: un vidrio limpio es casi nada. Lo que lo
    # delata es el canto y un reflejo tendido, y los dos se añaden después.
    'vidrio':   ((0.030, 0.038, 0.034), 0.08, 0.20, 1.00),
    'canto-v':  ((0.060, 0.105, 0.082), 0.12, 0.30, 1.00),
    'canto':    ((0.118, 0.124, 0.112), 0.86, 1.30, 2.40),
    'barro':    ((0.280, 0.132, 0.072), 0.80, 1.15, 2.00),
    'papel':    ((0.400, 0.360, 0.282), 0.92, 0.55, 2.60),
    'soporte':  ((0.090, 0.090, 0.094), 0.40, 0.50, 2.00),
}

COURSING = {'tarima': (1.80, 0.148, 0.42)}     # despiece de la tarima
FEATURES = {'yeso': {'humedad'}, 'tarima': set(), 'rodapie': {'sin-canto'}}

# La claraboya entra por arriba a la izquierda. Es la que da la forma de la
# sala; los focos de las vitrinas son la segunda fuente y van aparte.
LUZ = np.array([-0.46, -0.30, 0.84], np.float32)
LUZ /= np.linalg.norm(LUZ)

LAMA_X0, LAMA_X1 = 0.30, 1.90    # dónde cae la lama de claraboya en el suelo


def _ruido(a, b):
    a, b = np.broadcast_arrays(np.asarray(a, np.float32), np.asarray(b, np.float32))
    return e4.sample_tex(np.atleast_1d(a), np.atleast_1d(b)).reshape(a.shape)


# --- lo que el juego calcula ----------------------------------------------

def luz_en(vitrina, sitio):
    """Luz que le llega a una pieza: del foco de su vitrina y de la sala.

    No es un número decorativo: de él salen la parada de la visita y la marca
    de exposición. El foco cae con la distancia al centro del estante, así que
    las piezas de los extremos reciben menos que la del medio.
    """
    v = VITRINAS[vitrina]
    centro = 1.0 - abs(sitio - 1) * 0.42
    return float(np.clip(v['foco'] * centro + 0.07, 0.0, 1.0))


def lectura(vitrina):
    """Qué comparten las piezas de una vitrina. Es la etiqueta del conjunto.

    Si comparten un rasgo y sólo uno, el conjunto se lee por ése. Si comparten
    dos, por el más específico —oficio antes que material, material antes que
    época—. Si no comparten ninguno, se dice, y no es un reproche.
    """
    dentro = [p for p in PIEZAS if p[0] == vitrina]
    if not dentro:
        return None, []
    campos = {'oficio': 3, 'material': 2, 'epoca': 4}
    comunes = [n for n, i in campos.items() if len({p[i] for p in dentro}) == 1]
    orden = ['oficio', 'material', 'epoca']
    for n in orden:
        if n in comunes:
            return n, comunes
    return None, comunes


def visita():
    """Por dónde pasa quien visita y dónde se para. Sale de la sala, no de un guion.

    Entra por la derecha y recorre la sala. Se para donde hay algo que **se
    ve**: luz que llega por tamaño de pieza. Y se queda más donde el conjunto
    tiene una lectura clara, porque entender algo es lo que retiene.
    """
    paradas = []
    for i, v in enumerate(VITRINAS):
        visible = max(luz_en(i, s) for s in range(3))
        clara = 1.0 if lectura(i)[0] else 0.4
        peso = visible * clara
        if peso > 0.30:
            paradas.append((v['x'], v['y'] - 0.62, peso))
    return paradas


# --- geometría -------------------------------------------------------------

def sala(buf):
    """Suelo, paramento del fondo, testero de la izquierda y rodapié.

    El testero sólo se ve gracias al sesgo lateral de la cámara. Sin él sería
    una recta, y la sala se leería como un alzado por geometría.
    """
    blit_quad(buf, [(SX0 - 0.6, SY0 - 0.8, 0.0), (SX1 + 0.6, SY0 - 0.8, 0.0),
                    (SX1 + 0.6, SY1, 0.0), (SX0 - 0.6, SY1, 0.0)], 'tarima', 1.0)
    blit_quad(buf, [(SX0 - 0.6, SY1, 0.0), (SX1 + 0.6, SY1, 0.0),
                    (SX1 + 0.6, SY1, SZ1), (SX0 - 0.6, SY1, SZ1)], 'yeso', 1.0)
    blit_quad(buf, [(SX0, SY0 - 0.8, 0.0), (SX0, SY1, 0.0),
                    (SX0, SY1, SZ1), (SX0, SY0 - 0.8, SZ1)], 'yeso', 0.82)
    # rodapié: es lo que dice dónde acaba la pared, y sin él el suelo y el
    # paramento se tocan en una arista que no existe en ninguna sala
    box(buf, SX0 - 0.6, SY1 - 0.05, 0.0, (SX1 - SX0) + 1.2, 0.05, 0.115, 'rodapie')
    # banco al fondo
    box(buf, 3.30, 2.46, 0.40, 1.30, 0.34, 0.075, 'banco')
    for bx in (3.42, 4.42):
        box(buf, bx, 2.54, 0.0, 0.085, 0.18, 0.40, 'banco')


def _pieza(buf, mat, x, y, z, w, h, tumbada=False):
    """Una pieza de la colección. La fragilidad se ve en el montaje.

    Lo frágil va **de pie sobre su propio soporte**, que es forma y no color:
    es la señal 2 del §11. Lo que aguanta va apoyado directamente.
    """
    if tumbada:
        box(buf, x - w / 2, y - 0.055, z, w, 0.11, 0.030, 'soporte')
        z += 0.030
    blit_quad(buf, [(x - w / 2, y, z), (x + w / 2, y, z),
                    (x + w / 2, y, z + h), (x - w / 2, y, z + h)], mat, 1.0,
              alpha=lambda u, v: (((u - 0.5) ** 2 / 0.25 + (v - 0.45) ** 2 / 0.30) < 0.96
                                  if mat != 'papel' else (v < 0.97) & (np.abs(u - 0.5) < 0.46)),
              modula=lambda u, v: 0.78 + 0.40 * e4.sample_grain(u * 6.0, v * 6.0))


def vitrinas(buf):
    """Urna de vidrio sobre pies de latón, con sus piezas dentro."""
    for i, v in enumerate(VITRINAS):
        x0 = v['x'] - v['ancho'] / 2
        y0 = v['y'] - 0.30
        # pies y bastidor de latón
        for dx in (0.0, v['ancho'] - 0.055):
            for dy in (0.0, 0.545):
                box(buf, x0 + dx, y0 + dy, 0.0, 0.055, 0.055, v['pie'], 'laton')
        box(buf, x0, y0, v['pie'], v['ancho'], 0.60, 0.040, 'laton')      # estante
        # El remate medía 5 cm y, visto desde arriba con esta cámara, salían
        # tres losas amarillas que se comían la lámina. Un remate de vitrina es
        # un perfil, no una tapa.
        # El remate es un perfil que corre por el borde, no una tapa: vista
        # desde arriba con esta cámara, una tapa llena es una losa amarilla.
        for dx, dy, w, dd in ((0.0, 0.0, v['ancho'], 0.035),
                              (0.0, 0.565, v['ancho'], 0.035),
                              (0.0, 0.0, 0.035, 0.60),
                              (v['ancho'] - 0.035, 0.0, 0.035, 0.60)):
            box(buf, x0 + dx, y0 + dy, v['pie'] + v['alto'], w, dd, 0.018, 'laton')

        # las piezas, cada una en su sitio del estante
        zs = v['pie'] + 0.055
        for (vi, sitio, mat, _oficio, _epoca, frag) in PIEZAS:
            if vi != i:
                continue
            px = v['x'] + (sitio - 1) * (v['ancho'] * 0.30)
            if mat == 'papel':
                _pieza(buf, 'papel', px, v['y'], zs, 0.17, 0.26, tumbada=True)
            elif mat == 'barro':
                _pieza(buf, 'barro', px, v['y'], zs, 0.21, 0.25, tumbada=frag > 0.32)
            else:
                # Tres cantos idénticos se leen como patrón y no como uso, que
                # es literalmente lo que la referencia señala. La variación
                # sale de un hash del sitio, así que es determinista.
                h = (np.sin(i * 12.9898 + sitio * 78.233) * 43758.5453) % 1.0
                _pieza(buf, 'canto', px + (h - 0.5) * 0.035, v['y'] + (h - 0.5) * 0.06,
                       zs, 0.145 + 0.055 * h, 0.092 + 0.048 * (1.0 - h))

        # Aquí se pintaba la luna frontal como un cuadrilátero de material
        # 'vidrio'. Este rasterizador es opaco: lo que se pinta delante tapa, y
        # las tres vitrinas salieron con el interior negro y las nueve piezas
        # invisibles. Una lámina de un juego de colocar piezas en la que no se
        # ven las piezas no es una vuelta más, es la lámina equivocada.
        #
        # Un vidrio limpio es casi nada, y el propio concepto lo dice: se
        # delata por el canto y por un reflejo tendido. Así que la luna no se
        # pinta: quedan los cantos, que son geometría de verdad, y el reflejo
        # se compone después sobre la zona de la urna.
        # El canto del vidrio: es lo que delata una luna, más que el reflejo.
        # Con cantos sólo en las dos aristas delanteras la caja no cerraba y la
        # vitrina se leía como una mesa con dosel: cuatro patas, un tablero y
        # un marco flotando encima. Una urna cierra por seis aristas visibles,
        # las cuatro verticales y los dos travesaños del frente.
        zt, za = v['pie'], v['pie'] + v['alto']
        for cx in (x0, x0 + v['ancho'] - 0.012):
            for cy in (y0 - 0.002, y0 + 0.565):
                blit_quad(buf, [(cx, cy, zt), (cx + 0.012, cy, zt),
                                (cx + 0.012, cy, za), (cx, cy, za)], 'canto-v', 1.0)
        for cz in (zt, za - 0.012):
            blit_quad(buf, [(x0, y0 - 0.002, cz), (x0 + v['ancho'], y0 - 0.002, cz),
                            (x0 + v['ancho'], y0 - 0.002, cz + 0.012),
                            (x0, y0 - 0.002, cz + 0.012)], 'canto-v', 1.0)


def colocando(buf):
    """La pieza suspendida sobre su hueco.

    Sin la sombra en el estante y sin la vertical de caída, una pieza en el
    aire se lee como una pieza más apoyada en algo: en la vuelta anterior
    parecía posada sobre el marco. Las dos señales son la convención que P02 y
    P03 ya tienen, y son geometría, no color. El anillo punteado del destino
    va en la capa vectorial.
    """
    v = VITRINAS[COLOCANDO['vitrina']]
    px = v['x'] + (COLOCANDO['sitio'] - 1) * (v['ancho'] * 0.30)
    zs = v['pie'] + 0.055
    z = zs + COLOCANDO['alto']
    # la huella en el estante, desplazada hacia donde cae la luz
    blit_quad(buf, [(px - 0.14, v['y'] - 0.11, zs + 0.002), (px + 0.14, v['y'] - 0.11, zs + 0.002),
                    (px + 0.14, v['y'] + 0.11, zs + 0.002), (px - 0.14, v['y'] + 0.11, zs + 0.002)],
              'soporte', 0.30,
              alpha=lambda u, v_: ((u - 0.52) ** 2 / 0.25 + (v_ - 0.5) ** 2 / 0.25) < 0.88)
    # la vertical de caída
    blit_quad(buf, [(px - 0.004, v['y'] + 0.10, zs), (px + 0.004, v['y'] + 0.10, zs),
                    (px + 0.004, v['y'] + 0.10, z - 0.05), (px - 0.004, v['y'] + 0.10, z - 0.05)],
              'soporte', 0.55)
    _pieza(buf, COLOCANDO['material'], px, v['y'], z, 0.17, 0.115)


def focos(buf):
    """Los focos de cada vitrina, colgados del techo por su vara."""
    for v in VITRINAS:
        zc = v['pie'] + v['alto'] + 0.62
        box(buf, v['x'] - 0.014, v['y'] - 0.014, zc, 0.028, 0.028, SZ1 - zc, 'soporte')
        # el que está recogido mira al techo: se ve en que el cuerpo está
        # vuelto, no en que esté apagado de color
        recogido = v['foco'] < 0.25
        alto = 0.135 if not recogido else 0.090
        ancho = 0.185 if not recogido else 0.150
        box(buf, v['x'] - ancho / 2, v['y'] - ancho / 2, zc - alto, ancho, ancho, alto, 'laton')


# --- luz, vidrio y composición --------------------------------------------

def backdrop(W, H):
    """El aire de la sala. Es obra, no interfaz."""
    bg = np.zeros((H, W, 3), np.float32)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    r = np.sqrt(((xx - W * 0.26) / (W * 1.0)) ** 2 + ((yy - H * 0.16) / (H * 1.1)) ** 2)
    bg += np.array([0.052, 0.046, 0.038])[None, None, :] * np.clip(1.15 - r, 0, 1)[..., None]
    bg += np.array([0.012, 0.012, 0.013])[None, None, :]
    return bg


def lighting(buf):
    return e4.shade(
        buf, LUZ,
        key=np.array([1.00, 0.886, 0.692], np.float32),
        sky=np.array([0.26, 0.28, 0.33], np.float32),
        bounce=np.array([0.30, 0.23, 0.15], np.float32),
        bounce_k=np.array([0.34, 0.26, 0.17], np.float32),
        fog=np.array([0.030, 0.028, 0.026], np.float32),
        fill=(np.array([0.72, -0.42, 0.48], np.float32),
              np.array([0.28, 0.34, 0.46], np.float32), 0.30),
        fog_k=0.24, amb_k=0.22, key_k=0.58, spec_k=0.22, shadow_k=0.84)


def focos_y_vidrio(lit, buf):
    """Segunda fuente, charcos de luz, reflejo de las lunas y lama de claraboya.

    Los focos no son luz del motor: son charcos computados a partir de
    `luz_en()`, que es el mismo número del que salen la visita y la exposición.
    Así lo que se ve y lo que el juego calcula no pueden divergir.
    """
    x, y, z = buf.world[..., 0], buf.world[..., 1], buf.world[..., 2]
    out = lit.copy()

    # Charcos de foco. Y antes del charco, la atenuación: ésta es la
    # corrección de fondo de esta vuelta.
    #
    # El charco sólo **sumaba** luz, así que una vitrina con el foco recogido
    # seguía recibiendo el ambiente entero de la sala y salía casi tan clara
    # como una alumbrada. Medido: con focos 0,92 · 0,78 · 0,10 las luminancias
    # salían 0,3804 · 0,4278 · 0,3218, o sea el **orden invertido** en las dos
    # primeras y sólo un 33 % entre la más y la menos alumbrada. La lámina
    # contradecía lo que el sistema calcula, que es peor que no enseñarlo.
    #
    # Un estado que distingue «encendido» de «apagado» no se puede contar
    # sumando: hay que quitar en el apagado. El interior de cada urna se
    # atenúa con su propio foco antes de recibir su charco.
    for i, v in enumerate(VITRINAS):
        fuerza = max(luz_en(i, s) for s in range(3))
        urna = (buf.mask & (np.abs(x - v['x']) < v['ancho'] / 2)
                & (z > v['pie']) & (z < v['pie'] + v['alto'])
                & (np.abs(y - v['y']) < 0.52))
        # Dos números medidos, no elegidos a ojo.
        #
        # Uno: la sala **ya** ordena mal los estantes antes de que haya focos.
        # Sólo con el sombreado base valen 0,0674 · 0,0891 · 0,0798, o sea que
        # la vitrina del medio sale la más clara por dónde está, no por su luz.
        # Para que el foco mande, tiene que dominar esa dispersión de 0,022, y
        # para eso la atenuación va con exponente: lo apagado se apaga de
        # verdad.
        #
        # Dos: el charco se normalizaba por el **ancho de cada urna**, así que
        # una vitrina más ancha recogía más charco y el aporte salía igual en
        # las dos primeras —+0,0525 contra +0,0532— cuando sus focos son 0,99 y
        # 0,85. Un charco de foco no mide la vitrina, mide el foco: radio
        # absoluto.
        atenua = 0.06 + 0.94 * fuerza ** 1.4
        out = np.where(urna[..., None], out * atenua, out)
        d = np.sqrt(((x - v['x']) / 0.42) ** 2 + ((y - v['y']) / 0.34) ** 2)
        alto = np.clip(1.0 - np.abs(z - (v['pie'] + 0.16)) / 0.44, 0, 1)
        charco = np.clip(1.0 - d, 0, 1) ** 2.4 * alto * buf.mask
        # A 0,55 el charco era un foco de quirófano: las nueve piezas salían
        # blancas y el canto, el barro y el papel dejaban de distinguirse, que
        # es el criterio 3 del PASS. Un foco de vitrina alumbra, no borra.
        out = out + (np.array([0.96, 0.94, 0.98], np.float32)[None, None, :]
                     * (charco * fuerza * 0.90)[..., None])

    # la lama de claraboya: se ve en el aire y cae en la tarima
    s = x + z * 0.54                       # la lama, inclinada como la luz
    # La lama tenía exponente 6 sobre medio ancho de 0,80: eso no es una lama,
    # es medio suelo encendido. Una claraboya da una banda con bordes.
    en_lama = np.exp(-((s - (LAMA_X0 + LAMA_X1) / 2) / ((LAMA_X1 - LAMA_X0) / 2.6)) ** 8)
    polvo = e4.sample_grain(x * 9.0 + 2.0, z * 9.0)
    aire = en_lama * (0.30 + 0.70 * polvo) * (1.0 - buf.mask.astype(np.float32)) * 0.10
    suelo = en_lama * (np.abs(z) < 0.06) * buf.mask * 0.30
    out = out + (np.array([1.00, 0.88, 0.66], np.float32)[None, None, :]
                 * (aire + suelo)[..., None])

    # --- el vidrio, por zona de urna --------------------------------------
    # Sin luna opaca, el vidrio se cuenta con dos cosas sobre lo que hay
    # dentro: un tinte muy flojo —estar detrás de un cristal no es gratis— y un
    # reflejo largo y tendido que cruza en diagonal. El reflejo va inclinado y
    # no es igual en las tres: eso es lo que coloca cada vitrina en su
    # profundidad, igual que en P02 lo hacía el canto del cristal.
    for i, v in enumerate(VITRINAS):
        dentro = (buf.mask
                  & (np.abs(x - v['x']) < v['ancho'] / 2)
                  & (z > v['pie']) & (z < v['pie'] + v['alto'])
                  & (np.abs(y - v['y']) < 0.52))
        if not dentro.any():
            continue
        out = np.where(dentro[..., None], out * 0.93, out)
        s = x * 0.62 + z * 1.0 - (0.62 * v['x'] + v['pie'] + v['alto'] * 0.55)
        banda = np.exp(-(s / 0.20) ** 2) + 0.50 * np.exp(-((s - 0.34) / 0.075) ** 2)
        out = out + (np.array([0.78, 0.82, 0.90], np.float32)[None, None, :]
                     * (banda * dentro)[..., None] * 0.17)
    return out


def traza_visita(lit, buf):
    """La huella de la última visita, tenue, sobre la tarima.

    Va en el ráster porque es una marca en el suelo de la sala, no interfaz.
    Las paradas se dibujan como círculos de distinto tamaño —geometría, no
    tono—, que es la señal 4 del §11. El número de cada parada y la etiqueta
    de cada conjunto van en la capa vectorial.
    """
    x, y, z = buf.world[..., 0], buf.world[..., 1], buf.world[..., 2]
    suelo = buf.mask & (z < 0.03)
    marca = np.zeros_like(x)
    paradas = visita()
    # el recorrido: entra por la derecha y va de parada en parada
    puntos = [(SX1 + 0.3, 0.55)] + [(px, py) for px, py, _ in sorted(paradas, reverse=True)]
    for (ax, ay), (bx, by) in zip(puntos, puntos[1:]):
        t = np.clip(((x - ax) * (bx - ax) + (y - ay) * (by - ay))
                    / max((bx - ax) ** 2 + (by - ay) ** 2, 1e-6), 0, 1)
        d = np.sqrt((x - (ax + t * (bx - ax))) ** 2 + (y - (ay + t * (by - ay))) ** 2)
        marca = np.maximum(marca, np.clip(1.0 - d / 0.045, 0, 1))
    for px, py, peso in paradas:
        r = 0.16 + 0.26 * peso
        d = np.sqrt((x - px) ** 2 + (y - py) ** 2)
        anillo = np.clip(1.0 - np.abs(d - r) / 0.035, 0, 1)
        marca = np.maximum(marca, anillo)
    return lit + (np.array([0.52, 0.49, 0.42], np.float32)[None, None, :]
                  * (marca * suelo)[..., None] * 0.16)


def configure(out_w, out_h, top=0.0, bot=0.0, margen=0.018, rise=0.42, skew=0.26,
              ventana=None, z_rango=None):
    global OUT_W, OUT_H, TOP_OUT, BOT_OUT
    OUT_W, OUT_H = out_w, out_h
    TOP_OUT, BOT_OUT = top, bot
    W, H = out_w * SS, out_h * SS
    x0, x1 = ventana if ventana else (SX0 - 0.10, SX1 + 0.10)
    z_lo, z_hi = z_rango or (0.0, 2.62)
    u_alto = H * (1 - 2 * margen) / ((z_hi - z_lo) + (SY1 - SY0) * rise)
    u_ancho = W * (1 - 2 * margen) / ((x1 - x0) + (SY1 - SY0) * skew)
    u = min(u_alto, u_ancho)
    ox = W * margen - x0 * u
    pie = H - bot * SS
    oy = pie + z_lo * u
    e4.setup(e4.Frontal(u, ox, oy, depth_rise=rise, skew=skew), MATS, out_w, out_h,
             ss=SS, coursing=COURSING, features=FEATURES, top=top, bot=bot)


def escena_y_buffers():
    """La escena y sus búferes. El test mide sobre estos mismos píxeles."""
    buf = e4.Buffers()
    sala(buf)
    focos(buf)
    vitrinas(buf)
    colocando(buf)
    lit = traza_visita(focos_y_vidrio(lighting(buf), buf), buf)
    img = e4.compose(lit, buf, backdrop, exposure=1.50,
                      vignette=(1.18, 0.64, 1.45), contraste=0.22, pivote=0.42)
    return img, buf


def render_escena():
    return escena_y_buffers()[0]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', type=Path, default=REPO / 'editorial/r62/p06-mi-museo')
    ap.add_argument('--rapido', action='store_true')
    args = ap.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    global SS
    if args.rapido:
        SS = 1
    e4.set_textures(e4.fbm_tile(octaves=6, gain=0.55, lowest=24, seed=29),
                    e4.fbm_tile(octaves=6, gain=0.60, lowest=42, seed=67))
    e4.set_theme('navy')
    configure(1180, 900, 104, 120)
    img = render_escena()
    Image.fromarray((img * 255 + 0.5).astype(np.uint8)).resize(
        (OUT_W, OUT_H), Image.LANCZOS).save(args.out / 'sala-trabajo.png')
    print(f'Escrito {args.out}/sala-trabajo.png')
    for i, v in enumerate(VITRINAS):
        rasgo, comunes = lectura(i)
        print(f'  vitrina {i}: luz {max(luz_en(i, s) for s in range(3)):.2f} · '
              f'lectura {rasgo or "sin rasgo común"} · comparte {comunes}')
    print('  paradas de la visita: ' + ', '.join(f'x={p:.2f} peso={w:.2f}'
                                                 for p, _, w in visita()))


if __name__ == '__main__':
    main()
