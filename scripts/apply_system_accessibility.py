#!/usr/bin/env python3
"""Apply a bounded accessibility addition. No catalogue, image or clinical text changes.
The existing system reduced-motion CSS is retained, not claimed as a new feature.
"""
import hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
REPORT=ROOT/'reports/system-accessibility';REPORT.mkdir(parents=True,exist_ok=True)
changes=[]

def save(path,old,new):
    if old!=new:(ROOT/path).write_text(new)
    changes.append({'path':path,'changed':old!=new,'before':hashlib.sha256(old.encode()).hexdigest(),'after':hashlib.sha256(new.encode()).hexdigest()})

def once(s,old,new):
    if new in s:return s
    assert s.count(old)==1,(old[:80],s.count(old))
    return s.replace(old,new,1)

path='assets/preferencias-lectura.js';old=(ROOT/path).read_text();s=old
s=once(s,'  var state = load();', '''  var state = load();
  // System preferences are observed, never written to the person's site settings.
  var systemMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var systemColors = window.matchMedia('(forced-colors: active)');
  function system() { return {reducedMotion:systemMotion.matches, forcedColors:systemColors.matches}; }
  function reduceMotion() { return state.motion || systemMotion.matches; }''')
s=once(s,'motion:state.motion, speak:speech','motion:state.motion, speak:speech, systemMotion:systemMotion.matches, systemColors:systemColors.matches')
s=once(s,"    return canStore ?", "    var message = canStore ?")
needle="      (english ? 'Settings work on this page, but this browser cannot save them.' : 'Los ajustes funcionan en esta página, pero este navegador no permite guardarlos.');"
s=once(s,needle,needle+'''
    if (systemMotion.matches) message += english ? ' Your device also has reduced motion enabled; Reset keeps respecting it.' : ' Tu dispositivo también tiene activada la reducción de movimiento; Restablecer sigue respetándola.';
    if (systemColors.matches) message += english ? ' Your device’s forced colour palette is active.' : ' Está activa la paleta de colores forzados de tu dispositivo.';
    return message;''')
s=once(s,"root.dataset.igMotion = state.motion ? 'off' : '';", "root.dataset.igMotion = reduceMotion() ? 'off' : '';\n    root.dataset.igSystemMotion = systemMotion.matches ? 'reduce' : '';\n    root.dataset.igSystemColors = systemColors.matches ? 'forced' : '';")
s=once(s,"body.classList.toggle('rm', state.motion);", "body.classList.toggle('rm', reduceMotion());")
s=once(s,"  window.addEventListener('storage', function (event) {",'''  [systemMotion, systemColors].forEach(function (query) {
    if (query.addEventListener) query.addEventListener('change', notify);
    else if (query.addListener) query.addListener(notify);
  });
  window.addEventListener('storage', function (event) {''')
s=once(s,'window.IGPreferences = {get:copy,','window.IGPreferences = {get:copy, system:system,')
save(path,old,s)

path='assets/preferencias-lectura.css';old=(ROOT/path).read_text();s=old
extra='''
/* System adjustments supplement the brand, not a diagnosis-specific overlay.
   Underlining is an additional non-colour cue; it does not change button size. */
html[data-ig-preferences="2"] :is(.ig-filter-button,.secfind button[data-type],.secfind button[data-letter],.situation-filter,#temaFilters .filter,.catbuttons button,.vd-filters button,[data-ig-reading-panel] button)[aria-pressed="true"],
html[data-ig-preferences="2"] [role="tab"][aria-selected="true"],
html[data-ig-preferences="2"] header a[aria-current="page"]{
 text-decoration-line:underline!important;text-decoration-thickness:.12em!important;text-underline-offset:.18em!important;
}
html[data-ig-preferences="2"] main :is(p,li,.valor) a:not([role="button"]):not(.bajar){text-decoration:underline;text-underline-offset:.18em}
@media(prefers-reduced-motion:reduce){
 *,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
}
@media(forced-colors:active){
 /* Never opt out of the user's palette with forced-color-adjust:none. */
 html[data-ig-preferences="2"] :is(main,header,footer,#ig-music-panel,[data-ig-reading-panel]){
  background-color:Canvas!important;color:CanvasText!important;border-color:CanvasText!important;box-shadow:none!important;
 }
 html[data-ig-preferences="2"] :is(.secfind,.situations-filter,.ig-search-shell,main article,main .card,main .glass){background-color:Canvas!important;border-color:CanvasText!important;box-shadow:none!important}
 html[data-ig-preferences="2"] :is(main,header,footer,#ig-music-panel,[data-ig-reading-panel]) :is(button,[role="button"],summary){
  background-color:ButtonFace!important;background-image:none!important;color:ButtonText!important;border-color:ButtonText!important;box-shadow:none!important;
 }
 html[data-ig-preferences="2"] :is(main,#ig-music-panel,[data-ig-reading-panel]) :is(input,select,textarea){background:Canvas!important;color:CanvasText!important;border-color:CanvasText!important}
 html[data-ig-preferences="2"] :is(main,header,footer) a{color:LinkText!important}
 html[data-ig-preferences="2"] :is(#a11y,[data-ig-reading-panel],#ig-music-panel) :is(p,span,strong,h2,h3,label){color:CanvasText!important}
 html[data-ig-preferences="2"] :is(button,a,input,select,textarea,summary):focus-visible{outline:3px solid Highlight!important;outline-offset:3px!important}
 html[data-ig-preferences="2"] :is(button,[role="button"]):disabled{color:GrayText!important;border-color:GrayText!important;opacity:1!important}
 html[data-ig-preferences="2"] :is(button[aria-pressed="true"],[role="tab"][aria-selected="true"]){border-color:Highlight!important;text-decoration-line:underline!important}
 html[data-ig-preferences="2"] :is(#rguide,#ig-guide){background:transparent!important;border-block:2px solid Highlight!important}
}
'''
if extra not in s:s+=extra
save(path,old,s)

