// Isolated logic checks on the original app.js. Minimal DOM doubles, NOT browser QA.
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'IRIS_GREEN_WEB_R01');
const source=fs.readFileSync(path.join(root,'assets/js/app.js'),'utf8');
class El {
 constructor(attrs={},text=''){this.attrs=attrs;this.textContent=text;this.value='';this.events={};this.hidden=false;}
 getAttribute(k){return this.attrs[k]??null;}
 setAttribute(k,v){this.attrs[k]=v;}
 addEventListener(k,f){this.events[k]=f;}
 focus(){this.focused=true;}
}
function fixture(search='',count=9){
 const input=new El(),first=new El(),second=new El(),counter=new El(),empty=new El();
 const cards=Array.from({length:count},(_,i)=>new El({'data-etiquetas':'juego'},'Juego '+i));
 const zone={querySelector:s=>({'[data-busqueda]':input,'[data-cuenta]':counter,'[data-vacio]':empty,'[data-limpiar]':first}[s]),querySelectorAll:s=>s==='[data-ficha]'?cards:[]};
 const doc={querySelector:s=>s==='[data-catalogo]'?zone:null,addEventListener(){}};
 const ctx={window:{},document:doc,location:{search,pathname:'/juegos.html'}};
 vm.runInNewContext(source,ctx);return {ctx,input,first,second,counter,empty,cards};
}
const out={method:'Original app.js executed in Node VM with minimal DOM doubles. Not a rendered or native-input test.',checks:[]};
let f=fixture();f.ctx.window.IG.filtros();
out.checks.push({id:'COUNT_LABEL',observed:f.counter.textContent,expected:'9 juegos'});
f.input.value='zzzz';f.input.events.input();
out.checks.push({id:'EMPTY_RESET_UNBOUND',emptyVisible:!f.empty.hidden,firstHasClick:!!f.first.events.click,secondHasClick:!!f.second.events.click});
f.first.events.click();out.checks.push({id:'TOP_RESET_WORKS',visible:f.cards.filter(c=>!c.hidden).length});
f=fixture('?q=%E0%A4%A');try{f.ctx.window.IG.filtros();out.checks.push({id:'MALFORMED_QUERY',threw:false});}catch(e){out.checks.push({id:'MALFORMED_QUERY',threw:true,error:e.name,message:e.message});}
// Source-level checks establishing correspondence of fixtures with actual HTML.
for(const name of ['buscar','condiciones','juegos','situaciones']){
 const html=fs.readFileSync(path.join(root,name+'.html'),'utf8');
 out.checks.push({id:'ACTUAL_RESET_NODES',page:name,count:(html.match(/data-limpiar/g)||[]).length,handlerUsesFirstOnly:source.includes("zona.querySelector('[data-limpiar]')")});
}
fs.writeFileSync(path.join(__dirname,'REPRODUCTIONS.json'),JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));
