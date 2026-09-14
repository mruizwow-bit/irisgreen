#!/usr/bin/env python3
"""Publica únicamente el cartel de mantenimiento en producción.

Los deploy previews y branch deploys usan el build normal definido en [build].
"""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "maintenance-dist"
SOURCE = ROOT / "assets" / "maintenance.html"


def build() -> Path:
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)

    if not SOURCE.is_file():
        raise FileNotFoundError(SOURCE)

    shutil.copy2(SOURCE, OUT / "index.html")
    (OUT / "robots.txt").write_text(
        "User-agent: *\nDisallow: /\n",
        encoding="utf-8",
    )
    (OUT / "_redirects").write_text(
        "/* /index.html 200\n",
        encoding="utf-8",
    )
    (OUT / "_headers").write_text(
        "/*\n"
        "  Cache-Control: no-store, max-age=0\n"
        "  X-Robots-Tag: noindex, nofollow, noarchive\n",
        encoding="utf-8",
    )

    print("Producción cerrada: publicado únicamente el cartel de mantenimiento.")
    return OUT


if __name__ == "__main__":
    build()
