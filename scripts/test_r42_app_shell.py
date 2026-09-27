#!/usr/bin/env python3
"""Contract tests for the R42 A3 shared app-shell pilot."""
from __future__ import annotations

import argparse
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

from apply_r42_app_shell import CHILD_SAFETY_JS, CSS, JS, MATERIALS, PILOT, apply

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
            assert text.count(CHILD_SAFETY_JS) == 1, rel
            assert text.count(MATERIALS) == 1, rel
            assert text.index(MATERIALS) < text.index(CSS), rel
            assert 'data-ig-materials="r42"' in text, rel
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

    # R42-Design material system: one token source, glass only on chrome, real fallbacks.
    mat = (ROOT / "assets/ig-r42-materials.css").read_text(encoding="utf-8")
    mat_code = re.sub(r"/\*.*?\*/", "", mat, flags=re.S)
    for token in (
        "--ig-surface-content:", "--ig-surface-content-soft:", "--ig-chrome-glass-light:", "--ig-chrome-glass-dark:",
        "--ig-chrome-solid-light:", "--ig-chrome-solid-dark:", "--ig-control-border:", "--ig-separator:",
        "--ig-overlay-backdrop:", "--ig-glass-blur:", "--ig-glass-alpha-user", "--ig-glass-alpha-floor:", "--ig-focus:",
        "--ig-state-hover:", "--ig-state-selected:", "--ig-state-disabled-ink:", "--ig-state-error:", "--ig-state-success:",
        'data-ig-transparency="reduced"', 'data-ig-transparency="opaque"', "prefers-reduced-transparency",
        "@supports", "forced-colors", "prefers-contrast", "max-width:900px", "Canvas", "CanvasText", "Highlight", "HighlightText",
    ):
        assert token in mat_code, token
    # Every !important lives inside a cascade layer (layered important beats legacy unlayered important).
    unlayered = re.sub(r"@layer ig-r42-materials-important\{(?:[^{}]|\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\})*\}", "", mat_code)
    assert "!important" not in unlayered
    # The global image-altering contrast filter is neutralised on pilot pages.
    assert 'html[data-ig-contrast="on"] body[data-ig-materials="r42"] main{filter:none}' in mat_code
    # Glass is never declared on content surfaces.
    for content in (".ig-r42-stage{", ".ig-r42-workspace{", ".ig-r42-inspector{backdrop", ".jg-workspace{backdrop"):
        assert content not in mat_code, content
    # R02 · Rincón: todo el chrome temporal es oscuro y opaco (inspector, diálogos, popover, sheet).
    for token in (
        '[data-ig-r42-family="quiet"] :is(.ig-r42-inspector,.ig-r42-dialog,.ig-r42-file-popover',
        '[data-ig-r42-family="quiet"] .ig-r42-dialog::backdrop', '.r42-settings[open]', '.r42-more-menu',
        "--ig-state-disabled-ink:#5f6b80;",
    ):
        assert token in mat_code, token
    prefs = (ROOT / "assets/preferencias-lectura.js").read_text(encoding="utf-8")
    for token in ("prefers-contrast: more", "igTransparencyForced", "data-ig-transparency-forced-note"):
        assert token in prefs, token
    for token in ("prefers-reduced-transparency", "igTransparency", "igTransparencySource", "mountTransparency", "Transparencia", "Transparency"):
        assert token in prefs, token

    shell_js = (ROOT / "assets/ig-r42-shell.js").read_text(encoding="utf-8")
    child_js = (ROOT / "assets/ig-child-safety.js").read_text(encoding="utf-8")
    for token in ("Contenido para…", "Content for…", "audienceChild", "audienceTeen", "audienceAdult", "IGChildSafety.setAudience"):
        assert token in shell_js, token
    for token in ("localStorage", "sessionStorage"):
        assert token not in child_js, token
    for token in ("S2_HIGH_SENSITIVITY", "explicitAction===true", "ig:child-safety-purge-full"):
        assert token in child_js, token

    # Parse the actual JS when Node is available (GitHub/Netlify runners have it).
    node = shutil.which("node")
    if node:
        subprocess.run([node, "--check", str(ROOT / "assets/ig-r42-shell.js")], check=True)
        subprocess.run([node, "--check", str(ROOT / "assets/ig-child-safety.js")], check=True)
        subprocess.run([node, str(ROOT / "scripts/test_child_safety_policy.js")], check=True, cwd=ROOT)
        subprocess.run([node, "--check", str(ROOT / "assets/preferencias-lectura.js")], check=True)

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
        assert CHILD_SAFETY_JS in text, rel
        assert MATERIALS in text, rel
        assert 'data-ig-materials="r42"' in text, rel
        assert 'data-ig-r42-pilot="true"' in text, rel
        assert f'data-ig-r42-family="{family}"' in text, rel

    # R43 · every page already built on the R42 shell (Taller suite) receives the material system.
    for path in root.rglob("index.html"):
        text = path.read_text(encoding="utf-8")
        body = re.search(r"<body[^>]*>", text, re.I)
        if body and 'data-ig-r42-pilot="true"' in body.group(0):
            rel = path.relative_to(root).as_posix()
            assert MATERIALS in text, rel
            assert 'data-ig-materials="r42"' in body.group(0), rel
            assert "ig-r42-shell.css?v=r42-a3-1" not in text, rel

    # Home R42 es la primera superficie general migrada fuera del piloto:
    # consume materiales + Child Safety, pero NO el workspace/app-shell de herramientas.
    home = root / "index.html"
    if home.is_file():
        text = home.read_text(encoding="utf-8")
        assert 'data-ig-home-r42="true"' in text
        assert CSS not in text, "index.html"
        assert JS not in text, "index.html"
        assert "data-ig-r42-pilot" not in text, "index.html"
        assert CHILD_SAFETY_JS in text, "index.html"
        assert MATERIALS in text, "index.html"
        assert 'data-ig-materials="r42"' in text, "index.html"

    # Las demás superficies generales siguen sin propagación material/app-shell
    # hasta migrarse una a una y pasar HUMAN QA.
    for rel in ("es/recursos/index.html", "en/resources/index.html"):
        path = root / rel
        if not path.is_file():
            continue
        text = path.read_text(encoding="utf-8")
        assert CSS not in text, rel
        assert JS not in text, rel
        assert CHILD_SAFETY_JS not in text, rel
        assert "data-ig-r42-pilot" not in text, rel
        assert MATERIALS not in text, rel
        assert "data-ig-materials" not in text, rel


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path)
    args = parser.parse_args()
    synthetic_contract()
    source_contract()
    if args.root:
        built_contract(args.root)
    print("R42 A3 app-shell + R42-Design materials contract: PASS")


if __name__ == "__main__":
    main()
