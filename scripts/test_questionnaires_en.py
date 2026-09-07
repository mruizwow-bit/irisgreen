#!/usr/bin/env python3
from __future__ import annotations
import functools, json, threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse
from difflib import SequenceMatcher

ROOT=Path.cwd(); PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports/languages'; OUT.mkdir(parents=True,exist_ok=True)

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)))
threading.Thread(target=server.serve_forever,daemon=True).start()
BASE=f'http://127.0.0.1:{server.server_port}'
result={'page':'/es/cuestionarios/','checks':{},'errors':[]}

def norm(s): return ' '.join(s.split())
def folded(s): return norm(s).casefold()

def must(name, condition, detail=''):
    result['checks'][name]={'passed':bool(condition),'detail':detail}
    if not condition: raise AssertionError(f'{name}: {detail}')

try:
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        browser=pw.chromium.launch()
        ctx=browser.new_context(viewport={'width':390,'height':900})
        ctx.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) or r.request.url.startswith(('data:','blob:')) else r.abort())
        page=ctx.new_page(); page_errors=[]; page.on('pageerror',lambda e: page_errors.append(str(e)))
        page.goto(BASE+'/es/cuestionarios/',wait_until='domcontentloaded')
        page.locator('main').first.wait_for(timeout=7000); page.wait_for_timeout(250)
        page.evaluate("localStorage.setItem('ig_lang','es')")
        page.reload(wait_until='domcontentloaded'); page.locator('main').first.wait_for(timeout=7000); page.wait_for_timeout(250)
        before=norm(page.locator('main').first.inner_text()); before_f=before.casefold()
        must('starts_in_spanish', page.evaluate('document.documentElement.lang').startswith('es') and 'orientan. no diagnostican.' in before_f, before[:180])

        en=page.get_by_role('button',name='EN',exact=True).first
        must('english_control_visible', en.count()==1 and en.is_visible(), 'EN button missing')
        en.click(); page.wait_for_timeout(350)
        after=norm(page.locator('main').first.inner_text()); after_f=after.casefold()
        html_lang=page.evaluate('document.documentElement.lang')
        must('html_lang_en', html_lang.startswith('en'), html_lang)
        must('english_main_heading', 'they can guide you. they do not diagnose.' in after_f, after[:260])
        must('english_cards', 'calculated in your browser' in after_f and 'adults aged 18 and over only' in after_f, after[:500])
        must('english_test_labels', 'how long it takes' in after_f and 'version used and licence' in after_f, after[700:1500])
        must('english_exclusions', 'what you will not find here' in after_f and 'no questionnaires for people under 18.' in after_f, after[-1100:])
        must('spanish_ui_removed', all(x.casefold() not in after_f for x in ['Orientan. No diagnostican.','Cuánto dura','Qué no vas a encontrar aquí','Última revisión:']), after[:900])
        ratio=SequenceMatcher(None,before[:30000],after[:30000]).ratio()
        must('substantial_translation', ratio < .82, f'similarity={ratio:.4f}')
        must('english_title', page.title()=='Screening questionnaires · Iris Green', page.title())
        cond=page.locator('main a').filter(has_text='what to take to an assessment').first
        must('assessment_link_stays_english', cond.count()==1 and urlparse(cond.get_attribute('href') or '').path=='/en/neurodiversity/conditions/', cond.get_attribute('href') if cond.count() else 'missing')

        read=page.locator('.ig-uh-reading:visible').first
        if read.count(): read.click(); page.wait_for_timeout(180)
        panel=page.locator('[data-ig-reading-panel]:visible').first
        panel_text=norm(panel.inner_text()) if panel.count() else ''
        must('reading_panel_english', panel.count()==1 and 'accessible reading' in panel_text.casefold() and 'wider letter spacing' in panel_text.casefold(), panel_text[:300] if panel.count() else 'panel missing')
        if panel.count(): page.keyboard.press('Escape'); page.wait_for_timeout(120)

        es=page.get_by_role('button',name='ES',exact=True).first; es.click(); page.wait_for_timeout(300)
        spanish_again=norm(page.locator('main').first.inner_text()); spanish_again_f=spanish_again.casefold()
        must('returns_to_spanish', page.evaluate('document.documentElement.lang').startswith('es') and 'orientan. no diagnostican.' in spanish_again_f and 'cuánto dura' in spanish_again_f, spanish_again[:500])

        en=page.get_by_role('button',name='EN',exact=True).first; en.click(); page.wait_for_timeout(250); page.reload(wait_until='domcontentloaded'); page.locator('main').first.wait_for(timeout=7000); page.wait_for_timeout(350)
        persisted=norm(page.locator('main').first.inner_text())
        must('english_persists_after_reload', page.evaluate('document.documentElement.lang').startswith('en') and 'they can guide you. they do not diagnose.' in persisted.casefold(), persisted[:300])
        must('no_page_errors', not page_errors, '; '.join(page_errors))
        result['similarity']=round(ratio,4); result['passed']=True
        ctx.close(); browser.close()
finally:
    server.shutdown()
    (OUT/'questionnaires-en.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

print(json.dumps({'passed':result.get('passed',False),'checks':len(result['checks']),'similarity':result.get('similarity')},ensure_ascii=False))
