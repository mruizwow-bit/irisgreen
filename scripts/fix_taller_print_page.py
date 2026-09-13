#!/usr/bin/env python3
"""Completa los metadatos de la utilidad imprimible del Taller.

La página `/es/taller/hojas/` se enlaza desde el Taller, pero no es una página
editorial independiente para buscadores. Se publica como `noindex,follow`, con
canonical propio, y queda fuera del sitemap.
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path

ROBOTS = '<meta name="robots" content="noindex,follow">'
CANONICAL = '<link rel="canonical" href="https://irisgreen.eu/es/taller/hojas/">'
PUBLIC_URL = "https://irisgreen.eu/es/taller/hojas/"


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path("dist"))
    args = ap.parse_args()
    root = args.root.resolve()
    path = root / "es/taller/hojas/index.html"
    if not path.is_file():
        raise FileNotFoundError(path)
    text = path.read_text(encoding="utf-8")
    if CANONICAL not in text:
        raise AssertionError("Las hojas del Taller han perdido su canonical propio")
    if ROBOTS not in text:
        marker = '<meta name="description"'
        pos = text.find(marker)
        if pos < 0:
            raise AssertionError("Las hojas del Taller no tienen meta description")
        end = text.find(">", pos)
        if end < 0:
            raise AssertionError("Meta description incompleta")
        text = text[: end + 1] + "\n" + ROBOTS + text[end + 1 :]
        path.write_text(text, encoding="utf-8")
    if text.count(ROBOTS) != 1:
        raise AssertionError("Robots noindex duplicado o ausente en las hojas del Taller")

    sitemap_path = root / "sitemap.xml"
    if not sitemap_path.is_file():
        raise FileNotFoundError(sitemap_path)
    sitemap = sitemap_path.read_text(encoding="utf-8")
    pattern = re.compile(
        r"<url>\s*<loc>" + re.escape(PUBLIC_URL) + r"</loc>.*?</url>\s*",
        re.S,
    )
    sitemap, removed = pattern.subn("", sitemap)
    if removed != 1:
        raise AssertionError(
            f"Se esperaba retirar una URL de las hojas del Taller del sitemap; retiradas: {removed}"
        )
    if PUBLIC_URL in sitemap:
        raise AssertionError("Las hojas noindex del Taller siguen presentes en el sitemap")
    sitemap_path.write_text(sitemap, encoding="utf-8")

    print("Taller hojas: noindex,follow + canonical propio + fuera del sitemap")


if __name__ == "__main__":
    main()
