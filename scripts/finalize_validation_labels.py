#!/usr/bin/env python3
"""Auditoría estructural de la salida pública: ningún estado editorial debe quedar en dist.

Primero cierra un rótulo con fecha que sobrevive en una plantilla histórica (Investigación).
Después recorre TODOS los archivos de texto publicados (.html, .json, .js, .css, .xml, .txt) y
falla si encuentra un estado, etiqueta, chip, atributo, clave JSON o fecha editorial destinados
al público. No cambia descripciones, fuentes, explicaciones ni la clasificación A/B/C/BP/SG.

Usos normales del vocabulario no se tocan ni se señalan: «revisión sistemática», «revisado por
pares», «peer-reviewed», «Revisión prevista», «tareas pendientes», variables `pending`, etc.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ESTADO = ROOT / "editorial" / "integration" / "2026-09-10" / "estado-integracion.json"

UPPER = re.compile(r"\b(?:REVISAD[OA]S?|REVIEWED|VALIDAD[OA]S?|VALIDATED|BORRADOR(?:ES)?|DRAFTS?|PENDIENTES?|EN REVISI[ÓO]N)\b")
PATTERNS = {
    "uppercase_status_token": UPPER,
    "ultima_revision_o_validacion": re.compile(r"[ÚU]ltima (?:revisi[óo]n|validaci[óo]n|revis[ãa]o|valida[çc][ãa]o)(?: editorial| del texto| de esta p[áa]gina| de este documento| desta p[áa]gina)?\s*:", re.I),
    "last_reviewed_or_validated": re.compile(r"\b(?:This page )?last (?:reviewed|validated)\s*:", re.I),
    "revision_editorial_label": re.compile(r"\b(?:Revisi[óo]n|Validaci[óo]n) editorial\s*:|\bEditorial (?:review|validation)\s*:|(?:revisi[óo]n|validaci[óo]n) editorial de este documento", re.I),
    "ficha_tecnica_estado": re.compile(r"<strong>\s*(?:Estado|Status|Revisi[óo]n|Validaci[óo]n|Review|Validation)\s*:\s*</strong>", re.I),
    "estado_texto": re.compile(r"\b(?:Estado|Status)\s*:\s*(?:borrador|draft|publicad[ao]|validad[ao]|revisad[ao]|generated)", re.I),
    "aviso_borrador": re.compile(r"P[áa]gina en borrador|Draft (?:page|entry)\.|borrador generado|generated draft|Borrador editorial|Editorial draft", re.I),
    "comprobacion_pendiente": re.compile(r"not yet verified|pendiente de comprobaci[óo]n|comprobaci[óo]n final (?:sigue |est[áa] )?pendiente|final (?:verification|check) is still pending|still needs to be checked before publication|citas pendientes de comprobaci[óo]n|citations awaiting checking|Pendiente de completar:|Still to complete:|siguen en noindex|stay noindex", re.I),
    "atributo_estado": re.compile(r"data-editorial-status="),
    "json_status": re.compile(r'"(?:status|estado)"\s*:\s*"(?:borrador|draft|revisad[oa]|reviewed|validad[oa]|validated|pending|pendiente|publicad[ao]|en revisi[óo]n)"', re.I),
    "encabezado_revision": re.compile(r"<h[1-6][^>]*>\s*(?:Revisi[óo]n|Review|Validaci[óo]n|Validation|Sources and review|Base documental y revisi[óo]n|Sources and validation|Base documental y validaci[óo]n|[ÚU]ltima revisi[óo]n del texto|[ÚU]ltima validaci[óo]n del texto)\s*</h[1-6]>", re.I),
    "chip_estado": re.compile(r'<span class="chip lil">\s*(?:BORRADOR|DRAFT|REVISAD[OA]|REVIEWED|VALIDAD[OA]|VALIDATED)\s*</span>', re.I),
    "tarjeta_con_estado": re.compile(r'<span class="meta">[^<]*·\s*(?:BORRADOR|DRAFT|REVISADA|REVIEWED|VALIDADA|VALIDATED)\s*</span>', re.I),
}
GRADE_PATTERNS = {
    "clasificacion_retirada_es": re.compile(r'data-grado="(?:A/B|B/C|D|sin grado)"'),
    "clasificacion_retirada_en": re.compile(r'<span class="chip alt">(?:Grade (?:A/B|B/C|D)|no grade)</span>'),
    "certeza_hibrida": re.compile(r'data-certeza="(?:A/B|B/C|D)\b'),
}
TEXT_SUFFIXES = {".html", ".json", ".xml", ".txt", ".js", ".css"}


def fix_research_labels(root: Path) -> int:
    p = root / "es/investigacion/index.html"
    if not p.is_file():
        return 0
    text = p.read_text(encoding="utf-8")
    new, n = re.subn(r'revision: "(?:[ÚU]ltima revisi[óo]n de esta p[áa]gina|This page last reviewed|[ÚU]ltima revis[ãa]o desta p[áa]gina|[ÚU]ltima validaci[óo]n de esta p[áa]gina|This page last validated): [^"·]*· (\d+ (?:publicaciones|publications|publica[çc][õo]es)\.)"', r'revision: "\1"', text)
    if new != text:
        p.write_text(new, encoding="utf-8")
    return n


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path("dist"))
    args = parser.parse_args()
    root = args.root.resolve()

    research_labels = fix_research_labels(root)

    patterns = dict(PATTERNS)
    grades_integrated = ESTADO.is_file() and "condiciones_185" in json.loads(ESTADO.read_text(encoding="utf-8"))
    if grades_integrated:
        patterns.update(GRADE_PATTERNS)

    hits: list[tuple[str, str, str]] = []
    counts = {name: 0 for name in patterns}
    scanned = html_pages = 0
    for path in sorted(root.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in TEXT_SUFFIXES:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        scanned += 1
        html_pages += path.suffix.lower() == ".html"
        rel = path.relative_to(root).as_posix()
        for name, rx in patterns.items():
            for m in rx.finditer(text):
                counts[name] += 1
                if len(hits) < 80:
                    start = max(0, m.start() - 60)
                    hits.append((name, rel, text[start:m.end() + 60].replace("\n", " ")))
    report = {
        "public_text_files_scanned": scanned,
        "public_html_pages_scanned": html_pages,
        "research_review_labels_closed": research_labels,
        "grade_patterns_checked": grades_integrated,
        "public_status_markers_found": sum(counts.values()),
        "by_pattern": {k: v for k, v in counts.items() if v},
        "note": "0 marcadores = ningún estado editorial (BORRADOR, REVISADO, VALIDADO, fechas de revisión/validación) en la salida pública.",
    }
    out = root / "reports"
    if hits:
        print(json.dumps(report, ensure_ascii=False, indent=2))
        for name, rel, ctx in hits:
            print(f"  [{name}] {rel}: …{ctx}…", file=sys.stderr)
        raise AssertionError(f"Quedan {sum(counts.values())} marcadores de estado editorial en la salida pública")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
