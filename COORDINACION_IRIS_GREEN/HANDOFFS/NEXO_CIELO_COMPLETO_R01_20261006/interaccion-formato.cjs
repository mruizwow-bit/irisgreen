// Nexo: fixtures de funciones originales. No navegador ni QA perceptual.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.resolve(process.argv[2]);
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const g={};g.window=g;vm.createContext(g);
for(const p of ['js/config.js','js/motor.js','datos/indice.js',...fs.readdirSync(path.join(root,'datos/campos')).map(x=>'datos/campos/'+x)])vm.runInContext(read(p),g);
const M=g.IG_MOTOR,src=read('js/interfaz.js'),noop=()=>{};
const report={alcance:'Motor y listeners originales en fixtures Node; sin DOM/navegador/touch físico'};
const campo=M.construirCampo(g.IG_CAMPO['campo-06']);
// Un segundo pointerdown sustituye el gesto activo. Soltarlo se procesa como clic.
const events={},calls=[];
const c={CFG:g.IG_CONFIG,M,campo,estado:{camara:{u:0,v:0,zoom:1}},el:{lienzo:{addEventListener:(n,f)=>events[n]=f,getBoundingClientRect:()=>({left:0,top:0}),setPointerCapture:noop,classList:{add:noop,remove:noop}}},medir:()=>({W:1000,H:600}),cancelarAnimacion:noop,pintar:noop,trasMovimiento:noop,examinar:(origen,punto)=>calls.push({origen,punto})};
vm.createContext(c);vm.runInContext(src.slice(src.indexOf('    var puntero = null;'),src.indexOf('    /* La rueda amplía')),c);
const ev=(id,x,y)=>({pointerId:id,button:0,pointerType:'touch',clientX:x,clientY:y});
events.pointerdown(ev(1,100,100));events.pointerdown(ev(2,300,100));events.pointerup(ev(2,300,100));
assert.equal(calls.length,1);report.segundoContacto={acciones:calls,nota:'Secuencia sintética de dos contactos quietos; demuestra acción no suprimida. No se afirma prueba de pinch físico.'};
// La vía de estrella no usa franja de horizonte; se llama antes del hit-test de figura.
const estrella=campo.estrellas.find(e=>e.datos&&e.datos.con);
const W=1000,H=600,zoom=1,k=M.escala({zoom},W,H);
const cam={u:estrella.u,v:estrella.v-(570-H/2)/k,zoom};
M.ajustarCamara(campo,cam);
const p=M.aPantalla(estrella,cam,W,H),h=M.franjaHorizonte(W,H);
assert(p.y>=h.y&&p.y<=H);
const picked=M.estrellaEn(campo,cam,W,H,p,16);assert.equal(picked,estrella);
const es={M,campo,estado:{camara:cam,descubiertas:{[estrella.datos.con]:true}},medir:()=>({W,H}),congelarCamara:noop,abrirEstrella:e=>{report.estrellaOculta={con:e.datos.con,pantalla:p,horizonte:h,abreFicha:true};}};
vm.createContext(es);
for(const n of ['examinar','hayReveladaCerca']){const a=src.indexOf('  function '+n+'('),b=src.indexOf('\n  function ',a+1);vm.runInContext(src.slice(a,b),es);}
es.examinar('puntero',p);assert(report.estrellaOculta.abreFicha);
report.descripcion={cuentaEstrellaBajoHorizonte:M.estrellasEnZona(campo,cam,W,H,p).some(x=>x.estrella===estrella),nota:'estrellasEnZona no comparte filtro de horizonte/oclusión de examinar'};
// Zoom real fija u/v: un punto excéntrico se aleja del puntero.
const puntoCampo={u:0.6,v:0.2},antes=M.aPantalla(puntoCampo,{u:0,v:0,zoom:1},W,H);
const despues=M.aPantalla(puntoCampo,{u:0,v:0,zoom:1.25},W,H);
report.zoomCentral={antes,despues,desplazamiento:Math.hypot(despues.x-antes.x,despues.y-antes.y),nota:'Cálculo del motor coherente con ampliar(); propuesta UX, no fallo de conformidad'};
report.procedenciaDatos={campos:g.IG_INDICE.campos.map(c=>({id:c.id,nombre:c.nombre_es,ids:c.constelaciones}))};
fs.writeFileSync(path.join(__dirname,'INTERACCION_FORMATO_RESULTADOS.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({...report,procedenciaDatos:undefined},null,2));
