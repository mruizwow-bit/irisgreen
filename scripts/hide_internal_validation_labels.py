#!/usr/bin/env python3
"""Oculta los estados editoriales de Condiciones y Situaciones en la presentación."""
from __future__ import annotations
import argparse, json, re
from pathlib import Path


def transform(text: str) -> tuple[str, int]:
    before = text
    text = re.sub(r'<span\b[^>]*class="[^"]*\bchip\b[^"]*\blil\b[^"]*"[^>]*>\s*(?:VALIDADA|VALIDADO|VALIDATED)\s*</span>', '', text, flags=re.I)
    text = re.sub(r'<p\b[^>]*class="[^"]*\bnotice\b[^"]*"[^>]*>\s*Validated for publication in this edition\. Sources, scope and limitations remain visible on this page\.\s*</p>', '', text, flags=re.I)
    pairs = [
        ('Última validación del texto', 'Última revisión del texto'),
        ('Base documental y validación', 'Base documental y revisión'),
        ('Sources and validation', 'Sources and review'),
        ('<h2>Validation</h2>', '<h2>Review</h2>'),
        ('<h3>Validación editorial</h3>', '<h3>Revisión editorial</h3>'),
        ('<h3>Editorial validation</h3>', '<h3>Editorial review</h3>'),
        ('Validación editorial:', 'Revisión editorial:'),
        ('Editorial validation:', 'Editorial review:'),
    ]
    for old, new in pairs:
        text = text.replace(old, new)
    text = text.replace(
        'La ficha está validada editorialmente para esta edición. Este cambio de presentación no añade una validación clínica.',
        'La ficha mantiene su revisión editorial para esta edición. Este cambio de presentación no añade una valoración clínica.'
    )
    text = text.replace(
        'The entry is editorially validated for this edition. This presentation change does not add clinical validation.',
        'The entry keeps its editorial review for this edition. This presentation change does not add a clinical assessment.'
    )
    text = text.replace(
        'The 185 entries are published and validated for this edition. Sources and scope remain visible in each entry; evidence classification is shown where applicable.',
        'The 185 entries are published. Sources and scope remain visible in each entry; evidence classification is shown where applicable.'
    )
    return text, int(text != before)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', type=Path, default=Path('dist'))
    args = ap.parse_args()
    root = args.root.resolve()
    targets = [
        root/'es/situaciones/index.html', root/'en/situations/index.html',
        root/'es/neurodiversidad/condiciones/index.html', root/'en/neurodiversity/conditions/index.html',
    ]
    for pattern in (
        'es/situaciones/*/index.html', 'en/situations/*/index.html',
        'es/neurodiversidad/condiciones/*/index.html', 'en/neurodiversity/conditions/*/index.html',
    ):
        targets.extend(sorted(root.glob(pattern)))
    seen, changed = set(), 0
    for p in targets:
        if not p.is_file() or p in seen:
            continue
        seen.add(p)
        before = p.read_text(encoding='utf-8')
        after, n = transform(before)
        if n:
            p.write_text(after, encoding='utf-8')
            changed += 1
    forbidden = [
        re.compile(r'<span\b[^>]*class="[^"]*\bchip\b[^"]*"[^>]*>\s*(?:VALIDADA|VALIDADO|VALIDATED)\s*</span>', re.I),
        re.compile(r'<h[1-6][^>]*>\s*(?:Última validación del texto|Base documental y validación|Sources and validation|Validation|Validación editorial|Editorial validation)\s*</h[1-6]>', re.I),
        re.compile(r'(?:Validación editorial:|Editorial validation:)', re.I),
        re.compile(r'Validated for publication in this edition', re.I),
    ]
    bad=[]
    for p in seen:
        text=p.read_text(encoding='utf-8')
        if any(rx.search(text) for rx in forbidden):
            bad.append(p.relative_to(root).as_posix())
    if bad:
        raise AssertionError('Rótulos de validación visibles restantes: '+repr(bad[:20]))
    print(json.dumps({'pages_checked':len(seen),'pages_changed':changed,'internal_status_preserved':True,'visible_validation_labels':0},ensure_ascii=False))


if __name__=='__main__':
    main()
