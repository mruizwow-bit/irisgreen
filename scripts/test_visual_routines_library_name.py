#!/usr/bin/env python3
"""R42 · Bloque H bis · La biblioteca de pictogramas tiene nombre accesible.

Hallazgo del bloque H: al entrar `/es/recursos/rutinas-visuales/` y
`/en/resources/visual-routines/` en `audit_axe_wcag.py`, axe-core señaló
`aria-prohibited-attr` (impacto serio) sobre `#rv-library`.

El contenedor era un `<div>` sin rol con `aria-label`. ARIA prohíbe nombrar un
elemento genérico: el nombre se descarta, de modo que la biblioteca entera —el
control principal de la herramienta— no tenía nombre accesible. No lo veía
nadie porque la ruta no se auditaba.

La corrección es `role="group"`, que sí admite nombre y no añade un landmark.

Comprueba, en ES y EN:

  1. `#rv-library` declara un rol que admite nombre accesible.
  2. El árbol de accesibilidad expone ese nombre, y en el idioma de la página.
  3. El nombre sigue ahí después de que `renderLibrary()` reescriba el
     contenido: el render usa `innerHTML` sobre el contenedor, así que el rol
     debe sobrevivir, y este test lo verifica tras filtrar.
  4. El rol `group` no introduce un landmark nuevo: el recuento de landmarks no
     cambia respecto a la cabecera y el `main` que ya existían.
  5. Los botones de pictograma siguen siendo hijos alcanzables del contenedor.

Lo que este test NO certifica:
  - No ejecuta axe: eso lo hace `audit_axe_wcag.py`, que es la puerta real.
  - Chromium sin tecnología de apoyo real. El nombre se lee del árbol de
    accesibilidad, no de un lector de pantalla.

Ejecutar desde la raíz del repositorio, con el sitio ya construido:
    python3 scripts/test_visual_routines_library_name.py --root dist
"""
import argparse
import functools
import json
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

# Roles que admiten nombre por aria-label. 'generic' (un div sin rol) no está.
NAMEABLE = {'group', 'region', 'list', 'listbox', 'grid', 'toolbar', 'form',
            'search', 'navigation', 'complementary'}
LANDMARKS = {'region', 'navigation', 'complementary', 'form', 'search',
             'banner', 'contentinfo', 'main'}

PAGES = [
    ('es', '/es/recursos/rutinas-visuales/', 'Biblioteca de pictogramas'),
    ('en', '/en/resources/visual-routines/', 'Symbol library'),
]


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def check(page, base, path, expected, entry):
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto(base + path, wait_until='networkidle')
    page.locator('#rv-library').wait_for()
    assert not errors, f'errores de página: {errors[:2]}'

    # 1 · rol que admite nombre
    role = page.get_attribute('#rv-library', 'role') or 'generic'
    entry['role'] = role
    assert role in NAMEABLE, \
        f'#rv-library declara role={role!r}, que no admite aria-label'

    # 2 · el árbol de accesibilidad expone el nombre
    node = page.accessibility.snapshot(
        root=page.locator('#rv-library').element_handle(), interesting_only=False)
    entry['accessible_name'] = (node or {}).get('name', '')
    assert entry['accessible_name'] == expected, \
        f'nombre accesible {entry["accessible_name"]!r}, se esperaba {expected!r}'

    # 5 · hay botones dentro antes de filtrar
    before = page.locator('#rv-library [data-add-picto]').count()
    entry['buttons_before'] = before
    assert before > 0, 'la biblioteca no monta botones de pictograma'

    # 3 · sobrevive al re-render
    page.fill('#rv-search', 'bano')
    page.wait_for_timeout(120)
    after = page.locator('#rv-library [data-add-picto]').count()
    entry['buttons_after_filter'] = after
    assert after > 0, 'filtrar por «bano» no deja ningún pictograma'
    role_after = page.get_attribute('#rv-library', 'role') or 'generic'
    node_after = page.accessibility.snapshot(
        root=page.locator('#rv-library').element_handle(), interesting_only=False)
    entry['role_after'] = role_after
    entry['name_after'] = (node_after or {}).get('name', '')
    assert role_after == role, 'el re-render pierde el rol del contenedor'
    assert entry['name_after'] == expected, 'el re-render pierde el nombre accesible'

    # 4 · sin landmark nuevo
    entry['landmark'] = role in LANDMARKS
    assert role not in LANDMARKS, \
        f'role={role!r} añadiría un landmark a la página; se buscaba un grupo'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', type=Path, default=Path('dist'))
    args = ap.parse_args()
    root = args.root.resolve()
    assert root.is_dir(), f'No existe el directorio publicado: {root}'

    out = root / 'reports/r42-recursos'
    out.mkdir(parents=True, exist_ok=True)

    server = ThreadingHTTPServer(('127.0.0.1', 0),
                                 functools.partial(Quiet, directory=str(root)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}'

    report = {'pages': [], 'failures': [], 'notes': [
        'No ejecuta axe; la puerta real es audit_axe_wcag.py.',
        'Chromium sin tecnología de apoyo real: no sustituye revisión humana.',
    ]}
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        for lang, path, expected in PAGES:
            ctx = browser.new_context(viewport={'width': 1280, 'height': 900})
            page = ctx.new_page()
            page.set_default_timeout(15000)
            entry = {'lang': lang, 'path': path, 'expected': expected}
            try:
                check(page, base, path, expected, entry)
                entry['ok'] = True
            except AssertionError as exc:
                entry['ok'] = False
                report['failures'].append({'path': path, 'error': str(exc)})
            report['pages'].append(entry)
            ctx.close()
        browser.close()
    server.shutdown()

    report['gate'] = ('R42_VISUAL_ROUTINES_LIBRARY_NAME_PASS'
                      if not report['failures'] else 'FAIL')
    (out / 'visual-routines-library-name.json').write_text(
        json.dumps(report, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({'gate': report['gate'], 'pages': report['pages'],
                      'failures': report['failures']}, ensure_ascii=False, indent=1))
    if report['failures']:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
