/* Pruebas del Taller sin navegador: estructuras, lenguaje propio, robótica, circuitos, máquinas y diseño gráfico.
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

/* Circuitos */
const CI = require(A('ig-taller-circuitos-calc.js'));
const cbat = (a, b, kind) => ({ t: 'battery', a, b, kind: kind || 'pack' }), cw = (a, b) => ({ t: 'wire', a, b }), clamp = (a, b) => ({ t: 'lamp', a, b }), cled = (a, b) => ({ t: 'led', a, b, color: 'rojo' }), cres = (a, b, r) => ({ t: 'resistor', a, b, r });
let e = CI.solveElec([cbat([0, 0], [0, 4]), cw([0, 4], [4, 4]), clamp([4, 4], [4, 0]), cw([4, 0], [0, 0])]);
ok(e.ok && e.comps[2].bright > 0.8 && !e.comps[2].burnt, 'c1: una pila y una bombilla lucen');
e = CI.solveElec([cbat([0, 0], [0, 4]), cw([0, 4], [4, 4]), clamp([4, 4], [4, 0]), cw([4, 4], [6, 4]), clamp([6, 4], [6, 0]), cw([6, 0], [4, 0]), cw([4, 0], [0, 0])]);
ok(e.ok && e.comps[2].bright >= 0.8 && e.comps[4].bright >= 0.8, 'c2: dos bombillas en paralelo al 80 % o más');
e = CI.solveElec([cbat([0, 0], [0, 4]), cw([0, 4], [0, 0])]);
ok(e.short, 'c: cortocircuito detectado');
e = CI.solveElec([cbat([0, 0], [0, 4], 'v9'), cw([0, 4], [4, 4]), cled([4, 4], [4, 0]), cw([4, 0], [0, 0])]);
ok(e.comps[2].burnt, 'c4: LED sin resistencia a 9 V se quema');
e = CI.solveElec([cbat([0, 0], [0, 4], 'v9'), cres([0, 4], [4, 4], 330), cled([4, 4], [4, 0]), cw([4, 0], [0, 0])]);
ok(e.comps[2].lit && !e.comps[2].burnt, 'c4: LED con 330 Ω luce sin quemarse');
const HA = [{ t: 'input', p: [0, 1], label: 'A', v: 0 }, { t: 'input', p: [0, 3], label: 'B', v: 0 }, { t: 'wire', a: [0, 1], b: [2, 1] }, { t: 'wire', a: [0, 3], b: [2, 3] }, { t: 'xor', p: [2, 2] },
  { t: 'and', p: [2, 6] }, { t: 'wire', a: [0, 1], b: [0, 5] }, { t: 'wire', a: [0, 5], b: [2, 5] }, { t: 'wire', a: [0, 3], b: [1, 3] }, { t: 'wire', a: [1, 3], b: [1, 7] }, { t: 'wire', a: [1, 7], b: [2, 7] },
  { t: 'out', p: [4, 2], label: 'S' }, { t: 'out', p: [4, 6], label: 'C' }];
ok(CI.matchTable(HA, CI.TARGETS.half).ok, 'l2: semisumador con O exclusiva e Y');

