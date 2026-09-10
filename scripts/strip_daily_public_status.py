#!/usr/bin/env python3
"""Retira estados editoriales visibles de Vida diaria en la salida pública.

Se ejecuta al final del build, después de cualquier publicador o validador que todavía
use estados internos. No cambia títulos, descripciones, fuentes, enlaces ni contenido.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

STATUS_KEYS = {"status", "reviewed", "reviewedBy"}


def clean_index(path: Path, lang: str) -> int:
    text = path.read_text(encoding="utf-8")
    before = text
    if lang == "es":
        text = re.sub(
            r'(<span class="meta">\s*\d+\s+fuentes?)(?:\s*·\s*(?:BORRADOR|REVISADA|VALIDADA))?\s*</span>',
            r'\1</span>',
            text,
            flags=re.I,
        )
    else:
        text = re.sub(
            r'(<span class="meta">\s*\d+\s+sources?)(?:\s*·\s*(?:DRAFT|REVIEWED|VALIDATED))?\s*</span>',
            r'\1</span>',
            text,
            flags=re.I,
        )
    if text != before:
        path.write_text(text, encoding="utf-8")
        return 1
    return 0


def clean_detail(path: Path, lang: str) -> int:
    text = path.read_text(encoding="utf-8")
    before = text
    if lang == "es":
        text = re.sub(
            r'<span class="chip lil">\s*(?:BORRADOR|REVISADA|VALIDADA)\s*</span>',
            "",
            text,
            flags=re.I,
        )
        text = re.sub(
            r'<p class="notice">\s*(?:Página en borrador\.|Validada para publicación)[^<]*</p>',
            "",
            text,
            flags=re.I,
        )
        text = re.sub(
            r'<li><strong>\s*(?:Estado|Validación|Revisión)\s*:</strong>[^<]*(?:</li>)',
            "",
            text,
            flags=re.I,
        )
    else:
        text = re.sub(
            r'<span class="chip lil">\s*(?:DRAFT|REVIEWED|VALIDATED)\s*</span>',
            "",
            text,
            flags=re.I,
        )
        text = re.sub(
            r'<p class="notice">\s*(?:Draft (?:page|entry)\.|Validated for publication)[^<]*</p>',
            "",
            text,
            flags=re.I,
        )
        text = re.sub(
            r'<li><strong>\s*(?:Status|Validation|Review)\s*:</strong>[^<]*(?:</li>)',
            "",
            text,
            flags=re.I,
        )
    if text != before:
        path.write_text(text, encoding="utf-8")
        return 1
    return 0


def strip_json_metadata(path: Path) -> int:
    data = json.loads(path.read_text(encoding="utf-8"))
    changed = 0

    def walk(value):
        nonlocal changed
        if isinstance(value, dict):
            for key in list(value):
                if key in STATUS_KEYS:
                    value.pop(key)
                    changed += 1
                else:
                    walk(value[key])
        elif isinstance(value, list):
            for item in value:
                walk(item)

    walk(data)
    if changed:
        path.write_text(
            json.dumps(data, ensure_ascii=False, indent=1) + "\n",
            encoding="utf-8",
        )
    return changed


def assert_clean(root: Path) -> None:
    checks = [
        (
            re.compile(
                r'<span\b[^>]*class="[^"]*(?:chip|meta)[^"]*"[^>]*>[^<]*\b'
                r'(?:BORRADOR|DRAFT|REVISADA|REVIEWED|VALIDADA|VALIDATED)\b',
                re.I,
            ),
            "badge/card status",
        ),
        (
            re.compile(
                r'<strong>\s*(?:Estado|Status|Validación|Validation|Revisión|Review)\s*:',
                re.I,
            ),
            "status metadata",
        ),
    ]
    problems = []
    for base in [root / "es/biblioteca", root / "en/everyday-life"]:
        for path in base.rglob("*.html"):
            text = path.read_text(encoding="utf-8")
            for rh, label in checks:
                if rx.search(text):
                    problems.append(f"{path.relative_to(root)}: {label}")
    for rel in ["es/biblioteca/vida-diaria.json", "en/everyday-life/everyday-life.json"]:
        path = root / rel
        if path.is_file():
            data = json.loads(path.read_text(encoding="utf-8"))
            stack = [data]
            while stack:
                value = stack.pop()
                if isinstance(value, dict):
                    bad = STATUS_KEYS.intersection(value)
                    if bad:
                        problems.append(f"{rel}: keys {sorted(bad)}")
                    stack.extend(value.values())
                elif isinstance(value, list):
                    stack.extend(value)
    if problems:
        raise AssertionError("Vida diaria conserva estados editoriales públicos: " + repr(problems[:30]))


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path("dist"))
    args = parser.parse_args()
    root = args.root.resolve()

    changed_indexes = 0
    changed_pages = 0
    removed_json_keys = 0

    for rel, lang in [
        ("es/biblioteca/index.html", "es"),
        ("en/everyday-life/index.html", "en"),
    ]:
        path = root / rel
        if path.is_file():
            changed_indexes += clean_index(path, lang)

    for base, lang in [
        (root / "es/biblioteca", "es"),
        (root / "en/everyday-life", "en"),
    ]:
        if base.is_dir():
            for path in sorted(base.glob("*/index.html")):
                changed_pages += clean_detail(path, lang)

    for rel in [
        "es/biblioteca/vida-diaria.json",
        "en/everyday-life/everyday-life.json",
    ]:
        path = root / rel
        if path.is_file():
            removed_json_keys += strip_json_metadata(path)

    assert_clean(root)
    print(json.dumps({
        "daily_indexes_cleaned": changed_indexes,
        "daily_detail_pages_cleaned": changed_pages,
        "daily_json_editorial_keys_removed": removed_json_keys,
        "public_daily_status_markers_remaining": 0,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
