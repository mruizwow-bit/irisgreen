#!/usr/bin/env python3
"""Genera las páginas de los estudios del Taller en español e inglés desde una sola fuente.

Uso: python3 scripts/build_taller_estudios.py
Escribe es/taller/<estudio>/index.html y en/workshop/<estudio>/index.html.
Los textos de ambos idiomas viven juntos en scripts/taller_estudios/*.py para que
ninguna página quede monolingüe y los dos idiomas describan el mismo comportamiento.
"""
from __future__ import annotations

import html
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))

import importlib  # noqa: E402

from taller_estudios import comun  # noqa: E402

STUDIO_NAMES = ['dibujo', 'estructuras', 'programacion', 'robotica', 'ideas', 'circuitos', 'maquinas', 'diseno']
STUDIOS = [importlib.import_module('taller_estudios.' + n) for n in STUDIO_NAMES
           if (Path(__file__).resolve().parent / 'taller_estudios' / (n + '.py')).exists()]
BASE = {'es': '/es/taller/', 'en': '/en/workshop/'}
SITE = 'https://irisgreen.eu'
ASSET_V = 'taller-f4-20260924'

HEADER = {
    'es': (
        '<a class="skip" href="#main">Ir al contenido</a><header class="hd"><a class="brand" href="/"><img alt="" height="28" src="/img/v40-brand-symbol.webp" width="28"><span>Iris Green</span></a>'
        '<button aria-controls="nav" aria-expanded="false" class="ico menu" id="mBtn"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"></path></svg><span>Menú</span></button>'
        '<button type="button" class="ig-menu-button" aria-label="Abrir menú" aria-controls="ig-main-nav" aria-expanded="false">Menú</button>'
        '<nav aria-label="Explorar" class="nav" id="ig-main-nav"><a href="/">Inicio</a><a href="/es/neurodiversidad/condiciones/">Condiciones</a><a href="/es/situaciones/">Situaciones</a><a href="/es/biblioteca/">Vida diaria</a><a href="/es/videos/">Vídeos</a><a href="/es/investigacion/">Investigación</a><a href="/es/datos/">Datos</a><a href="/es/tramites/directorio/">Ayudas</a><a href="/es/libros/">Libros</a><a href="/es/recursos/juegos/">Jugar</a><span aria-hidden="true" class="sep"></span><a class="calma ig-calma" href="/es/intereses/">Tus intereses</a><a class="calma ig-calma" href="/es/taller/" aria-current="page">El taller</a><a class="calma ig-calma" href="/es/sitio-tranquilo/">Rincón tranquilo</a></nav>'
        '<div class="tools"><button aria-controls="a11y" aria-expanded="false" class="ico" id="a11yBtn" aria-label="Lectura accesible"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="4.5" r="2"></circle><path d="M4 8.5h16M12 10.5v11M12 15h-4l-2 6M12 15h4l2 6"></path></svg><span>Lectura</span></button>'
        '<button aria-controls="pl" aria-expanded="false" class="ico" id="plBtn" aria-label="Música"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M9 18V6l11-2v12"></path><circle cx="6" cy="18" r="3"></circle><circle cx="17" cy="16" r="3"></circle></svg><span>Música</span></button></div>'
        '<nav aria-label="Idioma" class="langs"><span aria-current="true" class="lang on">ES</span><a class="lang" href="{other}" lang="en" hreflang="en">EN</a></nav></header>'
        '<div class="panel" hidden id="pl"></div><div class="panel a11yp" hidden id="a11y"><h2>Lectura accesible</h2><div class="ctrls"><div class="grp"><span>Tamaño del texto</span><button data-a="fs-">A−</button><button data-a="fs+">A+</button></div><button data-a="ls">Letra más separada</button><button data-a="big">Botones más grandes</button><button data-a="hc">Más contraste</button><button data-a="guide">Guía de lectura</button><button data-a="tts">Leer en voz alta</button><button data-a="rm">Reducir movimiento</button><button class="reset" data-a="reset">Restablecer</button></div></div>'
    ),
    'en': (
        '<a class="skip" href="#main">Skip to content</a><header class="hd"><a class="brand" href="/"><img alt="" height="28" src="/img/v40-brand-symbol.webp" width="28"><span>Iris Green</span></a>'
        '<button aria-controls="nav" aria-expanded="false" class="ico menu" id="mBtn"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"></path></svg><span>Menu</span></button>'
        '<button type="button" class="ig-menu-button" aria-label="Open menu" aria-controls="ig-main-nav" aria-expanded="false">Menu</button>'
        '<nav aria-label="Explore" class="nav" id="ig-main-nav"><a href="/">Home</a><a href="/en/neurodiversity/conditions/">Conditions</a><a href="/en/situations/">Situations</a><a href="/en/everyday-life/">Everyday life</a><a href="/es/videos/">Videos</a><a href="/es/investigacion/">Research</a><a href="/en/data/">Data</a><a href="/es/tramites/directorio/">Support</a><a href="/es/libros/">Books</a><a href="/es/recursos/juegos/">Play</a><span aria-hidden="true" class="sep"></span><a class="calma ig-calma" href="/en/interests/">Your interests</a><a class="calma ig-calma" href="/en/workshop/" aria-current="page">The workshop</a><a class="calma ig-calma" href="/en/quiet-space/">Quiet space</a></nav>'
        '<div class="tools"><button aria-controls="a11y" aria-expanded="false" class="ico" id="a11yBtn" aria-label="Accessible reading"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="4.5" r="2"></circle><path d="M4 8.5h16M12 10.5v11M12 15h-4l-2 6M12 15h4l2 6"></path></svg><span>Reading</span></button>'
        '<button aria-controls="pl" aria-expanded="false" class="ico" id="plBtn" aria-label="Music"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M9 18V6l11-2v12"></path><circle cx="6" cy="18" r="3"></circle><circle cx="17" cy="16" r="3"></circle></svg><span>Music</span></button></div>'
        '<nav aria-label="Language" class="langs"><a class="lang" href="{other}" lang="es" hreflang="es">ES</a><span aria-current="true" class="lang on">EN</span></nav></header>'
        '<div class="panel" hidden id="pl"></div><div class="panel a11yp" hidden id="a11y"><h2>Accessible reading</h2><div class="ctrls"><div class="grp"><span>Text size</span><button data-a="fs-">A−</button><button data-a="fs+">A+</button></div><button data-a="ls">Wider letter spacing</button><button data-a="big">Bigger buttons</button><button data-a="hc">More contrast</button><button data-a="guide">Reading guide</button><button data-a="tts">Read aloud</button><button data-a="rm">Reduce motion</button><button class="reset" data-a="reset">Reset</button></div></div>'
    ),
}
FOOTER = {
    'es': '<footer class="ft"><p><strong>Iris Green</strong> · Base de conocimiento sobre neurodiversidad</p><nav aria-label="Explorar" class="ftnav"><a href="/es/sobre-iris-green/">Sobre Iris Green</a><a href="/es/lectura-accesible/">Accesibilidad</a><a href="/es/privacidad/">Privacidad</a></nav>{credits}</footer>',
    'en': '<footer class="ft"><p><strong>Iris Green</strong> · A knowledge base on neurodiversity</p><nav aria-label="Explore" class="ftnav"><a href="/es/sobre-iris-green/">About Iris Green</a><a href="/es/lectura-accesible/">Accessibility</a><a href="/en/privacy/">Privacy</a></nav>{credits}</footer>',
}


