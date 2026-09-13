#!/usr/bin/env python3
"""Comprueba carga diferida y avance visual real de las muestras de Libros."""
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:4173"
SAMPLE = "/assets/books/samples/flip-"


def sample_path(url: str) -> str | None:
    path = urlparse(url).path
    return path if SAMPLE in path else None


def sprite_position(viewer) -> str:
    return viewer.locator(".ig-flip-sprite").evaluate(
        "el => getComputedStyle(el).backgroundPosition"
    )


def main() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        requested: list[str] = []
        page.on("request", lambda req: requested.append(path) if (path := sample_path(req.url)) else None)
        page.goto(BASE + "/es/libros/", wait_until="networkidle")
        page.wait_for_selector('[data-ig-flipbook="luma"] .ig-flip-page')
        page.wait_for_selector('[data-ig-flipbook="autismo"] .ig-flip-page')
        assert requested == [], f"La carga inicial pidió chunks: {requested}"

        luma = page.locator('[data-ig-flipbook="luma"]')
        autism = page.locator('[data-ig-flipbook="autismo"]')
        luma_next = luma.locator('[data-ig-flip-next]')

        luma_next.click()
        page.wait_for_function("document.querySelector('[data-ig-flipbook=\"luma\"] .ig-flip-counter').textContent.trim() === '2 / 9'")
        luma_requests = [x for x in requested if "flip-luma-es." in x]
        autism_requests = [x for x in requested if "flip-autismo-es." in x]
        assert len(luma_requests) == 3, luma_requests
        assert autism_requests == [], autism_requests

        # Regresión: no basta con que cambie el contador. Cada hoja interior debe
        # mover de verdad el sprite; el fallo anterior dejaba siempre visible la
        # primera hoja interior aunque el contador siguiera avanzando.
        positions = [sprite_position(luma)]
        before = list(requested)
        for expected_page in range(3, 10):
            luma_next.click()
            page.wait_for_function(
                f"document.querySelector('[data-ig-flipbook=\"luma\"] .ig-flip-counter').textContent.trim() === '{expected_page} / 9'"
            )
            positions.append(sprite_position(luma))

        assert len(set(positions)) == 8, f"El sprite no avanzó por las 8 hojas interiores: {positions}"
        assert requested == before, "Cambiar de hoja de Luma volvió a descargar chunks"
        assert luma_next.is_disabled(), "La flecha siguiente debe desactivarse al llegar a la última hoja"

        autism.locator('.ig-flip-stage').focus()
        page.keyboard.press("ArrowRight")
        page.wait_for_function("document.querySelector('[data-ig-flipbook=\"autismo\"] .ig-flip-counter').textContent.trim() === '2 / 8'")
        luma_requests = [x for x in requested if "flip-luma-es." in x]
        autism_requests = [x for x in requested if "flip-autismo-es." in x]
        assert len(luma_requests) == 3, luma_requests
        assert len(autism_requests) == 4, autism_requests

        # Un fallo del interior no debe afectar a la portada hasta que se intenta hojear.
        fail = browser.new_page(viewport={"width": 390, "height": 844})
        fail_requests: list[str] = []
        fail.on("request", lambda req: fail_requests.append(path) if (path := sample_path(req.url)) else None)
        fail.route("**/assets/books/samples/flip-luma-es.part*.txt", lambda route: route.fulfill(status=503, body="fallo simulado"))
        fail.goto(BASE + "/es/libros/", wait_until="networkidle")
        fail.wait_for_selector('[data-ig-flipbook="luma"] .ig-flip-page')
        assert fail_requests == [], f"El escenario de fallo pidió chunks antes de interactuar: {fail_requests}"
        fail.locator('[data-ig-flipbook="luma"] [data-ig-flip-next]').click()
        fail.wait_for_selector('[data-ig-flipbook="luma"] .ig-flip-error')
        assert fail.locator('[data-ig-flipbook="luma"] [data-ig-flip-next]').is_disabled()
        assert fail.locator('[data-ig-flipbook="luma"] .ig-flip-error').inner_text().strip() == "No se ha podido cargar la muestra."

        browser.close()
        print({
            "initial_sample_requests": 0,
            "luma_requests_on_first_open": 3,
            "luma_distinct_interior_pages": len(set(positions)),
            "luma_reached_last_page": True,
            "autism_requests_on_first_open": 4,
            "repeat_downloads": 0,
            "keyboard_open": True,
            "network_failure_visible": True,
        })


if __name__ == "__main__":
    main()