#!/usr/bin/env python3
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import functools, json, re, threading, traceback
from playwright.sync_api import sync_playwright

ROOT=Path.cwd(); PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports/languages'; OUT.mkdir(parents=True,exist_ok=True)

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*a): pass

srv=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)))
threading.Thread(target=srv.serve_forever,daemon=True).start(); BASE=f'http://127.0.0.1:{srv.server_port}'
R={'cases':[],'failures':[],'notes':['Checks the real ES/EN controls and visible study content.','DOI/year/order are compared against the Spanish source records.','This is a translation/function test, not a new scientific validation of the studies.']}

def add(row,fn):
    try:
        fn(); row['passed']=True
    except Exception as e:
        row.update(passed=False,error=str(e),traceback=traceback.format_exc()); R['failures'].append(row.copy())
    R['cases'].append(row); print(json.dumps(row,ensure_ascii=False),flush=True)

def load(page):
    page.goto(BASE+'/es/investigacion/',wait_until='domcontentloaded')
    page.locator('main').first.wait_for(timeout=10000); page.wait_for_timeout(300)

def click_lang(page,label):
    b=page.get_by_role('button',name=label,exact=True)
    assert b.count(),f'Missing language button {label}'
    b.first.click(); page.wait_for_timeout(350)

def main_text(page): return re.sub(r'\s+',' ',page.locator('main').inner_text()).strip()

try:
    src=json.loads((ROOT/'es/investigacion/estudios-textos.json').read_text(encoding='utf-8'))
    row={'test':'catalogue has complete paired English fields','records':len(src)}
    def fields():
        assert len(src)==120 and [x['n'] for x in src]==list(range(1,121))
        required=['heading_en','design_en','sample_en','text_en','notProven_en','topic_en','topicRaw_en','linea_en']
        missing=[]
        for x in src:
            for k in required:
                if k not in x or x[k] in ('',[],None): missing.append((x['n'],k))
        row['missing']=missing[:20]; assert not missing,missing[:20]
        # Bibliographic identity stays intact.
        assert all('year' in x and 'doi' in x for x in src)
    add(row,fields)

    with sync_playwright() as pw:
        browser=pw.chromium.launch()
        for width in [1440,390,320]:
            ctx=browser.new_context(viewport={'width':width,'height':900}); page=ctx.new_page(); page.set_default_timeout(10000)
            page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) or r.request.url.startswith(('data:','blob:')) else r.abort())
            row={'test':'Research switches ES to full EN and back','width':width}
            def switch():
                load(page)
                page.evaluate("localStorage.setItem('ig_lang','es')"); page.reload(wait_until='domcontentloaded'); page.locator('main').first.wait_for(); page.wait_for_timeout(250)
                before=main_text(page); assert 'Una investigación no es toda la ciencia' in before or 'Una investigación' in before
                click_lang(page,'EN')
                row['lang_en']=page.evaluate('document.documentElement.lang'); row['stored_en']=page.evaluate("localStorage.getItem('ig_lang')")
                text=main_text(page); row['h1_en']=page.locator('main h1').first.inner_text()
                assert row['lang_en'].lower().startswith('en') and row['stored_en']=='en'
                assert 'One study is not the whole of science.' in text
                assert 'Research, with context' in text
                assert 'Study design' in text and 'Topic' in text and 'Reference and DOI' in text
                assert 'The study texts are, for now, in Spanish.' not in text
                # First developed record must genuinely use English body text.
                assert 'Autistic masking or camouflaging describes the efforts' in text
                assert 'No demuestra que todas las personas autistas' not in text
                row['overflow_en']=page.evaluate('Math.max(0,document.documentElement.scrollWidth-innerWidth)'); assert row['overflow_en']<=2
                click_lang(page,'ES'); page.wait_for_timeout(200)
                row['lang_es']=page.evaluate('document.documentElement.lang'); assert row['lang_es'].lower().startswith('es')
                assert 'Investigación, con contexto' in main_text(page)
            add(row,switch); ctx.close()

        # Search English terms spanning early/middle/late catalogue.
        ctx=browser.new_context(viewport={'width':390,'height':900}); page=ctx.new_page(); page.set_default_timeout(10000)
        page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) or r.request.url.startswith(('data:','blob:')) else r.abort())
        for term,needle in [('food insecurity','Food insecurity'),('dyscalculia','dyscalculia'),('echolalia','echolalia'),('misophonia','Misophonia')]:
            row={'test':'English research search','term':term}
            def search(term=term,needle=needle,row=row):
                load(page); click_lang(page,'EN')
                inp=page.locator('input[type="search"]:visible').first
                assert inp.count(); inp.fill(term); page.wait_for_timeout(250)
                text=main_text(page); row['visible_excerpt']=text[:500]
                assert needle.lower() in text.lower(),(term,needle)
                assert 'No publications match' not in text
            add(row,search)
        ctx.close()

        # Open representative studies from every translation batch by searching distinctive English phrases.
        samples=[
            ('unmasking','Autistic masking or camouflaging describes the efforts'),
            ('European guidelines','Not every tic requires treatment'),
            ('interoception','cardiac interoceptive accuracy'),
            ('food insecurity','pooled prevalence'),
            ('physical activity','lower average physical activity'),
            ('ADHD in adult women','universal female phenotype'),
            ('dysgraphia','written-expression difficulties'),
            ('whole class oral language','whole-class evidence base remains small'),
            ('developmental coordination','task-oriented interventions'),
            ('misophonia','emerging field with wide variation')]
        ctx=browser.new_context(viewport={'width':1440,'height':900}); page=ctx.new_page(); page.set_default_timeout(10000)
        page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) or r.request.url.startswith(('data:','blob:')) else r.abort())
        for term,needle in samples:
            row={'test':'Representative English study content','term':term}
            def representative(term=term,needle=needle,row=row):
                load(page); click_lang(page,'EN')
                inp=page.locator('input[type="search"]:visible').first; inp.fill(term); page.wait_for_timeout(200)
                text=main_text(page)
                # Open first matching critical-reading/details control when present.
                details=page.get_by_text('See the critical reading',exact=False).first
                if details.count(): details.click(); page.wait_for_timeout(180); text=main_text(page)
                row['found']=needle in text; assert row['found'],(term,needle)
            add(row,representative)
        ctx.close(); browser.close()
finally:
    srv.shutdown()

R['summary']={'tested':len(R['cases']),'passed':sum(1 for x in R['cases'] if x.get('passed')),'failed':len(R['failures'])}; R['passed']=not R['failures']
(OUT/'investigacion-en.json').write_text(json.dumps(R,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(R['summary'],ensure_ascii=False))
if not R['passed']: raise SystemExit(1)
