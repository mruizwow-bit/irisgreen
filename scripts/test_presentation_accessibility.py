#!/usr/bin/env python3
"""Pruebas de interacción de las nuevas opciones de presentación.
Chromium local; no equivalen a una certificación WCAG ni a pruebas con usuarios.
"""
import functools,json,threading
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path.cwd();OUT=ROOT/'reports/accessibility';OUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
threading.Thread(target=server.serve_forever,daemon=True).start();BASE=f'http://127.0.0.1:{server.server_port}'
report={'cases':[],'failures':[],'notes':['Chromium local con dominios externos bloqueados.','Las opciones se accionan desde el panel; las comprobaciones de persistencia reutilizan el mismo contexto.','La guía puede cruzar geométricamente el panel de ajustes porque se dibuja por debajo; la prueba de no ocultación se realiza además con un control real del contenido fuera del panel.','No sustituye pruebas con lector de pantalla, braille o dispositivos físicos.']}

def open_reading(page):
    trigger=page.locator('[data-ig-reading-trigger]:visible,.ig-uh-reading:visible,#a11yBtn:visible').first
    trigger.click();panel=page.locator('[data-ig-reading-panel]:visible').first;panel.wait_for()
    details=panel.locator('[data-ig-presentation-settings]');details.wait_for()
    if not details.get_attribute('open'):
        details.locator('summary').focus();details.locator('summary').press('Enter')
    return trigger,panel,details

def root_state(page):
    return page.evaluate('''()=>({theme:document.documentElement.dataset.igTheme,opaque:document.documentElement.dataset.igOpaque,focus:document.documentElement.dataset.igFocus,guidePosition:document.documentElement.dataset.igGuidePosition,guideHeight:document.documentElement.dataset.igGuideHeight,scale:getComputedStyle(document.documentElement).getPropertyValue('--ig-reading-scale').trim(),overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth)})''')

def assert_local_clean(errors,bad):
    assert not errors,errors
    assert not bad,bad[:5]

def overlaps(a,b):
    return bool(a and b and a['x']<b['x']+b['width'] and a['x']+a['width']>b['x'] and a['y']<b['y']+b['height'] and a['y']+a['height']>b['y'])

def setup_page(browser,width,path='/'):
    ctx=browser.new_context(viewport={'width':width,'height':900});page=ctx.new_page();page.set_default_timeout(12000);errors=[];bad=[]
    page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) else r.abort())
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('response',lambda r:bad.append({'url':r.url,'status':r.status}) if r.url.startswith(BASE) and r.status>=400 else None)
    page.goto(BASE+path,wait_until='domcontentloaded');page.locator('main h1').first.wait_for();page.wait_for_timeout(150)
    return ctx,page,errors,bad

