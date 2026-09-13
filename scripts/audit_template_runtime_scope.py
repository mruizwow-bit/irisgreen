#!/usr/bin/env python3
"""Inventaría la deuda de plantillas/runtime en la salida pública.

No modifica archivos. Separa expresiones {{...}} que quedan en el HTML inicial de
las que están dentro de <noscript>, cuenta atributos de enlace sin resolver y registra
qué copia del runtime dinámico carga cada página. Sirve como mapa previo al refactor
CSP; no considera un <noscript> como deuda de runtime porque no lo ejecuta JavaScript.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

MUSTACHE = re.compile(r"\{\{.*?\}\}", re.S)
NOSCRIPT = re.compile(r"<noscript\b[^>]*>.*?</noscript\s*>", re.I | re.S)
LINK_MUSTACHE = re.compile(r"<(?:a|link)\b[^>]*(?:href|sc-camel-href)=[\"'][^\"']*\{\{.*?\}\}[^\"']*[\"'][^>]*>", re.I | re.S)
SCRIPT_SRC = re.compile(r"<script\b[^>]*\bsrc=[\"']([^\"']+)[\"'][^>]*>", re.I)
DATA_DC_SCRIPT = re.compile(r"<script\b[^>]*\bdata-dc-script\b[^>]*>(.*?)</script\s*>", re.I | re.S)
X_DC = re.compile(r"<x-dc\b", re.I)
RUNTIMES = (
    "/assets/games/dc-runtime.js",
    "/assets/runtime/8fe7df74405f3c55.js",
)


def route(root: Path, path: Path) -> str:
    rel = path.relative_to(root).as_posix()
    if rel == "index.html":
        return "/"
    if rel.endswith("/index.html"):
        return "/" + rel[:-len("index.html")]
    return "/" + rel


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path("dist"))
    args = ap.parse_args()
    root = args.root.resolve()

    rows = []
    for path in sorted(root.rglob("*.html")):
        if "reports" in path.parts:
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        active = NOSCRIPT.sub("", text)
        active_expr = MUSTACHE.findall(active)
        if not active_expr and not any(runtime in text for runtime in RUNTIMES) and not X_DC.search(text):
            continue
        scripts = SCRIPT_SRC.findall(text)
        runtime_refs = [r for r in RUNTIMES if r in scripts or r in text]
        rows.append({
            "route": route(root, path),
            "active_mustache": len(active_expr),
            "active_link_mustache": len(LINK_MUSTACHE.findall(active)),
            "noscript_mustache": len(MUSTACHE.findall("\n".join(NOSCRIPT.findall(text)))),
            "has_x_dc": bool(X_DC.search(active)),
            "data_dc_script_blocks": len(DATA_DC_SCRIPT.findall(active)),
            "runtime_refs": runtime_refs,
            "sample": [" ".join(x.split())[:160] for x in active_expr[:4]],
        })

    debt = [r for r in rows if r["active_mustache"] or r["active_link_mustache"]]
    report = {
        "html_pages": sum(1 for p in root.rglob("*.html") if "reports" not in p.parts),
        "pages_with_runtime_or_templates": len(rows),
        "pages_with_active_mustache": len(debt),
        "active_mustache_total": sum(r["active_mustache"] for r in debt),
        "active_link_mustache_total": sum(r["active_link_mustache"] for r in debt),
        "runtime_reference_counts": {
            runtime: sum(runtime in r["runtime_refs"] for r in rows) for runtime in RUNTIMES
        },
        "pages": rows,
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
