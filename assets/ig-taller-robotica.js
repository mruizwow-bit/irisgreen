/* Iris Green · El taller · Estudio de robótica: robots con motores y sensores en un escenario, programados
   con el mismo lenguaje propio que el estudio de programación. Distancias en centímetros. */
(function (window, document) {
  'use strict';
  var T = window.IGT, K = window.IGTCode; if (!T || !K) return;
  var t = T.t, h = T.h;
  var R = 8; /* radio del robot (cm) */

  var COMMANDS = [
    { id: 'fd', es: ['avanzar'], en: ['forward', 'fd'], args: 1, defaults: [20], argEs: ['centímetros'], argEn: ['centimetres'], units: ['cm'], unitsEn: ['cm'] },
    { id: 'bk', es: ['retroceder'], en: ['back', 'bk'], args: 1, defaults: [10], argEs: ['centímetros'], argEn: ['centimetres'], units: ['cm'], unitsEn: ['cm'] },
    { id: 'rt', es: ['derecha', 'girar'], en: ['right', 'rt'], args: 1, defaults: [90], argEs: ['grados'], argEn: ['degrees'], units: ['°'], unitsEn: ['°'] },
    { id: 'lt', es: ['izquierda'], en: ['left', 'lt'], args: 1, defaults: [90], argEs: ['grados'], argEn: ['degrees'], units: ['°'], unitsEn: ['°'] },
    { id: 'wait', es: ['esperar'], en: ['wait'], args: 1, defaults: [10], argEs: ['pasos'], argEn: ['steps'], units: ['pasos'], unitsEn: ['steps'] }
  ];
  var SENSORS = [
    { id: 'dist', es: ['distancia'], en: ['distance'], args: 0 },
    { id: 'distL', es: ['distancia_izq'], en: ['distance_left'], args: 0 },
    { id: 'distR', es: ['distancia_der'], en: ['distance_right'], args: 0 },
    { id: 'line', es: ['linea', 'línea'], en: ['line'], args: 0 },
    { id: 'lineL', es: ['linea_izq', 'línea_izq'], en: ['line_left'], args: 0 },
    { id: 'lineR', es: ['linea_der', 'línea_der'], en: ['line_right'], args: 0 },
    { id: 'bump', es: ['tocando'], en: ['bumped'], args: 0 },
    { id: 'goal', es: ['en_meta'], en: ['at_goal'], args: 0 },
    { id: 'heading', es: ['direccion', 'dirección'], en: ['heading'], args: 0 }
  ];

  /* ---------- Geometría ---------- */
  function segDist(px, py, s) {
    var dx = s[2] - s[0], dy = s[3] - s[1], L2 = dx * dx + dy * dy, r = L2 ? Math.max(0, Math.min(1, ((px - s[0]) * dx + (py - s[1]) * dy) / L2)) : 0;
    return Math.hypot(s[0] + r * dx - px, s[1] + r * dy - py);
  }
  function raySeg(ox, oy, dx, dy, s) {
    var ex = s[2] - s[0], ey = s[3] - s[1], den = dx * ey - dy * ex; if (Math.abs(den) < 1e-12) return Infinity;
    var tt = ((s[0] - ox) * ey - (s[1] - oy) * ex) / den, u = ((s[0] - ox) * dy - (s[1] - oy) * dx) / den;
    return tt >= 0 && u >= 0 && u <= 1 ? tt : Infinity;
  }
  function rayCircle(ox, oy, dx, dy, cx, cy, r) {
    var fx = ox - cx, fy = oy - cy, b = fx * dx + fy * dy, c = fx * fx + fy * fy - r * r, disc = b * b - c;
    if (disc < 0) return Infinity; var tt = -b - Math.sqrt(disc); return tt >= 0 ? tt : Infinity;
  }

  /* ---------- Escenarios ---------- */
  function box(w, hh) { return [[0, 0, w, 0], [w, 0, w, hh], [w, hh, 0, hh], [0, hh, 0, 0]]; }
  function maze(cols, rows, cell, seed) {
    var rnd = T.rng(seed), vis = [], walls = [], i, j;
    for (i = 0; i < cols; i++) { vis.push([]); for (j = 0; j < rows; j++) vis[i].push(false); }
    var right = [], up = [];
    for (i = 0; i < cols; i++) { right.push([]); up.push([]); for (j = 0; j < rows; j++) { right[i].push(true); up[i].push(true); } }
    var stack = [[0, 0]]; vis[0][0] = true;
    while (stack.length) {
      var cur = stack[stack.length - 1], x = cur[0], y = cur[1], nb = [];
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var nx = x + d[0], ny = y + d[1]; if (nx >= 0 && ny >= 0 && nx < cols && ny < rows && !vis[nx][ny]) nb.push([nx, ny, d]); });
      if (!nb.length) { stack.pop(); continue; }
      var pick = nb[Math.floor(rnd() * nb.length)], d2 = pick[2];
      if (d2[0] === 1) right[x][y] = false; if (d2[0] === -1) right[x - 1][y] = false; if (d2[1] === 1) up[x][y] = false; if (d2[1] === -1) up[x][y - 1] = false;
      vis[pick[0]][pick[1]] = true; stack.push([pick[0], pick[1]]);
    }
    for (i = 0; i < cols; i++) for (j = 0; j < rows; j++) {
      if (right[i][j] && i < cols - 1) walls.push([(i + 1) * cell, j * cell, (i + 1) * cell, (j + 1) * cell]);
      if (up[i][j] && j < rows - 1) walls.push([i * cell, (j + 1) * cell, (i + 1) * cell, (j + 1) * cell]);
    }
    return { w: cols * cell, h: rows * cell, walls: box(cols * cell, rows * cell).concat(walls), robots: [{ x: cell / 2, y: cell / 2, hd: 0 }],
      goals: [{ x: (cols - 1) * cell + 3, y: (rows - 1) * cell + 3, w: cell - 6, h: cell - 6, r: 0 }], cell: cell };
  }
  function curvePath(variant) {
    var pts = [], m = variant % 2 ? -1 : 1;
    for (var i = 0; i <= 60; i++) { var x = 20 + i * 3.3; pts.push([x, 80 + m * 45 * Math.sin((x - 20) / 200 * Math.PI * (1 + (variant % 3) * 0.25))]); }
    return pts;
  }
  function wavyPath(variant) {
    var pts = [[20, 20]], m = variant % 2;
    for (var i = 1; i <= 90; i++) { var s = i / 90, x = 20 + s * 200, y = 20 + s * 110 + 28 * Math.sin(s * Math.PI * (3 + m)); pts.push([x, y]); }
    return pts;
  }
  function withLine(pts, w, hh) {
    var a = pts[0], b = pts[1], hd = Math.atan2(b[0] - a[0], b[1] - a[1]) * 180 / Math.PI, e = pts[pts.length - 1];
    return { w: w, h: hh, walls: box(w, hh), line: pts, robots: [{ x: a[0], y: a[1], hd: hd }], goals: [{ x: e[0] - 9, y: e[1] - 9, w: 18, h: 18, r: 0 }] };
  }
  var SCENES = {
    room: function () {
      var w = 240, hh = 160;
      return { w: w, h: hh, walls: box(w, hh).concat([[0, 110, 150, 110], [190, 110, 240, 110], [150, 110, 150, 130]]),
        robots: [{ x: 30, y: 30, hd: 0 }], goals: [{ x: 190, y: 125, w: 45, h: 30, r: 0 }] };
    },
    park: function (v) { var d = 40 + (v * 37) % 120; return { w: 240, h: 80, walls: box(240, 80), robots: [{ x: 240 - R - d, y: 40, hd: 90 }], goals: [{ x: 240 - 2 * R - 7, y: 25, w: 2 * R + 6, h: 30, r: 0 }], park: true }; },
    curve: function (v) { return withLine(curvePath(v), 240, 160); },
    wavy: function (v) { return withLine(wavyPath(v), 240, 160); },
    known: function () { return maze(6, 4, 40, 7); },
    unknown: function (v) { return maze(6, 4, 40, 1000 + v * 7919); },
    big: function (v) { return maze(10, 7, 30, 5000 + v * 104729); },
    corridor: function () {
      var w = 240, hh = 90;
      return { w: w, h: hh, walls: box(w, hh).concat([[0, 30, 100, 30], [140, 30, 240, 30], [0, 60, 240, 60]]).concat([[100, 0, 100, 30], [140, 0, 140, 30]]),
        robots: [{ x: 15, y: 45, hd: 90 }, { x: 225, y: 45, hd: 270 }], goals: [{ x: 210, y: 33, w: 27, h: 24, r: 0 }, { x: 3, y: 33, w: 27, h: 24, r: 1 }], multi: true };
    },
    meet: function (v) {
      var w = 240, hh = 160;
      return { w: w, h: hh, walls: box(w, hh).concat([[80, 0, 80, 60], [160, 100, 160, 160]]),
        robots: [{ x: 20, y: 20, hd: 0 }, { x: 220, y: 140, hd: 180 }], goals: [{ x: 100, y: 60, w: 40, h: 40, r: null }], multi: true, meet: true };
    }
  };

  /* ---------- Mundo ---------- */
  function World(sc) {
    this.sc = sc; var self = this;
    this.bots = sc.robots.map(function (r, i) { return { x: r.x, y: r.y, hd: r.hd, bump: false, bumps: 0, trail: [[r.x, r.y]], moved: 0, idx: i }; });
    this.steps = 0;
    this.collide = function (b, x, y) {
      for (var i = 0; i < sc.walls.length; i++) if (segDist(x, y, sc.walls[i]) < R) return true;
      for (var j = 0; j < self.bots.length; j++) { var o = self.bots[j]; if (o !== b && Math.hypot(o.x - x, o.y - y) < 2 * R) return true; }
      return false;
    };
  }
  World.prototype.onLine = function (x, y) {
    var L = this.sc.line; if (!L) return false;
    for (var i = 0; i < L.length - 1; i++) if (segDist(x, y, [L[i][0], L[i][1], L[i + 1][0], L[i + 1][1]]) <= 1.6) return true;
    return false;
  };
  World.prototype.sensorPos = function (b, lat) {
    var r = b.hd * Math.PI / 180, fx = b.x + Math.sin(r) * (R - 2), fy = b.y + Math.cos(r) * (R - 2);
    return [fx + Math.cos(r) * lat, fy - Math.sin(r) * lat];
  };
  World.prototype.distance = function (b, rel) {
    var r = (b.hd + (rel || 0)) * Math.PI / 180, dx = Math.sin(r), dy = Math.cos(r), best = Infinity, sc = this.sc;
    sc.walls.forEach(function (s) { best = Math.min(best, raySeg(b.x, b.y, dx, dy, s)); });
    this.bots.forEach(function (o) { if (o !== b) best = Math.min(best, rayCircle(b.x, b.y, dx, dy, o.x, o.y, R)); });
    return Math.max(0, Math.min(300, Math.round((best - R) * 10) / 10));
  };
  World.prototype.atGoal = function (b) {
    return this.sc.goals.some(function (g) { return (g.r === null || g.r === b.idx) && b.x >= g.x && b.x <= g.x + g.w && b.y >= g.y && b.y <= g.y + g.h; });
  };
  World.prototype.host = function (b, onMove) {
    var W = this;
    return {
      exec: function (id, a) {
        var v = a[0]; if (typeof v !== 'number' || !isFinite(v)) throw { msg: t('cErrNotNumber') };
        if (Math.abs(v) > 5000) throw { msg: t('rErrTooFar') };
        return (function* () {
          if (id === 'fd' || id === 'bk') {
            var dir = (id === 'fd' ? 1 : -1) * (v < 0 ? -1 : 1), left = Math.abs(v); b.bump = false;
            while (left > 1e-9) {
              var st = Math.min(1, left), r = b.hd * Math.PI / 180, nx = b.x + Math.sin(r) * st * dir, ny = b.y + Math.cos(r) * st * dir;
              W.steps++; if (W.steps > 60000) throw { msg: t('rErrTooLong') };
              if (W.collide(b, nx, ny)) { b.bump = true; b.bumps++; onMove(b, 'bump'); yield { soft: false }; return; }
              b.x = nx; b.y = ny; b.moved += st; left -= st; if (b.trail.length < 20000) b.trail.push([nx, ny]);
              onMove(b); yield { soft: false };
            }
          } else if (id === 'wait') {
            var n = Math.min(10000, Math.max(0, Math.round(v)));
            for (var k = 0; k < n; k++) { W.steps++; if (W.steps > 60000) throw { msg: t('rErrTooLong') }; yield { soft: false }; }
          } else {
            var sgn = (id === 'rt' ? 1 : -1) * (v < 0 ? -1 : 1), rem = Math.abs(v);
            while (rem > 1e-9) { var d = Math.min(5, rem); b.hd = ((b.hd + sgn * d) % 360 + 360) % 360; rem -= d; W.steps++; if (W.steps > 60000) throw { msg: t('rErrTooLong') }; onMove(b); yield { soft: false }; }
          }
        })();
      },
      sensor: function (id) {
        switch (id) {
          case 'dist': return W.distance(b, 0);
          case 'distL': return W.distance(b, -90);
          case 'distR': return W.distance(b, 90);
          case 'line': var p = W.sensorPos(b, 0); return W.onLine(p[0], p[1]);
          case 'lineL': var pl = W.sensorPos(b, -2.5); return W.onLine(pl[0], pl[1]);
          case 'lineR': var pr = W.sensorPos(b, 2.5); return W.onLine(pr[0], pr[1]);
          case 'bump': return b.bump;
          case 'goal': return W.atGoal(b);
          case 'heading': return Math.round(b.hd);
        }
        return 0;
      },
      print: function () {}, random: Math.random
    };
  };

  T.ready(function () {
    var app = T.mount(); if (!app || app.getAttribute('data-studio') !== 'robotica') return;
    var spec = new K.Spec({ commands: COMMANDS, sensors: SENSORS });
    var CH = T.dict.challenges || [];
    var sceneKey = 'room', variant = 0, world = null, logs = [[], []];
    var progs = [[], []], active = 0, title = '';
    var editor;
    var history = new T.History(function () { progs[active] = editor ? editor.snapshot() : progs[active]; return { progs: progs, active: active, title: title }; },
      function (s) { progs = s.progs; active = s.active; editor.set(progs[active]); syncTabs(); },
      function () { if (bar) bar.sync(); });

    var retos = T.challenges({ items: CH, onPick: onPick });
    var bar = T.projectBar({ studio: 'robotica', history: history,
      getData: function () { progs[active] = editor.get() || editor.snapshot(); return { texts: progs.map(function (p) { return K.toText(p, spec); }), scene: sceneKey, title: title }; },
      getTitle: function () { return title; },
      onPrint: function () { progs[active] = editor.snapshot(); printCode.textContent = (title ? title + '\n\n' : '') + progs.map(function (p, i) { return (world && world.sc.multi ? (i ? 'Robot B' : 'Robot A') + '\n' : '') + K.toText(p, spec); }).filter(function (x, i) { return i === 0 || (world && world.sc.multi); }).join('\n\n'); },
      onNew: function () { progs = [[], []]; active = 0; editor.set([]); syncTabs(); history.reset(); T.markClean(); resetWorld(); T.say(t('rNewDone')); },
      onOpen: function (d) {
        if (!d || !Array.isArray(d.texts)) throw new Error('bad');
        var np = d.texts.slice(0, 2).map(function (tx) { var r = K.parse(String(tx).slice(0, 50000), spec); if (!r.ok) throw new Error('bad'); return r.stmts; });
        while (np.length < 2) np.push([]);
        progs = np; active = 0; title = String(d.title || '').slice(0, 80);
        if (SCENES[d.scene]) sceneKey = d.scene;
        editor.set(progs[0]); syncTabs(); history.reset(); resetWorld();
      } });

    editor = new K.Editor({ spec: spec, history: history, idPrefix: 'igt-r', snapshot: function () { return history.snapshot(); }, defaultCond: 'distancia() > 10' });
    var tabs = h('div', { class: 'igt-tabs', role: 'group', 'aria-label': t('rRobots') });
    var tabBtns = [T.btn(t('rRobotA'), { cls: 'igt-chip', pressed: true, onClick: function () { switchRobot(0); } }), T.btn(t('rRobotB'), { cls: 'igt-chip', pressed: false, onClick: function () { switchRobot(1); } })];
    tabBtns.forEach(function (b) { tabs.appendChild(b); });
    function switchRobot(i) { var p = editor.get(); if (!p) return; progs[active] = p; active = i; editor.set(progs[i]); syncTabs(); T.say(i ? t('rRobotB') : t('rRobotA')); }
    function syncTabs() { var multi = world && world.sc.multi; tabs.hidden = !multi; tabBtns.forEach(function (b, i) { T.press(b, i === active); }); if (!multi && active) { active = 0; editor.set(progs[0]); } }

    var canvas = h('canvas', { class: 'igt-arena', role: 'img', 'aria-label': t('rCanvasLabel'), 'aria-describedby': 'igt-r-alt' });
    var box = h('div', { class: 'igt-canvas-box' }, canvas);
    var errBox = h('p', { class: 'igt-err', hidden: true, role: 'alert' });
    var resBox = h('div', { 'aria-live': 'polite' });
    var altBox = h('div', { class: 'igt-alt', id: 'igt-r-alt' });
    var sensorsOut = h('p', { class: 'igt-visible-status' });
    var trailChk = h('input', { type: 'checkbox', id: 'igt-r-trail', checked: true });
    var variantBtn = T.btn(t('rNewVariant'), { icon: 'reiniciar', onClick: function () { variant += 1; resetWorld(); T.say(t('rVariantDone')); } });
    var logList = h('ol', { class: 'igt-log', 'aria-label': t('pOutput') });
    function addLog(x) { if (logList.childNodes.length < 300) logList.appendChild(h('li', { text: x })); }
    var runner = new K.Runner({ idPrefix: 'igt-r',
      make: function () {
        var p = editor.get(); if (!p) return null; progs[active] = p;
        resetWorld(); errBox.hidden = true; T.clear(resBox); T.clear(logList);
        return combined(world, progs);
      },
      onStep: function (node) { editor.highlight(node && node._r === active ? node.id : null); },
      onFrame: draw,
      onReset: function () { resetWorld(); errBox.hidden = true; T.clear(resBox); },
      onDone: function (err) {
        draw();
        if (err) { errBox.hidden = false; errBox.textContent = t('cRunErr', { m: err.msg, line: err.node && err.node.line ? err.node.line : '—' }); T.say(errBox.textContent); }
        report(err);
      } });
    function combined(W, ps) {
      var its = W.bots.map(function (b, i) {
        (function mark(list) { list.forEach(function (s) { s._r = i; if (s.body) mark(s.body); if (s.els) mark(s.els); }); })(ps[i]);
        var hs = W.host(b, function () {});
        hs.print = function (x) { addLog((W.sc.multi ? (i ? 'B: ' : 'A: ') : '') + x); };
        return new K.Interp(ps[i], spec, hs, { steps: 300000 });
      });
      var done = its.map(function () { return false; });
      return { next: function () {
        for (;;) {
          if (done.every(Boolean)) return { done: true };
          var out = null;
          for (var i = 0; i < its.length; i++) {
            if (done[i]) continue;
            var r = its[i].next();
            if (r.done) { done[i] = true; continue; }
            if (!out || (r.value && r.value.node)) out = r.value;
          }
          if (out) return { done: false, value: out };
        }
      } };
    }
    var stage = h('div', { class: 'igt-stage glass' }, runner.el, box, sensorsOut,
      h('div', { class: 'igt-bar' }, h('label', { class: 'igt-check', for: 'igt-r-trail' }, trailChk, t('rTrail')), variantBtn), errBox, resBox,
      h('h3', { class: 'igt-h3', text: t('pOutput') }), logList);
    var titleIn = h('input', { type: 'text', id: 'igt-r-title', maxlength: 80, autocomplete: 'off' });
    titleIn.addEventListener('change', function () { title = titleIn.value.trim(); T.markDirty(); });
    var sensorsHelp = h('details', { class: 'igt-keys' }, h('summary', { text: t('rSensorsTitle') }),
      h('dl', null, SENSORS.map(function (s) { return [h('dt', { class: 'igt-code', text: (T.lang === 'en' ? s.en : s.es)[0] + '()' }), h('dd', { text: t('rSensor_' + s.id) })]; })));
    var side = h('div', { class: 'igt-side glass' }, h('h3', { text: t('rProgram') }), tabs, editor.el, sensorsHelp,
      h('label', { class: 'igt-field', for: 'igt-r-title' }, t('pTitle'), titleIn));
    app.appendChild(retos);
    app.appendChild(h('div', { class: 'igt-topbar glass' }, bar));
    var printCode = h('pre', { class: 'igt-print-only igt-print-keep igt-code', 'aria-hidden': 'true' });
    app.appendChild(h('div', { class: 'igt-work wide-side igt-print-keep' }, stage, side));
    altBox.classList.add('igt-print-keep');
    app.appendChild(altBox);
    app.appendChild(printCode);
    trailChk.addEventListener('change', draw);
    history.bindKeys(document);

    function resetWorld() { world = new World(SCENES[sceneKey](variant)); syncTabs(); variantBtn.hidden = !/park|curve|wavy|unknown|big/.test(sceneKey); resize(); }

    /* Dibujo del escenario */
    var ctx, dispW = 600, dispH = 400;
    function resize() {
      var sc = world.sc, w = Math.max(240, box.clientWidth || 600);
      dispW = w; dispH = Math.round(w * sc.h / sc.w); ctx = T.fitCanvas(canvas, dispW, dispH); canvas.style.height = dispH + 'px'; draw();
    }
    function draw() {
      if (!ctx || !world) return;
      var c = ctx, sc = world.sc, s = dispW / sc.w;
      function X(x) { return x * s; } function Y(y) { return dispH - y * s; }
      c.fillStyle = '#f6f3ec'; c.fillRect(0, 0, dispW, dispH);
      c.strokeStyle = 'rgba(23,57,92,.06)'; c.lineWidth = 1; c.beginPath();
      for (var gx = 0; gx <= sc.w; gx += 10) { c.moveTo(X(gx), 0); c.lineTo(X(gx), dispH); } for (var gy = 0; gy <= sc.h; gy += 10) { c.moveTo(0, Y(gy)); c.lineTo(dispW, Y(gy)); } c.stroke();
      sc.goals.forEach(function (g) {
        c.fillStyle = 'rgba(46,125,79,.18)'; c.fillRect(X(g.x), Y(g.y + g.h), g.w * s, g.h * s);
        c.save(); c.beginPath(); c.rect(X(g.x), Y(g.y + g.h), g.w * s, g.h * s); c.clip(); c.strokeStyle = 'rgba(46,125,79,.45)'; c.lineWidth = 2;
        for (var k = -g.h; k < g.w + g.h; k += 6) { c.moveTo(X(g.x + k), Y(g.y)); c.lineTo(X(g.x + k + g.h), Y(g.y + g.h)); } c.stroke(); c.restore();
        c.strokeStyle = '#2e7d4f'; c.lineWidth = 2; c.strokeRect(X(g.x), Y(g.y + g.h), g.w * s, g.h * s);
        c.fillStyle = '#1d5234'; c.font = '700 ' + Math.min(15, Math.max(10, Math.round(4.2 * s))) + 'px Atkinson Hyperlegible, Arial'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText(g.r === null ? t('rMeet') : sc.multi ? t('rGoalN', { n: g.r ? 'B' : 'A' }) : t('rGoal'), X(g.x + g.w / 2), Y(g.y + g.h / 2));
      });
      if (sc.line) { c.strokeStyle = '#1b1b1f'; c.lineWidth = 3 * s; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); sc.line.forEach(function (p, i) { if (i) c.lineTo(X(p[0]), Y(p[1])); else c.moveTo(X(p[0]), Y(p[1])); }); c.stroke(); }
      c.strokeStyle = '#34404f'; c.lineWidth = Math.max(3, 2.2 * s); c.lineCap = 'round'; c.beginPath(); sc.walls.forEach(function (w) { c.moveTo(X(w[0]), Y(w[1])); c.lineTo(X(w[2]), Y(w[3])); }); c.stroke();
      world.bots.forEach(function (b, i) {
        var col = i ? '#a8336f' : '#1f5f8b';
        if (trailChk.checked && b.trail.length > 1) { c.strokeStyle = i ? 'rgba(168,51,111,.35)' : 'rgba(31,95,139,.35)'; c.lineWidth = 2; c.beginPath(); b.trail.forEach(function (p, j) { if (j) c.lineTo(X(p[0]), Y(p[1])); else c.moveTo(X(p[0]), Y(p[1])); }); c.stroke(); }
        c.fillStyle = col; c.strokeStyle = b.bump ? '#b3261e' : '#ffffff'; c.lineWidth = b.bump ? 3 : 2;
        c.beginPath(); c.arc(X(b.x), Y(b.y), R * s, 0, Math.PI * 2); c.fill(); c.stroke();
        var r = b.hd * Math.PI / 180; c.strokeStyle = '#ffffff'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(X(b.x), Y(b.y)); c.lineTo(X(b.x + Math.sin(r) * R * 0.9), Y(b.y + Math.cos(r) * R * 0.9)); c.stroke();
        [-2.5, 0, 2.5].forEach(function (lat) { var p = world.sensorPos(b, lat); c.fillStyle = world.onLine(p[0], p[1]) ? '#f2c14e' : '#ffffff'; c.beginPath(); c.arc(X(p[0]), Y(p[1]), Math.max(1.5, 0.9 * s), 0, Math.PI * 2); c.fill(); });
        if (sc.multi) { c.fillStyle = '#fff'; c.font = '700 ' + Math.max(9, Math.round(7 * s)) + 'px Atkinson Hyperlegible, Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(i ? 'B' : 'A', X(b.x - Math.sin(r) * 3), Y(b.y - Math.cos(r) * 3)); }
      });
      describe();
    }
    function describe() {
      var sc = world.sc;
      T.clear(altBox);
      altBox.appendChild(h('h3', { text: t('rAltTitle') }));
      altBox.appendChild(h('p', { text: t('rAltScene_' + sceneKey, { w: sc.w, h: sc.h }) }));
      world.bots.forEach(function (b, i) {
        var hs = world.host(b, function () {});
        altBox.appendChild(h('p', { class: 'igt-note', text: t('rAltBot', { r: sc.multi ? (i ? 'B' : 'A') : '', x: Math.round(b.x), y: Math.round(b.y), hd: Math.round(b.hd), d: T.num(hs.sensor('dist'), 1),
          line: hs.sensor('line') ? t('yes') : t('no'), goal: hs.sensor('goal') ? t('yes') : t('no'), bumps: b.bumps }) }));
      });
      var b0 = world.bots[active] || world.bots[0], h0 = world.host(b0, function () {});
      sensorsOut.textContent = t('rSensorsNow', { d: T.num(h0.sensor('dist'), 1), l: h0.sensor('lineL') ? t('yes') : t('no'), c: h0.sensor('line') ? t('yes') : t('no'), r: h0.sensor('lineR') ? t('yes') : t('no'), g: h0.sensor('goal') ? t('yes') : t('no') });
    }

    /* Comprobación */
    function evaluate(W) {
      var sc = W.sc, bots = W.bots;
      if (sc.park) { var b = bots[0], d = W.distance(b, 0); return { ok: d >= 1 && d <= 6 && b.bumps === 0, d: d, bumps: b.bumps }; }
      if (sc.meet) { var both = bots.every(function (x) { return W.atGoal(x); }); return { ok: both && bots.every(function (x) { return x.bumps === 0; }), bumps: bots[0].bumps + bots[1].bumps }; }
      var all = bots.every(function (x) { return W.atGoal(x); }), bumps = bots.reduce(function (a, x) { return a + x.bumps; }, 0);
      return { ok: all, bumps: bumps, dist: Math.round(bots.reduce(function (a, x) { return a + x.moved; }, 0)) };
    }
    function report(err) {
      var ch = retos.current(), res = evaluate(world);
      T.clear(resBox);
      var msg;
      if (world.sc.park) msg = res.ok ? t('rParkOk', { d: T.num(res.d, 1) }) : t('rParkNo', { d: T.num(res.d, 1), b: res.bumps });
      else msg = res.ok ? t('rGoalOk', { d: res.dist || 0, b: res.bumps }) : t('rGoalNo', { b: res.bumps });
      resBox.appendChild(T.result(res.ok && !err, msg));
      if (res.ok && !err && (sceneKey === 'big' || sceneKey === 'unknown') && res.dist) {
        var k = sceneKey + ':' + variant, prev = bests[k];
        if (prev === undefined || res.dist < prev) bests[k] = res.dist;
        resBox.appendChild(h('p', { class: 'igt-note', text: t('rBest', { d: bests[k] }) }));
      }
      if (ch && ch.variants && res.ok && !err) resBox.appendChild(h('div', { class: 'igt-bar' }, T.btn(t('rTryAll', { n: ch.variants }), { cls: 'primary', onClick: function () { tryVariants(ch.variants); } })));
      T.say(msg);
    }
    var bests = {};
    function tryVariants(n) {
      var p = editor.get(); if (!p) return; progs[active] = p;
      var ok = 0, lines = [];
      for (var v = 0; v < n; v++) {
        var W = new World(SCENES[sceneKey](variant + 1 + v)), it = combined(W, progs), err = null;
        try { var guard = 0; while (!it.next().done) { guard++; if (guard > 400000) throw { msg: t('rErrTooLong') }; } } catch (e) { err = e; }
        var r = evaluate(W); if (r.ok && !err) ok++;
        lines.push(t('rVariantLine', { n: v + 1, r: r.ok && !err ? t('rVarOk') : t('rVarNo') }));
      }
      T.clear(resBox);
      resBox.appendChild(T.result(ok === n, ok === n ? t('rAllOk', { n: n }) : t('rSomeOk', { ok: ok, n: n })));
      resBox.appendChild(h('ul', { class: 'igt-limits' }, lines.map(function (l) { return h('li', { text: l }); })));
      T.say(ok === n ? t('rAllOk', { n: n }) : t('rSomeOk', { ok: ok, n: n }));
    }
    function onPick(ch) {
      var key = ch ? ch.scene : 'room';
      runner.stop(); sceneKey = SCENES[key] ? key : 'room'; variant = 0; resetWorld(); T.clear(resBox); errBox.hidden = true;
      return null;
    }
    if (window.ResizeObserver) new ResizeObserver(function () { if (Math.abs(box.clientWidth - dispW) > 2) resize(); }).observe(box);
    resetWorld();
    editor.setText(t('rStarter'));
  });

  window.IGTRobot = { SCENES: SCENES, World: World, COMMANDS: COMMANDS, SENSORS: SENSORS };
})(window, document);
