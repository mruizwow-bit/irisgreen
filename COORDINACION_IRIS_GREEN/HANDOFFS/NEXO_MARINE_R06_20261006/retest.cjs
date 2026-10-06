// Original delivered functions in isolated Node VM. No browser or perceptual PASS.
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.join(__dirname,'descubrimiento-peces-R06');
const src=fs.readFileSync(path.join(root,'app/motor.js'),'utf8');
const uiSrc=fs.readFileSync(path.join(root,'app/interfaz.js'),'utf8');
const ds=fs.readFileSync(path.join(root,'app/datos.js'),'utf8');
const data=JSON.parse(ds.slice(ds.indexOf('{'),ds.lastIndexOf('}')+1));
const c={mov:'normal',pausa:false,listo:true,piezas:[],mundoW:3000,mundoH:1500,reloj:0};vm.createContext(c);
vm.runInContext(src.slice(src.indexOf('  var GRADOS'),src.indexOf('  function crearMotor')),c);
vm.runInContext(src.slice(src.indexOf('    function perfil()'),src.indexOf('    /* ---------- escala')),c);
vm.runInContext(src.slice(src.indexOf('    var TAU_DESVIO'),src.indexOf('    function recuadro')),c);
const results={method:'Node VM, unmodified delivered functions with explicit state fixtures; no rendered/native input or human test',transitions:[],trajectory:[]};
for(const a of data.catalogo){
 const sl=data.escenas[0].animales.find(s=>s.id===a.id);
 const p={ancla:sl.ancla,recorrido:sl.recorrido,periodo:sl.periodo,fase:6.75,amp:1,giro:.3,nado:a.nado};
 c.piezas=[p];c.mov='normal';c.reloj=30;
 const snapshot=()=>({pos:c.posicionMundo(p,c.reloj),giro:c.orientacion(p,c.reloj,0),wave:Array.from({length:18},(_,i)=>c.onda(p,(i+.5)/18,400))});
 for(const m of ['reducido','ninguno','normal']){
  const before=snapshot(),old=c.mov;c.reanclarPorMovimiento(c.mov,m);c.mov=m;const after=snapshot();
  results.transitions.push({id:a.id,from:old,to:m,centerJump:Math.hypot(after.pos.x-before.pos.x,after.pos.y-before.pos.y),waveJump:Math.max(...before.wave.map((v,i)=>Math.abs(v-after.wave[i]))),turnJump:after.giro-before.giro});
 }
 const q={ancla:sl.ancla,recorrido:sl.recorrido,periodo:sl.periodo,fase:sl.fase,amp:1,giro:1,nado:a.nado};c.piezas=[q];c.mov='normal';c.reloj=0;
 let previous=c.posicionMundo(q,0),maxRatio=0,maxError=0,maxV=0;
 for(let i=1;i<=3600;i++){
  const dt=1/60;c.avanzarNado(q,dt);c.reloj=i*dt;const pos=c.posicionMundo(q,c.reloj);
  const actualV=(pos.x-previous.x)/dt;maxV=Math.max(maxV,Math.abs(actualV));maxError=Math.max(maxError,Math.abs(actualV-pos.vx));
  if(Math.abs(pos.vx)>20) maxRatio=Math.max(maxRatio,Math.abs(actualV/pos.vx));previous=pos;
 }
 const phaseRate=a.nado.frecuencia*c.estiloDe(a.nado).frec;
 results.trajectory.push({id:a.id,declaredPeriodSec:sl.periodo,effectiveHorizontalPeriodSec:2*Math.PI/(2*Math.PI/sl.periodo+phaseRate),wavePhaseAlsoUsedAsRouteOffset:q.fase!==sl.fase,nominalMaxWorldSpeed:sl.recorrido[0]*2*Math.PI/sl.periodo,measuredMaxWorldSpeed:maxV,maxVelocityError:maxError});
}
let med={examinables:[{id:'a'},{id:'b'}],candidatoId:'a'};const handlers={},events=[];
const k={zona:{addEventListener:(n,f)=>handlers[n]=f},ui:{},motor:{medida:()=>med},examinar:id=>events.push(['examine',id]),avisar:t=>events.push(['announce',t]),etiquetaCandidato:id=>id,T:{variasSenales:(n,id)=>n+' signals chosen '+id,sinCandidato:'none'},animal:()=>null};vm.createContext(k);
vm.runInContext(uiSrc.slice(uiSrc.indexOf('  function claveCandidatos'),uiSrc.indexOf('  /* La misma etiqueta')),k);
const begin=uiSrc.indexOf("    zona.addEventListener('keydown'");vm.runInContext(uiSrc.slice(begin,uiSrc.indexOf('    function pulsa',begin)),k);
const enter=(repeat=false)=>handlers.keydown({key:'Enter',repeat,preventDefault(){}});
enter();enter(true);med={examinables:[],candidatoId:null};k.revisarConfirmacion(med);med={examinables:[{id:'a'},{id:'b'}],candidatoId:'b'};enter();enter();results.confirmation=events;
// Actual evaluator: deterministic mask fixture, 40% body, 0% observable.
const e={datos:data,W:100,H:100,piezas:[],estado:{congelado:false,candidatoId:null},recuadro:()=>({x:0,y:0,w:100,h:100}),girarVisible:g=>g,deCanto:g=>Math.abs(g)<.35,puntoEnPantalla:(p,r,g,x,y)=>({x,y}),valorMascara:(g,x,y)=>x<50?1:0};vm.createContext(e);
vm.runInContext(src.slice(src.indexOf('    function evaluar('),src.indexOf('    function medidaActual')),e);
function evaluated(obs,body){ e.piezas=[{id:'fixture',giro:1,muestras:[[10,10],[10,10],[90,10],[90,10],[90,10]],observables:obs,bodyContext:body,combinacion:'todos'}];return e.evaluar({},0).todos[0]; }
results.gates={inactiveObservable:evaluated([{id:'blocked',activo:false,requerida:.5,puntos:[[90,10]]}]),activeEmptyGeometry:evaluated([{id:'empty',activo:true,requerida:.5,puntos:[]}])};
results.schemaBodyContextRead=src.includes('bodyContext');
fs.writeFileSync(path.join(__dirname,'RETEST_RESULTS.json'),JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results,null,2));
