#!/usr/bin/env python3
"""Bloquea la expansión de eval()/new Function() fuera del runtime de juegos.

La CSP pública aún conserva ``'unsafe-eval'`` por una deuda técnica ya inventariada.
El control global existente limita el número total de usos; este segundo guardarraíl
impide que esa excepción se propague silenciosamente a otras partes de la web.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

EVAL_LIKE = re.compile(r'\beval\s*\(|\bnew\s+Function\s*\(')
ALLOWED_PREFIX = 'assets/games/'
MAX_TOTAL = 6


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path('dist'))
    args = parser.parse_args()
    root = args.root.resolve()

    by_file: dict[str, int] = {}
    for path in sorted(root.rglob('*.js')):
        text = path.read_text(encoding='utf-8', errors='ignore')
        count = len(EVAL_LIKE.findall(text))
        if count:
            by_file[path.relative_to(root).as_posix()] = count

    total = sum(by_file.values())
    outside_scope = sorted(path for path in by_file if not path.startswith(ALLOWED_PREFIX))

    print(json.dumps({
        'eval_o_new_function_total': total,
        'limite_total': MAX_TOTAL,
        'ambito_temporal_permitido': ALLOWED_PREFIX,
        'por_archivo': by_file,
        'fuera_del_ambito': outside_scope,
    }, ensure_ascii=False, indent=2))

    if total > MAX_TOTAL:
        raise AssertionError(
            f'La salida pública ha aumentado eval()/new Function(): {total} > {MAX_TOTAL}. '
            'No ampliar el límite para hacer pasar CI.'
        )
    if outside_scope:
        raise AssertionError(
            'La excepción CSP unsafe-eval se ha extendido fuera del runtime de juegos: '
            + ', '.join(outside_scope)
        )


if __name__ == '__main__':
    main()
