#!/usr/bin/env python3
"""Guardarraíl de Tarjetas Iris: contenido real, variantes y Mulberry editorial."""
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
PLACEHOLDER = "Esta ficha todavía no dice qué ayuda. Falta el texto, no se rellena con suposiciones."
NEED_PREFIX = "Necesito que se tenga en cuenta este apoyo:"
MAX_BLOCK_CHARS = 160
MAX_TITLE_CHARS = 92


def clean(text: str) -> str:
    text = re.sub(r'<[^>]+>', ' ', text)
    return re.sub(r'\s+', ' ', text).strip()


def assert_concise(card: str, path: Path) -> None:
    title = re.search(r'<h2\b[^>]*\biris-mini-title\b[^>]*>(.*?)</h2>', card, re.I | re.S)
    if title and len(clean(title.group(1))) > MAX_TITLE_CHARS + 1:
        raise AssertionError(f"Título demasiado largo en {path}")
    for block in re.findall(r'<section\b[^>]*\biris-mini-block\b[^>]*>.*?</section>', card, re.I | re.S):
        heading_match = re.search(r'<h3\b[^>]*>(.*?)</h3>', block, re.I | re.S)
        text_match = re.search(r'<p\b[^>]*>(.*?)</p>', block, re.I | re.S)
        if not heading_match or not text_match:
            continue
        heading = clean(heading_match.group(1))
        value = clean(text_match.group(1))
        if heading not in {"Esto me cuesta", "Me ayuda", "Necesito"}:
            continue
        if len(value) > MAX_BLOCK_CHARS + 1:
            raise AssertionError(f"Bloque «{heading}» demasiado largo en {path}: {len(value)}")
        if len(re.split(r'(?<=[.!?])\s+', value)) > 1:
            raise AssertionError(f"Bloque «{heading}» contiene más de una frase en {path}")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path("dist"))
    args = ap.parse_args()
    root = args.root.resolve()

    variants = {"A": 0, "B": 0, "C": 0}
    cards = 0
    unavailable = 0
    drafts_without_cards = 0
    placeholder_without_cards = 0

    for section, pattern, expected in DETAIL_SETS:
        pages = sorted(p for p in root.glob(pattern) if p.is_file())
        if len(pages) != expected:
            raise AssertionError(f"{section}: esperadas {expected}; encontradas {len(pages)}")
        for path in pages:
            text = path.read_text(encoding="utf-8")
            card_matches = re.findall(r'<aside\b[^>]*\biris-mini-card-static\b[^>]*>.*?</aside>', text, re.I | re.S)
            unavailable_matches = re.findall(r'<section\b[^>]*\bdata-iris-card-unavailable=["\']true["\'][^>]*>.*?</section>', text, re.I | re.S)
            is_draft = bool(re.search(r'>\s*BORRADOR\s*<|Página\s+en\s+borrador', text, re.I))
            has_placeholder = PLACEHOLDER in clean(text)

            if is_draft:
                if card_matches or unavailable_matches:
                    raise AssertionError(f"Una página BORRADOR no puede publicar Tarjeta Iris: {path}")
                drafts_without_cards += 1
                continue

            if has_placeholder:
                if card_matches or len(unavailable_matches) != 1:
                    raise AssertionError(f"La ficha sin 'Qué ayuda' debe mostrar información insuficiente: {path}")
                placeholder_without_cards += 1
                unavailable += 1
                continue

            if len(card_matches) != 1 or unavailable_matches:
                raise AssertionError(f"Tarjeta publicable ausente/duplicada: {path}")
            card = card_matches[0]
            assert_concise(card, path)
            if len(re.findall(r'<button\b[^>]*\bclass=["\'][^"\']*\biris-mini-action\b', card, re.I)) != 2:
                raise AssertionError(f"Acciones incorrectas: {path}")
            if not re.search(r'data-iris-card-status[^>]*role=["\']status["\'][^>]*aria-live=["\']polite["\']', card, re.I):
                raise AssertionError(f"Estado accesible ausente: {path}")
            if NEED_PREFIX in clean(card):
                raise AssertionError(f"Necesito sigue duplicando Me ayuda: {path}")
            vm = re.search(r'data-iris-picto-variant=["\']([ABC])["\']', card, re.I)
            if not vm:
                raise AssertionError(f"Variante A/B/C ausente: {path}")
            variants[vm.group(1).upper()] += 1
            cards += 1

    if drafts_without_cards != 48:
        raise AssertionError(f"Borradores sin tarjeta: {drafts_without_cards}, esperados 48")
    if placeholder_without_cards != 5 or unavailable != 5:
        raise AssertionError(f"Estados insuficientes: {unavailable}; esperados 5")
    if cards != 367 or variants != {"A": 366, "B": 1, "C": 0}:
        raise AssertionError(f"Recuento inesperado: cards={cards}, variants={variants}")

    mulberry = root / "assets/mulberry"
    svgs = {p.name for p in mulberry.glob("*.svg")}
    if svgs != EXPECTED_SVGS:
        raise AssertionError(f"Pictogramas publicados inesperados: {sorted(svgs)}")
    if not (mulberry / "LICENSE-MULBERRY.txt").is_file():
        raise AssertionError("Falta LICENSE-MULBERRY.txt")
    if (root / "assets/pictos").exists():
        raise AssertionError("No debe existir assets/pictos en el artefacto público")
    if any("queue" in p.name or "correct" in p.name for p in mulberry.iterdir()):
        raise AssertionError("Se han publicado candidatos descartados")

    assigned = (root / ASSIGNED).read_text(encoding="utf-8")
    if 'data-iris-picto-variant="B"' not in assigned or 'data-iris-picto-variant="C"' in assigned:
        raise AssertionError("La ficha editorial debe ser B: apoyos contextuales, no secuencia")
    for picto in ("hablar", "escribir"):
        if f'data-mulberry-picto="{picto}"' not in assigned:
            raise AssertionError(f"Falta pictograma editorial {picto}")
        if f'src="/assets/mulberry/{picto}.svg"' not in assigned:
            raise AssertionError(f"Ruta pública incorrecta para {picto}")
    if 'Pedir la instrucción por escrito, aunque sea en dos líneas.' not in assigned:
        raise AssertionError("La ficha especial no está resincronizada con su fuente real")

    tool = (root / "es/tarjetas-iris/index.html").read_text(encoding="utf-8")
    for marker in ('data-ti-variant="A"','data-ti-variant="B"','data-ti-variant="C"','data-ti-lang="es"','data-ti-lang="en"'):
        if marker not in tool:
            raise AssertionError(f"Falta control aprobado de herramienta: {marker}")
    if tool.count("data-mulberry-credit") != 1:
        raise AssertionError("La atribución Mulberry debe aparecer una sola vez en Tarjetas Iris")
    if 'localStorage' in tool or 'sessionStorage' in tool:
        raise AssertionError("La herramienta personal no debe guardar el texto en el navegador")

    print(json.dumps({
        "detail_pages": 420,
        "published_cards": cards,
        "drafts_without_cards": drafts_without_cards,
        "insufficient_states": unavailable,
        "variants": variants,
        "max_block_chars": MAX_BLOCK_CHARS,
        "max_title_chars": MAX_TITLE_CHARS,
        "one_idea_per_block": True,
        "mulberry_svgs": sorted(svgs),
        "editorial_assignment": ASSIGNED,
        "discarded_candidates_published": 0,
        "personal_tool_variants": ["A","B","C"],
        "result": "accepted",
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
