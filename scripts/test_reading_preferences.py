#!/usr/bin/env python3
"""Real reading-control tests. Navigation uses the real pages; settings are changed
through their buttons. Source inspection is separate from browser verification.
No remote services are needed; this does not certify voices or screen readers.
"""
from pathlib import Path
import argparse,functools,json,re,threading,traceback
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
ROOT=Path.cwd();OUT=ROOT/'reports/preferences';OUT.mkdir(parents=True,exist_ok=True)
parser=argparse.ArgumentParser();parser.add_argument('--phase',choices=['before','after'],default='after');args=parser.parse_args()
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start();BASE=f'http://127.0.0.1:{server.server_port}'
STATIC=['es/neurodiversidad/condiciones/index.html','es/neurodiversidad/condiciones/autismo/index.html','es/situaciones/index.html','es/intereses/index.html','es/sitio-tranquilo/index.html','en/neurodiversity/conditions/index.html']
DYNAMIC=[p.relative_to(ROOT).as_posix() for p in [ROOT/'index.html',*sorted((ROOT/'es').rglob('index.html'))] if '  setReading(patch)' in p.read_text()]
# Cuantas paginas traen su propia implementacion del panel de lectura. Depende de los
# datos y baja cuando una pagina pasa al controlador compartido, que es una mejora, asi
# que se informa y no se afirma con un numero. Un 25 escrito aqui suspendia la
# comprobacion entera cada vez que eso pasaba. Informe 2026-09-11, pregunta 4.
assert DYNAMIC,'No encuentro ninguna pagina con implementacion propia del panel de lectura'
LEGACY={'fs':2,'ls':True,'big':True,'hc':True,'guide':True,'rm':True,'tts':True}
EXPECTED={'version':2,'scale':1.3,'spacing':True,'controls':True,'contrast':True,'guide':True,'motion':True}
R={'phase':args.phase,'paginas_con_panel_propio':len(DYNAMIC),'cases':[],'failures':[],'notes':['Legacy settings are seeded only as test fixtures; interactions then use the real controls.','External domains blocked. Native speak calls are counted without replacing the page logic.','The seven existing controls are consolidated; extra typefaces and voice features are not part of this batch.']}
SPY='''window.__speechCalls=0;window.__preferenceWrites=0;
if(window.SpeechSynthesis){const fn=SpeechSynthesis.prototype.speak;SpeechSynthesis.prototype.speak=function(u){window.__speechCalls++;return fn.call(this,u);};}
const store=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='ig-a11y')window.__preferenceWrites++;return store.call(this,k,v);};'''

def route(path):return '/'+path.removesuffix('index.html')
def load(page,path):
 page.goto(BASE+route(path),wait_until='domcontentloaded');page.locator('main h1').first.wait_for();page.wait_for_timeout(180)
def open_panel(page):
 page.locator('[data-ig-reading-trigger]:visible,#a11yBtn:visible,.ig-uh-reading:visible').first.click()
 panel=page.locator('[data-ig-reading-panel]');panel.wait_for(state='visible');return panel

def named_or_attr(panel,selector,pattern,label):
 b=panel.locator(selector).first
 if b.count():return b
 b=panel.get_by_role('button',name=re.compile(pattern,re.I)).first
 assert b.count()==1,(label,panel.inner_text());return b

def pref_button(panel,key):
 selectors={
  'spacing':('button[data-pref="spacing"],button[data-a="ls"]',r'Más espacio|Letra más separada|More space|More letter spacing|Wider letter spacing'),
  'controls':('button[data-pref="controls"],button[data-a="big"]',r'Botones más grandes|Larger buttons|Bigger buttons'),
  'contrast':('button[data-pref="contrast"],button[data-a="hc"]',r'Alto contraste|Más contraste|High contrast|More contrast'),
  'guide':('button[data-pref="guide"],button[data-a="guide"]',r'Guía de lectura|Reading guide'),
  'motion':('button[data-pref="motion"],button[data-a="rm"]',r'Reducir movimiento|Reduce motion'),
 }
 selector,pattern=selectors[key];return named_or_attr(panel,selector,pattern,key)

def speech_button(panel):
 return named_or_attr(panel,'#speak,button[data-a="tts"]',r'Escuchar esta página|Leer en voz alta|Listen to this page|Read aloud','speech')

def size_button(panel,direction):
 if direction>0:return named_or_attr(panel,'button[data-size="1"],button[data-a="fs+"]',r'A\+|Aumentar el texto|Tamaño del texto \+|Increase text size|Text size \+','size +')
 return named_or_attr(panel,'button[data-size="-1"],button[data-a="fs-"]',r'A[−–-]|Reducir el texto|Tamaño del texto [−–-]|Decrease text size|Text size [−–-]','size -')

def reset_button(panel):
 return named_or_attr(panel,'#reset,button[data-a="reset"]',r'Restablecer ajustes|Restablecer|Reset settings|Reset','reset')

def language_en(page):
 b=page.locator('[data-lang="en"]:visible,.ig-uh-langs button:visible').filter(has_text=re.compile(r'^EN$')).first
 assert b.count()==1;return b

