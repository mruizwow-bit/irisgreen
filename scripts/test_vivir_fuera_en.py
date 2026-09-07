#!/usr/bin/env python3
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import functools,json,threading,traceback,re
from playwright.sync_api import sync_playwright
ROOT=Path.cwd();PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports/languages';OUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)));threading.Thread(target=srv.serve_forever,daemon=True).start();BASE=f'http://127.0.0.1:{srv.server_port}'
R={'cases':[],'failures':[],'notes':['Checks the real EN button, not source strings only.','External requests are blocked.','This validates language switching and preserved source content, not the documentary accuracy of the underlying country entries.']}
def add(row,fn):
 try:fn();row['passed']=True
 except Exception as e:row.update(passed=False,error=str(e),traceback=traceback.format_exc());R['failures'].append(row.copy())
 R['cases'].append(row);print(json.dumps(row,ensure_ascii=False),flush=True)
def load(page):
 page.goto(BASE+'/es/vivir-fuera/',wait_until='domcontentloaded');page.locator('main h1').wait_for();page.wait_for_timeout(250)
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch()
  for width in [1440,390,320]:
   ctx=browser.new_context(viewport={'width':width,'height':900});page=ctx.new_page();page.set_default_timeout(8000)
   page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) or r.request.url.startswith(('data:','blob:')) else r.abort())
   row={'test':'Vivir fuera switches completely ES to EN and back','width':width}
   def check():
    load(page)
    page.evaluate("localStorage.setItem('ig_lang','es')");page.reload(wait_until='domcontentloaded');page.locator('main h1').wait_for();page.wait_for_timeout(180)
    assert page.locator('main h1').inner_text().startswith('El sistema de cada país')
    en=page.get_by_role('button',name='EN',exact=True);assert en.count()==1;en.click();page.wait_for_timeout(260)
    row['lang_en']=page.evaluate('document.documentElement.lang');row['title_en']=page.locator('main h1').inner_text();row['stored_en']=page.evaluate("localStorage.getItem('ig_lang')")
    assert row['lang_en']=='en' and row['stored_en']=='en'
    assert row['title_en']=="Each country's system, explained in English."
    text=page.locator('main').inner_text()
    for needle in ['Portugal\'s system is well documented','Everything goes through one gateway: the MDPH','Germany separates processes','Ireland has something relatively unusual','In Italy, much of the system','Canada adopted its first national autism strategy','Australia has one of the world\'s best-known disability support systems','New Zealand created a dedicated disability ministry','Where to start','Reference','Latin America: who certifies disability']:
     assert needle in text,needle
    assert 'Por dónde se empieza' not in text and 'Sin publicar todavía:' not in text
    cards=page.locator('main article');row['english_cards']=cards.count();assert cards.count()==9
    # Regions must be usable after the language switch.
    amer=page.get_by_role('button',name='Americas',exact=True);assert amer.count();amer.click();page.wait_for_timeout(120);assert page.locator('main article').count()==1
    allb=page.get_by_role('button',name='All',exact=True);allb.click();page.wait_for_timeout(120);assert page.locator('main article').count()==9
    row['overflow_en']=page.evaluate('Math.max(0,document.documentElement.scrollWidth-innerWidth)');assert row['overflow_en']<=2
    es=page.get_by_role('button',name='ES',exact=True);es.click();page.wait_for_timeout(220)
    row['lang_es']=page.evaluate('document.documentElement.lang');row['title_es']=page.locator('main h1').inner_text();row['stored_es']=page.evaluate("localStorage.getItem('ig_lang')")
    assert row['lang_es']=='es' and row['stored_es']=='es';assert row['title_es'].startswith('El sistema de cada país')
    assert 'Por dónde se empieza' in page.locator('main').inner_text();assert page.locator('main article').count()==9
   add(row,check);ctx.close()
  # Source-level invariants: no fabricated new country rows and Spanish dataset retained.
  row={'test':'country datasets remain paired 9 ES and 9 EN'}
  def source_check():
   s=(ROOT/'es/vivir-fuera/index.html').read_text()
   es=s.split('const C = [',1)[1].split('const C_EN = [',1)[0]
   en=s.split('const C_EN = [',1)[1].split('const MAP = [',1)[0]
   row['es_countries']=len(re.findall(r'country: "',es));row['en_countries']=len(re.findall(r'country: "',en));assert row['es_countries']==9 and row['en_countries']==9
   for key in ['Decreto-Lei 281/2009','Disability Act 2005','Legge 104/1992','Federal Framework on Autism Spectrum Disorder Act','Aotearoa New Zealand Autism Guideline']:
    assert key in s,key
  add(row,source_check)
  browser.close()
finally:srv.shutdown()
R['summary']={'tested':len(R['cases']),'passed':sum(x.get('passed') for x in R['cases']),'failed':len(R['failures'])};R['passed']=not R['failures'];(OUT/'vivir-fuera-en.json').write_text(json.dumps(R,ensure_ascii=False,indent=2)+'\n');print(json.dumps(R['summary'],ensure_ascii=False))
if not R['passed']:raise SystemExit(1)
