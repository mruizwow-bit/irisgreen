#!/usr/bin/env python3
"""Remate de presentación accesible aplicado únicamente a la salida pública.

- Retira conexiones y hojas de Google Fonts del HTML publicado.
- Carga las tipografías locales de Iris Green.
- Añade la hoja de impresión común.
- Añade el ancho común aprobado para páginas secundarias.
- Corrige el reflow móvil de la cuadrícula de cromos de Tus intereses.
- Garantiza un salto al contenido en todas las páginas HTML.
- Corrige el turquesa común para alcanzar contraste AA sobre blanco.
- Mantiene la explicación pública de privacidad coherente con las fuentes locales.

No modifica títulos, descripciones, robots ni enlaces canónicos.
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
BODY_OPEN = re.compile(r"<body\b[^>]*>", re.IGNORECASE)
MAIN_OPEN = re.compile(r"<main\b[^>]*>", re.IGNORECASE)
MAIN_ID = re.compile(r"\bid=[\"']main[\"']", re.IGNORECASE)
SKIP_MAIN = re.compile(r"<a\b[^>]*href=[\"']#main[\"']", re.IGNORECASE)
HTML_LANG_EN = re.compile(r"<html\b[^>]*\blang=[\"']en(?:-[^\"']+)?[\"']", re.IGNORECASE)
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
PRIVACY_FONT_COPY = {
    'es/privacidad/index.html': (
        '<p>Actualmente, estas tipografías se cargan desde Google Fonts. Para obtenerlas, el navegador realiza una conexión con los servidores de Google.</p>',
        '<p>Estas tipografías se sirven desde irisgreen.eu. El navegador no necesita conectarse con Google para descargarlas.</p>',
    ),
    'en/privacy/index.html': (
        '<p>These typefaces are currently loaded from Google Fonts. Your browser therefore connects to Google&#8217;s servers to request the font files.</p>',
        '<p>These typefaces are served directly from irisgreen.eu. Your browser does not need to connect to Google to download the font files.</p>',
    ),
}


def ensure_skip_link(text: str, path: Path) -> tuple[str, bool]:
    if SKIP_MAIN.search(text):
        return text, False
    main = MAIN_OPEN.search(text)
    body = BODY_OPEN.search(text)
    if not main or not body:
        return text, False
    if not MAIN_ID.search(text):
        tag = main.group(0)
        replacement = tag[:-1] + ' id="main">'
        text = text[:main.start()] + replacement + text[main.end():]
        body = BODY_OPEN.search(text)
        if not body:
            raise ValueError(f"HTML sin <body> tras preparar salto: {path}")
    label = "Skip to content" if HTML_LANG_EN.search(text) else "Ir al contenido"
    link = f'<a class="skip" href="#main">{label}</a>'
    text = text[:body.end()] + "\n" + link + text[body.end():]
    return text, True


def patch_html(path: Path) -> tuple[bool, bool]:
    original = path.read_text(encoding="utf-8", errors="strict")
    text = GOOGLE_LINK.sub("\n", original)
    text, skip_added = ensure_skip_link(text, path)
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
    changed = text != original
    if changed:
        path.write_text(text, encoding="utf-8")
    return changed, skip_added


def patch_interests_reflow(root: Path) -> bool:
    css = root / "assets/ajustes-interfaz.css"
    if not css.is_file():
        raise FileNotFoundError(css)
    text = css.read_text(encoding="utf-8")
    if INTERESTS_REFLOW_MARKER in text:
        return False
    css.write_text(text.rstrip() + "\n\n" + INTERESTS_REFLOW_CSS.lstrip(), encoding="utf-8")
    return True


def patch_turquoise(root: Path) -> bool:
    css = root / "assets/site-v23.css"
    if not css.is_file():
        raise FileNotFoundError(css)
    text = css.read_text(encoding="utf-8")
    old = "--turq:#1f8ba8;"
    new = "--turq:#197991;"
    if new in text:
        return False
    if text.count(old) != 1:
        raise ValueError("No se encuentra exactamente una definición del turquesa común")
    css.write_text(text.replace(old, new, 1), encoding="utf-8")
    return True


def patch_privacy_copy(root: Path) -> int:
    changed = 0
    for rel, (old, new) in PRIVACY_FONT_COPY.items():
        path = root / rel
        if not path.is_file():
            raise FileNotFoundError(path)
        text = path.read_text(encoding='utf-8')
        if new in text:
            continue
        if text.count(old) != 1:
            raise ValueError(f'La explicación de tipografías de Privacidad cambió: {rel}')
        path.write_text(text.replace(old, new, 1), encoding='utf-8')
        changed += 1
    return changed


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
    turquoise_changed = patch_turquoise(root)

    changed = 0
    skip_added = 0
    html = list(root.rglob("*.html"))
    for path in html:
        html_changed, added = patch_html(path)
        changed += int(html_changed)
        skip_added += int(added)
    privacy_changed = patch_privacy_copy(root)

    remote: list[str] = []
    for path in root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in {".html", ".css", ".js"}:
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        if "fonts.googleapis.com" in text or "fonts.gstatic.com" in text:
            remote.append(path.relative_to(root).as_posix())
    if remote:
        raise AssertionError("Google Fonts sigue en dist: " + ", ".join(remote[:30]))

    without_skip = []
    for path in html:
        text = path.read_text(encoding="utf-8", errors="ignore")
        if MAIN_OPEN.search(text) and not SKIP_MAIN.search(text):
            without_skip.append(path.relative_to(root).as_posix())
    if without_skip:
        raise AssertionError("Páginas con <main> sin salto al contenido: " + ", ".join(without_skip[:30]))

    report = {
        "html_revisados": len(html),
        "html_actualizados": changed,
        "google_fonts": 0,
        "fuentes_locales": [p.name for p in required[:4]],
        "privacidad_fuentes_locales": True,
        "privacidad_paginas_actualizadas": privacy_changed,
        "impresion_comun": True,
        "ancho_secundarias": "70rem",
        "intereses_reflow_320": True,
        "intereses_reflow_actualizado": interests_reflow,
        "saltos_al_contenido_anadidos": skip_added,
        "paginas_main_sin_salto": 0,
        "turquesa_aa": "#197991",
        "turquesa_actualizado": turquoise_changed,
    }
    print(json.dumps(report, ensure_ascii=False))


if __name__ == "__main__":
    main()
