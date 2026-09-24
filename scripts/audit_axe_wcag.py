#!/usr/bin/env python3
"""Guardarraíl WCAG con axe-core sobre rutas representativas.

Baseline actual: cero violations. Los resultados ``incomplete`` de contraste se
conservan para revisión porque axe no puede resolver de forma fiable algunos fondos
y gradientes. La portada tiene un único incomplete conocido sobre aria-controls;
el propio auditor verifica en DOM que el botón apunta al dialog real.

Cualquier violation, error de página o incomplete nuevo fuera de esas categorías
detiene CI. Axe no sustituye una evaluación manual WCAG ni tecnologías de asistencia.
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
    '/es/recursos/juegos/',
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


def known_home_relation(page) -> dict:
    return page.evaluate("""() => {
      const b=document.getElementById('reading-open');
      if(!b)return {ok:false,reason:'missing-button'};
      const id=b.getAttribute('aria-controls');
      const target=id?document.getElementById(id):null;
      return {
        ok:id==='reading-dialog' && !!target && target.tagName==='DIALOG' && b.getAttribute('aria-haspopup')==='dialog',
        controls:id,
        targetTag:target&&target.tagName,
        haspopup:b.getAttribute('aria-haspopup')
      };
    }""")


def is_known_home_incomplete(route, item, relation):
    if route != '/' or item.get('id') != 'aria-valid-attr-value' or not relation.get('ok'):
        return False
    nodes=item.get('nodes', [])
    return bool(nodes) and all('#reading-open' in (node.get('target') or []) for node in nodes)


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
        'color_contrast_incomplete_nodes':0,
        'unexpected_incomplete':[],
        'page_errors':[],
        'limits':[
            'Automated axe results do not establish complete WCAG conformance.',
            'Color-contrast incomplete results remain manual-review items because backgrounds/gradients can be indeterminate to axe.',
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
            relation = known_home_relation(page) if route == '/' else {'ok':False}
            if route == '/' and not relation.get('ok'):
                errors.append('La relación reading-open -> dialog#reading-dialog no es válida: '+json.dumps(relation,ensure_ascii=False))
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
            unexpected=[]
            color_nodes=0
            for item in incomplete:
                if item.get('id') == 'color-contrast':
                    color_nodes += item.get('node_count',0)
                    continue
                if is_known_home_incomplete(route,item,relation):
                    continue
                unexpected.append(item)
            row={
                'route':route,
                'violations':violations,
                'incomplete':incomplete,
                'unexpected_incomplete':unexpected,
                'known_home_relation':relation if route=='/' else None,
                'violations_count':len(violations),
                'violation_nodes':sum(v['node_count'] for v in violations),
                'incomplete_count':len(incomplete),
                'incomplete_nodes':sum(v['node_count'] for v in incomplete),
                'color_contrast_incomplete_nodes':color_nodes,
                'page_errors':errors,
            }
            report['routes'].append(row)
            report['violations_total'] += row['violations_count']
            report['violation_nodes_total'] += row['violation_nodes']
            report['incomplete_total'] += row['incomplete_count']
            report['incomplete_nodes_total'] += row['incomplete_nodes']
            report['color_contrast_incomplete_nodes'] += color_nodes
            if unexpected:
                report['unexpected_incomplete'].append({'route':route,'items':unexpected})
            if errors:
                report['page_errors'].append({'route':route,'errors':errors})
            print(json.dumps({'route':route,'violations_count':row['violations_count'],'incomplete_count':row['incomplete_count'],'unexpected_incomplete':len(unexpected),'color_contrast_nodes':color_nodes},ensure_ascii=False),flush=True)
            ctx.close()
        browser.close()
    server.shutdown()

    report['summary']={
        'routes':len(report['routes']),
        'violations':report['violations_total'],
        'violation_nodes':report['violation_nodes_total'],
        'incomplete':report['incomplete_total'],
        'incomplete_nodes':report['incomplete_nodes_total'],
        'color_contrast_incomplete_nodes':report['color_contrast_incomplete_nodes'],
        'unexpected_incomplete':len(report['unexpected_incomplete']),
        'page_errors':len(report['page_errors']),
    }
    (out/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report['summary'],ensure_ascii=False))
    if report['page_errors']:
        raise SystemExit('Hay errores de página o una relación ARIA conocida dejó de ser válida')
    if report['violations_total']:
        raise SystemExit('axe-core encontró violations WCAG en la muestra')
    if report['unexpected_incomplete']:
        raise SystemExit('axe-core encontró resultados incomplete nuevos que requieren revisión')


if __name__ == '__main__':
    main()
