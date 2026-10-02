#!/usr/bin/env python3
"""Contrato de integración de la SUITE5 del Taller."""
from __future__ import annotations
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

EXPECTED = {
    "es/taller/pixel-art/index.html": ("es", "pixelart", ["ig-suite-pixelart.js"], []),
    "en/workshop/pixel-art/index.html": ("en", "pixelart", ["ig-suite-pixelart.js"], []),
    "es/taller/escritura-restricciones/index.html": ("es", "escritura", ["ig-suite-escritura.js"], ["ig-suite-escritura.css"]),
    "en/workshop/constraint-writing/index.html": ("en", "escritura", ["ig-suite-escritura.js"], ["ig-suite-escritura.css"]),
    "es/taller/juegos-de-mesa/index.html": ("es", "juegosmesa", ["ig-suite-juegosmesa.js"], ["ig-suite-juegosmesa.css"]),
    "en/workshop/board-games/index.html": ("en", "juegosmesa", ["ig-suite-juegosmesa.js"], ["ig-suite-juegosmesa.css"]),
    "es/taller/ritmo/index.html": ("es", "musica", ["ig-suite-musica.js"], []),
    "en/workshop/rhythm-sequencer/index.html": ("en", "musica", ["ig-suite-musica.js"], []),
    "es/taller/videojuegos/index.html": ("es", "videojuegos", ["ig-suite-juego-runtime.js", "ig-suite-videojuegos.js"], []),
    "en/workshop/video-game-design/index.html": ("en", "videojuegos", ["ig-suite-juego-runtime.js", "ig-suite-videojuegos.js"], []),
}

REQUIRED_ASSETS = [
    "assets/ig-suite-core.js",
    "assets/ig-suite-pixelart.js",
    "assets/ig-suite-escritura.js",
    "assets/ig-suite-escritura.css",
    "assets/ig-suite-juegosmesa.js",
    "assets/ig-suite-juegosmesa.css",
    "assets/ig-suite-musica.js",
    "assets/ig-suite-videojuegos.js",
    "assets/ig-suite-juego-runtime.js",
    "assets/ig-suite-meter-worklet.js",
    "assets/vendor/taller/pixi.js",
    "assets/vendor/taller/tone.js",
    "assets/vendor/taller/LICENCIAS.txt",
]

def fail(msg: str) -> None:
    raise AssertionError(msg)

def main() -> None:
    for rel in REQUIRED_ASSETS:
        if not (ROOT / rel).is_file():
            fail(f"Falta asset SUITE5: {rel}")

    worklet = (ROOT / "assets/ig-suite-meter-worklet.js").read_text(encoding="utf-8")
    musica = (ROOT / "assets/ig-suite-musica.js").read_text(encoding="utf-8")
    if "registerProcessor('igs-meter'" not in worklet and 'registerProcessor("igs-meter"' not in worklet:
        fail("El worklet no registra igs-meter")
    if "/assets/ig-suite-meter-worklet.js?v=r43-1" not in musica:
        fail("El motor de música no referencia el worklet esperado")

    for rel, (lang, engine, scripts, styles) in EXPECTED.items():
        p = ROOT / rel
        if not p.is_file():
            fail(f"Falta ruta generada: {rel}")
        html = p.read_text(encoding="utf-8")
        if f'<html lang="{lang}">' not in html:
            fail(f"Idioma incorrecto en {rel}")
        if f'data-igs-engine="{engine}"' not in html:
            fail(f"Motor {engine} no montado en {rel}")
        if 'data-r40-generic="true"' in html:
            fail(f"Host genérico antiguo sigue activo en {rel}")
        if '/assets/ig-suite-core.js?v=r43-1' not in html:
            fail(f"Falta core SUITE5 en {rel}")
        for name in scripts:
            if f'/assets/{name}?v=r43-1' not in html:
                fail(f"Falta script {name} en {rel}")
        for name in styles:
            if f'/assets/{name}?v=r43-1' not in html:
                fail(f"Falta estilo {name} en {rel}")

    for rel in ("es/taller/estructuras/index.html", "en/workshop/structures/index.html"):
        p = ROOT / rel
        if not p.is_file():
            fail(f"Falta Estructuras: {rel}")
        html = p.read_text(encoding="utf-8")
        missing = [f"e{i}" for i in range(1, 12) if f'"e{i}"' not in html]
        if missing:
            fail(f"Estructuras perdió retos en {rel}: {', '.join(missing)}")

    print("R44_SUITE5_CONTRACT_PASS · 10 rutas · Estructuras e1..e11 · worklet igs-meter")

if __name__ == "__main__":
    main()
