/* Iris Green · Juegos en sala · S0 runtime wiring.
   Direct route: one existing engine + one split pack. No catalogue/index/storage. */
(function(){
'use strict';
var root=document.getElementById('jg-app');
if(!root)return;
var slug=root.getAttribute('data-room-game')||'';
var game=window.IG_JUEGO&&window.IG_JUEGO[slug];
var lang=(document.documentElement.lang||'es').indexOf('en')===0?'en':'es';
var back=root.getAttribute('data-back-href')||(lang==='en'?'/en/resources/games/':'/es/recursos/juegos/');
if(!game){
 root.innerHTML='<p role="alert">'+(lang==='en'?'This game could not be loaded.':'No se ha podido cargar este juego.')+'</p>';
 return;
}
var staticTitle=document.getElementById('room-static-title');
if(staticTitle)staticTitle.remove();
/* S0 deliberately carries only the four visual records used by this pack.
   The complete pictogram catalogue is not a runtime dependency of the room route. */
var pictos={
 armario:["mulberry98/cupboard.svg","Armario","Wardrobe"],
 papelera:["pictos-objetos/papelera.svg","Papelera","Waste bin"],
 lamparaobj:["mulberry98/lamp.svg","Lámpara","Lamp"],
 nevera:["mulberry98/fridge.svg","Nevera","Fridge"]
};
window.IG_JUEGOS_DATA={
 cats:[{id:"casa",l:{es:"Casa",en:"Home"}}],
 etapas:[{id:"todas",l:{es:"Cualquier edad",en:"Any age"}}],
 tipos:[{id:"memoria",l:{es:"Memoria",en:"Memory"}}],
 juegos:[game],
 links:{},
 pictos:pictos,
 atrib:{
  es:"Pictogramas: Mulberry Symbols, © Garry Paxton 2008-2017 y © Steve Lee 2018-2026, licencia CC BY-SA 4.0 · mulberrysymbols.org. Otros dibujos: Iris Green.",
  en:"Pictograms: Mulberry Symbols, © Garry Paxton 2008-2017 and © Steve Lee 2018-2026, CC BY-SA 4.0 licence · mulberrysymbols.org. Other drawings: Iris Green."
 },
 marca:"IRIS GREEN · irisgreen.eu"
};
try{
 if(!/^#juego-/.test(location.hash)){
  history.replaceState(null,'',location.pathname+location.search+'#juego-'+encodeURIComponent(slug));
 }
}catch(_){}
/* In direct-room mode the shared engine's "back/choose another" actions leave
   the isolated route instead of opening even a one-item catalogue. */
document.addEventListener('click',function(e){
 if(!root.contains(e.target))return;
 var b=e.target.closest&&e.target.closest('[data-k]');
 if(!b)return;
 var k=b.getAttribute('data-k');
 if(k!=='volver'&&k!=='otro'&&k!=='otro2')return;
 e.preventDefault();
 e.stopImmediatePropagation();
 location.assign(back);
},true);
})();
