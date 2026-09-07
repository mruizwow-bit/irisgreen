#!/usr/bin/env python3
from pathlib import Path
p=Path('es/cuestionarios/index.html')
s=p.read_text(encoding='utf-8')

repls={
'''const UI_ES = {
  stateReady: "Disponible", stateExcluded: "No se publica", stateLoad: "Listo para cargar",''':'''const UI_ES = {
  duration: "Cuánto dura", threshold: "Umbral orientativo", version: "Versión que se usa y licencia", start: "Empezar el cuestionario",
  stateReady: "Disponible", stateExcluded: "No se publica", stateLoad: "Listo para cargar",''',
'''const UI_EN = {
  stateReady: "Available", stateExcluded: "Not published", stateLoad: "Ready to load",''':'''const UI_EN = {
  duration: "How long it takes", threshold: "Screening threshold", version: "Version used and licence", start: "Start questionnaire",
  stateReady: "Available", stateExcluded: "Not published", stateLoad: "Ready to load",''',
'''>Cuánto dura</div>''':''>{{ labelDuration }}</div>''',
'''>Umbral orientativo</div>''':''>{{ labelThreshold }}</div>''',
'''>Versión que se usa y licencia</div>''':''>{{ labelVersion }}</div>''',
'''>Empezar el cuestionario</button>''':''>{{ labelStart }}</button>''',
'''      langAviso: (LANGSTR[this.state.lang || "es"] || LANGSTR.es).aviso,

      tests:''':'''      langAviso: (LANGSTR[this.state.lang || "es"] || LANGSTR.es).aviso,
      labelDuration: labels.duration, labelThreshold: labels.threshold, labelVersion: labels.version, labelStart: labels.start,

      tests:'''
}
for a,b in repls.items():
    if a not in s:
        raise SystemExit('No encuentro el patrón esperado: '+a[:80])
    s=s.replace(a,b,1)

for required in ['{{ labelDuration }}','{{ labelThreshold }}','{{ labelVersion }}','{{ labelStart }}','duration: "How long it takes"']:
    if required not in s: raise SystemExit('Refinado incompleto: '+required)
p.write_text(s,encoding='utf-8')
print('Rótulos internos de Cuestionarios vinculados al idioma del componente.')
