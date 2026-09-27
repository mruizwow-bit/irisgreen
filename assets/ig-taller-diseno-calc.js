/* Iris Green · El taller · cálculo del estudio de diseño gráfico: color, contraste (WCAG 2.2),
   geometría de las formas, color real bajo cada texto y comprobación de retos. */
(function (root) {
  'use strict';
  var FORMATS = { cartel: { w: 420, h: 594 }, tarjeta: { w: 340, h: 220 }, logo: { w: 400, h: 400 }, senal: { w: 800, h: 400 }, pantalla: { w: 960, h: 540 } };
  var FONTS = {
    atkinson: '"Atkinson Hyperlegible", Arial, sans-serif', newsreader: 'Newsreader, Georgia, serif',
    sans: 'Arial, Helvetica, sans-serif', serif: 'Georgia, "Times New Roman", serif', mono: '"Courier New", Courier, monospace'
  };
  var PALETTE = [['negro', '#1b1f24'], ['blanco', '#ffffff'], ['marino', '#17395c'], ['azul', '#1f6fb2'], ['turquesa', '#0f7c7a'], ['verde', '#2e7d32'], ['amarillo', '#f2c230'],
    ['naranja', '#d9651b'], ['rojo', '#b3261e'], ['magenta', '#a8336f'], ['violeta', '#5b3fa0'], ['gris', '#6b7280'], ['grisclaro', '#e5e7eb'], ['crema', '#f7f1e3']];

  /* ---------- Color ---------- */
  function norm(hex) {
    var m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(hex || '').trim()); if (!m) return null;
    var s = m[1].toLowerCase(); if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
    return '#' + s;
  }
  function rgb(hex) { hex = norm(hex) || '#000000'; return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]; }
  function hex(c) { return '#' + c.map(function (v) { v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? '0' : '') + v.toString(16); }).join(''); }
  function lum(c) {
    if (typeof c === 'string') c = rgb(c);
    var a = c.map(function (v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }
  function contrast(a, b) { var la = lum(a), lb = lum(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); }
  function mix(under, over, alpha) { var u = rgb(under), o = rgb(over); return hex([0, 1, 2].map(function (i) { return u[i] * (1 - alpha) + o[i] * alpha; })); }
  function isLarge(el) { return el.size >= 24 || (el.weight >= 700 && el.size >= 18.66); }
  function need(el, level) { var big = isLarge(el); return level === 'AAA' ? (big ? 4.5 : 7) : (big ? 3 : 4.5); }

  /* ---------- Geometría ---------- */
  function polyPoints(el) { /* puntos en coordenadas locales (centro en 0,0), escalados al recuadro */
    var pts = [], i, w = el.w / 2, h = el.h / 2;
    if (el.type === 'poly') { var n = Math.max(3, Math.min(12, el.sides || 3)); for (i = 0; i < n; i++) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; pts.push([Math.cos(a) * w, Math.sin(a) * h]); } }
    else if (el.type === 'star') { var p = Math.max(3, Math.min(12, el.sides || 5)), inner = el.inner || 0.45; for (i = 0; i < p * 2; i++) { var b = -Math.PI / 2 + i * Math.PI / p, r = i % 2 ? inner : 1; pts.push([Math.cos(b) * w * r, Math.sin(b) * h * r]); } }
    else if (el.type === 'arrow') { pts = [[-w, -h * 0.35], [w * 0.1, -h * 0.35], [w * 0.1, -h], [w, 0], [w * 0.1, h], [w * 0.1, h * 0.35], [-w, h * 0.35]]; }
    return pts;
  }
  function toLocal(el, px, py) {
    var cx = el.x + el.w / 2, cy = el.y + el.h / 2, a = -(el.rot || 0) * Math.PI / 180, dx = px - cx, dy = py - cy;
    return [dx * Math.cos(a) - dy * Math.sin(a), dx * Math.sin(a) + dy * Math.cos(a)];
  }
  function inPoly(pts, x, y) {
    var ins = false; for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) { var a = pts[i], b = pts[j]; if (((a[1] > y) !== (b[1] > y)) && (x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0])) ins = !ins; }
    return ins;
  }
  /* ¿El punto cae sobre el relleno de la forma? */
  function fills(el, px, py) {
    if (el.type === 'text' || el.type === 'line' || !el.fill || el.fill === 'none') return false;
    var l = toLocal(el, px, py), w = el.w / 2, h = el.h / 2;
    if (el.type === 'rect') return Math.abs(l[0]) <= w && Math.abs(l[1]) <= h;
    if (el.type === 'ellipse') return w > 0 && h > 0 && (l[0] * l[0]) / (w * w) + (l[1] * l[1]) / (h * h) <= 1;
    return inPoly(polyPoints(el), l[0], l[1]);
  }
  /* Selección: incluye los trazos y el recuadro de los textos. */
  function hits(el, px, py, tol) {
    tol = tol || 4;
    var l = toLocal(el, px, py), w = el.w / 2, h = el.h / 2;
    if (el.type === 'line') { var x1 = -w, y1 = -h, x2 = w, y2 = h, dx = x2 - x1, dy = y2 - y1, L = dx * dx + dy * dy, tt = L ? Math.max(0, Math.min(1, ((l[0] - x1) * dx + (l[1] - y1) * dy) / L)) : 0; return Math.hypot(l[0] - (x1 + tt * dx), l[1] - (y1 + tt * dy)) <= Math.max(tol, (el.sw || 1) / 2 + 2); }
    return Math.abs(l[0]) <= w + tol && Math.abs(l[1]) <= h + tol;
  }
  function textLines(el) { return String(el.text || '').split('\n').slice(0, 20); }
  function textHeight(el) { return Math.max(1, textLines(el).length) * el.size * (el.lh || 1.2); }
  function fontCss(el) { return (el.italic ? 'italic ' : '') + (el.weight || 400) + ' ' + el.size + 'px ' + (FONTS[el.font] || FONTS.atkinson); }

  /* Color que se ve en un punto: el fondo y encima cada forma, en orden, con su opacidad. */
  function colourAt(doc, px, py, upTo) {
    var c = doc.bg || '#ffffff', els = doc.els;
    for (var i = 0; i < Math.min(upTo, els.length); i++) { var e = els[i]; if (fills(e, px, py)) c = mix(c, e.fill, e.op === undefined ? 1 : e.op); }
    return c;
  }
  /* Contraste de un texto: el peor de nueve puntos de su recuadro. */
  function textContrast(doc, idx) {
    var el = doc.els[idx], th = textHeight(el), worst = Infinity, under = null, cx = el.x + el.w / 2, cy = el.y + th / 2, a = (el.rot || 0) * Math.PI / 180;
    [-0.42, 0, 0.42].forEach(function (fx) { [-0.35, 0, 0.35].forEach(function (fy) {
      var lx = fx * el.w, ly = fy * th, px = cx + lx * Math.cos(a) - ly * Math.sin(a), py = cy + lx * Math.sin(a) + ly * Math.cos(a);
      var bgc = colourAt(doc, px, py, idx), fg = mix(bgc, el.fill, el.op === undefined ? 1 : el.op), r = contrast(fg, bgc);
      if (r < worst) { worst = r; under = bgc; }
    }); });
    return { ratio: worst, bg: under, large: isLarge(el), aa: worst >= need(el, 'AA') - 1e-9, aaa: worst >= need(el, 'AAA') - 1e-9 };
  }
  function coloursUsed(doc) {
    var set = {}; set[norm(doc.bg) || '#ffffff'] = 1;
    doc.els.forEach(function (e) {
      if (e.fill && e.fill !== 'none' && e.type !== 'line') set[norm(e.fill)] = 1;
      if (e.stroke && e.stroke !== 'none' && (e.sw || 0) > 0) set[norm(e.stroke)] = 1;
      if (e.type === 'line' && e.stroke) set[norm(e.stroke)] = 1;
    });
    return Object.keys(set);
  }

  /* ---------- Retos ---------- */
  function check(doc, R) {
    var out = [], texts = [], shapes = [];
    doc.els.forEach(function (e, i) { (e.type === 'text' ? texts : shapes).push(i); });
    function add(ok, key, vars) { out.push({ ok: !!ok, key: key, vars: vars || {} }); }
    if (R.format) add(doc.format === R.format, 'format', { f: R.format });
    if (R.minTexts) add(texts.length >= R.minTexts, 'minTexts', { m: R.minTexts, n: texts.length });
    if (R.maxShapes !== undefined) add(shapes.length <= R.maxShapes && shapes.length >= 1, 'maxShapes', { m: R.maxShapes, n: shapes.length });
    if (R.minShapes) add(shapes.length >= R.minShapes, 'minShapes', { m: R.minShapes, n: shapes.length });
    var cols = coloursUsed(doc).length;
    if (R.maxColours) add(cols <= R.maxColours, 'maxColours', { m: R.maxColours, n: cols });
    if (R.minColours) add(cols >= R.minColours, 'minColours', { m: R.minColours, n: cols });
    if (R.bigText) add(texts.some(function (i) { return doc.els[i].size >= R.bigText; }), 'bigText', { m: R.bigText });
    if (R.minSize) add(texts.length && texts.every(function (i) { return doc.els[i].size >= R.minSize; }), 'minSize', { m: R.minSize });
    if (R.hierarchy && texts.length) { var sz = texts.map(function (i) { return doc.els[i].size; }), mx = Math.max.apply(null, sz), mn = Math.min.apply(null, sz); add(mx >= R.hierarchy * mn, 'hierarchy', { m: R.hierarchy }); }
    if (R.aligned) {
      var ok = texts.length >= 2 && ['left', 'centre', 'right'].some(function (k) {
        var v = texts.map(function (i) { var e = doc.els[i]; var al = e.align || 'left'; return k === 'left' ? (al === 'left' ? e.x : NaN) : k === 'right' ? (al === 'right' ? e.x + e.w : NaN) : (al === 'center' ? e.x + e.w / 2 : NaN); });
        return v.every(function (x) { return isFinite(x) && Math.abs(x - v[0]) <= 1; });
      });
      add(ok, 'aligned');
    }
    if (R.needArrow) add(shapes.some(function (i) { return doc.els[i].type === 'arrow'; }), 'needArrow');
    if (R.inside !== false) add(doc.els.every(function (e) { var f = FORMATS[doc.format] || FORMATS.cartel; var h = e.type === 'text' ? textHeight(e) : e.h; return e.x >= -1 && e.y >= -1 && e.x + e.w <= f.w + 1 && e.y + h <= f.h + 1; }), 'inside');
    if (R.contrast) {
      var bad = texts.filter(function (i) { var r = textContrast(doc, i); return R.contrast === 'AAA' ? !r.aaa : !r.aa; });
      add(texts.length && !bad.length, R.contrast === 'AAA' ? 'contrastAAA' : 'contrastAA', { n: bad.length });
    }
    return { ok: out.every(function (x) { return x.ok; }), items: out };
  }
  function randomBrief(seed) {
    var s = (seed >>> 0) || 7, pick = function (a) { s = (s * 1103515245 + 12345) >>> 0; return a[(s >>> 8) % a.length]; };
    var format = pick(['cartel', 'tarjeta', 'logo', 'senal', 'pantalla']);
    var R = { format: format, maxColours: pick([2, 3, 3, 4]), minTexts: pick([1, 2, 3]), contrast: pick(['AA', 'AA', 'AAA']) };
    R.bigText = { cartel: 48, tarjeta: 22, logo: 40, senal: 72, pantalla: 56 }[format];
    return { rules: R, theme: pick([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) };
  }

  var API = { FORMATS: FORMATS, FONTS: FONTS, PALETTE: PALETTE, norm: norm, rgb: rgb, hex: hex, lum: lum, contrast: contrast, mix: mix, isLarge: isLarge, need: need,
    polyPoints: polyPoints, toLocal: toLocal, fills: fills, hits: hits, textLines: textLines, textHeight: textHeight, fontCss: fontCss,
    colourAt: colourAt, textContrast: textContrast, coloursUsed: coloursUsed, check: check, randomBrief: randomBrief };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.IGTDis = API;
})(typeof window !== 'undefined' ? window : this);
