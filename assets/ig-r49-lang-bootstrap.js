/* R49 · language bootstrap for bilingual single-route applications.
   Runs during parsing, before deferred UI runtimes mount. */
(function(){
'use strict';
try{
  document.documentElement.dataset.igR49Js='1';
  var audience='default';
  try{
    var saved=sessionStorage.getItem('ig-audience-stage-v1');
    if(['children','teenagers','adults','any'].indexOf(saved)!==-1)audience=saved;
  }catch(_){}
  document.documentElement.dataset.igAudience=audience;
  document.documentElement.dataset.igSafetyMode=audience==='adults'?'adult-explicit':'safe-by-default';
  var q=new URLSearchParams(location.search).get('lang');
  if(q==='es'||q==='en'){
    document.documentElement.lang=q;
    localStorage.setItem('ig_lang',q);
  }
}catch(_){}
})();