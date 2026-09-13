#!/usr/bin/env python3
"""Inventaría lo que la salida pública necesita antes de endurecer Content-Security-Policy.

No modifica la web ni certifica seguridad. Separa scripts/estilos inline de recursos
externos para evitar desplegar una CSP que rompa páginas dinámicas.
"""
from __future__ import annotations

import argparse
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
HTTP = re.compile(r'https?://[^\s\"\'<>`)]+', re.I)
REMOTE_CALL = re.compile(r'\b(?:fetch|open|sendBeacon)\s*\(\s*[\"\'](https?://[^\"\']+)', re.I)


def origin(value: str) -> str | None:
    try:
        p = urlsplit(value)
    except ValueError:
        return None
    if p.scheme not in {'http', 'https'} or not p.netloc:
        return None
    return f'{p.scheme}://{p.netloc.lower()}'


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
        self.in_style = False
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
            self.in_style = True
        elif tag == 'link':
            rel = {x.lower() for x in a.get('rel', '').split()}
            if rel & LOAD_LINK_RELS and a.get('href'):
                self.remember(a['href'])
        else:
            for attr in URL_ATTRS.get(tag, ()):
                if a.get(attr):
                    self.remember(a[attr])

    def handle_endtag(self, tag):
        if tag == 'style':
            self.in_style = False


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root', type=Path, default=Path('dist'))
    ap.add_argument(
        '--max-eval-like',
        type=int,
        default=6,
        help=(
            'Máximo temporal de usos de eval()/new Function() permitido en la salida. '
            'El baseline 6 corresponde a la deuda técnica ya inventariada en el runtime; '
            'el límite solo puede mantenerse o reducirse, nunca aumentarse para hacer pasar CI.'
        ),
    )
    args = ap.parse_args()
    root = args.root.resolve()

    totals = Counter()
    origins: Counter[str] = Counter()
    examples: dict[str, list[str]] = {}
    html_files = sorted(root.rglob('*.html'))
    for path in html_files:
        doc = PageAudit(path.read_text(encoding='utf-8', errors='strict'))
        totals['inline_scripts'] += doc.inline_scripts
        totals['data_scripts'] += doc.data_scripts
        totals['style_blocks'] += doc.style_blocks
        totals['style_attrs'] += doc.style_attrs
        totals['event_attrs'] += doc.event_attrs
        origins.update(doc.resource_origins)
        for o, rows in doc.resource_examples.items():
            dst = examples.setdefault(o, [])
            for row in rows:
                if row not in dst and len(dst) < 8:
                    dst.append(row)

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

    insecure = sorted(o for o in set(origins) | set(remote_calls) if o.startswith('http://'))
    report = {
        'html_revisados': len(html_files),
        'js_revisados': len(js_files),
        'inline': dict(totals),
        'recursos_externos': [
            {'origin': o, 'referencias': n, 'ejemplos': examples.get(o, [])}
            for o, n in sorted(origins.items())
        ],
        'llamadas_remotas_js': [
            {'origin': o, 'referencias': n, 'archivos': remote_call_examples.get(o, [])}
            for o, n in sorted(remote_calls.items())
        ],
        'eval_o_new_function': eval_like,
        'limite_eval_o_new_function': args.max_eval_like,
        'origenes_http_inseguros': insecure,
        'conclusion': (
            'No retirar unsafe-inline hasta migrar los scripts/estilos inline que este inventario contabiliza. '
            'unsafe-eval sigue siendo deuda técnica conocida del runtime: este control impide que aumente mientras se migra. '
            'Los orígenes externos listados deben revisarse antes de fijar script-src, style-src, img-src, frame-src o connect-src.'
        ),
    }
    out = root / 'reports/publicacion'
    out.mkdir(parents=True, exist_ok=True)
    (out / 'csp-inventario.json').write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8'
    )
    print(json.dumps({
        'html_revisados': len(html_files),
        'inline_scripts': totals['inline_scripts'],
        'style_blocks': totals['style_blocks'],
        'style_attrs': totals['style_attrs'],
        'event_attrs': totals['event_attrs'],
        'origenes_externos': len(origins),
        'llamadas_remotas_js': len(remote_calls),
        'eval_o_new_function': eval_like,
        'limite_eval_o_new_function': args.max_eval_like,
        'http_inseguro': len(insecure),
    }, ensure_ascii=False))
    if eval_like > args.max_eval_like:
        raise AssertionError(
            f'La salida pública ha aumentado eval()/new Function(): {eval_like} > {args.max_eval_like}. '
            'No ampliar el límite; localizar la regresión o reducir la dependencia del runtime.'
        )


if __name__ == '__main__':
    main()
