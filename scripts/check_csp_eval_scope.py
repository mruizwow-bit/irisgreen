#!/usr/bin/env python3
"""Impide que eval()/new Function() vuelvan a la salida pública.

La lógica de las páginas DC se publica como JavaScript propio y el runtime publicado
no debe volver a ejecutar código recibido como texto. Cualquier uso de ``eval`` o
``new Function`` en ``dist`` es una regresión y bloquea la publicación.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

EVAL_LIKE = re.compile(r'\beval\s*\(|\bnew\s+Function\s*\(')
ORPHAN_RUNTIME = 'support.js'


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

    total = sum(by_file.values())
    print(json.dumps({
        'eval_o_new_function_total': total,
        'limite_total': 0,
        'por_archivo': by_file,
        'support_runtime_publicado': False,
        'referencias_support_runtime': references,
    }, ensure_ascii=False, indent=2))

    if total:
        raise AssertionError(
            'La salida pública vuelve a ejecutar código dinámico mediante eval/new Function: '
            + json.dumps(by_file, ensure_ascii=False, sort_keys=True)
        )


if __name__ == '__main__':
    main()
