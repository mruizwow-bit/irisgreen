/* Iris Green · El taller · Estudio de circuitos (R43).
   Editor de esquemas en rejilla con símbolos al estilo de IEC 60617. Dos modos: Electricidad (pila,
   resistencia, bombilla, LED, interruptor, conmutador, pulsador, motor, amperímetro y voltímetro) y
   Lógica (entradas, salidas, puertas, biestable D y reloj lento). El cálculo usa IGTCirc
   (ig-taller-circuitos-calc.js, el mismo del estudio antiguo): leyes de Kirchhoff y de Ohm, redes lógicas
   y tabla de verdad. Los cables se crean eligiendo un terminal y después otro (clic o Intro). */
(function (root) {
  'use strict';
  var IG = root.IGSuite, D = root.document; if (!IG) return;
  var C = root.IGTCirc; if (!C) return;
  var LANG = IG.lang, SVGNS = 'http://www.w3.org/2000/svg';
  var INK = '#172b42', NAVY = '#17395c', VIOLET = '#5a49a8', BAD = '#a1283c', LIVE = '#1f5f8b', ONE = '#b35c00', FONT = 'Atkinson Hyperlegible, Arial, sans-serif';
  var ELEC = ['battery', 'resistor', 'lamp', 'led', 'switch', 'spdt', 'push', 'motor', 'ammeter', 'voltmeter'];
  var LOGIC = ['input', 'out', 'and', 'or', 'not', 'nand', 'nor', 'xor', 'dff', 'clock'];
  var GATE2 = { and: 1, or: 1, nand: 1, nor: 1, xor: 1 };
  var BOARD = { elec: [24, 14], logic: [30, 18] };
  var AMMETER_R = 1, VOLTMETER_R = 1e7;

  var CHALLENGES = [
    { id: 'c1', level: 1, mode: 'elec', rules: { minLamps: 1, bright: 0.5, noBurn: true } },
    { id: 'c2', level: 1, mode: 'elec', rules: { minLamps: 2, bright: 0.8, noBurn: true } },
    { id: 'c3', level: 1, mode: 'elec', rules: { minLamps: 2, needs: ['switch'], bright: 0.6, offToo: true, noBurn: true } },
    { id: 'c4', level: 2, mode: 'elec', lim: { battery: 'v9' }, rules: { needs: ['led'], led: [0.005, 0.025], noBurn: true } },
    { id: 'c5', level: 2, mode: 'elec', rules: { minLamps: 1, spdt: 2, stair: true } },
    { id: 'c6', level: 2, mode: 'elec', rules: { needs: ['motor'], spdt: 2, reverse: true } },
    { id: 'l1', level: 3, mode: 'logic', target: 'andNot' },
    { id: 'l2', level: 3, mode: 'logic', target: 'half' },
    { id: 'l3', level: 3, mode: 'logic', target: 'majority' },
    { id: 'l4', level: 4, mode: 'logic', target: 'full' },
    { id: 'l5', level: 4, mode: 'logic', target: 'xorNand', lim: { only: ['nand'] } },
    { id: 'l6', level: 4, mode: 'logic', traffic: ['V', 'A', 'R'], clock: true },
    { id: 'l7', level: 4, mode: 'logic', target: 'add2' },
    { id: 'l8', level: 5, mode: 'logic', random: true }
  ];
  function chById(id) { for (var i = 0; i < CHALLENGES.length; i++) if (CHALLENGES[i].id === id) return CHALLENGES[i]; return null; }

  IG.defineEngine('circuitos', {
    version: 1, fileBase: LANG === 'en' ? 'circuit' : 'circuito',
    extraKeys: ['kcEnter', 'kcTools', 'kcRotate', 'kcNext', 'kcClock'],
    initialStart: function (para) { return { child: 'light', teen: 'traffic', adult: 'adder' }[para] || 'led'; },
    starts: function (ctx) {
      var t = ctx.t;
      return [
        { id: 'light', title: t('stLight'), desc: t('stLightD'), para: 'child' },
        { id: 'traffic', title: t('stTraffic'), desc: t('stTrafficD'), para: 'teen' },
        { id: 'gates', title: t('stGates'), desc: t('stGatesD'), para: 'teen' },
        { id: 'adder', title: t('stAdder'), desc: t('stAdderD'), para: 'adult' },
        { id: 'led', title: t('stLed'), desc: t('stLedD'), para: 'any' },
        { id: 'logic-empty', title: t('stLogicEmpty'), desc: t('stLogicEmptyD'), para: 'any' }
      ];
    },
    create: function (ctx) { return studio(ctx); }
  });

  function studio(ctx) {
    var t = ctx.t, h = ctx.h, F = ctx.fields, num = ctx.num;
    ctx.setTech('renderer', 'SVG');
    function blank(md) { return { v: 1, mode: md || 'elec', challenge: null, seed: 7, elec: { comps: [], wires: [], seq: 1 }, logic: { comps: [], wires: [], seq: 1 } }; }
    var S = blank();
    var sel = null, tool = 'select', addType = { elec: 'battery', logic: 'input' }, pending = null, cursor = { x: 3, y: 3 }, kcVisible = false;
    var pressed = {}, held = {}, dffState = {}, clock = { on: false, hz: 0.5, timer: 0, pulses: 0 }, flowAnim = false;
    var res = null, lres = null;
    function mode() { return S.mode; }
    function doc() { return S[S.mode]; }
    function comps() { return doc().comps; }
    function wires() { return doc().wires; }
    function compById(id) { var L = comps(); for (var i = 0; i < L.length; i++) if (L[i].id === id) return L[i]; return null; }
    function wireById(id) { var L = wires(); for (var i = 0; i < L.length; i++) if (L[i].id === id) return L[i]; return null; }
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

    /* ---------- Geometría: terminales ---------- */
    function rotOff(c, dx, dy) { var r = ((c.rot || 0) % 360 + 360) % 360; if (r === 90) return [c.x - dy, c.y + dx]; if (r === 180) return [c.x - dx, c.y - dy]; if (r === 270) return [c.x + dy, c.y - dx]; return [c.x + dx, c.y + dy]; }
    function pinsOf(c) {
      if (c.t === 'spdt') return { c: rotOff(c, 0, 0), t1: rotOff(c, 2, -1), t2: rotOff(c, 2, 1) };
      if (ELEC.indexOf(c.t) >= 0) return { a: rotOff(c, 0, 0), b: rotOff(c, 2, 0) };
      if (GATE2[c.t]) return { in1: [c.x, c.y - 1], in2: [c.x, c.y + 1], o: [c.x + 2, c.y] };
      if (c.t === 'not') return { in1: [c.x, c.y], o: [c.x + 2, c.y] };
      if (c.t === 'dff') return { d: [c.x, c.y - 1], clk: [c.x, c.y + 1], q: [c.x + 2, c.y - 1], qn: [c.x + 2, c.y + 1] };
      if (c.t === 'input' || c.t === 'clock') return { o: [c.x + 1, c.y] };
      if (c.t === 'out') return { i: [c.x - 1, c.y] };
      return {};
    }
    function pinPos(ref) { var c = compById(ref.c); return c ? pinsOf(c)[ref.p] : null; }
    function pinAt(x, y) {
      var found = null;
      comps().forEach(function (c) { var P = pinsOf(c); Object.keys(P).forEach(function (k) { if (P[k][0] === x && P[k][1] === y) found = { c: c.id, p: k }; }); });
      return found;
    }
    function wirePath(w) {
      var a = pinPos(w.a), b = pinPos(w.b); if (!a || !b) return null;
      var mid = w.bend ? [a[0], b[1]] : [b[0], a[1]];
      return [a, mid, b];
    }
    function compName(c) {
      if (!c) return '—';
      if (c.label && (c.t === 'input' || c.t === 'out')) return t('part_' + c.t) + ' ' + c.label;
      var n = 0; comps().some(function (q) { if (q.t === c.t) n += 1; return q.id === c.id; });
      return t('part_' + c.t) + ' ' + n;
    }
    function pinName(ref) { var c = compById(ref.c); return compName(c) + ' · ' + t('pin_' + (c ? c.t === 'battery' ? (ref.p === 'b' ? 'plus' : 'minus') : c.t === 'led' ? (ref.p === 'a' ? 'anode' : 'cathode') : ref.p : ref.p)); }

    /* ---------- Cálculo ---------- */
    function isOn(c) { return c.t === 'push' ? !!(pressed[c.id] || held[c.id]) : !!c.on; }
    function toCalcElec(over) {
      var list = [], map = [];
      function key(id, p) { return [id, p]; }
      comps().forEach(function (c) {
        var o = over && over[c.id] !== undefined ? over[c.id] : null, cc = null;
        if (c.t === 'battery') cc = { t: 'battery', kind: c.kind };
        else if (c.t === 'resistor') cc = { t: 'resistor', r: c.r };
        else if (c.t === 'lamp') cc = { t: 'lamp' };
        else if (c.t === 'led') cc = { t: 'led', color: c.color };
        else if (c.t === 'motor') cc = { t: 'motor' };
        else if (c.t === 'ammeter') cc = { t: 'resistor', r: AMMETER_R };
        else if (c.t === 'voltmeter') cc = { t: 'resistor', r: VOLTMETER_R };
        else if (c.t === 'switch' || c.t === 'push') cc = { t: 'switch', on: o !== null ? !!o : isOn(c) };
        if (cc) { cc.a = key(c.id, 'a'); cc.b = key(c.id, 'b'); list.push(cc); map.push(c.id); }
        else if (c.t === 'spdt') { var pos = o !== null ? o : c.pos; list.push({ t: 'wire', a: key(c.id, 'c'), b: key(c.id, pos === 2 ? 't2' : 't1') }); map.push(c.id); }
      });
      wires().forEach(function (w) { list.push({ t: 'wire', a: key(w.a.c, w.a.p), b: key(w.b.c, w.b.p) }); map.push(null); });
      return { list: list, map: map };
    }
    function solve(over) {
      var cc = toCalcElec(over);
      if (!cc.list.some(function (x) { return x.t !== 'wire'; })) return null;
      var r = C.solveElec(cc.list), byId = {};
      cc.map.forEach(function (id, i) { if (id !== null && r.comps[i]) byId[id] = r.comps[i]; });
      r.byId = byId; return r;
    }
    /* Lógica: cada componente recibe una posición virtual propia; así solo conectan los cables. */
    function vpos(i) { return [i * 10 + 5, 5]; }
    function calcPin(c, i, p) {
      var v = vpos(i), x = v[0], y = v[1];
      if (GATE2[c.t]) return { in1: [x, y - 1], in2: [x, y + 1], o: [x + 2, y] }[p];
      if (c.t === 'not') return { in1: [x, y], o: [x + 2, y] }[p];
      if (c.t === 'dff') return { d: [x, y - 1], clk: [x, y + 1], q: [x + 2, y - 1], qn: [x + 2, y + 1] }[p];
      return [x, y];
    }
    function toCalcLogic() {
      var idx = {}, list = [];
      comps().forEach(function (c, i) { idx[c.id] = i; var o = { t: c.t, p: vpos(i) }; if (c.t === 'input') { o.v = c.v ? 1 : 0; o.label = c.label; } if (c.t === 'out') o.label = c.label; list.push(o); });
      wires().forEach(function (w) { var ca = compById(w.a.c), cb = compById(w.b.c); if (!ca || !cb) return; list.push({ t: 'wire', a: calcPin(ca, idx[ca.id], w.a.p), b: calcPin(cb, idx[cb.id], w.b.p) }); });
      return { list: list, idx: idx };
    }
    function logicSim() {
      var cl = toCalcLogic(), L = new C.Logic(cl.list);
      comps().forEach(function (c, i) { if (c.t === 'dff') L.state[i] = dffState[c.id] ? 1 : 0; });
      return { L: L, cl: cl };
    }
    function compute() {
      if (mode() === 'elec') { res = comps().length ? solve() : null; lres = null; }
      else { var s = logicSim(); lres = { sim: s, v: s.L.values(null, false) }; res = null; }
    }
    function pulse() {
      if (mode() !== 'logic') return;
      var s = logicSim(), v = s.L.pulse(null);
      comps().forEach(function (c, i) { if (c.t === 'dff') dffState[c.id] = s.L.state[i]; });
      clock.pulses += 1; lres = { sim: s, v: v };
      draw(); renderSide(); updateSummary();
      ctx.announce(t('pulsed', { n: clock.pulses }) + ' ' + outsText());
    }
    function outsText() {
      if (!lres) return '';
      return comps().map(function (c, i) { return c.t === 'out' ? c.label + ' = ' + (lres.v.out[i] === null ? '—' : lres.v.out[i]) : null; }).filter(Boolean).join(', ');
    }
    function netOfPin(ref) {
      if (!lres) return null; var c = compById(ref.c); if (!c) return null;
      var i = lres.sim.cl.idx[c.id]; return lres.v.net(C.pk(calcPin(c, i, ref.p)));
    }
    function setClock(on) {
      root.clearInterval(clock.timer); clock.on = !!on && mode() === 'logic';
      if (clock.on) clock.timer = root.setInterval(pulse, 1000 / clock.hz);
      syncPrimary(); renderHud();
      ctx.announce(clock.on ? t('clockOn', { f: num(clock.hz, 2) }) : t('clockOff'));
    }

    /* ---------- Vista ---------- */
    var svg = D.createElementNS(SVGNS, 'svg'); svg.setAttribute('class', 'igc-svg'); svg.setAttribute('aria-hidden', 'true');
    var world = el('g', {}, svg), overlay = el('g', {}, svg);
    ctx.viewport.appendChild(svg); ctx.viewport.classList.add('igc-viewport');
    var view = new ctx.View2D({ scale: 36, min: 8, max: 160, onChange: draw });
    ctx.attachViewGestures(ctx.viewport, view, { isPanTool: function () { return tool === 'pan'; } });
    var zoomBox = h('div', { class: 'igs-zoom' },
      ctx.button(t('zoomOut'), { icon: 'minus', onClick: function () { zoomCenter(1 / 1.25); } }),
      ctx.button(t('zoomFit'), { icon: 'fit', onClick: function () { fit(); } }),
      ctx.button(t('zoomIn'), { icon: 'plus', onClick: function () { zoomCenter(1.25); } }));
    var hud = h('div', { class: 'igs-hud' });
    ctx.viewport.append(zoomBox, hud);
    function zoomCenter(f) { view.zoomAt(ctx.viewport.clientWidth / 2, ctx.viewport.clientHeight / 2, f); }
    /* Encuadre: el circuito con margen (como mínimo 12 × 8 cuadros); sin circuito, la placa entera. */
    function fit() {
      var d = BOARD[mode()], b = { minX: -0.8, minY: -0.8, maxX: d[0] + 0.8, maxY: d[1] + 0.8 };
      if (comps().length) {
        var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        comps().forEach(function (c) { var q = compBox(c); x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[2]); y1 = Math.max(y1, q[3]); });
        var cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, w = Math.max(12, x1 - x0 + 4), hh = Math.max(8, y1 - y0 + 4);
        b = { minX: Math.max(-0.8, cx - w / 2), maxX: Math.min(d[0] + 0.8, cx + w / 2), minY: Math.max(-0.8, cy - hh / 2), maxY: Math.min(d[1] + 0.8, cy + hh / 2) };
      }
      view.fit(b, ctx.viewport.clientWidth || 600, ctx.viewport.clientHeight || 400, 12);
    }
    if (root.ResizeObserver) new ResizeObserver(function () { draw(); }).observe(ctx.viewport);
    function el(name, attrs, parent) { var e = D.createElementNS(SVGNS, name); Object.keys(attrs || {}).forEach(function (k) { if (attrs[k] !== null && attrs[k] !== undefined) e.setAttribute(k, attrs[k]); }); if (parent) parent.appendChild(e); return e; }
    function txt(parent, x, y, s, size, opts) {
      opts = opts || {};
      var e = el('text', { x: x, y: y, 'font-size': size, 'font-family': FONT, 'font-weight': opts.weight || 700, fill: opts.fill || INK, 'text-anchor': opts.anchor || 'middle', 'dominant-baseline': 'middle',
        'paint-order': 'stroke', stroke: opts.halo === false ? 'none' : '#fff', 'stroke-width': size * 0.3, 'stroke-linejoin': 'round' }, parent);
      e.textContent = s; return e;
    }
    function ln(g, pts, attrs) { var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0] + ',' + p[1]; }).join(''); return el('path', Object.assign({ d: d, fill: 'none', 'vector-effect': 'non-scaling-stroke', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, attrs), g); }

    function draw() {
      while (world.firstChild) world.removeChild(world.firstChild);
      while (overlay.firstChild) overlay.removeChild(overlay.firstChild);
      world.setAttribute('transform', 'translate(' + view.x + ',' + view.y + ') scale(' + view.scale + ')');
      drawScene(world, view.scale, false);
      if (kcVisible) {
        var p = view.toScreen(cursor.x, cursor.y);
        el('circle', { cx: p.x, cy: p.y, r: 11, fill: 'none', stroke: '#a8336f', 'stroke-width': 2.5 }, overlay);
      }
      if (pending) {
        var a = pinPos(pending), tgt = kcVisible ? [cursor.x, cursor.y] : hover;
        if (a && tgt) { var pa = view.toScreen(a[0], a[1]), pb = view.toScreen(tgt[0], tgt[1]); el('path', { d: 'M' + pa.x + ',' + pa.y + 'L' + pb.x + ',' + pa.y + 'L' + pb.x + ',' + pb.y, fill: 'none', stroke: VIOLET, 'stroke-width': 3, 'stroke-dasharray': '7 5' }, overlay); }
        if (a) { var pp = view.toScreen(a[0], a[1]); el('circle', { cx: pp.x, cy: pp.y, r: 9, fill: 'none', stroke: VIOLET, 'stroke-width': 3 }, overlay); }
      }
      renderHud();
    }
    function drawScene(g, s, exporting) {
      var d = BOARD[mode()], fs = 12 / s;
      el('rect', { x: -0.6, y: -0.6, width: d[0] + 1.2, height: d[1] + 1.2, fill: mode() === 'elec' ? '#fbfaf6' : '#f7f9fc', rx: 0.3 }, g);
      if (!exporting) { var dots = ''; for (var gx = 0; gx <= d[0]; gx++) for (var gy = 0; gy <= d[1]; gy++) dots += 'M' + gx + ',' + gy + 'h0'; el('path', { d: dots, stroke: '#9fb2c5', 'stroke-width': 3, 'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke' }, g); }
      wires().forEach(function (w) { drawWire(g, w, s, exporting); });
      comps().forEach(function (c) { if (mode() === 'elec') drawElec(g, c, s, exporting); else drawLogic(g, c, s, exporting); });
      /* terminales */
      comps().forEach(function (c) {
        var P = pinsOf(c);
        Object.keys(P).forEach(function (k) {
          var p = P[k], isPend = pending && pending.c === c.id && pending.p === k;
          el('circle', { cx: p[0], cy: p[1], r: 0.11, fill: isPend ? VIOLET : NAVY }, g);
          if (!exporting) el('circle', { cx: p[0], cy: p[1], r: 0.38, fill: 'transparent', 'data-pin': c.id + ':' + k }, g);
        });
      });
      if (sel && sel.k === 'c' && !exporting) { var c2 = compById(sel.id); if (c2) { var b = compBox(c2); el('rect', { x: b[0] - 0.3, y: b[1] - 0.3, width: b[2] - b[0] + 0.6, height: b[3] - b[1] + 0.6, rx: 0.2, fill: 'none', stroke: VIOLET, 'stroke-width': 2, 'stroke-dasharray': '6 4', 'vector-effect': 'non-scaling-stroke' }, g); } }
      void fs;
    }
    function compBox(c) {
      var P = pinsOf(c), xs = [], ys = []; Object.keys(P).forEach(function (k) { xs.push(P[k][0]); ys.push(P[k][1]); });
      if (c.t === 'input' || c.t === 'clock') { xs.push(c.x - 0.6); ys.push(c.y - 0.5, c.y + 0.5); }
      if (c.t === 'out') { xs.push(c.x + 0.5); ys.push(c.y - 0.5, c.y + 0.5); }
      if (ELEC.indexOf(c.t) >= 0 && c.t !== 'spdt') { var r = (c.rot || 0) % 180 === 0; if (r) ys.push(c.y - 0.5, c.y + 0.5); else xs.push(c.x - 0.5, c.x + 0.5); }
      if (c.t === 'dff' || GATE2[c.t]) ys.push(c.y - 1.5, c.y + 1.5);
      return [Math.min.apply(null, xs), Math.min.apply(null, ys), Math.max.apply(null, xs), Math.max.apply(null, ys)];
    }
    /* Corriente por un cable: se deduce del componente de un extremo si ese terminal solo tiene este cable. */
    function wireFlow(w) {
      if (!res || !res.ok) return { live: false };
      function wiresAt(ref) { return wires().filter(function (x) { return (x.a.c === ref.c && x.a.p === ref.p) || (x.b.c === ref.c && x.b.p === ref.p); }).length; }
      function out(ref) { var c = compById(ref.c), r = res.byId[ref.c]; if (!c || !r || r.i === null || c.t === 'spdt' || c.t === 'switch' || c.t === 'push') return null; var i = c.t === 'battery' ? r.i : r.i; if (Math.abs(i) < 0.001) return 0; return ref.p === 'b' ? i : -i; }
      var oa = wiresAt(w.a) === 1 ? out(w.a) : null, ob = wiresAt(w.b) === 1 ? out(w.b) : null;
      var i = oa !== null ? oa : ob !== null ? -ob : null;
      var live = i !== null ? Math.abs(i) >= 0.001 : [w.a, w.b].some(function (ref) { var r = res.byId[ref.c]; return r && r.i !== null && Math.abs(r.i) >= 0.001; });
      return { live: live, i: i };
    }
    function drawWire(g, w, s, exporting) {
      var pts = wirePath(w); if (!pts) return;
      var selected = sel && sel.k === 'w' && sel.id === w.id, attrs = { stroke: NAVY, 'stroke-width': 2.5 }, flow = null;
      if (mode() === 'elec') { flow = wireFlow(w); if (flow.live) attrs = { stroke: LIVE, 'stroke-width': 4 }; }
      else if (lres) { var v = netOfPin(w.a); attrs = v === 1 ? { stroke: ONE, 'stroke-width': 4.5 } : v === 0 ? { stroke: '#6b7886', 'stroke-width': 2.5, 'stroke-dasharray': '7 5' } : { stroke: '#a9b6c3', 'stroke-width': 2, 'stroke-dasharray': '2 5' }; }
      if (selected) ln(g, pts, { stroke: VIOLET, 'stroke-width': 9, 'stroke-opacity': 0.35 });
      ln(g, pts, attrs);
      if (!exporting) ln(g, pts, { stroke: 'transparent', 'stroke-width': 14, 'data-wire': w.id });
      if (flow && flow.live && flow.i !== null) {
        var rev = flow.i < 0, seg = longestSeg(pts), a = seg[0], b = seg[1];
        if (rev) { var tmp = a; a = b; b = tmp; }
        var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
        el('path', { d: 'M0.2,0 L-0.14,-0.16 L-0.14,0.16Z', fill: LIVE, transform: 'translate(' + mx + ',' + my + ') rotate(' + ang + ')' }, g);
        if (flowAnim && !exporting && !ctx.reducedMotion()) ln(g, rev ? pts.slice().reverse() : pts, { stroke: '#ffffff', 'stroke-width': 2, 'stroke-dasharray': '3 11', class: 'igc-flow' });
      }
    }
    function longestSeg(pts) { var best = [pts[0], pts[1]], bl = -1; for (var i = 1; i < pts.length; i++) { var l = Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1]); if (l > bl) { bl = l; best = [pts[i - 1], pts[i]]; } } return best; }

    var LED_COL = { rojo: '#d62d20', verde: '#1e9a45', amarillo: '#e0a800', azul: '#2f6bff' };
    function drawElec(g, c, s, exporting) {
      var r = res && res.ok ? res.byId[c.id] : null, fs = 11 / s;
      var gg = el('g', { transform: 'translate(' + c.x + ',' + c.y + ') rotate(' + (c.rot || 0) + ')', 'data-sel': c.id }, g);
      var sw = { stroke: INK, 'stroke-width': 2.2 };
      function L(pts, extra) { return ln(gg, pts, Object.assign({}, sw, extra || {})); }
      el('rect', { x: -0.1, y: -0.55, width: 2.2, height: 1.1, fill: 'transparent' }, gg);
      if (c.t === 'spdt') {
        L([[0, 0], [0.35, 0]]); var tgt = c.pos === 2 ? [1.55, 0.95] : [1.55, -0.95]; L([[0.35, 0], tgt]);
        L([[1.6, -1], [2, -1]]); L([[1.6, 1], [2, 1]]);
        el('circle', { cx: 0.35, cy: 0, r: 0.07, fill: INK }, gg);
      } else if (c.t === 'battery') {
        L([[0, 0], [0.88, 0]]); L([[1.12, 0], [2, 0]]);
        L([[0.88, -0.22], [0.88, 0.22]], { 'stroke-width': 5 }); L([[1.12, -0.45], [1.12, 0.45]]);
        txt(gg, 1.4, -0.45, '+', fs * 1.3, { fill: BAD });
        if (r && r.short) el('rect', { x: 0.55, y: -0.6, width: 0.9, height: 1.2, fill: 'none', stroke: BAD, 'stroke-width': 3, 'stroke-dasharray': '4 3', 'vector-effect': 'non-scaling-stroke' }, gg);
      } else if (c.t === 'resistor') {
        L([[0, 0], [0.4, 0]]); L([[1.6, 0], [2, 0]]);
        el('rect', { x: 0.4, y: -0.22, width: 1.2, height: 0.44, fill: r && r.hot ? '#f7c9a9' : '#fff', stroke: INK, 'stroke-width': 2.2, 'vector-effect': 'non-scaling-stroke' }, gg);
      } else if (c.t === 'lamp') {
        L([[0, 0], [0.58, 0]]); L([[1.42, 0], [2, 0]]);
        var br = r && !r.burnt ? Math.min(1, r.bright || 0) : 0;
        if (br > 0.02) el('circle', { cx: 1, cy: 0, r: 0.42 + 0.35 * br, fill: '#ffd24d', 'fill-opacity': 0.25 + 0.45 * br }, gg);
        el('circle', { cx: 1, cy: 0, r: 0.42, fill: r && r.burnt ? '#b8bec6' : br > 0.02 ? 'rgb(255,' + Math.round(236 - 40 * br) + ',140)' : '#fff', stroke: INK, 'stroke-width': 2.2, 'vector-effect': 'non-scaling-stroke' }, gg);
        L([[0.7, -0.3], [1.3, 0.3]]); L([[1.3, -0.3], [0.7, 0.3]]);
        if (r && r.burnt) L([[0.55, -0.55], [1.45, 0.55]], { stroke: BAD, 'stroke-width': 3 });
      } else if (c.t === 'led') {
        L([[0, 0], [0.7, 0]]); L([[1.3, 0], [2, 0]]);
        var lit = r && r.lit && !r.burnt, col = LED_COL[c.color] || LED_COL.rojo;
        if (lit) el('circle', { cx: 1, cy: 0, r: 0.6, fill: col, 'fill-opacity': 0.25 }, gg);
        el('path', { d: 'M0.7,-0.32 L1.3,0 L0.7,0.32Z', fill: lit ? col : '#fff', stroke: INK, 'stroke-width': 2.2, 'vector-effect': 'non-scaling-stroke' }, gg);
        L([[1.3, -0.32], [1.3, 0.32]]);
        L([[1.05, -0.38], [1.35, -0.68]], { 'stroke-width': 1.6 }); L([[1.3, -0.35], [1.6, -0.65]], { 'stroke-width': 1.6 });
        el('path', { d: 'M1.35,-0.68 l-0.12,0.02 l0.1,0.1Z M1.6,-0.65 l-0.12,0.02 l0.1,0.1Z', fill: INK }, gg);
        if (r && r.burnt) L([[0.55, -0.5], [1.45, 0.5]], { stroke: BAD, 'stroke-width': 3 });
      } else if (c.t === 'switch' || c.t === 'push') {
        var on = isOn(c);
        L([[0, 0], [0.5, 0]]); L([[1.5, 0], [2, 0]]);
        el('circle', { cx: 0.5, cy: 0, r: 0.07, fill: INK }, gg); el('circle', { cx: 1.5, cy: 0, r: 0.07, fill: INK }, gg);
        if (c.t === 'switch') L(on ? [[0.5, 0], [1.5, 0]] : [[0.5, 0], [1.42, -0.5]]);
        else {
          var yb = on ? 0 : -0.28; L([[0.5, yb], [1.5, yb]]); L([[1, yb], [1, -0.72]], { 'stroke-dasharray': '3 3', 'stroke-width': 1.6 }); L([[0.8, -0.72], [1.2, -0.72]]);
        }
      } else if (c.t === 'motor' || c.t === 'ammeter' || c.t === 'voltmeter') {
        L([[0, 0], [0.55, 0]]); L([[1.45, 0], [2, 0]]);
        el('circle', { cx: 1, cy: 0, r: 0.45, fill: '#fff', stroke: INK, 'stroke-width': 2.2, 'vector-effect': 'non-scaling-stroke' }, gg);
        var gl = el('g', { transform: 'translate(1,0) rotate(' + (-(c.rot || 0)) + ')' }, gg);
        txt(gl, 0, 0.02, c.t === 'motor' ? 'M' : c.t === 'ammeter' ? 'A' : 'V', 0.5, { halo: false });
        if (c.t === 'motor' && r && r.spin) { var dir = r.dir > 0; ln(gl, [[-0.32, -0.62], [0, -0.72], [0.32, -0.62]], { stroke: '#1d6b3a', 'stroke-width': 2.2 }); el('path', { d: dir ? 'M0.42,-0.58 l-0.18,-0.1 l0.02,0.2Z' : 'M-0.42,-0.58 l0.18,-0.1 l-0.02,0.2Z', fill: '#1d6b3a' }, gl); }
      }
      /* etiqueta con el valor */
      var lab = shortInfo(c, r);
      if (lab) {
        var P = pinsOf(c), a = P.a || P.c, b = P.b || P.c, vertical = P.b ? a[0] === b[0] : (c.rot || 0) % 180 !== 0, mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
        txt(g, vertical ? mx + 0.85 : mx, vertical ? my : my + 0.8, lab, fs, { anchor: vertical ? 'start' : 'middle', fill: r && (r.burnt || r.short) ? BAD : INK });
      }
      void exporting;
    }
    function fmtI(i) { var a = Math.abs(i); return a >= 1 ? num(a, 2) + ' A' : num(a * 1000, a * 1000 < 10 ? 1 : 0) + ' mA'; }
    function ohm(v) { return v >= 1e6 ? num(v / 1e6, 1) + ' MΩ' : v >= 1000 ? num(v / 1000, 2) + ' kΩ' : num(v, 0) + ' Ω'; }
    function shortInfo(c, r) {
      if (c.t === 'battery') return (r && r.short ? t('shortShort') + ' · ' : '') + num(C.BATTERIES[c.kind].v, 1) + ' V';
      if (c.t === 'resistor') return ohm(c.r);
      if (c.t === 'spdt') return t('posN', { n: c.pos });
      if (!r) return c.t === 'led' ? t('led_' + c.color) : '';
      if (c.t === 'lamp') return r.burnt ? t('burnt') : num(Math.min(150, r.bright * 100), 0) + ' %';
      if (c.t === 'led') return r.burnt ? t('burnt') : r.lit ? fmtI(r.i) : r.reverse ? t('reverseShort') : t('off');
      if (c.t === 'motor') return r.spin ? num(r.rpm, 0) + ' rpm' : t('stoppedM');
      if (c.t === 'ammeter') return fmtI(r.i);
      if (c.t === 'voltmeter') return num(Math.abs(r.v), 2) + ' V';
      return '';
    }
    var GSYM = { and: '&', or: '≥1', xor: '=1', nand: '&', nor: '≥1', not: '1' };
    function drawLogic(g, c) {
      var v = lres ? lres.v : null, i = lres ? lres.sim.cl.idx[c.id] : -1;
      var gg = el('g', { 'data-sel': c.id }, g), sw = { stroke: INK, 'stroke-width': 2.2 };
      if (c.t === 'input' || c.t === 'clock') {
        var on = c.t === 'input' ? !!c.v : false;
        el('rect', { x: c.x - 0.6, y: c.y - 0.45, width: 1.2, height: 0.9, rx: 0.12, fill: on ? '#ffd24d' : '#fff', stroke: INK, 'stroke-width': 2.2, 'vector-effect': 'non-scaling-stroke' }, gg);
        ln(gg, [[c.x + 0.6, c.y], [c.x + 1, c.y]], sw);
        if (c.t === 'clock') { ln(gg, [[c.x - 0.4, c.y + 0.2], [c.x - 0.2, c.y + 0.2], [c.x - 0.2, c.y - 0.2], [c.x, c.y - 0.2], [c.x, c.y + 0.2], [c.x + 0.2, c.y + 0.2], [c.x + 0.2, c.y - 0.2], [c.x + 0.4, c.y - 0.2]], { stroke: INK, 'stroke-width': 1.8 }); txt(g, c.x, c.y - 0.8, t('clockShort'), 0.38); }
        else { txt(gg, c.x, c.y + 0.02, on ? '1' : '0', 0.5, { halo: false }); txt(g, c.x - 0.1, c.y - 0.8, c.label, 0.42); }
        return;
      }
      if (c.t === 'out') {
        var val = v ? v.out[i] : null;
        ln(gg, [[c.x - 1, c.y], [c.x - 0.45, c.y]], sw);
        if (val === 1) el('circle', { cx: c.x, cy: c.y, r: 0.7, fill: '#ffd24d', 'fill-opacity': 0.4 }, gg);
        el('circle', { cx: c.x, cy: c.y, r: 0.45, fill: val === 1 ? '#ffd24d' : '#fff', stroke: INK, 'stroke-width': 2.2, 'vector-effect': 'non-scaling-stroke' }, gg);
        txt(gg, c.x, c.y + 0.02, val === 1 ? '1' : val === 0 ? '0' : '?', 0.45, { halo: false }); txt(g, c.x + 0.1, c.y - 0.85, c.label, 0.42);
        return;
      }
      var P = pinsOf(c), dff = c.t === 'dff', x0 = c.x + 0.35, x1 = c.x + 1.65, y0 = c.y - (dff ? 1.55 : c.t === 'not' ? 0.7 : 1.4), y1 = c.y + (dff ? 1.55 : c.t === 'not' ? 0.7 : 1.4);
      var neg = c.t === 'not' || c.t === 'nand' || c.t === 'nor';
      Object.keys(P).forEach(function (k) { var p = P[k], left = p[0] < c.x + 1; ln(gg, [p, [left ? x0 : x1 + (neg && k === 'o' || k === 'qn' ? 0.16 : 0), p[1]]], sw); });
      var outOn = v && v.gateOut && v.gateOut[i] === 1;
      el('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, fill: dff ? '#eef3fb' : outOn ? '#fff4d6' : '#fff', stroke: INK, 'stroke-width': 2.2, 'vector-effect': 'non-scaling-stroke' }, gg);
      if (neg) el('circle', { cx: x1 + 0.08, cy: c.y, r: 0.08, fill: '#fff', stroke: INK, 'stroke-width': 2, 'vector-effect': 'non-scaling-stroke' }, gg);
      if (dff) {
        txt(gg, x0 + 0.08, c.y - 1, '1D', 0.36, { anchor: 'start', halo: false });
        el('path', { d: 'M' + x0 + ',' + (c.y + 0.82) + ' l0.2,0.18 l-0.2,0.18', fill: 'none', stroke: INK, 'stroke-width': 1.6, 'vector-effect': 'non-scaling-stroke' }, gg);
        txt(gg, x0 + 0.26, c.y + 1, 'C1', 0.36, { anchor: 'start', halo: false });
        txt(gg, x1 - 0.08, c.y - 1, 'Q', 0.36, { anchor: 'end', halo: false });
        el('circle', { cx: x1 + 0.08, cy: c.y + 1, r: 0.08, fill: '#fff', stroke: INK, 'stroke-width': 2, 'vector-effect': 'non-scaling-stroke' }, gg);
      } else txt(gg, (x0 + x1) / 2, y0 + 0.4, GSYM[c.t], 0.48, { halo: false });
      txt(g, (x0 + x1) / 2, y1 + 0.35, t('gate_' + c.t), 0.32, { weight: 600, fill: '#44586c' });
    }
    function renderHud() {
      ctx.clear(hud);
      hud.appendChild(h('span', { text: t('mode_' + mode()) }));
      if (pending) hud.appendChild(h('span', { text: t('wireFrom', { p: pinName(pending) }) }));
      if (mode() === 'elec' && res && res.short) hud.appendChild(h('span', { class: 'igc-bad', text: t('shortShortCap') }));
      if (clock.on) hud.appendChild(h('span', { text: t('clockRunning', { f: num(clock.hz, 2), n: clock.pulses }) }));
      var ch = chById(S.challenge);
      if (ch && ch.mode === mode()) { var ck = checks(ch); hud.appendChild(h('span', { text: ck.all ? '✓ ' + t('chDone') : t('chProgress', { a: ck.list.filter(function (x) { return x[0]; }).length, b: ck.list.length }) })); }
    }

    /* ---------- Edición ---------- */
    function nextLabel(kind) {
      var used = {}; comps().forEach(function (c) { if (c.label) used[c.label] = 1; });
      var pool = kind === 'input' ? 'ABCDEFGHIJK'.split('') : ['S', 'C', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6'];
      for (var i = 0; i < pool.length; i++) if (!used[pool[i]]) return pool[i];
      return (kind === 'input' ? 'X' : 'L') + comps().length;
    }
    function lim() { var ch = chById(S.challenge); return ch && ch.mode === mode() && ch.lim ? ch.lim : null; }
    function addComp(type, x, y, extra) {
      if (comps().length >= 120) { ctx.announce(t('tooMany')); return null; }
      var d = doc(); d.seq += 1;
      var c = { id: (mode() === 'elec' ? 'e' : 'g') + d.seq, t: type, x: x, y: y };
      if (ELEC.indexOf(type) >= 0) c.rot = 0;
      if (type === 'battery') c.kind = lim() && lim().battery ? lim().battery : 'pack';
      if (type === 'resistor') c.r = 330;
      if (type === 'led') c.color = 'rojo';
      if (type === 'switch') c.on = false;
      if (type === 'spdt') c.pos = 1;
      if (type === 'input') { c.v = 0; c.label = nextLabel('input'); }
      if (type === 'out') c.label = nextLabel('out');
      Object.keys(extra || {}).forEach(function (k) { c[k] = extra[k]; });
      comps().push(c); return c;
    }
    function fits(c) {
      var d = BOARD[mode()], b = compBox(c);
      return b[0] >= -0.01 && b[1] >= -1.6 && b[2] <= d[0] + 0.01 && b[3] <= d[1] + 1.6 && Object.keys(pinsOf(c)).every(function (k) { var p = pinsOf(c)[k]; return p[0] >= 0 && p[1] >= 0 && p[0] <= d[0] && p[1] <= d[1]; });
    }
    function placeAt(x, y) {
      var c = addComp(addType[mode()], x, y);
      if (!c) return;
      if (!fits(c)) { comps().pop(); ctx.announce(t('noRoom')); return; }
      sel = { k: 'c', id: c.id }; changed(t('placed', { p: compName(c) }));
    }
    function sameRef(a, b) { return a.c === b.c && a.p === b.p; }
    function addWire(a, b) {
      if (sameRef(a, b)) { ctx.announce(t('cancelled')); return null; }
      if (wires().some(function (w) { return (sameRef(w.a, a) && sameRef(w.b, b)) || (sameRef(w.a, b) && sameRef(w.b, a)); })) { ctx.announce(t('wireExists')); return null; }
      if (wires().length >= 300) { ctx.announce(t('tooMany')); return null; }
      var d = doc(); d.seq += 1; var w = { id: 'w' + d.seq, a: { c: a.c, p: a.p }, b: { c: b.c, p: b.p }, bend: 0 };
      wires().push(w); return w;
    }
    function pinAction(ref) {
      if (!pending) { pending = ref; ctx.announce(t('wireStart', { p: pinName(ref) })); draw(); renderHud(); return; }
      var a = pending; pending = null;
      var w = addWire(a, ref); if (w) { sel = { k: 'w', id: w.id }; changed(t('wireAdded', { a: pinName(a), b: pinName(ref) })); } else draw();
    }
    function toggle(c) {
      if (!c) return;
      if (c.t === 'switch') c.on = !c.on;
      else if (c.t === 'spdt') c.pos = c.pos === 2 ? 1 : 2;
      else if (c.t === 'input') c.v = c.v ? 0 : 1;
      else if (c.t === 'clock') { pulse(); return; }
      else if (c.t === 'push') { held[c.id] = !held[c.id]; compute(); draw(); renderSide(); updateSummary(); ctx.announce(describe(c)); return; }
      else { ctx.announce(t('nothingToUse')); return; }
      changed(describe(c));
    }
    function removeComp(id) {
      var c = compById(id), name = compName(c);
      doc().comps = comps().filter(function (x) { return x.id !== id; });
      doc().wires = wires().filter(function (w) { return w.a.c !== id && w.b.c !== id; });
      delete dffState[id]; delete held[id]; delete pressed[id];
      if (pending && pending.c === id) pending = null;
      sel = null; changed(t('deleted', { name: name }));
    }
    function removeWire(id) { doc().wires = wires().filter(function (w) { return w.id !== id; }); sel = null; changed(t('wireDeleted')); }
    function deleteSelection() { if (!sel) return; if (sel.k === 'c') removeComp(sel.id); else removeWire(sel.id); }
    function moveComp(c, dx, dy) {
      var ox = c.x, oy = c.y; c.x += dx; c.y += dy;
      if (!fits(c)) { c.x = ox; c.y = oy; ctx.announce(t('noRoom')); return false; }
      return true;
    }
    function rotate(c, dir) { if (ELEC.indexOf(c.t) < 0) { ctx.announce(t('noRotate')); return; } var o = c.rot; c.rot = ((c.rot || 0) + (dir < 0 ? 270 : 90)) % 360; if (!fits(c)) { c.rot = o; ctx.announce(t('noRoom')); return; } changed(t('rotated', { a: c.rot })); }

    /* ---------- Puntero ---------- */
    var hover = null, drag = null;
    function gridFromEvent(e) { var r = svg.getBoundingClientRect(), w = view.toWorld(e.clientX - r.left, e.clientY - r.top), d = BOARD[mode()]; return [clamp(Math.round(w.x), 0, d[0]), clamp(Math.round(w.y), 0, d[1])]; }
    function hitTarget(e) {
      var pinEl = e.target.closest && e.target.closest('[data-pin]'), wireEl = e.target.closest && e.target.closest('[data-wire]'), compEl = e.target.closest && e.target.closest('[data-sel]');
      return { pin: pinEl ? { c: pinEl.getAttribute('data-pin').split(':')[0], p: pinEl.getAttribute('data-pin').split(':')[1] } : null, wire: wireEl ? wireEl.getAttribute('data-wire') : null, comp: compEl ? compEl.getAttribute('data-sel') : null };
    }
    svg.addEventListener('pointerdown', function (e) {
      if (e.button > 0) return;
      ctx.viewport.focus({ preventScroll: true }); kcVisible = false;
      var g = gridFromEvent(e), hit = hitTarget(e); cursor = { x: g[0], y: g[1] };
      if (tool === 'wire') { if (hit.pin) pinAction(hit.pin); else ctx.announce(t('noPinHere')); return; }
      if (tool === 'place') { placeAt(g[0], g[1]); return; }
      if (tool === 'erase') { if (hit.comp) removeComp(hit.comp); else if (hit.wire) removeWire(hit.wire); return; }
      if (tool === 'use') {
        var c = hit.comp ? compById(hit.comp) : null;
        if (c && c.t === 'push') { pressed[c.id] = true; compute(); draw(); renderSide(); updateSummary(); svg.setPointerCapture(e.pointerId); drag = { push: c.id }; ctx.announce(t('pushDown')); return; }
        if (c) toggle(c); else ctx.announce(t('nothingHere')); return;
      }
      if (tool !== 'select') return;
      if (hit.comp) { select({ k: 'c', id: hit.comp }); var cc = compById(hit.comp); drag = { id: hit.comp, start: g, ox: cc.x, oy: cc.y, moved: false }; svg.setPointerCapture(e.pointerId); }
      else if (hit.wire) select({ k: 'w', id: hit.wire });
      else select(null);
    });
    svg.addEventListener('pointermove', function (e) {
      var g = gridFromEvent(e);
      if (drag && drag.id) { var c = compById(drag.id), nx = drag.ox + g[0] - drag.start[0], ny = drag.oy + g[1] - drag.start[1]; if (nx !== c.x || ny !== c.y) { var ox = c.x, oy = c.y; c.x = nx; c.y = ny; if (!fits(c)) { c.x = ox; c.y = oy; } else { drag.moved = true; draw(); } } return; }
      if (pending && (!hover || hover[0] !== g[0] || hover[1] !== g[1])) { hover = g; draw(); }
    });
    function endDrag() {
      if (!drag) return; var d = drag; drag = null;
      if (d.push) { pressed[d.push] = false; compute(); draw(); renderSide(); updateSummary(); ctx.announce(t('pushUp')); return; }
      if (d.moved) changed(t('moved'));
    }
    svg.addEventListener('pointerup', endDrag); svg.addEventListener('pointercancel', endDrag);

    /* ---------- Teclado ---------- */
    var keyTimer = 0, spaceHeld = null;
    function onKey(e) {
      if (!ctx.viewport.contains(e.target)) return false;
      var k = e.key, big = e.shiftKey ? 3 : 1, d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[k];
      if (d) {
        kcVisible = true;
        var c = sel && sel.k === 'c' ? compById(sel.id) : null;
        if (c && tool === 'select') {
          if (moveComp(c, d[0] * big, d[1] * big)) { cursor = { x: c.x, y: c.y }; draw(); ctx.announce(describe(c)); root.clearTimeout(keyTimer); keyTimer = root.setTimeout(function () { changed(t('moved'), true); }, 450); }
          return true;
        }
        var bd = BOARD[mode()]; cursor.x = clamp(cursor.x + d[0] * big, 0, bd[0]); cursor.y = clamp(cursor.y + d[1] * big, 0, bd[1]);
        draw(); announceCursor(); return true;
      }
      if (k === 'Enter' || (k === ' ' && tool !== 'use')) { kcVisible = true; keyAct(); return true; }
      if (k === ' ' && tool === 'use') { var c3 = compAt(cursor.x, cursor.y); if (c3 && c3.t === 'push') { if (!spaceHeld) { spaceHeld = c3.id; pressed[c3.id] = true; compute(); draw(); renderSide(); ctx.announce(t('pushDown')); } return true; } keyAct(); return true; }
      if (k === 'Escape') { if (pending) { pending = null; draw(); renderHud(); ctx.announce(t('cancelled')); return true; } if (sel) { select(null); ctx.announce(t('deselected')); return true; } return false; }
      if (k === 'Delete' || k === 'Backspace') { deleteSelection(); return true; }
      if (k === '+' || k === '=') { zoomCenter(1.25); return true; }
      if (k === '-' || k === '_') { zoomCenter(0.8); return true; }
      if (k === '0') { fit(); return true; }
      if (e.ctrlKey || e.metaKey || e.altKey) return false;
      var lk = k.toLowerCase();
      if (lk === 'r' && sel && sel.k === 'c') { rotate(compById(sel.id), e.shiftKey ? -1 : 1); return true; }
      if (lk === 'n') { var list = comps().map(function (c2) { return { k: 'c', id: c2.id }; }).concat(wires().map(function (w) { return { k: 'w', id: w.id }; })); if (!list.length) return true; var i = -1; list.forEach(function (x, j) { if (sel && x.k === sel.k && x.id === sel.id) i = j; }); select(list[(i + (e.shiftKey ? -1 : 1) + list.length) % list.length]); var s2 = sel && sel.k === 'c' ? compById(sel.id) : null; if (s2) cursor = { x: s2.x, y: s2.y }; draw(); return true; }
      var map = { p: 'place', c: 'wire', u: 'use', e: 'select', b: 'erase' };
      if (map[lk]) { ctx.selectTool(map[lk]); ctx.announce(t('tool_' + map[lk]) + '. ' + t('toolHelp_' + map[lk])); return true; }
      if (lk === 'k' && mode() === 'logic') { pulse(); return true; }
      if (lk === 't') { primary(); return true; }
      return false;
    }
    D.addEventListener('keyup', function (e) { if (e.key === ' ' && spaceHeld) { pressed[spaceHeld] = false; spaceHeld = null; compute(); draw(); renderSide(); updateSummary(); ctx.announce(t('pushUp')); } });
    function compAt(x, y) {
      var best = null; comps().forEach(function (c) { var b = compBox(c); if (x >= b[0] - 0.01 && x <= b[2] + 0.01 && y >= b[1] - 0.01 && y <= b[3] + 0.01) best = c; });
      return best;
    }
    function wireAt(x, y) {
      var best = null; wires().forEach(function (w) { var pts = wirePath(w); if (!pts) return; for (var i = 1; i < pts.length; i++) { var a = pts[i - 1], b = pts[i]; if (x >= Math.min(a[0], b[0]) && x <= Math.max(a[0], b[0]) && y >= Math.min(a[1], b[1]) && y <= Math.max(a[1], b[1])) best = w; } });
      return best;
    }
    function announceCursor() {
      var p = pinAt(cursor.x, cursor.y), c = compAt(cursor.x, cursor.y), w = wireAt(cursor.x, cursor.y);
      var what = p ? t('terminal') + ' ' + pinName(p) : c ? describe(c) : w ? t('wireN', { a: pinName(w.a), b: pinName(w.b) }) : t('emptyPoint');
      ctx.announce(t('cursorAt', { x: cursor.x, y: cursor.y, what: what }) + (pending ? ' · ' + t('wireFrom', { p: pinName(pending) }) : ''));
    }
    function keyAct() {
      if (tool === 'wire') { var p = pinAt(cursor.x, cursor.y); if (p) pinAction(p); else ctx.announce(t('noPinHere')); return; }
      if (tool === 'place') { placeAt(cursor.x, cursor.y); return; }
      var c = compAt(cursor.x, cursor.y), w = c ? null : wireAt(cursor.x, cursor.y);
      if (tool === 'use') { if (c) toggle(c); else ctx.announce(t('nothingHere')); return; }
      if (tool === 'erase') { if (c) removeComp(c.id); else if (w) removeWire(w.id); else ctx.announce(t('nothingHere')); return; }
      if (c) select({ k: 'c', id: c.id }); else if (w) select({ k: 'w', id: w.id }); else ctx.announce(t('nothingHere'));
    }

    /* ---------- Descripciones ---------- */
    function describe(c) {
      var r = mode() === 'elec' && res && res.ok ? res.byId[c.id] : null, s = compName(c);
      if (c.t === 'battery') s += ' · ' + t('bat_' + c.kind);
      if (c.t === 'resistor') s += ' · ' + ohm(c.r);
      if (c.t === 'led') s += ' · ' + t('led_' + c.color);
      if (c.t === 'switch') s += ' · ' + (c.on ? t('swClosed') : t('swOpen'));
      if (c.t === 'push') s += ' · ' + (isOn(c) ? t('pressedW') : t('releasedW'));
      if (c.t === 'spdt') s += ' · ' + t('posN', { n: c.pos });
      if (c.t === 'input') s += ' = ' + (c.v ? 1 : 0);
      if (r && r.i !== null && c.t !== 'voltmeter') s += ' · ' + fmtI(r.i);
      if (r && c.t === 'voltmeter') s += ' · ' + num(Math.abs(r.v), 2) + ' V';
      var sh = r ? shortInfo(c, r) : ''; if (sh && ['lamp', 'led', 'motor'].indexOf(c.t) >= 0) s += ' · ' + sh;
      if (mode() === 'logic' && lres && c.t === 'out') s += ' = ' + (lres.v.out[lres.sim.cl.idx[c.id]] === null ? '—' : lres.v.out[lres.sim.cl.idx[c.id]]);
      if (c.t === 'dff') s += ' · Q = ' + (dffState[c.id] ? 1 : 0);
      return s;
    }
    function updateSummary() {
      var list = comps(), s2 = t('mode_' + mode()) + '. ';
      if (!list.length) { ctx.setSummary(s2 + t('emptyBoard')); return; }
      s2 += t('summary', { n: list.length, w: wires().length }) + ' ' + list.map(function (c) { return describe(c) + ' (' + t('connections', { n: wires().filter(function (w) { return w.a.c === c.id || w.b.c === c.id; }).length }) + ')'; }).join('; ') + '.';
      if (mode() === 'elec' && res && res.short) s2 += ' ' + t('short');
      if (mode() === 'logic' && lres) s2 += ' ' + t('outputsNow', { o: outsText() || '—' });
      ctx.setSummary(s2);
    }

    /* ---------- Retos ---------- */
    function randomSpec() { return C.randomTarget(S.seed); }
    function combos() {
      var idx = comps().filter(function (c) { return c.t === 'switch' || c.t === 'spdt' || c.t === 'push'; }).slice(0, 6), out = [];
      for (var m = 0; m < (1 << idx.length); m++) { var over = {}; idx.forEach(function (c, k) { var bit = (m >> k) & 1; over[c.id] = c.t === 'spdt' ? (bit ? 2 : 1) : !!bit; }); out.push({ m: m, r: solve(over) || { ok: false, comps: [], byId: {} } }); }
      return { idx: idx, list: out };
    }
    function checkElec(ch) {
      var R = ch.rules || {}, out = [], list = comps(), cnt = function (ty) { return list.filter(function (c) { return c.t === ty; }).length; };
      var cb = combos(), okr = function (r) { return r.ok && !r.short; };
      function lamps(r) { return list.filter(function (c) { return c.t === 'lamp'; }).map(function (c) { return r.byId[c.id]; }).filter(Boolean); }
      if (R.minLamps) out.push([cnt('lamp') >= R.minLamps, t('chkLamps', { n: cnt('lamp'), m: R.minLamps })]);
      if (R.needs) R.needs.forEach(function (ty) { out.push([cnt(ty) >= 1, t('chkHas', { p: t('part_' + ty) })]); });
      if (R.spdt) out.push([cnt('spdt') >= R.spdt, t('chkHas', { p: t('part_spdt') + ' ×' + R.spdt })]);
      if (ch.lim && ch.lim.battery) out.push([list.some(function (c) { return c.t === 'battery'; }) && list.filter(function (c) { return c.t === 'battery'; }).every(function (c) { return c.kind === ch.lim.battery; }), t('chkBattery', { b: t('bat_' + ch.lim.battery) })]);
      var any = cb.list.filter(function (x) { return okr(x.r); });
      out.push([any.length === cb.list.length && cb.list.length > 0, t('chkNoShort')]);
      if (R.bright) out.push([any.some(function (x) { var L = lamps(x.r); return L.length && L.every(function (l) { return l.bright >= R.bright && !l.burnt; }); }), t('chkBright', { p: Math.round(R.bright * 100) })]);
      if (R.offToo) out.push([any.some(function (x) { var L = lamps(x.r); return L.length && L.every(function (l) { return l.bright < 0.05; }); }), t('chkOffToo')]);
      if (R.noBurn) out.push([cb.list.every(function (x) { return !x.r.ok || Object.keys(x.r.byId).every(function (k) { return !x.r.byId[k].burnt; }); }), t('chkNoBurn')]);
      if (R.led) out.push([any.some(function (x) { return list.some(function (c) { var q = x.r.byId[c.id]; return c.t === 'led' && q && q.lit && q.i >= R.led[0] && q.i <= R.led[1] && !q.burnt; }); }), t('chkLed', { a: R.led[0] * 1000, b: R.led[1] * 1000 })]);
      if (R.stair) {
        var sp = cb.idx.filter(function (c) { return c.t === 'spdt'; }), good = sp.length >= 2 && cb.list.every(function (x) { return okr(x.r); });
        if (good) { var on = {}; cb.list.forEach(function (x) { var L = lamps(x.r); on[x.m] = L.length && L[0].bright > 0.3; }); cb.list.forEach(function (x) { cb.idx.forEach(function (c, k) { if (c.t === 'spdt' && cb.list[x.m ^ (1 << k)] && on[x.m] === on[x.m ^ (1 << k)]) good = false; }); }); }
        out.push([good, t('chkStair')]);
      }
      if (R.reverse) { var fw = false, bw = false; any.forEach(function (x) { list.forEach(function (c) { var q = x.r.byId[c.id]; if (c.t === 'motor' && q && q.spin) { if (q.dir > 0) fw = true; else bw = true; } }); }); out.push([fw && bw, t('chkReverse')]); }
      return out;
    }
    function checks(ch) {
      var out = [];
      if (ch.mode !== mode()) return { list: [], all: false };
      if (ch.mode === 'elec') out = checkElec(ch);
      else {
        var cl = toCalcLogic().list;
        if (ch.traffic) { var tr = C.checkTraffic(cl, ch.traffic, 8); out.push([tr.reason !== 'labelsOut', t('chkLabels', { l: ch.traffic.join(', ') })]); out.push([comps().some(function (c) { return c.t === 'clock'; }), t('chkClock')]); if (tr.reason !== 'labelsOut') { out.push([tr.okOne, t('chkOneLight')]); out.push([tr.ok, t('chkOrder')]); } }
        else {
          var spec = ch.random ? randomSpec() : C.TARGETS[ch.target], r = C.matchTable(cl, spec);
          out.push([r.reason !== 'labelsIn' && r.reason !== 'labelsOut' && r.reason !== 'tooMany', t('chkLabels', { l: spec.ins.concat(spec.outs).join(', ') })]);
          if (r.tt) { out.push([!r.conflicts, t('chkNoConflict')]); out.push([!r.osc, t('chkNoOsc')]); out.push([r.ok, t('chkTable', { ok: r.total - r.bad, n: r.total })]); }
          if (ch.lim && ch.lim.only) { var bad = comps().filter(function (c) { return (GATE2[c.t] || c.t === 'not') && ch.lim.only.indexOf(c.t) < 0; }).length; out.push([bad === 0, t('chkOnly', { p: ch.lim.only.map(function (x) { return t('part_' + x); }).join(', ') })]); }
        }
      }
      return { list: out, all: out.length > 0 && out.every(function (x) { return x[0]; }) };
    }
    function prepareLabels(ch) {
      var spec = ch.random ? randomSpec() : ch.target ? C.TARGETS[ch.target] : { ins: [], outs: ch.traffic || [] };
      var have = {}; comps().forEach(function (c) { if (c.label) have[c.label] = 1; });
      var d = BOARD.logic;
      spec.ins.forEach(function (n, k) { if (!have[n]) addComp('input', 1, 2 + k * 3, { label: n }); });
      spec.outs.forEach(function (n, k) { if (!have[n]) addComp('out', d[0] - 1, 2 + k * 3, { label: n }); });
      if (ch.clock && !comps().some(function (c) { return c.t === 'clock'; })) addComp('clock', 1, d[1] - 2);
      changed(t('prepared'));
    }
    function targetTable(spec) {
      var tb = h('tbody');
      for (var m = 0; m < (1 << spec.ins.length); m++) {
        var bits = spec.ins.map(function (_, k) { return (m >> (spec.ins.length - 1 - k)) & 1; });
        tb.appendChild(h('tr', null, bits.map(function (b) { return h('td', { class: 'igs-numcell', text: String(b) }); }).concat(spec.f(bits).map(function (b) { return h('td', { class: 'igs-numcell igc-outcell', text: String(b) }); }))));
      }
      return h('div', { class: 'igs-table-wrap', tabindex: '0', role: 'region', 'aria-label': t('targetCap') }, h('table', { class: 'igs-table igc-tt' }, h('caption', { text: t('targetCap') }),
        h('thead', null, h('tr', null, spec.ins.map(function (x) { return h('th', { scope: 'col', text: x }); }).concat(spec.outs.map(function (x) { return h('th', { scope: 'col', class: 'igc-outcell', text: x + ' ' + t('outMark') }); })))), tb));
    }
    function applyChallenge(id) {
      var ch = chById(id); S.challenge = ch ? ch.id : null;
      if (ch && ch.mode !== mode()) setMode(ch.mode, true);
    }
    function challengeBlock() {
      var box = h('div', { class: 'igc-challenge' }), id = 'igc-ch-sel', s2 = h('select', { id: id });
      box.appendChild(h('h4', { text: t('challenge') }));
      s2.appendChild(h('option', { value: '', text: t('freeMode') }));
      [1, 2, 3, 4, 5].forEach(function (lv) {
        var og = h('optgroup', { label: t('levelN', { n: lv }) + ' · ' + t('lvl' + lv) });
        CHALLENGES.filter(function (c) { return c.level === lv; }).forEach(function (c) { og.appendChild(h('option', { value: c.id, text: t('ch_' + c.id) })); });
        s2.appendChild(og);
      });
      s2.value = S.challenge || '';
      s2.addEventListener('change', function () { applyChallenge(s2.value || null); changed(s2.value ? t('chPicked', { t: t('ch_' + s2.value) }) : t('freeMode'), false); });
      box.appendChild(h('div', { class: 'igs-field' }, h('label', { for: id, text: t('chooseChallenge') }), s2));
      var ch = chById(S.challenge);
      if (!ch) { box.appendChild(h('p', { class: 'igs-muted', text: t('freeModeText') })); return box; }
      box.appendChild(h('p', { class: 'igc-goal', text: t('chg_' + ch.id) }));
      if (ch.mode !== mode()) { box.appendChild(h('div', { class: 'igs-actions' }, ctx.button(t('goToMode', { m: t('mode_' + ch.mode) }), { onClick: function () { setMode(ch.mode); } }))); return box; }
      var acts = h('div', { class: 'igs-actions' });
      if (ch.mode === 'logic') acts.appendChild(ctx.button(t('prepare'), { icon: 'plus', onClick: function () { prepareLabels(ch); } }));
      if (ch.random) acts.appendChild(ctx.button(t('anotherTable'), { icon: 'rotate', onClick: function () { S.seed = (Math.imul(S.seed, 1103515245) + 12345) >>> 0; changed(t('newTable')); } }));
      if (acts.children.length) box.appendChild(acts);
      if (ch.target || ch.random) box.appendChild(targetTable(ch.random ? randomSpec() : C.TARGETS[ch.target]));
      var ck = checks(ch);
      box.appendChild(h('p', { class: 'igs-result', 'data-kind': ck.all ? 'ok' : 'bad' }, h('strong', { text: ck.all ? t('chDone') : t('chNotYet') })));
      var ul = h('ul', { class: 'igc-checks' });
      ck.list.forEach(function (x) { ul.appendChild(h('li', { 'data-ok': String(x[0]) }, h('span', { class: 'igc-mark', 'aria-hidden': 'true', text: x[0] ? '✓' : '·' }), h('span', { class: 'igs-sr', text: (x[0] ? t('okWord') : t('pendingWord')) + ': ' }), x[1])); });
      box.appendChild(ul);
      box.appendChild(h('p', { class: 'igs-muted' }, h('strong', { text: t('tip') + ': ' }), t('cht_' + ch.id)));
      return box;
    }

    /* ---------- Paneles ---------- */
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
    function li(label, small, current, onClick, swatch) { var b = h('button', { type: 'button', 'aria-current': String(!!current) }, swatch ? h('span', { class: 'igs-swatch', style: 'background:' + swatch }) : null, h('span', { text: label }), small ? h('small', { text: small }) : null); b.addEventListener('click', onClick); return h('li', null, b); }
    function renderSideNow() {
      var out = [h('h3', { text: t('circuitKind') })], ul = h('ul', { class: 'igs-list' });
      ['elec', 'logic'].forEach(function (md) { ul.appendChild(li(t('mode_' + md), t('countN', { n: S[md].comps.length }), md === mode(), function () { setMode(md); })); });
      out.push(ul);
      var ul2 = h('ul', { class: 'igs-list' });
      comps().forEach(function (c) { var r = res && res.ok ? res.byId[c.id] : null; ul2.appendChild(li(compName(c), shortInfo(c, r) || (c.t === 'out' && lres ? '= ' + (lres.v.out[lres.sim.cl.idx[c.id]] === null ? '—' : lres.v.out[lres.sim.cl.idx[c.id]]) : c.t === 'input' ? '= ' + (c.v ? 1 : 0) : ''), sel && sel.k === 'c' && sel.id === c.id, function () { select({ k: 'c', id: c.id }); cursor = { x: c.x, y: c.y }; }, c.t === 'led' ? LED_COL[c.color] : null)); });
      out.push(h('h3', { text: t('componentsN', { n: comps().length }) }), ul2);
      var ul3 = h('ul', { class: 'igs-list' });
      wires().forEach(function (w, i) { ul3.appendChild(li(t('wireShort', { n: i + 1 }), compName(compById(w.a.c)) + ' → ' + compName(compById(w.b.c)), sel && sel.k === 'w' && sel.id === w.id, function () { select({ k: 'w', id: w.id }); })); });
      out.push(h('h3', { text: t('wiresN', { n: wires().length }) }), ul3);
      ctx.setStructure(out);
      ctx.setInspector(inspector());
      renderHud();
    }
    function warn(text) { return h('p', { class: 'igs-result', 'data-kind': 'bad', role: 'note' }, h('strong', { text: t('warning') }), text); }
    function results(lines) { var ul = h('ul', { class: 'igc-results' }); lines.forEach(function (l) { ul.appendChild(h('li', null, l[0] ? h('span', { text: l[0] + ': ' }) : null, h('strong', { text: l[1] }))); }); return ul; }
    function allPins() {
      var out = []; comps().forEach(function (c) { Object.keys(pinsOf(c)).forEach(function (k) { out.push({ c: c.id, p: k }); }); }); return out;
    }
    /* Avisos del circuito entero: se ven con cualquier cosa elegida. */
    function globalWarnings() {
      var out = [];
      if (mode() !== 'elec' || !res || !res.ok) return out;
      if (res.short && !(sel && sel.k === 'c' && compById(sel.id) && compById(sel.id).t === 'battery')) out.push(warn(t('short')));
      comps().forEach(function (c) { var r = res.byId[c.id]; if (r && r.burnt && !(sel && sel.id === c.id)) out.push(warn(compName(c) + ': ' + t(c.t === 'led' ? 'ledBurnt' : 'lampBurnt'))); });
      return out;
    }
    function inspector() {
      var out = sel ? globalWarnings() : [];
      if (sel && sel.k === 'c' && compById(sel.id)) out = out.concat(inspComp(compById(sel.id)));
      else if (sel && sel.k === 'w' && wireById(sel.id)) out = out.concat(inspWire(wireById(sel.id)));
      else out = out.concat(inspDoc());
      out.push(challengeBlock());
      out.push(h('details', { class: 'igc-how' }, h('summary', { text: t('howCalc') }), h('p', { class: 'igs-muted', text: t('how_' + mode()) })));
      return out;
    }
    function inspComp(c) {
      var out = [h('h4', { text: compName(c) }), h('p', { class: 'igs-muted', text: t('info_' + c.t) })], r = res && res.ok ? res.byId[c.id] : null;
      if (mode() === 'elec') {
        if (r) {
          var lines = [];
          if (c.t === 'voltmeter') lines.push([t('reading'), num(Math.abs(r.v), 2) + ' V']);
          else if (c.t === 'ammeter') lines.push([t('reading'), fmtI(r.i)]);
          else if (r.i !== null && r.i !== undefined) { lines.push([t('current'), fmtI(r.i)], [t('voltage'), num(Math.abs(r.v), 2) + ' V']); if (r.p !== undefined) lines.push([t('power'), num(r.p, 3) + ' W']); }
          if (c.t === 'lamp') lines.push([t('brightness'), r.burnt ? t('burnt') : num(Math.min(150, r.bright * 100), 0) + ' %']);
          if (c.t === 'led') lines.push([t('state'), r.burnt ? t('burnt') : r.lit ? t('lit') : r.reverse ? t('reverse') : t('off')]);
          if (c.t === 'motor') lines.push([t('state'), r.spin ? num(r.rpm, 0) + ' rpm · ' + (r.dir > 0 ? t('cw') : t('ccw')) : t('stoppedM')]);
          if (lines.length) out.push(results(lines));
          if (r.burnt) out.push(warn(t(c.t === 'led' ? 'ledBurnt' : 'lampBurnt')));
          if (r.short) out.push(warn(t('short')));
          if (c.t === 'resistor' && r.hot) out.push(warn(t('resHot')));
        }
        if (c.t === 'battery') out.push(F.select(t('batteryKind'), c.kind, Object.keys(C.BATTERIES).map(function (k) { return [k, t('bat_' + k)]; }), { onChange: function (v) { c.kind = v; changed(t('bat_' + v)); } }));
        if (c.t === 'resistor') {
          out.push(F.number(t('resValue'), c.r, { unit: 'Ω', min: 1, max: 1000000, step: 1, onChange: function (v) { c.r = Math.round(v); changed(ohm(c.r)); } }));
          out.push(F.select(t('resStd'), C.RESISTORS.indexOf(c.r) >= 0 ? c.r : '', [['', '—']].concat(C.RESISTORS.map(function (v) { return [v, ohm(v)]; })), { onChange: function (v) { if (v) { c.r = +v; changed(ohm(c.r)); } } }));
        }
        if (c.t === 'led') { out.push(F.select(t('ledColor'), c.color, Object.keys(C.LEDS).map(function (k) { return [k, t('led_' + k)]; }), { onChange: function (v) { c.color = v; changed(t('led_' + v)); } })); out.push(ledCalc(c)); }
        if (c.t === 'switch') out.push(F.check(t('closedLabel'), c.on, { onChange: function (v) { c.on = !!v; changed(describe(c)); } }));
        if (c.t === 'spdt') out.push(F.choice(t('position'), c.pos, [[1, t('posN', { n: 1 })], [2, t('posN', { n: 2 })]], { onChange: function (v) { c.pos = +v; changed(describe(c)); } }));
        if (c.t === 'push') out.push(F.check(t('holdPressed'), !!held[c.id], { onChange: function (v) { held[c.id] = !!v; compute(); draw(); renderSide(); updateSummary(); ctx.announce(describe(c)); } }));
      } else {
        if (c.t === 'input' || c.t === 'out') out.push(F.text(t('label'), c.label, { max: 4, onChange: function (v) { var s2 = String(v).trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4); if (s2) { c.label = s2; changed(t('labelSet', { l: s2 })); } else renderSide(); } }));
        if (c.t === 'input') out.push(F.choice(t('value'), c.v ? 1 : 0, [[0, '0'], [1, '1']], { onChange: function (v) { c.v = +v; changed(describe(c)); } }));
        if (c.t === 'out' && lres) out.push(results([[t('value'), String(lres.v.out[lres.sim.cl.idx[c.id]] === null ? '—' : lres.v.out[lres.sim.cl.idx[c.id]])]]));
        if (c.t === 'dff') out.push(results([['Q', String(dffState[c.id] ? 1 : 0)]]));
        if (c.t === 'clock') out.push(h('div', { class: 'igs-actions' }, ctx.button(t('pulse'), { icon: 'play', onClick: pulse })));
      }
      out.push(numPos(c));
      /* conexiones por terminal y cable por campos (alternativa a elegir terminales en el lienzo) */
      var P = pinsOf(c), conn = h('div', { class: 'igc-conn' }, h('h4', { text: t('connectionsTitle') }));
      Object.keys(P).forEach(function (k) {
        var ref = { c: c.id, p: k }, ws = wires().filter(function (w) { return sameRef(w.a, ref) || sameRef(w.b, ref); });
        conn.appendChild(h('p', { class: 'igs-muted' }, h('strong', { text: t('pin_' + (c.t === 'battery' ? (k === 'b' ? 'plus' : 'minus') : c.t === 'led' ? (k === 'a' ? 'anode' : 'cathode') : k)) + ': ' }), ws.length ? ws.map(function (w) { return pinName(sameRef(w.a, ref) ? w.b : w.a); }).join(', ') : t('nothingConnected')));
      });
      var mine = Object.keys(P).map(function (k) { return { c: c.id, p: k }; }), others = allPins().filter(function (p) { return p.c !== c.id; });
      if (others.length) {
        var fromSel = F.select(t('fromPin'), 0, mine.map(function (p, i) { return [i, pinName(p)]; }), {});
        var toSel = F.select(t('toPin'), 0, others.map(function (p, i) { return [i, pinName(p)]; }), {});
        conn.append(fromSel, toSel, h('div', { class: 'igs-actions' }, ctx.button(t('addWireBtn'), { icon: 'line', onClick: function () { var a = mine[+fromSel.input.value], b = others[+toSel.input.value]; var w = addWire(a, b); if (w) changed(t('wireAdded', { a: pinName(a), b: pinName(b) })); } })));
      }
      out.push(conn);
      out.push(h('div', { class: 'igs-actions' },
        ELEC.indexOf(c.t) >= 0 ? ctx.button(t('rotate'), { icon: 'rotate', onClick: function () { rotate(c, 1); } }) : null,
        ['switch', 'spdt', 'input'].indexOf(c.t) >= 0 ? ctx.button(t('toggle'), { onClick: function () { toggle(c); } }) : null,
        ctx.button(t('deleteComp'), { icon: 'trash', class: 'igs-danger', onClick: function () { removeComp(c.id); } })));
      return out;
    }
    function numPos(c) {
      var d = BOARD[mode()], box = h('div', { class: 'igc-pos' });
      box.append(F.number(t('posX'), c.x, { min: 0, max: d[0], step: 1, onChange: function (v) { var o = c.x; c.x = Math.round(v); if (!fits(c)) { c.x = o; ctx.announce(t('noRoom')); renderSide(); return; } changed(t('moved')); } }),
        F.number(t('posY'), c.y, { min: 0, max: d[1], step: 1, onChange: function (v) { var o = c.y; c.y = Math.round(v); if (!fits(c)) { c.y = o; ctx.announce(t('noRoom')); renderSide(); return; } changed(t('moved')); } }));
      return box;
    }
    function ledCalc(c) {
      var bat = comps().filter(function (x) { return x.t === 'battery'; })[0], V = bat ? C.BATTERIES[bat.kind].v : 9, vf = C.LEDS[c.color].vf, I = 0.02, R = (V - vf) / I;
      var std = C.RESISTORS.filter(function (v) { return v >= R; })[0] || C.RESISTORS[C.RESISTORS.length - 1];
      return h('div', { class: 'igs-note' }, h('strong', { text: t('ledCalcTitle') }), h('p', { class: 'igc-calc', text: t('ledCalc', { v: num(V, 1), f: num(vf, 1), i: 20, r: num(R, 0), s: ohm(std) }) }));
    }
    function inspWire(w) {
      var out = [h('h4', { text: t('wireN', { a: pinName(w.a), b: pinName(w.b) }) })];
      if (mode() === 'elec') { var f = wireFlow(w); out.push(results([[t('current'), !f.live ? t('noCurrent') : f.i === null ? t('currentShared') : fmtI(f.i) + ' · ' + t(f.i > 0 ? 'flowAB' : 'flowBA')]])); }
      else if (lres) { var v = netOfPin(w.a); out.push(results([[t('value'), v === null ? t('unconnected') : String(v)]])); }
      out.push(F.choice(t('route'), w.bend ? 1 : 0, [[0, t('routeH')], [1, t('routeV')]], { onChange: function (v) { w.bend = +v; changed(t('routeSet')); } }));
      out.push(h('div', { class: 'igs-actions' }, ctx.button(t('deleteWire'), { icon: 'trash', class: 'igs-danger', onClick: function () { removeWire(w.id); } })));
      return out;
    }
    function inspDoc() {
      var out = [h('h4', { text: t('mode_' + mode()) })];
      if (mode() === 'elec') {
        if (!comps().length) out.push(h('p', { class: 'igs-muted', text: t('emptyElec') }));
        else if (!res || !res.ok) out.push(warn(res && res.reason === 'noBattery' || !res ? t('noBattery') : t('cantSolve')));
        else {
          if (res.short) out.push(warn(t('short')));
          comps().forEach(function (c) { var r = res.byId[c.id]; if (r && r.burnt) out.push(warn(compName(c) + ': ' + t(c.t === 'led' ? 'ledBurnt' : 'lampBurnt'))); });
          var lines = [];
          comps().forEach(function (c) {
            var r = res.byId[c.id]; if (!r) return;
            if (c.t === 'battery') lines.push([compName(c), t('batLine', { i: fmtI(r.i), v: num(r.v, 2) })]);
            if (['lamp', 'led', 'motor', 'ammeter', 'voltmeter'].indexOf(c.t) >= 0) lines.push([compName(c), shortInfo(c, r)]);
          });
          if (lines.length) out.push(results(lines));
        }
        out.push(F.check(t('flowAnim'), flowAnim, { onChange: function (v) { setFlow(!!v); } }));
        if (ctx.reducedMotion()) out.push(h('p', { class: 'igs-muted', text: t('flowReduced') }));
        out.push(h('p', { class: 'igs-muted', text: t('legendElec') }));
      } else {
        if (!comps().length) out.push(h('p', { class: 'igs-muted', text: t('emptyLogic') }));
        else {
          if (lres.sim.L.conflicts.length) out.push(warn(t('conflict')));
          if (lres.v.oscillates) out.push(warn(t('oscillates')));
          out.push(results([[t('outputsL'), outsText() || t('noOutputs')], [t('pulsesL'), String(clock.pulses)]]));
        }
        out.push(F.select(t('clockSpeed'), clock.hz, [[0.25, t('hz', { f: num(0.25, 2) })], [0.5, t('hz', { f: num(0.5, 1) })], [1, t('hz', { f: '1' })]], { onChange: function (v) { clock.hz = +v; if (clock.on) setClock(true); } }));
        out.push(h('div', { class: 'igs-actions' }, ctx.button(clock.on ? t('clockStop') : t('clockStart'), { icon: clock.on ? 'stop' : 'play', onClick: function () { setClock(!clock.on); renderSide(); } }), ctx.button(t('pulse'), { onClick: pulse }),
          ctx.button(t('resetFF'), { icon: 'undo', onClick: function () { dffState = {}; clock.pulses = 0; compute(); draw(); renderSide(); updateSummary(); ctx.announce(t('resetDone')); } })));
        out.push(truthBlock());
        out.push(h('p', { class: 'igs-muted', text: t('legendLogic') }));
      }
      return out;
    }
    function truthTable() { return C.truthTable(toCalcLogic().list); }
    function truthBlock() {
      if (!comps().length) return null;
      var tt = truthTable();
      if (tt.tooMany) return h('p', { class: 'igs-note', text: t('ttTooMany') });
      if (!tt.ins.length || !tt.outs.length) return h('p', { class: 'igs-note', text: t('ttNeed') });
      var hasFF = comps().some(function (c) { return c.t === 'dff'; }), tb = h('tbody');
      tt.rows.forEach(function (row) { tb.appendChild(h('tr', null, row.ins.map(function (v) { return h('td', { class: 'igs-numcell', text: String(v) }); }).concat(row.outs.map(function (v) { return h('td', { class: 'igs-numcell igc-outcell', text: v === null ? '—' : String(v) }); })))); });
      return h('div', { class: 'igs-table-wrap', tabindex: '0', role: 'region', 'aria-label': t('ttCap') + (hasFF ? ' ' + t('ttFF') : '') }, h('table', { class: 'igs-table igc-tt' }, h('caption', { text: t('ttCap') + (hasFF ? ' ' + t('ttFF') : '') }),
        h('thead', null, h('tr', null, tt.labelsIn.map(function (x) { return h('th', { scope: 'col', text: x }); }).concat(tt.labelsOut.map(function (x) { return h('th', { scope: 'col', class: 'igc-outcell', text: x + ' ' + t('outMark') }); })))), tb));
    }
    function setFlow(on) { flowAnim = on && !ctx.reducedMotion(); ctx.viewport.classList.toggle('igc-animating', flowAnim); draw(); syncPrimary(); renderSide(); ctx.announce(flowAnim ? t('flowOn') : t('flowOff')); }

    /* ---------- Modo, selección y cambios ---------- */
    function setMode(md, quiet) {
      if (md === mode()) return;
      setClock(false); S.mode = md; sel = null; pending = null; tool = 'select';
      compute(); setTools(); renderSide(); updateSummary(); fit(); draw();
      if (!quiet) { ctx.commit(t('mode_' + md)); ctx.announce(t('mode_' + md)); }
    }
    function select(s) { sel = s; pending = null; if (s) ctx.announce(t('selected', { name: s.k === 'c' ? describe(compById(s.id)) : t('wireN', { a: pinName(wireById(s.id).a), b: pinName(wireById(s.id).b) }) })); renderSide(); draw(); }
    function changed(msg, quiet) { compute(); ctx.commit(msg); if (!quiet && msg) ctx.announce(msg); renderSide(); updateSummary(); draw(); }

    /* ---------- Herramientas ---------- */
    var primaryBtn = null;
    function primary() { if (mode() === 'logic') { setClock(!clock.on); renderSide(); } else if (ctx.reducedMotion()) { var sm = D.getElementById('igs-scene-summary'); ctx.announce(sm ? sm.textContent : ''); } else setFlow(!flowAnim); }
    function syncPrimary() {
      if (!primaryBtn) return;
      var on = mode() === 'logic' ? clock.on : flowAnim;
      primaryBtn.setAttribute('aria-pressed', String(on));
      primaryBtn.querySelector('.igs-btn-label').textContent = mode() === 'logic' ? (clock.on ? t('clockStop') : t('clockStart')) : ctx.reducedMotion() ? t('readCircuit') : (flowAnim ? t('flowStop') : t('flowStart'));
    }
    function setTools() {
      var ps = h('select', { 'aria-label': t('partKind') });
      (mode() === 'elec' ? ELEC : LOGIC).forEach(function (ty) { var o = h('option', { value: ty, text: t('part_' + ty) }); if (ty === addType[mode()]) o.selected = true; ps.appendChild(o); });
      ps.addEventListener('change', function () { addType[mode()] = ps.value; ctx.selectTool('place'); ctx.announce(t('part_' + ps.value) + '. ' + t('info_' + ps.value)); });
      ctx.setTools([
        { id: 'select', label: t('tool_select'), icon: 'select', title: t('toolHelp_select') },
        { id: 'place', label: t('tool_place'), icon: 'plus', title: t('toolHelp_place') },
        { node: h('label', { class: 'igs-inline-select' }, h('span', { text: t('partKind') }), ps) },
        { id: 'wire', label: t('tool_wire'), icon: 'line', title: t('toolHelp_wire') },
        { id: 'use', label: t('tool_use'), icon: 'check', title: t('toolHelp_use') },
        { id: 'erase', label: t('tool_erase'), icon: 'erase', level: 'more' },
        { id: 'pan', label: t('tool_pan'), icon: 'pan', level: 'more' },
        { separator: true },
        mode() === 'logic' ? { id: 'pulse', label: t('pulse'), icon: 'sparkle', level: 'more', action: pulse } : null,
        { id: 'primary', label: '', icon: 'play', primary: true, keys: 'T', action: primary }
      ].filter(Boolean), { initial: tool });
      primaryBtn = ctx.toolbar.querySelector('.igs-primary'); syncPrimary();
    }

    /* ---------- Exportaciones ---------- */
    function sceneSVG(forPrint) {
      var d = BOARD[mode()], s = 40, W = (d[0] + 2) * s, H = (d[1] + 2) * s + 30;
      var out = D.createElementNS(SVGNS, 'svg'); out.setAttribute('xmlns', SVGNS); out.setAttribute('viewBox', '0 0 ' + W + ' ' + H); out.setAttribute('width', forPrint ? '180mm' : W); out.setAttribute('height', forPrint ? (180 * H / W).toFixed(1) + 'mm' : H);
      out.setAttribute('role', 'img'); var ti = el('title', {}, out); ti.textContent = t('schematicTitle') + ' · ' + t('mode_' + mode());
      el('rect', { x: 0, y: 0, width: W, height: H, fill: '#ffffff' }, out);
      var g = el('g', { transform: 'translate(' + s + ',' + s + ') scale(' + s + ')' }, out);
      var keep = sel; sel = null; var kp = pending; pending = null; drawScene(g, s, true); sel = keep; pending = kp;
      var cr = el('text', { x: W - 12, y: H - 10, 'font-size': 12, 'font-family': FONT, fill: NAVY, 'text-anchor': 'end' }, out); cr.textContent = 'IRIS GREEN · irisgreen.eu';
      return { svg: out, W: W, H: H };
    }
    function base() { return (LANG === 'en' ? 'circuit-' : 'circuito-') + (mode() === 'elec' ? (LANG === 'en' ? 'electricity-' : 'electricidad-') : (LANG === 'en' ? 'logic-' : 'logica-')) + ctx.stamp(); }
    ctx.addExport(t('exportSvg'), function () { ctx.download(new Blob([ctx.svgText(sceneSVG(false).svg)], { type: 'image/svg+xml' }), base() + '.svg'); });
    ctx.addExport(t('exportPng'), function () {
      var sc = sceneSVG(false), url = URL.createObjectURL(new Blob([ctx.svgText(sc.svg)], { type: 'image/svg+xml' })), img = new Image();
      /* sin la franja del SVG: el PNG lleva su propia franja de crédito */
      img.onload = function () { var c = D.createElement('canvas'); c.width = sc.W * 1.5; c.height = (sc.H - 30) * 1.5; var g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, sc.W * 1.5, sc.H * 1.5); URL.revokeObjectURL(url); ctx.canvasBlob(ctx.canvasWithCredit(c, '#ffffff')).then(function (b) { ctx.download(b, base() + '.png'); }); };
      img.onerror = function () { URL.revokeObjectURL(url); ctx.announce(t('exportError')); };
      img.src = url;
    });
    ctx.addExport(t('exportCsv'), function () {
      if (mode() !== 'logic') { ctx.announce(t('csvOnlyLogic')); ctx.setStatus(t('csvOnlyLogic')); return; }
      var tt = truthTable(); if (tt.tooMany || !tt.ins.length || !tt.outs.length) { ctx.announce(t('ttNeed')); return; }
      var sep = LANG === 'en' ? ',' : ';', rows = [tt.labelsIn.concat(tt.labelsOut.map(function (x) { return x + ' ' + t('outMark'); }))].concat(tt.rows.map(function (r) { return r.ins.concat(r.outs.map(function (v) { return v === null ? '' : v; })); }));
      var csv = '﻿' + rows.map(function (r) { return r.join(sep); }).join('\r\n') + '\r\n' + (LANG === 'en' ? '"Made in the Iris Green workshop · irisgreen.eu"' : '"Hecho en El taller de Iris Green · irisgreen.eu"') + '\r\n';
      ctx.download(new Blob([csv], { type: 'text/csv;charset=utf-8' }), (LANG === 'en' ? 'truth-table-' : 'tabla-de-verdad-') + ctx.stamp() + '.csv');
    });
    ctx.command('primary', t('flowStart') + ' / ' + t('clockStart'), '', primary);
    ctx.command('pulse', t('pulse'), t('mode_logic'), pulse);
    ctx.command('fit', t('zoomFit'), '', fit);
    ctx.command('challenge', t('chooseChallenge'), '', function () { var s2 = D.getElementById('igc-ch-sel'); if (s2) s2.focus(); });
    ['elec', 'logic'].forEach(function (md) { ctx.command('mode-' + md, t('mode_' + md), t('circuitKind'), function () { setMode(md); }); });
    ['select', 'place', 'wire', 'use'].forEach(function (id) { ctx.command('tool-' + id, t('tool_' + id), t('toolHelp_' + id), function () { ctx.selectTool(id); ctx.viewport.focus(); }); });

    /* ---------- Puntos de partida ---------- */
    function W(a, ap, b, bp, bend) { var w = addWire({ c: a.id, p: ap }, { c: b.id, p: bp }); if (w && bend) w.bend = 1; return w; }
    function start(id) {
      setClock(false); flowAnim = false; ctx.viewport.classList.remove('igc-animating');
      var md = id === 'traffic' || id === 'adder' || id === 'gates' || id === 'logic-empty' ? 'logic' : 'elec';
      S = blank(md); sel = null; pending = null; tool = 'select'; dffState = {}; held = {}; pressed = {}; clock.pulses = 0; cursor = { x: 3, y: 3 };
      if (id === 'light') {
        var bat = addComp('battery', 5, 10), sw = addComp('switch', 11, 10), lamp = addComp('lamp', 9, 4);
        W(bat, 'b', sw, 'a'); W(sw, 'b', lamp, 'b', 1);
        S.challenge = 'c1';
      } else if (id === 'led') {
        var b9 = addComp('battery', 3, 10, { kind: 'v9', rot: 270 }), am = addComp('ammeter', 5, 4), rs = addComp('resistor', 10, 4, { r: 330 }), led = addComp('led', 15, 4, { color: 'rojo' }), vm = addComp('voltmeter', 15, 1);
        W(b9, 'b', am, 'a', 1); W(am, 'b', rs, 'a'); W(rs, 'b', led, 'a'); W(led, 'b', b9, 'a', 1); W(vm, 'a', led, 'a'); W(vm, 'b', led, 'b');
        S.challenge = 'c4';
      } else if (id === 'traffic') {
        var ck = addComp('clock', 2, 12), f0 = addComp('dff', 8, 6), f1 = addComp('dff', 16, 6);
        addComp('out', 27, 3, { label: 'V' }); addComp('out', 27, 8, { label: 'A' }); addComp('out', 27, 13, { label: 'R' });
        W(f0, 'q', f1, 'd'); W(ck, 'o', f0, 'clk'); W(ck, 'o', f1, 'clk');
        S.challenge = 'l6';
      } else if (id === 'gates') {
        var A = addComp('input', 2, 5, { label: 'A' }), B = addComp('input', 2, 11, { label: 'B' }), g1 = addComp('and', 10, 5), g2 = addComp('or', 10, 11);
        var s1 = addComp('out', 18, 5, { label: 'S' }), c1 = addComp('out', 18, 11, { label: 'C' });
        W(A, 'o', g1, 'in1'); W(B, 'o', g1, 'in2', 1); W(A, 'o', g2, 'in1', 1); W(B, 'o', g2, 'in2'); W(g1, 'o', s1, 'i'); W(g2, 'o', c1, 'i');
        S.challenge = 'l2';
      } else if (id === 'adder') {
        var a2 = addComp('input', 2, 3, { label: 'A' }), b2 = addComp('input', 2, 7, { label: 'B' }), e2 = addComp('input', 2, 13, { label: 'E' });
        var x1 = addComp('xor', 8, 5), x2 = addComp('xor', 15, 9), n1 = addComp('and', 15, 3), n2 = addComp('and', 15, 14), o1 = addComp('or', 21, 8);
        var so = addComp('out', 27, 11, { label: 'S' }), co = addComp('out', 27, 5, { label: 'C' });
        W(a2, 'o', x1, 'in1', 1); W(b2, 'o', x1, 'in2', 1); W(a2, 'o', n1, 'in1'); W(b2, 'o', n1, 'in2', 1);
        W(x1, 'o', x2, 'in1', 1); W(e2, 'o', x2, 'in2', 1); W(x1, 'o', n2, 'in1', 1); W(e2, 'o', n2, 'in2'); W(n1, 'o', o1, 'in1', 1); W(n2, 'o', o1, 'in2', 1);
        W(x2, 'o', so, 'i'); W(o1, 'o', co, 'i', 1);
        S.challenge = 'l7';
      }
      compute(); setTools(); renderSide(); updateSummary(); fit(); draw();
    }

    setTools(); compute(); renderSide(); updateSummary();
    return {
      serialize: function () { return JSON.parse(JSON.stringify(S)); },
      restore: function (d) {
        var md = S.mode; S = JSON.parse(JSON.stringify(d)); if (sel && !(sel.k === 'c' ? compById(sel.id) : wireById(sel.id))) sel = null; pending = null;
        if (md !== S.mode) { setClock(false); setTools(); fit(); }
        compute(); renderSide(); updateSummary(); draw();
      },
      validate: function (d) {
        function n(v) { return typeof v === 'number' && isFinite(v); }
        if (!d || (d.mode !== 'elec' && d.mode !== 'logic') || !d.elec || !d.logic) return false;
        if (d.challenge !== null && d.challenge !== undefined && !chById(d.challenge)) return false;
        return ['elec', 'logic'].every(function (md) {
          var x = d[md], types = md === 'elec' ? ELEC : LOGIC; if (!Array.isArray(x.comps) || !Array.isArray(x.wires) || x.comps.length > 200 || x.wires.length > 400 || !n(x.seq)) return false;
          var ids = {};
          if (!x.comps.every(function (c) { if (!c || typeof c.id !== 'string' || types.indexOf(c.t) < 0 || !n(c.x) || !n(c.y)) return false; ids[c.id] = 1;
            if (c.t === 'battery' && !C.BATTERIES[c.kind]) return false; if (c.t === 'resistor' && !(n(c.r) && c.r >= 1)) return false; if (c.t === 'led' && !C.LEDS[c.color]) return false;
            if ((c.t === 'input' || c.t === 'out') && typeof c.label !== 'string') return false; return true; })) return false;
          return x.wires.every(function (w) { return w && typeof w.id === 'string' && w.a && w.b && ids[w.a.c] && ids[w.b.c] && typeof w.a.p === 'string' && typeof w.b.p === 'string'; });
        });
      },
      start: start,
      onTool: function (id) { tool = id; pending = null; ctx.viewport.dataset.tool = id; draw(); },
      onKey: onKey
    };
  }
})(window);
