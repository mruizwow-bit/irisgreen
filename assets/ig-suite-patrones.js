/* Iris Green · El taller · Estudio de patrones y arte generativo (R43).
   Cuatro modos, todo en SVG vectorial: simetría plana (los 17 grupos cristalográficos planos, con notación
   internacional y orbifold; Schattschneider, 1978; Conway, Burgiel y Goodman-Strauss, 2008), rosetón Cn/Dn,
   teselas de Truchet y arcos de Smith (Smith, 1987) con semilla reproducible, y sistemas L
   (Prusinkiewicz y Lindenmayer, 1990). Nada se anima solo. Nada se guarda en el navegador. */
(function (root) {
  'use strict';
  var IG = root.IGSuite, D = root.document; if (!IG) return;
  var LANG = IG.lang, SVGNS = 'http://www.w3.org/2000/svg', XLINK = 'http://www.w3.org/1999/xlink';
  var R3 = Math.sqrt(3);
  var MODES = ['wall', 'rose', 'truchet', 'lsys'];
  var SHAPES = ['circle', 'square', 'triangle', 'petal', 'line', 'stroke'];
  var SWATCHES = ['#101820', '#ffffff', '#f6e27a', '#e0b000', '#d86b00', '#b3261e', '#c27ba0', '#5a49a8', '#1f5f8b', '#0b8f8f', '#2e7d32', '#7cc36b', '#8a5a3c', '#7d8b99', '#eef3f8', '#fbeee6'];
  var SKEWS = ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2'];

  /* ---------- Los 17 grupos cristalográficos planos ----------
     Operaciones en coordenadas de la retícula (x, y) → (r0·x + r1·y + t0, r2·x + r3·y + t1),
     representantes de clase de las International Tables for Crystallography (vol. A). */
  function O(r0, r1, r2, r3, t0, t1) { return [r0, r1, r2, r3, t0 || 0, t1 || 0]; }
  var I = O(1, 0, 0, 1), P2 = O(-1, 0, 0, -1);
  function centred(list) { return list.concat(list.map(function (o) { return [o[0], o[1], o[2], o[3], o[4] + 0.5, o[5] + 0.5]; })); }
  var P4 = [I, P2, O(0, -1, 1, 0), O(0, 1, -1, 0)];
  var P3 = [I, O(0, -1, 1, -1), O(-1, 1, -1, 0)];
  var M3A = [O(0, -1, -1, 0), O(-1, 1, 0, 1), O(1, 0, 1, -1)];   /* espejos de p3m1 */
  var M3B = [O(0, 1, 1, 0), O(1, -1, 0, -1), O(-1, 0, -1, 1)];   /* espejos de p31m */
  var P6 = P3.concat([P2, O(0, 1, -1, 1), O(1, -1, 1, 0)]);
  var GROUPS = {
    p1: { lat: 'oblique', orb: 'o', ops: [I] },
    p2: { lat: 'oblique', orb: '2222', ops: [I, P2] },
    pm: { lat: 'rect', orb: '**', ops: [I, O(-1, 0, 0, 1)] },
    pg: { lat: 'rect', orb: '××', ops: [I, O(-1, 0, 0, 1, 0, 0.5)] },
    cm: { lat: 'rhombic', orb: '*×', ops: centred([I, O(-1, 0, 0, 1)]) },
    pmm: { lat: 'rect', orb: '*2222', ops: [I, P2, O(-1, 0, 0, 1), O(1, 0, 0, -1)] },
    pmg: { lat: 'rect', orb: '22*', ops: [I, P2, O(-1, 0, 0, 1, 0.5, 0), O(1, 0, 0, -1, 0.5, 0)] },
    pgg: { lat: 'rect', orb: '22×', ops: [I, P2, O(-1, 0, 0, 1, 0.5, 0.5), O(1, 0, 0, -1, 0.5, 0.5)] },
    cmm: { lat: 'rhombic', orb: '2*22', ops: centred([I, P2, O(-1, 0, 0, 1), O(1, 0, 0, -1)]) },
    p4: { lat: 'square', orb: '442', ops: P4 },
    p4m: { lat: 'square', orb: '*442', ops: P4.concat([O(-1, 0, 0, 1), O(1, 0, 0, -1), O(0, 1, 1, 0), O(0, -1, -1, 0)]) },
    p4g: { lat: 'square', orb: '4*2', ops: P4.concat([O(-1, 0, 0, 1, 0.5, 0.5), O(1, 0, 0, -1, 0.5, 0.5), O(0, 1, 1, 0, 0.5, 0.5), O(0, -1, -1, 0, 0.5, 0.5)]) },
    p3: { lat: 'hex', orb: '333', ops: P3 },
    p3m1: { lat: 'hex', orb: '*333', ops: P3.concat(M3A) },
    p31m: { lat: 'hex', orb: '3*3', ops: P3.concat(M3B) },
    p6: { lat: 'hex', orb: '632', ops: P6 },
    p6m: { lat: 'hex', orb: '*632', ops: P6.concat(M3A, M3B) }
  };
  var GROUP_IDS = Object.keys(GROUPS);

  /* ---------- Álgebra afín en el plano (matrices SVG: a b c d e f) ---------- */
  function mul(A, B) { return [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3], A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5]]; }
  function inv(A) { var d = A[0] * A[3] - A[1] * A[2]; return [A[3] / d, -A[1] / d, -A[2] / d, A[0] / d, (A[2] * A[5] - A[3] * A[4]) / d, (A[1] * A[4] - A[0] * A[5]) / d]; }
  function ap(A, p) { return [A[0] * p[0] + A[2] * p[1] + A[4], A[1] * p[0] + A[3] * p[1] + A[5]]; }
  function apL(A, p) { return [A[0] * p[0] + A[2] * p[1], A[1] * p[0] + A[3] * p[1]]; }
  function mstr(A) { return 'matrix(' + A.map(function (v) { return Math.round(v * 1e5) / 1e5; }).join(' ') + ')'; }
  function fracSkew(s) { var p = String(s || '1/4').split('/'); return { p: +p[0] || 1, q: +p[1] || 4, v: (+p[0] || 1) / (+p[1] || 4) }; }
  function basisOf(W) {
    var a = W.a, lat = GROUPS[W.group].lat, r = W.ratio;
    if (lat === 'square') return [a, 0, 0, a];
    if (lat === 'hex') return [a, 0, -a / 2, a * R3 / 2];
    if (lat === 'oblique') return [a, 0, fracSkew(W.skew).v * a, r * a];
    return [a, 0, 0, r * a];
  }
  /* Operación de la retícula → matriz cartesiana M = B·R·B⁻¹, t = B·t_f */
  function cartOps(W) {
    var B = basisOf(W), Bm = [B[0], B[1], B[2], B[3], 0, 0], Bi = inv(Bm);
    return GROUPS[W.group].ops.map(function (o) { var R = [o[0], o[2], o[1], o[3], o[4], o[5]]; return mul(mul(Bm, R), Bi); });
  }
  function periodRect(W) {
    var B = basisOf(W), lat = GROUPS[W.group].lat;
    if (lat === 'hex') return [W.a, W.a * R3];
    if (lat === 'oblique') return [W.a, fracSkew(W.skew).q * B[3]];
    return [B[0], B[3]];
  }

  IG.defineEngine('patrones', {
    version: 1, fileBase: LANG === 'en' ? 'patterns' : 'patrones',
    extraKeys: ['kPatMove', 'kPatShape', 'kPatTile', 'kPatLsys'],
    groups: GROUPS, _cartOps: cartOps, _basis: basisOf,
    initialStart: function (para) { return { child: 'flowers', teen: 'truchet', adult: 'p4g' }[para] || 'onetile'; },
    starts: function (ctx) {
      var t = ctx.t;
      return [
        { id: 'onetile', title: t('stOneTile'), desc: t('stOneTileD'), para: 'any' },
        { id: 'seventeen', title: t('stSeventeen'), desc: t('stSeventeenD'), para: 'any' },
        { id: 'ownfractal', title: t('stOwnFractal'), desc: t('stOwnFractalD'), para: 'any' },
        { id: 'flowers', title: t('stFlowers'), desc: t('stFlowersD'), para: 'child' },
        { id: 'truchet', title: t('stTruchet'), desc: t('stTruchetD'), para: 'teen' },
        { id: 'p4g', title: t('stP4g'), desc: t('stP4gD'), para: 'adult' },
        { id: 'koch', title: t('stKoch'), desc: t('stKochD'), para: 'any' }
      ];
    },
    create: function (ctx) { return studio(ctx); }
  });

  /* ---------- Sistemas L ---------- */
  var PRESETS = {
    koch: { axiom: 'F--F--F', rules: [['F', 'F+F--F+F']], angle: 60, iter: 4, heading: 0, draw: 'FG' },
    sierpinski: { axiom: 'F-G-G', rules: [['F', 'F-G+F+G-F'], ['G', 'GG']], angle: 120, iter: 5, heading: 0, draw: 'FG' },
    dragon: { axiom: 'FX', rules: [['X', 'X+YF+'], ['Y', '-FX-Y']], angle: 90, iter: 10, heading: 0, draw: 'FG' },
    plant: { axiom: 'X', rules: [['X', 'F+[[X]-X]-F[-FX]+X'], ['F', 'FF']], angle: 25, iter: 5, heading: 65, draw: 'FG' }
  };
  var MAX_SEG = 60000, MAX_LEN = 400000;
  function cleanRule(s) { return String(s || '').replace(/[−–]/g, '-').replace(/\s+/g, ''); }
  function lsysCheck(L) {
    var errs = [], ax = cleanRule(L.axiom), seen = {};
    if (!ax) errs.push({ k: 'lsErrAxiom' });
    var bad = ax.replace(/[A-Za-z+\-\[\]|]/g, ''); if (bad) errs.push({ k: 'lsErrChar', v: { c: bad.charAt(0), where: 'axiom' } });
    function brackets(s) { var d = 0; for (var i = 0; i < s.length; i++) { if (s[i] === '[') d++; else if (s[i] === ']') { d--; if (d < 0) return false; } } return d === 0; }
    if (ax && !brackets(ax)) errs.push({ k: 'lsErrBrackets', v: { where: 'axiom' } });
    L.rules.forEach(function (r, i) {
      var a = cleanRule(r[0]), b = cleanRule(r[1]);
      if (!/^[A-Za-z]$/.test(a)) errs.push({ k: 'lsErrPred', v: { n: i + 1 } });
      else if (seen[a]) errs.push({ k: 'lsErrDup', v: { c: a } }); else seen[a] = 1;
      var bb = b.replace(/[A-Za-z+\-\[\]|]/g, ''); if (bb) errs.push({ k: 'lsErrChar', v: { c: bb.charAt(0), where: 'rule', n: i + 1 } });
      if (!brackets(b)) errs.push({ k: 'lsErrBrackets', v: { where: 'rule', n: i + 1 } });
    });
    return errs;
  }
  function lsysRun(L) {
    var map = {}; L.rules.forEach(function (r) { var a = cleanRule(r[0]); if (/^[A-Za-z]$/.test(a)) map[a] = cleanRule(r[1]); });
    var draw = String(L.draw || 'FG').replace(/[^A-Za-z]/g, ''), s = cleanRule(L.axiom), done = 0, capped = false;
    function count(str) { var n = 0; for (var i = 0; i < str.length; i++) if (draw.indexOf(str[i]) >= 0 || str[i] === 'f') n++; return n; }
    for (var it = 0; it < L.iter; it++) {
      var out = [], len = 0;
      for (var i = 0; i < s.length; i++) { var rep = map[s[i]]; var piece = rep === undefined ? s[i] : rep; len += piece.length; if (len > MAX_LEN) break; out.push(piece); }
      if (len > MAX_LEN) { capped = true; break; }
      var ns = out.join(''); if (count(ns) > MAX_SEG) { capped = true; break; }
      s = ns; done++;
    }
    /* Tortuga: + gira a la izquierda, − a la derecha, [ ] guardan y recuperan, | da media vuelta */
    var x = 0, y = 0, a = (L.heading || 0) * Math.PI / 180, da = L.angle * Math.PI / 180, stack = [], segs = [], d = '', pen = false;
    var minX = 0, minY = 0, maxX = 0, maxY = 0;
    for (var j = 0; j < s.length; j++) {
      var ch = s[j];
      if (draw.indexOf(ch) >= 0 || ch === 'f') {
        var nx = x + Math.cos(a), ny = y - Math.sin(a);
        if (ch !== 'f') { segs.push(x, y, nx, ny); }
        x = nx; y = ny; if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
      } else if (ch === '+') a += da; else if (ch === '-') a -= da; else if (ch === '|') a += Math.PI;
      else if (ch === '[') stack.push([x, y, a]); else if (ch === ']') { var st = stack.pop(); if (st) { x = st[0]; y = st[1]; a = st[2]; } }
    }
    /* Escala a una caja de 1000 unidades para que el grosor tenga sentido */
    var w = Math.max(1e-6, maxX - minX), hh = Math.max(1e-6, maxY - minY), k = 1000 / Math.max(w, hh);
    var lastX = null, lastY = null, parts = [];
    for (var q = 0; q < segs.length; q += 4) {
      var x1 = (segs[q] - minX) * k, y1 = (segs[q + 1] - minY) * k, x2 = (segs[q + 2] - minX) * k, y2 = (segs[q + 3] - minY) * k;
      if (lastX === null || Math.abs(lastX - x1) > 1e-6 || Math.abs(lastY - y1) > 1e-6) parts.push('M' + r2(x1) + ' ' + r2(y1));
      parts.push('L' + r2(x2) + ' ' + r2(y2)); lastX = x2; lastY = y2;
    }
    d = parts.join('');
    return { d: d, n: segs.length / 4, done: done, capped: capped, w: w * k, h: hh * k, len: s.length };
  }
  function r2(v) { return Math.round(v * 100) / 100; }

  function studio(ctx) {
    var t = ctx.t, h = ctx.h, F = ctx.fields, vp = ctx.viewport;
    var S = null, seq = 0, selId = null, tool = 'select', tileCur = null, lsSel = null, cache = { ls: null, lsKey: '' }, uidN = 0;
    function nid() { seq += 1; return 's' + seq; }
    function uid() { uidN += 1; return 'igp-' + uidN; }
    function defaults() {
      return { v: 1, mode: 'wall', challenge: null,
        wall: { group: 'p4', a: 120, ratio: 1, skew: '1/4', bg: '#fbf6ec', showCell: true, showAxes: false, shapes: [], seen: ['p4'] },
        rose: { n: 8, dihedral: true, bg: '#fbf6ec', showAxes: false, shapes: [] },
        truchet: { variant: 'arcs', rule: 'random', cols: 12, rows: 8, size: 60, seed: 'iris', fg: '#1f5f8b', bg: '#fbf6ec', sw: 10, flips: {} },
        lsys: { axiom: 'F', rules: [['F', 'F[+F]F[-F]F']], angle: 25.7, iter: 4, heading: 90, draw: 'FG', fg: '#2e7d32', bg: '#fbf6ec', sw: 2 } };
    }
    S = defaults();
    function M() { return S[S.mode]; }
    function shapes() { return (S.mode === 'wall' || S.mode === 'rose') ? M().shapes : []; }
    function byId(id) { var l = shapes(); for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; }
    function sel() { return byId(selId); }
    function r1(v) { return Math.round(v * 10) / 10 || 0; }
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

    /* ---------- Vista SVG ---------- */
    var svg = D.createElementNS(SVGNS, 'svg'); svg.setAttribute('class', 'igp-svg'); svg.setAttribute('aria-hidden', 'true');
    vp.appendChild(svg); vp.classList.add('igp-viewport');
    var world = el('g', {}, svg);
    var view = new ctx.View2D({ scale: 1, min: 0.05, max: 12, onChange: function () { draw(); } });
    ctx.attachViewGestures(vp, view, { isPanTool: function () { return tool === 'pan'; } });
    var hud = h('div', { class: 'igp-hud', 'aria-hidden': 'true' }); vp.appendChild(hud);
    function el(name, attrs, parent) { var e = D.createElementNS(SVGNS, name); Object.keys(attrs || {}).forEach(function (k) { if (attrs[k] != null) e.setAttribute(k, attrs[k]); }); if (parent) parent.appendChild(e); return e; }
    function vpSize() { return [Math.max(200, vp.clientWidth), Math.max(160, vp.clientHeight)]; }

    /* Forma del motivo (coordenadas locales). */
    function shapeNode(sh, parent, doc) {
      var g = el('g', { transform: 'translate(' + r2(sh.x) + ' ' + r2(sh.y) + ') rotate(' + r2(sh.rot || 0) + ')' }, parent), s = sh.size, c = sh.color;
      if (sh.type === 'circle') el('circle', { r: r2(s / 2), fill: c }, g);
      else if (sh.type === 'square') el('rect', { x: r2(-s / 2), y: r2(-s / 2), width: r2(s), height: r2(s), fill: c }, g);
      else if (sh.type === 'triangle') el('polygon', { points: [0, -s / 2, s * 0.433, s / 4, -s * 0.433, s / 4].map(r2).join(' '), fill: c }, g);
      else if (sh.type === 'petal') el('ellipse', { rx: r2(s * 0.22), ry: r2(s / 2), fill: c }, g);
      else if (sh.type === 'line') el('line', { x1: r2(-s / 2), y1: 0, x2: r2(s / 2), y2: 0, stroke: c, 'stroke-width': sh.sw || 6, 'stroke-linecap': 'round' }, g);
      else if (sh.type === 'stroke') el('polyline', { points: (sh.pts || []).map(function (p) { return r2(p[0] * s) + ',' + r2(p[1] * s); }).join(' '), fill: 'none', stroke: c, 'stroke-width': sh.sw || 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      void doc; return g;
    }
    function motifRadius(list) { var r = 10; list.forEach(function (sh) { r = Math.max(r, Math.hypot(sh.x, sh.y) + sh.size * 0.75 + (sh.sw || 0)); }); return r; }
    function roseOps(R) { var ops = [], n = R.n; for (var k = 0; k < n; k++) { var a = 2 * Math.PI * k / n; ops.push([Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0]); } if (R.dihedral) for (var j = 0; j < n; j++) { var b = 2 * Math.PI * j / n; ops.push([Math.cos(b), Math.sin(b), Math.sin(b), -Math.cos(b), 0, 0]); } return ops; }

    /* Simetrías de un mosaico: centros de giro, espejos y deslizamientos que caen en el rectángulo. */
    function symmetryElements(W, rect, nRange) {
      var ops = cartOps(W), B = basisOf(W), Bm = [B[0], B[1], B[2], B[3], 0, 0], Bi = inv(Bm), centres = {}, lines = {};
      function isInt(v) { return Math.abs(v - Math.round(v)) < 1e-6; }
      for (var i = nRange[0]; i <= nRange[1]; i++) for (var j = nRange[2]; j <= nRange[3]; j++) {
        var T = [B[0] * i + B[2] * j, B[1] * i + B[3] * j];
        ops.forEach(function (o) {
          var e = o[4] + T[0], f = o[5] + T[1], det = o[0] * o[3] - o[1] * o[2];
          if (det > 0) {
            if (Math.abs(o[0] - 1) < 1e-9 && Math.abs(o[1]) < 1e-9) return;
            var a = 1 - o[0], b = -o[2], c = -o[1], d = 1 - o[3], dd = a * d - b * c; if (Math.abs(dd) < 1e-9) return;
            var cx = (d * e - b * f) / dd, cy = (a * f - c * e) / dd;
            if (cx < rect[0] - 1 || cx > rect[2] + 1 || cy < rect[1] - 1 || cy > rect[3] + 1) return;
            var ang = Math.abs(Math.atan2(o[1], o[0])), ord = Math.round(2 * Math.PI / Math.min(ang, 2 * Math.PI - ang));
            var key = Math.round(cx * 10) + ',' + Math.round(cy * 10); if (!centres[key] || centres[key].ord < ord) centres[key] = { x: cx, y: cy, ord: ord };
          } else {
            var th = Math.atan2(o[1], o[0]) / 2, u = [Math.cos(th), Math.sin(th)], gl = e * u[0] + f * u[1], p = [e - gl * u[0], f - gl * u[1]];
            var gf = apL(Bi, [gl * u[0], gl * u[1]]), mirror = isInt(gf[0]) && isInt(gf[1]);
            var nrm = [-u[1], u[0]], off = (p[0] / 2) * nrm[0] + (p[1] / 2) * nrm[1], thk = ((th % Math.PI) + Math.PI) % Math.PI;
            if (Math.abs(thk - Math.PI) < 1e-6) thk = 0;
            var lk = Math.round(thk * 1000) + ':' + Math.round(off * 10);
            if (!lines[lk] || (mirror && !lines[lk].mirror)) lines[lk] = { th: thk, off: off, mirror: mirror };
          }
        });
      }
      return { centres: Object.keys(centres).map(function (k) { return centres[k]; }), lines: Object.keys(lines).map(function (k) { return lines[k]; }) };
    }
    function clipLine(L, rect) {
      var u = [Math.cos(L.th), Math.sin(L.th)], n = [-u[1], u[0]], p0 = [n[0] * L.off, n[1] * L.off], ts = [];
      [[0, rect[0]], [0, rect[2]], [1, rect[1]], [1, rect[3]]].forEach(function (c) { if (Math.abs(u[c[0]]) > 1e-9) { var tt = (c[1] - p0[c[0]]) / u[c[0]]; var q = [p0[0] + u[0] * tt, p0[1] + u[1] * tt]; if (q[0] >= rect[0] - 1e-6 && q[0] <= rect[2] + 1e-6 && q[1] >= rect[1] - 1e-6 && q[1] <= rect[3] + 1e-6) ts.push(tt); } });
      if (ts.length < 2) return null; var a = Math.min.apply(null, ts), b = Math.max.apply(null, ts);
      return [p0[0] + u[0] * a, p0[1] + u[1] * a, p0[0] + u[0] * b, p0[1] + u[1] * b];
    }
    function rotSymbol(parent, c, k) {
      var r = 7 * k, pts = [], sides = c.ord === 2 ? 0 : c.ord;
      if (!sides) { el('ellipse', { cx: c.x, cy: c.y, rx: r * 0.6, ry: r, fill: '#101820', stroke: '#fff', 'stroke-width': 1.5 * k }, parent); return; }
      for (var i = 0; i < sides; i++) { var a = -Math.PI / 2 + 2 * Math.PI * i / sides; pts.push(r2(c.x + Math.cos(a) * r), r2(c.y + Math.sin(a) * r)); }
      el('polygon', { points: pts.join(' '), fill: '#101820', stroke: '#fff', 'stroke-width': 1.5 * k }, parent);
    }

    /* Construye el contenido de un modo dentro de un <g>, para el rectángulo del mundo dado. */
    function build(target, rect, o) {
      o = o || {}; var k = o.k || 1, idp = o.idp || 'v';
      var mode = S.mode, mm = M();
      el('rect', { x: rect[0], y: rect[1], width: rect[2] - rect[0], height: rect[3] - rect[1], fill: mm.bg }, target);
      if (mode === 'wall' || mode === 'rose') {
        var defs = el('defs', {}, target), motif = el('g', { id: idp + '-m' }, defs);
        mm.shapes.forEach(function (sh) { shapeNode(sh, motif); });
        if (mode === 'rose') {
          roseOps(mm).forEach(function (op) { var u = el('use', { href: '#' + idp + '-m', transform: mstr(op) }, target); u.setAttributeNS(XLINK, 'xlink:href', '#' + idp + '-m'); });
          if (o.overlay && mm.showAxes) {
            var R = motifRadius(mm.shapes) + 20;
            if (mm.dihedral) for (var j = 0; j < mm.n; j++) { var b = Math.PI * j / mm.n; el('line', { x1: -Math.cos(b) * R, y1: -Math.sin(b) * R, x2: Math.cos(b) * R, y2: Math.sin(b) * R, class: 'igp-mirror', 'stroke-width': 2 * k }, target); }
            rotSymbol(target, { x: 0, y: 0, ord: mm.n }, k * 1.4);
          }
          return;
        }
        var ops = cartOps(mm), cell = el('g', { id: idp + '-c' }, defs);
        ops.forEach(function (op) { var u = el('use', { href: '#' + idp + '-m', transform: mstr(op) }, cell); u.setAttributeNS(XLINK, 'xlink:href', '#' + idp + '-m'); });
        var B = basisOf(mm), Bi = inv([B[0], B[1], B[2], B[3], 0, 0]), rad = motifRadius(mm.shapes) + Math.hypot(B[0] + B[2], B[1] + B[3]);
        var corners = [[rect[0] - rad, rect[1] - rad], [rect[2] + rad, rect[1] - rad], [rect[0] - rad, rect[3] + rad], [rect[2] + rad, rect[3] + rad]].map(function (p) { return apL(Bi, p); });
        var i0 = Math.floor(Math.min.apply(null, corners.map(function (p) { return p[0]; }))), i1 = Math.ceil(Math.max.apply(null, corners.map(function (p) { return p[0]; })));
        var j0 = Math.floor(Math.min.apply(null, corners.map(function (p) { return p[1]; }))), j1 = Math.ceil(Math.max.apply(null, corners.map(function (p) { return p[1]; })));
        var count = 0;
        for (var i = i0; i <= i1; i++) for (var jj = j0; jj <= j1; jj++) {
          if (++count > 4000) break;
          var u2 = el('use', { href: '#' + idp + '-c', transform: 'translate(' + r2(B[0] * i + B[2] * jj) + ' ' + r2(B[1] * i + B[3] * jj) + ')' }, target); u2.setAttributeNS(XLINK, 'xlink:href', '#' + idp + '-c');
        }
        if (o.overlay) {
          var ov = el('g', { class: 'igp-ov' }, target);
          if (mm.showAxes) {
            var ci = [Math.max(i0, -60), Math.min(i1, 60), Math.max(j0, -60), Math.min(j1, 60)];
            if ((ci[1] - ci[0]) * (ci[3] - ci[2]) < 1600) {
              var se = symmetryElements(mm, rect, ci);
              se.lines.forEach(function (L) { var c = clipLine(L, rect); if (c) el('line', { x1: c[0], y1: c[1], x2: c[2], y2: c[3], class: L.mirror ? 'igp-mirror' : 'igp-glide', 'stroke-width': 2 * k, 'stroke-dasharray': L.mirror ? null : (8 * k) + ' ' + (6 * k) }, ov); });
              se.centres.forEach(function (c) { rotSymbol(ov, c, k); });
            }
          }
          if (mm.showCell) el('polygon', { points: [0, 0, B[0], B[1], B[0] + B[2], B[1] + B[3], B[2], B[3]].map(r2).join(' '), class: 'igp-cell', 'stroke-width': 2.5 * k, 'stroke-dasharray': (10 * k) + ' ' + (6 * k) }, ov);
        }
        return;
      }
      if (mode === 'truchet') {
        var T = mm, s = T.size, rnd = ctx.rng(String(T.seed)), g = el('g', {}, target), nOr = T.variant === 'triangles' ? 4 : 2;
        for (var y = 0; y < T.rows; y++) for (var x = 0; x < T.cols; x++) {
          var base = T.rule === 'random' ? Math.floor(rnd() * nOr) : T.rule === 'checker' ? (T.variant === 'triangles' ? (x % 2) + 2 * (y % 2) : (x + y) % 2) : T.rule === 'rows' ? (y % nOr) : ((x + y) % nOr);
          var or = T.flips[x + ',' + y] != null ? T.flips[x + ',' + y] % nOr : base;
          truchetTile(g, x * s, y * s, s, or, T);
        }
        if (o.overlay) el('rect', { x: 0, y: 0, width: T.cols * s, height: T.rows * s, fill: 'none', stroke: '#44586c', 'stroke-width': 1.5 * k, 'stroke-dasharray': (6 * k) + ' ' + (4 * k) }, target);
        if (o.overlay && tileCur) el('rect', { x: tileCur[0] * s + 2 * k, y: tileCur[1] * s + 2 * k, width: s - 4 * k, height: s - 4 * k, class: 'igp-tilecur', 'stroke-width': 3 * k }, target);
        return;
      }
      var res = lsysResult();
      el('path', { d: res.d, fill: 'none', stroke: mm.fg, 'stroke-width': mm.sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, target);
    }
    function truchetOrientation(x, y) {
      var T = S.truchet, nOr = T.variant === 'triangles' ? 4 : 2, rnd = ctx.rng(String(T.seed)), v = 0;
      for (var yy = 0; yy <= y; yy++) for (var xx = 0; xx < T.cols; xx++) { var r = rnd(); if (yy === y && xx === x) { v = Math.floor(r * nOr); break; } }
      var base = T.rule === 'random' ? v : T.rule === 'checker' ? (T.variant === 'triangles' ? (x % 2) + 2 * (y % 2) : (x + y) % 2) : T.rule === 'rows' ? (y % nOr) : ((x + y) % nOr);
      return T.flips[x + ',' + y] != null ? T.flips[x + ',' + y] % nOr : base;
    }
    function truchetTile(g, x, y, s, or, T) {
      if (T.variant === 'triangles') {
        var c = [[x, y], [x + s, y], [x + s, y + s], [x, y + s]], a = c[or], b = c[(or + 1) % 4], d = c[(or + 3) % 4];
        el('polygon', { points: [a, b, d].map(function (p) { return p.join(','); }).join(' '), fill: T.fg }, g);
      } else if (T.variant === 'arcs') {
        /* Cuartos de círculo centrados en las esquinas: unen puntos medios de lados vecinos (Smith, 1987). */
        var hs = s / 2, p = or ? 'M' + (x + hs) + ' ' + y + ' A' + hs + ' ' + hs + ' 0 0 0 ' + (x + s) + ' ' + (y + hs) + ' M' + x + ' ' + (y + hs) + ' A' + hs + ' ' + hs + ' 0 0 1 ' + (x + hs) + ' ' + (y + s)
          : 'M' + (x + hs) + ' ' + y + ' A' + hs + ' ' + hs + ' 0 0 1 ' + x + ' ' + (y + hs) + ' M' + (x + s) + ' ' + (y + hs) + ' A' + hs + ' ' + hs + ' 0 0 0 ' + (x + hs) + ' ' + (y + s);
        el('path', { d: p, fill: 'none', stroke: T.fg, 'stroke-width': T.sw, 'stroke-linecap': 'butt' }, g);
      } else {
        el('line', or ? { x1: x, y1: y, x2: x + s, y2: y + s, stroke: T.fg, 'stroke-width': T.sw, 'stroke-linecap': 'square' } : { x1: x + s, y1: y, x2: x, y2: y + s, stroke: T.fg, 'stroke-width': T.sw, 'stroke-linecap': 'square' }, g);
      }
    }
    function lsysResult() {
      var L = S.lsys, key = JSON.stringify([L.axiom, L.rules, L.angle, L.iter, L.heading, L.draw]);
      if (cache.lsKey !== key) { var errs = lsysCheck(L); cache.errs = errs; cache.ls = errs.length ? { d: '', n: 0, done: 0, capped: false, w: 1000, h: 1000 } : lsysRun(L); cache.lsKey = key; }
      return cache.ls;
    }
    function contentBox() {
      var mm = M();
      if (S.mode === 'rose') { var R = motifRadius(mm.shapes) + 20; return [-R, -R, R, R]; }
      if (S.mode === 'truchet') return [0, 0, mm.cols * mm.size, mm.rows * mm.size];
      if (S.mode === 'lsys') { var r = lsysResult(), m = Math.max(20, mm.sw * 2); return [-m, -m, Math.max(r.w, 1) + m, Math.max(r.h, 1) + m]; }
      var B = basisOf(mm), wv = Math.abs(B[0]) + Math.abs(B[2]), hv = Math.abs(B[1]) + Math.abs(B[3]); return [-wv, -hv * 0.8, wv * 2, hv * 1.8];
    }
    function fit() { var b = contentBox(), sz = vpSize(); view.fit({ minX: b[0], minY: b[1], maxX: b[2], maxY: b[3] }, sz[0], sz[1], 24); }
    function visibleRect() { var sz = vpSize(), a = view.toWorld(0, 0), b = view.toWorld(sz[0], sz[1]); return [a.x, a.y, b.x, b.y]; }
    function draw() {
      while (world.firstChild) world.removeChild(world.firstChild);
      world.setAttribute('transform', 'translate(' + view.x + ' ' + view.y + ') scale(' + view.scale + ')');
      var rect = visibleRect(); vp.style.background = M().bg;
      build(world, S.mode === 'wall' ? rect : [Math.min(rect[0], contentBox()[0]), Math.min(rect[1], contentBox()[1]), Math.max(rect[2], contentBox()[2]), Math.max(rect[3], contentBox()[3])], { overlay: true, k: 1 / view.scale, idp: 'vw' });
      var s = sel();
      if (s) { var rr = s.size * 0.62 + (s.sw || 0) / 2 + 6 / view.scale; el('circle', { cx: s.x, cy: s.y, r: rr, class: 'igp-sel', 'stroke-width': 2.5 / view.scale, 'stroke-dasharray': (6 / view.scale) + ' ' + (4 / view.scale) }, world); }
      if (penPts && penPts.length > 1) el('polyline', { points: penPts.map(function (p) { return p.join(','); }).join(' '), fill: 'none', stroke: '#5a49a8', 'stroke-width': 3 / view.scale }, world);
      hud.textContent = hudText();
    }
    function hudText() {
      if (S.mode === 'wall') return S.wall.group + ' · ' + GROUPS[S.wall.group].orb;
      if (S.mode === 'rose') return (S.rose.dihedral ? 'D' : 'C') + S.rose.n;
      if (S.mode === 'truchet') return t('var_' + S.truchet.variant) + ' · ' + t('seedShort') + ' «' + S.truchet.seed + '»';
      var r = lsysResult(); return t('lsSegs', { n: r.n, it: r.done });
    }

    /* ---------- Puntero ---------- */
    function toWorld(e) { var r = vp.getBoundingClientRect(); return view.toWorld(e.clientX - r.left, e.clientY - r.top); }
    function allOps() {
      if (S.mode === 'rose') return roseOps(S.rose).map(function (o) { return { op: o }; });
      var ops = cartOps(S.wall), B = basisOf(S.wall);
      return { ops: ops, B: B };
    }
    function hitShape(q, sh, tol) {
      var dx = q[0] - sh.x, dy = q[1] - sh.y, a = -(sh.rot || 0) * Math.PI / 180, lx = dx * Math.cos(a) - dy * Math.sin(a), ly = dx * Math.sin(a) + dy * Math.cos(a), s = sh.size;
      if (sh.type === 'circle' || sh.type === 'triangle') return Math.hypot(lx, ly) <= s / 2 + tol;
      if (sh.type === 'square') return Math.abs(lx) <= s / 2 + tol && Math.abs(ly) <= s / 2 + tol;
      if (sh.type === 'petal') return (lx * lx) / Math.pow(s * 0.22 + tol, 2) + (ly * ly) / Math.pow(s / 2 + tol, 2) <= 1;
      if (sh.type === 'line') return Math.abs(lx) <= s / 2 + tol && Math.abs(ly) <= (sh.sw || 6) / 2 + tol;
      var pts = sh.pts || [];
      for (var i = 1; i < pts.length; i++) { var ax = pts[i - 1][0] * s, ay = pts[i - 1][1] * s, bx = pts[i][0] * s, by = pts[i][1] * s, vx = bx - ax, vy = by - ay, L2 = vx * vx + vy * vy || 1, u = Math.max(0, Math.min(1, ((lx - ax) * vx + (ly - ay) * vy) / L2)); if (Math.hypot(lx - ax - u * vx, ly - ay - u * vy) <= (sh.sw || 6) / 2 + tol) return true; }
      return false;
    }
    /* Qué copia del motivo hay bajo un punto: se deshace la operación de cada copia. */
    function pick(p) {
      var list = shapes(), tol = 6 / view.scale; if (!list.length) return null;
      var cands = [];
      if (S.mode === 'rose') roseOps(S.rose).forEach(function (o) { cands.push(o); });
      else {
        var ops = cartOps(S.wall), B = basisOf(S.wall), Bi = inv([B[0], B[1], B[2], B[3], 0, 0]), f = apL(Bi, [p.x, p.y]), n = Math.ceil(motifRadius(list) / Math.min(Math.abs(B[0]), Math.abs(B[3]))) + 1;
        for (var i = Math.floor(f[0]) - n; i <= Math.floor(f[0]) + n; i++) for (var j = Math.floor(f[1]) - n; j <= Math.floor(f[1]) + n; j++) ops.forEach(function (o) { cands.push([o[0], o[1], o[2], o[3], o[4] + B[0] * i + B[2] * j, o[5] + B[1] * i + B[3] * j]); });
      }
      for (var c = cands.length - 1; c >= 0; c--) {
        var q = ap(inv(cands[c]), [p.x, p.y]);
        for (var k = list.length - 1; k >= 0; k--) if (hitShape(q, list[k], tol)) return { sh: list[k], op: cands[c] };
      }
      return null;
    }
    function reduce(p) {
      if (S.mode !== 'wall') return [p.x, p.y];
      var B = basisOf(S.wall), Bi = inv([B[0], B[1], B[2], B[3], 0, 0]), f = apL(Bi, [p.x, p.y]), fr = [f[0] - Math.floor(f[0]), f[1] - Math.floor(f[1])];
      return [B[0] * fr[0] + B[2] * fr[1], B[1] * fr[0] + B[3] * fr[1]];
    }
    var drag = null, penPts = null;
    vp.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 || tool === 'pan' || e.target.closest('button,input,select')) return;
      var p = toWorld(e);
      if (S.mode === 'truchet') { var x = Math.floor(p.x / S.truchet.size), y = Math.floor(p.y / S.truchet.size); if (x >= 0 && y >= 0 && x < S.truchet.cols && y < S.truchet.rows) { tileCur = [x, y]; rotateTile(x, y, 1); } return; }
      if (S.mode === 'lsys') return;
      if (tool === 'select') {
        var hit = pick(p);
        selectShape(hit ? hit.sh.id : null);
        if (hit) { drag = { id: hit.sh.id, start: p, orig: [hit.sh.x, hit.sh.y], lin: inv([hit.op[0], hit.op[1], hit.op[2], hit.op[3], 0, 0]), pid: e.pointerId }; vp.setPointerCapture(e.pointerId); }
        return;
      }
      if (tool === 'stroke') { var q = reduce(p), off = [q[0] - p.x, q[1] - p.y]; penPts = [[q[0], q[1]]]; drag = { pen: true, off: off, pid: e.pointerId }; vp.setPointerCapture(e.pointerId); return; }
      var q2 = reduce(p); addShape(tool, q2[0], q2[1]);
    });
    vp.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.pid) return; var p = toWorld(e);
      if (drag.pen) { penPts.push([p.x + drag.off[0], p.y + drag.off[1]]); draw(); return; }
      var s = byId(drag.id); if (!s) return; var d = apL(drag.lin, [p.x - drag.start.x, p.y - drag.start.y]);
      s.x = r1(drag.orig[0] + d[0]); s.y = r1(drag.orig[1] + d[1]); draw();
    });
    function endDrag(e) {
      if (!drag || e.pointerId !== drag.pid) return; var d = drag; drag = null;
      if (d.pen) { var pts = penPts; penPts = null; if (pts.length > 2) addStroke(pts); else draw(); return; }
      var s = byId(d.id); if (s && (s.x !== d.orig[0] || s.y !== d.orig[1])) commit(t('moved') + ': ' + describe(s));
    }
    vp.addEventListener('pointerup', endDrag); vp.addEventListener('pointercancel', endDrag);

    /* ---------- Operaciones ---------- */
    function describe(s) { return t('sh_' + s.type) + ' ' + t('colourWord') + ' ' + s.color + ', x ' + IG.num(s.x, 0) + ', y ' + IG.num(s.y, 0) + ', ' + t('sizeWord') + ' ' + IG.num(s.size, 0) + ', ' + IG.num(s.rot || 0, 0) + '°'; }
    function newShape(type, x, y) {
      var sh = { id: nid(), type: type, x: r1(x), y: r1(y), size: type === 'line' ? 60 : type === 'petal' ? 50 : 36, rot: 0, color: type === 'line' || type === 'stroke' ? '#101820' : ['#5a49a8', '#e0b000', '#0b8f8f', '#b3261e', '#1f5f8b'][seq % 5], sw: 6 };
      if (type === 'stroke') { sh.size = 60; sh.pts = [[-0.5, 0], [-0.25, -0.25], [0, 0], [0.25, 0.25], [0.5, 0]]; }
      return sh;
    }
    function addShape(type, x, y) {
      if (S.mode !== 'wall' && S.mode !== 'rose') return;
      if (shapes().length >= 40) { ctx.announce(t('tooManyShapes')); return; }
      if (x == null) { if (S.mode === 'wall') { var B = basisOf(S.wall); x = (B[0] + B[2]) / 2; y = (B[1] + B[3]) / 2; } else { x = 0; y = -60; } }
      var sh = newShape(type, x, y); M().shapes.push(sh); selId = sh.id; commit(t('added', { what: t('sh_' + type) }));
    }
    function addStroke(pts) {
      var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; }), x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
      var cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, size = Math.max(8, x1 - x0, y1 - y0), simp = [];
      pts.forEach(function (p, i) { var q = [(p[0] - cx) / size, (p[1] - cy) / size]; if (!i || i === pts.length - 1 || Math.hypot(q[0] - simp[simp.length - 1][0], q[1] - simp[simp.length - 1][1]) > 0.02) simp.push([Math.round(q[0] * 1000) / 1000, Math.round(q[1] * 1000) / 1000]); });
      var sh = { id: nid(), type: 'stroke', x: r1(cx), y: r1(cy), size: r1(size), rot: 0, color: '#101820', sw: 6, pts: simp.slice(0, 400) };
      M().shapes.push(sh); selId = sh.id; commit(t('added', { what: t('sh_stroke') }));
    }
    function removeShape(id) { var s = byId(id); if (!s) return; M().shapes = M().shapes.filter(function (x) { return x.id !== id; }); selId = null; commit(t('deleted', { what: t('sh_' + s.type) })); }
    function selectShape(id) { selId = id && byId(id) ? id : null; refresh(); var s = sel(); ctx.announce(s ? t('selected', { what: describe(s) }) : t('deselected')); }
    function rotateTile(x, y, dir) {
      var T = S.truchet, nOr = T.variant === 'triangles' ? 4 : 2, cur = truchetOrientation(x, y);
      T.flips[x + ',' + y] = (cur + dir + nOr) % nOr; commit(t('tileRotated', { x: x + 1, y: y + 1 }));
    }
    function setMode(m) {
      if (MODES.indexOf(m) < 0 || m === S.mode) return;
      S.mode = m; selId = null; lsSel = null; tileCur = null; setupTools(); fit(); refresh(); ctx.announce(t('mode_' + m));
    }
    function setGroup(g) {
      var W = S.wall, old = GROUPS[W.group].lat; W.group = g; if (W.seen.indexOf(g) < 0) W.seen.push(g);
      if (GROUPS[g].lat !== old) fit();
      commit(t('groupNow', { g: g, orb: GROUPS[g].orb, name: t('grp_' + g) }));
    }
    function commit(label) { refresh(); ctx.commit(label); if (label) ctx.announce(label); }

    /* ---------- Paneles ---------- */
    function keepFocus(container, fn) {
      var a = D.activeElement, fk = a && container.contains(a) ? a.getAttribute('data-fk') : null; fn(); if (!fk) return;
      var e2 = container.querySelector('[data-fk="' + fk + '"]') || container.querySelector('button:not([disabled])'); if (e2) { try { e2.focus({ preventScroll: true }); } catch (_) { e2.focus(); } }
    }
    function fk(node, key) { (node.input || node).setAttribute('data-fk', key); return node; }
    function renderStructure() {
      var ml = h('ul', { class: 'igs-list' });
      MODES.forEach(function (m) { var b = h('button', { type: 'button', 'aria-current': String(m === S.mode), 'data-fk': 'mode-' + m }, h('span', { class: 'igp-micon igp-micon-' + m, 'aria-hidden': 'true' }), h('span', { text: t('mode_' + m) })); b.addEventListener('click', function () { keepFocus(ctx.structure, function () { setMode(m); }); }); ml.appendChild(h('li', null, b)); });
      var out = [h('h3', { text: t('modes') }), ml];
      if (S.mode === 'wall' || S.mode === 'rose') {
        var sl = h('ul', { class: 'igs-list' });
        shapes().forEach(function (s) { var b = h('button', { type: 'button', 'aria-current': String(s.id === selId), 'data-fk': 'sh-' + s.id }, h('span', { class: 'igs-swatch', style: 'background:' + s.color }), h('span', { text: t('sh_' + s.type) }), h('small', { text: IG.num(s.x, 0) + ', ' + IG.num(s.y, 0) })); b.addEventListener('click', function () { keepFocus(ctx.structure, function () { selectShape(s.id); }); }); sl.appendChild(h('li', null, b)); });
        out.push(h('h3', { text: t('motifN', { n: shapes().length }) }), sl);
        if (!shapes().length) out.push(h('p', { class: 'igs-muted', text: t('motifEmpty') }));
      } else if (S.mode === 'truchet') {
        var fl = h('ul', { class: 'igs-list' }), keys = Object.keys(S.truchet.flips);
        keys.slice(0, 40).forEach(function (kk) { var p = kk.split(',').map(Number), on = tileCur && tileCur[0] === p[0] && tileCur[1] === p[1]; var b = h('button', { type: 'button', 'aria-current': String(!!on), 'data-fk': 'tile-' + kk }, h('span', { class: 'igs-swatch', style: 'background:' + S.truchet.fg }), h('span', { text: t('tileAt', { x: p[0] + 1, y: p[1] + 1 }) })); b.addEventListener('click', function () { tileCur = p; keepFocus(ctx.structure, refresh); }); fl.appendChild(h('li', null, b)); });
        out.push(h('h3', { text: t('handTiles', { n: keys.length }) }), fl);
        if (!keys.length) out.push(h('p', { class: 'igs-muted', text: t('handTilesEmpty') }));
      } else {
        var rl = h('ul', { class: 'igs-list' });
        [['axiom', t('lsAxiom') + ': ' + S.lsys.axiom]].concat(S.lsys.rules.map(function (r, i) { return ['r' + i, r[0] + ' → ' + r[1]]; })).forEach(function (it) {
          var b = h('button', { type: 'button', 'aria-current': String(lsSel === it[0]), 'data-fk': 'ls-' + it[0] }, h('span', { class: 'igp-code', text: it[1].length > 26 ? it[1].slice(0, 25) + '…' : it[1] }));
          b.addEventListener('click', function () { lsSel = lsSel === it[0] ? null : it[0]; keepFocus(ctx.structure, refresh); var f = ctx.inspector.querySelector('[data-fk="ls-edit"]'); if (f && lsSel) f.focus(); });
          rl.appendChild(h('li', null, b));
        });
        out.push(h('h3', { text: t('lsRules') }), rl);
      }
      ctx.setStructure(out);
    }
    function swatchField(label, value, onPick) {
      var wrap = h('div', { class: 'igs-field igp-colour' }, h('span', { class: 'igp-colour-label', text: label })), row = h('div', { class: 'igp-swatches', role: 'group', 'aria-label': label });
      SWATCHES.forEach(function (c) { var b = h('button', { type: 'button', class: 'igp-sw', style: 'background:' + c, 'aria-pressed': String(String(value).toLowerCase() === c), 'aria-label': t('colourHex', { hex: c }), 'data-fk': 'sw-' + label + c }); b.addEventListener('click', function () { onPick(c); }); row.appendChild(b); });
      wrap.appendChild(row); wrap.appendChild(fk(F.color(t('customColour'), value, { onChange: onPick }), 'cc-' + label)); return wrap;
    }
    function num(label, key, value, o) { return fk(F.number(label, value, o), key); }
    function addButtons() {
      return h('div', { class: 'igs-actions igp-addrow' }, SHAPES.map(function (ty) { return ctx.button(t('sh_' + ty), { icon: { circle: 'circle', square: 'square', triangle: 'triangle', petal: 'sparkle', line: 'line', stroke: 'pen' }[ty], class: 'igp-add', dataset: { fk: 'add-' + ty }, onClick: function () { addShape(ty); } }); }));
    }
    function reviewList(items) {
      return h('ul', { class: 'iga-review' }, items.map(function (x) { return h('li', { 'data-ok': String(x.ok) }, h('span', { class: 'iga-mark', 'aria-hidden': 'true', text: x.ok ? '✓' : '!' }), h('span', { class: 'igs-sr', text: (x.ok ? t('okWord') : t('checkWord')) + ': ' }), x.text); }));
    }
    function challengeBlock(out) {
      var ch = S.challenge; if (!ch) return;
      if ({ onetile: 'wall', seventeen: 'wall', ownfractal: 'lsys' }[ch] !== S.mode) return;
      out.push(h('h4', { text: t('challengeTitle') + ': ' + t('ch_' + ch) }));
      out.push(h('p', { class: 'igs-note', text: t('ch_' + ch + 'D') }));
      if (ch === 'seventeen') {
        var seen = S.wall.seen.length; out.push(h('p', { class: 'igs-result', 'data-kind': seen >= 17 ? 'ok' : 'bad' }, h('strong', { text: seen >= 17 ? t('seenAll') : t('seenN', { n: seen }) })));
        out.push(h('ul', { class: 'igp-seen' }, GROUP_IDS.map(function (g) { var on = S.wall.seen.indexOf(g) >= 0; return h('li', { 'data-ok': String(on) }, h('span', { 'aria-hidden': 'true', text: on ? '✓ ' : '○ ' }), h('span', { class: 'igs-sr', text: on ? t('seenWord') + ': ' : t('notSeenWord') + ': ' }), g); })));
        out.push(h('div', { class: 'igs-actions' }, ctx.button(t('nextGroup'), { icon: 'redo', dataset: { fk: 'nextGroup' }, onClick: nextGroup })));
      } else if (ch === 'ownfractal') {
        var own = !Object.keys(PRESETS).some(function (k) { return JSON.stringify(PRESETS[k].rules) === JSON.stringify(S.lsys.rules.map(function (r) { return [cleanRule(r[0]), cleanRule(r[1])]; })) && PRESETS[k].axiom === cleanRule(S.lsys.axiom); });
        var changed = JSON.stringify(S.lsys.rules) !== JSON.stringify([['F', 'F[+F]F[-F]F']]) || S.lsys.axiom !== 'F';
        var r = lsysResult();
        out.push(reviewList([{ ok: own && changed, text: t('chkOwnRules') }, { ok: !cache.errs.length, text: t('chkValid') }, { ok: r.n >= 50, text: t('chkSegs', { n: r.n }) }]));
      } else if (ch === 'onetile') {
        out.push(reviewList([{ ok: S.mode === 'wall' && GROUPS[S.wall.group].ops.length > 1, text: t('chkCopies', { n: GROUPS[S.wall.group].ops.length }) }, { ok: shapes().length >= 3, text: t('chkShapes', { n: S.wall.shapes.length }) }]));
      }
    }
    function nextGroup() { var i = GROUP_IDS.indexOf(S.wall.group), n = GROUP_IDS.filter(function (g) { return S.wall.seen.indexOf(g) < 0; })[0] || GROUP_IDS[(i + 1) % 17]; if (S.mode !== 'wall') setMode('wall'); setGroup(n); }
    function renderInspector() {
      var out = [], mm = M(), s = sel();
      if (s) {
        out.push(h('h4', { text: t('sh_' + s.type) }));
        out.push(num('x', 'sx', s.x, { min: -2000, max: 2000, step: 1, onChange: function (v) { s.x = v; commit(t('moved') + ': ' + describe(s)); } }));
        out.push(num('y', 'sy', s.y, { min: -2000, max: 2000, step: 1, onChange: function (v) { s.y = v; commit(t('moved') + ': ' + describe(s)); } }));
        out.push(num(t('sizeLabel'), 'ssize', s.size, { min: 2, max: 600, step: 1, onChange: function (v) { s.size = v; commit(t('changed')); } }));
        out.push(num(t('rotLabel'), 'srot', s.rot || 0, { min: -360, max: 360, step: 5, unit: '°', onChange: function (v) { s.rot = v; commit(t('rotated')); } }));
        if (s.type === 'line' || s.type === 'stroke') out.push(num(t('swLabel'), 'ssw', s.sw || 6, { min: 1, max: 80, step: 1, onChange: function (v) { s.sw = v; commit(t('changed')); } }));
        out.push(swatchField(t('colourLabel'), s.color, function (c) { s.color = c; commit(t('colourChanged')); }));
        var i = mm.shapes.indexOf(s);
        out.push(h('div', { class: 'igs-actions' },
          ctx.button(t('toFront'), { icon: 'layers', dataset: { fk: 'front' }, disabled: i === mm.shapes.length - 1, onClick: function () { mm.shapes.splice(mm.shapes.indexOf(s), 1); mm.shapes.push(s); commit(t('reordered')); } }),
          ctx.button(t('toBack'), { icon: 'layers', dataset: { fk: 'back' }, disabled: i === 0, onClick: function () { mm.shapes.splice(mm.shapes.indexOf(s), 1); mm.shapes.unshift(s); commit(t('reordered')); } }),
          ctx.button(t('duplicate'), { icon: 'copy', dataset: { fk: 'dup' }, onClick: function () { if (mm.shapes.length >= 40) { ctx.announce(t('tooManyShapes')); return; } var c = JSON.parse(JSON.stringify(s)); c.id = nid(); c.x += 12; c.y += 12; mm.shapes.push(c); selId = c.id; commit(t('duplicated')); } }),
          ctx.button(t('deleteBtn'), { icon: 'trash', class: 'igs-danger', dataset: { fk: 'del' }, onClick: function () { removeShape(s.id); } })));
        out.push(h('p', { class: 'igs-muted igp-small', text: t('shapeHelp') }));
      } else if (S.mode === 'wall') {
        var W = S.wall, G = GROUPS[W.group];
        challengeBlock(out);
        out.push(h('h4', { text: t('wallTitle') }));
        out.push(fk(F.select(t('groupLabel'), W.group, GROUP_IDS.map(function (g) { return [g, g + ' · ' + GROUPS[g].orb + ' · ' + t('grp_' + g)]; }), { onChange: setGroup }), 'group'));
        out.push(h('div', { class: 'igp-card' }, h('p', { class: 'igp-gname' }, h('strong', { text: W.group }), ' · ', t('orbWord') + ' ', h('strong', { text: G.orb }), ' · ' + t('lat_' + G.lat)), h('p', { text: t('grpD_' + W.group) }), h('p', { class: 'igp-small', text: t('copiesN', { n: G.ops.length }) })));
        out.push(num(t('cellSize'), 'a', W.a, { min: 40, max: 400, step: 5, onChange: function (v) { W.a = v; commit(t('changed')); } }));
        if (G.lat === 'rect' || G.lat === 'rhombic' || G.lat === 'oblique') out.push(num(t('ratioLabel'), 'ratio', W.ratio, { min: 0.4, max: 2.5, step: 0.05, onChange: function (v) { W.ratio = v; commit(t('changed')); } }));
        if (G.lat === 'oblique') out.push(fk(F.select(t('skewLabel'), W.skew, SKEWS.map(function (k) { return [k, k]; }), { onChange: function (v) { W.skew = v; commit(t('changed')); } }), 'skew'));
        out.push(fk(F.check(t('showCell'), W.showCell, { onChange: function (v) { W.showCell = !!v; commit(t('changed')); } }), 'showCell'));
        out.push(fk(F.check(t('showAxes'), W.showAxes, { onChange: function (v) { W.showAxes = !!v; commit(t('changed')); } }), 'showAxes'));
        if (W.showAxes) out.push(h('ul', { class: 'igp-legend igp-small' }, h('li', null, h('span', { class: 'igp-lg igp-lg-m', 'aria-hidden': 'true' }), t('lgMirror')), h('li', null, h('span', { class: 'igp-lg igp-lg-g', 'aria-hidden': 'true' }), t('lgGlide')), h('li', null, h('span', { 'aria-hidden': 'true', text: '⬮ ▲ ◆ ⬢ ' }), t('lgRot'))));
        out.push(swatchField(t('bgLabel'), W.bg, function (c) { W.bg = c; commit(t('colourChanged')); }));
        out.push(h('p', { class: 'igs-field-group', text: t('addShape') }), addButtons());
      } else if (S.mode === 'rose') {
        var Rz = S.rose;
        challengeBlock(out);
        out.push(h('h4', { text: t('roseTitle') }));
        out.push(num(t('roseN'), 'n', Rz.n, { min: 2, max: 24, step: 1, onChange: function (v) { Rz.n = Math.round(v); commit(t('roseNow', { s: (Rz.dihedral ? 'D' : 'C') + Rz.n })); } }));
        out.push(F.choice(t('roseKind'), Rz.dihedral ? 'D' : 'C', [['C', t('roseC')], ['D', t('roseD')]], { onChange: function (v) { Rz.dihedral = v === 'D'; commit(t('roseNow', { s: v + Rz.n })); } }));
        out.push(h('p', { class: 'igs-muted igp-small', text: t(Rz.dihedral ? 'roseDD' : 'roseCD', { n: Rz.n }) }));
        out.push(fk(F.check(t('showAxes'), Rz.showAxes, { onChange: function (v) { Rz.showAxes = !!v; commit(t('changed')); } }), 'showAxes'));
        out.push(swatchField(t('bgLabel'), Rz.bg, function (c) { Rz.bg = c; commit(t('colourChanged')); }));
        out.push(h('p', { class: 'igs-field-group', text: t('addShape') }), addButtons());
      } else if (S.mode === 'truchet') {
        var T = S.truchet;
        challengeBlock(out);
        if (tileCur) {
          out.push(h('h4', { text: t('tileAt', { x: tileCur[0] + 1, y: tileCur[1] + 1 }) }));
          out.push(h('div', { class: 'igs-actions' }, ctx.button(t('rotateTile'), { icon: 'rotate', dataset: { fk: 'rotTile' }, onClick: function () { rotateTile(tileCur[0], tileCur[1], 1); } }),
            ctx.button(t('resetTile'), { icon: 'undo', dataset: { fk: 'resetTile' }, disabled: T.flips[tileCur.join(',')] == null, onClick: function () { delete T.flips[tileCur.join(',')]; commit(t('tileReset')); } })));
        }
        out.push(h('h4', { text: t('truchetTitle') }));
        out.push(F.choice(t('variantLabel'), T.variant, [['triangles', t('var_triangles')], ['arcs', t('var_arcs')], ['lines', t('var_lines')]], { onChange: function (v) { T.variant = v; T.flips = {}; commit(t('changed')); } }));
        out.push(h('p', { class: 'igs-muted igp-small', text: t('var_' + T.variant + 'D') }));
        out.push(fk(F.select(t('ruleLabel'), T.rule, [['random', t('rule_random')], ['checker', t('rule_checker')], ['rows', t('rule_rows')], ['diagonal', t('rule_diagonal')]], { onChange: function (v) { T.rule = v; commit(t('changed')); } }), 'rule'));
        out.push(fk(F.text(t('seedLabel'), T.seed, { max: 24, onChange: function (v) { T.seed = String(v).slice(0, 24) || 'iris'; commit(t('seedNow', { s: T.seed })); } }), 'seed'));
        out.push(h('div', { class: 'igs-actions' }, ctx.button(t('newSeed'), { icon: 'sparkle', dataset: { fk: 'newSeed' }, onClick: newSeed }), ctx.button(t('clearHand'), { icon: 'undo', dataset: { fk: 'clearHand' }, disabled: !Object.keys(T.flips).length, onClick: function () { T.flips = {}; commit(t('handCleared')); } })));
        out.push(num(t('colsLabel'), 'cols', T.cols, { min: 2, max: 60, step: 1, onChange: function (v) { T.cols = Math.round(v); commit(t('changed')); } }));
        out.push(num(t('rowsLabel'), 'rows', T.rows, { min: 2, max: 60, step: 1, onChange: function (v) { T.rows = Math.round(v); commit(t('changed')); } }));
        out.push(num(t('tileSize'), 'tsize', T.size, { min: 10, max: 200, step: 5, onChange: function (v) { T.size = v; commit(t('changed')); } }));
        if (T.variant !== 'triangles') out.push(num(t('swLabel'), 'tsw', T.sw, { min: 1, max: 60, step: 1, onChange: function (v) { T.sw = v; commit(t('changed')); } }));
        out.push(swatchField(t('fgLabel'), T.fg, function (c) { T.fg = c; commit(t('colourChanged')); }));
        out.push(swatchField(t('bgLabel'), T.bg, function (c) { T.bg = c; commit(t('colourChanged')); }));
      } else {
        var L = S.lsys, res = lsysResult();
        challengeBlock(out);
        if (lsSel) {
          if (lsSel === 'axiom') out.push(h('h4', { text: t('lsAxiom') }), fk(F.text(t('lsAxiomLabel'), L.axiom, { max: 200, onChange: function (v) { L.axiom = cleanRule(v).slice(0, 200); commit(t('rulesChanged')); } }), 'ls-edit'));
          else {
            var ri = +lsSel.slice(1), rule = L.rules[ri];
            if (rule) {
              out.push(h('h4', { text: t('lsRuleN', { n: ri + 1 }) }));
              out.push(fk(F.text(t('lsPred'), rule[0], { max: 1, onChange: function (v) { rule[0] = cleanRule(v).slice(0, 1); commit(t('rulesChanged')); } }), 'ls-pred'));
              out.push(fk(F.text(t('lsSucc'), rule[1], { max: 200, onChange: function (v) { rule[1] = cleanRule(v).slice(0, 200); commit(t('rulesChanged')); } }), 'ls-edit'));
              out.push(h('div', { class: 'igs-actions' }, ctx.button(t('lsDelRule'), { icon: 'trash', class: 'igs-danger', dataset: { fk: 'delRule' }, onClick: function () { L.rules.splice(ri, 1); lsSel = null; commit(t('rulesChanged')); } })));
            }
          }
        }
        out.push(h('h4', { text: t('lsTitle') }));
        out.push(fk(F.select(t('lsPreset'), '', [['', t('lsChoose')]].concat(Object.keys(PRESETS).map(function (k) { return [k, t('pre_' + k)]; })), { onChange: function (v) { if (!v) return; var P = PRESETS[v]; L.axiom = P.axiom; L.rules = P.rules.map(function (r) { return r.slice(); }); L.angle = P.angle; L.iter = P.iter; L.heading = P.heading; L.draw = P.draw; lsSel = null; commit(t('presetNow', { name: t('pre_' + v) })); fit(); draw(); } }), 'preset'));
        if (!lsSel) {
          out.push(fk(F.text(t('lsAxiomLabel'), L.axiom, { max: 200, onChange: function (v) { L.axiom = cleanRule(v).slice(0, 200); commit(t('rulesChanged')); } }), 'axiom'));
          L.rules.forEach(function (r, i) {
            out.push(h('div', { class: 'igp-rule' }, fk(F.text(t('lsPredN', { n: i + 1 }), r[0], { max: 1, onChange: function (v) { r[0] = cleanRule(v).slice(0, 1); commit(t('rulesChanged')); } }), 'pred' + i),
              fk(F.text(t('lsSuccN', { n: i + 1 }), r[1], { max: 200, onChange: function (v) { r[1] = cleanRule(v).slice(0, 200); commit(t('rulesChanged')); } }), 'succ' + i)));
          });
        }
        out.push(h('div', { class: 'igs-actions' }, ctx.button(t('lsAddRule'), { icon: 'plus', dataset: { fk: 'addRule' }, disabled: L.rules.length >= 8, onClick: function () { var used = L.rules.map(function (r) { return r[0]; }), c = 'XYZABCDE'.split('').filter(function (x) { return used.indexOf(x) < 0; })[0] || 'X'; L.rules.push([c, c]); lsSel = 'r' + (L.rules.length - 1); commit(t('rulesChanged')); } })));
        if (cache.errs && cache.errs.length) out.push(h('div', { class: 'igs-result', 'data-kind': 'bad', role: 'alert' }, h('strong', { text: t('lsErrTitle') }), h('ul', { class: 'igp-errs' }, cache.errs.map(function (e) { return h('li', { text: t(e.k, Object.assign({ where: '', n: '', c: '' }, e.v || {}, { where: e.v && e.v.where ? t('where_' + e.v.where, e.v) : '' })) }); }))));
        else out.push(h('p', { class: 'igs-result', 'data-kind': res.capped ? 'bad' : 'ok' }, h('strong', { text: t('lsSegs', { n: res.n, it: res.done }) }), res.capped ? t('lsCapped', { max: MAX_SEG, it: res.done }) : ''));
        out.push(num(t('lsAngle'), 'angle', L.angle, { min: 1, max: 180, step: 0.5, unit: '°', onChange: function (v) { L.angle = v; commit(t('changed')); } }));
        out.push(num(t('lsIter'), 'iter', L.iter, { min: 0, max: 12, step: 1, onChange: function (v) { L.iter = Math.round(v); commit(t('changed')); fit(); draw(); } }));
        out.push(num(t('lsHeading'), 'heading', L.heading, { min: -360, max: 360, step: 5, unit: '°', onChange: function (v) { L.heading = v; commit(t('changed')); fit(); draw(); } }));
        out.push(fk(F.text(t('lsDraw'), L.draw, { max: 10, onChange: function (v) { L.draw = String(v).replace(/[^A-Za-z]/g, '').slice(0, 10) || 'F'; commit(t('changed')); } }), 'draw'));
        out.push(num(t('swLabel'), 'lsw', L.sw, { min: 0.5, max: 30, step: 0.5, onChange: function (v) { L.sw = v; commit(t('changed')); } }));
        out.push(swatchField(t('fgLabel'), L.fg, function (c) { L.fg = c; commit(t('colourChanged')); }));
        out.push(swatchField(t('bgLabel'), L.bg, function (c) { L.bg = c; commit(t('colourChanged')); }));
        out.push(h('p', { class: 'igs-muted igp-small', text: t('lsHelp') }));
      }
      keepFocus(ctx.inspector, function () { ctx.setInspector(out); });
    }
    function summary() {
      var mm = M();
      function shapesText(list) { return list.length ? list.map(describe).join('; ') + '.' : t('motifEmpty'); }
      if (S.mode === 'wall') { var G = GROUPS[mm.group]; return t('sumWall', { g: mm.group, orb: G.orb, name: t('grp_' + mm.group), lat: t('lat_' + G.lat).toLowerCase(), a: mm.a, copies: G.ops.length, n: mm.shapes.length, bg: mm.bg }) + ' ' + shapesText(mm.shapes) + (mm.showAxes ? ' ' + t('sumAxes') : ''); }
      if (S.mode === 'rose') return t('sumRose', { s: (mm.dihedral ? 'D' : 'C') + mm.n, n: mm.n, m: mm.dihedral ? mm.n : 0, k: mm.shapes.length, bg: mm.bg }) + ' ' + shapesText(mm.shapes);
      if (S.mode === 'truchet') return t('sumTruchet', { v: t('var_' + mm.variant), c: mm.cols, r: mm.rows, s: mm.size, seed: mm.seed, rule: t('rule_' + mm.rule).toLowerCase(), hand: Object.keys(mm.flips).length, fg: mm.fg, bg: mm.bg }) + (tileCur ? ' ' + t('tileAt', { x: tileCur[0] + 1, y: tileCur[1] + 1 }) + '.' : '');
      var r = lsysResult(); return t('sumLsys', { ax: mm.axiom, rules: mm.rules.map(function (q) { return q[0] + ' → ' + q[1]; }).join('; '), a: mm.angle, it: r.done, n: r.n, fg: mm.fg });
    }
    function refresh() { draw(); renderStructure(); renderInspector(); ctx.setSummary(summary()); }
    function newSeed() { var words = ['iris', 'luna', 'mar', 'sol', 'nube', 'rio', 'hoja', 'faro', 'ola', 'pino', 'lago', 'monte']; S.truchet.seed = words[Math.floor(Math.random() * words.length)] + Math.floor(Math.random() * 1000); S.truchet.flips = {}; commit(t('seedNow', { s: S.truchet.seed })); }

    /* ---------- Teclado ---------- */
    var kTimer = 0;
    function keyCommit(label) { clearTimeout(kTimer); kTimer = setTimeout(function () { ctx.commit(label); renderInspector(); }, 400); }
    function onKey(e) {
      if (!vp.contains(e.target)) return false;
      var k = e.key, st = e.shiftKey ? 10 : 2, d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[k];
      if (k === '+' || k === '=') { var sz = vpSize(); view.zoomAt(sz[0] / 2, sz[1] / 2, 1.25); return true; }
      if (k === '-' || k === '_') { var sz2 = vpSize(); view.zoomAt(sz2[0] / 2, sz2[1] / 2, 0.8); return true; }
      if (k === '0') { fit(); return true; }
      if (S.mode === 'truchet') {
        if (d) { if (!tileCur) tileCur = [0, 0]; else tileCur = [Math.max(0, Math.min(S.truchet.cols - 1, tileCur[0] + d[0])), Math.max(0, Math.min(S.truchet.rows - 1, tileCur[1] + d[1]))]; draw(); renderInspector(); renderStructure(); ctx.setSummary(summary()); ctx.announce(t('tileAt', { x: tileCur[0] + 1, y: tileCur[1] + 1 }) + ': ' + t('orientN', { n: truchetOrientation(tileCur[0], tileCur[1]) + 1 })); return true; }
        if ((k === 'Enter' || k === ' ') && tileCur) { rotateTile(tileCur[0], tileCur[1], e.shiftKey ? -1 : 1); return true; }
        if ((k === 'Delete' || k === 'Backspace') && tileCur && S.truchet.flips[tileCur.join(',')] != null) { delete S.truchet.flips[tileCur.join(',')]; commit(t('tileReset')); return true; }
        if (k === 'Escape' && tileCur) { tileCur = null; refresh(); return true; }
        return false;
      }
      if (S.mode === 'lsys') {
        if (k === 'ArrowUp' || k === 'ArrowDown') { S.lsys.iter = Math.max(0, Math.min(12, S.lsys.iter + (k === 'ArrowUp' ? 1 : -1))); fit(); keyCommit(t('changed')); draw(); ctx.setSummary(summary()); ctx.announce(hudText()); return true; }
        if (k === 'ArrowLeft' || k === 'ArrowRight') { S.lsys.angle = Math.max(1, Math.min(180, r1(S.lsys.angle + (k === 'ArrowRight' ? 1 : -1) * (e.shiftKey ? 5 : 1)))); keyCommit(t('changed')); draw(); ctx.setSummary(summary()); ctx.announce(t('lsAngle') + ' ' + IG.num(S.lsys.angle, 1) + '°'); return true; }
        return false;
      }
      var list = shapes(), s = sel();
      if ((k === '[' || k === ']') && list.length) { var i = s ? list.indexOf(s) : -1; i = k === ']' ? (i + 1) % list.length : (i - 1 + list.length) % list.length; selectShape(list[i].id); return true; }
      if (d && s) { s.x = r1(s.x + d[0] * st); s.y = r1(s.y + d[1] * st); draw(); ctx.setSummary(summary()); keyCommit(t('moved')); ctx.announce(describe(s)); return true; }
      if ((k === 'r' || k === 'R') && s) { s.rot = ((s.rot || 0) + (e.shiftKey ? -15 : 15) + 360) % 360; commit(t('rotated') + ': ' + describe(s)); return true; }
      if ((k === 'Delete' || k === 'Backspace') && s) { removeShape(s.id); return true; }
      if (k === 'Escape' && s) { selectShape(null); return true; }
      if ((k === 'Enter' || k === ' ') && SHAPES.indexOf(tool) >= 0) { addShape(tool); return true; }
      if ((k === 'Enter' || k === ' ') && !s && list.length) { selectShape(list[0].id); return true; }
      return false;
    }

    /* ---------- Herramientas ---------- */
    var modeSel = h('select', { 'aria-label': t('modeLabel') }); MODES.forEach(function (m) { modeSel.appendChild(h('option', { value: m, text: t('mode_' + m) })); });
    modeSel.addEventListener('change', function () { setMode(modeSel.value); });
    function setupTools() {
      modeSel.value = S.mode;
      var list = [{ node: h('label', { class: 'igs-inline-select' }, h('span', { text: t('modeLabel') }), modeSel) }];
      if (S.mode === 'wall' || S.mode === 'rose') {
        list.push({ id: 'select', label: t('toolSelect'), icon: 'select' });
        SHAPES.forEach(function (ty) { list.push({ id: ty, label: t('sh_' + ty), icon: { circle: 'circle', square: 'square', triangle: 'triangle', petal: 'sparkle', line: 'line', stroke: 'pen' }[ty], level: ty === 'petal' || ty === 'stroke' ? 'more' : null }); });
        if (S.mode === 'wall') list.push({ separator: true }, { id: 'axes', label: t('axesBtn'), icon: 'eye', action: function (b) { S.wall.showAxes = !S.wall.showAxes; b.setAttribute('aria-pressed', String(S.wall.showAxes)); commit(t(S.wall.showAxes ? 'axesOn' : 'axesOff')); } });
      } else if (S.mode === 'truchet') {
        list.push({ id: 'tile', label: t('toolTile'), icon: 'rotate' }, { id: 'seed', label: t('newSeed'), icon: 'sparkle', action: newSeed });
      } else {
        list.push({ id: 'itm', label: t('iterMinus'), icon: 'minus', action: function () { S.lsys.iter = Math.max(0, S.lsys.iter - 1); commit(t('iterNow', { n: S.lsys.iter })); fit(); draw(); } },
          { id: 'itp', label: t('iterPlus'), icon: 'plus', action: function () { S.lsys.iter = Math.min(12, S.lsys.iter + 1); commit(t('iterNow', { n: S.lsys.iter })); fit(); draw(); } });
      }
      list.push({ id: 'pan', label: t('toolPan'), icon: 'pan', level: 'more' }, { id: 'fitv', label: t('fitView'), icon: 'fit', level: 'more', action: fit });
      ctx.setTools(list, { initial: S.mode === 'truchet' ? 'tile' : (S.mode === 'lsys' ? 'pan' : 'select') });
      var ab = ctx.toolbar.querySelector('.igs-btn:not([data-tool])'); void ab;
      Array.prototype.forEach.call(ctx.toolbar.querySelectorAll('.igs-btn'), function (b) { if (b.textContent.trim() === t('axesBtn')) b.setAttribute('aria-pressed', String(!!S.wall.showAxes)); });
    }
    MODES.forEach(function (m) { ctx.command('mode-' + m, t('mode_' + m), t('modeLabel'), function () { setMode(m); }); });
    ctx.command('next-group', t('nextGroup'), t('mode_wall'), nextGroup);
    ctx.command('seed', t('newSeed'), t('mode_truchet'), function () { if (S.mode !== 'truchet') setMode('truchet'); newSeed(); });
    ctx.command('axes', t('axesBtn'), t('mode_wall'), function () { var m = M(); if ('showAxes' in m) { m.showAxes = !m.showAxes; commit(t(m.showAxes ? 'axesOn' : 'axesOff')); } });
    ctx.command('fit', t('fitView'), '', fit);

    /* ---------- Exportaciones ---------- */
    function exportSpec(kind) {
      var mm = M();
      if (kind === 'tile') {
        if (S.mode === 'wall') { var pr = periodRect(mm); return { rect: [0, 0, pr[0], pr[1]], tile: true }; }
        var b = contentBox(); if (S.mode === 'truchet') return { rect: b, tile: true };
        var w = b[2] - b[0], hh = b[3] - b[1], m = Math.max(w, hh); return { rect: [b[0] - (m - w) / 2, b[1] - (m - hh) / 2, b[0] - (m - w) / 2 + m, b[1] - (m - hh) / 2 + m], tile: true };
      }
      if (S.mode === 'wall') { var B = basisOf(mm), cx = (B[0] + B[2]) / 2, cy = (B[1] + B[3]) / 2, W = Math.max(900, mm.a * 7), H = W * 2 / 3; return { rect: [cx - W / 2, cy - H / 2, cx + W / 2, cy + H / 2] }; }
      return { rect: contentBox() };
    }
    function svgFor(kind, credit) {
      var sp = exportSpec(kind), r = sp.rect, w = r[2] - r[0], hh = r[3] - r[1], foot = credit ? Math.max(18, Math.round(hh * 0.04)) : 0;
      var s = D.createElementNS(SVGNS, 'svg'); s.setAttribute('xmlns:xlink', XLINK);
      s.setAttribute('viewBox', [r2(r[0]), r2(r[1]), r2(w), r2(hh + foot)].join(' ')); s.setAttribute('width', r2(w)); s.setAttribute('height', r2(hh + foot));
      s.setAttribute('role', 'img'); var tt = el('title', {}, s); tt.textContent = t('exportTitle', { what: hudText() }); var ds = el('desc', {}, s); ds.textContent = summary();
      var cp = el('clipPath', { id: 'ex-clip' }, el('defs', {}, s)); el('rect', { x: r[0], y: r[1], width: w, height: hh }, cp);
      var g = el('g', { 'clip-path': 'url(#ex-clip)' }, s); build(g, r, { idp: 'ex', k: 1, overlay: false });
      if (credit) { el('rect', { x: r[0], y: r[1] + hh, width: w, height: foot, fill: '#f4f7fa' }, s); var tx = el('text', { x: r2(r[2] - foot * 0.5), y: r2(r[1] + hh + foot * 0.68), 'text-anchor': 'end', 'font-family': 'Atkinson Hyperlegible, Arial, sans-serif', 'font-size': r2(foot * 0.5), fill: '#17395c' }, s); tx.textContent = 'IRIS GREEN · irisgreen.eu'; }
      return { el: s, w: w, h: hh, foot: foot };
    }
    function rasterize(x, maxSide) {
      return new Promise(function (resolve, reject) {
        var sc = Math.min(16, maxSide / Math.max(x.w, x.h)), cw = Math.max(1, Math.round(x.w * sc)), ch = Math.max(1, Math.round(x.h * sc));
        x.el.setAttribute('width', cw); x.el.setAttribute('height', ch);
        var url = URL.createObjectURL(new Blob([ctx.svgText(x.el)], { type: 'image/svg+xml' })), img = new Image();
        img.onload = function () { var c = D.createElement('canvas'); c.width = cw; c.height = ch; var g = c.getContext('2d'); g.drawImage(img, 0, 0, cw, ch); URL.revokeObjectURL(url); resolve(c); };
        img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('svg')); };
        img.src = url;
      });
    }
    /* Azulejo sin costuras: el crédito va en un bloque de texto del PNG (tEXt), no encima del dibujo. */
    var CRC = (function () { var c, tb = []; for (var n = 0; n < 256; n++) { c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; tb[n] = c >>> 0; } return tb; })();
    function crc32(a) { var c = 0xffffffff; for (var i = 0; i < a.length; i++) c = CRC[(c ^ a[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
    function pngWithText(blob, key, text) {
      return blob.arrayBuffer().then(function (buf) {
        var src = new Uint8Array(buf), kw = new TextEncoder().encode(key), val = new TextEncoder().encode(text).filter(function (b) { return b < 128; });
        var data = new Uint8Array(kw.length + 1 + val.length); data.set(kw, 0); data[kw.length] = 0; data.set(val, kw.length + 1);
        var typ = new TextEncoder().encode('tEXt'), body = new Uint8Array(4 + data.length); body.set(typ, 0); body.set(data, 4);
        var crc = crc32(body), chunk = new Uint8Array(12 + data.length), dv = new DataView(chunk.buffer);
        dv.setUint32(0, data.length); chunk.set(body, 4); dv.setUint32(8 + data.length, crc);
        var out = new Uint8Array(src.length + chunk.length); out.set(src.subarray(0, 33), 0); out.set(chunk, 33); out.set(src.subarray(33), 33 + chunk.length);
        return new Blob([out], { type: 'image/png' });
      });
    }
    function fname(suffix) { return (LANG === 'en' ? 'pattern-' : 'patron-') + S.mode + '-' + ctx.stamp() + suffix; }
    var EXPORTS = [
      ['exportSvg', function () { var x = svgFor('view', true); ctx.download(new Blob([ctx.svgText(x.el)], { type: 'image/svg+xml' }), fname('.svg')); }],
      ['exportPng', function () { rasterize(svgFor('view', false), 2400).then(function (c) { return ctx.canvasBlob(ctx.canvasWithCredit(c, M().bg)); }).then(function (b) { ctx.download(b, fname('.png')); }).catch(function () { ctx.announce(t('exportError')); }); }],
      ['exportTile', function () { var x = svgFor('tile', false); rasterize(x, Math.max(512, Math.min(2048, 1024))).then(function (c) { return ctx.canvasBlob(c); }).then(function (b) { return pngWithText(b, 'Copyright', 'IRIS GREEN - irisgreen.eu'); }).then(function (b) { ctx.download(b, fname('-tile.png')); ctx.announce(t('tileDone')); }).catch(function () { ctx.announce(t('exportError')); }); }],
      ['exportRules', function () {
        var mm = JSON.parse(JSON.stringify(M())), data = { format: 'iris-green-pattern-rules', version: 1, credit: 'IRIS GREEN · irisgreen.eu', mode: S.mode, summary: summary() };
        if (S.mode === 'wall') { data.group = { international: mm.group, orbifold: GROUPS[mm.group].orb, lattice: GROUPS[mm.group].lat, operations: GROUPS[mm.group].ops, cartesian: cartOps(M()).map(function (o) { return o.map(function (v) { return Math.round(v * 1e6) / 1e6; }); }), period: periodRect(M()) }; }
        if (S.mode === 'rose') data.symmetry = (mm.dihedral ? 'D' : 'C') + mm.n;
        if (S.mode === 'lsys') { var r = lsysResult(); data.segments = r.n; data.iterationsDrawn = r.done; }
        data.parameters = mm;
        ctx.download(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), fname('-rules.json'));
      }]
    ];
    EXPORTS.forEach(function (x) { ctx.addExport(t(x[0]), x[1]); ctx.command(x[0], t(x[0]), t('fileWord'), x[1]); });

    /* ---------- Puntos de partida ---------- */
    function sh(type, x, y, size, rot, color, extra) { return Object.assign({ id: nid(), type: type, x: x, y: y, size: size, rot: rot || 0, color: color, sw: 6 }, extra || {}); }
    function start(id) {
      seq = 0; selId = null; lsSel = null; tileCur = null; S = defaults();
      if (id === 'empty') { S.wall.shapes = []; S.wall.group = 'p1'; S.wall.seen = ['p1']; }
      else if (id === 'onetile') {
        S.challenge = 'onetile'; S.wall.group = 'p4'; S.wall.a = 120; S.wall.bg = '#fbf6ec';
        S.wall.shapes = [sh('square', 30, 30, 60, 0, '#1f5f8b'), sh('triangle', 20, 22, 34, 45, '#f6e27a'), sh('circle', 44, 44, 18, 0, '#fbf6ec'), sh('line', 30, 52, 44, 0, '#b3261e', { sw: 5 })];
      } else if (id === 'seventeen') {
        S.challenge = 'seventeen'; S.wall.group = 'p1'; S.wall.seen = ['p1']; S.wall.a = 110; S.wall.ratio = 0.9; S.wall.showAxes = true; S.wall.bg = '#eef3f8';
        S.wall.shapes = [sh('triangle', 34, 26, 30, 20, '#5a49a8'), sh('circle', 52, 40, 12, 0, '#e0b000'), sh('line', 26, 44, 30, 60, '#101820', { sw: 5 })];
      } else if (id === 'p4g') {
        S.challenge = null; S.wall.group = 'p4g'; S.wall.a = 140; S.wall.bg = '#f2ede4'; S.wall.seen = ['p4g'];
        S.wall.shapes = [sh('square', 35, 35, 38, 45, '#1f5f8b'), sh('petal', 70, 20, 40, 90, '#0b8f8f'), sh('circle', 35, 35, 14, 0, '#f6e27a'), sh('triangle', 18, 60, 22, 30, '#b3261e'), sh('line', 58, 50, 30, 45, '#101820', { sw: 4 })];
      } else if (id === 'flowers') {
        S.mode = 'rose'; S.rose.n = 6; S.rose.dihedral = true; S.rose.bg = '#fff8e8';
        S.rose.shapes = [sh('petal', 0, -48, 70, 0, '#e8508f'), sh('petal', 26, -92, 40, 20, '#7cc36b'), sh('circle', 0, -128, 22, 0, '#1f5f8b'), sh('circle', 0, 0, 34, 0, '#e0b000'), sh('circle', 0, -30, 10, 0, '#fff8e8')];
      } else if (id === 'truchet') {
        S.mode = 'truchet'; S.truchet = { variant: 'arcs', rule: 'random', cols: 14, rows: 9, size: 56, seed: 'iris', fg: '#1f5f8b', bg: '#f6e27a', sw: 12, flips: {} };
      } else if (id === 'ownfractal') {
        S.mode = 'lsys'; S.challenge = 'ownfractal';
      } else if (id === 'koch') {
        S.mode = 'lsys'; var P = PRESETS.koch; S.lsys.axiom = P.axiom; S.lsys.rules = P.rules.map(function (r) { return r.slice(); }); S.lsys.angle = P.angle; S.lsys.iter = P.iter; S.lsys.heading = 0; S.lsys.fg = '#5a49a8';
      }
      setupTools(); fit(); refresh();
    }
    if (root.ResizeObserver) { var roT = 0; new ResizeObserver(function () { clearTimeout(roT); roT = setTimeout(function () { if (S) { fit(); draw(); } }, 60); }).observe(vp); }
    ctx.setTech('renderer', 'SVG');
    setupTools();

    function hexOk(c) { return typeof c === 'string' && /^#[0-9a-f]{6}$/i.test(c); }
    function n(v, a, b) { return typeof v === 'number' && isFinite(v) && v >= a && v <= b; }
    function shapeOk(s) { return s && typeof s.id === 'string' && SHAPES.indexOf(s.type) >= 0 && n(s.x, -5000, 5000) && n(s.y, -5000, 5000) && n(s.size, 0.5, 2000) && n(s.rot || 0, -720, 720) && hexOk(s.color) && (s.type !== 'stroke' || (Array.isArray(s.pts) && s.pts.length <= 500 && s.pts.every(function (p) { return Array.isArray(p) && n(p[0], -2, 2) && n(p[1], -2, 2); }))); }
    return {
      serialize: function () { var c = JSON.parse(JSON.stringify(S)); c.seq = seq; return c; },
      restore: function (st) { var oldMode = S.mode; S = JSON.parse(JSON.stringify(st)); seq = Math.max(seq, st.seq || 0); delete S.seq; if (!sel()) selId = null; if (S.mode !== oldMode) { setupTools(); fit(); } refresh(); },
      validate: function (d) {
        if (!d || MODES.indexOf(d.mode) < 0 || !d.wall || !d.rose || !d.truchet || !d.lsys) return false;
        var W = d.wall, R = d.rose, T = d.truchet, L = d.lsys;
        if (!GROUPS[W.group] || !n(W.a, 10, 1000) || !n(W.ratio, 0.1, 10) || SKEWS.indexOf(W.skew) < 0 || !hexOk(W.bg) || !Array.isArray(W.shapes) || W.shapes.length > 40 || !W.shapes.every(shapeOk) || !Array.isArray(W.seen)) return false;
        if (!n(R.n, 2, 24) || !hexOk(R.bg) || !Array.isArray(R.shapes) || R.shapes.length > 40 || !R.shapes.every(shapeOk)) return false;
        if (['triangles', 'arcs', 'lines'].indexOf(T.variant) < 0 || ['random', 'checker', 'rows', 'diagonal'].indexOf(T.rule) < 0 || !n(T.cols, 1, 60) || !n(T.rows, 1, 60) || !n(T.size, 5, 400) || typeof T.seed !== 'string' || !hexOk(T.fg) || !hexOk(T.bg) || typeof T.flips !== 'object') return false;
        if (typeof L.axiom !== 'string' || L.axiom.length > 400 || !Array.isArray(L.rules) || L.rules.length > 8 || !L.rules.every(function (r) { return Array.isArray(r) && typeof r[0] === 'string' && typeof r[1] === 'string' && r[1].length <= 400; }) || !n(L.angle, 0, 360) || !n(L.iter, 0, 12) || !hexOk(L.fg) || !hexOk(L.bg)) return false;
        return true;
      },
      start: start,
      onTool: function (id) { tool = id; vp.dataset.tool = id; },
      onKey: onKey
    };
  }
})(window);
