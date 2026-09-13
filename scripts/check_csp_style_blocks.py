#!/usr/bin/env python3
"""Verifica CSP de estilos estáticos y de las hojas deterministas del runtime DC.

Los bloques <style> presentes en HTML y las hojas runtime BASE/FULL_PAGE/ATOMIC,
además de la hoja vacía usada por CSSOM para pseudoclases, deben estar autorizados
solo por hashes exactos en style-src-elem. La única excepción temporal restante es
``style-src-attr 'unsafe-inline'`` para atributos ``style=``.
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import json
import re
from pathlib import Path

STYLE_BLOCK = re.compile(r'<style\b[^>]*>(?P<body>.*?)</style\s*>', re.I | re.S)
STYLE_ATTR = re.compile(r'\sstyle\s*=\s*(["\']).*?\1', re.I | re.S)
CSP_LINE = re.compile(r'^/\*\s*$.*?^\s*Content-Security-Policy:\s*(.+)$', re.M | re.S)
HASH_PREFIXES = ("'sha256-", "'sha384-", "'sha512-")

RUNTIME_PATH = Path('assets/runtime/dc-runtime-csp.js')
BASE_CSS = re.compile(r'var BASE_CSS = `(?P<body>.*?)`;', re.S)
FULL_PAGE_CSS = re.compile(
    r'var FULL_PAGE_CSS = (?P<literal>"(?:\\.|[^"\\])*");', re.S
)
ATOMIC_CSS = re.compile(
    r'var ATOMIC_CSS = \(\s*(?://[^\n]*\n\s*)*'
    r'(?P<literal>"(?:\\.|[^"\\])*")\s*\);',
    re.S,
)


def sha256_source(body: str) -> str:
    digest = base64.b64encode(hashlib.sha256(body.encode('utf-8')).digest()).decode('ascii')
    return f"'sha256-{digest}'"


def decode_template_literal(raw: str) -> str:
    if '${' in raw:
        raise AssertionError('BASE_CSS contiene interpolación dinámica inesperada')
    out: list[str] = []
    i = 0
    simple = {
        'n': '\n', 'r': '\r', 't': '\t', 'b': '\b', 'f': '\f',
        'v': '\v', '0': '\0', '\\': '\\', '`': '`', '$': '$',
        '"': '"', "'": "'",
    }
    while i < len(raw):
        if raw[i] != '\\':
            out.append(raw[i])
            i += 1
            continue
        if i + 1 >= len(raw):
            raise AssertionError('Escape incompleto en BASE_CSS')
        nxt = raw[i + 1]
        if nxt in simple:
            out.append(simple[nxt])
            i += 2
        elif nxt == 'u':
            value = raw[i + 2:i + 6]
            if len(value) != 4 or not re.fullmatch(r'[0-9A-Fa-f]{4}', value):
                raise AssertionError(f'Escape unicode no previsto: {value!r}')
            out.append(chr(int(value, 16)))
            i += 6
        elif nxt == 'x':
            value = raw[i + 2:i + 4]
            if len(value) != 2 or not re.fullmatch(r'[0-9A-Fa-f]{2}', value):
                raise AssertionError(f'Escape hexadecimal no previsto: {value!r}')
            out.append(chr(int(value, 16)))
            i += 4
        elif nxt == '\n':
            i += 2
        elif nxt == '\r':
            i += 2
            if i < len(raw) and raw[i] == '\n':
                i += 1
        else:
            out.append(nxt)
            i += 2
    return ''.join(out)


def runtime_style_hashes(root: Path) -> dict[str, str]:
    path = root / RUNTIME_PATH
    if not path.is_file():
        raise FileNotFoundError(path)
    text = path.read_text(encoding='utf-8', errors='strict')
    base = BASE_CSS.search(text)
    full = FULL_PAGE_CSS.search(text)
    atomic = ATOMIC_CSS.search(text)
    if not base or not full or not atomic:
        raise AssertionError('No se derivan las tres constantes CSS del runtime DC')
    try:
        sources = {
            'BASE_CSS': decode_template_literal(base.group('body')),
            'FULL_PAGE_CSS': json.loads(full.group('literal')),
            'ATOMIC_CSS': json.loads(atomic.group('literal')),
            'PSEUDO_EMPTY': '',
        }
    except json.JSONDecodeError as exc:
        raise AssertionError(f'Literal CSS runtime inválido: {exc}') from exc
    if len(set(sources.values())) != 4:
        raise AssertionError('El inventario esperado de cuatro hojas runtime ha cambiado')
    return {name: sha256_source(body) for name, body in sources.items()}


def parse_csp(root: Path) -> dict[str, list[str]]:
    text = (root / '_headers').read_text(encoding='utf-8', errors='strict')
    match = CSP_LINE.search(text)
    if not match:
        raise AssertionError('No se encuentra la CSP global en _headers')
    directives: dict[str, list[str]] = {}
    for chunk in match.group(1).splitlines()[0].split(';'):
        parts = chunk.strip().split()
        if parts:
            directives[parts[0].lower()] = parts[1:]
    return directives


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path('dist'))
    args = parser.parse_args()
    root = args.root.resolve()

    static_hashes: list[str] = []
    blocks = 0
    style_attrs = 0
    pages_with_blocks = 0
    pages_with_attrs = 0
    for path in sorted(root.rglob('*.html')):
        text = path.read_text(encoding='utf-8', errors='strict')
        rows = [sha256_source(m.group('body')) for m in STYLE_BLOCK.finditer(text)]
        attrs = len(STYLE_ATTR.findall(text))
        if rows:
            pages_with_blocks += 1
            blocks += len(rows)
            static_hashes.extend(rows)
        if attrs:
            pages_with_attrs += 1
            style_attrs += attrs

    expected_static = sorted(set(static_hashes))
    if not expected_static or blocks == 0:
        raise AssertionError('No se encontraron bloques <style>; revisar el contrato CSP')

    runtime_by_name = runtime_style_hashes(root)
    expected_runtime = sorted(set(runtime_by_name.values()))
    expected_all = sorted(set(expected_static) | set(expected_runtime))

    directives = parse_csp(root)
    style_src = directives.get('style-src')
    style_elem = directives.get('style-src-elem')
    style_attr = directives.get('style-src-attr')
    if style_src is None or style_elem is None or style_attr is None:
        raise AssertionError('Faltan style-src, style-src-elem o style-src-attr en la CSP')
    if set(style_src) != {"'self'"}:
        raise AssertionError(f'style-src debe quedar limitado a self: {style_src}')
    if "'unsafe-inline'" in style_elem:
        raise AssertionError("style-src-elem ha reintroducido 'unsafe-inline'")
    non_hash = {token for token in style_elem if not token.startswith(HASH_PREFIXES)}
    if non_hash != {"'self'"}:
        raise AssertionError(f'style-src-elem contiene fuentes no revisadas: {style_elem}')
    declared = sorted(token for token in style_elem if token.startswith(HASH_PREFIXES))
    if declared != expected_all:
        raise AssertionError(
            'Hashes style-src-elem fuera de sincronía: '
            f'estáticos={len(expected_static)}, runtime={len(expected_runtime)}, '
            f'necesarios={len(expected_all)}, declarados={len(declared)}'
        )
    if set(style_attr) != {"'unsafe-inline'"}:
        raise AssertionError(f'style-src-attr fuera del contrato temporal: {style_attr}')
    if style_attrs == 0:
        raise AssertionError('Ya no quedan style=; retirar style-src-attr unsafe-inline en lugar de mantenerlo')

    print(json.dumps({
        'style_blocks_static': blocks,
        'unique_static_style_hashes': len(expected_static),
        'pages_with_style_blocks': pages_with_blocks,
        'runtime_style_hashes': runtime_by_name,
        'unique_runtime_style_hashes': len(expected_runtime),
        'unique_style_src_elem_hashes': len(expected_all),
        'style_attrs_remaining': style_attrs,
        'pages_with_style_attrs': pages_with_attrs,
        'style_src_unsafe_inline': False,
        'style_src_elem_unsafe_inline': False,
        'style_src_attr_unsafe_inline_temporal': True,
        'passed': True,
    }, ensure_ascii=False))


if __name__ == '__main__':
    main()
