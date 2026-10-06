const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(process.argv[2]||'web-r02-review-20261006/extracted/IRIS_GREEN_WEB_R02');
const code=fs.readFileSync(path.join(root,'assets/js/app.js'),'utf8');
const events={};let width=390;const document={activeElement:null,body:{getAttribute:()=> 'es'},documentElement:{style:{},setAttribute(){}},addEventListener(){},querySelectorAll:()=>[]};
function node(name,visible=()=>true){return {name,attrs:{},events:{},get offsetParent(){return visible()?{}:null},setAttribute(k,v){this.attrs[k]=v},getAttribute(k){return this.attrs[k]},removeAttribute(k){delete this.attrs[k]},addEventListener(k,v){this.events[k]=v},contains(n){return this===n},focus(){document.activeElement=this}}}
const open=node('menu-open',()=>width<1100),close=node('menu-close',()=>width<1100),link=node('area-link');
const panel=node('panel');panel.querySelectorAll=()=>[close,link];panel.contains=n=>[panel,close,link].includes(n);
const options=['normal','reduced','none'].map(v=>Object.assign(node(v),{value:v,checked:false}));let notice=node('notice');
const settings=node('settings');settings.querySelectorAll=()=>options;settings.querySelector=()=>notice;
document.querySelector=s=>({'[data-menu-boton]':open,'[data-menu-panel]':panel,'[data-menu-cerrar]':close,'[data-ajustes]':settings}[s]||null);
const window={innerWidth:390,addEventListener:(k,f)=>events[k]=f,localStorage:{getItem:()=>null,setItem(){throw Error('storage unavailable')}}};
vm.runInNewContext(code,{window,document,location:{search:''}});window.IG.menu();open.events.click();const before=document.activeElement.name;width=1100;window.innerWidth=1100;events.resize();
const results={scope:'Original app.js executed in Node VM with minimal DOM fixture; not browser or AT QA.',resize:{focusBefore:before,focusAfter:document.activeElement.name,focusedControlHidden:document.activeElement.offsetParent===null},storage:{}};
window.IG.ajustes();options[2].checked=true;options[2].events.change();results.storage={writeThrows:true,message:notice.textContent};
console.log(JSON.stringify(results,null,2));
