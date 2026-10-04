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
R={'cases':[],'failures':[],'notes':['Starts from a real /en/ condition page and verifies the canonical R49 language state across shared and separate English surfaces.','This gate checks language persistence/runtime parity; it does not claim that every public document has a translated counterpart.','Declared ES/EN document pairs are covered separately by the SEO/hreflang oracle.']}

def record(row,fn):
 try:fn();row['passed']=True
 except Exception as e:row.update(passed=False,error=str(e),traceback=traceback.format_exc());R['failures'].append(row.copy())
 R['cases'].append(row);print(json.dumps(row,ensure_ascii=False),flush=True)

def load(page,path):
 page.goto(BASE+path,wait_until='domcontentloaded');page.locator('main').first.wait_for(timeout=8000);page.wait_for_timeout(220)

try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch()
  missing=[]
  for p in sorted((PUBLIC/'en').rglob('index.html')):
   if '/assets/interfaz-comun.js' not in p.read_text(errors='replace'):missing.append('/'+p.relative_to(PUBLIC).as_posix())
  row={'test':'common language controller on English static pages','english_pages':len(list((PUBLIC/'en').rglob('index.html'))),'missing':missing}
  record(row,lambda: (_ for _ in ()).throw(AssertionError(missing)) if missing else None)

  # Shared bilingual surfaces intentionally keep their /es/ route and derive EN
  # from the persisted language state. Separate surfaces use their native /en/ route.
  dynamic=[
   '/',
   '/es/videos/','/es/investigacion/','/es/tramites/directorio/','/es/libros/','/es/recursos/juegos/','/es/taller/',
   '/en/neurodiversity/conditions/','/en/situations/','/en/everyday-life/','/en/data/','/en/resources/','/en/interests/','/en/workshop/','/en/quiet-space/'
  ]
  for width in [1440,390,320]:
   ctx=browser.new_context(viewport={'width':width,'height':900});page=ctx.new_page();page.set_default_timeout(8000)
   page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) or r.request.url.startswith(('data:','blob:')) else r.abort())
   load(page,'/en/neurodiversity/conditions/autism/')
   assert page.evaluate("localStorage.getItem('ig_lang')")=='en','/en/ page did not persist English'
   for target in dynamic:
    row={'test':'English survives canonical route navigation','target':target,'width':width}
    def check(target=target,row=row):
     load(page,target)
     row['url']=re.sub('^'+re.escape(BASE),'',page.url);row['lang']=page.evaluate('document.documentElement.lang');row['stored']=page.evaluate("localStorage.getItem('ig_lang')")
     assert row['lang'].lower().startswith('en'),row
     assert row['stored']=='en',row
     shell=page.locator('.ig-r49-global-header')
     assert shell.count()==1 and shell.is_visible(),'Destination lacks canonical R49 header: '+target
     switch=page.locator('.ig-r49-lang:visible').first
     assert switch.count(),'Destination lacks the canonical language switch: '+target
     row['switch']=switch.inner_text().strip()
     assert row['switch']=='ES',(target,row['switch'])
     assert (switch.get_attribute('lang') or '').lower().startswith('es'),target
    record(row,check)
   ctx.close()

  ctx=browser.new_context(viewport={'width':390,'height':900});page=ctx.new_page();page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) else r.abort())
  row={'test':'explicit language links update shared preference'}
  def explicit():
   load(page,'/en/neurodiversity/conditions/autism/');assert page.evaluate("localStorage.getItem('ig_lang')")=='en'
   es=page.locator('.ig-r49-lang:visible').first;assert es.count() and (es.get_attribute('lang') or '').startswith('es');es.click();page.wait_for_load_state('domcontentloaded');page.locator('main').first.wait_for();page.wait_for_timeout(120)
   assert page.evaluate("localStorage.getItem('ig_lang')")=='es'
   en=page.locator('.ig-r49-lang:visible').first;assert en.count() and (en.get_attribute('lang') or '').startswith('en');en.click();page.wait_for_load_state('domcontentloaded');page.locator('main').first.wait_for();page.wait_for_timeout(120)
   assert page.evaluate("localStorage.getItem('ig_lang')")=='en'
  record(row,explicit);ctx.close();browser.close()
finally:srv.shutdown()
R['summary']={'tested':len(R['cases']),'passed':sum(x.get('passed',False) for x in R['cases']),'failed':len(R['failures'])};R['passed']=not R['failures'];(OUT/'language-persistence.json').write_text(json.dumps(R,ensure_ascii=False,indent=2)+'\n');print(json.dumps(R['summary'],ensure_ascii=False))
if not R['passed']:raise SystemExit(1)
