/* Iris Green · Child Safety R01 · canonical age lens.
   Age selection is mandatory. AGE_18_PLUS is a claim, not adult-access assurance. */
(function(){
'use strict';
if(window.IGAudience)return;
var KEY='ig-age-band-v2',LEGACY_KEY='ig-audience-stage-v1';
var AGE_UNSET='AGE_UNSET',USER_AGE=['AGE_0_12','AGE_13_17','AGE_18_PLUS'],AGE=USER_AGE.concat(['ALL_AGES']),VALUES=[AGE_UNSET,'GENERAL'].concat(USER_AGE),current=AGE_UNSET;
var LEGACY={children:'AGE_0_12',teenagers:'AGE_13_17',adults:'AGE_18_PLUS',any:AGE_UNSET,ALL_AGES:AGE_UNSET,default:AGE_UNSET,GENERAL:AGE_UNSET};
var runtimePromise=null,runtimeCache=null;

function canonical(v){
 v=String(v||'');
 if(v==='GENERAL')return AGE_UNSET;
 return VALUES.indexOf(v)!==-1?v:(LEGACY[v]||null);
}
try{
 var saved=canonical(sessionStorage.getItem(KEY))||canonical(sessionStorage.getItem(LEGACY_KEY));
 if(saved)current=saved;
}catch(_){}

function values(v){if(Array.isArray(v))return v.map(String);return String(v||'').split(/[\s,|]+/).filter(Boolean);}
function isAdultClaimed(){return current==='AGE_18_PLUS';}
function hasAdultAssurance(){return false;}
function canAccessRestrictedAdultContent(){return false;}
function isAdult(){return canAccessRestrictedAdultContent();}
function mode(){return canAccessRestrictedAdultContent()?'adult':'safe';}
function ageUnset(){return current===AGE_UNSET||current==='GENERAL';}

/* These collections are reference material about ages, not a children's interface. */
function childRouteBlocked(url){
 if(current!=='AGE_0_12')return false;
 var p=routeKey(url).split('#')[0];
 return /^\/(es\/(neurodiversidad\/condiciones|situaciones|biblioteca|investigacion|datos|tramites|cuestionarios)|en\/(neurodiversity\/conditions|situations|everyday-life|research|data|support-directory|questionnaires))(\/|$)/.test(p);
}
function selectedBand(){return USER_AGE.indexOf(current)!==-1?current:null;}
var SAFE_UNCLASSIFIED_PREFIXES=Object.freeze([
 '/es/recursos','/en/resources','/es/taller','/en/workshop','/es/sitio-tranquilo','/en/quiet-space',
 '/es/intereses','/en/interests','/es/libros',
 '/es/sobre-iris-green','/es/lectura-accesible','/es/privacidad','/en/privacy'
]);
function strictSelectedView(){return current==='AGE_0_12'||current==='AGE_13_17';}
function normalizedPagePath(){return routeKey(location.href).split('#')[0];}
function preAgeInfoRouteAllowed(path){
 return path==='/es/privacidad'||path==='/en/privacy';
}
function unclassifiedRouteAllowed(path){
 if(path==='/'||path==='/en')return true;
 return SAFE_UNCLASSIFIED_PREFIXES.some(function(prefix){return path===prefix||path.indexOf(prefix+'/')===0;});
}
function allowedAgeBands(input){
 if(ageUnset())return false;
 var list=values(input).filter(function(v){return AGE.indexOf(v)!==-1;});
 if(!list.length)return false;
 return list.indexOf(current)!==-1||list.indexOf('ALL_AGES')!==-1;
}
/* Migration-only content metadata fallback. */
function allowedAudience(input){
 if(ageUnset())return false;
 var list=values(input);if(!list.length)return false;
 if(list.some(function(v){return AGE.indexOf(v)!==-1;}))return allowedAgeBands(list);
 if(list.indexOf('TRANSVERSAL')!==-1)return true;
 if(current==='AGE_0_12')return list.indexOf('INFANCIA')!==-1;
 if(current==='AGE_13_17')return list.indexOf('ADOLESCENCIA')!==-1;
 if(current==='AGE_18_PLUS')return list.indexOf('ADULTEZ')!==-1;
 return false;
}
function routeKey(v){try{var u=new URL(v,location.origin),p=(u.pathname||'/').replace(/\/+/g,'/');if(p!=='/'&&/\/$/.test(p))p=p.slice(0,-1);return p+(u.hash||'');}catch(_){return '';}}
function loadAgeMatrix(){
 if(runtimeCache)return Promise.resolve(runtimeCache);if(runtimePromise)return runtimePromise;
 runtimePromise=fetch('/assets/safety/age-runtime-r51.json',{cache:'no-cache'}).then(function(r){if(!r.ok)throw new Error('Age matrix '+r.status);return r.json();}).then(function(d){if(!d||d.schema!=='R51_A2_AGE_RUNTIME/1.0'||!d.by_url)throw new Error('Invalid age runtime');runtimeCache=d;window.dispatchEvent(new CustomEvent('ig:age-matrix-ready'));return d;}).catch(function(e){runtimePromise=null;throw e;});return runtimePromise;
}
function ageBandsForUrl(url){return loadAgeMatrix().then(function(d){var k=routeKey(url),b=d.by_url[k];if(!b&&k.indexOf('#')!==-1)b=d.by_url[k.split('#')[0]];return Array.isArray(b)?b.slice():null;});}
function allowedUrl(url){
 if(ageUnset())return Promise.resolve(false);
 if(childRouteBlocked(url))return Promise.resolve(false);
 return ageBandsForUrl(url).then(function(b){return Boolean(b&&allowedAgeBands(b));}).catch(function(){return false;});
}
function displayName(){
 var en=String(document.documentElement.lang||'').toLowerCase().indexOf('en')===0;
 var names=en?{AGE_UNSET:'Not selected',GENERAL:'Not selected',AGE_0_12:'Ages 0–12',AGE_13_17:'Ages 13–17',AGE_18_PLUS:'Ages 18+'}:{AGE_UNSET:'Sin seleccionar',GENERAL:'Sin seleccionar',AGE_0_12:'0–12 años',AGE_13_17:'13–17 años',AGE_18_PLUS:'18 años o más'};
 return names[current]||names.AGE_UNSET;
}
function applyRoot(){
 document.documentElement.dataset.igAudience=current;
 document.documentElement.dataset.igAgeBand=current;
 document.documentElement.dataset.igSafetyMode=mode()==='adult'?'adult-assured':'safe-by-default';
 document.documentElement.dataset.igAdultClaimed=String(isAdultClaimed());
 document.documentElement.dataset.igAdultAssurance=hasAdultAssurance()?'verified':'unverified';
}
function syncPicker(root){
 root.querySelectorAll('[data-ig-audience-stage]').forEach(function(btn){var v=canonical(btn.getAttribute('data-ig-audience-stage'));btn.setAttribute('aria-pressed',String(v===current));});
 var status=root.querySelector('[data-ig-audience-status]');if(status)status.textContent=displayName();
}
function setVisible(node,ok){node.hidden=!ok;if(ok)node.removeAttribute('aria-hidden');else node.setAttribute('aria-hidden','true');}
function syncDiscovery(root){
 root=root||document;
 root.querySelectorAll('[data-ig-age-bands]').forEach(function(node){setVisible(node,!childRouteBlocked(node.getAttribute('href')||'')&&allowedAgeBands(node.getAttribute('data-ig-age-bands')));});
 root.querySelectorAll('[data-ig-audience-values]:not([data-ig-age-bands])').forEach(function(node){setVisible(node,allowedAudience(node.getAttribute('data-ig-audience-values')));});
}
function blockedCopy(){
 var en=String(document.documentElement.lang||'').toLowerCase().indexOf('en')===0;
 return en?{title:'Not shown in this view',body:'This section is not part of the '+displayName()+' view.',home:'Back to home'}:{title:'No se muestra en esta vista',body:'Esta sección no forma parte de la vista '+displayName()+'.',home:'Volver a Inicio'};
}
function syncPageGate(){
 var body=document.body;if(!body)return;
 var canonicalBands=body.getAttribute('data-ig-page-age-bands'),legacy=body.getAttribute('data-ig-page-audience'),path=normalizedPagePath();
 var hasSafeS2=Boolean(body.querySelector('[data-ig-s2-safe]'));
 var blocked=ageUnset()?!preAgeInfoRouteAllowed(path):childRouteBlocked(location.href)?true:hasSafeS2?false:(canonicalBands!==null?!allowedAgeBands(canonicalBands):(legacy?!allowedAudience(legacy):(strictSelectedView()&&!unclassifiedRouteAllowed(path))));
 body.toggleAttribute('data-ig-audience-blocked',blocked);
 body.querySelectorAll('main').forEach(function(main){main.toggleAttribute('inert',blocked);if(blocked)main.setAttribute('aria-hidden','true');else main.removeAttribute('aria-hidden');});
 var gate=body.querySelector('[data-ig-audience-blocked-message]');
 if(ageUnset()){if(gate)gate.remove();return;}
 if(!blocked){if(gate)gate.remove();return;}
 var copy=blockedCopy();
 if(!gate){
  gate=document.createElement('section');gate.className='ig-audience-blocked-message';gate.setAttribute('data-ig-audience-blocked-message','');gate.setAttribute('role','region');
  var h=document.createElement('h1'),p=document.createElement('p'),a=document.createElement('a');h.setAttribute('data-ig-blocked-title','');p.setAttribute('data-ig-blocked-body','');a.setAttribute('data-ig-blocked-home','');a.href=String(document.documentElement.lang||'').toLowerCase().indexOf('en')===0?'/en/':'/';gate.append(h,p,a);
  var main=body.querySelector('main');if(main)main.parentNode.insertBefore(gate,main);else body.insertBefore(gate,body.firstChild);
 }
 gate.querySelector('[data-ig-blocked-title]').textContent=copy.title;gate.querySelector('[data-ig-blocked-body]').textContent=copy.body;gate.querySelector('[data-ig-blocked-home]').textContent=copy.home;
}
function mandatoryCopy(){
 var en=String(document.documentElement.lang||'').toLowerCase().indexOf('en')===0;
 return en?{
  title:'What is your age group?',
  body:'Choose one option to continue. We do not ask for your date of birth, identity or diagnosis.',
  a:'Ages 0–12',b:'Ages 13–17',c:'Ages 18+',
  privacyNote:'We use your age group only to adapt the experience and apply appropriate safety measures. We do not use it for advertising. Choosing “Ages 18+” is a self-declaration: it does not verify adulthood or unlock restricted content by itself.',
  privacy:'Privacy',ageInfo:'How we use age',childSafety:'Child protection'
 }:{
  title:'¿Qué edad tienes?',
  body:'Elige una opción para continuar. No pedimos fecha de nacimiento, identidad ni diagnóstico.',
  a:'0–12 años',b:'13–17 años',c:'18 años o más',
  privacyNote:'Usamos tu grupo de edad solo para adaptar la experiencia y aplicar las medidas de seguridad adecuadas. No lo usamos para publicidad. Elegir «18 años o más» es una autodeclaración: no verifica la mayoría de edad ni desbloquea por sí sola contenido restringido.',
  privacy:'Privacidad',ageInfo:'Cómo usamos la edad',childSafety:'Protección de menores'
 };
}
function syncMandatoryGate(){
 var body=document.body;if(!body)return;
 var ageMissing=ageUnset(),preAgeInfo=ageMissing&&preAgeInfoRouteAllowed(normalizedPagePath()),gateRequired=ageMissing&&!preAgeInfo;
 body.toggleAttribute('data-ig-age-unset',ageMissing);
 body.toggleAttribute('data-ig-pre-age-info',preAgeInfo);
 body.querySelectorAll('footer').forEach(function(footer){footer.toggleAttribute('inert',gateRequired);if(gateRequired)footer.setAttribute('aria-hidden','true');else footer.removeAttribute('aria-hidden');});
 var gate=body.querySelector('[data-ig-mandatory-age-gate]');
 if(!gateRequired){if(gate)gate.remove();return;}
 var copy=mandatoryCopy();
 if(!gate){
  gate=document.createElement('section');gate.className='ig-mandatory-age-gate';gate.setAttribute('data-ig-mandatory-age-gate','');gate.setAttribute('role','region');gate.setAttribute('aria-labelledby','ig-mandatory-age-title');
  var card=document.createElement('div');card.className='ig-mandatory-age-card';
  var title=document.createElement('h1');title.id='ig-mandatory-age-title';
  var note=document.createElement('p');note.setAttribute('data-ig-mandatory-age-note','');
  var pick=document.createElement('div');pick.className='ig-mandatory-age-options';pick.setAttribute('data-ig-audience-picker','');
  [['AGE_0_12','a'],['AGE_13_17','b'],['AGE_18_PLUS','c']].forEach(function(item){var btn=document.createElement('button');btn.type='button';btn.setAttribute('data-ig-audience-stage',item[0]);btn.setAttribute('aria-pressed','false');btn.setAttribute('data-ig-mandatory-label',item[1]);pick.appendChild(btn);});
  var legal=document.createElement('p');legal.className='ig-mandatory-age-privacy';legal.setAttribute('data-ig-mandatory-age-privacy','');
  var links=document.createElement('nav');links.className='ig-mandatory-age-links';links.setAttribute('aria-label','Age and privacy information');
  var privacy=document.createElement('a');privacy.setAttribute('data-ig-age-privacy-link','');
  var ageInfo=document.createElement('a');ageInfo.setAttribute('data-ig-age-info-link','');
  var childSafety=document.createElement('a');childSafety.setAttribute('data-ig-age-child-link','');
  links.append(privacy,ageInfo,childSafety);
  card.append(title,note,pick,legal,links);gate.appendChild(card);body.appendChild(gate);mount(gate);
  requestAnimationFrame(function(){var first=gate.querySelector('button');if(first)first.focus({preventScroll:true});});
 }
 gate.querySelector('#ig-mandatory-age-title').textContent=copy.title;
 gate.querySelector('[data-ig-mandatory-age-note]').textContent=copy.body;
 gate.querySelectorAll('[data-ig-mandatory-label]').forEach(function(btn){btn.textContent=copy[btn.getAttribute('data-ig-mandatory-label')];});
 gate.querySelector('[data-ig-mandatory-age-privacy]').textContent=copy.privacyNote;
 var isEn=String(document.documentElement.lang||'').toLowerCase().indexOf('en')===0;
 var privacy=gate.querySelector('[data-ig-age-privacy-link]'),ageInfo=gate.querySelector('[data-ig-age-info-link]'),childSafety=gate.querySelector('[data-ig-age-child-link]');
 var privacyBase=isEn?'/en/privacy/':'/es/privacidad/';
 gate.querySelector('.ig-mandatory-age-links').setAttribute('aria-label',isEn?'Age, privacy and child protection':'Edad, privacidad y protección de menores');
 privacy.textContent=copy.privacy;privacy.href=privacyBase;
 ageInfo.textContent=copy.ageInfo;ageInfo.href=privacyBase+'#age';
 childSafety.textContent=copy.childSafety;childSafety.href=privacyBase+'#children';
 syncPicker(gate);
}
function apply(){applyRoot();document.querySelectorAll('[data-ig-audience-picker]').forEach(syncPicker);syncDiscovery(document);syncPageGate();syncMandatoryGate();document.documentElement.dataset.igAgeRuntimeReady='true';}
function dispatchChange(){window.dispatchEvent(new CustomEvent('ig:audience-change',{detail:{ageBand:selectedBand(),safetyMode:mode(),adultClaimed:isAdultClaimed(),adultAssurance:hasAdultAssurance()?'verified':'unverified'}}));}
function set(value){
 var next=canonical(value);if(USER_AGE.indexOf(next)===-1)return false;
 current=next;try{sessionStorage.setItem(KEY,current);sessionStorage.removeItem(LEGACY_KEY);}catch(_){}
 apply();dispatchChange();return true;
}
function clear(){
 current=AGE_UNSET;try{sessionStorage.removeItem(KEY);sessionStorage.removeItem(LEGACY_KEY);}catch(_){}
 apply();dispatchChange();
}
function mount(root){
 root=root||document;
 root.querySelectorAll('[data-ig-audience-picker]').forEach(function(picker){
  if(picker.dataset.igAudienceReady)return;picker.dataset.igAudienceReady='true';
  picker.addEventListener('click',function(event){var btn=event.target.closest('[data-ig-audience-stage]');if(!btn||!picker.contains(btn))return;var next=canonical(btn.getAttribute('data-ig-audience-stage'));if(USER_AGE.indexOf(next)!==-1&&next!==current)set(next);});
  syncPicker(picker);
 });
 syncDiscovery(root);
}
function observeBody(){
 if(!document.body)return;
 new MutationObserver(function(records){records.forEach(function(r){r.addedNodes.forEach(function(n){if(n.nodeType===1)syncDiscovery(n.matches&&n.matches('[data-ig-age-bands],[data-ig-audience-values]')?n.parentNode:n);});});}).observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){mount();apply();observeBody();},{once:true});else{mount();apply();observeBody();}
new MutationObserver(function(){apply();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
window.IGAudience=Object.freeze({
 get:function(){return current;},set:set,clear:clear,mode:mode,isAdult:isAdult,isAdultClaimed:isAdultClaimed,hasAdultAssurance:hasAdultAssurance,canAccessRestrictedAdultContent:canAccessRestrictedAdultContent,isSafe:function(){return !canAccessRestrictedAdultContent();},selectedBand:selectedBand,allowedAgeBands:allowedAgeBands,allowedAudience:allowedAudience,loadAgeMatrix:loadAgeMatrix,ageBandsForUrl:ageBandsForUrl,allowedUrl:allowedUrl,childRouteBlocked:childRouteBlocked,routeKey:routeKey,preAgeInfoRouteAllowed:preAgeInfoRouteAllowed,mount:mount,refresh:apply,canonical:canonical
});
})();