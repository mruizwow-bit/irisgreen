#!/usr/bin/env python3
"""Remate de presentación accesible aplicado únicamente a la salida pública.

- Retira conexiones y hojas de Google Fonts del HTML publicado.
- Carga las tipografías locales de Iris Green.
- Añade la hoja de impresión común.
- Añade el ancho común aprobado para páginas secundarias.
- Corrige el reflow móvil de la cuadrícula de cromos de Tus intereses.

No modifica títulos, descripciones, robots, enlaces canónicos ni contenido editorial.
No escribe informes dentro de ``dist``: la salida pública no contiene directorios de trabajo.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

GOOGLE_LINK = re.compile(
    r"\s*<link\b[^>]*(?:fonts\.googleapis\.com|fonts\.gstatic\.com)[^>]*>\s*",
    re.IGNORECASE,
)
FONT_LINK = '<link rel="stylesheet" href="/assets/ig-fonts.css">'
PRINT_LINK = '<link rel="stylesheet" href="/assets/print.css" media="print">'
LAYOUT_LINK = '<link rel="stylesheet" href="/assets/secondary-layout.css">'
INTERESTS_REFLOW_MARKER = "/* IG: Tus intereses · reflow 320 px */"
INTERESTS_REFLOW_CSS = r'''
/* IG: Tus intereses · reflow 320 px */
@media(max-width:560px){
  .igx .cromos{grid-template-columns:minmax(0,1fr)!important}
  .igx .finder,.igx .filters{min-width:0;max-width:100%}
  .igx #temaFilters .filter{max-width:100%;min-height:44px;white-space:normal;overflow-wrap:anywhere}
}
'''


def patch_html(path: Path) -> bool:
    original = path.read_text(encoding="utf-8", errors="strict")
    text = GOOGLE_LINK.sub("\n", original)
    additions: list[str] = []
    if "/assets/ig-fonts.css" not in text:
        additions.append(FONT_LINK)
    if "/assets/print.css" not in text:
        additions.append(PRINT_LINK)
    if "/assets/secondary-layout.css" not in text:
        additions.append(LAYOUT_LINK)
    if additions:
        if "</head>" not in text.lower():
            raise ValueError(f"HTML sin </head>: {path}")
        pos = text.lower().rfind("</head>")
        text = text[:pos] + "\n" + "\n".join(additions) + "\n" + text[pos:]
    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def patch_interests_reflow(root: Path) -> bool:
    css = root / "assets/ajustes-interfaz.css"
    if not css.is_file():
        raise FileNotFoundError(css)
    text = css.read_text(encoding="utf-8")
    if INTERESTS_REFLOW_MARKER in text:
        return False
    css.write_text(text.rstrip() + "\n\n" + INTERESTS_REFLOW_CSS.lstrip(), encoding="utf-8")
    return True


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path("dist"))
    args = ap.parse_args()
    root = args.root.resolve()
    fonts = root / "assets/fonts"
    required = [
        fonts / "atkinson-hyperlegible-latin-400-normal.woff2",
        fonts / "atkinson-hyperlegible-latin-700-normal.woff2",
        fonts / "newsreader-latin-wght-normal.woff2",
        fonts / "newsreader-latin-wght-italic.woff2",
        root / "assets/ig-fonts.css",
        root / "assets/print.css",
        root / "assets/secondary-layout.css",
    ]
    missing = [str(p.relative_to(root)) for p in required if not p.is_file()]
    if missing:
        raise FileNotFoundError("Faltan tipografías/hojas locales: " + ", ".join(missing))

    interests_reflow = patch_interests_reflow(root)

    changed = 0
    html = list(root.rglob("*.html"))
    for path in html:
        changed += int(patch_html(path))

    remote: list[str] = []
    for path in root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in {".html", ".css", ".js"}:
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        if "fonts.googleapis.com" in text or "fonts.gstatic.com" in text:
            remote.append(path.relative_to(root).as_posix())
    if remote:
        raise AssertionError("Google Fonts sigue en dist: " + ", ".join(remote[:30]))

    report = {
        "html_revisados": len(html),
        "html_actualizados": changed,
        "google_fonts": 0,
        "fuentes_locales": [p.name for p in required[:4]],
        "impresion_comun": True,
        "ancho_secundarias": "70rem",
        "intereses_reflow_320": True,
        "intereses_reflow_actualizado": interests_reflow,
    }
    print(json.dumps(report, ensure_ascii=False))


if __name__ == "__main__":
    main()
