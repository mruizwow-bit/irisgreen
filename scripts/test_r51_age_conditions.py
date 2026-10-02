#!/usr/bin/env python3
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
d=json.loads((ROOT/'assets/safety/age-classification-r51-conditions.json').read_text(encoding='utf-8'))
allowed={'AGE_0_12','AGE_13_17','AGE_18_PLUS','ALL_AGES'}
legacy={'children','teenagers','adults','any','INFANCIA','ADOLESCENCIA','ADULTEZ','TRANSVERSAL','CUALQUIER_EDAD'}
rows=d['records']
assert d['schema']=='R51_A2_AGE_CLASSIFICATION/1.0' and d['domain']=='condition'
assert d['source_manifest_sha256']=='51bba62b23c520f43b73630501432a8f4e2a94940f8459c7848149f77b202d5e'
assert len(rows)==226 and len({r['content_id'] for r in rows})==226
assert {r['content_id'] for r in rows}=={f'global-{i:03d}' for i in range(188,414)}
assert all(r['age_bands'] and set(r['age_bands'])<=allowed for r in rows)
assert not any(set(r['age_bands'])&legacy for r in rows)
assert not any(r['sensitivity']=='S2_HIGH_SENSITIVITY' and 'ALL_AGES' in r['age_bands'] for r in rows)
assert d['totals']['unclassified']==0
def visible(b):return sum(b in r['age_bands'] or 'ALL_AGES' in r['age_bands'] for r in rows)
assert d['totals']['visible_by_filter']=={'AGE_0_12':visible('AGE_0_12'),'AGE_13_17':visible('AGE_13_17'),'AGE_18_PLUS':visible('AGE_18_PLUS'),'ALL_AGES':sum('ALL_AGES' in r['age_bands'] for r in rows)}
adult={r['title_es'] for r in rows if r['age_bands']==['AGE_18_PLUS']}
child={r['title_es'] for r in rows if 'AGE_0_12' in r['age_bands'] or 'ALL_AGES' in r['age_bands']}
assert {'Menopausia','Universidad','Empleo y neurodiversidad'}<=adult
assert 'Menopausia' not in child and 'Universidad' not in child
print(json.dumps({'domain':'conditions','records':226,'unclassified':0,'visible':d['totals']['visible_by_filter'],'PASS':True},ensure_ascii=False))
