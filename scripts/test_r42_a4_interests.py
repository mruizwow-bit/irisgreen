#!/usr/bin/env python3
import json, pathlib, re
R=pathlib.Path(__file__).resolve().parents[1]
es=json.loads((R/'assets/data/r42-interests.es.json').read_text(encoding='utf-8'))
en=json.loads((R/'assets/data/r42-interests.en.json').read_text(encoding='utf-8'))
assert len(es['groups'])==len(en['groups'])==11
assert len(es['interests'])==len(en['interests'])==72
assert sum(x['source_ready'] for x in es['interests'])==43
assert sum(not x['source_ready'] for x in es['interests'])==29
for p in [R/'es/intereses/index.html',R/'en/interests/index.html']:
 t=p.read_text(encoding='utf-8'); assert 'r42-visual-stage' in t and t.find('r42-visual-stage')<t.find('r42-preview-deck'); assert t.count('r42-group-preview')==11
for data in (es,en):
 for x in data['interests']:
  p=R/(x['route'].lstrip('/')+'index.html'); assert p.exists()
  t=p.read_text(encoding='utf-8')
  assert 'r42-visual-stage' in t and 'role="tablist"' in t and t.count('role="tabpanel"')==4
  assert t.find('r42-visual-stage')<t.find('r42-inspector')
for p in [R/'es/intereses/cuaderno-de-campo/index.html',R/'en/interests/field-notebook/index.html']:
 t=p.read_text(encoding='utf-8'); assert 'r42-field-workspace' in t
 for token in ['REAL_DATA','SIMULATION','USER_CREATED','FICTIONAL','data-r42-field-map','data-field-location','data-field-wake']: assert token in t
for path in ['assets/r42-interests.js','assets/r42-field-notebook.js']:
 t=(R/path).read_text(encoding='utf-8'); assert 'localStorage' not in t and 'sessionStorage' not in t
assert '!important' not in (R/'assets/r42-interests.css').read_text(encoding='utf-8')
print('PASS R42-A4: 72/72 ES+EN explore-first, 11 groups, life stages, field workspace, no owned persistence')
