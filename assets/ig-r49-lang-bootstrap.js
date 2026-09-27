/* R49 · language bootstrap for bilingual single-route applications.
   Runs during parsing, before deferred UI runtimes mount. */
(function(){
'use strict';
try{
  var q=new URLSearchParams(location.search).get('lang');
  if(q!=='es'&&q!=='en')return;
  document.documentElement.lang=q;
  localStorage.setItem('ig_lang',q);
}catch(_){}
})();