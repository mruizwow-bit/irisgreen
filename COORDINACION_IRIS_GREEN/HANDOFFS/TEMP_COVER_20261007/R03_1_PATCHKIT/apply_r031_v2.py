from pathlib import Path
import re, json, sys

if len(sys.argv) != 2:
    raise SystemExit('uso: python apply_r031.py <ruta_paquete_R03>')
root = Path(sys.argv[1])
A=root/'app'/'animales3d.js'; P=root/'app'/'piloto3d.js'; D=root/'app'/'datos3d.js'; E=root/'app'/'escena3d.js'
for f in (A,P,D,E):
    if not f.exists(): raise SystemExit(f'falta {f}')

s=A.read_text(encoding='utf-8')

# Argyropelecus: helper de ojo tubular orientado dorsalmente.
if 'function eyeUp' not in s:
    eye_marker=r"""function eye\(parent, x,y,z,r=0\.012\)\{.*?\n\}"""
    eye_match=re.search(eye_marker,s,flags=re.S)
    if eye_match:
        eye_up=r'''function eyeUp(parent, x,y,z,r=0.012){
  const white=mat(0xb8cad6,{roughness:0.34});
  const dark=mat(0x03070a,{roughness:0.18});
  sphere(parent,white,[x,y,z],[r*1.65,r*2.35,r*1.45],'eye-up',18);
  sphere(parent,dark,[x,y+r*0.92,z],[r*0.72,r*0.62,r*0.62],'eye-up-pupil',16);
}'''
        s=s[:eye_match.end()]+"\n"+eye_up+s[eye_match.end():]

if 'vIGWorld' not in s:
    pat=r"const mat = \(color, opts=\{\}\) => new THREE\.MeshStandardMaterial\(\{.*?\n\}\);"
    repl=r'''const mat = (color, opts={}) => {
  const m = new THREE.MeshStandardMaterial({
    color, roughness: opts.roughness ?? 0.52, metalness: opts.metalness ?? 0.08,
    transparent: !!opts.transparent, opacity: opts.opacity ?? 1,
    side: opts.side ?? THREE.FrontSide, depthWrite: opts.depthWrite ?? true,
    emissive: opts.emissive ?? color, emissiveIntensity: opts.emissiveIntensity ?? 0.055
  });
  if (!opts.noReveal) {
    const u = {
      uIGLuzPos:{value:new THREE.Vector3()}, uIGLuzDir:{value:new THREE.Vector3(0,0,-1)},
      uIGSemiExt:{value:10.5*Math.PI/180}, uIGSemiInt:{value:4.4*Math.PI/180},
      uIGAlcance:{value:1.8}, uIGNucleo:{value:0.74}, uIGGain:{value:opts.revealGain ?? 0.72}
    };
    m.userData.revealUniforms=u;
    m.onBeforeCompile=(shader)=>{
      Object.assign(shader.uniforms,u);
      shader.vertexShader=shader.vertexShader
        .replace('void main() {','varying vec3 vIGWorld;\\nvoid main() {')
        .replace('#include <begin_vertex>','#include <begin_vertex>\\n  vIGWorld=(modelMatrix*vec4(transformed,1.0)).xyz;');
      shader.fragmentShader=shader.fragmentShader
        .replace('void main() {','varying vec3 vIGWorld;\\nuniform vec3 uIGLuzPos,uIGLuzDir;\\nuniform float uIGSemiExt,uIGSemiInt,uIGAlcance,uIGNucleo,uIGGain;\\nvoid main() {')
        .replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\\n'
          + 'vec3 igV=vIGWorld-uIGLuzPos; float igD=length(igV); float igM=0.0;\\n'
          + 'if(igD<1e-5){igM=1.0;}else{float igFi=acos(clamp(dot(igV/igD,uIGLuzDir),-1.0,1.0));\\n'
          + 'float igA=clamp((uIGSemiExt-igFi)/max(1e-5,uIGSemiExt-uIGSemiInt),0.0,1.0);\\n'
          + 'float igRin=uIGNucleo*uIGAlcance; float igR=clamp((uIGAlcance-igD)/max(1e-5,uIGAlcance-igRin),0.0,1.0); igM=igA*igR;}\\n'
          + 'totalEmissiveRadiance += diffuseColor.rgb*(uIGGain*igM);');
      m.userData.shader=shader;
    };
    m.customProgramCacheKey=()=> 'ig-r031-cone-reveal-v1';
  }
  return m;
};'''
    s,n=re.subn(pat,repl,s,count=1,flags=re.S)
    if n!=1: raise SystemExit('no encuentro const mat')

