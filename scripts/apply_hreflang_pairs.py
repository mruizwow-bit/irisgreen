#!/usr/bin/env python3
"""Añade hreflang ES/EN a las parejas de Situaciones ya definidas en buscador.json.
No deduce traducciones por nombre ni crea rutas.
"""
from __future__ import annotations
import argparse,json,re
from pathlib import Path
from urllib.parse import urlsplit
ROOT=Path(__file__).resolve().parents[1];SITE='https://irisgreen.eu'
ALT=re.compile(r'\s*<link\b(?=[^>]*\brel=["\'][^"\']*\balternate\b[^"\']*["\'])(?=[^>]*\bhreflang=["\'](?:es(?:-ES)?|en(?:-GB)?|x-default)["\'])[^>]*>\s*',re.I)

def file_for(root,url):
    path=urlsplit(url).path;rel=path.lstrip('/')
    if path.endswith('/'):rel+='index.html'
    elif not Path(rel).suffix:rel+='/index.html'
    return root/rel

def block(es_url,en_url):
    es=SITE+urlsplit(es_url).path;en=SITE+urlsplit(en_url).path
    return f'<link rel="alternate" hreflang="es" href="{es}">\n<link rel="alternate" hreflang="en" href="{en}">\n<link rel="alternate" hreflang="x-default" href="{es}">\n'

def patch(path,tags):
    old=path.read_text(encoding='utf-8');text=ALT.sub('\n',old);pos=text.lower().rfind('</head>')
    if pos<0:raise ValueError(f'HTML sin </head>: {path}')
    text=text[:pos]+'\n'+tags+text[pos:]
    if text!=old:path.write_text(text,encoding='utf-8');return True
    return False

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,default=ROOT/'dist');args=ap.parse_args();root=args.root.resolve()
    data=json.loads((ROOT/'buscador.json').read_text(encoding='utf-8'));pairs=[]
    for row in data:
        if row.get('s')!='Situación':continue
        en=row.get('en') or {};es_url,en_url=row.get('u'),en.get('u')
        if not es_url or not en_url:raise ValueError('Situación sin pareja ES/EN: '+repr(row.get('t')))
        es_file,en_file=file_for(root,es_url),file_for(root,en_url)
        if not es_file.is_file() or not en_file.is_file():raise FileNotFoundError(f'Pareja incompleta: {es_url} / {en_url}')
        pairs.append((es_url,en_url,es_file,en_file))
    if len(pairs)!=187:raise ValueError(f'Inventario de Situaciones cambiado: {len(pairs)}')
    changed=0
    for es_url,en_url,es_file,en_file in pairs:
        tags=block(es_url,en_url);changed+=int(patch(es_file,tags));changed+=int(patch(en_file,tags))
    for es_url,en_url,es_file,en_file in pairs:
        expected={'es':SITE+urlsplit(es_url).path,'en':SITE+urlsplit(en_url).path,'x-default':SITE+urlsplit(es_url).path}
        for path in (es_file,en_file):
            got={}
            for lang,href in re.findall(r'<link\b[^>]*\bhreflang=["\']([^"\']+)["\'][^>]*\bhref=["\']([^"\']+)["\'][^>]*>',path.read_text(encoding='utf-8'),re.I):
                if lang in expected:
                    if lang in got:raise AssertionError(f'hreflang duplicado {lang}: {path}')
                    got[lang]=href
            if got!=expected:raise AssertionError(f'hreflang incorrecto en {path}: {got}')
    print(json.dumps({'situaciones_parejas':len(pairs),'paginas':len(pairs)*2,'html_actualizados':changed},ensure_ascii=False))
if __name__=='__main__':main()
