# -*- coding: utf-8 -*-
"""Contrato de sincronización entre el fuente de una escena y sus WebP (R54-SYNC-01).

El problema que cierra este módulo: hasta ahora el build comprobaba que los WebP
**existieran**. Eso deja pasar el caso peligroso —alguien toca ``rica_<slug>.py``
o el código común de ``escenas_ricas.py``, no vuelve a rasterizar, y el build
sigue en verde sirviendo imágenes viejas que ya no corresponden al fuente—.

La huella no es el hash del fichero ``.py``: es el **SHA-256 del SVG final que
produce la función de la escena**. Así cualquier cambio efectivo —composición,
color, geometría, texto, o un ayudante compartido que altere la salida— mueve la
huella, y un cambio que no altera el SVG (un comentario, un renombrado interno)
no obliga a rerasterizar. Las escenas son deterministas: el mismo árbol produce
el mismo SVG byte a byte, dentro de un proceso y entre procesos.

Aquí viven las constantes y los cálculos que comparten el rasterizador
(``scripts/render_escenas_ricas.py``) y el verificador
(``scripts/check_escenas_sync.py``), para que no puedan divergir.
"""
from __future__ import annotations

import hashlib
import json
import struct
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
SALIDA = RAIZ / 'img' / 'taller' / 'escenas'
MANIFIESTO = SALIDA / 'manifest.json'

ESQUEMA = 'R54_ESCENAS_RASTER_MANIFEST/1.0'

ANCHO_1X, ALTO_1X = 640, 400
ANCHO_2X, ALTO_2X = 1280, 800

# Calidad por escena. 88 por defecto; se baja solo donde el peso lo pide y la
# diferencia no se aprecia al tamaño real de la tarjeta (unos 320 px de ancho).
# El detalle fino de la trama del patrón estampado hace que el WebP no baje
# del presupuesto a q88. A q82, comparado a tamaño de tarjeta, la diferencia
# no se aprecia y entra con margen.
CALIDAD_1X = {'mundos': 84, 'patrones': 82,
              'escritura-restricciones': 82, 'lenguas-inventadas': 84}
CALIDAD_1X_DEFECTO = 88
CALIDAD_2X = 78          # el 2x se ve a mitad de tamaño: admite más compresión

# AVIF (norma visual SEP 2026 §5 y §14, «formatos modernos»). Con más de un 95 %
# de los navegadores soportándolo, se sirve primero y el WebP queda de reserva,
# así que no se pierde a nadie. A igualdad de aspecto pesa en torno a la mitad,
# y ese margen es el que permite subir microdetalle sin romper el presupuesto.
# Las calidades están elegidas comparando a tamaño de tarjeta contra el WebP.
CALIDAD_AVIF_1X = 62
CALIDAD_AVIF_2X = 50

PRESUPUESTO_1X = 26 * 1024
PRESUPUESTO_2X = 72 * 1024
PRESUPUESTO_AVIF_1X = 18 * 1024
PRESUPUESTO_AVIF_2X = 46 * 1024

# Ajustes del render que afectan al resultado. Van al manifiesto porque cambiar
# cualquiera de ellos cambia los bytes del WebP sin tocar el SVG.
AJUSTES_RENDER = {
    'rasterizador': 'chromium',
    'metodo_webp': 6,
    'espacio_color': 'RGB',
    'device_scale_factor_1x': 1,
    'device_scale_factor_2x': 2,
    'espera_ms': 260,
    'formatos': ['avif', 'webp'],
}


def calidad_1x(slug: str) -> int:
    return CALIDAD_1X.get(slug, CALIDAD_1X_DEFECTO)


