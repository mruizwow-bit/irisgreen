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

def data_shape(path):
    p=ROOT/path
    if not p.exists():return {'path':path,'exists':False}
    try:d=json.loads(p.read_text())
    except Exception as e:return {'path':path,'exists':True,'error':str(e)}
    row={'path':path,'exists':True,'type':type(d).__name__}
    if isinstance(d,dict):
        row['keys']=list(d.keys())[:30]
        row['counts']={k:len(v) for k,v in d.items() if isinstance(v,(list,dict))}
    elif isinstance(d,list):row['count']=len(d)
    return row

html_files=sorted(p for p in PUBLIC.rglob('index.html') if not any(x in p.parts for x in {'reports','.git','node_modules'}))
all_ui=[]; dynamic=[]; static_checks=[]; static_problems=[]; en_nav=[]; missing_controls=[]
for p in html_files:
    text=p.read_text(errors='replace'); parser=Parser(); parser.feed(text); route=url_for(p); doclang=declared_lang(p) or ''
    is_dynamic='langButtons' in text or 'ig-uh-langs' in text or 'setLang(' in text
    if parser.has_lang_ui or is_dynamic:all_ui.append((p,text,parser))
    if is_dynamic:dynamic.append((p,text,parser))
    if parser.has_lang_ui and not is_dynamic:
        langs={x[0] for x in parser.lang_links}
        if doclang.startswith('es') and 'en' not in langs:
            row={'page':route,'kind':'missing_en_control','declared_lang':doclang,'passed':False};missing_controls.append(row);static_problems.append(row)
        if doclang.startswith('en') and 'es' not in langs:
            row={'page':route,'kind':'missing_es_control','declared_lang':doclang,'passed':False};missing_controls.append(row);static_problems.append(row)
    for lang,href in parser.lang_links:
        if not href or href.startswith(('http:','https:','mailto:','#')):continue
        target=(p.parent/href).resolve() if not href.startswith('/') else file_for_url(href)
        if target.is_dir():target=target/'index.html'
        target_lang=declared_lang(target)
        row={'page':route,'lang':lang,'href':href,'target_exists':target.exists(),'target_lang':target_lang}
        row['passed']=target.exists() and bool(target_lang) and target_lang.startswith(lang)
        static_checks.append(row)
        if not row['passed']:static_problems.append(row)
    for href in parser.en_nav:en_nav.append({'page':route,'href':href})

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)))
threading.Thread(target=server.serve_forever,daemon=True).start(); BASE=f'http://127.0.0.1:{server.server_port}'
REPORT={'public_root':str(PUBLIC.relative_to(ROOT)) if PUBLIC!=ROOT else '.','html_pages':len(html_files),'pages_with_language_ui':len(all_ui),'dynamic_pages':len(dynamic),'static_checks':static_checks,'static_problems':static_problems,'missing_controls':missing_controls,'runtime':[],'english_menu_flow':[],'failures':[],'data_shapes':[
 data_shape('es/tramites/directorio/tramites-datos.json'),data_shape('es/investigacion/estudios-textos.json'),data_shape('es/recursos/juegos/juegos-120.json')
],'notes':[
 'Every explicit ES/EN link is checked for an existing destination whose html lang matches the requested language.',
 'A language area that displays only ES on a Spanish page is reported as missing an EN control.',
 'Every in-place language button is clicked in Chromium; merely changing the button colour or html lang does not pass.',
 'The English global menu is also followed from a clean English static page, so losing English between sections is detected.',
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
                page.goto(BASE+route,wait_until='domcontentloaded');page.locator('main').first.wait_for(timeout=7000);page.wait_for_timeout(100)
                page.evaluate("try{localStorage.setItem('ig_lang','es')}catch(e){}")
                page.reload(wait_until='domcontentloaded');page.locator('main').first.wait_for(timeout=7000);page.wait_for_timeout(100)
                before_url=urlparse(page.url).path;before_lang=page.evaluate('document.documentElement.lang');before=norm(page.locator('main').inner_text())
                en=page.locator('.ig-uh-langs button:visible').filter(has_text=re.compile(r'^EN$')).first
                if not en.count():en=page.get_by_role('button',name='EN',exact=True).first
                if not en.count():
                    link=page.locator('nav[aria-label="Idioma"] a[lang^="en"]:visible,nav[aria-label="Language"] a[lang^="en"]:visible,a.lang[lang^="en"]:visible').first
                    if link.count():row.update(passed=True,reason='explicit_link_handled_statically');REPORT['runtime'].append(row);page.close();continue
                    raise AssertionError('No visible EN control rendered')
                en.click();page.wait_for_timeout(220)
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
        ctx.close()
        start='/en/neurodiversity/conditions/autism/'
        unique_hrefs=[]
        for item in en_nav:
            if item['href'] not in unique_hrefs:unique_hrefs.append(item['href'])
        for href in unique_hrefs:
            c=browser.new_context(viewport={'width':390,'height':900});c.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) else r.abort());page=c.new_page();row={'from':start,'href':href}
            try:
                page.goto(BASE+start,wait_until='domcontentloaded');page.locator('main').first.wait_for(timeout=7000);page.wait_for_timeout(80)
                stored_before=page.evaluate("localStorage.getItem('ig_lang')")
                link=page.locator('#ig-main-nav a[href="'+href+'"]:visible').first
                if not link.count():raise AssertionError('English menu link not rendered on the reference English page')
                link.click();page.wait_for_load_state('domcontentloaded');page.locator('main').first.wait_for(timeout=7000);page.wait_for_timeout(180)
                after_lang=page.evaluate('document.documentElement.lang');main=norm(page.locator('main').inner_text());stored_after=page.evaluate("localStorage.getItem('ig_lang')")
                passed=after_lang.lower().startswith('en')
                row.update(passed=passed,after_url=urlparse(page.url).path,after_lang=after_lang,stored_before=stored_before,stored_after=stored_after,h1=page.locator('main h1').first.inner_text() if page.locator('main h1').count() else '',text_sample=main[:180])
                if not passed:REPORT['failures'].append(dict(row,reason='english_menu_loses_language'))
            except Exception as e:
                row.update(passed=False,reason='menu_flow_exception',error=str(e));REPORT['failures'].append(row.copy())
            REPORT['english_menu_flow'].append(row);c.close()
        browser.close()
