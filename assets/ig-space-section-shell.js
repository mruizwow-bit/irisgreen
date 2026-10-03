/* Prisma A8 · Sky and Space section shell.
   No master is requested unless its slot is explicitly assetStatus=approved. */
(function(global){
'use strict';
const THEMES=new Set(['light','dark']);
const MOTION=new Set(['normal','reduced','none']);
const COPY={
 es:{heading:'El cielo y el espacio',light:'Claro',dark:'Oscuro',visualPending:'Visual pendiente de aprobación',enter:'Entrar →',routePending:'Contenido en preparación'},
 en:{heading:'Sky and space',light:'Light',dark:'Dark',visualPending:'Visual awaiting approval',enter:'Enter →',routePending:'Content in preparation'}
};
function langOf(root,v){v=(v||root?.dataset?.lang||document.documentElement.lang||'es').toLowerCase();return v.startsWith('en')?'en':'es'}
function motionOf(root,v){if(MOTION.has(v))return v;if(MOTION.has(root?.dataset?.motion))return root.dataset.motion;try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return'reduced'}catch(_){}return'normal'}
function validate(item){
 if(!item||typeof item.id!=='string'||!item.id)throw new Error('IG_SPACE_ID');
 if(typeof item.label!=='string'||!item.label)throw new Error('IG_SPACE_LABEL');
 const assetStatus=item.assetStatus||'pending';
 const routeStatus=item.routeStatus||'active';
 if(!['approved','pending','unavailable'].includes(assetStatus))throw new Error('IG_SPACE_ASSET_STATUS');
 if(!['active','pending'].includes(routeStatus))throw new Error('IG_SPACE_ROUTE_STATUS');
 if(routeStatus==='active'&&(!item.href||item.href[0]!=='/'))throw new Error('IG_SPACE_ACTIVE_ROUTE');
 return{...item,assetStatus,routeStatus};
}
class SpaceShell{
 constructor(root,options={}){
  if(!root)throw new Error('IG_SPACE_ROOT_REQUIRED');
  this.root=root;this.lang=langOf(root,options.lang);this.t=COPY[this.lang];
  this.theme=THEMES.has(options.theme)?options.theme:'light';this.motion=motionOf(root,options.motion);
  this.items=(options.items||[]).map(validate);if(this.items.length!==5)throw new Error('IG_SPACE_REQUIRES_FIVE_ENTRIES');
  this.observer=null;this.lazy=[];
  this.build();
 }
 build(){
  const d=this.root.ownerDocument;this.root.replaceChildren();this.root.className='ig-space-shell';this.root.dataset.theme=this.theme;this.root.dataset.motion=this.motion;
  const head=d.createElement('div');head.className='ig-space-head';
  const h=d.createElement('h2');h.id=this.root.id?this.root.id+'-title':'ig-space-title';h.textContent=this.t.heading;
  const theme=d.createElement('div');theme.className='ig-space-theme';theme.setAttribute('role','group');theme.setAttribute('aria-label',this.lang==='es'?'Tema':'Theme');
  [['light',this.t.light],['dark',this.t.dark]].forEach(([v,label])=>{const b=d.createElement('button');b.type='button';b.dataset.theme=v;b.textContent=label;b.setAttribute('aria-pressed',String(v===this.theme));b.addEventListener('click',()=>this.setTheme(v));theme.append(b)});
  head.append(h,theme);
  const list=d.createElement('ul');list.className='ig-space-grid';
  this.items.forEach(item=>{const li=d.createElement('li');li.append(this.card(item));list.append(li)});
  this.root.append(head,list);this.root.setAttribute('aria-labelledby',h.id);this.root.dataset.ready='true';this.installLazy();
 }
 card(item){
  const d=this.root.ownerDocument,article=d.createElement('article');article.className='ig-space-card';article.dataset.entry=item.id;article.dataset.assetStatus=item.assetStatus;article.dataset.routeStatus=item.routeStatus;
  const surface=item.routeStatus==='active'?d.createElement('a'):d.createElement('div');surface.className='ig-space-card-link';
  if(item.routeStatus==='active')surface.href=item.href;else{surface.setAttribute('aria-disabled','true');surface.tabIndex=-1}
  const visual=d.createElement('div');visual.className='ig-space-visual';
  const slot=d.createElement('span');slot.className='ig-space-slot';slot.textContent=this.t.visualPending;visual.append(slot);
  if(item.assetStatus==='approved'&&item.src){
   const img=d.createElement('img');img.alt=item.alt||'';img.width=item.width||1600;img.height=item.height||900;img.loading='lazy';img.decoding='async';img.dataset.src=item.src;img.dataset.assetApproved='true';visual.append(img);this.lazy.push(img);
  }
  const copy=d.createElement('span');copy.className='ig-space-copy';
  if(item.kicker){const k=d.createElement('span');k.className='ig-space-kicker';k.textContent=item.kicker;copy.append(k)}
  const title=d.createElement('strong');title.className='ig-space-title';title.textContent=item.label;copy.append(title);
  if(item.description){const p=d.createElement('span');p.className='ig-space-description';p.textContent=item.description;copy.append(p)}
  const status=d.createElement('span');status.className=item.routeStatus==='active'?'ig-space-go':'ig-space-status';status.textContent=item.routeStatus==='active'?this.t.enter:this.t.routePending;copy.append(status);
  surface.append(visual,copy);article.append(surface);return article;
 }
 installLazy(){
  const load=img=>{if(img.dataset.src&&!img.src){img.src=img.dataset.src;img.dataset.loaded='requested'}};
  if(!('IntersectionObserver' in global)){this.lazy.forEach(load);return}
  this.observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){load(e.target);this.observer.unobserve(e.target)}}),{rootMargin:'360px 0px'});
  this.lazy.forEach(img=>this.observer.observe(img));
 }
 setTheme(theme){if(!THEMES.has(theme))return false;this.theme=theme;this.root.dataset.theme=theme;this.root.querySelectorAll('.ig-space-theme [data-theme]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.theme===theme)));return true}
 destroy(){if(this.observer)this.observer.disconnect();this.root.replaceChildren()}
}
function mount(root,options={}){return new SpaceShell(root,options)}
global.IGSpaceSectionShell={mount,SpaceShell,validate};
})(window);
