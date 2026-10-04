#!/usr/bin/env python3
"""SUITE5 · cierre de dependencias **calculado**, no declarado a mano.

`R44_SUITE5_DEPENDENCY_CLOSURE_R3`. La R1 declaró 20 ficheros y faltaban tres.
La R2 declaró 24 y faltaba `ig-suite-meter-worklet.js`. Las dos veces el fallo
fue el mismo: la lista se escribió a mano. Esto la calcula.

Cómo. Parte de las diez páginas generadas y sigue las referencias:

  1. del HTML saca `src=` y `href=` locales;
  2. de cada JS y CSS que entra, saca **las cadenas que parecen rutas** —
     `'/assets/...'`, `url(...)`, y cualquier literal que acabe en .js .css
     .json .wasm .woff2 .png .svg — y las vuelve a meter en la cola;
  3. repite hasta que no entra nada nuevo.

El paso 2 es el que importa: el worklet que faltaba en la R2 **no aparece en
ningún HTML**. Lo pide `ig-suite-musica.js` en tiempo de ejecución con
`audioWorklet.addModule('/assets/ig-suite-meter-worklet.js?v=r43-1')`, y un
cierre que sólo mire el HTML no lo puede ver nunca.

Salida: para cada fichero referenciado, si está en main, si hay que traerlo del
donante, o si no está en ninguno de los dos —que es un 404 en producción—.

Uso:  python3 scripts/cierre_suite5.py [--json FICHERO]
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DONANTE = 'origin/codex/repair-global-ui-child-safety-20261001'
RUTAS = 'scripts/build_taller_suite5.py'

# Extensiones que son ficheros servidos. Si una cadena acaba en una de éstas,
# se trata como posible dependencia.
EXT = ('.js', '.css', '.json', '.wasm', '.woff2', '.woff', '.ttf', '.png',
       '.svg', '.webp', '.jpg', '.mp3', '.ogg', '.txt', '.pdf')

RE_VENDOR = re.compile(r"""var\s+VENDOR\s*=\s*['"]([^'"]+)['"]""")
RE_LIBS_MAP = re.compile(r'var\s+LIBS\s*=\s*\{(.*?)\n\s*\};', re.S)
RE_LIBS_USO = re.compile(r"libs\s*:\s*\[([^\]]*)\]")


def vendor_dinamico(core: str, motores: dict[str, str]) -> set[str]:
    """Resuelve el cargador de bibliotecas de `ig-suite-core.js`.

    El core no escribe nunca la ruta completa de una biblioteca: hace
    `VENDOR + src + '?v=' + VERSION`, con `src` saliendo de un mapa `LIBS` y el
    nombre del grupo saliendo de cada motor (`libs: ['pixi', 'tone']`). Son dos
    literales que ningún escáner de cadenas junta solo, así que este cierre
    entiende **ese** cargador a mano. Si el core cambia de forma y ya no se
    encuentran `VENDOR` o `LIBS`, esto levanta una excepción en vez de devolver
    un cierre incompleto en silencio.
    """
    mv = RE_VENDOR.search(core)
    ml = RE_LIBS_MAP.search(core)
    if not mv or not ml:
        raise RuntimeError('ig-suite-core.js ya no declara VENDOR o LIBS como se esperaba: '
                           'revisar el cierre de bibliotecas antes de empaquetar')
    base = mv.group(1).lstrip('/')
    mapa: dict[str, list[str]] = {}
    for grupo, cuerpo in re.findall(r"(\w+)\s*:\s*\[([^\]]*)\]", ml.group(1)):
        ficheros = []
        for trozo in cuerpo.split(','):
            trozo = trozo.strip()
            if not trozo:
                continue
            partes = re.findall(r"['\"]([^'\"]*)['\"]", trozo)
            if 'LANG' in trozo:                      # 'blockly-msg-' + LANG + '.js'
                for lang in ('es', 'en'):
                    ficheros.append(lang.join(partes) if len(partes) > 1 else partes[0] + lang)
            elif partes:
                ficheros.append(''.join(partes))
        mapa[grupo] = ficheros
    pedidos: set[str] = set()
    for texto in motores.values():
        for cuerpo in RE_LIBS_USO.findall(texto):
            pedidos |= {x.strip().strip('\'"') for x in cuerpo.split(',') if x.strip()}
    fuera = pedidos - set(mapa)
    if fuera:
        raise RuntimeError(f'motores piden bibliotecas que LIBS no conoce: {sorted(fuera)}')
    return {base + f for g in pedidos for f in mapa[g]}


RE_ATTR = re.compile(r'(?:src|href)\s*=\s*["\']([^"\']+)["\']', re.I)
RE_LIT = re.compile(r'''["'`]([^"'`\n]{2,200}?)["'`]''')
RE_URL = re.compile(r'url\(\s*["\']?([^"\')]+)', re.I)


def donante_lista() -> set[str]:
    out = subprocess.run(['git', '-c', 'gc.auto=0', 'ls-tree', '-r', '--name-only', DONANTE],
                         cwd=ROOT, capture_output=True, text=True, timeout=300)
    return set(out.stdout.split())


def normaliza(ref: str) -> str | None:
    """Pasa una referencia a ruta del repositorio, o None si no es local."""
    ref = ref.split('#')[0].split('?')[0].strip()
    if not ref or ref.startswith(('http://', 'https://', '//', 'data:', 'mailto:',
                                  'blob:', 'javascript:', '{')):
        return None
    if not ref.startswith('/'):
        return None            # relativas: dentro de la página, no son assets
    p = ref.lstrip('/')
    return p if p.endswith(EXT) else None


def referencias(texto: str, es_html: bool) -> set[str]:
    refs: set[str] = set()
    if es_html:
        refs |= {m for m in RE_ATTR.findall(texto)}
    refs |= set(RE_LIT.findall(texto))
    refs |= set(RE_URL.findall(texto))
    return {r for r in (normaliza(x) for x in refs) if r}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--json', help='escribir el informe en este fichero')
    args = ap.parse_args()

    paginas = subprocess.run([sys.executable, RUTAS, '--listar'], cwd=ROOT,
                             capture_output=True, text=True).stdout.split()
    if len(paginas) != 10:
        print(f'ERROR: el generador declara {len(paginas)} rutas, no 10', file=sys.stderr)
        return 2

    en_donante = donante_lista()
    visto: set[str] = set()
    cola = list(paginas)
    origen: dict[str, str] = {}
    pedido_por: dict[str, set[str]] = {}

    textos: dict[str, str] = {}

    def recorrer():
        while cola:
            rel = cola.pop()
            if rel in visto:
                continue
            visto.add(rel)
            f = ROOT / rel
            if f.exists():
                origen.setdefault(rel, 'main' if rel not in paginas else 'generado')
                try:
                    texto = f.read_text(encoding='utf-8', errors='ignore')
                except Exception:
                    continue
            elif rel in en_donante:
                origen[rel] = 'donante'
                texto = subprocess.run(['git', '-c', 'gc.auto=0', 'show', f'{DONANTE}:{rel}'],
                                       cwd=ROOT, capture_output=True, text=True).stdout
            else:
                origen[rel] = 'EN NINGUNO'
                continue
            textos[rel] = texto
            if rel.endswith(('.js', '.css', '.html')):
                for r in referencias(texto, rel.endswith('.html')):
                    pedido_por.setdefault(r, set()).add(rel)
                    if r not in visto:
                        cola.append(r)

    recorrer()
    # Segunda pasada: las bibliotecas que el core carga a mano (VENDOR + nombre).
    core = textos.get('assets/ig-suite-core.js')
    if core:
        motores = {k: v for k, v in textos.items()
                   if k.startswith('assets/ig-suite-') and k.endswith('.js')}
        for r in sorted(vendor_dinamico(core, motores)):
            pedido_por.setdefault(r, set()).add('assets/ig-suite-core.js (carga diferida)')
            if r not in visto:
                cola.append(r)
        recorrer()

    assets = {k: v for k, v in origen.items() if k not in paginas}
    faltan = sorted(k for k, v in assets.items() if v == 'EN NINGUNO')
    del_donante = sorted(k for k, v in assets.items() if v == 'donante')
    de_main = sorted(k for k, v in assets.items() if v == 'main')

    informe = {
        'paginas': sorted(paginas),
        'assets_en_main': de_main,
        'assets_del_donante': del_donante,
        'assets_en_ninguno': {k: sorted(pedido_por.get(k, [])) for k in faltan},
        'cuenta': {'paginas': len(paginas), 'de_main': len(de_main),
                   'del_donante': len(del_donante), 'en_ninguno': len(faltan)},
    }
    print(json.dumps(informe, ensure_ascii=False, indent=1))
    if args.json:
        Path(args.json).write_text(json.dumps(informe, ensure_ascii=False, indent=1) + '\n',
                                   encoding='utf-8')
    return 1 if faltan else 0


if __name__ == '__main__':
    raise SystemExit(main())
