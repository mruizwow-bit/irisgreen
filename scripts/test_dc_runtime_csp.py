#!/usr/bin/env python3
"""Prueba en Chromium las interfaces DC y la Música publicada bajo la CSP real.

Descubre las páginas por la referencia al runtime CSP-safe, las sirve con la cabecera
real de ``_headers`` y exige que el componente monte, muestre un h1 legible, no deje
plantillas sin resolver ni errores de lógica. Cuando existe un botón dentro de main,
activa uno para comprobar que la clase precompilada responde a una interacción básica.

Música se prueba como contrato de navegador en dos superficies históricas: la portada
y Condiciones. El panel debe conservar las 24 piezas originales y su orden. Para la
prueba de reproducción se elige explícitamente Atmósfera (MP3), de modo que Chromium
sin decodificador AAC no obligue a retirar las pistas M4A del catálogo visible.
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
MUSIC_ROUTES = ("/", "/es/neurodiversidad/condiciones/")


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


def check_music(browser, base: str, route: str) -> dict:
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    page.set_default_timeout(15000)
    page_errors: list[str] = []
    console_errors: list[str] = []
    page.on("pageerror", lambda exc: page_errors.append(str(exc)))
    page.on(
        "console",
        lambda msg: console_errors.append(msg.text)
        if msg.type == "error" or "Content Security Policy" in msg.text or "Refused to" in msg.text
        else None,
    )
    try:
        page.goto(base + route, wait_until="domcontentloaded")
        music = page.locator("#plBtn:visible, .ig-uh-music:visible, [data-ig-music]:visible").first
        if not music.count():
            raise AssertionError("no existe un botón visible de Música")
        music.click()
        panel = page.locator("#ig-music-panel")
        panel.wait_for(state="visible")

        tracks = panel.locator("ol [data-track]")
        track_count = tracks.count()
        if track_count != 24:
            raise AssertionError(f"La lista de Música tiene {track_count} piezas; esperaba 24")
        first_track = (tracks.first.text_content() or "").strip()
        if not first_track.startswith("Un momento de calma"):
            raise AssertionError(f"La primera pieza cambió: {first_track!r}")
        current_title = panel.locator(".ig-m-title").inner_text().strip()
        if current_title != "Un momento de calma":
            raise AssertionError(f"La pieza inicial cambió: {current_title!r}")

        # El Chromium de CI puede carecer de AAC aunque la web deba conservar las
        # nueve piezas M4A. Para probar audio real sin falsear el catálogo, activamos
        # una pista MP3 conocida que ocupa la posición histórica 10 (índice 9).
        atmosphere = panel.locator('[data-track="9"]')
        if not (atmosphere.text_content() or "").strip().startswith("Atmósfera"):
            raise AssertionError("Atmósfera ya no ocupa la posición histórica esperada")
        with page.expect_response(
            lambda response: "/audio/atmosfera.mp3" in response.url,
            timeout=10000,
        ) as audio_response:
            atmosphere.click()
        response = audio_response.value
        audio_url = response.url
        if not (200 <= response.status < 300):
            raise AssertionError(f"El audio responde HTTP {response.status}: {audio_url}")
        content_type = response.headers.get("content-type", "")
        if not content_type.lower().startswith("audio/"):
            raise AssertionError(f"Tipo MIME de audio inesperado: {content_type!r}")

        # La petición HTTP por sí sola no demuestra reproducción. musica.js cambia
        # el texto a Pausa/Pause únicamente cuando el elemento <audio> emite play.
        page.wait_for_function(
            """() => {
              const b = document.querySelector('#ig-music-panel .ig-m-play');
              return b && /^(Pausa|Pause)$/.test((b.textContent || '').trim());
            }""",
            timeout=5000,
        )
        status_text = panel.locator(".ig-m-status").inner_text().strip()
        if status_text:
            raise AssertionError(f"El reproductor muestra error: {status_text}")

        if page_errors:
            raise AssertionError("pageerror: " + " | ".join(page_errors[:4]))
        bad_console = [
            x for x in console_errors
            if "favicon" not in x.lower() and "404" not in x.lower()
        ]
        if bad_console:
            raise AssertionError("console: " + " | ".join(bad_console[:4]))
        return {
            "route": route,
            "panel": True,
            "playlist_count": track_count,
            "first_track": "Un momento de calma",
            "playing": True,
            "played_track": "Atmósfera",
            "audio_status": response.status,
            "content_type": content_type,
            "audio_url": audio_url,
        }
    finally:
        page.close()


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
    music_results = []
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch()
            for route in MUSIC_ROUTES:
                try:
                    music_results.append(check_music(browser, base, route))
                except Exception as exc:
                    failures.append(f"{route}: Música: {exc}")

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
        raise AssertionError("Fallos CSP/browser:\n" + "\n".join(failures[:30]))
    if len(music_results) != len(MUSIC_ROUTES):
        raise AssertionError("No se completaron todas las pruebas de Música")
    print({
        "pages_checked": len(checked),
        "unsafe_eval": False,
        "raw_templates_visible": 0,
        "music": music_results,
        "pages_with_basic_interaction": sum(x["interaction"] for x in checked),
        "routes": [x["route"] for x in checked],
    })


if __name__ == "__main__":
    main()
