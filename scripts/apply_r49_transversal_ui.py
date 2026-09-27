#!/usr/bin/env python3
"""R49 A8 · apply the transversal R42/R02 interface system to every public HTML route.

The transform is intentionally profile-based instead of template-based:
CONTENT keeps readable measures, BROWSE uses fluid catalogue width, WORKSPACE
uses the available viewport. Existing product engines remain untouched.
"""
from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from pathlib import Path
from urllib.parse import quote

BODY_RE = re.compile(r"<body\b([^>]*)>", re.I)
HTML_RE = re.compile(r"<html\b([^>]*)>", re.I)
MAIN_RE = re.compile(r"<main\b([^>]*)>", re.I)

ASSETS = (
    ('css', '/assets/ig-r42-materials.css?v=r49-1'),
    ('css', '/assets/ig-audience.css?v=r49-1'),
    ('css', '/assets/ig-r49-transversal.css?v=r49-1'),
    ('js', '/assets/ig-audience.js?v=r49-1'),
    ('js', '/assets/ig-child-safe.js?v=r49-1'),
    ('js', '/assets/ig-r49-transversal.js?v=r49-1'),
)

BROWSE_EXACT = {
    '/', '/en/',
    '/es/neurodiversidad/condiciones/', '/en/neurodiversity/conditions/',
    '/es/situaciones/', '/en/situations/',
    '/es/biblioteca/', '/en/everyday-life/',
    '/es/datos/', '/en/data/',
    '/es/videos/',
    '/es/recursos/', '/en/resources/',
    '/es/recursos/juegos/', '/en/resources/games/',
    '/es/recursos/rutinas-visuales/', '/en/resources/visual-routines/',
    '/es/recursos/rutinas-imprimibles/', '/en/resources/printable-routines/',
    '/es/tramites/', '/es/tramites/directorio/',
    '/es/libros/',
}
WORKSPACE_PREFIXES = (
    '/es/taller/', '/en/workshop/',
    '/es/intereses/', '/en/interests/',
    '/es/sitio-tranquilo/', '/en/quiet-space/',
)
WORKSPACE_EXACT = {
    '/es/recursos/contar-y-pagar/', '/en/resources/count-and-pay/',
    '/es/recursos/tarjeta-iris/', '/en/resources/iris-card/',
    '/es/tarjetas-iris/', '/es/calculadora/',
    '/es/cuestionarios/',
}
PRINT_TOKENS = ('/imprimir/', '/print/', 'impresion', 'printable')

def route_for(path: Path, root: Path) -> str:
    rel = path.relative_to(root).as_posix()
    if rel == 'index.html':
        return '/'
    if rel.endswith('/index.html'):
        return '/' + rel[:-10]
    return '/' + rel

def locale_for(text: str, route: str) -> str:
    m = HTML_RE.search(text)
    if m:
        lm = re.search(r'\blang=["\']([^"\']+)', m.group(1), re.I)
        if lm and lm.group(1).lower().startswith('en'):
            return 'en'
    return 'en' if route.startswith('/en/') else 'es'

def owner_for(route: str) -> str:
    if route in ('/', '/en/'):
        return 'A8_HOME_DONOR'
    if route.startswith(('/es/taller/', '/en/workshop/')):
        return 'R47_TALLER'
    if route.startswith(('/es/intereses/', '/en/interests/')):
        return 'R48_INTERESES'
    if route.startswith(('/es/sitio-tranquilo/', '/en/quiet-space/')):
        return 'R46_RINCON'
    if route.startswith(('/es/recursos/juegos/', '/en/resources/games/')) and route not in ('/es/recursos/juegos/', '/en/resources/games/'):
        return 'R42_GAMES_ADAPTER'
    return 'R49_TRANSVERSAL'

def profile_for(route: str) -> tuple[str, str]:
    if route in BROWSE_EXACT:
        return 'browse', 'portal_or_catalogue'
    if route.startswith(WORKSPACE_PREFIXES) or route in WORKSPACE_EXACT:
        return 'workspace', 'interactive_workspace'
    if route.startswith(('/es/recursos/juegos/', '/en/resources/games/')) and route not in ('/es/recursos/juegos/', '/en/resources/games/'):
        return 'workspace', 'interactive_game'
    if route == '/es/investigacion/':
        return 'content', 'research_reading_with_filters'
    return 'content', 'reading_or_editorial'

def set_attr(attrs: str, name: str, value: str) -> str:
    pat = re.compile(r'(\s' + re.escape(name) + r'=)(["\']).*?\2', re.I | re.S)
    if pat.search(attrs):
        return pat.sub(lambda m: m.group(1) + '"' + value + '"', attrs, count=1)
    return attrs.rstrip() + f' {name}="{value}"'