if 'function cuerpoSecciones' not in s:
    marker='function brazoCurvo'
    i=s.find(marker)
    if i<0: raise SystemExit('no encuentro brazoCurvo para insertar cuerpoSecciones')
    fn=r'''function cuerpoSecciones(parent, material, sections, radial=20, role='body'){
  const verts=[], idx=[];
  for(let i=0;i<sections.length;i++){
    const q=sections[i];
    for(let j=0;j<radial;j++){
      const a=j/radial*Math.PI*2, sy=Math.sin(a), cz=Math.cos(a);
      const ry=sy>=0?(q.ryTop??q.ry):(q.ryBottom??q.ry);
      verts.push(q.x,(q.cy||0)+sy*ry,cz*q.rz);
    }
  }
  for(let i=0;i<sections.length-1;i++) for(let j=0;j<radial;j++){
    const n=(j+1)%radial,a=i*radial+j,b=i*radial+n,c=(i+1)*radial+n,d=(i+1)*radial+j;
    idx.push(a,b,d,b,c,d);
  }
  /* Cerrar ambos extremos. Sin estas tapas, el cuerpo sería volumétrico de lado
     pero mostraría un agujero al verlo de frente o desde atrás. */
  const firstCenter=verts.length/3;
  verts.push(sections[0].x,sections[0].cy||0,0);
  const lastCenter=verts.length/3;
  const last=sections[sections.length-1];
  verts.push(last.x,last.cy||0,0);
  const lastBase=(sections.length-1)*radial;
  for(let j=0;j<radial;j++){
    const n=(j+1)%radial;
    idx.push(firstCenter,n,j);
    idx.push(lastCenter,lastBase+j,lastBase+n);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
  g.setIndex(idx); g.computeVertexNormals(); g.computeBoundingSphere();
  const mesh=addMesh(parent,g,material,[0,0,0],[0,0,0],[1,1,1],role);
  mesh.userData.sectionBody=true;
  mesh.userData.sectionCount=sections.length;
  mesh.userData.radialSegments=radial;
  mesh.userData.sectionProfile=sections.map(q=>({x:q.x,cy:q.cy||0,ryTop:q.ryTop??q.ry,ryBottom:q.ryBottom??q.ry,rz:q.rz}));
  return mesh;
}
'''
    s=s[:i]+fn+s[i:]

if 'cuerpoSecciones(root,silver' not in s:
    hat=r'''const body=cuerpoSecciones(root,silver,[
    {x:-L*0.46,ryTop:L*0.09,ryBottom:L*0.10,rz:L*0.035},
    {x:-L*0.34,ryTop:L*0.19,ryBottom:L*0.24,rz:L*0.065,cy:-L*0.02},
    {x:-L*0.12,ryTop:L*0.27,ryBottom:L*0.39,rz:L*0.090,cy:-L*0.05},
    {x:L*0.13,ryTop:L*0.25,ryBottom:L*0.36,rz:L*0.095,cy:-L*0.05},
    {x:L*0.31,ryTop:L*0.20,ryBottom:L*0.24,rz:L*0.085,cy:-L*0.02},
    {x:L*0.45,ryTop:L*0.10,ryBottom:L*0.11,rz:L*0.050}
  ],24,'body');'''
    s,n=re.subn(r"const body=cuerpoExtrudido\(root,silver,.*?,'body'\);",hat,s,count=1,flags=re.S)
    if n!=1: raise SystemExit('no encuentro cuerpo hacha')

# Argyropelecus: ojos dorsales y lámina dorsal genérica segura a nivel de género.
s=s.replace("eye(root,L*0.38,L*0.18,L*0.07,L*0.055);","eyeUp(root,L*0.38,L*0.18,L*0.07,L*0.055);")
s=s.replace("eye(root,L*0.38,L*0.18,-L*0.07,L*0.055);","eyeUp(root,L*0.38,L*0.18,-L*0.07,L*0.055);")
if "'dorsal-blade'" not in s:
    hatchet_fin=r"""(function makeHatchet\(a,L\)\{.*?const finMat=.*?;\n)"""
    blade=r'''\1  fin(root,dark,[[-L*0.05,L*0.20,0],[-L*0.16,L*0.43,0],[-L*0.24,L*0.22,0]],'dorsal-blade');
'''
    s,n=re.subn(hatchet_fin,blade,s,count=1,flags=re.S)
    if n!=1: raise SystemExit('no encuentro inserción de dorsal blade en Argyropelecus')

