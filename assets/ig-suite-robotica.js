/* Iris Green · El taller · Estudio de robótica (R43).
   Gemelo digital de un robot de dos ruedas: motores, sensor de distancia, dos sensores
   de línea, sensor de color, parachoques, luz y zumbador. Se programa con bloques o
   JavaScript (el mismo editor que Programación) y se mueve con un motor físico real
   visto desde arriba. Exporta el programa en JavaScript y un borrador en Python. */
(function (root) {
  'use strict';
  var IG = root.IGSuite; if (!IG) return;
  var LANG = IG.lang;
  var PX = 250;            /* 250 px del escenario = 1 m */
  var W = 480, H = 360;    /* escenario lógico: 1,92 m × 1,44 m */
  var AW = W / PX, AH = H / PX;
  var NOTES = [['C4', 'do', 'C'], ['D4', 're', 'D'], ['E4', 'mi', 'E'], ['F4', 'fa', 'F'], ['G4', 'sol', 'G'], ['A4', 'la', 'A'], ['B4', 'si', 'B'], ['C5', 'do agudo', 'high C']];
  var NOTE_HZ = { C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25 };
  var ZONE_COLORS = [['verde', 'green', '#4caf50'], ['rojo', 'red', '#e57373'], ['azul', 'blue', '#64b5f6'], ['amarillo', 'yellow', '#ffd54f']];
  function L(es, en) { return { es: es, en: en }; }

  var API = [
    { id: 'motors', kind: 'stmt', cat: 'motors', es: 'motores', en: 'motors', label: L('motores izquierdo %1 % derecho %2 %', 'motors left %1 % right %2 %'), args: [{ type: 'num', def: 50 }, { type: 'num', def: 50 }], tip: L('De −100 (atrás) a 100 (adelante). Siguen así hasta que los cambies.', 'From −100 (backwards) to 100 (forwards). They keep going until you change them.') },
    { id: 'forward', kind: 'stmt', cat: 'motors', es: 'avanzar', en: 'forward', label: L('avanzar %1 cm', 'forward %1 cm'), args: [{ type: 'num', def: 20 }] },
    { id: 'backward', kind: 'stmt', cat: 'motors', es: 'retroceder', en: 'backward', label: L('retroceder %1 cm', 'backward %1 cm'), args: [{ type: 'num', def: 20 }] },
    { id: 'turnRight', kind: 'stmt', cat: 'motors', es: 'girarDerecha', en: 'turnRight', label: L('girar a la derecha %1 grados', 'turn right %1 degrees'), args: [{ type: 'num', def: 90 }] },
    { id: 'turnLeft', kind: 'stmt', cat: 'motors', es: 'girarIzquierda', en: 'turnLeft', label: L('girar a la izquierda %1 grados', 'turn left %1 degrees'), args: [{ type: 'num', def: 90 }] },
    { id: 'stop', kind: 'stmt', cat: 'motors', es: 'parar', en: 'stop', label: L('parar los motores', 'stop the motors'), args: [] },
    { id: 'distance', kind: 'num', cat: 'sensors', es: 'distancia', en: 'distance', label: L('distancia delante (cm)', 'distance ahead (cm)'), args: [] },
    { id: 'lineLeft', kind: 'bool', cat: 'sensors', es: 'lineaIzquierda', en: 'lineLeft', label: L('¿línea bajo el sensor izquierdo?', 'line under left sensor?'), args: [] },
    { id: 'lineRight', kind: 'bool', cat: 'sensors', es: 'lineaDerecha', en: 'lineRight', label: L('¿línea bajo el sensor derecho?', 'line under right sensor?'), args: [] },
    { id: 'floorColour', kind: 'str', cat: 'sensors', es: 'colorSuelo', en: 'floorColour', label: L('color del suelo', 'floor colour'), args: [] },
    { id: 'bumped', kind: 'bool', cat: 'sensors', es: 'chocando', en: 'bumping', label: L('¿está chocando?', 'bumping?'), args: [] },
    { id: 'heading', kind: 'num', cat: 'sensors', es: 'brujula', en: 'compass', label: L('brújula (grados)', 'compass (degrees)'), args: [] },
    { id: 'timer', kind: 'num', cat: 'sensors', es: 'cronometro', en: 'timer', label: L('cronómetro', 'timer'), args: [] },
    { id: 'led', kind: 'stmt', cat: 'outputs', es: 'luz', en: 'light', label: L('luz %1', 'light %1'), args: [{ type: 'color' }] },
    { id: 'ledOff', kind: 'stmt', cat: 'outputs', es: 'apagarLuz', en: 'lightOff', label: L('apagar la luz', 'light off'), args: [] },
    { id: 'beep', kind: 'stmt', cat: 'outputs', es: 'pitar', en: 'beep', label: L('pitar la nota %1 durante %2 s', 'beep note %1 for %2 s'), args: [{ type: 'choice', options: NOTES }, { type: 'num', def: 0.3 }] },
    { id: 'show', kind: 'stmt', cat: 'outputs', es: 'mostrar', en: 'display', label: L('mostrar en la pantalla %1', 'show on the display %1'), args: [{ type: 'str', def: L('Hola', 'Hello') }] }
  ];
  var CATS = [
    { id: 'motors', es: 'Motores', en: 'Motors', colour: '#3f6fb0' }, { id: 'sensors', es: 'Sensores', en: 'Sensors', colour: '#2f89a8' },
    { id: 'outputs', es: 'Luz y sonido', en: 'Light and sound', colour: '#b0457a' }
  ];
  var PY_HEADER = {
    es: '# Borrador para un robot real. Este código usa las mismas instrucciones que el gemelo digital.\n# Para una placa concreta (micro:bit, ESP32, Arduino con MicroPython…) hay que escribir\n# motores(), distancia(), linea_izquierda()… con la biblioteca de esa placa.\n\n',
    en: '# Draft for a real robot. This code uses the same instructions as the digital twin.\n# For a specific board (micro:bit, ESP32, Arduino with MicroPython…) you need to write\n# motors(), distance(), line_left()… using that board\'s library.\n\n'
  };

  IG.defineEngine('robotica', {
    libs: ['pixi', 'blockly', 'codemirror', 'acorn'], version: 1, fileBase: LANG === 'en' ? 'robot' : 'robot', structureOpen: false,
    extraKeys: ['kRun', 'kArena'],
    initialStart: function (para) { return { child: 'square', teen: 'line', adult: 'maze' }[para] || 'free'; },
    starts: function (ctx) {
      var t = ctx.t;
      return [
        { id: 'free', title: t('startFree'), desc: t('startFreeDesc'), para: 'any' },
        { id: 'square', title: t('startSquare'), desc: t('startSquareDesc'), para: 'child' },
        { id: 'line', title: t('startLine'), desc: t('startLineDesc'), para: 'teen' },
        { id: 'avoid', title: t('startAvoid'), desc: t('startAvoidDesc'), para: 'teen' },
        { id: 'maze', title: t('startMaze'), desc: t('startMazeDesc'), para: 'adult' },
        { id: 'clean', title: t('startClean'), desc: t('startCleanDesc'), para: 'any' }
      ];
    },
    create: function (ctx) { return createStudio(ctx); }
  });

  /* Pistas y arenas. Unidades: metros, origen en el centro, y hacia arriba. */
  function oval(cx, cy, rx, ry, n) { var p = []; for (var i = 0; i <= n; i++) { var a = i / n * Math.PI * 2; p.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return p; }
  var ARENAS = {
    free: { robot: { x: -0.6, y: 0, dir: 0 }, walls: [], boxes: [], lines: [], zones: [{ x: 0.7, y: 0, w: 0.3, h: 0.3, c: 'verde' }],
      code: "alEmpezar(() => {\n  luz('verde');\n  avanzar(40);\n  girarIzquierda(90);\n  avanzar(20);\n  pitar('do agudo', 0.3);\n});" },
    square: { robot: { x: -0.3, y: -0.3, dir: 0 }, walls: [], boxes: [], lines: [], zones: [],
      code: "alEmpezar(() => {\n  for (let i = 0; i < 4; i++) {\n    avanzar(50);\n    girarIzquierda(90);\n  }\n  luz('verde');\n  pitar('sol', 0.5);\n});" },
    line: { robot: { x: 0, y: -0.45, dir: 0 }, walls: [], boxes: [], lines: [oval(0, 0, 0.72, 0.45, 72)], zones: [],
      code: "alEmpezar(() => {\n  while (true) {\n    if (lineaIzquierda() && lineaDerecha()) {\n      motores(40, 40);\n    } else if (lineaIzquierda()) {\n      motores(5, 40);\n    } else if (lineaDerecha()) {\n      motores(40, 5);\n    } else {\n      motores(30, 30);\n    }\n  }\n});" },
    avoid: { robot: { x: -0.7, y: 0, dir: 0 }, walls: [{ x: 0.1, y: 0.25, w: 0.08, h: 0.5 }, { x: 0.45, y: -0.3, w: 0.08, h: 0.5 }], boxes: [], lines: [], zones: [],
      code: "alEmpezar(() => {\n  while (true) {\n    if (distancia() < 15) {\n      luz('rojo');\n      parar();\n      retroceder(5);\n      girarDerecha(azar(60, 120));\n    } else {\n      luz('verde');\n      motores(50, 50);\n    }\n  }\n});" },
    maze: { robot: { x: -0.78, y: -0.52, dir: 90 }, walls: [
      { x: -0.55, y: -0.15, w: 0.06, h: 0.9 }, { x: -0.15, y: 0.15, w: 0.06, h: 0.9 }, { x: 0.25, y: -0.15, w: 0.06, h: 0.9 }, { x: 0.6, y: 0.2, w: 0.06, h: 0.7 }
    ], boxes: [], lines: [], zones: [{ x: 0.8, y: -0.5, w: 0.2, h: 0.2, c: 'verde' }],
      code: "alEmpezar(() => {\n  while (!(colorSuelo() === 'verde')) {\n    if (distancia() < 12) {\n      girarDerecha(90);\n      if (distancia() < 12) {\n        girarIzquierda(180);\n      }\n    } else {\n      motores(45, 45);\n    }\n  }\n  parar();\n  luz('verde');\n  mostrar('Salida');\n});" },
    clean: { robot: { x: 0, y: 0, dir: 90 }, walls: [], boxes: [{ x: -0.4, y: 0.2 }, { x: 0.35, y: 0.3 }, { x: 0.3, y: -0.3 }, { x: -0.35, y: -0.25 }], lines: [oval(0, 0, 0.6, 0.6, 72)], zones: [],
      code: "alEmpezar(() => {\n  while (true) {\n    motores(60, 60);\n    esperar(1.5);\n    retroceder(10);\n    girarDerecha(azar(90, 180));\n  }\n});" }
  };

  function createStudio(ctx) {
    var t = ctx.t, h = ctx.h, PIXI = root.PIXI;
    var code = IG.Code.create(ctx, { api: API, categories: CATS, events: ['start', 'key', 'message', 'bump'], pyHeader: PY_HEADER });
    var center = ctx.viewport.parentNode;
    center.classList.add('igs-split');
    center.insertBefore(code.pane, ctx.viewport);
    ctx.viewport.classList.add('igs-stage');

    var app = new PIXI.Application();
    return app.init({ antialias: true, background: '#ffffff', autoStart: false, resolution: Math.min(2, root.devicePixelRatio || 1), autoDensity: true, preference: 'webgl', width: W, height: H }).then(function () {
      ctx.setTech('renderer', 'PixiJS ' + PIXI.VERSION + ' · ' + (app.renderer.name === 'webgpu' ? 'WebGPU' : 'WebGL') + ' · Blockly ' + root.Blockly.VERSION + ' · CodeMirror 6');
      app.canvas.setAttribute('aria-hidden', 'true');
      ctx.viewport.appendChild(app.canvas);
      code.mount();
      return build();
    });

    function build() {
      var S = null, running = false, rt = null, audio = null, sel = null;
      var world = new PIXI.Container(); app.stage.addChild(world);
      var floor = new PIXI.Graphics(), objs = new PIXI.Graphics(), bot = new PIXI.Graphics(), over = new PIXI.Graphics(), labels = new PIXI.Container();
      [floor, objs, bot, over, labels].forEach(function (g) { world.addChild(g); });
      var display = new PIXI.Text({ text: '', style: { fontFamily: 'Atkinson Hyperlegible, Arial, sans-serif', fontSize: 13, fill: '#ffffff', fontWeight: '700' } });
      var displayBg = new PIXI.Graphics(); world.addChild(displayBg); world.addChild(display);
      var fitScale = 1;
      function layout() {
        var vw = ctx.viewport.clientWidth, vh = ctx.viewport.clientHeight; app.renderer.resize(vw, vh);
        fitScale = Math.min(vw / W, vh / H); world.scale.set(fitScale); world.x = (vw - W * fitScale) / 2; world.y = (vh - H * fitScale) / 2; requestRender();
      }
      if (root.ResizeObserver) new ResizeObserver(layout).observe(ctx.viewport);
      var frame = 0;
      function requestRender() { if (!frame) frame = root.requestAnimationFrame(function () { frame = 0; render(); }); }
      function X(m) { return W / 2 + m * PX; } function Y(m) { return H / 2 - m * PX; }

      /* ---------- Estado del robot (gemelo) ---------- */
      var R = { x: 0, y: 0, dir: 0, left: 0, right: 0, led: null, text: '', bump: false, trail: [] };
      var phys = null, t0 = 0, lastBump = false;
      var ROBOT_W = 0.14, ROBOT_L = 0.16, WHEEL_BASE = 0.13, MAX_SPEED = 0.35; /* m/s a 100 % */

      function buildPhysics() {
        return IGPhysics.backend(IG).then(function (kind) {
          ctx.setTech('physics', kind === 'rapier' ? 'Rapier 0.21 (WebAssembly)' : 'Planck.js 1.5 (Box2D, JavaScript)');
          var wd = IGPhysics.createWorld(kind, { gravity: 0, velocityIterations: 10, positionIterations: 6 });
          var th = 0.1;
          wd.addBody({ type: 'static', x: 0, y: AH / 2 + th / 2, shape: { type: 'box', w: AW + 2 * th, h: th } });
          wd.addBody({ type: 'static', x: 0, y: -AH / 2 - th / 2, shape: { type: 'box', w: AW + 2 * th, h: th } });
          wd.addBody({ type: 'static', x: -AW / 2 - th / 2, y: 0, shape: { type: 'box', w: th, h: AH } });
          wd.addBody({ type: 'static', x: AW / 2 + th / 2, y: 0, shape: { type: 'box', w: th, h: AH } });
          S.walls.forEach(function (w) { wd.addBody({ type: 'static', x: w.x, y: w.y, shape: { type: 'box', w: w.w, h: w.h } }); });
          var boxes = S.boxes.map(function (b) { return wd.addBody({ type: 'dynamic', x: b.x, y: b.y, shape: { type: 'box', w: 0.07, h: 0.07 }, density: 60, friction: 0.5, linearDamping: 6, angularDamping: 6 }); });
          var robot = wd.addBody({ type: 'dynamic', x: R.x, y: R.y, angle: R.dir * Math.PI / 180, shape: { type: 'box', w: ROBOT_L, h: ROBOT_W }, density: 40, friction: 0.3, linearDamping: 0.5, angularDamping: 2 });
          phys = { world: wd, robot: robot, boxes: boxes };
          return phys;
        });
      }
      function driveStep(dt) {
        if (!phys) return;
        var wd = phys.world, p = wd.get(phys.robot); if (!p) return;
        var a = p.angle, fx = Math.cos(a), fy = Math.sin(a), vl = R.left / 100 * MAX_SPEED, vr = R.right / 100 * MAX_SPEED;
        var v = (vl + vr) / 2, w = (vr - vl) / WHEEL_BASE;
        /* Control de velocidad de las ruedas: el suelo no deja que el robot patine de lado. */
        var m = wd.mass(phys.robot), cur = p.vx * fx + p.vy * fy;
        var desiredVx = fx * v, desiredVy = fy * v;
        /* si choca, la física impide avanzar; aquí solo se pide la velocidad deseada */
        wd.applyImpulse(phys.robot, (desiredVx - p.vx) * m * 0.6, (desiredVy - p.vy) * m * 0.6);
        wd.setVelocity(phys.robot, wd.get(phys.robot).vx, wd.get(phys.robot).vy, p.w + (w - p.w) * 0.6);
        wd.step(dt);
        var q = wd.get(phys.robot);
        R.x = q.x; R.y = q.y; R.dir = ((q.angle * 180 / Math.PI) % 360 + 360) % 360;
        R.trail.push([R.x, R.y]); if (R.trail.length > 600) R.trail.shift();
        phys.boxes.forEach(function (id, i) { var b = wd.get(id); if (b) { S.boxes[i].rx = b.x; S.boxes[i].ry = b.y; S.boxes[i].ra = b.angle; } });
        R.bump = bumpNow();
        if (R.bump && !lastBump && rt) rt.fire('bump');
        lastBump = R.bump;
      }
      function sensorPoint(dx, dy) {
        var a = R.dir * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
        return { x: R.x + dx * c - dy * s, y: R.y + dx * s + dy * c };
      }
      function distanceCm() {
        var p = sensorPoint(ROBOT_L / 2 + 0.005, 0), a = R.dir * Math.PI / 180, max = 2;
        if (!phys) return 200;
        var hit = phys.world.raycast(p.x, p.y, p.x + Math.cos(a) * max, p.y + Math.sin(a) * max, [phys.robot]);
        return hit ? Math.round(hit.dist * 1000) / 10 : 200;
      }
      function bumpNow() {
        if (!phys) return false;
        var a = R.dir * Math.PI / 180, dx = Math.cos(a), dy = Math.sin(a), hits = 0;
        [-ROBOT_W / 2 + 0.01, 0, ROBOT_W / 2 - 0.01].forEach(function (off) {
          var p = sensorPoint(ROBOT_L / 2 - 0.005, off), q = phys.world.raycast(p.x, p.y, p.x + dx * 0.02, p.y + dy * 0.02, [phys.robot]);
          if (q && q.dist < 0.012) hits += 1;
        });
        return hits > 0;
      }
      function onLine(pt) {
        var best = 1;
        S.lines.forEach(function (ln) {
          for (var i = 0; i < ln.length - 1; i++) {
            var ax = ln[i][0], ay = ln[i][1], bx = ln[i + 1][0], by = ln[i + 1][1], dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1;
            var u = Math.max(0, Math.min(1, ((pt.x - ax) * dx + (pt.y - ay) * dy) / l2)), d = Math.hypot(ax + u * dx - pt.x, ay + u * dy - pt.y);
            if (d < best) best = d;
          }
        });
        return best < 0.0125;
      }
      function lineSensor(side) { return onLine(sensorPoint(ROBOT_L / 2 - 0.01, side * 0.018)); }
      function floorColour() {
        for (var i = 0; i < S.zones.length; i++) { var z = S.zones[i]; if (Math.abs(R.x - z.x) <= z.w / 2 && Math.abs(R.y - z.y) <= z.h / 2) return zoneName(z.c); }
        if (onLine({ x: R.x, y: R.y })) return LANG === 'en' ? 'black' : 'negro';
        return LANG === 'en' ? 'white' : 'blanco';
      }
      function zoneName(c) { for (var i = 0; i < ZONE_COLORS.length; i++) if (ZONE_COLORS[i][0] === c) return ZONE_COLORS[i][LANG === 'en' ? 1 : 0]; return c; }
      function zoneHex(c) { for (var i = 0; i < ZONE_COLORS.length; i++) if (ZONE_COLORS[i][0] === c) return parseInt(ZONE_COLORS[i][2].slice(1), 16); return 0x9e9e9e; }

      /* Movimientos que esperan a terminar (odometría con la posición real del gemelo). */
      function driveDistance(cm, sign) {
        var target = Math.abs(Number(cm) || 0) / 100, sx = R.x, sy = R.y, start = performance.now();
        R.left = R.right = 55 * sign;
        return { until: function () {
          var d = Math.hypot(R.x - sx, R.y - sy);
          if (d >= target - 0.002 || performance.now() - start > 8000 + target * 20000) { R.left = R.right = 0; return true; }
          if (target - d < 0.03) R.left = R.right = 25 * sign;
          return false;
        } };
      }
      function turnDegrees(deg, sign) {
        var target = Math.abs(Number(deg) || 0), acc = 0, last = R.dir, start = performance.now();
        R.left = -45 * sign; R.right = 45 * sign;
        return { until: function () {
          var d = R.dir - last; if (d > 180) d -= 360; if (d < -180) d += 360; acc += Math.abs(d); last = R.dir;
          if (acc >= target - 0.5 || performance.now() - start > 8000) { R.left = R.right = 0; return true; }
          if (target - acc < 10) { R.left = -18 * sign; R.right = 18 * sign; }
          return false;
        } };
      }
      function tone(note, dur) {
        if (!audio) return;
        var f = NOTE_HZ[note] || 440, now = audio.currentTime, o = audio.createOscillator(), g = audio.createGain();
        o.type = 'square'; o.frequency.value = f;
        g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(0.08, now + 0.01); g.gain.setTargetAtTime(0, now + Math.max(0.04, dur - 0.05), 0.03);
        o.connect(g); g.connect(audio.destination); o.start(now); o.stop(now + dur + 0.2);
      }
      var log = [];
      function makeRuntime() {
        return new code.Runtime({
          callStmt: function (fn, a) {
            switch (fn) {
              case 'motors': R.left = Math.max(-100, Math.min(100, Number(a[0]) || 0)); R.right = Math.max(-100, Math.min(100, Number(a[1]) || 0)); return null;
              case 'forward': return driveDistance(a[0], 1);
              case 'backward': return driveDistance(a[0], -1);
              case 'turnRight': return turnDegrees(a[0], -1);
              case 'turnLeft': return turnDegrees(a[0], 1);
              case 'stop': R.left = R.right = 0; return null;
              case 'led': R.led = code.colorHex(a[0]); return null;
              case 'ledOff': R.led = null; return null;
              case 'beep': { var d = Math.max(0.05, Math.min(5, Number(a[1]) || 0.3)); tone(a[0], d); return { wait: d }; }
              case 'show': R.text = String(a[0]).slice(0, 24); log.push(t('displayLog', { text: R.text })); renderLog(); ctx.announce(t('displayLog', { text: R.text })); return null;
            }
            return null;
          },
          callValue: function (fn) {
            switch (fn) {
              case 'distance': return distanceCm();
              case 'lineLeft': return lineSensor(1);
              case 'lineRight': return lineSensor(-1);
              case 'floorColour': return floorColour();
              case 'bumped': return R.bump;
              case 'heading': return Math.round(R.dir);
              case 'timer': return Math.round((performance.now() - t0) / 100) / 10;
            }
            return 0;
          },
          onStep: function (id) { code.highlight(id); },
          onError: function (msg) { log.push(t('error') + ': ' + msg); renderLog(); ctx.announce(msg); },
          onVar: function () { renderVars(); }
        });
      }

      /* ---------- Dibujo ---------- */
      function render() {
        floor.clear(); objs.clear(); bot.clear(); over.clear(); labels.removeChildren();
        floor.rect(0, 0, W, H).fill({ color: 0xf7f5ef }).stroke({ width: 1, color: 0xc9d8e6 });
        for (var gx = 0; gx <= W; gx += 25) floor.moveTo(gx, 0).lineTo(gx, H);
        for (var gy = 0; gy <= H; gy += 25) floor.moveTo(0, gy).lineTo(W, gy);
        floor.stroke({ width: 1, color: 0xebe7dc });
        S.zones.forEach(function (z, i) {
          floor.rect(X(z.x - z.w / 2), Y(z.y + z.h / 2), z.w * PX, z.h * PX).fill({ color: zoneHex(z.c), alpha: 0.55 }).stroke({ width: sel && sel.type === 'zone' && sel.i === i ? 3 : 1.5, color: 0x172b42 });
          var lb = new PIXI.Text({ text: zoneName(z.c), style: { fontFamily: 'Atkinson Hyperlegible, Arial, sans-serif', fontSize: 12, fill: '#172b42', fontWeight: '700' } });
          lb.anchor.set(0.5); lb.x = X(z.x); lb.y = Y(z.y); labels.addChild(lb);
        });
        S.lines.forEach(function (ln) { ln.forEach(function (p, i) { if (i === 0) floor.moveTo(X(p[0]), Y(p[1])); else floor.lineTo(X(p[0]), Y(p[1])); }); floor.stroke({ width: 0.025 * PX, color: 0x172b42, cap: 'round', join: 'round' }); });
        S.walls.forEach(function (w, i) { objs.rect(X(w.x - w.w / 2), Y(w.y + w.h / 2), w.w * PX, w.h * PX).fill({ color: 0x5f7486 }).stroke({ width: sel && sel.type === 'wall' && sel.i === i ? 3 : 1, color: sel && sel.type === 'wall' && sel.i === i ? 0x5a49a8 : 0x172b42 }); });
        S.boxes.forEach(function (b, i) {
          var x = running && b.rx !== undefined ? b.rx : b.x, y = running && b.ry !== undefined ? b.ry : b.y, a = running && b.ra ? b.ra : 0, s = 0.035 * PX;
          var c = Math.cos(-a), sn = Math.sin(-a), pts = [[-s, -s], [s, -s], [s, s], [-s, s]].map(function (q) { return [X(x) + q[0] * c - q[1] * sn, Y(y) + q[0] * sn + q[1] * c]; });
          objs.poly([].concat.apply([], pts)).fill({ color: 0xb0804a }).stroke({ width: sel && sel.type === 'box' && sel.i === i ? 3 : 1.5, color: sel && sel.type === 'box' && sel.i === i ? 0x5a49a8 : 0x5b3d1e });
        });
        /* rastro */
        if (R.trail.length > 1) { R.trail.forEach(function (p, i) { if (i === 0) over.moveTo(X(p[0]), Y(p[1])); else over.lineTo(X(p[0]), Y(p[1])); }); over.stroke({ width: 2, color: 0x5a49a8, alpha: 0.35 }); }
        /* robot */
        var a = R.dir * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
        function P(dx, dy) { return [X(R.x + dx * c - dy * s), Y(R.y + dx * s + dy * c)]; }
        function quad(x0, y0, x1, y1) { return [].concat(P(x0, y0), P(x1, y0), P(x1, y1), P(x0, y1)); }
        bot.poly(quad(-0.035, ROBOT_W / 2, 0.035, ROBOT_W / 2 + 0.018)).fill({ color: 0x172b42 });
        bot.poly(quad(-0.035, -ROBOT_W / 2 - 0.018, 0.035, -ROBOT_W / 2)).fill({ color: 0x172b42 });
        bot.poly(quad(-ROBOT_L / 2, -ROBOT_W / 2, ROBOT_L / 2, ROBOT_W / 2)).fill({ color: 0x1f5f8b }).stroke({ width: sel && sel.type === 'robot' ? 3 : 2, color: sel && sel.type === 'robot' ? 0x5a49a8 : 0x0e2a44 });
        bot.poly([].concat(P(ROBOT_L / 2 - 0.005, 0), P(ROBOT_L / 2 - 0.035, 0.025), P(ROBOT_L / 2 - 0.035, -0.025))).fill({ color: 0xffffff });
        var led = P(-0.03, 0);
        bot.circle(led[0], led[1], 0.016 * PX).fill({ color: R.led ? parseInt(R.led.slice(1), 16) : 0x3a4a5a }).stroke({ width: 1.5, color: 0xffffff });
        /* sensores de línea: se rellenan si ven la línea (además de la forma, la etiqueta de la lista lo dice) */
        [1, -1].forEach(function (side) {
          var p = sensorPoint(ROBOT_L / 2 - 0.01, side * 0.018), on = running && lineSensor(side);
          over.circle(X(p.x), Y(p.y), 4).fill({ color: on ? 0xffd54f : 0xffffff }).stroke({ width: 1.5, color: 0x172b42 });
        });
        /* rayo del sensor de distancia */
        if (running) {
          var d = distanceCm() / 100, p0 = sensorPoint(ROBOT_L / 2, 0);
          var dl = Math.min(d, 2); var ex = p0.x + Math.cos(a) * dl, ey = p0.y + Math.sin(a) * dl, len = Math.hypot(X(ex) - X(p0.x), Y(ey) - Y(p0.y)), ux = (X(ex) - X(p0.x)) / (len || 1), uy = (Y(ey) - Y(p0.y)) / (len || 1);
          for (var k = 0; k < len; k += 10) over.moveTo(X(p0.x) + ux * k, Y(p0.y) + uy * k).lineTo(X(p0.x) + ux * Math.min(len, k + 5), Y(p0.y) + uy * Math.min(len, k + 5));
          over.stroke({ width: 1.5, color: 0xa1283c, alpha: 0.8 });
        }
        /* pantalla del robot */
        displayBg.clear(); display.text = R.text || '';
        if (R.text) { var dp = P(0, 0); display.anchor.set(0.5, 1); display.x = Math.max(40, Math.min(W - 40, dp[0])); display.y = Math.max(22, dp[1] - 0.1 * PX); displayBg.roundRect(display.x - display.width / 2 - 6, display.y - display.height - 3, display.width + 12, display.height + 6, 6).fill({ color: 0x172b42 }); }
        app.render();
      }

      /* ---------- Ejecutar ---------- */
      var loopId = 0, lastT = 0, sharedVars = {};
      function run() {
        if (running) stopRun(true);
        S.blocks = code.getState();
        try { if (!audio && (root.AudioContext || root.webkitAudioContext)) { audio = new (root.AudioContext || root.webkitAudioContext)(); ctx.setTech('audio', 'Web Audio'); } if (audio && audio.state === 'suspended') audio.resume(); } catch (_) { audio = null; }
        resetRobot();
        log = []; renderLog();
        buildPhysics().then(function () {
          var ast = code.blocksToAst(S.blocks); rt = makeRuntime(); rt.load(ast); sharedVars = rt.vars; renderVars();
          running = true; setRunUI(); t0 = performance.now();
          rt.start();
          ctx.announce(t('running') + (ast.loose ? ' ' + t('looseBlocks', { n: ast.loose }) : ''));
          lastT = performance.now(); loopId = root.requestAnimationFrame(loop);
          ctx.viewport.focus({ preventScroll: true });
        });
      }
      function loop(now) {
        if (!running) return;
        var dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
        var steps = Math.max(1, Math.round(dt / (1 / 120)));
        for (var i = 0; i < steps; i++) driveStep(dt / steps);
        rt.tick(now); render();
        if (!rt.threads.length && R.left === 0 && R.right === 0) { stopRun(false); return; }
        loopId = root.requestAnimationFrame(loop);
      }
      function stopRun(silent) {
        if (!running) return;
        running = false; root.cancelAnimationFrame(loopId); if (rt) rt.stop(); R.left = R.right = 0;
        code.clearHighlight(); setRunUI(); render(); renderSide();
        if (!silent) ctx.announce(t('stopped') + ' ' + robotSummary());
      }
      function resetRobot() {
        R.x = S.robot.x; R.y = S.robot.y; R.dir = S.robot.dir; R.left = R.right = 0; R.led = null; R.text = ''; R.trail = []; R.bump = false; lastBump = false;
        S.boxes.forEach(function (b) { delete b.rx; delete b.ry; delete b.ra; });
        if (phys) { phys.world.destroy(); phys = null; }
      }
      function reset() { stopRun(true); resetRobot(); render(); renderSide(); ctx.announce(t('resetDone')); }
      function robotSummary() { return t('robotAt', { x: Math.round((R.x + AW / 2) * 100), y: Math.round((R.y + AH / 2) * 100), dir: Math.round(R.dir), colour: floorColour() }); }

      /* ---------- Editar la arena en el escenario ---------- */
      function stagePoint(e) { var r = ctx.viewport.getBoundingClientRect(); var lx = (e.clientX - r.left - world.x) / fitScale, ly = (e.clientY - r.top - world.y) / fitScale; return { x: (lx - W / 2) / PX, y: (H / 2 - ly) / PX }; }
      function snap(v) { return Math.round(v * 40) / 40; }
      function hit(p) {
        if (Math.hypot(p.x - S.robot.x, p.y - S.robot.y) < 0.1) return { type: 'robot' };
        for (var i = S.boxes.length - 1; i >= 0; i--) if (Math.abs(p.x - S.boxes[i].x) < 0.05 && Math.abs(p.y - S.boxes[i].y) < 0.05) return { type: 'box', i: i };
        for (var j = S.walls.length - 1; j >= 0; j--) { var w = S.walls[j]; if (Math.abs(p.x - w.x) <= w.w / 2 + 0.01 && Math.abs(p.y - w.y) <= w.h / 2 + 0.01) return { type: 'wall', i: j }; }
        for (var k = S.zones.length - 1; k >= 0; k--) { var z = S.zones[k]; if (Math.abs(p.x - z.x) <= z.w / 2 && Math.abs(p.y - z.y) <= z.h / 2) return { type: 'zone', i: k }; }
        return null;
      }
      var drag = null;
      ctx.viewport.addEventListener('pointerdown', function (e) {
        if (running) return;
        var p = stagePoint(e), tool = ctx.tool() || 'move';
        if (tool === 'move') {
          var hsel = hit(p); sel = hsel; renderSide();
          if (hsel) { var o = objOf(hsel); drag = { sel: hsel, dx: o.x - p.x, dy: o.y - p.y, moved: false }; ctx.viewport.setPointerCapture(e.pointerId); }
        } else if (tool === 'wall') { drag = { wall: { x0: snap(p.x), y0: snap(p.y), x1: snap(p.x), y1: snap(p.y) } }; ctx.viewport.setPointerCapture(e.pointerId); }
        else if (tool === 'box') { S.boxes.push({ x: snap(p.x), y: snap(p.y) }); ctx.commit(t('boxAdded')); ctx.announce(t('boxAdded')); renderSide(); }
        else if (tool === 'line') { drag = { line: [[p.x, p.y]] }; ctx.viewport.setPointerCapture(e.pointerId); }
        else if (tool === 'zone') { var z = { x: snap(p.x), y: snap(p.y), w: 0.2, h: 0.2, c: 'verde' }; S.zones.push(z); sel = { type: 'zone', i: S.zones.length - 1 }; ctx.commit(t('zoneAdded')); ctx.announce(t('zoneAdded')); renderSide(); }
        else if (tool === 'erase') { var hs = hit(p); if (hs && hs.type !== 'robot') { removeObj(hs); } else { var li = nearestLine(p); if (li >= 0) { S.lines.splice(li, 1); ctx.commit(t('lineRemoved')); ctx.announce(t('lineRemoved')); } } renderSide(); }
        requestRender();
      });
      ctx.viewport.addEventListener('pointermove', function (e) {
        if (!drag) return; var p = stagePoint(e);
        if (drag.sel) { var o = objOf(drag.sel); o.x = snap(Math.max(-AW / 2, Math.min(AW / 2, p.x + drag.dx))); o.y = snap(Math.max(-AH / 2, Math.min(AH / 2, p.y + drag.dy))); if (drag.sel.type === 'robot') { R.x = o.x; R.y = o.y; } drag.moved = true; }
        else if (drag.wall) { drag.wall.x1 = snap(p.x); drag.wall.y1 = snap(p.y); var w = wallFrom(drag.wall); over.clear(); over.rect(X(w.x - w.w / 2), Y(w.y + w.h / 2), w.w * PX, w.h * PX).stroke({ width: 2, color: 0x5a49a8 }); app.render(); return; }
        else if (drag.line) { var last = drag.line[drag.line.length - 1]; if (Math.hypot(p.x - last[0], p.y - last[1]) > 0.02) drag.line.push([p.x, p.y]); over.clear(); drag.line.forEach(function (q, i) { if (i === 0) over.moveTo(X(q[0]), Y(q[1])); else over.lineTo(X(q[0]), Y(q[1])); }); over.stroke({ width: 0.025 * PX, color: 0x172b42, cap: 'round' }); app.render(); return; }
        requestRender();
      });
      ctx.viewport.addEventListener('pointerup', function () {
        if (!drag) return;
        if (drag.sel && drag.moved) { ctx.commit(t('movedObj', { name: objName(drag.sel) })); if (drag.sel.type === 'robot') resetRobot(); }
        if (drag.wall) { var w = wallFrom(drag.wall); if (w.w * w.h > 0.0004) { S.walls.push(w); ctx.commit(t('wallAdded')); ctx.announce(t('wallAdded')); } }
        if (drag.line && drag.line.length > 2) { S.lines.push(drag.line.map(function (q) { return [Math.round(q[0] * 1000) / 1000, Math.round(q[1] * 1000) / 1000]; })); ctx.commit(t('lineAdded')); ctx.announce(t('lineAdded')); }
        drag = null; renderSide(); requestRender();
      });
      function wallFrom(d) { var w = Math.max(0.04, Math.abs(d.x1 - d.x0)), hh = Math.max(0.04, Math.abs(d.y1 - d.y0)); return { x: (d.x0 + d.x1) / 2, y: (d.y0 + d.y1) / 2, w: w, h: hh }; }
      function nearestLine(p) { var best = -1, bd = 0.03; S.lines.forEach(function (ln, i) { ln.forEach(function (q) { var d = Math.hypot(q[0] - p.x, q[1] - p.y); if (d < bd) { bd = d; best = i; } }); }); return best; }
      function objOf(s) { return s.type === 'robot' ? S.robot : s.type === 'box' ? S.boxes[s.i] : s.type === 'wall' ? S.walls[s.i] : S.zones[s.i]; }
      function objName(s) { return s.type === 'robot' ? t('robot') : s.type === 'box' ? t('boxN', { n: s.i + 1 }) : s.type === 'wall' ? t('wallN', { n: s.i + 1 }) : t('zoneN', { n: s.i + 1, c: zoneName(S.zones[s.i].c) }); }
      function removeObj(s) {
        var name = objName(s);
        if (s.type === 'box') S.boxes.splice(s.i, 1); else if (s.type === 'wall') S.walls.splice(s.i, 1); else if (s.type === 'zone') S.zones.splice(s.i, 1);
        sel = null; ctx.commit(t('deleted', { name: name })); ctx.announce(t('deleted', { name: name }));
      }
      ctx.viewport.addEventListener('keydown', function (e) {
        if (running) {
          var k = null; Object.keys(code.KEY_CODE).forEach(function (id) { if (code.KEY_CODE[id] === e.key || (id.length === 1 && e.key.toLowerCase() === id)) k = id; });
          if (k) { e.preventDefault(); rt.fire('key', k); }
          if (e.key === 'Escape') stopRun(false);
          return;
        }
        var dir = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
        if (dir) {
          e.preventDefault(); if (!sel) sel = { type: 'robot' };
          var o = objOf(sel), st = e.shiftKey ? 0.1 : 0.025;
          o.x = Math.max(-AW / 2, Math.min(AW / 2, o.x + dir[0] * st)); o.y = Math.max(-AH / 2, Math.min(AH / 2, o.y + dir[1] * st));
          if (sel.type === 'robot') resetRobot();
          ctx.commit(t('movedObj', { name: objName(sel) })); ctx.announce(objName(sel) + ': ' + Math.round((o.x + AW / 2) * 100) + ' cm, ' + Math.round((o.y + AH / 2) * 100) + ' cm');
          renderSide(); requestRender();
        } else if ((e.key === 'Delete' || e.key === 'Backspace') && sel && sel.type !== 'robot') { e.preventDefault(); removeObj(sel); renderSide(); requestRender(); }
      });

      /* ---------- Estructura y propiedades ---------- */
      var logBox = h('ol', { class: 'igs-log' });
      function renderLog() { ctx.clear(logBox); if (!log.length) logBox.appendChild(h('li', { class: 'igs-muted', text: t('logEmpty') })); log.slice(-30).forEach(function (l) { logBox.appendChild(h('li', { text: l })); }); }
      var varsBox = h('dl', { class: 'igs-vars' });
      function renderVars() { ctx.clear(varsBox); Object.keys(sharedVars).forEach(function (k) { varsBox.append(h('dt', { text: k }), h('dd', { text: String(sharedVars[k]) })); }); }
      var sensorsBox = h('dl', { class: 'igs-vars' });
      function renderSensors() {
        ctx.clear(sensorsBox);
        [[t('sDistance'), distanceCm() + ' cm'], [t('sLineL'), lineSensor(1) ? t('yes') : t('no')], [t('sLineR'), lineSensor(-1) ? t('yes') : t('no')], [t('sColour'), floorColour()], [t('sCompass'), Math.round(R.dir) + '°'], [t('sMotors'), Math.round(R.left) + ' % · ' + Math.round(R.right) + ' %']]
          .forEach(function (r) { sensorsBox.append(h('dt', { text: r[0] }), h('dd', { text: r[1] })); });
      }
      function renderSide() {
        var list = [h('h3', { text: t('arena') })], ul = h('ul', { class: 'igs-list' });
        function item(s) { var b = h('button', { type: 'button', 'aria-current': String(!!(sel && sel.type === s.type && sel.i === s.i)) }, h('span', { text: objName(s) })); b.addEventListener('click', function () { sel = s; renderSide(); requestRender(); ctx.viewport.focus(); }); ul.appendChild(h('li', null, b)); }
        item({ type: 'robot' }); S.walls.forEach(function (_, i) { item({ type: 'wall', i: i }); }); S.boxes.forEach(function (_, i) { item({ type: 'box', i: i }); }); S.zones.forEach(function (_, i) { item({ type: 'zone', i: i }); });
        list.push(ul);
        if (S.lines.length) list.push(h('p', { class: 'igs-muted', text: t('linesCount', { n: S.lines.length }) }));
        ctx.setStructure(list);
        var F = ctx.fields, out = [];
        if (sel && sel.type === 'robot') {
          out.push(h('h4', { text: t('robot') }));
          out.push(F.number(t('startDir'), S.robot.dir, { unit: '°', min: 0, max: 359, step: 15, onChange: function (v) { S.robot.dir = v; resetRobot(); ctx.commit(t('startDir')); requestRender(); } }));
          out.push(h('p', { class: 'igs-muted', text: t('robotHelp') }));
        } else if (sel && sel.type === 'zone' && S.zones[sel.i]) {
          var z = S.zones[sel.i];
          out.push(h('h4', { text: objName(sel) }));
          out.push(F.select(t('zoneColour'), z.c, ZONE_COLORS.map(function (c) { return [c[0], c[LANG === 'en' ? 1 : 0]]; }), { onChange: function (v) { z.c = v; ctx.commit(t('zoneColour')); renderSide(); requestRender(); } }));
          out.push(F.number(t('width'), Math.round(z.w * 100), { unit: 'cm', min: 5, max: 150, step: 5, onChange: function (v) { z.w = v / 100; ctx.commit(t('width')); requestRender(); } }));
          out.push(F.number(t('height'), Math.round(z.h * 100), { unit: 'cm', min: 5, max: 150, step: 5, onChange: function (v) { z.h = v / 100; ctx.commit(t('height')); requestRender(); } }));
          out.push(h('div', { class: 'igs-actions' }, ctx.button(t('remove'), { icon: 'trash', class: 'igs-danger', onClick: function () { removeObj(sel); renderSide(); requestRender(); } })));
        } else if (sel && (sel.type === 'wall' || sel.type === 'box')) {
          out.push(h('h4', { text: objName(sel) }));
          out.push(h('div', { class: 'igs-actions' }, ctx.button(t('remove'), { icon: 'trash', class: 'igs-danger', onClick: function () { removeObj(sel); renderSide(); requestRender(); } })));
        }
        var bf = code.blockFields && code.blockFields();
        if (bf) out = bf.concat(out);
        out.push(h('h4', { text: t('sensors') })); renderSensors(); out.push(sensorsBox);
        out.push(h('h4', { text: t('output') })); out.push(logBox); renderLog();
        out.push(h('h4', { text: t('variables') })); out.push(varsBox); renderVars();
        ctx.setInspector(out);
        ctx.setSummary(robotSummary() + ' ' + t('arenaSummary', { w: S.walls.length, b: S.boxes.length, l: S.lines.length, z: S.zones.length }));
      }
      var sensorTimer = root.setInterval(function () { if (running) renderSensors(); }, 400);

      code.onChange(function () { S.blocks = code.getState(); ctx.commit(t('codeChanged')); });
      if (code.onSelect) code.onSelect(function () { renderSide(); });

      var runBtn, stopBtn;
      function setRunUI() { if (!runBtn) return; runBtn.setAttribute('aria-pressed', String(running)); stopBtn.disabled = !running; ctx.app.dataset.igsRunning = String(running); ctx.toolbar.querySelectorAll('[data-tool]').forEach(function (b) { b.disabled = running; }); }
      ctx.setTools([
        { id: 'run', label: t('run'), icon: 'play', primary: true, keys: 'Control+Enter', action: function () { run(); } },
        { id: 'stopBtn', label: t('stop'), icon: 'stop', action: function () { stopRun(false); } },
        { id: 'resetBtn', label: t('reset'), icon: 'undo', action: function () { reset(); } },
        { separator: true },
        { id: 'move', label: t('toolMove'), icon: 'move' },
        { id: 'wall', label: t('toolWall'), icon: 'wall', level: 'more' },
        { id: 'box', label: t('toolBox'), icon: 'box', level: 'more' },
        { id: 'line', label: t('toolLine'), icon: 'pen', level: 'more' },
        { id: 'zone', label: t('toolZone'), icon: 'square', level: 'more' },
        { id: 'erase', label: t('toolErase'), icon: 'erase', level: 'more' }
      ], { initial: 'move' });
      runBtn = ctx.toolbar.querySelector('.igs-primary'); stopBtn = Array.prototype.filter.call(ctx.toolbar.querySelectorAll('.igs-btn'), function (b) { return b.textContent === t('stop'); })[0];
      setRunUI();
      ctx.command('run', t('run'), '', run); ctx.command('stop', t('stop'), '', function () { stopRun(false); });
      document.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && ctx.app.contains(e.target)) { e.preventDefault(); run(); } });

      ctx.addExport(t('exportJs'), function () { S.blocks = code.getState(); ctx.download(new Blob([code.astToJs(code.blocksToAst(S.blocks))], { type: 'text/javascript' }), 'robot-' + ctx.stamp() + '.js'); });
      ctx.addExport(t('exportPy'), function () { S.blocks = code.getState(); ctx.download(new Blob([code.astToPy(code.blocksToAst(S.blocks), PY_HEADER[LANG])], { type: 'text/x-python' }), 'robot-' + ctx.stamp() + '.py'); });
      ctx.addExport(t('exportPng'), function () { render(); var src = app.renderer.extract.canvas({ target: world, frame: new PIXI.Rectangle(0, 0, W, H) }); ctx.canvasBlob(ctx.canvasWithCredit(src, '#ffffff')).then(function (b) { ctx.download(b, (LANG === 'en' ? 'arena-' : 'arena-') + ctx.stamp() + '.png'); }); });

      function fromArena(id) {
        var a = JSON.parse(JSON.stringify(ARENAS[id] || ARENAS.free));
        S = { v: 1, robot: a.robot, walls: a.walls, boxes: a.boxes, lines: a.lines, zones: a.zones, blocks: null };
        var src = a.code;
        if (LANG === 'en') [["'verde'", "'green'"], ["'Salida'", "'Exit'"]].forEach(function (r) { src = src.split(r[0]).join(r[1]); });
        try { S.blocks = code.astToBlocks(code.astFromJs(src)); } catch (err) { if (root.console) console.error(err); }
        stopRun(true); code.setState(S.blocks); resetRobot(); sel = null; renderSide(); layout();
      }
      S = { v: 1, robot: { x: 0, y: 0, dir: 0 }, walls: [], boxes: [], lines: [], zones: [], blocks: null };
      layout();
      return {
        serialize: function () { S.blocks = code.getState(); var c = JSON.parse(JSON.stringify(S)); c.boxes.forEach(function (b) { delete b.rx; delete b.ry; delete b.ra; }); return c; },
        restore: function (st) { stopRun(true); S = JSON.parse(JSON.stringify(st)); code.setState(S.blocks); resetRobot(); sel = null; renderSide(); requestRender(); },
        validate: function (d) {
          function num(v) { return typeof v === 'number' && isFinite(v) && Math.abs(v) < 10; }
          return d && d.robot && num(d.robot.x) && num(d.robot.y) && isFinite(d.robot.dir) && Array.isArray(d.walls) && Array.isArray(d.boxes) && Array.isArray(d.lines) && Array.isArray(d.zones) &&
            d.walls.length < 200 && d.boxes.length < 100 && d.lines.length < 50 && d.walls.every(function (w) { return num(w.x) && num(w.y) && num(w.w) && num(w.h); }) && d.boxes.every(function (b) { return num(b.x) && num(b.y); }) &&
            d.lines.every(function (l) { return Array.isArray(l) && l.length < 2000 && l.every(function (p) { return Array.isArray(p) && num(p[0]) && num(p[1]); }); }) && d.zones.every(function (z) { return num(z.x) && num(z.y) && num(z.w) && num(z.h) && typeof z.c === 'string'; });
        },
        start: function (id) { fromArena(id === 'empty' ? 'free' : id); if (id === 'empty') { S.zones = []; S.blocks = { blocks: { languageVersion: 0, blocks: [{ type: 'igs_on_start', x: 20, y: 20 }] } }; code.setState(S.blocks); renderSide(); requestRender(); } },
        onKey: function () { return false; }
      };
    }
  }
})(window);
