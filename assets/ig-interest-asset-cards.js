/* Prisma A8 · Interest asset cards.
   Loads image bytes only when the asset is explicitly status=approved and approaches the viewport. */
(function(global){
'use strict';
const THEMES=new Set(['light','dark']);
const MOTION=new Set(['normal','reduced','none']);
const TEXT={
 es:{light:'Claro',dark:'Oscuro',pending:'Visual pendiente de aprobación',unavailable:'Visual no disponible'},
 en:{light:'Light',dark:'Dark',pending:'Visual awaiting approval',unavailable:'Visual unavailable'}
};
function langOf(root,preferred){const x=(preferred||root?.dataset?.lang||document.documentElement.lang||'es').toLowerCase();return x.startsWith('en')?'en':'es'}
function motionOf(root,preferred){
 if(MOTION.has(preferred))return preferred;
 if(MOTION.has(root?.dataset?.motion))return root.dataset.motion;
 try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return'reduced'}catch(_){}
 return'normal';
}
function safeItem(item){
 if(!item||typeof item.id!=='string'||!item.id)throw new Error('IGAC_ITEM_ID');
 if(typeof item.label!=='string'||!item.label)throw new Error('IGAC_ITEM_LABEL');
 const status=item.assetStatus||'pending';
 if(!['approved','pending','unavailable'].includes(status))throw new Error('IGAC_ASSET_STATUS');
 return{...item,assetStatus:status};
}
class Cards{
 constructor(root,options={}){
  if(!root)throw new Error('IGAC_ROOT_REQUIRED');
  this.root=root;this.lang=langOf(root,options.lang);this.t=TEXT[this.lang];
  this.theme=THEMES.has(options.theme)?options.theme:'light';
  this.motion=motionOf(root,options.motion);
  this.items=(options.items||[]).map(safeItem);
  this.onActivate=typeof options.onActivate==='function'?options.onActivate:()=>{};
  this.observer=null;this.images=[];this.current=null;
  this.build();
 }
 build(){
  const d=this.root.ownerDocument;
  this.root.replaceChildren();this.root.className='ig-asset-cards';this.root.dataset.theme=this.theme;this.root.dataset.motion=this.motion;this.root.dataset.ready='true';
  const toolbar=d.createElement('div');toolbar.className='igac-toolbar';toolbar.setAttribute('role','group');toolbar.setAttribute('aria-label',this.lang==='es'?'Tema':'Theme');
  [['light',this.t.light],['dark',this.t.dark]].forEach(([v,label])=>{
   const b=d.createElement('button');b.type='button';b.dataset.theme=v;b.textContent=label;b.setAttribute('aria-pressed',String(v===this.theme));b.addEventListener('click',()=>this.setTheme(v));toolbar.append(b);
  });
  const grid=d.createElement('div');grid.className='igac-grid';
  this.items.forEach(item=>grid.append(this.card(item)));
  this.root.append(toolbar,grid);
  this.installLazy();
 }
 card(item){
  const d=this.root.ownerDocument,article=d.createElement('article');article.className='igac-card';article.dataset.item=item.id;article.dataset.assetStatus=item.assetStatus;
  const button=d.createElement('button');button.type='button';button.className='igac-card-action';button.dataset.activate=item.id;
  const media=d.createElement('div');media.className='igac-media';
  if(item.assetStatus==='approved'&&item.src){
   const img=d.createElement('img');img.alt=item.alt||'';img.width=item.width||1536;img.height=item.height||1536;img.loading='lazy';img.decoding='async';img.dataset.src=item.src;img.dataset.assetApproved='true';media.append(img);this.images.push(img);
  }else{
   const p=d.createElement('div');p.className='igac-placeholder';p.setAttribute('aria-hidden','true');p.textContent=item.assetStatus==='unavailable'?this.t.unavailable:this.t.pending;media.append(p);
  }
  const body=d.createElement('div');body.className='igac-body';
  if(item.kicker){const k=d.createElement('span');k.className='igac-kicker';k.textContent=item.kicker;body.append(k)}
  const h=d.createElement('h3');h.className='igac-title';h.textContent=item.label;body.append(h);
  if(item.description){const p=d.createElement('p');p.className='igac-description';p.textContent=item.description;body.append(p)}
  if(item.disclosure){const p=d.createElement('p');p.className='igac-disclosure';p.textContent=item.disclosure;body.append(p)}
  button.append(media,body);
  button.addEventListener('click',()=>{this.current=item.id;this.root.querySelectorAll('.igac-card').forEach(x=>x.dataset.current=String(x.dataset.item===item.id));this.onActivate(item.id,item,article)});
  article.append(button);return article;
 }
 installLazy(){
  const load=img=>{if(img.dataset.src&&!img.getAttribute('src')){img.src=img.dataset.src;img.dataset.loaded='requested'}};
  if(!('IntersectionObserver' in global)){this.images.forEach(load);return}
  this.observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){load(e.target);this.observer.unobserve(e.target)}}),{rootMargin:'320px 0px'});
  this.images.forEach(img=>this.observer.observe(img));
 }
 setTheme(theme){
  if(!THEMES.has(theme))return false;this.theme=theme;this.root.dataset.theme=theme;
  this.root.querySelectorAll('.igac-toolbar [data-theme]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.theme===theme)));return true;
 }
 destroy(){if(this.observer)this.observer.disconnect();this.root.replaceChildren()}
}
function mount(root,options={}){return new Cards(root,options)}
global.IGInterestAssetCards={mount,Cards,safeItem};
})(window);
