#!/usr/bin/env python3
"""Aplica la auditoría editorial final de Señales/Relaciones a la fuente real.

Alcance deliberado:
- 187 Situaciones ES + 187 EN: retira bloques automáticos de señales/urgencias y relaciones diagnósticas.
- 185 Condiciones ES + 185 EN: no reescribe contenido; la auditoría posterior exige que no existan
  encabezados genéricos automáticos Señales/Signs o Relacionado/Related.
- 48 Vida diaria ES + 48 EN: retira la nube de relaciones de cada detalle y la taxonomía pública del índice.

No toca Tarjeta Iris, robots, canónicos, fuentes documentales ni el texto de los demás bloques.
"""
from __future__ import annotations

import argparse
import html
import re
from pathlib import Path

TAG_RE = re.compile(r"<[^>]+>")
H2_RE = re.compile(r"<h2\b[^>]*>(.*?)</h2>", re.I | re.S)
SECTION_TOKEN_RE = re.compile(r"<section\b[^>]*>|</section\s*>", re.I)
LEDE_RE = re.compile(r'(<p\b[^>]*class=["\'][^"\']*\blede\b[^"\']*["\'][^>]*>)(.*?)(</p>)', re.I | re.S)

SITUATION_HEADINGS_ES = {"Señales", "Señales de alerta", "Relacionado", "Puede estar relacionado con"}
SITUATION_HEADINGS_EN = {"Signs", "Warning signs", "Related", "May be related to"}
DAILY_HEADINGS_ES = {"Enlaza con", "Relacionado"}
# La fuente inglesa heredada usa "Links with" aunque la auditoría final normaliza el rótulo como "Links to".
DAILY_HEADINGS_EN = {"Links to", "Links with", "Related"}

LEDE_ES = "Cuarenta y ocho fichas prácticas. Cada una explica una situación real, qué se puede pedir y dónde consultar la fuente oficial."
LEDE_EN = "Forty-eight practical guides. Each one explains a real-life situation, what can be requested and where to check the official source."


def plain(fragment: str) -> str:
    return " ".join(html.unescape(TAG_RE.sub(" ", fragment)).split())


def section_spans(text: str):
    stack: list[tuple[int, str]] = []
    out: list[tuple[int, int, str, str]] = []
    for m in SECTION_TOKEN_RE.finditer(text):
        token = m.group(0)
        if token.lower().startswith("<section"):
            stack.append((m.start(), token))
        elif stack:
            start, opening = stack.pop()
            out.append((start, m.end(), opening, text[start:m.end()]))
    if stack:
        raise AssertionError("HTML con <section> sin cierre")
    return sorted(out)


def remove_sections_by_heading(text: str, headings: set[str]) -> tuple[str, list[str]]:
    remove: list[tuple[int, int, str]] = []
    for start, end, _opening, block in section_spans(text):
        m = H2_RE.search(block)
        if not m:
            continue
        heading = plain(m.group(1))
        if heading in headings:
            remove.append((start, end, heading))
    # Si hubiera un bloque coincidente dentro de otro coincidente, conservar solo el exterior.
    selected: list[tuple[int, int, str]] = []
    for item in remove:
        if any(a <= item[0] and item[1] <= b for a, b, _ in remove if (a, b) != (item[0], item[1])):
            continue
        selected.append(item)
    for start, end, _heading in sorted(selected, reverse=True):
        text = text[:start] + text[end:]
    return text, [h for _, _, h in selected]


def remove_concepts_box(text: str) -> tuple[str, int]:
    matches: list[tuple[int, int]] = []
    for start, end, opening, _block in section_spans(text):
        m = re.search(r'class=["\']([^"\']*)["\']', opening, re.I)
        classes = set(m.group(1).split()) if m else set()
        if "concepts-box" in classes:
            matches.append((start, end))
    for start, end in sorted(matches, reverse=True):
        text = text[:start] + text[end:]
    return text, len(matches)


def set_index_lede(text: str, value: str, label: str) -> str:
    matches = list(LEDE_RE.finditer(text))
    if not matches:
        raise AssertionError(f"Sin introducción .lede en {label}")
    # La portada de Vida diaria tiene una sola introducción principal; sustituimos la primera.
    m = matches[0]
    return text[:m.start()] + m.group(1) + value + m.group(3) + text[m.end():]


def detail_files(base: Path) -> list[Path]:
    return sorted(p for p in base.glob("*/index.html") if p.is_file())


def apply_collection(base: Path, expected: int, headings: set[str], label: str) -> tuple[int, int]:
    files = detail_files(base)
    if len(files) != expected:
        raise AssertionError(f"{label}: esperadas {expected} fichas; encontradas {len(files)}")
    changed = removed = 0
    for p in files:
        original = p.read_text(encoding="utf-8")
        text, headings_removed = remove_sections_by_heading(original, headings)
        removed += len(headings_removed)
        if text != original:
            p.write_text(text, encoding="utf-8")
            changed += 1
    return changed, removed


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = ap.parse_args()
    root = args.root.resolve()

    results = {}
    results["situaciones_es"] = apply_collection(root / "es/situaciones", 187, SITUATION_HEADINGS_ES, "Situaciones ES")
    results["situaciones_en"] = apply_collection(root / "en/situations", 187, SITUATION_HEADINGS_EN, "Situations EN")
    results["vida_es"] = apply_collection(root / "es/biblioteca", 48, DAILY_HEADINGS_ES, "Vida diaria ES")
    results["vida_en"] = apply_collection(root / "en/everyday-life", 48, DAILY_HEADINGS_EN, "Everyday life EN")

    for rel, lede, lang in [
        ("es/biblioteca/index.html", LEDE_ES, "ES"),
        ("en/everyday-life/index.html", LEDE_EN, "EN"),
    ]:
        p = root / rel
        original = p.read_text(encoding="utf-8")
        text = set_index_lede(original, lede, rel)
        text, boxes = remove_concepts_box(text)
        if text != original:
            p.write_text(text, encoding="utf-8")
        results[f"indice_{lang.lower()}"] = {"concepts_box_removed": boxes, "changed": text != original}

    print(results)


if __name__ == "__main__":
    main()
