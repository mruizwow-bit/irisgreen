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
    return viewer.locator('.ig-flip-sprite').evaluate("el => getComputedStyle(el).backgroundPosition")


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

        # Luma: la primera apertura carga sus tres chunks una sola vez.
        luma.locator('[data-ig-flip-next]').click()
        page.wait_for_function("document.querySelector('[data-ig-flipbook=\"luma\"] .ig-flip-counter').textContent.trim() === '2 / 9'")
        luma_requests = [x for x in requested if "flip-luma-es." in x]
        autism_requests = [x for x in requested if "flip-autismo-es." in x]
        assert len(luma_requests) == 3, luma_requests
        assert autism_requests == [], autism_requests

        # No basta con que cambie el contador: cada hoja interior debe mover el sprite.
        positions = [sprite_position(luma)]
        before = list(requested)
        for counter in range(3, 10):
            luma.locator('[data-ig-flip-next]').click()
            page.wait_for_function(
                "([counter]) => document.querySelector('[data-ig-flipbook=\"luma\"] .ig-flip-counter').textContent.trim() === counter + ' / 9'",
                arg=[counter],
            )
            positions.append(sprite_position(luma))
        assert len(set(positions)) == 8, f"Las 8 hojas interiores no muestran posiciones distintas: {positions}"
        assert requested == before, "Avanzar por Luma volvió a descargar chunks"
        assert luma.locator('[data-ig-flip-next]').is_disabled(), "La última hoja debe desactivar Siguiente"

        # Volver una hoja también debe mover visualmente el sprite.
        last_position = positions[-1]
        luma.locator('[data-ig-flip-prev]').click()
        page.wait_for_function("document.querySelector('[data-ig-flipbook=\"luma\"] .ig-flip-counter').textContent.trim() === '8 / 9'")
        assert sprite_position(luma) != last_position, "Anterior cambió el contador pero no la hoja visible"

        # Autismo conserva apertura por teclado y carga independiente.
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
            "luma_visual_pages_checked": 8,
            "luma_visual_positions_distinct": len(set(positions)),
            "autism_requests_on_first_open": 4,
            "repeat_downloads": 0,
            "keyboard_open": True,
            "previous_changes_visual_page": True,
            "network_failure_visible": True,
        })


if __name__ == "__main__":
    main()
