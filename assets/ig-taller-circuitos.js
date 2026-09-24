/* Iris Green · El taller · Estudio de circuitos: electricidad y lógica sobre una placa con rejilla.
   El circuito se calcula en directo con ig-taller-circuitos-calc.js. Todo lo que se ve está también en la tabla. */
(function (window, document) {
  'use strict';
  var T = window.IGT, C = window.IGTCirc; if (!T || !C) return;
  var t = T.t, h = T.h;
  var TWO = { battery: 1, resistor: 1, lamp: 1, led: 1, switch: 1, motor: 1, wire: 1 };
  var ELEC_TYPES = ['battery', 'resistor', 'lamp', 'led', 'switch', 'spdt', 'motor', 'wire'];
  var LOGIC_TYPES = ['input', 'clock', 'out', 'and', 'or', 'not', 'xor', 'nand', 'nor', 'dff', 'wire'];
  var BOARD = { elec: [20, 12], logic: [26, 16] };

  T.ready(function () {
    var app = T.mount(); if (!app || app.getAttribute('data-studio') !== 'circuitos') return;
    var CH = T.dict.challenges || [];
    var doc = { mode: 'elec', elec: [], logic: [], title: '' };
    var tool = 'place', ptype = { elec: 'battery', logic: 'input' }, opts = { kind: 'pack', r: 330, color: 'rojo' };
    var sel = -1, pending = null, cursor = { x: 2, y: 2 }, hover = null, randomSpec = null;
    var logicSim = null; /* biestables: estado que se conserva entre pulsos */
    var history = new T.History(function () { return doc; }, function (d) { doc = d; sel = -1; logicSim = null; syncMode(); refresh(); }, function () { if (bar) bar.sync(); });
    function comps() { return doc[doc.mode]; }
    function edit(fn) { var b = history.snapshot(); fn(); history.commit(b); refresh(); }

    /* ---------- Interfaz ---------- */
    var retos = T.challenges({ items: CH, onPick: onPick });
    var bar = T.projectBar({ studio: 'circuitos', history: history,
      getData: function () { return doc; }, getTitle: function () { return doc.title; },
      onNew: function () { doc = { mode: doc.mode, elec: [], logic: [], title: '' }; sel = -1; logicSim = null; history.reset(); T.markClean(); refresh(); T.say(t('kNewDone')); },
      onOpen: loadDoc });
    var canvas = h('canvas', { class: 'igt-circ', tabindex: '0', role: 'application', 'aria-roledescription': t('kCanvasRole'), 'aria-describedby': 'igt-k-hint igt-k-alt' });
    var box = h('div', { class: 'igt-canvas-box' }, canvas);
    var modeTabs = h('div', { class: 'igt-tabs', role: 'group', 'aria-label': t('kModeLabel') });
    var toolBar = h('div', { class: 'igt-bar', role: 'group', 'aria-label': t('kTools') });
    var palette = h('div', { class: 'igt-chips', role: 'group', 'aria-label': t('kParts') });
    var optsBox = h('div', { class: 'igt-bar' });
    var clockBar = h('div', { class: 'igt-bar' });
    var cursorOut = h('p', { class: 'igt-visible-status' });
    var flashNode = h('p', { class: 'igt-err', hidden: true, role: 'alert' });
    var hint = h('p', { class: 'igt-caption', id: 'igt-k-hint', text: t('kKeyHint') });
    var legend = h('p', { class: 'igt-caption' });
    var stage = h('div', { class: 'igt-stage glass' }, modeTabs, toolBar, box, flashNode, cursorOut, clockBar, legend, hint);
    var resBox = h('div', { 'aria-live': 'polite' });
    var propBox = h('div');
    var side = h('div', { class: 'igt-side glass' },
      T.panel(t('kPartsPanel'), true, palette, optsBox),
      T.panel(t('kState'), true, resBox),
      T.panel(t('kProps'), true, propBox));
    var altBox = h('div', { class: 'igt-alt', id: 'igt-k-alt' });
    var tableWrap = h('div', { class: 'igt-table-wrap', role: 'region', tabindex: '0', 'aria-labelledby': 'igt-k-tcap' });
    var ttWrap = h('div', { class: 'igt-table-wrap', role: 'region', tabindex: '0', 'aria-labelledby': 'igt-k-ttcap', hidden: true });
    app.appendChild(retos);
    app.appendChild(h('div', { class: 'igt-topbar glass' }, bar));
    app.appendChild(h('div', { class: 'igt-work igt-print-keep' }, stage, side));
    [altBox, ttWrap, tableWrap].forEach(function (el) { el.classList.add('igt-print-keep'); app.appendChild(el); });
    app.appendChild(T.keyHelp([[t('kArrows'), t('kKArrows')], [t('kSpace'), t('kKEnter')], ['Supr / ⌫', t('kKDelete')], [t('kEsc'), t('kEscCancel')],
      ['P C U E B', t('kKModes')], ['Ctrl+Z / Ctrl+Y', t('kUndoRedo')]]));
    var flashTimer = 0;
    function flash(m) { flashNode.textContent = m; flashNode.hidden = false; clearTimeout(flashTimer); flashTimer = setTimeout(function () { flashNode.hidden = true; }, 5000); T.say(m); }

    var modeBtns = {};
    ['elec', 'logic'].forEach(function (m) { var b = T.btn(t('kMode_' + m), { cls: 'igt-chip', pressed: m === doc.mode, onClick: function () { doc.mode = m; sel = -1; pending = null; logicSim = null; syncMode(); refresh(); T.say(t('kMode_' + m)); } }); modeBtns[m] = b; modeTabs.appendChild(b); });
    var toolBtns = {};
    ['place', 'wire', 'use', 'edit', 'delete'].forEach(function (k) { var b = T.btn(t('kTool_' + k), { cls: 'igt-chip', pressed: k === tool, onClick: function () { setTool(k); } }); toolBtns[k] = b; toolBar.appendChild(b); });
    function setTool(k) { tool = k; pending = null; Object.keys(toolBtns).forEach(function (x) { T.press(toolBtns[x], x === k); }); cursorOut.textContent = t('kToolHelp_' + k); T.say(t('kTool_' + k) + '. ' + t('kToolHelp_' + k)); draw(); }
    function syncMode() {
      Object.keys(modeBtns).forEach(function (m) { T.press(modeBtns[m], m === doc.mode); });
      T.clear(palette);
      (doc.mode === 'elec' ? ELEC_TYPES : LOGIC_TYPES).forEach(function (ty) {
        if (ty === 'wire') return;
        palette.appendChild(T.btn(t('part_' + ty), { cls: 'igt-chip', pressed: ptype[doc.mode] === ty && tool === 'place', onClick: function () { ptype[doc.mode] = ty; setTool('place'); syncMode(); } }));
      });
      T.clear(optsBox);
      if (doc.mode === 'elec') {
        var kSel = h('select', { id: 'igt-k-kind' }, Object.keys(C.BATTERIES).map(function (k) { return h('option', { value: k, text: t('bat_' + k) }); })); kSel.value = opts.kind;
        kSel.addEventListener('change', function () { opts.kind = kSel.value; });
        var rSel = h('select', { id: 'igt-k-r' }, C.RESISTORS.map(function (r) { return h('option', { value: r, text: ohm(r) }); })); rSel.value = opts.r;
        rSel.addEventListener('change', function () { opts.r = +rSel.value; });
        var cSel = h('select', { id: 'igt-k-color' }, Object.keys(C.LEDS).map(function (k) { return h('option', { value: k, text: t('led_' + k) }); })); cSel.value = opts.color;
        cSel.addEventListener('change', function () { opts.color = cSel.value; });
        optsBox.appendChild(h('label', { class: 'igt-field', for: 'igt-k-kind' }, t('kBatteryKind'), kSel));
        optsBox.appendChild(h('label', { class: 'igt-field', for: 'igt-k-r' }, t('kResValue'), rSel));
        optsBox.appendChild(h('label', { class: 'igt-field', for: 'igt-k-color' }, t('kLedColor'), cSel));
      }
      optsBox.appendChild(h('p', { class: 'igt-note', text: t('kPartInfo_' + ptype[doc.mode]) }));
      T.clear(clockBar);
      if (doc.mode === 'logic') {
        clockBar.appendChild(T.btn(t('kPulse'), { icon: 'paso', cls: 'primary', onClick: pulse }));
        clockBar.appendChild(T.btn(t('kResetFF'), { icon: 'reiniciar', onClick: function () { logicSim = null; refresh(); T.say(t('kResetDone')); } }));
      }
      resize();
    }
    function ohm(r) { return r >= 1000 ? T.num(r / 1000, 1) + ' kΩ' : r + ' Ω'; }

    /* ---------- Geometría de la placa ---------- */
    var ctx, dispW = 800, dispH = 480, cell = 40, ox = 20, oy = 20;
    function dims() { return BOARD[doc.mode]; }
    function resize() {
      var d = dims(), w = Math.max(260, box.clientWidth || 800);
      cell = Math.max(14, Math.min(46, (w - 24) / (d[0] - 1)));
      dispW = w; dispH = Math.round(cell * (d[1] - 1) + 24);
      ox = (dispW - cell * (d[0] - 1)) / 2; oy = 12;
      ctx = T.fitCanvas(canvas, dispW, dispH); canvas.style.height = dispH + 'px'; draw();
    }
    function X(g) { return ox + g * cell; } function Y(g) { return oy + g * cell; }
    function toGrid(e) { var r = canvas.getBoundingClientRect(); var px = (e.clientX - r.left) * dispW / r.width, py = (e.clientY - r.top) * dispH / r.height; return [(px - ox) / cell, (py - oy) / cell]; }
    function snapG(p) { var d = dims(); return [Math.max(0, Math.min(d[0] - 1, Math.round(p[0]))), Math.max(0, Math.min(d[1] - 1, Math.round(p[1])))]; }
    function footprint(c) {
      if (TWO[c.t]) return null;
      var x = c.p[0], y = c.p[1];
      if (c.t === 'input' || c.t === 'clock' || c.t === 'out') return [x - 0.45, y - 0.45, x + 0.45, y + 0.45];
      return [x, y - 1, x + 2, y + 1];
    }
    function hitTest(g) {
      var best = -1, bd = 0.45, list = comps();
      list.forEach(function (c, i) {
        if (TWO[c.t]) {
          var ax = c.a[0], ay = c.a[1], bx = c.b[0], by = c.b[1], dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
          var r = L2 ? Math.max(0, Math.min(1, ((g[0] - ax) * dx + (g[1] - ay) * dy) / L2)) : 0, d = Math.hypot(ax + r * dx - g[0], ay + r * dy - g[1]);
          if (d < bd) { bd = d; best = i; }
        } else {
          var f = footprint(c); if (g[0] >= f[0] - 0.2 && g[0] <= f[2] + 0.2 && g[1] >= f[1] - 0.2 && g[1] <= f[3] + 0.2) { var d2 = 0.3; if (d2 < bd) { bd = d2; best = i; } }
        }
      });
      return best;
    }

    /* ---------- Edición ---------- */
    function nextLabel(kind) {
      var used = {}; comps().forEach(function (c) { if (c.label) used[c.label] = 1; });
      var pool = kind === 'input' ? 'ABCDEFGHIJK'.split('') : ['S', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'];
      for (var i = 0; i < pool.length; i++) if (!used[pool[i]]) return pool[i];
      return kind === 'input' ? 'X' + comps().length : 'L' + comps().length;
    }
    function place(g) {
      var ty = tool === 'wire' ? 'wire' : ptype[doc.mode];
      if (TWO[ty] && ty !== 'wire' && doc.mode === 'logic') ty = 'wire';
      if (TWO[ty]) {
        if (!pending) { pending = g.slice(); T.say(t('kStartMarked')); draw(); return; }
        if (pending[0] === g[0] && pending[1] === g[1]) { pending = null; draw(); return; }
        var a = pending, bpt = g; pending = null;
        if (comps().length >= 300) { flash(t('kTooMany')); return; }
        var lim = limits(); if (lim && lim.only && ty !== 'wire' && lim.only.indexOf(ty) < 0) { flash(t('kOnlyParts', { p: lim.only.map(function (x) { return t('part_' + x); }).join(', ') })); return; }
        edit(function () {
          var c = { t: ty, a: a, b: bpt };
          if (ty === 'battery') c.kind = lim && lim.battery ? lim.battery : opts.kind;
          if (ty === 'resistor') c.r = opts.r;
          if (ty === 'led') c.color = opts.color;
          if (ty === 'switch') c.on = false;
          comps().push(c);
        });
        T.say(t('kPlaced', { p: t('part_' + ty), n: comps().length }));
        return;
      }
      var lim2 = limits(); if (lim2 && lim2.only && lim2.only.indexOf(ty) < 0 && !/input|out|clock/.test(ty)) { flash(t('kOnlyParts', { p: lim2.only.map(function (x) { return t('part_' + x); }).join(', ') })); return; }
      var d = dims(), fx = ty === 'input' || ty === 'clock' || ty === 'out' ? 0 : 2, fy = ty === 'input' || ty === 'clock' || ty === 'out' ? 0 : 1;
      if (g[0] + fx > d[0] - 1 || g[1] - fy < 0 || g[1] + fy > d[1] - 1) { flash(t('kNoRoom')); return; }
      edit(function () {
        var c = { t: ty, p: g.slice() };
        if (ty === 'input') { c.v = 0; c.label = nextLabel('input'); }
        if (ty === 'out') c.label = nextLabel('out');
        if (ty === 'spdt') c.pos = 1;
        comps().push(c);
      });
      T.say(t('kPlaced', { p: t('part_' + ty), n: comps().length }));
    }
    function toggle(i) {
      var c = comps()[i]; if (!c) return;
      if (c.t === 'switch') edit(function () { c.on = !c.on; });
      else if (c.t === 'spdt') edit(function () { c.pos = c.pos === 2 ? 1 : 2; });
      else if (c.t === 'input') edit(function () { c.v = c.v ? 0 : 1; });
      else if (c.t === 'clock') { pulse(); return; }
      else { T.say(t('kNothingToUse')); return; }
      T.say(describeComp(c, i));
    }
    function remove(i) { edit(function () { comps().splice(i, 1); }); sel = -1; T.say(t('kDeleted')); }
    function limits() { var ch = retos.current(); return ch && ch.lim ? ch.lim : null; }

    /* ---------- Puntero y teclado ---------- */
    var downG = null;
    canvas.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      e.preventDefault(); canvas.focus({ preventScroll: true });
      var g = snapG(toGrid(e)); cursor.x = g[0]; cursor.y = g[1]; downG = g;
      var twoTool = tool === 'wire' || (tool === 'place' && TWO[ptype[doc.mode]]);
      if (twoTool && !pending) { pending = g.slice(); canvas.setPointerCapture(e.pointerId); }
      draw();
    });
    canvas.addEventListener('pointermove', function (e) { hover = snapG(toGrid(e)); draw(); });
    canvas.addEventListener('pointerleave', function () { hover = null; draw(); });
    canvas.addEventListener('pointerup', function (e) {
      var raw = toGrid(e), g = snapG(raw);
      var twoTool = tool === 'wire' || (tool === 'place' && TWO[ptype[doc.mode]]);
      if (twoTool) { if (pending && (pending[0] !== g[0] || pending[1] !== g[1])) place(g); else if (downG && (downG[0] !== g[0] || downG[1] !== g[1])) pending = null; }
      else if (tool === 'place') place(g);
      else { var i = hitTest(raw); if (i < 0) { T.say(t('kNoPartHere')); } else if (tool === 'use') toggle(i); else if (tool === 'edit') { sel = i; refresh(); T.say(describeComp(comps()[i], i)); } else if (tool === 'delete') remove(i); }
      downG = null; draw();
    });
    canvas.addEventListener('keydown', function (e) {
      var d = dims(), moved = true;
      if (e.key === 'ArrowLeft') cursor.x--; else if (e.key === 'ArrowRight') cursor.x++; else if (e.key === 'ArrowUp') cursor.y--; else if (e.key === 'ArrowDown') cursor.y++; else moved = false;
      if (moved) { e.preventDefault(); cursor.x = Math.max(0, Math.min(d[0] - 1, cursor.x)); cursor.y = Math.max(0, Math.min(d[1] - 1, cursor.y)); announce(); draw(); return; }
      var g = [cursor.x, cursor.y];
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (tool === 'place' || tool === 'wire') place(g);
        else { var i = hitTest(g); if (i < 0) T.say(t('kNoPartHere')); else if (tool === 'use') toggle(i); else if (tool === 'edit') { sel = i; refresh(); T.say(describeComp(comps()[i], i)); } else remove(i); }
        announce(); draw(); return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); var k = hitTest(g); if (k >= 0) remove(k); else T.say(t('kNoPartHere')); return; }
      if (e.key === 'Escape') { if (pending) { e.preventDefault(); pending = null; T.say(t('kCancelled')); draw(); } return; }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var map = { p: 'place', c: 'wire', u: 'use', e: 'edit', b: 'delete' }, lk = e.key.toLowerCase();
      if (map[lk]) { e.preventDefault(); setTool(map[lk]); }
    });
    function announce() {
      var i = hitTest([cursor.x, cursor.y]);
      cursorOut.textContent = t('kCursor', { x: cursor.x + 1, y: cursor.y + 1, what: i >= 0 ? describeComp(comps()[i], i) : t('kEmptyPoint') }) + (pending ? ' · ' + t('kFrom', { x: pending[0] + 1, y: pending[1] + 1 }) : '');
    }
    canvas.addEventListener('focus', function () { announce(); draw(); });
    canvas.addEventListener('blur', draw);
    history.bindKeys(document);

    /* ---------- Cálculo ---------- */
    var elecRes = null, logicRes = null;
    /* Se reconstruye la red en cada cambio, conservando lo que guardan los biestables. */
    function ensureLogic() {
      var L = new C.Logic(doc.logic);
      if (logicSim && logicSim.state.length === doc.logic.length) L.state = logicSim.state.slice();
      logicSim = L; return L;
    }
    function compute() {
      if (doc.mode === 'elec') { elecRes = doc.elec.length ? C.solveElec(doc.elec) : null; logicRes = null; }
      else { var L = ensureLogic(); logicRes = doc.logic.length ? L.values(null, false) : null; elecRes = null; }
    }
    function pulse() { if (doc.mode !== 'logic') return; var L = logicSim || ensureLogic(); logicRes = L.pulse(null); draw(); renderState(); renderTable(); T.say(t('kPulsed') + ' ' + outsSummary()); }
    function outsSummary() {
      if (!logicRes) return '';
      return doc.logic.map(function (c, i) { return c.t === 'out' ? c.label + ' = ' + (logicRes.out[i] === null ? '—' : logicRes.out[i]) : null; }).filter(Boolean).join(', ');
    }

    /* ---------- Dibujo ---------- */
    function draw() {
      if (!ctx) return;
      var c = ctx, d = dims(), hc = T.highContrast();
      c.fillStyle = doc.mode === 'elec' ? '#f7f4ee' : '#f3f5f9'; c.fillRect(0, 0, dispW, dispH);
      c.fillStyle = 'rgba(23,57,92,.3)';
      for (var gx = 0; gx < d[0]; gx++) for (var gy = 0; gy < d[1]; gy++) c.fillRect(X(gx) - 1.2, Y(gy) - 1.2, 2.4, 2.4);
      var list = comps();
      list.forEach(function (comp, i) { if (comp.t === 'wire') drawWire(c, comp, i, hc); });
      list.forEach(function (comp, i) { if (comp.t !== 'wire') { if (doc.mode === 'elec') drawElec(c, comp, i, hc); else drawLogic(c, comp, i, hc); } });
      if (sel >= 0 && list[sel]) {
        var cm = list[sel], f = footprint(cm) || [Math.min(cm.a[0], cm.b[0]), Math.min(cm.a[1], cm.b[1]), Math.max(cm.a[0], cm.b[0]), Math.max(cm.a[1], cm.b[1])];
        c.save(); c.setLineDash([5, 4]); c.strokeStyle = '#5a49a8'; c.lineWidth = 2; c.strokeRect(X(f[0]) - 12, Y(f[1]) - 12, X(f[2]) - X(f[0]) + 24, Y(f[3]) - Y(f[1]) + 24); c.restore();
      }
      if (pending) { var tg = document.activeElement === canvas ? [cursor.x, cursor.y] : (hover || pending); c.save(); c.setLineDash([6, 4]); c.strokeStyle = '#5a49a8'; c.lineWidth = 3; c.beginPath(); c.moveTo(X(pending[0]), Y(pending[1])); c.lineTo(X(tg[0]), Y(tg[1])); c.stroke(); c.restore(); }
      var cp = document.activeElement === canvas ? [cursor.x, cursor.y] : hover;
      if (cp) { c.strokeStyle = '#a8336f'; c.lineWidth = 2; c.beginPath(); c.arc(X(cp[0]), Y(cp[1]), 8, 0, Math.PI * 2); c.stroke(); }
    }
    function lineW(c, a, b, col, w, dash) { c.save(); if (dash) c.setLineDash(dash); c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); c.moveTo(X(a[0]), Y(a[1])); c.lineTo(X(b[0]), Y(b[1])); c.stroke(); c.restore(); }
    function drawWire(c, w, i, hc) {
      if (doc.mode === 'logic' && logicRes) {
        var v = logicRes.net(C.pk(w.a));
        if (v === 1) lineW(c, w.a, w.b, hc ? '#000' : '#c77700', 5);
        else if (v === 0) lineW(c, w.a, w.b, hc ? '#000' : '#7b8794', 2.5, [7, 5]);
        else lineW(c, w.a, w.b, '#b8c2cc', 2, [2, 5]);
      } else {
        var live = elecRes && elecRes.ok && Math.abs(nodeV(w.a)) + Math.abs(nodeV(w.b)) >= 0 && wireCurrentish(w);
        lineW(c, w.a, w.b, hc ? '#000' : live ? '#1f5f8b' : '#5d6877', live ? 4.5 : 3);
      }
      [w.a, w.b].forEach(function (p) { c.fillStyle = '#17395c'; c.beginPath(); c.arc(X(p[0]), Y(p[1]), 3.5, 0, Math.PI * 2); c.fill(); });
    }
    function nodeV(p) { return elecRes && elecRes.nodeV ? (elecRes.nodeV[C.pk(p)] || 0) : 0; }
    function wireCurrentish(w) {
      /* un cable está «vivo» si toca un componente por el que pasa corriente */
      var k1 = C.pk(w.a), k2 = C.pk(w.b), found = false;
      doc.elec.forEach(function (c, i) {
        var r = elecRes.comps[i]; if (!r || r.i === null || Math.abs(r.i) < 0.001 || c.t === 'wire') return;
        var T2 = C.terminals(c); Object.keys(T2).forEach(function (k) { if (T2[k] === k1 || T2[k] === k2) found = true; });
      });
      return found;
    }
    function midAng(comp) { var ax = X(comp.a[0]), ay = Y(comp.a[1]), bx = X(comp.b[0]), by = Y(comp.b[1]); return { mx: (ax + bx) / 2, my: (ay + by) / 2, ang: Math.atan2(by - ay, bx - ax), ax: ax, ay: ay, bx: bx, by: by }; }
    function drawElec(c, comp, i, hc) {
      var r = elecRes && elecRes.ok ? elecRes.comps[i] : null;
      if (comp.t === 'spdt') {
        var p = comp.p, t1 = [p[0] + 2, p[1] - 1], t2 = [p[0] + 2, p[1] + 1], tgt = comp.pos === 2 ? t2 : t1;
        lineW(c, p, [p[0] + 0.6, p[1]], '#17395c', 3);
        c.strokeStyle = '#17395c'; c.lineWidth = 3; c.beginPath(); c.moveTo(X(p[0] + 0.6), Y(p[1])); c.lineTo(X(tgt[0] - 0.5), Y(tgt[1])); c.stroke();
        lineW(c, [t1[0] - 0.5, t1[1]], t1, '#17395c', 3); lineW(c, [t2[0] - 0.5, t2[1]], t2, '#17395c', 3);
        [p, t1, t2].forEach(function (q) { c.fillStyle = '#fff'; c.strokeStyle = '#17395c'; c.lineWidth = 2; c.beginPath(); c.arc(X(q[0]), Y(q[1]), 4, 0, Math.PI * 2); c.fill(); c.stroke(); });
        label(c, X(p[0] + 1), Y(p[1] + 1.35), t('kPos', { n: comp.pos }));
        return;
      }
      var m = midAng(comp), len = Math.hypot(m.bx - m.ax, m.by - m.ay), body = Math.min(len * 0.55, 46);
      c.save(); c.translate(m.mx, m.my); c.rotate(m.ang);
      /* terminales */
      c.strokeStyle = '#17395c'; c.lineWidth = 3; c.beginPath(); c.moveTo(-len / 2, 0); c.lineTo(-body / 2, 0); c.moveTo(body / 2, 0); c.lineTo(len / 2, 0); c.stroke();
      if (comp.t === 'battery') {
        c.fillStyle = '#fff'; c.fillRect(-body / 2, -12, body, 24); c.strokeRect(-body / 2, -12, body, 24);
        c.fillStyle = '#c0392b'; c.fillRect(body / 2 - 6, -12, 6, 24);
        c.fillStyle = '#c0392b'; c.font = '700 14px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('+', body / 2 + 8, -15); c.fillStyle = '#17395c'; c.fillText('−', -body / 2 - 8, -15);
        if (r && r.short) { c.strokeStyle = '#b3261e'; c.lineWidth = 3; c.strokeRect(-body / 2 - 4, -16, body + 8, 32); }
      } else if (comp.t === 'resistor') {
        c.fillStyle = r && r.hot ? '#f7c9a9' : '#fff'; c.fillRect(-body / 2, -8, body, 16); c.strokeRect(-body / 2, -8, body, 16);
      } else if (comp.t === 'lamp') {
        var br = r ? Math.min(1, r.bright || 0) : 0;
        if (br > 0.02 && !r.burnt) { var gr = c.createRadialGradient(0, 0, 2, 0, 0, 28 + 18 * br); gr.addColorStop(0, 'rgba(255,214,90,' + (0.35 + 0.6 * br) + ')'); gr.addColorStop(1, 'rgba(255,214,90,0)'); c.fillStyle = gr; c.beginPath(); c.arc(0, 0, 28 + 18 * br, 0, Math.PI * 2); c.fill(); }
        c.fillStyle = r && r.burnt ? '#9aa3ad' : br > 0.02 ? 'rgb(255,' + Math.round(230 - 40 * br) + ',120)' : '#fff'; c.beginPath(); c.arc(0, 0, 13, 0, Math.PI * 2); c.fill(); c.stroke();
        c.beginPath(); c.moveTo(-9, -9); c.lineTo(9, 9); c.moveTo(9, -9); c.lineTo(-9, 9); c.lineWidth = r && r.burnt ? 3 : 1.5; c.strokeStyle = r && r.burnt ? '#b3261e' : '#17395c'; c.stroke();
      } else if (comp.t === 'led') {
        var L = C.LEDS[comp.color] || C.LEDS.rojo, lb = r && r.lit && !r.burnt ? Math.min(1, r.bright) : 0;
        if (lb > 0.02) { var g2 = c.createRadialGradient(0, 0, 2, 0, 0, 30); g2.addColorStop(0, hexA(L.color, 0.3 + 0.6 * lb)); g2.addColorStop(1, hexA(L.color, 0)); c.fillStyle = g2; c.beginPath(); c.arc(0, 0, 30, 0, Math.PI * 2); c.fill(); }
        c.fillStyle = lb > 0.02 ? L.color : '#fff'; c.strokeStyle = r && r.burnt ? '#b3261e' : '#17395c'; c.lineWidth = 2.5;
        c.beginPath(); c.moveTo(-10, -11); c.lineTo(10, 0); c.lineTo(-10, 11); c.closePath(); c.fill(); c.stroke();
        c.beginPath(); c.moveTo(11, -11); c.lineTo(11, 11); c.stroke();
        if (r && r.burnt) { c.beginPath(); c.moveTo(-14, -14); c.lineTo(14, 14); c.stroke(); }
      } else if (comp.t === 'switch') {
        c.fillStyle = '#fff'; c.beginPath(); c.arc(-body / 2, 0, 4, 0, Math.PI * 2); c.arc(body / 2, 0, 4, 0, Math.PI * 2); c.fill(); c.stroke();
        c.beginPath(); c.moveTo(-body / 2, 0); if (comp.on) c.lineTo(body / 2, 0); else c.lineTo(body / 2 - 4, -body / 2.4); c.stroke();
      } else if (comp.t === 'motor') {
        c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, 15, 0, Math.PI * 2); c.fill(); c.stroke();
        c.rotate(-m.ang); c.fillStyle = '#17395c'; c.font = '700 14px Atkinson Hyperlegible, Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('M', 0, 1);
        if (r && r.spin) { c.strokeStyle = '#2e7d4f'; c.lineWidth = 2.5; c.beginPath(); c.arc(0, 0, 21, r.dir > 0 ? -2.4 : -0.7, r.dir > 0 ? -0.7 : -2.4, r.dir < 0); c.stroke(); var ex = 21 * Math.cos(r.dir > 0 ? -0.7 : -2.4), ey = 21 * Math.sin(r.dir > 0 ? -0.7 : -2.4); c.fillStyle = '#2e7d4f'; c.beginPath(); c.arc(ex, ey, 3.5, 0, Math.PI * 2); c.fill(); }
        c.rotate(m.ang);
      }
      c.restore();
      [comp.a, comp.b].forEach(function (q) { c.fillStyle = '#17395c'; c.beginPath(); c.arc(X(q[0]), Y(q[1]), 3.5, 0, Math.PI * 2); c.fill(); });
      var txt = compShort(comp, r);
      if (txt) label(c, m.mx + Math.sin(m.ang) * 26, m.my - Math.cos(m.ang) * 26 + (Math.abs(Math.sin(m.ang)) > 0.7 ? 0 : 0), txt);
    }
    function hexA(hex, a) { return 'rgba(' + [1, 3, 5].map(function (k) { return parseInt(hex.slice(k, k + 2), 16); }).join(',') + ',' + a + ')'; }
    function label(c, x, y, s) { c.font = '12px Atkinson Hyperlegible, Arial'; var w = c.measureText(s).width + 8; c.fillStyle = 'rgba(255,255,255,.9)'; c.fillRect(x - w / 2, y - 9, w, 18); c.fillStyle = '#17395c'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(s, x, y); }
    function compShort(comp, r) {
      if (comp.t === 'resistor') return ohm(comp.r);
      if (comp.t === 'battery') return (r && r.short ? t('kShortShort') + ' · ' : '') + T.num(C.BATTERIES[comp.kind].v, 1) + ' V';
      if (!r) return '';
      if (comp.t === 'lamp') return r.burnt ? t('kBurnt') : T.num(Math.min(150, r.bright * 100), 0) + ' %';
      if (comp.t === 'led') return r.burnt ? t('kBurnt') : r.lit ? T.num(r.i * 1000, 1) + ' mA' : t('kOff');
      if (comp.t === 'motor') return r.spin ? T.num(r.rpm, 0) + ' rpm' : t('kStopped');
      if (comp.t === 'battery' && r.short) return t('kShortShort');
      return '';
    }
    var GLABEL = { and: 'Y', or: 'O', not: 'NO', xor: 'OX', nand: 'NO-Y', nor: 'NO-O', dff: 'D' };
    function drawLogic(c, comp, i, hc) {
      var p = comp.p, v = logicRes;
      if (comp.t === 'input' || comp.t === 'clock') {
        var on = v ? v.net(C.pk(p)) === 1 : false;
        c.fillStyle = on ? '#f2b705' : '#fff'; c.strokeStyle = '#17395c'; c.lineWidth = 2.5;
        c.fillRect(X(p[0]) - 15, Y(p[1]) - 13, 30, 26); c.strokeRect(X(p[0]) - 15, Y(p[1]) - 13, 30, 26);
        c.fillStyle = '#17395c'; c.font = '700 13px Atkinson Hyperlegible, Arial'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText(comp.t === 'clock' ? '⏱' + (on ? '1' : '0') : (on ? '1' : '0'), X(p[0]), Y(p[1]) + 1);
        if (comp.t === 'input') label(c, X(p[0]), Y(p[1]) - 24, comp.label);
        return;
      }
      if (comp.t === 'out') {
        var val = v ? v.out[i] : null;
        if (val === 1) { var gr = c.createRadialGradient(X(p[0]), Y(p[1]), 2, X(p[0]), Y(p[1]), 26); gr.addColorStop(0, 'rgba(255,200,60,.8)'); gr.addColorStop(1, 'rgba(255,200,60,0)'); c.fillStyle = gr; c.beginPath(); c.arc(X(p[0]), Y(p[1]), 26, 0, Math.PI * 2); c.fill(); }
        c.fillStyle = val === 1 ? '#ffd24d' : '#fff'; c.strokeStyle = '#17395c'; c.lineWidth = 2.5; c.beginPath(); c.arc(X(p[0]), Y(p[1]), 12, 0, Math.PI * 2); c.fill(); c.stroke();
        c.fillStyle = '#17395c'; c.font = '700 12px Atkinson Hyperlegible, Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(val === 1 ? '1' : val === 0 ? '0' : '?', X(p[0]), Y(p[1]) + 1);
        label(c, X(p[0]), Y(p[1]) - 24, comp.label);
        return;
      }
      var x0 = X(p[0] + 0.35), x1 = X(p[0] + 1.65), y0 = Y(p[1] - 0.8), y1 = Y(p[1] + 0.8), P = C.logicPins(comp);
      P.ins.forEach(function (pin) { var q = pin.split(',').map(Number); lineW(c, q, [p[0] + 0.35, q[1]], '#17395c', 2.5); });
      lineW(c, [p[0] + 1.65, p[1] - (comp.t === 'dff' ? 1 : 0)], [p[0] + 2, p[1] - (comp.t === 'dff' ? 1 : 0)], '#17395c', 2.5);
      if (comp.t === 'dff') lineW(c, [p[0] + 1.65, p[1] + 1], [p[0] + 2, p[1] + 1], '#17395c', 2.5);
      var outOn = v && v.gateOut && v.gateOut[i] === 1;
      c.fillStyle = comp.t === 'dff' ? '#eef3fb' : outOn ? '#fff4d6' : '#fff'; c.strokeStyle = '#17395c'; c.lineWidth = 2.5;
      c.beginPath(); if (c.roundRect) c.roundRect(x0, y0, x1 - x0, y1 - y0, 8); else c.rect(x0, y0, x1 - x0, y1 - y0); c.fill(); c.stroke();
      c.fillStyle = '#17395c'; c.font = '700 ' + Math.max(10, Math.round(cell * 0.33)) + 'px Atkinson Hyperlegible, Arial'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(T.lang === 'en' ? comp.t.toUpperCase().replace('DFF', 'D') : GLABEL[comp.t], (x0 + x1) / 2, (y0 + y1) / 2);
      if (comp.t === 'dff') { c.font = '11px Atkinson Hyperlegible, Arial'; c.textAlign = 'left'; c.fillText('D', x0 + 3, Y(p[1] - 1) + 1); c.fillText('⏱', x0 + 3, Y(p[1] + 1) - 1); c.textAlign = 'right'; c.fillText('Q', x1 - 3, Y(p[1] - 1) + 1); c.fillText('Q̄', x1 - 3, Y(p[1] + 1) - 1); }
      P.ins.concat([P.out, P.outN].filter(Boolean)).forEach(function (pin) { var q = pin.split(',').map(Number); c.fillStyle = '#17395c'; c.beginPath(); c.arc(X(q[0]), Y(q[1]), 3.5, 0, Math.PI * 2); c.fill(); });
    }

    /* ---------- Texto equivalente, estado y tablas ---------- */
    function describeComp(c, i) {
      var r = elecRes && elecRes.ok && doc.mode === 'elec' ? elecRes.comps[i] : null, s = t('part_' + c.t) + ' ' + (i + 1);
      if (TWO[c.t]) s += ' ' + t('kBetween', { a: (c.a[0] + 1) + ',' + (c.a[1] + 1), b: (c.b[0] + 1) + ',' + (c.b[1] + 1) });
      else s += ' ' + t('kAt', { p: (c.p[0] + 1) + ',' + (c.p[1] + 1) });
      if (c.t === 'battery') s += ' · ' + t('bat_' + c.kind);
      if (c.t === 'resistor') s += ' · ' + ohm(c.r);
      if (c.t === 'led') s += ' · ' + t('led_' + c.color);
      if (c.t === 'switch') s += ' · ' + (c.on ? t('kClosed') : t('kOpen'));
      if (c.t === 'spdt') s += ' · ' + t('kPos', { n: c.pos });
      if (c.label) s += ' · «' + c.label + '»';
      if (c.t === 'input') s += ' = ' + (c.v ? 1 : 0);
      if (r && r.i !== null && c.t !== 'wire') s += ' · ' + T.num(Math.abs(r.i) * 1000, 1) + ' mA';
      var sh = compShort(c, r); if (sh && c.t !== 'resistor') s += ' · ' + sh;
      if (doc.mode === 'logic' && logicRes && c.t === 'out') s += ' = ' + (logicRes.out[i] === null ? '—' : logicRes.out[i]);
      return s;
    }
    function renderState() {
      T.clear(resBox);
      if (doc.mode === 'elec') {
        if (!doc.elec.length) { resBox.appendChild(h('p', { class: 'igt-note', text: t('kEmptyElec') })); return; }
        if (!elecRes.ok) { resBox.appendChild(T.result(false, elecRes.reason === 'noBattery' ? t('kNoBattery') : t('kCantSolve'))); return; }
        var lines = [];
        doc.elec.forEach(function (c, i) {
          var r = elecRes.comps[i]; if (!r) return;
          if (c.t === 'lamp') lines.push(t('kLampLine', { n: i + 1, b: r.burnt ? t('kBurnt') : T.num(Math.min(150, r.bright * 100), 0) + ' %' }));
          if (c.t === 'led') lines.push(t('kLedLine', { n: i + 1, s: r.burnt ? t('kBurnt') : r.lit ? T.num(r.i * 1000, 1) + ' mA' : (r.reverse ? t('kReverse') : t('kOff')) }));
          if (c.t === 'motor') lines.push(t('kMotorLine', { n: i + 1, s: r.spin ? T.num(r.rpm, 0) + ' rpm · ' + (r.dir > 0 ? t('kCW') : t('kCCW')) : t('kStopped') }));
          if (c.t === 'battery') lines.push(t('kBatLine', { n: i + 1, i: T.num(r.i * 1000, 0), v: T.num(r.v, 2) }));
        });
        if (elecRes.short) resBox.appendChild(T.result(false, t('kShort')));
        resBox.appendChild(h('ul', { class: 'igt-limits' }, lines.map(function (l) { return h('li', { text: l }); })));
      } else {
        if (!doc.logic.length) { resBox.appendChild(h('p', { class: 'igt-note', text: t('kEmptyLogic') })); return; }
        var L = ensureLogic();
        if (L.conflicts.length) resBox.appendChild(T.result(false, t('kConflict')));
        if (logicRes && logicRes.oscillates) resBox.appendChild(T.result(false, t('kOscillates')));
        var o = outsSummary(); resBox.appendChild(h('p', { text: o ? t('kOutputsNow', { o: o }) : t('kNoOutputs') }));
      }
      checkChallenge();
    }
    function renderTable() {
      T.clear(tableWrap);
      var list = comps();
      if (!list.length) { tableWrap.appendChild(h('p', { class: 'igt-note', id: 'igt-k-tcap', style: 'padding:10px 12px', text: t('kTableCap', { n: 0 }) })); T.clear(ttWrap); ttWrap.hidden = true; return; }
      var tb = h('tbody');
      list.forEach(function (c, i) {
        var acts = h('td');
        if (/switch|spdt|input|clock/.test(c.t)) acts.appendChild(T.btn(t('kUseN', { n: i + 1 }), { onClick: function () { toggle(i); } }));
        acts.appendChild(T.btn(t('kEditN', { n: i + 1 }), { cls: 'icon-only', icon: 'ojo', onClick: function () { sel = i; refresh(); var f = propBox.querySelector('input,select,button'); if (f) f.focus(); } }));
        acts.appendChild(T.btn(t('kDelN', { n: i + 1 }), { cls: 'icon-only danger', icon: 'borrar', onClick: function () { remove(i); } }));
        tb.appendChild(h('tr', null, h('th', { scope: 'row', text: String(i + 1) }), h('td', { text: describeComp(c, i) }), acts));
      });
      tableWrap.appendChild(h('table', { class: 'igt-table' }, h('caption', { id: 'igt-k-tcap', text: t('kTableCap', { n: list.length }) }),
        h('thead', null, h('tr', null, [t('thN'), t('kThPart'), t('kThActions')].map(function (x) { return h('th', { scope: 'col', text: x }); }))), tb));
      renderTruth();
    }
    function renderTruth() {
      T.clear(ttWrap);
      if (doc.mode !== 'logic' || !doc.logic.length) { ttWrap.hidden = true; return; }
      ttWrap.hidden = false;
      var tt = C.truthTable(doc.logic);
      if (tt.tooMany) { ttWrap.appendChild(h('p', { class: 'igt-note', id: 'igt-k-ttcap', style: 'padding:10px 12px', text: t('kTTTooMany') })); return; }
      if (!tt.ins.length || !tt.outs.length) { ttWrap.appendChild(h('p', { class: 'igt-note', id: 'igt-k-ttcap', style: 'padding:10px 12px', text: t('kTTNeed') })); return; }
      var hasFF = doc.logic.some(function (c) { return c.t === 'dff'; });
      var tb = h('tbody');
      tt.rows.forEach(function (row) { tb.appendChild(h('tr', null, row.ins.map(function (v) { return h('td', { text: String(v) }); }).concat(row.outs.map(function (v) { return h('td', { text: v === null ? '—' : String(v) }); })))); });
      ttWrap.appendChild(h('table', { class: 'igt-table igt-tt' }, h('caption', { id: 'igt-k-ttcap', text: t('kTTCap') + (hasFF ? ' ' + t('kTTFF') : '') }),
        h('thead', null, h('tr', null, tt.labelsIn.map(function (x) { return h('th', { scope: 'col', text: x }); }).concat(tt.labelsOut.map(function (x) { return h('th', { scope: 'col', class: 'igt-tt-out', text: x + ' ' + t('kOutMark') }); })))), tb));
    }
    function renderAlt() {
      T.clear(altBox);
      altBox.appendChild(h('h3', { text: t('kAltTitle') }));
      var list = comps(), counts = {};
      list.forEach(function (c) { counts[c.t] = (counts[c.t] || 0) + 1; });
      altBox.appendChild(h('p', { text: list.length ? t('kAltText', { m: t('kMode_' + doc.mode), n: list.length, parts: Object.keys(counts).map(function (k) { return t('part_' + k) + ': ' + counts[k]; }).join(', ') }) : t('kAltEmpty') }));
      altBox.appendChild(h('p', { class: 'igt-note', text: doc.mode === 'elec' ? t('kLegendElec') : t('kLegendLogic') }));
      canvas.setAttribute('aria-label', t('kCanvasLabel', { m: t('kMode_' + doc.mode), n: list.length }));
    }
    function renderProps() {
      T.clear(propBox);
      var c = comps()[sel];
      if (!c) { propBox.appendChild(h('p', { class: 'igt-note', text: t('kPropsEmpty') })); return; }
      propBox.appendChild(h('p', { text: describeComp(c, sel) }));
      if (c.t === 'battery') propBox.appendChild(selField('kind', t('kBatteryKind'), Object.keys(C.BATTERIES).map(function (k) { return [k, t('bat_' + k)]; })));
      if (c.t === 'resistor') propBox.appendChild(selField('r', t('kResValue'), C.RESISTORS.map(function (r) { return [String(r), ohm(r)]; }), true));
      if (c.t === 'led') propBox.appendChild(selField('color', t('kLedColor'), Object.keys(C.LEDS).map(function (k) { return [k, t('led_' + k)]; })));
      if (c.label !== undefined) {
        var li = h('input', { type: 'text', id: 'igt-k-label', value: c.label, maxlength: 4, autocomplete: 'off' });
        li.addEventListener('change', function () { var v = li.value.trim().toUpperCase().slice(0, 4); if (!v) { li.value = c.label; return; } edit(function () { c.label = v; }); T.say(t('kLabelSet', { l: v })); });
        propBox.appendChild(h('label', { class: 'igt-field', for: 'igt-k-label' }, t('kLabel'), li));
      }
      if (TWO[c.t] && c.t !== 'wire') propBox.appendChild(T.btn(t('kFlip'), { onClick: function () { edit(function () { var a = c.a; c.a = c.b; c.b = a; }); T.say(t('kFlipped')); } }));
      if (/switch|spdt|input/.test(c.t)) propBox.appendChild(T.btn(t('kToggle'), { onClick: function () { toggle(sel); } }));
      propBox.appendChild(T.btn(t('kDelete'), { icon: 'borrar', cls: 'danger', onClick: function () { remove(sel); } }));
      function selField(key, lab, options, num) {
        var s = h('select', { id: 'igt-k-p-' + key }, options.map(function (o) { return h('option', { value: o[0], text: o[1] }); })); s.value = String(c[key]);
        s.addEventListener('change', function () { var v = num ? +s.value : s.value; edit(function () { c[key] = v; }); });
        return h('label', { class: 'igt-field', for: 'igt-k-p-' + key }, lab, s);
      }
    }

    /* ---------- Retos ---------- */
    var checkBox = h('div', { 'aria-live': 'polite' });
    function onPick(ch) {
      randomSpec = null;
      if (ch && ch.mode && ch.mode !== doc.mode) { doc.mode = ch.mode; sel = -1; pending = null; logicSim = null; syncMode(); }
      if (ch && ch.random) randomSpec = C.randomTarget(Date.now() & 0xffffffff);
      if (ch && ch.lim && ch.lim.battery) { opts.kind = ch.lim.battery; syncMode(); }
      refresh();
      if (!ch) return null;
      var wrap = h('div', { class: 'igt-noprint' });
      var row = h('div', { class: 'igt-bar' });
      if (ch.labels) row.appendChild(T.btn(t('kPrepare'), { onClick: function () { prepareLabels(ch); } }));
      if (ch.random) row.appendChild(T.btn(t('kAnother'), { icon: 'reiniciar', onClick: function () { randomSpec = C.randomTarget((Date.now() * 7) & 0xffffffff); renderTarget(); checkChallenge(); T.say(t('kNewTable')); } }));
      wrap.appendChild(row);
      wrap.appendChild(targetBox);
      wrap.appendChild(checkBox);
      renderTarget(); checkChallenge();
      return wrap;
    }
    var targetBox = h('div');
    function renderTarget() {
      T.clear(targetBox);
      var ch = retos.current(); if (!ch || !(ch.target || ch.random)) return;
      var spec = ch.random ? randomSpec : C.TARGETS[ch.target];
      if (!spec) return;
      var tb = h('tbody');
      for (var m = 0; m < (1 << spec.ins.length); m++) {
        var bits = spec.ins.map(function (_, k) { return (m >> (spec.ins.length - 1 - k)) & 1; });
        tb.appendChild(h('tr', null, bits.map(function (b) { return h('td', { text: String(b) }); }).concat(spec.f(bits).map(function (b) { return h('td', { text: String(b) }); }))));
      }
      targetBox.appendChild(h('div', { class: 'igt-table-wrap' }, h('table', { class: 'igt-table igt-tt' }, h('caption', { text: t('kTargetCap') }),
        h('thead', null, h('tr', null, spec.ins.map(function (x) { return h('th', { scope: 'col', text: x }); }).concat(spec.outs.map(function (x) { return h('th', { scope: 'col', class: 'igt-tt-out', text: x + ' ' + t('kOutMark') }); })))), tb)));
    }
    function prepareLabels(ch) {
      var spec = ch.random ? randomSpec : ch.target ? C.TARGETS[ch.target] : { ins: [], outs: ch.labels.outs || [] };
      var insN = ch.labels.ins || spec.ins, outsN = ch.labels.outs || spec.outs;
      edit(function () {
        var have = {}; doc.logic.forEach(function (c) { if (c.label) have[c.label] = 1; });
        insN.forEach(function (n, k) { if (!have[n]) doc.logic.push({ t: 'input', p: [1, 2 + k * 3], v: 0, label: n }); });
        outsN.forEach(function (n, k) { if (!have[n]) doc.logic.push({ t: 'out', p: [BOARD.logic[0] - 2, 2 + k * 3], label: n }); });
        if (ch.labels.clock && !doc.logic.some(function (c) { return c.t === 'clock'; })) doc.logic.push({ t: 'clock', p: [1, BOARD.logic[1] - 2] });
      });
      T.say(t('kPrepared'));
    }
    function checkChallenge() {
      T.clear(checkBox);
      var ch = retos.current(); if (!ch) return;
      var out = [];
      if (ch.mode === 'elec') out = checkElec(ch);
      else if (ch.traffic) { var tr = C.checkTraffic(doc.logic, ch.traffic, 8); out.push([tr.reason !== 'labelsOut', t('kChkLabels', { l: ch.traffic.join(', ') })]); if (tr.reason !== 'labelsOut') { out.push([tr.okOne, t('kChkOneLight')]); out.push([tr.ok, t('kChkOrder')]); } }
      else {
        var spec = ch.random ? randomSpec : C.TARGETS[ch.target];
        var r = C.matchTable(doc.logic, spec);
        out.push([r.reason !== 'labelsIn' && r.reason !== 'labelsOut', t('kChkLabels', { l: spec.ins.concat(spec.outs).join(', ') })]);
        if (r.tt) { out.push([!r.conflicts, t('kChkNoConflict')]); out.push([!r.osc, t('kChkNoOsc')]); out.push([r.ok, t('kChkTable', { ok: r.total - r.bad, n: r.total })]); }
        if (ch.lim && ch.lim.only) { var bad = doc.logic.filter(function (c) { return C.GATES[c.t] && ch.lim.only.indexOf(c.t) < 0; }).length; out.push([bad === 0, t('kChkOnly', { p: ch.lim.only.map(function (x) { return t('part_' + x); }).join(', ') })]); }
        if (ch.lim && ch.lim.maxGates) { var ng = doc.logic.filter(function (c) { return C.GATES[c.t]; }).length; out.push([ng <= ch.lim.maxGates, t('kChkMaxGates', { n: ng, m: ch.lim.maxGates })]); }
      }
      var all = out.length && out.every(function (x) { return x[0]; });
      checkBox.appendChild(T.result(all, all ? t('kDone') : t('kNotYet')));
      checkBox.appendChild(h('ul', { class: 'igt-limits igt-checks', role: 'list' }, out.map(function (x) { return h('li', { text: (x[0] ? '✓ ' : '· ') + x[1] }); })));
    }
    /* Prueba el circuito con todas las posiciones de interruptores y conmutadores (máximo 6). */
    function combos() {
      var idx = []; doc.elec.forEach(function (c, i) { if (c.t === 'switch' || c.t === 'spdt') idx.push(i); });
      idx = idx.slice(0, 6);
      var saved = idx.map(function (i) { var c = doc.elec[i]; return c.t === 'switch' ? c.on : c.pos; }), out = [];
      for (var m = 0; m < (1 << idx.length); m++) {
        idx.forEach(function (i, k) { var c = doc.elec[i], bit = (m >> k) & 1; if (c.t === 'switch') c.on = !!bit; else c.pos = bit ? 2 : 1; });
        out.push({ m: m, r: C.solveElec(doc.elec) });
      }
      idx.forEach(function (i, k) { var c = doc.elec[i]; if (c.t === 'switch') c.on = saved[k]; else c.pos = saved[k]; });
      return { idx: idx, list: out };
    }
    function checkElec(ch) {
      var R = ch.rules || {}, out = [], list = doc.elec, cnt = function (ty) { return list.filter(function (c) { return c.t === ty; }).length; };
      var cb = combos(), ok = function (r) { return r.ok && !r.short; };
      function lamps(r) { return list.map(function (c, i) { return c.t === 'lamp' ? r.comps[i] : null; }).filter(Boolean); }
      if (R.minLamps) out.push([cnt('lamp') >= R.minLamps, t('kChkLamps', { n: cnt('lamp'), m: R.minLamps })]);
      if (R.needs) R.needs.forEach(function (ty) { out.push([cnt(ty) >= 1, t('kChkHas', { p: t('part_' + ty) })]); });
      if (R.spdt) out.push([cnt('spdt') >= R.spdt, t('kChkHas', { p: t('part_spdt') + ' ×' + R.spdt })]);
      var any = cb.list.filter(function (x) { return ok(x.r); });
      out.push([any.length === cb.list.length && cb.list.length > 0, t('kChkNoShort')]);
      if (R.bright) out.push([any.some(function (x) { var L = lamps(x.r); return L.length && L.every(function (l) { return l.bright >= R.bright && !l.burnt; }); }), t('kChkBright', { p: Math.round(R.bright * 100) })]);
      if (R.offToo) out.push([any.some(function (x) { var L = lamps(x.r); return L.length && L.every(function (l) { return l.bright < 0.05; }); }), t('kChkOffToo')]);
      if (R.noBurn) out.push([cb.list.every(function (x) { return !x.r.ok || x.r.comps.every(function (c) { return !c || !c.burnt; }); }), t('kChkNoBurn')]);
      if (R.led) out.push([any.some(function (x) { return list.some(function (c, i) { var q = x.r.comps[i]; return c.t === 'led' && q && q.lit && q.i >= R.led[0] && q.i <= R.led[1] && !q.burnt; }); }), t('kChkLed', { a: R.led[0] * 1000, b: R.led[1] * 1000 })]);
      if (R.stair) {
        var good = cb.idx.length >= 2 && cb.list.every(function (x) { return ok(x.r); });
        if (good) {
          var on = {}; cb.list.forEach(function (x) { var L = lamps(x.r); on[x.m] = L.length && L[0].bright > 0.3; });
          cb.list.forEach(function (x) { for (var k = 0; k < cb.idx.length; k++) if (cb.list[x.m ^ (1 << k)] && on[x.m] === on[x.m ^ (1 << k)]) good = false; });
        }
        out.push([good, t('kChkStair')]);
      }
      if (R.reverse) {
        var fw = false, bw = false;
        any.forEach(function (x) { list.forEach(function (c, i) { var q = x.r.comps[i]; if (c.t === 'motor' && q && q.spin) { if (q.dir > 0) fw = true; else bw = true; } }); });
        out.push([fw && bw, t('kChkReverse')]);
      }
      return out;
    }

    function refresh() { compute(); renderState(); renderTable(); renderAlt(); renderProps(); legend.textContent = doc.mode === 'elec' ? t('kLegendElec') : t('kLegendLogic'); draw(); }
    function loadDoc(d) {
      if (!d || !Array.isArray(d.elec) || !Array.isArray(d.logic)) throw new Error('bad');
      function pt(p) { return Array.isArray(p) && p.length === 2 && p.every(function (v) { return Number.isInteger(v) && v >= 0 && v < 40; }) ? [p[0], p[1]] : null; }
      function clean(list, types) {
        return list.slice(0, 300).filter(function (c) { return c && types.indexOf(c.t) >= 0; }).map(function (c) {
          var o = { t: c.t };
          if (TWO[c.t]) { o.a = pt(c.a); o.b = pt(c.b); if (!o.a || !o.b) return null; } else { o.p = pt(c.p); if (!o.p) return null; }
          if (c.t === 'battery') o.kind = C.BATTERIES[c.kind] ? c.kind : 'pack';
          if (c.t === 'resistor') o.r = C.RESISTORS.indexOf(+c.r) >= 0 ? +c.r : 330;
          if (c.t === 'led') o.color = C.LEDS[c.color] ? c.color : 'rojo';
          if (c.t === 'switch') o.on = !!c.on;
          if (c.t === 'spdt') o.pos = c.pos === 2 ? 2 : 1;
          if (c.t === 'input') o.v = c.v ? 1 : 0;
          if (c.t === 'input' || c.t === 'out') o.label = String(c.label || 'X').slice(0, 4).toUpperCase();
          return o;
        }).filter(Boolean);
      }
      doc = { mode: d.mode === 'logic' ? 'logic' : 'elec', elec: clean(d.elec, ELEC_TYPES), logic: clean(d.logic, LOGIC_TYPES), title: String(d.title || '').slice(0, 80) };
      sel = -1; logicSim = null; history.reset(); syncMode(); refresh();
    }
    if (window.ResizeObserver) new ResizeObserver(function () { if (Math.abs(box.clientWidth - dispW) > 2) resize(); }).observe(box);
    syncMode(); setTool('place'); refresh();
  });
})(window, document);
