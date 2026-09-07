#!/usr/bin/env python3
"""Pruebas técnicas reales con Chromium. No verifican fuentes clínicas ni reproducción externa."""
import functools
import json
import threading
import time
from collections import Counter, defaultdict
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

ROOT=Path.cwd()
OUT=ROOT/'reports';OUT.mkdir(exist_ok=True)
report={'static':{},'browser':[],'failures':[],'notes':['Los dominios externos se bloquean en la prueba para comprobar que el funcionamiento local no depende de ellos.','No se certifica reproducción de YouTube ni revisión del contenido documental.']}
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
BASE=f'http://127.0.0.1:{server.server_port}'
EXCLUDE={'.git','_audit','reports','node_modules','.baseline'}
files=sorted(p for p in ROOT.rglob('*.html') if not EXCLUDE.intersection(p.relative_to(ROOT).parts))
missing=defaultdict(list);nav_pages=0;removed=0;internal_support=0
for p in files:
    rel=str(p.relative_to(ROOT));text=p.read_text();soup=BeautifulSoup(text,'html.parser')
    if '__bundler/template' in text:report['failures'].append('Sigue empaquetada: '+rel)
    nav=soup.select_one('nav.nav,nav.ig-uh-nav')
    if nav:
        nav_pages+=1
        for a in nav.select('a[href]'):
            path=urlsplit(urljoin(BASE+'/'+rel,a['href'])).path.rstrip('/')
            if path=='/es/tramites':report['failures'].append('Trámites continúa en barra principal: '+rel)
    if rel in {'es/tramites/index.html','es/tramites/directorio/index.html','es/vivir-fuera/index.html'}:
        assert soup.select_one('.ig-subtabs a[href="/es/tramites/"]'), 'Se ha perdido el acceso interno a Cómo pedirlo: '+rel
        internal_support+=1
    if nav and not soup.select_one('script[src="/assets/musica.js"]'):report['failures'].append('Falta reproductor compartido: '+rel)
    for el in soup.select('[href],[src]'):
        value=el.get('src') or el.get('href')
        if not value or '{{' in value or value.startswith(('#','data:','blob:','mailto:','tel:','about:','javascript:')):continue
        u=urlsplit(urljoin(BASE+'/'+rel,value))
        if u.netloc not in {urlsplit(BASE).netloc,'irisgreen.eu'}:continue
        dest=ROOT/unquote(u.path).lstrip('/')
        if dest.is_file() or dest.is_dir() and (dest/'index.html').is_file():continue
        missing[u.path].append(rel)
    # Las fichas individuales mantienen palabra por palabra su contenido.
    before=ROOT/'.baseline'/rel
    if rel.startswith('es/neurodiversidad/condiciones/') and rel!='es/neurodiversidad/condiciones/index.html' and before.exists():
        old=BeautifulSoup(before.read_text(),'html.parser').find('main')
        new=soup.find('main')
        if old:
            for back in old.select('.ig-back'):back.decompose()
        if new:
            for back in new.select('.ig-back'):back.decompose()
        if old and new and old.get_text(' ',strip=True)!=new.get_text(' ',strip=True):report['failures'].append('Cambio documental no previsto: '+rel)
report['static']={'html':len(files),'main_navigations':nav_pages,'support_submenus_kept':internal_support,'missing_local_paths':{k:{'count':len(v),'examples':v[:3]} for k,v in missing.items()}}
if missing:report['failures'].append(f'{len(missing)} rutas locales sin resolver')

