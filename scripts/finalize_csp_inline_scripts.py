#!/usr/bin/env python3
"""Retira manejadores inline y publica scripts/estilos inline con CSP acotada.

Este paso actúa solo sobre el artefacto final ``dist`` y se ejecuta después de todas
las transformaciones HTML, incluida la precompilación de las 24 interfaces DC.

Contrato:
- cualquier atributo ``on*`` debe pertenecer al símbolo local de marca
  ``v40-brand-symbol.webp`` y usar uno de los dos fallbacks históricos exactos:
  ``this.remove()`` o ``this.hidden=true``;
- esos fallbacks se retiran del HTML final;
- cada ``<script>`` ejecutable sin ``src`` se autoriza mediante SHA-256 exacto;
- cada bloque ``<style>`` presente en el HTML se autoriza mediante SHA-256 exacto;
- las cuatro hojas que el runtime DC crea en ejecución (base, full-page, atomics y
  la hoja vacía para reglas pseudo) se derivan del propio runtime y se autorizan
  también por hash, sin copiar hashes observados del navegador;
- ``script-src 'unsafe-inline'`` y ``unsafe-eval`` quedan prohibidos;
- ``style-src`` queda limitado a ``'self'``;
- ``style-src-attr 'unsafe-inline'`` se conserva temporalmente solo para atributos
  ``style=`` pendientes de migración.
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import json
import re
from html.parser import HTMLParser
from pathlib import Path

EXEC_DATA_TYPES = {
    'application/ld+json', 'application/json', 'text/x-dc', 'application/schema+json'
}
SCRIPT_BLOCK = re.compile(
    r'<script\b(?P<attrs>[^>]*)>(?P<body>.*?)</script\s*>', re.I | re.S
)
STYLE_BLOCK = re.compile(r'<style\b[^>]*>(?P<body>.*?)</style\s*>', re.I | re.S)
SRC_ATTR = re.compile(r'\bsrc\s*=\s*(["\']).*?\1', re.I | re.S)
TYPE_ATTR = re.compile(r'\btype\s*=\s*(["\'])(.*?)\1', re.I | re.S)
BRAND_SRC = re.compile(r'^(?:/|(?:\.\./)+)img/v40-brand-symbol\.webp$')
BRAND_FALLBACKS = {'this.remove()', 'this.hidden=true'}
ONERROR_ATTR = re.compile(
    r'\s+onerror\s*=\s*(?:"[^"]*"|\'[^\']*\'|[^\s>]+)', re.I
)
CSP_LINE = re.compile(
    r'^(?P<prefix>\s*Content-Security-Policy:\s*)(?P<policy>.+)$', re.M
)
SCRIPT_SRC = re.compile(r'(?P<prefix>(?:^|;)\s*script-src\s+)(?P<tokens>[^;]+)', re.I)
STYLE_SRC = re.compile(r'(?P<prefix>(?:^|;)\s*style-src\s+)(?P<tokens>[^;]+)', re.I)
STYLE_SRC_ELEM = re.compile(r'(?P<prefix>(?:^|;)\s*style-src-elem\s+)(?P<tokens>[^;]+)', re.I)
STYLE_SRC_ATTR = re.compile(r'(?P<prefix>(?:^|;)\s*style-src-attr\s+)(?P<tokens>[^;]+)', re.I)
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


class EventAudit(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.events: list[dict[str, str]] = []

    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        for name, value in attrs:
            if name.lower().startswith('on'):
                self.events.append({
                    'tag': tag.lower(),
                    'name': name.lower(),
                    'value': value or '',
                    'src': data.get('src', ''),
                })


def sha256_source(body: str) -> str:
    digest = base64.b64encode(hashlib.sha256(body.encode('utf-8')).digest()).decode('ascii')
    return f"'sha256-{digest}'"


def executable_script_hashes(text: str) -> list[str]:
    hashes: list[str] = []
    for match in SCRIPT_BLOCK.finditer(text):
        attrs = match.group('attrs')
        if SRC_ATTR.search(attrs):
            continue
        typ_match = TYPE_ATTR.search(attrs)
        typ = typ_match.group(2).strip().lower() if typ_match else ''
        if typ in EXEC_DATA_TYPES:
            continue
        hashes.append(sha256_source(match.group('body')))
    return hashes


def style_block_hashes(text: str) -> list[str]:
    return [sha256_source(match.group('body')) for match in STYLE_BLOCK.finditer(text)]


def decode_template_literal(raw: str) -> str:
    """Decodifica el subconjunto de escapes usado por BASE_CSS generado."""
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
        ch = raw[i]
        if ch != '\\':
            out.append(ch)
            i += 1
            continue
        if i + 1 >= len(raw):
            raise AssertionError('Escape incompleto en BASE_CSS')
        nxt = raw[i + 1]
        if nxt in simple:
            out.append(simple[nxt])
            i += 2
        elif nxt == 'u':
            if i + 5 >= len(raw):
                raise AssertionError('Escape unicode incompleto en BASE_CSS')
            value = raw[i + 2:i + 6]
            if not re.fullmatch(r'[0-9A-Fa-f]{4}', value):
                raise AssertionError(f'Escape unicode no previsto en BASE_CSS: {value!r}')
            out.append(chr(int(value, 16)))
            i += 6
        elif nxt == 'x':
            if i + 3 >= len(raw):
                raise AssertionError('Escape hexadecimal incompleto en BASE_CSS')
            value = raw[i + 2:i + 4]
            if not re.fullmatch(r'[0-9A-Fa-f]{2}', value):
                raise AssertionError(f'Escape hexadecimal no previsto en BASE_CSS: {value!r}')
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


def runtime_style_sources(root: Path) -> dict[str, str]:
    """Extrae las hojas deterministas que el runtime DC crea en ejecución."""
    path = root / RUNTIME_PATH
    if not path.is_file():
        raise FileNotFoundError(path)
    text = path.read_text(encoding='utf-8', errors='strict')

    base = BASE_CSS.search(text)
    full = FULL_PAGE_CSS.search(text)
    atomic = ATOMIC_CSS.search(text)
    if not base or not full or not atomic:
        raise AssertionError(
            'No se pueden derivar BASE_CSS/FULL_PAGE_CSS/ATOMIC_CSS del runtime CSP-safe'
        )

    try:
        full_value = json.loads(full.group('literal'))
        atomic_value = json.loads(atomic.group('literal'))
    except json.JSONDecodeError as exc:
        raise AssertionError(f'Literal CSS del runtime no decodificable: {exc}') from exc

    values = {
        'BASE_CSS': decode_template_literal(base.group('body')),
        'FULL_PAGE_CSS': full_value,
        'ATOMIC_CSS': atomic_value,
        'PSEUDO_EMPTY': '',
    }
    if len(set(values.values())) != len(values):
        raise AssertionError('Las hojas runtime esperadas ya no son cuatro contenidos distintos')
    return values


def runtime_style_hashes(root: Path) -> tuple[list[str], dict[str, str]]:
    sources = runtime_style_sources(root)
    by_name = {name: sha256_source(body) for name, body in sources.items()}
    return sorted(set(by_name.values())), by_name


def validate_and_remove_event_handlers(root: Path) -> tuple[int, int]:
    occurrences = 0
    pages_changed = 0
    unexpected: list[dict[str, str]] = []

    for path in sorted(root.rglob('*.html')):
        text = path.read_text(encoding='utf-8', errors='strict')
        audit = EventAudit()
        audit.feed(text)
        rel = path.relative_to(root).as_posix()
        for event in audit.events:
            if not (
                event['tag'] == 'img'
                and event['name'] == 'onerror'
                and event['value'].strip() in BRAND_FALLBACKS
                and BRAND_SRC.fullmatch(event['src']) is not None
            ):
                unexpected.append({'path': rel, **event})
        count = len(audit.events)
        if count:
            occurrences += count
            patched, removed = ONERROR_ATTR.subn('', text)
            if removed != count:
                raise AssertionError(
                    f'{rel}: se auditaron {count} manejadores pero solo se retiraron {removed}'
                )
            path.write_text(patched, encoding='utf-8')
            pages_changed += 1

    if unexpected:
        raise AssertionError(
            'Aparecieron manejadores inline fuera del fallback de marca permitido: '
            + json.dumps(unexpected[:20], ensure_ascii=False)
        )
    if occurrences == 0:
        raise AssertionError('No se encontró el fallback onerror esperado; revisar el contrato antes de continuar')

    remaining: list[dict[str, str]] = []
    for path in sorted(root.rglob('*.html')):
        audit = EventAudit()
        audit.feed(path.read_text(encoding='utf-8', errors='strict'))
        if audit.events:
            remaining.append({
                'path': path.relative_to(root).as_posix(),
                'events': str(audit.events[:4]),
            })
    if remaining:
        raise AssertionError('Quedan manejadores inline: ' + json.dumps(remaining[:20], ensure_ascii=False))
    return occurrences, pages_changed


def collect_script_hashes(root: Path) -> tuple[list[str], int, list[dict[str, object]]]:
    hashes: list[str] = []
    pages: list[dict[str, object]] = []
    total = 0
    for path in sorted(root.rglob('*.html')):
        text = path.read_text(encoding='utf-8', errors='strict')
        row = executable_script_hashes(text)
        if row:
            rel = path.relative_to(root).as_posix()
            pages.append({'path': rel, 'scripts': len(row), 'hashes': row})
            hashes.extend(row)
            total += len(row)
    return sorted(set(hashes)), total, pages


def collect_style_hashes(root: Path) -> tuple[list[str], int, list[dict[str, object]]]:
    hashes: list[str] = []
    pages: list[dict[str, object]] = []
    total = 0
    for path in sorted(root.rglob('*.html')):
        text = path.read_text(encoding='utf-8', errors='strict')
        row = style_block_hashes(text)
        if row:
            rel = path.relative_to(root).as_posix()
            pages.append({'path': rel, 'styles': len(row), 'hashes': row})
            hashes.extend(row)
            total += len(row)
    return sorted(set(hashes)), total, pages


def replace_directive(policy: str, pattern: re.Pattern[str], tokens: list[str], name: str) -> str:
    match = pattern.search(policy)
    if not match:
        raise AssertionError(f'La CSP no contiene {name}')
    replacement = match.group('prefix') + ' '.join(tokens)
    return policy[:match.start()] + replacement + policy[match.end():]


def update_csp(root: Path, script_hashes: list[str], style_hashes: list[str]) -> None:
    headers = root / '_headers'
    text = headers.read_text(encoding='utf-8', errors='strict')
    match = CSP_LINE.search(text)
    if not match:
        raise AssertionError('No se encuentra la CSP global en _headers')
    policy = match.group('policy')

    script = SCRIPT_SRC.search(policy)
    if not script:
        raise AssertionError('La CSP no contiene script-src')
    existing_script = script.group('tokens').split()
    existing_script_non_hash = {token for token in existing_script if not token.startswith(HASH_PREFIXES)}
    if not existing_script_non_hash <= {"'self'", "'unsafe-inline'"} or "'self'" not in existing_script_non_hash:
        raise AssertionError(f'script-src previo fuera del contrato: {existing_script}')
    if "'unsafe-eval'" in existing_script:
        raise AssertionError("script-src ha reintroducido 'unsafe-eval'")
    policy = replace_directive(policy, SCRIPT_SRC, ["'self'", *script_hashes], 'script-src')

    style = STYLE_SRC.search(policy)
    if not style:
        raise AssertionError('La CSP no contiene style-src')
    style_tokens = style.group('tokens').split()
    if set(style_tokens) != {"'self'"}:
        raise AssertionError(f'style-src previo fuera del contrato: {style_tokens}')

    style_elem = STYLE_SRC_ELEM.search(policy)
    if not style_elem:
        raise AssertionError('La CSP no contiene style-src-elem')
    elem_tokens = style_elem.group('tokens').split()
    elem_non_hash = {token for token in elem_tokens if not token.startswith(HASH_PREFIXES)}
    if elem_non_hash != {"'self'"}:
        raise AssertionError(f'style-src-elem previo fuera del contrato: {elem_tokens}')
    policy = replace_directive(policy, STYLE_SRC_ELEM, ["'self'", *style_hashes], 'style-src-elem')

    style_attr = STYLE_SRC_ATTR.search(policy)
    if not style_attr:
        raise AssertionError('La CSP no contiene style-src-attr')
    attr_tokens = style_attr.group('tokens').split()
    if set(attr_tokens) != {"'unsafe-inline'"}:
        raise AssertionError(f'style-src-attr fuera del contrato temporal: {attr_tokens}')

    text = text[:match.start('policy')] + policy + text[match.end('policy'):]
    headers.write_text(text, encoding='utf-8')


def verify(
    root: Path,
    expected_script_hashes: list[str],
    total_scripts: int,
    expected_static_style_hashes: list[str],
    expected_runtime_style_hashes: list[str],
    total_styles: int,
) -> None:
    headers = (root / '_headers').read_text(encoding='utf-8', errors='strict')
    match = CSP_LINE.search(headers)
    if not match:
        raise AssertionError('No se encuentra la CSP final')
    policy = match.group('policy')

    script = SCRIPT_SRC.search(policy)
    if not script:
        raise AssertionError('No se encuentra script-src final')
    script_tokens = script.group('tokens').split()
    if "'unsafe-inline'" in script_tokens or "'unsafe-eval'" in script_tokens:
        raise AssertionError('script-src final conserva un permiso unsafe')
    declared_scripts = sorted(token for token in script_tokens if token.startswith(HASH_PREFIXES))
    if declared_scripts != expected_script_hashes:
        raise AssertionError(
            f'Hashes de script fuera de sincronía: esperados {len(expected_script_hashes)}, declarados {len(declared_scripts)}'
        )

    style = STYLE_SRC.search(policy)
    if not style or set(style.group('tokens').split()) != {"'self'"}:
        raise AssertionError('style-src debe quedar limitado a self')

    style_elem = STYLE_SRC_ELEM.search(policy)
    if not style_elem:
        raise AssertionError('No se encuentra style-src-elem final')
    elem_tokens = style_elem.group('tokens').split()
    if "'unsafe-inline'" in elem_tokens:
        raise AssertionError("style-src-elem no puede contener 'unsafe-inline'")
    declared_styles = sorted(token for token in elem_tokens if token.startswith(HASH_PREFIXES))
    expected_all_styles = sorted(set(expected_static_style_hashes) | set(expected_runtime_style_hashes))
    if declared_styles != expected_all_styles:
        raise AssertionError(
            f'Hashes de style fuera de sincronía: esperados {len(expected_all_styles)}, declarados {len(declared_styles)}'
        )

    style_attr = STYLE_SRC_ATTR.search(policy)
    if not style_attr or set(style_attr.group('tokens').split()) != {"'unsafe-inline'"}:
        raise AssertionError('style-src-attr debe conservar solo la excepción temporal unsafe-inline')

    actual_scripts: list[str] = []
    actual_styles: list[str] = []
    actual_script_total = 0
    actual_style_total = 0
    for path in sorted(root.rglob('*.html')):
        text = path.read_text(encoding='utf-8', errors='strict')
        scripts = executable_script_hashes(text)
        styles = style_block_hashes(text)
        actual_scripts.extend(scripts)
        actual_styles.extend(styles)
        actual_script_total += len(scripts)
        actual_style_total += len(styles)
    if actual_script_total != total_scripts or sorted(set(actual_scripts)) != expected_script_hashes:
        raise AssertionError('Los scripts inline cambiaron después de calcular la CSP')
    if actual_style_total != total_styles or sorted(set(actual_styles)) != expected_static_style_hashes:
        raise AssertionError('Los bloques style estáticos cambiaron después de calcular la CSP')

    runtime_now, _ = runtime_style_hashes(root)
    if runtime_now != expected_runtime_style_hashes:
        raise AssertionError('Las hojas runtime DC cambiaron después de calcular la CSP')


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path('dist'))
    args = parser.parse_args()
    root = args.root.resolve()

    handlers_removed, handler_pages = validate_and_remove_event_handlers(root)
    script_hashes, total_scripts, script_pages = collect_script_hashes(root)
    static_style_hashes, total_styles, style_pages = collect_style_hashes(root)
    runtime_hashes, runtime_by_name = runtime_style_hashes(root)
    all_style_hashes = sorted(set(static_style_hashes) | set(runtime_hashes))

    if total_scripts == 0 or not script_hashes:
        raise AssertionError('No se encontraron scripts inline ejecutables; revisar el contrato CSP')
    if total_styles == 0 or not static_style_hashes:
        raise AssertionError('No se encontraron bloques style; revisar el contrato CSP')

    update_csp(root, script_hashes, all_style_hashes)
    verify(
        root,
        script_hashes,
        total_scripts,
        static_style_hashes,
        runtime_hashes,
        total_styles,
    )

    print(json.dumps({
        'event_handlers_removed': handlers_removed,
        'event_handler_pages': handler_pages,
        'event_handlers_remaining': 0,
        'inline_scripts': total_scripts,
        'unique_script_hashes': len(script_hashes),
        'pages_with_inline_scripts': len(script_pages),
        'style_blocks_static': total_styles,
        'unique_static_style_hashes': len(static_style_hashes),
        'pages_with_style_blocks': len(style_pages),
        'runtime_style_hashes': runtime_by_name,
        'unique_runtime_style_hashes': len(runtime_hashes),
        'unique_style_src_elem_hashes': len(all_style_hashes),
        'script_src_unsafe_inline': False,
        'script_src_unsafe_eval': False,
        'style_src_unsafe_inline': False,
        'style_src_elem_unsafe_inline': False,
        'style_src_attr_unsafe_inline_temporal': True,
        'sample_script_pages': script_pages[:8],
        'sample_style_pages': style_pages[:8],
    }, ensure_ascii=False))


if __name__ == '__main__':
    main()
