#!/usr/bin/env python3
"""Diagnóstico reproducible para WCAG 2.2 SC 2.4.11 Focus Not Obscured (Minimum).

Recorre con Tab el foco real del navegador en rutas representativas, tanto en
escritorio como en móvil. Para cada elemento enfocado comprueba que alguna parte
de su caja queda dentro del viewport y que al menos un punto de esa parte sigue
siendo alcanzable por hit-testing, es decir, no está completamente tapado por
contenido creado por la página.

Esta primera pasada es diagnóstica: registra candidatos y errores de página. Una
vez medido el baseline, el propio PR puede convertir cero candidatos en contrato
de no regresión. No sustituye una revisión manual de todos los estados abiertos.
"""
from __future__ import annotations

import functools
import json
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path.cwd()
OUT = ROOT / 'reports' / 'wcag-focus-not-obscured'
OUT.mkdir(parents=True, exist_ok=True)
ROUTES = [
    '/', '/es/situaciones/', '/es/neurodiversidad/condiciones/', '/es/biblioteca/',
    '/es/investigacion/', '/es/datos/', '/es/tramites/directorio/', '/es/libros/',
    '/es/videos/', '/es/recursos/juegos/', '/es/intereses/', '/es/taller/',
    '/es/sitio-tranquilo/'
]
VIEWPORTS = {
    'desktop': {'width': 1280, 'height': 900},
    'mobile': {'width': 390, 'height': 844},
}
MAX_TABS = 70

CHECK = r'''() => {
 const el=document.activeElement;
 if(!el || el===document.body || el===document.documentElement) return null;
 const r=el.getBoundingClientRect();
 const left=Math.max(0,r.left), top=Math.max(0,r.top);
 const right=Math.min(innerWidth,r.right), bottom=Math.min(innerHeight,r.bottom);
 const iw=Math.max(0,right-left), ih=Math.max(0,bottom-top);
 const base={
   tag:el.tagName,id:el.id||'',cls:String(el.className||'').slice(0,120),
   text:(el.innerText||el.getAttribute('aria-label')||el.getAttribute('title')||'').trim().slice(0,140),
   href:el.getAttribute('href')||'',rect:[r.x,r.y,r.width,r.height],
   viewport:[innerWidth,innerHeight],intersection:[left,top,iw,ih]
 };
 if(iw<1 || ih<1) return {...base,visible:false,hit:false,blockers:[]};
 const xs=[left+Math.min(2,iw/2),(left+right)/2,right-Math.min(2,iw/2)];
 const ys=[top+Math.min(2,ih/2),(top+bottom)/2,bottom-Math.min(2,ih/2)];
 let hit=false;const blockers=[];
 for(const x0 of xs) for(const y0 of ys){
   const x=Math.max(0,Math.min(innerWidth-1,x0));
   const y=Math.max(0,Math.min(innerHeight-1,y0));
   const topEl=document.elementFromPoint(x,y);
   if(topEl && (topEl===el || el.contains(topEl) || topEl.contains(el))){hit=true;continue;}
   if(topEl) blockers.push({tag:topEl.tagName,id:topEl.id||'',cls:String(topEl.className||'').slice(0,100)});
 }
 return {...base,visible:true,hit,blockers:[...new Map(blockers.map(x=>[JSON.stringify(x),x])).values()].slice(0,5)};
}'''


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def main() -> None:
    server = ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}'
    report = {
        'criterion': 'WCAG 2.2 SC 2.4.11 Focus Not Obscured (Minimum)',
        'routes': [],
        'candidates': [],
        'page_errors': [],
        'limits': [
            'Forward Tab traversal covers the initial page state; dialogs, menus and other states opened by interaction need separate flow tests.',
            'Hit-testing detects complete visual occlusion of the focused element, not every possible partial-obscuration usability issue.',
            'The sample covers representative routes at desktop and mobile viewport sizes.',
        ],
    }
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        for viewport_name, viewport in VIEWPORTS.items():
            for route in ROUTES:
                ctx = browser.new_context(viewport=viewport, reduced_motion='reduce')
                ctx.route('**/*', lambda req: req.continue_() if req.request.url.startswith(base) else req.abort())
                page = ctx.new_page()
                errors: list[str] = []
                page.on('pageerror', lambda err: errors.append(str(err)))
                page.goto(base + route, wait_until='domcontentloaded')
                page.locator('main h1').first.wait_for(timeout=15000)
                page.wait_for_timeout(250)
                visited: list[dict] = []
                first_key = None
                wraps = 0
                for _ in range(MAX_TABS):
                    page.keyboard.press('Tab')
                    page.wait_for_timeout(25)
                    row = page.evaluate(CHECK)
                    if not row:
                        continue
                    key = '|'.join([row['tag'], row['id'], row['href'], row['text'][:60]])
                    if first_key is None:
                        first_key = key
                    elif key == first_key and len(visited) > 3:
                        wraps += 1
                        if wraps >= 1:
                            break
                    row.update({'route': route, 'viewport_name': viewport_name})
                    visited.append(row)
                    if not row['visible'] or not row['hit']:
                        report['candidates'].append(row)
                if errors:
                    report['page_errors'].append({'route': route, 'viewport_name': viewport_name, 'errors': errors})
                report['routes'].append({
                    'route': route,
                    'viewport_name': viewport_name,
                    'focused_elements_checked': len(visited),
                    'candidates': sum(1 for x in visited if not x['visible'] or not x['hit']),
                })
                print(json.dumps(report['routes'][-1], ensure_ascii=False), flush=True)
                ctx.close()
        browser.close()
    server.shutdown()
    report['summary'] = {
        'route_viewports': len(report['routes']),
        'focused_elements_checked': sum(x['focused_elements_checked'] for x in report['routes']),
        'candidates': len(report['candidates']),
        'page_errors': len(report['page_errors']),
    }
    (OUT / 'results.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(report['summary'], ensure_ascii=False))
    if report['page_errors']:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
