#!/usr/bin/env python3
"""R42 · Bloque C · El foco sobrevive a cada cambio en el constructor de rutinas.

`renderBuilder()` reescribe la lista de pasos entera, así que el botón que
acabas de pulsar deja de existir. Sin restauración explícita el foco cae al
`<body>` y hay que tabular desde la cabecera otra vez: mover un paso tres
posiciones obligaba a hacerlo tres veces. Es la herramienta cuyo propósito es
apoyar la función ejecutiva, así que es donde más caro sale.

Comprueba, recorriendo la interfaz real y sólo con teclado:

  1. Añadir desde la biblioteca deja el foco en el mismo pictograma, de modo
     que se pueden añadir varios seguidos sin tabular.
  2. Al subir, el foco sigue al **mismo paso** en su nueva posición: la clave
     del control no cambia, cambia su sitio en la lista.
  3. Lo mismo al bajar.
  4. Al quitar un paso intermedio, el foco pasa al control equivalente de la
     fila siguiente, que ocupa ahora esa misma posición.
  5. Al quitar el último, pasa a la fila anterior.
  6. Al quitar el único paso que quedaba, pasa al control de añadir.
  7. El foco no aterriza en `<body>` en ningún momento del recorrido.
  8. Cambiar de categoría en la biblioteca tampoco pierde el foco.
  9. Todo lo anterior en ES y en EN.

Lo que este test NO certifica:
  - Nada sobre lectores de pantalla reales: comprueba `document.activeElement`.
  - No mide si el orden de tabulación es agradable, sólo que el foco no se
    pierde.
  - No cubre el arrastre, que en esta herramienta no existe y que
    `test_rutinas_visuales.py` sigue prohibiendo.

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

ROWS = '''() => [...document.querySelectorAll('#rv-builder-steps li')].map((li, i) => {
  const up = li.querySelector('[data-up]');
  const inp = li.querySelector('[data-step-input]');
  return {i: i, key: up ? up.dataset.k.replace('rv-up-', '') : null, text: inp ? inp.value : ''};
})'''

ACTIVE = '''() => {
  const a = document.activeElement;
  if (!a) return {tag: null, k: null, id: null};
  return {tag: a.tagName, k: (a.dataset && a.dataset.k) || null, id: a.id || null};
}'''


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


server = ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
BASE = f'http://127.0.0.1:{server.server_port}'

REPORT = {'cases': [], 'failures': [], 'notes': [
    'Chromium sin tecnología de apoyo real: no sustituye revisión humana.',
    'Comprueba document.activeElement, no la locución de un lector de pantalla.',
]}


def press_key(page, key, tag, what):
    """Pulsa con teclado el control cuya clave estable es `key`."""
    target = page.locator(f'[data-k="{key}"]')
    assert target.count() == 1, (tag, what, 'no existe el control', key)
    target.first.focus()
    assert page.evaluate(ACTIVE)['k'] == key, (tag, what, 'el control no recibe el foco', key)
    page.keyboard.press('Enter')
    page.wait_for_timeout(120)


def active(page, tag, what):
    a = page.evaluate(ACTIVE)
    assert a['tag'] != 'BODY' and a['tag'] is not None, (tag, what, 'el foco cayó al body', a)
    return a


def run(page, lang, path, steps_log):
    tag = f'{lang} {path}'
    page.goto(BASE + path)
    page.locator('#rv-builder-steps').wait_for(state='attached')
    page.wait_for_timeout(300)

    # Partir de cero: la página puede traer una rutina cargada por querystring.
    reset = page.locator('#rv-reset')
    if reset.count():
        reset.first.click()
        page.wait_for_timeout(150)
    assert page.evaluate(ROWS) == [], (tag, 'la lista no empieza vacía')

    # 1 · añadir cuatro pasos con teclado, sin salir de la biblioteca
    picto_keys = page.evaluate(
        '() => [...document.querySelectorAll("#rv-library [data-add-picto]")]'
        '.slice(0, 4).map(b => b.dataset.k)')
    assert len(picto_keys) == 4, (tag, 'la biblioteca no ofrece cuatro pictogramas')
    for n, key in enumerate(picto_keys):
        press_key(page, key, tag, 'añadir')
        a = active(page, tag, 'añadir')
        assert a['k'] == key, (tag, 'añadir', 'el foco no vuelve al mismo pictograma', a)
        assert len(page.evaluate(ROWS)) == n + 1, (tag, 'añadir', 'no se añadió el paso')
    steps_log.append('añadir mantiene el foco en el pictograma')

    rows = page.evaluate(ROWS)
    target = rows[3]['key']          # el último paso
    text = rows[3]['text']

    # 2 · subir tres posiciones: el foco sigue al mismo paso
    for expected in (2, 1, 0):
        press_key(page, f'rv-up-{target}', tag, 'subir')
        a = active(page, tag, 'subir')
        assert a['k'] == f'rv-up-{target}', (tag, 'subir', 'el foco no sigue al paso', a)
        now = page.evaluate(ROWS)
        assert now[expected]['key'] == target, (tag, 'subir', 'el paso no se movió', expected, now)
        assert now[expected]['text'] == text, (tag, 'subir', 'el paso cambió de contenido')
    steps_log.append('subir tres posiciones: el foco sigue al mismo paso')

    # 3 · bajar
    press_key(page, f'rv-down-{target}', tag, 'bajar')
    a = active(page, tag, 'bajar')
    assert a['k'] == f'rv-down-{target}', (tag, 'bajar', 'el foco no sigue al paso', a)
    assert page.evaluate(ROWS)[1]['key'] == target, (tag, 'bajar', 'el paso no bajó')
    steps_log.append('bajar: el foco sigue al mismo paso')

    # 4 · quitar un paso intermedio → control equivalente de la fila siguiente
    rows = page.evaluate(ROWS)
    doomed, heir = rows[1]['key'], rows[2]['key']
    press_key(page, f'rv-rm-{doomed}', tag, 'quitar intermedio')
    a = active(page, tag, 'quitar intermedio')
    assert a['k'] == f'rv-rm-{heir}', (tag, 'quitar intermedio', 'el foco no pasa al siguiente', a)
    assert page.evaluate(ROWS)[1]['key'] == heir, (tag, 'quitar intermedio', 'la lista no encaja')
    steps_log.append('quitar intermedio: el foco pasa a la fila siguiente')

    # 5 · quitar el último → fila anterior
    rows = page.evaluate(ROWS)
    last, before = rows[-1]['key'], rows[-2]['key']
    press_key(page, f'rv-rm-{last}', tag, 'quitar último')
    a = active(page, tag, 'quitar último')
    assert a['k'] == f'rv-rm-{before}', (tag, 'quitar último', 'el foco no pasa al anterior', a)
    steps_log.append('quitar el último: el foco pasa a la fila anterior')

    # 6 · vaciar la lista → control de añadir
    while page.evaluate(ROWS):
        key = page.evaluate(ROWS)[0]['key']
        press_key(page, f'rv-rm-{key}', tag, 'vaciar')
        active(page, tag, 'vaciar')
    a = page.evaluate(ACTIVE)
    assert a['tag'] != 'BODY', (tag, 'vaciar', 'el foco cayó al body al quedarse sin pasos', a)
    assert a['id'] == 'rv-add-text', (tag, 'vaciar', 'el foco no va al control de añadir', a)
    steps_log.append('quitar el único paso: el foco va al control de añadir')

    # 8 · cambiar de categoría tampoco pierde el foco
    cats = page.evaluate('() => [...document.querySelectorAll("#rv-cats [data-cat]")]'
                         '.slice(0, 2).map(b => b.dataset.k)')
    if len(cats) == 2:
        press_key(page, cats[1], tag, 'categoría')
        a = active(page, tag, 'categoría')
        assert a['k'] == cats[1], (tag, 'categoría', 'el foco no se mantiene en el chip', a)
        steps_log.append('cambiar de categoría mantiene el foco en el chip')


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
                run(page, lang, path, log)
                REPORT['cases'].append({'lang': lang, 'path': path, 'ok': True, 'steps': log})
            except AssertionError as exc:
                failures.append({'lang': lang, 'error': str(exc), 'steps': log})
                REPORT['cases'].append({'lang': lang, 'path': path, 'ok': False, 'steps': log})
            if errors:
                failures.append({'lang': lang, 'error': f'errores de página: {errors}'})
            ctx.close()
        browser.close()
    REPORT['failures'] = failures
    REPORT['gate'] = 'R42_VISUAL_ROUTINES_FOCUS_RESTORE_PASS' if not failures else 'FAIL'
    (OUT / 'visual-routines-focus.json').write_text(
        json.dumps(REPORT, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({'gate': REPORT['gate'], 'cases': len(REPORT['cases']),
                      'failures': failures}, ensure_ascii=False, indent=1))
    if failures:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
