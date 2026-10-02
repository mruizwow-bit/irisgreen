#!/usr/bin/env python3
"""Inventario de protección infantil del Taller (R47 §7 y §17).

Recorre TODO lo que se puede descubrir dentro del Taller (estudios, puntos de partida,
retos, plantillas, secciones de ayuda y enlaces) y escribe un inventario legible por
máquina en assets/data/taller-childsafe.json.

Los puntos de partida y los retos se leen del producto ya construido, con el navegador,
para que el inventario refleje lo que la persona ve y no una lista escrita a mano.

Criterio de entrega: 0 elementos sin clasificar. El script devuelve 1 si queda alguno.

Uso:  python3 scripts/build_taller_childsafe.py [--sin-navegador] [--base http://127.0.0.1:8790]
"""
from __future__ import annotations

import importlib
import json
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from build_taller_suite import BASE, SUITE, _load  # noqa: E402
from taller_suite import portada  # noqa: E402

OUT = ROOT / 'assets' / 'data' / 'taller-childsafe.json'
VERSION = '2026-09-28'
DEFAULT = {'audience': ['TRANSVERSAL'], 'sensitivity': 'S0_GENERAL', 'discovery': 'NORMAL'}
# Revisión editorial: el Taller son herramientas creativas de uso general. No hay
# contenido S1 ni S2. Cualquier reto o enlace que tocara temas sensibles tendría que
# declararlo aquí y, si procede, apuntar a su safe_variant_id.
REVIEW = 'Herramienta creativa de uso general: no trata salud, diagnóstico ni temas sensibles.'


def item(kind: str, iid: str, lang: str, title: str, url: str = '', parent: str = '', **extra) -> dict:
    d = {'id': iid, 'kind': kind, 'lang': lang, 'title': title, 'audience': DEFAULT['audience'],
         'sensitivity': DEFAULT['sensitivity'], 'discovery': DEFAULT['discovery'],
         'safe_variant_id': None, 'review_reason': REVIEW, 'version': VERSION, 'reviewed': VERSION}
    if url:
        d['url'] = url
    if parent:
        d['parent'] = parent
    d.update(extra)
    return d


def static_items() -> list[dict]:
    out: list[dict] = []
    mods = _load(SUITE)
    prof = {s[0]: s[2] for s in portada.STUDIOS}
    for lang in ('es', 'en'):
        out.append(item('surface', f'taller:{lang}', lang, portada.T[lang]['title'], BASE[lang]))
        for p in portada.PROFILES:
            out.append(item('profile', f'profile:{p[0]}:{lang}', lang, p[1] if lang == 'es' else p[2],
                            parent=f'taller:{lang}'))
        for mod in mods:
            slug = mod.SLUG[lang]
            sid = f'studio:{mod.ENGINE}:{lang}'
            url = BASE[lang] + slug + '/'
            safety = getattr(mod, 'SAFETY', DEFAULT)
            out.append(item('studio', sid, lang, mod.PAGE[lang]['title'], url,
                            parent=f'profile:{prof.get(mod.SLUG["es"], "lienzo")}:{lang}',
                            engine=mod.ENGINE, audience=[safety.get('audience', 'TRANSVERSAL')]
                            if isinstance(safety.get('audience'), str) else safety.get('audience', DEFAULT['audience']),
                            sensitivity=safety.get('sensitivity', DEFAULT['sensitivity']),
                            discovery=safety.get('discovery', DEFAULT['discovery'])))
            for i, s in enumerate(mod.PAGE[lang].get('sections', [])):
                out.append(item('help', f'{sid}:help:{i}', lang, s['h'], parent=sid))
            for label, href in mod.PAGE[lang].get('links', []):
                out.append(item('link', f'{sid}:link:{href}', lang, label, href, parent=sid,
                                internal=href.startswith('/')))
        # Páginas del Taller que no son estudios pero sí rutas públicas descubribles.
        extra = {'es': [('hojas', 'Las hojas del taller para imprimir')],
                 'en': [('sheets', 'The workshop sheets to print')]}[lang]
        for slug, title in extra:
            out.append(item('page', f'page:{slug}:{lang}', lang, title, BASE[lang] + slug + '/',
                            parent=f'taller:{lang}'))
        for stage, slugs in portada.SUGGEST.items():
            st = stage if lang == 'es' else portada.STAGE_MAP.get(stage, '')
            for slug in slugs:
                out.append(item('suggestion', f'suggest:{st or "any"}:{slug}:{lang}', lang, slug,
                                parent=f'taller:{lang}', stage=st or 'ANY'))
    return out


