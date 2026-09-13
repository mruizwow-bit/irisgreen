#!/usr/bin/env python3
"""Inventario WCAG 1.3.1 para tablas de la salida pública.

No impone requisitos ajenos a WCAG: la ausencia de <caption> se informa, pero no
se considera fallo. Clasifica cada tabla según su estructura y deja para revisión
manual las tablas complejas o sin encabezados explícitos.

Comprueba mecánicamente:
- scope válido cuando existe;
- referencias headers -> th[id] resolubles dentro de la tabla;
- si hay celdas de encabezado;
- si la tabla es simple o compleja (rowspan/colspan > 1).

La primera pasada es informativa. Solo falla por referencias headers rotas o
valores scope inválidos, que sí son errores estructurales objetivos.
"""
from __future__ import annotations

import argparse
import json
from html.parser import HTMLParser
from pathlib import Path

VALID_SCOPE = {'row','col','rowgroup','colgroup'}


class Table:
    def __init__(self, attrs):
        self.attrs = dict(attrs)
        self.th = []
        self.td = []
        self.caption = False
        self.complex = False
        self.depth = 0


class Parser(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.tables = []
        self.stack = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'table':
            t = Table(attrs)
            self.stack.append(t)
            self.tables.append(t)
            return
        if not self.stack:
            return
        t = self.stack[-1]
        if tag == 'caption':
            t.caption = True
        elif tag == 'th':
            t.th.append(a)
            if int(a.get('rowspan','1') or '1') > 1 or int(a.get('colspan','1') or '1') > 1:
                t.complex = True
        elif tag == 'td':
            t.td.append(a)
            if int(a.get('rowspan','1') or '1') > 1 or int(a.get('colspan','1') or '1') > 1:
                t.complex = True

    def handle_endtag(self, tag):
        if tag == 'table' and self.stack:
            self.stack.pop()


def classify(table):
    role = (table.attrs.get('role') or '').lower()
    if role in {'presentation','none'}:
        return 'presentation', []

    problems = []
    header_ids = {a.get('id') for a in table.th if a.get('id')}
    for th in table.th:
        scope = (th.get('scope') or '').lower()
        if scope and scope not in VALID_SCOPE:
            problems.append('scope inválido: ' + scope)
    for cell in table.td + table.th:
        refs = (cell.get('headers') or '').split()
        missing = [r for r in refs if r not in header_ids]
        if missing:
            problems.append('headers apunta a id inexistente: ' + ', '.join(missing))

    if problems:
        return 'objective_error', problems
    if not table.th:
        return 'manual_no_headers', []
    if table.complex:
        explicit_scope = all((th.get('scope') or '').lower() in VALID_SCOPE for th in table.th)
        explicit_headers = any((cell.get('headers') or '').strip() for cell in table.td)
        return ('complex_explicit' if explicit_scope or explicit_headers else 'manual_complex'), []
    if all((th.get('scope') or '').lower() in VALID_SCOPE for th in table.th if th.get('scope')):
        return 'simple_inferred_or_scoped', []
    return 'simple_inferred_or_scoped', []


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root', type=Path, default=Path('dist'))
    args = ap.parse_args()
    root = args.root.resolve()

    rows = []
    objective = []
    counts = {}
    scanned = 0
    for path in sorted(root.rglob('*.html')):
        scanned += 1
        rel = path.relative_to(root).as_posix()
        parser = Parser(path.read_text(encoding='utf-8'))
        for n, table in enumerate(parser.tables, 1):
            status, problems = classify(table)
            counts[status] = counts.get(status, 0) + 1
            row = {
                'page': rel,
                'table': n,
                'status': status,
                'th': len(table.th),
                'td': len(table.td),
                'caption': table.caption,
                'complex': table.complex,
                'role': table.attrs.get('role'),
                'problems': problems,
            }
            rows.append(row)
            if status == 'objective_error':
                objective.append(row)

    report = {
        'criterion':'WCAG 2.2 SC 1.3.1 Info and Relationships',
        'html_scanned': scanned,
        'tables': len(rows),
        'counts': counts,
        'objective_errors': objective,
        'manual_review': [r for r in rows if r['status'] in {'manual_no_headers','manual_complex'}],
        'tables_detail': rows,
        'notes': [
            'caption absence is reported but is not treated as an automatic WCAG failure.',
            'Simple HTML tables may have header associations inferred by user agents without scope.',
            'Complex tables without explicit associations remain manual-review candidates.',
        ],
    }
    out = root / 'reports' / 'wcag-tables'
    out.mkdir(parents=True, exist_ok=True)
    (out/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'html_scanned':scanned,'tables':len(rows),'counts':counts,'objective_errors':len(objective),'manual_review':len(report['manual_review'])},ensure_ascii=False))
    if objective:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
