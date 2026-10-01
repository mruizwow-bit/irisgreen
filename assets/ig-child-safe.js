/* R42 child-safe deep-link controller. Full S2 is never fetched automatically. */
(function(){
'use strict';
function lang(){return document.documentElement.lang.indexOf('en')===0?'en':'es';}
function labels(){return lang()==='en'?{full:'View full information',loading:'Loading full information…',error:'The full information could not be loaded.'}:{full:'Ver información completa',loading:'Cargando información completa…',error:'No se ha podido cargar la información completa.'};}
function parse(html){var t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild;}
var pageState=null,researchSafe=new Map();
function enhancePage(){
 var article=document.querySelector('article[data-ig-s2-safe]');if(!article)return;
 if(!pageState){var id=article.getAttribute('data-ig-s2-id')||'';pageState={safe:article.outerHTML,full:false,url:id?('/assets/safety/full/'+id+'-'+lang()+'.html'):''};}
 var holder=article.querySelector('[data-ig-s2-actions]');if(!holder)return;holder.replaceChildren();
 if(!window.IGAudience||!window.IGAudience.isAdult())return;
 var b=document.createElement('button');b.type='button';b.className='ig-s2-full-button';b.textContent=labels().full;
 b.addEventListener('click',function(){if(!pageState.url||pageState.full)return;b.disabled=true;b.textContent=labels().loading;fetch(pageState.url,{credentials:'same-origin',cache:'no-cache'}).then(function(r){if(!r.ok)throw new Error(String(r.status));return r.text();}).then(function(html){var next=parse(html);if(!next)throw new Error('empty');article.replaceWith(next);pageState.full=true;var h=next.querySelector('h1');if(h){h.tabIndex=-1;h.focus();}}).catch(function(){b.disabled=false;b.textContent=labels().full;var s=document.createElement('p');s.role='status';s.textContent=labels().error;holder.appendChild(s);});});
 holder.appendChild(b);
}
function enhanceResearch(){
 document.querySelectorAll('article[data-ig-research-s2]').forEach(function(article){
  var id=article.getAttribute('data-ig-research-s2');if(!id)return;if(!researchSafe.has(id))researchSafe.set(id,article.innerHTML);
  var holder=article.querySelector('[data-ig-research-s2-actions]');if(!holder)return;
  var key=lang()+':'+Boolean(window.IGAudience&&window.IGAudience.isAdult());
  if(holder.dataset.igActionsKey===key)return;holder.dataset.igActionsKey=key;holder.replaceChildren();
  if(!window.IGAudience||!window.IGAudience.isAdult())return;
  var b=document.createElement('button');b.type='button';b.className='ig-s2-full-button';b.textContent=labels().full;
  b.addEventListener('click',function(){b.disabled=true;b.textContent=labels().loading;fetch('/assets/safety/full/'+id+'-'+lang()+'.html',{credentials:'same-origin',cache:'no-cache'}).then(function(r){if(!r.ok)throw new Error(String(r.status));return r.text();}).then(function(html){article.innerHTML=html;article.dataset.igResearchFull='true';var h=article.querySelector('h2');if(h){h.tabIndex=-1;h.focus();}}).catch(function(){b.disabled=false;b.textContent=labels().full;});});
  holder.appendChild(b);
 });
}
function restore(){
 if(window.IGAudience&&window.IGAudience.isAdult())return;
 if(pageState&&pageState.full){var cur=document.querySelector('article[data-ig-s2-full]');if(cur){cur.replaceWith(parse(pageState.safe));pageState.full=false;}}
 document.querySelectorAll('article[data-ig-research-full=true]').forEach(function(article){var id=article.getAttribute('data-ig-research-s2'),safe=researchSafe.get(id);if(safe){article.innerHTML=safe;delete article.dataset.igResearchFull;}});
}
function sync(){restore();enhancePage();enhanceResearch();}
function start(){sync();new MutationObserver(enhanceResearch).observe(document.body,{childList:true,subtree:true});window.addEventListener('ig:audience-change',sync);new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();