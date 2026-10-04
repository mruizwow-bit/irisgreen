#!/usr/bin/env python3
"""Taller · generador SELECTIVO de los cinco estudios que R44 necesita.

`R44_SUITE5_DEPENDENCY_CLOSURE_R3`. Escribe **sólo** diez páginas:

    pixel art · escritura con restricciones · juegos de mesa · ritmo · videojuegos

en ES y EN. Ni un fichero más.

Lo que NO hace, y es la razón de que exista:

  - **no regenera la portada del Taller.** El generador canónico termina con
    `hub.main()`, que reescribe `es/taller/index.html` y `en/workshop/index.html`.
    Aquí `hub.py` no se porta y la llamada no existe. Para que no pueda
    colarse, este generador deja en su sitio un `hub` de pega cuyo `main()`
    levanta una excepción: si alguien lo llama, el build falla en vez de tocar
    la portada en silencio.
  - **no toca Estructuras** ni ninguno de los otros estudios. Los módulos de
    los estudios que no son estos cinco se sustituyen por un marcador que
    revienta si alguien lee un atributo suyo. No son estudios vacíos: son
    trampas. Si la plantilla intentara usarlos, el build falla.

De dónde sale la plantilla. **No se copia.** Se importa `page()` del generador
canónico `build_taller_suite.py` que ya está en main, para que las diez páginas
salgan con exactamente la misma plantilla que las demás. Lo único que se añade
encima es la hoja de estilo propia de cada estudio:

    <link rel="stylesheet" href="/assets/ig-suite-<estudio>.css?v=r43-1">

Hace falta porque la plantilla de main no emite `STYLES`, y dos de estos cinco
—escritura y juegos de mesa— traen su CSS aparte. Sin esa línea, esos dos
ficheros CSS entran en el paquete y **no los carga nadie**: estudios sin
estilar y dos ficheros muertos en el cierre. La inyección es un reemplazo
anclado en el `<link>` de `ig-suite.css`, y se comprueba que el ancla aparezca
exactamente una vez: si la plantilla de main cambia, esto falla en vez de
escribir páginas a medias.

Uso:  python3 scripts/build_taller_suite5.py [--listar]
"""
from __future__ import annotations

import argparse
import importlib
import sys
import types
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))

SUITE5 = ['pixelart', 'escritura', 'juegos_mesa', 'ritmo', 'videojuegos']
ASSET_V = 'r43-1'
ANCLA = f'<link rel="stylesheet" href="/assets/ig-suite.css?v={ASSET_V}">'


class _Trampa(types.ModuleType):
    """Módulo que revienta si alguien le lee un atributo."""

    def __getattr__(self, nombre):
        raise RuntimeError(
            f'SUITE5 no incluye el estudio «{self.__name__.split(".")[-1]}»: '
            f'algo ha intentado leer «{nombre}». Este generador sólo escribe '
            f'{", ".join(SUITE5)}.')


def _preparar_entorno() -> None:
    """Deja importable el generador canónico sin portar hub ni los otros estudios."""
    if 'taller_suite.hub' not in sys.modules:
        hub = types.ModuleType('taller_suite.hub')

        def main(*a, **k):
            raise RuntimeError('SUITE5 no regenera la portada del Taller: '
                               'hub.main() está prohibido en este generador.')
        hub.main = main
        sys.modules['taller_suite.hub'] = hub

    # La lista canónica de estudios se lee del propio fichero sin ejecutarlo,
    # para saber a qué módulos hay que poner trampa antes de importarlo.
    fuente = (ROOT / 'scripts/build_taller_suite.py').read_text(encoding='utf-8')
    import ast
    arbol = ast.parse(fuente)
    canonicos: list[str] = []
    for nodo in arbol.body:
        if isinstance(nodo, ast.Assign) and any(
                getattr(t, 'id', '') == 'SUITE' for t in nodo.targets):
            canonicos = [el.value for el in nodo.value.elts if isinstance(el, ast.Constant)]
    for n in canonicos:
        if n not in SUITE5 and f'taller_suite.{n}' not in sys.modules:
            if not (ROOT / 'scripts/taller_suite' / f'{n}.py').exists():
                sys.modules[f'taller_suite.{n}'] = _Trampa(f'taller_suite.{n}')


def rutas_esperadas(studios) -> set[str]:
    base = {'es': 'es/taller/', 'en': 'en/workshop/'}
    return {base[l] + m.SLUG[l] + '/index.html' for m in studios for l in ('es', 'en')}


def pagina(canonico, mod, lang: str) -> str:
    html = canonico.page(mod, lang)
    if html.count(ANCLA) != 1:
        raise RuntimeError(
            f'la plantilla de build_taller_suite.py ya no trae el ancla {ANCLA!r} '
            f'exactamente una vez ({html.count(ANCLA)}): revisar antes de generar.')
    hojas = ''.join(f'<link rel="stylesheet" href="/assets/{s}?v={ASSET_V}">'
                    for s in getattr(mod, 'STYLES', []))
    return html.replace(ANCLA, ANCLA + hojas, 1) if hojas else html


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--listar', action='store_true',
                    help='imprimir las diez rutas y salir, sin escribir nada')
    args = ap.parse_args()

    _preparar_entorno()
    canonico = importlib.import_module('build_taller_suite')
    studios = [importlib.import_module('taller_suite.' + n) for n in SUITE5]
    esperadas = rutas_esperadas(studios)
    if len(esperadas) != 10:
        print(f'ERROR: se esperaban 10 rutas y salen {len(esperadas)}', file=sys.stderr)
        return 2
    if args.listar:
        print('\n'.join(sorted(esperadas)))
        return 0

    escritas = []
    for mod in studios:
        for lang in ('es', 'en'):
            rel = ('es/taller/' if lang == 'es' else 'en/workshop/') + mod.SLUG[lang] + '/index.html'
            if rel not in esperadas:
                print(f'ERROR: ruta fuera de la suite: {rel}', file=sys.stderr)
                return 2
            out = ROOT / rel
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(pagina(canonico, mod, lang), encoding='utf-8')
            escritas.append(rel)

    if set(escritas) != esperadas or len(escritas) != 10:
        print('ERROR: el conjunto escrito no son las diez rutas', file=sys.stderr)
        return 2
    print('\n'.join(sorted(escritas)))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