finally:server.shutdown()
REPORT['failures']=[*static_problems,*REPORT['failures']]
cnt=Counter(x['href'] for x in en_nav);REPORT['english_nav_href_counts']=[{'href':k,'count':v} for k,v in cnt.most_common()]
REPORT['summary']={'html_pages':len(html_files),'pages_with_language_ui':len(all_ui),'missing_language_controls':len(missing_controls),'static_links_tested':len(static_checks),'static_links_failed':len([x for x in static_problems if x.get('kind') not in {'missing_en_control','missing_es_control'}]),'dynamic_tested':len(REPORT['runtime']),'dynamic_passed':sum(1 for x in REPORT['runtime'] if x.get('passed')),'dynamic_failed':sum(1 for x in REPORT['runtime'] if not x.get('passed')),'english_menu_targets_tested':len(REPORT['english_menu_flow']),'english_menu_targets_failed':sum(1 for x in REPORT['english_menu_flow'] if not x.get('passed'))}
(OUT/'language-audit.json').write_text(json.dumps(REPORT,ensure_ascii=False,indent=2)+'\n')
md=['# Auditoría ES/EN de toda la web','',f"Páginas HTML generadas: **{len(html_files)}**.",f"Páginas con interfaz de idioma: **{len(all_ui)}**.",f"Páginas que muestran idioma pero carecen del control necesario ES/EN: **{len(missing_controls)}**.",f"Enlaces ES/EN explícitos comprobados: **{len(static_checks)}**.",f"Páginas con cambio dinámico probadas pulsando EN: **{len(REPORT['runtime'])}**; aprobadas: **{REPORT['summary']['dynamic_passed']}**.",f"Destinos distintos del menú inglés probados desde una ficha inglesa: **{len(REPORT['english_menu_flow'])}**; fallos: **{REPORT['summary']['english_menu_targets_failed']}**.",'','## Fallos']
for x in REPORT['failures']:
    md.append(f"- `{x.get('page',x.get('href',''))}` — {x.get('reason',x.get('kind','destino de idioma incorrecto'))} · {x.get('href','')} · lang {x.get('before_lang',x.get('declared_lang',x.get('lang','')))} → {x.get('after_lang',x.get('target_lang',''))} · similitud {x.get('similarity','')}")
md+=['','## Datos de origen detectados']
for x in REPORT['data_shapes']:md.append('- `'+x['path']+'`: '+json.dumps({k:v for k,v in x.items() if k!='path'},ensure_ascii=False))
md+=['','## Criterio','No se da por bueno un botón porque cambie de color. También se comprueba que una persona que ya está en una ficha inglesa no vuelva al castellano al usar el menú principal.','', 'La auditoría funcional no evalúa todavía la calidad lingüística de cada traducción; eso se hace después sobre las páginas que realmente llegan al inglés.']
(OUT/'language-audit.md').write_text('\n'.join(md)+'\n');print(json.dumps(REPORT['summary'],ensure_ascii=False))
