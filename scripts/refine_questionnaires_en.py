#!/usr/bin/env python3
import re
from pathlib import Path
p=Path('es/cuestionarios/index.html')
s=p.read_text(encoding='utf-8')

if 'duration: "Cuánto dura"' not in s:
    if 'const UI_ES = {' not in s or 'const UI_EN = {' not in s:
        raise SystemExit('No encuentro los diccionarios UI_ES/UI_EN generados por la primera fase.')
    s=s.replace('const UI_ES = {','const UI_ES = {\n  duration: "Cuánto dura", threshold: "Umbral orientativo", version: "Versión que se usa y licencia", start: "Empezar el cuestionario",',1)
    s=s.replace('const UI_EN = {','const UI_EN = {\n  duration: "How long it takes", threshold: "Screening threshold", version: "Version used and licence", start: "Start questionnaire",',1)

patterns=[
    (r'>Cuánto dura</div>', '>{{ labelDuration }}</div>', 'duration'),
    (r'>Umbral orientativo</div>', '>{{ labelThreshold }}</div>', 'threshold'),
    (r'>Versión que se usa y licencia</div>', '>{{ labelVersion }}</div>', 'version'),
    (r'>Empezar el cuestionario</button>', '>{{ labelStart }}</button>', 'start'),
]
for pat,repl,name in patterns:
    if '{{ label'+name.capitalize()+' }}' in s:
        continue
    s,n=re.subn(pat,repl,s,count=1)
    if n!=1:
        raise SystemExit(f'No pude vincular el rótulo {name}; coincidencias={n}')

if 'labelDuration: labels.duration' not in s:
    pat=r'(\s+langAviso:\s*\(LANGSTR\[[^\n]+\n)'
    repl=r'\1      labelDuration: labels.duration, labelThreshold: labels.threshold, labelVersion: labels.version, labelStart: labels.start,\n'
    s,n=re.subn(pat,repl,s,count=1)
    if n!=1:
        raise SystemExit(f'No pude añadir los rótulos a renderVals; coincidencias={n}')

required=['{{ labelDuration }}','{{ labelThreshold }}','{{ labelVersion }}','{{ labelStart }}','duration: "How long it takes"','labelDuration: labels.duration']
missing=[x for x in required if x not in s]
if missing: raise SystemExit('Refinado incompleto: '+', '.join(missing))
p.write_text(s,encoding='utf-8')
print('Rótulos internos de Cuestionarios vinculados al idioma del componente.')
