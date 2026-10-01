import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const base=process.argv[2]||'dist';
const callbacks={};const store=new Map();
const document={readyState:'loading',body:null,documentElement:{dataset:{},lang:'es'},querySelectorAll:()=>[],addEventListener:()=>{}};
const context={document,URL,location:{origin:'https://irisgreen.eu',href:'https://irisgreen.eu/'},sessionStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},MutationObserver:class{observe(){}},CustomEvent:class{constructor(type,options){this.type=type;this.detail=options?.detail}},fetch:async url=>({ok:true,json:async()=>JSON.parse(fs.readFileSync(base+url,'utf8'))}),console};
context.window={addEventListener:(k,f)=>(callbacks[k]??=[]).push(f),dispatchEvent:e=>(callbacks[e.type]||[]).forEach(f=>f(e))};vm.createContext(context);
for(const file of ['ig-audience.js','buscador-comun.js'])vm.runInContext(fs.readFileSync(base+'/assets/'+file,'utf8'),context);
const {IGAudience:A,IGSearch:S}=context.window;const totals={};
for(const age of ['AGE_0_12','AGE_13_17','AGE_18_PLUS','ALL_AGES']){
 A.set(age);const hits=await S.load();totals[age]=hits.length;
 assert.equal(A.get(),age);
 if(age==='AGE_0_12'){
  assert.equal(hits.length,6);assert.equal(await A.allowedUrl('/es/neurodiversidad/condiciones/autismo/'),false);assert.equal(await A.allowedUrl('/en/situations/'),false);
  assert.equal((await S.search('ruido',{lang:'es'}))[0].url,'/es/sitio-tranquilo/');
 }else if(age==='AGE_18_PLUS'){
  assert.equal(hits.length,378);assert.equal(A.allowedAgeBands(['AGE_0_12']),true);assert.equal(await A.allowedUrl('/es/tramites/directorio/'),true);
 }else if(age==='ALL_AGES'){assert.equal(hits.length,371);assert.equal(A.allowedAgeBands(['AGE_18_PLUS']),true);}
 else {assert.equal(A.allowedAgeBands(['AGE_18_PLUS']),false);assert.equal(await A.allowedUrl('/es/tramites/directorio/'),false);}
}
A.set('AGE_18_PLUS');assert.equal((await S.load()).length,378);A.set('AGE_0_12');assert.equal((await S.load()).length,6);
// The research observer must not mutate its own children indefinitely.
let adult=true,appends=0,clears=0;const events={},observers=[];
const holder={dataset:{},replaceChildren(){clears++;},appendChild(){appends++;}};
const article={innerHTML:'safe summary',getAttribute:()=> 'research-005',querySelector:()=>holder};
const doc={readyState:'complete',documentElement:{lang:'es'},body:{},querySelector:()=>null,querySelectorAll:s=>s==='article[data-ig-research-s2]'?[article]:[],createElement:()=>({addEventListener(){}})};
const c={document:doc,window:{IGAudience:{isAdult:()=>adult},addEventListener:(k,f)=>events[k]=f},MutationObserver:class{constructor(f){observers.push(f)}observe(){}}};vm.createContext(c);vm.runInContext(fs.readFileSync(base+'/assets/ig-child-safe.js','utf8'),c);
for(let i=0;i<8;i++)observers[0]();assert.equal(appends,1);assert.equal(clears,1);
adult=false;events['ig:audience-change']();for(let i=0;i<8;i++)observers[0]();assert.equal(appends,1);assert.equal(clears,2);
console.log(JSON.stringify({ageModes:totals,ageSwitch:'PASS',childDirectRoutes:'PASS',adultCatalogue:'PASS',researchObserver:'PASS'}));