def e(s: str) -> str:
    return html.escape(str(s), quote=True)


def para(text: str) -> str:
    return ''.join(f'<p>{e(p)}</p>' for p in str(text).split('\n\n') if p.strip())


def challenge_items(mod, lang: str) -> list[dict]:
    out = []
    for c in mod.CHALLENGES:
        item = {k: v for k, v in c.items() if k not in ('es', 'en')}
        item.update(c[lang])
        item['levelName'] = mod.LEVELS[c['level']][lang]
        out.append(item)
    return out


def static_challenges(mod, lang: str) -> str:
    items = challenge_items(mod, lang)
    t = comun.T[lang]
    parts = [f'<section class="igt-sec" aria-labelledby="igt-static-retos"><h2 id="igt-static-retos">{e(t["challengesTitle"])}</h2><p class="igt-note">{e(t["challengesNoteStatic"])}</p><div class="igt-list-static">']
    for lv in sorted(mod.LEVELS):
        group = [c for c in items if c['level'] == lv]
        if not group:
            continue
        parts.append(f'<div><h3>{e(t["levelN"].replace("{n}", str(lv)))} · {e(mod.LEVELS[lv][lang])}</h3><ol>')
        for c in group:
            parts.append(f'<li><strong>{e(c["title"])}.</strong> {e(c["goal"])}</li>')
        parts.append('</ol></div>')
    parts.append('</div></section>')
    return ''.join(parts)


