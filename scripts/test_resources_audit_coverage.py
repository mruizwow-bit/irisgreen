#!/usr/bin/env python3
"""R42 · Bloque H · Cobertura real de auditorías en las herramientas de Recursos.

`audit_axe_wcag.py` y `audit_target_size.py` listaban `/es/recursos/juegos/`
dos veces y no auditaban ninguna otra herramienta: ni la Tarjeta Iris, ni las
Rutinas visuales, ni las Rutinas imprimibles, ni ninguna ruta `/en/resources/`.
La repetición no añadía cobertura; las siete rutas que faltaban, sí.

Este test existe para que añadir una ruta a un auditor no pueda ser un gesto de
conteo: comprueba que cada ruta declarada es realmente auditable.

Comprueba:

  1. Ninguna de las dos listas de rutas contiene repeticiones.
  2. Las ocho rutas de herramienta (cuatro parejas ES/EN) están en las dos
     listas.
  3. Cada ruta declarada por cualquiera de los dos auditores existe en el
     directorio publicado. Una ruta que no existe se auditaría como 404 y
     pasaría sin auditar nada.
  4. Compatible con axe: cada ruta de herramienta carga sin errores de página,
     tiene un único `<main>` y un `<h1>` con texto.
  5. Compatible con la auditoría de objetivos: cada ruta de herramienta expone
     al menos un objetivo interactivo visible según el mismo selector que usa
     `audit_target_size.py`. Sin objetivos, incluirla subiría el recuento de
     rutas sin medir nada.
  6. Sitemap: toda ruta de herramienta marcada `index,follow` está en
     `sitemap.xml`, y ninguna marcada `noindex` aparece en él.
  7. Cada ruta de herramienta aparece exactamente una vez en cada sitemap
     publicado. Los dos sitemaps no son el mismo documento — difieren en rutas
     de Taller que esta orden no toca — pero no pueden discrepar entre sí sobre
     las herramientas de Recursos.
  8. Cada pareja ES/EN declara canonical propio y `hreflang` recíproco.

Lo que este test NO certifica:
  - No ejecuta axe ni mide tamaños: comprueba que la ruta es auditable, no que
    apruebe la auditoría. Eso lo dicen `audit_axe_wcag.py` y
    `audit_target_size.py` al correr.
  - Chromium sin tecnología de apoyo real. No sustituye la revisión humana.
  - No opina sobre las rutas ajenas a Recursos que ya estaban en las listas,
    más allá de que existan y no se repitan.

Ejecutar desde la raíz del repositorio, con el sitio ya construido:
    python3 scripts/test_resources_audit_coverage.py --root dist
"""
import argparse
import ast
import functools
import json
import re
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parent.parent

AUDITORS = {
    'axe': REPO / 'scripts/audit_axe_wcag.py',
    'target_size': REPO / 'scripts/audit_target_size.py',
}

PAIRS = [
    ('/es/recursos/juegos/', '/en/resources/games/'),
    ('/es/recursos/rutinas-visuales/', '/en/resources/visual-routines/'),
    ('/es/recursos/rutinas-imprimibles/', '/en/resources/printable-routines/'),
    ('/es/recursos/tarjeta-iris/', '/en/resources/iris-card/'),
]
TOOLS = [route for pair in PAIRS for route in pair]

# El mismo selector que audit_target_size.py, para que «compatible» signifique
# compatible con esa auditoría y no con una definición propia más benévola.
JS_ONE_TARGET = r'''() => {
  const selector = [
    'a[href]','button','input:not([type=hidden])','select','textarea','summary',
    '[role=button]','[role=link]','[role=checkbox]','[role=radio]',
    '[role=switch]','[role=tab]','[role=menuitem]'
  ].join(',');
  let n = 0;
  for (const el of document.querySelectorAll(selector)) {
    if (el.closest('[hidden],[aria-hidden="true"],template,noscript')) continue;
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.pointerEvents === 'none') continue;
    if (r.width <= 0 || r.height <= 0) continue;
    if (el.disabled || el.getAttribute('aria-disabled') === 'true') continue;
    n++;
  }
  return n;
}'''


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def routes_of(path):
    """Lee la lista ROUTES de un auditor sin importarlo ni ejecutarlo."""
    tree = ast.parse(path.read_text(encoding='utf-8'))
    for node in tree.body:
        if isinstance(node, ast.Assign) and any(
                isinstance(t, ast.Name) and t.id == 'ROUTES' for t in node.targets):
            return list(ast.literal_eval(node.value))
    raise AssertionError(f'{path.name} no declara ROUTES')


def meta_robots(html):
    m = re.search(r'<meta\s+name="robots"\s+content="([^"]*)"', html)
    return m.group(1).strip().lower() if m else ''


def alternates(html):
    return dict(re.findall(
        r'<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"', html))


