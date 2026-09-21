#!/usr/bin/env python3
"""Tarjeta Iris en inglés.

Genera la tarjeta en las páginas inglesas reutilizando el extractor y los
textos editoriales de `connect_tarjetas_iris.py`. El texto de «I need» sale
del campo `en` de `editorial/tarjetas-necesito-*.json`, buscado por la ruta
ESPAÑOLA de la ficha: la pareja se obtiene de `buscador.json` (Situaciones y
Condiciones) y del `hreflang` de la propia página (Vida diaria).

Se ejecuta después de `connect_tarjetas_iris.py` y sobre `dist`, nunca sobre
la fuente.
"""
from __future__ import annotations

import argparse
import html
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import connect_tarjetas_iris as es  # noqa: E402

SETS = (
    ("situaciones", "en/situations/*/index.html", 187),
    ("vida", "en/everyday-life/*/index.html", 49),
    ("condiciones", "en/neurodiversity/conditions/*/index.html", 185),
)

TOOL = "/es/recursos/tarjeta-iris/"

UI = {
    "aria_card": "Iris Card prepared for this entry",
    "aria_empty": "Iris Card not available for this entry",
    "type": "IRIS CARD",
    "brand": "Iris Green",
    "hard": "This is hard for me",
    "helps": "It helps me",
    "need": "I need",
    "own": "Create my own card",
    "foot": "Ready to show or keep",
    "empty": ("This page does not say yet what helps, so no card is prepared "
              "from its content. The card will appear here once the text is written."),
    "empty_cta": "Prepare my own Iris Card",
    "conditions_prefix": "My needs may be in some of these areas: ",
}

# Encabezados equivalentes en las páginas inglesas.
HELP_HEADINGS = ("what helps", "what can help now", "what to do", "accessible support")
SKIP_HEADINGS = (
    "sources", "where it is written", "technical sheet", "links with",
    "warning signs", "when to seek", "emergency", "may be related",
)
PLACEHOLDER = ("does not say what helps yet", "does not say yet what helps")


def pairs(root: Path) -> dict[str, str]:
    """Ruta inglesa -> ruta española, para las tres colecciones."""
    out: dict[str, str] = {}
    data = json.loads((root / "buscador.json").read_text(encoding="utf-8"))
    for item in data:
        en_url = (item.get("en") or {}).get("u")
        if en_url:
            out[en_url.strip("/") + "/index.html"] = item["u"].strip("/") + "/index.html"
    for path in sorted(root.glob("en/everyday-life/*/index.html")):
        text = path.read_text(encoding="utf-8", errors="replace")
        match = re.search(r'hreflang="es" href="https://irisgreen\.eu(/es/[^"]+)"', text)
        if match:
            out[path.relative_to(root).as_posix()] = match.group(1).strip("/") + "/index.html"
    return out


def find_helps(blocks) -> list[str]:
    for attrs, _heading, body in blocks:
        if re.search(r'class=["\'][^"\']*\bhelps\b', attrs, flags=re.I):
            values = es.body_texts(body)
            if values:
                return values
    return es.find_heading(blocks, HELP_HEADINGS)


def fallback(blocks) -> list[str]:
    out: list[str] = []
    for _attrs, heading, body in blocks[1:]:
        low = heading.casefold()
        if any(word in low for word in SKIP_HEADINGS):
            continue
        values = es.body_texts(body)
        if not values:
            continue
        out.extend(values[:1])
        if len(out) >= 2:
            break
    return out


def card_data(text: str, section: str, rel_es: str,
              overrides: dict[str, dict[str, str]]) -> tuple[dict, str]:
    body = es.canonical(text)
    title, (difficulty, _helps), blocks = es.extract(body, section)
    helps = find_helps(blocks) or fallback(blocks)
    if not difficulty or not helps:
        title, (difficulty, _helps), blocks = es.extract(text, section)
        helps = find_helps(blocks) or fallback(blocks)
    if not difficulty:
        # Páginas sin párrafo de entrada: se toma el primer texto de «In brief».
        difficulty = es.find_heading(blocks, ("in brief", "in short"))
    if not difficulty or not helps:
        raise AssertionError(f"No se pudo preparar la tarjeta inglesa: {rel_es}")

    joined = " ".join(helps).casefold()
    if any(mark in joined for mark in PLACEHOLDER):
        return {}, "sin contenido"

    dificultad = es.clip(" ".join(difficulty[:1]), 320)
    ayuda = es.clip(" ".join(helps[:2]), 360)
    if section == "condiciones":
        dificultad = es.clip(UI["conditions_prefix"] + dificultad, 340)

    necesito = (overrides.get(rel_es) or {}).get("en")
    if necesito and not es.distinct(necesito, ayuda):
        raise AssertionError(f"«I need» repite «It helps me» en {rel_es}")
    return {"title": title, "dificultad": dificultad,
            "ayuda": ayuda, "necesito": necesito}, ("editorial" if necesito else "por escribir")


