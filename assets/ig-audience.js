/* Iris Green R51 · canonical age lens.
   Session-only. Age controls discovery and never replaces sensitivity policy. */
(function(){
'use strict';
if(window.IGAudience)return;
var KEY='ig-audience-stage-v1',VALUES=['children','teenagers','adults','any'],current='default';
var AGE=['AGE_0_12','AGE_13_17','AGE_18_PLUS','ALL_AGES'];
var TARGET={children:'AGE_0_12',teenagers:'AGE_13_17',adults:'AGE_18_PLUS',any:'ALL_AGES'};
var runtimePromise=null,runtimeCache=null;
try{var saved=sessionStorage.getItem(KEY);if(VALUES.indexOf(saved)!==-1)current=saved;}catch(_){}
function values(v){
 if(Array.isArray(v))return v.map(String);
 return String(v||'').split(/[\s,|]+/).filter(Boolean);
}
function mode(){return current==='adults'?'adult':'safe';}
function isAdult(){return current==='adults';}
function selectedBand(){return TARGET[current]||null;}
function allowedAgeBands(input){
 if(current==='default')return true;
 var list=values(input).filter(function(v){return AGE.indexOf(v)!==-1;});
 if(!list.length)return false;
 if(current==='any')return list.indexOf('ALL_AGES')!==-1;
 var target=selectedBand();
 return list.indexOf(target)!==-1||list.indexOf('ALL_AGES')!==-1;
}
/* Migration-only fallback for products outside the 965-record matrix. */
function allowedAudience(input){
 var list=values(input);
 if(!list.length||current==='default')return true;
 if(list.some(function(v){return AGE.indexOf(v)!==-1;}))return allowedAgeBands(list);
 if(list.indexOf('TRANSVERSAL')!==-1)return true;
 if(current==='children')return list.indexOf('INFANCIA')!==-1;
 if(current==='teenagers')return list.indexOf('ADOLESCENCIA')!==-1;
 if(current==='adults')return list.indexOf('ADULTEZ')!==-1;
 if(current==='any')return false;
 return true;
}
function routeKey(v){
 try{
  var u=new URL(v,location.origin),p=(u.pathname||'/').replace(/\/+/g,'/');
  if(p!=='/'&&/\/$/.test(p))p=p.slice(0,-1);
  return p+(u.hash||'');
 }catch(_){return '';}
}
function loadAgeMatrix(){
 if(runtimeCache)return Promise.resolve(runtimeCache);
 if(runtimePromise)return runtimePromise;
 runtimePromise=fetch('/assets/safety/age-runtime-r51.json',{cache:'no-cache'}).then(function(r){
  if(!r.ok)throw new Error('Age matrix '+r.status);
  return r.json();
 }).then(function(d){
  if(!d||d.schema!=='R51_A2_AGE_RUNTIME/1.0'||!d.by_url)throw new Error('Invalid age runtime');
  runtimeCache=d;
  window.dispatchEvent(new CustomEvent('ig:age-matrix-ready'));
  return d;
 }).catch(function(e){runtimePromise=null;throw e;});
 return runtimePromise;
}
function ageBandsForUrl(url){
 return loadAgeMatrix().then(function(d){var k=routeKey(url),b=d.by_url[k];if(!b&&k.indexOf('#')!==-1)b=d.by_url[k.split('#')[0]];return Array.isArray(b)?b.slice():null;});
}
function allowedUrl(url){
 if(current==='default')return Promise.resolve(true);
 return ageBandsForUrl(url).then(function(b){return Boolean(b&&allowedAgeBands(b));}).catch(function(){return false;});
}
function stageName(){
 var en=String(document.documentElement.lang||'').toLowerCase().indexOf('en')===0;
 var names=en?{default:'General',children:'Children',teenagers:'Teenagers',adults:'Adults',any:'Any age'}:{default:'General',children:'Infancia',teenagers:'Adolescencia',adults:'Adultez',any:'Cualquier edad'};
 return names[current]||names.default;
}
function applyRoot(){
 document.documentElement.dataset.igAudience=current;
 document.documentElement.dataset.igSafetyMode=isAdult()?'adult-explicit':'safe-by-default';
}
applyRoot();
function syncPicker(root){
 root.querySelectorAll('[data-ig-audience-stage]').forEach(function(btn){
  btn.setAttribute('aria-pressed',String(btn.getAttribute('data-ig-audience-stage')===current));
 });
 var status=root.querySelector('[data-ig-audience-status]');if(status)status.textContent=stageName();
}
function setVisible(node,ok){
 node.hidden=!ok;
 if(ok)node.removeAttribute('aria-hidden');else node.setAttribute('aria-hidden','true');
}
function syncDiscovery(root){
 root=root||document;
 root.querySelectorAll('[data-ig-age-bands]').forEach(function(node){setVisible(node,allowedAgeBands(node.getAttribute('data-ig-age-bands')));});
 root.querySelectorAll('[data-ig-audience-values]:not([data-ig-age-bands])').forEach(function(node){setVisible(node,allowedAudience(node.getAttribute('data-ig-audience-values')));});
}
function blockedCopy(){
 var en=String(document.documentElement.lang||'').toLowerCase().indexOf('en')===0;
 return en?
  {title:'Not shown in this view',body:'This section is not part of the '+stageName()+' view.',home:'Back to home'}:
  {title:'No se muestra en esta vista',body:'Esta sección no forma parte de la vista '+stageName()+'.',home:'Volver a Inicio'};
}
function syncPageGate(){
 var body=document.body;if(!body)return;
 var canonical=body.getAttribute('data-ig-page-age-bands'),legacy=body.getAttribute('data-ig-page-audience');
 var blocked=canonical!==null?!allowedAgeBands(canonical):(legacy? !allowedAudience(legacy):false);
 body.toggleAttribute('data-ig-audience-blocked',blocked);
 body.querySelectorAll('main').forEach(function(main){main.toggleAttribute('inert',blocked);if(blocked)main.setAttribute('aria-hidden','true');else main.removeAttribute('aria-hidden');});
 var gate=body.querySelector('[data-ig-audience-blocked-message]');
 if(!blocked){if(gate)gate.remove();return;}
 var copy=blockedCopy();
 if(!gate){
  gate=document.createElement('section');gate.className='ig-audience-blocked-message';gate.setAttribute('data-ig-audience-blocked-message','');gate.setAttribute('role','region');
  var h=document.createElement('h1'),p=document.createElement('p'),a=document.createElement('a');h.setAttribute('data-ig-blocked-title','');p.setAttribute('data-ig-blocked-body','');a.setAttribute('data-ig-blocked-home','');a.href=String(document.documentElement.lang||'').toLowerCase().indexOf('en')===0?'/en/':'/';
  gate.append(h,p,a);
  var header=Array.from(body.children).find(function(n){return n.tagName==='HEADER';});
  var main=body.querySelector('main');if(main)body.insertBefore(gate,main);else if(header)header.insertAdjacentElement('afterend',gate);else body.insertBefore(gate,body.firstChild);
 }
 gate.querySelector('[data-ig-blocked-title]').textContent=copy.title;
 gate.querySelector('[data-ig-blocked-body]').textContent=copy.body;
 gate.querySelector('[data-ig-blocked-home]').textContent=copy.home;
}
function apply(){
 applyRoot();document.querySelectorAll('[data-ig-audience-picker]').forEach(syncPicker);syncDiscovery(document);syncPageGate();
}
function set(value){
 if(VALUES.indexOf(value)===-1)return false;
 current=value;try{sessionStorage.setItem(KEY,value);}catch(_){}
 apply();window.dispatchEvent(new CustomEvent('ig:audience-change',{detail:{stage:current,ageBand:selectedBand(),safetyMode:mode()}}));return true;
}
function clear(){
 current='default';try{sessionStorage.removeItem(KEY);}catch(_){}
 apply();window.dispatchEvent(new CustomEvent('ig:audience-change',{detail:{stage:current,ageBand:null,safetyMode:mode()}}));
}
function mount(root){
 root=root||document;root.querySelectorAll('[data-ig-audience-picker]').forEach(function(picker){
  if(picker.dataset.igAudienceReady)return;picker.dataset.igAudienceReady='true';
  picker.addEventListener('click',function(event){var btn=event.target.closest('[data-ig-audience-stage]');if(btn&&picker.contains(btn))set(btn.getAttribute('data-ig-audience-stage'));});
  syncPicker(picker);
 });syncDiscovery(root);
}
function observeBody(){if(!document.body)return;new MutationObserver(function(records){records.forEach(function(r){r.addedNodes.forEach(function(n){if(n.nodeType===1)syncDiscovery(n.matches&&n.matches('[data-ig-age-bands],[data-ig-audience-values]')?n.parentNode:n);});});}).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){mount();apply();observeBody();},{once:true});else{mount();apply();observeBody();}
new MutationObserver(function(){document.querySelectorAll('[data-ig-audience-picker]').forEach(syncPicker);syncPageGate();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
window.IGAudience=Object.freeze({
 get:function(){return current;},set:set,clear:clear,mode:mode,isAdult:isAdult,isSafe:function(){return !isAdult();},
 selectedBand:selectedBand,allowedAgeBands:allowedAgeBands,allowedAudience:allowedAudience,
 loadAgeMatrix:loadAgeMatrix,ageBandsForUrl:ageBandsForUrl,allowedUrl:allowedUrl,routeKey:routeKey,mount:mount,refresh:apply
});
})();