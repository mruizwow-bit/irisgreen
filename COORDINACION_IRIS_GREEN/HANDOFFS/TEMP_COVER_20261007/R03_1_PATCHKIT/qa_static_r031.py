from pathlib import Path
import sys
root=Path(sys.argv[1])
A=(root/'app'/'animales3d.js').read_text(encoding='utf-8')
P=(root/'app'/'piloto3d.js').read_text(encoding='utf-8')
D=(root/'app'/'datos3d.js').read_text(encoding='utf-8')
R=[]
def ok(k,c,n=''): R.append((k,bool(c),n))
ok('SECTIONS_PRESENT','function cuerpoSecciones' in A)
ok('HATCHET_SECTIONS',"cuerpoSecciones(root,silver" in A)
ok('LANTERN_SECTIONS',"cuerpoSecciones(root,bodyMat" in A)
ok('NO_PNG_RUNTIME_LOAD','cargarTextura(' not in P and 'leerAlfa(' not in P and 'alfas[' not in P)
ok('PER_FRAGMENT_REVEAL','vIGWorld' in A and 'uIGLuzPos' in A and 'totalEmissiveRadiance' in A)
ok('NO_GLOBAL_CENTER_REVEAL','valorMascara(m.position)' not in P)
ok('NO_CAMERA_FACING_ROOT','Math.atan2(E.camara.position.x - m.position.x' not in P and '.lookAt(E.camara' not in P)
ok('NO_ACTIVE_BILLBOARDS_DATA','"billboards"' not in D)
ok('R031_VERSION','vida-marina-3D-R03.1' in D)
ok('TAXON_SCOPE','PROVISIONAL_3D_REPRESENTATION' in A and 'Myctophum punctatum' in A and 'Teuthowenia pellucida' in A)
for name in ['README.md','KEEP_CHANGE.md','LEEME_INTERNO.md']:
 s=(root/name).read_text(encoding='utf-8').lower()
 ok('DOC_'+name.upper().replace('.','_'),'png sobre planos' not in s and 'no son modelos 3d' not in s,name)
fail=[x for x in R if not x[1]]
for k,c,n in R: print(('PASA' if c else 'FALLA').ljust(7),k,n)
print(f'PASA {len(R)-len(fail)} · FALLA {len(fail)}')
raise SystemExit(1 if fail else 0)
