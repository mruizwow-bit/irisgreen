/* Iris Green R42 · safe search contract.
   Autocomplete/catalog loads never include S2 in safe mode.
   Intentional submit may add safe S2 variants. Adults use the adult catalog,
   but full S2 bodies remain separate and require explicit action on the page. */
(function(){
'use strict';
if(window.IGSearch)return;
var pending=new Map(),equivalencias=null;
var stopEs=new Set('no me con el la que de del a y o en un una lo los las al se su mi te les nos por para es son ser estoy esta este eso hay muy mas pero si ya cuando donde como todo toda'.split(' '));
var stopEn=new Set('i me my the a an and or of to in on for with is are am be been being this that these those it its at as from by can could would should do does did have has had'.split(' '));
function norm(v){return String(v==null?'':v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();}
function language(v){v=String(v||document.documentElement.lang||'es').toLowerCase();return v.indexOf('en')===0?'en':'es';}
function path(v){try{return new URL(v,location.origin).pathname.replace(/\/+$/,'')||'/';}catch(_){return '';}}
function forms(w){w=norm(w);if(!w)return[];var out=[w];function add(x){if(x.length>=3&&out.indexOf(x)<0)out.push(x);}if(w.length>4&&/s$/.test(w))add(w.slice(0,-1));if(w.length>4&&/es$/.test(w))add(w.slice(0,-2));if(w.length>4&&/ces$/.test(w))add(w.slice(0,-3)+'z');return out;}
function same(a,b){var aa=forms(a),bb=forms(b);return aa.some(function(x){return bb.indexOf(x)>=0;});}
function close(a,b){a=norm(a);b=norm(b);if(a===b)return true;if(Math.min(a.length,b.length)<5||Math.abs(a.length-b.length)>1)return false;if(a.length===b.length){var d=[];for(var i=0;i<a.length;i++)if(a[i]!==b[i])d.push(i);return d.length===1||(d.length===2&&d[1]===d[0]+1&&a[d[0]]===b[d[1]]&&a[d[1]]===b[d[0]]);}var s=a.length<b.length?a:b,l=a.length<b.length?b:a,i=0,j=0,k=0;while(i<s.length&&j<l.length){if(s[i]===l[j]){i++;j++;}else{if(++k>1)return false;j++;}}return true;}
function toLegacy(r){
 if(r&&typeof r.t==='string'&&typeof r.u==='string')return r;
 return {id:r.id,s:r.surface==='condition'?'Condición':'Situación',t:r.title_es||'',u:r.url_es||'',d:r.summary_es||'',a:r.area_or_type_es||'',tipo:r.area_or_type_es||'',age_bands:r.age_bands||[],sensitivity:r.sensitivity||'S0_GENERAL',discovery:r.discovery||'NORMAL',safe_variant_group:r.safe_variant_group||null,en:{s:r.surface==='condition'?'Condition':'Situation',t:r.title_en||r.title_es||'',u:r.url_en||r.url_es||'',d:r.summary_en||r.summary_es||'',a:r.area_or_type_en||r.area_or_type_es||''}};
}
function raw(item){return item&&item._raw?item._raw:item;}
function localizedRaw(item,lang){
 var r=raw(item)||{};if(language(lang)!=='en'||!r.en||typeof r.en!=='object')return r;
 return Object.assign({},r,{s:r.en.s||r.s,t:r.en.t||r.t,u:r.en.u||r.u,d:r.en.d||r.d,a:Object.prototype.hasOwnProperty.call(r.en,'a')?r.en.a:r.a,indexKey:r.en.indexKey||r.en.t||r.indexKey||r.t});
}
function prepare(input){var r=toLegacy(input||{}),d=String(r.d||r.full||r.hint||''),n=String(r.t||r.name||''),k=Array.isArray(r.k)?r.k.join(' '):String(r.k||''),txt=norm([n,r.indexKey||'',k,d,r.a||r.area||'',r.tipo||''].join(' '));return Object.assign({},r,{name:n,kind:r.s||r.kind||'',url:r.u||r.url||'',full:d,hint:d.length>120?d.slice(0,117).replace(/[\s,;:.]+$/,'')+'…':d,k:k,indexKey:r.indexKey||n,area:r.a||r.area||'',_title:norm(n),_text:txt,_words:txt.split(' ').filter(Boolean),_raw:r});}
function localize(item,lang){return prepare(localizedRaw(item,lang));}
function tokens(q,lang){var all=norm(q).split(/\s+/).filter(Boolean),stop=language(lang)==='en'?stopEn:stopEs,use=all.filter(function(w){return !stop.has(w);});return use.length?use:all;}
function equivalents(w,lang){if(!equivalencias)return[];var table=equivalencias[language(lang)]||{},fs=forms(w);for(var i=0;i<fs.length;i++)if(table[fs[i]])return table[fs[i]];return[];}
function rank(items,q,lang){
 var words=tokens(q,lang);if(!words.length)return items.map(function(x){return localize(x,lang);});var phrase=norm(q);
 return items.map(function(item,index){var v=localize(item,lang),score=0,cov=0;words.forEach(function(w){if(v._text.indexOf(w)>=0){score+=v._title.indexOf(w)>=0?2:1;cov+=1;return;}if(v._words.some(function(x){return same(x,w);})){score+=1;cov+=1;return;}if(v._words.some(function(x){return forms(x).some(function(a){return forms(w).some(function(b){return close(a,b);});});})){score+=.5;cov+=.5;return;}if(equivalents(w,lang).some(function(e){return v._words.some(function(x){return same(x,e);});})){score+=.5;cov+=.5;}});if(score&&v._title===phrase)score+=100;return{item:v,score:score,fit:cov/words.length,index:index};}).filter(function(x){return x.score>0;}).sort(function(a,b){return b.fit-a.fit||b.score-a.score||a.index-b.index;}).map(function(x){return x.item;});
}
function allowed(r){if(!window.IGAudience)return true;return window.IGAudience.allowedAgeBands(r.age_bands||[]);}
function sourceFor(intentional){if(window.IGAudience&&window.IGAudience.isAdult())return['/assets/safety/search-adult-full-catalog.json'];return intentional?['/assets/safety/search-safe-default.json','/assets/safety/search-intentional-safe.json']:['/assets/safety/search-safe-default.json'];}
function loadEquiv(items){return fetch('/assets/buscador-equivalencias.json',{cache:'no-cache'}).then(function(r){return r.ok?r.json():null;}).then(function(d){equivalencias=d;return items;}).catch(function(){return items;});}
function load(options){
 options=options||{};var intentional=!!options.intentional,stage=window.IGAudience&&window.IGAudience.get?window.IGAudience.get():'default',key=stage+':'+(window.IGAudience&&window.IGAudience.isAdult()?'adult':'safe')+(intentional?':intentional':':normal');
 if(pending.has(key))return pending.get(key);
 var paths=sourceFor(intentional),p=Promise.all(paths.map(function(src){return fetch(src,{cache:'no-cache'}).then(function(r){if(!r.ok)throw new Error('Search index '+r.status);return r.json();});})).then(function(groups){var seen=new Set(),out=[];groups.flat().forEach(function(r){if(!r||!r.url_es)return;var k=path(r.url_es);if(seen.has(k)||!allowed(r))return;seen.add(k);out.push(prepare(r));});return loadEquiv(out);}).catch(function(e){pending.delete(key);throw e;});pending.set(key,p);return p;
}
function search(query,options){options=options||{};return load({intentional:true}).then(function(items){return rank(items,query,options.lang);});}
window.addEventListener('ig:audience-change',function(){pending.clear();});
window.IGSearch=Object.freeze({load:load,search:search,rank:rank,norm:norm,path:path,prepare:prepare,localize:localize,stem:function(w){var f=forms(w);return f.length>1?f[f.length-1]:(f[0]||'');},formas:forms});
})();