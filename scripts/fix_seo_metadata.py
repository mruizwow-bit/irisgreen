#!/usr/bin/env python3
"""Corrige metadatos SEO sin modificar contenido visible.

- Retira hreflang de páginas sin pareja real.
- Diferencia títulos de páginas distintas que compartían el mismo título.
- Sincroniza las descripciones de Situaciones con texto ya existente en buscador.json
  o, cuando allí sigue la frase genérica, con el párrafo .lede de la propia ficha.
- Corrige seis descripciones de Datos con texto ya existente y revisado.
"""
from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

ORPHAN_HREFLANG = {
    "es/lectura-accesible/index.html",
    "es/tramites/index.html",
    "es/libros/index.html",
    "es/metodologia/index.html",
    "es/investigacion/index.html",
    "es/neurodiversidad/mapa/index.html",
    "es/neurodiversidad/temas/autismo/index.html",
}

TITLE_FIXES = {
    "es/neurodiversidad/temas/autismo/index.html": (
        "Autismo en el día a día · Iris Green",
        "Autismo en el día a día — Iris Green",
    ),
    "es/datos/empleo-y-autismo/index.html": (
        "Empleo y autismo en Reino Unido · Datos",
        "Empleo y autismo en Reino Unido · Datos",
    ),
    "es/datos/empleo-y-autismo-australia/index.html": (
        "Empleo y autismo en Australia · Datos",
        "Empleo y autismo en Australia · Datos",
    ),
    "en/data/employment-and-autism-united-kingdom/index.html": (
        "Employment and autism in the United Kingdom · Data",
        "Employment and autism in the United Kingdom · Data",
    ),
    "en/data/employment-and-autism-australia/index.html": (
        "Employment and autism in Australia · Data",
        "Employment and autism in Australia · Data",
    ),
}

DATA_DESCRIPTIONS = {
    "es/datos/salud-general-y-mental/index.html": (
        "‘Salud óptima’ y ‘salud mental óptima’ son categorías del instrumento de encuesta. "
        "No equivalen a ausencia o presencia de un diagnóstico clínico."
    ),
    "en/data/general-and-mental-health/index.html": (
        "‘Excellent health’ and ‘excellent mental health’ are categories from the survey instrument. "
        "They are not equivalent to the absence or presence of a clinical diagnosis."
    ),
    "es/datos/condiciones-coexistentes-y-necesidades-educativas/index.html": (
        "Las cifras se refieren a niños y jóvenes autistas de la encuesta; el 78,1 % corresponde "
        "específicamente a quienes asistían a la escuela."
    ),
    "en/data/coexisting-conditions-and-educational-needs/index.html": (
        "The figures refer to autistic children and young people in the survey; the 78.1% specifically "
        "corresponds to those who attended school."
    ),
    "es/datos/autismo-en-la-poblacion/index.html": (
        "La cifra procede de la encuesta SDAC 2022. El aumento frente a 2018 no debe interpretarse "
        "automáticamente como aumento de incidencia."
    ),
    "en/data/autism-in-the-population/index.html": (
        "The figure comes from the SDAC 2022 survey. The increase compared with 2018 should not "
        "automatically be interpreted as an increase in incidence."
    ),
}

GENERIC_SITUATION = {
    "es": "Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.",
    "en": "This page starts from one concrete everyday situation and organises what to look at, what may help, and when support may be useful.",
}

ALT_TAG = re.compile(
    r"\s*<link\b(?=[^>]*\brel=[\"'][^\"']*\balternate\b[^\"']*[\"'])(?=[^>]*\bhreflang=[\"'][^\"']+[\"'])[^>]*?/?>\s*",
    re.I,
)
TITLE_TAG = re.compile(r"<title>.*?</title>", re.I | re.S)
META_DESCRIPTION = re.compile(r"<meta\b(?=[^>]*\bname=[\"']description[\"'])[^>]*>", re.I)
OG_TITLE = re.compile(r"<meta\b(?=[^>]*\bproperty=[\"']og:title[\"'])[^>]*>", re.I)
OG_DESCRIPTION = re.compile(r"<meta\b(?=[^>]*\bproperty=[\"']og:description[\"'])[^>]*>", re.I)
CONTENT_ATTR = re.compile(r"\bcontent=([\"']).*?\1", re.I | re.S)
LEDE = re.compile(r"<p\b(?=[^>]*\bclass=[\"'][^\"']*\blede\b[^\"']*[\"'])[^>]*>(.*?)</p>", re.I | re.S)
TAG = re.compile(r"<[^>]+>")


def normalize(value: str) -> str:
    return " ".join(value.split()).strip()


def plain_text(fragment: str) -> str:
    return normalize(html.unescape(TAG.sub(" ", fragment)))


