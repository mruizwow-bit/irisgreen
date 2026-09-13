#!/usr/bin/env python3
"""Prueba real de la primera carga y de la carga perezosa del Directorio.

La primera pantalla debe usar exclusivamente los datos de España ya incrustados y
publicar las precargas de las tres tipografías críticas. El JSON completo se descarga
al elegir el primer país extranjero y se reutiliza para los siguientes cambios.
Lighthouse mantiene la comprobación de CLS con throttling móvil realista.
"""
from __future__ import annotations

import functools
import json
import threading
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

ROOT=Path.cwd()
DATA=json.loads((ROOT/'es/tramites/directorio/tramites-datos.json').read_text(encoding='utf-8'))

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass

server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}'
requests=[]
errors=[]

with sync_playwright() as pw:
    browser=pw.chromium.launch()
    ctx=browser.new_context(viewport={'width':412,'height':823})
    page=ctx.new_page()
    page.add_init_script('''() => {
      window.__igDirectoryCLS = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__igDirectoryCLS += entry.value;
        }
      }).observe({type: 'layout-shift', buffered: true});
    }''')
    page.on('pageerror',lambda e:errors.append(str(e)))
    def seen(req):
        if urlparse(req.url).path.endswith('/es/tramites/directorio/tramites-datos.json'):
            requests.append(req.url)
    page.on('request',seen)
    page.goto(base+'/es/tramites/directorio/',wait_until='domcontentloaded')
    page.locator('main h1').first.wait_for(timeout=15000)
    page.get_by_text(DATA['es'][0]['name'],exact=True).first.wait_for(timeout=15000)
    page.wait_for_timeout(700)
    cls=float(page.evaluate('window.__igDirectoryCLS || 0'))
    preloads=page.locator('link[data-ig-directory-font-preload][rel="preload"][as="font"]')
    assert preloads.count()==3,f'Se esperaban 3 precargas tipográficas; hay {preloads.count()}'
    assert cls < 0.1,f'CLS sin throttling del Directorio demasiado alto: {cls:.4f}'
    assert requests==[],f'El JSON internacional se descargó al abrir la página: {requests}'

    page.get_by_role('button',name='Reino Unido',exact=True).click()
    page.get_by_text(DATA['uk'][0]['name'],exact=True).first.wait_for(timeout=15000)
    page.wait_for_timeout(100)
    assert len(requests)==1,f'Se esperaba una descarga al elegir Reino Unido; obtenidas {len(requests)}'

    page.get_by_role('button',name='Brasil',exact=True).click()
    page.get_by_text(DATA['br'][0]['name'],exact=True).first.wait_for(timeout=15000)
    page.wait_for_timeout(100)
    assert len(requests)==1,f'Cambiar a Brasil volvió a descargar el mismo JSON: {requests}'
    assert not errors,errors
    ctx.close();browser.close()
server.shutdown()
print(json.dumps({'viewport':'412x823','cls_sin_throttling':round(cls,4),'precargas_fuente':3,'inicial_json_completo':0,'tras_reino_unido':1,'tras_brasil':1,'reutiliza_datos':True},ensure_ascii=False))
