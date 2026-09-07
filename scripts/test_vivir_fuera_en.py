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
R={'cases':[],'failures':[],'notes':['Checks real in-place ES/EN switching on Living abroad.','Official programme/law names may remain in their original language.','Visual text-transform may uppercase labels; comparisons therefore normalise case.','This is a translation/function test, not evidence validation.']}
def clean(s):return re.sub(r'\s+',' ',s).strip()
def case(name,fn):
 row={'test':name}
 try:fn(row);row['passed']=True
 except Exception as e:row.update(passed=False,error=str(e),traceback=traceback.format_exc());R['failures'].append(row.copy())
 R['cases'].append(row);print(json.dumps(row,ensure_ascii=False),flush=True)
def load(page):
 page.goto(BASE+'/es/vivir-fuera/',wait_until='domcontentloaded');page.locator('main h1').wait_for(timeout=9000);page.wait_for_timeout(350)
def click_lang(page,label):
 b=page.locator('.ig-uh-langs button:visible').filter(has_text=re.compile('^'+label+'$')).first;assert b.count(),label;b.click();page.wait_for_timeout(320)
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch()
  for width in [1440,390,320]:
   ctx=browser.new_context(viewport={'width':width,'height':900});ctx.add_init_script("localStorage.setItem('ig_lang','es')")
   page=ctx.new_page();page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) or r.request.url.startswith(('data:','blob:')) else r.abort())
   def check(row):
    load(page);row['width']=width
    assert page.evaluate('document.documentElement.lang').startswith('es')
    assert clean(page.locator('main h1').inner_text())=='El sistema de cada país, explicado en español.'
    click_lang(page,'EN')
    row['lang']=page.evaluate('document.documentElement.lang');assert row['lang'].startswith('en')
    assert page.evaluate("localStorage.getItem('ig_lang')")=='en'
    h1=clean(page.locator('main h1').inner_text());row['h1']=h1;assert h1=="Each country's system, explained clearly."
    body=clean(page.locator('main').inner_text());body_l=body.casefold()
    required=['Portugal','France','Germany','Ireland','Italy','Switzerland and the Netherlands','Canada','Australia','New Zealand','How it works','Where to start','Reference','Latin America: who certifies disability in each country','This information is for orientation and is not legal advice.']
    missing=[x for x in required if x.casefold() not in body_l];row['missing_required']=missing;assert not missing,missing
    spanish_forbidden=['El sistema de cada país, explicado en español.','Cómo funciona','Por dónde se empieza','Sin publicar todavía:','Hispanoamérica: quién certifica en cada país','Última revisión: 31 de agosto de 2026.']
    leftovers=[x for x in spanish_forbidden if x.casefold() in body_l];row['spanish_leftovers']=leftovers;assert not leftovers,leftovers
    chips=[clean(x.inner_text()) for x in page.locator('.ig-filter-button:visible').all()];row['chips']=chips;assert chips[:4]==['All','Europe','Americas','Oceania'],chips
    page.get_by_role('button',name='Europe',exact=True).click();page.wait_for_timeout(160)
    cards=page.locator('main article:visible');countries=[clean(c.locator('h2').inner_text()) for c in cards.all()];row['europe_cards']=countries;assert countries==['Portugal','France','Germany','Ireland','Italy','Switzerland and the Netherlands'],countries
    menu=page.locator('.ig-menu-button').first;row['menu']=clean(menu.inner_text());assert row['menu']=='Menu';assert menu.get_attribute('aria-label')=='Open menu'
    reading=page.locator('.ig-uh-reading').first;row['reading']=clean(reading.inner_text());assert 'Reading' in row['reading'];assert reading.get_attribute('aria-label')=='Accessible reading'
    music=page.locator('.ig-uh-music').first;row['music_label']=music.get_attribute('aria-label');assert row['music_label']=='Music'
    overflow=page.evaluate('Math.max(0,document.documentElement.scrollWidth-innerWidth)');row['overflow']=overflow;assert overflow<=2,overflow
    click_lang(page,'ES');assert page.evaluate('document.documentElement.lang').startswith('es');assert clean(page.locator('main h1').inner_text())=='El sistema de cada país, explicado en español.'
   case('Living abroad ES EN at '+str(width),check);ctx.close()
  browser.close()
finally:srv.shutdown()
R['summary']={'tested':len(R['cases']),'passed':sum(x.get('passed',False) for x in R['cases']),'failed':len(R['failures'])};R['passed']=not R['failures'];(OUT/'vivir-fuera-en.json').write_text(json.dumps(R,ensure_ascii=False,indent=2)+'\n');print(json.dumps(R['summary'],ensure_ascii=False))
if not R['passed']:raise SystemExit(1)
