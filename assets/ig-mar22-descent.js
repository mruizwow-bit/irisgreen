/* Iris Green · Interés 22 · runtime mínimo de descenso.
   No contiene ni genera criaturas. Solo compone ambiente + assets first-party individuales. */
(function(global){
'use strict';

const CONTRACT_URL='/assets/data/mar22-descent-contract.json';
const MOTION=new Set(['normal','reduced','none']);
const LIGHT=new Set(['light','dark']);
const UI={
 es:{depth:'Profundidad',light:'Iluminado',dark:'Oscuro',missingSize:'Tamaño real pendiente',unavailable:'Imagen no disponible todavía',motion:'Movimiento'},
 en:{depth:'Depth',light:'Lit',dark:'Dark',missingSize:'Real size pending',unavailable:'Image not available yet',motion:'Motion'}
};

function localeOf(root,preferred){
 const v=(preferred||root?.dataset?.lang||document.documentElement.lang||'es').toLowerCase();
 return v.startsWith('en')?'en':'es';
}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function hash(str){let h=2166136261;for(const ch of String(str||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed){let x=seed||1;return()=>((x=Math.imul(1664525,x)+1013904223>>>0)/4294967296);}
function resolveMotion(root,requested){
 if(MOTION.has(requested))return requested;
 const local=root?.dataset?.motion;
 if(MOTION.has(local))return local;
 try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return 'reduced';}catch(_){}
 return 'normal';
}
function fit(canvas){
 const dpr=Math.min(global.devicePixelRatio||1,2),r=canvas.getBoundingClientRect();
 const w=Math.max(1,Math.floor(r.width*dpr)),h=Math.max(1,Math.floor(r.height*dpr));
 if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
 return{ctx:canvas.getContext('2d'),w,h,dpr};
}
function zonePalette(id){
 return {
  epipelagic:['#174f72','#0d7891','#56b3c0'],
  mesopelagic:['#0d3456','#082844','#174d66'],
  bathypelagic:['#08223c','#06182d','#12384d'],
  abyssopelagic:['#06172b','#04101f','#0d293b'],
  hadal:['#04101d','#020a13','#081d2a']
 }[id]||['#08223c','#04101f','#12384d'];
}
function drawEnvironment(canvas,state,time){
 const f=fit(canvas),c=f.ctx,w=f.w,h=f.h;if(!c)return;
 const p=zonePalette(state.zone.id),g=c.createLinearGradient(0,0,0,h);
 g.addColorStop(0,p[0]);g.addColorStop(.58,p[1]);g.addColorStop(1,p[2]);
 c.clearRect(0,0,w,h);c.fillStyle=g;c.fillRect(0,0,w,h);
 const rand=rng(hash(state.zone.id));
 const snowCount=state.zone.id==='epipelagic'?14:state.zone.id==='mesopelagic'?30:42;
 c.save();c.fillStyle='rgba(226,240,244,.34)';
 for(let i=0;i<snowCount;i++){
  const x=rand()*w,base=rand()*h;
  const drift=state.motion==='normal'?((time*.006*(.35+rand()))%h):0;
  const y=(base+drift)%h,r=(.7+rand()*1.5)*f.dpr;
  c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();
 }
 c.restore();
 if(state.flashlight){
  c.save();
  const beam=c.createRadialGradient(w*.5,h*.58,0,w*.5,h*.58,Math.max(w,h)*.62);
  beam.addColorStop(0,'rgba(207,236,241,.20)');
  beam.addColorStop(.45,'rgba(158,213,224,.10)');
  beam.addColorStop(1,'rgba(158,213,224,0)');
  c.fillStyle=beam;c.beginPath();c.moveTo(w*.5,h*.58);c.lineTo(w*.16,h);c.lineTo(w*.84,h);c.closePath();c.fill();c.restore();
 }
}
function imagePathSafe(path){return /^\/img\/intereses\/temas\/22-vida-marina\/[a-z0-9-]+-(?:luz|oscuro)\.png$/.test(path||'');}
function assetLabel(mode,lang){return mode==='dark'?(lang==='en'?'dark':'oscuro'):(lang==='en'?'lit':'luz');}

async function fetchContract(url=CONTRACT_URL){
 const r=await fetch(url,{credentials:'same-origin',cache:'no-store'});
 if(!r.ok)throw new Error('MAR22_CONTRACT_HTTP_'+r.status);
 const data=await r.json();validateContract(data);return data;
}
function validateContract(data){
 if(data?.schema!=='iris-green/mar22-descent-contract/v1')throw new Error('MAR22_BAD_SCHEMA');
 if(!Array.isArray(data.zones)||data.zones.length!==5)throw new Error('MAR22_NEEDS_5_ZONES');
 if(!Array.isArray(data.species)||data.species.length!==3)throw new Error('MAR22_NEEDS_3_MESO_SPECIES');
 const paths=[];
 for(const s of data.species){
  if(s.zone!=='mesopelagic')throw new Error('MAR22_MESO_ZONE_REQUIRED');
  for(const k of ['light','dark']){
   const p=s.assets?.[k];
   if(!imagePathSafe(p))throw new Error('MAR22_NONCANONICAL_ASSET_'+String(p));
   paths.push(p);
  }
 }
 if(new Set(paths).size!==6)throw new Error('MAR22_ASSET_PATHS_NOT_UNIQUE');
 return true;
}

class Runtime{
 constructor(root,contract,options={}){
  if(!root)throw new Error('MAR22_ROOT_REQUIRED');
  validateContract(contract);
  this.root=root;this.contract=contract;
  this.lang=localeOf(root,options.lang);
  this.motion=resolveMotion(root,options.motion);
  this.state={zone:contract.zones[0],speciesId:null,assetMode:'light',flashlight:false,motion:this.motion};
  this.speciesMeta=new Map();this.geometry=new Map();this.ticket=0;this.raf=0;this.resizeObserver=null;
  for(const s of contract.species){
   if(Number.isFinite(s.real_length_cm)&&s.real_length_cm>0)this.speciesMeta.set(s.id,{lengthCm:s.real_length_cm});
  }
  if(options.speciesMeta)this.setSpeciesMetadata(options.speciesMeta);
  this.build();this.renderState();this.startCanvas();
 }
 build(){
  const doc=this.root.ownerDocument;
  this.root.classList.add('mar22-runtime');
  this.root.dataset.mar22Ready='true';
  this.root.dataset.motion=this.motion;
  this.root.replaceChildren();

  const stage=doc.createElement('section');
  stage.className='mar22-stage';
  stage.setAttribute('aria-label',this.lang==='en'?'Marine depth exploration':'Exploración de profundidad marina');

  const canvas=doc.createElement('canvas');
  canvas.className='mar22-water';canvas.setAttribute('aria-hidden','true');
  stage.append(canvas);this.canvas=canvas;

  const visual=doc.createElement('div');
  visual.className='mar22-creature-slot';visual.setAttribute('aria-live','off');
  stage.append(visual);this.visual=visual;

  const fallback=doc.createElement('div');
  fallback.className='mar22-creature-fallback';fallback.hidden=true;
  stage.append(fallback);this.fallback=fallback;

  const status=doc.createElement('p');
  status.className='mar22-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  stage.append(status);this.status=status;

  const zoneNav=doc.createElement('div');
  zoneNav.className='mar22-zone-nav';zoneNav.setAttribute('role','group');zoneNav.setAttribute('aria-label',UI[this.lang].depth);
  for(const z of this.contract.zones){
   const b=doc.createElement('button');b.type='button';b.dataset.zone=z.id;b.textContent=z.label[this.lang]||z.label.es;
   b.addEventListener('click',()=>this.setZone(z.id));zoneNav.append(b);
  }
  stage.append(zoneNav);this.zoneNav=zoneNav;

  const controls=doc.createElement('div');controls.className='mar22-controls';
  for(const [mode,label] of [['light',UI[this.lang].light],['dark',UI[this.lang].dark]]){
   const b=doc.createElement('button');b.type='button';b.dataset.action=mode;b.textContent=label;
   b.addEventListener('click',()=>this.setAssetMode(mode));controls.append(b);
  }
  const beam=doc.createElement('button');
  beam.type='button';beam.dataset.action='flashlight';beam.textContent=this.lang==='en'?'Flashlight':'Linterna';beam.setAttribute('aria-pressed','false');
  beam.addEventListener('click',()=>this.setFlashlight(!this.state.flashlight));controls.append(beam);
  stage.append(controls);this.controls=controls;

  const species=doc.createElement('div');
  species.className='mar22-species';species.setAttribute('role','group');species.setAttribute('aria-label',this.lang==='en'?'Mesopelagic species':'Especies mesopelágicas');
  for(const s of this.contract.species){
   const b=doc.createElement('button');b.type='button';b.dataset.species=s.id;b.textContent=s.label[this.lang]||s.label.es;
   b.addEventListener('click',()=>this.selectSpecies(s.id));species.append(b);
  }
  stage.append(species);this.speciesButtons=species;

  this.root.append(stage);this.stage=stage;
 }
 setSpeciesMetadata(meta){
  for(const [id,v] of Object.entries(meta||{})){
   const length=Number(v?.lengthCm);
   if(Number.isFinite(length)&&length>0)this.speciesMeta.set(id,{lengthCm:length});
  }
  this.applyScale();
 }
 setAssetGeometry(id,mode,geometry){
  if(!id||!LIGHT.has(mode))return false;
  const w=Number(geometry?.width),h=Number(geometry?.height),cx=Number(geometry?.centerX),cy=Number(geometry?.centerY);
  if(!(w>0&&h>0))return false;
  const next={width:w,height:h,centerX:Number.isFinite(cx)?cx:w/2,centerY:Number.isFinite(cy)?cy:h/2};
  this.geometry.set(id+'|'+mode,next);
  return this.validatePairGeometry(id);
 }
 validatePairGeometry(id){
  const a=this.geometry.get(id+'|light'),b=this.geometry.get(id+'|dark');
  if(!a||!b)return null;
  return a.width===b.width&&a.height===b.height&&a.centerX===b.centerX&&a.centerY===b.centerY;
 }
 setZone(id){
  const z=this.contract.zones.find(x=>x.id===id);if(!z)return false;
  this.state.zone=z;
  if(id!=='mesopelagic')this.clearSpecies();
  this.renderState();return true;
 }
 setAssetMode(mode){
  mode=mode==='dark'?'dark':'light';
  if(!LIGHT.has(mode))return false;
  this.state.assetMode=mode;this.renderState();
  if(this.state.speciesId)this.loadSelected();
  return true;
 }
 setMotionMode(mode){
  if(!MOTION.has(mode))return false;
  this.motion=mode;this.state.motion=mode;this.root.dataset.motion=mode;
  this.stopCanvas();this.startCanvas();this.renderState();return true;
 }
 setFlashlight(on){
  this.state.flashlight=!!on;
  const b=this.controls.querySelector('[data-action="flashlight"]');
  if(b)b.setAttribute('aria-pressed',String(this.state.flashlight));
  this.draw(0);return true;
 }
 selectSpecies(id){
  const s=this.contract.species.find(x=>x.id===id);if(!s)return false;
  if(this.state.zone.id!==s.zone)this.state.zone=this.contract.zones.find(z=>z.id===s.zone)||this.state.zone;
  this.state.speciesId=id;this.renderState();this.loadSelected();return true;
 }
 clearSpecies(){
  this.ticket++;this.state.speciesId=null;this.visual.replaceChildren();this.fallback.hidden=true;this.renderState();
 }
 selected(){return this.contract.species.find(x=>x.id===this.state.speciesId)||null;}
 applyScale(){
  const s=this.selected();if(!s)return;
  const meta=this.speciesMeta.get(s.id);
  const lengths=[...this.speciesMeta.values()].map(v=>v.lengthCm).filter(Number.isFinite);
  if(!meta||!lengths.length){this.visual.style.removeProperty('--mar22-real-ratio');return;}
  const ratio=clamp(meta.lengthCm/Math.max(...lengths),.18,1);
  this.visual.style.setProperty('--mar22-real-ratio',String(ratio));
 }
 renderState(){
  for(const b of this.zoneNav.querySelectorAll('[data-zone]'))b.setAttribute('aria-pressed',String(b.dataset.zone===this.state.zone.id));
  for(const b of this.speciesButtons.querySelectorAll('[data-species]'))b.setAttribute('aria-pressed',String(b.dataset.species===this.state.speciesId));
  for(const b of this.controls.querySelectorAll('[data-action="light"],[data-action="dark"]'))b.setAttribute('aria-pressed',String(b.dataset.action===this.state.assetMode));
  this.root.dataset.zone=this.state.zone.id;this.root.dataset.assetMode=this.state.assetMode;this.root.dataset.motion=this.state.motion;
  const s=this.selected(),z=this.state.zone.label[this.lang]||this.state.zone.label.es;
  let text=z+' · '+this.state.zone.min_m+'–'+this.state.zone.max_m+' m';
  if(s){
   const meta=this.speciesMeta.get(s.id);
   text+=' · '+(s.label[this.lang]||s.label.es)+' · '+assetLabel(this.state.assetMode,this.lang);
   text+=' · '+(meta?meta.lengthCm+' cm':UI[this.lang].missingSize);
  }
  text+=' · '+UI[this.lang].motion+': '+this.state.motion;
  this.status.textContent=text;this.applyScale();this.draw(0);
 }
 async loadSelected(){
  const s=this.selected();if(!s)return false;
  const mode=this.state.assetMode==='dark'?'dark':'light',src=s.assets[mode];
  if(!imagePathSafe(src))throw new Error('MAR22_BAD_ASSET_ROUTE');
  const ticket=++this.ticket;
  this.visual.replaceChildren();this.fallback.hidden=true;this.root.dataset.assetStatus='loading';
  const img=new Image();img.alt='';img.decoding='async';img.loading='eager';
  try{
   await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error('MAR22_ASSET_MISSING'));img.src=src;});
   if(ticket!==this.ticket)return false;
   this.setAssetGeometry(s.id,mode,{width:img.naturalWidth,height:img.naturalHeight,centerX:img.naturalWidth/2,centerY:img.naturalHeight/2});
   if(this.validatePairGeometry(s.id)===false)throw new Error('MAR22_LIGHT_DARK_GEOMETRY_MISMATCH');
   img.className='mar22-creature';img.dataset.species=s.id;img.dataset.assetMode=mode;
   this.visual.replaceChildren(img);this.root.dataset.assetStatus='ready';this.fallback.hidden=true;return true;
  }catch(err){
   if(ticket!==this.ticket)return false;
   this.visual.replaceChildren();this.root.dataset.assetStatus='missing';
   this.fallback.hidden=false;this.fallback.textContent=(s.label[this.lang]||s.label.es)+' · '+UI[this.lang].unavailable;
   return false;
  }
 }
 draw(time){drawEnvironment(this.canvas,this.state,time);}
 startCanvas(){
  const loop=(t)=>{this.draw(t);if(this.motion==='normal')this.raf=requestAnimationFrame(loop);};
  this.draw(0);
  if(this.motion==='normal')this.raf=requestAnimationFrame(loop);
  if('ResizeObserver' in global){
   this.resizeObserver=new ResizeObserver(()=>this.draw(0));this.resizeObserver.observe(this.stage);
  }else{
   global.addEventListener('resize',this._resize=()=>this.draw(0));
  }
 }
 stopCanvas(){
  if(this.raf)cancelAnimationFrame(this.raf);this.raf=0;
  if(this.resizeObserver){this.resizeObserver.disconnect();this.resizeObserver=null;}
  if(this._resize){global.removeEventListener('resize',this._resize);this._resize=null;}
 }
 destroy(){this.ticket++;this.stopCanvas();this.root.replaceChildren();delete this.root.dataset.mar22Ready;}
}

async function mount(root,options={}){
 const contract=options.contract||await fetchContract(options.contractUrl||CONTRACT_URL);
 return new Runtime(root,contract,options);
}

global.IGMar22Descent={mount,Runtime,validateContract,fetchContract,CONTRACT_URL};
})(window);
