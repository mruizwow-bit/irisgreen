#!/usr/bin/env python3
"""R42 · Bloque D · La búsqueda de pictogramas encuentra lo que existe.

Antes de este cambio el filtro era
`p[lang].toLocaleLowerCase(lang).includes(q)`, con cuatro defectos a la vez:
no plegaba diacríticos (`bano` no hallaba «Baño»), era monolingüe (`shower` no
hallaba nada en la página española), no miraba el identificador, y descartaba
la categoría en cuanto había texto **aunque el chip siguiera diciendo
`aria-pressed="true"`**.

Comprueba, sobre las páginas generadas:

  1. Con «todas» las categorías, las búsquedas sin tilde encuentran su palabra:
     bano→Baño, autobus→Autobús, telefono→Teléfono, medicacion→Medicación,
     manana→Mañana.
  2. Búsqueda en inglés desde la página española: `shower` encuentra «Ducha».
  3. Búsqueda en español desde la página inglesa: `bano` encuentra «Baño».
  4. Categoría sola: sin texto, todo lo mostrado pertenece a esa categoría.
  5. Texto solo: con «todas», los resultados pueden venir de varias categorías.
  6. Categoría **y** texto: ambos cuentan. Una categoría que no contiene el
     término devuelve cero, y el chip sigue diciendo la verdad.
  7. Cero resultados: un término imposible deja la biblioteca vacía y el
     recuento lo dice.
  8. Todo lo anterior en ES y en EN.

Lo que este test NO certifica:
  - No juzga la ordenación de los resultados, sólo su pertenencia.
  - No mide rendimiento; con 292 pictogramas no es el cuello de botella.
  - No opina sobre qué categoría debería venir preseleccionada: registra cuál
    es, porque con el filtro Y esa elección pasa a importar.

Ejecutar desde el directorio dist generado.
"""
import functools
import json
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path.cwd()
OUT = ROOT / 'reports/r42-recursos'
OUT.mkdir(parents=True, exist_ok=True)

PAGES = [('es', '/es/recursos/rutinas-visuales/'), ('en', '/en/resources/visual-routines/')]

# término, palabra que debe aparecer entre los resultados
SIN_TILDE = [
    ('bano', 'Baño'),
    ('autobus', 'Autobús'),
    ('telefono', 'Teléfono'),
    ('medicacion', 'Medicación'),
    ('manana', 'Mañana'),
]

SHOWN = '''() => {
  const map = {};
  (window.IG_RUTINAS_PICTOS || []).forEach(p => { map[p.id] = {cat: p.cat, es: p.es, en: p.en}; });
  return [...document.querySelectorAll('#rv-library [data-add-picto]')]
    .map(b => Object.assign({id: b.dataset.addPicto}, map[b.dataset.addPicto] || {}));
}'''


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


server = ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
BASE = f'http://127.0.0.1:{server.server_port}'

REPORT = {'cases': [], 'failures': [], 'notes': [
    'El filtro es categoría Y texto: con una categoría preseleccionada, la búsqueda ocurre dentro de ella.',
]}


def search(page, text):
    box = page.locator('#rv-search')
    box.fill(text)
    page.wait_for_timeout(150)
    return page.evaluate(SHOWN)


def pick_category(page, value):
    key = 'rv-cat-' + (value if value else 'todas')
    chip = page.locator(f'[data-k="{key}"]')
    assert chip.count() == 1, ('no existe el chip de categoría', value)
    chip.first.click()
    page.wait_for_timeout(150)
    assert chip.first.get_attribute('aria-pressed') == 'true', ('el chip no queda marcado', value)


def run(page, lang, path, log):
    tag = f'{lang} {path}'
    page.goto(BASE + path)
    page.locator('#rv-library').wait_for()
    page.wait_for_timeout(300)

    default_cat = page.evaluate(
        '() => { const b = document.querySelector("#rv-cats [aria-pressed=\\"true\\"]");'
        ' return b ? b.dataset.cat : null; }')

    # 1 · sin tilde, con todas las categorías
    pick_category(page, '')
    for term, word in SIN_TILDE:
        shown = search(page, term)
        assert shown, (tag, 'sin resultados', term)
        labels = [p.get('es', '') for p in shown]
        assert any(l == word for l in labels), (tag, term, 'no aparece', word, labels[:6])
    log.append('las cinco búsquedas sin tilde encuentran su palabra')

    # 2 y 3 · búsqueda cruzada de idioma
    shown = search(page, 'shower')
    assert any(p.get('es') == 'Ducha' for p in shown), (tag, 'shower no encuentra Ducha')
    shown = search(page, 'bano')
    assert any(p.get('en') == 'Bathroom' or p.get('es') == 'Baño' for p in shown), \
        (tag, 'bano no encuentra Baño')
    log.append('la búsqueda funciona en los dos idiomas desde cualquiera de las dos páginas')

    # 4 · categoría sola
    search(page, '')
    pick_category(page, 'Higiene')
    only = page.evaluate(SHOWN)
    assert only, (tag, 'la categoría Higiene no muestra nada')
    assert all(p.get('cat') == 'Higiene' for p in only), \
        (tag, 'la categoría muestra pictogramas de otra', [p for p in only if p.get('cat') != 'Higiene'][:3])
    log.append('categoría sola: todo lo mostrado pertenece a esa categoría')

    # 6 · categoría Y texto
    inside = search(page, 'ducha')
    assert inside, (tag, 'Higiene + ducha no devuelve nada')
    assert all(p.get('cat') == 'Higiene' for p in inside), (tag, 'el texto se sale de la categoría')
    outside = search(page, 'autobus')
    assert outside == [], (tag, 'la categoría se ignora cuando hay texto', outside[:3])
    log.append('categoría y texto: ambos cuentan, y una categoría ajena devuelve cero')

    # 5 · texto solo, con todas
    search(page, '')
    pick_category(page, '')
    wide = search(page, 'a')
    assert len({p.get('cat') for p in wide}) > 1, (tag, 'el texto solo no cruza categorías')
    log.append('texto solo: los resultados cruzan categorías')

    # 7 · cero resultados
    empty = search(page, 'zzzzqqqq')
    assert empty == [], (tag, 'un término imposible devuelve resultados', empty[:3])
    note = page.locator('#rv-library-count')
    if note.count():
        assert '0' in note.first.inner_text(), (tag, 'el recuento no informa del cero')
    log.append('cero resultados: la biblioteca queda vacía y el recuento lo dice')

    return {'lang': lang, 'path': path, 'default_category': default_cat, 'steps': log}


def main():
    failures = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        for lang, path in PAGES:
            ctx = browser.new_context(viewport={'width': 390, 'height': 900})
            page = ctx.new_page()
            page.set_default_timeout(15000)
            errors = []
            page.on('pageerror', lambda e: errors.append(str(e)))
            log = []
            try:
                REPORT['cases'].append(run(page, lang, path, log))
            except AssertionError as exc:
                failures.append({'lang': lang, 'error': str(exc), 'steps': log})
            if errors:
                failures.append({'lang': lang, 'error': f'errores de página: {errors}'})
            ctx.close()
        browser.close()
    REPORT['failures'] = failures
    REPORT['gate'] = 'R42_VISUAL_ROUTINES_SEARCH_NORMALIZED_PASS' if not failures else 'FAIL'
    (OUT / 'visual-routines-search.json').write_text(
        json.dumps(REPORT, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({'gate': REPORT['gate'], 'cases': len(REPORT['cases']),
                      'default_category': [c['default_category'] for c in REPORT['cases']],
                      'failures': failures}, ensure_ascii=False, indent=1))
    if failures:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
