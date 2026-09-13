#!/usr/bin/env python3
"""Retira manejadores inline y publica los scripts inline con hashes CSP exactos.

Este paso actúa solo sobre el artefacto final ``dist`` y se ejecuta después de todas
las transformaciones HTML, incluida la precompilación de las 24 interfaces DC.

Contrato:
- cualquier atributo ``on*`` debe ser exactamente el fallback histórico del símbolo
  de marca: ``<img src=/img/v40-brand-symbol.webp onerror=\"this.remove()\">``;
- ese fallback se retira del HTML final (el recurso está alojado localmente);
- cada ``<script>`` ejecutable sin ``src`` recibe autorización únicamente mediante su
  hash SHA-256 exacto en ``script-src``;
- ``script-src 'unsafe-inline'`` y ``unsafe-eval`` quedan prohibidos;
- los bloques de datos (JSON-LD, JSON y text/x-dc) no se incluyen porque no ejecutan JS.
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
SRC_ATTR = re.compile(r'\bsrc\s*=\s*(["\']).*?\1', re.I | re.S)
TYPE_ATTR = re.compile(r'\btype\s*=\s*(["\'])(.*?)\1', re.I | re.S)
# El valor permitido se valida antes con HTMLParser. Esta regex solo elimina el
# atributo ya validado, con independencia de comillas/espaciado de la serialización.
ONERROR_ATTR = re.compile(
    r'\s+onerror\s*=\s*(?:"[^"]*"|\'[^\']*\'|[^\s>]+)', re.I
)
CSP_LINE = re.compile(
    r'^(?P<prefix>\s*Content-Security-Policy:\s*)(?P<policy>.+)$', re.M
)
SCRIPT_SRC = re.compile(r'(?P<prefix>(?:^|;)\s*script-src\s+)(?P<tokens>[^;]+)', re.I)


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
        body = match.group('body')
        digest = base64.b64encode(hashlib.sha256(body.encode('utf-8')).digest()).decode('ascii')
        hashes.append(f"'sha256-{digest}'")
    return hashes


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
                and event['value'].strip() == 'this.remove()'
                and event['src'] == '/img/v40-brand-symbol.webp'
            ):
                unexpected.append({'path': rel, **event})
        count = len(audit.events)
        if count:
            occurrences += count
            # Llegados aquí todos los event attrs de esta página ya han sido
            # validados como el fallback exacto permitido. Borramos su serialización.
            patched, removed = ONERROR_ATTR.subn('', text)
            if removed != count:
                raise AssertionError(
                    f'{rel}: se auditaron {count} manejadores pero solo se retiraron {removed}'
                )
            path.write_text(patched, encoding='utf-8')
            pages_changed += 1

    if unexpected:
        raise AssertionError(
            'Aparecieron manejadores inline distintos del fallback de marca: '
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


def collect_hashes(root: Path) -> tuple[list[str], int, list[dict[str, object]]]:
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


def update_csp(root: Path, hashes: list[str]) -> None:
    headers = root / '_headers'
    text = headers.read_text(encoding='utf-8', errors='strict')
    match = CSP_LINE.search(text)
    if not match:
        raise AssertionError('No se encuentra la CSP global en _headers')
    policy = match.group('policy')
    script = SCRIPT_SRC.search(policy)
    if not script:
        raise AssertionError('La CSP no contiene script-src')
    existing = script.group('tokens').split()
    allowed_before = {"'self'", "'unsafe-inline'"}
    existing_non_hash = {token for token in existing if not token.startswith(("'sha256-", "'sha384-", "'sha512-"))}
    if not existing_non_hash <= allowed_before or "'self'" not in existing_non_hash:
        raise AssertionError(f'script-src previo fuera del contrato: {existing}')
    if "'unsafe-eval'" in existing:
        raise AssertionError("script-src ha reintroducido 'unsafe-eval'")

    replacement = script.group('prefix') + ' '.join(["'self'", *hashes])
    policy = policy[:script.start()] + replacement + policy[script.end():]
    text = text[:match.start('policy')] + policy + text[match.end('policy'):]
    headers.write_text(text, encoding='utf-8')


def verify(root: Path, expected_hashes: list[str], total_scripts: int) -> None:
    headers = (root / '_headers').read_text(encoding='utf-8', errors='strict')
    match = CSP_LINE.search(headers)
    if not match:
        raise AssertionError('No se encuentra la CSP final')
    script = SCRIPT_SRC.search(match.group('policy'))
    if not script:
        raise AssertionError('No se encuentra script-src final')
    tokens = script.group('tokens').split()
    if "'unsafe-inline'" in tokens or "'unsafe-eval'" in tokens:
        raise AssertionError('script-src final conserva un permiso unsafe')
    declared = sorted(
        token for token in tokens
        if token.startswith(("'sha256-", "'sha384-", "'sha512-"))
    )
    if declared != expected_hashes:
        raise AssertionError(
            f'Hashes CSP fuera de sincronía: esperados {len(expected_hashes)}, declarados {len(declared)}'
        )

    actual: list[str] = []
    actual_total = 0
    for path in sorted(root.rglob('*.html')):
        row = executable_script_hashes(path.read_text(encoding='utf-8', errors='strict'))
        actual.extend(row)
        actual_total += len(row)
    if actual_total != total_scripts or sorted(set(actual)) != expected_hashes:
        raise AssertionError('Los scripts inline cambiaron después de calcular la CSP')


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path('dist'))
    args = parser.parse_args()
    root = args.root.resolve()

    handlers_removed, handler_pages = validate_and_remove_event_handlers(root)
    hashes, total_scripts, pages = collect_hashes(root)
    if total_scripts == 0 or not hashes:
        raise AssertionError('No se encontraron scripts inline ejecutables; revisar el contrato CSP')
    update_csp(root, hashes)
    verify(root, hashes, total_scripts)

    print(json.dumps({
        'event_handlers_removed': handlers_removed,
        'event_handler_pages': handler_pages,
        'event_handlers_remaining': 0,
        'inline_scripts': total_scripts,
        'unique_script_hashes': len(hashes),
        'pages_with_inline_scripts': len(pages),
        'script_src_unsafe_inline': False,
        'script_src_unsafe_eval': False,
        'style_src_unsafe_inline_untouched': True,
        'sample_pages': pages[:12],
    }, ensure_ascii=False))


if __name__ == '__main__':
    main()
