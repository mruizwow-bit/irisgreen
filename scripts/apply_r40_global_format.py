#!/usr/bin/env python3
"""Aplica el formato global R40 al artefacto público.

Opera únicamente sobre la raíz indicada (normalmente dist): no modifica fuentes ni
reconstruye páginas. Sustituye solo la navegación principal existente, añade la
clase de producto R40 y enlaza la capa CSS/JS común.
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path

CSS_HREF = "/assets/iris-r40.css"
JS_SRC = "/assets/iris-r40.js"

HTML_RE = re.compile(r"<html\b[^>]*\blang=(['\"])(?P<lang>[^'\"]+)\1", re.I)
HEADER_RE = re.compile(r"<header\b(?P<attrs>[^>]*)>(?P<body>.*?)</header>", re.I | re.S)
NAV_RE = re.compile(r"<nav\b(?P<attrs>[^>]*)>(?P<body>.*?)</nav>", re.I | re.S)
CLASS_RE = re.compile(r"\bclass=(['\"])(?P<value>[^'\"]*)\1", re.I)
ID_RE = re.compile(r"\bid=(['\"])(?P<value>[^'\"]+)\1", re.I)
BODY_OPEN_RE = re.compile(r"<body\b(?P<attrs>[^>]*)>", re.I)
HEAD_CLOSE_RE = re.compile(r"</head>", re.I)
BODY_CLOSE_RE = re.compile(r"</body>", re.I)

NAV = {
    "es": {
        "label": "Navegación principal",
        "home": "Inicio",
        "info": "Información",
        "situations": "Situaciones y apoyos",
        "resources": "Recursos",
        "explore": "Explorar",
        "search": "Buscar",
        "conditions": "Condiciones",
        "data": "Datos",
        "research": "Investigación",
        "situations_link": "Situaciones",
        "support": "Ayudas",
        "interests": "Tus intereses",
        "workshop": "El taller",
        "quiet": "Rincón tranquilo",
        "routes": {
            "conditions": "/es/neurodiversidad/condiciones/",
            "data": "/es/datos/",
            "research": "/es/investigacion/",
            "situations": "/es/situaciones/",
            "support": "/es/tramites/directorio/",
            "resources": "/es/recursos/",
            "interests": "/es/intereses/",
            "workshop": "/es/taller/",
            "quiet": "/es/sitio-tranquilo/",
        },
    },
    "en": {
        "label": "Main navigation",
        "home": "Home",
        "info": "Information",
        "situations": "Situations and support",
        "resources": "Resources",
        "explore": "Explore",
        "search": "Search",
        "conditions": "Conditions",
        "data": "Data",
        "research": "Research",
        "situations_link": "Situations",
        "support": "Support",
        "interests": "Your interests",
        "workshop": "The workshop",
        "quiet": "Quiet space",
        "routes": {
            "conditions": "/en/neurodiversity/conditions/",
            "data": "/en/data/",
            # English research/support routes are not yet complete; keep real public routes.
            "research": "/es/investigacion/",
            "situations": "/en/situations/",
            "support": "/es/tramites/directorio/",
            "resources": "/en/resources/",
            "interests": "/en/interests/",
            "workshop": "/en/workshop/",
            "quiet": "/en/quiet-space/",
        },
    },
}


def _language(text: str) -> str:
    match = HTML_RE.search(text)
    return "en" if match and match.group("lang").lower().startswith("en") else "es"


def _nav_markup(lang: str, nav_id: str | None, original_classes: str = "") -> str:
    t = NAV[lang]
    r = t["routes"]
    id_attr = f' id="{nav_id}"' if nav_id else ""
    classes = [x for x in original_classes.split() if x]
    if not classes:
        classes = ["nav"]
    if "ig-r40-nav" not in classes:
        classes.append("ig-r40-nav")
    class_attr = " ".join(classes)
    return f"""<nav class="{class_attr}"{id_attr} aria-label="{t['label']}" data-ig-r40-nav>