def config_render(slug: str) -> dict:
    """Los ajustes que **cambian los bytes** del WebP de esta escena.

    Van aquí todos los que, cambiando, producen un fichero distinto a partir del
    mismo SVG: tamaño del lienzo, factor de escala, calidad de cada tamaño,
    método de compresión, espacio de color y la espera antes de capturar. La
    calidad es por escena, así que la huella también.

    **No** van los presupuestos de peso: son una puerta, no un ajuste de render.
    Tocarlos no cambia ni un byte del WebP, y meterlos aquí obligaría a
    rerasterizar las seis escenas cada vez que se afina un límite.

    **Tampoco** va la versión de Chromium, y esto merece decirlo claro porque es
    una limitación real: una versión distinta del navegador puede producir bytes
    distintos. Se registra en el manifiesto como dato informativo, pero fuera de
    la huella, porque incluirla haría fallar el build en cualquier máquina con
    otra versión aunque en el proyecto no haya cambiado nada. El riesgo que queda
    acotado es pequeño: si nadie rerasteriza, siguen publicándose exactamente las
    imágenes aprobadas; y en cuanto alguien rerasteriza, los hashes de los WebP
    cambian y quedan registrados.
    """
    return {
        'rasterizador': AJUSTES_RENDER['rasterizador'],
        'metodo_webp': AJUSTES_RENDER['metodo_webp'],
        'espacio_color': AJUSTES_RENDER['espacio_color'],
        'espera_ms': AJUSTES_RENDER['espera_ms'],
        'canvas_1x': [ANCHO_1X, ALTO_1X],
        'canvas_2x': [ANCHO_2X, ALTO_2X],
        'dpr_1x': AJUSTES_RENDER['device_scale_factor_1x'],
        'dpr_2x': AJUSTES_RENDER['device_scale_factor_2x'],
        'quality_1x': calidad_1x(slug),
        'quality_2x': CALIDAD_2X,
        'quality_avif_1x': CALIDAD_AVIF_1X,
        'quality_avif_2x': CALIDAD_AVIF_2X,
        'formatos': list(AJUSTES_RENDER['formatos']),
    }


def huella_config(slug: str) -> str:
    """SHA-256 de ``config_render``, en JSON canónico para que sea estable."""
    canonico = json.dumps(config_render(slug), sort_keys=True, separators=(',', ':'))
    return hashlib.sha256(canonico.encode('utf-8')).hexdigest()


def sha256_texto(texto: str) -> str:
    return hashlib.sha256(texto.encode('utf-8')).hexdigest()


def sha256_fichero(ruta: Path) -> str:
    h = hashlib.sha256()
    with ruta.open('rb') as f:
        for trozo in iter(lambda: f.read(1 << 16), b''):
            h.update(trozo)
    return h.hexdigest()


def dimensiones(ruta: Path) -> tuple[int, int]:
    """Ancho y alto de un WebP o de un AVIF leyendo la cabecera.

    El verificador corre dentro del build y no debería necesitar la pila de
    imagen entera solo para comprobar dos enteros.
    """
    if ruta.suffix == '.avif':
        return _dimensiones_avif(ruta)
    datos = ruta.read_bytes()[:40]
    if datos[:4] != b'RIFF' or datos[8:12] != b'WEBP':
        raise ValueError(f'{ruta.name}: no es un WebP')
    formato = datos[12:16]
    if formato == b'VP8 ':                       # con pérdida
        w, h = struct.unpack('<HH', datos[26:30])
        return w & 0x3FFF, h & 0x3FFF
    if formato == b'VP8L':                       # sin pérdida
        b = struct.unpack('<I', datos[21:25])[0]
        return (b & 0x3FFF) + 1, ((b >> 14) & 0x3FFF) + 1
    if formato == b'VP8X':                       # extendido
        w = datos[24] | datos[25] << 8 | datos[26] << 16
        h = datos[27] | datos[28] << 8 | datos[29] << 16
        return w + 1, h + 1
    raise ValueError(f'{ruta.name}: formato WebP no reconocido ({formato!r})')