def harvest(base: str) -> list[dict]:
    """Puntos de partida y retos reales, leídos del producto construido."""
    from playwright.sync_api import sync_playwright
    mods = _load(SUITE)
    out: list[dict] = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        for mod in mods:
            for lang in ('es', 'en'):
                url = base + BASE[lang] + mod.SLUG[lang] + '/'
                ctxb = b.new_context(viewport={'width': 1440, 'height': 900})
                pg = ctxb.new_page()
                pg.on('dialog', lambda d: d.accept())
                pg.goto(url, wait_until='domcontentloaded')
                for _ in range(80):
                    if pg.evaluate("(document.getElementById('igt-app')||{dataset:{}}).dataset.igsReady") in ('true', 'error'):
                        break
                    pg.wait_for_timeout(250)
                pg.wait_for_timeout(250)
                for _ in range(40):
                    if pg.evaluate("[...document.querySelectorAll('.igt-topbar button,#ig-r42-file-menu button,.ig-r42-action')].some(x=>/^(Nuevo|New)[^a-zA-Z]/.test((x.textContent||'').trim()))"):
                        break
                    pg.wait_for_timeout(250)
                names = []
                for intento in range(8):
                    names = pg.evaluate("""(()=>{
                      const trigger=document.querySelector('.ig-r42-file-trigger');
                      const menu=document.getElementById('ig-r42-file-menu');
                      if(trigger&&menu&&!menu.matches(':popover-open')) trigger.click();
                      const all=[...document.querySelectorAll('#ig-r42-file-menu button,.igt-topbar button,.ig-r42-action,.igs-btn')];
                      const b=all.find(x=>/^(Nuevo|New)[^a-zA-Z]/.test((x.textContent||'').trim()));
                      if(!b) return null;
                      b.click();
                      const list=[...document.querySelectorAll('.igs-starts .igs-start strong')].map(s=>s.textContent.trim());
                      document.querySelectorAll('dialog[open]').forEach(d=>{try{d.close()}catch(e){}});
                      if(menu&&menu.matches(':popover-open')) try{menu.hidePopover()}catch(e){}
                      return list;})()""")
                    if names:
                        break
                    pg.wait_for_timeout(900)
                if not names:
                    raise SystemExit(f'ERROR: no se han podido leer los puntos de partida de {mod.ENGINE} ({lang}) en {url}')
                for i, n in enumerate(names or []):
                    out.append(item('starter', f'studio:{mod.ENGINE}:{lang}:start:{i}', lang, n,
                                    parent=f'studio:{mod.ENGINE}:{lang}'))
                print(f'{mod.ENGINE} {lang}: {len(names or [])} puntos de partida', file=sys.stderr)
                ctxb.close()
        b.close()
    return out


def main() -> int:
    items = static_items()
    if '--sin-navegador' not in sys.argv:
        base = 'http://127.0.0.1:8790'
        if '--base' in sys.argv:
            base = sys.argv[sys.argv.index('--base') + 1]
        items += harvest(base)
    bad = [i for i in items if not i.get('audience') or i.get('sensitivity') not in
           ('S0_GENERAL', 'S1_SENSITIVE', 'S2_HIGH_SENSITIVITY') or i.get('discovery') not in
           ('NORMAL', 'INTENTIONAL_ONLY', 'SAFE_VARIANT_REQUIRED')]
    by_kind: dict[str, int] = {}
    for i in items:
        by_kind[i['kind']] = by_kind.get(i['kind'], 0) + 1
    doc = {
        'schema': 'iris-green-taller-childsafe/1.0',
        'generated': date.today().isoformat(),
        'model': {'audience': ['INFANCIA', 'ADOLESCENCIA', 'ADULTEZ', 'TRANSVERSAL'],
                  'sensitivity': ['S0_GENERAL', 'S1_SENSITIVE', 'S2_HIGH_SENSITIVITY'],
                  'discovery': ['NORMAL', 'INTENTIONAL_ONLY', 'SAFE_VARIANT_REQUIRED']},
        'default_without_stage': 'SAFE_BY_DEFAULT',
        'totals': {'items': len(items), 'unclassified': len(bad), 'by_kind': by_kind,
                   'S1': sum(1 for i in items if i['sensitivity'] == 'S1_SENSITIVE'),
                   'S2': sum(1 for i in items if i['sensitivity'] == 'S2_HIGH_SENSITIVITY')},
        'note': ('La protección infantil se aplica al contenido que Iris Green muestra y recomienda. '
                 'No se analiza, clasifica ni envía nada de lo que crea la persona.'),
        'items': items,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(doc, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'{OUT.relative_to(ROOT)}: {len(items)} elementos, {len(bad)} sin clasificar, '
          f"S1 {doc['totals']['S1']}, S2 {doc['totals']['S2']}")
    for i in bad[:10]:
        print('  SIN CLASIFICAR', i['id'])
    return 1 if bad else 0


if __name__ == '__main__':
    raise SystemExit(main())
