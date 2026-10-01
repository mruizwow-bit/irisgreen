/* Iris Green · El taller · Papiroflexia y poliedros (R43) · geometría pura, sin interfaz.
   - Poliedros: vértices exactos, envolvente convexa, caras, aristas, ángulos diedros, defecto angular.
   - Redes planas: árboles de caras sin solapes, pestañas de pegado (una por par de aristas), ajuste a hoja.
   - Papel: pliegues simples (todas las capas o la solapa de arriba) con capas reflejadas y patrón de pliegues.
   - Vértice plano: teoremas de Maekawa y Kawasaki y reducción por pliegues en zigzag (crimps).
   Funciona igual en el navegador (window.IGPapiroGeo) y en Node (module.exports) para las pruebas. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.IGPapiroGeo = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  var EPS = 1e-6, PHI = (1 + Math.sqrt(5)) / 2;

  /* ---------- Vectores 3D ---------- */
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function mul(a, s) { return [a[0] * s, a[1] * s, a[2] * s]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function len(a) { return Math.sqrt(dot(a, a)); }
  function unit(a) { var l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }

  /* ---------- Catálogo de poliedros ---------- */
  var KINDS = ['tetra', 'cube', 'octa', 'dodeca', 'icosa', 'ttetra', 'cubocta', 'tocta', 'tcube', 'icosidodeca', 'prism', 'antiprism', 'pyramid', 'bipyramid'];
  var FAMILY = { tetra: 'platonic', cube: 'platonic', octa: 'platonic', dodeca: 'platonic', icosa: 'platonic', ttetra: 'archimedean', cubocta: 'archimedean', tocta: 'archimedean', tcube: 'archimedean', icosidodeca: 'archimedean', prism: 'prism', antiprism: 'prism', pyramid: 'pyramid', bipyramid: 'pyramid' };
  var HAS_N = { prism: 1, antiprism: 1, pyramid: 1, bipyramid: 1 };

  function perms3(v) { return [[v[0], v[1], v[2]], [v[0], v[2], v[1]], [v[1], v[0], v[2]], [v[1], v[2], v[0]], [v[2], v[0], v[1]], [v[2], v[1], v[0]]]; }
  function evenPerms3(v) { return [[v[0], v[1], v[2]], [v[1], v[2], v[0]], [v[2], v[0], v[1]]]; }
  function signs(list) {
    var out = [];
    list.forEach(function (p) {
      for (var m = 0; m < 8; m++) {
        var q = [p[0] * (m & 1 ? -1 : 1), p[1] * (m & 2 ? -1 : 1), p[2] * (m & 4 ? -1 : 1)];
        out.push(q);
      }
    });
    return dedupe(out);
  }
  function dedupe(pts) {
    var out = [];
    pts.forEach(function (p) { if (!out.some(function (q) { return len(sub(p, q)) < 1e-6; })) out.push(p); });
    return out;
  }
  function ngon(n, r, y, rot) {
    var out = [];
    for (var i = 0; i < n; i++) { var a = rot + i * 2 * Math.PI / n; out.push([r * Math.cos(a), y, r * Math.sin(a)]); }
    return out;
  }
  /* Vértices del sólido. La arista de la base (o todas las aristas) mide 1 al final. */
  function vertices(kind, n, hr) {
    n = Math.max(3, Math.min(12, Math.round(n || 5)));
    var R = 1 / (2 * Math.sin(Math.PI / n));
    switch (kind) {
      case 'tetra': return [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]];
      case 'cube': return signs([[1, 1, 1]]);
      case 'octa': return signs(perms3([1, 0, 0]));
      case 'dodeca': return signs([[1, 1, 1]].concat(evenPerms3([0, 1 / PHI, PHI])));
      case 'icosa': return signs(evenPerms3([0, 1, PHI]));
      case 'ttetra': return signs(perms3([3, 1, 1])).filter(function (p) { return (p[0] < 0) + (p[1] < 0) + (p[2] < 0) !== 1 && (p[0] < 0) + (p[1] < 0) + (p[2] < 0) !== 3; });
      case 'cubocta': return signs(perms3([1, 1, 0]));
      case 'tocta': return signs(perms3([0, 1, 2]));
      case 'tcube': return signs(perms3([Math.SQRT2 - 1, 1, 1]));
      case 'icosidodeca': return signs(perms3([0, 0, PHI]).concat(evenPerms3([0.5, PHI / 2, PHI * PHI / 2])));
      case 'prism': { var hh = (hr > 0 ? hr : 1); return ngon(n, R, hh / 2, 0).concat(ngon(n, R, -hh / 2, 0)); }
      case 'antiprism': {
        var h2 = 1 - 2 * R * R * (1 - Math.cos(Math.PI / n)); var ha = Math.sqrt(Math.max(0.01, h2)) * (hr > 0 ? hr : 1);
        return ngon(n, R, ha / 2, 0).concat(ngon(n, R, -ha / 2, Math.PI / n));
      }
      case 'pyramid': case 'bipyramid': {
        /* altura por defecto: caras laterales equiláteras cuando se puede (n ≤ 5) */
        var eq = n <= 5 ? Math.sqrt(1 - R * R) : 0.9;
        var hp = hr > 0 ? hr * (n <= 5 ? eq : 1) : eq;
        if (kind === 'bipyramid') return ngon(n, R, 0, 0).concat([[0, hp, 0], [0, -hp, 0]]);
        return ngon(n, R, -hp / 3, 0).concat([[0, hp * 2 / 3, 0]]);
      }
    }
    return signs([[1, 1, 1]]);
  }

  /* Envolvente convexa por fuerza bruta (pocos vértices): une triángulos coplanarios en caras. */
  function hull(P) {
    var faces = [], planes = [];
    var scale = 0; P.forEach(function (p) { scale = Math.max(scale, len(p)); });
    var tol = 1e-7 * Math.max(1, scale);
    for (var i = 0; i < P.length; i++) for (var j = i + 1; j < P.length; j++) for (var k = j + 1; k < P.length; k++) {
      var nrm = cross(sub(P[j], P[i]), sub(P[k], P[i])); if (len(nrm) < 1e-9) continue;
      nrm = unit(nrm); var d = dot(nrm, P[i]), pos = false, neg = false;
      for (var m = 0; m < P.length; m++) { var s = dot(nrm, P[m]) - d; if (s > tol * 10) pos = true; else if (s < -tol * 10) neg = true; if (pos && neg) break; }
      if (pos && neg) continue;
      if (pos) { nrm = mul(nrm, -1); d = -d; }
      if (planes.some(function (pl) { return len(sub(pl.n, nrm)) < 1e-6 && Math.abs(pl.d - d) < 1e-6; })) continue;
      var on = []; for (var q = 0; q < P.length; q++) if (Math.abs(dot(nrm, P[q]) - d) < tol * 10) on.push(q);
      var c = [0, 0, 0]; on.forEach(function (q) { c = add(c, P[q]); }); c = mul(c, 1 / on.length);
      var u = unit(sub(P[on[0]], c)), w = cross(nrm, u);
      on.sort(function (a, b) { var pa = sub(P[a], c), pb = sub(P[b], c); return Math.atan2(dot(pa, w), dot(pa, u)) - Math.atan2(dot(pb, w), dot(pb, u)); });
      planes.push({ n: nrm, d: d }); faces.push(on);
    }
    return faces;
  }

  function build(kind, n, hr) {
    if (KINDS.indexOf(kind) < 0) kind = 'cube';
    var V = vertices(kind, n, hr);
    var F = hull(V);
    /* escala: arista de referencia = 1 (la más corta en los sólidos regulares; la de la base en prismas y pirámides) */
    var edges = edgeList(F), ref;
    if (HAS_N[kind]) {
      var base = V.slice(0, Math.max(3, Math.min(12, Math.round(n || 5))));
      ref = len(sub(base[0], base[1]));
    } else ref = Math.min.apply(null, edges.map(function (e) { return len(sub(V[e.a], V[e.b])); }));
    V = V.map(function (p) { return mul(p, 1 / ref); });
    /* centrar */
    var c = [0, 0, 0]; V.forEach(function (p) { c = add(c, p); }); c = mul(c, 1 / V.length); V = V.map(function (p) { return sub(p, c); });
    /* orden estable de caras: primero por número de lados (desc) y luego por altura, para que los colores sean estables */
    var poly = { kind: kind, n: HAS_N[kind] ? Math.max(3, Math.min(12, Math.round(n || 5))) : null, V: V, F: F };
    poly.normals = F.map(function (f) { return unit(cross(sub(V[f[1]], V[f[0]]), sub(V[f[2]], V[f[0]]))); });
    poly.E = edgeList(F);
    poly.edgeLen = poly.E.map(function (e) { return len(sub(V[e.a], V[e.b])); });
    poly.dihedral = poly.E.map(function (e) { return Math.PI - Math.acos(Math.max(-1, Math.min(1, dot(poly.normals[e.f[0]], poly.normals[e.f[1]])))); });
    poly.faceAngles = F.map(function (f) { return f.map(function (vi, i) { var a = V[f[(i - 1 + f.length) % f.length]], b = V[vi], cc = V[f[(i + 1) % f.length]]; return Math.acos(Math.max(-1, Math.min(1, dot(unit(sub(a, b)), unit(sub(cc, b)))))); }); });
    var sumAt = V.map(function () { return 0; });
    F.forEach(function (f, fi) { f.forEach(function (vi, i) { sumAt[vi] += poly.faceAngles[fi][i]; }); });
    poly.defect = sumAt.map(function (s) { return 2 * Math.PI - s; });
    poly.faceType = F.map(function (f, fi) { return f.length + ':' + poly.faceAngles[fi].map(function (a) { return Math.round(a * 180 / Math.PI); }).sort().join(','); });
    return poly;
  }
  function edgeList(F) {
    var map = {}, out = [];
    F.forEach(function (f, fi) {
      f.forEach(function (a, i) {
        var b = f[(i + 1) % f.length], k = Math.min(a, b) + '-' + Math.max(a, b);
        if (!map[k]) { map[k] = { a: Math.min(a, b), b: Math.max(a, b), f: [] }; out.push(map[k]); }
        map[k].f.push(fi);
      });
    });
    return out;
  }

  /* ---------- Redes planas ---------- */
  function sharedEdge(poly, fa, fb) {
    for (var i = 0; i < poly.E.length; i++) { var e = poly.E[i]; if ((e.f[0] === fa && e.f[1] === fb) || (e.f[0] === fb && e.f[1] === fa)) return i; }
    return -1;
  }
  function adjacency(poly) {
    var adj = poly.F.map(function () { return []; });
    poly.E.forEach(function (e, ei) { adj[e.f[0]].push({ f: e.f[1], e: ei }); adj[e.f[1]].push({ f: e.f[0], e: ei }); });
    return adj;
  }
  /* Árboles de expansión: BFS y DFS desde cada cara y algunos al azar con semilla fija. */
  function candidateTrees(poly) {
    var adj = adjacency(poly), out = [], seen = {};
    function push(parent, root) { var key = parent.join(','); if (seen[key]) return; seen[key] = 1; out.push({ root: root, parent: parent }); }
    for (var r = 0; r < poly.F.length; r++) {
      /* BFS */
      var par = poly.F.map(function () { return -2; }); par[r] = -1; var q = [r];
      while (q.length) { var f = q.shift(); adj[f].forEach(function (x) { if (par[x.f] === -2) { par[x.f] = f; q.push(x.f); } }); }
      push(par, r);
      /* DFS */
      var par2 = poly.F.map(function () { return -2; }); par2[r] = -1; var st = [r];
      while (st.length) { var g = st[st.length - 1], nx = null; for (var i = 0; i < adj[g].length; i++) if (par2[adj[g][i].f] === -2) { nx = adj[g][i].f; break; } if (nx === null) st.pop(); else { par2[nx] = g; st.push(nx); } }
      push(par2, r);
    }
    var a = 12345;
    function rnd() { a = (a * 1103515245 + 12345) & 0x7fffffff; return a / 0x7fffffff; }
    for (var k = 0; k < 60; k++) {
      var root = Math.floor(rnd() * poly.F.length), p3 = poly.F.map(function () { return -2; }); p3[root] = -1;
      var frontier = adj[root].map(function (x) { return { from: root, to: x.f, w: rnd() }; });
      while (frontier.length) {
        frontier.sort(function (x, y) { return x.w - y.w; });
        var ed = frontier.shift(); if (p3[ed.to] !== -2) continue;
        p3[ed.to] = ed.from; adj[ed.to].forEach(function (x) { if (p3[x.f] === -2) frontier.push({ from: ed.to, to: x.f, w: rnd() }); });
      }
      push(p3, root);
    }
    return out;
  }
  /* Coloca cada cara en el plano siguiendo el árbol (coordenadas matemáticas: y hacia arriba, cara exterior vista de frente). */
  function layoutTree(poly, tree) {
    var V = poly.V, F = poly.F, pos = F.map(function () { return null; });
    var r = tree.root, f0 = F[r], n0 = poly.normals[r];
    var u = unit(sub(V[f0[1]], V[f0[0]])), w = cross(n0, u);
    pos[r] = f0.map(function (vi) { var d = sub(V[vi], V[f0[0]]); return [dot(d, u), dot(d, w)]; });
    var order = [r], done = {}; done[r] = 1;
    var changed = true;
    while (changed) {
      changed = false;
      for (var f = 0; f < F.length; f++) {
        if (done[f] || !done[tree.parent[f]]) continue;
        var p = tree.parent[f], ei = sharedEdge(poly, p, f), e = poly.E[ei];
        var ia = F[p].indexOf(e.a), ib = F[p].indexOf(e.b);
        var A2 = pos[p][ia], B2 = pos[p][ib], A3 = V[e.a], B3 = V[e.b];
        var E3 = unit(sub(B3, A3)), L2 = Math.hypot(B2[0] - A2[0], B2[1] - A2[1]), E2 = [(B2[0] - A2[0]) / L2, (B2[1] - A2[1]) / L2];
        var N2 = [-E2[1], E2[0]];
        /* lado del padre: el hijo va al otro */
        var pc = centroid2(pos[p]); if ((pc[0] - A2[0]) * N2[0] + (pc[1] - A2[1]) * N2[1] > 0) N2 = [-N2[0], -N2[1]];
        var fc = [0, 0, 0]; F[f].forEach(function (vi) { fc = add(fc, V[vi]); }); fc = mul(fc, 1 / F[f].length);
        var perp3 = sub(sub(fc, A3), mul(E3, dot(sub(fc, A3), E3))); perp3 = unit(perp3);
        pos[f] = F[f].map(function (vi) { var d = sub(V[vi], A3), s = dot(d, E3), t = dot(d, perp3); return [A2[0] + E2[0] * s + N2[0] * t, A2[1] + E2[1] * s + N2[1] * t]; });
        done[f] = 1; order.push(f); changed = true;
      }
    }
    return { pos: pos, order: order };
  }
  function centroid2(pts) { var x = 0, y = 0; pts.forEach(function (p) { x += p[0]; y += p[1]; }); return [x / pts.length, y / pts.length]; }
  function shrink(pts, d) { var c = centroid2(pts); return pts.map(function (p) { var dx = p[0] - c[0], dy = p[1] - c[1], l = Math.hypot(dx, dy) || 1; return [p[0] - dx / l * d, p[1] - dy / l * d]; }); }
  /* Separación de polígonos convexos (ejes separadores). */
  function convexOverlap(A, B, tol) {
    tol = tol || 1e-6;
    function axes(P) { var out = []; for (var i = 0; i < P.length; i++) { var a = P[i], b = P[(i + 1) % P.length]; out.push([-(b[1] - a[1]), b[0] - a[0]]); } return out; }
    var all = axes(A).concat(axes(B));
    for (var i = 0; i < all.length; i++) {
      var ax = all[i], l = Math.hypot(ax[0], ax[1]); if (l < 1e-12) continue; ax = [ax[0] / l, ax[1] / l];
      var amin = Infinity, amax = -Infinity, bmin = Infinity, bmax = -Infinity;
      A.forEach(function (p) { var v = p[0] * ax[0] + p[1] * ax[1]; amin = Math.min(amin, v); amax = Math.max(amax, v); });
      B.forEach(function (p) { var v = p[0] * ax[0] + p[1] * ax[1]; bmin = Math.min(bmin, v); bmax = Math.max(bmax, v); });
      if (amax <= bmin + tol || bmax <= amin + tol) return false;
    }
    return true;
  }
  function netOverlaps(pos) {
    var s = pos.map(function (p) { return shrink(p, 1e-4); });
    for (var i = 0; i < s.length; i++) for (var j = i + 1; j < s.length; j++) if (convexOverlap(s[i], s[j], 1e-6)) return true;
    return false;
  }
  function bboxOf(list) {
    var b = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    list.forEach(function (pts) { pts.forEach(function (p) { b.minX = Math.min(b.minX, p[0]); b.minY = Math.min(b.minY, p[1]); b.maxX = Math.max(b.maxX, p[0]); b.maxY = Math.max(b.maxY, p[1]); }); });
    return b;
  }
  function rot2(p, a) { var c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c]; }
  /* Mejor giro para que quepa en una hoja vertical (proporción del área útil). */
  function bestAngle(pos, pageW, pageH) {
    /* solo giros que dejan alguna arista horizontal: redes más limpias y fáciles de recortar */
    var angs = [];
    pos.forEach(function (pts) { pts.forEach(function (p, i) { var q = pts[(i + 1) % pts.length], a = -Math.atan2(q[1] - p[1], q[0] - p[0]); [0, Math.PI / 2].forEach(function (o) { var v = ((a + o) % Math.PI + Math.PI) % Math.PI; if (!angs.some(function (x) { return Math.abs(x - v) < 1e-6; })) angs.push(v); }); }); });
    var best = { a: 0, w: 0, h: 0, fit: Infinity };
    angs.forEach(function (a) {
      var b = bboxOf(pos.map(function (pts) { return pts.map(function (p) { return rot2(p, a); }); }));
      var w = b.maxX - b.minX, h = b.maxY - b.minY, fit = Math.max(w / pageW, h / pageH);
      if (fit < best.fit - 1e-9) best = { a: a, w: w, h: h, fit: fit };
    });
    return best;
  }
  /* Todas las redes válidas (sin solapes) ordenadas: primero las que mejor aprovechan la hoja. */
  function nets(poly, pageW, pageH) {
    pageW = pageW || 180; pageH = pageH || 250;
    var list = [];
    candidateTrees(poly).forEach(function (tr) {
      var lay = layoutTree(poly, tr); if (lay.order.length !== poly.F.length) return;
      if (netOverlaps(lay.pos)) return;
      var ba = bestAngle(lay.pos, pageW, pageH);
      list.push({ tree: tr, pos: lay.pos, angle: ba.a, fit: ba.fit, w: ba.w, h: ba.h });
    });
    list.sort(function (a, b) { return a.fit - b.fit; });
    /* quita duplicados geométricos (misma forma) */
    var out = [];
    list.forEach(function (n) { if (!out.some(function (m) { return Math.abs(m.w - n.w) < 1e-6 && Math.abs(m.h - n.h) < 1e-6 && Math.abs(m.fit - n.fit) < 1e-9; })) out.push(n); });
    return out.slice(0, 24);
  }
  /* Red lista para dibujar: coordenadas giradas y trasladadas (unidad: arista = 1), aristas de pliegue, de corte y pestañas. */
  function netDrawing(poly, net, opts) {
    opts = opts || {};
    var tabH = opts.tabH || 0.22;
    var pos = net.pos.map(function (pts) { return pts.map(function (p) { return rot2(p, net.angle); }); });
    var b0 = bboxOf(pos); pos = pos.map(function (pts) { return pts.map(function (p) { return [p[0] - b0.minX, p[1] - b0.minY]; }); });
    var F = poly.F, tree = net.tree, folds = [], cuts = [], pairs = [];
    poly.E.forEach(function (e, ei) {
      var fa = e.f[0], fb = e.f[1];
      function seg(f) { var ia = F[f].indexOf(e.a), ib = F[f].indexOf(e.b); return [pos[f][ia], pos[f][ib]]; }
      if (tree.parent[fa] === fb || tree.parent[fb] === fa) folds.push({ e: ei, s: seg(fa) });
      else pairs.push({ e: ei, sides: [{ f: fa, s: seg(fa) }, { f: fb, s: seg(fb) }] });
    });
    var facePolys = pos.map(function (p) { return shrink(p, 1e-4); });
    var tabs = [], clashes = 0;
    function tabPoly(side, hgt, thA, thB) {
      var A = side.s[0], B = side.s[1], L = Math.hypot(B[0] - A[0], B[1] - A[1]), E = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], N = [-E[1], E[0]];
      var c = centroid2(pos[side.f]); if ((c[0] - A[0]) * N[0] + (c[1] - A[1]) * N[1] > 0) N = [-N[0], -N[1]];
      var ta = Math.tan(thA * Math.PI / 180), tb = Math.tan(thB * Math.PI / 180);
      /* altura limitada para que los dos lados inclinados no se crucen */
      var h = Math.min(hgt, L * 0.85 / (1 / ta + 1 / tb)), insA = h / ta, insB = h / tb;
      var P = [A, [A[0] + E[0] * insA + N[0] * h, A[1] + E[1] * insA + N[1] * h], [B[0] - E[0] * insB + N[0] * h, B[1] - E[1] * insB + N[1] * h], B];
      return { pts: P, n: N };
    }
    function clash(P) {
      var s = shrink(P, 1e-4);
      if (facePolys.some(function (fp) { return convexOverlap(fp, s, 1e-6); })) return true;
      return tabs.some(function (tb) { return convexOverlap(shrink(tb.pts, 1e-4), s, 1e-6); });
    }
    pairs.forEach(function (pr, k) {
      var num = k + 1, chosen = null;
      var shapes = [[50, 50], [30, 50], [50, 30], [30, 30], [18, 45], [45, 18], [18, 18]];
      [1, 0.65, 0.4].some(function (fct) {
        return shapes.some(function (th) {
          for (var i = 0; i < 2; i++) { var sd = pr.sides[(k + i) % 2], tp = tabPoly(sd, tabH * fct, th[0], th[1]); if (!clash(tp.pts)) { chosen = { side: sd, pts: tp.pts, other: pr.sides[(k + i + 1) % 2] }; return true; } }
          return false;
        });
      });
      if (!chosen) { clashes += 1; var sd0 = pr.sides[k % 2]; chosen = { side: sd0, pts: tabPoly(sd0, tabH * 0.4, 30, 30).pts, other: pr.sides[(k + 1) % 2], clash: true }; }
      tabs.push({ e: pr.e, num: num, face: chosen.side.f, pts: chosen.pts, seg: chosen.side.s, other: chosen.other, clash: !!chosen.clash });
      cuts.push({ e: pr.e, num: num, s: chosen.other.s, f: chosen.other.f });
    });
    var b = bboxOf(pos.concat(tabs.map(function (t) { return t.pts; })));
    return { faces: pos, folds: folds, cuts: cuts, tabs: tabs, bbox: b, clashes: clashes };
  }

  /* ---------- Plegado 3D del sólido: transformaciones por cara ---------- */
  /* Devuelve, para cada cara, el eje (punto y dirección) y el ángulo con signo que la lleva al plano de su padre. */
  function hinges(poly, tree) {
    var V = poly.V, out = poly.F.map(function () { return null; });
    poly.F.forEach(function (f, fi) {
      var p = tree.parent[fi]; if (p < 0) return;
      var ei = sharedEdge(poly, p, fi), e = poly.E[ei];
      var a = V[e.a], dir = unit(sub(V[e.b], V[e.a]));
      var nc = poly.normals[fi], np = poly.normals[p];
      var delta = Math.acos(Math.max(-1, Math.min(1, dot(nc, np))));
      /* signo: girar la normal del hijo con +delta debe dar la del padre */
      var rv = rotateVec(nc, dir, delta), sign = len(sub(rv, np)) < len(sub(rotateVec(nc, dir, -delta), np)) ? 1 : -1;
      out[fi] = { parent: p, point: a, axis: dir, angle: sign * delta };
    });
    return out;
  }
  function rotateVec(v, k, a) { /* Rodrigues */
    var c = Math.cos(a), s = Math.sin(a), kv = cross(k, v), kd = dot(k, v);
    return [v[0] * c + kv[0] * s + k[0] * kd * (1 - c), v[1] * c + kv[1] * s + k[1] * kd * (1 - c), v[2] * c + kv[2] * s + k[2] * kd * (1 - c)];
  }

  /* ---------- Papel: pliegues simples ---------- */
  function area(P) { var s = 0; for (var i = 0; i < P.length; i++) { var a = P[i], b = P[(i + 1) % P.length]; s += a[0] * b[1] - b[0] * a[1]; } return s / 2; }
  function clipHalf(P, a, nrm, keepPos) {
    var out = [];
    function sd(p) { var v = (p[0] - a[0]) * nrm[0] + (p[1] - a[1]) * nrm[1]; return keepPos ? v : -v; }
    for (var i = 0; i < P.length; i++) {
      var p = P[i], q = P[(i + 1) % P.length], dp = sd(p), dq = sd(q);
      if (dp >= -EPS) out.push(p);
      if ((dp > EPS && dq < -EPS) || (dp < -EPS && dq > EPS)) { var t = dp / (dp - dq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); }
    }
    return cleanPoly(out);
  }
  function cleanPoly(P) {
    var out = [];
    P.forEach(function (p) { if (!out.length || Math.hypot(p[0] - out[out.length - 1][0], p[1] - out[out.length - 1][1]) > 1e-6) out.push(p); });
    if (out.length > 1 && Math.hypot(out[0][0] - out[out.length - 1][0], out[0][1] - out[out.length - 1][1]) < 1e-6) out.pop();
    /* quita puntos alineados */
    var res = [];
    for (var i = 0; i < out.length; i++) {
      var a = out[(i - 1 + out.length) % out.length], b = out[i], c = out[(i + 1) % out.length];
      if (Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])) > 1e-10) res.push(b);
    }
    return res.length >= 3 && Math.abs(area(res)) > 1e-6 ? res : null;
  }
  function applyT(T, p) { return [T[0] * p[0] + T[2] * p[1] + T[4], T[1] * p[0] + T[3] * p[1] + T[5]]; }
  function composeT(A, B) { /* A∘B */
    return [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3], A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5]];
  }
  function invT(T) {
    var det = T[0] * T[3] - T[2] * T[1], a = T[3] / det, b = -T[1] / det, c = -T[2] / det, d = T[0] / det;
    return [a, b, c, d, -(a * T[4] + c * T[5]), -(b * T[4] + d * T[5])];
  }
  function reflectT(a, b) {
    var dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l;
    var m00 = 2 * ux * ux - 1, m01 = 2 * ux * uy, m11 = 2 * uy * uy - 1;
    /* x' = a + M(x - a) */
    return [m00, m01, m01, m11, a[0] - (m00 * a[0] + m01 * a[1]), a[1] - (m01 * a[0] + m11 * a[1])];
  }
  function paperStart(paper) {
    var W = paper.shape === 'a4' ? 1 : 1, H = paper.shape === 'a4' ? Math.SQRT2 : 1;
    var P = [[0, 0], [W, 0], [W, H], [0, H]], T = [1, 0, 0, 1, 0, 0];
    if (paper.orient === 'diamond' && paper.shape !== 'a4') {
      var s = Math.SQRT1_2;
      T = [s, s, -s, s, s, 0]; /* giro 45° y traslado: el rombo ocupa [0, √2] × [0, √2] con una esquina arriba */
      P = P.map(function (p) { return applyT(T, p); });
    }
    return { W: W, H: H, parts: [{ poly: P, T: T, flip: false, z: 0 }], creases: [] };
  }
  function clonePaper(st) { return { W: st.W, H: st.H, parts: st.parts.map(function (p) { return { poly: p.poly.map(function (q) { return q.slice(); }), T: p.T.slice(), flip: p.flip, z: p.z }; }), creases: st.creases.map(function (c) { return { p: c.p.slice(), q: c.q.slice(), t: c.t }; }) }; }
  function origPoly(part) { var inv = invT(part.T); return part.poly.map(function (p) { return applyT(inv, p); }); }
  function sharedSegment(A, B) {
    for (var i = 0; i < A.length; i++) {
      var a0 = A[i], a1 = A[(i + 1) % A.length], dx = a1[0] - a0[0], dy = a1[1] - a0[1], L = Math.hypot(dx, dy);
      for (var j = 0; j < B.length; j++) {
        var b0 = B[j], b1 = B[(j + 1) % B.length];
        var c0 = (dx * (b0[1] - a0[1]) - dy * (b0[0] - a0[0])) / L, c1 = (dx * (b1[1] - a0[1]) - dy * (b1[0] - a0[0])) / L;
        if (Math.abs(c0) > 1e-6 || Math.abs(c1) > 1e-6) continue;
        var t0 = ((b0[0] - a0[0]) * dx + (b0[1] - a0[1]) * dy) / (L * L), t1 = ((b1[0] - a0[0]) * dx + (b1[1] - a0[1]) * dy) / (L * L);
        var lo = Math.max(0, Math.min(t0, t1)), hi = Math.min(1, Math.max(t0, t1));
        if ((hi - lo) * L > 1e-6) return [[a0[0] + dx * lo, a0[1] + dy * lo], [a0[0] + dx * hi, a0[1] + dy * hi]];
      }
    }
    return null;
  }
  function polysOverlap(A, B) { return convexOverlap(shrink(A, 1e-5), shrink(B, 1e-5), 1e-7); }
  function sideOf(p, a, nrm) { return (p[0] - a[0]) * nrm[0] + (p[1] - a[1]) * nrm[1]; }
  function lineNormal(a, b) { var dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; }
  /* Pliegue simple. step = {a,b,type:'V'|'M',side:1|-1,layers:'all'|'top'}. Devuelve {ok, state, error, moved}. */
  function foldPaper(st, step) {
    var a = step.a, b = step.b; if (!a || !b || Math.hypot(b[0] - a[0], b[1] - a[1]) < 1e-6) return { ok: false, error: 'line' };
    var nrm = lineNormal(a, b), side = step.side === -1 ? -1 : 1;
    var pieces = [];
    st.parts.forEach(function (pt, idx) {
      var pos = clipHalf(pt.poly, a, nrm, true), neg = clipHalf(pt.poly, a, nrm, false);
      [[pos, 1], [neg, -1]].forEach(function (pp) { if (pp[0]) pieces.push({ poly: pp[0], T: pt.T.slice(), flip: pt.flip, z: pt.z, sub: pp[1] === side ? 'm' : 's', src: idx }); });
    });
    var mov = pieces.filter(function (p) { return p.sub === 'm'; }), sta = pieces.filter(function (p) { return p.sub === 's'; });
    if (!mov.length || !sta.length) return { ok: false, error: 'nothing' };
    var moving = mov;
    var orig = pieces.map(function (p) { var inv = invT(p.T); return p.poly.map(function (q) { return applyT(inv, q); }); });
    function adjacent(i, j) { return sharedSegment(orig[i], orig[j]); }
    if (step.layers === 'top') {
      if (step.type === 'M') return { ok: false, error: 'topMountain' };
      var idxM = pieces.map(function (p, i) { return p.sub === 'm' ? i : -1; }).filter(function (i) { return i >= 0; });
      var start = idxM.slice().sort(function (i, j) { return pieces[j].z - pieces[i].z; })[0];
      var inSet = {}; inSet[start] = 1;
      var grew = true;
      while (grew) {
        grew = false;
        idxM.forEach(function (i) {
          if (inSet[i]) return;
          var minZ = Infinity; Object.keys(inSet).forEach(function (k) { minZ = Math.min(minZ, pieces[k].z); });
          var link = Object.keys(inSet).some(function (k) { return adjacent(i, +k); });
          var above = pieces[i].z > minZ && Object.keys(inSet).some(function (k) { return polysOverlap(pieces[i].poly, pieces[k].poly) && pieces[i].z > pieces[k].z; });
          if (link || above) { inSet[i] = 1; grew = true; }
        });
      }
      moving = idxM.filter(function (i) { return inSet[i]; }).map(function (i) { return pieces[i]; });
      /* ¿se rompería el papel? Una pieza que se mueve solo puede estar unida a una quieta por la línea de pliegue. */
      for (var mi = 0; mi < pieces.length; mi++) {
        if (!inSet[mi]) continue;
        for (var si = 0; si < pieces.length; si++) {
          if (inSet[si]) continue;
          var seg = adjacent(mi, si); if (!seg) continue;
          var T = pieces[mi].T, p0 = applyT(T, seg[0]), p1 = applyT(T, seg[1]);
          if (Math.abs(sideOf(p0, a, nrm)) > 1e-6 || Math.abs(sideOf(p1, a, nrm)) > 1e-6) return { ok: false, error: 'tear' };
        }
      }
      pieces.forEach(function (p, i) { p.sub = inSet[i] ? 'm' : 's'; });
    }
    var R = reflectT(a, b), creases = st.creases.slice(), movedBefore = moving.map(function (p) { return p.poly.map(function (q) { return q.slice(); }); });
    moving.forEach(function (p) {
      /* pliegue nuevo: tramo de la pieza sobre la línea, en coordenadas del papel original */
      var on = p.poly.filter(function (q) { return Math.abs(sideOf(q, a, nrm)) < 1e-6; });
      if (on.length >= 2) {
        var inv = invT(p.T), o0 = applyT(inv, on[0]), o1 = applyT(inv, on[on.length - 1]);
        var tFront = (step.type === 'V') !== p.flip ? 'V' : 'M';
        if (Math.hypot(o1[0] - o0[0], o1[1] - o0[1]) > 1e-6) creases.push({ p: o0, q: o1, t: tFront });
      }
      p.poly = p.poly.map(function (q) { return applyT(R, q); }).reverse();
      p.T = composeT(R, p.T); p.flip = !p.flip;
    });
    var statics = pieces.filter(function (p) { return p.sub === 's'; }).sort(function (x, y) { return x.z - y.z; });
    var movers = pieces.filter(function (p) { return p.sub === 'm'; }).sort(function (x, y) { return y.z - x.z; }); /* orden invertido */
    var ordered = step.type === 'M' ? movers.concat(statics) : statics.concat(movers);
    var parts = ordered.map(function (p, i) { return { poly: p.poly, T: p.T, flip: p.flip, z: i }; });
    return { ok: true, state: { W: st.W, H: st.H, parts: parts, creases: mergeCreases(creases) }, moved: movers.length, movedBefore: movedBefore };
  }
  function mergeCreases(list) {
    var out = [];
    list.forEach(function (c) {
      var dup = out.some(function (d) { return d.t === c.t && ((near(d.p, c.p) && near(d.q, c.q)) || (near(d.p, c.q) && near(d.q, c.p))); });
      if (!dup) out.push(c);
    });
    return out;
  }
  function near(p, q) { return Math.hypot(p[0] - q[0], p[1] - q[1]) < 1e-6; }
  function paperBBox(st) { return bboxOf(st.parts.map(function (p) { return p.poly; })); }
  function flipPaper(st) {
    var b = paperBBox(st), cx = (b.minX + b.maxX) / 2, M = [-1, 0, 0, 1, 2 * cx, 0], maxZ = st.parts.length - 1;
    var parts = st.parts.map(function (p) { return { poly: p.poly.map(function (q) { return applyT(M, q); }).reverse(), T: composeT(M, p.T), flip: !p.flip, z: maxZ - p.z }; });
    parts.sort(function (x, y) { return x.z - y.z; });
    return { W: st.W, H: st.H, parts: parts, creases: st.creases.slice() };
  }
  function rotatePaper(st) {
    var b = paperBBox(st), cx = (b.minX + b.maxX) / 2, cy = (b.minY + b.maxY) / 2;
    /* giro de 90° en sentido horario en pantalla (y hacia abajo): (x,y) → (cx - (y - cy), cy + (x - cx)) */
    var M = [0, 1, -1, 0, cx + cy, cy - cx];
    return { W: st.W, H: st.H, parts: st.parts.map(function (p) { return { poly: p.poly.map(function (q) { return applyT(M, q); }), T: composeT(M, p.T), flip: p.flip, z: p.z }; }), creases: st.creases.slice() };
  }
  function applyStep(st, s) {
    if (s.op === 'flip') return { ok: true, state: flipPaper(st) };
    if (s.op === 'rotate') return { ok: true, state: rotatePaper(st) };
    return foldPaper(st, s);
  }
  /* Repite todos los pasos. Devuelve la lista de estados (el 0 es el papel sin plegar). */
  function replay(paper, steps) {
    var states = [paperStart(paper)], errors = [];
    (steps || []).forEach(function (s, i) {
      var r = applyStep(states[states.length - 1], s);
      if (r.ok) states.push(r.state); else { errors.push({ i: i, error: r.error }); states.push(clonePaper(states[states.length - 1])); }
    });
    return { states: states, errors: errors };
  }
  /* Puntos de referencia del estado actual: vértices y puntos medios de los bordes de cada capa. */
  function paperMarks(st) {
    var pts = [];
    function addP(p, kind) { if (!pts.some(function (q) { return Math.hypot(q.p[0] - p[0], q.p[1] - p[1]) < 1e-6; })) pts.push({ p: [p[0], p[1]], kind: kind }); }
    st.parts.forEach(function (pt) { pt.poly.forEach(function (p) { addP(p, 'v'); }); });
    st.parts.forEach(function (pt) { pt.poly.forEach(function (p, i) { var q = pt.poly[(i + 1) % pt.poly.length]; addP([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], 'm'); }); });
    return pts;
  }
  function round6(v) { return Math.round(v * 1e6) / 1e6; }
  /* Recorta la recta a la caja del papel (con margen) para dibujarla. */
  function clipLineToBox(a, b, box, margin) {
    var m = margin || 0, x0 = box.minX - m, y0 = box.minY - m, x1 = box.maxX + m, y1 = box.maxY + m;
    var dx = b[0] - a[0], dy = b[1] - a[1], ts = [];
    if (Math.abs(dx) > 1e-12) { [x0, x1].forEach(function (x) { var t = (x - a[0]) / dx, y = a[1] + dy * t; if (y >= y0 - 1e-9 && y <= y1 + 1e-9) ts.push(t); }); }
    if (Math.abs(dy) > 1e-12) { [y0, y1].forEach(function (y) { var t = (y - a[1]) / dy, x = a[0] + dx * t; if (x >= x0 - 1e-9 && x <= x1 + 1e-9) ts.push(t); }); }
    if (ts.length < 2) return null;
    var lo = Math.min.apply(null, ts), hi = Math.max.apply(null, ts);
    return [[a[0] + dx * lo, a[1] + dy * lo], [a[0] + dx * hi, a[1] + dy * hi]];
  }
  /* Tramo de la recta que cruza el papel (unión de los tramos por capa). */
  function lineOnPaper(st, a, b) {
    var dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy, lo = Infinity, hi = -Infinity, nrm = lineNormal(a, b);
    st.parts.forEach(function (pt) {
      var P = pt.poly;
      for (var i = 0; i < P.length; i++) {
        var p = P[i], q = P[(i + 1) % P.length], sp = sideOf(p, a, nrm), sq = sideOf(q, a, nrm);
        function tt(x) { return ((x[0] - a[0]) * dx + (x[1] - a[1]) * dy) / L2; }
        if (Math.abs(sp) < 1e-6) { lo = Math.min(lo, tt(p)); hi = Math.max(hi, tt(p)); }
        if ((sp > 1e-6 && sq < -1e-6) || (sp < -1e-6 && sq > 1e-6)) { var s = sp / (sp - sq), x = [p[0] + (q[0] - p[0]) * s, p[1] + (q[1] - p[1]) * s]; lo = Math.min(lo, tt(x)); hi = Math.max(hi, tt(x)); }
      }
    });
    if (!(hi > lo)) return null;
    return [[a[0] + dx * lo, a[1] + dy * lo], [a[0] + dx * hi, a[1] + dy * hi]];
  }
  /* Lado que se mueve por defecto: el de menos papel. */
  function defaultSide(st, a, b) {
    var nrm = lineNormal(a, b), pos = 0, neg = 0;
    st.parts.forEach(function (pt) { var p = clipHalf(pt.poly, a, nrm, true), n = clipHalf(pt.poly, a, nrm, false); if (p) pos += Math.abs(area(p)); if (n) neg += Math.abs(area(n)); });
    return pos <= neg ? 1 : -1;
  }
  /* Mediatriz: llevar el punto p sobre el punto q. Devuelve {a,b,side} con p en el lado que se mueve. */
  function pointToPoint(p, q) {
    var m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], d = [q[0] - p[0], q[1] - p[1]], a = [m[0] + d[1], m[1] - d[0]], b = [m[0] - d[1], m[1] + d[0]];
    var s = sideOf(p, a, lineNormal(a, b)) > 0 ? 1 : -1;
    return { a: a, b: b, side: s };
  }

  /* Paso de pliegue a partir de dos puntos de la recta y un punto del lado que se mueve. */
  function stepFrom(a, b, m, type, layers) {
    var s = sideOf(m, a, lineNormal(a, b)) > 0 ? 1 : -1;
    return { op: 'fold', a: [a[0], a[1]], b: [b[0], b[1]], type: type || 'V', side: s, layers: layers || 'all' };
  }
  /* Modelos guiados: solo pliegues simples y «dar la vuelta». Se calculan sobre el estado real para ser exactos. */
  var H = Math.SQRT1_2;
  function guide(id) {
    var paper, list = [], st;
    function push(s) { var r = applyStep(st, s); if (!r.ok) throw new Error('guide ' + id + ' ' + list.length + ' ' + r.error); list.push(s); st = r.state; return st; }
    function mirrorX(p, cx) { return [2 * cx - p[0], p[1]]; }
    if (id === 'cup' || id === 'envelope') paper = { shape: 'square', orient: 'diamond' };
    else paper = { shape: 'a4', orient: 'square' };
    st = paperStart(paper);
    if (id === 'envelope') {
      push(stepFrom([H / 2, 0], [H / 2, 2 * H], [0, H]));
      push(stepFrom([1.5 * H, 0], [1.5 * H, 2 * H], [2 * H, H]));
      push(stepFrom([0, 1.5 * H], [2 * H, 1.5 * H], [H, 2 * H]));
      push(stepFrom([0, 0.6 * H], [2 * H, 0.6 * H], [H, 0]));
    } else if (id === 'cup') {
      push(stepFrom([0, H], [2 * H, H], [H, 2 * H]));
      /* P: punto del borde derecho a la altura del 58,6 % (la esquina izquierda llega allí con su borde superior horizontal) */
      var k = Math.SQRT2 - 1, P = [H + H * k, H - H * (2 - Math.SQRT2)];
      var pp = pointToPoint([0, H], P); list.push({ op: 'fold', a: pp.a, b: pp.b, type: 'V', side: pp.side, layers: 'all' }); st = applyStep(st, list[list.length - 1]).state;
      var P2 = [2 * H - P[0], P[1]], pq = pointToPoint([2 * H, H], P2); list.push({ op: 'fold', a: pq.a, b: pq.b, type: 'V', side: pq.side, layers: 'all' }); st = applyStep(st, list[list.length - 1]).state;
      push(stepFrom([0, P[1]], [2 * H, P[1]], [H, 0], 'V', 'top'));
      push({ op: 'flip' });
      push(stepFrom([0, P[1]], [2 * H, P[1]], [H, 0], 'V', 'top'));
    } else if (id === 'hat') {
      var h2 = Math.SQRT2 / 2;
      push(stepFrom([0, h2], [1, h2], [0.5, 0.1]));
      push(stepFrom([0.5, h2], [0, h2 + 0.5], [0.05, h2 + 0.05]));
      push(stepFrom([0.5, h2], [1, h2 + 0.5], [0.95, h2 + 0.05]));
      push(stepFrom([0, h2 + 0.5], [1, h2 + 0.5], [0.5, Math.SQRT2 - 0.02], 'V', 'top'));
      push({ op: 'flip' });
      push(stepFrom([0, h2 + 0.5], [1, h2 + 0.5], [0.5, Math.SQRT2 - 0.02], 'V', 'top'));
    } else if (id === 'plane') {
      var y2 = 0.5 / Math.tan(22.5 * Math.PI / 180);
      push(stepFrom([0.5, 0], [0, 0.5], [0.02, 0.02]));
      push(stepFrom([0.5, 0], [1, 0.5], [0.98, 0.02]));
      push(stepFrom([0.5, 0], [0, y2], [0.03, 0.6]));
      push(stepFrom([0.5, 0], [1, y2], [0.97, 0.6]));
      push(stepFrom([0.5, 0], [0.5, Math.SQRT2], [0.2, 1.3], 'M'));
      var wa = [0.5, 0], wb = [0.62, Math.SQRT2], wm = [0.9, 1.3];
      push(stepFrom(wa, wb, wm, 'V', 'top'));
      var b = paperBBox(st), cx = (b.minX + b.maxX) / 2;
      push({ op: 'flip' });
      push(stepFrom(mirrorX(wa, cx), mirrorX(wb, cx), mirrorX(wm, cx), 'V', 'top'));
    }
    return { paper: paper, steps: list };
  }

  /* ---------- Vértice plano ---------- */
  function sectors(creases) {
    var c = creases.slice().sort(function (x, y) { return x.a - y.a; });
    return c.map(function (cr, i) { var nx = c[(i + 1) % c.length]; var d = nx.a - cr.a; if (d <= 0) d += 360; return d; });
  }
  function checkVertex(creasesIn) {
    var c = creasesIn.slice().sort(function (x, y) { return x.a - y.a; }), n = c.length;
    var M = c.filter(function (x) { return x.t === 'M'; }).length, Vn = n - M;
    var res = { n: n, M: M, V: Vn, maekawa: Math.abs(M - Vn) === 2, even: n % 2 === 0, sectors: n ? sectors(c) : [] };
    var odd = 0, even = 0; res.sectors.forEach(function (s, i) { if (i % 2) odd += s; else even += s; });
    res.sumEven = even; res.sumOdd = odd; res.kawasaki = n >= 2 && res.even && Math.abs(even - odd) < 1e-6;
    /* ángulo pequeño entre dos grandes (big-little-big): sus dos pliegues deben ser distintos */
    res.blb = true; res.blbBad = [];
    for (var i = 0; i < n && n >= 3; i++) {
      var s = res.sectors[i], sp = res.sectors[(i - 1 + n) % n], sn = res.sectors[(i + 1) % n];
      if (s < sp - 1e-9 && s < sn - 1e-9 && c[i].t === c[(i + 1) % n].t) { res.blb = false; res.blbBad.push(i); }
    }
    res.flat = res.kawasaki && res.maekawa && crimpReduce(c.map(function (x) { return x.t; }), res.sectors.slice());
    return res;
  }
  /* Reducción por zigzag: mientras haya un sector que no sea mayor que sus vecinos y con pliegues distintos, se aplasta. */
  function crimpReduce(types, secs) {
    types = types.slice(); secs = secs.slice();
    while (types.length > 2) {
      var n = types.length, done = false;
      for (var i = 0; i < n; i++) {
        var s = secs[i], sp = secs[(i - 1 + n) % n], sn = secs[(i + 1) % n], j = (i + 1) % n;
        if (s <= sp + 1e-9 && s <= sn + 1e-9 && types[i] !== types[j]) {
          /* el sector i queda entre los pliegues i y j: se funden sp - s + sn */
          var merged = sp - s + sn, ip = (i - 1 + n) % n;
          var nt = [], ns = [];
          for (var k = 0; k < n; k++) {
            if (k === i || k === j) continue;
            nt.push(types[k]);
          }
          /* reconstruye sectores en el orden de los pliegues que quedan */
          var order = []; for (var k2 = 0; k2 < n; k2++) if (k2 !== i && k2 !== j) order.push(k2);
          order.forEach(function (k3) { if (k3 === ip) ns.push(merged); else ns.push(secs[k3]); });
          types = nt; secs = ns; done = true; break;
        }
      }
      if (!done) return false;
    }
    return types.length === 2 && types[0] === types[1] && Math.abs(secs[0] - secs[1]) < 1e-6;
  }

  return {
    KINDS: KINDS, FAMILY: FAMILY, HAS_N: HAS_N, build: build, nets: nets, netDrawing: netDrawing, hinges: hinges, bboxOf: bboxOf,
    paperStart: paperStart, foldPaper: foldPaper, flipPaper: flipPaper, rotatePaper: rotatePaper, applyStep: applyStep, replay: replay,
    paperMarks: paperMarks, clipLineToBox: clipLineToBox, lineOnPaper: lineOnPaper, defaultSide: defaultSide, pointToPoint: pointToPoint,
    paperBBox: paperBBox, lineNormal: lineNormal, sideOf: sideOf, reflectT: reflectT, applyT: applyT, invT: invT, area: area, origPoly: origPoly,
    stepFrom: stepFrom, guide: guide, checkVertex: checkVertex, crimpReduce: crimpReduce, convexOverlap: convexOverlap, centroid2: centroid2
  };
});