path='assets/interfaz-comun.js';old=(ROOT/path).read_text();s=old
extra='''
/* Uncover keyboard focus without moving a floating player or rebuilding the page.
   A panel is collapsed only when it actually overlaps focus outside that panel.
   Collapsing music must not stop the user's current track. */
(function(){
 'use strict';
 var pending=0;
 function visible(el){return el&&!el.hidden&&el.getClientRects().length;}
 function overlaps(a,b){return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;}
 function protect(){
  pending=0;
  var target=document.activeElement;
  if(!target||target===document.body||!target.getClientRects().length)return;
  var rect=target.getBoundingClientRect();
  document.querySelectorAll('#ig-music-panel,[data-ig-reading-panel]').forEach(function(p){
   if(!visible(p)||p.contains(target)||!overlaps(rect,p.getBoundingClientRect()))return;
   if(p.id==='ig-music-panel')document.dispatchEvent(new CustomEvent('ig:uncover-focus',{detail:'music'}));
   else if(window.IGReading)window.IGReading.close(false);
  });
  var header=document.querySelector('header.ig-menu-open');
  if(header&&!header.contains(target)){
   header.classList.remove('ig-menu-open');
   var menu=header.querySelector('.ig-menu-button');if(menu)menu.setAttribute('aria-expanded','false');
  }
  var top=0;
  document.querySelectorAll('header').forEach(function(h){
   var position=getComputedStyle(h).position, box=h.getBoundingClientRect();
   if(!h.contains(target)&&visible(h)&&(position==='fixed'||position==='sticky')&&box.top<=1&&overlaps(rect,box))top=Math.max(top,box.bottom);
  });
  if(top>0&&rect.top<top+8)window.scrollBy({top:rect.top-top-12,left:0,behavior:'instant'});
  var guide=document.getElementById('rguide')||document.getElementById('ig-guide');
  rect=target.getBoundingClientRect();
  if(visible(guide)&&overlaps(rect,guide.getBoundingClientRect())){
   var height=guide.getBoundingClientRect().height;
   var next=rect.bottom+6;
   if(next+height>window.innerHeight)next=Math.max(0,rect.top-height-6);
   guide.style.top=next+'px';
  }
 }
 document.addEventListener('focusin',function(){
  if(pending)cancelAnimationFrame(pending);
  pending=requestAnimationFrame(protect);
 });
})();
'''
if extra not in s:s+=extra
save(path,old,s)
path='assets/musica.js';old=(ROOT/path).read_text();s=old
needle="  document.addEventListener('ig:panel-opening',function(e){if(e.detail==='reading'&&open)close(false);});"
s=once(s,needle,needle+"\n  document.addEventListener('ig:uncover-focus',function(e){if(e.detail==='music'&&open)close(false);});")
save(path,old,s)

