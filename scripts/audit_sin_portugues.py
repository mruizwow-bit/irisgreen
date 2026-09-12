#!/usr/bin/env python3
"""Frena la publicación si PT-BR reaparece fuera de las redirecciones históricas.

Una ruta oficial externa puede contener `/pt-br/` (por ejemplo, gov.br). Eso no
es una versión portuguesa de Iris Green y no debe borrarse para satisfacer la prueba.
"""
from __future__ import annotations
import argparse
import re
from html.parser import HTMLParser
from pathlib import Path

TEXT_SUFFIXES={'.html','.css','.js','.json','.xml','.txt','.map'}
PATTERNS=(
    ('ruta interna pt-br',re.compile(r'''(?ix)(?:
        (?:href|src|action)\s*=\s*["'](?:https?://(?:www\.)?irisgreen\.eu)?/pt-br(?:/|["'])
        | ["'(=]\s*/pt-br(?:/|["'])
        | https?://(?:www\.)?irisgreen\.eu/pt-br(?:/|\b)
    )''')),
    ('hreflang pt',re.compile(r'''(?i)\bhreflang\s*=\s*["']pt(?:-br)?["']''')),
    ('lang pt',re.compile(r'''(?i)\b(?:lang|data-lang)\s*=\s*["']pt(?:-br)?["']''')),
    ('navegación pt',re.compile(r'''(?i)\big-nav-pt\b''')),
    ('clave de idioma pt',re.compile(r'''(?im)(?:^|[{,])\s*["']?pt["']?\s*:''')),
    ('rama de idioma pt',re.compile(r'''(?i)===\s*["']pt["']''')),
    ('etiqueta PT-BR',re.compile(r'''\bPT-BR\b''')),
)
NO_JS_PAGES=(
    'es/libros/index.html',
    'es/tramites/directorio/index.html',
    'es/recursos/juegos/el-detective-de-los-sentidos/index.html',
)


class VisibleText(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.hidden=0
        self.parts=[]
    def handle_starttag(self,tag,attrs):
        if tag.lower() in {'script','style','template'}:
            self.hidden+=1
    def handle_endtag(self,tag):
        if tag.lower() in {'script','style','template'} and self.hidden:
            self.hidden-=1
    def handle_data(self,data):
        if not self.hidden and data.strip():
            self.parts.append(data)


def readable(path:Path)->bool:
    return path.suffix.lower() in TEXT_SUFFIXES or path.name in {'_headers','robots.txt','llms.txt','support.js','buscador.json','videoteca-listado.json'}


def no_js_visible_text(path:Path)->str:
    parser=VisibleText()
    parser.feed(path.read_text(encoding='utf-8'))
    return ' '.join(' '.join(parser.parts).split())


def audit(root:Path)->list[tuple[str,str,str]]:
    if not root.is_dir() or root.is_symlink():
        raise ValueError('La raíz pública debe ser un directorio real: '+str(root))
    if (root/'pt-br').exists():
        raise SystemExit('PT-BR sigue publicado como directorio: '+str(root/'pt-br'))
    redirects=root/'_redirects'
    if not redirects.is_file():
        raise SystemExit('Falta _redirects: deben conservarse las redirecciones históricas de PT-BR')
    redirect_text=redirects.read_text(encoding='utf-8')
    if not redirect_text.startswith('# Generado desde los enlaces españoles de las 375 páginas existentes.'):
        raise SystemExit('_redirects ya no coincide con el inventario histórico de 375 páginas')
    if len(re.findall(r'^/pt-br/(?!\*\s)',redirect_text,flags=re.M))!=376 or '/pt-br/* / 301!' not in redirect_text:
        raise SystemExit('Las redirecciones históricas de PT-BR han cambiado')
    hits=[]
    for path in sorted(p for p in root.rglob('*') if p.is_file()):
        rel=path.relative_to(root).as_posix()
        if rel=='_redirects' or not readable(path):
            continue
        try:text=path.read_text(encoding='utf-8')
        except UnicodeDecodeError:continue
        for label,pattern in PATTERNS:
            match=pattern.search(text)
            if match:
                start=max(0,match.start()-70);end=min(len(text),match.end()+90)
                snippet=' '.join(text[start:end].split())
                hits.append((rel,label,snippet))
                break
    for rel in NO_JS_PAGES:
        page=root/rel
        if not page.is_file():
            hits.append((rel,'prueba sin JavaScript','falta la página que debe comprobarse'))
            continue
        visible=no_js_visible_text(page)
        if 'Início' in visible:
            pos=visible.index('Início')
            hits.append((rel,'Início visible sin JavaScript',visible[max(0,pos-70):pos+100]))
    return hits


def main()->None:
    parser=argparse.ArgumentParser()
    parser.add_argument('--root',type=Path,default=Path('dist'))
    args=parser.parse_args()
    hits=audit(args.root)
    if hits:
        print('Quedan referencias PT-BR publicables fuera de _redirects:')
        for rel,label,snippet in hits[:80]:
            print(f'- {rel} · {label}: {snippet}')
        if len(hits)>80:print(f'- … y {len(hits)-80} archivos más')
        raise SystemExit(1)
    print('Portugués retirado de dist: 0 referencias internas PT-BR; Libros, Directorio y juego sin «Início» visible sin JavaScript; _redirects conservado.')


if __name__=='__main__':main()
