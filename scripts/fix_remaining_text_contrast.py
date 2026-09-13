#!/usr/bin/env python3
"""Corrige dos textos finales cuyo color no alcanza 4,5:1 ni sobre blanco.

Los detectó el inventario de contraste de axe después de agrupar los casos con
fondos degradados. El cambio se limita por ruta, texto y selector estable del
artefacto final; si cambia la plantilla, el build falla para revisión.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

FIXES = [
    {
        'page':'es/tramites/directorio/index.html',
        'needle':'Directorio de ayudas y trámites',
        'anchor':'data-dc-tpl="60"',
        'style':'p[data-dc-tpl="60"]>.sc-interp{color:#197991!important}',
        'old':'#1f8ba8',
        'new':'#197991',
        'contrast':5.02,
    },
    {
        'page':'es/videos/index.html',
        'needle':'Dónde está',
        'anchor':'data-dc-tpl="65"',
        'style':'span[data-dc-tpl="65"]>.sc-interp{color:#627087!important}',
        'old':'#7a8698',
        'new':'#627087',
        'contrast':5.02,
    },
]
MARKER='ig-final-text-contrast'


def main() -> None:
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root',type=Path,default=Path('dist'))
    args=ap.parse_args();root=args.root.resolve();done=[]
    for fix in FIXES:
        page=root/fix['page']
        if not page.is_file():raise FileNotFoundError(page)
        text=page.read_text(encoding='utf-8')
        if fix['needle'] not in text or fix['anchor'] not in text:
            raise AssertionError(f"No se encuentra el objetivo esperado en {fix['page']}")
        style=f'<style id="{MARKER}">{fix["style"]}</style>'
        if style not in text:
            pos=text.lower().rfind('</head>')
            if pos<0:raise AssertionError(f"HTML sin </head>: {fix['page']}")
            text=text[:pos]+style+'\n'+text[pos:]
            page.write_text(text,encoding='utf-8')
        done.append({k:fix[k] for k in ('page','needle','old','new','contrast')})
    print(json.dumps({'fixed':done,'minimum_normal_text':4.5},ensure_ascii=False))


if __name__=='__main__':main()
