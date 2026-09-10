#!/usr/bin/env python3
"""Comprueba la coherencia de estados documentales y clasificaciones editoriales.

Esta auditoría NO certifica WCAG/ISO. Distingue expresamente entre:
- clasificación editorial A/B/C/BP/SG ya revisada para las 185 fichas; y
- revisión documental afirmación por afirmación, que solo se marca como completada
  cuando existe un manifiesto individual registrado.
"""
from __future__ import annotations
from collections import Counter
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT
POLICY = json.loads((ROOT/'editorial/standards/standards.json').read_text(encoding='utf-8'))
CLASSIFICATION = json.loads((ROOT/'editorial/standards/condition-classifications-2026-09-10.json').read_text(encoding='utf-8'))
REVIEWED = POLICY['reviewed_entries']
EXPECTED = Counter(CLASSIFICATION['distribution'])
VALID = set(EXPECTED)


def rel_for_target(path):
    return path.relative_to(TARGET).as_posix()


def pages(root):
    return sorted(p for p in root.rglob('index.html') if p != root/'index.html')


def page_grade(text, rel):
    match = re.search(r'<p class="chips"[^>]*data-grado="([^"]+)"', text)
    assert match, ('missing-grade', rel)
    grade = match.group(1)
    assert grade in VALID, ('invalid-grade', rel, grade)
    assert grade not in {'D','A/B','B/C','sin grado','pendiente'}, ('legacy-grade', rel, grade)
    return grade


def check_condition(path):
    rel = rel_for_target(path)
    text = path.read_text(encoding='utf-8')
    assert text.count('class="ig-review-status"') == 1, ('status-count', rel)
    assert 'DRAFT' not in text and 'Draft entry.' not in text, ('legacy-draft', rel)
    assert 'class="sec consult"' not in text, ('legacy-review-section', rel)
    assert '/assets/validacion.css' in text, ('validation-css', rel)
    grade = page_grade(text, rel)
    status = re.search(r'<p class="ig-review-status".*?</p>', text, re.S)
    assert status, ('missing-status', rel)
    status_html = status.group(0)
    assert f'data-editorial-classification="{grade}"' in status_html, ('status-grade', rel, grade)
    reviewed = REVIEWED.get(rel)
    if reviewed:
        assert 'data-documentary-status="reviewed"' in status_html, ('reviewed-status', rel)
        assert f'data-review-date="{reviewed["review_date"]}"' in status_html, ('review-date', rel)
        assert grade == reviewed['classification'], ('classification', rel, grade, reviewed['classification'])
    else:
        assert 'data-documentary-status="pending"' in status_html, ('pending-status', rel)
        assert 'data-review-date=' not in status_html, ('invented-documentary-review-date', rel)
        assert 'data-classification-review-date="2026-09-10"' in status_html, ('classification-review-date', rel)


def index_grades(path, lang):
    text = path.read_text(encoding='utf-8')
    assert 'ig-review-policy' in text, path
    assert 'remain drafts' not in text and '>DRAFT<' not in text, path
    assert '/assets/validacion.css' in text, path
    if lang == 'es':
        grades = re.findall(r'class="chiprow"[^>]*data-grado="(A|B|C|BP|SG)"', text)
    else:
        grades = re.findall(r'<a\s+class="card"[^>]*data-grado="(A|B|C|BP|SG)"', text)
    assert len(grades) == 185, (path, len(grades))
    assert Counter(grades) == EXPECTED, (path, Counter(grades), EXPECTED)
    for legacy in ['data-grado="D"','data-grado="A/B"','data-grado="B/C"','data-grado="sin grado"']:
        assert legacy not in text, (path, legacy)
    return grades


def main():
    es_root = TARGET/'es/neurodiversidad/condiciones'
    en_root = TARGET/'en/neurodiversity/conditions'
    es_pages, en_pages = pages(es_root), pages(en_root)
    assert len(es_pages) == len(en_pages) == 185, (len(es_pages), len(en_pages))
    for p in es_pages + en_pages:
        check_condition(p)

    es_grades = index_grades(es_root/'index.html', 'es')
    en_grades = index_grades(en_root/'index.html', 'en')

    methodology = (TARGET/'es/metodologia/index.html').read_text(encoding='utf-8')
    for token in ['ISO/IEC 40500:2025','WCAG 2.2','WCAG-EM 2.0','UNE-EN 301549:2022','ISO 24495-1:2023','UNE 153101:2018 EX','UNE 153102:2018 EX','BP','SG','21 A','40 B','44 C','54 BP','26 SG']:
        assert token in methodology, ('methodology-reference', token)
    assert 'certificado por ISO' in methodology and 'ISO no realiza la certificación' in methodology

    accessibility = (TARGET/'es/lectura-accesible/index.html').read_text(encoding='utf-8')
    assert 'id="normas-referencia"' in accessibility
    assert 'ISO/IEC 40500:2025' in accessibility and 'WCAG-EM 2.0' in accessibility

    reviewed_count = sum(rel_for_target(p) in REVIEWED for p in es_pages + en_pages)
    result = {
        'target': str(TARGET),
        'spanish_condition_pages': len(es_pages),
        'english_condition_pages': len(en_pages),
        'classification_review_date': CLASSIFICATION['review_date'],
        'classification_distribution': dict(EXPECTED),
        'reviewed_language_pages': reviewed_count,
        'pending_documentary_language_pages': len(es_pages)+len(en_pages)-reviewed_count,
        'legacy_draft_public_wording': 0,
        'legacy_hybrid_or_d_classifications': 0,
        'invented_documentary_review_dates': 0,
        'status_registry_consistent': True,
        'normative_references_present': True,
        'iso_certification_asserted': False
    }
    print(json.dumps(result, ensure_ascii=False))


if __name__ == '__main__':
    main()
