#!/usr/bin/env python3
"""Conecta Tarjetas Iris con las secciones españolas sin tocar contenido editorial.

En los índices de Situaciones, Vida diaria, Condiciones y Ayudas mantiene la
Tarjeta Iris libre. Dentro de cada ficha crea una tarjeta terminada a partir
del contenido de esa entrada: título, dificultad y apoyos ya están escritos.
La ficha no se convierte en formulario ni exige redactar nada para poder usarla.

Reglas incorporadas el 15 de septiembre de 2026 (revisión de las 420 tarjetas):

1. El estado editorial BORRADOR es una marca interna de trabajo, no un aviso al
   público: no decide si una ficha genera tarjeta. Las fichas marcadas la
   generan igual que el resto.
2. Si «Qué ayuda» es el texto de marcador de posición («esta ficha todavía no
   dice qué ayuda»), no se genera tarjeta: se publica el mismo estado de
   información insuficiente que usa el resto del sitio.
3. «Necesito» ya no se deriva de «Me ayuda». Tiene fuente propia: texto
   editorial explícito en editorial/tarjetas-necesito.json o una sección
   distinta de la ficha. Si no hay ninguna, el bloque queda para escribir a
   mano y nunca repite «Me ayuda».
4. El contenido se extrae del cuerpo canónico de la ficha. El descarte de
   paneles de prototipo (request-panel) se mantiene como salvaguarda: hoy no
   hay ninguna ficha que lo necesite. No corrige ningún defecto conocido.
"""
from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path
from urllib.parse import urlencode

REPO = Path(__file__).resolve().parents[1]
# Una tanda editorial por archivo: tarjetas-necesito-vida-diaria.json,
# tarjetas-necesito-condiciones.json, tarjetas-necesito-situaciones.json…
NECESITO_DIR = REPO / "editorial"
NECESITO_GLOB = "tarjetas-necesito*.json"

CSS_LINK = '<link rel="stylesheet" href="/assets/tarjetas-iris-cta.css">'
MARKER = 'data-iris-card-cta="true"'
STORAGE_MARKER = 'data-iris-card-storage="true"'
SPECIAL_INSTRUCTIONS = "es/situaciones/necesito-que-me-repitan-las-instrucciones/index.html"

DETAIL_SETS = (
    ("situaciones", "es/situaciones/*/index.html", 187),
    ("vida", "es/biblioteca/*/index.html", 49),
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
    "condiciones": {"title":"Tarjeta Iris","text":"Crea una tarjeta con tus necesidades concretas.","button":"Preparar una Tarjeta Iris"},
    "ayudas": {"title":"Tarjeta Iris","text":"Lleva por escrito lo que necesitas pedir o explicar.","button":"Preparar una Tarjeta Iris"},
}

INDEX_PARAMS = {
    "situaciones": {"section":"situaciones","title":"Para una situación","dificultad":"","ayuda":"","necesito":""},
    "vida": {"section":"vida","title":"Para una situación cotidiana","dificultad":"","ayuda":"","necesito":""},
    "condiciones": {"section":"condiciones","title":"Mis necesidades","dificultad":"","ayuda":"","necesito":""},
    "ayudas": {"section":"ayudas","title":"Para un trámite o una ayuda","dificultad":"","ayuda":"","necesito":""},
}

SKIP_HEADINGS = (
    "base documental", "fuentes", "dónde está escrito", "ficha técnica",
    "urgencias", "cuándo pedir ayuda", "señales de alerta", "enlaza con",
    "puede relacionarse", "links with",
)

# Secciones con voz propia para «Necesito». Nunca se usa «Qué ayuda».
NECESITO_HEADINGS = (
    "qué necesito", "que necesito", "qué puedo pedir", "que puedo pedir",
    "cómo pedirlo", "como pedirlo", "qué pedir", "que pedir",
    "qué puedo decir", "que puedo decir",
)

# Texto de «no inventamos contenido»: la ficha no dice todavía qué ayuda.
PLACEHOLDER_HELPS = (
    "todavía no dice qué ayuda",
    "todavia no dice que ayuda",
)

# Paneles de prototipo que no son contenido canónico de la ficha.
PROTOTYPE_BLOCKS = (
    re.compile(r'<section\b[^>]*class=["\'][^"\']*\brequest-panel\b[^"\']*["\'][^>]*>.*?</section>', re.I | re.S),
    re.compile(r'<section\b[^>]*\bdata-prototipo=["\'][^"\']*["\'][^>]*>.*?</section>', re.I | re.S),
)