if 'cuerpoSecciones(root,bodyMat' not in s:
    lan=r'''const body=cuerpoSecciones(root,bodyMat,[
    {x:-L*0.49,ry:L*0.040,rz:L*0.035},{x:-L*0.38,ry:L*0.085,rz:L*0.075},
    {x:-L*0.20,ry:L*0.135,rz:L*0.105},{x:L*0.05,ry:L*0.155,rz:L*0.120},
    {x:L*0.25,ry:L*0.140,rz:L*0.112},{x:L*0.40,ry:L*0.105,rz:L*0.090},
    {x:L*0.49,ry:L*0.060,rz:L*0.050}
  ],24,'body');
  const bellyMesh=cuerpoSecciones(root,belly,[
    {x:-L*0.40,ryTop:L*0.035,ryBottom:L*0.045,rz:L*0.060,cy:-L*0.055},
    {x:-L*0.18,ryTop:L*0.045,ryBottom:L*0.060,rz:L*0.085,cy:-L*0.080},
    {x:L*0.08,ryTop:L*0.050,ryBottom:L*0.065,rz:L*0.095,cy:-L*0.085},
    {x:L*0.31,ryTop:L*0.038,ryBottom:L*0.050,rz:L*0.072,cy:-L*0.070}
  ],18,'belly');'''
    pat=r"const body=cuerpoExtrudido\(root,bodyMat,.*?,'body'\);\s*const bellyMesh=cuerpoExtrudido\(root,belly,.*?,'belly'\);"
    s,n=re.subn(pat,lan,s,count=1,flags=re.S)
    if n!=1: raise SystemExit('no encuentro cuerpo linterna')

s=s.replace('emissiveIntensity:1.8,roughness:0.25});','emissiveIntensity:1.8,roughness:0.25,noReveal:true});')
s=s.replace('emissiveIntensity:2.4,roughness:0.2});','emissiveIntensity:2.4,roughness:0.2,noReveal:true});')

# Myctophum punctatum: añadir pectorales pareadas y aleta adiposa si faltan.
if "'adipose-fin'" not in s:
    lantern_photo=r"""(function makeLantern\(a,L\)\{.*?)(  const photo=mat\(0xb7efff,\{emissive:0x6bcbe8,emissiveIntensity:2\.4,roughness:0\.2,noReveal:true\}\);)"""
    fin_block=r'''\1  /* Pectorales pareadas cerca del opérculo y pequeña adiposa posterior. */
  fin(root,finMat,[[L*0.22,-L*0.01,L*0.085],[L*0.04,-L*0.08,L*0.18],[L*0.06,L*0.025,L*0.10]],'pectoral-fin');
  fin(root,finMat,[[L*0.22,-L*0.01,-L*0.085],[L*0.04,-L*0.08,-L*0.18],[L*0.06,L*0.025,-L*0.10]],'pectoral-fin');
  fin(root,finMat,[[-L*0.30,L*0.075,0],[-L*0.38,L*0.145,0],[-L*0.42,L*0.065,0]],'adipose-fin');
\2'''
    s,n=re.subn(lantern_photo,fin_block,s,count=1,flags=re.S)
    if n!=1: raise SystemExit('no encuentro inserción estable de aletas en pez linterna')

s=s.replace('emissiveIntensity:2.1});','emissiveIntensity:2.1,noReveal:true});')

