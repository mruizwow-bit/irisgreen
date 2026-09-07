#!/usr/bin/env python3
"""Amplía el panel de presentación sin sustituir la identidad predeterminada.
La migración es idempotente y conserva las preferencias/versiones existentes.
"""
from pathlib import Path
import json

ROOT=Path(__file__).resolve().parents[1]
changes=[]

def once(text, old, new, name):
    if new in text:
        return text
    count=text.count(old)
    assert count==1, f'{name}: se esperó 1 ancla y hay {count}'
    changes.append(name)
    return text.replace(old,new,1)

js_path=ROOT/'assets/preferencias-lectura.js'
js=js_path.read_text()

# Aclaración pedida: el espaciado rápido sustituye los cuatro controles independientes.
js=js.replace(
"note:'Cada ajuste es independiente. No cambia el tamaño elegido, las imágenes ni la música. Las letras alternativas dependen de las fuentes disponibles en tu dispositivo.'",
"note:'Cada ajuste es independiente. El espaciado rápido sustituye las cuatro separaciones personalizadas; conserva la tipografía y la anchura. No cambia el tamaño elegido, las imágenes ni la música. Las letras alternativas dependen de las fuentes disponibles en tu dispositivo.'")
js=js.replace(
"note:'Each setting is independent. It does not change your chosen size, images or music. Alternative typefaces depend on the fonts available on your device.'",
"note:'Each setting is independent. Quick spacing replaces the four custom spacing values; it keeps your typeface and width. It does not change your chosen size, images or music. Alternative typefaces depend on the fonts available on your device.'")

