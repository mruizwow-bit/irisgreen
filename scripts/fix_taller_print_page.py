#!/usr/bin/env python3
"""Completa los metadatos de la utilidad imprimible del Taller.

La página `/es/taller/hojas/` se enlaza desde el Taller, pero no es una página
editorial independiente para buscadores. Se publica como `noindex,follow`, con
canonical propio, y queda fuera del sitemap.
"""
from __future__ import annotations

import argparse
from pathlib import Path

ROBOTS = '<meta name="robots" content="noindex,follow">'
CANONICAL = '<link rel="canonical" href="https://irisgreen.eu/es/taller/hojas/">'


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path("dist"))
    args = ap.parse_args()
    path = args.root.resolve() / "es/taller/hojas/index.html"
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
    print("Taller hojas: noindex,follow + canonical propio")


if __name__ == "__main__":
    main()
