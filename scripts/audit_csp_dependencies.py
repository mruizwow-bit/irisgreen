#!/usr/bin/env python3
"""Audita las dependencias reales de Content-Security-Policy en la salida pública.

No modifica la web ni certifica seguridad. Exige que la ejecución de JavaScript inline
esté autorizada únicamente por hashes criptográficos exactos y mantiene inventariada,
por separado, la deuda restante de CSS inline.
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import json
import re
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

EXEC_DATA_TYPES = {
    'application/ld+json', 'application/json', 'text/x-dc', 'application/schema+json'
}
LOAD_LINK_RELS = {'stylesheet', 'preload', 'modulepreload', 'icon', 'manifest'}
URL_ATTRS = {
    'script': ('src',), 'img': ('src',), 'iframe': ('src',), 'audio': ('src',),
    'video': ('src', 'poster'), 'source': ('src',), 'track': ('src',),
}
REMOTE_CALL = re.compile(r'\b(?:fetch|open|sendBeacon)\s*\(\s*[\"\'](https?://[^\"\']+)', re.I)
VIDEO_FRAME_SOURCES = {
    'https://www.youtube-nocookie.com',
    'https://player.vimeo.com',
    'https://www.instagram.com',
}
INLINE_KEYS = ('inline_scripts', 'style_blocks', 'style_attrs', 'event_attrs')
SCRIPT_BLOCK = re.compile(r'<script\b(?P<attrs>[^>]*)>(?P<body>.*?)</script\s*>', re.I | re.S)
SRC_ATTR = re.compile(r'\bsrc\s*=\s*(["\']).*?\1', re.I | re.S)
TYPE_ATTR = re.compile(r'\btype\s*=\s*(["\'])(.*?)\1', re.I | re.S)


def origin(value: str) -> str | None:
    try:
        p = urlsplit(value)
    except ValueError:
        return None
    if p.scheme not in {'http', 'https'} or not p.netloc:
        return None
    return f'{p.scheme}://{p.netloc.lower()}'


def route_family(rel: str) -> str:
    parts = Path(rel).parts
    if rel == 'index.html':
        return 'raiz'
    if not parts:
        return 'raiz'
    if len(parts) >= 3 and parts[0] in {'es', 'en'} and parts[1] in {'neurodiversidad', 'neurodiversity', 'recursos'}:
        return '/'.join(parts[:3])
    if len(parts) >= 2 and parts[0] in {'es', 'en'}:
        return '/'.join(parts[:2])
    return parts[0]


def global_csp(root: Path) -> str:
    headers = root / '_headers'
    if not headers.is_file():
        raise AssertionError(f'No existe _headers en la salida pública: {headers}')
    text = headers.read_text(encoding='utf-8', errors='strict')
    match = re.search(r'^/\*\s*$.*?^\s*Content-Security-Policy:\s*(.+)$', text, re.M | re.S)
    if not match:
        raise AssertionError('No se encuentra la Content-Security-Policy global en _headers')
    return match.group(1).splitlines()[0].strip()


def parse_csp(policy: str) -> dict[str, list[str]]:
    directives: dict[str, list[str]] = {}
    for chunk in policy.split(';'):
        parts = chunk.strip().split()
        if not parts:
            continue
        name = parts[0].lower()
        if name in directives:
            raise AssertionError(f'Directiva CSP duplicada: {name}')
        directives[name] = parts[1:]
    return directives


def cryptographic_source(token: str) -> bool:
    return token.startswith(("'nonce-", "'sha256-", "'sha384-", "'sha512-")) and token.endswith("'")


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
        digest = base64.b64encode(
            hashlib.sha256(match.group('body').encode('utf-8')).digest()
        ).decode('ascii')
        hashes.append(f"'sha256-{digest}'")
    return hashes


def validate_csp_policy(root: Path) -> tuple[str, dict[str, list[str]]]:
    policy = global_csp(root)
    directives = parse_csp(policy)

    required = {
        'default-src', 'script-src', 'style-src', 'connect-src', 'frame-src',
        'object-src', 'base-uri', 'form-action', 'frame-ancestors',
    }
    missing = sorted(required - directives.keys())
    if missing:
        raise AssertionError(f'CSP incompleta; faltan directivas críticas: {missing}')

    wildcards = sorted(name for name, tokens in directives.items() if '*' in tokens)
    if wildcards:
        raise AssertionError(f'CSP debilitada con comodín * en: {wildcards}')

    fixed = {
        'default-src': {"'self'"},
        'object-src': {"'none'"},
        'base-uri': {"'self'"},
        'form-action': {"'self'"},
        'connect-src': {"'self'"},
    }
    for name, expected in fixed.items():
        got = set(directives[name])
        if name == 'connect-src' and got == {"'none'"}:
            continue
        if got != expected:
            raise AssertionError(
                f'CSP cambia el perímetro revisado de {name}: esperado {sorted(expected)}, obtenido {sorted(got)}'
            )

    frame_sources = set(directives['frame-src'])
    if frame_sources != VIDEO_FRAME_SOURCES:
        raise AssertionError(
            f'CSP cambia los proveedores de iframe revisados: {sorted(frame_sources)}'
        )
    ancestors = set(directives['frame-ancestors'])
    if ancestors not in ({"'self'"}, {"'none'"}):
        raise AssertionError(f'CSP amplía frame-ancestors: {sorted(ancestors)}')

    if "'unsafe-eval'" in directives['script-src']:
        raise AssertionError("La CSP ha reintroducido 'unsafe-eval'")
    if "'unsafe-inline'" in directives['script-src']:
        raise AssertionError("La CSP ha reintroducido script-src 'unsafe-inline'")

    script_allowed = {"'self'", "'strict-dynamic'", "'report-sample'"}
    style_allowed = {"'self'", "'unsafe-inline'", "'report-sample'"}
    bad_script = sorted(
        token for token in directives['script-src']
        if token not in script_allowed and not cryptographic_source(token)
    )
    if bad_script:
        raise AssertionError('CSP añade fuentes de script no revisadas: ' + ', '.join(bad_script))
    bad_style = sorted(
        token for token in directives['style-src']
        if token not in style_allowed and not cryptographic_source(token)
    )
    if bad_style:
        raise AssertionError('CSP añade fuentes de estilo no revisadas: ' + ', '.join(bad_style))

    unexpected_unsafe: list[str] = []
    for name, tokens in directives.items():
        allowed = {"'unsafe-inline'"} if name == 'style-src' else set()
        for token in tokens:
            if token.startswith("'unsafe-") and token not in allowed:
                unexpected_unsafe.append(f'{name} {token}')
    if unexpected_unsafe:
        raise AssertionError('CSP incorpora permisos unsafe nuevos: ' + ', '.join(sorted(unexpected_unsafe)))
    if 'upgrade-insecure-requests' not in directives:
        raise AssertionError('La CSP ha perdido upgrade-insecure-requests')
    return policy, directives


class PageAudit(HTMLParser):
    def __init__(self, text: str):
        super().__init__(convert_charrefs=True)
        self.resource_origins: Counter[str] = Counter()
        self.resource_examples: dict[str, list[str]] = {}
        self.inline_scripts = 0
        self.data_scripts = 0
        self.style_blocks = 0
        self.style_attrs = 0
        self.event_attrs = 0
        self.feed(text)

    def remember(self, value: str) -> None:
        o = origin(value)
        if not o:
            return
        self.resource_origins[o] += 1
        examples = self.resource_examples.setdefault(o, [])
        if value not in examples and len(examples) < 5:
            examples.append(value)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'style' in a:
            self.style_attrs += 1
        self.event_attrs += sum(1 for k, _ in attrs if k.lower().startswith('on'))
        if tag == 'script':
            if a.get('src'):
                self.remember(a['src'])
            else:
                typ = a.get('type', '').lower().strip()
                if typ in EXEC_DATA_TYPES:
                    self.data_scripts += 1
                else:
                    self.inline_scripts += 1
        elif tag == 'style':
            self.style_blocks += 1
        elif tag == 'link':
            rel = {x.lower() for x in a.get('rel', '').split()}
            if rel & LOAD_LINK_RELS and a.get('href'):
                self.remember(a['href'])
        else:
            for attr in URL_ATTRS.get(tag, ()):
                if a.get(attr):
                    self.remember(a[attr])


def top_pages(rows: list[dict], key: str, limit: int = 20) -> list[dict]:
    selected = [row for row in rows if row[key]]
    selected.sort(key=lambda row: (-row[key], row['path']))
    return [{'path': row['path'], key: row[key]} for row in selected[:limit]]


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root', type=Path, default=Path('dist'))
    ap.add_argument('--max-eval-like', type=int, default=0)
    args = ap.parse_args()
    if args.max_eval_like != 0:
        raise AssertionError('El límite de eval()/new Function() está congelado en 0')
    root = args.root.resolve()

    policy, directives = validate_csp_policy(root)
    totals = Counter()
    origins: Counter[str] = Counter()
    examples: dict[str, list[str]] = {}
    inline_rows: list[dict] = []
    family_totals: dict[str, Counter[str]] = {}
    needed_hashes: list[str] = []
    inline_script_total = 0

    html_files = sorted(root.rglob('*.html'))
    for path in html_files:
        text = path.read_text(encoding='utf-8', errors='strict')
        doc = PageAudit(text)
        rel = path.relative_to(root).as_posix()
        hashes = executable_script_hashes(text)
        needed_hashes.extend(hashes)
        inline_script_total += len(hashes)
        row = {
            'path': rel,
            'family': route_family(rel),
            'inline_scripts': doc.inline_scripts,
            'data_scripts': doc.data_scripts,
            'style_blocks': doc.style_blocks,
            'style_attrs': doc.style_attrs,
            'event_attrs': doc.event_attrs,
        }
        if any(row[key] for key in INLINE_KEYS):
            inline_rows.append(row)
        family = family_totals.setdefault(row['family'], Counter())
        for key in (*INLINE_KEYS, 'data_scripts'):
            totals[key] += row[key]
            family[key] += row[key]
        origins.update(doc.resource_origins)
        for o, rows in doc.resource_examples.items():
            dst = examples.setdefault(o, [])
            for item in rows:
                if item not in dst and len(dst) < 8:
                    dst.append(item)

    if totals['event_attrs'] != 0:
        raise AssertionError(f'Quedan {totals["event_attrs"]} manejadores de evento inline')
    if totals['inline_scripts'] != inline_script_total:
        raise AssertionError(
            f'El inventario de scripts inline no coincide: parser={totals["inline_scripts"]}, hashes={inline_script_total}'
        )

    expected_hashes = sorted(set(needed_hashes))
    declared_hashes = sorted(
        token for token in directives['script-src']
        if token.startswith(("'sha256-", "'sha384-", "'sha512-"))
    )
    if declared_hashes != expected_hashes:
        raise AssertionError(
            f'Hashes script-src fuera de sincronía: necesarios={len(expected_hashes)}, declarados={len(declared_hashes)}'
        )

    family_rows = []
    for family, counts in family_totals.items():
        if any(counts[key] for key in INLINE_KEYS):
            family_rows.append({'family': family, **{key: counts[key] for key in (*INLINE_KEYS, 'data_scripts')}})
    family_rows.sort(key=lambda row: (-row['style_attrs'], -row['style_blocks'], -row['inline_scripts'], row['family']))
    pages_affected = {key: sum(1 for row in inline_rows if row[key]) for key in INLINE_KEYS}
    tops = {key: top_pages(inline_rows, key) for key in INLINE_KEYS}

    js_files = sorted(root.rglob('*.js'))
    remote_calls: Counter[str] = Counter()
    remote_call_examples: dict[str, list[str]] = {}
    eval_like = 0
    for path in js_files:
        text = path.read_text(encoding='utf-8', errors='ignore')
        eval_like += len(re.findall(r'\beval\s*\(|\bnew\s+Function\s*\(', text))
        for m in REMOTE_CALL.finditer(text):
            o = origin(m.group(1))
            if not o:
                continue
            remote_calls[o] += 1
            ex = remote_call_examples.setdefault(o, [])
            rel = path.relative_to(root).as_posix()
            if rel not in ex and len(ex) < 8:
                ex.append(rel)
    if eval_like:
        raise AssertionError(f'La salida pública ha reintroducido eval()/new Function(): {eval_like}')

    insecure = sorted(o for o in set(origins) | set(remote_calls) if o.startswith('http://'))
    report = {
        'html_revisados': len(html_files),
        'js_revisados': len(js_files),
        'inline': dict(totals),
        'paginas_afectadas_inline': pages_affected,
        'inline_por_pagina': inline_rows,
        'inline_por_familia': family_rows,
        'top_paginas_inline': tops,
        'script_inline': {
            'scripts': inline_script_total,
            'hashes_unicos_necesarios': len(expected_hashes),
            'hashes_declarados': len(declared_hashes),
            'event_attrs': 0,
            'unsafe_inline': False,
            'unsafe_eval': False,
        },
        'recursos_externos': [
            {'origin': o, 'referencias': n, 'ejemplos': examples.get(o, [])}
            for o, n in sorted(origins.items())
        ],
        'llamadas_remotas_js': [
            {'origin': o, 'referencias': n, 'archivos': remote_call_examples.get(o, [])}
            for o, n in sorted(remote_calls.items())
        ],
        'eval_o_new_function': 0,
        'limite_eval_o_new_function': 0,
        'origenes_http_inseguros': insecure,
        'csp_publicada': policy,
        'csp_directivas': directives,
        'proveedores_iframe_revisados': sorted(VIDEO_FRAME_SOURCES),
        'csp_deuda_conocida': {
            'script_src_unsafe_inline': False,
            'script_src_unsafe_eval': False,
            'style_src_unsafe_inline': "'unsafe-inline'" in directives.get('style-src', []),
        },
        'conclusion': (
            'JavaScript inline queda autorizado exclusivamente por hashes SHA-256 exactos y no existen manejadores on*. '
            'La deuda CSP restante se limita a estilos inline: bloques <style> y atributos style. '
            'Debe migrarse por familias, empezando por CSS repetido, antes de retirar style-src unsafe-inline.'
        ),
    }
    out = root / 'reports/publicacion'
    out.mkdir(parents=True, exist_ok=True)
    (out / 'csp-inventario.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({
        'html_revisados': len(html_files),
        'inline_scripts': totals['inline_scripts'],
        'script_hashes_unicos': len(expected_hashes),
        'event_attrs': 0,
        'style_blocks': totals['style_blocks'],
        'style_attrs': totals['style_attrs'],
        'paginas_afectadas_inline': pages_affected,
        'top_style_attrs': tops['style_attrs'][:10],
        'top_style_blocks': tops['style_blocks'][:10],
        'top_familias_inline': family_rows[:15],
        'origenes_externos': len(origins),
        'llamadas_remotas_js': len(remote_calls),
        'eval_o_new_function': 0,
        'http_inseguro': len(insecure),
        'script_src_unsafe_inline': False,
        'style_src_unsafe_inline': "'unsafe-inline'" in directives.get('style-src', []),
    }, ensure_ascii=False))


if __name__ == '__main__':
    main()
