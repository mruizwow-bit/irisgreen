#!/usr/bin/env python3
"""Garantiza un estado accesible para la acción «Copiar texto» de Tarjetas Iris.

La herramienta nueva ya incorpora una región ``role=status`` estable y mantiene el
nombre del botón. El código histórico sigue siendo compatible mientras exista en
algún artefacto antiguo.
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BUTTON = '<button class="iris-btn secondary" type="button" id="copy">Copiar texto</button>'
BUTTON_WITH_STATUS = BUTTON + '<span class="sr-only" id="copy-status" role="status" aria-live="polite"></span>'
OLD_SUCCESS = 'copyText(text).then(function(){var button=document.getElementById("copy");button.textContent="Copiado";setTimeout(function(){button.textContent="Copiar texto";},1400);}).catch(function(){});'
NEW_SUCCESS = 'copyText(text).then(function(){var status=document.getElementById("copy-status");status.textContent="Texto copiado";setTimeout(function(){status.textContent="";},1400);}).catch(function(){var status=document.getElementById("copy-status");status.textContent="No se ha podido copiar";setTimeout(function(){status.textContent="";},2400);});'


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root', type=Path, default=ROOT / 'dist')
    args = ap.parse_args()
    root = args.root.resolve()
    page = root / 'es/tarjetas-iris/index.html'
    if not page.is_file():
        raise FileNotFoundError(page)
    text = page.read_text(encoding='utf-8')

    # Herramienta visual v2: el estado ya está presente y el runtime externo se
    # encarga de éxito/error sin cambiar la etiqueta del botón.
    if 'id="ti-copy"' in text:
        if not re.search(r'id=["\']ti-status["\'][^>]*role=["\']status["\'][^>]*aria-live=["\']polite["\']', text, re.I):
            raise ValueError('La nueva Tarjeta Iris no tiene región de estado accesible para copiar')
        runtime = root / 'assets/tarjetas-iris-tool.js'
        if not runtime.is_file():
            raise FileNotFoundError(runtime)
        js = runtime.read_text(encoding='utf-8')
        if "$('#ti-copy').addEventListener('click'" not in js or 'navigator.clipboard' not in js or 'copyFail' not in js:
            raise ValueError('La nueva Tarjeta Iris no contiene la lógica accesible de copia')
        print({'pagina':'es/tarjetas-iris/index.html','copy_status':True,'button_label_stable':True,'runtime':'tarjetas-iris-tool.js'})
        return

    if BUTTON_WITH_STATUS in text and NEW_SUCCESS in text:
        print({'pagina': 'es/tarjetas-iris/index.html', 'copy_status': True, 'ya_aplicado': True})
        return
    if text.count(BUTTON) != 1:
        raise ValueError(f'Botón Copiar texto: se esperaba 1 y hay {text.count(BUTTON)}')
    if text.count(OLD_SUCCESS) != 1:
        raise ValueError(f'Lógica de copia: se esperaba 1 y hay {text.count(OLD_SUCCESS)}')
    text = text.replace(BUTTON, BUTTON_WITH_STATUS, 1)
    text = text.replace(OLD_SUCCESS, NEW_SUCCESS, 1)
    page.write_text(text, encoding='utf-8')
    print({'pagina': 'es/tarjetas-iris/index.html', 'copy_status': True, 'button_label_stable': True, 'failure_announced': True})


if __name__ == '__main__':
    main()
