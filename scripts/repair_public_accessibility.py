#!/usr/bin/env python3
"""Corrige bloqueadores estructurales objetivos del HTML público generado.

Se ejecuta sobre dist, después de renderizar las tres plantillas de navegación
aprobadas. Solo añade nombres accesibles/landmarks que faltan; no reescribe el
texto editorial ni afirma conformidad WCAG completa.
"""
from __future__ import annotations
import html
import re
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / 'dist'

SEARCH_LABELS = {
    'en/interests/index.html': 'Search interests',
    'es/intereses/index.html': 'Buscar intereses',
    'es/investigacion/index.html': 'Buscar estudios',
    'es/videos/index.html': 'Buscar vídeos',
}

BUTTON_LABELS = {
    'index.html': {
        'return-edit': 'Volver a editar',
        'manual-done': 'Hecho',
    },
    'es/situaciones/necesito-que-me-repitan-las-instrucciones/index.html': {
        'return-edit': 'Volver a editar',
        'manual-done': 'Hecho',
    },
    'en/situations/i-need-instructions-repeated/index.html': {
        'return-edit': 'Return to editing',
        'manual-done': 'Done',
    },
}


def add_attr(tag: str, name: str, value: str) -> str:
    if re.search(rf'\b{name}\s*=', tag, flags=re.I):
        return tag
    return tag[:-1] + f' {name}="{html.escape(value, quote=True)}">'


def patch_search(path: Path, label: str) -> bool:
    text = path.read_text(encoding='utf-8')
    changed = False
    def repl(m):
        nonlocal changed
        tag = m.group(0)
        typ = re.search(r'\btype\s*=\s*["\']?([^\s"\'>]+)', tag, flags=re.I)
        if not typ or typ.group(1).lower() != 'search':
            return tag
        if re.search(r'\baria-label(?:ledby)?\s*=', tag, flags=re.I):
            return tag
        changed = True
        return add_attr(tag, 'aria-label', label)
    new = re.sub(r'<input\b[^>]*>', repl, text, flags=re.I)
    if changed:
        path.write_text(new, encoding='utf-8')
    return changed


def patch_buttons(path: Path, labels: dict[str,str]) -> bool:
    text = path.read_text(encoding='utf-8')
    before = text
    for element_id, label in labels.items():
        pat = re.compile(r'<button\b(?=[^>]*\bid=["\']'+re.escape(element_id)+r'["\'])[^>]*>', re.I)
        m = pat.search(text)
        if not m:
            raise AssertionError(f'Botón {element_id} no encontrado en {path.relative_to(TARGET)}')
        tag = add_attr(m.group(0), 'aria-label', label)
        text = text[:m.start()] + tag + text[m.end():]
    if text != before:
        path.write_text(text, encoding='utf-8')
        return True
    return False


def patch_print_page(path: Path) -> bool:
    text = path.read_text(encoding='utf-8')
    if re.search(r'<main\b', text, flags=re.I) and re.search(r'<h1\b', text, flags=re.I):
        return False
    before = text
    body = re.search(r'<body\b[^>]*>', text, flags=re.I)
    if not body:
        raise AssertionError('body no encontrado en página de impresión')
    opening = '<main id="main"><h1 class="sr">Tus intereses · versión para imprimir</h1>'
    text = text[:body.end()] + '\n' + opening + text[body.end():]
    close = re.search(r'</body\s*>', text, flags=re.I)
    if not close:
        raise AssertionError('cierre body no encontrado en página de impresión')
    text = text[:close.start()] + '</main>\n' + text[close.start():]
    path.write_text(text, encoding='utf-8')
    return text != before


def accessible_anchor_name(attrs: str, body: str) -> bool:
    if re.search(r'\baria-label\s*=\s*["\'][^"\']+|\btitle\s*=\s*["\'][^"\']+', attrs, flags=re.I):
        return True
    visible = html.unescape(re.sub(r'<[^>]+>', ' ', body))
    if ' '.join(visible.split()):
        return True
    for alt in re.findall(r'<img\b[^>]*\balt\s*=\s*["\']([^"\']*)["\'][^>]*>', body, flags=re.I):
        if alt.strip():
            return True
    return False


def href_label(href: str, lang: str) -> str:
    path = urlsplit(html.unescape(href)).path.rstrip('/')
    slug = path.split('/')[-1] if path else ''
    name = ' '.join(x for x in slug.replace('_','-').split('-') if x)
    if name:
        return ('Abrir ' if lang == 'es' else 'Open ') + name
    return 'Abrir recurso de juegos' if lang == 'es' else 'Open game resource'


def patch_unnamed_links(path: Path, lang: str) -> int:
    text = path.read_text(encoding='utf-8')
    count = 0
    anchor_re = re.compile(r'<a\b(?P<attrs>[^>]*)>(?P<body>.*?)</a>', re.I | re.S)
    def repl(m):
        nonlocal count
        attrs, body = m.group('attrs'), m.group('body')
        href = re.search(r'\bhref\s*=\s*["\']([^"\']+)["\']', attrs, flags=re.I)
        if not href or accessible_anchor_name(attrs, body):
            return m.group(0)
        opening = '<a' + attrs + '>'
        opening = add_attr(opening, 'aria-label', href_label(href.group(1), lang))
        count += 1
        return opening + body + '</a>'
    new = anchor_re.sub(repl, text)
    if count:
        path.write_text(new, encoding='utf-8')
    return count


def main() -> None:
    if not TARGET.is_dir():
        raise FileNotFoundError('dist no existe; ejecuta build_site.py')
    changed = []
    for rel, label in SEARCH_LABELS.items():
        path = TARGET/rel
        if patch_search(path, label): changed.append(rel)
    for rel, labels in BUTTON_LABELS.items():
        path = TARGET/rel
        if patch_buttons(path, labels): changed.append(rel)
    rel = 'es/intereses/imprimir/index.html'
    if patch_print_page(TARGET/rel): changed.append(rel)
    rel = 'es/recursos/juegos/index.html'
    unnamed = patch_unnamed_links(TARGET/rel, 'es')
    if unnamed: changed.append(rel)

    # Comprobaciones de cierre de los 9 bloqueadores conocidos.
    for rel, label in SEARCH_LABELS.items():
        text=(TARGET/rel).read_text(encoding='utf-8')
        assert re.search(r'<input\b[^>]*type=["\']search["\'][^>]*aria-label=["\']'+re.escape(label)+r'["\']|<input\b[^>]*aria-label=["\']'+re.escape(label)+r'["\'][^>]*type=["\']search["\']', text, re.I), rel
    for rel, labels in BUTTON_LABELS.items():
        text=(TARGET/rel).read_text(encoding='utf-8')
        for element_id,label in labels.items():
            tag=re.search(r'<button\b(?=[^>]*\bid=["\']'+re.escape(element_id)+r'["\'])[^>]*>',text,re.I)
            assert tag and f'aria-label="{label}"' in tag.group(0), (rel, element_id)
    print({'pages_changed': sorted(set(changed)), 'unnamed_game_links_repaired': unnamed, 'claim':'structural repairs only; not WCAG certification'})


if __name__ == '__main__':
    main()
