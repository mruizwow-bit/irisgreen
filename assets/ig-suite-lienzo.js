/* Iris Green · El taller · Lienzo vectorial común para Cómic y Diseño gráfico (R43).
   Dibuja con PixiJS; el modelo es propio y se exporta también como SVG con las fuentes incrustadas.
   Objetos: rectángulo, elipse, línea, trazo a mano, texto, imagen, viñeta y bocadillo.
   Revisión de legibilidad: contraste WCAG 1.4.3, tamaño de letra y frases largas (lenguaje claro, ISO 24495-1). */
(function (root) {
  'use strict';
  var IG = root.IGSuite, D = root.document; if (!IG) return;
  var LANG = IG.lang;
  var FONTS = {
    atkinson: { family: 'IG Lienzo Atkinson', files: { 400: 'atkinson-hyperlegible-latin-400-normal.woff2', 700: 'atkinson-hyperlegible-latin-700-normal.woff2' }, fallback: 'system-ui, sans-serif' },
    bricolage: { family: 'IG Lienzo Bricolage', files: { 700: 'bricolage-grotesque-latin-700-normal.woff2', 800: 'bricolage-grotesque-latin-800-normal.woff2' }, fallback: 'system-ui, sans-serif' },
    newsreader: { family: 'IG Lienzo Newsreader', files: { 400: 'newsreader-latin-wght-normal.woff2', 700: 'newsreader-latin-wght-normal.woff2' }, fallback: 'Georgia, serif' },
    mono: { family: 'IG Lienzo Mono', files: { 500: 'jetbrains-mono-latin-500-normal.woff2' }, fallback: 'ui-monospace, monospace' }
  };
  var SWATCHES = ['#101820', '#ffffff', '#f6e27a', '#e0b000', '#d86b00', '#b3261e', '#c27ba0', '#5a49a8', '#1f5f8b', '#0b8f8f', '#2e7d32', '#7cc36b', '#8a5a3c', '#7d8b99', '#eef3f8', '#fbeee6'];
  /* Nombres propios para no cambiar la letra del resto de la página al cargarlas. */
  var fontsReady = null;
  function loadFonts() {
    if (fontsReady) return fontsReady;
    var list = [];
    Object.keys(FONTS).forEach(function (k) { var f = FONTS[k]; Object.keys(f.files).forEach(function (w) { if (!root.FontFace) return; var ff = new FontFace(f.family, 'url(/assets/fonts/' + f.files[w] + ')', { weight: k === 'newsreader' ? '200 800' : String(w) }); list.push(ff.load().then(function (x) { D.fonts.add(x); }).catch(function () {})); }); });
    fontsReady = Promise.all(list); return fontsReady;
  }
  function fontWeightFor(key, bold) { var ws = Object.keys(FONTS[key].files).map(Number).sort(); return bold ? ws[ws.length - 1] : ws[0]; }
  function cssFont(o) { var f = FONTS[o.font] || FONTS.atkinson; return fontWeightFor(o.font in FONTS ? o.font : 'atkinson', o.bold) + ' ' + o.size + 'px "' + f.family + '", ' + f.fallback; }
  var measureCtx = D.createElement('canvas').getContext('2d');
  function wrap(text, o, maxW) {
    measureCtx.font = cssFont(o); var out = [];
    String(text || '').split('\n').forEach(function (para) {
      var words = para.split(/\s+/).filter(Boolean), line = '';
      if (!words.length) { out.push(''); return; }
      words.forEach(function (w) {
        var test = line ? line + ' ' + w : w;
        if (measureCtx.measureText(test).width <= maxW || !line) line = test; else { out.push(line); line = w; }
        while (measureCtx.measureText(line).width > maxW && line.length > 1) { var cut = line.length - 1; while (cut > 1 && measureCtx.measureText(line.slice(0, cut)).width > maxW) cut--; out.push(line.slice(0, cut)); line = line.slice(cut); }
      });
      out.push(line);
    });
    return out;
  }
  function lineW(s, o) { measureCtx.font = cssFont(o); return measureCtx.measureText(s).width; }

  /* ---------- Color y contraste (WCAG 2.2, 1.4.3) ---------- */
  function rgb(hex) { var h = String(hex || '#000').replace('#', ''); if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join(''); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
  function relLum(hex) { return rgb(hex).map(function (v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }).reduce(function (a, v, i) { return a + v * [0.2126, 0.7152, 0.0722][i]; }, 0); }
  function contrast(a, b) { var la = relLum(a), lb = relLum(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); }
  function num(hex) { return parseInt(String(hex).replace('#', ''), 16); }

  /* ---------- Geometría de los bocadillos ---------- */
  function balloonShape(o) {
    var cx = o.x + o.w / 2, cy = o.y + o.h / 2, rx = o.w / 2, ry = o.h / 2, pts = [];
    if (o.kind === 'shout') {
      var n = 22; for (var i = 0; i < n; i++) { var a = i / n * Math.PI * 2, k = i % 2 ? 1.0 : 0.8; pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
    } else if (o.kind === 'caption') {
      pts = [[o.x, o.y], [o.x + o.w, o.y], [o.x + o.w, o.y + o.h], [o.x, o.y + o.h]];
    } else {
      for (var j = 0; j < 48; j++) { var b = j / 48 * Math.PI * 2; pts.push([cx + Math.cos(b) * rx, cy + Math.sin(b) * ry]); }
    }
    var tail = null, bubbles = [];
    if (o.kind !== 'caption' && o.tail) {
      var ang = Math.atan2(o.tail[1] - cy, o.tail[0] - cx);
      if (o.kind === 'thought') {
        for (var q = 0; q < 3; q++) { var f = 0.25 + q * 0.33, r = Math.max(4, Math.min(rx, ry) * (0.16 - q * 0.04)); var ex = cx + Math.cos(ang) * rx, ey = cy + Math.sin(ang) * ry; bubbles.push([ex + (o.tail[0] - ex) * f, ey + (o.tail[1] - ey) * f, r]); }
      } else {
        var s = 0.22; tail = [[cx + Math.cos(ang - s) * rx * 0.85, cy + Math.sin(ang - s) * ry * 0.85], [o.tail[0], o.tail[1]], [cx + Math.cos(ang + s) * rx * 0.85, cy + Math.sin(ang + s) * ry * 0.85]];
      }
    }
    return { pts: pts, tail: tail, bubbles: bubbles };
  }

  function create(ctx, spec) {
    var t = ctx.t, h = ctx.h, F = ctx.fields, vp = ctx.viewport;
    var S = null, pageIx = 0, selId = null, tool = 'select', seq = 0, kc = { x: 40, y: 40 }, cursorShown = false;
    var assets = {};
    function nid() { seq += 1; return 'o' + seq; }
    function page() { return S.pages[pageIx]; }
    function objs() { return page().objs; }
    function byId(id) { var list = objs(); for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
    function r1(v) { return Math.round(v * 10) / 10 || 0; }

    var app = new PIXI.Application();
    return Promise.all([loadFonts(), app.init({ antialias: true, background: '#dfe6ee', autoStart: false, resolution: Math.min(2, root.devicePixelRatio || 1), autoDensity: true, preference: 'webgl', width: Math.max(300, vp.clientWidth), height: Math.max(240, vp.clientHeight) })]).then(function () {
      ctx.setTech('renderer', 'PixiJS ' + PIXI.VERSION + ' · ' + (app.renderer.name === 'webgpu' ? 'WebGPU' : 'WebGL') + ' · SVG');
      app.canvas.setAttribute('aria-hidden', 'true'); vp.appendChild(app.canvas);
      return build();
    });

    function build() {
      var world = new PIXI.Container(), pageC = new PIXI.Container(), shadow = new PIXI.Graphics(), preview = new PIXI.Graphics();
      app.stage.addChild(world); world.addChild(shadow); world.addChild(pageC); world.addChild(preview);
      var overlay = h('div', { class: 'igl-overlay' }); vp.appendChild(overlay);
      var view = new ctx.View2D({ scale: 0.6, min: 0.05, max: 8, onChange: function () { world.position.set(view.x, view.y); world.scale.set(view.scale); drawOverlay(); render(); } });
      ctx.attachViewGestures(vp, view, { isPanTool: function () { return tool === 'pan'; } });
      function fit() { var W = app.renderer.width / app.renderer.resolution, H = app.renderer.height / app.renderer.resolution; view.fit({ minX: 0, minY: 0, maxX: S.w, maxY: S.h }, W, H, 24); }
      function resize() { app.renderer.resize(Math.max(200, vp.clientWidth), Math.max(160, vp.clientHeight)); if (S) fit(); }
      if (root.ResizeObserver) new ResizeObserver(resize).observe(vp);
      var rq = 0; function render() { if (!rq) rq = root.requestAnimationFrame(function () { rq = 0; app.render(); }); }

      /* ---------- Dibujo de la página ---------- */
      function drawPage(container, pg, opts) {
        container.removeChildren().forEach(function (c) { c.destroy({ children: true }); });
        var bg = new PIXI.Graphics(); bg.rect(0, 0, S.w, S.h).fill({ color: num(S.bg) }); container.addChild(bg);
        pg.objs.forEach(function (o) { var c = drawObj(o); if (c) container.addChild(c); });
        if (!opts || !opts.noMask) { var mask = new PIXI.Graphics(); mask.rect(0, 0, S.w, S.h).fill({ color: 0xffffff }); container.addChild(mask); container.mask = mask; }
      }
      function textLines(container, o, lines, boxX, boxW, y0) {
        var lh = o.size * (o.lineH || 1.25), fam = (FONTS[o.font] || FONTS.atkinson);
        lines.forEach(function (ln, i) {
          var tx = new PIXI.Text({ text: ln, style: { fontFamily: [fam.family].concat(fam.fallback.split(',').map(function (s) { return s.trim(); })), fontSize: o.size, fontWeight: String(fontWeightFor(o.font in FONTS ? o.font : 'atkinson', o.bold)), fill: o.color || '#101820' }, resolution: 2 });
          var w = lineW(ln, o), x = o.align === 'center' ? boxX + (boxW - w) / 2 : o.align === 'right' ? boxX + boxW - w : boxX;
          tx.position.set(x, y0 + i * lh + (lh - o.size) / 2 - o.size * 0.08); container.addChild(tx);
        });
      }
      function drawObj(o) {
        var c = new PIXI.Container(), g = new PIXI.Graphics(); c.addChild(g);
        c.pivot.set(o.x + o.w / 2, o.y + o.h / 2); c.position.set(o.x + o.w / 2, o.y + o.h / 2); c.rotation = (o.rot || 0) * Math.PI / 180; c.alpha = o.opacity == null ? 1 : o.opacity;
        var sw = o.sw || 0;
        switch (o.type) {
          case 'rect': case 'panel':
            g.roundRect(o.x, o.y, o.w, o.h, o.radius || 0); if (o.fill && o.fill !== 'none') g.fill({ color: num(o.fill) }); if (sw) g.stroke({ width: sw, color: num(o.stroke || '#101820'), alignment: 0.5 }); break;
          case 'ellipse':
            g.ellipse(o.x + o.w / 2, o.y + o.h / 2, Math.abs(o.w / 2), Math.abs(o.h / 2)); if (o.fill && o.fill !== 'none') g.fill({ color: num(o.fill) }); if (sw) g.stroke({ width: sw, color: num(o.stroke || '#101820') }); break;
          case 'line': {
            g.moveTo(o.x, o.y).lineTo(o.x + o.w, o.y + o.h).stroke({ width: Math.max(1, sw), color: num(o.stroke || '#101820'), cap: 'round' });
            if (o.arrow) { var a = Math.atan2(o.h, o.w), L = Math.max(10, sw * 4), ex = o.x + o.w, ey = o.y + o.h; g.poly([ex, ey, ex - Math.cos(a - 0.45) * L, ey - Math.sin(a - 0.45) * L, ex - Math.cos(a + 0.45) * L, ey - Math.sin(a + 0.45) * L]).fill({ color: num(o.stroke || '#101820') }); }
            break;
          }
          case 'pen': {
            var p = o.pts; if (!p || p.length < 2) break;
            g.moveTo(o.x + p[0][0] * o.w, o.y + p[0][1] * o.h); for (var i = 1; i < p.length; i++) g.lineTo(o.x + p[i][0] * o.w, o.y + p[i][1] * o.h);
            g.stroke({ width: Math.max(1, sw), color: num(o.stroke || '#101820'), cap: 'round', join: 'round' }); break;
          }
          case 'text': {
            if (o.fill && o.fill !== 'none') g.roundRect(o.x - 8, o.y - 6, o.w + 16, o.h + 12, 8).fill({ color: num(o.fill) });
            textLines(c, o, wrap(o.text, o, o.w), o.x, o.w, o.y); break;
          }
          case 'image': {
            var tex = assets[o.ref];
            if (tex) { var sp = new PIXI.Sprite(tex), sc = (o.fit === 'contain' ? Math.min : Math.max)(o.w / tex.width, o.h / tex.height); sp.scale.set(sc); sp.position.set(o.x + (o.w - tex.width * sc) / 2, o.y + (o.h - tex.height * sc) / 2); var m = new PIXI.Graphics(); m.rect(o.x, o.y, o.w, o.h).fill({ color: 0xffffff }); c.addChild(sp); c.addChild(m); sp.mask = m; }
            else { g.rect(o.x, o.y, o.w, o.h).fill({ color: 0xdfe6ee }).stroke({ width: 2, color: 0x7d8b99 }); g.moveTo(o.x, o.y).lineTo(o.x + o.w, o.y + o.h).moveTo(o.x + o.w, o.y).lineTo(o.x, o.y + o.h).stroke({ width: 2, color: 0x7d8b99 }); }
            if (sw) g.rect(o.x, o.y, o.w, o.h).stroke({ width: sw, color: num(o.stroke || '#101820') });
            break;
          }
          case 'balloon': {
            var sh = balloonShape(o), flat = [].concat.apply([], sh.pts), fill = num(o.fill || (o.kind === 'caption' ? '#fff4c2' : '#ffffff')), st = num(o.stroke || '#101820'), bw = Math.max(1, sw || 3);
            /* primero el contorno doble, luego el relleno: la cola se funde con el globo */
            g.poly(flat).stroke({ width: bw * 2, color: st, join: 'round' }); if (sh.tail) g.poly([].concat.apply([], sh.tail)).stroke({ width: bw * 2, color: st, join: 'round' });
            g.poly(flat).fill({ color: fill }); if (sh.tail) g.poly([].concat.apply([], sh.tail)).fill({ color: fill });
            sh.bubbles.forEach(function (b) { g.circle(b[0], b[1], b[2]).fill({ color: fill }).stroke({ width: bw, color: st }); });
            var inner = o.kind === 'caption' ? o.w - 20 : o.w * 0.72, lines = wrap(o.text, o, inner), lh = o.size * (o.lineH || 1.2), th = lines.length * lh;
            textLines(c, Object.assign({}, o, { align: o.kind === 'caption' ? (o.align || 'left') : 'center' }), lines, o.x + (o.w - inner) / 2, inner, o.y + (o.h - th) / 2);
            break;
          }
        }
        return c;
      }
      function textHeight(o) { return Math.max(o.size * 1.25, wrap(o.text, o, o.w).length * o.size * (o.lineH || 1.25)); }
      function refresh() {
        objs().forEach(function (o) { if (o.type === 'text') o.h = r1(textHeight(o)); });
        shadow.clear(); shadow.rect(6, 8, S.w, S.h).fill({ color: 0x172b42, alpha: 0.18 });
        drawPage(pageC, page());
        drawOverlay(); render(); renderSide();
      }

      /* ---------- Selección: capa HTML accesible con asas ---------- */
      var handleDefs = [['nw', 0, 0], ['ne', 1, 0], ['se', 1, 1], ['sw', 0, 1]];
      function drawOverlay() {
        ctx.clear(overlay);
        var o = byId(selId);
        var cc = view.toScreen(kc.x, kc.y);
        overlay.appendChild(h('div', { class: 'igl-cursor' + (cursorShown ? '' : ' igl-cursor-dim'), style: 'left:' + cc.x + 'px;top:' + cc.y + 'px' }));
        if (!o) return;
        var p0 = view.toScreen(o.x, o.y);
        var box = h('div', { class: 'igl-selbox', style: 'left:' + p0.x + 'px;top:' + p0.y + 'px;width:' + (o.w * view.scale) + 'px;height:' + (o.h * view.scale) + 'px;transform:rotate(' + (o.rot || 0) + 'deg)' });
        overlay.appendChild(box);
        if (o.type === 'line') {
          [[o.x, o.y, 'start'], [o.x + o.w, o.y + o.h, 'end']].forEach(function (pt) { handle(pt[0], pt[1], pt[2]); });
          box.classList.add('igl-selbox-line');
        } else {
          handleDefs.forEach(function (d) { var pt = rotPoint(o, o.x + d[1] * o.w, o.y + d[2] * o.h); handle(pt[0], pt[1], d[0]); });
        }
        if (o.type === 'balloon' && o.tail) handle(o.tail[0], o.tail[1], 'tail');
      }
      function rotPoint(o, x, y) { var a = (o.rot || 0) * Math.PI / 180, cx = o.x + o.w / 2, cy = o.y + o.h / 2, dx = x - cx, dy = y - cy; return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)]; }
      function handle(x, y, which) {
        var p = view.toScreen(x, y);
        var b = h('button', { type: 'button', class: 'igl-handle igl-h-' + which, 'aria-label': t('handle_' + which) + '. ' + t('handleHelp'), style: 'left:' + p.x + 'px;top:' + p.y + 'px' });
        b.addEventListener('pointerdown', function (e) { e.stopPropagation(); e.preventDefault(); startHandle(e, which); });
        b.addEventListener('keydown', function (e) {
          var st = e.shiftKey ? 10 : 1, d = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, -st], ArrowDown: [0, st] }[e.key]; if (!d) return;
          e.preventDefault(); e.stopPropagation(); moveHandle(byId(selId), which, d[0], d[1]); refresh(); focusHandle(which); keyCommit(t('resized'));
        });
        overlay.appendChild(b);
      }
      function focusHandle(which) { var b = overlay.querySelector('.igl-h-' + which); if (b) b.focus(); }
      function moveHandle(o, which, dx, dy) {
        if (!o) return;
        if (which === 'tail') { o.tail = [r1(o.tail[0] + dx), r1(o.tail[1] + dy)]; return; }
        if (which === 'start') { o.x = r1(o.x + dx); o.y = r1(o.y + dy); o.w = r1(o.w - dx); o.h = r1(o.h - dy); return; }
        if (which === 'end') { o.w = r1(o.w + dx); o.h = r1(o.h + dy); return; }
        var a = -(o.rot || 0) * Math.PI / 180, lx = dx * Math.cos(a) - dy * Math.sin(a), ly = dx * Math.sin(a) + dy * Math.cos(a);
        var nx = o.x, ny = o.y, nw = o.w, nh = o.h;
        if (which.indexOf('w') >= 0) { nx += lx; nw -= lx; } if (which.indexOf('e') >= 0) nw += lx;
        if (which.indexOf('n') >= 0) { ny += ly; nh -= ly; } if (which.indexOf('s') >= 0) nh += ly;
        if (nw < 8 || nh < 8) return;
        o.x = r1(nx); o.y = r1(ny); o.w = r1(nw); if (o.type !== 'text') o.h = r1(nh);
      }
      var hdrag = null;
      function startHandle(e, which) { var o = byId(selId); if (!o) return; hdrag = { which: which, last: toWorld(e), orig: JSON.stringify(o), pid: e.pointerId }; }
      function toWorld(e) { var r = app.canvas.getBoundingClientRect(); return view.toWorld(e.clientX - r.left, e.clientY - r.top); }
      root.addEventListener('pointermove', function (e) {
        if (!hdrag || e.pointerId !== hdrag.pid) return;
        var p = toWorld(e), o = byId(selId); moveHandle(o, hdrag.which, p.x - hdrag.last.x, p.y - hdrag.last.y); hdrag.last = p; refreshLight();
      });
      root.addEventListener('pointerup', function (e) { if (!hdrag || e.pointerId !== hdrag.pid) return; var o = byId(selId), changed = o && JSON.stringify(o) !== hdrag.orig; hdrag = null; if (changed) commit(t('resized')); });
      function refreshLight() { objs().forEach(function (o) { if (o.type === 'text') o.h = r1(textHeight(o)); }); drawPage(pageC, page()); drawOverlay(); render(); }
      var kcTimer = 0; function keyCommit(label) { clearTimeout(kcTimer); kcTimer = setTimeout(function () { ctx.commit(label); }, 400); }

      /* ---------- Puntero en el lienzo ---------- */
      function hit(x, y) {
        var list = objs();
        for (var i = list.length - 1; i >= 0; i--) {
          var o = list[i];
          if (o.type === 'line') { var dx = o.w, dy = o.h, L2 = dx * dx + dy * dy || 1, u = Math.max(0, Math.min(1, ((x - o.x) * dx + (y - o.y) * dy) / L2)); if (Math.hypot(x - (o.x + u * dx), y - (o.y + u * dy)) < Math.max(8, o.sw) / view.scale * view.scale + 6 / view.scale) return o; continue; }
          var a = -(o.rot || 0) * Math.PI / 180, cx = o.x + o.w / 2, cy = o.y + o.h / 2, lx = (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a) + cx, ly = (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a) + cy;
          if (lx >= o.x - 4 && lx <= o.x + o.w + 4 && ly >= o.y - 4 && ly <= o.y + o.h + 4) return o;
        }
        return null;
      }
      var drag = null;
      app.canvas.addEventListener('pointerdown', function (e) {
        if (e.button !== 0 || tool === 'pan') return;
        var p = toWorld(e); kc.x = r1(p.x); kc.y = r1(p.y); cursorShown = false;
        if (tool === 'select') {
          var o = hit(p.x, p.y); select(o ? o.id : null);
          if (o) { drag = { mode: 'move', start: p, orig: JSON.stringify(o), pid: e.pointerId }; app.canvas.setPointerCapture(e.pointerId); }
          return;
        }
        if (tool === 'text' || tool === 'balloon') { addAt(tool, p.x, p.y); return; }
        drag = { mode: 'create', start: p, cur: p, pid: e.pointerId, pts: [[p.x, p.y]] }; app.canvas.setPointerCapture(e.pointerId);
      });
      app.canvas.addEventListener('pointermove', function (e) {
        if (!drag || e.pointerId !== drag.pid) return;
        var p = toWorld(e);
        if (drag.mode === 'move') { var o = byId(selId), orig = JSON.parse(drag.orig), dx = p.x - drag.start.x, dy = p.y - drag.start.y; o.x = r1(orig.x + dx); o.y = r1(orig.y + dy); if (o.tail) o.tail = [r1(orig.tail[0] + dx), r1(orig.tail[1] + dy)]; drawPage(pageC, page()); drawOverlay(); render(); return; }
        drag.cur = p; if (tool === 'pen') drag.pts.push([p.x, p.y]);
        drawPreview();
      });
      function drawPreview() {
        preview.clear(); if (!drag || drag.mode !== 'create') return;
        var a = drag.start, b = drag.cur, lw = 2 / view.scale;
        if (tool === 'line') preview.moveTo(a.x, a.y).lineTo(b.x, b.y).stroke({ width: lw * 2, color: 0x5a49a8 });
        else if (tool === 'pen') { preview.moveTo(drag.pts[0][0], drag.pts[0][1]); drag.pts.forEach(function (q) { preview.lineTo(q[0], q[1]); }); preview.stroke({ width: Math.max(lw, penWidth), color: num(penColour) }); }
        else { var x = Math.min(a.x, b.x), y = Math.min(a.y, b.y), w = Math.abs(b.x - a.x), hh = Math.abs(b.y - a.y); if (tool === 'ellipse') preview.ellipse(x + w / 2, y + hh / 2, w / 2, hh / 2); else preview.rect(x, y, w, hh); preview.stroke({ width: lw, color: 0x5a49a8 }).fill({ color: 0x5a49a8, alpha: 0.08 }); }
        render();
      }
      function endDrag(e) {
        if (!drag || e.pointerId !== drag.pid) return;
        var d = drag; drag = null; preview.clear();
        if (d.mode === 'move') { var o = byId(selId); if (o && JSON.stringify(o) !== d.orig) commit(t('moved')); else render(); return; }
        var a = d.start, b = d.cur, w = Math.abs(b.x - a.x), hh = Math.abs(b.y - a.y);
        if (tool === 'pen') { if (d.pts.length > 2) addPen(d.pts); render(); return; }
        if (tool === 'line') { if (Math.hypot(b.x - a.x, b.y - a.y) < 4) { addAt('line', a.x, a.y); return; } addObj({ type: 'line', x: r1(a.x), y: r1(a.y), w: r1(b.x - a.x), h: r1(b.y - a.y), stroke: '#101820', sw: 4, arrow: false }); return; }
        if (w < 6 || hh < 6) { addAt(tool, a.x, a.y); return; }
        addObj(defaults(tool, Math.min(a.x, b.x), Math.min(a.y, b.y), w, hh));
      }
      app.canvas.addEventListener('pointerup', endDrag); app.canvas.addEventListener('pointercancel', endDrag);
      app.canvas.addEventListener('dblclick', function () { var o = byId(selId); if (o && (o.type === 'text' || o.type === 'balloon')) { var ta = ctx.inspector.querySelector('textarea'); if (ta) ta.focus(); } });

      /* ---------- Creación de objetos ---------- */
      var penColour = '#101820', penWidth = 4;
      function defaults(kind, x, y, w, hh) {
        var base = { x: r1(x), y: r1(y), w: r1(w), h: r1(hh), rot: 0, opacity: 1 };
        if (kind === 'rect') return Object.assign(base, { type: 'rect', fill: '#f6e27a', stroke: '#101820', sw: 0, radius: 0 });
        if (kind === 'ellipse') return Object.assign(base, { type: 'ellipse', fill: '#6fa8dc', stroke: '#101820', sw: 0 });
        if (kind === 'line') return Object.assign(base, { type: 'line', stroke: '#101820', sw: 4, arrow: false });
        if (kind === 'panel') return Object.assign(base, { type: 'panel', fill: '#ffffff', stroke: '#101820', sw: 4, radius: 0 });
        if (kind === 'text') return Object.assign(base, { type: 'text', text: t('newText'), font: spec.defaultFont || 'atkinson', size: spec.defaultSize || 32, bold: true, color: '#101820', align: 'left', fill: 'none' });
        if (kind === 'balloon') return Object.assign(base, { type: 'balloon', kind: 'speech', text: t('newBalloon'), font: 'atkinson', size: 22, bold: false, color: '#101820', fill: '#ffffff', stroke: '#101820', sw: 3, tail: [r1(x + w * 0.25), r1(y + hh + 60)] });
        return base;
      }
      function addAt(kind, x, y) {
        var sz = { rect: [200, 140], ellipse: [160, 160], panel: [300, 220], text: [320, 40], balloon: [260, 130], line: [200, 0] }[kind] || [160, 120];
        if (kind === 'line') { addObj({ type: 'line', x: r1(x), y: r1(y), w: 200, h: 0, stroke: '#101820', sw: 4, arrow: false, rot: 0, opacity: 1 }); return; }
        addObj(defaults(kind, x, y, sz[0], sz[1]));
      }
      function addPen(pts) {
        var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
        var x0 = Math.min.apply(null, xs), y0 = Math.min.apply(null, ys), w = Math.max(1, Math.max.apply(null, xs) - x0), hh = Math.max(1, Math.max.apply(null, ys) - y0);
        var simp = []; pts.forEach(function (p, i) { if (i === 0 || i === pts.length - 1 || Math.hypot(p[0] - simp[simp.length - 1][0] * w - x0, p[1] - simp[simp.length - 1][1] * hh - y0) > 2) simp.push([(p[0] - x0) / w, (p[1] - y0) / hh]); });
        addObj({ type: 'pen', x: r1(x0), y: r1(y0), w: r1(w), h: r1(hh), pts: simp.map(function (p) { return [Math.round(p[0] * 1000) / 1000, Math.round(p[1] * 1000) / 1000]; }), stroke: penColour, sw: penWidth, rot: 0, opacity: 1 });
      }
      function addObj(o) { o.id = nid(); objs().push(o); selId = o.id; commit(t('added', { what: t('type_' + o.type) })); }
      function select(id) { selId = id; drawOverlay(); renderSide(); if (id) { var o = byId(id); ctx.announce(t('selected', { what: describe(o) })); } }
      function commit(label) { refresh(); ctx.commit(label); if (label) ctx.announce(label); }
      function removeSel() { var o = byId(selId); if (!o) return; page().objs = objs().filter(function (x) { return x !== o; }); selId = null; commit(t('deleted', { what: t('type_' + o.type) })); }
      function reorder(dir) { var o = byId(selId); if (!o) return; var list = objs(), i = list.indexOf(o), j = dir === 'top' ? list.length - 1 : dir === 'bottom' ? 0 : Math.max(0, Math.min(list.length - 1, i + dir)); if (i === j) return; list.splice(i, 1); list.splice(j, 0, o); commit(t('reordered')); }
      function duplicate() { var o = byId(selId); if (!o) return; var c = JSON.parse(JSON.stringify(o)); c.id = nid(); c.x += 20; c.y += 20; if (c.tail) { c.tail[0] += 20; c.tail[1] += 20; } objs().push(c); selId = c.id; commit(t('duplicated')); }
      function describe(o) {
        if (!o) return '';
        var base = t('type_' + o.type) + (o.kind ? ' (' + t('kind_' + o.kind) + ')' : '');
        var txt = (o.type === 'text' || o.type === 'balloon') ? ': «' + String(o.text).slice(0, 60) + '»' : '';
        return base + txt + ' · ' + t('posSize', { x: Math.round(o.x), y: Math.round(o.y), w: Math.round(Math.abs(o.w)), h: Math.round(Math.abs(o.h)) });
      }
      function chooseImage() {
        ctx.pickFile('image/png,image/jpeg,image/webp,image/gif').then(function (file) {
          if (!file) return; if (file.size > 20 * 1024 * 1024) { ctx.announce(t('imageTooBig')); return; }
          var url = URL.createObjectURL(file), im = new Image();
          im.onload = function () {
            var sc = Math.min(1, 1600 / Math.max(im.naturalWidth, im.naturalHeight)), c = D.createElement('canvas'); c.width = Math.round(im.naturalWidth * sc); c.height = Math.round(im.naturalHeight * sc);
            c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
            var data = c.toDataURL(/png|gif|webp/.test(file.type) ? 'image/png' : 'image/jpeg', 0.88), ref = 'm' + (++seq);
            S.media[ref] = data;
            loadTex(ref, data).then(function () { var w = Math.min(S.w * 0.6, c.width), hh = w * c.height / c.width; addObj({ type: 'image', ref: ref, x: r1((S.w - w) / 2), y: r1((S.h - hh) / 2), w: r1(w), h: r1(hh), fit: 'cover', rot: 0, opacity: 1, sw: 0, stroke: '#101820', alt: '' }); });
          };
          im.onerror = function () { URL.revokeObjectURL(url); ctx.announce(t('imageError')); };
          im.src = url;
        });
      }
      function loadTex(ref, data) { return new Promise(function (res) { var im = new Image(); im.onload = function () { assets[ref] = PIXI.Texture.from(im); res(); }; im.onerror = function () { res(); }; im.src = data; }); }
      function gcMedia() { var used = {}; S.pages.forEach(function (p) { p.objs.forEach(function (o) { if (o.ref) used[o.ref] = 1; }); }); Object.keys(S.media).forEach(function (k) { if (!used[k]) { delete S.media[k]; if (assets[k]) { assets[k].destroy(true); delete assets[k]; } } }); }

      /* ---------- Teclado ---------- */
      function onKey(e) {
        if (!vp.contains(e.target) || e.target.closest('.igl-handle')) return false;
        var k = e.key, o = byId(selId), st = e.shiftKey ? 10 : 1, d = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, -st], ArrowDown: [0, st] }[k];
        if (d && o && tool === 'select') { o.x = r1(o.x + d[0]); o.y = r1(o.y + d[1]); if (o.tail) o.tail = [r1(o.tail[0] + d[0]), r1(o.tail[1] + d[1])]; refreshLight(); keyCommit(t('moved')); ctx.announce(t('selected', { what: describe(o) })); return true; }
        if (d) { var s2 = e.shiftKey ? 50 : 10; kc.x = Math.max(0, Math.min(S.w, kc.x + d[0] / st * s2)); kc.y = Math.max(0, Math.min(S.h, kc.y + d[1] / st * s2)); cursorShown = true; drawOverlay(); var under = hit(kc.x, kc.y); ctx.announce(t('cursorAt', { x: Math.round(kc.x), y: Math.round(kc.y) }) + (under ? ' · ' + describe(under) : '')); return true; }
        if (k === 'Enter' || k === ' ') {
          if (tool === 'select') { var u = hit(kc.x, kc.y); select(u ? u.id : null); if (!u) ctx.announce(t('nothingHere')); return true; }
          if (tool === 'pan' || tool === 'pen') return false;
          addAt(tool, kc.x, kc.y); return true;
        }
        if ((k === 'Delete' || k === 'Backspace') && o) { removeSel(); return true; }
        if (k === 'Escape' && o) { select(null); ctx.announce(t('deselected')); return true; }
        if ((e.ctrlKey || e.metaKey) && k.toLowerCase() === 'd' && o) { duplicate(); return true; }
        if ((k === 'r' || k === 'R') && o) { o.rot = ((o.rot || 0) + (e.shiftKey ? -15 : 15) + 360) % 360; commit(t('rotated')); return true; }
        return false;
      }

      /* ---------- Revisión de legibilidad ---------- */
      function bgUnder(o) {
        var list = objs(), idx = list.indexOf(o), cx = o.x + o.w / 2, cy = o.y + o.h / 2;
        if (o.type === 'balloon') return o.fill || '#ffffff';
        if (o.type === 'text' && o.fill && o.fill !== 'none') return o.fill;
        for (var i = idx - 1; i >= 0; i--) {
          var b = list[i]; if (b.type === 'line' || b.type === 'pen' || b.type === 'text' || b.type === 'balloon') continue;
          if (cx >= b.x && cx <= b.x + b.w && cy >= b.y && cy <= b.y + b.h) { if (b.type === 'image') return null; if (b.fill && b.fill !== 'none' && (b.opacity == null || b.opacity >= 0.95)) return b.fill; }
        }
        return S.bg;
      }
      function review() {
        var items = [];
        S.pages.forEach(function (p, pi) {
          p.objs.forEach(function (o) {
            if (o.type !== 'text' && o.type !== 'balloon') return;
            var name = '«' + String(o.text).slice(0, 30) + (String(o.text).length > 30 ? '…' : '') + '»' + (S.pages.length > 1 ? ' (' + t('pageN', { n: pi + 1 }) + ')' : '');
            var bgc = pageIx === pi ? bgUnder(o) : (function () { var keep = pageIx; pageIx = pi; var r = bgUnder(o); pageIx = keep; return r; })();
            if (bgc == null) items.push({ ok: null, text: t('revOverImage', { name: name }) });
            else {
              var cr = contrast(o.color || '#101820', bgc), large = o.size >= 24 || (o.bold && o.size >= 18.66), need = large ? 3 : 4.5;
              items.push({ ok: cr >= need, text: t(cr >= need ? 'revContrastOk' : 'revContrastBad', { name: name, cr: IG.num(cr, 1), need: IG.num(need, 1) }) });
            }
            var minSize = spec.minTextSize ? spec.minTextSize(S) : 16;
            if (o.size < minSize) items.push({ ok: false, text: t('revSmall', { name: name, size: o.size, min: minSize }) });
            var longest = String(o.text).split(/[.!?¡¿]+/).map(function (s) { return s.split(/\s+/).filter(Boolean).length; }).reduce(function (a, b) { return Math.max(a, b); }, 0);
            if (longest > 25) items.push({ ok: false, text: t('revLong', { name: name, n: longest }) });
          });
          p.objs.forEach(function (o) { if (o.type === 'image' && !String(o.alt || '').trim()) items.push({ ok: false, text: t('revAlt') }); });
        });
        return items;
      }

      /* ---------- Paneles ---------- */
      function colourField(label, value, onChange, allowNone) {
        var wrapEl = h('div', { class: 'igs-field igl-colour' }, h('span', { class: 'igl-colour-label', text: label }));
        var row = h('div', { class: 'igl-swatches', role: 'group', 'aria-label': label });
        (allowNone ? ['none'] : []).concat(SWATCHES).forEach(function (c) {
          var b = h('button', { type: 'button', class: 'igl-sw' + (c === 'none' ? ' igl-sw-none' : ''), style: c === 'none' ? null : 'background:' + c, 'aria-pressed': String(String(value).toLowerCase() === c), 'aria-label': c === 'none' ? t('noColour') : t('colourHex', { hex: c }) });
          b.addEventListener('click', function () { onChange(c); }); row.appendChild(b);
        });
        wrapEl.appendChild(row);
        var custom = F.color(t('customColour'), value && value !== 'none' ? value : '#ffffff', { onChange: onChange }); wrapEl.appendChild(custom);
        return wrapEl;
      }
      function renderSide() {
        var struct = [];
        if (spec.pages) {
          var pl = h('ul', { class: 'igs-list' });
          S.pages.forEach(function (p, i) { var b = h('button', { type: 'button', 'aria-current': String(i === pageIx) }, h('span', { class: 'igs-swatch', style: 'background:#fff' }), h('span', { text: t('pageN', { n: i + 1 }) }), h('small', { text: t('nObjects', { n: p.objs.length }) })); b.addEventListener('click', function () { goPage(i); }); pl.appendChild(h('li', null, b)); });
          struct.push(h('h3', { text: t('pages') }), pl, h('div', { class: 'igs-actions' }, ctx.button(t('addPage'), { icon: 'plus', onClick: function () { addPage(false); } }), ctx.button(t('dupPage'), { icon: 'copy', onClick: function () { addPage(true); } }), ctx.button(t('delPage'), { icon: 'trash', class: 'igs-danger', onClick: delPage })));
        }
        var ul = h('ul', { class: 'igs-list' });
        objs().slice().reverse().forEach(function (o) {
          var b = h('button', { type: 'button', 'aria-current': String(o.id === selId) }, h('span', { class: 'igs-swatch', style: 'background:' + (o.fill && o.fill !== 'none' ? o.fill : (o.color || o.stroke || '#ccc')) }), h('span', { text: t('type_' + o.type) + ((o.type === 'text' || o.type === 'balloon') ? ': ' + String(o.text).slice(0, 18) : '') }));
          b.addEventListener('click', function () { select(o.id); }); ul.appendChild(h('li', null, b));
        });
        struct.push(h('h3', { text: t('layers') + ' (' + objs().length + ')' }), ul, h('p', { class: 'igs-muted', text: t('layersHelp') }));
        ctx.setStructure(struct);

        var out = [], o = byId(selId);
        if (o) {
          out.push(h('h4', { text: t('type_' + o.type) }));
          if (o.type === 'text' || o.type === 'balloon') {
            out.push(F.text(t('textLabel'), o.text, { multiline: true, max: 600, onChange: function (v) { o.text = String(v).slice(0, 600); commit(t('textChanged')); } }));
            if (o.type === 'balloon') out.push(F.choice(t('balloonKind'), o.kind, ['speech', 'thought', 'shout', 'caption'].map(function (k) { return [k, t('kind_' + k)]; }), { onChange: function (v) { o.kind = v; if (v === 'caption') o.fill = '#fff4c2'; else if (o.fill === '#fff4c2') o.fill = '#ffffff'; if (v !== 'caption' && !o.tail) o.tail = [o.x + o.w * 0.25, o.y + o.h + 60]; commit(t('changed')); } }));
            out.push(F.select(t('font'), o.font, Object.keys(FONTS).map(function (k) { return [k, t('font_' + k)]; }), { onChange: function (v) { o.font = v; commit(t('changed')); } }));
            out.push(F.number(t('size'), o.size, { unit: 'px', min: 8, max: 400, step: 1, onChange: function (v) { o.size = v; commit(t('changed')); } }));
            out.push(F.check(t('bold'), !!o.bold, { onChange: function (v) { o.bold = !!v; commit(t('changed')); } }));
            if (o.type === 'text') out.push(F.choice(t('align'), o.align || 'left', [['left', t('alignLeft')], ['center', t('alignCenter')], ['right', t('alignRight')]], { onChange: function (v) { o.align = v; commit(t('changed')); } }));
            out.push(colourField(t('textColour'), o.color, function (v) { o.color = v; commit(t('colourChanged')); }));
            var bg = bgUnder(o); if (bg) { var cr = contrast(o.color, bg), large = o.size >= 24 || (o.bold && o.size >= 18.66), need = large ? 3 : 4.5; out.push(h('p', { class: 'igs-result', 'data-kind': cr >= need ? 'ok' : 'bad' }, h('strong', { text: t('contrastLabel', { cr: IG.num(cr, 1) }) }), ' ', t(cr >= need ? 'contrastOk' : 'contrastBad', { need: IG.num(need, 1) }))); }
            if (o.type === 'text') out.push(colourField(t('boxColour'), o.fill || 'none', function (v) { o.fill = v; commit(t('colourChanged')); }, true));
            if (o.type === 'balloon') out.push(colourField(t('fillColour'), o.fill, function (v) { o.fill = v; commit(t('colourChanged')); }));
            if (o.type === 'balloon' && o.tail) [0, 1].forEach(function (ax) { out.push(F.number(t('tailPos') + ' · ' + (ax ? 'y' : 'x'), Math.round(o.tail[ax]), { unit: 'px', min: -5000, max: 10000, step: 1, onChange: function (v) { o.tail[ax] = v; commit(t('changed')); } })); });
          }
          if (o.type === 'rect' || o.type === 'ellipse' || o.type === 'panel') {
            out.push(colourField(t('fillColour'), o.fill, function (v) { o.fill = v; commit(t('colourChanged')); }, true));
            out.push(colourField(t('strokeColour'), o.stroke, function (v) { o.stroke = v; commit(t('colourChanged')); }));
            out.push(F.number(t('strokeWidth'), o.sw || 0, { unit: 'px', min: 0, max: 60, step: 1, onChange: function (v) { o.sw = v; commit(t('changed')); } }));
            if (o.type !== 'ellipse') out.push(F.number(t('radius'), o.radius || 0, { unit: 'px', min: 0, max: 400, step: 1, onChange: function (v) { o.radius = v; commit(t('changed')); } }));
          }
          if (o.type === 'line' || o.type === 'pen') {
            out.push(colourField(t('strokeColour'), o.stroke, function (v) { o.stroke = v; commit(t('colourChanged')); }));
            out.push(F.number(t('strokeWidth'), o.sw || 1, { unit: 'px', min: 1, max: 60, step: 1, onChange: function (v) { o.sw = v; commit(t('changed')); } }));
            if (o.type === 'line') out.push(F.check(t('arrow'), !!o.arrow, { onChange: function (v) { o.arrow = !!v; commit(t('changed')); } }));
          }
          if (o.type === 'image') {
            out.push(F.text(t('altText'), o.alt || '', { max: 200, onChange: function (v) { o.alt = String(v).slice(0, 200); commit(t('changed')); } }));
            out.push(h('p', { class: 'igs-muted', text: t('altHelp') }));
            out.push(F.choice(t('fit'), o.fit || 'cover', [['cover', t('fitCover')], ['contain', t('fitContain')]], { onChange: function (v) { o.fit = v; commit(t('changed')); } }));
          }
          out.push(h('p', { class: 'igs-field-group', text: t('position') }));
          [['x', 'X'], ['y', 'Y'], ['w', t('width')], ['h', t('height')]].forEach(function (f) { if (f[0] === 'h' && o.type === 'text') return; out.push(F.number(f[1], Math.round(o[f[0]]), { unit: 'px', min: -5000, max: 10000, step: 1, onChange: function (v) { var dx = f[0] === 'x' ? v - o.x : 0, dy = f[0] === 'y' ? v - o.y : 0; o[f[0]] = v; if (o.tail && (dx || dy)) o.tail = [o.tail[0] + dx, o.tail[1] + dy]; commit(t('changed')); } })); });
          if (o.type !== 'line') out.push(F.number(t('rotation'), o.rot || 0, { unit: '°', min: -360, max: 360, step: 5, onChange: function (v) { o.rot = v; commit(t('rotated')); } }));
          out.push(F.range(t('opacity'), Math.round((o.opacity == null ? 1 : o.opacity) * 100), { min: 10, max: 100, step: 5, unit: '%', onChange: function (v) { o.opacity = v / 100; commit(t('changed')); } }));
          out.push(h('div', { class: 'igs-actions' },
            ctx.button(t('centerH'), { icon: 'fit', onClick: function () { var dx = (S.w - o.w) / 2 - o.x; o.x = r1(o.x + dx); if (o.tail) o.tail[0] += dx; commit(t('moved')); } }),
            ctx.button(t('toFront'), { icon: 'layers', onClick: function () { reorder('top'); } }), ctx.button(t('toBack'), { icon: 'layers', onClick: function () { reorder('bottom'); } }),
            ctx.button(t('duplicate'), { icon: 'copy', onClick: duplicate }), ctx.button(t('deleteBtn'), { icon: 'trash', class: 'igs-danger', onClick: removeSel })));
        } else {
          out.push(h('h4', { text: t('pageSettings') }));
          if (spec.sizes) out.push(F.select(t('format'), S.w + 'x' + S.h, spec.sizes.map(function (s) { return [s.w + 'x' + s.h, t(s.label) + ' · ' + s.w + ' × ' + s.h]; }).concat(spec.sizes.some(function (s) { return s.w === S.w && s.h === S.h; }) ? [] : [[S.w + 'x' + S.h, S.w + ' × ' + S.h]]), { onChange: function (v) { var p = v.split('x'); S.w = +p[0]; S.h = +p[1]; commit(t('formatChanged')); fit(); } }));
          out.push(colourField(t('pageColour'), S.bg, function (v) { S.bg = v; commit(t('colourChanged')); }));
          if (spec.pageExtras) spec.pageExtras(out, api);
          out.push(h('p', { class: 'igs-field-group', text: t('penSettings') }));
          out.push(colourField(t('penColour'), penColour, function (v) { penColour = v; renderSide(); }));
          out.push(F.number(t('penWidth'), penWidth, { unit: 'px', min: 1, max: 40, step: 1, onChange: function (v) { penWidth = v; } }));
        }
        out.push(h('h4', { text: t('reviewTitle') }));
        var rv = review();
        if (!rv.length) out.push(h('p', { class: 'igs-muted', text: t('reviewEmpty') }));
        else {
          var bad = rv.filter(function (x) { return x.ok === false; }).length;
          out.push(h('p', { class: 'igs-result', 'data-kind': bad ? 'bad' : 'ok' }, h('strong', { text: bad ? t('reviewBad', { n: bad }) : t('reviewOk') })));
          var ul2 = h('ul', { class: 'iga-review' });
          rv.forEach(function (x) { ul2.appendChild(h('li', { 'data-ok': String(x.ok !== false) }, h('span', { class: 'iga-mark', 'aria-hidden': 'true', text: x.ok === false ? '!' : x.ok ? '✓' : '?' }), h('span', { class: 'igs-sr', text: (x.ok === false ? t('checkWord') : t('okWord')) + ': ' }), x.text)); });
          out.push(ul2);
        }
        out.push(h('p', { class: 'igs-muted', text: t('reviewNote') }));
        ctx.setInspector(out);
        ctx.setSummary(summary());
      }
      function summary() {
        var p = page();
        var parts = p.objs.map(function (o) { return t('type_' + o.type) + ((o.type === 'text' || o.type === 'balloon') ? ' «' + String(o.text).slice(0, 80) + '»' : '') + (o.type === 'image' && o.alt ? ' (' + o.alt + ')' : ''); });
        return t('summary', { w: S.w, h: S.h, page: pageIx + 1, pages: S.pages.length, n: p.objs.length }) + (parts.length ? ' ' + parts.join('; ') + '.' : '');
      }

      /* ---------- Páginas ---------- */
      function goPage(i) { pageIx = Math.max(0, Math.min(S.pages.length - 1, i)); selId = null; refresh(); ctx.announce(t('pageN', { n: pageIx + 1 })); }
      function addPage(copy) { var p = copy ? JSON.parse(JSON.stringify(page())) : { objs: [] }; if (copy) p.objs.forEach(function (o) { o.id = nid(); }); else if (spec.newPage) p.objs = spec.newPage(api); S.pages.splice(pageIx + 1, 0, p); pageIx += 1; selId = null; commit(t('pageAdded')); }
      function delPage() { if (S.pages.length < 2) { ctx.announce(t('lastPage')); return; } S.pages.splice(pageIx, 1); pageIx = Math.min(pageIx, S.pages.length - 1); selId = null; gcMedia(); commit(t('pageDeleted')); }

      /* ---------- Exportaciones ---------- */
      function exportCanvas(pi, scale) {
        var c = new PIXI.Container(), keep = pageIx; drawPage(c, S.pages[pi], { noMask: true });
        var cv = app.renderer.extract.canvas({ target: c, resolution: scale, frame: new PIXI.Rectangle(0, 0, S.w, S.h), clearColor: S.bg });
        c.destroy({ children: true }); pageIx = keep; return cv;
      }
      function pngBlob(pi, scale, credit) { var cv = exportCanvas(pi, scale); var out = credit ? ctx.canvasWithCredit(cv, S.bg) : cv; return ctx.canvasBlob(out); }
      function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
      var fontData = {};
      function fontCss(used) {
        var faces = [];
        Object.keys(used).forEach(function (k) { Object.keys(used[k]).forEach(function (w) { var f = FONTS[k]; faces.push({ k: k, w: w, file: f.files[w] || f.files[Object.keys(f.files)[0]] }); }); });
        return Promise.all(faces.map(function (fc) {
          if (fontData[fc.file]) return Promise.resolve();
          return root.fetch('/assets/fonts/' + fc.file).then(function (r) { return r.arrayBuffer(); }).then(function (buf) { var s = '', a = new Uint8Array(buf); for (var i = 0; i < a.length; i += 0x8000) s += String.fromCharCode.apply(null, a.subarray(i, i + 0x8000)); fontData[fc.file] = root.btoa(s); }).catch(function () {});
        })).then(function () {
          return faces.map(function (fc) { return fontData[fc.file] ? '@font-face{font-family:"' + FONTS[fc.k].family + '";font-weight:' + (fc.k === 'newsreader' ? '200 800' : fc.w) + ';src:url(data:font/woff2;base64,' + fontData[fc.file] + ') format("woff2")}' : ''; }).join('');
        });
      }
      function svgFor(pi) {
        var p = S.pages[pi], used = {}, body = '';
        function tf(o) { return o.rot ? ' transform="rotate(' + o.rot + ' ' + (o.x + o.w / 2) + ' ' + (o.y + o.h / 2) + ')"' : ''; }
        function op(o) { return o.opacity != null && o.opacity < 1 ? ' opacity="' + o.opacity + '"' : ''; }
        function textSvg(o, lines, boxX, boxW, y0, align) {
          var fk = o.font in FONTS ? o.font : 'atkinson', f = FONTS[fk], wgt = fontWeightFor(fk, o.bold), lh = o.size * (o.lineH || 1.25), s = '';
          used[fk] = used[fk] || {}; used[fk][wgt] = true;
          lines.forEach(function (ln, i) { var x = align === 'center' ? boxX + boxW / 2 : align === 'right' ? boxX + boxW : boxX; s += '<text x="' + x + '" y="' + (y0 + i * lh + lh / 2) + '" dominant-baseline="central" text-anchor="' + (align === 'center' ? 'middle' : align === 'right' ? 'end' : 'start') + '" font-family="\'' + f.family + '\', ' + f.fallback + '" font-size="' + o.size + '" font-weight="' + wgt + '" fill="' + (o.color || '#101820') + '">' + esc(ln) + '</text>'; });
          return s;
        }
        p.objs.forEach(function (o) {
          var g = '<g' + tf(o) + op(o) + '>', sw = o.sw || 0, fill = o.fill && o.fill !== 'none' ? o.fill : 'none';
          if (o.type === 'rect' || o.type === 'panel') g += '<rect x="' + o.x + '" y="' + o.y + '" width="' + o.w + '" height="' + o.h + '" rx="' + (o.radius || 0) + '" fill="' + fill + '"' + (sw ? ' stroke="' + o.stroke + '" stroke-width="' + sw + '"' : '') + '/>';
          else if (o.type === 'ellipse') g += '<ellipse cx="' + (o.x + o.w / 2) + '" cy="' + (o.y + o.h / 2) + '" rx="' + Math.abs(o.w / 2) + '" ry="' + Math.abs(o.h / 2) + '" fill="' + fill + '"' + (sw ? ' stroke="' + o.stroke + '" stroke-width="' + sw + '"' : '') + '/>';
          else if (o.type === 'line') { g += '<line x1="' + o.x + '" y1="' + o.y + '" x2="' + (o.x + o.w) + '" y2="' + (o.y + o.h) + '" stroke="' + o.stroke + '" stroke-width="' + Math.max(1, sw) + '" stroke-linecap="round"/>'; if (o.arrow) { var a = Math.atan2(o.h, o.w), L = Math.max(10, sw * 4), ex = o.x + o.w, ey = o.y + o.h; g += '<polygon points="' + [ex, ey, ex - Math.cos(a - 0.45) * L, ey - Math.sin(a - 0.45) * L, ex - Math.cos(a + 0.45) * L, ey - Math.sin(a + 0.45) * L].join(' ') + '" fill="' + o.stroke + '"/>'; } }
          else if (o.type === 'pen') g += '<polyline points="' + o.pts.map(function (q) { return (o.x + q[0] * o.w) + ',' + (o.y + q[1] * o.h); }).join(' ') + '" fill="none" stroke="' + o.stroke + '" stroke-width="' + Math.max(1, sw) + '" stroke-linecap="round" stroke-linejoin="round"/>';
          else if (o.type === 'text') { if (fill !== 'none') g += '<rect x="' + (o.x - 8) + '" y="' + (o.y - 6) + '" width="' + (o.w + 16) + '" height="' + (o.h + 12) + '" rx="8" fill="' + fill + '"/>'; g += textSvg(o, wrap(o.text, o, o.w), o.x, o.w, o.y, o.align || 'left'); }
          else if (o.type === 'image') { var ar = o.fit === 'contain' ? 'xMidYMid meet' : 'xMidYMid slice'; g += '<image href="' + (S.media[o.ref] || '') + '" x="' + o.x + '" y="' + o.y + '" width="' + o.w + '" height="' + o.h + '" preserveAspectRatio="' + ar + '"' + (o.alt ? ' aria-label="' + esc(o.alt) + '"' : ' aria-hidden="true"') + '/>'; }
          else if (o.type === 'balloon') {
            var sh = balloonShape(o), bf = o.fill || '#ffffff', bw = Math.max(1, sw || 3), pts = sh.pts.map(function (q) { return q.join(','); }).join(' '), tl = sh.tail ? sh.tail.map(function (q) { return q.join(','); }).join(' ') : '';
            g += '<polygon points="' + pts + '" fill="none" stroke="' + o.stroke + '" stroke-width="' + bw * 2 + '" stroke-linejoin="round"/>' + (tl ? '<polygon points="' + tl + '" fill="none" stroke="' + o.stroke + '" stroke-width="' + bw * 2 + '" stroke-linejoin="round"/>' : '');
            g += '<polygon points="' + pts + '" fill="' + bf + '"/>' + (tl ? '<polygon points="' + tl + '" fill="' + bf + '"/>' : '');
            sh.bubbles.forEach(function (b) { g += '<circle cx="' + b[0] + '" cy="' + b[1] + '" r="' + b[2] + '" fill="' + bf + '" stroke="' + o.stroke + '" stroke-width="' + bw + '"/>'; });
            var inner = o.kind === 'caption' ? o.w - 20 : o.w * 0.72, lines = wrap(o.text, o, inner), th = lines.length * o.size * (o.lineH || 1.2);
            g += textSvg(Object.assign({}, o, { lineH: o.lineH || 1.2 }), lines, o.x + (o.w - inner) / 2, inner, o.y + (o.h - th) / 2, o.kind === 'caption' ? (o.align || 'left') : 'center');
          }
          body += g + '</g>';
        });
        return fontCss(used).then(function (css) {
          var title = spec.svgTitle ? spec.svgTitle(api, pi) : 'Iris Green';
          return '<svg xmlns="http://www.w3.org/2000/svg" width="' + S.w + '" height="' + S.h + '" viewBox="0 0 ' + S.w + ' ' + S.h + '" role="img" aria-label="' + esc(title) + '"><title>' + esc(title) + '</title><desc>' + esc(summaryFor(pi)) + '</desc><style>' + css + '</style>' +
            '<rect width="' + S.w + '" height="' + S.h + '" fill="' + S.bg + '"/>' + body + '<!-- IRIS GREEN · irisgreen.eu --></svg>';
        });
      }
      function summaryFor(pi) { var keep = pageIx; pageIx = pi; var s = summary(); pageIx = keep; return s; }
      var fname = function (suffix) { return spec.fileBase() + '-' + ctx.stamp() + suffix; };
      ctx.addExport(t('exportPng'), function () { pngBlob(pageIx, 2, true).then(function (b) { ctx.download(b, fname((S.pages.length > 1 ? '-p' + (pageIx + 1) : '') + '.png')); }); });
      if (spec.printExport) ctx.addExport(t('exportPngPrint'), function () { pngBlob(pageIx, 3, false).then(function (b) { ctx.download(b, fname('-print.png')); }); });
      ctx.addExport(t('exportSvg'), function () { svgFor(pageIx).then(function (s) { ctx.download(new Blob([s], { type: 'image/svg+xml' }), fname((S.pages.length > 1 ? '-p' + (pageIx + 1) : '') + '.svg')); }); });
      if (spec.pages) ctx.addExport(t('exportZip'), function () {
        var files = [];
        S.pages.reduce(function (pr, p, i) { return pr.then(function () { return pngBlob(i, 2, true).then(function (b) { return b.arrayBuffer(); }).then(function (buf) { files.push({ name: t('pageFile', { n: String(i + 1).padStart(2, '0') }) + '.png', data: new Uint8Array(buf) }); }); }); }, Promise.resolve())
          .then(function () { ctx.download(new Blob([zipStore(files)], { type: 'application/zip' }), fname('.zip')); ctx.announce(t('zipDone', { n: files.length })); });
      });

      /* ---------- Herramientas ---------- */
      var toolList = [{ id: 'select', label: t('toolSelect'), icon: 'select' }];
      (spec.tools || ['text', 'rect', 'ellipse', 'line', 'pen']).forEach(function (id) {
        var icons = { text: 'text', rect: 'square', ellipse: 'circle', line: 'line', pen: 'pen', panel: 'frame', balloon: 'note' };
        toolList.push({ id: id, label: t('tool_' + id), icon: icons[id] || 'sparkle', level: (spec.moreTools || []).indexOf(id) >= 0 ? 'more' : null });
      });
      toolList.push({ id: 'image', label: t('tool_image'), icon: 'folder', action: chooseImage });
      toolList.push({ id: 'pan', label: t('toolPan'), icon: 'pan', level: 'more' });
      toolList.push({ id: 'fitv', label: t('fitView'), icon: 'fit', level: 'more', action: fit });
      ctx.setTools(toolList, { initial: 'select' });

      var api = {
        get S() { return S; }, set S(v) { S = v; }, t: t, h: h, F: F, ctx: ctx, nid: nid, defaults: defaults, commit: commit, refresh: refresh, fit: fit,
        page: page, goPage: goPage, wrap: wrap, contrast: contrast, setSeq: function (v) { seq = Math.max(seq, v); }, loadTex: loadTex
      };

      function load(doc) {
        S = doc; pageIx = 0; selId = null; kc = { x: 40, y: 40 };
        Object.keys(assets).forEach(function (k) { assets[k].destroy(true); delete assets[k]; });
        return Promise.all(Object.keys(S.media || {}).map(function (k) { return loadTex(k, S.media[k]); })).then(function () { refresh(); fit(); });
      }
      S = spec.empty(api);
      refresh(); resize();
      return {
        serialize: function () { var c = JSON.parse(JSON.stringify(S)); c.seq = seq; return c; },
        restore: function (st) {
          var keepMedia = S.media; S = JSON.parse(JSON.stringify(st)); seq = Math.max(seq, st.seq || 0); delete S.seq; S.media = S.media || {};
          pageIx = Math.min(pageIx, S.pages.length - 1); if (!byId(selId)) selId = null;
          var missing = Object.keys(S.media).filter(function (k) { return !assets[k]; });
          if (missing.length) Promise.all(missing.map(function (k) { return loadTex(k, S.media[k]); })).then(refresh);
          void keepMedia; refresh();
        },
        validate: function (d) {
          function n(v) { return typeof v === 'number' && isFinite(v) && Math.abs(v) < 1e5; }
          function col(v) { return v == null || v === 'none' || /^#[0-9a-fA-F]{6}$/.test(v); }
          var TYPES = ['rect', 'ellipse', 'line', 'pen', 'text', 'image', 'panel', 'balloon'];
          if (!d || !n(d.w) || !n(d.h) || d.w < 50 || d.h < 50 || d.w > 6000 || d.h > 6000 || !col(d.bg) || !Array.isArray(d.pages) || !d.pages.length || d.pages.length > 60) return false;
          if (d.media && Object.keys(d.media).some(function (k) { return typeof d.media[k] !== 'string' || d.media[k].indexOf('data:image/') !== 0; })) return false;
          return d.pages.every(function (p) { return p && Array.isArray(p.objs) && p.objs.length <= 400 && p.objs.every(function (o) { return o && typeof o.id === 'string' && TYPES.indexOf(o.type) >= 0 && n(o.x) && n(o.y) && n(o.w) && n(o.h) && col(o.fill) && col(o.stroke) && col(o.color) && (o.text == null || typeof o.text === 'string') && (o.type !== 'pen' || (Array.isArray(o.pts) && o.pts.length <= 5000)); }); });
        },
        start: function (id) { seq = 0; var doc = id === 'empty' ? spec.empty(api) : spec.example(id, api); load(doc); },
        onTool: function (id) { tool = id; vp.dataset.tool = id; },
        onKey: onKey
      };
    }
  }

  /* ZIP sin compresión (método «stored») para descargar todas las páginas de una vez. */
  var CRC = (function () { var c, tb = []; for (var n = 0; n < 256; n++) { c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; tb[n] = c >>> 0; } return tb; })();
  function crc32(a) { var c = 0xffffffff; for (var i = 0; i < a.length; i++) c = CRC[(c ^ a[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
  function zipStore(files) {
    var parts = [], central = [], offset = 0, enc = new TextEncoder();
    function u16(v) { return [v & 255, (v >>> 8) & 255]; } function u32(v) { return [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255]; }
    files.forEach(function (f) {
      var name = enc.encode(f.name), crc = crc32(f.data), size = f.data.length;
      var local = [].concat(u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(0), u16(0x21), u32(crc), u32(size), u32(size), u16(name.length), u16(0));
      parts.push(new Uint8Array(local), name, f.data);
      central.push(new Uint8Array([].concat(u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(0x21), u32(crc), u32(size), u32(size), u16(name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset))), name);
      offset += local.length + name.length + size;
    });
    var cdSize = central.reduce(function (a, p) { return a + p.length; }, 0);
    var end = new Uint8Array([].concat(u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length), u32(cdSize), u32(offset), u16(0)));
    return new Blob(parts.concat(central, [end]));
  }

  IG.Lienzo = { create: create, contrast: contrast, FONTS: FONTS };
})(window);
