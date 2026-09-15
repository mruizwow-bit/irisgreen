(function(){
'use strict';
/* Índice de Recursos en dos idiomas. Solo cambia sus propios textos:
   las páginas hijas llevan su propio idioma en la cabecera. */
var T={
  es:{
    kicker:'Para usar directamente',
    title:'Recursos gratuitos',
    lede:'Herramientas para usar, imprimir o probar sin crear una cuenta. Esta sección irá creciendo a medida que se añadan nuevos recursos.',
    crumb:'Inicio',
    cards:[
      ['Jugar','Juegos interactivos y una colección de actividades para entender situaciones, comunicar lo que necesitas y probar apoyos.'],
      ['Rutinas visuales','Una rutina preparada y un constructor para crear secuencias con texto y pictogramas, en pantalla o para imprimir.'],
      ['Tarjeta Iris','Escribe qué te cuesta, qué te ayuda y qué necesitas. Tres formas de tarjeta, pictogramas opcionales, para copiar o imprimir en A4.']
    ]
  },
  en:{
    kicker:'Ready to use',
    title:'Free resources',
    lede:'Tools to use, print or try out without creating an account. This section will grow as new resources are added.',
    crumb:'Home',
    cards:[
      ['Play','Interactive games and a collection of activities to understand situations, say what you need and try out supports.'],
      ['Visual routines','A ready-made routine and a builder for sequences with text and symbols, on screen or to print.'],
      ['Iris Card','Write what is hard for you, what helps and what you need. Three card shapes, optional symbols, to copy or print on A4.']
    ]
  }
};

function apply(lang){
  var t=T[lang]||T.es;
  document.documentElement.lang=lang;
  var set=function(id,value){var el=document.getElementById(id);if(el)el.textContent=value;};
  set('rg-kicker',t.kicker);
  set('rg-title',t.title);
  set('rg-lede',t.lede);
  set('rg-crumb',t.crumb);
  t.cards.forEach(function(card,i){
    set('rg-card'+(i+1)+'-title',card[0]);
    set('rg-card'+(i+1)+'-text',card[1]);
  });
}

function start(){
  if(window.IG_IDIOMA)window.IG_IDIOMA.on(apply);
  else document.addEventListener('ig:idioma',function(e){apply(e.detail.lang);});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
else start();
})();
