// Probe determinista Nexo: aceptación sin intención, NO tasa de falsos positivos.
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(process.argv[2]);const g={};g.window=g;vm.createContext(g);
for(const p of ['js/config.js','js/motor.js',...fs.readdirSync(path.join(root,'datos/campos')).sort().map(x=>'datos/campos/'+x)])vm.runInContext(fs.readFileSync(path.join(root,p),'utf8'),g);
const M=g.IG_MOTOR;let seed=20261006;
const random=()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;};
const results={method:{engine:'original js/motor.js',seed,n:4000,camera:'u=0,v=0,zoom=1.35; ajustada por motor',exclude:{},sampling:'uniforme sobre rectángulo total W×H',occlusion:'horizonte del motor; sin controles ni panel',meaning:'proporción aceptada, NO errores contra una verdad-terreno de intención',limitations:'sin navegador, no distribución real de gestos; dimensiones de probe Axioma no medición nueva'},models:[]};
for(const [W,H]of [[296,352],[366,523],[1408,558]]){
 const fields=[];
 for(const [id,data]of Object.entries(g.IG_CAMPO)){
  const field=M.construirCampo(data),cam=M.camaraInicial(field,W,H);let accepted=0;let above=0,acceptedAbove=0;
  const candidates={};
  for(let i=0;i<4000;i++){
   const p={x:random()*W,y:random()*H};const r=M.examinar(field,cam,W,H,[],p,{});
   if(p.y<M.franjaHorizonte(W,H).y)above++;
   if(r.coincide){accepted++;candidates[r.mejor.abbr]=(candidates[r.mejor.abbr]||0)+1;if(p.y<M.franjaHorizonte(W,H).y)acceptedAbove++;}
  }
  fields.push({id,accepted,rate:accepted/4000,aboveHorizonRate:acceptedAbove/above,candidates});
 }
 const rates=fields.map(x=>x.rate).sort((a,b)=>a-b);
 results.models.push({W,H,radius:M.radioZona(W,H),mean:rates.reduce((a,b)=>a+b)/rates.length,median:(rates[5]+rates[6])/2,min:rates[0],max:rates.at(-1),fields});
}
const clues=Object.values(g.IG_CAMPO).flatMap(c=>c.constelaciones.map(k=>k.pista.es));
results.clues={total:clues.length,starMagnitudeTemplate:clues.filter(x=>/^Busca una estrella clara de magnitud/.test(x)).length};
fs.writeFileSync(path.join(__dirname,'ESPECIFICIDAD_RESULTADOS.json'),JSON.stringify(results,null,2));
console.log(JSON.stringify({...results,models:results.models.map(({fields,...r})=>r)},null,2));
