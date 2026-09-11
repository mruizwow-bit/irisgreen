#!/usr/bin/env python3
"""Impide que la presentación especial de la ficha de instrucciones recupere resúmenes antiguos.

La ficha normal ya contiene la descripción aprobada por el lote central de 420. Esta
tarea toma esa descripción como autoridad y la copia a la presentación especial y a
su JS, después de que build_approved_navigation.py haya renderizado la salida.
"""
from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

TARGETS = {
    "es": {
        "source": "es/situaciones/necesito-que-me-repitan-las-instrucciones/index.html",
        "dist": "es/situaciones/necesito-que-me-repitan-las-instrucciones/index.html",
        "old": [
            "Puedes escuchar una indicación y olvidarla antes de usarla, sobre todo si estás haciendo otra cosa. Tener los pasos por escrito te permite volver a consultarlos.",
            "Oír una instrucción y sostenerla mientras se hace otra cosa son dos tareas distintas. Lo hablado se va; lo escrito se queda.",
        ],
    },
    "en": {
        "source": "en/situations/i-need-instructions-repeated/index.html",
        "dist": "en/situations/i-need-instructions-repeated/index.html",
        "old": [
            "You may hear an instruction and forget it before using it, especially if you are doing something else. Having the steps in writing lets you look back at them.",
            "Hearing an instruction and holding it in mind while doing something else are two different tasks. Spoken information disappears; written information stays available.",
        ],
    },
}


def extract_lede(path: Path) -> str:
    text = path.read_text(encoding="utf-8")
    m = re.search(
        r'<p\b[^>]*class=["\'][^"\']*\blede\b[^"\']*["\'][^>]*>(.*?)</p>',
        text,
        flags=re.I | re.S,
    )
    if not m:
        raise ValueError(f"No se encuentra la descripción aprobada en {path}")
    value = html.unescape(re.sub(r"<[^>]+>", "", m.group(1))).strip()
    if not value:
        raise ValueError(f"Descripción vacía en {path}")
    return value


def replace_known(text: str, olds: list[str], new: str, label: str, check: bool) -> tuple[str, int]:
    found = sum(text.count(old) for old in olds)
    if check:
        remaining = [old for old in olds if old in text]
        if remaining:
            raise AssertionError(f"Resumen antiguo todavía presente en {label}: {remaining[0][:90]!r}")
        if new not in text:
            raise AssertionError(f"Resumen 420 ausente en {label}")
        return text, 0
    for old in olds:
        text = text.replace(old, new)
    if not found and new not in text:
        raise AssertionError(f"No se encontró ni el texto antiguo ni el aprobado en {label}")
    return text, found


def run(root: Path, check: bool = False) -> dict:
    descriptions = {lang: extract_lede(ROOT / cfg["source"]) for lang, cfg in TARGETS.items()}
    changed = {}

    for lang, cfg in TARGETS.items():
        path = root / cfg["dist"]
        text = path.read_text(encoding="utf-8")
        new_html = html.escape(descriptions[lang], quote=True)
        text, count = replace_known(text, cfg["old"], new_html, str(path), check)
        if not check and count:
            path.write_text(text, encoding="utf-8")
        changed[str(path.relative_to(root))] = count

    js_path = root / "assets/navigation-approved.js"
    js = js_path.read_text(encoding="utf-8")
    js_count = 0
    for lang, cfg in TARGETS.items():
        # Las cadenas actuales no contienen comillas dobles, pero json.dumps evita
        # que una futura descripción válida pueda romper el literal JavaScript.
        new_js = json.dumps(descriptions[lang], ensure_ascii=False)[1:-1]
        js, count = replace_known(js, cfg["old"], new_js, f"{js_path}:{lang}", check)
        js_count += count
    if not check and js_count:
        js_path.write_text(js, encoding="utf-8")
    changed[str(js_path.relative_to(root))] = js_count

    result = {
        "mode": "check" if check else "apply",
        "description_authority": "lote central de 420 descripciones ES/EN",
        "routes": 2,
        "descriptions": descriptions,
        "replacements": changed,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return result


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, required=True)
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()
    run(args.root, args.check)
