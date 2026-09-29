#!/usr/bin/env python3
import functools, threading, json, sys, traceback
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
DIST=ROOT/'dist'
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(DIST)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}'
expected={
 '/es/taller/':['Dibujo','Estructuras','Programación','Videojuegos','Mundos','Modelado 3D'],
 '/en/workshop/':['Drawing','Structures','Programming','Video games','Worlds','3D modelling'],
}
ages={
 '/es/taller/':['0–12 años','13–17 años','18 años o más','Todas las edades'],
 '/en/workshop/':['Ages 0–12','Ages 13–17','Ages 18+','All ages'],
}
rows=[]
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch()
    for route in expected:
      for width in (1440,390):
        ctx=b.new_context(viewport={'width':width,'height':900},device_scale_factor=2 if width==390 else 1)
        page=ctx.new_page(); errors=[]
        page.on('pageerror',lambda e: errors.append(str(e)))
        page.goto(base+route,wait_until='networkidle')
        page.locator('.r64-main').wait_for(timeout=10000)
        names=page.locator('.r64-card h2').all_inner_texts()
        assert names==expected[route],(route,width,'names',names)
        labels=page.locator('.r64-age-buttons button').all_inner_texts()
        assert labels==ages[route],(route,width,'ages',labels)
        assert page.locator('.r64-card').count()==6,(route,width,'card count')
        assert page.locator('html').get_attribute('data-ig-theme')=='dark',(route,width,'dark initial')
        page.locator('[data-theme="light"]').click()
        assert page.locator('html').get_attribute('data-ig-theme')=='light',(route,width,'light toggle')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),(route,width,'overflow',page.evaluate('document.documentElement.scrollWidth'),page.evaluate('innerWidth'))
        for i in range(6):
          img=page.locator('.r64-card img').nth(i)
          assert img.evaluate('(e)=>e.complete&&e.naturalWidth>0'),(route,width,'image',i)
        assert not errors,(route,width,'pageerrors',errors)
        rows.append({'route':route,'width':width,'names':names,'ages':labels,'errors':errors,'passed':True})
        ctx.close()
    b.close()
finally:
  server.shutdown()
print(json.dumps({'cases':rows,'passed':len(rows)==4},ensure_ascii=False))
