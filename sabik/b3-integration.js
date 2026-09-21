(function(root,factory){
  const api=factory(root);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.SabikB3Integration=api;
})(typeof window!=='undefined'?window:globalThis,function(root){
  'use strict';
  const STATES=['PRESENTE','ORIENTAR','TRANSICIÓN','PAUSA','CONFIRMAR'];
  const PRESENCES=['web','ia','educa'];
  const SPRITE='/sabik/assets/b3/sabik-b3-r0-sprite-256-lossless.webp';
  const STATE_INDEX={PRESENTE:0,ORIENTAR:1,'TRANSICIÓN':2,PAUSA:3,CONFIRMAR:4};
  const PRESENCE_INDEX={web:0,ia:1,educa:2};
  let current='PRESENTE',semantic='PRESENTE',presence='ia',stage=null,layers=[],layerIndex=0,confirmTimer=0,transitionTimer=0,observer=null,spriteReady=false;

  function normalizeState(v){return STATES.includes(v)?v:'PRESENTE';}
  function normalizePresence(v){v=String(v||'').toLowerCase();return PRESENCES.includes(v)?v:'ia';}
  function cell(p,s){
    p=normalizePresence(p);s=normalizeState(s);
    return Object.freeze({
      sprite:SPRITE,
      column:STATE_INDEX[s],
      row:PRESENCE_INDEX[p],
      x:[0,25,50,75,100][STATE_INDEX[s]],
      y:[0,50,100][PRESENCE_INDEX[p]]
    });
  }
  function project(input){
    input=input||{};
    const op=String(input.operation||'');
    const interaction=String(input.interaction||'');
    if(op==='paused'||interaction==='pausa')return 'PAUSA';
    if(op==='awaiting_clarification'||interaction==='correccion')return 'ORIENTAR';
    // Retrieval, composition, presentation, error, Safety and voice remain their own layers.
    return 'PRESENTE';
  }
  function effectiveMotion(){
    if(root&&root.SabikCognitivePreferences)return root.SabikCognitivePreferences.effectiveMotion();
    const reduced=root&&root.matchMedia&&root.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return reduced?'REDUCIDO':'NORMAL';
  }
  function setLegacyFallback(){
    const h=root&&root.document&&root.document.querySelector('#sabik-hologram');
    if(h)h.dataset.b3Active='false';
  }
  function applyCell(layer,p,s){
    const c=cell(p,s);
    layer.style.backgroundImage=`url("${c.sprite}")`;
    layer.style.backgroundSize='500% 300%';
    layer.style.backgroundPosition=`${c.x}% ${c.y}%`;
    layer.dataset.b3Presence=normalizePresence(p);
    layer.dataset.b3State=normalizeState(s);
  }
  function ensureStage(){
    if(!root||!root.document)return null;
    const h=root.document.querySelector('#sabik-hologram');if(!h)return null;
    if(stage)return stage;
    presence=normalizePresence(root.document.documentElement.dataset.sabikPresence||h.dataset.sabikPresence||'ia');
    h.dataset.sabikPresence=presence;
    stage=root.document.createElement('span');stage.className='sabik-b3-stage';stage.id='sabik-b3-stage';stage.setAttribute('aria-hidden','true');
    for(let i=0;i<2;i++){
      const layer=root.document.createElement('span');
      layer.className='sabik-b3-frame';layer.hidden=i!==0;
      stage.appendChild(layer);layers.push(layer);
    }
    applyCell(layers[0],presence,current);
    h.appendChild(stage);
    const probe=new Image();
    probe.onload=()=>{spriteReady=true;h.dataset.b3Active='true';};
    probe.onerror=()=>{spriteReady=false;setLegacyFallback();};
    probe.src=SPRITE;
    return stage;
  }
  function settle(layer,spec){layer.style.transform=spec.transform;layer.style.opacity=String(spec.opacity);}
  function render(target){
    target=normalizeState(target);ensureStage();if(!stage)return;
    const h=root.document.querySelector('#sabik-hologram');
    const level=effectiveMotion();
    const spec=root.SabikB3Motion?root.SabikB3Motion.transition(current,target,level):{duration:0,easing:'linear',transform:'none',opacity:1};
    const from=layers[layerIndex],to=layers[1-layerIndex];
    if(target===current&&to.hidden){h.dataset.b3Motion=level;return;}
    applyCell(to,presence,target);to.hidden=false;to.style.opacity='0';
    const finish=()=>{
      from.hidden=true;from.style.opacity='';from.style.transform='';
      settle(to,spec);layerIndex=1-layerIndex;current=target;
      h.dataset.b3State=target;h.dataset.b3Motion=level;
      if(spriteReady)h.dataset.b3Active='true';
    };
    if(spec.duration===0||!to.animate){finish();return;}
    for(const layer of layers)if(typeof layer.getAnimations==='function')layer.getAnimations().forEach(a=>a.cancel());
    const currentTransform=getComputedStyle(from).transform;
    const start=currentTransform&&currentTransform!=='none'?currentTransform:'translate3d(0,0,0) rotate(0deg) scale(1)';
    const a1=from.animate([{opacity:Number(getComputedStyle(from).opacity)||1},{opacity:0}],{duration:spec.duration,easing:spec.easing,fill:'forwards'});
    const a2=to.animate([{opacity:0,transform:start},{opacity:spec.opacity,transform:spec.transform}],{duration:spec.duration,easing:spec.easing,fill:'forwards'});
    a2.onfinish=()=>{a1.cancel();a2.cancel();finish();};
  }
  function syncFromDom(){
    if(!root||!root.document)return;
    const h=root.document.querySelector('#sabik-hologram'),panel=root.document.querySelector('.sabik-panel');
    semantic=project({operation:panel&&panel.dataset.operation,interaction:h&&h.dataset.interactionState});
    if(current!=='CONFIRMAR'&&current!=='TRANSICIÓN')render(semantic);
  }
  function confirm(){
    if(!root)return;
    if(confirmTimer)root.clearTimeout(confirmTimer);
    render('CONFIRMAR');
    confirmTimer=root.setTimeout(()=>{current='CONFIRMAR';render(semantic);confirmTimer=0;},700);
  }
  function transition(){
    if(!root)return;
    if(transitionTimer)root.clearTimeout(transitionTimer);
    render('TRANSICIÓN');
    const level=effectiveMotion();
    const hold=level==='SIN_MOVIMIENTO'?0:level==='REDUCIDO'?180:520;
    transitionTimer=root.setTimeout(()=>{current='TRANSICIÓN';render(semantic);transitionTimer=0;},hold);
  }
  function setState(s){semantic=normalizeState(s);render(semantic);}
  function setPresence(p){
    presence=normalizePresence(p);
    const h=root&&root.document&&root.document.querySelector('#sabik-hologram');
    if(h)h.dataset.sabikPresence=presence;
    if(layers.length){layers.forEach(layer=>{layer.hidden=true;});layerIndex=0;layers[0].hidden=false;applyCell(layers[0],presence,current);}
  }
  function bindPresentationActions(){
    const doc=root.document;
    doc.querySelector('#sabik-reset-session')?.addEventListener('click',transition,{capture:true});
    for(const id of ['sabik-low','sabik-shorter'])doc.querySelector('#'+id)?.addEventListener('click',confirm,{capture:true});
  }
  function mount(){
    if(!root||!root.document)return null;
    ensureStage();
    const h=root.document.querySelector('#sabik-hologram'),panel=root.document.querySelector('.sabik-panel');
    if(!h||!panel)return null;
    observer=new MutationObserver(syncFromDom);
    observer.observe(h,{attributes:true,attributeFilter:['data-interaction-state','data-protection-state']});
    observer.observe(panel,{attributes:true,attributeFilter:['data-operation']});
    root.document.addEventListener('sabik:preferences-changed',()=>render(current));
    root.document.addEventListener('sabik:b3-confirm',confirm);
    root.document.addEventListener('sabik:b3-transition',transition);
    root.document.addEventListener('sabik:b3-set-state',e=>{if(e.detail&&STATES.includes(e.detail.state))setState(e.detail.state);});
    bindPresentationActions();
    syncFromDom();
    return stage;
  }
  if(root&&root.document){
    if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',mount,{once:true});else root.queueMicrotask(mount);
  }
  return Object.freeze({STATES,PRESENCES,SPRITE,cell,project,effectiveMotion,mount,setState,setPresence,confirm,transition,getState:()=>current,getPresence:()=>presence});
});
