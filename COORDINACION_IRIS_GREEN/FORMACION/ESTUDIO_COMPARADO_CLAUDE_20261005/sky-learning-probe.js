// Ejercicio de aprendizaje. No modifica ni simula la interfaz del producto.
// Uso: node sky-learning-probe.js /ruta/al/CIELO_ORION_INTERACTIVO_R01
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');
const root = process.argv[2];
if (!root) throw new Error('Falta ruta al paquete Cielo');
const box = {window:{}};
vm.createContext(box);
for (const f of ['config.js','datos-cielo.js','motor.js']) {
  vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),box,{filename:f});
}
const M=box.window.IG_MOTOR, C=box.window.IG_CONFIG;
const campo=M.construirCampo(box.window.IG_SKY_DATA);
const centro=M.centroide(campo,C.CINTURON_IDS);
const rows=[];
let inversas=0;
for (const [W,H] of [[1440,558],[390,574],[320,386]]) {
 const inicial=M.camaraInicial(campo,W,H);
 const antes=M.examinarRegion(campo,inicial,W,H,[],C.CINTURON_IDS);
 const centrada={...inicial,u:centro.u,v:centro.v};
 const despues=M.examinarRegion(campo,centrada,W,H,[],C.CINTURON_IDS);
 assert(despues.coincide);
 rows.push({W,H,todasVisiblesInicial:antes.detalle.every(x=>x.enEscenario),examinableInicial:antes.coincide,examinableCentrado:despues.coincide});
 for (const zoom of [0.8,1,2]) for (const p of [{u:0,v:0},centro,{u:-0.2,v:0.4}]) {
  const cam={...inicial,zoom}, q=M.aPantalla(p,cam,W,H), k=M.escala(cam,W,H);
  const vuelta={u:cam.u+(q.x-W/2)/k,v:cam.v+(q.y-H/2)/k};
  assert(Math.abs(vuelta.u-p.u)<1e-12 && Math.abs(vuelta.v-p.v)<1e-12);
  inversas++;
 }
}
console.log(JSON.stringify({alcance:'Geometría pura; no navegador ni corrección implementada',rows,inversas},null,2));
