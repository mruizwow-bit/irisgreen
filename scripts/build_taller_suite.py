#!/usr/bin/env python3
"""Genera las páginas ES/EN de la suite creativa del Taller (R43) desde una sola fuente.

Cada estudio vive en scripts/taller_suite/<estudio>.py con sus textos en los dos idiomas.
Las páginas usan el app shell común R42 (A3) y el núcleo IGSuite; no cargan la capa
antigua de estudios. Uso: python3 scripts/build_taller_suite.py
"""
from __future__ import annotations

import html
import importlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from build_taller_estudios import HEADER, FOOTER  # noqa: E402
from taller_suite import comun, hub  # noqa: E402

SUITE = ['estructuras', 'programacion', 'robotica', 'ritmo', 'composicion', 'sintesis', 'videojuegos', 'modelado', 'videomapping', 'arquitectura', 'pixelart', 'comic', 'diseno']
STUDIOS = [importlib.import_module('taller_suite.' + n) for n in SUITE]
BASE = {'es': '/es/taller/', 'en': '/en/workshop/'}
SITE = 'https://irisgreen.eu'
ASSET_V = 'r43-1'
MATERIALS_CSS = '/assets/ig-r42-materials.css?v=r42-design-1'
SHELL_CSS = '/assets/ig-r42-shell.css?v=r42-design-1'
SHELL_JS = '/assets/ig-r42-shell.js?v=r42-a3-1'


def e(s: str) -> str:
    return html.escape(str(s), quote=True)


def para(text: str) -> str:
    return ''.join(f'<p>{e(p)}</p>' for p in str(text).split('\n\n') if p.strip())


def page(mod, lang: str) -> str:
    c = mod.PAGE[lang]
    t = comun.T[lang]
    other_lang = 'en' if lang == 'es' else 'es'
    url = BASE[lang] + mod.SLUG[lang] + '/'
    other = BASE[other_lang] + mod.SLUG[other_lang] + '/'
    strings = dict(mod.STRINGS[lang])
    strings['canvasRole'] = t['canvasRole']
    data = json.dumps(strings, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    make = ''.join(f'<li>{e(x)}</li>' for x in c['make'])
    steps = ''.join(f'<li>{e(x)}</li>' for x in c['steps'])
    links = ''.join(f'<li><a href="{e(u)}">{e(x)}</a></li>' for x, u in c['links'])
    sections = ''.join(
        f'<section class="igt-sec igs-sec" aria-labelledby="igs-x{i}"><h2 id="igs-x{i}">{e(s["h"])}</h2>{para(s["p"])}</section>'
        for i, s in enumerate(c.get('sections', []))
    )
    libs = mod.LIBRARIES if lang == 'es' else mod.LIBRARIES_EN
    mode_attr = f' data-igs-mode="{mod.MODE}"' if getattr(mod, 'MODE', None) else ''
    lic = f'<a href="/assets/vendor/taller/LICENCIAS.txt">{e(t["licencesLink"])}</a>'
    libs_text = e(t['librariesText']).replace('{licences}', e(libs) + ' · ' + lic)
    scripts = ''.join(f'<script defer src="/assets/{s}?v={ASSET_V}"></script>' for s in ['ig-suite-core.js'] + mod.SCRIPTS)
    head = (
        f'<!DOCTYPE html><html lang="{lang}"><head><script src="/assets/preferencias-lectura.js"></script>'
        '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        f'<title>{e(c["title"])} · {e(t["workshop"])} | Iris Green</title><meta name="description" content="{e(c["description"])}">'
        '<meta name="theme-color" content="#f6f8fb"><meta name="robots" content="index,follow">'
        f'<link rel="canonical" href="{SITE}{url}"><link rel="alternate" hreflang="{lang}" href="{SITE}{url}">'
        f'<link rel="alternate" hreflang="{other_lang}" href="{SITE}{other}">'
        f'<link rel="alternate" hreflang="x-default" href="{SITE}{BASE["es"]}{mod.SLUG["es"]}/">'
        f'<meta property="og:type" content="website"><meta property="og:site_name" content="Iris Green"><meta property="og:title" content="{e(c["title"])}">'
        f'<meta property="og:description" content="{e(c["description"])}"><meta property="og:url" content="{SITE}{url}">'
        '<meta property="og:image" content="https://irisgreen.eu/img/og-condiciones.png">'
        '<link href="/assets/site-v23.css" rel="stylesheet"><link rel="stylesheet" href="/assets/ajustes-interfaz.css"/>'
        '<link rel="stylesheet" href="/assets/controles-comunes.css"/><link rel="stylesheet" href="/assets/preferencias-lectura.css">'
        f'<link rel="stylesheet" href="{MATERIALS_CSS}"><link rel="stylesheet" href="{SHELL_CSS}"><link rel="stylesheet" href="/assets/ig-suite.css?v={ASSET_V}">'
        '</head>'
    )
    body = (
        f'<body data-ig-r42-pilot="true" data-ig-r42-family="workshop" data-ig-materials="r42" data-ig-suite="{mod.ENGINE}">' + HEADER[lang].replace('{other}', other)
        + f'<main id="main" class="igx igt igs-page" data-lang="{lang}">'
        + f'<section class="igt-hero igs-hero" aria-labelledby="igt-title"><p class="crumb"><a href="{BASE[lang]}">{e(t["workshop"])}</a></p>'
        + f'<h1 id="igt-title">{e(c["title"])}</h1><p class="lede">{e(c["lede"])}</p>'
        + f'<h2 class="igs-make-title">{e(t["whatYouMake"])}</h2><ul class="igs-make">{make}</ul></section>'
        + f'<section class="igt-sec igs-sec" aria-labelledby="igt-how"><h2 id="igt-how">{e(t["howTitle"])}</h2><ol class="igs-steps">{steps}</ol></section>'
        + f'<div id="igt-app" class="igt-app" data-igs-engine="{mod.ENGINE}"{mode_attr}><div class="igt-nojs"><p>{e(t["noJs"])}</p></div></div>'
        + sections
        + f'<section class="igt-sec igs-sec" aria-labelledby="igs-files"><h2 id="igs-files">{e(t["filesTitle"])}</h2>{para(t["filesText"])}</section>'
        + f'<section class="igt-sec igs-sec" aria-labelledby="igs-libs"><h2 id="igs-libs">{e(t["librariesTitle"])}</h2><p>{libs_text}</p></section>'
        + f'<nav class="igt-sec igs-sec" aria-labelledby="igs-links"><h2 id="igs-links">{e(t["linksTitle"])}</h2><ul>{links}</ul></nav>'
        + '</main>' + FOOTER[lang].replace('{credits}', '')
        + '<div hidden id="rguide"></div>'
        + f'<script type="application/json" id="igs-i18n">{data}</script>'
        + '<script src="/assets/lectura-accesible.js"></script><script defer src="/assets/interfaz-comun.js"></script><script defer src="/assets/musica.js"></script>'
        + f'<script defer src="{SHELL_JS}"></script>'
        + scripts + '</body></html>\n'
    )
    return head + body


def main() -> None:
    written = []
    for mod in STUDIOS:
        for lang in ('es', 'en'):
            out = ROOT / BASE[lang].strip('/') / mod.SLUG[lang] / 'index.html'
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(page(mod, lang), encoding='utf-8')
            written.append(out.relative_to(ROOT).as_posix())
    hub.main()
    written += ['es/taller/index.html', 'en/workshop/index.html']
    print('\n'.join(written))


if __name__ == '__main__':
    main()