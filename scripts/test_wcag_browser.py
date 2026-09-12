#!/usr/bin/env python3
"""Pruebas de navegador para una parte verificable de WCAG 2.2 AA.

Comprueba en rutas representativas:
- reflow a 320 CSS px sin scroll horizontal global (aproxima 400 % a 1280 px);
- espaciado de texto de WCAG 1.4.12 sin scroll global ni texto recortado;
- aumento del texto al 200 % como prueba de regresión de redimensionado;
- enlace de salto al contenido y foco visible durante navegación por teclado.

No certifica lectores de pantalla, voz, braille, comprensión ni pruebas con personas.
"""
from __future__ import annotations

import functools
import json
import re
import threading
import traceback
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path.cwd()
OUT=ROOT/'reports'/'wcag-browser';OUT.mkdir(parents=True,exist_ok=True)
ROUTES=[
 '/', '/es/situaciones/', '/es/situaciones/la-ropa-me-molesta/',
 '/en/situations/clothes-feel-unbearable/',
 '/es/neurodiversidad/condiciones/', '/es/neurodiversidad/condiciones/autismo/',
 '/en/neurodiversity/conditions/autism/', '/es/biblioteca/',
 '/es/investigacion/', '/es/datos/', '/es/datos/autismo-en-la-poblacion/',
 '/en/data/autism-in-the-population/', '/es/tramites/directorio/', '/es/libros/',
 '/es/videos/', '/es/recursos/juegos/', '/es/recursos/juegos/las-cinco-cosas/',
 '/es/intereses/', '/es/taller/', '/es/sitio-tranquilo/'
]
TEXT_SPACING='''
*:not(svg):not(svg *){letter-spacing:.12em!important;word-spacing:.16em!important;line-height:1.5!important}
p{margin-bottom:2em!important}
'''

class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass

server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
BASE=f'http://127.0.0.1:{server.server_port}'

JS_CLIPPED='''() => Array.from(document.querySelectorAll('body *')).filter(el=>{
 const cs=getComputedStyle(el),r=el.getBoundingClientRect();
 if(cs.display==='none'||cs.visibility==='hidden'||r.width<2||r.height<2||el.closest('[hidden],[aria-hidden="true"]'))return false;
 const text=(el.childNodes.length===1&&el.firstChild?.nodeType===3?(el.textContent||'').trim():'');
 if(!text)return false;
 const ox=cs.overflowX,oy=cs.overflowY;
 return ((ox==='hidden'||ox==='clip')&&el.scrollWidth>el.clientWidth+2)||((oy==='hidden'||oy==='clip')&&el.scrollHeight>el.clientHeight+2);
}).slice(0,12).map(el=>({tag:el.tagName,id:el.id,cls:String(el.className||'').slice(0,80),text:(el.textContent||'').trim().slice(0,100),sw:el.scrollWidth,cw:el.clientWidth,sh:el.scrollHeight,ch:el.clientHeight}))'''
JS_OVERFLOW='''() => ({doc:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth),viewport:innerWidth,overflow:Math.max(0,Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth)})'''
JS_FOCUS='''() => {const e=document.activeElement;if(!e||e===document.body)return {ok:false,tag:'BODY'};const c=getComputedStyle(e),r=e.getBoundingClientRect();const ring=parseFloat(c.outlineWidth||0)>0||c.boxShadow!=='none';return {ok:ring,tag:e.tagName,id:e.id,cls:String(e.className||'').slice(0,80),text:(e.innerText||e.getAttribute('aria-label')||'').trim().slice(0,80),outline:c.outline,boxShadow:c.boxShadow,rect:[r.x,r.y,r.width,r.height]}}'''

report={'routes':ROUTES,'cases':[],'failures':[],'limits':['No reader-screen or assistive-technology certification.','320 CSS px is used for reflow; browser zoom itself is not programmatically certified.','Text 200% is simulated by doubling root font size, not by changing browser UI zoom.']}

def add(row,fn):
 try:fn();row['passed']=True
 except Exception as exc:row['passed']=False;row['error']=str(exc);row['traceback']=traceback.format_exc();report['failures'].append(dict(row))
 report['cases'].append(row);print(json.dumps(row,ensure_ascii=False),flush=True)

with sync_playwright() as pw:
 browser=pw.chromium.launch()
 for route in ROUTES:
  ctx=browser.new_context(viewport={'width':320,'height':900},reduced_motion='reduce')
  ctx.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) else r.abort())
  page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  def load():
   page.goto(BASE+route,wait_until='domcontentloaded');page.locator('main h1').first.wait_for(timeout=15000);page.wait_for_timeout(120)
  row={'scenario':'reflow 320','route':route}
  def reflow():
   load();o=page.evaluate(JS_OVERFLOW);row.update(o);assert o['overflow']<=2,o
   assert not errors,errors
   skip=page.locator('a[href="#main"]:visible').first;assert skip.count()==1,'sin salto visible al foco'
   assert page.locator('#main').count()==1,'sin destino #main'
  add(row,reflow)

  row={'scenario':'text spacing','route':route}
  def spacing():
   page.add_style_tag(content=TEXT_SPACING);page.wait_for_timeout(80);o=page.evaluate(JS_OVERFLOW);row.update(o);assert o['overflow']<=2,o
   clipped=page.evaluate(JS_CLIPPED);row['clipped']=clipped;assert not clipped,clipped
  add(row,spacing)

  row={'scenario':'text resize 200%','route':route}
  def resize():
   # Nueva carga para que la prueba de tamaño no herede el espaciado anterior.
   load();page.add_style_tag(content='html{font-size:200%!important}');page.wait_for_timeout(80);o=page.evaluate(JS_OVERFLOW);row.update(o);assert o['overflow']<=2,o
   clipped=page.evaluate(JS_CLIPPED);row['clipped']=clipped;assert not clipped,clipped
  add(row,resize)

  if route in ['/', '/es/situaciones/', '/es/neurodiversidad/condiciones/', '/es/tramites/directorio/', '/es/libros/']:
   row={'scenario':'keyboard focus','route':route,'steps':[]}
   def keyboard():
    load();seen=[]
    for _ in range(12):
     page.keyboard.press('Tab');f=page.evaluate(JS_FOCUS);row['steps'].append(f)
     if f['tag']!='BODY':seen.append((f['tag'],f.get('id'),f.get('text')))
     assert f['ok'],f
    assert len(set(seen))>=4,seen
    assert row['steps'][0]['tag']=='A' and ('contenido' in row['steps'][0]['text'].lower() or 'content' in row['steps'][0]['text'].lower()),row['steps'][0]
   add(row,keyboard)
  ctx.close()
 browser.close()
server.shutdown()
report['summary']={'cases':len(report['cases']),'passed':sum(c.get('passed',False) for c in report['cases']),'failures':len(report['failures'])}
report['passed']=not report['failures']
(OUT/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report['summary'],ensure_ascii=False))
if report['failures']:raise SystemExit(1)
