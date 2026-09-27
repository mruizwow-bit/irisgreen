/* Iris Green: one preference store for the existing reading controls.
   Only presentation is persisted. Speech is always off on a new page. */
(function (window, document) {
  'use strict';
  if (/^\/es(?:\/|$)/.test(window.location.pathname)) { try { window.localStorage.removeItem('ig_lang'); } catch (_) {} }
  if (window.IGPreferences) return;
  var KEY = 'ig-a11y', VERSION = 2, STEPS = [1, 1.15, 1.3, 1.5];
  var FLAGS = ['spacing', 'controls', 'contrast', 'guide', 'motion'];
  var ALIASES = {ls:'spacing', big:'controls', hc:'contrast', guide:'guide', rm:'motion'};
  var listeners = new Set(), canStore = true, speech = false, guideY = null, frame = 0;
  // R42 · Transparency is optional and stored only after an explicit choice.
  var TRANSPARENCY = ['normal', 'reduced', 'opaque'];

  // Optional text settings keep the version-2 legacy representation unchanged.
  var TEXT_FONTS = {original:'',sans:'Arial, Helvetica, sans-serif',wide:'Verdana, Geneva, sans-serif',serif:'Georgia, "Times New Roman", serif'};
  var TEXT_NUMBERS = {letter:[0,.2],word:[0,.4],line:[1,2.4],paragraph:[0,3]};
  function textDefaults() { return {font:'original',letter:null,word:null,line:null,paragraph:null,width:'original'}; }
  function normalizeText(value) {
    var t=textDefaults();if(!validObject(value))return t;
    if(Object.prototype.hasOwnProperty.call(TEXT_FONTS,value.font))t.font=value.font;
    if(['original','medium','narrow'].indexOf(value.width)!==-1)t.width=value.width;
    Object.keys(TEXT_NUMBERS).forEach(function(k){
      var n=value[k],r=TEXT_NUMBERS[k];
      if(typeof n==='number'&&Number.isFinite(n))t[k]=Math.round(Math.min(r[1],Math.max(r[0],n))*1000)/1000;
    });return t;
  }
  function customText(t) { var d=textDefaults();return Object.keys(d).some(function(k){return t[k]!==d[k];}); }
  function effectiveText() {
    var t=normalizeText(state.text);
    if(state.spacing){if(t.letter===null)t.letter=.045;if(t.word===null)t.word=.12;if(t.line===null)t.line=1.9;}
    return t;
  }
  function applyTextRoot(root) {
    var t=effectiveText();root.dataset.igTextFont=t.font;root.dataset.igTextWidth=t.width;
    root.style.setProperty('--ig-text-font',TEXT_FONTS[t.font]||'inherit');
    root.style.setProperty('--ig-text-width',t.width==='narrow'?'48ch':'65ch');
    Object.keys(TEXT_NUMBERS).forEach(function(k){
      root.setAttribute('data-ig-text-'+k,t[k]===null?'original':'set');
      if(t[k]===null)root.style.removeProperty('--ig-text-'+k);
      else root.style.setProperty('--ig-text-'+k,String(t[k])+(k==='line'?'':'em'));
    });
  }
  function mergeTextPatch(next,patch) {
    var t=normalizeText(next.text);
    if(Object.prototype.hasOwnProperty.call(patch,'spacing')){
      Object.keys(TEXT_NUMBERS).forEach(function(k){t[k]=null;});
    }
    if(validObject(patch.text)){
      var changesNumbers=Object.keys(TEXT_NUMBERS).some(function(k){return Object.prototype.hasOwnProperty.call(patch.text,k);});
      if(changesNumbers&&next.spacing){t=effectiveText();next.spacing=false;}
      Object.keys(t).forEach(function(k){if(Object.prototype.hasOwnProperty.call(patch.text,k))t[k]=patch.text[k];});
    }
    t=normalizeText(t);if(customText(t))next.text=t;else delete next.text;
  }
  var TEXT_LABELS={
    es:{title:'Tipografía, espaciado y anchura',font:'Tipografía del texto',letter:'Separación entre letras',word:'Separación entre palabras',line:'Distancia entre líneas',paragraph:'Separación entre párrafos',width:'Anchura de lectura',original:'Original',fonts:['Original de Iris Green','Arial o similar','Verdana o similar','Georgia o similar'],widths:['Original','Media','Estrecha'],reset:'Restablecer estos ajustes',note:'Cada ajuste es independiente. No cambia el tamaño elegido, las imágenes ni la música. Las letras alternativas dependen de las fuentes disponibles en tu dispositivo.',sample:'Esta es una muestra para comparar la letra y los espacios.',sample2:'Puedes cambiar una opción sin modificar las demás.',relative:'veces el tamaño de letra'},
    en:{title:'Typeface, spacing and reading width',font:'Text typeface',letter:'Letter spacing',word:'Word spacing',line:'Line spacing',paragraph:'Paragraph spacing',width:'Reading width',original:'Original',fonts:['Iris Green original','Arial or similar','Verdana or similar','Georgia or similar'],widths:['Original','Medium','Narrow'],reset:'Reset these settings',note:'Each setting is independent. It does not change your chosen size, images or music. Alternative typefaces depend on the fonts available on your device.',sample:'This is a sample for comparing typefaces and spacing.',sample2:'You can change one setting without changing the others.',relative:'times the text size'}
  };
  function textLanguage(){return String(document.documentElement.lang).startsWith('en')?'en':'es';}
  function textNumber(n){return String(n).replace('.',textLanguage()==='es'?',':'.');}
  function mountTextOptions(panel) {
    if(!panel||panel.querySelector('[data-ig-text-settings]')){syncTextOptions();return;}
    var d=document.createElement('details');d.className='ig-text-settings';d.setAttribute('data-ig-text-settings','');
    var summary=document.createElement('summary');summary.setAttribute('data-ig-text-label','title');d.appendChild(summary);
    var note=document.createElement('p');note.className='ig-text-note';note.setAttribute('data-ig-text-label','note');d.appendChild(note);
    var fields=[['font',['original','sans','wide','serif']],['letter',[null,0,.03,.045,.06,.09,.12,.16,.2]],['word',[null,0,.06,.12,.16,.24,.32,.4]],['line',[null,1.2,1.5,1.7,1.9,2,2.2,2.4]],['paragraph',[null,0,.5,1,1.5,2,2.5,3]],['width',['original','medium','narrow']]];
    fields.forEach(function(pair){
      var key=pair[0],label=document.createElement('label'),select=document.createElement('select'),span=document.createElement('span');
      select.id=(panel.id||'ig-reading')+'-text-'+key;select.dataset.igTextKey=key;span.setAttribute('data-ig-text-label',key);label.htmlFor=select.id;
      label.append(span,select);label.className='ig-text-field';
      pair[1].forEach(function(value){var opt=document.createElement('option');opt.value=value===null?'original':String(value);select.appendChild(opt);});
      select.addEventListener('change',function(){var patch={};patch[key]=TEXT_NUMBERS[key]?(select.value==='original'?null:Number(select.value)):select.value;update({text:patch});});
      d.appendChild(label);
    });
    var preview=document.createElement('div');preview.className='ig-text-preview';preview.setAttribute('data-ig-text-preview','');
    ['sample','sample2'].forEach(function(k){var p=document.createElement('p');p.setAttribute('data-ig-text-label',k);preview.appendChild(p);});d.appendChild(preview);
    var resetButton=document.createElement('button');resetButton.type='button';resetButton.className='ig-text-reset';resetButton.setAttribute('data-ig-text-label','reset');resetButton.setAttribute('data-ig-text-reset','');
    resetButton.addEventListener('click',function(){update({spacing:false,text:textDefaults()});});d.appendChild(resetButton);
    var before=panel.querySelector('.ctrls')||panel.children[1]||null;panel.insertBefore(d,before);syncTextOptions();
  }
  function syncTextOptions() {
    var t=effectiveText(),L=TEXT_LABELS[textLanguage()];
    document.querySelectorAll('[data-ig-text-settings]').forEach(function(d){
      d.querySelectorAll('[data-ig-text-label]').forEach(function(n){n.textContent=L[n.dataset.igTextLabel];});
      d.querySelectorAll('select[data-ig-text-key]').forEach(function(select){
        var k=select.dataset.igTextKey,value=t[k]===null?'original':String(t[k]);
        var all=Array.from(select.options);if(!all.some(function(o){return o.value===value;})){var o=document.createElement('option');o.value=value;select.appendChild(o);}
        Array.from(select.options).forEach(function(o){
          if(k==='font')o.textContent=L.fonts[['original','sans','wide','serif'].indexOf(o.value)];
          else if(k==='width')o.textContent=L.widths[['original','medium','narrow'].indexOf(o.value)];
          else o.textContent=o.value==='original'?L.original:textNumber(Number(o.value))+' ×';
        });
        if(select.value!==value)select.value=value;
      });
      var preview=d.querySelector('[data-ig-text-preview]');
      preview.style.fontFamily=TEXT_FONTS[t.font]||'"Atkinson Hyperlegible",system-ui,sans-serif';
      preview.style.letterSpacing=t.letter===null?'':t.letter+'em';preview.style.wordSpacing=t.word===null?'':t.word+'em';
      preview.style.lineHeight=t.line===null?'':String(t.line);
      preview.querySelectorAll('p').forEach(function(p){p.style.marginBlockEnd=t.paragraph===null?'':t.paragraph+'em';});
    });
  }

  var TRANSPARENCY_LABELS = {
    es:{title:'Transparencia',normal:'Normal',reduced:'Reducida',opaque:'Opaca',note:'Cambia solo las barras y los menús. El contenido y lo que estés haciendo no cambian.',system:'Ahora sigue el ajuste de tu dispositivo.',forced:'«Más contraste» está activado: ahora las barras y los menús se ven opacos. Tu elección se aplicará cuando lo desactives.',forcedSystem:'El contraste alto de tu dispositivo está activado: ahora las barras y los menús se ven opacos. Tu elección se aplicará cuando lo desactives.'},
    en:{title:'Transparency',normal:'Normal',reduced:'Reduced',opaque:'Opaque',note:'Only bars and menus change. Content and your work stay the same.',system:'Currently following your device setting.',forced:'“More contrast” is on: bars and menus are shown opaque for now. Your choice applies when you turn it off.',forcedSystem:'Your device’s high-contrast setting is on: bars and menus are shown opaque for now. Your choice applies when you turn it off.'}
  };
  function mountTransparency(panel) {
    if (!panel || panel.querySelector('[data-ig-transparency-settings]')) { syncTransparency(); return; }
    var box = document.createElement('div'); box.className = 'ig-transparency'; box.setAttribute('data-ig-transparency-settings', '');
    var title = document.createElement('p'); title.className = 'ig-transparency-title'; title.id = (panel.id || 'ig-reading') + '-transparency-title';
    title.setAttribute('data-ig-transparency-label', 'title');
    var group = document.createElement('div'); group.className = 'ctrls'; group.setAttribute('role', 'group'); group.setAttribute('aria-labelledby', title.id);
    TRANSPARENCY.forEach(function (value) {
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('data-ig-transparency-choice', value); b.setAttribute('data-ig-transparency-label', value);
      b.addEventListener('click', function () { update({transparency:value}); });
      group.appendChild(b);
    });
    var note = document.createElement('p'); note.className = 'ig-transparency-note'; note.id = title.id.replace('-title', '-note');
    note.setAttribute('data-ig-transparency-note', ''); group.setAttribute('aria-describedby', note.id);
    var forced = document.createElement('p'); forced.className = 'ig-transparency-forced'; forced.id = title.id.replace('-title', '-forced');
    forced.setAttribute('data-ig-transparency-forced-note', ''); forced.setAttribute('role', 'status'); forced.hidden = true;
    group.setAttribute('aria-describedby', note.id + ' ' + forced.id);
    box.append(title, group, forced, note);
    var after = panel.querySelector('.ctrls');
    if (after && after.parentNode === panel) panel.insertBefore(box, after.nextSibling); else panel.appendChild(box);
    syncTransparency();
  }
  function syncTransparency() {
    var L = TRANSPARENCY_LABELS[textLanguage()], current = transparency();
    document.querySelectorAll('[data-ig-transparency-settings]').forEach(function (box) {
      box.querySelectorAll('[data-ig-transparency-label]').forEach(function (n) { n.textContent = L[n.getAttribute('data-ig-transparency-label')]; });
      box.querySelectorAll('[data-ig-transparency-choice]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-ig-transparency-choice') === current)); });
      var forcedBy = transparencyForced(), forced = box.querySelector('[data-ig-transparency-forced-note]');
      if (forcedBy) box.setAttribute('data-ig-transparency-forced', forcedBy); else box.removeAttribute('data-ig-transparency-forced');
      if (forced) { forced.hidden = !forcedBy; forced.textContent = forcedBy ? (forcedBy === 'contrast' ? L.forced : L.forcedSystem) : ''; }
      var note = box.querySelector('[data-ig-transparency-note]');
      if (note) note.textContent = L.note + (state.transparency ? '' : ' ' + L.system);
    });
  }
  function defaults() { return {version:VERSION, scale:1, spacing:false, controls:false, contrast:false, guide:false, motion:false}; }
  function validObject(value) { return value && typeof value === 'object' && !Array.isArray(value); }
  function normalize(value) {
    var out = defaults();
    if (!validObject(value)) return out;
    if (value.version === VERSION) {
      if (typeof value.scale === 'number' && Number.isFinite(value.scale)) out.scale = Math.min(1.5, Math.max(1, value.scale));
      FLAGS.forEach(function (key) { out[key] = value[key] === true; });
    } else if (!Object.prototype.hasOwnProperty.call(value, 'version')) {
      if (Number.isInteger(value.fs) && value.fs >= 0 && value.fs < STEPS.length) out.scale = STEPS[value.fs];
      Object.keys(ALIASES).forEach(function (key) { out[ALIASES[key]] = value[key] === true; });
    }
    var text=normalizeText(value.text);if(customText(text))out.text=text;
    if (TRANSPARENCY.indexOf(value.transparency) !== -1) out.transparency = value.transparency;
    return out;
  }
  function decode(raw) { try { return normalize(typeof raw === 'string' && raw.length <= 8192 ? JSON.parse(raw) : null); } catch (_) { return defaults(); } }
  function load() { try { return decode(window.localStorage.getItem(KEY)); } catch (_) { canStore = false; return defaults(); } }
  var state = load();
  // System preferences are observed, never written to the person's site settings.
  var systemMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var systemColors = window.matchMedia('(forced-colors: active)');
  var systemTransparency = window.matchMedia('(prefers-reduced-transparency: reduce)');
  var systemContrast = window.matchMedia('(prefers-contrast: more)');
  function transparency() { return state.transparency || (systemTransparency.matches ? 'reduced' : 'normal'); }
  // «Más contraste» (o el contraste del sistema) impone una superficie opaca sin tocar la elección guardada.
  function transparencyForced() { return state.contrast ? 'contrast' : (systemContrast.matches ? 'system-contrast' : ''); }
  function system() { return {reducedMotion:systemMotion.matches, forcedColors:systemColors.matches, reducedTransparency:systemTransparency.matches}; }
  function reduceMotion() { return state.motion || systemMotion.matches; }
  function copy() { var c=Object.assign({},state);if(state.text)c.text=Object.assign({},state.text);return c; }
  function persist() {
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); canStore = true; }
    catch (_) { canStore = false; }
  }
  function componentState() {
    return {fs: state.scale * 17, spacing:state.spacing, controls:state.controls, contrast:state.contrast, guide:state.guide, motion:state.motion, speak:speech, systemMotion:systemMotion.matches, systemColors:systemColors.matches};
  }
  function status(lang) {
    var english = String(lang || document.documentElement.lang).startsWith('en');
    var message = canStore ? (english ? 'Settings are remembered in this browser. Audio never starts automatically.' : 'Los ajustes se recuerdan en este navegador. El audio no se inicia solo.') :
      (english ? 'Settings work on this page, but this browser cannot save them.' : 'Los ajustes funcionan en esta página, pero este navegador no permite guardarlos.');
    if (systemMotion.matches) message += english ? ' Your device also has reduced motion enabled; Reset keeps respecting it.' : ' Tu dispositivo también tiene activada la reducción de movimiento; Restablecer sigue respetándola.';
    if (systemColors.matches) message += english ? ' Your device’s forced colour palette is active.' : ' Está activa la paleta de colores forzados de tu dispositivo.';
    return message;
  }
  function rootStyles() {
    var root = document.documentElement;
    root.setAttribute('data-ig-preferences', '2');
    root.style.setProperty('--ig-reading-scale', String(state.scale));
    root.toggleAttribute('data-ig-text-enlarged', state.scale > 1);
    root.dataset.igControls = state.controls ? 'big' : '';
    root.dataset.igContrast = state.contrast ? 'on' : '';
    root.dataset.igMotion = reduceMotion() ? 'off' : '';
    root.dataset.igSystemMotion = systemMotion.matches ? 'reduce' : '';
    root.dataset.igSystemColors = systemColors.matches ? 'forced' : '';
    root.dataset.igTransparency = transparency();
    root.dataset.igTransparencySource = state.transparency ? 'user' : 'system';
    root.dataset.igTransparencyForced = transparencyForced();
    applyTextRoot(root);
  }
  function apply() {
    rootStyles();
    var body = document.body;
    if (!body) return;
    body.style.zoom = '';
    // Do not enlarge the header, floating panels or fonts twice on static pages.
    body.style.setProperty('--fs', '1rem');
    body.style.setProperty('--ls', '0');
    body.style.lineHeight = '';body.style.letterSpacing = '';body.style.wordSpacing = '';
    // Text settings apply to main, not to navigation or floating panels.
    body.classList.toggle('big', state.controls);
    body.classList.toggle('hc', state.contrast);
    body.classList.toggle('rm', reduceMotion());
    body.classList.toggle('tts', speech);
    var guide = document.getElementById('rguide') || document.getElementById('ig-guide');
    if (state.guide && !guide) { guide = document.createElement('div'); guide.id = 'ig-guide'; guide.setAttribute('aria-hidden','true'); body.appendChild(guide); }
    if (guide) {
      guide.hidden = !state.guide;
      if (state.guide) guide.style.top = (guideY === null ? Math.round(window.innerHeight * .4) : guideY) + 'px';
    }
    syncStatic();syncTextOptions();syncTransparency();
  }
  function syncStatic() {
    document.querySelectorAll('#a11y [data-a]').forEach(function (button) {
      var action = button.dataset.a;
      if (ALIASES[action]) button.setAttribute('aria-pressed', String(state[ALIASES[action]]));
      if (action === 'tts') button.setAttribute('aria-pressed', String(speech));
      if (action === 'fs+') button.disabled = state.scale >= 1.5;
      if (action === 'fs-') button.disabled = state.scale <= 1;
    });
    var output = document.getElementById('ig-preference-size');
    if (output) output.textContent = Math.round(state.scale * 100) + '%';
    var note = document.querySelector('#a11y [data-ig-preference-note]');
    if (note) note.textContent = status();
  }
  function notify() { apply(); listeners.forEach(function (fn) { fn(componentState()); }); }
  function update(patch) {
    if (!validObject(patch)) return;
    var next = copy();
    if (typeof patch.scale === 'number' && Number.isFinite(patch.scale)) next.scale = patch.scale;
    FLAGS.forEach(function (key) { if (typeof patch[key] === 'boolean') next[key] = patch[key]; });
    mergeTextPatch(next,patch);
    if (Object.prototype.hasOwnProperty.call(patch, 'transparency')) {
      if (TRANSPARENCY.indexOf(patch.transparency) !== -1) next.transparency = patch.transparency; else delete next.transparency;
    }
    state = normalize(next); persist(); notify();
  }
  function step(direction) {
    var next = state.scale;
    if (direction > 0) next = STEPS.find(function (n) { return n > state.scale + .00001; }) || 1.5;
    else next = STEPS.slice().reverse().find(function (n) { return n < state.scale - .00001; }) || 1;
    update({scale:next});
  }
  function setSpeech(on) { speech = on === true; notify(); }
  function reset() {
    if (speech && window.speechSynthesis) window.speechSynthesis.cancel();
    speech = false; state = defaults(); persist(); notify();
  }
  function changeComponent(instance, patch) {
    var pure = {}, previousSpeech = speech;
    if (typeof patch.fs === 'number') pure.scale = patch.fs / 17;
    FLAGS.forEach(function (key) { if (Object.prototype.hasOwnProperty.call(patch, key)) pure[key] = patch[key]; });
    if (Object.prototype.hasOwnProperty.call(patch, 'speak')) speech = patch.speak === true;
    // Changing contrast/spacing must not restart an already running narration.
    update(pure);
    if (previousSpeech !== speech) instance.setSpeak(speech);
  }
  function connect(instance) {
    function reflect(snapshot) {
      if (Object.keys(snapshot).some(function (key) { return instance.state[key] !== snapshot[key]; })) instance.setState(snapshot);
    }
    listeners.add(reflect); reflect(componentState()); apply();
    return function () { listeners.delete(reflect); };
  }
  function boot() {
    var panel = document.getElementById('a11y');
    if (panel) {
      var size = panel.querySelector('.grp');
      if (size && !document.getElementById('ig-preference-size')) {
        var output = document.createElement('output'); output.id = 'ig-preference-size'; output.setAttribute('aria-live','polite'); size.appendChild(output);
      }
      if (!panel.querySelector('[data-ig-preference-note]')) {
        var note = document.createElement('p'); note.className = 'ig-preference-note'; note.setAttribute('data-ig-preference-note',''); note.setAttribute('role','status'); panel.appendChild(note);
      }
      // R42 pilot: the control appears only where the material system is loaded.
      if (document.body && document.body.dataset.igMaterials === 'r42') mountTransparency(panel);
    }
    apply();
  }
  [systemMotion, systemColors, systemTransparency, systemContrast].forEach(function (query) {
    if (query.addEventListener) query.addEventListener('change', notify);
    else if (query.addListener) query.addListener(notify);
  });
  window.addEventListener('storage', function (event) {
    if (event.key !== KEY && event.key !== null) return;
    state = event.key === null ? defaults() : decode(event.newValue);
    // Do not write back: this would echo changes between tabs. Do not start speech.
    notify();
  });
  window.addEventListener('pageshow', function (event) { if (event.persisted) { speech = false; state = load(); notify(); } });
  document.addEventListener('pointermove', function (event) {
    if (!state.guide) return;
    guideY = Math.max(0, Math.min(window.innerHeight - 46, event.clientY - 23));
    if (!frame) frame = window.requestAnimationFrame(function () {
      frame = 0; var g = document.getElementById('rguide') || document.getElementById('ig-guide');
      if (g && state.guide) g.style.top = guideY + 'px';
    });
  }, {passive:true});
  window.addEventListener('pagehide', function () { if (speech && window.speechSynthesis) window.speechSynthesis.cancel(); });
  window.IGPreferences = {get:copy, system:system, componentState:componentState, status:status, update:update, step:step, reset:reset, setSpeech:setSpeech,
    speechOn:function(){return speech;}, connect:connect, changeComponent:changeComponent, apply:apply, mountTextOptions:mountTextOptions, getText:effectiveText,
    getTransparency:transparency, getTransparencyForced:transparencyForced, mountTransparencyOptions:mountTransparency};
  new MutationObserver(function(){syncTextOptions();syncTransparency();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  rootStyles();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true}); else boot();
})(window, document);