# Teuthowenia pellucida: 8 brazos + 2 tentáculos; brazos agrupados hacia delante.
if "'tentacle-club'" not in s:
    arm_pat=r"""  for\(let i=0;i<8;i\+\+\)\{.*?\n  \}"""
    arm_repl=r'''  for(let i=0;i<8;i++){
    const ang=(i/8)*Math.PI*2;
    const y=Math.sin(ang)*L*0.085, z=Math.cos(ang)*L*0.085;
    const len=L*(0.27+(i%3)*0.025);
    /* Bases rodean la corona; las puntas convergen hacia un haz anterior para
       evitar el aspecto radial/estrella. */
    brazoCurvo(arms,armMat,[
      [0,y,z],[-len*0.34,y*0.92,z*0.92],
      [-len*0.72,y*0.66+Math.sin(ang)*L*0.012,z*0.66+Math.cos(ang)*L*0.012],
      [-len,y*0.46,z*0.46]
    ],L*0.014,'arm');
  }
  /* Dos tentáculos diferenciados y más largos. No se detallan ventosas/club
     más allá de un engrosamiento terminal prudente: esa microanatomía no es
     necesaria para este vertical slice. */
  for(const side of [-1,1]){
    const z=side*L*0.045, len=L*0.56;
    brazoCurvo(arms,armMat,[
      [0,-L*0.015,z],[-len*0.32,-L*0.010,z*0.85],
      [-len*0.72,L*0.005,z*0.62],[-len,L*0.012,z*0.42]
    ],L*0.011,'tentacle');
    sphere(arms,armMat,[-len,L*0.012,z*0.42],[L*0.045,L*0.022,L*0.018],'tentacle-club',12);
  }'''
    s,n=re.subn(arm_pat,arm_repl,s,count=1,flags=re.S)
    if n!=1: raise SystemExit('no encuentro bucle de 8 brazos del calamar')

# Teuthowenia: tres fotóforos por ojo (seis en total), no uno por lado.
photo_pat=r"""  const photo=mat\(0xcffcff,\{emissive:0x86dfe9,emissiveIntensity:2\.1,noReveal:true\}\);\n  sphere\(root,photo,\[-L\*0\.27,-L\*0\.03,L\*0\.14\].*?\n  sphere\(root,photo,\[-L\*0\.27,-L\*0\.03,-L\*0\.14\].*?;"""
photo_repl=r'''  const photo=mat(0xcffcff,{emissive:0x86dfe9,emissiveIntensity:2.1,noReveal:true});
  for(const side of [-1,1]){
    const z=side*L*0.14;
    sphere(root,photo,[-L*0.285,-L*0.015,z],[L*0.018,L*0.018,L*0.014],'ocular-photophore',10);
    sphere(root,photo,[-L*0.260,-L*0.045,z],[L*0.017,L*0.017,L*0.013],'ocular-photophore',10);
    sphere(root,photo,[-L*0.235,-L*0.015,z],[L*0.016,L*0.016,L*0.012],'ocular-photophore',10);
  }'''
s,n=re.subn(photo_pat,photo_repl,s,count=1,flags=re.S)
if n not in (0,1): raise SystemExit('fotóforos calamar ambiguos')
A.write_text(s,encoding='utf-8')

s=P.read_text(encoding='utf-8')
s=s.replace('let E = null, raycaster = null, alfas = {};','let E = null, raycaster = null;')
s=re.sub(r"/\* ---------- carga ---------- \*/.*?/\* ---------- máscara del haz, la misma fórmula que en 2D ---------- \*/",
'''/* ---------- carga ----------
   R03.1 no necesita cargar PNG para construir ni seleccionar los cuerpos 3D.
   Los assets permanecen como referencia/procedencia/ficha. */

/* ---------- máscara del haz, la misma fórmula que en 2D ---------- */''',s,count=1,flags=re.S)
s=re.sub(r"\s*const\s+cargas\s*=\s*\[\]\s*;\s*for\s*\(const\s+a\s+of\s+D\.catalogo\)\s*\{.*?await\s+Promise\.all\(cargas\)\s*;",
'''\n  for (const a of D.catalogo) {
    const m = crearAnimal(a);
    E.escena.add(m);
    estado.animales.push(m);
  }''',s,count=1,flags=re.S)
if 'valorMascara(m.position)' in s:
    s,n=re.subn(r"\s*const Mvol\s*=\s*valorMascara\(m\.position\);.*?m\.traverse\(\(o\)\s*=>\s*\{.*?\}\);",
'''\n    /* R03.1: revelado por fragmento. */
    m.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      const ru=o.material.userData && o.material.userData.revealUniforms;
      if (!ru) return;
      ru.uIGLuzPos.value.copy(E.luz.pos); ru.uIGLuzDir.value.copy(E.luz.dir);
      ru.uIGSemiExt.value=HAZ.semiExterior; ru.uIGSemiInt.value=HAZ.semiInterior;
      ru.uIGAlcance.value=HAZ.alcance; ru.uIGNucleo.value=HAZ.nucleo;
    });''',s,count=1,flags=re.S)
    if n!=1: raise SystemExit('no puedo sustituir revelado global')
P.write_text(s,encoding='utf-8')

