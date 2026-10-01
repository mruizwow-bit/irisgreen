/* Iris Green R51 · canonical age lens. Session-only; age and sensitivity remain independent. */
(function(){
'use strict';
if(window.IGAudience)return;
var KEY='ig-age-band-v2',LEGACY_KEY='ig-audience-stage-v1';
var AGE=['AGE_0_12','AGE_13_17','AGE_18_PLUS','ALL_AGES'],VALUES=['GENERAL'].concat(AGE),current='GENERAL';
var LEGACY={children:'AGE_0_12',teenagers:'AGE_13_17',adults:'AGE_18_PLUS',any:'ALL_AGES',default:'GENERAL'};
var runtimePromise=null,runtimeCache=null;
function canonical(v){v=String(v||'');return VALUES.indexOf(v)!==-1?v:(LEGACY[v]||null);}
try{var saved=canonical(sessionStorage.getItem(KEY))||canonical(sessionStorage.getItem(LEGACY_KEY));if(saved)current=saved;}catch(_){}
function values(v){if(Array.isArray(v))return v.map(String);return String(v||'').split(/[\s,|]+/).filter(Boolean);}
function mode(){return current==='AGE_18_PLUS'?'adult':'safe';}
function isAdult(){return current==='AGE_18_PLUS';}
function selectedBand(){return current==='GENERAL'?null:current;}
var SAFE_UNCLASSIFIED_PREFIXES=Object.freeze([
 '/es/recursos','/en/resources','/es/taller','/en/workshop','/es/sitio-tranquilo','/en/quiet-space',
 '/es/sobre-iris-green','/es/lectura-accesible','/es/privacidad','/en/privacy'
]);
function strictSelectedView(){return current==='AGE_0_12'||current==='AGE_13_17'||current==='ALL_AGES';}
function normalizedPagePath(){return routeKey(location.href).split('#')[0];}
function unclassifiedRouteAllowed(path){
 if(path==='/'||path==='/en')return true;
 return SAFE_UNCLASSIFIED_PREFIXES.some(function(prefix){return path===prefix||path.indexOf(prefix+'/')===0;});
}
function allowedAgeBands(input){
 if(current==='GENERAL')return true;
 var list=values(input).filter(function(v){return AGE.indexOf(v)!==-1;});
 if(!list.length)return false;
 if(current==='ALL_AGES')return list.indexOf('ALL_AGES')!==-1;
 return list.indexOf(current)!==-1||list.indexOf('ALL_AGES')!==-1;
}
/* Migration-only content metadata fallback. New age state is never emitted as legacy taxonomy. */
function allowedAudience(input){
 var list=values(input);if(!list.length||current==='GENERAL')return true;
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
function allowedUrl(url){if(current==='GENERAL')return Promise.resolve(true);return ageBandsForUrl(url).then(function(b){return Boolean(b&&allowedAgeBands(b));}).catch(function(){return false;});}
function displayName(){
 var en=String(document.documentElement.lang||'').toLowerCase().indexOf('en')===0;
 var names=en?{GENERAL:'General',AGE_0_12:'Ages 0–12',AGE_13_17:'Ages 13–17',AGE_18_PLUS:'Ages 18+',ALL_AGES:'All ages'}:{GENERAL:'General',AGE_0_12:'0–12 años',AGE_13_17:'13–17 años',AGE_18_PLUS:'18 años o más',ALL_AGES:'Todas las edades'};
 return names[current]||names.GENERAL;
}
function applyRoot(){document.documentElement.dataset.igAudience=current;document.documentElement.dataset.igAgeBand=current;document.documentElement.dataset.igSafetyMode=isAdult()?'adult-explicit':'safe-by-default';}
applyRoot();
function syncPicker(root){root.querySelectorAll('[data-ig-audience-stage]').forEach(function(btn){var v=canonical(btn.getAttribute('data-ig-audience-stage'));btn.setAttribute('aria-pressed',String(v===current));});var status=root.querySelector('[data-ig-audience-status]');if(status)status.textContent=displayName();}
function setVisible(node,ok){node.hidden=!ok;if(ok)node.removeAttribute('aria-hidden');else node.setAttribute('aria-hidden','true');}
function syncDiscovery(root){root=root||document;root.querySelectorAll('[data-ig-age-bands]').forEach(function(node){setVisible(node,allowedAgeBands(node.getAttribute('data-ig-age-bands')));});root.querySelectorAll('[data-ig-audience-values]:not([data-ig-age-bands])').forEach(function(node){setVisible(node,allowedAudience(node.getAttribute('data-ig-audience-values')));});}
function blockedCopy(){var en=String(document.documentElement.lang||'').toLowerCase().indexOf('en')===0;return en?{title:'Not shown in this view',body:'This section is not part of the '+displayName()+' view.',home:'Back to home'}:{title:'No se muestra en esta vista',body:'Esta sección no forma parte de la vista '+displayName()+'.',home:'Volver a Inicio'};}
function syncPageGate(){var body=document.body;if(!body)return;var canonicalBands=body.getAttribute('data-ig-page-age-bands'),legacy=body.getAttribute('data-ig-page-audience'),classified=canonicalBands!==null||Boolean(legacy),path=normalizedPagePath();/* S2 discovery stays age-filtered, but a direct S2 URL must always remain a safe-variant page. The full body is still split at build time and only adults may request it explicitly. */var hasSafeS2=Boolean(body.querySelector('[data-ig-s2-safe]'));var blocked=hasSafeS2?false:(canonicalBands!==null?!allowedAgeBands(canonicalBands):(legacy?!allowedAudience(legacy):(strictSelectedView()&&!unclassifiedRouteAllowed(path))));body.toggleAttribute('data-ig-audience-blocked',blocked);body.querySelectorAll('main').forEach(function(main){main.toggleAttribute('inert',blocked);if(blocked)main.setAttribute('aria-hidden','true');else main.removeAttribute('aria-hidden');});var gate=body.querySelector('[data-ig-audience-blocked-message]');if(!blocked){if(gate)gate.remove();return;}var copy=blockedCopy();if(!gate){gate=document.createElement('section');gate.className='ig-audience-blocked-message';gate.setAttribute('data-ig-audience-blocked-message','');gate.setAttribute('role','region');var h=document.createElement('h1'),p=document.createElement('p'),a=document.createElement('a');h.setAttribute('data-ig-blocked-title','');p.setAttribute('data-ig-blocked-body','');a.setAttribute('data-ig-blocked-home','');a.href=String(document.documentElement.lang||'').toLowerCase().indexOf('en')===0?'/en/':'/';gate.append(h,p,a);var main=body.querySelector('main');if(main)body.insertBefore(gate,main);else body.insertBefore(gate,body.firstChild);}gate.querySelector('[data-ig-blocked-title]').textContent=copy.title;gate.querySelector('[data-ig-blocked-body]').textContent=copy.body;gate.querySelector('[data-ig-blocked-home]').textContent=copy.home;}
function apply(){applyRoot();document.querySelectorAll('[data-ig-audience-picker]').forEach(syncPicker);syncDiscovery(document);syncPageGate();}
function set(value){var next=canonical(value);if(!next||next==='GENERAL')return false;current=next;try{sessionStorage.setItem(KEY,current);sessionStorage.removeItem(LEGACY_KEY);}catch(_){}apply();window.dispatchEvent(new CustomEvent('ig:audience-change',{detail:{ageBand:selectedBand(),safetyMode:mode()}}));return true;}
function clear(){current='GENERAL';try{sessionStorage.removeItem(KEY);sessionStorage.removeItem(LEGACY_KEY);}catch(_){}apply();window.dispatchEvent(new CustomEvent('ig:audience-change',{detail:{ageBand:null,safetyMode:mode()}}));}
function mount(root){root=root||document;root.querySelectorAll('[data-ig-audience-picker]').forEach(function(picker){if(picker.dataset.igAudienceReady)return;picker.dataset.igAudienceReady='true';picker.addEventListener('click',function(event){var btn=event.target.closest('[data-ig-audience-stage]');if(!btn||!picker.contains(btn))return;var next=canonical(btn.getAttribute('data-ig-audience-stage'));if(next===current)clear();else set(next);});syncPicker(picker);});syncDiscovery(root);}
function observeBody(){if(!document.body)return;new MutationObserver(function(records){records.forEach(function(r){r.addedNodes.forEach(function(n){if(n.nodeType===1)syncDiscovery(n.matches&&n.matches('[data-ig-age-bands],[data-ig-audience-values]')?n.parentNode:n);});});}).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){mount();apply();observeBody();},{once:true});else{mount();apply();observeBody();}
new MutationObserver(function(){document.querySelectorAll('[data-ig-audience-picker]').forEach(syncPicker);syncPageGate();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
window.IGAudience=Object.freeze({get:function(){return current;},set:set,clear:clear,mode:mode,isAdult:isAdult,isSafe:function(){return !isAdult();},selectedBand:selectedBand,allowedAgeBands:allowedAgeBands,allowedAudience:allowedAudience,loadAgeMatrix:loadAgeMatrix,ageBandsForUrl:ageBandsForUrl,allowedUrl:allowedUrl,routeKey:routeKey,mount:mount,refresh:apply,canonical:canonical});
})();
