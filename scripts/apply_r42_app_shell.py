#!/usr/bin/env python3
"""Inject the R42 A3 app-shell pilot into representative ES/EN product surfaces.

This is deliberately not a site-wide rewrite. It proves the shared shell on one
surface per interactive family before any broader propagation.
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path

MATERIALS = "/assets/ig-r42-materials.css?v=r42-design-1"
CSS = "/assets/ig-r42-shell.css?v=r42-design-1"
JS = "/assets/ig-r42-shell.js?v=r42-a3-1"
LEGACY_CSS = "/assets/ig-r42-shell.css?v=r42-a3-1"

PILOT = {
    "es/taller/dibujo/index.html": "workshop",
    "en/workshop/drawing/index.html": "workshop",
    "es/recursos/juegos/index.html": "games",
    "en/resources/games/index.html": "games",
    "es/intereses/index.html": "interests",
    "en/interests/index.html": "interests",
    "es/sitio-tranquilo/index.html": "quiet",
    "en/quiet-space/index.html": "quiet",
}

BODY_RE = re.compile(r"<body(?P<attrs>[^>]*)>", re.I)
HEAD_CLOSE_RE = re.compile(r"</head\s*>", re.I)
BODY_CLOSE_RE = re.compile(r"</body\s*>", re.I)


def _set_body_attrs(text: str, family: str) -> str:
    match = BODY_RE.search(text)
    if not match:
        raise AssertionError("R42 pilot page has no <body>")
    attrs = match.group("attrs")

    def set_attr(source: str, name: str, value: str) -> str:
        pattern = re.compile(rf"\s{name}=(['\"])(.*?)\1", re.I)
        found = pattern.search(source)
        token = f' {name}="{value}"'
        if found:
            return source[: found.start()] + token + source[found.end() :]
        return source + token

    attrs = set_attr(attrs, "data-ig-r42-pilot", "true")
    attrs = set_attr(attrs, "data-ig-r42-family", family)
    # R42-Design: the material system is scoped to the same pilot pages.
    attrs = set_attr(attrs, "data-ig-materials", "r42")
    return text[: match.start()] + "<body" + attrs + ">" + text[match.end() :]


def _inject_assets(text: str) -> str:
    # Idempotent upgrade from the A3 cache key to the Design cache key.
    text = text.replace(LEGACY_CSS, CSS)
    if CSS not in text:
        link = f'<link rel="stylesheet" href="{MATERIALS}">\n<link rel="stylesheet" href="{CSS}">\n'
        text, count = HEAD_CLOSE_RE.subn(link + "</head>", text, count=1)
        if count != 1:
            raise AssertionError("R42 pilot page has no </head>")
    if MATERIALS not in text:
        text = text.replace(f'<link rel="stylesheet" href="{CSS}">', f'<link rel="stylesheet" href="{MATERIALS}">\n<link rel="stylesheet" href="{CSS}">', 1)
    if JS not in text:
        script = f'<script defer src="{JS}"></script>\n'
        text, count = BODY_CLOSE_RE.subn(script + "</body>", text, count=1)
        if count != 1:
            raise AssertionError("R42 pilot page has no </body>")
    return text


def apply(root: Path) -> dict[str, int]:
    root = root.resolve()
    changed = 0
    present = 0
    missing = 0
    for rel, family in PILOT.items():
        path = root / rel
        if not path.is_file():
            missing += 1
            continue
        present += 1
        original = path.read_text(encoding="utf-8")
        text = _set_body_attrs(original, family)
        text = _inject_assets(text)
        if text != original:
            path.write_text(text, encoding="utf-8")
            changed += 1

    # R43 · Las páginas de la suite creativa del Taller ya se generan sobre el app shell
    # (body data-ig-r42-pilot="true"). Reciben el mismo sistema material. No es propagación
    # global: solo páginas que ya declaran el shell R42.
    listed = {(root / rel).resolve() for rel in PILOT}
    extra = 0
    for path in sorted(root.rglob("index.html")):
        if path.resolve() in listed:
            continue
        original = path.read_text(encoding="utf-8")
        match = BODY_RE.search(original)
        if not match or 'data-ig-r42-pilot="true"' not in match.group("attrs"):
            continue
        family = re.search(r'data-ig-r42-family=(["\'])(.*?)\1', match.group("attrs"))
        text = _set_body_attrs(original, family.group(2) if family else "workshop")
        text = _inject_assets(text)
        extra += 1
        if text != original:
            path.write_text(text, encoding="utf-8")
            changed += 1

    if missing:
        raise AssertionError(f"R42 pilot missing {missing} required route(s)")
    if present != len(PILOT):
        raise AssertionError((present, len(PILOT)))
    return {"present": present, "changed": changed, "suite": extra}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    args = parser.parse_args()
    result = apply(args.root)
    print(
        "R42 A3 pilot:",
        f"{result['present']}/{len(PILOT)} routes present;",
        f"{result['changed']} changed;",
        f"{result['suite']} Taller suite pages on the shell",
    )


if __name__ == "__main__":
    main()
