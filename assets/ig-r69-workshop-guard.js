/* R69 · Workshop fallback guard.
   The canonical R42 workspace is loaded with normal defer ordering. The legacy
   study stays hidden while JavaScript is available. Reveal it only if the final
   workspace did not mount by the window load event, so a slow device never sees
   old UI followed by new UI. */
(function(){
  'use strict';
  function check(){
    var body=document.body,main=document.querySelector('main#main');
    if(!body||body.dataset.igR69Workshop!=='1'||!main)return;
    if(!main.classList.contains('ig42-active')){
      body.dataset.igR69WorkshopFallback='1';
      var status=document.getElementById('igt-status');
      if(status) status.textContent=document.documentElement.lang.startsWith('en')
        ? 'The enhanced workspace could not start. The basic studio is available.'
        : 'El espacio de trabajo mejorado no ha podido iniciarse. Está disponible el estudio básico.';
    }
  }
  if(document.readyState==='complete')check();
  else window.addEventListener('load',check,{once:true});
})();