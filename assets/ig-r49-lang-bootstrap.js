/* R67 · canonical language + AGE bootstrap for the global shell. */
(function(){
'use strict';
try{
  document.documentElement.dataset.igR49Js='1';
  var age='GENERAL';
  try{
    var current=sessionStorage.getItem('ig-age-band-v2');
    var legacy=sessionStorage.getItem('ig-audience-stage-v1');
    var allowed=['AGE_0_12','AGE_13_17','AGE_18_PLUS','ALL_AGES'];
    var map={children:'AGE_0_12',teenagers:'AGE_13_17',adults:'AGE_18_PLUS',any:'ALL_AGES'};
    if(allowed.indexOf(current)!==-1)age=current;
    else if(map[legacy])age=map[legacy];
  }catch(_){}
  document.documentElement.dataset.igAudience=age;
  document.documentElement.dataset.igAgeBand=age;
  document.documentElement.dataset.igSafetyMode=age==='AGE_18_PLUS'?'adult-explicit':'safe-by-default';
  var q=new URLSearchParams(location.search).get('lang');
  var docLang=String(document.documentElement.lang||'').toLowerCase().split('-',1)[0];
  var lang=(q==='es'||q==='en')?q:((docLang==='es'||docLang==='en')?docLang:null);
  if(lang){
    document.documentElement.lang=lang;
    localStorage.setItem('ig_lang',lang);
  }
}catch(_){}
})();
