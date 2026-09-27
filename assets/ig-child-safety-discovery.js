/* Iris Green R42 · adult-only discovery metadata for S2 catalogue entries.
   Safe/default HTML contains no S2 cards. This script fetches only safe metadata
   after an explicit Adult selection; it never fetches full S2 bodies. */
(function(){
'use strict';
var policy=window.IGChildSafety;if(!policy)return;
var surface=document.body&&document.body.dataset.igChildSafetyCatalog;if(!surface)return;
var main=document.querySelector('main');if(!main)return;
var lang=String(document.documentElement.lang||'es').toLowerCase().startsWith('en')?'en':'es';
var T=lang==='en'
 ? {label:'Content for…',all:'Any age',child:'Children',teen:'Teenagers',adult:'Adults',heading:'Sensitive content',intro:'These entries are shown only after choosing Adults. They open with a safer summary first.',loading:'Loading sensitive-content summaries…'}
 : {label:'Contenido para…',all:'Cualquier edad',child:'Infancia',teen:'Adolescencia',adult:'Adultez',heading:'Contenido sensible',intro:'Estas entradas aparecen solo después de elegir Adultez. Primero abren un resumen seguro.',loading:'Cargando resúmenes de contenido sensible…'};
var wrap=document.createElement('section');wrap.className='ig-discovery-safety';wrap.setAttribute('aria-label',T.label);
wrap.innerHTML='<div class="ig-s2-toolbar"><label><span>'+T.label+'</span><select data-ig-audience-select><option value="all">'+T.all+'</option><option value="child">'+T.child+'</option><option value="teen">'+T.teen+'</option><option value="adult">'+T.adult+'</option></select></label><p class="ig-s2-status" role="status" aria-live="polite"></p></div><div data-ig-adult-s2-catalog hidden></div>';
main.insertBefore(wrap,main.firstChild);
var select=wrap.querySelector('select'),region=wrap.querySelector('[data-ig-adult-s2-catalog]'),status=wrap.querySelector('[role=status]');
var cache=null,pending=null;
function esc(v){return String(v||'').replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];});}
function load(){
 if(cache)return Promise.resolve(cache);
 if(pending)return pending;
 status.textContent=T.loading;
 pending=fetch('/assets/content-safety/s2-discovery-routes.json',{cache:'no-cache'}).then(function(r){if(!r.ok)throw new Error(String(r.status));return r.json();}).then(function(data){cache=Array.isArray(data.records)?data.records:[];return cache;}).finally(function(){status.textContent='';});
 return pending;
}
function render(){
 var adult=policy.getAudience()==='adult';
 region.hidden=!adult;
 if(!adult){region.replaceChildren();return;}
 load().then(function(rows){
   if(policy.getAudience()!=='adult')return;
   var selected=rows.filter(function(r){return r.lang===lang&&r.surface===surface;});
   var section=document.createElement('section');section.className='ig-adult-s2-section';
   section.innerHTML='<h2>'+esc(T.heading)+'</h2><p>'+esc(T.intro)+'</p><div class="cards" data-ig-adult-s2-cards></div>';
   var cards=section.querySelector('[data-ig-adult-s2-cards]');
   selected.forEach(function(r){
     var a=document.createElement('a');a.className='card ig-s2-adult-card';a.href=r.route+'/';
     a.innerHTML='<strong>'+esc(r.title)+'</strong>'+(r.summary?'<span>'+esc(r.summary)+'</span>':'');
     cards.appendChild(a);
   });
   region.replaceChildren(section);
 }).catch(function(){region.replaceChildren();});
}
select.addEventListener('change',function(){policy.setAudience(select.value);render();});
window.addEventListener('ig:audience-change',function(){select.value=policy.getAudience()==='default'?'all':policy.getAudience();render();});
policy.setAudience('all');render();
})();