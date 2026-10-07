from pathlib import Path
import re, json

ROOT = Path(__file__).resolve().parent
TARGET = Path(__import__('sys').argv[1]) if len(__import__('sys').argv) > 1 else None
if not TARGET:
    raise SystemExit('uso: python apply_r031.py <ruta_paquete_R03>')

A = TARGET/'app'/'animales3d.js'
P = TARGET/'app'/'piloto3d.js'
D = TARGET/'app'/'datos3d.js'
E = TARGET/'app'/'escena3d.js'
for f in (A,P,D,E):
    if not f.exists(): raise SystemExit(f'falta {f}')

s=A.read_text(encoding='utf-8')
if 'function cuerpoSecciones' not in s:
    needle="""function cuerpoExtrudido(parent, material, pts, depth, bevel, role='body'){\n  const s=new THREE.Shape();\n  s.moveTo(pts[0][0],pts[0][1]);\n  for(let i=1;i<pts.length;i++) s.lineTo(pts[i][0],pts[i][1]);\n  s.closePath();\n  const g=new THREE.ExtrudeGeometry(s,{depth,steps:1,bevelEnabled:true,bevelThickness:bevel,bevelSize:bevel,bevelSegments:3,curveSegments:10});\n  g.translate(0,0,-depth/2);\n  g.computeVertexNormals();\n  return addMesh(parent,g,material,[0,0,0],[0,0,0],[1,1,1],role);\n}\n"""
    add=needle+"""function cuerpoSecciones(parent, material, sections, radial=20, role='body'){\n  const verts=[], idx=[];\n  for(let i=0;i<sections.length;i++){\n    const q=sections[i];\n    for(let j=0;j<radial;j++){\n      const a=j/radial*Math.PI*2, sy=Math.sin(a), cz=Math.cos(a);\n      const ry=sy>=0?(q.ryTop??q.ry):(q.ryBottom??q.ry);\n      verts.push(q.x,(q.cy||0)+sy*ry,cz*q.rz);\n    }\n  }\n  for(let i=0;i<sections.length-1;i++) for(let j=0;j<radial;j++){\n    const n=(j+1)%radial,a=i*radial+j,b=i*radial+n,c=(i+1)*radial+n,d=(i+1)*radial+j;\n    idx.push(a,b,d,b,c,d);\n  }\n  const g=new THREE.BufferGeometry();\n  g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));\n  g.setIndex(idx); g.computeVertexNormals(); g.computeBoundingSphere();\n  return addMesh(parent,g,material,[0,0,0],[0,0,0],[1,1,1],role);\n}\n"""
    if needle not in s: raise SystemExit('no encuentro cuerpoExtrudido')
    s=s.replace(needle,add,1)

s=re.sub(r"const body=cuerpoExtrudido\(root,silver,\[.*?\],L\*0\.18,L\*0\.018,'body'\);",
"""const body=cuerpoSecciones(root,silver,[
    {x:-L*0.46,ryTop:L*0.09,ryBottom:L*0.10,rz:L*0.035},
    {x:-L*0.34,ryTop:L*0.19,ryBottom:L*0.24,rz:L*0.065,cy:-L*0.02},
    {x:-L*0.12,ryTop:L*0.27,ryBottom:L*0.39,rz:L*0.090,cy:-L*0.05},
    {x: L*0.13,ryTop:L*0.25,ryBottom:L*0.36,rz:L*0.095,cy:-L*0.05},
    {x: L*0.31,ryTop:L*0.20,ryBottom:L*0.24,rz:L*0.085,cy:-L*0.02},
    {x: L*0.45,ryTop:L*0.10,ryBottom:L*0.11,rz:L*0.050}
  ],24,'body');""",s,count=1,flags=re.S)

s=re.sub(r"const body=cuerpoExtrudido\(root,bodyMat,\[.*?\],L\*0\.20,L\*0\.018,'body'\);\s*const bellyMesh=cuerpoExtrudido\(root,belly,\[.*?\],L\*0\.17,L\*0\.012,'belly'\);",
"""const body=cuerpoSecciones(root,bodyMat,[
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
  ],18,'belly');""",s,count=1,flags=re.S)

s=s.replace("emissiveIntensity:1.8,roughness:0.25});","emissiveIntensity:1.8,roughness:0.25,noReveal:true});")
s=s.replace("emissiveIntensity:2.4,roughness:0.2});","emissiveIntensity:2.4,roughness:0.2,noReveal:true});")
s=s.replace("emissiveIntensity:2.1});","emissiveIntensity:2.1,noReveal:true});")
A.write_text(s,encoding='utf-8')

