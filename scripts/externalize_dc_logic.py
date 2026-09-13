#!/usr/bin/env python3
"""Externaliza plantilla y lógica de las páginas DC antes de publicar.

El HTML histórico incluía la plantilla con expresiones ``{{...}}`` y un
``data-dc-script`` cuyo cuerpo se ejecutaba como texto mediante ``new Function``.
Esta migración mueve ambos a un asset JS local por página: la plantilla se registra
como dato y la lógica como una factoría JavaScript normal. El fallback ``noscript``
permanece en el HTML y no se modifica contenido editorial.
"""
from __future__ import annotations

import argparse
import hashlib
import html as html_lib
import json
import re
from pathlib import Path

SCRIPT = re.compile(
    r"<script(?P<attrs>[^>]*\bdata-dc-script(?:=[\"'][^\"']*[\"'])?[^>]*)>(?P<body>.*?)</script\s*>",
    re.I | re.S,
)
XDC = re.compile(
    r"<x-dc(?P<attrs>[^>]*)>(?P<body>.*?)</x-dc\s*>",
    re.I | re.S,
)
TYPE_ATTR = re.compile(r"\s+type=([\"']).*?\1", re.I | re.S)
BRACES = re.compile(r"{{.*?}}", re.S)
URL_BRACES = re.compile(
    r"\b(?:href|src|action|formaction)\s*=\s*([\"'])[^\"']*{{.*?}}[^\"']*\1",
    re.I | re.S,
)
RUNTIME_HOOK = "runtime.adoptParsed(rootName, parsed);\n    if (!window.__resources) {"
RUNTIME_REPLACEMENT = """if (typeof window.__dcPageTemplate === \"string\") parsed.template = window.__dcPageTemplate;
    runtime.adoptParsed(rootName, parsed);
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


def factory_asset(template: str, body: str, rel: str) -> tuple[str, str]:
    source = body.strip()
    if not source:
        raise AssertionError(f"{rel}: data-dc-script vacío antes de externalizar")
    if re.search(r"(^|\n)\s*(?:import|export)\s", source):
        raise AssertionError(f"{rel}: usa import/export y requiere una migración explícita")
    if "class Component" not in source:
        raise AssertionError(f"{rel}: no define class Component")
    if not template.strip():
        raise AssertionError(f"{rel}: plantilla x-dc vacía antes de externalizar")

    digest = hashlib.sha256(
        (rel + "\0" + template + "\0" + source).encode("utf-8")
    ).hexdigest()[:20]
    name = f"assets/dc-logic/{digest}.js"
    template_literal = json.dumps(template, ensure_ascii=False)
    wrapped = (
        "(function(){\n"
        f"  window.__dcPageTemplate = {template_literal};\n"
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
    script_matches = list(SCRIPT.finditer(text))
    if not script_matches:
        return {}
    if len(script_matches) != 1:
        raise AssertionError(f"{rel}: esperaba un data-dc-script, hay {len(script_matches)}")
    xdc_matches = list(XDC.finditer(text))
    if len(xdc_matches) != 1:
        raise AssertionError(f"{rel}: esperaba un x-dc, hay {len(xdc_matches)}")

    script_match = script_matches[0]
    xdc_match = xdc_matches[0]
    logic = script_match.group("body")
    template = xdc_match.group("body")
    expressions_before = len(BRACES.findall(template))
    dynamic_urls_before = len(URL_BRACES.findall(template))

    asset_rel, asset_text = factory_asset(template, logic, rel)
    asset_path = root / asset_rel
    asset_path.parent.mkdir(parents=True, exist_ok=True)
    asset_path.write_text(asset_text, encoding="utf-8")

    # Vaciamos x-dc, manteniendo sus atributos, para que el HTML inicial no publique
    # expresiones de plantilla. El runtime recibe el mismo template desde el asset local.
    xdc_empty = f'<x-dc{xdc_match.group("attrs")}></x-dc>'
    text = text[: xdc_match.start()] + xdc_empty + text[xdc_match.end() :]

    # Tras cambiar x-dc, buscamos de nuevo el script porque sus offsets originales ya
    # no son válidos.
    script_match = SCRIPT.search(text)
    if not script_match:
        raise AssertionError(f"{rel}: se perdió data-dc-script durante la migración")
    attrs = TYPE_ATTR.sub("", script_match.group("attrs"))
    metadata = f'<script type="application/json"{attrs}></script>'
    loader = f'<script src="/{asset_rel}"></script>'
    replacement = metadata + "\n" + loader
    text = text[: script_match.start()] + replacement + text[script_match.end() :]
    path.write_text(text, encoding="utf-8")

    return {
        "path": rel,
        "asset": asset_rel,
        "template_expressions_removed": expressions_before,
        "dynamic_url_expressions_removed": dynamic_urls_before,
        "template_bytes": len(template.encode("utf-8")),
        "logic_bytes": len(logic.encode("utf-8")),
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
    html_template_expressions = []
    dynamic_url_expressions = []
    for path in sorted(root.rglob("*.html")):
        text = path.read_text(encoding="utf-8", errors="ignore")
        for match in SCRIPT.finditer(text):
            if match.group("body").strip():
                remaining_logic.append(path.relative_to(root).as_posix())
        if BRACES.search(text):
            html_template_expressions.append(path.relative_to(root).as_posix())
        if URL_BRACES.search(text):
            dynamic_url_expressions.append(path.relative_to(root).as_posix())

    if remaining_logic:
        raise AssertionError("Queda lógica DC embebida: " + ", ".join(remaining_logic))
    if html_template_expressions:
        raise AssertionError(
            "Quedan expresiones {{...}} en HTML público: "
            + ", ".join(html_template_expressions[:30])
        )
    if dynamic_url_expressions:
        raise AssertionError(
            "Quedan URLs con expresiones de plantilla: "
            + ", ".join(dynamic_url_expressions[:30])
        )

    print(json.dumps({
        "paginas_externalizadas": len(pages),
        "assets_dc": len(list(asset_dir.glob("*.js"))),
        "runtime_hook": runtime_changes,
        "logica_dc_embebida_restante": 0,
        "expresiones_template_html_restantes": 0,
        "urls_template_html_restantes": 0,
        "expresiones_template_extraidas": sum(p["template_expressions_removed"] for p in pages),
        "urls_template_extraidas": sum(p["dynamic_url_expressions_removed"] for p in pages),
        "pages": pages,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
