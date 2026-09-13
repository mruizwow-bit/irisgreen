#!/usr/bin/env python3
"""Convierte las 420 Tarjetas Iris interiores en Tarjeta Iris v2 estática.

`connect_tarjetas_iris.py` prepara el contenido de cada tarjeta a partir de su
ficha. Este paso conserva esos tres bloques, retira la edición, fija la variante
A cuando no existe un apoyo pictográfico editorial y añade las dos acciones de
v2: copiar e imprimir. La herramienta personal `/es/tarjetas-iris/` continúa
siendo editable.
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

RUNTIME_TAG = '<script src="/assets/tarjetas-iris-static.js" defer></script>'
CARD_RE = re.compile(
    r'<aside\b(?P<attrs>[^>]*\bclass=["\'][^"\']*\biris-mini-card\b[^"\']*["\'][^>]*)>'
    r'(?P<body>.*?)</aside>',
    re.I | re.S,
)
OWN_LINK_RE = re.compile(
    r'<a\b[^>]*\bclass=["\'][^"\']*\biris-mini-own\b[^"\']*["\'][^>]*>.*?</a>',
    re.I | re.S,
)

ACTIONS = (
    '<div class="iris-mini-actions" aria-label="Acciones de la Tarjeta Iris">'
    '<button class="iris-mini-action" type="button" data-iris-card-copy>Copiar texto</button>'
    '<button class="iris-mini-action" type="button" data-iris-card-print>Imprimir</button>'
    '<p class="iris-mini-action-status" data-iris-card-status role="status" '
    'aria-live="polite" aria-atomic="true"></p>'
    '</div>'
)


def add_runtime(text: str, rel: str) -> str:
    if RUNTIME_TAG in text:
        return text
    if "</head>" not in text:
        raise AssertionError(f"Página sin </head>: {rel}")
    return text.replace("</head>", RUNTIME_TAG + "\n</head>", 1)


def add_actions(body: str, rel: str) -> str:
    if 'data-iris-card-copy' in body or 'data-iris-card-print' in body:
        raise AssertionError(f"Tarjeta Iris ya contiene acciones v2 antes de finalizar: {rel}")
    # Si existe atribución pictográfica, las acciones quedan antes de ella. Si no,
    # se colocan antes del pie de la tarjeta.
    anchors = (
        re.search(r'<p\b[^>]*\bclass=["\'][^"\']*\biris-mini-picto-credit\b[^"\']*["\'][^>]*>', body, re.I),
        re.search(r'<footer\b[^>]*\bclass=["\'][^"\']*\biris-mini-foot\b[^"\']*["\'][^>]*>', body, re.I),
    )
    anchor = next((m for m in anchors if m), None)
    if not anchor:
        raise AssertionError(f"Tarjeta Iris sin pie para acciones v2: {rel}")
    return body[:anchor.start()] + ACTIONS + body[anchor.start():]


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
    body = add_actions(body, rel)
    attrs = re.sub(
        r'\bclass=(["\'])([^"\']*)\1',
        lambda m: f'class={m.group(1)}{m.group(2)} iris-mini-card-static{m.group(1)}',
        attrs,
        count=1,
        flags=re.I,
    )
    attrs += ' data-iris-card-static="true"'
    if 'data-iris-picto-variant=' not in attrs:
        attrs += ' data-iris-picto-variant="A"'
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
    if re.search(r'<(?:input|textarea)\b|contenteditable\s*=|\biris-mini-own\b|Personalizar el texto|Crear mi propia tarjeta', card, re.I):
        raise AssertionError(f"La tarjeta interior sigue ofreciendo edición: {rel}")
    if len(re.findall(r'<button\b[^>]*\bclass=["\'][^"\']*\biris-mini-action\b', card, re.I)) != 2:
        raise AssertionError(f"La tarjeta v2 no tiene exactamente dos acciones: {rel}")
    if not re.search(r'data-iris-card-status[^>]*role=["\']status["\'][^>]*aria-live=["\']polite["\']', card, re.I):
        raise AssertionError(f"La tarjeta v2 no tiene región de estado accesible: {rel}")
    if "Para mi cita" in card:
        raise AssertionError(f"Sigue el ejemplo genérico en {rel}")
    return card


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path("dist"))
    args = ap.parse_args()
    root = args.root.resolve()

    counts: dict[str, int] = {}
    variants = {"A": 0, "B": 0, "C": 0}
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
            new = add_runtime(new, rel)
            if new == text:
                raise AssertionError(f"La tarjeta no cambió: {rel}")
            vm = re.search(r'data-iris-picto-variant=["\']([ABC])["\']', new, re.I)
            if not vm:
                raise AssertionError(f"Tarjeta Iris sin variante A/B/C: {rel}")
            variants[vm.group(1).upper()] += 1
            path.write_text(new, encoding="utf-8")
            changed += 1
        counts[section] = len(pages)

    if changed != 420:
        raise AssertionError(f"Se esperaban 420 tarjetas convertidas; se cambiaron {changed}")
    if sum(variants.values()) != 420:
        raise AssertionError(f"Recuento de variantes inconsistente: {variants}")

    runtime = root / "assets/tarjetas-iris-static.js"
    if not runtime.is_file() or runtime.stat().st_size == 0:
        raise AssertionError("Falta el runtime de acciones de Tarjeta Iris v2")

    tool = root / "es/tarjetas-iris/index.html"
    tool_text = tool.read_text(encoding="utf-8")
    if '<form class="iris-panel"' not in tool_text:
        raise AssertionError("La herramienta personal Tarjetas Iris debe seguir siendo editable")

    print(json.dumps({
        "interior_cards": counts,
        "total": 420,
        "variants": variants,
        "kept_generated_content": True,
        "editable": False,
        "blocks_per_card": 3,
        "copy_action": True,
        "print_action": True,
        "status_initially_empty": True,
        "personal_tool_editable": True,
        "result": "accepted",
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
