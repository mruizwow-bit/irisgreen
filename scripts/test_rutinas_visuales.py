#!/usr/bin/env python3
from pathlib import Path
import csv, json, re, sys
import xml.etree.ElementTree as ET

root=Path(sys.argv[1] if len(sys.argv)>1 else '.').resolve()
page=root/'es/recursos/rutinas-visuales/index.html'
index=root/'es/recursos/index.html'
css=root/'assets/rutinas-visuales.css'
js=root/'assets/rutinas-visuales.js'
data=root/'assets/rutinas-visuales-data.js'
assets=root/'assets/mulberry-rutinas'
for p in (page,index,css,js,data,assets/'sources.csv',assets/'LICENSE-MULBERRY.txt'):
    assert p.exists(),p
# Preserve the historical 93-symbol sprite manifest; it is not the live catalogue.
rows=list(csv.DictReader((assets/'sources.csv').open(encoding='utf-8-sig')))
assert len(rows)==93,len(rows)
assert all(r['estado']=='CANDIDATO' for r in rows)
sprite_files=sorted(assets.glob('sprite-*.svg'))
assert [p.name for p in sprite_files]==sorted(f'sprite-{i}.svg' for i in range(1,14))
sprite_text={p.name:p.read_text(encoding='utf-8') for p in sprite_files}
all_sprites=''.join(sprite_text.values())
ids=re.findall(r'<symbol\b[^>]*\bid=["\']([^"\']+)["\']',all_sprites,re.I)
assert len(ids)==93 and len(set(ids))==93,(len(ids),len(set(ids)))
assert set(ids)=={r['id'] for r in rows}
low=all_sprites.lower()
for bad in ('<metadata','c2pa','com.anthropic','id="layer_1"',"id='layer_1'"):
    assert bad not in low,bad
html=page.read_text(encoding='utf-8'); resource_index=index.read_text(encoding='utf-8')
script=js.read_text(encoding='utf-8'); style=css.read_text(encoding='utf-8')
data_text=data.read_text(encoding='utf-8').strip()
pictos=json.loads(re.search(r'window\.IG_RUTINAS_PICTOS=(\[.*?\]);',data_text,re.S).group(1))
categories=json.loads(re.search(r'window\.IG_RUTINAS_CATEGORIAS=(\[.*?\]);',data_text,re.S).group(1))
# The current shared catalogue uses individual SVG files, not sprite references.
assert len(pictos)==292,len(pictos)
assert len(categories)==11 and len(set(categories))==11,categories
assert len({p['id'] for p in pictos})==len(pictos),'duplicate live pictogram IDs'
base=(root/'assets/pictogramas').resolve()
for p in pictos:
    assert all(isinstance(p.get(k),str) and p[k].strip() for k in ('id','file','cat','es','en')),p
    assert p['cat'] in categories,(p['id'],p['cat'])
    relative=Path(p['file'])
    assert not relative.is_absolute() and '..' not in relative.parts,p['file']
    target=(base/relative).resolve()
    assert target.is_relative_to(base) and target.suffix=='.svg' and target.is_file(),target
    assert ET.parse(target).getroot().tag=='{http://www.w3.org/2000/svg}svg',target
assert "const BASE='/assets/pictogramas/';" in script
for needle in ['Rutinas visuales','Constructor de rutinas','Pictogramas: Mulberry Symbols','data-builder-format="a4"','data-builder-format="strip"','data-builder-format="pair"','data-builder-format="screen"']:
    assert needle in html,needle
assert '/es/recursos/rutinas-visuales/' in resource_index
assert '/es/recursos/juegos/' in resource_index
for needle in ["MORNING_IDS=['despertarse','bano','lavarse-la-cara','vestirse','desayunar','lavarse-los-dientes','mochila','salir']",'sessionStorage','ig-rutinas-hechos-ready','ig-rutinas-hechos-builder','slice(0,4)','i+=5','builderMax(){return state.builderFormat===\'pair\'?2:8;}','window.print()']:
    assert needle in script,needle
assert 'localStorage' not in script
assert 'setInterval' not in script
assert 'draggable' not in script
assert 'role="progressbar"' not in html
assert '@page hojaA4' in style and '@page hojaTira' in style and '@page hojaPar' in style
assert 'grid-template-columns:10mm 35mm 1fr 12mm' in style
assert 'repeat(4,1fr)' in style
assert 'width:60mm' in style
assert 'width:45mm' in style
assert '© Garry Paxton 2008-2017 y © Steve Lee 2018-2026, licencia CC BY-SA 4.0 · mulberrysymbols.org' in script
assert 'Deberes' not in script and 'Homework' not in script and 'Merienda' not in script
assert '/es/taller/rutinas/' not in html
assert 'irisgreen.eu/es/taller/rutinas/' not in script
print({'route':'/es/recursos/rutinas-visuales/','symbols':len(pictos),'categories':len(categories),'historical_sprite_symbols':93,'historical_sprites':13,'individual_svg_paths_checked':len(pictos),'a4_max_per_sheet':5,'strip_max_per_strip':4,'pair':2,'max_routine':8,'session_only':True,'result':'accepted'})
