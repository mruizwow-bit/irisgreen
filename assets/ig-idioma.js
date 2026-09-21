(function(){
'use strict';
/* Un solo control de idioma por página, siempre en la cabecera.
   Guarda la elección para la pestaña, avisa a la herramienta de la página y
   mantiene sincronizados los conmutadores propios que ya existían dentro del
   contenido (Rutinas visuales), que quedan ocultos. */
var KEY='ig_lang';
var LEGACY_KEY='ig-idioma';
var listeners=[];
var current=null;

function valid(lang){return lang==='es'||lang==='en';}
function stored(){
  try{
    var v=localStorage.getItem(KEY);
    if(valid(v)){sessionStorage.removeItem(LEGACY_KEY);return v;}
    var legacy=sessionStorage.getItem(LEGACY_KEY);
    if(valid(legacy)){
      localStorage.setItem(KEY,legacy);
      sessionStorage.removeItem(LEGACY_KEY);
      return legacy;
    }
    sessionStorage.removeItem(LEGACY_KEY);
    return null;
  }catch(e){return null;}
}
function persist(lang){
  if(!valid(lang))return;
  try{localStorage.setItem(KEY,lang);}catch(e){}
  try{sessionStorage.removeItem(LEGACY_KEY);}catch(e){}
}

function chips(){return Array.prototype.slice.call(document.querySelectorAll('[data-ig-lang]'));}

/* Páginas con ruta propia por idioma (hreflang recíproco): el conmutador
   navega a la pareja en vez de traducir la página a medias. */
function alternates(){
  var map={};
  Array.prototype.forEach.call(document.querySelectorAll('link[rel="alternate"][hreflang]'),function(l){
    var lang=(l.getAttribute('hreflang')||'').slice(0,2);
    if(lang==='es'||lang==='en')map[lang]=l.getAttribute('href');
  });
  return map;
}

function samePage(href){
  try{return new URL(href,location.href).pathname===location.pathname;}catch(e){return false;}
}

function paint(){
  chips().forEach(function(b){
    var on=b.getAttribute('data-ig-lang')===current;
    b.setAttribute('aria-pressed',String(on));
    if(b.classList.contains('lang'))b.classList.toggle('on',on);
  });
}

function syncLegacy(){
  ['[data-ready-lang="','[data-builder-lang="','[data-lang="'].forEach(function(prefix){
    var b=document.querySelector(prefix+current+'"]');
    if(b&&b.getAttribute('aria-pressed')!=='true')b.click();
  });
}

function set(lang){
  if(lang!=='es'&&lang!=='en')return;
  current=lang;
  persist(lang);
  paint();
  syncLegacy();
  listeners.forEach(function(fn){try{fn(lang);}catch(e){}});
  document.dispatchEvent(new CustomEvent('ig:idioma',{detail:{lang:lang}}));
}

/* Un clic en el conmutador: si la página tiene ruta propia para ese idioma,
   se va a ella; si no, se cambia aquí mismo. Navegar solo ocurre por clic. */
function choose(lang){
  if(lang!=='es'&&lang!=='en')return;
  var alt=alternates();
  if(alt[lang]&&!samePage(alt[lang])){
    persist(lang);
    location.assign(alt[lang]);
    return;
  }
  set(lang);
}

window.IG_IDIOMA={
  get:function(){return current||stored()||'es';},
  set:set,
  choose:choose,
  stored:stored,
  on:function(fn){listeners.push(fn);if(current)fn(current);}
};

function init(){
  var pageLang=(document.documentElement.lang||'es').indexOf('en')===0?'en':'es';
  /* En una página con ruta propia por idioma manda la página, no lo guardado:
     así nadie aterriza en la versión española con el conmutador en inglés. */
  var hasAlternates=Object.keys(alternates()).length>0;
  var remembered=stored();
  current=hasAlternates?pageLang:(remembered||pageLang);
  chips().forEach(function(b){
    b.addEventListener('click',function(){choose(b.getAttribute('data-ig-lang'));});
  });
  paint();
  /* Las herramientas de la página se inicializan en su propio DOMContentLoaded:
     el primer aviso se manda después, para que ya estén escuchando. */
  setTimeout(function(){
    paint();
    syncLegacy();
    listeners.forEach(function(fn){try{fn(current);}catch(e){}});
    document.dispatchEvent(new CustomEvent('ig:idioma',{detail:{lang:current}}));
  },0);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
})();
