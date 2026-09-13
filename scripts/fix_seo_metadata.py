#!/usr/bin/env python3
"""Corrige metadatos SEO acotados en el artefacto final de publicación.

No crea traducciones ni contenido editorial nuevo. Quita hreflang sin pareja real,
diferencia títulos que identificaban páginas distintas con el mismo texto y sustituye
descripciones genéricas por texto ya existente en la propia ficha o en buscador.json.
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
META_DESCRIPTION = re.compile(
    r"<meta\b(?=[^>]*\bname=[\"']description[\"'])[^>]*>", re.I
)
OG_TITLE = re.compile(
    r"<meta\b(?=[^>]*\bproperty=[\"']og:title[\"'])[^>]*>", re.I
)
OG_DESCRIPTION = re.compile(
    r"<meta\b(?=[^>]*\bproperty=[\"']og:description[\"'])[^>]*>", re.I
)
CONTENT_ATTR = re.compile(r"\bcontent=([\"']).*?\1", re.I | re.S)


def replace_content(tag: str, value: str) -> str:
    escaped = html.escape(value, quote=True)
    if CONTENT_ATTR.search(tag):
        return CONTENT_ATTR.sub(f'content="{escaped}"', tag, count=1)
    return tag[:-1] + f' content="{escaped}">'


def patch_description(text: str, description: str) -> str:
    text, n1 = META_DESCRIPTION.subn(
        lambda m: replace_content(m.group(0), description), text, count=1
    )
    text, n2 = OG_DESCRIPTION.subn(
        lambda m: replace_content(m.group(0), description), text, count=1
    )
    if n1 != 1 or n2 != 1:
        raise AssertionError(f"No se pudieron actualizar description/og:description ({n1}, {n2})")
    return text


def patch_title(text: str, title: str, og_title: str) -> str:
    escaped_title = html.escape(title)
    text, n1 = TITLE_TAG.subn(f"<title>{escaped_title}</title>", text, count=1)
    text, n2 = OG_TITLE.subn(
        lambda m: replace_content(m.group(0), og_title), text, count=1
    )
    if n1 != 1 or n2 != 1:
        raise AssertionError(f"No se pudieron actualizar title/og:title ({n1}, {n2})")
    return text


def situation_descriptions() -> dict[str, tuple[str, str]]:
    data = json.loads((ROOT / "buscador.json").read_text(encoding="utf-8"))
    out: dict[str, tuple[str, str]] = {}
    for row in data:
        if row.get("s") != "Situación":
            continue
        es_url, es_desc = row.get("u"), row.get("d")
        en = row.get("en") or {}
        en_url, en_desc = en.get("u"), en.get("d")
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
    orphan_removed = 0
    title_changes = 0
    data_description_changes = 0
    situation_description_changes = 0

    for rel in sorted(ORPHAN_HREFLANG):
        path = root / rel
        if not path.is_file():
            raise FileNotFoundError(path)
        old = path.read_text(encoding="utf-8", errors="strict")
        text, count = ALT_TAG.subn("\n", old)
        if count < 2:
            raise AssertionError(f"{rel}: esperaba al menos hreflang propio + x-default; encontré {count}")
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
            data_description_changes += 1

    for rel, (generic, specific) in situation_descriptions().items():
        path = root / rel
        if not path.is_file():
            raise FileNotFoundError(path)
        old = path.read_text(encoding="utf-8", errors="strict")
        # Solo sustituimos las fichas que todavía conservan la frase genérica.
        # Las descripciones editoriales ya específicas se dejan intactas.
        if generic not in old:
            continue
        text = patch_description(old, specific)
        if text != old:
            path.write_text(text, encoding="utf-8")
            changed.add(rel)
            situation_description_changes += 1

    # Verificación acotada: no debe quedar la descripción genérica en ninguna
    # Situación que esté indexada en buscador.json.
    remaining_generic: list[str] = []
    for rel, (generic, _) in situation_descriptions().items():
        path = root / rel
        text = path.read_text(encoding="utf-8", errors="strict")
        tag = META_DESCRIPTION.search(text)
        if tag and generic in tag.group(0):
            remaining_generic.append(rel)
    if remaining_generic:
        raise AssertionError(
            "Quedan meta descriptions genéricas en Situaciones: " + ", ".join(remaining_generic[:20])
        )

    print(json.dumps({
        "paginas_actualizadas": len(changed),
        "hreflang_huerfanos_retirados": orphan_removed,
        "titulos_diferenciados": title_changes,
        "descripciones_datos_actualizadas": data_description_changes,
        "descripciones_situaciones_actualizadas": situation_description_changes,
        "contenido_nuevo_inventado": False,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
