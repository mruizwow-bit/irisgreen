/* Iris Green · El taller · Estudio de color (R43).
   Paletas con nombre aproximado y rol; rueda OKLCH interactiva (Ottosson, 2020); armonías; mezclas de luz (RGB)
   y de pintura (aproximación RYB de Gossett y Chen, 2004); matriz de contraste WCAG 2.2; simulación de la visión
   del color (Machado, Oliveira y Fernandes, 2009) y escena SVG original de día y de noche.
   Todo se calcula en el navegador. Nada se guarda en el navegador: el proyecto se descarga como archivo. */
(function (root) {
  'use strict';
  var IG = root.IGSuite, D = root.document; if (!IG) return;
  var LANG = IG.lang, SVGNS = 'http://www.w3.org/2000/svg';
  var ROLES = ['sky', 'background', 'main', 'accent', 'text', 'free'];
  var CMAX = 0.33, MAXC = 16, MAXP = 8;
  var VIEWS = ['wheel', 'harmony', 'mix', 'contrast', 'vision', 'scene'];

  /* ---------- Matemáticas del color ---------- */
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function normHex(s) {
    s = String(s || '').trim().toLowerCase(); if (s.charAt(0) !== '#') s = '#' + s;
    if (/^#[0-9a-f]{3}$/.test(s)) s = '#' + s[1] + s[1] + s[2] + s[2] + s[3] + s[3];
    return /^#[0-9a-f]{6}$/.test(s) ? s : null;
  }
  function hexRgb(hex) { var n = parseInt(hex.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function rgbHex(rgb) { return '#' + rgb.map(function (v) { v = clamp(Math.round(v), 0, 255); return (v < 16 ? '0' : '') + v.toString(16); }).join(''); }
  /* sRGB ↔ lineal (IEC 61966-2-1; el mismo umbral 0,04045 que usa la definición de WCAG 2.2) */
  function toLin(v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
  function fromLin(v) { v = clamp(v, 0, 1); return 255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055); }
  function linOf(hex) { return hexRgb(hex).map(toLin); }
  function hexOfLin(l) { return rgbHex(l.map(fromLin)); }
  /* Oklab (Ottosson, 2020) */
  function linToLab(c) {
    var l = 0.4122214708 * c[0] + 0.5363325363 * c[1] + 0.0514459929 * c[2];
    var m = 0.2119034982 * c[0] + 0.6806995451 * c[1] + 0.1073969566 * c[2];
    var s = 0.0883024619 * c[0] + 0.2817188376 * c[1] + 0.6299787005 * c[2];
    l = Math.cbrt(l); m = Math.cbrt(m); s = Math.cbrt(s);
    return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
      1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
      0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
  }
  function labToLin(L, a, b) {
    var l = L + 0.3963377774 * a + 0.2158037573 * b, m = L - 0.1055613458 * a - 0.0638541728 * b, s = L - 0.0894841775 * a - 1.2914855480 * b;
    l = l * l * l; m = m * m * m; s = s * s * s;
    return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s];
  }
  function inGamut(c) { return c[0] >= -1e-4 && c[0] <= 1.0001 && c[1] >= -1e-4 && c[1] <= 1.0001 && c[2] >= -1e-4 && c[2] <= 1.0001; }
  function labOf(hex) { return linToLab(linOf(hex)); }
  function lchOf(hex) { var p = labOf(hex), c = Math.hypot(p[1], p[2]), hh = Math.atan2(p[2], p[1]) * 180 / Math.PI; if (hh < 0) hh += 360; return { l: clamp(p[0], 0, 1), c: c, h: c < 0.002 ? null : hh }; }
  function lchLin(l, c, hh) { var r = hh * Math.PI / 180; return labToLin(l, c * Math.cos(r), c * Math.sin(r)); }
  function maxChroma(l, hh) {
    if (l <= 0.0005 || l >= 0.9995) return 0;
    var lo = 0, hi = 0.4; if (inGamut(lchLin(l, hi, hh))) return hi;
    for (var i = 0; i < 24; i++) { var mid = (lo + hi) / 2; if (inGamut(lchLin(l, mid, hh))) lo = mid; else hi = mid; }
    return lo;
  }
  /* Reducción de croma para entrar en la gama sRGB, como propone CSS Color 4. */
  function fromLch(l, c, hh) { l = clamp(l, 0, 1); c = Math.max(0, c); var mc = maxChroma(l, hh), cc = Math.min(c, mc); return { hex: hexOfLin(lchLin(l, cc, hh)), clipped: c > mc + 0.0005, c: cc }; }
  function lerpLab(a, b, k) { var p = labOf(a), q = labOf(b); return hexOfLin(labToLin(p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k, p[2] + (q[2] - p[2]) * k)); }
  function shiftL(hex, d) { var p = labOf(hex); return hexOfLin(labToLin(clamp(p[0] + d, 0, 1), p[1], p[2])); }
  function dOk(a, b) { var p = labOf(a), q = labOf(b); return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); }
  function rgbHsl(hex) {
    var rgb = hexRgb(hex), r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, hh = 0, s = 0, d = mx - mn;
    if (d > 1e-9) { s = d / (1 - Math.abs(2 * l - 1)); if (mx === r) hh = ((g - b) / d) % 6; else if (mx === g) hh = (b - r) / d + 2; else hh = (r - g) / d + 4; hh *= 60; if (hh < 0) hh += 360; }
    return [hh, s * 100, l * 100];
  }
  function hslHex(hh, s, l) {
    s = clamp(s, 0, 100) / 100; l = clamp(l, 0, 100) / 100; hh = ((hh % 360) + 360) % 360;
    var c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((hh / 60) % 2 - 1)), m = l - c / 2, r = 0, g = 0, b = 0;
    if (hh < 60) { r = c; g = x; } else if (hh < 120) { r = x; g = c; } else if (hh < 180) { g = c; b = x; } else if (hh < 240) { g = x; b = c; } else if (hh < 300) { r = x; b = c; } else { r = c; b = x; }
    return rgbHex([(r + m) * 255, (g + m) * 255, (b + m) * 255]);
  }
  /* WCAG 2.2: luminancia relativa y relación de contraste (L1 + 0,05) / (L2 + 0,05) */
  function relLum(hex) { var l = linOf(hex); return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]; }
  function contrast(a, b) { var x = relLum(a), y = relLum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function crText(r) { return IG.num(Math.floor(r * 100) / 100, 2) + ':1'; }
  /* Visión del color: matrices de Machado, Oliveira y Fernandes (2009), gravedad 1,0, en RGB lineal. */
  var CVD = {
    protan: [0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998],
    deutan: [0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.011820, 0.042940, 0.968881],
    tritan: [1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733, 0.691367, 0.303900],
    grey: [0.2126, 0.7152, 0.0722, 0.2126, 0.7152, 0.0722, 0.2126, 0.7152, 0.0722]
  };
  function simulate(hex, kind) {
    var M = CVD[kind]; if (!M) return hex; var l = linOf(hex);
    return hexOfLin([M[0] * l[0] + M[1] * l[1] + M[2] * l[2], M[3] * l[0] + M[4] * l[1] + M[5] * l[2], M[6] * l[0] + M[7] * l[1] + M[8] * l[2]]);
  }
  /* Pintura: cubo RYB con los ocho colores de referencia de Gossett y Chen (2004) e interpolación trilineal. */
  var RYB = [[1, 1, 1], [1, 0, 0], [1, 1, 0], [1, 0.5, 0], [0.163, 0.373, 0.6], [0.5, 0, 0.5], [0, 0.66, 0.2], [0.2, 0.094, 0]];
  function rybRgb(r, y, b) {
    var out = [0, 0, 0];
    for (var i = 0; i < 8; i++) { var w = (i & 1 ? r : 1 - r) * (i & 2 ? y : 1 - y) * (i & 4 ? b : 1 - b); for (var k = 0; k < 3; k++) out[k] += w * RYB[i][k]; }
    return out;
  }
  function rybHex(v) { return rgbHex(rybRgb(v[0], v[1], v[2]).map(function (x) { return x * 255; })); }
  function solve3(A, b) {
    function det(m) { return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]); }
    var d = det(A); if (Math.abs(d) < 1e-12) return [0, 0, 0];
    return [0, 1, 2].map(function (j) { var M = A.map(function (row, i) { return row.map(function (v, k) { return k === j ? b[i] : v; }); }); return det(M) / d; });
  }
  /* Color de pantalla → cantidades RYB: mínimos cuadrados (Levenberg-Marquardt) dentro del cubo. */
  function rybOf(hex) {
    var tg = hexRgb(hex).map(function (v) { return v / 255; }), best = null;
    [[0.5, 0.5, 0.5], [0.1, 0.1, 0.1], [0.9, 0.1, 0.1], [0.1, 0.9, 0.1], [0.1, 0.1, 0.9], [0.9, 0.9, 0.1], [0.9, 0.1, 0.9], [0.1, 0.9, 0.9], [0.9, 0.9, 0.9]].forEach(function (x0) {
      var x = x0.slice(), lam = 1e-3;
      function err(v) { var f = rybRgb(v[0], v[1], v[2]); return (f[0] - tg[0]) * (f[0] - tg[0]) + (f[1] - tg[1]) * (f[1] - tg[1]) + (f[2] - tg[2]) * (f[2] - tg[2]); }
      for (var it = 0; it < 40; it++) {
        var f = rybRgb(x[0], x[1], x[2]), r = [f[0] - tg[0], f[1] - tg[1], f[2] - tg[2]], J = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], e = 1e-4;
        for (var j = 0; j < 3; j++) { var xp = x.slice(); xp[j] += e; var fp = rybRgb(xp[0], xp[1], xp[2]); for (var k = 0; k < 3; k++) J[k][j] = (fp[k] - f[k]) / e; }
        var A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], g = [0, 0, 0];
        for (var a = 0; a < 3; a++) { for (var c2 = 0; c2 < 3; c2++) for (var q = 0; q < 3; q++) A[a][c2] += J[q][a] * J[q][c2]; A[a][a] += lam; for (var q2 = 0; q2 < 3; q2++) g[a] -= J[q2][a] * r[q2]; }
        var dx = solve3(A, g), nx = [clamp(x[0] + dx[0], 0, 1), clamp(x[1] + dx[1], 0, 1), clamp(x[2] + dx[2], 0, 1)];
        if (err(nx) < err(x)) { x = nx; lam *= 0.5; } else lam *= 4;
      }
      var e2 = err(x); if (!best || e2 < best.e) best = { x: x, e: e2 };
    });
    return best.x;
  }
  function paintMix(a, b) { var p = rybOf(a), q = rybOf(b); return rybHex([Math.min(1, p[0] + q[0]), Math.min(1, p[1] + q[1]), Math.min(1, p[2] + q[2])]); }
  function lightMix(a, b) { var p = linOf(a), q = linOf(b), s = [p[0] + q[0], p[1] + q[1], p[2] + q[2]], mx = Math.max(1, s[0], s[1], s[2]); return { hex: hexOfLin(s.map(function (v) { return v / mx; })), scaled: mx > 1 }; }

  /* Nombres aproximados (lista curada): el más cercano en Oklab. */
  var NAMES = [['black', '#000000'], ['white', '#ffffff'], ['grey', '#808080'], ['lightgrey', '#c8c8c8'], ['darkgrey', '#454545'], ['charcoal', '#2b2f36'], ['slate', '#52606d'], ['bluegrey', '#7d8b99'],
    ['red', '#d62828'], ['crimson', '#a4161a'], ['maroon', '#6d1a1a'], ['wine', '#5e1a33'], ['pink', '#f4a6c0'], ['hotpink', '#e8508f'], ['fuchsia', '#d0208f'], ['magenta', '#e020e0'],
    ['coral', '#ff7f5f'], ['salmon', '#f59682'], ['peach', '#ffcaa4'], ['orange', '#f28a1c'], ['terracotta', '#c65a3a'], ['rust', '#9c3f1a'], ['brown', '#7b4a26'], ['chocolate', '#4e2c16'],
    ['caramel', '#c68a3a'], ['beige', '#e6d5b2'], ['cream', '#fbf3dc'], ['ivory', '#fffdf0'], ['sand', '#d9c28c'], ['ochre', '#c98a1e'], ['mustard', '#cfa31c'], ['gold', '#d4af37'],
    ['yellow', '#ffd60a'], ['lemon', '#f4ef6a'], ['olive', '#7c7a2a'], ['khaki', '#b5ad72'], ['lime', '#a0d22c'], ['green', '#2e9a44'], ['forest', '#1e5631'], ['mint', '#a6e6c4'],
    ['emerald', '#10946b'], ['sage', '#9cae8e'], ['teal', '#0f7f7f'], ['turquoise', '#2ec4b6'], ['cyan', '#12b5e5'], ['skyblue', '#8fcdf2'], ['lightblue', '#c4e2f5'], ['blue', '#1f63d6'],
    ['cobalt', '#0a45a8'], ['navy', '#16264f'], ['midnight', '#0d1330'], ['indigo', '#3b2a8c'], ['violet', '#8a55d6'], ['purple', '#6a2d8f'], ['lavender', '#cbbdf2'], ['lilac', '#c6a3cf'],
    ['plum', '#7c3b6e'], ['mauve', '#b37f9a']];
  var NAME_LAB = NAMES.map(function (n) { return labOf(n[1]); });
  function nameKey(hex) { var p = labOf(hex), best = 0, bd = 1e9; NAME_LAB.forEach(function (q, i) { var d = Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); if (d < bd) { bd = d; best = i; } }); return NAMES[best][0]; }

  IG.defineEngine('color', {
    version: 1, fileBase: LANG === 'en' ? 'colour' : 'color',
    extraKeys: ['kColWheel', 'kColLight', 'kColPick'],
    initialStart: function (para) { return { child: 'rainbow', teen: 'game', adult: 'brand' }[para] || 'five'; },
    starts: function (ctx) {
      var t = ctx.t;
      return [
        { id: 'five', title: t('stFive'), desc: t('stFiveD'), para: 'any' },
        { id: 'daynight', title: t('stDayNight'), desc: t('stDayNightD'), para: 'any' },
        { id: 'rainbow', title: t('stRainbow'), desc: t('stRainbowD'), para: 'child' },
        { id: 'game', title: t('stGame'), desc: t('stGameD'), para: 'teen' },
        { id: 'brand', title: t('stBrand'), desc: t('stBrandD'), para: 'adult' }
      ];
    },
    create: function (ctx) { return studio(ctx); }
  });

  function studio(ctx) {
    var t = ctx.t, h = ctx.h, F = ctx.fields, vp = ctx.viewport;
    var S = emptyDoc(), seq = 0, selId = null, selPair = null, view = 'wheel', hueMemo = {}, mixA = null, mixB = null, ryb = [1, 1, 0], sceneAll = false, uidN = 0;
    function emptyDoc() { return { v: 1, cur: 0, challenge: null, palettes: [{ id: 'p0', name: t('paletteN', { n: 1 }), time: 'day', colors: [] }] }; }
    function nid(p) { seq += 1; return p + seq; }
    function uid() { uidN += 1; return 'igc-' + uidN; }
    function pal() { return S.palettes[S.cur] || S.palettes[0]; }
    function cols() { return pal().colors; }
    function byId(id) { var c = cols(); for (var i = 0; i < c.length; i++) if (c[i].id === id) return c[i]; return null; }
    function sel() { return byId(selId); }
    function cname(c) { return (c.label && c.label.trim()) || t('cn_' + nameKey(c.hex)); }
    function approx(hex) { return t('cn_' + nameKey(hex)); }
    function roleName(r) { return t('role_' + (r || 'free')); }
    function pct(v) { return IG.num(v * 100, 0) + ' %'; }
    function hueOf(c) { var l = lchOf(c.hex); if (l.h == null) return hueMemo[c.id] != null ? hueMemo[c.id] : 0; hueMemo[c.id] = l.h; return l.h; }
    function lchC(c) { var l = lchOf(c.hex); return { l: l.l, c: l.c, h: hueOf(c) }; }
    function lchText(c) { var l = lchC(c); return 'L ' + pct(l.l) + ' · C ' + IG.num(l.c, 3) + ' · H ' + IG.num(l.h, 0) + '°'; }
    function roleHex(p, role) {
      var list = p.colors; for (var i = 0; i < list.length; i++) if (list[i].role === role) return list[i].hex;
      if (!list.length) return { sky: '#bfe0f5', background: '#f4efe4', main: '#5a49a8', accent: '#e0b000', text: '#172b42' }[role];
      var byL = list.slice().sort(function (a, b) { return relLum(b.hex) - relLum(a.hex); }), byC = list.slice().sort(function (a, b) { return lchOf(b.hex).c - lchOf(a.hex).c; });
      if (role === 'background') return byL[0].hex; if (role === 'text') return byL[byL.length - 1].hex;
      if (role === 'sky') return byL[Math.min(1, byL.length - 1)].hex; if (role === 'main') return byC[0].hex; return byC[Math.min(1, byC.length - 1)].hex;
    }
    function roleColor(p, role) { for (var i = 0; i < p.colors.length; i++) if (p.colors[i].role === role) return p.colors[i]; return null; }

    /* ---------- Estructura de la vista ---------- */
    /* La vista se puede enfocar para desplazarla con el teclado (también cuando no tiene controles). */
    var stage = h('div', { class: 'igc-stage', tabindex: '0', role: 'region', 'aria-label': t('v_wheel') });
    vp.appendChild(stage); vp.classList.add('igc-viewport');
    function keepFocus(container, fn) {
      var a = D.activeElement, fk = a && container.contains(a) ? a.getAttribute('data-fk') : null;
      fn();
      if (!fk) return;
      /* Si el control ya no existe (por ejemplo, «Ajustar» tras aprobar), el foco pasa al primer control del mismo panel. */
      var el = container.querySelector('[data-fk="' + fk + '"]') || container.querySelector('button:not([disabled])');
      if (el) { try { el.focus({ preventScroll: true }); } catch (_) { el.focus(); } }
    }
    function el(name, attrs, parent) { var e = D.createElementNS(SVGNS, name); Object.keys(attrs || {}).forEach(function (k) { if (attrs[k] != null) e.setAttribute(k, attrs[k]); }); if (parent) parent.appendChild(e); return e; }

    /* ---------- Rueda OKLCH ---------- */
    var W = { root: null, canvas: null, strip: null, marks: null, smarks: null, info: null, size: 0, key: '' };
    function buildWheel() {
      W.canvas = h('canvas', { class: 'igc-wheel', 'aria-hidden': 'true' });
      W.marks = D.createElementNS(SVGNS, 'svg'); W.marks.setAttribute('class', 'igc-marks'); W.marks.setAttribute('aria-hidden', 'true');
      W.strip = h('canvas', { class: 'igc-strip', 'aria-hidden': 'true' });
      W.smarks = D.createElementNS(SVGNS, 'svg'); W.smarks.setAttribute('class', 'igc-marks'); W.smarks.setAttribute('aria-hidden', 'true');
      W.box = h('div', { class: 'igc-wheelbox' }, W.canvas, W.marks);
      W.sbox = h('div', { class: 'igc-stripbox' }, W.strip, W.smarks);
      W.info = h('div', { class: 'igc-info' });
      W.root = h('div', { class: 'igc-wheel-view' }, h('div', { class: 'igc-wheel-row' }, W.box, W.sbox), W.info);
      var dragging = null;
      function pick(e, which) {
        var r = (which === 'strip' ? W.strip : W.canvas).getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, c = sel();
        if (which === 'strip') { if (!c) return; var lc = lchC(c); setLch(c, clamp(1 - y / r.height, 0, 1), lc.c, lc.h); live(); return; }
        var R = W.size / 2 - 8, dx = x - W.size / 2, dy = y - W.size / 2, rr = Math.hypot(dx, dy);
        if (e.type === 'pointerdown') {
          var near = null, nd = 14; cols().forEach(function (k) { var p = wheelPos(k); var d = Math.hypot(p[0] - x, p[1] - y); if (d < nd) { nd = d; near = k; } });
          if (near && (!c || near.id !== c.id)) { select(near.id); dragging = null; return 'picked'; }
          if (!c) return;
        }
        if (!c || rr > R + 30) return;
        var hh = (Math.atan2(-dy, dx) * 180 / Math.PI + 360) % 360, cc = Math.min(1, rr / R) * CMAX, l = lchC(c).l;
        setLch(c, l, cc, hh); live();
      }
      [['wheel', W.canvas], ['strip', W.strip]].forEach(function (p) {
        p[1].addEventListener('pointerdown', function (e) {
          if (e.button !== 0) return; var res = pick(e, p[0]); if (res === 'picked' || !sel()) return;
          dragging = { which: p[0], orig: sel().hex }; p[1].setPointerCapture(e.pointerId); e.preventDefault();
        });
        p[1].addEventListener('pointermove', function (e) { if (dragging && dragging.which === p[0]) pick(e, p[0]); });
        function end() { if (!dragging) return; var c = sel(), changed = c && c.hex !== dragging.orig; dragging = null; if (changed) commit(t('colourChanged') + ': ' + cname(c) + ' ' + c.hex); }
        p[1].addEventListener('pointerup', end); p[1].addEventListener('pointercancel', end);
      });
    }
    function wheelPos(c) { var l = lchC(c), R = W.size / 2 - 8, r = Math.min(1, l.c / CMAX) * R, a = l.h * Math.PI / 180; return [W.size / 2 + Math.cos(a) * r, W.size / 2 - Math.sin(a) * r]; }
    function drawWheelImage(L) {
      var dpr = Math.min(2, root.devicePixelRatio || 1), N = Math.round(W.size * dpr), key = N + ':' + L.toFixed(3);
      if (W.key === key) return; W.key = key;
      W.canvas.width = N; W.canvas.height = N; W.canvas.style.width = W.size + 'px'; W.canvas.style.height = W.size + 'px';
      var g = W.canvas.getContext('2d'), img = g.createImageData(N, N), R = (W.size / 2 - 8) * dpr, cx = N / 2, d = img.data;
      for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
        var dx = x + 0.5 - cx, dy = y + 0.5 - cx, r = Math.hypot(dx, dy), i = (y * N + x) * 4;
        if (r > R + 0.5) { d[i + 3] = 0; continue; }
        var cc = r / R * CMAX, a = Math.atan2(-dy, dx), lin = labToLin(L, cc * Math.cos(a), cc * Math.sin(a));
        if (inGamut(lin)) { d[i] = fromLin(lin[0]); d[i + 1] = fromLin(lin[1]); d[i + 2] = fromLin(lin[2]); }
        else { var ch = ((Math.floor(x / (6 * dpr)) + Math.floor(y / (6 * dpr))) & 1) ? 236 : 246; d[i] = ch; d[i + 1] = ch + 2; d[i + 2] = ch + 5; }
        d[i + 3] = 255;
      }
      g.putImageData(img, 0, 0);
    }
    function drawStrip(c) {
      var dpr = Math.min(2, root.devicePixelRatio || 1), Hh = Math.round(W.size * dpr), Ww = Math.round(28 * dpr);
      W.strip.width = Ww; W.strip.height = Hh; W.strip.style.width = '28px'; W.strip.style.height = W.size + 'px';
      var g = W.strip.getContext('2d'), lc = c ? lchC(c) : { l: 0.5, c: 0, h: 0 };
      for (var y = 0; y < Hh; y += 2) { g.fillStyle = fromLch(1 - y / Hh, lc.c, lc.h).hex; g.fillRect(0, y, Ww, 2); }
      while (W.smarks.firstChild) W.smarks.removeChild(W.smarks.firstChild);
      W.smarks.setAttribute('width', 28); W.smarks.setAttribute('height', W.size); W.smarks.setAttribute('viewBox', '0 0 28 ' + W.size);
      el('rect', { x: 0.5, y: 0.5, width: 27, height: W.size - 1, rx: 6, fill: 'none', stroke: '#44586c' }, W.smarks);
      if (c) { var yy = (1 - lc.l) * W.size; el('rect', { x: 1, y: yy - 4, width: 26, height: 8, rx: 3, fill: 'none', stroke: '#fff', 'stroke-width': 4 }, W.smarks); el('rect', { x: 1, y: yy - 4, width: 26, height: 8, rx: 3, fill: 'none', stroke: '#101820', 'stroke-width': 2 }, W.smarks); }
    }
    function renderWheel() {
      if (!W.root) buildWheel();
      if (stage.firstChild !== W.root) { ctx.clear(stage); stage.appendChild(W.root); }
      var r = stage.getBoundingClientRect(), narrow = r.width < 640;
      W.root.dataset.narrow = String(narrow);
      var avW = narrow ? r.width - 28 - 40 : r.width - 28 - 300, avH = narrow ? Math.min(r.height - 30, r.width) : r.height - 24;
      W.size = Math.max(180, Math.floor(Math.min(avW, avH, 520)));
      var c = sel(); drawWheelImage(c ? Math.round(lchC(c).l * 200) / 200 : 0.7); drawStrip(c);
      var m = W.marks; while (m.firstChild) m.removeChild(m.firstChild);
      m.setAttribute('width', W.size); m.setAttribute('height', W.size); m.setAttribute('viewBox', '0 0 ' + W.size + ' ' + W.size);
      var R = W.size / 2 - 8, cx = W.size / 2;
      [0.1, 0.2, 0.3].forEach(function (k) { el('circle', { cx: cx, cy: cx, r: k / CMAX * R, fill: 'none', stroke: '#172b42', 'stroke-opacity': 0.18, 'stroke-dasharray': '3 4' }, m); });
      el('circle', { cx: cx, cy: cx, r: R, fill: 'none', stroke: '#44586c', 'stroke-width': 1.5 }, m);
      if (c) { var p = wheelPos(c); el('line', { x1: cx, y1: cx, x2: p[0], y2: p[1], stroke: '#101820', 'stroke-width': 1.5, 'stroke-dasharray': '4 3' }, m); }
      cols().forEach(function (k) {
        var p = wheelPos(k), on = c && k.id === c.id;
        if (on) { el('circle', { cx: p[0], cy: p[1], r: 14, fill: 'none', stroke: '#fff', 'stroke-width': 5 }, m); el('circle', { cx: p[0], cy: p[1], r: 14, fill: 'none', stroke: '#101820', 'stroke-width': 2.5 }, m); }
        el('circle', { cx: p[0], cy: p[1], r: on ? 9 : 7, fill: k.hex, stroke: '#101820', 'stroke-width': 1.5 }, m);
      });
      /* Ficha del color: nombre, valores y botones para cambiarlo sin arrastrar */
      ctx.clear(W.info);
      if (!c) { W.info.appendChild(h('p', { class: 'igs-muted', text: cols().length ? t('wheelPick') : t('noColours') })); if (!cols().length) W.info.appendChild(ctx.button(t('addColour'), { icon: 'plus', onClick: function () { addColour(); } })); return; }
      var lc = lchC(c), mc = maxChroma(lc.l, lc.h);
      W.info.appendChild(h('div', { class: 'igc-big', style: 'background:' + c.hex }));
      W.info.appendChild(h('p', { class: 'igc-info-name' }, h('strong', { text: cname(c) }), ' ', h('span', { text: c.hex })));
      W.info.appendChild(h('p', { class: 'igc-info-vals', text: lchText(c) + ' · ' + roleName(c.role) }));
      if (lc.c >= mc - 0.001 && lc.c > 0.01) W.info.appendChild(h('p', { class: 'igc-gamut', text: t('gamutEdge') }));
      var grid = h('div', { class: 'igc-nudges', role: 'group', 'aria-label': t('nudgeGroup') });
      [['hue', -1], ['hue', 1], ['chroma', -1], ['chroma', 1], ['light', -1], ['light', 1]].forEach(function (n) {
        grid.appendChild(ctx.button(t('nudge_' + n[0]) + (n[1] < 0 ? ' −' : ' +'), { class: 'igc-nudge', dataset: { fk: 'nudge-' + n[0] + n[1] }, onClick: function () { nudge(n[0], n[1], false); commit(t('colourChanged') + ': ' + cname(sel()) + ' ' + sel().hex); } }));
      });
      W.info.appendChild(grid);
      W.info.appendChild(h('p', { class: 'igs-muted igc-small', text: t('wheelNote') }));
    }
    function setLch(c, l, cc, hh) { var r = fromLch(l, cc, hh); c.hex = r.hex; hueMemo[c.id] = ((hh % 360) + 360) % 360; return r; }
    function nudge(kind, dir, big) {
      var c = sel(); if (!c) return null; var l = lchC(c), r;
      if (kind === 'hue') r = setLch(c, l.l, l.c, l.h + dir * (big ? 30 : 5));
      else if (kind === 'chroma') r = setLch(c, l.l, clamp(l.c + dir * (big ? 0.05 : 0.01), 0, 0.37), l.h);
      else r = setLch(c, clamp(l.l + dir * (big ? 0.1 : 0.02), 0, 1), l.c, l.h);
      return r;
    }

    /* ---------- Armonías ---------- */
    var HARM = { complementary: [0, 180], analogous: [-30, 0, 30], triad: [0, 120, 240], split: [0, 150, 210], tetrad: [0, 90, 180, 270], mono: null };
    function baseColour() { return sel() || roleColor(pal(), 'main') || cols()[0] || null; }
    function harmony(kind, base) {
      var l = lchC(base);
      if (kind === 'mono') {
        var ls = [-0.3, -0.15, 0, 0.15, 0.3].map(function (d) { return clamp(l.l + d, 0.12, 0.97); });
        if (l.l > 0.8) ls = [-0.6, -0.45, -0.3, -0.15, 0].map(function (d) { return clamp(l.l + d, 0.12, 0.97); });
        if (l.l < 0.25) ls = [0, 0.15, 0.3, 0.45, 0.6].map(function (d) { return clamp(l.l + d, 0.12, 0.97); });
        return ls.map(function (x) { return fromLch(x, l.c, l.h).hex; });
      }
      return HARM[kind].map(function (off) { return off === 0 ? base.hex : fromLch(l.l, l.c, l.h + off).hex; });
    }
    function miniWheel(kind, base) {
      var s = D.createElementNS(SVGNS, 'svg'); s.setAttribute('viewBox', '0 0 80 80'); s.setAttribute('class', 'igc-mini'); s.setAttribute('aria-hidden', 'true');
      el('circle', { cx: 40, cy: 40, r: 34, fill: '#f4f7fa', stroke: '#7d93a8' }, s);
      var l = lchC(base), pts = kind === 'mono' ? [0] : HARM[kind];
      var P = pts.map(function (off) { var a = (l.h + off) * Math.PI / 180; return [40 + Math.cos(a) * 28, 40 - Math.sin(a) * 28]; });
      if (P.length > 2) el('polygon', { points: P.map(function (p) { return p.join(','); }).join(' '), fill: 'none', stroke: '#44586c', 'stroke-width': 1.5 }, s);
      else if (P.length === 2) el('line', { x1: P[0][0], y1: P[0][1], x2: P[1][0], y2: P[1][1], stroke: '#44586c', 'stroke-width': 1.5 }, s);
      var hs = harmony(kind, base);
      if (kind === 'mono') hs.forEach(function (hx, i) { el('circle', { cx: 16 + i * 12, cy: 40, r: 6, fill: hx, stroke: '#101820' }, s); });
      else P.forEach(function (p, i) { el('circle', { cx: p[0], cy: p[1], r: 7, fill: hs[i], stroke: '#101820', 'stroke-width': 1.5 }, s); });
      return s;
    }
    function renderHarmony() {
      ctx.clear(stage);
      var base = baseColour(), box = h('div', { class: 'igc-scroll' });
      stage.appendChild(box);
      if (!base) { box.appendChild(h('p', { class: 'igs-muted', text: t('noColours') })); return; }
      box.appendChild(h('p', { class: 'igc-lead' }, t('harmBase') + ' ', h('span', { class: 'igc-chip', style: 'background:' + base.hex }), ' ', h('strong', { text: cname(base) + ' ' + base.hex }), '. ' + t('harmHow')));
      var grid = h('ul', { class: 'igc-cards' });
      Object.keys(HARM).forEach(function (k) {
        var hs = harmony(k, base), row = h('div', { class: 'igc-swrow' });
        hs.forEach(function (hx) { row.appendChild(h('span', { class: 'igc-sw', style: 'background:' + hx, title: approx(hx) + ' ' + hx })); });
        grid.appendChild(h('li', { class: 'igc-card' }, h('div', { class: 'igc-card-head' }, miniWheel(k, base), h('div', null, h('h3', { text: t('harm_' + k) }), h('p', { class: 'igs-muted igc-small', text: t('harm_' + k + 'D') }))),
          row, h('p', { class: 'igc-small', text: hs.map(function (hx) { return approx(hx) + ' ' + hx; }).join(' · ') }),
          h('div', { class: 'igs-actions' }, ctx.button(t('harmAdd'), { icon: 'plus', dataset: { fk: 'ha-' + k }, onClick: function () { addHexes(hs, t('harm_' + k)); } }),
            ctx.button(t('harmReplace'), { icon: 'check', dataset: { fk: 'hr-' + k }, onClick: function () { replaceWith(hs, t('harm_' + k)); } }))));
      });
      box.appendChild(grid);
    }
    function addHexes(list, label) {
      var added = 0;
      list.forEach(function (hx) { if (cols().length >= MAXC) return; if (cols().some(function (c) { return c.hex === hx; })) return; cols().push({ id: nid('c'), hex: hx, role: 'free', label: '' }); added++; });
      if (!added) { ctx.announce(cols().length >= MAXC ? t('tooMany', { n: MAXC }) : t('nothingNew')); return; }
      commit(t('addedN', { n: added, what: label }));
    }
    function replaceWith(list, label) {
      var cs = list.slice(0, MAXC).map(function (hx) { return { id: nid('c'), hex: hx, role: 'free', label: '' }; });
      assignRoles(cs); pal().colors = cs; selId = cs[0] ? cs[0].id : null; selPair = null;
      commit(t('replacedWith', { what: label }));
    }
    /* Reparto de roles por luminosidad: el más oscuro, texto; el más claro, fondo; el más vivo, principal. */
    function assignRoles(cs) {
      if (!cs.length) return; cs.forEach(function (c) { c.role = 'free'; });
      var byL = cs.slice().sort(function (a, b) { return relLum(a.hex) - relLum(b.hex); });
      byL[0].role = 'text'; if (byL.length > 1) byL[byL.length - 1].role = 'background';
      var rest = cs.filter(function (c) { return c.role === 'free'; }).sort(function (a, b) { return lchOf(b.hex).c - lchOf(a.hex).c; });
      if (rest[0]) rest[0].role = 'main'; if (rest[1]) rest[1].role = 'accent'; if (rest[2]) rest[2].role = 'sky';
    }

    /* ---------- Mezclas ---------- */
    function swatchCard(label, hex, note, addLabel) {
      return h('div', { class: 'igc-res' }, h('span', { class: 'igc-sw igc-sw-big', style: 'background:' + hex }),
        h('div', null, h('strong', { text: label }), h('span', { class: 'igc-small', text: approx(hex) + ' ' + hex }), note ? h('span', { class: 'igc-small igs-muted', text: note }) : null,
          ctx.button(t('addToPalette'), { icon: 'plus', class: 'igc-small-btn', dataset: { fk: 'add-' + addLabel }, onClick: function () { addMixed(hex, label); } })));
    }
    function addMixed(hex, label) {
      if (cols().length >= MAXC) { ctx.announce(t('tooMany', { n: MAXC })); return; }
      var c = { id: nid('c'), hex: hex, role: 'free', label: '', src: 'mix' }; cols().push(c); selId = c.id; commit(t('addedMix', { what: label, hex: hex }));
    }
    function renderMix() {
      ctx.clear(stage);
      var box = h('div', { class: 'igc-scroll igc-mix' }); stage.appendChild(box);
      var list = cols();
      /* Pinturas primarias */
      var rybSec = h('section', { class: 'igc-panel', 'aria-labelledby': 'igc-h-ryb' }, h('h3', { id: 'igc-h-ryb', text: t('mixPaintTitle') }), h('p', { class: 'igc-small', text: t('mixPaintHelp') }));
      var rybRow = h('div', { class: 'igc-ryb' });
      ['red', 'yellow', 'blue'].forEach(function (k, i) {
        var id = uid(), inp = h('input', { id: id, type: 'number', min: 0, max: 1, step: 0.1, inputmode: 'decimal', 'data-fk': 'ryb-' + k });
        inp.value = String(ryb[i]);
        inp.addEventListener('change', function () { var v = parseFloat(String(inp.value).replace(',', '.')); ryb[i] = isFinite(v) ? clamp(Math.round(v * 10) / 10, 0, 1) : ryb[i]; keepFocus(stage, renderMix); ctx.announce(t('paintResult', { name: approx(rybHex(ryb)), hex: rybHex(ryb) })); });
        rybRow.appendChild(h('div', { class: 'igs-field igc-ryb-f' }, h('label', { for: id }, h('span', { class: 'igc-chip', style: 'background:' + rybHex([i === 0 ? 1 : 0, i === 1 ? 1 : 0, i === 2 ? 1 : 0]) }), ' ' + t('paint_' + k)), inp));
      });
      rybSec.appendChild(rybRow);
      var quick = h('div', { class: 'igs-actions' });
      [['ry', [1, 1, 0]], ['yb', [0, 1, 1]], ['br', [1, 0, 1]], ['all', [1, 1, 1]]].forEach(function (q) {
        quick.appendChild(ctx.button(t('quick_' + q[0]), { class: 'igc-small-btn', dataset: { fk: 'q-' + q[0] }, onClick: function () { ryb = q[1].slice(); keepFocus(stage, renderMix); ctx.announce(t('paintResult', { name: approx(rybHex(ryb)), hex: rybHex(ryb) })); } }));
      });
      rybSec.appendChild(quick);
      rybSec.appendChild(swatchCard(t('paintResultLabel'), rybHex(ryb), t('rybAmounts', { r: IG.num(ryb[0], 1), y: IG.num(ryb[1], 1), b: IG.num(ryb[2], 1) }), 'ryb'));
      box.appendChild(rybSec);
      /* Dos colores de la paleta */
      var two = h('section', { class: 'igc-panel', 'aria-labelledby': 'igc-h-two' }, h('h3', { id: 'igc-h-two', text: t('mixTwoTitle') }));
      if (list.length < 2) two.appendChild(h('p', { class: 'igs-muted', text: t('needTwo') }));
      else {
        if (!byId(mixA)) mixA = list[0].id; if (!byId(mixB) || mixB === mixA) mixB = (list[1].id === mixA ? list[0] : list[1]).id;
        var opts = list.map(function (c) { return [c.id, cname(c) + ' ' + c.hex]; });
        var fa = F.select(t('colourA'), mixA, opts, { onChange: function (v) { mixA = v; keepFocus(stage, renderMix); } }); fa.input.setAttribute('data-fk', 'mixA');
        var fb = F.select(t('colourB'), mixB, opts, { onChange: function (v) { mixB = v; keepFocus(stage, renderMix); } }); fb.input.setAttribute('data-fk', 'mixB');
        two.appendChild(h('div', { class: 'igc-two-sel' }, fa, fb));
        var A = byId(mixA).hex, B = byId(mixB).hex, lm = lightMix(A, B);
        var res = h('div', { class: 'igc-results' });
        res.appendChild(swatchCard(t('mixLight'), lm.hex, lm.scaled ? t('mixLightScaled') : t('mixLightNote'), 'light'));
        res.appendChild(swatchCard(t('mixPaint'), paintMix(A, B), t('mixPaintNote'), 'paint'));
        two.appendChild(res);
        two.appendChild(h('h4', { text: t('gradTitle') }));
        function strip(fn, label) { var s = h('div', { class: 'igc-grad', role: 'img', 'aria-label': label }); for (var i = 0; i <= 6; i++) s.appendChild(h('span', { style: 'background:' + fn(i / 6) })); return s; }
        two.appendChild(h('p', { class: 'igc-small', text: t('gradOklab') })); two.appendChild(strip(function (k) { return lerpLab(A, B, k); }, t('gradOklab')));
        two.appendChild(h('p', { class: 'igc-small', text: t('gradSrgb') })); two.appendChild(strip(function (k) { var p = hexRgb(A), q = hexRgb(B); return rgbHex([0, 1, 2].map(function (i) { return p[i] + (q[i] - p[i]) * k; })); }, t('gradSrgb')));
        two.appendChild(h('p', { class: 'igc-small igs-muted', text: t('gradNote') }));
      }
      box.appendChild(two);
      /* Luces primarias */
      var lights = h('section', { class: 'igc-panel', 'aria-labelledby': 'igc-h-lights' }, h('h3', { id: 'igc-h-lights', text: t('mixLightsTitle') }));
      var sv = D.createElementNS(SVGNS, 'svg'); sv.setAttribute('viewBox', '0 0 220 150'); sv.setAttribute('class', 'igc-lights'); sv.setAttribute('role', 'img'); sv.setAttribute('aria-label', t('lightsAlt'));
      el('rect', { width: 220, height: 150, rx: 10, fill: '#000' }, sv);
      [[85, 60, '#ff0000'], [135, 60, '#00ff00'], [110, 100, '#0000ff']].forEach(function (c) { el('circle', { cx: c[0], cy: c[1], r: 40, fill: c[2], style: 'mix-blend-mode:screen' }, sv); });
      lights.appendChild(h('div', { class: 'igc-lights-row' }, sv, h('ul', { class: 'igc-small' }, ['lightsRG', 'lightsGB', 'lightsBR', 'lightsAll'].map(function (k) { return h('li', { text: t(k) }); }))));
      box.appendChild(lights);
    }

    /* ---------- Contraste ---------- */
    /* Muestras de texto en SVG: enseñan a propósito combinaciones con poco contraste; la relación va siempre en texto real. */
    function sampleSvg(text, colour, cls, size, weight) {
      size = size || 22; weight = weight || 800;
      var w = Math.max(30, Math.round(text.length * size * 0.56)), s = D.createElementNS(SVGNS, 'svg');
      s.setAttribute('class', cls); s.setAttribute('viewBox', '0 0 ' + w + ' ' + Math.round(size * 1.3)); s.setAttribute('width', w); s.setAttribute('height', Math.round(size * 1.3)); s.setAttribute('aria-hidden', 'true'); s.setAttribute('focusable', 'false');
      var tx = el('text', { x: 0, y: Math.round(size * 1.0), fill: colour, 'font-size': size, 'font-weight': weight, 'font-family': 'Atkinson Hyperlegible, Arial, sans-serif' }, s); tx.textContent = text;
      return s;
    }
    function grade(r) { return r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'large' : 'fail'; }
    function renderContrast() {
      ctx.clear(stage);
      var box = h('div', { class: 'igc-scroll' }); stage.appendChild(box);
      var list = cols();
      if (list.length < 2) { box.appendChild(h('p', { class: 'igs-muted', text: t('needTwo') })); return; }
      var tbl = h('table', { class: 'igc-matrix' }), cap = h('caption', { text: t('matrixCaption') });
      tbl.appendChild(cap);
      var thead = h('thead'), hr = h('tr', null, h('th', { scope: 'col', class: 'igc-corner' }, h('span', { text: t('textOn') })));
      list.forEach(function (bg) { hr.appendChild(h('th', { scope: 'col' }, h('span', { class: 'igc-chip', style: 'background:' + bg.hex }), ' ', h('span', { text: cname(bg) }))); });
      thead.appendChild(hr); tbl.appendChild(thead);
      var tb = h('tbody'), pass = 0, total = 0;
      list.forEach(function (fg) {
        var tr = h('tr', null, h('th', { scope: 'row' }, h('span', { class: 'igc-chip', style: 'background:' + fg.hex }), ' ', h('span', { text: cname(fg) })));
        list.forEach(function (bg) {
          if (fg.id === bg.id) { tr.appendChild(h('td', { class: 'igc-same' }, h('span', { 'aria-label': t('samePair') }, '—'))); return; }
          var r = contrast(fg.hex, bg.hex), gd = grade(r), on = selPair && selPair.fg === fg.id && selPair.bg === bg.id; total++; if (r >= 4.5) pass++;
          var b = h('button', { type: 'button', class: 'igc-cell', 'data-grade': gd, 'data-fk': 'cell-' + fg.id + '-' + bg.id, 'aria-pressed': String(!!on), style: 'background:' + bg.hex + ';color:' + fg.hex,
            'aria-label': t('cellLabel', { fg: cname(fg), bg: cname(bg), r: crText(r), g: t('grade_' + gd) }) },
          sampleSvg('Aa', fg.hex, 'igc-aa'), h('span', { class: 'igc-badge', 'aria-hidden': 'true' }, crText(r) + ' · ' + t('gradeShort_' + gd)));
          b.addEventListener('click', function () { selPair = { fg: fg.id, bg: bg.id }; selId = null; keepFocus(stage, refresh); ctx.announce(t('cellLabel', { fg: cname(fg), bg: cname(bg), r: crText(r), g: t('grade_' + gd) })); });
          tr.appendChild(h('td', null, b));
        });
        tb.appendChild(tr);
      });
      tbl.appendChild(tb);
      box.appendChild(h('div', { class: 'igc-table-wrap' }, tbl));
      box.appendChild(h('p', { class: 'igc-small', text: t('matrixCount', { n: pass, total: total }) }));
      box.appendChild(h('ul', { class: 'igc-legend igc-small' }, ['AAA', 'AA', 'large', 'fail'].map(function (g) { return h('li', null, h('span', { class: 'igc-key', 'data-grade': g, 'aria-hidden': 'true' }), t('legend_' + g)); })));
    }
    /* Ajuste mínimo de luminosidad OKLCH (mismo tono y croma) para llegar a un umbral. */
    function suggest(fgHex, bgHex, target) {
      var l = lchOf(fgHex), hh = l.h == null ? 0 : l.h, best = null;
      [1, -1].forEach(function (dir) {
        for (var d = 0.005; d <= 1.0001; d += 0.005) {
          var L = l.l + dir * d; if (L < 0 || L > 1) break;
          var hx = fromLch(L, l.c, hh).hex; if (contrast(hx, bgHex) >= target) { if (!best || d < best.d) best = { hex: hx, d: d, l: L }; break; }
        }
      });
      return best;
    }

    /* ---------- Visión del color ---------- */
    var SIMS = ['normal', 'protan', 'deutan', 'tritan', 'grey'];
    function confusions() {
      var list = cols(), out = [];
      SIMS.forEach(function (k) {
        for (var i = 0; i < list.length; i++) for (var j = i + 1; j < list.length; j++) {
          var d0 = dOk(list[i].hex, list[j].hex), d = dOk(simulate(list[i].hex, k), simulate(list[j].hex, k));
          if (k === 'normal' ? d0 < 0.05 : (d < 0.05 && d0 >= 0.05)) out.push({ kind: k, a: list[i], b: list[j], d: d });
        }
      });
      return out;
    }
    function renderVision() {
      ctx.clear(stage);
      var box = h('div', { class: 'igc-scroll' }); stage.appendChild(box);
      if (!cols().length) { box.appendChild(h('p', { class: 'igs-muted', text: t('noColours') })); return; }
      box.appendChild(h('p', { class: 'igc-small', text: t('visionHelp') }));
      var grid = h('ul', { class: 'igc-vision' });
      SIMS.forEach(function (k) {
        var row = h('div', { class: 'igc-swrow' });
        cols().forEach(function (c) { var s = simulate(c.hex, k); row.appendChild(h('span', { class: 'igc-sw', style: 'background:' + s, title: cname(c) + ' → ' + s })); });
        var thumb = h('div', { class: 'igc-thumb' }); thumb.innerHTML = sceneSvg(pal(), { filter: k === 'normal' ? null : k, idp: 'v' + k, w: 800, h: 500, decorative: true });
        grid.appendChild(h('li', { class: 'igc-vis-item' }, h('h3', { text: t('sim_' + k) }), h('p', { class: 'igc-small igs-muted', text: t('sim_' + k + 'D') }), row, thumb));
      });
      box.appendChild(grid);
      var conf = confusions();
      var warn = h('section', { class: 'igc-panel', 'aria-labelledby': 'igc-h-conf' }, h('h3', { id: 'igc-h-conf', text: t('confTitle') }));
      if (!conf.length) warn.appendChild(h('p', { class: 'igs-result', 'data-kind': 'ok' }, h('strong', { text: t('confNone') })));
      else warn.appendChild(h('ul', { class: 'iga-review' }, conf.map(function (x) { return h('li', { 'data-ok': 'false' }, h('span', { class: 'iga-mark', 'aria-hidden': 'true', text: '!' }), t(x.kind === 'normal' ? 'confNormal' : 'confItem', { sim: t('sim_' + x.kind).toLowerCase(), a: cname(x.a), b: cname(x.b), d: IG.num(x.d, 3) })); })));
      warn.appendChild(h('p', { class: 'igc-small igs-muted', text: t('confNote') }));
      box.appendChild(warn);
    }

    /* ---------- Escena original (SVG) ---------- */
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function sceneColours(p) {
      var sky = roleHex(p, 'sky'), bg = roleHex(p, 'background'), main = roleHex(p, 'main'), acc = roleHex(p, 'accent'), txt = roleHex(p, 'text'), night = p.time === 'night';
      return { sky: sky, bg: bg, main: main, acc: acc, txt: txt, night: night, hillsFar: lerpLab(sky, bg, 0.45), hills: lerpLab(sky, bg, 0.75), road: shiftL(bg, night ? 0.07 : -0.09),
        roof: shiftL(main, -0.13), main2: shiftL(main, 0.07), win: night ? acc : lerpLab(sky, '#ffffff', 0.35), cloud: lerpLab(sky, '#ffffff', 0.7), trunk: lerpLab(txt, bg, 0.35),
        crown: lerpLab(main, acc, 0.35), crown2: shiftL(lerpLab(main, acc, 0.35), -0.08), star: lerpLab(acc, '#ffffff', 0.5), lines: lerpLab(bg, acc, 0.6) };
    }
    function sceneSvg(p, o) {
      o = o || {}; var C = sceneColours(p), id = o.idp || 'sc', s = '';
      var w = o.w || 800, hh = o.h || 500;
      s += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 ' + (o.credit ? 530 : 500) + '" width="' + w + '" height="' + (o.credit ? Math.round(hh * 530 / 500) : hh) + '"' + (o.decorative ? ' aria-hidden="true" focusable="false"' : ' role="img" aria-labelledby="' + id + '-t ' + id + '-d"') + '>';
      if (!o.decorative) s += '<title id="' + id + '-t">' + esc(t('sceneTitle', { name: p.name })) + '</title><desc id="' + id + '-d">' + esc(sceneDesc(p)) + '</desc>';
      if (o.filter) { var M = CVD[o.filter]; s += '<defs><filter id="' + id + '-f" color-interpolation-filters="linearRGB"><feColorMatrix type="matrix" values="' + [M[0], M[1], M[2], 0, 0, M[3], M[4], M[5], 0, 0, M[6], M[7], M[8], 0, 0, 0, 0, 0, 1, 0].join(' ') + '"/></filter></defs><g filter="url(#' + id + '-f)">'; }
      else s += '<g>';
      s += '<rect width="800" height="500" fill="' + C.sky + '"/>';
      if (C.night) {
        [[60, 60], [140, 120], [230, 40], [320, 95], [410, 30], [480, 140], [540, 70], [760, 50], [720, 160], [600, 170], [90, 190], [380, 180], [270, 160], [180, 70]].forEach(function (q, i) { s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="' + (i % 3 ? 2 : 3) + '" fill="' + C.star + '"/>'; });
        s += '<circle cx="660" cy="95" r="42" fill="' + C.acc + '"/><circle cx="680" cy="80" r="38" fill="' + C.sky + '"/>';
      } else {
        s += '<circle cx="660" cy="95" r="46" fill="' + C.acc + '"/>';
        s += '<g fill="' + C.cloud + '"><ellipse cx="170" cy="92" rx="62" ry="22"/><ellipse cx="205" cy="76" rx="38" ry="24"/><ellipse cx="455" cy="62" rx="50" ry="17"/><ellipse cx="482" cy="50" rx="30" ry="18"/></g>';
      }
      s += '<path d="M0 320 Q150 250 300 305 T600 295 T800 285 V500 H0Z" fill="' + C.hillsFar + '"/>';
      s += '<path d="M0 355 Q210 300 420 348 T800 336 V500 H0Z" fill="' + C.hills + '"/>';
      s += '<rect y="388" width="800" height="112" fill="' + C.bg + '"/>';
      s += '<rect y="440" width="800" height="46" fill="' + C.road + '"/>';
      s += '<g fill="' + C.lines + '">'; for (var x = 20; x < 800; x += 90) s += '<rect x="' + x + '" y="460" width="48" height="6" rx="3"/>'; s += '</g>';
      /* casa 1 */
      s += '<rect x="80" y="262" width="160" height="128" fill="' + C.main + '"/><polygon points="68,264 160,196 252,264" fill="' + C.roof + '"/>';
      s += '<rect x="100" y="290" width="40" height="36" rx="3" fill="' + C.win + '"/><rect x="180" y="290" width="40" height="36" rx="3" fill="' + C.win + '"/><rect x="143" y="332" width="34" height="58" rx="3" fill="' + C.roof + '"/>';
      /* casa 2 */
      s += '<rect x="270" y="214" width="124" height="176" fill="' + C.main2 + '"/><rect x="262" y="202" width="140" height="18" fill="' + C.roof + '"/>';
      [[286, 236], [346, 236], [286, 290], [346, 290]].forEach(function (q) { s += '<rect x="' + q[0] + '" y="' + q[1] + '" width="32" height="36" rx="3" fill="' + C.win + '"/>'; });
      s += '<rect x="316" y="340" width="32" height="50" rx="3" fill="' + C.roof + '"/>';
      /* árbol */
      s += '<rect x="452" y="300" width="16" height="90" fill="' + C.trunk + '"/><circle cx="460" cy="286" r="42" fill="' + C.crown + '"/><circle cx="436" cy="306" r="26" fill="' + C.crown2 + '"/><circle cx="486" cy="304" r="28" fill="' + C.crown2 + '"/>';
      /* cartel con texto: rol texto sobre rol fondo */
      s += '<rect x="588" y="330" width="12" height="62" fill="' + C.trunk + '"/><rect x="718" y="330" width="12" height="62" fill="' + C.trunk + '"/>';
      s += '<rect x="552" y="262" width="214" height="80" rx="10" fill="' + C.bg + '" stroke="' + C.txt + '" stroke-width="4"/>';
      s += '<text x="659" y="311" text-anchor="middle" font-family="Atkinson Hyperlegible, Arial, sans-serif" font-size="26" font-weight="700" fill="' + C.txt + '">' + esc(t('signText')) + '</text>';
      s += '</g>';
      if (o.credit) s += '<rect y="500" width="800" height="30" fill="#f4f7fa"/><text x="788" y="520" text-anchor="end" font-family="Atkinson Hyperlegible, Arial, sans-serif" font-size="12" fill="#17395c">IRIS GREEN · irisgreen.eu</text>';
      return s + '</svg>';
    }
    function sceneDesc(p) {
      var C = sceneColours(p);
      return t(C.night ? 'sceneNight' : 'sceneDay', { sky: approx(C.sky) + ' ' + C.sky, bg: approx(C.bg) + ' ' + C.bg, main: approx(C.main) + ' ' + C.main, acc: approx(C.acc) + ' ' + C.acc, txt: approx(C.txt) + ' ' + C.txt, sign: t('signText'), r: crText(contrast(C.txt, C.bg)) });
    }
    function renderScene() {
      ctx.clear(stage);
      var box = h('div', { class: 'igc-scene-view' }); stage.appendChild(box);
      var head = h('div', { class: 'igc-scene-head' });
      var chk = F.check(t('sceneAll'), sceneAll, { onChange: function (v) { sceneAll = !!v; keepFocus(stage, renderScene); ctx.setSummary(summary()); } }); chk.input.setAttribute('data-fk', 'sceneAll');
      head.appendChild(chk);
      if (!S.palettes.some(function (p) { return p.time === 'night'; })) head.appendChild(ctx.button(t('makeNight'), { icon: 'star', dataset: { fk: 'mkNight' }, onClick: makeNight }));
      box.appendChild(head);
      var list = sceneAll ? S.palettes : [pal()], grid = h('ul', { class: 'igc-scenes', 'data-n': String(list.length) });
      list.forEach(function (p, i) {
        var fig = h('figure', { class: 'igc-fig' }); var holder = h('div', { class: 'igc-scene' }); holder.innerHTML = sceneSvg(p, { idp: 'scn' + i, w: 800, h: 500 });
        fig.appendChild(holder); fig.appendChild(h('figcaption', { text: p.name + ' · ' + t(p.time === 'night' ? 'timeNight' : 'timeDay') }));
        grid.appendChild(h('li', null, fig));
      });
      box.appendChild(grid);
    }

    /* ---------- Paneles ---------- */
    function renderView() {
      stage.dataset.view = view; stage.setAttribute('aria-label', t('viewRegion', { v: t('v_' + view) }));
      if (view === 'wheel') renderWheel(); else if (view === 'harmony') renderHarmony(); else if (view === 'mix') renderMix();
      else if (view === 'contrast') renderContrast(); else if (view === 'vision') renderVision(); else renderScene();
    }
    function strip(p) { var s = h('span', { class: 'igc-pstrip', 'aria-hidden': 'true' }); p.colors.slice(0, 8).forEach(function (c) { s.appendChild(h('span', { style: 'background:' + c.hex })); }); return s; }
    function renderStructure() {
      var pl = h('ul', { class: 'igs-list' });
      S.palettes.forEach(function (p, i) {
        var b = h('button', { type: 'button', 'aria-current': String(i === S.cur), 'data-fk': 'pal-' + p.id }, strip(p), h('span', { text: p.name }), h('small', { text: t(p.time === 'night' ? 'timeNight' : 'timeDay') }));
        b.addEventListener('click', function () { S.cur = i; selId = null; selPair = null; keepFocus(ctx.structure, refresh); ctx.announce(t('paletteNow', { name: p.name, n: p.colors.length })); });
        pl.appendChild(h('li', null, b));
      });
      var cl = h('ul', { class: 'igs-list' });
      cols().forEach(function (c) {
        var b = h('button', { type: 'button', 'aria-current': String(c.id === selId), 'data-fk': 'col-' + c.id, 'data-hex': c.hex }, h('span', { class: 'igs-swatch', style: 'background:' + c.hex }), h('span', { class: 'igc-sname' }, h('span', { text: cname(c) }), h('small', { class: 'igc-srole', text: roleName(c.role) + ' · ' + c.hex })));
        b.addEventListener('click', function () { select(c.id); });
        cl.appendChild(h('li', null, b));
      });
      ctx.setStructure([h('h3', { text: t('palettes') }), pl,
        h('div', { class: 'igs-actions' }, ctx.button(t('newPalette'), { icon: 'plus', dataset: { fk: 'newPal' }, onClick: newPalette })),
        h('h3', { text: t('coloursN', { n: cols().length }) }), cl,
        h('div', { class: 'igs-actions' }, ctx.button(t('addColour'), { icon: 'plus', dataset: { fk: 'addCol' }, onClick: function () { addColour(); } }))]);
    }
    function slider(key, label, value, o) {
      var id = uid(), rng = h('input', { id: id, type: 'range', min: o.min, max: o.max, step: o.step, 'data-fk': key + '-r' });
      var numI = h('input', { type: 'number', min: o.min, max: o.max, step: o.step, inputmode: 'decimal', 'aria-label': label + ' · ' + t('exactValue'), 'data-fk': key + '-n' });
      function show(v) { return String(Math.round(v * Math.pow(10, o.digits)) / Math.pow(10, o.digits)); }
      rng.value = String(value); numI.value = show(value);
      rng.addEventListener('input', function () { numI.value = show(+rng.value); if (o.onLive) o.onLive(+rng.value); });
      rng.addEventListener('change', function () { o.onSet(+rng.value); });
      numI.addEventListener('change', function () { var v = parseFloat(String(numI.value).replace(',', '.')); if (!isFinite(v)) { numI.value = show(value); return; } v = clamp(v, o.min, o.max); rng.value = String(v); o.onSet(v); });
      return h('div', { class: 'igs-field igc-slider' }, h('label', { for: id, text: label }), h('div', { class: 'igc-slider-row' }, rng, numI, o.unit ? h('span', { class: 'igs-unit', text: o.unit }) : null));
    }
    function checks() {
      var p = pal(), items = [], bg = roleHex(p, 'background'), tx = roleHex(p, 'text'), mn = roleHex(p, 'main'), ac = roleHex(p, 'accent'), ch = S.challenge;
      if (!p.colors.length) return items;
      var rt = contrast(tx, bg), need = ch === 'brand' ? 7 : 4.5;
      items.push({ ok: rt >= need, text: t(rt >= need ? 'chkTextOk' : 'chkTextBad', { r: crText(rt), need: IG.num(need, 1) }), fix: rt < need ? 'text' : null });
      var rm = contrast(mn, bg), needM = ch === 'brand' ? 4.5 : 3;
      items.push({ ok: rm >= needM, text: t(rm >= needM ? 'chkMainOk' : 'chkMainBad', { r: crText(rm), need: IG.num(needM, 1) }), fix: rm < needM ? 'main' : null });
      var ra = contrast(ac, bg); items.push({ ok: ra >= 3, text: t(ra >= 3 ? 'chkAccOk' : 'chkAccBad', { r: crText(ra) }), fix: ra < 3 ? 'accent' : null });
      var cf = confusions().filter(function (x) { return x.kind !== 'grey'; }); items.push({ ok: !cf.length, text: cf.length ? t('chkConfBad', { n: cf.length }) : t('chkConfOk') });
      if (ch === 'five') items.unshift({ ok: p.colors.length === 5, text: t('chkFive', { n: p.colors.length }) });
      if (ch === 'rainbow') { items.unshift({ ok: p.colors.length >= 6, text: t('chkRainbow', { n: p.colors.length }) }); items.push({ ok: p.colors.some(function (c) { return c.src === 'mix'; }), text: t('chkMixed') }); }
      if (ch === 'game') items.unshift({ ok: lchOf(bg).l < 0.35, text: t('chkDark') });
      if (ch === 'daynight') {
        var days = S.palettes.filter(function (q) { return q.time === 'day'; }), nights = S.palettes.filter(function (q) { return q.time === 'night'; });
        items.unshift({ ok: days.length > 0 && nights.length > 0, text: t('chkDayNight') });
        nights.concat(days).forEach(function (q) { if (q === p) return; var r = contrast(roleHex(q, 'text'), roleHex(q, 'background')); items.push({ ok: r >= 4.5, text: t('chkOther', { name: q.name, r: crText(r) }) }); });
      }
      return items;
    }
    function fixRole(role) {
      var p = pal(), c = roleColor(p, role), bgc = roleColor(p, 'background'); if (!c || !bgc) { ctx.announce(t('needRoles')); return; }
      var target = role === 'text' ? (S.challenge === 'brand' ? 7 : 4.5) : role === 'main' ? (S.challenge === 'brand' ? 4.5 : 3) : 3, sg = suggest(c.hex, bgc.hex, target);
      if (!sg) { ctx.announce(t('noFix')); return; }
      c.hex = sg.hex; commit(t('fixed', { name: cname(c), hex: sg.hex }));
    }
    function reviewBlock(out) {
      var rv = checks(); if (!rv.length) return;
      out.push(h('h4', { text: S.challenge ? t('challengeTitle') + ': ' + t('ch_' + S.challenge) : t('reviewTitle') }));
      if (S.challenge) out.push(h('p', { class: 'igs-note', text: t('ch_' + S.challenge + 'D') }));
      var bad = rv.filter(function (x) { return !x.ok; }).length;
      out.push(h('p', { class: 'igs-result', 'data-kind': bad ? 'bad' : 'ok' }, h('strong', { text: bad ? t('reviewBad', { n: bad }) : (S.challenge ? t('challengeDone') : t('reviewOk')) })));
      out.push(h('ul', { class: 'iga-review' }, rv.map(function (x) {
        return h('li', { 'data-ok': String(x.ok) }, h('span', { class: 'iga-mark', 'aria-hidden': 'true', text: x.ok ? '✓' : '!' }), h('span', { class: 'igs-sr', text: (x.ok ? t('okWord') : t('checkWord')) + ': ' }),
          h('span', null, x.text, x.fix ? h('span', { class: 'igc-fixrow' }, ctx.button(t('fixBtn'), { class: 'igc-small-btn', dataset: { fk: 'fix-' + x.fix }, onClick: function () { fixRole(x.fix); } })) : null));
      })));
    }
    function renderInspector() {
      var out = [], c = sel();
      if (c) {
        var lc = lchC(c), hsl = rgbHsl(c.hex);
        out.push(h('div', { class: 'igc-insp-head' }, h('span', { class: 'igc-sw igc-sw-big', style: 'background:' + c.hex }), h('div', null, h('h4', { text: cname(c) }), h('p', { class: 'igc-small', text: t('approxName') + ': ' + approx(c.hex) + ' · ' + c.hex }))));
        var hx = F.text(t('hexLabel'), c.hex, { max: 7, onChange: function (v) { var n = normHex(v); if (!n) { ctx.announce(t('badHex')); renderInspector(); return; } c.hex = n; commit(t('colourChanged') + ': ' + cname(c) + ' ' + n); } }); hx.input.setAttribute('data-fk', 'hex'); hx.input.setAttribute('spellcheck', 'false'); out.push(hx);
        var nat = F.color(t('pickerLabel'), c.hex, { onInput: function (v) { c.hex = v; live(); }, onChange: function (v) { c.hex = v; commit(t('colourChanged') + ': ' + cname(c) + ' ' + v); } }); nat.input.setAttribute('data-fk', 'native'); out.push(nat);
        var rs = F.select(t('roleLabel'), c.role || 'free', ROLES.map(function (r) { return [r, roleName(r)]; }), { onChange: function (v) { c.role = v; commit(t('roleChanged', { name: cname(c), role: roleName(v) })); } }); rs.input.setAttribute('data-fk', 'role'); out.push(rs);
        var lb = F.text(t('ownName'), c.label || '', { max: 40, onChange: function (v) { c.label = String(v).trim().slice(0, 40); commit(t('renamed')); } }); lb.input.setAttribute('data-fk', 'label'); out.push(lb);
        out.push(h('p', { class: 'igs-field-group', text: t('oklchGroup') }));
        function setL(v, done) { var l2 = lchC(c); setLch(c, v / 100, l2.c, l2.h); if (done) commit(t('colourChanged') + ': ' + cname(c) + ' ' + c.hex); else live(); }
        function setC(v, done) { var l2 = lchC(c); setLch(c, l2.l, v, l2.h); if (done) commit(t('colourChanged') + ': ' + cname(c) + ' ' + c.hex); else live(); }
        function setH(v, done) { var l2 = lchC(c); setLch(c, l2.l, l2.c, v); if (done) commit(t('colourChanged') + ': ' + cname(c) + ' ' + c.hex); else live(); }
        out.push(slider('okl', t('okL'), Math.round(lc.l * 1000) / 10, { min: 0, max: 100, step: 0.5, digits: 1, unit: '%', onLive: function (v) { setL(v, false); }, onSet: function (v) { setL(v, true); } }));
        out.push(slider('okc', t('okC'), Math.round(lc.c * 1000) / 1000, { min: 0, max: 0.37, step: 0.005, digits: 3, onLive: function (v) { setC(v, false); }, onSet: function (v) { setC(v, true); } }));
        out.push(slider('okh', t('okH'), Math.round(lc.h), { min: 0, max: 360, step: 1, digits: 0, unit: '°', onLive: function (v) { setH(v, false); }, onSet: function (v) { setH(v, true); } }));
        if (lc.c >= maxChroma(lc.l, lc.h) - 0.001 && lc.c > 0.01) out.push(h('p', { class: 'igc-gamut', text: t('gamutEdge') }));
        out.push(h('p', { class: 'igs-field-group', text: t('hslGroup') }));
        function setHsl(i, v, done) { var q = rgbHsl(c.hex); q[i] = v; c.hex = hslHex(q[0], q[1], q[2]); if (i === 0) hueMemo[c.id] = null; if (done) commit(t('colourChanged') + ': ' + cname(c) + ' ' + c.hex); else live(); }
        out.push(slider('hslh', t('hslH'), Math.round(hsl[0]), { min: 0, max: 360, step: 1, digits: 0, unit: '°', onLive: function (v) { setHsl(0, v, false); }, onSet: function (v) { setHsl(0, v, true); } }));
        out.push(slider('hsls', t('hslS'), Math.round(hsl[1]), { min: 0, max: 100, step: 1, digits: 0, unit: '%', onLive: function (v) { setHsl(1, v, false); }, onSet: function (v) { setHsl(1, v, true); } }));
        out.push(slider('hsll', t('hslL'), Math.round(hsl[2]), { min: 0, max: 100, step: 1, digits: 0, unit: '%', onLive: function (v) { setHsl(2, v, false); }, onSet: function (v) { setHsl(2, v, true); } }));
        var bgc = roleHex(pal(), 'background');
        out.push(h('p', { class: 'igs-field-group', text: t('contrastGroup') }));
        out.push(h('ul', { class: 'igc-small igc-crlist' }, [['#ffffff', t('onWhite')], ['#000000', t('onBlack')], [bgc, t('onBackground', { name: approx(bgc) })]].map(function (q) { var r = contrast(c.hex, q[0]); return h('li', null, h('span', { class: 'igc-chip', style: 'background:' + q[0] }), ' ' + q[1] + ': ', h('strong', { text: crText(r) }), ' · ' + t('grade_' + grade(r))); })));
        var i = cols().indexOf(c);
        out.push(h('div', { class: 'igs-actions' },
          ctx.button(t('moveUp'), { icon: 'undo', dataset: { fk: 'up' }, disabled: i === 0, onClick: function () { var j = cols().indexOf(c); if (j > 0) { cols().splice(j, 1); cols().splice(j - 1, 0, c); commit(t('reordered')); } } }),
          ctx.button(t('moveDown'), { icon: 'redo', dataset: { fk: 'down' }, disabled: i === cols().length - 1, onClick: function () { var j = cols().indexOf(c); if (j < cols().length - 1) { cols().splice(j, 1); cols().splice(j + 1, 0, c); commit(t('reordered')); } } }),
          ctx.button(t('duplicate'), { icon: 'copy', dataset: { fk: 'dup' }, onClick: function () { if (cols().length >= MAXC) { ctx.announce(t('tooMany', { n: MAXC })); return; } var d = { id: nid('c'), hex: c.hex, role: 'free', label: '' }; cols().splice(cols().indexOf(c) + 1, 0, d); selId = d.id; commit(t('duplicated')); } }),
          ctx.button(t('deleteBtn'), { icon: 'trash', class: 'igs-danger', dataset: { fk: 'del' }, onClick: function () { removeColour(c.id); } })));
      } else if (selPair && byId(selPair.fg) && byId(selPair.bg)) {
        var fg = byId(selPair.fg), bg = byId(selPair.bg), r = contrast(fg.hex, bg.hex);
        out.push(h('h4', { text: t('pairTitle', { fg: cname(fg), bg: cname(bg) }) }));
        out.push(h('div', { class: 'igc-sample', style: 'background:' + bg.hex }, sampleSvg(t('sampleNormal'), fg.hex, 'igc-sample-n', 16, 400), sampleSvg(t('sampleLarge'), fg.hex, 'igc-sample-l', 24, 700)));
        out.push(h('p', { class: 'igs-result', 'data-kind': r >= 4.5 ? 'ok' : 'bad' }, h('strong', { text: t('ratioIs', { r: crText(r) }) }), t('grade_' + grade(r))));
        out.push(h('ul', { class: 'iga-review' }, [[4.5, 'critAA'], [7, 'critAAA'], [3, 'critLarge'], [4.5, 'critLargeAAA'], [3, 'critGraphics']].map(function (q) { var ok = r >= q[0]; return h('li', { 'data-ok': String(ok) }, h('span', { class: 'iga-mark', 'aria-hidden': 'true', text: ok ? '✓' : '!' }), h('span', { class: 'igs-sr', text: (ok ? t('okWord') : t('checkWord')) + ': ' }), t(q[1])); })));
        [4.5, 7].forEach(function (target) {
          if (r >= target) return;
          var sf = suggest(fg.hex, bg.hex, target), sb = suggest(bg.hex, fg.hex, target);
          out.push(h('p', { class: 'igs-field-group', text: t('suggestTitle', { need: IG.num(target, 1) }) }));
          if (sf) out.push(h('div', { class: 'igc-suggest' }, h('span', { class: 'igc-chip', style: 'background:' + sf.hex }), h('span', { class: 'igc-small', text: t('suggestFg', { from: pct(lchOf(fg.hex).l), to: pct(sf.l), hex: sf.hex }) }), ctx.button(t('applyFg'), { class: 'igc-small-btn', dataset: { fk: 'sf' + target }, onClick: function () { fg.hex = sf.hex; commit(t('fixed', { name: cname(fg), hex: sf.hex })); } })));
          if (sb) out.push(h('div', { class: 'igc-suggest' }, h('span', { class: 'igc-chip', style: 'background:' + sb.hex }), h('span', { class: 'igc-small', text: t('suggestBg', { from: pct(lchOf(bg.hex).l), to: pct(sb.l), hex: sb.hex }) }), ctx.button(t('applyBg'), { class: 'igc-small-btn', dataset: { fk: 'sb' + target }, onClick: function () { bg.hex = sb.hex; commit(t('fixed', { name: cname(bg), hex: sb.hex })); } })));
          if (!sf && !sb) out.push(h('p', { class: 'igs-muted', text: t('noFix') }));
        });
        out.push(h('p', { class: 'igs-muted igc-small', text: t('suggestNote') }));
        out.push(h('div', { class: 'igs-actions' }, ctx.button(t('closePair'), { dataset: { fk: 'closePair' }, onClick: function () { selPair = null; refresh(); } })));
      } else {
        var p = pal();
        out.push(h('h4', { text: t('paletteProps') }));
        var nm = F.text(t('paletteName'), p.name, { max: 40, onChange: function (v) { p.name = String(v).trim().slice(0, 40) || p.name; commit(t('renamed')); } }); nm.input.setAttribute('data-fk', 'pname'); out.push(nm);
        out.push(F.choice(t('timeLabel'), p.time, [['day', t('timeDay')], ['night', t('timeNight')]], { onChange: function (v) { p.time = v; commit(t('timeChanged', { t: t(v === 'night' ? 'timeNight' : 'timeDay') })); } }));
        reviewBlock(out);
        out.push(h('div', { class: 'igs-actions' },
          ctx.button(t('addColour'), { icon: 'plus', dataset: { fk: 'i-add' }, onClick: function () { addColour(); } }),
          ctx.button(t('sortLight'), { icon: 'sliders', dataset: { fk: 'i-sort' }, onClick: function () { cols().sort(function (a, b) { return relLum(b.hex) - relLum(a.hex); }); commit(t('sorted')); } }),
          ctx.button(t('autoRoles'), { icon: 'sparkle', dataset: { fk: 'i-roles' }, onClick: function () { assignRoles(cols()); commit(t('rolesAssigned')); } }),
          ctx.button(t('makeNight'), { icon: 'star', dataset: { fk: 'i-night' }, onClick: makeNight }),
          ctx.button(t('dupPalette'), { icon: 'copy', dataset: { fk: 'i-dup' }, onClick: function () { dupPalette(); } }),
          ctx.button(t('delPalette'), { icon: 'trash', class: 'igs-danger', dataset: { fk: 'i-delp' }, onClick: delPalette })));
        out.push(h('p', { class: 'igs-muted igc-small', text: t('rolesHelp') }));
      }
      keepFocus(ctx.inspector, function () { ctx.setInspector(out); });
    }
    function summary() {
      var p = pal(), list = p.colors;
      var base = t('summary', { name: p.name, time: t(p.time === 'night' ? 'timeNight' : 'timeDay').toLowerCase(), n: list.length, view: t('v_' + view) }) + (list.length ? ' ' + list.map(function (c) { return cname(c) + ' ' + c.hex + ' (' + roleName(c.role) + ')'; }).join(', ') + '.' : ' ' + t('noColours'));
      var c = sel(); if (c) base += ' ' + t('selNow', { name: cname(c), v: lchText(c) });
      if (view === 'scene') base += ' ' + (sceneAll ? S.palettes.map(sceneDesc).join(' ') : sceneDesc(p));
      if (view === 'contrast' && list.length > 1) base += ' ' + t('sumContrast', { r: crText(contrast(roleHex(p, 'text'), roleHex(p, 'background'))) });
      if (view === 'vision') { var cf = confusions(); base += ' ' + (cf.length ? t('chkConfBad', { n: cf.length }) : t('confNone')); }
      if (view === 'mix') base += ' ' + t('sumMix', { name: approx(rybHex(ryb)), hex: rybHex(ryb) });
      return base;
    }
    function refresh() { renderView(); renderStructure(); renderInspector(); ctx.setSummary(summary()); }
    function live() { renderView(); renderStructure(); ctx.setSummary(summary()); }
    function commit(label) { refresh(); ctx.commit(label); if (label) ctx.announce(label); }
    function select(id) { selId = id && byId(id) ? id : null; selPair = null; keepFocus(ctx.structure, refresh); var c = sel(); ctx.announce(c ? t('selected', { name: cname(c) + ' ' + c.hex + ', ' + roleName(c.role) + ', ' + lchText(c) }) : t('deselected')); }

    /* ---------- Acciones ---------- */
    function addColour(hex) {
      if (cols().length >= MAXC) { ctx.announce(t('tooMany', { n: MAXC })); return; }
      var s = sel(), nh = hex;
      if (!nh) { if (s) { var l = lchC(s); nh = fromLch(l.l, Math.max(l.c, 0.08), l.h + 40).hex; } else nh = '#5a49a8'; }
      var c = { id: nid('c'), hex: nh, role: 'free', label: '' }; cols().push(c); selId = c.id; selPair = null;
      commit(t('colourAdded', { name: cname(c), hex: nh }));
    }
    function removeColour(id) {
      var c = byId(id); if (!c) return; var i = cols().indexOf(c); pal().colors = cols().filter(function (x) { return x.id !== id; });
      selId = cols()[Math.min(i, cols().length - 1)] ? cols()[Math.min(i, cols().length - 1)].id : null; selPair = null;
      commit(t('deleted', { name: cname(c) }));
    }
    function newPalette() {
      if (S.palettes.length >= MAXP) { ctx.announce(t('tooManyPal', { n: MAXP })); return; }
      S.palettes.push({ id: nid('p'), name: t('paletteN', { n: S.palettes.length + 1 }), time: 'day', colors: [] }); S.cur = S.palettes.length - 1; selId = null; selPair = null;
      commit(t('paletteAdded'));
    }
    function dupPalette(night) {
      if (S.palettes.length >= MAXP) { ctx.announce(t('tooManyPal', { n: MAXP })); return null; }
      var p = pal(), q = { id: nid('p'), name: night ? t('nightOf', { name: p.name }) : t('copyOf', { name: p.name }), time: night ? 'night' : p.time, colors: p.colors.map(function (c) { return { id: nid('c'), hex: c.hex, role: c.role, label: c.label || '' }; }) };
      S.palettes.splice(S.cur + 1, 0, q); S.cur += 1; selId = null; selPair = null;
      if (!night) commit(t('paletteDup')); return q;
    }
    /* Versión de noche: cada rol se transforma en OKLCH (cielo oscuro y azulado, fondos apagados, luces del acento encendidas, texto claro). */
    function makeNight() {
      var src = pal(); if (!src.colors.length) { ctx.announce(t('noColours')); return; }
      var q = dupPalette(true); if (!q) return;
      q.colors.forEach(function (c) {
        var l = lchOf(c.hex), hh = l.h == null ? 260 : l.h, L = l.l, C = l.c;
        if (c.role === 'sky') { L = 0.24; C = Math.min(0.07, C * 0.6 + 0.03); hh = hh + ((260 - hh + 540) % 360 - 180) * 0.6; }
        else if (c.role === 'background') { L = clamp(L * 0.34 + 0.06, 0.12, 0.34); C *= 0.55; hh = hh + ((260 - hh + 540) % 360 - 180) * 0.3; }
        else if (c.role === 'text') { L = L < 0.6 ? 0.93 : L; C = Math.min(C, 0.03); }
        else if (c.role === 'accent') { L = Math.max(L, 0.82); }
        else { L = clamp(L * 0.6, 0.18, 0.5); C *= 0.8; hh = hh + ((260 - hh + 540) % 360 - 180) * 0.2; }
        c.hex = fromLch(L, C, hh).hex;
      });
      commit(t('nightMade', { name: q.name }));
    }
    function delPalette() {
      if (S.palettes.length < 2) { ctx.announce(t('lastPalette')); return; }
      var p = pal(); S.palettes.splice(S.cur, 1); S.cur = Math.min(S.cur, S.palettes.length - 1); selId = null; selPair = null;
      commit(t('paletteDeleted', { name: p.name }));
    }
    function setView(v) { if (VIEWS.indexOf(v) < 0) return; if (ctx.tool() !== v) { ctx.selectTool(v); return; } }

    /* ---------- Teclado ---------- */
    var keyTimer = 0;
    function keyCommit() { clearTimeout(keyTimer); keyTimer = setTimeout(function () { var c = sel(); ctx.commit(t('colourChanged') + (c ? ': ' + cname(c) + ' ' + c.hex : '')); renderInspector(); }, 450); }
    function onKey(e) {
      if (!vp.contains(e.target)) return false;
      var onCanvas = e.target === vp || e.target === stage || (e.target.closest && e.target.closest('.igc-wheelbox,.igc-stripbox'));
      var k = e.key, list = cols(), c = sel();
      if ((k === '[' || k === ']') && list.length) { var i = c ? list.indexOf(c) : -1; i = k === ']' ? (i + 1) % list.length : (i - 1 + list.length) % list.length; select(list[i].id); return true; }
      if (!onCanvas) return false;
      if (k === 'Escape' && (c || selPair)) { selId = null; selPair = null; refresh(); ctx.announce(t('deselected')); return true; }
      if ((k === 'Delete' || k === 'Backspace') && c) { removeColour(c.id); return true; }
      if (view !== 'wheel') return false;
      var map = { ArrowLeft: ['hue', -1], ArrowRight: ['hue', 1], ArrowUp: ['chroma', 1], ArrowDown: ['chroma', -1], PageUp: ['light', 1], PageDown: ['light', -1] }[k];
      if (!map) return false;
      if (!c) { if (!list.length) return false; select(list[0].id); return true; }
      var r = nudge(map[0], map[1], e.shiftKey); live(); keyCommit();
      ctx.announce(lchText(c) + '. ' + cname(c) + ' ' + c.hex + (r && r.clipped ? '. ' + t('gamutEdge') : ''));
      return true;
    }

    /* ---------- Herramientas y órdenes ---------- */
    ctx.setTools([
      { id: 'wheel', label: t('v_wheel'), icon: 'circle' },
      { id: 'harmony', label: t('v_harmony'), icon: 'sparkle' },
      { id: 'mix', label: t('v_mix'), icon: 'bucket' },
      { id: 'contrast', label: t('v_contrast'), icon: 'text', level: 'more' },
      { id: 'vision', label: t('v_vision'), icon: 'eye', level: 'more' },
      { id: 'scene', label: t('v_scene'), icon: 'frame' },
      { separator: true },
      { id: 'addc', label: t('addColour'), icon: 'plus', action: function () { addColour(); } },
      { id: 'night', label: t('makeNight'), icon: 'star', level: 'more', action: makeNight }
    ], { initial: 'wheel' });
    VIEWS.forEach(function (v) { ctx.command('view-' + v, t('v_' + v), t('viewCmd'), function () { setView(v); }); });
    ctx.command('addc', t('addColour'), '', function () { addColour(); });
    ctx.command('night', t('makeNight'), '', makeNight);
    ctx.command('newpal', t('newPalette'), '', newPalette);
    ctx.command('sort', t('sortLight'), '', function () { cols().sort(function (a, b) { return relLum(b.hex) - relLum(a.hex); }); commit(t('sorted')); });

    /* ---------- Exportaciones ---------- */
    function fbase(suffix) { return (LANG === 'en' ? 'palette-' : 'paleta-') + ctx.stamp() + suffix; }
    function slug(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'color'; }
    function cardLayout(n) { var perRow = Math.min(Math.max(n, 1), 6), rows = Math.max(1, Math.ceil(n / 6)); return { perRow: perRow, rows: rows, W: 1400, swW: Math.floor((1400 - 120 - (perRow - 1) * 20) / perRow), H: 150 + rows * 420 + 150 }; }
    function paletteCanvas() {
      var p = pal(), L = cardLayout(p.colors.length), c = D.createElement('canvas'); c.width = L.W; c.height = L.H;
      var g = c.getContext('2d'), F1 = 'Atkinson Hyperlegible, Arial, sans-serif';
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, L.W, L.H);
      g.fillStyle = '#172b42'; g.font = '700 44px ' + F1; g.fillText(p.name, 60, 80);
      g.font = '400 24px ' + F1; g.fillStyle = '#44586c'; g.fillText(t('cardSub', { n: p.colors.length, time: t(p.time === 'night' ? 'timeNight' : 'timeDay').toLowerCase() }), 60, 118);
      p.colors.forEach(function (col, i) {
        var r = Math.floor(i / 6), k = i % 6, x = 60 + k * (L.swW + 20), y = 150 + r * 420;
        g.fillStyle = col.hex; g.fillRect(x, y, L.swW, 250); g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 2; g.strokeRect(x + 1, y + 1, L.swW - 2, 248);
        g.fillStyle = '#172b42'; g.font = '700 24px ' + F1; g.fillText(cname(col).slice(0, 22), x, y + 290);
        g.font = '400 22px ' + F1; g.fillText(col.hex.toUpperCase(), x, y + 322); g.fillStyle = '#44586c'; g.font = '400 19px ' + F1; g.fillText(roleName(col.role), x, y + 350);
        var l = lchC(col); g.fillText('oklch(' + IG.num(l.l * 100, 1) + '% ' + IG.num(l.c, 3) + ' ' + IG.num(l.h, 0) + ')', x, y + 376);
      });
      var bg = roleHex(p, 'background'), tx = roleHex(p, 'text'), y0 = L.H - 120;
      g.fillStyle = bg; g.fillRect(60, y0, L.W - 120, 80); g.strokeStyle = 'rgba(0,0,0,.25)'; g.strokeRect(61, y0 + 1, L.W - 122, 78);
      g.fillStyle = tx; g.font = '700 30px ' + F1; g.fillText(t('cardSample', { r: crText(contrast(tx, bg)) }), 90, y0 + 50);
      return c;
    }
    function paletteSvg() {
      var p = pal(), L = cardLayout(p.colors.length), F1 = 'Atkinson Hyperlegible, Arial, sans-serif', s = '';
      s += '<svg xmlns="http://www.w3.org/2000/svg" width="' + L.W + '" height="' + (L.H + 40) + '" viewBox="0 0 ' + L.W + ' ' + (L.H + 40) + '" role="img" aria-labelledby="pt pd">';
      s += '<title id="pt">' + esc(p.name) + '</title><desc id="pd">' + esc(p.colors.map(function (c) { return cname(c) + ' ' + c.hex + ' (' + roleName(c.role) + ')'; }).join(', ')) + '</desc>';
      s += '<rect width="' + L.W + '" height="' + (L.H + 40) + '" fill="#ffffff"/><text x="60" y="80" font-family="' + F1 + '" font-size="44" font-weight="700" fill="#172b42">' + esc(p.name) + '</text>';
      s += '<text x="60" y="118" font-family="' + F1 + '" font-size="24" fill="#44586c">' + esc(t('cardSub', { n: p.colors.length, time: t(p.time === 'night' ? 'timeNight' : 'timeDay').toLowerCase() })) + '</text>';
      p.colors.forEach(function (col, i) {
        var r = Math.floor(i / 6), k = i % 6, x = 60 + k * (L.swW + 20), y = 150 + r * 420, l = lchC(col);
        s += '<g><rect x="' + x + '" y="' + y + '" width="' + L.swW + '" height="250" fill="' + col.hex + '" stroke="#00000040" stroke-width="2"/>';
        s += '<text x="' + x + '" y="' + (y + 290) + '" font-family="' + F1 + '" font-size="24" font-weight="700" fill="#172b42">' + esc(cname(col)) + '</text>';
        s += '<text x="' + x + '" y="' + (y + 322) + '" font-family="' + F1 + '" font-size="22" fill="#172b42">' + col.hex.toUpperCase() + '</text>';
        s += '<text x="' + x + '" y="' + (y + 350) + '" font-family="' + F1 + '" font-size="19" fill="#44586c">' + esc(roleName(col.role)) + '</text>';
        s += '<text x="' + x + '" y="' + (y + 376) + '" font-family="' + F1 + '" font-size="19" fill="#44586c">oklch(' + (l.l * 100).toFixed(1) + '% ' + l.c.toFixed(3) + ' ' + l.h.toFixed(0) + ')</text></g>';
      });
      var bg = roleHex(p, 'background'), tx = roleHex(p, 'text'), y0 = L.H - 120;
      s += '<rect x="60" y="' + y0 + '" width="' + (L.W - 120) + '" height="80" fill="' + bg + '" stroke="#00000040"/><text x="90" y="' + (y0 + 50) + '" font-family="' + F1 + '" font-size="30" font-weight="700" fill="' + tx + '">' + esc(t('cardSample', { r: crText(contrast(tx, bg)) })) + '</text>';
      s += '<text x="' + (L.W - 30) + '" y="' + (L.H + 22) + '" text-anchor="end" font-family="' + F1 + '" font-size="14" fill="#44586c">IRIS GREEN · irisgreen.eu</text></svg>';
      return s;
    }
    function svgToPng(svgStr, w, hgt) {
      return new Promise(function (resolve, reject) {
        var img = new Image(), url = URL.createObjectURL(new Blob([svgStr], { type: 'image/svg+xml' }));
        img.onload = function () { var c = D.createElement('canvas'); c.width = w; c.height = hgt; var g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, w, hgt); g.drawImage(img, 0, 0, w, hgt); URL.revokeObjectURL(url); resolve(c); };
        img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('svg')); };
        img.src = url;
      });
    }
    function need() { if (!cols().length) { ctx.announce(t('noColours')); return false; } return true; }
    var EXPORTS = [
      ['exportCard', function () { if (!need()) return; ctx.canvasBlob(ctx.canvasWithCredit(paletteCanvas(), '#ffffff')).then(function (b) { ctx.download(b, fbase('.png')); }); }],
      ['exportSvg', function () { if (!need()) return; ctx.download(new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + paletteSvg()], { type: 'image/svg+xml' }), fbase('.svg')); }],
      ['exportCss', function () {
        if (!need()) return; var p = pal(), used = {}, lines = ['/* ' + t('cssHeader', { name: p.name }) + ' · IRIS GREEN · irisgreen.eu */', ':root {'];
        p.colors.forEach(function (c, i) { var base = '--' + (LANG === 'en' ? 'colour-' : 'color-') + slug(c.role && c.role !== 'free' ? roleName(c.role) : String(i + 1)); var nm = base, k = 2; while (used[nm]) { nm = base + '-' + k; k++; } used[nm] = 1; var l = lchC(c); lines.push('  ' + nm + ': ' + c.hex + '; /* ' + cname(c) + ' · oklch(' + (l.l * 100).toFixed(1) + '% ' + l.c.toFixed(3) + ' ' + l.h.toFixed(0) + ') */'); });
        lines.push('}'); ctx.download(new Blob([lines.join('\n') + '\n'], { type: 'text/css' }), fbase('.css'));
      }],
      ['exportGpl', function () {
        if (!need()) return; var p = pal(), lines = ['GIMP Palette', 'Name: ' + p.name.replace(/[\r\n]/g, ' '), 'Columns: ' + Math.min(8, p.colors.length), '# IRIS GREEN · irisgreen.eu'];
        p.colors.forEach(function (c) { var r = hexRgb(c.hex); lines.push(r.map(function (v) { return ('   ' + v).slice(-3); }).join(' ') + '\t' + cname(c) + ' (' + roleName(c.role) + ')'); });
        ctx.download(new Blob([lines.join('\n') + '\n'], { type: 'text/plain' }), fbase('.gpl'));
      }],
      ['exportJson', function () {
        if (!need()) return; var p = pal();
        var data = { format: 'iris-green-palette', version: 1, credit: 'IRIS GREEN · irisgreen.eu', name: p.name, time: p.time, colors: p.colors.map(function (c) { var l = lchC(c); return { hex: c.hex, name: cname(c), role: c.role, rgb: hexRgb(c.hex), oklch: [Math.round(l.l * 1000) / 1000, Math.round(l.c * 1000) / 1000, Math.round(l.h)] }; }),
          textOnBackground: Math.floor(contrast(roleHex(p, 'text'), roleHex(p, 'background')) * 100) / 100 };
        ctx.download(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), fbase('.json'));
      }],
      ['exportScenePng', function () { svgToPng(sceneSvg(pal(), { idp: 'ex', w: 1600, h: 1000 }), 1600, 1000).then(function (c) { return ctx.canvasBlob(ctx.canvasWithCredit(c, '#ffffff')); }).then(function (b) { ctx.download(b, (LANG === 'en' ? 'scene-' : 'escena-') + ctx.stamp() + '.png'); }).catch(function () { ctx.announce(t('exportError')); }); }],
      ['exportSceneSvg', function () { ctx.download(new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + sceneSvg(pal(), { idp: 'ex', w: 800, h: 500, credit: true })], { type: 'image/svg+xml' }), (LANG === 'en' ? 'scene-' : 'escena-') + ctx.stamp() + '.svg'); }]
    ];
    EXPORTS.forEach(function (x) { ctx.addExport(t(x[0]), x[1]); ctx.command(x[0], t(x[0]), t('fileWord'), x[1]); });

    /* ---------- Puntos de partida ---------- */
    function mk(list) { return list.map(function (x) { return { id: nid('c'), hex: x[0], role: x[1], label: '' }; }); }
    function start(id) {
      seq = 0; selId = null; selPair = null; hueMemo = {}; sceneAll = false; ryb = [1, 1, 0]; mixA = mixB = null;
      if (id === 'empty') { S = emptyDoc(); setViewSilently('wheel'); refresh(); return; }
      var P = function (name, time, list) { return { id: nid('p'), name: name, time: time, colors: mk(list) }; };
      if (id === 'rainbow') {
        S = { v: 1, cur: 0, challenge: 'rainbow', palettes: [P(t('exRainbow'), 'day', [['#e53935', 'main'], ['#fb8c00', 'free'], ['#fdd835', 'accent'], ['#43a047', 'background'], ['#1e88e5', 'sky'], ['#3949ab', 'text'], ['#8e24aa', 'free']])] };
        mixA = S.palettes[0].colors[0].id; mixB = S.palettes[0].colors[2].id; setViewSilently('mix');
      } else if (id === 'game') {
        S = { v: 1, cur: 0, challenge: 'game', palettes: [P(t('exGame'), 'night', [['#141a2e', 'background'], ['#23305a', 'sky'], ['#7c5cff', 'main'], ['#2de2c4', 'accent'], ['#f2f4ff', 'text']])] };
        setViewSilently('scene');
      } else if (id === 'brand') {
        S = { v: 1, cur: 0, challenge: 'brand', palettes: [P(t('exBrand'), 'day', [['#ffffff', 'background'], ['#1c2430', 'text'], ['#0b6e69', 'main'], ['#d9480f', 'accent'], ['#e3f1ef', 'sky']])] };
        selId = S.palettes[0].colors[2].id; setViewSilently('wheel');
      } else if (id === 'daynight') {
        S = { v: 1, cur: 0, challenge: 'daynight', palettes: [P(t('exDay'), 'day', [['#8fd0f4', 'sky'], ['#efe3c8', 'background'], ['#c8553d', 'main'], ['#ffc933', 'accent'], ['#2b2d42', 'text']])] };
        setViewSilently('scene');
      } else {
        S = { v: 1, cur: 0, challenge: 'five', palettes: [P(t('exFive'), 'day', [['#fbf6ec', 'background'], ['#1b2a3a', 'text'], ['#2f6f4f', 'main'], ['#e8a33d', 'accent'], ['#bfe0f5', 'sky']])] };
        setViewSilently('contrast');
      }
      refresh();
    }
    function setViewSilently(v) { view = v; ctx.selectTool(v); }
    if (root.ResizeObserver) { var roT = 0; new ResizeObserver(function () { clearTimeout(roT); roT = setTimeout(function () { if (view === 'wheel') renderWheel(); }, 60); }).observe(vp); }

    ctx.setTech('renderer', 'Canvas 2D · SVG');
    return {
      serialize: function () { var c = JSON.parse(JSON.stringify(S)); c.seq = seq; return c; },
      restore: function (st) { S = JSON.parse(JSON.stringify(st)); seq = Math.max(seq, st.seq || 0); delete S.seq; S.cur = clamp(S.cur | 0, 0, S.palettes.length - 1); if (!sel()) selId = null; if (selPair && (!byId(selPair.fg) || !byId(selPair.bg))) selPair = null; refresh(); },
      validate: function (d) {
        if (!d || !Array.isArray(d.palettes) || !d.palettes.length || d.palettes.length > MAXP) return false;
        if (d.challenge != null && ['five', 'daynight', 'rainbow', 'game', 'brand'].indexOf(d.challenge) < 0) return false;
        return d.palettes.every(function (p) {
          return p && typeof p.id === 'string' && typeof p.name === 'string' && p.name.length <= 60 && (p.time === 'day' || p.time === 'night') && Array.isArray(p.colors) && p.colors.length <= MAXC &&
            p.colors.every(function (c) { return c && typeof c.id === 'string' && /^#[0-9a-f]{6}$/.test(c.hex) && ROLES.indexOf(c.role) >= 0 && (c.label == null || (typeof c.label === 'string' && c.label.length <= 60)); });
        });
      },
      start: start,
      onTool: function (id) { if (VIEWS.indexOf(id) < 0) return; view = id; if (S) { renderView(); ctx.setSummary(summary()); } },
      onKey: onKey
    };
  }
})(window);
