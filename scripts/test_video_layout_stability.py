#!/usr/bin/env python3
"""Detecta saltos de layout al activar vídeos en escritorio y móvil.

Mide la caja 16:9 y la posición de scroll justo antes y después del clic. Las
peticiones al proveedor se abortan: se prueba el cambio de DOM/layout sin depender
de Internet ni enviar datos a terceros.
"""
from __future__ import annotations
import functools,re,threading
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path.cwd().resolve();ROUTE='/es/videos/'
PROVIDERS=[('YouTube','https://www.youtube-nocookie.com',True),('Vimeo','https://player.vimeo.com',True),('Instagram','https://www.instagram.com',False)]
VIEWPORTS=[('desktop',1440,900),('mobile-390',390,844),('mobile-320',320,700)]
TOLERANCE_PX=1.25

def csp():
    text=(ROOT/'_headers').read_text(encoding='utf-8',errors='strict');m=re.search(r'^/\*\s*$.*?^\s*Content-Security-Policy:\s*(.+)$',text,re.M|re.S)
    if not m:raise RuntimeError('No se encuentra CSP global')
    return m.group(1).splitlines()[0].strip()

def server(policy):
    class Handler(SimpleHTTPRequestHandler):
        def end_headers(self):self.send_header('Content-Security-Policy',policy);self.send_header('X-Content-Type-Options','nosniff');super().end_headers()
        def log_message(self,*_):pass
    httpd=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Handler,directory=str(ROOT)));threading.Thread(target=httpd.serve_forever,daemon=True).start();return httpd,f'http://127.0.0.1:{httpd.server_port}'

def expand(page):
    for _ in range(12):
        more=page.locator('main').get_by_role('button',name=re.compile(r'^Ver más')).last
        if not more.count() or not more.is_visible():break
        more.click()

def box_from_poster(poster):
    return poster.evaluate("""el=>{const r=el.parentElement.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,top:r.top,bottom:r.bottom}}""")

def box_from_frame(frame):
    return frame.evaluate("""el=>{const r=el.parentElement.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,top:r.top,bottom:r.bottom}}""")

def delta(a,b,key):return abs(float(a[key])-float(b[key]))

def main():
    httpd,base=server(csp());failures=[];rows=[]
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch()
            for vp_name,width,height in VIEWPORTS:
                for label,source,required in PROVIDERS:
                    page=browser.new_page(viewport={'width':width,'height':height});page.set_default_timeout(15000)
                    page.route(source+'/**',lambda route,request:route.abort())
                    try:
                        page.goto(base+ROUTE,wait_until='domcontentloaded');page.locator('main h1').first.wait_for(state='visible');expand(page)
                        poster=page.locator(f'button.ig-video-poster[data-ig-video^="{source}"]').first
                        if not poster.count():
                            if required:failures.append(f'{vp_name} {label}: no hay tarjeta activa')
                            continue
                        poster.scroll_into_view_if_needed();page.wait_for_timeout(50)
                        before=box_from_poster(poster);scroll_before=page.evaluate('window.scrollY')
                        poster.click();frame=page.locator(f'main iframe[src^="{source}"]').first;frame.wait_for(state='attached');page.wait_for_timeout(120)
                        after=box_from_frame(frame);scroll_after=page.evaluate('window.scrollY')
                        diffs={k:delta(before,after,k) for k in ('x','y','width','height','top','bottom')};scroll_delta=abs(float(scroll_after)-float(scroll_before))
                        rows.append({'viewport':vp_name,'provider':label,'before':before,'after':after,'diffs':diffs,'scroll_delta':scroll_delta})
                        bad={k:v for k,v in diffs.items() if v>TOLERANCE_PX}
                        if bad:failures.append(f'{vp_name} {label}: cambia la caja del reproductor {bad}')
                        if scroll_delta>TOLERANCE_PX:failures.append(f'{vp_name} {label}: cambia scrollY {scroll_delta:.2f}px')
                    except Exception as exc:failures.append(f'{vp_name} {label}: {exc}')
                    finally:page.close()
            browser.close()
    finally:httpd.shutdown()
    if failures:raise AssertionError('Saltos de vídeo detectados:\n'+'\n'.join(failures[:30]))
    print({'casos_probados':len(rows),'viewports':[x[0] for x in VIEWPORTS],'tolerancia_px':TOLERANCE_PX,'saltos_detectados':0,'resultados':rows})
if __name__=='__main__':main()
