#!/usr/bin/env python3
"""Publish the reviewed 120-entry research collection into dist.

The large reviewed HTML and JSON are stored as gzip+base64 chunks under
scripts/data so they stay out of the public output. Netlify reconstructs the
canonical files after the regular site build.
"""
from __future__ import annotations

import base64
import gzip
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAYLOAD_DIR = ROOT / "scripts" / "data"
DEST = ROOT / "dist" / "es" / "investigacion"


def unpack(pattern: str) -> bytes:
    parts = sorted(PAYLOAD_DIR.glob(pattern))
    if not parts:
        raise RuntimeError(f"No payload files found for {pattern}")
    encoded = "".join(part.read_text(encoding="ascii").strip() for part in parts)
    return gzip.decompress(base64.b64decode(encoded, validate=True))


def main() -> None:
    page = unpack("investigacion-page-*.b64").decode("utf-8")
    raw_data = unpack("investigacion-data-*.b64")
    studies = json.loads(raw_data.decode("utf-8"))

    numbers = [row.get("n") for row in studies] if isinstance(studies, list) else []
    if len(studies) != 120 or numbers != list(range(1, 121)):
        raise RuntimeError("Research payload must contain exactly entries 1–120 in order")
    grade_entries = [row["n"] for row in studies if row.get("content", {}).get("es", {}).get("grade")]
    if grade_entries != [5, 63, 108, 110, 112]:
        raise RuntimeError(f"Unexpected GRADE entries: {grade_entries}")
    if '"numberOfItems":120' not in page.replace(" ", ""):
        raise RuntimeError("Research page metadata does not declare 120 publications")
    if "Qué encontró cada estudio y qué no permite concluir" not in page:
        raise RuntimeError("Unexpected research page payload")

    # First paint uses the reviewed JSON immediately; no extra network request is
    # needed before the 120 cards, search and filters become available.
    safe_json = raw_data.decode("utf-8").replace("</", "<\\/")
    seed = (
        '<script id="ig-initial-data" type="application/json">'
        + safe_json
        + "</script>\n"
    )
    if '<script id="ig-initial-data"' in page:
        raise RuntimeError("Research page payload already contains an initial-data seed")
    if "</head>" not in page:
        raise RuntimeError("Research page payload has no </head>")
    page = page.replace("</head>", seed + "</head>", 1)

    DEST.mkdir(parents=True, exist_ok=True)
    (DEST / "index.html").write_text(page, encoding="utf-8")
    (DEST / "estudios-textos.json").write_bytes(raw_data)
    print("Published /es/investigacion/: 120 reviewed ES/EN entries")


if __name__ == "__main__":
    main()
