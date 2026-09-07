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

# Los rótulos están dentro de sc-for. Deben pertenecer a cada objeto `t`, no al contexto superior.
patterns=[
    (r'>Cuánto dura</div>|>\{\{ labelDuration \}\}</div>', '>{{ t.labelDuration }}</div>', 'duration'),
    (r'>Umbral orientativo</div>|>\{\{ labelThreshold \}\}</div>', '>{{ t.labelThreshold }}</div>', 'threshold'),
    (r'>Versión que se usa y licencia</div>|>\{\{ labelVersion \}\}</div>', '>{{ t.labelVersion }}</div>', 'version'),
    (r'>Empezar el cuestionario</button>|>\{\{ labelStart \}\}</button>', '>{{ t.labelStart }}</button>', 'start'),
]
for pat,repl,name in patterns:
    if '{{ t.label'+name.capitalize()+' }}' in s:
        continue
    s,n=re.subn(pat,repl,s,count=1)
    if n!=1:
        raise SystemExit(f'No pude vincular el rótulo {name}; coincidencias={n}')

# Quitar una versión anterior de los labels en el contexto superior si existiera.
s=re.sub(r'\s+labelDuration: labels\.duration, labelThreshold: labels\.threshold, labelVersion: labels\.version, labelStart: labels\.start,\n','\n',s,count=1)

needle='''      tests: (lang === "en" ? TESTS_EN : TESTS).map((t) => ({
        name: t.name, topic: t.topic, what: t.what, time: t.time, cut: t.cut, source: t.source,'''
replacement='''      tests: (lang === "en" ? TESTS_EN : TESTS).map((t) => ({
        name: t.name, topic: t.topic, what: t.what, time: t.time, cut: t.cut, source: t.source,
        labelDuration: labels.duration, labelThreshold: labels.threshold, labelVersion: labels.version, labelStart: labels.start,'''
if 'labelDuration: labels.duration' not in s:
    if needle not in s:
        raise SystemExit('No encuentro el mapa de tests para añadir los rótulos bilingües a cada tarjeta.')
    s=s.replace(needle,replacement,1)

required=['{{ t.labelDuration }}','{{ t.labelThreshold }}','{{ t.labelVersion }}','{{ t.labelStart }}','duration: "How long it takes"','labelDuration: labels.duration']
missing=[x for x in required if x not in s]
if missing: raise SystemExit('Refinado incompleto: '+', '.join(missing))
p.write_text(s,encoding='utf-8')
print('Rótulos internos de Cuestionarios vinculados a cada tarjeta y al idioma del componente.')
