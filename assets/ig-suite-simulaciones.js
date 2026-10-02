/* Iris Green · El taller · Estudio de simulaciones (R43).
   Sistemas con reglas sencillas en canvas 2D: autómatas celulares (juego de la vida con reglas B/S y
   autómata elemental de Wolfram), tráfico (Nagel-Schreckenberg en anillo y cruce con semáforo) y
   ecosistemas (hierba-conejos-zorros por agentes y Lotka-Volterra resuelto con RK4).
   Nada se mueve solo: la persona inicia, pausa o avanza paso a paso. Azar reproducible con semilla. */
(function (root) {
  'use strict';

  /* ================= Cálculo puro (sin DOM): se puede probar aparte ================= */
  var Lib = {};

  /* ---- Reglas B/S (nacer / sobrevivir según vecinas vivas) ---- */
  function parseRule(str) {
    var s = String(str || '').toUpperCase().replace(/\s+/g, '');
    var m = /^B([0-8]*)\/S([0-8]*)$/.exec(s) || /^S([0-8]*)\/B([0-8]*)$/.exec(s);
    var b, sv;
    if (m && s.charAt(0) === 'B') { b = m[1]; sv = m[2]; }
    else if (m) { sv = m[1]; b = m[2]; }
    else { var m2 = /^([0-8]*)\/([0-8]*)$/.exec(s); if (!m2) return null; sv = m2[1]; b = m2[2]; } /* notación clásica S/B, p. ej. 23/3 */
    var B = [], S = [];
    for (var i = 0; i <= 8; i++) { B.push(b.indexOf(String(i)) >= 0); S.push(sv.indexOf(String(i)) >= 0); }
    return { b: B, s: S };
  }
  function ruleText(r) {
    var b = '', s = '';
    for (var i = 0; i <= 8; i++) { if (r.b[i]) b += i; if (r.s[i]) s += i; }
    return 'B' + b + '/S' + s;
  }
  Lib.parseRule = parseRule; Lib.ruleText = ruleText;

  /* ---- Juego de la vida: un paso sobre una rejilla w × h (con o sin bordes unidos) ---- */
  function lifeStep(cells, w, h, wrap, rule) {
    var next = new Uint8Array(w * h), births = 0, deaths = 0, pop = 0;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var n = 0;
        for (var dy = -1; dy <= 1; dy++) {
          var yy = y + dy;
          if (yy < 0 || yy >= h) { if (!wrap) continue; yy = (yy + h) % h; }
          for (var dx = -1; dx <= 1; dx++) {
            if (!dx && !dy) continue;
            var xx = x + dx;
            if (xx < 0 || xx >= w) { if (!wrap) continue; xx = (xx + w) % w; }
            n += cells[yy * w + xx];
          }
        }
        var i = y * w + x, alive = cells[i] === 1, v = alive ? (rule.s[n] ? 1 : 0) : (rule.b[n] ? 1 : 0);
        next[i] = v;
        if (v) pop++;
        if (v && !alive) births++; else if (!v && alive) deaths++;
      }
    }
    return { cells: next, births: births, deaths: deaths, pop: pop };
  }
  Lib.lifeStep = lifeStep;

  /* ---- Formato RLE de patrones de Life (el estándar de los programas de autómatas) ---- */
  function rleDecode(text) {
    var lines = String(text || '').replace(/\r/g, '').split('\n'), body = '', hw = 0, hh = 0, rule = null;
    lines.forEach(function (ln) {
      var l = ln.trim(); if (!l || l.charAt(0) === '#') return;
      var hm = /^x\s*=\s*(\d+)\s*,\s*y\s*=\s*(\d+)(?:\s*,\s*rule\s*=\s*([^\s]+))?/i.exec(l);
      if (hm) { hw = +hm[1]; hh = +hm[2]; rule = hm[3] || null; return; }
      body += l;
    });
    var pts = [], x = 0, y = 0, num = '', maxX = 0, maxY = 0;
    for (var i = 0; i < body.length; i++) {
      var c = body.charAt(i);
      if (c >= '0' && c <= '9') { num += c; continue; }
      var n = num ? parseInt(num, 10) : 1; num = '';
      if (n > 100000) return null;
      if (c === '!') break;
      if (c === '$') { y += n; x = 0; continue; }
      if (c === 'b' || c === '.') { x += n; continue; }
      if (/[a-zA-Z]/.test(c)) { for (var k = 0; k < n; k++) { pts.push([x + k, y]); maxX = Math.max(maxX, x + k); maxY = Math.max(maxY, y); } x += n; continue; }
      if (c === ' ' || c === '\t') continue;
      return null;
    }
    return { w: Math.max(hw, pts.length ? maxX + 1 : 0), h: Math.max(hh, pts.length ? maxY + 1 : 0), pts: pts, rule: rule };
  }
  /* Codifica la zona [x0, x0+w) × [y0, y0+h) de la rejilla. */
  function rleBody(cells, W, x0, y0, w, h) {
    var out = '', pendingRows = 0;
    function run(n, ch) { return (n > 1 ? n : '') + ch; }
    for (var y = y0; y < y0 + h; y++) {
      var row = '', x = x0, lastAlive = -1;
      for (var q = x0; q < x0 + w; q++) if (cells[y * W + q]) lastAlive = q;
      if (lastAlive < 0) { pendingRows++; continue; }
      if (out || pendingRows) out += run(pendingRows + (out ? 1 : 0), '$');
      else if (y > y0) out += run(y - y0, '$');
      pendingRows = 0;
      while (x <= lastAlive) {
        var v = cells[y * W + x], n = 0;
        while (x <= lastAlive && cells[y * W + x] === v) { n++; x++; }
        row += run(n, v ? 'o' : 'b');
      }
      out += row;
    }
    return out + '!';
  }
  function wrapLines(s, n) { var out = []; for (var i = 0; i < s.length; i += n) out.push(s.slice(i, i + n)); return out.join('\n'); }
  function rleEncode(cells, W, H, rule) {
    var minX = W, minY = H, maxX = -1, maxY = -1;
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) if (cells[y * W + x]) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
    if (maxX < 0) return 'x = 0, y = 0, rule = ' + rule + '\n!\n';
    var w = maxX - minX + 1, h = maxY - minY + 1;
    return 'x = ' + w + ', y = ' + h + ', rule = ' + rule + '\n' + wrapLines(rleBody(cells, W, minX, minY, w, h), 70) + '\n';
  }
  /* Rejilla completa para guardar en el proyecto (texto RLE sin cabecera). */
  function boardToStr(cells, W, H) { return rleBody(cells, W, 0, 0, W, H); }
  function strToBoard(str, W, H) {
    var d = rleDecode(str), cells = new Uint8Array(W * H);
    if (!d) return null;
    for (var i = 0; i < d.pts.length; i++) { var p = d.pts[i]; if (p[0] >= W || p[1] >= H) return null; cells[p[1] * W + p[0]] = 1; }
    return cells;
  }
  Lib.rleDecode = rleDecode; Lib.rleEncode = rleEncode; Lib.boardToStr = boardToStr; Lib.strToBoard = strToBoard;

  /* Patrones clásicos (todos en RLE; se colocan girados o reflejados). */
  var PATTERNS = {
    glider: 'bob$2bo$3o!', lwss: 'bo2bo$o4b$o3bo$4o!', blinker: '3o!', toad: 'b3o$3o!', beacon: '2o$2o$2b2o$2b2o!',
    pulsar: '2b3o3b3o2b2$o4bobo4bo$o4bobo4bo$o4bobo4bo$2b3o3b3o2b2$2b3o3b3o2b$o4bobo4bo$o4bobo4bo$o4bobo4bo2$2b3o3b3o!',
    pentadecathlon: '2bo4bo2b$2ob4ob2o$2bo4bo!',
    gun: '24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4bobo$10bo5bo7bo$11bo3bo$12b2o!',
    block: '2o$2o!', beehive: 'b2o$o2bo$b2o!', rpent: 'b2o$2o$bo!', acorn: 'bo$3bo$2o2b3o!', diehard: '6bo$2o$bo3b3o!'
  };
  function patternPoints(key, rot, flip) {
    var d = rleDecode(PATTERNS[key]); if (!d) return [];
    var pts = d.pts.map(function (p) { return [flip ? d.w - 1 - p[0] : p[0], p[1]]; });
    var w = d.w, h = d.h;
    for (var r = 0; r < ((rot || 0) / 90) % 4; r++) { pts = pts.map(function (p) { return [h - 1 - p[1], p[0]]; }); var tmp = w; w = h; h = tmp; }
    return { pts: pts, w: w, h: h };
  }
  Lib.PATTERNS = PATTERNS; Lib.patternPoints = patternPoints;

  /* ---- Autómata elemental (código de Wolfram 0-255) ---- */
  function wolframStep(row, rule, wrap) {
    var n = row.length, out = new Uint8Array(n);
    for (var i = 0; i < n; i++) {
      var l = i > 0 ? row[i - 1] : (wrap ? row[n - 1] : 0), c = row[i], r = i < n - 1 ? row[i + 1] : (wrap ? row[0] : 0);
      out[i] = (rule >> (l * 4 + c * 2 + r)) & 1;
    }
    return out;
  }
  Lib.wolframStep = wolframStep;

  /* ---- Tráfico: modelo de Nagel-Schreckenberg en una carretera circular ----
     Coches en orden de marcha (nunca se adelantan). Cuatro reglas a la vez para todos:
     1 acelerar, 2 frenar para no chocar, 3 frenazo al azar con probabilidad p, 4 avanzar. */
  function naschStep(cars, L, vmax, p, rnd, limitFn) {
    var n = cars.length, i;
    for (i = 0; i < n; i++) {
      var c = cars[i], nx = cars[(i + 1) % n], gap = n === 1 ? L - 1 : (nx.x - c.x - 1 + L) % L;
      if (limitFn) gap = Math.min(gap, limitFn(c));
      var v = Math.min(c.v + 1, vmax);
      v = Math.min(v, gap);
      if (v > 0 && rnd() < p) v -= 1;
      c.nv = v;
    }
    var moved = 0;
    for (i = 0; i < n; i++) { var cc = cars[i]; cc.px = cc.x; cc.v = cc.nv; cc.x = (cc.x + cc.v) % L; moved += cc.v; }
    return moved;
  }
  Lib.naschStep = naschStep;
  function placeCars(L, N, mode, rnd) {
    var pos = [], i;
    N = Math.max(0, Math.min(L, N));
    if (mode === 'jam') for (i = 0; i < N; i++) pos.push(i);
    else if (mode === 'random') { var all = []; for (i = 0; i < L; i++) all.push(i); for (i = L - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), tt = all[i]; all[i] = all[j]; all[j] = tt; } pos = all.slice(0, N).sort(function (a, b) { return a - b; }); }
    else for (i = 0; i < N; i++) pos.push(Math.floor(i * L / N));
    return pos.map(function (x, k) { return { id: k + 1, x: x, v: 0, px: x }; });
  }
  Lib.placeCars = placeCars;
  /* Diagrama fundamental: flujo medio (coches por paso) para cada densidad. */
  function fundamental(L, vmax, p, seed, rngFactory) {
    var out = [];
    for (var d = 0.05; d < 0.951; d += 0.05) {
      var rnd = rngFactory(seed + '|fd|' + d.toFixed(2)), cars = placeCars(L, Math.round(d * L), 'random', rnd), sum = 0;
      for (var s = 0; s < 400; s++) { var mv = naschStep(cars, L, vmax, p, rnd); if (s >= 200) sum += mv; }
      out.push([+d.toFixed(2), sum / 200 / L]);
    }
    return out;
  }
  Lib.fundamental = fundamental;

  /* ---- Cruce con semáforo: dos carreteras circulares (N-S y E-O) que se cortan en una celda ---- */
  function lightState(N, tt) {
    var cyc = N.gNS + N.allRed + N.gEW + N.allRed, k = tt % cyc;
    if (k < N.gNS) return 0; if (k < N.gNS + N.allRed) return 2; if (k < N.gNS + N.allRed + N.gEW) return 1; return 2; /* 0 N-S verde, 1 E-O verde, 2 todo en rojo */
  }
  function netInit(N, rnd) {
    var c = Math.floor(N.L / 2);
    var roads = [N.dNS, N.dEW].map(function (d) {
      var cars = placeCars(N.L - 1, Math.round(d * (N.L - 1)), 'random', rnd);
      cars.forEach(function (car) { if (car.x >= c) car.x += 1; car.px = car.x; }); /* el cruce empieza libre */
      return cars;
    });
    return { c: c, roads: roads, t: 0, passed: [0, 0] };
  }
  function netStep(st, N, rnd) {
    var c = st.c, lt = lightState(N, st.t);
    var occ = [st.roads[0].some(function (car) { return car.x === c; }), st.roads[1].some(function (car) { return car.x === c; })];
    st.roads.forEach(function (cars, k) {
      var green = lt === k, exitBusy = cars.some(function (car) { return car.x === (c + 1) % N.L; });
      naschStep(cars, N.L, N.vmax, N.p, rnd, function (car) {
        var dc = (c - car.x + N.L) % N.L; if (dc === 0) return N.L;
        if (!green || occ[1 - k] || exitBusy) return dc - 1; /* se para antes de la línea de detención */
        return N.L;
      });
      cars.forEach(function (car) { var before = (c - car.px + N.L) % N.L; if (before > 0 && car.v >= before) st.passed[k] += 1; });
    });
    st.t += 1;
  }
  /* Cola: coches parados seguidos justo antes del cruce. */
  function netQueue(st, N, k) {
    var c = st.c, cars = st.roads[k].map(function (car) { return { d: (c - car.x + N.L) % N.L, v: car.v }; }).filter(function (o) { return o.d > 0; }).sort(function (a, b) { return a.d - b.d; });
    var q = 0, prev = 0;
    for (var i = 0; i < cars.length; i++) { if (cars[i].v !== 0 || cars[i].d - prev > 2) break; q++; prev = cars[i].d; }
    return q;
  }
  Lib.lightState = lightState; Lib.netInit = netInit; Lib.netStep = netStep; Lib.netQueue = netQueue;

  /* ---- Lotka-Volterra: dx/dt = αx − βxy ; dy/dt = δxy − γy ---- */
  function lvDeriv(p, x, y) { return [p.a * x - p.b * x * y, p.d * x * y - p.c * y]; }
  function rk4(p, x, y, h) {
    var k1 = lvDeriv(p, x, y), k2 = lvDeriv(p, x + h / 2 * k1[0], y + h / 2 * k1[1]);
    var k3 = lvDeriv(p, x + h / 2 * k2[0], y + h / 2 * k2[1]), k4 = lvDeriv(p, x + h * k3[0], y + h * k3[1]);
    return [x + h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]), y + h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1])];
  }
  function euler(p, x, y, h) { var k = lvDeriv(p, x, y); return [x + h * k[0], y + h * k[1]]; }
  /* Cantidad que se conserva en el modelo exacto: si cambia, es error del método numérico. */
  function lvInvariant(p, x, y) { return p.d * x - p.c * Math.log(Math.max(1e-12, x)) + p.b * y - p.a * Math.log(Math.max(1e-12, y)); }
  Lib.rk4 = rk4; Lib.euler = euler; Lib.lvInvariant = lvInvariant;

  /* ---- Ecosistema por agentes: hierba, conejos y zorros en una rejilla con bordes unidos ---- */
  var DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]];
  var CAP_R = 3000, CAP_F = 1200;
  function ecoInit(P, rnd) {
    var n = P.w * P.h, grass = new Int16Array(n), i;
    for (i = 0; i < n; i++) grass[i] = rnd() < P.grass0 ? 0 : 1 + Math.floor(rnd() * P.regrow);
    function agents(k, gain) { var a = []; for (var j = 0; j < k; j++) a.push({ x: Math.floor(rnd() * P.w), y: Math.floor(rnd() * P.h), e: 1 + Math.floor(rnd() * 2 * gain) }); return a; }
    return { grass: grass, rabbits: agents(P.rabbits0, P.gainR), foxes: agents(P.foxes0, P.gainF), t: 0 };
  }
  function ecoStep(st, P, rnd) {
    var W = P.w, H = P.h;
    function move(a) { var d = DIRS[Math.floor(rnd() * 8)]; a.x = (a.x + d[0] + W) % W; a.y = (a.y + d[1] + H) % H; }
    var born = [], i;
    for (i = 0; i < st.rabbits.length; i++) {
      var r = st.rabbits[i]; move(r); r.e -= 1;
      var gi = r.y * W + r.x;
      if (st.grass[gi] === 0) { st.grass[gi] = P.regrow; r.e += P.gainR; }
      if (r.e > 1 && rnd() < P.reproR && st.rabbits.length + born.length < CAP_R) { var half = Math.floor(r.e / 2); r.e -= half; born.push({ x: r.x, y: r.y, e: half }); }
    }
    st.rabbits = st.rabbits.concat(born).filter(function (a) { return a.e > 0; });
    var byCell = {};
    st.rabbits.forEach(function (a, k) { var key = a.y * W + a.x; (byCell[key] = byCell[key] || []).push(k); });
    var eaten = {}, kits = [];
    for (i = 0; i < st.foxes.length; i++) {
      var f = st.foxes[i]; move(f); f.e -= 1;
      var list = byCell[f.y * W + f.x];
      if (list) { for (var q = 0; q < list.length; q++) if (!eaten[list[q]]) { eaten[list[q]] = 1; f.e += P.gainF; break; } }
      if (f.e > 1 && rnd() < P.reproF && st.foxes.length + kits.length < CAP_F) { var hf = Math.floor(f.e / 2); f.e -= hf; kits.push({ x: f.x, y: f.y, e: hf }); }
    }
    st.rabbits = st.rabbits.filter(function (a, k) { return !eaten[k]; });
    st.foxes = st.foxes.concat(kits).filter(function (a) { return a.e > 0; });
    for (i = 0; i < st.grass.length; i++) if (st.grass[i] > 0) st.grass[i] -= 1;
    st.t += 1;
    return st;
  }
  function grassCount(st) { var n = 0; for (var i = 0; i < st.grass.length; i++) if (st.grass[i] === 0) n++; return n; }
  Lib.ecoInit = ecoInit; Lib.ecoStep = ecoStep; Lib.grassCount = grassCount;

  root.IGSimLib = Lib;
  var parseRule = Lib.parseRule, ruleText = Lib.ruleText, lifeStep = Lib.lifeStep, wolframStep = Lib.wolframStep, naschStep = Lib.naschStep, patternPoints = Lib.patternPoints, PATTERNS = Lib.PATTERNS;

  /* ================= Estudio ================= */
  var IG = root.IGSuite, D = root.document; if (!IG || !D) return;
  var LANG = IG.lang;
  var MODELS = ['life', 'wolf', 'traffic', 'net', 'eco', 'lv'];
  var FAMILY = { life: 'famAuto', wolf: 'famAuto', traffic: 'famTraffic', net: 'famTraffic', eco: 'famEco', lv: 'famEco' };
  var RULE_PRESETS = [['B3/S23', 'rpLife'], ['B36/S23', 'rpHigh'], ['B2/S', 'rpSeeds'], ['B3678/S34678', 'rpDayNight'], ['B3/S012345678', 'rpNoDeath'], ['B3/S12345', 'rpMaze']];
  var SIZES = [[32, 20], [48, 30], [64, 40], [96, 60], [128, 80]];
  var WOLF_PRESETS = [30, 90, 110, 184, 60, 150, 250];
  var COL = { ink: '#172b42', soft: '#44586c', navy: '#17395c', blue: '#1f5f8b', violet: '#5a49a8', green: '#1d6b3a', orange: '#a04a00', red: '#a1283c', line: '#c9d8e6', grid: '#e6edf4', bg: '#fbfcfe' };
  var FONT = '"Atkinson Hyperlegible", system-ui, sans-serif';

  IG.defineEngine('simulaciones', {
    version: 1, fileBase: LANG === 'en' ? 'simulation' : 'simulacion',
    extraKeys: ['kSimCursor', 'kSimRun'],
    initialStart: function (para) { return { child: 'glider', teen: 'phantom', adult: 'lvphase' }[para] || 'ecobalance'; },
    starts: function (ctx) {
      var t = ctx.t;
      return [
        { id: 'glider', title: t('stGlider'), desc: t('stGliderD'), para: 'child' },
        { id: 'gun', title: t('stGun'), desc: t('stGunD'), para: 'any' },
        { id: 'wolf30', title: t('stWolf30'), desc: t('stWolf30D'), para: 'teen' },
        { id: 'wolf90', title: t('stWolf90'), desc: t('stWolf90D'), para: 'child' },
        { id: 'phantom', title: t('stPhantom'), desc: t('stPhantomD'), para: 'teen' },
        { id: 'crossing', title: t('stCrossing'), desc: t('stCrossingD'), para: 'any' },
        { id: 'ecobalance', title: t('stEco'), desc: t('stEcoD'), para: 'any' },
        { id: 'lvphase', title: t('stLv'), desc: t('stLvD'), para: 'adult' }
      ];
    },
    create: function (ctx) { return studio(ctx); }
  });

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function defaults() {
    return {
      v: 1, model: 'life', seed: 'iris', speed: 4, chart: 'time', challenge: null,
      life: { w: 64, h: 40, wrap: true, rule: 'B3/S23', cells: '!', start: '!', gen: 0, pattern: 'glider', rot: 0, flip: false, fill: 0.3 },
      wolf: { rule: 30, w: 121, wrap: true, init: 'single', custom: '', fill: 0.5 },
      traffic: { L: 100, density: 0.3, vmax: 5, p: 0.25, init: 'even' },
      net: { L: 60, dNS: 0.15, dEW: 0.3, vmax: 3, p: 0.15, gNS: 15, gEW: 15, allRed: 2, goalQueue: 9, goalSteps: 300 },
      eco: { w: 48, h: 32, grass0: 0.5, regrow: 20, rabbits0: 150, foxes0: 20, gainR: 4, gainF: 10, reproR: 0.05, reproF: 0.02, goal: 500 },
      lv: { a: 1, b: 0.1, c: 1.5, d: 0.075, x0: 10, y0: 5, h: 0.05, method: 'rk4', T: 40 }
    };
  }

  function studio(ctx) {
    var t = ctx.t, h = ctx.h, F = ctx.fields, num = IG.num, vp = ctx.viewport;
    var S = defaults(), sel = null, tool = 'draw', running = false, timer = 0;
    var stepMode = ctx.reducedMotion(), view = 'both';
    var R = {}; /* estado de la ejecución (no entra en el historial) */
    var kc = { x: 0, y: 0 }, cursorShown = false;
    ctx.setTech('renderer', 'Canvas 2D');

    /* ---------- Escenario: simulación + gráfico ---------- */
    var simCv = h('canvas', { class: 'igsim-canvas', 'aria-hidden': 'true' });
    var chartCv = h('canvas', { class: 'igsim-canvas', 'aria-hidden': 'true' });
    var badge = h('p', { class: 'igsim-badge', 'aria-hidden': 'true' });
    var simPane = h('div', { class: 'igsim-pane igsim-sim' }, simCv, badge);
    var chartPane = h('div', { class: 'igsim-pane igsim-chart' }, chartCv);
    var split = h('div', { class: 'igsim-split', 'data-show': view }, simPane, chartPane);
    vp.appendChild(split); vp.classList.add('igsim-viewport');
    function sizeCanvas(cv) {
      var r = cv.parentNode.getBoundingClientRect(), dpr = Math.min(2, root.devicePixelRatio || 1);
      var w = Math.max(10, Math.round(r.width)), hh = Math.max(10, Math.round(r.height));
      if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(hh * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(hh * dpr); }
      return { w: w, h: hh, dpr: dpr };
    }
    var drawReq = 0;
    function draw() { if (!drawReq) drawReq = root.requestAnimationFrame(function () { drawReq = 0; drawNow(); }); }
    function drawNow() {
      if (split.dataset.show !== 'chart') { var a = sizeCanvas(simCv), g = simCv.getContext('2d'); g.setTransform(a.dpr, 0, 0, a.dpr, 0, 0); lay = drawSim(g, a.w, a.h, false); }
      if (split.dataset.show !== 'sim') { var b = sizeCanvas(chartCv), g2 = chartCv.getContext('2d'); g2.setTransform(b.dpr, 0, 0, b.dpr, 0, 0); drawChart(g2, b.w, b.h); }
    }
    if (root.ResizeObserver) new ResizeObserver(function () { drawNow(); }).observe(split);
    var lay = null;

    /* ---------- Utilidades de dibujo ---------- */
    function txt(g, s, x, y, opts) {
      opts = opts || {};
      g.font = (opts.weight || 600) + ' ' + (opts.size || 12) + 'px ' + FONT;
      g.fillStyle = opts.color || COL.ink; g.textAlign = opts.align || 'left'; g.textBaseline = opts.base || 'alphabetic';
      g.fillText(s, x, y);
    }
    function bg(g, W, H) { g.fillStyle = COL.bg; g.fillRect(0, 0, W, H); }
    function speedColour(v, vmax) { return v === 0 ? COL.red : (v <= Math.max(1, Math.floor(vmax / 2)) ? COL.orange : COL.blue); }

    /* ================= Modelos: reinicio y paso ================= */
    function rngFor(tag) { return ctx.rng(S.seed + '|' + tag); }
    function table(cols) { return { cols: cols, rows: [] }; }
    function record(row) { R.data.rows.push(row); if (R.data.rows.length > 20000) R.data.rows.splice(0, R.data.rows.length - 20000); }

    function resetModel() {
      stop(true);
      var m = S.model;
      R = { model: m, t: 0, done: null };
      if (m === 'life') {
        var L = S.life, cells = Lib.strToBoard(L.cells, L.w, L.h) || new Uint8Array(L.w * L.h);
        R.cells = cells; R.gen = L.gen; R.rule = parseRule(L.rule) || parseRule('B3/S23');
        R.data = table(['gen', 'pop', 'births', 'deaths']); record([R.gen, popOf(cells), 0, 0]);
        R.startPop = popOf(Lib.strToBoard(L.start, L.w, L.h) || cells);
        kc.x = clamp(kc.x, 0, L.w - 1); kc.y = clamp(kc.y, 0, L.h - 1);
      } else if (m === 'wolf') {
        var Wf = S.wolf, row = new Uint8Array(Wf.w);
        if (Wf.init === 'single') row[Math.floor(Wf.w / 2)] = 1;
        else if (Wf.init === 'random') { var rr = rngFor('wolf-row'); for (var i = 0; i < Wf.w; i++) row[i] = rr() < Wf.fill ? 1 : 0; }
        else for (var j = 0; j < Wf.w; j++) row[j] = Wf.custom.charAt(j) === '1' ? 1 : 0;
        R.rows = [row]; R.offset = 0;
        R.data = table(['step', 'ones', 'density']); record([0, popOf(row), popOf(row) / Wf.w]);
        kc.x = clamp(kc.x, 0, Wf.w - 1); kc.y = 0;
      } else if (m === 'traffic') {
        var T = S.traffic; R.rnd = rngFor('traffic');
        R.cars = Lib.placeCars(T.L, Math.round(T.density * T.L), T.init, R.rnd);
        R.hist = [snapshotCars()]; R.data = table(['step', 'speed', 'flow', 'stopped']); recordTraffic();
        kc.x = clamp(kc.x, 0, T.L - 1);
      } else if (m === 'net') {
        R.rnd = rngFor('net'); R.net = Lib.netInit(S.net, R.rnd); R.roads = R.net.roads; R.c = R.net.c; R.passed = R.net.passed; R.maxQ = [0, 0];
        R.data = table(['step', 'speedNS', 'speedEW', 'queueNS', 'queueEW', 'light']); recordNet();
      } else if (m === 'eco') {
        R.rnd = rngFor('eco'); R.eco = Lib.ecoInit(S.eco, R.rnd);
        R.data = table(['step', 'grass', 'rabbits', 'foxes']); recordEco();
        kc.x = clamp(kc.x, 0, S.eco.w - 1); kc.y = clamp(kc.y, 0, S.eco.h - 1);
      } else if (m === 'lv') {
        var P = S.lv; R.x = P.x0; R.y = P.y0; R.V0 = Lib.lvInvariant(P, R.x, R.y);
        R.data = table(['time', 'prey', 'pred']); record([0, R.x, R.y]);
      }
      if (S.chart === 'fundamental' && m !== 'traffic') S.chart = 'time';
      if (S.chart === 'phase' && m !== 'eco' && m !== 'lv') S.chart = 'time';
      R.fd = null;
    }
    function popOf(a) { var n = 0; for (var i = 0; i < a.length; i++) n += a[i]; return n; }
    function snapshotCars() { return R.cars.map(function (c) { return [c.x, c.v, c.id]; }); }
    function recordTraffic() {
      var n = R.cars.length, sv = 0, st = 0; R.cars.forEach(function (c) { sv += c.v; if (c.v === 0) st++; });
      record([R.t, n ? sv / n : 0, sv / S.traffic.L, st]);
    }
    function lightState(tt) { return Lib.lightState(S.net, tt); }
    function queueOf(k) { return Lib.netQueue(R.net, S.net, k); }
    function recordNet() {
      var sp = R.roads.map(function (cars) { var s = 0; cars.forEach(function (c) { s += c.v; }); return cars.length ? s / cars.length : 0; });
      var q = [queueOf(0), queueOf(1)]; R.q = q; R.maxQ = [Math.max(R.maxQ[0], q[0]), Math.max(R.maxQ[1], q[1])];
      record([R.t, sp[0], sp[1], q[0], q[1], lightState(R.t)]);
    }
    function recordEco() { record([R.eco.t, Lib.grassCount(R.eco), R.eco.rabbits.length, R.eco.foxes.length]); }

    function stepModel() {
      var m = S.model;
      if (m === 'life') {
        var L = S.life, res = lifeStep(R.cells, L.w, L.h, L.wrap, R.rule);
        R.cells = res.cells; R.gen += 1; record([R.gen, res.pop, res.births, res.deaths]);
        if (res.pop === 0) { R.halt = t('lifeDied', { g: R.gen }); }
      } else if (m === 'wolf') {
        var row = wolframStep(R.rows[R.rows.length - 1], S.wolf.rule, S.wolf.wrap); R.rows.push(row);
        if (R.rows.length > 1500) { R.rows.shift(); R.offset += 1; }
        record([R.offset + R.rows.length - 1, popOf(row), popOf(row) / S.wolf.w]);
      } else if (m === 'traffic') {
        var T = S.traffic; naschStep(R.cars, T.L, T.vmax, T.p, R.rnd); R.t += 1;
        R.hist.push(snapshotCars()); if (R.hist.length > 600) R.hist.shift(); recordTraffic();
      } else if (m === 'net') {
        Lib.netStep(R.net, S.net, R.rnd); R.t = R.net.t; recordNet();
      } else if (m === 'eco') {
        Lib.ecoStep(R.eco, S.eco, R.rnd); recordEco();
        var r = R.eco.rabbits.length, f = R.eco.foxes.length;
        if (!r && !f) R.halt = t('ecoAllGone', { t: R.eco.t });
      } else if (m === 'lv') {
        var P = S.lv, nx = (P.method === 'euler' ? Lib.euler : Lib.rk4)(P, R.x, R.y, P.h);
        R.x = Math.max(0, nx[0]); R.y = Math.max(0, nx[1]); R.t += 1;
        record([R.t * P.h, R.x, R.y]);
        if (R.t * P.h >= P.T - 1e-9) R.halt = t('lvDone', { T: num(P.T, 1) });
      }
      checkChallenge();
    }
    function currentStep() { return S.model === 'life' ? R.gen : S.model === 'wolf' ? R.offset + R.rows.length - 1 : S.model === 'eco' ? R.eco.t : R.t; }

    /* ---------- Retos (los tres del estudio anterior) ---------- */
    function checkChallenge() {
      var ch = S.challenge; if (!ch || R.done) return;
      if (ch === 'life' && S.model === 'life') {
        var pop = R.data.rows[R.data.rows.length - 1][1];
        if (R.gen >= 100 && pop > 0 && R.startPop <= 12) { R.done = 'ok'; ctx.announce(t('chLifeOk')); stop(); }
      } else if (ch === 'net' && S.model === 'net') {
        if (R.t >= S.net.goalSteps) { var ok = R.maxQ[0] <= S.net.goalQueue && R.maxQ[1] <= S.net.goalQueue; R.done = ok ? 'ok' : 'bad'; ctx.announce(ok ? t('chNetOk') : t('chNetBad', { a: R.maxQ[0], b: R.maxQ[1], m: S.net.goalQueue })); stop(); }
      } else if (ch === 'eco' && S.model === 'eco') {
        var rb = R.eco.rabbits.length, fx = R.eco.foxes.length;
        if (!rb || !fx) { R.done = 'bad'; ctx.announce(t(!rb ? 'chEcoNoRabbits' : 'chEcoNoFoxes', { t: R.eco.t })); stop(); }
        else if (R.eco.t >= S.eco.goal) { R.done = 'ok'; ctx.announce(t('chEcoOk', { n: S.eco.goal })); stop(); }
      }
    }
    function challengeStatus() {
      var ch = S.challenge; if (!ch) return null;
      var model = { life: 'life', net: 'net', eco: 'eco' }[ch];
      if (S.model !== model) return { kind: '', text: t('chOtherModel', { m: t('model_' + model) }) };
      if (ch === 'life') {
        var pop = R.data.rows[R.data.rows.length - 1][1];
        return { kind: R.done || '', text: R.done === 'ok' ? t('chLifeOk') : t('chLifeStatus', { s: R.startPop, g: R.gen, p: pop }) + (R.startPop > 12 ? ' ' + t('chLifeTooMany') : '') };
      }
      if (ch === 'net') return { kind: R.done || '', text: R.done === 'ok' ? t('chNetOk') : R.done === 'bad' ? t('chNetBad', { a: R.maxQ[0], b: R.maxQ[1], m: S.net.goalQueue }) : t('chNetStatus', { t: R.t, n: S.net.goalSteps, a: R.maxQ[0], b: R.maxQ[1], m: S.net.goalQueue }) };
      var rb = R.eco.rabbits.length, fx = R.eco.foxes.length;
      return { kind: R.done || '', text: R.done === 'ok' ? t('chEcoOk', { n: S.eco.goal }) : R.done === 'bad' ? t(!rb ? 'chEcoNoRabbits' : 'chEcoNoFoxes', { t: R.eco.t }) + ' ' + t('chEcoHint') : t('chEcoStatus', { t: R.eco.t, n: S.eco.goal, r: rb, f: fx }) };
    }

    /* ---------- Marcha: iniciar, pausar, paso ---------- */
    var runBtn = null, speedSel = null, speedWrap = null, modelSel = null;
    function advance(n) {
      if (running) stop();
      for (var i = 0; i < n; i++) { stepModel(); if (R.halt || R.done) break; }
      afterSteps(true);
      ctx.announce(t('advanced', { n: currentStep() }) + (R.halt ? ' ' + R.halt : ''));
      R.halt = null;
    }
    function afterSteps(commitLife) {
      if (S.model === 'life' && commitLife) syncLife(true);
      draw(); updateLive();
    }
    function tick() {
      timer = 0; if (!running) return;
      stepModel(); draw(); updateLive();
      if (R.halt) { var msg = R.halt; R.halt = null; stop(); ctx.announce(msg); return; }
      if (running) timer = root.setTimeout(tick, 1000 / S.speed);
    }
    function start() {
      if (running) return;
      if (R.done) { resetModel(); }
      running = true; setPlayLabel(); ctx.announce(t('running', { s: S.speed })); timer = root.setTimeout(tick, 1000 / S.speed); draw();
    }
    function stop(quiet) {
      if (!running) return;
      running = false; root.clearTimeout(timer); timer = 0; setPlayLabel();
      if (S.model === 'life' && !quiet) syncLife(true);
      updateLive(); draw();
    }
    function togglePlay() { if (running) { stop(); ctx.announce(t('paused', { n: currentStep() })); } else start(); }
    function resetRun() {
      stop();
      if (S.model === 'life') { S.life.cells = S.life.start; S.life.gen = 0; ctx.commit(t('resetDone')); }
      resetModel(); renderAll(); ctx.announce(t('resetDone'));
    }
    function setPlayLabel() {
      if (!runBtn) return;
      runBtn.querySelector('.igs-btn-label').textContent = stepMode ? t('advance10') : (running ? t('pause') : t('start'));
      var svg = runBtn.querySelector('svg'); if (svg) svg.replaceWith(ctx.icon(!stepMode && running ? 'pause' : 'play'));
    }
    /* Life: el tablero actual es el trabajo; al pausar o avanzar se guarda como un paso deshacible. */
    function syncLife(commit) {
      if (S.model !== 'life' || !R.cells) return;
      var str = Lib.boardToStr(R.cells, S.life.w, S.life.h);
      if (str === S.life.cells && S.life.gen === R.gen) return;
      S.life.cells = str; S.life.gen = R.gen;
      if (commit) ctx.commit(t('lifeAdvancedTo', { g: R.gen }));
    }
    function lifeEdited(label) {
      S.life.cells = Lib.boardToStr(R.cells, S.life.w, S.life.h); S.life.start = S.life.cells; S.life.gen = 0;
      R.gen = 0; R.data = table(['gen', 'pop', 'births', 'deaths']); record([0, popOf(R.cells), 0, 0]); R.startPop = popOf(R.cells); R.done = null;
      ctx.commit(label); draw(); updateLive();
    }

    /* ================= Dibujo de la simulación ================= */
    function drawSim(g, W, H, exporting) {
      bg(g, W, H);
      var m = S.model, out = null;
      if (m === 'life') out = drawLife(g, W, H, exporting);
      else if (m === 'wolf') out = drawWolf(g, W, H, exporting);
      else if (m === 'traffic') out = drawTraffic(g, W, H, exporting);
      else if (m === 'net') out = drawNet(g, W, H);
      else if (m === 'eco') out = drawEco(g, W, H, exporting);
      else out = drawPhase(g, W, H);
      badge.textContent = t('model_' + m) + ' · ' + stepLabel();
      return out;
    }
    function stepLabel() { var m = S.model; if (m === 'life') return t('genN', { n: R.gen }); if (m === 'lv') return 't = ' + num(R.t * S.lv.h, 2); return t('stepN', { n: currentStep() }); }
    function gridLayout(cols, rows, W, H, maxCell) {
      var cs = Math.max(1, Math.min(maxCell, Math.floor(Math.min((W - 16) / cols, (H - 40) / rows))));
      return { cs: cs, ox: Math.floor((W - cs * cols) / 2), oy: Math.max(30, Math.floor((H - cs * rows) / 2)) };
    }
    function drawLife(g, W, H, exporting) {
      var L = S.life, l = gridLayout(L.w, L.h, W, H, 12), cs = l.cs;
      g.fillStyle = '#ffffff'; g.fillRect(l.ox, l.oy, cs * L.w, cs * L.h);
      if (cs >= 6) {
        g.strokeStyle = COL.grid; g.lineWidth = 1; g.beginPath();
        for (var x = 0; x <= L.w; x++) { g.moveTo(l.ox + x * cs + 0.5, l.oy); g.lineTo(l.ox + x * cs + 0.5, l.oy + L.h * cs); }
        for (var y = 0; y <= L.h; y++) { g.moveTo(l.ox, l.oy + y * cs + 0.5); g.lineTo(l.ox + L.w * cs, l.oy + y * cs + 0.5); }
        g.stroke();
      }
      g.fillStyle = COL.navy; var ins = cs >= 6 ? 1 : 0;
      for (var yy = 0; yy < L.h; yy++) for (var xx = 0; xx < L.w; xx++) if (R.cells[yy * L.w + xx]) g.fillRect(l.ox + xx * cs + ins, l.oy + yy * cs + ins, cs - ins, cs - ins);
      g.strokeStyle = COL.soft; g.lineWidth = 1; g.strokeRect(l.ox - 0.5, l.oy - 0.5, cs * L.w + 1, cs * L.h + 1);
      if (!exporting) {
        if (tool === 'stamp') {
          var pp = patternPoints(L.pattern, L.rot, L.flip); g.fillStyle = 'rgba(90,73,168,.45)';
          pp.pts.forEach(function (p) { var px = kc.x + p[0] - Math.floor(pp.w / 2), py = kc.y + p[1] - Math.floor(pp.h / 2); if (L.wrap) { px = (px + L.w) % L.w; py = (py + L.h) % L.h; } if (px >= 0 && py >= 0 && px < L.w && py < L.h) g.fillRect(l.ox + px * cs, l.oy + py * cs, cs, cs); });
        }
        g.strokeStyle = '#b3261e'; g.globalAlpha = cursorShown ? 1 : 0.4; g.lineWidth = 2; g.strokeRect(l.ox + kc.x * cs - 1, l.oy + kc.y * cs - 1, cs + 2, cs + 2); g.globalAlpha = 1;
      }
      txt(g, t('lifeHead', { rule: L.rule, g: R.gen, p: R.data.rows[R.data.rows.length - 1][1] }), 12, 20, { size: 13, weight: 700 });
      return { kind: 'grid', cols: L.w, rows: L.h, cs: cs, ox: l.ox, oy: l.oy };
    }
    function drawWolf(g, W, H, exporting) {
      var Wf = S.wolf, cs = Math.max(1, Math.min(8, Math.floor((W - 16) / Wf.w))), ox = Math.floor((W - cs * Wf.w) / 2), oy = 30;
      var vis = Math.max(1, Math.floor((H - oy - 8) / cs)), from = Math.max(0, R.rows.length - vis);
      g.fillStyle = '#ffffff'; g.fillRect(ox, oy, cs * Wf.w, cs * vis);
      g.fillStyle = COL.navy;
      for (var r = from; r < R.rows.length; r++) { var row = R.rows[r], yy = oy + (r - from) * cs; for (var x = 0; x < Wf.w; x++) if (row[x]) g.fillRect(ox + x * cs, yy, cs, cs); }
      g.strokeStyle = COL.soft; g.lineWidth = 1; g.strokeRect(ox - 0.5, oy - 0.5, cs * Wf.w + 1, cs * vis + 1);
      if (!exporting && from === 0 && R.offset === 0) { g.strokeStyle = '#b3261e'; g.globalAlpha = cursorShown ? 1 : 0.4; g.lineWidth = 2; g.strokeRect(ox + kc.x * cs - 1, oy - 1, cs + 2, cs + 2); g.globalAlpha = 1; }
      txt(g, t('wolfHead', { r: Wf.rule, n: currentStep() }), 12, 20, { size: 13, weight: 700 });
      return { kind: 'wolf', cs: cs, ox: ox, oy: oy, from: from };
    }
    function drawTraffic(g, W, H, exporting) {
      var T = S.traffic, wide = W > H * 1.15, ringBox = wide ? Math.min(H - 10, W * 0.42) : Math.min(W - 10, H * 0.46);
      var cx = wide ? ringBox / 2 + 6 : W / 2, cy = wide ? H / 2 + 8 : ringBox / 2 + 18, rad = ringBox / 2 - 26;
      g.strokeStyle = '#8b9bac'; g.lineWidth = 16; g.beginPath(); g.arc(cx, cy, rad, 0, Math.PI * 2); g.stroke();
      g.strokeStyle = '#ffffff'; g.lineWidth = 1; g.setLineDash([4, 6]); g.beginPath(); g.arc(cx, cy, rad, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
      var sz = Math.max(3, Math.min(9, 2 * Math.PI * rad / T.L * 0.8)), selCar = selCarId();
      R.cars.forEach(function (c) {
        var a = -Math.PI / 2 + 2 * Math.PI * (c.x + 0.5) / T.L, px = cx + Math.cos(a) * rad, py = cy + Math.sin(a) * rad;
        g.save(); g.translate(px, py); g.rotate(a + Math.PI / 2); g.fillStyle = speedColour(c.v, T.vmax);
        if (c.v === 0) g.fillRect(-sz / 2, -sz / 2, sz, sz); else { g.beginPath(); g.moveTo(sz * 0.7, 0); g.lineTo(-sz / 2, -sz / 2); g.lineTo(-sz / 2, sz / 2); g.closePath(); g.fill(); }
        if (c.id === selCar) { g.strokeStyle = COL.violet; g.lineWidth = 3; g.strokeRect(-sz, -sz, sz * 2, sz * 2); }
        g.restore();
      });
      if (!exporting) { var ka = -Math.PI / 2 + 2 * Math.PI * (kc.x + 0.5) / T.L; g.strokeStyle = '#b3261e'; g.globalAlpha = cursorShown ? 1 : 0.4; g.lineWidth = 2; g.beginPath(); g.arc(cx + Math.cos(ka) * rad, cy + Math.sin(ka) * rad, sz + 4, 0, Math.PI * 2); g.stroke(); g.globalAlpha = 1; }
      txt(g, t('trafficHead', { n: R.cars.length, t: R.t }), 12, 20, { size: 13, weight: 700 });
      /* Diagrama espacio-tiempo: cada fila es un paso; las franjas rojas que retroceden son atascos fantasma. */
      var sx = wide ? ringBox + 20 : 12, sy = wide ? 40 : ringBox + 40, sw = W - sx - 12, sh = H - sy - 10;
      if (sw > 40 && sh > 40) {
        txt(g, t('spaceTime'), sx, sy - 8, { size: 12, weight: 700 });
        g.fillStyle = '#ffffff'; g.fillRect(sx, sy, sw, sh); g.strokeStyle = COL.line; g.strokeRect(sx - 0.5, sy - 0.5, sw + 1, sh + 1);
        var rows = Math.min(R.hist.length, Math.floor(sh / 2)), rh = sh / Math.max(rows, Math.floor(sh / 2)), cw = sw / T.L, from = R.hist.length - rows;
        for (var r = 0; r < rows; r++) {
          var snap = R.hist[from + r];
          for (var k = 0; k < snap.length; k++) { var s = snap[k]; g.fillStyle = s[2] === selCar ? COL.violet : speedColour(s[1], T.vmax); g.fillRect(sx + s[0] * cw, sy + r * rh, Math.max(1, cw), Math.max(1, rh)); }
        }
        txt(g, t('stAxis'), sx + sw - 4, sy + sh - 4, { size: 11, align: 'right', color: COL.soft });
      }
      return { kind: 'ring', cx: cx, cy: cy, rad: rad };
    }
    function selCarId() { return sel && sel.indexOf('car:') === 0 ? +sel.slice(4) : -1; }
    function drawNet(g, W, H) {
      var N = S.net, c = R.c, cw = Math.max(3, Math.min(14, Math.floor(Math.min(W - 40, H - 60) / N.L))), len = cw * N.L;
      var ox = Math.floor((W - len) / 2), oy = Math.floor((H - len) / 2) + 14, midX = ox + c * cw, midY = oy + c * cw, lt = lightState(R.t);
      g.fillStyle = '#8b9bac'; g.fillRect(ox, midY - 2, len, cw + 4); g.fillRect(midX - 2, oy, cw + 4, len);
      g.fillStyle = '#e7ecf2'; g.fillRect(midX - 2, midY - 2, cw + 4, cw + 4);
      function car(x, y, v) { g.fillStyle = speedColour(v, N.vmax); var p = Math.max(1, Math.round(cw * 0.12)); g.fillRect(x + p, y + p, cw - 2 * p, cw - 2 * p); }
      R.roads[0].forEach(function (k) { car(midX, oy + k.x * cw, k.v); });
      R.roads[1].forEach(function (k) { car(ox + k.x * cw, midY, k.v); });
      function light(x, y, on, label) {
        g.fillStyle = '#ffffff'; g.strokeStyle = COL.ink; g.lineWidth = 1.5; g.fillRect(x, y, 74, 24); g.strokeRect(x, y, 74, 24);
        g.fillStyle = on ? COL.green : COL.red;
        if (on) { g.beginPath(); g.arc(x + 12, y + 12, 7, 0, Math.PI * 2); g.fill(); } else g.fillRect(x + 5, y + 5, 14, 14);
        txt(g, label, x + 24, y + 16, { size: 11, weight: 700 });
      }
      light(midX + cw + 8, midY - 60, lt === 0, t('lightNS'));
      light(midX - 90, midY + cw + 30, lt === 1, t('lightEW'));
      txt(g, t('netHead', { t: R.t, s: t(lt === 2 ? 'phaseRed' : lt === 0 ? 'phaseNS' : 'phaseEW') }), 12, 20, { size: 13, weight: 700 });
      txt(g, t('queues', { a: R.q ? R.q[0] : 0, b: R.q ? R.q[1] : 0 }), 12, 38, { size: 12, color: COL.soft });
      return { kind: 'net', ox: ox, oy: oy, cw: cw, midX: midX, midY: midY };
    }
    function drawEco(g, W, H, exporting) {
      var E = S.eco, l = gridLayout(E.w, E.h, W, H, 16), cs = l.cs, st = R.eco;
      for (var y = 0; y < E.h; y++) for (var x = 0; x < E.w; x++) { g.fillStyle = st.grass[y * E.w + x] === 0 ? '#cfe6c1' : '#efe6d2'; g.fillRect(l.ox + x * cs, l.oy + y * cs, cs, cs); }
      var seen = {};
      st.rabbits.forEach(function (a) { var k = a.y * E.w + a.x; if (seen[k]) return; seen[k] = 1; g.beginPath(); g.arc(l.ox + (a.x + 0.5) * cs, l.oy + (a.y + 0.5) * cs, Math.max(1.5, cs * 0.3), 0, Math.PI * 2); g.fillStyle = '#ffffff'; g.fill(); g.strokeStyle = COL.navy; g.lineWidth = 1.2; g.stroke(); });
      var seenF = {};
      st.foxes.forEach(function (a) { var k = a.y * E.w + a.x; if (seenF[k]) return; seenF[k] = 1; var px = l.ox + (a.x + 0.5) * cs, py = l.oy + (a.y + 0.5) * cs, r = Math.max(2.5, cs * 0.45); g.beginPath(); g.moveTo(px, py - r); g.lineTo(px + r, py + r * 0.8); g.lineTo(px - r, py + r * 0.8); g.closePath(); g.fillStyle = COL.orange; g.fill(); });
      g.strokeStyle = COL.soft; g.lineWidth = 1; g.strokeRect(l.ox - 0.5, l.oy - 0.5, cs * E.w + 1, cs * E.h + 1);
      if (!exporting) { g.strokeStyle = '#b3261e'; g.globalAlpha = cursorShown ? 1 : 0.4; g.lineWidth = 2; g.strokeRect(l.ox + kc.x * cs - 1, l.oy + kc.y * cs - 1, cs + 2, cs + 2); g.globalAlpha = 1; }
      txt(g, t('ecoHead', { t: st.t, r: st.rabbits.length, f: st.foxes.length }), 12, 20, { size: 13, weight: 700 });
      return { kind: 'grid', cols: E.w, rows: E.h, cs: cs, ox: l.ox, oy: l.oy };
    }
    /* Diagrama de fases de Lotka-Volterra en el panel de la simulación. */
    function drawPhase(g, W, H) {
      var P = S.lv, rows = R.data.rows, xe = P.c / P.d, ye = P.a / P.b;
      var box = plotBox(W, H), maxX = Math.max(xe * 2.2, P.x0 * 1.2), maxY = Math.max(ye * 2.2, P.y0 * 1.2);
      rows.forEach(function (r) { maxX = Math.max(maxX, r[1] * 1.05); maxY = Math.max(maxY, r[2] * 1.05); });
      var sc = axes(g, box, 0, maxX, 0, maxY, t('axisPrey'), t('axisPred'), null);
      txt(g, t('phaseTitle'), box.x, 18, { size: 13, weight: 700 });
      g.setLineDash([5, 5]); g.strokeStyle = COL.soft; g.lineWidth = 1; g.beginPath(); g.moveTo(sc.x(xe), sc.y(0)); g.lineTo(sc.x(xe), sc.y(maxY)); g.moveTo(sc.x(0), sc.y(ye)); g.lineTo(sc.x(maxX), sc.y(ye)); g.stroke(); g.setLineDash([]);
      g.strokeStyle = COL.navy; g.lineWidth = 2; g.beginPath();
      var step = Math.max(1, Math.floor(rows.length / 1500));
      for (var i = 0; i < rows.length; i += step) { var px = sc.x(rows[i][1]), py = sc.y(rows[i][2]); if (i) g.lineTo(px, py); else g.moveTo(px, py); }
      g.stroke();
      g.fillStyle = COL.green; g.fillRect(sc.x(xe) - 5, sc.y(ye) - 5, 10, 10); txt(g, t('equilibrium'), sc.x(xe) + 8, sc.y(ye) - 8, { size: 11, color: COL.green, weight: 700 });
      g.strokeStyle = COL.soft; g.lineWidth = 2; g.beginPath(); g.arc(sc.x(P.x0), sc.y(P.y0), 6, 0, Math.PI * 2); g.stroke();
      g.fillStyle = COL.violet; g.beginPath(); g.arc(sc.x(R.x), sc.y(R.y), 6, 0, Math.PI * 2); g.fill();
      txt(g, t('lvHead', { t: num(R.t * P.h, 2), x: num(R.x, 1), y: num(R.y, 1) }), box.x, 34, { size: 12, weight: 600, color: COL.soft });
      return { kind: 'phase', sc: sc, maxX: maxX, maxY: maxY };
    }

    /* ================= Gráfico con ejes, leyenda y líneas con trazo distinto ================= */
    function plotBox(W, H) { return { x: 58, y: 44, w: Math.max(40, W - 58 - 16), h: Math.max(40, H - 44 - 44) }; }
    function niceStep(range) { var raw = range / 5, p = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10)), f = raw / p; return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * p; }
    function axes(g, b, x0, x1, y0, y1, xl, yl, title) {
      if (x1 - x0 < 1e-9) x1 = x0 + 1; if (y1 - y0 < 1e-9) y1 = y0 + 1;
      var sc = { x: function (v) { return b.x + (v - x0) / (x1 - x0) * b.w; }, y: function (v) { return b.y + b.h - (v - y0) / (y1 - y0) * b.h; } };
      g.fillStyle = '#ffffff'; g.fillRect(b.x, b.y, b.w, b.h);
      g.strokeStyle = COL.grid; g.lineWidth = 1; g.font = '600 11px ' + FONT; g.fillStyle = COL.soft;
      var xs = niceStep(x1 - x0), ys = niceStep(y1 - y0), v;
      g.textAlign = 'center'; g.textBaseline = 'top';
      for (v = Math.ceil(x0 / xs) * xs; v <= x1 + 1e-9; v += xs) { var px = Math.round(sc.x(v)) + 0.5; g.beginPath(); g.moveTo(px, b.y); g.lineTo(px, b.y + b.h); g.stroke(); g.fillText(num(v, xs < 1 ? 2 : 0), px, b.y + b.h + 4); }
      g.textAlign = 'right'; g.textBaseline = 'middle';
      for (v = Math.ceil(y0 / ys) * ys; v <= y1 + 1e-9; v += ys) { var py = Math.round(sc.y(v)) + 0.5; g.beginPath(); g.moveTo(b.x, py); g.lineTo(b.x + b.w, py); g.stroke(); g.fillText(num(v, ys < 1 ? 2 : 0), b.x - 5, py); }
      g.strokeStyle = COL.soft; g.strokeRect(b.x + 0.5, b.y + 0.5, b.w, b.h);
      txt(g, xl, b.x + b.w, b.y + b.h + 32, { size: 11, align: 'right', color: COL.ink, weight: 700 });
      g.save(); g.translate(14, b.y + b.h / 2); g.rotate(-Math.PI / 2); txt(g, yl, 0, 0, { size: 11, align: 'center', color: COL.ink, weight: 700, base: 'middle' }); g.restore();
      if (title) txt(g, title, b.x, 20, { size: 13, weight: 700 });
      return sc;
    }
    /* Qué se dibuja en el gráfico según el modelo: series (con color y trazo) o fases. */
    function chartSpec() {
      var m = S.model, d = R.data, cols = d.cols;
      function ser(key, label, colour, dash) { var i = cols.indexOf(key); return { label: label, colour: colour, dash: dash || [], i: i }; }
      if (m === 'traffic' && S.chart === 'fundamental') {
        if (!R.fd) R.fd = Lib.fundamental(S.traffic.L, S.traffic.vmax, S.traffic.p, S.seed, ctx.rng);
        return { phase: true, title: t('fdTitle'), xl: t('axisDensity'), yl: t('axisFlow'), pts: R.fd, marker: [S.traffic.density, null], x1: 1 };
      }
      if ((m === 'eco' || m === 'lv') && S.chart === 'phase') {
        var a = m === 'eco' ? cols.indexOf('rabbits') : 1, b = m === 'eco' ? cols.indexOf('foxes') : 2;
        return { phase: true, title: t('phaseTitle'), xl: t(m === 'eco' ? 'thRabbits' : 'axisPrey'), yl: t(m === 'eco' ? 'thFoxes' : 'axisPred'), pts: d.rows.map(function (r) { return [r[a], r[b]]; }) };
      }
      var x = { life: t('thGen'), wolf: t('thStep'), traffic: t('thStep'), net: t('thStep'), eco: t('thStep'), lv: t('thTime') }[m];
      var list = {
        life: [ser('pop', t('thPop'), COL.navy), ser('births', t('thBirths'), COL.green, [6, 4]), ser('deaths', t('thDeaths'), COL.red, [2, 3])],
        wolf: [ser('ones', t('thOnes'), COL.navy)],
        traffic: [ser('speed', t('thSpeed'), COL.navy), ser('flow', t('thFlow'), COL.green, [6, 4])],
        net: [ser('speedNS', t('thSpeedNS'), COL.navy), ser('speedEW', t('thSpeedEW'), COL.orange, [6, 4])],
        eco: [ser('rabbits', t('thRabbits'), COL.navy), ser('foxes', t('thFoxes'), COL.orange, [6, 4]), ser('grass', t('thGrassScaled'), COL.green, [2, 3])],
        lv: [ser('prey', t('thPrey'), COL.navy), ser('pred', t('thPred'), COL.orange, [6, 4])]
      }[m];
      return { phase: false, title: t('chartTitle_' + m), xl: x, yl: t('chartY_' + m), series: list, scaleGrass: m === 'eco' ? 0.1 : 1 };
    }
    function drawChart(g, W, H) {
      bg(g, W, H);
      var spec = chartSpec(), b = plotBox(W, H), rows = R.data.rows;
      if (!spec.phase) { var extra = (legendLines(g, spec.series, b.x, W - 10) - 1) * 16 + 14; b.y += extra; b.h -= extra; }
      if (spec.phase) {
        var pts = spec.pts, mx = spec.x1 || 1, my = 1;
        pts.forEach(function (p) { mx = Math.max(mx, p[0] * 1.05); my = Math.max(my, p[1] * 1.1); });
        var sc = axes(g, b, 0, mx, 0, my, spec.xl, spec.yl, spec.title);
        g.strokeStyle = COL.navy; g.lineWidth = 2; g.beginPath();
        pts.forEach(function (p, i) { if (i) g.lineTo(sc.x(p[0]), sc.y(p[1])); else g.moveTo(sc.x(p[0]), sc.y(p[1])); }); g.stroke();
        if (spec.marker) { g.strokeStyle = COL.violet; g.setLineDash([5, 4]); g.beginPath(); g.moveTo(sc.x(spec.marker[0]), b.y); g.lineTo(sc.x(spec.marker[0]), b.y + b.h); g.stroke(); g.setLineDash([]); txt(g, t('yourDensity'), sc.x(spec.marker[0]) + 5, b.y + 14, { size: 11, color: COL.violet, weight: 700 }); }
        else if (pts.length) { var last = pts[pts.length - 1]; g.fillStyle = COL.violet; g.beginPath(); g.arc(sc.x(last[0]), sc.y(last[1]), 5, 0, Math.PI * 2); g.fill(); }
        return;
      }
      var x0 = rows.length ? rows[0][0] : 0, x1 = rows.length ? rows[rows.length - 1][0] : 1, y1 = 1, y0 = 0;
      if (x1 - x0 < 10 && S.model !== 'lv') x1 = x0 + 10;
      spec.series.forEach(function (s) { rows.forEach(function (r) { var v = r[s.i] * (s.i === R.data.cols.indexOf('grass') ? spec.scaleGrass : 1); if (v > y1) y1 = v; }); });
      if (S.model === 'wolf') y1 = Math.max(y1, 1);
      var sc2 = axes(g, b, x0, x1, y0, y1 * 1.08, spec.xl, spec.yl, spec.title);
      var step = Math.max(1, Math.floor(rows.length / 1200));
      spec.series.forEach(function (s) {
        var mul = s.i === R.data.cols.indexOf('grass') ? spec.scaleGrass : 1;
        g.strokeStyle = s.colour; g.lineWidth = 2; g.setLineDash(s.dash); g.beginPath();
        for (var i = 0; i < rows.length; i += step) { var px = sc2.x(rows[i][0]), py = sc2.y(rows[i][s.i] * mul); if (i) g.lineTo(px, py); else g.moveTo(px, py); }
        if (rows.length) { var lr = rows[rows.length - 1]; g.lineTo(sc2.x(lr[0]), sc2.y(lr[s.i] * mul)); }
        g.stroke(); g.setLineDash([]);
      });
      drawLegend(g, spec.series, b.x, 38, W - 10);
    }
    /* Leyenda: muestra de trazo + nombre (no depende solo del color). Va bajo el título y salta de línea si no cabe. */
    function legendLines(g, series, x0, xMax) { g.font = '600 11px ' + FONT; var lines = 1, lx = x0; series.forEach(function (s) { var w = g.measureText(s.label).width + 40; if (lx + w > xMax && lx > x0) { lines++; lx = x0; } lx += w; }); return lines; }
    function drawLegend(g, series, x0, y0, xMax) {
      g.font = '600 11px ' + FONT; var lx = x0, ly = y0;
      series.forEach(function (s) {
        var w = g.measureText(s.label).width + 40; if (lx + w > xMax && lx > x0) { lx = x0; ly += 16; }
        g.strokeStyle = s.colour; g.lineWidth = 2.5; g.setLineDash(s.dash); g.beginPath(); g.moveTo(lx, ly - 4); g.lineTo(lx + 24, ly - 4); g.stroke(); g.setLineDash([]);
        txt(g, s.label, lx + 28, ly, { size: 11 }); lx += w;
      });
    }

    /* ================= Puntero y teclado ================= */
    function cellFrom(e) {
      var r = simCv.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
      if (!lay) return null;
      if (lay.kind === 'grid') { var x = Math.floor((px - lay.ox) / lay.cs), y = Math.floor((py - lay.oy) / lay.cs); return x >= 0 && y >= 0 && x < lay.cols && y < lay.rows ? { x: x, y: y } : null; }
      if (lay.kind === 'wolf') { var wx = Math.floor((px - lay.ox) / lay.cs); return wx >= 0 && wx < S.wolf.w && py >= lay.oy ? { x: wx, y: 0 } : null; }
      if (lay.kind === 'ring') {
        var dx = px - lay.cx, dy = py - lay.cy, d = Math.hypot(dx, dy); if (Math.abs(d - lay.rad) > 22) return null;
        var a = Math.atan2(dy, dx) + Math.PI / 2; if (a < 0) a += Math.PI * 2; return { x: Math.floor(a / (Math.PI * 2) * S.traffic.L) % S.traffic.L, y: 0 };
      }
      if (lay.kind === 'phase') return { px: px, py: py };
      if (lay.kind === 'net') return { px: px, py: py };
      return null;
    }
    var painting = null;
    simCv.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      var c = cellFrom(e); if (!c) return;
      cursorShown = false;
      if (S.model === 'lv') {
        var sc = lay.sc, P = S.lv, b = plotBox(simCv.clientWidth, simCv.clientHeight);
        var x = (c.px - b.x) / b.w * lay.maxX, y = (b.y + b.h - c.py) / b.h * lay.maxY;
        if (x > 0 && y > 0 && sc) { P.x0 = Math.round(x * 10) / 10; P.y0 = Math.round(y * 10) / 10; ctx.commit(t('lvStartSet')); resetModel(); renderAll(); ctx.announce(t('lvStartAt', { x: num(P.x0, 1), y: num(P.y0, 1) })); }
        return;
      }
      if (S.model === 'net') {
        var hitNS = Math.abs(c.px - (lay.midX + lay.cw / 2)) < 20, hitEW = Math.abs(c.py - (lay.midY + lay.cw / 2)) < 20;
        select(hitNS && hitEW ? 'light' : hitNS ? 'roadNS' : hitEW ? 'roadEW' : null); return;
      }
      kc.x = c.x; kc.y = c.y;
      if (S.model === 'life' && (tool === 'draw' || tool === 'erase')) {
        var i = c.y * S.life.w + c.x; painting = tool === 'erase' ? 0 : (R.cells[i] ? 0 : 1);
        if (running) stop(); R.cells[i] = painting; simCv.setPointerCapture(e.pointerId); draw(); return;
      }
      act();
    });
    simCv.addEventListener('pointermove', function (e) {
      var c = cellFrom(e); if (!c || c.x === undefined) return;
      if (painting !== null && S.model === 'life') { R.cells[c.y * S.life.w + c.x] = painting; kc.x = c.x; kc.y = c.y; draw(); return; }
      if (tool === 'stamp' && S.model === 'life' && (kc.x !== c.x || kc.y !== c.y)) { kc.x = c.x; kc.y = c.y; draw(); }
    });
    function endPaint() { if (painting === null) return; painting = null; lifeEdited(t('cellsEdited')); ctx.announce(t('cellsEdited')); }
    simCv.addEventListener('pointerup', endPaint); simCv.addEventListener('pointercancel', endPaint);

    /* Acción de la herramienta en el cursor (ratón o Intro). */
    function act() {
      var m = S.model;
      if (m === 'life') {
        if (running) stop();
        var i = kc.y * S.life.w + kc.x;
        if (tool === 'stamp') { stampPattern(); return; }
        R.cells[i] = tool === 'erase' ? 0 : (R.cells[i] ? 0 : 1);
        lifeEdited(t(R.cells[i] ? 'cellOn' : 'cellOff', { x: kc.x + 1, y: kc.y + 1 })); ctx.announce(t(R.cells[i] ? 'cellOn' : 'cellOff', { x: kc.x + 1, y: kc.y + 1 })); return;
      }
      if (m === 'wolf') {
        var Wf = S.wolf, row = Wf.init === 'custom' ? Wf.custom : rowString(R.rows[0] || new Uint8Array(Wf.w));
        var arr = row.split(''); while (arr.length < Wf.w) arr.push('0');
        arr[kc.x] = arr[kc.x] === '1' ? '0' : '1'; Wf.custom = arr.join(''); Wf.init = 'custom';
        ctx.commit(t('wolfRowEdited')); resetModel(); renderAll(); ctx.announce(t(arr[kc.x] === '1' ? 'wolfCellOn' : 'wolfCellOff', { x: kc.x + 1 })); return;
      }
      if (m === 'traffic') {
        var car = carAt(kc.x);
        if (tool === 'addcar') {
          if (car) { ctx.announce(t('cellBusy')); return; }
          if (running) stop();
          var id = R.cars.reduce(function (a, c) { return Math.max(a, c.id); }, 0) + 1;
          R.cars.push({ id: id, x: kc.x, v: 0, px: kc.x }); R.cars.sort(function (a, b) { return a.x - b.x; });
          ctx.announce(t('carAdded', { n: R.cars.length })); renderStructure(); draw(); updateLive(); return;
        }
        if (tool === 'removecar') {
          if (!car) { ctx.announce(t('noCarHere')); return; }
          if (running) stop();
          R.cars = R.cars.filter(function (c) { return c !== car; }); if (selCarId() === car.id) sel = null;
          ctx.announce(t('carRemoved', { n: R.cars.length })); renderAll(); return;
        }
        if (car) select('car:' + car.id); else ctx.announce(t('noCarHere'));
        return;
      }
      if (m === 'eco') {
        var E = S.eco, st = R.eco;
        if (tool === 'addrabbit' || tool === 'addfox') {
          if (running) stop();
          (tool === 'addrabbit' ? st.rabbits : st.foxes).push({ x: kc.x, y: kc.y, e: tool === 'addrabbit' ? E.gainR * 2 : E.gainF * 2 });
          ctx.announce(t(tool === 'addrabbit' ? 'rabbitAdded' : 'foxAdded', { r: st.rabbits.length, f: st.foxes.length })); draw(); updateLive(); return;
        }
        ctx.announce(describeEcoCell(kc.x, kc.y));
      }
    }
    function carAt(x) { for (var i = 0; i < R.cars.length; i++) if (R.cars[i].x === x) return R.cars[i]; return null; }
    function rowString(row) { var s = ''; for (var i = 0; i < row.length; i++) s += row[i] ? '1' : '0'; return s; }
    function describeEcoCell(x, y) {
      var st = R.eco, r = 0, f = 0; st.rabbits.forEach(function (a) { if (a.x === x && a.y === y) r++; }); st.foxes.forEach(function (a) { if (a.x === x && a.y === y) f++; });
      return t('ecoCell', { x: x + 1, y: y + 1, g: st.grass[y * S.eco.w + x] === 0 ? t('grassYes') : t('grassNo'), r: r, f: f });
    }
    function stampPattern() {
      var L = S.life, pp = patternPoints(L.pattern, L.rot, L.flip), placed = 0;
      pp.pts.forEach(function (p) { var px = kc.x + p[0] - Math.floor(pp.w / 2), py = kc.y + p[1] - Math.floor(pp.h / 2); if (L.wrap) { px = (px + L.w) % L.w; py = (py + L.h) % L.h; } if (px >= 0 && py >= 0 && px < L.w && py < L.h) { R.cells[py * L.w + px] = 1; placed++; } });
      lifeEdited(t('patternPlaced', { p: t('pat_' + L.pattern) }));
      ctx.announce(t('patternPlaced', { p: t('pat_' + L.pattern) }) + ' ' + t('cursorCell', { x: kc.x + 1, y: kc.y + 1 }) + (placed < pp.pts.length ? ' ' + t('patternCut') : ''));
    }
    function onKey(e) {
      var k = e.key, inVp = vp.contains(e.target), inBar = ctx.toolbar.contains(e.target);
      if ((inVp || inBar) && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (k === 'p' || k === 'P') { togglePlay(); return true; }
        if (k === '.') { advance(1); return true; }
        if (/^[1-9]$/.test(k)) {
          var cur = TOOLS[S.model], idx = +k - 1;
          if (idx < cur.length) { ctx.selectTool(cur[idx][0]); var tb = ctx.toolButton(cur[idx][0]); ctx.announce(tb ? tb.textContent.trim() : ''); return true; }
        }
      }
      if (!inVp) return false;
      var st = e.shiftKey ? 5 : 1, d = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, -st], ArrowDown: [0, st] }[k], m = S.model;
      if (d) {
        if (m === 'lv') { S.lv.x0 = Math.max(0.1, Math.round((S.lv.x0 + d[0]) * 10) / 10); S.lv.y0 = Math.max(0.1, Math.round((S.lv.y0 - d[1]) * 10) / 10); ctx.commit(t('lvStartSet')); resetModel(); renderInspector(); draw(); updateLive(); ctx.announce(t('lvStartAt', { x: num(S.lv.x0, 1), y: num(S.lv.y0, 1) })); return true; }
        if (m === 'net') return false;
        var cols = m === 'life' ? S.life.w : m === 'wolf' ? S.wolf.w : m === 'traffic' ? S.traffic.L : S.eco.w;
        var rows = m === 'life' ? S.life.h : m === 'eco' ? S.eco.h : 1;
        if (m === 'traffic') kc.x = ((kc.x + d[0] + d[1]) % cols + cols) % cols;
        else { kc.x = clamp(kc.x + d[0], 0, cols - 1); kc.y = clamp(kc.y + d[1], 0, rows - 1); }
        cursorShown = true; draw(); ctx.announce(cursorText()); return true;
      }
      if (k === 'Enter' || k === ' ') { if (m === 'lv' || m === 'net') { advance(1); return true; } cursorShown = true; act(); return true; }
      if (k === 'Escape') { if (sel) { select(null); ctx.announce(t('deselected')); return true; } return false; }
      return false;
    }
    function cursorText() {
      var m = S.model;
      if (m === 'life') return t('cursorLife', { x: kc.x + 1, y: kc.y + 1, s: R.cells[kc.y * S.life.w + kc.x] ? t('alive') : t('dead') });
      if (m === 'wolf') { var r0 = R.rows[0]; return t('cursorWolf', { x: kc.x + 1, s: r0 && r0[kc.x] ? '1' : '0' }); }
      if (m === 'traffic') { var car = carAt(kc.x); return t('cursorRoad', { x: kc.x + 1 }) + ': ' + (car ? t('carInfo', { n: car.id, v: car.v }) : t('emptyCell')); }
      if (m === 'eco') return describeEcoCell(kc.x, kc.y);
      return '';
    }

    /* ================= Paneles: estructura, propiedades, herramientas ================= */
    function elementsOf(m) {
      return {
        life: [['grid', t('elGrid')], ['rule', t('elRule')], ['pattern', t('elPattern')]],
        wolf: [['wrule', t('elWRule')], ['wrow', t('elWRow')]],
        traffic: [['road', t('elRoad')], ['drivers', t('elDrivers')]],
        net: [['light', t('elLight')], ['roadNS', t('elRoadNS')], ['roadEW', t('elRoadEW')]],
        eco: [['grass', t('elGrass')], ['rabbits', t('elRabbits')], ['foxes', t('elFoxes')]],
        lv: [['prey', t('elPrey')], ['pred', t('elPred')], ['solver', t('elSolver')]]
      }[m];
    }
    function select(id) {
      sel = id; renderStructure(); renderInspector(); draw();
      if (id) ctx.announce(t('selected', { name: elementName(id) }));
    }
    function elementName(id) {
      if (id.indexOf('car:') === 0) return t('carN', { n: id.slice(4) });
      var e = elementsOf(S.model).filter(function (x) { return x[0] === id; })[0]; return e ? e[1] : id;
    }
    function listButton(label, small, current, onClick, swatch) {
      var b = h('button', { type: 'button', 'aria-current': String(!!current) }, swatch ? h('span', { class: 'igs-swatch', style: 'background:' + swatch }) : null, h('span', { text: label }), small ? h('small', { text: small }) : null);
      b.addEventListener('click', onClick); return h('li', null, b);
    }
    /* Al redibujar un panel, el foco vuelve al mismo control (así el teclado no se pierde). */
    var FOC = 'button,input,select,textarea,[tabindex="0"]';
    function keepFocus(box, fn) {
      var ae = D.activeElement, idx = ae && box.contains(ae) ? Array.prototype.indexOf.call(box.querySelectorAll(FOC), ae) : -1;
      fn();
      if (idx >= 0) { var el = box.querySelectorAll(FOC)[idx]; if (el) { try { el.focus({ preventScroll: true }); } catch (_) { el.focus(); } } }
    }
    function renderStructure() { keepFocus(ctx.structure, renderStructure0); }
    function renderStructure0() {
      var ml = h('ul', { class: 'igs-list' });
      MODELS.forEach(function (m) { ml.appendChild(listButton(t('model_' + m), t(FAMILY[m]), S.model === m, function () { setModel(m); })); });
      var el = h('ul', { class: 'igs-list' });
      elementsOf(S.model).forEach(function (e) { el.appendChild(listButton(e[1], null, sel === e[0], function () { select(sel === e[0] ? null : e[0]); })); });
      var out = [h('h3', { text: t('models') }), ml, h('h3', { text: t('elements') }), el];
      if (S.model === 'traffic') {
        var cl = h('ul', { class: 'igs-list' }), cars = R.cars.slice().sort(function (a, b) { return a.id - b.id; });
        cars.slice(0, 60).forEach(function (c) { cl.appendChild(listButton(t('carN', { n: c.id }), null, selCarId() === c.id, function () { select(selCarId() === c.id ? null : 'car:' + c.id); }, COL.blue)); });
        out.push(h('h3', { text: t('carsN', { n: cars.length }) }), cl);
        if (cars.length > 60) out.push(h('p', { class: 'igs-muted', text: t('carsMore', { n: cars.length - 60 }) }));
      }
      ctx.setStructure(out);
    }
    var liveBox = null, chBox = null;
    function changed(label, reset) { ctx.commit(label); if (reset !== false) resetModel(); renderAll(); ctx.announce(label); }
    function renderInspector() { keepFocus(ctx.inspector, renderInspector0); }
    function renderInspector0() {
      var out = [], m = S.model;
      chBox = null;
      if (S.challenge) { chBox = h('div', { class: 'igs-result igsim-challenge', role: 'group', 'aria-label': t('challenge') }); out.push(chBox); }
      if (sel && sel.indexOf('car:') === 0) {
        var id = +sel.slice(4);
        out.push(h('h4', { text: t('carN', { n: id }) }), h('p', { class: 'igs-muted', text: t('carHelp') }));
        out.push(h('div', { class: 'igs-actions' }, ctx.button(t('removeThisCar'), { icon: 'trash', class: 'igs-danger', onClick: function () { R.cars = R.cars.filter(function (c) { return c.id !== id; }); sel = null; renderAll(); ctx.announce(t('carRemoved', { n: R.cars.length })); } })));
      } else if (sel) out = out.concat(elementFields(sel));
      else out = out.concat(docFields());
      liveBox = h('div', { class: 'igsim-live', 'aria-live': 'off' });
      out.push(h('h4', { text: t('nowTitle') }), liveBox);
      out.push(h('div', { class: 'igs-actions' }, ctx.button(t('dataTable'), { icon: 'grid', onClick: function (e) { showTable(e && e.currentTarget); } })));
      ctx.setInspector(out); updateLive();
    }
    function docFields() {
      var m = S.model, out = [h('h4', { text: t('model_' + m) }), h('p', { class: 'igs-muted', text: t('about_' + m) })];
      out.push(F.select(t('modelLabel'), m, MODELS.map(function (x) { return [x, t('model_' + x)]; }), { onChange: setModel }));
      out.push(F.range(t('speed'), S.speed, { min: 1, max: 10, step: 1, unit: t('stepsPerSec'), onChange: function (v) { S.speed = v; ctx.commit(t('speedSet', { s: v })); syncSpeedSelect(); } }));
      out.push(F.check(t('stepModeLabel'), stepMode, { onChange: function (v) { stepMode = !!v; if (stepMode) stop(); applyModelTools(); ctx.announce(stepMode ? t('stepModeOn') : t('stepModeOff')); } }));
      out.push(F.text(t('seed'), S.seed, { max: 40, onChange: function (v) { S.seed = String(v).trim().slice(0, 40) || 'iris'; changed(t('seedSet', { s: S.seed })); } }));
      out.push(h('div', { class: 'igs-actions' }, ctx.button(t('newSeed'), { icon: 'sparkle', onClick: newSeed })));
      out.push(h('p', { class: 'igs-muted', text: t('seedNote') }));
      var charts = [['time', t('chartTime')]];
      if (m === 'eco' || m === 'lv') charts.push(['phase', t('chartPhase')]);
      if (m === 'traffic') charts.push(['fundamental', t('chartFund')]);
      if (charts.length > 1) out.push(F.choice(t('chartKind'), S.chart, charts, { onChange: function (v) { S.chart = v; ctx.commit(t('chartSet')); draw(); ctx.announce(t('chartSet')); } }));
      out.push(h('p', { class: 'igs-muted', text: t('legend_' + m) }));
      out.push(h('p', { class: 'igs-muted', text: t('flashNote') }));
      return out;
    }
    function bitButtons(label, arr, onToggle) {
      var row = h('div', { class: 'igsim-bits', role: 'group', 'aria-label': label });
      arr.forEach(function (on, i) { var b = h('button', { type: 'button', class: 'igsim-bit', 'aria-pressed': String(!!on), 'aria-label': label + ' ' + i, text: String(i) }); b.addEventListener('click', function () { onToggle(i); }); row.appendChild(b); });
      return h('div', { class: 'igs-field' }, h('span', { class: 'igsim-bits-label', text: label }), row);
    }
    function elementFields(id) {
      var out = [h('h4', { text: elementName(id) })], L = S.life, Wf = S.wolf, T = S.traffic, N = S.net, E = S.eco, P = S.lv;
      function rng2(key, obj, prop, min, max, step, unit, fmt, reset) {
        return F.range(t(key), obj[prop], { min: min, max: max, step: step, unit: unit, format: fmt, onChange: function (v) { obj[prop] = v; changed(t('paramSet', { p: t(key) }), reset); } });
      }
      function nf(key, obj, prop, min, max, step, unit) { return F.number(t(key), obj[prop], { min: min, max: max, step: step, unit: unit, onChange: function (v) { obj[prop] = v; changed(t('paramSet', { p: t(key) })); } }); }
      var pct = function (v) { return num(v * 100, 0) + ' %'; };
      if (id === 'grid') {
        out.push(F.select(t('gridSize'), L.w + 'x' + L.h, SIZES.map(function (s) { return [s[0] + 'x' + s[1], s[0] + ' × ' + s[1]]; }), { onChange: function (v) { var p = v.split('x'); resizeLife(+p[0], +p[1]); } }));
        out.push(F.check(t('wrapLabel'), L.wrap, { onChange: function (v) { L.wrap = !!v; syncLifeFromRuntime(); changed(t('paramSet', { p: t('wrapLabel') }), false); R.done = null; } }));
        out.push(h('p', { class: 'igs-muted', text: t('wrapNote') }));
        out.push(F.range(t('fillDensity'), L.fill, { min: 0.05, max: 0.8, step: 0.05, format: pct, onChange: function (v) { L.fill = v; } }));
        out.push(h('div', { class: 'igs-actions' }, ctx.button(t('randomFill'), { icon: 'sparkle', onClick: randomFill }), ctx.button(t('clearGrid'), { icon: 'trash', class: 'igs-danger', onClick: clearGrid })));
      } else if (id === 'rule') {
        var r = parseRule(L.rule);
        out.push(h('p', { class: 'igs-muted', text: t('ruleNote') }));
        out.push(F.select(t('rulePreset'), (RULE_PRESETS.filter(function (p) { return p[0] === L.rule; })[0] || [''])[0], [['', t('ruleCustom')]].concat(RULE_PRESETS.map(function (p) { return [p[0], t(p[1]) + ' · ' + p[0]]; })), { onChange: function (v) { if (v) setRule(v); } }));
        var tf = F.text(t('ruleText'), L.rule, { max: 24, onChange: function (v) { var pr = parseRule(v); if (!pr) { ctx.announce(t('ruleBad')); tf.input.value = L.rule; tf.input.setAttribute('aria-invalid', 'true'); return; } setRule(ruleText(pr)); } });
        tf.input.setAttribute('aria-describedby', 'igsim-rule-help'); out.push(tf, h('p', { id: 'igsim-rule-help', class: 'igs-muted', text: t('ruleHelp') }));
        out.push(bitButtons(t('bornWith'), r.b, function (i) { r.b[i] = !r.b[i]; setRule(ruleText(r)); }));
        out.push(bitButtons(t('surviveWith'), r.s, function (i) { r.s[i] = !r.s[i]; setRule(ruleText(r)); }));
      } else if (id === 'pattern') {
        out.push(F.select(t('patternLabel'), L.pattern, Object.keys(PATTERNS).map(function (k) { return [k, t('pat_' + k)]; }), { onChange: function (v) { L.pattern = v; ctx.commit(t('paramSet', { p: t('patternLabel') })); renderInspector(); draw(); } }));
        out.push(h('p', { class: 'igs-muted', text: t('patInfo_' + L.pattern) }));
        out.push(F.choice(t('rotation'), String(L.rot), [['0', '0°'], ['90', '90°'], ['180', '180°'], ['270', '270°']], { onChange: function (v) { L.rot = +v; ctx.commit(t('paramSet', { p: t('rotation') })); draw(); } }));
        out.push(F.check(t('flipLabel'), L.flip, { onChange: function (v) { L.flip = !!v; ctx.commit(t('paramSet', { p: t('flipLabel') })); draw(); } }));
        out.push(h('div', { class: 'igs-actions' }, ctx.button(t('placeAtCursor'), { icon: 'plus', class: 'igs-primary', onClick: stampPattern }), ctx.button(t('useStampTool'), { icon: 'star', onClick: function () { ctx.selectTool('stamp'); vp.focus(); } })));
        out.push(F.number(t('cursorX'), kc.x + 1, { min: 1, max: L.w, step: 1, onChange: function (v) { kc.x = v - 1; draw(); } }));
        out.push(F.number(t('cursorY'), kc.y + 1, { min: 1, max: L.h, step: 1, onChange: function (v) { kc.y = v - 1; draw(); } }));
      } else if (id === 'wrule') {
        out.push(F.number(t('wolfRule'), Wf.rule, { min: 0, max: 255, step: 1, onChange: function (v) { Wf.rule = Math.round(v); changed(t('wolfRuleSet', { r: Wf.rule })); } }));
        out.push(F.select(t('wolfPreset'), WOLF_PRESETS.indexOf(Wf.rule) >= 0 ? String(Wf.rule) : '', [['', t('ruleCustom')]].concat(WOLF_PRESETS.map(function (r) { return [String(r), t('wolf_' + r)]; })), { onChange: function (v) { if (v) { Wf.rule = +v; changed(t('wolfRuleSet', { r: Wf.rule })); } } }));
        out.push(h('p', { class: 'igs-muted', text: t('wolfRuleNote') }));
        var grid = h('div', { class: 'igsim-wbits', role: 'group', 'aria-label': t('wolfTable') });
        for (var k = 7; k >= 0; k--) (function (k) {
          var pat = ('00' + k.toString(2)).slice(-3), on = (Wf.rule >> k) & 1;
          var b = h('button', { type: 'button', class: 'igsim-wbit', 'aria-pressed': String(!!on), 'aria-label': t('wolfBitLabel', { p: pat.split('').map(function (c) { return c === '1' ? t('onWord') : t('offWord'); }).join(', '), r: on ? t('onWord') : t('offWord') }) },
            h('span', { class: 'igsim-trio', 'aria-hidden': 'true' }, pat.split('').map(function (c) { return h('i', { 'data-on': c }); })), h('span', { class: 'igsim-out', 'aria-hidden': 'true', 'data-on': String(on) }), h('small', { 'aria-hidden': 'true', text: pat + ' → ' + on }));
          b.addEventListener('click', function () { Wf.rule ^= (1 << k); changed(t('wolfRuleSet', { r: Wf.rule })); });
          grid.appendChild(b);
        })(k);
        out.push(grid);
      } else if (id === 'wrow') {
        out.push(F.choice(t('wolfInit'), Wf.init, [['single', t('initSingle')], ['random', t('initRandom')], ['custom', t('initCustom')]], { onChange: function (v) { Wf.init = v; if (v === 'custom' && Wf.custom.length !== Wf.w) Wf.custom = rowString(R.rows[0]); changed(t('paramSet', { p: t('wolfInit') })); } }));
        out.push(F.select(t('wolfWidth'), String(Wf.w), [61, 101, 121, 181, 241].map(function (n) { return [String(n), String(n)]; }), { onChange: function (v) { Wf.w = +v; Wf.custom = ''; if (Wf.init === 'custom') Wf.init = 'single'; changed(t('paramSet', { p: t('wolfWidth') })); } }));
        out.push(F.check(t('wrapLabel'), Wf.wrap, { onChange: function (v) { Wf.wrap = !!v; changed(t('paramSet', { p: t('wrapLabel') })); } }));
        out.push(F.range(t('fillDensity'), Wf.fill, { min: 0.05, max: 0.95, step: 0.05, format: pct, onChange: function (v) { Wf.fill = v; changed(t('paramSet', { p: t('fillDensity') })); } }));
        out.push(h('p', { class: 'igs-muted', text: t('wolfRowNote') }));
      } else if (id === 'road') {
        out.push(nf('roadLen', T, 'L', 20, 200, 10, t('cellsUnit')));
        out.push(rng2('density', T, 'density', 0.05, 0.9, 0.01, null, function (v) { return num(v * 100, 0) + ' % · ' + Math.round(v * T.L) + ' ' + t('carsWord'); }));
        out.push(F.choice(t('initCars'), T.init, [['even', t('initEven')], ['random', t('initRandCars')], ['jam', t('initJam')]], { onChange: function (v) { T.init = v; changed(t('paramSet', { p: t('initCars') })); } }));
        out.push(h('p', { class: 'igs-muted', text: t('roadNote') }));
      } else if (id === 'drivers') {
        out.push(rng2('vmax', T, 'vmax', 1, 7, 1, t('cellsPerStep')));
        out.push(h('p', { class: 'igs-muted', text: t('vmaxNote', { k: num(T.vmax * 27, 0) }) }));
        out.push(rng2('brakeP', T, 'p', 0, 0.8, 0.01, null, pct));
        out.push(h('p', { class: 'igs-muted', text: t('brakeNote') }));
      } else if (id === 'light') {
        out.push(nf('greenNS', N, 'gNS', 2, 60, 1, 's')); out.push(nf('greenEW', N, 'gEW', 2, 60, 1, 's')); out.push(nf('allRed', N, 'allRed', 0, 6, 1, 's'));
        out.push(h('p', { class: 'igs-muted', text: t('lightNote', { c: N.gNS + N.gEW + 2 * N.allRed }) }));
        out.push(nf('goalQueue', N, 'goalQueue', 2, 30, 1, t('carsWord'))); out.push(nf('goalSteps', N, 'goalSteps', 50, 2000, 50, 's'));
      } else if (id === 'roadNS' || id === 'roadEW') {
        var key = id === 'roadNS' ? 'dNS' : 'dEW';
        out.push(rng2('density', N, key, 0.02, 0.6, 0.01, null, function (v) { return num(v * 100, 0) + ' % · ' + Math.round(v * (N.L - 1)) + ' ' + t('carsWord'); }));
        out.push(rng2('vmax', N, 'vmax', 1, 5, 1, t('cellsPerStep'))); out.push(rng2('brakeP', N, 'p', 0, 0.6, 0.01, null, pct));
        out.push(h('p', { class: 'igs-muted', text: t('netRoadNote', { n: R.passed ? R.passed[id === 'roadNS' ? 0 : 1] : 0 }) }));
      } else if (id === 'grass') {
        out.push(rng2('regrow', E, 'regrow', 2, 80, 1, t('stepsWord'))); out.push(rng2('grass0', E, 'grass0', 0.1, 1, 0.05, null, pct));
        out.push(F.select(t('ecoSize'), E.w + 'x' + E.h, [[32, 20], [48, 32], [64, 40], [80, 50]].map(function (s) { return [s[0] + 'x' + s[1], s[0] + ' × ' + s[1]]; }), { onChange: function (v) { var p = v.split('x'); E.w = +p[0]; E.h = +p[1]; changed(t('paramSet', { p: t('ecoSize') })); } }));
        out.push(h('p', { class: 'igs-muted', text: t('grassNote') }));
      } else if (id === 'rabbits') {
        out.push(nf('initCount', E, 'rabbits0', 0, 1500, 10)); out.push(rng2('gain', E, 'gainR', 1, 20, 1, t('energyUnit'))); out.push(rng2('repro', E, 'reproR', 0, 0.3, 0.005, null, pct));
        out.push(h('p', { class: 'igs-muted', text: t('rabbitNote') }));
      } else if (id === 'foxes') {
        out.push(nf('initCount', E, 'foxes0', 0, 600, 5)); out.push(rng2('gain', E, 'gainF', 1, 60, 1, t('energyUnit'))); out.push(rng2('repro', E, 'reproF', 0, 0.3, 0.005, null, pct));
        out.push(nf('goalEco', E, 'goal', 50, 5000, 50, t('stepsWord')));
        out.push(h('p', { class: 'igs-muted', text: t('foxNote') }));
      } else if (id === 'prey') {
        out.push(nf('lvA', P, 'a', 0.05, 5, 0.05)); out.push(nf('lvB', P, 'b', 0.001, 2, 0.005)); out.push(nf('lvX0', P, 'x0', 0.1, 1000, 1));
        out.push(h('p', { class: 'igs-muted', text: t('preyNote') }));
      } else if (id === 'pred') {
        out.push(nf('lvC', P, 'c', 0.05, 5, 0.05)); out.push(nf('lvD', P, 'd', 0.001, 2, 0.005)); out.push(nf('lvY0', P, 'y0', 0.1, 1000, 1));
        out.push(h('p', { class: 'igs-muted', text: t('predNote', { x: num(P.c / P.d, 1), y: num(P.a / P.b, 1) }) }));
      } else if (id === 'solver') {
        out.push(F.choice(t('method'), P.method, [['rk4', t('methodRk4')], ['euler', t('methodEuler')]], { onChange: function (v) { P.method = v; changed(t('paramSet', { p: t('method') })); } }));
        out.push(nf('stepH', P, 'h', 0.005, 0.5, 0.005)); out.push(nf('lvT', P, 'T', 1, 500, 1));
        out.push(h('div', { class: 'igs-actions' }, ctx.button(t('solveAll'), { icon: 'play', class: 'igs-primary', onClick: solveAll })));
        out.push(h('p', { class: 'igs-muted', text: t('solverNote') }));
      }
      return out;
    }
    function updateLive() {
      if (chBox) { var cs = challengeStatus(); clearNode(chBox); if (cs) { chBox.dataset.kind = cs.kind === 'ok' ? 'ok' : cs.kind === 'bad' ? 'bad' : ''; chBox.appendChild(h('strong', { text: t('challenge') + ' · ' + t('chTitle_' + S.challenge) })); chBox.appendChild(h('span', { text: t('chGoal_' + S.challenge) + ' ' })); chBox.appendChild(h('span', { class: 'igsim-chstatus', text: cs.text })); } }
      if (liveBox) { clearNode(liveBox); liveBox.appendChild(h('p', { class: 'igs-muted', text: liveText() })); }
      ctx.setSummary(summary());
    }
    function clearNode(n) { while (n.firstChild) n.removeChild(n.firstChild); }
    function lastRow() { return R.data.rows[R.data.rows.length - 1]; }
    function liveText() {
      var m = S.model, r = lastRow();
      if (m === 'life') return t('liveLife', { g: R.gen, p: r[1], b: r[2], d: r[3] });
      if (m === 'wolf') return t('liveWolf', { n: r[0], o: r[1], d: num(r[2] * 100, 0) });
      if (m === 'traffic') return t('liveTraffic', { t: R.t, v: num(r[1], 2), k: num(r[1] * 27, 0), f: num(r[2], 2), s: r[3], j: jams() });
      if (m === 'net') return t('liveNet', { t: R.t, a: num(r[1], 2), b: num(r[2], 2), qa: r[3], qb: r[4], ma: R.maxQ[0], mb: R.maxQ[1], pa: R.passed[0], pb: R.passed[1] });
      if (m === 'eco') return t('liveEco', { t: r[0], g: r[1], r: r[2], f: r[3] });
      var drift = Math.abs(Lib.lvInvariant(S.lv, R.x, R.y) - R.V0) / Math.max(1e-9, Math.abs(R.V0)) * 100;
      return t('liveLv', { t: num(r[0], 2), x: num(r[1], 2), y: num(r[2], 2), e: num(drift, 4) });
    }
    /* Atascos: grupos de coches parados seguidos. */
    function jams() {
      var st = R.cars.filter(function (c) { return c.v === 0; }).map(function (c) { return c.x; }).sort(function (a, b) { return a - b; });
      if (!st.length) return 0; var n = 1;
      for (var i = 1; i < st.length; i++) if (st[i] - st[i - 1] > 2) n++;
      if (st.length > 1 && (st[0] + S.traffic.L - st[st.length - 1]) <= 2) n--;
      return Math.max(1, n);
    }
    function summary() {
      var m = S.model, r = lastRow(), base = t('model_' + m) + '. ';
      if (m === 'life') return base + t('sumLife', { w: S.life.w, h: S.life.h, rule: S.life.rule, g: R.gen, p: r[1], wrap: S.life.wrap ? t('wrapYes') : t('wrapNo') }) + ' ' + t('cursorCell', { x: kc.x + 1, y: kc.y + 1 });
      if (m === 'wolf') return base + t('sumWolf', { r: S.wolf.rule, w: S.wolf.w, n: r[0], d: num(r[2] * 100, 0) });
      if (m === 'traffic') return base + t('sumTraffic', { L: S.traffic.L, n: R.cars.length, t: R.t, v: num(r[1], 2), s: r[3], j: jams() });
      if (m === 'net') return base + t('sumNet', { t: R.t, s: t(lightState(R.t) === 2 ? 'phaseRed' : lightState(R.t) === 0 ? 'phaseNS' : 'phaseEW'), qa: r[3], qb: r[4] });
      if (m === 'eco') return base + t('sumEco', { t: r[0], g: r[1], r: r[2], f: r[3] });
      return base + t('sumLv', { t: num(r[0], 2), x: num(r[1], 1), y: num(r[2], 1), xe: num(S.lv.c / S.lv.d, 1), ye: num(S.lv.a / S.lv.b, 1) });
    }
    function renderAll() { renderStructure(); renderInspector(); draw(); }

    /* ---------- Acciones del documento ---------- */
    function setModel(m) {
      if (MODELS.indexOf(m) < 0 || m === S.model) { renderStructure(); return; }
      stop(); syncLife(false); S.model = m; sel = null; kc = { x: 0, y: 0 };
      if (m === 'life' || m === 'eco') { kc.x = Math.floor((m === 'life' ? S.life.w : S.eco.w) / 2); kc.y = Math.floor((m === 'life' ? S.life.h : S.eco.h) / 2); }
      resetModel(); ctx.commit(t('modelSet', { m: t('model_' + m) })); applyModelTools(); renderAll(); ctx.announce(t('modelSet', { m: t('model_' + m) }));
    }
    function setRule(txtRule) { S.life.rule = txtRule; R.rule = parseRule(txtRule); ctx.commit(t('ruleSet', { r: txtRule })); renderInspector(); draw(); ctx.announce(t('ruleSet', { r: txtRule })); }
    function syncLifeFromRuntime() { if (S.model === 'life' && R.cells) { S.life.cells = Lib.boardToStr(R.cells, S.life.w, S.life.h); S.life.gen = R.gen; } }
    function resizeLife(w, hh) {
      stop(); var L = S.life, n = new Uint8Array(w * hh);
      for (var y = 0; y < Math.min(hh, L.h); y++) for (var x = 0; x < Math.min(w, L.w); x++) n[y * w + x] = R.cells[y * L.w + x];
      L.w = w; L.h = hh; R.cells = n; kc.x = Math.min(kc.x, w - 1); kc.y = Math.min(kc.y, hh - 1);
      lifeEdited(t('gridResized', { w: w, h: hh })); renderAll(); ctx.announce(t('gridResized', { w: w, h: hh }));
    }
    function randomFill() {
      stop(); var rr = rngFor('life-fill'), L = S.life;
      for (var i = 0; i < R.cells.length; i++) R.cells[i] = rr() < L.fill ? 1 : 0;
      lifeEdited(t('filled')); renderInspector(); ctx.announce(t('filled'));
    }
    function clearGrid() { stop(); R.cells.fill(0); lifeEdited(t('cleared')); renderInspector(); ctx.announce(t('cleared')); }
    function newSeed() { S.seed = String(Math.floor(Math.random() * 90000) + 10000); changed(t('seedSet', { s: S.seed })); }
    function solveAll() {
      stop(); var P = S.lv, n = 0;
      while (R.t * P.h < P.T - 1e-9 && n < 200000) { stepModel(); n++; }
      R.halt = null; draw(); updateLive(); ctx.announce(t('solved', { T: num(P.T, 1), n: n }));
    }

    /* ---------- Tabla de datos alternativa al gráfico ---------- */
    var tblDlg = ctx.dialog(t('dataTable'), { wide: true });
    function colLabel(c) { return t('col_' + c); }
    function fmtCell(c, v) { if (c === 'light') return t(v === 2 ? 'phaseRed' : v === 0 ? 'phaseNS' : 'phaseEW'); return typeof v === 'number' ? num(v, Math.abs(v - Math.round(v)) < 1e-9 ? 0 : 3) : String(v); }
    function showTable(trigger) {
      ctx.clear(tblDlg.body);
      var spec = chartSpec(), rows, cols;
      if (spec.phase && S.chart === 'fundamental') { cols = ['fdDensity', 'fdFlow']; rows = spec.pts; }
      else { cols = R.data.cols; rows = R.data.rows; }
      var last = rows.slice(-200), tb = h('tbody');
      last.forEach(function (r) { tb.appendChild(h('tr', null, r.map(function (v, i) { return h(i ? 'td' : 'th', { scope: i ? null : 'row', class: i ? 'igs-numcell' : null, text: fmtCell(cols[i], v) }); }))); });
      tblDlg.body.appendChild(h('p', { class: 'igs-muted', text: rows.length > 200 ? t('tableLast', { n: rows.length }) : t('tableAll', { n: rows.length }) }));
      tblDlg.body.appendChild(h('div', { class: 'igs-table-wrap igsim-tablewrap', tabindex: '0', role: 'region', 'aria-label': spec.title },
        h('table', { class: 'igs-table' }, h('caption', { text: spec.title }), h('thead', null, h('tr', null, cols.map(function (c) { return h('th', { scope: 'col', text: colLabel(c) }); }))), tb)));
      tblDlg.body.appendChild(h('div', { class: 'igs-actions' }, ctx.button(t('exportCsv'), { icon: 'download', onClick: exportCsv })));
      tblDlg.open(trigger);
    }

    /* ---------- Exportaciones ---------- */
    function base(sfx) { return (LANG === 'en' ? 'simulation-' : 'simulacion-') + S.model + '-' + ctx.stamp() + sfx; }
    function csvCell(v) { var s = typeof v === 'number' ? String(Math.round(v * 1e6) / 1e6) : String(v); return /[",;\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
    function exportCsv() {
      var spec = chartSpec(), cols, rows;
      if (spec.phase && S.chart === 'fundamental') { cols = ['fdDensity', 'fdFlow']; rows = spec.pts; } else { cols = R.data.cols; rows = R.data.rows; }
      var lines = [cols.map(function (c) { return csvCell(colLabel(c)); }).join(',')];
      rows.forEach(function (r) { lines.push(r.map(function (v, i) { return csvCell(cols[i] === 'light' ? fmtCell('light', v) : v); }).join(',')); });
      ctx.download(new Blob(['﻿' + lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' }), base('.csv'));
    }
    function offscreen(fn, W, H) { var c = D.createElement('canvas'); c.width = W * 2; c.height = H * 2; var g = c.getContext('2d'); g.scale(2, 2); fn(g, W, H); return c; }
    function exportChartPng() { ctx.canvasBlob(ctx.canvasWithCredit(offscreen(function (g, W, H) { drawChart(g, W, H); }, 900, 540), '#fbfcfe')).then(function (b) { ctx.download(b, base(LANG === 'en' ? '-chart.png' : '-grafico.png')); }); }
    function exportSimPng() { ctx.canvasBlob(ctx.canvasWithCredit(offscreen(function (g, W, H) { drawSim(g, W, H, true); }, 900, 620), '#fbfcfe')).then(function (b) { ctx.download(b, base('.png')); }); }
    function exportRle() {
      syncLifeFromRuntime();
      var L = S.life, cells = S.model === 'life' ? R.cells : Lib.strToBoard(L.cells, L.w, L.h);
      var txtRle = '#N ' + (LANG === 'en' ? 'Iris Green workshop pattern' : 'Patrón del taller de Iris Green') + '\n#C irisgreen.eu\n' + Lib.rleEncode(cells, L.w, L.h, L.rule);
      ctx.download(new Blob([txtRle], { type: 'text/plain;charset=utf-8' }), (LANG === 'en' ? 'life-pattern-' : 'patron-vida-') + ctx.stamp() + '.rle');
    }
    function importRle() {
      ctx.pickFile('.rle,.txt,text/plain').then(function (file) {
        if (!file) return;
        if (file.size > 512 * 1024) { ctx.announce(t('rleTooBig')); return; }
        file.text().then(function (text) {
          var d = Lib.rleDecode(text);
          if (!d || !d.pts.length) { ctx.announce(t('rleBad')); return; }
          if (S.model !== 'life') setModel('life');
          var L = S.life;
          if (d.w > L.w || d.h > L.h) { var fit = SIZES.filter(function (s) { return s[0] >= d.w + 2 && s[1] >= d.h + 2; })[0]; if (!fit) { ctx.announce(t('rleTooLarge')); return; } L.w = fit[0]; L.h = fit[1]; }
          R.cells = new Uint8Array(L.w * L.h);
          var ox = Math.floor((L.w - d.w) / 2), oy = Math.floor((L.h - d.h) / 2);
          d.pts.forEach(function (p) { R.cells[(p[1] + oy) * L.w + p[0] + ox] = 1; });
          if (d.rule && parseRule(d.rule)) { L.rule = ruleText(parseRule(d.rule)); R.rule = parseRule(L.rule); }
          lifeEdited(t('rleLoaded', { n: d.pts.length })); renderAll(); ctx.announce(t('rleLoaded', { n: d.pts.length }));
        });
      });
    }
    ctx.addExport(t('exportCsv'), exportCsv);
    ctx.addExport(t('exportChart'), exportChartPng);
    ctx.addExport(t('exportSim'), exportSimPng);
    ctx.addExport(t('exportRle'), exportRle);
    ctx.addExport(t('importRle'), importRle, 'folder');
    ctx.command('play', t('start') + ' / ' + t('pause'), 'P', togglePlay);
    ctx.command('step', t('step'), '.', function () { advance(1); });
    ctx.command('reset', t('reset'), '', resetRun);
    ctx.command('table', t('dataTable'), '', function () { showTable(null); });
    ctx.command('csv', t('exportCsv'), '', exportCsv);
    ctx.command('rle', t('exportRle'), '', exportRle);
    MODELS.forEach(function (m) { ctx.command('model-' + m, t('model_' + m), t(FAMILY[m]), function () { setModel(m); }); });

    /* ---------- Herramientas (cambian con el modelo) ---------- */
    function syncSpeedSelect() {
      if (!speedSel) return;
      var v = String(S.speed);
      if (!Array.prototype.some.call(speedSel.options, function (o) { return o.value === v; })) speedSel.appendChild(h('option', { value: v, text: t('speedOpt', { s: S.speed }) }));
      speedSel.value = v;
    }
    /* Las herramientas se montan UNA sola vez: el núcleo añade un manejador de teclado
       a la barra en cada ctx.setTools, así que llamarlo otra vez movería el foco dos veces.
       Al cambiar de modelo solo se muestran u ocultan las herramientas de ese modelo. */
    var TOOLS = {
      life: [['draw', 'toolDraw', 'pen'], ['stamp', 'toolStamp', 'star'], ['erase', 'toolErase', 'erase']],
      wolf: [['wdraw', 'toolWolfDraw', 'pen']],
      traffic: [['tselect', 'toolSelect', 'select'], ['addcar', 'toolAddCar', 'plus'], ['removecar', 'toolRemoveCar', 'minus']],
      net: [['nselect', 'toolSelect', 'select']],
      eco: [['eselect', 'toolInspect', 'select'], ['addrabbit', 'toolAddRabbit', 'circle'], ['addfox', 'toolAddFox', 'triangle']],
      lv: [['lvpoint', 'toolStartPoint', 'select']]
    };
    function runClick() { if (stepMode) advance(10); else togglePlay(); }
    function buildTools() {
      var list = [];
      runBtn = ctx.button(t('start'), { icon: 'play', class: 'igs-primary', keys: 'P', onClick: runClick });
      list.push({ node: runBtn });
      list.push({ node: ctx.button(t('step'), { icon: 'redo', keys: '.', onClick: function () { advance(1); } }) });
      list.push({ node: ctx.button(t('reset'), { icon: 'rotate', onClick: resetRun }) });
      list.push({ separator: true });
      MODELS.forEach(function (m) { TOOLS[m].forEach(function (x) { list.push({ id: x[0], label: t(x[1]), icon: x[2] }); }); });
      list.push({ separator: true });
      modelSel = h('select', { 'aria-label': t('modelLabel') });
      MODELS.forEach(function (x) { var o = h('option', { value: x, text: t('model_' + x) }); if (x === S.model) o.selected = true; modelSel.appendChild(o); });
      modelSel.addEventListener('change', function () { setModel(modelSel.value); });
      list.push({ node: h('label', { class: 'igs-inline-select' }, h('span', { text: t('modelShort') }), modelSel) });
      speedSel = h('select', { 'aria-label': t('speed') });
      [1, 2, 3, 4, 5, 6, 8, 10].forEach(function (sp) { var o = h('option', { value: String(sp), text: t('speedOpt', { s: sp }) }); if (sp === S.speed) o.selected = true; speedSel.appendChild(o); });
      speedSel.addEventListener('change', function () { S.speed = +speedSel.value; ctx.commit(t('speedSet', { s: S.speed })); ctx.announce(t('speedSet', { s: S.speed })); if (running) { root.clearTimeout(timer); timer = root.setTimeout(tick, 1000 / S.speed); } });
      speedWrap = h('label', { class: 'igs-inline-select' }, h('span', { text: t('speed') }), speedSel);
      list.push({ node: speedWrap });
      var viewSel = h('select', { 'aria-label': t('viewLabel') });
      [['both', t('viewBoth')], ['sim', t('viewSim')], ['chart', t('viewChart')]].forEach(function (o) { var op = h('option', { value: o[0], text: o[1] }); if (o[0] === view) op.selected = true; viewSel.appendChild(op); });
      viewSel.addEventListener('change', function () { view = viewSel.value; split.dataset.show = view; drawNow(); ctx.announce(viewSel.options[viewSel.selectedIndex].text); });
      list.push({ node: h('label', { class: 'igs-inline-select' }, h('span', { text: t('viewLabel') }), viewSel), level: 'more' });
      ctx.setTools(list, { initial: TOOLS[S.model][0][0] });
      applyModelTools();
    }
    /* Deja visibles solo las herramientas del modelo actual y reparte los números 1-9. */
    function applyModelTools() {
      var cur = TOOLS[S.model].map(function (x) { return x[0]; });
      MODELS.forEach(function (m) {
        TOOLS[m].forEach(function (x) {
          var b = ctx.toolButton(x[0]); if (!b) return;
          var i = cur.indexOf(x[0]);
          b.hidden = i < 0;
          if (i < 0) b.removeAttribute('aria-keyshortcuts'); else b.setAttribute('aria-keyshortcuts', String(i + 1));
        });
      });
      if (speedWrap) speedWrap.hidden = stepMode;
      if (modelSel) modelSel.value = S.model;
      setPlayLabel();
      if (cur.indexOf(ctx.tool()) < 0) ctx.selectTool(cur[0]);
      syncToolbarTabs();
    }
    /* Una sola parada de tabulación en la barra, como pide el patrón ARIA toolbar. */
    function syncToolbarTabs() {
      var items = Array.prototype.filter.call(ctx.toolbar.querySelectorAll('button,select,input'), function (b) { return !b.disabled && b.offsetParent !== null; });
      var active = items.indexOf(D.activeElement);
      items.forEach(function (b, i) { b.tabIndex = i === (active >= 0 ? active : 0) ? 0 : -1; });
    }

    /* ---------- Puntos de partida ---------- */
    function stampAt(key, cx, cy, rot, flip) {
      var L = S.life, pp = patternPoints(key, rot || 0, flip);
      pp.pts.forEach(function (p) { var x = cx + p[0], y = cy + p[1]; if (x >= 0 && y >= 0 && x < L.w && y < L.h) R.cells[y * L.w + x] = 1; });
    }
    function ex(id) {
      stop(true); var keepSeed = S.seed; S = defaults(); S.seed = keepSeed || 'iris'; sel = null;
      if (id === 'glider' || id === 'gun' || id === 'empty') {
        S.model = 'life';
        if (id === 'glider') { S.life.w = 48; S.life.h = 30; S.challenge = 'life'; }
        R.cells = new Uint8Array(S.life.w * S.life.h);
        if (id === 'glider') { stampAt('glider', 3, 3); stampAt('blinker', 30, 8); stampAt('toad', 34, 20); S.life.pattern = 'glider'; }
        if (id === 'gun') { S.life.w = 96; S.life.h = 60; R.cells = new Uint8Array(96 * 60); stampAt('gun', 4, 4); stampAt('block', 80, 50); S.life.pattern = 'gun'; }
        S.life.cells = S.life.start = Lib.boardToStr(R.cells, S.life.w, S.life.h);
        kc = { x: Math.floor(S.life.w / 2), y: Math.floor(S.life.h / 2) };
      } else if (id === 'wolf30' || id === 'wolf90') { S.model = 'wolf'; S.wolf.rule = id === 'wolf30' ? 30 : 90; kc = { x: 60, y: 0 }; }
      else if (id === 'phantom') { S.model = 'traffic'; S.traffic.density = 0.3; S.traffic.p = 0.3; S.traffic.init = 'even'; S.chart = 'time'; kc = { x: 0, y: 0 }; }
      else if (id === 'crossing') { S.model = 'net'; S.challenge = 'net'; }
      else if (id === 'ecobalance') { S.model = 'eco'; S.challenge = 'eco'; kc = { x: 24, y: 16 }; }
      else if (id === 'lvphase') { S.model = 'lv'; S.chart = 'time'; }
      resetModel(); applyModelTools(); renderAll();
    }

    /* ---------- Validación del proyecto ---------- */
    function isNum(v, a, b) { return typeof v === 'number' && isFinite(v) && v >= a && v <= b; }
    function validate(d) {
      try {
        if (!d || MODELS.indexOf(d.model) < 0 || typeof d.seed !== 'string' || d.seed.length > 40 || !isNum(d.speed, 1, 10)) return false;
        if (d.challenge !== null && ['life', 'net', 'eco'].indexOf(d.challenge) < 0) return false;
        if (['time', 'phase', 'fundamental'].indexOf(d.chart) < 0) return false;
        var L = d.life, Wf = d.wolf, T = d.traffic, N = d.net, E = d.eco, P = d.lv;
        if (!L || !SIZES.some(function (s) { return s[0] === L.w && s[1] === L.h; }) || typeof L.wrap !== 'boolean' || !parseRule(L.rule) || !PATTERNS[L.pattern] || [0, 90, 180, 270].indexOf(L.rot) < 0 || !isNum(L.gen, 0, 1e9) || !isNum(L.fill, 0, 1)) return false;
        if (typeof L.cells !== 'string' || L.cells.length > 60000 || !Lib.strToBoard(L.cells, L.w, L.h) || typeof L.start !== 'string' || L.start.length > 60000 || !Lib.strToBoard(L.start, L.w, L.h)) return false;
        if (!Wf || !isNum(Wf.rule, 0, 255) || [61, 101, 121, 181, 241].indexOf(Wf.w) < 0 || ['single', 'random', 'custom'].indexOf(Wf.init) < 0 || typeof Wf.custom !== 'string' || !/^[01]*$/.test(Wf.custom) || Wf.custom.length > 241 || !isNum(Wf.fill, 0, 1)) return false;
        if (!T || !isNum(T.L, 20, 200) || !isNum(T.density, 0, 1) || !isNum(T.vmax, 1, 7) || !isNum(T.p, 0, 1) || ['even', 'random', 'jam'].indexOf(T.init) < 0) return false;
        if (!N || !isNum(N.L, 20, 200) || !isNum(N.dNS, 0, 1) || !isNum(N.dEW, 0, 1) || !isNum(N.vmax, 1, 7) || !isNum(N.p, 0, 1) || !isNum(N.gNS, 1, 600) || !isNum(N.gEW, 1, 600) || !isNum(N.allRed, 0, 60) || !isNum(N.goalQueue, 1, 200) || !isNum(N.goalSteps, 1, 1e5)) return false;
        if (!E || !isNum(E.w, 8, 200) || !isNum(E.h, 8, 200) || !isNum(E.grass0, 0, 1) || !isNum(E.regrow, 1, 1000) || !isNum(E.rabbits0, 0, 3000) || !isNum(E.foxes0, 0, 1200) || !isNum(E.gainR, 0, 1000) || !isNum(E.gainF, 0, 1000) || !isNum(E.reproR, 0, 1) || !isNum(E.reproF, 0, 1) || !isNum(E.goal, 1, 1e6)) return false;
        if (!P || !isNum(P.a, 0, 100) || !isNum(P.b, 0, 100) || !isNum(P.c, 0, 100) || !isNum(P.d, 0, 100) || !isNum(P.x0, 0, 1e6) || !isNum(P.y0, 0, 1e6) || !isNum(P.h, 1e-4, 10) || ['rk4', 'euler'].indexOf(P.method) < 0 || !isNum(P.T, 0.1, 1e5)) return false;
        return true;
      } catch (_) { return false; }
    }

    resetModel(); buildTools(); renderAll();
    return {
      serialize: function () { syncLifeFromRuntime(); return clone(S); },
      validate: validate,
      restore: function (st) {
        stop(true); var prevModel = S.model; S = clone(st); if (sel && (sel.indexOf('car:') === 0 || !elementsOf(S.model).some(function (e) { return e[0] === sel; }))) sel = null;
        resetModel(); if (prevModel !== S.model) applyModelTools(); renderAll();
      },
      start: function (id) { ex(id); },
      onTool: function (id) { tool = id; draw(); },
      onKey: onKey
    };
  }
})(window);