<a href="/" data-route="inicio">{t['home']}</a>
<details class="ig-r40-nav-group"><summary>{t['info']}</summary><div class="ig-r40-nav-menu">
<a href="{r['conditions']}">{t['conditions']}</a>
<a href="{r['data']}">{t['data']}</a>
<a href="{r['research']}">{t['research']}</a>
</div></details>
<details class="ig-r40-nav-group"><summary>{t['situations']}</summary><div class="ig-r40-nav-menu">
<a href="{r['situations']}">{t['situations_link']}</a>
<a href="{r['support']}">{t['support']}</a>
</div></details>
<a href="{r['resources']}">{t['resources']}</a>
<details class="ig-r40-nav-group"><summary>{t['explore']}</summary><div class="ig-r40-nav-menu">
<a href="{r['interests']}" data-iris-top="interests">{t['interests']}</a>
<a href="{r['workshop']}" data-iris-top="workshop">{t['workshop']}</a>
<a class="quiet-link" href="{r['quiet']}">{t['quiet']}</a>
</div></details>
<a class="ig-r40-nav-search" href="/#buscar" data-ig-r40-search>{t['search']}</a>
</nav>"""


def _nav_is_main(attrs: str) -> bool:
    cls = CLASS_RE.search(attrs)
    value = cls.group("value") if cls else ""
    ident = ID_RE.search(attrs)
    nav_id = ident.group("value") if ident else ""
    classes = set(value.split())
    return "nav" in classes or "ig-uh-nav" in classes or nav_id in {"nav", "ig-main-nav"}


def _replace_header_navigation(text: str, lang: str) -> tuple[str, bool]:
    header_match = HEADER_RE.search(text)
    if not header_match:
        return text, False

    header = header_match.group(0)
    selected = None
    for nav_match in NAV_RE.finditer(header):
        if _nav_is_main(nav_match.group("attrs")):
            selected = nav_match
            break
    if not selected:
        return text, False

    attrs = selected.group("attrs")
    ident = ID_RE.search(attrs)
    nav_id = ident.group("value") if ident else None
    if not nav_id:
        control = re.search(r"aria-controls=(['\\\"])(nav|ig-main-nav)\\1", header, re.I)
        nav_id = control.group(2) if control else "ig-main-nav"
    cls = CLASS_RE.search(attrs)
    original_classes = cls.group("value") if cls else ""
    replacement = _nav_markup(lang, nav_id, original_classes)

    new_header = header[: selected.start()] + replacement + header[selected.end() :]
    return text[: header_match.start()] + new_header + text[header_match.end() :], True


def _add_body_class(text: str) -> str:
    match = BODY_OPEN_RE.search(text)
    if not match:
        return text
    attrs = match.group("attrs")
    cls = CLASS_RE.search(attrs)
    if cls:
        classes = cls.group("value").split()
        if "ig-r40" in classes:
            return text
        new_value = (cls.group("value") + " ig-r40").strip()
        attrs = attrs[: cls.start("value")] + new_value + attrs[cls.end("value") :]
    else:
        attrs += ' class="ig-r40"'
    attrs += ' data-ig-global-format="r40"'
    return text[: match.start()] + "<body" + attrs + ">" + text[match.end() :]


def _inject_assets(text: str) -> str:
    if CSS_HREF not in text:
        link = f'<link rel="stylesheet" href="{CSS_HREF}"/>\n'
        text, count = HEAD_CLOSE_RE.subn(link + "</head>", text, count=1)
        if count != 1:
            body = BODY_OPEN_RE.search(text)
            text = text[: body.start()] + link + text[body.start() :] if body else link + text
    if JS_SRC not in text:
        script = f'<script defer src="{JS_SRC}"></script>\n'
        text, count = BODY_CLOSE_RE.subn(script + "</body>", text, count=1)
        if count != 1:
            text += "\n" + script
    return text


def apply_file(path: Path) -> dict[str, object]:
    original = path.read_text(encoding="utf-8")
    if "<html" not in original.lower():
        return {"changed": False, "nav": False}

    lang = _language(original)
    text, nav_changed = _replace_header_navigation(original, lang)
    text = _add_body_class(text)
    text = _inject_assets(text)

    if text != original:
        path.write_text(text, encoding="utf-8")
    return {"changed": text != original, "nav": nav_changed, "lang": lang}


def apply(root: Path) -> dict[str, int]:
    counts = {"html": 0, "changed": 0, "nav": 0, "es": 0, "en": 0}
    for path in sorted(root.rglob("*.html")):
        counts["html"] += 1
        result = apply_file(path)
        if result.get("changed"):
            counts["changed"] += 1
        if result.get("nav"):
            counts["nav"] += 1
        lang = result.get("lang")
        if lang in {"es", "en"}:
            counts[lang] += 1
    if counts["changed"] == 0:
        raise AssertionError("R40 no modificó ningún HTML")
    if counts["nav"] == 0:
        raise AssertionError("R40 no encontró navegación principal")
    return counts


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    args = parser.parse_args()
    root = args.root.resolve()
    if not root.is_dir():
        raise FileNotFoundError(root)
    counts = apply(root)
    print(
        "R40 global:",
        f"{counts['changed']}/{counts['html']} HTML enlazados;",
        f"{counts['nav']} navegaciones;",
        f"ES={counts['es']} EN={counts['en']}",
    )


if __name__ == "__main__":
    main()
