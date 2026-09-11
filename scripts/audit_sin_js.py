#!/usr/bin/env python3
"""Comprueba que el contenido publicado se lee sin JavaScript.

Busca variables de plantilla sin resolver en la salida pública: \u007b\u007b algo \u007d\u007d en el
texto o dentro de un atributo. Una página así llega vacía a quien navega sin
JavaScript y a cualquier rastreador, y contradice lo que promete la portada.

Las páginas que todavía no están convertidas se declaran una a una en
editorial/pendientes-sin-js.json. La lista solo puede encogerse: si una página
declarada ya no tiene variables, hay que sacarla de la lista.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

HOLE = re.compile(r"\{\{\s*[A-Za-z_$][\w.$]*\s*\}\}")
ATTR_HOLE = re.compile(r"\b(?:href|src|action)=[\"'][^\"']*\{\{", re.I)
PENDING = "editorial/pendientes-sin-js.json"


def pending(root: Path) -> dict:
    # La lista vive en el repositorio, no en la salida pública.
    for base in (root, root.parent, Path.cwd()):
        path = base / PENDING
        if path.is_file():
            return json.loads(path.read_text(encoding="utf-8"))
    return {"pendientes": []}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path("dist"))
    args = parser.parse_args()
    root = args.root.resolve()

    declared = {row["pagina"] for row in pending(root).get("pendientes", [])}
    found: dict[str, dict] = {}
    scanned = 0

    for path in sorted(root.rglob("*.html")):
        rel = path.relative_to(root).as_posix()
        text = path.read_text(encoding="utf-8")
        scanned += 1
        if '<!-- ig-sin-js:start -->' in text:
            # La página conserva su plantilla, pero el contenido llega en un
            # <noscript> generado desde sus propios datos: sí se lee sin JavaScript.
            continue
        holes = HOLE.findall(text)
        links = ATTR_HOLE.findall(text)
        if holes or links:
            found[rel] = {
                "variables": len(holes),
                "ejemplos": sorted(set(holes))[:5],
                "enlaces_con_variable": len(links),
            }

    sin_declarar = sorted(set(found) - declared)
    ya_resueltas = sorted(declared - set(found))
    problemas = []
    if sin_declarar:
        problemas.append({"paginas_con_variables_sin_declarar": {k: found[k] for k in sin_declarar}})
    if ya_resueltas:
        problemas.append({"paginas_declaradas_que_ya_estan_bien": ya_resueltas, "que_hacer": "sacarlas de " + PENDING})

    out = root / "reports/publicacion"
    out.mkdir(parents=True, exist_ok=True)
    resumen = {
        "html_revisados": scanned,
        "paginas_con_variables": len(found),
        "declaradas_pendientes": len(declared),
        "detalle": found,
    }
    (out / "sin-js.json").write_text(json.dumps(resumen, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    if problemas:
        raise AssertionError("El contenido no se lee sin JavaScript: " + json.dumps(problemas, ensure_ascii=False)[:3000])

    print(json.dumps({
        "html_revisados": scanned,
        "paginas_con_variables": len(found),
        "todas_declaradas": True,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
