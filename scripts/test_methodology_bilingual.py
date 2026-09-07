#!/usr/bin/env python3
from __future__ import annotations
import functools, json, re, subprocess, threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path.cwd()
PUBLIC = ROOT / 'dist' if (ROOT / 'dist').is_dir() else ROOT
OUT = ROOT / 'reports/languages'
OUT.mkdir(parents=True, exist_ok=True)
result = {'page_es':'/es/metodologia/','page_en':'/en/methodology/','checks':{}}

def must(name, ok, detail=''):
    result['checks'][name] = {'passed': bool(ok), 'detail': detail}
    if not ok:
        raise AssertionError(f'{name}: {detail}')

def norm(text): return ' '.join(text.split())

# Guardrail: the Spanish editorial body must be byte-for-byte unchanged by the bilingual build.
current_es = (ROOT/'es/metodologia/index.html').read_text(encoding='utf-8')
head_es = subprocess.check_output(['git','show','HEAD:es/metodologia/index.html'], text=True)
cur_main = current_es[current_es.index('<main id="main">'):]
head_main = head_es[head_es.index('<main id="main">'):]
must('spanish_editorial_body_unchanged', cur_main == head_main, 'El <main> español cambió durante la traducción.')
must('spanish_has_en_alternate', 'hreflang="en"' in current_es and 'href="/en/methodology/"' in current_es, 'Falta hreflang o control EN en ES.')

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

server = ThreadingHTTPServer(('127.0.0.1',0), functools.partial(Quiet,directory=str(PUBLIC)))
threading.Thread(target=server.serve_forever,daemon=True).start()
BASE = f'http://127.0.0.1:{server.server_port}'

try:
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        ctx = browser.new_context(viewport={'width':390,'height':900})
        ctx.route('**/*', lambda r: r.continue_() if r.request.url.startswith(BASE) or r.request.url.startswith(('data:','blob:')) else r.abort())
        page = ctx.new_page(); errors=[]; page.on('pageerror', lambda e: errors.append(str(e)))

        page.goto(BASE+'/es/metodologia/', wait_until='domcontentloaded')
        page.locator('main').first.wait_for(timeout=7000); page.wait_for_timeout(180)
        es_text = norm(page.locator('main').inner_text())
        must('spanish_page_still_spanish', page.evaluate('document.documentElement.lang') == 'es' and 'Cinco reglas' in es_text and 'Grado A.' in es_text, es_text[:500])
        en_link = page.locator('nav.langs a[lang="en"]')
        must('spanish_page_has_en_control', en_link.count()==1 and en_link.is_visible(), 'No hay enlace EN visible.')
        en_link.click(); page.wait_for_load_state('domcontentloaded'); page.locator('main').first.wait_for(timeout=7000); page.wait_for_timeout(180)

        en_text = norm(page.locator('main').inner_text()); en_fold = en_text.casefold()
        must('english_route_and_lang', urlparse(page.url).path == '/en/methodology/' and page.evaluate('document.documentElement.lang') == 'en', page.url)
        must('english_title', page.title() == 'Methodology · How the information here is checked', page.title())
        must('five_rules_preserved', page.locator('main section.sec').count()==5 and all(x in en_text for x in [
            '1 · Every claim has its document and year',
            '2 · Entries without a source',
            '3 · Figures include their denominator',
            '4 · The editorial certainty grades',
            '5 · The review date is visible'
        ]), en_text[:1800])
        must('editorial_grades_preserved', all(x in en_text for x in ['Grade A.','Grade B.','Grade C.']) and 'condition at grade A and the treatment at grade C' in en_text, en_text[1200:2300])
        must('examples_preserved', all(x in en_text for x in ['NICE NG69','2017','ARFID','pica','dissociative amnesia','CG31']), en_text[:2600])
        must('no_key_spanish_ui', all(x not in en_fold for x in ['metodología','cómo se comprueba','lectura accesible','tamaño del texto','restablecer','grado a.']), en_text[:900])

        diss = page.locator('main a[href="/en/neurodiversity/conditions/dissociative-amnesia/"]')
        must('dissociative_example_uses_existing_en_route', diss.count()==1, 'Falta enlace EN de amnesia disociativa.')
        data = page.locator('main a[href="/es/datos/"]')
        research = page.locator('main a[href="/es/investigacion/"]')
        about = page.locator('main a[href="/es/sobre-iris-green/"]')
        must('untranslated_destinations_are_marked', data.count()==1 and '(Spanish)' in data.inner_text() and research.count()==1 and '(Spanish)' in research.inner_text() and about.count()==1 and '(Spanish)' in about.inner_text(), 'Datos, Investigación o Sobre Iris no indican que el destino sigue en español.')

        read = page.locator('#a11yBtn:visible')
        must('reading_control_visible', read.count()==1, 'Falta control de lectura.')
        read.click(); page.wait_for_timeout(120)
        panel = page.locator('#a11y:not([hidden])')
        panel_text = norm(panel.inner_text()) if panel.count() else ''
        panel_fold = panel_text.casefold()
        must('accessible_reading_is_english', panel.count()==1 and all(x.casefold() in panel_fold for x in ['Accessible reading','Text size','Wider letter spacing','Read aloud','Reset']), panel_text)
        page.keyboard.press('Escape'); page.wait_for_timeout(80)

        es_link = page.locator('nav.langs a[lang="es"]')
        must('english_page_has_es_control', es_link.count()==1 and es_link.is_visible(), 'No hay enlace ES visible.')
        es_link.click(); page.wait_for_load_state('domcontentloaded'); page.locator('main').first.wait_for(timeout=7000); page.wait_for_timeout(120)
        must('returns_to_exact_spanish_route', urlparse(page.url).path == '/es/metodologia/' and page.evaluate('document.documentElement.lang') == 'es', page.url)
        must('no_page_errors', not errors, '; '.join(errors))
        result['passed']=True
        ctx.close(); browser.close()
finally:
    server.shutdown()
    (OUT/'methodology-bilingual.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

print(json.dumps({'passed':result.get('passed',False),'checks':len(result['checks'])},ensure_ascii=False))
