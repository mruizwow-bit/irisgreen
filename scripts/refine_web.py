#!/usr/bin/env python3
"""Ajustes derivados de la primera ejecución real en Chromium."""
import json
import re
from pathlib import Path

# Una dependencia usada en componentDidMount debe preceder al runtime incluso con una red lenta.
home=Path('index.html');text=home.read_text()
search_tag='<script defer src="/assets/buscador-comun.js"></script>'
if search_tag in text:
    text=text.replace(search_tag,'')
    before='<script defer src="/assets/runtime/d949f1c3687aedad.js"></script>'
    assert before in text
    text=text.replace(before,search_tag+'\n'+before,1)
home.write_text(text)

# El reproductor del rincón es distinto del flotante: tampoco necesita precargar las duraciones.
quiet=[]
for rel in ('es/sitio-tranquilo/index.html','en/quiet-space/index.html'):
    p=Path(rel)
    if not p.exists():continue
    text=p.read_text()
    original_count=text.count("son.preload='metadata'")
    text=text.replace("son.preload='metadata'","son.preload='none'")
    # Las anillas no deben animarse antes de que la persona pulse Empezar.
    if '/* Movimiento solo después de Empezar */' not in text:
        text=text.replace('</head>','<style>/* Movimiento solo después de Empezar */ .ring{animation-play-state:paused!important}.ig-guiding .ring{animation-play-state:running!important}@media(prefers-reduced-motion:reduce){.ig-guiding .ring{animation:none!important}}</style>\n</head>',1)
        text=text.replace("running=true;phase=false;tick()","running=true;phase=false;$('#breathBox').classList.add('ig-guiding');tick()")
        text=text.replace("$('#stopBreath').onclick=()=>{running=false;", "$('#stopBreath').onclick=()=>{$('#breathBox').classList.remove('ig-guiding');running=false;")
    p.write_text(text);quiet.append({'path':rel,'metadata_preloads_removed':original_count})

# La navegación se ha corregido en los HTML: esta regla antigua podría ocultar también el botón interno.
css=Path('assets/site-v23.css');text=css.read_text()
text=text.replace('header nav > a[href="/es/tramites/"],header nav > a[href="/es/tramites"]{display:none!important}','')
css.write_text(text)

# Corregir la referencia geométrica de la prueba: el espacio reservado a la barra de scroll no es contenido.
test=Path('scripts/test_web.py');text=test.read_text()
text=text.replace("if '/audio/' in request.url else None", "if urlsplit(request.url).path.lower().endswith(('.mp3','.m4a','.ogg','.wav','.aac')) else None")
text=text.replace("assert abs(width-box['x']-box['width']-12)<2", "assert abs(page.evaluate('document.documentElement.clientWidth')-box['x']-box['width']-12)<2")
text=text.replace("        new=soup.find('main')\n", "        new=soup.find('main')\n        if old:\n            for back in old.select('.ig-back'):back.decompose()\n")
text=text.replace("                row['music_pass']=True\n", "                row['music_pass']=True\n                if path in ['/es/tramites/','/es/tramites/directorio/','/es/vivir-fuera/']:\n                    assert page.locator('.ig-subtabs a[href=\"/es/tramites/\"]').is_visible(), 'Cómo pedirlo no se ve dentro de Ayudas'\n")
test.write_text(text)
Path('reports/refinements.json').write_text(json.dumps({'quiet':quiet,'music_test_uses_client_width':True,'metadata_json_is_not_audio':True},ensure_ascii=False,indent=2)+'\n')
