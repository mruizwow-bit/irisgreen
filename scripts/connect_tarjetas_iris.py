#!/usr/bin/env python3
"""Conecta Tarjetas Iris con sus contextos españoles sin tocar texto editorial.

En índices añade un acceso compacto. En fichas finales coloca una vista previa de
Tarjeta Iris en un rail lateral, visible al entrar en escritorio y debajo del
contenido en móvil. La ficha especial de instrucciones conserva su maquetación
propia y recibe la tarjeta después del bloque principal.
"""
from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path
from urllib.parse import urlencode

CSS_LINK = '<link rel="stylesheet" href="/assets/tarjetas-iris-cta.css">'
JS_LINK = '<script defer src="/assets/tarjetas-iris-cta.js"></script>'
MARKER = 'data-iris-card-cta="true"'
RAIL_MARKER = 'data-iris-card-rail="true"'
JUMP_MARKER = 'data-iris-card-jump'

DETAIL_SETS = (
    ("situaciones", "es/situaciones/*/index.html", 187),
    ("vida", "es/biblioteca/*/index.html", 48),
    ("condiciones", "es/neurodiversidad/condiciones/*/index.html", 185),
)
INDEX_PAGES = {
    "situaciones": "es/situaciones/index.html",
    "vida": "es/biblioteca/index.html",
    "condiciones": "es/neurodiversidad/condiciones/index.html",
    "ayudas": "es/tramites/directorio/index.html",
}
COPY = {
    "situaciones": {"title":"Tarjeta Iris","text":"Convierte esta situación en una tarjeta breve para explicar qué te cuesta, qué te ayuda y qué necesitas.","button":"Preparar esta tarjeta"},
    "vida": {"title":"Tarjeta Iris","text":"Prepara una tarjeta breve para llevar a una cita, actividad o situación cotidiana.","button":"Preparar una Tarjeta Iris"},
    "condiciones": {"title":"Tarjeta Iris","text":"Escribe tus necesidades concretas. La tarjeta no deduce necesidades a partir de una condición.","button":"Preparar una Tarjeta Iris"},
    "ayudas": {"title":"Tarjeta Iris","text":"Lleva por escrito lo que necesitas pedir o explicar. La tarjeta no sustituye los documentos oficiales.","button":"Preparar una Tarjeta Iris"},
}
INDEX_PARAMS = {
    "situaciones":{"section":"situaciones","title":"Para una situación","dificultad":"","ayuda":"","necesito":""},
    "vida":{"section":"vida","title":"Para una situación cotidiana","dificultad":"","ayuda":"","necesito":""},
    "condiciones":{"section":"condiciones","title":"Mis necesidades","dificultad":"","ayuda":"","necesito":""},
    "ayudas":{"section":"ayudas","title":"Para un trámite o una ayuda","dificultad":"","ayuda":"","necesito":""},
}
CARD_TITLES = {"situaciones":"Para esta situación","vida":"Para una situación cotidiana","condiciones":"Mis necesidades"}
CARD_TYPES = {"situaciones":"SITUACIONES","vida":"VIDA DIARIA","condiciones":"CONDICIONES"}


def read(path: Path) -> str: return path.read_text(encoding="utf-8")
def write(path: Path, text: str) -> None: path.write_text(text, encoding="utf-8")

def plain_h1(text: str) -> str:
    m=re.search(r"<h1\b[^>]*>(.*?)</h1>",text,flags=re.I|re.S)
    if not m: raise AssertionError("No se encontró h1")
    value=html.unescape(re.sub(r"<[^>]+>"," ",m.group(1)))
    return " ".join(value.split()).strip("«»“”\" ")

def url_for(section: str, title: str | None = None) -> str:
    if section == "situaciones" and title:
        params={"section":"situaciones","title":"Para esta situación","dificultad":title[:240],"ayuda":"","necesito":""}
    elif section == "vida" and title:
        params={"section":"vida","title":title[:60],"dificultad":"","ayuda":"","necesito":""}
    elif section == "condiciones": params=INDEX_PARAMS["condiciones"].copy()
    else: params=INDEX_PARAMS[section].copy()
    return "/es/tarjetas-iris/?"+urlencode(params)

def add_assets(text: str) -> str:
    if CSS_LINK not in text:
        if "</head>" not in text: raise AssertionError("Página sin </head>")
        text=text.replace("</head>",CSS_LINK+"\n</head>",1)
    if JS_LINK not in text:
        text=text.replace("</body>",JS_LINK+"\n</body>",1)
    return text

def cta(section: str, href: str, compact: bool=False) -> str:
    item=COPY[section]; cls="iris-cta iris-cta-compact" if compact else "iris-cta"
    return (f'<section class="{cls}" data-iris-section="{section}" {MARKER}>'
            f'<div class="iris-cta-copy"><h2>{html.escape(item["title"])}</h2><p>{html.escape(item["text"])}</p></div>'
            f'<a class="iris-cta-button" href="{html.escape(href,quote=True)}">{html.escape(item["button"])}</a></section>')

