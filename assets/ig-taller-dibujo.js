/* Iris Green · El taller · Estudio de dibujo.
   Lienzo vectorial por capas: cada trazo se guarda como datos, así el deshacer no tiene límite,
   el proyecto cabe en un archivo propio y la imagen se exporta a PNG con la marca de composición. */
(function (window, document) {
  'use strict';
  var T = window.IGT; if (!T) return;
  var t = T.t, h = T.h;

  var FORMATS = { horizontal: [1200, 800], vertical: [800, 1200], cuadrado: [1000, 1000] };
  var BRUSHES = {
    lapiz: { size: 3, alpha: 0.92, kind: 'free' }, tinta: { size: 7, alpha: 1, kind: 'free' },
    rotulador: { size: 18, alpha: 0.5, kind: 'free' }, suave: { size: 30, alpha: 0.32, kind: 'free', soft: true },
    goma: { size: 26, alpha: 1, kind: 'free', erase: true },
    linea: { size: 4, alpha: 1, kind: 'line' }, rect: { size: 4, alpha: 1, kind: 'rect' }, elipse: { size: 4, alpha: 1, kind: 'ellipse' }
  };
  var TOOL_ORDER = ['lapiz', 'tinta', 'rotulador', 'suave', 'goma', 'linea', 'rect', 'elipse'];
  var PALETTE = ['#17202a', '#5d6877', '#b8c2cc', '#ffffff', '#8b1e3f', '#d8434b', '#f08a4b', '#f2c14e', '#6c8a2b', '#2e8b57', '#1f7a8c', '#1f5f8b', '#274690', '#5a49a8', '#a8336f', '#8d5b3a'];
  var MAX_LAYERS = 12, MAX_SHEETS = 40;

  var uid = 0; function nid() { uid += 1; return 'c' + Date.now().toString(36) + uid; }
  function newLayer(name) { return { id: nid(), name: name, visible: true, opacity: 1, strokes: [] }; }
  function newSheet(n) { return { id: nid(), alt: '', layers: [newLayer(t('dLayerBg')), newLayer(t('dLayerN', { n: 2 }))], active: 1, n: n }; }

  T.ready(function () {
    var app = T.mount(); if (!app || app.getAttribute('data-studio') !== 'dibujo') return;
    var CH = (T.dict.challenges || []);

    var doc = { title: '', format: 'horizontal', rules: '', sheets: [newSheet(1)], cur: 0 };
    var ui = { tool: 'lapiz', color: '#17202a', size: 3, alpha: 0.92, fill: false,
      sym: 'no', symN: 8, guide: 'no', grid: 50, horizon: 0.42, vp1: 0.5, vp2: 0.95, vpA: 0.05, snap: true,
      kx: 600, ky: 400, penDown: false, kStroke: null, kShapeStart: null };
    var live = null; // trazo en curso
    var caches = {}; // id de capa → canvas
    var liveTmp = null;

    function sheet() { return doc.sheets[doc.cur]; }
    function layer() { var s = sheet(); return s.layers[s.active]; }
    function W() { return FORMATS[doc.format][0]; }
    function H() { return FORMATS[doc.format][1]; }

    /* Instantáneas con estructura compartida: los trazos no se modifican nunca. */
    function cloneDoc() {
      return { title: doc.title, format: doc.format, rules: doc.rules, cur: doc.cur,
        sheets: doc.sheets.map(function (s) { return { id: s.id, alt: s.alt, active: s.active, n: s.n,
          layers: s.layers.map(function (l) { return { id: l.id, name: l.name, visible: l.visible, opacity: l.opacity, strokes: l.strokes.slice() }; }) }; }) };
    }
    var history = new T.History(function () { return doc; }, function (d) { doc = d; caches = {}; refreshAll(); }, function () { if (bar) bar.sync(); }, cloneDoc, function (x) { return x; });

    /* ---------- Interfaz ---------- */
    var retos = T.challenges({ items: CH, onPick: function (ch) { return challengeTools(ch); } });
    var bar;
    var pngBtn = T.btn(t('dExportPng'), { icon: 'png', onClick: exportPng });
    bar = T.projectBar({ studio: 'dibujo', history: history, extra: [pngBtn],
      getData: function () { return JSON.parse(JSON.stringify(doc)); }, getTitle: function () { return doc.title; },
      onNew: function () { doc = { title: '', format: doc.format, rules: '', sheets: [newSheet(1)], cur: 0 }; caches = {}; history.reset(); T.markClean(); refreshAll(); T.say(t('dNewDone')); },
      onOpen: function (d) { loadDoc(d); }, onPrint: preparePrint });

    var canvas = h('canvas', { class: 'igt-draw', tabindex: '0', role: 'img', 'aria-roledescription': t('dCanvasRole'), 'aria-describedby': 'igt-d-alt igt-d-keyhint' });
    var box = h('div', { class: 'igt-canvas-box' }, canvas);
    var keyHint = h('p', { class: 'igt-caption', id: 'igt-d-keyhint', text: t('dKeyHint') });
    var posOut = h('p', { class: 'igt-visible-status', 'aria-live': 'off' });
    var sheetNav = h('div', { class: 'igt-bar', role: 'group', 'aria-label': t('dSheets') });
    var stage = h('div', { class: 'igt-stage glass' }, sheetNav, box, posOut, keyHint);

    var side = h('div', { class: 'igt-side glass' });
    var work = h('div', { class: 'igt-work' }, stage, side);
    var altBox = h('div', { class: 'igt-alt', id: 'igt-d-alt' });
    var printArea = h('div', { class: 'igt-print-only igt-print-keep', 'aria-hidden': 'true' });
    app.appendChild(retos);
    app.appendChild(h('div', { class: 'igt-topbar glass' }, bar));
    app.appendChild(work);
    app.appendChild(altBox);
    app.appendChild(T.keyHelp([
      [t('kArrows'), t('dKArrows')], [t('kShiftArrows'), t('dKShiftArrows')], [t('kSpace'), t('dKSpace')], [t('kEsc'), t('dKEsc')],
      ['1 – 8', t('dKTools')], ['[ ]', t('dKSize')], ['Ctrl+Z / Ctrl+Y', t('kUndoRedo')]
    ]));
    app.appendChild(printArea);

    /* Herramientas */
    var toolBtns = {};
    var toolsPanel = T.panel(t('dTools'), true);
    var toolChips = h('div', { class: 'igt-chips', role: 'group', 'aria-label': t('dTools') });
    TOOL_ORDER.forEach(function (k, i) {
      var b = T.btn(t('dTool_' + k), { cls: 'igt-chip', pressed: k === ui.tool, title: String(i + 1), onClick: function () { setTool(k); } });
      toolBtns[k] = b; toolChips.appendChild(b);
    });
    toolsPanel.appendChild(toolChips);
    var sizeIn = h('input', { type: 'range', min: 1, max: 120, value: ui.size, id: 'igt-d-size' });
    var sizeOut = h('output', { for: 'igt-d-size', text: String(ui.size) });
    var alphaIn = h('input', { type: 'range', min: 5, max: 100, value: Math.round(ui.alpha * 100), id: 'igt-d-alpha' });
    var alphaOut = h('output', { for: 'igt-d-alpha', text: Math.round(ui.alpha * 100) + ' %' });
    var fillChk = h('input', { type: 'checkbox', id: 'igt-d-fill' });
    toolsPanel.appendChild(h('label', { class: 'igt-field', for: 'igt-d-size' }, h('span', null, t('dSize') + ': ', sizeOut), sizeIn));
    toolsPanel.appendChild(h('label', { class: 'igt-field', for: 'igt-d-alpha' }, h('span', null, t('dOpacity') + ': ', alphaOut), alphaIn));
    toolsPanel.appendChild(h('label', { class: 'igt-check', for: 'igt-d-fill' }, fillChk, t('dFill')));
    sizeIn.addEventListener('input', function () { ui.size = +sizeIn.value; sizeOut.textContent = sizeIn.value; draw(); });
    alphaIn.addEventListener('input', function () { ui.alpha = +alphaIn.value / 100; alphaOut.textContent = alphaIn.value + ' %'; });
    fillChk.addEventListener('change', function () { ui.fill = fillChk.checked; });

    /* Color */
    var colorPanel = T.panel(t('dColor'), true);
    var sw = h('div', { class: 'igt-swatches', role: 'group', 'aria-label': t('dPalette') });
    var swBtns = [];
    PALETTE.forEach(function (c) {
      var b = h('button', { type: 'button', class: 'igt-swatch', style: 'background:' + c, 'aria-pressed': String(c === ui.color), 'aria-label': colorName(c) });
      b.addEventListener('click', function () { setColor(c); }); b._c = c; swBtns.push(b); sw.appendChild(b);
    });
    var colorIn = h('input', { type: 'color', value: ui.color, id: 'igt-d-color' });
    colorIn.addEventListener('input', function () { setColor(colorIn.value); });
    colorPanel.appendChild(sw);
    colorPanel.appendChild(h('label', { class: 'igt-field inline', for: 'igt-d-color' }, t('dCustomColor'), colorIn));
    var usedOut = h('p', { class: 'igt-note' });
    colorPanel.appendChild(usedOut);

    /* Simetría y guías */
    var symSel = h('select', { id: 'igt-d-sym' }, ['no', 'v', 'h', 'vh', 'radial', 'kaleido'].map(function (k) { return h('option', { value: k, text: t('dSym_' + k) }); }));
    var symN = h('input', { type: 'number', id: 'igt-d-symn', min: 3, max: 16, value: ui.symN });
    var guideSel = h('select', { id: 'igt-d-guide' }, ['no', 'grid', 'p1', 'p2'].map(function (k) { return h('option', { value: k, text: t('dGuide_' + k) }); }));
    var horizon = h('input', { type: 'range', id: 'igt-d-hor', min: 5, max: 95, value: Math.round(ui.horizon * 100) });
    var vp1 = h('input', { type: 'range', id: 'igt-d-vp1', min: -60, max: 160, value: Math.round(ui.vp1 * 100) });
    var vp2 = h('input', { type: 'range', id: 'igt-d-vp2', min: -60, max: 160, value: Math.round(ui.vp2 * 100) });
    var gridIn = h('input', { type: 'range', id: 'igt-d-grid', min: 10, max: 200, step: 5, value: ui.grid });
    var snapChk = h('input', { type: 'checkbox', id: 'igt-d-snap', checked: true });
    var symPanel = T.panel(t('dSymGuides'), false,
      h('label', { class: 'igt-field', for: 'igt-d-sym' }, t('dSym'), symSel),
      h('label', { class: 'igt-field', for: 'igt-d-symn' }, t('dSymN'), symN),
      h('label', { class: 'igt-field', for: 'igt-d-guide' }, t('dGuide'), guideSel),
      h('label', { class: 'igt-field', for: 'igt-d-grid' }, t('dGrid'), gridIn),
      h('label', { class: 'igt-field', for: 'igt-d-hor' }, t('dHorizon'), horizon),
      h('label', { class: 'igt-field', for: 'igt-d-vp1' }, t('dVp1'), vp1),
      h('label', { class: 'igt-field', for: 'igt-d-vp2' }, t('dVp2'), vp2),
      h('label', { class: 'igt-check', for: 'igt-d-snap' }, snapChk, t('dSnap')),
      h('p', { class: 'igt-note', text: t('dGuideNote') }));
    function syncGuideFields() {
      symN.parentNode.hidden = !(ui.sym === 'radial' || ui.sym === 'kaleido');
      gridIn.parentNode.hidden = ui.guide !== 'grid';
      horizon.parentNode.hidden = !(ui.guide === 'p1' || ui.guide === 'p2');
      vp1.parentNode.hidden = !(ui.guide === 'p1' || ui.guide === 'p2');
      vp2.parentNode.hidden = ui.guide !== 'p2';
      snapChk.parentNode.hidden = !(ui.guide === 'p1' || ui.guide === 'p2' || ui.guide === 'grid');
    }
    symSel.addEventListener('change', function () { ui.sym = symSel.value; syncGuideFields(); draw(); T.say(t('dSym') + ': ' + symSel.options[symSel.selectedIndex].text); });
    symN.addEventListener('change', function () { ui.symN = Math.max(3, Math.min(16, Math.round(+symN.value || 8))); symN.value = ui.symN; draw(); });
    guideSel.addEventListener('change', function () { ui.guide = guideSel.value; syncGuideFields(); draw(); });
    horizon.addEventListener('input', function () { ui.horizon = +horizon.value / 100; draw(); });
    vp1.addEventListener('input', function () { ui.vp1 = +vp1.value / 100; draw(); });
    vp2.addEventListener('input', function () { ui.vp2 = +vp2.value / 100; draw(); });
    gridIn.addEventListener('input', function () { ui.grid = +gridIn.value; draw(); });
    snapChk.addEventListener('change', function () { ui.snap = snapChk.checked; });

    /* Capas */
    var layersList = h('ul', { class: 'igt-blocks', 'aria-label': t('dLayers') });
    var layersPanel = T.panel(t('dLayers'), true, layersList,
      h('div', { class: 'igt-bar' },
        T.btn(t('dAddLayer'), { icon: 'mas', onClick: addLayer }),
        T.btn(t('dDelLayer'), { icon: 'borrar', cls: 'danger', onClick: delLayer })));

    /* Proyecto: título, formato, reglas, texto alternativo */
    var titleIn = h('input', { type: 'text', id: 'igt-d-title', maxlength: 80, autocomplete: 'off' });
    var formatSel = h('select', { id: 'igt-d-format' }, Object.keys(FORMATS).map(function (k) { return h('option', { value: k, text: t('dFormat_' + k) }); }));
    var altIn = h('textarea', { id: 'igt-d-altin', maxlength: 600, rows: 3 });
    var rulesIn = h('textarea', { id: 'igt-d-rules', maxlength: 600, rows: 3 });
    var projPanel = T.panel(t('dProject'), false,
      h('label', { class: 'igt-field', for: 'igt-d-title' }, t('dTitle'), titleIn),
      h('label', { class: 'igt-field', for: 'igt-d-format' }, t('dFormat'), formatSel),
      h('label', { class: 'igt-field', for: 'igt-d-altin' }, t('dAltLabel'), altIn),
      h('p', { class: 'igt-note', text: t('dAltHelp') }),
      h('label', { class: 'igt-field', for: 'igt-d-rules' }, t('dRulesLabel'), rulesIn));
    titleIn.addEventListener('change', function () { doc.title = titleIn.value.trim(); T.markDirty(); });
    altIn.addEventListener('change', function () { var b = history.snapshot(); sheet().alt = altIn.value.trim(); history.commit(b); describe(); });
    rulesIn.addEventListener('change', function () { var b = history.snapshot(); doc.rules = rulesIn.value.trim(); history.commit(b); });
    formatSel.addEventListener('change', function () {
      var used = doc.sheets.some(function (s) { return s.layers.some(function (l) { return l.strokes.length; }); });
      if (used && !window.confirm(t('dFormatConfirm'))) { formatSel.value = doc.format; return; }
      var b = history.snapshot(); doc.format = formatSel.value; history.commit(b); caches = {}; ui.kx = W() / 2; ui.ky = H() / 2; resize(); refreshAll();
    });

    side.appendChild(toolsPanel); side.appendChild(colorPanel); side.appendChild(layersPanel); side.appendChild(symPanel); side.appendChild(projPanel);

    /* ---------- Estado de herramientas ---------- */
    function setTool(k) {
      ui.tool = k; var b = BRUSHES[k];
      ui.size = b.size; ui.alpha = b.alpha; sizeIn.value = b.size; sizeOut.textContent = String(b.size);
      alphaIn.value = Math.round(b.alpha * 100); alphaOut.textContent = Math.round(b.alpha * 100) + ' %';
      Object.keys(toolBtns).forEach(function (x) { T.press(toolBtns[x], x === k); });
      ui.kShapeStart = null; endKeyboardStroke(false);
      T.say(t('dToolPicked', { t: t('dTool_' + k) })); draw();
    }
    function setColor(c) {
      ui.color = c; colorIn.value = c;
      swBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b._c === c)); });
      T.say(t('dColorPicked', { c: colorName(c) }));
    }
    function colorName(hex) {
      var i = PALETTE.indexOf(hex); if (i >= 0) return t('dColorNames').split('|')[i] || hex;
      var hsl = toHsl(hex); var names = t('dHueNames').split('|');
      var light = hsl[2] > 0.8 ? t('dLight') : hsl[2] < 0.25 ? t('dDark') : '';
      if (hsl[1] < 0.12) return (hsl[2] > 0.9 ? names[8] : hsl[2] < 0.15 ? names[9] : names[10]) + ' (' + hex + ')';
      var idx = Math.round(hsl[0] / 45) % 8;
      return (names[idx] + (light ? ' ' + light : '')) + ' (' + hex + ')';
    }

    /* ---------- Coordenadas y dibujo ---------- */
    var ctx, dispW = 800, dispH = 533;
    function resize() {
      var w = Math.max(240, box.clientWidth || 800);
      dispW = w; dispH = Math.round(w * H() / W());
      ctx = T.fitCanvas(canvas, dispW, dispH);
      canvas.style.aspectRatio = W() + ' / ' + H();
      draw();
    }
    function toLogical(e) {
      var r = canvas.getBoundingClientRect();
      return [(e.clientX - r.left) * W() / r.width, (e.clientY - r.top) * H() / r.height];
    }
    function layerCanvas(l) {
      var c = caches[l.id];
      if (!c || c._w !== W() || c._h !== H()) {
        c = document.createElement('canvas'); c.width = W(); c.height = H(); c._w = W(); c._h = H(); caches[l.id] = c; c._dirty = true;
      }
      if (c._dirty) {
        var x = c.getContext('2d'); x.clearRect(0, 0, W(), H());
        l.strokes.forEach(function (s) { renderStroke(x, s); });
        c._dirty = false;
      }
      return c;
    }
    function dirtyLayer(l) { var c = caches[l.id]; if (c) c._dirty = true; }
    function symTransforms(sym, n, w, hh) {
      var cx = w / 2, cy = hh / 2, out = [[1, 0, 0, 1, 0, 0]];
      if (sym === 'v' || sym === 'vh') out.push([-1, 0, 0, 1, 2 * cx, 0]);
      if (sym === 'h' || sym === 'vh') out.push([1, 0, 0, -1, 0, 2 * cy]);
      if (sym === 'vh') out.push([-1, 0, 0, -1, 2 * cx, 2 * cy]);
      if (sym === 'radial' || sym === 'kaleido') {
        out = [];
        for (var k = 0; k < n; k++) {
          var a = 2 * Math.PI * k / n, c = Math.cos(a), s = Math.sin(a);
          out.push([c, s, -s, c, cx - c * cx + s * cy, cy - s * cx - c * cy]);
          if (sym === 'kaleido') out.push([c, s, s, -c, cx - c * cx - s * cy, cy - s * cx + c * cy]);
        }
      }
      return out;
    }
    function renderStroke(x, s) {
      var trs = symTransforms(s.sym || 'no', s.symN || 8, s.w || W(), s.h || H());
      trs.forEach(function (m) {
        x.save(); x.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        pathStroke(x, s); x.restore();
      });
    }
    function pathStroke(x, s) {
      var p = s.pts; if (!p || p.length < 2) return;
      var b = BRUSHES[s.tool] || BRUSHES.lapiz;
      x.globalAlpha = s.alpha; x.lineWidth = s.size; x.lineCap = 'round'; x.lineJoin = 'round';
      x.strokeStyle = s.color; x.fillStyle = s.color;
      x.globalCompositeOperation = b.erase ? 'destination-out' : 'source-over';
      if (b.soft) { x.shadowColor = s.color; x.shadowBlur = s.size * 0.7; }
      x.beginPath();
      if (b.kind === 'free') {
        x.moveTo(p[0], p[1]);
        if (p.length === 2) { x.lineTo(p[0] + 0.01, p[1]); }
        else if (p.length === 4) { x.lineTo(p[2], p[3]); }
        else {
          for (var i = 2; i < p.length - 2; i += 2) { var mx = (p[i] + p[i + 2]) / 2, my = (p[i + 1] + p[i + 3]) / 2; x.quadraticCurveTo(p[i], p[i + 1], mx, my); }
          x.lineTo(p[p.length - 2], p[p.length - 1]);
        }
        x.stroke();
      } else {
        var x0 = p[0], y0 = p[1], x1 = p[2], y1 = p[3];
        if (b.kind === 'line') { x.moveTo(x0, y0); x.lineTo(x1, y1); x.stroke(); }
        else if (b.kind === 'rect') { x.rect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0)); if (s.fill) x.fill(); x.stroke(); }
        else { x.ellipse((x0 + x1) / 2, (y0 + y1) / 2, Math.abs(x1 - x0) / 2 || 0.5, Math.abs(y1 - y0) / 2 || 0.5, 0, 0, Math.PI * 2); if (s.fill) x.fill(); x.stroke(); }
      }
      x.shadowBlur = 0; x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    }
    function composite(x, w, hh, withLive) {
      x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, hh);
      var sc = w / W();
      sheet().layers.forEach(function (l, i) {
        if (!l.visible) return;
        var c = layerCanvas(l);
        if (withLive && live && i === sheet().active) {
          if (!liveTmp || liveTmp.width !== W() || liveTmp.height !== H()) { liveTmp = document.createElement('canvas'); liveTmp.width = W(); liveTmp.height = H(); }
          var tx = liveTmp.getContext('2d'); tx.clearRect(0, 0, W(), H()); tx.drawImage(c, 0, 0); renderStroke(tx, live); c = liveTmp;
        }
        x.globalAlpha = l.opacity; x.drawImage(c, 0, 0, W(), H(), 0, 0, w, hh); x.globalAlpha = 1;
      });
      return sc;
    }
    function draw() {
      if (!ctx) return;
      composite(ctx, dispW, dispH, true);
      drawGuides(ctx, dispW / W());
      if (document.activeElement === canvas) drawCursor(ctx, dispW / W());
    }
    function vpPoints() {
      var hy = ui.horizon * H(), pts = [[ui.vp1 * W(), hy]];
      if (ui.guide === 'p2') pts.push([ui.vp2 * W(), hy]);
      return pts;
    }
    function drawGuides(x, sc) {
      var g = ui.guide, w = W(), hh = H();
      x.save(); x.scale(sc, sc); x.lineWidth = 1 / sc;
      if (g === 'grid') {
        x.strokeStyle = 'rgba(31,95,139,.28)'; x.beginPath();
        for (var gx = ui.grid; gx < w; gx += ui.grid) { x.moveTo(gx, 0); x.lineTo(gx, hh); }
        for (var gy = ui.grid; gy < hh; gy += ui.grid) { x.moveTo(0, gy); x.lineTo(w, gy); }
        x.stroke();
      } else if (g === 'p1' || g === 'p2') {
        var hy = ui.horizon * hh;
        x.strokeStyle = 'rgba(168,51,111,.55)'; x.lineWidth = 2 / sc; x.beginPath(); x.moveTo(0, hy); x.lineTo(w, hy); x.stroke();
        x.lineWidth = 1 / sc; x.strokeStyle = 'rgba(31,95,139,.25)';
        vpPoints().forEach(function (vp) {
          x.beginPath();
          for (var a = 0; a < 360; a += 7.5) { var r = a * Math.PI / 180; x.moveTo(vp[0], vp[1]); x.lineTo(vp[0] + Math.cos(r) * 4000, vp[1] + Math.sin(r) * 4000); }
          x.stroke();
          x.fillStyle = '#a8336f'; x.beginPath(); x.arc(vp[0], vp[1], 7 / sc, 0, Math.PI * 2); x.fill();
        });
      }
      var sym = ui.sym;
      if (sym !== 'no') {
        x.strokeStyle = 'rgba(90,73,168,.45)'; x.setLineDash([8 / sc, 6 / sc]); x.lineWidth = 1.5 / sc; x.beginPath();
        if (sym === 'v' || sym === 'vh') { x.moveTo(w / 2, 0); x.lineTo(w / 2, hh); }
        if (sym === 'h' || sym === 'vh') { x.moveTo(0, hh / 2); x.lineTo(w, hh / 2); }
        if (sym === 'radial' || sym === 'kaleido') {
          var n = sym === 'kaleido' ? ui.symN * 2 : ui.symN, R = Math.max(w, hh);
          for (var k = 0; k < n; k++) { var aa = 2 * Math.PI * k / n - Math.PI / 2; x.moveTo(w / 2, hh / 2); x.lineTo(w / 2 + Math.cos(aa) * R, hh / 2 + Math.sin(aa) * R); }
        }
        x.stroke(); x.setLineDash([]);
      }
      x.restore();
    }
    function drawCursor(x, sc) {
      var r = Math.max(4, ui.size / 2) * sc, cx = ui.kx * sc, cy = ui.ky * sc;
      x.save(); x.lineWidth = 2; x.strokeStyle = '#ffffff'; x.beginPath(); x.arc(cx, cy, r + 2, 0, Math.PI * 2); x.stroke();
      x.strokeStyle = ui.penDown || ui.kShapeStart ? '#a8336f' : '#17395c'; x.lineWidth = 2; x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2);
      x.moveTo(cx - r - 8, cy); x.lineTo(cx - r - 2, cy); x.moveTo(cx + r + 2, cy); x.lineTo(cx + r + 8, cy);
      x.moveTo(cx, cy - r - 8); x.lineTo(cx, cy - r - 2); x.moveTo(cx, cy + r + 2); x.lineTo(cx, cy + r + 8); x.stroke(); x.restore();
    }

    /* Ajuste a guías: horizontal, vertical, hacia los puntos de fuga o a la cuadrícula. */
    function snapLine(x0, y0, x1, y1) {
      if (!ui.snap) return { pts: [x0, y0, x1, y1], snap: null };
      if (ui.guide === 'grid') {
        var g = ui.grid, r = function (v) { return Math.round(v / g) * g; };
        return { pts: [r(x0), r(y0), r(x1), r(y1)], snap: 'grid' };
      }
      if (ui.guide !== 'p1' && ui.guide !== 'p2') return { pts: [x0, y0, x1, y1], snap: null };
      var dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy); if (len < 1) return { pts: [x0, y0, x1, y1], snap: null };
      var cands = [[1, 0, 'h'], [0, 1, 'v']];
      vpPoints().forEach(function (vp, i) { var vx = vp[0] - x0, vy = vp[1] - y0, vl = Math.hypot(vx, vy); if (vl > 1) cands.push([vx / vl, vy / vl, 'vp' + (i + 1)]); });
      var best = null, bestScore = -1;
      cands.forEach(function (c) { var s = Math.abs((dx * c[0] + dy * c[1]) / len); if (s > bestScore) { bestScore = s; best = c; } });
      var proj = dx * best[0] + dy * best[1];
      return { pts: [x0, y0, x0 + best[0] * proj, y0 + best[1] * proj], snap: best[2] };
    }

    function makeStroke(pts) {
      return { tool: ui.tool, color: ui.color, size: ui.size, alpha: ui.alpha, fill: ui.fill && (ui.tool === 'rect' || ui.tool === 'elipse'),
        sym: ui.sym, symN: ui.symN, w: W(), h: H(), pts: pts };
    }
    function round1(v) { return Math.round(v * 10) / 10; }

    /* Límites del reto activo: se comprueban antes de guardar el trazo. */
    function limitBlock(s) {
      var ch = retos.current(); if (!ch || !ch.rules) return null;
      var R = ch.rules, sh = sheet();
      if (R.onlyShapes && BRUSHES[s.tool].kind === 'free' && !BRUSHES[s.tool].erase) return t('dLimShapes');
      if (R.noErase && BRUSHES[s.tool].erase) return t('dLimNoErase');
      if (R.maxStrokes) { var n = countStrokes(sh, true); if (n >= R.maxStrokes) return t('dLimStrokes', { n: R.maxStrokes }); }
      if (R.maxColors && !BRUSHES[s.tool].erase) {
        var cols = colorsUsed(sh); if (cols.indexOf(s.color) < 0 && cols.length >= R.maxColors) return t('dLimColors', { n: R.maxColors });
      }
      return null;
    }
    function commitStroke(s) {
      var why = limitBlock(s);
      if (why) { T.say(why); flash(why); live = null; draw(); return; }
      var before = history.snapshot();
      var l = layer(); l.strokes = l.strokes.concat([s]); dirtyLayer(l);
      history.commit(before); live = null; draw(); describe(); renderLayers();
    }
    var flashNode = h('p', { class: 'igt-err', hidden: true });
    stage.insertBefore(flashNode, posOut);
    var flashTimer = 0;
    function flash(msg) { flashNode.textContent = msg; flashNode.hidden = false; clearTimeout(flashTimer); flashTimer = setTimeout(function () { flashNode.hidden = true; }, 5000); }

    /* Puntero (ratón, lápiz, dedo) */
    var drawing = false;
    canvas.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      if (!layer().visible) { T.say(t('dHiddenLayer')); flash(t('dHiddenLayer')); return; }
      e.preventDefault(); canvas.focus({ preventScroll: true }); canvas.setPointerCapture(e.pointerId);
      var p = toLogical(e); drawing = true; ui.kx = p[0]; ui.ky = p[1];
      var b = BRUSHES[ui.tool];
      live = makeStroke(b.kind === 'free' ? [round1(p[0]), round1(p[1])] : [round1(p[0]), round1(p[1]), round1(p[0]), round1(p[1])]);
      draw();
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!drawing || !live) return;
      var evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e]; if (!evs.length) evs = [e];
      var b = BRUSHES[live.tool];
      evs.forEach(function (ev) {
        var p = toLogical(ev);
        if (b.kind === 'free') {
          var q = live.pts, lx = q[q.length - 2], ly = q[q.length - 1];
          if (Math.hypot(p[0] - lx, p[1] - ly) >= 1.5) live.pts = q.concat([round1(p[0]), round1(p[1])]);
        } else {
          var sn = b.kind === 'line' ? snapLine(live.pts[0], live.pts[1], p[0], p[1]) : { pts: [live.pts[0], live.pts[1], p[0], p[1]], snap: ui.guide === 'grid' && ui.snap ? 'grid' : null };
          if (b.kind !== 'line' && sn.snap === 'grid') sn = snapLine(live.pts[0], live.pts[1], p[0], p[1]);
          live.pts = sn.pts.map(round1); live.snap = sn.snap;
        }
      });
      draw();
    });
    function finishPointer() { if (!drawing) return; drawing = false; if (live) commitStroke(live); }
    canvas.addEventListener('pointerup', finishPointer);
    canvas.addEventListener('pointercancel', function () { drawing = false; live = null; draw(); });

    /* Teclado: cursor propio; Espacio baja y levanta la pluma; Intro marca puntos de las formas. */
    function endKeyboardStroke(commit) {
      if (ui.penDown && live && commit) commitStroke(live);
      ui.penDown = false; if (!commit) live = null; ui.kStroke = null;
    }
    function announcePos() { posOut.textContent = t('dPos', { x: Math.round(ui.kx), y: Math.round(ui.ky), pen: ui.penDown ? t('dPenDown') : t('dPenUp') }); }
    canvas.addEventListener('keydown', function (e) {
      var step = e.shiftKey ? 2 : 12, moved = false;
      if (e.key === 'ArrowLeft') { ui.kx -= step; moved = true; }
      else if (e.key === 'ArrowRight') { ui.kx += step; moved = true; }
      else if (e.key === 'ArrowUp') { ui.ky -= step; moved = true; }
      else if (e.key === 'ArrowDown') { ui.ky += step; moved = true; }
      if (moved) {
        e.preventDefault();
        ui.kx = Math.max(0, Math.min(W(), ui.kx)); ui.ky = Math.max(0, Math.min(H(), ui.ky));
        var b = BRUSHES[ui.tool];
        if (ui.penDown && live && b.kind === 'free') live.pts = live.pts.concat([round1(ui.kx), round1(ui.ky)]);
        if (ui.kShapeStart && live) {
          var sn = b.kind === 'line' || ui.guide === 'grid' ? snapLine(ui.kShapeStart[0], ui.kShapeStart[1], ui.kx, ui.ky) : { pts: [ui.kShapeStart[0], ui.kShapeStart[1], ui.kx, ui.ky], snap: null };
          live.pts = sn.pts.map(round1); live.snap = sn.snap;
        }
        announcePos(); draw(); return;
      }
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        var bb = BRUSHES[ui.tool];
        if (!layer().visible) { T.say(t('dHiddenLayer')); return; }
        if (bb.kind === 'free') {
          if (!ui.penDown) { ui.penDown = true; live = makeStroke([round1(ui.kx), round1(ui.ky)]); T.say(t('dPenDown')); }
          else { endKeyboardStroke(true); T.say(t('dPenUpSaved')); }
        } else {
          if (!ui.kShapeStart) { ui.kShapeStart = [ui.kx, ui.ky]; live = makeStroke([round1(ui.kx), round1(ui.ky), round1(ui.kx), round1(ui.ky)]); T.say(t('dShapeStart')); }
          else { ui.kShapeStart = null; if (live) commitStroke(live); T.say(t('dShapeDone')); }
        }
        announcePos(); draw(); return;
      }
      if (e.key === 'Escape') { if (ui.penDown || ui.kShapeStart) { e.preventDefault(); ui.kShapeStart = null; endKeyboardStroke(false); T.say(t('dCancelled')); draw(); } return; }
      if (/^[1-8]$/.test(e.key) && !e.ctrlKey && !e.metaKey) { e.preventDefault(); setTool(TOOL_ORDER[+e.key - 1]); return; }
      if (e.key === '[' || e.key === ']') { e.preventDefault(); ui.size = Math.max(1, Math.min(120, ui.size + (e.key === ']' ? 2 : -2))); sizeIn.value = ui.size; sizeOut.textContent = String(ui.size); T.say(t('dSize') + ' ' + ui.size); draw(); }
    });
    canvas.addEventListener('focus', function () { announcePos(); draw(); });
    canvas.addEventListener('blur', function () { draw(); });
    history.bindKeys(document);

    /* ---------- Capas ---------- */
    function renderLayers() {
      T.clear(layersList);
      var s = sheet();
      for (var i = s.layers.length - 1; i >= 0; i--) (function (i) {
        var l = s.layers[i], active = i === s.active;
        var nameIn = h('input', { type: 'text', class: 'igt-block-name-in', value: l.name, maxlength: 30, 'aria-label': t('dLayerName', { n: i + 1 }) });
        nameIn.addEventListener('change', function () { var b = history.snapshot(); l.name = nameIn.value.trim() || l.name; history.commit(b); });
        var vis = h('input', { type: 'checkbox', checked: l.visible, id: 'igt-lv-' + l.id });
        vis.addEventListener('change', function () { var b = history.snapshot(); l.visible = vis.checked; history.commit(b); draw(); });
        var op = h('input', { type: 'range', min: 0, max: 100, value: Math.round(l.opacity * 100), 'aria-label': t('dLayerOpacity', { name: l.name }) });
        var opBefore = null;
        op.addEventListener('pointerdown', function () { opBefore = history.snapshot(); });
        op.addEventListener('input', function () { l.opacity = +op.value / 100; draw(); });
        op.addEventListener('change', function () { history.commit(opBefore || undefined); opBefore = null; });
        var pick = T.btn(active ? t('dLayerActive') : t('dLayerUse'), { pressed: active, cls: 'igt-chip', onClick: function () { s.active = i; renderLayers(); T.say(t('dLayerNow', { name: l.name })); } });
        var up = T.btn(t('dLayerUp', { name: l.name }), { icon: 'arriba', cls: 'icon-only', disabled: i === s.layers.length - 1, onClick: function () { moveLayer(i, 1); } });
        var dn = T.btn(t('dLayerDown', { name: l.name }), { icon: 'abajo', cls: 'icon-only', disabled: i === 0, onClick: function () { moveLayer(i, -1); } });
        layersList.appendChild(h('li', { class: 'igt-block' + (active ? ' sel' : '') },
          pick, nameIn,
          h('label', { class: 'igt-check', for: 'igt-lv-' + l.id }, vis, t('dVisible')),
          h('span', { class: 'igt-block-tools' }, up, dn),
          h('div', { class: 'igt-block-body' }, op, h('span', { class: 'igt-note', text: t('dStrokesN', { n: l.strokes.length }) }))));
      })(i);
    }
    function addLayer() {
      var s = sheet(); if (s.layers.length >= MAX_LAYERS) { T.say(t('dMaxLayers', { n: MAX_LAYERS })); return; }
      var b = history.snapshot(); s.layers.splice(s.active + 1, 0, newLayer(t('dLayerN', { n: s.layers.length + 1 }))); s.active += 1;
      history.commit(b); renderLayers(); draw(); T.say(t('dLayerAdded'));
    }
    function delLayer() {
      var s = sheet(); if (s.layers.length <= 1) { T.say(t('dLastLayer')); return; }
      var l = layer(); if (l.strokes.length && !window.confirm(t('dDelLayerConfirm', { name: l.name }))) return;
      var b = history.snapshot(); s.layers.splice(s.active, 1); s.active = Math.max(0, s.active - 1);
      history.commit(b); renderLayers(); draw(); describe(); T.say(t('dLayerDeleted'));
    }
    function moveLayer(i, dir) {
      var s = sheet(), j = i + dir; if (j < 0 || j >= s.layers.length) return;
      var b = history.snapshot(); var tmp = s.layers[i]; s.layers[i] = s.layers[j]; s.layers[j] = tmp;
      if (s.active === i) s.active = j; else if (s.active === j) s.active = i;
      history.commit(b); renderLayers(); draw(); T.say(t('dLayerMoved'));
    }

    /* ---------- Hojas (series) ---------- */
    function renderSheets() {
      T.clear(sheetNav);
      sheetNav.appendChild(h('span', { class: 'igt-note', text: t('dSheetOf', { n: doc.cur + 1, m: doc.sheets.length }) }));
      sheetNav.appendChild(T.btn(t('dPrevSheet'), { disabled: doc.cur === 0, onClick: function () { goSheet(doc.cur - 1); } }));
      sheetNav.appendChild(T.btn(t('dNextSheet'), { disabled: doc.cur >= doc.sheets.length - 1, onClick: function () { goSheet(doc.cur + 1); } }));
      sheetNav.appendChild(T.btn(t('dAddSheet'), { icon: 'mas', onClick: function () { addSheet(false); } }));
      sheetNav.appendChild(T.btn(t('dDupSheet'), { icon: 'copiar', onClick: function () { addSheet(true); } }));
      sheetNav.appendChild(T.btn(t('dDelSheet'), { icon: 'borrar', cls: 'danger', disabled: doc.sheets.length < 2, onClick: delSheet }));
    }
    function goSheet(i) { doc.cur = Math.max(0, Math.min(doc.sheets.length - 1, i)); refreshAll(); T.say(t('dSheetOf', { n: doc.cur + 1, m: doc.sheets.length })); }
    function addSheet(dup) {
      if (doc.sheets.length >= MAX_SHEETS) { T.say(t('dMaxSheets', { n: MAX_SHEETS })); return; }
      var b = history.snapshot(); var s;
      if (dup) { var o = sheet(); s = { id: nid(), alt: o.alt, active: o.active, n: doc.sheets.length + 1, layers: o.layers.map(function (l) { return { id: nid(), name: l.name, visible: l.visible, opacity: l.opacity, strokes: l.strokes.slice() }; }) }; }
      else s = newSheet(doc.sheets.length + 1);
      doc.sheets.splice(doc.cur + 1, 0, s); doc.cur += 1; history.commit(b); refreshAll();
      T.say(t('dSheetOf', { n: doc.cur + 1, m: doc.sheets.length }));
    }
    function delSheet() {
      if (doc.sheets.length < 2) return;
      if (!window.confirm(t('dDelSheetConfirm', { n: doc.cur + 1 }))) return;
      var b = history.snapshot(); doc.sheets.splice(doc.cur, 1); doc.cur = Math.max(0, doc.cur - 1); history.commit(b); refreshAll();
    }

    /* ---------- Descripción textual y comprobación ---------- */
    function countStrokes(s, visibleOnly) { var n = 0; s.layers.forEach(function (l) { l.strokes.forEach(function (st) { if (!BRUSHES[st.tool].erase) n++; }); }); return n; }
    function colorsUsed(s) { var c = []; s.layers.forEach(function (l) { l.strokes.forEach(function (st) { if (!BRUSHES[st.tool].erase && c.indexOf(st.color) < 0) c.push(st.color); }); }); return c; }
    function toolsUsed(s) { var c = []; s.layers.forEach(function (l) { l.strokes.forEach(function (st) { if (c.indexOf(st.tool) < 0) c.push(st.tool); }); }); return c; }
    function describe() {
      var s = sheet(), n = countStrokes(s), cols = colorsUsed(s), tools = toolsUsed(s);
      var used = s.layers.filter(function (l) { return l.strokes.length; }).length;
      var syms = []; s.layers.forEach(function (l) { l.strokes.forEach(function (st) { if (st.sym && st.sym !== 'no' && syms.indexOf(st.sym) < 0) syms.push(st.sym); }); });
      T.clear(altBox);
      altBox.appendChild(h('h3', { text: t('dAltTitle') }));
      altBox.appendChild(h('p', { text: s.alt ? s.alt : t('dAltEmpty') }));
      altBox.appendChild(h('p', { class: 'igt-note', text: t('dAltAuto', { sheet: doc.cur + 1, sheets: doc.sheets.length, strokes: n, layers: used, total: s.layers.length,
        colors: cols.length ? cols.map(colorName).join(', ') : '—', tools: tools.length ? tools.map(function (k) { return t('dTool_' + k); }).join(', ') : '—',
        sym: syms.length ? syms.map(function (k) { return t('dSym_' + k); }).join(', ') : t('dSym_no') }) }));
      canvas.setAttribute('aria-label', (doc.title || t('dUntitled')) + ' · ' + t('dSheetOf', { n: doc.cur + 1, m: doc.sheets.length }));
      usedOut.textContent = t('dColorsUsed', { n: cols.length });
    }
    function toHsl(hex) {
      var r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
      var mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn, hh = 0, s = 0;
      if (d) { s = d / (1 - Math.abs(2 * l - 1)); hh = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; hh *= 60; if (hh < 0) hh += 360; }
      return [hh, s, l];
    }
    function evaluate(ch) {
      var R = ch.rules || {}, s = sheet(), out = [];
      var n = countStrokes(s), cols = colorsUsed(s), tools = toolsUsed(s);
      function add(ok, txt) { out.push([ok, txt]); }
      if (R.minStrokes) add(n >= R.minStrokes, t('dChkMinStrokes', { n: n, m: R.minStrokes }));
      if (R.maxStrokes) add(n >= 1 && n <= R.maxStrokes, t('dChkMaxStrokes', { n: n, m: R.maxStrokes }));
      if (R.maxColors) add(cols.length >= 1 && cols.length <= R.maxColors, t('dChkColors', { n: cols.length, m: R.maxColors }));
      if (R.exactColors) add(cols.length === R.exactColors, t('dChkExactColors', { n: cols.length, m: R.exactColors }));
      if (R.sameHue) {
        var hs = cols.map(toHsl), ok = hs.length >= 2 && hs.every(function (a) { return a[1] > 0.12; });
        if (ok) { var base = hs[0][0]; ok = hs.every(function (a) { var dd = Math.abs(a[0] - base); return Math.min(dd, 360 - dd) <= 25; }); }
        var ls = hs.map(function (a) { return a[2]; }).sort(); var spread = ls.length ? ls[ls.length - 1] - ls[0] : 0;
        add(ok && spread >= 0.25, t('dChkHue', { spread: Math.round(spread * 100) }));
      }
      if (R.onlyShapes) add(n > 0 && tools.every(function (k) { return BRUSHES[k].kind !== 'free' || BRUSHES[k].erase; }), t('dChkShapes'));
      if (R.minLayers) { var used = s.layers.filter(function (l) { return l.strokes.length; }).length; add(used >= R.minLayers, t('dChkLayers', { n: used, m: R.minLayers })); }
      if (R.sym) {
        var cnt = 0; s.layers.forEach(function (l) { l.strokes.forEach(function (st) { if (R.sym.indexOf(st.sym) >= 0 && (!R.symN || st.symN === R.symN)) cnt++; }); });
        add(cnt >= (R.symStrokes || 3), t('dChkSym', { n: cnt, m: R.symStrokes || 3, sym: R.sym.map(function (k) { return t('dSym_' + k); }).join(' / ') + (R.symN ? ' · ' + R.symN : '') }));
      }
      if (R.snapVp) {
        var c = 0, vps = {}; s.layers.forEach(function (l) { l.strokes.forEach(function (st) { if (st.snap && /^vp/.test(st.snap)) { c++; vps[st.snap] = 1; } }); });
        add(c >= R.snapVp, t('dChkVp', { n: c, m: R.snapVp }));
        if (R.vps) add(Object.keys(vps).length >= R.vps, t('dChkVps', { n: Object.keys(vps).length, m: R.vps }));
      }
      if (R.minSheets) { var drawn = doc.sheets.filter(function (x) { return countStrokes(x) > 0; }).length; add(drawn >= R.minSheets, t('dChkSheets', { n: drawn, m: R.minSheets })); }
      if (R.rules) { var lines = doc.rules.split(/\n+/).filter(function (x) { return x.trim().length > 2; }).length; add(lines >= R.rules, t('dChkRules', { n: lines, m: R.rules })); }
      if (R.alt) add(!!s.alt, t('dChkAlt'));
      return out;
    }
    function challengeTools(ch) {
      var wrap = h('div', { class: 'igt-bar igt-noprint' });
      var res = h('div', { 'aria-live': 'polite' });
      if (ch && ch.gen) {
        var genOut = h('p', { class: 'igt-tip' });
        var gen = function () {
          var pools = t('dGenPools').split('||').map(function (p) { return p.split('|'); });
          var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
          genOut.textContent = t('dGenOut', { a: pick(pools[0]), b: pick(pools[1]), c: pick(pools[2]) });
          T.say(genOut.textContent);
        };
        wrap.appendChild(T.btn(t('dGenBtn'), { icon: 'reiniciar', onClick: gen }));
        var box2 = h('div', null, wrap, genOut); gen(); return box2;
      }
      if (!ch) return null;
      if (ch.rules && Object.keys(ch.rules).length) {
        wrap.appendChild(T.btn(t('check'), { cls: 'primary', onClick: function () {
          var r = evaluate(ch); T.clear(res);
          var allOk = r.every(function (x) { return x[0]; });
          res.appendChild(T.result(allOk, allOk ? t('dCheckAllOk') : t('dCheckSome')));
          res.appendChild(h('ul', { class: 'igt-limits igt-checks', role: 'list' }, r.map(function (x) { return h('li', { text: (x[0] ? '✓ ' : '· ') + x[1] }); })));
        } }));
        if (ch.setup) wrap.appendChild(T.btn(t('dSetup'), { onClick: function () { applySetup(ch.setup); } }));
      }
      return h('div', null, wrap, res);
    }
    function applySetup(su) {
      if (su.sym) { ui.sym = su.sym; symSel.value = su.sym; }
      if (su.symN) { ui.symN = su.symN; symN.value = su.symN; }
      if (su.guide) { ui.guide = su.guide; guideSel.value = su.guide; }
      if (su.tool) setTool(su.tool);
      syncGuideFields(); draw(); T.say(t('dSetupDone'));
    }

    /* ---------- Exportar, imprimir, abrir ---------- */
    function renderFull() {
      var c = document.createElement('canvas'); c.width = W(); c.height = H();
      composite(c.getContext('2d'), W(), H(), false); return c;
    }
    function exportPng() {
      var c = renderFull();
      var name = 'iris-green-dibujo-' + (T.slug(doc.title) || T.stamp()) + '-' + (doc.cur + 1) + '.png';
      T.exportPNG(c, W(), H(), name, (doc.title || t('dUntitled')) + ' · ' + t('dMadeIn'));
    }
    function preparePrint() {
      T.clear(printArea);
      doc.sheets.forEach(function (s, i) {
        var keep = doc.cur; doc.cur = i; var c = renderFull(); doc.cur = keep;
        printArea.appendChild(h('figure', { class: 'igt-print-sheet' }, h('img', { src: c.toDataURL('image/png'), alt: s.alt || t('dAltEmpty') }),
          h('figcaption', { text: (doc.title || t('dUntitled')) + ' · ' + t('dSheetOf', { n: i + 1, m: doc.sheets.length }) + (s.alt ? ' · ' + s.alt : '') })));
      });
    }
    window.addEventListener('afterprint', function () { T.clear(printArea); });
    function validNum(v, d) { v = Number(v); return isFinite(v) ? v : d; }
    function loadDoc(d) {
      if (!d || !Array.isArray(d.sheets) || !d.sheets.length) throw new Error('bad');
      var fmt = FORMATS[d.format] ? d.format : 'horizontal';
      var nd = { title: String(d.title || '').slice(0, 80), format: fmt, rules: String(d.rules || '').slice(0, 600), cur: 0, sheets: [] };
      d.sheets.slice(0, MAX_SHEETS).forEach(function (s, i) {
        var layers = (Array.isArray(s.layers) ? s.layers : []).slice(0, MAX_LAYERS).map(function (l) {
          return { id: nid(), name: String(l.name || '').slice(0, 30) || t('dLayerN', { n: 1 }), visible: l.visible !== false, opacity: Math.max(0, Math.min(1, validNum(l.opacity, 1))),
            strokes: (Array.isArray(l.strokes) ? l.strokes : []).filter(function (st) { return st && BRUSHES[st.tool] && Array.isArray(st.pts); }).map(function (st) {
              return { tool: st.tool, color: /^#[0-9a-f]{6}$/i.test(st.color) ? st.color : '#17202a', size: Math.max(1, Math.min(200, validNum(st.size, 3))), alpha: Math.max(0.02, Math.min(1, validNum(st.alpha, 1))),
                fill: !!st.fill, sym: ['no', 'v', 'h', 'vh', 'radial', 'kaleido'].indexOf(st.sym) >= 0 ? st.sym : 'no', symN: Math.max(3, Math.min(16, validNum(st.symN, 8))),
                w: validNum(st.w, FORMATS[fmt][0]), h: validNum(st.h, FORMATS[fmt][1]), snap: typeof st.snap === 'string' ? st.snap.slice(0, 6) : null,
                pts: st.pts.slice(0, 40000).map(function (v) { return validNum(v, 0); }) };
            }) };
        });
        if (!layers.length) layers = [newLayer(t('dLayerBg'))];
        nd.sheets.push({ id: nid(), alt: String(s.alt || '').slice(0, 600), active: Math.max(0, Math.min(layers.length - 1, validNum(s.active, 0))), n: i + 1, layers: layers });
      });
      doc = nd; caches = {}; history.reset(); resize(); refreshAll();
    }
    function refreshAll() {
      titleIn.value = doc.title; formatSel.value = doc.format; altIn.value = sheet().alt; rulesIn.value = doc.rules;
      renderSheets(); renderLayers(); resize(); describe();
    }

    if (window.ResizeObserver) new ResizeObserver(function () { var w = box.clientWidth; if (Math.abs(w - dispW) > 2) resize(); }).observe(box);
    else window.addEventListener('resize', resize);
    syncGuideFields(); refreshAll(); announcePos();
  });
})(window, document);
