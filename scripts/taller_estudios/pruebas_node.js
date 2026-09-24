/* Pruebas del Taller sin navegador: cálculo de estructuras, lenguaje propio y robótica.
   Uso: node scripts/taller_estudios/pruebas_node.js  (sale con código 1 si algo falla) */
'use strict';
const path = require('path');
const A = p => path.join(__dirname, '..', '..', 'assets', p);
global.document = {};
global.window = { IGT: { t: (k, v) => k + (v ? JSON.stringify(v) : ''), lang: 'es', h: () => {}, num: n => String(n), ready: () => {},
  rng: seed => { let s = (seed >>> 0) || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; } } };
const C = require(A('ig-taller-estructuras-calc.js'));
require(A('ig-taller-codigo.js')); require(A('ig-taller-robotica.js'));
const K = window.IGTCode, RB = window.IGTRobot;
let fails = 0, n = 0;
function ok(cond, name) { n++; if (!cond) { fails++; console.log('FALLO', name); } else console.log('ok', name); }

/* Estructuras */
function model(scale, span, load) { return { scale, span, load, nodes: {}, members: [] }; }
function node(M, x, y, anchor) { x = +x.toFixed(4); y = +y.toFixed(4); for (const k in M.nodes) { const q = M.nodes[k]; if (Math.abs(q.x - x) < 1e-9 && Math.abs(q.y - y) < 1e-9) return k; } const k = 'n' + Object.keys(M.nodes).length; M.nodes[k] = { x, y, anchor: !!anchor }; return k; }
function bar(M, x1, y1, x2, y2, mat, k) { M.members.push({ a: node(M, x1, y1), b: node(M, x2, y2), mat, k: k || 1 }); }
function pratt(M, n, h, mat) { const half = M.span / 2, dx = M.span / n; node(M, -half, 0, true); node(M, half, 0, true);
  for (let i = 0; i < n; i++) bar(M, -half + i * dx, 0, -half + (i + 1) * dx, 0, mat);
  for (let i = 1; i < n; i++) bar(M, -half + i * dx, 0, -half + i * dx, h, mat);
  for (let i = 1; i < n - 1; i++) bar(M, -half + i * dx, h, -half + (i + 1) * dx, h, mat);
  bar(M, -half, 0, -half + dx, h, mat); bar(M, half, 0, half - dx, h, mat);
  for (let i = 1; i < n - 1; i++) { const x = -half + i * dx; if (x + dx / 2 <= 0) bar(M, x, h, x + dx, 0, mat); else bar(M, x + dx, h, x, 0, mat); } return M; }
let r = C.test(pratt(model('maqueta', 0.5, { type: 'peso', kg: 2, at: [0, 0] }), 4, 0.1, 'palito'));
ok(r.ok && r.pieces === 13, 'e2: puente de 13 palitos aguanta 2 kg');
r = C.test(pratt(model('maqueta', 0.5, { type: 'peso', kg: 5, at: [0, 0] }), 4, 0.1, 'palito'));
ok(!r.ok && r.reason === 'collapse', 'e3: el mismo puente no aguanta 5 kg (pandeo)');
r = C.test(pratt(model('maqueta', 0.5, { type: 'peso', kg: 5, at: [0, 0] }), 6, 0.1, 'palito'));
ok(r.ok && r.pieces === 21, 'e3: 21 palitos en 6 paneles aguantan 5 kg');
let M = model('maqueta', 0.3, { type: 'peso', kg: 1, at: [0, 0] }); node(M, -0.15, 0, true); node(M, 0.15, 0, true); bar(M, -0.15, 0, 0, 0, 'palito'); bar(M, 0, 0, 0.15, 0, 'palito');
r = C.test(M); ok(!r.ok && r.cases[0].mechanismNode !== undefined, 'mecanismo detectado sin triángulo');
r = C.test(pratt(model('real', 24, { type: 'tren' }), 12, 4, 'madera'));
ok(r.ok && Math.abs(r.mass - 2550) < 1 && r.peak > 0.9 && r.peak < 0.95, 'e7: celosía de madera 12×4 aguanta el tren (93 %)');
r = C.test(pratt(model('real', 24, { type: 'tren' }), 8, 4, 'madera'));
ok(!r.ok, 'e7: 8 paneles no aguantan el tren');
M = model('real', 12, { type: 'coche' }); node(M, -6, 0, true); node(M, 6, 0, true); bar(M, -6, 0, 0, 0, 'madera');
r = C.test(M); ok(!r.ok && r.reason === 'road', 'falta de calzada detectada');
r = C.test(pratt(model('real', 12, { type: 'coche' }), 2, 1, 'madera')); ok(r.ok && r.pieces === 5, 'e5: 5 piezas bastan para el coche');

