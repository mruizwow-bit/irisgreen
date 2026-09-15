(function(){
'use strict';
/* Prosa de Rutinas visuales en dos idiomas. La herramienta (rótulos, formatos y
   hojas) ya se traduce en assets/rutinas-visuales.js; esto traduce el texto de
   la página, que antes se quedaba en español al pasar a EN. */
var T={
  es:{
    crumb:'Recursos gratuitos',
    kicker:'Recursos gratuitos · apoyo visual',
    h1:'Rutinas visuales',
    lede:'Una rutina lista para usar y un constructor para hacer la tuya. El texto siempre acompaña al pictograma. No hay una rutina correcta: puedes cambiar el orden, quitar pasos o usar solo texto.',
    note1:'La rutina «Por la mañana» usa los mismos ocho pasos en pantalla, A4, tira para la nevera y «Primero → Después». Las hojas A4 tienen una sola columna y un máximo de cinco pasos por hoja.',
    ready:'Por la mañana',
    builder:'Constructor de rutinas',
    note2:'Elige pictogramas, cambia el texto, ordena con botones y usa el formato que necesites. La biblioteca contiene 93 símbolos Mulberry en once categorías. No se arrastra nada y no hace falta una cuenta.',
    licenseIntro:'Pictogramas: Mulberry Symbols, © Steve Lee, CC BY-SA 4.0 · ',
    licenseLink:'Licencia',
    licenseEnd:'. Los pictogramas son apoyo: el texto permanece siempre visible.'
  },
  en:{
    crumb:'Free resources',
    kicker:'Free resources · visual support',
    h1:'Visual routines',
    lede:'A ready-made routine and a builder to make your own. The text always goes with the symbol. There is no correct routine: you can change the order, remove steps or use text only.',
    note1:'The “Morning” routine uses the same eight steps on screen, on A4, on the fridge strip and in “First → Then”. A4 sheets have a single column and a maximum of five steps per sheet.',
    ready:'Morning',
    builder:'Routine builder',
    note2:'Choose symbols, change the text, reorder with buttons and use the format you need. The library holds 93 Mulberry symbols in eleven categories. Nothing is dragged and no account is needed.',
    licenseIntro:'Symbols: Mulberry Symbols, © Steve Lee, CC BY-SA 4.0 · ',
    licenseLink:'Licence',
    licenseEnd:'. The symbols are support: the text always stays visible.'
  }
};

function apply(lang){
  var t=T[lang]||T.es;
  var set=function(id,value){var el=document.getElementById(id);if(el)el.textContent=value;};
  set('rv-crumb',t.crumb);
  set('rv-kicker',t.kicker);
  set('rv-h1',t.h1);
  set('rv-lede',t.lede);
  set('rv-note-1',t.note1);
  set('rv-note-2',t.note2);
  set('ready-title',t.ready);
  set('builder-title',t.builder);
  var lic=document.getElementById('rv-license');
  if(lic){
    lic.innerHTML='';
    lic.appendChild(document.createTextNode(t.licenseIntro));
    var site=document.createElement('a');
    site.href='https://mulberrysymbols.org';
    site.textContent='mulberrysymbols.org';
    lic.appendChild(site);
    lic.appendChild(document.createTextNode('. '));
    var license=document.createElement('a');
    license.href='/assets/mulberry-rutinas/LICENSE-MULBERRY.txt';
    license.textContent=t.licenseLink;
    lic.appendChild(license);
    lic.appendChild(document.createTextNode(t.licenseEnd));
  }
  document.title=(lang==='en'?'Visual routines':'Rutinas visuales')+' · '+(lang==='en'?'Free resources':'Recursos gratuitos')+' · Iris Green';
}

function start(){
  if(window.IG_IDIOMA)window.IG_IDIOMA.on(apply);
  else document.addEventListener('ig:idioma',function(e){apply(e.detail.lang);});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
else start();
})();
