/* Iris Green · El taller · Motor de videomapping (R43).
   Cada superficie es un lienzo deformado con una homografía (CSS matrix3d) para que encaje
   en cuatro esquinas: la técnica de «corner pinning» de los programas de proyección.
   Este archivo también se copia dentro del HTML que se exporta, así que no depende de nada más.
   Seguridad visual: ninguna animación cambia el brillo más de 0,5 veces por segundo
   (muy por debajo del límite de 3 destellos por segundo de WCAG 2.3.1). */
(function (root) {
  'use strict';
  var D = root.document;

  /* Homografía del rectángulo (0,0)-(w,h) al cuadrilátero q = [[x,y] ×4] (arriba-izq, arriba-der, abajo-der, abajo-izq). */
  function homography(w, h, q) {
    var x0 = q[0][0], y0 = q[0][1], x1 = q[1][0], y1 = q[1][1], x2 = q[2][0], y2 = q[2][1], x3 = q[3][0], y3 = q[3][1];
    var dx1 = x1 - x2, dy1 = y1 - y2, dx2 = x3 - x2, dy2 = y3 - y2, sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
    var g = 0, hh = 0, det = dx1 * dy2 - dx2 * dy1;
    if (Math.abs(det) > 1e-9) { g = (sx * dy2 - dx2 * sy) / det; hh = (dx1 * sy - sx * dy1) / det; }
    var a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, c = x0, d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3, f = y0;
    return [a / w, d / w, 0, g / w, b / h, e / h, 0, hh / h, 0, 0, 1, 0, c, f, 0, 1];
  }
  function mapPoint(m, x, y) { var w = m[3] * x + m[7] * y + m[15]; return [(m[0] * x + m[4] * y + m[12]) / w, (m[1] * x + m[5] * y + m[13]) / w]; }
  function convex(q) {
    var sign = 0;
    for (var i = 0; i < 4; i++) {
      var a = q[i], b = q[(i + 1) % 4], c = q[(i + 2) % 4];
      var z = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
      if (Math.abs(z) < 1e-9) return false;
      var s = z > 0 ? 1 : -1; if (!sign) sign = s; else if (s !== sign) return false;
    }
    return true;
  }
  function edgeLen(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }

  /* ---------- Contenidos generados ---------- */
  var SPEED = { slow: 0.25, medium: 0.5 }; /* ciclos por segundo como máximo */
  function draw(g, W, H, ct, time, assets) {
    var c1 = ct.c1 || '#1f5f8b', c2 = ct.c2 || '#f4f4f4', n = Math.max(1, Math.min(24, ct.n || 6));
    var f = ct.anim ? (SPEED[ct.speed] || SPEED.slow) : 0, ph = f * time; /* fase en ciclos */
    g.save(); g.clearRect(0, 0, W, H); g.globalAlpha = 1;
    switch (ct.type) {
      case 'color': {
        g.fillStyle = c1; g.fillRect(0, 0, W, H);
        if (ct.anim) { var k = 0.15 * (1 - Math.cos(ph * Math.PI * 2 * 0.25)) / 2; g.fillStyle = 'rgba(0,0,0,' + k.toFixed(3) + ')'; g.fillRect(0, 0, W, H); }
        break;
      }
      case 'gradient': {
        var ang = (ct.angle || 0) * Math.PI / 180 + ph * Math.PI * 2 * 0.25, cx = W / 2, cy = H / 2, r = Math.hypot(W, H) / 2;
        var gr = g.createLinearGradient(cx - Math.cos(ang) * r, cy - Math.sin(ang) * r, cx + Math.cos(ang) * r, cy + Math.sin(ang) * r);
        gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.fillRect(0, 0, W, H); break;
      }
      case 'stripes': {
        g.fillStyle = c1; g.fillRect(0, 0, W, H); g.fillStyle = c2;
        var vertical = (ct.dir || 'v') === 'v', span = vertical ? W : H, p = span / n, off = (ph % 1) * p;
        for (var i = -1; i <= n; i++) { var s0 = i * p + off; if (vertical) g.fillRect(s0, 0, p / 2, H); else g.fillRect(0, s0, W, p / 2); }
        break;
      }
      case 'checker': {
        var cw = W / n, rows = Math.max(1, Math.round(H / cw)), chh = H / rows;
        for (var y = 0; y < rows; y++) for (var x = 0; x < n; x++) { g.fillStyle = (x + y) % 2 ? c2 : c1; g.fillRect(x * cw, y * chh, cw + 0.5, chh + 0.5); }
        break;
      }
      case 'circles': {
        g.fillStyle = c1; g.fillRect(0, 0, W, H);
        var R = Math.hypot(W, H) / 2, step = R / n, o = (ph % 1) * step;
        g.strokeStyle = c2; g.lineWidth = step / 2;
        for (var j = 0; j <= n + 1; j++) { var rr = j * step + o - step / 4; if (rr > 0) { g.beginPath(); g.arc(W / 2, H / 2, rr, 0, Math.PI * 2); g.stroke(); } }
        break;
      }
      case 'waves': {
        g.fillStyle = c1; g.fillRect(0, 0, W, H); g.fillStyle = c2;
        var bands = n, bh = H / bands;
        for (var b = 0; b < bands; b += 2) {
          g.beginPath(); g.moveTo(0, b * bh);
          for (var xx = 0; xx <= W; xx += W / 60) g.lineTo(xx, b * bh + Math.sin(xx / W * Math.PI * 4 + ph * Math.PI * 2) * bh * 0.45);
          for (var x2 = W; x2 >= 0; x2 -= W / 60) g.lineTo(x2, (b + 1) * bh + Math.sin(x2 / W * Math.PI * 4 + ph * Math.PI * 2) * bh * 0.45);
          g.closePath(); g.fill();
        }
        break;
      }
      case 'text': {
        g.fillStyle = c1; g.fillRect(0, 0, W, H);
        var txt = String(ct.text || '').slice(0, 80) || ' ';
        var size = Math.min(H * 0.55, W * 1.6 / Math.max(3, txt.length));
        g.font = '700 ' + Math.round(size) + 'px "Atkinson Hyperlegible", system-ui, sans-serif'; g.textBaseline = 'middle'; g.fillStyle = c2;
        if (ct.anim) { var tw = g.measureText(txt).width, total = W + tw, x0 = W - ((time * W * (SPEED[ct.speed] || SPEED.slow) * 0.4) % total); g.textAlign = 'left'; g.fillText(txt, x0, H / 2); }
        else { g.textAlign = 'center'; g.fillText(txt, W / 2, H / 2); }
        break;
      }
      case 'image': case 'video': {
        g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
        var src = assets && (ct.type === 'image' ? assets.images[ct.ref] : assets.videos[ct.ref]);
        var sw = src && (src.videoWidth || src.naturalWidth), sh = src && (src.videoHeight || src.naturalHeight);
        if (src && sw && sh) {
          var sc = (ct.fit === 'contain' ? Math.min : Math.max)(W / sw, H / sh), dw = sw * sc, dh = sh * sc;
          g.drawImage(src, (W - dw) / 2, (H - dh) / 2, dw, dh);
        } else placeholder(g, W, H, ct.missing || '');
        break;
      }
      default: placeholder(g, W, H, '');
    }
    g.restore();
  }
  function placeholder(g, W, H, label) {
    g.fillStyle = '#26394d'; g.fillRect(0, 0, W, H); g.strokeStyle = '#5b7590'; g.lineWidth = 4;
    g.beginPath(); g.moveTo(0, 0); g.lineTo(W, H); g.moveTo(W, 0); g.lineTo(0, H); g.stroke();
    if (label) { g.fillStyle = '#fff'; g.font = '700 ' + Math.round(Math.min(W, H) / 10) + 'px system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(label, W / 2, H / 2); }
  }
  /* Patrón de ajuste: rejilla, diagonales y números de esquina para alinear con el objeto real. */
  function drawTest(g, W, H, name, index) {
    g.save(); g.fillStyle = '#101820'; g.fillRect(0, 0, W, H);
    g.strokeStyle = '#ffffff'; g.lineWidth = Math.max(2, W / 200);
    for (var i = 1; i < 8; i++) { g.globalAlpha = i === 4 ? 0.9 : 0.35; g.beginPath(); g.moveTo(W * i / 8, 0); g.lineTo(W * i / 8, H); g.moveTo(0, H * i / 8); g.lineTo(W, H * i / 8); g.stroke(); }
    g.globalAlpha = 1; g.lineWidth = Math.max(4, W / 90); g.strokeStyle = '#ffd400'; g.strokeRect(g.lineWidth / 2, g.lineWidth / 2, W - g.lineWidth, H - g.lineWidth);
    g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 0); g.lineTo(W, H); g.moveTo(W, 0); g.lineTo(0, H); g.stroke();
    var fs = Math.round(Math.min(W, H) / 7), pad = fs * 0.35;
    g.font = '800 ' + fs + 'px system-ui, sans-serif'; g.fillStyle = '#ffd400'; g.textBaseline = 'top';
    g.textAlign = 'left'; g.fillText('1', pad, pad); g.textAlign = 'right'; g.fillText('2', W - pad, pad);
    g.textBaseline = 'bottom'; g.fillText('3', W - pad, H - pad); g.textAlign = 'left'; g.fillText('4', pad, H - pad);
    g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '700 ' + Math.round(fs * 0.6) + 'px system-ui, sans-serif';
    g.fillText((index + 1) + ' · ' + String(name || '').slice(0, 24), W / 2, H / 2);
    g.restore();
  }
  function animated(ct) { return (ct.anim && ct.type !== 'checker' && ct.type !== 'image') || ct.type === 'video'; }

  /* ---------- Reproductor: coloca y dibuja las superficies dentro de un escenario ---------- */
  function Player(stage, show, opts) {
    opts = opts || {};
    var self = this, els = {}, frame = 0, t0 = performance.now(), playing = opts.playing !== false, test = false, pausedAt = 0;
    this.assets = opts.assets || { images: {}, videos: {} };
    this.show = show;
    stage.classList.add('igm-stage');
    function size() { return [Math.max(1, stage.clientWidth), Math.max(1, stage.clientHeight)]; }
    function quadPx(s, sz) { return s.corners.map(function (c) { return [c[0] * sz[0], c[1] * sz[1]]; }); }
    function sync() {
      var sz = size(), seen = {};
      stage.style.background = self.show.bg || '#000';
      self.show.surfaces.forEach(function (s, i) {
        seen[s.id] = true;
        var el = els[s.id];
        if (!el) { el = { box: D.createElement('div'), cv: D.createElement('canvas') }; el.box.className = 'igm-surface'; el.box.appendChild(el.cv); els[s.id] = el; }
        stage.appendChild(el.box);
        var q = quadPx(s, sz);
        var w = Math.max(8, (edgeLen(q[0], q[1]) + edgeLen(q[3], q[2])) / 2), hgt = Math.max(8, (edgeLen(q[0], q[3]) + edgeLen(q[1], q[2])) / 2);
        var scale = Math.min(1, 1024 / Math.max(w, hgt)), cw = Math.round(w * scale * Math.min(2, root.devicePixelRatio || 1)), ch = Math.round(hgt * scale * Math.min(2, root.devicePixelRatio || 1));
        cw = Math.min(cw, 1400); ch = Math.min(ch, 1400);
        if (el.cv.width !== cw || el.cv.height !== ch) { el.cv.width = cw; el.cv.height = ch; }
        el.box.style.width = w + 'px'; el.box.style.height = hgt + 'px';
        el.box.style.opacity = s.opacity == null ? 1 : s.opacity;
        el.box.style.zIndex = String(i + 1);
        el.ok = convex(q);
        el.box.style.transform = el.ok ? 'matrix3d(' + homography(w, hgt, q).map(function (v) { return +v.toFixed(8); }).join(',') + ')' : 'none';
        el.box.hidden = !el.ok; el.w = w; el.h = hgt; el.s = s; el.i = i;
      });
      Object.keys(els).forEach(function (id) { if (!seen[id]) { els[id].box.remove(); delete els[id]; } });
      paint(); schedule();
    }
    function now() { return playing ? (performance.now() - t0) / 1000 : pausedAt; }
    function paint() {
      var tm = now();
      Object.keys(els).forEach(function (id) {
        var el = els[id], g = el.cv.getContext('2d');
        if (test) drawTest(g, el.cv.width, el.cv.height, el.s.name, el.i); else draw(g, el.cv.width, el.cv.height, el.s.content, tm, self.assets);
      });
    }
    function anyAnimated() { return !test && playing && self.show.surfaces.some(function (s) { return animated(s.content); }); }
    function schedule() {
      if (frame || !anyAnimated()) return;
      frame = root.requestAnimationFrame(function () { frame = 0; paint(); schedule(); });
    }
    this.update = function (sh) { if (sh) self.show = sh; sync(); };
    this.setTest = function (v) { test = !!v; paint(); schedule(); };
    this.isTest = function () { return test; };
    this.setPlaying = function (v) {
      v = !!v; if (v === playing) return;
      if (v) { t0 = performance.now() - pausedAt * 1000; Object.keys(self.assets.videos).forEach(function (k) { var vv = self.assets.videos[k]; if (vv && vv.play) { var pr = vv.play(); if (pr && pr.catch) pr.catch(function () {}); } }); }
      else { pausedAt = now(); Object.keys(self.assets.videos).forEach(function (k) { var vv = self.assets.videos[k]; if (vv && vv.pause) vv.pause(); }); }
      playing = v; paint(); schedule();
    };
    this.isPlaying = function () { return playing; };
    this.surfaceEl = function (id) { return els[id] && els[id].box; };
    this.isConvex = function (id) { return !els[id] || els[id].ok; };
    this.stop = function () { if (frame) root.cancelAnimationFrame(frame); frame = 0; if (ro) ro.disconnect(); };
    /* Imagen fija del conjunto: cada superficie se dibuja en una malla de triángulos afines. */
    this.composite = function (W, H) {
      var out = D.createElement('canvas'); out.width = W; out.height = H;
      var g = out.getContext('2d'); g.fillStyle = self.show.bg || '#000'; g.fillRect(0, 0, W, H);
      self.show.surfaces.forEach(function (s) {
        var el = els[s.id]; if (!el || !el.ok) return;
        var q = s.corners.map(function (c) { return [c[0] * W, c[1] * H]; }), cw = el.cv.width, ch = el.cv.height, m = homography(cw, ch, q), N = 16;
        g.save(); g.globalAlpha = s.opacity == null ? 1 : s.opacity;
        for (var yi = 0; yi < N; yi++) for (var xi = 0; xi < N; xi++) {
          var u0 = xi / N * cw, u1 = (xi + 1) / N * cw, v0 = yi / N * ch, v1 = (yi + 1) / N * ch;
          tri(g, el.cv, [u0, v0], [u1, v0], [u1, v1], m); tri(g, el.cv, [u0, v0], [u1, v1], [u0, v1], m);
        }
        g.restore();
      });
      return out;
    };
    function tri(g, img, s0, s1, s2, m) {
      var d0 = mapPoint(m, s0[0], s0[1]), d1 = mapPoint(m, s1[0], s1[1]), d2 = mapPoint(m, s2[0], s2[1]);
      /* un poco más grande para tapar las juntas */
      var cx = (d0[0] + d1[0] + d2[0]) / 3, cy = (d0[1] + d1[1] + d2[1]) / 3;
      function grow(p) { var dx = p[0] - cx, dy = p[1] - cy, l = Math.hypot(dx, dy) || 1; return [p[0] + dx / l * 1.2, p[1] + dy / l * 1.2]; }
      var e0 = grow(d0), e1 = grow(d1), e2 = grow(d2);
      g.save(); g.beginPath(); g.moveTo(e0[0], e0[1]); g.lineTo(e1[0], e1[1]); g.lineTo(e2[0], e2[1]); g.closePath(); g.clip();
      /* afín que lleva s0,s1,s2 a d0,d1,d2 */
      var x0 = s0[0], y0 = s0[1], x1 = s1[0], y1 = s1[1], x2 = s2[0], y2 = s2[1];
      var det = x0 * (y1 - y2) - x1 * (y0 - y2) + x2 * (y0 - y1);
      if (Math.abs(det) < 1e-9) { g.restore(); return; }
      function solve(v0, v1, v2) {
        return [(v0 * (y1 - y2) + v1 * (y2 - y0) + v2 * (y0 - y1)) / det,
                (v0 * (x2 - x1) + v1 * (x0 - x2) + v2 * (x1 - x0)) / det,
                (v0 * (x1 * y2 - x2 * y1) + v1 * (x2 * y0 - x0 * y2) + v2 * (x0 * y1 - x1 * y0)) / det];
      }
      var X = solve(d0[0], d1[0], d2[0]), Y = solve(d0[1], d1[1], d2[1]);
      var a = X[0], c = X[1], e = X[2], b = Y[0], d = Y[1], f = Y[2];
      g.setTransform(a, b, c, d, e, f); g.drawImage(img, 0, 0); g.restore();
    }
    var ro = root.ResizeObserver ? new ResizeObserver(function () { sync(); }) : null; if (ro) ro.observe(stage);
    sync();
  }

  root.IGMap = { homography: homography, convex: convex, draw: draw, drawTest: drawTest, Player: Player, animated: animated };
})(typeof window !== 'undefined' ? window : this);