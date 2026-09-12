#!/usr/bin/env python3
"""Conecta Tarjetas Iris con las secciones españolas sin tocar contenido editorial.

En las fichas de Situaciones, Vida diaria y Condiciones muestra la Tarjeta Iris
completa en la columna derecha, como en la referencia aprobada. El botón
«Personalizar el texto» abre la herramienta completa con el ejemplo ya cargado.
La personalización se conserva solo en el navegador de la persona.
En los índices conserva un acceso compacto a la herramienta.
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
STORAGE_MARKER = 'data-iris-card-storage="true"'
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
    "situaciones": {"title":"Tarjeta Iris","text":"Escribe qué te cuesta, qué te ayuda y qué necesitas.","button":"Preparar una Tarjeta Iris"},
    "vida": {"title":"Tarjeta Iris","text":"Prepara una tarjeta breve para esta situación cotidiana.","button":"Preparar una Tarjeta Iris"},
    "condiciones": {"title":"Tarjeta Iris","text":"Escribe tus necesidades concretas. La tarjeta no las deduce de una condición.","button":"Preparar una Tarjeta Iris"},
    "ayudas": {"title":"Tarjeta Iris","text":"Lleva por escrito lo que necesitas pedir o explicar.","button":"Preparar una Tarjeta Iris"},
}

INDEX_PARAMS = {
    "situaciones": {"section":"situaciones","title":"Para una situación","dificultad":"","ayuda":"","necesito":""},
    "vida": {"section":"vida","title":"Para una situación cotidiana","dificultad":"","ayuda":"","necesito":""},
    "condiciones": {"section":"condiciones","title":"Mis necesidades","dificultad":"","ayuda":"","necesito":""},
    "ayudas": {"section":"ayudas","title":"Para un trámite o una ayuda","dificultad":"","ayuda":"","necesito":""},
}

SAMPLE = {
    "title": "Para mi cita",
    "dificultad": "Me cuesta recordar las indicaciones cuando recibo mucha información seguida.",
    "ayuda": "Me ayuda que me expliquen una cosa cada vez y me den tiempo para preguntar.",
    "necesito": "Necesito llevarme por escrito los pasos que debo seguir.",
}


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8")


def url_for(section: str, params: dict[str,str] | None = None) -> str:
    values = (params or INDEX_PARAMS[section]).copy()
    values["section"] = section
    return "/es/tarjetas-iris/?" + urlencode(values)


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


def full_card(section: str) -> str:
    e = lambda value: html.escape(value, quote=True)
    href = url_for(section, SAMPLE)
    return (
        f'<aside class="iris-cta iris-mini-card" data-iris-section="{section}" {MARKER} '
        'aria-label="Tarjeta Iris de ejemplo">'
        '<header class="iris-mini-head"><span class="iris-mini-brand">Iris Green</span>'
        '<span class="iris-mini-type">TARJETA PERSONAL</span></header>'
        f'<h2 class="iris-mini-title">{e(SAMPLE["title"])}</h2>'
        '<section class="iris-mini-block"><h3>Esto me cuesta</h3>'
        f'<p>{e(SAMPLE["dificultad"])}</p></section>'
        '<section class="iris-mini-block"><h3>Me ayuda</h3>'
        f'<p>{e(SAMPLE["ayuda"])}</p></section>'
        '<section class="iris-mini-block iris-mini-need"><h3>Necesito</h3>'
        f'<p>{e(SAMPLE["necesito"])}</p></section>'
        f'<a class="iris-mini-button" href="{e(href)}">Personalizar el texto</a>'
        '<footer class="iris-mini-foot"><span>irisgreen.eu</span><span>Se guarda en tu navegador</span></footer>'
        '</aside>'
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
    block = full_card(section)
    article_pos = text.rfind("</article>")
    if article_pos >= 0:
        corte = article_pos + len("</article>")
        return text[:corte] + "\n" + block + text[corte:]

    rel = path.as_posix().replace("\\", "/")
    if rel.endswith(SPECIAL_INSTRUCTIONS):
        request = re.search(r'<section\b[^>]*class="request-panel"[^>]*>', text, flags=re.I)
        if not request:
            raise AssertionError("Ficha especial sin panel derecho")
        return text[:request.start()] + block + "\n" + text[request.start():]

    raise AssertionError(f"No se encontró punto de inserción en {path}")


def insert_index(text: str, section: str, path: Path) -> str:
    if MARKER in text:
        return text
    block = cta(section, url_for(section), compact=True)

    if section in {"situaciones", "vida"}:
        match = re.search(r'<p class="notice">.*?</p>', text, flags=re.I | re.S)
        if match:
            return text[:match.end()] + "\n" + block + text[match.end():]
        match = re.search(r'<p class="lede">.*?</p>', text, flags=re.I | re.S)
        if match:
            return text[:match.end()] + "\n" + block + text[match.end():]

    if section == "condiciones":
        match = re.search(r'<div class="ig-section-actions">.*?</div>', text, flags=re.I | re.S)
        if match:
            return text[:match.end()] + "\n" + block + text[match.end():]
        match = re.search(r'<p class="lede">.*?</p>', text, flags=re.I | re.S)
        if match:
            return text[:match.end()] + "\n" + block + text[match.end():]

    if section == "ayudas":
        match = re.search(r"<main\b[^>]*>", text, flags=re.I)
        if match:
            return text[:match.end()] + "\n" + block + text[match.end():]

    raise AssertionError(f"No se encontró punto de inserción en {path}")


def enable_browser_storage(tool: Path) -> None:
    text = read(tool)
    if STORAGE_MARKER in text:
        return
    script = r'''<script data-iris-card-storage="true">(function(){"use strict";
var KEY="iris-green-tarjeta-v1",ids=["title","dificultad","ayuda","necesito"];
function safeGet(){try{return JSON.parse(localStorage.getItem(KEY)||"null")}catch(e){return null}}
function snapshot(){var data={};ids.forEach(function(id){var el=document.getElementById(id);if(el)data[id]=el.value});var chosen=document.querySelector("[data-section-choice][aria-pressed=true]");data.section=chosen?chosen.dataset.sectionChoice:"situaciones";return data}
function save(){try{localStorage.setItem(KEY,JSON.stringify(snapshot()))}catch(e){}}
var params=new URLSearchParams(location.search),incoming=params.has("section")||ids.some(function(id){return params.has(id)}),saved=safeGet();
if(!incoming&&saved){ids.forEach(function(id){var el=document.getElementById(id);if(el&&typeof saved[id]==="string")el.value=saved[id].slice(0,240)});if(saved.section){var b=document.querySelector('[data-section-choice="'+saved.section+'"]');if(b)b.click()}ids.forEach(function(id){var el=document.getElementById(id);if(el)el.dispatchEvent(new Event("input",{bubbles:true}))})}
ids.forEach(function(id){var el=document.getElementById(id);if(el)el.addEventListener("input",save)});document.querySelectorAll("[data-section-choice]").forEach(function(b){b.addEventListener("click",function(){setTimeout(save,0)})});var reset=document.getElementById("reset");if(reset)reset.addEventListener("click",function(){setTimeout(save,0)});save();
})();</script>'''
    if "</body>" not in text:
        raise AssertionError("Tarjetas Iris sin </body>")
    write(tool, text.replace("</body>", script + "</body>", 1))


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path("dist"))
    args = parser.parse_args()
    root = args.root.resolve()

    changed: list[str] = []
    detail_counts: dict[str,int] = {}

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
            if after.count(MARKER) != 1 or "iris-mini-card" not in after:
                raise AssertionError(f"Tarjeta Iris duplicada o ausente: {path}")
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
    enable_browser_storage(tool)

    expected_total = sum(v for _,_,v in DETAIL_SETS) + len(INDEX_PAGES)
    if len(set(changed)) != expected_total:
        raise AssertionError(f"Se esperaban {expected_total} páginas modificadas y hay {len(set(changed))}")

    print(json.dumps({
        "detail_pages_connected": detail_counts,
        "section_indexes_connected": index_count,
        "total_pages_connected": expected_total,
        "detail_card": "approved-compact-right-rail",
        "browser_storage": True,
        "tool_route": "/es/tarjetas-iris/",
        "home_untouched": True,
        "english_untouched": True,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
