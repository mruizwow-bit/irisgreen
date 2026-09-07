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
R={'cases':[],'failures':[]}
def case(name,fn):
 row={'test':name}
 try:fn(row);row['passed']=True
 except Exception as e:row.update(passed=False,error=str(e),traceback=traceback.format_exc());R['failures'].append(row.copy())
 R['cases'].append(row);print(json.dumps(row,ensure_ascii=False),flush=True)
def text(locator):return re.sub(r'\s+',' ',locator.inner_text()).strip()
try:
 data=json.loads((ROOT/'buscador.json').read_text());pairs=sum(isinstance(x.get('en'),dict) and x['en'].get('u','').startswith('/en/') for x in data)
 case('single search index has English counterparts',lambda r:(r.update(entries=len(data),english_pairs=pairs),(_ for _ in ()).throw(AssertionError((len(data),pairs))) if len(data)!=372 or pairs<360 else None))
 with sync_playwright() as pw:
  browser=pw.chromium.launch()
  for width in [1440,390,320]:
   ctx=browser.new_context(viewport={'width':width,'height':900});ctx.add_init_script("localStorage.setItem('ig_lang','en')")
   page=ctx.new_page();page.route('**/*',lambda route:route.continue_() if route.request.url.startswith(BASE) or route.request.url.startswith(('data:','blob:')) else route.abort())
   def home(row):
    page.goto(BASE+'/',wait_until='domcontentloaded');page.locator('main h1').wait_for();page.wait_for_timeout(450)
    row['width']=width;row['lang']=page.evaluate('document.documentElement.lang')
    row['h1']=text(page.locator('main h1').first);assert row['h1']=='Write it as you would say it out loud.'
    hero=text(page.locator('main').locator('p').nth(0));assert hero.startswith('The situations are told in the first person'),hero
    books=text(page.locator('#ig-books-message'));assert books=='Everything on this website is free. Two books pay for it. See them',books
    tabs=[text(x) for x in page.locator('#consola > div').first.get_by_role('button').all()[:3]];row['tabs']=tabs;assert tabs==['Search','Answer 3 questions','What can I ask for?'],tabs
    suggestions=[text(x) for x in page.locator('#consola').get_by_role('button').all() if text(x) in ["I can't cope with the noise","being around people drains me","I can't sleep","they don't understand them at school","paperwork makes me freeze"]]
    row['suggestions']=suggestions;assert len(set(suggestions))==5,suggestions
    # Initial rows must be English, including the two real situation cards and the three fixed entry points.
    resultbox=page.locator('#consola').locator('a[href]').filter(has=page.locator('xpath=..'))
    main_console=text(page.locator('#consola'))
    required=['All Everyday life guides','All Data figures','All support by country']
    assert all(x in main_console for x in required),main_console[:1200]
    assert '«No aguanto las etiquetas ni las costuras de la ropa»' not in main_console
    assert '«Salgo del supermercado agotada y sin saber por qué»' not in main_console
    # Use a real English quick-search and verify the resulting content and destinations are English equivalents.
    chip=page.get_by_role('button',name="I can't cope with the noise",exact=True);chip.click();page.wait_for_timeout(280)
    searched=text(page.locator('#consola'));assert 'Resultados para' not in searched
    links=page.locator('#consola a[href]:visible');hrefs=[a.get_attribute('href') or '' for a in links.all()]
    english_content=[h for h in hrefs if h.startswith('/en/situations/') or h.startswith('/en/neurodiversity/conditions/')]
    row['english_result_links']=english_content[:5];assert english_content,hrefs[:10]
    assert page.evaluate("localStorage.getItem('ig_lang')")=='en'
   case('home English is coherent at '+str(width),home);ctx.close()
  browser.close()
finally:srv.shutdown()
R['summary']={'tested':len(R['cases']),'passed':sum(x.get('passed',False) for x in R['cases']),'failed':len(R['failures'])};R['passed']=not R['failures'];(OUT/'home-english.json').write_text(json.dumps(R,ensure_ascii=False,indent=2)+'\n');print(json.dumps(R['summary'],ensure_ascii=False))
if not R['passed']:raise SystemExit(1)