presentation_code=r'''  var PRESENTATION_THEMES=['original','light','dark'];
  var GUIDE_POSITIONS=['upper','middle','lower'], GUIDE_HEIGHTS=['compact','medium','tall'];
  var GUIDE_HEIGHT_PX={compact:32,medium:46,tall:64};
  function presentationDefaults(){return {theme:'original',opaque:false,focus:false,guidePosition:'middle',guideHeight:'medium'};}
  function normalizePresentation(value){
    var p=presentationDefaults();if(!validObject(value))return p;
    if(PRESENTATION_THEMES.indexOf(value.theme)!==-1)p.theme=value.theme;
    p.opaque=value.opaque===true;p.focus=value.focus===true;
    if(GUIDE_POSITIONS.indexOf(value.guidePosition)!==-1)p.guidePosition=value.guidePosition;
    if(GUIDE_HEIGHTS.indexOf(value.guideHeight)!==-1)p.guideHeight=value.guideHeight;
    return p;
  }
  function guideHeightPixels(p){return GUIDE_HEIGHT_PX[(p||normalizePresentation(state.presentation)).guideHeight]||46;}
  function guideTopPixels(p){
    p=p||normalizePresentation(state.presentation);var h=guideHeightPixels(p),room=Math.max(0,window.innerHeight-h);
    var ratio=p.guidePosition==='upper'?.22:p.guidePosition==='lower'?.7:.45;
    return Math.round(room*ratio);
  }
  function mergePresentationPatch(next,patch){
    var p=normalizePresentation(next.presentation),source=validObject(patch.presentation)?patch.presentation:null;
    if(!source)return;
    ['theme','opaque','focus','guidePosition','guideHeight'].forEach(function(k){if(Object.prototype.hasOwnProperty.call(source,k))p[k]=source[k];});
    p=normalizePresentation(p);next.presentation=p;
    if(Object.prototype.hasOwnProperty.call(source,'guidePosition')||Object.prototype.hasOwnProperty.call(source,'guideHeight'))guideY=null;
  }
  var PRESENTATION_LABELS={
    es:{title:'Colores, guía y concentración',note:'La presentación original sigue siendo la predeterminada. Estos cambios son personales y no alteran fotografías ni ilustraciones.',theme:'Tema',themes:['Original','Claro','Oscuro'],opaque:'Fondo opaco',focus:'Vista centrada en el contenido',guide:'Guía de lectura',guideNote:'Puedes colocar la guía con botones o teclado. Elegir una posición o altura activa la guía.',positions:['Arriba','Centro','Abajo'],height:'Altura de la guía',heights:['Fina','Media','Alta'],reset:'Restablecer estas opciones'},
    en:{title:'Colours, guide and focus',note:'The original presentation remains the default. These changes are personal and do not alter photographs or illustrations.',theme:'Theme',themes:['Original','Light','Dark'],opaque:'Opaque background',focus:'Content-focused view',guide:'Reading guide',guideNote:'You can place the guide with buttons or the keyboard. Choosing a position or height turns the guide on.',positions:['Top','Centre','Bottom'],height:'Guide height',heights:['Thin','Medium','Tall'],reset:'Reset these options'}
  };
  function mountPresentationOptions(panel){
    if(!panel||panel.querySelector('[data-ig-presentation-settings]')){syncPresentationOptions();return;}
    var d=document.createElement('details');d.className='ig-presentation-settings';d.setAttribute('data-ig-presentation-settings','');
    var summary=document.createElement('summary');summary.setAttribute('data-ig-presentation-label','title');d.appendChild(summary);
    var note=document.createElement('p');note.className='ig-presentation-note';note.setAttribute('data-ig-presentation-label','note');d.appendChild(note);
    var themeLabel=document.createElement('label'),themeSpan=document.createElement('span'),theme=document.createElement('select');
    themeSpan.setAttribute('data-ig-presentation-label','theme');theme.dataset.igThemeSelect='';theme.id=(panel.id||'ig-reading')+'-theme';themeLabel.htmlFor=theme.id;themeLabel.className='ig-presentation-field';
    PRESENTATION_THEMES.forEach(function(value){var o=document.createElement('option');o.value=value;theme.appendChild(o);});theme.addEventListener('change',function(){update({presentation:{theme:theme.value}});});
    themeLabel.append(themeSpan,theme);d.appendChild(themeLabel);
    ['opaque','focus'].forEach(function(key){var b=document.createElement('button');b.type='button';b.className='ig-presentation-toggle';b.dataset.igPresentationToggle=key;b.setAttribute('aria-pressed','false');b.addEventListener('click',function(){var p=normalizePresentation(state.presentation);var patch={};patch[key]=!p[key];update({presentation:patch});});d.appendChild(b);});
    var guideBox=document.createElement('div');guideBox.className='ig-guide-settings';
    var guideTitle=document.createElement('strong');guideTitle.setAttribute('data-ig-presentation-label','guide');guideBox.appendChild(guideTitle);
    var guideNote=document.createElement('p');guideNote.setAttribute('data-ig-presentation-label','guideNote');guideBox.appendChild(guideNote);
    var positions=document.createElement('div');positions.className='ig-guide-positions';
    GUIDE_POSITIONS.forEach(function(pos){var b=document.createElement('button');b.type='button';b.dataset.igGuidePosition=pos;b.setAttribute('aria-pressed','false');b.addEventListener('click',function(){update({guide:true,presentation:{guidePosition:pos}});});positions.appendChild(b);});guideBox.appendChild(positions);
    var heightLabel=document.createElement('label'),heightSpan=document.createElement('span'),height=document.createElement('select');heightSpan.setAttribute('data-ig-presentation-label','height');height.dataset.igGuideHeight='';height.id=(panel.id||'ig-reading')+'-guide-height';heightLabel.htmlFor=height.id;heightLabel.className='ig-presentation-field';
    GUIDE_HEIGHTS.forEach(function(value){var o=document.createElement('option');o.value=value;height.appendChild(o);});height.addEventListener('change',function(){update({guide:true,presentation:{guideHeight:height.value}});});heightLabel.append(heightSpan,height);guideBox.appendChild(heightLabel);d.appendChild(guideBox);
    var resetButton=document.createElement('button');resetButton.type='button';resetButton.className='ig-presentation-reset';resetButton.setAttribute('data-ig-presentation-reset','');resetButton.setAttribute('data-ig-presentation-label','reset');resetButton.addEventListener('click',function(){update({presentation:presentationDefaults()});});d.appendChild(resetButton);
    var before=panel.querySelector('.ctrls')||panel.children[1]||null;panel.insertBefore(d,before);syncPresentationOptions();
  }
  function syncPresentationOptions(){
    var p=normalizePresentation(state.presentation),L=PRESENTATION_LABELS[textLanguage()];
    document.querySelectorAll('[data-ig-presentation-settings]').forEach(function(d){
      d.querySelectorAll('[data-ig-presentation-label]').forEach(function(n){n.textContent=L[n.dataset.igPresentationLabel];});
      var theme=d.querySelector('[data-ig-theme-select]');if(theme){theme.value=p.theme;Array.from(theme.options).forEach(function(o,i){o.textContent=L.themes[i];});}
      d.querySelectorAll('[data-ig-presentation-toggle]').forEach(function(b){var key=b.dataset.igPresentationToggle;b.textContent=L[key];b.setAttribute('aria-pressed',String(p[key]));});
      d.querySelectorAll('[data-ig-guide-position]').forEach(function(b){var index=GUIDE_POSITIONS.indexOf(b.dataset.igGuidePosition);b.textContent=L.positions[index];b.setAttribute('aria-pressed',String(state.guide&&p.guidePosition===b.dataset.igGuidePosition));});
      var height=d.querySelector('[data-ig-guide-height]');if(height){height.value=p.guideHeight;Array.from(height.options).forEach(function(o,i){o.textContent=L.heights[i];});}
    });
  }

'''
anchor="  function textLanguage(){return String(document.documentElement.lang).startsWith('en')?'en':'es';}\n"
js=once(js,anchor,presentation_code+anchor,'añadir opciones de presentación')

