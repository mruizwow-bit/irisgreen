#!/usr/bin/env python3
"""Conecta Tarjetas Iris con las secciones españolas sin tocar contenido editorial.

Se ejecuta al final del build sobre dist. En las fichas de Situaciones, Vida diaria
y Condiciones inserta una Tarjeta Iris editable directamente en la columna derecha.
En los índices conserva un acceso compacto a la herramienta completa.
"""
from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path
from urllib.parse import urlencode

CSS_LINK = '<link rel="stylesheet" href="/assets/tarjetas-iris-cta.css">'
MARKER = 'data-iris-card-cta="true"'
SPECIAL_INSTRUCTIONS = "es/situaciones/necesito-que-me-repitan-las-instrucciones/index.html"

DETAIL_SETS = (
    ("situaciones", "es/situaciones/*/index.html", 187),
    ("vida", "es/biblioteca/*/index.html", 48),
    ("condiciones", "es/neurodiversidad/condiciones/*/index.html", 185),
)

INDEX_PAGES = {
    "situaciones": "es/situaciones/index.html",
    "vida": "es/biblioteca/index.html",
    "condiciones": "es/neurodiversidad/condiciones/index.html",
    "ayudas": "es/tramites/directorio/index.html",
}

COPY = {
    "situaciones": {
        "title": "Tarjeta Iris",
        "text": "Escribe qué te cuesta, qué te ayuda y qué necesitas.",
        "button": "Abrir tarjeta para imprimir",
    },
    "vida": {
        "title": "Tarjeta Iris",
        "text": "Prepara una tarjeta breve para esta situación cotidiana.",
        "button": "Abrir tarjeta para imprimir",
    },
    "condiciones": {
        "title": "Tarjeta Iris",
        "text": "Escribe tus necesidades concretas. La tarjeta no las deduce de una condición.",
        "button": "Abrir tarjeta para imprimir",
    },
    "ayudas": {
        "title": "Tarjeta Iris",
        "text": "Lleva por escrito lo que necesitas pedir o explicar.",
        "button": "Preparar una Tarjeta Iris",
    },
}

INDEX_PARAMS = {
    "situaciones": {"section": "situaciones", "title": "Para una situación", "dificultad": "", "ayuda": "", "necesito": ""},
    "vida": {"section": "vida", "title": "Para una situación cotidiana", "dificultad": "", "ayuda": "", "necesito": ""},
    "condiciones": {"section": "condiciones", "title": "Mis necesidades", "dificultad": "", "ayuda": "", "necesito": ""},
    "ayudas": {"section": "ayudas", "title": "Para un trámite o una ayuda", "dificultad": "", "ayuda": "", "necesito": ""},
}


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8")


def plain_h1(text: str) -> str:
    match = re.search(r"<h1\b[^>]*>(.*?)</h1>", text, flags=re.I | re.S)
    if not match:
        raise AssertionError("No se encontró h1")
    value = re.sub(r"<[^>]+>", " ", match.group(1))
    value = html.unescape(value)
    return " ".join(value.split()).strip("«»“”\" ")


def detail_defaults(section: str, title: str) -> dict[str, str]:
    if section == "situaciones":
        return {
            "section": section,
            "title": "Para esta situación",
            "dificultad": title[:240],
            "ayuda": "",
            "necesito": "",
        }
    if section == "vida":
        return {
            "section": section,
            "title": title[:60],
            "dificultad": "",
            "ayuda": "",
            "necesito": "",
        }
    return {
        "section": section,
        "title": "Mis necesidades",
        "dificultad": "",
        "ayuda": "",
        "necesito": "",
    }


def url_for(section: str) -> str:
    return "/es/tarjetas-iris/?" + urlencode(INDEX_PARAMS[section])


def cta(section: str, href: str, compact: bool = False) -> str:
    item = COPY[section]
    cls = "iris-cta iris-cta-compact" if compact else "iris-cta"
    return (
        f'<section class="{cls}" data-iris-section="{section}" {MARKER}>'
        f'<div class="iris-cta-copy"><h2>{html.escape(item["title"])}</h2>'
        f'<p>{html.escape(item["text"])}</p></div>'
        f'<a class="iris-cta-button" href="{html.escape(href, quote=True)}">{html.escape(item["button"])}</a>'
        "</section>"
    )


def inline_card(section: str, title: str) -> str:
    item = COPY[section]
    defaults = detail_defaults(section, title)
    e = lambda value: html.escape(value, quote=True)
    return (
        f'<aside class="iris-cta iris-inline-card" data-iris-section="{section}" {MARKER} '
        'aria-label="Tarjeta Iris">'
        f'<div class="iris-cta-copy"><h2>{e(item["title"])}</h2><p>{e(item["text"])}</p></div>'
        '<form class="iris-inline-form" action="/es/tarjetas-iris/" method="get">'
        f'<input type="hidden" name="section" value="{e(section)}">'
        '<label class="iris-inline-field"><span>Título</span>'
        f'<input name="title" maxlength="60" value="{e(defaults["title"])}"></label>'
        '<label class="iris-inline-field"><span>Esto me cuesta</span>'
        f'<textarea name="dificultad" maxlength="240">{html.escape(defaults["dificultad"])}</textarea></label>'
        '<label class="iris-inline-field"><span>Me ayuda</span>'
        '<textarea name="ayuda" maxlength="240"></textarea></label>'
        '<label class="iris-inline-field"><span>Necesito</span>'
        '<textarea name="necesito" maxlength="240"></textarea></label>'
        f'<button class="iris-cta-button" type="submit">{e(item["button"])}</button>'
        '<p class="iris-inline-privacy">Lo que escribes no se guarda en la web.</p>'
        '</form></aside>'
    )


