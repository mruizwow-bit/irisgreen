/* Iris Green R51 · life-stage lens and audience discovery filter.
   Session-only. Audience controls discovery; it is not age assurance. */
(function(){
'use strict';
if(window.IGAudience)return;
var KEY='ig-audience-stage-v1',VALUES=['children','teenagers','adults','any'],current='default';
try{var saved=sessionStorage.getItem(KEY);if(VALUES.indexOf(saved)!==-1)current=saved;}catch(_){}
function values(v){
 if(Array.isArray(v))return v.map(String);
 return String(v||'').split(/[\s,|]+/).filter(Boolean);
}
function mode(){return current==='adults'?'adult':'safe';}
function isAdult(){return current==='adults';}
function allowedAudience(input){
 var list=values(input);
 if(!list.length||current==='default')return true;
 if(list.indexOf('TRANSVERSAL')!==-1)return true;
 if(current==='children')return list.indexOf('INFANCIA')!==-1;
 if(current==='teenagers')return list.indexOf('ADOLESCENCIA')!==-1;
 if(current==='adults')return list.indexOf('ADULTEZ')!==-1;
 if(current==='any')return false;
 return true;
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
function syncDiscovery(root){
 (root||document).querySelectorAll('[data-ig-audience-values]').forEach(function(node){
  var ok=allowedAudience(node.getAttribute('data-ig-audience-values'));
  node.hidden=!ok;
  if(ok)node.removeAttribute('aria-hidden');else node.setAttribute('aria-hidden','true');
 });
}
function blockedCopy(){
 var en=String(document.documentElement.lang||'').toLowerCase().indexOf('en')===0;
 return en?
  {title:'Not shown in this view',body:'This section is not part of the '+stageName()+' view.',home:'Back to home'}:
  {title:'No se muestra en esta vista',body:'Esta sección no forma parte de la vista '+stageName()+'.',home:'Volver a Inicio'};
}
function syncPageGate(){
 var body=document.body;if(!body)return;
 var list=values(body.getAttribute('data-ig-page-audience')),blocked=list.length&&!allowedAudience(list);
 body.toggleAttribute('data-ig-audience-blocked',blocked);
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
 apply();window.dispatchEvent(new CustomEvent('ig:audience-change',{detail:{stage:current,safetyMode:mode()}}));return true;
}
function clear(){current='default';try{sessionStorage.removeItem(KEY);}catch(_){}apply();window.dispatchEvent(new CustomEvent('ig:audience-change',{detail:{stage:current,safetyMode:mode()}}));}
function mount(root){
 root=root||document;root.querySelectorAll('[data-ig-audience-picker]').forEach(function(picker){
  if(picker.dataset.igAudienceReady)return;picker.dataset.igAudienceReady='true';
  picker.addEventListener('click',function(event){var btn=event.target.closest('[data-ig-audience-stage]');if(btn&&picker.contains(btn))set(btn.getAttribute('data-ig-audience-stage'));});
  syncPicker(picker);
 });syncDiscovery(root);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){mount();apply();},{once:true});else{mount();apply();}
new MutationObserver(function(){document.querySelectorAll('[data-ig-audience-picker]').forEach(syncPicker);syncPageGate();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
window.IGAudience=Object.freeze({get:function(){return current;},set:set,clear:clear,mode:mode,isAdult:isAdult,isSafe:function(){return !isAdult();},allowedAudience:allowedAudience,mount:mount,refresh:apply});
})();