const { chromium } = require('playwright');
const fs = require('fs');
const URL = process.argv[2] || 'http://127.0.0.1:8773/vida-marina-3d.html';
const EXE = process.env.PLAYWRIGHT_CHROMIUM || undefined;
const OUT = process.argv.includes('--json') ? process.argv[process.argv.indexOf('--json')+1] : null;
const R=[];
const ok=(id,c,n)=>R.push({id,estado:c?'PASA':'FALLA',nota:n});
const pend=(id,n)=>R.push({id,estado:'PENDIENTE',nota:n});
(async()=>{
 const b=await chromium.launch({executablePath:EXE,args:['--use-gl=angle','--enable-unsafe-swiftshader']});
 const p=await b.newPage({viewport:{width:1440,height:900}}); const errs=[];
 p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto(URL,{waitUntil:'load'}); await p.waitForFunction(()=>window.IG_PRUEBA3D&&window.__E,null,{timeout:25000});
 ok('SIN_ERRORES',errs.length===0,errs.join(' | ')||'sin errores JS');
 const geom=await p.evaluate(()=>window.__E.escena.children.filter(o=>o.name&&o.name.startsWith('prof-')).map(r=>{let planes=0,meshes=0,normals=0,maps=0;r.traverse(o=>{if(!o.isMesh)return;meshes++;if(o.geometry.type==='PlaneGeometry')planes++;if(o.geometry.getAttribute('normal'))normals++;if(o.material&&o.material.map)maps++;});return{id:r.name,planes,meshes,normals,maps,scale:r.scale.toArray()};}));
 ok('CERO_PLANOS',geom.every(x=>x.planes===0),JSON.stringify(geom));
 ok('NORMALES',geom.every(x=>x.normals===x.meshes),JSON.stringify(geom));
 ok('PNG_NO_CUERPO',geom.every(x=>x.maps===0),JSON.stringify(geom));
 ok('SIN_COMPRESION',geom.every(x=>x.scale.every(v=>Math.abs(v-1)<1e-9)),JSON.stringify(geom));
 const sections=await p.evaluate(()=>{
  const roots=window.__E.escena.children.filter(o=>o.name==='prof-pez-hacha'||o.name==='prof-pez-linterna');
  return roots.map(r=>{
   let body=null;r.traverse(o=>{if(o.isMesh&&o.userData&&o.userData.sectionBody&&o.userData.role==='body')body=o;});
   if(!body)return{id:r.name,found:false};
   const prof=body.userData.sectionProfile||[], widths=prof.map(q=>q.rz), heights=prof.map(q=>(q.ryTop||0)+(q.ryBottom||0));
   const index=body.geometry.index.array, edge=new Map();
   const add=(a,b)=>{const k=a<b?a+':'+b:b+':'+a;edge.set(k,(edge.get(k)||0)+1);};
   for(let i=0;i<index.length;i+=3){const a=index[i],b=index[i+1],d=index[i+2];add(a,b);add(b,d);add(d,a);}
   return{id:r.name,found:true,sections:prof.length,widthMin:Math.min(...widths),widthMax:Math.max(...widths),
    heightMin:Math.min(...heights),heightMax:Math.max(...heights),boundary:[...edge.values()].filter(v=>v===1).length};
  });
 });
 ok('SECCIONES_VARIABLES',sections.every(x=>x.found&&x.sections>=6&&x.widthMax>x.widthMin*1.8&&x.heightMax>x.heightMin*1.8),JSON.stringify(sections));
 ok('CUERPOS_SECCIONALES_CERRADOS',sections.every(x=>x.boundary===0),JSON.stringify(sections));
 const orient=await p.evaluate(()=>{const P=window.IG_PRUEBA3D;P.pausar(true);P.fijarReloj(9);P.latir();const roots=window.__E.escena.children.filter(o=>o.name&&o.name.startsWith('prof-'));const before=Object.fromEntries(roots.map(r=>[r.name,r.rotation.y]));window.__E.camara.position.x+=0.37;window.__E.camara.lookAt(0,0,-1);window.__E.camara.updateMatrixWorld(true);P.latir();const after=Object.fromEntries(roots.map(r=>[r.name,r.rotation.y]));return{before,after};});
 ok('ROOT_NO_MIRA_CAMARA',Object.keys(orient.before).every(id=>Math.abs(orient.before[id]-orient.after[id])<1e-8),JSON.stringify(orient));
 const ray=await p.evaluate(()=>{const P=window.IG_PRUEBA3D,c=document.getElementById('lienzo3d').getBoundingClientRect(),out=[];P.pausar(true);for(const id of P.ids()){P.apuntarAAnimal(id);P.latir();const m=P.medida().find(x=>x.id===id);out.push({id,q:P.senalarPantalla(c.left+m.centroPantalla.x,c.top+m.centroPantalla.y)});}return out;});
 ok('RAYCAST_VOLUMEN',ray.every(x=>x.q&&x.q.id===x.id),JSON.stringify(ray));
 const png=await p.evaluate(()=>performance.getEntriesByType('resource').map(r=>r.name).filter(x=>/pez-hacha|pez-linterna|calamar-cristal/.test(x)&&/\.png(?:$|\?)/.test(x)));
 ok('PNG_NO_CARGADO_EN_ARRANQUE',png.length===0,JSON.stringify(png));
 const jump=await p.evaluate(()=>{const P=window.IG_PRUEBA3D;P.pausar(true);P.fijarReloj(11);const a=P.posiciones();for(const m of ['reducido','ninguno','normal']){P.modo(m);P.avanzar(0);}const z=P.posiciones();let max=0;for(const id of Object.keys(a))max=Math.max(max,Math.hypot(a[id][0]-z[id][0],a[id][1]-z[id][1],a[id][2]-z[id][2]));return max;});
 ok('SETTING_NO_TELEPORT',jump<1e-9,'desplazamiento '+jump+' m');
 const cal=await p.evaluate(()=>{const P=window.IG_PRUEBA3D;P.apuntarAAnimal('prof-calamar-cristal');P.latir();return P.medida().find(x=>x.id==='prof-calamar-cristal');});
 ok('CALAMAR_BLOQUEO_KEEP',cal&&cal.bloqueado===true&&cal.examinable===false,JSON.stringify(cal&&{bloqueado:cal.bloqueado,examinable:cal.examinable}));
 pend('PARTIAL_LIGHT_PIXEL_EVIDENCE','capturas DARK/PARTIAL/REVEALED');
 pend('HUMAN_QA_MORFOLOGIA','lateral/frontal/3-4');
 pend('GPU_REAL','benchmark hardware'); pend('AT_REAL','lector de pantalla');
 const pass=R.filter(x=>x.estado==='PASA').length,fail=R.filter(x=>x.estado==='FALLA').length,pendiente=R.filter(x=>x.estado==='PENDIENTE').length;
 console.log('PASA '+pass+' · FALLA '+fail+' · PENDIENTE '+pendiente);R.forEach(x=>console.log(x.estado.padEnd(10),x.id,x.nota));
 if(OUT)fs.writeFileSync(OUT,JSON.stringify({resumen:{pass,fail,pendiente},resultados:R},null,2));
 await b.close();process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(2)});