#!/usr/bin/env python3
"""Añade fallback público sin JavaScript a Libros y Directorio.

No redacta contenido editorial. Libros se extrae de los datos ES que ya contiene
su propia página; Directorio se construye con las entradas de España del JSON
que forma la pantalla inicial. El bloque se escribe solo en ``dist``.

Además, Libros publica en ``dist`` una cabecera ES ya renderizada con el mismo
título y entradilla de la plantilla. Así el contenido principal no espera al
runtime para aparecer; al cambiar a inglés se vuelve a mostrar la cabecera de
la plantilla. No se crea una segunda fuente editorial.
"""
from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
START = '<!-- ig-sin-js:start -->'
END = '<!-- ig-sin-js:end -->'
BLOCK = re.compile(re.escape(START) + r'.*?' + re.escape(END), re.S)
HERO_START = '<!-- ig-libros-prerender:start -->'
HERO_END = '<!-- ig-libros-prerender:end -->'
HERO_BLOCK = re.compile(re.escape(HERO_START) + r'.*?' + re.escape(HERO_END), re.S)
JS_STRING = r'"(?:\\.|[^"\\])*"'
PAIR_RE = re.compile(r'\[\s*(' + JS_STRING + r')\s*,\s*(' + JS_STRING + r')\s*\]')
BOOK_RE = re.compile(
    r'\{\s*title:\s*(' + JS_STRING + r'),\s*'
    r'desc:\s*(' + JS_STRING + r'),\s*'
    r'desc2:\s*(' + JS_STRING + r'),\s*'
    r'prices:\s*\[(.*?)\],\s*'
    r'note:\s*(' + JS_STRING + r'),?\s*\}', re.S)
COVER_RE = re.compile(
    r'\{\s*cover:\s*A\s*\+\s*(' + JS_STRING + r'),\s*'
    r'alt:\s*(' + JS_STRING + r'),\s*'
    r'muestra:.*?links:\s*\[(.*?)\]\s*\}', re.S)


def js(literal: str) -> str:
    return json.loads(literal)


def esc(value) -> str:
    return html.escape(str(value or ''), quote=True)


def plain(value: str) -> str:
    return html.unescape(re.sub(r'<[^>]+>', '', value or ''))


def inject(path: Path, markup: str) -> None:
    text = path.read_text(encoding='utf-8')
    block = START + '<noscript>' + markup + '</noscript>' + END
    if BLOCK.search(text):
        text = BLOCK.sub(lambda _: block, text, count=1)
    else:
        # Si el remate de accesibilidad ya añadió el salto, el fallback queda
        # justo después; si no, queda tras <body>.
        skip = re.search(r'<a\b[^>]*class=["\'][^"\']*\bskip\b[^"\']*["\'][^>]*>.*?</a>', text, re.I | re.S)
        if skip:
            text = text[:skip.end()] + '\n' + block + text[skip.end():]
        else:
            body = re.search(r'<body\b[^>]*>', text, re.I)
            if not body:
                raise ValueError(f'No se encuentra <body> en {path}')
            text = text[:body.end()] + '\n' + block + text[body.end():]
    path.write_text(text, encoding='utf-8')


def inject_books_hero(path: Path, markup: str) -> None:
    """Inserta una cabecera ES estática sin duplicar semántica visible.

    Con JavaScript, la copia estática es la cabecera visible en ES y la cabecera
    de la plantilla queda oculta. Si ``html[lang]`` cambia a inglés, la copia
    estática desaparece y la plantilla recupera su cabecera dinámica. Sin
    JavaScript, el bloque ``noscript`` completo sigue siendo la versión legible.
    """
    text = path.read_text(encoding='utf-8')
    block = HERO_START + markup + HERO_END
    if HERO_BLOCK.search(text):
        text = HERO_BLOCK.sub(lambda _: block, text, count=1)
    else:
        skip = re.search(r'<a\b[^>]*class=["\'][^"\']*\bskip\b[^"\']*["\'][^>]*>.*?</a>', text, re.I | re.S)
        if skip:
            text = text[:skip.end()] + '\n' + block + text[skip.end():]
        else:
            body = re.search(r'<body\b[^>]*>', text, re.I)
            if not body:
                raise ValueError(f'No se encuentra <body> en {path}')
            text = text[:body.end()] + '\n' + block + text[body.end():]
    path.write_text(text, encoding='utf-8')


