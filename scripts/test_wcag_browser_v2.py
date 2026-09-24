#!/usr/bin/env python3
"""Regresión de navegador para criterios WCAG verificables de Iris Green.

Cubre de forma reproducible una muestra de rutas:
- reflow a 320 CSS px (SC 1.4.10, sin scroll horizontal global);
- text spacing según SC 1.4.12, separado del reflow;
- resize aproximado al 200 % usando viewport CSS de 640 px sobre base 1280;
- destino del skip link tras montajes dinámicos;
- foco visible por teclado, admitiendo el anillo en el control o en un ancestro :focus-within.

No es una certificación WCAG completa. No sustituye lector de pantalla, braille,
control por voz, revisión de comprensión ni pruebas con personas.
"""
from __future__ import annotations

import functools
import json
import threading
import traceback
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path.cwd()
OUT = ROOT / "reports" / "wcag-browser-v2"
OUT.mkdir(parents=True, exist_ok=True)

ROUTES = [
    "/",
    "/es/situaciones/",
    "/es/situaciones/la-ropa-me-molesta/",
    "/en/situations/clothes-feel-unbearable/",
    "/es/neurodiversidad/condiciones/",
    "/es/neurodiversidad/condiciones/autismo/",
    "/en/neurodiversity/conditions/autism/",
    "/es/biblioteca/",
    "/es/investigacion/",
    "/es/datos/",
    "/es/datos/autismo-en-la-poblacion/",
    "/en/data/autism-in-the-population/",
    "/es/tramites/directorio/",
    "/es/libros/",
    "/es/videos/",
    "/es/recursos/juegos/",
    "/es/recursos/juegos/",
    "/es/intereses/",
    "/es/taller/",
    "/es/sitio-tranquilo/",
]

FOCUS_ROUTES = [
    "/",
    "/es/situaciones/",
    "/es/neurodiversidad/condiciones/",
    "/es/investigacion/",
    "/es/tramites/directorio/",
    "/es/libros/",
]

TEXT_SPACING = """
*:not(svg):not(svg *) {
  letter-spacing: .12em !important;
  word-spacing: .16em !important;
  line-height: 1.5 !important;
}
p { margin-bottom: 2em !important; }
"""

JS_OVERFLOW = """() => {
  const doc = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
  return {doc, viewport: innerWidth, overflow: Math.max(0, doc - innerWidth)};
}"""

JS_CLIPPED = """() => Array.from(document.querySelectorAll('body *')).filter(el => {
  if (el.closest('[hidden],[aria-hidden="true"],template,noscript')) return false;
  const cs = getComputedStyle(el), r = el.getBoundingClientRect();
  if (cs.display === 'none' || cs.visibility === 'hidden' || r.width < 2 || r.height < 2) return false;
  const ownText = Array.from(el.childNodes).some(n => n.nodeType === Node.TEXT_NODE && (n.textContent || '').trim());
  if (!ownText) return false;
  const hiddenX = cs.overflowX === 'hidden' || cs.overflowX === 'clip';
  const hiddenY = cs.overflowY === 'hidden' || cs.overflowY === 'clip';
  return (hiddenX && el.scrollWidth > el.clientWidth + 2) || (hiddenY && el.scrollHeight > el.clientHeight + 2);
}).slice(0, 20).map(el => ({
  tag: el.tagName,
  id: el.id,
  cls: String(el.className || '').slice(0, 100),
  text: (el.textContent || '').trim().slice(0, 120),
  sw: el.scrollWidth, cw: el.clientWidth, sh: el.scrollHeight, ch: el.clientHeight
}))"""

JS_MAIN = """() => {
  const m = document.getElementById('main');
  if (!m) return {ok:false, reason:'missing'};
  const cs = getComputedStyle(m), r = m.getBoundingClientRect();
  return {ok:cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0,
          tag:m.tagName, width:r.width, height:r.height};
}"""

JS_FOCUS = """() => {
  const e = document.activeElement;
  if (!e || e === document.body) return {ok:false, tag:'BODY', reason:'no-active-control'};
  function ring(el) {
    const c = getComputedStyle(el);
    const ow = parseFloat(c.outlineWidth || '0');
    const outline = ow > 0 && c.outlineStyle !== 'none';
    const shadow = c.boxShadow && c.boxShadow !== 'none';
    return {ok:outline || shadow, outline:c.outline, boxShadow:c.boxShadow};
  }
  let node = e, depth = 0, found = null;
  while (node && node !== document.body && depth < 5) {
    const r = ring(node);
    if (r.ok) { found = {depth, tag:node.tagName, id:node.id, cls:String(node.className || '').slice(0,80), ...r}; break; }
    node = node.parentElement; depth++;
  }
  const rect = e.getBoundingClientRect();
  return {
    ok:!!found,
    tag:e.tagName,
    id:e.id,
    cls:String(e.className || '').slice(0,80),
    text:(e.innerText || e.getAttribute('aria-label') || e.getAttribute('placeholder') || '').trim().slice(0,100),
    rect:[rect.x,rect.y,rect.width,rect.height],
    ring:found
  };
}"""


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


server = ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
BASE = f"http://127.0.0.1:{server.server_port}"

