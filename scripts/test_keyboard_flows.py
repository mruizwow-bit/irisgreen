#!/usr/bin/env python3
"""Prueba flujos representativos de teclado para WCAG 2.1.1/2.1.2/2.4.3/4.1.3.

No pretende cubrir todas las interacciones del sitio. Comprueba que controles clave
pueden abrirse, cerrarse y recorrerse sin ratón, que Escape no atrapa el foco, que
los visores responden a las flechas y que un estado dinámico clave se anuncia sin
cambiar el foco ni el nombre del control.
"""
from __future__ import annotations

import functools
import json
import threading
import traceback
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT=Path.cwd();OUT=ROOT/'reports'/'wcag-keyboard-flows';OUT.mkdir(parents=True,exist_ok=True)

class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass

server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start();BASE=f'http://127.0.0.1:{server.server_port}'
report={'cases':[],'failures':[],'limits':['Representative interaction flows only; not a complete assistive-technology certification.']}

def record(name,route,fn):
 row={'name':name,'route':route}
 try:
  details=fn() or {}
  row.update(details);row['passed']=True
 except Exception as exc:
  row['passed']=False;row['error']=str(exc);row['traceback']=traceback.format_exc();report['failures'].append(dict(row))
 report['cases'].append(row);print(json.dumps(row,ensure_ascii=False),flush=True)

with sync_playwright() as pw:
 browser=pw.chromium.launch()

 def page_for(route,width=1280,permissions=None):
  ctx=browser.new_context(viewport={'width':width,'height':900},reduced_motion='reduce',permissions=permissions or [])
  ctx.route('**/*',lambda req:req.continue_() if req.request.url.startswith(BASE) else req.abort())
  page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(BASE+route,wait_until='domcontentloaded');page.locator('main h1').first.wait_for(timeout=15000);page.wait_for_timeout(350)
  return ctx,page,errors

 def home_reading():
  ctx,page,errors=page_for('/')
  opener=page.locator('#reading-open');opener.focus();assert page.evaluate('document.activeElement.id')=='reading-open'
  page.keyboard.press('Enter');dialog=page.locator('#reading-dialog');dialog.wait_for(state='visible');assert dialog.evaluate('(d)=>d.open') is True
  active=page.evaluate('document.activeElement.getAttribute("data-ig-reading-close") !== null');assert active
  page.keyboard.press('Escape');page.wait_for_timeout(120);assert dialog.evaluate('(d)=>d.open') is False
  assert page.evaluate('document.activeElement.id')=='reading-open';assert not errors,errors
  ctx.close();return {'focus_returned_to':'reading-open'}
 record('Portada · abrir/cerrar Lectura y devolver foco','/',home_reading)

 def mobile_menu():
  ctx,page,errors=page_for('/es/situaciones/',390)
  button=page.locator('.ig-menu-button').first;button.focus();page.keyboard.press('Enter');page.wait_for_timeout(80)
  assert button.get_attribute('aria-expanded')=='true'
  page.keyboard.press('Tab');active=page.evaluate('({tag:document.activeElement.tagName,text:(document.activeElement.innerText||document.activeElement.getAttribute("aria-label")||"").trim()})')
  assert active['tag']=='A',active
  page.keyboard.press('Escape');page.wait_for_timeout(80);assert button.get_attribute('aria-expanded')=='false'
  assert page.evaluate('document.activeElement.classList.contains("ig-menu-button")') is True;assert not errors,errors
  ctx.close();return {'first_menu_target':active}
 record('Menú móvil · Enter, Tab, Escape y devolución de foco','/es/situaciones/',mobile_menu)

 def section_reading():
  ctx,page,errors=page_for('/es/situaciones/')
  opener=page.locator('[data-ig-reading-trigger],.ig-uh-reading,#a11yBtn').first;opener.focus();page.keyboard.press('Enter');page.wait_for_timeout(120)
  assert opener.get_attribute('aria-expanded')=='true'
  panel=page.locator('[data-ig-reading-panel]').first;assert panel.is_visible()
  page.keyboard.press('Escape');page.wait_for_timeout(120);assert opener.get_attribute('aria-expanded')=='false'
  assert page.evaluate('document.activeElement===document.querySelector("[data-ig-reading-trigger],.ig-uh-reading,#a11yBtn")') is True;assert not errors,errors
  ctx.close();return {}
 record('Página de sección · Lectura por teclado sin trampa','/es/situaciones/',section_reading)

 def situations_search():
  ctx,page,errors=page_for('/es/situaciones/')
  field=page.locator('input[type=search]').first;field.focus();field.fill('ruido');page.wait_for_timeout(180)
  assert page.evaluate('document.activeElement.type')=='search'
  page.keyboard.press('Tab');state=page.evaluate('({tag:document.activeElement.tagName,text:(document.activeElement.innerText||document.activeElement.getAttribute("aria-label")||"").trim()})')
  assert state['tag'] in {'BUTTON','A','INPUT','SELECT'},state;assert not errors,errors
  ctx.close();return {'next_focus':state}
 record('Situaciones · búsqueda operable y orden de foco continúa','/es/situaciones/',situations_search)

 def flipbook_arrows():
  ctx,page,errors=page_for('/es/libros/')
  viewer=page.locator('[data-ig-flipbook="luma"]');viewer.wait_for(state='visible',timeout=15000)
  page.wait_for_function("document.querySelector('[data-ig-flipbook=\"luma\"]')?.dataset.loading === 'false'",timeout=15000)
  stage=viewer.locator('.ig-flip-stage');stage.focus();before=viewer.locator('.ig-flip-counter').inner_text()
  page.keyboard.press('ArrowRight');page.wait_for_timeout(80);after=viewer.locator('.ig-flip-counter').inner_text();assert after!=before,(before,after)
  page.keyboard.press('ArrowLeft');page.wait_for_timeout(80);back=viewer.locator('.ig-flip-counter').inner_text();assert back==before,(before,back)
  assert page.evaluate('document.activeElement.classList.contains("ig-flip-stage")') is True;assert not errors,errors
  ctx.close();return {'before':before,'after_right':after,'after_left':back}
 record('Libros · visor controlable con flechas sin perder foco','/es/libros/',flipbook_arrows)

 def tarjetas_copy_status():
  ctx,page,errors=page_for('/es/tarjetas-iris/',permissions=['clipboard-read','clipboard-write'])
  button=page.locator('#copy');status=page.locator('#copy-status')
  assert status.get_attribute('role')=='status';assert status.get_attribute('aria-live')=='polite'
  button.focus();before=button.inner_text();assert before=='Copiar texto'
  page.keyboard.press('Enter');page.wait_for_function("document.querySelector('#copy-status')?.textContent === 'Texto copiado'",timeout=5000)
  assert button.inner_text()=='Copiar texto'
  assert page.evaluate("document.activeElement?.id")=='copy'
  announced=status.inner_text();assert announced=='Texto copiado';assert not errors,errors
  ctx.close();return {'button_label':before,'announced':announced,'focus_remained_on':'copy'}
 record('Tarjetas Iris · Copiar texto anuncia estado sin mover foco','/es/tarjetas-iris/',tarjetas_copy_status)

 browser.close()
server.shutdown()
report['summary']={'cases':len(report['cases']),'passed':sum(1 for c in report['cases'] if c.get('passed')),'failures':len(report['failures'])}
(OUT/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report['summary'],ensure_ascii=False))
if report['failures']:raise SystemExit(1)
