#!/usr/bin/env python3
"""Guardarraíl de Tarjetas Iris: contenido real, lectura breve y Mulberry editorial."""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
DAILY_DATA = REPO / "es/biblioteca/vida-diaria.json"
DETAIL_SETS = (
    ("situaciones", "es/situaciones/*/index.html", 187),
    ("vida", "es/biblioteca/*/index.html", 48),
    ("condiciones", "es/neurodiversidad/condiciones/*/index.html", 185),
)
EXPECTED_SVGS = {"hablar.svg", "escribir.svg", "esperar.svg", "preguntar.svg", "carpeta.svg"}
ASSIGNED = "es/situaciones/necesito-que-me-repitan-las-instrucciones/index.html"
NEED_PREFIX = "Necesito que se tenga en cuenta este apoyo:"
MAX_BLOCK_CHARS = 160
MAX_TITLE_CHARS = 92


def clean(text: str) -> str:
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', text)).strip()


def daily_is_all_draft() -> bool:
    data = json.loads(DAILY_DATA.read_text(encoding="utf-8"))
    rows = data.get("fichas")
    return isinstance(rows, list) and len(rows) == 48 and all(
        str(row.get("status", "")).casefold() == "borrador" for row in rows
    )


def source_has_real_help(text: str) -> bool:
    for match in re.finditer(r'<section\b([^>]*)>(.*?)</section>', text, re.I | re.S):
        attrs, body = match.group(1), match.group(2)
        hm = re.search(r'<h2\b[^>]*>(.*?)</h2>', body, re.I | re.S)
        heading = clean(hm.group(1)).casefold() if hm else ""
        is_help = bool(re.search(r'class=["\'][^"\']*\bhelps\b', attrs, re.I)) or any(
            key in heading for key in ("qué puede ayudar ahora", "qué ayuda", "qué puede ayudar")
        )
        if not is_help:
            continue
        values = [clean(x) for x in re.findall(r'<(?:p|li)\b[^>]*>(.*?)</(?:p|li)>', body, re.I | re.S)]
        values = [value for value in values if value]
        if values and not all(
            "todavía no dice qué ayuda" in value.casefold() or "falta el texto" in value.casefold()
            for value in values
        ):
            return True
    return False