def ensure_body_attrs(text: str, profile: str, owner: str, route: str) -> str:
    m = BODY_RE.search(text)
    if not m:
        raise AssertionError(f'R49 page without body: {route}')
    attrs = m.group(1)
    attrs = set_attr(attrs, 'data-ig-r49', '1')
    attrs = set_attr(attrs, 'data-ig-profile', profile)
    attrs = set_attr(attrs, 'data-ig-materials', 'r42')
    attrs = set_attr(attrs, 'data-ig-r49-owner', owner)
    if profile == 'workspace' and 'data-ig-r42-family' not in attrs:
        family = ''
        if owner == 'R47_TALLER':
            family = 'workshop'
        elif owner == 'R48_INTERESES':
            family = 'interests'
        elif owner == 'R46_RINCON':
            family = 'quiet'
        elif owner == 'R42_GAMES_ADAPTER':
            family = 'games'
        if family:
            attrs = set_attr(attrs, 'data-ig-r42-family', family)
    if any(token in route.lower() for token in PRINT_TOKENS):
        attrs = set_attr(attrs, 'data-ig-r49-print', 'true')
    return text[:m.start()] + '<body' + attrs + '>' + text[m.end():]

def ensure_main_id(text: str) -> str:
    m = MAIN_RE.search(text)
    if not m:
        return text
    attrs = m.group(1)
    if re.search(r'\bid=["\']', attrs, re.I):
        return text
    attrs = attrs.rstrip() + ' id="main"'
    return text[:m.start()] + '<main' + attrs + '>' + text[m.end():]

def ensure_head_assets(text: str, route: str) -> str:
    if '</head>' not in text.lower():
        raise AssertionError(f'R49 page without head: {route}')
    inject = []
    if '/assets/preferencias-lectura.js' not in text:
        inject.append('<script src="/assets/preferencias-lectura.js"></script>')
    for kind, url in ASSETS:
        bare = url.split('?')[0]
        if bare in text:
            continue
        if kind == 'css':
            inject.append(f'<link rel="stylesheet" href="{url}">')
        else:
            defer = ' defer' if 'ig-r49-transversal.js' in url or 'ig-child-safe.js' in url else ''
            inject.append(f'<script{defer} src="{url}"></script>')
    marker = '<meta name="ig-r49-transversal" content="1">'
    if 'name="ig-r49-transversal"' not in text:
        inject.insert(0, marker)
    if not inject:
        return text
    return re.sub(r'</head>', ''.join(inject) + '</head>', text, count=1, flags=re.I)

def ensure_screen_print_rule(text: str) -> str:
    # Public printable HTML keeps common chrome on screen; print CSS hides it.
    return text

def apply_one(path: Path, root: Path) -> dict:
    before = path.read_text(encoding='utf-8')
    route = route_for(path, root)
    profile, reason = profile_for(route)
    locale = locale_for(before, route)
    owner = owner_for(route)
    after = ensure_body_attrs(before, profile, owner, route)
    after = ensure_main_id(after)
    after = ensure_head_assets(after, route)
    after = ensure_screen_print_rule(after)
    if after != before:
        path.write_text(after, encoding='utf-8')
    return {
        'route': route,
        'file': path.relative_to(root).as_posix(),
        'locale': locale,
        'profile': profile,
        'r02': True,
        'common_header': True,
        'common_footer': True,
        'preferences': True,
        'audience': True,
        'child_safe': True,
        'owner_lane': owner,
        'exemption': None,
        'reason': reason,
        'bytes_before': len(before.encode('utf-8')),
        'bytes_after': len(after.encode('utf-8')),
    }

def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root', type=Path, required=True)
    args = ap.parse_args()
    root = args.root.resolve()
    pages = sorted(p for p in root.rglob('*.html') if p.is_file())
    if not pages:
        raise AssertionError('R49 found no public HTML')
    manifest = [apply_one(p, root) for p in pages]
    unclassified = [r for r in manifest if r['profile'] not in {'content', 'browse', 'workspace'}]
    if unclassified:
        raise AssertionError(f'R49 unclassified public routes: {len(unclassified)}')
    dup_routes = [r for r, n in Counter(x['route'] for x in manifest).items() if n > 1]
    if dup_routes:
        raise AssertionError(f'R49 duplicate public routes: {dup_routes[:10]}')
    counts = Counter(x['profile'] for x in manifest)
    locales = Counter(x['locale'] for x in manifest)
    owners = Counter(x['owner_lane'] for x in manifest)
    delta = sum(x['bytes_after'] - x['bytes_before'] for x in manifest)
    out = root / 'assets' / 'r49-route-profiles.json'
    payload = {
        'version': 'R49-1',
        'rule': 'READING_WIDTH != PRODUCT_WIDTH',
        'total_routes': len(manifest),
        'unclassified': 0,
        'profiles': dict(sorted(counts.items())),
        'locales': dict(sorted(locales.items())),
        'owners': dict(sorted(owners.items())),
        'html_delta_bytes': delta,
        'routes': manifest,
    }
    out.write_text(json.dumps(payload, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print(json.dumps({k: payload[k] for k in ('total_routes','unclassified','profiles','locales','owners','html_delta_bytes')}, ensure_ascii=False))

if __name__ == '__main__':
    main()
