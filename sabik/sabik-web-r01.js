/* Sabik definitivo R01 · approved nucleus/orbit layers + R37 finite transitions. */
(()=>{'use strict';
const motion=window.SabikMotionR37,media=window.matchMedia('(prefers-reduced-motion: reduce)');
const BODY='/sabik/assets/web-r01/web_presente.png?v=sabik-definitive-r01';
const SEMANTIC=new Set(['idle','listening','processing','speaking','degraded']);
let controller,bodyPromise,bodyObserver,panelObserver,semantic='idle',semanticBeforeVoice='idle',voiceActive=false;
const nodes=()=>({visual:document.querySelector('#sabik-hologram'),master:document.querySelector('#sabik-web-master'),body:document.querySelector('#sabik-widget-body'),panel:document.querySelector('.sabik-panel')});
function readyBody(){if(!bodyPromise){const i=new Image();i.src=BODY;bodyPromise=i.decode().then(()=>i.src).catch(e=>{bodyPromise=null;throw e})}return bodyPromise}
function preferences(){return{motionLevel:document.querySelector('#sabik-motion-level')?.value||'NORMAL',systemReduced:media.matches,globalOff:Boolean(window.IGPreferences?.get?.().motion)}}
function effective(){return motion?.effectiveLevel?motion.effectiveLevel(preferences()):(preferences().globalOff?'SIN_MOVIMIENTO':preferences().systemReduced?'REDUCIDO':preferences().motionLevel)}
function syncMotionMode(){const {visual}=nodes();if(!visual)return;const level=effective();visual.dataset.motionLevel=level;visual.dataset.motion=level==='SIN_MOVIMIENTO'?'none':level==='REDUCIDO'?'reduced':'normal';}
function setSemanticState(next){if(!SEMANTIC.has(next))throw new RangeError('Unknown Sabik semantic state: '+next);semantic=next;const {visual}=nodes();if(visual)visual.dataset.state=next;return next}
function syncRenderActivity(){const {visual,body,panel}=nodes();if(!visual)return false;const inactive=document.hidden||Boolean(body?.hidden)||Boolean(panel?.hidden)||Boolean(panel?.classList.contains('is-collapsed'));visual.dataset.renderActive=String(!inactive);syncMotionMode();return!inactive}
function observeActivity(){const {body,panel}=nodes();if(body&&!bodyObserver){bodyObserver=new MutationObserver(syncRenderActivity);bodyObserver.observe(body,{attributes:true,attributeFilter:['hidden']})}if(panel&&!panelObserver){panelObserver=new MutationObserver(syncRenderActivity);panelObserver.observe(panel,{attributes:true,attributeFilter:['hidden','class']})}}
function ensureController(){
 if(controller)return controller;
 const {visual,master}=nodes();if(!visual||!master||!motion)return null;
 for(const selector of ['.orbits-back','.core-rings','.core-light','.particles-front'])if(!visual.querySelector(selector))throw new Error('SABIK_DEFINITIVE_LAYER_MISSING:'+selector);
 controller=motion.createController({
  element:master,load:()=>readyBody(),preferences,
  apply(src,state){master.src=src;visual.dataset.webAsset='PRESENTE';visual.dataset.webState=String(state).toUpperCase()},
  describe(state,level,active){
   visual.dataset.webState=String(state).toUpperCase();visual.dataset.motionActive=String(active);syncMotionMode();
   const h=document.querySelector('#sabik-motion-help'),en=document.documentElement.lang.startsWith('en');
   if(h)h.textContent=({NORMAL:en?'Sabik moves gently while present.':'Sabik se mueve suavemente mientras está presente.',REDUCIDO:en?'Reduced Sabik motion is active.':'Movimiento reducido de Sabik activado.',SIN_MOVIMIENTO:en?'Sabik motion is off.':'Movimiento de Sabik desactivado.'})[effective()];
  }
 });
 controller.setSabikState('presente',{force:true,static:true});setSemanticState('idle');syncRenderActivity();observeActivity();return controller;
}
function legacySemantic(state,options={}){if(options.semantic&&SEMANTIC.has(options.semantic))return options.semantic;if(state==='pausa'&&options.reason==='error')return'degraded';return'idle'}
function setSabikState(state,options={}){const c=ensureController();if(!c)return;setSemanticState(legacySemantic(state,options));return c.setSabikState(state,options)}
function render(next){const c=ensureController();if(!c)return;return setSabikState(motion.project(next||{}),{reason:'functional-projection',semantic:'idle'})}
function contextChange(){const c=ensureController();if(!c)return;setSemanticState('idle');return c.setSabikState('transicion',{to:'presente',reason:'explicit-context-change',force:true})}
function setVoiceActive(active){voiceActive=Boolean(active);if(voiceActive){if(semantic!=='speaking')semanticBeforeVoice=semantic;setSemanticState('speaking')}else if(semantic==='speaking'){setSemanticState(semanticBeforeVoice||'idle')}const {visual}=nodes();if(visual)visual.dataset.voiceActive=String(voiceActive);return voiceActive}
function refresh(){syncRenderActivity();return ensureController()?.refresh()}
window.SabikWebPresentation=Object.freeze({
 render,contextChange,setSabikState,setSemanticState,setVoiceActive,refresh,
 snapshot(){const {visual}=nodes();return{...(ensureController()?.snapshot()||{}),semanticState:semantic,voiceActive,renderActive:visual?.dataset.renderActive==='true',layers:{orbits:Boolean(visual?.querySelector('.orbits-back')),core:Boolean(visual?.querySelector('.core-light')),particles:Boolean(visual?.querySelector('.particles-front'))}}}
});
window.setSabikState=(state,options)=>window.SabikWebPresentation.setSabikState(state,options);
function boot(){ensureController();readyBody().catch(()=>{});document.querySelector('#sabik-motion-level')?.addEventListener('change',refresh)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
document.addEventListener('visibilitychange',syncRenderActivity);
window.addEventListener('pagehide',()=>{const {visual}=nodes();if(visual)visual.dataset.renderActive='false'});
media.addEventListener('change',refresh);
new MutationObserver(refresh).observe(document.documentElement,{attributes:true,attributeFilter:['data-ig-motion']});
})();