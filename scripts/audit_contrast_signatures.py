#!/usr/bin/env python3
"""Reduce los incomplete de color-contrast de axe a firmas de estilo revisables.

No decide por sí solo el contraste sobre gradientes. Agrupa los miles de nodos que
axe no puede resolver por color de texto, tamaño/peso y cadena efectiva de fondos,
para que la revisión posterior se haga sobre combinaciones reales y no por nodo.
"""
from __future__ import annotations

import argparse
import functools
import json
import threading
from collections import Counter, defaultdict
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

ROUTES = [
    '/', '/es/situaciones/', '/es/situaciones/la-ropa-me-molesta/',
    '/en/situations/clothes-feel-unbearable/', '/es/neurodiversidad/condiciones/',
    '/es/neurodiversidad/condiciones/autismo/', '/en/neurodiversity/conditions/autism/',
    '/es/biblioteca/', '/es/investigacion/', '/es/datos/',
    '/es/datos/autismo-en-la-poblacion/', '/en/data/autism-in-the-population/',
    '/es/tramites/directorio/', '/es/libros/', '/es/videos/', '/es/recursos/juegos/',
    '/es/recursos/juegos/las-cinco-cosas/', '/es/intereses/', '/es/taller/',
    '/es/sitio-tranquilo/'
]

JS_STYLE = r'''(selector) => {
  let el = null;
  try { el = document.querySelector(selector); } catch (_) {}
  if (!el) return null;
  const own = getComputedStyle(el);
  const layers = [];
  let node = el;
  let depth = 0;
  while (node && node.nodeType === 1 && depth < 10) {
    const cs = getComputedStyle(node);
    if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none') {
      layers.push({
        tag: node.tagName,
        id: node.id || '',
        cls: String(node.className || '').slice(0,120),
        backgroundColor: cs.backgroundColor,
        backgroundImage: cs.backgroundImage
      });
    }
    node = node.parentElement;
    depth++;
  }
  const r = el.getBoundingClientRect();
  return {
    color: own.color,
    fontSize: own.fontSize,
    fontWeight: own.fontWeight,
    opacity: own.opacity,
    textShadow: own.textShadow,
    box: [r.x,r.y,r.width,r.height],
    layers
  };
}'''


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root', type=Path, default=Path('dist'))
    ap.add_argument('--axe', type=Path, required=True)
    args = ap.parse_args()
    root = args.root.resolve()
    axe = args.axe.resolve().read_text(encoding='utf-8')
    out = root / 'reports' / 'wcag-contrast-signatures'
    out.mkdir(parents=True, exist_ok=True)

    server = ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(root)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}'

    counts: Counter[str] = Counter()
    examples: dict[str, list[dict]] = defaultdict(list)
    signature_data: dict[str, dict] = {}
    page_errors: list[dict] = []
    axe_nodes = 0

    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        for route in ROUTES:
            ctx = browser.new_context(viewport={'width':1280,'height':900}, reduced_motion='reduce')
            ctx.route('**/*', lambda req: req.continue_() if req.request.url.startswith(base) else req.abort())
            page = ctx.new_page()
            errors: list[str] = []
            page.on('pageerror', lambda err: errors.append(str(err)))
            page.goto(base + route, wait_until='domcontentloaded')
            page.locator('main h1').first.wait_for(timeout=15000)
            page.wait_for_timeout(350)
            page.add_script_tag(content=axe)
            result = page.evaluate("""async () => {
              return await axe.run(document, {
                runOnly:{type:'rule', values:['color-contrast']},
                resultTypes:['incomplete','violations']
              });
            }""")
            for bucket in ('violations','incomplete'):
                for rule in result.get(bucket, []):
                    for node in rule.get('nodes', []):
                        target = node.get('target') or []
                        selector = target[0] if target and isinstance(target[0], str) else None
                        if not selector:
                            continue
                        style = page.evaluate(JS_STYLE, selector)
                        if not style:
                            continue
                        axe_nodes += 1
                        signature = json.dumps({
                            'color': style['color'],
                            'fontSize': style['fontSize'],
                            'fontWeight': style['fontWeight'],
                            'opacity': style['opacity'],
                            'textShadow': style['textShadow'],
                            'layers': [
                                {'backgroundColor': x['backgroundColor'], 'backgroundImage': x['backgroundImage']}
                                for x in style['layers']
                            ]
                        }, sort_keys=True, ensure_ascii=False)
                        counts[signature] += 1
                        signature_data.setdefault(signature, json.loads(signature))
                        if len(examples[signature]) < 6:
                            examples[signature].append({
                                'route': route,
                                'target': target,
                                'html': (node.get('html') or '')[:350],
                                'failureSummary': node.get('failureSummary'),
                                'box': style['box'],
                            })
            if errors:
                page_errors.append({'route': route, 'errors': errors})
            ctx.close()
        browser.close()
    server.shutdown()

    rows = []
    for sig, count in counts.most_common():
        rows.append({
            'count': count,
            'style': signature_data[sig],
            'examples': examples[sig],
        })

    report = {
        'routes': ROUTES,
        'axe_color_contrast_nodes': axe_nodes,
        'unique_style_signatures': len(rows),
        'page_errors': page_errors,
        'signatures': rows,
        'limits': [
            'This groups unresolved contrast cases; it does not approve contrast over gradients.',
            'A later step must calculate or visually verify each unique background/foreground combination.',
            'The audit covers representative routes and their initial visible state.'
        ]
    }
    (out/'results.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    print(json.dumps({'routes':len(ROUTES),'axe_nodes':axe_nodes,'unique_signatures':len(rows),'page_errors':len(page_errors)}, ensure_ascii=False))
    if page_errors:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
