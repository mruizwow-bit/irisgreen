/* R42 A8 · adult-only metadata cards for two S2 Everyday-life entries.
   The JSON is requested only after an explicit Adults selection. */
(function(){
'use strict';
var loaded=false;
function lang(){return document.documentElement.lang.indexOf('en')===0?'en':'es';}
function render(){
 var section=document.querySelector('[data-ig-library-s2]'),list=section&&section.querySelector('[data-ig-library-s2-list]');if(!section||!list)return;
 if(!window.IGAudience||!window.IGAudience.isAdult()){section.hidden=true;list.replaceChildren();return;}
 section.hidden=false;if(loaded)return;
 fetch('/assets/safety/library-adult-s2.json',{cache:'no-cache'}).then(function(r){if(!r.ok)throw new Error(String(r.status));return r.json();}).then(function(rows){
  if(!window.IGAudience.isAdult())return;list.replaceChildren();rows.forEach(function(x){
   var a=document.createElement('a');a.className='card vd-card';a.href=lang()==='en'?x.url_en:x.url_es;
   var chip=document.createElement('span');chip.className='chip';chip.textContent=lang()==='en'?'High sensitivity':'Alta sensibilidad';
   var strong=document.createElement('strong');strong.textContent=lang()==='en'?x.title_en:x.title_es;
   var summary=document.createElement('span');summary.textContent=lang()==='en'?x.summary_en:x.summary_es;
   a.append(chip,strong,summary);list.appendChild(a);
  });loaded=true;
 }).catch(function(e){console.warn('[Iris Green]',e.message);});
}
function start(){render();window.addEventListener('ig:audience-change',function(){loaded=false;render();});new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();