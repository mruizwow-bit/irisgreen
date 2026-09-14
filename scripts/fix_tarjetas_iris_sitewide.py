#!/usr/bin/env python3
"""Corrige el artefacto público de Tarjetas Iris sin inventar contenido editorial.

- No publica tarjetas desde páginas marcadas BORRADOR.
- No publica una tarjeta utilizable cuando la propia ficha dice que falta "Qué ayuda".
- Retira el bloque "Necesito" generado por plantilla cuando solo repite "Me ayuda".
- Resincroniza la ficha especial de instrucciones con la fuente real del repositorio.
- B significa apoyo pictográfico contextual; C queda reservado a secuencias reales.
"""
from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
SPECIAL = "es/situaciones/necesito-que-me-repitan-las-instrucciones/index.html"
CARD_RE = re.compile(
    r'<aside\b(?P<attrs>[^>]*\bclass=["\'][^"\']*\biris-mini-card-static\b[^"\']*["\'][^>]*)>'
    r'(?P<body>.*?)</aside>',
    re.I | re.S,
)
BLOCK_RE = re.compile(
    r'<section\b(?P<attrs>[^>]*\bclass=["\'][^"\']*\biris-mini-block\b[^"\']*["\'][^>]*)>'
    r'(?P<body>.*?)</section>',
    re.I | re.S,
)
PLACEHOLDER = "Esta ficha todavía no dice qué ayuda. Falta el texto, no se rellena con suposiciones."
NEED_PREFIX = "Necesito que se tenga en cuenta este apoyo:"

DETAIL_SETS = (
    ("situaciones", "es/situaciones/*/index.html", 187),
    ("vida", "es/biblioteca/*/index.html", 48),
    ("condiciones", "es/neurodiversidad/condiciones/*/index.html", 185),
)


def clean(fragment: str) -> str:
    fragment = re.sub(r"<br\s*/?>", " ", fragment, flags=re.I)
    fragment = re.sub(r"<[^>]+>", " ", fragment)
    return re.sub(r"\s+", " ", html.unescape(fragment)).strip()


def is_draft(text: str) -> bool:
    return bool(
        re.search(r'<span\b[^>]*class=["\'][^"\']*\bchip\b[^"\']*["\'][^>]*>\s*BORRADOR\s*</span>', text, re.I)
        or re.search(r'Página\s+en\s+borrador', text, re.I)
    )


def heading_and_text(block: str) -> tuple[str, str]:
    hm = re.search(r'<h3\b[^>]*>(.*?)</h3>', block, re.I | re.S)
    pm = re.search(r'<p\b[^>]*>(.*?)</p>', block, re.I | re.S)
    return (clean(hm.group(1)) if hm else "", clean(pm.group(1)) if pm else "")


def replace_block_text(card: str, heading: str, value: str) -> str:
    pattern = re.compile(
        r'(<section\b[^>]*\bclass=["\'][^"\']*\biris-mini-block\b[^"\']*["\'][^>]*>\s*'
        r'<h3\b[^>]*>\s*' + re.escape(heading) + r'\s*</h3>)(?P<middle>.*?)(</section>)',
        re.I | re.S,
    )
    match = pattern.search(card)
    if not match:
        raise AssertionError(f'No se encuentra bloque «{heading}» en Tarjeta Iris')
    middle = match.group('middle')
    middle, n = re.subn(r'(<p\b[^>]*>).*?(</p>)', lambda m: m.group(1) + html.escape(value) + m.group(2), middle, count=1, flags=re.I | re.S)
    if n != 1:
        raise AssertionError(f'No se encuentra texto de «{heading}»')
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
            need_match = match
            need_text = text
    if not need_match or not help_text:
        return card, False
    expected = f"{NEED_PREFIX} {help_text}".strip()
    if need_text != expected:
        return card, False
    return card[:need_match.start()] + card[need_match.end():], True


def extract_source_card_data(source: str) -> tuple[str, str]:
    # Fuente canónica de la ficha, no el prototipo de navegación que sustituye su presentación en dist.
    brief = re.search(
        r'<section\b[^>]*>\s*<h2\b[^>]*>\s*En pocas palabras\s*</h2>(.*?)</section>',
        source, re.I | re.S,
    )
    helps = re.search(
        r'<section\b[^>]*\bclass=["\'][^"\']*\bhelps\b[^"\']*["\'][^>]*>.*?<h2\b[^>]*>.*?</h2>(.*?)</section>',
        source, re.I | re.S,
    )
    if not brief or not helps:
        raise AssertionError('La ficha especial ya no tiene las secciones canónicas esperadas')
    brief_values = [clean(x) for x in re.findall(r'<(?:p|li)\b[^>]*>(.*?)</(?:p|li)>', brief.group(1), re.I | re.S)]
    help_values = [clean(x) for x in re.findall(r'<(?:p|li)\b[^>]*>(.*?)</(?:p|li)>', helps.group(1), re.I | re.S)]
    brief_values = [x for x in brief_values if x]
    help_values = [x for x in help_values if x]
    if not brief_values or not help_values:
        raise AssertionError('La ficha especial no contiene texto suficiente')
    return brief_values[0], help_values[0]


