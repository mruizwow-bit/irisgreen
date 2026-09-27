#!/usr/bin/env python3
"""R42 · Bloque G · Copiar la Tarjeta Iris funciona sin Clipboard API.

`copyCard()` dependía por entero de `navigator.clipboard.writeText()`: si la
API no estaba, o si la promesa se rechazaba, la herramienta decía «No se ha
podido copiar» sin intentar nada más, aunque Iris Green ya tenía un respaldo
escrito y en producción en `assets/tarjetas-iris-static.js`.

Comprueba los tres escenarios del encargo, en ES y en EN:

  1. Clipboard API disponible: copia, anuncia el éxito y no crea ningún nodo
     auxiliar.
  2. Clipboard API eliminada: entra el respaldo, copia por `execCommand`,
     anuncia el éxito igual.
  3. Clipboard API que rechaza la promesa: entra el respaldo y copia.
  4. Respaldo que también falla: anuncia el error y dice qué hacer a mano, sin
     dejar rastro en el DOM.
  5. En los cuatro casos el foco permanece en el botón Copiar: copiar no mueve
     a nadie de sitio.
  6. En los cuatro casos el textarea auxiliar se retira: el recuento de nodos
     del documento vuelve al de partida.
  7. Lo copiado es el texto de la tarjeta, no una cadena vacía.

Lo que este test NO certifica:
  - No lee el portapapeles real del sistema: sustituye `writeText` y
    `execCommand` por instrumentos que registran lo que se les pide copiar.
  - No comprueba el comportamiento de ningún navegador concreto sin la API,
    sólo que el camino de respaldo existe y hace su trabajo.

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

PAGES = [
    ('es', '/es/recursos/tarjeta-iris/', 'Copiada', 'No se ha podido copiar'),
    ('en', '/en/resources/iris-card/', 'Copied', 'It could not be copied'),
]

# modo, ¿debe copiarse?, cómo se espera que se copie
MODES = [
    ('api', True, 'clipboard'),
    ('missing', True, 'execCommand'),
    ('reject', True, 'execCommand'),
    ('both-fail', False, None),
]


def instrument(mode):
    """Sustituye Clipboard API y execCommand para observar el camino tomado."""
    exec_ok = 'false' if mode == 'both-fail' else 'true'
    if mode == 'api':
        clipboard = ('Object.defineProperty(navigator, "clipboard", {configurable: true, '
                     'value: {writeText: function(t){ window.__copied = t; '
                     'window.__via = "clipboard"; return Promise.resolve(); }}});')
    elif mode in ('missing', 'both-fail'):
        clipboard = 'Object.defineProperty(navigator, "clipboard", {configurable: true, value: undefined});'
    else:  # reject
        clipboard = ('Object.defineProperty(navigator, "clipboard", {configurable: true, '
                     'value: {writeText: function(){ return Promise.reject(new Error("no")); }}});')
    return f'''
      window.__copied = null; window.__via = null;
      {clipboard}
      document.execCommand = function(cmd){{
        if (cmd !== 'copy') return false;
        var a = document.activeElement;
        window.__copied = a && a.value != null ? a.value : '';
        window.__via = 'execCommand';
        return {exec_ok};
      }};
    '''


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


server = ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
BASE = f'http://127.0.0.1:{server.server_port}'

REPORT = {'cases': [], 'failures': [], 'notes': [
    'Sustituye writeText y execCommand: no lee el portapapeles real del sistema.',
]}


def run(browser, lang, path, ok_word, bad_word, mode, should_copy, expected_via):
    tag = f'{lang}/{mode}'
    ctx = browser.new_context(viewport={'width': 390, 'height': 900})
    page = ctx.new_page()
    page.set_default_timeout(15000)
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.add_init_script(instrument(mode))
    page.goto(BASE + path)
    page.locator('#ti-copy').wait_for()
    page.wait_for_timeout(250)

    # El mensaje de estado sí añade nodos, y debe: lo que no puede quedar es el
    # textarea auxiliar ni nada colocado fuera de pantalla para copiar.
    before = page.evaluate('document.querySelectorAll("textarea").length')

    button = page.locator('#ti-copy')
    button.focus()
    page.keyboard.press('Enter')
    page.wait_for_timeout(350)

    status = page.locator('#ti-card-status').inner_text()
    copied = page.evaluate('window.__copied')
    via = page.evaluate('window.__via')
    after = page.evaluate('document.querySelectorAll("textarea").length')
    focus = page.evaluate('document.activeElement && document.activeElement.id')
    leftovers = page.evaluate(
        '[...document.querySelectorAll("*")].filter(e => e.style '
        '&& e.style.left === "-9999px").length')

    if should_copy:
        assert ok_word in status, (tag, 'no anuncia el éxito', status)
        assert via == expected_via, (tag, 'camino inesperado', via)
        assert copied and copied.strip(), (tag, 'se copió una cadena vacía', repr(copied))
    else:
        assert bad_word in status, (tag, 'no anuncia el error', status)
        assert 'mano' in status or 'by hand' in status, (tag, 'no dice qué hacer a mano', status)

    assert focus == 'ti-copy', (tag, 'el foco no permanece en el botón Copiar', focus)
    assert leftovers == 0, (tag, 'queda un nodo auxiliar fuera de pantalla', leftovers)
    assert after == before, (tag, 'queda un textarea auxiliar', before, after)
    assert not errors, (tag, 'errores de página', errors)

    ctx.close()
    return {'case': tag, 'via': via, 'copied_chars': len(copied or ''),
            'focus': focus, 'textareas_before': before, 'textareas_after': after}


def main():
    failures = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        for lang, path, ok_word, bad_word in PAGES:
            for mode, should_copy, expected_via in MODES:
                try:
                    REPORT['cases'].append(
                        run(browser, lang, path, ok_word, bad_word, mode, should_copy, expected_via))
                except AssertionError as exc:
                    failures.append({'case': f'{lang}/{mode}', 'error': str(exc)})
        browser.close()
    REPORT['failures'] = failures
    REPORT['gate'] = 'R42_IRIS_CARD_CLIPBOARD_FALLBACK_PASS' if not failures else 'FAIL'
    (OUT / 'iris-card-clipboard.json').write_text(
        json.dumps(REPORT, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({'gate': REPORT['gate'], 'cases': len(REPORT['cases']),
                      'failures': failures}, ensure_ascii=False, indent=1))
    if failures:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
