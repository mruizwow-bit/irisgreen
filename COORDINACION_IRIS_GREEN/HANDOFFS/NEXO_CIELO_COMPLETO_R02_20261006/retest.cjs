// Nexo: source-level VM fixtures, NOT browser / human QA.
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'DESCUBRIMIENTO_CIELO_COMPLETO_R02');
const results={method:'Node VM, original functions with mocked DOM/render and explicit fixtures; no browser or physical touch'};
const callbacks=[], nodes={}, storage={};
function node(id=''){return nodes[id] ||= {id,hidden:false,offsetParent:{},textContent:'',handlers:{},classList:{add(){},remove(){},toggle(){}},getBoundingClientRect(){return {width:390,height:624,left:0,top:0}},addEventListener(e,f){this.handlers[e]=f},setAttribute(){},appendChild(){},focus(){},setPointerCapture(){}}}
const doc={readyState:'loading',addEventListener(){},getElementById:node,querySelectorAll(){return []},head:{appendChild(s){callbacks.push(s)}},createElement(){return node('script'+callbacks.length)},contains(){return true},documentElement:{}};
const ctx={document:doc,localStorage:{getItem(k){return storage[k]||null},setItem(k,v){storage[k]=v},removeItem(k){delete storage[k]}},setTimeout(){return 1},clearTimeout(){},requestAnimationFrame(){return 1},cancelAnimationFrame(){},performance:{now:()=>0},Image:function(){},addEventListener(){},matchMedia:()=>({matches:false})};ctx.window=ctx;vm.createContext(ctx);
for(const f of ['js/config.js','js/copia.js','datos/indice.js','js/motor.js',...fs.readdirSync(path.join(root,'datos/campos')).filter(x=>x.endsWith('.js')).map(x=>'datos/campos/'+x)])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx);
const M=ctx.IG_MOTOR,raw=ctx.IG_CAMPO['campo-06'],field=M.construirCampo(raw),W=390,H=624;
let single=null;
// Scan actual camera bounds at max supported zoom; no artificial occluders.
for(const p of field.porAbbr.Ori.especial.estrellas){
 for(const x of [2,5,10,W-10,W-5,W-2]) for(const y of [2,10,H*.5,H*.85]){
  const cam={u:p.u-(x-W/2)/(6*Math.max(W,H)/2),v:p.v-(y-H/2)/(6*Math.max(W,H)/2),zoom:6};M.ajustarCamara(field,cam);
  const q=M.aPantalla(p,cam,W,H),r=M.examinar(field,cam,W,H,[],q,{});
  if(r.mejor?.abbr==='Ori' && r.mejor.visibles===1){single={cam,punto:q,resultado:r.resultado,mejor:r.mejor};break}
 }
 if(single)break;
}
results.orionOneVisible=single;
// Expose original interface functions; replace only rendering helpers, not state logic under test.
let src=fs.readFileSync(path.join(root,'js/interfaz.js'),'utf8');
src=src.replace('})(window);',`g.PROBE={estado, setField(c){campo=c;campoMeta=c.meta}, setElements(x){el=x}, load:cargar,save:guardar,remember:recordarCamara,detail:abrirFicha,close:cerrarPanel,open:abrirPanel,bind:enlazar,examine:examinar,objective:elegirObjetivo,token(){return tokenCarga},quiet(){pintar=function(){};construirPanel=function(){};pintarMensaje=function(){};actualizarCabecera=function(){};pintarObjetivo=function(){};}}; })(window);`);
vm.runInContext(src,ctx);const P=ctx.PROBE;P.quiet();P.setField(field);P.setElements(new Proxy({}, {get(o,k){return node(k)}}));P.estado.campoId='campo-06';P.estado.camara={u:0,v:0,zoom:1.35};P.estado.movimiento='NONE';
if(single){P.estado.camara={...single.cam};P.examine('puntero',single.punto);results.orionOneVisible.interfaceMessage={...P.estado.mensaje};results.orionOneVisible.marked=P.estado.localizada?.puntos.length;}
P.estado.panel=null;P.detail('Ori');P.open('fuentes',null,node('btn-fuentes'));P.close();callbacks.at(-1).onload();results.lateDetailAfterClose={panel:P.estado.panel,abbr:P.estado.panelAbbr};
P.close();P.detail('Ori');const old=callbacks.at(-1);P.detail('Gem');const newer=callbacks.at(-1);newer.onload();old.onload();results.detailOutOfOrder={panel:P.estado.panel,abbr:P.estado.panelAbbr};
P.close();P.estado.descubiertas={};P.estado.objetivoActual='Ori';P.estado.descubiertas.CMa=true;P.objective();results.objectiveOutsideOrder=P.estado.objetivoActual;P.estado.descubiertas.Ori=true;P.objective();results.objectiveAfterOri=P.estado.objetivoActual;
// Same public event handlers; second finger lifts, first moves by one px.
P.estado.camara={u:0,v:0,zoom:1.35};P.bind();const h=node('lienzo').handlers;
function ev(id,x,y){return {pointerId:id,clientX:x,clientY:y,button:0,movementX:0,movementY:0}}
h.pointerdown(ev(1,100,250));h.pointerdown(ev(2,200,250));h.pointermove(ev(1,80,250));h.pointermove(ev(2,220,250));h.pointerup(ev(2,220,250));
const before={...P.estado.camara};h.pointermove(ev(1,79,250));const after={...P.estado.camara};
results.pinchToOneFinger={before,after,physicalMovePx:1,worldShiftPx:(after.u-before.u)*M.escala(before,W,H)};h.pointercancel(ev(1,79,250));
// Successful camera movement updates memory but not persisted storage.
P.estado.camara={u:0,v:0,zoom:1.35};P.remember();P.save();h.keydown;node('escenario').handlers.keydown({target:node('escenario'),key:'ArrowRight',preventDefault(){}});
results.cameraPersistence={memory:P.estado.camarasPorCampo['campo-06'],saved:JSON.parse(storage[ctx.IG_CONFIG.CLAVE_GUARDADO]).camaras['campo-06']};
// Malformed version-2 camera: current loader accepts non-numeric values.
storage[ctx.IG_CONFIG.CLAVE_GUARDADO]=JSON.stringify({v:2,camaras:{'campo-06':{u:'bad',v:null,zoom:'bad'}},descubiertas:[]});P.load();let invalid={...P.estado.camarasPorCampo['campo-06']};M.ajustarCamara(field,invalid);results.invalidSavedCamera={camera:invalid,projected:M.aPantalla(field.porAbbr.Ori.puntos[0],invalid,W,H)};
const clues=Object.values(ctx.IG_CAMPO).flatMap(c=>c.constelaciones);results.clues={total:clues.length,uniqueES:new Set(clues.map(k=>k.pista.es)).size,magnitudeClues:clues.filter(k=>k.pista.es.includes('magnitud')).length};
const centerCam={u:0,v:0,zoom:1.35},dr=M.radioZona(W,H)/M.escala(centerCam,W,H);
results.angularAtProjectionCenter={reportedDegrees:M.aperturaGrados(centerCam,W,H,{x:W/2,y:H/2}),radiusDegreesFromOwnInverse:2*Math.atan(dr/2)*180/Math.PI,diameterDegreesFromOwnInverse:4*Math.atan(dr/2)*180/Math.PI};
fs.writeFileSync(path.join(__dirname,'RETEST_RESULTS.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
