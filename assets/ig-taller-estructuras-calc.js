/* Iris Green · El taller · cálculo de estructuras de barras articuladas (celosías) en 2D.
   Método de rigidez directa: cada pieza trabaja a tracción o a compresión. Las cuerdas y los cables
   solo trabajan a tracción; las piezas comprimidas pueden pandear (Euler). Valores simplificados
   para aprender: no sirven para construir nada real. Sin dependencias ni acceso a red. */
(function (root) {
  'use strict';
  var G = 9.81;
  var PRETENSION = 0.1; /* cables y cuerdas se montan tensados al 10 % de su resistencia */

  /* Materiales. A en m², I en m⁴ (eje débil), E en Pa, f en Pa, rho en kg/m³. */
  var MATERIALS = {
    maqueta: {
      palito: { A: 2e-5, I: 6.667e-12, E: 1.0e10, f: 3.0e7, rho: 600, tensionOnly: false },
      liston: { A: 2.5e-5, I: 5.208e-11, E: 1.0e10, f: 3.0e7, rho: 500, tensionOnly: false },
      hilo: { A: 1.77e-6, I: 0, E: 1.0e9, cap: 60, rho: 1100, tensionOnly: true }
    },
    real: {
      madera: { A: 0.04, I: 1.333e-4, E: 1.1e10, f: 2.4e7, rho: 450, tensionOnly: false },
      acero: { A: 5.38e-3, I: 6.04e-6, E: 2.1e11, f: 2.75e8, rho: 7850, tensionOnly: false },
      cable: { A: 1.5e-3, I: 0, E: 1.6e11, cap: 1.5e6, rho: 8000, tensionOnly: true }
    }
  };
  var SCALES = {
    maqueta: { grid: 0.05, unit: 'N', road: false },
    real: { grid: 1, unit: 'kN', road: true, deckLoad: 400 /* kg por metro de calzada */ }
  };
  /* Vehículos: ejes con masa (kg) y posición relativa al primer eje (m). */
  var VEHICLES = {
    persona: [{ d: 0, kg: 80 }],
    grupo: [{ d: 0, kg: 240 }, { d: 1, kg: 240 }, { d: 2, kg: 240 }, { d: 3, kg: 240 }],
    coche: [{ d: 0, kg: 750 }, { d: -2.6, kg: 750 }],
    camion: [{ d: 0, kg: 7000 }, { d: -3.6, kg: 9500 }, { d: -4.9, kg: 9500 }],
    tren: [{ d: 0, kg: 20000 }, { d: -2.6, kg: 20000 }, { d: -10.4, kg: 20000 }, { d: -13, kg: 20000 },
      { d: -17.5, kg: 15000, u: 1 }, { d: -20.1, kg: 15000, u: 1 }, { d: -30.7, kg: 15000, u: 1 }, { d: -33.3, kg: 15000, u: 1 }]
  };

  function mat(scale, key) { var s = MATERIALS[scale]; return s[key] || s[Object.keys(s)[0]]; }
  function capacities(m, L) {
    var t = m.cap !== undefined ? m.cap : m.f * m.A;
    if (m.tensionOnly) return { t: t, c: 0 };
    var y = m.f * m.A, euler = Math.PI * Math.PI * m.E * m.I / (L * L);
    return { t: t, c: Math.min(y, euler), buckles: euler < y };
  }
  function length(n1, n2) { return Math.hypot(n2.x - n1.x, n2.y - n1.y); }

  /* Factorización LDLᵀ sin pivotaje de la matriz simétrica (rígida si la estructura no es un mecanismo). */
  function factor(K, n) {
    var L = K, D = new Float64Array(n), maxDiag = 0, i, j, k;
    for (i = 0; i < n; i++) maxDiag = Math.max(maxDiag, Math.abs(K[i * n + i]));
    var tol = maxDiag * 1e-10;
    for (j = 0; j < n; j++) {
      var s = L[j * n + j];
      for (k = 0; k < j; k++) s -= L[j * n + k] * L[j * n + k] * D[k];
      if (!(s > tol)) return { singular: j };
      D[j] = s;
      for (i = j + 1; i < n; i++) {
        var v = L[i * n + j];
        for (k = 0; k < j; k++) v -= L[i * n + k] * L[j * n + k] * D[k];
        L[i * n + j] = v / s;
      }
    }
    return { L: L, D: D, n: n };
  }
  function solveF(F, b) {
    var n = F.n, L = F.L, D = F.D, x = new Float64Array(b), i, k;
    for (i = 0; i < n; i++) { var s = x[i]; for (k = 0; k < i; k++) s -= L[i * n + k] * x[k]; x[i] = s; }
    for (i = 0; i < n; i++) x[i] /= D[i];
    for (i = n - 1; i >= 0; i--) { var t = x[i]; for (k = i + 1; k < n; k++) t -= L[k * n + i] * x[k]; x[i] = t; }
    return x;
  }

  /* Prepara la estructura: nudos usados, grados de libertad y datos de cada pieza. */
  function prepare(model) {
    var scale = model.scale, nodes = model.nodes, used = {}, members = [];
    model.members.forEach(function (m, idx) {
      var a = nodes[m.a], b = nodes[m.b]; if (!a || !b) return;
      var Lm = length(a, b); if (Lm < 1e-6) return;
      var base = mat(scale, m.mat), k = Math.max(1, Math.min(3, Math.round(m.k || 1)));
      /* sección doble o triple: piezas iguales unidas en paralelo */
      var M = { A: base.A * k, I: base.I * k, E: base.E, f: base.f, rho: base.rho, tensionOnly: base.tensionOnly, cap: base.cap === undefined ? undefined : base.cap * k };
      var cap = capacities(M, Lm);
      members.push({ idx: idx, a: m.a, b: m.b, L: Lm, c: (b.x - a.x) / Lm, s: (b.y - a.y) / Lm, EA: M.E * M.A, M: M, cap: cap, mass: M.rho * M.A * Lm,
        pre: M.tensionOnly ? PRETENSION * cap.t : 0 });
      used[m.a] = 1; used[m.b] = 1;
    });
    var dof = {}, nFree = 0;
    Object.keys(used).forEach(function (k) {
      var nd = nodes[k]; if (nd.anchor) return;
      dof[k] = nFree; nFree += 2;
    });
    return { members: members, dof: dof, n: nFree, used: used };
  }
  function assemble(P, alive) {
    var n = P.n, K = new Float64Array(n * n);
    P.members.forEach(function (m, i) {
      if (!alive[i]) return;
      var k = m.EA / m.L, cc = m.c * m.c * k, ss = m.s * m.s * k, cs = m.c * m.s * k;
      var da = P.dof[m.a], db = P.dof[m.b];
      var blk = [[cc, cs], [cs, ss]];
      function add(r, c, v) { K[r * n + c] += v; }
      [0, 1].forEach(function (p) {
        [0, 1].forEach(function (q) {
          var v = blk[p][q];
          if (da !== undefined) add(da + p, da + q, v);
          if (db !== undefined) add(db + p, db + q, v);
          if (da !== undefined && db !== undefined) { add(da + p, db + q, -v); add(db + p, da + q, -v); }
        });
      });
    });
    return K;
  }
  function memberForces(P, u, alive) {
    return P.members.map(function (m, i) {
      if (!alive[i]) return 0;
      var da = P.dof[m.a], db = P.dof[m.b];
      var ua = da === undefined ? [0, 0] : [u[da], u[da + 1]], ub = db === undefined ? [0, 0] : [u[db], u[db + 1]];
      var elong = (ub[0] - ua[0]) * m.c + (ub[1] - ua[1]) * m.s;
      return m.EA / m.L * elong; /* + tracción, − compresión */
    });
  }

  /* Cargas: peso propio de las piezas, peso de la calzada y cargas puntuales en nudos. */
  function selfWeight(P, alive) {
    var F = new Float64Array(P.n);
    P.members.forEach(function (m, i) {
      if (!alive[i]) return;
      var w = m.mass * G / 2;
      [m.a, m.b].forEach(function (k) { var d = P.dof[k]; if (d !== undefined) F[d + 1] -= w; });
    });
    return F;
  }
  function addPoint(F, P, nodeKey, N) { var d = P.dof[nodeKey]; if (d !== undefined) F[d + 1] -= N; }

  /* Tramos de calzada: piezas horizontales a la altura del tablero (y = 0) entre los dos bordes. */
  function roadSegments(model) {
    var segs = [], nodes = model.nodes;
    model.members.forEach(function (m) {
      var a = nodes[m.a], b = nodes[m.b]; if (!a || !b) return;
      if (Math.abs(a.y) < 1e-6 && Math.abs(b.y) < 1e-6 && Math.abs(a.x - b.x) > 1e-6) {
        segs.push(a.x < b.x ? { x0: a.x, x1: b.x, na: m.a, nb: m.b } : { x0: b.x, x1: a.x, na: m.b, nb: m.a });
      }
    });
    segs.sort(function (p, q) { return p.x0 - q.x0; });
    return segs;
  }
  function roadGaps(model) {
    var half = model.span / 2, segs = roadSegments(model), x = -half, gaps = [];
    segs.forEach(function (s) { if (s.x0 > x + 1e-6) gaps.push([x, s.x0]); if (s.x1 > x) x = s.x1; });
    if (x < half - 1e-6) gaps.push([x, half]);
    return gaps;
  }
  function distributeAt(model, segs, xPos, N, out) {
    var half = model.span / 2;
    if (xPos <= -half + 1e-9 || xPos >= half - 1e-9) return; /* sobre el terreno */
    for (var i = 0; i < segs.length; i++) {
      var s = segs[i];
      if (xPos >= s.x0 - 1e-9 && xPos <= s.x1 + 1e-9) {
        var r = (xPos - s.x0) / (s.x1 - s.x0);
        out.push([s.na, N * (1 - r)], [s.nb, N * r]);
        return;
      }
    }
  }

  /* Situaciones de carga: una por posición del vehículo, o una sola para un peso fijo. */
  function loadCases(model) {
    var cases = [], ld = model.load || { type: 'peso', kg: 1, at: [0, 0] };
    if (ld.type === 'peso') {
      var key = null;
      Object.keys(model.nodes).forEach(function (k) { var n = model.nodes[k]; if (Math.abs(n.x - ld.at[0]) < 1e-6 && Math.abs(n.y - ld.at[1]) < 1e-6) key = k; });
      cases.push({ pos: null, point: key === null ? null : [[key, ld.kg * G]], missingPoint: key === null });
      return cases;
    }
    var axles = VEHICLES[ld.type] || VEHICLES.coche, segs = roadSegments(model), half = model.span / 2;
    var minD = Math.min.apply(null, axles.map(function (a) { return a.d; }));
    var step = Math.max(0.25, model.span / 80);
    for (var front = -half; front <= half - minD + 1e-9; front += step) {
      var pts = [];
      axles.forEach(function (a) { distributeAt(model, segs, front + a.d, a.kg * G, pts); });
      cases.push({ pos: front, point: pts });
    }
    return cases;
  }

  /* Resuelve una situación de carga con cables flojos y roturas progresivas. */
  function solveCase(P, model, lc, aliveIn, deck) {
    var alive = aliveIn.slice(), slack = P.members.map(function () { return false; }), cache = {};
    var broken = [], history = [];
    for (var round = 0; round < 60; round++) {
      var res = null;
      for (var it = 0; it < 12; it++) {
        var active = alive.map(function (a, i) { return a && !slack[i]; });
        var key = active.map(function (a) { return a ? 1 : 0; }).join('');
        var Fc = cache[key];
        if (!Fc) { Fc = P.n ? factor(assemble(P, active), P.n) : { L: null, D: null, n: 0 }; cache[key] = Fc; }
        if (Fc.singular !== undefined) { res = { mechanism: true, dof: Fc.singular }; break; }
        var F = selfWeight(P, active);
        if (deck) deck.forEach(function (d) { addPoint(F, P, d[0], d[1]); });
        (lc.point || []).forEach(function (p) { addPoint(F, P, p[0], p[1]); });
        var u = P.n ? solveF(Fc, F) : new Float64Array(0);
        var f = memberForces(P, u, active);
        /* los cables se montan tensados: su fuerza real es el pretensado más la variación elástica */
        P.members.forEach(function (m, i) { if (active[i] && m.M.tensionOnly) f[i] += m.pre; });
        var changed = false, fmax = 0;
        f.forEach(function (x) { if (Math.abs(x) > fmax) fmax = Math.abs(x); });
        var tolF = Math.max(1e-9, fmax * 1e-7);
        P.members.forEach(function (m, i) {
          if (!alive[i] || !m.M.tensionOnly) return;
          if (!slack[i] && f[i] < -tolF) { slack[i] = true; changed = true; }
        });
        if (!changed) {
          /* un cable flojo que ahora se estiraría vuelve a tensarse */
          P.members.forEach(function (m, i) {
            if (!alive[i] || !slack[i]) return;
            var da = P.dof[m.a], db = P.dof[m.b];
            var ua = da === undefined ? [0, 0] : [u[da], u[da + 1]], ub = db === undefined ? [0, 0] : [u[db], u[db + 1]];
            if (m.EA / m.L * ((ub[0] - ua[0]) * m.c + (ub[1] - ua[1]) * m.s) > -m.pre) { slack[i] = false; changed = true; }
          });
        }
        res = { u: u, f: f, active: active };
        if (!changed) break;
      }
      if (res.mechanism) {
        var node = null; Object.keys(P.dof).forEach(function (k) { if (P.dof[k] === res.dof - (res.dof % 2)) node = k; });
        return { alive: alive, broken: broken, collapse: true, mechanismNode: node, history: history };
      }
      var worst = -1, worstU = 1;
      var util = P.members.map(function (m, i) {
        if (!alive[i]) return 0;
        if (slack[i]) return 0;
        var F2 = res.f[i], cap = F2 >= 0 ? m.cap.t : m.cap.c;
        var uu = cap > 0 ? Math.abs(F2) / cap : (Math.abs(F2) > 1e-6 ? Infinity : 0);
        if (uu > worstU) { worstU = uu; worst = i; }
        return uu;
      });
      history.push({ f: res.f, util: util, u: res.u, slack: slack.slice() });
      if (worst < 0) return { alive: alive, broken: broken, collapse: false, f: res.f, util: util, u: res.u, slack: slack };
      alive[worst] = false; broken.push({ i: worst, force: res.f[worst], util: util[worst] });
    }
    return { alive: alive, broken: broken, collapse: true, history: history };
  }

  function deckLoads(model, P) {
    var sc = SCALES[model.scale]; if (!sc.road) return null;
    var out = [];
    roadSegments(model).forEach(function (s) {
      var N = sc.deckLoad * (s.x1 - s.x0) * G / 2;
      out.push([s.na, N], [s.nb, N]);
    });
    return out;
  }

  /* Prueba completa: recorre las posiciones de carga, se para en la primera rotura. */
  function test(model) {
    var P = prepare(model);
    var out = { members: P.members, mass: P.members.reduce(function (s, m) { return s + m.mass; }, 0), pieces: P.members.length, cases: [], ok: true };
    if (!P.members.length) { out.ok = false; out.reason = 'empty'; return out; }
    var ld = model.load || {};
    if (ld.type && ld.type !== 'peso') {
      var gaps = roadGaps(model);
      if (gaps.length) { out.ok = false; out.reason = 'road'; out.gaps = gaps; return out; }
    }
    var lcs = loadCases(model);
    if (lcs.length && lcs[0].missingPoint) { out.ok = false; out.reason = 'loadPoint'; return out; }
    var alive = P.members.map(function () { return true; }), deck = deckLoads(model, P);
    var maxUtil = P.members.map(function () { return 0; }), maxForce = P.members.map(function () { return 0; });
    for (var i = 0; i < lcs.length; i++) {
      var r = solveCase(P, model, lcs[i], alive, deck);
      var entry = { pos: lcs[i].pos, point: lcs[i].point, collapse: r.collapse, broken: r.broken, f: r.f, util: r.util, u: r.u, slack: r.slack, alive: r.alive, mechanismNode: r.mechanismNode };
      out.cases.push(entry);
      if (r.util) r.util.forEach(function (x, j) { if (x > maxUtil[j]) { maxUtil[j] = x; maxForce[j] = r.f[j]; } });
      if (r.collapse || r.broken.length) {
        out.ok = false; out.failAt = i; out.reason = r.collapse ? 'collapse' : 'broken';
        var first = r.history && r.history[0];
        if (first) { first.util.forEach(function (x, j) { if (x > maxUtil[j]) { maxUtil[j] = x; maxForce[j] = first.f[j]; } }); }
        break;
      }
    }
    out.maxUtil = maxUtil; out.maxForce = maxForce;
    out.peak = maxUtil.reduce(function (a, b) { return Math.max(a, b); }, 0);
    return out;
  }

  var API = { PRETENSION: PRETENSION, MATERIALS: MATERIALS, SCALES: SCALES, VEHICLES: VEHICLES, capacities: capacities, test: test, roadGaps: roadGaps, prepare: prepare, G: G };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.IGTCalc = API;
})(typeof window !== 'undefined' ? window : this);
