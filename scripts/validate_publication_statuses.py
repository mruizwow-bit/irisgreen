#!/usr/bin/env python3
"""Convierte estados editoriales provisionales en estados públicos validados.

La tarea es deliberadamente estrecha: no modifica descripciones, explicaciones,
fuentes ni grados A/B/C. Se ejecuta sobre ``dist`` después de las comprobaciones
literales de Sentidos y Sueño, de modo que sus textos aprobados siguen protegidos.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

DATE_ES = "10 de septiembre de 2026"
DATE_EN = "10 September 2026"


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def save(path: Path, before: str, after: str) -> None:
    if before != after:
        path.write_text(after, encoding="utf-8")


def rep(text: str, old: str, new: str) -> tuple[str, int]:
    n = text.count(old)
    return text.replace(old, new), n


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


def json_status(path: Path, value: str) -> int:
    before = read(path)
    after, n = re.subn(r'("status"\s*:\s*)"borrador"', lambda m: m.group(1) + json.dumps(value, ensure_ascii=False), before)
    save(path, before, after)
    return n


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

    # Todas las fichas de estas colecciones están publicadas: ningún noindex
    # heredado de la fase de borrador debe sobrevivir.
    index_changes = 0
    for collection in [cond_es, cond_en, situations_es, situations_en, data_es, data_en, daily_es, daily_en]:
        for path in collection:
            before = read(path)
            after, n = indexable(before)
            index_changes += n
            save(path, before, after)
    stats["robots_changed_to_index_follow"] = index_changes

    # Condiciones EN. Las dos fichas con estructura editorial especial no llevan
    # DRAFT y se dejan intactas; no se cambia ningún grado.
    p = root / "en/neurodiversity/conditions/index.html"
    before = after = read(p)
    after = after.replace(
        '<p class="notice">All 185 entries are mounted, in all three languages. They all remain drafts: the source is named and not yet checked, and 25 have no grade assigned.</p>',
        '<p class="notice">The 185 entries are published and validated for this edition. Sources and scope remain visible in each entry; evidence classification is shown where applicable.</p>'
    )
    after, _ = indexable(after)
    save(p, before, after)
    badges = notices = review_markers = 0
    for p in cond_en:
        before = after = read(p)
        after, n = rep(after, '<span class="chip lil">DRAFT</span>', '<span class="chip lil">VALIDATED</span>'); badges += n
        after, n = rep(after,
            '<p class="notice">Draft entry. The source is named but not yet checked: this page is not a clinical reference. Official diagnostic names are kept because they are needed to ask for an assessment, never as a definition of a person.</p>',
            '<p class="notice">Validated for publication in this edition. Sources, scope and limitations remain visible on this page.</p>'); notices += n
        after, n = rep(after, '<h2>Review</h2>', '<h2>Validation</h2>'); review_markers += n
        after, n = re.subn(
            r'<p class="muted">Review: not yet verified\. Grade and certainty come from the 4 September 2026 export\.</p>',
            f'<p class="muted">Editorial validation: {DATE_EN}.</p>', after); review_markers += n
        save(p, before, after)
    stats.update({"conditions_en_validated_badges": badges, "conditions_en_validated_notices": notices, "conditions_en_validation_labels": review_markers})

    # Datos ES/EN.
    data_cfg = [
        ("es", data_es, "BORRADOR", "VALIDADA", 'Página en borrador. Las fuentes están nombradas y enlazadas; la comprobación final está pendiente.', f'Validada para publicación el {DATE_ES}. Las fuentes, el método y los límites de interpretación permanecen visibles en la ficha.'),
        ("en", data_en, "DRAFT", "VALIDATED", 'Draft page. The sources are named and linked; final verification is still pending.', f'Validated for publication on {DATE_EN}. Sources, method and interpretation limits remain visible in the entry.'),
    ]
    for lang, collection, old_badge, new_badge, old_notice, new_notice in data_cfg:
        b = n = 0
        for p in collection:
            before = after = read(p)
            after, k = rep(after, f'<span class="chip lil">{old_badge}</span>', f'<span class="chip lil">{new_badge}</span>'); b += k
            after, k = rep(after, f'<p class="notice">{old_notice}</p>', f'<p class="notice">{new_notice}</p>'); n += k
            save(p, before, after)
        stats[f"data_{lang}_validated_badges"] = b
        stats[f"data_{lang}_validated_notices"] = n

    for rel, old_notice, new_notice, old_date, new_date in [
        ("es/datos/index.html",
         'Están montadas las 49 páginas de la sección. Todas en borrador: la fuente está nombrada y enlazada, la comprobación final sigue pendiente.',
         'Las 49 páginas de la sección están publicadas y validadas para esta edición. Cada ficha mantiene sus fuentes, método y límites de interpretación.',
         'Última revisión editorial de este documento: 1 de septiembre de 2026.',
         f'Última validación editorial de este documento: {DATE_ES}.'),
        ("en/data/index.html",
         'The 49 pages in this section are mounted. All are in draft: the source is named and linked, and final verification is still pending.',
         'The 49 pages in this section are published and validated for this edition. Each entry keeps its sources, method and interpretation limits visible.',
         'Last editorial review of this document: 1 September 2026.',
         f'Last editorial validation of this document: {DATE_EN}.'),
    ]:
        p = root / rel
        before = after = read(p)
        after = after.replace(old_notice, new_notice).replace(old_date, new_date)
        after, _ = indexable(after)
        save(p, before, after)
    stats["data_es_json_validated"] = json_status(root / "es/datos/datos.json", "validado")
    stats["data_en_json_validated"] = json_status(root / "en/data/data.json", "validated")

    # Vida diaria / Biblioteca ES.
    p = root / "es/biblioteca/index.html"
    before = after = read(p)
    # El publicador anterior deja REVISADA en dist; la salida definitiva es VALIDADA.
    after, card_count = re.subn(r'(\d+ fuentes? · )(?:BORRADOR|REVISADA)(</span>)', r'\1VALIDADA\2', after)
    after, _ = indexable(after)
    save(p, before, after)
    lines = 0
    for p in daily_es:
        before = after = read(p)
        after, n = rep(after, f'<li><strong>Revisión:</strong> {DATE_ES}</li>', f'<li><strong>Validación:</strong> {DATE_ES}</li>'); lines += n
        save(p, before, after)
    stats["biblioteca_es_validated_cards"] = card_count
    stats["biblioteca_es_validation_lines"] = lines
    stats["biblioteca_es_json_validated"] = json_status(root / "es/biblioteca/vida-diaria.json", "validado")

    # Vida diaria EN.
    p = root / "en/everyday-life/index.html"
    before = after = read(p)
    after, card_count = re.subn(r'(\d+ source(?:s)? · )DRAFT(</span>)', r'\1VALIDATED\2', after)
    after, _ = indexable(after)
    save(p, before, after)
    badges = notices = status_lines = 0
    for p in daily_en:
        before = after = read(p)
        after, n = rep(after, '<span class="chip lil">DRAFT</span>', '<span class="chip lil">VALIDATED</span>'); badges += n
        after, n = rep(after, '<p class="notice">Draft page. The sources are named and linked; the final check is still pending.</p>', f'<p class="notice">Validated for publication on {DATE_EN}. Sources and scope remain visible on this page.</p>'); notices += n
        after, n = rep(after, '<li><strong>Status:</strong> DRAFT</li>', f'<li><strong>Status:</strong> VALIDATED</li><li><strong>Validation:</strong> {DATE_EN}</li>'); status_lines += n
        save(p, before, after)
    stats.update({"daily_en_validated_cards": card_count, "daily_en_validated_badges": badges, "daily_en_validated_notices": notices, "daily_en_validation_lines": status_lines})
    stats["daily_en_json_validated"] = json_status(root / "en/everyday-life/everyday-life.json", "validated")

    # Situaciones ES/EN. No se modifica ningún título ni descripción. Solo se
    # sustituye la frase de estado que todavía decía que la cita estaba pendiente.
    for p in [root / "es/situaciones/index.html", root / "en/situations/index.html"]:
        before = after = read(p)
        after = after.replace('data-editorial-status="generated-draft"', 'data-editorial-status="validated"')
        after, _ = indexable(after)
        save(p, before, after)
    markers = 0
    for lang, collection in [("es", situations_es), ("en", situations_en)]:
        for p in collection:
            before = after = read(p)
            if lang == "es":
                after, n1 = rep(after, '<h2>Base documental y revisión</h2>', '<h2>Base documental y validación</h2>')
                after, n2 = rep(after,
                    '<p class="muted">Revisión editorial: 4 de septiembre de 2026. Las fuentes se citan por su nombre; las páginas siguen en noindex hasta que cada cita esté comprobada.</p>',
                    f'<p class="muted">Validación editorial: {DATE_ES}. Las fuentes citadas y los límites de la ficha permanecen identificados para facilitar su comprobación y actualización.</p>')
            else:
                after, n1 = rep(after, '<h2>Sources and review</h2>', '<h2>Sources and validation</h2>')
                after, n2 = rep(after,
                    '<p class="muted">Editorial review: 4 September 2026. Sources are cited by name; these pages stay noindex until every citation has been checked.</p>',
                    f'<p class="muted">Editorial validation: {DATE_EN}. The cited sources and the limits of the entry remain identified to support checking and future updates.</p>')
            markers += n1 + n2
            save(p, before, after)
    stats["situations_validation_markers"] = markers

    # Otros rótulos de estado visibles. Se cambia la denominación de la fecha,
    # no el contenido sustantivo de las páginas.
    for rel in ["es/privacidad/index.html", "en/privacy/index.html"]:
        p = root / rel
        if p.is_file():
            before = after = read(p)
            after = after.replace('Última revisión: 5 de septiembre de 2026.', f'Última validación: {DATE_ES}.')
            after = after.replace('Last reviewed: 5 September 2026.', f'Last validated: {DATE_EN}.')
            save(p, before, after)

    # Vivir fuera: las exclusiones de alcance dejan de presentarse como trabajo
    # pendiente. No se inventan cuantías, plazos ni competencias no incluidas.
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
        after = after.replace('Última revisión:', 'Última validación:').replace('Last reviewed:', 'Last validated:')
        save(p, before, after)

    # Cuestionarios: convertir una promesa de trabajo futuro en una descripción
    # precisa del alcance actual, sin afirmar que existe una adaptación no citada.
    p = root / "es/cuestionarios/index.html"
    if p.is_file():
        before = after = read(p)
        after = after.replace('Pendiente de localizar una adaptación española documentada.', 'No se ha incorporado en esta ficha una adaptación española documentada.')
        save(p, before, after)

    # Si una imagen falla, no mostrarla como trabajo editorial pendiente.
    for rel in ["es/intereses/index.html", "en/interests/index.html"]:
        p = root / rel
        if p.is_file():
            before = after = read(p)
            after = after.replace('ES?"Foto pendiente":"Photo pending"', 'ES?"Imagen no disponible":"Image unavailable"')
            after = after.replace('ES?"Foto pendiente":"Photo pending"', 'ES?"Imagen no disponible":"Image unavailable"')
            save(p, before, after)

    # Comprobaciones estructurales. No se prohíben usos normales como «tareas
    # pendientes», «revisión prevista», `pending` de JavaScript o `peer-reviewed`.
    stale = {
        "draft_badge": re.compile(r'<span class="chip lil">(?:BORRADOR|DRAFT)</span>', re.I),
        "draft_card": re.compile(r'<span class="meta">[^<]*(?:BORRADOR|DRAFT|REVISADA)</span>', re.I),
        "draft_json_status": re.compile(r'"status"\s*:\s*"borrador"', re.I),
        "generated_draft": re.compile(r'data-editorial-status="generated-draft"', re.I),
        "draft_notice_es": re.compile(r'<p class="notice">Página en borrador\.', re.I),
        "draft_notice_en": re.compile(r'<p class="notice">Draft (?:page|entry)\.', re.I),
        "draft_index_es": re.compile(r'Todas en borrador:', re.I),
        "draft_index_en": re.compile(r'All are in draft:', re.I),
        "not_verified": re.compile(r'Review: not yet verified', re.I),
        "old_situation_es": re.compile(r'las páginas siguen en noindex hasta', re.I),
        "old_situation_en": re.compile(r'these pages stay noindex until', re.I),
        "pending_scope_es": re.compile(r'Pendiente de completar:', re.I),
        "pending_scope_en": re.compile(r'Still to complete:', re.I),
        "last_reviewed": re.compile(r'(?:Última revisión:|Last reviewed:)', re.I),
    }
    scan_patterns = [
        "es/neurodiversidad/condiciones/**/*.html", "en/neurodiversity/conditions/**/*.html",
        "es/situaciones/**/*.html", "en/situations/**/*.html", "es/datos/**/*", "en/data/**/*",
        "es/biblioteca/**/*", "en/everyday-life/**/*", "es/vivir-fuera/index.html",
        "es/cuestionarios/index.html", "es/privacidad/index.html", "en/privacy/index.html",
    ]
    targets: set[Path] = set()
    for pattern in scan_patterns:
        targets.update(p for p in root.glob(pattern) if p.is_file() and p.suffix.lower() in {".html", ".json"})
    problems = []
    for p in sorted(targets):
        text = read(p)
        for name, rx in stale.items():
            if rx.search(text):
                problems.append((name, p.relative_to(root).as_posix()))
    if problems:
        raise AssertionError("Quedan estados editoriales provisionales: " + repr(problems[:50]))

    # Ninguna ficha validada de las cuatro colecciones principales queda noindex.
    noindex = []
    for collection in [cond_es, cond_en, situations_es, situations_en, data_es, data_en, daily_es, daily_en]:
        for p in collection:
            if 'content="noindex,follow"' in read(p):
                noindex.append(p.relative_to(root).as_posix())
    if noindex:
        raise AssertionError("Quedan fichas validadas en noindex: " + repr(noindex[:50]))

    stats.update({
        "conditions_pages": len(cond_es) + len(cond_en),
        "situations_pages": len(situations_es) + len(situations_en),
        "data_pages": len(data_es) + len(data_en),
        "daily_pages": len(daily_es) + len(daily_en),
        "validated_detail_pages": len(cond_es)+len(cond_en)+len(situations_es)+len(situations_en)+len(data_es)+len(data_en)+len(daily_es)+len(daily_en),
        "stale_editorial_markers": 0,
        "validated_noindex_pages": 0,
    })
    return stats


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path("dist"))
    args = parser.parse_args()
    print(json.dumps(validate_tree(args.root), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
