#!/usr/bin/env python3
"""Full generated-page inventory plus representative live template checks."""
import functools,json,threading,re,os
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from bs4 import BeautifulSoup
ROOT=Path(__file__).resolve().parents[1];DIST=ROOT/'dist';OUT=ROOT/'reports/iris-brief-r08';OUT.mkdir(parents=True,exist_ok=True)
ROUTES=['/','/?lang=en','/es/recursos/','/en/resources/','/es/recursos/juegos/','/en/resources/games/','/es/recursos/rutinas-visuales/','/en/resources/visual-routines/','/es/recursos/rutinas-imprimibles/','/en/resources/printable-routines/','/es/taller/','/en/workshop/','/es/intereses/','/en/interests/','/es/sitio-tranquilo/','/en/quiet-space/','/es/neurodiversidad/condiciones/','/en/neurodiversity/conditions/']

CLOUD_ORIGIN='https://6ab7a2cd2cf8dc09d3ae9aca--sabik-asistente.netlify.app'

def check_r05_ui(page,lang):
 """Native activated form only; no query, mocked response or auth probe."""
 expected='Source search available' if lang=='en' else 'Consulta de fuentes disponible'
 page.wait_for_function('(s)=>document.querySelector(".sabik-state").textContent===s',arg=expected)
 field=page.get_by_role('textbox',name='What do you need?' if lang=='en' else '¿Qué necesitas?',exact=True)
 assert field.count()==1 and field.get_attribute('id')=='sabik-input'
 assert field.get_attribute('maxlength')=='300'
 help_text=page.locator('#sabik-input-help').inner_text()
 assert help_text==('Up to 300 characters. Enter adds a new line; Ctrl+Enter sends.' if lang=='en' else 'Hasta 300 caracteres. Enter añade una línea; Ctrl+Enter envía.')
 assert set(field.get_attribute('aria-describedby').split())=={'sabik-input-help','sabik-availability'}
 assert page.locator('#sabik-announcement').get_attribute('role')=='status'
 assert page.locator('#sabik-announcement').get_attribute('aria-live')=='polite'
 if lang=='en':assert 'Original quotations are in Spanish.' in page.locator('#sabik-availability').inner_text()
 submit=page.get_by_role('button',name='Send' if lang=='en' else 'Enviar',exact=True)
 assert submit.is_disabled()
 field.fill('x'*299);field.press('End');field.press('y');field.press('z')
 assert len(field.input_value())==300,'native maxlength did not limit typing'
 assert submit.is_enabled(),'nonempty query still disabled after authorized activation'
 field.press('Tab');assert submit.evaluate('(e)=>document.activeElement===e'),'submit skipped in keyboard order'
 page.locator('#sabik-reset').focus();page.locator('#sabik-reset').press('Enter')
 assert field.input_value()=='' and submit.is_disabled()
 assert field.evaluate('(e)=>document.activeElement===e')
 return {'available_label':expected,'maxlength':300,'help':help_text,'native_length_enforced':True,'send_enabled_for_nonempty_input':True,'reset_keyboard_focus':True,'query_submitted':False,'http_retrieval_verified':False}

def static():
 rows=[]
 for p in sorted(DIST.rglob('*.html')):
  s=BeautifulSoup(p.read_text(),'html.parser');rel=p.relative_to(DIST).as_posix()
  assert len(s.select('link[href^="/assets/iris-brief-r08.css?v="]'))==1,rel
  assert not s.select('img[src*="v40-brand-symbol"]'),rel
  assert 'flor de iris' not in p.read_text().lower(),rel
  rows.append({'path':rel,'language':s.html.get('lang'),'brief':True,'flower':False})
 for p in ['es/recursos/index.html','en/resources/index.html']:
  s=BeautifulSoup((DIST/p).read_text(),'html.parser')
  # R42 A1 sustituye el conteo histórico R08 por una estructura explícita:
  # cuatro etapas orientativas + cinco recursos primarios, en ES y EN.
  assert len(s.select('main .ri-stage-card'))==4,p
  assert len(s.select('main [data-r40-resource]'))==5,p
  labels=[x.get_text(' ',strip=True) for x in s.select('main .ri-stage-card h3')]
  expected=(['Infancia','Adolescencia','Adultez','Cualquier edad'] if p.startswith('es') else ['Childhood','Adolescence','Adulthood','Any age'])
  assert labels==expected,(p,labels)
 for p in (ROOT/'sabik/assets/web-r01').iterdir():assert p.read_bytes()==(DIST/'sabik/assets/web-r01'/p.name).read_bytes(),p.name
 config=(DIST/'sabik/mount-config.mjs').read_text()
 assert "enabled:true,cloudOrigin:'"+CLOUD_ORIGIN+"'" in config
 assert "sourceLanguage:'es'" in config
 assert (ROOT/'sabik/mount-config.mjs').read_bytes()==(DIST/'sabik/mount-config.mjs').read_bytes()
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
   launch={}
   if os.environ.get('IRIS_AUDIT_BROWSER'):launch['executable_path']=os.environ['IRIS_AUDIT_BROWSER']
   b=pw.chromium.launch(**launch)
   for width in [1440,320]:
    for i,route in enumerate(ROUTES):
     ctx=b.new_context(viewport={'width':width,'height':950},reduced_motion='reduce');page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
     cloud_requests=[];page.on('request',lambda request:cloud_requests.append(True) if request.url.startswith(CLOUD_ORIGIN) else None)
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
      row['r05_connection_ui']=check_r05_ui(page,row['lang'])
      assert not cloud_requests,'Cloud contacted before an explicit query'
      row['r05_connection_ui']['automatic_cloud_requests']=0
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
