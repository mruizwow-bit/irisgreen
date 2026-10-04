/* Iris Green · R42 Child Safety transversal
   Política de discovery y carga. No contiene clasificaciones: consume el manifest auditado.
   La lente es efímera en memoria. No pide ni persiste edad, identidad, cuenta o diagnóstico. */
(function(){
  'use strict';

  var AUDIENCES = ['default','child','teen','adult','all'];
  var current = 'default';
  var listeners = new Set();

  function normAudience(value){
    value=String(value||'default').toLowerCase();
    return AUDIENCES.indexOf(value)>=0?value:'default';
  }
  function sensitivity(entry){ return String(entry&&entry.sensitivity||'S0_GENERAL'); }
  function discovery(entry){ return String(entry&&entry.discovery||'NORMAL'); }
  function isS2(entry){ return sensitivity(entry)==='S2_HIGH_SENSITIVITY'; }
  function safeMode(audience){
    audience=normAudience(audience==null?current:audience);
    return audience==='default'||audience==='child'||audience==='teen'||audience==='all';
  }

  /* Discovery incidental: S2 nunca aparece en DEFAULT/INFANCIA/ADOLESCENCIA/CUALQUIER EDAD.
     En ADULTEZ se permite catálogo, manteniendo el contenido completo lazy. */
  function canDiscover(entry,audience){
    audience=normAudience(audience==null?current:audience);
    if(!isS2(entry)) return true;
    return audience==='adult';
  }

  /* Búsqueda/deep-link intencional: para modos seguros solo se puede resolver una safeVariant. */
  function resolveIntent(entry,audience){
    audience=normAudience(audience==null?current:audience);
    if(!isS2(entry)) return {kind:'normal',entry:entry};
    if(audience==='adult') return {kind:'adult-safe-first',entry:entry};
    return {kind:'safe-variant',entry:entry};
  }

  /* P0 R01: autodeclarar ADULTEZ nunca autoriza contenido restringido.
     La assurance adulta será una señal independiente y server-side en P1.
     Hasta entonces, todo S2 permanece SAFE_VARIANT_ONLY. */
  function hasAdultAssurance(){ return false; }
  function canAccessRestrictedAdultContent(){ return false; }
  function mayLoadFull(entry,opts){
    void entry; void opts;
    return false;
  }

  function filterDiscovery(rows,audience){
    return Array.isArray(rows)?rows.filter(function(row){return canDiscover(row,audience);}):[];
  }

  function purgeFull(root){
    root=root||document;
    root.querySelectorAll('[data-ig-s2-full]').forEach(function(node){node.remove();});
    root.querySelectorAll('[data-ig-s2-full-loaded="true"]').forEach(function(node){
      node.removeAttribute('data-ig-s2-full-loaded');
      node.removeAttribute('data-ig-s2-full-id');
    });
    try{window.dispatchEvent(new CustomEvent('ig:child-safety-purge-full'));}catch(_){}
  }

  function setAudience(value){
    var next=normAudience(value);
    var previous=current;
    current=next;
    if(next!=='adult'&&previous==='adult') purgeFull(document);
    document.documentElement.dataset.igAudience=next;
    listeners.forEach(function(fn){try{fn(next,previous);}catch(_){}});
    try{window.dispatchEvent(new CustomEvent('ig:audience-change',{detail:{audience:next,previous:previous}}));}catch(_){}
    return current;
  }

  function subscribe(fn){
    if(typeof fn!=='function') return function(){};
    listeners.add(fn);
    return function(){listeners.delete(fn);};
  }

  document.documentElement.dataset.igAudience=current;
  window.IGChildSafety={
    audiences:AUDIENCES.slice(),
    getAudience:function(){return current;},
    setAudience:setAudience,
    safeMode:safeMode,
    isS2:isS2,
    canDiscover:canDiscover,
    resolveIntent:resolveIntent,
    hasAdultAssurance:hasAdultAssurance,
    canAccessRestrictedAdultContent:canAccessRestrictedAdultContent,
    mayLoadFull:mayLoadFull,
    filterDiscovery:filterDiscovery,
    purgeFull:purgeFull,
    subscribe:subscribe
  };
})();