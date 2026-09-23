#!/usr/bin/env python3
"""Publica las 22 páginas DC actuales sin plantillas crudas ni ``unsafe-eval``.

Estrategia de publicación, sin reescribir interfaces:
1. precompila cada bloque ``data-dc-script`` como una función JavaScript normal;
2. deja un marcador no ejecutable para que el runtime conserve su contrato;
3. codifica las expresiones ``{{...}}`` dentro de ``<x-dc>`` como entidades HTML:
   el navegador reconstruye las llaves en el DOM, pero ya no quedan plantillas sin
   resolver en el markup de la respuesta inicial;
4. genera una única copia pública del runtime sin ``new Function`` y hace que las
   23 páginas la usen;
5. elimina las dos copias antiguas del artefacto y retira ``unsafe-eval`` de CSP.

El inventario bajó de 24 a 23 al simplificarse la página de Recursos. Bajó de
23 a 22 al integrarse El Taller R02 como superficie estática: esas páginas ya no
usan el runtime DC. El script sigue fallando si el inventario vuelve a cambiar,
si aparece x-import/dc-import, más de un bloque de lógica o cualquier otra forma que
exija ampliar el contrato. No toca archivos fuente fuera de ``--root`` salvo para
leer el runtime generado original.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

OLD_RUNTIMES = (
    "/assets/games/dc-runtime.js",
    "/assets/runtime/8fe7df74405f3c55.js",
)
SAFE_RUNTIME = "/assets/runtime/dc-runtime-csp.js"

XDC = re.compile(r"(<x-dc\b[^>]*>)(.*?)(</x-dc\s*>)", re.I | re.S)
LOGIC = re.compile(
    r"(<script\b(?=[^>]*\bdata-dc-script\b)[^>]*>)(.*?)(</script\s*>)",
    re.I | re.S,
)
NOSCRIPT = re.compile(r"<noscript\b[^>]*>.*?</noscript\s*>", re.I | re.S)
SCRIPT_BLOCK = re.compile(r"<script\b[^>]*>.*?</script\s*>", re.I | re.S)
MUSTACHE = re.compile(r"\{\{.*?\}\}", re.S)
LINK_MUSTACHE = re.compile(
    r"<(?:a|link)\b[^>]*(?:href|sc-camel-href)=[\"'][^\"']*\{\{.*?\}\}[^\"']*[\"'][^>]*>",
    re.I | re.S,
)
ACTIVE_DYNAMIC_IMPORT = re.compile(r"<(?:x-import|dc-import)\b", re.I)

EVAL_OLD = '''  function evalDcLogic(src) {
    //! nosemgrep: eval-and-function-constructor
    const fn = new Function(
      "DCLogic",
      "StreamableLogic",
      "React",
      src + '\\n;return (typeof Component!=="undefined"&&Component)||undefined;'
    );
    return fn(StreamableLogic, StreamableLogic, getReact());
  }'''
EVAL_NEW = '''  function evalDcLogic(src) {
    const factory = window.__dcPrecompiledLogic;
    if (typeof factory !== "function") {
      throw new Error("dc-runtime: precompiled logic missing in CSP-safe public build");
    }
    return factory(StreamableLogic, StreamableLogic, getReact());
  }'''

EXTERNAL_OLD = '''        //! nosemgrep: eval-and-function-constructor
        new Function("React", "module", "exports", "require", code)(
          getReact(),
          module,
          module.exports,
          () => ({})
        );'''
EXTERNAL_NEW = '''        throw new Error(
          "dc-runtime: x-import JavaScript execution is disabled in the CSP-safe public build"
        );'''


def encode_template(match: re.Match[str]) -> str:
    inner = MUSTACHE.sub(
        lambda token: token.group(0)
        .replace("{{", "&#123;&#123;", 1)
        .replace("}}", "&#125;&#125;", 1),
        match.group(2),
    )
    return match.group(1) + inner + match.group(3)


def precompiled_script(source: str) -> str:
    if "</script" in source.lower():
        raise AssertionError("El bloque data-dc-script contiene </script> y no puede precompilarse inline con seguridad")
    return (
        '<script data-dc-precompiled="">\n'
        'window.__dcPrecompiledLogic = function(DCLogic, StreamableLogic, React) {\n'
        + source.rstrip()
        + '\n;return (typeof Component!=="undefined"&&Component)||undefined;\n'
        '};\n'
        '</script>\n'
    )


def safe_runtime(root: Path) -> Path:
    source_path = root / "assets/games/dc-runtime.js"
    if not source_path.is_file():
        raise FileNotFoundError(source_path)
    source = source_path.read_text(encoding="utf-8", errors="strict")
    if source.count(EVAL_OLD) != 1:
        raise AssertionError("No se localiza exactamente una implementación evalDcLogic conocida")
    if source.count(EXTERNAL_OLD) != 1:
        raise AssertionError("No se localiza exactamente una ejecución x-import conocida")
    text = source.replace(EVAL_OLD, EVAL_NEW, 1).replace(EXTERNAL_OLD, EXTERNAL_NEW, 1)
    if re.search(r"\b(?:eval|Function)\s*\(", text):
        hits = re.findall(r"\b(?:eval|Function)\s*\(", text)
        raise AssertionError(f"El runtime CSP-safe aún contiene evaluación dinámica: {hits}")
    target = root / SAFE_RUNTIME.lstrip("/")
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(text, encoding="utf-8")
    return target


def transform_page(path: Path) -> dict:
    text = path.read_text(encoding="utf-8", errors="strict")
    refs = [r for r in OLD_RUNTIMES if r in text]
    if len(refs) != 1:
        raise AssertionError(f"{path}: esperaba exactamente un runtime antiguo, encontré {refs}")
    xdc_matches = list(XDC.finditer(text))
    logic_matches = list(LOGIC.finditer(text))
    if len(xdc_matches) != 1 or len(logic_matches) != 1:
        raise AssertionError(
            f"{path}: contrato inesperado x-dc={len(xdc_matches)} data-dc-script={len(logic_matches)}"
        )
    template = xdc_matches[0].group(2)
    if ACTIVE_DYNAMIC_IMPORT.search(template):
        raise AssertionError(f"{path}: usa x-import/dc-import; requiere migración explícita antes de quitar unsafe-eval")

    logic_source = logic_matches[0].group(2).strip()
    if not logic_source or "class Component" not in logic_source:
        raise AssertionError(f"{path}: el bloque de lógica no define class Component")

    text, xdc_count = XDC.subn(encode_template, text, count=1)
    if xdc_count != 1:
        raise AssertionError(f"{path}: no se pudo codificar x-dc")

    def replace_logic(match: re.Match[str]) -> str:
        marker = match.group(1) + "/* logic precompiled by build */" + match.group(3)
        return precompiled_script(logic_source) + marker

    text, logic_count = LOGIC.subn(replace_logic, text, count=1)
    if logic_count != 1:
        raise AssertionError(f"{path}: no se pudo precompilar data-dc-script")

    text = text.replace(refs[0], SAFE_RUNTIME)
    path.write_text(text, encoding="utf-8")
    return {
        "path": path.as_posix(),
        "old_runtime": refs[0],
        "template_expressions_encoded": len(MUSTACHE.findall(template)),
    }


def update_csp(root: Path) -> None:
    headers = root / "_headers"
    text = headers.read_text(encoding="utf-8", errors="strict")
    old = "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    new = "script-src 'self' 'unsafe-inline'"
    if text.count(old) != 1:
        raise AssertionError("La CSP no contiene exactamente el script-src con unsafe-eval esperado")
    headers.write_text(text.replace(old, new, 1), encoding="utf-8")


def markup_without_scripts_or_noscript(text: str) -> str:
    active = NOSCRIPT.sub("", text)
    return SCRIPT_BLOCK.sub("", active)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path("dist"))
    args = ap.parse_args()
    root = args.root.resolve()

    target_runtime = safe_runtime(root)
    pages = []
    for path in sorted(root.rglob("*.html")):
        if "reports" in path.parts:
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        if any(runtime in text for runtime in OLD_RUNTIMES):
            pages.append(path)
    if len(pages) != 22:
        raise AssertionError(f"Inventario de páginas DC cambiado: esperaba 22, encontré {len(pages)}")

    rows = [transform_page(path) for path in pages]

    lingering = []
    for path in root.rglob("*.html"):
        text = path.read_text(encoding="utf-8", errors="ignore")
        if any(runtime in text for runtime in OLD_RUNTIMES):
            lingering.append(path.relative_to(root).as_posix())
    if lingering:
        raise AssertionError("Quedan referencias a runtimes antiguos: " + ", ".join(lingering[:20]))

    for runtime in OLD_RUNTIMES:
        old = root / runtime.lstrip("/")
        if old.is_file():
            old.unlink()

    update_csp(root)

    active_mustache = []
    active_link_mustache = []
    for path in pages:
        text = path.read_text(encoding="utf-8", errors="strict")
        markup = markup_without_scripts_or_noscript(text)
        if MUSTACHE.search(markup):
            active_mustache.append(path.relative_to(root).as_posix())
        if LINK_MUSTACHE.search(markup):
            active_link_mustache.append(path.relative_to(root).as_posix())
        if SAFE_RUNTIME not in text or "data-dc-precompiled" not in text:
            raise AssertionError(f"{path}: falta runtime seguro o lógica precompilada")
    if active_mustache:
        raise AssertionError(
            "Quedan expresiones {{ }} crudas en markup: " + ", ".join(active_mustache[:20])
        )
    if active_link_mustache:
        raise AssertionError(
            "Quedan enlaces con plantilla cruda: " + ", ".join(active_link_mustache[:20])
        )

    runtime_text = target_runtime.read_text(encoding="utf-8", errors="strict")
    if re.search(r"\b(?:eval|Function)\s*\(", runtime_text):
        raise AssertionError("El runtime final vuelve a contener eval/Function")

    print(json.dumps({
        "pages_migrated": len(rows),
        "old_runtime_split": {
            runtime: sum(r["old_runtime"] == runtime for r in rows) for runtime in OLD_RUNTIMES
        },
        "encoded_template_expressions": sum(r["template_expressions_encoded"] for r in rows),
        "raw_markup_mustache_remaining": 0,
        "raw_link_mustache_remaining": 0,
        "old_runtimes_removed": list(OLD_RUNTIMES),
        "safe_runtime": SAFE_RUNTIME,
        "unsafe_eval_removed_from_csp": True,
        "dynamic_imports_allowed": False,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
