#!/usr/bin/env python3
"""Inventaría la deuda de plantillas/runtime en la salida pública.

No modifica archivos. Distingue expresiones ``{{...}}`` que quedan como markup en la
respuesta HTML inicial de llaves que forman parte de código JavaScript o de un
``<noscript>`` ya resuelto. También cuenta enlaces con atributos de plantilla y registra
qué runtime DC carga cada página. El objetivo es detectar plantilla cruda visible o
parseable como HTML, no literales internos del código precompilado.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

MUSTACHE = re.compile(r"\{\{.*?\}\}", re.S)
NOSCRIPT = re.compile(r"<noscript\b[^>]*>.*?</noscript\s*>", re.I | re.S)
SCRIPT_BLOCK = re.compile(r"<script\b[^>]*>.*?</script\s*>", re.I | re.S)
LINK_MUSTACHE = re.compile(
    r"<(?:a|link)\b[^>]*(?:href|sc-camel-href)=[\"'][^\"']*\{\{.*?\}\}[^\"']*[\"'][^>]*>",
    re.I | re.S,
)
SCRIPT_SRC = re.compile(r"<script\b[^>]*\bsrc=[\"']([^\"']+)[\"'][^>]*>", re.I)
DATA_DC_SCRIPT = re.compile(
    r"<script\b[^>]*\bdata-dc-script\b[^>]*>(.*?)</script\s*>", re.I | re.S
)
X_DC = re.compile(r"<x-dc\b", re.I)
RUNTIMES = (
    "/assets/games/dc-runtime.js",
    "/assets/runtime/8fe7df74405f3c55.js",
    "/assets/runtime/dc-runtime-csp.js",
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
        # Los scripts se inspeccionan por separado. Sus literales {{...}} no son
        # plantilla HTML pendiente y no deben reabrir el hallazgo 2.
        markup = SCRIPT_BLOCK.sub("", active)
        active_expr = MUSTACHE.findall(markup)
        scripts = SCRIPT_SRC.findall(text)
        runtime_refs = [r for r in RUNTIMES if r in scripts or r in text]
        if not active_expr and not runtime_refs and not X_DC.search(active):
            continue
        rows.append({
            "route": route(root, path),
            "active_mustache": len(active_expr),
            "active_link_mustache": len(LINK_MUSTACHE.findall(markup)),
            "noscript_mustache": len(MUSTACHE.findall("\n".join(NOSCRIPT.findall(text)))),
            "script_mustache": len(MUSTACHE.findall("\n".join(SCRIPT_BLOCK.findall(active)))),
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

    # Una vez integrado en publicación, este inventario funciona también como
    # guardarraíl: ninguna expresión de plantilla puede volver al markup inicial.
    if debt:
        raise AssertionError(
            "Quedan plantillas {{ }} activas en el HTML inicial: "
            + ", ".join(r["route"] for r in debt[:20])
        )


if __name__ == "__main__":
    main()
