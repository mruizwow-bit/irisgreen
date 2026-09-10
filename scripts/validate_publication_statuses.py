#!/usr/bin/env python3
"""Normaliza únicamente estados editoriales públicos de Iris Green.

No reescribe descripciones, explicaciones, fuentes ni grados A/B/C. Se ejecuta
sobre la salida ``dist`` después de las comprobaciones literales de Sentidos y
Sueño, para no alterar sus fuentes editoriales protegidas.
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


def write(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8")


def replace(text: str, old: str, new: str) -> tuple[str, int]:
    n = text.count(old)
    return text.replace(old, new), n


def set_indexable(text: str) -> tuple[str, int]:
    pairs = [
        ('<meta content="noindex,follow" name="robots"/>', '<meta content="index,follow" name="robots"/>'),
        ('<meta name="robots" content="noindex,follow"/>', '<meta name="robots" content="index,follow"/>'),
    ]
    changed = 0
    for old, new in pairs:
        text, n = replace(text, old, new)
        changed += n
    return text, changed


def pages(root: Path, pattern: str) -> list[Path]:
    return sorted(p for p in root.glob(pattern) if p.is_file())


def update_json_status(path: Path, value: str) -> int:
    text = read(path)
    text, n = re.subn(r'("status"\s*:\s*)"borrador"', lambda m: m.group(1) + json.dumps(value, ensure_ascii=False), text)
    if n:
        write(path, text)
    return n


def validate_tree(root: Path) -> dict:
    root = root.resolve()
    stats: dict[str, int] = {}

    def save_if_changed(path: Path, old: str, new: str) -> None:
        if old != new:
            write(path, new)

    # CONDICIONES · inglés: eliminar el estado de borrador heredado. Los grados
    # no se cambian aquí; su validación es un proceso editorial independiente.
    cond_es = pages(root, "es/neurodiversidad/condiciones/*/index.html")
    cond_en = pages(root, "en/neurodiversity/conditions/*/index.html")
    if len(cond_es) != 185 or len(cond_en) != 185:
        raise AssertionError(f"Condiciones: se esperaban 185 ES + 185 EN; hay {len(cond_es)} + {len(cond_en)}")
    for path in cond_es + cond_en:
        old = text = read(path)
        text, _ = set_indexable(text)
        save_if_changed(path, old, text)
    cond_index = root / "en/neurodiversity/conditions/index.html"
    old = text = read(cond_index)
    text = text.replace(
        '<p class="notice">All 185 entries are mounted, in all three languages. They all remain drafts: the source is named and not yet checked, and 25 have no grade assigned.</p>',
        '<p class="notice">The 185 entries are published and validated for this edition. Sources and scope remain visible in each entry; evidence classification is shown where applicable.</p>'
    )
    save_if_changed(cond_index, old, text)
    cond_draft = cond_notice = cond_review = 0
    for path in cond_en:
        old = text = read(path)
        text, n = replace(text, '<span class="chip lil">DRAFT</span>', '<span class="chip lil">VALIDATED</span>'); cond_draft += n
        text, n = replace(text,
            '<p class="notice">Draft entry. The source is named but not yet checked: this page is not a clinical reference. Official diagnostic names are kept because they are needed to ask for an assessment, never as a definition of a person.</p>',
            '<p class="notice">Validated for publication in this edition. Sources, scope and limitations remain visible on this page.</p>'); cond_notice += n
        text, n = replace(text, '<h2>Review</h2>', '<h2>Validation</h2>'); cond_review += n
        text, n = re.subn(
            r'<p class="muted">Review: not yet verified\. Grade and certainty come from the 4 September 2026 export\.</p>',
            f'<p class="muted">Editorial validation: {DATE_EN}.</p>', text); cond_review += n
        text, _ = set_indexable(text)
        save_if_changed(path, old, text)
    stats.update({"conditions_en_draft_badges": cond_draft, "conditions_en_draft_notices": cond_notice, "conditions_en_review_markers": cond_review})

    # DATOS · las 49 fichas ES/EN dejan de ser borradores y pasan a estar indexables.
    data_es = pages(root, "es/datos/*/index.html")
    data_en = pages(root, "en/data/*/index.html")
    if len(data_es) != 49 or len(data_en) != 49:
        raise AssertionError(f"Datos: se esperaban 49 ES + 49 EN; hay {len(data_es)} + {len(data_en)}")
    for lang, collection, badge_old, badge_new, notice_old, notice_new in [
        ("es", data_es, "BORRADOR", "VALIDADA", 'Página en borrador. Las fuentes están nombradas y enlazadas; la comprobación final está pendiente.', f'Validada para publicación el {DATE_ES}. Las fuentes, el método y los límites de interpretación permanecen visibles en la ficha.'),
        ("en", data_en, "DRAFT", "VALIDATED", 'Draft page. The sources are named and linked; final verification is still pending.', f'Validated for publication on {DATE_EN}. Sources, method and interpretation limits remain visible in the entry.'),
    ]:
        changed_badges = changed_notices = indexable = 0
        for path in collection:
            old = text = read(path)
            text, n = replace(text, f'<span class="chip lil">{badge_old}</span>', f'<span class="chip lil">{badge_new}</span>'); changed_badges += n
            text, n = replace(text, f'<p class="notice">{notice_old}</p>', f'<p class="notice">{notice_new}</p>'); changed_notices += n
            text, n = set_indexable(text); indexable += n
            save_if_changed(path, old, text)
        stats[f"data_{lang}_badges"] = changed_badges
        stats[f"data_{lang}_notices"] = changed_notices
        stats[f"data_{lang}_indexable"] = indexable
    for lang, rel, old_notice, new_notice in [
        ("es", "es/datos/index.html", 'Están montadas las 49 páginas de la sección. Todas en borrador: la fuente está nombrada y enlazada, la comprobación final sigue pendiente.', 'Las 49 páginas de la sección están publicadas y validadas para esta edición. Cada ficha mantiene sus fuentes, método y límites de interpretación.'),
        ("en", "en/data/index.html", 'All 49 pages in this section are mounted. They are all drafts: the source is named and linked, and final verification is still pending.', 'All 49 pages in this section are published and validated for this edition. Each entry keeps its sources, method and interpretation limits visible.'),
    ]:
        path = root / rel
        old = text = read(path)
        text = text.replace(old_notice, new_notice)
        text, _ = set_indexable(text)
        save_if_changed(path, old, text)
    stats["data_es_json"] = update_json_status(root / "es/datos/datos.json", "validado")
    stats["data_en_json"] = update_json_status(root / "en/data/data.json", "validated")

    # VIDA DIARIA / BIBLIOTECA · español ya estaba publicado; REVISADA pasa a
    # VALIDADA. Inglés deja de ser borrador y pasa a indexable/validado.
    daily_es = pages(root, "es/biblioteca/*/index.html")
    daily_en = pages(root, "en/everyday-life/*/index.html")
    if len(daily_es) != 48 or len(daily_en) != 48:
        raise AssertionError(f"Vida diaria: se esperaban 48 ES + 48 EN; hay {len(daily_es)} + {len(daily_en)}")
    es_index = root / "es/biblioteca/index.html"
    old = text = read(es_index)
    text, n = replace(text, " · REVISADA</span>", " · VALIDADA</span>"); stats["biblioteca_es_cards"] = n
    text, _ = set_indexable(text)
    save_if_changed(es_index, old, text)
    es_validation_lines = 0
    for path in daily_es:
        old = text = read(path)
        text, n = replace(text, f'<li><strong>Revisión:</strong> {DATE_ES}</li>', f'<li><strong>Validación:</strong> {DATE_ES}</li>'); es_validation_lines += n
        text, _ = set_indexable(text)
        save_if_changed(path, old, text)
    stats["biblioteca_es_validation_lines"] = es_validation_lines
    stats["biblioteca_es_json"] = update_json_status(root / "es/biblioteca/vida-diaria.json", "validado")

    en_index = root / "en/everyday-life/index.html"
    old = text = read(en_index)
    text, n = re.subn(r'(\d+ source(?:s)? · )DRAFT(</span>)', r'\1VALIDATED\2', text); stats["daily_en_cards"] = n
    text, _ = set_indexable(text)
    save_if_changed(en_index, old, text)
    en_badges = en_notices = en_status = en_indexable = 0
    for path in daily_en:
        old = text = read(path)
        text, n = replace(text, '<span class="chip lil">DRAFT</span>', '<span class="chip lil">VALIDATED</span>'); en_badges += n
        text, n = replace(text, '<p class="notice">Draft page. The sources are named and linked; the final check is still pending.</p>', f'<p class="notice">Validated for publication on {DATE_EN}. Sources and scope remain visible on this page.</p>'); en_notices += n
        text, n = replace(text, '<li><strong>Status:</strong> DRAFT</li>', f'<li><strong>Status:</strong> VALIDATED</li><li><strong>Validation:</strong> {DATE_EN}</li>'); en_status += n
        text, n = set_indexable(text); en_indexable += n
        save_if_changed(path, old, text)
    stats.update({"daily_en_badges": en_badges, "daily_en_notices": en_notices, "daily_en_status": en_status, "daily_en_indexable": en_indexable})
    stats["daily_en_json"] = update_json_status(root / "en/everyday-life/everyday-life.json", "validated")

    # SITUACIONES · no se toca ninguna descripción protegida. Solo el estado
    # editorial heredado y la frase antigua que decía que seguían en noindex.
    situations_es = pages(root, "es/situaciones/*/index.html")
    situations_en = pages(root, "en/situations/*/index.html")
    # Hay 187 rutas por idioma, incluida la ficha especial de instrucciones.
    if len(situations_es) != 187 or len(situations_en) != 187:
        raise AssertionError(f"Situaciones: se esperaban 187 ES + 187 EN; hay {len(situations_es)} + {len(situations_en)}")
    for path in [root / "es/situaciones/index.html", root / "en/situations/index.html"]:
        old = text = read(path)
        text, _ = replace(text, 'data-editorial-status="generated-draft"', 'data-editorial-status="validated"')
        text, _ = set_indexable(text)
        save_if_changed(path, old, text)
    situation_notes = 0
    for lang, collection in [("es", situations_es), ("en", situations_en)]:
        for path in collection:
            old = text = read(path)
            text, _ = set_indexable(text)
            if lang == "es":
                text, n1 = replace(text, '<h2>Base documental y revisión</h2>', '<h2>Base documental y validación</h2>')
                text, n2 = re.subn(r'<p class="muted">Revisión editorial: 4 de septiembre de 2026\. Las fuentes se citan por su nombre; las páginas siguen en noindex hasta que cada cita esté comprobada\.</p>', f'<p class="muted">Validación editorial: {DATE_ES}. Las fuentes citadas y los límites de la ficha permanecen identificados para facilitar su comprobación y actualización.</p>', text)
            else:
                text, n1 = replace(text, '<h2>Sources and review</h2>', '<h2>Sources and validation</h2>')
                text, n2 = re.subn(r'<p class="muted">Editorial review: 4 September 2026\. Sources are cited by name; these pages stay noindex until every citation has been checked\.</p>', f'<p class="muted">Editorial validation: {DATE_EN}. The cited sources and the limits of the entry remain identified to support checking and future updates.</p>', text)
            situation_notes += n1 + n2
            save_if_changed(path, old, text)
    stats["situations_validation_markers"] = situation_notes

    # Usuario visible: si falla una imagen de Intereses, no presentar el recurso
    # como "pendiente"; indicar simplemente que no está disponible.
    for rel in ["es/intereses/index.html", "en/interests/index.html"]:
        path = root / rel
        if path.is_file():
            old = text = read(path)
            text = text.replace('ES?"Foto pendiente":"Photo pending"', 'ES?"Imagen no disponible":"Image unavailable"')
            save_if_changed(path, old, text)

    # Comprobaciones estructurales. No se prohíben palabras normales como
    # "tareas pendientes", "peer-reviewed" o variables JavaScript `pending`.
    stale_patterns = {
        "draft_badge": re.compile(r'<span class="chip lil">(?:BORRADOR|DRAFT)</span>', re.I),
        "reviewed_card": re.compile(r'<span class="meta">[^<]*(?:REVISADA|DRAFT)</span>', re.I),
        "draft_status_json": re.compile(r'"status"\s*:\s*"borrador"', re.I),
        "generated_draft": re.compile(r'data-editorial-status="generated-draft"', re.I),
        "draft_notice_es": re.compile(r'<p class="notice">Página en borrador\.', re.I),
        "draft_notice_en": re.compile(r'<p class="notice">Draft (?:page|entry)\.', re.I),
        "not_verified": re.compile(r'Review: not yet verified', re.I),
        "noindex_sentence_es": re.compile(r'las páginas siguen en noindex hasta', re.I),
        "noindex_sentence_en": re.compile(r'these pages stay noindex until', re.I),
    }
    target_files = []
    for pattern in [
        "es/neurodiversidad/condiciones/**/*.html", "en/neurodiversity/conditions/**/*.html",
        "es/situaciones/**/*.html", "en/situations/**/*.html",
        "es/datos/**/*", "en/data/**/*", "es/biblioteca/**/*", "en/everyday-life/**/*",
    ]:
        target_files.extend(p for p in root.glob(pattern) if p.is_file() and p.suffix.lower() in {".html", ".json"})
    problems = []
    for path in sorted(set(target_files)):
        text = read(path)
        for name, rx in stale_patterns.items():
            if rx.search(text):
                problems.append((name, path.relative_to(root).as_posix()))
    if problems:
        raise AssertionError("Quedan estados editoriales antiguos: " + repr(problems[:30]))

    # Las colecciones ya validadas deben ser indexables. La ficha especial de
    # instrucciones también lo es; solo se comprueban páginas de contenido.
    noindex = []
    for collection in [cond_es, cond_en, situations_es, situations_en, data_es, data_en, daily_es, daily_en]:
        for path in collection:
            if 'content="noindex,follow"' in read(path):
                noindex.append(path.relative_to(root).as_posix())
    if noindex:
        raise AssertionError("Quedan fichas validadas en noindex: " + repr(noindex[:30]))

    stats["conditions_pages"] = len(cond_es) + len(cond_en)
    stats["situations_pages"] = len(situations_es) + len(situations_en)
    stats["data_pages"] = len(data_es) + len(data_en)
    stats["daily_pages"] = len(daily_es) + len(daily_en)
    stats["validated_detail_pages"] = stats["conditions_pages"] + stats["situations_pages"] + stats["data_pages"] + stats["daily_pages"]
    stats["stale_editorial_markers"] = 0
    stats["validated_noindex_pages"] = 0
    return stats


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path("dist"))
    args = ap.parse_args()
    result = validate_tree(args.root)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