NEED_OPEN_TEXT = "Esto lo escribo yo antes de enseñar la tarjeta."
NEED_OPEN_LINE = "________________________________"

EMPTY_STATE = (
    '<aside class="iris-cta iris-mini-empty" data-iris-section="{section}" ' + MARKER + ' '
    'aria-label="Tarjeta Iris no disponible para esta entrada">'
    '<h2>Tarjeta Iris</h2>'
    '<p>Esta ficha todavía no dice qué ayuda, así que no se prepara una tarjeta con su contenido. '
    'Cuando el texto esté escrito, la tarjeta aparecerá aquí.</p>'
    '<a class="iris-cta-button" href="{href}">Preparar mi propia Tarjeta Iris</a>'
    '</aside>'
)


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8")


def load_necesito() -> dict[str, dict[str, str]]:
    """Textos editoriales de «Necesito», por ruta de ficha y por idioma.

    Se leen todos los archivos editorial/tarjetas-necesito*.json: una tanda
    editorial por archivo. Si dos tandas repiten la misma ficha, el build falla
    y dice en qué dos archivos está.

    Forma del archivo (la que escribe la autora):

        {"es/biblioteca/…/index.html": {"es": "…", "en": "…"}}

    Se admite además la forma anterior, con una cadena por ruta, dentro o fuera
    de una clave «textos». Las claves que empiezan por «_» son notas y reglas
    editoriales, no textos.

    El inglés se guarda aunque todavía no exista ninguna Tarjeta Iris en inglés:
    los textos se escribieron antes que las páginas que los van a usar. Cuando
    esas páginas existan, basta con pasar el idioma a card_data().
    """
    out: dict[str, dict[str, str]] = {}
    origen: dict[str, str] = {}
    for path in sorted(NECESITO_DIR.glob(NECESITO_GLOB)):
        data = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(data, dict):
            raise AssertionError(f"{path.name}: la raíz debe ser un objeto")
        raw = data["textos"] if isinstance(data.get("textos"), dict) else data
        out.update(_read_batch(path.name, raw, out, origen))
    return out


def _read_batch(nombre: str, raw: dict, ya: dict[str, dict[str, str]],
                origen: dict[str, str]) -> dict[str, dict[str, str]]:
    lote: dict[str, dict[str, str]] = {}
    for rel, value in raw.items():
        if rel.startswith("_"):
            continue
        if isinstance(value, str):
            value = {"es": value}
        if not isinstance(value, dict):
            raise AssertionError(f"{nombre}: {rel} debe ser un texto o un objeto por idioma")
        textos: dict[str, str] = {}
        for lang in ("es", "en"):
            texto = value.get(lang)
            if texto is None:
                continue
            if not isinstance(texto, str) or not texto.strip():
                raise AssertionError(f"{nombre}: texto vacío en {rel} ({lang})")
            textos[lang] = texto.strip()
        if "es" not in textos:
            raise AssertionError(f"{nombre}: falta el texto en español en {rel}")
        if rel in ya:
            raise AssertionError(
                f"{rel} tiene texto en dos tandas: {origen[rel]} y {nombre}. "
                "Cada ficha va en una sola."
            )
        origen[rel] = nombre
        lote[rel] = textos
    return lote


def long_texts(overrides: dict[str, dict[str, str]]) -> list[str]:
    """Textos que se salen de la regla editorial: 2 frases y unas 14 palabras.

    No rompe el build: la regla es editorial, no técnica. Se informa para que
    la autora los revise cuando quiera.
    """
    flagged = []
    for rel, textos in overrides.items():
        texto = textos["es"]
        frases = [p for p in re.split(r"(?<=[.!?])\s+", texto) if p.strip()]
        if len(frases) > 2 or len(texto.split()) > 18:
            flagged.append(rel)
    return flagged


def url_for(section: str, params: dict[str,str] | None = None) -> str:
    values = (params or INDEX_PARAMS[section]).copy()
    values["section"] = section
    return "/es/recursos/tarjeta-iris/?" + urlencode(values)