def assert_concise(card: str, path: Path) -> None:
    title = re.search(r'<h2\b[^>]*\biris-mini-title\b[^>]*>(.*?)</h2>', card, re.I | re.S)
    if title and len(clean(title.group(1))) > MAX_TITLE_CHARS + 1:
        raise AssertionError(f"Título demasiado largo en {path}")
    for block in re.findall(r'<section\b[^>]*\biris-mini-block\b[^>]*>.*?</section>', card, re.I | re.S):
        heading = re.search(r'<h3\b[^>]*>(.*?)</h3>', block, re.I | re.S)
        text = re.search(r'<p\b[^>]*>(.*?)</p>', block, re.I | re.S)
        if not heading or not text:
            continue
        name, value = clean(heading.group(1)), clean(text.group(1))
        if name in {"Esto me cuesta", "Me ayuda", "Necesito"} and len(value) > MAX_BLOCK_CHARS + 1:
            raise AssertionError(f"Bloque «{name}» demasiado largo en {path}: {len(value)}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path("dist"))
    args = parser.parse_args()
    root = args.root.resolve()

    if not daily_is_all_draft():
        raise AssertionError("Vida diaria debe mantener sus 48 fichas canónicas en estado borrador")

    variants = {"A": 0, "B": 0, "C": 0}
    cards = unavailable = drafts_without_cards = insufficient_without_cards = 0

    for section, pattern, expected in DETAIL_SETS:
        pages = sorted(p for p in root.glob(pattern) if p.is_file())
        if len(pages) != expected:
            raise AssertionError(f"{section}: esperadas {expected}; encontradas {len(pages)}")
        for path in pages:
            rel = path.relative_to(root).as_posix()
            text = path.read_text(encoding="utf-8")
            source = (REPO / rel).read_text(encoding="utf-8")
            cards_here = re.findall(r'<aside\b[^>]*\biris-mini-card-static\b[^>]*>.*?</aside>', text, re.I | re.S)
            unavailable_here = re.findall(r'<section\b[^>]*\bdata-iris-card-unavailable=["\']true["\'][^>]*>.*?</section>', text, re.I | re.S)

            if section == "vida":
                if cards_here or unavailable_here:
                    raise AssertionError(f"Vida diaria borrador no puede publicar Tarjeta Iris: {path}")
                drafts_without_cards += 1
                continue

            insufficient = section == "condiciones" and not source_has_real_help(source)
            if insufficient:
                if cards_here or len(unavailable_here) != 1:
                    raise AssertionError(f"La ficha sin «Qué ayuda» debe mostrar información insuficiente: {path}")
                insufficient_without_cards += 1
                unavailable += 1
                continue

            if len(cards_here) != 1 or unavailable_here:
                raise AssertionError(f"Tarjeta publicable ausente o duplicada: {path}")
            card = cards_here[0]
            assert_concise(card, path)
            if len(re.findall(r'<button\b[^>]*\bclass=["\'][^"\']*\biris-mini-action\b', card, re.I)) != 2:
                raise AssertionError(f"Acciones incorrectas: {path}")
            if not re.search(r'data-iris-card-status[^>]*role=["\']status["\'][^>]*aria-live=["\']polite["\']', card, re.I):
                raise AssertionError(f"Estado accesible ausente: {path}")
            if NEED_PREFIX in clean(card):
                raise AssertionError(f"Necesito sigue duplicando Me ayuda: {path}")
            vm = re.search(r'data-iris-picto-variant=["\']([ABC])["\']', card, re.I)
            if not vm:
                raise AssertionError(f"Variante interna A/B/C ausente: {path}")
            variants[vm.group(1).upper()] += 1
            cards += 1

    if drafts_without_cards != 48:
        raise AssertionError(f"Borradores sin tarjeta: {drafts_without_cards}, esperados 48")
    if insufficient_without_cards != 5 or unavailable != 5:
        raise AssertionError(f"Estados insuficientes: {unavailable}; esperados 5")
    if cards != 367 or variants != {"A": 366, "B": 1, "C": 0}:
        raise AssertionError(f"Recuento inesperado: cards={cards}, variants={variants}")

    mulberry = root / "assets/mulberry"
    svgs = {path.name for path in mulberry.glob("*.svg")}
    if svgs != EXPECTED_SVGS:
        raise AssertionError(f"Pictogramas publicados inesperados: {sorted(svgs)}")
    if not (mulberry / "LICENSE-MULBERRY.txt").is_file():
        raise AssertionError("Falta LICENSE-MULBERRY.txt")
    if (root / "assets/pictos").exists():
        raise AssertionError("No debe existir assets/pictos en el artefacto público")
    if any("queue" in path.name or "correct" in path.name for path in mulberry.iterdir()):
        raise AssertionError("Se han publicado candidatos descartados")

    assigned = (root / ASSIGNED).read_text(encoding="utf-8")
    if 'data-iris-picto-variant="B"' not in assigned or 'data-iris-picto-variant="C"' in assigned:
        raise AssertionError("La ficha editorial debe ser B: apoyos contextuales, no secuencia")
    for picto in ("hablar", "escribir"):
        if f'data-mulberry-picto="{picto}"' not in assigned:
            raise AssertionError(f"Falta pictograma editorial {picto}")
    if 'Pedir la instrucción por escrito, aunque sea en dos líneas.' not in assigned:
        raise AssertionError("La ficha especial no está resincronizada con su fuente real")

    tool = (root / "es/tarjetas-iris/index.html").read_text(encoding="utf-8")
    tool_js = (root / "assets/tarjetas-iris-tool.js").read_text(encoding="utf-8")
    for marker in ('data-ti-tool','id="ti-title"','id="ti-dificultad"','id="ti-ayuda"','id="ti-necesito"','id="ti-print"','id="ti-copy"','id="ti-reset"'):
        if marker not in tool:
            raise AssertionError(f"Falta control esencial de herramienta: {marker}")
    for forbidden in ('data-ti-variant=', 'data-ti-lang=', 'data-ti-pictos=', 'Forma de la tarjeta', 'Un pictograma, si quieres'):
        if forbidden in tool:
            raise AssertionError(f"La herramienta sencilla no debe exponer {forbidden}")
    if tool.count('<textarea') != 3 or tool.count('maxlength="160"') != 3:
        raise AssertionError("La herramienta debe tener exactamente los tres bloques breves del prototipo")
    if tool.count("data-mulberry-credit") != 1:
        raise AssertionError("La atribución Mulberry debe aparecer una sola vez en Tarjetas Iris")
    if any(token in tool or token in tool_js for token in ("localStorage", "sessionStorage")):
        raise AssertionError("La herramienta personal no debe guardar el texto en el navegador")
    for field, picto in (("dificultad", "hablar"), ("ayuda", "escribir"), ("necesito", "esperar")):
        if f"{field}:{{value:defaults.{field},id:'{picto}'}}" not in tool_js:
            raise AssertionError(f"Falta el apoyo visual contextual del ejemplo: {(field, picto)}")
    if "text===item.value?item.id:null" not in tool_js:
        raise AssertionError("Al cambiar el texto debe retirarse el pictograma del ejemplo")

    print(json.dumps({
        "detail_pages": 420,
        "published_cards": cards,
        "drafts_without_cards": drafts_without_cards,
        "insufficient_states": unavailable,
        "variants": variants,
        "max_block_chars": MAX_BLOCK_CHARS,
        "max_title_chars": MAX_TITLE_CHARS,
        "compact_reading_rule": "una idea breve por bloque",
        "mulberry_svgs": sorted(svgs),
        "editorial_assignment": ASSIGNED,
        "discarded_candidates_published": 0,
        "personal_tool_exposes_variants": False,
        "personal_tool_language_switcher": False,
        "personal_tool_manual_picto_picker": False,
        "example_pictograms_are_contextual": True,
        "result": "accepted",
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
