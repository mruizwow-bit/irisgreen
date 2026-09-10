#!/usr/bin/env python3
"""Integra Tarjetas Iris dentro de las fichas españolas sin tocar su contenido editorial."""
from __future__ import annotations
import argparse, html, json, re
from pathlib import Path

CSS='<link rel="stylesheet" href="/assets/tarjetas-iris-cta.css">'
JS='<script defer src="/assets/tarjetas-iris-inline.js"></script>'
MARK='data-iris-inline-card="true"'
SETS=(("situaciones","es/situaciones/*/index.html",187),("vida","es/biblioteca/*/index.html",48),("condiciones","es/neurodiversidad/condiciones/*/index.html",185))
INDEX={"situaciones":"es/situaciones/index.html","vida":"es/biblioteca/index.html","condiciones":"es/neurodiversidad/condiciones/index.html","ayudas":"es/tramites/directorio/index.html"}
LABEL={"situaciones":"SITUACIONES","vida":"VIDA DIARIA","condiciones":"CONDICIONES"}

def plain(s): return " ".join(html.unescape(re.sub(r"<[^>]+>"," ",s)).split()).strip()
def first(text,patterns):
    for p in patterns:
        m=re.search(p,text,re.I|re.S)
        if m and plain(m.group(1)): return plain(m.group(1))
    return ""
def h1(text):
    m=re.search(r"<h1\b[^>]*>(.*?)</h1>",text,re.I|re.S)
    if not m: raise AssertionError("Falta h1")
    return plain(m.group(1)).strip('«»“”\" ')
def situ_values(text):
    d=first(text,(r'<section\b[^>]*class=["\'][^"\']*\bsec\b[^"\']*["\'][^>]*>\s*<h2[^>]*>En pocas palabras</h2>\s*<p\b[^>]*class=["\'][^"\']*\blede\b[^"\']*["\'][^>]*>(.*?)</p>',r'<meta\b[^>]*name=["\']description["\'][^>]*content=["\']([^"\']+)'))
    a=first(text,(r'<section\b[^>]*class=["\'][^"\']*\bhelps\b[^"\']*["\'][^>]*>.*?<li[^>]*>(.*?)</li>',r'<section\b[^>]*class=["\'][^"\']*\bhelps\b[^"\']*["\'][^>]*>.*?<p[^>]*>(.*?)</p>'))
    return ("Para esta situación",d,a,"")
def values(text,section):
    if section=="situaciones": return situ_values(text)
    if section=="vida": return (h1(text)[:60],"","","")
    return ("Mis necesidades","","","")
def field(label,key,value,rows=3):
    return f'<label class="iris-card-field {key}"><span>{html.escape(label)}</span><textarea rows="{rows}" maxlength="420" data-iris-field="{key}" aria-label="{html.escape(label,quote=True)}">{html.escape(value)}</textarea></label>'
def card(section,v):
    t,d,a,n=v
    return (f'<aside class="iris-inline" data-iris-section="{section}" {MARK} aria-label="Tarjeta Iris editable">'
      '<div class="iris-inline-top"><span>Tarjeta Iris</span><button type="button" class="iris-inline-print" data-iris-print>Imprimir / guardar PDF</button></div>'
      '<section class="iris-personal-card"><header class="iris-personal-head"><strong>Iris Green</strong>'
      f'<span><b>{LABEL[section]}</b><br>TARJETA PERSONAL</span></header>'
      f'<input class="iris-card-title-input" data-iris-field="title" maxlength="80" aria-label="Título de la tarjeta" value="{html.escape(t,quote=True)}">'
      +field("Esto me cuesta","difficulty",d)+field("Me ayuda","help",a)+field("Necesito","need",n)
      +'<footer class="iris-personal-foot"><span>irisgreen.eu</span><span>Personaliza el texto</span></footer></section>'
      '<p class="iris-inline-help">Puedes cambiar todo el texto. Lo que escribes no se guarda en la web.</p></aside>')
def assets(text):
    if CSS not in text: text=text.replace("</head>",CSS+"\n</head>",1)
    if JS not in text: text=text.replace("</body>",JS+"\n</body>",1)
    return text
