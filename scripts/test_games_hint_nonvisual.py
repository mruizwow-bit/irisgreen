#!/usr/bin/env python3
"""R42 · Bloque B · La pista de «Ayúdame» no depende de la presentación visual.

Antes de este cambio la pista existía sólo como `border-style:dashed` sobre
`.is-hint`, y el anuncio decía «Mira el que tiene el borde de puntos». Quien no
ve el borde no podía encontrarla: instrucción apoyada en una característica
sensorial (WCAG 1.3.3) y estado transmitido sólo por presentación.

Comprueba, sobre las páginas generadas y recorriendo la interfaz real:

  1. Antes de pulsar «Ayúdame» no hay ningún `.is-hint` ni ningún control que
     lleve la palabra de pista.
  2. «Ayúdame» se activa con teclado (Enter sobre el botón).
  3. Después hay al menos un `.is-hint`, y **todos** los `.is-hint` llevan la
     palabra de pista dentro del propio control.
  4. Ningún control sin `.is-hint` la lleva: la pista no se reparte por todos
     los botones.
  5. La palabra viaja en el nombre accesible: los controles marcados no tienen
     `aria-label` ni `aria-labelledby`, así que su nombre es su texto.
  6. El anuncio de «Ayúdame» ya no menciona el borde ni los puntos.
  7. Con `forced-colors: active` la palabra sigue presente: la pista no depende
     del borde, que en ese modo lo repinta el sistema.
  8. Al elegir una opción la pista desaparece, marca y palabra a la vez.
  9. El texto añadido no desborda a 320 px, el ancho que exige el resto del CI.
 10. Las tres formas con pista quedan cubiertas: casilla (`.jg-tile`), fila
     (`.jg-row`) y destino de reparto (`.jg-drop-target`).
 11. Todo lo anterior en ES y en EN.

Lo que este test NO certifica:
  - Nada sobre lectores de pantalla reales: comprueba el nombre accesible
    calculable desde el DOM, no lo que un lector concreto pronuncia.
  - No juzga si «Sugerencia» es la palabra más afortunada; eso es editorial.
  - No cubre los tipos de fase sin pista (reloj, elegir, construir), que por
    diseño no marcan ninguna opción.

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

# Un juego por cada forma que puede llevar pista.
GAMES = [
    ('los-cordones', '.jg-tile', 'casilla'),
    ('objeto-accion', '.jg-row', 'fila'),
    ('dos-rutinas-mezcladas', '.jg-drop-target', 'destino de reparto'),
]

LOCALES = [
    ('es', '/es/recursos/juegos/', 'Sugerencia', ('borde', 'puntos')),
    ('en', '/en/resources/games/', 'Suggested', ('border', 'dotted')),
]


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


server = ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
BASE = f'http://127.0.0.1:{server.server_port}'

REPORT = {'cases': [], 'failures': [], 'notes': [
    'Chromium sin tecnología de apoyo real: no sustituye revisión humana.',
    'Comprueba el nombre accesible calculable desde el DOM, no la locución de un lector.',
]}

# Controles marcados y su texto, más los controles no marcados que llevan la
# palabra. Se mide sobre los botones de juego, no sobre la cabecera del sitio.
SURVEY = '''(word) => {
  const scope = document.querySelector('.jg-play') || document.querySelector('main');
  const all = [...scope.querySelectorAll('.jg-tile,.jg-row,.jg-drop-target')];
  const has = el => (el.textContent || '').includes(word);
  const named = el => el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby');
  return {
    total: all.length,
    hinted: all.filter(el => el.classList.contains('is-hint')).length,
    hintedWithWord: all.filter(el => el.classList.contains('is-hint') && has(el)).length,
    hintedRelabelled: all.filter(el => el.classList.contains('is-hint') && named(el)).length,
    plainWithWord: all.filter(el => !el.classList.contains('is-hint') && has(el)).length,
  };
}'''


def message(page):
    box = page.locator('.jg-msg')
    return box.first.inner_text() if box.count() else ''


def play(page, lang, path, slug, word, banned, shape, selector, forced):
    page.goto(f'{BASE}{path}#juego-{slug}')
    page.locator('main h1').first.wait_for()
    page.wait_for_timeout(350)
    tag = f'{lang}/{slug} ({shape}){" · forced-colors" if forced else ""}'

    assert page.locator(selector).count() > 0, (tag, 'el juego no presenta esta forma')

    # 1 · nada marcado antes
    before = page.evaluate(SURVEY, word)
    assert before['hinted'] == 0, (tag, 'hay pista antes de pedirla', before)
    assert before['plainWithWord'] == 0, (tag, 'la palabra aparece sin pedir pista', before)

    # 2 · se activa con teclado. «Ayúdame» vive dentro del popover de opciones
    # del juego, así que primero se abre ese panel, también con teclado.
    opener = page.locator('.jg-actions-btn[popovertarget="jg-game-tools"]')
    assert opener.count() == 1, (tag, 'no hay botón de opciones del juego')
    opener.first.focus()
    page.keyboard.press('Enter')
    page.wait_for_timeout(200)
    assert page.evaluate('document.getElementById("jg-game-tools").matches(":popover-open")'), \
        (tag, 'el panel de opciones no abre con teclado')
    helper = page.locator('[data-k="ayuda"]')
    assert helper.count() == 1, (tag, 'no hay botón Ayúdame')
    helper.first.focus()
    assert page.evaluate('document.activeElement && document.activeElement.dataset.k') == 'ayuda', \
        (tag, 'el botón Ayúdame no recibe el foco')
    page.keyboard.press('Enter')
    page.wait_for_timeout(300)

    # 3, 4 y 5 · la pista lleva palabra, sólo ella, y en su nombre accesible
    after = page.evaluate(SURVEY, word)
    assert after['hinted'] >= 1, (tag, 'Ayúdame no marca nada', after)
    assert after['hintedWithWord'] == after['hinted'], \
        (tag, 'hay pista sin equivalente textual', after)
    assert after['plainWithWord'] == 0, \
        (tag, 'la palabra se reparte por controles sin pista', after)
    assert after['hintedRelabelled'] == 0, \
        (tag, 'un control marcado tiene aria-label y ocultaría el texto', after)

    # 6 · el anuncio no describe el borde
    said = message(page).lower()
    for bad in banned:
        assert bad not in said, (tag, 'el anuncio menciona la presentación visual', said)

    # 8 · al elegir, la pista se retira entera
    page.locator(f'{selector}.is-hint').first.click()
    page.wait_for_timeout(300)
    gone = page.evaluate(SURVEY, word)
    assert gone['hinted'] == 0 and gone['plainWithWord'] == 0, \
        (tag, 'la pista no se retira al elegir', gone)

    # 9 · el texto añadido no rompe el ancho mínimo que exige el resto del CI
    overflow = page.evaluate('Math.max(0,document.documentElement.scrollWidth-innerWidth)')
    assert overflow <= 1, (tag, 'desbordamiento horizontal a 320 px', overflow)

    return {'case': tag, 'shape': shape, 'controls': after['total'],
            'hinted': after['hinted'], 'forced_colors': forced,
            'overflow_320': overflow, 'announcement': message(page)}


def main():
    failures = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        for lang, path, word, banned in LOCALES:
            for forced in (False, True):
                ctx = browser.new_context(viewport={'width': 320, 'height': 900},
                                          forced_colors='active' if forced else 'none')
                page = ctx.new_page()
                page.set_default_timeout(15000)
                errors = []
                page.on('pageerror', lambda e: errors.append(str(e)))
                for slug, selector, shape in GAMES:
                    try:
                        REPORT['cases'].append(
                            play(page, lang, path, slug, word, banned, shape, selector, forced))
                    except AssertionError as exc:
                        failures.append({'case': f'{lang}/{slug}', 'forced_colors': forced,
                                         'error': str(exc)})
                if errors:
                    failures.append({'case': f'{lang} errores de página', 'error': str(errors)})
                ctx.close()
        browser.close()
    REPORT['failures'] = failures
    REPORT['gate'] = 'R42_GAMES_HINT_NONVISUAL_EQUIVALENT_PASS' if not failures else 'FAIL'
    (OUT / 'games-hint-nonvisual.json').write_text(
        json.dumps(REPORT, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({'gate': REPORT['gate'], 'cases': len(REPORT['cases']),
                      'failures': failures}, ensure_ascii=False, indent=1))
    if failures:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
