const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(process.argv[2]||path.join(__dirname,'descubrimiento-peces-R06.1'));
const src=fs.readFileSync(path.join(root,'app/motor.js'),'utf8');
const ds=fs.readFileSync(path.join(root,'app/datos.js'),'utf8');
const data=JSON.parse(ds.slice(ds.indexOf('{'),ds.lastIndexOf('}')+1));
function canvas(W,H){const ctx=new Proxy({}, {get:(o,k)=>o[k]||(()=>k.startsWith('create')?{addColorStop(){}}:undefined),set:(o,k,v)=>(o[k]=v,true)});return {width:W,height:H,getContext:()=>ctx,getBoundingClientRect:()=>({width:W,height:H})};}
async function setup(d=data,W=1280,H=520){let raf=0;const c={window:{devicePixelRatio:1,requestAnimationFrame:()=>++raf,cancelAnimationFrame(){}},document:{createElement:()=>canvas(W,H)},performance:{now:()=>1000},Image:class {set src(s){this.width=this.naturalWidth=1536;this.height=this.naturalHeight=1536;queueMicrotask(()=>this.onload());}}};vm.createContext(c);vm.runInContext(src,c);const m=c.window.IG_MOTOR.crearMotor({datos:d,lienzo:canvas(W,H)});await m.cargarEscena('meso-01');m.pausar(true);return {m,c};}
(async()=>{
const out={method:'Original motor.js executed in Node VM with drawing no-ops, Image load stub and manual clock. Real delivered data unless fixture declared. NOT browser/render/perceptual QA.'};
const {m}=await setup();out.ids=m.ids();out.periods=[];
for(const hz of [30,60,120]) {m.reiniciarReloj();const prev={},cross={}; for(let step=0;step<=90*hz;step++){if(step)m.avanzar(1/hz); const pos=m.posiciones();for(const slot of data.escenas[0].animales){const id=slot.id,x=pos[id][0]-slot.ancla[0]*3000;if(prev[id]!==undefined&&prev[id]<=0&&x>0)(cross[id]??=[]).push((step-1+(-prev[id])/(x-prev[id]))/hz);prev[id]=x;}}out.periods.push({hz,periods:Object.fromEntries(Object.entries(cross).map(([id,a])=>[id,(a.at(-1)-a[0])/(a.length-1)]))});}
m.reiniciarReloj();out.transitions=[];m.avanzar(40);
for(const mode of ['reducido','ninguno','normal']){const a=m.posiciones(),pa=m.poses();m.modoMovimiento(mode);const b=m.posiciones(),pb=m.poses();out.transitions.push({mode,maxPositionJump:Math.max(...Object.keys(a).map(id=>Math.hypot(a[id][0]-b[id][0],a[id][1]-b[id][1]))),maxWaveJump:Math.max(...Object.keys(pa).flatMap(id=>pa[id].deformacion.map((x,i)=>Math.abs(x-pb[id].deformacion[i]))))});}
out.squid={cases:0,examinable:0};m.encuadrarParaExaminar('prof-calamar-cristal',true);for(let y=.1;y<1;y+=.05)for(let x=.05;x<1;x+=.05){m.apuntar(x,y);const c=m.medida().todos.find(x=>x.id==='prof-calamar-cristal');out.squid.cases++;out.squid.examinable+=+c.examinable;}
// Explicit state fixture: bring the two unmodified eligible fish into view.
const d=structuredClone(data);for(const sl of d.escenas[0].animales){if(sl.id==='prof-pez-hacha')sl.ancla=[.43,.45];if(sl.id==='prof-pez-linterna')sl.ancla=[.57,.45];}
const {m:f}=await setup(d);f.estado.camara.zoom=1;out.selectionFixtures={};
let found=null;for(let y=.1;y<.9&&!found;y+=.04)for(let x=.1;x<.9&&!found;x+=.04){f.apuntar(x,y);const med=f.medida();if(med.examinables.length===2)found={x,y,med};}
out.selectionFixtures.two=found;
// Automatic choice ignores pointer distance when no explicit body hit.
if(found){out.selectionFixtures.hysteresis={initial:found.med.candidatoId,ex:found.med.examinables.map(x=>({id:x.id,fraction:x.fraccion}))};}
// Delivered gate consumes per-species requirement.
const high=structuredClone(data);high.catalogo.find(a=>a.id==='prof-pez-linterna').bodyContext.requiredFraction=.99;
const {m:h}=await setup(high);h.encuadrarParaExaminar('prof-pez-linterna',true);out.perAnimalThreshold=[];
for(let y=.05;y<1&&!out.perAnimalThreshold.length;y+=.04)for(let x=.05;x<1&&!out.perAnimalThreshold.length;x+=.04){h.apuntar(x,y);const v=h.medida().todos.find(x=>x.id==='prof-pez-linterna');if(v.fraccion>.35&&v.fraccion<.99&&v.observables[0].cumple)out.perAnimalThreshold.push({fraction:v.fraccion,examinable:v.examinable});}
// Genuine package, time/viewport/camera/light sample, no creature or observable changes.
const {m:q}=await setup();out.productOverlap=null;
search:for(let t=0;t<=62;t+=2){if(t)q.avanzar(2);q.estado.camara.zoom=1;for(const cx of [.25,.4,.5,.6,.75]){q.estado.camara.x=cx;for(let y=.2;y<=.8;y+=.1)for(let x=.1;x<=.9;x+=.05){q.apuntar(x,y);const med=q.medida();if(med.examinables.length>1){out.productOverlap={time:t,camera:{...q.estado.camara},light:{x,y},giros:q.giros(),candidates:med.examinables.map(v=>({id:v.id,body:v.fraccion,obs:v.observables[0].fraccion}))};break search;}}}}
// Loader accepts stale validation flags. This is an explicitly corrupted-data fixture.
const invalid=structuredClone(data), target=invalid.catalogo.find(a=>a.id==='prof-pez-linterna');target.estadoRequisitoObservable='exigido';target.observables.forEach(o=>o.activo=false);
const {m:iv}=await setup(invalid);iv.encuadrarParaExaminar(target.id,true);iv.apuntarAAnimal(target.id);out.invalidSchemaFixture={state:iv.medida().todos.find(c=>c.id===target.id)};
// Automatic proposal still chooses greatest body coverage; distance is only in explicit hit selection.
if(out.productOverlap){const st=out.productOverlap;q.apuntar(st.light.x,st.light.y);out.productOverlap.selected=q.medida().candidatoId;}
fs.writeFileSync(path.join(__dirname,'RETEST_RESULTS.json'),JSON.stringify(out,null,2));console.log(JSON.stringify({...out,selectionFixtures:{two:!!found,hysteresis:out.selectionFixtures.hysteresis}},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
