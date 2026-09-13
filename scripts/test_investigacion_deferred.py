#!/usr/bin/env python3
"""Prueba la carga diferida de Investigación en condiciones no ideales.

Cubre dos contratos que las auditorías generales no fuerzan:
1. cambiar ES -> EN antes de que llegue estudios-textos.json;
2. fallo del JSON: mensaje de estado accesible y sin falso «no hay resultados».
No valida el contenido clínico de los estudios.
"""
from __future__ import annotations

import functools
import json
import re
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path.cwd()
OUT = ROOT / "reports/publicacion"
OUT.mkdir(parents=True, exist_ok=True)
DATA = json.loads((ROOT / "es/investigacion/estudios-textos.json").read_text(encoding="utf-8"))
assert len(DATA) == 120


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


server = ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
BASE = f"http://127.0.0.1:{server.server_port}"
REPORT = {"cases": [], "failures": []}


def local_only(page):
    page.route("**/*", lambda route: route.continue_() if route.request.url.startswith(BASE) else route.abort())


def delayed_language(browser):
    ctx = browser.new_context(viewport={"width": 390, "height": 844})
    page = ctx.new_page()
    page.set_default_timeout(10000)
    local_only(page)
    # Retrasa solo el JSON canónico; el shell debe seguir respondiendo y aceptar EN.
    page.add_init_script("""
      (() => {
        const original = window.fetch.bind(window);
        window.fetch = (input, init) => {
          const url = typeof input === 'string' ? input : input.url;
          if (url.includes('/es/investigacion/estudios-textos.json')) {
            return new Promise((resolve, reject) => {
              setTimeout(() => original(input, init).then(resolve, reject), 1800);
            });
          }
          return original(input, init);
        };
      })();
    """)
    errors = []
    page.on("pageerror", lambda exc: errors.append(str(exc)))
    page.goto(BASE + "/es/investigacion/", wait_until="domcontentloaded")
    en = page.get_by_role("button", name=re.compile(r"^EN$"))
    en.wait_for(state="visible")
    en.click()
    assert page.evaluate("document.documentElement.lang") == "en"
    assert page.evaluate("localStorage.getItem('ig_lang')") == "en"
    page.wait_for_function("document.querySelectorAll('main article').length === 120")
    first = page.locator("main article h2").first.inner_text().strip()
    expected = (DATA[0].get("heading_en") or "").strip()
    assert expected and first == expected, (first, expected)
    assert not errors, errors
    row = {
        "scenario": "language_changed_before_json_arrives",
        "language": "en",
        "records": page.locator("main article").count(),
        "first_heading_matches": True,
        "page_errors": 0,
        "passed": True,
    }
    ctx.close()
    return row


def failed_json(browser):
    ctx = browser.new_context(viewport={"width": 390, "height": 844})
    page = ctx.new_page()
    page.set_default_timeout(10000)
    local_only(page)
    page.add_init_script("""
      (() => {
        const original = window.fetch.bind(window);
        window.fetch = (input, init) => {
          const url = typeof input === 'string' ? input : input.url;
          if (url.includes('/es/investigacion/estudios-textos.json')) {
            return Promise.reject(new Error('forced-investigacion-json-failure'));
          }
          return original(input, init);
        };
      })();
    """)
    errors = []
    page.on("pageerror", lambda exc: errors.append(str(exc)))
    page.goto(BASE + "/es/investigacion/", wait_until="domcontentloaded")
    status = page.locator("[data-ig-investigacion-error]")
    status.wait_for(state="visible")
    text = status.inner_text().strip()
    assert "No se han podido cargar los estudios" in text, text
    assert page.locator("main article:visible").count() == 0
    visible_text = page.locator("main").inner_text()
    assert "No hay publicaciones" not in visible_text
    assert not errors, errors
    row = {
        "scenario": "json_failure",
        "status_role": status.get_attribute("role"),
        "false_no_results": False,
        "page_errors": 0,
        "passed": True,
    }
    assert row["status_role"] == "status"
    ctx.close()
    return row


try:
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        for fn in (delayed_language, failed_json):
            try:
                REPORT["cases"].append(fn(browser))
            except Exception as exc:
                import traceback
                REPORT["failures"].append({"scenario": fn.__name__, "error": str(exc), "traceback": traceback.format_exc()})
        browser.close()
finally:
    server.shutdown()

REPORT["passed"] = not REPORT["failures"]
(OUT / "investigacion-diferida.json").write_text(json.dumps(REPORT, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps(REPORT, ensure_ascii=False))
if not REPORT["passed"]:
    raise SystemExit(1)
