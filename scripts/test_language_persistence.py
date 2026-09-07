#!/usr/bin/env python3
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import functools,json,re,threading,traceback
from playwright.sync_api import sync_playwright
ROOT=Path.cwd();PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports/languages';OUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)));threading.Thread(target=srv.serve_forever,daemon=True).start();BASE=f'http://127.0.0.1:{srv.server_port}'
R={'cases':[],'failures':[],'notes':['Starts from a real /en/ condition page, then uses the actual global menu.','Only sections already known to have genuine in-place English content are expected to pass here.','Spanish-only families remain separate translation work and are not hidden by this test.']}

def record(row,fn):
 try:fn();row['passed']=True
 except Exception as e:row.update(passed=False,error=str(e),traceback=traceback.format_exc());R['failures'].append(row.copy())
 R['cases'].append(row);print(json.dumps(row,ensure_ascii=False),flush=True)

def load(page,path):
 page.goto(BASE+path,wait_until='domcontentloaded');page.locator('main').first.wait_for(timeout=8000);page.wait_for_timeout(220)

def menu_click(page,href):
 link=page.locator('#ig-main-nav a[href="'+href+'"]')
 assert link.count(),href
 if not link.first.is_visible():
  btn=page.locator('.ig-menu-button:visible').first
  if btn.count():btn.click();page.wait_for_timeout(60)
 link=page.locator('#ig-main-nav a[href="'+href+'"]:visible').first
 assert link.count(),'Menu target is not reachable: '+href
 link.click();page.wait_for_load_state('domcontentloaded');page.locator('main').first.wait_for(timeout=8000);page.wait_for_timeout(260)

try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch()
  # Every English static HTML should load the common interface responsible for
  # synchronising the shared language before the next navigation.
  missing=[]
  for p in sorted((PUBLIC/'en').rglob('index.html')):
   if '/assets/interfaz-comun.js' not in p.read_text(errors='replace'):missing.append('/'+p.relative_to(PUBLIC).as_posix())
  row={'test':'common language controller on English static pages','english_pages':len(list((PUBLIC/'en').rglob('index.html'))),'missing':missing}
  record(row,lambda: (_ for _ in ()).throw(AssertionError(missing)) if missing else None)

  dynamic=['/','/es/videos/','/es/libros/','/es/recursos/juegos/','/es/taller/']
  for width in [1440,390,320]:
   for target in dynamic:
    ctx=browser.new_context(viewport={'width':width,'height':900});page=ctx.new_page();page.set_default_timeout(8000)
    page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) or r.request.url.startswith(('data:','blob:')) else r.abort())
    row={'test':'English survives global-menu navigation','target':target,'width':width}
    def check():
     load(page,'/en/neurodiversity/conditions/autism/')
     assert page.evaluate("localStorage.getItem('ig_lang')")=='en','/en/ page did not persist English'
     menu_click(page,target)
     row['url']=re.sub('^'+re.escape(BASE),'',page.url);row['lang']=page.evaluate('document.documentElement.lang');row['stored']=page.evaluate("localStorage.getItem('ig_lang')")
     assert row['lang'].lower().startswith('en'),row
     assert row['stored']=='en',row
     # Dynamic pages expose the EN control. It must remain selected after navigation.
     en=page.locator('.ig-uh-langs button:visible').filter(has_text=re.compile(r'^EN$')).first
     assert en.count(),'Destination lacks the active EN switch: '+target
     style=en.get_attribute('style') or ''
     row['en_style']=style
     assert '#17395c' in style or page.evaluate('(e)=>getComputedStyle(e).backgroundColor',en)=='rgb(23, 57, 92)'
    record(row,check);ctx.close()

  # Explicit ES/EN links themselves must update the preference before navigation.
  ctx=browser.new_context(viewport={'width':390,'height':900});page=ctx.new_page();page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) else r.abort())
  row={'test':'explicit language links update shared preference'}
  def explicit():
   load(page,'/en/neurodiversity/conditions/autism/');assert page.evaluate("localStorage.getItem('ig_lang')")=='en'
   es=page.locator('nav[aria-label="Language"] a[lang^="es"]:visible').first;assert es.count();es.click();page.wait_for_load_state('domcontentloaded');page.locator('main').first.wait_for();page.wait_for_timeout(120)
   assert page.evaluate("localStorage.getItem('ig_lang')")=='es'
   en=page.locator('nav[aria-label="Idioma"] a[lang^="en"]:visible').first;assert en.count();en.click();page.wait_for_load_state('domcontentloaded');page.locator('main').first.wait_for();page.wait_for_timeout(120)
   assert page.evaluate("localStorage.getItem('ig_lang')")=='en'
  record(row,explicit);ctx.close();browser.close()
finally:srv.shutdown()
R['summary']={'tested':len(R['cases']),'passed':sum(x.get('passed',False) for x in R['cases']),'failed':len(R['failures'])};R['passed']=not R['failures'];(OUT/'language-persistence.json').write_text(json.dumps(R,ensure_ascii=False,indent=2)+'\n');print(json.dumps(R['summary'],ensure_ascii=False))
if not R['passed']:raise SystemExit(1)
