#!/usr/bin/env python3
"""Sincroniza en staging las fuentes documentales ya publicadas de la ficha 12.

El HTML público de la ficha 12 conserva dos fuentes científicas que el catálogo
histórico ``es/datos/datos.json`` no replicaba. El build trabaja sobre una copia
temporal del repositorio, así que esta normalización corrige el artefacto y permite
eliminar la excepción del auditor sin modificar la fuente real durante el build.

La operación es deliberadamente acotada e idempotente: solo acepta la ficha 12 con
el título esperado y solo pasa de ``sources: []`` al par exacto ya publicado.
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "es/datos/datos.json"
NUMBER = 12
TITLE = "Discalculia y disgrafía: por qué no damos una cifra mundial única"
SOURCES = [
    {
        "label": "Dowker (2024) · Developmental Dyscalculia in Relation to Individual Differences in Mathematical Abilities",
        "url": "https://www.mdpi.com/2227-9067/11/6/623",
    },
    {
        "label": "Blenis (2026) · Developmental Dysgraphia in Child and Adolescent Psychiatric-Mental Health Nursing",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13379932/",
    },
]


def main() -> None:
    data = json.loads(CATALOG.read_text(encoding="utf-8", errors="strict"))
    pages = data.get("paginas")
    if not isinstance(pages, list):
        raise AssertionError("Datos: datos.json no contiene una lista paginas")

    matches = [entry for entry in pages if isinstance(entry, dict) and entry.get("n") == NUMBER]
    if len(matches) != 1:
        raise AssertionError(f"Datos: esperaba una sola ficha {NUMBER} y encontré {len(matches)}")

    entry = matches[0]
    if entry.get("title") != TITLE:
        raise AssertionError(
            f"Datos: la ficha {NUMBER} cambió de título: {entry.get('title')!r}; revisar antes de sincronizar fuentes"
        )

    current = entry.get("sources")
    if current == SOURCES:
        changed = False
    elif current == []:
        entry["sources"] = SOURCES
        changed = True
    else:
        raise AssertionError(
            "Datos: sources de la ficha 12 ya contiene información distinta; no sobrescribir automáticamente: "
            + json.dumps(current, ensure_ascii=False)
        )

    # Mantener el formato histórico de un espacio de sangría del catálogo.
    CATALOG.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(json.dumps({
        "ficha": NUMBER,
        "titulo": TITLE,
        "fuentes": len(SOURCES),
        "actualizado": changed,
        "urls": [source["url"] for source in SOURCES],
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
