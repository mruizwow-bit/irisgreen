#!/usr/bin/env python3
from pathlib import Path
import csv, json, re, sys, tempfile, shutil

from fix_rutinas_privacy import run as fix_privacy

root=Path(sys.argv[1] if len(sys.argv)>1 else '.').resolve()
page=root/'es/recursos/rutinas-visuales/index.html'
index=root/'es/recursos/index.html'
css=root/'assets/rutinas-visuales.css'
css_v2=root/'assets/rutinas-visuales-v2.css'
js=root/'assets/rutinas-visuales.js'
data=root/'assets/rutinas-visuales-data.js'
assets=root/'assets/mulberry-rutinas'
for p in (page,index,css,css_v2,js,data,assets/'sources.csv',assets/'LICENSE-MULBERRY.txt'):
    assert p.exists(),p
rows=list(csv.DictReader((assets/'sources.csv').open(encoding='utf-8-sig')))
assert len(rows)==58,len(rows)
assert all(r['estado']=='CANDIDATO' for r in rows)
sprite_files=sorted(assets.glob('sprite-*.svg'))
assert [p.name for p in sprite_files]==[f'sprite-{i}.svg' for i in range(1,9)]
sprite_text={p.name:p.read_text(encoding='utf-8') for p in sprite_files}
all_sprites=''.join(sprite_text.values())
ids=re.findall(r'<symbol\b[^>]*\bid=["\']([^"\']+)["\']',all_sprites,re.I)
assert len(ids)==58 and len(set(ids))==58,(len(ids),len(set(ids)))
assert set(ids)=={r['id'] for r in rows}
low=all_sprites.lower()
for bad in ('<metadata','c2pa','com.anthropic','id="layer_1"',"id='layer_1'"):
    assert bad not in low,bad
html=page.read_text(encoding='utf-8'); resource_index=index.read_text(encoding='utf-8')
script=js.read_text(encoding='utf-8'); style=css.read_text(encoding='utf-8')
data_text=data.read_text(encoding='utf-8').strip()
assert data_text.startswith('window.IG_RUTINAS_PICTOS=') and data_text.endswith(';')
pictos=json.loads(data_text[len('window.IG_RUTINAS_PICTOS='):-1])
assert len(pictos)==58
for p in pictos:
    assert p['sprite'] in sprite_text,(p['id'],p['sprite'])
    assert re.search(r'<symbol\b[^>]*\bid=["\']'+re.escape(p['id'])+r'["\']',sprite_text[p['sprite']],re.I),(p['id'],p['sprite'])
for needle in ['Rutinas visuales','Crear una rutina','Pictogramas: Mulberry Symbols','data-builder-format="a4"','data-builder-format="strip"','data-builder-format="pair"','data-builder-format="screen"','/assets/rutinas-visuales-v2.css']:
    assert needle in html,needle
assert 'data-ready-lang=' not in html and 'data-builder-lang=' not in html
assert '/es/recursos/rutinas-visuales/' in resource_index
assert '/es/recursos/juegos/' in resource_index
for needle in ["MORNING_IDS=['despertarse','bano','lavarse-la-cara','vestirse','desayunar','lavarse-los-dientes','mochila','salir']",'slice(0,4)','i+=5','builderMax(){return state.builderFormat===\'pair\'?2:8;}','window.print()']:
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
assert '/es/taller/rutinas/' not in html
assert 'irisgreen.eu/es/taller/rutinas/' not in script

# La fuente histórica aún contiene la implementación anterior, pero el artefacto
# público debe quedar sin almacenamiento y sin dependencias del selector ES/EN.
with tempfile.TemporaryDirectory(prefix='iris-rutinas-test-') as tmp:
    stage=Path(tmp)
    (stage/'assets').mkdir(parents=True)
    (stage/'es/recursos/rutinas-visuales').mkdir(parents=True)
    shutil.copy2(js,stage/'assets/rutinas-visuales.js')
    shutil.copy2(page,stage/'es/recursos/rutinas-visuales/index.html')
    result=fix_privacy(stage)
    public_js=(stage/'assets/rutinas-visuales.js').read_text(encoding='utf-8')
    assert 'sessionStorage' not in public_js and 'localStorage' not in public_js
    assert result['done_marks']=='memory_only'

print({'route':'/es/recursos/rutinas-visuales/','symbols':58,'sprites':8,'a4_max_per_sheet':5,'strip_max_per_strip':4,'pair':2,'max_routine':8,'internal_language_switcher':False,'memory_only':True,'result':'accepted'})
