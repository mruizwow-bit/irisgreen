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
  let pendingState='PRESENTE';
  const assetStatus=new Map();
  const assetPromises=new Map();

  function normalizeState(value){return STATES.includes(value)?value:'PRESENTE';}
  function normalizePresence(value){
    value=String(value||'').toLowerCase();
    return PRESENCES.includes(value)?value:'ia';
  }
  function asset(p,s){
    p=normalizePresence(p);
    s=normalizeState(s);
    return ASSET_BASE+p+'_'+FILE_STATE[s]+'.webp';
  }
  function project(input){
    input=input||{};
    const op=String(input.operation||'');
    const interaction=String(input.interaction||'');
    if(op==='paused'||interaction==='pausa')return 'PAUSA';
    if(op==='awaiting_clarification'||interaction==='correccion'||interaction==='aclaracion')return 'ORIENTAR';
    // Retrieval, composition, technical errors, safety and voice remain separate layers.
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
    const normalizedPresence=normalizePresence(p);
    const normalizedState=normalizeState(s);
    frame.dataset.b3Presence=normalizedPresence;
    frame.dataset.b3State=normalizedState;
    frame.src=asset(normalizedPresence,normalizedState);
  }
  function preloadAsset(url){
    if(assetStatus.get(url)==='ready')return Promise.resolve(true);
    if(assetStatus.get(url)==='error')return Promise.resolve(false);
    if(assetPromises.has(url))return assetPromises.get(url);
    if(!root||typeof root.Image!=='function')return Promise.resolve(false);
    assetStatus.set(url,'loading');
    const promise=new Promise(resolve=>{
      const img=new root.Image();
      img.decoding='async';
      img.onload=()=>{
        assetStatus.set(url,'ready');
        assetPromises.delete(url);
        resolve(true);
      };
      img.onerror=()=>{
        assetStatus.set(url,'error');
        assetPromises.delete(url);
        resolve(false);
      };
      img.src=url;
    });
    assetPromises.set(url,promise);
    return promise;
  }
  function preloadAll(){
    for(const p of PRESENCES){
      for(const s of STATES)preloadAsset(asset(p,s));
    }
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
      const frame=root.document.createElement('img');
      frame.className='sabik-b3-frame';
      frame.alt='';
      frame.width=128;
      frame.height=128;
      frame.decoding='async';
      frame.hidden=i!==0;
      stage.appendChild(frame);
      layers.push(frame);
    }
    h.appendChild(stage);

    const firstUrl=asset(presence,current);
    preloadAsset(firstUrl).then(ok=>{
      if(!ok){setLegacyFallback();return;}
      setFrame(layers[0],presence,current);
      stage.hidden=false;
      h.dataset.b3Active='true';
      h.dataset.b3State=current;
      h.dataset.b3Motion=effectiveMotion();
      preloadAll();
      if(pendingState!==current)render(pendingState);
    });
    return stage;
  }
  function settle(frame,spec){
    frame.style.transform=spec.transform;
    frame.style.opacity=String(spec.opacity);
  }
  function render(target,options){
    target=normalizeState(target);
    pendingState=target;
    ensureStage();
    if(!stage)return;

    const url=asset(presence,target);
    if(assetStatus.get(url)!=='ready'){
      preloadAsset(url).then(ok=>{
        if(!ok){setLegacyFallback();return;}
        if(pendingState===target)render(target,{force:true});
      });
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

    if(typeof from.getAnimations==='function')from.getAnimations().forEach(a=>a.cancel());
    if(typeof to.getAnimations==='function')to.getAnimations().forEach(a=>a.cancel());

    to.hidden=false;
    to.style.opacity='0';
    to.style.transform='';
    const startRender=()=>{
      to.onload=null;
      to.onerror=null;
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
        stage.hidden=false;
      };

      if(spec.duration===0||typeof to.animate!=='function'){
        finish();
        return;
      }

      const currentTransform=getComputedStyle(from).transform;
      const start=currentTransform&&currentTransform!=='none'?
        currentTransform:'translate3d(0,0,0) rotate(0deg) scale(1)';

      const fadeOut=from.animate(
        [{opacity:Number(getComputedStyle(from).opacity)||1},{opacity:0}],
        {duration:spec.duration,easing:spec.easing,fill:'forwards'}
      );
      const fadeIn=to.animate(
        [{opacity:0,transform:start},{opacity:spec.opacity,transform:spec.transform}],
        {duration:spec.duration,easing:spec.easing,fill:'forwards'}
      );
      fadeIn.onfinish=()=>{fadeOut.cancel();fadeIn.cancel();finish();};
    };

    to.onload=startRender;
    to.onerror=()=>{to.onload=null;to.onerror=null;setLegacyFallback();};
    setFrame(to,presence,target);
    if(to.complete&&to.naturalWidth>0)root.queueMicrotask(startRender);
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
    if(target==='TRANSICIÓN'){
      semantic='TRANSICIÓN';
      render('TRANSICIÓN');
      return;
    }
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
    if(layers.length){
      for(const frame of layers)frame.hidden=true;
      layerIndex=0;
      layers[0].hidden=false;
    }
    preloadAsset(asset(presence,current)).then(ok=>{
      if(!ok){setLegacyFallback();return;}
      setFrame(layers[0],presence,current);
      if(stage)stage.hidden=false;
      if(h)h.dataset.b3Active='true';
      render(current,{force:true});
    });
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
    preloadAll();
    return stage;
  }

  if(root&&root.document){
    if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',mount,{once:true});
    else root.queueMicrotask(mount);
  }

  return Object.freeze({
    STATES,PRESENCES,ASSET_BASE,asset,project,effectiveMotion,
    mount,setState,setPresence,confirm,transitionTo,
    getState:()=>current,
    getPresence:()=>presence,
    getAssetStatus:(p,s)=>assetStatus.get(asset(p,s))||'idle'
  });
});
