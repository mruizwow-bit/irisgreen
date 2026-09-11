#!/usr/bin/env python3
"""Escribe la versión legible sin JavaScript usando el propio renderizador de la página.

Para las páginas cuyos datos viven dentro de su guion no se puede montar el
contenido desde un JSON: no hay JSON. Así que se abre la página publicada en un
navegador, se deja que se monte con su propio código y se guarda el resultado en
un <noscript> del archivo fuente. El texto es, letra por letra, el que la página
ya escribe hoy: este guion no redacta nada.

Del contenido guardado se retiran los guiones y los controles de formulario, que
sin JavaScript no harían nada. Los enlaces se conservan: son navegación real.

Dos pasadas, y en este orden:
  1. python3 scripts/build_site.py          → genera dist con las páginas de hoy
  2. python3 scripts/snapshot_noscript.py   → abre dist y escribe el <noscript> en las fuentes
  3. python3 scripts/build_site.py          → publica ya con el contenido dentro

El mínimo de caracteres se declara con --minimo, y existe para detectar una
captura a medias. No todas las páginas tienen el mismo tamaño: una ficha de
juego corta puede ser legítima con 1.900 caracteres. Se baja el mínimo cuando
está justificado, no se quita.

Necesita playwright, el mismo que usan las pruebas (.github/workflows/comprobar-publicacion.yml).
"""
from __future__ import annotations

import argparse
import functools
import json
import re
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INICIO = '<!-- ig-sin-js:start -->'
FIN = '<!-- ig-sin-js:end -->'
BLOQUE = re.compile(re.escape(INICIO) + r'.*?' + re.escape(FIN), re.S)
MINIMO = 2000

PAGINAS = [
    'es/videos/index.html',
    'es/recursos/juegos/index.html',
    'es/cuestionarios/index.html',
    'es/sobre-iris-green/index.html',
]

LIMPIEZA = """(() => {
  const main = document.querySelector('main');
  if (!main) return null;
  const copia = main.cloneNode(true);
  copia.querySelectorAll('script,template,noscript,[data-ig-reading-panel],[popover]').forEach(n => n.remove());
  copia.querySelectorAll('button,input,select,textarea').forEach(n => n.remove());
  copia.querySelectorAll('[onclick],[onchange],[oninput]').forEach(n => {
    n.removeAttribute('onclick'); n.removeAttribute('onchange'); n.removeAttribute('oninput');
  });
  copia.querySelectorAll('iframe').forEach(n => {
    const t = document.createElement('p');
    t.textContent = n.getAttribute('title') || '';
    n.replaceWith(t);
  });
  copia.removeAttribute('id');
  const envoltorio = document.createElement('main');
  envoltorio.id = 'main';
  envoltorio.setAttribute('style', 'padding:28px 22px 60px;max-width:68em;margin:0 auto');
  while (copia.firstChild) envoltorio.appendChild(copia.firstChild);
  return envoltorio.outerHTML;
})()"""


def servidor(raiz: Path):
    manejador = functools.partial(SimpleHTTPRequestHandler, directory=str(raiz))
    servicio = ThreadingHTTPServer(('127.0.0.1', 0), manejador)
    threading.Thread(target=servicio.serve_forever, daemon=True).start()
    return servicio, f'http://127.0.0.1:{servicio.server_port}'


def ruta_web(rel: str) -> str:
    return '/' + (rel[:-10] if rel.endswith('index.html') else rel)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root', type=Path, default=ROOT / 'dist')
    ap.add_argument('--paginas', nargs='*', default=PAGINAS)
    ap.add_argument('--minimo', type=int, default=MINIMO,
                    help='caracteres mínimos del contenido montado; por debajo se considera captura a medias')
    ap.add_argument('--check', action='store_true')
    args = ap.parse_args()

    from playwright.sync_api import sync_playwright

    servicio, base = servidor(args.root.resolve())
    filas = []
    try:
        with sync_playwright() as pw:
            navegador = pw.chromium.launch()
            for rel in args.paginas:
                fuente = ROOT / rel
                if not fuente.is_file():
                    raise FileNotFoundError(fuente)
                contexto = navegador.new_context(viewport={'width': 1280, 'height': 900})
                pagina = contexto.new_page()
                pagina.set_default_timeout(20000)
                errores = []
                pagina.on('pageerror', lambda e: errores.append(str(e)))
                pagina.goto(base + ruta_web(rel), wait_until='domcontentloaded')
                pagina.locator('main h1').first.wait_for()
                pagina.wait_for_timeout(600)
                marcado = pagina.evaluate(LIMPIEZA)
                contexto.close()
                if errores:
                    raise RuntimeError(rel + ': la página da errores de guion: ' + repr(errores[:3]))
                if not marcado or '{{' in marcado:
                    raise RuntimeError(rel + ': el contenido no se ha montado del todo')
                if len(marcado) < args.minimo:
                    raise RuntimeError(
                        rel + f': el contenido montado mide {len(marcado)} caracteres y el mínimo es {args.minimo}. '
                        'Si la página es legítimamente corta, baja --minimo para ese grupo; no lo quites.')
                bloque = INICIO + '<noscript>' + marcado + '</noscript>' + FIN
                texto = fuente.read_text(encoding='utf-8')
                if BLOQUE.search(texto):
                    nuevo = BLOQUE.sub(lambda _: bloque, texto, count=1)
                else:
                    nuevo, n = re.subn(r'(<body[^>]*>)', lambda m: m.group(1) + bloque, texto, count=1)
                    if n != 1:
                        raise RuntimeError(rel + ': no encuentro el cuerpo de la página')
                cambia = nuevo != texto
                if cambia and not args.check:
                    fuente.write_text(nuevo, encoding='utf-8')
                filas.append({'pagina': rel, 'caracteres': len(marcado), 'cambia': cambia})
            navegador.close()
    finally:
        servicio.shutdown()

    print(json.dumps({'paginas': filas, 'minimo': args.minimo, 'escrito': not args.check},
                     ensure_ascii=False, indent=1))
    if args.check and any(f['cambia'] for f in filas):
        raise SystemExit('Hay que regenerar la versión sin JavaScript')


if __name__ == '__main__':
    main()
