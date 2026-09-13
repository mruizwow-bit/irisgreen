#!/usr/bin/env python3
"""Da un nombre accesible estable a los buscadores de Investigación y Vídeos.

La interfaz usa el placeholder como ayuda visual, pero el control necesita además
un nombre accesible que no desaparezca al escribir. El cambio se aplica al
artefacto de publicación para no alterar el motor de plantillas.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

TARGETS = {
    "es/investigacion/index.html": "Buscar publicaciones",
    "es/videos/index.html": "Buscar vídeos",
}
NEEDLE = '<input class="ig-search-input" type="search"'


def patch(path: Path, label: str) -> bool:
    text = path.read_text(encoding="utf-8", errors="strict")
    matches = text.count(NEEDLE)
    if matches != 1:
        raise AssertionError(f"{path}: esperaba 1 buscador y encontré {matches}")

    replacement = f'{NEEDLE} aria-label="{label}"'
    if replacement in text:
        changed = False
    else:
        text = text.replace(NEEDLE, replacement, 1)
        path.write_text(text, encoding="utf-8")
        changed = True

    final = path.read_text(encoding="utf-8", errors="strict")
    if final.count(replacement) != 1:
        raise AssertionError(f"{path}: el buscador no conserva su nombre accesible")
    return changed


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path("dist"))
    args = ap.parse_args()
    root = args.root.resolve()

    changed = []
    for rel, label in TARGETS.items():
        path = root / rel
        if not path.is_file():
            raise FileNotFoundError(path)
        if patch(path, label):
            changed.append(rel)

    print(json.dumps({
        "buscadores_revisados": len(TARGETS),
        "paginas_actualizadas": changed,
        "nombres_accesibles": TARGETS,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
