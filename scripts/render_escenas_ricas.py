#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Rasteriza las escenas ricas del Taller y deja el manifiesto sincronizado.

R54 R2 · Astra pidió que el paso de raster fuese reproducible y versionado:
antes vivía en el banco de pruebas y no viajaba en el parche, así que nadie podía
regenerar las imágenes desde el repositorio.

R54-SYNC-01 · y pidió algo más: que fuese **imposible** que los WebP versionados
dejen de corresponder al fuente. Este script es el único comando que hay que
ejecutar para dejar sincronizados los tres lados —fuente, imágenes y
manifiesto—, y ``scripts/check_escenas_sync.py``, llamado desde el build, es
quien comprueba que siguen coincidiendo.

Para cada escena de ``MIGRADAS``:

1. genera el SVG y calcula su SHA-256 (la huella del fuente);
2. calcula la huella de la configuración de render de esa escena;
3. rasteriza 640 x 400 y 1280 x 800 con Chromium;
4. guarda cada tamaño en AVIF y en WebP, calcula el SHA-256 de los cuatro
   ficheros y valida sus dimensiones;
5. aplica el presupuesto de peso;
6. escribe ``img/taller/escenas/manifest.json``.

La huella de configuración cierra el hueco que encontró Astra: los ajustes
estaban registrados en el manifiesto pero nadie los validaba, así que cambiar la
calidad o el método de compresión dejaba los WebP viejos con el verificador en
verde, porque ni el SVG ni las dimensiones se movían.

Uso:

    python3 scripts/render_escenas_ricas.py            # todas las migradas
    python3 scripts/render_escenas_ricas.py dibujo …   # solo esas

Códigos de salida:

    0  todo bien
    1  una escena se pasa del presupuesto, o el resultado no cuadra
    2  falta el rasterizador (Playwright o el ejecutable de Chromium)
    3  el slug pedido no tiene escena rica

