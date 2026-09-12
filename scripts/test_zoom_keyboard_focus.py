#!/usr/bin/env python3
"""Prueba de cierre: 200 %, teclado y foco sobre dist.

Se ejecuta una vez en el PR de accesibilidad y escribe un informe JSON.
El modo «browser 200 %» se representa con un viewport CSS de 640 px para una
ventana de referencia de 1280 px; además se prueba texto al 200 % aumentando
la raíz del documento. No sustituye pruebas con lectores de pantalla.
"""
from __future__ import annotations

import argparse
import contextlib
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
      if(!e || e===document.body) return {tag:'BODY', visible:false};
      const r=e.getBoundingClientRect();
      const cs=getComputedStyle(e);
      const visible=r.width>0 && r.height>0 && cs.visibility!=='hidden' && cs.display!=='none';
      const header=[...document.querySelectorAll('header,.site-header,.hd,.ig-uh')]
        .filter(x=>{const c=getComputedStyle(x);return c.position==='fixed'||c.position==='sticky'})
        .map(x=>x.getBoundingClientRect()).filter(r=>r.height>0);
      const covered=header.some(h=>r.top < h.bottom-1 && r.bottom > h.top+1);
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
    failures=[]
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
            f=visible_focus(page);focus_checks.append(f)
          focus_bad=[f for f in focus_checks if not f.get('visible') or f.get('covered')]
          page.evaluate("document.documentElement.style.fontSize='200%'")
          page.wait_for_timeout(100)
          text_over=overflow(page)
          page.emulate_media(media='print')
          print_over=overflow(page)
          row={
            'route':route,
            'browser_zoom_200_equivalent_width':640,
            'overflow_px':base_over,
            'text_200_overflow_px':text_over,
            'print_overflow_px':print_over,
            'tab_stops_checked':len(focus_checks),
            'focus_failures':focus_bad,
            'passed':base_over<=2 and text_over<=2 and print_over<=2 and not focus_bad,
          }
          rows.append(row)
          if not row['passed']: failures.append(row)
          page.close()
        browser.close()
    finally:
      server.shutdown();server.server_close()
    report={
      'routes':rows,
      'summary':{'routes':len(rows),'failures':len(failures),'passed':not failures},
      'method':'Viewport CSS 640 px como equivalente de zoom de navegador 200 % sobre 1280 px; además font-size raíz 200 %, recorrido de 24 tabulaciones y medio print.',
      'limits':'Prueba automática en Chromium; no es una certificación WCAG ni una prueba con lector de pantalla.',
    }
    args.out.parent.mkdir(parents=True,exist_ok=True)
    args.out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report['summary'],ensure_ascii=False))
    if failures:
      raise AssertionError(json.dumps(failures,ensure_ascii=False)[:5000])


if __name__=='__main__':
    main()
