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
assert len(DYNAMIC)==25
LEGACY={'fs':2,'ls':True,'big':True,'hc':True,'guide':True,'rm':True,'tts':True}
PRESENTATION={'theme':'original','opaque':False,'focus':False,'guidePosition':'middle','guideHeight':'medium'}
EXPECTED={'version':2,'scale':1.3,'spacing':True,'controls':True,'contrast':True,'guide':True,'motion':True,'presentation':PRESENTATION}
R={'phase':args.phase,'cases':[],'failures':[],'notes':['Legacy settings are seeded only as test fixtures; interactions then use the real controls.','External domains blocked. Native speak calls are counted without replacing the page logic.','The existing reading controls are tested by identity; the newer presentation controls have their own dedicated regression batch.']}
SPY='''window.__speechCalls=0;window.__preferenceWrites=0;
if(window.SpeechSynthesis){const fn=SpeechSynthesis.prototype.speak;SpeechSynthesis.prototype.speak=function(u){window.__speechCalls++;return fn.call(this,u);};}
const store=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='ig-a11y')window.__preferenceWrites++;return store.call(this,k,v);};'''

def route(path):return '/'+path.removesuffix('index.html')
def load(page,path):
 page.goto(BASE+route(path),wait_until='domcontentloaded');page.locator('main h1').first.wait_for();page.wait_for_timeout(180)
def open_panel(page):
 page.locator('#a11yBtn:visible,.ig-uh-reading:visible').first.click()
 panel=page.locator('[data-ig-reading-panel]');panel.wait_for(state='visible');return panel
def toggles(panel):return panel.locator('button[aria-pressed]:not([data-ig-presentation-toggle]):not([data-ig-guide-position])')
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
   R['cases'].append({'page':route(path),'shared_controller':page.evaluate('!!window.IGPreferences'),'states':toggles(panel).evaluate_all('(els)=>els.map(e=>({label:e.textContent.trim(),pressed:e.getAttribute("aria-pressed")}))'),'stored':page.evaluate('localStorage.getItem("ig-a11y")'),'main_zoom':page.evaluate('getComputedStyle(document.querySelector("main")).zoom')})
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
    panel=open_panel(page);states=toggles(panel).get_attribute('aria-pressed') if toggles(panel).count()==1 else toggles(panel).evaluate_all('(els)=>els.map(e=>e.getAttribute("aria-pressed"))')
    assert states==['true','true','true','true','false','true'],states
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
    panel=open_panel(page);plus=panel.get_by_role('button',name=re.compile(r'^Tamaño del texto \+$'))
    assert plus.count()==1
    plus.click();plus.click()
    for n in [0,1,2,3,5]:toggles(panel).nth(n).click()
    assert prefs(page)==EXPECTED
    saved=page.evaluate("JSON.parse(localStorage.getItem('ig-a11y'))");assert saved==EXPECTED
    assert 'tts' not in saved and 'speak' not in saved
    close(page)
    for path in ['index.html','es/recursos/juegos/las-cinco-cosas/index.html',STATIC[2],STATIC[-1],STATIC[0]]:
     load(page,path);same_state(page)
    load(page,'index.html');panel=open_panel(page)
    page.locator('.ig-uh-langs button:visible').filter(has_text=re.compile('^EN$')).click();page.wait_for_timeout(70)
    same_state(page)
    # Focus protection may close an overlapping panel when the external language
    # control receives focus. Reopening must retain the settings and new language.
    if not panel.is_visible():panel=open_panel(page)
    assert 'remembered' in panel.inner_text()
    toggles(panel).nth(0).click();changed=dict(EXPECTED,spacing=False);assert prefs(page)==changed
    page.reload(wait_until='domcontentloaded');page.locator('main h1').first.wait_for();same_state(page,changed)
    panel=open_panel(page);plus=panel.get_by_role('button',name='A+',exact=True);plus.click();assert prefs(page)['scale']==1.5 and plus.is_disabled()
    minus=panel.get_by_role('button',name='A−',exact=True)
    if not minus.count():minus=panel.get_by_role('button',name='A−')
    # All existing templates use a Unicode minus sign or a simple hyphen.
    if not minus.count():minus=panel.locator('button').filter(has_text=re.compile(r'^A[−–-]$'))
    for _ in range(3):minus.click()
    assert prefs(page)['scale']==1 and minus.is_disabled()
    panel.get_by_role('button',name='Reset',exact=True).click()
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
   toggles(pa).nth(0).click()
   b.wait_for_function('window.IGPreferences.get().spacing===true')
   assert toggles(pb).nth(0).get_attribute('aria-pressed')=='true'
   assert b.evaluate('window.__preferenceWrites')==0,'Storage event wrote back in a loop'
   toggles(pb).nth(1).click();a.wait_for_function('window.IGPreferences.get().controls===true')
   assert toggles(pa).nth(1).get_attribute('aria-pressed')=='true'
   pb.get_by_role('button',name='Restablecer',exact=True).click();a.wait_for_function('window.IGPreferences.get().spacing===false')
   assert toggles(pa).nth(0).get_attribute('aria-pressed')=='false'
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
    panel=open_panel(page);toggles(panel).first.click();assert prefs(page)['spacing'] is True
   note_result(row,invalid);ctx.close()
  for path in [STATIC[0],'es/recursos/juegos/las-cinco-cosas/index.html']:
   ctx=context();ctx.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError')}})");page=ctx.new_page();row={'scenario':'storage blocked','path':route(path)}
   def blocked():
    errors=[];page.on('pageerror',lambda e:errors.append(str(e)));load(page,path)
    panel=open_panel(page);toggles(panel).first.click();assert prefs(page)['spacing'] is True
    assert 'no permite guardarlos' in panel.inner_text()
    assert not errors,errors
   note_result(row,blocked);ctx.close()

  row={'scenario':'presentation changes do not restart narration'};ctx=context();page=ctx.new_page()
  def no_restart():
   load(page,'index.html');panel=open_panel(page);toggles(panel).nth(4).click()
   assert page.evaluate('window.__speechCalls')==1
   toggles(panel).nth(0).click();toggles(panel).nth(2).click()
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