#: cada formato con su sufijo de fichero, su clave de manifiesto, su calidad y
#: su presupuesto. Recorrer esto es lo que garantiza que el rasterizador y el
#: verificador traten exactamente los mismos ficheros.
def formatos(slug: str):
    return (
        ('webp_1x', f'{slug}.webp', 'WEBP', calidad_1x(slug),
         (ANCHO_1X, ALTO_1X), PRESUPUESTO_1X, 1),
        ('webp_2x', f'{slug}@2x.webp', 'WEBP', CALIDAD_2X,
         (ANCHO_2X, ALTO_2X), PRESUPUESTO_2X, 2),
        ('avif_1x', f'{slug}.avif', 'AVIF', CALIDAD_AVIF_1X,
         (ANCHO_1X, ALTO_1X), PRESUPUESTO_AVIF_1X, 1),
        ('avif_2x', f'{slug}@2x.avif', 'AVIF', CALIDAD_AVIF_2X,
         (ANCHO_2X, ALTO_2X), PRESUPUESTO_AVIF_2X, 2),
    )


def _dimensiones_avif(ruta: Path) -> tuple[int, int]:
    """Ancho y alto de un AVIF, leyendo la caja ``ispe`` del contenedor ISOBMFF.

    ``ispe`` (image spatial extents) lleva ancho y alto como dos enteros de 32
    bits justo detrás de su versión y sus banderas. Se busca la primera, que es
    la del elemento principal.
    """
    datos = ruta.read_bytes()[:8192]
    i = datos.find(b'ispe')
    if i < 0:
        raise ValueError(f'{ruta.name}: no se encuentra la caja ispe del AVIF')
    w = int.from_bytes(datos[i + 8:i + 12], 'big')
    h = int.from_bytes(datos[i + 12:i + 16], 'big')
    if not (0 < w < 1 << 16 and 0 < h < 1 << 16):
        raise ValueError(f'{ruta.name}: dimensiones AVIF fuera de rango ({w}x{h})')
    return w, h


def rutas(slug: str) -> tuple[Path, Path]:
    return SALIDA / f'{slug}.webp', SALIDA / f'{slug}@2x.webp'


def huella(slug: str, svg: str) -> dict:
    """Entrada de manifiesto de una escena, calculada sobre lo que hay en disco."""
    entrada = {
        'slug': slug,
        'render_config_sha256': huella_config(slug),
        'render_config': config_render(slug),
        'svg_sha256': sha256_texto(svg),
        'svg_bytes': len(svg.encode('utf-8')),
    }
    for clave, nombre, _fmt, calidad, _tam, _presu, _esc in formatos(slug):
        ruta = SALIDA / nombre
        entrada[clave] = nombre
        entrada[f'{clave}_sha256'] = sha256_fichero(ruta)
        entrada[f'{clave}_bytes'] = ruta.stat().st_size
        entrada[f'{clave}_size'] = list(dimensiones(ruta))
        entrada[f'{clave}_quality'] = calidad
    return entrada


def leer_manifiesto() -> dict:
    if not MANIFIESTO.exists():
        return {}
    return json.loads(MANIFIESTO.read_text(encoding='utf-8'))


def escribir_manifiesto(entradas: dict, version_rasterizador: str = '') -> None:
    doc = {
        'schema': ESQUEMA,
        'note': ('svg_sha256 es el SHA-256 del SVG final que genera la función de '
                 'la escena, no del fichero .py. El build compara este manifiesto '
                 'con el fuente regenerado en memoria y con los WebP versionados.'),
        'canvas_1x': [ANCHO_1X, ALTO_1X],
        'canvas_2x': [ANCHO_2X, ALTO_2X],
        'budget_1x_bytes': PRESUPUESTO_1X,
        'budget_2x_bytes': PRESUPUESTO_2X,
        'render_settings': AJUSTES_RENDER,
        'render_config_note': (
            'render_config_sha256 es por escena porque la calidad 1x lo es. '
            'Cubre lienzo, DPR, calidades, método WebP, espacio de color y espera: '
            'todo lo que cambia los bytes a partir del mismo SVG. Los presupuestos '
            'quedan fuera porque no cambian el fichero, y la versión del navegador '
            'también, porque haría fallar el build en máquinas con otra versión sin '
            'que haya cambiado nada del proyecto.'),
        'rasterizer_version_informative': version_rasterizador,
        'scenes': {s: entradas[s] for s in sorted(entradas)},
    }
    MANIFIESTO.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + '\n',
                          encoding='utf-8')
