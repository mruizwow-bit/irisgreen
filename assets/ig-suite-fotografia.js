/* Iris Green · El taller · Estudio de fotografía y composición (R43).
   Series de fotos con versiones (encuadres), recorte con proporciones, enderezar y voltear,
   guías de composición (tercios, rejilla phi, espiral áurea, diagonales, centro), luz y color
   procesados en canvas, histograma con avisos y tabla, hoja de contactos.
   Privacidad: las fotos se abren con el selector de archivos y se quedan en memoria. Se leen los
   metadatos Exif (CIPA DC-008) solo para avisar de ubicación GPS, fecha y cámara; al exportar,
   el reencodado por canvas los elimina. No se pide la cámara. */
(function (root) {
  'use strict';
  var IG = root.IGSuite, D = root.document; if (!IG) return;
  var LANG = IG.lang;
  var MAX_PHOTOS = 12, MAX_VERSIONS = 24, SRC_MAX = 1920, SAVE_MAX = 1600, SAVE_LIMIT = 7.4e6;
  var RATIOS = ['free', '1:1', '3:2', '4:3', '4:5', '16:9', '9:16'];
  var GUIDES = ['thirds', 'phi', 'spiral', 'diagonals', 'centre', 'none'];
  var ADJ = ['exposure', 'contrast', 'highlights', 'shadows', 'saturation', 'temperature', 'tint', 'vignette'];
  var PRACTICE = ['landscape', 'stilllife', 'street', 'park', 'window'];
  var ACCENTS = { landscape: '#c8372d', stilllife: '#e9b500', street: '#b8322a', park: '#e0a800', window: '#2f73b5' };
  var PHI = (1 + Math.sqrt(5)) / 2;

  IG.defineEngine('fotografia', {
    version: 1, fileBase: LANG === 'en' ? 'photo-series' : 'serie-fotos', historyLimit: 80,
    extraKeys: ['kPhCrop', 'kPhKeys', 'kPhPhotos'],
    initialStart: function (para) { return { child: 'play', teen: 'portrait', adult: 'light' }[para] || 'colour'; },
    starts: function (ctx) {
      var t = ctx.t;
      return [
        { id: 'colour', title: t('stColour'), desc: t('stColourD'), para: 'any' },
        { id: 'ten', title: t('stTen'), desc: t('stTenD'), para: 'any' },
        { id: 'play', title: t('stPlay'), desc: t('stPlayD'), para: 'child' },
        { id: 'portrait', title: t('stPortrait'), desc: t('stPortraitD'), para: 'teen' },
        { id: 'light', title: t('stLight'), desc: t('stLightD'), para: 'adult' }
      ];
    },
    create: function (ctx) { return studio(ctx); }
  });

  /* ---------- Utilidades ---------- */
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function r4(v) { return Math.round(v * 10000) / 10000 || 0; }
  function hexRgb(hex) { var h = String(hex).replace('#', ''); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
  function rgbHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, hh = 0;
    if (d) { if (mx === r) hh = ((g - b) / d) % 6; else if (mx === g) hh = (b - r) / d + 2; else hh = (r - g) / d + 4; hh *= 60; if (hh < 0) hh += 360; }
    return [hh, mx ? d / mx : 0, mx];
  }
  function mix(a, b, k) { var x = hexRgb(a), y = hexRgb(b); return 'rgb(' + [0, 1, 2].map(function (i) { return Math.round(x[i] + (y[i] - x[i]) * k); }).join(',') + ')'; }
  function newCanvas(w, hh) { var c = D.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(hh)); return c; }
  function parseRatio(r) { if (!r || r === 'free') return 0; var p = String(r).split(':'); return (+p[0]) / (+p[1]) || 0; }

  /* ---------- Metadatos Exif: lector mínimo (JPEG APP1, PNG eXIf, WebP EXIF) ----------
     Solo se comprueba si existen: no se guardan ni se muestran los valores. */
  function readMeta(b) {
    var out = { gps: false, date: false, model: false };
    try {
      if (b[0] === 0xFF && b[1] === 0xD8) {
        var i = 2;
        while (i + 4 < b.length) {
          if (b[i] !== 0xFF) { i++; continue; }
          var m = b[i + 1];
          if (m === 0xD9 || m === 0xDA) break;
          if ((m >= 0xD0 && m <= 0xD7) || m === 0x01 || m === 0xFF) { i += (m === 0xFF ? 1 : 2); continue; }
          var len = (b[i + 2] << 8) | b[i + 3];
          if (m === 0xE1 && b[i + 4] === 0x45 && b[i + 5] === 0x78 && b[i + 6] === 0x69 && b[i + 7] === 0x66 && b[i + 8] === 0 && b[i + 9] === 0) tiff(b, i + 10, Math.min(b.length, i + 2 + len), out);
          i += 2 + len;
        }
      } else if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47) {
        var p = 8;
        while (p + 8 <= b.length) {
          var L = ((b[p] << 24) | (b[p + 1] << 16) | (b[p + 2] << 8) | b[p + 3]) >>> 0, ty = String.fromCharCode(b[p + 4], b[p + 5], b[p + 6], b[p + 7]);
          if (ty === 'eXIf') tiff(b, p + 8, Math.min(b.length, p + 8 + L), out);
          if (ty === 'IEND') break;
          p += 12 + L;
        }
      } else if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45) {
        var q = 12;
        while (q + 8 <= b.length) {
          var fc = String.fromCharCode(b[q], b[q + 1], b[q + 2], b[q + 3]), sz = (b[q + 4] | (b[q + 5] << 8) | (b[q + 6] << 16) | (b[q + 7] << 24)) >>> 0;
          if (fc === 'EXIF') { var st = q + 8; if (b[st] === 0x45 && b[st + 1] === 0x78) st += 6; tiff(b, st, Math.min(b.length, q + 8 + sz), out); }
          q += 8 + sz + (sz & 1);
        }
      }
    } catch (_) { /* archivo raro: sin avisos, pero la foto se abre igual */ }
    out.any = out.gps || out.date || out.model;
    return out;
  }
  function tiff(b, s, end, out) {
    var le = b[s] === 0x49 && b[s + 1] === 0x49;
    function u16(o) { if (o + 2 > end) throw new Error('eof'); return le ? b[o] | (b[o + 1] << 8) : (b[o] << 8) | b[o + 1]; }
    function u32(o) { if (o + 4 > end) throw new Error('eof'); return (le ? (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) : ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3])) >>> 0; }
    if (u16(s + 2) !== 42) return;
    function ifd(off, cb) { var n = u16(off); if (n > 500) return; for (var k = 0; k < n; k++) { var e = off + 2 + k * 12; cb(u16(e), u16(e + 2), u32(e + 4), u32(e + 8)); } }
    ifd(s + u32(s + 4), function (tag, type, count, val) {
      if (tag === 0x010F || tag === 0x0110) out.model = true;           /* Make, Model */
      else if (tag === 0x0132) out.date = true;                          /* DateTime */
      else if (tag === 0x8769) ifd(s + val, function (t2) { if (t2 === 0x9003 || t2 === 0x9004) out.date = true; }); /* Exif IFD: DateTimeOriginal, DateTimeDigitized */
      else if (tag === 0x8825) ifd(s + val, function (t3, ty3, c3) { if ((t3 === 0x0002 || t3 === 0x0004) && c3 === 3) out.gps = true; }); /* GPS IFD: latitud, longitud */
    });
  }

  /* ---------- Imágenes de práctica: originales, dibujadas por código ---------- */
  function practice(kind, accent, dark) {
    var W = 1500, H = 1000, c = newCanvas(W, H), g = c.getContext('2d'), rnd = IG.rng('iris-' + kind);
    accent = accent || ACCENTS[kind];
    function lin(y0, y1, stops) { var gr = g.createLinearGradient(0, y0, 0, y1); stops.forEach(function (s) { gr.addColorStop(s[0], s[1]); }); return gr; }
    function ell(x, y, rx, ry, fill) { g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); g.fillStyle = fill; g.fill(); }
    function poly(pts, fill) { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); g.fillStyle = fill; g.fill(); }
    function ball(x, y, r, col, rx, ry) {
      var gr = g.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r * 1.05);
      gr.addColorStop(0, mix(col, '#ffffff', 0.55)); gr.addColorStop(0.45, col); gr.addColorStop(1, mix(col, '#000000', 0.45));
      g.beginPath(); g.ellipse(x, y, rx || r, ry || r, 0, 0, Math.PI * 2); g.fillStyle = gr; g.fill();
    }
    function hills(y, amp, col, seed) {
      g.beginPath(); g.moveTo(0, H);
      for (var x = 0; x <= W; x += 20) g.lineTo(x, y - amp * (0.5 + 0.35 * Math.sin(x / 180 + seed) + 0.15 * Math.sin(x / 57 + seed * 3)));
      g.lineTo(W, H); g.closePath(); g.fillStyle = col; g.fill();
    }
    function cloud(x, y, s) { g.globalAlpha = 0.85; [[0, 0, 60], [55, 10, 48], [-55, 12, 44], [20, -30, 46]].forEach(function (p) { ell(x + p[0] * s, y + p[1] * s, p[2] * s * 1.3, p[2] * s, '#ffffff'); }); g.globalAlpha = 1; }
    if (kind === 'landscape') {
      g.fillStyle = lin(0, 620, [[0, '#6fa7d6'], [0.7, '#bcd9ea'], [1, '#f5e3c3']]); g.fillRect(0, 0, W, H);
      var sun = g.createRadialGradient(1080, 280, 10, 1080, 280, 180); sun.addColorStop(0, 'rgba(255,244,200,1)'); sun.addColorStop(0.35, 'rgba(255,226,140,.9)'); sun.addColorStop(1, 'rgba(255,226,140,0)');
      g.fillStyle = sun; g.fillRect(880, 80, 400, 400); ell(1080, 280, 52, 52, '#fff3c4');
      cloud(300, 170, 1.1); cloud(760, 110, 0.8);
      hills(610, 230, '#8ea3bd', 1); hills(630, 150, '#6f8f7a', 4);
      g.fillStyle = lin(600, H, [[0, '#86ad58'], [1, '#3f6b33']]); g.fillRect(0, 600, W, H - 600);
      for (var k = 0; k < 900; k++) { var fy = 640 + Math.pow(rnd(), 0.6) * 360, fx = rnd() * W, fs = 2 + (fy - 600) / 45; ell(fx, fy, fs, fs * 0.8, rnd() < 0.8 ? accent : '#f4f1e8'); }
      g.fillStyle = '#4b3526'; g.fillRect(488, 440, 24, 210);
      [[500, 420, 95], [450, 470, 70], [555, 465, 72], [500, 360, 70]].forEach(function (p) { ball(p[0], p[1], p[2], '#3f7a3a'); });
    } else if (kind === 'stilllife') {
      g.fillStyle = lin(0, 620, [[0, '#6d6259'], [1, '#b5a797']]); g.fillRect(0, 0, W, 640);
      g.globalAlpha = 0.28; poly([[860, 0], [1260, 0], [1080, 640], [620, 640]], '#fff4dc'); g.globalAlpha = 1;
      g.fillStyle = lin(620, H, [[0, '#7a4e2e'], [1, '#4a2d19']]); g.fillRect(0, 620, W, H - 620);
      for (var s2 = 0; s2 < 14; s2++) { g.strokeStyle = 'rgba(40,20,8,.25)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 640 + s2 * 26 + rnd() * 6); g.bezierCurveTo(500, 630 + s2 * 26, 900, 650 + s2 * 26, W, 636 + s2 * 27); g.stroke(); }
      poly([[260, 700], [1180, 680], [1320, 960], [140, 990]], '#ece6da');
      ell(700, 830, 330, 60, 'rgba(0,0,0,.28)');
      g.beginPath(); g.ellipse(700, 720, 300, 70, 0, 0, Math.PI); g.lineTo(560, 830); g.lineTo(840, 830); g.closePath(); g.fillStyle = '#d7d0c5'; g.fill();
      ell(700, 720, 300, 60, '#b9b1a4');
      [[590, 690, 70], [700, 670, 78], [805, 695, 70], [650, 720, 64], [760, 722, 66]].forEach(function (p) { ball(p[0], p[1], p[2], accent, p[2] * 1.15, p[2] * 0.9); });
      ell(1130, 820, 110, 26, 'rgba(0,0,0,.3)');
      g.fillStyle = '#f0ede6'; g.fillRect(1040, 620, 170, 200); ell(1125, 820, 85, 22, '#e3ddd2'); ell(1125, 620, 85, 22, '#3a261a');
      g.strokeStyle = '#f0ede6'; g.lineWidth = 22; g.beginPath(); g.arc(1220, 710, 48, -1.2, 1.2); g.stroke();
    } else if (kind === 'street') {
      var vx = 760, vy = 430;
      g.fillStyle = lin(0, 430, [[0, '#9cc4e4'], [1, '#e6eef2']]); g.fillRect(0, 0, W, H);
      poly([[0, 0], [vx - 60, vy - 40], [vx - 60, vy + 30], [0, H]], '#c9a27e');
      poly([[W, 0], [vx + 60, vy - 40], [vx + 60, vy + 30], [W, H]], '#b98f6d');
      poly([[0, H], [vx - 60, vy + 30], [vx + 60, vy + 30], [W, H]], '#6d6f73');
      poly([[0, H], [vx - 60, vy + 30], [vx - 45, vy + 30], [230, H]], '#a7a39c');
      poly([[W, H], [vx + 60, vy + 30], [vx + 45, vy + 30], [W - 230, H]], '#a7a39c');
      for (var d = 0; d < 9; d++) { var a0 = Math.pow(0.72, d), a1 = Math.pow(0.72, d + 0.45); g.strokeStyle = '#f2f2f2'; g.lineWidth = 14 * a0; g.beginPath(); g.moveTo(vx + (vx - vx) * a0, vy + 30 + (H - vy - 30) * a0); g.lineTo(vx, vy + 30 + (H - vy - 30) * a1); g.stroke(); }
      for (var side = -1; side <= 1; side += 2) {
        for (var j = 0; j < 7; j++) {
          var f0 = Math.pow(0.78, j), f1 = Math.pow(0.78, j + 0.55), X0 = vx + side * (vx + 40) * f0, X1 = vx + side * (vx + 40) * f1;
          [0.18, 0.46].forEach(function (yy) {
            var top0 = vy + (0 - vy) * f0 + (H * yy) * f0, bot0 = top0 + 150 * f0, top1 = vy + (0 - vy) * f1 + (H * yy) * f1, bot1 = top1 + 150 * f1;
            poly([[X0, top0], [X1, top1], [X1, bot1], [X0, bot0]], j === 1 && side > 0 && yy > 0.3 ? accent : '#3e5064');
          });
        }
      }
      var dz = 0.62, dX0 = vx + (vx + 40) * dz, dX1 = vx + (vx + 40) * Math.pow(0.78, 1.5 + 0.1);
      poly([[dX0 - 8, vy + (H - vy) * dz * 0.95], [dX1, vy + (H - vy) * 0.5 * 0.95], [dX1, vy + (0 - vy) * 0.5 + H * 0.46 * 0.5], [dX0 - 8, vy + (0 - vy) * dz + H * 0.46 * dz + 190]], mix(accent, '#000000', 0.15));
      for (var lp = 0; lp < 5; lp++) { var f = Math.pow(0.7, lp), lx = vx - (vx - 120) * f, ly = vy + 30 + (H - vy - 60) * f; g.fillStyle = '#23272b'; g.fillRect(lx - 5 * f, ly - 420 * f, 10 * f, 420 * f); ell(lx, ly - 420 * f, 22 * f, 12 * f, '#fff0b8'); }
    } else if (kind === 'park') {
      g.fillStyle = lin(0, 640, [[0, '#5b9bd5'], [1, '#cfe6f3']]); g.fillRect(0, 0, W, H);
      cloud(420, 190, 0.9); cloud(1200, 280, 0.7);
      hills(650, 60, '#7bb35a', 2);
      g.fillStyle = lin(620, H, [[0, '#79b152'], [1, '#4e8a38']]); g.fillRect(0, 640, W, H - 640);
      g.fillStyle = '#5a3d27'; g.fillRect(205, 380, 34, 320);
      [[222, 360, 130], [150, 420, 90], [300, 420, 95], [222, 270, 90]].forEach(function (p) { ball(p[0], p[1], p[2], '#3d7d3b'); });
      g.strokeStyle = '#3a3a3a'; g.lineWidth = 2; g.beginPath(); g.moveTo(1060, 300); g.quadraticCurveTo(900, 620, 760, 900); g.stroke();
      poly([[1060, 170], [1150, 290], [1060, 410], [970, 290]], accent);
      poly([[1060, 170], [1150, 290], [1060, 290]], mix(accent, '#ffffff', 0.35));
      g.strokeStyle = '#b3261e'; g.lineWidth = 6; g.beginPath(); g.moveTo(1060, 410); g.bezierCurveTo(1020, 470, 1110, 520, 1060, 590); g.stroke();
      ell(700, 890, 80, 16, 'rgba(0,0,0,.25)'); ball(700, 830, 62, '#e8e8e8');
      g.strokeStyle = '#2f6fb3'; g.lineWidth = 12; g.beginPath(); g.arc(700, 830, 44, -0.3, 1.9); g.stroke();
      g.fillStyle = '#7a5231'; g.fillRect(1180, 700, 240, 20); g.fillRect(1180, 660, 240, 14); g.fillRect(1195, 720, 14, 70); g.fillRect(1390, 720, 14, 70);
    } else if (kind === 'window') {
      g.fillStyle = '#e4d3b8'; g.fillRect(0, 0, W, H);
      for (var b2 = 0; b2 < 2600; b2++) { g.fillStyle = 'rgba(120,90,60,' + (rnd() * 0.06) + ')'; g.fillRect(rnd() * W, rnd() * H, 3 + rnd() * 10, 2 + rnd() * 5); }
      g.fillStyle = '#7c8a93'; g.fillRect(560, 250, 380, 470); g.fillStyle = '#2d3b46'; g.fillRect(585, 275, 330, 420);
      g.fillStyle = 'rgba(190,220,240,.45)'; poly([[585, 275], [760, 275], [585, 520]], 'rgba(190,220,240,.35)');
      g.strokeStyle = '#e9ecef'; g.lineWidth = 10; g.strokeRect(585, 275, 330, 420); g.beginPath(); g.moveTo(750, 275); g.lineTo(750, 695); g.moveTo(585, 485); g.lineTo(915, 485); g.stroke();
      [[395, 250], [945, 250]].forEach(function (p) { g.fillStyle = accent; g.fillRect(p[0], p[1], 160, 470); for (var sl = 0; sl < 16; sl++) { g.fillStyle = mix(accent, '#000000', 0.22); g.fillRect(p[0] + 12, p[1] + 18 + sl * 28, 136, 7); } });
      g.fillStyle = '#b9aa95'; g.fillRect(540, 720, 420, 26);
      g.fillStyle = '#b25f37'; g.fillRect(610, 660, 280, 62);
      for (var fl = 0; fl < 22; fl++) { var fx2 = 630 + rnd() * 240, fy2 = 600 + rnd() * 60; g.strokeStyle = '#3f7a3a'; g.lineWidth = 4; g.beginPath(); g.moveTo(fx2, 665); g.lineTo(fx2 + (rnd() - 0.5) * 20, fy2); g.stroke(); ball(fx2, fy2, 14, fl % 3 ? '#e6457a' : '#f4f1e8'); }
    }
    /* grano fotográfico suave */
    var img = g.getImageData(0, 0, W, H), px = img.data;
    for (var n = 0; n < px.length; n += 4) { var nz = (rnd() - 0.5) * 14; px[n] = clamp(px[n] + nz, 0, 255); px[n + 1] = clamp(px[n + 1] + nz, 0, 255); px[n + 2] = clamp(px[n + 2] + nz, 0, 255); }
    if (dark) for (var q = 0; q < px.length; q += 4) { px[q] = 255 * Math.pow(px[q] / 255, 2.5) * 0.74 - 17; px[q + 1] = 255 * Math.pow(px[q + 1] / 255, 2.5) * 0.74 - 17; px[q + 2] = 255 * Math.pow(px[q + 2] / 255, 2.2) * 0.86 - 8; }
    g.putImageData(img, 0, 0);
    return c;
  }

  /* ---------- Procesado de luz y color (en espacio lineal donde tiene sentido) ---------- */
  var TO_LIN = new Float32Array(256); for (var i0 = 0; i0 < 256; i0++) { var v0 = i0 / 255; TO_LIN[i0] = v0 <= 0.04045 ? v0 / 12.92 : Math.pow((v0 + 0.055) / 1.055, 2.4); }
  function toSrgb(v) { v = v <= 0 ? 0 : v >= 1 ? 1 : v; return v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055; }
  function neutralAdj() { return { exposure: 0, contrast: 0, highlights: 0, shadows: 0, saturation: 0, temperature: 0, tint: 0, vignette: 0 }; }
  function isNeutral(v) { return !v.bw && ADJ.every(function (k) { return !v.adj[k]; }); }
  function applyAdjust(img, v, opts) {
    var a = v.adj, W = img.width, H = img.height, p = img.data;
    var ev = Math.pow(2, a.exposure / 50), tp = a.temperature / 100, tn = a.tint / 100, k = 1 + a.contrast / 100;
    var mul = [ev * (1 + 0.22 * tp) * (1 + 0.08 * tn), ev * (1 - 0.14 * tn), ev * (1 - 0.22 * tp) * (1 + 0.08 * tn)];
    var lut = [new Float32Array(256), new Float32Array(256), new Float32Array(256)];
    for (var c = 0; c < 3; c++) for (var i = 0; i < 256; i++) {
      var s = toSrgb(TO_LIN[i] * mul[c]);
      if (a.contrast > 0) { var sm = s <= 0 ? 0 : s >= 1 ? 1 : s * s * (3 - 2 * s); s = s + (sm - s) * (a.contrast / 100) * 1.6; }
      else if (a.contrast < 0) s = 0.5 + (s - 0.5) * (1 + a.contrast / 100 * 0.8);
      lut[c][i] = s;
    }
    var hi = a.highlights / 100, sh = a.shadows / 100, sat = 1 + a.saturation / 100, vg = a.vignette / 100, bw = !!v.bw;
    var cx = W / 2, cy = H / 2, maxd = Math.sqrt(cx * cx + cy * cy);
    var clipOn = opts && opts.clip;
    for (var y = 0, o = 0; y < H; y++) {
      var dy = (y - cy) / maxd;
      for (var x = 0; x < W; x++, o += 4) {
        var r = lut[0][p[o]], g = lut[1][p[o + 1]], b = lut[2][p[o + 2]];
        var L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        if (hi || sh) {
          var q1 = (L - 0.45) / 0.55, q2 = (0.55 - L) / 0.55; q1 = q1 < 0 ? 0 : q1 > 1 ? 1 : q1; q2 = q2 < 0 ? 0 : q2 > 1 ? 1 : q2;
          var wh = q1 * q1 * (3 - 2 * q1), ws = q2 * q2 * (3 - 2 * q2);
          var nL = L + hi * 0.3 * wh * (hi < 0 ? L : 1 - L) + sh * 0.25 * ws * (sh > 0 ? 0.3 + L : L);
          nL = nL < 0 ? 0 : nL;
          if (L > 0.002) { var f = nL / L; r *= f; g *= f; b *= f; } else { r += nL - L; g += nL - L; b += nL - L; }
          L = nL;
        }
        if (sat !== 1) { r = L + (r - L) * sat; g = L + (g - L) * sat; b = L + (b - L) * sat; }
        if (vg) { var dx = (x - cx) / maxd, dd = dx * dx + dy * dy, m = 1 - vg * 0.85 * dd * dd * 1.6; if (m < 0) m = 0; r *= m; g *= m; b *= m; if (vg < 0) { r = r > 1 ? 1 : r; g = g > 1 ? 1 : g; b = b > 1 ? 1 : b; } }
        if (bw) { var yv = 0.2126 * r + 0.7152 * g + 0.0722 * b; r = g = b = yv; }
        r = r < 0 ? 0 : r > 1 ? 255 : r * 255; g = g < 0 ? 0 : g > 1 ? 255 : g * 255; b = b < 0 ? 0 : b > 1 ? 255 : b * 255;
        if (clipOn) { var Y = 0.2126 * r + 0.7152 * g + 0.0722 * b; if (Y >= 250 || (r >= 254.5 && g >= 254.5) || (g >= 254.5 && b >= 254.5)) { r = 255; g = 40; b = 110; } else if (Y <= 5) { r = 20; g = 120; b = 255; } }
        p[o] = r; p[o + 1] = g; p[o + 2] = b;
      }
    }
    return img;
  }
  function histogram(img) {
    var p = img.data, Lh = new Uint32Array(256), Rh = new Uint32Array(256), Gh = new Uint32Array(256), Bh = new Uint32Array(256), hiN = 0, loN = 0, n = 0, sum = 0;
    for (var o = 0; o < p.length; o += 4) {
      var r = p[o], g = p[o + 1], b = p[o + 2], Y = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
      Lh[Y]++; Rh[r]++; Gh[g]++; Bh[b]++; n++; sum += Y;
      if (Y >= 250 || (r >= 255 && g >= 255) || (g >= 255 && b >= 255)) hiN++; else if (Y <= 5) loN++;
    }
    return { L: Lh, R: Rh, G: Gh, B: Bh, n: n, hi: hiN / n, lo: loN / n, mean: sum / n / 255 };
  }

  /* ---------- Guías de composición ---------- */
  function drawGuides(g, x, y, w, hh, guide, orient, lw) {
    if (!guide || guide === 'none') return;
    var paths = [];
    function line(ax, ay, bx, by) { paths.push(['l', x + ax * w, y + ay * hh, x + bx * w, y + by * hh]); }
    if (guide === 'thirds' || guide === 'phi') {
      var a = guide === 'thirds' ? 1 / 3 : 1 - 1 / PHI, b = 1 - a;
      line(a, 0, a, 1); line(b, 0, b, 1); line(0, a, 1, a); line(0, b, 1, b);
    } else if (guide === 'diagonals') {
      line(0, 0, 1, 1); line(1, 0, 0, 1);
      /* diagonales recíprocas: desde cada esquina, perpendicular a la diagonal que no pasa por ella */
      var u = (w * w) / (w * w + hh * hh);
      line(1, 0, u, u); line(0, 1, 1 - u, 1 - u); line(0, 0, 1 - u, u); line(1, 1, u, 1 - u);
    } else if (guide === 'centre') {
      line(0.5, 0.42, 0.5, 0.58); line(0.42, 0.5, 0.58, 0.5); paths.push(['c', x + w / 2, y + hh / 2, Math.min(w, hh) * 0.12]);
    } else if (guide === 'spiral') {
      var portrait = hh > w, fx = orient & 1, fy = orient & 2;
      function map(px, py) { var u2 = px / PHI, v2 = py; if (portrait) { var tmp = u2; u2 = v2; v2 = tmp; } if (fx) u2 = 1 - u2; if (fy) v2 = 1 - v2; return [x + u2 * w, y + v2 * hh]; }
      var R = { x: 0, y: 0, w: PHI, h: 1 }, arcs = [];
      for (var i = 0; i < 11; i++) {
        var s = Math.min(R.w, R.h), cxs, cys, a0, sq;
        if (i % 4 === 0) { sq = [R.x, R.y, s, s]; cxs = R.x + s; cys = R.y + s; a0 = Math.PI; R = { x: R.x + s, y: R.y, w: R.w - s, h: R.h }; }
        else if (i % 4 === 1) { sq = [R.x, R.y, s, s]; cxs = R.x; cys = R.y + s; a0 = 1.5 * Math.PI; R = { x: R.x, y: R.y + s, w: R.w, h: R.h - s }; }
        else if (i % 4 === 2) { sq = [R.x + R.w - s, R.y, s, s]; cxs = R.x + R.w - s; cys = R.y; a0 = 0; R = { x: R.x, y: R.y, w: R.w - s, h: R.h }; }
        else { sq = [R.x, R.y + R.h - s, s, s]; cxs = R.x + s; cys = R.y + R.h - s; a0 = 0.5 * Math.PI; R = { x: R.x, y: R.y, w: R.w, h: R.h - s }; }
        var pts = []; for (var st = 0; st <= 16; st++) { var an = a0 + st / 16 * Math.PI / 2; pts.push(map(cxs + Math.cos(an) * s, cys + Math.sin(an) * s)); }
        arcs.push(pts);
        if (i < 6) { var q = sq, c1 = map(q[0], q[1]), c2 = map(q[0] + q[2], q[1] + q[3]); paths.push(['r', Math.min(c1[0], c2[0]), Math.min(c1[1], c2[1]), Math.abs(c2[0] - c1[0]), Math.abs(c2[1] - c1[1]), true]); }
      }
      arcs.forEach(function (pts) { paths.push(['p', pts]); });
    }
    [['rgba(10,16,24,.75)', lw * 2.6], ['rgba(255,255,255,.95)', lw]].forEach(function (pen, pass) {
      g.strokeStyle = pen[0]; g.lineWidth = pen[1]; g.lineCap = 'round';
      paths.forEach(function (pp) {
        g.beginPath();
        if (pp[0] === 'l') { g.moveTo(pp[1], pp[2]); g.lineTo(pp[3], pp[4]); }
        else if (pp[0] === 'c') g.arc(pp[1], pp[2], pp[3], 0, Math.PI * 2);
        else if (pp[0] === 'r') { g.save(); g.globalAlpha = pass ? 0.45 : 0.35; g.rect(pp[1], pp[2], pp[3], pp[4]); g.stroke(); g.restore(); return; }
        else { g.moveTo(pp[1][0][0], pp[1][0][1]); pp[1].forEach(function (q2) { g.lineTo(q2[0], q2[1]); }); }
        g.stroke();
      });
    });
  }

  /* ================================================================== */
  function studio(ctx) {
    var t = ctx.t, h = ctx.h, F = ctx.fields, vp = ctx.viewport;
    var S = null, seq = 0, sel = true, tool = 'crop', compare = 'after', split = 50, showClip = false, guidesOnResult = true;
    var MEDIA = {};            /* id → { canvas } (en memoria; no se guarda en el navegador) */
    var PRACT = {};            /* caché de imágenes de práctica */
    var pendingLoads = 0;
    function nid(p) { seq += 1; return p + seq; }

    /* ---------- Escena ---------- */
    var canvas = h('canvas', { class: 'igph-canvas', 'aria-hidden': 'true' }); vp.appendChild(canvas); vp.classList.add('igph-viewport');
    var overlay = h('div', { class: 'igph-overlay' }); vp.appendChild(overlay);
    var badge = h('p', { class: 'igph-badge', 'aria-hidden': 'true' }); vp.appendChild(badge);
    var g = canvas.getContext('2d');
    ctx.setTech('renderer', 'Canvas 2D');
    ctx.toolbar.parentNode.appendChild(h('p', { class: 'igs-status-line igph-status' }));

    function photo() { return S.photos[S.cur] || null; }
    function version(p) { p = p || photo(); return p ? p.versions[p.cur] : null; }
    function source(p) {
      if (!p) return null;
      var sp = String(p.src).split(':');
      if (sp[0] === 'practice') { var key = p.src; if (!PRACT[key]) PRACT[key] = practice(sp[1], sp[2] || null, sp[3] === 'dark'); return PRACT[key]; }
      var m = MEDIA[sp[1]]; return m && m.canvas ? m.canvas : null;
    }
    function newVersion(name) { return { id: nid('v'), name: name || t('versionN', { n: 1 }), crop: { x: 0, y: 0, w: 1, h: 1 }, ratio: 'free', angle: 0, flipH: false, flipV: false, adj: neutralAdj(), bw: false, guide: 'thirds', spiral: 0 }; }
    function newPhoto(src, name, alt, w, hh, meta) { return { id: nid('p'), name: name, alt: alt || '', src: src, w: w, h: hh, meta: meta || { gps: false, date: false, model: false }, versions: [newVersion(t('versionN', { n: 1 }))], cur: 0 }; }
    function practicePhoto(kind, accent, dark, name) {
      var src = 'practice:' + kind + (accent ? ':' + accent : (dark ? ':' : '')) + (dark ? ':dark' : '');
      return newPhoto(src, name || t('pr_' + kind), t('prAlt_' + kind), 1500, 1000, null);
    }

    /* ---------- Geometría del encuadre ----------
       Cadena: foto → volteo → giro fino alrededor del centro (marco enderezado, mismo tamaño) → recorte → luz y color. */
    function cropValid(p, v, c) {
      var W = p.w, H = p.h, a = v.angle * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), e = 0.5;
      var pts = [[c.x, c.y], [c.x + c.w, c.y], [c.x, c.y + c.h], [c.x + c.w, c.y + c.h]];
      if (c.x < -1e-6 || c.y < -1e-6 || c.x + c.w > 1 + 1e-6 || c.y + c.h > 1 + 1e-6) return false;
      if (!v.angle) return true;
      return pts.every(function (q) { var dx = q[0] * W - W / 2, dy = q[1] * H - H / 2, sx = dx * ca + dy * sa + W / 2, sy = -dx * sa + dy * ca + H / 2; return sx >= -e && sy >= -e && sx <= W + e && sy <= H + e; });
    }
    function fitCrop(p, v, keep) {
      var c = v.crop, r = parseRatio(v.ratio), W = p.w, H = p.h;
      c.w = clamp(c.w, 0.03, 1); c.h = clamp(c.h, 0.03, 1);
      if (r) {
        var cx = c.x + c.w / 2, cy = c.y + c.h / 2;
        if (keep === 'h') c.w = c.h * H * r / W; else c.h = c.w * W / r / H;
        if (c.w > 1) { c.w = 1; c.h = W / r / H; } if (c.h > 1) { c.h = 1; c.w = H * r / W; }
        c.x = cx - c.w / 2; c.y = cy - c.h / 2;
      }
      c.x = clamp(c.x, 0, 1 - c.w); c.y = clamp(c.y, 0, 1 - c.h);
      if (!cropValid(p, v, c)) {
        var ccx = c.x + c.w / 2, ccy = c.y + c.h / 2, lo = 0, hi = 1;
        for (var it = 0; it < 30; it++) { var mid = (lo + hi) / 2, tc = { x: ccx - c.w * mid / 2, y: ccy - c.h * mid / 2, w: c.w * mid, h: c.h * mid }; if (cropValid(p, v, tc)) lo = mid; else hi = mid; }
        if (lo < 0.05) { ccx = ccx + (0.5 - ccx) * 0.5; ccy = ccy + (0.5 - ccy) * 0.5; lo = 0.3; }
        c.w *= lo; c.h *= lo; c.x = ccx - c.w / 2; c.y = ccy - c.h / 2;
        if (!cropValid(p, v, c)) { c.x = 0.5 - c.w / 2; c.y = 0.5 - c.h / 2; }
      }
      ['x', 'y', 'w', 'h'].forEach(function (k) { c[k] = r4(c[k]); });
    }
    function drawFrame(gg, p, v, k) {
      /* dibuja el marco enderezado (tamaño p.w × p.h a escala k) */
      var src = source(p); if (!src) return false;
      gg.save(); gg.scale(k, k); gg.translate(p.w / 2, p.h / 2); gg.rotate(v.angle * Math.PI / 180); gg.scale(v.flipH ? -1 : 1, v.flipV ? -1 : 1);
      gg.drawImage(src, -p.w / 2, -p.h / 2, p.w, p.h); gg.restore(); return true;
    }
    /* Resultado: recorte + ajustes. maxLong = 0 → resolución completa de la fuente. */
    function renderOutput(p, v, maxLong, opts) {
      opts = opts || {};
      var cw = v.crop.w * p.w, ch = v.crop.h * p.h, k = maxLong ? Math.min(1, maxLong / Math.max(cw, ch)) : 1;
      var out = newCanvas(cw * k, ch * k), gg = out.getContext('2d');
      gg.fillStyle = '#808080'; gg.fillRect(0, 0, out.width, out.height);
      gg.save(); gg.translate(-v.crop.x * p.w * k, -v.crop.y * p.h * k);
      var ok = drawFrame(gg, p, v, k); gg.restore();
      if (!ok) return null;
      if (opts.adjust !== false && (!isNeutral(v) || opts.clip)) { var id = gg.getImageData(0, 0, out.width, out.height); applyAdjust(id, v, { clip: opts.clip }); gg.putImageData(id, 0, 0); }
      return out;
    }
    function renderFramePreview(p, v, maxLong, adjust) {
      var k = Math.min(1, maxLong / Math.max(p.w, p.h)), out = newCanvas(p.w * k, p.h * k), gg = out.getContext('2d');
      gg.fillStyle = '#3a4048'; gg.fillRect(0, 0, out.width, out.height);
      if (!drawFrame(gg, p, v, k)) return null;
      if (adjust && (!isNeutral(v) || showClip)) { var id = gg.getImageData(0, 0, out.width, out.height); applyAdjust(id, v, { clip: showClip }); gg.putImageData(id, 0, 0); }
      return out;
    }

    /* Cachés por clave: el recorte se puede mover sin volver a procesar el marco. */
    var frameCache = { key: '', c: null }, outCache = { key: '', c: null }, beforeCache = { key: '', c: null }, thumbCache = {};
    function vkey(p, v, extra) { return JSON.stringify([p.src, p.w, v.crop, v.angle, v.flipH, v.flipV, v.adj, v.bw, extra || '']); }
    function thumb(p, v, size) {
      var key = vkey(p, v, size); if (thumbCache[key]) return thumbCache[key];
      var c = renderOutput(p, v, size || 96); if (!c) return null;
      thumbCache[key] = c; return c;
    }
    function thumbNode(p, v) {
      var c = thumb(p, v, 96), n = newCanvas(44, 44), gg = n.getContext('2d'); n.className = 'igph-thumb'; n.setAttribute('aria-hidden', 'true');
      gg.fillStyle = '#dfe6ee'; gg.fillRect(0, 0, 44, 44);
      if (c) { var s = Math.min(44 / c.width, 44 / c.height); gg.drawImage(c, (44 - c.width * s) / 2, (44 - c.height * s) / 2, c.width * s, c.height * s); }
      return n;
    }

    /* ---------- Dibujo del lienzo ---------- */
    var layout = null, rq = 0;
    function draw() { if (!rq) rq = root.requestAnimationFrame(function () { rq = 0; paint(); }); }
    function paint() {
      var dpr = Math.min(2, root.devicePixelRatio || 1), W = Math.max(200, vp.clientWidth), H = Math.max(160, vp.clientHeight);
      if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) { canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); }
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.fillStyle = '#2b323b'; g.fillRect(0, 0, W, H);
      var fh = D.activeElement && overlay.contains(D.activeElement) ? D.activeElement.className : null;
      ctx.clear(overlay); layout = null; badge.textContent = ''; badge.hidden = true;
      var p = photo(), v = version(p), maxL = Math.min(1600, Math.max(W, H) * dpr);
      if (tool === 'sheet') { paintSheet(W, H, dpr); return; }
      if (!p || !v) { g.fillStyle = '#e8eef4'; g.font = '600 16px "Atkinson Hyperlegible", system-ui, sans-serif'; g.textAlign = 'center'; g.fillText(t('emptyStage'), W / 2, H / 2); return; }
      if (!source(p)) { g.fillStyle = '#e8eef4'; g.font = '600 16px "Atkinson Hyperlegible", system-ui, sans-serif'; g.textAlign = 'center'; g.fillText(t('loadingPhoto'), W / 2, H / 2); return; }
      var m = 20;
      if (tool === 'crop') {
        var fk = vkey(p, v, maxL + '|' + showClip + '|' + compare);
        if (frameCache.key !== fk) { frameCache = { key: fk, c: renderFramePreview(p, v, maxL, compare !== 'before') }; }
        var fc = frameCache.c; if (!fc) return;
        var s = Math.min((W - 2 * m) / p.w, (H - 2 * m) / p.h), dw = p.w * s, dh = p.h * s, ox = (W - dw) / 2, oy = (H - dh) / 2;
        g.imageSmoothingQuality = 'high'; g.drawImage(fc, ox, oy, dw, dh);
        var c = v.crop, bx = ox + c.x * dw, by = oy + c.y * dh, bw = c.w * dw, bh = c.h * dh;
        g.fillStyle = 'rgba(10,14,20,.62)'; g.beginPath(); g.rect(ox, oy, dw, dh); g.rect(bx, by, bw, bh); g.fill('evenodd');
        drawGuides(g, bx, by, bw, bh, v.guide, v.spiral, 1.3);
        g.strokeStyle = '#ffffff'; g.lineWidth = 2; g.strokeRect(bx, by, bw, bh);
        g.strokeStyle = 'rgba(10,16,24,.8)'; g.lineWidth = 1; g.strokeRect(bx - 1.5, by - 1.5, bw + 3, bh + 3);
        layout = { ox: ox, oy: oy, dw: dw, dh: dh };
        handles(bx, by, bw, bh);
        if (fh) { var nf = overlay.querySelector('.' + fh.split(' ').join('.')); if (nf) nf.focus({ preventScroll: true }); }
        if (compare === 'before') showBadge(t('beforeBadge'));
        if (pendingTap) { var pt = pendingTap; g.fillStyle = '#ffd23f'; g.beginPath(); g.arc(ox + pt.x * dw, oy + pt.y * dh, 7, 0, Math.PI * 2); g.fill(); g.strokeStyle = '#101820'; g.lineWidth = 2; g.stroke(); }
        return;
      }
      /* Resultado, con comparación antes/después */
      var ok = vkey(p, v, maxL + '|' + showClip), bk = vkey(p, Object.assign({}, v, { adj: neutralAdj(), bw: false }), maxL);
      if (outCache.key !== ok) outCache = { key: ok, c: renderOutput(p, v, maxL, { clip: showClip }) };
      var out = outCache.c; if (!out) return;
      var before = null;
      if (compare !== 'after') { if (beforeCache.key !== bk) beforeCache = { key: bk, c: renderOutput(p, v, maxL, { adjust: false }) }; before = beforeCache.c; }
      var cw = v.crop.w * p.w, ch = v.crop.h * p.h, s2 = Math.min((W - 2 * m) / cw, (H - 2 * m) / ch), ow = cw * s2, oh = ch * s2, x0 = (W - ow) / 2, y0 = (H - oh) / 2;
      g.imageSmoothingQuality = 'high';
      if (compare === 'before') { g.drawImage(before, x0, y0, ow, oh); showBadge(t('beforeBadge')); }
      else if (compare === 'split') {
        var sx = ow * split / 100;
        g.drawImage(before, 0, 0, before.width * split / 100, before.height, x0, y0, sx, oh);
        g.drawImage(out, out.width * split / 100, 0, out.width * (1 - split / 100), out.height, x0 + sx, y0, ow - sx, oh);
        g.fillStyle = '#ffffff'; g.fillRect(x0 + sx - 1.5, y0, 3, oh);
        label(t('beforeBadge'), x0 + 10, y0 + 10, 'left'); label(t('afterBadge'), x0 + ow - 10, y0 + 10, 'right');
      } else g.drawImage(out, x0, y0, ow, oh);
      if (guidesOnResult) drawGuides(g, x0, y0, ow, oh, v.guide, v.spiral, 1.2);
    }
    function label(txt, x, y, align) {
      g.font = '700 14px "Atkinson Hyperlegible", system-ui, sans-serif'; var w = g.measureText(txt).width + 16;
      var bx = align === 'right' ? x - w : x; g.fillStyle = 'rgba(16,24,32,.85)'; g.fillRect(bx, y, w, 26);
      g.fillStyle = '#ffffff'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(txt, bx + 8, y + 13);
    }
    function showBadge(txt) { badge.textContent = txt; badge.hidden = false; }
    function paintSheet(W, H, dpr) {
      var sh = contactSheet(Math.min(1400, W * dpr)); if (!sh) return;
      var s = Math.min((W - 24) / sh.width, (H - 24) / sh.height); g.drawImage(sh, (W - sh.width * s) / 2, (H - sh.height * s) / 2, sh.width * s, sh.height * s);
    }

    /* ---------- Asas del recorte (HTML, con teclado) ---------- */
    var HANDLES = [['nw', 0, 0], ['n', 0.5, 0], ['ne', 1, 0], ['e', 1, 0.5], ['se', 1, 1], ['s', 0.5, 1], ['sw', 0, 1], ['w', 0, 0.5]];
    function handles(bx, by, bw, bh) {
      var box = h('div', { class: 'igph-box', style: 'left:' + bx + 'px;top:' + by + 'px;width:' + bw + 'px;height:' + bh + 'px' });
      box.addEventListener('pointerdown', function (e) { startDrag(e, 'move'); });
      overlay.appendChild(box);
      HANDLES.forEach(function (d) {
        var b = h('button', { type: 'button', class: 'igph-handle igph-h-' + d[0], 'aria-label': t('handle_' + d[0]) + '. ' + t('handleHelp'), style: 'left:' + (bx + d[1] * bw) + 'px;top:' + (by + d[2] * bh) + 'px' });
        b.addEventListener('pointerdown', function (e) { e.stopPropagation(); startDrag(e, d[0]); });
        b.addEventListener('keydown', function (e) {
          var st = e.shiftKey ? 0.05 : 0.01, dd = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, -st], ArrowDown: [0, st] }[e.key];
          if (!dd) return; e.preventDefault(); e.stopPropagation();
          resizeBy(d[0], dd[0], dd[1]); paint(); var nb = overlay.querySelector('.igph-h-' + d[0]); if (nb) nb.focus();
          keyCommit(t('cropChanged')); announceCrop();
        });
        overlay.appendChild(b);
      });
    }
    function resizeBy(which, dx, dy) {
      var p = photo(), v = version(p); if (!v) return;
      var c = v.crop, x0 = c.x, y0 = c.y, x1 = c.x + c.w, y1 = c.y + c.h, r = parseRatio(v.ratio);
      if (which.indexOf('w') >= 0) x0 = clamp(x0 + dx, 0, x1 - 0.03); if (which.indexOf('e') >= 0) x1 = clamp(x1 + dx, x0 + 0.03, 1);
      if (which.indexOf('n') >= 0) y0 = clamp(y0 + dy, 0, y1 - 0.03); if (which.indexOf('s') >= 0) y1 = clamp(y1 + dy, y0 + 0.03, 1);
      var useW = which === 'e' || which === 'w' ? true : which === 'n' || which === 's' ? false : Math.abs(dx) >= Math.abs(dy);
      if (r) {
        /* proporción fija: la esquina contraria (o el centro del lado) queda quieta */
        var R = r * p.h / p.w, nw = x1 - x0, nh = y1 - y0, cx = c.x + c.w / 2, cy = c.y + c.h / 2;
        if (useW) nh = nw / R; else nw = nh * R;
        if (which.indexOf('w') >= 0) x0 = x1 - nw; else if (which.indexOf('e') >= 0) x1 = x0 + nw; else { x0 = cx - nw / 2; x1 = cx + nw / 2; }
        if (which.indexOf('n') >= 0) y0 = y1 - nh; else if (which.indexOf('s') >= 0) y1 = y0 + nh; else { y0 = cy - nh / 2; y1 = cy + nh / 2; }
      }
      c.x = x0; c.y = y0; c.w = x1 - x0; c.h = y1 - y0;
      fitCrop(p, v, useW ? 'w' : 'h');
    }
    var drag = null, pendingTap = null;
    function toFrame(e) { var r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left - layout.ox) / layout.dw, y: (e.clientY - r.top - layout.oy) / layout.dh }; }
    function startDrag(e, which) {
      if (e.button !== 0 || !layout || tool !== 'crop') return;
      e.preventDefault(); var v = version(); drag = { which: which, start: toFrame(e), orig: JSON.stringify(v.crop), pid: e.pointerId, moved: false };
      try { vp.setPointerCapture(e.pointerId); } catch (_) {}
    }
    canvas.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 || !layout || tool !== 'crop') return;
      var f = toFrame(e); if (f.x < 0 || f.y < 0 || f.x > 1 || f.y > 1) return;
      drag = { which: 'new', start: f, orig: JSON.stringify(version().crop), pid: e.pointerId, moved: false }; try { vp.setPointerCapture(e.pointerId); } catch (_) {}
    });
    vp.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.pid) return;
      var p = photo(), v = version(p), f = toFrame(e), o = JSON.parse(drag.orig), dx = f.x - drag.start.x, dy = f.y - drag.start.y;
      if (Math.abs(dx) * layout.dw + Math.abs(dy) * layout.dh > 4) drag.moved = true; if (!drag.moved) return;
      if (drag.which === 'move') { v.crop.x = clamp(o.x + dx, 0, 1 - o.w); v.crop.y = clamp(o.y + dy, 0, 1 - o.h); v.crop.w = o.w; v.crop.h = o.h; fitCrop(p, v); }
      else if (drag.which === 'new') { rectFrom(p, v, drag.start, f); }
      else { v.crop = o; resizeBy(drag.which, dx, dy); }
      paint();
    });
    function endDrag(e) {
      if (!drag || e.pointerId !== drag.pid) return;
      var d = drag; drag = null;
      if (!d.moved) {
        if (d.which === 'new' || d.which === 'move') {
          /* dos toques: primera esquina y esquina contraria (alternativa al arrastre, WCAG 2.5.7) */
          if (!pendingTap) { pendingTap = d.start; paint(); ctx.announce(t('tapFirst')); }
          else { rectFrom(photo(), version(), pendingTap, d.start); pendingTap = null; commit(t('cropChanged')); }
        }
        return;
      }
      pendingTap = null;
      if (JSON.stringify(version().crop) !== d.orig) commit(t('cropChanged')); else paint();
    }
    vp.addEventListener('pointerup', endDrag); vp.addEventListener('pointercancel', endDrag);
    function rectFrom(p, v, a, b) {
      var x0 = clamp(Math.min(a.x, b.x), 0, 1), y0 = clamp(Math.min(a.y, b.y), 0, 1), x1 = clamp(Math.max(a.x, b.x), 0, 1), y1 = clamp(Math.max(a.y, b.y), 0, 1), r = parseRatio(v.ratio);
      var w = Math.max(0.03, x1 - x0), hh = Math.max(0.03, y1 - y0);
      if (r) { var hw = w * p.w / r / p.h; if (hw > hh) { w = hh * p.h * r / p.w; } else hh = hw; if (b.x < a.x) x0 = a.x - w; if (b.y < a.y) y0 = a.y - hh; }
      v.crop = { x: x0, y: y0, w: w, h: hh }; fitCrop(p, v);
    }
    var kcTimer = 0; function keyCommit(label) { clearTimeout(kcTimer); kcTimer = setTimeout(function () { commit(label, true); }, 450); }
    function announceCrop() { var p = photo(), v = version(p); if (v) ctx.announce(cropText(p, v)); }
    function cropText(p, v) { var c = v.crop; return t('cropNow', { w: Math.round(c.w * p.w), h: Math.round(c.h * p.h), x: Math.round(c.x * 100), y: Math.round(c.y * 100), ratio: ratioName(v.ratio) }); }
    function ratioName(r) { return r === 'free' ? t('ratioFree') : String(r); }
    if (root.ResizeObserver) new ResizeObserver(function () { draw(); }).observe(vp);

    /* ---------- Teclado en el lienzo ---------- */
    function onKey(e) {
      if (!vp.contains(e.target) || (e.target.closest && e.target.closest('.igph-handle'))) return false;
      var p = photo(), v = version(p), k = e.key;
      if (e.ctrlKey || e.metaKey || e.altKey) return false;
      if (!v) return false;
      var st = e.shiftKey ? 0.05 : 0.01, d = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, -st], ArrowDown: [0, st] }[k];
      if (d && tool !== 'sheet') { v.crop.x = clamp(v.crop.x + d[0], 0, 1 - v.crop.w); v.crop.y = clamp(v.crop.y + d[1], 0, 1 - v.crop.h); fitCrop(p, v); paint(); keyCommit(t('cropChanged')); announceCrop(); return true; }
      if (k === '[' || k === ']') { var f = k === ']' ? 1.05 : 1 / 1.05, c = v.crop, cx = c.x + c.w / 2, cy = c.y + c.h / 2; c.w = Math.min(1, c.w * f); c.h = Math.min(1, c.h * f); c.x = cx - c.w / 2; c.y = cy - c.h / 2; fitCrop(p, v); paint(); keyCommit(t('cropChanged')); announceCrop(); return true; }
      if (k === 'r' || k === 'R') { setAngle(v.angle + (e.shiftKey ? -0.5 : 0.5)); return true; }
      if (k === 'h' || k === 'H') { flip('H'); return true; }
      if (k === 'v' || k === 'V') { flip('V'); return true; }
      if (k === 'g' || k === 'G') { v.guide = GUIDES[(GUIDES.indexOf(v.guide) + 1) % GUIDES.length]; commit(t('guideNow', { g: t('guide_' + v.guide) })); return true; }
      if (k === 'b' || k === 'B') { setCompare(compare === 'after' ? 'before' : 'after'); return true; }
      if (k === ',' || k === '.') { goVersion(p.cur + (k === '.' ? 1 : -1)); return true; }
      if (k === 'PageUp' || k === 'PageDown') { goPhoto(S.cur + (k === 'PageDown' ? 1 : -1)); return true; }
      if (k === 'Escape') { if (pendingTap) { pendingTap = null; paint(); ctx.announce(t('cancelled')); return true; } if (sel) { sel = false; renderSide(); ctx.announce(t('deselectedSeries')); return true; } return false; }
      if ((k === 'Enter' || k === ' ') && !sel) { sel = true; renderSide(); ctx.announce(t('selectedPhoto', { name: p.name, v: v.name })); return true; }
      if ((k === 'Delete' || k === 'Backspace') && sel) { delVersion(); return true; }
      return false;
    }

    /* ---------- Acciones ---------- */
    function commit(label, quiet) {
      ctx.commit(label); renderSide(); draw();
      if (label && !quiet) ctx.announce(label);
    }
    function setAngle(a) { var p = photo(), v = version(p); if (!v) return; v.angle = Math.round(clamp(a, -45, 45) * 10) / 10; fitCrop(p, v); paint(); keyCommit(t('straightened', { a: IG.num(v.angle, 1) })); ctx.announce(t('straightened', { a: IG.num(v.angle, 1) })); syncField('angle', v.angle); }
    function flip(axis) { var v = version(); if (!v) return; v['flip' + axis] = !v['flip' + axis]; commit(t(axis === 'H' ? 'flippedH' : 'flippedV')); }
    function swapRatio() {
      var p = photo(), v = version(p); if (!v) return;
      if (v.ratio !== 'free' && v.ratio !== '1:1') { var q = v.ratio.split(':'); v.ratio = q[1] + ':' + q[0]; }
      var c = v.crop, cx = c.x + c.w / 2, cy = c.y + c.h / 2, nw = c.h * p.h / p.w, nh = c.w * p.w / p.h; c.w = nw; c.h = nh; c.x = cx - nw / 2; c.y = cy - nh / 2;
      fitCrop(p, v); commit(t('ratioSwapped'));
    }
    function setCompare(m) { compare = m; syncCompare(); draw(); ctx.announce(t('compare_' + m)); }
    function syncCompare() { var b = ctx.toolbar.querySelector('[data-igph="compare"]'); if (b) b.setAttribute('aria-pressed', String(compare !== 'after')); }
    function goPhoto(i) { if (!S.photos.length) return; S.cur = (i + S.photos.length) % S.photos.length; sel = true; pendingTap = null; renderSide(); draw(); var p = photo(); ctx.announce(t('selectedPhoto', { name: p.name, v: version(p).name })); }
    function goVersion(i) { var p = photo(); if (!p) return; p.cur = (i + p.versions.length) % p.versions.length; sel = true; pendingTap = null; renderSide(); draw(); ctx.announce(t('versionOf', { n: p.cur + 1, total: p.versions.length, name: version(p).name })); }
    function addVersion() {
      var p = photo(); if (!p) return;
      if (p.versions.length >= MAX_VERSIONS) { ctx.announce(t('maxVersions', { n: MAX_VERSIONS })); return; }
      var c = JSON.parse(JSON.stringify(version(p))); c.id = nid('v'); c.name = t('versionN', { n: p.versions.length + 1 });
      p.versions.splice(p.cur + 1, 0, c); p.cur += 1; sel = true; commit(t('versionAdded', { name: c.name }));
    }
    function delVersion() {
      var p = photo(); if (!p) return;
      if (p.versions.length < 2) { ctx.announce(t('lastVersion')); return; }
      var name = version(p).name; p.versions.splice(p.cur, 1); p.cur = Math.min(p.cur, p.versions.length - 1); commit(t('deletedWhat', { name: name }));
    }
    function delPhoto() {
      var p = photo(); if (!p) return;
      S.photos.splice(S.cur, 1); S.cur = clamp(S.cur, 0, Math.max(0, S.photos.length - 1)); sel = S.photos.length > 0; commit(t('deletedWhat', { name: p.name }));
    }
    function movePhoto(dir) { var j = S.cur + dir; if (j < 0 || j >= S.photos.length) return; var p = S.photos.splice(S.cur, 1)[0]; S.photos.splice(j, 0, p); S.cur = j; commit(t('photoMoved', { n: j + 1 })); }
    function addPractice(kind) {
      if (S.photos.length >= MAX_PHOTOS) { ctx.announce(t('maxPhotos', { n: MAX_PHOTOS })); return; }
      var p = practicePhoto(kind, S.theme && S.useTheme ? S.theme : null); S.photos.push(p); S.cur = S.photos.length - 1; sel = true; commit(t('photoAdded', { name: p.name }));
    }
    function resetLight() { var v = version(); if (!v) return; v.adj = neutralAdj(); v.bw = false; commit(t('lightReset')); }
    function resetCrop() { var p = photo(), v = version(p); if (!v) return; v.crop = { x: 0, y: 0, w: 1, h: 1 }; v.ratio = 'free'; v.angle = 0; v.flipH = false; v.flipV = false; fitCrop(p, v); commit(t('cropReset')); }
    function autoLight() {
      var p = photo(), v = version(p); if (!v) return;
      var base = renderOutput(p, Object.assign({}, v, { adj: neutralAdj(), bw: false }), 400, { adjust: false }); if (!base) return;
      var hs = histogram(base.getContext('2d').getImageData(0, 0, base.width, base.height));
      var acc = 0, p2 = 0, p98 = 255; for (var i = 0; i < 256; i++) { acc += hs.L[i]; if (acc < hs.n * 0.02) p2 = i; if (acc < hs.n * 0.985) p98 = i; }
      var lin = TO_LIN[Math.round(hs.mean * 255)] || 0.001, ev = Math.log(0.18 / Math.max(0.005, lin)) / Math.LN2;
      v.adj.exposure = Math.round(clamp(ev * 0.8, -2, 2) * 50);
      v.adj.contrast = Math.round(clamp((200 - (p98 - p2)) / 3, -10, 35));
      v.adj.shadows = hs.lo > 0.02 ? 25 : 0; v.adj.highlights = hs.hi > 0.01 ? -30 : 0;
      commit(t('autoDone'));
    }

    /* ---------- Abrir fotos propias (sin subir nada) ---------- */
    function openPhoto() {
      if (S.photos.length >= MAX_PHOTOS) { ctx.announce(t('maxPhotos', { n: MAX_PHOTOS })); ctx.setStatus(t('maxPhotos', { n: MAX_PHOTOS })); return; }
      ctx.pickFile('image/jpeg,image/png,image/webp').then(function (file) {
        if (!file) return;
        if (file.size > 40 * 1024 * 1024) { ctx.announce(t('photoTooBig')); return; }
        file.arrayBuffer().then(function (buf) {
          var meta = readMeta(new Uint8Array(buf)), url = URL.createObjectURL(file), im = new Image();
          im.onload = function () {
            var k = Math.min(1, SRC_MAX / Math.max(im.naturalWidth, im.naturalHeight)), c = newCanvas(im.naturalWidth * k, im.naturalHeight * k);
            var cg = c.getContext('2d'); cg.imageSmoothingQuality = 'high'; cg.drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
            var id = nid('m'); MEDIA[id] = { canvas: c };
            var name = String(file.name || '').replace(/\.[a-z0-9]+$/i, '').replace(/[_]+/g, ' ').slice(0, 40) || t('myPhoto');
            var p = newPhoto('media:' + id, name, '', c.width, c.height, { gps: meta.gps, date: meta.date, model: meta.model });
            S.photos.push(p); S.cur = S.photos.length - 1; sel = true; tool = 'crop'; ctx.selectTool('crop');
            commit(t('photoAdded', { name: name }));
            if (meta.any) privacyDialog(meta);
          };
          im.onerror = function () { URL.revokeObjectURL(url); ctx.announce(t('photoError')); ctx.setStatus(t('photoError')); };
          im.src = url;
        });
      });
    }
    function metaList(m) {
      var ul = h('ul', { class: 'igph-meta' });
      [['gps', 'metaGps'], ['date', 'metaDate'], ['model', 'metaModel']].forEach(function (x) { ul.appendChild(h('li', { 'data-on': String(!!m[x[0]]) }, h('span', { class: 'igph-mark', 'aria-hidden': 'true', text: m[x[0]] ? '!' : '✓' }), t(x[1]) + ': ' + (m[x[0]] ? t('metaYes') : t('metaNo')))); });
      return ul;
    }
    var privDlg = null, guideSel = null;
    function privacyDialog(meta) {
      if (!privDlg) privDlg = ctx.dialog(t('privacyTitle'));
      var dlg = privDlg; ctx.clear(dlg.body);
      dlg.body.appendChild(h('p', { text: t('privacyIntro') }));
      dlg.body.appendChild(metaList(meta));
      if (meta.gps) dlg.body.appendChild(h('p', { class: 'igs-note', text: t('privacyGps') }));
      dlg.body.appendChild(h('p', { text: t('privacyExport') }));
      var ok = ctx.button(t('understood'), { class: 'igs-primary', onClick: function () { dlg.close(); } });
      dlg.body.appendChild(h('div', { class: 'igs-actions' }, ok));
      dlg.open(vp);
    }

    /* ---------- Hoja de contactos ---------- */
    function sheetItems() {
      var items = [];
      S.photos.forEach(function (p, i) {
        if (S.sheetMode === 'versions') p.versions.forEach(function (v, j) { items.push({ p: p, v: v, label: (i + 1) + '.' + (j + 1) + ' · ' + v.name }); });
        else items.push({ p: p, v: p.versions[p.cur], label: (i + 1) + ' · ' + p.name });
      });
      return items;
    }
    function contactSheet(width) {
      var items = sheetItems(); if (!items.length) return null;
      var cols = items.length <= 4 ? items.length : items.length <= 9 ? 3 : 4, rows = Math.ceil(items.length / cols);
      var W = Math.max(600, Math.round(width || 1600)), pad = Math.round(W * 0.03), cell = (W - pad * (cols + 1)) / cols, ih = cell * 0.72, lh = Math.max(16, Math.round(W * 0.016));
      var top = pad + lh * 2.4, H = Math.round(top + rows * (ih + lh * 2.6 + pad) + pad * 0.5);
      var c = newCanvas(W, H), gg = c.getContext('2d'), dark = S.sheetBg === 'dark';
      gg.fillStyle = dark ? '#16191d' : '#ffffff'; gg.fillRect(0, 0, W, H);
      gg.fillStyle = dark ? '#f2f2f2' : '#172b42'; gg.font = '700 ' + Math.round(lh * 1.35) + 'px "Atkinson Hyperlegible", system-ui, sans-serif'; gg.textBaseline = 'top'; gg.textAlign = 'left';
      gg.fillText(S.title || t('seriesDefault'), pad, pad);
      items.forEach(function (it, i) {
        var col = i % cols, row = Math.floor(i / cols), x = pad + col * (cell + pad), y = top + row * (ih + lh * 2.6 + pad);
        gg.fillStyle = dark ? '#262a30' : '#eef2f6'; gg.fillRect(x, y, cell, ih);
        var th = renderOutput(it.p, it.v, Math.round(Math.max(cell, ih)));
        if (th) { var s = Math.min(cell / th.width, ih / th.height), tw = th.width * s, tht = th.height * s; gg.drawImage(th, x + (cell - tw) / 2, y + (ih - tht) / 2, tw, tht); }
        gg.fillStyle = dark ? '#f2f2f2' : '#172b42'; gg.font = '700 ' + lh + 'px "Atkinson Hyperlegible", system-ui, sans-serif';
        gg.fillText(fitText(gg, it.label, cell), x, y + ih + lh * 0.45);
        gg.fillStyle = dark ? '#c9ced6' : '#44586c'; gg.font = '500 ' + Math.round(lh * 0.85) + 'px "Atkinson Hyperlegible", system-ui, sans-serif';
        gg.fillText(fitText(gg, ratioName(it.v.ratio) + ' · ' + Math.round(it.v.crop.w * it.p.w) + ' × ' + Math.round(it.v.crop.h * it.p.h) + ' px', cell), x, y + ih + lh * 1.6);
      });
      return c;
    }
    function fitText(gg, s, w) { s = String(s); if (gg.measureText(s).width <= w) return s; while (s.length > 1 && gg.measureText(s + '…').width > w) s = s.slice(0, -1); return s + '…'; }

    /* ---------- Reto del color: cuánto color de la serie hay en cada foto ---------- */
    function colourShare(p, v, hex) {
      var th = thumb(p, v, 96); if (!th) return null;
      var d = th.getContext('2d').getImageData(0, 0, th.width, th.height).data, tgt = hexRgb(hex), th0 = rgbHsv(tgt[0], tgt[1], tgt[2]), n = 0, hit = 0;
      for (var o = 0; o < d.length; o += 16) { var hsv = rgbHsv(d[o], d[o + 1], d[o + 2]); n++; var dh = Math.abs(hsv[0] - th0[0]); dh = Math.min(dh, 360 - dh); if (th0[1] < 0.15 ? (hsv[1] < 0.15 && Math.abs(hsv[2] - th0[2]) < 0.2) : (dh < 22 && hsv[1] > 0.3 && hsv[2] > 0.25)) hit++; }
      return n ? hit / n : 0;
    }

    /* ---------- Paneles ---------- */
    function keepFocus(fn) {
      var a = D.activeElement, key = a && a.dataset ? a.dataset.k : null, insp = ctx.inspector.contains(a), str = ctx.structure.contains(a); fn();
      if (key) { var n = (insp ? ctx.inspector : str ? ctx.structure : D).querySelector('[data-k="' + key + '"]'); if (n) { try { n.focus({ preventScroll: true }); } catch (_) { n.focus(); } } }
    }
    function tag(el, key) {
      if (el.tagName === 'FIELDSET') Array.prototype.forEach.call(el.querySelectorAll('input'), function (i) { i.dataset.k = key + '-' + i.value; });
      else (el.input || el).dataset.k = key;
      return el;
    }
    function syncField(key, val) { var n = ctx.inspector.querySelector('[data-k="' + key + '"]'); if (n && D.activeElement !== n) { n.value = String(val); n.dispatchEvent(new Event('input')); } }
    function renderSide() { keepFocus(function () { renderStructure(); renderInspector(); }); if (guideSel) syncToolbar(); ctx.setSummary(summary()); }
    function renderStructure() {
      var out = [h('h3', { text: t('seriesList', { n: S.photos.length, max: MAX_PHOTOS }) })];
      var ul = h('ul', { class: 'igs-list igph-list' });
      S.photos.forEach(function (p, i) {
        var b = h('button', { type: 'button', 'aria-current': String(i === S.cur && sel), 'data-k': 'ph' + p.id }, thumbNode(p, p.versions[p.cur]), h('span', { text: p.name }), h('small', { text: t('nVersions', { n: p.versions.length }) }));
        b.addEventListener('click', function () { S.cur = i; sel = true; pendingTap = null; renderSide(); draw(); ctx.announce(t('selectedPhoto', { name: p.name, v: version(p).name })); });
        ul.appendChild(h('li', null, b));
      });
      out.push(ul);
      var prSel = h('select', { 'aria-label': t('addPractice'), 'data-k': 'addpr' }, h('option', { value: '', text: t('addPracticeShort') }));
      PRACTICE.forEach(function (k) { prSel.appendChild(h('option', { value: k, text: t('pr_' + k) })); });
      prSel.addEventListener('change', function () { if (prSel.value) addPractice(prSel.value); });
      out.push(h('div', { class: 'igs-actions' }, ctx.button(t('openPhoto'), { icon: 'folder', class: 'igs-primary', onClick: openPhoto })));
      out.push(h('label', { class: 'igs-inline-select igph-addpr' }, h('span', { class: 'igs-sr', text: t('addPractice') }), prSel));
      var p = photo();
      if (p) {
        out.push(h('div', { class: 'igs-actions' }, ctx.button(t('photoUp'), { icon: 'undo', onClick: function () { movePhoto(-1); } }), ctx.button(t('photoDown'), { icon: 'redo', onClick: function () { movePhoto(1); } }), ctx.button(t('delPhoto'), { icon: 'trash', class: 'igs-danger', onClick: delPhoto })));
        out.push(h('h3', { text: t('versionsOf', { n: p.versions.length }) }));
        var vl = h('ul', { class: 'igs-list igph-list' });
        p.versions.forEach(function (v, j) {
          var b = h('button', { type: 'button', 'aria-current': String(j === p.cur && sel), 'data-k': 'v' + v.id }, thumbNode(p, v), h('span', { text: v.name }), h('small', { text: ratioName(v.ratio) }));
          b.addEventListener('click', function () { p.cur = j; sel = true; pendingTap = null; renderSide(); draw(); ctx.announce(t('versionOf', { n: j + 1, total: p.versions.length, name: v.name })); });
          vl.appendChild(h('li', null, b));
        });
        out.push(vl, h('div', { class: 'igs-actions' }, ctx.button(t('newVersion'), { icon: 'copy', onClick: addVersion }), ctx.button(t('delVersion'), { icon: 'trash', class: 'igs-danger', onClick: delVersion })));
      }
      if (sel && p) out.push(ctx.button(t('seriesProps'), { icon: 'layers', onClick: function () { sel = false; renderSide(); ctx.announce(t('deselectedSeries')); } }));
      ctx.setStructure(out);
    }
    function section(title, open, nodes) {
      var d = h('details', { class: 'igph-sec' }); if (open) d.open = true;
      d.appendChild(h('summary', { text: title })); var body = h('div', { class: 'igph-sec-body' }); nodes.forEach(function (n) { if (n) body.appendChild(n); }); d.appendChild(body);
      return d;
    }
    var openSecs = { photo: true, crop: true, guides: true, light: true, hist: true, compare: true };
    function trackOpen(d, key) { d.open = !!openSecs[key]; d.addEventListener('toggle', function () { openSecs[key] = d.open; }); return d; }
    var histBox = null;
    function renderInspector() {
      var out = [], p = photo(), v = version(p);
      if (!sel || !p) { out = seriesInspector(); ctx.setInspector(out); return; }
      /* Foto y privacidad */
      var isUser = String(p.src).indexOf('media:') === 0, privacy;
      if (isUser) {
        var any = p.meta && (p.meta.gps || p.meta.date || p.meta.model);
        privacy = h('div', { class: 'igs-result', 'data-kind': any ? 'bad' : 'ok' }, h('strong', { text: any ? t('metaFound') : t('metaNone') }), metaList(p.meta || {}), h('p', { class: 'igs-muted', text: t('metaStripped') }));
      } else privacy = h('p', { class: 'igs-result', 'data-kind': 'ok' }, h('strong', { text: t('practiceNote') }), t('practiceNoMeta'));
      out.push(trackOpen(section(t('secPhoto'), true, [
        tag(F.text(t('photoName'), p.name, { max: 40, onChange: function (val) { p.name = String(val).trim().slice(0, 40) || p.name; commit(t('renamed')); } }), 'pname'),
        tag(F.text(t('altText'), p.alt, { multiline: true, max: 300, onChange: function (val) { p.alt = String(val).slice(0, 300); commit(t('altChanged')); } }), 'palt'),
        h('p', { class: 'igs-muted', text: t('altHelp') }), privacy
      ]), 'photo'));
      /* Encuadre */
      var ratioOpts = RATIOS.map(function (r) { return [r, ratioName(r)]; }); if (RATIOS.indexOf(v.ratio) < 0) ratioOpts.push([v.ratio, ratioName(v.ratio)]);
      var c = v.crop;
      function px(key, label, val, max, set) { return tag(F.number(label, Math.round(val), { unit: 'px', min: 0, max: max, step: 1, onChange: function (n) { set(n); fitCrop(p, v, key === 'h' ? 'h' : 'w'); commit(t('cropChanged')); } }), 'crop' + key); }
      out.push(trackOpen(section(t('secCrop'), true, [
        tag(F.text(t('versionName'), v.name, { max: 40, onChange: function (val) { v.name = String(val).trim().slice(0, 40) || v.name; commit(t('renamed')); } }), 'vname'),
        tag(F.select(t('ratio'), v.ratio, ratioOpts, { onChange: function (r) { v.ratio = r; fitCrop(p, v); commit(t('ratioSet', { r: ratioName(r) })); } }), 'ratio'),
        h('div', { class: 'igph-grid2' },
          px('x', 'x', c.x * p.w, p.w, function (n) { c.x = n / p.w; }), px('y', 'y', c.y * p.h, p.h, function (n) { c.y = n / p.h; }),
          px('w', t('width'), c.w * p.w, p.w, function (n) { var cx = c.x; c.w = Math.max(20, n) / p.w; c.x = cx; }), px('h', t('height'), c.h * p.h, p.h, function (n) { c.h = Math.max(20, n) / p.h; })),
        tag(F.range(t('straighten'), v.angle, { min: -45, max: 45, step: 0.1, unit: '°', format: function (n) { return IG.num(n, 1); }, onInput: function (n) { v.angle = n; fitCrop(p, v); frameCache.key = ''; draw(); }, onChange: function (n) { v.angle = n; fitCrop(p, v); commit(t('straightened', { a: IG.num(n, 1) })); } }), 'angle'),
        h('div', { class: 'igph-grid2' },
          tag(F.check(t('flipH'), v.flipH, { onChange: function (b) { v.flipH = !!b; commit(t('flippedH')); } }), 'fliph'),
          tag(F.check(t('flipV'), v.flipV, { onChange: function (b) { v.flipV = !!b; commit(t('flippedV')); } }), 'flipv')),
        h('div', { class: 'igs-actions' }, ctx.button(t('swapRatio'), { icon: 'rotate', onClick: swapRatio }), ctx.button(t('resetCrop'), { icon: 'undo', onClick: resetCrop })),
        h('p', { class: 'igs-muted', text: t('cropHelp') })
      ]), 'crop'));
      /* Guías */
      var gnodes = [tag(F.choice(t('guide'), v.guide, GUIDES.map(function (x) { return [x, t('guide_' + x)]; }), { onChange: function (x) { v.guide = x; commit(t('guideNow', { g: t('guide_' + x) })); } }), 'guide')];
      if (v.guide === 'spiral') gnodes.push(tag(F.select(t('spiralOrient'), String(v.spiral), [0, 1, 2, 3].map(function (i) { return [String(i), t('spiral_' + i)]; }), { onChange: function (x) { v.spiral = +x; commit(t('guideNow', { g: t('guide_spiral') + ' · ' + t('spiral_' + x) })); } }), 'spiral'));
      gnodes.push(tag(F.check(t('guidesOnResult'), guidesOnResult, { onChange: function (b) { guidesOnResult = !!b; draw(); } }), 'gres'));
      gnodes.push(h('p', { class: 'igs-muted', text: t('guideHelp_' + v.guide) }));
      out.push(trackOpen(section(t('secGuides'), true, gnodes), 'guides'));
      /* Luz y color */
      var lnodes = ADJ.map(function (k) {
        return tag(F.range(t('adj_' + k), v.adj[k], { min: -100, max: 100, step: 1, format: k === 'exposure' ? function (n) { return (n > 0 ? '+' : '') + IG.num(n / 50, 2) + ' EV'; } : function (n) { return (n > 0 ? '+' : '') + n; },
          onInput: function (n) { v.adj[k] = n; frameCache.key = ''; outCache.key = ''; draw(); },
          onChange: function (n) { v.adj[k] = n; ctx.commit(t('adjChanged', { what: t('adj_' + k) })); updateAfterAdjust(); } }), 'adj' + k);
      });
      lnodes.push(tag(F.check(t('bw'), v.bw, { onChange: function (b) { v.bw = !!b; commit(t(b ? 'bwOn' : 'bwOff')); } }), 'bw'));
      lnodes.push(h('div', { class: 'igs-actions' }, ctx.button(t('autoLight'), { icon: 'sparkle', onClick: autoLight }), ctx.button(t('resetLight'), { icon: 'undo', onClick: resetLight })));
      lnodes.push(h('p', { class: 'igs-muted', text: t('lightHelp') }));
      out.push(trackOpen(section(t('secLight'), true, lnodes), 'light'));
      /* Comparar */
      out.push(trackOpen(section(t('secCompare'), true, [
        tag(F.choice(t('compareLabel'), compare, [['after', t('compare_after')], ['before', t('compare_before')], ['split', t('compare_split')]], { onChange: function (m) { if (m === 'split' && tool === 'crop') { ctx.selectTool('view'); } setCompare(m); } }), 'compare'),
        tag(F.range(t('splitPos'), split, { min: 10, max: 90, step: 5, unit: '%', onInput: function (n) { split = n; draw(); } }), 'split'),
        h('p', { class: 'igs-muted', text: t('compareHelp') })
      ]), 'compare'));
      /* Histograma */
      histBox = h('div', { class: 'igph-hist' });
      out.push(trackOpen(section(t('secHist'), true, [histBox,
        tag(F.check(t('showClip'), showClip, { onChange: function (b) { showClip = !!b; frameCache.key = ''; outCache.key = ''; draw(); } }), 'clip'),
        h('p', { class: 'igs-muted', text: t('histHelp') })]), 'hist'));
      fillHist();
      out.push(h('div', { class: 'igs-actions' }, ctx.button(t('newVersion'), { icon: 'copy', onClick: addVersion }), ctx.button(t('delVersion'), { icon: 'trash', class: 'igs-danger', onClick: delVersion })));
      ctx.setInspector(out);
    }
    function updateAfterAdjust() { thumbCache = pruneThumbs(); keepFocus(function () { renderStructure(); }); fillHist(); ctx.setSummary(summary()); ctx.announce(t('adjDone')); }
    function pruneThumbs() { var keys = Object.keys(thumbCache); if (keys.length < 300) return thumbCache; return {}; }
    function fillHist() {
      if (!histBox) return; ctx.clear(histBox);
      var p = photo(), v = version(p); if (!v) return;
      var c = renderOutput(p, v, 360); if (!c) return;
      var hs = histogram(c.getContext('2d').getImageData(0, 0, c.width, c.height));
      var W = 256, H = 90, NS = 'http://www.w3.org/2000/svg', svg = D.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('class', 'igph-hist-svg'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('preserveAspectRatio', 'none');
      var max = 1; ['L', 'R', 'G', 'B'].forEach(function (k) { for (var i = 2; i < 254; i++) max = Math.max(max, hs[k][i]); });
      function path(arr, fill) {
        var d = 'M0,' + H; for (var i = 0; i < 256; i++) d += 'L' + i + ',' + (H - Math.min(H, arr[i] / max * (H - 4))).toFixed(1); d += 'L255,' + H + 'Z';
        var pe = D.createElementNS(NS, 'path'); pe.setAttribute('d', d); pe.setAttribute('class', fill); svg.appendChild(pe);
      }
      path(hs.L, 'igph-hL'); path(hs.R, 'igph-hR'); path(hs.G, 'igph-hG'); path(hs.B, 'igph-hB');
      histBox.appendChild(svg);
      var hiP = hs.hi * 100, loP = hs.lo * 100, warns = [];
      if (loP >= 2) warns.push(t('histLo', { p: IG.num(loP, 1) })); if (hiP >= 1) warns.push(t('histHi', { p: IG.num(hiP, 1) }));
      histBox.appendChild(h('p', { class: 'igs-result', 'data-kind': warns.length ? 'bad' : 'ok' }, h('strong', { text: warns.length ? t('histWarn') : t('histOk') }), (warns.length ? warns.join(' ') + ' ' : '') + t('histMean', { p: IG.num(hs.mean * 100, 0) })));
      /* tabla alternativa: porcentaje de píxeles por zona tonal y canal */
      var zones = [[0, 25], [26, 76], [77, 178], [179, 229], [230, 255]], tb = h('table', { class: 'igs-table' }, h('caption', { text: t('histTable') }));
      tb.appendChild(h('thead', null, h('tr', null, h('th', { scope: 'col', text: t('zone') }), h('th', { scope: 'col', text: t('lum') }), h('th', { scope: 'col', text: 'R' }), h('th', { scope: 'col', text: 'G' }), h('th', { scope: 'col', text: 'B' }))));
      var tbody = h('tbody');
      zones.forEach(function (z, zi) {
        function pc(arr) { var s = 0; for (var i = z[0]; i <= z[1]; i++) s += arr[i]; return IG.num(s / hs.n * 100, 1) + ' %'; }
        tbody.appendChild(h('tr', null, h('th', { scope: 'row', text: t('zone_' + zi) }), h('td', { class: 'igs-numcell', text: pc(hs.L) }), h('td', { class: 'igs-numcell', text: pc(hs.R) }), h('td', { class: 'igs-numcell', text: pc(hs.G) }), h('td', { class: 'igs-numcell', text: pc(hs.B) })));
      });
      tb.appendChild(tbody);
      histBox.appendChild(h('details', { class: 'igph-tabledet' }, h('summary', { text: t('histTableShow') }), h('div', { class: 'igs-table-wrap' }, tb)));
      lastHist = hs;
    }
    var lastHist = null;
    function seriesInspector() {
      var out = [h('h4', { text: t('seriesProps') })];
      out.push(tag(F.text(t('seriesTitle'), S.title, { max: 60, onChange: function (val) { S.title = String(val).slice(0, 60); commit(t('renamed')); } }), 'stitle'));
      out.push(tag(F.color(t('seriesColour'), S.theme, { onChange: function (val) { S.theme = val; commit(t('colourChanged')); } }), 'stheme'));
      out.push(tag(F.check(t('useTheme'), !!S.useTheme, { onChange: function (b) { S.useTheme = !!b; commit(t('colourChanged')); } }), 'susetheme'));
      /* Retos del estudio anterior, con su estado */
      out.push(h('h4', { text: t('challenges') }));
      var shares = S.photos.map(function (p) { var sh = colourShare(p, p.versions[p.cur], S.theme); return sh == null ? 0 : sh; });
      var withColour = shares.filter(function (x) { return x >= 0.08; }).length, maxV = S.photos.reduce(function (a, p) { return Math.max(a, p.versions.length); }, 0);
      var ch1 = withColour >= 5, ch2 = maxV >= 10;
      out.push(h('ul', { class: 'igph-challenges' },
        h('li', { 'data-ok': String(ch1) }, h('span', { class: 'igph-mark', 'aria-hidden': 'true', text: ch1 ? '✓' : '·' }), h('strong', { text: t('ch1') }), ' ', t('ch1State', { n: withColour })),
        h('li', { 'data-ok': String(ch2) }, h('span', { class: 'igph-mark', 'aria-hidden': 'true', text: ch2 ? '✓' : '·' }), h('strong', { text: t('ch2') }), ' ', t('ch2State', { n: maxV }))));
      if (S.photos.length) {
        var tb = h('table', { class: 'igs-table' }, h('caption', { text: t('colourTable') }), h('thead', null, h('tr', null, h('th', { scope: 'col', text: t('photo') }), h('th', { scope: 'col', text: t('colourShare') }))));
        var tbody = h('tbody'); S.photos.forEach(function (p, i) { tbody.appendChild(h('tr', null, h('th', { scope: 'row', text: (i + 1) + '. ' + p.name }), h('td', { class: 'igs-numcell', text: IG.num(shares[i] * 100, 0) + ' %' }))); });
        tb.appendChild(tbody); out.push(h('div', { class: 'igs-table-wrap' }, tb));
        out.push(h('p', { class: 'igs-muted', text: t('colourHelp') }));
      }
      out.push(h('h4', { text: t('sheetTitle') }));
      out.push(tag(F.choice(t('sheetMode'), S.sheetMode, [['photos', t('sheet_photos')], ['versions', t('sheet_versions')]], { onChange: function (m) { S.sheetMode = m; commit(t('changed')); } }), 'smode'));
      out.push(tag(F.choice(t('sheetBg'), S.sheetBg, [['light', t('sheet_light')], ['dark', t('sheet_dark')]], { onChange: function (m) { S.sheetBg = m; commit(t('changed')); } }), 'sbg'));
      out.push(h('div', { class: 'igs-actions' }, ctx.button(t('viewSheet'), { icon: 'grid', onClick: function () { ctx.selectTool('sheet'); } })));
      out.push(h('h4', { text: t('privacyTitle') }));
      out.push(h('p', { class: 'igs-note', text: t('privacySeries') }));
      out.push(h('p', { class: 'igs-muted', text: t('projectNote', { n: SAVE_MAX }) }));
      return out;
    }
    function summary() {
      var p = photo(), v = version(p);
      if (tool === 'sheet') return t('summarySheet', { title: S.title || t('seriesDefault'), n: sheetItems().length }) + ' ' + sheetItems().map(function (it) { return it.label; }).join('; ') + '.';
      if (!p) return t('emptyStage');
      var parts = [t('summaryBase', { title: S.title || t('seriesDefault'), n: S.photos.length, i: S.cur + 1, name: p.name, vi: p.cur + 1, vn: p.versions.length, v: v.name })];
      if (p.alt) parts.push(t('summaryAlt', { alt: p.alt }));
      parts.push(cropText(p, v) + (v.angle ? ' ' + t('straightened', { a: IG.num(v.angle, 1) }) + '.' : '') + (v.flipH ? ' ' + t('flippedH') + '.' : '') + (v.flipV ? ' ' + t('flippedV') + '.' : ''));
      parts.push(t('guideNow', { g: t('guide_' + v.guide) }) + '.');
      var adj = ADJ.filter(function (k) { return v.adj[k]; }).map(function (k) { return t('adj_' + k) + ' ' + (v.adj[k] > 0 ? '+' : '') + (k === 'exposure' ? IG.num(v.adj[k] / 50, 2) + ' EV' : v.adj[k]); });
      if (v.bw) adj.push(t('bw'));
      parts.push(adj.length ? t('summaryAdj', { list: adj.join(', ') }) : t('summaryNoAdj'));
      if (compare !== 'after') parts.push(t('compare_' + compare) + '.');
      if (lastHist) parts.push(t('histMean', { p: IG.num(lastHist.mean * 100, 0) }) + (lastHist.lo >= 0.02 ? ' ' + t('histLo', { p: IG.num(lastHist.lo * 100, 1) }) : '') + (lastHist.hi >= 0.01 ? ' ' + t('histHi', { p: IG.num(lastHist.hi * 100, 1) }) : ''));
      return parts.join(' ');
    }

    /* ---------- Herramientas ---------- */
    guideSel = h('select', { 'aria-label': t('guide') });
    GUIDES.forEach(function (x) { guideSel.appendChild(h('option', { value: x, text: t('guide_' + x) })); });
    guideSel.addEventListener('change', function () { var v = version(); if (!v) return; v.guide = guideSel.value; commit(t('guideNow', { g: t('guide_' + v.guide) })); });
    ctx.setTools([
      { id: 'crop', label: t('toolCrop'), icon: 'corners' },
      { id: 'view', label: t('toolView'), icon: 'eye' },
      { id: 'sheet', label: t('toolSheet'), icon: 'grid' },
      { separator: true },
      { id: 'open', label: t('openPhoto'), icon: 'folder', action: openPhoto, primary: true },
      { node: h('label', { class: 'igs-inline-select' }, h('span', { text: t('guide') }), guideSel) },
      { id: 'compare', label: t('compareBtn'), icon: 'eye', action: function () { setCompare(compare === 'after' ? 'before' : 'after'); } },
      { id: 'newv', label: t('newVersion'), icon: 'copy', action: addVersion, level: 'more' },
      { id: 'rotl', label: t('rotLeft'), icon: 'rotate', level: 'more', action: function () { var v = version(); if (v) setAngle(v.angle - 1); } },
      { id: 'rotr', label: t('rotRight'), icon: 'rotate', level: 'more', action: function () { var v = version(); if (v) setAngle(v.angle + 1); } },
      { id: 'fliph', label: t('flipH'), icon: 'scale', level: 'more', action: function () { flip('H'); } },
      { id: 'swap', label: t('swapRatio'), icon: 'rotate', level: 'more', action: swapRatio },
      { id: 'auto', label: t('autoLight'), icon: 'sparkle', level: 'more', action: autoLight }
    ], { initial: 'crop' });
    var cmpBtn = null; Array.prototype.forEach.call(ctx.toolbar.querySelectorAll('.igs-btn'), function (b) { if (b.textContent.trim() === t('compareBtn')) { cmpBtn = b; b.dataset.igph = 'compare'; b.setAttribute('aria-pressed', 'false'); } });
    void cmpBtn;
    function syncToolbar() { var v = version(); if (v) guideSel.value = v.guide; syncCompare(); }

    /* ---------- Exportaciones: siempre reencodadas con canvas (sin Exif ni GPS) ---------- */
    function base() { var p = photo(), v = version(p); return (LANG === 'en' ? 'photo-' : 'foto-') + slug(p ? p.name + '-' + v.name : 'serie') + '-' + ctx.stamp(); }
    function slug(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'foto'; }
    function exportPhoto(type) {
      var p = photo(), v = version(p); if (!v) { ctx.announce(t('emptyStage')); return; }
      var c = renderOutput(p, v, 0); if (!c) { ctx.announce(t('loadingPhoto')); return; }
      /* marca discreta en una franja bajo la foto (no tapa nada) y reencodado limpio: sin Exif, GPS ni fecha */
      c = ctx.canvasWithCredit(c, '#ffffff');
      c.toBlob(function (b) { if (!b) { ctx.announce(t('exportError')); return; } ctx.download(b, base() + (type === 'image/jpeg' ? '.jpg' : '.png')); ctx.setStatus(t('exportedClean')); }, type, 0.92);
    }
    ctx.addExport(t('exportJpg'), function () { exportPhoto('image/jpeg'); });
    ctx.addExport(t('exportPng'), function () { exportPhoto('image/png'); });
    ctx.addExport(t('exportSheet'), function () {
      var c = contactSheet(2000); if (!c) { ctx.announce(t('emptyStage')); return; }
      ctx.canvasBlob(ctx.canvasWithCredit(c, S.sheetBg === 'dark' ? '#16191d' : '#ffffff')).then(function (b) { ctx.download(b, (LANG === 'en' ? 'contact-sheet-' : 'hoja-de-contactos-') + ctx.stamp() + '.png'); });
    });
    ctx.command('openphoto', t('openPhoto'), t('privacyShort'), openPhoto);
    ctx.command('compare', t('compareBtn'), 'B', function () { setCompare(compare === 'after' ? 'before' : 'after'); });
    ctx.command('split', t('compare_split'), t('secCompare'), function () { ctx.selectTool('view'); setCompare('split'); renderSide(); });
    ctx.command('newversion', t('newVersion'), t('versionsHint'), addVersion);
    ctx.command('sheet', t('toolSheet'), t('sheetTitle'), function () { ctx.selectTool('sheet'); });
    ctx.command('auto', t('autoLight'), t('secLight'), autoLight);
    ctx.command('resetlight', t('resetLight'), t('secLight'), resetLight);
    ctx.command('fliph', t('flipH'), 'H', function () { flip('H'); });
    ctx.command('flipv', t('flipV'), 'V', function () { flip('V'); });
    ctx.command('series', t('seriesProps'), t('challenges'), function () { sel = false; renderSide(); });

    /* ---------- Puntos de partida ---------- */
    function blank() { return { v: 1, title: '', theme: '#e9b500', useTheme: false, sheetMode: 'photos', sheetBg: 'light', photos: [], cur: 0 }; }
    function setCrop(p, v, x, y, w, hh, ratio) { v.crop = { x: x, y: y, w: w, h: hh }; v.ratio = ratio || 'free'; fitCrop(p, v); }
    function ex(id) {
      S = blank(); seq = 0; thumbCache = {}; MEDIA = {};
      if (id === 'colour') {
        S.title = t('exColourTitle'); S.theme = '#e9b500'; S.useTheme = true;
        PRACTICE.forEach(function (k) { var p = practicePhoto(k, '#e9b500'); p.name = t('exColourN_' + k); S.photos.push(p); });
        var lp = S.photos[0]; setCrop(lp, lp.versions[0], 0, 0.3, 1, 0.7, '16:9'); lp.versions[0].guide = 'thirds';
        var sp = S.photos[1]; setCrop(sp, sp.versions[0], 0.28, 0.45, 0.5, 0.5, '4:5'); sp.versions[0].adj.vignette = 25;
        var st = S.photos[2]; setCrop(st, st.versions[0], 0.45, 0.1, 0.5, 0.85, '4:5');
        var pk = S.photos[3]; setCrop(pk, pk.versions[0], 0.5, 0.05, 0.45, 0.6, '1:1');
        var wn = S.photos[4]; setCrop(wn, wn.versions[0], 0.2, 0.15, 0.62, 0.78, '4:3'); wn.versions[0].adj.saturation = 15;
        S.sheetMode = 'photos';
      } else if (id === 'ten') {
        S.title = t('exTenTitle'); S.sheetMode = 'versions';
        var p = practicePhoto('stilllife'); p.name = t('exTenPhoto'); S.photos.push(p);
        var crops = [[0, 0, 1, 1, 'free', 'thirds'], [0.25, 0.5, 0.5, 0.5, '1:1', 'centre'], [0.3, 0.52, 0.34, 0.3, '4:3', 'thirds'], [0.15, 0.3, 0.62, 0.68, '4:5', 'phi'],
          [0.55, 0.45, 0.35, 0.52, '9:16', 'thirds'], [0, 0.45, 1, 0.55, '16:9', 'thirds'], [0.35, 0.58, 0.2, 0.16, '3:2', 'spiral'], [0.1, 0.35, 0.7, 0.62, '3:2', 'diagonals'],
          [0.62, 0.55, 0.28, 0.3, '1:1', 'centre'], [0.2, 0.2, 0.6, 0.8, '4:5', 'spiral']];
        p.versions = crops.map(function (cr, i) { var v = newVersion(t('exTen_' + i)); v.guide = cr[5]; setCrop(p, v, cr[0], cr[1], cr[2], cr[3], cr[4]); return v; });
        p.versions[6].adj.contrast = 20; p.versions[7].angle = 3; fitCrop(p, p.versions[7]); p.versions[9].bw = true; p.cur = 0;
      } else if (id === 'play') {
        S.title = t('exPlayTitle');
        var pp = practicePhoto('park'); pp.name = t('exPlayPhoto'); S.photos.push(pp);
        pp.versions = ['exPlay_0', 'exPlay_1', 'exPlay_2', 'exPlay_3'].map(function (k) { var v = newVersion(t(k)); v.guide = 'thirds'; return v; });
        setCrop(pp, pp.versions[1], 0.55, 0.1, 0.3, 0.45, '1:1');
        var sq = practicePhoto('window'); sq.name = t('exPlayPhoto2'); S.photos.push(sq);
      } else if (id === 'portrait') {
        S.title = t('exPortraitTitle');
        var po = practicePhoto('stilllife', '#d1572a'); po.name = t('exPortraitPhoto'); S.photos.push(po);
        var v1 = po.versions[0]; v1.name = t('exPortrait_0'); setCrop(po, v1, 0.22, 0.4, 0.5, 0.6, '4:5'); v1.guide = 'thirds'; v1.adj.vignette = 35; v1.adj.contrast = 10;
        var v2 = newVersion(t('exPortrait_1')); setCrop(po, v2, 0.05, 0.05, 0.9, 0.95, '4:5'); v2.guide = 'phi'; po.versions.push(v2);
        var v3 = newVersion(t('exPortrait_2')); setCrop(po, v3, 0.3, 0.55, 0.35, 0.3, '1:1'); v3.guide = 'centre'; v3.adj.saturation = -30; v3.adj.shadows = 20; po.versions.push(v3);
      } else if (id === 'light') {
        S.title = t('exLightTitle');
        var dk = practicePhoto('landscape', null, true); dk.name = t('exLightPhoto'); S.photos.push(dk);
        dk.versions[0].name = t('exLight_0'); dk.versions[0].guide = 'thirds';
        var fixd = newVersion(t('exLight_1')); fixd.adj = { exposure: 60, contrast: 22, highlights: -20, shadows: 30, saturation: 18, temperature: 20, tint: 0, vignette: 0 }; dk.versions.push(fixd);
        var st2 = practicePhoto('street'); st2.name = t('exLightPhoto2'); S.photos.push(st2);
      }
      S.cur = 0; sel = S.photos.length > 0; compare = 'after'; pendingTap = null;
      if (id === 'light') { S.photos[0].cur = 0; }
      renderSide(); syncToolbar(); draw();
    }

    /* ---------- Guardar: las fotos propias viajan en el archivo, reducidas y sin metadatos ---------- */
    function packMedia(st) {
      var media = {}, total = 0, used = {};
      st.photos.forEach(function (p) { var sp = String(p.src).split(':'); if (sp[0] === 'media') used[sp[1]] = 1; });
      function pack(maxL, q) {
        media = {}; total = 0;
        Object.keys(used).forEach(function (id) {
          var m = MEDIA[id]; if (!m || !m.canvas) return; var c = m.canvas;
          /* la foto ya venía de un proyecto y cabe: se guarda tal cual (ida y vuelta idéntica, sin perder calidad) */
          if (m.data && Math.max(c.width, c.height) <= maxL) { media[id] = m.data; total += m.data.length; return; }
          var k = Math.min(1, maxL / Math.max(c.width, c.height)), o = newCanvas(c.width * k, c.height * k);
          o.getContext('2d').drawImage(c, 0, 0, o.width, o.height); media[id] = o.toDataURL('image/jpeg', q); total += media[id].length;
        });
      }
      pack(SAVE_MAX, 0.85); var reduced = false;
      if (total > SAVE_LIMIT) { pack(1200, 0.8); reduced = true; }
      if (total > SAVE_LIMIT) pack(900, 0.72);
      var n = Object.keys(media).length;
      root.setTimeout(function () { if (n) { var msg = t(reduced ? 'savedReduced' : 'savedPhotos', { n: n, mb: IG.num(total / 1048576, 1) }); ctx.setStatus(msg); ctx.announce(msg); } }, 120);
      return media;
    }
    function wrap(st) {
      Object.defineProperty(st, 'toJSON', { enumerable: false, value: function (key) { var c = Object.assign({}, this); if (key === 'datos') c.media = packMedia(this); return c; } });
      return st;
    }
    function loadMedia(media) {
      Object.keys(media || {}).forEach(function (id) {
        if (MEDIA[id]) return; pendingLoads++;
        var im = new Image(); MEDIA[id] = { canvas: null, data: media[id] };
        im.onload = function () { var c = newCanvas(im.naturalWidth, im.naturalHeight); c.getContext('2d').drawImage(im, 0, 0); MEDIA[id].canvas = c; pendingLoads--; thumbCache = {}; frameCache.key = ''; outCache.key = ''; beforeCache.key = ''; renderSide(); draw(); };
        im.onerror = function () { pendingLoads--; delete MEDIA[id]; };
        im.src = media[id];
      });
    }

    function onTool(id) {
      tool = id; pendingTap = null; vp.dataset.tool = id;
      if (id === 'crop' && compare === 'split') compare = 'after';
      syncCompare(); draw(); keepFocus(renderInspector); ctx.setSummary(summary());
    }

    S = blank(); renderSide();
    return {
      serialize: function () { var st = JSON.parse(JSON.stringify(Object.assign({}, S, { seq: seq }))); return wrap(st); },
      restore: function (st) {
        var copy = JSON.parse(JSON.stringify(st)); if (copy.media) { MEDIA = {}; thumbCache = {}; loadMedia(copy.media); } delete copy.media;
        seq = Math.max(seq, copy.seq || 0); delete copy.seq; S = copy; S.cur = clamp(S.cur, 0, Math.max(0, S.photos.length - 1));
        if (!S.photos.length) sel = false; frameCache.key = ''; outCache.key = ''; beforeCache.key = ''; pendingTap = null;
        renderSide(); syncToolbar(); draw();
      },
      validate: function (d) {
        function n(v, a, b) { return typeof v === 'number' && isFinite(v) && v >= a && v <= b; }
        if (!d || !Array.isArray(d.photos) || d.photos.length > MAX_PHOTOS || typeof d.title !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(d.theme || '')) return false;
        var media = d.media || {};
        if (Object.keys(media).some(function (k) { return typeof media[k] !== 'string' || !/^data:image\/(jpeg|png|webp);base64,/.test(media[k]); })) return false;
        return d.photos.every(function (p) {
          if (!p || typeof p.id !== 'string' || typeof p.name !== 'string' || typeof p.src !== 'string' || !n(p.w, 1, 20000) || !n(p.h, 1, 20000)) return false;
          var sp = p.src.split(':');
          if (sp[0] === 'practice') { if (PRACTICE.indexOf(sp[1]) < 0 || (sp[2] && !/^#[0-9a-fA-F]{6}$/.test(sp[2]))) return false; }
          else if (sp[0] !== 'media' || !(media[sp[1]] || MEDIA[sp[1]])) return false;
          if (!Array.isArray(p.versions) || !p.versions.length || p.versions.length > MAX_VERSIONS || !n(p.cur, 0, p.versions.length - 1)) return false;
          return p.versions.every(function (v) {
            return v && typeof v.name === 'string' && v.crop && n(v.crop.x, 0, 1) && n(v.crop.y, 0, 1) && n(v.crop.w, 0.001, 1) && n(v.crop.h, 0.001, 1) &&
              /^(free|\d{1,2}:\d{1,2})$/.test(v.ratio) && n(v.angle, -45, 45) && GUIDES.indexOf(v.guide) >= 0 && n(v.spiral, 0, 3) && v.adj &&
              ADJ.every(function (k) { return n(v.adj[k], -100, 100); });
          });
        });
      },
      start: function (id) { if (id === 'empty') { S = blank(); seq = 0; MEDIA = {}; thumbCache = {}; sel = false; renderSide(); draw(); } else ex(id); },
      onTool: onTool,
      onKey: onKey
    };
  }
})(window);