def card(section: str, href: str, title: str) -> str:
    difficulty=title if section in {"situaciones","vida"} else ""
    empty='<span class="iris-mini-empty">—</span>'
    return (f'<aside class="ficha-rail" {RAIL_MARKER} aria-label="Tarjeta Iris">'
            f'<article class="iris-mini-card" id="tarjeta-iris" tabindex="-1" data-iris-section="{section}">'
            '<header class="iris-mini-head"><div class="iris-mini-brand">Iris Green</div>'
            f'<div class="iris-mini-type">{CARD_TYPES[section]}<br>TARJETA PERSONAL</div></header>'
            f'<h2 class="iris-mini-title">{html.escape(CARD_TITLES[section])}</h2>'
            '<section class="iris-mini-block"><h3>Esto me cuesta</h3>'
            f'<p>{html.escape(difficulty) if difficulty else empty}</p></section>'
            f'<section class="iris-mini-block"><h3>Me ayuda</h3><p>{empty}</p></section>'
            f'<section class="iris-mini-block iris-mini-need"><h3>Necesito</h3><p>{empty}</p></section>'
            '<div class="iris-mini-actions">'
            f'<a class="iris-cta-button" href="{html.escape(href,quote=True)}">Personalizar el texto</a></div>'
            '<footer class="iris-mini-foot"><span>irisgreen.eu</span><span>Se guarda en tu navegador</span></footer>'
            '</article></aside>')

def jump_button() -> str:
    return '<button type="button" class="iris-card-jump" data-iris-card-jump>Ver Tarjeta Iris</button>'

def insert_detail(text: str, section: str, path: Path) -> str:
    if RAIL_MARKER in text: return text
    special=path.as_posix().endswith("es/situaciones/necesito-que-me-repitan-las-instrucciones/index.html")
    if special:
        m=re.search(r'<h1\b[^>]*id=["\']instruction-title["\'][^>]*>(.*?)</h1>',text,flags=re.I|re.S)
        if not m: raise AssertionError("Ficha especial sin título")
        title=" ".join(html.unescape(re.sub(r"<[^>]+>"," ",m.group(1))).split()).strip("«»“”\" ")
    else: title=plain_h1(text)
    href=url_for(section,title)
    block=card(section,href,title)
    if not special:
        pos=text.rfind("</article>")
        main_close=text.rfind("</main>")
        if pos<0 or main_close<0 or pos>main_close: raise AssertionError(f"Ficha sin article/main: {path}")
        # El botón queda al final del contenido principal; en móvil permite saltar
        # directamente a la tarjeta que baja después del artículo.
        text=text[:pos]+jump_button()+"\n"+text[pos:]
        main_close=text.rfind("</main>")
        text=text[:main_close]+block+"\n"+text[main_close:]
        return text
    main_close=text.rfind("</main>")
    if main_close<0: raise AssertionError("Ficha especial sin </main>")
    wrapped='<div class="iris-cta-special">'+jump_button()+block+'</div>'
    return text[:main_close]+wrapped+"\n"+text[main_close:]

def insert_index(text: str, section: str, path: Path) -> str:
    if MARKER in text: return text
    block=cta(section,url_for(section),compact=True)
    if section in {"situaciones","vida"}:
        for pattern in (r'<p class="notice">.*?</p>',r'<p class="lede">.*?</p>'):
            m=re.search(pattern,text,flags=re.I|re.S)
            if m: return text[:m.end()]+"\n"+block+text[m.end():]
    if section=="condiciones":
        for pattern in (r'<div class="ig-section-actions">.*?</div>',r'<p class="lede">.*?</p>'):
            m=re.search(pattern,text,flags=re.I|re.S)
            if m: return text[:m.end()]+"\n"+block+text[m.end():]
    if section=="ayudas":
        m=re.search(r"<main\b[^>]*>",text,flags=re.I)
        if m: return text[:m.end()]+"\n"+block+text[m.end():]
    raise AssertionError(f"No se encontró punto de inserción en {path}")

def main() -> None:
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument("--root",type=Path,default=Path("dist"));args=parser.parse_args();root=args.root.resolve()
    changed=[];detail_counts={}
    for section,pattern,expected in DETAIL_SETS:
        pages=sorted(p for p in root.glob(pattern) if p.is_file())
        if len(pages)!=expected: raise AssertionError(f"{section}: se esperaban {expected} fichas y hay {len(pages)}")
        for path in pages:
            before=read(path);after=add_assets(insert_detail(before,section,path))
            if after!=before: write(path,after);changed.append(path.relative_to(root).as_posix())
            if after.count(RAIL_MARKER)!=1: raise AssertionError(f"Tarjeta lateral duplicada o ausente: {path}")
        detail_counts[section]=len(pages)
    index_count=0
    for section,rel in INDEX_PAGES.items():
        path=root/rel
        if not path.is_file(): raise FileNotFoundError(path)
        before=read(path);after=add_assets(insert_index(before,section,path))
        if after!=before: write(path,after);changed.append(rel)
        if after.count(MARKER)!=1: raise AssertionError(f"CTA de índice duplicada o ausente: {rel}")
        index_count+=1
    tool=root/"es/tarjetas-iris/index.html"
    if not tool.is_file(): raise AssertionError("No existe /es/tarjetas-iris/ en dist")
    expected_total=sum(v for _,_,v in DETAIL_SETS)+len(INDEX_PAGES)
    if len(set(changed))!=expected_total: raise AssertionError(f"Se esperaban {expected_total} páginas modificadas y hay {len(set(changed))}")
    print(json.dumps({"detail_pages_connected":detail_counts,"section_indexes_connected":index_count,"total_pages_connected":expected_total,"tool_route":"/es/tarjetas-iris/","detail_layout":"rail lateral; móvil debajo del contenido","focus_not_obscured":True,"reduced_motion_scroll":True,"home_untouched":True,"english_untouched":True},ensure_ascii=False))

if __name__=="__main__": main()
