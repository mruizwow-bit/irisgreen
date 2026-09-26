#!/usr/bin/env python3
"""Contract tests for the R42 A3 shared app-shell pilot."""
from __future__ import annotations

import argparse
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

from apply_r42_app_shell import CSS, JS, PILOT, apply

ROOT = Path(__file__).resolve().parents[1]


def _sample(lang: str) -> str:
    return (
        '<!doctype html><html lang="' + lang + '"><head><meta charset="utf-8">'
        '<title>R42</title></head><body><header>site</header><main><h1>Title</h1>'
        '<div id="app">stage</div></main></body></html>'
    )


def synthetic_contract() -> None:
    with tempfile.TemporaryDirectory(prefix="r42-a3-") as tmp:
        root = Path(tmp)
        for rel in PILOT:
            path = root / rel
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(_sample("en" if rel.startswith("en/") else "es"), encoding="utf-8")

        first = apply(root)
        assert first["present"] == len(PILOT)
        assert first["changed"] == len(PILOT)

        for rel, family in PILOT.items():
            text = (root / rel).read_text(encoding="utf-8")
            assert text.count(CSS) == 1, rel
            assert text.count(JS) == 1, rel
            assert 'data-ig-r42-pilot="true"' in text, rel
            assert f'data-ig-r42-family="{family}"' in text, rel

        second = apply(root)
        assert second["present"] == len(PILOT)
        assert second["changed"] == 0


def source_contract() -> None:
    css = (ROOT / "assets/ig-r42-shell.css").read_text(encoding="utf-8")
    js = (ROOT / "assets/ig-r42-shell.js").read_text(encoding="utf-8")
    injector = (ROOT / "scripts/apply_r42_app_shell.py").read_text(encoding="utf-8")

    # New shared code must not extend specificity debt.
    assert "!important" not in re.sub(r"/\*.*?\*/", "", css, flags=re.S)

    # Modern web-platform primitives are progressive enhancements, not a framework rewrite.
    for token in (
        "@layer", "container-type:inline-size", "@container",
        "prefers-reduced-motion", "prefers-contrast", "forced-colors"
    ):
        assert token in css, token
    for token in (
        "showModal", "showPopover", "startViewTransition",
        "MutationObserver", "registerAction", "openInspector"
    ):
        assert token in js, token

    # Safe DOM construction and no implicit persistence/network.
    assert ".innerHTML" not in js
    assert "insertAdjacentHTML" not in js
    assert "localStorage" not in js
    assert "indexedDB" not in js
    assert "fetch(" not in js
    assert "XMLHttpRequest" not in js
    assert "React" not in js
    assert "Vue" not in js
    assert "Svelte" not in js

    # Parse the actual JS when Node is available (GitHub/Netlify runners have it).
    node = shutil.which("node")
    if node:
        subprocess.run([node, "--check", str(ROOT / "assets/ig-r42-shell.js")], check=True)

    # Pilot remains deliberately scoped to one ES/EN surface per family.
    assert len(PILOT) == 8
    assert set(PILOT.values()) == {"workshop", "games", "interests", "quiet"}
    assert "data-ig-r42-pilot" in injector


def built_contract(root: Path) -> None:
    root = root.resolve()
    for rel, family in PILOT.items():
        path = root / rel
        assert path.is_file(), rel
        text = path.read_text(encoding="utf-8")
        assert CSS in text, rel
        assert JS in text, rel
        assert 'data-ig-r42-pilot="true"' in text, rel
        assert f'data-ig-r42-family="{family}"' in text, rel

    # No accidental site-wide propagation before human acceptance.
    for rel in ("index.html", "es/recursos/index.html", "en/resources/index.html"):
        path = root / rel
        if not path.is_file():
            continue
        text = path.read_text(encoding="utf-8")
        assert CSS not in text, rel
        assert JS not in text, rel
        assert "data-ig-r42-pilot" not in text, rel


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path)
    args = parser.parse_args()
    synthetic_contract()
    source_contract()
    if args.root:
        built_contract(args.root)
    print("R42 A3 app-shell contract: PASS")


if __name__ == "__main__":
    main()
