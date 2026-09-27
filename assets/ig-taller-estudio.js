/* Iris Green · El taller · base común de los estudios.
   Sin dependencias, sin evaluación de código, sin peticiones de red y sin almacenamiento
   del navegador: el trabajo vive en la pestaña y se guarda solo en un archivo propio. */
(function (window, document) {
  'use strict';
  var IGT = window.IGT = window.IGT || {};
  var root = document.documentElement;
  IGT.lang = String(root.lang || 'es').slice(0, 2) === 'en' ? 'en' : 'es';

  /* Textos: bloque JSON no ejecutable generado junto a la página (mismo origen para ES y EN). */
  var dict = {};
  try { var el = document.getElementById('igt-i18n'); if (el) dict = JSON.parse(el.textContent); } catch (e) { dict = {}; }
  IGT.dict = dict;
  IGT.t = function (key, vars) {
    var s = Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : key;
    if (vars) Object.keys(vars).forEach(function (k) { s = String(s).split('{' + k + '}').join(vars[k]); });
    return s;
  };
  IGT.num = function (n, d) {
    var v = Number(n); if (!isFinite(v)) return '—';
    return v.toLocaleString(IGT.lang === 'en' ? 'en-GB' : 'es-ES', { maximumFractionDigits: d === undefined ? 1 : d, minimumFractionDigits: 0 });
  };

  /* Constructor de nodos: el texto entra siempre por textContent. */
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var SVG_TAGS = /^(svg|g|path|circle|line|rect|text|polygon|polyline|title|ellipse|defs|pattern|marker|tspan)$/;
  IGT.h = function (tag, attrs) {
    var node = SVG_TAGS.test(tag) ? document.createElementNS(SVG_NS, tag) : document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'on') Object.keys(v).forEach(function (ev) { node.addEventListener(ev, v[ev]); });
      else if (k === 'text') node.textContent = v;
      else if (k === 'value') node.value = v;
      else if (k === 'checked') node.checked = !!v;
      else if (k === 'props') Object.keys(v).forEach(function (p) { node[p] = v[p]; });
      else node.setAttribute(k, v === true ? '' : String(v));
    });
    for (var i = 2; i < arguments.length; i++) append(node, arguments[i]);
    return node;
  };
  function append(node, c) {
    if (c === null || c === undefined || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { append(node, x); }); return; }
    node.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
  }
  IGT.clear = function (node) { while (node.firstChild) node.removeChild(node.firstChild); return node; };

  /* Una región de estado por página. Mensajes cortos, sin repetición inmediata. */
  var lastMsg = '', lastAt = 0;
  IGT.say = function (msg) {
    var box = document.getElementById('igt-status'); if (!box || !msg) return;
    var now = Date.now(); if (msg === lastMsg && now - lastAt < 1500) return;
    lastMsg = msg; lastAt = now;
    box.textContent = '';
    window.setTimeout(function () { box.textContent = msg; }, 40);
  };

  /* Movimiento: el ajuste de Lectura de la web o el del dispositivo. */
  IGT.reducedMotion = function () {
    if (root.dataset && root.dataset.igMotion === 'off') return true;
    if (document.body && document.body.classList.contains('rm')) return true;
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  };
  IGT.highContrast = function () {
    return (root.dataset && root.dataset.igContrast === 'on') || (document.body && document.body.classList.contains('hc')) ||
      !!(window.matchMedia && window.matchMedia('(forced-colors: active)').matches);
  };

  /* Deshacer y rehacer sin límite: pilas de instantáneas serializadas. */
  /* clone/restore opcionales: permiten instantáneas con estructura compartida (trazos inmutables). */
  IGT.History = function (getState, setState, onChange, clone, restore) {
    var undo = [], redo = [], self = this;
    clone = clone || function (s) { return JSON.stringify(s); };
    restore = restore || function (s) { return JSON.parse(s); };
    this.commit = function (before) { undo.push(before === undefined ? clone(getState()) : before); redo.length = 0; IGT.markDirty(); if (onChange) onChange(); };
    this.snapshot = function () { return clone(getState()); };
    this.undo = function () { if (!undo.length) return false; redo.push(clone(getState())); setState(restore(undo.pop())); if (onChange) onChange(); IGT.say(IGT.t('undone')); return true; };
    this.redo = function () { if (!redo.length) return false; undo.push(clone(getState())); setState(restore(redo.pop())); if (onChange) onChange(); IGT.say(IGT.t('redone')); return true; };
    this.reset = function () { undo.length = 0; redo.length = 0; if (onChange) onChange(); };
    this.canUndo = function () { return undo.length > 0; };
    this.canRedo = function () { return redo.length > 0; };
    this.size = function () { return undo.length; };
    self.bindKeys = function (scope) {
      (scope || document).addEventListener('keydown', function (e) {
        var tag = (e.target && e.target.tagName) || '';
        if (/INPUT|TEXTAREA|SELECT/.test(tag) && !e.target.hasAttribute('data-igt-undo-ok')) return;
        if (e.target && e.target.closest && e.target.closest('.igl')) return; /* las seis mesas tienen su propio deshacer */
        if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); if (e.shiftKey) self.redo(); else self.undo(); }
        else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) { e.preventDefault(); self.redo(); }
      });
    };
  };

  /* Cambios sin guardar: aviso nativo del navegador antes de cerrar la pestaña. */
  var dirty = false;
  IGT.markDirty = function () { dirty = true; };
  IGT.markClean = function () { dirty = false; };
  window.addEventListener('beforeunload', function (e) { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

  /* Archivos propios. */
  IGT.download = function (name, blob) {
    var url = URL.createObjectURL(blob), a = IGT.h('a', { href: url, download: name });
    document.body.appendChild(a); a.click(); a.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  };
  IGT.stamp = function () {
    var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + '-' + p(d.getHours()) + p(d.getMinutes());
  };
  IGT.slug = function (s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
  };
  IGT.saveProject = function (studio, data, title) {
    var doc = { formato: 'irisgreen-taller', version: 1, estudio: studio, idioma: IGT.lang, guardado: new Date().toISOString(),
      marca: 'IRIS GREEN · irisgreen.eu', titulo: title || '', datos: data };
    var name = 'iris-green-' + studio + '-' + (IGT.slug(title) || IGT.stamp()) + '.json';
    IGT.download(name, new Blob([JSON.stringify(doc, null, 1)], { type: 'application/json' }));
    IGT.markClean(); IGT.say(IGT.t('saved', { name: name }));
  };
  IGT.openProject = function (studio, onData) {
    var input = IGT.h('input', { type: 'file', accept: '.json,application/json', hidden: true });
    input.addEventListener('change', function () {
      var f = input.files && input.files[0]; input.remove(); if (!f) return;
      if (f.size > 8 * 1024 * 1024) { IGT.say(IGT.t('openTooBig')); return; }
      var r = new FileReader();
      r.onload = function () {
        var doc; try { doc = JSON.parse(String(r.result)); } catch (e) { IGT.say(IGT.t('openBad')); return; }
        if (!doc || doc.formato !== 'irisgreen-taller' || !doc.datos) { IGT.say(IGT.t('openBad')); return; }
        if (doc.estudio !== studio) { IGT.say(IGT.t('openOther')); return; }
        try { onData(doc.datos, doc); IGT.markClean(); IGT.say(IGT.t('opened', { name: f.name })); }
        catch (e) { IGT.say(IGT.t('openBad')); }
      };
      r.onerror = function () { IGT.say(IGT.t('openBad')); };
      r.readAsText(f);
    });
    document.body.appendChild(input); input.click();
  };

  /* Botón con icono SVG y texto visible. */
  var ICONS = {
    nuevo: 'M6 3h8l4 4v14H6zM14 3v4h4', abrir: 'M3 7h6l2 2h10v10H3zM3 7v12', guardar: 'M5 3h12l3 3v15H5zM8 3v6h8V3M8 21v-7h8v7',
    imprimir: 'M6 9V3h12v6M6 18H4v-6h16v6h-2M8 14h8v7H8z', deshacer: 'M9 14L4 9l5-5M4 9h11a5 5 0 010 10h-4', rehacer: 'M15 14l5-5-5-5M20 9H9a5 5 0 000 10h4',
    png: 'M4 5h16v14H4zM4 15l5-5 4 4 3-3 4 4', ayuda: 'M9 9a3 3 0 115 2c-1 .7-2 1.3-2 3M12 18v.5M3 12a9 9 0 1018 0 9 9 0 00-18 0',
    play: 'M7 4l13 8-13 8z', paso: 'M5 4v16M9 4l11 8-11 8z', parar: 'M6 6h12v12H6z', reiniciar: 'M4 4v6h6M20 12a8 8 0 10-3 6.3M4 10a8 8 0 012-3',
    mas: 'M12 5v14M5 12h14', menos: 'M5 12h14', arriba: 'M12 19V5M5 12l7-7 7 7', abajo: 'M12 5v14M5 12l7 7 7-7', borrar: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
    fuera: 'M20 12H8M12 8l-4 4 4 4M4 4v16', dentro: 'M4 12h12M12 8l4 4-4 4M20 4v16',
    ojo: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6z', copiar: 'M8 8h12v12H8zM4 16V4h12'
  };
  IGT.icon = function (name) {
    return IGT.h('svg', { 'aria-hidden': 'true', viewBox: '0 0 24 24', width: 18, height: 18, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', focusable: 'false' },
      IGT.h('path', { d: ICONS[name] || '' }));
  };
  IGT.btn = function (label, opts) {
    opts = opts || {};
    var b = IGT.h('button', { type: 'button', class: 'igt-btn' + (opts.cls ? ' ' + opts.cls : ''), 'aria-pressed': opts.pressed === undefined ? null : String(!!opts.pressed),
      'aria-describedby': opts.describedby || null, title: opts.title || null, 'data-k': opts.k || null, 'aria-keyshortcuts': opts.keys || null, disabled: opts.disabled ? true : null },
      opts.icon ? IGT.icon(opts.icon) : null, IGT.h('span', { text: label }));
    if (opts.onClick) b.addEventListener('click', opts.onClick);
    return b;
  };
  IGT.press = function (btn, on) { btn.setAttribute('aria-pressed', on ? 'true' : 'false'); };

  /* Barra de proyecto común. */
  IGT.projectBar = function (cfg) {
    var bar = IGT.h('div', { class: 'igt-bar', role: 'toolbar', 'aria-label': IGT.t('projectBar') });
    var undoB = IGT.btn(IGT.t('undo'), { icon: 'deshacer', keys: 'Control+Z', onClick: function () { cfg.history.undo(); } });
    var redoB = IGT.btn(IGT.t('redo'), { icon: 'rehacer', keys: 'Control+Y', onClick: function () { cfg.history.redo(); } });
    bar.appendChild(undoB); bar.appendChild(redoB);
    bar.appendChild(IGT.h('span', { class: 'igt-sep', 'aria-hidden': 'true' }));
    if (cfg.onNew) bar.appendChild(IGT.btn(IGT.t('new'), { icon: 'nuevo', onClick: function () {
      if (cfg.history.size() && !window.confirm(IGT.t('confirmNew'))) return;
      cfg.onNew();
    } }));
    bar.appendChild(IGT.btn(IGT.t('open'), { icon: 'abrir', onClick: function () { IGT.openProject(cfg.studio, cfg.onOpen); } }));
    bar.appendChild(IGT.btn(IGT.t('save'), { icon: 'guardar', onClick: function () { IGT.saveProject(cfg.studio, cfg.getData(), cfg.getTitle ? cfg.getTitle() : ''); } }));
    (cfg.extra || []).forEach(function (b) { bar.appendChild(b); });
    if (cfg.onPrint !== false) bar.appendChild(IGT.btn(IGT.t('print'), { icon: 'imprimir', onClick: function () {
      /* imprime solo el trabajo; Ctrl+P sigue imprimiendo la página entera */
      document.body.classList.add('igt-print-focus');
      if (cfg.onPrint) cfg.onPrint();
      window.print();
    } }));
    function sync() { undoB.disabled = !cfg.history.canUndo(); redoB.disabled = !cfg.history.canRedo(); }
    bar.sync = sync; sync();
    return bar;
  };

  /* Retos por niveles: selector compacto con grupos por nivel, modo libre siempre disponible,
     nivel elegible y reversible (se puede subir y bajar en cualquier momento). */
  IGT.challenges = function (cfg) {
    var wrap = IGT.h('section', { class: 'igt-retos glass', 'aria-labelledby': 'igt-retos-h' });
    var current = null, items = cfg.items || [];
    var brief = IGT.h('div', { class: 'igt-brief', id: 'igt-brief', tabindex: '-1', 'aria-live': 'off' });
    var sel = IGT.h('select', { id: 'igt-reto-sel' });
    sel.appendChild(IGT.h('option', { value: '', text: IGT.t('freeMode') }));
    var byLevel = {};
    items.forEach(function (ch) { (byLevel[ch.level] = byLevel[ch.level] || []).push(ch); });
    Object.keys(byLevel).sort(function (a, b) { return a - b; }).forEach(function (lv) {
      var g = IGT.h('optgroup', { label: IGT.t('levelN', { n: lv }) + ' · ' + byLevel[lv][0].levelName });
      byLevel[lv].forEach(function (ch) { g.appendChild(IGT.h('option', { value: ch.id, text: ch.title })); });
      sel.appendChild(g);
    });
    var prev = IGT.btn(IGT.t('prevChallenge'), { onClick: function () { step(-1); } });
    var next = IGT.btn(IGT.t('nextChallenge'), { onClick: function () { step(1); } });
    function idx() { return current ? items.indexOf(current) : -1; }
    function step(d) { var i = idx() + d; if (i < -1) i = -1; if (i >= items.length) i = items.length - 1; pick(i < 0 ? null : items[i]); }
    function pick(ch, silent, noHook) {
      current = ch || null;
      sel.value = current ? current.id : '';
      prev.disabled = idx() < 0; next.disabled = idx() >= items.length - 1;
      IGT.clear(brief);
      if (!current) {
        brief.appendChild(IGT.h('p', { class: 'igt-brief-k', text: IGT.t('freeMode') }));
        brief.appendChild(IGT.h('p', { text: IGT.t('freeModeText') }));
      } else {
        brief.appendChild(IGT.h('p', { class: 'igt-brief-k', text: IGT.t('levelN', { n: current.level }) + ' · ' + current.levelName }));
        brief.appendChild(IGT.h('h3', { text: current.title }));
        brief.appendChild(IGT.h('p', { text: current.goal }));
        if (current.limits && current.limits.length) brief.appendChild(IGT.h('ul', { class: 'igt-limits', 'aria-label': IGT.t('limits') }, current.limits.map(function (l) { return IGT.h('li', { text: l }); })));
        if (current.tip) brief.appendChild(IGT.h('p', { class: 'igt-tip', text: IGT.t('tip') + ': ' + current.tip }));
      }
      var extra = cfg.onPick && !noHook ? cfg.onPick(current) : null;
      if (extra) brief.appendChild(extra);
      if (!silent) IGT.say(current ? IGT.t('challengePicked', { t: current.title }) : IGT.t('freeMode'));
    }
    sel.addEventListener('change', function () { var ch = null; for (var i = 0; i < items.length; i++) if (items[i].id === sel.value) ch = items[i]; pick(ch); });
    wrap.appendChild(IGT.h('div', { class: 'igt-retos-pick' },
      IGT.h('h2', { id: 'igt-retos-h', text: IGT.t('challengesTitle') }),
      IGT.h('p', { class: 'igt-note', text: IGT.t('challengesNote') }),
      IGT.h('label', { class: 'igt-field', for: 'igt-reto-sel' }, IGT.t('challengeLabel', { n: items.length }), sel),
      IGT.h('div', { class: 'igt-bar' }, prev, next)));
    wrap.appendChild(brief);
    wrap.pick = pick;
    wrap.current = function () { return current; };
    wrap.byId = function (id) { for (var i = 0; i < items.length; i++) if (items[i].id === id) return items[i]; return null; };
    pick(null, true, true);
    return wrap;
  };

  /* Resultado de una comprobación: texto + símbolo, nunca solo color. */
  IGT.result = function (ok, text) {
    return IGT.h('p', { class: 'igt-result ' + (ok ? 'ok' : 'no'), role: 'status' },
      IGT.h('span', { class: 'igt-result-mark', 'aria-hidden': 'true', text: ok ? '✓' : '·' }), IGT.h('span', { text: text }));
  };

  /* Canvas nítido en pantallas de alta densidad. */
  IGT.fitCanvas = function (canvas, w, h) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    var ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  };

  /* Imagen PNG con la marca de composición en una franja propia, sin tapar el trabajo. */
  IGT.exportPNG = function (sourceCanvas, cssW, cssH, name, caption) {
    var strip = 44, scale = sourceCanvas.width / cssW;
    var out = document.createElement('canvas');
    out.width = sourceCanvas.width; out.height = sourceCanvas.height + Math.round(strip * scale);
    var c = out.getContext('2d');
    c.fillStyle = '#ffffff'; c.fillRect(0, 0, out.width, out.height);
    c.drawImage(sourceCanvas, 0, 0);
    c.save(); c.scale(scale, scale);
    c.fillStyle = '#f4f6f9'; c.fillRect(0, cssH, cssW, strip);
    c.fillStyle = '#4a5a6e'; c.font = '13px "Atkinson Hyperlegible", Arial, sans-serif'; c.textBaseline = 'middle';
    if (caption) { c.textAlign = 'left'; c.fillText(String(caption).slice(0, 80), 12, cssH + strip / 2); }
    c.textAlign = 'right'; c.fillText('IRIS GREEN · irisgreen.eu', cssW - 12, cssH + strip / 2);
    c.restore();
    out.toBlob(function (blob) { if (blob) { IGT.download(name, blob); IGT.say(IGT.t('pngSaved', { name: name })); } }, 'image/png');
  };

  /* Pequeño generador pseudoaleatorio reproducible (retos y laberintos). */
  IGT.rng = function (seed) {
    var s = (seed >>> 0) || 1;
    return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  };

  /* Ayuda de teclado plegable. */
  IGT.keyHelp = function (rows) {
    var d = IGT.h('details', { class: 'igt-keys' }, IGT.h('summary', { text: IGT.t('keysTitle') }));
    var dl = IGT.h('dl');
    rows.forEach(function (r) { dl.appendChild(IGT.h('dt', { text: r[0] })); dl.appendChild(IGT.h('dd', { text: r[1] })); });
    d.appendChild(dl); return d;
  };

  /* Panel plegable del lateral: el título es el resumen; el contenido sigue en el orden de lectura. */
  IGT.panel = function (title, open) {
    var d = IGT.h('details', { class: 'igt-panel', open: open ? true : null }, IGT.h('summary', null, IGT.h('h3', { text: title })));
    for (var i = 2; i < arguments.length; i++) append(d, arguments[i]);
    d.open = !!open;
    return d;
  };

  window.addEventListener('afterprint', function () { document.body.classList.remove('igt-print-focus'); });

  IGT.ready = function (fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true }); else fn(); };
  IGT.mount = function () {
    var m = document.getElementById('igt-app'); if (!m) return null;
    var nojs = m.querySelector('.igt-nojs'); if (nojs) nojs.remove();
    m.classList.add('igt-on');
    return m;
  };

  /* R42 Taller product layer: loaded progressively after the existing studio runtime. */
  IGT.loadR42 = function () {
    if (window.__ig42WorkshopLoading) return;
    window.__ig42WorkshopLoading = true;
    if (!document.querySelector('link[data-ig42-taller]')) {
      var css = document.createElement('link');
      css.rel = 'stylesheet'; css.href = '/assets/ig-taller-r42.css?v=r42-a5-3'; css.setAttribute('data-ig42-taller', 'true');
      document.head.appendChild(css);
    }
    if (!document.querySelector('link[data-ig43-advanced]')) {
      var css43 = document.createElement('link');
      css43.rel = 'stylesheet'; css43.href = '/assets/ig-taller-r43-advanced.css?v=r43-a5-1'; css43.setAttribute('data-ig43-advanced', 'true');
      document.head.appendChild(css43);
    }
    function loadShell() {
      if (window.IGTallerR42) { window.IGTallerR42.autoMount(); return; }
      var shell = document.createElement('script');
      shell.src = '/assets/ig-taller-r42.js?v=r42-a5-2';
      shell.defer = true;
      document.head.appendChild(shell);
    }
    function loadDirect() {
      if (window.IGTallerR42Direct) { loadShell(); return; }
      var direct = document.createElement('script');
      direct.src = '/assets/ig-taller-r42-direct.js?v=r42-a5-3';
      direct.defer = true; direct.onload = loadShell;
      document.head.appendChild(direct);
    }
    function loadAdvanced() {
      if (window.IGTallerR43Advanced) { loadDirect(); return; }
      var advanced = document.createElement('script');
      advanced.src = '/assets/ig-taller-r43-advanced.js?v=r43-a5-1';
      advanced.defer = true; advanced.onload = loadDirect;
      document.head.appendChild(advanced);
    }
    function loadPlatform() {
      if (window.IGTallerR42Platform) { loadAdvanced(); return; }
      var platform = document.createElement('script');
      platform.src = '/assets/ig-taller-r42-platform.js?v=r42-a5-3';
      platform.defer = true; platform.onload = loadAdvanced;
      document.head.appendChild(platform);
    }
    if (window.IGTallerR42Paths) loadPlatform();
    else {
      var paths = document.createElement('script');
      paths.src = '/assets/data/taller-r42-paths.js?v=r42-a5-2';
      paths.defer = true; paths.onload = loadPlatform;
      document.head.appendChild(paths);
    }
  };
  IGT.ready(IGT.loadR42);
})(window, document);
