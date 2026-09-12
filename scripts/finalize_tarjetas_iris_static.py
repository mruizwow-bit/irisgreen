#!/usr/bin/env python3
"""Convierte las Tarjetas Iris interiores en resúmenes rellenos y no editables.

La herramienta personal /es/tarjetas-iris/ y los CTA de los índices siguen siendo
editables. Solo las 420 tarjetas que aparecen dentro de las fichas quedan fijas.
"""
from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path

DETAIL_SETS = (
    ("situaciones", "es/situaciones/*/index.html", 187),
    ("vida", "es/biblioteca/*/index.html", 48),
    ("condiciones", "es/neurodiversidad/condiciones/*/index.html", 185),
)
SPECIAL = "es/situaciones/necesito-que-me-repitan-las-instrucciones/index.html"
MARKER = 'data-iris-card-cta="true"'
STATIC_MARKER = 'data-iris-card-static="true"'
CARD_RE = re.compile(r'<aside\b[^>]*data-iris-card-cta="true"[^>]*>.*?</aside>', re.I | re.S)
TAG_RE = re.compile(r"<[^>]+>")
H1_RE = re.compile(r"<h1\b[^>]*>(.*?)</h1>", re.I | re.S)
H2_RE = re.compile(r"<h2\b[^>]*>(.*?)</h2>", re.I | re.S)
P_RE = re.compile(r"<p\b[^>]*>(.*?)</p>", re.I | re.S)
LI_RE = re.compile(r"<li\b[^>]*>(.*?)</li>", re.I | re.S)
SECTION_TOKEN_RE = re.compile(r"<section\b[^>]*>|</section\s*>", re.I)

TYPE_LABELS = {
    "situaciones": "SITUACIONES",
    "vida": "VIDA DIARIA",
    "condiciones": "CONDICIONES",
}
TECHNICAL_DAILY = {"Dónde está escrito", "Ficha técnica"}


def plain(fragment: str) -> str:
    return " ".join(html.unescape(TAG_RE.sub(" ", fragment)).split())


def section_spans(text: str):
    stack = []
    result = []
    for match in SECTION_TOKEN_RE.finditer(text):
        if match.group(0).lower().startswith("<section"):
            stack.append(match.start())
        elif stack:
            start = stack.pop()
            result.append(text[start:match.end()])
    if stack:
        raise AssertionError("HTML con <section> sin cierre")
    return result


def sections(text: str) -> list[tuple[str,str]]:
    result = []
    for block in section_spans(text):
        hm = H2_RE.search(block)
        if not hm:
            continue
        heading = plain(hm.group(1))
        body = H2_RE.sub("", block, count=1)
        values = [plain(x) for x in P_RE.findall(body) if plain(x)]
        values += [plain(x) for x in LI_RE.findall(body) if plain(x)]
        values = list(dict.fromkeys(values))
        if values:
            result.append((heading, " ".join(values)))
    return result


def first_value(text: str, heading: str) -> str:
    for block in section_spans(text):
        hm = H2_RE.search(block)
        if not hm or plain(hm.group(1)) != heading:
            continue
        body = H2_RE.sub("", block, count=1)
        paras = [plain(x) for x in P_RE.findall(body) if plain(x)]
        if paras:
            return paras[0]
        items = [plain(x) for x in LI_RE.findall(body) if plain(x)]
        if items:
            return items[0]
    return ""


def details_text(text: str, details_id: str) -> str:
    match = re.search(
        r'<details\b[^>]*id=["\']' + re.escape(details_id) +
        r'["\'][^>]*>\s*<summary[^>]*>.*?</summary>(.*?)</details>',
        text, re.I | re.S,
    )
    if not match:
        return ""
    body = match.group(1)
    values = [plain(x) for x in P_RE.findall(body) if plain(x)]
    values += [plain(x) for x in LI_RE.findall(body) if plain(x)]
    return " ".join(dict.fromkeys(values))


def special_options_text(text: str) -> str:
    """Extrae los pasos de la lista de opciones de la ficha especial aprobada."""
    match = re.search(
        r'<ul\b[^>]*class=["\'][^"\']*\boption-list\b[^"\']*["\'][^>]*>(.*?)</ul>',
        text, re.I | re.S,
    )
    if not match:
        return ""
    items = [plain(x) for x in LI_RE.findall(match.group(1)) if plain(x)]
    return " ".join(dict.fromkeys(items))


def title(text: str) -> str:
    match = H1_RE.search(text)
    if not match:
        raise AssertionError("Ficha sin h1")
    return plain(match.group(1))


