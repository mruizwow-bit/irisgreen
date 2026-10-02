/* Iris Green · El taller · motor de juego (R43).
   Lógica y dibujo de los juegos del estudio de Videojuegos. El mismo archivo se usa para
   probar el juego en el editor y va dentro del HTML que se exporta, así el juego exportado
   se comporta exactamente igual. Sin dependencias, sin red, sin almacenamiento. */
(function (root) {
  'use strict';
  var T = { EMPTY: '.', SOLID: '#', PLATFORM: '=', HAZARD: '^', COIN: 'o', GOAL: 'F', SPRING: 'S', ENEMY: 'E', PLAYER: 'P', KEY: 'k', DOOR: 'D', ICE: 'I' };
  var DEFAULT_RULES = { speed: 6, jump: 12, gravity: 32, lives: 3, time: 0, goal: 'flag', enemySpeed: 2, bg: '#dff0fb', ground: '#5d7a4a', player: '#1f5f8b' };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function tileAt(g, x, y) { if (y < 0) return g.mode === 'topdown' ? '#' : '.'; if (x < 0 || x >= g.w || y >= g.h) return '#'; return g.tiles[y][x]; }
  function isSolid(g, c) { return c === '#' || c === 'I' || (c === 'D' && !g.hasKey); }

  function create(level, opts) {
    opts = opts || {};
    var g = { mode: level.mode === 'topdown' ? 'topdown' : 'platform', w: level.w, h: level.h, rules: Object.assign({}, DEFAULT_RULES, level.rules || {}), events: [] };
    g.tiles = level.tiles.map(function (row) { return row.split(''); });
    g.start = { x: 1, y: g.h - 3 }; g.enemies = []; g.coins = 0; g.coinsTotal = 0; g.keysTotal = 0;
    for (var y = 0; y < g.h; y++) for (var x = 0; x < g.w; x++) {
      var c = g.tiles[y][x];
      if (c === 'P') { g.start = { x: x, y: y }; g.tiles[y][x] = '.'; }
      else if (c === 'E') { g.enemies.push({ x: x + 0.1, y: y + 0.2, w: 0.8, h: 0.8, vx: g.rules.enemySpeed, vy: 0, dir: 1, alive: true, sx: x, sy: y, axis: (x + y) % 2 }); g.tiles[y][x] = '.'; }
      else if (c === 'o') g.coinsTotal += 1;
      else if (c === 'k') g.keysTotal += 1;
    }
    g.initialTiles = g.tiles.map(function (r) { return r.slice(); });
    reset(g, true);
    return g;
  }
  function reset(g, full) {
    if (full) { g.lives = g.rules.lives; g.coins = 0; g.hasKey = false; g.tiles = g.initialTiles.map(function (r) { return r.slice(); }); g.time = 0; g.state = 'ready'; g.enemies.forEach(function (e) { e.alive = true; e.x = e.sx + 0.1; e.y = e.sy + 0.2; e.dir = 1; }); }
    g.p = { x: g.start.x + 0.1, y: g.start.y + 0.1, w: 0.8, h: 0.9, vx: 0, vy: 0, ground: false, coyote: 0, buffer: 0, face: 1, hurt: 0 };
  }
  function emit(g, type, data) { g.events.push({ type: type, data: data }); }

  function collide(g, b, axis) {
    var x0 = Math.floor(b.x), x1 = Math.floor(b.x + b.w - 1e-6), y0 = Math.floor(b.y), y1 = Math.floor(b.y + b.h - 1e-6), hit = false;
    for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) {
      var c = tileAt(g, x, y);
      var solid = isSolid(g, c);
      if (!solid && c === '=' && g.mode === 'platform' && axis === 'y' && b.vy > 0 && b.prevBottom <= y + 1e-4) solid = true;
      if (!solid) continue;
      hit = true;
      if (axis === 'x') { if (b.vx > 0) b.x = x - b.w; else if (b.vx < 0) b.x = x + 1; b.vx = 0; }
      else { if (b.vy > 0) { b.y = y - b.h; b.ground = true; b.onIce = c === 'I'; } else if (b.vy < 0) b.y = y + 1; b.vy = 0; }
      x0 = Math.floor(b.x); x1 = Math.floor(b.x + b.w - 1e-6); y0 = Math.floor(b.y); y1 = Math.floor(b.y + b.h - 1e-6);
    }
    return hit;
  }
  function overlapTiles(g, b, fn) {
    var x0 = Math.floor(b.x), x1 = Math.floor(b.x + b.w - 1e-6), y0 = Math.floor(b.y), y1 = Math.floor(b.y + b.h - 1e-6);
    for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) if (y >= 0 && y < g.h && x >= 0 && x < g.w) fn(g.tiles[y][x], x, y);
  }
  function hurt(g) {
    if (g.p.hurt > 0 || g.state !== 'play') return;
    g.lives -= 1; emit(g, 'hurt', g.lives);
    if (g.lives <= 0) { g.state = 'lost'; emit(g, 'lost'); return; }
    var keepCoins = g.coins; reset(g, false); g.coins = keepCoins; g.p.hurt = 1.2;
  }
  function update(g, dt, input) {
    if (g.state === 'ready') { if (input.any) { g.state = 'play'; emit(g, 'start'); } else return; }
    if (g.state === 'paused') { if (input.any) { g.state = 'play'; emit(g, 'resume'); } return; }
    if (g.state !== 'play') { if (input.restart) { reset(g, true); g.state = 'play'; emit(g, 'start'); } return; }
    if (input.pause) { g.state = 'paused'; emit(g, 'paused'); return; }
    var R = g.rules, p = g.p;
    dt = Math.min(dt, 1 / 30);
    g.time += dt;
    if (R.time > 0 && g.time >= R.time) { g.state = 'lost'; emit(g, 'timeup'); return; }
    if (p.hurt > 0) p.hurt -= dt;
    if (g.mode === 'platform') {
      var accel = p.ground ? (p.onIce ? 12 : 60) : 30, target = (input.right ? 1 : 0) - (input.left ? 1 : 0);
      if (target) p.face = target;
      var want = target * R.speed;
      p.vx += Math.max(-accel * dt, Math.min(accel * dt, want - p.vx));
      p.coyote = p.ground ? 0.09 : Math.max(0, p.coyote - dt);
      p.buffer = input.jumpPressed ? 0.12 : Math.max(0, p.buffer - dt);
      if (p.buffer > 0 && p.coyote > 0) { p.vy = -R.jump; p.buffer = 0; p.coyote = 0; emit(g, 'jump'); }
      if (!input.jump && p.vy < -R.jump * 0.45) p.vy = -R.jump * 0.45; /* salto más corto si se suelta */
      p.vy = Math.min(30, p.vy + R.gravity * dt);
    } else {
      var tx = (input.right ? 1 : 0) - (input.left ? 1 : 0), ty = (input.down ? 1 : 0) - (input.up ? 1 : 0), len = Math.hypot(tx, ty) || 1;
      if (tx) p.face = tx;
      p.vx = tx / len * R.speed; p.vy = ty / len * R.speed;
    }
    p.x += p.vx * dt; collide(g, p, 'x');
    p.prevBottom = p.y + p.h; p.ground = false; p.onIce = false;
    p.y += p.vy * dt; collide(g, p, 'y');
    /* trampolín */
    if (g.mode === 'platform' && p.ground) { var under = tileAt(g, Math.floor(p.x + p.w / 2), Math.floor(p.y + p.h + 0.05)); if (under === 'S') { p.vy = -R.jump * 1.55; p.ground = false; emit(g, 'spring'); } }
    /* recoger y peligros */
    overlapTiles(g, p, function (c, x, y) {
      if (c === 'o') { g.tiles[y][x] = '.'; g.coins += 1; emit(g, 'coin', g.coins); }
      else if (c === 'k') { g.tiles[y][x] = '.'; g.hasKey = true; emit(g, 'key'); }
      else if (c === '^') hurt(g);
      else if (c === 'F') {
        var need = R.goal === 'coins' || R.goal === 'both';
        if (need && g.coins < g.coinsTotal) { if (!g.goalHint) { g.goalHint = true; emit(g, 'needCoins', g.coinsTotal - g.coins); } }
        else if (R.goal !== 'coins' && g.state === 'play') { g.state = 'won'; emit(g, 'won'); }
      }
    });
    if (R.goal === 'coins' && g.coinsTotal > 0 && g.coins >= g.coinsTotal && g.state === 'play') { g.state = 'won'; emit(g, 'won'); }
    if (p.y > g.h + 2) hurt(g);
    /* enemigos */
    g.enemies.forEach(function (e) {
      if (!e.alive) return;
      if (g.mode === 'platform') {
        e.vx = e.dir * R.enemySpeed; e.x += e.vx * dt;
        var aheadX = e.dir > 0 ? Math.floor(e.x + e.w + 0.02) : Math.floor(e.x - 0.02), footY = Math.floor(e.y + e.h + 0.1), midY = Math.floor(e.y + e.h / 2);
        if (isSolid(g, tileAt(g, aheadX, midY)) || (!isSolid(g, tileAt(g, aheadX, footY)) && tileAt(g, aheadX, footY) !== '=' && tileAt(g, aheadX, footY) !== 'S')) { e.dir *= -1; e.x += e.dir * 0.05; }
        e.vy = Math.min(30, (e.vy || 0) + R.gravity * dt); e.prevBottom = e.y + e.h; e.ground = false; e.y += e.vy * dt; collide(g, e, 'y');
      } else {
        var dx = e.axis ? 0 : e.dir * R.enemySpeed * dt, dy = e.axis ? e.dir * R.enemySpeed * dt : 0;
        e.x += dx; e.y += dy;
        var blocked = false;
        overlapTiles(g, e, function (c) { if (isSolid(g, c)) blocked = true; });
        if (blocked) { e.x -= dx; e.y -= dy; e.dir *= -1; }
      }
      if (p.x < e.x + e.w && p.x + p.w > e.x && p.y < e.y + e.h && p.y + p.h > e.y) {
        if (g.mode === 'platform' && p.vy > 0 && p.y + p.h - e.y < 0.45) { e.alive = false; p.vy = -R.jump * 0.6; emit(g, 'stomp'); }
        else hurt(g);
      }
    });
  }

  var PALETTE = { solid: '#6b8f5a', solidTop: '#3f6b35', platform: '#9c6b3f', hazard: '#a1283c', coin: '#e0a800', goal: '#2e7d32', spring: '#d86b00', key: '#e0a800', door: '#5a3d1e', ice: '#9fd3e6', enemy: '#8a2942', ink: '#172b42' };
  function drawTile(c, x, y, s, g, pal) {
    switch (c) {
      case '#': g.fillStyle = pal.solid; g.fillRect(x, y, s, s); g.fillStyle = pal.solidTop; g.fillRect(x, y, s, Math.max(2, s * 0.18)); g.strokeStyle = 'rgba(23,43,66,.25)'; g.strokeRect(x + 0.5, y + 0.5, s - 1, s - 1); break;
      case 'I': g.fillStyle = pal.ice; g.fillRect(x, y, s, s); g.strokeStyle = '#ffffff'; g.beginPath(); g.moveTo(x + s * 0.2, y + s * 0.3); g.lineTo(x + s * 0.5, y + s * 0.2); g.stroke(); break;
      case '=': g.fillStyle = pal.platform; g.fillRect(x, y, s, s * 0.28); g.fillStyle = 'rgba(23,43,66,.35)'; g.fillRect(x, y + s * 0.28, s, 2); break;
      case '^': g.fillStyle = pal.hazard; g.beginPath(); for (var i = 0; i < 3; i++) { g.moveTo(x + i * s / 3, y + s); g.lineTo(x + (i + 0.5) * s / 3, y + s * 0.35); g.lineTo(x + (i + 1) * s / 3, y + s); } g.fill(); break;
      case 'o': g.fillStyle = pal.coin; g.beginPath(); g.arc(x + s / 2, y + s / 2, s * 0.28, 0, Math.PI * 2); g.fill(); g.strokeStyle = '#8a6400'; g.lineWidth = 2; g.stroke(); g.lineWidth = 1; g.fillStyle = '#8a6400'; g.fillRect(x + s * 0.47, y + s * 0.34, s * 0.06, s * 0.32); break;
      case 'F': g.fillStyle = pal.ink; g.fillRect(x + s * 0.2, y, s * 0.08, s); g.fillStyle = pal.goal; g.beginPath(); g.moveTo(x + s * 0.28, y + s * 0.05); g.lineTo(x + s * 0.9, y + s * 0.22); g.lineTo(x + s * 0.28, y + s * 0.4); g.fill(); break;
      case 'S': g.fillStyle = pal.spring; g.fillRect(x + s * 0.1, y + s * 0.55, s * 0.8, s * 0.15); g.strokeStyle = pal.ink; g.lineWidth = 2; g.beginPath(); for (var k = 0; k < 4; k++) { g.moveTo(x + s * 0.2, y + s * (0.72 + k * 0.07)); g.lineTo(x + s * 0.8, y + s * (0.75 + k * 0.07)); } g.stroke(); g.lineWidth = 1; break;
      case 'k': g.strokeStyle = pal.key; g.lineWidth = Math.max(2, s * 0.08); g.beginPath(); g.arc(x + s * 0.35, y + s * 0.5, s * 0.15, 0, Math.PI * 2); g.moveTo(x + s * 0.5, y + s * 0.5); g.lineTo(x + s * 0.85, y + s * 0.5); g.moveTo(x + s * 0.75, y + s * 0.5); g.lineTo(x + s * 0.75, y + s * 0.65); g.stroke(); g.lineWidth = 1; break;
      case 'D': g.fillStyle = pal.door; g.fillRect(x + s * 0.1, y, s * 0.8, s); g.fillStyle = pal.key; g.beginPath(); g.arc(x + s * 0.5, y + s * 0.45, s * 0.08, 0, Math.PI * 2); g.fill(); g.fillRect(x + s * 0.47, y + s * 0.45, s * 0.06, s * 0.2); break;
    }
  }
  function drawCharacter(g, x, y, w, h, color, face, blink) {
    g.fillStyle = color; var r = Math.min(w, h) * 0.25;
    g.beginPath(); g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r); g.lineTo(x + w, y + h); g.lineTo(x, y + h); g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.fill();
    g.strokeStyle = '#172b42'; g.lineWidth = 2; g.stroke(); g.lineWidth = 1;
    g.fillStyle = '#ffffff'; var ex = x + w / 2 + face * w * 0.12;
    g.fillRect(ex - w * 0.2, y + h * 0.25, w * 0.14, h * 0.2); g.fillRect(ex + w * 0.06, y + h * 0.25, w * 0.14, h * 0.2);
    if (!blink) { g.fillStyle = '#172b42'; g.fillRect(ex - w * 0.16 + face * 2, y + h * 0.3, w * 0.07, h * 0.1); g.fillRect(ex + w * 0.1 + face * 2, y + h * 0.3, w * 0.07, h * 0.1); }
  }
  /* Dibuja la partida en un canvas 2D. cam: {x, y, s} (tile en px) */
  function render(g, ctx2d, W, H, text) {
    var pal = PALETTE, R = g.rules, s = Math.max(12, Math.min(64, Math.floor(H / Math.min(g.h, g.mode === 'topdown' ? 16 : 13))));
    var viewW = W / s, viewH = H / s;
    var cx = Math.max(0, Math.min(g.w - viewW, g.p.x + g.p.w / 2 - viewW / 2)), cy = Math.max(0, Math.min(g.h - viewH, g.p.y + g.p.h / 2 - viewH / 2));
    if (g.w < viewW) cx = (g.w - viewW) / 2; if (g.h < viewH) cy = (g.h - viewH) / 2;
    ctx2d.fillStyle = R.bg; ctx2d.fillRect(0, 0, W, H);
    var x0 = Math.floor(cx), y0 = Math.floor(cy);
    for (var y = y0; y <= y0 + viewH + 1; y++) for (var x = x0; x <= x0 + viewW + 1; x++) {
      if (x < 0 || y < 0 || x >= g.w || y >= g.h) continue;
      var c = g.tiles[y][x]; if (c === '.') continue;
      drawTile(c, Math.round((x - cx) * s), Math.round((y - cy) * s), s, ctx2d, pal);
    }
    g.enemies.forEach(function (e) { if (e.alive) drawCharacter(ctx2d, (e.x - cx) * s, (e.y - cy) * s, e.w * s, e.h * s, pal.enemy, e.dir, false); });
    var p = g.p, flash = p.hurt > 0 && Math.floor(p.hurt * 6) % 2;
    if (!flash) drawCharacter(ctx2d, (p.x - cx) * s, (p.y - cy) * s, p.w * s, p.h * s, R.player, p.face, false);
    /* marcador (texto real también en la región de estado del documento) */
    ctx2d.fillStyle = 'rgba(255,255,255,.9)'; ctx2d.fillRect(8, 8, Math.min(W - 16, 330), 30); ctx2d.strokeStyle = '#172b42'; ctx2d.strokeRect(8.5, 8.5, Math.min(W - 16, 330) - 1, 29);
    ctx2d.fillStyle = '#172b42'; ctx2d.font = '700 15px Atkinson Hyperlegible, Arial, sans-serif'; ctx2d.textBaseline = 'middle';
    var hud = text.coins + ' ' + g.coins + '/' + g.coinsTotal + '   ' + text.lives + ' ' + Math.max(0, g.lives) + (R.time > 0 ? '   ' + text.time + ' ' + Math.max(0, Math.ceil(R.time - g.time)) : '') + (g.hasKey ? '   ' + text.key : '');
    ctx2d.fillText(hud, 16, 23);
    var msg = g.state === 'ready' ? text.ready : g.state === 'won' ? text.won : g.state === 'lost' ? text.lost : g.state === 'paused' ? text.paused : '';
    if (msg) {
      ctx2d.fillStyle = 'rgba(23,43,66,.82)'; ctx2d.fillRect(0, H / 2 - 44, W, 88);
      ctx2d.fillStyle = '#ffffff'; ctx2d.textAlign = 'center'; ctx2d.font = '700 22px Atkinson Hyperlegible, Arial, sans-serif'; ctx2d.fillText(msg, W / 2, H / 2 - 10);
      ctx2d.font = '400 15px Atkinson Hyperlegible, Arial, sans-serif'; ctx2d.fillText(g.state === 'ready' || g.state === 'paused' ? text.pressKey : text.restart, W / 2, H / 2 + 20); ctx2d.textAlign = 'left';
    }
  }

  /* Entrada de teclado y táctil común */
  function Input() { this.keys = {}; this.pressed = {}; this.touch = {}; }
  Input.prototype.down = function (k) { if (!this.keys[k]) this.pressed[k] = true; this.keys[k] = true; };
  Input.prototype.up = function (k) { this.keys[k] = false; };
  Input.prototype.frame = function () {
    var k = this.keys, pr = this.pressed, t = this.touch;
    var f = { left: k.ArrowLeft || k.a || t.left, right: k.ArrowRight || k.d || t.right, up: k.ArrowUp || k.w || t.up, down: k.ArrowDown || k.s || t.down,
      jump: k[' '] || k.ArrowUp || k.w || t.jump, jumpPressed: pr[' '] || pr.ArrowUp || pr.w || t.jumpPressed, pause: pr.p || pr.Escape, restart: pr.Enter || pr.r || t.restart,
      any: Object.keys(pr).length > 0 || t.any };
    this.pressed = {}; t.jumpPressed = false; t.any = false; t.restart = false;
    return f;
  };
  /* Bucle completo de una partida en un canvas: lo usan el editor y el HTML exportado. */
  function run(canvas, level, text, statusEl) {
    var g = create(level), input = new Input(), c2 = canvas.getContext('2d'), last = 0, raf = 0, alive = true, sz = { w: 300, h: 200 };
    function size() {
      var r = canvas.getBoundingClientRect(), dpr = Math.min(2, root.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(r.width * dpr)); canvas.height = Math.max(1, Math.round(r.height * dpr)); c2.setTransform(dpr, 0, 0, dpr, 0, 0);
      sz = { w: r.width, h: r.height };
    }
    size();
    var ro = root.ResizeObserver ? new root.ResizeObserver(size) : null; if (ro) ro.observe(canvas);
    var KEYS = { ArrowLeft: 1, ArrowRight: 1, ArrowUp: 1, ArrowDown: 1, ' ': 1, a: 1, d: 1, w: 1, s: 1, p: 1, r: 1, Enter: 1, Escape: 1 };
    function norm(e) { var k = e.key; return k.length === 1 ? k.toLowerCase() : k; }
    function kd(e) { var k = norm(e); if (!KEYS[k]) return; if (k === 'Escape' && g.state !== 'play') return; e.preventDefault(); input.down(k); }
    function ku(e) { var k = norm(e); if (KEYS[k]) input.up(k); }
    canvas.addEventListener('keydown', kd); canvas.addEventListener('keyup', ku);
    canvas.addEventListener('blur', function () { input.keys = {}; if (g.state === 'play') { g.state = 'paused'; say(text.pausedBlur); } });
    function say(m) { if (statusEl) { statusEl.textContent = ''; root.setTimeout(function () { statusEl.textContent = m; }, 30); } }
    function frame(now) {
      if (!alive) return;
      var dt = last ? (now - last) / 1000 : 0; last = now;
      update(g, dt, input.frame());
      while (g.events.length) {
        var ev = g.events.shift(), m = null;
        switch (ev.type) {
          case 'coin': if (ev.data === g.coinsTotal) m = text.allCoins; else if (ev.data % 5 === 0) m = text.coins + ' ' + ev.data + '/' + g.coinsTotal; break;
          case 'hurt': m = text.hurt + ' ' + text.lives + ' ' + ev.data; break;
          case 'won': m = text.won; break; case 'lost': m = text.lost; break; case 'timeup': m = text.timeUp; break;
          case 'key': m = text.gotKey; break; case 'needCoins': m = text.needCoins.replace('{n}', ev.data); break;
          case 'start': m = text.started; break; case 'paused': m = text.paused; break;
        }
        if (m) say(m);
      }
      render(g, c2, sz.w, sz.h, text);
      raf = root.requestAnimationFrame(frame);
    }
    raf = root.requestAnimationFrame(frame);
    return { game: g, input: input, stop: function () { alive = false; root.cancelAnimationFrame(raf); if (ro) ro.disconnect(); canvas.removeEventListener('keydown', kd); canvas.removeEventListener('keyup', ku); } };
  }
  var API = { run: run, TILES: T, DEFAULT_RULES: DEFAULT_RULES, create: create, update: update, render: render, reset: reset, Input: Input, drawTile: drawTile, drawCharacter: drawCharacter, PALETTE: PALETTE, clone: clone };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.IGGame = API;
})(typeof window !== 'undefined' ? window : this);