path='es/lectura-accesible/index.html';old=(ROOT/path).read_text();s=old
a=s.index('<main id="main">');b=s.index('</main>',a)+len('</main>')
s=s[:a]+'''<main id="main">
<p class="crumb"><a href="/">Inicio</a></p>
<h1>Lectura accesible</h1>
<p class="lede">Abre Lectura en la cabecera para ajustar la presentación. Puedes combinar las opciones y volver a la vista original. Aquí se explica qué hacen los controles disponibles y qué limitaciones quedan.</p>
<h2>Qué hace cada botón</h2>
<section class="sec"><h3>A− y A+ · Tamaño del texto</h3><p>Cambian el tamaño del contenido entre el 100 %, 115 %, 130 % y 150 %. El porcentaje indica el valor elegido y el botón se desactiva al llegar a su límite. La cabecera y los paneles flotantes no se amplían con este ajuste. También puedes usar el zoom de tu navegador.</p></section>
<section class="sec"><h3>Letra más separada</h3><p>Aumenta a la vez el espacio entre letras, palabras y líneas. Es una única opción: todavía no hay cuatro controles independientes de espaciado.</p></section>
<section class="sec"><h3>Botones más grandes</h3><p>Aumenta los controles de texto preparados para este ajuste. No agranda las zonas superpuestas sobre las ilustraciones, porque podrían taparse entre sí. En Vera y el mapa de casa puedes abrir «Usar botones en lugar de tocar la imagen».</p></section>
<section class="sec"><h3>Más contraste</h3><p>Refuerza el texto y los fondos de lectura sin aplicar un filtro de color a las fotografías o ilustraciones. No es un selector de temas completos ni garantiza que todos los elementos gráficos estén adaptados.</p></section>
<section class="sec"><h3>Guía de lectura</h3><p>Muestra una banda que sigue al puntero. Si el foco del teclado coincide con la banda, esta se aparta del control. La guía todavía no dispone de controles propios para colocarla con teclado o mediante botones táctiles.</p></section>
<section class="sec"><h3>Leer en voz alta</h3><p>Activa la función de voz disponible en la página. En las fichas de texto se inicia al pulsar un fragmento; algunas páginas interactivas utilizan un texto de lectura preparado. Desactiva el botón para detenerla. Esta función no sustituye a un lector de pantalla y todavía no ofrece pausa, continuación ni velocidad.</p><p>Se utiliza el servicio de voz que ofrece el navegador. Algunas voces pueden utilizar servicios remotos: no se garantiza que el procesamiento de todo texto sea local. Recargar o cambiar de página no inicia una voz por haber guardado otras preferencias.</p></section>
<section class="sec"><h3>Reducir movimiento</h3><p>Desactiva las animaciones y transiciones de la página controladas por sus estilos. Si tu dispositivo solicita reducir movimiento, la web lo respeta aunque esta opción propia esté desactivada. El panel indica cuándo está activa esa preferencia del dispositivo. Este ajuste no controla la reproducción dentro de servicios de vídeo externos.</p></section>
<section class="sec"><h3>Restablecer</h3><p>Reinicia únicamente las preferencias de lectura de Iris Green. No borra los favoritos ni el idioma elegido. Sigue respetando la reducción de movimiento y los colores forzados de tu dispositivo.</p></section>
<h2>Guardar los ajustes</h2>
<p>Las preferencias de presentación se guardan en este navegador y se recuperan al cambiar entre las páginas conectadas al sistema de lectura. No se necesita una cuenta. Si el navegador no permite guardarlas, funcionan en la página actual y el panel avisa de esa limitación. Borrar los datos del sitio o utilizar otro navegador puede hacer que tengas que elegirlas de nuevo.</p>
<h2>Colores y controles seleccionados</h2>
<p>Los filtros compartidos seleccionados llevan el texto subrayado, además del cambio de color. Cuando el navegador activa una paleta de colores forzados, se utilizan sus colores para controles, campos y paneles. No hace falta activar un «modo para daltonismo». La revisión de información transmitida por el color en todos los gráficos y juegos no está terminada.</p>
<h2>Música y teclado</h2>
<p>Música abre un reproductor pequeño abajo a la derecha. No comienza a sonar hasta que pulsas Escuchar. Puedes cerrarlo con Escape o con su botón de cierre. Si el reproductor o el panel de Lectura tapa un control que recibe el foco del teclado fuera del panel, se recoge para dejarlo visible. Recoger el reproductor no detiene una pista que ya hayas iniciado; vuelve a abrir Música para pausarla.</p>
<h2>Alcance de las comprobaciones</h2>
<p>Se han realizado pruebas técnicas de controles y navegación en un navegador de prueba, en tamaños de escritorio y móvil, y con preferencias del dispositivo emuladas. No equivalen a haber probado cada dispositivo, cada voz o cada combinación de ajustes.</p>
<p>Quedan pendientes pruebas con personas que utilizan lectores de pantalla, líneas braille y control por voz. También quedan por ampliar tipografías, espaciados independientes, guía táctil, temas completos, lectura en voz alta avanzada y alternativas textuales de algunos materiales. No se declara una certificación completa WCAG.</p>
<h2>Informar de una dificultad</h2>
<p>Escribe a <a href="mailto:informacion@irisgreen.eu?subject=Dificultad%20de%20accesibilidad">informacion@irisgreen.eu</a> indicando la página, qué intentabas hacer, el navegador o dispositivo y los ajustes utilizados. No necesitas aportar un diagnóstico.</p>
</main>'''+s[b:]
s=s.replace('El panel de lectura accesible está en todas las páginas: tamaño del texto, letra más separada, botones más grandes, más contraste, guía de lectura, leer en voz alta y reducir movimiento.','Cómo utilizar los ajustes de lectura, conservar las preferencias y conocer las comprobaciones y limitaciones de accesibilidad de Iris Green.')
save(path,old,s)
(REPORT/'changes.json').write_text(json.dumps({'files':changes,'notes':['The original CSS already respected prefers-reduced-motion.','OS choices are not persisted as site settings.','Catalogue data and illustrations are outside this change.','Scientific sources are not reviewed in this accessibility batch.']},ensure_ascii=False,indent=2)+'\n')
print(json.dumps(changes,ensure_ascii=False))