def replace_content(tag: str, value: str) -> str:
    escaped = html.escape(value, quote=True)
    if CONTENT_ATTR.search(tag):
        return CONTENT_ATTR.sub(f'content="{escaped}"', tag, count=1)
    return tag[:-1] + f' content="{escaped}">'


def patch_description(text: str, description: str) -> str:
    text, n1 = META_DESCRIPTION.subn(lambda m: replace_content(m.group(0), description), text, count=1)
    text, n2 = OG_DESCRIPTION.subn(lambda m: replace_content(m.group(0), description), text, count=1)
    if n1 != 1 or n2 != 1:
        raise AssertionError(f"No se pudieron actualizar description/og:description ({n1}, {n2})")
    return text


def patch_title(text: str, title: str, og_title: str) -> str:
    text, n1 = TITLE_TAG.subn(f"<title>{html.escape(title)}</title>", text, count=1)
    text, n2 = OG_TITLE.subn(lambda m: replace_content(m.group(0), og_title), text, count=1)
    if n1 != 1 or n2 != 1:
        raise AssertionError(f"No se pudieron actualizar title/og:title ({n1}, {n2})")
    return text


def extract_lede(text: str, rel: str) -> str:
    match = LEDE.search(text)
    if not match:
        raise AssertionError(f"{rel}: descripción genérica sin párrafo .lede específico")
    value = plain_text(match.group(1))
    if len(value) < 40:
        raise AssertionError(f"{rel}: párrafo .lede demasiado corto")
    return value


def situation_descriptions() -> dict[str, tuple[str, str]]:
    rows = json.loads((ROOT / "buscador.json").read_text(encoding="utf-8"))
    out: dict[str, tuple[str, str]] = {}
    for row in rows:
        if row.get("s") != "Situación":
            continue
        es_url, es_desc = row.get("u"), normalize(row.get("d") or "")
        en = row.get("en") or {}
        en_url, en_desc = en.get("u"), normalize(en.get("d") or "")
        if es_url and es_desc:
            out[es_url.lstrip("/") + "index.html"] = (GENERIC_SITUATION["es"], es_desc)
        if en_url and en_desc:
            out[en_url.lstrip("/") + "index.html"] = (GENERIC_SITUATION["en"], en_desc)
    if len(out) != 374:
        raise AssertionError(f"Inventario inesperado de descripciones de Situaciones: {len(out)}")
    return out


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path("dist"))
    args = ap.parse_args()
    root = args.root.resolve()
    changed: set[str] = set()
    orphan_removed = title_changes = data_changes = situation_changes = lede_fallbacks = 0

    for rel in sorted(ORPHAN_HREFLANG):
        path = root / rel
        if not path.is_file():
            raise FileNotFoundError(path)
        old = path.read_text(encoding="utf-8", errors="strict")
        text, count = ALT_TAG.subn("\n", old)
        if count < 2:
            raise AssertionError(f"{rel}: esperaba hreflang propio + x-default; encontré {count}")
        if text != old:
            path.write_text(text, encoding="utf-8")
            changed.add(rel)
            orphan_removed += count

    for rel, (title, og_title) in TITLE_FIXES.items():
        path = root / rel
        if not path.is_file():
            raise FileNotFoundError(path)
        old = path.read_text(encoding="utf-8", errors="strict")
        text = patch_title(old, title, og_title)
        if text != old:
            path.write_text(text, encoding="utf-8")
            changed.add(rel)
            title_changes += 1

    for rel, description in DATA_DESCRIPTIONS.items():
        path = root / rel
        if not path.is_file():
            raise FileNotFoundError(path)
        old = path.read_text(encoding="utf-8", errors="strict")
        text = patch_description(old, description)
        if text != old:
            path.write_text(text, encoding="utf-8")
            changed.add(rel)
            data_changes += 1

    for rel, (generic, source_description) in situation_descriptions().items():
        path = root / rel
        if not path.is_file():
            raise FileNotFoundError(path)
        old = path.read_text(encoding="utf-8", errors="strict")
        description = source_description
        if normalize(source_description) == normalize(generic):
            description = extract_lede(old, rel)
            lede_fallbacks += 1
        text = patch_description(old, description)
        if text != old:
            path.write_text(text, encoding="utf-8")
            changed.add(rel)
            situation_changes += 1

    print(json.dumps({
        "paginas_actualizadas": len(changed),
        "hreflang_huerfanos_retirados": orphan_removed,
        "titulos_diferenciados": title_changes,
        "descripciones_datos_actualizadas": data_changes,
        "descripciones_situaciones_actualizadas": situation_changes,
        "situaciones_desde_lede_existente": lede_fallbacks,
        "contenido_visible_modificado": False,
        "contenido_nuevo_inventado": False,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
