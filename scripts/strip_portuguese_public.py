#!/usr/bin/env python3
"""Retira de la salida pública el tercer idioma PT-BR ya discontinuado.

No toca las fuentes externas brasileñas: una URL oficial puede contener /pt-br/
sin ser una ruta de idioma de Iris Green. `_redirects` también queda intacto.
"""
from __future__ import annotations
import argparse
import json
import re
from pathlib import Path

INTERNAL_PT_ANCHOR = re.compile(
    r'<a\b(?=[^>]*(?:class=["\'][^"\']*\big-nav-pt\b|href=["\'](?:https?://(?:www\.)?irisgreen\.eu)?/pt-br(?:/|["\'])))'
    r'[^>]*>.*?</a>\s*', re.I | re.S
)
PT_ALTERNATE = re.compile(
    r'<link\b(?=[^>]*\bhreflang=["\']pt(?:-br)?["\'])[^>]*>\s*', re.I
)
PT_OBJECT_LINE = re.compile(
    r'(?m)^[ \t]*(?:["\']?pt["\']?)\s*:\s*\{[^\n{}]*\}\s*,?\s*$\n?'
)

EXACT_TEXT_REPLACEMENTS = {
    'Sigue pendiente la traducción completa de las 120 fichas a EN y PT-BR si la colección se publica también en esos idiomas.':
        'Sigue pendiente la traducción completa de las 120 fichas a EN si la colección se publica también en ese idioma.',
}


def clean_json_value(value):
    if isinstance(value, dict):
        out = {}
        for key, item in value.items():
            if str(key).lower().replace('_', '-') in {'pt', 'pt-br'}:
                continue
            out[key] = clean_json_value(item)
        return out
    if isinstance(value, list):
        return [clean_json_value(item) for item in value]
    if isinstance(value, str):
        return EXACT_TEXT_REPLACEMENTS.get(value, value)
    return value


def clean_text(text: str) -> str:
    text = PT_ALTERNATE.sub('', text)
    text = INTERNAL_PT_ANCHOR.sub('', text)
    text = PT_OBJECT_LINE.sub('', text)
    text = text.replace('document.documentElement.lang = l === "pt" ? "pt-BR" : l;',
                        'document.documentElement.lang = l;')
    text = text.replace("document.documentElement.lang = l === 'pt' ? 'pt-BR' : l;",
                        'document.documentElement.lang = l;')
    text = text.replace('document.documentElement.lang = sv === "pt" ? "pt-BR" : (sv || "es");',
                        'document.documentElement.lang = (sv || "es");')
    text = text.replace("document.documentElement.lang = sv === 'pt' ? 'pt-BR' : (sv || 'es');",
                        "document.documentElement.lang = (sv || 'es');")
    return text


def run(root: Path) -> dict:
    if not root.is_dir() or root.is_symlink():
        raise ValueError('La raíz pública debe ser un directorio real: ' + str(root))
    changed = []
    removed_json_keys = 0
    for path in sorted(p for p in root.rglob('*') if p.is_file()):
        rel = path.relative_to(root).as_posix()
        if rel == '_redirects':
            continue
        if path.suffix.lower() == '.json':
            try:
                original = json.loads(path.read_text(encoding='utf-8'))
            except (UnicodeDecodeError, json.JSONDecodeError):
                continue
            before_keys = sum(1 for _ in _walk_pt_keys(original))
            cleaned = clean_json_value(original)
            after_keys = sum(1 for _ in _walk_pt_keys(cleaned))
            removed_json_keys += before_keys - after_keys
            if cleaned != original:
                path.write_text(json.dumps(cleaned, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
                changed.append(rel)
            continue
        if path.suffix.lower() not in {'.html', '.js', '.css', '.xml', '.txt'}:
            continue
        try:
            old = path.read_text(encoding='utf-8')
        except UnicodeDecodeError:
            continue
        new = clean_text(old)
        if new != old:
            path.write_text(new, encoding='utf-8')
            changed.append(rel)
    report = {'changed_files': len(changed), 'removed_json_language_keys': removed_json_keys, 'files': changed}
    print(json.dumps(report, ensure_ascii=False))
    return report


def _walk_pt_keys(value):
    if isinstance(value, dict):
        for key, item in value.items():
            if str(key).lower().replace('_', '-') in {'pt', 'pt-br'}:
                yield key
            yield from _walk_pt_keys(item)
    elif isinstance(value, list):
        for item in value:
            yield from _walk_pt_keys(item)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=Path, default=Path('dist'))
    run(parser.parse_args().root)
