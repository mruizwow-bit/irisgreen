#!/usr/bin/env python3
"""Full generated-page inventory plus representative live template checks."""
import functools,json,threading,re
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from bs4 import BeautifulSoup
ROOT=Path(__file__).resolve().parents[1];DIST=ROOT/'dist';OUT=ROOT/'reports/iris-brief-r08';OUT.mkdir(parents=True,exist_ok=True)
ROUTES=['/','/?lang=en','/es/recursos/','/en/resources/','/es/recursos/juegos/','/en/resources/games/','/es/recursos/rutinas-visuales/','/en/resources/visual-routines/','/es/recursos/rutinas-imprimibles/','/en/resources/printable-routines/','/es/taller/','/en/workshop/','/es/intereses/','/en/interests/','/es/sitio-tranquilo/','/en/quiet-space/','/es/neurodiversidad/condiciones/','/en/neurodiversity/conditions/']

def static():
 rows=[]
 for p in sorted(DIST.rglob('*.html')):
  s=BeautifulSoup(p.read_text(),'html.parser');rel=p.relative_to(DIST).as_posix()
  assert len(s.select('link[href^="/assets/iris-brief-r08.css?v="]'))==1,rel
  assert not s.select('img[src*="v40-brand-symbol"]'),rel
  assert 'flor de iris' not in p.read_text().lower(),rel
  rows.append({'path':rel,'language':s.html.get('lang'),'brief':True,'flower':False})
 for p in ['es/recursos/index.html','en/resources/index.html']:
  s=BeautifulSoup((DIST/p).read_text(),'html.parser');assert len(s.select('main .ri-card'))==(4 if p.startswith('es') else 3)
 for p in (ROOT/'sabik/assets/web-r01').iterdir():assert p.read_bytes()==(DIST/'sabik/assets/web-r01'/p.name).read_bytes(),p.name
 assert 'enabled:false' in (DIST/'sabik/mount-config.mjs').read_text()
 (OUT/'inventory.json').write_text(json.dumps(rows,indent=2))
 return len(rows)

def run():
 from playwright.sync_api import sync_playwright
 class Quiet(SimpleHTTPRequestHandler):
  def log_message(self,*a):pass
 server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(DIST)));threading.Thread(target=server.serve_forever,daemon=True).start()
 base=f'http://127.0.0.1:{server.server_port}';rows=[]
 try:
  with sync_playwright() as pw:
   b=pw.chromium.launch()
   for width in [1440,320]:
    for i,route in enumerate(ROUTES):
     ctx=b.new_context(viewport={'width':width,'height':950},reduced_motion='reduce');page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
     page.goto(base+route,wait_until='networkidle');page.locator('main').first.wait_for()
     assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),(route,width,'overflow')
     assert page.locator('header').count()==1,(route,'header')
     assert page.locator('img[src*="v40-brand-symbol"]').count()==0
     page.keyboard.press('Tab');assert page.evaluate('document.activeElement.tagName')!='BODY'
     row={'route':route,'width':width,'lang':page.locator('html').get_attribute('lang')}
     if i<2:
      assert row['lang']==('en' if i==1 else 'es')
      assert page.locator('#sabik-submit').is_disabled();assert page.locator('#sabik-web-master').evaluate('(el)=>el.complete&&el.naturalWidth>0')
      page.locator('#sabik-toggle').focus();page.locator('#sabik-toggle').press('Enter');assert page.locator('#sabik-widget-body').is_hidden();page.locator('#sabik-toggle').press('Enter');assert page.locator('#sabik-widget-body').is_visible()
      page.locator('#sabik-input').fill('Consulta de prueba');page.locator('#sabik-reset').click();assert page.locator('#sabik-input').input_value()=='';assert page.evaluate('document.activeElement.id')=='sabik-input'
      page.locator('#sabik-low').click();assert page.locator('#sabik-low').get_attribute('aria-pressed')=='true';page.locator('#sabik-low').click()
      assert page.locator('#sabik-hologram').get_attribute('data-motion-level')!='NORMAL'
      panel=page.locator('.sabik-panel').bounding_box();content=page.locator('.iris-home-content').bounding_box();assert (panel['x']>content['x']+content['width']-2) if width==1440 else (panel['y']>=content['y']+content['height']-2)
      page.locator('#sabik-motion-level').select_option('SIN_MOVIMIENTO')
      assert page.locator('[data-iris-top="workshop"]').get_attribute('href')==('/en/workshop/' if i==1 else '/es/taller/')
      assert page.locator('.feature-card .text').first.bounding_box()['width']>=135
      if i==0:
       page.locator('#reading-open').click()
       page.get_by_role('button',name='Alto contraste',exact=True).click()
       page.get_by_role('button',name='Botones más grandes',exact=True).click()
       page.get_by_role('button',name='Aumentar el texto',exact=True).click()
       page.get_by_role('button',name='Volver a la página',exact=True).click()
       assert page.locator('html').get_attribute('data-ig-contrast')=='on'
       assert page.locator('#sabik-reset').bounding_box()['height']>=56
       assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),(width,'reading overflow')
       page.locator('#reading-open').click()
       page.get_by_role('button',name='Restablecer ajustes',exact=True).click()
       page.get_by_role('button',name='Volver a la página',exact=True).click()
     assert not errors,(route,errors)
     page.screenshot(path=str(OUT/f'{i:02d}-{width}.png'),full_page=False)
     row['passed']=True;rows.append(row);(OUT/'browser.json').write_text(json.dumps(rows,indent=2));ctx.close()
   b.close()
 finally:server.shutdown()
 return rows
if __name__=='__main__':
 count=static();print('Inventario completo:',count);rows=run();print(json.dumps({'html':count,'browser_cases':len(rows),'passed':all(r['passed'] for r in rows)}))
