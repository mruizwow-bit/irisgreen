#!/usr/bin/env python3
"""Hace visible y coherente la familia Recursos en la navegación pública.

No mueve rutas ni modifica las herramientas. En ``dist`` sustituye el acceso
principal que apuntaba directamente a Jugar por el índice ampliable
``/es/recursos/`` y actualiza la tarjeta equivalente de la portada aprobada.
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path


def fix_header(header: str) -> str:
    if '/es/recursos/juegos/' not in header:
        return header
    header = header.replace('href="/es/recursos/juegos/"', 'href="/es/recursos/"')
    header = re.sub(r'(>\s*)Jugar(\s*</a>)', r'\1Recursos\2', header)
    header = re.sub(r'(>\s*)Play(\s*</a>)', r'\1Resources\2', header)
    return header


def fix_home_card(text: str) -> str:
    pattern = re.compile(
        r'<a class="small-card" data-section="jugar" href="/es/recursos/juegos/">.*?</a>',
        re.S,
    )
    match = pattern.search(text)
    if not match:
        return text
    card = match.group(0)
    card = card.replace('data-section="jugar"', 'data-section="recursos"')
    card = card.replace('href="/es/recursos/juegos/"', 'href="/es/recursos/"')
    card = card.replace('<h3>Jugar</h3>', '<h3>Recursos</h3>')
    card = card.replace('<p>Juegos y actividades.</p>', '<p>Juegos, rutinas visuales y herramientas gratuitas.</p>')
    return text[:match.start()] + card + text[match.end():]


def run(root: Path) -> dict:
    root = root.resolve()
    if not root.is_dir():
        raise SystemExit(f'No existe el directorio público: {root}')

    hub = root / 'es/recursos/index.html'
    routines = root / 'es/recursos/rutinas-visuales/index.html'
    games = root / 'es/recursos/juegos/index.html'
    tarjetas = root / 'es/tarjetas-iris/index.html'
    for path in (hub, routines, games, tarjetas):
        if not path.is_file():
            raise FileNotFoundError(path)

    hub_text = hub.read_text(encoding='utf-8')
    assert 'href="/es/recursos/juegos/"' in hub_text
    assert 'href="/es/recursos/rutinas-visuales/"' in hub_text
    assert 'href="/es/tarjetas-iris/"' in hub_text

    changed_headers = 0
    for path in sorted(root.rglob('*.html')):
        text = path.read_text(encoding='utf-8', errors='strict')
        original = text

        def repl(match: re.Match[str]) -> str:
            nonlocal changed_headers
            fixed = fix_header(match.group(0))
            if fixed != match.group(0):
                changed_headers += 1
            return fixed

        text = re.sub(r'<header\b.*?</header>', repl, text, flags=re.I | re.S)
        if path == root / 'index.html':
            text = fix_home_card(text)
        if text != original:
            path.write_text(text, encoding='utf-8')

    nav_js = root / 'assets/navigation-approved.js'
    if not nav_js.is_file():
        raise FileNotFoundError(nav_js)
    js = nav_js.read_text(encoding='utf-8')
    old = '{"id":"jugar","icon":"game","es":["Jugar","Juegos y actividades."],"en":["Play","Games and activities."],"url":"/es/recursos/juegos/","url_en":"/es/recursos/juegos/"}'
    new = '{"id":"recursos","icon":"game","es":["Recursos","Juegos, rutinas visuales y herramientas gratuitas."],"en":["Resources","Games, visual routines and free tools."],"url":"/es/recursos/","url_en":"/es/recursos/"}'
    if old not in js and new not in js:
        raise AssertionError('No se encuentra la entrada Jugar/Recursos de la portada aprobada')
    if old in js:
        js = js.replace(old, new, 1)
        nav_js.write_text(js, encoding='utf-8')

    home = (root / 'index.html').read_text(encoding='utf-8')
    assert 'data-section="recursos"' in home and 'href="/es/recursos/"' in home
    assert '"id":"recursos"' in nav_js.read_text(encoding='utf-8')

    old_header_links = []
    for path in sorted(root.rglob('*.html')):
        text = path.read_text(encoding='utf-8', errors='strict')
        for header in re.findall(r'<header\b.*?</header>', text, flags=re.I | re.S):
            if 'href="/es/recursos/juegos/"' in header and re.search(r'>\s*(?:Jugar|Play)\s*</a>', header):
                old_header_links.append(path.relative_to(root).as_posix())
    assert not old_header_links, 'Cabeceras que aún saltan directamente a Jugar: ' + ', '.join(old_header_links[:10])

    result = {
        'resources_hub': '/es/recursos/',
        'children': ['/es/recursos/juegos/', '/es/recursos/rutinas-visuales/', '/es/tarjetas-iris/'],
        'headers_updated': changed_headers,
        'home_section': 'Recursos',
        'result': 'accepted',
    }
    print(result)
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=Path, default=Path('dist'))
    args = parser.parse_args()
    run(args.root)
