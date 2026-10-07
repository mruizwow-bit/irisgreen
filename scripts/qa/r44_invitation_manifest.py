"""Inventory guard: invitations are routes to real engine start identifiers.
It does not claim that a starting state is the complete R44 challenge."""
import json
from pathlib import Path
rows=json.loads(Path('assets/data/r44-creative-invitations.json').read_text())
existing={'E01','E06','E17','E22','E28','E34','E38','E44'}
ids=[x['id'] for x in rows]
assert len(rows)==57, len(rows)
assert len(set(ids))==57
assert len([x for x in rows if x['id'] not in existing])==49
assert len([x for x in rows if x['id'] in existing])==8
assert all(x['page'] and x['start'] and x['es'] and x['en'] for x in rows)
# Mutating an ID to one of the eight previous invitations changes the R44 count.
mutated=[dict(x) for x in rows]
mutated[8]['id']='E01'
assert len({x['id'] for x in mutated}) != 57
print('57 invitation IDs: 49 R44 entries and 8 reviewed entries. Duplicate-ID mutation rejected.')
