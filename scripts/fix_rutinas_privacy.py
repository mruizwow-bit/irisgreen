#!/usr/bin/env python3
"""Ajusta Rutinas visuales en el artefacto público.

La página es española y ya no expone un selector de idioma interno. Las marcas de
«hecho» viven solo en memoria mientras la página permanece abierta: no se usa
sessionStorage ni localStorage.
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path


def run(root: Path) -> dict:
    root = root.resolve()
    js_path = root / 'assets/rutinas-visuales.js'
    page_path = root / 'es/recursos/rutinas-visuales/index.html'
    if not js_path.is_file() or not page_path.is_file():
        raise FileNotFoundError('Faltan archivos de Rutinas visuales')

    text = js_path.read_text(encoding='utf-8')
    original = text

    text = text.replace("savedSession:'Las marcas de hecho se guardan solo durante esta pestaña.'",
                        "savedSession:'Las marcas duran mientras esta página permanezca abierta.'")
    text = text.replace("savedSession:'Done marks are stored only for this tab.'",
                        "savedSession:'Done marks last only while this page stays open.'")

    text = text.replace("$('#rv-language-label').textContent=t.lang;", '')

    text = text.replace(
        "try{sessionStorage.setItem(storageKey,JSON.stringify([...set]));}catch(e){} ",
        ""
    )
    text = re.sub(
        r"function restoreSets\(\)\{for\(const \[key,set\] of \[\['ig-rutinas-hechos-ready',state\.doneReady\],\['ig-rutinas-hechos-builder',state\.doneBuilder\]\]\)\{try\{const a=JSON\.parse\(sessionStorage\.getItem\(key\)\|\|'\[\]'\);if\(Array\.isArray\(a\)\)a\.forEach\(v=>set\.add\(v\)\);\}catch\(e\)\{\}\}\}",
        "function restoreSets(){}",
        text,
        count=1,
    )
    text = text.replace("try{sessionStorage.removeItem('ig-rutinas-hechos-builder');}catch(e){}", '')

    if 'sessionStorage' in text or 'localStorage' in text:
        raise AssertionError('Rutinas visuales no debe usar almacenamiento del navegador')
    if "$('#rv-language-label')" in text:
        raise AssertionError('Rutinas conserva una dependencia del selector interno de idioma')

    page = page_path.read_text(encoding='utf-8')
    if 'data-ready-lang=' in page or 'data-builder-lang=' in page or '>ES<' in page or '>EN<' in page:
        raise AssertionError('La página conserva el selector interno ES/EN')
    if '/assets/rutinas-visuales-v2.css' not in page:
        raise AssertionError('Falta la capa visual revisada de Rutinas')

    if text != original:
        js_path.write_text(text, encoding='utf-8')

    result = {
        'route': '/es/recursos/rutinas-visuales/',
        'internal_language_switcher': False,
        'browser_storage': False,
        'done_marks': 'memory_only',
        'visual_layer': 'rutinas-visuales-v2.css',
        'result': 'accepted',
    }
    print(result)
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=Path, default=Path('dist'))
    args = parser.parse_args()
    run(args.root)