js=once(js,
"  function defaults() { return {version:VERSION, scale:1, spacing:false, controls:false, contrast:false, guide:false, motion:false}; }",
"  function defaults() { return {version:VERSION, scale:1, spacing:false, controls:false, contrast:false, guide:false, motion:false, presentation:presentationDefaults()}; }",
'defaults de presentación')
js=once(js,
"    var text=normalizeText(value.text);if(customText(text))out.text=text;\n    return out;",
"    var text=normalizeText(value.text);if(customText(text))out.text=text;\n    out.presentation=normalizePresentation(value.presentation);\n    return out;",
'normalizar presentación')
js=once(js,
"  function copy() { var c=Object.assign({},state);if(state.text)c.text=Object.assign({},state.text);return c; }",
"  function copy() { var c=Object.assign({},state);if(state.text)c.text=Object.assign({},state.text);if(state.presentation)c.presentation=Object.assign({},state.presentation);return c; }",
'copiar presentación')
js=once(js,
"    applyTextRoot(root);\n  }",
"    applyTextRoot(root);\n    var p=normalizePresentation(state.presentation);root.dataset.igTheme=p.theme;root.dataset.igOpaque=p.opaque?'on':'off';root.dataset.igFocus=p.focus?'on':'off';root.dataset.igGuidePosition=p.guidePosition;root.dataset.igGuideHeight=p.guideHeight;root.style.setProperty('--ig-guide-height',guideHeightPixels(p)+'px');\n  }",
'aplicar atributos de presentación')
js=once(js,
"      if (state.guide) guide.style.top = (guideY === null ? Math.round(window.innerHeight * .4) : guideY) + 'px';",
"      if (state.guide) { var p=normalizePresentation(state.presentation);guide.style.height=guideHeightPixels(p)+'px';guide.style.top=(guideY===null?guideTopPixels(p):guideY)+'px'; }",
'aplicar posición y altura de guía')
js=once(js,
"    mergeTextPatch(next,patch);\n    state = normalize(next); persist(); notify();",
"    mergeTextPatch(next,patch);mergePresentationPatch(next,patch);\n    state = normalize(next); persist(); notify();",
'guardar presentación')
js=once(js,
"    apply();\n  }\n  [systemMotion, systemColors].forEach",
"    mountTextOptions(panel);mountPresentationOptions(panel);apply();\n  }\n  [systemMotion, systemColors].forEach",
'montar opciones en panel estático')
js=once(js,
"    guideY = Math.max(0, Math.min(window.innerHeight - 46, event.clientY - 23));",
"    var h=guideHeightPixels(normalizePresentation(state.presentation));guideY = Math.max(0, Math.min(window.innerHeight - h, event.clientY - h/2));",
'guía con altura variable')
js=once(js,
"    speechOn:function(){return speech;}, connect:connect, changeComponent:changeComponent, apply:apply, mountTextOptions:mountTextOptions, getText:effectiveText};\n  new MutationObserver(syncTextOptions).observe",
"    speechOn:function(){return speech;}, connect:connect, changeComponent:changeComponent, apply:apply, mountTextOptions:mountTextOptions, mountPresentationOptions:mountPresentationOptions, getText:effectiveText, getPresentation:function(){return normalizePresentation(state.presentation);}};\n  new MutationObserver(function(){syncTextOptions();syncPresentationOptions();}).observe",
'exportar y sincronizar presentación')
js_path.write_text(js)

