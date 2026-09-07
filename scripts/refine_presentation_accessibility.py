#!/usr/bin/env python3
"""Corrección acotada: actualizar los controles de presentación en cada cambio.
No modifica los valores guardados ni el comportamiento de los temas.
"""
from pathlib import Path
p=Path('assets/preferencias-lectura.js')
s=p.read_text()
old='    syncStatic();syncTextOptions();\n'
new='    syncStatic();syncTextOptions();syncPresentationOptions();\n'
if new not in s:
    assert s.count(old)==1, f'Ancla inesperada: {s.count(old)}'
    s=s.replace(old,new,1)
    p.write_text(s)
    print('Sincronización de controles de presentación añadida.')
else:
    print('Sincronización ya presente; no se duplica.')
