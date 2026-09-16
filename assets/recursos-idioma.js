(function(){
'use strict';
var T={
  es:{
    kicker:'Para usar directamente',title:'Recursos gratuitos',lede:'Herramientas prácticas para usar en pantalla, imprimir o adaptar a tu manera. No hace falta crear una cuenta.',crumb:'Inicio',
    pills:['Sin registro','En pantalla','Para imprimir'],toolsTitle:'Elige lo que necesitas',toolsText:'Esta familia irá creciendo sin mezclarla con El Taller: aquí están las herramientas para usar.',next:'Se añadirán más recursos aquí, manteniendo cada herramienta separada y fácil de encontrar.',
    cards:[
      ['Juegos','Jugar','Juegos interactivos y una colección de actividades para entender situaciones, comunicar lo que necesitas y probar apoyos.','Abrir Jugar'],
      ['Apoyo visual','Rutinas visuales','Usa una rutina ya preparada o crea una secuencia propia con texto y pictogramas para pantalla, A4, tira o Primero → Después.','Abrir Rutinas'],
      ['Comunicación','Tarjeta Iris','Escribe qué te cuesta, qué te ayuda y qué necesitas. Tres formas de tarjeta, pictogramas opcionales, para copiar o imprimir en A4.','Crear una tarjeta']
    ]
  },
  en:{
    kicker:'Ready to use',title:'Free resources',lede:'Practical tools to use on screen, print or adapt in your own way. No account is needed.',crumb:'Home',
    pills:['No sign-up','On screen','To print'],toolsTitle:'Choose what you need',toolsText:'This collection will keep growing without mixing it with The Workshop: these are ready-to-use tools.',next:'More resources will be added here, keeping each tool separate and easy to find.',
    cards:[
      ['Games','Play','Interactive games and a collection of activities to understand situations, say what you need and try out supports.','Open Play'],
      ['Visual support','Visual routines','Use a ready-made routine or create your own sequence with text and symbols for screen, A4, strip or First → Then.','Open routines'],
      ['Communication','Iris Card','Write what is hard for you, what helps and what you need. Three card shapes, optional symbols, to copy or print on A4.','Create a card']
    ]
  }
};
function set(id,value){var el=document.getElementById(id);if(el)el.textContent=value;}
function apply(lang){
  var t=T[lang]||T.es;document.documentElement.lang=lang;
  set('rg-kicker',t.kicker);set('rg-title',t.title);set('rg-lede',t.lede);set('rg-crumb',t.crumb);
  t.pills.forEach(function(v,i){set('rg-pill'+(i+1),v);});
  set('rg-tools-title',t.toolsTitle);set('rg-tools-text',t.toolsText);set('rg-next',t.next);
  t.cards.forEach(function(card,i){var n=i+1;set('rg-card'+n+'-label',card[0]);set('rg-card'+n+'-title',card[1]);set('rg-card'+n+'-text',card[2]);set('rg-card'+n+'-cta',card[3]);});
}
function start(){if(window.IG_IDIOMA)window.IG_IDIOMA.on(apply);else document.addEventListener('ig:idioma',function(e){apply(e.detail.lang);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
