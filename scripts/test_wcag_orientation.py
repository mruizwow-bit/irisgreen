#!/usr/bin/env python3
"""Regresión de navegador para WCAG 1.3.4 Orientation.

Comprueba rutas representativas en portrait y landscape sin recargar contenido
especial ni forzar orientación. También registra cualquier intento de usar
Screen Orientation API lock(), que requeriría revisión por una posible restricción.
"""
from __future__ import annotations

import functools,json,threading,traceback
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path.cwd();OUT=ROOT/'reports'/'wcag-orientation';OUT.mkdir(parents=True,exist_ok=True)
ROUTES=['/','/es/situaciones/','/es/neurodiversidad/condiciones/','/es/biblioteca/','/es/investigacion/','/es/datos/','/es/tramites/directorio/','/es/libros/','/es/videos/','/es/recursos/juegos/','/es/intereses/','/es/taller/','/es/sitio-tranquilo/']
VIEWPORTS={'portrait':{'width':390,'height':844},'landscape':{'width':844,'height':390}}
SPY=r'''
window.__igOrientationLocks=[];
try{
 if(screen.orientation&&typeof screen.orientation.lock==='function'){
  const original=screen.orientation.lock.bind(screen.orientation);
  screen.orientation.lock=function(value){window.__igOrientationLocks.push(String(value));return original(value)};
 }
}catch(_){}
'''

class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start();BASE=f'http://127.0.0.1:{server.server_port}'
report={'criterion':'WCAG 2.2 SC 1.3.4 Orientation','cases':[],'failures':[],'limits':['Representative routes only; hardware-specific orientation behavior is not simulated.']}
with sync_playwright() as pw:
 browser=pw.chromium.launch()
 for route in ROUTES:
  for name,viewport in VIEWPORTS.items():
   row={'route':route,'orientation':name,'viewport':viewport}
   try:
    ctx=browser.new_context(viewport=viewport,reduced_motion='reduce');ctx.add_init_script(SPY)
    ctx.route('**/*',lambda req:req.continue_() if req.request.url.startswith(BASE) else req.abort())
    page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(BASE+route,wait_until='domcontentloaded');page.locator('main h1').first.wait_for(timeout=15000);page.wait_for_timeout(250)
    state=page.evaluate("""() => {const m=document.getElementById('main')||document.querySelector('main');const h=document.querySelector('main h1');const mr=m&&m.getBoundingClientRect(),hr=h&&h.getBoundingClientRect();return {mainVisible:!!(m&&mr.width>0&&mr.height>0&&getComputedStyle(m).display!=='none'),h1Visible:!!(h&&hr.width>0&&hr.height>0&&getComputedStyle(h).display!=='none'),locks:window.__igOrientationLocks||[],docWidth:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth),viewportWidth:innerWidth}}""")
    row.update(state);row['page_errors']=errors
    assert state['mainVisible'] and state['h1Visible'],state
    assert not state['locks'],state['locks']
    assert not errors,errors
    row['passed']=True;ctx.close()
   except Exception as exc:
    row['passed']=False;row['error']=str(exc);row['traceback']=traceback.format_exc();report['failures'].append(dict(row))
   report['cases'].append(row);print(json.dumps(row,ensure_ascii=False),flush=True)
 browser.close()
server.shutdown()
report['summary']={'cases':len(report['cases']),'passed':sum(1 for c in report['cases'] if c.get('passed')),'failures':len(report['failures'])}
(OUT/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(json.dumps(report['summary'],ensure_ascii=False))
if report['failures']:raise SystemExit(1)
