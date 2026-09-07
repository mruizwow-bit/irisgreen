/* Un catálogo por sección; el índice sigue siendo buscador.json, compartido con Home. */
(function(){
'use strict';
function start(){
 var root=document.querySelector('[data-ig-catalog]');if(!root||root.dataset.igCatalogReady)return;
 root.dataset.igCatalogReady='true';var api=window.IGSearch;if(!api)return;
 var situation=root.dataset.igCatalog==='situations',query=root.querySelector(situation?'#situationsSearch':'#q');
 var group=root.querySelector(situation?'.situations-filter-row':'#filtros'),az=situation?null:root.querySelector('#az');
 var counter=root.querySelector(situation?'#situationsCount':'#cuenta'),empty=root.querySelector(situation?'#situationsEmpty':'#ig-search-empty');
 var reset=root.querySelector('[data-ig-catalog-reset]'),retry=root.querySelector('[data-ig-catalog-retry]'),failure=root.querySelector('[data-ig-catalog-error]');
 var list=root.querySelector('.cards'),original=Array.from(list.querySelectorAll('a.card'));
 var cards=new Map(original.map(function(c){return [api.path(c.href),c];}));
 var params=new URLSearchParams(location.search),kindParam=situation?'area':'tipo';
 var state={q:params.get('q')||'',kind:params.get(kindParam)||'',letter:situation?'':params.get('letra')||''};
 var entries=[],ready=false;query.value=state.q;
 function letter(e){return api.norm(e.indexKey||e.name).charAt(0).toLocaleUpperCase('es');}
 function kind(e){return situation?e.area:e.tipo;}
 function busy(on){root.setAttribute('aria-busy',String(on));query.disabled=on;group.querySelectorAll('button').forEach(function(b){b.disabled=on;});if(az)az.querySelectorAll('button').forEach(function(b){b.disabled=on;});}
 function pickValue(b){return situation?(b.dataset.filter==='*'?'':b.dataset.filter):b.dataset.type;}
 function paint(){
  if(!ready)return;
  var found=api.rank(entries,state.q).filter(function(e){return (!state.kind||kind(e)===state.kind)&&(!state.letter||letter(e)===state.letter);});
  var urls=new Set(found.map(function(e){return api.path(e.url);}));var fragment=document.createDocumentFragment();
  var ordered=state.q.trim()?found.map(function(e){return cards.get(api.path(e.url));}):original;
  ordered.forEach(function(c){c.hidden=!urls.has(api.path(c.href));fragment.appendChild(c);});
  if(state.q.trim())original.forEach(function(c){if(!urls.has(api.path(c.href))){c.hidden=true;fragment.appendChild(c);}});
  list.appendChild(fragment);
  var n=found.length,word=situation?(n===1?'situación':'situaciones'):(n===1?'ficha':'fichas');
  counter.textContent=state.q.trim()?n+(n===1?' resultado para «':' resultados para «')+state.q.trim()+'»':n+' '+word;
  if(state.kind)counter.textContent+=' · '+state.kind;if(state.letter)counter.textContent+=' · '+state.letter;
  empty.hidden=n!==0;reset.hidden=!(state.q||state.kind||state.letter);
  group.querySelectorAll('button').forEach(function(b){var on=pickValue(b)===state.kind;b.setAttribute('aria-pressed',String(on));b.classList.toggle('is-active',on);});
  if(az)az.querySelectorAll('button').forEach(function(b){b.setAttribute('aria-pressed',String((b.dataset.letter||'')===state.letter));});
  var u=new URL(location.href);[['q',state.q],[kindParam,state.kind],['letra',state.letter]].forEach(function(p){if(p[1])u.searchParams.set(p[0],p[1]);else u.searchParams.delete(p[0]);});
  try{history.replaceState(history.state,'',u.pathname+u.search+u.hash);sessionStorage.setItem(situation?'ig-situations-url':'ig-conditions-url',u.pathname+u.search);}catch(_){}
  root.dispatchEvent(new CustomEvent('ig:catalog-updated',{detail:{count:n,total:entries.length}}));
 }
 function load(){
  ready=false;busy(true);failure.hidden=true;counter.textContent='Cargando el buscador…';
  api.load().then(function(data){
   entries=data.filter(function(e){return cards.has(api.path(e.url));});
   if(entries.length!==cards.size)throw new Error('El catálogo y el índice no coinciden.');
   var kinds=new Set(entries.map(kind));if(!kinds.has(state.kind))state.kind='';
   if(az&&!entries.some(function(e){return letter(e)===state.letter;}))state.letter='';
   ready=true;busy(false);paint();
  }).catch(function(error){
   busy(false);query.disabled=true;group.querySelectorAll('button').forEach(function(b){b.disabled=true;});if(az)az.querySelectorAll('button').forEach(function(b){b.disabled=true;});
   counter.textContent=cards.size+(situation?' situaciones':' fichas');failure.hidden=false;empty.hidden=true;
   console.warn('[Iris Green]',error.message);
  });
 }
 query.addEventListener('input',function(){state.q=query.value;paint();});
 group.addEventListener('click',function(e){var b=e.target.closest('button');if(b&&group.contains(b)&&!b.disabled){state.kind=pickValue(b);paint();}});
 if(az)az.addEventListener('click',function(e){var b=e.target.closest('button[data-letter]');if(b&&!b.disabled){state.letter=b.dataset.letter;paint();}});
 reset.addEventListener('click',function(){state={q:'',kind:'',letter:''};query.value='';paint();query.focus();});
 retry.addEventListener('click',load);load();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
