#!/usr/bin/env python3
"""Sanea Tarjetas Iris sin inventar contenido editorial.

Vida diaria toma su estado del JSON canónico, porque las marcas editoriales se
retiran del HTML antes de este paso. Las tarjetas publicables se reducen a una
idea breve por bloque y nunca fabrican «Necesito» copiando «Me ayuda».
"""
from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
SPECIAL = "es/situaciones/necesito-que-me-repitan-las-instrucciones/index.html"
DAILY_DATA = REPO / "es/biblioteca/vida-diaria.json"
CARD_RE = re.compile(r'<aside\b(?P<attrs>[^>]*\bclass=["\'][^"\']*\biris-mini-card-static\b[^"\']*["\'][^>]*)>(?P<body>.*?)</aside>', re.I | re.S)
BLOCK_RE = re.compile(r'<section\b(?P<attrs>[^>]*\bclass=["\'][^"\']*\biris-mini-block\b[^"\']*["\'][^>]*)>(?P<body>.*?)</section>', re.I | re.S)
NEED_PREFIX = "Necesito que se tenga en cuenta este apoyo:"
MAX_BLOCK_CHARS = 160
MAX_TITLE_CHARS = 92
DETAIL_SETS = (
    ("situaciones", "es/situaciones/*/index.html", 187),
    ("vida", "es/biblioteca/*/index.html", 48),
    ("condiciones", "es/neurodiversidad/condiciones/*/index.html", 185),
)


def clean(fragment: str) -> str:
    fragment = re.sub(r"<br\s*/?>", " ", fragment, flags=re.I)
    fragment = re.sub(r"<[^>]+>", " ", fragment)
    return re.sub(r"\s+", " ", html.unescape(fragment)).strip()


def daily_draft_count() -> int:
    data = json.loads(DAILY_DATA.read_text(encoding="utf-8"))
    rows = data.get("fichas")
    if not isinstance(rows, list) or len(rows) != 48:
        raise AssertionError("Vida diaria debe contener exactamente 48 fichas canónicas")
    drafts = [row for row in rows if str(row.get("status", "")).casefold() == "borrador"]
    if len(drafts) != 48:
        raise AssertionError(f"Vida diaria: se esperaban 48 fichas borrador; hay {len(drafts)}")
    return len(drafts)


def compact_sentence(value: str, limit: int = MAX_BLOCK_CHARS) -> str:
    value = re.sub(r"\s+", " ", value).strip()
    if not value:
        return value
    sentence = re.split(r"(?<=[.!?])\s+", value, maxsplit=1)[0].strip()
    if len(sentence) <= limit:
        return sentence
    cut = sentence[:limit].rsplit(" ", 1)[0].rstrip(" ,;:")
    return (cut or sentence[:limit].rstrip()) + "…"


def compact_title(value: str) -> str:
    value = re.sub(r"\s+", " ", value).strip().strip("«»“”")
    if len(value) <= MAX_TITLE_CHARS:
        return value
    cut = value[:MAX_TITLE_CHARS].rsplit(" ", 1)[0].rstrip(" ,;:")
    return (cut or value[:MAX_TITLE_CHARS].rstrip()) + "…"


def has_real_help(text: str) -> bool:
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


def heading_and_text(block: str) -> tuple[str, str]:
    hm = re.search(r'<h3\b[^>]*>(.*?)</h3>', block, re.I | re.S)
    pm = re.search(r'<p\b[^>]*>(.*?)</p>', block, re.I | re.S)
    return clean(hm.group(1)) if hm else "", clean(pm.group(1)) if pm else ""


def replace_block_text(card: str, heading: str, value: str) -> str:
    pattern = re.compile(
        r'(<section\b[^>]*\bclass=["\'][^"\']*\biris-mini-block\b[^"\']*["\'][^>]*>\s*'
        r'<h3\b[^>]*>\s*' + re.escape(heading) + r'\s*</h3>)(?P<middle>.*?)(</section>)',
        re.I | re.S,
    )
    match = pattern.search(card)
    if not match:
        raise AssertionError(f"No se encuentra bloque «{heading}»")
    middle, count = re.subn(
        r'(<p\b[^>]*>).*?(</p>)',
        lambda m: m.group(1) + html.escape(value) + m.group(2),
        match.group("middle"),
        count=1,
        flags=re.I | re.S,
    )
    if count != 1:
        raise AssertionError(f"No se encuentra texto de «{heading}»")
    return card[:match.start()] + match.group(1) + middle + match.group(3) + card[match.end():]


def remove_generated_need(card: str) -> tuple[str, bool]:
    help_text = ""
    need_match = None
    need_text = ""
    for match in BLOCK_RE.finditer(card):
        heading, text = heading_and_text(match.group(0))
        if heading == "Me ayuda":
            help_text = text
        elif heading == "Necesito":
            need_match, need_text = match, text
    if not need_match or not help_text:
        return card, False
    if need_text != f"{NEED_PREFIX} {help_text}".strip():
        return card, False
    return card[:need_match.start()] + card[need_match.end():], True


def compact_card(card: str) -> str:
    title = re.search(r'<h2\b[^>]*\bclass=["\'][^"\']*\biris-mini-title\b[^"\']*["\'][^>]*>(.*?)</h2>', card, re.I | re.S)
    if title:
        value = compact_title(clean(title.group(1)))
        card = card[:title.start(1)] + html.escape(value) + card[title.end(1):]
    for heading in ("Esto me cuesta", "Me ayuda", "Necesito"):
        pattern = re.compile(
            r'<section\b[^>]*\biris-mini-block\b[^>]*>\s*<h3\b[^>]*>\s*'
            + re.escape(heading) + r'\s*</h3>.*?</section>', re.I | re.S
        )
        match = pattern.search(card)
        if match:
            _, value = heading_and_text(match.group(0))
            if value:
                card = replace_block_text(card, heading, compact_sentence(value))
    return card


