#!/usr/bin/env python3
from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SCOPES = {
    "situaciones_es": ROOT / "es/situaciones",
    "situaciones_en": ROOT / "en/situations",
    "condiciones_es": ROOT / "es/neurodiversidad/condiciones",
    "condiciones_en": ROOT / "en/neurodiversity/conditions",
    "vida_es": ROOT / "es/biblioteca",
    "vida_en": ROOT / "en/everyday-life",
}

TARGETS = {
    "Señales", "Señales de alerta", "Relacionado", "Puede estar relacionado con", "Enlaza con",
    "Signs", "Warning signs", "Related", "May be related to", "Links to",
}

TAG_RE = re.compile(r"<[^>]+>")
H2_RE = re.compile(r"<h2\b[^>]*>(.*?)</h2>", re.I | re.S)
CHIP_RE = re.compile(r"<span\b[^>]*class=[\"'][^\"']*\bchip\b[^\"']*[\"'][^>]*>(.*?)</span>", re.I | re.S)
SECTION_TOKEN_RE = re.compile(r"<section\b[^>]*>|</section\s*>", re.I)


def plain(fragment: str) -> str:
    return " ".join(html.unescape(TAG_RE.sub(" ", fragment)).split())


def section_spans(text: str):
    stack = []
    out = []
    for m in SECTION_TOKEN_RE.finditer(text):
        if m.group(0).lower().startswith("<section"):
            stack.append(m.start())
        elif stack:
            start = stack.pop()
            out.append((start, m.end(), text[start:m.end()]))
    return sorted(out)


def headings(text: str):
    result = []
    for start, end, block in section_spans(text):
        m = H2_RE.search(block)
        if not m:
            continue
        heading = plain(m.group(1))
        if heading in TARGETS:
            result.append((heading, start, end, plain(block)))
    return result


def detail_files(base: Path):
    if not base.is_dir():
        return []
    return sorted(p for p in base.glob("*/index.html") if p.is_file())


def condition_type(text: str) -> str:
    chips = [plain(m.group(1)) for m in CHIP_RE.finditer(text)]
    known = {
        "apoyo", "contexto", "controvertido", "desarrollo", "diagnóstico", "diagnostico",
        "emergente", "experiencia", "identidad", "proceso", "salud física", "salud fisica",
        "salud mental", "support", "context", "controversial", "development", "diagnosis",
        "emerging", "experience", "identity", "process", "physical health", "mental health",
    }
    for chip in chips[:8]:
        if chip.strip().lower() in known:
            return chip.strip()
    return chips[0].strip() if chips else ""


def rel(p: Path) -> str:
    return p.relative_to(ROOT).as_posix()


def main():
    report = {"counts": {}, "warnings": [], "condition_signs": [], "daily_relations": []}
    situation_matches = []
    for name, base in SCOPES.items():
        files = detail_files(base)
        report["counts"][name] = {"detail_files": len(files), "matches": 0}
        for p in files:
            text = p.read_text(encoding="utf-8")
            found = headings(text)
            report["counts"][name]["matches"] += len(found)
            ctype = condition_type(text) if name.startswith("condiciones") else ""
            for heading, _s, _e, body in found:
                if name.startswith("situaciones"):
                    situation_matches.append({"path": rel(p), "heading": heading})
                if heading in {"Señales de alerta", "Warning signs"}:
                    report["warnings"].append({"path": rel(p), "heading": heading, "text": body[:900]})
                if name.startswith("condiciones") and heading in {"Señales", "Signs"}:
                    report["condition_signs"].append({"path": rel(p), "type": ctype, "heading": heading, "text": body[:500]})
                if name.startswith("vida") and heading in {"Enlaza con", "Links to", "Relacionado", "Related"}:
                    report["daily_relations"].append({"path": rel(p), "heading": heading})

    for lang, idx in [("es", ROOT / "es/biblioteca/index.html"), ("en", ROOT / "en/everyday-life/index.html")]:
        if idx.is_file():
            text = idx.read_text(encoding="utf-8")
            report[f"daily_index_{lang}"] = {
                "concepts_box": "concepts-box" in text or "concept-list" in text,
                "concept_anchor_count": text.count("#concepto-"),
                "mentions_end_concepts": ("Al final de cada ficha" in text) if lang == "es" else ("At the end of each" in text),
            }

    print("COUNTS " + json.dumps(report["counts"], ensure_ascii=False, sort_keys=True))
    print("DAILY_INDEX_ES " + json.dumps(report.get("daily_index_es", {}), ensure_ascii=False, sort_keys=True))
    print("DAILY_INDEX_EN " + json.dumps(report.get("daily_index_en", {}), ensure_ascii=False, sort_keys=True))
    print("CONDITION_SIGNS " + json.dumps(report["condition_signs"], ensure_ascii=False))
    print("SITUATION_MATCHES")
    for row in situation_matches:
        print(f"{row['path']}\t{row['heading']}")
    print("WARNINGS")
    for row in report["warnings"]:
        print(f"{row['path']}\t{row['heading']}\t{row['text']}")


if __name__ == "__main__":
    main()
