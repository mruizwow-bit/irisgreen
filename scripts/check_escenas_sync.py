#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Comprueba que fuente, configuración, manifiesto y WebP dicen lo mismo (R54-SYNC-01).

«El fichero existe» no es una comprobación. Lo que tiene que ser cierto es:

    fuente actual  ==  manifiesto  ==  outputs versionados

Para cada escena de ``MIGRADAS`` se comprueban tres cosas contra el manifiesto:
la **configuración de render** con la que se produjo el WebP, el **SVG**
regenerado en memoria, y el **SHA-256 y las dimensiones** de los cuatro ficheros de imagen
(AVIF y WebP, en 1x y en 2x).
Cualquier discrepancia detiene el build.

La configuración va primero porque es el hueco que encontró Astra: el manifiesto
la registraba pero nadie la validaba, así que cambiar la calidad, el método de
compresión, el espacio de color, la espera o el DPR dejaba los WebP antiguos con
el verificador en verde —ni el SVG ni las dimensiones se mueven—. Al ser por
escena, cubre además el render parcial: cambiar un ajuste global y rerasterizar
un solo slug deja a los demás con la huella vieja, y aquí se ven.

El caso que esto hace imposible: alguien toca ``rica_<slug>.py`` o un ayudante
compartido de ``escenas_ricas.py``, no vuelve a rasterizar, y el sitio se publica
con imágenes que ya no corresponden al fuente.

Se llama desde ``scripts/build_site.py``. También se puede ejecutar suelto:

    python3 scripts/check_escenas_sync.py

