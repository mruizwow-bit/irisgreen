// R05 targeted independent fixtures. Original code; no browser/native DOM QA.
const fs=require('fs'),path=require('path'),vm=require('vm');
const {createCanvas,loadImage}=require('@napi-rs/canvas');
const root=path.join(__dirname,'product/descubrimiento-peces-R05');
const src=fs.readFileSync(path.join(root,'app/motor.js'),'utf8');
const uiSrc=fs.readFileSync(path.join(root,'app/interfaz.js'),'utf8');
const ds=fs.readFileSync(path.join(root,'app/datos.js'),'utf8');
const data=JSON.parse(ds.slice(ds.indexOf('{'),ds.lastIndexOf('}')+1));
const c={window:{}};vm.createContext(c);vm.runInContext(src,c);const M=c.window.IG_MOTOR;
const results={method:'Delivered functions in Node fixtures and native Canvas, not browser or HUMAN QA'};
const pose={mov:'normal',pausa:true,listo:true,piezas:[],mundoW:3000,mundoH:1500,reloj:7,PERFILES:M.PERFILES,girar:M.girar,ondaY:M.ondaY};
vm.createContext(pose);
vm.runInContext(src.slice(src.indexOf('    function perfil()'),src.indexOf('    /* ---------- escala')),pose);
vm.runInContext(src.slice(src.indexOf('    var TAU_DESVIO'),src.indexOf('    function recuadro')),pose);
results.pose=[];
for(const a of data.catalogo){
 const slot=data.escenas[0].animales.find(x=>x.id===a.id);
 pose.piezas=[{ancla:slot.ancla,recorrido:slot.recorrido,periodo:slot.periodo,fase:slot.fase,giro:-1,nado:a.nado}];
 vm.runInContext('mov="normal";var p=piezas[0]; var before={pos:posicionMundo(p,reloj),giro:orientacion(p,reloj,0),wave:[]};for(var j=0;j<18;j++) before.wave.push(onda(p,(j+.5)/18,reloj,400)); reanclarPorMovimiento(mov,"ninguno");mov="ninguno";var after={pos:posicionMundo(p,reloj),giro:orientacion(p,reloj,0),wave:[]};for(var j=0;j<18;j++) after.wave.push(onda(p,(j+.5)/18,reloj,400));',pose);
 results.pose.push({id:a.id,centerDisplacement:Math.hypot(pose.before.pos.x-pose.after.pos.x,pose.before.pos.y-pose.after.pos.y),giroBefore:pose.before.giro,giroAfter:pose.after.giro,maxStripYJumpAt400px:Math.max(...pose.before.wave.map((v,i)=>Math.abs(v-pose.after.wave[i])))});
}
results.turnDt=[30,60,120].map(hz=>{let g=1;for(let i=0;i<hz;i++)g=M.girar(g,-1,1-Math.exp(-(1/hz)/.28));return {hz,giroAfter1s:g}});
const keyHandlers={},events=[];let med={examinables:[{id:'a'},{id:'b'}],candidatoId:'a'};
const k={zona:{addEventListener:(n,f)=>keyHandlers[n]=f},ui:{},motor:{medida:()=>med},examinar:id=>events.push(['examine',id]),avisar:t=>events.push(['announce',t]),etiquetaCandidato:id=>id,T:{variasSenales:(n,id)=>n+' signals chosen '+id,sinCandidato:'none'}};
vm.createContext(k);const start=uiSrc.indexOf("    zona.addEventListener('keydown'");vm.runInContext(uiSrc.slice(start,uiSrc.indexOf('    function pulsa',start)),k);
const enter=()=>keyHandlers.keydown({key:'Enter',preventDefault(){}});
enter();med={examinables:[],candidatoId:null};enter();med={examinables:[{id:'a'},{id:'b'}],candidatoId:'b'};enter();results.multipleExitAndReturn=events;
const nodes={'btn-examinar':{textContent:'',focus(){focusCalls++;doc.activeElement=this;}},'btn-otro':{hidden:false,textContent:''}};let focusCalls=0;const doc={activeElement:nodes['btn-otro']};
const f={document:doc,$:id=>nodes[id],ui:{objetivo:null},nombreCorto:()=>null,posicionNeutral:()=>({h:'left',v:'middle'}),motor:{tamanoCaja:()=>({w:1000,h:600})},T:{examinarIluminado:()=> 'Examine left'},avisar(){}};
vm.createContext(f);vm.runInContext(uiSrc.slice(uiSrc.indexOf('  function pintarCandidatos(med)'),uiSrc.indexOf('  /* ---------------- examinar / franja')),f);
f.pintarCandidatos({examinables:[{id:'a',centro:{x:1,y:1}}],candidatoId:'a'});results.focusTransfer={calls:focusCalls,otherHidden:nodes['btn-otro'].hidden,targetMain:doc.activeElement===nodes['btn-examinar']};
const handlers={},calls=[];const noop=()=>{};
const g={zona:{addEventListener:(n,f)=>handlers[n]=f,focus:noop,setPointerCapture:noop,releasePointerCapture:noop},window:{addEventListener:noop},marco:{getBoundingClientRect:()=>({left:0,top:0,width:1000,height:600}),classList:{add:noop,remove:noop}},performance:{now:()=>0},GESTOS:data.gestos,motor:{apuntar:(...p)=>calls.push(p),arrastrarCamara:noop},pintarPistaVista:noop};
vm.createContext(g);vm.runInContext(uiSrc.slice(uiSrc.indexOf('    function local(ev)'),uiSrc.indexOf('    /* Teclado, sólo')),g);
const ev=(id,x)=>({pointerId:id,clientX:x,clientY:100,preventDefault:noop});handlers.pointerdown(ev(1,100));handlers.pointerdown(ev(2,800));handlers.pointerup(ev(2,800));handlers.pointerup(ev(1,100));results.twoQuietContacts=calls;
async function register(){
 const draw={hayPose:()=>true,onda:()=>0,limitar:(x,a,b)=>Math.max(a,Math.min(b,x)),girarVisible:M.girarVisible};
 vm.createContext(draw);vm.runInContext(src.slice(src.indexOf('    function pivoteX'),src.indexOf('    /* ---------- vida ambiental')),draw);
 const out=[];
 for(const a of data.catalogo){
  const light=await loadImage(path.join(root,a.assets.luz)),dark=await loadImage(path.join(root,a.assets.oscuro));
  for(const giro of [1,-1]){
   const r={x:50,y:50,w:a.lienzo[0],h:a.lienzo[1]},p={registro:a.registro,lienzo:a.lienzo};
   const render=(im,isLight)=>{const cv=createCanvas(r.w+100,r.h+100);draw.dibujarDeformado(cv.getContext('2d'),im,r,p,0,giro,isLight);return cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;};
   const A=render(light,true),B=render(dark,false);let inter=0,union=0;
   for(let j=3;j<A.length;j+=4){const x=A[j]>=128,y=B[j]>=128;if(x||y)union++;if(x&&y)inter++;}
   out.push({id:a.id,giro,iou:inter/union});
  }
 }
 return out;
}
register().then(r=>{results.registration=r;fs.writeFileSync(path.join(__dirname,'RETEST_RESULTS.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));});
