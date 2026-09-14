#!/usr/bin/env python3
"""Añade a la herramienta personal Tarjetas Iris el apoyo visual aprobado.

No asigna pictogramas automáticamente. La persona elige ninguno, uno o varios de
los cinco Mulberry ya aprobados. El texto sigue siendo la información principal.
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path

CSS = '<link rel="stylesheet" href="/assets/tarjetas-iris-pictogramas.css">'
JS = '<script defer src="/assets/tarjetas-iris-pictogramas.js"></script>'
PICKER = '''<fieldset class="iris-step iris-picto-step" data-iris-tool-pictograms>
<legend>Apoyo visual (opcional)</legend>
<p class="iris-picto-intro">Puedes dejar la tarjeta solo con texto o elegir los pictogramas que te ayuden. No se añaden automáticamente.</p>
<div class="iris-picto-picker" data-iris-picto-picker role="group" aria-label="Pictogramas opcionales">
<button class="iris-picto-choice" type="button" data-iris-picto="hablar" aria-pressed="false"><img src="/assets/mulberry/hablar.svg" width="56" height="56" alt="" aria-hidden="true"><span>Hablar</span></button>
<button class="iris-picto-choice" type="button" data-iris-picto="escribir" aria-pressed="false"><img src="/assets/mulberry/escribir.svg" width="56" height="56" alt="" aria-hidden="true"><span>Escribir</span></button>
<button class="iris-picto-choice" type="button" data-iris-picto="esperar" aria-pressed="false"><img src="/assets/mulberry/esperar.svg" width="56" height="56" alt="" aria-hidden="true"><span>Esperar</span></button>
<button class="iris-picto-choice" type="button" data-iris-picto="preguntar" aria-pressed="false"><img src="/assets/mulberry/preguntar.svg" width="56" height="56" alt="" aria-hidden="true"><span>Preguntar</span></button>
<button class="iris-picto-choice" type="button" data-iris-picto="carpeta" aria-pressed="false"><img src="/assets/mulberry/carpeta.svg" width="56" height="56" alt="" aria-hidden="true"><span>Carpeta</span></button>
</div>
<p class="iris-picto-hint">Un pictograma crea una tarjeta con un apoyo principal; varios crean una tarjeta con varios apoyos. Las palabras permanecen siempre visibles.</p>
<p class="iris-picto-status" id="iris-picto-status" role="status" aria-live="polite"></p>
</fieldset>'''
PREVIEW = '<div class="iris-card-pictos" id="iris-card-pictos" aria-label="Apoyos visuales seleccionados" hidden></div>'


def run(root: Path) -> dict:
    root = root.resolve()
    page = root / 'es/tarjetas-iris/index.html'
    if not page.is_file():
        raise FileNotFoundError(page)
    for asset in ('tarjetas-iris-pictogramas.css','tarjetas-iris-pictogramas.js'):
        if not (root/'assets'/asset).is_file():
            raise FileNotFoundError(root/'assets'/asset)
    for filename in ('hablar.svg','escribir.svg','esperar.svg','preguntar.svg','carpeta.svg'):
        if not (root/'assets/mulberry'/filename).is_file():
            raise FileNotFoundError(root/'assets/mulberry'/filename)

    text = page.read_text(encoding='utf-8')
    original = text
    if CSS not in text:
        if '</head>' not in text: raise AssertionError('Tarjetas Iris sin </head>')
        text = text.replace('</head>', CSS+'\n</head>',1)
    if 'data-iris-tool-pictograms' not in text:
        marker = '<div class="iris-actions">'
        if text.count(marker) != 1:
            raise AssertionError('No se encuentra el bloque de acciones de la herramienta personal')
        text = text.replace(marker, PICKER+marker,1)
    if 'id="iris-card-pictos"' not in text:
        pattern = re.compile(r'(<h2 class="iris-card-title"\b[^>]*>.*?</h2>)',re.S)
        text,n = pattern.subn(r'\1'+PREVIEW,text,count=1)
        if n != 1: raise AssertionError('No se encuentra el título de la vista previa')
    if JS not in text:
        if '</body>' not in text: raise AssertionError('Tarjetas Iris sin </body>')
        text = text.replace('</body>', JS+'\n</body>',1)

    if text != original:
        page.write_text(text,encoding='utf-8')

    final = page.read_text(encoding='utf-8')
    assert final.count('data-iris-tool-pictograms') == 1
    assert final.count('data-iris-picto=') == 5
    assert 'id="iris-card-pictos"' in final
    assert '/assets/tarjetas-iris-pictogramas.js' in final
    assert '/assets/tarjetas-iris-pictogramas.css' in final

    result = {
        'route':'/es/tarjetas-iris/',
        'variants':['A','B','C'],
        'approved_pictograms':['hablar','escribir','esperar','preguntar','carpeta'],
        'automatic_assignment':False,
        'browser_storage':False,
        'text_always_visible':True,
        'result':'accepted',
    }
    print(result)
    return result


if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--root',type=Path,default=Path('dist'))
    args=parser.parse_args()
    run(args.root)