/* Lenguaje */
const spec = new K.Spec({ commands: RB.COMMANDS, sensors: RB.SENSORS });
let p = K.parse('repetir 3 {\n avanzar 10\n derecha 90\n}\nsi 1 < 2 { escribir "a" } sino { escribir "b" }', spec);
ok(p.ok && p.stmts.length === 2, 'parser: repetir y si/sino');
ok(K.parse('repeat 2 { forward 5 }\nprint 3', spec).ok, 'parser: palabras en inglés');
ok(!K.parse('repetir {', spec).ok, 'parser: error de sintaxis con línea');
const out = []; const it = new K.Interp(K.parse('x = 0\nmientras x < 5 { x = x + 1 }\nescribir x * 2', spec).stmts, spec, { exec() {}, sensor() { return 0; }, print: s => out.push(s), random: Math.random });
while (!it.next().done) {} ok(out[0] === '10', 'intérprete: variables y bucles');
let caught = null; const it2 = new K.Interp(K.parse('mientras verdadero { x = 1 }', spec).stmts, spec, { exec() {}, sensor() {}, print() {}, random: Math.random });
try { while (!it2.next().done) {} } catch (e) { caught = e; } ok(caught && /cErrTooLong/.test(caught.msg), 'intérprete: bucle infinito detenido');
caught = null; const it3 = new K.Interp(K.parse('funcion f(n) { f(n + 1) }\nf(1)', spec).stmts, spec, { exec() {}, sensor() {}, print() {}, random: Math.random });
try { while (!it3.next().done) {} } catch (e) { caught = e; } ok(caught && /cErrDepth/.test(caught.msg), 'intérprete: recursión limitada');
ok(K.toText(K.parse('repeat 2 { forward 5 }', spec).stmts, spec) === 'repetir 2 {\n  avanzar 5\n}', 'texto: el programa se muestra en el idioma de la página');

/* Robótica: los retos tienen solución */
function run(scene, v, texts) {
  const W = new RB.World(RB.SCENES[scene](v));
  const its = W.bots.map((b, i) => new K.Interp(K.parse(texts[i] || '', spec).stmts, spec, W.host(b, () => {}), { steps: 300000 }));
  const done = its.map(() => false); let guard = 0;
  while (!done.every(Boolean)) { its.forEach((q, i) => { if (!done[i] && q.next().done) done[i] = true; }); if (++guard > 500000) break; }
  return W;
}
const LF = 'mientras no en_meta() {\n si linea_izq() { izquierda 5 }\n si linea_der() { derecha 5 }\n avanzar 1\n}';
const MZ = c => `mientras no en_meta() {\n si distancia_der() > ${c / 2} { derecha 90\n avanzar ${c} }\n sino si distancia() > ${c / 2} { avanzar ${c} }\n sino { izquierda 90 }\n}`;
for (let v = 0; v < 3; v++) ok(run('curve', v, [LF]).atGoal(run('curve', v, [LF]).bots[0]), 'r3: seguir la línea, variante ' + (v + 1));
for (let v = 0; v < 3; v++) { const W = run('park', v, ['mientras distancia() > 3 { avanzar 1 }']); const d = W.distance(W.bots[0], 0); ok(d >= 1 && d <= 6 && !W.bots[0].bumps, 'r2: aparcar, variante ' + (v + 1)); }
for (let v = 0; v < 3; v++) { const W = run('unknown', v, [MZ(40)]); ok(W.atGoal(W.bots[0]), 'r6: laberinto desconocido ' + (v + 1)); }
for (let v = 0; v < 5; v++) { const W = run('big', v, [MZ(30)]); ok(W.atGoal(W.bots[0]), 'r9: laberinto grande ' + (v + 1)); }
let W = run('corridor', 0, ['avanzar 105\nderecha 90\navanzar 25\nesperar 160\nretroceder 25\nizquierda 90\navanzar 100', 'esperar 160\navanzar 200']);
ok(W.bots.every(b => W.atGoal(b) && !b.bumps), 'r7: dos robots se cruzan sin chocar');
W = run('meet', 0, ['avanzar 60\nderecha 90\navanzar 95', 'avanzar 60\nderecha 90\navanzar 85']);
ok(W.bots.every(b => W.atGoal(b) && !b.bumps), 'r8: encuentro');
console.log(`\n${n - fails}/${n} pruebas correctas`);
process.exit(fails ? 1 : 0);
