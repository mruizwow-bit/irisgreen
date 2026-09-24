/* Iris Green · El taller · Estudio de programación: una tortuga que dibuja con el lenguaje propio del Taller. */
(function (window, document) {
  'use strict';
  var T = window.IGT, K = window.IGTCode; if (!T || !K) return;
  var t = T.t, h = T.h;

  var COLORS = { negro: '#17202a', black: '#17202a', azul: '#1f5f8b', blue: '#1f5f8b', rojo: '#c0392b', red: '#c0392b', verde: '#2e7d4f', green: '#2e7d4f',
    naranja: '#e07b24', orange: '#e07b24', violeta: '#5a49a8', morado: '#5a49a8', purple: '#5a49a8', violet: '#5a49a8', rosa: '#a8336f', pink: '#a8336f',
    amarillo: '#d9a404', yellow: '#d9a404', gris: '#7b8794', grey: '#7b8794', gray: '#7b8794', marron: '#8d5b3a', 'marrón': '#8d5b3a', brown: '#8d5b3a', turquesa: '#1f7a8c', teal: '#1f7a8c' };
  var COMMANDS = [
    { id: 'fd', es: ['avanzar'], en: ['forward', 'fd'], args: 1, defaults: [100], argEs: ['pasos'], argEn: ['steps'] },
    { id: 'bk', es: ['retroceder'], en: ['back', 'bk'], args: 1, defaults: [50], argEs: ['pasos'], argEn: ['steps'] },
    { id: 'rt', es: ['derecha', 'girar'], en: ['right', 'rt'], args: 1, defaults: [90], argEs: ['grados'], argEn: ['degrees'], units: ['°'], unitsEn: ['°'] },
    { id: 'lt', es: ['izquierda'], en: ['left', 'lt'], args: 1, defaults: [90], argEs: ['grados'], argEn: ['degrees'], units: ['°'], unitsEn: ['°'] },
    { id: 'pu', es: ['subir_lapiz'], en: ['penup', 'pu'], args: 0 },
    { id: 'pd', es: ['bajar_lapiz'], en: ['pendown', 'pd'], args: 0 },
    { id: 'color', es: ['color'], en: ['colour', 'color'], args: 1, defaults: ['"azul"'], argEs: ['color'], argEn: ['colour'] },
    { id: 'width', es: ['grosor'], en: ['width'], args: 1, defaults: [3], argEs: ['grosor'], argEn: ['width'] },
    { id: 'goto', es: ['ir_a'], en: ['goto'], args: 2, defaults: [0, 0], argEs: ['x', 'y'], argEn: ['x', 'y'] },
    { id: 'seth', es: ['rumbo'], en: ['setheading', 'seth'], args: 1, defaults: [0], argEs: ['grados'], argEn: ['degrees'], units: ['°'], unitsEn: ['°'] },
    { id: 'home', es: ['centro'], en: ['home'], args: 0 },
    { id: 'circle', es: ['circulo', 'círculo'], en: ['circle'], args: 1, defaults: [50], argEs: ['radio'], argEn: ['radius'] }
  ];
  var SENSORS = [
    { id: 'xcor', es: ['posx'], en: ['xcor'], args: 0 }, { id: 'ycor', es: ['posy'], en: ['ycor'], args: 0 }, { id: 'heading', es: ['direccion', 'dirección'], en: ['heading'], args: 0 }
  ];

  /* Tortuga: 0° mira hacia arriba y girar a la derecha suma grados, como en Logo. */
  function Turtle() { this.reset(); }
  Turtle.prototype.reset = function () { this.x = 0; this.y = 0; this.hd = 0; this.pen = true; this.color = '#17202a'; this.w = 3; this.segs = []; this.log = []; this.dist = 0; };
  Turtle.prototype.line = function (x2, y2) {
    if (this.pen) this.segs.push([this.x, this.y, x2, y2, this.color, this.w]);
    this.dist += Math.hypot(x2 - this.x, y2 - this.y);
    this.x = x2; this.y = y2;
    if (this.segs.length > 60000) throw { msg: t('pErrTooManyLines') };
  };
  Turtle.prototype.exec = function (id, a) {
    var r;
    switch (id) {
      case 'fd': case 'bk':
        var d = (id === 'fd' ? 1 : -1) * num(a[0]); r = this.hd * Math.PI / 180;
        this.line(this.x + Math.sin(r) * d, this.y + Math.cos(r) * d); break;
      case 'rt': this.hd = ((this.hd + num(a[0])) % 360 + 360) % 360; break;
      case 'lt': this.hd = ((this.hd - num(a[0])) % 360 + 360) % 360; break;
      case 'pu': this.pen = false; break;
      case 'pd': this.pen = true; break;
      case 'color':
        var c = String(a[0]).toLowerCase().trim();
        if (COLORS[c]) this.color = COLORS[c]; else if (/^#[0-9a-f]{6}$/.test(c)) this.color = c; else throw { msg: t('pErrColor', { c: a[0] }) };
        break;
      case 'width': this.w = Math.max(1, Math.min(40, num(a[0]))); break;
      case 'goto': this.line(num(a[0]), num(a[1])); break;
      case 'seth': this.hd = ((num(a[0]) % 360) + 360) % 360; break;
      case 'home': this.line(0, 0); this.hd = 0; break;
      case 'circle':
        var R = num(a[0]), n = Math.max(12, Math.min(90, Math.round(Math.abs(R) / 2))), step = 2 * Math.PI * Math.abs(R) / n;
        for (var i = 0; i < n; i++) { this.exec('fd', [step]); this.hd = ((this.hd + (R >= 0 ? 360 / n : -360 / n)) % 360 + 360) % 360; }
        break;
    }
    function num(v) { if (typeof v !== 'number' || !isFinite(v)) throw { msg: t('cErrNotNumber') }; return v; }
  };
  Turtle.prototype.sensor = function (id) { return id === 'xcor' ? Math.round(this.x * 100) / 100 : id === 'ycor' ? Math.round(this.y * 100) / 100 : this.hd; };

  /* Comparación de dibujos: tramos normalizados, sin importar el orden ni el sentido. */
  function normSegs(segs) {
    var out = [];
    segs.forEach(function (s) {
      var a = [Math.round(s[0] * 2) / 2, Math.round(s[1] * 2) / 2], b = [Math.round(s[2] * 2) / 2, Math.round(s[3] * 2) / 2];
      if (a[0] === b[0] && a[1] === b[1]) return;
      if (a[0] > b[0] || (a[0] === b[0] && a[1] > b[1])) { var tmp = a; a = b; b = tmp; }
      out.push([a[0], a[1], b[0], b[1]]);
    });
    return out;
  }
  function covered(segsA, segsB, tol) {
    /* ¿cada tramo de A está cubierto por tramos de B? se muestrean puntos a lo largo */
    return segsA.every(function (s) {
      var L = Math.hypot(s[2] - s[0], s[3] - s[1]), n = Math.max(2, Math.ceil(L / 6));
      for (var i = 0; i <= n; i++) {
        var px = s[0] + (s[2] - s[0]) * i / n, py = s[1] + (s[3] - s[1]) * i / n, ok = false;
        for (var j = 0; j < segsB.length && !ok; j++) { if (distPS(px, py, segsB[j]) <= tol) ok = true; }
        if (!ok) return false;
      }
      return true;
    });
  }
  function distPS(px, py, s) {
    var dx = s[2] - s[0], dy = s[3] - s[1], L2 = dx * dx + dy * dy, r = L2 ? Math.max(0, Math.min(1, ((px - s[0]) * dx + (py - s[1]) * dy) / L2)) : 0;
    return Math.hypot(s[0] + r * dx - px, s[1] + r * dy - py);
  }
  function sameDrawing(user, target) {
    var a = normSegs(user), b = normSegs(target); if (!a.length) return false;
    return covered(a, b, 1.6) && covered(b, a, 1.6);
  }

  T.ready(function () {
    var app = T.mount(); if (!app || app.getAttribute('data-studio') !== 'programacion') return;
    var spec = new K.Spec({ commands: COMMANDS, sensors: SENSORS });
    var CH = T.dict.challenges || [];
    var turtle = new Turtle(), target = null, lastInfo = null, lastOk = false;

    var editor;
    var history = new T.History(function () { return { prog: editor ? editor.snapshot() : [], title: title }; },
      function (s) { editor.set(s.prog); title = s.title || ''; titleIn.value = title; },
      function () { if (bar) bar.sync(); });
    var title = '';

    var retos = T.challenges({ items: CH, onPick: onPick });
    var bar = T.projectBar({ studio: 'programacion', history: history,
      extra: [T.btn(t('pExportPng'), { icon: 'png', onClick: exportPng })],
      getData: function () { var p = editor.get(); return { prog: p || editor.snapshot(), text: editor.text(), title: title }; },
      getTitle: function () { return title; },
      onPrint: function () { printCode.textContent = (title ? title + '\n\n' : '') + editor.text(); },
      onNew: function () { editor.set([]); turtle.reset(); drawAll(); history.reset(); T.markClean(); T.say(t('pNewDone')); },
      onOpen: function (d) {
        if (!d || typeof d.text !== 'string') throw new Error('bad');
        var r = editor.setText(d.text.slice(0, 50000)); if (!r.ok) throw new Error('bad');
        title = String(d.title || '').slice(0, 80); titleIn.value = title; history.reset(); turtle.reset(); drawAll();
      } });

    editor = new K.Editor({ spec: spec, history: history, idPrefix: 'igt-p', snapshot: function () { return history.snapshot(); }, defaultCond: 'posx() < 100' });
    var canvas = h('canvas', { class: 'igt-turtle', role: 'img', 'aria-label': t('pCanvasLabel'), 'aria-describedby': 'igt-p-alt' });
    var box = h('div', { class: 'igt-canvas-box igt-turtle-box' }, canvas);
    var logList = h('ol', { class: 'igt-log', 'aria-label': t('pOutput') });
    var errBox = h('p', { class: 'igt-err', hidden: true, role: 'alert' });
    var resBox = h('div', { 'aria-live': 'polite' });
    var altBox = h('div', { class: 'igt-alt', id: 'igt-p-alt' });
    var ghostChk = h('input', { type: 'checkbox', id: 'igt-p-ghost', checked: true });
    var gridChk = h('input', { type: 'checkbox', id: 'igt-p-grid', checked: true });
    var runner = new K.Runner({ idPrefix: 'igt-p',
      make: function () {
        var prog = editor.get(); if (!prog) return null;
        turtle.reset(); T.clear(logList); errBox.hidden = true; T.clear(resBox);
        return new K.Interp(prog, spec, { exec: function (id, a) { turtle.exec(id, a); }, sensor: function (id) { return turtle.sensor(id); },
          print: function (s) { turtle.log.push(s); if (turtle.log.length <= 500) logList.appendChild(h('li', { text: s })); }, random: Math.random });
      },
      onStep: function (node) { editor.highlight(node ? node.id : null); },
      onFrame: drawAll,
      onReset: function () { turtle.reset(); T.clear(logList); errBox.hidden = true; T.clear(resBox); drawAll(); },
      onDone: function (err) {
        drawAll();
        if (err) { errBox.hidden = false; errBox.textContent = t('cRunErr', { m: err.msg, line: err.node && err.node.line ? err.node.line : '—' }); T.say(errBox.textContent); return; }
        T.say(t('pDone', { n: turtle.segs.length }));
        check();
      } });

    var titleIn = h('input', { type: 'text', id: 'igt-p-title', maxlength: 80, autocomplete: 'off' });
    titleIn.addEventListener('change', function () { title = titleIn.value.trim(); T.markDirty(); });
    var stage = h('div', { class: 'igt-stage glass' }, runner.el, box,
      h('div', { class: 'igt-bar' }, h('label', { class: 'igt-check', for: 'igt-p-ghost' }, ghostChk, t('pGhost')), h('label', { class: 'igt-check', for: 'igt-p-grid' }, gridChk, t('pGrid'))),
      errBox, resBox, h('h3', { class: 'igt-h3', text: t('pOutput') }), logList);
    var side = h('div', { class: 'igt-side glass' }, h('h3', { text: t('pProgram') }), editor.el,
      h('label', { class: 'igt-field', for: 'igt-p-title' }, t('pTitle'), titleIn));
    app.appendChild(retos);
    app.appendChild(h('div', { class: 'igt-topbar glass' }, bar));
    var printCode = h('pre', { class: 'igt-print-only igt-print-keep igt-code', 'aria-hidden': 'true' });
    app.appendChild(h('div', { class: 'igt-work wide-side igt-print-keep' }, stage, side));
    altBox.classList.add('igt-print-keep');
    app.appendChild(altBox);
    app.appendChild(printCode);
    app.appendChild(T.keyHelp([[t('kTab'), t('pKTab')], ['Enter', t('pKEnter')], ['Ctrl+Z / Ctrl+Y', t('kUndoRedo')]]));
    ghostChk.addEventListener('change', drawAll); gridChk.addEventListener('change', drawAll);
    history.bindKeys(document);

    /* Dibujo */
    var ctx, disp = 500, WORLD = 300;
    function resize() { disp = Math.max(240, Math.min(box.clientWidth || 500, 720)); ctx = T.fitCanvas(canvas, disp, disp); canvas.style.height = disp + 'px'; drawAll(); }
    function drawAll() {
      if (!ctx) return;
      var c = ctx, s = disp / (2 * WORLD);
      c.fillStyle = '#ffffff'; c.fillRect(0, 0, disp, disp);
      function X(x) { return disp / 2 + x * s; } function Y(y) { return disp / 2 - y * s; }
      if (gridChk.checked) {
        c.strokeStyle = 'rgba(23,57,92,.07)'; c.lineWidth = 1; c.beginPath();
        for (var g = -WORLD; g <= WORLD; g += 50) { c.moveTo(X(g), 0); c.lineTo(X(g), disp); c.moveTo(0, Y(g)); c.lineTo(disp, Y(g)); }
        c.stroke(); c.strokeStyle = 'rgba(23,57,92,.18)'; c.beginPath(); c.moveTo(X(0), 0); c.lineTo(X(0), disp); c.moveTo(0, Y(0)); c.lineTo(disp, Y(0)); c.stroke();
        c.fillStyle = '#6b7788'; c.font = '11px Atkinson Hyperlegible, Arial'; c.fillText('100', X(100) + 3, Y(0) - 3); c.fillText('100', X(0) + 3, Y(100) + 11);
      }
      if (target && ghostChk.checked) {
        c.strokeStyle = 'rgba(90,73,168,.28)'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath();
        target.forEach(function (sg) { c.moveTo(X(sg[0]), Y(sg[1])); c.lineTo(X(sg[2]), Y(sg[3])); }); c.stroke();
      }
      c.lineCap = 'round'; c.lineJoin = 'round';
      turtle.segs.forEach(function (sg) { c.strokeStyle = sg[4]; c.lineWidth = sg[5] * s * 1.6; c.beginPath(); c.moveTo(X(sg[0]), Y(sg[1])); c.lineTo(X(sg[2]), Y(sg[3])); c.stroke(); });
      /* tortuga */
      var r = turtle.hd * Math.PI / 180, tx = X(turtle.x), ty = Y(turtle.y), L = 13;
      c.fillStyle = turtle.pen ? '#2e7d4f' : '#ffffff'; c.strokeStyle = '#17395c'; c.lineWidth = 2; c.beginPath();
      c.moveTo(tx + Math.sin(r) * L, ty - Math.cos(r) * L); c.lineTo(tx + Math.sin(r + 2.5) * L * 0.75, ty - Math.cos(r + 2.5) * L * 0.75); c.lineTo(tx + Math.sin(r - 2.5) * L * 0.75, ty - Math.cos(r - 2.5) * L * 0.75); c.closePath(); c.fill(); c.stroke();
      describe();
    }
    function describe() {
      T.clear(altBox);
      altBox.appendChild(h('h3', { text: t('pAltTitle') }));
      var xs = [], ys = [];
      turtle.segs.forEach(function (sg) { xs.push(sg[0], sg[2]); ys.push(sg[1], sg[3]); });
      var cols = []; turtle.segs.forEach(function (sg) { if (cols.indexOf(sg[4]) < 0) cols.push(sg[4]); });
      altBox.appendChild(h('p', { text: turtle.segs.length ? t('pAltText', { n: turtle.segs.length, w: Math.round(Math.max.apply(null, xs) - Math.min.apply(null, xs)), h: Math.round(Math.max.apply(null, ys) - Math.min.apply(null, ys)), c: cols.length, d: Math.round(turtle.dist) }) : t('pAltEmpty') }));
      altBox.appendChild(h('p', { class: 'igt-note', text: t('pTurtleAt', { x: Math.round(turtle.x), y: Math.round(turtle.y), hd: Math.round(turtle.hd), pen: turtle.pen ? t('pPenDown') : t('pPenUp') }) }));
      if (target) altBox.appendChild(h('p', { class: 'igt-note', text: t('pGhostInfo', { n: target.length }) }));
    }

    /* Retos */
    function onPick(ch) {
      target = null;
      if (ch && ch.ref) {
        var r = K.parse(ch.ref, spec);
        if (r.ok) { var tt = new Turtle(); var it = new K.Interp(r.stmts, spec, { exec: function (id, a) { tt.exec(id, a); }, sensor: function (id) { return tt.sensor(id); }, print: function () {}, random: function () { return 0.5; } }); while (!it.next().done) {} target = tt.segs.slice(); }
      }
      if (ch && ch.start && !editor.snapshot().length) { editor.setText(ch.start); }
      drawAll(); T.clear(resBox);
      if (!ch) return null;
      var wrap = h('div', { class: 'igt-bar igt-noprint' });
      if (ch.start) wrap.appendChild(T.btn(t('pLoadStart'), { onClick: function () { if (editor.snapshot().length && !window.confirm(t('pStartConfirm'))) return; var before = history.snapshot(); editor.setText(ch.start); history.commit(before); T.say(t('pStartLoaded')); } }));
      wrap.appendChild(T.btn(t('check'), { cls: 'primary', onClick: function () { runner.start(); } }));
      return wrap;
    }
    function check() {
      var ch = retos.current(); if (!ch) return;
      var R = ch.rules || {}, prog = editor.snapshot(), info = K.analyze(prog), out = [];
      function add(ok, txt) { out.push([ok, txt]); }
      if (target) add(sameDrawing(turtle.segs, target), t('pChkShape'));
      if (R.maxBlocks) add(info.blocks <= R.maxBlocks, t('pChkMaxBlocks', { n: info.blocks, m: R.maxBlocks }));
      if (R.repeat) add(info.repeat + info.while >= R.repeat, t('pChkLoop'));
      if (R.vars) add(Object.keys(info.vars).length >= R.vars, t('pChkVars', { n: Object.keys(info.vars).length, m: R.vars }));
      if (R.funcParams) add(info.funcs >= 1 && info.params >= R.funcParams, t('pChkFunc', { m: R.funcParams }));
      if (R.calls) add(info.calls >= R.calls, t('pChkCalls', { n: info.calls, m: R.calls }));
      if (R.recursion) add(info.recursion, t('pChkRecursion'));
      if (R.minSegs) add(turtle.segs.length >= R.minSegs, t('pChkMinSegs', { n: turtle.segs.length, m: R.minSegs }));
      if (R.log) { var want = R.log.join('|'), got = turtle.log.join('|'); add(got === want, t('pChkLog', { n: R.log.length })); }
      if (R.colors) { var cols = []; turtle.segs.forEach(function (sg) { if (cols.indexOf(sg[4]) < 0) cols.push(sg[4]); }); add(cols.length >= R.colors, t('pChkColors', { n: cols.length, m: R.colors })); }
      if (R.ifs) add(info.if >= R.ifs, t('pChkIf'));
      T.clear(resBox);
      var all = out.every(function (x) { return x[0]; });
      resBox.appendChild(T.result(all, all ? t('pCheckOk') : t('pCheckSome')));
      resBox.appendChild(h('ul', { class: 'igt-limits' }, out.map(function (x) { return h('li', { text: (x[0] ? '✓ ' : '· ') + x[1] }); })));
      T.say(all ? t('pCheckOk') : t('pCheckSome'));
    }
    function exportPng() {
      var c = document.createElement('canvas'), n = 1200; c.width = n; c.height = n; var x = c.getContext('2d');
      x.fillStyle = '#fff'; x.fillRect(0, 0, n, n); var s = n / (2 * WORLD); x.lineCap = 'round'; x.lineJoin = 'round';
      turtle.segs.forEach(function (sg) { x.strokeStyle = sg[4]; x.lineWidth = sg[5] * s * 1.6; x.beginPath(); x.moveTo(n / 2 + sg[0] * s, n / 2 - sg[1] * s); x.lineTo(n / 2 + sg[2] * s, n / 2 - sg[3] * s); x.stroke(); });
      T.exportPNG(c, n, n, 'iris-green-programa-' + (T.slug(title) || T.stamp()) + '.png', (title || t('pUntitled')) + ' · ' + t('pMadeIn'));
    }
    if (window.ResizeObserver) new ResizeObserver(function () { var w = Math.min(box.clientWidth, 720); if (Math.abs(w - disp) > 2) resize(); }).observe(box);
    resize();
    editor.setText(t('pStarter'));
  });

  window.IGTTurtle = { Turtle: Turtle, sameDrawing: sameDrawing, COMMANDS: COMMANDS, SENSORS: SENSORS };
})(window, document);
