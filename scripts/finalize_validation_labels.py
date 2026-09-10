#!/usr/bin/env python3
"""Sustituye únicamente rótulos editoriales antiguos de revisión por validación.

No cambia descripciones, explicaciones, fuentes, resultados de investigación ni
clasificaciones A/B/C. Se ejecuta sobre ``dist`` al final del build.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

DATE_ES = "10 de septiembre de 2026"
DATE_EN = "10 September 2026"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path("dist"))
    args = parser.parse_args()
    root = args.root.resolve()

    cond = sorted(p for p in root.glob("es/neurodiversidad/condiciones/*/index.html") if p.is_file())
    if len(cond) != 185:
        raise AssertionError(f"Se esperaban 185 Condiciones ES y hay {len(cond)}")

    condition_labels = 0
    for path in cond:
        text = path.read_text(encoding="utf-8")
        new = text.replace("<h2>Última revisión del texto</h2>", "<h2>Última validación del texto</h2>")
        if new != text:
            condition_labels += 1
            path.write_text(new, encoding="utf-8")
    if condition_labels not in (0, 183):
        raise AssertionError(f"Rótulos de Condiciones inesperados: {condition_labels}")

    research = root / "es/investigacion/index.html"
    text = research.read_text(encoding="utf-8")
    pairs = [
        (
            'revision: "Última revisión de esta página: 1 de septiembre de 2026 · 120 publicaciones."',
            f'revision: "Última validación de esta página: {DATE_ES} · 120 publicaciones."',
        ),
        (
            'revision: "This page last reviewed: 31 August 2026 · 120 publications."',
            f'revision: "This page last validated: {DATE_EN} · 120 publications."',
        ),
    ]
    research_labels = 0
    for old, new in pairs:
        if old in text:
            text = text.replace(old, new)
            research_labels += 1
        elif new not in text:
            raise AssertionError("No se encontró el rótulo esperado de Investigación")
    research.write_text(text, encoding="utf-8")

    # Solo buscamos rótulos de estado, no usos normales como "revisión sistemática".
    patterns = {
        "ultima_revision": re.compile(r"(?:Última revisión(?: del texto)?\s*:|Last reviewed\s*:)", re.I),
        "revision_editorial": re.compile(r"(?:Revisión editorial\s*:|Editorial review\s*:)", re.I),
        "heading_revision": re.compile(r"<h[1-6][^>]*>\s*(?:Revisión|Review|Sources and review|Base documental y revisión|Última revisión del texto)\s*</h[1-6]>", re.I),
        "li_revision": re.compile(r"<strong>\s*(?:Revisión|Review)\s*:\s*</strong>", re.I),
        "card_revisada": re.compile(r'<span class="meta">[^<]*\bREVISADA\b[^<]*</span>', re.I),
    }
    remaining = []
    for path in root.rglob("*.html"):
        text = path.read_text(errors="ignore")
        for name, rx in patterns.items():
            if rx.search(text):
                remaining.append((name, path.relative_to(root).as_posix()))
    if remaining:
        raise AssertionError("Quedan rótulos editoriales de revisión: " + repr(remaining[:50]))

    print(json.dumps({
        "conditions_es_pages": 185,
        "condition_review_labels_changed": condition_labels,
        "research_review_labels_changed": research_labels,
        "remaining_structural_review_labels": 0,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
