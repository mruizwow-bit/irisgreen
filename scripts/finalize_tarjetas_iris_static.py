#!/usr/bin/env python3
"""Deja las 420 Tarjetas Iris interiores rellenas y no editables.

`connect_tarjetas_iris.py` ya prepara el contenido de cada tarjeta a partir de su
ficha. Este paso no vuelve a interpretar el contenido: conserva esos tres bloques,
retira únicamente la acción de crear/personalizar y marca la tarjeta como estática.
La herramienta personal `/es/tarjetas-iris/` sigue siendo editable.
"""
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

CARD_RE = re.compile(
    r'<aside\b(?P<attrs>[^>]*\bclass=["\'][^"\']*\biris-mini-card\b[^"\']*["\'][^>]*)>'
    r'(?P<body>.*?)</aside>',
    re.I | re.S,
)
OWN_LINK_RE = re.compile(
    r'<a\b[^>]*\bclass=["\'][^"\']*\biris-mini-own\b[^"\']*["\'][^>]*>.*?</a>',
    re.I | re.S,
)


def make_static(match: re.Match[str], rel: str) -> str:
    attrs = match.group("attrs")
    body = match.group("body")

    if 'data-iris-card-cta="true"' not in attrs:
        raise AssertionError(f"Tarjeta Iris interior sin marcador: {rel}")
    if len(re.findall(r'class=["\'][^"\']*\biris-mini-block\b', body, re.I)) != 3:
        raise AssertionError(f"Tarjeta Iris interior sin tres bloques: {rel}")
    if not OWN_LINK_RE.search(body):
        raise AssertionError(f"Tarjeta Iris interior sin acción esperada antes de fijarla: {rel}")

    body = OWN_LINK_RE.sub("", body, count=1)
    attrs = re.sub(
        r'\bclass=(["\'])([^"\']*)\1',
        lambda m: f'class={m.group(1)}{m.group(2)} iris-mini-card-static{m.group(1)}',
        attrs,
        count=1,
        flags=re.I,
    )
    attrs += ' data-iris-card-static="true"'
    attrs = re.sub(
        r'aria-label=(["\']).*?\1',
        'aria-label="Tarjeta Iris con el contenido de esta ficha"',
        attrs,
        count=1,
        flags=re.I,
    )
    if 'aria-label=' not in attrs:
        attrs += ' aria-label="Tarjeta Iris con el contenido de esta ficha"'

    card = f"<aside{attrs}>{body}</aside>"
    if re.search(r'<(?:input|textarea|button)\b|contenteditable\s*=|\biris-mini-own\b|Personalizar el texto|Crear mi propia tarjeta', card, re.I):
        raise AssertionError(f"La tarjeta interior sigue ofreciendo edición: {rel}")
    if "Para mi cita" in card:
        raise AssertionError(f"Sigue el ejemplo genérico en {rel}")
    return card


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path("dist"))
    args = ap.parse_args()
    root = args.root.resolve()

    counts: dict[str, int] = {}
    changed = 0
    for section, pattern, expected in DETAIL_SETS:
        pages = sorted(p for p in root.glob(pattern) if p.is_file())
        if len(pages) != expected:
            raise AssertionError(f"{section}: esperadas {expected} fichas; encontradas {len(pages)}")
        for path in pages:
            rel = path.relative_to(root).as_posix()
            text = path.read_text(encoding="utf-8")
            matches = list(CARD_RE.finditer(text))
            if len(matches) != 1:
                raise AssertionError(f"Tarjeta Iris interior ausente o duplicada: {rel}")
            new = CARD_RE.sub(lambda m: make_static(m, rel), text, count=1)
            if new == text:
                raise AssertionError(f"La tarjeta no cambió: {rel}")
            path.write_text(new, encoding="utf-8")
            changed += 1
        counts[section] = len(pages)

    if changed != 420:
        raise AssertionError(f"Se esperaban 420 tarjetas convertidas; se cambiaron {changed}")

    tool = root / "es/tarjetas-iris/index.html"
    tool_text = tool.read_text(encoding="utf-8")
    if '<form class="iris-panel"' not in tool_text:
        raise AssertionError("La herramienta personal Tarjetas Iris debe seguir siendo editable")

    print(json.dumps({
        "interior_cards": counts,
        "total": 420,
        "kept_generated_content": True,
        "editable": False,
        "blocks_per_card": 3,
        "personal_tool_editable": True,
        "result": "accepted",
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
