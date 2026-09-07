#!/usr/bin/env python3
from pathlib import Path
import re
p=Path('es/vivir-fuera/index.html')
s=p.read_text()
# Estos tres rótulos están en el molde, antes del bloque de datos.
patterns=[
    (r'(?<=>)Cómo funciona(?=</div>)','{{ tHow }}'),
    (r'(?<=>)Por dónde se empieza(?=</div>)','{{ tStart }}'),
    (r'(?<=>)Referencia(?=</div>)','{{ tReference }}'),
]
for pattern,replacement in patterns:
    s,n=re.subn(pattern,replacement,s,count=1)
    if n!=1 and replacement not in s:
        raise SystemExit('No se pudo convertir el rótulo: '+pattern)
template=s.split('<script type="text/x-dc"',1)[0]
for literal in ['>Cómo funciona</div>','>Por dónde se empieza</div>','>Referencia</div>']:
    if literal in template:raise SystemExit('Quedó un rótulo fijo en el molde: '+literal)
for variable in ['{{ tHow }}','{{ tStart }}','{{ tReference }}']:
    if variable not in template:raise SystemExit('Falta el rótulo variable: '+variable)
p.write_text(s)
print('Tres rótulos del molde sincronizados con ES/EN.')
