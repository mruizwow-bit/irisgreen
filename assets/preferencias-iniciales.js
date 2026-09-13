/* Iris Green: restaura solo el estado visual antes del primer render.
   El panel completo y sus eventos se cargan después en preferencias-lectura.js. */
(function (window, document) {
  'use strict';

  if (/^\/es(?:\/|$)/.test(window.location.pathname)) {
    try { window.localStorage.removeItem('ig_lang'); } catch (_) {}
  }

  var KEY = 'ig-a11y', VERSION = 2, STEPS = [1, 1.15, 1.3, 1.5];
  var FLAGS = ['spacing', 'controls', 'contrast', 'guide', 'motion'];
  var ALIASES = {ls:'spacing', big:'controls', hc:'contrast', guide:'guide', rm:'motion'};
  var TEXT_FONTS = {
    original:'',
    sans:'Arial, Helvetica, sans-serif',
    wide:'Verdana, Geneva, sans-serif',
    serif:'Georgia, "Times New Roman", serif'
  };
  var TEXT_NUMBERS = {letter:[0,.2], word:[0,.4], line:[1,2.4], paragraph:[0,3]};

  function validObject(value) { return value && typeof value === 'object' && !Array.isArray(value); }
  function defaults() { return {version:VERSION, scale:1, spacing:false, controls:false, contrast:false, guide:false, motion:false}; }
  function textDefaults() { return {font:'original',letter:null,word:null,line:null,paragraph:null,width:'original'}; }
  function normalizeText(value) {
    var t = textDefaults();
    if (!validObject(value)) return t;
    if (Object.prototype.hasOwnProperty.call(TEXT_FONTS, value.font)) t.font = value.font;
    if (['original','medium','narrow'].indexOf(value.width) !== -1) t.width = value.width;
    Object.keys(TEXT_NUMBERS).forEach(function (key) {
      var n = value[key], range = TEXT_NUMBERS[key];
      if (typeof n === 'number' && Number.isFinite(n)) {
        t[key] = Math.round(Math.min(range[1], Math.max(range[0], n)) * 1000) / 1000;
      }
    });
    return t;
  }
  function customText(t) {
    var d = textDefaults();
    return Object.keys(d).some(function (key) { return t[key] !== d[key]; });
  }
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
    var text = normalizeText(value.text);
    if (customText(text)) out.text = text;
    return out;
  }
  function decode(raw) {
    try { return normalize(typeof raw === 'string' && raw.length <= 8192 ? JSON.parse(raw) : null); }
    catch (_) { return defaults(); }
  }

  var state;
  try { state = decode(window.localStorage.getItem(KEY)); }
  catch (_) { state = defaults(); }

  var root = document.documentElement;
  var systemMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var systemColors = window.matchMedia('(forced-colors: active)').matches;
  var text = normalizeText(state.text);

  if (state.spacing) {
    if (text.letter === null) text.letter = .045;
    if (text.word === null) text.word = .12;
    if (text.line === null) text.line = 1.9;
  }

  root.setAttribute('data-ig-preferences', '2');
  root.style.setProperty('--ig-reading-scale', String(state.scale));
  root.toggleAttribute('data-ig-text-enlarged', state.scale > 1);
  root.dataset.igControls = state.controls ? 'big' : '';
  root.dataset.igContrast = state.contrast ? 'on' : '';
  root.dataset.igMotion = (state.motion || systemMotion) ? 'off' : '';
  root.dataset.igSystemMotion = systemMotion ? 'reduce' : '';
  root.dataset.igSystemColors = systemColors ? 'forced' : '';

  root.dataset.igTextFont = text.font;
  root.dataset.igTextWidth = text.width;
  root.style.setProperty('--ig-text-font', TEXT_FONTS[text.font] || 'inherit');
  root.style.setProperty('--ig-text-width', text.width === 'narrow' ? '48ch' : '65ch');
  Object.keys(TEXT_NUMBERS).forEach(function (key) {
    root.setAttribute('data-ig-text-' + key, text[key] === null ? 'original' : 'set');
    if (text[key] === null) root.style.removeProperty('--ig-text-' + key);
    else root.style.setProperty('--ig-text-' + key, String(text[key]) + (key === 'line' ? '' : 'em'));
  });
})(window, document);
