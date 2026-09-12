#!/usr/bin/env python3
"""Conecta Tarjetas Iris con las secciones españolas sin tocar el contenido editorial.

Se ejecuta al final del build sobre dist. Añade un acceso discreto en los índices de
Situaciones, Vida diaria, Condiciones y Ayudas, y en las fichas de Situaciones,
Vida diaria y Condiciones. No modifica títulos, descripciones, fuentes ni estados.
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
        "text": "Convierte esta situación en una tarjeta breve para explicar qué te cuesta, qué te ayuda y qué necesitas.",
        "button": "Preparar esta tarjeta",
    },
    "vida": {
        "title": "Tarjeta Iris",
        "text": "Prepara una tarjeta breve para llevar a una cita, actividad o situación cotidiana.",
        "button": "Preparar una Tarjeta Iris",
    },
    "condiciones": {
        "title": "Tarjeta Iris",
        "text": "Escribe tus necesidades concretas. La tarjeta no deduce necesidades a partir de una condición.",
        "button": "Preparar una Tarjeta Iris",
    },
    "ayudas": {
        "title": "Tarjeta Iris",
        "text": "Lleva por escrito lo que necesitas pedir o explicar. La tarjeta no sustituye los documentos oficiales.",
        "button": "Preparar una Tarjeta Iris",
    },
}

INDEX_PARAMS = {
    "situaciones": {
        "section": "situaciones",
        "title": "Para una situación",
        "dificultad": "",
        "ayuda": "",
        "necesito": "",
    },
    "vida": {
        "section": "vida",
        "title": "Para una situación cotidiana",
        "dificultad": "",
        "ayuda": "",
        "necesito": "",
    },
    "condiciones": {
        "section": "condiciones",
        "title": "Mis necesidades",
        "dificultad": "",
        "ayuda": "",
        "necesito": "",
    },
    "ayudas": {
        "section": "ayudas",
        "title": "Para un trámite o una ayuda",
        "dificultad": "",
        "ayuda": "",
        "necesito": "",
    },
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
    value = " ".join(value.split()).strip("«»“”\" ")
    return value


def url_for(section: str, title: str | None = None) -> str:
    if section == "situaciones" and title:
        params = {
            "section": "situaciones",
            "title": "Para esta situación",
            "dificultad": title[:240],
            "ayuda": "",
            "necesito": "",
        }
    elif section == "vida" and title:
        params = {
            "section": "vida",
            "title": title[:60],
            "dificultad": "",
            "ayuda": "",
            "necesito": "",
        }
    elif section == "condiciones":
        params = INDEX_PARAMS["condiciones"].copy()
    else:
        params = INDEX_PARAMS[section].copy()
    return "/es/tarjetas-iris/?" + urlencode(params)


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


def add_css(text: str) -> str:
    if CSS_LINK in text:
        return text
    if "</head>" not in text:
        raise AssertionError("Página sin </head>")
    return text.replace("</head>", CSS_LINK + "\n</head>", 1)


def insert_detail(text: str, section: str, path: Path) -> str:
    if MARKER in text:
        return text
    if path.as_posix().endswith(
        "es/situaciones/necesito-que-me-repitan-las-instrucciones/index.html"
    ):
        special = re.search(
            r'<h1\b[^>]*id=["\']instruction-title["\'][^>]*>(.*?)</h1>',
            text,
            flags=re.I | re.S,
        )
        if not special:
            raise AssertionError("Ficha especial sin título de situación")
        title = html.unescape(re.sub(r"<[^>]+>", " ", special.group(1)))
        title = " ".join(title.split()).strip("«»“”\" ")
    else:
        title = plain_h1(text)
    block = cta(section, url_for(section, title))
    article_pos = text.rfind("</article>")
    if article_pos >= 0:
        # Hermana del artículo, no dentro: así la rejilla de site-v23.css la
        # coloca en la columna derecha. Dentro del artículo caía al final de la
        # página, justo donde no llega quien no lee la ficha entera.
        corte = article_pos + len("</article>")
        return text[:corte] + "\n" + block + text[corte:]

    if path.as_posix().endswith(
        "es/situaciones/necesito-que-me-repitan-las-instrucciones/index.html"
    ):
        close = text.rfind("</main>")
        if close < 0:
            raise AssertionError("Ficha especial sin </main>")
        wrapped = '<div class="wrap iris-cta-special">' + block + "</div>"
        return text[:close] + wrapped + "\n" + text[close:]

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
        match = re.search(
            r'<div class="ig-section-actions">.*?</div>',
            text,
            flags=re.I | re.S,
        )
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
            raise AssertionError(
                f"{section}: se esperaban {expected} fichas y hay {len(pages)}"
            )
        count = 0
        for path in pages:
            before = read(path)
            after = add_css(insert_detail(before, section, path))
            if after != before:
                write(path, after)
                changed.append(path.relative_to(root).as_posix())
            if after.count(MARKER) != 1:
                raise AssertionError(f"CTA duplicada o ausente: {path}")
            count += 1
        detail_counts[section] = count

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
        raise AssertionError(
            f"Se esperaban {expected_total} páginas modificadas y hay {len(set(changed))}"
        )

    print(
        json.dumps(
            {
                "detail_pages_connected": detail_counts,
                "section_indexes_connected": index_count,
                "total_pages_connected": expected_total,
                "tool_route": "/es/tarjetas-iris/",
                "home_untouched": True,
                "english_untouched": True,
            },
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()
