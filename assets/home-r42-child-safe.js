(function(){
'use strict';
function lang(){return document.documentElement.lang.indexOf('en')===0?'en':'es';}
function text(){return lang()==='en'?{no:'No results. Try another word.',found:'results'}:{no:'No hay resultados. Prueba con otra palabra.',found:'resultados'};}
function resultNode(item){var a=document.createElement('a');a.className='ig-home-result';a.href=item.url;var h=document.createElement('strong');h.textContent=item.name;var p=document.createElement('span');p.textContent=item.hint||item.full||'';a.append(h,p);return a;}
function start(){
 var form=document.querySelector('[data-ig-home-search]'),input=form&&form.querySelector('input[type=search]'),suggestions=document.querySelector('[data-ig-home-suggestions]'),results=document.querySelector('[data-ig-home-results]'),status=document.querySelector('[data-ig-home-search-status]');
 if(form&&input&&window.IGSearch){
  var seq=0;
  function showSuggestions(){var ticket=++seq,q=input.value.trim();suggestions.replaceChildren();if(q.length<2)return;window.IGSearch.load().then(function(items){if(ticket!==seq)return;window.IGSearch.rank(items,q,lang()).slice(0,6).forEach(function(x){suggestions.appendChild(resultNode(window.IGSearch.localize(x,lang())));});});}
  input.addEventListener('input',showSuggestions);
  form.addEventListener('submit',function(e){e.preventDefault();var q=input.value.trim();if(!q)return;var ticket=++seq;results.replaceChildren();status.textContent=lang()==='en'?'Searching…':'Buscando…';window.IGSearch.search(q,{intentional:true,lang:lang()}).then(function(hits){if(ticket!==seq)return;var list=hits.slice(0,12);if(!list.length){status.textContent=text().no;return;}status.textContent=list.length+' '+text().found;list.forEach(function(x){results.appendChild(resultNode(window.IGSearch.localize(x,lang())));});});});
  window.addEventListener('ig:audience-change',function(){suggestions.replaceChildren();results.replaceChildren();status.textContent='';if(input.value.trim())showSuggestions();});
 }
 function syncHomeAgeCards(){
  if(!window.IGAudience)return;
  var stage=window.IGAudience.get(),strict=stage==='AGE_0_12'||stage==='AGE_13_17';
  document.querySelectorAll('.ig-home-v4-card').forEach(function(card){
   var bands=card.getAttribute('data-ig-age-bands');
   var visible=!window.IGAudience.childRouteBlocked(card.href)&&(bands?window.IGAudience.allowedAgeBands(bands):!strict);
   card.hidden=!visible;
   if(visible)card.removeAttribute('aria-hidden');else card.setAttribute('aria-hidden','true');
  });
 }
 function syncSafetyState(){
  if(!window.IGAudience)return;
  var adult=window.IGAudience.isAdult();
  document.querySelectorAll('[data-ig-home-safe]').forEach(function(n){n.hidden=adult;});
  document.querySelectorAll('[data-ig-home-adult]').forEach(function(n){n.hidden=!adult;});
 }
 function syncAgeSafety(){syncHomeAgeCards();syncSafetyState();}
 window.addEventListener('ig:audience-change',syncAgeSafety);
 syncAgeSafety();
 var dialog=document.getElementById('ig-home-settings'),openButtons=document.querySelectorAll('[data-ig-home-settings-open]'),close=dialog&&dialog.querySelector('[data-ig-home-settings-close]');
 function pref(){return window.IGPreferences;}
 function syncPrefs(){
  if(!dialog||!pref())return;var s=pref().get(),speech=pref().speechOn();
  dialog.querySelectorAll('[data-ig-home-pref]').forEach(function(b){var k=b.dataset.igHomePref;if(['spacing','controls','contrast','guide','motion'].indexOf(k)>=0)b.setAttribute('aria-pressed',String(Boolean(s[k])));if(k==='speak')b.setAttribute('aria-pressed',String(speech));});
  var out=dialog.querySelector('[data-ig-home-pref-size]');if(out)out.textContent=Math.round((s.scale||1)*100)+'%';
 }
 function speakPage(on){
  if(!('speechSynthesis' in window)||!pref())return;
  window.speechSynthesis.cancel();pref().setSpeech(on);
  if(!on){syncPrefs();return;}
  var main=document.getElementById('main'),value=main?main.innerText.trim():'';
  if(!value){pref().setSpeech(false);syncPrefs();return;}
  var utter=new SpeechSynthesisUtterance(value);utter.lang=lang()==='en'?'en':'es';utter.onend=utter.onerror=function(){pref().setSpeech(false);syncPrefs();};window.speechSynthesis.speak(utter);syncPrefs();
 }
 function mountAdvanced(){
  if(!dialog||!pref())return;
  var textHost=dialog.querySelector('[data-ig-home-text-options]');
  if(textHost&&!textHost.dataset.ready){textHost.dataset.ready='1';pref().mountTextOptions(textHost);}
  var transHost=dialog.querySelector('[data-ig-home-transparency-options]');
  if(transHost&&!transHost.dataset.ready){transHost.dataset.ready='1';pref().mountTransparencyOptions(transHost);}
 }
 if(dialog&&openButtons.length){
  openButtons.forEach(function(open){open.addEventListener('click',function(){document.dispatchEvent(new CustomEvent('ig:panel-opening',{detail:'reading'}));mountAdvanced();syncPrefs();if(dialog.showModal)dialog.showModal();else dialog.setAttribute('open','');openButtons.forEach(function(b){b.setAttribute('aria-expanded','true');});if(close)close.focus();});});
  if(close)close.addEventListener('click',function(){dialog.close?dialog.close():dialog.removeAttribute('open');});
  dialog.addEventListener('close',function(){openButtons.forEach(function(b){b.setAttribute('aria-expanded','false');});});
  dialog.addEventListener('click',function(e){var b=e.target.closest('[data-ig-home-pref]');if(!b||!pref())return;var k=b.dataset.igHomePref,s=pref().get();if(k==='size-down')pref().step(-1);else if(k==='size-up')pref().step(1);else if(k==='reset'){if('speechSynthesis' in window)window.speechSynthesis.cancel();pref().reset();}else if(k==='speak')speakPage(!pref().speechOn());else if(['spacing','controls','contrast','guide','motion'].indexOf(k)>=0){var patch={};patch[k]=!s[k];pref().update(patch);}syncPrefs();});
  dialog.addEventListener('cancel',function(){openButtons.forEach(function(b){b.setAttribute('aria-expanded','false');});});
 }
 document.addEventListener('ig:panel-opening',function(e){if(e.detail==='music'&&dialog&&dialog.open)dialog.close();});
 window.addEventListener('pagehide',function(){if('speechSynthesis' in window)window.speechSynthesis.cancel();});
 syncPrefs();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();