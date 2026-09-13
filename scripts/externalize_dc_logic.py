#!/usr/bin/env python3
"""Saca la lógica ``data-dc-script`` de las páginas públicas a JavaScript propio.

El runtime histórico recibía el cuerpo del script como texto y lo ejecutaba mediante
``new Function``. Esta migración convierte ese mismo código en un asset JS normal que
registra una factoría antes del arranque del runtime. No cambia el contenido de la
plantilla ni reescribe la lógica editorial de cada página.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path

SCRIPT = re.compile(
    r"<script(?P<attrs>[^>]*\bdata-dc-script(?:=[\"'][^\"']*[\"'])?[^>]*)>(?P<body>.*?)</script\s*>",
    re.I | re.S,
)
TYPE_ATTR = re.compile(r"\s+type=([\"']).*?\1", re.I | re.S)
RUNTIME_HOOK = "runtime.adoptParsed(rootName, parsed);\n    if (!window.__resources) {"
RUNTIME_REPLACEMENT = """runtime.adoptParsed(rootName, parsed);
    const pageLogicFactory = window.__dcPageLogicFactory;
    if (typeof pageLogicFactory === \"function\") {
      const Logic = pageLogicFactory(runtime.StreamableLogic, runtime.StreamableLogic, React);
      if (typeof Logic !== \"function\") throw new Error(\"dc-runtime: page logic factory did not return a component class\");
      const logicEntry = runtime.registry.get(rootName);
      logicEntry.Logic = Logic;
      logicEntry.logicError = null;
    }
    if (!window.__resources) {"""
RUNTIMES = (
    "assets/runtime/8fe7df74405f3c55.js",
    "assets/games/dc-runtime.js",
)


def factory_asset(body: str, rel: str) -> tuple[str, str]:
    source = body.strip()
    if not source:
        raise AssertionError(f"{rel}: data-dc-script vacío antes de externalizar")
    if re.search(r"(^|\n)\s*(?:import|export)\s", source):
        raise AssertionError(f"{rel}: usa import/export y requiere una migración explícita")
    if "class Component" not in source:
        raise AssertionError(f"{rel}: no define class Component")
    digest = hashlib.sha256((rel + "\0" + source).encode("utf-8")).hexdigest()[:20]
    name = f"assets/dc-logic/{digest}.js"
    wrapped = (
        "(function(){\n"
        "  window.__dcPageLogicFactory = function(DCLogic, StreamableLogic, React){\n"
        + source
        + "\n    if (typeof Component !== 'function') throw new Error('dc logic: Component no definido');\n"
        "    return Component;\n"
        "  };\n"
        "})();\n"
    )
    return name, wrapped


def externalize_page(path: Path, root: Path, asset_dir: Path) -> dict:
    rel = path.relative_to(root).as_posix()
    text = path.read_text(encoding="utf-8", errors="strict")
    matches = list(SCRIPT.finditer(text))
    if not matches:
        return {}
    if len(matches) != 1:
        raise AssertionError(f"{rel}: esperaba un data-dc-script, hay {len(matches)}")
    match = matches[0]
    body = match.group("body")
    asset_rel, asset_text = factory_asset(body, rel)
    asset_path = root / asset_rel
    asset_path.parent.mkdir(parents=True, exist_ok=True)
    asset_path.write_text(asset_text, encoding="utf-8")

    attrs = match.group("attrs")
    attrs = TYPE_ATTR.sub("", attrs)
    # Conserva data-props y cualquier metadato del script original, pero deja el
    # cuerpo sin código para que parseDcDocument no invoque updateJs/evalDcLogic.
    metadata = f'<script type="application/json"{attrs}></script>'
    loader = f'<script src="/{asset_rel}"></script>'
    replacement = metadata + "\n" + loader
    text = text[: match.start()] + replacement + text[match.end() :]
    path.write_text(text, encoding="utf-8")
    return {
        "path": rel,
        "asset": asset_rel,
        "logic_bytes": len(body.encode("utf-8")),
    }


def patch_runtime(path: Path) -> bool:
    text = path.read_text(encoding="utf-8", errors="strict")
    if RUNTIME_REPLACEMENT in text:
        return False
    count = text.count(RUNTIME_HOOK)
    if count != 1:
        raise AssertionError(f"{path}: punto de registro del runtime inesperado ({count})")
    path.write_text(text.replace(RUNTIME_HOOK, RUNTIME_REPLACEMENT, 1), encoding="utf-8")
    return True


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path("dist"))
    args = ap.parse_args()
    root = args.root.resolve()
    asset_dir = root / "assets/dc-logic"
    if asset_dir.exists():
        for child in asset_dir.glob("*.js"):
            child.unlink()
    asset_dir.mkdir(parents=True, exist_ok=True)

    pages = []
    for path in sorted(root.rglob("*.html")):
        row = externalize_page(path, root, asset_dir)
        if row:
            pages.append(row)
    if len(pages) != 24:
        raise AssertionError(f"Inventario de páginas DC cambiado: {len(pages)} != 24")

    runtime_changes = {}
    for rel in RUNTIMES:
        path = root / rel
        if not path.is_file():
            raise FileNotFoundError(path)
        runtime_changes[rel] = patch_runtime(path)

    remaining_logic = []
    for path in sorted(root.rglob("*.html")):
        text = path.read_text(encoding="utf-8", errors="ignore")
        for match in SCRIPT.finditer(text):
            if match.group("body").strip():
                remaining_logic.append(path.relative_to(root).as_posix())
    if remaining_logic:
        raise AssertionError("Queda lógica DC embebida: " + ", ".join(remaining_logic))

    print(json.dumps({
        "paginas_externalizadas": len(pages),
        "assets_logica": len(list(asset_dir.glob("*.js"))),
        "runtime_hook": runtime_changes,
        "logica_dc_embebida_restante": 0,
        "pages": pages,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
