#!/usr/bin/env python3
"""Guardarraíl de Tarjetas Iris v2 y apoyos Mulberry editoriales."""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

DETAIL_SETS = (
    ("situaciones", "es/situaciones/*/index.html", 187),
    ("vida", "es/biblioteca/*/index.html", 48),
    ("condiciones", "es/neurodiversidad/condiciones/*/index.html", 185),
)
EXPECTED_SVGS = {"hablar.svg", "escribir.svg", "esperar.svg", "preguntar.svg", "carpeta.svg"}
ASSIGNED = "es/situaciones/necesito-que-me-repitan-las-instrucciones/index.html"


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path("dist"))
    args = ap.parse_args()
    root = args.root.resolve()

    variants = {"A": 0, "B": 0, "C": 0}
    total = 0
    for section, pattern, expected in DETAIL_SETS:
        pages = sorted(p for p in root.glob(pattern) if p.is_file())
        if len(pages) != expected:
            raise AssertionError(f"{section}: esperadas {expected}; encontradas {len(pages)}")
        for path in pages:
            text = path.read_text(encoding="utf-8")
            cards = re.findall(r'<aside\b[^>]*\biris-mini-card-static\b[^>]*>.*?</aside>', text, re.I | re.S)
            if len(cards) != 1:
                raise AssertionError(f"Tarjeta v2 ausente o duplicada: {path}")
            card = cards[0]
            if len(re.findall(r'<button\b[^>]*\bclass=["\'][^"\']*\biris-mini-action\b', card, re.I)) != 2:
                raise AssertionError(f"Acciones v2 incorrectas: {path}")
            if not re.search(r'data-iris-card-status[^>]*role=["\']status["\'][^>]*aria-live=["\']polite["\']', card, re.I):
                raise AssertionError(f"Estado accesible ausente: {path}")
            vm = re.search(r'data-iris-picto-variant=["\']([ABC])["\']', card, re.I)
            if not vm:
                raise AssertionError(f"Variante A/B/C ausente: {path}")
            variants[vm.group(1).upper()] += 1
            total += 1

    if total != 420 or variants != {"A": 419, "B": 1, "C": 0}:
        raise AssertionError(f"Recuento Tarjetas Iris inesperado: total={total}, variantes={variants}")

    mulberry = root / "assets/mulberry"
    svgs = {p.name for p in mulberry.glob("*.svg")}
    if svgs != EXPECTED_SVGS:
        raise AssertionError(f"Pictogramas publicados inesperados: {sorted(svgs)}")
    if not (mulberry / "LICENSE-MULBERRY.txt").is_file():
        raise AssertionError("Falta LICENSE-MULBERRY.txt")
    if (root / "assets/pictos").exists():
        raise AssertionError("No debe existir el antiguo directorio assets/pictos")
    if any("queue" in p.name or "correct" in p.name for p in mulberry.iterdir()):
        raise AssertionError("Se han publicado pictogramas descartados")

    assigned = (root / ASSIGNED).read_text(encoding="utf-8")
    if 'data-iris-picto-variant="B"' not in assigned:
        raise AssertionError("La ficha editorial debe usar variante B: pictogramas junto a bloques")
    if 'data-iris-picto-variant="C"' in assigned:
        raise AssertionError("La variante C se reserva a secuencias reales")
    for picto in ("hablar", "escribir"):
        if f'data-mulberry-picto="{picto}"' not in assigned:
            raise AssertionError(f"Falta pictograma editorial {picto}")
        if f'src="/assets/mulberry/{picto}.svg"' not in assigned:
            raise AssertionError(f"Ruta pública incorrecta para {picto}")
    if assigned.count('alt="" aria-hidden="true"') < 2:
        raise AssertionError("Los pictogramas deben ser decorativos junto al texto visible")
    if "Esto me cuesta" not in assigned or "Me ayuda" not in assigned:
        raise AssertionError("El texto visible no puede ser sustituido por pictogramas")

    tool = (root / "es/tarjetas-iris/index.html").read_text(encoding="utf-8")
    if tool.count("data-mulberry-credit") != 1:
        raise AssertionError("La atribución Mulberry debe aparecer una sola vez en Tarjetas Iris")
    all_html = "".join(p.read_text(encoding="utf-8", errors="ignore") for p in root.rglob("*.html"))
    if all_html.count("data-mulberry-credit") != 1:
        raise AssertionError("La atribución Mulberry debe existir en una sola página")

    css = (root / "assets/mulberry-pictograms.css").read_text(encoding="utf-8")
    if 'data-mulberry-picto="escribir"' not in css or "48px" not in css:
        raise AssertionError("Falta la regla compacta de 48 px para escribir en futuras secuencias C")

    print(json.dumps({
        "tarjetas_v2": total,
        "variants": variants,
        "mulberry_svgs": sorted(svgs),
        "editorial_assignment": ASSIGNED,
        "discarded_candidates_published": 0,
        "credit_pages": 1,
        "result": "accepted",
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
