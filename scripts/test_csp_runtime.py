#!/usr/bin/env python3
"""Prueba la CSP global en Chromium sobre una muestra representativa de la web.

Sirve ``dist`` con la cabecera CSP declarada en ``dist/_headers`` y comprueba que
las páginas clave sigan montando su contenido y no generen bloqueos CSP. No sustituye
una auditoría de seguridad ni intenta relajar automáticamente la política.
"""
from __future__ import annotations

import functools
import re
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path.cwd().resolve()
ROUTES = [
    ('/', 'Empieza por lo que te pasa'),
    ('/es/libros/', 'Los libros'),
    ('/es/tramites/directorio/', 'Todo lo que puedes pedir'),
    ('/es/investigacion/', 'Investigación'),
    ('/es/videos/', 'Vídeos'),
    ('/es/recursos/juegos/', 'Jugar'),
    ('/es/intereses/', 'Tus intereses'),
    ('/es/datos/autismo-en-la-poblacion/', 'Autismo en la población'),
    ('/es/situaciones/la-ropa-me-molesta/', 'etiquetas'),
    ('/es/sitio-tranquilo/', 'Rincón tranquilo'),
]


def global_csp(root: Path) -> str:
    text = (root / '_headers').read_text(encoding='utf-8')
    m = re.search(r'^/\*\s*$.*?^\s*Content-Security-Policy:\s*(.+)$', text, re.M | re.S)
    if not m:
        raise RuntimeError('No se encuentra la CSP global en _headers')
    value = m.group(1).splitlines()[0].strip()
    if "default-src 'self'" not in value:
        raise RuntimeError('La CSP de prueba no tiene default-src self')
    if "'unsafe-eval'" in value:
        raise RuntimeError('La CSP no debe permitir unsafe-eval')
    return value


def server(root: Path, csp: str):
    class Handler(SimpleHTTPRequestHandler):
        def end_headers(self):
            self.send_header('Content-Security-Policy', csp)
            self.send_header('X-Content-Type-Options', 'nosniff')
            super().end_headers()

        def log_message(self, *_):
            pass

    handler = functools.partial(Handler, directory=str(root))
    httpd = ThreadingHTTPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd, f'http://127.0.0.1:{httpd.server_port}'


def main() -> None:
    csp = global_csp(ROOT)
    httpd, base = server(ROOT, csp)
    failures: list[str] = []
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch()
            for route, expected in ROUTES:
                page = browser.new_page(viewport={'width': 1280, 'height': 900})
                page.set_default_timeout(15000)
                csp_messages: list[str] = []
                request_failures: list[str] = []
                page.on('console', lambda msg, bag=csp_messages: bag.append(msg.text) if ('Content Security Policy' in msg.text or 'Refused to' in msg.text) else None)
                page.on('requestfailed', lambda req, bag=request_failures: bag.append(f'{req.url} :: {req.failure}'))
                try:
                    page.goto(base + route, wait_until='domcontentloaded')
                    page.locator('main h1').first.wait_for(state='visible')
                    page.wait_for_timeout(500)
                    h1 = page.locator('main h1').first.inner_text().strip()
                    body = page.locator('body').inner_text()
                    if expected.casefold() not in (h1 + ' ' + body).casefold():
                        failures.append(f'{route}: no aparece texto esperado {expected!r}; h1={h1!r}')
                    if route == '/':
                        if page.locator('#q').is_disabled():
                            failures.append('/: el buscador sigue deshabilitado con CSP')
                    blocked = [x for x in request_failures if 'ERR_BLOCKED_BY_CSP' in x or 'blocked' in x.lower() and 'csp' in x.lower()]
                    if csp_messages:
                        failures.extend(f'{route}: {x}' for x in csp_messages[:6])
                    if blocked:
                        failures.extend(f'{route}: {x}' for x in blocked[:6])
                except Exception as exc:
                    failures.append(f'{route}: {exc}')
                finally:
                    page.close()
            browser.close()
    finally:
        httpd.shutdown()

    if failures:
        raise AssertionError('CSP rompe la salida pública:\n' + '\n'.join(failures[:40]))
    print({'rutas_probadas': len(ROUTES), 'bloqueos_csp': 0, 'csp': csp})


if __name__ == '__main__':
    main()