def add_css(text: str) -> str:
    if CSS_LINK in text:
        return text
    if "</head>" not in text:
        raise AssertionError("Página sin </head>")
    return text.replace("</head>", CSS_LINK + "\n</head>", 1)


def insert_detail(text: str, section: str, path: Path) -> str:
    if MARKER in text:
        return text
    title = plain_h1(text)
    block = inline_card(section, title)
    article_pos = text.rfind("</article>")
    if article_pos >= 0:
        corte = article_pos + len("</article>")
        return text[:corte] + "\n" + block + text[corte:]

    rel = path.as_posix().replace("\\", "/")
    if rel.endswith(SPECIAL_INSTRUCTIONS):
        request = re.search(r'<section\b[^>]*class="request-panel"[^>]*>', text, flags=re.I)
        if not request:
            raise AssertionError("Ficha especial sin panel derecho")
        return text[: request.start()] + block + "\n" + text[request.start():]

    raise AssertionError(f"No se encontró punto de inserción en {path}")


def insert_index(text: str, section: str, path: Path) -> str:
    if MARKER in text:
        return text
    block = cta(section, url_for(section), compact=True)

    if section in {"situaciones", "vida"}:
        match = re.search(r'<p class="notice">.*?</p>', text, flags=re.I | re.S)
        if match:
            return text[: match.end()] + "\n" + block + text[match.end():]
        match = re.search(r'<p class="lede">.*?</p>', text, flags=re.I | re.S)
        if match:
            return text[: match.end()] + "\n" + block + text[match.end():]

    if section == "condiciones":
        match = re.search(r'<div class="ig-section-actions">.*?</div>', text, flags=re.I | re.S)
        if match:
            return text[: match.end()] + "\n" + block + text[match.end():]
        match = re.search(r'<p class="lede">.*?</p>', text, flags=re.I | re.S)
        if match:
            return text[: match.end()] + "\n" + block + text[match.end():]

    if section == "ayudas":
        match = re.search(r"<main\b[^>]*>", text, flags=re.I)
        if match:
            return text[: match.end()] + "\n" + block + text[match.end():]

    raise AssertionError(f"No se encontró punto de inserción en {path}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path("dist"))
    args = parser.parse_args()
    root = args.root.resolve()

    changed: list[str] = []
    detail_counts: dict[str, int] = {}

    for section, pattern, expected in DETAIL_SETS:
        pages = sorted(p for p in root.glob(pattern) if p.is_file())
        if len(pages) != expected:
            raise AssertionError(f"{section}: se esperaban {expected} fichas y hay {len(pages)}")
        for path in pages:
            before = read(path)
            after = add_css(insert_detail(before, section, path))
            if after != before:
                write(path, after)
                changed.append(path.relative_to(root).as_posix())
            if after.count(MARKER) != 1 or "iris-inline-card" not in after:
                raise AssertionError(f"Tarjeta editable duplicada o ausente: {path}")
        detail_counts[section] = len(pages)

    index_count = 0
    for section, rel in INDEX_PAGES.items():
        path = root / rel
        if not path.is_file():
            raise FileNotFoundError(path)
        before = read(path)
        after = add_css(insert_index(before, section, path))
        if after != before:
            write(path, after)
            changed.append(rel)
        if after.count(MARKER) != 1:
            raise AssertionError(f"CTA de índice duplicada o ausente: {rel}")
        index_count += 1

    tool = root / "es/tarjetas-iris/index.html"
    if not tool.is_file():
        raise AssertionError("No existe /es/tarjetas-iris/ en dist")
    tool_text = read(tool)
    for token in ("#EEEBF8", "#F1E8F1", "#E9ECF7", "#ECEEF4", "IRIS GREEN"):
        if token not in tool_text:
            raise AssertionError(f"Tarjetas Iris no contiene {token}")

    expected_total = sum(v for _, _, v in DETAIL_SETS) + len(INDEX_PAGES)
    if len(set(changed)) != expected_total:
        raise AssertionError(f"Se esperaban {expected_total} páginas modificadas y hay {len(set(changed))}")

    print(json.dumps({
        "detail_pages_connected": detail_counts,
        "section_indexes_connected": index_count,
        "total_pages_connected": expected_total,
        "detail_editor": "inline-right-rail",
        "tool_route": "/es/tarjetas-iris/",
        "home_untouched": True,
        "english_untouched": True,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