PAGES=['/','/es/neurodiversidad/condiciones/','/es/neurodiversidad/condiciones/abuso-y-explotacion/','/es/situaciones/','/es/biblioteca/','/es/recursos/juegos/','/es/cuestionarios/','/es/videos/','/es/tramites/','/es/tramites/directorio/','/es/vivir-fuera/','/es/libros/','/es/taller/','/es/intereses/','/es/sitio-tranquilo/','/es/investigacion/','/es/sobre-iris-green/','/es/neurodiversidad/temas/autismo/','/en/neurodiversity/conditions/']
with sync_playwright() as pw:
    browser=pw.chromium.launch()
    for width,height in [(1440,1000),(390,844),(320,740)]:
        for path in PAGES:
            row={'path':path,'viewport':[width,height]};errors=[];audio_requests=[];bad_local=[]
            ctx=browser.new_context(viewport={'width':width,'height':height})
            page=ctx.new_page()
            page.set_default_timeout(15000)
            def route(r):
                if r.request.url.startswith(BASE):r.continue_()
                else:r.abort()
            page.route('**/*',route)
            page.on('pageerror',lambda error:errors.append(str(error)))
            page.on('request',lambda request:audio_requests.append(request.url) if urlsplit(request.url).path.lower().endswith(('.mp3','.m4a','.ogg','.wav','.aac')) else None)
            page.on('response',lambda response:bad_local.append({'url':response.url,'status':response.status}) if response.url.startswith(BASE) and response.status>=400 else None)
            page.add_init_script("window.__cls=0; new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__cls+=e.value}).observe({type:'layout-shift',buffered:true});")
            try:
                start=time.monotonic();response=page.goto(BASE+path,wait_until='domcontentloaded')
                assert response and response.status==200
                page.locator('main h1').first.wait_for(state='visible')
                page.wait_for_timeout(550)
                row['ready_ms']=round((time.monotonic()-start)*1000)
                row['title']=page.locator('main h1').first.inner_text()
                row['overflow_px']=page.evaluate('Math.max(0,document.documentElement.scrollWidth-innerWidth)')
                assert row['overflow_px']<=2,'La página desborda horizontalmente: '+str(row['overflow_px'])
                row['audio_requests_before_open']=len(audio_requests)
                assert not audio_requests,'Carga audio sin abrir Música'
                trigger=page.locator('#plBtn:visible,.ig-uh-music:visible,[data-ig-music]:visible').first
                assert trigger.count(),'No hay botón de Música visible'
                before=page.locator('main').first.bounding_box();scroll_before=page.evaluate('scrollY')
                await_before=page.evaluate('document.documentElement.scrollHeight')
                trigger.click()
                panel=page.locator('#ig-music-panel');panel.wait_for(state='visible')
                box=panel.bounding_box();after=page.locator('main').first.bounding_box()
                row['music_box']=box
                if path=='/' and width==390:
                    import base64
                    (OUT/'player-mobile-preview.b64').write_text(base64.b64encode(panel.screenshot(type='jpeg',quality=10)).decode())
                row['music_content_shift_px']=round(abs(before['y']-after['y']),3)
                assert row['music_content_shift_px']<1,'El reproductor ha desplazado el contenido'
                assert abs(page.evaluate('scrollY')-scroll_before)<1,'Abrir Música ha movido el scroll'
                assert page.evaluate('document.documentElement.scrollHeight')==await_before,'Abrir Música ha cambiado la altura de la página'
                assert box['width']<=321 and box['height']<400,'El panel no es compacto'
                assert 0 <= width-box['x']-box['width'] <= 32 and panel.evaluate('(el)=>getComputedStyle(el).position') == 'fixed', 'El panel no está anclado al borde derecho'
                assert abs(height-box['y']-box['height']-12)<2,'El panel no está abajo'
                assert not audio_requests,'Abrir Música descarga pistas antes de Escuchar'
                page.evaluate('window.scrollTo(0,500)');page.wait_for_timeout(60)
                moved=panel.bounding_box();assert abs(moved['y']-box['y'])<1,'El panel no permanece fijo al desplazar'
                page.keyboard.press('Escape');assert not panel.is_visible()
                row['music_pass']=True
                if path in ['/es/tramites/','/es/tramites/directorio/','/es/vivir-fuera/']:
                    assert page.locator('.ig-subtabs a[href="/es/tramites/"]').is_visible(), 'Cómo pedirlo no se ve dentro de Ayudas'
                if path=='/es/neurodiversidad/condiciones/':
                    page.locator('#filtros button[data-type]').first.wait_for()
                    assert page.locator('.cards>a.card:visible').count()==185
                    types=page.locator('#filtros button[data-type]').all_text_contents()
                    row['types']=types;assert len(types)==12,'No se muestran los once tipos reales'
                    page.locator('#filtros button[data-type="contexto"]').click()
                    visible=page.locator('.cards>a.card:visible');assert 0<visible.count()<185
                    assert all(s=='contexto' for s in visible.locator('.chip').all_text_contents())
                    page.locator('#ig-search-reset').click()
                    page.locator('#az button[data-letter="X"]').click()
                    assert page.locator('.cards>a.card:visible').count()>=1
                    row['x_titles']=page.locator('.cards>a.card:visible strong').all_text_contents()
                    page.locator('#ig-search-reset').click()
                    page.locator('#q').fill('TOC');page.wait_for_timeout(80)
                    assert 0<page.locator('.cards>a.card:visible').count()<185
                    assert 'TOC' in page.locator('#cuenta').inner_text()
                    page.locator('#q').fill('zzzinexistentexx');page.wait_for_timeout(80)
                    assert page.locator('.cards>a.card:visible').count()==0
                    assert page.locator('#ig-search-empty a[href="/es/situaciones/"]').is_visible()
                    page.locator('#ig-search-reset').click();row['filters_pass']=True
                if path=='/':
                    assert page.locator('#ig-books-message').count()==1
                    msg=page.locator('#ig-books-message').bounding_box();search=page.locator('#consola').bounding_box()
                    assert msg['y']<search['y']
                    page.locator('input[type=search]').first.fill('TOC');page.wait_for_timeout(100)
                    urls=page.locator('#consola a[href*="/condiciones/"]').evaluate_all('(els)=>els.map(a=>a.getAttribute("href"))')
                    assert len(urls)==len(set(urls)),'Resultados duplicados'
                    assert any('/toc/' in u for u in urls),'TOC no aparece al buscar'
                    row['home_search_pass']=True
                if width<=390:
                    page.evaluate('window.scrollTo(0,0)')
                    menu=page.locator('.ig-menu-button:visible').first
                    assert menu.count(),'No hay menú móvil'
                    menu.click();assert menu.get_attribute('aria-expanded')=='true'
                    assert page.locator('header #ig-main-nav').is_visible()
                    page.keyboard.press('Escape');assert not page.locator('header #ig-main-nav').is_visible()
                    row['mobile_menu_pass']=True
                if path in ['/','/es/neurodiversidad/condiciones/','/es/tramites/']:
                    page.evaluate('window.scrollTo(0,0)')
                    name='home' if path=='/' else path.strip('/').replace('/','-')
                    page.screenshot(path=str(OUT/f'{name}-{width}.png'),full_page=False)
                    page.locator('#plBtn:visible,.ig-uh-music:visible,[data-ig-music]:visible').first.click()
                    page.screenshot(path=str(OUT/f'{name}-musica-{width}.png'),full_page=False)
                row['cls']=page.evaluate('window.__cls')
                row['pageerrors']=errors;row['local_http_errors']=bad_local
                assert not errors,'Errores JavaScript: '+repr(errors[:4])
                assert not bad_local,'Recursos locales fallidos: '+repr(bad_local[:4])
                row['passed']=True
            except Exception as error:
                row.update({'passed':False,'error':str(error),'pageerrors':errors,'local_http_errors':bad_local})
                report['failures'].append(f'{path} ({width}px): {error}')
                try:page.screenshot(path=str(OUT/f'failure-{len(report["browser"])}.png'),full_page=False)
                except Exception:pass
            finally:
                report['browser'].append(row);ctx.close()
            print(json.dumps(row,ensure_ascii=False),flush=True)
    browser.close()
server.shutdown()
report['passed']=not report['failures']
(OUT/'browser-tests.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('RESULTADO',json.dumps({'passed':report['passed'],'scenarios':len(report['browser']),'failures':report['failures']},ensure_ascii=False))
if not report['passed']:raise SystemExit(1)
