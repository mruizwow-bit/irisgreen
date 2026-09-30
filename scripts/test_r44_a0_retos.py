#!/usr/bin/env python3
"""R44 · A0 · lo que se puede medir del framework de retos y de los ocho pilotos.

Mide, no afirma. Los cuatro flags del §3 de la orden dicen que el estudio que
hospeda el reto está en condiciones; lo que esta prueba comprueba es el reto en
sí, montado en un navegador de verdad:

  1. **Los datos.** Ocho pilotos, uno por ámbito, ES y EN completos, y los ocho
     IDs presentes en la matriz preservada. Si la matriz está a mano, se
     comprueba además su SHA-256 contra el que declara el propio fichero.
  2. **El panel se monta** y queda enlazado a su encabezado.
  3. **El estado no depende del color.** Cada uno de los cuatro estados cambia
     el texto Y la forma de la marca.
  4. **El objetivo táctil** del botón llega a 44×44 y tiene nombre accesible.
  5. **Sin almacenamiento ni red.** Ni localStorage, ni sessionStorage, ni
     fetch, ni XHR durante el montaje y el recorrido de estados.
  6. **Reflujo a 320** sin desplazamiento lateral.

Uso:  python3 scripts/test_r44_a0_retos.py
"""
from __future__ import annotations
import hashlib
import json
import sys
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
DATOS = REPO / 'assets/retos-r44.json'
JS = REPO / 'assets/ig-retos-r44.js'
CSS = REPO / 'assets/ig-retos-r44.css'

AMBITOS = {'dibujo', 'pixel-art', 'estructuras', 'circuitos', 'escritura',
           'juego-de-mesa', 'musica', 'videojuegos'}
CAMPOS_IDIOMA = ('titulo', 'idea', 'instrucciones', 'cta', 'cta_nombre',
                 'criterio', 'alternativa', 'alternativa_arrastre', 'estados')


def pagina(datos, reto_id):
    """Una página anfitriona mínima: el bloque de datos, el destino y la capa."""
    return (
        '<!doctype html><html lang="es"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width, initial-scale=1">'
        f'<style>{CSS.read_text(encoding="utf-8")}</style>'
        '<style>:root{--ig-bg-surface:#12263c;--ig-text:#eef3f8;'
        '--ig-text-muted:#b8c6d4;--ig-separator:#2d4258;--ig-success:#7fd6a2;'
        '--ig-button-primary-bg:#2c4a68;--ig-button-primary-fg:#f2f7fb;'
        '--ig-border-control:#42607e;--ig-focus:#9db8ff;}'
        'body{margin:0;padding:12px;background:#0B1A2B;font-family:Georgia,serif}</style>'
        '</head><body><p id="igt-status" role="status" aria-live="polite"></p>'
        f'<div id="igr44-destino" data-reto="{reto_id}"></div>'
        f'<script type="application/json" id="igr44-datos">{json.dumps(datos, ensure_ascii=False)}</script>'
        f'<script>{JS.read_text(encoding="utf-8")}</script>'
        '</body></html>')


def medir(datos, reto_id, fallos):
    from playwright.sync_api import sync_playwright
    with tempfile.NamedTemporaryFile('w', suffix='.html', delete=False,
                                     encoding='utf-8') as fh:
        fh.write(pagina(datos, reto_id))
        tmp = Path(fh.name)
    salida = {}
    with sync_playwright() as pw:
        nav = pw.chromium.launch()
        pg = nav.new_page(viewport={'width': 1440, 'height': 900})
        # Cualquier uso de almacenamiento o de red queda anotado, no bloqueado:
        # lo que interesa es si el framework lo intenta.
        pg.add_init_script("""
          window.__usos = [];
          for (const k of ['localStorage','sessionStorage']) {
            const real = window[k];
            Object.defineProperty(window, k, {get(){window.__usos.push(k);return real;}});
          }
          const f = window.fetch; window.fetch = function(){window.__usos.push('fetch');return f.apply(this,arguments);};
          const o = XMLHttpRequest.prototype.open;
          XMLHttpRequest.prototype.open = function(){window.__usos.push('xhr');return o.apply(this,arguments);};
        """)
        pg.goto(tmp.as_uri())
        pg.wait_for_timeout(200)

        montado = pg.evaluate("() => !!document.querySelector('.igr44-panel')")
        if not montado:
            fallos.append(f'{reto_id}: el panel no se monta')
            nav.close(); tmp.unlink(); return {'montado': False}

        salida['enlazado'] = pg.evaluate("""() => {
            const p = document.querySelector('.igr44-panel');
            const id = p.getAttribute('aria-labelledby');
            return !!(id && document.getElementById(id));
        }""")
        if not salida['enlazado']:
            fallos.append(f'{reto_id}: el panel no está enlazado a su encabezado')

        caja = pg.evaluate("""() => {
            const b = document.querySelector('.igr44-cta');
            const r = b.getBoundingClientRect();
            return {w: r.width, h: r.height, nombre: b.getAttribute('aria-label') || ''};
        }""")
        salida['boton'] = {'ancho': round(caja['w'], 1), 'alto': round(caja['h'], 1)}
        if caja['w'] < 44 or caja['h'] < 44:
            fallos.append(f'{reto_id}: el botón mide {caja["w"]:.0f}×{caja["h"]:.0f}, '
                          'por debajo de 44×44')
        if len(caja['nombre']) < 12:
            fallos.append(f'{reto_id}: el botón no tiene nombre accesible propio')

        # Los cuatro estados: texto distinto y forma distinta.
        firmas = pg.evaluate("""(estados) => {
            const r = window.IGR44.auto ? null : null;
            const panel = document.querySelector('.igr44-panel');
            const reto = window.__reto || null;
            const out = [];
            const est = panel.querySelector('.igr44-estado');
            const txt = panel.querySelector('.igr44-estado-texto');
            const marca = panel.querySelector('.igr44-marca');
            for (const e of estados) {
                est.setAttribute('data-estado', e);
                const cs = getComputedStyle(marca);
                out.push({estado: e,
                          forma: [cs.backgroundImage, cs.backgroundColor, cs.borderRadius,
                                  cs.boxShadow].join('|')});
            }
            return out;
        }""", ['sin-empezar', 'en-curso', 'listo-para-exportar', 'terminado'])
        formas = [f['forma'] for f in firmas]
        salida['formas_distintas'] = len(set(formas))
        if len(set(formas)) < 4:
            fallos.append(f'{reto_id}: los cuatro estados no tienen cuatro formas '
                          f'distintas ({len(set(formas))}); el color no puede ser '
                          'el único canal')

        # Los textos de estado, del propio dato
        reto = next(r for r in datos['retos'] if r['id'] == reto_id)
        for lang in ('es', 'en'):
            textos = list(reto[lang]['estados'].values())
            if len(set(textos)) < 4:
                fallos.append(f'{reto_id}/{lang}: los cuatro estados no tienen '
                              'cuatro nombres distintos')

        usos = pg.evaluate("() => window.__usos || []")
        salida['almacenamiento_o_red'] = usos
        if usos:
            fallos.append(f'{reto_id}: el framework usa {sorted(set(usos))}')

        pg.set_viewport_size({'width': 320, 'height': 720})
        pg.wait_for_timeout(120)
        desborde = pg.evaluate("() => document.documentElement.scrollWidth > "
                               "document.documentElement.clientWidth + 1")
        salida['desborda_en_320'] = desborde
        if desborde:
            fallos.append(f'{reto_id}: desborda a 320 px')

        nav.close()
    tmp.unlink()
    return salida


