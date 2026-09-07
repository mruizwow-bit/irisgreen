#!/usr/bin/env python3
"""Prueba adicional: no basta con que el panel quepa; sus botones deben leerse."""
import functools
import json
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path.cwd();OUT=ROOT/'reports';OUT.mkdir(exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
BASE=f'http://127.0.0.1:{server.server_port}'
report={'cases':[],'failures':[],'notes':['Prueba en Chromium con recursos externos bloqueados.','La reproducción local se comprueba en una pista, no se certifica todo el catálogo.']}
with sync_playwright() as pw:
    browser=pw.chromium.launch()
    for width,height in [(320,900),(390,844),(1440,1000)]:
        for path in ['/','/es/neurodiversidad/condiciones/','/es/tramites/']:
            row={'path':path,'width':width};ctx=browser.new_context(viewport={'width':width,'height':height});page=ctx.new_page()
            page.set_default_timeout(12000)
            page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) else r.abort())
            page.add_init_script("window.__igPlayed=null;const originalPlay=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){window.__igPlayed=this;return originalPlay.apply(this,arguments)}")
            try:
                page.goto(BASE+path,wait_until='domcontentloaded');page.locator('main h1').first.wait_for();page.wait_for_timeout(500)
                row['page_width']=page.evaluate('document.documentElement.getBoundingClientRect().right')
                row['language_bounds']=page.locator('.ig-uh-langs button:visible,.langs .lang:visible').evaluate_all('(els)=>els.map(e=>({text:e.textContent.trim(),right:e.getBoundingClientRect().right,width:e.getBoundingClientRect().width}))')
                assert row['language_bounds'] and all(b['right']<=row['page_width']+1 for b in row['language_bounds']),'Selector de idioma recortado'
                if path=='/es/neurodiversidad/condiciones/':
                    initial_count=page.locator('#filtros button[data-type]').count()
                    assert initial_count==12
                trigger=page.locator('#plBtn:visible,.ig-uh-music:visible,[data-ig-music]:visible').first
                trigger.click();panel=page.locator('#ig-music-panel');panel.wait_for(state='visible')
                row['buttons']=panel.locator('.ig-m-controls button').evaluate_all('(els)=>els.map(e=>({text:e.textContent.trim(),client:e.clientWidth,scroll:e.scrollWidth}))')
                assert all(x['scroll']<=x['client']+1 for x in row['buttons']),'Texto cortado dentro de los botones de música'
                row['position']=panel.evaluate('(e)=>({position:getComputedStyle(e).position,right:getComputedStyle(e).right,bottom:getComputedStyle(e).bottom,width:e.getBoundingClientRect().width})')
                assert row['position']['position']=='fixed'
                page.screenshot(path=str(OUT/f'bounds-{path.strip("/").replace("/","-") or "home"}-{width}.png'),full_page=False)
                if width==1440 and path=='/':
                    panel.locator('.ig-m-play').click()
                    page.wait_for_function('window.__igPlayed && window.__igPlayed.currentTime>0 && !window.__igPlayed.paused')
                    row['audio_playback']=page.evaluate('({time:window.__igPlayed.currentTime,readyState:window.__igPlayed.readyState,path:new URL(window.__igPlayed.src).pathname})')
                    panel.locator('.ig-m-play').click()
                    assert page.evaluate('window.__igPlayed.paused')
                    row['audio_pause_pass']=True
                page.keyboard.press('Escape');assert not panel.is_visible()
                row['passed']=True
            except Exception as error:
                row['passed']=False;row['error']=str(error);report['failures'].append(row.copy())
            report['cases'].append(row);ctx.close()
    browser.close()
server.shutdown();report['passed']=not report['failures']
(OUT/'ui-bounds-tests.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False))
if not report['passed']:raise SystemExit(1)
