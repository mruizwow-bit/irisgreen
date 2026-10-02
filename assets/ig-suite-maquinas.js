/* Iris Green · El taller · Estudio de máquinas e inventos (R43).
   Banco de trabajo 2D con cinco montajes: engranajes, palanca (y balancín), poleas, rampa y máquina
   en cadena. El cálculo en vivo usa IGTMaq (ig-taller-maquinas-calc.js, el mismo del estudio antiguo);
   la máquina en cadena usa física real con Planck.js (ig-suite-maquinas-cadena.js).
   Todo se coloca y se ajusta con puntero, con teclado y con campos del inspector. El movimiento solo
   empieza cuando la persona pulsa Probar; con movimiento reducido se avanza por pasos. */
(function (root) {
  'use strict';
  var IG = root.IGSuite, D = root.document; if (!IG) return;
  var M = root.IGTMaq, K = root.IGSMaqCadena; if (!M || !K) return;
  var LANG = IG.lang, SVGNS = 'http://www.w3.org/2000/svg', G = M.G;
  var MODES = ['gears', 'lever', 'pulley', 'ramp', 'chain'];
  var TEETH = [8, 10, 12, 15, 16, 18, 20, 24, 25, 30, 32, 36, 40, 45, 48, 50, 60, 72, 80];
  var DIRS = [0, 45, 90, 135, 180, 225, 270, 315];
  var LAYER_COL = ['#c9d6e3', '#e6d3b3', '#d8cfee', '#cfe7dc'];
  var INK = '#172b42', NAVY = '#17395c', VIOLET = '#5a49a8', BAD = '#a1283c', MAG = '#8a2942';
  var FONT = 'Atkinson Hyperlegible, Arial, sans-serif';
  var PART_COL = { ball: '#1f5f8b', domino: '#f4f1ea', ramp: '#9c6b3f', lever: '#b0843f', pendulum: '#5a49a8', wheel: '#2e7d4f', block: '#8a4b00', spring: '#c7507a', bucket: '#5d6877' };

  /* Retos: reglas aquí; textos en el módulo de idioma (ch_<id>, chg_<id>, chl_<id>, cht_<id>). */
  var CHALLENGES = [
    { id: 'g1', level: 1, mode: 'gears', rules: { ratio: 1 / 3 } },
    { id: 'g2', level: 1, mode: 'gears', rules: { ratio: 1, sameDir: true } },
    { id: 'p1', level: 1, mode: 'lever', setup: { load: 60 }, rules: { load: 60, maxEffort: 20, maxL: 3 } },
    { id: 'b1', level: 1, mode: 'lever', setup: { seesaw: true }, rules: { balance: true } },
    { id: 'q1', level: 1, mode: 'pulley', setup: { load: 40, h: 2 }, rules: { load: 40, maxEffort: 22 } },
    { id: 'q0', level: 1, mode: 'pulley', setup: { load: 20, h: 3, kind: 'fija' }, rules: { load: 20, height: 3, maxEffort: 12 } },
    { id: 'k0', level: 1, mode: 'chain', rules: { goal: true } },
    { id: 'k1', level: 1, mode: 'chain', rules: { steps: 3, fit: true, texts: true } },
    { id: 'g3', level: 2, mode: 'gears', rules: { minTorque: 4 } },
    { id: 'g4', level: 2, mode: 'gears', rules: { ratio: 3, sameDir: true } },
    { id: 'p2', level: 2, mode: 'lever', setup: { load: 60 }, rules: { load: 60, kind: 2, maxEffort: 30, maxL: 3 } },
    { id: 'p3', level: 2, mode: 'lever', setup: { load: 10 }, rules: { load: 10, kind: 3, maxEffort: 25, maxL: 3 } },
    { id: 'q2', level: 2, mode: 'pulley', setup: { load: 100, h: 2 }, rules: { load: 100, maxEffort: 30 } },
    { id: 'r1', level: 2, mode: 'ramp', setup: { load: 100, H: 1, mu: 0.1 }, rules: { load: 100, height: 1, mu: 0.1, maxEffort: 40 } },
    { id: 'g5', level: 3, mode: 'gears', rules: { ratio: 1 / 12, sameDir: true } },
    { id: 'g6', level: 3, mode: 'gears', rules: { ratio: 1 / 60, maxTeeth: 60 } },
    { id: 'q3', level: 3, mode: 'pulley', setup: { load: 50, h: 2 }, rules: { load: 50, height: 2, maxEffort: 20, maxRope: 8 } },
    { id: 'r2', level: 3, mode: 'ramp', setup: { load: 80, H: 1.2, mu: 0.15 }, rules: { load: 80, height: 1.2, mu: 0.15, maxEffort: 50, minEff: 0.7 } },
    { id: 'k2', level: 3, mode: 'chain', rules: { steps: 6, kinds: 4, fit: true, texts: true } },
    { id: 'p4', level: 4, mode: 'lever', setup: { load: 500 }, rules: { load: 500, maxEffort: 50, maxL: 3 } },
    { id: 'q4', level: 4, mode: 'pulley', setup: { load: 1000, h: 3 }, rules: { load: 1000, height: 3, maxEffort: 250, maxRope: 20 } },
    { id: 'q5', level: 4, mode: 'pulley', setup: { load: 120, h: 2, kind: 'pol2' }, rules: { load: 120, maxEffort: 40, minEff: 0.8 } },
    { id: 'g7', level: 5, mode: 'gears', random: true, rules: {} },
    { id: 'k3', level: 5, mode: 'chain', rules: { steps: 10, kinds: 6, fit: true, texts: true, goal: true } }
  ];
  function chById(id) { for (var i = 0; i < CHALLENGES.length; i++) if (CHALLENGES[i].id === id) return CHALLENGES[i]; return null; }

  IG.defineEngine('maquinas', {
    version: 1, fileBase: LANG === 'en' ? 'machine' : 'maquina',
    extraKeys: ['kmEnter', 'kmTest', 'kmNext', 'kmRotate'],
    initialStart: function (para) { return { child: 'seesaw', teen: 'clock', adult: 'hoist' }[para] || 'chain'; },
    starts: function (ctx) {
      var t = ctx.t;
      return [
        { id: 'seesaw', title: t('stSeesaw'), desc: t('stSeesawD'), para: 'child' },
        { id: 'pulley1', title: t('stPulley1'), desc: t('stPulley1D'), para: 'child' },
        { id: 'clock', title: t('stClock'), desc: t('stClockD'), para: 'teen' },
        { id: 'ramp', title: t('stRamp'), desc: t('stRampD'), para: 'teen' },
        { id: 'hoist', title: t('stHoist'), desc: t('stHoistD'), para: 'adult' },
        { id: 'stone', title: t('stStone'), desc: t('stStoneD'), para: 'adult' },
        { id: 'chain', title: t('stChain'), desc: t('stChainD'), para: 'any' },
        { id: 'train', title: t('stTrain'), desc: t('stTrainD'), para: 'any' }
      ];
    },
    create: function (ctx) { return studio(ctx); }
  });

  function studio(ctx) {
    var t = ctx.t, h = ctx.h, F = ctx.fields, num = ctx.num;
    ctx.setTech('renderer', 'SVG');

    /* ---------- Documento ---------- */
    function blank() {
      return { v: 1, mode: 'gears', challenge: null, seed: 7, hands: false,
        gears: { list: [{ id: 1, x: 0, y: 0, z: 20, layer: 0 }], motorId: 1, rpm: 60, outId: null, nextId: 2, torque: 0.5, eff: 98 },
        lever: { L: 3, f: 1, e: 3, effortOn: true, loads: [{ id: 1, x: 0.2, kg: 60 }], nextId: 2 },
        pulley: { kind: 'fija', load: 50, h: 2 },
        ramp: { L: 4, H: 1, load: 50, mu: 0.3 },
        chain: { parts: [], start: null, kick: 1, seq: 1 } };
    }
    var S = blank();
    var sel = null, tool = 'select', addTeeth = 20, addPart = 'ball';
    var views = {}, kcs = { gears: { x: 0, y: 0 }, lever: { x: 1.5, y: 0 }, pulley: { x: 0, y: 0 }, ramp: { x: 0, y: 0 }, chain: { x: 6, y: 3 } }, kcVisible = false;
    var run = null, runKey = '';            /* última simulación de la máquina en cadena */
    var anim = { t: 0, playing: false, raf: 0, last: 0 };

    function mode() { return S.mode; }
    function r3(v) { return Math.round(v * 1000) / 1000; }
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function kg(v) { return num(v, v < 10 ? 2 : 1) + ' kg'; }
    function newton(v) { return num(v * G, v * G < 100 ? 1 : 0) + ' N'; }
    function metres(v) { return num(v, 2) + ' m'; }
    function pct(v) { return num(v * 100, 0) + ' %'; }
    function fmtRpm(v) { var a = Math.abs(v); return (a >= 1 ? num(a, 2) : num(a, 4)) + ' rpm' + (a < 1 && a > 0 ? ' (' + t('turnEvery', { s: num(60 / a, 1) }) + ')' : ''); }
    function dirWord(v) { return v >= 0 ? t('cw') : t('ccw'); }

    /* ---------- Vista SVG ---------- */
    var svg = D.createElementNS(SVGNS, 'svg'); svg.setAttribute('class', 'igq-svg'); svg.setAttribute('aria-hidden', 'true');
    var world = el('g', {}, svg), overlay = el('g', {}, svg);
    ctx.viewport.appendChild(svg); ctx.viewport.classList.add('igq-viewport');
    var view = new ctx.View2D({ scale: 4, min: 0.05, max: 800, onChange: requestRender });
    ctx.attachViewGestures(ctx.viewport, view, { isPanTool: function () { return tool === 'pan'; } });
    var zoomBox = h('div', { class: 'igs-zoom' },
      ctx.button(t('zoomOut'), { icon: 'minus', onClick: function () { zoomCenter(1 / 1.25); } }),
      ctx.button(t('zoomFit'), { icon: 'fit', onClick: function () { fit(); } }),
      ctx.button(t('zoomIn'), { icon: 'plus', onClick: function () { zoomCenter(1.25); } }));
    var hud = h('div', { class: 'igs-hud' });
    ctx.viewport.append(zoomBox, hud);
    function zoomCenter(f) { view.zoomAt(ctx.viewport.clientWidth / 2, ctx.viewport.clientHeight / 2, f); }
    var frame = 0;
    function requestRender() { if (!frame) frame = root.requestAnimationFrame(function () { frame = 0; render(); }); }
    if (root.ResizeObserver) new ResizeObserver(requestRender).observe(ctx.viewport);

    function el(name, attrs, parent) {
      var e = D.createElementNS(SVGNS, name);
      Object.keys(attrs || {}).forEach(function (k) { if (attrs[k] !== null && attrs[k] !== undefined) e.setAttribute(k, attrs[k]); });
      if (parent) parent.appendChild(e); return e;
    }
    function txt(parent, x, y, s, size, opts) {
      opts = opts || {};
      var e = el('text', { x: x, y: y, 'font-size': size, 'font-family': FONT, 'font-weight': opts.weight || 700, fill: opts.fill || INK, 'text-anchor': opts.anchor || 'middle',
        'dominant-baseline': 'middle', 'paint-order': 'stroke', stroke: opts.halo === false ? 'none' : '#fff', 'stroke-width': size * 0.28, 'stroke-linejoin': 'round' }, parent);
      e.textContent = s; return e;
    }
    var NS = { 'vector-effect': 'non-scaling-stroke' };
    function st(attrs) { return Object.assign({}, NS, attrs); }
    /* ¿El montaje usa el eje y hacia arriba? (palanca, rampa y cadena en metros) */
    function flips(md) { return md === 'lever' || md === 'ramp' || md === 'chain'; }
    function Y(y) { return flips(mode()) ? -y : y; }
    function toModel(sx, sy) { var w = view.toWorld(sx, sy); return { x: w.x, y: flips(mode()) ? -w.y : w.y }; }
    function toScreen(x, y) { return view.toScreen(x, flips(mode()) ? -y : y); }

    /* ---------- Cálculo ---------- */
    function gearById(id) { var L = S.gears.list; for (var i = 0; i < L.length; i++) if (L[i].id === id) return L[i]; return null; }
    function gearRes() {
      var Gs = S.gears, r = M.solveGears(Gs.list, Gs.motorId, Gs.rpm);
      /* engranes desde el motor (para el rendimiento con rozamiento) */
      var meshes = {}; meshes[Gs.motorId] = 0; var q = [Gs.motorId];
      while (q.length) { var id = q.shift(); r.links.forEach(function (l) { var o = l[0] === id ? l[1] : l[1] === id ? l[0] : null; if (o === null || meshes[o] !== undefined) return; meshes[o] = meshes[id] + (l[2] === 'mesh' ? 1 : 0); q.push(o); }); }
      r.meshes = meshes;
      r.realTorque = {}; Object.keys(r.torque).forEach(function (k) { r.realTorque[k] = Gs.torque * r.torque[k] * Math.pow(Gs.eff / 100, meshes[k] || 0); });
      return r;
    }
    function leverRes() {
      var Lv = S.lever, f = Lv.f, net = 0, total = 0, sumAbs = 0;
      Lv.loads.forEach(function (l) { var m = l.kg * (l.x - f); net += m; sumAbs += Math.abs(m); total += l.kg; });
      var main = Lv.loads[0], one = main ? M.lever(Lv.L, f, main.x, Lv.e, main.kg) : null;
      var de = Math.abs(Lv.e - f), out = { net: net, total: total, sumAbs: sumAbs, one: one, kind: one ? one.kind : 1 };
      out.balanced = Math.abs(net) <= Math.max(0.5, 0.02 * sumAbs);
      if (!Lv.effortOn) { out.ok = true; out.noEffort = true; return out; }
      if (de < 1e-6) { out.ok = false; out.reason = 'effortOnFulcrum'; return out; }
      out.ok = true; out.effort = Math.abs(net) / de; out.up = net * (Lv.e - f) > 0;
      out.advantage = out.effort > 1e-9 ? total / out.effort : Infinity;
      return out;
    }
    function pulleyRes() { var P = S.pulley, r = M.pulley(P.kind, P.load, P.h); r.adv = P.load / r.effortKg; r.eff = P.load / (r.effortKg * r.n); return r; }
    function rampRes() {
      var R = S.ramp, th = Math.asin(clamp(R.H / R.L, 0, 1)), s = Math.sin(th), c = Math.cos(th);
      var ideal = R.load * s, real = R.load * (s + R.mu * c);
      return { th: th, base: R.L * c, ideal: ideal, real: real, adv: R.load / Math.max(1e-9, real), eff: s / Math.max(1e-9, s + R.mu * c), workUse: R.load * G * R.H, workDone: real * G * R.L };
    }

    /* ---------- Máquina en cadena: piezas ---------- */
    function parts() { return S.chain.parts; }
    function partById(id) { var L = parts(); for (var i = 0; i < L.length; i++) if (L[i].id === id) return L[i]; return null; }
    function partName(p) {
      if (!p) return '—';
      var n = 0; parts().some(function (q) { if (q.type === p.type) n += 1; return q.id === p.id; });
      return t('part_' + p.type) + ' ' + n;
    }
    function addChainPart(type, x, y) {
      if (parts().length >= 60) { ctx.announce(t('tooMany')); return null; }
      S.chain.seq += 1;
      var p = K.sanitize(Object.assign({ id: 'q' + S.chain.seq, type: type, x: r3(x), y: r3(y) }, K.defaults(type)));
      parts().push(p); p.y = K.settle(parts(), p);
      if (!S.chain.start && K.DYNAMIC[type]) S.chain.start = p.id;
      return p;
    }
    function chainKey() { return JSON.stringify([S.chain.parts, S.chain.start, S.chain.kick]); }
    function runValid() { return run && runKey === chainKey(); }

    /* ---------- Dibujo ---------- */
    function render() {
      while (world.firstChild) world.removeChild(world.firstChild);
      while (overlay.firstChild) overlay.removeChild(overlay.firstChild);
      world.setAttribute('transform', 'translate(' + view.x + ',' + view.y + ') scale(' + view.scale + ')');
      drawScene(world, view.scale, false);
      /* cursor de teclado (en píxeles) */
      if (kcVisible && !anim.playing && mode() !== 'pulley') {
        var kc = kcs[mode()], p = toScreen(kc.x, kc.y);
        el('path', { d: 'M' + (p.x - 12) + ',' + p.y + 'h8M' + (p.x + 4) + ',' + p.y + 'h8M' + p.x + ',' + (p.y - 12) + 'v8M' + p.x + ',' + (p.y + 4) + 'v8', stroke: VIOLET, 'stroke-width': 3, fill: 'none' }, overlay);
        el('circle', { cx: p.x, cy: p.y, r: 10, stroke: VIOLET, 'stroke-width': 1.5, fill: 'none' }, overlay);
      }
      renderHud();
      ctx.viewport.dataset.igqView = [view.x.toFixed(2), view.y.toFixed(2), view.scale.toFixed(4)].join(',');
    }
    function drawScene(g, s, exporting) {
      var md = mode();
      if (md === 'gears') drawGears(g, s, exporting);
      else if (md === 'lever') drawLever(g, s, exporting);
      else if (md === 'pulley') drawPulley(g, s, exporting);
      else if (md === 'ramp') drawRamp(g, s, exporting);
      else drawChain(g, s, exporting);
    }
    function isSel(k, id) { return sel && sel.k === k && (id === undefined || sel.id === id); }

    /* Engranajes (milímetros, y hacia abajo) */
    var gearPathCache = {};
    function gearPath(z) {
      if (gearPathCache[z]) return gearPathCache[z];
      var R = M.radius(z), ro = R + M.MODULE, ri = R - 1.25 * M.MODULE, d = '', step = 2 * Math.PI / z;
      for (var k = 0; k < z; k++) {
        var a0 = k * step;
        [[ri, a0], [ro, a0 + step * 0.2], [ro, a0 + step * 0.5], [ri, a0 + step * 0.7]].forEach(function (q, j) { d += (k === 0 && j === 0 ? 'M' : 'L') + (Math.cos(q[1]) * q[0]).toFixed(2) + ',' + (Math.sin(q[1]) * q[0]).toFixed(2); });
      }
      return (gearPathCache[z] = d + 'Z');
    }
    function gearPhases(r) {
      var Gs = S.gears, ph = {}, q = [Gs.motorId]; ph[Gs.motorId] = 0;
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
      Gs.list.forEach(function (g) { if (ph[g.id] === undefined) ph[g.id] = 0; });
      return ph;
    }
    function drawGears(g, s) {
      var Gs = S.gears, r = gearRes(), ph = gearPhases(r), fs = 13 / s;
      Gs.list.slice().sort(function (a, b) { return a.layer - b.layer; }).forEach(function (gr) {
        var sp = r.speed[gr.id], ang = ph[gr.id] + (sp === undefined ? 0 : sp * anim.t * Math.PI * 2 / 60), R = M.radius(gr.z);
        var gg = el('g', { transform: 'translate(' + gr.x + ',' + gr.y + ') rotate(' + (ang * 180 / Math.PI).toFixed(3) + ')', 'data-sel': 'gear:' + gr.id }, g);
        el('path', st({ d: gearPath(gr.z), fill: sp === undefined ? '#eceff3' : LAYER_COL[gr.layer % 4], 'fill-opacity': gr.layer > 0 ? 0.93 : 1, stroke: isSel('gear', gr.id) ? VIOLET : NAVY, 'stroke-width': isSel('gear', gr.id) ? 3 : 1.4 }), gg);
        el('circle', st({ r: Math.max(1.6, R * 0.16), fill: '#fff', stroke: NAVY, 'stroke-width': 1.4 }), gg);
        el('line', st({ x1: 0, y1: 0, x2: (R - 3) * 0.85, y2: 0, stroke: MAG, 'stroke-width': 2.5 }), gg);
        if (S.hands && (gr.id === Gs.motorId || gr.id === Gs.outId)) {
          var long = gr.id === Gs.motorId, hl = long ? R * 1.6 + 14 : R * 1.1 + 8;
          el('line', st({ x1: 0, y1: 0, x2: 0, y2: -hl, stroke: long ? '#1f5f8b' : INK, 'stroke-width': long ? 3 : 5, 'stroke-linecap': 'round', transform: 'rotate(' + (-(ph[gr.id]) * 180 / Math.PI).toFixed(3) + ')' }), gg);
        }
        if (isSel('gear', gr.id)) el('circle', st({ r: R + M.MODULE + 3, fill: 'none', stroke: VIOLET, 'stroke-width': 2, 'stroke-dasharray': '6 4' }), gg);
        var tag = String(gr.id) + (gr.id === Gs.motorId ? ' · ' + t('motorShort') : gr.id === Gs.outId ? ' · ' + t('outShort') : '');
        txt(g, gr.x, gr.y + R * 0.45 + fs * 0.2, tag, fs);
      });
      r.collisions.forEach(function (p) { var a = gearById(p[0]), b = gearById(p[1]); el('line', st({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: BAD, 'stroke-width': 3, 'stroke-dasharray': '7 5' }), g); });
      if (r.jam) Gs.list.forEach(function (gr) { el('circle', st({ cx: gr.x, cy: gr.y, r: M.radius(gr.z) + 5, fill: 'none', stroke: BAD, 'stroke-width': 2, 'stroke-dasharray': '3 4' }), g); });
    }
    function gearsBounds() {
      var b = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
      S.gears.list.forEach(function (gr) { var R = M.radius(gr.z) + 6 + (S.hands ? M.radius(gr.z) * 0.7 + 14 : 0); b.minX = Math.min(b.minX, gr.x - R); b.maxX = Math.max(b.maxX, gr.x + R); b.minY = Math.min(b.minY, gr.y - R); b.maxY = Math.max(b.maxY, gr.y + R); });
      if (!isFinite(b.minX)) b = { minX: -40, minY: -40, maxX: 40, maxY: 40 };
      return b;
    }

    /* Palanca (metros, y hacia arriba) */
    function leverTilt() {
      var lr = leverRes(), target;
      if (S.lever.effortOn) target = lr.ok && lr.effort > 1e-6 ? (lr.net > 0 ? 1 : -1) * 10 : 0;
      else target = lr.balanced ? 0 : (lr.net > 0 ? -1 : 1) * 12;
      return target * clamp(anim.t / 1.2, 0, 1);
    }
    function drawLever(g, s) {
      var Lv = S.lever, lr = leverRes(), fs = 13 / s, th = leverTilt() * Math.PI / 180, f = Lv.f;
      function rot(x, y) { var dx = x - f, c = Math.cos(th), sn = Math.sin(th); return { x: f + dx * c - y * sn, y: dx * sn + y * c }; }
      /* suelo y regla */
      el('line', st({ x1: -0.5, y1: 0.42, x2: Lv.L + 0.5, y2: 0.42, stroke: '#8aa0b5', 'stroke-width': 2 }), g);
      for (var m = 0; m <= Lv.L + 1e-9; m += 0.5) { el('line', st({ x1: m, y1: 0.5, x2: m, y2: 0.58, stroke: '#46566b', 'stroke-width': 1 }), g); txt(g, m, 0.7, num(m, 1) + ' m', fs * 0.85, { weight: 600, fill: '#44586c' }); }
      /* apoyo */
      el('path', st({ d: 'M' + f + ',0.04 L' + (f - 0.14) + ',0.42 L' + (f + 0.14) + ',0.42Z', fill: isSel('fulcrum') ? VIOLET : NAVY, stroke: isSel('fulcrum') ? VIOLET : NAVY, 'stroke-width': 1, 'data-sel': 'fulcrum' }), g);
      /* tabla */
      var a = rot(0, 0), b = rot(Lv.L, 0);
      el('line', { x1: a.x, y1: -a.y, x2: b.x, y2: -b.y, stroke: isSel('plank') ? VIOLET : '#8d5b3a', 'stroke-width': 0.08, 'stroke-linecap': 'round', 'data-sel': 'plank' }, g);
      /* cargas */
      Lv.loads.forEach(function (l, i) {
        var side = Math.min(0.5, 0.18 + Math.sqrt(l.kg) * 0.02), p = rot(l.x, 0.04 + side / 2);
        var gg = el('g', { transform: 'translate(' + p.x + ',' + (-p.y) + ') rotate(' + (-th * 180 / Math.PI) + ')', 'data-sel': 'load:' + l.id }, g);
        el('rect', st({ x: -side / 2, y: -side / 2, width: side, height: side, rx: side * 0.08, fill: '#5d6877', stroke: isSel('load', l.id) ? VIOLET : INK, 'stroke-width': isSel('load', l.id) ? 3 : 1 }), gg);
        txt(g, p.x, -p.y - side / 2 - fs * 0.8, (Lv.loads.length > 1 ? t('loadShort', { n: i + 1 }) + ' · ' : '') + num(l.kg, 0) + ' kg', fs);
      });
      /* fuerza */
      if (Lv.effortOn) {
        var up = lr.ok && lr.up, e = rot(Lv.e, 0), dir = up ? 1 : -1, y0 = -e.y + (up ? 0.12 : -0.12), y1 = y0 + (up ? 0.55 : -0.55);
        var eg = el('g', { 'data-sel': 'effort' }, g), col = isSel('effort') ? VIOLET : MAG;
        el('line', st({ x1: e.x, y1: y1, x2: e.x, y2: y0 + (up ? 0.06 : -0.06), stroke: col, 'stroke-width': 4 }), eg);
        el('path', { d: 'M' + e.x + ',' + y0 + ' l-0.07,' + (0.13 * dir) + ' l0.14,0 Z', fill: col }, eg);
        el('rect', { x: e.x - 0.15, y: Math.min(y0, y1) - 0.05, width: 0.3, height: Math.abs(y1 - y0) + 0.1, fill: 'transparent' }, eg);
        txt(g, e.x, y1 + (up ? 0.1 : -0.1) + (up ? fs * 0.5 : -fs * 0.5), lr.ok ? kg(lr.effort) : '—', fs);
      }
    }
    function leverBounds() { return { minX: -0.5, maxX: S.lever.L + 0.5, minY: -1.5, maxY: 0.9 }; }

    /* Poleas (unidades de dibujo, y hacia abajo) — misma disposición que el estudio antiguo */
    function pulleyLift() { return clamp(anim.t / 2.5, 0, 1); }
    function drawPulley(g, s) {
      var P = S.pulley, r = M.pulley(P.kind, P.load, P.h), def = M.PULLEYS[P.kind], fs = 13 / s;
      var W = 420, R = 22, n = def.fixed + def.moving, topY = 70, beamY = 26, lift = pulleyLift() * 70, botY0 = 250, botY = botY0 - lift;
      var startBottom = r.n % 2 === 0, seq = [];
      for (var k = 0; k < n; k++) seq.push((k % 2 === 0) === startBottom ? 'bot' : 'top');
      var x0 = W / 2 - (n - 1) * R, xs = seq.map(function (_, k) { return x0 + k * 2 * R; });
      var yOf = function (k) { return seq[k] === 'top' ? topY : botY; };
      el('rect', { x: x0 - R - 40, y: beamY - 12, width: (n - 1) * 2 * R + 2 * R + 80, height: 12, fill: '#5d6877' }, g);
      xs.forEach(function (x, k) { if (seq[k] === 'top') el('line', st({ x1: x, y1: beamY, x2: x, y2: topY, stroke: NAVY, 'stroke-width': 2.5 }), g); });
      var bots = xs.filter(function (_, k) { return seq[k] === 'bot'; }), blockY = botY + R + 16, loadX = W / 2, loadY = blockY + 24;
      if (bots.length) {
        bots.forEach(function (x) { el('line', st({ x1: x, y1: botY, x2: x, y2: blockY, stroke: NAVY, 'stroke-width': 2.5 }), g); });
        var bl = Math.min(bots[0], loadX, startBottom ? Infinity : x0 - R), br = Math.max(bots[bots.length - 1], loadX);
        el('rect', { x: bl - 6, y: blockY - 3, width: br - bl + 12, height: 6, fill: NAVY }, g);
        el('line', st({ x1: loadX, y1: blockY, x2: loadX, y2: loadY, stroke: NAVY, 'stroke-width': 2.5 }), g);
      } else { loadX = x0 - R; loadY = botY; }
      var d = '', ax = x0 - R;
      d += 'M' + ax + ',' + (startBottom ? beamY : (bots.length ? blockY : loadY));
      xs.forEach(function (x, k) { var y = yOf(k); d += 'L' + (x - R) + ',' + y + 'A' + R + ',' + R + ' 0 0,' + (seq[k] === 'top' ? 1 : 0) + ' ' + (x + R) + ',' + y; });
      var last = n - 1, hx = xs[last] + R, pullUp = seq[last] === 'bot', pulled = lift * r.n;
      var hy = pullUp ? beamY + 8 : 372 + Math.min(56, pulled * 0.4);
      d += 'L' + hx + ',' + hy;
      el('path', st({ d: d, fill: 'none', stroke: '#8a4b00', 'stroke-width': 3 }), g);
      if (startBottom) el('rect', { x: ax - 4, y: beamY, width: 8, height: 5, fill: '#8a4b00' }, g);
      xs.forEach(function (x, k) { var y = yOf(k); el('circle', st({ cx: x, cy: y, r: R - 4, fill: '#fff', stroke: NAVY, 'stroke-width': 2 }), g); el('circle', { cx: x, cy: y, r: 4, fill: NAVY }, g); });
      /* marca de la cuerda recogida */
      if (lift > 0) txt(g, hx + 60, pullUp ? hy + 50 : hy - 30, t('ropePulled', { m: num(r.rope * pulleyLift(), 1) }), fs * 0.9, { weight: 600, fill: '#8a4b00', anchor: 'start' });
      var tip = pullUp ? 'M' + hx + ',' + (hy - 10) + ' l-8,16 l16,0Z' : 'M' + hx + ',' + (hy + 12) + ' l-8,-16 l16,0Z';
      el('path', { d: tip, fill: isSel('effortP') ? VIOLET : MAG, 'data-sel': 'effortP' }, g);
      txt(g, hx + 12, pullUp ? hy + 22 : hy + 4, kg(r.effortKg), fs, { anchor: 'start' });
      var lg = el('g', { 'data-sel': 'pload' }, g);
      el('rect', st({ x: loadX - 34, y: loadY, width: 68, height: 46, rx: 4, fill: '#5d6877', stroke: isSel('pload') ? VIOLET : INK, 'stroke-width': isSel('pload') ? 3 : 1 }), lg);
      txt(g, loadX, loadY + 23, num(P.load, 0) + ' kg', fs, { fill: '#fff', halo: false });
      /* suelo y altura */
      el('line', st({ x1: 20, y1: 440, x2: W - 20, y2: 440, stroke: '#8aa0b5', 'stroke-width': 2 }), g);
      txt(g, 20, 8, t(r.n === 1 ? 'ropes1' : 'ropesN', { n: r.n }), fs, { anchor: 'start', weight: 600 });
    }
    function pulleyBounds() { return { minX: 0, maxX: 460, minY: -8, maxY: 455 }; }

    /* Rampa (metros, y hacia arriba) */
    function drawRamp(g, s) {
      var R = S.ramp, rr = rampRes(), fs = 13 / s, b = rr.base, th = rr.th;
      el('line', st({ x1: -0.6, y1: 0, x2: b + 1.4, y2: 0, stroke: '#8aa0b5', 'stroke-width': 2 }), g);
      el('path', st({ d: 'M0,0 L' + b + ',0 L' + b + ',' + (-R.H) + 'Z', fill: isSel('ramp') ? '#e7e2f8' : '#e9dcc6', stroke: isSel('ramp') ? VIOLET : '#8d5b3a', 'stroke-width': isSel('ramp') ? 3 : 1.5, 'data-sel': 'ramp' }), g);
      el('rect', st({ x: b, y: -R.H, width: 1.2, height: R.H, fill: '#dfe6ee', stroke: '#8aa0b5', 'stroke-width': 1 }), g);
      /* caja sobre la rampa: sube a lo largo de la pendiente al probar */
      var side = clamp(0.25 + Math.sqrt(R.load) * 0.03, 0.3, 0.7), u = clamp(anim.t / 2.5, 0, 1), s0 = side / 2 + 0.05, s1 = Math.max(s0, R.L - side / 2 - 0.05), sAlong = s0 + u * (s1 - s0);
      var cth = Math.cos(th), sth = Math.sin(th), cx = sAlong * cth, cy = sAlong * sth;
      function W(uu, vv) { return [cx + uu * cth - vv * sth, -(cy + uu * sth + vv * cth)]; }
      var gg = el('g', { transform: 'translate(' + cx + ',' + (-cy) + ') rotate(' + (-th * 180 / Math.PI) + ')', 'data-sel': 'rload' }, g);
      el('rect', st({ x: -side / 2, y: -side, width: side, height: side, fill: '#8a4b00', stroke: isSel('rload') ? VIOLET : INK, 'stroke-width': isSel('rload') ? 3 : 1 }), gg);
      el('line', st({ x1: -side / 2 - 0.7, y1: -side / 2, x2: -side / 2 - 0.12, y2: -side / 2, stroke: MAG, 'stroke-width': 4 }), gg);
      el('path', { d: 'M' + (-side / 2 - 0.02) + ',' + (-side / 2) + ' l-0.16,-0.08 l0,0.16Z', fill: MAG }, gg);
      var lp = W(-side / 2 - 0.45, side / 2 + 0.3), cp = W(0, side / 2);
      txt(g, lp[0], lp[1], kg(rr.real), fs, { fill: MAG });
      txt(g, cp[0], cp[1], num(R.load, 0) + ' kg', fs * 0.9, { fill: '#fff', halo: false });
      /* cotas */
      txt(g, b + 1.25, -R.H / 2, metres(R.H), fs, { anchor: 'start', fill: MAG });
      txt(g, b / 2, 0.25, t('rampBase', { m: metres(b) }), fs * 0.9, { weight: 600, fill: '#44586c' });
      txt(g, b * 0.62 - Math.sin(th) * 0.45, -(R.H * 0.62 + Math.cos(th) * 0.45), t('rampLen', { m: metres(R.L), a: num(th * 180 / Math.PI, 1) }), fs * 0.9, { fill: MAG });
    }
    function rampBounds() { var b = rampRes().base; return { minX: -0.8, maxX: b + 2.4, minY: -S.ramp.H - 1.3, maxY: 0.6 }; }

    /* Máquina en cadena (metros, y hacia arriba) */
    function poseOf(p) {
      if (runValid() && K.DYNAMIC[p.type]) {
        var k = run.dyn.indexOf(p.id), fi = Math.min(run.frames.length - 1, Math.max(0, Math.floor(anim.t * run.fps)));
        if (k >= 0) { var f = run.frames[fi]; return { x: f[k * 3], y: f[k * 3 + 1], a: f[k * 3 + 2] }; }
      }
      return { x: p.x, y: p.y, a: K.angleOf(p) };
    }
    function drawChain(g, s, exporting) {
      var fs = 13 / s;
      /* banco: fondo con cuadrícula de 1 m */
      el('rect', { x: 0, y: -K.H, width: K.W, height: K.H, fill: '#fbfcfe' }, g);
      for (var gx = 0; gx <= K.W; gx++) el('line', st({ x1: gx, y1: -K.H, x2: gx, y2: 0, stroke: '#e3ebf2', 'stroke-width': 1 }), g);
      for (var gy = 0; gy <= K.H; gy++) el('line', st({ x1: 0, y1: -gy, x2: K.W, y2: -gy, stroke: '#e3ebf2', 'stroke-width': 1 }), g);
      el('rect', { x: -0.2, y: 0, width: K.W + 0.4, height: 0.25, fill: '#b9c4b0' }, g);
      el('line', st({ x1: -0.2, y1: 0, x2: K.W + 0.2, y2: 0, stroke: '#5d6e57', 'stroke-width': 2 }), g);
      [-0.1, K.W + 0.1].forEach(function (x) { el('rect', { x: x - 0.1, y: -K.H, width: 0.2, height: K.H, fill: '#c9d8e6' }, g); });
      var stepOf = {}; if (runValid()) run.steps.forEach(function (sp) { if (sp.t <= anim.t + 1e-6) stepOf[sp.id] = sp.n; });
      parts().forEach(function (p) {
        var pose = poseOf(p), selected = isSel('part', p.id), col = PART_COL[p.type];
        var gg = el('g', { transform: 'translate(' + pose.x + ',' + (-pose.y) + ') rotate(' + (-pose.a * 180 / Math.PI) + ')', 'data-sel': 'part:' + p.id }, g);
        K.shapes(p).forEach(function (sh) {
          if (sh.sensor) return;
          var common = { fill: p.type === 'domino' ? '#f4f1ea' : col, stroke: selected ? VIOLET : INK, 'stroke-width': selected ? 3 : 1.2 };
          if (sh.k === 'circle') el('circle', st(Object.assign({ cx: sh.x, cy: -sh.y, r: sh.r }, common)), gg);
          else el('rect', st(Object.assign({ x: sh.x - sh.w / 2, y: -sh.y - sh.h / 2, width: sh.w, height: sh.h, rx: p.type === 'domino' ? 0.02 : 0 }, common)), gg);
        });
        if (p.type === 'domino') { el('line', st({ x1: -0.04, y1: 0, x2: 0.04, y2: 0, stroke: INK, 'stroke-width': 1 }), gg); el('circle', { cx: 0, cy: -p.h * 0.25, r: 0.018, fill: INK }, gg); el('circle', { cx: 0, cy: p.h * 0.25, r: 0.018, fill: INK }, gg); }
        if (p.type === 'spring') { var dz = ''; for (var i = 0; i <= 8; i++) dz += (i ? 'L' : 'M') + (-p.w / 2 + 0.1 + i * (p.w - 0.2) / 8) + ',' + (0.1 + (i % 2 ? 0.12 : 0.02)); el('path', st({ d: dz, fill: 'none', stroke: INK, 'stroke-width': 1.5 }), gg); }
        /* ejes fijos */
        if (p.type === 'lever' || p.type === 'pendulum' || p.type === 'wheel') {
          if (p.type === 'lever') el('path', st({ d: 'M' + p.x + ',' + (-p.y + 0.06) + ' l-0.16,0.34 l0.32,0Z', fill: NAVY, stroke: NAVY, 'stroke-width': 1 }), g);
          el('circle', st({ cx: p.x, cy: -p.y, r: 0.05, fill: '#fff', stroke: NAVY, 'stroke-width': 2 }), g);
        }
        if (p.id === S.chain.start && !exporting) { var bb = K.bounds(p); txt(g, (bb.minX + bb.maxX) / 2, -bb.maxY - fs * 1.1, '▶ ' + t('startTag'), fs, { fill: '#1d6b3a' }); }
        if (stepOf[p.id]) { el('circle', st({ cx: pose.x, cy: -pose.y, r: fs * 0.8, fill: '#1d6b3a', stroke: '#fff', 'stroke-width': 1.5 }), g); txt(g, pose.x, -pose.y, String(stepOf[p.id]), fs * 0.8, { fill: '#fff', halo: false }); }
      });
    }
    function chainBounds() { return { minX: -0.3, maxX: K.W + 0.3, minY: -K.H - 0.3, maxY: 0.5 }; }

    function boundsOf(md) { return { gears: gearsBounds, lever: leverBounds, pulley: pulleyBounds, ramp: rampBounds, chain: chainBounds }[md](); }
    function fit() { var b = boundsOf(mode()); view.fit(b, ctx.viewport.clientWidth || 600, ctx.viewport.clientHeight || 400, 24); views[mode()] = { x: view.x, y: view.y, scale: view.scale }; }
    function renderHud() {
      ctx.clear(hud);
      hud.appendChild(h('span', { text: t('mode_' + mode()) }));
      if (anim.playing) hud.appendChild(h('span', { text: mode() === 'gears' && anim.factor && Math.abs(anim.factor - 1) > 0.01 ? t(anim.factor < 1 ? 'slowMo' : 'fastFwd', { f: num(anim.factor < 1 ? 1 / anim.factor : anim.factor, 1) }) : t('playing') }));
      var ch = chById(S.challenge);
      if (ch && ch.mode === mode()) { var ck = checks(ch); hud.appendChild(h('span', { text: ck.all ? '✓ ' + t('chDone') : t('chProgress', { a: ck.list.filter(function (x) { return x[0]; }).length, b: ck.list.length }) })); }
    }

    /* ---------- Animación (solo al pulsar Probar) ---------- */
    function animEnd() {
      var md = mode();
      if (md === 'gears') return Infinity;
      if (md === 'lever') return 1.2;
      if (md === 'pulley' || md === 'ramp') return 2.5;
      return runValid() ? run.duration : 0;
    }
    function gearFactor() {
      var r = gearRes(), mx = 0; Object.keys(r.speed).forEach(function (k) { mx = Math.max(mx, Math.abs(r.speed[k])); });
      if (!mx) return 1;
      return mx > 20 ? 20 / mx : mx < 5 ? 5 / mx : 1;
    }
    function play() {
      if (anim.playing) return;
      if (mode() !== 'gears' && anim.t >= animEnd() - 1e-6) anim.t = 0;
      anim.playing = true; anim.last = 0; anim.factor = mode() === 'gears' ? gearFactor() : 1;
      anim.raf = root.requestAnimationFrame(loop); syncTest(); ctx.announce(t('playing'));
    }
    function stop(silent) { if (!anim.playing) return; anim.playing = false; root.cancelAnimationFrame(anim.raf); syncTest(); if (!silent) { ctx.announce(t('stopped')); renderSide(); } }
    function loop(now) {
      if (!anim.playing) return;
      var dt = anim.last ? Math.min(0.05, (now - anim.last) / 1000) : 0; anim.last = now;
      anim.t += dt * (mode() === 'gears' ? anim.factor : 1);
      if (mode() === 'gears') anim.t %= 3600;
      var end = animEnd();
      if (anim.t >= end) { anim.t = end; render(); anim.playing = false; syncTest(); renderSide(); ctx.announce(t('testDone')); return; }
      render(); anim.raf = root.requestAnimationFrame(loop);
    }
    /* Movimiento reducido: un paso por pulsación. */
    function stepForward() {
      var md = mode();
      if (md === 'gears') { var r = gearRes(), sp = Math.abs(S.gears.rpm) || 1; anim.t = (anim.t + 60 / sp / 8) % 3600; ctx.announce(t('stepGears')); }
      else if (md === 'chain') {
        if (!runValid()) return;
        var next = run.steps.filter(function (s2) { return s2.t > anim.t + 1e-6; })[0];
        anim.t = next ? Math.min(run.duration, next.t + 0.25) : run.duration;
        ctx.announce(next ? stepText(next) : t('testDone'));
      } else { var end = animEnd(); anim.t = anim.t >= end - 1e-6 ? 0 : Math.min(end, anim.t + end / 4); ctx.announce(t('stepN', { p: Math.round(anim.t / end * 100) })); }
      render(); renderSide();
    }
    function stepBack() {
      if (mode() !== 'chain' || !runValid()) { anim.t = 0; render(); renderSide(); return; }
      var prev = run.steps.filter(function (s2) { return s2.t + 0.25 < anim.t - 1e-6; }).pop();
      anim.t = prev ? prev.t + 0.25 : 0; render(); renderSide(); if (prev) ctx.announce(stepText(prev));
    }
    function test() {
      if (anim.playing) { stop(); return; }
      if (mode() === 'chain' && !runValid()) { simulate(true); return; }
      if (ctx.reducedMotion()) stepForward(); else play();
    }
    var simBusy = false;
    function simulate(thenPlay) {
      if (simBusy) return; simBusy = true;
      if (!parts().some(function (p) { return K.DYNAMIC[p.type]; })) { simBusy = false; ctx.announce(t('noMoving')); ctx.setStatus(t('noMoving')); return; }
      ctx.setStatus(t('simulating'));
      ctx.load(['planck']).then(function () {
        ctx.setTech('physics', 'Planck.js (Box2D, JavaScript)');
        run = K.simulate(root.planck, S.chain, {}); runKey = chainKey(); anim.t = 0; simBusy = false;
        var msg = t('simDone', { n: run.steps.length, s: num(run.duration, 1) }) + (run.goal ? ' ' + t('goalReached') : '');
        ctx.setStatus(msg); ctx.announce(msg);
        renderSide(); updateSummary(); syncTest();
        if (thenPlay) { if (ctx.reducedMotion()) { render(); renderSide(); } else play(); }
      }).catch(function () { simBusy = false; ctx.setStatus(t('physicsError')); ctx.announce(t('physicsError')); });
    }
    function stepText(sp) {
      var p = partById(sp.id), by = sp.by ? partById(sp.by) : null;
      if (sp.what === 'start') return t('stepStart', { n: sp.n, p: partName(p) });
      if (sp.what === 'goal') return t('stepGoal', { n: sp.n, p: partName(p), by: partName(by) });
      if (sp.what === 'touch') return t('stepTouch', { n: sp.n, p: partName(p), by: partName(by) });
      return by ? t('stepBy', { n: sp.n, p: partName(p), by: partName(by) }) : t('stepSelf', { n: sp.n, p: partName(p) });
    }
    var testBtn = null;
    function syncTest() {
      if (!testBtn) return;
      var red = ctx.reducedMotion();
      testBtn.setAttribute('aria-pressed', String(anim.playing));
      testBtn.querySelector('.igs-btn-label').textContent = anim.playing ? t('stop') : red && !(mode() === 'chain' && !runValid()) ? t('stepBtn') : t('test');
      renderHud();
    }

    /* ---------- Retos ---------- */
    function applyChallenge(id) {
      stop(true);
      var ch = chById(id); S.challenge = ch ? ch.id : null;
      if (!ch) return;
      setMode(ch.mode, true);
      var su = ch.setup || {};
      if (ch.mode === 'lever') {
        if (su.seesaw) { S.lever = { L: 3, f: 1.5, e: 3, effortOn: false, loads: [{ id: 1, x: 0.3, kg: 30 }, { id: 2, x: 2.9, kg: 20 }], nextId: 3 }; }
        else { S.lever.effortOn = true; S.lever.L = Math.min(S.lever.L, 3); if (su.load) { if (!S.lever.loads.length) S.lever.loads.push({ id: S.lever.nextId++, x: 0.2, kg: su.load }); S.lever.loads = S.lever.loads.slice(0, 1); S.lever.loads[0].kg = su.load; } }
      }
      if (ch.mode === 'pulley') { if (su.load) S.pulley.load = su.load; if (su.h) S.pulley.h = su.h; if (su.kind) S.pulley.kind = su.kind; }
      if (ch.mode === 'ramp') { ['load', 'H', 'mu'].forEach(function (k) { if (su[k] !== undefined) S.ramp[k] = su[k]; }); if (S.ramp.L <= S.ramp.H) S.ramp.L = S.ramp.H + 1; }
    }
    function randomSpec() { return M.randomRatio(S.seed); }
    function checks(ch) {
      var R = ch.rules || {}, out = [];
      function add(ok, text) { out.push([!!ok, text]); }
      if (ch.mode === 'gears') {
        var Gs = S.gears, r = gearRes(), o = Gs.outId && r.speed[Gs.outId] !== undefined ? r.speed[Gs.outId] : null, rs = ch.random ? randomSpec() : null;
        add(!r.jam && !r.collisions.length, t('chkFree'));
        add(o !== null, t('chkOut'));
        var want = R.ratio !== undefined ? R.ratio : rs ? rs.ratio : null, same = R.sameDir !== undefined ? R.sameDir : rs ? rs.sameDir : null;
        if (want !== null) { var got = o !== null ? Math.abs(o / Gs.rpm) : null, fr = M.ratioFrac(want); add(got !== null && Math.abs(got - want) < want * 0.005, t('chkRatio', { p: fr[0], q: fr[1], g: got === null ? '—' : num(got, 4) })); }
        if (same !== null) add(o !== null && (o * Gs.rpm > 0) === same, same ? t('chkSameDir') : t('chkOppDir'));
        if (R.minTorque) add(o !== null && r.torque[Gs.outId] >= R.minTorque, t('chkTorque', { m: R.minTorque, g: o !== null ? num(r.torque[Gs.outId], 2) : '—' }));
        if (R.maxTeeth) add(Gs.list.every(function (gr) { return gr.z <= R.maxTeeth; }), t('chkMaxTeeth', { m: R.maxTeeth }));
      } else if (ch.mode === 'lever') {
        var Lv = S.lever, lr = leverRes();
        if (R.balance) { add(Lv.loads.length >= 2, t('chkTwoLoads')); add(lr.balanced && Lv.loads.length >= 2, t('chkBalance', { m: num(lr.net, 1) })); }
        if (R.load) add(Lv.loads.length && Lv.loads[0].kg >= R.load, t('chkLoad', { m: R.load }));
        if (R.maxL) add(Lv.L <= R.maxL + 1e-9, t('chkMaxL', { m: R.maxL }));
        if (R.maxEffort) add(Lv.effortOn && lr.ok && lr.effort <= R.maxEffort + 1e-9, t('chkEffort', { m: R.maxEffort, g: lr.ok && Lv.effortOn ? num(lr.effort, 1) : '—' }));
        if (R.kind) add(lr.one && lr.one.ok && lr.one.kind === R.kind && Lv.loads.length === 1, t('chkKind', { k: R.kind }));
      } else if (ch.mode === 'pulley') {
        var P = S.pulley, pr = pulleyRes();
        if (R.load) add(P.load >= R.load, t('chkLoad', { m: R.load }));
        if (R.height) add(P.h >= R.height, t('chkHeight', { m: R.height }));
        if (R.maxEffort) add(pr.effortKg <= R.maxEffort + 1e-9, t('chkEffort', { m: R.maxEffort, g: num(pr.effortKg, 1) }));
        if (R.maxRope) add(pr.rope <= R.maxRope + 1e-9, t('chkRope', { m: R.maxRope, g: num(pr.rope, 1) }));
        if (R.minEff) add(pr.eff >= R.minEff, t('chkEff', { m: Math.round(R.minEff * 100), g: num(pr.eff * 100, 0) }));
      } else if (ch.mode === 'ramp') {
        var Rp = S.ramp, rr = rampRes();
        if (R.load) add(Rp.load >= R.load, t('chkLoad', { m: R.load }));
        if (R.height) add(Rp.H >= R.height - 1e-9, t('chkHeight', { m: R.height }));
        if (R.mu !== undefined) add(Rp.mu >= R.mu - 1e-9, t('chkMu', { m: num(R.mu, 2) }));
        if (R.maxEffort) add(rr.real <= R.maxEffort + 1e-9, t('chkEffort', { m: R.maxEffort, g: num(rr.real, 1) }));
        if (R.minEff) add(rr.eff >= R.minEff, t('chkEff', { m: Math.round(R.minEff * 100), g: num(rr.eff * 100, 0) }));
      } else {
        var ok = runValid();
        add(ok, t('chkRun'));
        var stepsN = ok ? run.steps.length : 0;
        if (R.steps) add(ok && stepsN >= R.steps, t('chkSteps', { m: R.steps, n: stepsN }));
        if (R.fit) add(ok && !run.selfMoved.length && !run.unused.length, t('chkFit', { b: ok ? run.selfMoved.length + run.unused.length : '—' }));
        if (R.kinds) { var kinds = ok ? M.checkChain(run.steps.map(function (sp) { var p = partById(sp.id); return { part: K.OLD_PART[p.type], inp: 'x', out: 'x' }; })).kinds : 0; add(ok && kinds >= R.kinds, t('chkKinds', { m: R.kinds, n: kinds })); }
        if (R.texts) add(ok && run.steps.every(function (sp) { var p = partById(sp.id); return p && p.note.trim().length > 3; }), t('chkTexts'));
        if (R.goal) add(ok && run.goal, t('chkGoal'));
      }
      return { list: out, all: out.length > 0 && out.every(function (x) { return x[0]; }) };
    }
    function challengeBlock() {
      var box = h('div', { class: 'igq-challenge' });
      box.appendChild(h('h4', { text: t('challenge') }));
      var id = 'igq-ch-sel', s2 = h('select', { id: id });
      s2.appendChild(h('option', { value: '', text: t('freeMode') }));
      [1, 2, 3, 4, 5].forEach(function (lv) {
        var og = h('optgroup', { label: t('levelN', { n: lv }) + ' · ' + t('lvl' + lv) });
        CHALLENGES.filter(function (c) { return c.level === lv; }).forEach(function (c) { og.appendChild(h('option', { value: c.id, text: t('ch_' + c.id) + ' · ' + t('mode_' + c.mode) })); });
        s2.appendChild(og);
      });
      s2.value = S.challenge || '';
      s2.addEventListener('change', function () { applyChallenge(s2.value || null); changed(s2.value ? t('chPicked', { t: t('ch_' + s2.value) }) : t('freeMode'), false, true); fit(); var f = D.getElementById(id); if (f) f.focus(); });
      box.appendChild(h('div', { class: 'igs-field' }, h('label', { for: id, text: t('chooseChallenge') }), s2));
      var ch = chById(S.challenge);
      if (!ch) { box.appendChild(h('p', { class: 'igs-muted', text: t('freeModeText') })); return box; }
      box.appendChild(h('p', { class: 'igq-goal', text: t('chg_' + ch.id) }));
      if (ch.random) {
        var rs = randomSpec();
        box.appendChild(h('p', { class: 'igs-note', text: t('randomGoal', { p: rs.num, q: rs.den, d: rs.sameDir ? t('sameDir') : t('oppDir') }) }));
        box.appendChild(h('div', { class: 'igs-actions' }, ctx.button(t('anotherRatio'), { icon: 'rotate', onClick: function () { S.seed = (Math.imul(S.seed, 1103515245) + 12345) >>> 0; changed(t('newRatio')); } })));
      }
      if (ch.mode !== mode()) { box.appendChild(h('div', { class: 'igs-actions' }, ctx.button(t('goToMode', { m: t('mode_' + ch.mode) }), { onClick: function () { setMode(ch.mode); } }))); return box; }
      var ck = checks(ch);
      box.appendChild(h('p', { class: 'igs-result', 'data-kind': ck.all ? 'ok' : 'bad' }, h('strong', { text: ck.all ? t('chDone') : t('chNotYet') })));
      var ul = h('ul', { class: 'igq-checks' });
      ck.list.forEach(function (x) { ul.appendChild(h('li', { 'data-ok': String(x[0]) }, h('span', { class: 'igq-mark', 'aria-hidden': 'true', text: x[0] ? '✓' : '·' }), h('span', { class: 'igs-sr', text: (x[0] ? t('okWord') : t('pendingWord')) + ': ' }), x[1])); });
      box.appendChild(ul);
      box.appendChild(h('p', { class: 'igs-muted' }, h('strong', { text: t('tip') + ': ' }), t('cht_' + ch.id)));
      return box;
    }

    /* ---------- Estructura e inspector ---------- */
    function setMode(md, quiet) {
      if (MODES.indexOf(md) < 0 || md === mode() && !quiet) { if (!quiet) fit(); return; }
      stop(true); views[mode()] = { x: view.x, y: view.y, scale: view.scale };
      S.mode = md; sel = null; anim.t = 0;
      setToolsFor(); renderSide(); updateSummary();
      var v = views[md]; if (v) { view.x = v.x; view.y = v.y; view.scale = v.scale; view.onChange(); } else fit();
      if (!quiet) { ctx.announce(t('mode_' + md)); ctx.commit(t('mode_' + md)); }
    }
    function listButton(label, small, current, onClick, swatch) {
      var b = h('button', { type: 'button', 'aria-current': String(!!current) }, swatch ? h('span', { class: 'igs-swatch', style: 'background:' + swatch }) : null, h('span', { text: label }), small ? h('small', { text: small }) : null);
      b.addEventListener('click', onClick); return h('li', null, b);
    }
    /* Al rehacer los paneles, el foco vuelve al mismo control (mismo nombre visible). */
    function focusKey() {
      var a = D.activeElement; if (!a || a === D.body) return null;
      var box = ctx.inspector.contains(a) ? ctx.inspector : ctx.structure.contains(a) ? ctx.structure : null; if (!box) return null;
      var lab = a.id ? box.querySelector('label[for="' + a.id + '"]') : null, fs = a.closest('fieldset');
      return { box: box, label: lab ? lab.textContent : null, legend: fs && a.type === 'radio' ? fs.querySelector('legend').textContent + '|' + a.value : null, text: a.tagName === 'BUTTON' ? a.textContent : null, id: a.id && a.id.indexOf('igs-f-') !== 0 ? a.id : null };
    }
    function restoreFocus(k) {
      if (!k) return; var target = null;
      if (k.id) target = D.getElementById(k.id);
      if (!target && k.label) { var labs = k.box.querySelectorAll('label'); for (var i = 0; i < labs.length; i++) if (labs[i].textContent === k.label && labs[i].htmlFor) { target = D.getElementById(labs[i].htmlFor); break; } }
      if (!target && k.legend) { var lp = k.legend.split('|'); Array.prototype.forEach.call(k.box.querySelectorAll('fieldset'), function (f) { if (!target && f.querySelector('legend').textContent === lp[0]) target = f.querySelector('input[value="' + lp[1] + '"]'); }); }
      if (!target && k.text) { var bs = k.box.querySelectorAll('button'); for (var j = 0; j < bs.length; j++) if (bs[j].textContent === k.text) { target = bs[j]; break; } }
      if (target && !target.disabled) { try { target.focus({ preventScroll: true }); } catch (_) { target.focus(); } }
    }
    function renderSide() { var fk = focusKey(); renderSideNow(); restoreFocus(fk); }
    function renderSideNow() {
      var out = [h('h3', { text: t('assemblies') })], ul = h('ul', { class: 'igs-list' });
      MODES.forEach(function (md) { ul.appendChild(listButton(t('mode_' + md), null, md === mode(), function () { setMode(md); })); });
      out.push(ul);
      var ul2 = h('ul', { class: 'igs-list' }), md = mode();
      if (md === 'gears') {
        var r = gearRes();
        S.gears.list.forEach(function (gr) { ul2.appendChild(listButton(t('gearN', { n: gr.id, z: gr.z }), gr.id === S.gears.motorId ? t('motor') : gr.id === S.gears.outId ? t('output') : r.speed[gr.id] === undefined ? t('loose') : num(Math.abs(r.speed[gr.id]), 2) + ' rpm', isSel('gear', gr.id), function () { select({ k: 'gear', id: gr.id }); }, LAYER_COL[gr.layer % 4])); });
      } else if (md === 'lever') {
        ul2.appendChild(listButton(t('fulcrum'), metres(S.lever.f), isSel('fulcrum'), function () { select({ k: 'fulcrum' }); }, NAVY));
        ul2.appendChild(listButton(t('plank'), metres(S.lever.L), isSel('plank'), function () { select({ k: 'plank' }); }, '#8d5b3a'));
        S.lever.loads.forEach(function (l, i) { ul2.appendChild(listButton(t('loadN', { n: i + 1 }), num(l.kg, 0) + ' kg', isSel('load', l.id), function () { select({ k: 'load', id: l.id }); }, '#5d6877')); });
        if (S.lever.effortOn) ul2.appendChild(listButton(t('effort'), metres(S.lever.e), isSel('effort'), function () { select({ k: 'effort' }); }, MAG));
      } else if (md === 'pulley') {
        ul2.appendChild(listButton(t('pulleySet'), t('pulley_' + S.pulley.kind), isSel('pset'), function () { select({ k: 'pset' }); }, NAVY));
        ul2.appendChild(listButton(t('load'), num(S.pulley.load, 0) + ' kg', isSel('pload'), function () { select({ k: 'pload' }); }, '#5d6877'));
        ul2.appendChild(listButton(t('effort'), kg(pulleyRes().effortKg), isSel('effortP'), function () { select({ k: 'effortP' }); }, MAG));
      } else if (md === 'ramp') {
        ul2.appendChild(listButton(t('rampPiece'), metres(S.ramp.L), isSel('ramp'), function () { select({ k: 'ramp' }); }, '#9c6b3f'));
        ul2.appendChild(listButton(t('box'), num(S.ramp.load, 0) + ' kg', isSel('rload'), function () { select({ k: 'rload' }); }, '#8a4b00'));
      } else {
        parts().forEach(function (p) { ul2.appendChild(listButton(partName(p), p.id === S.chain.start ? t('startTag') : null, isSel('part', p.id), function () { select({ k: 'part', id: p.id }); }, PART_COL[p.type])); });
      }
      out.push(h('h3', { text: t('piecesOf', { n: ul2.children.length }) }), ul2);
      if (md === 'chain' && runValid() && run.steps.length) {
        var ol = h('ol', { class: 'igs-list igq-steps' });
        run.steps.forEach(function (sp) {
          var b = h('button', { type: 'button', 'aria-current': String(!!(sel && sel.k === 'part' && sel.id === sp.id)) }, h('span', { text: sp.n + '. ' + partName(partById(sp.id)) }), h('small', { text: num(sp.t, 1) + ' s' }));
          b.addEventListener('click', function () { stop(true); anim.t = Math.min(run.duration, sp.t + 0.25); select({ k: 'part', id: sp.id }); });
          ol.appendChild(h('li', null, b));
        });
        out.push(h('h3', { text: t('stepsCounted', { n: run.steps.length }) }), ol);
      }
      ctx.setStructure(out);
      ctx.setInspector(inspector());
      renderHud();
    }
    function numField(label, value, opts, onChange) { return F.number(label, +(+value).toFixed(opts.dec === undefined ? 3 : opts.dec), { unit: opts.unit, min: opts.min, max: opts.max, step: opts.step, onChange: onChange }); }
    function resultList(lines) { var ul = h('ul', { class: 'igq-results' }); lines.forEach(function (l) { ul.appendChild(h('li', null, l[0] ? h('span', { text: l[0] + ': ' }) : null, h('strong', { text: l[1] }))); }); return ul; }
    function warn(text) { return h('p', { class: 'igs-result', 'data-kind': 'bad', role: 'note' }, h('strong', { text: t('warning') }), text); }
    function inspector() {
      var md = mode(), out = [];
      if (md === 'gears') out = out.concat(inspGears());
      else if (md === 'lever') out = out.concat(inspLever());
      else if (md === 'pulley') out = out.concat(inspPulley());
      else if (md === 'ramp') out = out.concat(inspRamp());
      else out = out.concat(inspChain());
      out.push(playBlock());
      out.push(challengeBlock());
      out.push(h('details', { class: 'igq-how' }, h('summary', { text: t('howCalc') }), h('p', { class: 'igs-muted', text: t('how_' + md) })));
      return out;
    }
    function playBlock() {
      var box = h('div', { class: 'igq-play' }), md = mode(), end = animEnd();
      box.appendChild(h('h4', { text: t('testTitle') }));
      if (md === 'chain' && !runValid()) { box.appendChild(h('p', { class: 'igs-muted', text: t('chainNotRun') })); box.appendChild(h('div', { class: 'igs-actions' }, ctx.button(t('test'), { icon: 'play', class: 'igs-primary', onClick: test }))); return box; }
      var max = md === 'gears' ? 60 : end;
      box.appendChild(F.range(md === 'gears' ? t('timeSec') : t('timeline'), Math.min(anim.t, max), { min: 0, max: max, step: md === 'gears' ? 0.1 : 0.05, format: function (v) { return num(v, 1) + ' s'; },
        onInput: function (v) { stop(true); anim.t = v; render(); } }));
      box.appendChild(h('div', { class: 'igs-actions' },
        ctx.button(anim.playing ? t('stop') : t('play'), { icon: anim.playing ? 'stop' : 'play', onClick: function () { if (anim.playing) stop(); else play(); } }),
        md === 'chain' ? ctx.button(t('prevStep'), { onClick: stepBack }) : null,
        ctx.button(md === 'chain' ? t('nextStep') : t('stepBtn'), { onClick: stepForward }),
        ctx.button(t('rewind'), { icon: 'undo', onClick: function () { stop(true); anim.t = 0; render(); renderSide(); ctx.announce(t('rewound')); } })));
      if (ctx.reducedMotion()) box.appendChild(h('p', { class: 'igs-muted', text: t('reducedNote') }));
      return box;
    }

    /* Inspector: engranajes */
    function inspGears() {
      var Gs = S.gears, r = gearRes(), out = [];
      if (r.jam) out.push(warn(t('jam')));
      if (r.collisions.length) out.push(warn(t('collide', { n: r.collisions.length })));
      if (sel && sel.k === 'gear' && gearById(sel.id)) {
        var g = gearById(sel.id), sp = r.speed[g.id];
        out.push(h('h4', { text: t('gearN', { n: g.id, z: g.z }) }));
        out.push(resultList([[t('speed'), sp === undefined ? t('loose') : fmtRpm(sp)], [t('direction'), sp === undefined ? '—' : dirWord(sp)],
          [t('torqueIdeal'), sp === undefined ? '—' : '×' + num(r.torque[g.id], 2)], [t('torqueReal'), sp === undefined ? '—' : num(r.realTorque[g.id], 3) + ' N·m'],
          [t('meshesFromMotor'), sp === undefined ? '—' : String(r.meshes[g.id] || 0)]]));
        out.push(F.select(t('teeth'), g.z, TEETH.map(function (z) { return [z, t('teethN', { n: z })]; }), { onChange: function (v) { changeTeeth(g, +v); } }));
        out.push(F.choice(t('layer'), g.layer, [[0, '1'], [1, '2'], [2, '3'], [3, '4']], { onChange: function (v) { if (Gs.list.some(function (o) { return o !== g && M.sameAxle(o, g) && o.layer === +v; })) { ctx.announce(t('occupied')); renderSide(); return; } g.layer = +v; changed(t('layerSet', { n: +v + 1 })); } }));
        out.push(numField(t('posX'), g.x, { unit: 'mm', step: 1, min: -600, max: 600 }, function (v) { g.x = r3(v); snapGear(g); changed(t('gearMoved')); }));
        out.push(numField(t('posY'), g.y, { unit: 'mm', step: 1, min: -600, max: 600 }, function (v) { g.y = r3(v); snapGear(g); changed(t('gearMoved')); }));
        out.push(h('div', { class: 'igs-actions' },
          ctx.button(t('makeMotor'), { pressed: g.id === Gs.motorId, onClick: function () { Gs.motorId = g.id; if (Gs.outId === g.id) Gs.outId = null; changed(t('motorSet', { n: g.id })); } }),
          ctx.button(t('makeOut'), { pressed: g.id === Gs.outId, onClick: function () { if (g.id === Gs.motorId) { ctx.announce(t('motorNotOut')); return; } Gs.outId = Gs.outId === g.id ? null : g.id; changed(Gs.outId ? t('outSet', { n: g.id }) : t('outCleared')); } })));
        /* añadir a partir de este */
        var zSel = F.select(t('newTeeth'), addTeeth, TEETH.map(function (z) { return [z, t('teethN', { n: z })]; }), { onChange: function (v) { addTeeth = +v; } });
        var dSel = F.select(t('direction2'), 0, DIRS.map(function (d) { return [d, t('dir_' + d)]; }), {});
        out.push(h('h4', { text: t('addFromHere') }), zSel, dSel,
          h('div', { class: 'igs-actions' },
            ctx.button(t('addMeshed'), { icon: 'plus', onClick: function () { addGearFrom(g, 'mesh', +dSel.input.value); } }),
            ctx.button(t('addFront'), { icon: 'layers', onClick: function () { addGearFrom(g, 'front'); } }),
            ctx.button(t('addBack'), { icon: 'layers', onClick: function () { addGearFrom(g, 'back'); } })));
        out.push(h('div', { class: 'igs-actions' }, ctx.button(t('deleteGear'), { icon: 'trash', class: 'igs-danger', disabled: Gs.list.length < 2, onClick: deleteSelection })));
        return out;
      }
      var o = Gs.outId && r.speed[Gs.outId] !== undefined ? r.speed[Gs.outId] : null;
      out.push(h('h4', { text: t('mode_gears') }));
      var lines = [[t('motorLine', { n: Gs.motorId }), fmtRpm(Gs.rpm) + ', ' + dirWord(Gs.rpm)]];
      if (o !== null) {
        var fr = M.ratioFrac(Math.abs(o / Gs.rpm)), Pin = Gs.torque * Math.abs(Gs.rpm) * 2 * Math.PI / 60, Pout = r.realTorque[Gs.outId] * Math.abs(o) * 2 * Math.PI / 60;
        lines.push([t('outLine', { n: Gs.outId }), fmtRpm(o) + ', ' + dirWord(o)], [t('ratio'), fr[0] + ':' + fr[1]], [t('torqueIdeal'), '×' + num(r.torque[Gs.outId], 2)],
          [t('torqueReal'), num(r.realTorque[Gs.outId], 3) + ' N·m'], [t('efficiency'), pct(Pin > 0 ? Pout / Pin : 1)]);
      } else lines.push(['', t('noOut')]);
      if (r.loose.length) lines.push([t('looseLine'), r.loose.join(', ')]);
      out.push(resultList(lines));
      out.push(numField(t('rpm'), Math.abs(Gs.rpm), { unit: 'rpm', min: 0.01, max: 3000, step: 1 }, function (v) { Gs.rpm = Math.max(0.01, v) * (Gs.rpm < 0 ? -1 : 1); changed(t('rpmSet')); }));
      out.push(F.choice(t('motorDir'), Gs.rpm >= 0 ? 1 : -1, [[1, t('cw')], [-1, t('ccw')]], { onChange: function (v) { Gs.rpm = Math.abs(Gs.rpm) * +v; changed(t('rpmSet')); } }));
      out.push(numField(t('motorTorque'), Gs.torque, { unit: 'N·m', min: 0.01, max: 100, step: 0.1 }, function (v) { Gs.torque = v; changed(t('torqueSet')); }));
      out.push(numField(t('meshEff'), Gs.eff, { unit: '%', min: 50, max: 100, step: 0.5, dec: 1 }, function (v) { Gs.eff = v; changed(t('effSet')); }));
      out.push(F.check(t('showHands'), S.hands, { onChange: function (v) { S.hands = !!v; changed(t('showHands')); } }));
      out.push(h('p', { class: 'igs-muted', text: t('gearsHelp') }));
      out.push(gearTable(r));
      return out;
    }
    function gearTable(r) {
      var tb = h('tbody');
      S.gears.list.forEach(function (g) {
        var sp = r.speed[g.id];
        tb.appendChild(h('tr', null, h('th', { scope: 'row', text: String(g.id) }), h('td', { class: 'igs-numcell', text: String(g.z) }), h('td', { class: 'igs-numcell', text: String(g.layer + 1) }),
          h('td', { class: 'igs-numcell', text: sp === undefined ? t('loose') : num(Math.abs(sp), 3) }), h('td', { text: sp === undefined ? '—' : (sp >= 0 ? '↻ ' : '↺ ') + dirWord(sp) }),
          h('td', { class: 'igs-numcell', text: sp === undefined ? '—' : num(r.torque[g.id], 2) })));
      });
      return h('div', { class: 'igs-table-wrap', tabindex: '0', role: 'region', 'aria-label': t('gearTableCap') }, h('table', { class: 'igs-table' }, h('caption', { text: t('gearTableCap') }),
        h('thead', null, h('tr', null, [t('thN'), t('thTeeth'), t('thLayer'), t('thRpm'), t('thDir'), t('thTorque')].map(function (x) { return h('th', { scope: 'col', text: x }); }))), tb));
    }
    function changeTeeth(g, z) {
      /* si engranaba con otro, se recoloca para seguir engranando */
      var partners = S.gears.list.filter(function (o) { return o !== g && M.meshes(o, g); });
      g.z = z;
      if (partners.length) { var o = partners[0], a = Math.atan2(g.y - o.y, g.x - o.x) * 180 / Math.PI, p = M.placeMeshed(o, z, a); g.x = p.x; g.y = p.y; }
      changed(t('teethSet', { n: z }));
    }
    function snapGear(g) {
      var best = null;
      S.gears.list.forEach(function (o) {
        if (o === g) return;
        var d = Math.hypot(g.x - o.x, g.y - o.y);
        if (o.layer === g.layer) { var want = M.radius(o.z) + M.radius(g.z); if (Math.abs(d - want) < 2.5 && (!best || Math.abs(d - want) < best.err)) best = { o: o, err: Math.abs(d - want), kind: 'mesh' }; }
        else if (d < 2.5 && (!best || d < best.err)) best = { o: o, err: d, kind: 'axle' };
      });
      if (!best) return null;
      if (best.kind === 'axle') { g.x = best.o.x; g.y = best.o.y; }
      else { var a = Math.atan2(g.y - best.o.y, g.x - best.o.x) * 180 / Math.PI, p = M.placeMeshed(best.o, g.z, a); g.x = p.x; g.y = p.y; }
      return best;
    }
    function addGearFrom(base, how, dirDeg) {
      var Gs = S.gears, z = addTeeth, g;
      if (Gs.list.length >= 30) { ctx.announce(t('tooMany')); return; }
      if (how === 'mesh') { var p = M.placeMeshed(base, z, dirDeg); g = { id: Gs.nextId, x: p.x, y: p.y, z: z, layer: base.layer }; }
      else g = { id: Gs.nextId, x: base.x, y: base.y, z: z, layer: base.layer + (how === 'front' ? 1 : -1) };
      if (g.layer < 0 || g.layer > 3) { ctx.announce(t('layerLimit')); return; }
      if (Gs.list.some(function (o) { return M.sameAxle(o, g) && o.layer === g.layer; })) { ctx.announce(t('occupied')); return; }
      Gs.list.push(g); Gs.nextId += 1; sel = { k: 'gear', id: g.id };
      changed(t('gearAdded', { n: g.id, z: z }));
    }
    function placeGearAt(x, y) {
      var Gs = S.gears;
      if (Gs.list.length >= 30) { ctx.announce(t('tooMany')); return; }
      var onAxle = Gs.list.filter(function (o) { return Math.hypot(o.x - x, o.y - y) < Math.max(3, M.radius(o.z) * 0.25); }).sort(function (a, b) { return b.layer - a.layer; })[0];
      var g = { id: Gs.nextId, x: r3(x), y: r3(y), z: addTeeth, layer: 0 };
      if (onAxle) { g.x = onAxle.x; g.y = onAxle.y; g.layer = onAxle.layer + 1; if (g.layer > 3) { ctx.announce(t('layerLimit')); return; } }
      else snapGear(g);
      Gs.list.push(g); Gs.nextId += 1; sel = { k: 'gear', id: g.id };
      var r = M.solveGears(Gs.list, Gs.motorId, Gs.rpm), linked = r.links.filter(function (l) { return l[0] === g.id || l[1] === g.id; })[0];
      changed(t('gearAdded', { n: g.id, z: g.z }) + (linked ? ' ' + t(linked[2] === 'mesh' ? 'meshesWith' : 'axleWith', { n: linked[0] === g.id ? linked[1] : linked[0] }) : ''));
    }

    /* Inspector: palanca */
    function inspLever() {
      var Lv = S.lever, lr = leverRes(), out = [];
      function results() {
        var lines = [];
        if (lr.reason === 'effortOnFulcrum') return warn(t('effortOnFulcrum'));
        lines.push([t('netMoment'), num(Math.abs(lr.net) * G, 1) + ' N·m' + (Math.abs(lr.net) > 1e-9 ? ' (' + (lr.net > 0 ? t('turnsRight') : t('turnsLeft')) + ')' : '')]);
        if (Lv.effortOn) {
          lines.push([t('effortNeeded'), kg(lr.effort) + ' · ' + newton(lr.effort) + ' · ' + (lr.up ? t('pushUp') : t('pushDown'))]);
          lines.push([t('mechAdv'), isFinite(lr.advantage) ? '×' + num(lr.advantage, 2) : '∞']);
          if (Lv.loads.length === 1 && lr.one && lr.one.ok) lines.push([t('leverKind'), t('kind_' + lr.one.kind)]);
        } else lines.push([t('seesawState'), lr.balanced ? t('balanced') : lr.net > 0 ? t('downRight') : t('downLeft')]);
        return resultList(lines);
      }
      if (sel && sel.k === 'load') {
        var l = Lv.loads.filter(function (x) { return x.id === sel.id; })[0];
        if (l) {
          var i = Lv.loads.indexOf(l);
          out.push(h('h4', { text: t('loadN', { n: i + 1 }) }));
          out.push(resultList([[t('armLength'), metres(Math.abs(l.x - Lv.f))], [t('moment'), num(l.kg * G * Math.abs(l.x - Lv.f), 1) + ' N·m']]));
          out.push(numField(t('mass'), l.kg, { unit: 'kg', min: 1, max: 2000, step: 1 }, function (v) { l.kg = v; changed(t('loadSet', { m: num(v, 0) })); }));
          out.push(numField(t('posFromLeft'), l.x, { unit: 'm', min: 0, max: Lv.L, step: 0.05 }, function (v) { l.x = clamp(v, 0, Lv.L); changed(t('moved2')); }));
          out.push(h('div', { class: 'igs-actions' }, ctx.button(t('deleteLoad'), { icon: 'trash', class: 'igs-danger', disabled: Lv.loads.length < 2, onClick: deleteSelection })));
          out.push(results()); return out;
        }
      }
      if (sel && (sel.k === 'fulcrum' || sel.k === 'effort' || sel.k === 'plank')) {
        out.push(h('h4', { text: t(sel.k === 'fulcrum' ? 'fulcrum' : sel.k === 'effort' ? 'effort' : 'plank') }));
        if (sel.k === 'fulcrum') out.push(numField(t('posFromLeft'), Lv.f, { unit: 'm', min: 0, max: Lv.L, step: 0.05 }, function (v) { Lv.f = clamp(v, 0, Lv.L); changed(t('moved2')); }));
        if (sel.k === 'effort') out.push(numField(t('posFromLeft'), Lv.e, { unit: 'm', min: 0, max: Lv.L, step: 0.05 }, function (v) { Lv.e = clamp(v, 0, Lv.L); changed(t('moved2')); }));
        if (sel.k === 'plank') out.push(numField(t('plankLen'), Lv.L, { unit: 'm', min: 1, max: 6, step: 0.1 }, function (v) { setPlank(v); }));
        out.push(results()); return out;
      }
      out.push(h('h4', { text: t('mode_lever') }), results());
      out.push(numField(t('plankLen'), Lv.L, { unit: 'm', min: 1, max: 6, step: 0.1 }, function (v) { setPlank(v); }));
      out.push(F.check(t('effortOn'), Lv.effortOn, { onChange: function (v) { Lv.effortOn = !!v; changed(v ? t('effortOnDone') : t('effortOffDone')); } }));
      out.push(h('div', { class: 'igs-actions' }, ctx.button(t('addLoad'), { icon: 'weight', onClick: addLoad })));
      out.push(h('p', { class: 'igs-muted', text: t('leverHelp') }));
      return out;
    }
    function setPlank(v) { var Lv = S.lever; Lv.L = clamp(v, 1, 6); Lv.f = Math.min(Lv.f, Lv.L); Lv.e = Math.min(Lv.e, Lv.L); Lv.loads.forEach(function (l) { l.x = Math.min(l.x, Lv.L); }); changed(t('plankSet', { m: metres(Lv.L) })); }
    function addLoad(x) {
      var Lv = S.lever; if (Lv.loads.length >= 6) { ctx.announce(t('tooMany')); return; }
      var l = { id: Lv.nextId++, x: typeof x === 'number' ? clamp(r3(x), 0, Lv.L) : r3(Lv.L * 0.8), kg: 20 }; Lv.loads.push(l); sel = { k: 'load', id: l.id };
      changed(t('loadAdded'));
    }

    /* Inspector: poleas */
    function inspPulley() {
      var P = S.pulley, pr = pulleyRes(), out = [h('h4', { text: sel && sel.k === 'pload' ? t('load') : sel && sel.k === 'effortP' ? t('effort') : t('mode_pulley') })];
      out.push(resultList([[t('effortReal'), kg(pr.effortKg) + ' · ' + newton(pr.effortKg)], [t('effortIdeal'), kg(pr.idealKg)], [t('ropesHold'), String(pr.n)],
        [t('mechAdv'), '×' + num(pr.adv, 2) + ' (' + t('ideal') + ' ×' + pr.n + ')'], [t('efficiency'), pct(pr.eff)], [t('ropeToPull'), metres(pr.rope)], [t('work'), num(pr.work, 0) + ' J']]));
      if (!sel || sel.k === 'pset') out.push(F.select(t('pulleyKind'), P.kind, Object.keys(M.PULLEYS).map(function (k) { return [k, t('pulley_' + k)]; }), { onChange: function (v) { P.kind = v; changed(t('pulley_' + v)); } }));
      if (!sel || sel.k === 'pload') out.push(numField(t('mass'), P.load, { unit: 'kg', min: 1, max: 2000, step: 1 }, function (v) { P.load = v; changed(t('loadSet', { m: num(v, 0) })); }));
      if (!sel || sel.k === 'pload' || sel.k === 'effortP') out.push(numField(t('height'), P.h, { unit: 'm', min: 0.1, max: 50, step: 0.1 }, function (v) { P.h = v; changed(t('heightSet')); }));
      out.push(h('p', { class: 'igs-muted', text: t('pulleyHelp') }));
      return out;
    }
    /* Inspector: rampa */
    function inspRamp() {
      var R = S.ramp, rr = rampRes(), out = [h('h4', { text: sel && sel.k === 'rload' ? t('box') : t('mode_ramp') })];
      out.push(resultList([[t('angle'), num(rr.th * 180 / Math.PI, 1) + '°'], [t('effortReal'), kg(rr.real) + ' · ' + newton(rr.real)], [t('effortIdeal'), kg(rr.ideal)],
        [t('mechAdv'), '×' + num(rr.adv, 2)], [t('efficiency'), pct(rr.eff)], [t('workUse'), num(rr.workUse, 0) + ' J'], [t('workDone'), num(rr.workDone, 0) + ' J']]));
      if (!sel || sel.k === 'rload') out.push(numField(t('mass'), R.load, { unit: 'kg', min: 1, max: 2000, step: 1 }, function (v) { R.load = v; changed(t('loadSet', { m: num(v, 0) })); }));
      if (!sel || sel.k === 'rload') out.push(F.select(t('surface'), String(R.mu), [['0', t('mu_0')], ['0.03', t('mu_oil')], ['0.1', t('mu_010')], ['0.15', t('mu_015')], ['0.3', t('mu_wood')], ['0.7', t('mu_rubber')]].concat([['0', '0'], ['0.03', '0.03'], ['0.1', '0.1'], ['0.15', '0.15'], ['0.3', '0.3'], ['0.7', '0.7']].some(function (o) { return +o[0] === R.mu; }) ? [] : [[String(R.mu), num(R.mu, 2)]]), { onChange: function (v) { R.mu = +v; changed(t('muSet')); } }));
      if (!sel || sel.k === 'rload') out.push(numField(t('muField'), R.mu, { min: 0, max: 1, step: 0.01, dec: 3 }, function (v) { R.mu = clamp(v, 0, 1); changed(t('muSet')); }));
      if (!sel || sel.k === 'ramp') {
        out.push(numField(t('rampLength'), R.L, { unit: 'm', min: 0.5, max: 12, step: 0.1 }, function (v) { R.L = Math.max(v, R.H + 0.05); changed(t('rampSet')); }));
        out.push(numField(t('rampHeight'), R.H, { unit: 'm', min: 0.1, max: 5, step: 0.05 }, function (v) { R.H = Math.min(v, R.L - 0.05); changed(t('rampSet')); }));
      }
      out.push(h('p', { class: 'igs-muted', text: t('rampHelp') }));
      return out;
    }
    /* Inspector: máquina en cadena */
    function inspChain() {
      var out = [];
      var p = sel && sel.k === 'part' ? partById(sel.id) : null;
      if (p) {
        out.push(h('h4', { text: partName(p) }));
        out.push(h('p', { class: 'igs-muted', text: t('partInfo_' + p.type) }));
        out.push(numField(t('posX'), p.x, { unit: 'm', min: 0, max: K.W, step: 0.05 }, function (v) { p.x = clamp(r3(v), 0, K.W); changed(t('moved2')); }));
        out.push(numField(t('posY'), p.y, { unit: 'm', min: 0, max: K.H, step: 0.05 }, function (v) { p.y = clamp(r3(v), 0, K.H + 1); changed(t('moved2')); }));
        var PARAMS = { ball: [['r', 'radius', 'm', 0.01]], domino: [['h', 'heightF', 'm', 0.05]], block: [['w', 'width', 'm', 0.05], ['h', 'heightF', 'm', 0.05]], ramp: [['L', 'length', 'm', 0.1], ['angle', 'angleF', '°', 1]],
          spring: [['w', 'width', 'm', 0.1], ['angle', 'angleF', '°', 1]], bucket: [['w', 'width', 'm', 0.05], ['h', 'heightF', 'm', 0.05]], lever: [['L', 'length', 'm', 0.1], ['at', 'pivotAt', '', 0.05], ['angle', 'angleF', '°', 1]],
          pendulum: [['L', 'length', 'm', 0.1], ['angle', 'angleStart', '°', 5]], wheel: [['r', 'radius', 'm', 0.05]] }[p.type] || [];
        PARAMS.forEach(function (q) { var lim = K.LIMITS[q[0]]; out.push(numField(t(q[1]), p[q[0]], { unit: q[2] || null, min: lim[0], max: lim[1], step: q[3] }, function (v) { p[q[0]] = clamp(v, lim[0], lim[1]); changed(t('partChanged')); })); });
        out.push(F.text(t('whatItDoes'), p.note, { max: 120, onChange: function (v) { p.note = String(v).trim().slice(0, 120); changed(t('noteSet')); } }));
        out.push(h('div', { class: 'igs-actions' },
          K.DYNAMIC[p.type] ? ctx.button(t('makeStart'), { icon: 'flag', pressed: S.chain.start === p.id, onClick: function () { S.chain.start = p.id; changed(t('startSet', { p: partName(p) })); } }) : null,
          ctx.button(t('settle'), { icon: 'minus', onClick: function () { p.y = K.settle(parts(), p); changed(t('settled')); } }),
          ctx.button(t('duplicate'), { icon: 'copy', onClick: function () { var c = addChainPart(p.type, Math.min(K.W - 0.2, p.x + 0.4), p.y); if (c) { Object.keys(K.defaults(p.type)).forEach(function (k) { c[k] = p[k]; }); c.y = K.settle(parts(), c); sel = { k: 'part', id: c.id }; changed(t('duplicated')); } } }),
          ctx.button(t('deletePart'), { icon: 'trash', class: 'igs-danger', onClick: deleteSelection })));
        if (runValid()) { var sp = run.steps.filter(function (x) { return x.id === p.id; })[0]; out.push(h('p', { class: 'igs-note', text: sp ? stepText(sp) : K.DYNAMIC[p.type] ? t('notActivated') : t('notTouched') })); }
        return out;
      }
      out.push(h('h4', { text: t('mode_chain') }));
      var dyn = parts().filter(function (q) { return K.DYNAMIC[q.type]; });
      out.push(F.select(t('startPiece'), S.chain.start || '', [['', '—']].concat(dyn.map(function (q) { return [q.id, partName(q)]; })), { onChange: function (v) { S.chain.start = v || null; changed(t('startSet', { p: partName(partById(v)) })); } }));
      out.push(numField(t('kick'), S.chain.kick, { unit: 'm/s', min: -5, max: 5, step: 0.1, dec: 2 }, function (v) { S.chain.kick = clamp(v, -5, 5); changed(t('kickSet')); }));
      if (runValid()) {
        var kinds = M.checkChain(run.steps.map(function (sp) { return { part: K.OLD_PART[partById(sp.id).type], inp: 'x', out: 'x' }; })).kinds;
        out.push(resultList([[t('stepsCountedL'), String(run.steps.length)], [t('kindsL'), String(kinds)], [t('goalL'), run.goal ? t('yes') : t('no')], [t('durationL'), num(run.duration, 1) + ' s']]));
        if (run.selfMoved.length) out.push(warn(t('selfMoved', { l: run.selfMoved.map(function (id) { return partName(partById(id)); }).join(', ') })));
        if (run.unused.length) out.push(h('p', { class: 'igs-note', text: t('unusedParts', { l: run.unused.map(function (id) { return partName(partById(id)); }).join(', ') }) }));
        out.push(stepTable());
      } else if (run) out.push(h('p', { class: 'igs-note', text: t('runOutdated') }));
      out.push(h('p', { class: 'igs-muted', text: t('chainHelp') }));
      return out;
    }
    function stepTable() {
      var tb = h('tbody');
      run.steps.forEach(function (sp) {
        var p = partById(sp.id), by = sp.by ? partById(sp.by) : null;
        tb.appendChild(h('tr', null, h('th', { scope: 'row', text: String(sp.n) }), h('td', null, h('span', { text: partName(p) }), p && p.note ? h('small', { class: 'igq-note', text: p.note }) : null),
          h('td', { text: (sp.what === 'start' ? t('byYou') : by ? partName(by) : t('byItself')) + ' · ' + num(sp.t, 1) + ' s' })));
      });
      return h('div', { class: 'igs-table-wrap', tabindex: '0', role: 'region', 'aria-label': t('stepTableCap') }, h('table', { class: 'igs-table' }, h('caption', { text: t('stepTableCap') }),
        h('thead', null, h('tr', null, [t('thStep'), t('thPiece'), t('thBy')].map(function (x) { return h('th', { scope: 'col', text: x }); }))), tb));
    }

    /* ---------- Selección y cambios ---------- */
    function describeSel(s) {
      if (!s) return '';
      if (s.k === 'gear') { var g = gearById(s.id); return g ? t('gearN', { n: g.id, z: g.z }) : ''; }
      if (s.k === 'part') return partName(partById(s.id));
      if (s.k === 'load') { var i = S.lever.loads.map(function (l) { return l.id; }).indexOf(s.id); return t('loadN', { n: i + 1 }); }
      return t({ fulcrum: 'fulcrum', effort: 'effort', plank: 'plank', pset: 'pulleySet', pload: 'load', effortP: 'effort', ramp: 'rampPiece', rload: 'box' }[s.k] || 'load');
    }
    function select(s, quiet) {
      sel = s; if (s && !quiet) ctx.announce(t('selected', { name: describeSel(s) }));
      renderSide(); requestRender();
    }
    function invalidateAnim() { if (mode() !== 'gears') { stop(true); anim.t = 0; } }
    function changed(msg, quiet, keepAnim) {
      if (!keepAnim) invalidateAnim();
      ctx.commit(msg); if (!quiet && msg) ctx.announce(msg);
      renderSide(); updateSummary(); requestRender(); syncTest();
    }
    function elements() {
      var md = mode();
      if (md === 'gears') return S.gears.list.map(function (g) { return { k: 'gear', id: g.id }; });
      if (md === 'lever') return [{ k: 'fulcrum' }, { k: 'plank' }].concat(S.lever.loads.map(function (l) { return { k: 'load', id: l.id }; })).concat(S.lever.effortOn ? [{ k: 'effort' }] : []);
      if (md === 'pulley') return [{ k: 'pset' }, { k: 'pload' }, { k: 'effortP' }];
      if (md === 'ramp') return [{ k: 'ramp' }, { k: 'rload' }];
      return parts().map(function (p) { return { k: 'part', id: p.id }; });
    }
    function deleteSelection() {
      if (!sel) return;
      var name = describeSel(sel);
      if (sel.k === 'gear') {
        var Gs = S.gears; if (Gs.list.length < 2) return;
        Gs.list = Gs.list.filter(function (g) { return g.id !== sel.id; });
        if (Gs.motorId === sel.id) Gs.motorId = Gs.list[0].id; if (Gs.outId === sel.id) Gs.outId = null;
      } else if (sel.k === 'load') { if (S.lever.loads.length < 2) return; S.lever.loads = S.lever.loads.filter(function (l) { return l.id !== sel.id; }); }
      else if (sel.k === 'part') { S.chain.parts = parts().filter(function (p) { return p.id !== sel.id; }); if (S.chain.start === sel.id) { var d = parts().filter(function (p) { return K.DYNAMIC[p.type]; })[0]; S.chain.start = d ? d.id : null; } }
      else return;
      sel = null; changed(t('deleted', { name: name }));
    }

    /* ---------- Puntero ---------- */
    function local(e) { var r = ctx.viewport.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    function parseSel(str) { if (!str) return null; var a = str.split(':'); return a.length > 1 ? { k: a[0], id: a[0] === 'gear' || a[0] === 'load' ? +a[1] : a[1] } : { k: a[0] }; }
    var drag = null;
    svg.addEventListener('pointerdown', function (e) {
      if (e.button > 0 || anim.playing) return;
      ctx.viewport.focus({ preventScroll: true }); kcVisible = false;
      var p = local(e), m = toModel(p.x, p.y), target = e.target.closest && e.target.closest('[data-sel]'), hit = target ? parseSel(target.getAttribute('data-sel')) : null;
      kcs[mode()] = { x: m.x, y: m.y };
      if (tool === 'add') { placeAt(m.x, m.y); return; }
      if (tool === 'erase') { if (hit) { sel = hit; deleteSelection(); } return; }
      if (tool !== 'select') return;
      select(hit);
      if (hit && draggable(hit)) { drag = { s: hit, start: m, orig: JSON.stringify(S), moved: false }; svg.setPointerCapture(e.pointerId); }
    });
    svg.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var p = local(e), m = toModel(p.x, p.y), dx = m.x - drag.start.x, dy = m.y - drag.start.y, o = JSON.parse(drag.orig);
      if (Math.hypot(dx, dy) * view.scale < 3 && !drag.moved) return;
      drag.moved = true; applyMove(drag.s, o, dx, dy); requestRender();
    });
    function endDrag() {
      if (!drag) return; var d = drag; drag = null;
      if (d.moved) { if (d.s.k === 'gear') { var g = gearById(d.s.id), b = snapGear(g); changed(t('gearMoved') + (b ? ' ' + t(b.kind === 'mesh' ? 'meshesWith' : 'axleWith', { n: b.o.id }) : '')); } else changed(t('moved2')); }
    }
    svg.addEventListener('pointerup', endDrag); svg.addEventListener('pointercancel', function () { if (drag) { S = JSON.parse(drag.orig); drag = null; renderSide(); requestRender(); } });
    function draggable(s) { return ['gear', 'part', 'load', 'fulcrum', 'effort'].indexOf(s.k) >= 0; }
    function applyMove(s, o, dx, dy) {
      if (s.k === 'gear') { var og = o.gears.list.filter(function (g) { return g.id === s.id; })[0], g = gearById(s.id); g.x = r3(og.x + dx); g.y = r3(og.y + dy); }
      else if (s.k === 'part') { var op = o.chain.parts.filter(function (q) { return q.id === s.id; })[0], p = partById(s.id); p.x = clamp(r3(op.x + dx), 0, K.W); p.y = clamp(r3(op.y + dy), 0, K.H + 1); }
      else if (s.k === 'load') { var ol = o.lever.loads.filter(function (l) { return l.id === s.id; })[0], l = S.lever.loads.filter(function (x) { return x.id === s.id; })[0]; l.x = clamp(Math.round((ol.x + dx) * 20) / 20, 0, S.lever.L); }
      else if (s.k === 'fulcrum') S.lever.f = clamp(Math.round((o.lever.f + dx) * 20) / 20, 0, S.lever.L);
      else if (s.k === 'effort') S.lever.e = clamp(Math.round((o.lever.e + dx) * 20) / 20, 0, S.lever.L);
    }
    function placeAt(x, y) {
      var md = mode();
      if (md === 'gears') placeGearAt(x, y);
      else if (md === 'chain') { var p = addChainPart(addPart, clamp(x, 0, K.W), clamp(y, 0, K.H)); if (p) { sel = { k: 'part', id: p.id }; changed(t('partAdded', { p: partName(p) })); } }
      else if (md === 'lever') addLoad(x);
    }
    function hitAt(x, y) {
      var md = mode(), best = null, bd = Infinity;
      if (md === 'gears') S.gears.list.forEach(function (g) { var d = Math.hypot(g.x - x, g.y - y) - M.radius(g.z); if (d < bd && d < 4) { bd = d; best = { k: 'gear', id: g.id }; } });
      else if (md === 'chain') parts().forEach(function (p) { var b = K.bounds(p); var d = Math.max(b.minX - x, x - b.maxX, b.minY - y, y - b.maxY, 0) + Math.hypot(x - (b.minX + b.maxX) / 2, y - (b.minY + b.maxY) / 2) * 0.01; if (d < bd && d < 0.15) { bd = d; best = { k: 'part', id: p.id }; } });
      else if (md === 'lever') {
        var Lv = S.lever, cand = [{ s: { k: 'fulcrum' }, x: Lv.f }].concat(Lv.effortOn ? [{ s: { k: 'effort' }, x: Lv.e }] : []).concat(Lv.loads.map(function (l) { return { s: { k: 'load', id: l.id }, x: l.x }; }));
        cand.forEach(function (c) { var d = Math.abs(c.x - x); if (d < bd && d < 0.2) { bd = d; best = c.s; } });
        if (!best && x >= 0 && x <= Lv.L && Math.abs(y) < 0.15) best = { k: 'plank' };
      }
      return best;
    }

    /* ---------- Teclado ---------- */
    var keyTimer = 0;
    function keyCommit(msg) { root.clearTimeout(keyTimer); keyTimer = root.setTimeout(function () { changed(msg, true); }, 450); }
    function onKey(e) {
      if (!ctx.viewport.contains(e.target)) return false;
      var k = e.key, md = mode(), big = e.shiftKey;
      if (k.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey) { test(); return true; }
      if (anim.playing) { if (k === 'Escape') { stop(); return true; } return false; }
      var d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[k];
      if (d) {
        kcVisible = true;
        if (md === 'gears' && !flips(md)) d = [d[0], -d[1]];
        if (sel && nudge(sel, d, big)) { requestRender(); return true; }
        var step = { gears: big ? 10 : 2, lever: big ? 0.25 : 0.05, chain: big ? 0.5 : 0.1, ramp: 0.1, pulley: 10 }[md];
        var kc = kcs[md]; kc.x = r3(kc.x + d[0] * step); kc.y = r3(kc.y + d[1] * step);
        if (md === 'chain') { kc.x = clamp(kc.x, 0, K.W); kc.y = clamp(kc.y, 0, K.H); }
        var hit = hitAt(kc.x, kc.y);
        ctx.announce(t('cursorAt', { x: num(kc.x, md === 'gears' ? 0 : 2), y: num(kc.y, md === 'gears' ? 0 : 2), u: md === 'gears' ? 'mm' : 'm' }) + (hit ? ' · ' + describeSel(hit) : ''));
        ensureVisible(); requestRender(); return true;
      }
      if (k === 'Enter' || k === ' ') {
        kcVisible = true; var kc2 = kcs[md];
        if (tool === 'add') placeAt(kc2.x, kc2.y);
        else if (tool === 'erase') { var h2 = hitAt(kc2.x, kc2.y); if (h2) { sel = h2; deleteSelection(); } else ctx.announce(t('nothingHere')); }
        else { var h3 = hitAt(kc2.x, kc2.y); if (h3) select(h3); else ctx.announce(t('nothingHere')); }
        return true;
      }
      if (k === 'Escape') { if (sel) { select(null); ctx.announce(t('deselected')); return true; } return false; }
      if (k === 'Delete' || k === 'Backspace') { deleteSelection(); return true; }
      if (k === '+' || k === '=') { zoomCenter(1.25); return true; }
      if (k === '-' || k === '_') { zoomCenter(0.8); return true; }
      if (k === '0') { fit(); return true; }
      if (k.toLowerCase() === 'n' && !e.ctrlKey && !e.metaKey) {
        var list = elements(); if (!list.length) return true;
        var i = -1; list.forEach(function (x, j) { if (sel && x.k === sel.k && x.id === sel.id) i = j; });
        select(list[(i + (big ? -1 : 1) + list.length) % list.length]); return true;
      }
      if (k.toLowerCase() === 'r' && sel && sel.k === 'part') {
        var p = partById(sel.id); if (p && p.angle !== undefined) { p.angle = clamp(p.angle + (big ? -5 : 5), -75, 75); keyCommit(t('rotated', { a: num(p.angle, 0) })); ctx.announce(t('rotated', { a: num(p.angle, 0) })); renderSide(); requestRender(); }
        return true;
      }
      return false;
    }
    function nudge(s, d, big) {
      var msg = null;
      if (s.k === 'gear') { var g = gearById(s.id), st2 = big ? 5 : 1; g.x = r3(g.x + d[0] * st2); g.y = r3(g.y + d[1] * st2); var b = snapGear(g); msg = t('gearAt', { x: num(g.x, 1), y: num(g.y, 1) }) + (b ? ' · ' + t(b.kind === 'mesh' ? 'meshesWith' : 'axleWith', { n: b.o.id }) : ''); }
      else if (s.k === 'part') { var p = partById(s.id), st3 = big ? 0.25 : 0.05; p.x = clamp(r3(p.x + d[0] * st3), 0, K.W); p.y = clamp(r3(p.y + d[1] * st3), 0, K.H + 1); msg = t('partAt', { p: partName(p), x: num(p.x, 2), y: num(p.y, 2) }); }
      else if (s.k === 'load' || s.k === 'fulcrum' || s.k === 'effort') {
        var Lv = S.lever, st4 = big ? 0.25 : 0.05;
        if (s.k === 'load') { var l = Lv.loads.filter(function (x) { return x.id === s.id; })[0]; if (d[0]) l.x = clamp(r3(l.x + d[0] * st4), 0, Lv.L); else l.kg = clamp(l.kg + d[1] * (big ? 10 : 1), 1, 2000); msg = describeSel(s) + ': ' + metres(l.x) + ', ' + num(l.kg, 0) + ' kg'; }
        else { if (!d[0]) return false; var key = s.k === 'fulcrum' ? 'f' : 'e'; Lv[key] = clamp(r3(Lv[key] + d[0] * st4), 0, Lv.L); msg = describeSel(s) + ': ' + metres(Lv[key]); }
      } else if (s.k === 'pload' || s.k === 'rload') { var obj = s.k === 'pload' ? S.pulley : S.ramp; if (!d[1]) return false; obj.load = clamp(obj.load + d[1] * (big ? 10 : 1), 1, 2000); msg = t('loadSet', { m: num(obj.load, 0) }); }
      else if (s.k === 'effortP') { if (!d[1]) return false; S.pulley.h = clamp(r3(S.pulley.h + d[1] * (big ? 1 : 0.1)), 0.1, 50); msg = t('heightSet') + ': ' + metres(S.pulley.h); }
      else if (s.k === 'pset') { var ks = Object.keys(M.PULLEYS), i = ks.indexOf(S.pulley.kind); S.pulley.kind = ks[clamp(i + (d[0] || d[1]), 0, ks.length - 1)]; msg = t('pulley_' + S.pulley.kind); }
      else if (s.k === 'ramp') { var R = S.ramp; if (d[0]) R.L = clamp(r3(R.L + d[0] * 0.1), R.H + 0.05, 12); else R.H = clamp(r3(R.H + d[1] * 0.05), 0.1, Math.min(5, R.L - 0.05)); msg = t('rampLen', { m: metres(R.L), a: num(rampRes().th * 180 / Math.PI, 1) }) + ', ' + metres(R.H); }
      else return false;
      invalidateAnim(); ctx.announce(msg); keyCommit(msg); renderSide(); updateSummary();
      return true;
    }
    function ensureVisible() {
      var kc = kcs[mode()], p = toScreen(kc.x, kc.y), W = ctx.viewport.clientWidth, H = ctx.viewport.clientHeight, m = 40;
      if (p.x < m) view.x += m - p.x; if (p.x > W - m) view.x -= p.x - (W - m);
      if (p.y < m) view.y += m - p.y; if (p.y > H - m) view.y -= p.y - (H - m);
    }

    /* ---------- Herramientas ---------- */
    function setToolsFor() {
      var md = mode(), list = [{ id: 'select', label: t('toolSelect'), icon: 'select', title: t('helpSelect') }];
      if (md === 'gears') {
        var zs = h('select', { 'aria-label': t('newTeeth') }); TEETH.forEach(function (z) { var o = h('option', { value: z, text: t('teethN', { n: z }) }); if (z === addTeeth) o.selected = true; zs.appendChild(o); });
        zs.addEventListener('change', function () { addTeeth = +zs.value; ctx.selectTool('add'); });
        list.push({ id: 'add', label: t('toolGear'), icon: 'plus', title: t('helpGear') }, { node: h('label', { class: 'igs-inline-select' }, h('span', { text: t('teeth') }), zs) });
      } else if (md === 'chain') {
        var ps = h('select', { 'aria-label': t('pieceKind') }); K.TYPES.forEach(function (ty) { var o = h('option', { value: ty, text: t('part_' + ty) }); if (ty === addPart) o.selected = true; ps.appendChild(o); });
        ps.addEventListener('change', function () { addPart = ps.value; ctx.selectTool('add'); });
        list.push({ id: 'add', label: t('toolPiece'), icon: 'plus', title: t('helpPiece') }, { node: h('label', { class: 'igs-inline-select' }, h('span', { text: t('pieceKind') }), ps) });
      } else if (md === 'lever') list.push({ id: 'add', label: t('toolLoad'), icon: 'weight', title: t('helpLoad') });
      if (md === 'gears' || md === 'chain' || md === 'lever') list.push({ id: 'erase', label: t('toolErase'), icon: 'erase', level: 'more' });
      list.push({ id: 'pan', label: t('toolPan'), icon: 'pan', level: 'more' });
      list.push({ separator: true });
      list.push({ id: 'test', label: t('test'), icon: 'play', primary: true, keys: 'T', action: function () { test(); } });
      ctx.setTools(list, { initial: tool === 'add' && !(md === 'gears' || md === 'chain' || md === 'lever') ? 'select' : (tool === 'erase' && !(md === 'gears' || md === 'chain' || md === 'lever') ? 'select' : tool) });
      testBtn = ctx.toolbar.querySelector('.igs-primary'); syncTest();
    }

    /* ---------- Resumen accesible ---------- */
    function updateSummary() {
      var md = mode(), s2 = t('mode_' + md) + '. ';
      if (md === 'gears') {
        var r = gearRes();
        s2 += S.gears.list.map(function (g) { var sp = r.speed[g.id]; return t('altGear', { n: g.id, z: g.z, l: g.layer + 1, s: sp === undefined ? t('loose') : fmtRpm(sp) + ', ' + dirWord(sp) }); }).join(' ');
        if (r.jam) s2 += ' ' + t('jam'); if (r.collisions.length) s2 += ' ' + t('collide', { n: r.collisions.length });
      } else if (md === 'lever') {
        var lr = leverRes(), Lv = S.lever;
        s2 += t('altLever', { L: metres(Lv.L), f: metres(Lv.f), loads: Lv.loads.map(function (l) { return num(l.kg, 0) + ' kg ' + t('atM', { m: metres(l.x) }); }).join(', ') }) + ' ';
        s2 += Lv.effortOn ? (lr.ok ? t('altEffort', { e: kg(lr.effort), p: metres(Lv.e) }) : t('effortOnFulcrum')) : (lr.balanced ? t('balanced') : lr.net > 0 ? t('downRight') : t('downLeft'));
      } else if (md === 'pulley') { var pr = pulleyRes(); s2 += t('altPulley', { k: t('pulley_' + S.pulley.kind), l: num(S.pulley.load, 0), e: kg(pr.effortKg), n: pr.n, r: metres(pr.rope) }); }
      else if (md === 'ramp') { var rr = rampRes(); s2 += t('altRamp', { L: metres(S.ramp.L), H: metres(S.ramp.H), a: num(rr.th * 180 / Math.PI, 1), l: num(S.ramp.load, 0), e: kg(rr.real) }); }
      else {
        s2 += parts().length ? t('altChain', { n: parts().length, l: parts().map(function (p) { return partName(p) + ' (' + num(p.x, 1) + ', ' + num(p.y, 1) + ')'; }).join(', ') }) : t('chainEmpty');
        if (runValid()) s2 += ' ' + run.steps.map(stepText).join(' ');
      }
      ctx.setSummary(s2);
    }

    /* ---------- Exportaciones ---------- */
    function sceneSVG(forPrint) {
      var b = boundsOf(mode()), bw = b.maxX - b.minX, bh = b.maxY - b.minY, s = Math.min(1600 / bw, 1100 / bh);
      var W = Math.round(bw * s), H = Math.round(bh * s);
      var out = D.createElementNS(SVGNS, 'svg'); out.setAttribute('xmlns', SVGNS); out.setAttribute('viewBox', '0 0 ' + W + ' ' + H); out.setAttribute('width', forPrint ? '180mm' : W); out.setAttribute('height', forPrint ? (180 * H / W).toFixed(1) + 'mm' : H);
      out.setAttribute('role', 'img');
      var title = el('title', {}, out); title.textContent = t('sheetTitle') + ' · ' + t('mode_' + mode());
      el('rect', { x: 0, y: 0, width: W, height: H, fill: '#ffffff' }, out);
      var g = el('g', { transform: 'translate(' + (-b.minX * s) + ',' + (-b.minY * s) + ') scale(' + s + ')' }, out);
      var keepSel = sel; sel = null; drawScene(g, s, true); sel = keepSel;
      return { svg: out, W: W, H: H };
    }
    function exportPNG() {
      var sc = sceneSVG(false), url = URL.createObjectURL(new Blob([ctx.svgText(sc.svg)], { type: 'image/svg+xml' })), img = new Image();
      img.onload = function () {
        var c = D.createElement('canvas'); c.width = sc.W; c.height = sc.H; var g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0); URL.revokeObjectURL(url);
        ctx.canvasBlob(ctx.canvasWithCredit(c, '#ffffff')).then(function (bl) { ctx.download(bl, fileBase() + '.png'); });
      };
      img.onerror = function () { URL.revokeObjectURL(url); ctx.announce(t('exportError')); };
      img.src = url;
    }
    function exportSVG() {
      var sc = sceneSVG(false), H2 = sc.H + 30;
      sc.svg.setAttribute('viewBox', '0 0 ' + sc.W + ' ' + H2); sc.svg.setAttribute('height', H2);
      el('rect', { x: 0, y: sc.H, width: sc.W, height: 30, fill: '#f4f7fa' }, sc.svg);
      var cr = el('text', { x: sc.W - 12, y: sc.H + 20, 'font-size': 13, 'font-family': FONT, fill: NAVY, 'text-anchor': 'end' }, sc.svg); cr.textContent = 'IRIS GREEN · irisgreen.eu';
      ctx.download(new Blob([ctx.svgText(sc.svg)], { type: 'image/svg+xml' }), fileBase() + '.svg');
    }
    function fileBase() { return (LANG === 'en' ? 'machine-' : 'maquina-') + mode() + '-' + ctx.stamp(); }
    function sheetRows() {
      var md = mode(), rows = [];
      if (md === 'gears') {
        var r = gearRes();
        S.gears.list.forEach(function (g) { var sp = r.speed[g.id]; rows.push([t('gearN', { n: g.id, z: g.z }) + (g.id === S.gears.motorId ? ' (' + t('motor') + ')' : g.id === S.gears.outId ? ' (' + t('output') + ')' : ''), sp === undefined ? t('loose') : fmtRpm(sp) + ', ' + dirWord(sp) + ', ' + t('torqueIdeal') + ' ×' + num(r.torque[g.id], 2) + ', ' + num(r.realTorque[g.id], 3) + ' N·m']); });
      } else if (md === 'lever') {
        var lr = leverRes(); rows.push([t('plankLen'), metres(S.lever.L)], [t('fulcrum'), metres(S.lever.f)]);
        S.lever.loads.forEach(function (l, i) { rows.push([t('loadN', { n: i + 1 }), num(l.kg, 0) + ' kg · ' + metres(l.x)]); });
        if (S.lever.effortOn && lr.ok) rows.push([t('effortNeeded'), kg(lr.effort) + ' (' + newton(lr.effort) + ') · ' + metres(S.lever.e)], [t('mechAdv'), '×' + num(lr.advantage, 2)]);
        else rows.push([t('seesawState'), lr.balanced ? t('balanced') : lr.net > 0 ? t('downRight') : t('downLeft')]);
      } else if (md === 'pulley') {
        var pr = pulleyRes(); rows.push([t('pulleyKind'), t('pulley_' + S.pulley.kind)], [t('load'), num(S.pulley.load, 0) + ' kg'], [t('height'), metres(S.pulley.h)], [t('effortReal'), kg(pr.effortKg)], [t('effortIdeal'), kg(pr.idealKg)], [t('efficiency'), pct(pr.eff)], [t('ropeToPull'), metres(pr.rope)], [t('work'), num(pr.work, 0) + ' J']);
      } else if (md === 'ramp') {
        var rr = rampRes(); rows.push([t('rampLength'), metres(S.ramp.L)], [t('rampHeight'), metres(S.ramp.H)], [t('angle'), num(rr.th * 180 / Math.PI, 1) + '°'], [t('load'), num(S.ramp.load, 0) + ' kg'], [t('muField'), num(S.ramp.mu, 2)], [t('effortReal'), kg(rr.real)], [t('efficiency'), pct(rr.eff)]);
      } else {
        parts().forEach(function (p) { rows.push([partName(p), (p.note || '—') + ' · (' + num(p.x, 2) + ', ' + num(p.y, 2) + ') m']); });
        if (runValid()) run.steps.forEach(function (sp) { rows.push([t('thStep') + ' ' + sp.n, stepText(sp) + ' · ' + num(sp.t, 2) + ' s']); });
      }
      return rows;
    }
    function printSheet() {
      var sc = sceneSVG(true), md = mode(), art = h('article', { class: 'igq-sheet' });
      art.appendChild(h('h1', { text: t('sheetTitle') + ' · ' + t('mode_' + md) }));
      art.appendChild(h('p', { class: 'igq-sheet-meta', text: new Date().toLocaleDateString(LANG === 'en' ? 'en-GB' : 'es-ES') + ' · ' + t('madeIn') }));
      art.appendChild(h('figure', null, sc.svg, h('figcaption', { text: ctx.app.querySelector('#igs-scene-summary') ? ctx.app.querySelector('#igs-scene-summary').textContent.slice(0, 600) : '' })));
      var tb = h('tbody'); sheetRows().forEach(function (r) { tb.appendChild(h('tr', null, h('th', { scope: 'row', text: r[0] }), h('td', { text: r[1] }))); });
      art.append(h('h2', { text: t('sheetData') }), h('table', null, tb));
      var ch = chById(S.challenge);
      if (ch && ch.mode === md) { var ck = checks(ch); art.appendChild(h('h2', { text: t('challenge') + ': ' + t('ch_' + ch.id) })); art.appendChild(h('p', { text: t('chg_' + ch.id) })); var ul = h('ul'); ck.list.forEach(function (x) { ul.appendChild(h('li', { text: (x[0] ? '✓ ' : '☐ ') + x[1] })); }); art.appendChild(ul); }
      art.append(h('h2', { text: t('howCalc') }), h('p', { text: t('how_' + md) }));
      art.appendChild(h('p', { class: 'igq-sheet-meta', text: t('modelNote') }));
      art.appendChild(h('p', { class: 'igq-sheet-credit', text: 'IRIS GREEN · irisgreen.eu' }));
      ctx.printPages([art], { landscape: false });
    }
    ctx.addExport(t('exportPng'), exportPNG);
    ctx.addExport(t('exportSvg'), exportSVG);
    ctx.addExport(t('exportSheet'), printSheet, 'file');
    ctx.command('test', t('test'), t('helpTest'), test);
    ctx.command('fit', t('zoomFit'), '', fit);
    ctx.command('sheet', t('exportSheet'), '', printSheet);
    ctx.command('challenge', t('chooseChallenge'), '', function () { var s2 = D.getElementById('igq-ch-sel'); if (s2) s2.focus(); });
    MODES.forEach(function (md) { ctx.command('mode-' + md, t('mode_' + md), t('assemblies'), function () { setMode(md); }); });

    /* ---------- Puntos de partida ---------- */
    function part(type, x, y, extra, note) { var p = addChainPart(type, x, y); Object.keys(extra || {}).forEach(function (k) { p[k] = extra[k]; }); p.note = note || ''; return p; }
    function demoChain() {
      S.chain = { parts: [], start: null, kick: 1, seq: 1 };
      part('ramp', 1.8, 5.0, { L: 3, angle: -12 }, t('ex_ramp1'));
      var b1 = part('ball', 0.6, 6, {}, t('ex_ball1'));
      part('ramp', 5.4, 4.3, { L: 4, angle: 0 }, t('ex_shelf'));
      [4.2, 4.6, 5.0, 5.4, 5.8, 6.2].forEach(function (x, i) { part('domino', x, 5, {}, i ? t('ex_domino') : t('ex_domino1')); });
      part('ball', 6.9, 5, {}, t('ex_ball2'));
      part('ramp', 7.9, 2.9, { L: 3.2, angle: 10 }, t('ex_ramp2'));
      part('wheel', 5.8, 1.6, { r: 0.55 }, t('ex_wheel'));
      part('ramp', 3.9, 0.85, { L: 4.4, angle: 0 }, t('ex_shelf2'));
      part('bucket', 1.5, 0, {}, t('ex_bucket'));
      /* reasentar en orden (las piezas de arriba se apoyan en las de abajo) */
      parts().forEach(function (p) { p.y = K.settle(parts(), p); });
      S.chain.start = b1.id;
    }
    function start(id) {
      stop(true); run = null; runKey = ''; anim.t = 0; sel = null; tool = 'select';
      S = blank();
      if (id === 'seesaw') { applyChallenge('b1'); }
      else if (id === 'pulley1') { applyChallenge('q0'); }
      else if (id === 'clock') {
        S.gears.list = [{ id: 1, x: 0, y: 0, z: 20, layer: 0 }]; var p = M.placeMeshed(S.gears.list[0], 60, 0);
        S.gears.list.push({ id: 2, x: p.x, y: p.y, z: 60, layer: 0 }); S.gears.nextId = 3; S.gears.rpm = 1; S.gears.outId = 2; S.hands = true;
        applyChallenge('g5');
      } else if (id === 'ramp') { applyChallenge('r1'); S.ramp.L = 2; }
      else if (id === 'hoist') { applyChallenge('q5'); }
      else if (id === 'stone') { applyChallenge('p1'); S.lever.f = 1.5; S.lever.loads[0].x = 0.5; S.lever.e = 2.9; }
      else if (id === 'chain') { S.mode = 'chain'; demoChain(); S.challenge = 'k3'; }
      else if (id === 'train') {
        S.gears.list = [{ id: 1, x: 0, y: 0, z: 20, layer: 0 }]; var q1 = M.placeMeshed(S.gears.list[0], 40, 0); S.gears.list.push({ id: 2, x: q1.x, y: q1.y, z: 40, layer: 0 });
        S.gears.list.push({ id: 3, x: q1.x, y: q1.y, z: 12, layer: 1 }); var q2 = M.placeMeshed(S.gears.list[2], 36, 90); S.gears.list.push({ id: 4, x: q2.x, y: q2.y, z: 36, layer: 1 });
        S.gears.nextId = 5; S.gears.outId = 4; S.gears.rpm = 120; applyChallenge('g6');
      }
      if (id === 'empty') { S.mode = 'gears'; }
      setToolsFor(); renderSide(); updateSummary(); fit(); requestRender();
      ctx.setStatus(S.challenge ? t('chPicked', { t: t('ch_' + S.challenge) }) : '');
    }

    setToolsFor(); renderSide(); updateSummary();
    return {
      serialize: function () { return JSON.parse(JSON.stringify(S)); },
      restore: function (d) {
        stop(true); S = JSON.parse(JSON.stringify(d)); if (sel && !describeSel(sel)) sel = null;
        if (sel && sel.k === 'gear' && !gearById(sel.id)) sel = null; if (sel && sel.k === 'part' && !partById(sel.id)) sel = null;
        if (!runValid()) anim.t = mode() === 'gears' ? anim.t : 0;
        setToolsFor(); renderSide(); updateSummary(); requestRender();
      },
      validate: function (d) {
        function n(v) { return typeof v === 'number' && isFinite(v); }
        if (!d || typeof d !== 'object' || MODES.indexOf(d.mode) < 0 || !d.gears || !d.lever || !d.pulley || !d.ramp || !d.chain) return false;
        if (d.challenge !== null && d.challenge !== undefined && !chById(d.challenge)) return false;
        var Gs = d.gears; if (!Array.isArray(Gs.list) || !Gs.list.length || Gs.list.length > 40) return false;
        if (!Gs.list.every(function (g) { return g && n(g.id) && n(g.x) && n(g.y) && TEETH.indexOf(g.z) >= 0 && [0, 1, 2, 3].indexOf(g.layer) >= 0; })) return false;
        if (!Gs.list.some(function (g) { return g.id === Gs.motorId; }) || !n(Gs.rpm) || !n(Gs.torque) || !n(Gs.eff) || !n(Gs.nextId)) return false;
        var Lv = d.lever; if (!n(Lv.L) || !n(Lv.f) || !n(Lv.e) || !Array.isArray(Lv.loads) || !Lv.loads.length || Lv.loads.length > 6 || !Lv.loads.every(function (l) { return l && n(l.id) && n(l.x) && n(l.kg) && l.kg > 0; })) return false;
        if (!M.PULLEYS[d.pulley.kind] || !n(d.pulley.load) || !n(d.pulley.h)) return false;
        if (!n(d.ramp.L) || !n(d.ramp.H) || !n(d.ramp.load) || !n(d.ramp.mu) || d.ramp.H >= d.ramp.L) return false;
        var C = d.chain; if (!Array.isArray(C.parts) || C.parts.length > 60 || !n(C.kick) || !n(C.seq)) return false;
        return C.parts.every(function (p) { if (!p || K.TYPES.indexOf(p.type) < 0 || typeof p.id !== 'string' || !n(p.x) || !n(p.y) || typeof p.note !== 'string') return false; return Object.keys(K.defaults(p.type)).every(function (k) { return n(p[k]); }); });
      },
      start: start,
      onTool: function (id) { tool = id; ctx.viewport.dataset.tool = id; requestRender(); },
      onKey: onKey
    };
  }
})(window);
