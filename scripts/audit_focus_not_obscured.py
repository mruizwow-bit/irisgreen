#!/usr/bin/env python3
"""Guardarraíl reproducible para WCAG 2.2 SC 2.4.11 Focus Not Obscured (Minimum).

Recorre con Tab el foco real del navegador en rutas representativas, tanto en
escritorio como en móvil. Para cada elemento enfocado comprueba, una vez
estabilizado el desplazamiento provocado por el propio foco, que alguna parte de
su caja queda dentro del viewport y que al menos un punto de esa parte sigue
siendo alcanzable por hit-testing.
"""
from __future__ import annotations
import functools,json,threading
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path.cwd();OUT=ROOT/'reports'/'wcag-focus-not-obscured';OUT.mkdir(parents=True,exist_ok=True)
ROUTES=['/','/es/situaciones/','/es/neurodiversidad/condiciones/','/es/biblioteca/','/es/investigacion/','/es/datos/','/es/tramites/directorio/','/es/libros/','/es/videos/','/es/recursos/juegos/','/es/intereses/','/es/taller/','/es/sitio-tranquilo/']
VIEWPORTS={'desktop':{'width':1280,'height':900},'mobile':{'width':390,'height':844}}
MAX_TABS=800;INITIAL_FOCUS_WAIT_MS=15;FOCUS_SETTLE_MS=500;FOCUS_POLL_MS=50
CHECK=r'''() => { const el=document.activeElement; if(!el||el===document.body||el===document.documentElement)return null; const r=el.getBoundingClientRect(); const left=Math.max(0,r.left),top=Math.max(0,r.top),right=Math.min(innerWidth,r.right),bottom=Math.min(innerHeight,r.bottom); const iw=Math.max(0,right-left),ih=Math.max(0,bottom-top); const base={tag:el.tagName,id:el.id||'',cls:String(el.className||'').slice(0,120),text:(el.innerText||el.getAttribute('aria-label')||el.getAttribute('title')||'').trim().slice(0,140),href:el.getAttribute('href')||'',rect:[r.x,r.y,r.width,r.height],viewport:[innerWidth,innerHeight],intersection:[left,top,iw,ih]}; if(iw<1||ih<1)return {...base,visible:false,hit:false,blockers:[]}; const xs=[left+Math.min(2,iw/2),(left+right)/2,right-Math.min(2,iw/2)],ys=[top+Math.min(2,ih/2),(top+bottom)/2,bottom-Math.min(2,ih/2)]; let hit=false;const blockers=[]; for(const x0 of xs)for(const y0 of ys){const x=Math.max(0,Math.min(innerWidth-1,x0)),y=Math.max(0,Math.min(innerHeight-1,y0));const topEl=document.elementFromPoint(x,y);if(topEl&&(topEl===el||el.contains(topEl)||topEl.contains(el))){hit=true;continue;}if(topEl)blockers.push({tag:topEl.tagName,id:topEl.id||'',cls:String(topEl.className||'').slice(0,100)});} return {...base,visible:true,hit,blockers:[...new Map(blockers.map(x=>[JSON.stringify(x),x])).values()].slice(0,5)}; }'''
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
def measure_settled_focus(page):
    page.wait_for_timeout(INITIAL_FOCUS_WAIT_MS);row=page.evaluate(CHECK)
    if not row or(row['visible'] and row['hit']):return row
    initial={'rect':row['rect'],'intersection':row['intersection'],'visible':row['visible'],'hit':row['hit'],'blockers':row['blockers']};waited=0
    while waited<FOCUS_SETTLE_MS:
        page.wait_for_timeout(FOCUS_POLL_MS);waited+=FOCUS_POLL_MS;current=page.evaluate(CHECK)
        if not current:return current
        row=current
        if row['visible'] and row['hit']:
            row['settled_after_ms']=INITIAL_FOCUS_WAIT_MS+waited;row['initial_measurement']=initial;return row
    row['settled_after_ms']=INITIAL_FOCUS_WAIT_MS+waited;row['initial_measurement']=initial;return row
def main():
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
    report={'criterion':'WCAG 2.2 SC 2.4.11 Focus Not Obscured (Minimum)','routes':[],'candidates':[],'transient_recoveries':[],'page_errors':[]}
    with sync_playwright() as pw:
        browser=pw.chromium.launch()
        for viewport_name,viewport in VIEWPORTS.items():
            for route in ROUTES:
                ctx=browser.new_context(viewport=viewport,reduced_motion='reduce');ctx.route('**/*',lambda req:req.continue_() if req.request.url.startswith(base) else req.abort());page=ctx.new_page();errors=[];page.on('pageerror',lambda err:errors.append(str(err)));page.goto(base+route,wait_until='domcontentloaded');page.locator('main h1').first.wait_for(timeout=15000);page.wait_for_timeout(250);visited=[];first_key=None;wrapped=False
                for _ in range(MAX_TABS):
                    page.keyboard.press('Tab');row=measure_settled_focus(page)
                    if not row:continue
                    key='|'.join([row['tag'],row['id'],row['href'],row['text'][:60]])
                    if first_key is None:first_key=key
                    elif key==first_key and len(visited)>3:wrapped=True;break
                    row.update({'route':route,'viewport_name':viewport_name});visited.append(row)
                    if row.get('initial_measurement') and row['visible'] and row['hit']:report['transient_recoveries'].append(row)
                    if not row['visible'] or not row['hit']:report['candidates'].append(row)
                if errors:report['page_errors'].append({'route':route,'viewport_name':viewport_name,'errors':errors})
                report['routes'].append({'route':route,'viewport_name':viewport_name,'focused_elements_checked':len(visited),'focus_cycle_completed':wrapped,'candidates':sum(1 for x in visited if not x['visible'] or not x['hit'])});ctx.close()
        browser.close()
    server.shutdown();report['summary']={'route_viewports':len(report['routes']),'focused_elements_checked':sum(x['focused_elements_checked'] for x in report['routes']),'focus_cycles_completed':sum(1 for x in report['routes'] if x['focus_cycle_completed']),'candidates':len(report['candidates']),'page_errors':len(report['page_errors'])};(OUT/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(json.dumps(report['summary'],ensure_ascii=False));incomplete=[x for x in report['routes'] if not x['focus_cycle_completed']]
    if report['page_errors'] or report['candidates'] or incomplete:raise SystemExit(1)
if __name__=='__main__':main()
