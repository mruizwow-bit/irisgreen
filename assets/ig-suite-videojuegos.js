/* Iris Green · El taller · Estudio de videojuegos (R43).
   Editor de niveles con PixiJS: pintar suelo, plataformas, peligros, monedas, enemigos,
   llaves y puertas; reglas del juego en el panel; probar dentro del editor y exportar un
   juego jugable en un solo archivo HTML (el mismo motor que se usa al probar). */
(function (root) {
  'use strict';
  var IG = root.IGSuite; if (!IG) return;
  var LANG = IG.lang;
  var TOOLS = [
    { id: 'solid', c: '#', icon: 'wall' }, { id: 'platform', c: '=', icon: 'minus' }, { id: 'coin', c: 'o', icon: 'coin' }, { id: 'hazard', c: '^', icon: 'warn' },
    { id: 'goal', c: 'F', icon: 'flag' }, { id: 'enemy', c: 'E', icon: 'enemy' }, { id: 'player', c: 'P', icon: 'player' }, { id: 'erase', c: '.', icon: 'erase' },
    { id: 'spring', c: 'S', icon: 'sparkle', more: true }, { id: 'ice', c: 'I', icon: 'square', more: true }, { id: 'key', c: 'k', icon: 'star', more: true }, { id: 'door', c: 'D', icon: 'door', more: true },
    { id: 'pan', c: null, icon: 'pan', more: true }
  ];
  var CHAR_NAME = { '#': 'solid', '=': 'platform', 'o': 'coin', '^': 'hazard', 'F': 'goal', 'E': 'enemy', 'P': 'player', 'S': 'spring', 'I': 'ice', 'k': 'key', 'D': 'door', '.': 'empty' };
  var BG = [['cielo', 'sky', '#dff0fb'], ['atardecer', 'sunset', '#fde7d3'], ['noche', 'night', '#1d2a44'], ['cueva', 'cave', '#3b3a36'], ['niebla', 'mist', '#eef1f4']];
  var PLAYER_COLORS = [['azul', 'blue', '#1f5f8b'], ['morado', 'purple', '#5a49a8'], ['verde', 'green', '#2e7d32'], ['naranja', 'orange', '#d86b00'], ['rosa', 'pink', '#c2185b']];

  IG.defineEngine('videojuegos', {
    libs: ['pixi'], version: 1, fileBase: LANG === 'en' ? 'game' : 'juego',
    extraKeys: ['kPaint', 'kPlayGame'],
    initialStart: function (para) { return { child: 'first', teen: 'platformer', adult: 'maze' }[para] || 'first'; },
    starts: function (ctx) {
      var t = ctx.t;
      return [
        { id: 'first', title: t('stFirst'), desc: t('stFirstD'), para: 'child' },
        { id: 'platformer', title: t('stPlat'), desc: t('stPlatD'), para: 'teen' },
        { id: 'ice', title: t('stIce'), desc: t('stIceD'), para: 'teen' },
        { id: 'maze', title: t('stMaze'), desc: t('stMazeD'), para: 'adult' },
        { id: 'speedrun', title: t('stSpeed'), desc: t('stSpeedD'), para: 'adult' }
      ];
    },
    create: function (ctx) { return createStudio(ctx); }
  });

  function blankTiles(w, h, mode) {
    var rows = [];
    for (var y = 0; y < h; y++) {
      var r = '';
      for (var x = 0; x < w; x++) r += mode === 'topdown' ? ((y === 0 || y === h - 1 || x === 0 || x === w - 1) ? '#' : '.') : (y >= h - 2 ? '#' : '.');
      rows.push(r);
    }
    return rows;
  }
  var LEVELS = {
    first: { mode: 'platform', rules: { goal: 'flag', lives: 3 }, tiles: [
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..........ooo.................',
      '.........=====.........ooo....',
      '..................====........',
      '.....o........................',
      '....===..............o....F...',
      '.P..........^^.....E......#...',
      '##############################',
      '##############################'] },
    platformer: { mode: 'platform', rules: { goal: 'both', lives: 3, enemySpeed: 2.5 }, tiles: [
      '........................................',
      '..................ooo...................',
      '.................=====..............o...',
      '..........k..........................F..',
      '.........===.........E.......S...######.',
      '......................=====.....#.......',
      '...o.........o................D.#.......',
      '..===.......===......^^^......D.#...o...',
      '.P......E..........#####......D.#.......',
      '######################...###############',
      '######################^^^###############',
      '########################################'] },
    ice: { mode: 'platform', rules: { goal: 'flag', lives: 3, speed: 7 }, tiles: [
      '..................................',
      '..................................',
      '.....................o.o.o........',
      '....................IIIIIII.......',
      '..........o.o.o...................',
      '.........IIIIIII...............F..',
      '..............................III.',
      '.P.......................S........',
      'IIIIIIII......IIIIIIII.IIIII......',
      'IIIIIIII^^^^^^IIIIIIII^IIIII^^^^^^'] },
    maze: { mode: 'topdown', rules: { goal: 'both', lives: 3, speed: 5, enemySpeed: 2, bg: '#eef1f4' }, tiles: [
      '######################',
      '#P.....#......o......#',
      '#.####.#.####.#####..#',
      '#.#..o.#.#..#.#...#..#',
      '#.#.####.#.E#.#.#.#..#',
      '#.#......#..#...#....#',
      '#.######.####.#####D##',
      '#o.....#..E...#...#..#',
      '#.####.#.####.#.k.#.F#',
      '#......#......#...#..#',
      '######################'] },
    speedrun: { mode: 'platform', rules: { goal: 'flag', lives: 1, time: 45, speed: 8, jump: 13 }, tiles: [
      '..............................................',
      '..............................................',
      '...........................o..................',
      '..........................===.................',
      '.................o......................o.....',
      '................===.............S......===..F.',
      '.........o...........^^..............#########',
      '.P......===.......########...^^.......#.......',
      '#######......###..########.#####......#.......',
      '#######^^^^^^###^^########^#####^^^^^^#.......'] }
  };

  function createStudio(ctx) {
    var t = ctx.t, h = ctx.h, PIXI = root.PIXI, GAME = root.IGGame;
    var S = null, game = null, kc = { x: 1, y: 1 }, kcVisible = false, cursorHover = null;
    var app = new PIXI.Application();
    return app.init({ antialias: false, background: '#dff0fb', autoStart: false, resolution: Math.min(2, root.devicePixelRatio || 1), autoDensity: true, preference: 'webgl',
      width: Math.max(300, ctx.viewport.clientWidth), height: Math.max(240, ctx.viewport.clientHeight) }).then(function () {
      ctx.setTech('renderer', 'PixiJS ' + PIXI.VERSION + ' · ' + (app.renderer.name === 'webgpu' ? 'WebGPU' : 'WebGL') + ' · ' + t('techGame'));
      app.canvas.setAttribute('aria-hidden', 'true');
      ctx.viewport.appendChild(app.canvas);
      return build();
    });

    function build() {
      var view = new ctx.View2D({ scale: 32, min: 8, max: 96, onChange: requestRender });
      ctx.attachViewGestures(ctx.viewport, view, { wheelPans: true, isPanTool: function () { return ctx.tool() === 'pan'; } });
      var world = new PIXI.Container(); app.stage.addChild(world);
      /* Los tiles se dibujan con el mismo código del motor (canvas 2D) en una textura; así editor y juego se ven igual. */
      var tileCanvas = document.createElement('canvas'), tileTex = null, tileSprite = new PIXI.Sprite(); world.addChild(tileSprite);
      var over = new PIXI.Graphics(); app.stage.addChild(over);
      var TS = 32;
      function rebuildTexture() {
        tileCanvas.width = S.w * TS; tileCanvas.height = S.h * TS;
        var g = tileCanvas.getContext('2d'), R = Object.assign({}, GAME.DEFAULT_RULES, S.rules);
        g.fillStyle = R.bg; g.fillRect(0, 0, tileCanvas.width, tileCanvas.height);
        g.strokeStyle = 'rgba(23,43,66,.08)';
        for (var x = 0; x <= S.w; x++) { g.beginPath(); g.moveTo(x * TS + 0.5, 0); g.lineTo(x * TS + 0.5, S.h * TS); g.stroke(); }
        for (var y = 0; y <= S.h; y++) { g.beginPath(); g.moveTo(0, y * TS + 0.5); g.lineTo(S.w * TS, y * TS + 0.5); g.stroke(); }
        for (y = 0; y < S.h; y++) for (x = 0; x < S.w; x++) {
          var c = S.tiles[y][x];
          if (c === '.') continue;
          if (c === 'P') GAME.drawCharacter(g, x * TS + 3, y * TS + 3, TS - 6, TS - 3, R.player, 1, false);
          else if (c === 'E') GAME.drawCharacter(g, x * TS + 3, y * TS + 6, TS - 6, TS - 6, GAME.PALETTE.enemy, -1, false);
          else GAME.drawTile(c, x * TS, y * TS, TS, g, GAME.PALETTE);
        }
        if (tileTex) tileTex.destroy(true);
        tileTex = PIXI.Texture.from(tileCanvas); tileSprite.texture = tileTex;
        requestRender();
      }
      var frame = 0;
      function requestRender() { if (!frame) frame = root.requestAnimationFrame(function () { frame = 0; render(); }); }
      function render() {
        world.x = view.x; world.y = view.y; world.scale.set(view.scale / TS);
        over.clear();
        var s = view.scale;
        over.rect(view.x - 1, view.y - 1, S.w * s + 2, S.h * s + 2).stroke({ width: 2, color: 0x172b42, alpha: 0.6 });
        if (cursorHover && !playing) over.rect(view.x + cursorHover.x * s, view.y + cursorHover.y * s, s, s).stroke({ width: 2, color: 0x5a49a8 });
        if (kcVisible && !playing) over.rect(view.x + kc.x * s, view.y + kc.y * s, s, s).stroke({ width: 3, color: 0x5a49a8 }).rect(view.x + kc.x * s + 3, view.y + kc.y * s + 3, s - 6, s - 6).stroke({ width: 1, color: 0xffffff });
        app.render();
        renderHud();
      }
      if (root.ResizeObserver) new ResizeObserver(function () { app.renderer.resize(Math.max(200, ctx.viewport.clientWidth), Math.max(200, ctx.viewport.clientHeight)); requestRender(); }).observe(ctx.viewport);
      function fit() { view.fit({ minX: 0, maxX: S.w, minY: 0, maxY: S.h }, ctx.viewport.clientWidth, ctx.viewport.clientHeight, 16); if (S.w * view.scale > ctx.viewport.clientWidth * 1.01) { view.scale = Math.max(view.scale, (ctx.viewport.clientHeight - 32) / S.h); view.x = 16; view.y = (ctx.viewport.clientHeight - S.h * view.scale) / 2; } requestRender(); }

      var hud = h('div', { class: 'igs-hud', 'aria-hidden': 'true' }), zoom = h('div', { class: 'igs-zoom' },
        ctx.button(t('zoomOut'), { icon: 'minus', onClick: function () { view.zoomAt(ctx.viewport.clientWidth / 2, ctx.viewport.clientHeight / 2, 0.8); } }),
        ctx.button(t('zoomFit'), { icon: 'fit', onClick: fit }),
        ctx.button(t('zoomIn'), { icon: 'plus', onClick: function () { view.zoomAt(ctx.viewport.clientWidth / 2, ctx.viewport.clientHeight / 2, 1.25); } }));
      ctx.viewport.append(hud, zoom);
      function renderHud() { ctx.clear(hud); hud.appendChild(h('span', { text: t('mode_' + S.mode) + ' · ' + S.w + ' × ' + S.h })); hud.appendChild(h('span', { text: playing ? t('playingBadge') : t('tool_' + (ctx.tool() || 'solid')) })); }

      /* ---------- Pintar ---------- */
      function toolChar(id) { for (var i = 0; i < TOOLS.length; i++) if (TOOLS[i].id === id) return TOOLS[i].c; return null; }
      function setTile(x, y, c) {
        if (x < 0 || y < 0 || x >= S.w || y >= S.h) return false;
        if (S.tiles[y][x] === c) return false;
        if (c === 'P') { for (var yy = 0; yy < S.h; yy++) S.tiles[yy] = S.tiles[yy].replace(/P/g, '.'); }
        S.tiles[y] = S.tiles[y].slice(0, x) + c + S.tiles[y].slice(x + 1);
        return true;
      }
      function cellOf(e) { var r = ctx.viewport.getBoundingClientRect(), wv = view.toWorld(e.clientX - r.left, e.clientY - r.top); return { x: Math.floor(wv.x), y: Math.floor(wv.y) }; }
      var painting = null;
      ctx.viewport.addEventListener('pointerdown', function (e) {
        if (playing || e.button > 0) return;
        var tool = ctx.tool(), c = toolChar(tool); if (c === null) return;
        ctx.viewport.focus({ preventScroll: true }); kcVisible = false;
        var cell = cellOf(e); painting = { c: c, n: 0 };
        if (setTile(cell.x, cell.y, c)) { painting.n += 1; rebuildTexture(); }
        ctx.viewport.setPointerCapture(e.pointerId);
      });
      ctx.viewport.addEventListener('pointermove', function (e) {
        var cell = cellOf(e);
        if (painting) { if (painting.c !== 'P' && painting.c !== 'F' && setTile(cell.x, cell.y, painting.c)) { painting.n += 1; rebuildTexture(); } return; }
        if (!playing && e.pointerType !== 'touch' && (!cursorHover || cursorHover.x !== cell.x || cursorHover.y !== cell.y)) { cursorHover = cell; requestRender(); }
      });
      ctx.viewport.addEventListener('pointerup', function () { if (painting && painting.n) changed(t('painted', { name: t('tile_' + CHAR_NAME[painting.c]), n: painting.n })); painting = null; });
      ctx.viewport.addEventListener('pointerleave', function () { cursorHover = null; requestRender(); });
      ctx.viewport.addEventListener('focus', function () { if (ctx.viewport.matches(':focus-visible') && !playing) { kcVisible = true; announceCell(); requestRender(); } });
      ctx.viewport.addEventListener('blur', function () { kcVisible = false; requestRender(); });
      function announceCell() { ctx.announce(t('cellAt', { x: kc.x + 1, y: S.h - kc.y, what: t('tile_' + CHAR_NAME[S.tiles[kc.y][kc.x]]) })); }
      function onKey(e) {
        if (playing || !ctx.viewport.contains(e.target)) return false;
        var d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
        if (d) {
          kcVisible = true; kc.x = Math.max(0, Math.min(S.w - 1, kc.x + d[0] * (e.shiftKey ? 5 : 1))); kc.y = Math.max(0, Math.min(S.h - 1, kc.y + d[1] * (e.shiftKey ? 5 : 1)));
          var s = view.scale, px = view.x + kc.x * s, py = view.y + kc.y * s, W = ctx.viewport.clientWidth, H = ctx.viewport.clientHeight;
          if (px < 20) view.x += 20 - px; if (px + s > W - 20) view.x -= px + s - (W - 20); if (py < 20) view.y += 20 - py; if (py + s > H - 20) view.y -= py + s - (H - 20);
          announceCell(); requestRender(); return true;
        }
        if (e.key === 'Enter' || e.key === ' ') { var c = toolChar(ctx.tool()); if (c !== null && setTile(kc.x, kc.y, c)) { rebuildTexture(); changed(t('painted', { name: t('tile_' + CHAR_NAME[c]), n: 1 })); } else announceCell(); return true; }
        if (e.key === 'Delete' || e.key === 'Backspace') { if (setTile(kc.x, kc.y, '.')) { rebuildTexture(); changed(t('painted', { name: t('tile_empty'), n: 1 })); } return true; }
        if (e.key === '+' || e.key === '=') { view.zoomAt(ctx.viewport.clientWidth / 2, ctx.viewport.clientHeight / 2, 1.25); return true; }
        if (e.key === '-') { view.zoomAt(ctx.viewport.clientWidth / 2, ctx.viewport.clientHeight / 2, 0.8); return true; }
        if (e.key === '0') { fit(); return true; }
        return false;
      }

      /* ---------- Probar dentro del editor ---------- */
      var playing = false, playCanvas = null, runner = null, touchBox = null, status = h('p', { class: 'igs-sr', role: 'status', 'aria-live': 'polite' });
      ctx.viewport.appendChild(status);
      function gameText() {
        return { coins: t('gCoins'), lives: t('gLives'), time: t('gTime'), key: t('gKey'), ready: t('gReady'), won: t('gWon'), lost: t('gLost'), paused: t('gPaused'), pausedBlur: t('gPausedBlur'),
          pressKey: t('gPressKey'), restart: t('gRestart'), hurt: t('gHurt'), allCoins: t('gAllCoins'), timeUp: t('gTimeUp'), gotKey: t('gGotKey'), needCoins: t('gNeedCoins'), started: t('gStarted') };
      }
      function levelData() { return { mode: S.mode, w: S.w, h: S.h, tiles: S.tiles.slice(), rules: Object.assign({}, S.rules), title: S.title }; }
      function problems() {
        var list = [], txt = S.tiles.join('');
        if (txt.indexOf('P') < 0) list.push(t('pNoPlayer'));
        if (S.rules.goal !== 'coins' && txt.indexOf('F') < 0) list.push(t('pNoGoal'));
        if ((S.rules.goal === 'coins' || S.rules.goal === 'both') && txt.indexOf('o') < 0) list.push(t('pNoCoins'));
        if (txt.indexOf('D') >= 0 && txt.indexOf('k') < 0) list.push(t('pDoorNoKey'));
        return list;
      }
      function play() {
        if (playing) { stopPlay(); return; }
        var pr = problems(); if (pr.length) { ctx.announce(pr.join(' ')); renderSide(); return; }
        playing = true; setPlayUI();
        playCanvas = h('canvas', { class: 'igs-game-canvas', tabindex: '0', role: 'application', 'aria-roledescription': t('gameRole'), 'aria-label': t('gameLabel', { title: S.title }), 'aria-describedby': 'igs-game-help' });
        touchBox = h('div', { class: 'igs-touch', 'aria-hidden': 'true' });
        ctx.viewport.append(playCanvas, touchBox);
        runner = GAME.run(playCanvas, levelData(), gameText(), status);
        buildTouch(touchBox, runner.input);
        playCanvas.focus();
        ctx.announce(t('playStarted'));
      }
      function stopPlay() {
        if (!playing) return;
        playing = false; if (runner) runner.stop(); runner = null;
        if (playCanvas) playCanvas.remove(); if (touchBox) touchBox.remove(); playCanvas = touchBox = null;
        setPlayUI(); requestRender(); ctx.viewport.focus(); ctx.announce(t('backToEditor'));
      }
      function buildTouch(box, input) {
        [['left', '◀'], ['right', '▶'], ['up', '▲'], ['down', '▼'], ['jump', t('touchJump')]].forEach(function (b) {
          if (S.mode === 'topdown' && b[0] === 'jump') return;
          if (S.mode === 'platform' && (b[0] === 'up' || b[0] === 'down')) return;
          var btn = h('button', { type: 'button', tabindex: '-1', class: 'igs-touch-' + b[0], text: b[1] });
          function on(e) { e.preventDefault(); input.touch[b[0]] = true; input.touch.any = true; if (b[0] === 'jump') input.touch.jumpPressed = true; if (runner && runner.game.state !== 'play') input.touch.restart = true; }
          function off(e) { e.preventDefault(); input.touch[b[0]] = false; }
          btn.addEventListener('pointerdown', on); btn.addEventListener('pointerup', off); btn.addEventListener('pointercancel', off); btn.addEventListener('pointerleave', off);
          box.appendChild(btn);
        });
      }

      /* ---------- Exportar juego jugable (un solo HTML) ---------- */
      function slug(s) { return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || (LANG === 'en' ? 'game' : 'juego'); }
      function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
      function exportHtml() {
        var pr = problems(); if (pr.length) { ctx.announce(pr.join(' ')); return; }
        root.fetch('/assets/ig-suite-juego-runtime.js?v=r43-1').then(function (r) { if (!r.ok) throw new Error('runtime'); return r.text(); }).then(function (runtime) {
          var tx = gameText(), lvl = levelData();
          var controls = S.mode === 'platform' ? [t('ctlMove'), t('ctlJump'), t('ctlPause'), t('ctlRestart')] : [t('ctlMoveTop'), t('ctlPause'), t('ctlRestart')];
          var goal = t('goal_' + S.rules.goal);
          var boot = 'var LEVEL=' + JSON.stringify(lvl) + ';var TEXT=' + JSON.stringify(tx) + ';' +
            'var cv=document.getElementById("game"),st=document.getElementById("status"),run=IGGame.run(cv,LEVEL,TEXT,st),tb=document.getElementById("touch");' +
            '[["left","\\u25C0"],["right","\\u25B6"]' + (S.mode === 'topdown' ? ',["up","\\u25B2"],["down","\\u25BC"]' : ',["jump",' + JSON.stringify(t('touchJump')) + ']') + '].forEach(function(b){var e=document.createElement("button");e.type="button";e.tabIndex=-1;e.textContent=b[1];' +
            'function on(ev){ev.preventDefault();run.input.touch[b[0]]=true;run.input.touch.any=true;if(b[0]==="jump")run.input.touch.jumpPressed=true;if(run.game.state!=="play")run.input.touch.restart=true;}' +
            'function off(ev){ev.preventDefault();run.input.touch[b[0]]=false;}e.addEventListener("pointerdown",on);e.addEventListener("pointerup",off);e.addEventListener("pointercancel",off);e.addEventListener("pointerleave",off);tb.appendChild(e);});' +
            'document.getElementById("start").addEventListener("click",function(){cv.focus();});';
          var html = '<!doctype html>\n<html lang="' + LANG + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
            '<meta name="generator" content="El taller de Iris Green · irisgreen.eu"><title>' + esc(S.title) + '</title><style>' +
            ':root{color-scheme:light}*{box-sizing:border-box}body{margin:0;background:#f6f8fb;color:#172b42;font:16px/1.5 system-ui,-apple-system,"Segoe UI",Arial,sans-serif}' +
            'main{max-width:1100px;margin:0 auto;padding:16px}h1{margin:.2em 0 .3em;font-size:clamp(1.5rem,4vw,2.2rem)}' +
            '.wrap{position:relative;border:2px solid #172b42;border-radius:14px;overflow:hidden;background:#fff}canvas{display:block;width:100%;height:min(70vh,560px);outline:none;touch-action:none}' +
            'canvas:focus-visible{box-shadow:inset 0 0 0 4px #5a49a8}#touch{position:absolute;left:0;right:0;bottom:8px;display:flex;justify-content:space-between;gap:8px;padding:0 8px;pointer-events:none}' +
            '#touch button{pointer-events:auto;min-width:64px;min-height:64px;border-radius:14px;border:2px solid #172b42;background:rgba(255,255,255,.9);font:700 18px/1 system-ui,sans-serif;color:#172b42}' +
            '@media (hover:hover) and (pointer:fine){#touch{display:none}}button#start{min-height:48px;padding:.5rem 1rem;border-radius:12px;border:2px solid #17395c;background:#17395c;color:#fff;font:700 1rem/1 system-ui,sans-serif;cursor:pointer;margin:.3rem 0 .8rem}' +
            'button#start:focus-visible{outline:3px solid #5a49a8;outline-offset:3px}.credit{margin-top:1.5rem;font-size:.9rem;color:#44586c}ul{padding-left:1.2rem}' +
            '@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto}}</style></head><body><main>' +
            '<h1>' + esc(S.title) + '</h1>' + (S.intro ? '<p>' + esc(S.intro) + '</p>' : '') +
            '<p><strong>' + esc(t('goalLabel')) + ':</strong> ' + esc(goal) + '</p><h2>' + esc(t('controlsTitle')) + '</h2><ul>' + controls.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>' +
            '<button id="start" type="button">' + esc(t('startGameBtn')) + '</button>' +
            '<div class="wrap"><canvas id="game" tabindex="0" role="application" aria-roledescription="' + esc(t('gameRole')) + '" aria-label="' + esc(t('gameLabel', { title: S.title })) + '" aria-describedby="status"></canvas><div id="touch" aria-hidden="true"></div></div>' +
            '<p id="status" role="status" aria-live="polite"></p>' +
            '<p class="credit">' + esc(t('credit')) + ' · IRIS GREEN · irisgreen.eu</p></main>' +
            '<script>' + runtime.replace(/<\/script/gi, '<\\/script') + '<\/script><script>' + boot.replace(/<\/script/gi, '<\\/script') + '<\/script></body></html>\n';
          ctx.download(new Blob([html], { type: 'text/html' }), slug(S.title) + '-' + ctx.stamp() + '.html');
        }).catch(function () { ctx.announce(t('exportError')); });
      }

      /* ---------- Paneles ---------- */
      function counts() { var c = {}; S.tiles.forEach(function (r) { for (var i = 0; i < r.length; i++) c[r[i]] = (c[r[i]] || 0) + 1; }); return c; }
      function findNext(ch) {
        var start = kc.y * S.w + kc.x + 1, total = S.w * S.h;
        for (var i = 0; i < total; i++) { var k = (start + i) % total, x = k % S.w, y = Math.floor(k / S.w); if (S.tiles[y][x] === ch) return { x: x, y: y }; }
        return null;
      }
      function changed(msg) { ctx.commit(msg); if (msg) ctx.announce(msg); renderSide(); requestRender(); }
      function renderSide() {
        var c = counts(), list = [h('h3', { text: t('levelContents') })], ul = h('ul', { class: 'igs-list' });
        ['P', 'F', 'o', 'E', '^', 'S', 'k', 'D', '=', '#', 'I'].forEach(function (ch) {
          if (!c[ch]) return;
          var b = h('button', { type: 'button' }, h('span', { text: t('tile_' + CHAR_NAME[ch]) }), h('small', { text: String(c[ch]) }));
          b.title = t('goToNext');
          b.addEventListener('click', function () { var n = findNext(ch); if (!n) return; kc = n; kcVisible = true; ctx.viewport.focus(); var s = view.scale; view.x = ctx.viewport.clientWidth / 2 - (n.x + 0.5) * s; view.y = ctx.viewport.clientHeight / 2 - (n.y + 0.5) * s; announceCell(); requestRender(); });
          ul.appendChild(h('li', null, b));
        });
        list.push(ul);
        var pr = problems();
        if (pr.length) list.push(h('p', { class: 'igs-result', 'data-kind': 'bad' }, h('strong', { text: t('toFix') }), pr.join(' ')));
        ctx.setStructure(list);
        var F = ctx.fields, R = S.rules, out = [];
        out.push(h('h4', { text: t('gameTitle') }));
        out.push(F.text(t('titleLabel'), S.title, { max: 60, onChange: function (v) { S.title = String(v).trim().slice(0, 60) || S.title; changed(t('renamed')); } }));
        out.push(F.text(t('introLabel'), S.intro || '', { multiline: true, max: 300, onChange: function (v) { S.intro = String(v).slice(0, 300); changed(t('introSet')); } }));
        out.push(F.choice(t('modeLabel'), S.mode, [['platform', t('mode_platform')], ['topdown', t('mode_topdown')]], { onChange: function (v) { S.mode = v; changed(t('modeSet', { m: t('mode_' + v) })); rebuildTexture(); } }));
        out.push(F.select(t('goalLabel'), R.goal, [['flag', t('goal_flag')], ['coins', t('goal_coins')], ['both', t('goal_both')]], { onChange: function (v) { R.goal = v; changed(t('goalSet')); } }));
        out.push(h('h4', { text: t('rulesTitle') }));
        out.push(F.range(t('ruleSpeed'), R.speed || 6, { min: 2, max: 12, step: 0.5, format: function (v) { return IG.num(v, 1); }, onChange: function (v) { R.speed = v; changed(t('ruleSpeed')); } }));
        if (S.mode === 'platform') {
          out.push(F.range(t('ruleJump'), R.jump || 12, { min: 6, max: 20, step: 0.5, format: function (v) { return IG.num(v, 1); }, onChange: function (v) { R.jump = v; changed(t('ruleJump')); } }));
          out.push(F.range(t('ruleGravity'), R.gravity || 32, { min: 10, max: 60, step: 1, format: function (v) { return String(v); }, onChange: function (v) { R.gravity = v; changed(t('ruleGravity')); } }));
        }
        out.push(F.range(t('ruleEnemy'), R.enemySpeed || 2, { min: 0, max: 8, step: 0.5, format: function (v) { return IG.num(v, 1); }, onChange: function (v) { R.enemySpeed = v; changed(t('ruleEnemy')); } }));
        out.push(F.number(t('ruleLives'), R.lives || 3, { min: 1, max: 9, step: 1, onChange: function (v) { R.lives = Math.round(v); changed(t('ruleLives')); } }));
        out.push(F.number(t('ruleTime'), R.time || 0, { unit: 's', min: 0, max: 600, step: 5, onChange: function (v) { R.time = Math.round(v); changed(t('ruleTime')); } }));
        out.push(h('p', { class: 'igs-muted', text: t('ruleTimeHelp') }));
        out.push(h('h4', { text: t('lookTitle') }));
        out.push(F.select(t('bgLabel'), R.bg || '#dff0fb', BG.map(function (b) { return [b[2], b[LANG === 'en' ? 1 : 0]]; }), { onChange: function (v) { R.bg = v; changed(t('bgLabel')); rebuildTexture(); } }));
        out.push(F.select(t('playerColour'), R.player || '#1f5f8b', PLAYER_COLORS.map(function (b) { return [b[2], b[LANG === 'en' ? 1 : 0]]; }), { onChange: function (v) { R.player = v; changed(t('playerColour')); rebuildTexture(); } }));
        out.push(h('h4', { text: t('sizeTitle') }));
        out.push(F.number(t('widthTiles'), S.w, { min: 10, max: 200, step: 1, onChange: function (v) { resize(Math.round(v), S.h); } }));
        out.push(F.number(t('heightTiles'), S.h, { min: 6, max: 40, step: 1, onChange: function (v) { resize(S.w, Math.round(v)); } }));
        ctx.setInspector(out);
        ctx.setSummary(t('levelSummary', { mode: t('mode_' + S.mode), w: S.w, h: S.h, coins: c.o || 0, enemies: c.E || 0, hazards: c['^'] || 0, goal: t('goal_' + R.goal) }));
      }
      function resize(w, hh) {
        w = Math.max(10, Math.min(200, w)); hh = Math.max(6, Math.min(40, hh));
        var rows = [];
        for (var y = 0; y < hh; y++) {
          var srcY = y - (hh - S.h); /* se conserva el suelo: se añade o quita arriba */
          var row = srcY >= 0 && srcY < S.h ? S.tiles[srcY] : '';
          row = (row + new Array(w + 1).join('.')).slice(0, w);
          if (srcY >= 0 && srcY < S.h && w > S.w) row = S.tiles[srcY] + new Array(w - S.w + 1).join(S.mode === 'platform' && srcY >= S.h - 2 ? '#' : '.');
          rows.push(row.slice(0, w));
        }
        S.tiles = rows; S.w = w; S.h = hh; kc.x = Math.min(kc.x, w - 1); kc.y = Math.min(kc.y, hh - 1);
        rebuildTexture(); changed(t('resized', { w: w, h: hh })); fit();
      }

      /* ---------- Herramientas ---------- */
      var playBtn;
      function setPlayUI() { if (!playBtn) return; playBtn.setAttribute('aria-pressed', String(playing)); playBtn.querySelector('.igs-btn-label').textContent = playing ? t('stopGame') : t('playGame'); ctx.toolbar.querySelectorAll('[data-tool]').forEach(function (b) { b.disabled = playing; }); renderHud(); }
      var tools = [{ id: 'playgame', label: t('playGame'), icon: 'play', primary: true, keys: 'Control+Enter', action: function () { play(); } }, { separator: true }];
      TOOLS.forEach(function (tl) { tools.push({ id: tl.id, label: t('tool_' + tl.id), icon: tl.icon, level: tl.more ? 'more' : null, title: t('help_' + tl.id) }); });
      ctx.setTools(tools, { initial: 'solid' });
      playBtn = ctx.toolbar.querySelector('.igs-primary'); playBtn.setAttribute('aria-pressed', 'false');
      ctx.command('play', t('playGame'), '', play);
      document.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && ctx.app.contains(e.target)) { e.preventDefault(); play(); } if (e.key === 'Escape' && playing && runner && runner.game.state !== 'play' && ctx.app.contains(e.target)) { e.preventDefault(); stopPlay(); } });
      ctx.addExport(t('exportHtml'), exportHtml, 'download');
      ctx.addExport(t('exportPng'), function () { rebuildTexture(); var c = ctx.canvasWithCredit(tileCanvas, '#ffffff'); ctx.canvasBlob(c).then(function (b) { ctx.download(b, (LANG === 'en' ? 'level-' : 'nivel-') + ctx.stamp() + '.png'); }); });

      function fromLevel(id) {
        if (playing) stopPlay();
        var L0 = LEVELS[id];
        if (!L0) { S = { v: 1, mode: 'platform', w: 30, h: 12, tiles: blankTiles(30, 12, 'platform'), rules: Object.assign({}, GAME.DEFAULT_RULES), title: t('defaultTitle'), intro: '' }; setTile(2, 9, 'P'); }
        else S = { v: 1, mode: L0.mode, w: L0.tiles[0].length, h: L0.tiles.length, tiles: L0.tiles.slice(), rules: Object.assign({}, GAME.DEFAULT_RULES, L0.rules), title: t('title_' + id), intro: t('intro_' + id) };
        kc = { x: 1, y: 1 }; rebuildTexture(); renderSide(); fit();
      }
      S = { v: 1, mode: 'platform', w: 30, h: 12, tiles: blankTiles(30, 12, 'platform'), rules: Object.assign({}, GAME.DEFAULT_RULES), title: '', intro: '' };
      return {
        serialize: function () { return JSON.parse(JSON.stringify(S)); },
        restore: function (st) { if (playing) stopPlay(); S = JSON.parse(JSON.stringify(st)); rebuildTexture(); renderSide(); requestRender(); },
        validate: function (d) {
          return d && (d.mode === 'platform' || d.mode === 'topdown') && Number.isInteger(d.w) && Number.isInteger(d.h) && d.w >= 10 && d.w <= 200 && d.h >= 6 && d.h <= 40 && Array.isArray(d.tiles) && d.tiles.length === d.h &&
            d.tiles.every(function (r) { return typeof r === 'string' && r.length === d.w && /^[.#=^oFSEPkDI]*$/.test(r); }) && d.rules && typeof d.rules === 'object' && typeof d.title === 'string';
        },
        start: function (id) { fromLevel(id === 'empty' ? null : id); },
        onKey: onKey
      };
    }
  }
})(window);
