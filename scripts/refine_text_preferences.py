#!/usr/bin/env python3
"""Repair test bookkeeping and align instructions with the implemented options.
The first run accidentally overwrote its default-style snapshot with its summary.
It did not reach the 21 combination tests; those must be run, not marked passed.
"""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=ROOT/'scripts/test_text_preferences.py';s=p.read_text()
s=s.replace("(OUT/'baseline.json').write_text(json.dumps(snap", "(OUT/'baseline-values.json').write_text(json.dumps(snap")
s=s.replace("baseline=json.loads((OUT/'baseline.json').read_text())", "baseline=json.loads((OUT/'baseline-values.json').read_text())")
p.write_text(s)
p=ROOT/'scripts/test_reading_preferences.py';s=p.read_text()
old="    same_state(page);assert 'remembered' in panel.inner_text()"
new="""    same_state(page)
    # Focus protection may close an overlapping panel when the external language
    # control receives focus. Reopening must retain the settings and new language.
    if not panel.is_visible():panel=open_panel(page)
    assert 'remembered' in panel.inner_text()"""
if old in s:
 assert s.count(old)==1;s=s.replace(old,new,1);p.write_text(s)
else:assert new in s
p=ROOT/'es/lectura-accesible/index.html';s=p.read_text()
s=s.replace('Aumenta a la vez el espacio entre letras, palabras y líneas. Es una única opción: todavía no hay cuatro controles independientes de espaciado.','Aplica una combinación de separación entre letras, palabras y líneas. Para ajustarlas por separado, abre «Tipografía, espaciado y anchura», que también permite elegir la separación entre párrafos. Utilizar este botón de combinación sustituye las separaciones personalizadas; no cambia la tipografía ni la anchura elegidas.')
s=s.replace('También quedan por ampliar tipografías, espaciados independientes, guía táctil, temas completos, lectura en voz alta avanzada y alternativas textuales de algunos materiales.','Siguen pendientes la guía utilizable sin ratón, los temas completos, la lectura en voz alta avanzada y las alternativas textuales de algunos materiales. La disponibilidad real de las tipografías alternativas depende del dispositivo.')
# Put the new instructions next to the existing controls, before storage/help.
marker='<!-- ig-independent-text-help -->'
if marker in s and s.index(marker)>s.index('<h2>Guardar los ajustes</h2>'):
 a=s.index(marker);b=s.index('</section>',a)+len('</section>');part=s[a:b];s=s[:a]+s[b:];at=s.index('<h2>Guardar los ajustes</h2>');s=s[:at]+part+'\n'+s[at:]
p.write_text(s)
print('Snapshot and instruction fixes applied. No failing requirement removed.')
