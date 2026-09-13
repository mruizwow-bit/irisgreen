#!/usr/bin/env python3
"""Comprueba que los sprites de las muestras de Libros solo se piden al hojear."""
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:4173"
SAMPLE = "/assets/books/samples/flip-"


def sample_path(url: str) -> str | None:
    path = urlparse(url).path
    return path if SAMPLE in path else None


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
        luma.locator('[data-ig-flip-next]').click()
        page.wait_for_function("document.querySelector('[data-ig-flipbook=\"luma\"] .ig-flip-counter').textContent.trim() === '2 / 9'")
        luma_requests = [x for x in requested if "flip-luma-es." in x]
        autism_requests = [x for x in requested if "flip-autismo-es." in x]
        assert len(luma_requests) == 3, luma_requests
        assert autism_requests == [], autism_requests

        before = list(requested)
        luma.locator('[data-ig-flip-next]').click()
        page.wait_for_function("document.querySelector('[data-ig-flipbook=\"luma\"] .ig-flip-counter').textContent.trim() === '3 / 9'")
        assert requested == before, "Cambiar a otra página de Luma volvió a descargar chunks"

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
            "autism_requests_on_first_open": 4,
            "repeat_downloads": 0,
            "keyboard_open": True,
            "network_failure_visible": True,
        })


if __name__ == "__main__":
    main()
