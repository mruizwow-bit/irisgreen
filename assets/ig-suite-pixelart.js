/* Iris Green · El taller · Estudio de pixel art (R43).
   Lienzo de píxeles sobre PixiJS (escalado nítido), paletas, capas de animación por fotogramas
   con papel cebolla, simetría y vista de mosaico. Exporta PNG escalado, hoja de sprites y GIF animado. */
(function (root) {
  'use strict';
  var IG = root.IGSuite, D = root.document; if (!IG) return;
  var LANG = IG.lang;
  var PALETTES = {
    iris: ['#00000000', '#101820', '#f4f4f4', '#7d8b99', '#b3261e', '#e8743b', '#e0b000', '#f6e27a', '#2e7d32', '#7cc36b', '#0b8f8f', '#1f5f8b', '#6fa8dc', '#5a49a8', '#c27ba0', '#8a5a3c'],
    earth: ['#00000000', '#1d1a16', '#3f3328', '#6b4f3a', '#9c7353', '#c9a27e', '#efd9b4', '#5b6b2e', '#8a9a46', '#c2c77a', '#2f4f4f', '#5f8a8b', '#a3c1ad', '#8c3b2e', '#c7663d', '#f2ede4'],
    sea: ['#00000000', '#0b132b', '#1c2541', '#3a506b', '#5bc0be', '#9ee6e2', '#f2f7f7', '#ffd166', '#ef476f', '#06d6a0', '#118ab2', '#073b4c', '#8ecae6', '#219ebc', '#fb8500', '#ffb703'],
    grey: ['#00000000', '#000000', '#111111', '#222222', '#333333', '#444444', '#555555', '#666666', '#777777', '#888888', '#999999', '#aaaaaa', '#bbbbbb', '#cccccc', '#dddddd', '#ffffff']
  };
  var SIZES = [8, 12, 16, 24, 32, 48, 64];

  IG.defineEngine('pixelart', {
    libs: ['pixi'], version: 1, fileBase: 'pixel-art',
    extraKeys: ['kPixCursor', 'kPixColour'],
    initialStart: function (para) { return { child: 'heart', teen: 'sword', adult: 'tile' }[para] || 'ball'; },
    starts: function (ctx) {
      var t = ctx.t;
      return [
        { id: 'heart', title: t('stHeart'), desc: t('stHeartD'), para: 'child' },
        { id: 'ball', title: t('stBall'), desc: t('stBallD'), para: 'any' },
        { id: 'sword', title: t('stSword'), desc: t('stSwordD'), para: 'teen' },
        { id: 'tile', title: t('stTile'), desc: t('stTileD'), para: 'adult' }
      ];
    },
    create: function (ctx) { return studio(ctx); }
  });

  function studio(ctx) {
    var t = ctx.t, h = ctx.h, F = ctx.fields, vp = ctx.viewport;
    var S = blank(16, 16), cur = 0, colour = 1, tool = 'pencil', mirror = false, onion = true, tiled = false, showGrid = true, playing = false;
    var kc = { x: 0, y: 0 }, pending = null, drawing = null;
    function blank(w, hh) { return { v: 1, w: w, h: hh, palette: PALETTES.iris.slice(), frames: [new Array(w * hh).fill(0)], fps: 6 }; }

    var app = new PIXI.Application();
    return app.init({ antialias: false, background: '#e9eef4', autoStart: false, resolution: Math.min(2, root.devicePixelRatio || 1), autoDensity: true,
      preference: 'webgl', width: Math.max(300, vp.clientWidth), height: Math.max(240, vp.clientHeight) }).then(function () {
      ctx.setTech('renderer', 'PixiJS ' + PIXI.VERSION + ' · ' + (app.renderer.name === 'webgpu' ? 'WebGPU' : 'WebGL'));
      app.canvas.setAttribute('aria-hidden', 'true'); vp.appendChild(app.canvas);
      return build();
    });

    function build() {
      var pixCanvas = D.createElement('canvas'), onionCanvas = D.createElement('canvas');
      var world = new PIXI.Container(); app.stage.addChild(world);
      var checker = new PIXI.Graphics(), tiles = new PIXI.Container(), onionSprite, sprite, grid = new PIXI.Graphics(), over = new PIXI.Graphics();
      world.addChild(checker); world.addChild(tiles);
      var tex = null, onionTex = null;
      function makeTextures() {
        pixCanvas.width = S.w; pixCanvas.height = S.h; onionCanvas.width = S.w; onionCanvas.height = S.h;
        if (tex) tex.destroy(true); if (onionTex) onionTex.destroy(true);
        tex = PIXI.Texture.from(pixCanvas); tex.source.scaleMode = 'nearest';
        onionTex = PIXI.Texture.from(onionCanvas); onionTex.source.scaleMode = 'nearest';
        tiles.removeChildren();
        onionSprite = new PIXI.Sprite(onionTex); onionSprite.alpha = 0.3; tiles.addChild(onionSprite);
        sprite = new PIXI.Sprite(tex); tiles.addChild(sprite);
        for (var i = 0; i < 8; i++) { var sp = new PIXI.Sprite(tex); sp.alpha = 0.55; sp.visible = false; sp.igTile = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]][i]; tiles.addChild(sp); }
        tiles.addChild(grid); tiles.addChild(over);
      }
      var view = new ctx.View2D({ scale: 16, min: 1, max: 64, onChange: function () { applyView(); } });
      ctx.attachViewGestures(vp, view, { isPanTool: function () { return tool === 'pan'; } });
      function applyView() { world.position.set(view.x, view.y); world.scale.set(view.scale); drawGrid(); render(); }
      function fit() {
        var W = app.renderer.width / app.renderer.resolution, H = app.renderer.height / app.renderer.resolution, m = tiled ? 3 : 1;
        view.fit({ minX: tiled ? -S.w : 0, minY: tiled ? -S.h : 0, maxX: S.w * (tiled ? 2 : 1), maxY: S.h * (tiled ? 2 : 1) }, W, H, 24); view.scale = Math.max(1, Math.floor(view.scale)); view.onChange(); return m;
      }
      function resize() { var w = Math.max(200, vp.clientWidth), hh = Math.max(160, vp.clientHeight); app.renderer.resize(w, hh); fit(); }
      if (root.ResizeObserver) new ResizeObserver(resize).observe(vp);

      var frameReq = 0;
      function render() { if (!frameReq) frameReq = root.requestAnimationFrame(function () { frameReq = 0; app.render(); }); }
      function paintCanvas(canvas, frame) {
        var g = canvas.getContext('2d'), img = g.createImageData(S.w, S.h), pal = S.palette.map(hexToRgba);
        for (var i = 0; i < frame.length; i++) { var c = pal[frame[i]] || [0, 0, 0, 0]; img.data[i * 4] = c[0]; img.data[i * 4 + 1] = c[1]; img.data[i * 4 + 2] = c[2]; img.data[i * 4 + 3] = c[3]; }
        g.putImageData(img, 0, 0);
      }
      function refresh() {
        paintCanvas(pixCanvas, S.frames[cur]); tex.source.update();
        var showOnion = onion && !playing && S.frames.length > 1 && cur > 0;
        if (showOnion) { paintCanvas(onionCanvas, S.frames[cur - 1]); onionTex.source.update(); }
        onionSprite.visible = showOnion;
        tiles.children.forEach(function (sp) { if (sp.igTile) { sp.visible = tiled; sp.position.set(sp.igTile[0] * S.w, sp.igTile[1] * S.h); } });
        drawOver(); render();
      }
      var bgG = new PIXI.Graphics(); world.addChildAt(bgG, 0);
      function drawChecker() {
        var n = tiled ? 1 : 0, x0 = -n * S.w, y0 = -n * S.h, W = S.w * (1 + 2 * n), H = S.h * (1 + 2 * n);
        bgG.clear(); bgG.rect(x0, y0, W, H).fill({ color: 0xf6f8fb });
        checker.clear();
        for (var y = y0; y < y0 + H; y++) for (var x = x0; x < x0 + W; x++) if (((x + y) % 2 + 2) % 2 === 0) checker.rect(x, y, 1, 1);
        checker.fill({ color: 0xdfe6ee });
      }
      function drawGrid() {
        grid.clear(); if (!showGrid || view.scale < 6) return;
        var lw = 1 / view.scale;
        for (var x = 0; x <= S.w; x++) grid.moveTo(x, 0).lineTo(x, S.h);
        for (var y = 0; y <= S.h; y++) grid.moveTo(0, y).lineTo(S.w, y);
        grid.stroke({ width: lw, color: 0x44586c, alpha: 0.25 });
        if (mirror) grid.moveTo(S.w / 2, 0).lineTo(S.w / 2, S.h).stroke({ width: 2 / view.scale, color: 0x5a49a8, alpha: 0.8 });
        grid.rect(0, 0, S.w, S.h).stroke({ width: 2 / view.scale, color: 0x172b42, alpha: 0.7 });
      }
      function drawOver() {
        over.clear(); var lw = 2 / view.scale;
        if (pending) { linePoints(pending.x, pending.y, kc.x, kc.y, tool).forEach(function (p) { over.rect(p[0], p[1], 1, 1); }); over.fill({ color: 0x5a49a8, alpha: 0.45 }); }
        over.rect(kc.x, kc.y, 1, 1).stroke({ width: lw, color: 0xb3261e, alpha: cursorShown ? 1 : 0.35 });
        if (mirror) { var mx = S.w - 1 - kc.x; if (mx !== kc.x) over.rect(mx, kc.y, 1, 1).stroke({ width: lw / 1.5, color: 0x5a49a8, alpha: 0.6 }); }
      }
      var cursorShown = false;

      /* ---------- Operaciones sobre píxeles ---------- */
      function idx(x, y) { return y * S.w + x; }
      function inb(x, y) { return x >= 0 && y >= 0 && x < S.w && y < S.h; }
      function setPx(x, y, c) { var f = S.frames[cur]; if (inb(x, y)) f[idx(x, y)] = c; if (mirror) { var mx = S.w - 1 - x; if (inb(mx, y)) f[idx(mx, y)] = c; } }
      function flood(x, y, c) {
        var f = S.frames[cur], target = f[idx(x, y)]; if (target === c) return;
        var stack = [[x, y]], guard = 0;
        while (stack.length && guard++ < 1e6) { var p = stack.pop(), px = p[0], py = p[1]; if (!inb(px, py) || f[idx(px, py)] !== target) continue; f[idx(px, py)] = c; stack.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]); }
      }
      function linePoints(x0, y0, x1, y1, kind) {
        var pts = [];
        if (kind === 'rect' || kind === 'rectFill') {
          var ax = Math.min(x0, x1), bx = Math.max(x0, x1), ay = Math.min(y0, y1), by = Math.max(y0, y1);
          for (var yy = ay; yy <= by; yy++) for (var xx = ax; xx <= bx; xx++) if (kind === 'rectFill' || xx === ax || xx === bx || yy === ay || yy === by) pts.push([xx, yy]);
          return pts;
        }
        if (kind === 'ellipse') {
          var cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, rx = Math.abs(x1 - x0) / 2 + 0.5, ry = Math.abs(y1 - y0) / 2 + 0.5, seen = {};
          for (var a = 0; a < 360; a += 1) { var ex = Math.round(cx + rx * Math.cos(a * Math.PI / 180) - 0.5 * Math.sign(Math.cos(a * Math.PI / 180))), ey = Math.round(cy + ry * Math.sin(a * Math.PI / 180) - 0.5 * Math.sign(Math.sin(a * Math.PI / 180))); var k = ex + ',' + ey; if (!seen[k]) { seen[k] = 1; pts.push([ex, ey]); } }
          return pts;
        }
        var dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, err = dx + dy;
        while (true) { pts.push([x0, y0]); if (x0 === x1 && y0 === y1) break; var e2 = 2 * err; if (e2 >= dy) { err += dy; x0 += sx; } if (e2 <= dx) { err += dx; y0 += sy; } }
        return pts;
      }
      function apply(x, y, first) {
        if (!inb(x, y)) return false;
        if (tool === 'pencil' || tool === 'eraser') { var c = tool === 'eraser' ? 0 : colour; if (drawing && drawing.last && !first) linePoints(drawing.last[0], drawing.last[1], x, y).forEach(function (p) { setPx(p[0], p[1], c); }); else setPx(x, y, c); if (drawing) drawing.last = [x, y]; return true; }
        if (tool === 'fill') { flood(x, y, colour); if (mirror) flood(S.w - 1 - x, y, colour); return true; }
        if (tool === 'picker') { colour = S.frames[cur][idx(x, y)]; renderSide(); ctx.announce(t('picked', { c: colourName(colour) })); return false; }
        return false;
      }
      function shapeTool() { return tool === 'line' || tool === 'rect' || tool === 'rectFill' || tool === 'ellipse'; }

      /* ---------- Puntero ---------- */
      function cell(e) { var r = app.canvas.getBoundingClientRect(), w = view.toWorld(e.clientX - r.left, e.clientY - r.top); return { x: Math.floor(w.x), y: Math.floor(w.y) }; }
      app.canvas.addEventListener('pointerdown', function (e) {
        if (e.button !== 0 || tool === 'pan' || playing) return;
        var c = cell(e); kc.x = Math.max(0, Math.min(S.w - 1, c.x)); kc.y = Math.max(0, Math.min(S.h - 1, c.y)); cursorShown = false;
        if (shapeTool()) {
          if (!inb(c.x, c.y)) return;
          if (pending && pending.click) { kc.x = c.x; kc.y = c.y; finishShape(); return; } /* segundo toque: termina la forma sin arrastrar (WCAG 2.5.7) */
          pending = { x: c.x, y: c.y, down: true }; app.canvas.setPointerCapture(e.pointerId); drawOver(); render(); return;
        }
        drawing = { last: null }; app.canvas.setPointerCapture(e.pointerId);
        if (apply(c.x, c.y, true)) refresh();
      });
      app.canvas.addEventListener('pointermove', function (e) {
        var c = cell(e);
        if (inb(c.x, c.y)) { kc.x = c.x; kc.y = c.y; }
        if (drawing && (tool === 'pencil' || tool === 'eraser')) { if (apply(Math.max(0, Math.min(S.w - 1, c.x)), Math.max(0, Math.min(S.h - 1, c.y)))) refresh(); return; }
        drawOver(); render();
      });
      function finishShape() { linePoints(pending.x, pending.y, kc.x, kc.y, tool).forEach(function (p) { setPx(p[0], p[1], colour); }); pending = null; refresh(); ctx.commit(t('drawn')); updateSide(); }
      function up() {
        if (pending && pending.down) {
          pending.down = false;
          if (kc.x === pending.x && kc.y === pending.y) { pending.click = true; drawOver(); render(); ctx.announce(t('shapeStart')); return; } /* un toque: espera el segundo */
          finishShape(); return;
        }
        if (drawing) { drawing = null; ctx.commit(t('drawn')); updateSide(); }
      }
      app.canvas.addEventListener('pointerup', up); app.canvas.addEventListener('pointercancel', up);

      /* ---------- Teclado ---------- */
      function onKey(e) {
        if (!vp.contains(e.target)) return false;
        var k = e.key, st = e.shiftKey ? 4 : 1, d = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, -st], ArrowDown: [0, st] }[k];
        if (d) { kc.x = Math.max(0, Math.min(S.w - 1, kc.x + d[0])); kc.y = Math.max(0, Math.min(S.h - 1, kc.y + d[1])); cursorShown = true; drawOver(); render(); if (drawing && drawing.key) { apply(kc.x, kc.y); refresh(); } ctx.announce(t('cursorAt', { x: kc.x + 1, y: kc.y + 1, c: colourName(S.frames[cur][idx(kc.x, kc.y)]) }) + (pending ? ' · ' + t('pendingShape') : '')); return true; }
        if (k === 'Enter' || k === ' ') {
          if (shapeTool()) {
            if (!pending) { pending = { x: kc.x, y: kc.y }; drawOver(); render(); ctx.announce(t('shapeStart')); }
            else { linePoints(pending.x, pending.y, kc.x, kc.y, tool).forEach(function (p) { setPx(p[0], p[1], colour); }); pending = null; refresh(); ctx.commit(t('drawn')); updateSide(); ctx.announce(t('drawn')); }
            return true;
          }
          if (apply(kc.x, kc.y, true)) { refresh(); ctx.commit(t('drawn')); updateSide(); ctx.announce(t('painted', { c: colourName(tool === 'eraser' ? 0 : colour) })); }
          return true;
        }
        if (k === '[' || k === ']') { colour = (colour + (k === ']' ? 1 : -1) + S.palette.length) % S.palette.length; renderSide(); ctx.announce(t('colourNow', { c: colourName(colour) })); return true; }
        if (k === 'm' || k === 'M') { toggleMirror(); return true; }
        if (k === 'Escape' && pending) { pending = null; drawOver(); render(); ctx.announce(t('cancelled')); return true; }
        if (k === ',' || k === '.') { goFrame(cur + (k === '.' ? 1 : -1)); return true; }
        return false;
      }
      function colourName(i) { return i === 0 ? t('transparent') : t('colourN', { n: i, hex: S.palette[i] }); }

      /* ---------- Fotogramas ---------- */
      function goFrame(i) { if (!S.frames.length) return; cur = (i + S.frames.length) % S.frames.length; refresh(); renderSide(); ctx.announce(t('frameN', { n: cur + 1, total: S.frames.length })); }
      function addFrame(copy) { var f = copy ? S.frames[cur].slice() : new Array(S.w * S.h).fill(0); S.frames.splice(cur + 1, 0, f); cur += 1; refresh(); ctx.commit(t('frameAdded')); renderSide(); ctx.announce(t('frameN', { n: cur + 1, total: S.frames.length })); }
      function delFrame() { if (S.frames.length < 2) { ctx.announce(t('lastFrame')); return; } S.frames.splice(cur, 1); cur = Math.min(cur, S.frames.length - 1); refresh(); ctx.commit(t('frameDeleted')); renderSide(); }
      function moveFrame(dir) { var j = cur + dir; if (j < 0 || j >= S.frames.length) return; var f = S.frames.splice(cur, 1)[0]; S.frames.splice(j, 0, f); cur = j; refresh(); ctx.commit(t('frameMoved')); renderSide(); }
      var playTimer = 0, playBtn = null;
      function togglePlay() {
        if (playing) { playing = false; clearInterval(playTimer); refresh(); ctx.announce(t('stopped')); }
        else {
          if (S.frames.length < 2) { ctx.announce(t('needFrames')); return; }
          /* Protección de destellos (WCAG 2.3.1): si el brillo medio cambia mucho más de 3 veces por segundo, la vista previa va más despacio. */
          var fps = safeFps(); playing = true; playTimer = setInterval(function () { cur = (cur + 1) % S.frames.length; refresh(); }, 1000 / fps);
          ctx.announce(fps < S.fps ? t('flashSlowed', { fps: fps }) : t('playingAnim', { fps: fps }));
        }
        if (playBtn) playBtn.setAttribute('aria-pressed', String(playing));
      }
      function lum(frame) {
        var pal = S.palette.map(hexToRgba), sum = 0;
        function lin(v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
        frame.forEach(function (i) { var c = pal[i] || [255, 255, 255, 0], a = c[3] / 255; sum += a * (0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2])) + (1 - a); });
        return sum / frame.length;
      }
      function safeFps() {
        var L = S.frames.map(lum), big = 0;
        for (var i = 0; i < L.length; i++) { var a = L[i], b = L[(i + 1) % L.length]; if (Math.abs(a - b) >= 0.1 && Math.min(a, b) < 0.8) big++; }
        var flashes = big / 2 * S.fps / L.length;
        return flashes > 3 ? Math.max(1, Math.floor(3 * L.length * 2 / Math.max(1, big))) : S.fps;
      }
      function toggleMirror() { mirror = !mirror; drawGrid(); drawOver(); render(); var b = ctx.toolbar.querySelector('[data-igp="mirror"]'); if (b) b.setAttribute('aria-pressed', String(mirror)); ctx.announce(mirror ? t('mirrorOn') : t('mirrorOff')); }

      /* ---------- Paneles ---------- */
      var thumbs = {};
      function thumb(frame) { var c = D.createElement('canvas'); c.width = S.w; c.height = S.h; paintCanvas(c, frame); return c.toDataURL(); }
      function updateSide() { renderSide(); }
      function renderSide() {
        var list = h('ul', { class: 'igp-frames' });
        S.frames.forEach(function (f, i) {
          var b = h('button', { type: 'button', class: 'igp-frame', 'aria-current': String(i === cur), 'aria-label': t('frameN', { n: i + 1, total: S.frames.length }) }, h('img', { src: thumb(f), alt: '' }), h('span', { text: String(i + 1) }));
          b.addEventListener('click', function () { goFrame(i); }); list.appendChild(h('li', null, b));
        });
        ctx.setStructure([h('h3', { text: t('frames') + ' (' + S.frames.length + ')' }), list,
          h('div', { class: 'igs-actions' }, ctx.button(t('addFrame'), { icon: 'plus', onClick: function () { addFrame(false); } }), ctx.button(t('dupFrame'), { icon: 'copy', onClick: function () { addFrame(true); } }),
            ctx.button(t('frameLeft'), { icon: 'undo', onClick: function () { moveFrame(-1); } }), ctx.button(t('frameRight'), { icon: 'redo', onClick: function () { moveFrame(1); } }),
            ctx.button(t('delFrame'), { icon: 'trash', class: 'igs-danger', onClick: delFrame }))]);

        var out = [h('h4', { text: t('palette') })];
        var pal = h('div', { class: 'igp-palette', role: 'radiogroup', 'aria-label': t('palette') });
        S.palette.forEach(function (c, i) {
          var b = h('button', { type: 'button', role: 'radio', class: 'igp-swatch' + (i === 0 ? ' igp-transparent' : ''), 'aria-checked': String(i === colour), 'aria-label': colourName(i), style: i ? 'background:' + c : null, tabindex: i === colour ? '0' : '-1' });
          b.addEventListener('click', function () { colour = i; renderSide(); ctx.announce(t('colourNow', { c: colourName(i) })); var nb = pal.querySelectorAll('button')[i]; if (nb) nb.focus(); });
          b.addEventListener('keydown', function (e) { var dd = { ArrowRight: 1, ArrowDown: 4, ArrowLeft: -1, ArrowUp: -4 }[e.key]; if (!dd) return; e.preventDefault(); colour = (colour + dd + S.palette.length) % S.palette.length; renderSide(); var nb = D.querySelectorAll('.igp-palette button')[colour]; if (nb) nb.focus(); });
          pal.appendChild(b);
        });
        out.push(pal);
        if (colour > 0) out.push(F.color(t('editColour', { n: colour }), S.palette[colour].slice(0, 7), { onChange: function (v) { S.palette[colour] = v; refresh(); ctx.commit(t('colourChanged')); renderSide(); } }));
        out.push(F.select(t('palettePreset'), '', [['', t('choosePalette')]].concat(Object.keys(PALETTES).map(function (k) { return [k, t('pal_' + k)]; })), { onChange: function (v) { if (!v) return; S.palette = PALETTES[v].slice(); refresh(); ctx.commit(t('paletteChanged')); renderSide(); ctx.announce(t('paletteChanged')); } }));
        out.push(h('h4', { text: t('canvasSettings') }));
        out.push(F.select(t('size'), S.w + 'x' + S.h, SIZES.map(function (s) { return [s + 'x' + s, s + ' × ' + s]; }).concat(SIZES.indexOf(S.w) < 0 || S.w !== S.h ? [[S.w + 'x' + S.h, S.w + ' × ' + S.h]] : []), { onChange: function (v) { var p = v.split('x'); resizeDoc(+p[0], +p[1]); } }));
        out.push(F.range(t('fps'), S.fps, { min: 1, max: 12, step: 1, unit: t('fpsUnit'), onChange: function (v) { S.fps = v; if (playing) { togglePlay(); togglePlay(); } ctx.commit(t('fpsChanged')); } }));
        out.push(F.check(t('onion'), onion, { onChange: function (v) { onion = !!v; refresh(); } }));
        out.push(F.check(t('tiled'), tiled, { onChange: function (v) { tiled = !!v; drawChecker(); refresh(); fit(); } }));
        out.push(F.check(t('gridLabel'), showGrid, { onChange: function (v) { showGrid = !!v; drawGrid(); render(); } }));
        out.push(h('p', { class: 'igs-muted', text: t('fpsNote') }));
        ctx.setInspector(out);
        var used = {}; S.frames[cur].forEach(function (c) { if (c) used[c] = true; });
        ctx.setSummary(t('summary', { w: S.w, h: S.h, frames: S.frames.length, n: cur + 1, colours: Object.keys(used).length, fps: S.fps }));
      }
      function resizeDoc(w, hh) {
        S.frames = S.frames.map(function (f) { var n = new Array(w * hh).fill(0); for (var y = 0; y < Math.min(hh, S.h); y++) for (var x = 0; x < Math.min(w, S.w); x++) n[y * w + x] = f[y * S.w + x]; return n; });
        S.w = w; S.h = hh; kc = { x: 0, y: 0 }; makeTextures(); drawChecker(); drawGrid(); refresh(); fit(); ctx.commit(t('resized')); renderSide();
      }

      /* ---------- Herramientas ---------- */
      ctx.setTools([
        { id: 'pencil', label: t('toolPencil'), icon: 'pen' },
        { id: 'eraser', label: t('toolEraser'), icon: 'erase' },
        { id: 'fill', label: t('toolFill'), icon: 'bucket' },
        { id: 'line', label: t('toolLine'), icon: 'line' },
        { id: 'rect', label: t('toolRect'), icon: 'square' },
        { id: 'rectFill', label: t('toolRectFill'), icon: 'square', level: 'more' },
        { id: 'ellipse', label: t('toolEllipse'), icon: 'circle', level: 'more' },
        { id: 'picker', label: t('toolPicker'), icon: 'eyedrop', level: 'more' },
        { id: 'pan', label: t('toolPan'), icon: 'pan', level: 'more' },
        { separator: true },
        { id: 'mirror', label: t('mirrorBtn'), icon: 'layers', action: toggleMirror },
        { id: 'play', label: t('playBtn'), icon: 'play', action: function (b) { playBtn = b; togglePlay(); } }
      ], { initial: 'pencil' });
      Array.prototype.forEach.call(ctx.toolbar.querySelectorAll('.igs-btn'), function (b) { var tx = b.textContent.trim(); if (tx === t('mirrorBtn')) { b.dataset.igp = 'mirror'; b.setAttribute('aria-pressed', 'false'); } if (tx === t('playBtn')) { playBtn = b; b.setAttribute('aria-pressed', 'false'); } });

      /* ---------- Exportaciones ---------- */
      function scaled(frame, sc) { var c = D.createElement('canvas'); c.width = S.w; c.height = S.h; paintCanvas(c, frame); var o = D.createElement('canvas'); o.width = S.w * sc; o.height = S.h * sc; var g = o.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(c, 0, 0, o.width, o.height); return o; }
      function exportScale() { return Math.max(1, Math.min(32, Math.round(512 / Math.max(S.w, S.h)))); }
      var name = function (suffix) { return 'pixel-art-' + ctx.stamp() + suffix; };
      ctx.addExport(t('exportPng'), function () { ctx.canvasBlob(scaled(S.frames[cur], exportScale())).then(function (b) { ctx.download(b, name('.png')); }); });
      ctx.addExport(t('exportPng1'), function () { ctx.canvasBlob(scaled(S.frames[cur], 1)).then(function (b) { ctx.download(b, name('-1x.png')); }); });
      ctx.addExport(t('exportSheet'), function () {
        var sc = Math.max(1, Math.min(8, Math.round(128 / Math.max(S.w, S.h)))), c = D.createElement('canvas'); c.width = S.w * sc * S.frames.length; c.height = S.h * sc;
        var g = c.getContext('2d'); g.imageSmoothingEnabled = false; S.frames.forEach(function (f, i) { g.drawImage(scaled(f, sc), i * S.w * sc, 0); });
        ctx.canvasBlob(c).then(function (b) { ctx.download(b, name('-sprites.png')); });
      });
      ctx.addExport(t('exportGif'), function () { var sf = safeFps(); if (sf < S.fps) ctx.announce(t('flashSlowed', { fps: sf })); var gif = encodeGif(Object.assign({}, S, { fps: Math.min(S.fps, sf) }), exportScale()); ctx.download(new Blob([gif], { type: 'image/gif' }), name('.gif')); });
      ctx.command('play', t('playBtn'), '', togglePlay); ctx.command('mirror', t('mirrorBtn'), 'M', toggleMirror);

      /* ---------- Ejemplos ---------- */
      function fromArt(rows, map) { var hh = rows.length, w = rows[0].length, f = new Array(w * hh).fill(0); rows.forEach(function (r, y) { for (var x = 0; x < w; x++) { var ch = r.charAt(x); f[y * w + x] = map[ch] || 0; } }); return f; }
      function ex(id) {
        var P = PALETTES.iris;
        if (id === 'heart') {
          S = { v: 1, w: 16, h: 16, palette: P.slice(), fps: 6, frames: [fromArt([
            '................', '................', '...RRR....RRR...', '..RWWRR..RRRRR..', '.RWWRRRRRRRRRRR.', '.RWRRRRRRRRRRRR.', '.RRRRRRRRRRRRRR.', '.RRRRRRRRRRRRRR.',
            '..RRRRRRRRRRRD..', '...RRRRRRRRRD...', '....RRRRRRRD....', '.....RRRRRD.....', '......RRRD......', '.......RD.......', '................', '................'], { R: 4, W: 2, D: 15 })] };
        } else if (id === 'ball') {
          var frames = [], ys = [4, 6, 8, 10, 8, 6];
          ys.forEach(function (y, i) {
            var f = new Array(256).fill(0), squash = y === 10;
            for (var yy = 0; yy < 16; yy++) for (var xx = 0; xx < 16; xx++) {
              var rx = squash ? 4.6 : 3.6, ry = squash ? 2.8 : 3.6, cy = y + (squash ? 1 : 0) + 0.5, cx = 7.5, dx = (xx - cx) / rx, dy = (yy - cy) / ry;
              if (dx * dx + dy * dy <= 1) f[yy * 16 + xx] = (dx < -0.2 && dy < -0.2) ? 7 : (dx + dy > 0.7 ? 5 : 6);
            }
            for (var s = 5; s <= 10; s++) f[15 * 16 + s] = 3;
            frames.push(f);
          });
          S = { v: 1, w: 16, h: 16, palette: P.slice(), fps: 8, frames: frames };
        } else if (id === 'sword') {
          S = { v: 1, w: 16, h: 16, palette: P.slice(), fps: 6, frames: [fromArt([
            '..............WW', '.............WLW', '............WLW.', '...........WLW..', '..........WLW...', '.........WLW....', '........WLW.....', '..G....WLW......',
            '..GG..WLW.......', '...GGWLW........', '....GGW.........', '...BYGG.........', '..BYB..G........', '.BYB............', 'BBB.............', '.B..............'], { W: 2, L: 3, G: 6, B: 15, Y: 7 })] };
        } else if (id === 'tile') {
          var f2 = new Array(256).fill(9), seed = 7;
          function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
          for (var i = 0; i < 256; i++) { var r = rnd(); if (r < 0.18) f2[i] = 8; else if (r < 0.24) f2[i] = 10; }
          [[3, 4], [11, 10], [7, 13], [13, 2]].forEach(function (p) { f2[p[1] * 16 + p[0]] = 7; f2[p[1] * 16 + p[0] + 1] = 6; });
          S = { v: 1, w: 16, h: 16, palette: P.slice(), fps: 6, frames: [f2] }; tiled = true;
        }
        cur = 0; pending = null; makeTextures(); drawChecker(); drawGrid(); refresh(); fit(); renderSide();
      }

      makeTextures(); drawChecker(); resize(); refresh(); renderSide();
      return {
        serialize: function () { return { v: 1, w: S.w, h: S.h, fps: S.fps, palette: S.palette.slice(), frames: S.frames.map(rle) }; },
        restore: function (st) { S = { v: 1, w: st.w, h: st.h, fps: st.fps, palette: st.palette.slice(), frames: st.frames.map(function (r) { return unrle(r, st.w * st.h); }) }; cur = Math.min(cur, S.frames.length - 1); if (pixCanvas.width !== S.w || pixCanvas.height !== S.h) { makeTextures(); drawChecker(); drawGrid(); fit(); } refresh(); renderSide(); },
        validate: function (d) {
          if (!d || !(d.w >= 1 && d.w <= 128 && d.h >= 1 && d.h <= 128) || !Array.isArray(d.palette) || d.palette.length < 2 || d.palette.length > 64 || !Array.isArray(d.frames) || !d.frames.length || d.frames.length > 64) return false;
          if (!d.palette.every(function (c) { return /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(c); })) return false;
          return d.frames.every(function (r) { var f = unrle(r, d.w * d.h); return f && f.every(function (v) { return v >= 0 && v < d.palette.length; }); });
        },
        start: function (id) { tiled = false; playing = false; clearInterval(playTimer); if (id === 'empty') { S = blank(16, 16); cur = 0; makeTextures(); drawChecker(); drawGrid(); refresh(); fit(); renderSide(); } else ex(id); },
        onTool: function (id) { tool = id; pending = null; drawOver(); render(); },
        onKey: onKey
      };
    }
  }

  function hexToRgba(hex) { var h = String(hex).replace('#', ''); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16), h.length >= 8 ? parseInt(h.substr(6, 2), 16) : 255]; }
  /* Fotogramas comprimidos: [valor, repeticiones, valor, repeticiones…] */
  function rle(f) { var out = [], i = 0; while (i < f.length) { var v = f[i], n = 1; while (i + n < f.length && f[i + n] === v) n++; out.push(v, n); i += n; } return out; }
  function unrle(r, total) {
    if (!Array.isArray(r) || r.length % 2) return null; var f = [];
    for (var i = 0; i < r.length; i += 2) { var v = r[i], n = r[i + 1]; if (!(Number.isInteger(v) && Number.isInteger(n) && n > 0) || f.length + n > total) return null; for (var k = 0; k < n; k++) f.push(v); }
    return f.length === total ? f : null;
  }

  /* ---------- Codificador GIF89a (LZW) con transparencia y bucle ---------- */
  function encodeGif(S, sc) {
    var W = S.w * sc, H = S.h * sc, pal = S.palette.map(hexToRgba), bits = 1; while ((1 << bits) < pal.length) bits++; bits = Math.max(2, bits);
    var out = [];
    function b(v) { out.push(v & 255); } function w16(v) { b(v); b(v >> 8); } function str(s) { for (var i = 0; i < s.length; i++) b(s.charCodeAt(i)); }
    str('GIF89a'); w16(W); w16(H); b(0x80 | ((bits - 1) << 4) | (bits - 1)); b(0); b(0);
    for (var i = 0; i < (1 << bits); i++) { var c = pal[i] || [0, 0, 0, 255]; b(c[0]); b(c[1]); b(c[2]); }
    b(0x21); b(0xff); b(11); str('NETSCAPE2.0'); b(3); b(1); w16(0); b(0);
    var delay = Math.round(100 / (S.fps || 6));
    S.frames.forEach(function (f) {
      b(0x21); b(0xf9); b(4); b(0x09); w16(delay); b(0); b(0); /* disposición 2 (restaurar fondo), transparente = índice 0 */
      b(0x2c); w16(0); w16(0); w16(W); w16(H); b(0);
      var px = new Uint8Array(W * H);
      for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) px[y * W + x] = f[Math.floor(y / sc) * S.w + Math.floor(x / sc)];
      lzw(px, bits, b);
    });
    b(0x3b);
    return new Uint8Array(out);
  }
  function lzw(px, minBits, b) {
    b(minBits);
    var clear = 1 << minBits, eoi = clear + 1, size = minBits + 1, next = eoi + 1, dict = new Map(), buf = 0, nbits = 0, block = [];
    function emit(code) { buf |= code << nbits; nbits += size; while (nbits >= 8) { block.push(buf & 255); buf >>= 8; nbits -= 8; if (block.length === 255) flush(); } }
    function flush() { if (!block.length) return; b(block.length); block.forEach(b); block = []; }
    emit(clear);
    var prefix = px[0];
    for (var i = 1; i < px.length; i++) {
      var k = px[i], key = prefix * 4096 + k;
      if (dict.has(key)) { prefix = dict.get(key); continue; }
      emit(prefix);
      if (next < 4096) { dict.set(key, next++); if (next > (1 << size) && size < 12) size++; }
      else { emit(clear); dict.clear(); size = minBits + 1; next = eoi + 1; }
      prefix = k;
    }
    emit(prefix); emit(eoi);
    if (nbits > 0) { block.push(buf & 255); if (block.length === 255) flush(); }
    flush(); b(0);
  }
})(window);