/* Máquinas */
const MQ = require(A('ig-taller-maquinas-calc.js'));
let g = [{ id: 1, x: 0, y: 0, z: 20, layer: 0 }], p2 = MQ.placeMeshed(g[0], 60, 0); g.push({ id: 2, x: p2.x, y: p2.y, z: 60, layer: 0 });
let gr = MQ.solveGears(g, 1, 60);
ok(Math.abs(gr.speed[2] + 20) < 1e-9 && Math.abs(gr.torque[2] - 3) < 1e-9, 'g1: 20 contra 60 dientes, 1:3 y sentido contrario');
g.push({ id: 3, x: p2.x, y: p2.y, z: 12, layer: 1 }); const p4 = MQ.placeMeshed(g[2], 48, 90); g.push({ id: 4, x: p4.x, y: p4.y, z: 48, layer: 1 });
gr = MQ.solveGears(g, 1, 60);
ok(Math.abs(gr.speed[4] - 5) < 1e-9 && !gr.jam && !gr.collisions.length, 'g5: tren compuesto 1:12 en el mismo sentido');
const tri = [{ id: 1, x: 0, y: 0, z: 20, layer: 0 }]; const q2 = MQ.placeMeshed(tri[0], 20, 0); tri.push({ id: 2, x: q2.x, y: q2.y, z: 20, layer: 0 }); const q3 = MQ.placeMeshed(tri[0], 20, 60); tri.push({ id: 3, x: q3.x, y: q3.y, z: 20, layer: 0 });
ok(MQ.solveGears(tri, 1, 60).jam, 'g: tres engranajes en triángulo se bloquean');
const lv = MQ.lever(3, 0.75, 0, 3, 60);
ok(Math.abs(lv.effort - 20) < 1e-9 && lv.kind === 1, 'p1: palanca de primer tipo, 60 kg con 20 kg');
ok(MQ.lever(3, 0, 1, 3, 60).kind === 2 && MQ.lever(3, 0, 3, 1.2, 10).kind === 3, 'p2 y p3: tipos segundo y tercero');
ok(MQ.pulley('pol4', 100, 2).effortKg > 30 && MQ.pulley('pol6', 100, 2).effortKg < 30, 'q2: con rozamiento, 100 kg piden el polipasto de 6 tramos');
ok(MQ.pulley('pol6', 1000, 3).rope === 18 && MQ.pulley('pol6', 1000, 3).effortKg < 250, 'q4: una tonelada a 3 m');
ok(MQ.checkChain([{ part: 'rampa', inp: 'rodar', out: 'caida' }, { part: 'palanca', inp: 'caida', out: 'empujon' }, { part: 'domino', inp: 'empujon', out: 'empujon' }]).ok, 'k1: tres pasos que encajan');
ok(!MQ.checkChain([{ part: 'rampa', inp: 'rodar', out: 'caida' }, { part: 'domino', inp: 'empujon', out: 'empujon' }]).ok, 'k: un paso que no encaja se detecta');

/* Diseño gráfico */
const DS = require(A('ig-taller-diseno-calc.js'));
ok(Math.abs(DS.contrast('#ffffff', '#000000') - 21) < 1e-9 && Math.abs(DS.contrast('#767676', '#ffffff') - 4.54) < 0.01, 'ds: fórmula de contraste WCAG (21:1 y 4,54:1)');
const doc = { format: 'cartel', bg: '#ffffff', els: [{ type: 'rect', x: 0, y: 0, w: 420, h: 200, fill: '#f2c230' }, { type: 'text', x: 30, y: 76, w: 300, text: 'Hola', size: 40, weight: 700, fill: '#ffffff' }] };
ok(!DS.textContrast(doc, 1).aa, 'd3: texto blanco sobre amarillo no pasa AA');
doc.els[1].fill = '#1b1f24';
ok(DS.textContrast(doc, 1).aaa, 'd3: texto negro sobre amarillo pasa AAA');
doc.els[0].op = 0.2; doc.els[1].fill = '#ffffff';
ok(!DS.textContrast(doc, 1).aa && DS.textContrast(doc, 1).bg === DS.mix('#ffffff', '#f2c230', 0.2), 'ds: la opacidad de la forma cuenta en el color de fondo');
ok(DS.fills({ type: 'star', x: 0, y: 0, w: 100, h: 100, fill: '#000', sides: 5 }, 50, 50) && !DS.fills({ type: 'star', x: 0, y: 0, w: 100, h: 100, fill: '#000', sides: 5 }, 5, 5), 'ds: dentro y fuera de una estrella');
const sign = { format: 'senal', bg: '#17395c', els: [{ type: 'arrow', x: 560, y: 164, w: 120, h: 72, fill: '#ffffff' }, { type: 'text', x: 50, y: 181, w: 260, text: 'Biblioteca', size: 80, weight: 700, fill: '#ffffff' }] };
ok(DS.check(sign, { format: 'senal', needArrow: true, bigText: 60, contrast: 'AAA' }).ok, 'd7: señal con flecha, texto grande y contraste AAA');
ok(!DS.check(sign, { maxColours: 1 }).ok && DS.coloursUsed(sign).length === 2, 'ds: cuenta de colores con el fondo');
console.log(`\n${n - fails}/${n} pruebas correctas`);
process.exit(fails ? 1 : 0);
