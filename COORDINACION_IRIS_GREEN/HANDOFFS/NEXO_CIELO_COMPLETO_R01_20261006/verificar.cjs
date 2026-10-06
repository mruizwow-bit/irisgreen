// Revisión independiente de lógica. No es un navegador ni HUMAN QA.
const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert');
const root = path.resolve(process.argv[2] || '../cielo-completo-r01-review/DESCUBRIMIENTO_CIELO_COMPLETO_R01');
const g = {}; g.window = g; vm.createContext(g);
const read = p => fs.readFileSync(path.join(root,p),'utf8');
for (const p of ['js/config.js','js/motor.js','js/copia.js','datos/indice.js', ...fs.readdirSync(path.join(root,'datos/campos')).map(x=>'datos/campos/'+x), ...fs.readdirSync(path.join(root,'datos/fichas')).map(x=>'datos/fichas/'+x)]) vm.runInContext(read(p),g,{filename:p});
const M=g.IG_MOTOR, index=g.IG_INDICE, src=read('js/interfaz.js');
const reports={alcance:'Datos, motor y funciones/eventos originales en fixtures Node; sin navegador ni DOM nativo',campos:index.campos.length};
const ids=index.campos.flatMap(c=>c.constelaciones);
assert.equal(ids.length,88); assert.equal(new Set(ids).size,88);
for(const id of ids){const f=g.IG_FICHA[id]; assert(f); for(const type of ['svg','png']) assert(fs.existsSync(path.join(root,f.material_visual[type])),id+':'+type);}
reports.coberturaArchivos={constelaciones:88,fichas:88,svg:88,png:88};
function find(campo,abbr){
 const k=campo.porAbbr[abbr], pts=k.especial?k.especial.estrellas:k.puntos;
 const center={u:pts.reduce((s,p)=>s+p.u,0)/pts.length,v:pts.reduce((s,p)=>s+p.v,0)/pts.length};
 for(let z=g.IG_CONFIG.ZOOM.minimo;z<=g.IG_CONFIG.ZOOM.maximo;z*=g.IG_CONFIG.ZOOM.paso){for(const p of [center,...pts]){
  const cam={u:p.u,v:p.v,zoom:z};M.ajustarCamara(campo,cam);
  const r=M.examinar(campo,cam,1408,558,[],{x:704,y:279},{});
  if(r.coincide&&r.mejor.abbr===abbr)return cam;
 }} return null;
}
const coverage=[];
for(const meta of index.campos){const c=M.construirCampo(g.IG_CAMPO[meta.id]); for(const k of c.constelaciones)coverage.push({campo:meta.id,abbr:k.abbr,camara:find(c,k.abbr)});}
reports.coberturaGeometrica={identificables:coverage.filter(x=>x.camara).length,total:88,nota:'Cámara posicionada por código; no recorridos humanos ni identificación persistida',detalle:coverage};
// Extraer funciones sin modificar sus cuerpos. Sus colaboradores visuales se sustituyen por stubs.
function fn(name){const start=src.indexOf('  function '+name+'(');assert(start>=0);const end=src.indexOf('\n  function ',start+1);return src.slice(start,end<0?src.length:end);}
const campo=M.construirCampo(g.IG_CAMPO['campo-01']);
const stub=()=>{}; const ctx={M,campo,estado:{descubiertas:{},etapas:{},idioma:'es',describir:false},el:{'objetivo-campo':{textContent:''},'btn-revelar':{focus:stub},escenario:{focus:stub}},t:()=>g.IG_COPIA.es,medir:()=>({W:1408,H:558}),congelarCamara:stub,zonasOcluidas:()=>[],guardar:stub,pintarMensaje:stub,pintar:stub,actualizarCabeceraCampo:stub,anunciar:stub,textoMensaje:()=>'',actualizarDescripcion:stub};
vm.createContext(ctx);for(const f of ['elegirObjetivo','pintarObjetivo','examinar'])vm.runInContext(fn(f),ctx);
ctx.elegirObjetivo();const target=ctx.estado.objetivoActual, before=ctx.el['objetivo-campo'].textContent;
ctx.estado.camara=find(campo,target);assert(ctx.estado.camara);
ctx.examinar('escenario');assert(ctx.estado.descubiertas[target]);
reports.pistaTrasHallazgo={constelacion:target,descubierta:ctx.estado.descubiertas[target],objetivoDespues:ctx.estado.objetivoActual,antes:before,despues:ctx.el['objetivo-campo'].textContent,defectoReproducido:ctx.estado.objetivoActual===target&&before===ctx.el['objetivo-campo'].textContent};
assert(reports.pistaTrasHallazgo.defectoReproducido);
// Ejecutar los listeners originales de puntero sobre un lienzo simulado.
const listeners={}, calls=[];const cv={u:0,v:0,zoom:1};
const pc={CFG:g.IG_CONFIG,M,campo,estado:{camara:cv,tecladoActivo:true},el:{lienzo:{addEventListener:(n,f)=>listeners[n]=f,getBoundingClientRect:()=>({left:10,top:20}),setPointerCapture:stub,classList:{add:stub,remove:stub}}},medir:()=>({W:1408,H:558}),cancelarAnimacion:stub,pintar:stub,trasMovimiento:()=>calls.push({type:'pan'}),examinar:(origen,punto)=>calls.push({type:'examinar',origen,punto})};
vm.createContext(pc);vm.runInContext(src.slice(src.indexOf('    var puntero = null;'),src.indexOf('    /* La rueda amplía')),pc);
const ev=(x,y)=>({pointerId:1,button:0,clientX:x,clientY:y});
listeners.pointermove(ev(200,200));assert.equal(calls.length,0);assert.deepEqual(pc.estado.camara,cv);
listeners.pointerdown(ev(310,220));listeners.pointerup(ev(310,220));assert.deepEqual(JSON.parse(JSON.stringify(calls[0])),{type:'examinar',origen:'puntero',punto:{x:300,y:200}});
listeners.pointerdown(ev(310,220));listeners.pointermove(ev(350,250));listeners.pointerup(ev(350,250));assert.equal(calls.filter(x=>x.type==='examinar').length,1);assert.equal(calls[1].type,'pan');
reports.puntero={hoverNoAcciona:true,clicUsaCoordenadaReal:true,arrastreNoExamina:true,tecladoActivoTrasClic:pc.estado.tecladoActivo};
reports.cabeceraEstatica={htmlContienePistaOrion:read('index.html').includes('data-t="objetivo">Busca tres estrellas brillantes casi en línea.'),nota:'aplicarIdioma traduce data-t; abrirCampo solo actualiza objetivo-campo, no esta cabecera'};
reports.pistasIdenticasMismoCampo=[];
for(const [id,c] of Object.entries(g.IG_CAMPO)){
 const groups={};for(const k of c.constelaciones)(groups[k.pista.es]??=[]).push(k.abbr);
 for(const [pista,abbrs]of Object.entries(groups))if(abbrs.length>1)reports.pistasIdenticasMismoCampo.push({campo:id,abbrs,pista});
}
// Simular dos cargas que terminan fuera de orden: no afirma frecuencia real de red/disco.
const queue=[];const rc={M,INDICE:index,g:{IG_CAMPO:{}},estado:{idioma:'es',descubiertas:{},etapas:{}},el:{'campo-nombre':{textContent:''},'objetivo-campo':{textContent:''}},campo:null,campoMeta:null,mostrarPantalla:stub,t:()=>g.IG_COPIA.es,medir:()=>({W:1408,H:558}),cerrarPanel:stub,elegirObjetivo:stub,redimensionar:stub,pintarMensaje:stub,actualizarCabeceraCampo:stub,guardar:stub,mostrarAviso:stub,cargarScript:(p,cb)=>queue.push({p,cb})};
vm.createContext(rc);vm.runInContext(fn('abrirCampo'),rc);
rc.abrirCampo('campo-01');rc.abrirCampo('campo-02');
rc.g.IG_CAMPO=g.IG_CAMPO;queue[1].cb(null);queue[0].cb(null);
reports.cargaFueraDeOrden={campoId:rc.estado.campoId,campoMeta:rc.campoMeta.id,figurasVisibles:rc.campo.constelaciones.map(k=>k.abbr),deberianSer:index.campos[1].constelaciones,defectoReproducido:rc.campo.constelaciones[0].abbr!==index.campos[1].constelaciones[0]};
assert(reports.cargaFueraDeOrden.defectoReproducido);
fs.writeFileSync(path.join(__dirname,'RESULTADOS.json'),JSON.stringify(reports,null,2));
console.log(JSON.stringify({...reports,coberturaGeometrica:{...reports.coberturaGeometrica,detalle:undefined}},null,2));