def normal(text,section):
    m=re.search(r'(<article\b[^>]*class=["\'][^"\']*\bficha\b[^"\']*["\'][^>]*>)(.*?)(</article>)',text,re.I|re.S)
    if not m: raise AssertionError("Ficha sin article.ficha")
    inner=m.group(2); split=re.search(r'<section\b',inner,re.I)
    if not split: raise AssertionError("Ficha sin secciones")
    head=inner[:split.start()]; body=inner[split.start():]
    repl=m.group(1)+head+'<div class="iris-ficha-body-grid" data-iris-layout="true"><div class="iris-ficha-copy">'+body+'</div>'+card(section,values(text,section))+'</div>'+m.group(3)
    return text[:m.start()]+repl+text[m.end():]
def special(text):
    c=card("situaciones",situ_values(text))
    m=re.search(r'<section\b[^>]*class=["\'][^"\']*\brequest-panel\b[^"\']*["\'][^>]*>',text,re.I)
    if not m: raise AssertionError("Ficha especial sin request-panel")
    tail=text[m.start():]
    end=tail.find('</section>')
    if end<0: raise AssertionError("request-panel sin cierre")
    panel=tail[:end+10]
    rest=tail[end+10:]
    return text[:m.start()]+'<div class="iris-special-right">'+c+panel+'</div>'+rest
def index_block(section):
    copy={"situaciones":("Prepara una tarjeta para explicar una situación concreta.","situaciones"),"vida":("Prepara una tarjeta para una cita, actividad o situación cotidiana.","vida"),"condiciones":("Escribe tus necesidades concretas sin deducirlas de una condición.","condiciones"),"ayudas":("Lleva por escrito lo que necesitas pedir o explicar en un trámite.","ayudas")}[section]
    return f'<section class="iris-index-cta" data-iris-section="{section}" data-iris-index-card="true"><div><h2>Tarjeta Iris</h2><p>{copy[0]}</p></div><a href="/es/tarjetas-iris/?section={copy[1]}">Abrir Tarjetas Iris</a></section>'
def add_index(text,section):
    b=index_block(section)
    if section in ("situaciones","vida"):
        m=re.search(r'<p class="lede">.*?</p>',text,re.I|re.S)
    elif section=="condiciones":
        m=re.search(r'<div class="ig-section-actions">.*?</div>',text,re.I|re.S)
    else:
        m=re.search(r'<main\b[^>]*>',text,re.I)
    if not m: raise AssertionError("No se encuentra inserción de índice: "+section)
    return text[:m.end()]+"\n"+b+text[m.end():]

def main():
    ap=argparse.ArgumentParser();ap.add_argument("--root",type=Path,default=Path("dist"));root=ap.parse_args().root.resolve()
    changed=[];counts={};special_rel="es/situaciones/necesito-que-me-repitan-las-instrucciones/index.html"
    for section,pattern,expected in SETS:
        pages=sorted(p for p in root.glob(pattern) if p.is_file())
        if len(pages)!=expected: raise AssertionError((section,len(pages),expected))
        for p in pages:
            text=p.read_text(encoding="utf-8");rel=p.relative_to(root).as_posix()
            if MARK in text: raise AssertionError("Tarjeta previa en "+rel)
            out=special(text) if rel==special_rel else normal(text,section)
            out=assets(out)
            if out.count(MARK)!=1: raise AssertionError("Tarjeta ausente/duplicada: "+rel)
            p.write_text(out,encoding="utf-8");changed.append(rel)
        counts[section]=len(pages)
    for section,rel in INDEX.items():
        p=root/rel;text=p.read_text(encoding="utf-8");out=assets(add_index(text,section));p.write_text(out,encoding="utf-8");changed.append(rel)
    sample=(root/'es/situaciones/la-ropa-me-molesta/index.html').read_text(encoding="utf-8")
    for token in ('data-iris-section="situaciones"','Una etiqueta, una costura o una tela me rozan la piel','Cortar etiquetas y usar prendas del revés','class="iris-ficha-body-grid"'):
        if token not in sample: raise AssertionError("Muestra etiquetas incorrecta: "+token)
    print(json.dumps({"detail_cards_inline":counts,"index_accesses":4,"sample_checked":"es/situaciones/la-ropa-me-molesta/","desktop_layout":"descripción izquierda / Tarjeta Iris derecha","home_untouched":True,"english_untouched":True},ensure_ascii=False))
if __name__=="__main__": main()
