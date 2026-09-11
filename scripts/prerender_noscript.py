#!/usr/bin/env python3
"""Escribe la versión legible sin JavaScript de las páginas de plantilla.

No redacta nada. Toma los datos del propio bloque ig-initial-data que la página
ya lleva dentro, y el título y la entrada de su propio <title> y su meta
description. Lo monta en un <noscript> al principio del cuerpo: con JavaScript
la página no cambia, y sin JavaScript el contenido está ahí.

Idempotente: si el bloque existe, lo regenera entre sus marcas.
"""
from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INICIO = '<!-- ig-sin-js:start -->'
FIN = '<!-- ig-sin-js:end -->'
SEMILLA = re.compile(r'<script id="ig-initial-data" type="application/json"[^>]*>(.*?)</script>', re.S)
TITULO = re.compile(r'<title>(.*?)</title>', re.S)
DESCRIPCION = re.compile(r'<meta name="description" content="([^"]*)"')
BLOQUE = re.compile(re.escape(INICIO) + r'.*?' + re.escape(FIN), re.S)

ESTILO = (
    'padding:32px 22px 60px;max-width:52em;margin:0 auto;'
    "font-family:'Atkinson Hyperlegible',system-ui,sans-serif;color:#17395c;line-height:1.62"
)


def esc(v) -> str:
    return html.escape('' if v is None else str(v), quote=True)


def estudio(r: dict) -> str:
    partes = ['<article style="margin:0 0 34px;padding:0 0 26px;border-bottom:1px solid rgba(23,57,92,.14)">']
    partes.append('<h2 style="font-family:\'Newsreader\',Georgia,serif;font-weight:400;font-size:26px;margin:0 0 6px">' + esc(r.get('heading') or r.get('titleEs')) + '</h2>')
    if r.get('titleOrig'):
        partes.append('<p style="margin:0 0 4px;font-size:16px;color:#2b3d55">' + esc(r['titleOrig']) + '</p>')
    ficha = ' · '.join(esc(x) for x in [r.get('authors'), r.get('year'), r.get('design'), r.get('topic')] if x)
    if ficha:
        partes.append('<p style="margin:0 0 10px;font-size:15px;color:#4d5a6b">' + ficha + '</p>')
    if r.get('sample'):
        partes.append('<p style="margin:0 0 10px;font-size:15px;color:#4d5a6b">' + esc(r['sample']) + '</p>')
    for p in r.get('text') or []:
        partes.append('<p style="margin:0 0 10px">' + esc(p) + '</p>')
    if r.get('means'):
        partes.append('<p style="margin:0 0 10px">' + esc(r['means']) + '</p>')
    if r.get('notProven'):
        partes.append('<p style="margin:0 0 10px">' + esc(r['notProven']) + '</p>')
    if r.get('doi'):
        partes.append('<p style="margin:0;font-size:15px;color:#4d5a6b;word-break:break-word">' + esc(r['doi']) + '</p>')
    partes.append('</article>')
    return ''.join(partes)


def bloque(texto: str, registros: list) -> str:
    titulo = TITULO.search(texto)
    descripcion = DESCRIPCION.search(texto)
    if not titulo:
        raise ValueError('La página no tiene <title>')
    encabezado = titulo.group(1).split('·')[0].strip()
    partes = [INICIO, '<noscript><main id="main" style="' + ESTILO + '">']
    partes.append('<h1 style="font-family:\'Newsreader\',Georgia,serif;font-weight:400;font-size:40px;line-height:1.08;margin:0 0 12px">' + esc(encabezado) + '</h1>')
    if descripcion:
        partes.append('<p style="margin:0 0 28px;font-size:19px;color:#435268">' + esc(html.unescape(descripcion.group(1))) + '</p>')
    partes.extend(estudio(r) for r in registros)
    partes.append('</main></noscript>')
    partes.append(FIN)
    return ''.join(partes)


def procesa(rel: str, escribir: bool) -> dict:
    ruta = ROOT / rel
    texto = ruta.read_text(encoding='utf-8')
    semilla = SEMILLA.search(texto)
    if not semilla:
        raise ValueError(rel + ': no lleva ig-initial-data; hay que generarlo antes con prepare_initial_data.py')
    registros = json.loads(semilla.group(1).replace('\\u003c', '<'))
    if not isinstance(registros, list) or not registros:
        raise ValueError(rel + ': los datos no son una lista de registros')
    nuevo_bloque = bloque(texto, registros)
    if BLOQUE.search(texto):
        nuevo = BLOQUE.sub(lambda _: nuevo_bloque, texto, count=1)
    else:
        nuevo, n = re.subn(r'(<body[^>]*>)', lambda m: m.group(1) + nuevo_bloque, texto, count=1)
        if n != 1:
            raise ValueError(rel + ': no encuentro el cuerpo de la página')
    cambia = nuevo != texto
    if cambia and escribir:
        ruta.write_text(nuevo, encoding='utf-8')
    return {'pagina': rel, 'registros': len(registros), 'cambia': cambia}


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--check', action='store_true')
    ap.add_argument('--paginas', nargs='*', default=['es/investigacion/index.html'])
    args = ap.parse_args()
    filas = [procesa(rel, not args.check) for rel in args.paginas]
    print(json.dumps({'paginas': filas, 'escrito': not args.check}, ensure_ascii=False, indent=1))
    if args.check and any(f['cambia'] for f in filas):
        raise SystemExit('Hay que regenerar la versión sin JavaScript')


if __name__ == '__main__':
    main()
