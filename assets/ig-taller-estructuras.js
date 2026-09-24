/* Iris Green · El taller · Estudio de estructuras y puentes.
   Editor de barras sobre una rejilla, apoyos en el terreno y prueba de carga con el cálculo de
   ig-taller-estructuras-calc.js. Todo lo que se ve en el dibujo está también en la tabla de piezas. */
(function (window, document) {
  'use strict';
  var T = window.IGT, C = window.IGTCalc; if (!T || !C) return;
  var t = T.t, h = T.h;

  var MAT_COLORS = { palito: '#b9854a', liston: '#8d5b3a', hilo: '#44403c', madera: '#a86f37', acero: '#50637a', cable: '#2f2f33' };
  var FREE_DEFAULT = { scale: 'real', span: 16, load: 'coche', kg: 5, anchorsOnWalls: true };

  T.ready(function () {
    var app = T.mount(); if (!app || app.getAttribute('data-studio') !== 'estructuras') return;
    var CH = T.dict.challenges || [];

    /* ---------- Escena ---------- */
    function sceneFromFree(f) {
      var real = f.scale === 'real';
      var load = f.load === 'peso' || !real ? { type: 'peso', kg: +f.kg || 1, at: [0, 0] } : { type: f.load };
      return { id: 'libre', scale: real ? 'real' : 'maqueta', span: +f.span, cliffs: 'both', load: load, maxPieces: 0,
        mats: Object.keys(C.MATERIALS[real ? 'real' : 'maqueta']), maxK: 3, anchorsOnWalls: !!f.anchorsOnWalls, maxAnchors: 0 };
    }
    function sceneFromChallenge(ch) {
      var s = JSON.parse(JSON.stringify(ch.scene));
      if (ch.random) {
        var rnd = T.rng(Date.now() & 0xffffffff);
        var spans = [10, 12, 14, 16, 18, 20, 24, 28, 30, 32, 36, 40, 44, 48];
        var loads = ['grupo', 'coche', 'camion', 'tren'];
        s.span = spans[Math.floor(rnd() * spans.length)]; s.load = { type: loads[Math.floor(rnd() * loads.length)] };
        var matSets = [['madera'], ['acero', 'cable'], ['madera', 'cable'], ['madera', 'acero', 'cable']];
        s.mats = matSets[Math.floor(rnd() * matSets.length)];
        s.anchorsOnWalls = rnd() > 0.5; s.maxK = 1 + Math.floor(rnd() * 3);
      }
      s.id = ch.id; return s;
    }
    var scene = sceneFromFree(FREE_DEFAULT), freeCfg = JSON.parse(JSON.stringify(FREE_DEFAULT));
    function SC() { return C.SCALES[scene.scale]; }
    function grid() { return SC().grid; }
    function half() { return scene.span / 2; }
    function depth() { return scene.scale === 'real' ? 12 : 0.3; }
    function bounds() {
      var g = grid(), m = Math.max(4 * g, scene.span * 0.22);
      var top = scene.scale === 'real' ? Math.max(12, scene.span * 0.42) : 0.32;
      return { x0: -half() - m, x1: half() + m, y0: -depth() - 2 * g, y1: top };
    }
    function snap(v) { var g = grid(); return Math.round(v / g) * g; }
    function key(x, y) { return (Math.round(x / grid())) + ',' + (Math.round(y / grid())); }
    function r4(v) { return Math.round(v * 10000) / 10000; }
    function inTerrain(x, y) { /* estrictamente dentro del terreno */
      var e = 1e-9, hx = half();
      if (y < -depth() - e) return false;
      var left = x < -hx - e && y < -e, right = scene.cliffs !== 'left' && x > hx + e && y < -e;
      return left || right;
    }
    function onBoundary(x, y) {
      var e = 1e-9, hx = half();
      if (y > e || y < -depth() - e) return false;
      if (Math.abs(y) < e && (x <= -hx + e || (scene.cliffs !== 'left' && x >= hx - e))) return true;
      if (Math.abs(x + hx) < e) return true;
      if (scene.cliffs !== 'left' && Math.abs(x - hx) < e) return true;
      return false;
    }

    /* ---------- Estructura ---------- */
    var doc = { nodes: {}, members: [] };
    var mode = 'pieza', curMat = scene.mats[0], curK = 1;
    var result = null, casePos = 0, showDeform = true;
    function fixedAnchors() {
      var hx = half(), out = [[-hx, 0]];
      if (scene.cliffs !== 'left') out.push([hx, 0]); else out.push([-hx, -Math.min(depth(), scene.scale === 'real' ? 4 : 0.1)]);
      return out;
    }
    function resetStructure() {
      doc = { nodes: {}, members: [] };
      fixedAnchors().forEach(function (p) { var k = key(p[0], p[1]); doc.nodes[k] = { x: r4(p[0]), y: r4(p[1]), anchor: true, fixed: true }; });
      curMat = scene.mats[0]; curK = 1; result = null;
      if (typeof cursor !== 'undefined') { cursor.x = -half(); cursor.y = 0; pending = null; }
    }
    function nodeAt(x, y) { var k = key(x, y); return doc.nodes[k] ? k : null; }
    function memberBetween(a, b) { for (var i = 0; i < doc.members.length; i++) { var m = doc.members[i]; if ((m.a === a && m.b === b) || (m.a === b && m.b === a)) return i; } return -1; }
    function anchorsCount() { return Object.keys(doc.nodes).filter(function (k) { return doc.nodes[k].anchor && !doc.nodes[k].fixed; }).length; }
    function canPlace(x, y) {
      var b = bounds();
      if (x < b.x0 - 1e-9 || x > b.x1 + 1e-9 || y < b.y0 - 1e-9 || y > b.y1 + 1e-9) return t('eOutside');
      if (inTerrain(x, y)) return t('eInGround');
      return null;
    }
    function ensureNode(x, y) {
      var k = nodeAt(x, y); if (k) return k;
      var why = canPlace(x, y); if (why) { T.say(why); flash(why); return null; }
      if (onBoundary(x, y)) {
        if (!scene.anchorsOnWalls) { T.say(t('eNoAnchorHere')); flash(t('eNoAnchorHere')); return null; }
        if (scene.maxAnchors && anchorsCount() >= scene.maxAnchors) { T.say(t('eMaxAnchors', { n: scene.maxAnchors })); flash(t('eMaxAnchors', { n: scene.maxAnchors })); return null; }
        k = key(x, y); doc.nodes[k] = { x: r4(x), y: r4(y), anchor: true }; return k;
      }
      k = key(x, y); doc.nodes[k] = { x: r4(x), y: r4(y), anchor: false }; return k;
    }
    function addMember(x0, y0, x1, y1) {
      if (Math.abs(x0 - x1) < 1e-9 && Math.abs(y0 - y1) < 1e-9) return false;
      if (scene.maxPieces && doc.members.length >= scene.maxPieces) { var w = t('eMaxPieces', { n: scene.maxPieces }); T.say(w); flash(w); return false; }
      if (doc.members.length >= 240) { T.say(t('eTooMany')); return false; }
      var before = history.snapshot();
      var a = ensureNode(x0, y0); if (a === null) return false;
      var b = ensureNode(x1, y1); if (b === null) { cleanupNodes(); return false; }
      if (memberBetween(a, b) >= 0) { T.say(t('eExists')); return false; }
      var len = Math.hypot(x1 - x0, y1 - y0);
      doc.members.push({ a: a, b: b, mat: curMat, k: curK });
      history.commit(before); result = null; refresh();
      T.say(t('eAdded', { n: doc.members.length, mat: t('mat_' + curMat), len: fmtLen(len) }));
      return true;
    }
    function cleanupNodes() {
      var used = {}; doc.members.forEach(function (m) { used[m.a] = 1; used[m.b] = 1; });
      Object.keys(doc.nodes).forEach(function (k) { if (!used[k] && !doc.nodes[k].fixed && !doc.nodes[k].keep) delete doc.nodes[k]; });
    }
    function deleteMember(i) {
      var before = history.snapshot(); doc.members.splice(i, 1); cleanupNodes(); history.commit(before); result = null; refresh(); T.say(t('eDeleted'));
    }
    function deleteNode(k) {
      var n = doc.nodes[k]; if (!n) return false;
      if (n.fixed) { T.say(t('eFixedAnchor')); flash(t('eFixedAnchor')); return false; }
      var before = history.snapshot();
      doc.members = doc.members.filter(function (m) { return m.a !== k && m.b !== k; }); delete doc.nodes[k]; cleanupNodes();
      history.commit(before); result = null; refresh(); T.say(t('eNodeDeleted')); return true;
    }
    function moveNode(k, x, y) {
      var n = doc.nodes[k]; if (!n || n.anchor) { T.say(t('eAnchorNoMove')); return false; }
      var dest = nodeAt(x, y); if (dest && dest !== k) { T.say(t('eOccupied')); return false; }
      var why = canPlace(x, y); if (why || onBoundary(x, y)) { T.say(why || t('eNoAnchorHere')); return false; }
      var before = history.snapshot();
      var nk = key(x, y); delete doc.nodes[k]; doc.nodes[nk] = { x: r4(x), y: r4(y), anchor: false };
      doc.members.forEach(function (m) { if (m.a === k) m.a = nk; if (m.b === k) m.b = nk; });
      doc.members = doc.members.filter(function (m) { return m.a !== m.b; });
      history.commit(before); result = null; refresh(); T.say(t('eMoved', { x: fmtLen(x), y: fmtLen(y) })); return true;
    }
    function toggleAnchor(x, y) {
      var k = nodeAt(x, y);
      if (k && doc.nodes[k].fixed) { T.say(t('eFixedAnchor')); return; }
      if (!onBoundary(x, y)) { T.say(t('eAnchorOnlyGround')); flash(t('eAnchorOnlyGround')); return; }
      if (!scene.anchorsOnWalls) { T.say(t('eNoAnchorHere')); flash(t('eNoAnchorHere')); return; }
      var before = history.snapshot();
      if (k) { deleteNode(k); return; }
      if (scene.maxAnchors && anchorsCount() >= scene.maxAnchors) { T.say(t('eMaxAnchors', { n: scene.maxAnchors })); return; }
      k = key(x, y); doc.nodes[k] = { x: r4(x), y: r4(y), anchor: true, keep: true };
      history.commit(before); result = null; refresh(); T.say(t('eAnchorAdded'));
    }
    function paintMember(i) {
      var m = doc.members[i]; if (!m || (m.mat === curMat && (m.k || 1) === curK)) return;
      var before = history.snapshot(); m.mat = curMat; m.k = curK; history.commit(before); result = null; refresh();
      T.say(t('ePainted', { n: i + 1, mat: matLabel(curMat, curK) }));
    }

    var history = new T.History(function () { return { scene: scene, doc: doc, freeCfg: freeCfg }; },
      function (s) { scene = s.scene; doc = s.doc; freeCfg = s.freeCfg; result = null; syncScenePanel(); refresh(); },
      function () { if (bar) bar.sync(); });

    /* ---------- Unidades ---------- */
    function fmtLen(v) { return scene.scale === 'real' ? T.num(v, 1) + ' m' : T.num(v * 100, 0) + ' cm'; }
    function fmtForce(N) { return scene.scale === 'real' ? T.num(N / 1000, 1) + ' kN' : T.num(N, 1) + ' N'; }
    function fmtMass(kg) { return scene.scale === 'real' ? (kg >= 1000 ? T.num(kg / 1000, 2) + ' t' : T.num(kg, 0) + ' kg') : T.num(kg * 1000, 0) + ' g'; }
    function matLabel(mk, k) { return t('mat_' + mk) + ((k || 1) > 1 ? ' ×' + (k || 1) : ''); }
    function loadLabel(ld) { return ld.type === 'peso' ? t('loadWeight', { kg: T.num(ld.kg, 1) }) : t('veh_' + ld.type); }

    /* ---------- Interfaz ---------- */
    var retos = T.challenges({ items: CH, onPick: onPickChallenge });
    var testBtn = T.btn(t('eTest'), { icon: 'play', cls: 'primary', onClick: runTest });
    var bar = T.projectBar({ studio: 'estructuras', history: history, extra: [testBtn],
      getData: function () { return { scene: scene, doc: doc, freeCfg: freeCfg }; },
      onNew: function () { resetStructure(); history.reset(); T.markClean(); refresh(); T.say(t('eNewDone')); },
      onOpen: loadData });

    var canvas = h('canvas', { class: 'igt-struct', tabindex: '0', role: 'application', 'aria-roledescription': t('eCanvasRole'), 'aria-describedby': 'igt-e-hint igt-e-summary' });
    var box = h('div', { class: 'igt-canvas-box' }, canvas);
    var modeBar = h('div', { class: 'igt-bar', role: 'group', 'aria-label': t('eTools') });
    var cursorOut = h('p', { class: 'igt-visible-status' });
    var hint = h('p', { class: 'igt-caption', id: 'igt-e-hint', text: t('eKeyHint') });
    var flashNode = h('p', { class: 'igt-err', hidden: true, role: 'alert' });
    var legend = h('p', { class: 'igt-caption' });
    var stage = h('div', { class: 'igt-stage glass' }, modeBar, box, flashNode, cursorOut, legend, hint);
    var side = h('div', { class: 'igt-side glass' });
    var summary = h('div', { class: 'igt-alt', id: 'igt-e-summary' });
    var tableWrap = h('div', { class: 'igt-table-wrap', role: 'region', tabindex: '0', 'aria-labelledby': 'igt-e-tcap' });
    app.appendChild(retos);
    app.appendChild(h('div', { class: 'igt-topbar glass' }, bar));
    app.appendChild(h('div', { class: 'igt-work igt-print-keep' }, stage, side));
    summary.classList.add('igt-print-keep'); tableWrap.classList.add('igt-print-keep');
    app.appendChild(summary);
    app.appendChild(tableWrap);
    app.appendChild(T.keyHelp([
      [t('kArrows'), t('eKArrows')], [t('kSpace'), t('eKEnter')], ['Supr / ⌫', t('eKDelete')], [t('kEsc'), t('kEscCancel')],
      ['P M B A C', t('eKModes')], ['T', t('eKTest')], ['Ctrl+Z / Ctrl+Y', t('kUndoRedo')]
    ]));

    var flashTimer = 0;
    function flash(msg) { flashNode.textContent = msg; flashNode.hidden = false; clearTimeout(flashTimer); flashTimer = setTimeout(function () { flashNode.hidden = true; }, 5000); }

    /* Modos */
    var MODES = ['pieza', 'pintar', 'mover', 'borrar', 'apoyo'];
    var modeBtns = {};
    MODES.forEach(function (k) {
      var b = T.btn(t('mode_' + k), { cls: 'igt-chip', pressed: k === mode, onClick: function () { setMode(k); } });
      modeBtns[k] = b; modeBar.appendChild(b);
    });
    function setMode(k) {
      mode = k; pending = null; Object.keys(modeBtns).forEach(function (x) { T.press(modeBtns[x], x === k); });
      modeBtns.apoyo.hidden = !scene.anchorsOnWalls; draw(); T.say(t('mode_' + k) + '. ' + t('modeHelp_' + k));
      cursorOut.textContent = t('modeHelp_' + k);
    }

    /* Materiales */
    var matPanel = T.panel(t('eMaterial'), true);
    var matChips = h('div', { class: 'igt-chips', role: 'group', 'aria-label': t('eMaterial') });
    var kSel = h('select', { id: 'igt-e-k' }, [1, 2, 3].map(function (k) { return h('option', { value: k, text: t('section_' + k) }); }));
    var matInfo = h('p', { class: 'igt-note' });
    matPanel.appendChild(matChips);
    matPanel.appendChild(h('label', { class: 'igt-field', for: 'igt-e-k' }, t('eSection'), kSel));
    matPanel.appendChild(matInfo);
    kSel.addEventListener('change', function () { curK = +kSel.value; syncMat(); });
    function syncMat() {
      T.clear(matChips);
      scene.mats.forEach(function (mk) {
        matChips.appendChild(T.btn(t('mat_' + mk), { cls: 'igt-chip', pressed: mk === curMat, onClick: function () { curMat = mk; syncMat(); T.say(t('eMatPicked', { m: t('mat_' + mk) })); } }));
      });
      var maxK = scene.maxK || 1; if (curK > maxK) curK = maxK;
      Array.prototype.forEach.call(kSel.options, function (o) { o.disabled = +o.value > maxK; });
      kSel.value = curK; kSel.parentNode.hidden = maxK < 2;
      var M = C.MATERIALS[scene.scale][curMat], L = scene.scale === 'real' ? 3 : 0.1, M2 = { A: M.A * curK, I: M.I * curK, E: M.E, f: M.f, tensionOnly: M.tensionOnly, cap: M.cap === undefined ? undefined : M.cap * curK };
      var cap = C.capacities(M2, L);
      matInfo.textContent = t('matInfo_' + curMat) + ' ' + t('eCapInfo', { len: fmtLen(L), t: fmtForce(cap.t), c: cap.c > 0 ? fmtForce(cap.c) : t('eNoCompression'), w: fmtMass(M.rho * M.A * curK * (scene.scale === 'real' ? 1 : 1)) + (scene.scale === 'real' ? '/m' : '/m') });
    }

    /* Escena libre */
    var scenePanel = T.panel(t('eScene'), true);
    var sceneInfo = h('p', { class: 'igt-note' });
    var fScale = h('select', { id: 'igt-e-scale' }, ['real', 'maqueta'].map(function (k) { return h('option', { value: k, text: t('scale_' + k) }); }));
    var fSpan = h('input', { type: 'number', id: 'igt-e-span', min: 2, max: 60, step: 1 });
    var fLoad = h('select', { id: 'igt-e-load' });
    var fKg = h('input', { type: 'number', id: 'igt-e-kg', min: 0.1, max: 50, step: 0.5 });
    var fWalls = h('input', { type: 'checkbox', id: 'igt-e-walls' });
    var freeBox = h('div', { class: 'igt-panel' },
      h('label', { class: 'igt-field', for: 'igt-e-scale' }, t('eScale'), fScale),
      h('label', { class: 'igt-field', for: 'igt-e-span' }, h('span', { id: 'igt-e-span-l' }), fSpan),
      h('label', { class: 'igt-field', for: 'igt-e-load' }, t('eLoad'), fLoad),
      h('label', { class: 'igt-field', for: 'igt-e-kg' }, t('eKg'), fKg),
      h('label', { class: 'igt-check', for: 'igt-e-walls' }, fWalls, t('eWalls')),
      T.btn(t('eApplyScene'), { onClick: applyFree }));
    scenePanel.appendChild(sceneInfo); scenePanel.appendChild(freeBox);
    side.appendChild(matPanel); side.appendChild(scenePanel);

    /* Resultado */
    var resPanel = T.panel(t('eResult'), true);
    var resBox = h('div', { 'aria-live': 'polite' });
    var posIn = h('input', { type: 'range', id: 'igt-e-pos', min: 0, max: 0, value: 0 });
    var posLabel = h('label', { class: 'igt-field', for: 'igt-e-pos' }, h('span', { id: 'igt-e-pos-l' }), posIn);
    var deformChk = h('input', { type: 'checkbox', id: 'igt-e-def', checked: true });
    resPanel.appendChild(resBox); resPanel.appendChild(posLabel);
    resPanel.appendChild(h('label', { class: 'igt-check', for: 'igt-e-def' }, deformChk, t('eDeform')));
    side.insertBefore(resPanel, side.firstChild);
    posIn.addEventListener('input', function () { casePos = +posIn.value; syncPos(); draw(); });
    deformChk.addEventListener('change', function () { showDeform = deformChk.checked; draw(); });

    function syncScenePanel() {
      var isFree = scene.id === 'libre';
      freeBox.hidden = !isFree;
      sceneInfo.textContent = t('eSceneInfo', { scale: t('scale_' + scene.scale), span: fmtLen(scene.span), load: loadLabel(scene.load),
        pieces: scene.maxPieces ? T.num(scene.maxPieces, 0) : t('eNoLimit'), mats: scene.mats.map(function (m) { return t('mat_' + m); }).join(', '),
        walls: scene.anchorsOnWalls ? t('yes') : t('no') }) + (scene.maxMass ? ' ' + t('eMaxMassInfo', { m: fmtMass(scene.maxMass) }) : '');
      fScale.value = freeCfg.scale; fSpan.value = freeCfg.span; fKg.value = freeCfg.kg; fWalls.checked = !!freeCfg.anchorsOnWalls;
      syncFreeFields();
      if (scene.mats.indexOf(curMat) < 0) curMat = scene.mats[0];
      syncMat(); if (modeBtns.apoyo) { modeBtns.apoyo.hidden = !scene.anchorsOnWalls; if (!scene.anchorsOnWalls && mode === 'apoyo') setMode('pieza'); }
    }
    function syncFreeFields() {
      var real = fScale.value === 'real';
      document.getElementById('igt-e-span-l').textContent = real ? t('eSpanM') : t('eSpanCm');
      fSpan.min = real ? 4 : 10; fSpan.max = real ? 60 : 100; fSpan.step = real ? 2 : 10;
      T.clear(fLoad);
      (real ? ['grupo', 'coche', 'camion', 'tren'] : ['peso']).forEach(function (k) { fLoad.appendChild(h('option', { value: k, text: k === 'peso' ? t('loadWeightShort') : t('veh_' + k) })); });
      fLoad.value = real ? (freeCfg.load === 'peso' ? 'coche' : freeCfg.load) : 'peso';
      fKg.parentNode.hidden = real;
    }
    fScale.addEventListener('change', function () {
      var real = fScale.value === 'real'; fSpan.value = real ? 16 : 50; syncFreeFields();
    });
    function applyFree() {
      var real = fScale.value === 'real';
      var span = +fSpan.value; if (!isFinite(span)) span = real ? 16 : 50;
      span = real ? Math.max(4, Math.min(60, Math.round(span / 2) * 2)) : Math.max(10, Math.min(100, Math.round(span / 10) * 10)) / 100;
      if (doc.members.length && !window.confirm(t('eSceneConfirm'))) return;
      var before = history.snapshot();
      freeCfg = { scale: fScale.value, span: span, load: real ? fLoad.value : 'peso', kg: Math.max(0.1, Math.min(50, +fKg.value || 1)), anchorsOnWalls: fWalls.checked };
      scene = sceneFromFree(freeCfg); resetStructure(); history.commit(before); syncScenePanel(); refresh(); T.say(t('eSceneApplied'));
    }

    var picking = false, lastPicked = null;
    function onPickChallenge(ch) {
      if (picking) return null;
      var next = ch ? sceneFromChallenge(ch) : sceneFromFree(freeCfg);
      if (doc.members.length && !window.confirm(t('eSceneConfirm'))) {
        picking = true; retos.pick(lastPicked, true); picking = false; return null;
      }
      lastPicked = ch;
      var before = history.snapshot();
      scene = next; resetStructure(); history.commit(before); syncScenePanel(); refresh();
      var box2 = h('div', { class: 'igt-bar igt-noprint' });
      if (ch && ch.random) box2.appendChild(T.btn(t('eAnother'), { icon: 'reiniciar', onClick: function () { onPickChallenge(ch); retos.pick(ch, true); } }));
      return box2.childNodes.length ? box2 : null;
    }

    /* ---------- Vista ---------- */
    var ctx, dispW = 800, dispH = 450, view = { s: 1, ox: 0, oy: 0 };
    var cursor = { x: 0, y: 0 }, pending = null, dragNode = null, hoverPt = null;
    function resize() {
      var b = bounds(), w = Math.max(260, box.clientWidth || 800);
      var aspect = (b.y1 - b.y0) / (b.x1 - b.x0);
      dispW = w; dispH = Math.round(Math.min(Math.max(w * aspect, 240), w * 0.9));
      ctx = T.fitCanvas(canvas, dispW, dispH);
      canvas.style.height = dispH + 'px';
      var s = Math.min(dispW / (b.x1 - b.x0), dispH / (b.y1 - b.y0));
      view = { s: s, ox: (dispW - s * (b.x1 - b.x0)) / 2 - s * b.x0, oy: (dispH - s * (b.y1 - b.y0)) / 2 + s * b.y1 };
      draw();
    }
    function sx(x) { return view.ox + x * view.s; }
    function sy(y) { return view.oy - y * view.s; }
    function toWorld(e) { var r = canvas.getBoundingClientRect(); var px = (e.clientX - r.left) * dispW / r.width, py = (e.clientY - r.top) * dispH / r.height; return [(px - view.ox) / view.s, (view.oy - py) / view.s]; }

    function currentCase() { return result && result.cases && result.cases[Math.min(casePos, result.cases.length - 1)]; }
    function draw() {
      if (!ctx) return;
      var b = bounds(), c = ctx, hx = half(), d = depth(), hc = T.highContrast();
      c.clearRect(0, 0, dispW, dispH);
      var sky = c.createLinearGradient(0, 0, 0, dispH); sky.addColorStop(0, '#eaf2f8'); sky.addColorStop(1, '#f7f9fb');
      c.fillStyle = sky; c.fillRect(0, 0, dispW, dispH);
      /* agua */
      var wx1 = scene.cliffs === 'left' ? b.x1 : hx;
      c.fillStyle = '#cfe3ee'; c.fillRect(sx(-hx), sy(-d * 0.72), sx(wx1) - sx(-hx), sy(b.y0) - sy(-d * 0.72));
      c.strokeStyle = 'rgba(31,95,139,.35)'; c.lineWidth = 1; c.beginPath();
      for (var wx = -hx; wx < wx1; wx += grid() * 2) { c.moveTo(sx(wx), sy(-d * 0.72) + 4); c.lineTo(sx(wx + grid()), sy(-d * 0.72) + 4); } c.stroke();
      /* terreno */
      c.fillStyle = '#d9cbb4'; c.strokeStyle = '#8a7556'; c.lineWidth = 2;
      c.beginPath(); c.moveTo(sx(b.x0), sy(0)); c.lineTo(sx(-hx), sy(0)); c.lineTo(sx(-hx), sy(-d)); c.lineTo(sx(-hx), sy(b.y0)); c.lineTo(sx(b.x0), sy(b.y0)); c.closePath(); c.fill(); c.stroke();
      if (scene.cliffs !== 'left') { c.beginPath(); c.moveTo(sx(b.x1), sy(0)); c.lineTo(sx(hx), sy(0)); c.lineTo(sx(hx), sy(b.y0)); c.lineTo(sx(b.x1), sy(b.y0)); c.closePath(); c.fill(); c.stroke(); }
      c.fillStyle = '#c3b193'; c.fillRect(sx(-hx), sy(-d), sx(wx1) - sx(-hx), sy(b.y0) - sy(-d));
      /* rejilla */
      var g = grid(), step = view.s * g < 7 ? 2 : 1;
      c.fillStyle = 'rgba(23,57,92,.28)';
      for (var gx = Math.ceil(b.x0 / g) * g; gx <= b.x1 + 1e-9; gx += g * step) for (var gy = Math.ceil(b.y0 / g) * g; gy <= b.y1 + 1e-9; gy += g * step) {
        if (!inTerrain(gx, gy)) c.fillRect(sx(gx) - 1, sy(gy) - 1, 2, 2);
      }
      /* línea de la calzada */
      if (SC().road || scene.load.type === 'peso') {
        c.save(); c.setLineDash([6, 5]); c.strokeStyle = 'rgba(168,51,111,.6)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(sx(-hx), sy(0)); c.lineTo(sx(scene.cliffs === 'left' ? b.x1 : hx), sy(0)); c.stroke(); c.restore();
      }
      if (scene.load.type === 'peso') { var lp = scene.load.at; drawArrow(c, sx(lp[0]), sy(lp[1]) - 34, sx(lp[0]), sy(lp[1]) - 8, '#a8336f'); }
      /* piezas */
      var cs = currentCase(), deform = cs && cs.u && showDeform ? deformFactor() : 0;
      function np(k) {
        var n = doc.nodes[k]; if (!n) return [0, 0];
        var x = n.x, y = n.y;
        if (deform && result && !n.anchor) { var P = result.prep, dd = P.dof[k]; if (dd !== undefined && cs.u) { x += cs.u[dd] * deform; y += cs.u[dd + 1] * deform; } }
        return [sx(x), sy(y)];
      }
      /* la carga va detrás de la estructura para no taparla */
      if (cs) drawVehicle(c, cs);
      doc.members.forEach(function (m, i) {
        var p = np(m.a), q = np(m.b), col = MAT_COLORS[m.mat] || '#555', wdt = (scene.scale === 'real' ? 3 : 3) + ((m.k || 1) - 1) * 2;
        var isCable = C.MATERIALS[scene.scale][m.mat] && C.MATERIALS[scene.scale][m.mat].tensionOnly;
        var state = null;
        if (cs && result.map) {
          var j = result.map[i];
          if (j !== undefined) {
            var brokenNow = cs.alive && !cs.alive[j];
            if (brokenNow) state = 'broken';
            else if (cs.slack && cs.slack[j]) state = 'slack';
            else if (cs.f) { var f = cs.f[j], u = cs.util ? cs.util[j] : 0; state = f >= 0 ? 'T' : 'C'; col = f >= 0 ? mix('#9cc0da', '#0b4f86', Math.min(1, u)) : mix('#f3c3a0', '#b3380a', Math.min(1, u)); wdt += Math.min(1.2, u) * 4; }
          }
        }
        c.save(); c.lineCap = 'round';
        if (state === 'broken') { c.setLineDash([5, 6]); c.strokeStyle = '#b3261e'; c.lineWidth = 2.5; }
        else if (state === 'slack') { c.setLineDash([2, 5]); c.strokeStyle = '#6b7280'; c.lineWidth = 2; }
        else { c.strokeStyle = hc ? '#000' : col; c.lineWidth = isCable ? Math.max(1.5, wdt - 1.5) : wdt; }
        c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); c.stroke();
        if (state === 'C') { c.setLineDash([]); c.strokeStyle = '#ffffff'; c.lineWidth = Math.max(1, wdt * 0.28); c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); c.stroke(); }
        c.restore();
        if (state === 'broken') { var mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2; c.strokeStyle = '#b3261e'; c.lineWidth = 3; c.beginPath(); c.moveTo(mx - 7, my - 7); c.lineTo(mx + 7, my + 7); c.moveTo(mx + 7, my - 7); c.lineTo(mx - 7, my + 7); c.stroke(); }
        if (showNumbers) { var mx2 = (p[0] + q[0]) / 2, my2 = (p[1] + q[1]) / 2; c.font = '11px Atkinson Hyperlegible, Arial'; c.fillStyle = '#ffffff'; c.fillRect(mx2 - 9, my2 - 8, 18, 15); c.fillStyle = '#17395c'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(i + 1), mx2, my2); }
      });
      /* nudos y apoyos */
      Object.keys(doc.nodes).forEach(function (k) {
        var n = doc.nodes[k], p = np(k);
        if (n.anchor) {
          c.fillStyle = n.fixed ? '#17395c' : '#5a49a8';
          c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(p[0] - 9, p[1] + 13); c.lineTo(p[0] + 9, p[1] + 13); c.closePath(); c.fill();
        }
        c.fillStyle = '#ffffff'; c.strokeStyle = '#17395c'; c.lineWidth = 2; c.beginPath(); c.arc(p[0], p[1], n.anchor ? 5 : 4.5, 0, Math.PI * 2); c.fill(); c.stroke();
        if (cs && cs.mechanismNode === k) { c.strokeStyle = '#b3261e'; c.lineWidth = 3; c.beginPath(); c.arc(p[0], p[1], 12, 0, Math.PI * 2); c.stroke(); }
      });
      /* pieza en curso y cursor */
      if (pending) {
        var tgt = hoverPt || [cursor.x, cursor.y];
        c.save(); c.setLineDash([6, 4]); c.strokeStyle = '#5a49a8'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(sx(pending[0]), sy(pending[1])); c.lineTo(sx(tgt[0]), sy(tgt[1])); c.stroke(); c.restore();
      }
      if (document.activeElement === canvas || hoverPt) {
        var cp = document.activeElement === canvas ? [cursor.x, cursor.y] : hoverPt;
        c.strokeStyle = '#a8336f'; c.lineWidth = 2; c.beginPath(); c.arc(sx(cp[0]), sy(cp[1]), 9, 0, Math.PI * 2); c.stroke();
        c.beginPath(); c.moveTo(sx(cp[0]) - 14, sy(cp[1])); c.lineTo(sx(cp[0]) - 10, sy(cp[1])); c.moveTo(sx(cp[0]) + 10, sy(cp[1])); c.lineTo(sx(cp[0]) + 14, sy(cp[1])); c.stroke();
      }
      /* escala */
      var ref = scene.scale === 'real' ? (scene.span > 30 ? 10 : 5) : 0.1;
      c.fillStyle = '#17395c'; c.fillRect(12, dispH - 18, ref * view.s, 3); c.font = '12px Atkinson Hyperlegible, Arial'; c.textAlign = 'left'; c.textBaseline = 'bottom'; c.fillText(fmtLen(ref), 12, dispH - 22);
      if (deform) { c.textAlign = 'right'; c.fillText(t('eDeformX', { n: T.num(deform, 0) }), dispW - 12, dispH - 10); }
    }
    var showNumbers = false;
    function mix(a, b, r) {
      var pa = [1, 3, 5].map(function (i) { return parseInt(a.slice(i, i + 2), 16); }), pb = [1, 3, 5].map(function (i) { return parseInt(b.slice(i, i + 2), 16); });
      return 'rgb(' + pa.map(function (v, i) { return Math.round(v + (pb[i] - v) * r); }).join(',') + ')';
    }
    function drawArrow(c, x0, y0, x1, y1, col) { c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); c.beginPath(); c.moveTo(x1, y1); c.lineTo(x1 - 6, y1 - 9); c.lineTo(x1 + 6, y1 - 9); c.closePath(); c.fill(); }
    function deformFactor() {
      var cs = currentCase(); if (!cs || !cs.u || !cs.u.length) return 0;
      var mx = 0; for (var i = 0; i < cs.u.length; i++) mx = Math.max(mx, Math.abs(cs.u[i]));
      if (mx < 1e-12) return 0;
      var target = scene.span * 0.04; return Math.max(1, Math.min(5000, target / mx));
    }
    function drawVehicle(c, cs) {
      if (scene.load.type === 'peso') {
        var lp = scene.load.at, x = sx(lp[0]), y = sy(lp[1]);
        c.strokeStyle = '#44403c'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 22); c.stroke();
        c.fillStyle = '#3f3f46'; c.beginPath(); c.roundRect ? c.roundRect(x - 16, y + 22, 32, 24, 5) : c.rect(x - 16, y + 22, 32, 24); c.fill();
        c.fillStyle = '#fff'; c.font = '700 11px Atkinson Hyperlegible, Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(T.num(scene.load.kg, 1) + ' kg', x, y + 34);
        return;
      }
      if (cs.pos === null || cs.pos === undefined) return;
      var ax = C.VEHICLES[scene.load.type]; var front = cs.pos, minD = Math.min.apply(null, ax.map(function (a) { return a.d; }));
      var yb = sy(0) - 4, H = view.s * (scene.load.type === 'tren' ? 3.8 : scene.load.type === 'camion' ? 3.4 : scene.load.type === 'coche' ? 1.5 : 1.8);
      c.save(); c.globalAlpha = 0.42;
      if (scene.load.type === 'grupo') {
        ax.forEach(function (a) { var px = sx(front + a.d); c.fillStyle = '#5a49a8'; c.beginPath(); c.arc(px, yb - H + 5, 5, 0, Math.PI * 2); c.fill(); c.fillRect(px - 4, yb - H + 10, 8, H - 10); });
      } else {
        c.fillStyle = scene.load.type === 'tren' ? '#1f5f8b' : scene.load.type === 'camion' ? '#8a4b00' : '#a8336f';
        /* una caja por grupo de ejes: locomotora y vagón, cabina y remolque */
        var units = {}; ax.forEach(function (a) { var u = a.u || 0; units[u] = units[u] ? [Math.max(units[u][0], a.d), Math.min(units[u][1], a.d)] : [a.d, a.d]; });
        var groups = Object.keys(units).map(function (k) { return units[k]; });
        groups.forEach(function (gr) { var gx0 = sx(front + gr[1] - 1.3), gx1 = sx(front + gr[0] + 1.3); c.fillRect(gx0, yb - H, gx1 - gx0, H * 0.78); });
        c.fillStyle = '#17202a'; ax.forEach(function (a) { var px = sx(front + a.d); c.beginPath(); c.arc(px, yb - 4, Math.max(3, view.s * 0.45), 0, Math.PI * 2); c.fill(); });
      }
      c.restore();
    }

    /* ---------- Puntero ---------- */
    var downPt = null, downNode = null;
    function snapPt(w) { return [snap(w[0]), snap(w[1])]; }
    canvas.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      e.preventDefault(); canvas.focus({ preventScroll: true });
      var w = toWorld(e), p = snapPt(w); cursor.x = p[0]; cursor.y = p[1];
      downPt = p; downNode = nodeAt(p[0], p[1]);
      if (mode === 'mover' && downNode) { dragNode = downNode; canvas.setPointerCapture(e.pointerId); }
      else if (mode === 'pieza') { canvas.setPointerCapture(e.pointerId); if (!pending) pending = p.slice(); }
      draw();
    });
    canvas.addEventListener('pointermove', function (e) {
      var w = toWorld(e), p = snapPt(w); hoverPt = p;
      if (pending || dragNode) { cursor.x = p[0]; cursor.y = p[1]; }
      draw();
    });
    canvas.addEventListener('pointerleave', function () { hoverPt = null; draw(); });
    canvas.addEventListener('pointerup', function (e) {
      var w = toWorld(e), p = snapPt(w); hoverPt = e.pointerType === 'mouse' ? p : null;
      if (mode === 'pieza' && pending) {
        if (p[0] !== pending[0] || p[1] !== pending[1]) { addMember(pending[0], pending[1], p[0], p[1]); pending = null; }
        /* si se soltó en el mismo punto, queda marcado el inicio: el siguiente toque cierra la pieza */
        else if (downPt && (downPt[0] !== p[0] || downPt[1] !== p[1])) pending = null;
      } else if (mode === 'mover' && dragNode) { if (key(p[0], p[1]) !== dragNode) moveNode(dragNode, p[0], p[1]); dragNode = null; }
      else if (mode === 'borrar') eraseAt(w, p);
      else if (mode === 'pintar') { var mi = nearestMember(w); if (mi >= 0) paintMember(mi); }
      else if (mode === 'apoyo') toggleAnchor(p[0], p[1]);
      downPt = null; draw();
    });
    function nearestMember(w) {
      var best = -1, bd = Infinity, tol = 14 / view.s;
      doc.members.forEach(function (m, i) {
        var a = doc.nodes[m.a], b = doc.nodes[m.b]; if (!a || !b) return;
        var dx = b.x - a.x, dy = b.y - a.y, L2 = dx * dx + dy * dy, r = L2 ? Math.max(0, Math.min(1, ((w[0] - a.x) * dx + (w[1] - a.y) * dy) / L2)) : 0;
        var d = Math.hypot(a.x + r * dx - w[0], a.y + r * dy - w[1]); if (d < bd) { bd = d; best = i; }
      });
      return bd <= tol ? best : -1;
    }
    function eraseAt(w, p) {
      var k = nodeAt(p[0], p[1]);
      if (k && Math.hypot(doc.nodes[k].x - w[0], doc.nodes[k].y - w[1]) < 10 / view.s) { deleteNode(k); return; }
      var mi = nearestMember(w); if (mi >= 0) deleteMember(mi);
    }

    /* ---------- Teclado ---------- */
    function announceCursor() {
      var k = nodeAt(cursor.x, cursor.y), n = k ? doc.nodes[k] : null;
      var what = n ? (n.anchor ? t('eAtAnchor') : t('eAtNode', { n: doc.members.filter(function (m) { return m.a === k || m.b === k; }).length })) : (inTerrain(cursor.x, cursor.y) ? t('eAtGround') : onBoundary(cursor.x, cursor.y) ? t('eAtEdge') : t('eAtEmpty'));
      cursorOut.textContent = t('eCursor', { x: fmtLen(cursor.x), y: fmtLen(cursor.y), what: what }) + (pending ? ' · ' + t('eFrom', { x: fmtLen(pending[0]), y: fmtLen(pending[1]) }) : '');
    }
    canvas.addEventListener('keydown', function (e) {
      var g = grid(), b = bounds(), moved = true;
      if (e.key === 'ArrowLeft') cursor.x -= g; else if (e.key === 'ArrowRight') cursor.x += g;
      else if (e.key === 'ArrowUp') cursor.y += g; else if (e.key === 'ArrowDown') cursor.y -= g; else moved = false;
      if (moved) { e.preventDefault(); cursor.x = Math.max(b.x0, Math.min(b.x1, snap(cursor.x))); cursor.y = Math.max(b.y0, Math.min(b.y1, snap(cursor.y))); announceCursor(); draw(); return; }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (mode === 'pieza') {
          if (!pending) { pending = [cursor.x, cursor.y]; T.say(t('eStartMarked')); }
          else { addMember(pending[0], pending[1], cursor.x, cursor.y); pending = null; }
        } else if (mode === 'mover') {
          if (!pending) { var k = nodeAt(cursor.x, cursor.y); if (k && !doc.nodes[k].anchor) { pending = [cursor.x, cursor.y]; T.say(t('eNodePicked')); } else T.say(t('eNoNodeHere')); }
          else { var k2 = nodeAt(pending[0], pending[1]); pending = null; if (k2) moveNode(k2, cursor.x, cursor.y); }
        } else if (mode === 'borrar') eraseAt([cursor.x, cursor.y], [cursor.x, cursor.y]);
        else if (mode === 'pintar') { var mi = nearestMember([cursor.x, cursor.y]); if (mi >= 0) paintMember(mi); else T.say(t('eNoMemberHere')); }
        else if (mode === 'apoyo') toggleAnchor(cursor.x, cursor.y);
        announceCursor(); draw(); return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); var kk = nodeAt(cursor.x, cursor.y); if (kk) deleteNode(kk); else T.say(t('eNoNodeHere')); return; }
      if (e.key === 'Escape') { if (pending) { e.preventDefault(); pending = null; T.say(t('eCancelled')); draw(); } return; }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var map = { p: 'pieza', m: 'mover', b: 'borrar', a: 'apoyo', c: 'pintar' };
      var lk = e.key.toLowerCase();
      if (map[lk] && (lk !== 'a' || scene.anchorsOnWalls)) { e.preventDefault(); setMode(map[lk]); return; }
      if (lk === 't') { e.preventDefault(); runTest(); }
    });
    canvas.addEventListener('focus', function () { announceCursor(); draw(); });
    canvas.addEventListener('blur', function () { draw(); });
    history.bindKeys(document);

    /* ---------- Prueba de carga ---------- */
    var anim = 0;
    function runTest() {
      cancelAnimationFrame(anim);
      var model = { scale: scene.scale, span: scene.span, load: scene.load, nodes: doc.nodes, members: doc.members };
      var r = C.test(model);
      r.prep = C.prepare(model);
      r.map = {}; r.prep.members.forEach(function (pm, j) { r.map[pm.idx] = j; });
      result = r; casePos = 0;
      if (!r.cases.length) { renderResult(); draw(); return; }
      posIn.max = r.cases.length - 1; posIn.value = 0;
      var last = r.cases.length - 1;
      if (T.reducedMotion() || r.cases.length === 1) { casePos = last; finish(); return; }
      var t0 = performance.now(), dur = Math.min(6000, 900 + r.cases.length * 40);
      T.say(t('eTesting'));
      (function frame(now) {
        casePos = Math.min(last, Math.floor((now - t0) / dur * (last + 1)));
        posIn.value = casePos; syncPos(); draw();
        if (casePos < last) anim = requestAnimationFrame(frame); else finish();
      })(t0);
    }
    function finish() {
      /* al terminar se muestra el momento más exigente, o el de la rotura */
      if (result && result.cases && result.cases.length > 1) {
        if (result.failAt !== undefined) casePos = result.failAt;
        else { var best = 0, bu = -1; result.cases.forEach(function (cs, i) { var u = cs.util ? Math.max.apply(null, cs.util.concat([0])) : 0; if (u > bu) { bu = u; best = i; } }); casePos = best; }
      }
      posIn.value = casePos; syncPos(); renderResult(); draw();
    }
    function syncPos() {
      var cs = currentCase(), l = document.getElementById('igt-e-pos-l');
      var many = result && result.cases && result.cases.length > 1;
      posLabel.hidden = !many;
      if (cs && cs.pos !== null && cs.pos !== undefined) l.textContent = t('ePos', { x: fmtLen(cs.pos + half()), n: casePos + 1, m: result.cases.length });
      renderTable();
    }
    function member(i) { return doc.members[i]; }
    function renderResult() {
      T.clear(resBox);
      var r = result; if (!r) { resBox.appendChild(h('p', { class: 'igt-note', text: t('eNoTestYet') })); renderSummary(); return; }
      var ch = retos.current(), msg, ok = r.ok;
      if (r.reason === 'empty') msg = t('eEmpty');
      else if (r.reason === 'road') msg = t('eRoadGap', { gaps: r.gaps.map(function (g) { return fmtLen(g[0] + half()) + '–' + fmtLen(g[1] + half()); }).join(', ') });
      else if (r.reason === 'loadPoint') msg = t('eLoadPoint', { x: fmtLen(scene.load.at[0] + half()) });
      else if (r.ok) msg = t('eHolds', { peak: T.num(r.peak * 100, 0) });
      else {
        var cs = r.cases[r.failAt], first = cs.broken && cs.broken[0];
        if (first) {
          var pm = r.prep.members[first.i], why = first.force >= 0 ? t('eWhyTension') : (pm.cap.buckles ? t('eWhyBuckle') : t('eWhyCrush'));
          msg = t('eBreaks', { n: pm.idx + 1, why: why, pos: cs.pos === null || cs.pos === undefined ? '' : t('eWhen', { x: fmtLen(cs.pos + half()) }) });
          if (cs.collapse) msg += ' ' + t('eThenFalls');
          else msg += ' ' + t('eStandsDamaged', { n: cs.broken.length });
        } else msg = t('eMechanism');
      }
      resBox.appendChild(T.result(ok, msg));
      var stats = h('ul', { class: 'igt-limits' },
        h('li', { text: t('eMass', { m: fmtMass(r.mass) }) }), h('li', { text: t('ePieces', { n: r.pieces }) }));
      resBox.appendChild(stats);
      if (ch && ok) {
        var goals = [];
        if (scene.maxPieces) goals.push([r.pieces <= scene.maxPieces, t('eGoalPieces', { n: r.pieces, m: scene.maxPieces })]);
        if (scene.maxMass) goals.push([r.mass <= scene.maxMass, t('eGoalMass', { m: fmtMass(r.mass), max: fmtMass(scene.maxMass) })]);
        var allOk = goals.every(function (g) { return g[0]; });
        resBox.appendChild(T.result(allOk, allOk ? t('eChallengeDone') : t('eChallengeAlmost')));
        if (goals.length) resBox.appendChild(h('ul', { class: 'igt-limits' }, goals.map(function (g) { return h('li', { text: (g[0] ? '✓ ' : '· ') + g[1] }); })));
      }
      if (ok) {
        var bestKey = scene.id + ':' + scene.span + ':' + scene.load.type;
        var prev = bests[bestKey];
        if (prev === undefined || r.mass < prev - 1e-9) { if (prev !== undefined) resBox.appendChild(h('p', { class: 'igt-tip', text: t('eBetter', { m: fmtMass(prev) }) })); bests[bestKey] = r.mass; }
        else resBox.appendChild(h('p', { class: 'igt-note', text: t('eBestSoFar', { m: fmtMass(prev) }) }));
      }
      T.say(msg); renderSummary();
    }
    var bests = {};

    /* ---------- Texto equivalente y tabla ---------- */
    function renderSummary() {
      T.clear(summary);
      summary.appendChild(h('h3', { text: t('eAltTitle') }));
      var nodes = Object.keys(doc.nodes).length, anchors = Object.keys(doc.nodes).filter(function (k) { return doc.nodes[k].anchor; }).length;
      summary.appendChild(h('p', { text: t('eAltText', { scale: t('scale_' + scene.scale), span: fmtLen(scene.span), load: loadLabel(scene.load), pieces: doc.members.length, nodes: nodes, anchors: anchors }) }));
      var counts = {}; doc.members.forEach(function (m) { var k = matLabel(m.mat, m.k); counts[k] = (counts[k] || 0) + 1; });
      var parts = Object.keys(counts).map(function (k) { return k + ': ' + counts[k]; });
      if (parts.length) summary.appendChild(h('p', { class: 'igt-note', text: t('eByMaterial') + ' ' + parts.join(' · ') }));
      summary.appendChild(h('p', { class: 'igt-note', text: t('eLegend') }));
      canvas.setAttribute('aria-label', t('eCanvasLabel', { n: doc.members.length, span: fmtLen(scene.span) }));
    }
    function renderTable() {
      T.clear(tableWrap);
      if (!doc.members.length) { tableWrap.appendChild(h('p', { class: 'igt-note', id: 'igt-e-tcap', style: 'padding:10px 12px', text: t('eTableCap', { n: 0 }) + '. ' + t('eTableEmpty') })); return; }
      var cs = currentCase();
      var tb = h('tbody');
      doc.members.forEach(function (m, i) {
        var a = doc.nodes[m.a], b = doc.nodes[m.b]; if (!a || !b) return;
        var len = Math.hypot(b.x - a.x, b.y - a.y), force = '—', kind = '—', use = '—', state = t('stNotTested');
        if (cs && result.map && result.map[i] !== undefined) {
          var j = result.map[i], pm = result.prep.members[j];
          if (cs.alive && !cs.alive[j]) { state = t('stBroken'); var br = cs.broken.filter(function (x) { return x.i === j; })[0]; if (br) { force = fmtForce(Math.abs(br.force)); kind = br.force >= 0 ? t('kTension') : t('kCompression'); use = T.num(br.util * 100, 0) + ' %'; } }
          else if (cs.slack && cs.slack[j]) { state = t('stSlack'); force = '0'; }
          else if (!cs.f) { state = t('stUnstable'); }
          else if (cs.f) { var f = cs.f[j], u = cs.util[j]; force = fmtForce(Math.abs(f)); kind = u < 0.005 ? t('kNone') : f >= 0 ? t('kTension') : t('kCompression'); use = T.num(u * 100, 0) + ' %'; state = u > 0.9 ? t('stLimit') : t('stOk'); }
          if (result.maxUtil && result.cases.length > 1) use += ' · ' + t('eMaxShort', { u: T.num(result.maxUtil[j] * 100, 0) });
          if (pm.cap.buckles && kind === t('kCompression')) state += ' · ' + t('stBuckle');
        }
        var matSel = h('select', { 'aria-label': t('eRowMat', { n: i + 1 }) }, scene.mats.map(function (mk) { return h('option', { value: mk, text: t('mat_' + mk) }); }));
        matSel.value = m.mat;
        matSel.addEventListener('change', function () { var before = history.snapshot(); m.mat = matSel.value; history.commit(before); result = null; refresh(); });
        var kIn = h('select', { 'aria-label': t('eRowSection', { n: i + 1 }) }, [1, 2, 3].filter(function (k) { return k <= (scene.maxK || 1); }).map(function (k) { return h('option', { value: k, text: '×' + k }); }));
        kIn.value = m.k || 1;
        kIn.addEventListener('change', function () { var before = history.snapshot(); m.k = +kIn.value; history.commit(before); result = null; refresh(); });
        var del = T.btn(t('eRowDelete', { n: i + 1 }), { icon: 'borrar', cls: 'icon-only danger', onClick: function () { deleteMember(i); } });
        tb.appendChild(h('tr', null,
          h('th', { scope: 'row', text: String(i + 1) }),
          h('td', { text: '(' + fmtLen(a.x + half()) + ', ' + fmtLen(a.y) + ') → (' + fmtLen(b.x + half()) + ', ' + fmtLen(b.y) + ')' }),
          h('td', { text: fmtLen(len) }), h('td', null, matSel, ' ', kIn), h('td', { text: force }), h('td', { text: kind }), h('td', { text: use }), h('td', { text: state }), h('td', null, del)));
      });
      var table = h('table', { class: 'igt-table' },
        h('caption', { id: 'igt-e-tcap', text: t('eTableCap', { n: doc.members.length }) }),
        h('thead', null, h('tr', null, [t('thN'), t('thFromTo'), t('thLen'), t('thMat'), t('thForce'), t('thKind'), t('thUse'), t('thState'), t('thDel')].map(function (x) { return h('th', { scope: 'col', text: x }); }))),
        tb);
      tableWrap.appendChild(table);
    }

    function refresh() {
      if (!result) { cancelAnimationFrame(anim); posLabel.hidden = true; }
      renderResult(); renderTable(); resize();
      legend.textContent = t('eLegendShort');
    }

    function loadData(d) {
      if (!d || !d.scene || !d.doc || typeof d.doc.nodes !== 'object' || !Array.isArray(d.doc.members)) throw new Error('bad');
      var s = d.scene;
      if (!C.SCALES[s.scale] || !(+s.span > 0) || !s.load) throw new Error('bad');
      var mats = (Array.isArray(s.mats) ? s.mats : []).filter(function (m) { return C.MATERIALS[s.scale][m]; });
      var ns = { id: String(s.id || 'libre').slice(0, 20), scale: s.scale, span: Math.min(100, +s.span), cliffs: s.cliffs === 'left' ? 'left' : 'both',
        load: s.load.type === 'peso' ? { type: 'peso', kg: Math.max(0.01, Math.min(1000, +s.load.kg || 1)), at: [+(s.load.at || [0, 0])[0] || 0, +(s.load.at || [0, 0])[1] || 0] } : { type: C.VEHICLES[s.load.type] ? s.load.type : 'coche' },
        maxPieces: Math.max(0, +s.maxPieces || 0), mats: mats.length ? mats : Object.keys(C.MATERIALS[s.scale]), maxK: Math.max(1, Math.min(3, +s.maxK || 1)),
        anchorsOnWalls: !!s.anchorsOnWalls, maxAnchors: Math.max(0, +s.maxAnchors || 0), maxMass: Math.max(0, +s.maxMass || 0) };
      var nodes = {};
      Object.keys(d.doc.nodes).slice(0, 400).forEach(function (k) { var n = d.doc.nodes[k]; if (n && isFinite(n.x) && isFinite(n.y)) nodes[String(k).slice(0, 20)] = { x: +n.x, y: +n.y, anchor: !!n.anchor, fixed: !!n.fixed, keep: !!n.keep }; });
      var members = d.doc.members.slice(0, 240).filter(function (m) { return m && nodes[m.a] && nodes[m.b]; }).map(function (m) { return { a: String(m.a), b: String(m.b), mat: ns.mats.indexOf(m.mat) >= 0 ? m.mat : ns.mats[0], k: Math.max(1, Math.min(3, +m.k || 1)) }; });
      scene = ns; doc = { nodes: nodes, members: members };
      if (d.freeCfg && typeof d.freeCfg === 'object') freeCfg = { scale: d.freeCfg.scale === 'maqueta' ? 'maqueta' : 'real', span: +d.freeCfg.span || 16, load: String(d.freeCfg.load || 'coche'), kg: +d.freeCfg.kg || 5, anchorsOnWalls: !!d.freeCfg.anchorsOnWalls };
      history.reset(); result = null; picking = true; retos.pick(retos.byId(scene.id), true); picking = false; lastPicked = retos.byId(scene.id);
      syncScenePanel(); refresh();
    }

    if (window.ResizeObserver) new ResizeObserver(function () { if (Math.abs(box.clientWidth - dispW) > 2) resize(); }).observe(box);
    else window.addEventListener('resize', resize);
    resetStructure(); syncScenePanel(); setMode('pieza'); refresh();
    cursor.x = -half(); cursor.y = 0;
  });
})(window, document);
