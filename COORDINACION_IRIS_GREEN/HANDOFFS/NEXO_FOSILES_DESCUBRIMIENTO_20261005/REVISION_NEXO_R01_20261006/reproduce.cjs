'use strict';
// Executes the delivered app in a minimal DOM fixture and a native 2D canvas.
// This is NOT a browser, CSS layout, accessibility or physical-device test.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {createCanvas,loadImage}=require(process.env.CANVAS_MODULE||'@napi-rs/canvas');
const root=path.resolve(process.argv[2]||path.join(__dirname,'../nexo-fosiles-r01')),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
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
 vm.createContext(context);for(const f of ['assets/data.js','model.js','app.js']){let code=fs.readFileSync(path.join(root,f),'utf8');if(f==='app.js')code=code.replace(/\}\)\(\);\s*$/,`window.__audit=()=>({selected,point,mode,camera:{...state().camera},mask:state().mask.slice(),sector:sector(),identified:[...identified]});})();`);vm.runInContext(code,context,{filename:f})}
 async function flush(){await Promise.all(pending);await new Promise(r=>setImmediate(r));for(let n=0;frames.length&&n<5;n++){const q=frames;frames=[];q.forEach(f=>f())}assert.equal(frames.length,0,'no autonomous animation loop')}
 await flush();assert(nodes.loading.hidden);
 const audit=()=>context.window.__audit(),M=context.window.FossilModel;
 const key=k=>nodes.scene.emit('keydown',{key:k});
 const pointer=(kind,x,y)=>nodes.scene.emit(kind,{pointerId:1,button:0,clientX:x,clientY:y});
 const evidence=[];
 function record(id,details){evidence.push({id,...details});console.log(JSON.stringify(evidence.at(-1)))}
 nodes.clueList.children[0].click();nodes.brush.click();await flush();
 let a=audit(),p=a.selected,clicks=0;
 while(!M.ready(a.mask,p)&&clicks<300){
  const q=p.samples.find(q=>!M.isClear(a.mask,p.x-p.w/2+q[0]*p.w,p.y-p.h/2+q[1]*p.h));if(!q){nodes.step.click();const announced=nodes.status.textContent;nodes.examine.click();assert(nodes.depth.hidden);record('R00_FALSE_READY_AT_FULL_SAMPLE_COVERAGE',{coverage:M.coverage(a.mask,p),visible_features:p.features.filter(f=>M.featureVisible(a.mask,p,f)).length,announced,examine_status:nodes.status.textContent});for(const f of p.features){const loc=M.screen({x:p.x-p.w/2+f.x*p.w,y:p.y-p.h/2+f.y*p.h},a.camera,W,H);pointer('pointerdown',loc.x,loc.y);pointer('pointerup',loc.x,loc.y)}a=audit();break}
  const xy=M.screen({x:p.x-p.w/2+q[0]*p.w,y:p.y-p.h/2+q[1]*p.h},a.camera,W,H);
  pointer('pointerdown',xy.x,xy.y);pointer('pointerup',xy.x,xy.y);a=audit();clicks++;
 }
 assert(M.ready(a.mask,p));assert.equal(nodes.status.textContent,'Se ha retirado cobertura en la zona elegida.');
 record('R03_READY_MESSAGE_OVERWRITTEN',{clicks,note:nodes.noteTitle.textContent,status:nodes.status.textContent});
 nodes.explore.click();for(let n=0;n<80;n++)key('ArrowRight');
 a=audit();const right=M.screen({x:p.x+p.w/2,y:p.y},a.camera,W,H).x;assert(right<0);
 nodes.examine.click();assert(!nodes.depth.hidden);assert.equal(nodes.noteTitle.textContent,p.nombre.es);
 record('R01_EXAMINE_OFFSCREEN',{piece:p.id,right_edge_screen_x:right,identity_revealed:nodes.noteTitle.textContent});
 nodes.sectorNav.children[2].click();await flush();nodes.clueList.children[0].click();nodes.brush.click();
 a=audit();const target=a.sector.pieces[1],delta=38/M.scale(a.camera,W,H),dx=Math.round((target.x-a.point.x)/delta),dy=Math.round((target.y-a.point.y)/delta);
 for(let n=0;n<Math.abs(dx);n++)key(dx>0?'ArrowRight':'ArrowLeft');for(let n=0;n<Math.abs(dy);n++)key(dy>0?'ArrowDown':'ArrowUp');
 const before=audit(),xy=M.screen(before.point,before.camera,W,H);assert(xy.x>W||xy.y>H);key('Enter');const after=audit();let changed=0;for(let i=0;i<before.mask.length;i++)if(before.mask[i]!==after.mask[i])changed++;
 assert(changed>0);assert.equal(after.selected.id,target.id);
 record('R02_BRUSH_OFFSCREEN',{target:target.id,point_screen:xy,scene:[W,H],mask_cells_changed:changed});
 nodes.lang.click();assert.equal(audit().mode,'brush');assert(nodes.status.textContent.startsWith('Drag to explore'));
 record('R04_LANGUAGE_WRONG_MODE_INSTRUCTION',{mode:audit().mode,status:nodes.status.textContent});nodes.lang.click();
 nodes.sectorNav.children[5].click();await flush();nodes.clueList.children[1].click();
 a=audit();p=a.selected;const pick={x:p.x+p.w*.2,y:p.y+p.h*.2},screen=M.screen(pick,a.camera,W,H);
 pointer('pointerdown',screen.x,screen.y);pointer('pointerup',screen.x,screen.y);assert.equal(audit().selected.id,p.id);nodes.step.click();a=audit();
 const displacement=Math.hypot(a.point.x-pick.x,a.point.y-pick.y);assert(displacement>100);
 record('R05_THIS_AREA_MOVES_ELSEWHERE',{selected_point:pick,cleared_point:a.point,world_distance:displacement});
 const stateBeforeMotion=JSON.stringify(audit().camera);nodes.motion.value='none';nodes.motion.onchange();assert.equal(JSON.stringify(audit().camera),stateBeforeMotion);
 record('R06_MOTION_CONTROL_NO_BEHAVIOR',{implementation:'onchange only clears gesture and schedules a redraw; modes unused by interaction'});
 fs.writeFileSync(path.join(__dirname,'REPRODUCTIONS.json'),JSON.stringify({artifact_sha256:'21a6663524368ad2322f06e405d6af1417e42b21925d4a2123c9c29934ae668c',method:'Original JS with read-only observation hook; minimal simulated DOM, native Canvas; not browser QA',evidence},null,2)+'\n');
}
run(850,560,false).catch(e=>{console.error(e);process.exit(1)});
