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
ok('SECTION_CAPS','firstCenter' in A and 'lastCenter' in A)
ok('SECTION_PROFILE_METADATA','sectionProfile' in A and 'sectionBody' in A)
ok('NO_PNG_RUNTIME_LOAD','cargarTextura(' not in P and 'leerAlfa(' not in P and 'alfas[' not in P)
ok('PER_FRAGMENT_REVEAL','vIGWorld' in A and 'uIGLuzPos' in A and 'totalEmissiveRadiance' in A)
ok('NO_GLOBAL_CENTER_REVEAL','valorMascara(m.position)' not in P)
ok('NO_CAMERA_FACING_ROOT','Math.atan2(E.camara.position.x - m.position.x' not in P and '.lookAt(E.camara' not in P)
ok('NO_ACTIVE_BILLBOARDS_DATA','"billboards"' not in D)
E=(root/'app'/'escena3d.js').read_text(encoding='utf-8')
active_js=A+'\n'+P+'\n'+E
ok('NO_DEAD_BILLBOARD_SHADERS',all(x not in E for x in ['const VERT =','const FRAG =','mapOscuro','mapLuz']))
ok('ACTIVE_CODE_NO_BILLBOARD_CLAIMS',all(x not in active_js.lower() for x in ['png sobre planos','no son modelos 3d','camera-facing planes']))
ok('R031_VERSION','vida-marina-3D-R03.1' in D)
proc=root/'procedencia'
src=proc/'datos3d-R03.1-source.json'
gen=proc/'gen_datos3d.py'
legacy=proc/'gen_datos3d_r02_historical.py'
ok('R031_SOURCE_JSON',src.exists())
ok('R031_GENERATOR',gen.exists() and 'R03.1 DATA SOURCE PASS' in gen.read_text(encoding='utf-8'))
ok('R02_GENERATOR_HISTORICAL',legacy.exists() or not (proc/'gen_datos3d.py').exists(),str(legacy))
if src.exists():
 import json
 sd=json.loads(src.read_text(encoding='utf-8'))
 ok('SOURCE_NO_BILLBOARDS','billboards' not in sd)
 ok('SOURCE_R031_VERSION',sd.get('version')=='vida-marina-3D-R03.1')
ok('TAXON_SCOPE','PROVISIONAL_3D_REPRESENTATION' in A and 'Myctophum punctatum' in A and 'Teuthowenia pellucida' in A)
ok('SQUID_8_ARMS_2_TENTACLES',"for(let i=0;i<8;i++)" in A and "'tentacle'" in A and "'tentacle-club'" in A)
ok('SQUID_3_PHOTOPHORES_PER_EYE',"'ocular-photophore'" in A and "for(const side of [-1,1])" in A)
ok('LANTERN_PECTORAL_ADIPOSE',"'pectoral-fin'" in A and "'adipose-fin'" in A)
ok('LANTERN_PHOTOPHORE_SERIES',all(x in A for x in ["'photophore-AOa'","'photophore-AOp'","'photophore-Prc'","'photophore-Pol'"]))
ok('HATCHET_DORSAL_EYES',"function eyeUp" in A and "'eye-up-pupil'" in A)
ok('HATCHET_DORSAL_BLADE',"'dorsal-blade'" in A)
for name in ['README.md','KEEP_CHANGE.md','LEEME_INTERNO.md']:
 s=(root/name).read_text(encoding='utf-8').lower()
 ok('DOC_'+name.upper().replace('.','_'),'png sobre planos' not in s and 'no son modelos 3d' not in s,name)
fail=[x for x in R if not x[1]]
for k,c,n in R: print(('PASA' if c else 'FALLA').ljust(7),k,n)
print(f'PASA {len(R)-len(fail)} · FALLA {len(fail)}')
raise SystemExit(1 if fail else 0)
