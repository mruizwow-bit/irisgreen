#!/usr/bin/env python3
"""Da semántica de grupo a contenedores públicos con nombre accesible.

Algunos controles heredados usan ``aria-label`` sobre un ``div`` sin rol. Axe-core
lo marca porque el nombre accesible no está bien soportado en un div genérico.
Este ajuste se limita a dos familias cuyo contenido sí constituye un grupo de
controles: selector de idioma ``.ig-uh-langs`` y filtros ``.catbuttons``.

Solo modifica la salida pública de staging/dist; no cambia texto editorial.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

DIV = re.compile(r'<div\b[^>]*>', re.I)
ROLE = re.compile(r'\brole\s*=', re.I)
ARIA_LABEL = re.compile(r'\baria-label\s*=', re.I)
TARGET_CLASSES = ('ig-uh-langs', 'catbuttons')


def patch_tag(tag: str) -> tuple[str, bool]:
    if not ARIA_LABEL.search(tag) or ROLE.search(tag):
        return tag, False
    if not any(re.search(r'\bclass\s*=\s*["\'][^"\']*\b' + re.escape(cls) + r'\b', tag, re.I) for cls in TARGET_CLASSES):
        return tag, False
    return tag[:-1] + ' role="group">', True


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root', type=Path, default=Path('dist'))
    args = ap.parse_args()
    root = args.root.resolve()
    changed_pages = 0
    groups_added = 0

    for path in sorted(root.rglob('*.html')):
        original = path.read_text(encoding='utf-8')
        count = 0
        def repl(match):
            nonlocal count
            tag, changed = patch_tag(match.group(0))
            count += int(changed)
            return tag
        text = DIV.sub(repl, original)
        if text != original:
            path.write_text(text, encoding='utf-8')
            changed_pages += 1
            groups_added += count

    unresolved = []
    for path in sorted(root.rglob('*.html')):
        text = path.read_text(encoding='utf-8')
        for match in DIV.finditer(text):
            tag = match.group(0)
            if ARIA_LABEL.search(tag) and not ROLE.search(tag) and any(cls in tag for cls in TARGET_CLASSES):
                unresolved.append({'page':path.relative_to(root).as_posix(),'tag':tag[:300]})
    if unresolved:
        raise AssertionError('Quedan grupos con aria-label sin rol válido: ' + json.dumps(unresolved[:20], ensure_ascii=False))

    print(json.dumps({'paginas_actualizadas':changed_pages,'roles_group_anadidos':groups_added,'pendientes':0},ensure_ascii=False))


if __name__ == '__main__':
    main()
