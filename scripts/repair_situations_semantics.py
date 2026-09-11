#!/usr/bin/env python3
"""Aplica únicamente correcciones semánticas revisadas de Situaciones.

Los títulos y las descripciones del lote 420 están fuera de alcance. Cada cambio debe
estar registrado de forma literal en editorial/reviews/situaciones-semantica-2026-09-11.json,
con sus fuentes y su motivo. El script es idempotente y falla ante cualquier texto
inesperado para impedir sustituciones por proximidad o mezcla entre fichas.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
DATA = REPO / "editorial/reviews/situaciones-semantica-2026-09-11.json"


def replace_once_or_done(text: str, old: str, new: str, label: str, check: bool) -> tuple[str, bool]:
    old_n = text.count(old)
    new_n = text.count(new)
    if check:
        if old_n:
            raise AssertionError(f"Corrección pendiente en {label}: {old[:100]!r}")
        if new_n != 1:
            raise AssertionError(f"Texto revisado ausente o duplicado en {label}: {new[:100]!r}")
        return text, False
    if old_n == 1 and new_n == 0:
        return text.replace(old, new), True
    if old_n == 0 and new_n == 1:
        return text, False
    raise AssertionError(
        f"Estado inesperado en {label}: old={old_n}, new={new_n}; no se hace ninguna sustitución"
    )


def run(root: Path, check: bool = False) -> dict:
    data = json.loads(DATA.read_text(encoding="utf-8"))
    changed_files: list[str] = []
    checked_files: list[str] = []
    replacements = 0

    for entry in data["entries"]:
        for lang in ("es", "en"):
            rel = entry[f"{lang}_path"]
            path = root / rel
            if not path.is_file():
                raise FileNotFoundError(path)
            text = path.read_text(encoding="utf-8")
            original = text
            for pair in entry["replacements"][lang]:
                text, changed = replace_once_or_done(
                    text, pair["old"], pair["new"], f"{entry['id']}:{lang}:{rel}", check
                )
                replacements += int(changed)
            if not check and text != original:
                path.write_text(text, encoding="utf-8")
                changed_files.append(rel)
            checked_files.append(rel)

    result = {
        "mode": "check" if check else "apply",
        "review_date": data["review_date"],
        "entries": len(data["entries"]),
        "checked_files": checked_files,
        "changed_files": changed_files,
        "replacements_applied": replacements,
        "titles_and_420_descriptions_changed": False,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return result


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=REPO)
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()
    run(args.root, args.check)
