#!/usr/bin/env python3
"""Segunda opinión automática WCAG con axe-core sobre rutas representativas.

Esta primera pasada es informativa respecto a resultados de axe: registra
violations e incomplete para revisión antes de convertirlos en guardarraíl.
Sí falla por errores JavaScript de la propia página o si axe no puede ejecutarse.

Axe no sustituye una evaluación manual WCAG ni pruebas con tecnologías de asistencia.
"""
from __future__ import annotations

import argparse
import functools
import json
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path.cwd()
ROUTES = [
    '/',
    '/es/situaciones/',
    '/es/situaciones/la-ropa-me-molesta/',
    '/en/situations/clothes-feel-unbearable/',
    '/es/neurodiversidad/condiciones/',
    '/es/neurodiversidad/condiciones/autismo/',
    '/en/neurodiversity/conditions/autism/',
    '/es/biblioteca/',
    '/es/investigacion/',
    '/es/datos/',
    '/es/datos/autismo-en-la-poblacion/',
    '/en/data/autism-in-the-population/',
    '/es/tramites/directorio/',
    '/es/libros/',
    '/es/videos/',
    '/es/recursos/juegos/',
    '/es/recursos/juegos/las-cinco-cosas/',
    '/es/intereses/',
    '/es/taller/',
    '/es/sitio-tranquilo/',
]
TAGS = ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22a','wcag22aa']


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def compact_result(item):
    return {
        'id': item.get('id'),
        'impact': item.get('impact'),
        'description': item.get('description'),
        'help': item.get('help'),
        'helpUrl': item.get('helpUrl'),
        'tags': item.get('tags', []),
        'nodes': [
            {
                'target': node.get('target'),
                'html': (node.get('html') or '')[:500],
                'failureSummary': node.get('failureSummary'),
            }
            for node in item.get('nodes', [])[:25]
        ],
        'node_count': len(item.get('nodes', [])),
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root', type=Path, default=Path('dist'))
    ap.add_argument('--axe', type=Path, required=True)
    args = ap.parse_args()
    root = args.root.resolve()
    axe_path = args.axe.resolve()
    if not axe_path.is_file():
        raise FileNotFoundError(axe_path)
    axe_source = axe_path.read_text(encoding='utf-8')

    out = root / 'reports' / 'wcag-axe'
    out.mkdir(parents=True, exist_ok=True)

    server = ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(root)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}'

    report = {
        'engine':'axe-core 4.13.0',
        'tags':TAGS,
        'routes':[],
        'violations_total':0,
        'violation_nodes_total':0,
        'incomplete_total':0,
        'incomplete_nodes_total':0,
        'page_errors':[],
        'limits':[
            'Automated axe results do not establish complete WCAG conformance.',
            'Incomplete results require human review.',
            'The audit covers representative routes and their initial visible state.',
        ],
    }

    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        for route in ROUTES:
            ctx = browser.new_context(viewport={'width':1280,'height':900}, reduced_motion='reduce')
            ctx.route('**/*', lambda req: req.continue_() if req.request.url.startswith(base) else req.abort())
            page = ctx.new_page()
            errors=[]
            page.on('pageerror', lambda err: errors.append(str(err)))
            page.goto(base+route, wait_until='domcontentloaded')
            page.locator('main h1').first.wait_for(timeout=15000)
            page.wait_for_timeout(350)
            page.add_script_tag(content=axe_source)
            result = page.evaluate("""async (tags) => {
              if (!window.axe) throw new Error('axe no disponible');
              return await axe.run(document, {
                runOnly:{type:'tag', values:tags},
                resultTypes:['violations','incomplete']
              });
            }""", TAGS)
            violations=[compact_result(v) for v in result.get('violations', [])]
            incomplete=[compact_result(v) for v in result.get('incomplete', [])]
            row={
                'route':route,
                'violations':violations,
                'incomplete':incomplete,
                'violations_count':len(violations),
                'violation_nodes':sum(v['node_count'] for v in violations),
                'incomplete_count':len(incomplete),
                'incomplete_nodes':sum(v['node_count'] for v in incomplete),
                'page_errors':errors,
            }
            report['routes'].append(row)
            report['violations_total'] += row['violations_count']
            report['violation_nodes_total'] += row['violation_nodes']
            report['incomplete_total'] += row['incomplete_count']
            report['incomplete_nodes_total'] += row['incomplete_nodes']
            if errors:
                report['page_errors'].append({'route':route,'errors':errors})
            print(json.dumps({k:row[k] for k in ['route','violations_count','violation_nodes','incomplete_count','incomplete_nodes']},ensure_ascii=False),flush=True)
            ctx.close()
        browser.close()
    server.shutdown()

    report['summary']={
        'routes':len(report['routes']),
        'violations':report['violations_total'],
        'violation_nodes':report['violation_nodes_total'],
        'incomplete':report['incomplete_total'],
        'incomplete_nodes':report['incomplete_nodes_total'],
        'page_errors':len(report['page_errors']),
    }
    (out/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report['summary'],ensure_ascii=False))
    if report['page_errors']:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
