#!/usr/bin/env python3
"""Visual regressions reported by Maria: header, width, fonts and book pages."""
import functools,threading,json,hashlib
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'reports/iris-r09';OUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
rows=[]
try:
 with sync_playwright() as p:
  browser=p.chromium.launch()
  for width in [1920,1440,320]:
   for route in ['/','/?lang=en','/es/recursos/','/en/resources/','/es/intereses/','/en/interests/','/es/taller/','/en/workshop/','/es/biblioteca/','/es/libros/']:
    ctx=browser.new_context(viewport={'width':width,'height':1000},reduced_motion='reduce');page=ctx.new_page();page.goto(base+route,wait_until='networkidle');page.locator('main h1').first.wait_for()
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),(route,width,'overflow')
    family=page.locator('main h1').first.evaluate('(e)=>getComputedStyle(e).fontFamily');assert 'Newsreader' in family,(route,family)
    if width>=1440:
     if page.locator('header.hd').count():
      centers=page.locator('header.hd').evaluate('(h)=>[...h.children].filter(e=>e.matches(".brand,.nav,.tools,.langs")&&e.getBoundingClientRect().width).map(e=>{const r=e.getBoundingClientRect();return r.y+r.height/2})')
      assert max(centers)-min(centers)<3,(route,width,centers)
     if route.startswith('/') and route in ['/','/?lang=en']:
      home=page.locator('#home-view').bounding_box();assert home['width']>width*.95,(width,home)
    if width==1920 or width==320:page.screenshot(path=str(OUT/f'{len(rows):02d}-{width}.png'))
    rows.append({'route':route,'width':width,'font':family,'passed':True});ctx.close()
  ctx=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce');page=ctx.new_page();page.goto(base+'/es/libros/',wait_until='networkidle')
  for book,count in [('luma',8),('autismo',7)]:
   viewer=page.locator('#'+book+'-muestra');viewer.wait_for();viewer.locator('.ig-flip-page').wait_for();hashes=[]
   for i in range(count):
    viewer.locator('[data-ig-flip-next]').click();frame=viewer.locator('.ig-flip-sprite');frame.wait_for()
    frame.evaluate('(e)=>new Promise((resolve,reject)=>{const image=new Image();image.onload=resolve;image.onerror=reject;image.src=getComputedStyle(e).backgroundImage.slice(5,-2)})')
    pos=frame.evaluate('(e)=>getComputedStyle(e).backgroundPositionY');assert pos==f'{i/(count-1)*100:g}%' or abs(float(pos[:-1])-i/(count-1)*100)<.01,pos
    shot=frame.screenshot();hashes.append(hashlib.sha256(shot).hexdigest())
    if i in [0,count-1]:(OUT/f'{book}-{i+2}.png').write_bytes(shot)
   assert len(set(hashes))==count,(book,'repeated page pixels',hashes)
   assert viewer.locator('[data-ig-flip-next]').is_disabled()
   viewer.locator('.ig-flip-stage').focus();page.keyboard.press('ArrowLeft');assert viewer.get_attribute('data-page')==str(count-1)
   rows.append({'book':book,'distinct_rendered_pages':count,'passed':True})
  browser.close()
finally:server.shutdown()
(OUT/'results.json').write_text(json.dumps(rows,indent=2));print(json.dumps(rows))