with sync_playwright() as pw:
    browser=pw.chromium.launch()
    for width in [1440,390,320]:
        ctx,page,errors,bad=setup_page(browser,width,'/es/lectura-accesible/')
        row={'case':'default','width':width}
        try:
            state=root_state(page);row['state']=state
            assert state['theme']=='original' and state['opaque']=='off' and state['focus']=='off','La presentación inicial debe ser Original'
            assert state['overflow']<=2,'Desbordamiento en presentación inicial'
            assert_local_clean(errors,bad);row['passed']=True
        except Exception as e:row['passed']=False;row['error']=str(e);report['failures'].append(row.copy())
        report['cases'].append(row);ctx.close()

    for width in [1440,390,320]:
        ctx,page,errors,bad=setup_page(browser,width,'/')
        row={'case':'themes-persistence-focus','width':width}
        try:
            trigger,panel,details=open_reading(page)
            details.locator('[data-ig-theme-select]').select_option('dark')
            details.locator('[data-ig-presentation-toggle="opaque"]').click()
            details.locator('[data-ig-presentation-toggle="focus"]').click()
            state=root_state(page);assert (state['theme'],state['opaque'],state['focus'])==('dark','on','on'),'Tema, opacidad o vista centrada no se aplicaron'
            assert trigger.is_visible() and panel.is_visible(),'Debe quedar una salida visible de la vista centrada'
            assert page.locator('header .ig-uh-nav,header .nav').evaluate_all('(els)=>els.every(e=>getComputedStyle(e).display==="none")'),'La navegación principal debe reducirse'
            if page.locator('footer').count():assert page.locator('footer').evaluate_all('(els)=>els.every(e=>getComputedStyle(e).display==="none")'),'El pie debe reducirse en vista centrada'
            if page.locator('main img').count():assert page.locator('main img').evaluate_all('(els)=>els.every(e=>getComputedStyle(e).filter==="none")'),'El tema no debe filtrar imágenes'
            for path in ['/es/neurodiversidad/condiciones/','/es/intereses/','/es/recursos/juegos/las-cinco-cosas/']:
                page.goto(BASE+path,wait_until='domcontentloaded');page.locator('main h1').first.wait_for();page.wait_for_timeout(100)
                s=root_state(page);assert (s['theme'],s['opaque'],s['focus'])==('dark','on','on'),'Las preferencias no persistieron en '+path
                assert s['overflow']<=2,'Desbordamiento en '+path
                if page.locator('main img').count():assert page.locator('main img').evaluate_all('(els)=>els.every(e=>getComputedStyle(e).filter==="none")'),'Imagen filtrada en '+path
            row['persisted_paths']=3;row['passed']=True;assert_local_clean(errors,bad)
            page.screenshot(path=str(OUT/f'presentation-dark-focus-{width}.png'),full_page=False)
        except Exception as e:row['passed']=False;row['error']=str(e);report['failures'].append(row.copy())
        report['cases'].append(row);ctx.close()

    for width in [1440,320]:
        ctx,page,errors,bad=setup_page(browser,width,'/es/lectura-accesible/')
        row={'case':'presentation-reset-isolated','width':width}
        try:
            trigger,panel,details=open_reading(page)
            page.evaluate('window.IGPreferences.update({scale:1.3,text:{font:"wide",word:.16},presentation:{theme:"dark",opaque:true,focus:true,guidePosition:"lower",guideHeight:"tall"}})')
            details.locator('[data-ig-presentation-reset]').click()
            s=root_state(page);prefs=page.evaluate('window.IGPreferences.get()')
            assert (s['theme'],s['opaque'],s['focus'],s['guidePosition'],s['guideHeight'])==('original','off','off','middle','medium'),'Restablecer presentación no devolvió solo este bloque a su origen'
            assert abs(prefs['scale']-1.3)<.001 and prefs.get('text',{}).get('font')=='wide' and prefs.get('text',{}).get('word')==.16,'Restablecer presentación cambió ajustes de texto'
            assert_local_clean(errors,bad);row['passed']=True
        except Exception as e:row['passed']=False;row['error']=str(e);report['failures'].append(row.copy())
        report['cases'].append(row);ctx.close()

    for width in [1440,390,320]:
        ctx,page,errors,bad=setup_page(browser,width,'/es/lectura-accesible/')
        row={'case':'guide-keyboard-touch-controls','width':width}
        try:
            trigger,panel,details=open_reading(page)
            upper=details.locator('[data-ig-guide-position="upper"]');upper.focus();upper.press('Enter');page.wait_for_timeout(60)
            guide=page.locator('#ig-guide,#rguide').filter(visible=True).first;guide.wait_for();top1=guide.bounding_box()['y']
            assert upper.get_attribute('aria-pressed')=='true','El botón Arriba no refleja su estado'
            lower=details.locator('[data-ig-guide-position="lower"]');lower.focus();lower.press('Enter');page.wait_for_timeout(60);top2=guide.bounding_box()['y']
            assert top2>top1,'La posición Abajo no mueve la guía hacia abajo'
            assert lower.get_attribute('aria-pressed')=='true','El botón Abajo no refleja su estado'
            height=details.locator('[data-ig-guide-height]');height.select_option('tall');page.wait_for_timeout(60);box=guide.bounding_box();assert 62<=box['height']<=66,'La altura Alta debe ser aproximadamente 64 px'
            s=root_state(page);assert s['guidePosition']=='lower' and s['guideHeight']=='tall','La posición/altura no queda registrada';assert s['overflow']<=2,'La guía causa desbordamiento'
            z=page.evaluate('''([p,g])=>{const n=e=>{const v=getComputedStyle(e).zIndex;return v==='auto'?0:(parseInt(v,10)||0)};return {panel:n(document.querySelector(p)),guide:n(document.querySelector(g))}}''',['[data-ig-reading-panel]','#ig-guide'])
            assert z['panel']>z['guide'],f'El panel debe quedar por encima de la guía: {z}'
            page.keyboard.press('Escape');page.wait_for_timeout(80)
            target=page.locator('main a[href^="mailto:"]:visible').first;target.scroll_into_view_if_needed();page.wait_for_timeout(30)
            handle=target.element_handle()
            page.evaluate('''e=>{const g=document.querySelector('#ig-guide,#rguide').getBoundingClientRect(),r=e.getBoundingClientRect();window.scrollBy(0,r.top-(g.top+8));}''',handle);page.wait_for_timeout(80)
            before_g=guide.bounding_box();before_t=target.bounding_box();assert overlaps(before_g,before_t),'La prueba no logró colocar un control real bajo la guía'
            target.focus();page.wait_for_timeout(100);after_g=guide.bounding_box();after_t=target.bounding_box();assert not overlaps(after_g,after_t),'La guía no se apartó del control enfocado'
            assert_local_clean(errors,bad);row.update({'upper_y':top1,'lower_y':top2,'height':box['height'],'panel_z':z['panel'],'guide_z':z['guide'],'passed':True})
            page.screenshot(path=str(OUT/f'guide-keyboard-{width}.png'),full_page=False)
        except Exception as e:row['passed']=False;row['error']=str(e);report['failures'].append(row.copy())
        report['cases'].append(row);ctx.close()

    for width in [1440,390,320]:
        ctx,page,errors,bad=setup_page(browser,width,'/es/neurodiversidad/condiciones/')
        row={'case':'light-opaque','width':width}
        try:
            trigger,panel,details=open_reading(page);details.locator('[data-ig-theme-select]').select_option('light');details.locator('[data-ig-presentation-toggle="opaque"]').click()
            state=root_state(page);assert state['theme']=='light' and state['opaque']=='on' and state['overflow']<=2,'Tema Claro/Fondo opaco no aplicado'
            bg=page.evaluate('getComputedStyle(document.body).backgroundColor');assert bg not in ('rgba(0, 0, 0, 0)','transparent'),'El fondo opaco no puede ser transparente'
            if page.locator('main img').count():assert page.locator('main img').evaluate_all('(els)=>els.every(e=>getComputedStyle(e).filter==="none")'),'El tema no debe filtrar imágenes'
            assert_local_clean(errors,bad);row['body_background']=bg;row['passed']=True
        except Exception as e:row['passed']=False;row['error']=str(e);report['failures'].append(row.copy())
        report['cases'].append(row);ctx.close()
    browser.close()
server.shutdown();report['passed']=not report['failures'];report['summary']={'passed':sum(1 for x in report['cases'] if x.get('passed')),'total':len(report['cases'])}
(OUT/'presentation-guide-tests.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'summary':report['summary'],'failures':report['failures']},ensure_ascii=False))
if not report['passed']:raise SystemExit(1)
