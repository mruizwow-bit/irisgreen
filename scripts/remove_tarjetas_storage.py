#!/usr/bin/env python3
"""Retira del artefacto público la persistencia local del texto de Tarjetas Iris.

La herramienta pública afirma que lo escrito no se guarda. ``connect_tarjetas_iris``
inyecta actualmente un bloque de compatibilidad que conserva título, dificultad,
apoyos y necesidad en ``localStorage``. Este paso elimina únicamente ese bloque
del ``dist`` construido y comprueba que la promesa visible vuelve a coincidir con
el comportamiento publicado.

No modifica las fuentes editoriales ni borra datos del navegador de quien ya haya
usado una versión anterior: simplemente deja de leer y escribir esa clave en las
nuevas publicaciones.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

MARKER = 'data-iris-card-storage="true"'
KEY = 'iris-green-tarjeta-v1'
VISIBLE_PROMISE = 'Lo que escribes no se guarda en la web.'
BLOCK = re.compile(
    r'<script\s+data-iris-card-storage="true">.*?</script>',
    re.I | re.S,
)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path('dist'))
    args = parser.parse_args()
    root = args.root.resolve()
    page = root / 'es/tarjetas-iris/index.html'
    if not page.is_file():
        raise FileNotFoundError(page)

    text = page.read_text(encoding='utf-8')
    if VISIBLE_PROMISE not in text:
        raise AssertionError('Tarjetas Iris ya no contiene la promesa pública de no guardar el texto; revisar antes de cambiar este control')

    matches = list(BLOCK.finditer(text))
    if len(matches) != 1:
        raise AssertionError(f'Se esperaba exactamente un bloque de persistencia de Tarjetas Iris; encontrados: {len(matches)}')

    cleaned = BLOCK.sub('', text, count=1)
    if MARKER in cleaned or KEY in cleaned:
        raise AssertionError('Queda persistencia de Tarjetas Iris después de retirar el bloque conocido')
    if re.search(r'localStorage\s*\.', cleaned, re.I):
        raise AssertionError('Tarjetas Iris sigue usando localStorage fuera del bloque retirado')

    page.write_text(cleaned, encoding='utf-8')
    print(json.dumps({
        'page': page.relative_to(root).as_posix(),
        'persistent_form_storage': False,
        'removed_key_usage': KEY,
        'public_promise_checked': VISIBLE_PROMISE,
    }, ensure_ascii=False))


if __name__ == '__main__':
    main()
