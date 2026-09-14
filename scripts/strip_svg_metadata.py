#!/usr/bin/env python3
"""Sanea los SVG de ``assets`` al publicarlos, sin modificar los originales.

El canal de entrega puede añadir un bloque C2PA de varios KB dentro de SVG que en
origen no lo tenían. Este paso actúa únicamente sobre la copia de ``dist`` y
mantiene intactos los atributos gráficos (en especial ``fill`` y ``stroke``).
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

METADATA_BLOCK = re.compile(r"<metadata\b[^>]*>.*?</metadata\s*>", re.I | re.S)
METADATA_EMPTY = re.compile(r"<metadata\b[^>]*/\s*>", re.I | re.S)
XMLNS_C2PA = re.compile(r"\s+xmlns:c2pa\s*=\s*([\"']).*?\1", re.I | re.S)
C2PA_ATTRIBUTE = re.compile(r"\s+c2pa:[A-Za-z_][\w.-]*\s*=\s*([\"']).*?\1", re.I | re.S)
LAYER_ID = re.compile(r"\s+id\s*=\s*([\"'])Layer_1\1", re.I)
FORBIDDEN_LAYER_ID = re.compile(r"\bid\s*=\s*([\"'])Layer_1\1", re.I)


def sanitize_svg(text: str) -> str:
    """Retira solo metadatos/atributos solicitados y conserva el resto del SVG."""
    text = METADATA_BLOCK.sub("", text)
    text = METADATA_EMPTY.sub("", text)
    text = XMLNS_C2PA.sub("", text)
    text = C2PA_ATTRIBUTE.sub("", text)
    text = LAYER_ID.sub("", text)
    return text


def graphic_attribute_count(text: str, name: str) -> int:
    return len(re.findall(rf"(?<![\w:-]){re.escape(name)}\s*=", text, re.I))


def forbidden_tokens(text: str) -> list[str]:
    low = text.casefold()
    found = []
    if "c2pa" in low:
        found.append("c2pa")
    if "<metadata" in low:
        found.append("<metadata>")
    if "com.anthropic" in low:
        found.append("com.anthropic")
    if FORBIDDEN_LAYER_ID.search(text):
        found.append('id="Layer_1"')
    return found


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def collection_stats(rows: list[dict], prefix: str) -> dict:
    selected = [row for row in rows if row["relative"].startswith(prefix + "/")]
    return {
        "svg": len(selected),
        "bytes_before": sum(row["bytes_before"] for row in selected),
        "bytes_after": sum(row["bytes_after"] for row in selected),
        "bytes_saved": sum(row["bytes_before"] - row["bytes_after"] for row in selected),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=ROOT / "assets")
    parser.add_argument("--dest", type=Path, default=ROOT / "dist" / "assets")
    args = parser.parse_args()
    source = args.source.resolve()
    dest = args.dest.resolve()

    if not source.is_dir():
        raise FileNotFoundError(source)
    if source == dest:
        raise ValueError("El destino de SVG no puede ser la carpeta fuente")

    svg_files = sorted(path for path in source.rglob("*.svg") if path.is_file())
    source_before = {path: digest(path.read_bytes()) for path in svg_files}
    rows: list[dict] = []

    for src in svg_files:
        rel = src.relative_to(source)
        raw = src.read_bytes()
        text = raw.decode("utf-8", errors="strict")
        cleaned = sanitize_svg(text)

        if sanitize_svg(cleaned) != cleaned:
            raise AssertionError(f"El saneado no es idempotente: {rel}")
        if graphic_attribute_count(text, "fill") != graphic_attribute_count(cleaned, "fill"):
            raise AssertionError(f"Cambió el número de atributos fill: {rel}")
        if graphic_attribute_count(text, "stroke") != graphic_attribute_count(cleaned, "stroke"):
            raise AssertionError(f"Cambió el número de atributos stroke: {rel}")
        bad = forbidden_tokens(cleaned)
        if bad:
            raise AssertionError(f"Quedan metadatos prohibidos en {rel}: {bad}")

        out = cleaned.encode("utf-8")
        target = dest / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(out)
        rows.append({
            "relative": rel.as_posix(),
            "changed": out != raw,
            "bytes_before": len(raw),
            "bytes_after": len(out),
            "sha256": digest(out),
        })

    # Falla también si aparece un SVG generado/copiado en dist/assets que no proceda
    # del recorrido anterior y conserve una credencial o un id de capa conflictivo.
    published = sorted(path for path in dest.rglob("*.svg") if path.is_file())
    for path in published:
        text = path.read_text(encoding="utf-8", errors="strict")
        bad = forbidden_tokens(text)
        if bad:
            raise AssertionError(f"SVG publicado sin sanear {path.relative_to(dest)}: {bad}")

    source_after = {path: digest(path.read_bytes()) for path in svg_files}
    if source_after != source_before:
        raise AssertionError("El saneado modificó uno o más SVG de la fuente")

    report = {
        "source": str(source),
        "dest": str(dest),
        "svg_source": len(svg_files),
        "svg_published": len(published),
        "svg_changed": sum(row["changed"] for row in rows),
        "bytes_before": sum(row["bytes_before"] for row in rows),
        "bytes_after": sum(row["bytes_after"] for row in rows),
        "bytes_saved": sum(row["bytes_before"] - row["bytes_after"] for row in rows),
        "fill_stroke_preserved": True,
        "source_untouched": True,
        "idempotent": True,
        "collections": {
            name: collection_stats(rows, name) for name in ("pictos", "dinero", "mulberry")
        },
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
