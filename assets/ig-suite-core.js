/* Iris Green · El taller · núcleo común de los estudios creativos (R43).
   Una sola estructura de trabajo sobre el app shell R42 (A3): lienzo en el centro,
   herramientas abajo, estructura a la izquierda, propiedades en el panel contextual,
   órdenes con Ctrl/Cmd+K. Cada estudio aporta su propio motor.
   Privacidad: el trabajo solo sale del navegador cuando la persona descarga un archivo.
   No se usa almacenamiento del navegador. La etapa («para») solo se lee de la dirección. */
(function (root, document) {
  'use strict';
  if (root.IGSuite) return;

  var D = document;
  var LANG = String(D.documentElement.lang || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
  var VENDOR = '/assets/vendor/taller/';
  var VERSION = 'r43-1';

  /* ---------- Textos comunes (ES/EN) ---------- */
  var CORE = {
    es: {
      undo: 'Deshacer', redo: 'Rehacer', newProject: 'Nuevo', open: 'Abrir', save: 'Guardar proyecto',
      exportAs: 'Exportar', structure: 'Estructura', hideStructure: 'Ocultar estructura', showStructure: 'Mostrar estructura',
      tools: 'Herramientas', moreTools: 'Más herramientas', fewerTools: 'Menos herramientas',
      properties: 'Propiedades', nothingSelected: 'No hay nada seleccionado. Elige un elemento en el lienzo o en la lista Estructura.',
      loading: 'Preparando el estudio…', loadError: 'No se ha podido preparar el estudio. Recarga la página para intentarlo de nuevo.',
      ready: 'Ya puedes crear.', saved: 'Proyecto guardado en tu dispositivo como archivo.',
      opened: 'Proyecto abierto.', openError: 'Ese archivo no es un proyecto de este estudio o está dañado.',
      tooBig: 'El archivo es demasiado grande (máximo 8 MB).', undone: 'Deshecho: ', redone: 'Rehecho: ',
      nothingToUndo: 'No hay nada que deshacer.', nothingToRedo: 'No hay nada que rehacer.',
      startFrom: 'Empezar desde…', emptyProject: 'Proyecto vacío', emptyProjectDesc: 'Lienzo limpio, todas las herramientas.',
      replaceWarn: 'El trabajo actual se sustituye. Si quieres conservarlo, guárdalo antes como archivo.',
      close: 'Cerrar', start: 'Empezar', cancel: 'Cancelar', zoomIn: 'Acercar', zoomOut: 'Alejar', zoomFit: 'Ver todo',
      zoomLevel: 'Zoom: {n} %', exported: 'Descargado: {name}', paraNote: 'Estás viendo propuestas para {stage}. Todas las herramientas siguen disponibles.',
      paraAny: 'cualquier edad', paraChild: 'infancia', paraTeen: 'adolescencia', paraAdult: 'adultez',
      changePara: 'Cambiar en la portada del taller', keyboardTitle: 'Teclado',
      keyMove: 'Flechas: mover lo seleccionado (Mayús + flecha: paso largo)',
      keyDelete: 'Supr o Retroceso: borrar lo seleccionado', keyEscape: 'Esc: soltar la selección',
      keyUndo: 'Ctrl/Cmd + Z: deshacer · Ctrl/Cmd + Mayús + Z: rehacer', keyCommands: 'Ctrl/Cmd + K: buscar cualquier acción',
      keyZoom: '+ y −: zoom · 0: ver todo', keyTools: 'Números 1 a 9: elegir herramienta',
      techTitle: 'Detalles técnicos', techRenderer: 'Motor gráfico en uso: {r}', techPhysics: 'Motor físico en uso: {p}',
      techAudio: 'Audio: {a}', techNone: 'no se usa en este estudio', credit: 'Hecho en El taller de Iris Green · irisgreen.eu',
      selected: 'Seleccionado: {name}', deselected: 'Selección vacía.', deleted: 'Borrado: {name}', moved: '{name} en {pos}',
      sceneSummary: 'Descripción del lienzo', emptyScene: 'El lienzo está vacío.', noJsWarn: 'Este estudio necesita JavaScript.',
      unsaved: 'Hay cambios sin guardar en archivo.', fileMenu: 'Archivo', commandsHint: 'Ctrl/Cmd + K',
      mobileHint: 'Consejo: gira el móvil o usa un ordenador para ver más espacio. Todo se puede hacer también con los botones.'
    },
    en: {
      undo: 'Undo', redo: 'Redo', newProject: 'New', open: 'Open', save: 'Save project',
      exportAs: 'Export', structure: 'Structure', hideStructure: 'Hide structure', showStructure: 'Show structure',
      tools: 'Tools', moreTools: 'More tools', fewerTools: 'Fewer tools',
      properties: 'Properties', nothingSelected: 'Nothing is selected. Choose an item on the canvas or in the Structure list.',
      loading: 'Getting the studio ready…', loadError: 'The studio could not be prepared. Reload the page to try again.',
      ready: 'Ready to create.', saved: 'Project saved on your device as a file.',
      opened: 'Project opened.', openError: 'That file is not a project from this studio, or it is damaged.',
      tooBig: 'The file is too large (8 MB maximum).', undone: 'Undone: ', redone: 'Redone: ',
      nothingToUndo: 'Nothing to undo.', nothingToRedo: 'Nothing to redo.',
      startFrom: 'Start from…', emptyProject: 'Empty project', emptyProjectDesc: 'Clean canvas, every tool.',
      replaceWarn: 'This replaces your current work. If you want to keep it, save it as a file first.',
      close: 'Close', start: 'Start', cancel: 'Cancel', zoomIn: 'Zoom in', zoomOut: 'Zoom out', zoomFit: 'Fit to view',
      zoomLevel: 'Zoom: {n}%', exported: 'Downloaded: {name}', paraNote: 'You are seeing ideas for {stage}. Every tool is still available.',
      paraAny: 'any age', paraChild: 'childhood', paraTeen: 'adolescence', paraAdult: 'adulthood',
      changePara: 'Change this on the workshop home page', keyboardTitle: 'Keyboard',
      keyMove: 'Arrow keys: move the selection (Shift + arrow: bigger step)',
      keyDelete: 'Delete or Backspace: remove the selection', keyEscape: 'Esc: clear the selection',
      keyUndo: 'Ctrl/Cmd + Z: undo · Ctrl/Cmd + Shift + Z: redo', keyCommands: 'Ctrl/Cmd + K: find any action',
      keyZoom: '+ and −: zoom · 0: fit to view', keyTools: 'Numbers 1 to 9: choose a tool',
      techTitle: 'Technical details', techRenderer: 'Graphics engine in use: {r}', techPhysics: 'Physics engine in use: {p}',
      techAudio: 'Audio: {a}', techNone: 'not used in this studio', credit: 'Made in the Iris Green workshop · irisgreen.eu',
      selected: 'Selected: {name}', deselected: 'Nothing selected.', deleted: 'Removed: {name}', moved: '{name} at {pos}',
      sceneSummary: 'Canvas description', emptyScene: 'The canvas is empty.', noJsWarn: 'This studio needs JavaScript.',
      unsaved: 'There are changes not yet saved to a file.', fileMenu: 'File', commandsHint: 'Ctrl/Cmd + K',
      mobileHint: 'Tip: turn your phone sideways or use a computer for more space. Everything can also be done with the buttons.'
    }
  }[LANG];

  function studioStrings() {
    var node = D.getElementById('igs-i18n');
    if (!node) return {};
    try { return JSON.parse(node.textContent || '{}'); } catch (_) { return {}; }
  }
  var S = studioStrings();

  function fmt(str, vars) {
    return String(str == null ? '' : str).replace(/\{(\w+)\}/g, function (m, k) {
      return vars && vars[k] !== undefined ? String(vars[k]) : m;
    });
  }
  function t(key, vars) {
    var v = Object.prototype.hasOwnProperty.call(S, key) ? S[key] : CORE[key];
    return fmt(v === undefined ? key : v, vars);
  }
  function num(n, digits) {
    if (!isFinite(n)) return '—';
    var d = digits === undefined ? 1 : digits;
    return Number(n).toLocaleString(LANG === 'en' ? 'en-GB' : 'es-ES', { maximumFractionDigits: d, minimumFractionDigits: 0 });
  }

  /* ---------- Etapa: solo desde la dirección, nunca guardada ---------- */
  var PARA_ALIASES = {
    infancia: 'child', childhood: 'child', child: 'child',
    adolescencia: 'teen', adolescence: 'teen', teen: 'teen',
    adultez: 'adult', adulthood: 'adult', adult: 'adult',
    todas: 'any', any: 'any', 'cualquier-edad': 'any', 'any-age': 'any'
  };
  function readPara() {
    if (root.IGAudience && root.IGAudience.get) return ({AGE_0_12:'child',AGE_13_17:'teen',AGE_18_PLUS:'adult'})[root.IGAudience.get()] || 'any';
    var q;
    try { q = new URLSearchParams(root.location.search); } catch (_) { return 'any'; }
    var v = String(q.get('para') || q.get('for') || '').toLowerCase();
    return PARA_ALIASES[v] || 'any';
  }
  var PARA = readPara();
  function paraName(p) { return t({ child: 'paraChild', teen: 'paraTeen', adult: 'paraAdult' }[p] || 'paraAny'); }

  /* ---------- DOM ---------- */
  var SVGNS = 'http://www.w3.org/2000/svg';
  function h(tag, attrs) {
    var el = D.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'text') el.textContent = String(v);
      else if (k === 'class') el.className = v;
      else if (k === 'on') Object.keys(v).forEach(function (e) { el.addEventListener(e, v[e]); });
      else if (k === 'style') el.setAttribute('style', v);
      else if (k === 'dataset') Object.keys(v).forEach(function (d) { el.dataset[d] = v[d]; });
      else el.setAttribute(k, v === true ? '' : String(v));
    });
    for (var i = 2; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  }
  function add(parent, child) {
    if (child === null || child === undefined || child === false) return;
    if (Array.isArray(child)) { child.forEach(function (c) { add(parent, c); }); return; }
    parent.appendChild(child.nodeType ? child : D.createTextNode(String(child)));
  }
  function clear(el) { while (el && el.firstChild) el.removeChild(el.firstChild); return el; }

  /* Iconos de trazo (24×24). Decorativos: el nombre siempre va en texto visible. */
  var ICONS = {
    select: 'M5 3l13 8-6 1.5L9.5 19z', pan: 'M12 3v18M3 12h18M8 7l4-4 4 4M8 17l4 4 4-4M7 8l-4 4 4 4M17 8l4 4-4 4',
    line: 'M5 19L19 5M4 18a2 2 0 104 0 2 2 0 00-4 0M16 6a2 2 0 104 0 2 2 0 00-4 0', anchor: 'M4 20h16M8 20l4-8 4 8M12 12V5M10 5h4',
    weight: 'M7 9h10l3 11H4zM9 9a3 3 0 016 0', erase: 'M4 20h16M7 16l9-11 4 3-9 11H8z', play: 'M8 5v14l11-7z',
    stop: 'M7 7h10v10H7z', pause: 'M8 5v14M16 5v14', undo: 'M9 14L4 9l5-5M4 9h10a6 6 0 010 12h-3', redo: 'M15 14l5-5-5-5M20 9H10a6 6 0 000 12h3',
    plus: 'M12 5v14M5 12h14', minus: 'M5 12h14', fit: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
    file: 'M6 3h8l4 4v14H6zM14 3v4h4', download: 'M12 4v11M7 10l5 5 5-5M5 20h14', folder: 'M3 7h7l2 2h9v10H3z',
    layers: 'M12 4l9 5-9 5-9-5zM3 14l9 5 9-5', sliders: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4',
    help: 'M9 9a3 3 0 115 2c-1 .7-2 1.3-2 3M12 17v.5', grid: 'M4 4h16v16H4zM4 10h16M4 16h16M10 4v16M16 4v16',
    box: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5', sphere: 'M12 3a9 9 0 100 18 9 9 0 000-18M3 12c3 3 15 3 18 0',
    cylinder: 'M5 6c0-2 14-2 14 0v12c0 2-14 2-14 0zM5 6c0 2 14 2 14 0', move: 'M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3',
    rotate: 'M20 12a8 8 0 11-3-6.2M20 4v5h-5', scale: 'M4 20L20 4M14 4h6v6M4 14v6h6', copy: 'M8 8h11v12H8zM5 16V4h11',
    trash: 'M5 7h14M10 11v6M14 11v6M7 7l1 13h8l1-13M9 7V4h6v3', eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6',
    music: 'M9 18V6l11-2v12M9 18a3 3 0 11-6 0 3 3 0 016 0M20 16a3 3 0 11-6 0 3 3 0 016 0', note: 'M9 18V5l8 3M9 18a3 3 0 11-6 0 3 3 0 016 0',
    wave: 'M2 12c2-6 4-6 6 0s4 6 6 0 4-6 6 0 2 0 2 0', mic: 'M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3M5 11a7 7 0 0014 0M12 18v3',
    robot: 'M7 8h10v9H7zM12 4v4M9 12h.5M14.5 12h.5M5 11v3M19 11v3M9 20v-3M15 20v-3', code: 'M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16',
    blocks: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 16h7', flag: 'M5 21V4M5 4h11l-2 4 2 4H5', star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z',
    player: 'M12 4a3 3 0 100 6 3 3 0 000-6M6 21v-4a6 6 0 0112 0v4', coin: 'M12 4a8 8 0 100 16 8 8 0 000-16M12 8v8',
    enemy: 'M5 19V11a7 7 0 0114 0v8l-3-2-2 2-2-2-2 2-2-2zM9.5 11h.5M14 11h.5', text: 'M5 6V4h14v2M12 4v16M9 20h6',
    square: 'M5 5h14v14H5z', circle: 'M12 4a8 8 0 100 16 8 8 0 000-16', triangle: 'M12 4l9 16H3z', pen: 'M4 20l4-1 11-11-3-3L5 16zM14 6l3 3',
    projector: 'M3 8h14v8H3zM17 10l4-2v8l-4-2M7 12a2 2 0 104 0 2 2 0 00-4 0', corners: 'M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4',
    wall: 'M3 6h18v12H3zM3 12h18M9 6v6M15 12v6', door: 'M6 3h12v18H6zM14 12h.5', window: 'M4 5h16v14H4zM12 5v14M4 12h16',
    check: 'M5 12l5 5 9-10', warn: 'M12 3l10 18H2zM12 10v5M12 18v.5', sparkle: 'M12 3v6M12 15v6M3 12h6M15 12h6',
    bucket: 'M5 10l7-7 7 7-7 7zM19 14c1 2 2 3 2 4a2 2 0 01-4 0c0-1 1-2 2-4', eyedrop: 'M14 4l6 6-2 2-6-6zM12 8l-8 8v4h4l8-8',
    frame: 'M3 5h18v14H3zM7 5v14M17 5v14', onion: 'M6 6h10v10H6zM9 9h10v10H9z'
  };
  function icon(name) {
    var svg = D.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
    svg.setAttribute('class', 'igs-icon');
    var p = D.createElementNS(SVGNS, 'path'); p.setAttribute('d', ICONS[name] || ICONS.sparkle);
    svg.appendChild(p);
    return svg;
  }
  function button(label, opts) {
    opts = opts || {};
    var b = h('button', { type: 'button', class: 'igs-btn' + (opts.class ? ' ' + opts.class : ''), title: opts.title || null,
      'aria-pressed': opts.pressed === undefined ? null : String(!!opts.pressed), 'aria-keyshortcuts': opts.keys || null,
      dataset: opts.dataset || null });
    if (opts.icon) b.appendChild(icon(opts.icon));
    b.appendChild(h('span', { class: 'igs-btn-label', text: label }));
    if (opts.onClick) b.addEventListener('click', opts.onClick);
    if (opts.disabled) b.disabled = true;
    return b;
  }

  /* Campos del panel de propiedades: siempre con etiqueta visible y unidad. */
  var fieldSerial = 0;
  function fieldId() { fieldSerial += 1; return 'igs-f-' + fieldSerial; }
  var fields = {
    number: function (label, value, opts) {
      opts = opts || {}; var id = fieldId();
      var input = h('input', { id: id, type: 'number', inputmode: 'decimal', min: opts.min, max: opts.max, step: opts.step || 'any' });
      input.value = String(value);
      var wrap = h('div', { class: 'igs-field' }, h('label', { for: id, text: label }),
        h('div', { class: 'igs-field-row' }, input, opts.unit ? h('span', { class: 'igs-unit', text: opts.unit }) : null));
      input.addEventListener('change', function () {
        var v = parseFloat(String(input.value).replace(',', '.'));
        if (!isFinite(v)) { input.value = String(value); return; }
        if (opts.min !== undefined) v = Math.max(opts.min, v);
        if (opts.max !== undefined) v = Math.min(opts.max, v);
        input.value = String(v); value = v;
        if (opts.onChange) opts.onChange(v);
      });
      wrap.input = input; return wrap;
    },
    range: function (label, value, opts) {
      opts = opts || {}; var id = fieldId(), out = h('output', { for: id, class: 'igs-out' });
      var input = h('input', { id: id, type: 'range', min: opts.min, max: opts.max, step: opts.step || 1 });
      input.value = String(value); /* el valor después de min/max: si no, el navegador lo recorta */
      function show() { out.textContent = (opts.format ? opts.format(+input.value) : num(+input.value, 2)) + (opts.unit ? ' ' + opts.unit : ''); }
      input.addEventListener('input', function () { show(); if (opts.onInput) opts.onInput(+input.value); });
      input.addEventListener('change', function () { if (opts.onChange) opts.onChange(+input.value); });
      show();
      var wrap = h('div', { class: 'igs-field' }, h('div', { class: 'igs-field-head' }, h('label', { for: id, text: label }), out), input);
      wrap.input = input; return wrap;
    },
    select: function (label, value, options, opts) {
      opts = opts || {}; var id = fieldId();
      var sel = h('select', { id: id });
      options.forEach(function (o) { var op = h('option', { value: o[0], text: o[1] }); if (String(o[0]) === String(value)) op.selected = true; sel.appendChild(op); });
      sel.addEventListener('change', function () { if (opts.onChange) opts.onChange(sel.value); });
      var wrap = h('div', { class: 'igs-field' }, h('label', { for: id, text: label }), sel);
      wrap.input = sel; return wrap;
    },
    color: function (label, value, opts) {
      opts = opts || {}; var id = fieldId();
      var input = h('input', { id: id, type: 'color', value: value });
      input.addEventListener('input', function () { if (opts.onInput) opts.onInput(input.value); });
      input.addEventListener('change', function () { if (opts.onChange) opts.onChange(input.value); });
      var wrap = h('div', { class: 'igs-field igs-field-inline' }, h('label', { for: id, text: label }), input);
      wrap.input = input; return wrap;
    },
    text: function (label, value, opts) {
      opts = opts || {}; var id = fieldId();
      var input = h(opts.multiline ? 'textarea' : 'input', { id: id, type: opts.multiline ? null : 'text', maxlength: opts.max || 200, rows: opts.multiline ? 3 : null });
      input.value = value || '';
      input.addEventListener('change', function () { if (opts.onChange) opts.onChange(input.value); });
      var wrap = h('div', { class: 'igs-field' }, h('label', { for: id, text: label }), input);
      wrap.input = input; return wrap;
    },
    check: function (label, value, opts) {
      opts = opts || {}; var id = fieldId();
      var input = h('input', { id: id, type: 'checkbox' }); input.checked = !!value;
      input.addEventListener('change', function () { if (opts.onChange) opts.onChange(input.checked); });
      var wrap = h('div', { class: 'igs-field igs-check' }, input, h('label', { for: id, text: label }));
      wrap.input = input; return wrap;
    },
    choice: function (label, value, options, opts) {
      /* Grupo de botones excluyentes (radiogroup nativo con aspecto de segmento). */
      opts = opts || {}; var name = fieldId();
      var fs = h('fieldset', { class: 'igs-field igs-choice' }, h('legend', { text: label }));
      var row = h('div', { class: 'igs-choice-row' });
      options.forEach(function (o) {
        var id = fieldId(), input = h('input', { type: 'radio', id: id, name: name, value: o[0] });
        if (String(o[0]) === String(value)) input.checked = true;
        input.addEventListener('change', function () { if (input.checked && opts.onChange) opts.onChange(o[0]); });
        row.appendChild(h('span', { class: 'igs-choice-item' }, input, h('label', { for: id, text: o[1] })));
      });
      fs.appendChild(row); return fs;
    }
  };

  /* ---------- Anuncios para lectores de pantalla ---------- */
  var live = null, liveTimer = 0;
  function announce(msg) {
    if (!live) return;
    root.clearTimeout(liveTimer);
    live.textContent = '';
    liveTimer = root.setTimeout(function () { live.textContent = String(msg); }, 40);
  }

  /* ---------- Carga diferida de bibliotecas (solo en el estudio que las usa) ---------- */
  var LIBS = {
    pixi: ['pixi.js'], planck: ['planck.js'], three: ['three.js'], tone: ['tone.js'],
    blockly: ['blockly.js', 'blockly-msg-' + LANG + '.js', 'blockly-msg-extra.js'], codemirror: ['codemirror.js'], acorn: ['acorn.js']
  };
  var loaded = {};
  function loadScript(src) {
    if (loaded[src]) return loaded[src];
    loaded[src] = new Promise(function (resolve, reject) {
      var s = D.createElement('script');
      s.src = VENDOR + src + '?v=' + VERSION;
      s.async = false;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('No se pudo cargar ' + src)); };
      D.head.appendChild(s);
    });
    return loaded[src];
  }
  function loadLib(name) {
    var list = LIBS[name] || [];
    return list.reduce(function (p, src) { return p.then(function () { return loadScript(src); }); }, Promise.resolve());
  }
  function load(names) { return Promise.all((names || []).map(loadLib)); }

  /* ---------- Historial (deshacer/rehacer por instantáneas) ---------- */
  function History(getState, setState, limit) {
    this.get = getState; this.set = setState; this.limit = limit || 120;
    this.past = []; this.future = []; this.current = JSON.stringify(getState());
  }
  History.prototype.commit = function (label) {
    var next = JSON.stringify(this.get());
    if (next === this.current) return false;
    this.past.push({ state: this.current, label: label || '' });
    if (this.past.length > this.limit) this.past.shift();
    this.future = []; this.current = next;
    return true;
  };
  History.prototype.reset = function () { this.past = []; this.future = []; this.current = JSON.stringify(this.get()); };
  History.prototype.undo = function () {
    var e = this.past.pop(); if (!e) return null;
    this.future.push({ state: this.current, label: e.label });
    this.current = e.state; this.set(JSON.parse(e.state)); return e.label || '·';
  };
  History.prototype.redo = function () {
    var e = this.future.pop(); if (!e) return null;
    this.past.push({ state: this.current, label: e.label });
    this.current = e.state; this.set(JSON.parse(e.state)); return e.label || '·';
  };

  /* ---------- Archivos ---------- */
  function download(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = h('a', { href: url, download: name, hidden: true });
    D.body.appendChild(a); a.click();
    root.setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1500);
    announce(t('exported', { name: name }));
  }
  function stamp() {
    var d = new Date();
    function p(n) { return (n < 10 ? '0' : '') + n; }
    return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + p(d.getHours()) + p(d.getMinutes());
  }
  function pickFile(accept) {
    return new Promise(function (resolve) {
      var input = h('input', { type: 'file', accept: accept || '', hidden: true });
      input.addEventListener('change', function () { var f = input.files && input.files[0]; input.remove(); resolve(f || null); });
      D.body.appendChild(input); input.click();
    });
  }
  /* PNG con franja de crédito debajo: no tapa nada del trabajo. */
  function canvasWithCredit(source, background) {
    var pad = Math.max(28, Math.round(source.height * 0.045));
    var c = D.createElement('canvas'); c.width = source.width; c.height = source.height + pad;
    var x = c.getContext('2d');
    x.fillStyle = background || '#ffffff'; x.fillRect(0, 0, c.width, c.height);
    x.drawImage(source, 0, 0);
    x.fillStyle = '#f4f7fa'; x.fillRect(0, source.height, c.width, pad);
    x.fillStyle = '#17395c'; x.font = Math.round(pad * 0.42) + 'px Atkinson Hyperlegible, Arial, sans-serif';
    x.textAlign = 'right'; x.textBaseline = 'middle';
    x.fillText('IRIS GREEN · irisgreen.eu', c.width - Math.round(pad * 0.5), source.height + pad / 2);
    return c;
  }
  function canvasBlob(c) { return new Promise(function (resolve) { c.toBlob(function (b) { resolve(b); }, 'image/png'); }); }

  /* Azar reproducible (mulberry32): la misma semilla da siempre el mismo resultado. */
  function rng(seed) {
    var a = (typeof seed === 'number' ? seed : String(seed || '').split('').reduce(function (s, ch) { return Math.imul(s ^ ch.charCodeAt(0), 2654435761) >>> 0; }, 2166136261)) >>> 0;
    return function () { a = (a + 0x6D2B79F5) >>> 0; var t2 = a; t2 = Math.imul(t2 ^ (t2 >>> 15), t2 | 1); t2 ^= t2 + Math.imul(t2 ^ (t2 >>> 7), t2 | 61); return ((t2 ^ (t2 >>> 14)) >>> 0) / 4294967296; };
  }
  /* SVG como texto listo para descargar (con declaración XML y espacio de nombres). */
  function svgText(svg) {
    var c = svg.cloneNode(true); c.setAttribute('xmlns', SVGNS);
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(c);
  }
  /* Imprimir hojas a escala real con el diálogo del navegador (también sirve para «Guardar como PDF»).
     pages: nodos (normalmente <svg> con width/height en mm). Solo se imprime esto; la página no cambia. */
  function printPages(pages, opts) {
    opts = opts || {};
    var old = D.querySelector('.igs-print-root'); if (old) old.remove();
    var rootEl = h('div', { class: 'igs-print-root', 'aria-hidden': 'true', dataset: { orient: opts.landscape ? 'landscape' : 'portrait' } });
    (pages || []).forEach(function (pg) { rootEl.appendChild(h('div', { class: 'igs-print-page' }, pg)); });
    D.body.appendChild(rootEl); D.documentElement.classList.add('igs-printing');
    if (opts.landscape) D.documentElement.classList.add('igs-print-landscape');
    if (opts.page) rootEl.style.setProperty('--igs-print-size', opts.page);
    var finished = false;
    function done() { if (finished) return; finished = true; D.documentElement.classList.remove('igs-printing', 'igs-print-landscape'); rootEl.remove(); root.removeEventListener('afterprint', done); }
    root.addEventListener('afterprint', done);
    root.setTimeout(function () { if (!finished) root.print(); }, 60);
  }

  /* SVG (elemento o texto) a PNG con el crédito debajo. */
  function svgToPng(svg, opts) {
    opts = opts || {};
    var txt = typeof svg === 'string' ? svg : svgText(svg);
    var scale = opts.scale || 2, w = Math.max(1, Math.round((opts.width || 800) * scale)), hh = Math.max(1, Math.round((opts.height || 600) * scale));
    return new Promise(function (resolve, reject) {
      var img = new Image();
      var url = URL.createObjectURL(new Blob([txt], { type: 'image/svg+xml' }));
      img.onload = function () {
        var c = D.createElement('canvas'); c.width = w; c.height = hh;
        var x = c.getContext('2d');
        x.fillStyle = opts.background || '#ffffff'; x.fillRect(0, 0, w, hh);
        x.drawImage(img, 0, 0, w, hh);
        URL.revokeObjectURL(url);
        resolve(opts.credit === false ? c : canvasWithCredit(c, opts.background || '#ffffff'));
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('SVG')); };
      img.src = url;
    });
  }
  function parseSVG(txt) {
    var doc = new DOMParser().parseFromString(String(txt), 'image/svg+xml');
    if (doc.querySelector('parsererror')) throw new Error('SVG');
    return D.importNode(doc.documentElement, true);
  }

  /* ---------- Vista 2D: desplazamiento y zoom con ratón, dedo o teclado ---------- */
  function View2D(opts) {
    this.x = 0; this.y = 0; this.scale = opts && opts.scale || 1;
    this.min = opts && opts.min || 0.2; this.max = opts && opts.max || 8;
    this.onChange = opts && opts.onChange || function () {};
  }
  View2D.prototype.toWorld = function (sx, sy) { return { x: (sx - this.x) / this.scale, y: (sy - this.y) / this.scale }; };
  View2D.prototype.toScreen = function (wx, wy) { return { x: wx * this.scale + this.x, y: wy * this.scale + this.y }; };
  View2D.prototype.zoomAt = function (sx, sy, factor) {
    var s = Math.max(this.min, Math.min(this.max, this.scale * factor));
    var w = this.toWorld(sx, sy); this.scale = s;
    this.x = sx - w.x * s; this.y = sy - w.y * s; this.onChange();
  };
  View2D.prototype.fit = function (box, width, height, margin) {
    var m = margin === undefined ? 40 : margin;
    var bw = Math.max(1e-6, box.maxX - box.minX), bh = Math.max(1e-6, box.maxY - box.minY);
    var s = Math.min((width - 2 * m) / bw, (height - 2 * m) / bh);
    this.scale = Math.max(this.min, Math.min(this.max, s));
    this.x = width / 2 - (box.minX + bw / 2) * this.scale; this.y = height / 2 - (box.minY + bh / 2) * this.scale;
    this.onChange();
  };
  /* Conecta gestos de vista: rueda (zoom), botón central o espacio+arrastre (mover), dos dedos (pellizcar).
     Nunca combina lápiz y dedo: con lápiz activo se ignoran los dedos (iPad). */
  function attachViewGestures(el, view, opts) {
    opts = opts || {};
    var touches = {}, pinch = null, panning = null, spaceDown = false, penActive = false;
    el.addEventListener('wheel', function (e) {
      e.preventDefault();
      var r = el.getBoundingClientRect();
      if (e.ctrlKey || e.metaKey || !opts.wheelPans) view.zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * 0.0015));
      else { view.x -= e.deltaX; view.y -= e.deltaY; view.onChange(); }
    }, { passive: false });
    D.addEventListener('keydown', function (e) { if (e.code === 'Space' && el.contains(D.activeElement)) spaceDown = true; });
    D.addEventListener('keyup', function (e) { if (e.code === 'Space') spaceDown = false; });
    el.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'pen') penActive = true;
      if (e.pointerType === 'touch') {
        if (penActive) return;
        touches[e.pointerId] = { x: e.clientX, y: e.clientY };
        var ids = Object.keys(touches);
        if (ids.length === 2) {
          var a = touches[ids[0]], b = touches[ids[1]];
          pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
          if (opts.onGestureStart) opts.onGestureStart();
          e.stopImmediatePropagation(); return;
        }
      }
      if (e.button === 1 || (e.button === 0 && (spaceDown || (opts.isPanTool && opts.isPanTool())))) {
        panning = { x: e.clientX, y: e.clientY }; el.setPointerCapture(e.pointerId);
        el.classList.add('igs-panning'); e.stopImmediatePropagation(); e.preventDefault();
      }
    }, true);
    el.addEventListener('pointermove', function (e) {
      if (pinch && touches[e.pointerId]) {
        touches[e.pointerId] = { x: e.clientX, y: e.clientY };
        var ids = Object.keys(touches); if (ids.length < 2) return;
        var a = touches[ids[0]], b = touches[ids[1]], r = el.getBoundingClientRect();
        var d = Math.hypot(a.x - b.x, a.y - b.y), cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
        view.x += cx - pinch.cx; view.y += cy - pinch.cy;
        view.zoomAt(cx - r.left, cy - r.top, d / Math.max(1, pinch.d));
        pinch = { d: d, cx: cx, cy: cy }; e.stopImmediatePropagation(); return;
      }
      if (panning) {
        view.x += e.clientX - panning.x; view.y += e.clientY - panning.y;
        panning = { x: e.clientX, y: e.clientY }; view.onChange(); e.stopImmediatePropagation();
      }
    }, true);
    function end(e) {
      if (e.pointerType === 'pen') penActive = false;
      if (touches[e.pointerId]) { delete touches[e.pointerId]; if (Object.keys(touches).length < 2) pinch = null; }
      if (panning) { panning = null; el.classList.remove('igs-panning'); e.stopImmediatePropagation(); }
    }
    el.addEventListener('pointerup', end, true);
    el.addEventListener('pointercancel', end, true);
    return { isGesturing: function () { return !!pinch || !!panning; } };
  }

  /* ---------- Toolbar con foco itinerante (patrón ARIA toolbar) ---------- */
  function rovingToolbar(bar) {
    function items() { return Array.prototype.filter.call(bar.querySelectorAll('button,select,input'), function (b) { return !b.disabled && b.offsetParent !== null && !b.closest('[hidden]'); }); }
    function sync(active) { items().forEach(function (b) { b.tabIndex = b === active ? 0 : -1; }); }
    if (bar._igRoving) { var first0 = items()[0]; if (first0) sync(first0); return bar._igRoving; }
    bar.addEventListener('keydown', function (e) {
      var list = items(), i = list.indexOf(D.activeElement); if (i < 0) return;
      if (D.activeElement.tagName === 'SELECT' || D.activeElement.tagName === 'INPUT') return;
      var n = i;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % list.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + list.length) % list.length;
      else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = list.length - 1; else return;
      e.preventDefault(); sync(list[n]); list[n].focus();
    });
    bar.addEventListener('focusin', function (e) { if (items().indexOf(e.target) >= 0) sync(e.target); });
    var first = items()[0]; if (first) sync(first);
    bar._igRoving = { refresh: function () { var cur = items().filter(function (b) { return b.tabIndex === 0; })[0] || items()[0]; if (cur) sync(cur); } };
    return bar._igRoving;
  }

  /* Conservar el foco al reconstruir un panel: se marca cada control con data-igs-k. */
  function keepFocus(host, render) {
    var act = D.activeElement;
    var key = act && host && host.contains(act) ? (act.getAttribute('data-igs-k') || null) : null;
    var sel = key && act.setSelectionRange && act.type !== 'number' ? [act.selectionStart, act.selectionEnd] : null;
    render();
    if (!key) return;
    var next = host.querySelector('[data-igs-k="' + (root.CSS && CSS.escape ? CSS.escape(key) : key).replace(/"/g, '\\"') + '"]');
    if (!next) return;
    try { next.focus({ preventScroll: true }); } catch (_) { next.focus(); }
    if (sel && next.setSelectionRange) { try { next.setSelectionRange(sel[0], sel[1]); } catch (_) {} }
  }

  /* ---------- Diálogo con el mismo estilo que el app shell ---------- */
  var dlgSerial = 0;
  function dialog(title, opts) {
    opts = opts || {}; dlgSerial += 1;
    var hid = 'igs-dlg-' + dlgSerial;
    var dlg = h('dialog', { class: 'ig-r42-dialog igs-dialog' + (opts.wide ? ' igs-dialog-wide' : ''), 'aria-labelledby': hid });
    var closeBtn = h('button', { type: 'button', class: 'ig-r42-icon-button', 'aria-label': t('close'), text: '×' });
    var body = h('div', { class: 'ig-r42-dialog-body' });
    dlg.appendChild(h('div', { class: 'ig-r42-dialog-head' }, h('h2', { id: hid, text: title }), closeBtn));
    dlg.appendChild(body);
    function close() {
      if (dlg.open) dlg.close();
      var tr = dlg._igTrigger; if (tr && tr.isConnected) { try { tr.focus({ preventScroll: true }); } catch (_) { tr.focus(); } }
    }
    closeBtn.addEventListener('click', close);
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); close(); });
    D.body.appendChild(dlg);
    return {
      node: dlg, body: body, close: close,
      open: function (trigger) { dlg._igTrigger = trigger || D.activeElement; if (!dlg.open) dlg.showModal(); var f = body.querySelector('[autofocus],button,input,select,textarea,a[href]'); if (f) f.focus(); }
    };
  }

  /* ---------- Estudio ---------- */
  var ENGINES = {};
  function defineEngine(id, def) {
    ENGINES[id] = def;
    // Deferred scripts may still be arriving while readyState is interactive.
    // Retry when the actual engine registers; mountStudio is idempotent.
    if (D.readyState !== 'loading') root.setTimeout(mountStudio, 0);
  }

  function mountStudio() {
    var app = D.getElementById('igt-app');
    if (!app || app.dataset.igsMounted === 'true') return;
    var engineId = app.dataset.igsEngine;
    var def = ENGINES[engineId];
    if (!def) return;
    app.dataset.igsMounted = 'true';
    var nojs = app.querySelector('.igt-nojs'); if (nojs) nojs.hidden = true;

    var studioName = String((D.getElementById('igt-title') || {}).textContent || '').trim();
    var ctx = { t: t, fmt: fmt, num: num, lang: LANG, para: PARA, h: h, icon: icon, button: button, fields: fields, clear: clear,
      announce: announce, download: download, stamp: stamp, pickFile: pickFile, rng: rng, svgText: svgText, printPages: printPages, svgToPng: svgToPng, parseSVG: parseSVG, keepFocus: keepFocus, canvasWithCredit: canvasWithCredit, canvasBlob: canvasBlob,
      View2D: View2D, attachViewGestures: attachViewGestures, dialog: dialog, load: load, studio: engineId, studioName: studioName,
      reducedMotion: function () { return ['off', 'reduced'].indexOf(D.documentElement.dataset.igMotion) >= 0 || (root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches); },
      tech: { renderer: null, physics: null, audio: null } };
    root.addEventListener('ig:audience-change', function () { PARA=readPara();ctx.para=PARA;root.IGSuite.para=PARA; });

    /* Barra de proyecto: las dos primeras van a la barra de contexto del shell; el resto, al menú Archivo. */
    var projectBar = h('div', { class: 'igt-bar', role: 'toolbar', 'aria-label': t('fileMenu') });
    var undoBtn = button(t('undo'), { icon: 'undo', keys: 'Control+Z Meta+Z', class: 'igs-undo' });
    var redoBtn = button(t('redo'), { icon: 'redo', keys: 'Control+Shift+Z Meta+Shift+Z', class: 'igs-redo' });
    var newBtn = button(t('newProject') + '…', { icon: 'file' });
    var openBtn = button(t('open') + '…', { icon: 'folder' });
    var saveBtn = button(t('save'), { icon: 'download', keys: 'Control+S Meta+S' });
    projectBar.append(undoBtn, redoBtn, newBtn, openBtn, saveBtn);
    var topbar = h('div', { class: 'igt-topbar' }, projectBar);

    var structureList = h('div', { class: 'igs-structure-body' });
    var structureToggle = h('button', { type: 'button', class: 'igs-structure-toggle', 'aria-expanded': 'true' }, icon('layers'), h('span', { text: t('structure') }));
    var structure = h('nav', { class: 'igs-structure', 'aria-label': t('structure') }, structureToggle, structureList);
    var vpRole = def.viewportRole || 'application';
    var viewport = h('div', { class: 'igs-viewport', tabindex: vpRole === 'application' ? '0' : null, role: vpRole,
      'aria-roledescription': vpRole === 'application' ? (t('canvasRole') === 'canvasRole' ? (LANG === 'en' ? 'canvas' : 'lienzo') : t('canvasRole')) : null,
      'aria-label': t('canvasLabel'), 'aria-describedby': 'igs-scene-summary igs-canvas-help' });
    var sceneSummary = h('div', { id: 'igs-scene-summary', class: 'igs-sr' });
    var canvasHelp = h('p', { id: 'igs-canvas-help', class: 'igs-sr', text: t('canvasHelp') });
    var loading = h('p', { class: 'igs-loading', role: 'status', text: t('loading') });
    viewport.appendChild(loading);
    var toolbar = h('div', { class: 'igs-toolbar', role: 'toolbar', 'aria-label': t('tools') });
    var moreToggle = h('button', { type: 'button', class: 'igs-btn igs-more', 'aria-expanded': 'false' }, icon('sliders'), h('span', { class: 'igs-btn-label', text: t('moreTools') }));
    var statusLine = h('p', { class: 'igs-status-line', role: 'status' });
    var center = h('div', { class: 'igs-center' }, viewport, toolbar, statusLine, sceneSummary, canvasHelp);
    var work = h('div', { class: 'igt-work igs-work' }, structure, center);
    var inspectorBody = h('div', { class: 'igs-inspector-body' });
    var side = h('div', { class: 'igt-side igs-inspector' }, h('h3', { class: 'igs-inspector-title', text: t('properties') }), inspectorBody);
    live = h('p', { class: 'igs-sr', role: 'status', 'aria-live': 'polite' });
    clear(app);
    app.append(topbar, work, side, live);
    app.classList.add('igs-app');
    app.dataset.igsTools = PARA === 'child' ? 'essential' : 'all';
    moreToggle.setAttribute('aria-expanded', String(app.dataset.igsTools === 'all'));
    moreToggle.querySelector('.igs-btn-label').textContent = app.dataset.igsTools === 'all' ? t('fewerTools') : t('moreTools');

    /* Estructura plegable: abierta en escritorio ancho, cerrada en pantallas estrechas. */
    function setStructure(open) {
      structure.dataset.open = String(open); structureToggle.setAttribute('aria-expanded', String(open));
      structureToggle.setAttribute('aria-label', open ? t('hideStructure') : t('showStructure'));
    }
    setStructure(root.innerWidth >= 1100 && def.structureOpen !== false);
    structureToggle.addEventListener('click', function () { setStructure(structure.dataset.open !== 'true'); });

    /* Ayuda del estudio: etapa y teclado dentro del diálogo Ayuda del shell. */
    /* R47 workspace-first: la guía de lectura no va delante de la herramienta.
       El app shell ya lleva la portadilla y «Cómo se usa» al diálogo Ayuda; aquí van el resto
       de secciones, para que el primer viewport sea el espacio de trabajo. */
    function moveGuideIntoHelp() {
      var guide = D.getElementById('igs-guide'); if (!guide) return;
      var how = D.getElementById('igt-how'), hs = how && how.closest('section');
      var dlgBody = hs && hs.closest('.ig-r42-dialog-body');
      if (!dlgBody) { guide.dataset.igsGuide = 'page'; return; }
      while (guide.firstChild) dlgBody.appendChild(guide.firstChild);
      guide.remove();
      app.dataset.igsGuide = 'help';
    }
    function helpAddons() {
      var how = D.getElementById('igt-how'); var sec = how && how.closest('section'); if (!sec || sec.querySelector('.igs-keys')) return;
      if (PARA !== 'any') {
        var home = LANG === 'en' ? '/en/workshop/' : '/es/taller/';
        sec.appendChild(h('p', { class: 'igs-para-note' }, t('paraNote', { stage: paraName(PARA) }) + ' ', h('a', { href: home + '?para=' + ({ child: LANG === 'en' ? 'childhood' : 'infancia', teen: LANG === 'en' ? 'adolescence' : 'adolescencia', adult: LANG === 'en' ? 'adulthood' : 'adultez' })[PARA], text: t('changePara') })));
      }
      var keys = h('ul', { class: 'igs-keys' });
      ['keyMove', 'keyDelete', 'keyEscape', 'keyUndo', 'keyCommands', 'keyZoom', 'keyTools'].concat(def.extraKeys || []).forEach(function (k) { keys.appendChild(h('li', { text: t(k) })); });
      sec.appendChild(h('h3', { text: t('keyboardTitle') })); sec.appendChild(keys);
      var tech = h('ul', { class: 'igs-tech' });
      sec.appendChild(h('h3', { text: t('techTitle') })); sec.appendChild(tech);
      ctx._techList = tech; renderTech();
    }
    function renderTech() {
      if (!ctx._techList) return; clear(ctx._techList);
      ctx._techList.appendChild(h('li', { text: t('techRenderer', { r: ctx.tech.renderer || t('techNone') }) }));
      ctx._techList.appendChild(h('li', { text: t('techPhysics', { p: ctx.tech.physics || t('techNone') }) }));
      ctx._techList.appendChild(h('li', { text: t('techAudio', { a: ctx.tech.audio || t('techNone') }) }));
    }
    ctx.setTech = function (k, v) { ctx.tech[k] = v; renderTech(); };

    /* Proyecto e historial */
    var dirty = false;
    function setDirty(v, eventName) {
      dirty = v; app.dataset.igsDirty = String(v);
      var ev = eventName === undefined ? (v ? 'ig:project-dirty' : 'ig:project-saved') : eventName;
      if (ev) { try { D.dispatchEvent(new CustomEvent(ev)); } catch (_) {} }
      if (!v && eventName === null && root.IGR42Shell && root.IGR42Shell.setStatus) root.IGR42Shell.setStatus('ready');
    }
    var history = null;
    function updateUndo() {
      if (!history) return;
      undoBtn.disabled = !history.past.length; redoBtn.disabled = !history.future.length;
    }
    ctx.commit = function (label) { if (history && history.commit(label)) { setDirty(true); updateUndo(); } };
    ctx.resetHistory = function () { if (history) history.reset(); updateUndo(); };
    function doUndo() { if (!history) return; var l = history.undo(); announce(l ? t('undone') + l : t('nothingToUndo')); if (l) setDirty(true); updateUndo(); }
    function doRedo() { if (!history) return; var l = history.redo(); announce(l ? t('redone') + l : t('nothingToRedo')); if (l) setDirty(true); updateUndo(); }
    undoBtn.addEventListener('click', doUndo); redoBtn.addEventListener('click', doRedo);

    function projectName() { return (def.fileBase || engineId) + '-' + stamp(); }
    function saveProject() {
      var data = { formato: 'iris-green-taller', estudio: engineId, version: def.version || 1, datos: engine.serialize() };
      download(new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' }), projectName() + '.igtaller.json');
      setDirty(false); announce(t('saved'));
    }
    function openProject() {
      pickFile('.json,.igtaller.json,application/json').then(function (file) {
        if (!file) return;
        if (file.size > 8 * 1024 * 1024) { announce(t('tooBig')); ctx.setStatus(t('tooBig')); return; }
        file.text().then(function (txt) {
          var data; try { data = JSON.parse(txt); } catch (_) { data = null; }
          if (!data || data.formato !== 'iris-green-taller' || data.estudio !== engineId || !data.datos || !engine.validate(data.datos)) {
            announce(t('openError')); ctx.setStatus(t('openError')); return;
          }
          app.igCreative.replaceProject(function () { engine.restore(data.datos); }, t('opened')); setDirty(false, 'ig:project-opened'); announce(t('opened')); ctx.setStatus(t('opened'));
        });
      });
    }
    saveBtn.addEventListener('click', saveProject); openBtn.addEventListener('click', openProject);

    /* Nuevo… con puntos de partida por intención; la etapa solo ordena la lista. */
    var newDlg = dialog(t('startFrom'), { wide: true });
    function openNew(trigger) {
      clear(newDlg.body);

      var list = h('ul', { class: 'igs-starts' });
      var starts = (def.starts ? def.starts(ctx) : []).slice();
      starts.sort(function (a, b) { return (b.para === PARA ? 1 : 0) - (a.para === PARA ? 1 : 0); });
      [{ id: 'empty', title: t('emptyProject'), desc: t('emptyProjectDesc') }].concat(starts).forEach(function (s) {
        var b = h('button', { type: 'button', class: 'igs-start' }, h('strong', { text: s.title }), h('span', { text: s.desc || '' }));
        b.addEventListener('click', function () {
          newDlg.close(); app.igCreative.replaceProject(function () { engine.start(s.id); }, s.title); setDirty(true);
        });
        list.appendChild(h('li', null, b));
      });
      newDlg.body.appendChild(list); newDlg.open(trigger);
    }
    newBtn.addEventListener('click', function () { openNew(newBtn); });

    /* Herramientas */
    var toolButtons = {}, currentTool = null, roving = null;
    ctx.setTools = function (tools, opts) {
      opts = opts || {};
      clear(toolbar); toolButtons = {};
      tools.forEach(function (tl, i) {
        if (tl.separator) { toolbar.appendChild(h('span', { class: 'igs-sep', role: 'separator', 'aria-orientation': 'vertical' })); return; }
        if (tl.node) { if (tl.level === 'more') tl.node.dataset.level = 'more'; toolbar.appendChild(tl.node); return; }
        var b = button(tl.label, { icon: tl.icon, pressed: tl.action ? undefined : false, keys: tl.keys || (i < 9 && !tl.action ? String(i + 1) : null), class: tl.primary ? 'igs-primary' : '' });
        if (tl.level === 'more') b.dataset.level = 'more';
        if (tl.action) b.addEventListener('click', function () { tl.action(b); });
        else { b.dataset.tool = tl.id; b.addEventListener('click', function () { ctx.selectTool(tl.id); }); toolButtons[tl.id] = b; }
        if (tl.title) b.title = tl.title;
        toolbar.appendChild(b);
      });
      toolbar.appendChild(h('span', { class: 'igs-sep', role: 'separator', 'aria-orientation': 'vertical' }));
      toolbar.appendChild(moreToggle);
      roving = rovingToolbar(toolbar);
      if (opts.initial) ctx.selectTool(opts.initial);
    };
    ctx.selectTool = function (id) {
      currentTool = id;
      Object.keys(toolButtons).forEach(function (k) { toolButtons[k].setAttribute('aria-pressed', String(k === id)); });
      viewport.dataset.tool = id;
      if (engine && engine.onTool) engine.onTool(id);
    };
    ctx.tool = function () { return currentTool; };
    ctx.toolButton = function (id) { return toolButtons[id]; };
    moreToggle.addEventListener('click', function () {
      var all = app.dataset.igsTools !== 'all';
      app.dataset.igsTools = all ? 'all' : 'essential';
      moreToggle.setAttribute('aria-expanded', String(all));
      moreToggle.querySelector('.igs-btn-label').textContent = all ? t('fewerTools') : t('moreTools');
      if (roving) roving.refresh();
    });

    /* Panel de propiedades */
    ctx.setInspector = function (nodes) {
      clear(inspectorBody);
      if (!nodes || (Array.isArray(nodes) && !nodes.length)) { inspectorBody.appendChild(h('p', { class: 'igs-muted', text: t('nothingSelected') })); return; }
      add(inspectorBody, nodes);
    };
    ctx.setStructure = function (nodes) { clear(structureList); add(structureList, nodes); };
    ctx.setSummary = function (text) { sceneSummary.textContent = text || t('emptyScene'); };
    ctx.setStatus = function (text) { statusLine.textContent = text || ''; statusLine.hidden = !text; };
    statusLine.hidden = true;
    ctx.viewport = viewport; ctx.toolbar = toolbar; ctx.app = app; ctx.inspector = inspectorBody; ctx.structure = structureList;

    /* Menú Exportar: se añade al menú Archivo del shell como botones normales. */
    var exportButtons = [];
    ctx.addExport = function (label, run, iconName) {
      var b = button(label, { icon: iconName || 'download' });
      b.addEventListener('click', function () { try { run(b); } catch (err) { announce(String(err && err.message || err)); } });
      exportButtons.push(b);
      var menu = D.getElementById('ig-r42-file-menu');
      if (menu) { b.classList.add('ig-r42-action'); menu.appendChild(b); } else projectBar.appendChild(b);
      return b;
    };

    /* Órdenes (Ctrl/Cmd+K) */
    var pendingCommands = [];
    ctx.command = function (id, label, desc, run) {
      if (root.IGR42Shell && root.IGR42Shell.registerAction) root.IGR42Shell.registerAction('igs-' + id, label, desc || studioName, run);
      else pendingCommands.push([id, label, desc, run]);
    };

    /* Teclado global del estudio */
    function isEditable(n) { return !!(n && (n.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(n.tagName) || (n.closest && n.closest('.cm-editor,.blocklyWidgetDiv,.injectionDiv,.igs-no-shortcuts')))); }
    function inStudio(n) {
      if (!n || n === D.body) return true;
      if (app.contains(n)) return true;
      /* El app shell R42 mueve Propiedades y la barra de contexto fuera de #igt-app. */
      return !!(n.closest && n.closest('.igs-inspector,.ig-r42-inspector,.ig-r42-context,.ig-r42-workspace'));
    }
    D.addEventListener('keydown', function (e) {
      if (!inStudio(e.target)) return;
      if (isEditable(e.target)) return;
      var mod = e.ctrlKey || e.metaKey, k = String(e.key).toLowerCase();
      if (mod && k === 'z' && !e.shiftKey) { e.preventDefault(); doUndo(); return; }
      if (mod && ((k === 'z' && e.shiftKey) || k === 'y')) { e.preventDefault(); doRedo(); return; }
      if (mod && k === 's') { e.preventDefault(); saveProject(); return; }
      if (engine && engine.onKey && engine.onKey(e) === true) { e.preventDefault(); return; }
      if (!mod && !e.altKey && /^[1-9]$/.test(e.key) && (viewport.contains(e.target) || toolbar.contains(e.target))) {
        var ids = Object.keys(toolButtons); var id = ids[+e.key - 1];
        if (id && toolButtons[id].offsetParent !== null) { e.preventDefault(); ctx.selectTool(id); announce(toolButtons[id].textContent); }
      }
    });
    ctx.isEditable = isEditable;
    ctx.undo = doUndo; ctx.redo = doRedo; ctx.saveProject = saveProject; ctx.openProject = openProject;

    var engine = null;
    function start() {
      Promise.resolve(def.libs ? load(def.libs) : null).then(function () {
        return def.create(ctx);
      }).then(function (eng) {
        engine = eng;
        history = new History(function () { return engine.serialize(); }, function (s) { engine.restore(s); }, def.historyLimit);
        updateUndo();
        loading.remove();
        app.dataset.igsReady = 'true';
        app.igCreative = { engine: engine, ctx: ctx,
          replaceProject: function (apply, label) {
            var previous=JSON.parse(JSON.stringify(engine.serialize())), oldReset=ctx.resetHistory, oldCommit=ctx.commit;
            ctx.resetHistory=function () {}; ctx.commit=function () {};
            try { apply(); } catch(err) { engine.restore(previous); throw err; }
            finally { ctx.resetHistory=oldReset; ctx.commit=oldCommit; }
            ctx.commit(label); ctx.announce(label);
          }, starts: function () { return def.starts ? def.starts(ctx) : []; } };
        if (engine.start) engine.start(def.initialStart ? def.initialStart(PARA) : 'empty');
        ctx.resetHistory(); setDirty(false, null);
        ctx.command('new', t('newProject') + '…', t('startFrom'), function () { openNew(newBtn); });
        ctx.command('open', t('open') + '…', t('fileMenu'), openProject);
        ctx.command('save', t('save'), t('fileMenu'), saveProject);
        ctx.command('undo', t('undo'), '', doUndo); ctx.command('redo', t('redo'), '', doRedo);
        helpAddons();
        moveGuideIntoHelp();
        announce(t('ready'));
        try { D.dispatchEvent(new CustomEvent('igs:ready', { detail: { studio: engineId } })); } catch (_) {}
      }).catch(function (err) {
        loading.textContent = t('loadError');
        loading.classList.add('igs-error');
        app.dataset.igsReady = 'error';
        if (root.console) console.error('[IGSuite]', err);
      });
    }
    /* Esperar al shell (si existe) para colocar Exportar dentro de Archivo. */
    function whenShell(cb) {
      var tries = 0;
      (function wait() {
        tries += 1;
        if (D.getElementById('ig-r42-file-menu') || tries > 40 || D.body.dataset.igR42Mount === 'missing-source') { cb(); return; }
        root.setTimeout(wait, 50);
      })();
    }
    whenShell(function () {
      pendingCommands.forEach(function (c) { ctx.command.apply(null, c); }); pendingCommands = [];
      start();
    });
    root.addEventListener('beforeunload', function (e) { if (dirty) { e.preventDefault(); e.returnValue = ''; } });
  }

  root.IGSuite = { version: VERSION, lang: LANG, para: PARA, t: t, fmt: fmt, num: num, h: h, icon: icon, button: button, fields: fields,
    load: load, defineEngine: defineEngine, mount: mountStudio, History: History, View2D: View2D, download: download, announce: announce, rng: rng, svgText: svgText, printPages: printPages, svgToPng: svgToPng, parseSVG: parseSVG, keepFocus: keepFocus };

  if (D.readyState !== 'complete') D.addEventListener('DOMContentLoaded', mountStudio, { once: true });
  else root.setTimeout(mountStudio, 0);
})(window, document);

