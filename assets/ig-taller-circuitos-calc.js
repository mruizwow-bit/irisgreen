/* Iris Green · El taller · cálculo de circuitos.
   Electricidad: análisis nodal (leyes de Kirchhoff y de Ohm) con modelos simplificados de pila, bombilla,
   LED, resistencia, interruptor, conmutador y motor. Lógica: redes con puertas, biestables D y reloj,
   tabla de verdad automática. Sin dependencias ni red. Valores aproximados para aprender. */
(function (root) {
  'use strict';

  /* ---------- Componentes eléctricos ---------- */
  var BATTERIES = { aa: { v: 1.5, r: 0.2, imax: 2 }, pack: { v: 4.5, r: 0.6, imax: 2 }, v9: { v: 9, r: 1.5, imax: 1 } };
  var LAMP = { r: 15, prated: 1.35, pburn: 2.4 };            /* bombilla de 4,5 V y 0,3 A */
  var LEDS = { rojo: { vf: 2.0, color: '#e0322b' }, verde: { vf: 2.1, color: '#27a347' }, amarillo: { vf: 2.1, color: '#f2b705' }, azul: { vf: 3.0, color: '#2f6bff' } };
  var LED_RS = 10, LED_INOM = 0.02, LED_IMAX = 0.03;
  var MOTOR = { r: 8, istart: 0.12, rpmPerA: 9000 };
  var RESISTORS = [10, 22, 47, 100, 220, 330, 470, 680, 1000, 2200, 4700, 10000];
  var GMIN = 1e-9;

  function pk(p) { return p[0] + ',' + p[1]; }
  function UF() { var par = {}; this.find = function (a) { if (par[a] === undefined) par[a] = a; while (par[a] !== a) { par[a] = par[par[a]]; a = par[a]; } return a; }; this.union = function (a, b) { a = this.find(a); b = this.find(b); if (a !== b) par[a] = b; }; }

  /* Terminales de cada componente. Los de dos terminales van de a a b; el conmutador tiene común y dos salidas. */
  function terminals(c) {
    if (c.t === 'spdt') return { c: pk(c.p), t1: pk([c.p[0] + 2, c.p[1] - 1]), t2: pk([c.p[0] + 2, c.p[1] + 1]) };
    return { a: pk(c.a), b: pk(c.b) };
  }

  function gauss(A, b, n) {
    for (var i = 0; i < n; i++) {
      var piv = i, mx = Math.abs(A[i][i]);
      for (var r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > mx) { mx = Math.abs(A[r][i]); piv = r; }
      if (mx < 1e-18) return null;
      if (piv !== i) { var tmp = A[i]; A[i] = A[piv]; A[piv] = tmp; var tb = b[i]; b[i] = b[piv]; b[piv] = tb; }
      for (var r2 = i + 1; r2 < n; r2++) {
        var f = A[r2][i] / A[i][i]; if (!f) continue;
        for (var c = i; c < n; c++) A[r2][c] -= f * A[i][c];
        b[r2] -= f * b[i];
      }
    }
    var x = new Array(n);
    for (var k = n - 1; k >= 0; k--) { var s = b[k]; for (var j = k + 1; j < n; j++) s -= A[k][j] * x[j]; x[k] = s / A[k][k]; }
    return x;
  }

  /* Resuelve el circuito. Devuelve tensiones de nudo y, por componente, corriente, tensión y estado. */
  function solveElec(comps) {
    var uf = new UF();
    comps.forEach(function (c) {
      var T = terminals(c);
      if (c.t === 'wire' || (c.t === 'switch' && c.on)) uf.union(T.a, T.b);
      if (c.t === 'spdt') uf.union(T.c, c.pos === 2 ? T.t2 : T.t1);
    });
    var nodes = {}, n = 0;
    function idx(p) { var r = uf.find(p); if (nodes[r] === undefined) nodes[r] = n++; return nodes[r]; }
    var elems = [];
    comps.forEach(function (c, i) {
      if (c.t === 'wire' || c.t === 'switch' || c.t === 'spdt') { var T0 = terminals(c); if (c.t !== 'spdt') { idx(T0.a); idx(T0.b); } else { idx(T0.c); idx(T0.t1); idx(T0.t2); } return; }
      var T = terminals(c), a = idx(T.a), b = idx(T.b);
      elems.push({ i: i, c: c, a: a, b: b, on: true });
    });
    var res = { ok: true, nodeV: {}, comps: comps.map(function () { return null; }), short: false, warnings: [] };
    if (!elems.some(function (e) { return e.c.t === 'battery'; })) { res.ok = false; res.reason = 'noBattery'; return res; }
    var ground = elems.filter(function (e) { return e.c.t === 'battery'; })[0].a;
    var x = null;
    for (var iter = 0; iter < 30; iter++) {
      var N = n, A = [], rhs = [];
      for (var r = 0; r < N; r++) { A.push(new Array(N).fill(0)); rhs.push(0); A[r][r] += 1e-12; }
      var stamp = function (a, b, g) { A[a][a] += g; A[b][b] += g; A[a][b] -= g; A[b][a] -= g; };
      var src = function (a, b, I) { /* corriente I que entra en b y sale de a (de a hacia b por dentro) */ rhs[a] -= I; rhs[b] += I; };
      elems.forEach(function (e) {
        var c = e.c;
        if (c.a && c.b && e.a === e.b) return;
        if (c.t === 'battery') { var B = BATTERIES[c.kind] || BATTERIES.pack; stamp(e.a, e.b, 1 / B.r); src(e.a, e.b, B.v / B.r); }
        else if (c.t === 'resistor') stamp(e.a, e.b, 1 / Math.max(1, c.r || 100));
        else if (c.t === 'lamp') stamp(e.a, e.b, 1 / LAMP.r);
        else if (c.t === 'motor') stamp(e.a, e.b, 1 / MOTOR.r);
        else if (c.t === 'led') { if (e.on) { var L = LEDS[c.color] || LEDS.rojo; stamp(e.a, e.b, 1 / LED_RS); src(e.b, e.a, L.vf / LED_RS); } else stamp(e.a, e.b, GMIN); }
      });
      /* tierra: se elimina la fila y columna del nudo de referencia */
      var keep = []; for (var q = 0; q < N; q++) if (q !== ground) keep.push(q);
      var A2 = keep.map(function (ri) { return keep.map(function (ci) { return A[ri][ci]; }); }), b2 = keep.map(function (ri) { return rhs[ri]; });
      var sol = gauss(A2, b2, keep.length);
      if (!sol) { res.ok = false; res.reason = 'singular'; return res; }
      x = new Array(N).fill(0); keep.forEach(function (ri, k) { x[ri] = sol[k]; });
      /* LED: encendido si la tensión directa supera la de umbral */
      var changed = false;
      elems.forEach(function (e) {
        if (e.c.t !== 'led') return;
        var L = LEDS[e.c.color] || LEDS.rojo, vab = x[e.a] - x[e.b];
        var should = e.on ? (vab - L.vf) / LED_RS > -1e-9 : vab > L.vf;
        if (should !== e.on) { e.on = should; changed = true; }
      });
      if (!changed) break;
    }
    Object.keys(nodes).forEach(function (k) { res.nodeV[k] = x[nodes[k]]; });
    elems.forEach(function (e) {
      var c = e.c, vab = x[e.a] - x[e.b], out = { v: vab, i: 0 };
      if (c.t === 'battery') { var B = BATTERIES[c.kind] || BATTERIES.pack; out.i = (B.v - (x[e.b] - x[e.a])) / B.r; out.v = x[e.b] - x[e.a]; out.short = out.i > B.imax; if (out.short) res.short = true; }
      else if (c.t === 'resistor') { out.i = vab / Math.max(1, c.r || 100); out.p = out.i * out.i * (c.r || 100); out.hot = out.p > 0.5; }
      else if (c.t === 'lamp') { out.i = vab / LAMP.r; out.p = out.i * out.i * LAMP.r; out.bright = Math.min(1.5, out.p / LAMP.prated); out.burnt = out.p > LAMP.pburn; }
      else if (c.t === 'motor') { out.i = vab / MOTOR.r; out.spin = Math.abs(out.i) > MOTOR.istart; out.rpm = out.spin ? Math.round(Math.abs(out.i) * MOTOR.rpmPerA) : 0; out.dir = out.i >= 0 ? 1 : -1; }
      else if (c.t === 'led') { out.i = e.on ? (vab - (LEDS[c.color] || LEDS.rojo).vf) / LED_RS : 0; out.lit = out.i > 0.001; out.bright = Math.min(1.5, out.i / LED_INOM); out.burnt = out.i > LED_IMAX; out.reverse = vab < -0.5; }
      res.comps[e.i] = out;
    });
    comps.forEach(function (c, i) {
      if (res.comps[i]) return;
      if (c.t === 'wire' || c.t === 'switch') { res.comps[i] = { v: 0, i: null }; }
      if (c.t === 'spdt') res.comps[i] = { v: 0, i: null };
    });
    return res;
  }

  /* ---------- Lógica ---------- */
  var GATES = {
    and: { n: 2, f: function (a, b) { return a & b; } }, or: { n: 2, f: function (a, b) { return a | b; } }, not: { n: 1, f: function (a) { return a ? 0 : 1; } },
    xor: { n: 2, f: function (a, b) { return a ^ b; } }, nand: { n: 2, f: function (a, b) { return (a & b) ? 0 : 1; } }, nor: { n: 2, f: function (a, b) { return (a | b) ? 0 : 1; } }
  };
  function logicPins(c) {
    if (c.t === 'wire') return { ins: [], a: pk(c.a), b: pk(c.b) };
    var x = c.p[0], y = c.p[1];
    if (GATES[c.t]) return GATES[c.t].n === 1 ? { ins: [pk([x, y])], out: pk([x + 2, y]) } : { ins: [pk([x, y - 1]), pk([x, y + 1])], out: pk([x + 2, y]) };
    if (c.t === 'dff') return { ins: [pk([x, y - 1]), pk([x, y + 1])], out: pk([x + 2, y - 1]), outN: pk([x + 2, y + 1]) };
    if (c.t === 'input' || c.t === 'clock') return { ins: [], out: pk(c.p) };
    if (c.t === 'out') return { ins: [pk(c.p)] };
    if (c.t === 'wire') return { ins: [], a: pk(c.a), b: pk(c.b) };
    return { ins: [] };
  }
  /* Construye las redes y comprueba que cada una tenga como mucho una salida que la mande. */
  function Logic(comps) {
    var uf = new UF();
    comps.forEach(function (c) { if (c.t === 'wire') uf.union(pk(c.a), pk(c.b)); });
    this.net = function (p) { return uf.find(p); };
    var drivers = {}, conflicts = [];
    var self = this;
    comps.forEach(function (c, i) {
      var P = logicPins(c);
      [P.out, P.outN].forEach(function (o, k) {
        if (!o) return; var nn = self.net(o);
        if (drivers[nn] !== undefined) conflicts.push(i); else drivers[nn] = { i: i, n: k };
      });
    });
    this.comps = comps; this.drivers = drivers; this.conflicts = conflicts;
    this.state = comps.map(function (c) { return c.t === 'dff' ? 0 : null; });
  }
  Logic.prototype.values = function (inputs, clockHigh) {
    /* inputs: valores de las entradas por índice de componente (si no, su valor guardado) */
    var comps = this.comps, self = this, val = {}, gateOut = {};
    function driveOf(i, k) {
      var c = comps[i];
      if (c.t === 'input') return inputs && inputs[i] !== undefined ? inputs[i] : (c.v ? 1 : 0);
      if (c.t === 'clock') return clockHigh ? 1 : 0;
      if (c.t === 'dff') return k === 0 ? self.state[i] : 1 - self.state[i];
      return gateOut[i] || 0;
    }
    function netVal(p) { var nn = self.net(p), d = self.drivers[nn]; return d ? driveOf(d.i, d.n) : null; }
    var stable = false, iter = 0;
    while (!stable && iter < 64) {
      stable = true; iter++;
      comps.forEach(function (c, i) {
        if (!GATES[c.t]) return;
        var P = logicPins(c), ins = P.ins.map(function (p) { var v = netVal(p); return v === null ? 0 : v; });
        var o = GATES[c.t].f(ins[0], ins[1]);
        if (gateOut[i] !== o) { gateOut[i] = o; stable = false; }
      });
    }
    var outV = {};
    comps.forEach(function (c, i) {
      var P = logicPins(c);
      if (c.t === 'out') outV[i] = netVal(P.ins[0]);
    });
    return { net: netVal, out: outV, oscillates: !stable, gateOut: gateOut, driveOf: driveOf };
  };
  /* Un pulso de reloj: los biestables copian D en el flanco de subida. */
  Logic.prototype.pulse = function (inputs) {
    var comps = this.comps, self = this;
    var before = this.values(inputs, false), sample = {};
    comps.forEach(function (c, i) { if (c.t === 'dff') { var P = logicPins(c); var d = before.net(P.ins[0]); sample[i] = d ? 1 : 0; } });
    var high = this.values(inputs, true);
    comps.forEach(function (c, i) {
      if (c.t !== 'dff') return;
      var P = logicPins(c), clkBefore = before.net(P.ins[1]), clkAfter = high.net(P.ins[1]);
      if (!clkBefore && clkAfter) self.state[i] = sample[i];
    });
    return this.values(inputs, false);
  };
  Logic.prototype.reset = function () { this.state = this.comps.map(function (c) { return c.t === 'dff' ? 0 : null; }); };

  /* Tabla de verdad por etiquetas: entradas y salidas ordenadas por nombre. */
  function truthTable(comps) {
    var L = new Logic(comps);
    var ins = [], outs = [];
    comps.forEach(function (c, i) { if (c.t === 'input') ins.push(i); if (c.t === 'out') outs.push(i); });
    var byName = function (a, b) { return String(comps[a].label).localeCompare(String(comps[b].label)); };
    ins.sort(byName); outs.sort(byName);
    if (ins.length > 6) return { tooMany: true, ins: ins, outs: outs };
    var rows = [];
    for (var m = 0; m < (1 << ins.length); m++) {
      var inp = {}; ins.forEach(function (ci, k) { inp[ci] = (m >> (ins.length - 1 - k)) & 1; });
      var r = L.values(inp, false);
      rows.push({ ins: ins.map(function (ci) { return inp[ci]; }), outs: outs.map(function (oi) { return r.out[oi] === null ? null : r.out[oi]; }), osc: r.oscillates });
    }
    return { ins: ins, outs: outs, rows: rows, conflicts: L.conflicts, labelsIn: ins.map(function (i) { return comps[i].label; }), labelsOut: outs.map(function (i) { return comps[i].label; }) };
  }
  /* Compara con una función objetivo: spec = { ins: ['A','B'], outs: ['S'], f: function (bits) → [salidas] } */
  function matchTable(comps, spec) {
    var tt = truthTable(comps);
    if (tt.tooMany) return { ok: false, reason: 'tooMany' };
    var need = function (have, want) { return want.every(function (w) { return have.indexOf(w) >= 0; }); };
    if (!need(tt.labelsIn, spec.ins)) return { ok: false, reason: 'labelsIn', tt: tt };
    if (!need(tt.labelsOut, spec.outs)) return { ok: false, reason: 'labelsOut', tt: tt };
    var bad = 0, total = 0, osc = false;
    tt.rows.forEach(function (row) {
      var bits = spec.ins.map(function (name) { return row.ins[tt.labelsIn.indexOf(name)]; });
      var want = spec.f(bits);
      spec.outs.forEach(function (name, k) { total++; var got = row.outs[tt.labelsOut.indexOf(name)]; if (got !== want[k]) bad++; });
      if (row.osc) osc = true;
    });
    /* filas repetidas por entradas extra no cambian el resultado */
    return { ok: bad === 0 && !osc && !tt.conflicts.length, bad: bad, total: total, osc: osc, conflicts: tt.conflicts.length, tt: tt };
  }
  /* Funciones objetivo de los retos, por nombre. */
  var TARGETS = {
    andNot: { ins: ['A', 'B'], outs: ['S'], f: function (b) { return [b[0] & (1 - b[1])]; } },
    half: { ins: ['A', 'B'], outs: ['S', 'C'], f: function (b) { return [b[0] ^ b[1], b[0] & b[1]]; } },
    full: { ins: ['A', 'B', 'E'], outs: ['S', 'C'], f: function (b) { var s = b[0] + b[1] + b[2]; return [s & 1, s >> 1]; } },
    xorNand: { ins: ['A', 'B'], outs: ['S'], f: function (b) { return [b[0] ^ b[1]]; }, only: ['nand'] },
    add2: { ins: ['A1', 'A0', 'B1', 'B0'], outs: ['S2', 'S1', 'S0'], f: function (b) { var s = (b[0] * 2 + b[1]) + (b[2] * 2 + b[3]); return [(s >> 2) & 1, (s >> 1) & 1, s & 1]; } },
    majority: { ins: ['A', 'B', 'C'], outs: ['S'], f: function (b) { return [(b[0] + b[1] + b[2]) >= 2 ? 1 : 0]; } }
  };
  function randomTarget(seed) {
    var s = (seed >>> 0) || 7, tbl;
    do { s = (s * 1103515245 + 12345) >>> 0; tbl = (s >>> 8) & 0xff; } while (tbl === 0 || tbl === 0xff);
    return { ins: ['A', 'B', 'C'], outs: ['S'], table: tbl, f: function (b) { return [(tbl >> (b[0] * 4 + b[1] * 2 + b[2])) & 1]; } };
  }
  /* Semáforo: tras cada pulso debe haber una sola luz y seguir el orden verde → ámbar → rojo → verde. */
  function checkTraffic(comps, names, pulses) {
    var L = new Logic(comps), idxOf = {};
    comps.forEach(function (c, i) { if (c.t === 'out') idxOf[c.label] = i; });
    if (!names.every(function (n) { return idxOf[n] !== undefined; })) return { ok: false, reason: 'labelsOut' };
    var seq = [], okOne = true;
    L.reset();
    var v = L.values(null, false);
    for (var p = 0; p < (pulses || 8); p++) {
      var on = names.filter(function (n) { return v.out[idxOf[n]] === 1; });
      if (on.length !== 1) okOne = false; else seq.push(on[0]);
      v = L.pulse(null);
    }
    var order = {}; order[names[0]] = names[1]; order[names[1]] = names[2]; order[names[2]] = names[0];
    var trans = true, seen = {};
    seq.forEach(function (x, i) { seen[x] = 1; if (i && x !== seq[i - 1] && order[seq[i - 1]] !== x) trans = false; });
    return { ok: okOne && trans && Object.keys(seen).length === 3, seq: seq, okOne: okOne, trans: trans };
  }

  var API = { BATTERIES: BATTERIES, LAMP: LAMP, LEDS: LEDS, MOTOR: MOTOR, RESISTORS: RESISTORS, LED_IMAX: LED_IMAX, GATES: GATES,
    terminals: terminals, logicPins: logicPins, solveElec: solveElec, Logic: Logic, truthTable: truthTable, matchTable: matchTable, TARGETS: TARGETS,
    randomTarget: randomTarget, checkTraffic: checkTraffic, pk: pk };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.IGTCirc = API;
})(typeof window !== 'undefined' ? window : this);
