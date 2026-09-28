#!/usr/bin/env python3
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];P=ROOT/'assets/safety'
files={'condition':'age-classification-r51-conditions.json','situation':'age-classification-r51-situations.json','library':'age-classification-r51-library.json','data':'age-classification-r51-data.json','research':'age-classification-r51-research.json','support_directory':'age-classification-r51-support.json'}
expected={'condition':226,'situation':223,'library':62,'data':60,'research':132,'support_directory':262}
allowed={'AGE_0_12','AGE_13_17','AGE_18_PLUS','ALL_AGES'}
legacy={'children','teenagers','adults','any','INFANCIA','ADOLESCENCIA','ADULTEZ','TRANSVERSAL','CUALQUIER_EDAD'}
rows=[]
for surface,name in files.items():
 d=json.loads((P/name).read_text(encoding='utf-8'));rr=d['records'];assert len(rr)==expected[surface];assert d['totals']['unclassified']==0
 assert all(r['age_bands'] and set(r['age_bands'])<=allowed for r in rr)
 assert not any(set(r['age_bands'])&legacy for r in rr)
 assert not any(r['sensitivity']=='S2_HIGH_SENSITIVITY' and 'ALL_AGES' in r['age_bands'] for r in rr)
 rows.extend(rr)
g=json.loads((P/'age-classification-r51-global.json').read_text(encoding='utf-8'))
assert g['schema']=='R51_A2_GLOBAL_AGE_CLASSIFICATION/1.0'
assert g['source_manifest_sha256']=='51bba62b23c520f43b73630501432a8f4e2a94940f8459c7848149f77b202d5e'
assert len(rows)==965 and len({r['content_id'] for r in rows})==965
assert len(g['records'])==965 and len({r['content_id'] for r in g['records']})==965
assert g['totals']['unclassified']==0 and g['totals']['by_surface']==expected
by={r['title_es']:r for r in g['records']}
for title in ['Menopausia','Universidad','Empleo y neurodiversidad','Dejo cartas y facturas sin abrir hasta que ya es tarde','Estudiar en la universidad con apoyos','Empleo y discapacidad en España','Desenmascararse en estudiantes universitarios autistas','Reconocimiento de dependencia y PIA']:
 r=by[title];assert 'AGE_18_PLUS' in r['age_bands'];assert 'AGE_0_12' not in r['age_bands'] and 'ALL_AGES' not in r['age_bands']
assert 'AGE_0_12' in by['«Necesito una adaptación en clase»']['age_bands']
assert 'AGE_0_12' in by['Colegio e instituto: apoyos, adaptaciones, asistencia y exámenes']['age_bands']
print(json.dumps({'records':965,'unclassified':0,'by_surface':g['totals']['by_surface'],'bands':g['totals']['band_assignments'],'visible':g['totals']['visible_by_filter'],'PASS':True},ensure_ascii=False))
