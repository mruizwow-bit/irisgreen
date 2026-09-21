(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.SabikB3Motion=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const STATES=Object.freeze(['PRESENTE','ORIENTAR','TRANSICIÓN','PAUSA','CONFIRMAR']);
  const LEVELS=Object.freeze(['NORMAL','REDUCIDO','SIN_MOVIMIENTO']);
  const BASE=Object.freeze({
    NORMAL:Object.freeze({
      PRESENTE:{duration:220,easing:'cubic-bezier(.2,.65,.25,1)',x:0,y:0,rotate:0,scale:1,opacity:1},
      ORIENTAR:{duration:380,easing:'cubic-bezier(.2,.78,.24,1)',x:7,y:-3,rotate:-2.2,scale:1.008,opacity:1},
      'TRANSICIÓN':{duration:500,easing:'cubic-bezier(.25,.1,.25,1)',x:4,y:-2,rotate:-2.8,scale:.992,opacity:.98},
      PAUSA:{duration:300,easing:'cubic-bezier(.22,.61,.36,1)',x:0,y:0,rotate:0,scale:.955,opacity:.78},
      CONFIRMAR:{duration:320,easing:'cubic-bezier(.2,.7,.3,1)',x:0,y:-1,rotate:.5,scale:.985,opacity:1}
    }),
    REDUCIDO:Object.freeze({
      PRESENTE:{duration:100,easing:'linear',x:0,y:0,rotate:0,scale:1,opacity:1},
      ORIENTAR:{duration:140,easing:'ease-out',x:2,y:0,rotate:0,scale:1,opacity:1},
      'TRANSICIÓN':{duration:160,easing:'ease-out',x:0,y:0,rotate:0,scale:1,opacity:.96},
      PAUSA:{duration:140,easing:'ease-out',x:0,y:0,rotate:0,scale:.98,opacity:.82},
      CONFIRMAR:{duration:140,easing:'ease-out',x:0,y:0,rotate:0,scale:.995,opacity:1}
    }),
    SIN_MOVIMIENTO:Object.freeze(Object.fromEntries(STATES.map(s=>[s,{duration:0,easing:'linear',x:0,y:0,rotate:0,scale:1,opacity:1}])))
  });
  const DURATION=Object.freeze({
    NORMAL:{
      PRESENTE:{PRESENTE:0,ORIENTAR:380,'TRANSICIÓN':500,PAUSA:300,CONFIRMAR:320},
      ORIENTAR:{PRESENTE:260,ORIENTAR:0,'TRANSICIÓN':460,PAUSA:300,CONFIRMAR:320},
      'TRANSICIÓN':{PRESENTE:260,ORIENTAR:340,'TRANSICIÓN':0,PAUSA:300,CONFIRMAR:320},
      PAUSA:{PRESENTE:280,ORIENTAR:360,'TRANSICIÓN':460,PAUSA:0,CONFIRMAR:300},
      CONFIRMAR:{PRESENTE:240,ORIENTAR:340,'TRANSICIÓN':440,PAUSA:280,CONFIRMAR:0}
    },
    REDUCIDO:Object.fromEntries(STATES.map(from=>[from,Object.fromEntries(STATES.map(to=>[to,from===to?0:(to==='TRANSICIÓN'?160:140)]))])),
    SIN_MOVIMIENTO:Object.fromEntries(STATES.map(from=>[from,Object.fromEntries(STATES.map(to=>[to,0]))]))
  });
  function normalizeState(value){return STATES.includes(value)?value:'PRESENTE';}
  function modestDevice(env){
    if(!env)return false;
    const hc=Number(env.hardwareConcurrency||0),mem=Number(env.deviceMemory||0);
    return Boolean(env.saveData||(hc>0&&hc<=4)||(mem>0&&mem<=4));
  }
  function effectiveLevel(opts){
    opts=opts||{};
    if(opts.manual==='SIN_MOVIMIENTO')return 'SIN_MOVIMIENTO';
    if(opts.systemReduced===true||opts.globalReduced===true)return 'REDUCIDO';
    if(opts.manual==='REDUCIDO')return 'REDUCIDO';
    if(opts.modest===true)return 'REDUCIDO';
    return 'NORMAL';
  }
  function transformOf(token){
    return `translate3d(${token.x}px,${token.y}px,0) rotate(${token.rotate}deg) scale(${token.scale})`;
  }
  function transition(from,to,level){
    from=normalizeState(from);to=normalizeState(to);
    level=LEVELS.includes(level)?level:'NORMAL';
    const token=BASE[level][to];
    return Object.freeze({from,to,level,duration:DURATION[level][from][to],easing:token.easing,transform:transformOf(token),opacity:token.opacity});
  }
  function cancel(element){
    if(!element||typeof element.getAnimations!=='function')return;
    element.getAnimations().forEach(a=>a.cancel());
  }
  function animate(element,from,to,level){
    if(!element)return null;
    const spec=transition(from,to,level);
    cancel(element);
    element.dataset.b3State=spec.to;
    element.dataset.b3Motion=spec.level;
    if(spec.duration===0||typeof element.animate!=='function'){
      element.style.transform=spec.transform;element.style.opacity=String(spec.opacity);return null;
    }
    const current=typeof getComputedStyle==='function'?getComputedStyle(element):null;
    const startTransform=current&&current.transform!=='none'?current.transform:'translate3d(0,0,0) rotate(0deg) scale(1)';
    const startOpacity=current?Number(current.opacity)||1:1;
    const animation=element.animate([
      {transform:startTransform,opacity:startOpacity},
      {transform:spec.transform,opacity:spec.opacity}
    ],{duration:spec.duration,easing:spec.easing,fill:'forwards'});
    animation.onfinish=()=>{element.style.transform=spec.transform;element.style.opacity=String(spec.opacity);animation.cancel();};
    return animation;
  }
  return Object.freeze({STATES,LEVELS,BASE,DURATION,normalizeState,modestDevice,effectiveLevel,transition,animate,cancel});
});
