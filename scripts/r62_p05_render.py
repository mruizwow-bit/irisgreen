#!/usr/bin/env python3
"""R62 · P05 · Pesca tranquila · lámina de concepto.

`R62_P05_PESCA_CONCEPT_READY_FOR_ASTRA_AURA_MARIA`. Sobre el motor
`ig_render_e4.py`, que queda como está: P05 no lo toca y
`test_e4_motor_identico.py` sigue devolviendo las cuatro láminas de P01
idénticas byte a byte.

## La vista, y por qué ésta

La lámina es un **plano partido**: la cámara está medio sumergida, con la línea
del agua cruzando el encuadre. Arriba, aire de atardecer; abajo, la columna de
agua entera. Es una vista real —la de una cámara a ras de la lámina— y no una
sección imposible: el agua no se ve «por un cristal», se ve porque el punto de
vista está dentro de ella.

Eso lo decide la cámara, y aquí está el número que lo hace: `rise = 0.10`. Con
el `rise` de P02 —0,46— un plano horizontal como la superficie del agua se
abre en pantalla y ocupa un tercio de la lámina: deja de ser una línea y pasa a
ser un suelo visto desde arriba. Con 0,10 la superficie proyecta una banda de
unos 60 px, que es justo el menisco borroso que tiene un plano partido de
verdad. Bajarlo a 0 no vale: el plano horizontal colapsaría a una recta y el
agua perdería el poco escorzo que coloca cada cosa en su profundidad.

`skew = 0.22` por la lección de P03: sin sesgo lateral, cualquier plano de x
constante proyecta sobre una recta. Aquí eso dejaría invisibles el canto de la
tabla del embarcadero y el costado de la orilla del juncal.

## Qué está modelado y qué está dibujado

Modelado: el fondo punto a punto, la corriente desigual con su remanso detrás
de la rama, la caída de luz con la profundidad, el salto de temperatura a
0,85 m bajo la superficie, y la cota a la que queda el cebo según el nudo.
De ahí sale **qué animal se acerca**, que no está colocado a mano.

Dibujado: el polvo en suspensión, las hojas de luz, el reflejo de la cara
interior de la superficie y la ondulación. Responden al estado, no lo calculan.
El reparto está escrito en `CONCEPTO.md`, apartado «Qué simula el sistema».

Uso:  python3 scripts/r62_p05_render.py [--rapido]
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

# --- la orilla, en unidades de mundo (metros) ------------------------------
X0, X1 = 0.00, 3.20              # la ventana de la cámara, a lo largo de la orilla
Y0, Y1 = 0.00, 2.90              # hacia dentro
# La geometría se dibuja MÁS ANCHA que la ventana. Con el sesgo lateral, lo que
# se aleja se desplaza en pantalla, así que un lecho dibujado justo de X0 a X1
# deja un triángulo de vacío en el borde izquierdo y una franja debajo: en la
# primera lámina el agua tenía un canto recto y se leía como un recorte pegado
# sobre el fondo. El encuadre recorta; la geometría tiene que sobrar.
GX0, GX1 = -1.10, 4.30
GY0, GY1 = -0.85, 2.90
AGUA = 1.50                      # cota de la lámina de agua
TERMOCLINA = AGUA - 0.85         # el salto de temperatura, a 0,85 m de hondo

ORILLA_X = 0.56                  # hasta aquí llega el banco del juncal
BANCO_LEJOS = 1.86               # cota del borde de la orilla de enfrente

# El aparejo. La cota del cebo NO se escribe: sale del nudo, que es lo que la
# persona mueve. Esto es el estado que la lámina principal enseña.
LINEA_X, LINEA_Y = 1.96, 0.72    # dónde cae la línea
NUDO = 0.40                      # cuánta línea hay entre la boya y el cebo
Z_CEBO = AGUA - NUDO

# Un claro de limo donde se vea al animal de fondo. Medido: estaba colocado en
# plena pedrera —de su entorno, 449 px eran piedra, 318 banco y 302 rama, y
# sólo 22 limo— así que su silueta oscura caía contra cosas oscuras y daba
# 0,0056 de contraste. No era un problema de color: era que no había fondo
# claro detrás. Donde hace falta que algo se lea, se le hace sitio.
CLARO = (1.30, 0.56, 0.54)       # centro y radio del claro de limo

# La rama hundida: de dónde a dónde, para que el remanso y la sombra salgan de
# ella y no de una zona pintada.
RAMA_A = np.array([1.34, 1.72, 0.74])
RAMA_B = np.array([2.46, 0.92, 1.06])

MATS = {
    # --- fuera del agua ---
    'cielo-lejos': ((0.330, 0.300, 0.250), 0.98, 0.30, 0.70),
    'banco':       ((0.150, 0.124, 0.090), 0.94, 1.15, 1.35),
    'tabla':       ((0.168, 0.112, 0.070), 0.74, 1.25, 1.05),
    # Los juncos entran en el agua **entre las piedras** del banco, y ahí los
    # dos eran la misma mancha oscura: 0,0171 contra un mínimo de 0,030. Éste
    # sí es un par que se toca de verdad, así que hay que separarlo. El tallo
    # sube de valor: contra el cielo sigue leyéndose a contraluz, y bajo el
    # agua se despega del canto.
    'junco':       ((0.034, 0.036, 0.019), 0.86, 0.60, 2.10),
    'corcho':      ((0.420, 0.180, 0.098), 0.52, 0.80, 2.60),
    # --- dentro del agua ---
    # Rugosidad alta en todo lo sumergido. Lección de P03 y P04: el especular
    # de este motor no va multiplicado por el albedo, así que con rugosidad
    # media todo lo que mira a la luz se va a un velo gris y el limo, la
    # piedra y el alga dejan de distinguirse. Lo que separa materiales aquí es
    # la rugosidad y la escala de textura, no el color.
    # Medido: con (0,148·0,130·0,092) contra (0,112·0,118·0,106) el limo y la
    # piedra quedaban a 0,005 de distancia en la lámina compuesta, o sea la
    # misma cosa. El agua se come el rojo, así que separarlos por tono no
    # sirve: hay que separarlos por **valor**. El limo es un fondo de arena
    # claro y la piedra es canto oscuro, que además es lo que hace creíble el
    # rebote del limo del §7 del concepto.
    # --- paleta sumergida, repartida de una vez y no a ojo ----------------
    #
    # Llevaba tres vueltas empujando albedos de dos en dos: separaba un par y
    # se juntaba otro. La calibración dice por qué. Midiendo cada material con
    # su albedo y con su albedo × 1,7 sale una recta, mostrado = a·albedo + b,
    # y **el término b manda**:
    #
    #     material        a       b      suelo que no puede bajar
    #     limo          0,249   0,0900           0,090
    #     piedra        0,259   0,0884           0,088
    #     madera-hund   0,172   0,1832           0,183
    #     herbazal      0,138   0,1025           0,103
    #     junco         0,274   0,0844           0,084
    #
    # `b` es lo que no depende del albedo: el especular de este motor —que no
    # va multiplicado por el color, la vieja lección de P03 y P04— más lo que
    # el agua añade por dispersión. La madera hundida tiene el suelo en 0,183:
    # **no puede ser oscura**, por mucho que le baje el albedo. Por eso cada
    # vez que la oscurecía salía clara y yo le echaba la culpa al color.
    #
    # Con el suelo ya bajo —`spec_k` a 0,07 y el alga tiñendo en vez de
    # sustituir— las rectas vuelven a tener pendiente y el reparto sale con
    # colores de este sitio y no de catálogo. Cinco valores a 0,033, que es más
    # que el mínimo de 0,030 del test, ordenados por su propio suelo:
    #
    #     junco 0,068 · piedra 0,101 · herbazal 0,134 · limo 0,167 · madera 0,200
    #
    # El primer intento repartió esta misma banda **sin** bajar el suelo. El
    # test pasó y la lámina empeoró: limo casi blanco, hierba de menta, madera
    # pálida. Compensar un suelo alto obliga a colores que no son de aquí; lo
    # que había que hacer era quitarlo.
    'limo':        ((0.403, 0.350, 0.255), 0.96, 1.05, 0.95),
    'piedra':      ((0.092, 0.099, 0.096), 0.86, 1.55, 2.30),
    'madera-hund': ((0.212, 0.166, 0.123), 0.86, 1.40, 1.70),
    # Medido: el herbazal y la piedra quedaban a 0,0089. Bajo el agua todo
    # converge —la absorción se come el rojo y aplana el contraste—, así que
    # lo sumergido tiene que separarse por valor con más margen del que haría
    # falta al aire. La hierba es clara y verde; el canto, oscuro y gris.
    # El limo es lo más claro del fondo, así que la hierba no puede quedarse
    # justo debajo de él: medidos a la misma profundidad daban 0,1392 y 0,1382,
    # la misma cosa. Sube **por encima** del limo, que es el único hueco libre
    # de la banda: la piedra ocupa el extremo oscuro y la madera el medio.
    # Canal a canal: la hierba y el limo salían (0,1125 0,1689 0,1312) y
    # (0,1492 0,1532 0,1319). Se cancelaban —la hierba más oscura en rojo, más
    # clara en verde, idéntica en azul— y por eso moverlas «en direcciones
    # contrarias» no separaba nada: la distancia es la media de los tres, y
    # subir el verde mientras subía el rojo dejaba la suma igual. Para separar
    # dos materiales hay que moverlos en los **tres** canales a la vez. La
    # hierba baja entera: oliva oscura contra arena clara.
    'herbazal':    ((0.186, 0.406, 0.257), 0.82, 0.70, 2.40),
    # Los tres animales salían dibujados y no se veían: 0,0061 y 0,0084 de
    # contraste con su entorno. Estaban en la misma banda de valor que el agua
    # y que el limo. Bajo el agua un pez se ve como **silueta**, no como color:
    # oscuros los tres, que es además lo que se ve de verdad mirando dentro.
    'pez-fondo':   ((0.038, 0.036, 0.032), 0.78, 0.55, 2.00),
    'pez-juncal':  ((0.046, 0.050, 0.040), 0.74, 0.55, 2.60),
    'pez-super':   ((0.042, 0.044, 0.038), 0.70, 0.50, 3.00),
    'plomo':       ((0.085, 0.086, 0.090), 0.42, 0.60, 2.20),
    'cebo':        ((0.230, 0.180, 0.120), 0.80, 0.70, 3.40),
    'sedal':       ((0.260, 0.250, 0.225), 0.55, 0.40, 1.00),
}

COURSING = {}
FEATURES = {
    'banco': {'estratos', 'humedad'},
    'limo': {'estratos'},
    'tabla': {'sin-canto'},
}

# Sol bajo por la izquierda. La componente vertical es pequeña a propósito: es
# luz de atardecer, y de ahí sale que el juncal quede a contraluz.
LUZ = np.array([-0.800, -0.262, 0.540], np.float32)
LUZ /= np.linalg.norm(LUZ)


def _ruido(a, b):
    """Muestreo de textura que también acepta escalares.

    `map_coordinates` exige rango > 0, así que un `borde(0.0)` con un float
    pelado reventaba. Se promueve a 1-D y se devuelve con la forma de entrada.
    """
    a, b = np.broadcast_arrays(np.asarray(a, np.float32), np.asarray(b, np.float32))
    forma = a.shape
    r = e4.sample_tex(np.atleast_1d(a), np.atleast_1d(b))
    return r.reshape(forma)


# --- el fondo: modelado, porque de él cuelga la mecánica -------------------

def fondo(x, y):
    """Cota del fondo. Es la que decide la profundidad en cada punto."""
    x = np.asarray(x, np.float32)
    y = np.asarray(y, np.float32)
    # Pendiente general: más hondo hacia la derecha y hacia dentro.
    z = 1.30 - 0.175 * x - 0.145 * y
    # El banco del juncal: sube y sale del agua por la izquierda.
    sube = np.clip((ORILLA_X - x) / 0.42, 0.0, 1.0) ** 1.4
    z = z + sube * 0.62
    # Una hoya: el sitio donde el de fondo está a gusto.
    d = np.sqrt(((x - 1.92) / 0.68) ** 2 + ((y - 1.58) / 0.80) ** 2)
    z = z - 0.19 * np.clip(1.0 - d, 0.0, 1.0) ** 1.6
    # Relieve: dos escalas. Sin la fina, el limo sale liso y se lee como papel.
    z = z + (_ruido(x * 0.70, y * 0.70) - 0.5) * 0.085
    z = z + (_ruido(x * 3.10 + 11.0, y * 3.10) - 0.5) * 0.028
    return z


def profundidad(x, y):
    """Cuánta agua hay encima de ese punto del fondo."""
    return np.clip(AGUA - fondo(x, y), 0.0, None)


def corriente(x, y):
    """Velocidad de la corriente. No es uniforme: eso es media mecánica.

    Viva en el centro del cauce, remansada en el juncal y **detrás de la
    rama**. El remanso de la rama no está pintado: sale de la distancia al
    segmento de la rama, que es el mismo segmento que proyecta la sombra. Así
    la zona de cobijo y la zona de agua quieta coinciden en la lámina, y eso se
    ve sin tener que explicarlo.
    """
    x = np.asarray(x, np.float32)
    y = np.asarray(y, np.float32)
    v = np.clip((x - ORILLA_X) / 1.10, 0.0, 1.0) ** 0.8      # el juncal remansa
    v = v * (0.55 + 0.45 * np.clip(profundidad(x, y) / 0.95, 0, 1))
    # abrigo de la rama
    ab = RAMA_B - RAMA_A
    t = np.clip(((x - RAMA_A[0]) * ab[0] + (y - RAMA_A[1]) * ab[1])
                / float(ab[0] ** 2 + ab[1] ** 2), 0.0, 1.0)
    dx = x - (RAMA_A[0] + t * ab[0])
    dy = y - (RAMA_A[1] + t * ab[1])
    d = np.sqrt(dx * dx + dy * dy)
    v = v * (0.30 + 0.70 * np.clip(d / 0.34, 0.0, 1.0))
    return v


def cobijo(x, y):
    """1 donde hay algo encima o al lado que da abrigo."""
    ab = RAMA_B - RAMA_A
    t = np.clip(((x - RAMA_A[0]) * ab[0] + (y - RAMA_A[1]) * ab[1])
                / float(ab[0] ** 2 + ab[1] ** 2), 0.0, 1.0)
    d = np.sqrt((x - (RAMA_A[0] + t * ab[0])) ** 2 + (y - (RAMA_A[1] + t * ab[1])) ** 2)
    c = np.clip(1.0 - d / 0.40, 0.0, 1.0)
    c = np.maximum(c, np.clip((ORILLA_X + 0.30 - x) / 0.40, 0.0, 1.0))   # juncal
    c = np.maximum(c, np.clip((x - 2.52) / 0.40, 0.0, 1.0)
                   * np.clip((y - 0.60) / 0.50, 0.0, 1.0))               # herbazal
    return np.clip(c, 0.0, 1.0)


def luz_a(z):
    """Luz que llega a una cota. Cae con la profundidad; no es un adorno."""
    return float(np.exp(-max(AGUA - z, 0.0) * 1.35))


def quien_viene():
    """Qué animal se acerca al cebo. Calculado, no colocado.

    Tres reglas escritas —banda de profundidad, cobijo y agua templada— contra
    lo que de verdad hay en el punto del cebo. El que mejor encaja es el que
    sube. Si ninguno pasa de 0,45 no viene nadie, y eso también es un
    resultado: el agua ya ha dicho por qué.
    """
    hondo = AGUA - Z_CEBO
    c = float(cobijo(LINEA_X, LINEA_Y))
    templada = 1.0 if Z_CEBO > TERMOCLINA else 0.0
    reglas = {
        # nombre        banda de hondura   quiere cobijo  quiere templada
        'pez-super':   ((0.00, 0.45),      0.10,          1.0),
        'pez-juncal':  ((0.25, 0.95),      0.80,          0.5),
        'pez-fondo':   ((0.70, 1.40),      0.55,          0.0),
    }
    marcas = {}
    for nombre, ((lo, hi), quiere_c, quiere_t) in reglas.items():
        dentro = 1.0 if lo <= hondo <= hi else max(0.0, 1.0 - min(abs(hondo - lo), abs(hondo - hi)) / 0.35)
        marcas[nombre] = (0.55 * dentro
                          + 0.25 * (1.0 - abs(c - quiere_c))
                          + 0.20 * (1.0 - abs(templada - quiere_t)))
    mejor = max(marcas, key=marcas.get)
    return (mejor if marcas[mejor] >= 0.45 else None), marcas


# --- geometría -------------------------------------------------------------

def orilla_lejana(buf):
    """La orilla de enfrente: un paramento de tierra al fondo del cauce.

    Es un plano de y constante, que con esta cámara sí se ve. Lo que lo salva
    de ser una banda plana es que su borde superior ondula y que lleva humedad
    subiendo desde la línea del agua.
    """
    def borde(u):
        return BANCO_LEJOS + 0.085 * (_ruido(np.asarray(u) * 3.4, np.full_like(np.asarray(u), 2.0)) - 0.5)

    blit_quad(buf, [(GX0, Y1, 0.10), (GX1, Y1, 0.10), (GX1, Y1, 2.30), (GX0, Y1, 2.30)],
              'banco', 0.88,
              alpha=lambda u, v: (0.10 + v * 2.20) < borde(u),
              modula=lambda u, v: 0.80 + 0.34 * e4.sample_tex(u * GX1 * 1.4, (0.10 + v * 2.20) * 2.2))
    # Aquí había un cuadrilátero de «cielo» tapando por detrás. Era un
    # rectángulo gris con las esquinas vivas y se leía como lo que era: un
    # recorte. El cielo lo pone el vacío de `backdrop`, que es obra, y el
    # paramento se pierde por bruma de atmósfera, no por un parche encima.


def lecho(buf):
    """El fondo, marchando en profundidad. Lleva las marcas de ondulación."""
    def modula(x, y, z):
        # Rizos del limo: se borran donde hay piedras y donde la corriente
        # es viva, que es exactamente lo que pasa en un fondo de verdad.
        rizo = 0.5 + 0.5 * np.sin((x * 7.4 + y * 2.1) * 2.1
                                  + 2.6 * _ruido(x * 0.9, y * 0.9))
        fuerza = 0.22 * np.clip(1.0 - corriente(x, y) / 0.85, 0.0, 1.0)
        return (0.88 + fuerza * rizo) * (0.84 + 0.30 * _ruido(x * 2.2 + 5.0, y * 2.2))

    e4.blit_heightfield(buf, 'limo', fondo, GX0, GX1, GY0, GY1, steps=180,
                        tex_scale=0.95, bump_scale=1.25)
    # El modulado del heightfield no entra por parámetro, así que las marcas se
    # aplican sobre el albedo ya rasterizado, en los píxeles del lecho.
    sel = buf.matid == e4.MAT_IDS['limo']
    if sel.any():
        x, y, z = buf.world[..., 0], buf.world[..., 1], buf.world[..., 2]
        m = modula(x, y, z)
        buf.albedo[sel] *= m[sel][..., None]


def juncal(buf):
    """Juncos: cruzan la línea del agua, y eso es lo que la hace creíble.

    Un junco que entra en el agua y sigue por debajo con su parte sumergida más
    apagada dice «esto es una superficie» mejor que cualquier reflejo.
    """
    rng = np.random.default_rng(12)
    for i in range(44):
        x = GX0 + 0.20 + rng.random() * (ORILLA_X + 0.16 - GX0)
        y = GY0 + 0.30 + rng.random() * 2.50
        base = fondo(np.array(x), np.array(y)).item()
        alto = 0.52 + rng.random() * 0.86
        incl = (rng.random() - 0.5) * 0.30
        ancho = 0.012 + rng.random() * 0.010
        blit_quad(buf, [(x, y, base), (x + ancho, y, base),
                        (x + ancho + incl * 0.5, y, base + alto), (x + incl * 0.5, y, base + alto)],
                  'junco', 0.80 + 0.35 * rng.random(),
                  alpha=lambda u, v: v < 1.0 - 0.22 * u)


def banco_juncal(buf):
    """El banco de la izquierda ya sale de `fondo()`, que lo levanta por encima
    del agua. Aquí había además cuatro cajas de tierra, y en la lámina se leían
    como cajas: cantos rectos, aristas vivas y una sombra que no era la del
    terreno. Un banco de tierra no es un prisma. Queda sólo el terreno.
    """
    return


def rama(buf):
    """La rama hundida, con las algas **por tramos**.

    Aquí había dos materiales alternándose, `madera-hund` y `alga`, y eso era
    un error de diseño con consecuencia medible: bajo el agua la absorción
    estrecha la banda de valores disponible, y meter cinco materiales en ella
    hacía que separar un par juntara otro. El concepto no pide dos materiales:
    pide que las algas **cubran por tramos**. Así que la rama es madera, y el
    alga es una modulación de cobertura sobre ella —más clara y más verde donde
    cubre—. Un material menos compitiendo, y más fiel a lo que está escrito.
    """
    ab = RAMA_B - RAMA_A
    pasos = 14
    for i in range(pasos):
        t0 = i / pasos
        p0 = RAMA_A + ab * t0
        grueso = 0.085 * (1.0 - 0.45 * t0)
        # cobertura de alga: ruido a lo largo del eje, con tramos pelados
        cub = float(np.clip((_ruido(np.array(t0 * 4.2), np.array(1.3)) - 0.42) * 2.6, 0.0, 1.0))
        box(buf, p0[0], p0[1], p0[2], ab[0] / pasos + grueso, grueso, grueso,
            'madera-hund', )
    # dos muñones, para que no sea un tubo
    m = RAMA_A + ab * 0.42
    box(buf, m[0], m[1] - 0.18, m[2], 0.055, 0.30, 0.055, 'madera-hund')
    m = RAMA_A + ab * 0.72
    box(buf, m[0], m[1], m[2], 0.050, 0.055, 0.26, 'madera-hund')
    # El alga, encima, como cobertura sobre los píxeles de la rama.
    sel = buf.matid == e4.MAT_IDS['madera-hund']
    if sel.any():
        x, y = buf.world[..., 0], buf.world[..., 1]
        ab2 = float(ab[0] ** 2 + ab[1] ** 2)
        tt = np.clip(((x - RAMA_A[0]) * ab[0] + (y - RAMA_A[1]) * ab[1]) / ab2, 0.0, 1.0)
        cub = np.clip((_ruido(tt * 4.2, np.full_like(tt, 1.3)) - 0.42) * 2.6, 0.0, 1.0)
        cub = cub * (0.45 + 0.55 * e4.sample_grain(x * 9.0, y * 9.0))
        verde = np.array([0.070, 0.150, 0.072], np.float32)
        buf.albedo[sel] = (buf.albedo[sel] * (1.0 - cub[sel])[..., None]
                           + verde[None, :] * cub[sel][..., None])


def piedras(buf):
    """Piedras sobre el limo, de gruesas en la orilla a finas al fondo.

    El tamaño graduado con la profundidad es lo que coloca el fondo en el
    espacio sin tener que escalar nada a mano. Cada piedra lleva su propio
    desgaste por un hash de su índice: si el desgaste fuera igual en todas, se
    leería como patrón y no como uso.
    """
    rng = np.random.default_rng(5)
    for i in range(96):
        x = GX0 + 0.12 + rng.random() * (GX1 - GX0 - 0.24)
        y = GY0 + 0.14 + rng.random() * (GY1 - GY0 - 0.30)
        if x < ORILLA_X - 0.05:
            continue
        if (x - CLARO[0]) ** 2 + (y - CLARO[1]) ** 2 < CLARO[2] ** 2:
            continue                      # el claro se queda limpio
        z = fondo(np.array(x), np.array(y)).item()
        # de grueso a fino con la profundidad
        r = (0.105 - 0.055 * np.clip((y - Y0) / (Y1 - Y0), 0, 1)) * (0.55 + rng.random() * 0.9)
        desgaste = 0.5 + 0.5 * np.sin(i * 2.399 + 1.7)      # hash del índice
        blit_quad(buf, [(x - r, y, z - r * 0.25), (x + r, y, z - r * 0.25),
                        (x + r, y, z + r * 1.35), (x - r, y, z + r * 1.35)],
                  'piedra', 0.74 + 0.40 * rng.random(),
                  alpha=lambda u, v, d=desgaste: ((u - 0.5) ** 2 / 0.25
                                                  + (v - 0.42) ** 2 / 0.30) < (0.92 + 0.22 * d),
                  modula=lambda u, v, d=desgaste: 0.80 + 0.34 * d * e4.sample_grain(u * 7.0, v * 7.0))


def herbazal(buf):
    """Herbazal sumergido a la derecha: cobijo de verdad, no zona pintada."""
    rng = np.random.default_rng(31)
    for i in range(46):
        x = 2.46 + rng.random() * (GX1 - 2.46)
        y = 0.20 + rng.random() * 2.30
        z = fondo(np.array(x), np.array(y)).item()
        alto = 0.26 + rng.random() * 0.46
        curva = (rng.random() - 0.5) * 0.26
        ancho = 0.016 + rng.random() * 0.013
        blit_quad(buf, [(x, y, z), (x + ancho, y, z),
                        (x + ancho + curva, y, z + alto), (x + curva, y, z + alto)],
                  'herbazal', 0.78 + 0.40 * rng.random(),
                  alpha=lambda u, v: v < 1.0 - 0.30 * u)


def primer_plano(buf):
    """Lo que está casi encima del objetivo: piedras grandes y briznas.

    Sin esto el tercio de abajo de la lámina era agua azul y vacía: una
    superficie grande resuelta con color plano, que es el criterio 3 de la
    referencia y era un «no». El primer plano lo arregla por dos vías a la vez:
    pone materia donde no había, y como está a un palmo del ojo apenas lleva
    agua delante, así que sale oscuro y nítido contra el fondo lavado. Esa
    diferencia es la que da la profundidad, no un degradado.
    """
    rng = np.random.default_rng(77)
    # piedras grandes, cortadas por el marco de abajo
    # Radios de 0,46 a 0,52 fue el primer intento y salieron tres pedruscos
    # del tamaño de la lámina, uno de ellos cruzando la línea del agua: en vez
    # de primer plano, tres parches. Un canto de orilla mide un palmo.
    for x, y, r in ((0.52, -0.52, 0.185), (1.44, -0.62, 0.225), (2.74, -0.48, 0.165),
                    (2.18, -0.70, 0.205), (0.98, -0.44, 0.150)):
        z = fondo(np.array(x), np.array(y)).item()
        blit_quad(buf, [(x - r, y, z - r * 0.5), (x + r, y, z - r * 0.5),
                        (x + r, y, z + r * 1.1), (x - r, y, z + r * 1.1)],
                  'piedra', 0.46,
                  alpha=lambda u, v: ((u - 0.5) ** 2 / 0.26 + (v - 0.40) ** 2 / 0.26) < 0.95,
                  modula=lambda u, v: 0.74 + 0.42 * e4.sample_grain(u * 4.0, v * 4.0))
    # briznas de herbazal muy cerca, entrando por los bordes
    for i in range(11):
        x = GX0 + 0.3 + rng.random() * (GX1 - GX0 - 0.6)
        y = -0.75 + rng.random() * 0.50
        z = fondo(np.array(x), np.array(y)).item()
        alto = 0.40 + rng.random() * 0.62
        curva = (rng.random() - 0.5) * 0.42
        ancho = 0.022 + rng.random() * 0.018
        blit_quad(buf, [(x, y, z), (x + ancho, y, z),
                        (x + ancho + curva, y, z + alto), (x + curva, y, z + alto)],
                  'herbazal', 0.52 + 0.22 * rng.random(),
                  alpha=lambda u, v: v < 1.0 - 0.34 * u)


def aparejo(buf):
    """Tabla, sedal, boya, nudo, plomo y cebo.

    La profundidad del cebo se lee en la **geometría**: boya arriba, plomo
    abajo, y el tramo de sedal entre los dos. Es la señal del §11 que no
    depende del color.

    El anillo punteado del destino y la marca de cota NO van aquí: son
    interfaz y van en la capa vectorial, como se decidió en P03 cuando pintar
    las afordancias en el ráster llenó la lámina de 35 puntos negros.
    """
    # la tabla del embarcadero, cortada por el marco, arriba a la derecha
    box(buf, 2.42, 0.10, AGUA + 0.26, 1.00, 0.40, 0.070, 'tabla')
    box(buf, 2.56, 0.16, AGUA + 0.02, 0.080, 0.080, 0.24, 'tabla')   # pata

    # El sedal, la boya, el nudo, el plomo y el cebo. En la vuelta anterior
    # todo esto medía centímetros y a 297 px/m se quedaba en dos o tres
    # píxeles: el criterio 3 del PASS —ver a qué profundidad está el cebo por
    # la geometría— no se podía ni intentar. Las piezas de un juguete no son
    # del tamaño de las de verdad; son del tamaño en que se ven.
    hilo = 0.016
    blit_quad(buf, [(LINEA_X, LINEA_Y, Z_CEBO), (LINEA_X + hilo, LINEA_Y, Z_CEBO),
                    (LINEA_X + hilo, LINEA_Y, AGUA + 0.18), (LINEA_X, LINEA_Y, AGUA + 0.18)],
              'sedal', 1.0)
    # la boya: cuerpo de corcho y caperuza, fuera del agua. Es el único punto
    # cálido de la mitad de arriba y por eso se encuentra sola.
    # La boya baja con el sedal: el tramo seco medía 0,42 contra 0,40 del
    # sumergido, así que la lámina daba dos señales de cota a la vez y la que
    # importa —la de debajo del agua— perdía. Ahora el tramo seco es 0,18.
    box(buf, LINEA_X - 0.060, LINEA_Y - 0.060, AGUA - 0.06, 0.120, 0.120, 0.165, 'corcho')
    # el nudo: el objeto que la persona mueve, agarrado al sedal
    box(buf, LINEA_X - 0.034, LINEA_Y - 0.034, AGUA + 0.005, 0.068, 0.068, 0.050, 'plomo')
    # plomo y cebo, a la cota que el nudo manda
    box(buf, LINEA_X - 0.030, LINEA_Y - 0.030, Z_CEBO + 0.06, 0.060, 0.060, 0.080, 'plomo')
    blit_quad(buf, [(LINEA_X - 0.058, LINEA_Y, Z_CEBO - 0.060), (LINEA_X + 0.058, LINEA_Y, Z_CEBO - 0.060),
                    (LINEA_X + 0.058, LINEA_Y, Z_CEBO + 0.060), (LINEA_X - 0.058, LINEA_Y, Z_CEBO + 0.060)],
              'cebo', 1.0,
              alpha=lambda u, v: ((u - 0.5) ** 2 / 0.25 + (v - 0.5) ** 2 / 0.22) < 0.95)


def _perfil_pez(u, v, cola=0.86, panza=1.0):
    """Silueta de pez: cuerpo fusiforme y cola en abanico.

    Es una función sobre (u, v), no geometría teselada: el mismo recurso con el
    que P02 recorta una hoja. Cada animal cambia su perfil, y por eso se
    distinguen en gris, que es lo que pide el §11.
    """
    u = np.asarray(u); v = np.asarray(v)
    # Con 0,42 de media altura el cuerpo ocupaba el 84 % del alto y salía un
    # zepelín gris. Un pez es largo y delgado, con el vientre más bajo que el
    # lomo y la cola ahorquillada: tres rasgos, y los tres son forma.
    cuerpo = np.sin(np.clip(u / cola, 0, 1) * np.pi) ** 0.55 * 0.28 * panza
    lomo = 0.5 - 0.035 * np.sin(np.clip(u / cola, 0, 1) * np.pi)   # el eje baja
    abanico = np.clip((u - cola) / (1.0 - cola), 0, 1) * 0.34
    horquilla = np.clip((u - cola) / (1.0 - cola), 0, 1) ** 2 * 0.22
    dentro = np.where(u <= cola,
                      np.abs(v - lomo) < cuerpo,
                      (np.abs(v - 0.5) < abanico + 0.022) & (np.abs(v - 0.5) > horquilla * (u > 0.93)))
    return dentro


def _sitio_en_agua(x, y, sobre_el_fondo=None, bajo_la_lamina=None):
    """Dónde cae una cosa que vive en el agua, **referida a lo que hay debajo**.

    Aquí estaba uno de los errores de bulto de la primera vuelta. Coloqué al
    rayado del juncal en `AGUA − 0.46` razonando «medio metro bajo la
    superficie, eso es media agua». En ese punto el fondo está a 1,05 y la cota
    salía 1,04: el animal quedó **enterrado en el limo**, y de los tres sólo
    ocupaba 8 píxeles en la lámina.

    La lección no es ese número, es la regla: una cota absoluta no dice nada
    sobre un fondo que cambia punto a punto. Lo que vive en el agua se coloca
    respecto al fondo o respecto a la lámina, nunca respecto al origen, y se
    comprueba que de verdad queda agua por los dos lados.
    """
    suelo = float(fondo(np.array(x), np.array(y)))
    if sobre_el_fondo is not None:
        z = suelo + sobre_el_fondo
    else:
        z = AGUA - bajo_la_lamina
    hueco = AGUA - suelo
    if hueco < 0.10:
        raise ValueError(f'en ({x:.2f}, {y:.2f}) sólo hay {hueco:.2f} m de agua: '
                         f'ahí no cabe nada')
    return float(np.clip(z, suelo + 0.05, AGUA - 0.05))


def peces(buf):
    """Los tres animales, cada uno en su banda y con su trazo.

    Quién está *junto al cebo* lo decide `quien_viene()`. Los otros siguen en
    su sitio: el de superficie bajo la lámina, el rayado en el agua quieta del
    juncal, el de fondo sobre el limo de la hoya.

    Los tres están ahora a un tamaño que se ve. En la primera vuelta medían
    0,30 de largo y a 297 px/m daban siluetas de 90 px de ancho y 30 de alto,
    que con el agua delante no llegaban a leerse.
    """
    viene, _ = quien_viene()

    def pez(nombre, x, y, z, largo, alto, rayas=0, vuelto=False):
        dx = -largo if vuelto else largo
        blit_quad(buf, [(x, y, z - alto / 2), (x + dx, y, z - alto / 2),
                        (x + dx, y, z + alto / 2), (x, y, z + alto / 2)],
                  nombre, 1.0,
                  alpha=lambda u, v: _perfil_pez(u, v),
                  modula=(lambda u, v: 0.66 + 0.58 * (0.5 + 0.5 * np.cos(u * rayas * np.pi * 2))) if rayas
                  else (lambda u, v: 0.74 + 0.46 * e4.sample_grain(u * 9.0, v * 9.0)))

    # el rayado del juncal: barras verticales, en el agua quieta del remanso.
    # Fuera del banco, que es donde hay agua de verdad.
    x, y = ORILLA_X + 0.42, 0.74
    pez('pez-juncal', x, y, _sitio_en_agua(x, y, sobre_el_fondo=0.30), 0.46, 0.175, rayas=6)
    # los de superficie: finos, en pareja, justo bajo la lámina
    x, y = 1.18, 0.40
    pez('pez-super', x, y, _sitio_en_agua(x, y, bajo_la_lamina=0.13), 0.36, 0.106)
    x, y = 1.50, 0.58
    pez('pez-super', x, y, _sitio_en_agua(x, y, bajo_la_lamina=0.20), 0.31, 0.094, vuelto=True)
    # El de fondo: ancho y sin marcas. Lo despegué del limo pensando que su
    # silueta se recortaría contra el agua, y el contraste **bajó** de 0,0084 a
    # 0,0016: a esa profundidad el agua ya está oscura, así que un animal
    # oscuro sobre agua oscura desaparece. Contra lo que se recorta bien es
    # contra el limo, que es lo más claro de la lámina. Vuelve a ras de fondo.
    # Y a 1,38 de profundidad el limo tampoco sirve de fondo claro: a esa
    # distancia ya está absorbido. El sitio donde un animal oscuro se recorta
    # es donde el sustrato aún tiene luz, o sea cerca.
    x, y = CLARO[0], CLARO[1]
    pez('pez-fondo', x, y, _sitio_en_agua(x, y, sobre_el_fondo=0.10), 0.62, 0.235)

    # y el que se ha acercado al cebo, si alguno encaja
    if viene:
        z = _sitio_en_agua(LINEA_X + 0.16, LINEA_Y - 0.06,
                           bajo_la_lamina=AGUA - Z_CEBO + 0.02)
        pez(viene, LINEA_X + 0.16, LINEA_Y - 0.06, z,
            0.46 if viene != 'pez-super' else 0.30,
            0.20 if viene != 'pez-super' else 0.088,
            rayas=6 if viene == 'pez-juncal' else 0, vuelto=True)


# --- luz, agua y composición ----------------------------------------------

def backdrop(W, H):
    """El cielo de la tarde. Es obra, no interfaz."""
    bg = np.zeros((H, W, 3), np.float32)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    v = yy / H
    # cielo cálido arriba a la izquierda, frío hacia el horizonte
    alto = np.clip(1.0 - v * 2.5, 0, 1)[..., None]
    bg += np.array([0.470, 0.330, 0.188])[None, None, :] * alto
    bg += np.array([0.180, 0.188, 0.178])[None, None, :] * np.clip(1.0 - v * 1.4, 0, 1)[..., None]
    # el sol está a la izquierda y bajo: el aire se calienta hacia allí
    lateral = np.clip(1.0 - xx / (W * 0.62), 0, 1)[..., None] ** 1.5
    bg += np.array([0.330, 0.206, 0.092])[None, None, :] * lateral
    bg += np.array([0.012, 0.013, 0.014])[None, None, :]
    # Debajo de la línea del agua el vacío no es cielo: es el fondo del cauce
    # que ya no da señal. Sin esto, el pie de la lámina salía de color tarde.
    hondo = np.clip((v - 0.74) / 0.26, 0, 1)[..., None]
    bg = bg * (1.0 - hondo) + np.array([0.022, 0.034, 0.038])[None, None, :] * hondo
    return bg


def lighting(buf):
    return e4.shade(
        buf, LUZ,
        key=np.array([1.00, 0.845, 0.615], np.float32),
        sky=np.array([0.24, 0.30, 0.34], np.float32),
        bounce=np.array([0.26, 0.24, 0.17], np.float32),
        bounce_k=np.array([0.30, 0.27, 0.19], np.float32),
        fog=np.array([0.030, 0.034, 0.034], np.float32),
        # Relleno frío desde la derecha: sin él, todo lo que no mira al sol se
        # va al mismo gris y el limo, la piedra y el alga dejan de separarse.
        fill=(np.array([0.70, -0.40, 0.46], np.float32),
              np.array([0.26, 0.34, 0.42], np.float32), 0.30),
        # `spec_k` baja de 0,18 a 0,07. La calibración decía que el término
        # independiente del albedo valía entre 0,084 y 0,183 según el material
        # —en la madera hundida, más que todo lo demás junto—, y mientras eso
        # mande, el color de un material casi no decide cómo se ve. Repartí la
        # paleta compensando ese suelo y el test pasó, pero la lámina salió
        # peor: un limo casi blanco, una hierba de menta y una madera pálida.
        # Compensar un suelo alto obliga a colores que no son de este sitio.
        # Lo que había que hacer era **bajar el suelo**, y entonces los colores
        # naturales vuelven a separarse solos.
        fog_k=0.21, amb_k=0.22, key_k=0.58, spec_k=0.07, shadow_k=0.86)


def agua(lit, buf):
    """El agua como volumen: absorción por el camino recorrido, no por estar mojado.

    Para cada píxel sumergido, el rayo hacia el observador sale del agua por la
    **lámina**: el ojo está medio fuera. Esa distancia es la que absorbe, y de
    ahí sale solo que lo somero se vea claro y lo hondo se apague, con el rojo
    yéndose antes que el verde y el azul.

    Encima van tres cosas que son representación y no cálculo: las hojas de
    luz, el polvo en suspensión y la cara interior de la superficie.
    """
    x, y, z = buf.world[..., 0], buf.world[..., 1], buf.world[..., 2]
    v = e4.CAM.view
    # La lámina de agua ondula. Antes era la cota constante `AGUA`, y como el
    # realce del menisco depende sólo de z, salía una banda horizontal exacta
    # de lado a lado: una raya pintada, que es justo lo que el criterio 2 del
    # PASS prohíbe. Dos ondas largas y una corta, de centímetro y medio: lo que
    # tiene una lámina de agua quieta, no oleaje.
    nivel = (AGUA
             + 0.015 * (_ruido(x * 0.55, y * 0.30 + 4.0) - 0.5)
             + 0.006 * (_ruido(x * 2.10 + 7.0, y * 0.40) - 0.5))
    sumergido = buf.mask & (z < nivel)
    if not sumergido.any():
        return lit

    # Cuánta agua hay ENTRE la cosa y el ojo. Aquí estaba el error que dejaba
    # la lámina entera de un azul plano: medía el camino hasta la superficie,
    # `(AGUA − z) / v_z`, y con esta cámara casi horizontal `v_z` vale 0,0995,
    # así que un palmo de profundidad daba un metro de agua y metro y medio
    # daba quince. Todo saturaba y dejaba de haber materiales.
    #
    # El ojo está medio sumergido en y = 0, así que lo que absorbe es la
    # distancia al plano de la cámara, que es la profundidad en y. Con eso lo
    # cercano queda nítido, lo lejano se va en azul, y la columna de agua
    # coloca cada cosa en su sitio sin escalar nada a mano.
    # Suelo mínimo: nada que esté dentro del agua se ve como si no lo
    # estuviera. Sin él, el primer plano salía a plena luz y se leía como
    # piedras pegadas encima de la lámina en vez de piedras bajo el agua.
    camino = np.clip(y / max(-v[1], 1e-6), 0.26, None) * sumergido
    # El agua se come el rojo antes que el verde y el azul, pero si se le pide
    # demasiado todo lo sumergido cae al mismo azul y deja de haber materiales.
    # Con k = (2,35 · 0,78 · 0,60) y dispersión 0,42 la lámina salía lechosa y
    # el limo, la piedra y el alga eran la misma cosa.
    k = np.array([1.05, 0.40, 0.30], np.float32)
    absorbe = np.exp(-camino[..., None] * k[None, None, :])
    disperso = np.array([0.020, 0.044, 0.052], np.float32)[None, None, :]
    out = np.where(sumergido[..., None],
                   lit * absorbe * 0.96 + disperso * (1.0 - absorbe) * 0.16,
                   lit)

    # --- polvo en suspensión: lo que hace que el agua tenga cuerpo ---------
    # El polvo iba a escala 2,6: eso no es polvo, son nubes. A 11 son
    # partículas, que es lo que hace que una hoja de luz se vea desigual.
    polvo = e4.sample_grain(x * 11.0 + 3.0, (z * 11.0) + y * 2.2)
    turbia = np.clip((z - TERMOCLINA) / 0.30, 0.0, 1.0)      # arriba, más turbia de calor
    out = out + (np.array([0.030, 0.040, 0.042], np.float32)[None, None, :]
                 * (polvo * (0.30 + 0.70 * turbia) * np.clip(camino / 1.4, 0, 1))[..., None]
                 * sumergido[..., None])

    # --- hojas de luz: bajan desde la lámina y se apagan ------------------
    # Van en la dirección del sol proyectada, y se cortan donde hay algo
    # encima: no hace falta ordenarlas, basta que nazcan en la superficie.
    for cx, ancho, fuerza in ((0.86, 0.085, 0.55), (1.74, 0.062, 0.42), (2.62, 0.070, 0.34)):
        s = x + (nivel - z) * 0.52           # inclinación de la hoja de luz
        perfil = np.exp(-((s - cx) / ancho) ** 2)
        caida = np.exp(-(nivel - z) * 1.15)
        out = out + (np.array([1.00, 0.86, 0.62], np.float32)[None, None, :]
                     * (perfil * caida * fuerza * 0.10 * (0.55 + 0.45 * polvo))[..., None]
                     * sumergido[..., None])

    # --- la cara interior de la superficie: espejo a ángulo rasante -------
    # Es lo que de verdad pasa mirando desde dentro del agua, y es lo que dice
    # «esto es agua» sin dibujar olas.
    # Esto valía 0,55 plano sobre todo lo que estuviera a menos de 8,5 cm de
    # la superficie, y como el paramento del fondo también está sumergido,
    # salía una barra blanca de lado a lado de la lámina: exactamente «una raya
    # pintada encima» en vez de agua. Ahora el espejo pide dos cosas a la vez:
    # estar cerca de la lámina **y** que la cara mire hacia arriba, que es
    # cuando una superficie de verdad refleja a ángulo rasante. El paramento
    # del fondo mira de frente, así que ya no se ilumina.
    arriba = np.clip(buf.normal[..., 2], 0.0, 1.0)
    cerca = np.clip(1.0 - (nivel - z) / 0.070, 0.0, 1.0) * sumergido
    on = e4.sample_grain(x * 5.0, y * 5.0 + 9.0)
    rizo = 0.35 + 0.65 * on
    out = out + (np.array([0.26, 0.30, 0.27], np.float32)[None, None, :]
                 * (cerca * rizo * (0.25 + 0.75 * arriba))[..., None] * 0.30)
    return out


def configure(out_w, out_h, top=0.0, bot=0.0, margen=0.016, rise=0.10, skew=0.22,
              ventana=None, z_rango=None):
    global OUT_W, OUT_H, TOP_OUT, BOT_OUT
    OUT_W, OUT_H = out_w, out_h
    TOP_OUT, BOT_OUT = top, bot
    W, H = out_w * SS, out_h * SS
    x0, x1 = ventana if ventana else (X0, X1)
    # El suelo visible más bajo está a 0,42 de cota proyectada —la pendiente
    # hace que el punto más hondo sea el del fondo, no el de delante—, así que
    # bajar el encuadre de ahí sólo añade vacío debajo del agua.
    z_lo, z_hi = z_rango or (0.42, 2.12)
    # El encuadre lo manda la altura: aire arriba y columna de agua abajo. Si
    # se ajusta por el ancho, el agua pierde la profundidad que es el asunto.
    u_alto = H * (1 - 2 * margen) / ((z_hi - z_lo) + (Y1 - Y0) * rise)
    u_ancho = W * (1 - 2 * margen) / ((x1 - x0) + (Y1 - Y0) * skew)
    u = min(u_alto, u_ancho)
    ox = W * margen - x0 * u
    pie = H - bot * SS
    oy = pie + z_lo * u
    e4.setup(e4.Frontal(u, ox, oy, depth_rise=rise, skew=skew), MATS, out_w, out_h,
             ss=SS, coursing=COURSING, features=FEATURES, top=top, bot=bot)


def escena_y_buffers():
    """La escena y sus búferes. El test mide sobre estos mismos píxeles."""
    buf = e4.Buffers()
    orilla_lejana(buf)
    lecho(buf)
    banco_juncal(buf)
    piedras(buf)
    rama(buf)
    herbazal(buf)
    peces(buf)
    juncal(buf)
    aparejo(buf)
    primer_plano(buf)
    lit = agua(lighting(buf), buf)
    img = e4.compose(lit, buf, backdrop, exposure=1.48,
                      vignette=(1.18, 0.66, 1.45), contraste=0.22, pivote=0.40)
    return img, buf


def render_escena():
    return escena_y_buffers()[0]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', type=Path, default=REPO / 'editorial/r62/p05-pesca-tranquila')
    ap.add_argument('--rapido', action='store_true')
    args = ap.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    global SS
    if args.rapido:
        SS = 1
    e4.set_textures(e4.fbm_tile(octaves=6, gain=0.54, lowest=26, seed=17),
                    e4.fbm_tile(octaves=6, gain=0.60, lowest=44, seed=53))
    e4.set_theme('navy')
    configure(1180, 900, 104, 120)
    viene, marcas = quien_viene()
    img = render_escena()
    Image.fromarray((img * 255 + 0.5).astype(np.uint8)).resize(
        (OUT_W, OUT_H), Image.LANCZOS).save(args.out / 'orilla-trabajo.png')
    print(f'Escrito {args.out}/orilla-trabajo.png')
    print(f'cebo a {AGUA - Z_CEBO:.2f} m · cobijo {float(cobijo(LINEA_X, LINEA_Y)):.2f} · '
          f'luz {luz_a(Z_CEBO):.2f} · viene: {viene}')
    print('  ' + ' · '.join(f'{k} {v:.2f}' for k, v in sorted(marcas.items())))


if __name__ == '__main__':
    main()
