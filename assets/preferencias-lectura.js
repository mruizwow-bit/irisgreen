/* Iris Green: one preference store for the existing reading controls.
   Only presentation is persisted. Speech is always off on a new page. */
(function (window, document) {
  'use strict';
  if (window.IGPreferences) return;
  var KEY = 'ig-a11y', VERSION = 2, STEPS = [1, 1.15, 1.3, 1.5];
  var FLAGS = ['spacing', 'controls', 'contrast', 'guide', 'motion'];
  var ALIASES = {ls:'spacing', big:'controls', hc:'contrast', guide:'guide', rm:'motion'};
  var listeners = new Set(), canStore = true, speech = false, guideY = null, frame = 0;
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
    return out;
  }
  function decode(raw) { try { return normalize(typeof raw === 'string' && raw.length <= 8192 ? JSON.parse(raw) : null); } catch (_) { return defaults(); } }
  function load() { try { return decode(window.localStorage.getItem(KEY)); } catch (_) { canStore = false; return defaults(); } }
  var state = load();
  // System preferences are observed, never written to the person's site settings.
  var systemMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var systemColors = window.matchMedia('(forced-colors: active)');
  function system() { return {reducedMotion:systemMotion.matches, forcedColors:systemColors.matches}; }
  function reduceMotion() { return state.motion || systemMotion.matches; }
  function copy() { return Object.assign({}, state); }
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
  }
  function apply() {
    rootStyles();
    var body = document.body;
    if (!body) return;
    body.style.zoom = '';
    // Do not enlarge the header, floating panels or fonts twice on static pages.
    body.style.setProperty('--fs', '1rem');
    body.style.setProperty('--ls', state.spacing ? '.045em' : '0');
    body.style.lineHeight = state.spacing ? '1.9' : '';
    body.style.letterSpacing = state.spacing ? '.045em' : '';
    body.style.wordSpacing = state.spacing ? '.12em' : '';
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
    syncStatic();
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
    }
    apply();
  }
  [systemMotion, systemColors].forEach(function (query) {
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
    speechOn:function(){return speech;}, connect:connect, changeComponent:changeComponent, apply:apply};
  rootStyles();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true}); else boot();
})(window, document);
