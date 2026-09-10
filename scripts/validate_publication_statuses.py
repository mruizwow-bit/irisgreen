#!/usr/bin/env python3
"""Retira de la salida pública (dist) todos los estados editoriales visibles.

Desde el 10-09-2026 la web no muestra estados de trabajo ni de validación: ni BORRADOR/DRAFT,
ni REVISADO/REVIEWED, ni VALIDADO/VALIDATED, ni fechas de revisión o validación editorial,
ni «Estado: …» en las fichas técnicas. Este script no convierte un estado en otro: lo elimina.
No toca descripciones, fuentes, explicaciones ni la clasificación A/B/C/BP/SG.
Conserva dos decisiones anteriores de publicación: las ocho colecciones se indexan
(robots index,follow) y los avisos de «trabajo pendiente» de Vivir fuera y Cuestionarios se
formulan como alcance de la ficha. La comprobación final la hace finalize_validation_labels.py.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def save(path: Path, before: str, after: str) -> None:
    if before != after:
        path.write_text(after, encoding="utf-8")


def rep(text: str, old: str, new: str) -> tuple[str, int]:
    return text.replace(old, new), text.count(old)


def sub(text: str, pattern: str, new: str = "", flags: int = re.S) -> tuple[str, int]:
    return re.subn(pattern, new, text, flags=flags)


def indexable(text: str) -> tuple[str, int]:
    changed = 0
    for old, new in [
        ('<meta content="noindex,follow" name="robots"/>', '<meta content="index,follow" name="robots"/>'),
        ('<meta name="robots" content="noindex,follow"/>', '<meta name="robots" content="index,follow"/>'),
    ]:
        text, n = rep(text, old, new)
        changed += n
    return text, changed


def detail_pages(root: Path, pattern: str, expected: int, label: str) -> list[Path]:
    found = sorted(p for p in root.glob(pattern) if p.is_file())
    if len(found) != expected:
        raise AssertionError(f"{label}: se esperaban {expected} fichas y hay {len(found)}")
    return found


def json_drop_status(path: Path) -> int:
    """En los JSON públicos de colección el estado es control interno: se retiran status, reviewed y la
    frase de revisión editorial del documento (Datos la guarda como elemento de una lista de párrafos)."""
    before = read(path)
    after, n = re.subn(r'\n\s*"status"\s*:\s*"[^"]*",', '', before)
    after, n2 = re.subn(r'\n\s*"reviewed"\s*:\s*"[^"]*",', '', after)
    after, n3 = re.subn(r',\n\s*"(?:status|reviewed)"\s*:\s*"[^"]*"(?=\s*\n\s*\})', '', after)
    review = r'"(?:Última (?:revisión|validación) editorial de este documento|Last editorial (?:review|validation) of this document): [^"]*"'
    after, n4 = re.subn(r'\n?\s*' + review + r',', '', after)
    after, n5 = re.subn(r',\n?\s*' + review + r'(?=\s*\])', '', after)
    json.loads(after)
    save(path, before, after)
    return n + n2 + n3 + n4 + n5


def strip_status_common(text: str, stats: dict, key: str) -> str:
    """Chips, avisos y líneas de ficha técnica que solo dicen el estado editorial."""
    for pattern in [
        r'<span class="chip lil">(?:BORRADOR|DRAFT|REVISAD[OA]|REVIEWED|VALIDAD[OA]|VALIDATED)</span>',
        r'<p class="notice">Página en borrador\.[^<]*</p>',
        r'<p class="notice">Draft (?:page|entry)\.[^<]*</p>',
        r'<li><strong>(?:Estado|Status):</strong>[^<]*</li>',
        r'<li><strong>(?:Revisión|Validación|Review|Validation):</strong>[^<]*</li>',
    ]:
        text, n = sub(text, pattern)
        stats[key] = stats.get(key, 0) + n
    return text


def strip_situation_sources(text: str, lang: str, stats: dict) -> str:
    """Bloque «Base documental y revisión»: sin fecha de revisión ni frase de estado.
    Si el bloque solo contenía el marcador de borrador generado, desaparece entero."""
    heading_old = "Base documental y revisión" if lang == "es" else "Sources and review"
    heading_new = "Base documental" if lang == "es" else "Sources"
    generated = (r'<section class="sec"><h[23]>' + heading_old + r'</h[23]><ul class="list"><li>(?:Borrador editorial generado|Editorial draft generated)[^<]*</li></ul>'
                 r'(?:<p class="muted">[^<]*</p>)?</section>')
    text, n = sub(text, generated)
    stats["situation_generated_source_blocks_removed"] = stats.get("situation_generated_source_blocks_removed", 0) + n
    for pattern in [
        r'<p class="muted">(?:Revisión editorial|Editorial review): [^<]*</p>',
        r'<p class="muted">(?:Estado|Status): [^<]*</p>',
        r'<p class="muted">[^<]*(?:no añade una validación clínica|does not add clinical validation)[^<]*</p>',
    ]:
        text, n = sub(text, pattern)
        stats["situation_status_lines_removed"] = stats.get("situation_status_lines_removed", 0) + n
    text, n = sub(text, r'<h([23])>' + heading_old + r'</h\1>', lambda m: f"<h{m.group(1)}>{heading_new}</h{m.group(1)}>")
    text, n2 = sub(text, r'<h([23])>(?:Revisión editorial|Editorial review|Base documental y validación|Sources and validation|Validación editorial|Editorial validation)</h\1>', "")
    stats["situation_headings_renamed"] = stats.get("situation_headings_renamed", 0) + n + n2
    text, n = sub(text, r'\s*data-editorial-status="[^"]*"')
    stats["editorial_status_attributes_removed"] = stats.get("editorial_status_attributes_removed", 0) + n
    return text


def validate_tree(root: Path) -> dict:
    root = root.resolve()
    stats: dict[str, int] = {}

    cond_es = detail_pages(root, "es/neurodiversidad/condiciones/*/index.html", 185, "Condiciones ES")
    cond_en = detail_pages(root, "en/neurodiversity/conditions/*/index.html", 185, "Condiciones EN")
    situations_es = detail_pages(root, "es/situaciones/*/index.html", 187, "Situaciones ES")
    situations_en = detail_pages(root, "en/situations/*/index.html", 187, "Situaciones EN")
    data_es = detail_pages(root, "es/datos/*/index.html", 49, "Datos ES")
    data_en = detail_pages(root, "en/data/*/index.html", 49, "Datos EN")
    daily_es = detail_pages(root, "es/biblioteca/*/index.html", 48, "Vida diaria ES")
    daily_en = detail_pages(root, "en/everyday-life/*/index.html", 48, "Vida diaria EN")

    index_changes = 0
    for collection in [cond_es, cond_en, situations_es, situations_en, data_es, data_en, daily_es, daily_en]:
        for path in collection:
            before = read(path)
            after, n = indexable(before)
            index_changes += n
            save(path, before, after)
    stats["robots_changed_to_index_follow"] = index_changes

    p = root / "en/neurodiversity/conditions/index.html"
    before = after = read(p)
    after, n = sub(after, r'<p class="notice">All 185 entries are mounted, in all three languages\. They all remain drafts:[^<]*</p>')
    stats["conditions_en_index_notice_removed"] = n
    after, _ = indexable(after)
    save(p, before, after)
    for p in cond_en:
        before = after = read(p)
        after = strip_status_common(after, stats, "conditions_en_status_marks_removed")
        after, n = sub(after, r'<section class="sec consult"><h2>Review</h2>.*?</section>')
        stats["conditions_en_review_blocks_removed"] = stats.get("conditions_en_review_blocks_removed", 0) + n
        save(p, before, after)

    for p in cond_es:
        before = after = read(p)
        after, n = sub(after, r'\n?<section class="sec consult" hidden=""[^>]*><h2>Última (?:revisión|validación) del texto</h2>.*?</section>')
        stats["conditions_es_hidden_review_blocks_removed"] = stats.get("conditions_es_hidden_review_blocks_removed", 0) + n
        save(p, before, after)

    for collection in (data_es, data_en):
        for p in collection:
            before = after = read(p)
            after = strip_status_common(after, stats, "data_status_marks_removed")
            save(p, before, after)
    for rel in ("es/datos/index.html", "en/data/index.html"):
        p = root / rel
        before = after = read(p)
        after, n1 = sub(after, r'<p class="notice">(?:Están montadas las 49 páginas de la sección\. Todas en borrador:|The 49 pages in this section are mounted\. All are in draft:)[^<]*</p>')
        after, n2 = sub(after, r'<p>(?:Última revisión editorial de este documento|Last editorial review of this document): [^<]*</p>')
        after, n3 = sub(after, r'<p>(?:Última validación editorial de este documento|Last editorial validation of this document): [^<]*</p>')
        stats["data_index_status_removed"] = stats.get("data_index_status_removed", 0) + n1 + n2 + n3
        after, _ = indexable(after)
        save(p, before, after)
    stats["data_json_status_keys_removed"] = json_drop_status(root / "es/datos/datos.json") + json_drop_status(root / "en/data/data.json")

    for rel, unit in (("es/biblioteca/index.html", r"fuentes?"), ("en/everyday-life/index.html", r"sources?")):
        p = root / rel
        before = after = read(p)
        after, n = sub(after, r'(<span class="meta">\d+ ' + unit + r') · (?:BORRADOR|DRAFT|REVISADA|REVIEWED|VALIDADA|VALIDATED)(</span>)', r"\1\2")
        stats["daily_card_status_removed"] = stats.get("daily_card_status_removed", 0) + n
        after, _ = indexable(after)
        save(p, before, after)
    for collection in (daily_es, daily_en):
        for p in collection:
            before = after = read(p)
            after = strip_status_common(after, stats, "daily_status_marks_removed")
            save(p, before, after)
    stats["daily_json_status_keys_removed"] = json_drop_status(root / "es/biblioteca/vida-diaria.json") + json_drop_status(root / "en/everyday-life/everyday-life.json")

    for rel in ("es/situaciones/index.html", "en/situations/index.html"):
        p = root / rel
        before = after = read(p)
        after, n = sub(after, r'\s*data-editorial-status="[^"]*"')
        stats["editorial_status_attributes_removed"] = stats.get("editorial_status_attributes_removed", 0) + n
        after, _ = indexable(after)
        save(p, before, after)
    for lang, collection in (("es", situations_es), ("en", situations_en)):
        for p in collection:
            before = after = read(p)
            after = strip_situation_sources(after, lang, stats)
            save(p, before, after)

    for rel in ("es/privacidad/index.html", "en/privacy/index.html"):
        p = root / rel
        if p.is_file():
            before = after = read(p)
            after, n = sub(after, r'\n?<p class="muted">(?:Última revisión|Última validación|Last reviewed|Last validated): [^<]*</p>')
            stats["standalone_review_dates_removed"] = stats.get("standalone_review_dates_removed", 0) + n
            save(p, before, after)

    p = root / "es/vivir-fuera/index.html"
    if p.is_file():
        before = after = read(p)
        after = after.replace('pending:"Pendiente de completar:"', 'pending:"No incluido en esta ficha:"')
        after = after.replace('pending:"Still to complete:"', 'pending:"Not included in this entry:"')
        scope_map = {
            'Las cuantías de la Prestação Social para a Inclusão y del subsídio de educação especial. Se publican cuando estén comprobadas en seg-social.pt.': 'Esta ficha no publica las cuantías de la Prestação Social para a Inclusão ni del subsídio de educação especial; deben consultarse en seg-social.pt.',
            'Las cuantías y los plazos, que varían por departamento, y el estado actual de la estrategia nacional.': 'Esta ficha no incluye cuantías ni plazos por departamento ni un seguimiento exhaustivo de la estrategia nacional.',
            'El reparto exacto de competencias, que cambia por Land.': 'Esta ficha no detalla el reparto de competencias entre todos los Länder.',
            'Los plazos reales y las cuantías vigentes.': 'Esta ficha no publica tiempos reales de espera ni cuantías vigentes.',
            'Las cuantías del INPS.': 'Esta ficha no incluye las cuantías del INPS.',
            'Todo el detalle: hay que verificarlo cantón a cantón y municipio a municipio.': 'Esta ficha no detalla las rutas de cada cantón y municipio.',
            'Las cuantías del año en curso y el detalle provincia a provincia.': 'Esta ficha no incluye las cuantías del año en curso ni el detalle provincia por provincia.',
            'Cada hito del calendario: es contenido de actualidad y se revisa en cada fecha.': 'Esta ficha no reproduce un calendario exhaustivo; los hitos cambian con la política vigente.',
            'La edición vigente de la guía y el estado actual del ministerio.': 'Esta ficha no reproduce la guía completa ni el seguimiento institucional del ministerio.',
            'The current amounts for the Prestação Social para a Inclusão and the subsídio de educação especial. They will be added once checked against seg-social.pt.': 'This entry does not publish the current amounts for the Prestação Social para a Inclusão or the subsídio de educação especial; they should be checked on seg-social.pt.',
            'Current amounts and processing times, which vary by department, and the current status of the national strategy.': 'This entry does not include department-by-department amounts or processing times, or exhaustive tracking of the national strategy.',
            'The exact division of responsibilities, which varies by Land.': 'This entry does not detail the division of responsibilities across every Land.',
            'Actual waiting times and current payment rates.': 'This entry does not publish actual waiting times or current payment rates.',
            'Current INPS payment amounts.': 'This entry does not include current INPS payment amounts.',
            'The detailed local routes still need to be checked canton by canton and municipality by municipality.': 'This entry does not detail the local routes for every canton and municipality.',
            'Current-year amounts and province-by-province detail.': 'This entry does not include current-year amounts or province-by-province detail.',
            'Each timetable milestone needs to be rechecked because this is changing policy.': 'This entry does not reproduce an exhaustive timetable because policy milestones can change.',
            'The current edition of the guideline and the present status of the ministry.': 'This entry does not reproduce the full guideline or provide exhaustive institutional tracking of the ministry.',
        }
        for old, new in scope_map.items():
            after = after.replace(old, new)
        after, n = sub(after, r'reviewed:\s*"(?:Última revisión|Última validación|Last reviewed|Last validated): [^"]*"', 'reviewed: ""')
        stats["vivir_fuera_review_dates_removed"] = n
        save(p, before, after)

    p = root / "es/cuestionarios/index.html"
    if p.is_file():
        before = after = read(p)
        after = after.replace('Pendiente de localizar una adaptación española documentada.', 'No se ha incorporado en esta ficha una adaptación española documentada.')
        after = after.replace('Queda fuera hasta que exista una adaptación española documentada.', 'No se publica en esta edición porque no se ha incorporado una adaptación española documentada.')
        after = after.replace('Faltan los ítems de la versión validada para poder publicarlo. No se reescriben ni se traducen: se copian del original.', 'No se publica en esta edición porque no se han incorporado los ítems de la versión validada. No se reescriben ni se traducen: se copian del original.')
        after = after.replace('Excluded until there is a documented Spanish adaptation.', 'Not published in this edition because a documented Spanish adaptation has not been included.')
        after = after.replace('The items from the validated version are still missing. They are not rewritten or translated: they are copied from the original.', 'Not published in this edition because the items from the validated version have not been included. They are not rewritten or translated: they are copied from the original.')
        after, n1 = sub(after, r'\n?\s*<p style="[^"]*">(?:Última revisión|Última validación): [^<]*</p>')
        after, n2 = sub(after, r'\n?\s*"(?:Última revisión|Última validación): [^"]*":\s*"(?:Last reviewed|Last validated): [^"]*",')
        stats["cuestionarios_review_dates_removed"] = n1 + n2
        save(p, before, after)

    for rel in ["es/intereses/index.html", "en/interests/index.html"]:
        p = root / rel
        if p.is_file():
            before = after = read(p)
            after = after.replace('ES?"Foto pendiente":"Photo pending"', 'ES?"Imagen no disponible":"Image unavailable"')
            save(p, before, after)

    noindex = []
    for collection in [cond_es, cond_en, situations_es, situations_en, data_es, data_en, daily_es, daily_en]:
        for p in collection:
            if 'content="noindex,follow"' in read(p):
                noindex.append(p.relative_to(root).as_posix())
    if noindex:
        raise AssertionError("Quedan fichas en noindex: " + repr(noindex[:50]))

    stats.update({
        "detail_pages_processed": sum(len(c) for c in [cond_es, cond_en, situations_es, situations_en, data_es, data_en, daily_es, daily_en]),
        "public_status_labels_added": 0,
    })
    return stats


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path("dist"))
    args = parser.parse_args()
    print(json.dumps(validate_tree(args.root), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