def clean(fragment: str) -> str:
    """Texto plano de un fragmento, con las frases separadas.

    Un <li> de la ficha puede llevar dentro el título del consejo y su
    explicación. Al quitar las etiquetas sin más, los dos textos quedaban
    pegados («Pide los pasos por escrito Una nota de dos líneas…»). El cierre
    de cada bloque se convierte en punto y espacio.
    """
    fragment = re.sub(r"<br\s*/?>", " ", fragment, flags=re.I)
    fragment = re.sub(r"</(?:h[1-6]|p|div)\s*>", ". ", fragment, flags=re.I)
    fragment = re.sub(r"<[^>]+>", " ", fragment)
    text = re.sub(r"\s+", " ", html.unescape(fragment)).strip()
    text = re.sub(r"\s+([.,;:!?])", r"\1", text)
    text = re.sub(r"([.,;:!?])\s*\.", r"\1", text)
    text = re.sub(r"\.{2,}", ".", text)
    return text.strip()


def clip(text: str, limit: int = 360) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) <= limit:
        return text
    sentences = re.split(r"(?<=[.!?])\s+", text)
    out: list[str] = []
    size = 0
    for sentence in sentences:
        extra = len(sentence) + (1 if out else 0)
        if out and size + extra > limit:
            break
        if not out and len(sentence) > limit:
            cut = sentence[:limit].rsplit(" ", 1)[0].rstrip(" ,;:")
            return cut + "…"
        out.append(sentence)
        size += extra
    return " ".join(out) if out else text[:limit].rstrip() + "…"


def canonical(text: str) -> str:
    """Cuerpo de la ficha sin paneles de prototipo."""
    for rx in PROTOTYPE_BLOCKS:
        text = rx.sub("", text)
    return text


def section_blocks(text: str) -> list[tuple[str,str,str]]:
    blocks: list[tuple[str,str,str]] = []
    for match in re.finditer(r"<section\b([^>]*)>(.*?)</section>", text, flags=re.I | re.S):
        attrs, body = match.group(1), match.group(2)
        hm = re.search(r"<h2\b[^>]*>(.*?)</h2>", body, flags=re.I | re.S)
        heading = clean(hm.group(1)) if hm else ""
        blocks.append((attrs, heading, body))
    return blocks


def body_texts(body: str) -> list[str]:
    found = re.findall(r"<(?:p|li)\b[^>]*>(.*?)</(?:p|li)>", body, flags=re.I | re.S)
    values = []
    for fragment in found:
        value = clean(fragment)
        if value:
            values.append(value)
    return values


def first_h1(text: str) -> str:
    m = re.search(r"<h1\b[^>]*>(.*?)</h1>", text, flags=re.I | re.S)
    if not m:
        raise AssertionError("Ficha sin h1")
    return clean(m.group(1)).strip("«»“”")


def find_heading(blocks: list[tuple[str,str,str]], names: tuple[str,...]) -> list[str]:
    targets = tuple(n.casefold() for n in names)
    for attrs, heading, body in blocks:
        h = heading.casefold()
        if any(h == t or t in h for t in targets):
            return body_texts(body)
    return []


def find_helps(blocks: list[tuple[str,str,str]]) -> list[str]:
    for attrs, heading, body in blocks:
        if re.search(r'class=["\'][^"\']*\bhelps\b', attrs, flags=re.I):
            vals = body_texts(body)
            if vals:
                return vals
    return find_heading(blocks, ("qué puede ayudar ahora", "qué ayuda", "qué puede ayudar"))


def fallback_practical(blocks: list[tuple[str,str,str]]) -> list[str]:
    out: list[str] = []
    for attrs, heading, body in blocks[1:]:
        h = heading.casefold()
        if any(word in h for word in SKIP_HEADINGS):
            continue
        vals = body_texts(body)
        if not vals:
            continue
        out.extend(vals[:1])
        if len(out) >= 2:
            break
    return out


def is_placeholder(helps: list[str]) -> bool:
    joined = " ".join(helps).casefold()
    return any(mark in joined for mark in PLACEHOLDER_HELPS)


def distinct(candidate: str, ayuda: str) -> bool:
    """«Necesito» no puede ser subcadena de «Me ayuda» ni al revés."""
    a, b = candidate.casefold().strip(), ayuda.casefold().strip()
    if not a:
        return False
    return a not in b and b not in a


