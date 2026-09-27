/* Iris Green · El taller · cálculo de máquinas simples: trenes de engranajes, palancas, poleas
   y máquinas en cadena. Modelos ideales con rozamiento sencillo donde se indica. */
(function (root) {
  'use strict';
  var MODULE = 2; /* mm por diente: el radio de paso es z milímetros */
  var G = 9.81;
  function radius(z) { return MODULE * z / 2; }

  /* ---------- Engranajes ---------- */
  function meshes(a, b) {
    if (a.layer !== b.layer) return false;
    var d = Math.hypot(a.x - b.x, a.y - b.y);
    return Math.abs(d - (radius(a.z) + radius(b.z))) < 0.6;
  }
  function sameAxle(a, b) { return Math.hypot(a.x - b.x, a.y - b.y) < 0.6; }
  function collides(a, b) {
    if (a.layer !== b.layer || sameAxle(a, b) || meshes(a, b)) return false;
    return Math.hypot(a.x - b.x, a.y - b.y) < radius(a.z) + radius(b.z) + MODULE * 0.9;
  }
  /* Propaga la velocidad desde el motor. rpm > 0: sentido horario. */
  function solveGears(gears, motorId, motorRpm) {
    var out = { speed: {}, torque: {}, jam: false, loose: [], collisions: [], links: [] };
    var byId = {}; gears.forEach(function (g) { byId[g.id] = g; });
    if (!byId[motorId]) return out;
    gears.forEach(function (a, i) { gears.forEach(function (b, j) { if (j <= i) return; if (meshes(a, b)) out.links.push([a.id, b.id, 'mesh']); else if (sameAxle(a, b)) out.links.push([a.id, b.id, 'axle']); else if (collides(a, b)) out.collisions.push([a.id, b.id]); }); });
    out.speed[motorId] = motorRpm; out.torque[motorId] = 1;
    var queue = [motorId];
    while (queue.length) {
      var id = queue.shift(), g = byId[id];
      out.links.forEach(function (l) {
        var other = l[0] === id ? l[1] : l[1] === id ? l[0] : null; if (other === null) return;
        var o = byId[other], sp, tq;
        if (l[2] === 'mesh') { sp = -out.speed[id] * g.z / o.z; tq = out.torque[id] * o.z / g.z; }
        else { sp = out.speed[id]; tq = out.torque[id]; }
        if (out.speed[other] === undefined) { out.speed[other] = sp; out.torque[other] = tq; queue.push(other); }
        else if (Math.abs(out.speed[other] - sp) > 1e-9 * Math.max(1, Math.abs(sp))) out.jam = true;
      });
    }
    gears.forEach(function (g) { if (out.speed[g.id] === undefined) out.loose.push(g.id); });
    return out;
  }
  /* Coloca un engranaje nuevo engranado con otro en una dirección (grados, 0 = derecha, 90 = abajo). */
  function placeMeshed(base, z, angleDeg) {
    var d = radius(base.z) + radius(z), a = angleDeg * Math.PI / 180;
    return { x: Math.round((base.x + Math.cos(a) * d) * 1000) / 1000, y: Math.round((base.y + Math.sin(a) * d) * 1000) / 1000 };
  }
  function ratioFrac(r) { /* fracción aproximada p/q de una relación */
    var best = [1, 1], err = Infinity;
    for (var q = 1; q <= 200; q++) { var p = Math.round(r * q); if (p < 1) continue; var e = Math.abs(p / q - r); if (e < err - 1e-12) { err = e; best = [p, q]; } if (e < 1e-9) break; }
    return best;
  }
  function randomRatio(seed) {
    var s = (seed >>> 0) || 3, pick = function (a) { s = (s * 1103515245 + 12345) >>> 0; return a[(s >>> 8) % a.length]; };
    var num = pick([1, 2, 3, 4, 5]), den = pick([6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25, 30, 36, 40]), sameDir = pick([true, false]);
    return { ratio: num / den, num: num, den: den, sameDir: sameDir };
  }

  /* ---------- Palanca ---------- */
  /* Tabla de 0 a L metros: fulcro f, carga en c (kg), fuerza en e. Devuelve la fuerza necesaria (kg) y el tipo. */
  function lever(L, f, c, e, loadKg) {
    var dc = Math.abs(c - f), de = Math.abs(e - f);
    var kind = (f > Math.min(c, e) && f < Math.max(c, e)) ? 1 : (Math.abs(c - f) < Math.abs(e - f) ? 2 : 3);
    var sameSide = (c - f) * (e - f) > 0;
    if (de < 1e-6) return { ok: false, reason: 'effortOnFulcrum', kind: kind };
    return { ok: true, effort: loadKg * dc / de, advantage: dc > 0 ? de / dc : Infinity, kind: kind, sameSide: sameSide, dc: dc, de: de };
  }

  /* ---------- Poleas ---------- */
  var PULLEYS = { fija: { n: 1, moving: 0, fixed: 1 }, movil: { n: 2, moving: 1, fixed: 0 }, pol2: { n: 2, moving: 1, fixed: 1 }, pol3: { n: 3, moving: 1, fixed: 2 }, pol4: { n: 4, moving: 2, fixed: 2 }, pol6: { n: 6, moving: 3, fixed: 3 } };
  var PULLEY_KG = 0.4, EFF = 0.95;
  function pulley(kind, loadKg, heightM) {
    var P = PULLEYS[kind] || PULLEYS.fija, pulleys = P.moving + P.fixed;
    var weight = loadKg + P.moving * PULLEY_KG;
    var ideal = weight / P.n, real = ideal / Math.pow(EFF, pulleys);
    return { n: P.n, effortKg: real, idealKg: ideal, rope: heightM * P.n, pulleys: pulleys, moving: P.moving, fixed: P.fixed, work: loadKg * G * heightM };
  }

  /* ---------- Máquina en cadena ---------- */
  var MOVES = ['caida', 'rodar', 'empujon', 'giro', 'tiron', 'balanceo', 'agua'];
  var PARTS = { rampa: ['caida', 'empujon'], palanca: ['empujon', 'caida', 'tiron'], polea: ['tiron', 'caida'], engranaje: ['giro'], domino: ['empujon'], pendulo: ['empujon', 'balanceo'],
    muelle: ['empujon', 'caida'], balanza: ['caida', 'agua'], embudo: ['agua', 'caida'], rueda: ['giro', 'rodar', 'tiron'], cuerda: ['tiron', 'caida'], canica: ['empujon', 'caida', 'rodar'] };
  function checkChain(steps) {
    var bad = [];
    steps.forEach(function (s, i) { if (i && s.inp !== steps[i - 1].out) bad.push(i); });
    var kinds = {}; steps.forEach(function (s) { kinds[s.part] = 1; });
    return { links: steps.length ? steps.length - 1 : 0, bad: bad, kinds: Object.keys(kinds).length, ok: bad.length === 0 };
  }

  var API = { MODULE: MODULE, radius: radius, meshes: meshes, sameAxle: sameAxle, solveGears: solveGears, placeMeshed: placeMeshed, ratioFrac: ratioFrac, randomRatio: randomRatio,
    lever: lever, PULLEYS: PULLEYS, pulley: pulley, PULLEY_KG: PULLEY_KG, EFF: EFF, MOVES: MOVES, PARTS: PARTS, checkChain: checkChain, G: G };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.IGTMaq = API;
})(typeof window !== 'undefined' ? window : this);