Salida 0 si todo cuadra, 1 si no.
"""
from __future__ import annotations

import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RAIZ / 'scripts'))

from taller_suite.escenas_ricas import R                      # noqa: E402
from taller_suite.migradas import MIGRADAS                    # noqa: E402
from taller_suite import escenas_raster as ER                 # noqa: E402

ORDEN = 'python3 scripts/render_escenas_ricas.py'


def comprobar() -> list[tuple[str, str, str]]:
    """Devuelve la lista de (código, slug, explicación). Vacía si todo cuadra."""
    problemas: list[tuple[str, str, str]] = []

    doc = ER.leer_manifiesto()
    if not doc:
        return [('MANIFEST_MISSING', '-',
                 f'no existe {ER.MANIFIESTO.relative_to(RAIZ)}')]
    if doc.get('schema') != ER.ESQUEMA:
        problemas.append(('MANIFEST_SCHEMA', '-',
                          f'esquema {doc.get("schema")!r}, se esperaba {ER.ESQUEMA!r}'))
    escenas = doc.get('scenes', {})

    for slug in sorted(set(escenas) - set(MIGRADAS)):
        problemas.append(('MANIFEST_EXTRA', slug,
                          'está en el manifiesto pero no en MIGRADAS'))

    for slug in MIGRADAS:
        entrada = escenas.get(slug)
        if entrada is None:
            problemas.append(('MANIFEST_MISSING_SCENE', slug,
                              'declarada en MIGRADAS y sin entrada en el manifiesto'))
            continue
        if slug not in R:
            problemas.append(('SOURCE_MISSING', slug,
                              'declarada en MIGRADAS y sin escena rica registrada'))
            continue

        # 1 · la configuración de render con la que se hizo ese WebP
        #
        # Va la primera porque es la que Astra vio que faltaba: el manifiesto
        # registraba los ajustes pero nadie los comparaba con los de ahora, así
        # que cambiar la calidad o el método de compresión dejaba los WebP viejos
        # con el verificador en verde —ni el SVG ni las dimensiones se mueven—.
        # Es por escena porque la calidad 1x lo es, y eso además cubre el render
        # parcial: si se cambia un ajuste global y solo se rerasteriza un slug,
        # los demás siguen con la huella vieja y fallan aquí.
        config_ahora = ER.huella_config(slug)
        if config_ahora != entrada.get('render_config_sha256'):
            antes = entrada.get('render_config') or {}
            ahora_dict = ER.config_render(slug)
            cambiados = sorted(
                k for k in set(antes) | set(ahora_dict)
                if antes.get(k) != ahora_dict.get(k)) if antes else []
            detalle = (', '.join(f'{k}: {antes.get(k)!r} -> {ahora_dict.get(k)!r}'
                                 for k in cambiados)
                       if cambiados else
                       f'{config_ahora[:12]}… frente a '
                       f'{str(entrada.get("render_config_sha256"))[:12]}…')
            problemas.append((
                'RENDER_SETTINGS_MISMATCH', slug,
                f'la configuración de render cambió y no se rasterizó ({detalle})'))

        # 2 · el fuente, regenerado ahora mismo
        svg = R[slug]()
        ahora = ER.sha256_texto(svg)
        if ahora != entrada.get('svg_sha256'):
            problemas.append((
                'SOURCE_OUTPUT_SYNC_MISMATCH', slug,
                f'el SVG actual ({ahora[:12]}…, {len(svg.encode())} B) no es el del '
                f'manifiesto ({str(entrada.get("svg_sha256"))[:12]}…, '
                f'{entrada.get("svg_bytes")} B): la escena cambió y no se rasterizó'))

        # 3 · los cuatro ficheros de imagen: AVIF y WebP, en 1x y en 2x
        for clave, nombre, _fmt, _cal, tam, _presu, _esc in ER.formatos(slug):
            ruta = ER.SALIDA / nombre
            if not ruta.exists():
                problemas.append(('OUTPUT_MISSING', slug,
                                  f'falta {ruta.relative_to(RAIZ)}'))
                continue
            if f'{clave}_sha256' not in entrada:
                problemas.append(('MANIFEST_MISSING_OUTPUT', slug,
                                  f'el manifiesto no registra {nombre}'))
                continue
            real = ER.sha256_fichero(ruta)
            if real != entrada.get(f'{clave}_sha256'):
                problemas.append((
                    'SOURCE_OUTPUT_SYNC_MISMATCH', slug,
                    f'{nombre} no es el del manifiesto '
                    f'({real[:12]}… frente a {str(entrada.get(f"{clave}_sha256"))[:12]}…)'))
            try:
                medida = ER.dimensiones(ruta)
            except ValueError as exc:
                problemas.append(('OUTPUT_UNREADABLE', slug, str(exc)))
                continue
            if list(medida) != list(entrada.get(f'{clave}_size', [])):
                problemas.append(('OUTPUT_SIZE_MISMATCH', slug,
                                  f'{nombre} mide {medida}, el manifiesto dice '
                                  f'{entrada.get(f"{clave}_size")}'))
            if list(medida) != list(tam):
                problemas.append(('OUTPUT_SIZE_MISMATCH', slug,
                                  f'{nombre} mide {medida}, se esperaba {tam}'))

    return problemas


def main() -> int:
    problemas = comprobar()
    if not problemas:
        print(f'{{"escenas_raster_sync": "PASS", "escenas": {len(MIGRADAS)}, '
              f'"formatos": 4, '
              f'"comprobado": "render_config_sha256 + svg_sha256 + '
              f'avif/webp 1x/2x sha256 + dimensiones"}}')
        return 0
    print('R54 escenas ricas desincronizadas:', file=sys.stderr)
    for codigo, slug, detalle in problemas:
        print(f'  [{codigo}] {slug}: {detalle}', file=sys.stderr)
    stale = sorted({s for c, s, _ in problemas
                    if c in ('SOURCE_OUTPUT_SYNC_MISMATCH', 'RENDER_SETTINGS_MISMATCH')})
    if stale:
        print(f'\nR54 rich scene stale: {", ".join(stale)}. Run {ORDEN}',
              file=sys.stderr)
    else:
        print(f'\nEjecuta {ORDEN}', file=sys.stderr)
    return 1


if __name__ == '__main__':
    raise SystemExit(main())
