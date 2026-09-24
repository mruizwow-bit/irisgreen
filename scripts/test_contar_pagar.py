#!/usr/bin/env python3
from pathlib import Path
import re,sys
root=Path(sys.argv[1] if len(sys.argv)>1 else '.').resolve()
page=root/'es/recursos/juegos/contar-y-pagar/index.html'
js=root/'assets/juego-contar-pagar.js'
calc=root/'assets/calculadora-iris.js'
css=root/'assets/juego-contar-pagar.css'
printcss=root/'assets/dinero-impresion.css'
index=root/'es/recursos/juegos/index.html'
for p in [page,js,calc,css,printcss,index]: assert p.exists(),p
html=page.read_text(encoding='utf-8'); script=js.read_text(encoding='utf-8'); home=index.read_text(encoding='utf-8')
assert 'Contar y pagar' in html and 'Hacer cosas en el mundo' in html
assert '/es/recursos/contar-y-pagar/' in home
assert 'Son catorce juegos' in home and 'There are fourteen games' in home
assert 'Sabik' not in html+script+home
assert 'localStorage' not in script+calc.read_text(encoding='utf-8') and 'sessionStorage' not in script+calc.read_text(encoding='utf-8')
assert 'new Function' not in script+calc.read_text(encoding='utf-8') and 'eval(' not in script+calc.read_text(encoding='utf-8')
for needle in ['panel-caja','panel-cambio','panel-llega','panel-carta','ig-calculadora','cp-outcome-grid','cp-empty-region']:
    assert needle in html,needle
assert html.count('cp-empty-region')==3
money=root/'assets/dinero'; files=sorted(money.glob('*.svg'))
assert len(files)==12,len(files)
expected={'b5','b10','b20','b50','e1','e2','c1','c2','c5','c10','c20','c50'}
assert {p.stem for p in files}==expected
for p in files:
    t=p.read_text(encoding='utf-8').lower()
    assert '<metadata' not in t and 'c2pa' not in t and 'com.anthropic' not in t,p
for ident in expected: assert ident in script,ident
print({'route':'/es/recursos/contar-y-pagar/','money_assets':12,'panels':4,'storage':False,'sabik':False,'home_card':True,'result':'accepted'})