def full_card(section: str, data: dict) -> str:
    e = lambda value: html.escape(str(value), quote=True)
    need = f'<p>{e(data["necesito"])}</p>' if data["necesito"] else (
        '<p>I write this myself before showing the card.</p>'
        '<p class="iris-mini-write" aria-hidden="true">________________________________</p>'
    )
    return (
        f'<aside class="iris-cta iris-mini-card" data-iris-section="{section}" {es.MARKER} '
        f'aria-label="{UI["aria_card"]}">'
        f'<header class="iris-mini-head"><span class="iris-mini-brand">{UI["brand"]}</span>'
        f'<span class="iris-mini-type">{UI["type"]}</span></header>'
        f'<h2 class="iris-mini-title">{e(data["title"])}</h2>'
        f'<section class="iris-mini-block"><h3>{UI["hard"]}</h3><p>{e(data["dificultad"])}</p></section>'
        f'<section class="iris-mini-block"><h3>{UI["helps"]}</h3><p>{e(data["ayuda"])}</p></section>'
        f'<section class="iris-mini-block iris-mini-need"><h3>{UI["need"]}</h3>{need}</section>'
        f'<a class="iris-mini-own" href="{TOOL}">{UI["own"]}</a>'
        f'<footer class="iris-mini-foot"><span>irisgreen.eu</span><span>{UI["foot"]}</span></footer>'
        '</aside>'
    )


def empty_state(section: str) -> str:
    return (
        f'<aside class="iris-cta iris-mini-empty" data-iris-section="{section}" {es.MARKER} '
        f'aria-label="{UI["aria_empty"]}">'
        f'<h2>Iris Card</h2><p>{UI["empty"]}</p>'
        f'<a class="iris-cta-button" href="{TOOL}">{UI["empty_cta"]}</a>'
        '</aside>'
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", required=True)
    root = Path(parser.parse_args().root).resolve()

    overrides = es.load_necesito()
    mapping = pairs(root)

    made: dict[str, int] = {}
    empty: list[str] = []
    missing_pair: list[str] = []
    sources: dict[str, int] = {"editorial": 0, "por escribir": 0}

    for section, pattern, expected in SETS:
        pages = sorted(p for p in root.glob(pattern) if p.is_file())
        if len(pages) != expected:
            raise AssertionError(f"{section} EN: se esperaban {expected} fichas y hay {len(pages)}")
        count = 0
        for path in pages:
            rel = path.relative_to(root).as_posix()
            rel_es = mapping.get(rel)
            if not rel_es:
                missing_pair.append(rel)
                continue
            before = path.read_text(encoding="utf-8")
            data, origen = card_data(before, section, rel_es, overrides)
            if origen == "sin contenido":
                empty.append(rel)
                block = empty_state(section)
            else:
                sources[origen] += 1
                block = full_card(section, data)
                count += 1
            try:
                after = es.add_css(es.insert_block(before, block, path))
            except AssertionError:
                # Página sin </article>: se inserta al final del contenido principal.
                if "</main>" not in before:
                    raise
                after = es.add_css(before.replace("</main>", block + "</main>", 1))
            if after != before:
                path.write_text(after, encoding="utf-8")
            if after.count(es.MARKER) != 1:
                raise AssertionError(f"Tarjeta inglesa duplicada o ausente: {rel}")
        made[section] = count

    print(json.dumps({
        "english_cards_connected": made,
        "english_cards_total": sum(made.values()),
        "english_empty_state": len(empty),
        "english_need_sources": sources,
        "english_pages_without_pair": missing_pair,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
