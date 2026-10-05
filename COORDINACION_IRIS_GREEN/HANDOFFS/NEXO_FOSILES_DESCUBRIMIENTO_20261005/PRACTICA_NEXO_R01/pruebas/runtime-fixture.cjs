'use strict';
// Executes the delivered app in a minimal DOM fixture and a native 2D canvas.
// This is NOT a browser, CSS layout, accessibility or physical-device test.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {createCanvas,loadImage}=require(process.env.CANVAS_MODULE||'@napi-rs/canvas');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
async function run(W,H,capture){
 let document,frames=[],resizeObserver,requests=0;
 class Element{
  constructor(tag='div'){this.tagName=tag;this.children=[];this.dataset={};this.style={};this.attrs={};this.listeners={};this.hidden=false;this.open=false;this._text='';this.parent=null;this.isConnected=true;this.captures=new Set()}
  set textContent(v){this._text=String(v);this.children=[]}get textContent(){return this._text+this.children.map(x=>x.textContent).join(' ')}
  append(...xs){for(const x of xs){this.children.push(x);x.parent=this}}
  replaceChildren(...xs){for(const x of this.children)x.isConnected=false;this.children=[];this._text='';this.append(...xs)}
  get firstChild(){return this.children[0]}get lastChild(){return this.children.at(-1)}get options(){return this.children}
  setAttribute(k,v){this.attrs[k]=String(v)}getAttribute(k){return this.attrs[k]}
  addEventListener(k,f){(this.listeners[k]??=[]).push(f)}
  emit(k,ev={}){for(const f of this.listeners[k]||[])f({preventDefault(){},...ev})}
  focus(){document.activeElement=this}click(){this.focus();this.onclick?.({target:this})}
  querySelector(tag){for(const c of this.children){if(c.tagName===tag)return c;const n=c.querySelector(tag);if(n)return n}return null}
  remove(){this.parent.children=this.parent.children.filter(x=>x!==this);this.isConnected=false}
  showModal(){this.open=true}close(){this.open=false;this.emit('close')}
  getBoundingClientRect(){return {width:W,height:H,left:0,top:0}}
  setPointerCapture(id){this.captures.add(id)}hasPointerCapture(id){return this.captures.has(id)}releasePointerCapture(id){this.captures.delete(id)}
 }
 class Canvas extends Element{
  constructor(){super('canvas');this.native=createCanvas(300,150)}
  set width(v){this.native.width=v}get width(){return this.native.width}set height(v){this.native.height=v}get height(){return this.native.height}
  getContext(){const c=this.native.getContext('2d');return new Proxy(c,{get(t,k){if(k==='drawImage'||k==='createPattern')return (img,...a)=>t[k](img.native||img,...a);const v=t[k];return typeof v==='function'?v.bind(t):v},set(t,k,v){t[k]=v;return true}})}
 }
 const nodes={};for(const m of html.matchAll(/<([\w-]+)[^>]*\bid="([^"]+)"[^>]*>/g)){const n=m[1]==='canvas'?new Canvas():new Element(m[1]);n.id=m[2];n.hidden=/\shidden(?:\s|>)/.test(m[0]);nodes[n.id]=n}
 const translated=[];for(const m of html.matchAll(/<([\w-]+)[^>]*data-t="([^"]+)"[^>]*>/g)){const id=m[0].match(/\bid="([^"]+)"/);const n=id?nodes[id[1]]:new Element(m[1]);n.dataset.t=m[2];translated.push(n)}
 for(const value of ['normal','reduced','none']){const e=new Element('option');e.value=value;nodes.motion.append(e)}
 document={documentElement:{lang:'es'},activeElement:null,getElementById:id=>nodes[id],createElement:tag=>tag==='canvas'?new Canvas():new Element(tag),querySelectorAll:()=>translated};
 const pending=[];
 class Image{set src(s){requests++;const p=loadImage(path.join(root,s)).then(im=>{this.native=im;this.onload?.()}).catch(e=>{this.onerror?.(e)});pending.push(p)}}
 const context={window:{devicePixelRatio:1},document,Image,Option:class extends Element{constructor(t,v){super('option');this.textContent=t;this.value=v}},ResizeObserver:class{constructor(f){resizeObserver=f}observe(){}},matchMedia:()=>({matches:false}),requestAnimationFrame:f=>{frames.push(f)},console};
 vm.createContext(context);for(const f of ['assets/data.js','model.js','app.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),context,{filename:f});
 async function flush(){await Promise.all(pending);await new Promise(r=>setImmediate(r));for(let n=0;frames.length&&n<5;n++){const q=frames;frames=[];q.forEach(f=>f())}assert.equal(frames.length,0,'no autonomous animation loop')}
 await flush();assert(nodes.loading.hidden,'loaded');
 if(capture)fs.writeFileSync(path.join(__dirname,'escena-inicial.png'),nodes.scene.native.toBuffer('image/png'));
 const key=k=>nodes.scene.emit('keydown',{key:k});
 const pointer=(kind,x,y)=>nodes.scene.emit(kind,{pointerId:1,button:0,clientX:x,clientY:y});
 const unchanged=nodes.scene.native.toBuffer('image/png');pointer('pointermove',100,100);await flush();assert(unchanged.equals(nodes.scene.native.toBuffer('image/png')),'hover must not move camera');
 nodes.nextClue.click();await flush();nodes.examine.click();assert(nodes.depth.hidden,'no identity before uncovering');
 // Drag in explore mode must not remove sediment or automatically select.
 pointer('pointerdown',W/2,H/2);pointer('pointermove',W/2+35,H/2+10);pointer('pointerup',W/2+35,H/2+10);await flush();assert(nodes.depth.hidden);
 let found=0;const results=[];
 for(let s=0;s<context.window.FOSSILS_DATA.sectors.length;s++){
  nodes.sectorNav.children[s].click();await flush();
  for(const [i,p]of context.window.FOSSILS_DATA.sectors[s].pieces.entries()){
   nodes.clueList.children[i].click();await flush();nodes.examine.click();assert(nodes.depth.hidden,p.id+' cannot start identified');
   let steps=0;while(nodes.depth.hidden&&steps<70){nodes.step.click();nodes.examine.click();steps++}
   assert(!nodes.depth.hidden,p.id+' unreachable: '+nodes.status.textContent);assert.equal(nodes.noteTitle.textContent,p.nombre.es);found++;results.push({id:p.id,steps});
   await flush();if(capture&&found===1)fs.writeFileSync(path.join(__dirname,'escena-hallazgo.png'),nodes.scene.native.toBuffer('image/png'));
   nodes.save.click();nodes.save.click();assert.equal(nodes.count.textContent,String(found),'no duplicate collection entry');
   const before=nodes.scene.native.toBuffer('image/png');nodes.lang.click();await flush();assert.equal(nodes.noteTitle.textContent,p.nombre.en);assert(before.equals(nodes.scene.native.toBuffer('image/png')),'language preserves scene');nodes.lang.click();
   nodes.depth.click();assert(nodes.dialog.open);assert.equal(nodes.dialogTitle.textContent,p.nombre.es);nodes.closeDialog.click();assert(!nodes.dialog.open);assert.equal(document.activeElement,nodes.depth,'fixture focus return');
  }
 }
 assert.equal(found,14);nodes.sectorNav.children[0].click();await flush();nodes.clueList.children[0].click();assert(!nodes.depth.hidden,'progress survives sector change');
 nodes.scene.focus();key('ArrowRight');key('ArrowLeft');key('Enter');await flush();
 nodes.collection.click();assert.equal(nodes.dialogBody.children[0].children.length,14);nodes.closeDialog.click();
 resizeObserver();await flush();assert.equal(nodes.count.textContent,'14');
 assert.equal(requests,new Set(context.window.FOSSILS_DATA.sectors.flatMap(e=>[e.background,...e.pieces.map(p=>p.asset)])).size+1,'loaded images cached');
 console.log(JSON.stringify({fixture:[W,H],found,requests,results,pass:true}));
}
(async()=>{for(const [w,h]of [[286,360],[356,464],[850,560]])await run(w,h,w===850);console.log('PASS DOM fixture + native canvas. NOT browser QA.');})().catch(e=>{console.error(e);process.exit(1)});
