#!/usr/bin/env python3
"""Prueba real de la carga perezosa del Directorio.

Contratos cubiertos:
- primera pantalla: España local, sin pedir JSON español ni internacional;
- 12 -> 24 fichas españolas funciona solo con la semilla local;
- pasar de 24, buscar o filtrar España carga una sola vez ``tramites-es.json``;
- el JSON internacional se solicita al elegir el primer país extranjero y se reutiliza;
- un fallo del shard español mantiene 24 fichas legibles, anuncia el error con
  ``role=status`` y una nueva acción puede recuperarse.
No valida el contenido editorial de las fichas.
"""
from __future__ import annotations

import functools
import json
import re
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright

ROOT = Path.cwd()
DATA = json.loads((ROOT / 'es/tramites/directorio/tramites-datos.json').read_text(encoding='utf-8'))


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


server = ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{server.server_port}'
REPORT = {'cases': [], 'failures': []}


def request_kind(url: str) -> str | None:
    path = urlparse(url).path
    if path.endswith('/es/tramites/directorio/tramites-es.json'):
        return 'spain'
    if path.endswith('/es/tramites/directorio/tramites-datos.json'):
        return 'international'
    return None


def fresh_page(browser, *, fail_spain=None):
    ctx = browser.new_context(viewport={'width': 412, 'height': 823})
    page = ctx.new_page()
    page.set_default_timeout(15000)
    requests = {'spain': [], 'international': []}
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))

    def route(r):
        kind = request_kind(r.request.url)
        if kind:
            requests[kind].append(r.request.url)
        if kind == 'spain' and fail_spain is not None and fail_spain['on']:
            r.fulfill(status=503, content_type='application/json', body='{}')
        elif r.request.url.startswith(base):
            r.continue_()
        else:
            r.abort()

    page.route('**/*', route)
    return ctx, page, requests, errors


def wait_home(page):
    page.goto(base + '/es/tramites/directorio/', wait_until='domcontentloaded')
    page.locator('main h1').first.wait_for()
    page.get_by_text(DATA['es'][0]['name'], exact=True).first.wait_for()


def visible_cards(page):
    return page.locator('main article:visible').count()


try:
    with sync_playwright() as pw:
        browser = pw.chromium.launch()

        # 1) Semilla española real: 12 visibles, 24 locales, shard solo al pasar de 24.
        ctx, page, requests, errors = fresh_page(browser)
        page.add_init_script('''() => {
          window.__igDirectoryCLS = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) window.__igDirectoryCLS += entry.value;
            }
          }).observe({type: 'layout-shift', buffered: true});
        }''')
        wait_home(page)
        page.wait_for_timeout(700)
        cls = float(page.evaluate('window.__igDirectoryCLS || 0'))
        preloads = page.locator('link[data-ig-directory-font-preload][rel="preload"][as="font"]')
        assert preloads.count() == 3, f'Se esperaban 3 precargas tipográficas; hay {preloads.count()}'
        assert cls < 0.1, f'CLS sin throttling del Directorio demasiado alto: {cls:.4f}'
        assert requests['spain'] == [] and requests['international'] == [], requests
        assert visible_cards(page) == 12, visible_cards(page)

        more = page.get_by_role('button', name=re.compile(r'^Ver más fichas'))
        more.click()
        page.wait_for_function('document.querySelectorAll("main article").length >= 24')
        page.wait_for_timeout(100)
        assert visible_cards(page) == 24, visible_cards(page)
        assert requests['spain'] == [], 'Las 24 fichas iniciales deben ser locales'

        more = page.get_by_role('button', name=re.compile(r'^Ver más fichas'))
        more.click()
        page.wait_for_function('document.querySelectorAll("main article").length >= 36')
        assert visible_cards(page) == 36, visible_cards(page)
        assert len(requests['spain']) == 1, requests['spain']

        page.get_by_role('button', name='Reino Unido', exact=True).click()
        page.get_by_text(DATA['uk'][0]['name'], exact=True).first.wait_for()
        assert len(requests['international']) == 1, requests['international']
        page.get_by_role('button', name='Brasil', exact=True).click()
        page.get_by_text(DATA['br'][0]['name'], exact=True).first.wait_for()
        assert len(requests['international']) == 1, 'Cambiar a Brasil volvió a descargar el JSON internacional'
        assert not errors, errors
        REPORT['cases'].append({
            'scenario': 'seed_more_and_countries',
            'initial_visible': 12,
            'local_visible_before_shard': 24,
            'spain_requests_after_24': 0,
            'spain_requests_after_36': 1,
            'international_requests_after_two_countries': 1,
            'cls': round(cls, 4),
            'passed': True,
        })
        ctx.close()

        # 2) Buscar España desde la semilla parcial debe cargar la colección completa.
        ctx, page, requests, errors = fresh_page(browser)
        wait_home(page)
        target = DATA['es'][100]['name']
        page.locator('main input[type=search]').fill(target)
        page.get_by_text(target, exact=True).first.wait_for()
        assert len(requests['spain']) == 1 and not requests['international'], requests
        assert not errors, errors
        REPORT['cases'].append({'scenario': 'spain_search_loads_shard', 'spain_requests': 1, 'passed': True})
        ctx.close()

        # 3) Filtrar España también debe cargar el shard, conservando todas las opciones.
        ctx, page, requests, errors = fresh_page(browser)
        wait_home(page)
        target_terr = DATA['es'][100]['terr']
        territory = page.get_by_label('Comunidad o ciudad autónoma')
        territory.select_option(target_terr)
        page.wait_for_function('(v) => document.querySelector("main select").value === v', arg=target_terr)
        page.wait_for_timeout(150)
        assert len(requests['spain']) == 1 and not requests['international'], requests
        assert visible_cards(page) >= 1
        assert not errors, errors
        REPORT['cases'].append({'scenario': 'spain_filter_loads_shard', 'territory': target_terr, 'spain_requests': 1, 'passed': True})
        ctx.close()

        # 4) Fallo de España: 24 fichas siguen legibles, estado accesible y recuperación.
        failed = {'on': True}
        ctx, page, requests, errors = fresh_page(browser, fail_spain=failed)
        wait_home(page)
        more = page.get_by_role('button', name=re.compile(r'^Ver más fichas'))
        more.click()
        page.wait_for_function('document.querySelectorAll("main article").length >= 24')
        assert visible_cards(page) == 24 and not requests['spain']
        page.get_by_role('button', name=re.compile(r'^Ver más fichas')).click()
        status = page.locator('p[role="status"]').filter(has_text='No se han podido cargar todas las fichas de España')
        status.wait_for(state='visible')
        assert visible_cards(page) == 24
        assert len(requests['spain']) == 1
        failed['on'] = False
        page.get_by_role('button', name=re.compile(r'^Ver más fichas')).click()
        page.wait_for_function('document.querySelectorAll("main article").length >= 48')
        assert visible_cards(page) == 48
        assert len(requests['spain']) == 2
        assert 'No se han podido cargar todas las fichas de España' not in page.locator('p[role="status"]').inner_text()
        assert not errors, errors
        REPORT['cases'].append({
            'scenario': 'spain_failure_and_retry',
            'readable_on_error': 24,
            'status_role': 'status',
            'requests': 2,
            'recovered_visible': 48,
            'passed': True,
        })
        ctx.close()
        browser.close()
finally:
    server.shutdown()

REPORT['passed'] = not REPORT['failures']
print(json.dumps(REPORT, ensure_ascii=False))
if not REPORT['passed']:
    raise SystemExit(1)
