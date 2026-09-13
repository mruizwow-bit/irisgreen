#!/usr/bin/env python3
"""Prueba la CSP global en Chromium sobre una muestra representativa de la web.

Sirve ``dist`` con la cabecera CSP declarada en ``dist/_headers`` y comprueba que
las páginas clave sigan montando su contenido y no generen bloqueos CSP. Además
activa los reproductores presentes en la videoteca sin dejar salir la petición al
proveedor, para detectar regresiones de ``frame-src`` sin depender de la red externa.
No sustituye una auditoría de seguridad ni relaja automáticamente la política.
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
VIDEO_FRAME_SOURCES = {
    'https://www.youtube-nocookie.com',
    'https://player.vimeo.com',
    'https://www.instagram.com',
}
VIDEO_PROVIDERS = [
    ('YouTube', 'https://www.youtube-nocookie.com', True),
    ('Vimeo', 'https://player.vimeo.com', True),
    # Instagram está soportado por el mismo componente aunque puede no haber
    # una tarjeta activa en una edición concreta de la colección.
    ('Instagram', 'https://www.instagram.com', False),
]


def global_csp(root: Path) -> str:
    text = (root / '_headers').read_text(encoding='utf-8')
    m = re.search(r'^/\*\s*$.*?^\s*Content-Security-Policy:\s*(.+)$', text, re.M | re.S)
    if not m:
        raise RuntimeError('No se encuentra la CSP global en _headers')
    value = m.group(1).splitlines()[0].strip()
    if "default-src 'self'" not in value:
        raise RuntimeError('La CSP de prueba no tiene default-src self')
    return value


def frame_sources(csp: str) -> set[str]:
    m = re.search(r'(?:^|;)\s*frame-src\s+([^;]+)', csp)
    if not m:
        raise RuntimeError('La CSP de prueba no declara frame-src')
    return set(m.group(1).split())


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


def csp_console_bag(page) -> list[str]:
    bag: list[str] = []
    page.on(
        'console',
        lambda msg: bag.append(msg.text)
        if ('Content Security Policy' in msg.text or 'Refused to' in msg.text)
        else None,
    )
    return bag


def expand_video_collection(page) -> None:
    area = page.locator('main').first
    for _ in range(12):
        more = area.get_by_role('button', name=re.compile(r'^Ver más')).last
        if not more.count() or not more.is_visible():
            break
        more.click()


def test_video_frames(browser, base: str, failures: list[str]) -> list[str]:
    """Activa cada proveedor actualmente presente sin efectuar una carga remota real."""
    tested: list[str] = []
    html = (ROOT / 'es/videos/index.html').read_text(encoding='utf-8', errors='strict')
    for _, source, _ in VIDEO_PROVIDERS:
        if source not in html:
            failures.append(f'/es/videos/: el componente ya no declara el proveedor revisado {source}')

    for label, source, required_card in VIDEO_PROVIDERS:
        page = browser.new_page(viewport={'width': 1280, 'height': 900})
        page.set_default_timeout(15000)
        messages = csp_console_bag(page)
        attempts: list[str] = []

        def abort_provider(route, request, bag=attempts):
            bag.append(request.url)
            route.abort()

        page.route(source + '/**', abort_provider)
        try:
            page.goto(base + '/es/videos/', wait_until='domcontentloaded')
            page.locator('main h1').first.wait_for(state='visible')
            expand_video_collection(page)
            poster = page.locator(
                f'button.ig-video-poster[data-ig-video^="{source}"]'
            ).first
            if not poster.count():
                if required_card:
                    failures.append(
                        f'/es/videos/: no queda ninguna tarjeta activa para probar {label}'
                    )
                continue
            poster.scroll_into_view_if_needed()
            poster.click()
            frame = page.locator(f'main iframe[src^="{source}"]').first
            frame.wait_for(state='attached')
            page.wait_for_timeout(150)
            if not attempts:
                failures.append(
                    f'/es/videos/: {label} no llegó a intentar la carga; revisar frame-src'
                )
            if messages:
                failures.extend(f'/es/videos/ {label}: {x}' for x in messages[:6])
            tested.append(label)
        except Exception as exc:
            failures.append(f'/es/videos/ {label}: {exc}')
        finally:
            page.close()
    return tested


def main() -> None:
    csp = global_csp(ROOT)
    got_frames = frame_sources(csp)
    if got_frames != VIDEO_FRAME_SOURCES:
        raise AssertionError(
            'frame-src no coincide con la lista cerrada de la videoteca: '
            f'esperado {sorted(VIDEO_FRAME_SOURCES)}, obtenido {sorted(got_frames)}'
        )

    httpd, base = server(ROOT, csp)
    failures: list[str] = []
    providers_tested: list[str] = []
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch()
            for route, expected in ROUTES:
                page = browser.new_page(viewport={'width': 1280, 'height': 900})
                page.set_default_timeout(15000)
                csp_messages = csp_console_bag(page)
                request_failures: list[str] = []
                page.on(
                    'requestfailed',
                    lambda req, bag=request_failures: bag.append(f'{req.url} :: {req.failure}'),
                )
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
                    blocked = [
                        x for x in request_failures
                        if 'ERR_BLOCKED_BY_CSP' in x
                        or ('blocked' in x.lower() and 'csp' in x.lower())
                    ]
                    if csp_messages:
                        failures.extend(f'{route}: {x}' for x in csp_messages[:6])
                    if blocked:
                        failures.extend(f'{route}: {x}' for x in blocked[:6])
                except Exception as exc:
                    failures.append(f'{route}: {exc}')
                finally:
                    page.close()

            providers_tested = test_video_frames(browser, base, failures)
            browser.close()
    finally:
        httpd.shutdown()

    if failures:
        raise AssertionError('CSP rompe la salida pública:\n' + '\n'.join(failures[:40]))
    print({
        'rutas_probadas': len(ROUTES),
        'bloqueos_csp': 0,
        'frame_src': sorted(got_frames),
        'proveedores_con_tarjeta_probados': providers_tested,
        'csp': csp,
    })


if __name__ == '__main__':
    main()
