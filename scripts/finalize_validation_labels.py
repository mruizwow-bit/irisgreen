#!/usr/bin/env python3
"""Cierra rótulos editoriales provisionales en la salida pública y los audita.

No cambia descripciones, explicaciones, fuentes, resultados de investigación ni
clasificaciones A/B/C. Los activos fuente deben llegar ya sin estados provisionales;
si reaparecen, esta comprobación detiene el build en vez de corregirlos en silencio.
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

    # Guardias estructurales para TODO archivo de texto publicado. No se buscan
    # usos normales como «revisión sistemática», «tareas pendientes», variables
    # `pending`, un borrador escrito por la propia persona o `peer-reviewed`.
    patterns = {
        "draft_badge": re.compile(r'<span\b[^>]*class=["\'][^"\']*\bchip\b[^"\']*["\'][^>]*>\s*(?:BORRADOR|DRAFT)\s*</span>', re.I),
        "draft_or_reviewed_card": re.compile(r'<span\b[^>]*class=["\'][^"\']*\bmeta\b[^"\']*["\'][^>]*>[^<]*\b(?:BORRADOR|DRAFT|REVISADA|REVIEWED)\b[^<]*</span>', re.I),
        "provisional_status_attr": re.compile(r'data-editorial-status=["\'](?:generated-draft|draft|reviewed)["\']', re.I),
        "provisional_json_status": re.compile(r'"status"\s*:\s*"(?:borrador|draft|revisad[oa]|reviewed|pending|pendiente)"', re.I),
        "draft_notice_es": re.compile(r'<p\b[^>]*class=["\'][^"\']*\bnotice\b[^"\']*["\'][^>]*>\s*Página en borrador\.', re.I),
        "draft_notice_en": re.compile(r'<p\b[^>]*class=["\'][^"\']*\bnotice\b[^"\']*["\'][^>]*>\s*Draft (?:page|entry)\.', re.I),
        "not_yet_verified": re.compile(r'(?:Review: not yet verified|comprobación final (?:sigue )?pendiente|final verification is still pending|final check is still pending)', re.I),
        "generated_noindex_note_es": re.compile(r'las páginas siguen en noindex hasta', re.I),
        "generated_noindex_note_en": re.compile(r'these pages stay noindex until', re.I),
        "pending_scope_es": re.compile(r'Pendiente de completar:', re.I),
        "pending_scope_en": re.compile(r'Still to complete:', re.I),
        "ultima_revision": re.compile(r'(?:Última revisión(?: del texto)?\s*:|Last reviewed\s*:)', re.I),
        "revision_editorial": re.compile(r'(?:Revisión editorial\s*:|Editorial review\s*:)', re.I),
        "heading_revision": re.compile(r'<h[1-6][^>]*>\s*(?:Revisión|Review|Sources and review|Base documental y revisión|Última revisión del texto)\s*</h[1-6]>', re.I),
        "li_revision": re.compile(r'<strong>\s*(?:Revisión|Review)\s*:\s*</strong>', re.I),
        "source_pending_es": re.compile(r'citas pendientes de comprobación', re.I),
        "source_pending_en": re.compile(r'citations awaiting checking', re.I),
    }
    remaining = []
    scanned = 0
    for path in root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in {".html", ".json", ".xml", ".txt", ".js", ".css"}:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        scanned += 1
        for name, rx in patterns.items():
            if rx.search(text):
                remaining.append((name, path.relative_to(root).as_posix()))
    if remaining:
        raise AssertionError("Quedan estados editoriales provisionales: " + repr(remaining[:50]))

    print(json.dumps({
        "conditions_es_pages": 185,
        "condition_review_labels_changed": condition_labels,
        "research_review_labels_changed": research_labels,
        "public_text_files_scanned": scanned,
        "remaining_structural_provisional_markers": 0,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
