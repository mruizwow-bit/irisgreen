#!/usr/bin/env python3
from pathlib import Path
import csv,sys
root=Path(sys.argv[1] if len(sys.argv)>1 else '.').resolve()
page=root/'es/taller/rutinas/index.html'; css=root/'assets/rutinas-visuales.css'; js=root/'assets/rutinas-visuales.js'; data=root/'assets/rutinas-visuales-data.js'; assets=root/'assets/mulberry-rutinas'
for p in (page,css,js,data,assets/'sources.csv',assets/'LICENSE-MULBERRY.txt'):
    assert p.exists(),p
rows=list(csv.DictReader((assets/'sources.csv').open(encoding='utf-8-sig')))
assert len(rows)==58,len(rows)
assert all(r['estado']=='CANDIDATO' for r in rows)
sprites=''.join(p.read_text(encoding='utf-8') for p in sorted(assets.glob('sprite-*.svg')))
assert sprites.count('<symbol id=')==58
assert '<metadata' not in sprites
html=page.read_text(encoding='utf-8'); script=js.read_text(encoding='utf-8'); style=css.read_text(encoding='utf-8')
for needle in ['Rutinas visuales','Constructor de rutinas','Pictogramas: Mulberry Symbols','data-builder-format="a4"','data-builder-format="strip"','data-builder-format="pair"','data-builder-format="screen"']:
    assert needle in html,needle
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
assert '© Steve Lee, CC BY-SA 4.0 · mulberrysymbols.org' in script
assert 'Deberes' not in script and 'Homework' not in script and 'Merienda' not in script
print({'route':'/es/taller/rutinas/','symbols':58,'a4_max_per_sheet':5,'strip_max_per_strip':4,'pair':2,'max_routine':8,'session_only':True,'result':'accepted'})
