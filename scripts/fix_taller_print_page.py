#!/usr/bin/env python3
"""Completa los metadatos de la utilidad imprimible del Taller.

Las páginas `/es/taller/hojas/` y `/en/workshop/sheets/` se enlazan desde el Taller, pero no son páginas
editoriales independientes para buscadores. Se publican como `noindex,follow`,
con canonical propio, y quedan fuera del sitemap.
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path

ROBOTS = '<meta name="robots" content="noindex,follow">'
CANONICAL = '<link rel="canonical" href="https://irisgreen.eu/es/taller/hojas/">'
PUBLIC_URL = "https://irisgreen.eu/es/taller/hojas/"
PAGES = (
    ("es/taller/hojas/index.html", PUBLIC_URL),
    ("en/workshop/sheets/index.html", "https://irisgreen.eu/en/workshop/sheets/"),
)


def fix_one(root: Path, rel: str, public_url: str) -> str:
    robots = ROBOTS
    canonical = f'<link rel="canonical" href="{public_url}">'
    path = root / rel
    if not path.is_file():
        raise FileNotFoundError(path)
    text = path.read_text(encoding="utf-8")
    if canonical not in text:
        raise AssertionError("Las hojas del Taller han perdido su canonical propio: " + rel)
    if robots not in text:
        marker = '<meta name="description"'
        pos = text.find(marker)
        if pos < 0:
            raise AssertionError("Las hojas del Taller no tienen meta description: " + rel)
        end = text.find(">", pos)
        if end < 0:
            raise AssertionError("Meta description incompleta: " + rel)
        text = text[: end + 1] + "\n" + robots + text[end + 1 :]
        path.write_text(text, encoding="utf-8")
    if text.count(robots) != 1:
        raise AssertionError("Robots noindex duplicado o ausente en las hojas del Taller: " + rel)
    return public_url


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path("dist"))
    args = ap.parse_args()
    root = args.root.resolve()
    urls = [fix_one(root, rel, url) for rel, url in PAGES]

    sitemap_path = root / "sitemap.xml"
    if not sitemap_path.is_file():
        raise FileNotFoundError(sitemap_path)
    sitemap = sitemap_path.read_text(encoding="utf-8")
    for public_url in urls:
        pattern = re.compile(
            r"<url>\s*<loc>" + re.escape(public_url) + r"</loc>.*?</url>\s*",
            re.S,
        )
        sitemap, removed = pattern.subn("", sitemap)
        if removed != 1:
            raise AssertionError(
                f"Se esperaba retirar una URL de las hojas del Taller del sitemap ({public_url}); retiradas: {removed}"
            )
        if public_url in sitemap:
            raise AssertionError("Las hojas noindex del Taller siguen presentes en el sitemap: " + public_url)
    sitemap_path.write_text(sitemap, encoding="utf-8")

    print("Taller hojas (ES y EN): noindex,follow + canonical propio + fuera del sitemap")


if __name__ == "__main__":
    main()
