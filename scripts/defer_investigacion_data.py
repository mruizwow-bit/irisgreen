#!/usr/bin/env python3
"""Saca la semilla completa de Investigación del HTML publicado.

La página conserva el fallback completo sin JavaScript. Con JavaScript activo,
el componente carga el mismo JSON canónico después de montar la interfaz, por
lo que el documento inicial no transporta dos copias completas de los 120 estudios.
No modifica la fuente editorial ni el JSON maestro.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from optimize_investigacion_layout import apply as apply_layout

ROOT = Path(__file__).resolve().parents[1]
PAGE = Path("es/investigacion/index.html")
SEED_RE = re.compile(r'(<script\s+id="ig-initial-data"[^>]*>)(.*?)(</script>)', re.S)
OLD_INIT = 'const IG_INITIAL = JSON.parse(document.getElementById("ig-initial-data").textContent);'
NEW_INIT = 'const IG_DATA_NODE = document.getElementById("ig-initial-data");\nconst IG_INITIAL = null;'
OLD_MOUNT = '''  componentDidMount() {\n    this._igPreferencesDisconnect = window.IGPreferences.connect(this);'''
NEW_MOUNT = '''  componentDidMount() {\n    this._igPreferencesDisconnect = window.IGPreferences.connect(this);\n    const dataSource = (IG_DATA_NODE && IG_DATA_NODE.dataset.source) || "/es/investigacion/estudios-textos.json";\n    fetch(dataSource, { credentials: "same-origin" })\n      .then((response) => {\n        if (!response.ok) throw new Error("No se pudieron cargar los estudios (" + response.status + ")");\n        return response.json();\n      })\n      .then((data) => {\n        if (!Array.isArray(data) || data.length !== 120) throw new Error("El catálogo de estudios no tiene 120 entradas");\n        this.setState({ data });\n      })\n      .catch((error) => {\n        console.warn("[Iris Green]", error.message);\n        const main = document.querySelector("main");\n        if (main && !main.querySelector("[data-ig-investigacion-error]")) {\n          const status = document.createElement("p");\n          status.setAttribute("role", "status");\n          status.setAttribute("data-ig-investigacion-error", "");\n          status.style.cssText = "margin:0 0 18px;padding:12px 14px;border:1px solid rgba(23,57,92,.16);border-radius:12px;background:#fff";\n          status.textContent = document.documentElement.lang === "en"\n            ? "The studies could not be loaded. The page can be reloaded to try again."\n            : "No se han podido cargar los estudios. Puedes recargar la página para intentarlo de nuevo.";\n          main.insertBefore(status, main.firstChild);\n        }\n      });'''
OLD_NO_RESULTS = '      noResults: rows.length === 0,'
NEW_NO_RESULTS = '      noResults: !!st.data && rows.length === 0,'


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=ROOT / "dist")
    args = ap.parse_args()
    page = args.root.resolve() / PAGE
    if not page.is_file():
        raise FileNotFoundError(page)

    text = page.read_text(encoding="utf-8")
    before = len(text.encode("utf-8"))

    match = SEED_RE.search(text)
    if not match:
        raise ValueError("No se encuentra ig-initial-data en Investigación")
    seed_text = match.group(2)
    data = json.loads(seed_text)
    if not isinstance(data, list) or len(data) != 120:
        raise ValueError(f"Semilla inesperada: {len(data) if isinstance(data, list) else type(data).__name__}")
    seed_bytes = len(seed_text.encode("utf-8"))
    text = text[:match.start()] + match.group(1) + "null" + match.group(3) + text[match.end():]

    if text.count(OLD_INIT) != 1:
        raise ValueError("Cambió la inicialización de ig-initial-data")
    text = text.replace(OLD_INIT, NEW_INIT, 1)

    if text.count(OLD_MOUNT) != 1:
        raise ValueError("Cambió componentDidMount de Investigación")
    text = text.replace(OLD_MOUNT, NEW_MOUNT, 1)

    if text.count(OLD_NO_RESULTS) != 1:
        raise ValueError("Cambió la condición de noResults")
    text = text.replace(OLD_NO_RESULTS, NEW_NO_RESULTS, 1)

    page.write_text(text, encoding="utf-8")
    legacy_layout_removed = apply_layout(page)
    after = len(page.read_bytes())
    print(json.dumps({
        "page": PAGE.as_posix(),
        "records": len(data),
        "seed_bytes_removed": seed_bytes - len("null"),
        "html_bytes_before": before,
        "html_bytes_after": after,
        "data_source": "/es/investigacion/estudios-textos.json",
        "no_js_fallback_preserved": "<noscript>" in text,
        "content_visibility": False,
        "legacy_layout_removed": legacy_layout_removed,
        "lazy_data_preserved": True,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
