#!/usr/bin/env python3
"""Impide reintroducir eval()/new Function() o ``unsafe-eval`` en publicación.

La migración CSP precompila las 24 interfaces DC durante el build. Desde ese punto la
salida pública debe contener cero evaluación dinámica y la cabecera global no puede
volver a declarar ``'unsafe-eval'``. ``support.js`` sigue fuera del artefacto porque no
tiene consumidores revisados.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

EVAL_LIKE = re.compile(r'\beval\s*\(|\bnew\s+Function\s*\(')
ORPHAN_RUNTIME = 'support.js'


def global_csp(root: Path) -> str:
    text = (root / '_headers').read_text(encoding='utf-8', errors='strict')
    match = re.search(r'^/\*\s*$.*?^\s*Content-Security-Policy:\s*(.+)$', text, re.M | re.S)
    if not match:
        raise AssertionError('No se encuentra la CSP global en _headers')
    return match.group(1).splitlines()[0].strip()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path('dist'))
    args = parser.parse_args()
    root = args.root.resolve()

    if (root / ORPHAN_RUNTIME).exists():
        raise AssertionError('support.js ha reaparecido en la salida pública; no tiene consumidores revisados')

    references: list[str] = []
    for path in sorted(list(root.rglob('*.html')) + list(root.rglob('*.js'))):
        text = path.read_text(encoding='utf-8', errors='ignore')
        if ORPHAN_RUNTIME in text or '/' + ORPHAN_RUNTIME in text:
            references.append(path.relative_to(root).as_posix())
    if references:
        raise AssertionError(
            'La salida pública vuelve a referenciar support.js: ' + ', '.join(references[:20])
        )

    by_file: dict[str, int] = {}
    for path in sorted(root.rglob('*.js')):
        text = path.read_text(encoding='utf-8', errors='ignore')
        count = len(EVAL_LIKE.findall(text))
        if count:
            by_file[path.relative_to(root).as_posix()] = count

    csp = global_csp(root)
    unsafe_eval = "'unsafe-eval'" in csp
    report = {
        'eval_o_new_function_total': sum(by_file.values()),
        'por_archivo': by_file,
        'unsafe_eval_en_csp': unsafe_eval,
        'support_runtime_publicado': False,
        'referencias_support_runtime': references,
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))

    if by_file:
        raise AssertionError(
            'La salida pública ha reintroducido eval()/new Function(): '
            + json.dumps(by_file, ensure_ascii=False, sort_keys=True)
        )
    if unsafe_eval:
        raise AssertionError("La CSP ha reintroducido 'unsafe-eval'")


if __name__ == '__main__':
    main()
