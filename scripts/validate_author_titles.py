#!/usr/bin/env python3
"""Comprueba los títulos cerrados de Sentidos y Sueño sin reimponer descripciones antiguas.

Las descripciones ES/EN de las 420 fichas tienen una única autoridad editorial:
apply_accessible_descriptions_420.py. Los documentos históricos de Sentidos y Sueño
siguen protegiendo sus títulos y su mapeo de rutas, pero no pueden volver a exigir
versiones anteriores de los resúmenes.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import sentidos_author
import sueno_author

ROOT = Path(__file__).resolve().parents[1]


def check_collection(module, root: Path, name: str) -> dict:
    rows = module.approved_rows()
    catalog = json.loads((root / "buscador.json").read_text(encoding="utf-8"))
    search = {x["u"]: x for x in catalog}
    cards = {
        lang: module.card_nodes((root / path).read_text(encoding="utf-8"), path)
        for lang, path in module.INDEXES.items()
    }
    checked = []

    for row in rows:
        for lang in ("es", "en"):
            rel = row[f"{lang}_path"]
            text = (root / rel).read_text(encoding="utf-8")
            tree, article, title, lead = module.page_nodes(text)
            expected_title = row["title_es"] if lang == "es" else row["retained_title_en"]

            if tree.text(title) != expected_title:
                raise ValueError(f"Título aprobado cambiado: {rel}")
            if not tree.text(lead).strip():
                raise ValueError(f"Descripción vacía: {rel}")

            # El título también debe seguir siendo el mismo en los datos estructurados.
            for node in tree.nodes:
                if node.tag == "script" and node.attrs.get("type") == "application/ld+json":
                    stop = text.rfind("</script", node.start, node.end)
                    obj = json.loads(text[node.opening_end:stop])
                    for item in obj.get("@graph", []):
                        if item.get("@type") == "WebPage" and item.get("name") != expected_title:
                            raise ValueError(f"Título estructurado desactualizado: {rel}")

            card_tree, card_map = cards[lang]
            _, card_title, _ = card_map[module.route(rel)]
            if card_tree.text(card_title) != expected_title:
                raise ValueError(f"Título de tarjeta desactualizado: {rel}")

            record = search[module.route(row["es_path"])]
            record = record if lang == "es" else record["en"]
            if record.get("t") != expected_title:
                raise ValueError(f"Título de buscador desactualizado: {rel}")
            checked.append(rel)

    return {
        "collection": name,
        "entries": len(rows),
        "checked_pages": len(checked),
        "title_authority": "documento cerrado de la colección",
        "description_authority": "lote central de 420 descripciones ES/EN",
    }


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=ROOT)
    args = ap.parse_args()
    result = {
        "mode": "read-only",
        "collections": [
            check_collection(sentidos_author, args.root, "Sentidos"),
            check_collection(sueno_author, args.root, "Sueño"),
        ],
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
