(function(root,factory){
  const api=factory(root);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.SabikB3Integration=api;
})(typeof window!=='undefined'?window:globalThis,function(root){
  'use strict';

  const STATES=Object.freeze(['PRESENTE','ORIENTAR','TRANSICIÓN','PAUSA','CONFIRMAR']);
  const PRESENCES=Object.freeze(['web','ia','educa']);
  const ASSET_BASE='/sabik/assets/b3/';
  const FILE_STATE=Object.freeze({
    PRESENTE:'presente',
    ORIENTAR:'orientar',
    'TRANSICIÓN':'transicion',
    PAUSA:'pausa',
    CONFIRMAR:'confirmar'
  });

  let current='PRESENTE';
  let semantic='PRESENTE';
  let presence='ia';
  let stage=null;
  let layers=[];
  let layerIndex=0;
  let confirmTimer=0;
  let transitionTimer=0;
  let observer=null;

  function normalizeState(value){return STATES.includes(value)?value:'PRESENTE';}
  function normalizePresence(value){
    value=String(value||'').toLowerCase();
    return PRESENCES.includes(value)?value:'ia';
  }
  function asset(p,s){
    p=normalizePresence(p);s=normalizeState(s);
    return ASSET_BASE+p+'_'+FILE_STATE[s]+'.webp';
  }
  function project(input){
    input=input||{};
    const op=String(input.operation||'');
    const interaction=String(input.interaction||'');
    if(op==='paused'||interaction==='pausa')return 'PAUSA';
    if(op==='awaiting_clarification'||interaction==='correccion'||interaction==='aclaracion')return 'ORIENTAR';
    // Retrieval, composing, presenting, error, safety and voice remain independent layers.
    return 'PRESENTE';
  }
  function effectiveMotion(){
    if(root&&root.SabikCognitivePreferences)return root.SabikCognitivePreferences.effectiveMotion();
    const reduced=root&&root.matchMedia&&root.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return reduced?'REDUCIDO':'NORMAL';
  }
  function setLegacyFallback(){
    if(!root||!root.document)return;
    const h=root.document.querySelector('#sabik-hologram');
    if(h)h.dataset.b3Active='false';
    if(stage)stage.hidden=true;
  }
  function setFrame(frame,p,s){
    frame.dataset.b3Presence=normalizePresence(p);
    frame.dataset.b3State=normalizeState(s);
    frame.src=asset(p,s);
  }
  function settle(frame,spec){
    frame.style.transform=spec.transform;
    frame.style.opacity=String(spec.opacity);
  }
  function activateStage(){
    if(!root||!root.document||!stage)return;
    const h=root.document.querySelector('#sabik-hologram');
    stage.hidden=false;
    if(h)h.dataset.b3Active='true';
  }
  function ensureStage(){
    if(!root||!root.document)return null;
    const h=root.document.querySelector('#sabik-hologram');
    if(!h)return null;
    if(stage)return stage;
    presence=normalizePresence(root.document.documentElement.dataset.sabikPresence||h.dataset.sabikPresence||'ia');
    h.dataset.sabikPresence=presence;
    stage=root.document.createElement('span');
    stage.className='sabik-b3-stage';
    stage.id='sabik-b3-stage';
    stage.setAttribute('aria-hidden','true');
    stage.hidden=true;

    for(let i=0;i<2;i++){
      const img=root.document.createElement('img');
      img.className='sabik-b3-frame';
      img.alt='';
      img.decoding='async';
      img.width=64;
      img.height=64;
      img.hidden=i!==0;
      stage.appendChild(img);
      layers.push(img);
    }
    h.appendChild(stage);

    setFrame(layers[1],presence,'PRESENTE');
    const first=layers[0];
    first.onload=()=>{
      const spec=root.SabikB3Motion?
        root.SabikB3Motion.transition('PRESENTE','PRESENTE',effectiveMotion()):
        {transform:'none',opacity:1};
      settle(first,spec);
      activateStage();
      h.dataset.b3State='PRESENTE';
      h.dataset.b3Motion=effectiveMotion();
    };
    first.onerror=setLegacyFallback;
    setFrame(first,presence,'PRESENTE');

    for(const s of STATES){
      if(s==='PRESENTE')continue;
      const preload=new root.Image();
      preload.decoding='async';
      preload.src=asset(presence,s);
    }
    return stage;
  }
  function render(target,options){
    target=normalizeState(target);
    ensureStage();
    if(!stage)return;
    const h=root.document.querySelector('#sabik-hologram');
    const level=effectiveMotion();
    const spec=root.SabikB3Motion?
      root.SabikB3Motion.transition(current,target,level):
      {duration:0,easing:'linear',transform:'none',opacity:1};

    if(target===current&&!options?.force){
      h.dataset.b3State=target;
      h.dataset.b3Motion=level;
      return;
    }

    const from=layers[layerIndex];
    const to=layers[1-layerIndex];
    if(typeof from.getAnimations==='function')from.getAnimations().forEach(a=>a.cancel());
    if(typeof to.getAnimations==='function')to.getAnimations().forEach(a=>a.cancel());

    let started=false;
    const start=()=>{
      if(started)return;started=true;
      activateStage();
      to.hidden=false;
      to.style.opacity='0';

      const finish=()=>{
        from.hidden=true;
        from.style.opacity='';
        from.style.transform='';
        settle(to,spec);
        layerIndex=1-layerIndex;
        current=target;
        h.dataset.b3State=target;
        h.dataset.b3Motion=level;
        h.dataset.b3Active='true';
      };

      if(spec.duration===0||typeof to.animate!=='function'){
        finish();
        return;
      }
      const currentTransform=getComputedStyle(from).transform;
      const startTransform=currentTransform&&currentTransform!=='none'?
        currentTransform:'translate3d(0,0,0) rotate(0deg) scale(1)';
      const a1=from.animate(
        [{opacity:Number(getComputedStyle(from).opacity)||1},{opacity:0}],
        {duration:spec.duration,easing:spec.easing,fill:'forwards'}
      );
      const a2=to.animate(
        [{opacity:0,transform:startTransform},{opacity:spec.opacity,transform:spec.transform}],
        {duration:spec.duration,easing:spec.easing,fill:'forwards'}
      );
      a2.onfinish=()=>{a1.cancel();a2.cancel();finish();};
    };

    to.onload=start;
    to.onerror=()=>{to.hidden=true;setLegacyFallback();};
    setFrame(to,presence,target);
    if(to.complete&&to.naturalWidth>0)root.queueMicrotask(start);
  }
  function syncFromDom(){
    if(!root||!root.document)return;
    const h=root.document.querySelector('#sabik-hologram');
    const panel=root.document.querySelector('.sabik-panel');
    semantic=project({
      operation:panel&&panel.dataset.operation,
      interaction:h&&h.dataset.interactionState
    });
    if(current!=='CONFIRMAR'&&current!=='TRANSICIÓN')render(semantic);
  }
  function confirm(){
    if(!root)return;
    if(confirmTimer)root.clearTimeout(confirmTimer);
    render('CONFIRMAR');
    confirmTimer=root.setTimeout(()=>{
      current='CONFIRMAR';
      render(semantic);
      confirmTimer=0;
    },700);
  }
  function transitionTo(target){
    if(!root)return;
    target=normalizeState(target);
    if(transitionTimer)root.clearTimeout(transitionTimer);
    if(target==='TRANSICIÓN'){semantic='TRANSICIÓN';render('TRANSICIÓN');return;}
    render('TRANSICIÓN');
    const level=effectiveMotion();
    const delay=level==='SIN_MOVIMIENTO'?0:(level==='REDUCIDO'?160:500);
    transitionTimer=root.setTimeout(()=>{
      current='TRANSICIÓN';
      semantic=target;
      render(target);
      transitionTimer=0;
    },delay);
  }
  function setState(s){semantic=normalizeState(s);render(semantic);}
  function setPresence(p){
    presence=normalizePresence(p);
    const h=root&&root.document&&root.document.querySelector('#sabik-hologram');
    if(h)h.dataset.sabikPresence=presence;
    if(layers.length){
      layers.forEach(frame=>{
        const state=normalizeState(frame.dataset.b3State||current);
        setFrame(frame,presence,state);
      });
    }
    render(current,{force:true});
  }
  function mount(){
    if(!root||!root.document)return null;
    ensureStage();
    const h=root.document.querySelector('#sabik-hologram');
    const panel=root.document.querySelector('.sabik-panel');
    if(!h||!panel)return null;

    observer=new MutationObserver(syncFromDom);
    observer.observe(h,{attributes:true,attributeFilter:['data-interaction-state','data-protection-state']});
    observer.observe(panel,{attributes:true,attributeFilter:['data-operation']});

    root.document.addEventListener('sabik:preferences-changed',()=>render(current,{force:true}));
    root.document.addEventListener('sabik:b3-confirm',confirm);
    root.document.addEventListener('sabik:b3-set-state',e=>{
      if(e.detail&&STATES.includes(e.detail.state))setState(e.detail.state);
    });
    root.document.addEventListener('sabik:b3-transition',e=>{
      if(e.detail&&STATES.includes(e.detail.to))transitionTo(e.detail.to);
    });
    syncFromDom();
    return stage;
  }

  if(root&&root.document){
    if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',mount,{once:true});
    else root.queueMicrotask(mount);
  }

  return Object.freeze({
    STATES,PRESENCES,asset,project,effectiveMotion,
    mount,setState,setPresence,confirm,transitionTo,
    getState:()=>current,getPresence:()=>presence
  });
});
