/* Iris Green R42 · life-stage lens. Session-only, explicit choice, no DOB/account/profile. */
(function(){
'use strict';
if(window.IGAudience)return;
var KEY='ig-audience-stage-v1', VALUES=['children','teenagers','adults','any'], current='default';
try{var saved=sessionStorage.getItem(KEY);if(VALUES.indexOf(saved)!==-1)current=saved;}catch(_){}
function mode(){return current==='adults'?'adult':'safe';}
function isAdult(){return current==='adults';}
function allowedAudience(values){
 values=Array.isArray(values)?values:[];
 if(!values.length)return true;
 if(values.indexOf('TRANSVERSAL')!==-1)return true;
 if(current==='children')return values.indexOf('INFANCIA')!==-1;
 if(current==='teenagers')return values.indexOf('ADOLESCENCIA')!==-1;
 if(current==='adults')return values.indexOf('ADULTEZ')!==-1;
 if(current==='default'||current==='any')return false;
 return false;
}
function syncPicker(root){
 root.querySelectorAll('[data-ig-audience-stage]').forEach(function(btn){
  btn.setAttribute('aria-pressed',String(btn.getAttribute('data-ig-audience-stage')===current));
 });
 var status=root.querySelector('[data-ig-audience-status]');
 if(status){var en=document.documentElement.lang.indexOf('en')===0;var names=en?{default:'Safe by default',children:'Children',teenagers:'Teenagers',adults:'Adults',any:'Any age'}:{default:'Protección por defecto',children:'Infancia',teenagers:'Adolescencia',adults:'Adultez',any:'Cualquier edad'};status.textContent=names[current]||names.default;}
}
function apply(){
 document.documentElement.dataset.igAudience=current;
 document.documentElement.dataset.igSafetyMode=isAdult()?'adult-explicit':'safe-by-default';
 document.querySelectorAll('[data-ig-audience-picker]').forEach(syncPicker);
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
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){mount();apply();},{once:true});else{mount();apply();}
new MutationObserver(function(){document.querySelectorAll('[data-ig-audience-picker]').forEach(syncPicker);}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
window.IGAudience=Object.freeze({get:function(){return current;},set:set,clear:clear,mode:mode,isAdult:isAdult,isSafe:function(){return !isAdult();},allowedAudience:allowedAudience,mount:mount});
})();