def unavailable(section: str) -> str:
    return (
        f'<section class="iris-cta iris-card-unavailable" data-iris-section="{section}" '
        'data-iris-card-unavailable="true" aria-labelledby="iris-card-unavailable-title">'
        '<div class="iris-cta-copy"><h2 id="iris-card-unavailable-title">Tarjeta Iris</h2>'
        '<p>Esta ficha todavía no tiene información suficiente para preparar una tarjeta sin hacer suposiciones.</p></div>'
        f'<a class="iris-cta-button" href="/es/tarjetas-iris/?section={section}">Preparar mi propia tarjeta</a>'
        '</section>'
    )


def normalize_variant(card: str) -> str:
    pictos = len(re.findall(r'\bdata-mulberry-picto=', card, re.I))
    variant = "B" if pictos else "A"
    if re.search(r'\bdata-iris-picto-variant=["\'][ABC]["\']', card, re.I):
        return re.sub(
            r'\bdata-iris-picto-variant=["\'][ABC]["\']',
            f'data-iris-picto-variant="{variant}"', card, count=1, flags=re.I,
        )
    return card.replace('<aside', f'<aside data-iris-picto-variant="{variant}"', 1)


def run(root: Path) -> dict:
    root = root.resolve()
    if not root.is_dir():
        raise FileNotFoundError(root)

    draft_removed = 0
    insufficient = 0
    need_removed = 0
    cards = 0
    variants = {"A": 0, "B": 0, "C": 0}
    special_synced = False

    source_special = (REPO / SPECIAL).read_text(encoding='utf-8')
    source_difficulty, source_help = extract_source_card_data(source_special)

    for section, pattern, expected_pages in DETAIL_SETS:
        pages = sorted(p for p in root.glob(pattern) if p.is_file())
        if len(pages) != expected_pages:
            raise AssertionError(f'{section}: esperadas {expected_pages} páginas; encontradas {len(pages)}')
        for path in pages:
            rel = path.relative_to(root).as_posix()
            text = path.read_text(encoding='utf-8')
            matches = list(CARD_RE.finditer(text))
            if len(matches) != 1:
                raise AssertionError(f'Tarjeta Iris ausente o duplicada antes del saneado: {rel}')
            match = matches[0]

            if is_draft(text):
                text = text[:match.start()] + text[match.end()9]
                path.write_text(text, encoding='utf-8')
                draft_removed += 1
                continue

            card = match.group(0)
            if PLACEHOLDER in clean(card):
                replacement = unavailable(section)
                text = text[:match.start()] + replacement + text[match.end()9]
                path.write_text(text, encoding='utf-8')
                insufficient += 1
                continue

            card, removed = remove_generated_need(card)
            if removed:
                need_removed += 1

            if rel == SPECIAL:
                card = replace_block_text(card, 'Esto me cuesta', source_difficulty)
                card = replace_block_text(card, 'Me ayuda', source_help)
                special_synced = True

            card = normalize_variant(card)
            vm = re.search(r'data-iris-picto-variant=["\']([ABC])["\']', card, re.I)
            if not vm:
                raise AssertionError(f'Variante ausente después del saneado: {rel}')
            variants[vm.group(1).upper()] += 1
            cards += 1
            text = text[:match.start()] + card + text[match.end()9]
            path.write_text(text, encoding='utf-8')

    if draft_removed != 48:
        raise AssertionError(f'Se esperaban 48 tarjetas retiradas por BORRADOR; se retiraron {draft_removed}')
    if insufficient != 5:
        raise AssertionError(f'Se esperaban 5 estados de información insuficiente; hay {insufficient}')
    if cards != 367:
        raise AssertionError(f'Se esperaban 367 tarjetas publicables; hay {cards}')
    if variants != {"A": 366, "B": 1, "C": 0}:
        raise AssertionError(f'Variantes inesperadas: {variants}')
    if need_removed != 367:
        raise AssertionError(f'El bloque Necesito generado debía retirarse de 367 tarjetas; retirados {need_removed}')
    if not special_synced:
        raise AssertionError('No se resincronizó la ficha especial')

    # Guardarriíles finales de contenido.
    all_cards = []
    for _, pattern, _ in DETAIL_SETS:
        for path in root.glob(pattern):
            if path.is_file():
                all_cards.extend(m.group(0) for m in CARD_RE.finditer(path.read_text(encoding='utf-8')))
    if any(NEED_PREFIX in clean(card) for card in all_cards):
        raise AssertionError('Queda un Necesito fabricado a partir de Me ayuda')
    if any('data-iris-picto-variant="C"' in card for card in all_cards):
        raise AssertionError('C queda reservado a secuencias reales; no puede aparecer en tarjetas de bloques')

    result = {
        'detail_pages': 420,
        'published_cards': cards,
        'draft_cards_removed': draft_removed,
        'insufficient_states': insufficient,
        'generated_need_blocks_removed': need_removed,
        'variants': variants,
        'special_entry_resynced': special_synced,
        'result': 'accepted',
    }
    print(json.dumps(result, ensure_ascii=False))
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=Path, default=Path('dist'))
    args = parser.parse_args()
    run(args.root)