def extract_scalar(block: str, key: str) -> str:
    m = re.search(r'\b' + re.escape(key) + r':\s*(' + JS_STRING + r')', block)
    if not m:
        raise ValueError(f'No se encuentra {key} en los datos de Libros')
    return js(m.group(1))


def books_es_block(page: Path) -> str:
    text = page.read_text(encoding='utf-8')
    es = re.search(r'\bes:\s*\{(.*?)\n\s*\},\s*\n\s*en:\s*\{', text, re.S)
    if not es:
        raise ValueError('No se encuentra el bloque ES de Libros')
    return es.group(1)


def books_hero_markup(page: Path) -> str:
    es_block = books_es_block(page)
    eyebrow = extract_scalar(es_block, 'eyebrow')
    title = extract_scalar(es_block, 'title')
    lede = extract_scalar(es_block, 'lede')
    return (
        '<style>'
        '.ig-books-prerender{max-width:1180px;margin:0 auto;padding:44px 28px 0;'
        "font-family:'Atkinson Hyperlegible',system-ui,sans-serif;color:#17395c}"
        '.ig-books-prerender-eyebrow{margin:0 0 10px;font-size:12px;letter-spacing:.18em;'
        'text-transform:uppercase;color:#a8336f}'
        '.ig-books-prerender-title{margin:0 0 12px;font-family:\'Newsreader\',serif;font-weight:400;'
        'font-size:clamp(36px,4.6vw,56px);line-height:1.06;letter-spacing:-.02em;max-width:20em}'
        '.ig-books-prerender-lede{margin:0;font-size:19px;color:#435268;max-width:36em;text-wrap:pretty}'
        "html[lang^='en'] .ig-books-prerender{display:none!important}"
        "html:not([lang^='en']) div.sc-host>div>main#main>p:first-child,"
        "html:not([lang^='en']) div.sc-host>div>main#main>h1,"
        "html:not([lang^='en']) div.sc-host>div>main#main>h1+p{display:none!important}"
        "html:not([lang^='en']) div.sc-host>div>main#main{padding-top:34px!important}"
        '</style>'
        '<section class="ig-books-prerender" lang="es" aria-labelledby="ig-books-prerender-title">'
        f'<p class="ig-books-prerender-eyebrow">{esc(eyebrow)}</p>'
        f'<div class="ig-books-prerender-title" id="ig-books-prerender-title" role="heading" aria-level="1">{esc(title)}</div>'
        f'<p class="ig-books-prerender-lede">{esc(lede)}</p>'
        '</section>'
        '<noscript><style>.ig-books-prerender{display:none!important}</style></noscript>'
    )


