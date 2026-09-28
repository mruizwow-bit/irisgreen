/* R42 A8 · catalogue renderer. Safe mode never receives S2.
   Adult mode may add S2 catalogue cards from the adult metadata index; full
   bodies still load only after explicit action on the destination page. */
(function(){
'use strict';
function start(){
 var root=document.querySelector('[data-ig-catalog]');if(!root||root.dataset.igCatalogReady)return;
 root.dataset.igCatalogReady='true';var api=window.IGSearch;if(!api)return;
 var situation=root.dataset.igCatalog==='situations',query=root.querySelector(situation?'#situationsSearch':'#q');
 var group=root.querySelector(situation?'.situations-filter-row':'#filtros'),az=situation?null:root.querySelector('#az');
 var counter=root.querySelector(situation?'#situationsCount':'#cuenta'),empty=root.querySelector(situation?'#situationsEmpty':'#ig-search-empty');
 var reset=root.querySelector('[data-ig-catalog-reset]'),retry=root.querySelector('[data-ig-catalog-retry]'),failure=root.querySelector('[data-ig-catalog-error]');
 var list=root.querySelector('.cards'),original=Array.from(list.querySelectorAll('a.card')),cards=new Map(original.map(function(c){return[api.path(c.href),c];}));
 var params=new URLSearchParams(location.search),kindParam=situation?'area':'tipo';
 var state={q:params.get('q')||'',kind:params.get(kindParam)||'',letter:situation?'':params.get('letra')||''},entries=[],ready=false,loading=false;query.value=state.q;
 function lang(){return document.documentElement.lang.indexOf('en')===0?'en':'es';}
 function letter(e){return api.norm(e.indexKey||e.name).charAt(0).toLocaleUpperCase(lang()==='en'?'en':'es');}
 function kind(e){return situation?(e.area||''):(e.tipo||e.area||'');}
 function busy(on){root.setAttribute('aria-busy',String(on));}
 function controls(enabled){query.disabled=!enabled;group.querySelectorAll('button').forEach(function(b){b.disabled=!enabled;});if(az)az.querySelectorAll('button').forEach(function(b){b.disabled=!enabled;});}
 function pickValue(b){return situation?(b.dataset.filter==='*'?'':b.dataset.filter):(b.dataset.type||'');}
 function cardFor(e){
  var v=api.localize(e,lang()),key=api.path(v.url),existing=cards.get(key);if(existing)return existing;
  var a=document.createElement('a');a.className='card';a.href=v.url;
  if(Array.isArray(v.age_bands)&&v.age_bands.length)a.setAttribute('data-ig-age-bands',v.age_bands.join(' '));
  if(situation&&v.area)a.dataset.area=v.area;
  var chip=document.createElement('span');chip.className='chip';chip.textContent=kind(v)||v.kind||'';
  var strong=document.createElement('strong');strong.textContent=v.name;
  var span=document.createElement('span');span.textContent=v.hint||v.full||'';
  a.append(chip,strong,span);cards.set(key,a);return a;
 }
 function paint(){
  if(!ready)return;var q=state.q.trim(),source=q?api.rank(entries,q,lang()):entries.map(function(e){return api.localize(e,lang());});
  var found=source.filter(function(e){return(!state.kind||kind(e)===state.kind)&&(!state.letter||letter(e)===state.letter);});
  var urls=new Set(found.map(function(e){return api.path(e.url);})),fragment=document.createDocumentFragment();
  found.forEach(function(e){var c=cardFor(e);c.hidden=false;fragment.appendChild(c);});
  cards.forEach(function(c,key){if(!urls.has(key)){if(situation){c.hidden=true;fragment.appendChild(c);}else{c.remove();}}});
  list.appendChild(fragment);
  var n=found.length,word=situation?(n===1?(lang()==='en'?'situation':'situación'):(lang()==='en'?'situations':'situaciones')):(n===1?(lang()==='en'?'entry':'ficha'):(lang()==='en'?'entries':'fichas'));
  counter.textContent=q?n+(n===1?(lang()==='en'?' result for “':' resultado para «'):(lang()==='en'?' results for “':' resultados para «'))+q+(lang()==='en'?'”':'»'):n+' '+word;
  if(state.kind)counter.textContent+=' · '+state.kind;if(state.letter)counter.textContent+=' · '+state.letter;
  empty.hidden=n!==0;reset.hidden=!(state.q||state.kind||state.letter);
  group.querySelectorAll('button').forEach(function(b){var on=pickValue(b)===state.kind;b.setAttribute('aria-pressed',String(on));b.classList.toggle('is-active',on);});
  if(az)az.querySelectorAll('button').forEach(function(b){b.setAttribute('aria-pressed',String((b.dataset.letter||'')===state.letter));});
 }
 function load(){
  if(loading)return;loading=true;controls(true);busy(true);failure.hidden=true;
  api.load().then(function(data){
   entries=data.filter(function(e){var p=api.path(e.url);return situation?p.indexOf('/situations/')>=0||p.indexOf('/situaciones/')>=0:p.indexOf('/conditions/')>=0||p.indexOf('/condiciones/')>=0;});
   var kinds=new Set(entries.map(kind));if(state.kind&&!kinds.has(state.kind))state.kind='';ready=true;loading=false;busy(false);paint();
  }).catch(function(error){loading=false;busy(false);controls(false);failure.hidden=false;empty.hidden=true;console.warn('[Iris Green]',error.message);});
 }
 query.addEventListener('input',function(){state.q=query.value;if(ready)paint();else load();});
 group.addEventListener('click',function(e){var b=e.target.closest('button');if(b&&group.contains(b)&&!b.disabled){state.kind=pickValue(b);if(ready)paint();else load();}});
 if(az)az.addEventListener('click',function(e){var b=e.target.closest('button[data-letter]');if(b&&!b.disabled){state.letter=b.dataset.letter;if(ready)paint();else load();}});
 reset.addEventListener('click',function(){state={q:'',kind:'',letter:''};query.value='';paint();query.focus();});retry.addEventListener('click',load);
 window.addEventListener('ig:audience-change',function(){ready=false;entries=[];load();});
 load();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();