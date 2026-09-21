(function(root,factory){
  const api=factory(root);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.SabikB3Integration=api;
})(typeof window!=='undefined'?window:globalThis,function(root){
  'use strict';
  const STATES=['PRESENTE','ORIENTAR','TRANSICIÓN','PAUSA','CONFIRMAR'];
  const PRESENCES=['web','ia','educa'];
  const ASSET_BASE='/sabik/assets/b3/';
  const FILE_STATE={PRESENTE:'presente',ORIENTAR:'orientar','TRANSICIÓN':'transicion',PAUSA:'pausa',CONFIRMAR:'confirmar'};
  let current='PRESENTE',semantic='PRESENTE',presence='ia',stage=null,layers=[],layerIndex=0,confirmTimer=0,observer=null;

  function normalizeState(v){return STATES.includes(v)?v:'PRESENTE';}
  function normalizePresence(v){v=String(v||'').toLowerCase();return PRESENCES.includes(v)?v:'ia';}
  function asset(p,s){return ASSET_BASE+normalizePresence(p)+'_'+FILE_STATE[normalizeState(s)]+'.png';}
  function project(input){
    input=input||{};
    const op=String(input.operation||'');
    const interaction=String(input.interaction||'');
    if(op==='paused'||interaction==='pausa')return 'PAUSA';
    if(op==='awaiting_clarification'||interaction==='correccion')return 'ORIENTAR';
    // retrieving/composing/processing/error/risk/speech are deliberately NOT B3 states.
    return 'PRESENTE';
  }
  function effectiveMotion(){
    if(root&&root.SabikCognitivePreferences)return root.SabikCognitivePreferences.effectiveMotion();
    const reduced=root&&root.matchMedia&&root.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return reduced?'REDUCIDO':'NORMAL';
  }
  function legacyVisible(on){
    const h=root&&root.document&&root.document.querySelector('#sabik-hologram');
    if(h)h.dataset.b3Active=on?'false':'true';
  }
  function setLegacyFallback(){
    const h=root&&root.document&&root.document.querySelector('#sabik-hologram');
    if(h)h.dataset.b3Active='false';
  }
  function ensureStage(){
    if(!root||!root.document)return null;
    const h=root.document.querySelector('#sabik-hologram');if(!h)return null;
    if(stage)return stage;
    presence=normalizePresence(root.document.documentElement.dataset.sabikPresence||h.dataset.sabikPresence||'ia');
    h.dataset.sabikPresence=presence;
    stage=root.document.createElement('span');stage.className='sabik-b3-stage';stage.id='sabik-b3-stage';stage.setAttribute('aria-hidden','true');
    for(let i=0;i<2;i++){const img=root.document.createElement('img');img.className='sabik-b3-frame';img.alt='';img.decoding='async';img.width=64;img.height=64;img.hidden=i!==0;stage.appendChild(img);layers.push(img);}
    h.appendChild(stage);
    const first=layers[0];first.src=asset(presence,current);
    first.addEventListener('load',()=>{h.dataset.b3Active='true';},{once:true});
    first.addEventListener('error',setLegacyFallback,{once:true});
    for(const s of STATES){const im=new Image();im.decoding='async';im.src=asset(presence,s);}
    return stage;
  }
  function settle(img,spec){img.style.transform=spec.transform;img.style.opacity=String(spec.opacity);}
  function render(target){
    target=normalizeState(target);ensureStage();if(!stage)return;
    const h=root.document.querySelector('#sabik-hologram');
    const level=effectiveMotion();
    const spec=root.SabikB3Motion?root.SabikB3Motion.transition(current,target,level):{duration:0,easing:'linear',transform:'none',opacity:1};
    const from=layers[layerIndex],to=layers[1-layerIndex];
    if(target===current&&to.hidden)return;
    to.src=asset(presence,target);to.hidden=false;to.style.opacity='0';
    to.onerror=()=>{to.hidden=true;setLegacyFallback();};
    const finish=()=>{from.hidden=true;from.style.opacity='';from.style.transform='';settle(to,spec);layerIndex=1-layerIndex;current=target;h.dataset.b3State=target;h.dataset.b3Motion=level;h.dataset.b3Active='true';};
    if(spec.duration===0||!to.animate){finish();return;}
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
    if(current!=='CONFIRMAR')render(semantic);
  }
  function confirm(){
    if(!root)return;
    if(confirmTimer)root.clearTimeout(confirmTimer);
    render('CONFIRMAR');
    confirmTimer=root.setTimeout(()=>{current='CONFIRMAR';render(semantic);confirmTimer=0;},700);
  }
  function setState(s){semantic=normalizeState(s);render(semantic);}
  function setPresence(p){
    presence=normalizePresence(p);
    const h=root&&root.document&&root.document.querySelector('#sabik-hologram');
    if(h)h.dataset.sabikPresence=presence;
    if(layers.length){layers.forEach(img=>{img.hidden=true;});layerIndex=0;layers[0].hidden=false;layers[0].src=asset(presence,current);}
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
    root.document.addEventListener('sabik:b3-set-state',e=>{if(e.detail&&STATES.includes(e.detail.state))setState(e.detail.state);});
    syncFromDom();
    return stage;
  }
  if(root&&root.document){
    if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',mount,{once:true});else root.queueMicrotask(mount);
  }
  return Object.freeze({STATES,PRESENCES,asset,project,effectiveMotion,mount,setState,setPresence,confirm,getState:()=>current,getPresence:()=>presence});
});