def main():
    fallos = []
    datos = json.loads(DATOS.read_text(encoding='utf-8'))
    retos = datos['retos']
    r = {'retos': len(retos)}

    if len(retos) != 8:
        fallos.append(f'se esperan 8 pilotos y hay {len(retos)}')
    ambitos = {x['ambito'] for x in retos}
    r['ambitos'] = sorted(ambitos)
    if ambitos != AMBITOS:
        fallos.append(f'los ámbitos no son los ocho del §4: faltan '
                      f'{sorted(AMBITOS - ambitos)}, sobran {sorted(ambitos - AMBITOS)}')
    for x in retos:
        for lang in ('es', 'en'):
            faltan = [c for c in CAMPOS_IDIOMA if not x.get(lang, {}).get(c)]
            if faltan:
                fallos.append(f'{x["id"]}/{lang}: faltan {faltan}')
        if x.get('audience') != 'ALL_AGES':
            fallos.append(f'{x["id"]}: audience debería ser ALL_AGES en Ola A')
        if x.get('permisos'):
            fallos.append(f'{x["id"]}: declara permisos, y ningún reto de Ola A pide')
        if x.get('hardware') is not False:
            fallos.append(f'{x["id"]}: declara hardware como requisito')

    # La fuente: si la matriz está a mano, se comprueba su hash y que los ocho
    # IDs existan en ella. Si no lo está, se dice que no se ha comprobado.
    fuente = datos.get('fuente', {})
    copia = Path('/tmp/claude-0/matriz64.md')
    if copia.exists():
        sha = hashlib.sha256(copia.read_bytes()).hexdigest()
        r['sha256_matriz'] = sha
        r['sha256_coincide'] = (sha == fuente.get('sha256'))
        if not r['sha256_coincide']:
            fallos.append('el SHA-256 de la matriz no coincide con el declarado')
        texto = copia.read_text(encoding='utf-8')
        ausentes = [x['id'] for x in retos if f'`{x["id"]}`' not in texto]
        if ausentes:
            fallos.append(f'IDs que no están en la matriz preservada: {ausentes}')
        r['ids_en_matriz'] = len(retos) - len(ausentes)
    else:
        r['sha256_matriz'] = 'no comprobado: la matriz no está en esta sesión'

    try:
        import playwright  # noqa: F401
    except ImportError:
        fallos.append('falta playwright: el panel no se ha podido medir en un navegador')
        r['medido_en_navegador'] = False
    else:
        r['medido_en_navegador'] = True
        r['paneles'] = {x['id']: medir(datos, x['id'], fallos) for x in retos}

    r['no_medido'] = [
        'si el reto se entiende sin leer el criterio',
        'si la mini-escena E4 del reto dice de qué va antes que el título',
        'axe-core sobre las páginas de estudio con el panel montado',
    ]
    r['fallos'] = fallos
    r['gate'] = 'R44_A0_RETOS_MEASURED_PASS' if not fallos else 'FAIL'
    print(json.dumps(r, ensure_ascii=False, indent=1))
    return 1 if fallos else 0


if __name__ == '__main__':
    sys.exit(main())
