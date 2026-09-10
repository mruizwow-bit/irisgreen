#!/usr/bin/env python3
"""Comprueba la coherencia de estados documentales y referencias normativas.

Esta auditoría NO certifica WCAG/ISO; impide publicar estados o letras que no
coincidan con el registro documental y elimina el antiguo DRAFT público.
"""
from __future__ import annotations
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT
POLICY = json.loads((ROOT/'editorial/standards/standards.json').read_text(encoding='utf-8'))
REVIEWED = POLICY['reviewed_entries']


def rel_for_target(path):
    return path.relative_to(TARGET).as_posix()


def pages(root):
    return sorted(p for p in root.rglob('index.html') if p != root/'index.html')


def check_condition(path):
    rel = rel_for_target(path)
    text = path.read_text(encoding='utf-8')
    assert text.count('class="ig-review-status"') == 1, ('status-count', rel)
    assert 'DRAFT' not in text and 'Draft entry.' not in text, ('legacy-draft', rel)
    assert 'class="sec consult"' not in text, ('legacy-review-section', rel)
    assert '/assets/validacion.css' in text, ('validation-css', rel)
    reviewed = REVIEWED.get(rel)
    if reviewed:
        assert 'data-documentary-status="reviewed"' in text, ('reviewed-status', rel)
        assert f'data-review-date="{reviewed["review_date"]}"' in text, ('review-date', rel)
        assert f'data-editorial-classification="{reviewed["classification"]}"' in text, ('classification', rel)
        assert re.search(r'<p class="chips"[^>]*data-grado="'+re.escape(reviewed['classification'])+r'"', text), ('chip-grade', rel)
    else:
        assert 'data-documentary-status="pending"' in text, ('pending-status', rel)
        assert re.search(r'<p class="chips"[^>]*data-grado="pendiente"', text), ('pending-grade', rel)
        assert 'data-review-date=' not in re.search(r'<p class="ig-review-status".*?</p>', text, re.S).group(0), ('invented-date', rel)


def main():
    es_root = TARGET/'es/neurodiversidad/condiciones'
    en_root = TARGET/'en/neurodiversity/conditions'
    es_pages, en_pages = pages(es_root), pages(en_root)
    assert es_pages and en_pages
    for p in es_pages + en_pages: check_condition(p)

    for index in (es_root/'index.html', en_root/'index.html'):
        text = index.read_text(encoding='utf-8')
        assert 'ig-review-policy' in text, index
        assert 'remain drafts' not in text and 'Grade A' not in text and 'Grade B' not in text and 'Grade C' not in text, index
        assert '/assets/validacion.css' in text, index

    methodology = (TARGET/'es/metodologia/index.html').read_text(encoding='utf-8')
    for token in ['ISO/IEC 40500:2025','WCAG 2.2','WCAG-EM 2.0','UNE-EN 301549:2022','ISO 24495-1:2023','UNE 153101:2018 EX','UNE 153102:2018 EX']:
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
        'reviewed_language_pages': reviewed_count,
        'pending_language_pages': len(es_pages)+len(en_pages)-reviewed_count,
        'legacy_draft_public_wording': 0,
        'invented_review_dates': 0,
        'status_registry_consistent': True,
        'normative_references_present': True,
        'iso_certification_asserted': False
    }
    print(json.dumps(result, ensure_ascii=False))


if __name__ == '__main__': main()
