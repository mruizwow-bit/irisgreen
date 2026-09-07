#!/usr/bin/env python3
"""Retira los controles PT-BR del HTML público ES/EN antes de copiar a dist.
Las rutas antiguas portuguesas siguen gestionándose en repair_routes.py; aquí no se
traducen ni se alteran contenidos, solo se elimina la interfaz retirada.
"""
from __future__ import annotations
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
# Guardia de build: si queda un control PT-BR visible en ES/EN, no se publica.

PT_CONTROL = re.compile(
    r'<(?P<tag>a|button|span)\b'
    r'(?=[^>]*(?:\blang\s*=\s*["\']pt(?:-br)?["\']|'
    r'\bclass\s*=\s*["\'][^"\']*\big-nav-pt\b[^"\']*["\']))'
    r'[^>]*>.*?</(?P=tag)>\s*',
    re.I | re.S,
)
PT_CONTROL_LEFT = re.compile(
    r'<(?:a|button|span)\b[^>]*(?:\blang\s*=\s*["\']pt(?:-br)?["\']|'
    r'\bclass\s*=\s*["\'][^"\']*\big-nav-pt\b)',
    re.I | re.S,
)


def pages():
    out = [ROOT / 'index.html']
    for lang in ('es', 'en'):
        root = ROOT / lang
        if root.is_dir():
            out.extend(sorted(root.rglob('*.html')))
    return [p for p in out if p.is_file()]


def run():
    changed = 0
    removed = 0
    home_key_changes = 0
    for path in pages():
        old = path.read_text(encoding='utf-8')
        text, n = PT_CONTROL.subn('', old)
        removed += n

        # La Home puede cambiar de idioma dentro de la misma URL, pero su elección
        # no debe alterar ninguna página /es/ o /en/. Se guarda en una clave propia.
        if path == ROOT / 'index.html':
            text, n1 = re.subn(r'(["\'])ig_lang\1', lambda m: m.group(1) + 'ig_home_lang' + m.group(1), text)
            home_key_changes += n1

        if PT_CONTROL_LEFT.search(text):
            raise SystemExit('Queda un control PT-BR en ' + path.relative_to(ROOT).as_posix())
        if text != old:
            path.write_text(text, encoding='utf-8')
            changed += 1

    report = {
        'changed_html': changed,
        'pt_controls_removed': removed,
        'home_language_key_changes': home_key_changes,
        'public_languages': ['es', 'en'],
    }
    out = ROOT / 'reports' / 'routes'
    out.mkdir(parents=True, exist_ok=True)
    (out / 'retired-portuguese-ui.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False, separators=(',', ':')))
    return report


if __name__ == '__main__':
    run()
