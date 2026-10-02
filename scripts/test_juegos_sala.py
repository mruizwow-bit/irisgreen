#!/usr/bin/env python3
"""Juegos en sala · lo que se puede medir del cableado.

`ROOM_GAMES_S0_DATA_SPLIT_PASS_RUNTIME_WIRING_PENDING`. Esto mide el cableado
sobre una página servida de verdad, no sobre el código:

  1. **Peso de datos.** Lo que una pantalla de sala descarga para jugar a un
     juego, contra lo que descarga hoy la página del catálogo.
  2. **Arranca en el juego**, no en el catálogo, y con un solo juego cargado.
  3. **Se puede jugar**: las cartas responden.
  4. **No recuerda nada**: ni `localStorage`, ni `sessionStorage`, ni `fetch`,
     ni XHR durante la carga y el juego.
  5. **El dorso de las cartas existe.** Está aquí porque una regla de estilo
     mía lo escondió: `.jg-back` no es la flecha de volver, es el «?» del
     dorso, y el tablero se quedó con doce rectángulos vacíos sin que ningún
     test lo notara.
  6. **El objetivo táctil de sala llega a 60 px**, que es la medida del plan
     para una pantalla que se toca de pie.

Uso:  python3 scripts/test_juegos_sala.py   (levanta su propio servidor)
"""
from __future__ import annotations
import json
import os
import subprocess
import sys
import time
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
DEMO = 'editorial/juegos-en-sala/demo/sala-memoria-cocina.html'
SLUG = 'memoria-de-la-cocina'
PUERTO = 8911


def pesos():
    sala = sum((REPO / f).stat().st_size for f in (
        'assets/data/juegos-taxonomias.js', f'assets/data/juegos/{SLUG}.js'))
    catalogo = (REPO / 'assets/data/juegos-iris-data.js').stat().st_size
    return {'datos_sala': sala, 'datos_catalogo': catalogo,
            'veces_menos': round(catalogo / sala, 1)}


def medir(fallos):
    from playwright.sync_api import sync_playwright
    srv = subprocess.Popen(
        [sys.executable, '-m', 'http.server', str(PUERTO), '--bind', '127.0.0.1'],
        cwd=str(REPO), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.5)
    out = {}
    try:
        with sync_playwright() as pw:
            nav = pw.chromium.launch()
            pg = nav.new_page(viewport={'width': 1024, 'height': 768})
            errores = []
            pg.on('pageerror', lambda e: errores.append(str(e)))
            pg.add_init_script("""
              window.__usos=[];
              for (const k of ['localStorage','sessionStorage']) {
                const real=window[k];
                Object.defineProperty(window,k,{get(){window.__usos.push(k);return real;}});
              }
              const f=window.fetch; window.fetch=function(){window.__usos.push('fetch');return f.apply(this,arguments);};
              const o=XMLHttpRequest.prototype.open;
              XMLHttpRequest.prototype.open=function(){window.__usos.push('xhr');return o.apply(this,arguments);};
            """)
            pg.goto(f'http://127.0.0.1:{PUERTO}/{DEMO}')
            pg.wait_for_timeout(900)

            out['arranque'] = pg.evaluate("""() => ({
                juegos_cargados: (window.IG_JUEGOS_DATA||{}).juegos
                    ? window.IG_JUEGOS_DATA.juegos.length : -1,
                hash: location.hash,
                dorsos: [...document.querySelectorAll('#jg-app .jg-back')]
                    .filter(x => getComputedStyle(x).display !== 'none').length
            })""")
            a = out['arranque']
            if a['juegos_cargados'] != 1:
                fallos.append(f'la sala carga {a["juegos_cargados"]} juegos, debería cargar 1')
            if a['hash'] != f'#juego-{SLUG}':
                fallos.append(f'no arranca en el juego: hash {a["hash"]!r}')
            if a['dorsos'] < 4:
                fallos.append(f'sólo {a["dorsos"]} dorsos visibles: el tablero está vacío')

            out['juego'] = pg.evaluate("""() => {
                const b=[...document.querySelectorAll('#jg-app button')]
                    .filter(x=>x.querySelector('.jg-back'));
                const antes=b.length;
                if(b.length) b[0].click();
                return {cartas: antes, destapada:
                    !!document.querySelector('#jg-app .jg-tile-l')};
            }""")
            if not out['juego']['destapada']:
                fallos.append('tocar una carta no la destapa')

            out['objetivo_tactil'] = pg.evaluate("""() => {
                const b=document.querySelector('.sala-volver');
                if(!b) return null;
                const r=b.getBoundingClientRect();
                return {ancho: Math.round(r.width), alto: Math.round(r.height)};
            }""")
            t = out['objetivo_tactil']
            if not t or t['alto'] < 60 or t['ancho'] < 60:
                fallos.append(f'el control de sala no llega a 60×60: {t}')

            out['almacenamiento_o_red'] = pg.evaluate("() => window.__usos || []")
            if out['almacenamiento_o_red']:
                fallos.append(f'la sala usa {sorted(set(out["almacenamiento_o_red"]))}')
            if errores:
                fallos.append(f'errores de página: {errores[:2]}')
            nav.close()
    finally:
        srv.terminate()
    return out


def main():
    fallos = []
    r = {'pesos': pesos()}
    try:
        import playwright  # noqa: F401
    except ImportError:
        fallos.append('falta playwright: el cableado no se ha podido medir')
    else:
        r.update(medir(fallos))
    r['no_medido'] = [
        'si funciona sin red en la segunda carga (hoy no hay service worker)',
        'si el personal del sitio sabe qué hacer cuando falla',
    ]
    r['fallos'] = fallos
    r['gate'] = 'ROOM_GAMES_RUNTIME_WIRING_MEASURED_PASS' if not fallos else 'FAIL'
    print(json.dumps(r, ensure_ascii=False, indent=1))
    return 1 if fallos else 0


if __name__ == '__main__':
    raise SystemExit(main())
