/* Iris Green · El taller · Estudio de moda y textil (R43).
   Estampados: motivo de formas y trazos editables, repeticiones recta, media gota, ladrillo y espejo,
   escala real en centímetros y hasta 4 combinaciones de color. Prendas: dibujos técnicos planos
   originales (delante y detrás) con zonas que se rellenan de color o de estampado. Colección de hasta
   8 looks con su «línea». Patronaje real: bolsa tote con medidas editables, piezas a escala 1:1
   impresas en A4 troceadas con marcas de unión y cuadrado de prueba de 5 cm. Todo es SVG propio. */
(function (root) {
  'use strict';
  var IG = root.IGSuite, D = root.document; if (!IG) return;
  var LANG = IG.lang, NS = 'http://www.w3.org/2000/svg';
  var MAX_PRINTS = 6, MAX_SHAPES = 60, MAX_LOOKS = 8, MAX_CW = 4;
  var SHAPES = ['circle', 'rect', 'triangle', 'diamond', 'star', 'leaf', 'drop', 'heart', 'ring', 'line', 'wave', 'zigzag'];
  var STROKES = { ring: 1, line: 1, wave: 1, zigzag: 1, pen: 1 };
  var REPEATS = ['straight', 'halfdrop', 'brick', 'mirror'];
  var KINDS = ['tshirt', 'hoodie', 'skirt', 'dress', 'trousers', 'tote', 'beanie', 'jacket'];
  var SWATCHES = ['#17395c', '#1f5f8b', '#6fa8dc', '#0b8f8f', '#2e7d32', '#9bc67a', '#e0b000', '#f6e27a', '#d86b00', '#b3261e', '#c27ba0', '#5a49a8', '#8a5a3c', '#d9cbb4', '#7d8b99', '#101820', '#ffffff', '#f4efe6'];
  var PW = 190, PH = 277; /* zona útil de una hoja A4 con márgenes de 8 mm, en mm */

  IG.defineEngine('moda', {
    version: 1, fileBase: LANG === 'en' ? 'fashion' : 'moda', historyLimit: 150,
    extraKeys: ['kModMotif', 'kModGarment'],
    initialStart: function (para) { return { child: 'dots', teen: 'hoodie', adult: 'capsule' }[para] || 'motif'; },
    starts: function (ctx) {
      var t = ctx.t;
      return [
        { id: 'motif', title: t('stMotif'), desc: t('stMotifD'), para: 'any' },
        { id: 'dots', title: t('stDots'), desc: t('stDotsD'), para: 'child' },
        { id: 'hoodie', title: t('stHoodie'), desc: t('stHoodieD'), para: 'teen' },
        { id: 'capsule', title: t('stCapsule'), desc: t('stCapsuleD'), para: 'adult' },
        { id: 'tote', title: t('stTote'), desc: t('stToteD'), para: 'any' }
      ];
    },
    create: function (ctx) { return studio(ctx); }
  });

  /* ---------- Utilidades SVG ---------- */
  function f2(v) { return Math.round(v * 100) / 100; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  /* Camino simétrico: se da la mitad derecha (x ≥ 0) desde el eje hasta el eje; la izquierda es su espejo. */
  function sym(right) {
    var d = 'M' + right[0][0] + ',' + right[0][1];
    for (var i = 1; i < right.length; i++) { var s = right[i]; d += s.length === 4 ? 'Q' + s[0] + ',' + s[1] + ' ' + s[2] + ',' + s[3] : 'L' + s[0] + ',' + s[1]; }
    for (var j = right.length - 1; j >= 1; j--) { var sg = right[j], prev = right[j - 1], px = prev.length === 4 ? prev[2] : prev[0], py = prev.length === 4 ? prev[3] : prev[1]; d += sg.length === 4 ? 'Q' + (-sg[0]) + ',' + sg[1] + ' ' + (-px) + ',' + py : 'L' + (-px) + ',' + py; }
    return d + 'Z';
  }
  /* Espejo de un camino absoluto (M, L, Q, C, Z): x → −x. */
  function mirror(d) { return d.replace(/([MLQCZ])([^MLQCZ]*)/g, function (m, c, a) { var n = a.trim() ? a.trim().split(/[\s,]+/).map(Number) : []; return c + n.map(function (v, i) { return i % 2 ? v : -v; }).join(','); }); }
  function both(d) { return d + ' ' + mirror(d); }

  /* ---------- Dibujos técnicos planos (originales, en cm). Zonas de atrás hacia delante. ---------- */
  var G = {};
  (function () {
    var tBody = [[0, 9], [7, 8.5, 8, 0], [21, 3], [20, 15, 25, 22], [25, 68], [0, 68]], tBodyB = [[0, 2.5], [6, 2.4, 8, 0], [21, 3], [20, 15, 25, 22], [25, 68], [0, 68]];
    var tSleeve = 'M21,3 L34,14 L27.4,24 L25,22 Q20,15 21,3 Z';
    G.tshirt = {
      zones: ['body', 'sleeves', 'neck', 'pocket'], box: [-36, -2, 72, 72],
      front: [{ z: 'body', d: 'M-8,0 Q0,3 8,0 L8,1 Q0,5 -8,1Z', shade: 0.25 }, { z: 'sleeves', d: both(tSleeve) }, { z: 'body', d: sym(tBody) }, { z: 'neck', d: sym([[0, 9], [7, 8.5, 8, 0], [10, 0.4], [9.3, 10.6, 0, 11.3]]) }, { z: 'pocket', d: 'M9,20 L17,20 L17,27 Q13,29 9,27 Z' }],
      back: [{ z: 'sleeves', d: both(tSleeve) }, { z: 'body', d: sym(tBodyB) }, { z: 'neck', d: sym([[0, 2.5], [6, 2.4, 8, 0], [10, 0.4], [8.6, 4.4, 0, 4.6]]) }],
      stitch: ['M-24.6,65.5 L24.6,65.5', 'M33,15 L26.6,22.7', 'M-33,15 L-26.6,22.7'], stitchB: ['M-24.6,65.5 L24.6,65.5', 'M33,15 L26.6,22.7', 'M-33,15 L-26.6,22.7']
    };
    var hBody = [[0, 6], [6, 5.5, 9, 0], [23, 4], [23, 16, 28, 26], [28, 64], [0, 64]], hBodyB = [[0, 2], [6, 2, 9, 0], [23, 4], [23, 16, 28, 26], [28, 64], [0, 64]];
    var hSleeve = 'M23,4 Q29,5 31,8 L40,56 L33.5,58 L28,26 Q23,16 23,4 Z', hCuff = 'M40,56 L33.5,58 L34.4,63.5 L40.8,61.6 Z';
    G.hoodie = {
      zones: ['body', 'sleeves', 'hood', 'rib', 'pocket'], box: [-43, -24, 86, 96],
      front: [{ z: 'hood', d: sym([[0, -21], [12, -21, 13, -6], [11, 3], [0, 5]]) }, { z: 'hood', d: sym([[0, -17], [8, -16.5, 9, -5], [6.5, 4], [0, 6]]), shade: 0.3 },
        { z: 'sleeves', d: both(hSleeve) }, { z: 'rib', d: both(hCuff) }, { z: 'body', d: sym(hBody) }, { z: 'rib', d: sym([[0, 64], [28, 64], [27.2, 70], [0, 70]]) },
        { z: 'pocket', d: sym([[0, 38], [12, 38], [17, 48], [17, 58], [0, 58]]) }],
      back: [{ z: 'sleeves', d: both(hSleeve) }, { z: 'rib', d: both(hCuff) }, { z: 'body', d: sym(hBodyB) }, { z: 'rib', d: sym([[0, 64], [28, 64], [27.2, 70], [0, 70]]) },
        { z: 'hood', d: sym([[0, -20], [12, -20, 13, -6], [11, 4], [5, 15], [0, 17]]) }],
      stitch: ['M3,6 L3.6,17', 'M-3,6 L-3.6,17', 'M11.3,38.8 L16.2,48.2', 'M-11.3,38.8 L-16.2,48.2'], stitchB: ['M0,-19.5 L0,16']
    };
    G.skirt = {
      zones: ['waistband', 'body', 'hem', 'pocket'], box: [-31, -2, 62, 68],
      front: [{ z: 'body', d: sym([[0, 5], [18, 5], [26, 55], [13, 57, 0, 57.5]]) }, { z: 'hem', d: sym([[0, 57.5], [13, 57, 26, 55], [27, 61], [13.5, 63, 0, 63.5]]) },
        { z: 'waistband', d: sym([[0, 0], [18, 0], [18, 5], [0, 5]]) }, { z: 'pocket', d: both('M10,5 L18,5 L19.3,14 Q13,13 10,5 Z') }],
      back: [{ z: 'body', d: sym([[0, 5], [18, 5], [26, 55], [13, 57, 0, 57.5]]) }, { z: 'hem', d: sym([[0, 57.5], [13, 57, 26, 55], [27, 61], [13.5, 63, 0, 63.5]]) },
        { z: 'waistband', d: sym([[0, 0], [18, 0], [18, 5], [0, 5]]) }],
      stitch: ['M-7,5 L-8,40', 'M7,5 L8,40'], stitchB: ['M0,5 L0,22', 'M-9,5 L-9.4,14', 'M9,5 L9.4,14'], dots: [[0, 2.5]]
    };
    var dBod = [[0, 10], [6, 9, 8, 0], [14, 0.5], [14, 9, 19, 17], [16, 30], [0, 30]], dBodB = [[0, 3], [6, 3, 8, 0], [14, 0.5], [14, 9, 19, 17], [16, 30], [0, 30]];
    var dSleeve = 'M14,0.5 L22,5.5 L21.5,14 L19,17 Q14,9 14,0.5 Z', dSkirt = [[0, 30], [16, 30], [28, 90], [14, 92, 0, 92.5]];
    G.dress = {
      zones: ['bodice', 'skirt', 'sleeves', 'neck', 'belt'], box: [-31, -2, 62, 97],
      front: [{ z: 'sleeves', d: both(dSleeve) }, { z: 'skirt', d: sym(dSkirt) }, { z: 'bodice', d: sym(dBod) }, { z: 'neck', d: sym([[0, 10], [6, 9, 8, 0], [9.6, 0.2], [7.6, 11, 0, 11.9]]) }, { z: 'belt', d: sym([[0, 29], [16.1, 29], [16.3, 32.5], [0, 32.5]]) }],
      back: [{ z: 'sleeves', d: both(dSleeve) }, { z: 'skirt', d: sym(dSkirt) }, { z: 'bodice', d: sym(dBodB) }, { z: 'neck', d: sym([[0, 3], [6, 3, 8, 0], [9.6, 0.2], [7.6, 4.5, 0, 4.6]]) }, { z: 'belt', d: sym([[0, 29], [16.1, 29], [16.3, 32.5], [0, 32.5]]) }],
      stitch: ['M-6,32.5 L-10,90', 'M6,32.5 L10,90', 'M-26.8,88 Q0,91 26.8,88'], stitchB: ['M0,4.6 L0,48', 'M-26.8,88 Q0,91 26.8,88']
    };
    var leg = 'M0.2,5 L21,5 Q23.5,35 22,98 L4,98 L1.2,26 Q0.8,24 0.2,23 Z', cuff = 'M4,98 L22,98 L22.2,103 L4.1,103 Z';
    G.trousers = {
      zones: ['legs', 'waistband', 'pocket', 'cuffs'], box: [-26, -2, 52, 107],
      front: [{ z: 'legs', d: both(leg) }, { z: 'cuffs', d: both(cuff) }, { z: 'waistband', d: sym([[0, 0], [21, 0], [21, 5], [0, 5]]) }, { z: 'pocket', d: both('M14,5 L21,5 L21.7,16 Q16,14 14,5 Z') }],
      back: [{ z: 'legs', d: both(leg) }, { z: 'cuffs', d: both(cuff) }, { z: 'waistband', d: sym([[0, 0], [21, 0], [21, 5], [0, 5]]) }, { z: 'pocket', d: both('M6,12 L16,12 L16,23 Q11,26 6,23 Z') }],
      stitch: ['M0,5 Q2.8,14 0.4,21', 'M11,5 L11.5,40', 'M-11,5 L-11.5,40'], stitchB: ['M0,5 L0,23', 'M-6,9 L-16,9', 'M6,9 L16,9'], dots: [[0, 2.5]]
    };
    var handles = 'M-11,30 L-11,18 Q-11,2 0,2 Q11,2 11,18 L11,30 L8,30 L8,18 Q8,5 0,5 Q-8,5 -8,18 L-8,30 Z';
    G.tote = {
      zones: ['body', 'handles', 'pocket'], box: [-22, 0, 44, 75],
      front: [{ z: 'handles', d: handles }, { z: 'body', d: sym([[0, 28], [19, 28], [19, 72], [0, 72]]) }, { z: 'pocket', d: sym([[0, 42], [8, 42], [8, 58], [0, 58]]) }],
      back: [{ z: 'handles', d: handles }, { z: 'body', d: sym([[0, 28], [19, 28], [19, 72], [0, 72]]) }],
      stitch: ['M-18.5,31 L18.5,31', 'M-9.5,28 L-9.5,34 M9.5,28 L9.5,34', 'M-7.4,43 L7.4,43'], stitchB: ['M-18.5,31 L18.5,31']
    };
    G.beanie = {
      zones: ['crown', 'brim', 'pompom'], box: [-22, -12, 44, 52],
      front: [{ z: 'pompom', d: 'M0,-9 A5.5,5.5 0 1,0 0.01,-9 Z' }, { z: 'crown', d: sym([[0, 0], [15, 0.5, 17.5, 18], [18, 28], [0, 28]]) }, { z: 'brim', d: sym([[0, 27], [19.2, 27], [19.2, 38], [0, 38]]) }],
      back: [{ z: 'pompom', d: 'M0,-9 A5.5,5.5 0 1,0 0.01,-9 Z' }, { z: 'crown', d: sym([[0, 0], [15, 0.5, 17.5, 18], [18, 28], [0, 28]]) }, { z: 'brim', d: sym([[0, 27], [19.2, 27], [19.2, 38], [0, 38]]) }],
      stitch: ['M-15,29 L-15,36', 'M-10,29 L-10,36', 'M-5,29 L-5,36', 'M0,29 L0,36', 'M5,29 L5,36', 'M10,29 L10,36', 'M15,29 L15,36', 'M0,0.5 L0,26'],
      stitchB: ['M-15,29 L-15,36', 'M-10,29 L-10,36', 'M-5,29 L-5,36', 'M0,29 L0,36', 'M5,29 L5,36', 'M10,29 L10,36', 'M15,29 L15,36', 'M0,0.5 L0,26']
    };
    var jBody = [[0, 16], [4, 4], [9, 0], [21, 3], [20, 15, 25, 22], [25, 68], [0, 68]], jSleeve = 'M21,3 Q27,4 29,7 L37,60 L30.5,61.5 L25,22 Q20,15 21,3 Z';
    G.jacket = {
      zones: ['body', 'sleeves', 'collar', 'pocket'], box: [-40, -2, 80, 72],
      front: [{ z: 'body', d: 'M-9,0 Q0,3 9,0 L4,4 L0,16 L-4,4 Z', shade: 0.3 }, { z: 'sleeves', d: both(jSleeve) }, { z: 'body', d: sym(jBody) },
        { z: 'collar', d: both('M9,0 L13,2 L6.5,15 L0.6,17 L4,4 Z') }, { z: 'pocket', d: both('M8,44 L19,44 L19,48 L8,48 Z') }],
      back: [{ z: 'sleeves', d: both(jSleeve) }, { z: 'body', d: sym([[0, 2], [6, 2, 9, 0], [21, 3], [20, 15, 25, 22], [25, 68], [0, 68]]) }, { z: 'collar', d: sym([[0, -1], [9, -1], [11, 2], [0, 4]]) }],
      stitch: ['M0,16 L0,68', 'M-24.6,65.5 L24.6,65.5'], stitchB: ['M-24.6,65.5 L24.6,65.5', 'M0,4 L0,68'], dots: [[-1.6, 24], [-1.6, 36], [-1.6, 48], [-1.6, 60]]
    };
  })();

  /* ---------- Motivos: formas en unidades de azulejo (0 a 100) ---------- */
  function shapeSvg(s, cols, sel) {
    var col = s.c ? cols.c[s.c - 1] : cols.bg, w = s.w, h = s.h, sw = s.sw || 4, body = '', stroke = !!STROKES[s.type];
    switch (s.type) {
      case 'circle': body = '<ellipse rx="' + f2(w / 2) + '" ry="' + f2(h / 2) + '"/>'; break;
      case 'rect': body = '<rect x="' + f2(-w / 2) + '" y="' + f2(-h / 2) + '" width="' + f2(w) + '" height="' + f2(h) + '" rx="' + f2(Math.min(w, h) / 2 * (s.round || 0) / 100) + '"/>'; break;
      case 'triangle': body = '<polygon points="0,' + f2(-h / 2) + ' ' + f2(w / 2) + ',' + f2(h / 2) + ' ' + f2(-w / 2) + ',' + f2(h / 2) + '"/>'; break;
      case 'diamond': body = '<polygon points="0,' + f2(-h / 2) + ' ' + f2(w / 2) + ',0 0,' + f2(h / 2) + ' ' + f2(-w / 2) + ',0"/>'; break;
      case 'star': { var pts = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 0.45 : 1; pts.push(f2(Math.cos(a) * r * w / 2) + ',' + f2(Math.sin(a) * r * h / 2)); } body = '<polygon points="' + pts.join(' ') + '"/>'; break; }
      case 'leaf': body = '<path d="M0,' + f2(-h / 2) + ' Q' + f2(w * 0.62) + ',0 0,' + f2(h / 2) + ' Q' + f2(-w * 0.62) + ',0 0,' + f2(-h / 2) + 'Z"/>'; break;
      case 'drop': body = '<path d="M0,' + f2(-h / 2) + ' C' + f2(w * 0.1) + ',' + f2(-h * 0.2) + ' ' + f2(w / 2) + ',' + f2(0) + ' ' + f2(w / 2) + ',' + f2(h * 0.18) + ' A' + f2(w / 2) + ',' + f2(h * 0.32) + ' 0 0,1 ' + f2(-w / 2) + ',' + f2(h * 0.18) + ' C' + f2(-w / 2) + ',0 ' + f2(-w * 0.1) + ',' + f2(-h * 0.2) + ' 0,' + f2(-h / 2) + 'Z"/>'; break;
      case 'heart': body = '<path d="M0,' + f2(h * 0.45) + ' C' + f2(-w * 0.7) + ',' + f2(-h * 0.05) + ' ' + f2(-w * 0.35) + ',' + f2(-h * 0.62) + ' 0,' + f2(-h * 0.22) + ' C' + f2(w * 0.35) + ',' + f2(-h * 0.62) + ' ' + f2(w * 0.7) + ',' + f2(-h * 0.05) + ' 0,' + f2(h * 0.45) + 'Z"/>'; break;
      case 'ring': body = '<ellipse rx="' + f2(Math.max(0.5, w / 2 - sw / 2)) + '" ry="' + f2(Math.max(0.5, h / 2 - sw / 2)) + '"/>'; break;
      case 'line': body = '<path d="M' + f2(-w / 2) + ',0 L' + f2(w / 2) + ',0"/>'; break;
      case 'wave': case 'zigzag': {
        var n = Math.max(1, s.n || 2), d = 'M' + f2(-w / 2) + ',0';
        if (s.type === 'zigzag') { for (var k = 0; k < n * 2; k++) d += ' L' + f2(-w / 2 + (k + 0.5) * w / (n * 2)) + ',' + f2(k % 2 ? h / 2 : -h / 2); d += ' L' + f2(w / 2) + ',0'; }
        else { for (var q = 0; q < n; q++) { var x0 = -w / 2 + q * w / n; d += ' C' + f2(x0 + w / n * 0.3) + ',' + f2(-h * 0.66) + ' ' + f2(x0 + w / n * 0.2) + ',' + f2(-h * 0.66) + ' ' + f2(x0 + w / n / 2) + ',0'; d += ' C' + f2(x0 + w / n * 0.8) + ',' + f2(h * 0.66) + ' ' + f2(x0 + w / n * 0.7) + ',' + f2(h * 0.66) + ' ' + f2(x0 + w / n) + ',0'; } }
        body = '<path d="' + d + '"/>'; break;
      }
      case 'pen': {
        var p = s.pts || [];
        /* trazo a mano: cada tramo con su grosor (presión del lápiz si la hubo) */
        for (var m = 1; m < p.length; m++) body += '<path d="M' + f2(p[m - 1][0] * w) + ',' + f2(p[m - 1][1] * h) + ' L' + f2(p[m][0] * w) + ',' + f2(p[m][1] * h) + '" stroke-width="' + f2(sw * (p[m][2] || 1)) + '"/>';
        break;
      }
    }
    var paint = stroke ? 'fill="none" stroke="' + col + '" stroke-width="' + f2(sw) + '" stroke-linecap="round" stroke-linejoin="round"' : 'fill="' + col + '"';
    var op = s.op != null && s.op < 100 ? ' opacity="' + f2(s.op / 100) + '"' : '';
    return '<g transform="translate(' + f2(s.x) + ',' + f2(s.y) + ') rotate(' + f2(s.rot || 0) + ')" ' + paint + op + (sel ? ' data-shape="' + s.id + '"' : '') + '>' + body + '</g>';
  }
  function repeatSpec(rep) {
    if (rep === 'halfdrop') return { cw: 200, ch: 100, base: [[0, 0, 1, 1], [100, 50, 1, 1]] };
    if (rep === 'brick') return { cw: 100, ch: 200, base: [[0, 0, 1, 1], [50, 100, 1, 1]] };
    if (rep === 'mirror') return { cw: 200, ch: 200, base: [[0, 0, 1, 1], [200, 0, -1, 1], [0, 200, 1, -1], [200, 200, -1, -1]] };
    return { cw: 100, ch: 100, base: [[0, 0, 1, 1]] };
  }
  /* Contenido de una celda repetible (en unidades de azulejo): fondo + todas las copias que la tocan. */
  function cellSvg(pr, cwIx, motifId) {
    var sp = repeatSpec(pr.repeat), out = '<rect width="' + sp.cw + '" height="' + sp.ch + '" fill="' + pr.colorways[cwIx].bg + '"/>';
    sp.base.forEach(function (b) {
      for (var i = -1; i <= 1; i++) for (var j = -1; j <= 1; j++) {
        out += '<use href="#' + motifId + '" transform="translate(' + (b[0] + i * sp.cw) + ',' + (b[1] + j * sp.ch) + ') scale(' + b[2] + ',' + b[3] + ')"/>';
      }
    });
    return out;
  }
  function motifDef(pr, cwIx, id) { return '<g id="' + id + '">' + pr.shapes.map(function (s) { return shapeSvg(s, pr.colorways[cwIx]); }).join('') + '</g>'; }

  /* ================================================================== */
  function studio(ctx) {
    var t = ctx.t, h = ctx.h, F = ctx.fields, vp = ctx.viewport;
    var S = null, seq = 0, view = 'motif', selShape = null, selZone = null, selPiece = null, penMode = false, shapeKind = 'circle';
    function nid(p) { seq += 1; return p + seq; }
    var host = h('div', { class: 'igmo-host', 'aria-hidden': 'true' }); vp.appendChild(host); vp.classList.add('igmo-viewport');
    ctx.setTech('renderer', 'SVG');
    ctx.toolbar.parentNode.appendChild(h('p', { class: 'igs-status-line igmo-status' }));

    function pr() { return S.prints[S.curPrint] || null; }
    function look() { return S.looks[S.curLook] || null; }
    function printById(id) { for (var i = 0; i < S.prints.length; i++) if (S.prints[i].id === id) return S.prints[i]; return null; }
    function shapeById(id) { var p = pr(); if (!p) return null; for (var i = 0; i < p.shapes.length; i++) if (p.shapes[i].id === id) return p.shapes[i]; return null; }
    function zoneName(z) { return t('zone_' + z); }

    /* ---------- Defs: motivos y patrones que usa lo que se dibuja ---------- */
    function patternDefs(uses, unitCm) {
      /* uses: {pid|cw: true}. unitCm: tamaño de 100 unidades de azulejo en la vista (null → escala del estampado, en cm) */
      var out = '';
      Object.keys(uses).forEach(function (key) {
        var parts = key.split('|'), p = printById(parts[0]), cw = +parts[1]; if (!p) return;
        cw = Math.min(cw, p.colorways.length - 1);
        var sp = repeatSpec(p.repeat), k = (unitCm || p.scale) / 100, mid = 'm-' + p.id + '-' + cw + (unitCm ? '-u' : '');
        out += motifDef(p, cw, mid);
        out += '<pattern id="pt-' + p.id + '-' + parts[1] + (unitCm ? '-u' : '') + '" patternUnits="userSpaceOnUse" width="' + f2(sp.cw * k) + '" height="' + f2(sp.ch * k) + '"><g transform="scale(' + k + ')">' + cellSvg(p, cw, mid) + '</g></pattern>';
      });
      return out;
    }
    function fillOf(f, uses) {
      if (f && f.t === 'print' && printById(f.p)) { var cw = Math.min(f.w || 0, printById(f.p).colorways.length - 1); uses[f.p + '|' + cw] = true; return 'url(#pt-' + f.p + '-' + cw + ')'; }
      return f && f.c ? f.c : '#ffffff';
    }
    /* Prenda plana (delante o detrás) en cm, con zonas seleccionables. */
    function garmentSvg(lk, side, uses, interactive) {
      var g = G[lk.kind], parts = g[side], out = '';
      parts.forEach(function (pt) {
        var fill = fillOf(lk.zones[pt.z], uses), sel = interactive && selZone === pt.z;
        out += '<path d="' + pt.d + '" fill="' + fill + '" stroke="#172b42" stroke-width="0.35" stroke-linejoin="round"' + (interactive ? ' data-zone="' + pt.z + '"' : '') + (sel ? ' class="igmo-selzone"' : '') + '/>';
        if (pt.shade) out += '<path d="' + pt.d + '" fill="#101820" opacity="' + pt.shade + '" pointer-events="none"/>';
      });
      (side === 'front' ? g.stitch : g.stitchB).forEach(function (d) { out += '<path d="' + d + '" fill="none" stroke="#172b42" stroke-width="0.18" stroke-dasharray="0.8 0.6" pointer-events="none"/>'; });
      if (side === 'front' && g.dots) g.dots.forEach(function (p) { out += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="0.9" fill="#f4efe6" stroke="#172b42" stroke-width="0.25" pointer-events="none"/>'; });
      if (interactive && selZone) parts.forEach(function (pt) { if (pt.z === selZone) out += '<path d="' + pt.d + '" fill="none" stroke="#5a49a8" stroke-width="0.9" stroke-dasharray="1.6 1" pointer-events="none"/>'; });
      return out;
    }

    /* ---------- Render de la vista ---------- */
    function draw() {
      var W = Math.max(200, vp.clientWidth), H = Math.max(160, vp.clientHeight), svg = '';
      if (view === 'motif') svg = motifView(W, H);
      else if (view === 'repeat') svg = repeatView(W, H);
      else if (view === 'garment') svg = garmentView(W, H);
      else if (view === 'line') svg = lineView(W, H, true);
      else svg = patternView(W, H);
      host.innerHTML = svg;
      ctx.setSummary(summary());
    }
    function emptyMsg(W, H, msg) { return '<svg xmlns="' + NS + '" width="' + W + '" height="' + H + '"><text x="' + W / 2 + '" y="' + H / 2 + '" text-anchor="middle" font-size="16" fill="#44586c" font-family="Atkinson Hyperlegible, system-ui, sans-serif">' + esc(msg) + '</text></svg>'; }
    function motifView(W, H) {
      var p = pr(); if (!p) return emptyMsg(W, H, t('noPrints'));
      var sp = repeatSpec(p.repeat), uses = {}; uses[p.id + '|' + p.cw] = true;
      var defs = patternDefs(uses, 100), shapes = p.shapes.map(function (s) { return shapeSvg(s, p.colorways[p.cw], true); }).join('');
      var sel = shapeById(selShape), selBox = '';
      if (sel) { var r = Math.max(sel.w, sel.h) / 2 + 3; selBox = '<g transform="translate(' + f2(sel.x) + ',' + f2(sel.y) + ') rotate(' + f2(sel.rot || 0) + ')" pointer-events="none"><rect x="' + f2(-sel.w / 2 - 3) + '" y="' + f2(-sel.h / 2 - 3) + '" width="' + f2(sel.w + 6) + '" height="' + f2(sel.h + 6) + '" fill="none" stroke="#ffffff" stroke-width="2.2" vector-effect="non-scaling-stroke"/><rect x="' + f2(-sel.w / 2 - 3) + '" y="' + f2(-sel.h / 2 - 3) + '" width="' + f2(sel.w + 6) + '" height="' + f2(sel.h + 6) + '" fill="none" stroke="#5a49a8" stroke-width="1.4" stroke-dasharray="5 3" vector-effect="non-scaling-stroke"/></g>'; void r; }
      return '<svg xmlns="' + NS + '" class="igmo-svg" width="' + W + '" height="' + H + '" viewBox="-70 -70 240 240" preserveAspectRatio="xMidYMid meet"><defs>' + defs + '</defs>' +
        '<rect x="-70" y="-70" width="240" height="240" fill="url(#pt-' + p.id + '-' + p.cw + '-u)"/><rect x="-70" y="-70" width="240" height="240" fill="#ffffff" opacity="0.55"/>' +
        '<rect x="0" y="0" width="100" height="100" fill="' + p.colorways[p.cw].bg + '" data-bg="1"/><svg x="-40" y="-40" width="180" height="180" viewBox="-40 -40 180 180" overflow="hidden"><g class="igmo-shapes">' + shapes + '</g></svg>' + selBox +
        '<rect x="0" y="0" width="100" height="100" fill="none" stroke="#17395c" stroke-width="1.5" stroke-dasharray="4 3" vector-effect="non-scaling-stroke" pointer-events="none"/>' +
        '<text x="0" y="-5" font-size="6" fill="#17395c" font-family="Atkinson Hyperlegible, system-ui, sans-serif" font-weight="700">' + esc(t('tileLabel', { cm: IG.num(p.scale, 1) })) + '</text>' +
        (sp.cw > 100 || sp.ch > 100 ? '<rect x="0" y="0" width="' + sp.cw + '" height="' + sp.ch + '" fill="none" stroke="#5a49a8" stroke-width="1" stroke-dasharray="2 3" vector-effect="non-scaling-stroke" pointer-events="none"/>' : '') + '</svg>';
    }
    function repeatView(W, H) {
      var p = pr(); if (!p) return emptyMsg(W, H, t('noPrints'));
      var uses = {}; p.colorways.forEach(function (c, i) { uses[p.id + '|' + i] = true; });
      var fabW = p.scale * 6, fabH = fabW * 0.62, n = p.colorways.length, strip = fabW * 0.2, gap = fabW * 0.02;
      var out = '<svg xmlns="' + NS + '" class="igmo-svg" width="' + W + '" height="' + H + '" viewBox="' + f2(-gap) + ' ' + f2(-gap) + ' ' + f2(fabW + 2 * gap) + ' ' + f2(fabH + strip + gap * 5) + '" preserveAspectRatio="xMidYMid meet"><defs>' + patternDefs(uses, null) + '</defs>';
      out += '<rect width="' + f2(fabW) + '" height="' + f2(fabH) + '" fill="url(#pt-' + p.id + '-' + p.cw + ')" stroke="#172b42" stroke-width="' + f2(fabW / 600) + '"/>';
      /* regla de 10 cm */
      var ry = fabH + gap * 1.5, rl = Math.min(10, fabW * 0.4);
      out += '<rect x="0" y="' + f2(ry) + '" width="' + f2(rl) + '" height="' + f2(gap * 0.6) + '" fill="#172b42"/><text x="' + f2(rl + gap) + '" y="' + f2(ry + gap * 0.6) + '" font-size="' + f2(gap * 1.6) + '" fill="#172b42" font-family="Atkinson Hyperlegible, system-ui, sans-serif">' + esc(t('rulerCm', { n: IG.num(rl, 1) })) + '</text>';
      var sw = (fabW - gap * (MAX_CW - 1)) / MAX_CW, sy = ry + gap * 2.2;
      p.colorways.forEach(function (c, i) {
        var x = i * (sw + gap);
        out += '<rect x="' + f2(x) + '" y="' + f2(sy) + '" width="' + f2(sw) + '" height="' + f2(strip - gap * 1.8) + '" fill="url(#pt-' + p.id + '-' + i + ')" stroke="' + (i === p.cw ? '#5a49a8' : '#172b42') + '" stroke-width="' + f2(i === p.cw ? fabW / 180 : fabW / 600) + '" data-cw="' + i + '"/>';
        out += '<text x="' + f2(x) + '" y="' + f2(sy + strip + gap * 0.2) + '" font-size="' + f2(gap * 1.4) + '" fill="#172b42" font-family="Atkinson Hyperlegible, system-ui, sans-serif" font-weight="' + (i === p.cw ? 700 : 400) + '">' + esc(c.name) + '</text>';
      });
      void n; return out + '</svg>';
    }
    function garmentView(W, H) {
      var lk = look(); if (!lk) return emptyMsg(W, H, t('noLooks'));
      var g = G[lk.kind], b = g.box, uses = {}, gap = b[2] * 0.12;
      var front = garmentSvg(lk, 'front', uses, true), back = garmentSvg(lk, 'back', uses, true);
      var vw = b[2] * 2 + gap, vh = b[3] + 8;
      return '<svg xmlns="' + NS + '" class="igmo-svg" width="' + W + '" height="' + H + '" viewBox="' + f2(b[0] - 2) + ' ' + f2(b[1] - 6) + ' ' + f2(vw + 4) + ' ' + f2(vh + 4) + '" preserveAspectRatio="xMidYMid meet"><defs>' + patternDefs(uses, null) + '</defs>' +
        '<text x="' + f2(b[0] + b[2] / 2) + '" y="' + f2(b[1] - 2) + '" text-anchor="middle" font-size="3" fill="#44586c" font-family="Atkinson Hyperlegible, system-ui, sans-serif" font-weight="700">' + esc(t('front')) + '</text>' +
        '<text x="' + f2(b[0] + b[2] * 1.5 + gap) + '" y="' + f2(b[1] - 2) + '" text-anchor="middle" font-size="3" fill="#44586c" font-family="Atkinson Hyperlegible, system-ui, sans-serif" font-weight="700">' + esc(t('back')) + '</text>' +
        '<g data-side="front">' + front + '</g><g transform="translate(' + f2(b[2] + gap) + ',0)" data-side="back">' + back + '</g></svg>';
    }
    /* Línea de la colección: todos los looks de frente con su nombre. */
    function lineView(W, H, interactive, forExport) {
      if (!S.looks.length) return emptyMsg(W, H, t('noLooks'));
      var uses = {}, n = S.looks.length, perRow = n <= 5 ? n : Math.ceil(n / 2), rows = Math.ceil(n / perRow), cell = 90, cellH = 125, titleH = 16;
      var out = '';
      S.looks.forEach(function (lk, i) {
        var g = G[lk.kind], b = g.box, col = i % perRow, row = Math.floor(i / perRow), s = Math.min(78 / b[2], 96 / b[3]);
        var cx = col * cell + cell / 2, cy = titleH + row * cellH;
        out += '<g transform="translate(' + f2(cx - (b[0] + b[2] / 2) * s) + ',' + f2(cy + 4 - b[1] * s + (96 - b[3] * s) / 2) + ') scale(' + f2(s) + ')"' + (interactive ? ' data-look="' + i + '"' : '') + '>' + garmentSvg(lk, 'front', uses, false) + '</g>';
        if (interactive && i === S.curLook) out += '<rect x="' + f2(col * cell + 3) + '" y="' + f2(cy) + '" width="' + (cell - 6) + '" height="' + (cellH - 6) + '" rx="3" fill="none" stroke="#5a49a8" stroke-width="0.8" stroke-dasharray="3 2" pointer-events="none"/>';
        out += '<text x="' + f2(cx) + '" y="' + f2(cy + 108) + '" text-anchor="middle" font-size="5.2" font-weight="700" fill="#172b42" font-family="Atkinson Hyperlegible, system-ui, sans-serif">' + esc((i + 1) + '. ' + lk.name) + '</text>';
        out += '<text x="' + f2(cx) + '" y="' + f2(cy + 115) + '" text-anchor="middle" font-size="4" fill="#44586c" font-family="Atkinson Hyperlegible, system-ui, sans-serif">' + esc(t('kind_' + lk.kind)) + '</text>';
      });
      var vw = perRow * cell, vh = titleH + rows * cellH + (forExport ? 8 : 0);
      var title = '<text x="4" y="11" font-size="8" font-weight="700" fill="#172b42" font-family="Atkinson Hyperlegible, system-ui, sans-serif">' + esc(S.title || t('collectionDefault')) + '</text>';
      var credit = forExport ? '<text x="' + f2(vw - 3) + '" y="' + f2(vh - 3) + '" text-anchor="end" font-size="3.4" fill="#17395c" font-family="Atkinson Hyperlegible, Arial, sans-serif">IRIS GREEN · irisgreen.eu</text>' : '';
      return '<svg xmlns="' + NS + '" class="igmo-svg" ' + (forExport ? 'width="' + vw * 4 + '" height="' + vh * 4 + '"' : 'width="' + W + '" height="' + H + '"') + ' viewBox="0 0 ' + vw + ' ' + vh + '" preserveAspectRatio="xMidYMid meet"' + (forExport ? ' role="img" aria-label="' + esc(S.title || t('collectionDefault')) + '"' : '') + '>' +
        (forExport ? '<title>' + esc(S.title || t('collectionDefault')) + '</title><desc>' + esc(lineDesc()) + '</desc>' : '') + '<defs>' + patternDefs(uses, null) + '</defs><rect width="' + vw + '" height="' + vh + '" fill="#ffffff"/>' + title + out + credit + '</svg>';
    }
    function lineDesc() { return S.looks.map(function (lk, i) { return (i + 1) + '. ' + lk.name + ' (' + t('kind_' + lk.kind) + ')'; }).join('; '); }

    /* ---------- Patronaje: bolsa tote a escala 1:1 ---------- */
    function totePieces() {
      var T = S.tote, s = T.seam, pieces = [];
      /* seam: márgenes [izquierda, derecha, abajo, arriba] en cm */
      pieces.push({ id: 'body', cut: 2, w: T.w + 2 * s, h: T.h + s + T.hem, seam: [s, s, s, T.hem] });
      /* el fuelle es una tira larga: se corta en tela doblada (la mitad, con el doblez en el centro del fondo) */
      if (T.g > 0) pieces.push({ id: 'gusset', cut: 1, w: T.g + 2 * s, h: T.w / 2 + T.h + T.hem, seam: [s, s, 0, T.hem], onFold: true });
      pieces.push({ id: 'handle', cut: 2, w: 4 * T.hw, h: T.hl + 8, seam: [0, 0, 0, 0], fold: true });
      if (T.pocket) { var pw = Math.round(T.w * 0.45), ph = Math.round(T.h * 0.35); pieces.push({ id: 'pocket', cut: 1, w: pw + 2 * s, h: ph + s + 2, seam: [s, s, s, 2] }); }
      return pieces;
    }
    /* Colocación en «horizonte» (skyline), en mm. Se prueban anchos de 2 a 4 hojas y piezas giradas 90°
       (el hilo recto gira con la pieza: en el papel la orientación da igual) y se elige la que usa menos hojas. */
    var layoutCache = { key: '', L: null };
    function toteLayout() {
      var key = JSON.stringify(S.tote); if (layoutCache.key === key) return layoutCache.L;
      var base = totePieces().map(function (p) { return Object.assign({}, p, { W: p.w * 10, H: p.h * 10 }); }), best = null, n = base.length;
      for (var mask = 0; mask < (1 << n); mask++) {
        var ps = base.map(function (p, i) { var r = !!(mask & (1 << i)); return Object.assign({}, p, { rot: r, FW: r ? p.H : p.W, FH: r ? p.W : p.H }); });
        for (var pages = 2; pages <= 4; pages++) {
          var L = pack(ps, pages * PW); if (!L) continue;
          if (!best || L.count < best.count || (L.count === best.count && L.rows * L.cols < best.rows * best.cols)) best = L;
        }
      }
      layoutCache = { key: key, L: best }; return best;
    }
    function pack(list, maxW) {
      var sky = new Array(maxW), gap = 12, x, i;
      for (x = 0; x < maxW; x++) sky[x] = x < 180 ? 80 : 0;
      var out = [], ps = list.map(function (p) { return Object.assign({}, p); }).sort(function (a, b) { return b.FH - a.FH; });
      for (var k = 0; k < ps.length; k++) {
        var p = ps[k], bx = -1, by = Infinity;
        if (p.FW + 16 > maxW) return null;
        for (x = 8; x + p.FW <= maxW - 8; x += 4) { var top = 0; for (i = x; i < x + p.FW; i++) if (sky[i] > top) top = sky[i]; var y = top ? top + gap : 8; if (y < by) { by = y; bx = x; } }
        p.x = bx; p.y = by; for (i = Math.max(0, bx - gap); i < Math.min(maxW, bx + p.FW + gap); i++) sky[i] = Math.max(sky[i], by + p.FH);
        out.push(p);
      }
      var totalW = Math.max.apply(null, out.map(function (q) { return q.x + q.FW; }).concat([PW])) + 6, totalH = Math.max.apply(null, out.map(function (q) { return q.y + q.FH; })) + 10;
      var L = { pieces: out, cols: Math.ceil(totalW / PW), rows: Math.ceil(totalH / PH) }; L.W = L.cols * PW; L.H = L.rows * PH;
      L.count = 0; for (var r = 0; r < L.rows; r++) for (var c = 0; c < L.cols; c++) if (pageHasContent(L, c, r)) L.count++;
      return L;
    }
    function pieceSvg(p) {
      /* línea de corte continua, costura discontinua, hilo recto con flecha, doblez y textos reales */
      var sm = p.seam.map(function (v) { return v * 10; }), W = p.W, H = p.H;
      var o = '<g transform="' + (p.rot ? 'translate(' + f2(p.x + p.FW) + ',' + f2(p.y) + ') rotate(90)' : 'translate(' + f2(p.x) + ',' + f2(p.y) + ')') + '">';
      o += '<rect width="' + f2(W) + '" height="' + f2(H) + '" fill="#fbf7ef" stroke="#101820" stroke-width="0.6"/>';
      if (sm.some(function (v) { return v > 0; })) o += '<rect x="' + f2(sm[0]) + '" y="' + f2(sm[3]) + '" width="' + f2(W - sm[0] - sm[1]) + '" height="' + f2(H - sm[2] - sm[3]) + '" fill="none" stroke="#1f5f8b" stroke-width="0.4" stroke-dasharray="4 2.5"/>';
      if (p.fold) o += '<path d="M' + f2(W / 4) + ',0 V' + f2(H) + ' M' + f2(W / 2) + ',0 V' + f2(H) + ' M' + f2(W * 0.75) + ',0 V' + f2(H) + '" stroke="#5a49a8" stroke-width="0.35" stroke-dasharray="1.5 2"/>';
      if (p.onFold) o += '<path d="M0,' + f2(H) + ' H' + f2(W) + '" stroke="#5a49a8" stroke-width="1.6" stroke-dasharray="8 3 1.5 3"/><text x="' + f2(W / 2) + '" y="' + f2(H - 3) + '" text-anchor="middle" font-size="4" font-weight="700" fill="#5a49a8" font-family="Atkinson Hyperlegible, Arial, sans-serif">' + esc(t('foldEdge')) + '</text>';
      var gx = W / 2 + (p.fold ? W / 8 : 0), gy0 = Math.max(20, H * 0.18), gy1 = H - Math.max(20, H * 0.18);
      o += '<path d="M' + f2(gx) + ',' + f2(gy0) + ' V' + f2(gy1) + ' M' + f2(gx - 3) + ',' + f2(gy0 + 5) + ' L' + f2(gx) + ',' + f2(gy0) + ' L' + f2(gx + 3) + ',' + f2(gy0 + 5) + ' M' + f2(gx - 3) + ',' + f2(gy1 - 5) + ' L' + f2(gx) + ',' + f2(gy1) + ' L' + f2(gx + 3) + ',' + f2(gy1 - 5) + '" stroke="#101820" stroke-width="0.5" fill="none"/>';
      var fs = Math.max(4.2, Math.min(8, W / 15)), tx = Math.max(sm[0] + 3, 4), ty = sm[3] + fs + 4;
      var lines = [t('pc_' + p.id), p.onFold ? t('cutFold') : t('cutN', { n: p.cut }), t('pcSize', { w: IG.num(p.w, 1), h: IG.num(p.h, 1) })];
      if (p.fold) lines.push(t('handleFold'));
      lines.forEach(function (ln, i) { o += '<text x="' + f2(tx) + '" y="' + f2(ty + i * fs * 1.3) + '" font-size="' + f2(i ? fs * 0.8 : fs) + '" font-weight="' + (i ? 400 : 700) + '" fill="#101820" font-family="Atkinson Hyperlegible, Arial, sans-serif">' + esc(ln) + '</text>'; });
      o += '<text x="' + f2(gx + 3) + '" y="' + f2((gy0 + gy1) / 2) + '" font-size="' + f2(fs * 0.7) + '" fill="#101820" font-family="Atkinson Hyperlegible, Arial, sans-serif" transform="rotate(90 ' + f2(gx + 3) + ' ' + f2((gy0 + gy1) / 2) + ')">' + esc(t('grain')) + '</text>';
      return o + '</g>';
    }
    function testSquare() {
      return '<g transform="translate(10,12)"><rect width="50" height="50" fill="none" stroke="#101820" stroke-width="0.5"/><path d="M0,25 H50 M25,0 V50" stroke="#101820" stroke-width="0.25"/>' +
        '<text x="58" y="10" font-size="6" font-weight="700" fill="#101820" font-family="Atkinson Hyperlegible, Arial, sans-serif">' + esc(t('testSquare')) + '</text>' +
        '<text x="58" y="19" font-size="4.2" fill="#101820" font-family="Atkinson Hyperlegible, Arial, sans-serif">' + esc(t('testSquare2')) + '</text>' +
        '<text x="58" y="26" font-size="4.2" fill="#101820" font-family="Atkinson Hyperlegible, Arial, sans-serif">' + esc(t('testSquare3')) + '</text>' +
        '<text x="58" y="40" font-size="4.2" fill="#101820" font-family="Atkinson Hyperlegible, Arial, sans-serif">' + esc(t('seamLegend', { s: IG.num(S.tote.seam, 1) })) + '</text></g>';
    }
    function sheetLabel(c, r) { return String.fromCharCode(65 + r) + (c + 1); }
    function pageHasContent(L, c, r) {
      var x0 = c * PW, y0 = r * PH, x1 = x0 + PW, y1 = y0 + PH;
      if (c === 0 && r === 0) return true;
      return L.pieces.some(function (p) { return p.x < x1 && p.x + p.FW > x0 && p.y < y1 && p.y + p.FH > y0; });
    }
    function patternView(W, H) {
      var L = toteLayout(), o = '';
      for (var r = 0; r < L.rows; r++) for (var c = 0; c < L.cols; c++) {
        var has = pageHasContent(L, c, r);
        o += '<rect x="' + c * PW + '" y="' + r * PH + '" width="' + PW + '" height="' + PH + '" fill="' + (has ? '#ffffff' : '#eef2f6') + '" stroke="#7d93a8" stroke-width="1" stroke-dasharray="6 4"/>';
        o += '<text x="' + (c * PW + 6) + '" y="' + (r * PH + 16) + '" font-size="12" font-weight="700" fill="#44586c" font-family="Atkinson Hyperlegible, system-ui, sans-serif">' + sheetLabel(c, r) + '</text>';
      }
      L.pieces.forEach(function (p) { o += '<g' + (p.id === selPiece ? ' class="igmo-selpiece"' : '') + ' data-piece="' + p.id + '">' + pieceSvg(p) + '</g>'; });
      o += testSquare();
      return '<svg xmlns="' + NS + '" class="igmo-svg" width="' + W + '" height="' + H + '" viewBox="-10 -10 ' + (L.W + 20) + ' ' + (L.H + 20) + '" preserveAspectRatio="xMidYMid meet">' + o + '</svg>';
    }
    /* Hojas A4 para imprimir: mapa de montaje + hojas a escala 1:1 con marcas de unión. */
    function printSheets() {
      var L = toteLayout(), pages = [], all = '';
      L.pieces.forEach(function (p) { all += pieceSvg(p); });
      all += testSquare();
      var list = [];
      for (var r = 0; r < L.rows; r++) for (var c = 0; c < L.cols; c++) if (pageHasContent(L, c, r)) list.push([c, r]);
      var font = 'font-family="Atkinson Hyperlegible, Arial, sans-serif"';
      /* hoja 0: mapa y cómo comprobar la escala (esta hoja no está a escala) */
      var ms = Math.min(170 / L.W, 120 / L.H), map = '';
      for (var rr = 0; rr < L.rows; rr++) for (var cc = 0; cc < L.cols; cc++) {
        var inc = pageHasContent(L, cc, rr);
        map += '<rect x="' + f2(cc * PW * ms) + '" y="' + f2(rr * PH * ms) + '" width="' + f2(PW * ms) + '" height="' + f2(PH * ms) + '" fill="' + (inc ? '#ffffff' : '#e6ebf0') + '" stroke="#44586c" stroke-width="0.3"/><text x="' + f2(cc * PW * ms + 2) + '" y="' + f2(rr * PH * ms + 6) + '" font-size="5" font-weight="700" ' + font + ' fill="#17395c">' + sheetLabel(cc, rr) + '</text>';
      }
      L.pieces.forEach(function (p) { map += '<rect x="' + f2(p.x * ms) + '" y="' + f2(p.y * ms) + '" width="' + f2(p.FW * ms) + '" height="' + f2(p.FH * ms) + '" fill="#fbf1d8" stroke="#101820" stroke-width="0.3"/><text x="' + f2((p.x + p.FW / 2) * ms) + '" y="' + f2((p.y + p.FH / 2) * ms) + '" text-anchor="middle" font-size="3.6" ' + font + '>' + esc(t('pc_' + p.id)) + '</text>'; });
      var info = [t('printTitle'), t('printInfo1', { n: list.length }), t('printInfo2'), t('printInfo3'), t('printInfo4')];
      var head = info.map(function (ln, i) { return '<text x="0" y="' + (i ? 12 + i * 7 : 6) + '" font-size="' + (i ? 4.4 : 7) + '" font-weight="' + (i ? 400 : 700) + '" ' + font + ' fill="#101820">' + esc(ln) + '</text>'; }).join('');
      var tbl = totePieces().map(function (p, i) { return '<text x="0" y="' + (i * 6) + '" font-size="4.2" ' + font + ' fill="#101820">' + esc(t('pc_' + p.id) + ' · ' + (p.onFold ? t('cutFold') : t('cutN', { n: p.cut })) + ' · ' + t('pcSize', { w: IG.num(p.w, 1), h: IG.num(p.h, 1) })) + '</text>'; }).join('');
      pages.push(svgPage('0 0 ' + PW + ' ' + PH, '<title>' + esc(t('printTitle')) + '</title><g transform="translate(6,10)">' + head + '</g><g transform="translate(10,58)">' + map + '</g><g transform="translate(10,' + f2(66 + L.H * ms) + ')">' + tbl + '</g>' + creditSvg(PW, PH), t('printTitle')));
      list.forEach(function (cr, k) {
        var c = cr[0], r = cr[1], x0 = c * PW, y0 = r * PH, marks = '', lab = sheetLabel(c, r);
        /* marcas de unión: medio rombo en cada borde con vecina, con el nombre de la vecina */
        [[1, 0, 'R'], [-1, 0, 'L'], [0, 1, 'B'], [0, -1, 'T']].forEach(function (d) {
          var nc = c + d[0], nr = r + d[1]; if (nc < 0 || nr < 0 || nc >= L.cols || nr >= L.rows) return;
          var nlab = sheetLabel(nc, nr), mx, my, tri, tx, ty, anchor = 'middle';
          [0.3, 0.7].forEach(function (fr) {
            if (d[2] === 'R') { mx = x0 + PW; my = y0 + PH * fr; tri = 'M' + mx + ',' + (my - 6) + ' L' + (mx - 6) + ',' + my + ' L' + mx + ',' + (my + 6) + 'Z'; }
            else if (d[2] === 'L') { mx = x0; my = y0 + PH * fr; tri = 'M' + mx + ',' + (my - 6) + ' L' + (mx + 6) + ',' + my + ' L' + mx + ',' + (my + 6) + 'Z'; }
            else if (d[2] === 'B') { mx = x0 + PW * fr; my = y0 + PH; tri = 'M' + (mx - 6) + ',' + my + ' L' + mx + ',' + (my - 6) + ' L' + (mx + 6) + ',' + my + 'Z'; }
            else { mx = x0 + PW * fr; my = y0; tri = 'M' + (mx - 6) + ',' + my + ' L' + mx + ',' + (my + 6) + ' L' + (mx + 6) + ',' + my + 'Z'; }
            marks += '<path d="' + tri + '" fill="#5a49a8"/>';
          });
          if (d[2] === 'R') { tx = x0 + PW - 9; ty = y0 + PH / 2; anchor = 'end'; } else if (d[2] === 'L') { tx = x0 + 9; ty = y0 + PH / 2; anchor = 'start'; }
          else if (d[2] === 'B') { tx = x0 + PW / 2; ty = y0 + PH - 9; } else { tx = x0 + PW / 2; ty = y0 + 14; }
          marks += '<text x="' + tx + '" y="' + ty + '" text-anchor="' + anchor + '" font-size="4.4" font-weight="700" fill="#5a49a8" ' + font + '>' + esc(t('joinWith', { s: nlab })) + '</text>';
        });
        var corner = '<path d="M' + x0 + ',' + (y0 + 8) + ' V' + y0 + ' H' + (x0 + 8) + ' M' + (x0 + PW - 8) + ',' + y0 + ' H' + (x0 + PW) + ' V' + (y0 + 8) + ' M' + x0 + ',' + (y0 + PH - 8) + ' V' + (y0 + PH) + ' H' + (x0 + 8) + ' M' + (x0 + PW - 8) + ',' + (y0 + PH) + ' H' + (x0 + PW) + ' V' + (y0 + PH - 8) + '" stroke="#101820" stroke-width="0.3" fill="none"/>';
        var label = '<text x="' + (x0 + 4) + '" y="' + (y0 + PH - 4) + '" font-size="4.6" font-weight="700" ' + font + ' fill="#44586c">' + esc(t('sheetN', { s: lab, n: k + 1, total: list.length })) + '</text>';
        pages.push(svgPage(x0 + ' ' + y0 + ' ' + PW + ' ' + PH, '<title>' + esc(t('sheetN', { s: lab, n: k + 1, total: list.length })) + '</title>' + all + marks + corner + label + creditSvg(PW, PH, x0, y0), t('sheetN', { s: lab, n: k + 1, total: list.length })));
      });
      return pages;
    }
    function creditSvg(w, hh, x0, y0) { return '<text x="' + ((x0 || 0) + w - 3) + '" y="' + ((y0 || 0) + hh - 3) + '" text-anchor="end" font-size="3.2" fill="#17395c" font-family="Atkinson Hyperlegible, Arial, sans-serif">IRIS GREEN · irisgreen.eu</text>'; }
    function svgPage(vb, inner, label) {
      var d = new DOMParser().parseFromString('<svg xmlns="' + NS + '" width="' + PW + 'mm" height="' + PH + 'mm" viewBox="' + vb + '" role="img" aria-label="' + esc(label) + '">' + inner + '</svg>', 'image/svg+xml');
      return D.importNode(d.documentElement, true);
    }
    function printTote() { var pages = printSheets(); ctx.printPages(pages); ctx.announce(t('printing', { n: pages.length })); ctx.setStatus(t('printing', { n: pages.length })); }

    /* ---------- Puntero ---------- */
    function svgPoint(e) { var sv = host.querySelector('svg'); if (!sv) return null; var m = sv.getScreenCTM(); if (!m) return null; var p = sv.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(m.inverse()); }
    var drag = null, pen = null;
    host.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      var tg = e.target.closest ? e.target.closest('[data-shape],[data-zone],[data-look],[data-cw],[data-piece],[data-bg]') : null;
      if (view === 'motif') {
        var p0 = svgPoint(e); if (!p0) return;
        if (penMode) { pen = { pts: [[p0.x, p0.y, pressure(e)]], pid: e.pointerId }; host.setPointerCapture(e.pointerId); e.preventDefault(); return; }
        if (tg && tg.dataset.shape) { selectShape(tg.dataset.shape); var s = shapeById(selShape); drag = { start: p0, orig: [s.x, s.y], pid: e.pointerId, moved: false }; host.setPointerCapture(e.pointerId); e.preventDefault(); }
        else if (selShape) { selectShape(null); }
        return;
      }
      if (!tg) return;
      if (tg.dataset.zone) { selectZone(tg.dataset.zone); var sideEl = tg.closest('[data-side]'); if (sideEl) lastSide = sideEl.dataset.side; }
      else if (tg.dataset.look) { S.curLook = +tg.dataset.look; selZone = null; renderSide(); draw(); ctx.announce(t('lookSel', { name: look().name })); }
      else if (tg.dataset.cw) { pr().cw = +tg.dataset.cw; commit(t('cwNow', { name: pr().colorways[pr().cw].name })); }
      else if (tg.dataset.piece) { selPiece = tg.dataset.piece; renderSide(); draw(); }
    });
    var lastSide = 'front';
    function pressure(e) { return e.pointerType === 'pen' && e.pressure > 0 ? Math.max(0.25, Math.min(1.6, e.pressure * 1.6)) : 1; }
    host.addEventListener('pointermove', function (e) {
      if (pen && e.pointerId === pen.pid) {
        var q = svgPoint(e); var last = pen.pts[pen.pts.length - 1];
        if (q && Math.hypot(q.x - last[0], q.y - last[1]) > 1.2) { pen.pts.push([q.x, q.y, pressure(e)]); drawPenPreview(); }
        return;
      }
      if (!drag || e.pointerId !== drag.pid) return;
      var p = svgPoint(e), s = shapeById(selShape); if (!p || !s) return;
      var dx = p.x - drag.start.x, dy = p.y - drag.start.y; if (Math.abs(dx) + Math.abs(dy) > 0.5) drag.moved = true;
      s.x = Math.round((drag.orig[0] + dx) * 2) / 2; s.y = Math.round((drag.orig[1] + dy) * 2) / 2; draw();
    });
    function endPointer(e) {
      if (pen && e.pointerId === pen.pid) { var pts = pen.pts; pen = null; if (pts.length > 2) addPen(pts); else draw(); return; }
      if (!drag || e.pointerId !== drag.pid) return;
      var moved = drag.moved; drag = null; if (moved) commit(t('moved'), true);
    }
    host.addEventListener('pointerup', endPointer); host.addEventListener('pointercancel', endPointer);
    function drawPenPreview() {
      var sv = host.querySelector('svg'); if (!sv || !pen) return; var old = sv.querySelector('.igmo-penprev'); if (old) old.remove();
      var pl = D.createElementNS(NS, 'polyline'); pl.setAttribute('class', 'igmo-penprev'); pl.setAttribute('points', pen.pts.map(function (q) { return f2(q[0]) + ',' + f2(q[1]); }).join(' '));
      pl.setAttribute('fill', 'none'); pl.setAttribute('stroke', '#5a49a8'); pl.setAttribute('stroke-width', '3'); pl.setAttribute('stroke-linecap', 'round'); sv.appendChild(pl);
    }
    function addPen(pts) {
      var p = pr(); if (!p) return; if (p.shapes.length >= MAX_SHAPES) { ctx.announce(t('maxShapes', { n: MAX_SHAPES })); return; }
      var xs = pts.map(function (q) { return q[0]; }), ys = pts.map(function (q) { return q[1]; }), x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
      var w = Math.max(1, x1 - x0), hh = Math.max(1, y1 - y0), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      var s = { id: nid('s'), type: 'pen', x: f2(cx), y: f2(cy), w: f2(w), h: f2(hh), rot: 0, c: 1, sw: 3, op: 100, pts: pts.map(function (q) { return [f2((q[0] - cx) / w), f2((q[1] - cy) / hh), f2(q[2])]; }) };
      p.shapes.push(s); selShape = s.id; commit(t('added', { what: t('shape_pen') }));
    }

    /* ---------- Teclado ---------- */
    var kcTimer = 0; function keyCommit(label) { clearTimeout(kcTimer); kcTimer = setTimeout(function () { commit(label, true); }, 450); }
    function onKey(e) {
      if (!vp.contains(e.target) || e.ctrlKey || e.metaKey || e.altKey) return false;
      var k = e.key, p = pr();
      if (view === 'motif' && p) {
        var s = shapeById(selShape), st = e.shiftKey ? 10 : 1, d = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, -st], ArrowDown: [0, st] }[k];
        if (d && s) { s.x = f2(s.x + d[0]); s.y = f2(s.y + d[1]); draw(); keyCommit(t('moved')); ctx.announce(describe(s)); return true; }
        if (d && !s && p.shapes.length) { selectShape(p.shapes[0].id); return true; }
        if (k === '.' || k === ',') { if (!p.shapes.length) return true; var i = p.shapes.indexOf(s); i = s ? (i + (k === '.' ? 1 : -1) + p.shapes.length) % p.shapes.length : 0; selectShape(p.shapes[i].id); return true; }
        if (k === 'Enter' || k === ' ') { if (!s) addShape(shapeKind); return true; }
        if (!s) return k === 'Escape' ? false : false;
        if (k === '[' || k === ']') { var f = k === ']' ? 1.1 : 1 / 1.1; s.w = f2(Math.max(2, Math.min(300, s.w * f))); s.h = f2(Math.max(2, Math.min(300, s.h * f))); draw(); keyCommit(t('resized')); ctx.announce(describe(s)); return true; }
        if (k === 'r' || k === 'R') { s.rot = ((s.rot || 0) + (e.shiftKey ? -15 : 15) + 360) % 360; commit(t('rotated')); return true; }
        if (k === 'c' || k === 'C') { s.c = (s.c % 3) + 1; commit(t('colourSlotNow', { n: s.c })); return true; }
        if (k === 'd' || k === 'D') { duplicateShape(); return true; }
        if (k === 'Delete' || k === 'Backspace') { deleteShape(); return true; }
        if (k === 'Escape') { selectShape(null); ctx.announce(t('deselected')); return true; }
        return false;
      }
      if (view === 'garment' && look()) {
        var zs = G[look().kind].zones, zi = zs.indexOf(selZone);
        if (k === 'ArrowRight' || k === 'ArrowDown' || k === '.') { selectZone(zs[(zi + 1) % zs.length]); return true; }
        if (k === 'ArrowLeft' || k === 'ArrowUp' || k === ',') { selectZone(zs[(zi - 1 + zs.length) % zs.length]); return true; }
        if (k === 'Escape' && selZone) { selectZone(null); ctx.announce(t('deselected')); return true; }
        return false;
      }
      if (view === 'line' && S.looks.length) {
        if (k === 'ArrowRight' || k === 'ArrowLeft' || k === '.' || k === ',') { var dir = (k === 'ArrowRight' || k === '.') ? 1 : -1; S.curLook = (S.curLook + dir + S.looks.length) % S.looks.length; selZone = null; renderSide(); draw(); ctx.announce(t('lookSel', { name: look().name })); return true; }
        if (k === 'Enter') { ctx.selectTool('garment'); return true; }
        return false;
      }
      if (view === 'repeat' && p) {
        if (k === 'ArrowRight' || k === 'ArrowLeft') { p.cw = (p.cw + (k === 'ArrowRight' ? 1 : -1) + p.colorways.length) % p.colorways.length; commit(t('cwNow', { name: p.colorways[p.cw].name })); return true; }
        return false;
      }
      if (view === 'pattern') {
        var pcs = totePieces().map(function (x) { return x.id; }), pi = pcs.indexOf(selPiece);
        if (k === 'ArrowRight' || k === 'ArrowLeft') { selPiece = pcs[(pi + (k === 'ArrowRight' ? 1 : -1) + pcs.length) % pcs.length]; renderSide(); draw(); ctx.announce(t('pc_' + selPiece)); return true; }
      }
      return false;
    }

    /* ---------- Acciones ---------- */
    function commit(label, quiet) { ctx.commit(label); renderSide(); draw(); if (label && !quiet) ctx.announce(label); }
    function describe(s) { return t('shapeDesc', { what: t('shape_' + s.type), x: IG.num(s.x, 1), y: IG.num(s.y, 1), w: IG.num(s.w, 1), h: IG.num(s.h, 1), c: s.c ? t('slotN', { n: s.c }) : t('slotBg') }); }
    function selectShape(id) { selShape = id && shapeById(id) ? id : null; renderSide(); draw(); if (selShape) ctx.announce(t('selected', { name: describe(shapeById(selShape)) })); }
    function selectZone(z) { selZone = z; renderSide(); draw(); if (z) { var f = look().zones[z]; ctx.announce(t('zoneSel', { z: zoneName(z), fill: fillName(f) })); } }
    function fillName(f) { if (!f) return '—'; if (f.t === 'print' && printById(f.p)) { var p = printById(f.p); return t('fillPrint', { name: p.name, cw: (p.colorways[f.w || 0] || p.colorways[0]).name }); } return t('fillSolid', { c: f.c }); }
    function newShape(type) {
      var base = { id: nid('s'), type: type, x: 50, y: 50, w: 30, h: 30, rot: 0, c: 1, sw: 4, op: 100 };
      if (type === 'line') { base.w = 60; base.h = 4; } if (type === 'wave' || type === 'zigzag') { base.w = 100; base.h = 16; base.n = 2; }
      if (type === 'leaf') { base.w = 22; base.h = 40; } if (type === 'ring') base.sw = 5;
      return base;
    }
    function addShape(type) {
      var p = pr(); if (!p) return; if (p.shapes.length >= MAX_SHAPES) { ctx.announce(t('maxShapes', { n: MAX_SHAPES })); return; }
      var s = newShape(type); p.shapes.push(s); selShape = s.id; if (view !== 'motif') ctx.selectTool('motif');
      commit(t('added', { what: t('shape_' + type) }));
    }
    function duplicateShape() { var p = pr(), s = shapeById(selShape); if (!s) return; if (p.shapes.length >= MAX_SHAPES) { ctx.announce(t('maxShapes', { n: MAX_SHAPES })); return; } var c = JSON.parse(JSON.stringify(s)); c.id = nid('s'); c.x = f2(c.x + 10); c.y = f2(c.y + 10); p.shapes.push(c); selShape = c.id; commit(t('duplicated')); }
    function deleteShape() { var p = pr(), s = shapeById(selShape); if (!s) return; p.shapes = p.shapes.filter(function (x) { return x !== s; }); selShape = null; commit(t('deleted', { what: t('shape_' + s.type) })); }
    function reorder(dir) { var p = pr(), s = shapeById(selShape); if (!s) return; var i = p.shapes.indexOf(s); p.shapes.splice(i, 1); if (dir > 0) p.shapes.push(s); else p.shapes.unshift(s); commit(t(dir > 0 ? 'toFrontDone' : 'toBackDone')); }
    function togglePen() { penMode = !penMode; var b = ctx.toolbar.querySelector('[data-igmo="pen"]'); if (b) b.setAttribute('aria-pressed', String(penMode)); if (penMode && view !== 'motif') ctx.selectTool('motif'); vp.dataset.pen = String(penMode); ctx.announce(t(penMode ? 'penOn' : 'penOff')); }
    function addPrint(preset) {
      if (S.prints.length >= MAX_PRINTS) { ctx.announce(t('maxPrints', { n: MAX_PRINTS })); return; }
      var p = presetPrint(preset); S.prints.push(p); S.curPrint = S.prints.length - 1; selShape = null; if (view !== 'motif' && view !== 'repeat') ctx.selectTool('motif');
      commit(t('printAdded', { name: p.name }));
    }
    function dupPrint() { var p = pr(); if (!p) return; if (S.prints.length >= MAX_PRINTS) { ctx.announce(t('maxPrints', { n: MAX_PRINTS })); return; } var c = JSON.parse(JSON.stringify(p)); c.id = nid('p'); c.name = t('copyOf', { name: p.name }); c.shapes.forEach(function (s) { s.id = nid('s'); }); S.prints.splice(S.curPrint + 1, 0, c); S.curPrint += 1; commit(t('printAdded', { name: c.name })); }
    function delPrint() {
      var p = pr(); if (!p) return;
      S.prints.splice(S.curPrint, 1); S.curPrint = Math.max(0, Math.min(S.curPrint, S.prints.length - 1)); selShape = null;
      S.looks.forEach(function (lk) { Object.keys(lk.zones).forEach(function (z) { var f = lk.zones[z]; if (f.t === 'print' && f.p === p.id) { lk.zones[z] = { t: 'solid', c: p.colorways[0].bg }; } }); });
      commit(t('deleted', { what: p.name }));
    }
    function addLook(kind) {
      if (S.looks.length >= MAX_LOOKS) { ctx.announce(t('maxLooks', { n: MAX_LOOKS })); return; }
      var lk = newLook(kind, t('lookN', { n: S.looks.length + 1 }) + ' · ' + t('kind_' + kind)); S.looks.push(lk); S.curLook = S.looks.length - 1; selZone = null;
      if (view !== 'garment' && view !== 'line') ctx.selectTool('garment');
      commit(t('lookAdded', { name: lk.name }));
    }
    function dupLook() { var lk = look(); if (!lk) return; if (S.looks.length >= MAX_LOOKS) { ctx.announce(t('maxLooks', { n: MAX_LOOKS })); return; } var c = JSON.parse(JSON.stringify(lk)); c.id = nid('l'); c.name = t('copyOf', { name: lk.name }); S.looks.splice(S.curLook + 1, 0, c); S.curLook += 1; commit(t('lookAdded', { name: c.name })); }
    function delLook() { var lk = look(); if (!lk) return; S.looks.splice(S.curLook, 1); S.curLook = Math.max(0, Math.min(S.curLook, S.looks.length - 1)); selZone = null; commit(t('deleted', { what: lk.name })); }
    function moveLook(dir) { var j = S.curLook + dir; if (j < 0 || j >= S.looks.length) return; var lk = S.looks.splice(S.curLook, 1)[0]; S.looks.splice(j, 0, lk); S.curLook = j; commit(t('lookMoved', { n: j + 1 })); }
    function newLook(kind, name) {
      var zones = {}; G[kind].zones.forEach(function (z, i) { zones[z] = { t: 'solid', c: ['#d9cbb4', '#17395c', '#f4efe6', '#b3261e', '#6fa8dc'][i % 5] }; });
      return { id: nid('l'), name: name, kind: kind, zones: zones };
    }
    function setKind(lk, kind) {
      /* al cambiar de prenda se conservan los rellenos de las zonas con el mismo nombre */
      var old = lk.zones, fresh = newLook(kind, lk.name).zones, firstOld = old[Object.keys(old)[0]];
      Object.keys(fresh).forEach(function (z, i) { fresh[z] = old[z] ? old[z] : (i === 0 && firstOld ? JSON.parse(JSON.stringify(firstOld)) : fresh[z]); });
      lk.kind = kind; lk.zones = fresh; if (selZone && !fresh[selZone]) selZone = null;
    }

    /* ---------- Paneles ---------- */
    function keepFocus(fn) {
      var a = D.activeElement, key = a && a.dataset ? a.dataset.k : null, insp = ctx.inspector.contains(a), str = ctx.structure.contains(a); fn();
      if (key) { var n = (insp ? ctx.inspector : str ? ctx.structure : D).querySelector('[data-k="' + key + '"]'); if (n) { try { n.focus({ preventScroll: true }); } catch (_) { n.focus(); } } }
    }
    function tag(el, key) {
      if (el.tagName === 'FIELDSET') Array.prototype.forEach.call(el.querySelectorAll('input'), function (i) { i.dataset.k = key + '-' + i.value; });
      else (el.input || el).dataset.k = key;
      return el;
    }
    function renderSide() { keepFocus(function () { renderStructure(); renderInspector(); }); syncToolbar(); ctx.setSummary(summary()); }
    function listItem(key, current, label, small, swatch, onClick) {
      var b = h('button', { type: 'button', 'aria-current': String(!!current), 'data-k': key }, h('span', { class: 'igs-swatch', style: swatch ? 'background:' + swatch : null }), h('span', { text: label }), small ? h('small', { text: small }) : null);
      b.addEventListener('click', onClick); return h('li', null, b);
    }
    function lookSwatch(lk) { var f = lk.zones[G[lk.kind].zones[0]]; if (f.t === 'print' && printById(f.p)) { var p = printById(f.p), c = p.colorways[f.w || 0] || p.colorways[0]; return 'linear-gradient(135deg,' + c.bg + ' 50%,' + c.c[0] + ' 50%)'; } return f.c; }
    function renderStructure() {
      var out = [];
      if (view === 'motif' || view === 'repeat') {
        out.push(h('h3', { text: t('printsList', { n: S.prints.length, max: MAX_PRINTS }) }));
        var ul = h('ul', { class: 'igs-list' });
        S.prints.forEach(function (p, i) { var c = p.colorways[p.cw]; ul.appendChild(listItem('pr' + p.id, i === S.curPrint, p.name, t('rep_' + p.repeat), 'linear-gradient(135deg,' + c.bg + ' 50%,' + c.c[0] + ' 50%)', function () { S.curPrint = i; selShape = null; renderSide(); draw(); ctx.announce(t('printSel', { name: p.name })); })); });
        out.push(ul);
        var ps = h('select', { 'aria-label': t('newPrint'), 'data-k': 'newprint' }, h('option', { value: '', text: t('newPrintShort') }));
        ['blank', 'dots', 'stripes', 'grid', 'leaves', 'waves'].forEach(function (k) { ps.appendChild(h('option', { value: k, text: t('preset_' + k) })); });
        ps.addEventListener('change', function () { if (ps.value) addPrint(ps.value); });
        out.push(h('label', { class: 'igs-inline-select igmo-wide' }, h('span', { class: 'igs-sr', text: t('newPrint') }), ps));
        if (pr()) out.push(h('div', { class: 'igs-actions' }, ctx.button(t('dupPrint'), { icon: 'copy', onClick: dupPrint }), ctx.button(t('delPrint'), { icon: 'trash', class: 'igs-danger', onClick: delPrint })));
        var p = pr();
        if (p && view === 'motif') {
          out.push(h('h3', { text: t('shapesList', { n: p.shapes.length }) }));
          var sl = h('ul', { class: 'igs-list' });
          p.shapes.slice().reverse().forEach(function (s) { sl.appendChild(listItem('sh' + s.id, s.id === selShape, t('shape_' + s.type), s.c ? t('slotShort', { n: s.c }) : t('slotBgShort'), s.c ? p.colorways[p.cw].c[s.c - 1] : p.colorways[p.cw].bg, function () { selectShape(s.id); })); });
          out.push(sl, h('p', { class: 'igs-muted', text: t('shapesHelp') }));
        }
      } else if (view === 'garment' || view === 'line') {
        out.push(h('h3', { text: t('looksList', { n: S.looks.length, max: MAX_LOOKS }) }));
        var ll = h('ul', { class: 'igs-list' });
        S.looks.forEach(function (lk, i) { ll.appendChild(listItem('lk' + lk.id, i === S.curLook, lk.name, t('kind_' + lk.kind), lookSwatch(lk), function () { S.curLook = i; selZone = null; renderSide(); draw(); ctx.announce(t('lookSel', { name: lk.name })); })); });
        out.push(ll);
        var ks = h('select', { 'aria-label': t('newLook'), 'data-k': 'newlook' }, h('option', { value: '', text: t('newLookShort') }));
        KINDS.forEach(function (k) { ks.appendChild(h('option', { value: k, text: t('kind_' + k) })); });
        ks.addEventListener('change', function () { if (ks.value) addLook(ks.value); });
        out.push(h('label', { class: 'igs-inline-select igmo-wide' }, h('span', { class: 'igs-sr', text: t('newLook') }), ks));
        if (look()) out.push(h('div', { class: 'igs-actions' }, ctx.button(t('moveUp'), { icon: 'undo', onClick: function () { moveLook(-1); } }), ctx.button(t('moveDown'), { icon: 'redo', onClick: function () { moveLook(1); } }), ctx.button(t('dupLook'), { icon: 'copy', onClick: dupLook }), ctx.button(t('delLook'), { icon: 'trash', class: 'igs-danger', onClick: delLook })));
        var lk2 = look();
        if (lk2 && view === 'garment') {
          out.push(h('h3', { text: t('zonesList') }));
          var zl = h('ul', { class: 'igs-list' });
          G[lk2.kind].zones.forEach(function (z) { var f = lk2.zones[z]; zl.appendChild(listItem('z' + z, z === selZone, zoneName(z), f.t === 'print' ? t('printShort') : '', f.t === 'print' ? lookSwatch({ kind: lk2.kind, zones: (function () { var o = {}; o[G[lk2.kind].zones[0]] = f; return o; })() }) : f.c, function () { selectZone(z); })); });
          out.push(zl);
        }
      } else {
        out.push(h('h3', { text: t('piecesList') }));
        var pl = h('ul', { class: 'igs-list' });
        totePieces().forEach(function (p) { pl.appendChild(listItem('pc' + p.id, p.id === selPiece, t('pc_' + p.id), '×' + p.cut, '#fbf1d8', function () { selPiece = p.id; renderSide(); draw(); ctx.announce(t('pc_' + p.id) + ': ' + t('pcSize', { w: IG.num(p.w, 1), h: IG.num(p.h, 1) })); })); });
        out.push(pl, h('div', { class: 'igs-actions' }, ctx.button(t('printPattern'), { icon: 'file', class: 'igs-primary', onClick: printTote })));
      }
      ctx.setStructure(out);
    }
    function colourPicker(label, value, key, onChange) {
      var wrap = h('div', { class: 'igs-field igmo-colour' }, h('span', { class: 'igmo-colour-label', text: label }));
      var row = h('div', { class: 'igmo-swatches', role: 'group', 'aria-label': label });
      SWATCHES.forEach(function (c) { var b = h('button', { type: 'button', class: 'igmo-sw', style: 'background:' + c, 'aria-pressed': String(String(value).toLowerCase() === c), 'aria-label': t('colourHex', { hex: c }), 'data-k': key + c }); b.addEventListener('click', function () { onChange(c); }); row.appendChild(b); });
      wrap.appendChild(row); wrap.appendChild(tag(F.color(t('customColour'), value, { onChange: onChange }), key + 'custom'));
      return wrap;
    }
    function renderInspector() {
      var out = [];
      if (view === 'motif' || view === 'repeat') out = printInspector();
      else if (view === 'garment') out = garmentInspector();
      else if (view === 'line') out = lineInspector();
      else out = toteInspector();
      ctx.setInspector(out);
    }
    function printInspector() {
      var p = pr(), out = []; if (!p) return [h('p', { class: 'igs-muted', text: t('noPrints') })];
      var s = view === 'motif' ? shapeById(selShape) : null;
      if (s) {
        out.push(h('h4', { text: t('shape_' + s.type) }));
        out.push(tag(F.select(t('shapeType'), s.type, SHAPES.concat(s.type === 'pen' ? ['pen'] : []).map(function (k) { return [k, t('shape_' + k)]; }), { onChange: function (v) { s.type = v; if (v === 'wave' || v === 'zigzag') s.n = s.n || 2; commit(t('changed')); } }), 'stype'));
        out.push(tag(F.choice(t('colourSlot'), String(s.c), [['1', t('slotN', { n: 1 })], ['2', t('slotN', { n: 2 })], ['3', t('slotN', { n: 3 })], ['0', t('slotBg')]], { onChange: function (v) { s.c = +v; commit(t('colourSlotNow', { n: v })); } }), 'sslot'));
        var g2 = h('div', { class: 'igmo-grid2' });
        [['x', 'x', -50, 150], ['y', 'y', -50, 150], ['w', t('width'), 1, 300], ['h', t('height'), 1, 300]].forEach(function (f) { g2.appendChild(tag(F.number(f[1], s[f[0]], { min: f[2], max: f[3], step: 0.5, unit: t('unitsShort'), onChange: function (v) { s[f[0]] = v; commit(t('changed')); } }), 'sf' + f[0])); });
        out.push(g2);
        out.push(tag(F.range(t('rotation'), s.rot || 0, { min: 0, max: 359, step: 1, unit: '°', onInput: function (v) { s.rot = v; draw(); }, onChange: function (v) { s.rot = v; commit(t('rotated'), true); } }), 'srot'));
        if (STROKES[s.type]) out.push(tag(F.number(t('strokeWidth'), s.sw || 4, { min: 0.5, max: 40, step: 0.5, unit: t('unitsShort'), onChange: function (v) { s.sw = v; commit(t('changed')); } }), 'ssw'));
        if (s.type === 'wave' || s.type === 'zigzag') out.push(tag(F.number(t('waves'), s.n || 2, { min: 1, max: 12, step: 1, onChange: function (v) { s.n = Math.round(v); commit(t('changed')); } }), 'sn'));
        if (s.type === 'rect') out.push(tag(F.range(t('rounded'), s.round || 0, { min: 0, max: 100, step: 5, unit: '%', onChange: function (v) { s.round = v; commit(t('changed')); } }), 'sround'));
        out.push(tag(F.range(t('opacity'), s.op == null ? 100 : s.op, { min: 10, max: 100, step: 5, unit: '%', onInput: function (v) { s.op = v; draw(); }, onChange: function (v) { s.op = v; commit(t('changed'), true); } }), 'sop'));
        out.push(h('div', { class: 'igs-actions' }, ctx.button(t('duplicate'), { icon: 'copy', onClick: duplicateShape }), ctx.button(t('toFront'), { icon: 'layers', onClick: function () { reorder(1); } }), ctx.button(t('toBack'), { icon: 'layers', onClick: function () { reorder(-1); } }), ctx.button(t('deleteBtn'), { icon: 'trash', class: 'igs-danger', onClick: deleteShape })));
        out.push(h('p', { class: 'igs-muted', text: t('unitsHelp') }));
        return out;
      }
      out.push(h('h4', { text: t('printProps') }));
      out.push(tag(F.text(t('name'), p.name, { max: 40, onChange: function (v) { p.name = String(v).trim().slice(0, 40) || p.name; commit(t('renamed')); } }), 'pname'));
      out.push(tag(F.choice(t('repeat'), p.repeat, REPEATS.map(function (r) { return [r, t('rep_' + r)]; }), { onChange: function (v) { p.repeat = v; commit(t('repeatNow', { r: t('rep_' + v) })); } }), 'prep'));
      out.push(h('p', { class: 'igs-muted', text: t('repHelp_' + p.repeat) }));
      out.push(tag(F.number(t('scale'), p.scale, { min: 1, max: 60, step: 0.5, unit: 'cm', onChange: function (v) { p.scale = v; commit(t('scaleNow', { n: IG.num(v, 1) })); } }), 'pscale'));
      out.push(h('p', { class: 'igs-muted', text: t('scaleHelp') }));
      out.push(h('h4', { text: t('colorways', { n: p.colorways.length, max: MAX_CW }) }));
      out.push(tag(F.choice(t('activeCw'), String(p.cw), p.colorways.map(function (c, i) { return [String(i), c.name]; }), { onChange: function (v) { p.cw = +v; commit(t('cwNow', { name: p.colorways[p.cw].name })); } }), 'pcw'));
      var cw = p.colorways[p.cw];
      out.push(tag(F.text(t('cwName'), cw.name, { max: 30, onChange: function (v) { cw.name = String(v).trim().slice(0, 30) || cw.name; commit(t('renamed')); } }), 'cwname'));
      out.push(h('div', { class: 'igmo-grid2' },
        tag(F.color(t('slotBg'), cw.bg, { onChange: function (v) { cw.bg = v; commit(t('colourChanged')); } }), 'cwbg'),
        tag(F.color(t('slotN', { n: 1 }), cw.c[0], { onChange: function (v) { cw.c[0] = v; commit(t('colourChanged')); } }), 'cwc0'),
        tag(F.color(t('slotN', { n: 2 }), cw.c[1], { onChange: function (v) { cw.c[1] = v; commit(t('colourChanged')); } }), 'cwc1'),
        tag(F.color(t('slotN', { n: 3 }), cw.c[2], { onChange: function (v) { cw.c[2] = v; commit(t('colourChanged')); } }), 'cwc2')));
      out.push(h('div', { class: 'igs-actions' },
        ctx.button(t('addCw'), { icon: 'plus', onClick: function () { if (p.colorways.length >= MAX_CW) { ctx.announce(t('maxCw', { n: MAX_CW })); return; } var c = JSON.parse(JSON.stringify(cw)); c.name = t('cwN', { n: p.colorways.length + 1 }); c.bg = c.c[0]; c.c[0] = cw.bg; p.colorways.push(c); p.cw = p.colorways.length - 1; commit(t('cwAdded')); } }),
        ctx.button(t('delCw'), { icon: 'trash', class: 'igs-danger', onClick: function () { if (p.colorways.length < 2) { ctx.announce(t('lastCw')); return; } p.colorways.splice(p.cw, 1); p.cw = Math.max(0, p.cw - 1); commit(t('deleted', { what: cw.name })); } })));
      out.push(h('p', { class: 'igs-muted', text: t('cwHelp') }));
      if (view === 'motif') { out.push(h('h4', { text: t('addShapeTitle') })); out.push(h('p', { class: 'igs-muted', text: t('addShapeHelp') })); }
      out.push(h('h4', { text: t('challenges') }));
      out.push(challengeList());
      return out;
    }
    function challengeList() {
      var oneMotif = S.prints.some(function (p) { return p.shapes.length >= 1 && S.looks.some(function (lk) { return Object.keys(lk.zones).some(function (z) { return lk.zones[z].t === 'print' && lk.zones[z].p === p.id; }); }); });
      var five = S.looks.length >= 5;
      return h('ul', { class: 'igmo-challenges' },
        h('li', { 'data-ok': String(oneMotif) }, h('span', { class: 'igmo-mark', 'aria-hidden': 'true', text: oneMotif ? '✓' : '·' }), h('strong', { text: t('ch1') }), ' ', t(oneMotif ? 'ch1Ok' : 'ch1Todo')),
        h('li', { 'data-ok': String(five) }, h('span', { class: 'igmo-mark', 'aria-hidden': 'true', text: five ? '✓' : '·' }), h('strong', { text: t('ch2') }), ' ', t('ch2State', { n: S.looks.length })));
    }
    function garmentInspector() {
      var lk = look(), out = []; if (!lk) return [h('p', { class: 'igs-muted', text: t('noLooks') })];
      if (selZone) {
        var f = lk.zones[selZone];
        out.push(h('h4', { text: t('zoneTitle', { z: zoneName(selZone), look: lk.name }) }));
        out.push(tag(F.choice(t('fillType'), f.t, [['solid', t('fill_solid')], ['print', t('fill_print')]], { onChange: function (v) { if (v === 'print' && !S.prints.length) { ctx.announce(t('noPrints')); renderSide(); return; } f.t = v; if (v === 'print' && !printById(f.p)) { f.p = S.prints[S.curPrint].id; f.w = 0; } commit(t('zoneFilled', { z: zoneName(selZone), fill: fillName(f) })); } }), 'ztype'));
        if (f.t === 'print' && printById(f.p)) {
          var p = printById(f.p);
          out.push(tag(F.select(t('whichPrint'), f.p, S.prints.map(function (x) { return [x.id, x.name]; }), { onChange: function (v) { f.p = v; f.w = 0; commit(t('zoneFilled', { z: zoneName(selZone), fill: fillName(f) })); } }), 'zprint'));
          out.push(tag(F.select(t('whichCw'), String(f.w || 0), p.colorways.map(function (c, i) { return [String(i), c.name]; }), { onChange: function (v) { f.w = +v; commit(t('zoneFilled', { z: zoneName(selZone), fill: fillName(f) })); } }), 'zcw'));
          out.push(h('p', { class: 'igs-muted', text: t('zonePrintHelp', { cm: IG.num(p.scale, 1) }) }));
        } else {
          out.push(colourPicker(t('zoneColour'), f.c || '#ffffff', 'zc', function (v) { f.t = 'solid'; f.c = v; commit(t('zoneFilled', { z: zoneName(selZone), fill: fillName(f) })); }));
        }
        out.push(h('div', { class: 'igs-actions' }, ctx.button(t('applyAll'), { icon: 'bucket', onClick: function () { Object.keys(lk.zones).forEach(function (z) { lk.zones[z] = JSON.parse(JSON.stringify(f)); }); commit(t('appliedAll')); } })));
        return out;
      }
      out.push(h('h4', { text: t('lookProps') }));
      out.push(tag(F.text(t('name'), lk.name, { max: 40, onChange: function (v) { lk.name = String(v).trim().slice(0, 40) || lk.name; commit(t('renamed')); } }), 'lname'));
      out.push(tag(F.select(t('garment'), lk.kind, KINDS.map(function (k) { return [k, t('kind_' + k)]; }), { onChange: function (v) { setKind(lk, v); commit(t('kindNow', { k: t('kind_' + v) })); } }), 'lkind'));
      out.push(h('p', { class: 'igs-muted', text: t('zonesHelp') }));
      out.push(h('h4', { text: t('challenges') }), challengeList());
      return out;
    }
    function lineInspector() {
      var out = [h('h4', { text: t('collectionProps') })];
      out.push(tag(F.text(t('collectionName'), S.title, { max: 60, onChange: function (v) { S.title = String(v).slice(0, 60); commit(t('renamed')); } }), 'ctitle'));
      out.push(h('p', { class: 'igs-muted', text: t('lineHelp') }));
      out.push(h('h4', { text: t('challenges') }), challengeList());
      return out;
    }
    function toteInspector() {
      var T = S.tote, out = [h('h4', { text: t('toteTitle') })];
      [['w', 'toteW', 20, 60], ['h', 'toteH', 20, 60], ['g', 'toteG', 0, 20], ['hl', 'toteHL', 20, 90], ['hw', 'toteHW', 2, 6], ['seam', 'toteSeam', 0.5, 2], ['hem', 'toteHem', 1, 6]].forEach(function (f) {
        out.push(tag(F.number(t(f[1]), T[f[0]], { min: f[2], max: f[3], step: 0.5, unit: 'cm', onChange: function (v) { T[f[0]] = v; commit(t('toteChanged')); } }), 'tote' + f[0]));
      });
      out.push(tag(F.check(t('totePocket'), !!T.pocket, { onChange: function (v) { T.pocket = !!v; commit(t('toteChanged')); } }), 'totepocket'));
      var n = toteLayout().count;
      out.push(h('p', { class: 'igs-result', 'data-kind': 'ok' }, h('strong', { text: t('sheetsNeeded', { n: n + 1 }) }), t('sheetsHelp')));
      var tb = h('table', { class: 'igs-table' }, h('caption', { text: t('cutTable') }), h('thead', null, h('tr', null, h('th', { scope: 'col', text: t('piece') }), h('th', { scope: 'col', text: t('cut') }), h('th', { scope: 'col', text: t('cutSize') }))));
      var tbody = h('tbody'); totePieces().forEach(function (p) { tbody.appendChild(h('tr', null, h('th', { scope: 'row', text: t('pc_' + p.id) }), h('td', { class: 'igs-numcell', text: p.onFold ? t('cutFoldShort') : '×' + p.cut }), h('td', { class: 'igs-numcell', text: IG.num(p.w, 1) + ' × ' + IG.num(p.h, 1) + ' cm' }))); });
      tb.appendChild(tbody); out.push(h('div', { class: 'igs-table-wrap' }, tb));
      out.push(h('div', { class: 'igs-actions' }, ctx.button(t('printPattern'), { icon: 'file', class: 'igs-primary', onClick: printTote })));
      out.push(h('h4', { text: t('scaleCheckTitle') }), h('p', { class: 'igs-note', text: t('scaleCheck') }));
      var steps = h('ol', { class: 'igmo-steps' }); ['sew1', 'sew2', 'sew3', 'sew4', 'sew5'].forEach(function (k) { steps.appendChild(h('li', { text: t(k, { s: IG.num(T.seam, 1), hem: IG.num(T.hem, 1) }) })); });
      out.push(h('h4', { text: t('sewTitle') }), steps);
      return out;
    }
    function summary() {
      if (view === 'motif' || view === 'repeat') {
        var p = pr(); if (!p) return t('noPrints');
        var base = t('summaryPrint', { name: p.name, rep: t('rep_' + p.repeat).toLowerCase(), cm: IG.num(p.scale, 1), n: p.shapes.length, cw: p.colorways[p.cw].name, cws: p.colorways.length });
        return base + ' ' + p.shapes.map(function (s) { return t('shape_' + s.type) + ' (' + (s.c ? p.colorways[p.cw].c[s.c - 1] : p.colorways[p.cw].bg) + ')'; }).join(', ') + '.';
      }
      if (view === 'garment') {
        var lk = look(); if (!lk) return t('noLooks');
        return t('summaryLook', { name: lk.name, kind: t('kind_' + lk.kind) }) + ' ' + G[lk.kind].zones.map(function (z) { return zoneName(z) + ': ' + fillName(lk.zones[z]); }).join('; ') + '.';
      }
      if (view === 'line') return t('summaryLine', { title: S.title || t('collectionDefault'), n: S.looks.length }) + ' ' + lineDesc() + '.';
      var T = S.tote; return t('summaryTote', { w: IG.num(T.w, 1), h: IG.num(T.h, 1), g: IG.num(T.g, 1), s: IG.num(T.seam, 1) }) + ' ' + totePieces().map(function (p) { return t('pc_' + p.id) + ' ×' + p.cut + ' ' + IG.num(p.w, 1) + ' × ' + IG.num(p.h, 1) + ' cm'; }).join('; ') + '.';
    }

    /* ---------- Herramientas ---------- */
    var shapeSel = h('select', { 'aria-label': t('shapeKind') });
    SHAPES.forEach(function (k) { shapeSel.appendChild(h('option', { value: k, text: t('shape_' + k) })); });
    shapeSel.addEventListener('change', function () { shapeKind = shapeSel.value; });
    ctx.setTools([
      { id: 'motif', label: t('toolMotif'), icon: 'star' },
      { id: 'repeat', label: t('toolRepeat'), icon: 'grid' },
      { id: 'garment', label: t('toolGarment'), icon: 'player' },
      { id: 'line', label: t('toolLine'), icon: 'layers' },
      { id: 'pattern', label: t('toolPattern'), icon: 'scale' },
      { separator: true },
      { node: h('label', { class: 'igs-inline-select' }, h('span', { text: t('shapeKind') }), shapeSel) },
      { id: 'add', label: t('addShape'), icon: 'plus', primary: true, action: function () { addShape(shapeKind); } },
      { id: 'pen', label: t('penBtn'), icon: 'pen', action: togglePen, level: 'more' },
      { id: 'dup', label: t('duplicate'), icon: 'copy', level: 'more', action: duplicateShape },
      { id: 'del', label: t('deleteBtn'), icon: 'trash', level: 'more', action: deleteShape },
      { id: 'print', label: t('printPattern'), icon: 'file', level: 'more', action: function () { printTote(); } }
    ], { initial: 'motif' });
    Array.prototype.forEach.call(ctx.toolbar.querySelectorAll('.igs-btn'), function (b) { if (b.textContent.trim() === t('penBtn')) { b.dataset.igmo = 'pen'; b.setAttribute('aria-pressed', 'false'); } });
    function syncToolbar() { shapeSel.value = shapeKind; }

    /* ---------- Exportaciones ---------- */
    function svgToPng(svgStr, w, hh, name, credit) {
      var img = new Image(), url = URL.createObjectURL(new Blob([svgStr], { type: 'image/svg+xml' }));
      img.onload = function () {
        var c = D.createElement('canvas'); c.width = Math.round(w); c.height = Math.round(hh); var g = c.getContext('2d'); g.fillStyle = '#ffffff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
        ctx.canvasBlob(credit ? ctx.canvasWithCredit(c, '#ffffff') : c).then(function (b) { ctx.download(b, name); });
      };
      img.onerror = function () { URL.revokeObjectURL(url); ctx.announce(t('exportError')); };
      img.src = url;
    }
    function base(kind) { return (LANG === 'en' ? kind.en : kind.es) + '-' + ctx.stamp(); }
    /* Azulejo repetible: el dibujo ocupa exactamente la celda de arriba; debajo va una franja con la marca,
       que no forma parte de lo que se repite. */
    function tileSvg() {
      var p = pr(), sp = repeatSpec(p.repeat), mid = 'm-' + p.id + '-' + p.cw, strip = Math.max(8, sp.ch * 0.07), k = p.scale / 100;
      return '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="' + NS + '" width="' + f2(sp.cw * k) + 'cm" height="' + f2((sp.ch + strip) * k) + 'cm" viewBox="0 0 ' + sp.cw + ' ' + f2(sp.ch + strip) + '" role="img" aria-label="' + esc(p.name) + '"><title>' + esc(p.name + ' · ' + p.colorways[p.cw].name) + '</title><desc>' + esc(t('tileDesc', { rep: t('rep_' + p.repeat).toLowerCase(), cm: IG.num(p.scale, 1), w: sp.cw, h: sp.ch })) + '</desc><defs>' + motifDef(p, p.cw, mid) + '</defs>' +
        '<svg id="tile" x="0" y="0" width="' + sp.cw + '" height="' + sp.ch + '" viewBox="0 0 ' + sp.cw + ' ' + sp.ch + '" overflow="hidden">' + cellSvg(p, p.cw, mid) + '</svg>' +
        '<rect x="0" y="' + sp.ch + '" width="' + sp.cw + '" height="' + f2(strip) + '" fill="#f4f7fa"/><text x="' + (sp.cw - 2) + '" y="' + f2(sp.ch + strip * 0.68) + '" text-anchor="end" font-size="' + f2(strip * 0.42) + '" fill="#17395c" font-family="Atkinson Hyperlegible, Arial, sans-serif">IRIS GREEN · irisgreen.eu</text></svg>';
    }
    function tileOnlySvg() { var p = pr(), sp = repeatSpec(p.repeat), mid = 'm-' + p.id + '-' + p.cw; return '<svg xmlns="' + NS + '" width="' + sp.cw * 10.24 + '" height="' + sp.ch * 10.24 + '" viewBox="0 0 ' + sp.cw + ' ' + sp.ch + '"><defs>' + motifDef(p, p.cw, mid) + '</defs>' + cellSvg(p, p.cw, mid) + '</svg>'; }
    ctx.addExport(t('exportTilePng'), function () {
      var p = pr(); if (!p) { ctx.announce(t('noPrints')); return; }
      var sp = repeatSpec(p.repeat), k = 10.24;
      /* canvasWithCredit añade la franja con la marca debajo: el azulejo sigue siendo la celda de arriba, sin costuras */
      svgToPng(tileOnlySvg(), sp.cw * k, sp.ch * k, base({ es: 'azulejo-estampado', en: 'repeat-tile' }) + '.png', true);
    });
    ctx.addExport(t('exportTileSvg'), function () { if (!pr()) { ctx.announce(t('noPrints')); return; } ctx.download(new Blob([tileSvg()], { type: 'image/svg+xml' }), base({ es: 'azulejo-estampado', en: 'repeat-tile' }) + '.svg'); });
    ctx.addExport(t('exportSwatchPng'), function () {
      var p = pr(); if (!p) { ctx.announce(t('noPrints')); return; }
      var W = 1600, H = 1000, uses = {}; uses[p.id + '|' + p.cw] = true;
      var svg = '<svg xmlns="' + NS + '" width="' + W + '" height="' + H + '" viewBox="0 0 ' + f2(p.scale * 4.8) + ' ' + f2(p.scale * 3) + '"><defs>' + patternDefs(uses, null) + '</defs><rect width="100%" height="100%" fill="url(#pt-' + p.id + '-' + p.cw + ')"/></svg>';
      svgToPng(svg, W, H, base({ es: 'tejido', en: 'fabric' }) + '.png', true);
    });
    function garmentExportSvg() {
      var lk = look(), g = G[lk.kind], b = g.box, uses = {}, gap = b[2] * 0.12, fr = garmentSvg(lk, 'front', uses, false), bk = garmentSvg(lk, 'back', uses, false), vw = b[2] * 2 + gap + 4, vh = b[3] + 20;
      var font = 'font-family="Atkinson Hyperlegible, Arial, sans-serif"';
      return { w: vw, h: vh, svg: '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="' + NS + '" width="' + f2(vw * 10) + '" height="' + f2(vh * 10) + '" viewBox="' + f2(b[0] - 2) + ' ' + f2(b[1] - 8) + ' ' + f2(vw) + ' ' + f2(vh) + '" role="img" aria-label="' + esc(lk.name) + '"><title>' + esc(lk.name) + '</title><desc>' + esc(summaryFor('garment')) + '</desc><defs>' + patternDefs(uses, null) + '</defs>' +
        '<rect x="' + f2(b[0] - 2) + '" y="' + f2(b[1] - 8) + '" width="' + f2(vw) + '" height="' + f2(vh) + '" fill="#ffffff"/>' +
        '<text x="' + f2(b[0]) + '" y="' + f2(b[1] - 3) + '" font-size="3.4" font-weight="700" ' + font + ' fill="#172b42">' + esc(lk.name + ' · ' + t('kind_' + lk.kind)) + '</text>' + fr + '<g transform="translate(' + f2(b[2] + gap) + ',0)">' + bk + '</g>' +
        '<text x="' + f2(b[0] + b[2] / 2) + '" y="' + f2(b[1] + b[3] + 5) + '" text-anchor="middle" font-size="2.6" ' + font + ' fill="#44586c">' + esc(t('front')) + '</text><text x="' + f2(b[0] + b[2] * 1.5 + gap) + '" y="' + f2(b[1] + b[3] + 5) + '" text-anchor="middle" font-size="2.6" ' + font + ' fill="#44586c">' + esc(t('back')) + '</text>' +
        '<text x="' + f2(b[0] - 2 + vw - 1.5) + '" y="' + f2(b[1] - 8 + vh - 1.5) + '" text-anchor="end" font-size="1.8" ' + font + ' fill="#17395c">IRIS GREEN · irisgreen.eu</text></svg>' };
    }
    function summaryFor(v) { var keep = view; view = v; var s = summary(); view = keep; return s; }
    ctx.addExport(t('exportGarmentSvg'), function () { if (!look()) { ctx.announce(t('noLooks')); return; } ctx.download(new Blob([garmentExportSvg().svg], { type: 'image/svg+xml' }), base({ es: 'prenda', en: 'garment' }) + '.svg'); });
    ctx.addExport(t('exportGarmentPng'), function () { if (!look()) { ctx.announce(t('noLooks')); return; } var e = garmentExportSvg(); svgToPng(e.svg, e.w * 20, e.h * 20, base({ es: 'prenda', en: 'garment' }) + '.png', false); });
    ctx.addExport(t('exportLineSvg'), function () { if (!S.looks.length) { ctx.announce(t('noLooks')); return; } ctx.download(new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + lineView(0, 0, false, true)], { type: 'image/svg+xml' }), base({ es: 'linea-coleccion', en: 'collection-line' }) + '.svg'); });
    ctx.addExport(t('exportLinePng'), function () {
      if (!S.looks.length) { ctx.announce(t('noLooks')); return; }
      var s = lineView(0, 0, false, true), m = /width="([\d.]+)" height="([\d.]+)"/.exec(s);
      svgToPng(s, +m[1] * 1.5, +m[2] * 1.5, base({ es: 'linea-coleccion', en: 'collection-line' }) + '.png', false);
    });
    ctx.addExport(t('exportPatternSvg'), function () {
      var L = toteLayout(), inner = ''; L.pieces.forEach(function (p) { inner += pieceSvg(p); }); inner += testSquare();
      var svg = '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="' + NS + '" width="' + L.W + 'mm" height="' + L.H + 'mm" viewBox="0 0 ' + L.W + ' ' + L.H + '" role="img" aria-label="' + esc(t('printTitle')) + '"><title>' + esc(t('printTitle')) + '</title><desc>' + esc(summaryFor('pattern')) + '</desc><rect width="' + L.W + '" height="' + L.H + '" fill="#ffffff"/>' + inner + creditSvg(L.W, L.H) + '</svg>';
      ctx.download(new Blob([svg], { type: 'image/svg+xml' }), base({ es: 'patron-bolsa-1a1', en: 'tote-pattern-1to1' }) + '.svg');
    });
    ctx.addExport(t('printPattern'), function () { printTote(); }, 'file');
    ctx.command('addshape', t('addShape'), t('toolMotif'), function () { addShape(shapeKind); });
    ctx.command('pen', t('penBtn'), t('toolMotif'), togglePen);
    ctx.command('printtote', t('printPattern'), t('toolPattern'), printTote);
    ctx.command('newlook', t('newLook'), t('toolLine'), function () { addLook('tshirt'); });
    ctx.command('line', t('toolLine'), t('exportLinePng'), function () { ctx.selectTool('line'); });
    ctx.command('repeat', t('toolRepeat'), t('repeat'), function () { ctx.selectTool('repeat'); });

    /* ---------- Estampados de partida ---------- */
    function cw(name, bg, a, b, c) { return { name: name, bg: bg, c: [a, b, c] }; }
    function sh(type, x, y, w, hh, c, extra) { return Object.assign({ id: nid('s'), type: type, x: x, y: y, w: w, h: hh, rot: 0, c: c, sw: 4, op: 100 }, extra || {}); }
    function presetPrint(k) {
      var p = { id: nid('p'), name: t('preset_' + k), repeat: 'straight', scale: 8, cw: 0, shapes: [], colorways: [cw(t('cw_navy'), '#f4efe6', '#17395c', '#b3261e', '#e0b000')] };
      if (k === 'dots') { p.repeat = 'halfdrop'; p.scale = 6; p.shapes = [sh('circle', 50, 50, 34, 34, 1)]; p.colorways = [cw(t('cw_rose'), '#f6d6e0', '#b3261e', '#ffffff', '#17395c'), cw(t('cw_night'), '#17395c', '#ffffff', '#e0b000', '#6fa8dc'), cw(t('cw_lemon'), '#fff4c2', '#2e7d32', '#17395c', '#b3261e')]; }
      else if (k === 'stripes') { p.scale = 5; p.shapes = [sh('rect', 50, 25, 100, 26, 1), sh('rect', 50, 66, 100, 6, 2)]; p.colorways = [cw(t('cw_navy'), '#f4efe6', '#17395c', '#b3261e', '#e0b000'), cw(t('cw_sea'), '#ffffff', '#1f5f8b', '#6fa8dc', '#17395c')]; }
      else if (k === 'grid') { p.scale = 3; p.shapes = [sh('rect', 50, 50, 100, 34, 1, { op: 55 }), sh('rect', 50, 50, 34, 100, 1, { op: 55 })]; p.colorways = [cw(t('cw_red'), '#ffffff', '#b3261e', '#17395c', '#e0b000'), cw(t('cw_sea'), '#ffffff', '#1f5f8b', '#17395c', '#e0b000')]; }
      else if (k === 'leaves') { p.repeat = 'halfdrop'; p.scale = 9; p.shapes = [sh('line', 44, 50, 34, 3, 3, { rot: 60, sw: 2 }), sh('leaf', 36, 38, 24, 44, 1, { rot: -30 }), sh('leaf', 62, 60, 18, 34, 2, { rot: 38 }), sh('circle', 80, 20, 9, 9, 3), sh('circle', 16, 82, 6, 6, 3)]; p.colorways = [cw(t('cw_garden'), '#f4efe6', '#2e7d32', '#9bc67a', '#d86b00'), cw(t('cw_night'), '#17395c', '#9bc67a', '#6fa8dc', '#e0b000'), cw(t('cw_terracotta'), '#fbe3d0', '#b3261e', '#d86b00', '#17395c')]; }
      else if (k === 'waves') { p.scale = 6; p.shapes = [sh('wave', 50, 30, 100, 18, 1, { n: 2, sw: 5 }), sh('wave', 50, 72, 100, 10, 2, { n: 4, sw: 3 })]; p.colorways = [cw(t('cw_sea'), '#e8f3fa', '#1f5f8b', '#0b8f8f', '#17395c')]; }
      else if (k === 'mine') { p.repeat = 'brick'; p.scale = 10; p.name = t('exMyMotif'); p.shapes = [sh('star', 50, 44, 42, 42, 1, { rot: 8 }), sh('zigzag', 50, 84, 56, 10, 2, { n: 3, sw: 4 }), sh('ring', 14, 16, 16, 16, 3, { sw: 4 }), sh('circle', 86, 18, 7, 7, 2)]; p.colorways = [cw(t('cw_night'), '#17395c', '#e0b000', '#6fa8dc', '#c27ba0'), cw(t('cw_lemon'), '#fff4c2', '#5a49a8', '#b3261e', '#0b8f8f'), cw(t('cw_mono'), '#ffffff', '#101820', '#7d8b99', '#101820')]; }
      return p;
    }
    function fillSolid(c) { return { t: 'solid', c: c }; }
    function fillPrint(p, w) { return { t: 'print', p: p.id, w: w || 0 }; }
    function blank() { return { v: 1, title: '', prints: [], curPrint: 0, looks: [], curLook: 0, tote: { w: 38, h: 42, g: 10, hl: 60, hw: 3, seam: 1, hem: 3, pocket: true } }; }
    function ex(id) {
      S = blank(); seq = 0; selShape = null; selZone = null; selPiece = null; var tool = 'motif';
      if (id === 'motif') {
        var lv = presetPrint('leaves'); lv.name = t('exOneMotif'); S.prints.push(lv); S.title = t('exOneMotifTitle');
        var ts = newLook('tshirt', t('exLookLeaves')); ts.zones.body = fillPrint(lv, 0); ts.zones.sleeves = fillSolid('#2e7d32'); ts.zones.neck = fillSolid('#2e7d32'); ts.zones.pocket = fillPrint(lv, 2); S.looks.push(ts);
        tool = 'repeat';
      } else if (id === 'dots') {
        var dt = presetPrint('dots'); S.prints.push(dt); S.title = t('exDotsTitle');
        var tsd = newLook('tshirt', t('exLookDots')); tsd.zones.body = fillPrint(dt, 0); tsd.zones.sleeves = fillSolid('#b3261e'); tsd.zones.neck = fillSolid('#ffffff'); tsd.zones.pocket = fillSolid('#b3261e'); S.looks.push(tsd);
        tool = 'garment';
      } else if (id === 'hoodie') {
        var mm = presetPrint('mine'); S.prints.push(mm); S.title = t('exHoodieTitle');
        var hd = newLook('hoodie', t('exLookHoodie')); hd.zones.body = fillPrint(mm, 0); hd.zones.sleeves = fillSolid('#17395c'); hd.zones.hood = fillSolid('#e0b000'); hd.zones.rib = fillSolid('#e0b000'); hd.zones.pocket = fillSolid('#17395c'); S.looks.push(hd);
        var bn = newLook('beanie', t('exLookBeanie')); bn.zones.crown = fillPrint(mm, 2); bn.zones.brim = fillSolid('#101820'); bn.zones.pompom = fillSolid('#e0b000'); S.looks.push(bn);
        tool = 'garment';
      } else if (id === 'capsule') {
        var st = presetPrint('stripes'), lf = presetPrint('leaves'), dd = presetPrint('dots'); dd.colorways[0] = cw(t('cw_navy'), '#17395c', '#f4efe6', '#b3261e', '#e0b000');
        S.prints.push(st, lf, dd); S.title = t('exCapsuleTitle');
        var a = newLook('tshirt', t('exCap1')); a.zones.body = fillPrint(st, 0); a.zones.sleeves = fillPrint(st, 0); a.zones.neck = fillSolid('#17395c'); a.zones.pocket = fillSolid('#b3261e');
        var b = newLook('trousers', t('exCap2')); b.zones.legs = fillSolid('#d9cbb4'); b.zones.waistband = fillSolid('#d9cbb4'); b.zones.pocket = fillSolid('#c9b99f'); b.zones.cuffs = fillSolid('#d9cbb4');
        var c = newLook('skirt', t('exCap3')); c.zones.body = fillPrint(lf, 0); c.zones.waistband = fillSolid('#2e7d32'); c.zones.hem = fillSolid('#2e7d32'); c.zones.pocket = fillPrint(lf, 0);
        var d = newLook('dress', t('exCap4')); d.zones.bodice = fillPrint(dd, 0); d.zones.skirt = fillPrint(dd, 0); d.zones.sleeves = fillPrint(dd, 0); d.zones.neck = fillSolid('#b3261e'); d.zones.belt = fillSolid('#b3261e');
        var e = newLook('jacket', t('exCap5')); e.zones.body = fillSolid('#17395c'); e.zones.sleeves = fillSolid('#17395c'); e.zones.collar = fillPrint(st, 1); e.zones.pocket = fillSolid('#17395c');
        S.looks.push(a, b, c, d, e); tool = 'line';
      } else if (id === 'tote') {
        var tp = presetPrint('leaves'); tp.colorways.unshift(cw(t('cw_canvas'), '#e9dfcc', '#17395c', '#b3261e', '#2e7d32')); S.prints.push(tp); S.title = t('exToteTitle');
        var tb = newLook('tote', t('exLookTote')); tb.zones.body = fillSolid('#e9dfcc'); tb.zones.handles = fillSolid('#17395c'); tb.zones.pocket = fillPrint(tp, 0); S.looks.push(tb);
        tool = 'pattern';
      }
      S.curPrint = 0; S.curLook = 0;
      if (view !== tool) ctx.selectTool(tool); else { renderSide(); draw(); }
    }

    function onTool(id) { view = id; vp.dataset.tool = id; if (id !== 'motif' && penMode) togglePen(); if (id === 'pattern' && !selPiece) selPiece = 'body'; renderSide(); draw(); }
    if (root.ResizeObserver) new ResizeObserver(function () { draw(); }).observe(vp);

    S = blank(); renderSide(); draw();
    return {
      serialize: function () { return JSON.parse(JSON.stringify(Object.assign({}, S, { seq: seq }))); },
      restore: function (st) {
        S = JSON.parse(JSON.stringify(st)); seq = Math.max(seq, S.seq || 0); delete S.seq;
        S.curPrint = Math.max(0, Math.min(S.curPrint, S.prints.length - 1)); S.curLook = Math.max(0, Math.min(S.curLook, S.looks.length - 1));
        if (!shapeById(selShape)) selShape = null; if (selZone && (!look() || !look().zones[selZone])) selZone = null;
        renderSide(); draw();
      },
      validate: function (d) {
        function n(v, a, b) { return typeof v === 'number' && isFinite(v) && v >= a && v <= b; }
        function hex(v) { return typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v); }
        if (!d || !Array.isArray(d.prints) || !Array.isArray(d.looks) || d.prints.length > MAX_PRINTS || d.looks.length > MAX_LOOKS || typeof d.title !== 'string' || !d.tote) return false;
        var T = d.tote; if (!(n(T.w, 5, 100) && n(T.h, 5, 100) && n(T.g, 0, 40) && n(T.hl, 5, 200) && n(T.hw, 1, 10) && n(T.seam, 0, 5) && n(T.hem, 0, 10))) return false;
        var ids = {};
        var okPrints = d.prints.every(function (p) {
          if (!p || typeof p.id !== 'string' || typeof p.name !== 'string' || REPEATS.indexOf(p.repeat) < 0 || !n(p.scale, 0.5, 100) || !Array.isArray(p.colorways) || !p.colorways.length || p.colorways.length > MAX_CW || !n(p.cw, 0, p.colorways.length - 1)) return false;
          ids[p.id] = p.colorways.length;
          return p.colorways.every(function (c) { return c && typeof c.name === 'string' && hex(c.bg) && Array.isArray(c.c) && c.c.length === 3 && c.c.every(hex); }) &&
            Array.isArray(p.shapes) && p.shapes.length <= MAX_SHAPES && p.shapes.every(function (s) {
              return s && typeof s.id === 'string' && (SHAPES.indexOf(s.type) >= 0 || s.type === 'pen') && n(s.x, -500, 500) && n(s.y, -500, 500) && n(s.w, 0, 1000) && n(s.h, 0, 1000) && n(s.c, 0, 3) &&
                (s.type !== 'pen' || (Array.isArray(s.pts) && s.pts.length <= 4000 && s.pts.every(function (q) { return Array.isArray(q) && q.length >= 2 && q.every(function (v) { return n(v, -10, 10); }); })));
            });
        });
        return okPrints && d.looks.every(function (lk) {
          return lk && typeof lk.id === 'string' && typeof lk.name === 'string' && G[lk.kind] && lk.zones && G[lk.kind].zones.every(function (z) { var f = lk.zones[z]; return f && ((f.t === 'solid' && hex(f.c)) || (f.t === 'print' && ids[f.p] && n(f.w || 0, 0, ids[f.p] - 1))); });
        });
      },
      start: function (id) { if (id === 'empty') { S = blank(); seq = 0; selShape = null; selZone = null; S.prints.push(presetPrint('blank')); S.looks.push(newLook('tshirt', t('lookN', { n: 1 }) + ' · ' + t('kind_tshirt'))); if (view !== 'motif') ctx.selectTool('motif'); else { renderSide(); draw(); } } else ex(id); },
      onTool: onTool,
      onKey: onKey
    };
  }
})(window);
