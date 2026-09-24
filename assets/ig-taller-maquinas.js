/* Iris Green · El taller · Estudio de máquinas: engranajes, palanca, poleas y máquina en cadena.
   Todo se construye con formularios y listas accesibles; el dibujo acompaña y tiene texto equivalente. */
(function (window, document) {
  'use strict';
  var T = window.IGT, M = window.IGTMaq; if (!T || !M) return;
  var t = T.t, h = T.h;
  var TEETH = [8, 10, 12, 15, 16, 18, 20, 24, 25, 30, 32, 36, 40, 45, 48, 50, 60, 72, 80];
  var DIRS = [0, 45, 90, 135, 180, 225, 270, 315];

  function blank() {
    return { tab: 'gears', title: '',
      gears: { list: [{ id: 1, x: 0, y: 0, z: 20, layer: 0 }], motorId: 1, rpm: 60, outId: null, nextId: 2 },
      lever: { L: 3, f: 1, c: 0.2, e: 3, load: 60 },
      pulley: { kind: 'fija', load: 50, h: 2 },
      chain: { steps: [] } };
  }

  T.ready(function () {
    var app = T.mount(); if (!app || app.getAttribute('data-studio') !== 'maquinas') return;
    var CH = T.dict.challenges || [];
    var doc = blank(), randomSpec = null;
    var history = new T.History(function () { return doc; }, function (d) { doc = d; syncTab(); renderAll(); }, function () { if (bar) bar.sync(); });
    function edit(fn) { var b = history.snapshot(); fn(); history.commit(b); renderAll(); }

    var retos = T.challenges({ items: CH, onPick: onPick });
    var bar = T.projectBar({ studio: 'maquinas', history: history, getData: function () { return doc; }, getTitle: function () { return doc.title; },
      onNew: function () { doc = blank(); history.reset(); T.markClean(); syncTab(); renderAll(); T.say(t('mNewDone')); }, onOpen: loadDoc,
      extra: [T.btn(t('mPng'), { icon: 'png', onClick: function () { T.exportPNG(canvas, dispW, dispH, 'iris-green-maquinas-' + doc.tab + '-' + T.stamp() + '.png', t('mTab_' + doc.tab) + ' · ' + t('mMadeIn')); } })] });
    var tabs = h('div', { class: 'igt-tabs', role: 'group', 'aria-label': t('mTabs') }), tabBtns = {};
    ['gears', 'lever', 'pulley', 'chain'].forEach(function (k) { var b = T.btn(t('mTab_' + k), { cls: 'igt-chip', pressed: k === doc.tab, onClick: function () { doc.tab = k; syncTab(); renderAll(); T.say(t('mTab_' + k)); } }); b.setAttribute('data-fk', 'tab' + k); tabBtns[k] = b; tabs.appendChild(b); });
    var canvas = h('canvas', { class: 'igt-maq', role: 'img', 'aria-describedby': 'igt-m-alt' });
    var box = h('div', { class: 'igt-canvas-box' }, canvas);
    var anim = h('div', { class: 'igt-bar' });
    var stage = h('div', { class: 'igt-stage glass' }, tabs, box, anim);
    var side = h('div', { class: 'igt-side glass' });
    var altBox = h('div', { class: 'igt-alt', id: 'igt-m-alt' });
    var tableWrap = h('div', { class: 'igt-table-wrap', role: 'region', tabindex: '0', 'aria-labelledby': 'igt-m-tcap' });
    var checkBox = h('div', { 'aria-live': 'polite' });
    app.appendChild(retos);
    app.appendChild(h('div', { class: 'igt-topbar glass' }, bar));
    app.appendChild(h('div', { class: 'igt-work igt-print-keep' }, stage, side));
    [altBox, tableWrap].forEach(function (el) { el.classList.add('igt-print-keep'); app.appendChild(el); });
    history.bindKeys(document);

    function syncTab() { Object.keys(tabBtns).forEach(function (k) { T.press(tabBtns[k], k === doc.tab); }); stopSpin(); }
    function num(v, d) { v = parseFloat(String(v).replace(',', '.')); return isFinite(v) ? v : d; }
    function field(id, label, el) { el.id = id; return h('label', { class: 'igt-field', for: id }, label, el); }

    /* ---------- Engranajes ---------- */
    var spinT = 0, spinning = false, raf = 0, lastTs = 0, timeIn = null;
    function gearRes() { var G = doc.gears; return M.solveGears(G.list, G.motorId, G.rpm); }
    function gearById(id) { for (var i = 0; i < doc.gears.list.length; i++) if (doc.gears.list[i].id === id) return doc.gears.list[i]; return null; }
    function sideGears() {
      var G = doc.gears, zSel = h('select', null, TEETH.map(function (z) { return h('option', { value: z, text: t('mTeethN', { n: z }) }); })); zSel.value = 20;
      var baseSel = h('select', null, G.list.map(function (g) { return h('option', { value: g.id, text: t('mGearN', { n: g.id, z: g.z }) }); })); baseSel.value = G.list.length ? G.list[G.list.length - 1].id : '';
      var dirSel = h('select', null, DIRS.map(function (d) { return h('option', { value: d, text: t('mDir_' + d) }); }));
      var howSel = h('select', null, ['mesh', 'front', 'back'].map(function (k) { return h('option', { value: k, text: t('mHow_' + k) }); }));
      function syncHow() { dirSel.parentNode.hidden = howSel.value !== 'mesh'; }
      howSel.addEventListener('change', syncHow);
      var add = T.btn(t('mAddGear'), { icon: 'mas', cls: 'primary', onClick: function () {
        var base = gearById(+baseSel.value), z = +zSel.value;
        if (!base) { edit(function () { G.list.push({ id: G.nextId++, x: 0, y: 0, z: z, layer: 0 }); }); return; }
        var g;
        if (howSel.value === 'mesh') { var p = M.placeMeshed(base, z, +dirSel.value); g = { id: G.nextId, x: p.x, y: p.y, z: z, layer: base.layer }; }
        else g = { id: G.nextId, x: base.x, y: base.y, z: z, layer: howSel.value === 'front' ? base.layer + 1 : base.layer - 1 };
        if (g.layer < 0 || g.layer > 3) { T.say(t('mLayerLimit')); return; }
        if (G.list.some(function (o) { return M.sameAxle(o, g) && o.layer === g.layer; })) { T.say(t('mOccupied')); return; }
        if (G.list.length >= 30) { T.say(t('mTooMany')); return; }
        edit(function () { G.list.push(g); G.nextId++; });
        T.say(t('mAdded', { n: g.id, z: z }));
      } });
      var rpmIn = h('input', { type: 'number', min: 0.01, max: 3000, step: 'any', value: Math.abs(G.rpm) });
      var dirMotor = h('select', null, [['1', t('mCW')], ['-1', t('mCCW')]].map(function (o) { return h('option', { value: o[0], text: o[1] }); })); dirMotor.value = G.rpm >= 0 ? '1' : '-1';
      function setRpm() { var v = Math.max(0.001, Math.min(3000, num(rpmIn.value, 60))); edit(function () { G.rpm = v * (+dirMotor.value); }); }
      rpmIn.addEventListener('change', setRpm); dirMotor.addEventListener('change', setRpm);
      var p1 = T.panel(t('mAddPanel'), true, field('igt-m-z', t('mTeeth'), zSel), field('igt-m-how', t('mHow'), howSel), field('igt-m-base', t('mNextTo'), baseSel), field('igt-m-dir', t('mDirection'), dirSel), add,
        h('p', { class: 'igt-note', text: t('mAddNote') }));
      var p2 = T.panel(t('mMotorPanel'), true, field('igt-m-rpm', t('mRpm'), rpmIn), field('igt-m-mdir', t('mMotorDir'), dirMotor));
      side.appendChild(p1); side.appendChild(p2); syncHow();
    }
    function tableGears(r) {
      var G = doc.gears, tb = h('tbody');
      G.list.forEach(function (g, i) {
        var sp = r.speed[g.id], role = g.id === G.motorId ? t('mMotor') : g.id === G.outId ? t('mOutput') : '';
        var acts = h('td', null,
          fk(T.btn(t('mMakeMotor', { n: g.id }), { cls: 'igt-chip', pressed: g.id === G.motorId, onClick: function () { edit(function () { G.motorId = g.id; if (G.outId === g.id) G.outId = null; }); } }), 'mo' + g.id),
          fk(T.btn(t('mMakeOut', { n: g.id }), { cls: 'igt-chip', pressed: g.id === G.outId, onClick: function () { edit(function () { G.outId = G.outId === g.id ? null : g.id; }); } }), 'so' + g.id),
          fk(T.btn(t('mRemove', { n: g.id }), { icon: 'borrar', cls: 'icon-only danger', disabled: G.list.length < 2, onClick: function () { edit(function () { G.list.splice(i, 1); if (G.motorId === g.id) G.motorId = G.list[0].id; if (G.outId === g.id) G.outId = null; }); T.say(t('mRemoved')); } }), 'rm' + g.id));
        tb.appendChild(h('tr', null, h('th', { scope: 'row', text: String(g.id) }), h('td', { text: String(g.z) }), h('td', { text: t('mLayerN', { n: g.layer + 1 }) }),
          h('td', { text: sp === undefined ? t('mLoose') : fmtRpm(sp) }), h('td', { text: sp === undefined ? '—' : sp >= 0 ? t('mCW') : t('mCCW') }),
          h('td', { text: sp === undefined ? '—' : '×' + T.num(r.torque[g.id], 2) }), h('td', { text: role }), acts));
      });
      return h('table', { class: 'igt-table' }, h('caption', { id: 'igt-m-tcap', text: t('mGearsCap', { n: G.list.length }) }),
        h('thead', null, h('tr', null, [t('thN'), t('mThTeeth'), t('mThLayer'), t('mThSpeed'), t('mThDir'), t('mThTorque'), t('mThRole'), t('mThActions')].map(function (x) { return h('th', { scope: 'col', text: x }); }))), tb);
    }
    function fmtRpm(v) { var a = Math.abs(v); return (a >= 1 ? T.num(a, 2) : T.num(a, 4)) + ' rpm' + (a < 1 ? ' (' + t('mTurnEvery', { s: T.num(60 / a, 1) }) + ')' : ''); }
    function drawGears(c, W, H) {
      var G = doc.gears, r = gearRes(); if (!G.list.length) return;
      var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      G.list.forEach(function (g) { var R = M.radius(g.z) + 3; minX = Math.min(minX, g.x - R); maxX = Math.max(maxX, g.x + R); minY = Math.min(minY, g.y - R); maxY = Math.max(maxY, g.y + R); });
      var s = Math.min((W - 30) / (maxX - minX), (H - 30) / (maxY - minY), 6), ox = W / 2 - s * (minX + maxX) / 2, oy = H / 2 - s * (minY + maxY) / 2;
      var phase = gearPhases(r);
      G.list.slice().sort(function (a, b) { return a.layer - b.layer; }).forEach(function (g) {
        var R = M.radius(g.z), sp = r.speed[g.id], ang = phase[g.id] + (sp === undefined ? 0 : sp * spinT * Math.PI * 2 / 60);
        var cx = ox + g.x * s, cy = oy + g.y * s;
        c.save(); c.translate(cx, cy); c.rotate(ang);
        c.beginPath();
        var ro = (R + M.MODULE) * s, ri = (R - 1.25 * M.MODULE) * s;
        for (var k = 0; k < g.z; k++) {
          var a0 = k * 2 * Math.PI / g.z, step = 2 * Math.PI / g.z;
          c.lineTo(Math.cos(a0) * ri, Math.sin(a0) * ri); c.lineTo(Math.cos(a0 + step * 0.2) * ro, Math.sin(a0 + step * 0.2) * ro);
          c.lineTo(Math.cos(a0 + step * 0.5) * ro, Math.sin(a0 + step * 0.5) * ro); c.lineTo(Math.cos(a0 + step * 0.7) * ri, Math.sin(a0 + step * 0.7) * ri);
        }
        c.closePath();
        var cols = ['#c9d6e3', '#e6d3b3', '#d8cfee', '#cfe7dc'];
        c.fillStyle = sp === undefined ? '#eceff3' : cols[g.layer % 4]; c.globalAlpha = g.layer > 0 ? 0.92 : 1; c.fill();
        c.globalAlpha = 1; c.strokeStyle = '#17395c'; c.lineWidth = 1.5; c.stroke();
        c.beginPath(); c.arc(0, 0, Math.max(3, R * s * 0.18), 0, Math.PI * 2); c.fillStyle = '#fff'; c.fill(); c.stroke();
        c.strokeStyle = '#a8336f'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(0, 0); c.lineTo(ri * 0.85, 0); c.stroke();
        c.restore();
        var tag = String(g.id) + (g.id === G.motorId ? ' · M' : g.id === G.outId ? ' · S' : '');
        c.font = '700 12px Atkinson Hyperlegible, Arial'; var tw = c.measureText(tag).width + 10;
        c.fillStyle = 'rgba(255,255,255,.92)'; c.fillRect(cx - tw / 2, cy + R * s * 0.3, tw, 18); c.fillStyle = '#17395c'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(tag, cx, cy + R * s * 0.3 + 9);
      });
      r.collisions.forEach(function (p) { var a = gearById(p[0]), b = gearById(p[1]); c.strokeStyle = '#b3261e'; c.lineWidth = 3; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(ox + a.x * s, oy + a.y * s); c.lineTo(ox + b.x * s, oy + b.y * s); c.stroke(); c.setLineDash([]); });
    }
    /* Fase inicial para que los dientes encajen a la vista. */
    function gearPhases(r) {
      var G = doc.gears, ph = {}, q = [G.motorId]; ph[G.motorId] = 0;
      while (q.length) {
        var id = q.shift(), a = gearById(id);
        r.links.forEach(function (l) {
          var o = l[0] === id ? l[1] : l[1] === id ? l[0] : null; if (o === null || ph[o] !== undefined) return;
          var b = gearById(o);
          if (l[2] === 'axle') ph[o] = ph[id];
          else { var th = Math.atan2(b.y - a.y, b.x - a.x); ph[o] = th + Math.PI + Math.PI / b.z - (ph[id] - th) * a.z / b.z; }
          q.push(o);
        });
      }
      G.list.forEach(function (g) { if (ph[g.id] === undefined) ph[g.id] = 0; });
      return ph;
    }
    function spinStep(ts) { if (!spinning) return; if (lastTs) spinT = (spinT + (ts - lastTs) / 1000) % 60; lastTs = ts; if (timeIn) timeIn.value = spinT; draw(); raf = requestAnimationFrame(spinStep); }
    function stopSpin() { spinning = false; cancelAnimationFrame(raf); lastTs = 0; }
    function gearAnimBar() {
      T.clear(anim);
      if (doc.tab !== 'gears') return;
      var tIn = h('input', { type: 'range', min: 0, max: 60, step: 0.1, value: spinT % 60, id: 'igt-m-time' }); timeIn = tIn;
      tIn.addEventListener('input', function () { stopSpin(); spinT = +tIn.value; draw(); });
      anim.appendChild(T.btn(t('mSpin'), { icon: 'play', onClick: function () { if (T.reducedMotion()) { spinT = (spinT + 5) % 60; tIn.value = spinT; draw(); T.say(t('mSpinReduced')); return; } if (spinning) return; spinning = true; raf = requestAnimationFrame(spinStep); T.say(t('mSpinning')); } }));
      anim.appendChild(T.btn(t('mStop'), { icon: 'parar', onClick: function () { stopSpin(); T.say(t('mStopped')); } }));
      anim.appendChild(h('label', { class: 'igt-field inline', for: 'igt-m-time' }, t('mTime'), tIn));
    }

    /* ---------- Palanca ---------- */
    function sideLever() {
      var Lv = doc.lever;
      function slider(key, label, max) {
        var el = h('input', { type: 'range', min: 0, max: max, step: 0.05, value: Lv[key] });
        var out = h('output', { text: T.num(Lv[key], 2) + ' m' });
        var before = null;
        el.addEventListener('focus', function () { before = history.snapshot(); });
        el.addEventListener('pointerdown', function () { before = history.snapshot(); });
        el.addEventListener('input', function () { if (!before) before = history.snapshot(); Lv[key] = +el.value; out.textContent = T.num(Lv[key], 2) + ' m'; draw(); renderInfo(); });
        el.addEventListener('change', function () { history.commit(before || undefined); before = null; renderAll(); });
        el.id = 'igt-m-' + key;
        return h('label', { class: 'igt-field', for: el.id }, h('span', null, label + ': ', out), el);
      }
      var loadIn = h('input', { type: 'number', min: 1, max: 2000, step: 1, value: Lv.load });
      loadIn.addEventListener('change', function () { edit(function () { Lv.load = Math.max(1, Math.min(2000, num(loadIn.value, 60))); }); });
      side.appendChild(T.panel(t('mLeverPanel'), true, slider('f', t('mFulcrum'), Lv.L), slider('c', t('mLoadPos'), Lv.L), slider('e', t('mEffortPos'), Lv.L), field('igt-m-load', t('mLoadKg'), loadIn),
        h('p', { class: 'igt-note', text: t('mLeverNote') })));
    }
    function drawLever(c, W, H) {
      var Lv = doc.lever, r = M.lever(Lv.L, Lv.f, Lv.c, Lv.e, Lv.load), s = (W - 80) / Lv.L, x0 = 40, y = H * 0.55;
      c.fillStyle = '#8d5b3a'; c.fillRect(x0, y - 7, Lv.L * s, 14);
      c.fillStyle = '#17395c'; c.beginPath(); c.moveTo(x0 + Lv.f * s, y + 7); c.lineTo(x0 + Lv.f * s - 18, y + 42); c.lineTo(x0 + Lv.f * s + 18, y + 42); c.closePath(); c.fill();
      c.fillStyle = '#5d6877'; c.fillRect(x0 + Lv.c * s - 22, y - 51, 44, 44); c.fillStyle = '#fff'; c.font = '700 13px Atkinson Hyperlegible, Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(T.num(Lv.load, 0) + ' kg', x0 + Lv.c * s, y - 29);
      var ex = x0 + Lv.e * s;
      c.strokeStyle = '#a8336f'; c.fillStyle = '#a8336f'; c.lineWidth = 4;
      /* la fuerza empuja hacia abajo si está al otro lado del fulcro; hacia arriba si está del mismo lado */
      var dir = r.ok && r.sameSide ? -1 : 1;
      c.beginPath(); c.moveTo(ex, dir > 0 ? y - 80 : y + 70); c.lineTo(ex, dir > 0 ? y - 12 : y + 12); c.stroke();
      c.beginPath(); if (dir > 0) { c.moveTo(ex, y - 9); c.lineTo(ex - 9, y - 24); c.lineTo(ex + 9, y - 24); } else { c.moveTo(ex, y + 9); c.lineTo(ex - 9, y + 24); c.lineTo(ex + 9, y + 24); } c.closePath(); c.fill();
      if (r.ok) { c.fillStyle = '#17395c'; c.font = '700 14px Atkinson Hyperlegible, Arial'; c.fillText(T.num(r.effort, 1) + ' kg', ex, dir > 0 ? y - 92 : y + 84); }
      c.fillStyle = '#46566b'; c.font = '12px Atkinson Hyperlegible, Arial';
      for (var m = 0; m <= Lv.L + 1e-9; m += 0.5) { c.fillRect(x0 + m * s - 0.5, y + 50, 1, 8); c.fillText(T.num(m, 1) + ' m', x0 + m * s, y + 68); }
    }

    /* ---------- Poleas ---------- */
    function sidePulley() {
      var P = doc.pulley;
      var kSel = h('select', null, Object.keys(M.PULLEYS).map(function (k) { return h('option', { value: k, text: t('mPulley_' + k) }); })); kSel.value = P.kind;
      kSel.addEventListener('change', function () { edit(function () { P.kind = kSel.value; }); });
      var lIn = h('input', { type: 'number', min: 1, max: 2000, step: 1, value: P.load }), hIn = h('input', { type: 'number', min: 0.1, max: 50, step: 0.1, value: P.h });
      lIn.addEventListener('change', function () { edit(function () { P.load = Math.max(1, Math.min(2000, num(lIn.value, 50))); }); });
      hIn.addEventListener('change', function () { edit(function () { P.h = Math.max(0.1, Math.min(50, num(hIn.value, 2))); }); });
      side.appendChild(T.panel(t('mPulleyPanel'), true, field('igt-m-pk', t('mPulleyKind'), kSel), field('igt-m-pl', t('mLoadKg'), lIn), field('igt-m-ph', t('mHeight'), hIn), h('p', { class: 'igt-note', text: t('mPulleyNote') })));
    }
    function drawPulley(c, W, H) {
      var P = doc.pulley, r = M.pulley(P.kind, P.load, P.h), def = M.PULLEYS[P.kind];
      /* Poleas en zigzag: fijas arriba y móviles abajo, alternas, para que cada tramo de cuerda sea vertical. */
      var R = 22, n = def.fixed + def.moving, topY = 70, botY = Math.min(H - 150, 250), beamY = 26;
      var startBottom = r.n % 2 === 0; /* número par de tramos: la cuerda se ata arriba y empieza en una móvil */
      var seq = []; for (var k = 0; k < n; k++) seq.push((k % 2 === 0) === startBottom ? 'bot' : 'top');
      var x0 = W / 2 - (n - 1) * R, xs = seq.map(function (_, k) { return x0 + k * 2 * R; });
      var yOf = function (k) { return seq[k] === 'top' ? topY : botY; };
      c.fillStyle = '#5d6877'; c.fillRect(x0 - R - 40, beamY - 12, (n - 1) * 2 * R + 2 * R + 80, 12);
      c.strokeStyle = '#17395c'; c.lineWidth = 2.5;
      xs.forEach(function (x, k) { if (seq[k] === 'top') { c.beginPath(); c.moveTo(x, beamY); c.lineTo(x, topY); c.stroke(); } });
      var bots = xs.filter(function (_, k) { return seq[k] === 'bot'; }), blockY = botY + R + 16, loadX = W / 2, loadY = blockY + 24;
      if (bots.length) {
        bots.forEach(function (x) { c.beginPath(); c.moveTo(x, botY); c.lineTo(x, blockY); c.stroke(); });
        var bl = Math.min(bots[0], loadX, startBottom ? Infinity : x0 - R), br = Math.max(bots[bots.length - 1], loadX);
        c.fillStyle = '#17395c'; c.fillRect(bl - 6, blockY - 3, br - bl + 12, 6);
        c.beginPath(); c.moveTo(loadX, blockY); c.lineTo(loadX, loadY); c.stroke();
      } else { loadX = x0 - R; loadY = botY; }
      /* cuerda */
      c.strokeStyle = '#8a4b00'; c.lineWidth = 3; c.beginPath();
      var ax = x0 - R;
      if (startBottom) c.moveTo(ax, beamY); else c.moveTo(ax, bots.length ? blockY : loadY);
      xs.forEach(function (x, k) {
        var y = yOf(k); c.lineTo(x - R, y);
        if (seq[k] === 'top') c.arc(x, y, R, Math.PI, 0, false); else c.arc(x, y, R, Math.PI, 0, true);
      });
      var last = n - 1, hx = xs[last] + R, pullUp = seq[last] === 'bot', hy = pullUp ? beamY + 8 : H - 46;
      c.lineTo(hx, hy); c.stroke();
      if (startBottom) { c.fillStyle = '#8a4b00'; c.fillRect(ax - 4, beamY, 8, 5); }
      xs.forEach(function (x, k) { var y = yOf(k); c.strokeStyle = '#17395c'; c.lineWidth = 2; c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.arc(x, y, R - 4, 0, Math.PI * 2); c.fill(); c.stroke(); c.beginPath(); c.arc(x, y, 4, 0, Math.PI * 2); c.fillStyle = '#17395c'; c.fill(); });
      c.fillStyle = '#a8336f'; c.beginPath();
      if (pullUp) { c.moveTo(hx, hy - 10); c.lineTo(hx - 8, hy + 6); c.lineTo(hx + 8, hy + 6); } else { c.moveTo(hx, hy + 12); c.lineTo(hx - 8, hy - 4); c.lineTo(hx + 8, hy - 4); }
      c.closePath(); c.fill();
      c.font = '700 13px Atkinson Hyperlegible, Arial'; c.textAlign = 'left'; c.textBaseline = 'middle';
      var lab = T.num(r.effortKg, 1) + ' kg'; c.fillStyle = 'rgba(255,255,255,.92)'; var lw = c.measureText(lab).width + 10, ly = pullUp ? hy + 22 : hy + 4;
      c.fillRect(hx + 12, ly - 10, lw, 20); c.fillStyle = '#17395c'; c.fillText(lab, hx + 17, ly);
      c.fillStyle = '#5d6877'; c.fillRect(loadX - 34, loadY, 68, 46); c.fillStyle = '#fff'; c.textAlign = 'center'; c.fillText(T.num(P.load, 0) + ' kg', loadX, loadY + 23);
      c.fillStyle = '#17395c'; c.textAlign = 'left'; c.fillText(t(r.n === 1 ? 'mRopes1' : 'mRopesN', { n: r.n }), 12, H - 14);
    }

    /* ---------- Máquina en cadena ---------- */
    function sideChain() {
      var partSel = h('select', null, Object.keys(M.PARTS).map(function (k) { return h('option', { value: k, text: t('mPart_' + k) }); }));
      side.appendChild(T.panel(t('mChainPanel'), true, field('igt-m-part', t('mPart'), partSel),
        T.btn(t('mAddStep'), { icon: 'mas', cls: 'primary', onClick: function () {
          var S = doc.chain.steps; if (S.length >= 30) { T.say(t('mTooMany')); return; }
          var k = partSel.value, prevOut = S.length ? S[S.length - 1].out : M.PARTS[k][0];
          edit(function () { S.push({ part: k, text: '', inp: prevOut, out: M.PARTS[k][0] }); });
          T.say(t('mStepAdded', { n: S.length }));
          var ins = tableWrap.querySelectorAll('input[type=text]'); if (ins.length) ins[ins.length - 1].focus();
        } }), h('p', { class: 'igt-note', text: t('mChainNote') })));
    }
    function tableChain() {
      var S = doc.chain.steps, tb = h('tbody'), chk = M.checkChain(S);
      S.forEach(function (st, i) {
        var mv = function (key) { var s = h('select', { 'data-fk': key + i, 'aria-label': t(key === 'inp' ? 'mInpN' : 'mOutN', { n: i + 1 }) }, M.MOVES.map(function (m) { return h('option', { value: m, text: t('mMove_' + m) }); })); s.value = st[key]; s.addEventListener('change', function () { edit(function () { st[key] = s.value; }); }); return s; };
        var pSel = h('select', { 'data-fk': 'p' + i, 'aria-label': t('mPartN', { n: i + 1 }) }, Object.keys(M.PARTS).map(function (k) { return h('option', { value: k, text: t('mPart_' + k) }); })); pSel.value = st.part;
        pSel.addEventListener('change', function () { edit(function () { st.part = pSel.value; }); });
        var txt = h('input', { type: 'text', 'data-fk': 't' + i, value: st.text, maxlength: 120, 'aria-label': t('mTextN', { n: i + 1 }) });
        txt.addEventListener('change', function () { edit(function () { st.text = txt.value.trim(); }); });
        var bad = chk.bad.indexOf(i) >= 0;
        tb.appendChild(h('tr', null, h('th', { scope: 'row', text: String(i + 1) }), h('td', null, pSel), h('td', null, txt), h('td', null, mv('inp'), bad ? h('span', { class: 'igt-warn', text: ' ' + t('mNoFit') }) : null), h('td', null, mv('out')),
          h('td', null, fk(T.btn(t('mUpN', { n: i + 1 }), { icon: 'arriba', cls: 'icon-only', disabled: i === 0, onClick: function () { edit(function () { S.splice(i - 1, 0, S.splice(i, 1)[0]); }); T.say(t('mMoved', { n: i })); } }), 'u' + i),
            fk(T.btn(t('mDownN', { n: i + 1 }), { icon: 'abajo', cls: 'icon-only', disabled: i === S.length - 1, onClick: function () { edit(function () { S.splice(i + 1, 0, S.splice(i, 1)[0]); }); T.say(t('mMoved', { n: i + 2 })); } }), 'd' + i),
            fk(T.btn(t('mDelN', { n: i + 1 }), { icon: 'borrar', cls: 'icon-only danger', onClick: function () { edit(function () { S.splice(i, 1); }); T.say(t('mRemoved')); } }), 'x' + i))));
      });
      if (!S.length) return h('p', { class: 'igt-note', id: 'igt-m-tcap', style: 'padding:10px 12px', text: t('mChainEmpty') });
      return h('table', { class: 'igt-table' }, h('caption', { id: 'igt-m-tcap', text: t('mChainCap', { n: S.length }) }),
        h('thead', null, h('tr', null, [t('thN'), t('mPart'), t('mWhat'), t('mInp'), t('mOut'), t('mThActions')].map(function (x) { return h('th', { scope: 'col', text: x }); }))), tb);
    }
    function drawChain(c, W, H) {
      var S = doc.chain.steps, chk = M.checkChain(S); if (!S.length) { c.fillStyle = '#46566b'; c.font = '15px Atkinson Hyperlegible, Arial'; c.textAlign = 'center'; c.fillText(t('mChainEmpty'), W / 2, H / 2); return; }
      var cols = Math.max(1, Math.min(5, Math.floor(W / 150))), bw = (W - 30) / cols, bh = 74, rows = Math.ceil(S.length / cols);
      S.forEach(function (st, i) {
        var col = i % cols, row = Math.floor(i / cols), x = 15 + col * bw, y = 15 + row * (bh + 26);
        if (row % 2 === 1) x = 15 + (cols - 1 - col) * bw;
        var bad = chk.bad.indexOf(i) >= 0;
        c.fillStyle = '#fff'; c.strokeStyle = bad ? '#b3261e' : '#17395c'; c.lineWidth = bad ? 3 : 1.5; c.fillRect(x + 6, y, bw - 12, bh); c.strokeRect(x + 6, y, bw - 12, bh);
        c.fillStyle = '#17395c'; c.font = '700 13px Atkinson Hyperlegible, Arial'; c.textAlign = 'left'; c.textBaseline = 'top'; c.fillText((i + 1) + '. ' + t('mPart_' + st.part), x + 14, y + 8);
        c.font = '12px Atkinson Hyperlegible, Arial'; c.fillStyle = '#46566b'; c.fillText(t('mMove_' + st.inp) + ' → ' + t('mMove_' + st.out), x + 14, y + 30);
        if (bad) { c.fillStyle = '#b3261e'; c.fillText('✕ ' + t('mNoFit'), x + 14, y + 50); }
      });
    }

    /* ---------- Dibujo común ---------- */
    var ctx, dispW = 700, dispH = 420;
    function resize() {
      var w = Math.max(260, box.clientWidth || 700);
      dispW = w; dispH = doc.tab === 'chain' ? Math.max(180, 30 + Math.ceil(Math.max(1, doc.chain.steps.length) / Math.max(1, Math.min(5, Math.floor(w / 150)))) * 100) : Math.round(Math.min(520, Math.max(300, w * 0.6)));
      ctx = T.fitCanvas(canvas, dispW, dispH); canvas.style.height = dispH + 'px'; draw();
    }
    function draw() {
      if (!ctx) return; var c = ctx;
      c.fillStyle = '#f7f5f0'; c.fillRect(0, 0, dispW, dispH);
      if (doc.tab === 'gears') drawGears(c, dispW, dispH);
      else if (doc.tab === 'lever') drawLever(c, dispW, dispH);
      else if (doc.tab === 'pulley') drawPulley(c, dispW, dispH);
      else drawChain(c, dispW, dispH);
    }

    /* ---------- Resultados, texto equivalente y retos ---------- */
    var infoBox = h('div', { 'aria-live': 'polite' });
    function renderInfo() {
      T.clear(infoBox);
      var lines = [];
      if (doc.tab === 'gears') {
        var r = gearRes(), G = doc.gears, out = G.outId && r.speed[G.outId] !== undefined ? r.speed[G.outId] : null;
        if (r.jam) infoBox.appendChild(T.result(false, t('mJam')));
        if (r.collisions.length) infoBox.appendChild(T.result(false, t('mCollide', { n: r.collisions.length })));
        lines.push(t('mMotorLine', { n: G.motorId, s: fmtRpm(G.rpm), d: G.rpm >= 0 ? t('mCW') : t('mCCW') }));
        if (out !== null) { var fr = M.ratioFrac(Math.abs(out / G.rpm)); lines.push(t('mOutLine', { n: G.outId, s: fmtRpm(out), d: out >= 0 ? t('mCW') : t('mCCW'), p: fr[0], q: fr[1], tq: T.num(r.torque[G.outId], 2) })); }
        else lines.push(t('mNoOut'));
        if (r.loose.length) lines.push(t('mLooseLine', { l: r.loose.join(', ') }));
      } else if (doc.tab === 'lever') {
        var Lv = doc.lever, lr = M.lever(Lv.L, Lv.f, Lv.c, Lv.e, Lv.load);
        if (!lr.ok) lines.push(t('mEffortOnFulcrum'));
        else { lines.push(t('mLeverLine', { e: T.num(lr.effort, 1), l: T.num(Lv.load, 0), a: T.num(lr.advantage, 2) })); lines.push(t('mKind_' + lr.kind)); }
      } else if (doc.tab === 'pulley') {
        var P = doc.pulley, pr = M.pulley(P.kind, P.load, P.h);
        lines.push(t('mPulleyLine', { e: T.num(pr.effortKg, 1), i: T.num(pr.idealKg, 1), n: pr.n, r: T.num(pr.rope, 1), h: T.num(P.h, 1) }));
        lines.push(t('mWork', { j: T.num(pr.work, 0) }));
      } else {
        var chk = M.checkChain(doc.chain.steps);
        lines.push(t('mChainLine', { n: doc.chain.steps.length, b: chk.bad.length, k: chk.kinds }));
      }
      infoBox.appendChild(h('ul', { class: 'igt-limits' }, lines.map(function (l) { return h('li', { text: l }); })));
      canvas.setAttribute('aria-label', t('mCanvas_' + doc.tab));
    }
    function renderAlt() {
      T.clear(altBox); altBox.appendChild(h('h3', { text: t('mAltTitle') }));
      if (doc.tab === 'gears') {
        var r = gearRes();
        doc.gears.list.forEach(function (g) { var sp = r.speed[g.id]; altBox.appendChild(h('p', { class: 'igt-note', text: t('mAltGear', { n: g.id, z: g.z, l: g.layer + 1, s: sp === undefined ? t('mLoose') : fmtRpm(sp) + ', ' + (sp >= 0 ? t('mCW') : t('mCCW')) }) })); });
      } else if (doc.tab === 'chain') {
        altBox.appendChild(h('ol', null, doc.chain.steps.map(function (st) { return h('li', { text: t('mPart_' + st.part) + (st.text ? ': ' + st.text : '') + ' (' + t('mMove_' + st.inp) + ' → ' + t('mMove_' + st.out) + ')' }); })));
        if (!doc.chain.steps.length) altBox.appendChild(h('p', { text: t('mChainEmpty') }));
      } else altBox.appendChild(h('p', { text: t('mAlt_' + doc.tab) }));
    }
    function focusKey() { var a = document.activeElement; if (!a || !app.contains(a)) return null; return a.id ? '#' + a.id : a.getAttribute('data-fk') ? '[data-fk="' + a.getAttribute('data-fk') + '"]' : null; }
    function fk(el, k) { el.setAttribute('data-fk', k); return el; }
    var busy = false, again = false;
    function renderAll() {
      if (busy) { again = true; return; }
      busy = true;
      try { var n = 0; do { again = false; renderAllNow(); } while (again && ++n < 3); } finally { busy = false; }
    }
    function renderAllNow() {
      var fkey = focusKey();
      T.clear(side);
      side.appendChild(T.panel(t('mResult'), true, infoBox, checkBox));
      if (doc.tab === 'gears') sideGears(); else if (doc.tab === 'lever') sideLever(); else if (doc.tab === 'pulley') sidePulley(); else sideChain();
      T.clear(tableWrap);
      if (doc.tab === 'gears') tableWrap.appendChild(tableGears(gearRes()));
      else if (doc.tab === 'chain') tableWrap.appendChild(tableChain());
      tableWrap.hidden = doc.tab === 'lever' || doc.tab === 'pulley';
      renderInfo(); renderAlt(); gearAnimBar(); checkChallenge(); resize();
      if (fkey) { var el = app.querySelector(fkey); if (el && !el.disabled) el.focus(); else if (el || fkey.indexOf('data-fk') >= 0) (tableWrap.hidden ? side : tableWrap).focus(); }
    }
    function onPick(ch) {
      randomSpec = null;
      if (ch && ch.tab && ch.tab !== doc.tab) { doc.tab = ch.tab; syncTab(); }
      if (ch && ch.random) randomSpec = M.randomRatio(Date.now() & 0xffffffff);
      if (ch && ch.setup) edit(function () { Object.keys(ch.setup).forEach(function (k) { doc[ch.tab][k] = ch.setup[k]; }); });
      else renderAll();
      if (!ch) return null;
      var w = h('div', { class: 'igt-noprint' });
      if (ch.random) w.appendChild(T.btn(t('mAnother'), { icon: 'reiniciar', onClick: function () { randomSpec = M.randomRatio((Date.now() * 13) & 0xffffffff); renderAll(); T.say(randomText()); } }));
      w.appendChild(randomBox);
      renderRandom();
      return w;
    }
    var randomBox = h('p', { class: 'igt-tip' });
    function randomText() { return randomSpec ? t('mRandomGoal', { p: randomSpec.num, q: randomSpec.den, d: randomSpec.sameDir ? t('mSameDir') : t('mOppDir') }) : ''; }
    function renderRandom() { randomBox.textContent = randomText(); randomBox.hidden = !randomSpec; }
    function checkChallenge() {
      T.clear(checkBox);
      var ch = retos.current(); if (!ch || ch.tab !== doc.tab) return;
      var R = ch.rules || {}, out = [];
      function add(ok, txt) { out.push([ok, txt]); }
      if (ch.tab === 'gears') {
        var G = doc.gears, r = gearRes(), o = G.outId && r.speed[G.outId] !== undefined ? r.speed[G.outId] : null;
        add(!r.jam && !r.collisions.length, t('mChkFree'));
        add(o !== null, t('mChkOut'));
        var want = R.ratio !== undefined ? R.ratio : randomSpec ? randomSpec.ratio : null, sameDir = R.sameDir !== undefined ? R.sameDir : randomSpec ? randomSpec.sameDir : null;
        if (want !== null && o !== null) { var got = Math.abs(o / G.rpm), fr = M.ratioFrac(want); add(Math.abs(got - want) < want * 0.005, t('mChkRatio', { p: fr[0], q: fr[1], g: T.num(got, 4) })); }
        if (sameDir !== null && o !== null) add((o * G.rpm > 0) === sameDir, sameDir ? t('mChkSameDir') : t('mChkOppDir'));
        if (R.minTorque && o !== null) add(r.torque[G.outId] >= R.minTorque, t('mChkTorque', { m: R.minTorque, g: T.num(r.torque[G.outId], 2) }));
        if (R.maxTeeth) add(G.list.every(function (g) { return g.z <= R.maxTeeth; }), t('mChkMaxTeeth', { m: R.maxTeeth }));
        if (R.maxGears) add(G.list.length <= R.maxGears, t('mChkMaxGears', { n: G.list.length, m: R.maxGears }));
      } else if (ch.tab === 'lever') {
        var Lv = doc.lever, lr = M.lever(Lv.L, Lv.f, Lv.c, Lv.e, Lv.load);
        if (R.maxEffort) add(lr.ok && lr.effort <= R.maxEffort + 1e-9, t('mChkEffort', { m: R.maxEffort, g: lr.ok ? T.num(lr.effort, 1) : '—' }));
        if (R.kind) add(lr.ok && lr.kind === R.kind, t('mChkKind', { k: R.kind }));
        if (R.minAdv) add(lr.ok && lr.advantage >= R.minAdv, t('mChkAdv', { m: R.minAdv }));
        if (R.maxAdv) add(lr.ok && lr.advantage <= R.maxAdv, t('mChkAdvMax', { m: R.maxAdv }));
        if (R.load) add(Lv.load >= R.load, t('mChkLoad', { m: R.load }));
      } else if (ch.tab === 'pulley') {
        var P = doc.pulley, pr = M.pulley(P.kind, P.load, P.h);
        if (R.load) add(P.load >= R.load, t('mChkLoad', { m: R.load }));
        if (R.height) add(P.h >= R.height, t('mChkHeight', { m: R.height }));
        if (R.maxEffort) add(pr.effortKg <= R.maxEffort, t('mChkEffort', { m: R.maxEffort, g: T.num(pr.effortKg, 1) }));
        if (R.maxRope) add(pr.rope <= R.maxRope + 1e-9, t('mChkRope', { m: R.maxRope, g: T.num(pr.rope, 1) }));
      } else {
        var chk = M.checkChain(doc.chain.steps);
        add(doc.chain.steps.length >= R.steps, t('mChkSteps', { n: doc.chain.steps.length, m: R.steps }));
        add(chk.ok, t('mChkFit', { b: chk.bad.length }));
        if (R.kinds) add(chk.kinds >= R.kinds, t('mChkKinds', { n: chk.kinds, m: R.kinds }));
        add(doc.chain.steps.every(function (s) { return s.text.length > 3; }), t('mChkTexts'));
      }
      var all = out.every(function (x) { return x[0]; });
      checkBox.appendChild(T.result(all, all ? t('mDone') : t('mNotYet')));
      checkBox.appendChild(h('ul', { class: 'igt-limits igt-checks', role: 'list' }, out.map(function (x) { return h('li', { text: (x[0] ? '✓ ' : '· ') + x[1] }); })));
    }
    function loadDoc(d) {
      if (!d || !d.gears || !Array.isArray(d.gears.list)) throw new Error('bad');
      var nd = blank();
      nd.tab = ['gears', 'lever', 'pulley', 'chain'].indexOf(d.tab) >= 0 ? d.tab : 'gears'; nd.title = String(d.title || '').slice(0, 80);
      nd.gears.list = d.gears.list.slice(0, 30).filter(function (g) { return g && TEETH.indexOf(+g.z) >= 0 && isFinite(g.x) && isFinite(g.y); }).map(function (g) { return { id: Math.round(+g.id) || 0, x: +g.x, y: +g.y, z: +g.z, layer: Math.max(0, Math.min(3, Math.round(+g.layer || 0))) }; });
      if (!nd.gears.list.length) throw new Error('bad');
      nd.gears.motorId = nd.gears.list.some(function (g) { return g.id === +d.gears.motorId; }) ? +d.gears.motorId : nd.gears.list[0].id;
      nd.gears.outId = nd.gears.list.some(function (g) { return g.id === +d.gears.outId; }) ? +d.gears.outId : null;
      nd.gears.rpm = Math.max(-3000, Math.min(3000, num(d.gears.rpm, 60))) || 60;
      nd.gears.nextId = Math.max.apply(null, nd.gears.list.map(function (g) { return g.id; })) + 1;
      if (d.lever) ['L', 'f', 'c', 'e', 'load'].forEach(function (k) { var v = num(d.lever[k], nd.lever[k]); nd.lever[k] = k === 'load' ? Math.max(1, Math.min(2000, v)) : Math.max(0, Math.min(nd.lever.L, v)); });
      if (d.pulley) { nd.pulley.kind = M.PULLEYS[d.pulley.kind] ? d.pulley.kind : 'fija'; nd.pulley.load = Math.max(1, Math.min(2000, num(d.pulley.load, 50))); nd.pulley.h = Math.max(0.1, Math.min(50, num(d.pulley.h, 2))); }
      if (d.chain && Array.isArray(d.chain.steps)) nd.chain.steps = d.chain.steps.slice(0, 30).filter(function (s) { return s && M.PARTS[s.part]; }).map(function (s) { return { part: s.part, text: String(s.text || '').slice(0, 120), inp: M.MOVES.indexOf(s.inp) >= 0 ? s.inp : 'empujon', out: M.MOVES.indexOf(s.out) >= 0 ? s.out : 'empujon' }; });
      doc = nd; history.reset(); syncTab(); renderAll();
    }
    if (window.ResizeObserver) new ResizeObserver(function () { if (Math.abs(box.clientWidth - dispW) > 2) resize(); }).observe(box);
    syncTab(); renderAll();
  });
})(window, document);
