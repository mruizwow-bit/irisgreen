#!/usr/bin/env python3
"""Journey requested in the supplied study. Uses links, inputs and buttons on the
unaltered site: no direct state mutation, selector injection, screen-reader claims
or automatic audio playback. Run from the generated dist directory.
"""
import functools,json,re,threading,traceback
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
ROOT=Path.cwd();OUT=ROOT/'reports/system-accessibility';OUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start();BASE=f'http://127.0.0.1:{server.server_port}'
REPORT={'cases':[],'failures':[],'notes':['Actual links and form controls in Chromium; not a test with assistive technology users.','Mobile widths do not substitute for tests on a physical touch device.','Speech requests and audio network requests are recorded; no audible-voice claim.']}
READING='#a11yBtn:visible,.ig-uh-reading:visible,[data-ig-reading-trigger]:visible'

def ready(page):
 page.locator('main h1').first.wait_for();page.wait_for_timeout(80)

def nav(page,path):
 link=page.locator('header a[href="'+path+'"]:visible').first
 if not link.count():
  page.locator('header .ig-menu-button:visible').click()
  link=page.locator('header a[href="'+path+'"]:visible').first
 link.click();page.wait_for_url('**'+path);ready(page)

def check(page,expected,steps,label):
 actual=page.evaluate('IGPreferences.get()');assert actual==expected,(label,actual,expected)
 assert page.evaluate('document.documentElement.style.getPropertyValue("--ig-reading-scale")')==str(expected['scale'])
 assert page.evaluate('Math.max(0,document.documentElement.scrollWidth-innerWidth)')<=2,label
 assert page.evaluate('window.__igJourneySpeechCalls')==0,label
 steps.append({'step':label,'path':page.url.removeprefix(BASE),'preferences_unchanged':True,'no_horizontal_overflow':True,'no_speech_request':True})

try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch()
  for width in [1440,390,320]:
   row={'width':width,'steps':[]};audio=[];errors=[]
   ctx=browser.new_context(viewport={'width':width,'height':900});page=ctx.new_page();page.set_default_timeout(10000)
   page.add_init_script("window.__igJourneySpeechCalls=0;if(window.speechSynthesis){const original=speechSynthesis.speak.bind(speechSynthesis);speechSynthesis.speak=function(u){window.__igJourneySpeechCalls++;return original(u);};}")
   def route(r):
    if re.search(r'/audio/.*\.(m4a|mp3|wav)(\?|$)',r.request.url):audio.append(r.request.url)
    r.continue_() if r.request.url.startswith(BASE) else r.abort()
   page.route('**/*',route);page.on('pageerror',lambda e:errors.append(str(e)))
   try:
    page.goto(BASE+'/',wait_until='domcontentloaded');ready(page)
    page.locator(READING).first.click();panel=page.locator('[data-ig-reading-panel]:visible');panel.wait_for()
    plus=panel.locator('button').filter(has_text=re.compile(r'^A\+$'))
    plus.click();plus.click();panel.locator('button[aria-pressed]').first.click()
    expected=page.evaluate('IGPreferences.get()');assert expected['scale']==1.3 and expected['spacing'] is True
    page.keyboard.press('Escape');assert not panel.is_visible();check(page,expected,row['steps'],'Inicio: ajustes elegidos')
    page.locator('main input[type=search]').first.fill('autismo')
    result=page.locator('main a[href="/es/neurodiversidad/condiciones/autismo/"]:visible').first
    result.wait_for();check(page,expected,row['steps'],'Búsqueda de autismo')
    result.click();page.wait_for_url('**/es/neurodiversidad/condiciones/autismo/');ready(page);check(page,expected,row['steps'],'Ficha')
    nav(page,'/es/recursos/juegos/')
    page.locator('main a[href="/es/recursos/juegos/las-cinco-cosas/"]:visible').first.click()
    page.wait_for_url('**/es/recursos/juegos/las-cinco-cosas/');ready(page)
    page.locator('.ig-touch-alternative summary').click()
    option=page.locator('.ig-touch-choices button:visible').first;option.click();assert option.get_attribute('aria-pressed')=='true'
    check(page,expected,row['steps'],'Juego: alternativa de botones utilizada')
    nav(page,'/es/intereses/');page.locator('#temaFilters [data-tema=minerales]').click()
    assert page.locator('#album article:visible').count()>0;check(page,expected,row['steps'],'Tus intereses: minerales')
    nav(page,'/es/sitio-tranquilo/');page.locator('#startBreath').click();page.locator('#stopBreath').click()
    check(page,expected,row['steps'],'Rincón tranquilo: iniciar y detener')
    page.locator('header a[lang=en]:visible,header .langs a[href="/en/quiet-space/"]:visible').first.click()
    page.wait_for_url('**/en/quiet-space/');ready(page);assert page.evaluate('document.documentElement.lang')=='en'
    check(page,expected,row['steps'],'Idioma activo: inglés')
    page.go_back(wait_until='domcontentloaded');ready(page);assert page.url.endswith('/es/sitio-tranquilo/')
    check(page,expected,row['steps'],'Volver atrás')
    assert not audio,audio;assert not errors,errors
    row.update(passed=True,no_audio_requests=True,javascript_errors=errors)
   except Exception as error:
    row.update(passed=False,error=str(error),traceback=traceback.format_exc());REPORT['failures'].append(row.copy())
   REPORT['cases'].append(row);ctx.close()
  browser.close()
finally:
 server.shutdown();REPORT['passed']=not REPORT['failures']
 (OUT/'journey.json').write_text(json.dumps(REPORT,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(REPORT,ensure_ascii=False))
if not REPORT['passed']:raise SystemExit(1)