s=P.read_text(encoding='utf-8')
s=s.replace('let E = null, raycaster = null, alfas = {};','let E = null, raycaster = null;')
s=re.sub(r"/\* ---------- carga ---------- \*/.*?/\* ---------- máscara del haz, la misma fórmula que en 2D ---------- \*/",
"""/* ---------- carga ----------
   R03.1 no necesita cargar PNG para construir ni seleccionar los cuerpos 3D.
   Los assets permanecen como referencia/procedencia/ficha. */

/* ---------- máscara del haz, la misma fórmula que en 2D ---------- */""",s,count=1,flags=re.S)
s=re.sub(r"\s*const cargas = \[\];\s*for \(const a of D\.catalogo\) \{.*?await Promise\.all\(cargas\);",
"""\n  for (const a of D.catalogo) {
    const m = crearAnimal(a);
    E.escena.add(m);
    estado.animales.push(m);
  }""",s,count=1,flags=re.S)
s=re.sub(r"\s*/\* El cuerpo 3D necesita seguir.*?\n\s*\}\);",
"""\n    /* R03.1: revelado por fragmento. Cada material usa la misma luz lógica
       y calcula la máscara con la posición de su propia superficie. */
    m.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      const ru=o.material.userData && o.material.userData.revealUniforms;
      if (!ru) return;
      ru.uIGLuzPos.value.copy(E.luz.pos); ru.uIGLuzDir.value.copy(E.luz.dir);
      ru.uIGSemiExt.value=HAZ.semiExterior; ru.uIGSemiInt.value=HAZ.semiInterior;
      ru.uIGAlcance.value=HAZ.alcance; ru.uIGNucleo.value=HAZ.nucleo;
    });""",s,count=1,flags=re.S)
P.write_text(s,encoding='utf-8')

s=D.read_text(encoding='utf-8')
m=re.match(r'\s*window\.IG_DATOS\s*=\s*(\{.*\});\s*$',s,re.S)
if not m: raise SystemExit('no puedo parsear datos3d.js')
d=json.loads(m.group(1))
d['version']='vida-marina-3D-R03.1'; d['generado']='2026-10-07'; d.pop('billboards',None)
d['volumen3D']={
 'tipo':'geometria-procedural-runtime','version':'R03.1','runtimeBodyDependsOnPNG':False,
 'raycast':'geometria-real-recursiva','iluminacion':'normales-reales + revelado por fragmento',
 'orientacion':'trayectoria-del-animal, no camera-facing','escala':'scale=[1,1,1]',
 'estados':{'prof-pez-hacha':'PROVISIONAL_3D_REPRESENTATION','prof-pez-linterna':'TRUE_3D_FACTUAL_REPRESENTATION_CANDIDATE','prof-calamar-cristal':'TRUE_3D_FACTUAL_REPRESENTATION_CANDIDATE'}
}
if 'release3D' in d:
 d['release3D']['version']='R03.1'; d['release3D']['direccion']='WORLD_FIRST · SCENE_AS_PRIMARY_INTERFACE · TRUE_VOLUME_CORE_ANIMALS'
D.write_text('window.IG_DATOS = '+json.dumps(d,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')

(TARGET/'README.md').write_text('# Vida marina 3D · R03.1 · True volume core animals\n\nMundo WORLD_FIRST heredado de R02. Los tres animales centrales son cuerpos volumétricos procedurales.\n\n- No PlaneGeometry/billboards como cuerpo.\n- Peces construidos por secciones variables.\n- Raycast sobre geometría real.\n- Orientación por trayectoria, no a cámara.\n- Revelado por fragmento según el haz.\n- PNG conservado solo como referencia/procedencia/ficha.\n\nEstados: Argyropelecus PROVISIONAL; Myctophum punctatum y Teuthowenia pellucida candidatos factuales.\n\nNO MAIN · NO DEPLOY · NO SCALE 200+.\n',encoding='utf-8')
(TARGET/'KEEP_CHANGE.md').write_text('# R02 → R03.1 · KEEP / CHANGE\n\nKEEP: mundo, cámara, talud, partículas, haz, múltiples candidatos, NORMAL/REDUCED/NONE, ES/EN y bloqueo del calamar.\n\nCHANGE: billboards → cuerpos volumétricos; camera-facing → trayectoria; plano+alfa → raycast real; luz por centro → luz por fragmento; perfil extruido → secciones variables; PNG runtime → PNG referencia.\n',encoding='utf-8')
(TARGET/'LEEME_INTERNO.md').write_text('# Vida marina 3D R03.1 · notas internas\n\nLa lección principal es que grosor no equivale a morfología 3D. R03.1 usa secciones variables y revelado por superficie. Argyropelecus sigue provisional; longitudes sin validar; calamar con observable bloqueado.\n',encoding='utf-8')

s=E.read_text(encoding='utf-8')
s=re.sub(r'/\* escena3d\.js.*?\*/',"""/* escena3d.js — Vida marina 3D R03.1
   Mundo/cámara/haz heredados de R02. Animales centrales = volumen procedural.
   PNG = referencia, no cuerpo ni dependencia de arranque. */""",s,count=1,flags=re.S)
E.write_text(s,encoding='utf-8')
print('R03.1_PATCH_APPLIED')