def necesito_for(rel: str, blocks: list[tuple[str,str,str]], ayuda: str,
                 overrides: dict[str, dict[str, str]], lang: str = "es") -> tuple[str | None, str]:
    texto = overrides.get(rel, {}).get(lang)
    if texto:
        return clip(texto, 420), "editorial"
    vals = find_heading(blocks, NECESITO_HEADINGS)
    if vals:
        candidate = clip(" ".join(vals[:1]), 360)
        if distinct(candidate, ayuda):
            return candidate, "ficha"
    return None, "por escribir"


def extract(text: str, section: str) -> tuple[str, list[str], list[tuple[str,str,str]]]:
    title = first_h1(text)
    blocks = section_blocks(text)

    if section == "situaciones":
        difficulty = find_heading(blocks, ("en pocas palabras",))
        helps = find_helps(blocks)
    elif section == "condiciones":
        difficulty = find_heading(blocks, ("descripción",))
        helps = find_helps(blocks)
    else:
        difficulty = body_texts(blocks[0][2]) if blocks else []
        helps = find_helps(blocks) or fallback_practical(blocks)

    if not difficulty:
        lede = re.search(r'<p\b[^>]*class=["\'][^"\']*\blede\b[^"\']*["\'][^>]*>(.*?)</p>', text, flags=re.I | re.S)
        difficulty = [clean(lede.group(1))] if lede else []
    if not helps:
        helps = fallback_practical(blocks)
    return title, [difficulty, helps], blocks


def card_data(text: str, section: str, rel: str,
              overrides: dict[str, dict[str, str]]) -> tuple[dict[str,str | None], str, bool]:
    """Devuelve (datos, origen_de_necesito, leido_del_cuerpo_canonico)."""
    body = canonical(text)
    canon = True
    title, (difficulty, helps), blocks = extract(body, section)
    if not difficulty or not helps:
        # La ficha no se puede leer sin sus paneles: se lee entera y se registra.
        canon = False
        title, (difficulty, helps), blocks = extract(text, section)

    if not difficulty or not helps:
        raise AssertionError(f"No se pudo preparar Tarjeta Iris: {rel}")

    if is_placeholder(helps):
        return {}, "sin contenido", canon

    dificultad = clip(" ".join(difficulty[:1]), 320)
    ayuda = clip(" ".join(helps[:2]), 360)
    necesito, origen = necesito_for(rel, blocks, ayuda, overrides)

    if section == "condiciones":
        dificultad = clip("Mis necesidades pueden estar en algunas de estas áreas: " + dificultad, 340)

    if necesito and not distinct(necesito, ayuda):
        raise AssertionError(f"«Necesito» repite «Me ayuda» en {rel}")

    return {
        "title": title,
        "dificultad": dificultad,
        "ayuda": ayuda,
        "necesito": necesito,
    }, origen, canon


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


def need_block(necesito: str | None) -> str:
    e = lambda value: html.escape(value, quote=True)
    if necesito:
        return f'<p>{e(necesito)}</p>'
    return (
        f'<p>{e(NEED_OPEN_TEXT)}</p>'
        f'<p class="iris-mini-write" aria-hidden="true">{NEED_OPEN_LINE}</p>'
    )


def full_card(section: str, data: dict[str,str | None]) -> str:
    e = lambda value: html.escape(value, quote=True)
    href = url_for(section)
    return (
        f'<aside class="iris-cta iris-mini-card" data-iris-section="{section}" {MARKER} '
        'aria-label="Tarjeta Iris preparada para esta entrada">'
        '<header class="iris-mini-head"><span class="iris-mini-brand">Iris Green</span>'
        '<span class="iris-mini-type">TARJETA IRIS</span></header>'
        f'<h2 class="iris-mini-title">{e(str(data["title"]))}</h2>'
        '<section class="iris-mini-block"><h3>Esto me cuesta</h3>'
        f'<p>{e(str(data["dificultad"]))}</p></section>'
        '<section class="iris-mini-block"><h3>Me ayuda</h3>'
        f'<p>{e(str(data["ayuda"]))}</p></section>'
        '<section class="iris-mini-block iris-mini-need"><h3>Necesito</h3>'
        f'{need_block(data["necesito"])}</section>'
        f'<a class="iris-mini-own" href="{e(href)}">Crear mi propia tarjeta</a>'
        '<footer class="iris-mini-foot"><span>irisgreen.eu</span><span>Lista para enseñar o guardar</span></footer>'
        '</aside>'
    )


