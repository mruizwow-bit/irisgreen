#!/usr/bin/env python3
"""Barrido de color de interfaz escrito a mano · §9 de los tokens globales 2026.

`IRIS_GREEN_GLOBAL_UI_TOKENS_2026_ADOPTED` §9 pide barrer CSS, JS y HTML, y que
cada uso de color sea una de cuatro cosas:

  1. token global;
  2. color propio de asset o arte;
  3. forced-colors o print;
  4. excepción documentada.

Un color de interfaz escrito a mano sin excepción es FAIL.

Este script mide eso y publica los recuentos. No repara nada: la migración es
trabajo de cada carril, y un barrido automático que reescriba color en 223
reglas haría más daño que bien.

## Cómo clasifica

  - **token**: el valor coincide con un token canónico. No es fallo, pero se
    informa como «debería ser var()», porque un literal que hoy coincide con el
    token deja de coincidir en cuanto el token cambie, y entonces esa regla se
    queda atrás sin que nadie se entere.
  - **arte**: el archivo está en la lista de superficies de obra —escenas,
    ilustraciones, render— donde la §6 permite color propio.
  - **sistema**: el color está dentro de un bloque `forced-colors`, `print` o
    `prefers-contrast`, donde manda el sistema o el papel.
  - **excepción**: la línea lleva el comentario `ig-token-exception:` con su
    motivo, que es la vía que abre la §9 punto 4.
  - **hardcode**: todo lo demás.

## Lo que este test NO certifica

  - No parsea CSS: es un barrido por expresión regular sobre líneas. Un color
    dentro de un bloque anidado raro puede clasificarse mal.
  - No sabe si un color de interfaz es *correcto*, sólo si está escrito a mano.
  - No mira contraste. Eso es otro gate.

Uso:  python3 scripts/audit_tokens_hardcode.py
"""
import argparse
import json
import re
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
TOKENS_CSS = REPO / 'assets/ig-tokens-2026.css'

COLOR = re.compile(r'#[0-9A-Fa-f]{3,8}\b|\brgba?\([^)]*\)|\bhsla?\([^)]*\)')
BLOCK_SYSTEM = re.compile(r'@media[^{]*(forced-colors|print|prefers-contrast)')
EXCEPTION = re.compile(r'ig-token-exception:')

# Superficies de obra: la §6 permite color propio en escena e ilustración.
ART = (
    'assets/juegos-iris.css',          # tablero y fichas de juego
    'assets/rutinas-visuales.css',     # pictogramas y vista previa
    'assets/rutinas-imprimibles.css',  # hojas imprimibles
    'assets/musica.css',
    'assets/ig-sistema-solar',
    'assets/ig-cielo',
    'assets/rincon-',                  # stages inmersivos de Rincón, §8
    'assets/ig-taller-materiales',     # mini-escenas de Taller, §7 KEEP
    'img/', 'audio/',
)

# Excluido del anterior a propósito: assets/ig-taller-lab.css redefine la
# paleta de interfaz entera para Taller (--tinta, --azul, --lila, --suave…),
# que es exactamente lo que prohíbe la §1. No es arte: es un design system
# paralelo, y tiene que salir en el recuento.

# Neutros de dibujo que no son color de interfaz.
NEUTRAL = {'#fff', '#ffffff', '#000', '#000000', 'transparent',
           'currentcolor', 'inherit', 'none'}


def canonical_values():
    if not TOKENS_CSS.is_file():
        return {}
    out = {}
    for line in TOKENS_CSS.read_text(encoding='utf-8').splitlines():
        m = re.match(r'\s*(--ig-[a-z-]+):\s*(#[0-9A-Fa-f]{6})', line)
        if m:
            out.setdefault(m.group(2).lower(), m.group(1))
    return out


def is_art(rel):
    return any(rel.startswith(a) or a in rel for a in ART)


def classify(path, root, canon):
    rel = str(path.relative_to(root))
    rows = []
    in_system = 0
    depth = 0
    for n, line in enumerate(path.read_text(encoding='utf-8', errors='ignore').splitlines(), 1):
        if BLOCK_SYSTEM.search(line):
            in_system = depth + 1
        depth += line.count('{') - line.count('}')
        if in_system and depth < in_system:
            in_system = 0
        for raw in COLOR.findall(line):
            val = raw.lower()
            if val in NEUTRAL:
                kind = 'neutro'
            elif EXCEPTION.search(line):
                kind = 'excepcion'
            elif in_system:
                kind = 'sistema'
            elif is_art(rel):
                kind = 'arte'
            elif val in canon:
                kind = 'token-literal'
            else:
                kind = 'hardcode'
            rows.append({'file': rel, 'line': n, 'value': raw, 'kind': kind,
                         'token': canon.get(val, '')})
    return rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', type=Path, default=REPO)
    ap.add_argument('--max-hardcode', type=int, default=None,
                    help='umbral para que el gate falle; sin él sólo informa')
    args = ap.parse_args()
    root = args.root.resolve()
    canon = canonical_values()

    targets = []
    for pat in ('assets/**/*.css', 'assets/**/*.js', 'es/**/*.html', 'en/**/*.html',
                '*.html'):
        targets += [p for p in root.glob(pat) if p.is_file()]
    targets = [p for p in targets if 'node_modules' not in p.parts and p.name != TOKENS_CSS.name]

    rows = []
    for p in sorted(set(targets)):
        rows += classify(p, root, canon)

    counts = {}
    for r in rows:
        counts[r['kind']] = counts.get(r['kind'], 0) + 1

    hard = [r for r in rows if r['kind'] == 'hardcode']
    lit = [r for r in rows if r['kind'] == 'token-literal']
    worst = {}
    for r in hard:
        worst[r['file']] = worst.get(r['file'], 0) + 1

    report = {
        'schema': 'IRIS_TOKENS_HARDCODE_SWEEP/1.0',
        'canonical_tokens': len(canon),
        'files_scanned': len(set(r['file'] for r in rows)) or len(targets),
        'counts': dict(sorted(counts.items(), key=lambda kv: -kv[1])),
        'top_hardcode_files': dict(sorted(worst.items(), key=lambda kv: -kv[1])[:12]),
        'token_literals_sample': lit[:10],
        'limits': [
            'Barrido por expresión regular: no parsea CSS.',
            'No dice si un color de interfaz es correcto, sólo si está a mano.',
            'No mide contraste; eso es otro gate.',
        ],
    }
    if args.max_hardcode is None:
        report['gate'] = 'INFORME'
    else:
        report['gate'] = ('IRIS_GREEN_GLOBAL_VISUAL_TOKENS_UNIFIED_GATE'
                          if len(hard) <= args.max_hardcode else 'FAIL')

    out = root / 'reports/tokens'
    out.mkdir(parents=True, exist_ok=True)
    (out / 'hardcode-sweep.json').write_text(
        json.dumps({**report, 'rows': rows}, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False, indent=1))
    if report['gate'] == 'FAIL':
        raise SystemExit(1)


if __name__ == '__main__':
    main()