# El controlador compartido monta el nuevo bloque también en paneles dinámicos.
iface_path=ROOT/'assets/interfaz-comun.js';iface=iface_path.read_text()
iface=once(iface,
"    if(window.IGPreferences&&window.IGPreferences.mountTextOptions)window.IGPreferences.mountTextOptions(p);",
"    if(window.IGPreferences){if(window.IGPreferences.mountTextOptions)window.IGPreferences.mountTextOptions(p);if(window.IGPreferences.mountPresentationOptions)window.IGPreferences.mountPresentationOptions(p);}",
'montar presentación en panel dinámico')
iface_path.write_text(iface)

css_path=ROOT/'assets/preferencias-lectura.css';css=css_path.read_text()
css=css.replace('height:46px;pointer-events:none;z-index:70','height:var(--ig-guide-height,46px);pointer-events:none;z-index:55')
block=r'''

/* Personal presentation: the original brand remains the default. Images are
   never filtered or recoloured by these options. */
.ig-presentation-settings{margin:10px 0 14px;min-width:0;max-width:100%;border:1px solid #dfe6ef;border-radius:14px;padding:10px;background:rgba(246,248,251,.65);font:16px/1.5 "Atkinson Hyperlegible",system-ui,sans-serif;color:#17395c}
.ig-presentation-settings>summary{min-height:44px;cursor:pointer;font-weight:700;white-space:normal}
.ig-presentation-note,.ig-guide-settings p{font-size:14px!important;line-height:1.5!important;margin:8px 0!important;color:inherit!important}
.ig-presentation-field{display:block;margin:14px 0;min-width:0}.ig-presentation-field>span{display:block;margin-bottom:6px}
.ig-presentation-field select{display:block;box-sizing:border-box;width:100%;max-width:100%;min-height:44px;border:1px solid #738396;border-radius:10px;padding:8px;background:#fff;color:#17395c;font:inherit}
.ig-presentation-toggle,.ig-presentation-reset,.ig-guide-positions button{min-height:44px;border:1px solid #738396;border-radius:12px;background:#fff;color:#17395c;font:inherit;padding:10px;white-space:normal}
.ig-presentation-toggle,.ig-presentation-reset{display:block;width:100%;margin:8px 0}.ig-presentation-toggle[aria-pressed="true"]{text-decoration:underline;text-decoration-thickness:.12em;text-underline-offset:.18em;background:#eef4fa}
.ig-guide-settings{border-top:1px solid #dfe6ef;margin-top:14px;padding-top:14px}.ig-guide-positions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:10px 0}.ig-guide-positions button{min-width:0;padding-inline:6px}.ig-guide-positions button[aria-pressed="true"]{text-decoration:underline;text-decoration-thickness:.12em;background:#eef4fa}
.ig-presentation-settings :is(select,summary,button):focus-visible{outline:3px solid #5a49a8;outline-offset:2px}

html[data-ig-theme="light"]{color-scheme:light;--ig-theme-bg:#f5f8fb;--ig-theme-surface:#fff;--ig-theme-control:#fff;--ig-theme-text:#102f4b;--ig-theme-muted:#435268;--ig-theme-link:#145e8d;--ig-theme-border:#6d8194;--ig-theme-selected:#dcecf6}
html[data-ig-theme="dark"]{color-scheme:dark;--ig-theme-bg:#0d1d2b;--ig-theme-surface:#172c3e;--ig-theme-control:#20384b;--ig-theme-text:#f5f8fb;--ig-theme-muted:#d2dde7;--ig-theme-link:#8fd4ff;--ig-theme-border:#8ea2b3;--ig-theme-selected:#31556f}
html[data-ig-theme]:not([data-ig-theme="original"]) body{background:var(--ig-theme-bg)!important;background-image:none!important;color:var(--ig-theme-text)!important}
html[data-ig-theme]:not([data-ig-theme="original"]) :is(header,footer,#ig-music-panel,[data-ig-reading-panel]){background:var(--ig-theme-surface)!important;background-image:none!important;color:var(--ig-theme-text)!important;border-color:var(--ig-theme-border)!important;box-shadow:none!important}
html[data-ig-theme]:not([data-ig-theme="original"]) main{color:var(--ig-theme-text)!important}
html[data-ig-theme]:not([data-ig-theme="original"]) main :is(h1,h2,h3,h4,p,li,dt,dd,label){color:var(--ig-theme-text)!important}
html[data-ig-theme]:not([data-ig-theme="original"]) main :is(article,.card,.ficha,.secfind,.situations-filter,.ig-search-shell,.glass,.notice){background:var(--ig-theme-surface)!important;background-image:none!important;color:var(--ig-theme-text)!important;border-color:var(--ig-theme-border)!important;box-shadow:none!important}
html[data-ig-theme]:not([data-ig-theme="original"]) :is(main,header,footer,#ig-music-panel,[data-ig-reading-panel]) :is(button,select,input,textarea,summary){background:var(--ig-theme-control)!important;color:var(--ig-theme-text)!important;border-color:var(--ig-theme-border)!important}
html[data-ig-theme]:not([data-ig-theme="original"]) :is(main,header,footer,#ig-music-panel,[data-ig-reading-panel]) :is(a){color:var(--ig-theme-link)!important}
html[data-ig-theme]:not([data-ig-theme="original"]) :is(button[aria-pressed="true"],[role="tab"][aria-selected="true"]){background:var(--ig-theme-selected)!important;text-decoration-line:underline!important}
html[data-ig-theme="dark"] :is(.ig-text-settings,.ig-presentation-settings,.ig-text-preview,.ig-guide-settings){background:#172c3e!important;color:#f5f8fb!important;border-color:#8ea2b3!important}

html[data-ig-opaque="on"] body{background-image:none!important;background-color:var(--ig-theme-bg,#f5f8fb)!important}
html[data-ig-opaque="on"] :is(header,footer,#ig-music-panel,[data-ig-reading-panel],main article,main .card,main .ficha,main .secfind,main .situations-filter,main .ig-search-shell,main .glass,main .notice){backdrop-filter:none!important;-webkit-backdrop-filter:none!important;background-image:none!important;background-color:var(--ig-theme-surface,#fff)!important}

/* Content-focused view removes secondary site chrome only. Main content,
   in-page navigation, sources and safety information remain available. */
html[data-ig-focus="on"] :is(header .ig-uh-nav,header .nav,header .ig-menu-button,header .ico.menu,footer){display:none!important}
html[data-ig-focus="on"] :is(header,.ig-uh,.hd){min-height:0!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
html[data-ig-focus="on"] main :is(article,.card,.glass,.ficha){box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
html[data-ig-focus="on"] body{background-image:none!important}

@media(max-width:360px){.ig-guide-positions{grid-template-columns:1fr}.ig-presentation-settings{padding:9px}.ig-presentation-toggle,.ig-presentation-reset{padding-inline:8px}}
@media(forced-colors:active){.ig-presentation-settings,.ig-guide-settings{background:Canvas!important;color:CanvasText!important;border-color:CanvasText!important}.ig-presentation-settings :is(button,select){background:ButtonFace!important;color:ButtonText!important;border-color:ButtonText!important}.ig-presentation-settings :focus-visible{outline-color:Highlight!important}}
'''
if '/* Personal presentation: the original brand remains the default.' not in css:
    css += block
    changes.append('estilos de temas, fondo, guía y vista centrada')
