#!/usr/bin/env python3
"""Contrato automático del formato global R40."""
from __future__ import annotations

import argparse
import re
import tempfile
from pathlib import Path

from apply_r40_global_format import apply

ROOT = Path(__file__).resolve().parents[1]

ES_NAV = ("Inicio", "Información", "Situaciones y apoyos", "Recursos", "Explorar", "Buscar")
EN_NAV = ("Home", "Information", "Situations and support", "Resources", "Explore", "Search")


def sample(lang: str, nav_id: str) -> str:
    label = "Menú" if lang == "es" else "Menu"
    return f"""<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><title>x</title></head>
<body><a href="#main">skip</a><header class="hd"><a class="brand" href="/">Iris Green</a>
<button class="ig-menu-button" aria-controls="{nav_id}" aria-expanded="false">{label}</button>
<nav id="{nav_id}" class="nav"><a href="/old/">Old</a></nav>
<div class="tools"><button>Lectura</button></div></header>
<main id="main"><h1>x</h1></main></body></html>"""


def assert_page(text: str, lang: str, nav_id: str) -> None:
    expected = ES_NAV if lang == "es" else EN_NAV
    assert 'class="ig-r40"' in text
    assert 'data-ig-global-format="r40"' in text
    assert '/assets/ig-r40.css' in text
    assert '/assets/ig-r40.js' in text
    assert f'id="{nav_id}"' in text
    assert text.count('data-ig-r40-nav') == 1
    for label in expected:
        assert label in text, (lang, label)
    assert "Old" not in text


def synthetic_contract() -> None:
    with tempfile.TemporaryDirectory(prefix="r40-global-test-") as tmp:
        root = Path(tmp)
        (root / "es").mkdir()
        (root / "en").mkdir()
        (root / "es/index.html").write_text(sample("es", "nav"), encoding="utf-8")
        (root / "en/index.html").write_text(sample("en", "ig-main-nav"), encoding="utf-8")
        counts = apply(root)
        assert counts["html"] == 2
        assert counts["changed"] == 2
        assert counts["nav"] == 2
        assert_page((root / "es/index.html").read_text(encoding="utf-8"), "es", "nav")
        assert_page((root / "en/index.html").read_text(encoding="utf-8"), "en", "ig-main-nav")


def source_contract() -> None:
    css = (ROOT / "assets/ig-r40.css").read_text(encoding="utf-8")
    js = (ROOT / "assets/ig-r40.js").read_text(encoding="utf-8")
    transform = (ROOT / "scripts/apply_r40_global_format.py").read_text(encoding="utf-8")

    # La nueva capa no añade deuda de especificidad.
    assert "!important" not in re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    # Hooks comunes exigidos.
    for token in (
        "createCard", "bindSearch", "bindFilters", "enhanceSortableTable",
        "createViewer", "setState", "setCollectionAdapter", "setProjectAdapter",
        "openGlobalSearch",
    ):
        assert token in js, token
    # Sin voz/TTS ni persistencia implícita.
    assert "speechSynthesis" not in js
    assert "localStorage" not in js
    assert "indexedDB" not in js
    # La navegación se genera ES/EN desde una sola transformación.
    for label in ES_NAV + EN_NAV:
        assert label in transform, label


def built_contract(root: Path) -> None:
    pages = {
        "es": root / "es/recursos/index.html",
        "en": root / "en/resources/index.html",
        "workshop_es": root / "es/taller/index.html",
        "workshop_en": root / "en/workshop/index.html",
        "interests_es": root / "es/intereses/index.html",
        "interests_en": root / "en/interests/index.html",
    }
    for name, path in pages.items():
        assert path.is_file(), (name, path)
        text = path.read_text(encoding="utf-8")
        assert "/assets/ig-r40.css" in text, name
        assert "/assets/ig-r40.js" in text, name
        assert "data-ig-r40-nav" in text, name
        assert 'data-ig-global-format="r40"' in text, name

    all_html = list(root.rglob("*.html"))
    linked = 0
    for path in all_html:
        text = path.read_text(encoding="utf-8", errors="strict")
        if "/assets/ig-r40.css" in text and "/assets/ig-r40.js" in text:
            linked += 1
    assert linked >= max(1, int(len(all_html) * 0.95)), (linked, len(all_html))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path)
    args = parser.parse_args()
    synthetic_contract()
    source_contract()
    if args.root:
        built_contract(args.root.resolve())
    print("R40 global format contract: PASS")


if __name__ == "__main__":
    main()
