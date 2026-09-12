#!/usr/bin/env python3
"""Frena la publicación si PT-BR reaparece fuera de las redirecciones históricas."""
from __future__ import annotations
import argparse
import re
from pathlib import Path

TEXT_SUFFIXES={'.html','.css','.js','.json','.xml','.txt','.map'}
PATTERNS=(
    ('ruta pt-br',re.compile(r'(?i)/pt-br(?:/|\b)')),
    ('código pt-br',re.compile(r'(?i)\bpt-br\b')),
    ('código pt',re.compile(r'(?i)\bpt\b')),
    ('portugués declarado',re.compile(r'(?i)portugu[eê]s(?:e|es|a|as)?|português|portugués')),
)


def readable(path:Path)->bool:
    return path.suffix.lower() in TEXT_SUFFIXES or path.name in {'_headers','robots.txt','llms.txt','support.js','buscador.json','videoteca-listado.json'}


def audit(root:Path)->list[tuple[str,str,str]]:
    if not root.is_dir() or root.is_symlink():
        raise ValueError('La raíz pública debe ser un directorio real: '+str(root))
    if (root/'pt-br').exists():
        raise SystemExit('PT-BR sigue publicado como directorio: '+str(root/'pt-br'))
    redirects=root/'_redirects'
    if not redirects.is_file():
        raise SystemExit('Falta _redirects: deben conservarse los 301 históricos de PT-BR')
    redirect_text=redirects.read_text(encoding='utf-8')
    if not redirect_text.startswith('# Generado desde los enlaces españoles de las 375 páginas existentes.'):
        raise SystemExit('_redirects ya no coincide con el inventario histórico de 375 páginas')
    if len(re.findall(r'^/pt-br/(?!\*\s)',redirect_text,flags=re.M))!=376 or '/pt-br/* / 301!' not in redirect_text:
        raise SystemExit('Los 301 históricos de PT-BR han cambiado')
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
    return hits


def main()->None:
    parser=argparse.ArgumentParser()
    parser.add_argument('--root',type=Path,default=Path('dist'))
    args=parser.parse_args()
    hits=audit(args.root)
    if hits:
        print('Quedan referencias portuguesas publicables fuera de _redirects:')
        for rel,label,snippet in hits[:80]:
            print(f'- {rel} · {label}: {snippet}')
        if len(hits)>80:print(f'- … y {len(hits)-80} archivos más')
        raise SystemExit(1)
    print('Portugués retirado de dist: 0 referencias publicables; _redirects conserva los 301 históricos.')


if __name__=='__main__':main()
