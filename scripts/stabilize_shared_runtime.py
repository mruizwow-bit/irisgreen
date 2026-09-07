#!/usr/bin/env python3
"""Estabiliza dos regresiones compartidas sin rediseñar los componentes.

1) Las páginas dinámicas dejan de compartir `ig_lang`: cada ruta recuerda solo su
   propia selección explícita. La ruta y el contenido de otra sección ya no cambian.
2) La Home recupera el bloque de Música que tenía en la referencia estable; el
   iframe se crea únicamente al abrir el panel, como antes.
"""
from __future__ import annotations
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HOME = ROOT / 'index.html'

HOME_MUSIC = '''
  <sc-if value="{{ musicOpen }}" hint-placeholder-val="{{ false }}">
    <div style="position: fixed; right: 20px; bottom: 20px; z-index: 61; width: 360px; max-width: calc(100vw - 40px); background: rgba(255,255,255,0.96); backdrop-filter: blur(20px); border: 1px solid rgba(23,57,92,0.14); border-radius: 20px; padding: 16px; box-shadow: 0 30px 60px -30px rgba(23,57,92,0.5);">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
        <svg width="17" height="17" sc-camel-view-box="0 0 24 24" fill="none" stroke="#5a49a8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V6.5l10-2V16"></path><circle cx="6.5" cy="18" r="2.5"></circle><circle cx="16.5" cy="16" r="2.5"></circle></svg>
        <strong style="font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase;">{{ tPlaylist }}</strong>
        <button sc-camel-on-click="{{ toggleMusic }}" aria-label="Cerrar la playlist" style="margin-left: auto; background: rgba(23,57,92,0.07); border: 0; border-radius: 999px; width: 28px; height: 28px; cursor: pointer;">×</button>
      </div>
      <iframe src="https://open.spotify.com/embed/playlist/1HyAiLbZcP9mUxetb8lF72?utm_source=generator" title="Playlist de Iris Green" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" style="width: 100%; height: 420px; border: 0; border-radius: 14px;"></iframe>
    </div>
  </sc-if>
'''

GET_GLOBAL = re.compile(r'localStorage\.getItem\(\s*(["\'])ig_lang\1\s*\)')
SET_GLOBAL = re.compile(r'localStorage\.setItem\(\s*(["\'])ig_lang\1\s*,')
REMOVE_GLOBAL = re.compile(r'localStorage\.removeItem\(\s*(["\'])ig_lang\1\s*\)')


def pages():
    out = []
    for lang in ('es', 'en'):
        root = ROOT / lang
        if root.is_dir():
            out.extend(sorted(root.rglob('*.html')))
    return out


def scope_language(text: str):
    changes = 0
    text, n = GET_GLOBAL.subn('localStorage.getItem("ig_page_lang:"+location.pathname)', text); changes += n
    text, n = SET_GLOBAL.subn('localStorage.setItem("ig_page_lang:"+location.pathname,', text); changes += n
    text, n = REMOVE_GLOBAL.subn('localStorage.removeItem("ig_page_lang:"+location.pathname)', text); changes += n
    return text, changes


def run():
    changed_pages = 0
    scoped_calls = 0
    for path in pages():
        old = path.read_text(encoding='utf-8')
        text, n = scope_language(old)
        scoped_calls += n
        if GET_GLOBAL.search(text) or SET_GLOBAL.search(text) or REMOVE_GLOBAL.search(text):
            raise SystemExit('Queda una preferencia global de idioma en ' + path.relative_to(ROOT).as_posix())
        if text != old:
            path.write_text(text, encoding='utf-8')
            changed_pages += 1

    old = HOME.read_text(encoding='utf-8')
    home = old
    restored = False
    marker = '<sc-if value="{{ musicOpen }}"'
    if marker not in home:
        anchor = '<sc-if value="{{ a11yOpen }}"'
        if anchor not in home:
            raise SystemExit('No se encuentra el ancla del panel de Lectura en la Home')
        home = home.replace(anchor, HOME_MUSIC + '  ' + anchor, 1)
        restored = True
    if 'open.spotify.com/embed/playlist/1HyAiLbZcP9mUxetb8lF72' not in home:
        raise SystemExit('La Home no contiene el reproductor estable de Música')
    if home != old:
        HOME.write_text(home, encoding='utf-8')

    report = {
        'page_language_calls_scoped': scoped_calls,
        'pages_changed_for_language': changed_pages,
        'home_music_restored': restored,
        'home_music_lazy': 'loading="lazy"' in home,
    }
    out = ROOT / 'reports' / 'routes'; out.mkdir(parents=True, exist_ok=True)
    (out / 'shared-runtime-stabilized.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False, separators=(',', ':')))
    return report


if __name__ == '__main__':
    run()
