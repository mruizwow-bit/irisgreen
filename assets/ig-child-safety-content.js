/* Iris Green R42 · S2 safe route controller.
   The full body does not exist in the initial DOM. It is fetched only after
   ADULTEZ + an explicit "full information" action. */
(function(){
  'use strict';
  var main=document.querySelector('main[data-ig-s2-shell="true"]');
  if(!main) return;
  var policy=window.IGChildSafety;
  if(!policy) return;

  var lang=String(document.documentElement.lang||'es').toLowerCase().startsWith('en')?'en':'es';
  var id=main.getAttribute('data-ig-content-id');
  var safe=main.querySelector('[data-ig-s2-safe]');
  var host=main.querySelector('[data-ig-s2-full-host]');
  var select=main.querySelector('[data-ig-audience-select]');
  var fullButton=main.querySelector('[data-ig-load-full]');
  var status=main.querySelector('[data-ig-s2-status]');
  if(!id||!safe||!host||!select||!fullButton) return;

  var T=lang==='en'
    ? {loading:'Loading full information…',error:'Full information could not be loaded. The safer summary is still available.',full:'View full information'}
    : {loading:'Cargando la información completa…',error:'No se ha podido cargar la información completa. El resumen seguro sigue disponible.',full:'Ver información completa'};

  function audience(){return policy.getAudience();}
  function sync(){
    var adult=audience()==='adult';
    fullButton.hidden=!adult;
    fullButton.disabled=false;
    if(!adult && host.querySelector('[data-ig-s2-full]')){
      policy.purgeFull(main);
      safe.hidden=false;
      if(status) status.textContent='';
    }
    select.value=audience()==='default'?'all':audience();
  }
  select.addEventListener('change',function(){
    policy.setAudience(select.value);
    sync();
  });
  window.addEventListener('ig:audience-change',sync);
  window.addEventListener('ig:child-safety-purge-full',function(){
    host.replaceChildren();
    safe.hidden=false;
    sync();
  });

  fullButton.addEventListener('click',function(){
    var entry={sensitivity:'S2_HIGH_SENSITIVITY'};
    if(!policy.mayLoadFull(entry,{audience:audience(),explicitAction:true})) return;
    fullButton.disabled=true;
    if(status) status.textContent=T.loading;
    fetch('/assets/content/full/'+encodeURIComponent(id)+'.'+lang+'.json',{cache:'no-cache'})
      .then(function(r){if(!r.ok) throw new Error(String(r.status));return r.json();})
      .then(function(payload){
        if(audience()!=='adult') return;
        var wrapper=document.createElement('div');
        wrapper.setAttribute('data-ig-s2-full','');
        wrapper.innerHTML=String(payload.html||'');
        host.replaceChildren(wrapper);
        safe.hidden=true;
        main.setAttribute('data-ig-s2-full-loaded','true');
        main.setAttribute('data-ig-s2-full-id',id);
        if(status) status.textContent='';
        var focus=wrapper.querySelector('h1,h2,[tabindex]');
        if(focus){if(!focus.hasAttribute('tabindex'))focus.setAttribute('tabindex','-1');focus.focus();}
      })
      .catch(function(){
        safe.hidden=false;
        host.replaceChildren();
        if(status) status.textContent=T.error;
      })
      .finally(function(){fullButton.disabled=false;});
  });

  policy.setAudience('all');
  sync();
})();