def books_markup(page: Path) -> tuple[str, int]:
    text = page.read_text(encoding='utf-8')
    es_block = books_es_block(page)
    books_block = re.search(r'\bbooks:\s*\[(.*?)\n\s*\]\s*$', es_block, re.S)
    if not books_block:
        raise ValueError('No se encuentra books[] en Libros ES')
    books = []
    for m in BOOK_RE.finditer(books_block.group(1)):
        books.append({
            'title': js(m.group(1)), 'desc': js(m.group(2)),
            'desc2': js(m.group(3)),
            'prices': [(js(a), js(b)) for a, b in PAIR_RE.findall(m.group(4))],
            'note': js(m.group(5)),
        })
    covers_block = re.search(r'const\s+COVERS\s*=\s*\[(.*?)\n\s*\];', text, re.S)
    if not covers_block:
        raise ValueError('No se encuentra COVERS en Libros')
    covers = []
    for m in COVER_RE.finditer(covers_block.group(1)):
        covers.append({
            'cover': js(m.group(1)), 'alt': js(m.group(2)),
            'links': [(js(a), js(b)) for a, b in PAIR_RE.findall(m.group(3))],
        })
    if len(books) != 2 or len(covers) != len(books):
        raise ValueError(f'Libros cambió de estructura: {len(books)} libros y {len(covers)} portadas')

    out = ['<main id="main" style="max-width:70rem;margin:0 auto;padding:2rem 1.25rem 4rem">']
    out.append(f'<h1>{esc(extract_scalar(es_block, "title"))}</h1>')
    out.append(f'<p>{esc(extract_scalar(es_block, "lede"))}</p>')
    for book, cover in zip(books, covers):
        out.append('<article style="margin:2rem 0;padding-top:1.5rem;border-top:1px solid #dfe6ef">')
        out.append(f'<img src="{esc(cover["cover"])}" alt="{esc(cover["alt"])}" width="180" loading="lazy">')
        out.append(f'<h2>{esc(book["title"])}</h2>')
        out.append(f'<p>{esc(book["desc"])}</p><p>{esc(plain(book["desc2"]))}</p>')
        if book['prices']:
            out.append('<ul>')
            out.extend(f'<li>{esc(where)}: {esc(price)}</li>' for where, price in book['prices'])
            out.append('</ul>')
        out.append(f'<p>{esc(book["note"])}</p>')
        if cover['links']:
            out.append('<p>')
            out.extend(f'<a href="{esc(url)}">{esc(label)}</a> ' for label, url in cover['links'])
            out.append('</p>')
        out.append('</article>')
    out.append(f'<section><h2>{esc(extract_scalar(es_block, "whyTitle"))}</h2><p>{esc(extract_scalar(es_block, "whyText"))}</p></section>')
    out.append('</main>')
    return ''.join(out), len(books)


def directory_markup(data_path: Path) -> tuple[str, int]:
    data = json.loads(data_path.read_text(encoding='utf-8'))
    rows = data.get('es')
    if not isinstance(rows, list) or not rows:
        raise ValueError('El Directorio no contiene entradas de España')
    out = ['<main id="main" style="max-width:70rem;margin:0 auto;padding:2rem 1.25rem 4rem">',
           '<h1>Directorio de ayudas y trámites</h1>']
    for row in rows:
        name = row.get('name', '')
        if not name:
            raise ValueError('Entrada de Directorio sin name')
        out.append('<article style="margin:1.5rem 0;padding-top:1.25rem;border-top:1px solid #dfe6ef">')
        out.append(f'<h2>{esc(name)}</h2>')
        meta = ' · '.join(x for x in (row.get('terr'), row.get('cat')) if x)
        if meta:
            out.append(f'<p>{esc(meta)}</p>')
        if row.get('que'):
            out.append(f'<p>{esc(row["que"])}</p>')
        labels = [('Cuantía', 'cuantia'), ('Quién puede pedirlo', 'quien'),
                  ('Documentación', 'docs'), ('Observaciones', 'obs')]
        values = [(label, row.get(key)) for label, key in labels if row.get(key)]
        if values:
            out.append('<dl>')
            for label, value in values:
                out.append(f'<dt><strong>{esc(label)}</strong></dt><dd>{esc(value)}</dd>')
            out.append('</dl>')
        source = row.get('fuente')
        if source:
            out.append(f'<p><a href="{esc(source)}">{esc(row.get("org") or source)}</a></p>')
        out.append('</article>')
    out.append('</main>')
    return ''.join(out), len(rows)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root', type=Path, default=ROOT / 'dist')
    args = ap.parse_args()
    root = args.root.resolve()

    books = root / 'es/libros/index.html'
    directory = root / 'es/tramites/directorio/index.html'
    for path in (books, directory):
        if not path.is_file():
            raise FileNotFoundError(path)

    books_html, book_count = books_markup(books)
    inject_books_hero(books, books_hero_markup(books))
    directory_html, directory_count = directory_markup(ROOT / 'es/tramites/directorio/tramites-datos.json')
    inject(books, books_html)
    inject(directory, directory_html)

    print(json.dumps({
        'libros': book_count,
        'libros_hero_prerender': True,
        'directorio_espana': directory_count,
        'paginas': ['es/libros/index.html', 'es/tramites/directorio/index.html'],
        'fuente_editorial_nueva': False,
    }, ensure_ascii=False))


if __name__ == '__main__':
    main()