Con código 2 **no se toca ninguna imagen ni el manifiesto**: quedan como estaban
en el repositorio. Eso importa porque el build valida contra ellos.
"""
from __future__ import annotations

import asyncio
import os
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RAIZ / 'scripts'))

from taller_suite.escenas_ricas import R                      # noqa: E402
from taller_suite.migradas import MIGRADAS                    # noqa: E402
from taller_suite import escenas_raster as ER                 # noqa: E402

TMP = Path(os.environ.get('IG_TMP', '/tmp')) / 'ig-escenas'

SIN_RASTER = 2


class RasterNoDisponible(RuntimeError):
    """Ni Playwright ni Chromium están utilizables en esta máquina."""


async def _abrir_navegador(pw):
    """Arranca Chromium, o explica por qué no puede.

    Playwright puede estar instalado y aun así no tener el navegador descargado:
    ahí ``launch()`` lanza su propia excepción. Astra se encontró con ese
    traceback, así que el fallo de arranque se captura igual que el de importar.
    """
    try:
        return await pw.chromium.launch(args=['--force-device-scale-factor=1'])
    except Exception as exc:                     # noqa: BLE001 - se re-etiqueta
        primera = str(exc).strip().splitlines()[0] if str(exc).strip() else type(exc).__name__
        raise RasterNoDisponible(
            f'Chromium no arranca: {primera}. '
            f'Instálalo con «python3 -m playwright install chromium».') from exc


async def _render(slugs):
    try:
        from playwright.async_api import async_playwright
        from PIL import Image
    except ImportError as exc:
        raise RasterNoDisponible(
            f'falta {exc.name or exc}. Instala playwright y pillow.') from exc

    ER.SALIDA.mkdir(parents=True, exist_ok=True)
    TMP.mkdir(parents=True, exist_ok=True)
    svgs, fallos = {}, []

    async with async_playwright() as pw:
        navegador = await _abrir_navegador(pw)
        version = navegador.version
        try:
            # Una captura por escala; de cada captura salen los dos formatos.
            # Así el AVIF y el WebP de un mismo tamaño vienen siempre del mismo
            # píxel, que es lo que permite que uno sea reserva del otro.
            for escala in (1, 2):
                ctx = await navegador.new_context(
                    viewport={'width': ER.ANCHO_1X, 'height': ER.ALTO_1X},
                    device_scale_factor=escala)
                pagina = await ctx.new_page()
                for slug in slugs:
                    svg = svgs.setdefault(slug, R[slug]())
                    origen = TMP / f'{slug}.svg'
                    origen.write_text(svg, encoding='utf-8')
                    await pagina.goto(origen.as_uri())
                    await pagina.wait_for_timeout(ER.AJUSTES_RENDER['espera_ms'])
                    png = TMP / f'{slug}@{escala}x.png'
                    await pagina.screenshot(path=str(png))
                    imagen = Image.open(png).convert(
                        ER.AJUSTES_RENDER['espacio_color'])
                    for clave, nombre, fmt, calidad, tam, presu, esc in ER.formatos(slug):
                        if esc != escala:
                            continue
                        if imagen.size != tam:
                            fallos.append(f'{nombre}: {imagen.size} en vez de {tam}')
                        destino = ER.SALIDA / nombre
                        extra = ({'method': ER.AJUSTES_RENDER['metodo_webp']}
                                 if fmt == 'WEBP' else {})
                        imagen.save(destino, fmt, quality=calidad, **extra)
                        peso = destino.stat().st_size
                        if peso > presu:
                            fallos.append(f'{nombre}: {peso} B > {presu} B')
                        marca = '' if peso <= presu else '  ← FUERA DE PRESUPUESTO'
                        print(f'{nombre:28} {peso:7} B  q{calidad}{marca}')
                await ctx.close()
        finally:
            await navegador.close()
    return svgs, fallos, version


def main() -> int:
    pedidos = sys.argv[1:]
    slugs = pedidos or sorted(MIGRADAS)
    desconocidos = [s for s in slugs if s not in R]
    if desconocidos:
        print('Sin escena rica: ' + ', '.join(desconocidos), file=sys.stderr)
        return 3

    try:
        svgs, fallos, version = asyncio.run(_render(slugs))
    except RasterNoDisponible as exc:
        print(f'No se puede rasterizar: {exc}', file=sys.stderr)
        print('Las imágenes y el manifiesto versionados quedan intactos.',
              file=sys.stderr)
        return SIN_RASTER

    if fallos:
        print('\nEl render no cuadra:', file=sys.stderr)
        for f in fallos:
            print(f'  {f}', file=sys.stderr)
        return 1

    # El manifiesto se reescribe entero a partir de MIGRADAS, no solo de los
    # slugs pedidos: así una escena retirada de MIGRADAS desaparece del
    # manifiesto aunque su WebP siga en el árbol, y una que falte se nota.
    entradas = dict(ER.leer_manifiesto().get('scenes', {}))
    for slug in slugs:
        entradas[slug] = ER.huella(slug, svgs[slug])
    sobran = [s for s in entradas if s not in MIGRADAS]
    for s in sobran:
        del entradas[s]
    faltan = [s for s in MIGRADAS if s not in entradas]
    if faltan:
        print('\nSin entrada en el manifiesto: ' + ', '.join(faltan), file=sys.stderr)
        print('Ejecuta el script sin argumentos para regenerarlas todas.',
              file=sys.stderr)
        return 1
    ER.escribir_manifiesto(entradas, version_rasterizador=f'chromium {version}')

    print(f'\n{len(slugs)} escenas rasterizadas · manifiesto con {len(entradas)} '
          f'entradas en {ER.MANIFIESTO.relative_to(RAIZ)}')
    if sobran:
        print('Retiradas del manifiesto (ya no están en MIGRADAS): '
              + ', '.join(sorted(sobran)))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