def normalize_variant(card: str) -> str:
    variant = "B" if re.search(r'\bdata-mulberry-picto=', card, re.I) else "A"
    if re.search(r'\bdata-iris-picto-variant=["\'][ABC]["\']', card, re.I):
        return re.sub(r'\bdata-iris-picto-variant=["\'][ABC]["\']', f'data-iris-picto-variant="{variant}"', card, count=1, flags=re.I)
    return card.replace("<aside", f'<aside data-iris-picto-variant="{variant}"', 1)


def source_special_data() -> tuple[str, str]:
    source = (REPO / SPECIAL).read_text(encoding="utf-8")
    brief = re.search(r'<section\b[^>]*>\s*<h2\b[^>]*>\s*En pocas palabras\s*</h2>(.*?)</section>', source, re.I | re.S)
    helps = re.search(r'<section\b[^>]*\bclass=["\'][^"\']*\bhelps\b[^"\']*["\'][^>]*>.*?<h2\b[^>]*>.*?</h2>(.*?)</section>', source, re.I | re.S)
    if not brief or not helps:
        raise AssertionError("La ficha especial no conserva sus secciones canónicas")
    bv = [clean(x) for x in re.findall(r'<(?:p|li)\b[^>]*>(.*?)</(?:p|li)>', brief.group(1), re.I | re.S) if clean(x)]
    hv = [clean(x) for x in re.findall(r'<(?:p|li)\b[^>]*>(.*?)</(?:p|li)>', helps.group(1), re.I | re.S) if clean(x)]
    if not bv or not hv:
        raise AssertionError("La ficha especial no contiene texto suficiente")
    return compact_sentence(bv[0]), compact_sentence(hv[0])


def unavailable(section: str) -> str:
    return (
        f'<section class="iris-cta iris-card-unavailable" data-iris-section="{section}" '
        'data-iris-card-unavailable="true" aria-labelledby="iris-card-unavailable-title">'
        '<div class="iris-cta-copy"><h2 id="iris-card-unavailable-title">Tarjeta Iris</h2>'
        '<p>Esta ficha todavía no tiene información suficiente para preparar una tarjeta sin hacer suposiciones.</p></div>'
        f'<a class="iris-cta-button" href="/es/tarjetas-iris/?section={section}">Preparar mi propia tarjeta</a></section>'
    )


def run(root: Path) -> dict:
    root = root.resolve()
    daily_draft_count()
    source_difficulty, source_help = source_special_data()
    draft_removed = insufficient = need_removed = cards = 0
    variants = {"A": 0, "B": 0, "C": 0}
    special_synced = False

    for section, pattern, expected_pages in DETAIL_SETS:
        pages = sorted(p for p in root.glob(pattern) if p.is_file())
        if len(pages) != expected_pages:
            raise AssertionError(f"{section}: esperadas {expected_pages}; encontradas {len(pages)}")
        for path in pages:
            rel = path.relative_to(root).as_posix()
            text = path.read_text(encoding="utf-8")
            source = (REPO / rel).read_text(encoding="utf-8")
            matches = list(CARD_RE.finditer(text))
            if len(matches) != 1:
                raise AssertionError(f"Tarjeta Iris ausente o duplicada antes del saneado: {rel}")
            match = matches[0]

            if section == "vida":
                path.write_text(text[:match.start()] + text[match.end():], encoding="utf-8")
                draft_removed += 1
                continue

            card = match.group(0)
            if section == "condiciones" and not has_real_help(source):
                path.write_text(text[:match.start()] + unavailable(section) + text[match.end():], encoding="utf-8")
                insufficient += 1
                continue

            card, removed = remove_generated_need(card)
            need_removed += int(removed)
            if rel == SPECIAL:
                card = replace_block_text(card, "Esto me cuesta", source_difficulty)
                card = replace_block_text(card, "Me ayuda", source_help)
                special_synced = True
            card = normalize_variant(compact_card(card))
            vm = re.search(r'data-iris-picto-variant=["\']([ABC])["\']', card, re.I)
            if not vm:
                raise AssertionError(f"Variante ausente: {rel}")
            variants[vm.group(1).upper()] += 1
            cards += 1
            path.write_text(text[:match.start()] + card + text[match.end():], encoding="utf-8")

    if draft_removed != 48:
        raise AssertionError(f"Se esperaban 48 tarjetas retiradas por BORRADOR; se retiraron {draft_removed}")
    if insufficient != 5:
        raise AssertionError(f"Se esperaban 5 estados de información insuficiente; hay {insufficient}")
    if cards != 367:
        raise AssertionError(f"Se esperaban 367 tarjetas publicables; hay {cards}")
    if variants != {"A": 366, "B": 1, "C": 0}:
        raise AssertionError(f"Variantes inesperadas: {variants}")
    if need_removed != 367:
        raise AssertionError(f"El bloque Necesito generado debía retirarse de 367 tarjetas; retirados {need_removed}")
    if not special_synced:
        raise AssertionError("No se resincronizó la ficha especial")

    result = {
        "detail_pages": 420,
        "published_cards": cards,
        "draft_cards_removed": draft_removed,
        "insufficient_states": insufficient,
        "generated_need_blocks_removed": need_removed,
        "max_block_chars": MAX_BLOCK_CHARS,
        "max_title_chars": MAX_TITLE_CHARS,
        "one_idea_per_block": True,
        "variants": variants,
        "special_entry_resynced": special_synced,
        "result": "accepted",
    }
    print(json.dumps(result, ensure_ascii=False))
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=Path("dist"))
    args = parser.parse_args()
    run(args.root)