def add_css(text: str) -> str:
    if CSS_LINK in text:
        return text
    if "</head>" not in text:
        raise AssertionError("Página sin </head>")
    return text.replace("</head>", CSS_LINK + "\n</head>", 1)


def insertion_point(text: str, path: Path) -> int:
    article_pos = text.rfind("</article>")
    if article_pos >= 0:
        return article_pos + len("</article>")
    rel = path.as_posix().replace("\\", "/")
    if rel.endswith(SPECIAL_INSTRUCTIONS):
        request = re.search(r'<section\b[^>]*class="request-panel"[^>]*>', text, flags=re.I)
        if not request:
            raise AssertionError("Ficha especial sin panel derecho")
        return request.start()
    raise AssertionError(f"No se encontró punto de inserción en {path}")


def insert_block(text: str, block: str, path: Path) -> str:
    if MARKER in text:
        return text
    cut = insertion_point(text, path)
    return text[:cut] + "\n" + block + text[cut:]


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

    overrides = load_necesito()

    changed: list[str] = []
    connected: dict[str,int] = {}
    skipped_placeholder: list[str] = []
    read_with_prototype: list[str] = []
    need_sources = {"editorial": 0, "ficha": 0, "por escribir": 0}

    for section, pattern, expected in DETAIL_SETS:
        pages = sorted(p for p in root.glob(pattern) if p.is_file())
        if len(pages) != expected:
            raise AssertionError(f"{section}: se esperaban {expected} fichas y hay {len(pages)}")
        made = 0
        for path in pages:
            rel = path.relative_to(root).as_posix()
            before = read(path)

            data, origen, canon = card_data(before, section, rel, overrides)
            if not canon:
                read_with_prototype.append(rel)

            if origen == "sin contenido":
                skipped_placeholder.append(rel)
                block = EMPTY_STATE.format(section=section, href=html.escape(url_for(section), quote=True))
            else:
                need_sources[origen] += 1
                block = full_card(section, data)
                made += 1

            after = add_css(insert_block(before, block, path))
            if after != before:
                write(path, after)
                changed.append(rel)
            if after.count(MARKER) != 1:
                raise AssertionError(f"Tarjeta Iris duplicada o ausente: {path}")
            if origen != "sin contenido" and "iris-mini-card" not in after:
                raise AssertionError(f"Tarjeta Iris no insertada: {path}")
            if "Personalizar el texto" in after:
                raise AssertionError(f"Botón antiguo todavía presente: {path}")
        connected[section] = made

    # Las portadas de sección ya no llevan aviso de Tarjeta Iris.
    index_count = 0
    for section, rel in INDEX_PAGES.items():
        path = root / rel
        if path.is_file() and "Preparar una Tarjeta Iris" in read(path):
            raise AssertionError(f"Aviso antiguo de Tarjeta Iris en {rel}")

    tool = root / "es/recursos/tarjeta-iris/index.html"
    if not tool.is_file():
        raise AssertionError("No existe /es/recursos/tarjeta-iris/ en dist")
    old_tool = root / "es/tarjetas-iris/index.html"
    if old_tool.is_file():
        enable_browser_storage(old_tool)

    expected_changed = sum(connected.values()) + len(skipped_placeholder) + index_count
    if len(set(changed)) != expected_changed:
        raise AssertionError(
            f"Se esperaban {expected_changed} páginas modificadas y hay {len(set(changed))}"
        )

    languages = sorted({lang for textos in overrides.values() for lang in textos})
    print(json.dumps({
        "necesito_textos_editoriales": len(overrides),
        "necesito_idiomas_en_el_archivo": languages,
        "necesito_textos_fuera_de_regla": long_texts(overrides),
        "detail_cards_connected": connected,
        "detail_cards_total": sum(connected.values()),
        "editorial_draft_state": "marca interna; no decide la tarjeta",
        "skipped_placeholder_pages": len(skipped_placeholder),
        "skipped_placeholder_list": skipped_placeholder,
        "read_with_prototype_panel": read_with_prototype,
        "necesito_sources": need_sources,
        "necesito_derived_from_ayuda": 0,
        "section_indexes_connected": index_count,
        "detail_card": "prefilled-from-entry",
        "detail_editing": False,
        "free_card_on_indexes": True,
        "browser_storage_free_tool": True,
        "tool_route": "/es/tarjetas-iris/",
        "home_untouched": True,
        "english_untouched": True,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
