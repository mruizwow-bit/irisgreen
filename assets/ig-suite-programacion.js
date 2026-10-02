/* Iris Green · El taller · Estudio de programación (R43).
   Bloques ↔ JavaScript ↔ escenario: personajes que se mueven, dibujan, hablan, suenan
   y, si se activa, obedecen a un motor físico real. Cada personaje tiene sus guiones. */
(function (root) {
  'use strict';
  var IG = root.IGSuite; if (!IG) return;
  var LANG = IG.lang;
  var W = 480, H = 360;

  var SHAPES = [['flecha', 'flecha', 'arrow'], ['circulo', 'círculo', 'circle'], ['cuadrado', 'cuadrado', 'square'], ['estrella', 'estrella', 'star'], ['nave', 'nave', 'ship'], ['pez', 'pez', 'fish'], ['robot', 'robot', 'robot']];
  var NOTES = [['C4', 'do', 'C'], ['D4', 're', 'D'], ['E4', 'mi', 'E'], ['F4', 'fa', 'F'], ['G4', 'sol', 'G'], ['A4', 'la', 'A'], ['B4', 'si', 'B'], ['C5', 'do agudo', 'high C']];
  var NOTE_HZ = { C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25 };

  function L(es, en) { return { es: es, en: en }; }
  var API = [
    { id: 'forward', kind: 'stmt', cat: 'motion', es: 'avanzar', en: 'forward', label: L('avanzar %1 pasos', 'move %1 steps'), args: [{ type: 'num', def: 10 }] },
    { id: 'turnRight', kind: 'stmt', cat: 'motion', es: 'girarDerecha', en: 'turnRight', label: L('girar a la derecha %1 grados', 'turn right %1 degrees'), args: [{ type: 'num', def: 15 }] },
    { id: 'turnLeft', kind: 'stmt', cat: 'motion', es: 'girarIzquierda', en: 'turnLeft', label: L('girar a la izquierda %1 grados', 'turn left %1 degrees'), args: [{ type: 'num', def: 15 }] },
    { id: 'goTo', kind: 'stmt', cat: 'motion', es: 'irA', en: 'goTo', label: L('ir a x: %1 y: %2', 'go to x: %1 y: %2'), args: [{ type: 'num', def: 0 }, { type: 'num', def: 0 }] },
    { id: 'glide', kind: 'stmt', cat: 'motion', es: 'deslizar', en: 'glide', label: L('deslizar en %1 s a x: %2 y: %3', 'glide in %1 s to x: %2 y: %3'), args: [{ type: 'num', def: 1 }, { type: 'num', def: 100 }, { type: 'num', def: 0 }] },
    { id: 'point', kind: 'stmt', cat: 'motion', es: 'apuntar', en: 'pointIn', label: L('apuntar en dirección %1 grados', 'point in direction %1 degrees'), args: [{ type: 'num', def: 90 }], tip: L('0 = derecha, 90 = arriba, 180 = izquierda, 270 = abajo', '0 = right, 90 = up, 180 = left, 270 = down') },
    { id: 'changeX', kind: 'stmt', cat: 'motion', es: 'cambiarX', en: 'changeX', label: L('cambiar x en %1', 'change x by %1'), args: [{ type: 'num', def: 10 }] },
    { id: 'changeY', kind: 'stmt', cat: 'motion', es: 'cambiarY', en: 'changeY', label: L('cambiar y en %1', 'change y by %1'), args: [{ type: 'num', def: 10 }] },
    { id: 'bounce', kind: 'stmt', cat: 'motion', es: 'rebotarEnBorde', en: 'bounceOnEdge', label: L('rebotar si toca el borde', 'bounce if on edge'), args: [] },
    { id: 'x', kind: 'num', cat: 'motion', es: 'posicionX', en: 'xPosition', label: L('posición x', 'x position'), args: [] },
    { id: 'y', kind: 'num', cat: 'motion', es: 'posicionY', en: 'yPosition', label: L('posición y', 'y position'), args: [] },
    { id: 'dir', kind: 'num', cat: 'motion', es: 'direccion', en: 'direction', label: L('dirección', 'direction'), args: [] },
    { id: 'penDown', kind: 'stmt', cat: 'pen', es: 'bajarLapiz', en: 'penDown', label: L('bajar el lápiz', 'pen down'), args: [] },
    { id: 'penUp', kind: 'stmt', cat: 'pen', es: 'subirLapiz', en: 'penUp', label: L('subir el lápiz', 'pen up'), args: [] },
    { id: 'penColor', kind: 'stmt', cat: 'pen', es: 'colorLapiz', en: 'penColour', label: L('color del lápiz %1', 'pen colour %1'), args: [{ type: 'color' }] },
    { id: 'penSize', kind: 'stmt', cat: 'pen', es: 'grosorLapiz', en: 'penSize', label: L('grosor del lápiz %1', 'pen size %1'), args: [{ type: 'num', def: 3 }] },
    { id: 'stamp', kind: 'stmt', cat: 'pen', es: 'sellar', en: 'stamp', label: L('dejar la huella del personaje', 'stamp'), args: [] },
    { id: 'clear', kind: 'stmt', cat: 'pen', es: 'borrarDibujo', en: 'clearDrawing', label: L('borrar el dibujo', 'clear drawing'), args: [] },
    { id: 'say', kind: 'stmt', cat: 'looks', es: 'decir', en: 'say', label: L('decir %1', 'say %1'), args: [{ type: 'str', def: L('¡Hola!', 'Hello!') }] },
    { id: 'sayFor', kind: 'stmt', cat: 'looks', es: 'decirDurante', en: 'sayFor', label: L('decir %1 durante %2 s', 'say %1 for %2 s'), args: [{ type: 'str', def: L('¡Hola!', 'Hello!') }, { type: 'num', def: 2 }] },
    { id: 'color', kind: 'stmt', cat: 'looks', es: 'colorPersonaje', en: 'setColour', label: L('color del personaje %1', 'set colour to %1'), args: [{ type: 'color' }] },
    { id: 'shape', kind: 'stmt', cat: 'looks', es: 'forma', en: 'setShape', label: L('cambiar la forma a %1', 'set shape to %1'), args: [{ type: 'choice', options: SHAPES }] },
    { id: 'size', kind: 'stmt', cat: 'looks', es: 'tamano', en: 'setSize', label: L('tamaño %1 %', 'set size to %1 %'), args: [{ type: 'num', def: 100 }] },
    { id: 'show', kind: 'stmt', cat: 'looks', es: 'mostrar', en: 'show', label: L('mostrar', 'show'), args: [] },
    { id: 'hide', kind: 'stmt', cat: 'looks', es: 'esconder', en: 'hide', label: L('esconder', 'hide'), args: [] },
    { id: 'note', kind: 'stmt', cat: 'sound', es: 'tocarNota', en: 'playNote', label: L('tocar la nota %1 durante %2 s', 'play note %1 for %2 s'), args: [{ type: 'choice', options: NOTES }, { type: 'num', def: 0.5 }] },
    { id: 'touchingEdge', kind: 'bool', cat: 'sensing', es: 'tocaBorde', en: 'touchingEdge', label: L('¿toca el borde?', 'touching edge?'), args: [] },
    { id: 'touching', kind: 'bool', cat: 'sensing', es: 'toca', en: 'touching', label: L('¿toca a %1?', 'touching %1?'), args: [{ type: 'str', def: L('Pelota', 'Ball') }] },
    { id: 'keyDown', kind: 'bool', cat: 'sensing', es: 'teclaPulsada', en: 'keyPressed', label: L('¿tecla %1 pulsada?', 'key %1 pressed?'), args: [{ type: 'key' }] },
    { id: 'distance', kind: 'num', cat: 'sensing', es: 'distanciaA', en: 'distanceTo', label: L('distancia a %1', 'distance to %1'), args: [{ type: 'str', def: L('Pelota', 'Ball') }] },
    { id: 'pointerX', kind: 'num', cat: 'sensing', es: 'punteroX', en: 'pointerX', label: L('puntero x', 'pointer x'), args: [] },
    { id: 'pointerY', kind: 'num', cat: 'sensing', es: 'punteroY', en: 'pointerY', label: L('puntero y', 'pointer y'), args: [] },
    { id: 'timer', kind: 'num', cat: 'sensing', es: 'cronometro', en: 'timer', label: L('cronómetro', 'timer'), args: [] },
    { id: 'physics', kind: 'stmt', cat: 'physics', es: 'activarFisica', en: 'physicsOn', label: L('activar física con gravedad %1', 'turn on physics with gravity %1'), args: [{ type: 'num', def: 9.8 }], tip: L('El personaje pasa a caer, chocar y rebotar. Gravedad 0: flota.', 'The sprite now falls, collides and bounces. Gravity 0: it floats.') },
    { id: 'push', kind: 'stmt', cat: 'physics', es: 'empujar', en: 'push', label: L('empujar x: %1 y: %2', 'push x: %1 y: %2'), args: [{ type: 'num', def: 0 }, { type: 'num', def: 300 }] },
    { id: 'bounciness', kind: 'stmt', cat: 'physics', es: 'rebote', en: 'bounciness', label: L('rebote %1 (0 a 1)', 'bounciness %1 (0 to 1)'), args: [{ type: 'num', def: 0.6 }] },
    { id: 'fixed', kind: 'stmt', cat: 'physics', es: 'fijar', en: 'fixInPlace', label: L('fijar en su sitio (suelo o pared)', 'fix in place (floor or wall)'), args: [] },
    { id: 'physicsOff', kind: 'stmt', cat: 'physics', es: 'quitarFisica', en: 'physicsOff', label: L('quitar la física', 'turn off physics'), args: [] },
    { id: 'onGround', kind: 'bool', cat: 'physics', es: 'tocaSuelo', en: 'onGround', label: L('¿toca el suelo?', 'on the ground?'), args: [] }
  ];
  var CATS = [
    { id: 'motion', es: 'Movimiento', en: 'Motion', colour: '#3f6fb0' }, { id: 'looks', es: 'Apariencia', en: 'Looks', colour: '#7a55b3' },
    { id: 'pen', es: 'Lápiz', en: 'Pen', colour: '#2d8a73' }, { id: 'sound', es: 'Sonido', en: 'Sound', colour: '#b0457a' },
    { id: 'sensing', es: 'Sensores', en: 'Sensing', colour: '#2f89a8' }, { id: 'physics', es: 'Física', en: 'Physics', colour: '#9a5b2a' }
  ];

  IG.defineEngine('programacion', {
    libs: ['pixi', 'blockly', 'codemirror', 'acorn'], version: 1, structureOpen: false, fileBase: LANG === 'en' ? 'coding' : 'programa',
    extraKeys: ['kRun', 'kStageKeys'],
    initialStart: function (para) { return { child: 'star', teen: 'catch', adult: 'generative' }[para] || 'star'; },
    starts: function (ctx) {
      var t = ctx.t;
      return [
        { id: 'hello', title: t('startHello'), desc: t('startHelloDesc'), para: 'any' },
        { id: 'star', title: t('startStar'), desc: t('startStarDesc'), para: 'child' },
        { id: 'catch', title: t('startCatch'), desc: t('startCatchDesc'), para: 'teen' },
        { id: 'bounce', title: t('startBounce'), desc: t('startBounceDesc'), para: 'teen' },
        { id: 'generative', title: t('startGen'), desc: t('startGenDesc'), para: 'adult' },
        { id: 'music', title: t('startMusic'), desc: t('startMusicDesc'), para: 'any' }
      ];
    },
    create: function (ctx) { return createStudio(ctx); }
  });

  var EXAMPLES = {
    hello: { sprites: [{ name: 'Flecha', shape: 'flecha', color: '#1f5f8b', x: -120, y: 0, code: "alEmpezar(() => {\n  decir('¡Hola!');\n  esperar(1);\n  for (let i = 0; i < 4; i++) {\n    avanzar(60);\n    girarIzquierda(90);\n  }\n  decir('Ya está');\n});" }] },
    star: { sprites: [{ name: 'Lápiz', shape: 'flecha', color: '#5a49a8', x: -80, y: 30, dir: 0, code: "alEmpezar(() => {\n  borrarDibujo();\n  colorLapiz('morado');\n  grosorLapiz(4);\n  bajarLapiz();\n  for (let i = 0; i < 5; i++) {\n    avanzar(160);\n    girarDerecha(144);\n  }\n  subirLapiz();\n});" }] },
    catch: { vars: ['puntos'], sprites: [
      { name: 'Cesta', shape: 'cuadrado', color: '#2e7d32', x: 0, y: -150, code: "let puntos = 0;\n\nalEmpezar(() => {\n  puntos = 0;\n  irA(0, -150);\n  while (true) {\n    if (teclaPulsada('izquierda')) {\n      cambiarX(-8);\n    }\n    if (teclaPulsada('derecha')) {\n      cambiarX(8);\n    }\n    esperar(0);\n  }\n});\n\nalRecibir('atrapada', () => {\n  puntos += 1;\n  decirDurante('Puntos: ' + puntos, 1);\n});" },
      { name: 'Pelota', shape: 'circulo', color: '#d86b00', x: 0, y: 160, code: "alEmpezar(() => {\n  while (true) {\n    irA(azar(-200, 200), 170);\n    while (!(posicionY() < -170)) {\n      cambiarY(-5);\n      if (toca('Cesta')) {\n        enviar('atrapada');\n        irA(azar(-200, 200), 170);\n      }\n    }\n  }\n});" }] },
    bounce: { sprites: [
      { name: 'Pelota', shape: 'circulo', color: '#d86b00', x: -100, y: 120, code: "alEmpezar(() => {\n  irA(-100, 120);\n  rebote(0.8);\n  activarFisica(9.8);\n  empujar(150, 0);\n});\n\nalPulsarTecla('espacio', () => {\n  empujar(0, 400);\n});" },
      { name: 'Rampa', shape: 'cuadrado', color: '#7d8b99', x: 60, y: -80, size: 250, dir: 20, code: "alEmpezar(() => {\n  fijar();\n});" }] },
    generative: { sprites: [{ name: 'Trazo', shape: 'flecha', color: '#197991', x: 0, y: 0, size: 60, code: "let paso = 0;\n\nalEmpezar(() => {\n  borrarDibujo();\n  irA(0, 0);\n  grosorLapiz(2);\n  bajarLapiz();\n  for (paso = 1; paso <= 120; paso += 1) {\n    if (paso % 3 === 0) {\n      colorLapiz('turquesa');\n    } else if (paso % 3 === 1) {\n      colorLapiz('morado');\n    } else {\n      colorLapiz('naranja');\n    }\n    avanzar(paso * 2);\n    girarIzquierda(121);\n  }\n  subirLapiz();\n  esconder();\n});" }] },
    music: { sprites: [{ name: 'Piano', shape: 'estrella', color: '#c2185b', x: 0, y: 0, code: "alEmpezar(() => {\n  tocarNota('do', 0.4);\n  tocarNota('mi', 0.4);\n  tocarNota('sol', 0.4);\n  tocarNota('do agudo', 0.8);\n});\n\nalTocar(() => {\n  tamano(140);\n  tocarNota('la', 0.3);\n  tamano(100);\n});" }] }
  };
  var EN_NAMES = { 'Flecha': 'Arrow', 'Lápiz': 'Pencil', 'Cesta': 'Basket', 'Pelota': 'Ball', 'Rampa': 'Ramp', 'Trazo': 'Stroke', 'Piano': 'Piano' };

  function createStudio(ctx) {
    var t = ctx.t, h = ctx.h, PIXI = root.PIXI;
    var S = null, selId = null, running = false, runtimes = {}, audio = null;
    var code = IG.Code.create(ctx, { api: API, categories: CATS, events: ['start', 'key', 'click', 'message'] });

    /* ---------- Disposición: código a la izquierda, escenario a la derecha ---------- */
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
      /* ---------- Escenario ---------- */
      var world = new PIXI.Container(); app.stage.addChild(world);
      var bg = new PIXI.Graphics(); world.addChild(bg);
      var penRT = PIXI.RenderTexture.create({ width: W, height: H, resolution: 2 });
      var penSprite = new PIXI.Sprite(penRT); world.addChild(penSprite);
      var penG = new PIXI.Graphics();
      var spriteLayer = new PIXI.Container(); world.addChild(spriteLayer);
      var bubbleLayer = new PIXI.Container(); world.addChild(bubbleLayer);
      var gfx = {}, bubbles = {};
      var pointer = { x: 0, y: 0 }, keysDown = {}, t0 = performance.now();
      var fitScale = 1;
      function layout() {
        var vw = ctx.viewport.clientWidth, vh = ctx.viewport.clientHeight;
        app.renderer.resize(vw, vh);
        fitScale = Math.min(vw / W, vh / H);
        world.scale.set(fitScale); world.x = (vw - W * fitScale) / 2; world.y = (vh - H * fitScale) / 2;
        requestRender();
      }
      if (root.ResizeObserver) new ResizeObserver(layout).observe(ctx.viewport);
      function drawBg() {
        bg.clear();
        bg.rect(0, 0, W, H).fill({ color: 0xffffff }).stroke({ width: 1, color: 0xc9d8e6 });
        for (var x = 0; x <= W; x += 40) bg.moveTo(x, 0).lineTo(x, H);
        for (var y = 0; y <= H; y += 40) bg.moveTo(0, y).lineTo(W, y);
        bg.stroke({ width: 1, color: 0xeef3f8 });
        bg.moveTo(W / 2, 0).lineTo(W / 2, H).moveTo(0, H / 2).lineTo(W, H / 2).stroke({ width: 1, color: 0xdbe5ef });
      }
      drawBg();
      function sx(x) { return W / 2 + x; } function sy(y) { return H / 2 - y; }

      var frame = 0;
      function requestRender() { if (!frame) frame = root.requestAnimationFrame(function () { frame = 0; render(); }); }

      function shapePath(g, shape, r) {
        switch (shape) {
          case 'circulo': g.circle(0, 0, r); break;
          case 'cuadrado': g.rect(-r, -r, 2 * r, 2 * r); break;
          case 'estrella': { var pts = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; pts.push(Math.cos(a) * rr, Math.sin(a) * rr); } g.poly(pts); break; }
          case 'nave': g.poly([r, 0, -r * 0.8, -r * 0.7, -r * 0.4, 0, -r * 0.8, r * 0.7]); break;
          case 'pez': g.ellipse(-r * 0.1, 0, r * 0.75, r * 0.45); g.poly([-r * 0.7, 0, -r * 1.1, -r * 0.45, -r * 1.1, r * 0.45]); break;
          case 'robot': g.roundRect(-r * 0.8, -r * 0.8, r * 1.6, r * 1.6, r * 0.25); break;
          default: g.poly([r, 0, -r * 0.7, -r * 0.6, -r * 0.35, 0, -r * 0.7, r * 0.6]);
        }
      }
      function drawSprite(sp) {
        var g = gfx[sp.id];
        if (!g) { g = new PIXI.Graphics(); gfx[sp.id] = g; spriteLayer.addChild(g); }
        g.clear();
        var r = 18 * (sp.size || 100) / 100, col = parseInt(String(sp.color || '#1f5f8b').slice(1), 16);
        shapePath(g, sp.shape, r); g.fill({ color: col }).stroke({ width: 2, color: 0x172b42 });
        if (sp.shape === 'robot') { g.circle(r * 0.35, -r * 0.25, r * 0.16).fill({ color: 0xffffff }); g.circle(r * 0.35, r * 0.25, r * 0.16).fill({ color: 0xffffff }); }
        if (sp.shape === 'pez') g.circle(r * 0.35, -r * 0.1, r * 0.09).fill({ color: 0x172b42 });
        if (selId === sp.id && !running) { g.circle(0, 0, r + 8).stroke({ width: 2, color: 0x5a49a8, alpha: 0.9 }); }
        g.x = sx(sp.x); g.y = sy(sp.y); g.rotation = -sp.dir * Math.PI / 180; g.visible = sp.visible !== false;
        /* burbuja de texto */
        var bb = bubbles[sp.id];
        if (sp.saying) {
          if (!bb) { bb = { c: new PIXI.Container(), bg: new PIXI.Graphics(), txt: new PIXI.Text({ text: '', style: { fontFamily: 'Atkinson Hyperlegible, Arial, sans-serif', fontSize: 14, fill: '#172b42', wordWrap: true, wordWrapWidth: 150 } }) }; bb.c.addChild(bb.bg); bb.c.addChild(bb.txt); bubbleLayer.addChild(bb.c); bubbles[sp.id] = bb; }
          bb.txt.text = sp.saying; bb.bg.clear();
          var bw = bb.txt.width + 16, bh = bb.txt.height + 10;
          bb.bg.roundRect(0, 0, bw, bh, 10).fill({ color: 0xffffff }).stroke({ width: 1.5, color: 0x172b42 }); bb.bg.moveTo(12, bh).lineTo(18, bh + 8).lineTo(24, bh).fill({ color: 0xffffff });
          bb.txt.x = 8; bb.txt.y = 5; bb.c.x = Math.min(W - bw - 2, Math.max(2, sx(sp.x) + r * 0.6)); bb.c.y = Math.max(2, sy(sp.y) - r - bh - 8); bb.c.visible = sp.visible !== false;
        } else if (bb) bb.c.visible = false;
      }
      function render() {
        Object.keys(gfx).forEach(function (id) { if (!S.sprites.some(function (s) { return s.id === id; })) { gfx[id].destroy(); delete gfx[id]; if (bubbles[id]) { bubbles[id].c.destroy({ children: true }); delete bubbles[id]; } } });
        S.sprites.forEach(drawSprite);
        app.render();
      }

      /* ---------- Lápiz ---------- */
      function penLine(sp, x1, y1, x2, y2) {
        if (!sp.pen) return;
        penG.clear(); penG.moveTo(sx(x1), sy(y1)).lineTo(sx(x2), sy(y2)).stroke({ width: sp.penSize || 3, color: parseInt(String(sp.penColor || '#172b42').slice(1), 16), cap: 'round' });
        app.renderer.render({ container: penG, target: penRT, clear: false });
      }
      function clearPen() { penG.clear(); app.renderer.render({ container: penG, target: penRT, clear: true }); }

      /* ---------- Física opcional (Rapier o Planck) ---------- */
      var phys = null, physReady = null;
      var PX = 40; /* 40 px del escenario = 1 m */
      function ensurePhysics() {
        if (phys) return Promise.resolve(phys);
        if (physReady) return physReady;
        physReady = IGPhysics.backend(IG).then(function (kind) {
          var wd = IGPhysics.createWorld(kind, { gravity: -9.8, velocityIterations: 10, positionIterations: 6 });
          ctx.setTech('physics', kind === 'rapier' ? 'Rapier 0.21 (WebAssembly)' : 'Planck.js 1.5 (Box2D, JavaScript)');
          var w = W / PX, hh = H / PX, th = 1;
          wd.addBody({ type: 'static', x: 0, y: -hh / 2 - th / 2, shape: { type: 'box', w: w + 2, h: th } });
          wd.addBody({ type: 'static', x: 0, y: hh / 2 + th / 2, shape: { type: 'box', w: w + 2, h: th } });
          wd.addBody({ type: 'static', x: -w / 2 - th / 2, y: 0, shape: { type: 'box', w: th, h: hh + 2 } });
          wd.addBody({ type: 'static', x: w / 2 + th / 2, y: 0, shape: { type: 'box', w: th, h: hh + 2 } });
          phys = { world: wd, bodies: {} };
          return phys;
        });
        return physReady;
      }
      function physShape(sp) {
        var r = 18 * (sp.size || 100) / 100 / PX;
        if (sp.shape === 'circulo' || sp.shape === 'estrella') return { type: 'circle', r: r };
        return { type: 'box', w: 2 * r * (sp.shape === 'cuadrado' || sp.shape === 'robot' ? 1 : 0.9), h: 2 * r * (sp.shape === 'cuadrado' || sp.shape === 'robot' ? 1 : 0.6) };
      }
      function physAdd(sp, gravityScale, fixed) {
        return ensurePhysics().then(function (p) {
          if (p.bodies[sp.id]) { p.world.removeBody(p.bodies[sp.id].id); }
          var id = p.world.addBody({ type: fixed ? 'static' : 'dynamic', x: sp.x / PX, y: sp.y / PX, angle: sp.dir * Math.PI / 180, shape: physShape(sp), density: 1, friction: 0.4, restitution: sp.bounce === undefined ? 0.4 : sp.bounce });
          p.bodies[sp.id] = { id: id, g: gravityScale, fixed: !!fixed };
          sp.physics = true;
        });
      }
      function physRemove(sp) { if (phys && phys.bodies[sp.id]) { phys.world.removeBody(phys.bodies[sp.id].id); delete phys.bodies[sp.id]; } sp.physics = false; }
      function physStep(dt) {
        if (!phys) return;
        var p = phys;
        Object.keys(p.bodies).forEach(function (id) {
          var b = p.bodies[id]; if (b.fixed) return;
          /* gravedad propia por personaje: se compensa la global (9,8) y se aplica la elegida */
          var m = p.world.mass(b.id); p.world.applyForce(b.id, 0, m * (9.8 - b.g));
        });
        p.world.step(dt);
        S.sprites.forEach(function (sp) {
          var b = p.bodies[sp.id]; if (!b || b.fixed) return;
          var q = p.world.get(b.id); if (!q) return;
          var nx = q.x * PX, ny = q.y * PX; penLine(sp, sp.x, sp.y, nx, ny);
          sp.x = nx; sp.y = ny; sp.dir = ((q.angle * 180 / Math.PI) % 360 + 360) % 360;
        });
      }
      function syncBody(sp) { if (phys && phys.bodies[sp.id]) phys.world.setPose(phys.bodies[sp.id].id, sp.x / PX, sp.y / PX, sp.dir * Math.PI / 180); }

      /* ---------- Sonido (Web Audio, solo tras pulsar Ejecutar) ---------- */
      function tone(note, dur) {
        if (!audio) return;
        var f = NOTE_HZ[note] || 440, now = audio.currentTime, o = audio.createOscillator(), g = audio.createGain();
        o.type = 'triangle'; o.frequency.value = f;
        g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(0.18, now + 0.02); g.gain.setTargetAtTime(0, now + Math.max(0.05, dur - 0.08), 0.04);
        o.connect(g); g.connect(audio.destination); o.start(now); o.stop(now + dur + 0.2);
      }

      /* ---------- API: lo que hace cada bloque ---------- */
      function spriteByName(name) { var n = String(name).toLowerCase(); for (var i = 0; i < S.sprites.length; i++) if (S.sprites[i].name.toLowerCase() === n) return S.sprites[i]; return null; }
      function radius(sp) { return 18 * (sp.size || 100) / 100; }
      function onEdge(sp) { var r = radius(sp); return sp.x - r <= -W / 2 || sp.x + r >= W / 2 || sp.y - r <= -H / 2 || sp.y + r >= H / 2; }
      function clampPos(sp) { sp.x = Math.max(-W / 2 - 40, Math.min(W / 2 + 40, sp.x)); sp.y = Math.max(-H / 2 - 40, Math.min(H / 2 + 40, sp.y)); }
      var log = [];
      function say(sp, text) {
        sp.saying = String(text).slice(0, 200);
        log.push(sp.name + ': ' + sp.saying); if (log.length > 60) log.shift();
        renderLog(); if (sp.saying) ctx.announce(sp.name + ': ' + sp.saying);
      }
      function makeRuntime(sp) {
        return new code.Runtime({
          callStmt: function (fn, a) {
            var ox = sp.x, oy = sp.y, rad;
            switch (fn) {
              case 'forward': rad = sp.dir * Math.PI / 180; sp.x += Math.cos(rad) * a[0]; sp.y += Math.sin(rad) * a[0]; clampPos(sp); penLine(sp, ox, oy, sp.x, sp.y); syncBody(sp); break;
              case 'turnRight': sp.dir = ((sp.dir - Number(a[0])) % 360 + 360) % 360; syncBody(sp); break;
              case 'turnLeft': sp.dir = ((sp.dir + Number(a[0])) % 360 + 360) % 360; syncBody(sp); break;
              case 'goTo': sp.x = Number(a[0]) || 0; sp.y = Number(a[1]) || 0; clampPos(sp); penLine(sp, ox, oy, sp.x, sp.y); syncBody(sp); break;
              case 'glide': {
                var dur = Math.max(0, Number(a[0]) || 0), tx = Number(a[1]) || 0, ty = Number(a[2]) || 0, start = performance.now(), fx = sp.x, fy = sp.y;
                return { until: function () {
                  var u = dur ? Math.min(1, (performance.now() - start) / (dur * 1000)) : 1, px = sp.x, py = sp.y;
                  sp.x = fx + (tx - fx) * u; sp.y = fy + (ty - fy) * u; penLine(sp, px, py, sp.x, sp.y); syncBody(sp); return u >= 1;
                } };
              }
              case 'point': sp.dir = ((Number(a[0]) || 0) % 360 + 360) % 360; syncBody(sp); break;
              case 'changeX': sp.x += Number(a[0]) || 0; clampPos(sp); penLine(sp, ox, oy, sp.x, sp.y); syncBody(sp); break;
              case 'changeY': sp.y += Number(a[0]) || 0; clampPos(sp); penLine(sp, ox, oy, sp.x, sp.y); syncBody(sp); break;
              case 'bounce': {
                var r = radius(sp), d = sp.dir * Math.PI / 180, dx = Math.cos(d), dy = Math.sin(d);
                if (sp.x - r < -W / 2) { dx = Math.abs(dx); sp.x = -W / 2 + r; } if (sp.x + r > W / 2) { dx = -Math.abs(dx); sp.x = W / 2 - r; }
                if (sp.y - r < -H / 2) { dy = Math.abs(dy); sp.y = -H / 2 + r; } if (sp.y + r > H / 2) { dy = -Math.abs(dy); sp.y = H / 2 - r; }
                sp.dir = ((Math.atan2(dy, dx) * 180 / Math.PI) % 360 + 360) % 360; syncBody(sp); break;
              }
              case 'penDown': sp.pen = true; break;
              case 'penUp': sp.pen = false; break;
              case 'penColor': sp.penColor = code.colorHex(a[0]); break;
              case 'penSize': sp.penSize = Math.max(1, Math.min(40, Number(a[0]) || 1)); break;
              case 'stamp': stampSprite(sp); break;
              case 'clear': clearPen(); break;
              case 'say': say(sp, a[0]); break;
              case 'sayFor': { say(sp, a[0]); var until = performance.now() + Math.max(0, Math.min(60, Number(a[1]) || 0)) * 1000, msg = sp.saying; return { until: function () { if (performance.now() < until) return false; if (sp.saying === msg) sp.saying = ''; return true; } }; }
              case 'color': sp.color = code.colorHex(a[0]); break;
              case 'shape': sp.shape = String(a[0]); if (sp.physics) physAdd(sp, phys.bodies[sp.id] ? phys.bodies[sp.id].g : 9.8, phys.bodies[sp.id] && phys.bodies[sp.id].fixed); break;
              case 'size': sp.size = Math.max(10, Math.min(400, Number(a[0]) || 100)); break;
              case 'show': sp.visible = true; break;
              case 'hide': sp.visible = false; break;
              case 'note': { var dur2 = Math.max(0.05, Math.min(8, Number(a[1]) || 0.5)); tone(a[0], dur2); return { wait: dur2 }; }
              case 'physics': physAdd(sp, Math.max(-30, Math.min(30, Number(a[0]))), false); break;
              case 'push': if (phys && phys.bodies[sp.id]) { var m = phys.world.mass(phys.bodies[sp.id].id); phys.world.applyImpulse(phys.bodies[sp.id].id, m * (Number(a[0]) || 0) / PX, m * (Number(a[1]) || 0) / PX); } break;
              case 'bounciness': sp.bounce = Math.max(0, Math.min(1, Number(a[0]) || 0)); if (sp.physics) physAdd(sp, phys.bodies[sp.id] ? phys.bodies[sp.id].g : 9.8, phys.bodies[sp.id] && phys.bodies[sp.id].fixed); break;
              case 'fixed': physAdd(sp, 0, true); break;
              case 'physicsOff': physRemove(sp); break;
            }
            return null;
          },
          callValue: function (fn, a) {
            switch (fn) {
              case 'x': return Math.round(sp.x * 100) / 100; case 'y': return Math.round(sp.y * 100) / 100; case 'dir': return Math.round(sp.dir * 100) / 100;
              case 'touchingEdge': return onEdge(sp);
              case 'touching': { var o = spriteByName(a[0]); if (!o || o === sp || o.visible === false || sp.visible === false) return false; return Math.hypot(o.x - sp.x, o.y - sp.y) < radius(o) + radius(sp) - 2; }
              case 'keyDown': return !!keysDown[a[0]];
              case 'distance': { var o2 = spriteByName(a[0]); return o2 ? Math.round(Math.hypot(o2.x - sp.x, o2.y - sp.y) * 10) / 10 : 0; }
              case 'pointerX': return Math.round(pointer.x); case 'pointerY': return Math.round(pointer.y);
              case 'timer': return Math.round((performance.now() - t0) / 100) / 10;
              case 'onGround': return sp.y - radius(sp) <= -H / 2 + 3;
            }
            return 0;
          },
          onStep: function (id) { if (sp.id === selId) code.highlight(id); },
          onError: function (msg) { log.push(sp.name + ' · ' + t('error') + ': ' + msg); renderLog(); ctx.announce(msg); },
          onVar: function () { renderVars(); },
          broadcast: function (msg) { Object.keys(runtimes).forEach(function (k) { runtimes[k].fire('message', msg); }); }
        });
      }
      function stampSprite(sp) {
        var g = gfx[sp.id]; if (!g) return;
        var tmp = new PIXI.Container(); var clone = g.clone(); tmp.addChild(clone); clone.x = g.x; clone.y = g.y; clone.rotation = g.rotation;
        app.renderer.render({ container: tmp, target: penRT, clear: false }); tmp.destroy({ children: true });
      }

      /* ---------- Ejecutar / parar ---------- */
      var sharedVars = {}, loopId = 0, lastT = 0;
      function saveCurrentBlocks() { var sp = current(); if (sp) sp.blocks = code.getState(); }
      function run() {
        if (running) stop(true);
        saveCurrentBlocks();
        try { if (!audio && (root.AudioContext || root.webkitAudioContext)) { audio = new (root.AudioContext || root.webkitAudioContext)(); ctx.setTech('audio', 'Web Audio'); } if (audio && audio.state === 'suspended') audio.resume(); } catch (_) { audio = null; }
        S.initial = S.sprites.map(function (sp) { return { id: sp.id, x: sp.x, y: sp.y, dir: sp.dir, size: sp.size, color: sp.color, shape: sp.shape, visible: sp.visible }; });
        sharedVars = {}; runtimes = {}; log = []; t0 = performance.now();
        S.sprites.forEach(function (sp) { sp.pen = false; sp.saying = ''; sp.penColor = '#172b42'; sp.penSize = 3; sp.physics = false; sp.bounce = undefined; });
        clearPen();
        if (phys) { phys.world.destroy(); phys = null; physReady = null; }
        var problems = 0;
        S.sprites.forEach(function (sp) {
          var ast = code.blocksToAst(sp.blocks || { blocks: { languageVersion: 0, blocks: [] } });
          var rt = makeRuntime(sp); rt.load(ast);
          ast.vars.forEach(function (v) { if (!(v in sharedVars)) sharedVars[v] = 0; });
          rt.vars = sharedVars; runtimes[sp.id] = rt; problems += ast.loose;
        });
        running = true; setRunUI();
        Object.keys(runtimes).forEach(function (k) { runtimes[k].start(); });
        ctx.announce(t('running') + (problems ? ' ' + t('looseBlocks', { n: problems }) : ''));
        renderLog(); renderVars();
        lastT = performance.now(); loopId = root.requestAnimationFrame(loop);
        ctx.viewport.focus({ preventScroll: true });
      }
      function loop(now) {
        if (!running) return;
        var dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
        physStep(dt);
        Object.keys(runtimes).forEach(function (k) { runtimes[k].tick(now); });
        render();
        var busy = Object.keys(runtimes).some(function (k) { return runtimes[k].threads.length; }) || (phys && Object.keys(phys.bodies).length);
        if (!busy) { stop(false); return; }
        loopId = root.requestAnimationFrame(loop);
      }
      function stop(silent) {
        if (!running) return;
        running = false; root.cancelAnimationFrame(loopId);
        Object.keys(runtimes).forEach(function (k) { runtimes[k].stop(); });
        code.clearHighlight(); setRunUI(); render();
        if (!silent) ctx.announce(t('stopped'));
      }
      function reset() {
        stop(true);
        if (S.initial) S.initial.forEach(function (st) { var sp = byId(st.id); if (sp) Object.assign(sp, st); });
        S.sprites.forEach(function (sp) { sp.saying = ''; sp.pen = false; });
        clearPen(); if (phys) { phys.world.destroy(); phys = null; physReady = null; }
        renderSide(); requestRender(); ctx.announce(t('resetDone'));
      }

      /* ---------- Entrada en el escenario ---------- */
      function stagePoint(e) { var r = ctx.viewport.getBoundingClientRect(); var lx = (e.clientX - r.left - world.x) / fitScale, ly = (e.clientY - r.top - world.y) / fitScale; return { x: lx - W / 2, y: H / 2 - ly }; }
      function hitSprite(p) { for (var i = S.sprites.length - 1; i >= 0; i--) { var sp = S.sprites[i]; if (sp.visible !== false && Math.hypot(sp.x - p.x, sp.y - p.y) <= radius(sp) + 6) return sp; } return null; }
      var dragging = null;
      ctx.viewport.addEventListener('pointerdown', function (e) {
        var p = stagePoint(e); pointer = p;
        var sp = hitSprite(p);
        if (running) { if (sp && runtimes[sp.id]) runtimes[sp.id].fire('click'); return; }
        if (sp) { select(sp.id); dragging = { id: sp.id, dx: sp.x - p.x, dy: sp.y - p.y, moved: false }; ctx.viewport.setPointerCapture(e.pointerId); }
      });
      ctx.viewport.addEventListener('pointermove', function (e) {
        var p = stagePoint(e); pointer = p;
        if (dragging) { var sp = byId(dragging.id); sp.x = Math.round(p.x + dragging.dx); sp.y = Math.round(p.y + dragging.dy); clampPos(sp); dragging.moved = true; requestRender(); }
      });
      ctx.viewport.addEventListener('pointerup', function () { if (dragging && dragging.moved) { var sp = byId(dragging.id); ctx.commit(t('movedSprite', { name: sp.name })); renderSide(); } dragging = null; });
      ctx.viewport.addEventListener('keydown', function (e) {
        var k = null; Object.keys(code.KEY_CODE).forEach(function (id) { if (code.KEY_CODE[id] === e.key || (id.length === 1 && e.key.toLowerCase() === id)) k = id; });
        if (running && k) { e.preventDefault(); if (!keysDown[k]) Object.keys(runtimes).forEach(function (r) { runtimes[r].fire('key', k); }); keysDown[k] = true; return; }
        if (!running && current() && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(e.key) >= 0) {
          e.preventDefault(); var sp = current(), st = e.shiftKey ? 20 : 5;
          if (e.key === 'ArrowLeft') sp.x -= st; if (e.key === 'ArrowRight') sp.x += st; if (e.key === 'ArrowUp') sp.y += st; if (e.key === 'ArrowDown') sp.y -= st;
          clampPos(sp); requestRender(); ctx.announce(t('spriteAt', { name: sp.name, x: Math.round(sp.x), y: Math.round(sp.y) })); ctx.commit(t('movedSprite', { name: sp.name })); renderSide();
        }
      });
      ctx.viewport.addEventListener('keyup', function (e) { Object.keys(code.KEY_CODE).forEach(function (id) { if (code.KEY_CODE[id] === e.key || (id.length === 1 && e.key.toLowerCase() === id)) keysDown[id] = false; }); });
      ctx.viewport.addEventListener('blur', function () { keysDown = {}; });

      /* ---------- Personajes: lista (estructura) y propiedades ---------- */
      function byId(id) { for (var i = 0; i < S.sprites.length; i++) if (S.sprites[i].id === id) return S.sprites[i]; return null; }
      function current() { return byId(selId); }
      function select(id) {
        if (id === selId) { renderSide(); requestRender(); return; }
        saveCurrentBlocks(); selId = id;
        var sp = current(); if (sp) code.setState(sp.blocks);
        renderSide(); requestRender();
        if (sp) ctx.announce(t('editingSprite', { name: sp.name }));
      }
      function newSprite(name, shape, color) {
        S.seq += 1;
        var base = name || t('spriteN', { n: S.seq }), nm = base, k = 2;
        while (spriteByName(nm)) { nm = base + ' ' + k; k += 1; }
        return { id: 's' + S.seq, name: nm, shape: shape || 'flecha', color: color || '#1f5f8b', x: 0, y: 0, dir: 0, size: 100, visible: true, blocks: { blocks: { languageVersion: 0, blocks: [{ type: 'igs_on_start', x: 20, y: 20 }] } } };
      }
      var logBox = h('ol', { class: 'igs-log' });
      function renderLog() { ctx.clear(logBox); if (!log.length) logBox.appendChild(h('li', { class: 'igs-muted', text: t('logEmpty') })); log.slice(-30).forEach(function (l) { logBox.appendChild(h('li', { text: l })); }); }
      var varsBox = h('dl', { class: 'igs-vars' });
      function renderVars() { ctx.clear(varsBox); Object.keys(sharedVars).forEach(function (k) { varsBox.append(h('dt', { text: k }), h('dd', { text: String(sharedVars[k]) })); }); }
      function renderSide() {
        var list = [h('h3', { text: t('sprites') })], ul = h('ul', { class: 'igs-list' });
        S.sprites.forEach(function (sp) {
          var b = h('button', { type: 'button', 'aria-current': String(sp.id === selId) }, h('span', { class: 'igs-swatch', style: 'background:' + sp.color }), h('span', { text: sp.name }), h('small', { text: code.colorName(sp.color) }));
          b.addEventListener('click', function () { select(sp.id); });
          ul.appendChild(h('li', null, b));
        });
        list.push(ul);
        list.push(h('div', { class: 'igs-actions' }, ctx.button(t('addSprite'), { icon: 'plus', onClick: addSprite }), ctx.button(t('duplicate'), { icon: 'copy', onClick: duplicateSprite })));
        ctx.setStructure(list);

        var F = ctx.fields, sp = current(), out = [];
        if (sp) {
          out.push(h('h4', { text: sp.name }));
          out.push(F.text(t('name'), sp.name, { max: 30, onChange: function (v) { v = String(v).trim().slice(0, 30); if (!v || (spriteByName(v) && spriteByName(v) !== sp)) { ctx.announce(t('nameTaken')); renderSide(); return; } sp.name = v; ctx.commit(t('renamed')); renderSide(); } }));
          out.push(F.number('x', Math.round(sp.x), { min: -W / 2, max: W / 2, step: 1, onChange: function (v) { sp.x = v; ctx.commit('x'); requestRender(); } }));
          out.push(F.number('y', Math.round(sp.y), { min: -H / 2, max: H / 2, step: 1, onChange: function (v) { sp.y = v; ctx.commit('y'); requestRender(); } }));
          out.push(F.number(t('direction'), Math.round(sp.dir), { unit: '°', min: 0, max: 359, step: 15, onChange: function (v) { sp.dir = v; ctx.commit(t('direction')); requestRender(); } }));
          out.push(F.select(t('shape'), sp.shape, SHAPES.map(function (s) { return [s[0], s[LANG === 'en' ? 2 : 1]]; }), { onChange: function (v) { sp.shape = v; ctx.commit(t('shape')); requestRender(); } }));
          out.push(F.select(t('colour'), sp.color, IG.Code.COLORS.map(function (c) { return [c[2], c[LANG === 'en' ? 1 : 0]]; }), { onChange: function (v) { sp.color = v; ctx.commit(t('colour')); renderSide(); requestRender(); } }));
          out.push(F.range(t('size'), sp.size, { min: 20, max: 300, step: 10, unit: '%', format: function (v) { return String(v); }, onChange: function (v) { sp.size = v; ctx.commit(t('size')); requestRender(); } }));
          out.push(h('div', { class: 'igs-actions' }, ctx.button(t('deleteSprite'), { icon: 'trash', class: 'igs-danger', onClick: deleteSprite, disabled: S.sprites.length <= 1 })));
        }
        var bf = code.blockFields && code.blockFields();
        if (bf) { out = bf.concat(out); }
        out.push(h('h4', { text: t('output') })); out.push(logBox); renderLog();
        out.push(h('h4', { text: t('variables') })); out.push(varsBox); renderVars();
        ctx.setInspector(out);
        ctx.setSummary(S.sprites.map(function (s) { return t('spriteSummary', { name: s.name, x: Math.round(s.x), y: Math.round(s.y), dir: Math.round(s.dir), shape: shapeName(s.shape) }); }).join(' '));
      }
      function shapeName(k) { for (var i = 0; i < SHAPES.length; i++) if (SHAPES[i][0] === k) return SHAPES[i][LANG === 'en' ? 2 : 1]; return k; }
      function addSprite() { saveCurrentBlocks(); var sp = newSprite(null, 'circulo', IG.Code.COLORS[S.sprites.length % IG.Code.COLORS.length][2]); sp.x = (S.sprites.length * 60) % 200 - 100; S.sprites.push(sp); ctx.commit(t('addSprite')); select(sp.id); }
      function duplicateSprite() { var src = current(); if (!src) return; saveCurrentBlocks(); var sp = JSON.parse(JSON.stringify(src)); var n = newSprite(src.name, src.shape, src.color); sp.id = n.id; sp.name = n.name; sp.x += 30; sp.y -= 30; S.sprites.push(sp); ctx.commit(t('duplicate')); select(sp.id); }
      function deleteSprite() { if (S.sprites.length <= 1) return; var sp = current(); S.sprites = S.sprites.filter(function (s) { return s !== sp; }); selId = null; ctx.commit(t('deleteSprite')); select(S.sprites[0].id); ctx.announce(t('deleted', { name: sp.name })); }

      code.onChange(function () { saveCurrentBlocks(); ctx.commit(t('codeChanged')); });
      if (code.onSelect) code.onSelect(function () { renderSide(); });

      /* ---------- Herramientas ---------- */
      var runBtn, stopBtn;
      function setRunUI() {
        if (!runBtn) return;
        runBtn.setAttribute('aria-pressed', String(running));
        stopBtn.disabled = !running;
        ctx.app.dataset.igsRunning = String(running);
      }
      ctx.setTools([
        { id: 'run', label: t('run'), icon: 'play', primary: true, keys: 'Control+Enter', action: function () { run(); } },
        { id: 'stop', label: t('stop'), icon: 'stop', action: function () { stop(false); } },
        { id: 'reset', label: t('reset'), icon: 'undo', action: function () { reset(); } },
        { separator: true },
        { id: 'add', label: t('addSprite'), icon: 'plus', action: function () { addSprite(); } },
        { id: 'blocksTab', label: t('tabBlocks'), icon: 'blocks', level: 'more', action: function () { code.selectTab('blocks'); } },
        { id: 'codeTab', label: 'JavaScript', icon: 'code', level: 'more', action: function () { code.selectTab('js'); } }
      ]);
      runBtn = ctx.toolbar.querySelector('.igs-primary'); stopBtn = Array.prototype.filter.call(ctx.toolbar.querySelectorAll('.igs-btn'), function (b) { return b.textContent === t('stop'); })[0];
      setRunUI();
      ctx.command('run', t('run'), '', run); ctx.command('stop', t('stop'), '', function () { stop(false); });
      document.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && ctx.app.contains(e.target)) { e.preventDefault(); run(); } });

      /* ---------- Exportaciones ---------- */
      ctx.addExport(t('exportPng'), function () {
        render(); var src = app.renderer.extract.canvas({ target: world, frame: new PIXI.Rectangle(0, 0, W, H) });
        ctx.canvasBlob(ctx.canvasWithCredit(src, '#ffffff')).then(function (b) { ctx.download(b, (LANG === 'en' ? 'stage-' : 'escenario-') + ctx.stamp() + '.png'); });
      });
      ctx.addExport(t('exportJs'), function () {
        saveCurrentBlocks();
        var txt = S.sprites.map(function (sp) { return '// ' + t('spriteWord') + ': ' + sp.name + '\n' + code.astToJs(code.blocksToAst(sp.blocks)); }).join('\n');
        ctx.download(new Blob([txt], { type: 'text/javascript' }), (LANG === 'en' ? 'program-' : 'programa-') + ctx.stamp() + '.js');
      });
      ctx.addExport(t('exportPy'), function () {
        saveCurrentBlocks();
        var txt = S.sprites.map(function (sp) { return '# ' + t('spriteWord') + ': ' + sp.name + '\n' + code.astToPy(code.blocksToAst(sp.blocks)); }).join('\n');
        ctx.download(new Blob([txt], { type: 'text/x-python' }), (LANG === 'en' ? 'program-' : 'programa-') + ctx.stamp() + '.py');
      });

      /* ---------- Ejemplos ---------- */
      function fromExample(id) {
        var ex = EXAMPLES[id] || EXAMPLES.hello;
        S = { v: 1, seq: 0, sprites: [] };
        ex.sprites.forEach(function (d) {
          var nm = LANG === 'en' ? (EN_NAMES[d.name] || d.name) : d.name;
          var sp = newSprite(nm, d.shape, d.color); sp.x = d.x || 0; sp.y = d.y || 0; sp.dir = d.dir === undefined ? 0 : d.dir; sp.size = d.size || 100;
          var src = d.code;
          if (LANG === 'en') Object.keys(EN_NAMES).forEach(function (k) { src = src.split("'" + k + "'").join("'" + EN_NAMES[k] + "'"); });
          try { sp.blocks = code.astToBlocks(code.astFromJs(src)); } catch (err) { if (root.console) console.error('ejemplo', id, err); }
          S.sprites.push(sp);
        });
        selId = null; stop(true); clearPen();
        select(S.sprites[0].id); requestRender();
      }

      S = { v: 1, seq: 0, sprites: [] };
      layout();
      return {
        serialize: function () { saveCurrentBlocks(); return { v: 1, seq: S.seq, sprites: S.sprites.map(function (sp) { return { id: sp.id, name: sp.name, shape: sp.shape, color: sp.color, x: sp.x, y: sp.y, dir: sp.dir, size: sp.size, visible: sp.visible !== false, blocks: sp.blocks }; }), sel: selId }; },
        restore: function (st) {
          stop(true);
          S = { v: 1, seq: st.seq, sprites: st.sprites.map(function (sp) { return JSON.parse(JSON.stringify(sp)); }) };
          var keep = byId(st.sel) ? st.sel : S.sprites[0].id; selId = null; select(keep); requestRender();
        },
        validate: function (d) {
          return d && Array.isArray(d.sprites) && d.sprites.length >= 1 && d.sprites.length <= 30 && d.sprites.every(function (sp) {
            return sp && typeof sp.id === 'string' && typeof sp.name === 'string' && isFinite(sp.x) && isFinite(sp.y) && isFinite(sp.dir) && sp.blocks && typeof sp.blocks === 'object';
          });
        },
        start: function (id) { fromExample(id === 'empty' ? null : id); if (id === 'empty') { S = { v: 1, seq: 0, sprites: [] }; S.sprites.push(newSprite(LANG === 'en' ? 'Arrow' : 'Flecha')); selId = null; select(S.sprites[0].id); } },
        onKey: function (e) { return false; }
      };
    }
  }
})(window);
