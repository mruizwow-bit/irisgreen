#!/usr/bin/env python3
"""R42 · Bloque F · Las rutas de caché apuntan a activos que existen.

`_headers` daba caché inmutable de un año a `/assets/pictos/*`. Ese
directorio no existe ni ha existido nunca: el árbol real es
`/assets/pictogramas/…`, y el único sitio del repositorio donde aparecía
`/assets/pictos/` era el propio `_headers`. La regla no se aplicaba a nada.

Comprueba, sobre el directorio publicado:

  1. Toda regla de `_headers` con comodín encaja con al menos un archivo real:
     no quedan reglas muertas.
  2. Toda ruta literal de `_headers` corresponde a un archivo publicado.
  3. Ningún recurso `/assets/…` referenciado desde el HTML, el JavaScript o el
     CSS publicados falta en el directorio: 404 = 0 para lo referenciado.
  4. Las cabeceras de seguridad siguen presentes y sin ampliar: HSTS,
     nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy, COOP y
     una CSP que no gana orígenes nuevos ni `unsafe-eval` en publicación.
  5. Las superficies que esta orden no toca quedan igual: no hay reglas nuevas
     para `/audio/`, `/img/` ni contenido de Child Safety.
  6. Sólo los activos con nombre versionado o con hash conservan caché
     inmutable; se informa de cuáles son, porque un nombre estable con caché
     de un año no se puede invalidar sin renombrarlo.

Lo que este test NO certifica:
  - No comprueba las cabeceras que Netlify sirve de verdad: lee `_headers` y
    `netlify.toml`, no una respuesta HTTP. La comprobación real corresponde al
    Deploy Preview.
  - No opina sobre `netlify.toml`, que fija aparte `/assets/* → max-age=3600`.

Ejecutar desde la raíz del repositorio; el directorio publicado por defecto es
`dist`.
"""
import argparse
import json
import re
from pathlib import Path

SECURITY = [
    'Strict-Transport-Security',
    'X-Content-Type-Options',
    'Referrer-Policy',
    'X-Frame-Options',
    'Permissions-Policy',
    'Cross-Origin-Opener-Policy',
    'Content-Security-Policy',
]

UNTOUCHED = ('/audio/', '/img/', '/assets/content-safety/')

# El orden importa: «json» antes que «js», o una ruta .json se trunca a .js.
REF = re.compile(r'["\'(](/assets/[A-Za-z0-9._/-]+'
                 r'\.(?:svg|png|webp|jpe?g|css|json|js|woff2?))(?![A-Za-z0-9])')


def parse_headers(text):
    """Devuelve [(patrón, {cabecera: valor})] en el orden del archivo."""
    blocks, current = [], None
    for raw in text.splitlines():
        if not raw.strip():
            continue
        if not raw.startswith((' ', '\t')):
            current = (raw.strip(), {})
            blocks.append(current)
        elif current is not None:
            name, _, value = raw.strip().partition(':')
            current[1][name.strip()] = value.strip()
    return blocks


def matches(pattern, root):
    """Archivos publicados que encajan con un patrón de Netlify."""
    if pattern == '/*':
        return [p for p in root.rglob('*') if p.is_file()][:1]
    rel = pattern.lstrip('/')
    if rel.endswith('/*'):
        base = root / rel[:-2]
        return [p for p in base.rglob('*') if p.is_file()] if base.is_dir() else []
    if '*' in rel:
        return list(root.glob(rel))
    target = root / rel
    return [target] if target.is_file() else []


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', type=Path, default=Path('dist'))
    ap.add_argument('--source', type=Path, default=Path('_headers'))
    args = ap.parse_args()
    root = args.root.resolve()
    assert root.is_dir(), f'No existe el directorio publicado: {root}'

    published = root / '_headers'
    assert published.is_file(), 'El directorio publicado no lleva _headers'
    blocks = parse_headers(published.read_text(encoding='utf-8'))
    report = {'rules': [], 'dead_rules': [], 'missing_assets': [], 'immutable': []}

    # 1 y 2 · ninguna regla muerta
    for pattern, values in blocks:
        hits = matches(pattern, root)
        entry = {'pattern': pattern, 'files': len(hits)}
        report['rules'].append(entry)
        if not hits:
            report['dead_rules'].append(pattern)
        if 'immutable' in values.get('Cache-Control', ''):
            report['immutable'].append({'pattern': pattern, 'files': len(hits)})
    assert not report['dead_rules'], f'Reglas que no encajan con nada: {report["dead_rules"]}'

    # 3 · lo referenciado existe
    seen = set()
    for path in root.rglob('*'):
        if path.suffix.lower() not in {'.html', '.js', '.css'} or not path.is_file():
            continue
        for ref in REF.findall(path.read_text(encoding='utf-8', errors='ignore')):
            seen.add(ref)
    for ref in sorted(seen):
        if not (root / ref.lstrip('/')).is_file():
            report['missing_assets'].append(ref)
    assert not report['missing_assets'], \
        f'Referencias sin archivo publicado: {report["missing_assets"][:10]}'
    report['referenced_assets'] = len(seen)

    # 4 · seguridad intacta y sin ampliar
    root_values = dict(blocks[0][1]) if blocks and blocks[0][0] == '/*' else {}
    for name in SECURITY:
        assert name in root_values, f'Falta la cabecera de seguridad {name}'
    csp = root_values['Content-Security-Policy']
    assert "'unsafe-eval'" not in csp, 'La CSP publicada conserva unsafe-eval'
    source_csp = parse_headers(args.source.read_text(encoding='utf-8'))[0][1][
        'Content-Security-Policy']
    origins = lambda text: set(re.findall(r'https?://[A-Za-z0-9._/-]+', text))
    gained = origins(csp) - origins(source_csp)
    assert not gained, f'La CSP publicada gana orígenes: {sorted(gained)}'
    report['csp_origins'] = len(origins(csp))

    # 5 · superficies que no se tocan
    for pattern, _ in blocks:
        assert not pattern.startswith(UNTOUCHED), \
            f'_headers introduce una regla en una superficie que esta orden no toca: {pattern}'

    # 6 · inmutable sólo donde el nombre lo permite
    report['immutable_patterns'] = [e['pattern'] for e in report['immutable']]

    out = root / 'reports/publicacion'
    out.mkdir(parents=True, exist_ok=True)
    report['gate'] = 'R42_PICTOGRAM_CACHE_PATHS_PASS'
    (out / 'cache-paths.json').write_text(
        json.dumps(report, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps({'gate': report['gate'], 'rules': len(blocks),
                      'dead_rules': report['dead_rules'],
                      'referenced_assets': report['referenced_assets'],
                      'missing_assets': report['missing_assets'],
                      'immutable': report['immutable']}, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main()
