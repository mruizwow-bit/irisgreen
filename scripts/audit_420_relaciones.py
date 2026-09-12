#!/usr/bin/env python3
"""Prueba de aceptación de la auditoría final de Señales/Relaciones."""
from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path

TAG_RE = re.compile(r"<[^>]+>")
LABEL_RE = re.compile(r"<(?:h2|h3|summary)\b[^>]*>(.*?)</(?:h2|h3|summary)>", re.I | re.S)
CONCEPTS_BOX_RE = re.compile(r'<section\b[^>]*class=["\'][^"\']*\bconcepts-box\b[^"\']*["\'][^>]*>', re.I)

SIT_ES_FORBIDDEN = {"Señales", "Señales de alerta", "Relacionado", "Puede estar relacionado con"}
SIT_EN_FORBIDDEN = {"Signs", "Warning signs", "Related", "May be related to"}
COND_ES_FORBIDDEN = {"Señales", "Relacionado"}
COND_EN_FORBIDDEN = {"Signs", "Related"}
DAILY_ES_FORBIDDEN = {"Enlaza con", "Relacionado"}
DAILY_EN_FORBIDDEN = {"Links to", "Links with", "Related"}

SIT_ES_REQUIRED = {"Qué conviene observar", "Qué puede ayudar ahora", "Cuándo pedir ayuda profesional"}
SIT_EN_REQUIRED = {"What to look at", "What may help now", "When to seek professional help"}

LEDE_ES = "Cuarenta y ocho fichas prácticas. Cada una explica una situación real, qué se puede pedir y dónde consultar la fuente oficial."
LEDE_EN = "Forty-eight practical guides. Each one explains a real-life situation, what can be requested and where to check the official source."


def plain(fragment: str) -> str:
    return " ".join(html.unescape(TAG_RE.sub(" ", fragment)).split())


def labels(text: str) -> set[str]:
    return {plain(m.group(1)) for m in LABEL_RE.finditer(text)}


def detail_files(base: Path) -> list[Path]:
    return sorted(p for p in base.glob("*/index.html") if p.is_file())


def check_collection(base: Path, expected: int, forbidden: set[str], required: set[str] | None, label: str):
    files = detail_files(base)
    assert len(files) == expected, f"{label}: {len(files)} fichas, se esperaban {expected}"
    failures = []
    for p in files:
        text = p.read_text(encoding="utf-8")
        page_labels = labels(text)
        bad = sorted(page_labels & forbidden)
        if bad:
            failures.append(f"{p}: rótulos prohibidos {bad}")
        if required:
            missing = sorted(required - page_labels)
            if missing:
                failures.append(f"{p}: faltan {missing}")
    if failures:
        raise AssertionError("\n".join(failures[:80]))
    return len(files)


def check_daily(base: Path, expected: int, forbidden: set[str], label: str):
    files = detail_files(base)
    assert len(files) == expected, f"{label}: {len(files)} fichas, se esperaban {expected}"
    failures = []
    for p in files:
        text = p.read_text(encoding="utf-8")
        bad = sorted(labels(text) & forbidden)
        if bad:
            failures.append(f"{p}: rótulos prohibidos {bad}")
        if re.search(r'<div\b[^>]*class=["\'][^"\']*\brelated\b', text, re.I):
            failures.append(f"{p}: queda div.related")
        if re.search(r'href=["\'][^"\']*#concept(?:o)?-', text, re.I):
            failures.append(f"{p}: queda enlace a #concepto/#concept")
    if failures:
        raise AssertionError("\n".join(failures[:80]))
    return len(files)


def check_index(path: Path, lede: str, old_phrase: str, label: str):
    text = path.read_text(encoding="utf-8")
    assert lede in text, f"{label}: falta introducción aprobada"
    assert not CONCEPTS_BOX_RE.search(text), f"{label}: sigue concepts-box público"
    assert old_phrase not in text, f"{label}: sigue promesa antigua de conceptos"
    assert "data-search=" in text, f"{label}: se perdió la búsqueda por metadatos de las fichas"
    return True


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path("dist"))
    args = ap.parse_args()
    root = args.root.resolve()

    report = {
        "situaciones_es": check_collection(root / "es/situaciones", 187, SIT_ES_FORBIDDEN, SIT_ES_REQUIRED, "Situaciones ES"),
        "situaciones_en": check_collection(root / "en/situations", 187, SIT_EN_FORBIDDEN, SIT_EN_REQUIRED, "Situations EN"),
        "condiciones_es": check_collection(root / "es/neurodiversidad/condiciones", 185, COND_ES_FORBIDDEN, None, "Condiciones ES"),
        "condiciones_en": check_collection(root / "en/neurodiversity/conditions", 185, COND_EN_FORBIDDEN, None, "Conditions EN"),
        "vida_es": check_daily(root / "es/biblioteca", 48, DAILY_ES_FORBIDDEN, "Vida diaria ES"),
        "vida_en": check_daily(root / "en/everyday-life", 48, DAILY_EN_FORBIDDEN, "Everyday life EN"),
    }
    check_index(root / "es/biblioteca/index.html", LEDE_ES, "Al final de cada ficha", "Índice Vida diaria ES")
    check_index(root / "en/everyday-life/index.html", LEDE_EN, "At the end of each", "Everyday life index EN")
    report["indexes"] = "ok"
    report["result"] = "accepted"
    print(json.dumps(report, ensure_ascii=False))


if __name__ == "__main__":
    main()
