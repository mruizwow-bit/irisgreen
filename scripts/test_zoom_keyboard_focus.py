#!/usr/bin/env python3
"""Informe de cierre: 200 %, teclado y foco sobre dist.

Se ejecuta una vez en el PR de accesibilidad y escribe un informe JSON.
El modo «browser 200 %» se aproxima con un viewport CSS de 640 px para una
ventana de referencia de 1280 px; además se prueba texto al 200 % aumentando
la raíz del documento. Los hallazgos se documentan: este informe no bloquea
el Paso 2 salvo que otra prueba detecte que una página deja de funcionar.
"""
from __future__ import annotations

import argparse
import json
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from functools import partial

from playwright.sync_api import sync_playwright

ROUTES = [
    "/",
    "/es/situaciones/la-luz-del-supermercado-me-agota/",
    "/es/libros/",
    "/es/tramites/directorio/",
    "/es/recursos/juegos/",
    "/es/intereses/",
]


def overflow(page) -> int:
    return page.evaluate("Math.max(0, document.documentElement.scrollWidth-document.documentElement.clientWidth)")


def visible_focus(page) -> dict:
    return page.evaluate("""() => {
      const e=document.activeElement;
      if(!e || e===document.body) return {tag:'BODY', cycleEnd:true};
      const r=e.getBoundingClientRect();
      const cs=getComputedStyle(e);
      const visible=r.width>0 && r.height>0 && cs.visibility!=='hidden' && cs.display!=='none';
      const blockers=[...document.querySelectorAll('header,.site-header,.hd,.ig-uh')]
        .filter(x=>{
          if(x.contains(e)) return false;
          const c=getComputedStyle(x);
          return c.position==='fixed'||c.position==='sticky';
        })
        .map(x=>x.getBoundingClientRect()).filter(x=>x.height>0);
      const covered=blockers.some(h=>r.top < h.bottom-1 && r.bottom > h.top+1);
      return {tag:e.tagName,id:e.id||'',cls:e.className||'',visible,covered,top:r.top,bottom:r.bottom};
    }""")


def main() -> None:
    ap=argparse.ArgumentParser()
    ap.add_argument('--root',type=Path,default=Path('dist'))
    ap.add_argument('--out',type=Path,default=Path('reports/accessibility/zoom-keyboard-focus.json'))
    args=ap.parse_args()
    root=args.root.resolve()
    handler=partial(SimpleHTTPRequestHandler,directory=str(root))
    server=ThreadingHTTPServer(('127.0.0.1',0),handler)
    thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
    base=f'http://127.0.0.1:{server.server_port}'
    rows=[]
    findings=[]
    try:
      with sync_playwright() as p:
        browser=p.chromium.launch()
        for route in ROUTES:
          page=browser.new_page(viewport={"width":640,"height":720})
          page.goto(base+route,wait_until='domcontentloaded')
          page.wait_for_timeout(150)
          base_over=overflow(page)
          focus_checks=[]
          for _ in range(24):
            page.keyboard.press('Tab')
            f=visible_focus(page)
            if f.get('cycleEnd'):
              continue
            focus_checks.append(f)
          focus_bad=[f for f in focus_checks if not f.get('visible') or f.get('covered')]
          page.evaluate("document.documentElement.style.fontSize='200%'")
          page.wait_for_timeout(100)
          text_over=overflow(page)
          page.emulate_media(media='print')
          print_over=overflow(page)
          route_findings=[]
          if base_over>2: route_findings.append(f'desbordamiento a 200 % equivalente: {base_over}px')
          if text_over>2: route_findings.append(f'desbordamiento con texto al 200 %: {text_over}px')
          if print_over>2: route_findings.append(f'desbordamiento en impresión: {print_over}px')
          if focus_bad: route_findings.append(f'{len(focus_bad)} focos no visibles o tapados')
          row={
            'route':route,
            'browser_zoom_200_equivalent_width':640,
            'overflow_px':base_over,
            'text_200_overflow_px':text_over,
            'print_overflow_px':print_over,
            'tab_stops_checked':len(focus_checks),
            'focus_failures':focus_bad,
            'findings':route_findings,
            'passed_without_findings':not route_findings,
          }
          rows.append(row)
          if route_findings: findings.append({'route':route,'findings':route_findings})
          page.close()
        browser.close()
    finally:
      server.shutdown();server.server_close()
    report={
      'routes':rows,
      'summary':{'routes':len(rows),'routes_with_findings':len(findings),'findings':findings},
      'method':'Viewport CSS 640 px como aproximación de zoom de navegador 200 % sobre 1280 px; además font-size raíz 200 %, hasta 24 tabulaciones y medio print.',
      'limits':'Informe automático en Chromium; no es una certificación WCAG ni una prueba con lector de pantalla. Los hallazgos no bloquean este PR salvo que otra prueba muestre una página rota.',
    }
    args.out.parent.mkdir(parents=True,exist_ok=True)
    args.out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report['summary'],ensure_ascii=False))


if __name__=='__main__':
    main()
