// Original delivered functions/listeners in Node fixtures. NOT browser or HUMAN QA.
const fs=require('fs'),path=require('path'),vm=require('vm');
const {createCanvas,loadImage}=require('@napi-rs/canvas');
const root=path.join(__dirname,'product/descubrimiento-peces-R04');
const ui=fs.readFileSync(path.join(root,'app/interfaz.js'),'utf8');
const motor=fs.readFileSync(path.join(root,'app/motor.js'),'utf8');
const dsrc=fs.readFileSync(path.join(root,'app/datos.js'),'utf8');
const data=JSON.parse(dsrc.slice(dsrc.indexOf('{'),dsrc.lastIndexOf('}')+1));
const results={method:'Original JS in isolated Node fixtures; native Canvas only for pair-transform test; no native DOM/browser'};
function gestures(kind){
 const handlers={},calls=[];let now=0;const noop=()=>{};
 const c={zona:{addEventListener:(k,f)=>handlers[k]=f,focus:noop,setPointerCapture:noop,releasePointerCapture:noop},window:{addEventListener:noop},marco:{getBoundingClientRect:()=>({left:0,top:0,width:1000,height:600}),classList:{add:noop,remove:noop}},performance:{now:()=>now},GESTOS:data.gestos,motor:{apuntar:(...p)=>calls.push(p),arrastrarCamara:noop},pintarPistaVista:noop};
 vm.createContext(c);vm.runInContext(ui.slice(ui.indexOf('    function local(ev)'),ui.indexOf('    /* Teclado, sólo')),c);
 const event=(id,x=310,y=132)=>({pointerId:id,clientX:x,clientY:y,preventDefault:noop});
 handlers.pointerdown(event(1));now=1300;
 if(kind==='twoContacts'){handlers.pointerdown(event(2,800,300));handlers.pointerup(event(2,800,300));}
 else {handlers[kind==='cancel'?'pointercancel':'pointerup'](event(1));}
 return calls;
}
results.gestures={slow1300ms:gestures('slow'),cancel:gestures('cancel'),twoQuietContacts:gestures('twoContacts')};
const evs={},actions=[];
const keyCtx={zona:{addEventListener:(k,f)=>evs[k]=f},motor:{medida:()=>({examinables:[{id:'a'},{id:'b'}],candidatoId:'b'})},examinar:id=>actions.push(['examine',id]),avisar:t=>actions.push(['announce',t]),T:{sinCandidato:'none'}};
vm.createContext(keyCtx);const start=ui.indexOf("    zona.addEventListener('keydown'");vm.runInContext(ui.slice(start,ui.indexOf('    function pulsa',start)),keyCtx);
evs.keydown({key:'Enter',preventDefault:()=>actions.push(['preventDefault'])});results.enterTwoCandidates=actions;
const nodes={'btn-examinar':{textContent:''},'btn-otro':{hidden:false,textContent:''}};const foc=[];
for(const n of Object.values(nodes))n.focus=()=>foc.push('focus-called');
const c={ui:{objetivo:null},$:id=>nodes[id],nombreCorto:()=>null,posicionNeutral:()=>({h:'left',v:'middle'}),motor:{tamanoCaja:()=>({w:1000,h:600})},T:{examinar:'Examine',examinarIluminado:()=> 'Examine left',otroAnimal:n=>'Other '+n},avisar:()=>{}};
vm.createContext(c);vm.runInContext(ui.slice(ui.indexOf('  function pintarCandidatos(med)'),ui.indexOf('  /* ---------------- examinar / franja')),c);
c.pintarCandidatos({examinables:[{id:'a',centro:{x:100,y:100}}],candidatoId:'a'});
results.otherFocusedThenOneCandidate={hidden:nodes['btn-otro'].hidden,focusTransferCalls:foc.length,note:'Source/fixture confirms hide without transfer; browser focus outcome not tested'};
const pure={window:{}};vm.createContext(pure);vm.runInContext(motor,pure);const M=pure.window.IG_MOTOR;
results.turnAtEqualElapsedSeconds=[30,60,120].map(hz=>{let g=1;for(let i=0;i<hz;i++)g=M.girar(g,-1,.055);return {hz,giroAfter1s:g}});
const pose={mov:'normal',pausa:true,listo:true,piezas:[],mundoW:3000,mundoH:1500,reloj:7,PERFILES:M.PERFILES,girar:M.girar};
vm.createContext(pose);vm.runInContext(motor.slice(motor.indexOf('    function perfil()'),motor.indexOf('    /* ---------- escala')),pose);
vm.runInContext(motor.slice(motor.indexOf('    var TAU_DESVIO'),motor.indexOf('    function recuadro')),pose);
const a=data.catalogo.find(a=>a.slug==='calamar-cristal'),slot=data.escenas[0].animales.find(s=>s.id===a.id);
pose.piezas.push({ancla:slot.ancla,recorrido:slot.recorrido,periodo:slot.periodo,fase:slot.fase,giro:-1,nado:a.nado});
vm.runInContext('var p=piezas[0]; var before={position:posicionMundo(p,reloj),giro:orientacion(p,reloj)}; reanclarPorMovimiento(mov,"ninguno");mov="ninguno";var after={position:posicionMundo(p,reloj),giro:orientacion(p,reloj)};',pose);
results.noneTransition={before:pose.before,after:pose.after,note:'Constructed valid paused pose; no state claim about a browser route'};
results.waveChange=data.catalogo.slice(0,3).map(a=>({id:a.id,normal:M.ondaY(a.nado,.25,7,400,M.PERFILES.normal),reduced:M.ondaY(a.nado,.25,7,400,M.PERFILES.reducido),none:M.ondaY(a.nado,.25,7,400,M.PERFILES.ninguno)}));
async function registration(){
 const c={hayPose:()=>false,onda:()=>0,limitar:(x,a,b)=>Math.max(a,Math.min(b,x)),girarVisible:M.girarVisible};
 vm.createContext(c);vm.runInContext(motor.slice(motor.indexOf('    function desplazarLuz'),motor.indexOf('    /* ---------- vida ambiental')),c);
 const out=[];
 for(const a of data.catalogo.slice(0,3)){
  const light=await loadImage(path.join(root,a.assets.luz)),dark=await loadImage(path.join(root,a.assets.oscuro));
  for(const giro of [1,-1]){
   const r={x:50,y:50,w:a.lienzo[0],h:a.lienzo[1]},p={registro:a.registro,lienzo:a.lienzo};
   const render=(img,adjust)=>{const cv=createCanvas(r.w+100,r.h+100),ctx=cv.getContext('2d');c.dibujarDeformado(ctx,img,r,p,0,giro,adjust);return ctx.getImageData(0,0,cv.width,cv.height).data;};
   const A=render(light,c.desplazarLuz(p,r)),B=render(dark,null);let inter=0,union=0;
   for(let j=3;j<A.length;j+=4){const l=A[j]>=128,o=B[j]>=128;if(l||o)union++;if(l&&o)inter++;}
   out.push({id:a.id,giro,iou:inter/union});
  }
 }
 return out;
}
registration().then(r=>{results.registrationOriginalDraw=r;fs.writeFileSync(path.join(__dirname,'REPRODUCTIONS.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));});
