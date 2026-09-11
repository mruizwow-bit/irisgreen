#!/usr/bin/env python3
"""Retira los últimos rótulos editoriales de dist y comprueba que no queda ninguno.

Solo actúa sobre estados públicos conocidos: fechas de revisión/validación, el bloque
editorial de la ficha de instrucciones y su copia en navigation-approved.js. Después
recorre toda la salida pública y falla si encuentra otro estado. No toca robots,
descripciones, fuentes ni grados A/B/C/BP/SG.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "reports" / "validation" / "labels.json"
TEXT_SUFFIXES = {".html", ".json", ".xml", ".txt", ".js", ".css"}

PATTERNS = {
    "uppercase_status_token": re.compile(r"\b(?:REVISAD[OA]S?|REVIEWED|VALIDAD[OA]S?|VALIDATED|BORRADOR(?:ES)?|DRAFTS?|PENDIENTES?|EN REVISI[ÓO]N)\b"),
    "ultima_revision_o_validacion": re.compile(r"[ÚU]ltima (?:revisi[óo]n|validaci[óo]n|revis[ãa]o|valida[çc][ãa]o)(?: editorial| del texto| de esta p[áa]gina| de este documento| desta p[áa]gina)?\s*:", re.I),
    "last_reviewed_or_validated": re.compile(r"\b(?:This page )?last (?:reviewed|validated)\s*:", re.I),
    "revision_editorial_label": re.compile(r"\b(?:Revisi[óo]n|Validaci[óo]n) editorial\s*:|\bEditorial (?:review|validation)\s*:|(?:revisi[óo]n|validaci[óo]n) editorial de este documento", re.I),
    "ficha_tecnica_estado": re.compile(r"<strong>\s*(?:Estado|Status|Revisi[óo]n|Validaci[óo]n|Review|Validation)\s*:\s*</strong>", re.I),
    "estado_texto": re.compile(r"\b(?:Estado|Status)\s*:\s*(?:borrador|draft|publicad[ao]|validad[ao]|revisad[ao]|generated)", re.I),
    "aviso_borrador": re.compile(r"P[áa]gina en borrador|Draft (?:page|entry)\.|borrador generado|generated draft|Borrador editorial|Editorial draft", re.I),
    "comprobacion_pendiente": re.compile(r"not yet verified|pendiente de comprobaci[óo]n|comprobaci[óo]n final (?:sigue |est[áa] )?pendiente|final (?:verification|check) is still pending|still needs to be checked before publication|citas pendientes de comprobaci[óo]n|citations awaiting checking|siguen en noindex|stay noindex", re.I),
    "atributo_estado": re.compile(r"data-editorial-status="),
    "json_status": re.compile(r'"(?:status|estado)"\s*:\s*"(?:borrador|draft|revisad[oa]|reviewed|validad[oa]|validated|pending|pendiente|publicad[ao]|en revisi[óo]n)"', re.I),
    "encabezado_revision": re.compile(r"<h[1-6][^>]*>\s*(?:Revisi[óo]n|Review|Validaci[óo]n|Validation|Sources and review|Base documental y revisi[óo]n|Sources and validation|Base documental y validaci[óo]n|[ÚU]ltima revisi[óo]n del texto|[ÚU]ltima validaci[óo]n del texto)\s*</h[1-6]>", re.I),
    "chip_estado": re.compile(r'<span class="chip lil">\s*(?:BORRADOR|DRAFT|REVISAD[OA]|REVIEWED|VALIDAD[OA]|VALIDATED)\s*</span>', re.I),
    "tarjeta_con_estado": re.compile(r'<span class="meta">[^<]*·\s*(?:BORRADOR|DRAFT|REVISADA|REVIEWED|VALIDADA|VALIDATED)\s*</span>', re.I),
}


def write(path: Path, before: str, after: str) -> bool:
    if before == after:
        return False
    path.write_text(after, encoding="utf-8")
    return True


def clean_known(root: Path) -> dict[str, int]:
    fixed: dict[str, int] = {}

    # Investigación: el rótulo antiguo sobrevive en una cadena del propio índice.
    p = root / "es/investigacion/index.html"
    if p.is_file():
        before = p.read_text(encoding="utf-8")
        after, n = re.subn(
            r'revision: "(?:[ÚU]ltima revisi[óo]n de esta p[áa]gina|This page last reviewed|[ÚU]ltima revis[ãa]o desta p[áa]gina|[ÚU]ltima validaci[óo]n de esta p[áa]gina|This page last validated): [^"·]*· (\d+ (?:publicaciones|publications|publica[çc][õo]es)\.)"',
            r'revision: "\1"', before)
        if write(p, before, after):
            fixed["investigacion"] = n

    # Cuestionarios: incluye la copia sin JavaScript, no solo la vista dinámica.
    p = root / "es/cuestionarios/index.html"
    if p.is_file():
        before = p.read_text(encoding="utf-8")
        after, n1 = re.subn(r'\s*<p\b[^>]*>\s*(?:Última revisión|Última validación): [^<]*</p>', '', before)
        after, n2 = re.subn(r'\s*"(?:Última revisión|Última validación): [^"]*"\s*:\s*"(?:Last reviewed|Last validated): [^"]*"\s*,?', '', after)
        if write(p, before, after):
            fixed["cuestionarios"] = n1 + n2

    # La ficha de instrucciones aprobada tiene una presentación propia. Se quitan
    # únicamente el estado y su fecha; F13 y el contenido de la ficha se conservan.
    specials = [
        ("es/situaciones/necesito-que-me-repitan-las-instrucciones/index.html", "es"),
        ("en/situations/i-need-instructions-repeated/index.html", "en"),
    ]
    for rel, lang in specials:
        p = root / rel
        if not p.is_file():
            continue
        before = after = p.read_text(encoding="utf-8")
        if lang == "es":
            after, n1 = re.subn(r'<p class="source-meta">La ficha fuente indica revisión editorial[^<]*</p>', '', after)
            after, n2 = re.subn(r'<section class="original-section"><h3>Revisión editorial</h3><p>Revisión editorial:[^<]*</p></section>', '', after)
            after = after.replace('<h3>Base documental y revisión</h3>', '<h3>Base documental</h3>')
        else:
            after, n1 = re.subn(r'<p class="source-meta">The source entry states an editorial review[^<]*</p>', '', after)
            after, n2 = re.subn(r'<section class="original-section"><h3>Editorial review</h3><p>Editorial review:[^<]*</p></section>', '', after)
            after = after.replace('<h3>Sources and review</h3>', '<h3>Sources</h3>')
        if write(p, before, after):
            fixed[rel] = n1 + n2

    # La misma ficha vive como datos de navegación. Se retira el estado de esa copia
    # pública sin cambiar ni la referencia ASHA ni el resto del texto.
    p = root / "assets/navigation-approved.js"
    if p.is_file():
        before = after = p.read_text(encoding="utf-8")
        after = after.replace('["Base documental y validación", "F13 · ASHA · Augmentative and Alternative Communication"], ["Validación editorial", "Validación editorial: 10 de septiembre de 2026. Las fuentes citadas y los límites de la ficha permanecen identificados para facilitar su comprobación y actualización."]', '["Base documental", "F13 · ASHA · Augmentative and Alternative Communication"]')
        after = after.replace('["Sources and validation", "F13 · ASHA · Augmentative and Alternative Communication"], ["Editorial validation", "Editorial validation: 10 September 2026. The cited sources and the limits of the entry remain identified to support checking and future updates."]', '["Sources", "F13 · ASHA · Augmentative and Alternative Communication"]')
        after = after.replace('"sourceState":"La ficha está validada editorialmente para esta edición. Este cambio de presentación no añade una validación clínica."', '"sourceState":""')
        after = after.replace('"sourceState":"The entry is editorially validated for this edition. This presentation change does not add clinical validation."', '"sourceState":""')
        if write(p, before, after):
            fixed["navigation-approved.js"] = 1

    return fixed


def scan(root: Path) -> tuple[dict[str, int], list[tuple[str, str, str]], int, int]:
    counts = {name: 0 for name in PATTERNS}
    hits: list[tuple[str, str, str]] = []
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
        for name, rx in PATTERNS.items():
            for m in rx.finditer(text):
                counts[name] += 1
                if len(hits) < 100:
                    start = max(0, m.start() - 60)
                    hits.append((name, rel, text[start:m.end() + 60].replace("\n", " ")))
    return counts, hits, scanned, html_pages


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path("dist"))
    args = ap.parse_args()
    root = args.root.resolve()

    fixed = clean_known(root)
    counts, hits, scanned, html_pages = scan(root)
    remaining = sum(counts.values())
    report = {
        "public_text_files_scanned": scanned,
        "public_html_pages_scanned": html_pages,
        "known_status_blocks_removed": fixed,
        "public_status_markers_found": remaining,
        "by_pattern": {k: v for k, v in counts.items() if v},
        "note": "0 marcadores = ningún estado editorial público; robots no se modifica aquí.",
    }
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if hits:
        for name, rel, ctx in hits:
            print(f"  [{name}] {rel}: …{ctx}…", file=sys.stderr)
    if remaining:
        raise AssertionError(f"Quedan {remaining} marcadores de estado editorial en la salida pública")


if __name__ == "__main__":
    main()