def panel_states(panel):
 return {k:pref_button(panel,k).get_attribute('aria-pressed') for k in ['spacing','controls','contrast','guide','motion']}
def prefs(page):return page.evaluate('window.IGPreferences.get()')
def close(page):page.keyboard.press('Escape');page.wait_for_timeout(50)
def same_state(page,expected=EXPECTED):
 assert prefs(page)==expected,(prefs(page),expected)
 assert page.evaluate('getComputedStyle(document.querySelector("main")).zoom')==str(expected['scale']),page.evaluate('getComputedStyle(document.querySelector("main")).zoom')
 assert not page.evaluate('window.IGPreferences.speechOn()')
 assert page.evaluate('window.__speechCalls')==0,'Speech invoked without an action'

def note_result(row,fn):
 try:fn();row['passed']=True
 except Exception as error:row['passed']=False;row['error']=str(error);row['traceback']=traceback.format_exc();R['failures'].append(row.copy())
 R['cases'].append(row);print(json.dumps(row,ensure_ascii=False),flush=True)

with sync_playwright() as pw:
 browser=pw.chromium.launch()
 def context(width=390,legacy=None):
  ctx=browser.new_context(viewport={'width':width,'height':900},reduced_motion='reduce');ctx.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) else r.abort())
  if legacy is not None:ctx.add_init_script("try{if(!sessionStorage.getItem('seeded')){localStorage.setItem('ig-a11y',"+json.dumps(json.dumps(legacy))+ ");sessionStorage.setItem('seeded','1');}}catch(_){}")
  ctx.add_init_script(SPY);return ctx
 if args.phase=='before':
  ctx=context(320,LEGACY);page=ctx.new_page()
  for path in [STATIC[0],'index.html','es/recursos/juegos/las-cinco-cosas/index.html']:
   load(page,path);panel=open_panel(page)
   R['cases'].append({'page':route(path),'shared_controller':page.evaluate('!!window.IGPreferences'),'states':panel_states(panel),'stored':page.evaluate('localStorage.getItem("ig-a11y")'),'main_zoom':page.evaluate('getComputedStyle(document.querySelector("main")).zoom')})
  ctx.close()
 else:
  # Every distinct dynamic implementation, plus representative static families.
  for path in DYNAMIC+STATIC:
   ctx=context(320,LEGACY);page=ctx.new_page();errors=[];audio=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.on('request',lambda r:audio.append(r.url) if re.search(r'/audio/.*\.(mp3|m4a|wav)',r.url) else None)
   row={'scenario':'restore existing preferences','path':route(path),'width':320}
   def restore():
    load(page,path);same_state(page)
    panel=open_panel(page);states=[pref_button(panel,k).get_attribute('aria-pressed') for k in ['spacing','controls','contrast','guide','motion']]
    assert states==['true','true','true','true','true'],states
    assert not page.evaluate('window.IGPreferences.speechOn()')
    b=panel.bounding_box();assert b['x']>=-1 and b['x']+b['width']<=320
    row['overflow']=page.evaluate('Math.max(0,document.documentElement.scrollWidth-innerWidth)')
    assert row['overflow']<=2,('Combined preferences overflow',row['overflow'])
    assert page.locator('#rguide:visible,#ig-guide:visible').count()==1
    assert page.evaluate('getComputedStyle(document.querySelector("main")).filter')=='none','Contrast changes the image colours'
    assert not errors,errors
    assert not audio,audio
    if path in ['index.html',STATIC[0],'es/intereses/index.html']:page.screenshot(path=str(OUT/('restored-'+path.replace('/','-')+'.png')))
    row['same_visible_state']=True
   note_result(row,restore);ctx.close()

  # Round trip, boundaries, retained favourites, current language, reload and reset.
  for width in [1440,390,320]:
   ctx=context(width);page=ctx.new_page();row={'scenario':'round trip and reset','width':width}
   def roundtrip():
    load(page,STATIC[0]);page.evaluate("localStorage.setItem('ig_saved_b','[]');localStorage.setItem('ig_saved_videos','[]');localStorage.setItem('private-document','Texto del visitante');")
    panel=open_panel(page);plus=size_button(panel,1);plus.click();plus.click()
    for key in ['spacing','controls','contrast','guide','motion']:pref_button(panel,key).click()
    assert prefs(page)==EXPECTED
    saved=page.evaluate("JSON.parse(localStorage.getItem('ig-a11y'))");assert saved==EXPECTED
    assert 'tts' not in saved and 'speak' not in saved
    close(page)
    for path in ['index.html','es/recursos/juegos/las-cinco-cosas/index.html',STATIC[2],STATIC[-1],STATIC[0]]:
     load(page,path);same_state(page)
    load(page,'index.html');panel=open_panel(page)
    if panel.evaluate('p=>p.tagName==="DIALOG"'):close(page)
    language_en(page).click();page.wait_for_timeout(70)
    if not panel.is_visible():panel=open_panel(page)
    same_state(page)
    # Focus protection may close an overlapping panel when the external language
    # control receives focus. Reopening must retain the settings and new language.
    if not panel.is_visible():panel=open_panel(page)
    assert 'remembered' in panel.inner_text()
    pref_button(panel,'spacing').click();changed=dict(EXPECTED,spacing=False);assert prefs(page)==changed
    page.reload(wait_until='domcontentloaded');page.locator('main h1').first.wait_for();same_state(page,changed)
    panel=open_panel(page);plus=size_button(panel,1);plus.click();assert prefs(page)['scale']==1.5 and plus.is_disabled()
    minus=size_button(panel,-1)
    for _ in range(3):minus.click()
    assert prefs(page)['scale']==1 and minus.is_disabled()
    reset_button(panel).click()
    assert prefs(page)==dict(EXPECTED,scale=1,spacing=False,controls=False,contrast=False,guide=False,motion=False)
    assert page.evaluate("localStorage.getItem('private-document')")=='Texto del visitante'
    assert page.evaluate("localStorage.getItem('ig_saved_b')")=='[]'
    assert page.evaluate("localStorage.getItem('ig_saved_videos')")=='[]'
    assert page.evaluate("localStorage.getItem('ig_lang')")=='en'
    row['navigation_paths']=5;row['unrelated_data_preserved']=True;row['boundaries']=True
   note_result(row,roundtrip);ctx.close()

  row={'scenario':'real synchronization between two tabs'};ctx=context();a=ctx.new_page();b=ctx.new_page()
  def tabs():
   load(a,STATIC[0]);load(b,'index.html');pa=open_panel(a);pb=open_panel(b)
   pref_button(pa,'spacing').click()
   b.wait_for_function('window.IGPreferences.get().spacing===true')
   assert pref_button(pb,'spacing').get_attribute('aria-pressed')=='true'
   assert b.evaluate('window.__preferenceWrites')==0,'Storage event wrote back in a loop'
   pref_button(pb,'controls').click();a.wait_for_function('window.IGPreferences.get().controls===true')
   assert pref_button(pa,'controls').get_attribute('aria-pressed')=='true'
   reset_button(pb).click();a.wait_for_function('window.IGPreferences.get().spacing===false')
   assert pref_button(pa,'spacing').get_attribute('aria-pressed')=='false'
   assert b.evaluate('window.__speechCalls')==a.evaluate('window.__speechCalls')==0
  note_result(row,tabs);ctx.close()

  # Denied persistence, invalid JSON/types/oversized payload; no crashing or lost UI.
  fixtures=['{invalid', '[]','null','123',json.dumps({'fs':99,'tts':True}),json.dumps({'version':2,'scale':-100,'spacing':'true'}),'x'*9000]
  for n,raw in enumerate(fixtures):
   ctx=context();ctx.add_init_script('try{localStorage.setItem("ig-a11y",'+json.dumps(raw)+')}catch(_){}');page=ctx.new_page()
   row={'scenario':'invalid stored value','fixture':n}
   def invalid():
    load(page,STATIC[0]);assert prefs(page)==dict(EXPECTED,scale=1,spacing=False,controls=False,contrast=False,guide=False,motion=False)
    assert page.evaluate('window.__speechCalls')==0
    panel=open_panel(page);pref_button(panel,'spacing').click();assert prefs(page)['spacing'] is True
   note_result(row,invalid);ctx.close()
  for path in [STATIC[0],'es/recursos/juegos/las-cinco-cosas/index.html']:
   ctx=context();ctx.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError')}})");page=ctx.new_page();row={'scenario':'storage blocked','path':route(path)}
   def blocked():
    errors=[];page.on('pageerror',lambda e:errors.append(str(e)));load(page,path)
    panel=open_panel(page);pref_button(panel,'spacing').click();assert prefs(page)['spacing'] is True
    assert 'no permite guardarlos' in panel.inner_text()
    assert not errors,errors
   note_result(row,blocked);ctx.close()

  row={'scenario':'presentation changes do not restart narration'};ctx=context();page=ctx.new_page()
  def no_restart():
   load(page,'index.html');panel=open_panel(page);speech_button(panel).click()
   assert page.evaluate('window.__speechCalls')==1
   pref_button(panel,'spacing').click();pref_button(panel,'contrast').click()
   assert page.evaluate('window.__speechCalls')==1,'Narration restarted by a visual setting'
   page.reload(wait_until='domcontentloaded');page.locator('main h1').first.wait_for()
   assert page.evaluate('window.__speechCalls')==0 and not page.evaluate('window.IGPreferences.speechOn()')
   row['voice_after_reload']=False
  note_result(row,no_restart);ctx.close()
 browser.close()
server.shutdown()
R['summary']={'tested':len(R['cases']),'passed':sum(c.get('passed',False) for c in R['cases']),'failures':len(R['failures'])};R['passed']=not R['failures']
(OUT/(args.phase+'.json')).write_text(json.dumps(R,ensure_ascii=False,indent=2)+'\n')
if args.phase=='after' and not R['passed']:raise SystemExit(1)
