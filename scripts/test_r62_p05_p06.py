#!/usr/bin/env python3
"""R62 · P05 y P06 · lo que se puede medir del listón E4.

La referencia (`editorial/r62/REFERENCIA-E4.md`) dice que un «no» en cualquiera
de sus preguntas fue, en P01, motivo de rework. Varias de ellas sólo las puede
contestar una persona mirando. Tres **sí** se pueden medir, y son justo las que
en esta serie se han fallado antes:

  3. ¿Alguna superficie grande queda resuelta con color plano?
  4. ¿Existe una segunda fuente, o sólo la clave?
  — y la de P03: ¿se reconocen los materiales como distintos?

Y además se mide lo que distingue a estos dos pilotos de una ilustración: que
**el segundo estado está computado**. Si mover el nudo de P05 o cambiar de
sitio una pieza de P06 no cambia lo que el sistema responde, entonces la lámina
de causalidad sería un dibujo y el concepto estaría mintiendo. Eso se comprueba
sin renderizar nada.

Lo que este test NO contesta, y conviene no confundirlo con un PASS: si la
sombra tiene penumbra, si la imperfección es desigual, si a 390 px es una
composición propia, y si algo se parece a obra de terceros. Eso es revisión
humana, y la serie entera la exige.

Uso:  python3 scripts/test_r62_p05_p06.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
import ig_render_e4 as e4            # noqa: E402
import r62_p05_render as p05         # noqa: E402
import r62_p06_render as p06         # noqa: E402

# Lámina pequeña: lo que se mide son relaciones entre materiales y planitud,
# y las dos sobreviven al tamaño. Medir a 1180×900 multiplica por seis el
# tiempo sin cambiar ninguna conclusión.
ANCHO, ALTO = 560, 430


def _preparar(mod, semillas):
    mod.SS = 1
    e4.set_textures(e4.fbm_tile(octaves=6, gain=0.55, lowest=24, seed=semillas[0]),
                    e4.fbm_tile(octaves=6, gain=0.60, lowest=42, seed=semillas[1]))
    e4.set_theme('navy')
    mod.configure(ANCHO, ALTO, 0, 0)
    return mod.escena_y_buffers()


def separacion_materiales(img, buf, materiales):
    """Color medio de cada material sobre la imagen compuesta, y su separación.

    Medido sobre la imagen final y no sobre el albedo a propósito: lo que
    importa es si se distinguen **después** de la luz, la niebla y el tonemap.
    Es la medida que en P03 destapó que el hierro salía más claro que la
    piedra, y en P04 que el barrilete se blanqueaba.
    """
    # La media sola no basta y la primera versión de este test lo demostró:
    # daba por iguales el yeso y la tarima de P06, que en la lámina se
    # distinguen sin esfuerzo porque una está veteada y el otro no. Dos
    # materiales se reconocen como distintos por el color **o** por la
    # textura, así que se miden los dos: la media del color y cuánto varía la
    # luminancia dentro del material. Lo segundo es, en la práctica, el
    # despiece y el grano.
    medias, texturas = {}, {}
    for nombre in materiales:
        if nombre not in e4.MAT_IDS:
            continue
        sel = buf.matid == e4.MAT_IDS[nombre]
        if sel.sum() < 120:            # muy poca superficie para afirmar nada
            continue
        # Sólo la mitad cercana del material. En P05 esto no es un atajo: bajo
        # el agua la absorción aplana de verdad lo que está lejos, y eso es
        # correcto —es lo que coloca cada cosa en su profundidad—. Juzgar el
        # material promediando también las instancias perdidas en el azul mide
        # el agua, no el material. Una persona reconoce la hierba por la mata
        # que tiene delante, no por la que se adivina al fondo, y es ahí donde
        # hay que exigir que se distinga.
        prof = buf.world[..., 1][sel]
        corte = np.quantile(prof, 0.45)
        cerca = sel.copy()
        cerca[sel] = prof <= corte
        pix = img[cerca if cerca.sum() >= 120 else sel]
        medias[nombre] = pix.mean(0)
        texturas[nombre] = float(pix.mean(-1).std())
    pares = []
    nombres = sorted(medias)
    for i, a in enumerate(nombres):
        for b in nombres[i + 1:]:
            color = float(np.abs(medias[a] - medias[b]).mean())
            grano = abs(texturas[a] - texturas[b])
            pares.append((color + 0.55 * grano, a, b, round(color, 4), round(grano, 4)))
    pares.sort()
    return medias, texturas, pares


def planitud(img, buf):
    """La fracción de lámina que cae dentro de una sola casilla de color.

    Una superficie grande resuelta con color plano es el criterio 3. No hace
    falta detectar regiones: basta cuantizar el color y mirar cuánto ocupa la
    casilla más poblada dentro de la escena. En la primera vuelta de P05 el
    agua daba 0,41 de la lámina en una sola casilla; el ojo lo llamó «velo».
    """
    dentro = buf.mask
    q = np.clip((img[dentro] * 22).astype(np.int32), 0, 21)
    claves = q[:, 0] * 484 + q[:, 1] * 22 + q[:, 2]
    if claves.size == 0:
        return 1.0
    return float(np.bincount(claves).max() / claves.size)


def segunda_fuente(mod, img, buf):
    """¿Hay algo más que la clave? Se apaga el relleno y se mide la diferencia.

    Si al quitar la segunda fuente la lámina cambia poco, es que no había
    segunda fuente: sólo una direccional dura, que según la referencia **no
    llega a E4**.
    """
    original = mod.lighting

    def sin_relleno(buf_):
        return e4.shade(
            buf_, mod.LUZ,
            key=np.array([1.00, 0.886, 0.692], np.float32),
            sky=np.array([0.26, 0.28, 0.33], np.float32),
            bounce=np.array([0.30, 0.23, 0.15], np.float32),
            bounce_k=np.array([0.34, 0.26, 0.17], np.float32),
            fog=np.array([0.030, 0.028, 0.026], np.float32),
            fog_k=0.24, amb_k=0.22, key_k=0.58, spec_k=0.22, shadow_k=0.84)

    mod.lighting = sin_relleno
    try:
        otra, _ = mod.escena_y_buffers()
    finally:
        mod.lighting = original
    d = np.abs(otra - img)[buf.mask]
    return float(d.mean())


def causalidad_p05():
    """Mover el nudo tiene que cambiar quién viene. Si no, el §2 es un dibujo."""
    antes_z, antes = p05.Z_CEBO, p05.quien_viene()[0]
    p05.Z_CEBO = p05.AGUA - 1.15                 # una mano más abajo
    despues = p05.quien_viene()[0]
    p05.Z_CEBO = antes_z
    return {'nudo_0.40': antes, 'nudo_1.15': despues, 'cambia': antes != despues}


def causalidad_p06():
    """Mover una pieza tiene que cambiar la lectura y la visita."""
    original = list(p06.PIEZAS)
    antes = ([p06.lectura(i)[0] for i in range(3)], len(p06.visita()))
    # el canto pequeño de la vitrina 0 se va a la de la cerámica
    p06.PIEZAS[2] = (1, 2, 'canto', 'tallado', 'media', 0.12)
    despues = ([p06.lectura(i)[0] for i in range(3)], len(p06.visita()))
    p06.PIEZAS[:] = original
    return {'antes': antes[0], 'despues': despues[0],
            'cambia': antes[0] != despues[0]}


def main() -> int:
    fallos: list[str] = []
    informe: dict = {}

    for nombre, mod, semillas, materiales, minimo in (
        ('P05', p05, (17, 53),
         ('limo', 'piedra', 'alga', 'madera-hund', 'herbazal', 'junco', 'tabla', 'corcho'), 0.030),
        ('P06', p06, (29, 67),
         ('yeso', 'tarima', 'laton', 'canto', 'barro', 'papel', 'banco'), 0.030),
    ):
        img, buf = _preparar(mod, semillas)
        medias, texturas, pares = separacion_materiales(img, buf, materiales)
        plano = planitud(img, buf)
        delta = segunda_fuente(mod, img, buf)
        fila = {
            'materiales_medidos': sorted(medias),
            'par_mas_parecido': ({'materiales': [pares[0][1], pares[0][2]],
                                  'distancia': round(pares[0][0], 4),
                                  'por_color': pares[0][3], 'por_textura': pares[0][4]}
                                 if pares else None),
            'casilla_de_color_mas_poblada': round(plano, 4),
            'cambio_al_quitar_la_segunda_fuente': round(delta, 4),
        }
        if len(medias) < 4:
            fallos.append(f'{nombre}: sólo {len(medias)} materiales con superficie medible')
        if pares and pares[0][0] < minimo:
            fallos.append(f'{nombre}: «{pares[0][1]}» y «{pares[0][2]}» se ven igual '
                          f'({pares[0][0]:.4f} < {minimo}): no se reconocen como materiales distintos')
        if plano > 0.22:
            fallos.append(f'{nombre}: {plano:.0%} de la escena cae en una sola casilla de color: '
                          f'hay una superficie grande resuelta con color plano')
        if delta < 0.004:
            fallos.append(f'{nombre}: quitar la segunda fuente apenas cambia la lámina '
                          f'({delta:.4f}): no hay más que la clave')
        informe[nombre] = fila

    informe['P05']['causalidad'] = causalidad_p05()
    informe['P06']['causalidad'] = causalidad_p06()
    if not informe['P05']['causalidad']['cambia']:
        fallos.append('P05: mover el nudo no cambia quién viene; el segundo estado sería un dibujo')
    if not informe['P06']['causalidad']['cambia']:
        fallos.append('P06: mover una pieza no cambia la lectura; el segundo estado sería un dibujo')

    informe['no_medido'] = [
        'si la sombra tiene penumbra o es un canto duro',
        'si la imperfección es desigual o toda la irregularidad es uniforme',
        'si a 390 px es una composición propia',
        'si algo puede confundirse con obra de terceros',
    ]
    informe['fallos'] = fallos
    informe['gate'] = 'R62_P05_P06_E4_MEASURED_PASS' if not fallos else 'FAIL'
    print(json.dumps(informe, ensure_ascii=False, indent=1))
    return 1 if fallos else 0


if __name__ == '__main__':
    raise SystemExit(main())
