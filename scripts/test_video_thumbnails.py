#!/usr/bin/env python3
"""Comprueba imágenes reales locales y controles, no la reproducción remota."""
import functools,json,re,threading,traceback
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright
ROOT=Path.cwd();OUT=ROOT/'reports/thumbnails';OUT.mkdir(parents=True,exist_ok=True)
manifest=json.loads((ROOT/'assets/video-thumbnails/manifest.json').read_text())
expected=set(manifest['requested_ids'])
REPORT={'cases':[],'failures':[],'notes':['Pruebas en Chromium con dominios externos bloqueados.','La existencia de una imagen no valida la disponibilidad o incrustación del vídeo.','Se recorre el listado como visitante; no se fuerza el estado del componente.']}
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start();BASE=f'http://127.0.0.1:{server.server_port}'

def record_failure(row,error):
    row['passed']=False;row['error']=str(error);row['traceback']=traceback.format_exc();REPORT['failures'].append(row.copy())

with sync_playwright() as pw:
    browser=pw.chromium.launch()
    for width,lang in [(1440,'es'),(390,'es'),(320,'es'),(390,'en')]:
        for path in ['/','/es/videos/']:
            row={'path':path,'width':width,'language':lang};external=[];errors=[]
            context=browser.new_context(viewport={'width':width,'height':1000 if width==1440 else 844});page=context.new_page();page.set_default_timeout(12000)
            def route(r):
                if r.request.url.startswith(BASE):r.continue_()
                else:external.append(r.request.url);r.abort()
            page.route('**/*',route);page.on('pageerror',lambda e:errors.append(str(e)))
            try:
                page.goto(BASE+path,wait_until='domcontentloaded');page.locator('main h1').first.wait_for()
                if lang=='en':page.locator('.ig-uh-langs button:visible').filter(has_text=re.compile('^EN$')).click()
                area=page.locator('#escuchar') if path=='/' else page.locator('main').first
                first=area.locator('button.ig-video-poster[data-ig-video*="youtube"]').first
                first.wait_for(state='attached');first.scroll_into_view_if_needed()
                first.locator('img.ig-video-thumbnail').wait_for(state='visible')
                page.wait_for_function('(sel)=>{const im=document.querySelector(sel);return im&&im.complete&&im.naturalWidth>=320}',('#escuchar ' if path=='/' else 'main ')+'img.ig-video-thumbnail')
                assert not page.locator('main iframe[src]').count(),'El reproductor ya se cargaba antes de pulsarlo'
                assert not any(re.search(r'(?:ytimg|youtube|vimeo|instagram)\.',u) for u in external),external
                if lang=='es':
                    for _ in range(12):
                        more=area.get_by_role('button',name=re.compile('^Ver más')).last
                        if not more.count() or not more.is_visible():break
                        more.click()
                posters=area.locator('button.ig-video-poster[data-ig-video*="youtube"]')
                count=posters.count();row['youtube_posters']=count
                if lang=='es':assert count==len(expected),(count,len(expected))
                checked=[]
                for n in range(count):
                    poster=posters.nth(n);poster.scroll_into_view_if_needed();before=poster.bounding_box()
                    im=poster.locator('img.ig-video-thumbnail');im.wait_for(state='visible')
                    im.evaluate('(im)=>im.decode()')
                    data=im.evaluate('(im)=>({src:new URL(im.currentSrc).pathname,width:im.naturalWidth,height:im.naturalHeight,loading:im.loading,opacity:getComputedStyle(im).opacity})')
                    ident=re.search(r'/embed/([A-Za-z0-9_-]{11})',poster.get_attribute('data-ig-video'))[1]
                    assert ident in manifest['images'],ident
                    assert data['src']==manifest['images'][ident]['path'],data
                    assert data['width']>=320 and data['height']>=180 and data['loading']=='lazy' and data['opacity']=='1',data
                    after=poster.bounding_box();assert abs(before['height']-after['height'])<1
                    assert abs(after['width']/after['height']-16/9)<.04
                    assert poster.get_attribute('aria-label') and len(poster.get_attribute('aria-label'))>15
                    checked.append(ident)
                row['images_checked']=len(checked);row['correct_image_ids']=len(set(checked));row['image_size_stable']=True
                assert page.evaluate('Math.max(0,document.documentElement.scrollWidth-innerWidth)')<=2
                first=area.locator('button.ig-video-poster[data-ig-video*="youtube"]').first
                first.evaluate('(e)=>{e.scrollIntoView({block:"start"});scrollBy(0,-170)}')
                page.screenshot(path=str(OUT/f'{"home" if path=="/" else "videoteca"}-{width}-{lang}.png'),full_page=False)
                first.click();frame=area.locator('iframe[src]').first;frame.wait_for(state='attached')
                assert 'youtube' in (urlsplit(frame.get_attribute('src')).hostname or '')
                row['play_opens_correct_provider']=True
                assert not errors,errors
                row['passed']=True
            except Exception as error:record_failure(row,error)
            REPORT['cases'].append(row);context.close()
    # La imagen puede fallar sin anular el botón ni dejar un icono roto.
    context=browser.new_context(viewport={'width':390,'height':844});page=context.new_page();page.set_default_timeout(12000);blocked=[]
    def unavailable(r):
        if not r.request.url.startswith(BASE):r.abort()
        elif '/assets/video-thumbnails/' in r.request.url and r.request.url.endswith('.jpg'):
            blocked.append(r.request.url);r.fulfill(status=404,body='')
        else:r.continue_()
    page.route('**/*',unavailable);row={'path':'/es/videos/','scenario':'thumbnail unavailable'}
    try:
        page.goto(BASE+'/es/videos/',wait_until='domcontentloaded')
        poster=page.locator('button.ig-video-poster[data-ig-video*="youtube"]').first;poster.scroll_into_view_if_needed()
        poster.locator('.ig-thumbnail-unavailable').wait_for(state='visible');assert blocked
        assert not poster.locator('img.ig-video-thumbnail').count()
        poster.click();page.locator('main iframe[src*="youtube"]').first.wait_for(state='attached')
        row.update({'passed':True,'fallback_visible':True,'play_still_works':True})
    except Exception as error:record_failure(row,error)
    REPORT['cases'].append(row);context.close();browser.close()
server.shutdown();REPORT['passed']=not REPORT['failures'];REPORT['requested_images']=len(expected)
(OUT/'tests.json').write_text(json.dumps(REPORT,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(REPORT,ensure_ascii=False))
if not REPORT['passed']:raise SystemExit(1)
