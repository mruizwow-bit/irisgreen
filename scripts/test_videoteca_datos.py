#!/usr/bin/env python3
"""Comprueba que /es/videos/ sigue mostrando lo mismo con la lista fuera del HTML.

Se apoya en el propio sitio: lo sirve en local, bloquea todo lo externo y mira la
página como la ve alguien que entra. No comprueba reproducción remota.
"""
from __future__ import annotations

import functools
import json
import re
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

RAIZ = Path.cwd()
FUENTE = RAIZ / "editorial/videoteca/publicados.es.json"
DATOS = RAIZ / "assets/videoteca/videoteca-datos.js"
PAGINA = RAIZ / "es/videos/index.html"


class Callado(SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def handle_one_request(self):
        try:
            super().handle_one_request()
        except (BrokenPipeError, ConnectionResetError):
            self.close_connection = True


def main() -> int:
    fallos: list[str] = []
    notas: list[str] = []

    editorial = json.loads(FUENTE.read_text(encoding="utf-8"))
    esperados = len(editorial["videos"])

    sin_en = [v["name"] for v in editorial["videos"] if not v.get("name_en") or not v.get("nota_en")]
    if sin_en:
        fallos.append(f"{len(sin_en)} vídeos sin nombre o nota en inglés: {sin_en[:3]}")
    sin_nota = [v["name"] for v in editorial["videos"] if not v.get("nota")]
    if sin_nota:
        fallos.append(f"{len(sin_nota)} vídeos sin nota en español: {sin_nota[:3]}")
    etiquetas = (editorial.get("temas") or {}).get("en") or {}
    sin_et = sorted({v["tema"] for v in editorial["videos"]} - set(etiquetas))
    if sin_et:
        fallos.append(f"temas sin etiqueta en inglés: {sin_et}")

    html = PAGINA.read_text(encoding="utf-8")
    if re.search(r"const VIDEOS\s*=\s*\[", html):
        fallos.append("la página vuelve a llevar la lista de vídeos escrita dentro")
    if "/assets/videoteca/videoteca-datos.js" not in html:
        fallos.append("la página no carga videoteca-datos.js")

    js = DATOS.read_text(encoding="utf-8")
    datos = json.loads(js[js.index("= ") + 2:].rstrip().rstrip(";"))
    if datos["total"] != esperados or len(datos["videos"]) != esperados:
        fallos.append(f"el fichero generado tiene {datos['total']} vídeos y la lista editorial {esperados}")

    servidor = ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Callado, directory=str(RAIZ)))
    threading.Thread(target=servidor.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{servidor.server_port}"

    with sync_playwright() as pw:
        navegador = pw.chromium.launch()
        for ancho in (1440, 390, 320):
            ctx = navegador.new_context(viewport={"width": ancho, "height": 900})
            pg = ctx.new_page()
            pg.set_default_timeout(15000)
            externas: list[str] = []
            pg.route("**/*", lambda r: r.continue_() if r.request.url.startswith(base)
                     else (externas.append(r.request.url), r.abort())[1])
            pg.goto(base + "/es/videos/", wait_until="networkidle")
            pg.wait_for_function("document.querySelectorAll('[data-ig-filter=temaChips]').length>11")

            temas = pg.locator("[data-ig-filter=temaChips]").all_text_contents()
            for t in ("Misofonía", "CAA", "TDL", "Tourette"):
                if t not in temas:
                    fallos.append(f"{ancho}px · falta el tema {t}")
            if pg.locator("[data-ig-filter=platChips]").all_text_contents() != ["Todos", "YouTube", "Vimeo"]:
                fallos.append(f"{ancho}px · el filtro de plataforma ha cambiado")

            contador = pg.locator("main p").filter(has_text=re.compile(r"^\d+ vídeos")).first.inner_text()
            if int(re.match(r"\d+", contador)[0]) != esperados:
                fallos.append(f"{ancho}px · el contador dice {contador!r} y deberían ser {esperados}")

            posters = pg.locator("main button.ig-video-poster:visible")
            if posters.count() < 1:
                fallos.append(f"{ancho}px · no se pinta ninguna tarjeta")
            etiqueta = posters.first.get_attribute("aria-label") or ""
            if not etiqueta.startswith("Reproducir vídeo:"):
                fallos.append(f"{ancho}px · la etiqueta de la tarjeta ha cambiado: {etiqueta[:50]!r}")

            # nada de fuera antes de pulsar
            if [u for u in externas if "fonts." not in u]:
                fallos.append(f"{ancho}px · pide algo externo antes de pulsar: {externas[:2]}")

            # buscar y filtrar siguen respondiendo
            pg.locator("main input[type=search]").fill("zzzinexistentexxx")
            if posters.count() != 0:
                fallos.append(f"{ancho}px · la búsqueda no filtra")
            pg.locator("main input[type=search]").fill("")
            pg.locator("[data-ig-filter=platChips]").filter(has_text="Vimeo").first.click()
            if posters.count() < 1 or "vimeo" not in (posters.first.get_attribute("data-ig-video") or ""):
                fallos.append(f"{ancho}px · el filtro de plataforma no filtra")
            pg.locator("[data-ig-filter=platChips]").first.click()

            # WCAG 2.2 SC 2.5.8: ningún control de main por debajo de 44 px.
            chicos = pg.locator("main button, main input").evaluate_all(
                "(els)=>els.filter(e=>{const r=e.getBoundingClientRect();"
                "return r.width>0 && (r.width<43.9||r.height<43.9)})"
                ".map(e=>((e.getAttribute('aria-label')||e.textContent||'').trim().slice(0,40)))")
            if chicos:
                fallos.append(f"{ancho}px · controles por debajo de 44 px: {chicos[:3]}")
            if pg.evaluate("Math.max(0,document.documentElement.scrollWidth-innerWidth)") > 2:
                fallos.append(f"{ancho}px · la página se desplaza en horizontal")
            ctx.close()
        navegador.close()
    servidor.shutdown()

    if fallos:
        print("FALLA")
        for f in fallos:
            print(" -", f)
        return 1
    print(f"OK · {esperados} vídeos · chips, filtro, búsqueda, contador, etiquetas, "
          f"controles de 44 px y sin scroll horizontal en 1440, 390 y 320")
    for n in notas:
        print(" nota:", n)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
