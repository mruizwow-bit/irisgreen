#!/usr/bin/env python3
"""Retira del artefacto público cualquier persistencia local antigua de Tarjeta Iris.

La ruta canónica de la herramienta es ``/es/recursos/tarjeta-iris/``. La ruta
anterior ``/es/tarjetas-iris/`` se conserva únicamente como puente y algunos
pasos de compatibilidad todavía pueden inyectar allí el bloque antiguo de
``localStorage`` durante la construcción. Este paso lo elimina del ``dist`` y
comprueba que la herramienta publicada conserva el comportamiento y el texto de
privacidad aprobados: el contenido vive solo mientras la pestaña está abierta.

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
VISIBLE_PROMISE = (
    'Esta tarjeta se guarda solo en esta pestaña para poder recuperarla al recargar. '
    'Este guardado no la envía fuera del dispositivo y no hace falta ninguna cuenta.'
)
CANONICAL_PAGE = Path('es/recursos/tarjeta-iris/index.html')
LEGACY_PAGE = Path('es/tarjetas-iris/index.html')
BLOCK = re.compile(
    r'<script\s+data-iris-card-storage="true">.*?</script>',
    re.I | re.S,
)


def assert_no_persistent_storage(text: str, label: str) -> None:
    if MARKER in text or KEY in text:
        raise AssertionError(f'Queda persistencia antigua de Tarjetas Iris en {label}')
    if re.search(r'localStorage\s*\.', text, re.I):
        raise AssertionError(f'Tarjetas Iris sigue usando localStorage en {label}')


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path('dist'))
    args = parser.parse_args()
    root = args.root.resolve()

    canonical = root / CANONICAL_PAGE
    if not canonical.is_file():
        raise FileNotFoundError(canonical)

    canonical_text = canonical.read_text(encoding='utf-8')
    if VISIBLE_PROMISE not in canonical_text:
        raise AssertionError(
            'Tarjeta Iris canónica ya no contiene el texto de privacidad aprobado; '
            'revisar antes de cambiar este control'
        )
    assert_no_persistent_storage(canonical_text, CANONICAL_PAGE.as_posix())

    removed_blocks = 0
    legacy = root / LEGACY_PAGE
    if legacy.is_file():
        legacy_text = legacy.read_text(encoding='utf-8')
        matches = list(BLOCK.finditer(legacy_text))
        if len(matches) > 1:
            raise AssertionError(
                f'Se esperaba como máximo un bloque antiguo de persistencia; encontrados: {len(matches)}'
            )
        if matches:
            legacy_text = BLOCK.sub('', legacy_text, count=1)
            legacy.write_text(legacy_text, encoding='utf-8')
            removed_blocks = 1
        assert_no_persistent_storage(legacy_text, LEGACY_PAGE.as_posix())

    print(json.dumps({
        'page': CANONICAL_PAGE.as_posix(),
        'legacy_page': LEGACY_PAGE.as_posix(),
        'persistent_form_storage': False,
        'removed_legacy_storage_blocks': removed_blocks,
        'removed_key_usage': KEY,
        'public_promise_checked': VISIBLE_PROMISE,
    }, ensure_ascii=False))


if __name__ == '__main__':
    main()
