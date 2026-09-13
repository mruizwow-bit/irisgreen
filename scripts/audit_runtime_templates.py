#!/usr/bin/env python3
"""Inventaría plantillas/runtime que todavía llegan sin resolver a ``dist``.

Este informe es deliberadamente diagnóstico: permite localizar qué páginas conservan
expresiones ``{{ ... }}``, atributos con expresiones, ``<x-dc>`` y referencias al
runtime antes de retirar ``unsafe-eval``. No modifica archivos ni amplía excepciones.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

BRACES = re.compile(r"{{.*?}}", re.S)
ATTR_WITH_BRACES = re.compile(
    r"\b(?:href|src|action|formaction)\s*=\s*([\"'])[^\"']*{{.*?}}[^\"']*\1",
    re.I | re.S,
)
EVAL_LIKE = re.compile(r"\beval\s*\(|\bnew\s+Function\s*\(")
KNOWN_RUNTIMES = (
    "/assets/runtime/8fe7df74405f3c55.js",
    "/assets/games/dc-runtime.js",
)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path("dist"))
    ap.add_argument("--fail-on-placeholders", action="store_true")
    args = ap.parse_args()
    root = args.root.resolve()

    pages = []
    for path in sorted(root.rglob("*.html")):
        text = path.read_text(encoding="utf-8", errors="ignore")
        expressions = BRACES.findall(text)
        attr_expressions = ATTR_WITH_BRACES.findall(text)
        xdc = "<x-dc" in text.lower()
        dc_script = "data-dc-script" in text.lower()
        runtimes = [runtime for runtime in KNOWN_RUNTIMES if runtime in text]
        if expressions or xdc or dc_script or runtimes:
            pages.append({
                "path": path.relative_to(root).as_posix(),
                "template_expressions": len(expressions),
                "url_attributes_with_expressions": len(attr_expressions),
                "x_dc": xdc,
                "data_dc_script": dc_script,
                "runtime_refs": runtimes,
                "sample_expressions": expressions[:8],
            })

    eval_files = []
    for path in sorted(root.rglob("*.js")):
        text = path.read_text(encoding="utf-8", errors="ignore")
        count = len(EVAL_LIKE.findall(text))
        if count:
            eval_files.append({
                "path": path.relative_to(root).as_posix(),
                "eval_or_new_function": count,
            })

    placeholder_pages = [row for row in pages if row["template_expressions"]]
    report = {
        "html_pages_with_runtime_or_template_markers": len(pages),
        "html_pages_with_template_expressions": len(placeholder_pages),
        "template_expression_total": sum(row["template_expressions"] for row in placeholder_pages),
        "url_attributes_with_template_expressions": sum(row["url_attributes_with_expressions"] for row in placeholder_pages),
        "x_dc_pages": sum(bool(row["x_dc"]) for row in pages),
        "data_dc_script_pages": sum(bool(row["data_dc_script"]) for row in pages),
        "runtime_reference_counts": {
            runtime: sum(runtime in row["runtime_refs"] for row in pages)
            for runtime in KNOWN_RUNTIMES
        },
        "eval_like_total": sum(row["eval_or_new_function"] for row in eval_files),
        "eval_like_files": eval_files,
        "pages": pages,
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))

    if args.fail_on_placeholders and placeholder_pages:
        raise AssertionError(
            "La salida pública conserva expresiones de plantilla en: "
            + ", ".join(row["path"] for row in placeholder_pages[:30])
        )


if __name__ == "__main__":
    main()
