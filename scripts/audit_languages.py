#!/usr/bin/env python3
from __future__ import annotations
import difflib, functools, json, re, threading, traceback
from collections import Counter
from html.parser import HTMLParser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT=Path.cwd(); PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports/languages'; OUT.mkdir(parents=True,exist_ok=True)

class Parser(HTMLParser):
    def __init__(self):
        super().__init__(); self.lang_links=[]; self.en_nav=[]; self.has_lang_ui=False
    def handle_starttag(self,tag,attrs):
        a=dict(attrs); classes=set(a.get('class','').split()); label=a.get('aria-label','').lower()
        if (tag=='nav' and label in {'idioma','language'}) or 'ig-uh-langs' in classes or 'langs' in classes:self.has_lang_ui=True
        if tag=='a':
            lang=(a.get('lang') or '').lower(); href=a.get('href','')
            if lang in {'en','es'}: self.lang_links.append((lang,href))
            if 'ig-nav-en' in classes:self.en_nav.append(href)

def url_for(path):
    rel=path.relative_to(PUBLIC).as_posix()
    return '/' if rel=='index.html' else '/'+rel[:-10] if rel.endswith('/index.html') else '/'+rel

def file_for_url(url):
    p=urlparse(url).path
    return PUBLIC/'index.html' if p=='/' else PUBLIC/p.lstrip('/')/'index.html'

def declared_lang(path):
    if not path.exists():return None
    m=re.search(r'<html\b[^>]*\blang=["\']([^"\']+)',path.read_text(errors='replace'),re.I)
    return m.group(1).lower() if m else ''

def norm(s):return re.sub(r'\s+',' ',s).strip()
def sim(a,b):return difflib.SequenceMatcher(None,a[:30000],b[:30000]).ratio()

html_files=sorted(p for p in PUBLIC.rglob('index.html') if not any(x in p.parts for x in {'reports','.git','node_modules'}))
all_ui=[]; dynamic=[]; static_checks=[]; static_problems=[]; en_nav=[]
for p in html_files:
    text=p.read_text(errors='replace'); parser=Parser(); parser.feed(text)
    if parser.has_lang_ui or 'langButtons' in text or 'setLang(' in text:all_ui.append((p,text,parser))
    # Only in-place/button implementations need a browser. Hundreds of explicit
    # ES↔EN links are fully checked below by target existence + target language.
    if 'langButtons' in text or 'ig-uh-langs' in text or 'setLang(' in text:dynamic.append((p,text,parser))
    for lang,href in parser.lang_links:
        if not href or href.startswith(('http:','https:','mailto:','#')):continue
        target=(p.parent/href).resolve() if not href.startswith('/') else file_for_url(href)
        if target.is_dir():target=target/'index.html'
        target_lang=declared_lang(target)
        row={'page':url_for(p),'lang':lang,'href':href,'target_exists':target.exists(),'target_lang':target_lang}
        row['passed']=target.exists() and bool(target_lang) and target_lang.startswith(lang)
        static_checks.append(row)
        if not row['passed']:static_problems.append(row)
    for href in parser.en_nav:en_nav.append({'page':url_for(p),'href':href})

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)))
threading.Thread(target=server.serve_forever,daemon=True).start(); BASE=f'http://127.0.0.1:{server.server_port}'
REPORT={'public_root':str(PUBLIC.relative_to(ROOT)) if PUBLIC!=ROOT else '.','html_pages':len(html_files),'pages_with_language_ui':len(all_ui),'dynamic_pages':len(dynamic),'static_checks':static_checks,'static_problems':static_problems,'runtime':[],'failures':[],'notes':[
 'Every explicit ES/EN link is checked for an existing destination whose html lang matches the requested language.',
 'Every in-place language button is clicked in Chromium; merely changing the button colour or html lang does not pass.',
 'A same-URL dynamic page passes only if main content changes materially (similarity below 0.90) and html lang becomes English.',
 'External requests are blocked. This checks routing and language switching, not translation quality.'
]}
try:
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        browser=pw.chromium.launch();ctx=browser.new_context(viewport={'width':390,'height':900})
        ctx.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) or r.request.url.startswith(('data:','blob:')) else r.abort())
        for p,text,parser in dynamic:
            route=url_for(p);row={'page':route};page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
            try:
                page.goto(BASE+route,wait_until='domcontentloaded');page.locator('main').first.wait_for(timeout=7000);page.wait_for_timeout(120)
                page.evaluate("try{localStorage.setItem('ig_lang','es')}catch(e){}")
                page.reload(wait_until='domcontentloaded');page.locator('main').first.wait_for(timeout=7000);page.wait_for_timeout(120)
                before_url=urlparse(page.url).path;before_lang=page.evaluate('document.documentElement.lang');before=norm(page.locator('main').inner_text())
                en=page.locator('.ig-uh-langs button:visible').filter(has_text=re.compile(r'^EN$')).first
                # Some dynamic pages use another two-button wrapper; accept an exact visible EN button.
                if not en.count():en=page.get_by_role('button',name='EN',exact=True).first
                if not en.count():
                    # If the page also has a correct explicit EN link, it is not an in-place button page.
                    link=page.locator('nav[aria-label="Idioma"] a[lang^="en"]:visible,nav[aria-label="Language"] a[lang^="en"]:visible,a.lang[lang^="en"]:visible').first
                    if link.count():row.update(passed=True,reason='explicit_link_handled_statically');REPORT['runtime'].append(row);page.close();continue
                    raise AssertionError('No visible EN control rendered')
                en.click();page.wait_for_timeout(240)
                after_url=urlparse(page.url).path;after_lang=page.evaluate('document.documentElement.lang');after=norm(page.locator('main').inner_text())
                ratio=sim(before,after);changed=before!=after;route_changed=after_url!=before_url;english=after_lang.lower().startswith('en')
                if route_changed:passed=english and page.locator('main').count()>0;reason='navigated_to_english_route' if passed else 'route_changed_but_destination_not_english'
                else:passed=english and changed and ratio<.90;reason='translated_in_place' if passed else ('content_barely_changed' if changed else 'content_did_not_change')
                row.update(passed=passed,reason=reason,before_url=before_url,after_url=after_url,before_lang=before_lang,after_lang=after_lang,similarity=round(ratio,4),text_changed=changed,route_changed=route_changed)
                if errors:row['pageerrors']=errors
                if not passed:REPORT['failures'].append(row.copy())
            except Exception as e:
                row.update(passed=False,reason='exception',error=str(e),traceback=traceback.format_exc());REPORT['failures'].append(row.copy())
            REPORT['runtime'].append(row);page.close()
        ctx.close();browser.close()