s=D.read_text(encoding='utf-8')
m=re.match(r'\s*window\.IG_DATOS\s*=\s*(\{.*\});\s*$',s,re.S)
if not m: raise SystemExit('no puedo parsear datos3d.js')
d=json.loads(m.group(1)); d['version']='vida-marina-3D-R03.1'; d['generado']='2026-10-07'; d.pop('billboards',None)
d['volumen3D']={'tipo':'geometria-procedural-runtime','version':'R03.1','runtimeBodyDependsOnPNG':False,
 'raycast':'geometria-real-recursiva','iluminacion':'normales-reales + revelado por fragmento',
 'orientacion':'trayectoria-del-animal, no camera-facing','escala':'scale=[1,1,1]',
 'estados':{'prof-pez-hacha':'PROVISIONAL_3D_REPRESENTATION','prof-pez-linterna':'TRUE_3D_FACTUAL_REPRESENTATION_CANDIDATE','prof-calamar-cristal':'TRUE_3D_FACTUAL_REPRESENTATION_CANDIDATE'}}
if 'release3D' in d:
 d['release3D']['version']='R03.1'; d['release3D']['direccion']='WORLD_FIRST · SCENE_AS_PRIMARY_INTERFACE · TRUE_VOLUME_CORE_ANIMALS'
D.write_text('window.IG_DATOS = '+json.dumps(d,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')

# ---------- source of truth R03.1 ----------
proc=root/'procedencia'; proc.mkdir(exist_ok=True)
source=proc/'datos3d-R03.1-source.json'
source.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
legacy=proc/'gen_datos3d_r02_historical.py'
gen=proc/'gen_datos3d.py'
if gen.exists() and not legacy.exists():
    gen.replace(legacy)
generator = """from pathlib import Path
import json, sys
HERE=Path(__file__).resolve().parent
ROOT=HERE.parent
SRC=HERE/'datos3d-R03.1-source.json'
OUT=ROOT/'app'/'datos3d.js'
if not SRC.exists(): raise SystemExit('falta source R03.1')
d=json.loads(SRC.read_text(encoding='utf-8'))
render='window.IG_DATOS = '+json.dumps(d,ensure_ascii=False,separators=(',',':'))+';\\n'
if '--verificar' in sys.argv:
    if not OUT.exists() or OUT.read_text(encoding='utf-8')!=render:
        raise SystemExit('R03.1 DATA SOURCE MISMATCH')
    print('R03.1 DATA SOURCE PASS')
else:
    OUT.write_text(render,encoding='utf-8')
    print('R03.1 DATA REGENERATED')
"""
gen.write_text(generator,encoding='utf-8')

(root/'README.md').write_text('# Vida marina 3D · R03.1 · True volume core animals\n\nMundo WORLD_FIRST heredado de R02. Animales centrales = cuerpos volumétricos procedurales. Peces por secciones variables; raycast real; orientación por trayectoria; revelado por fragmento; PNG solo referencia/procedencia/ficha.\n\nArgyropelecus PROVISIONAL; Myctophum punctatum y Teuthowenia pellucida candidatos factuales.\n\nNO MAIN · NO DEPLOY · NO SCALE 200+.\n',encoding='utf-8')
(root/'KEEP_CHANGE.md').write_text('# R02 → R03.1 · KEEP / CHANGE\n\nKEEP: mundo/cámara/talud/partículas/haz/múltiples candidatos/NORMAL-REDUCED-NONE/ES-EN/calamar bloqueado.\n\nCHANGE: billboards→volumen; camera-facing→trayectoria; plano+alfa→raycast real; luz por centro→luz por fragmento; perfil extruido→secciones variables; PNG runtime→PNG referencia.\n',encoding='utf-8')
(root/'LEEME_INTERNO.md').write_text('# Vida marina 3D R03.1 · notas internas\n\nGrosor no equivale a morfología 3D. R03.1 usa secciones variables y revelado por superficie. Argyropelecus sigue provisional; longitudes sin validar; calamar con observable bloqueado.\n',encoding='utf-8')
s=E.read_text(encoding='utf-8')
s=re.sub(r'/\* escena3d\.js.*?\*/','/* escena3d.js — Vida marina 3D R03.1. Mundo/cámara/haz R02; animales centrales volumétricos; PNG solo referencia. */',s,count=1,flags=re.S)
E.write_text(s,encoding='utf-8')
print('R03.1_PATCH_APPLIED')
