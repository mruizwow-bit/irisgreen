#!/usr/bin/env python3
"""Normaliza y valida los catálogos ingleses ya existentes.

No traduce por inferencia. Los nombres cruzados ES→EN salen de buscador.json,
que a su vez fue enriquecido desde las páginas inglesas reales del repositorio.
El build falla si una tarjeta de los catálogos EN termina en una ruta española,
si falta su página o si la página destino no declara lang=en.
"""
from __future__ import annotations
import html
import json
import re
from pathlib import Path
from urllib.parse import urljoin, urlparse

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / 'buscador.json'
SITUATIONS = ROOT / 'en' / 'situations'
CONDITIONS = ROOT / 'en' / 'neurodiversity' / 'conditions'

CARD = re.compile(r'<a\b(?=[^>]*\bclass=["\'][^"\']*\bcard\b[^"\']*["\'])[^>]*\bhref=["\']([^"\']+)["\'][^>]*>', re.I)
HTML_LANG = re.compile(r'<html\b[^>]*\blang=["\']([^"\']+)', re.I)
RELATED_CHIP = re.compile(
    r'(<span\b(?=[^>]*\bclass=["\'](?=[^"\']*\bchip\b)(?=[^"\']*\blil\b)[^"\']*["\'])[^>]*>)([^<]+)(</span>)',
    re.I,
)
H2 = re.compile(r'<h2\b[^>]*>(.*?)</h2>', re.I | re.S)
TAG = re.compile(r'<[^>]+>')

SPANISH_HEADINGS = {
    'descripción','frecuencia e incertidumbre','qué ayuda','qué no está respaldado por la evidencia',
    'fuentes','revisión','en breve','no significa automáticamente','qué observar','qué puede ayudar ahora',
    'qué evitar','cuándo pedir ayuda profesional','señales de alerta','puede estar relacionado con',
    'fuentes y revisión','qué conviene observar','qué puede ayudar','cuándo pedir una valoración',
}


def clean(value: str) -> str:
    return re.sub(r'\s+', ' ', html.unescape(TAG.sub(' ', value))).strip()


def norm(value: str) -> str:
    import unicodedata
    value = unicodedata.normalize('NFD', clean(value).lower())
    return ''.join(c for c in value if unicodedata.category(c) != 'Mn')


def condition_map():
    data = json.loads(INDEX.read_text(encoding='utf-8'))
    mapping = {}
    for item in data:
        en = item.get('en')
        if item.get('s') != 'Condición' or not isinstance(en, dict):
            continue
        es_name = str(item.get('t') or '').strip()
        en_name = str(en.get('t') or '').strip()
        if es_name and en_name:
            mapping[norm(es_name)] = en_name
    if len(mapping) < 150:
        raise SystemExit('El índice bilingüe no contiene suficientes nombres de Condiciones')
    return mapping


def resolve_route(route: str) -> Path:
    rel = urlparse(route).path.strip('/')
    return ROOT / rel / 'index.html' if rel else ROOT / 'index.html'


def validate_catalog(path: Path, base_url: str, prefix: str, expected: int):
    text = path.read_text(encoding='utf-8')
    hrefs = CARD.findall(text)
    if len(hrefs) != expected:
        raise SystemExit(f'{path.relative_to(ROOT)}: {len(hrefs)} tarjetas; se esperaban {expected}')
    routes = []
    for href in hrefs:
        route = urlparse(urljoin(base_url, html.unescape(href))).path
        if not route.startswith(prefix):
            raise SystemExit(f'Tarjeta inglesa fuera de su ruta EN: {href} -> {route}')
        target = resolve_route(route)
        if not target.is_file():
            raise SystemExit(f'Falta la página inglesa enlazada: {route}')
        body = target.read_text(encoding='utf-8')
        m = HTML_LANG.search(body)
        if not m or not m.group(1).lower().startswith('en'):
            raise SystemExit(f'La tarjeta EN termina en una página no inglesa: {route}')
        routes.append(route)
    if len(routes) != len(set(routes)):
        raise SystemExit(f'Hay enlaces duplicados en {path.relative_to(ROOT)}')
    return routes


def normalize_situation_relations(mapping):
    changed = 0
    translated = 0
    unresolved_spanish = []
    for path in sorted(SITUATIONS.glob('*/index.html')):
        old = path.read_text(encoding='utf-8')
        def repl(match):
            nonlocal translated
            label = clean(match.group(2))
            key = norm(label)
            if key in mapping and mapping[key] != label:
                translated += 1
                return match.group(1) + html.escape(mapping[key], quote=False) + match.group(3)
            return match.group(0)
        text = RELATED_CHIP.sub(repl, old)
        for m in RELATED_CHIP.finditer(text):
            label = clean(m.group(2)); key = norm(label)
            if key in mapping and mapping[key] != label:
                unresolved_spanish.append((path.relative_to(ROOT).as_posix(), label))
        headings = {norm(x) for x in H2.findall(text)}
        bad = headings & {norm(x) for x in SPANISH_HEADINGS}
        if bad:
            raise SystemExit('Encabezado español en ficha inglesa '+path.relative_to(ROOT).as_posix()+': '+', '.join(sorted(bad)))
        if text != old:
            path.write_text(text, encoding='utf-8'); changed += 1
    if unresolved_spanish:
        raise SystemExit('Quedan relaciones españolas en EN: '+repr(unresolved_spanish[:10]))
    return changed, translated


def check_condition_headings():
    checked = 0
    for path in sorted(CONDITIONS.glob('*/index.html')):
        text = path.read_text(encoding='utf-8')
        m = HTML_LANG.search(text)
        if not m or not m.group(1).lower().startswith('en'):
            raise SystemExit('Ficha de Conditions sin lang=en: '+path.relative_to(ROOT).as_posix())
        headings = {norm(x) for x in H2.findall(text)}
        bad = headings & {norm(x) for x in SPANISH_HEADINGS}
        if bad:
            raise SystemExit('Encabezado español en Condition EN '+path.relative_to(ROOT).as_posix()+': '+', '.join(sorted(bad)))
        checked += 1
    return checked


def fix_conditions_notice():
    path = CONDITIONS / 'index.html'
    old = path.read_text(encoding='utf-8')
    text = old.replace(
        'All 185 entries are mounted, in all three languages.',
        'All 185 entries are available in Spanish and English.'
    )
    if 'all three languages' in text.lower():
        raise SystemExit('Conditions EN todavía afirma que hay tres idiomas')
    if text != old:
        path.write_text(text, encoding='utf-8')
        return True
    return False


def run():
    mapping = condition_map()
    situation_routes = validate_catalog(
        SITUATIONS / 'index.html',
        'https://irisgreen.eu/en/situations/',
        '/en/situations/',
        187,
    )
    condition_routes = validate_catalog(
        CONDITIONS / 'index.html',
        'https://irisgreen.eu/en/neurodiversity/conditions/',
        '/en/neurodiversity/conditions/',
        185,
    )
    changed, translated = normalize_situation_relations(mapping)
    conditions_checked = check_condition_headings()
    notice_changed = fix_conditions_notice()
    report = {
        'situations_catalog_routes': len(situation_routes),
        'conditions_catalog_routes': len(condition_routes),
        'situation_pages_with_related_labels_fixed': changed,
        'related_labels_translated_from_existing_index': translated,
        'condition_pages_heading_checked': conditions_checked,
        'conditions_language_notice_fixed': notice_changed,
    }
    out = ROOT / 'reports' / 'routes'; out.mkdir(parents=True, exist_ok=True)
    (out / 'english-catalogs.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False, separators=(',', ':')))
    return report


if __name__ == '__main__':
    run()
