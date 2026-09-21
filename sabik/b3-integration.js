(function(root,factory){
  const api=factory(root);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.SabikB3Integration=api;
})(typeof window!=='undefined'?window:globalThis,function(root){
  'use strict';

  const STATES=Object.freeze(['PRESENTE','ORIENTAR','TRANSICIÓN','PAUSA','CONFIRMAR']);
  const PRESENCES=Object.freeze(['web','ia','educa']);
  const SPRITE='/sabik/assets/b3/sabik-b3-r0-sprite-256-lossless.webp';
  const ROW=Object.freeze({web:0,ia:1,educa:2});
  const COL=Object.freeze({PRESENTE:0,ORIENTAR:1,'TRANSICIÓN':2,PAUSA:3,CONFIRMAR:4});

  let current='PRESENTE';
  let semantic='PRESENTE';
  let presence='ia';
  let stage=null;
  let layers=[];
  let layerIndex=0;
  let confirmTimer=0;
  let transitionTimer=0;
  let observer=null;
  let spriteStatus='idle';
  let pendingState='PRESENTE';

  function normalizeState(value){return STATES.includes(value)?value:'PRESENTE';}
  function normalizePresence(value){
    value=String(value||'').toLowerCase();
    return PRESENCES.includes(value)?value:'ia';
  }
  function spriteCell(p,s){
    p=normalizePresence(p);s=normalizeState(s);
    return Object.freeze({
      presence:p,state:s,row:ROW[p],column:COL[s],
      xPercent:COL[s]*25,yPercent:ROW[p]*50,
      backgroundPosition:(COL[s]*25)+'% '+(ROW[p]*50)+'%'
    });
  }
  function project(input){
    input=input||{};
    const op=String(input.operation||'');
    const interaction=String(input.interaction||'');
    if(op==='paused'||interaction==='pausa')return 'PAUSA';
    if(op==='awaiting_clarification'||interaction==='correccion'||interaction==='aclaracion')return 'ORIENTAR';
    // retrieving/composing/processing/error/risk/speech stay in their own layers.
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
  function setCell(frame,p,s){
    const cell=spriteCell(p,s);
    frame.style.backgroundImage='url("'+SPRITE+'")';
    frame.style.backgroundPosition=cell.backgroundPosition;
    frame.dataset.b3Presence=cell.presence;
    frame.dataset.b3State=cell.state;
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
      const frame=root.document.createElement('span');
      frame.className='sabik-b3-frame';
      frame.hidden=i!==0;
      setCell(frame,presence,current);
      stage.appendChild(frame);
      layers.push(frame);
    }
    h.appendChild(stage);
    return stage;
  }
  function loadSprite(){
    if(spriteStatus==='ready')return Promise.resolve(true);
    if(spriteStatus==='loading'&&loadSprite.promise)return loadSprite.promise;
    if(!root||typeof root.Image!=='function')return Promise.resolve(false);
    spriteStatus='loading';
    loadSprite.promise=new Promise(resolve=>{
      const img=new root.Image();
      img.decoding='async';
      img.onload=()=>{
        spriteStatus='ready';
        const h=root.document&&root.document.querySelector('#sabik-hologram');
        if(stage)stage.hidden=false;
        if(h)h.dataset.b3Active='true';
        render(pendingState,{force:true});
        resolve(true);
      };
      img.onerror=()=>{
        spriteStatus='error';
        setLegacyFallback();
        resolve(false);
      };
      img.src=SPRITE;
    });
    return loadSprite.promise;
  }
  function settle(frame,spec){
    frame.style.transform=spec.transform;
    frame.style.opacity=String(spec.opacity);
  }
  function render(target,options){
    target=normalizeState(target);
    pendingState=target;
    ensureStage();
    if(!stage||spriteStatus!=='ready'){
      loadSprite();
      return;
    }
    const h=root.document.querySelector('#sabik-hologram');
    const level=effectiveMotion();
    const spec=root.SabikB3Motion?
      root.SabikB3Motion.transition(current,target,level):
      {duration:0,easing:'linear',transform:'none',opacity:1};

    const from=layers[layerIndex];
    const to=layers[1-layerIndex];

    if(target===current&&!options?.force){
      h.dataset.b3State=target;
      h.dataset.b3Motion=level;
      return;
    }

    setCell(to,presence,target);
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

    if(typeof from.getAnimations==='function')from.getAnimations().forEach(a=>a.cancel());
    if(typeof to.getAnimations==='function')to.getAnimations().forEach(a=>a.cancel());

    const currentTransform=getComputedStyle(from).transform;
    const start=currentTransform&&currentTransform!=='none'?
      currentTransform:'translate3d(0,0,0) rotate(0deg) scale(1)';

    const a1=from.animate(
      [{opacity:Number(getComputedStyle(from).opacity)||1},{opacity:0}],
      {duration:spec.duration,easing:spec.easing,fill:'forwards'}
    );
    const a2=to.animate(
      [{opacity:0,transform:start},{opacity:spec.opacity,transform:spec.transform}],
      {duration:spec.duration,easing:spec.easing,fill:'forwards'}
    );
    a2.onfinish=()=>{a1.cancel();a2.cancel();finish();};
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
  function setState(s){
    semantic=normalizeState(s);
    render(semantic);
  }
  function setPresence(p){
    presence=normalizePresence(p);
    const h=root&&root.document&&root.document.querySelector('#sabik-hologram');
    if(h)h.dataset.sabikPresence=presence;
    if(layers.length)layers.forEach(frame=>setCell(frame,presence,frame.dataset.b3State||current));
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
    loadSprite();
    return stage;
  }

  if(root&&root.document){
    if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',mount,{once:true});
    else root.queueMicrotask(mount);
  }

  return Object.freeze({
    STATES,PRESENCES,SPRITE,spriteCell,project,effectiveMotion,
    mount,setState,setPresence,confirm,transitionTo,
    getState:()=>current,getPresence:()=>presence,getSpriteStatus:()=>spriteStatus
  });
});