def page(mod, lang: str) -> str:
    c = mod.PAGE[lang]
    other_lang = 'en' if lang == 'es' else 'es'
    slug = mod.SLUG[lang]
    url = BASE[lang] + slug + '/'
    other = BASE[other_lang] + mod.SLUG[other_lang] + '/'
    t = comun.T[lang]
    strings = dict(comun.T[lang])
    strings.update(mod.STRINGS[lang])
    strings['challenges'] = challenge_items(mod, lang)
    data = json.dumps(strings, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    pills = ''.join(f'<li>{e(p)}</li>' for p in c['pills'])
    steps = ''.join(f'<li>{e(s)}</li>' for s in c['steps'])
    links = ''.join(f'<li><a href="{e(h)}">{e(txt)}</a></li>' for txt, h in c['links'])
    extra = ''.join(
        f'<section class="igt-sec glass" aria-labelledby="igt-x{i}"><h2 id="igt-x{i}">{e(sec["h"])}</h2>{para(sec["p"])}'
        + (('<ul class="igt-src">' + ''.join(f'<li>{e(li)}</li>' for li in sec['li']) + '</ul>') if sec.get('li') else '')
        + '</section>'
        for i, sec in enumerate(c.get('sections', []))
    )
    credits = f'<p class="privacy">{e(c["credits"])}</p>' if c.get('credits') else ''
    scripts = ''.join(f'<script defer src="/assets/{s}?v={ASSET_V}"></script>' for s in ['ig-taller-estudio.js'] + mod.SCRIPTS)
    head = f'''<!DOCTYPE html><html lang="{lang}"><head><script src="/assets/preferencias-lectura.js"></script><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(c["title"])} · {e(t["workshop"])} | Iris Green</title><meta name="description" content="{e(c["description"])}"><meta name="theme-color" content="#f6f8fb"><meta name="robots" content="index,follow"><link rel="canonical" href="{SITE}{url}"><link rel="alternate" hreflang="{lang}" href="{SITE}{url}"><link rel="alternate" hreflang="{other_lang}" href="{SITE}{other}"><link rel="alternate" hreflang="x-default" href="{SITE}{BASE['es']}{mod.SLUG['es']}/"><meta property="og:type" content="website"><meta property="og:site_name" content="Iris Green"><meta property="og:title" content="{e(c["title"])}"><meta property="og:description" content="{e(c["description"])}"><meta property="og:url" content="{SITE}{url}"><meta property="og:image" content="https://irisgreen.eu/img/og-condiciones.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" crossorigin href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&amp;family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&amp;display=swap" rel="stylesheet"><link href="/assets/site-v23.css" rel="stylesheet"><link rel="stylesheet" href="/assets/ajustes-interfaz.css"/><link rel="stylesheet" href="/assets/controles-comunes.css"/><link rel="stylesheet" href="/assets/preferencias-lectura.css"><link rel="stylesheet" href="/assets/ig-taller-estudio.css?v={ASSET_V}">{''.join(f'<link rel="stylesheet" href="/assets/{css}?v={ASSET_V}">' for css in getattr(mod, 'EXTRA_CSS', []))}</head>'''
    body = (
        '<body>' + HEADER[lang].replace('{other}', other)
        + f'<main id="main" class="igx igt" data-lang="{lang}">'
        + f'<section class="igt-hero glass" aria-labelledby="igt-title"><p class="crumb"><a href="{BASE[lang]}">{e(t["workshop"])}</a> · {e(t["studioN"].replace("{n}", str(mod.NUMBER)))}</p>'
        + f'<h1 id="igt-title">{e(c["title"])}</h1><p class="lede">{e(c["lede"])}</p><ul class="igt-pills" aria-label="{e(t["whatYouGet"])}">{pills}</ul></section>'
        + f'<section class="igt-sec glass" aria-labelledby="igt-how"><h2 id="igt-how">{e(t["howTitle"])}</h2><ol class="igt-steps">{steps}</ol></section>'
        + f'<div id="igt-app" class="igt-app" data-studio="{mod.KEY}"><div class="igt-nojs"><p>{e(t["noJs"])}</p>{static_challenges(mod, lang)}</div></div>'
        + (mod.extra_body(lang) if hasattr(mod, 'extra_body') else '')
        + extra
        + f'<section class="igt-sec glass" aria-labelledby="igt-files"><h2 id="igt-files">{e(t["filesTitle"])}</h2>{para(t["filesText"])}</section>'
        + f'<nav class="igt-sec glass" aria-labelledby="igt-links"><h2 id="igt-links">{e(t["linksTitle"])}</h2><ul class="igt-src">{links}</ul></nav>'
        + '<p id="igt-status" class="igt-status" role="status" aria-live="polite"></p>'
        + '</main>' + FOOTER[lang].replace('{credits}', credits)
        + '<div hidden id="rguide"></div>'
        + f'<script type="application/json" id="igt-i18n">{data}</script>'
        + '<script src="/assets/lectura-accesible.js"></script><script defer src="/assets/interfaz-comun.js"></script><script defer src="/assets/musica.js"></script>'
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
    print('\n'.join(written))


if __name__ == '__main__':
    main()
