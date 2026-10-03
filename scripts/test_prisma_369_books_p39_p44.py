#!/usr/bin/env python3
from pathlib import Path
import argparse,re

ROOT=Path(__file__).resolve().parents[1]

def need(v,msg):
    if not v: raise AssertionError(msg)

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True)
    public=ap.parse_args().root.resolve()
    source=(ROOT/'es/libros/index.html').read_text(encoding='utf-8')
    built=(public/'es/libros/index.html').read_text(encoding='utf-8')
    how=(public/'es/tramites/index.html').read_text(encoding='utf-8')

    # P39/P40 · Books are product fichas with sample/formats/languages/purchase links.
    need('Libros para leer en la web, a tu ritmo.' not in source,'P39 legacy read-full-on-web copy')
    need('Books to read on the web' not in source,'P39 legacy EN read-full-on-web copy')
    need('abre una muestra' in source and 'enlaces de compra' in source,'P40 ES product description')
    need('open a sample' in source and 'purchase links' in source,'P40 EN product description')

    # P41 · no duplicate preview CTA when sample/flipbook is already present.
    need('previewUrl' not in source,'P41 duplicate preview URL still wired')
    need('previewLabel:' not in source,'P41 duplicate preview label still wired')

    # P42 · Melissa notes are structured markup, never escaped code in a string.
    need('desc2Strong: "Notas de Melissa"' in source,'P42 Melissa strong token missing ES')
    need('desc2Strong: "Melissa’s Notes"' in source,'P42 Melissa strong token missing EN')
    need(re.search(r'desc2:\s*"[^"]*<strong>',source) is None,'P42 escaped/embedded strong remains in data')
    need('&lt;strong&gt;Notas de Melissa&lt;/strong&gt;' not in built,'P42 escaped strong visible in build')

    # P43 · PT-BR book formats exist as book links only, without restoring PT site UI.
    for url in ('https://www.amazon.es/dp/B0HHN9537P','https://www.amazon.es/dp/B0HHN5B6HS'):
        need(url in source,'P43 missing PT-BR source link '+url)
        need(url in built,'P43 missing PT-BR built link '+url)
    need('PT-BR · tapa blanda' in source and 'Kindle PT-BR' in source,'P43 ES format labels')
    need('PT-BR · paperback' in source,'P43 EN format label')
    need('pt: {' not in source,'P43 must not restore a global PT language object')
    need('ig-nav-pt' not in source,'P43 must not restore PT global navigation')

    # P44 · no book promotion in functional How-to-request surface.
    for phrase in ('Todo aquí es gratis gracias a los libros de Iris Green','Leer las primeras páginas'):
        need(phrase not in how,'P44 book promotion leaked into How to request: '+phrase)

    print('ISSUE_369_P39_P44_BOOKS_PASS')

if __name__=='__main__':main()
