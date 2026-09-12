#!/usr/bin/env python3
"""Completa metadatos y semántica de la utilidad de impresión de Tus intereses.

La ruta es una utilidad noindex: no se añade la navegación principal completa.
Se conserva el enlace de vuelta y se identifica el bloque de acciones como toolbar.
Solo actúa sobre la salida pública.
"""
from __future__ import annotations
import argparse
from pathlib import Path

REL='es/intereses/imprimir/index.html'
DESCRIPTION='Prepara los cromos de Tus intereses para imprimir o guardar en PDF, con uno o cuatro cromos por hoja.'
CANONICAL='https://irisgreen.eu/es/intereses/imprimir/'


def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--root',type=Path,default=Path('dist'));args=ap.parse_args()
    path=args.root.resolve()/REL
    if not path.is_file():raise FileNotFoundError(path)
    old=path.read_text(encoding='utf-8');text=old
    marker='<title>Imprimir cromos · Iris Green</title><meta name="robots" content="noindex,follow">'
    replacement=(marker+f'\n<meta name="description" content="{DESCRIPTION}">'
                 +f'\n<link rel="canonical" href="{CANONICAL}">')
    if f'<link rel="canonical" href="{CANONICAL}">' not in text:
        if text.count(marker)!=1:raise ValueError('No se encuentra el encabezado esperado de la página de impresión')
        text=text.replace(marker,replacement,1)
    if 'role="toolbar"' not in text:
        if text.count('<div class="barra">')!=1:raise ValueError('No se encuentra la barra de impresión')
        text=text.replace('<div class="barra">','<div class="barra" role="toolbar" aria-label="Opciones de impresión">',1)
    en='document.querySelector(".barra").setAttribute("aria-label","Print options");'
    if en not in text:
        needle='if(!ES){document.documentElement.lang="en";'
        if text.count(needle)!=1:raise ValueError('No se encuentra el cambio de idioma de la página de impresión')
        text=text.replace(needle,needle+en,1)
    required=[f'name="description" content="{DESCRIPTION}"',f'rel="canonical" href="{CANONICAL}"','role="toolbar" aria-label="Opciones de impresión"',en]
    missing=[x for x in required if x not in text]
    if missing:raise AssertionError('Metadatos/semántica de impresión incompletos: '+repr(missing))
    if text!=old:path.write_text(text,encoding='utf-8')
    print({'pagina':REL,'canonical':CANONICAL,'noindex_preservado':'noindex,follow' in text,'toolbar':True})

if __name__=='__main__':main()
