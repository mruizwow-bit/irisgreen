#!/usr/bin/env python3
"""Bloquea la expansión de eval()/new Function() fuera de su deuda conocida.

La CSP pública aún conserva ``'unsafe-eval'`` por una deuda técnica ya inventariada.
El control global existente limita el número total de usos; este segundo guardarraíl
fija además los archivos concretos y el máximo permitido en cada uno. Reducir la deuda
sigue estando permitido; moverla o ampliarla exige una revisión explícita.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

EVAL_LIKE = re.compile(r'\beval\s*\(|\bnew\s+Function\s*\(')
ALLOWED_MAX = {
    'assets/games/dc-runtime.js': 2,
    'assets/runtime/8fe7df74405f3c55.js': 2,
    'support.js': 2,
}
MAX_TOTAL = sum(ALLOWED_MAX.values())


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
    unapproved = sorted(path for path in by_file if path not in ALLOWED_MAX)
    over_file_limit = {
        path: {'actual': count, 'maximo': ALLOWED_MAX[path]}
        for path, count in sorted(by_file.items())
        if path in ALLOWED_MAX and count > ALLOWED_MAX[path]
    }

    print(json.dumps({
        'eval_o_new_function_total': total,
        'limite_total': MAX_TOTAL,
        'maximos_revisados_por_archivo': ALLOWED_MAX,
        'por_archivo': by_file,
        'archivos_no_aprobados': unapproved,
        'archivos_sobre_limite': over_file_limit,
    }, ensure_ascii=False, indent=2))

    if total > MAX_TOTAL:
        raise AssertionError(
            f'La salida pública ha aumentado eval()/new Function(): {total} > {MAX_TOTAL}. '
            'No ampliar el límite para hacer pasar CI.'
        )
    if unapproved:
        raise AssertionError(
            'La excepción CSP unsafe-eval ha aparecido en archivos no revisados: '
            + ', '.join(unapproved)
        )
    if over_file_limit:
        raise AssertionError(
            'Ha aumentado eval()/new Function() dentro de un archivo ya revisado: '
            + json.dumps(over_file_limit, ensure_ascii=False, sort_keys=True)
        )


if __name__ == '__main__':
    main()
