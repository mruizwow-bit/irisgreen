#!/usr/bin/env python3
"""Inventario reproducible para WCAG 2.2 SC 2.5.8 Target Size (Minimum).

Mide objetivos interactivos visibles en una muestra representativa de rutas, en
escritorio y móvil. Clasifica automáticamente:
- cumple por tamaño >=24x24 CSS px;
- excepción Inline para enlaces de texto realmente inline;
- excepción User agent para controles nativos pequeños no estilizados;
- excepción Spacing usando el círculo de 24 CSS px descrito por W3C.

Los casos restantes se marcan para revisión manual porque las excepciones
Equivalent y Essential no pueden inferirse con seguridad desde el DOM.
Esta primera versión informa; no bloquea el build por candidatos.
"""
from __future__ import annotations

import functools
import json
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path.cwd()
OUT = ROOT / 'reports' / 'wcag-target-size'
OUT.mkdir(parents=True, exist_ok=True)

ROUTES = [
    '/', '/es/situaciones/', '/es/situaciones/la-ropa-me-molesta/',
    '/es/neurodiversidad/condiciones/', '/es/neurodiversidad/condiciones/autismo/',
    '/es/biblioteca/', '/es/investigacion/', '/es/datos/',
    '/es/tramites/directorio/', '/es/libros/', '/es/videos/',
    '/es/recursos/juegos/', '/es/recursos/juegos/las-cinco-cosas/',
    '/es/intereses/', '/es/taller/', '/es/sitio-tranquilo/',
]
VIEWPORTS = [1280, 390]

JS_TARGETS = r'''() => {
  const selector = [
    'a[href]','button','input:not([type=hidden])','select','textarea','summary',
    '[role=button]','[role=link]','[role=checkbox]','[role=radio]',
    '[role=switch]','[role=tab]','[role=menuitem]'
  ].join(',');
  const all = Array.from(document.querySelectorAll(selector));
  const rows = [];
  for (let i=0;i<all.length;i++) {
    const el = all[i];
    if (el.closest('[hidden],[aria-hidden="true"],template,noscript')) continue;
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    if (cs.display==='none' || cs.visibility==='hidden' || cs.pointerEvents==='none') continue;
    if (r.width <= 0 || r.height <= 0 || r.right <= 0 || r.bottom <= 0) continue;
    if (el.disabled || el.getAttribute('aria-disabled') === 'true') continue;
    const tag = el.tagName;
    const type = (el.getAttribute('type') || '').toLowerCase();
    const inline = tag === 'A' && cs.display === 'inline';
    const nativeSmall = tag === 'INPUT' && ['checkbox','radio','range','color','file'].includes(type) &&
      cs.appearance !== 'none' && cs.webkitAppearance !== 'none';
    rows.push({
      idx:i, tag, type, id:el.id || '', cls:String(el.className || '').slice(0,120),
      text:(el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || el.value || '').trim().slice(0,140),
      display:cs.display, appearance:cs.appearance || '', webkitAppearance:cs.webkitAppearance || '',
      x:r.x, y:r.y, width:r.width, height:r.height, right:r.right, bottom:r.bottom,
      cx:r.x+r.width/2, cy:r.y+r.height/2, inline, nativeSmall
    });
  }
  return rows;
}'''


def spacing_ok(target, others):
    """W3C 2.5.8 spacing: 24px circle centered on an undersized target.

    It must not intersect another target, nor the 24px circle of another
    undersized target. Rect/circle math is conservative at touching edges.
    """
    radius = 12.0
    cx, cy = target['cx'], target['cy']
    for other in others:
        if other is target:
            continue
        undersized = other['width'] < 24 or other['height'] < 24
        if undersized:
            dx, dy = cx - other['cx'], cy - other['cy']
            if dx*dx + dy*dy < 24*24:
                return False
        else:
            nearest_x = min(max(cx, other['x']), other['right'])
            nearest_y = min(max(cy, other['y']), other['bottom'])
            dx, dy = cx - nearest_x, cy - nearest_y
            if dx*dx + dy*dy < radius*radius:
                return False
    return True


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


server = ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
BASE = f'http://127.0.0.1:{server.server_port}'

report = {
    'criterion':'WCAG 2.2 SC 2.5.8 Target Size (Minimum) AA',
    'method':'24x24 CSS px, then Inline/User-agent/Spacing exceptions; Equivalent/Essential remain manual.',
    'viewports':VIEWPORTS,
    'routes':ROUTES,
    'cases':[],
    'manual_candidates':[],
    'limits':[
        'Equivalent and Essential exceptions require human review.',
        'Only the initial visible state of each route is measured; controls revealed after interaction need separate interaction tests.',
        'This report is not a complete WCAG conformance claim.'
    ]
}

with sync_playwright() as pw:
    browser = pw.chromium.launch()
    for width in VIEWPORTS:
        for route in ROUTES:
            ctx = browser.new_context(viewport={'width':width,'height':900}, reduced_motion='reduce')
            ctx.route('**/*', lambda req: req.continue_() if req.request.url.startswith(BASE) else req.abort())
            page = ctx.new_page()
            errors=[]
            page.on('pageerror', lambda err: errors.append(str(err)))
            page.goto(BASE+route, wait_until='domcontentloaded')
            page.locator('main h1').first.wait_for(timeout=15000)
            page.wait_for_timeout(350)
            targets = page.evaluate(JS_TARGETS)
            counts={'meets_size':0,'inline_exception':0,'user_agent_exception':0,'spacing_exception':0,'manual_review':0}
            candidates=[]
            for target in targets:
                if target['width'] >= 24 and target['height'] >= 24:
                    status='meets_size'
                elif target['inline']:
                    status='inline_exception'
                elif target['nativeSmall']:
                    status='user_agent_exception'
                elif spacing_ok(target, targets):
                    status='spacing_exception'
                else:
                    status='manual_review'
                    item={k:target[k] for k in ('tag','type','id','cls','text','display','x','y','width','height')}
                    item.update({'route':route,'viewport':width})
                    candidates.append(item)
                    report['manual_candidates'].append(item)
                counts[status]+=1
            report['cases'].append({
                'route':route,'viewport':width,'targets':len(targets),'counts':counts,
                'manual_candidates':candidates,'page_errors':errors
            })
            print(json.dumps({'route':route,'viewport':width,'targets':len(targets),'counts':counts},ensure_ascii=False),flush=True)
            ctx.close()
    browser.close()

server.shutdown()
report['summary']={
    'cases':len(report['cases']),
    'targets':sum(c['targets'] for c in report['cases']),
    'manual_candidates':len(report['manual_candidates']),
    'page_errors':sum(len(c['page_errors']) for c in report['cases'])
}
(OUT/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report['summary'],ensure_ascii=False))
if report['summary']['page_errors']:
    raise SystemExit(1)
