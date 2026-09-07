#!/usr/bin/env python3
from __future__ import annotations
import difflib, functools, hashlib, json, re, threading, traceback
from html.parser import HTMLParser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT=Path.cwd()
PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports/languages'; OUT.mkdir(parents=True,exist_ok=True)

class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.stack=[]; self.lang_links=[]; self.en_nav=[]; self.has_lang_ui=False
    def handle_starttag(self,tag,attrs):
        a=dict(attrs); self.stack.append((tag,a))
        classes=set(a.get('class','').split())
        if (tag=='nav' and a.get('aria-label','').lower() in {'idioma','language'}) or 'ig-uh-langs' in classes or 'langs' in classes:
            self.has_lang_ui=True
        if tag=='a':
            lang=(a.get('lang') or '').lower(); href=a.get('href','')
            if lang in {'en','es'}: self.lang_links.append((lang,href))
            if 'ig-nav-en' in classes: self.en_nav.append(href)
    def handle_endtag(self,tag):
        if self.stack: self.stack.pop()

def url_for(path:Path)->str:
    rel=path.relative_to(PUBLIC).as_posix()
    if rel=='index.html': return '/'
    if rel.endswith('/index.html'): return '/'+rel[:-10]
    return '/'+rel

def file_for_url(url:str)->Path:
    p=urlparse(url).path
    if p=='/': return PUBLIC/'index.html'
    return PUBLIC/p.lstrip('/')/'index.html'

def norm_text(s:str)->str:
    return re.sub(r'\s+',' ',s).strip()

def similarity(a,b):
    return difflib.SequenceMatcher(None,a[:30000],b[:30000]).ratio()

html_files=sorted({p for p in PUBLIC.rglob('index.html') if not any(x in p.parts for x in {'reports','.git','node_modules'})})
source_candidates=[]; static_problems=[]; nav_es_targets=[]
for p in html_files:
    text=p.read_text(errors='replace'); parser=LinkParser(); parser.feed(text)
    markers=parser.has_lang_ui or 'langButtons' in text or 'ig_lang' in text or 'class="lang' in text
    if markers: source_candidates.append((p,text,parser))
    for lang,href in parser.lang_links:
        if not href or href.startswith(('http:','https:','mailto:','#')): continue
        target=(p.parent/href).resolve() if not href.startswith('/') else file_for_url(href)
        if target.is_dir(): target=target/'index.html'
        if not target.exists(): static_problems.append({'page':url_for(p),'kind':'missing_static_language_target','lang':lang,'href':href})
    for href in parser.en_nav:
        nav_es_targets.append({'page':url_for(p),'href':href})

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)))
threading.Thread(target=server.serve_forever,daemon=True).start(); BASE=f'http://127.0.0.1:{server.server_port}'

REPORT={'public_root':str(PUBLIC.relative_to(ROOT)) if PUBLIC!=ROOT else '.', 'html_pages':len(html_files), 'pages_with_language_ui':len(source_candidates), 'static_problems':static_problems, 'runtime':[], 'nav_en_targets':nav_es_targets, 'failures':[], 'notes':[
    'Runtime test clicks the visible EN control; it does not infer success from the presence of a button.',
    'A same-URL page is accepted only when its main content changes materially and html lang becomes English.',
    'A route change is accepted only when the destination loads and declares English.',
    'External requests are blocked; this is a language-routing/content test, not a media test.'
]}

