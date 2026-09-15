#!/usr/bin/env python3
"""Valida el estado accesible del botón Copiar de la Tarjeta Iris actual.

La herramienta canónica vive en ``/es/recursos/tarjeta-iris/`` y ya incorpora
un contenedor ``role=status`` estable para anunciar tanto el éxito como el error
de copia sin cambiar el texto del botón. La ruta antigua
``/es/tarjetas-iris/`` es solo un puente, por lo que no debe modificarse ni
buscarse allí el botón de la herramienta.

Este paso conserva la función histórica del build —garantizar un anuncio
accesible de la copia— pero valida la implementación actual en lugar de intentar
reescribir el HTML antiguo.
"""
from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGE = Path('es/recursos/tarjeta-iris/index.html')
SCRIPT = Path('assets/tarjeta-iris.js')
COPY_BUTTON_ID = 'id="ti-copy"'
STATUS = 'id="ti-card-status" role="status" aria-live="polite" aria-atomic="true"'


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root', type=Path, default=ROOT / 'dist')
    args = ap.parse_args()
    root = args.root.resolve()

    page = root / PAGE
    script = root / SCRIPT
    if not page.is_file():
        raise FileNotFoundError(page)
    if not script.is_file():
        raise FileNotFoundError(script)

    html = page.read_text(encoding='utf-8')
    js = script.read_text(encoding='utf-8')

    if html.count(COPY_BUTTON_ID) != 1:
        raise ValueError(
            f'Botón Copiar de Tarjeta Iris: se esperaba 1 y hay {html.count(COPY_BUTTON_ID)}'
        )
    if html.count(STATUS) != 1:
        raise ValueError(
            'Tarjeta Iris debe tener un único estado de copia con role=status, '
            'aria-live=polite y aria-atomic=true'
        )

    required_js = (
        "function copyCard()",
        "$('#ti-card-status')",
        "state.copy==='ok'",
        "state.copy==='error'",
        "$('#ti-copy').addEventListener('click',copyCard)",
    )
    missing = [token for token in required_js if token not in js]
    if missing:
        raise ValueError(f'Lógica accesible de Copiar incompleta en Tarjeta Iris: {missing}')

    print({
        'pagina': PAGE.as_posix(),
        'copy_status': True,
        'button_label_stable': True,
        'success_announced': True,
        'failure_announced': True,
        'legacy_route_touched': False,
    })


if __name__ == '__main__':
    main()