css_path.write_text(css)

# Explicación pública: describe solo lo implementado y mantiene límites.
help_path=ROOT/'es/lectura-accesible/index.html';help_text=help_path.read_text()
help_text=help_text.replace(
'<section class="sec"><h3>Más contraste</h3><p>Refuerza el texto y los fondos de lectura sin aplicar un filtro de color a las fotografías o ilustraciones. No es un selector de temas completos ni garantiza que todos los elementos gráficos estén adaptados.</p></section>',
'<section class="sec"><h3>Más contraste</h3><p>Refuerza el texto y los fondos de lectura sin aplicar un filtro de color a las fotografías o ilustraciones. Además, en «Colores, guía y concentración» puedes elegir tema Claro u Oscuro y activar Fondo opaco. Ninguno de estos ajustes sustituye la revisión de información transmitida únicamente por color.</p></section>')
help_text=help_text.replace(
'<section class="sec"><h3>Guía de lectura</h3><p>Muestra una banda que sigue al puntero. Si el foco del teclado coincide con la banda, esta se aparta del control. La guía todavía no dispone de controles propios para colocarla con teclado o mediante botones táctiles.</p></section>',
'<section class="sec"><h3>Guía de lectura</h3><p>Muestra una banda visual que puede seguir al puntero. También puedes colocarla arriba, en el centro o abajo y elegir tres alturas desde «Colores, guía y concentración». Esos botones funcionan con clic, toque y teclado y activan la guía al utilizarlos. Si el foco del teclado coincide con la banda, esta se aparta del control.</p></section>')
marker='<!-- ig-presentation-help -->'
if marker not in help_text:
    insert='''\n'''+marker+'''\n<section class="sec"><h2>Colores, fondo y vista centrada</h2><p>En Lectura, abre «Colores, guía y concentración». La presentación Original sigue siendo la predeterminada. Tema Claro y Tema Oscuro cambian los colores de las superficies, el texto y los controles de la web, sin aplicar filtros a fotografías o ilustraciones.</p><p>«Fondo opaco» retira transparencias y desenfoques de las superficies preparadas para este ajuste. «Vista centrada en el contenido» reduce la navegación principal y el pie mientras está activa, pero mantiene el contenido, la navegación interna, las fuentes y los controles de Lectura y Música para poder volver a la vista normal.</p><p>«Restablecer estas opciones» recupera tema Original, transparencias y vista completa, y devuelve la guía a su posición y altura iniciales. No cambia el tamaño, la tipografía, los espaciados ni el estado activado o desactivado de la guía.</p></section>\n'''
    help_text=help_text.replace('<h2>Guardar los ajustes</h2>',insert+'<h2>Guardar los ajustes</h2>',1)
help_text=help_text.replace('Siguen pendientes la guía utilizable sin ratón, los temas completos, la lectura en voz alta avanzada y las alternativas textuales de algunos materiales.','Siguen pendientes la lectura en voz alta avanzada, las alternativas textuales de algunos materiales y las pruebas especializadas con tecnologías de apoyo.')
help_path.write_text(help_text)

# Registro acotado; las pruebas se añaden en la tarea de CI.
out=ROOT/'reports/accessibility/presentation-guide-changes.json';out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(json.dumps({
  'implemented':['tema Original/Claro/Oscuro','fondo opaco','vista centrada en contenido','guía con posición Arriba/Centro/Abajo','guía con tres alturas','aclaración del espaciado rápido'],
  'default_design_preserved':True,
  'images_filtered':False,
  'pending':['lectura en voz alta avanzada','alternativas textuales por material','pruebas con lectores de pantalla y braille reales','revisión de información dependiente del color por actividad'],
  'files':['assets/preferencias-lectura.js','assets/preferencias-lectura.css','assets/interfaz-comun.js','es/lectura-accesible/index.html']
},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'changed':changes,'report':str(out.relative_to(ROOT))},ensure_ascii=False))
