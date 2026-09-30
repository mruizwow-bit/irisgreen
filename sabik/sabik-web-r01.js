/* R69 · current Sabik masters. Sabik itself moves; no legacy orbit donor. */
(()=>{'use strict';
const motion=window.SabikMotionR37,media=window.matchMedia('(prefers-reduced-motion: reduce)'),masters=new Map(),ASSET_VERSION='r69-20260930-4';
let current={interaction:'espera',protection:'normal',lowIntensity:false},controller,bodyObserver,panelObserver;
const nodes=()=>({visual:document.querySelector('#sabik-hologram'),master:document.querySelector('#sabik-web-master'),body:document.querySelector('#sabik-widget-body'),panel:document.querySelector('.sabik-panel')});
function readyMaster(state){if(!masters.has(state)){const i=new Image();i.src='/sabik/assets/web-r01/web_'+state+'.png?v='+ASSET_VERSION;const d=i.decode().then(()=>i.src).catch(e=>{masters.delete(state);throw e});masters.set(state,d)}return masters.get(state)}
function ensurePresence(){
 const {visual,master}=nodes();if(!visual||!master)return null;
 visual.classList.remove('sabik-layered-avatar');visual.classList.add('sabik-current-presence');master.classList.add('sabik-avatar-base');
 let holder=visual.querySelector('.sabik-presence-motion');
 if(!holder){holder=document.createElement('span');holder.className='sabik-presence-motion';master.parentNode.insertBefore(holder,master);holder.appendChild(master);}
 return visual;
}
function preferences(){return{motionLevel:document.querySelector('#sabik-motion-level')?.value||'NORMAL',systemReduced:media.matches,globalOff:Boolean(window.IGPreferences?.get?.().motion),lowIntensity:current.lowIntensity}}
function setPresencePlayState(visual,paused){const holder=visual?.querySelector('.sabik-presence-motion');if(holder)holder.style.animationPlayState=paused?'paused':'running'}
function syncRenderActivity(){
 const {visual,body,panel}=nodes();if(!visual)return false;
 const inactive=document.hidden||Boolean(body?.hidden)||Boolean(panel?.hidden)||Boolean(panel?.classList.contains('is-collapsed'));
 visual.dataset.renderActive=String(!inactive);
 const level=visual.dataset.motionLevel||document.querySelector('#sabik-motion-level')?.value||'NORMAL';
 setPresencePlayState(visual,inactive||level==='SIN_MOVIMIENTO'||Boolean(window.IGPreferences?.get?.().motion));
 return!inactive;
}
function observeActivity(){
 const {body,panel}=nodes();
 if(body&&!bodyObserver){bodyObserver=new MutationObserver(syncRenderActivity);bodyObserver.observe(body,{attributes:true,attributeFilter:['hidden']})}
 if(panel&&!panelObserver){panelObserver=new MutationObserver(syncRenderActivity);panelObserver.observe(panel,{attributes:true,attributeFilter:['hidden','class']})}
}
function ensureController(){
 if(controller)return controller;
 const visual=ensurePresence(),{master}=nodes();if(!visual||!master||!motion)return null;
 controller=motion.createController({
  element:master,load:readyMaster,preferences,
  apply(src,state){master.src=src;visual.dataset.webAsset=state.toUpperCase()},
  describe(state,level,active){
   visual.dataset.webState=state.toUpperCase();visual.dataset.motionLevel=level;visual.dataset.motionActive=String(active);
   setPresencePlayState(visual,level==='SIN_MOVIMIENTO'||visual.dataset.renderActive==='false'||document.hidden||Boolean(window.IGPreferences?.get?.().motion));
   const h=document.querySelector('#sabik-motion-help'),en=document.documentElement.lang.startsWith('en');
   if(h)h.textContent=({NORMAL:en?'Sabik moves gently while present.':'Sabik se mueve suavemente mientras está presente.',REDUCIDO:en?'Reduced Sabik motion is active.':'Movimiento reducido de Sabik activado.',SIN_MOVIMIENTO:en?'Sabik motion is off.':'Movimiento de Sabik desactivado.'})[level];
  }
 });
 controller.setSabikState('presente',{force:true,static:true});syncRenderActivity();observeActivity();return controller;
}
function render(next){if(next)current=next;const c=ensureController();if(c)return c.setSabikState(motion.project(current),{reason:'functional-projection'})}
function contextChange(){
 const c=ensureController();if(!c)return;
 const to=motion.project({...current,interaction:'espera'});
 if(to==='pausa'||['error','retrieving','composing'].includes(current.operation)||current.protection==='riesgo'||(current.safety&&current.safety!=='normal'))return render();
 return c.setSabikState('transicion',{to,reason:'explicit-context-change',force:true});
}
function setVoiceActive(active){const visual=ensurePresence();if(visual)visual.dataset.voiceActive=String(Boolean(active));return Boolean(active)}
function refresh(){syncRenderActivity();return ensureController()?.refresh()}
window.SabikWebPresentation=Object.freeze({
 render,contextChange,setSabikState(state,options){return ensureController()?.setSabikState(state,options)},setVoiceActive,refresh,
 snapshot(){const v=ensurePresence();return{...(ensureController()?.snapshot()||{}),voiceActive:v?.dataset.voiceActive==='true',renderActive:v?.dataset.renderActive==='true',presenceLayer:Boolean(v?.querySelector('.sabik-presence-motion'))}}
});
window.setSabikState=(state,options)=>window.SabikWebPresentation.setSabikState(state,options);
function boot(){ensureController();for(const s of motion.STATES)readyMaster(s).catch(()=>{});document.querySelector('#sabik-motion-level')?.addEventListener('change',refresh)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
document.addEventListener('visibilitychange',syncRenderActivity);
window.addEventListener('pagehide',()=>{const {visual}=nodes();if(visual)visual.dataset.renderActive='false'});
media.addEventListener('change',refresh);
new MutationObserver(refresh).observe(document.documentElement,{attributes:true,attributeFilter:['data-ig-motion']});
})();