report = {
    "routes": ROUTES,
    "cases": [],
    "failures": [],
    "method": {
        "reflow": "320 CSS px; no horizontal overflow of the page document",
        "text_spacing": "WCAG 1.4.12 values applied independently at 1280 CSS px",
        "resize_200": "640 CSS px as an approximation of 200% zoom from a 1280 CSS px baseline",
        "focus": "visible ring may be on the focused control or a focus-within ancestor",
    },
    "limits": [
        "No screen-reader, braille or voice-control certification.",
        "Resize 200% is a reproducible CSS-viewport approximation, not browser UI zoom certification.",
        "This is a representative route sample, not a claim of complete WCAG 2.2 AA conformance.",
        "Manual cognitive/readability review and testing with people remain separate.",
    ],
}


def record(row, fn):
    try:
        fn()
        row["passed"] = True
    except Exception as exc:
        row["passed"] = False
        row["error"] = str(exc)
        row["traceback"] = traceback.format_exc()
        report["failures"].append(dict(row))
    report["cases"].append(row)
    print(json.dumps(row, ensure_ascii=False), flush=True)


with sync_playwright() as pw:
    browser = pw.chromium.launch()

    def make_page(width):
        ctx = browser.new_context(viewport={"width": width, "height": 900}, reduced_motion="reduce")
        ctx.route("**/*", lambda route: route.continue_() if route.request.url.startswith(BASE) else route.abort())
        page = ctx.new_page()
        errors = []
        page.on("pageerror", lambda err: errors.append(str(err)))
        return ctx, page, errors

    def load(page, route):
        page.goto(BASE + route, wait_until="domcontentloaded")
        page.locator("main h1").first.wait_for(timeout=15000)
        page.wait_for_timeout(350)

    # 1.4.10 Reflow + destino del enlace de salto tras cualquier montaje dinámico.
    for route in ROUTES:
        ctx, page, errors = make_page(320)
        row = {"scenario": "reflow_320", "route": route}

        def check_reflow():
            load(page, route)
            overflow = page.evaluate(JS_OVERFLOW)
            row.update(overflow)
            assert overflow["overflow"] <= 2, overflow
            main = page.evaluate(JS_MAIN)
            row["main"] = main
            assert main["ok"], main
            skip = page.locator('a[href="#main"]:visible').first
            assert skip.count() == 1, "No hay enlace visible de salto a #main"
            assert not errors, errors

        record(row, check_reflow)
        ctx.close()

    # 1.4.12 Text spacing: prueba separada, viewport de escritorio.
    for route in ROUTES:
        ctx, page, errors = make_page(1280)
        row = {"scenario": "text_spacing", "route": route}

        def check_spacing():
            load(page, route)
            page.add_style_tag(content=TEXT_SPACING)
            page.wait_for_timeout(120)
            overflow = page.evaluate(JS_OVERFLOW)
            row.update(overflow)
            assert overflow["overflow"] <= 2, overflow
            clipped = page.evaluate(JS_CLIPPED)
            row["clipped"] = clipped
            assert not clipped, clipped
            assert not errors, errors

        record(row, check_spacing)
        ctx.close()

    # 1.4.4 Resize: 200% aproximado = viewport CSS 640 desde base 1280.
    for route in ROUTES:
        ctx, page, errors = make_page(640)
        row = {"scenario": "resize_200_approx", "route": route, "baseline_css_width": 1280, "effective_css_width": 640}

        def check_resize():
            load(page, route)
            overflow = page.evaluate(JS_OVERFLOW)
            row.update(overflow)
            assert overflow["overflow"] <= 2, overflow
            clipped = page.evaluate(JS_CLIPPED)
            row["clipped"] = clipped
            assert not clipped, clipped
            main = page.evaluate(JS_MAIN)
            assert main["ok"], main
            assert not errors, errors

        record(row, check_resize)
        ctx.close()

    # 2.4.7/2.4.11: foco visible y no tapado en familias representativas.
    for route in FOCUS_ROUTES:
        ctx, page, errors = make_page(1280)
        row = {"scenario": "keyboard_focus", "route": route, "steps": []}

        def check_focus():
            load(page, route)
            seen = []
            for _ in range(14):
                page.keyboard.press("Tab")
                page.wait_for_timeout(20)
                state = page.evaluate(JS_FOCUS)
                row["steps"].append(state)
                assert state["ok"], state
                x, y, w, h = state["rect"]
                assert w > 0 and h > 0, state
                assert y + h > 0 and y < 900, {"reason": "focused-control-outside-viewport", **state}
                seen.append((state["tag"], state.get("id"), state.get("text")))
            first = row["steps"][0]
            assert first["tag"] == "A" and ("contenido" in first["text"].lower() or "content" in first["text"].lower()), first
            assert len(set(seen)) >= 5, seen
            assert not errors, errors

        record(row, check_focus)
        ctx.close()

    browser.close()

server.shutdown()
report["summary"] = {
    "cases": len(report["cases"]),
    "passed": sum(1 for case in report["cases"] if case.get("passed")),
    "failures": len(report["failures"]),
}
report["passed"] = not report["failures"]
(OUT / "results.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps(report["summary"], ensure_ascii=False))
if report["failures"]:
    raise SystemExit(1)
