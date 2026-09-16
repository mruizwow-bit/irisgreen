#!/usr/bin/env python3
"""Convierte las Tarjetas Iris interiores en Tarjeta Iris v2 estática.

`connect_tarjetas_iris.py` prepara el contenido de cada tarjeta a partir de su
ficha. Este paso conserva esos tres bloques, retira la edición, deja la tarjeta
sin apoyos (data-iris-apoyos="0") cuando no existe una asignación pictográfica
editorial y añade las dos acciones de v2: copiar e imprimir. La herramienta
personal canónica ``/es/recursos/tarjeta-iris/`` continúa siendo editable; la
ruta antigua ``/es/tarjetas-iris/`` es solo un puente de compatibilidad.

Desde el 15 de septiembre de 2026 el número de tarjetas no está fijado a 420:
las fichas en borrador y las que todavía no dicen qué ayuda no generan tarjeta.
Este paso cuenta lo que hay y comprueba además que «Necesito» no repite
«Me ayuda» en ninguna tarjeta publicada.
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
BLOCK_RE = re.compile(
    r'<section class="iris-mini-block(?: [^"]*)?">\s*<h3>(?P<head>[^<]+)</h3>\s*(?P<body>.*?)</section>',
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
    anchors = (
        re.search(r'<p\b[^>]*\bclass=["\'][^"\']*\biris-mini-picto-credit\b[^"\']*["\'][^>]*>', body, re.I),
        re.search(r'<footer\b[^>]*\bclass=["\'][^"\']*\biris-mini-foot\b[^"\']*["\'][^>]*>', body, re.I),
    )
    anchor = next((m for m in anchors if m), None)
    if not anchor:
        raise AssertionError(f"Tarjeta Iris sin pie para acciones v2: {rel}")
    return body[:anchor.start()] + ACTIONS + body[anchor.start():]


def plain(fragment: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", fragment)).strip()


def check_blocks(body: str, rel: str) -> None:
    blocks = {m.group("head").strip(): plain(m.group("body")) for m in BLOCK_RE.finditer(body)}
    if len(blocks) != 3:
        raise AssertionError(f"Tarjeta Iris interior sin tres bloques con título: {rel}")
    ayuda = blocks.get("Me ayuda", "").casefold()
    necesito = blocks.get("Necesito", "").casefold()
    if not ayuda or not necesito:
        raise AssertionError(f"Tarjeta Iris sin «Me ayuda» o sin «Necesito»: {rel}")
    if ayuda in necesito or necesito in ayuda:
        raise AssertionError(f"«Necesito» repite «Me ayuda» en {rel}")


def make_static(match: re.Match[str], rel: str) -> str:
    attrs = match.group("attrs")
    body = match.group("body")

    if 'data-iris-card-cta="true"' not in attrs:
        raise AssertionError(f"Tarjeta Iris interior sin marcador: {rel}")
    if len(re.findall(r'class=["\'][^"\']*\biris-mini-block\b', body, re.I)) != 3:
        raise AssertionError(f"Tarjeta Iris interior sin tres bloques: {rel}")
    check_blocks(body, rel)
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
    if 'data-iris-apoyos=' not in attrs:
        attrs += ' data-iris-apoyos="0"'
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
    supports = {"0": 0, "1": 0, "2": 0}
    changed = 0
    without_card: list[str] = []
    for section, pattern, expected in DETAIL_SETS:
        pages = sorted(p for p in root.glob(pattern) if p.is_file())
        if len(pages) != expected:
            raise AssertionError(f"{section}: esperadas {expected} fichas; encontradas {len(pages)}")
        made = 0
        for path in pages:
            rel = path.relative_to(root).as_posix()
            text = path.read_text(encoding="utf-8")
            matches = list(CARD_RE.finditer(text))
            if not matches:
                without_card.append(rel)
                continue
            if len(matches) != 1:
                raise AssertionError(f"Tarjeta Iris interior duplicada: {rel}")
            new = CARD_RE.sub(lambda m: make_static(m, rel), text, count=1)
            new = add_runtime(new, rel)
            if new == text:
                raise AssertionError(f"La tarjeta no cambió: {rel}")
            sm = re.search(r'data-iris-apoyos=["\']([012])["\']', new, re.I)
            if not sm:
                raise AssertionError(f"Tarjeta Iris sin número de apoyos: {rel}")
            supports[sm.group(1)] += 1
            path.write_text(new, encoding="utf-8")
            changed += 1
            made += 1
        counts[section] = made

    if changed == 0:
        raise AssertionError("No se ha convertido ninguna Tarjeta Iris")
    if sum(supports.values()) != changed:
        raise AssertionError(f"Recuento de apoyos inconsistente: {supports}")

    runtime = root / "assets/tarjetas-iris-static.js"
    if not runtime.is_file() or runtime.stat().st_size == 0:
        raise AssertionError("Falta el runtime de acciones de Tarjeta Iris v2")

    tool = root / "es/recursos/tarjeta-iris/index.html"
    if not tool.is_file():
        raise FileNotFoundError(tool)
    tool_text = tool.read_text(encoding="utf-8")
    editable_markers = (
        'id="ti-cuesta"',
        'id="ti-ayuda"',
        'id="ti-necesito"',
        'id="ti-reset"',
        'id="ti-copy"',
    )
    if tool_text.count("<textarea") != 3 or any(marker not in tool_text for marker in editable_markers):
        raise AssertionError("La herramienta personal Tarjeta Iris canónica debe seguir siendo editable")

    print(json.dumps({
        "interior_cards": counts,
        "total": changed,
        "supports": supports,
        "pages_without_card": len(without_card),
        "pages_without_card_examples": without_card[:5],
        "kept_generated_content": True,
        "editable": False,
        "blocks_per_card": 3,
        "necesito_equals_ayuda": 0,
        "copy_action": True,
        "print_action": True,
        "status_initially_empty": True,
        "personal_tool_editable": True,
        "personal_tool_route": "/es/recursos/tarjeta-iris/",
        "result": "accepted",
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
