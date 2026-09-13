#!/usr/bin/env python3
"""Audita que la carga inicial no contacte con terceros sin interacción.

Sirve ``dist`` localmente y abre rutas representativas en Chromium. Toda petición
que no apunte al propio servidor local se registra y se aborta antes de salir a la
red. El objetivo es detectar regresiones de privacidad (fuentes, analítica, embeds,
CDN o telemetría) que contradigan el diseño actual de carga local/por consentimiento.

No certifica cumplimiento jurídico y no prueba lo que ocurre después de pulsar un
enlace externo o activar voluntariamente un reproductor de terceros.
"""
from __future__ import annotations

import functools
import json
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

from playwright.sync_api import sync_playwright

ROOT = Path.cwd()
OUT = ROOT / 'reports' / 'publicacion'
OUT.mkdir(parents=True, exist_ok=True)
ROUTES = [
    '/', '/es/situaciones/', '/es/situaciones/la-ropa-me-molesta/',
    '/es/neurodiversidad/condiciones/', '/es/neurodiversidad/condiciones/autismo/',
    '/es/biblioteca/', '/es/investigacion/', '/es/datos/', '/es/tramites/directorio/',
    '/es/libros/', '/es/videos/', '/es/recursos/juegos/', '/es/intereses/',
    '/es/taller/', '/es/sitio-tranquilo/'
]


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def main() -> None:
    server = ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}'
    base_netloc = urlsplit(base).netloc
    report = {
        'routes': [],
        'third_party_requests': [],
        'page_errors': [],
        'limits': [
            'Comprueba la carga inicial de rutas representativas, sin interacción de la persona.',
            'Las peticiones externas se abortan antes de salir a Internet.',
            'No evalúa navegación voluntaria a fuentes externas ni reproductores activados por la persona.',
            'No certifica cumplimiento jurídico de privacidad.',
        ],
    }

    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        for route in ROUTES:
            ctx = browser.new_context(viewport={'width': 1280, 'height': 900}, reduced_motion='reduce')
            external: list[dict] = []
            errors: list[str] = []

            def intercept(req):
                url = req.request.url
                parts = urlsplit(url)
                if parts.scheme in {'http', 'https'} and parts.netloc != base_netloc:
                    external.append({
                        'url': url,
                        'host': parts.netloc.lower(),
                        'resource_type': req.request.resource_type,
                        'method': req.request.method,
                    })
                    req.abort()
                else:
                    req.continue_()

            ctx.route('**/*', intercept)
            page = ctx.new_page()
            page.on('pageerror', lambda err: errors.append(str(err)))
            page.goto(base + route, wait_until='domcontentloaded')
            page.locator('main h1').first.wait_for(timeout=15000)
            page.wait_for_timeout(1200)

            # Deduplicar sin ocultar que una URL pudiera pedirse con dos tipos distintos.
            unique = []
            seen = set()
            for item in external:
                key = (item['url'], item['resource_type'], item['method'])
                if key not in seen:
                    seen.add(key)
                    unique.append(item)
            for item in unique:
                report['third_party_requests'].append({'route': route, **item})
            if errors:
                report['page_errors'].append({'route': route, 'errors': errors})
            row = {
                'route': route,
                'third_party_requests': len(unique),
                'page_errors': len(errors),
            }
            report['routes'].append(row)
            print(json.dumps(row, ensure_ascii=False), flush=True)
            ctx.close()
        browser.close()
    server.shutdown()

    report['summary'] = {
        'routes': len(ROUTES),
        'third_party_requests': len(report['third_party_requests']),
        'page_errors': len(report['page_errors']),
    }
    (OUT / 'privacidad-red.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(report['summary'], ensure_ascii=False))
    if report['third_party_requests'] or report['page_errors']:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