def blocks(section: str, text: str, rel: str) -> list[tuple[str,str]]:
    sec = dict(sections(text))
    if rel == SPECIAL and "help-details" in text:
        values = [
            ("En pocas palabras", sec.get("En pocas palabras", "")),
            ("Qué puedes probar", special_options_text(text)),
            ("Cuándo pedir ayuda", details_text(text, "help-details")),
        ]
    elif section == "situaciones":
        values = [
            ("Qué observar", sec.get("Qué conviene observar", "")),
            ("Qué ayuda", sec.get("Qué puede ayudar ahora", "")),
            ("Cuándo pedir ayuda", sec.get("Cuándo pedir ayuda profesional", "")),
        ]
    elif section == "condiciones":
        values = [
            ("Qué es", first_value(text, "Descripción")),
            ("Qué ayuda", first_value(text, "Qué ayuda")),
            ("Qué conviene saber", first_value(text, "Qué no está demostrado")),
        ]
    else:
        practical = [(h,b) for h,b in sections(text) if h not in TECHNICAL_DAILY]
        if len(practical) < 3:
            raise AssertionError(f"Vida diaria sin tres bloques prácticos: {rel}")
        values = practical[:3]
    if any(not value for _label,value in values):
        raise AssertionError(f"Tarjeta Iris sin contenido suficiente: {rel} · {values}")
    return values


def render(section: str, text: str, rel: str) -> str:
    esc = lambda value: html.escape(value, quote=True)
    card_blocks = blocks(section, text, rel)
    body = "".join(
        '<section class="iris-mini-block' + (' iris-mini-need' if i == 2 else '') + '">'
        f'<h3>{esc(label)}</h3><p>{esc(value)}</p></section>'
        for i,(label,value) in enumerate(card_blocks)
    )
    return (
        f'<aside class="iris-cta iris-mini-card iris-mini-card-static" data-iris-section="{section}" '
        f'{MARKER} {STATIC_MARKER} aria-label="Tarjeta Iris con los pasos de esta ficha">'
        '<header class="iris-mini-head"><span class="iris-mini-brand">Iris Green</span>'
        f'<span class="iris-mini-type">{TYPE_LABELS[section]}<br>TARJETA IRIS</span></header>'
        f'<h2 class="iris-mini-title">{esc(title(text))}</h2>'
        f'{body}'
        '<footer class="iris-mini-foot"><span>irisgreen.eu</span><span>Pasos de esta ficha</span></footer>'
        '</aside>'
    )


def check_static(text: str, rel: str) -> None:
    matches = re.findall(r'<aside\b[^>]*data-iris-card-static="true"[^>]*>(.*?)</aside>', text, re.I | re.S)
    if len(matches) != 1:
        raise AssertionError(f"Tarjeta estática ausente o duplicada: {rel}")
    card = matches[0]
    if re.search(r'<(?:input|textarea|button)\b|contenteditable\s*=|iris-mini-button|Personalizar el texto|Se guarda en tu navegador', card, re.I):
        raise AssertionError(f"La tarjeta interior sigue siendo editable: {rel}")
    if len(re.findall(r'class="iris-mini-block', card, re.I)) != 3:
        raise AssertionError(f"La tarjeta no tiene tres bloques: {rel}")
    if "Para mi cita" in card:
        raise AssertionError(f"Sigue el ejemplo genérico en {rel}")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path("dist"))
    args = ap.parse_args()
    root = args.root.resolve()
    counts = {}
    changed = 0

    for section, pattern, expected in DETAIL_SETS:
        pages = sorted(p for p in root.glob(pattern) if p.is_file())
        if len(pages) != expected:
            raise AssertionError(f"{section}: esperadas {expected} fichas; encontradas {len(pages)}")
        for path in pages:
            rel = path.relative_to(root).as_posix()
            text = path.read_text(encoding="utf-8")
            cards = CARD_RE.findall(text)
            if len(cards) != 1:
                raise AssertionError(f"Tarjeta Iris previa ausente o duplicada: {rel}")
            new = CARD_RE.sub(lambda _m: render(section, text, rel), text, count=1)
            check_static(new, rel)
            if new != text:
                path.write_text(new, encoding="utf-8")
                changed += 1
        counts[section] = len(pages)

    if changed != 420:
        raise AssertionError(f"Se esperaban 420 tarjetas convertidas; se cambiaron {changed}")

    tool = root / "es/tarjetas-iris/index.html"
    if '<form class="iris-panel"' not in tool.read_text(encoding="utf-8"):
        raise AssertionError("La herramienta personal Tarjetas Iris debe seguir siendo editable")

    print(json.dumps({
        "interior_cards": counts,
        "total": 420,
        "filled": True,
        "editable": False,
        "blocks_per_card": 3,
        "personal_tool_editable": True,
        "result": "accepted",
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
