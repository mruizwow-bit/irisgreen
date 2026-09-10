#!/usr/bin/env python3
"""Remove editorial review/validation states from the public build.

The website may keep documentary grades (A/B/C/BP/SG) and source information,
but it must not show workflow states such as draft, reviewed or validated.
Normal prose is left untouched; only structural status UI/metadata is removed.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

STATUS_WORDS = r"(?:BORRADOR|DRAFT|REVISAD[OA]|REVIEWED|VALIDAD[OA]|VALIDATED)"


def strip_status_ui(text: str) -> tuple[str, int]:
    changes = 0

    def sub(rx, repl, s, flags=0):
        nonlocal changes
        s2, n = re.subn(rx, repl, s, flags=flags)
        changes += n
        return s2

    # Exact workflow chips/badges; documentary grade chips are deliberately untouched.
    text = sub(
        rf'<span\b[^>]*class=["\'][^"\']*\bchip\b[^"\']*["\'][^>]*>\s*{STATUS_WORDS}\s*</span>',
        '', text, flags=re.I,
    )

    # Catalog metadata such as "3 fuentes · VALIDADA" -> "3 fuentes".
    text = sub(
        rf'(<span\b[^>]*class=["\'][^"\']*\bmeta\b[^"\']*["\'][^>]*>)([^<]*?)(?:\s*·\s*{STATUS_WORDS})(\s*</span>)',
        lambda m: m.group(1) + m.group(2).rstrip() + m.group(3), text, flags=re.I,
    )

    # Technical list fields dedicated to workflow status/dates.
    text = sub(
        r'<li\b[^>]*>\s*<strong>\s*(?:Estado|Status|Revisión|Review|Validación|Validation|Última revisión|Last reviewed|Última validación|Last validated)\s*:\s*</strong>.*?</li>',
        '', text, flags=re.I | re.S,
    )

    # Dedicated review/validation sections, including hidden historic condition blocks.
    text = sub(
        r'<section\b[^>]*>\s*<h[1-6][^>]*>\s*(?:Última revisión del texto|Última validación del texto|Review|Validation|Editorial review|Editorial validation)\s*</h[1-6]>.*?</section>',
        '', text, flags=re.I | re.S,
    )

    # Status notices created by old publication normalisers.
    notice_rx = re.compile(r'<p\b[^>]*class=["\'][^"\']*\bnotice\b[^"\']*["\'][^>]*>.*?</p>', re.I | re.S)
    def notice_repl(m):
        plain = re.sub(r'<[^>]+>', ' ', m.group(0))
        return '' if re.search(r'\b(?:draft|borrador|reviewed|revisad[oa]|validated|validad[oa])\b', plain, re.I) else m.group(0)
    before_notice = text
    text = notice_rx.sub(notice_repl, text)
    if text != before_notice:
        changes += 1

    # Keep documentary meaning in headings, without workflow wording.
    text = sub(r'Base documental y (?:revisión|validación)', 'Base documental', text, flags=re.I)
    text = sub(r'Sources and (?:review|validation)', 'Sources', text, flags=re.I)

    # Paragraphs whose sole purpose is an editorial workflow date/state.
    text = sub(
        r'<p\b[^>]*class=["\'][^"\']*\bmuted\b[^"\']*["\'][^>]*>\s*(?:Revisión editorial|Validación editorial|Editorial review|Editorial validation|Review:|Validation:).*?</p>',
        '', text, flags=re.I | re.S,
    )

    # Public UI does not need internal editorial-state attributes.
    text = sub(r'\s+data-editorial-status=["\'][^"\']*["\']', '', text, flags=re.I)

    # Research/data labels may retain useful counts but not workflow language.
    text = sub(
        r'revision:\s*["\'](?:Última (?:revisión|validación) de esta página|This page last (?:reviewed|validated)):[^"\']*?·\s*(\d+ publicaciones?|\d+ publications?)\.["\']',
        lambda m: 'revision: ' + json.dumps(m.group(1) + '.', ensure_ascii=False), text, flags=re.I,
    )
    text = sub(
        r'(?:Última (?:revisión|validación) editorial de este documento|Last editorial (?:review|validation) of this document):[^<\n]*',
        '', text, flags=re.I,
    )

    # Explicit collection-level publication-state announcements only.
    text = sub(
        r'<p\b[^>]*class=["\'][^"\']*\bnotice\b[^"\']*["\'][^>]*>[^<]*(?:published and validated|publicad[ao]s? y validad[ao]s?|validated for publication|validad[ao] para publicación)[^<]*</p>',
        '', text, flags=re.I,
    )
    return text, changes


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path('dist'))
    args = parser.parse_args()
    root = args.root.resolve()
    files = 0
    changed_files = 0

    for path in root.rglob('*'):
        if not path.is_file() or path.suffix.lower() not in {'.html', '.js', '.json'}:
            continue
        try:
            before = path.read_text(encoding='utf-8')
        except UnicodeDecodeError:
            continue
        files += 1
        after, _ = strip_status_ui(before)
        # Preserve a neutral machine state if a component expects a status key.
        after = re.sub(
            r'("status"\s*:\s*)"(?:borrador|draft|revisad[oa]|reviewed|validado|validada|validated)"',
            lambda m: m.group(1) + '"publicado"', after, flags=re.I,
        )
        if after != before:
            changed_files += 1
            path.write_text(after, encoding='utf-8')

    # Structural guard: no editorial workflow state may remain in public UI.
    forbidden = {
        'status_chip': re.compile(rf'<span\b[^>]*class=["\'][^"\']*\bchip\b[^"\']*["\'][^>]*>\s*{STATUS_WORDS}\s*</span>', re.I),
        'status_meta': re.compile(rf'<span\b[^>]*class=["\'][^"\']*\bmeta\b[^"\']*["\'][^>]*>[^<]*\b{STATUS_WORDS}\b[^<]*</span>', re.I),
        'status_field': re.compile(r'<strong>\s*(?:Estado|Status|Revisión|Review|Validación|Validation)\s*:\s*</strong>', re.I),
        'status_heading': re.compile(r'<h[1-6][^>]*>\s*(?:Última revisión del texto|Última validación del texto|Review|Validation|Editorial review|Editorial validation|Base documental y (?:revisión|validación)|Sources and (?:review|validation))\s*</h[1-6]>', re.I),
        'status_attr': re.compile(r'data-editorial-status=', re.I),
        'status_notice': re.compile(r'<p\b[^>]*class=["\'][^"\']*\bnotice\b[^"\']*["\'][^>]*>[^<]*\b(?:draft|borrador|reviewed|revisad[oa]|validated|validad[oa])\b', re.I),
        'status_muted': re.compile(r'<p\b[^>]*class=["\'][^"\']*\bmuted\b[^"\']*["\'][^>]*>\s*(?:Revisión editorial|Validación editorial|Editorial review|Editorial validation|Review:|Validation:)', re.I),
    }
    remaining = []
    for path in root.rglob('*'):
        if not path.is_file() or path.suffix.lower() not in {'.html', '.js', '.json'}:
            continue
        try:
            text = path.read_text(encoding='utf-8')
        except UnicodeDecodeError:
            continue
        for name, rx in forbidden.items():
            if rx.search(text):
                remaining.append((name, path.relative_to(root).as_posix()))
    if remaining:
        raise AssertionError('Public editorial workflow states remain: ' + repr(remaining[:80]))

    print(json.dumps({
        'public_text_files_scanned': files,
        'files_changed_to_remove_status_ui': changed_files,
        'remaining_public_review_validation_states': 0,
    }, ensure_ascii=False))


if __name__ == '__main__':
    main()
