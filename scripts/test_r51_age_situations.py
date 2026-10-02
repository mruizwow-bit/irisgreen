#!/usr/bin/env python3
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
d=json.loads((ROOT/'assets/safety/age-classification-r51-situations.json').read_text(encoding='utf-8'))
rows=d['records']
allowed={'AGE_0_12','AGE_13_17','AGE_18_PLUS','ALL_AGES'}
legacy={'children','teenagers','adults','any','INFANCIA','ADOLESCENCIA','ADULTEZ','TRANSVERSAL','CUALQUIER_EDAD'}
expected={f'global-{i:03d}' for i in range(1,188)}|{f'global-{i}' for i in range(414,450)}
assert d['schema']=='R51_A2_AGE_CLASSIFICATION/1.0' and d['domain']=='situation'
assert d['source_manifest_sha256']=='51bba62b23c520f43b73630501432a8f4e2a94940f8459c7848149f77b202d5e'
assert len(rows)==223 and len({r['content_id'] for r in rows})==223
assert {r['content_id'] for r in rows}==expected
assert all(r['age_bands'] and set(r['age_bands'])<=allowed for r in rows)
assert not any(set(r['age_bands'])&legacy for r in rows)
assert not any(r['sensitivity']=='S2_HIGH_SENSITIVITY' and 'ALL_AGES' in r['age_bands'] for r in rows)
assert d['totals']['unclassified']==0
by_title={r['title_es']:r for r in rows}
for title in [
 'Dejo cartas y facturas sin abrir hasta que ya es tarde',
 'Hablar por teléfono con una administración me bloquea',
 'Conducir me cansa muchísimo más que a otras personas',
 'Una entrevista de trabajo me deja sin recursos'
]:
 assert by_title[title]['age_bands']==['AGE_18_PLUS'],title
assert by_title['«Necesito una adaptación en clase»']['age_bands']==['AGE_0_12','AGE_13_17']
assert 'ALL_AGES' in by_title['El ruido me resulta insoportable']['age_bands']
def visible(b): return sum(b in r['age_bands'] or 'ALL_AGES' in r['age_bands'] for r in rows)
assert d['totals']['visible_by_filter']=={
 'AGE_0_12':visible('AGE_0_12'),
 'AGE_13_17':visible('AGE_13_17'),
 'AGE_18_PLUS':visible('AGE_18_PLUS'),
 'ALL_AGES':sum('ALL_AGES' in r['age_bands'] for r in rows)}
print(json.dumps({'domain':'situations','records':223,'unclassified':0,'visible':d['totals']['visible_by_filter'],'PASS':True},ensure_ascii=False))
