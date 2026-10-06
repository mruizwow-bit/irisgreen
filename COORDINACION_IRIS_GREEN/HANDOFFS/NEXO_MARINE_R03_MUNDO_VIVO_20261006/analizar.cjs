// Revisión de datos y listeners originales en fixture; no navegador ni HUMAN QA.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.resolve(process.argv[2]||path.join(__dirname,'descubrimiento-peces'));
const src=fs.readFileSync(path.join(root,'app/interfaz.js'),'utf8');
const ds=fs.readFileSync(path.join(root,'app/datos.js'),'utf8');
const d=JSON.parse(ds.slice(ds.indexOf('{'),ds.lastIndexOf('}')+1));
function gesture(type,ms){
 const handlers={},calls=[];let now=0;
 const noop=()=>{};
 const c={zona:{addEventListener:(n,f)=>handlers[n]=f,focus:noop,setPointerCapture:noop,releasePointerCapture:noop},marco:{getBoundingClientRect:()=>({left:0,top:0,width:1000,height:600}),classList:{add:noop,remove:noop}},GESTOS:d.gestos,performance:{now:()=>now},motor:{apuntar:(...p)=>calls.push(p),arrastrarCamara:noop},pintarPistaVista:noop};
 vm.createContext(c);vm.runInContext(src.slice(src.indexOf('    function local(ev)'),src.indexOf('    /* Teclado, sólo')),c);
 const ev={pointerId:1,clientX:300,clientY:250,preventDefault:noop};handlers.pointerdown(ev);now=ms;handlers[type](ev);return calls;
}
const short=gesture('pointerup',100),slow=gesture('pointerup',500),cancel=gesture('pointercancel',100);
assert.equal(short.length,1);assert.equal(slow.length,0);assert.equal(cancel.length,1);
const result={metodo:'Datos leídos y handlers originales ejecutados en fixture Node, sin DOM nativo',catalogo:d.catalogo.length,modoEquipo:d.modoEquipo,escenas:d.escenas.map(e=>({id:e.id,slots:e.animales.length,soloModoEquipo:!!e.soloModoEquipo})),gestos:{clic100ms:short,clic500ms:slow,cancelacion100ms:cancel},diagnostico:{cancelacionConfirmaLuz:cancel.length===1,clicLentoSinArrastreDescartado:slow.length===0},fuentesCodigo:['app/datos.js: gestos/escenas/catalogo','app/interfaz.js: conectarEscena/soltar','app/motor.js: fondo/posicionMundo/dibujarDeformado/evaluar/cargarEscena']};
fs.writeFileSync(path.join(__dirname,'RESULTADOS_R03.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
