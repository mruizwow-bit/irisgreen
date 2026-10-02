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
  if(q==='es'||q==='en'){
    document.documentElement.lang=q;
    localStorage.setItem('ig_lang',q);
  }
}catch(_){}
})();
