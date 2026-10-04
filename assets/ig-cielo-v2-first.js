/* Iris Green · Cielo V2 · primer viewport.
   WORLD_SCENE_FIRST · HYG/IAU/JPL locales · sin red externa · sin geolocalización automática. */
(function(global){
'use strict';

const DATA_URL='/assets/data/cielo-v2-first-view.json';
const R03_INDEX_URL='/assets/data/cielo-constellations-r03-index.json';
const R=Math.PI/180;
const MOTION=new Set(['normal','reduced','none']);
const THEMES=new Set(['light','navy']);
const MONTHS={
 es:['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
 en:['January','February','March','April','May','June','July','August','September','October','November','December']
};
const TEXT={
 es:{
  scene:'Escena del cielo nocturno',look:'Mirar',left:'Mirar a la izquierda',right:'Mirar a la derecha',up:'Mirar más arriba',down:'Mirar más abajo',zoomIn:'Acercar',zoomOut:'Alejar',
  reset:'Volver a vista inicial',hints:'Pistas',context:'Lugar y fecha-hora',place:'Lugar',datetime:'Fecha y hora',motion:'Movimiento',
  normal:'Normal',reduced:'Reducido',none:'Sin movimiento',inView:'En esta vista',constellations:'Constelaciones',stars:'Estrellas',
  sources:'Datos locales: HYG · IAU · JPL',depth:'Explorar todo el cielo',depthLoading:'Cargando profundidad…',allSky:'88 constelaciones',chooseConstellation:'Elige una constelación',locateConstellation:'Localizar',belowHorizon:'Está bajo el horizonte en este momento.',allSkyReady:'Catálogo completo R03 cargado: 88 constelaciones.',
  depthReady:n=>'Profundidad cargada bajo demanda: '+n+' constelaciones. Este bloque no monta la enciclopedia completa.',
  depthFail:'No se pudo cargar la profundidad.',select:'Elige una estrella o una figura.',calculated:'Cielo calculado para',
  star:'Estrella',constellation:'Constelación',planets:'Planetas',magnitude:'Magnitud aparente',distance:'Distancia',spectral:'Tipo espectral',designation:'Designación',altitude:'Altitud',azimuth:'Azimut',direction:'Dirección',
  bestMonth:'Mes orientativo',high:'alta en esta vista',low:'baja en esta vista',figure:'Figura',planetContext:'Contexto planetario JPL local',
  settings:'Ajustes',light:'Claro',navy:'Navy',theme:'Chrome',noTargets:'No hay suficientes estrellas en esta dirección. Usa los controles para mirar alrededor.'
 },
 en:{
  scene:'Night-sky scene',look:'Look',left:'Look left',right:'Look right',up:'Look higher',down:'Look lower',zoomIn:'Zoom in',zoomOut:'Zoom out',
  reset:'Return to initial view',hints:'Hints',context:'Place and date-time',place:'Place',datetime:'Date and time',motion:'Motion',
  normal:'Normal',reduced:'Reduced',none:'No motion',inView:'In this view',constellations:'Constellations',stars:'Stars',
  sources:'Local data: HYG · IAU · JPL',depth:'Explore the whole sky',depthLoading:'Loading depth…',allSky:'88 constellations',chooseConstellation:'Choose a constellation',locateConstellation:'Locate',belowHorizon:'It is below the horizon at this time.',allSkyReady:'Full R03 catalogue loaded: 88 constellations.',
  depthReady:n=>'Depth loaded on demand: '+n+' constellations. This block does not mount the full encyclopaedia.',
  depthFail:'Depth could not be loaded.',select:'Choose a star or a pattern.',calculated:'Sky calculated for',
  star:'Star',constellation:'Constellation',planets:'Planets',magnitude:'Apparent magnitude',distance:'Distance',spectral:'Spectral type',designation:'Designation',altitude:'Altitude',azimuth:'Azimuth',direction:'Direction',
  bestMonth:'Approximate month',high:'high in this view',low:'low in this view',figure:'Figure',planetContext:'Local JPL planetary context',
  settings:'Settings',light:'Light',navy:'Navy',theme:'Chrome',noTargets:'There are not enough bright stars in this direction. Use the controls to look around.'
 }
};

/* Approximate JPL elements already used by Iris Green donor runtime, 1800–2050. */
const EL={
 mercurio:[0.38709927,0.00000037,0.20563593,0.00001906,7.00497902,-0.00594749,252.25032350,149472.67411175,77.45779628,0.16047689,48.33076593,-0.12534081],
 venus:[0.72333566,0.00000390,0.00677672,-0.00004107,3.39467605,-0.00078890,181.97909950,58517.81538729,131.60246718,0.00268329,76.67984255,-0.27769418],
 tierra:[1.00000261,0.00000562,0.01671123,-0.00004392,-0.00001531,-0.01294668,100.46457166,35999.37244981,102.93768193,0.32327364,0,0],
 marte:[1.52371034,0.00001847,0.09339410,0.00007882,1.84969142,-0.00813131,-4.55343205,19140.30268499,-23.94362959,0.44441088,49.55953891,-0.29257343],
 jupiter:[5.20288700,-0.00011607,0.04838624,-0.00013253,1.30439695,-0.00183714,34.39644051,3034.74612775,14.72847983,0.21252668,100.47390909,0.20469106],
 saturno:[9.53667594,-0.00125060,0.05386179,-0.00050991,2.48599187,0.00193609,49.95424423,1222.49362201,92.59887831,-0.41897216,113.66242448,-0.28867794]
};
const EPS=23.43928*R;
const mod=(x,m)=>((x%m)+m)%m;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function jd(date){return date.getTime()/86400000+2440587.5}
function lstHours(date,lon){return mod(18.697374558+24.06570982441908*(jd(date)-2451545)+lon/15,24)}
function eclToEq(x,y,z){return [x,y*Math.cos(EPS)-z*Math.sin(EPS),y*Math.sin(EPS)+z*Math.cos(EPS)]}
function vecToRaDec(v){const rr=Math.hypot(v[0],v[1],v[2]);return{ra:mod(Math.atan2(v[1],v[0])/R/15,24),dec:Math.asin(v[2]/rr)/R,r:rr}}
function helio(k,T){
 const e=EL[k],a=e[0]+e[1]*T,ec=e[2]+e[3]*T,I=(e[4]+e[5]*T)*R,L=e[6]+e[7]*T,vp=e[8]+e[9]*T,Om=(e[10]+e[11]*T)*R;
 const M=mod(L-vp+180,360)-180,w=(vp-Om/R)*R,Mr=M*R;let E=Mr+ec*Math.sin(Mr);
 for(let i=0;i<8;i++)E=E-(E-ec*Math.sin(E)-Mr)/(1-ec*Math.cos(E));
 const xp=a*(Math.cos(E)-ec),yp=a*Math.sqrt(1-ec*ec)*Math.sin(E);
 const cw=Math.cos(w),sw=Math.sin(w),cO=Math.cos(Om),sO=Math.sin(Om),cI=Math.cos(I),sI=Math.sin(I);
 return[(cw*cO-sw*sO*cI)*xp+(-sw*cO-cw*sO*cI)*yp,(cw*sO+sw*cO*cI)*xp+(-sw*sO+cw*cO*cI)*yp,(sw*sI)*xp+(cw*sI)*yp];
}
function bodies(date){
 const T=(jd(date)-2451545)/36525,earth=helio('tierra',T),out={};
 ['mercurio','venus','marte','jupiter','saturno'].forEach(k=>{const p=helio(k,T);out[k]=vecToRaDec(eclToEq(p[0]-earth[0],p[1]-earth[1],p[2]-earth[2]));});
 out.sol=vecToRaDec(eclToEq(-earth[0],-earth[1],-earth[2]));return out;
}
function unit(ra,dec){const a=ra*15*R,d=dec*R,c=Math.cos(d);return[c*Math.cos(a),c*Math.sin(a),Math.sin(d)]}
function matrix(date,place){
 const L=lstHours(date,place.lon)*15*R,cL=Math.cos(L),sL=Math.sin(L),p=place.lat*R,cp=Math.cos(p),sp=Math.sin(p);
 return[[-sL,cL,0],[-sp*cL,-sp*sL,cp],[cp*cL,cp*sL,sp]];
}
function toH(u,m){return[m[0][0]*u[0]+m[0][1]*u[1]+m[0][2]*u[2],m[1][0]*u[0]+m[1][1]*u[1]+m[1][2]*u[2],m[2][0]*u[0]+m[2][1]*u[1]+m[2][2]*u[2]]}
function horiz(ra,dec,date,place){const h=toH(unit(ra,dec),matrix(date,place));return{alt:Math.asin(clamp(h[2],-1,1))/R,az:mod(Math.atan2(h[0],h[1])/R,360)}}
function resolveMotion(root,requested){
 if(MOTION.has(requested))return requested;
 const local=root?.dataset?.motion;if(MOTION.has(local))return local;
 try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return 'reduced'}catch(_){}
 return'normal';
}
function localeOf(root,preferred){const v=(preferred||root?.dataset?.lang||document.documentElement.lang||'es').toLowerCase();return v.startsWith('en')?'en':'es'}
function toLocalInput(date){
 const p=n=>String(n).padStart(2,'0');
 return date.getFullYear()+'-'+p(date.getMonth()+1)+'-'+p(date.getDate())+'T'+p(date.getHours())+':'+p(date.getMinutes());
}
function defaultNightDate(now,place){
 const d=new Date(now||Date.now()),sun=bodies(d).sol,h=horiz(sun.ra,sun.dec,d,place);
 if(h.alt>-12){d.setHours(22,0,0,0);if(new Date(now||Date.now()).getHours()>=22)d.setDate(d.getDate()+1);}
 return d;
}
function starRgb(ci){
 if(ci===null||ci===undefined)ci=.6;const t=clamp((ci+.3)/2.2,0,1),stops=[[155,180,255],[202,216,255],[248,247,255],[255,244,234],[255,210,161],[255,180,110]];
 const f=t*(stops.length-1),i=Math.floor(f),g=f-i,a=stops[i],b=stops[Math.min(i+1,stops.length-1)];
 return'rgb('+Math.round(a[0]+(b[0]-a[0])*g)+','+Math.round(a[1]+(b[1]-a[1])*g)+','+Math.round(a[2]+(b[2]-a[2])*g)+')';
}
function hill(az){const a=az*R;return 1.2+.8*Math.sin(a*3+1.3)+.5*Math.sin(a*7+.4)+.25*Math.sin(a*13+2.1)}
function monthLabel(n,lang){return MONTHS[lang][clamp(Number(n)||0,0,11)]}
function compassName(az,lang){
 const es=['N','NE','E','SE','S','SO','O','NO'],en=['N','NE','E','SE','S','SW','W','NW'],a=lang==='en'?en:es;
 return a[Math.round(mod(az,360)/45)%8];
}
function locateText(alt,az,lang){
 return (lang==='en'?'alt. ':'alt. ')+Math.round(alt)+'° · '+(lang==='en'?'az. ':'az. ')+Math.round(az)+'° · '+compassName(az,lang);
}
function meanLocate(arr){
 if(!arr||!arr.length)return null;
 const alt=arr.reduce((n,x)=>n+x.alt,0)/arr.length;
 const sy=arr.reduce((n,x)=>n+Math.sin(x.az*R),0),cx=arr.reduce((n,x)=>n+Math.cos(x.az*R),0);
 return {alt:alt,az:mod(Math.atan2(sy,cx)/R,360)};
}
function safeDepthUrl(url){return url==='/es/intereses/cielo/cielo.json'}

async function fetchData(url=DATA_URL){
 const r=await fetch(url,{credentials:'same-origin',cache:'no-store'});
 if(!r.ok)throw new Error('CIELO_V2_DATA_HTTP_'+r.status);
 const data=await r.json();validateData(data);return data;
}
function validateData(data){
 if(data?.schema!=='iris-green/cielo-v2-first-view/v1')throw new Error('CIELO_V2_BAD_SCHEMA');
 if(!Array.isArray(data.stars)||data.stars.length!==240)throw new Error('CIELO_V2_CURATED_STARS');
 if(!Array.isArray(data.constellations)||data.constellations.length<12||data.constellations.length>30)throw new Error('CIELO_V2_CURATED_CONSTELLATIONS');
 if(data.target_count<12||data.target_count>24)throw new Error('CIELO_V2_TARGET_RANGE');
 if(data.max_constellation_labels>5)throw new Error('CIELO_V2_LABEL_LIMIT');
 if(!safeDepthUrl(data.depth_url))throw new Error('CIELO_V2_DEPTH_URL');
 return true;
}

class Runtime{
 constructor(root,data,options={}){
  if(!root)throw new Error('CIELO_V2_ROOT_REQUIRED');validateData(data);
  this.root=root;this.data=data;this.lang=localeOf(root,options.lang);this.t=TEXT[this.lang];
  this.motion=resolveMotion(root,options.motion);this.theme=THEMES.has(options.theme)?options.theme:'navy';
  this.places=[
   {id:'peninsula-40n',label:{es:'Península · 40° N',en:'Mainland Spain · 40° N'},lat:40,lon:-3.7},
   {id:'canarias-28n',label:{es:'Canarias · 28° N',en:'Canary Islands · 28° N'},lat:28,lon:-15.43}
  ];
  this.place=this.places[0];this.date=options.date?new Date(options.date):defaultNightDate(new Date(),this.place);
  this.camera={az:180,alt:30,fov:105};this.initial=null;this.hints=true;this.selected=null;this.depth=null;this.fullSky=false;this.r03=null;this.r03By=new Map();
  this.raf=0;this.drag=null;this.animation=null;this.resizeObserver=null;
  this.consBy=new Map(data.constellations.map(c=>[c.abbr,c]));
  this.starVec=data.stars.map(s=>({s,u:unit(s.ra,s.dec)}));
  this.build();this.chooseInitialView();this.render();
 }
 build(){
  const d=this.root.ownerDocument;this.root.replaceChildren();this.root.className='skyv2';this.root.dataset.motion=this.motion;this.root.dataset.theme=this.theme;
  const scene=d.createElement('section');scene.className='skyv2-scene';scene.setAttribute('aria-label',this.t.scene);
  const canvas=d.createElement('canvas');canvas.className='skyv2-canvas';canvas.tabIndex=0;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',this.t.scene);scene.append(canvas);this.canvas=canvas;
  const stars=d.createElement('div');stars.className='skyv2-targets';scene.append(stars);this.targets=stars;
  const labels=d.createElement('div');labels.className='skyv2-labels';scene.append(labels);this.labels=labels;

  const look=d.createElement('div');look.className='skyv2-look';look.setAttribute('role','group');look.setAttribute('aria-label',this.t.look);
  [['left','←',this.t.left],['up','↑',this.t.up],['down','↓',this.t.down],['right','→',this.t.right]].forEach(([id,glyph,label])=>{
   const b=d.createElement('button');b.type='button';b.dataset.look=id;b.textContent=glyph;b.setAttribute('aria-label',label);b.addEventListener('click',()=>this.look(id));look.append(b);
  });
  [['in','＋',this.t.zoomIn],['out','−',this.t.zoomOut]].forEach(([id,glyph,label])=>{
   const b=d.createElement('button');b.type='button';b.dataset.zoom=id;b.textContent=glyph;b.setAttribute('aria-label',label);b.addEventListener('click',()=>this.zoom(id));look.append(b);
  });
  const reset=d.createElement('button');reset.type='button';reset.dataset.action='reset';reset.textContent=this.t.reset;reset.addEventListener('click',()=>this.resetView());look.append(reset);
  const hints=d.createElement('button');hints.type='button';hints.dataset.action='hints';hints.textContent=this.t.hints;hints.setAttribute('aria-pressed','true');hints.addEventListener('click',()=>{this.hints=!this.hints;hints.setAttribute('aria-pressed',String(this.hints));this.render();});look.append(hints);
  scene.append(look);

  canvas.addEventListener('keydown',e=>{
   const map={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'};
   if(map[e.key]){e.preventDefault();this.look(map[e.key]);}
   if(e.key==='+'||e.key==='='||e.key==='Add'){e.preventDefault();this.zoom('in');}
   if(e.key==='-'||e.key==='_'||e.key==='Subtract'){e.preventDefault();this.zoom('out');}
   if(e.key==='Home'){e.preventDefault();this.resetView();}
  });
  canvas.addEventListener('wheel',e=>{e.preventDefault();this.zoom(e.deltaY<0?'in':'out');},{passive:false});
  canvas.addEventListener('pointerdown',e=>{if(this.motion==='none')return;this.drag={x:e.clientX,y:e.clientY,az:this.camera.az,alt:this.camera.alt};canvas.setPointerCapture?.(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(this.motion==='none'||!this.drag)return;this.camera.az=mod(this.drag.az-(e.clientX-this.drag.x)*.22,360);this.camera.alt=clamp(this.drag.alt+(e.clientY-this.drag.y)*.15,8,78);this.render();});
  canvas.addEventListener('pointerup',()=>this.drag=null);canvas.addEventListener('pointercancel',()=>this.drag=null);

  const side=d.createElement('aside');side.className='skyv2-side';
  const info=d.createElement('section');info.className='skyv2-info';info.setAttribute('aria-live','polite');side.append(info);this.info=info;
  const view=d.createElement('details');view.className='skyv2-viewlist';
  const vh=d.createElement('summary');vh.textContent=this.t.inView;view.append(vh);
  const cols=d.createElement('div');cols.className='skyv2-viewcols';
  const cbox=d.createElement('div'),sbox=d.createElement('div'),pbox=d.createElement('div');pbox.className='skyv2-planetlist';
  cbox.innerHTML='<h3>'+this.t.constellations+'</h3>';sbox.innerHTML='<h3>'+this.t.stars+'</h3>';pbox.innerHTML='<h3>'+this.t.planets+'</h3>';
  this.constList=d.createElement('ul');this.starList=d.createElement('ul');this.planetList=d.createElement('ul');cbox.append(this.constList);sbox.append(this.starList);pbox.append(this.planetList);cols.append(cbox,sbox,pbox);view.append(cols);side.append(view);

  const meta=d.createElement('details');meta.className='skyv2-meta';
  const metaSummary=d.createElement('summary');metaSummary.textContent=this.t.settings;meta.append(metaSummary);
  const metaPanel=d.createElement('div');metaPanel.className='skyv2-meta-panel';this.metaPanel=metaPanel;
  const context=d.createElement('details');context.className='skyv2-context';const sum=d.createElement('summary');sum.textContent=this.t.context;context.append(sum);
  const grid=d.createElement('div');grid.className='skyv2-context-grid';
  const placeLabel=d.createElement('label');placeLabel.textContent=this.t.place;
  const place=d.createElement('select');this.places.forEach(p=>{const o=d.createElement('option');o.value=p.id;o.textContent=p.label[this.lang];place.append(o);});place.addEventListener('change',()=>{this.place=this.places.find(p=>p.id===place.value)||this.places[0];this.chooseInitialView();this.render();});placeLabel.append(place);grid.append(placeLabel);
  const dtLabel=d.createElement('label');dtLabel.textContent=this.t.datetime;const dt=d.createElement('input');dt.type='datetime-local';dt.value=toLocalInput(this.date);dt.addEventListener('change',()=>{const v=new Date(dt.value);if(!Number.isNaN(v.getTime())){this.date=v;this.chooseInitialView();this.render();}});dtLabel.append(dt);grid.append(dtLabel);
  const mLabel=d.createElement('label');mLabel.textContent=this.t.motion;const m=d.createElement('select');
  [['normal',this.t.normal],['reduced',this.t.reduced],['none',this.t.none]].forEach(([v,l])=>{const o=d.createElement('option');o.value=v;o.textContent=l;o.selected=v===this.motion;m.append(o);});
  m.addEventListener('change',()=>this.setMotion(m.value));mLabel.append(m);grid.append(mLabel);context.append(grid);metaPanel.append(context);

  const themes=d.createElement('div');themes.className='skyv2-theme';themes.setAttribute('role','group');themes.setAttribute('aria-label',this.t.theme);
  [['light',this.t.light],['navy',this.t.navy]].forEach(([v,l])=>{const b=d.createElement('button');b.type='button';b.dataset.theme=v;b.textContent=l;b.setAttribute('aria-pressed',String(v===this.theme));b.addEventListener('click',()=>this.setTheme(v));themes.append(b);});metaPanel.append(themes);

  const source=d.createElement('p');source.className='skyv2-sources';source.textContent=this.t.sources;metaPanel.append(source);
  const depth=d.createElement('button');depth.type='button';depth.className='skyv2-depth';depth.textContent=this.t.depth;depth.addEventListener('click',()=>this.loadDepth());metaPanel.append(depth);this.depthButton=depth;
  const depthStatus=d.createElement('p');depthStatus.className='skyv2-depth-status';depthStatus.setAttribute('role','status');metaPanel.append(depthStatus);this.depthStatus=depthStatus;
  meta.append(metaPanel);side.append(meta);

  const shell=d.createElement('div');shell.className='skyv2-shell';shell.append(scene,side);this.root.append(shell);this.scene=scene;
  this.intro=this.root.closest('.skyv2-stage')?.querySelector('.skyv2-intro')||d.querySelector('.skyv2-intro');
  this.root.dataset.ready='true';

  if('ResizeObserver' in global){
   this.resizeObserver=new ResizeObserver(()=>this.render());
   this.resizeObserver.observe(scene);
   if(this.intro)this.resizeObserver.observe(this.intro);
  }else global.addEventListener('resize',this._resize=()=>this.render());
 }
 setTheme(theme){if(!THEMES.has(theme))return false;this.theme=theme;this.root.dataset.theme=theme;this.root.querySelectorAll('[data-theme]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.theme===theme)));return true}
 setMotion(mode){if(!MOTION.has(mode))return false;this.motion=mode;this.root.dataset.motion=mode;if(this.animation){cancelAnimationFrame(this.animation);this.animation=null;}this.render();return true}
 chooseInitialView(){
  const m=matrix(this.date,this.place),candidates=[0,45,90,135,180,225,270,315];let best={az:180,count:-1};
  for(const az of candidates){const count=this.projectedStars({az,alt:30,fov:105},m).length;if(count>best.count)best={az,count};}
  this.camera={az:best.az,alt:30,fov:best.count>=12?105:120};this.initial={...this.camera};
 }
 cameraBasis(cam,w){
  const a=cam.az*R,b=cam.alt*R,F=[Math.sin(a)*Math.cos(b),Math.cos(a)*Math.cos(b),Math.sin(b)],Rt=[Math.cos(a),-Math.sin(a),0],U=[-Math.sin(a)*Math.sin(b),-Math.cos(a)*Math.sin(b),Math.cos(b)];
  const S=(w/2)/(2*Math.tan(cam.fov*R/4));return{F,Rt,U,S};
 }
 projectH(h,cam,w,hgt){
  const {F,Rt,U,S}=this.cameraBasis(cam,w),vz=h[0]*F[0]+h[1]*F[1]+h[2]*F[2];if(vz<-.15)return null;
  const k=2/(1+Math.max(vz,-.9)),x=w/2+k*(h[0]*Rt[0]+h[1]*Rt[1]+h[2]*Rt[2])*S,y=hgt/2-k*(h[0]*U[0]+h[1]*U[1]+h[2]*U[2])*S;
  return{x,y,vz};
 }
 projectedStars(cam=this.camera,m=matrix(this.date,this.place),w=1000,hgt=650){
  const out=[];
  for(const sv of this.starVec){const hh=toH(sv.u,m);if(hh[2]<=0)continue;const q=this.projectH(hh,cam,w,hgt);if(!q||q.x<16||q.x>w-16||q.y<16||q.y>hgt-36)continue;out.push({s:sv.s,h:hh,q,alt:Math.asin(hh[2])/R,az:mod(Math.atan2(hh[0],hh[1])/R,360)});}
  out.sort((a,b)=>a.s.mag-b.s.mag);return out;
 }
 current(w,h){
  const m=matrix(this.date,this.place),all=this.projectedStars(this.camera,m,w,h);
  const displayLimit=this.fullSky?(w<500?260:420):all.length;
  const visible=all.slice(0,displayLimit);
  const targetLimit=this.fullSky?(w<500?20:32):this.data.target_count;
  const labelLimit=this.fullSky?(w<500?4:6):this.data.max_constellation_labels;
  const targets=visible.slice(0,targetLimit);
  const grouped=new Map();
  targets.forEach(x=>{if(!x.s.con||!this.consBy.has(x.s.con))return;const a=grouped.get(x.s.con)||[];a.push(x);grouped.set(x.s.con,a);});
  const cons=[...grouped.entries()].map(([abbr,arr])=>({c:this.consBy.get(abbr),arr,count:arr.length,best:Math.min(...arr.map(x=>x.s.mag))}))
    .sort((a,b)=>b.count-a.count||a.best-b.best).slice(0,labelLimit);
  return{m,visible,targets,cons};
 }
 fit(){
  const dpr=Math.min(global.devicePixelRatio||1,2),r=this.scene.getBoundingClientRect(),w=Math.max(320,Math.floor(r.width)),h=Math.max(420,Math.floor(r.height)),cw=Math.round(w*dpr),ch=Math.round(h*dpr);
  if(this.canvas.width!==cw||this.canvas.height!==ch){this.canvas.width=cw;this.canvas.height=ch;this.canvas.style.width=w+'px';this.canvas.style.height=h+'px';}
  return{ctx:this.canvas.getContext('2d'),w,h,dpr};
 }
 draw(){
  const f=this.fit(),c=f.ctx,w=f.w,h=f.h,dpr=f.dpr;if(!c)return null;c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);
  const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#040b18');g.addColorStop(.62,'#0a1b34');g.addColorStop(1,'#173552');c.fillStyle=g;c.fillRect(0,0,w,h);
  const cur=this.current(w,h),sun=bodies(this.date).sol,sunH=horiz(sun.ra,sun.dec,this.date,this.place);
  if(sunH.alt>-18){const tw=clamp((sunH.alt+18)/18,0,1);const rg=c.createRadialGradient(w*.68,h*.92,0,w*.68,h*.92,w*.75);rg.addColorStop(0,'rgba(188,105,94,'+(.2*tw)+')');rg.addColorStop(1,'rgba(188,105,94,0)');c.fillStyle=rg;c.fillRect(0,0,w,h);}
  for(const x of cur.visible){const r=clamp((4.2-x.s.mag)*.8,1,3.8),alpha=clamp(1-x.s.mag/5,.35,1);c.globalAlpha=alpha;c.fillStyle=starRgb(x.s.ci);c.beginPath();c.arc(x.q.x,x.q.y,r,0,Math.PI*2);c.fill();}c.globalAlpha=1;
  if(this.hints){c.strokeStyle='rgba(164,190,235,.42)';c.lineWidth=1.1;for(const item of cur.cons){for(const seg of item.c.lines||[]){let started=false;c.beginPath();for(const p of seg){const hh=toH(unit(p[0],p[1]),cur.m);if(hh[2]<=-.03){started=false;continue}const q=this.projectH(hh,this.camera,w,h);if(!q||q.x<-10||q.x>w+10||q.y<-10||q.y>h+10){started=false;continue}if(!started){c.moveTo(q.x,q.y);started=true}else c.lineTo(q.x,q.y);}c.stroke();}}}
  const planetNames=this.lang==='en'?{mercurio:'Mercury',venus:'Venus',marte:'Mars',jupiter:'Jupiter',saturno:'Saturn'}:{mercurio:'Mercurio',venus:'Venus',marte:'Marte',jupiter:'Júpiter',saturno:'Saturno'};
  const B=bodies(this.date);this.planets=[];for(const k of ['venus','jupiter','marte','saturno','mercurio']){const hh=toH(unit(B[k].ra,B[k].dec),cur.m);if(hh[2]<=0)continue;const q=this.projectH(hh,this.camera,w,h);if(!q||q.x<10||q.x>w-10||q.y<10||q.y>h-30)continue;c.fillStyle='#f4ddb0';c.beginPath();c.arc(q.x,q.y,3.2,0,Math.PI*2);c.fill();c.font='600 12px system-ui,sans-serif';c.fillStyle='#f6e7c7';c.fillText(planetNames[k],q.x+7,q.y-6);this.planets.push({key:k,name:planetNames[k],alt:Math.asin(hh[2])/R,az:mod(Math.atan2(hh[0],hh[1])/R,360)});}
  c.fillStyle='#06101d';c.beginPath();c.moveTo(0,h);for(let x=0;x<=w;x+=8){const az=mod(this.camera.az+(x/w-.5)*this.camera.fov,360),y=h-40-hill(az)*10;c.lineTo(x,y);}c.lineTo(w,h);c.closePath();c.fill();
  c.fillStyle='#d5c38d';c.font='700 12px system-ui,sans-serif';c.textAlign='center';[['N',0],['E',90],['S',180],['O',270]].forEach(([label,az])=>{let delta=mod(az-this.camera.az+180,360)-180;if(Math.abs(delta)>this.camera.fov*.62)return;const x=w/2+(delta/this.camera.fov)*w*.78;c.fillText(this.lang==='en'&&label==='O'?'W':label,x,h-18);});c.textAlign='left';
  return cur;
 }
 render(){
  const cur=this.draw();if(!cur)return;this.renderTargets(cur);this.renderLists(cur);this.renderInfo(cur);
  this.canvas.setAttribute('aria-label',this.t.calculated+' '+(this.place.label[this.lang]||this.place.label.es)+'. '+cur.targets.length+' '+this.t.stars.toLowerCase()+'.');
 }
 placeConstellationLabel(button,x,y,w,h){
  const pad=8,sceneRect=this.scene.getBoundingClientRect();
  const actualW=Math.max(1,sceneRect.width),actualH=Math.max(1,sceneRect.height);
  const rawX=x/w*actualW,rawY=y/h*actualH;
  button.style.left=(rawX/actualW*100)+'%';button.style.top=(rawY/actualH*100)+'%';
  this.labels.append(button);
  const box=button.getBoundingClientRect(),halfW=box.width/2,halfH=box.height/2;
  let cx=clamp(rawX,pad+halfW,actualW-pad-halfW),cy=clamp(rawY,pad+halfH,actualH-pad-halfH);
  const intro=this.intro;
  if(intro){
   const ir=intro.getBoundingClientRect();
   const left=ir.left-sceneRect.left-pad,right=ir.right-sceneRect.left+pad;
   const top=ir.top-sceneRect.top-pad,bottom=ir.bottom-sceneRect.top+pad;
   const overlapsX=cx+halfW>left&&cx-halfW<right;
   const overlapsY=cy+halfH>top&&cy-halfH<bottom;
   if(overlapsX&&overlapsY)cy=clamp(bottom+halfH,pad+halfH,actualH-pad-halfH);
  }
  button.style.left=(cx/actualW*100)+'%';button.style.top=(cy/actualH*100)+'%';
  button.dataset.safeClamped=String(Math.abs(cx-rawX)>.5||Math.abs(cy-rawY)>.5);
 }
 renderTargets(cur){
  this.targets.replaceChildren();this.labels.replaceChildren();const r=this.scene.getBoundingClientRect(),w=Math.max(320,r.width),h=Math.max(420,r.height);
  for(const x of cur.targets){const b=document.createElement('button');b.type='button';b.className='skyv2-star-target';b.style.left=(x.q.x/w*100)+'%';b.style.top=(x.q.y/h*100)+'%';b.dataset.star=(x.s.name||x.s.designation);b.setAttribute('aria-label',(x.s.name||x.s.designation||this.t.star)+' · '+this.t.magnitude+' '+x.s.mag.toFixed(2));b.addEventListener('click',ev=>{let pick=x;if(ev.detail!==0&&Number.isFinite(ev.clientX)&&Number.isFinite(ev.clientY)){const rr=this.targets.getBoundingClientRect(),px=(ev.clientX-rr.left)*(w/Math.max(1,rr.width)),py=(ev.clientY-rr.top)*(h/Math.max(1,rr.height));let best=Infinity;for(const candidate of cur.targets){const dx=candidate.q.x-px,dy=candidate.q.y-py,d2=dx*dx+dy*dy;if(d2<best){best=d2;pick=candidate;}}}this.selected={type:'star',value:pick};this.renderInfo(cur);});this.targets.append(b);}
  if(this.hints){for(const item of cur.cons){const pts=item.arr.map(x=>x.q),x=pts.reduce((a,p)=>a+p.x,0)/pts.length,y=pts.reduce((a,p)=>a+p.y,0)/pts.length;const b=document.createElement('button');b.type='button';b.className='skyv2-const-label';b.textContent=this.lang==='en'?item.c.latin:item.c.es;b.dataset.constellation=item.c.abbr;b.addEventListener('click',()=>{this.selected={type:'constellation',value:item};this.renderInfo(cur);});this.placeConstellationLabel(b,x,y,w,h);}}
 }
 renderLists(cur){
  this.constList.replaceChildren();this.starList.replaceChildren();this.planetList.replaceChildren();
  for(const item of cur.cons){const li=document.createElement('li'),b=document.createElement('button'),loc=meanLocate(item.arr);b.type='button';b.textContent=(this.lang==='en'?item.c.latin:item.c.es)+' · '+item.c.abbr+(loc?' · '+locateText(loc.alt,loc.az,this.lang):'');b.addEventListener('click',()=>{this.selected={type:'constellation',value:item};this.renderInfo(cur);});li.append(b);this.constList.append(li);}
  for(const x of cur.targets){const li=document.createElement('li'),b=document.createElement('button');b.type='button';b.textContent=(x.s.name||x.s.designation||this.t.star)+' · '+locateText(x.alt,x.az,this.lang);b.addEventListener('click',()=>{this.selected={type:'star',value:x};this.renderInfo(cur);});li.append(b);this.starList.append(li);}
  for(const p of this.planets||[]){const li=document.createElement('li');li.textContent=p.name+' · '+locateText(p.alt,p.az,this.lang);this.planetList.append(li);}
 }
 renderInfo(cur){
  this.info.replaceChildren();this.info.dataset.active=this.selected?'true':'false';const h=document.createElement('h2'),p=document.createElement('p');
  if(!this.selected){h.textContent=this.t.calculated+' '+(this.place.label[this.lang]||this.place.label.es);p.textContent=this.t.select;this.info.append(h,p);}
  else if(this.selected.type==='star'){
   const x=this.selected.value,s=x.s,c=this.consBy.get(s.con);h.textContent=s.name||s.designation||this.t.star;this.info.append(h);
   const dl=document.createElement('dl');
   const add=(k,v)=>{if(v===null||v===undefined||v==='')return;const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=k;dd.textContent=v;dl.append(dt,dd);};
   add(this.t.designation,s.designation);add(this.t.magnitude,s.mag.toFixed(2));add(this.t.distance,s.ly?Math.round(s.ly)+' ly':'—');add(this.t.spectral,s.sp||'—');add(this.t.constellation,c?(this.lang==='en'?c.latin:c.es)+' · '+c.abbr:s.con);add(this.t.altitude,Math.round(x.alt)+'°');add(this.t.azimuth,Math.round(x.az)+'°');add(this.t.direction,compassName(x.az,this.lang));this.info.append(dl);
  }else{
   const item=this.selected.value,c=item.c,loc=item.loc||meanLocate(item.arr),alt=loc?loc.alt:0;h.textContent=(this.lang==='en'?c.latin:c.es)+' · '+c.abbr;this.info.append(h);
   const meta=this.r03By.get(c.abbr);
   const descriptor=meta?(this.lang==='en'?meta.name_en+(meta.descriptor_en?' · '+meta.descriptor_en:''):meta.name_es+(meta.descriptor_es?' · '+meta.descriptor_es:'')):(this.lang==='en'?(c.en||c.latin):(c.sig_es||c.es));
   const p1=document.createElement('p');p1.textContent=this.t.figure+': '+descriptor+'. '+(alt>=35?this.t.high:this.t.low)+'.';this.info.append(p1);
   const p2=document.createElement('p');p2.textContent=this.t.bestMonth+': '+monthLabel(c.mes??c.best_month,this.lang)+'.';this.info.append(p2);
   if(loc){const p3=document.createElement('p');p3.textContent=this.t.altitude+': '+Math.round(loc.alt)+'° · '+this.t.azimuth+': '+Math.round(loc.az)+'° · '+this.t.direction+': '+compassName(loc.az,this.lang)+'.';this.info.append(p3);}
  }
  if(this.planets?.length){const q=document.createElement('p');q.className='skyv2-planet-context';q.textContent=this.t.planetContext+': '+this.planets.map(p=>p.name+' · '+locateText(p.alt,p.az,this.lang)).join(' · ');this.info.append(q);}
 }
 zoom(dir){
  const next={...this.camera},before=next.fov;
  next.fov=clamp(next.fov+(dir==='in'?-12:12),42,120);
  if(next.fov===before)return false;
  this.moveCamera(next);return true;
 }
 look(dir){
  const next={...this.camera};if(dir==='left')next.az=mod(next.az-12,360);if(dir==='right')next.az=mod(next.az+12,360);if(dir==='up')next.alt=clamp(next.alt+7,8,78);if(dir==='down')next.alt=clamp(next.alt-7,8,78);this.moveCamera(next);
 }
 moveCamera(next){
  if(this.motion!=='normal'){this.camera=next;this.selected=null;this.render();return}
  if(this.animation)cancelAnimationFrame(this.animation);const start={...this.camera},t0=performance.now(),dur=170;
  const step=now=>{const t=clamp((now-t0)/dur,0,1),e=1-Math.pow(1-t,3);let da=mod(next.az-start.az+180,360)-180;this.camera.az=mod(start.az+da*e,360);this.camera.alt=start.alt+(next.alt-start.alt)*e;this.camera.fov=start.fov+(next.fov-start.fov)*e;this.render();if(t<1)this.animation=requestAnimationFrame(step);else this.animation=null;};
  this.animation=requestAnimationFrame(step);this.selected=null;
 }
 resetView(){if(this.initial)this.moveCamera({...this.initial})}
 buildDepthNavigator(){
  if(this.depthNavigator||!this.r03)return;
  const d=this.root.ownerDocument,box=d.createElement('div');box.className='skyv2-depth-nav';
  const label=d.createElement('label');label.textContent=this.t.chooseConstellation;
  const select=d.createElement('select');select.className='skyv2-constellation-select';
  this.r03.constellations.slice().sort((a,b)=>(this.lang==='en'?a.name_en:a.name_es).localeCompare(this.lang==='en'?b.name_en:b.name_es,this.lang)).forEach(meta=>{
   const o=d.createElement('option');o.value=meta.abbr;o.textContent=(this.lang==='en'?meta.name_en:meta.name_es)+' · '+meta.abbr;select.append(o);
  });
  label.append(select);
  const locate=d.createElement('button');locate.type='button';locate.className='skyv2-locate-constellation';locate.textContent=this.t.locateConstellation;locate.addEventListener('click',()=>this.locateConstellation(select.value));
  box.append(label,locate);this.metaPanel.append(box);this.depthNavigator=box;this.depthSelect=select;
 }
 locateConstellation(abbr){
  const c=this.consBy.get(abbr);if(!c)return false;
  const loc=horiz(c.label[0],c.label[1],this.date,this.place),next={...this.camera,az:loc.az,alt:clamp(loc.alt,8,78),fov:Math.min(this.camera.fov,72)};
  this.moveCamera(next);
  this.selected={type:'constellation',value:{c:c,arr:[],loc:loc}};
  this.renderInfo(this.current(Math.max(320,this.scene.clientWidth),Math.max(420,this.scene.clientHeight)));
  const meta=this.r03By.get(abbr),name=meta?(this.lang==='en'?meta.name_en:meta.name_es):(this.lang==='en'?c.latin:c.es);
  this.depthStatus.textContent=name+' · '+locateText(loc.alt,loc.az,this.lang)+(loc.alt<=0?' · '+this.t.belowHorizon:'');
  this.canvas.focus({preventScroll:true});return true;
 }
 async loadDepth(){
  if(this.depth){this.depthStatus.textContent=this.t.allSkyReady;this.buildDepthNavigator();return}
  this.depthButton.disabled=true;this.depthStatus.textContent=this.t.depthLoading;
  try{
   const res=await Promise.all([
    fetch(this.data.depth_url,{credentials:'same-origin',cache:'no-store'}),
    fetch(R03_INDEX_URL,{credentials:'same-origin',cache:'no-store'})
   ]);
   if(!res[0].ok||!res[1].ok)throw new Error('depth');
   const d=await res[0].json(),idx=await res[1].json();
   if(!Array.isArray(d.constelaciones)||d.constelaciones.length!==88||!Array.isArray(idx.constellations)||idx.constellations.length!==88)throw new Error('88');
   const idxSet=new Set(idx.constellations.map(x=>x.abbr));
   if(d.constelaciones.some(c=>!idxSet.has(c.abbr)))throw new Error('coverage');
   this.depth=d;this.r03=idx;this.r03By=new Map(idx.constellations.map(x=>[x.abbr,x]));this.fullSky=true;
   this.consBy=new Map(d.constelaciones.map(c=>[c.abbr,c]));
   this.starVec=d.estrellas.map(s=>{const o={ra:s[0],dec:s[1],mag:s[2],ci:s[3],con:s[4]||'',designation:s[5]||'',name:s[6]||'',ly:s[7]??null,sp:s[8]||''};return{s:o,u:unit(o.ra,o.dec)};});
   this.root.dataset.depthLoaded='true';this.root.dataset.constellationsR03='88';
   this.depthStatus.textContent=this.t.allSkyReady;this.depthButton.hidden=true;this.buildDepthNavigator();this.render();
  }catch(_){this.depthStatus.textContent=this.t.depthFail;}finally{this.depthButton.disabled=false}
 }
 destroy(){if(this.animation)cancelAnimationFrame(this.animation);if(this.resizeObserver)this.resizeObserver.disconnect();if(this._resize)global.removeEventListener('resize',this._resize);this.root.replaceChildren();}
}
async function mount(root,options={}){const data=options.data||await fetchData(options.dataUrl||DATA_URL);return new Runtime(root,data,options)}
global.IGCieloV2First={mount,Runtime,fetchData,validateData,DATA_URL};
})(window);
