#!/usr/bin/env python3
"""Prueba en Chromium las 24 interfaces DC tras la migración sin unsafe-eval.

Descubre las páginas por la referencia al runtime CSP-safe, las sirve con la cabecera
real de ``_headers`` y exige que el componente monte, muestre un h1 legible, no deje
plantillas sin resolver ni errores de lógica. Cuando existe un botón dentro de main,
activa uno para comprobar que la clase precompilada responde a una interacción básica.
En la portada comprueba además el contrato real de Música: el botón abre el reproductor
y Escuchar solicita una pista local de ``/audio/``.
"""
from __future__ import annotations

import functools
import re
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path.cwd().resolve()
SAFE_RUNTIME = "/assets/runtime/dc-runtime-csp.js"


def global_csp() -> str:
    text = (ROOT / "_headers").read_text(encoding="utf-8", errors="strict")
    match = re.search(r"^/\*\s*$.*?^\s*Content-Security-Policy:\s*(.+)$", text, re.M | re.S)
    if not match:
        raise RuntimeError("No se encuentra la CSP global")
    return match.group(1).splitlines()[0].strip()


def public_route(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    if rel == "index.html":
        return "/"
    if rel.endswith("/index.html"):
        return "/" + rel[:-len("index.html")]
    return "/" + rel


def server(csp: str):
    class Handler(SimpleHTTPRequestHandler):
        def end_headers(self):
            self.send_header("Content-Security-Policy", csp)
            self.send_header("X-Content-Type-Options", "nosniff")
            super().end_headers()

        def log_message(self, *_):
            pass

    httpd = ThreadingHTTPServer(
        ("127.0.0.1", 0), functools.partial(Handler, directory=str(ROOT))
    )
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd, f"http://127.0.0.1:{httpd.server_port}"


def main() -> None:
    pages = []
    for path in sorted(ROOT.rglob("*.html")):
        if "reports" in path.parts:
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        if SAFE_RUNTIME in text:
            pages.append((path, public_route(path)))
    if len(pages) != 24:
        raise AssertionError(f"Inventario DC seguro cambiado: {len(pages)} != 24")

    csp = global_csp()
    if "'unsafe-eval'" in csp:
        raise AssertionError("La prueba DC no se ejecutará con unsafe-eval presente")

    httpd, base = server(csp)
    failures: list[str] = []
    checked = []
    music_checked = False
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch()
            for path, route in pages:
                page = browser.new_page(viewport={"width": 1280, "height": 900})
                page.set_default_timeout(15000)
                page_errors: list[str] = []
                console_errors: list[str] = []
                page.on("pageerror", lambda exc, bag=page_errors: bag.append(str(exc)))
                page.on(
                    "console",
                    lambda msg, bag=console_errors: bag.append(msg.text)
                    if msg.type == "error" or "Content Security Policy" in msg.text or "Refused to" in msg.text
                    else None,
                )
                try:
                    page.goto(base + route, wait_until="domcontentloaded")
                    page.locator("#dc-root").wait_for(state="attached")
                    h1 = page.locator("main h1").first
                    h1.wait_for(state="visible")
                    title = h1.inner_text().strip()
                    if not title or "{{" in title:
                        raise AssertionError(f"h1 sin resolver: {title!r}")
                    if page.locator(".sc-logic-error, .sc-placeholder-error").count():
                        raise AssertionError("el runtime ha mostrado un error de lógica/placeholder")
                    if page.locator("x-dc").count():
                        raise AssertionError("x-dc no fue sustituido por #dc-root")
                    body_text = page.locator("body").inner_text()
                    if "{{" in body_text or "}}" in body_text:
                        raise AssertionError("quedan expresiones de plantilla visibles")

                    if route == "/":
                        music = page.locator(".ig-uh-music:visible").first
                        if not music.count():
                            raise AssertionError("no existe el botón visible de Música")
                        music.click()
                        panel = page.locator("#ig-music-panel")
                        panel.wait_for(state="visible")
                        play = panel.locator(".ig-m-play")
                        with page.expect_request(
                            lambda request: "/audio/" in request.url,
                            timeout=10000,
                        ) as audio_request:
                            play.click()
                        audio_url = audio_request.value.url
                        if not re.search(r"/audio/[^/?]+\.(?:mp3|m4a)(?:\?|$)", audio_url, re.I):
                            raise AssertionError(f"Música solicita una URL inesperada: {audio_url}")
                        music_checked = True

                    # Interacción mínima: evita enlaces y controles globales; si la
                    # interfaz tiene un botón propio en main, activar el primero no
                    # debe romper la clase precompilada.
                    button = page.locator("main button:visible").first
                    interacted = False
                    if button.count() and button.is_enabled():
                        button.scroll_into_view_if_needed()
                        button.click()
                        page.wait_for_timeout(80)
                        interacted = True

                    if page_errors:
                        raise AssertionError("pageerror: " + " | ".join(page_errors[:4]))
                    bad_console = [
                        x for x in console_errors
                        if "favicon" not in x.lower() and "404" not in x.lower()
                    ]
                    if bad_console:
                        raise AssertionError("console: " + " | ".join(bad_console[:4]))
                    checked.append({"route": route, "h1": title, "interaction": interacted})
                except Exception as exc:
                    failures.append(f"{route}: {exc}")
                finally:
                    page.close()
            browser.close()
    finally:
        httpd.shutdown()

    if failures:
        raise AssertionError("Fallos DC CSP-safe:\n" + "\n".join(failures[:30]))
    if not music_checked:
        raise AssertionError("La portada no completó la prueba de Música")
    print({
        "pages_checked": len(checked),
        "unsafe_eval": False,
        "raw_templates_visible": 0,
        "music_local_audio_checked": music_checked,
        "pages_with_basic_interaction": sum(x["interaction"] for x in checked),
        "routes": [x["route"] for x in checked],
    })


if __name__ == "__main__":
    main()