def canonical(html):
    m = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"', html)
    return m.group(1) if m else ''


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', type=Path, default=Path('dist'))
    args = ap.parse_args()
    root = args.root.resolve()
    assert root.is_dir(), f'No existe el directorio publicado: {root}'

    out = root / 'reports/r42-recursos'
    out.mkdir(parents=True, exist_ok=True)
    report = {'auditors': {}, 'tools': [], 'failures': [], 'notes': [
        'Comprueba que la ruta es auditable, no que apruebe la auditoría.',
        'Chromium sin tecnología de apoyo real: no sustituye revisión humana.',
    ]}
    failures = report['failures']

    # 1, 2 y 3 · las listas de rutas
    for name, path in AUDITORS.items():
        routes = routes_of(path)
        dupes = sorted({r for r in routes if routes.count(r) > 1})
        missing_tools = [r for r in TOOLS if r not in routes]
        absent = [r for r in routes if not (root / r.strip('/') / 'index.html').is_file()]
        report['auditors'][name] = {
            'routes': len(routes), 'duplicates': dupes,
            'tools_missing': missing_tools, 'not_published': absent,
        }
        if dupes:
            failures.append(f'{name}: rutas repetidas {dupes}')
        if missing_tools:
            failures.append(f'{name}: faltan rutas de herramienta {missing_tools}')
        if absent:
            failures.append(f'{name}: rutas que no existen en el publicado {absent}')

    # 6 y 7 · sitemaps publicados
    sitemaps = {p.name: p.read_text(encoding='utf-8')
                for p in sorted(root.glob('sitemap*.xml'))}
    assert 'sitemap.xml' in sitemaps, 'El directorio publicado no lleva sitemap.xml'
    sitemap = sitemaps['sitemap.xml']
    report['sitemaps'] = sorted(sitemaps)
    for route in TOOLS:
        counts = {name: text.count(f'<loc>https://irisgreen.eu{route}</loc>')
                  for name, text in sitemaps.items()}
        if len(set(counts.values())) > 1:
            failures.append(f'{route}: los sitemaps discrepan {counts}')
        if any(n > 1 for n in counts.values()):
            failures.append(f'{route}: repetida en el sitemap {counts}')

    # 4, 5, 6 y 8 · cada herramienta, en el navegador y en su HTML
    server = ThreadingHTTPServer(('127.0.0.1', 0),
                                 functools.partial(Quiet, directory=str(root)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}'

    pages = {}
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        for route in TOOLS:
            html = (root / route.strip('/') / 'index.html').read_text(encoding='utf-8')
            pages[route] = html
            robots = meta_robots(html)
            listed = f'https://irisgreen.eu{route}' in sitemap
            entry = {'route': route, 'robots': robots, 'in_sitemap': listed}

            if 'noindex' in robots and listed:
                failures.append(f'{route}: noindex pero está en el sitemap')
            if 'noindex' not in robots and not listed:
                failures.append(f'{route}: index,follow pero falta en el sitemap')

            ctx = browser.new_context(viewport={'width': 390, 'height': 900})
            page = ctx.new_page()
            page.set_default_timeout(15000)
            errors = []
            page.on('pageerror', lambda e: errors.append(str(e)))
            resp = page.goto(base + route, wait_until='networkidle')
            entry['status'] = resp.status if resp else 0
            if entry['status'] != 200:
                failures.append(f'{route}: el publicado responde {entry["status"]}')
            if errors:
                failures.append(f'{route}: errores de página {errors[:2]}')

            entry['main'] = page.locator('main').count()
            heading = page.locator('h1').first
            entry['h1'] = heading.inner_text().strip() if page.locator('h1').count() else ''
            if entry['main'] != 1:
                failures.append(f'{route}: se esperaba un <main>, hay {entry["main"]}')
            if not entry['h1']:
                failures.append(f'{route}: sin <h1> con texto, axe auditaría una página vacía')

            entry['targets'] = page.evaluate(JS_ONE_TARGET)
            if entry['targets'] < 1:
                failures.append(f'{route}: sin objetivos interactivos visibles; '
                                'añadirla a audit_target_size.py no mediría nada')
            report['tools'].append(entry)
            ctx.close()
        browser.close()
    server.shutdown()

    # 8 · canonical y hreflang recíprocos
    for es, en in PAIRS:
        for route, other in ((es, en), (en, es)):
            html = pages[route]
            want = f'https://irisgreen.eu{route}'
            if canonical(html) != want:
                failures.append(f'{route}: canonical {canonical(html)!r} != {want!r}')
            alts = alternates(html)
            lang = 'es' if route.startswith('/es/') else 'en'
            peer = 'en' if lang == 'es' else 'es'
            if alts.get(lang) != want:
                failures.append(f'{route}: hreflang {lang} no apunta a sí misma')
            if alts.get(peer) != f'https://irisgreen.eu{other}':
                failures.append(f'{route}: hreflang {peer} no apunta a su pareja')

    report['gate'] = 'R42_RESOURCES_AUDIT_COVERAGE_PASS' if not failures else 'FAIL'
    (out / 'resources-audit-coverage.json').write_text(
        json.dumps(report, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({'gate': report['gate'], 'auditors': report['auditors'],
                      'tools': len(report['tools']), 'failures': failures},
                     ensure_ascii=False, indent=1))
    if failures:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