finally:server.shutdown()
REPORT['failures']=[*static_problems,*REPORT['failures']]
cnt=Counter(x['href'] for x in en_nav);REPORT['english_nav_href_counts']=[{'href':k,'count':v} for k,v in cnt.most_common()]
REPORT['summary']={'html_pages':len(html_files),'pages_with_language_ui':len(all_ui),'static_links_tested':len(static_checks),'static_links_failed':len(static_problems),'dynamic_tested':len(REPORT['runtime']),'dynamic_passed':sum(1 for x in REPORT['runtime'] if x.get('passed')),'dynamic_failed':sum(1 for x in REPORT['runtime'] if not x.get('passed'))}
(OUT/'language-audit.json').write_text(json.dumps(REPORT,ensure_ascii=False,indent=2)+'\n')
md=['# Auditoría ES/EN de toda la web','',f"Páginas HTML generadas: **{len(html_files)}**.",f"Páginas con interfaz de idioma: **{len(all_ui)}**.",f"Enlaces ES/EN explícitos comprobados: **{len(static_checks)}**; fallos: **{len(static_problems)}**.",f"Páginas con cambio dinámico probadas pulsando EN: **{len(REPORT['runtime'])}**; aprobadas: **{REPORT['summary']['dynamic_passed']}**.",'','## Fallos']
for x in REPORT['failures']:
    md.append(f"- `{x.get('page')}` — {x.get('reason',x.get('kind','destino de idioma incorrecto'))} · {x.get('href','')} · lang {x.get('before_lang',x.get('lang',''))} → {x.get('after_lang',x.get('target_lang',''))} · similitud {x.get('similarity','')}")
md+=['','## Criterio','No se da por bueno un botón porque cambie de color. En páginas dinámicas debe cambiar de verdad el contenido principal o navegar a una ruta inglesa. En fichas con enlaces normales se verifica que el destino exista y declare el idioma solicitado.','', 'La auditoría no evalúa todavía la calidad de cada traducción; eso se hace después sobre las páginas que funcionalmente llegan al inglés.']
(OUT/'language-audit.md').write_text('\n'.join(md)+'\n');print(json.dumps(REPORT['summary'],ensure_ascii=False))
