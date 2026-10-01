/* Iris Green · El taller · Papiroflexia y poliedros (R43) · diagramas originales.
   Grulla tradicional (base pájaro) y módulo Sonobe dibujados con geometría calculada:
   cada forma sale de reflejar el papel sobre la línea de pliegue real, no de un dibujo a mano alzada.
   Convención de líneas (Yoshizawa–Randlett): valle = rayas; monte = raya y dos puntos; pliegue ya marcado = línea fina.
   Devuelve primitivas y las convierte en SVG (el mismo SVG sirve para ver, imprimir y descargar). */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.IGPapiroDiag = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  /* ---------- Geometría 2D ---------- */
  function reflect(p, a, b) {
    var dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy, t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2;
    var fx = a[0] + dx * t, fy = a[1] + dy * t; return [2 * fx - p[0], 2 * fy - p[1]];
  }
  function side(p, a, b) { return (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]); }
  /* Parte de un polígono convexo a un lado de la recta a→b (s = +1 o −1). */
  function clip(P, a, b, s) {
    var out = [];
    for (var i = 0; i < P.length; i++) {
      var p = P[i], q = P[(i + 1) % P.length], dp = side(p, a, b) * s, dq = side(q, a, b) * s;
      if (dp >= -1e-9) out.push(p);
      if ((dp > 1e-9 && dq < -1e-9) || (dp < -1e-9 && dq > 1e-9)) { var t = dp / (dp - dq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); }
    }
    return out;
  }
  function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
  function mirror(p) { return [-p[0], p[1]]; }
  function mirrorAll(P) { return P.map(mirror).reverse(); }
  function rayHit(o, d, a, b) { /* o + t d con el segmento a-b */
    var ex = b[0] - a[0], ey = b[1] - a[1], den = d[0] * ey - d[1] * ex; if (Math.abs(den) < 1e-12) return null;
    var t = ((a[0] - o[0]) * ey - (a[1] - o[1]) * ex) / den; return [o[0] + d[0] * t, o[1] + d[1] * t];
  }

  /* ---------- Primitivas ---------- */
  function poly(pts, fill) { return { k: 'poly', pts: pts, fill: fill }; }
  function line(a, b, style) { return { k: 'line', a: a, b: b, style: style }; }
  function arrow(from, to, type, bend) { return { k: 'arrow', from: from, to: to, type: type || 'valley', bend: bend === undefined ? 0.35 : bend }; }
  function sym(kind, p, size) { return { k: kind, p: p, size: size || 0.28 }; }
  /* Flecha de pliegue: de un punto del papel a su reflejo sobre la línea a-b. */
  function farrow(p, a, b, type, bend) { return arrow(p, reflect(p, a, b), type, bend === undefined ? 0.3 : bend); }

  /* ---------- Grulla ---------- */
  var K = 2 - Math.SQRT2;                     /* 0,586: altura de los pliegues de cometa en la base preliminar */
  var T = [0, 0], L = [-1, 1], R = [1, 1], B = [0, 2];
  var KL = [-K, K], KR = [K, K], M = [0, K], Bp = [0, 2 * K - 2]; /* B' = punta del pétalo levantado */
  var Tp = [0, 2 * K];                        /* punta de arriba doblada hacia abajo */
  /* estrechar: bisectriz del ángulo en B entre B-KL y el eje */
  var FL = rayHit(B, [-Math.sin(Math.PI / 16), -Math.cos(Math.PI / 16)], KL, KR), FR = mirror(FL);
  var G = reflect(KL, B, FL);                 /* esquina que llega al centro al estrechar */
  /* pliegue invertido del cuello: pasa por C0 en el eje y forma 62° con la horizontal al girar la pata */
  var C0 = [0, 0.62], neckDir = [-Math.cos(62 * Math.PI / 180), -Math.sin(62 * Math.PI / 180)];
  var bis = [neckDir[0] + 0, neckDir[1] + 1], bl = Math.hypot(bis[0], bis[1]); bis = [bis[0] / bl, bis[1] / bl];
  var P1 = rayHit(C0, bis, FL, B);            /* donde la línea corta el borde exterior de la pata */
  var legL = [FL, M, B];                      /* pata izquierda (estrecha) */
  var legLkeep = clip(legL, P1, C0, side(FL, P1, C0) > 0 ? 1 : -1);
  var neck0 = clip(legL, P1, C0, side(B, P1, C0) > 0 ? 1 : -1).map(function (p) { return reflect(p, P1, C0); });
  var tip = reflect(B, P1, C0);
  /* cabeza: pliegue invertido cerca de la punta */
  var neckBase = lerp(P1, C0, 0.5), axis = [tip[0] - neckBase[0], tip[1] - neckBase[1]], alen = Math.hypot(axis[0], axis[1]); axis = [axis[0] / alen, axis[1] / alen];
  var hc = [tip[0] - axis[0] * 0.3, tip[1] - axis[1] * 0.3], headDir = [-0.86, 0.51];
  var hu = [axis[0] + headDir[0], axis[1] + headDir[1]], hl = Math.hypot(hu[0], hu[1]); hu = [hu[0] / hl, hu[1] / hl];
  var h1 = [hc[0] - hu[0], hc[1] - hu[1]], h2 = [hc[0] + hu[0], hc[1] + hu[1]];
  var sTip = side(tip, h1, h2) > 0 ? 1 : -1;
  var neckKeep = clip(neck0, h1, h2, -sTip), head = clip(neck0, h1, h2, sTip).map(function (p) { return reflect(p, h1, h2); });
  var headLine = [clipSeg(neck0, h1, h2)];
  function clipSeg(P, a, b) {
    var pts = [];
    for (var i = 0; i < P.length; i++) { var p = P[i], q = P[(i + 1) % P.length], dp = side(p, a, b), dq = side(q, a, b); if ((dp > 0) !== (dq > 0)) { var t = dp / (dp - dq); pts.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); } }
    return pts.length >= 2 ? [pts[0], pts[1]] : [a, b];
  }
  var neckFoldSeg = clipSeg(legL, P1, C0);
  var wingDown = [KL, KR, reflect(Bp, KL, KR)];
  var SQ = { T: [0, -1], R: [1, 0], B: [0, 1], L: [-1, 0] };

  function craneSteps() {
    var s = [];
    /* 1 */ s.push({ key: 'crane1', items: [poly([SQ.T, SQ.R, SQ.B, SQ.L], 'c'), line(SQ.T, SQ.B, 'valley'), line(SQ.L, SQ.R, 'valley'), arrow(lerp(SQ.B, SQ.L, 0.35), lerp(SQ.T, SQ.R, 0.35), 'foldUnfold', 0.45)] });
    /* 2 */ s.push({ key: 'crane2', items: [poly([SQ.T, SQ.R, SQ.B, SQ.L], 'w'), line(SQ.T, SQ.B, 'crease'), line(SQ.L, SQ.R, 'crease'), line([-0.5, -0.5], [0.5, 0.5], 'valley'), line([0.5, -0.5], [-0.5, 0.5], 'valley'), arrow([-0.62, 0.3], [0.3, -0.62], 'foldUnfold', 0.4), sym('turn', [1.05, -0.95])] });
    /* 3 */ s.push({ key: 'crane3', items: [poly([SQ.T, SQ.R, SQ.B, SQ.L], 'w'), line(SQ.T, SQ.B, 'mountain'), line(SQ.L, SQ.R, 'mountain'), line([-0.5, -0.5], [0.5, 0.5], 'valley'), line([0.5, -0.5], [-0.5, 0.5], 'valley'), arrow(SQ.L, [-0.12, 0.78], 'valley', 0.3), arrow(SQ.R, [0.12, 0.78], 'valley', -0.3), arrow(SQ.T, [0, 0.62], 'mountain', 0.25)] });
    /* 4 */ s.push({ key: 'crane4', items: [poly([T, R, B, L], 'c'), line(T, B, 'crease'), line(B, KL, 'valley'), line(B, KR, 'valley'), farrow([-0.62, 1.12], B, KL, 'valley', -0.3), farrow([0.62, 1.12], B, KR, 'valley', 0.3)] });
    /* 5 */ s.push({ key: 'crane5', items: [poly([T, R, B, L], 'c2'), poly([T, KR, B, KL], 'c'), poly([KL, M, B], 'w'), poly([KR, M, B], 'w'), line(M, B, 'edge'), line(KL, KR, 'valley'), arrow(lerp(T, M, 0.2), lerp(M, Tp, 0.7), 'valley', 0.55)] });
    /* 6 */ s.push({ key: 'crane6', items: [poly([T, R, B, L], 'c2'), poly([T, KR, B, KL], 'c'), poly([KL, M, B], 'w'), poly([KR, M, B], 'w'), poly([KL, KR, Tp], 'w2'), line(M, B, 'edge'), arrow(lerp(M, Tp, 0.8), lerp(T, M, 0.3), 'unfold', -0.55), arrow(lerp(KL, B, 0.35), lerp(L, B, 0.25), 'unfold', 0.35), arrow(lerp(KR, B, 0.35), lerp(R, B, 0.25), 'unfold', -0.35)] });
    /* 7 */ s.push({ key: 'crane7', items: [poly([T, R, B, L], 'c'), line(T, B, 'crease'), line(KL, KR, 'valley'), line(B, KL, 'mountain'), line(B, KR, 'mountain'), arrow(lerp(B, M, 0.08), [0, -0.62], 'valley', 0.25), arrow(lerp(L, B, 0.3), [-0.3, 1.05], 'push', 0), arrow(lerp(R, B, 0.3), [0.3, 1.05], 'push', 0)] });
    /* 8 */ s.push({ key: 'crane8', items: [poly([T, R, B, L], 'c2'), poly([KL, M, B], 'c'), poly([KR, M, B], 'c'), line(M, B, 'edge'), poly([KL, KR, Bp], 'c'), line(M, Bp, 'edge'), sym('turn', [1.1, -0.7]), sym('repeat', [1.1, 1.55])] });
    /* 9 */ s.push({ key: 'crane9', items: [poly([Bp, KR, B, KL], 'c2'), poly([KL, M, B], 'c'), poly([KR, M, B], 'c'), line(M, B, 'edge'), poly([KL, KR, Bp], 'c'), line(M, Bp, 'edge'), line(B, FL, 'valley'), line(B, FR, 'valley'), farrow(lerp(lerp(KL, B, 0.3), FL, 0.25), B, FL, 'valley', -0.45), farrow(lerp(lerp(KR, B, 0.3), FR, 0.25), B, FR, 'valley', 0.45), sym('repeat', [0.95, 1.55])] });
    var narrowBack = [Bp, KR, FR, B, FL, KL];
    /* 10 */ s.push({ key: 'crane10', items: [poly(narrowBack, 'c2'), poly([G, FL, B], 'c'), poly([G, FR, B], 'c'), line(lerp(G, B, 0), B, 'edge'), poly([KL, KR, Bp], 'c'), line(M, Bp, 'edge'), line(neckFoldSeg[0], neckFoldSeg[1], 'mountain'), line(mirror(neckFoldSeg[0]), mirror(neckFoldSeg[1]), 'mountain'), arrow(lerp(M, B, 0.8), lerp(neckBase, tip, 0.8), 'valley', -0.4), arrow(lerp(M, B, 0.8), mirror(lerp(neckBase, tip, 0.8)), 'valley', 0.4)] });
    var body = [Bp, KR, FR, mirror(P1), mirror(C0), C0, P1, FL, KL];
    var bodyFront = [KL, KR, Bp];
    function neckItems(withHead) {
      var it = [];
      var n = withHead ? neckKeep : neck0;
      it.push(poly(n, 'c3')); it.push(poly(mirrorAll(neck0), 'c3'));
      if (withHead) it.push(poly(head, 'c2'));
      return it;
    }
    /* 11 */ s.push({ key: 'crane11', items: [poly(clip(body, [-2, K], [2, K], 1).length ? body : body, 'c2')].concat(neckItems(false)).concat([poly(bodyFront, 'c'), line(M, Bp, 'edge'), line(headLine[0][0], headLine[0][1], 'mountain'), arrow(lerp(hc, tip, 0.6), lerp(hc, [hc[0] + headDir[0] * 0.3, hc[1] + headDir[1] * 0.3], 1), 'valley', -0.5)]) });
    /* 12 */ s.push({ key: 'crane12', items: [poly(body, 'c2')].concat(neckItems(true)).concat([poly(bodyFront, 'c'), line(M, Bp, 'edge'), line(KL, KR, 'valley'), arrow(lerp(M, Bp, 0.6), lerp(M, wingDown[2], 0.6), 'valley', 0.5), sym('repeat', [0.9, 1.4])]) });
    var bodyTop = [T, KR, KL];
    /* 13 */ s.push({ key: 'crane13', items: [].concat(neckItems(true)).concat([poly(bodyTop, 'c2'), poly(wingDown, 'c'), line(M, wingDown[2], 'edge')]) });
    return s;
  }

  /* ---------- Módulo Sonobe ---------- */
  function sonobeSteps() {
    var s = [], Q = [[0, 0], [1, 0], [1, 1], [0, 1]];
    s.push({ key: 'son1', items: [poly(Q, 'w'), line([0.5, 0], [0.5, 1], 'valley'), arrow([0.05, 0.55], [0.95, 0.55], 'foldUnfold', 0.3)] });
    s.push({ key: 'son2', items: [poly(Q, 'w'), line([0.5, 0], [0.5, 1], 'crease'), line([0.25, 0], [0.25, 1], 'valley'), line([0.75, 0], [0.75, 1], 'valley'), arrow([0.03, 0.4], [0.47, 0.4], 'valley', 0.35), arrow([0.97, 0.6], [0.53, 0.6], 'valley', 0.35)] });
    var A = [0.25, 0], Bq = [0.75, 0.5], C = [0.75, 1], Dq = [0.25, 0.5];
    s.push({ key: 'son3', items: [poly([[0.25, 0], [0.5, 0], [0.5, 1], [0.25, 1]], 'c'), poly([[0.5, 0], [0.75, 0], [0.75, 1], [0.5, 1]], 'c'), line([0.25, 0.5], [0.75, 1], 'valley'), line([0.75, 0.5], [0.25, 0], 'valley'), farrow([0.31, 0.9], [0.25, 0.5], [0.75, 1], 'valley', -0.3), farrow([0.69, 0.1], [0.75, 0.5], [0.25, 0], 'valley', -0.3)] });
    s.push({ key: 'son4', items: [poly([[0.25, 0], [0.5, 0], [0.5, 1], [0.25, 1]], 'c'), poly([[0.5, 0], [0.75, 0], [0.75, 1], [0.5, 1]], 'c'), line([0.25, 0.5], [0.75, 1], 'crease'), line([0.75, 0.5], [0.25, 0], 'crease'), line([0.5, 0.25], [0.5, 0.75], 'edge'), arrow([0.3, 0.9], [0.62, 0.62], 'push', 0), arrow([0.7, 0.1], [0.38, 0.38], 'push', 0)] });
    var par = [A, Bq, C, Dq];
    s.push({ key: 'son5', items: [poly(par, 'c'), line([0.5, 0.25], [0.5, 0.75], 'edge'), sym('turn', [0.95, 0.05])] });
    var A2 = [0.75, 0], B2 = [0.25, 0.5], C2 = [0.25, 1], D2 = [0.75, 0.5];
    s.push({ key: 'son6', items: [poly([A2, D2, C2, B2], 'c2'), line([0.75, 0.5], [0.5, 0.25], 'valley'), line([0.25, 0.5], [0.5, 0.75], 'valley'), farrow([0.7, 0.14], [0.75, 0.5], [0.5, 0.25], 'valley', -0.35), farrow([0.3, 0.86], [0.25, 0.5], [0.5, 0.75], 'valley', -0.35)] });
    var sqr = [[0.5, 0.25], [0.75, 0.5], [0.5, 0.75], [0.25, 0.5]];
    s.push({ key: 'son7', items: [poly(sqr, 'c2'), poly([[0.5, 0.25], [0.75, 0.5], [0.25, 0.5]], 'c'), poly([[0.5, 0.75], [0.25, 0.5], [0.75, 0.5]], 'c'), arrow([0.3, 0.46], lerp(A2, [0.5, 0.25], 0.25), 'unfold', -0.4), arrow([0.7, 0.54], lerp(C2, [0.5, 0.75], 0.25), 'unfold', -0.4)] });
    s.push({ key: 'son8', items: [poly([A2, D2, C2, B2], 'c2'), poly(sqr, 'c'), poly([A2, D2, [0.5, 0.25]], 'tab'), poly([C2, B2, [0.5, 0.75]], 'tab'), line([0.75, 0.5], [0.5, 0.25], 'valley'), line([0.25, 0.5], [0.5, 0.75], 'valley'), line([0.5, 0.25], [0.25, 0.5], 'pocket'), line([0.5, 0.75], [0.75, 0.5], 'pocket')] });
    return s;
  }

  /* ---------- SVG ---------- */
  function shade(hex, f) {
    var n = parseInt(String(hex).slice(1), 16), r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255;
    function c(v) { return Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f))); }
    return '#' + ((1 << 24) + (c(r) << 16) + (c(g) << 8) + c(b)).toString(16).slice(1);
  }
  function bounds(items) {
    var b = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    function add(p) { b.minX = Math.min(b.minX, p[0]); b.minY = Math.min(b.minY, p[1]); b.maxX = Math.max(b.maxX, p[0]); b.maxY = Math.max(b.maxY, p[1]); }
    items.forEach(function (it) { if (it.pts) it.pts.forEach(add); if (it.a) { add(it.a); add(it.b); } if (it.k === 'arrow') { add(it.from); add(it.to); } if (it.p) { add([it.p[0] - it.size, it.p[1] - it.size]); add([it.p[0] + it.size, it.p[1] + it.size]); } });
    return b;
  }
  function f(n) { return (Math.round(n * 1000) / 1000).toString(); }
  function pts(P) { return P.map(function (p) { return f(p[0]) + ',' + f(p[1]); }).join(' '); }
  var INK = '#172b42', VALLEY = '#1f5f8b', MOUNTAIN = '#a1283c';
  /* opts: {front, back, title, desc, width, height, unit(escala de trazos)} */
  function toSVG(items, opts) {
    opts = opts || {};
    var P = opts.idp || '', b = bounds(items), pad = 0.18, W = b.maxX - b.minX + 2 * pad, H = b.maxY - b.minY + 2 * pad, u = Math.max(W, H) / 100;
    var front = opts.front || '#d8425f', back = opts.back || '#ffffff';
    var fills = { c: front, c2: shade(front, -0.18), c3: shade(front, -0.34), w: back, w2: shade(back, -0.1), tab: 'url(#' + P + 'tabfill)' };
    var out = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + f(b.minX - pad) + ' ' + f(b.minY - pad) + ' ' + f(W) + ' ' + f(H) + '"' +
      (opts.width ? ' width="' + opts.width + '"' : '') + (opts.height ? ' height="' + opts.height + '"' : '') + ' role="img">';
    if (opts.title) out += '<title>' + esc(opts.title) + '</title>';
    if (opts.desc) out += '<desc>' + esc(opts.desc) + '</desc>';
    out += '<defs><marker id="' + P + 'ah-v" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="' + INK + '"/></marker>' +
      '<marker id="' + P + 'ah-m" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0L10,5L0,5z" fill="' + INK + '"/></marker>' +
      '<marker id="' + P + 'ah-u" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1,1L9,5L1,9z" fill="#fff" stroke="' + INK + '" stroke-width="1.4"/></marker>' +
      '<pattern id="' + P + 'tabfill" patternUnits="userSpaceOnUse" width="' + f(u * 3) + '" height="' + f(u * 3) + '" patternTransform="rotate(45)"><rect width="' + f(u * 3) + '" height="' + f(u * 3) + '" fill="' + shade(front, 0.55) + '"/><line x1="0" y1="0" x2="0" y2="' + f(u * 3) + '" stroke="' + shade(front, -0.3) + '" stroke-width="' + f(u * 0.9) + '"/></pattern></defs>';
    var sw = u * 0.55;
    items.forEach(function (it) {
      if (it.k === 'poly') out += '<polygon points="' + pts(it.pts) + '" fill="' + (fills[it.fill] || it.fill) + '" stroke="' + INK + '" stroke-width="' + f(sw) + '" stroke-linejoin="round"/>';
      else if (it.k === 'line') {
        var st = it.style, a = it.a, c = it.b;
        if (st === 'edge') out += '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(c[0]) + '" y2="' + f(c[1]) + '" stroke="' + INK + '" stroke-width="' + f(sw) + '"/>';
        else if (st === 'pocket') out += '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(c[0]) + '" y2="' + f(c[1]) + '" stroke="' + INK + '" stroke-width="' + f(sw * 3) + '" stroke-linecap="round"/>';
        else if (st === 'crease') out += '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(c[0]) + '" y2="' + f(c[1]) + '" stroke="#5d7185" stroke-width="' + f(sw * 0.55) + '"/>';
        else if (st === 'valley') out += '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(c[0]) + '" y2="' + f(c[1]) + '" stroke="' + VALLEY + '" stroke-width="' + f(sw * 1.5) + '" stroke-dasharray="' + f(u * 3) + ' ' + f(u * 1.8) + '" stroke-linecap="butt"/>';
        else if (st === 'mountain') out += '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(c[0]) + '" y2="' + f(c[1]) + '" stroke="' + MOUNTAIN + '" stroke-width="' + f(sw * 1.5) + '" stroke-dasharray="' + f(u * 3.4) + ' ' + f(u * 1.1) + ' ' + f(u * 0.5) + ' ' + f(u * 1.1) + ' ' + f(u * 0.5) + ' ' + f(u * 1.1) + '" stroke-linecap="butt"/>';
      } else if (it.k === 'arrow') out += arrowSVG(it, u, P);
      else if (it.k === 'turn') out += turnSVG(it.p, it.size, u, P);
      else if (it.k === 'repeat') out += repeatSVG(it.p, it.size, u, P);
      else if (it.k === 'pocket') out += '<g><circle cx="' + f(it.p[0]) + '" cy="' + f(it.p[1]) + '" r="' + f(u * 2.2) + '" fill="#fff" stroke="' + INK + '" stroke-width="' + f(sw) + '"/><text x="' + f(it.p[0]) + '" y="' + f(it.p[1] + u * 1.1) + '" font-size="' + f(u * 3) + '" text-anchor="middle" font-family="Atkinson Hyperlegible, Arial, sans-serif" font-weight="700" fill="' + INK + '">B</text></g>';
      else if (it.k === 'tab') out += '<g><circle cx="' + f(it.p[0]) + '" cy="' + f(it.p[1]) + '" r="' + f(u * 2.2) + '" fill="#fff" stroke="' + INK + '" stroke-width="' + f(sw) + '"/><text x="' + f(it.p[0]) + '" y="' + f(it.p[1] + u * 1.1) + '" font-size="' + f(u * 3) + '" text-anchor="middle" font-family="Atkinson Hyperlegible, Arial, sans-serif" font-weight="700" fill="' + INK + '">P</text></g>';
    });
    return out + '</svg>';
  }
  /* Flecha curva: valle (punta llena), monte (media punta), desdoblar (punta hueca), plegar y desdoblar (llena y hueca), empujar (flecha hueca gruesa). */
  function arrowSVG(it, u, P) {
    var a = it.from, b = it.to, mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1];
    var cx = mx - dy * it.bend, cy = my + dx * it.bend, sw = u * 0.8;
    if (it.type === 'push') {
      var l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l, w = u * 2.2, hl = u * 4.5, tx = b[0] - ux * hl, ty = b[1] - uy * hl;
      var Q = [[a[0] - uy * w * 0.5, a[1] + ux * w * 0.5], [tx - uy * w * 0.5, ty + ux * w * 0.5], [tx - uy * w * 1.3, ty + ux * w * 1.3], b, [tx + uy * w * 1.3, ty - ux * w * 1.3], [tx + uy * w * 0.5, ty - ux * w * 0.5], [a[0] + uy * w * 0.5, a[1] - ux * w * 0.5]];
      return '<polygon points="' + pts(Q) + '" fill="#fff" stroke="' + INK + '" stroke-width="' + f(sw * 0.8) + '" stroke-linejoin="round"/>';
    }
    var d = 'M' + f(a[0]) + ',' + f(a[1]) + ' Q' + f(cx) + ',' + f(cy) + ' ' + f(b[0]) + ',' + f(b[1]);
    var end = it.type === 'mountain' ? 'url(#' + P + 'ah-m)' : it.type === 'unfold' ? 'url(#' + P + 'ah-u)' : 'url(#' + P + 'ah-v)';
    var start = it.type === 'foldUnfold' ? ' marker-start="url(#' + P + 'ah-u)"' : '';
    return '<path d="' + d + '" fill="none" stroke="#fff" stroke-width="' + f(sw * 2.6) + '" stroke-linecap="round" opacity=".85"/>' +
      '<path d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="' + f(sw) + '" marker-end="' + end + '"' + start + '/>';
  }
  function turnSVG(p, s, u, P) {
    /* símbolo «dar la vuelta»: círculo con dos flechas */
    var r = s * 0.7, sw = u * 0.8;
    return '<g fill="none" stroke="' + INK + '" stroke-width="' + f(sw) + '"><circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="' + f(r) + '" fill="#fff"/>' +
      '<path d="M' + f(p[0] - r * 0.55) + ',' + f(p[1] + r * 0.1) + ' A' + f(r * 0.55) + ',' + f(r * 0.55) + ' 0 1 1 ' + f(p[0] + r * 0.5) + ',' + f(p[1] + r * 0.25) + '" marker-end="url(#' + P + 'ah-v)"/></g>';
  }
  function repeatSVG(p, s, u, P) {
    /* símbolo «repite detrás»: flecha con una raya */
    var r = s * 0.7, sw = u * 0.8;
    return '<g fill="none" stroke="' + INK + '" stroke-width="' + f(sw) + '"><path d="M' + f(p[0] - r) + ',' + f(p[1] + r * 0.4) + ' Q' + f(p[0]) + ',' + f(p[1] - r) + ' ' + f(p[0] + r) + ',' + f(p[1] + r * 0.4) + '" marker-end="url(#' + P + 'ah-v)"/>' +
      '<line x1="' + f(p[0] - r * 0.15) + '" y1="' + f(p[1] - r * 0.75) + '" x2="' + f(p[0] + r * 0.15) + '" y2="' + f(p[1] - r * 0.05) + '"/></g>';
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* Cubo Sonobe: cada pieza = cara central + dos pestañas en las caras vecinas (por aristas opuestas). */
  function sonobeCube() {
    /* caras: normal y ejes de las pestañas. Orden de montaje pensado para ir cerrando el cubo. */
    return [
      { face: [0, -1, 0], tab: [1, 0, 0], color: 0 },  /* abajo: pestañas en ±x */
      { face: [1, 0, 0], tab: [0, 0, 1], color: 1 },   /* derecha: pestañas en ±z */
      { face: [0, 0, 1], tab: [0, 1, 0], color: 2 },   /* delante: pestañas en ±y */
      { face: [-1, 0, 0], tab: [0, 0, 1], color: 1 },  /* izquierda */
      { face: [0, 0, -1], tab: [0, 1, 0], color: 2 },  /* detrás */
      { face: [0, 1, 0], tab: [1, 0, 0], color: 0 }    /* arriba: cierra */
    ];
  }

  return { craneSteps: craneSteps, sonobeSteps: sonobeSteps, sonobeCube: sonobeCube, toSVG: toSVG, shade: shade, esc: esc, _pts: { FL: FL, G: G, P1: P1, C0: C0, tip: tip, head: head } };
});