try:
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        browser=pw.chromium.launch()
        ctx=browser.new_context(viewport={'width':390,'height':900})
        ctx.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) or r.request.url.startswith(('data:','blob:')) else r.abort())
        for p,text,parser in source_candidates:
            route=url_for(p); row={'page':route}; page=ctx.new_page(); errors=[]; page.on('pageerror',lambda e:errors.append(str(e)))
            try:
                page.goto(BASE+route,wait_until='domcontentloaded'); page.locator('main').first.wait_for(timeout=8000); page.wait_for_timeout(180)
                # Force a known Spanish baseline when the page remembers language.
                page.evaluate("try{localStorage.setItem('ig_lang','es')}catch(e){}")
                page.reload(wait_until='domcontentloaded'); page.locator('main').first.wait_for(timeout=8000); page.wait_for_timeout(180)
                before_url=urlparse(page.url).path; before_lang=page.evaluate('document.documentElement.lang'); before=norm_text(page.locator('main').inner_text())
                # Prefer explicit language link; otherwise the shared/dynamic EN button.
                enlink=page.locator('nav[aria-label="Idioma"] a[lang^="en"]:visible,nav[aria-label="Language"] a[lang^="en"]:visible,a.lang[lang^="en"]:visible').first
                enbutton=page.locator('.ig-uh-langs button:visible').filter(has_text=re.compile(r'^EN$')).first
                if enlink.count():
                    row['control']='link'; href=enlink.get_attribute('href'); row['href']=href; enlink.click(); page.wait_for_load_state('domcontentloaded'); page.wait_for_timeout(180)
                elif enbutton.count():
                    row['control']='button'; enbutton.click(); page.wait_for_timeout(260)
                else:
                    row['control']='not_rendered'; row['passed']=False; row['reason']='Language UI marker exists in source but no visible EN control rendered'; REPORT['failures'].append(row.copy()); REPORT['runtime'].append(row); page.close(); continue
                after_url=urlparse(page.url).path; after_lang=page.evaluate('document.documentElement.lang'); after=norm_text(page.locator('main').inner_text())
                sim=similarity(before,after); changed=before!=after; route_changed=after_url!=before_url
                row.update(before_url=before_url,after_url=after_url,before_lang=before_lang,after_lang=after_lang,similarity=round(sim,4),text_changed=changed,route_changed=route_changed,before_h1=page.locator('main h1').first.inner_text() if page.locator('main h1').count() else '')
                english_declared=after_lang.lower().startswith('en')
                if route_changed:
                    passed=english_declared and page.locator('main').count()>0
                    reason='navigated_to_english_route' if passed else 'route_changed_but_destination_not_english'
                else:
                    # Tiny notices/menu-only changes are not enough to call a page translated.
                    passed=english_declared and changed and sim < .90
                    reason='translated_in_place' if passed else ('content_barely_changed' if changed else 'content_did_not_change')
                row['passed']=passed; row['reason']=reason
                if errors: row['pageerrors']=errors
                if not passed: REPORT['failures'].append(row.copy())
            except Exception as e:
                row.update(passed=False,reason='exception',error=str(e),traceback=traceback.format_exc()); REPORT['failures'].append(row.copy())
            REPORT['runtime'].append(row); page.close()
        ctx.close(); browser.close()
finally:
    server.shutdown()

# Summarise repeated shared-nav English hrefs. A Spanish href is not automatically wrong:
# some sections intentionally translate in-place. It is reported for cross-checking with runtime results.
from collections import Counter
cnt=Counter(x['href'] for x in nav_es_targets)
REPORT['english_nav_href_counts']=[{'href':k,'count':v} for k,v in cnt.most_common()]
REPORT['summary']={
    'runtime_tested':len(REPORT['runtime']),
    'runtime_passed':sum(1 for x in REPORT['runtime'] if x.get('passed')),
    'runtime_failed':sum(1 for x in REPORT['runtime'] if not x.get('passed')),
    'static_missing_targets':len(static_problems),
}
(OUT/'language-audit.json').write_text(json.dumps(REPORT,ensure_ascii=False,indent=2)+'\n')
md=['# Auditoría ES/EN de toda la web','',f"Páginas HTML: **{len(html_files)}**. Páginas con interfaz de idioma detectada: **{len(source_candidates)}**.",'',f"Pruebas reales ES→EN: **{REPORT['summary']['runtime_passed']}/{REPORT['summary']['runtime_tested']}** aprobadas.",'',f"Destinos estáticos de idioma inexistentes: **{len(static_problems)}**.",'','## Fallos']
for x in REPORT['failures']:
    md.append(f"- `{x.get('page')}` — {x.get('reason')} · URL {x.get('before_url','')} → {x.get('after_url','')} · lang {x.get('before_lang','')} → {x.get('after_lang','')} · similitud {x.get('similarity','')}")
md += ['','## Límites','La prueba comprueba que EN cambia realmente de ruta o de contenido principal. No valida la calidad lingüística de cada traducción ni afirma que una sección sin versión inglesa deba inventarse automáticamente.']
(OUT/'language-audit.md').write_text('\n'.join(md)+'\n')
print(json.dumps(REPORT['summary'],ensure_ascii=False))
