/* Iris Green · El taller · Estudio de dibujo (R43).
   Lienzo por capas compuesto en PixiJS (opacidad y modos de fusión en la GPU); cada capa es un
   canvas 2D que se hornea desde una lista de marcas, así el deshacer no tiene límite y el proyecto
   cabe en un archivo. Pinceles por sellos con presión e inclinación (Pointer Events Level 3),
   simetría, guías de perspectiva de 1, 2 y 3 puntos, selección, series y retos por niveles.
   Privacidad: nada sale del navegador salvo cuando la persona descarga un archivo.
   No se usa almacenamiento del navegador. */
(function (root) {
  'use strict';
  var IG = root.IGSuite, D = root.document; if (!IG) return;

  var FORMATS = { h: [1200, 800], v: [800, 1200], sq: [1000, 1000] };
  var PALETTE = ['#17202a', '#5d6877', '#b8c2cc', '#ffffff', '#8b1e3f', '#d8434b', '#f08a4b', '#f2c14e',
    '#6c8a2b', '#2e8b57', '#1f7a8c', '#1f5f8b', '#274690', '#5a49a8', '#a8336f', '#8d5b3a'];
  var BLENDS = ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'add'];
  var CANVAS2D_BLEND = { normal: 'source-over', multiply: 'multiply', screen: 'screen', overlay: 'overlay',
    darken: 'darken', lighten: 'lighten', add: 'lighter' };

  /* Pinceles: valores de partida y cuánto manda la presión del lápiz en cada uno. */
  var BRUSHES = {
    pencil: { size: 5, opacity: 1, hardness: 0.78, flow: 0.9, spacing: 0.14, tip: 'grain', pSize: 0.55, pFlow: 0.45, tiltW: 0.5 },
    soft: { size: 30, opacity: 0.6, hardness: 0.14, flow: 0.4, spacing: 0.07, tip: 'soft', pSize: 0.7, pFlow: 0.6, tiltW: 0.2 },
    marker: { size: 18, opacity: 0.72, hardness: 0.92, flow: 1, spacing: 0.1, tip: 'flat', pSize: 0.12, pFlow: 0.1, tiltW: 0.6 },
    water: { size: 46, opacity: 0.5, hardness: 0.06, flow: 0.1, spacing: 0.05, tip: 'water', pSize: 0.5, pFlow: 0.7, tiltW: 0.2 },
    chalk: { size: 26, opacity: 0.88, hardness: 0.55, flow: 0.55, spacing: 0.16, tip: 'chalk', pSize: 0.4, pFlow: 0.75, tiltW: 0.8 },
    air: { size: 64, opacity: 0.6, hardness: 0.02, flow: 0.13, spacing: 0.04, tip: 'soft', pSize: 0.2, pFlow: 0.85, tiltW: 0.1 },
    eraser: { size: 34, opacity: 1, hardness: 0.6, flow: 1, spacing: 0.1, tip: 'soft', pSize: 0.5, pFlow: 0.3, tiltW: 0, erase: true }
  };
  var FREE = ['pencil', 'soft', 'marker', 'water', 'chalk', 'air', 'eraser'];
  var SHAPES = { line: 1, rect: 1, ellipse: 1 };
  var SYMS = ['no', 'v', 'h', 'vh', 'radial', 'kaleido'];
  var GUIDES = ['no', 'grid', 'p1', 'p2', 'p3'];

  /* Los 15 retos del estudio antiguo, con sus niveles, límites y preparación. Textos en STRINGS. */
  var CH = [
    { id: 'd1', lv: 1, rules: { maxStrokes: 1, noErase: true } },
    { id: 'd2', lv: 1, rules: { onlyShapes: true, minStrokes: 6 }, setup: { tool: 'line' } },
    { id: 'd3', lv: 1, rules: { maxColors: 3, minStrokes: 10 } },
    { id: 'd4', lv: 2, rules: { exactColors: 3, sameHue: true, minStrokes: 8 }, setup: { values: '#8b1e3f' } },
    { id: 'd5', lv: 2, rules: { minLayers: 3, minStrokes: 12 }, setup: { layers: 3 } },
    { id: 'd6', lv: 2, rules: { minStrokes: 15, alt: true } },
    { id: 'd7', lv: 3, rules: { sym: ['v', 'vh'], symStrokes: 6 }, setup: { sym: 'v' } },
    { id: 'd8', lv: 3, rules: { sym: ['radial'], symN: 8, symStrokes: 10 }, setup: { sym: 'radial', symN: 8 } },
    { id: 'd9', lv: 3, rules: { sym: ['kaleido'], symN: 6, symStrokes: 10, maxColors: 4 }, setup: { sym: 'kaleido', symN: 6 } },
    { id: 'd10', lv: 4, rules: { snapVp: 6, vps: 1 }, setup: { guide: 'p1', tool: 'line' } },
    { id: 'd11', lv: 4, rules: { snapVp: 10, vps: 2 }, setup: { guide: 'p2', tool: 'line' } },
    { id: 'd12', lv: 4, rules: { snapVp: 24, vps: 2, minLayers: 2 }, setup: { guide: 'p2', tool: 'line', horizon: 0.72, layers: 2 } },
    { id: 'd13', lv: 5, rules: { minSheets: 4 }, setup: { sheets: 2 } },
    { id: 'd14', lv: 5, rules: { minSheets: 10, rulesN: 3 }, setup: { sheets: 2 } },
    { id: 'd15', lv: 6, gen: true, rules: {} }
  ];
  function chById(id) { for (var i = 0; i < CH.length; i++) if (CH[i].id === id) return CH[i]; return null; }
  function chKey(c, s) { return 'ch' + (CH.indexOf(c) + 1) + s; }

  var MAXL = 12, MAXS = 40, MAXPTS = 4000, TIPR = 56;

  IG.defineEngine('dibujo', {
    libs: ['pixi'], version: 1, fileBase: 'dibujo',
    extraKeys: ['kDibCursor', 'kDibSize', 'kDibVp'],
    initialStart: function (para) { return { child: 'landscape', teen: 'mandala', adult: 'street' }[para] || 'landscape'; },
    starts: function (ctx) {
      var t = ctx.t;
      var list = [
        { id: 'landscape', title: t('stLandscape'), desc: t('stLandscapeD'), para: 'child' },
        { id: 'mandala', title: t('stMandala'), desc: t('stMandalaD'), para: 'teen' },
        { id: 'street', title: t('stStreet'), desc: t('stStreetD'), para: 'adult' },
        { id: 'sphere', title: t('stSphere'), desc: t('stSphereD'), para: 'any' }
      ];
      CH.forEach(function (c) {
        list.push({ id: 'ch:' + c.id, title: t(chKey(c, 'T')),
          desc: t('chLevel', { n: c.lv, name: t('lvl' + c.lv) }) + ' · ' + t(chKey(c, 'G')) });
      });
      return list;
    },
    create: function (ctx) { return studio(ctx); }
  });

  /* ---------- Color ---------- */
  function hex2rgb(hex) { var s = String(hex).replace('#', ''); return [parseInt(s.substr(0, 2), 16), parseInt(s.substr(2, 2), 16), parseInt(s.substr(4, 2), 16)]; }
  function rgb2hex(r, g, b) { function p(v) { var x = Math.max(0, Math.min(255, Math.round(v))).toString(16); return x.length < 2 ? '0' + x : x; } return '#' + p(r) + p(g) + p(b); }
  function toHsl(hex) {
    var c = hex2rgb(hex), r = c[0] / 255, g = c[1] / 255, b = c[2] / 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn, hh = 0, s = 0;
    if (d) { s = d / (1 - Math.abs(2 * l - 1)); hh = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; hh *= 60; if (hh < 0) hh += 360; }
    return [hh, s, l];
  }
  function hsl2hex(hh, s, l) {
    hh = ((hh % 360) + 360) % 360; s = Math.max(0, Math.min(1, s)); l = Math.max(0, Math.min(1, l));
    var c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((hh / 60) % 2 - 1)), m = l - c / 2, p;
    if (hh < 60) p = [c, x, 0]; else if (hh < 120) p = [x, c, 0]; else if (hh < 180) p = [0, c, x];
    else if (hh < 240) p = [0, x, c]; else if (hh < 300) p = [x, 0, c]; else p = [c, 0, x];
    return rgb2hex((p[0] + m) * 255, (p[1] + m) * 255, (p[2] + m) * 255);
  }
  /* Mezcla en luz lineal: se parece más a mezclar pintura que a mezclar los números del hexadecimal. */
  function lin(v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
  function unlin(v) { return 255 * (v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055); }
  function mixHex(a, b, amount) {
    var A = hex2rgb(a), B = hex2rgb(b), k = Math.max(0, Math.min(1, amount));
    return rgb2hex(unlin(lin(A[0]) * (1 - k) + lin(B[0]) * k), unlin(lin(A[1]) * (1 - k) + lin(B[1]) * k), unlin(lin(A[2]) * (1 - k) + lin(B[2]) * k));
  }
  /* Luz en tres tonos: el claro se acerca al color de la luz; la sombra se va hacia el azul del cielo
     y pierde fuerza (James Gurney, «Color and Light», 2010). */
  function threeValues(base, lightHex) {
    var h0 = toHsl(base);
    return {
      light: mixHex(hsl2hex(h0[0], h0[1] * 0.92, Math.min(0.88, h0[2] + 0.22)), lightHex, 0.3),
      mid: hsl2hex(h0[0], h0[1], Math.max(0.12, Math.min(0.72, h0[2]))),
      shadow: mixHex(hsl2hex(h0[0], h0[1] * 0.75, Math.max(0.1, h0[2] - 0.24)), '#3a5a8c', 0.28)
    };
  }
  function isHex(v) { return typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v); }

  /* ---------- Simetría ---------- */
  function symTransforms(sym, n, w, hh) {
    var cx = w / 2, cy = hh / 2, out = [[1, 0, 0, 1, 0, 0]];
    if (sym === 'v' || sym === 'vh') out.push([-1, 0, 0, 1, 2 * cx, 0]);
    if (sym === 'h' || sym === 'vh') out.push([1, 0, 0, -1, 0, 2 * cy]);
    if (sym === 'vh') out.push([-1, 0, 0, -1, 2 * cx, 2 * cy]);
    if (sym === 'radial' || sym === 'kaleido') {
      out = [];
      var k = Math.max(2, Math.min(16, n || 8));
      for (var i = 0; i < k; i++) {
        var a = 2 * Math.PI * i / k, c = Math.cos(a), s = Math.sin(a);
        out.push([c, s, -s, c, cx - c * cx + s * cy, cy - s * cx - c * cy]);
        if (sym === 'kaleido') out.push([c, s, s, -c, cx - c * cx - s * cy, cy - s * cx + c * cy]);
      }
    }
    return out;
  }
  function isIdentity(m) { return m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1 && m[4] === 0 && m[5] === 0; }

  /* ---------- ZIP sin compresión («stored») ---------- */
  var CRC = (function () { var c, tb = []; for (var n = 0; n < 256; n++) { c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; tb[n] = c >>> 0; } return tb; })();
  function crc32(a) { var c = 0xffffffff; for (var i = 0; i < a.length; i++) c = CRC[(c ^ a[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
  function zipStore(files) {
    var parts = [], central = [], offset = 0, enc = new TextEncoder();
    function u16(v) { return [v & 255, (v >>> 8) & 255]; }
    function u32(v) { return [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255]; }
    files.forEach(function (f) {
      var name = enc.encode(f.name), crc = crc32(f.data), size = f.data.length;
      var local = [].concat(u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(0), u16(0x21), u32(crc), u32(size), u32(size), u16(name.length), u16(0));
      parts.push(new Uint8Array(local), name, f.data);
      central.push(new Uint8Array([].concat(u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(0x21), u32(crc), u32(size), u32(size), u16(name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset))), name);
      offset += local.length + name.length + size;
    });
    var cdSize = central.reduce(function (a, p) { return a + p.length; }, 0);
    var end = new Uint8Array([].concat(u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length), u32(cdSize), u32(offset), u16(0)));
    return new Blob(parts.concat(central, [end]), { type: 'application/zip' });
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function slug(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 28); }
  function r1(v) { return Math.round(v * 10) / 10; }

  /* ================================================================= */
  function studio(ctx) {
    var t = ctx.t, h = ctx.h, F = ctx.fields, vp = ctx.viewport;
    var seq = 0; function nid(p) { seq += 1; return (p || 'i') + seq.toString(36) + '-' + Math.floor(Math.random() * 1296).toString(36); }

    var DOC = null, selLayer = null, genText = '';
    var ui = {
      tool: 'pencil', colour: '#17202a', size: 5, opacity: 1, hardness: 0.78, flow: 0.9,
      stabilise: 0.35, fillShapes: false, usePressure: true, useTilt: true,
      mixA: '#d8434b', mixB: '#f2c14e', mixAmount: 0.5,
      valBase: '#1f5f8b', valLight: '#f2c14e',
      text: '', textSize: 64, tol: 36, showGuides: true, ruler: false,
      kx: 0, ky: 0, penDown: false, shapeStart: null, vpIndex: 0, input: null,
      selection: null, selSrc: null
    };

    function W() { return FORMATS[DOC.format][0]; }
    function H() { return FORMATS[DOC.format][1]; }
    function sheet() { return DOC.sheets[DOC.cur]; }
    function layers() { return sheet().layers; }
    function layer() { var s = sheet(); return s.layers[Math.max(0, Math.min(s.layers.length - 1, s.active))]; }

    function newLayer(name) { return { id: nid('l'), name: name, visible: true, opacity: 1, blend: 'normal', items: [] }; }
    function defaultVps(guide, horizon, w, hh) {
      var hy = horizon * hh;
      if (guide === 'p1') return [[Math.round(w * 0.5), Math.round(hy)], [Math.round(w * 0.94), Math.round(hy)], [Math.round(w * 0.5), Math.round(-1.2 * hh)]];
      if (guide === 'p3') return [[Math.round(w * 0.06), Math.round(hy)], [Math.round(w * 0.94), Math.round(hy)], [Math.round(w * 0.5), Math.round(-1.2 * hh)]];
      return [[Math.round(w * 0.06), Math.round(hy)], [Math.round(w * 0.94), Math.round(hy)], [Math.round(w * 0.5), Math.round(-1.2 * hh)]];
    }
    function newSheet() {
      return { id: nid('s'), alt: '', active: 1, sym: 'no', symN: 8, guide: 'no', grid: 50, horizon: 0.42, snap: true,
        vps: defaultVps('no', 0.42, W(), H()), layers: [newLayer(t('layerBg')), newLayer(t('layerN', { n: 2 }))] };
    }
    function vpCount(g) { return g === 'p1' ? 1 : g === 'p2' ? 2 : g === 'p3' ? 3 : 0; }
    function blankDoc(fmt) {
      DOC = { v: 1, title: '', format: FORMATS[fmt] ? fmt : 'h', rules: '', challenge: null, cur: 0, sheets: [] };
      DOC.sheets.push(newSheet());
    }
    blankDoc('h');

    /* Modos de fusión avanzados de PixiJS: se registran si están en la versión vendorizada. */
    try {
      if (PIXI.extensions && PIXI.OverlayBlend) PIXI.extensions.add(PIXI.OverlayBlend, PIXI.DarkenBlend, PIXI.LightenBlend);
    } catch (_) { /* si no están, Pixi usa «normal» */ }

    var app = new PIXI.Application();
    return app.init({
      antialias: true, backgroundAlpha: 0, autoStart: false, preference: 'webgl',
      resolution: Math.min(2, root.devicePixelRatio || 1), autoDensity: true,
      width: Math.max(320, vp.clientWidth || 800), height: Math.max(240, vp.clientHeight || 520)
    }).then(function () {
      ctx.setTech('renderer', 'PixiJS ' + PIXI.VERSION + ' · ' + (app.renderer.name === 'webgpu' ? 'WebGPU' : 'WebGL'));
      app.canvas.setAttribute('aria-hidden', 'true');
      app.canvas.className = 'igd-art';
      vp.appendChild(app.canvas);
      return build();
    });

    /* ================================================================= */
    function build() {
      var canvases = {}, textures = {}, sprites = {}, sigs = {}, images = {};
      var scratch = D.createElement('canvas'), sctx = null;
      var liveCanvas = D.createElement('canvas'), liveTex = null, liveCtx = null, liveSprite = null, liveOn = false;
      var world = new PIXI.Container(); app.stage.addChild(world);
      var paper = new PIXI.Graphics(); world.addChild(paper);
      var layerBox = new PIXI.Container(); world.addChild(layerBox);

      var overlay = D.createElement('canvas');
      overlay.className = 'igd-over'; overlay.setAttribute('aria-hidden', 'true');
      vp.appendChild(overlay);
      var octx = overlay.getContext('2d');

      var view = new ctx.View2D({ scale: 0.6, min: 0.05, max: 12, onChange: function () { applyView(); } });
      ctx.attachViewGestures(vp, view, { isPanTool: function () { return ui.tool === 'pan'; } });

      function sizeBuffers() {
        var w = W(), hh = H();
        if (scratch.width !== w || scratch.height !== hh) { scratch.width = w; scratch.height = hh; }
        sctx = scratch.getContext('2d');
        if (liveCanvas.width !== w || liveCanvas.height !== hh) {
          liveCanvas.width = w; liveCanvas.height = hh;
          if (liveTex) { liveTex.destroy(true); liveTex = null; }
        }
        liveCtx = liveCanvas.getContext('2d');
        if (!liveTex) liveTex = PIXI.Texture.from(liveCanvas);
        paper.clear(); paper.rect(0, 0, w, hh).fill({ color: 0xffffff });
      }

      /* ---------- Horneado de capas ---------- */
      function sigOf(l) { return l.items.map(function (it) { return it.id; }).join(',') + '|' + l.items.length; }
      function canvasFor(l) {
        var c = canvases[l.id];
        if (!c || c.width !== W() || c.height !== H()) {
          c = D.createElement('canvas'); c.width = W(); c.height = H(); canvases[l.id] = c;
          if (textures[l.id]) { textures[l.id].destroy(true); delete textures[l.id]; }
          sigs[l.id] = null;
        }
        if (!textures[l.id]) textures[l.id] = PIXI.Texture.from(c);
        return c;
      }
      function bake(l, force) {
        var c = canvasFor(l), sg = sigOf(l);
        if (!force && sigs[l.id] === sg) return c;
        var x = c.getContext('2d');
        x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
        x.clearRect(0, 0, c.width, c.height);
        for (var i = 0; i < l.items.length; i++) applyItem(x, l.items[i]);
        sigs[l.id] = sg;
        if (textures[l.id]) textures[l.id].source.update();
        return c;
      }
      function dropUnused() {
        var keep = {};
        DOC.sheets.forEach(function (s) { s.layers.forEach(function (l) { keep[l.id] = 1; }); });
        Object.keys(canvases).forEach(function (k) { if (!keep[k]) delete canvases[k]; });
        Object.keys(textures).forEach(function (k) { if (!keep[k]) { textures[k].destroy(true); delete textures[k]; } });
      }

      /* ---------- Sellos de pincel ---------- */
      function makeTip(colour, hardness, tipKind, rnd) {
        var c = D.createElement('canvas'); c.width = c.height = TIPR * 2;
        var x = c.getContext('2d'), R = TIPR, rgb = hex2rgb(colour);
        var base = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',';
        var hd = Math.max(0.01, Math.min(0.98, hardness));
        if (tipKind === 'chalk') {
          for (var i = 0; i < 1600; i++) {
            var a = rnd() * Math.PI * 2, rr = Math.pow(rnd(), 0.55) * R;
            var al = Math.max(0, Math.min(1, (1 - rr / R) * (0.35 + hd * 0.6)));
            x.fillStyle = base + al.toFixed(3) + ')';
            x.fillRect(R + Math.cos(a) * rr, R + Math.sin(a) * rr, 1.7, 1.7);
          }
          return c;
        }
        var g = x.createRadialGradient(R, R, 0, R, R, R);
        if (tipKind === 'flat') { g.addColorStop(0, base + '1)'); g.addColorStop(Math.max(0.82, hd), base + '1)'); g.addColorStop(1, base + '0)'); }
        else if (tipKind === 'grain') { g.addColorStop(0, base + '1)'); g.addColorStop(hd * 0.9, base + '0.88)'); g.addColorStop(1, base + '0)'); }
        else if (tipKind === 'water') { g.addColorStop(0, base + '0.5)'); g.addColorStop(Math.max(0.2, hd), base + '0.7)'); g.addColorStop(0.9, base + '1)'); g.addColorStop(1, base + '0)'); }
        else { g.addColorStop(0, base + '1)'); g.addColorStop(hd, base + '0.75)'); g.addColorStop(1, base + '0)'); }
        x.fillStyle = g; x.beginPath(); x.arc(R, R, R, 0, Math.PI * 2); x.fill();
        return c;
      }

      /* Recorre la polilínea y suelta sellos a distancia constante. El mismo recorrido, punto a punto
         o de golpe, da el mismo resultado: por eso el trazo en curso y el horneado coinciden. */
      function Walker(item, alphaMul) {
        var B = BRUSHES[item.tool] || BRUSHES.pencil;
        this.item = item; this.B = B; this.mul = alphaMul === undefined ? 1 : alphaMul;
        this.rnd = ctx.rng(item.seed);
        this.tip = makeTip(B.erase ? '#000000' : item.colour, item.hardness, B.tip, ctx.rng((item.seed ^ 0x5bf03635) >>> 0));
        this.step = Math.max(0.7, item.size * B.spacing);
        this.rest = 0; this.last = null; this.box = null;
      }
      Walker.prototype.grow = function (x, y, r) {
        var b = this.box;
        if (!b) { this.box = { x0: x - r, y0: y - r, x1: x + r, y1: y + r }; return; }
        if (x - r < b.x0) b.x0 = x - r;
        if (y - r < b.y0) b.y0 = y - r;
        if (x + r > b.x1) b.x1 = x + r;
        if (y + r > b.y1) b.y1 = y + r;
      };
      Walker.prototype.dab = function (g, x, y, p, tilt) {
        var B = this.B, it = this.item;
        var r = Math.max(0.5, it.size * 0.5 * (1 - B.pSize + B.pSize * p));
        var al = it.flow * (1 - B.pFlow + B.pFlow * p) * this.mul;
        var wr = r, hr = r;
        if (B.tiltW && tilt) { wr = r * (1 + B.tiltW * tilt * 0.9); hr = r * (1 - B.tiltW * tilt * 0.3); }
        var j1 = this.rnd(), j2 = this.rnd(), j3 = this.rnd();
        if (B.tip === 'chalk' || B.tip === 'water') {
          var jit = B.tip === 'chalk' ? 0.18 : 0.08;
          x += (j1 - 0.5) * it.size * jit; y += (j2 - 0.5) * it.size * jit;
          al *= 0.75 + j3 * 0.45;
        }
        g.globalAlpha = Math.max(0, Math.min(1, al));
        g.drawImage(this.tip, x - wr, y - hr, wr * 2, hr * 2);
        this.grow(x, y, Math.max(wr, hr) + 2);
      };
      Walker.prototype.feed = function (g, x, y, p, tilt) {
        if (!this.last) { this.dab(g, x, y, p, tilt); this.last = [x, y, p, tilt]; return; }
        var lx = this.last[0], ly = this.last[1], lp = this.last[2], lt = this.last[3];
        var dx = x - lx, dy = y - ly, d = Math.hypot(dx, dy);
        if (d < 1e-6) { this.last = [x, y, p, tilt]; return; }
        var travelled = this.rest, guard = 0;
        while (travelled + this.step <= d && guard++ < 20000) {
          travelled += this.step;
          var k = travelled / d;
          this.dab(g, lx + dx * k, ly + dy * k, lp + (p - lp) * k, lt + (tilt - lt) * k);
        }
        this.rest = travelled - d;
        this.last = [x, y, p, tilt];
      };

      /* Trazo vivo: un Walker por copia de simetría, alimentado punto a punto. */
      function LiveStroke(item, g, erase, alphaMul) {
        this.g = g; this.erase = !!erase;
        this.trs = symTransforms(item.sym, item.symN, W(), H());
        var self = this;
        this.wk = this.trs.map(function () { return new Walker(item, alphaMul); });
        void self;
      }
      LiveStroke.prototype.push = function (x, y, p, tilt) {
        var self = this;
        this.trs.forEach(function (m, i) {
          self.g.save();
          self.g.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
          if (self.erase) self.g.globalCompositeOperation = 'destination-out';
          self.wk[i].feed(self.g, x, y, p, tilt);
          self.g.restore();
        });
      };

      /* ---------- Aplicar una marca ---------- */
      function strokeOnScratch(item) {
        var w = W(), hh = H();
        sctx.setTransform(1, 0, 0, 1, 0, 0); sctx.globalCompositeOperation = 'source-over'; sctx.globalAlpha = 1;
        sctx.clearRect(0, 0, w, hh);
        var trs = symTransforms(item.sym, item.symN, w, hh), box = null;
        trs.forEach(function (m) {
          var wk = new Walker(item);
          sctx.save(); sctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
          for (var i = 0; i + 3 < item.pts.length; i += 4) wk.feed(sctx, item.pts[i], item.pts[i + 1], item.pts[i + 2], item.pts[i + 3]);
          sctx.restore();
          if (!wk.box) return;
          [[wk.box.x0, wk.box.y0], [wk.box.x1, wk.box.y0], [wk.box.x0, wk.box.y1], [wk.box.x1, wk.box.y1]].forEach(function (q) {
            var gx = m[0] * q[0] + m[2] * q[1] + m[4], gy = m[1] * q[0] + m[3] * q[1] + m[5];
            if (!box) box = { x0: gx, y0: gy, x1: gx, y1: gy };
            box.x0 = Math.min(box.x0, gx); box.y0 = Math.min(box.y0, gy);
            box.x1 = Math.max(box.x1, gx); box.y1 = Math.max(box.y1, gy);
          });
        });
        sctx.globalAlpha = 1;
        return box;
      }
      function compositeScratch(g, item, box) {
        var B = BRUSHES[item.tool] || BRUSHES.pencil;
        var x0 = box ? Math.max(0, Math.floor(box.x0) - 2) : 0, y0 = box ? Math.max(0, Math.floor(box.y0) - 2) : 0;
        var x1 = box ? Math.min(W(), Math.ceil(box.x1) + 2) : W(), y1 = box ? Math.min(H(), Math.ceil(box.y1) + 2) : H();
        if (x1 <= x0 || y1 <= y0) return;
        g.save();
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.globalAlpha = Math.max(0, Math.min(1, item.opacity));
        g.globalCompositeOperation = B.erase ? 'destination-out' : 'source-over';
        g.drawImage(scratch, x0, y0, x1 - x0, y1 - y0, x0, y0, x1 - x0, y1 - y0);
        g.restore();
      }
      function shapePath(g, it) {
        var x0 = it.x0, y0 = it.y0, x1 = it.x1, y1 = it.y1;
        g.beginPath();
        if (it.shape === 'line') { g.moveTo(x0, y0); g.lineTo(x1, y1); }
        else if (it.shape === 'rect') g.rect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
        else g.ellipse((x0 + x1) / 2, (y0 + y1) / 2, Math.abs(x1 - x0) / 2 || 0.5, Math.abs(y1 - y0) / 2 || 0.5, 0, 0, Math.PI * 2);
      }
      function applyItem(g, it) {
        if (it.k === 's') { compositeScratch(g, it, strokeOnScratch(it)); return; }
        if (it.k === 'g') {
          symTransforms(it.sym, it.symN, W(), H()).forEach(function (m) {
            g.save(); g.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
            g.globalAlpha = it.opacity; g.lineCap = 'round'; g.lineJoin = 'round';
            g.lineWidth = it.size; g.strokeStyle = it.colour; g.fillStyle = it.colour;
            shapePath(g, it);
            if (it.fill && it.shape !== 'line') g.fill();
            g.stroke(); g.restore();
          });
          g.globalAlpha = 1; return;
        }
        if (it.k === 't') {
          g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
          g.globalAlpha = it.opacity; g.fillStyle = it.colour;
          g.font = '600 ' + it.size + 'px "Atkinson Hyperlegible", system-ui, sans-serif';
          g.textBaseline = 'alphabetic'; g.textAlign = 'left';
          g.fillText(it.text, it.x, it.y); g.restore(); return;
        }
        if (it.k === 'f') { floodFill(g, it); return; }
        if (it.k === 'x') {
          var w = Math.max(1, Math.round(it.sw)), hh = Math.max(1, Math.round(it.sh));
          var tmp = D.createElement('canvas'); tmp.width = w; tmp.height = hh;
          tmp.getContext('2d').drawImage(g.canvas, it.sx, it.sy, w, hh, 0, 0, w, hh);
          g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
          g.clearRect(it.sx, it.sy, w, hh);
          g.translate(it.dx + it.dw / 2, it.dy + it.dh / 2);
          g.scale(it.fh ? -1 : 1, it.fv ? -1 : 1);
          g.drawImage(tmp, -it.dw / 2, -it.dh / 2, it.dw, it.dh);
          g.restore(); return;
        }
        if (it.k === 'img') {
          var im = images[it.id];
          if (im) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.drawImage(im, 0, 0, W(), H()); g.restore(); }
        }
      }
      function floodFill(g, it) {
        var w = g.canvas.width, hh = g.canvas.height;
        var sx = Math.round(it.x), sy = Math.round(it.y);
        if (sx < 0 || sy < 0 || sx >= w || sy >= hh) return;
        var img = g.getImageData(0, 0, w, hh), dt = img.data, i0 = (sy * w + sx) * 4;
        var t0 = [dt[i0], dt[i0 + 1], dt[i0 + 2], dt[i0 + 3]];
        var col = hex2rgb(it.colour), al = Math.round(Math.max(0, Math.min(1, it.opacity)) * 255);
        if (Math.abs(t0[0] - col[0]) < 2 && Math.abs(t0[1] - col[1]) < 2 && Math.abs(t0[2] - col[2]) < 2 && Math.abs(t0[3] - al) < 2) return;
        var tol = (it.tol || 36) * 2.2, stack = [sy * w + sx], seen = new Uint8Array(w * hh), guard = 0;
        while (stack.length && guard++ < 6e6) {
          var i = stack.pop();
          if (seen[i]) continue;
          var p = i * 4;
          if (Math.abs(dt[p] - t0[0]) + Math.abs(dt[p + 1] - t0[1]) + Math.abs(dt[p + 2] - t0[2]) + Math.abs(dt[p + 3] - t0[3]) > tol) continue;
          seen[i] = 1;
          dt[p] = col[0]; dt[p + 1] = col[1]; dt[p + 2] = col[2]; dt[p + 3] = al;
          var x = i % w, y = (i - x) / w;
          if (x > 0) stack.push(i - 1);
          if (x < w - 1) stack.push(i + 1);
          if (y > 0) stack.push(i - w);
          if (y < hh - 1) stack.push(i + w);
        }
        g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.putImageData(img, 0, 0); g.restore();
      }
      function loadImages() {
        var jobs = [];
        DOC.sheets.forEach(function (s) { s.layers.forEach(function (l) { l.items.forEach(function (it) {
          if (it.k !== 'img' || images[it.id]) return;
          jobs.push(new Promise(function (res) {
            var im = new Image();
            im.onload = function () { images[it.id] = im; res(); };
            im.onerror = function () { res(); };
            im.src = it.data;
          }));
        }); }); });
        return Promise.all(jobs);
      }

      /* ---------- Escena ---------- */
      function blendOf(l) { return BLENDS.indexOf(l.blend) >= 0 ? l.blend : 'normal'; }
      function rebuildSprites() {
        layerBox.removeChildren();
        Object.keys(sprites).forEach(function (k) { delete sprites[k]; });
        layers().forEach(function (l) {
          bake(l);
          var sp = new PIXI.Sprite(textures[l.id]);
          sprites[l.id] = sp; layerBox.addChild(sp);
        });
        syncSprites(); syncLive();
      }
      function syncSprites() {
        layers().forEach(function (l) {
          var sp = sprites[l.id]; if (!sp) return;
          sp.alpha = l.opacity; sp.visible = l.visible;
          try { sp.blendMode = blendOf(l); } catch (_) { sp.blendMode = 'normal'; }
        });
      }
      function syncLive() {
        if (liveSprite && liveSprite.parent) liveSprite.parent.removeChild(liveSprite);
        liveSprite = null;
        if (!liveOn) return;
        var l = layer(), sp = sprites[l.id]; if (!sp) return;
        liveSprite = new PIXI.Sprite(liveTex);
        liveSprite.alpha = l.opacity;
        try { liveSprite.blendMode = blendOf(l); } catch (_) { liveSprite.blendMode = 'normal'; }
        layerBox.addChildAt(liveSprite, layerBox.getChildIndex(sp) + 1);
      }
      function showLive(on) { if (on === liveOn) return; liveOn = on; syncLive(); }
      function clearLive() {
        liveCtx.setTransform(1, 0, 0, 1, 0, 0); liveCtx.globalAlpha = 1; liveCtx.globalCompositeOperation = 'source-over';
        liveCtx.clearRect(0, 0, W(), H());
        if (liveTex) liveTex.source.update();
      }
      var raf = 0;
      function render() { if (!raf) raf = root.requestAnimationFrame(function () { raf = 0; try { app.render(); } catch (_) {} drawOverlay(); }); }
      function applyView() { world.position.set(view.x, view.y); world.scale.set(view.scale); render(); }
      function fit() {
        var w = app.renderer.width / app.renderer.resolution, hh = app.renderer.height / app.renderer.resolution;
        view.fit({ minX: 0, minY: 0, maxX: W(), maxY: H() }, w, hh, 22);
      }
      function resize() {
        var w = Math.max(240, vp.clientWidth), hh = Math.max(200, vp.clientHeight);
        app.renderer.resize(w, hh);
        var dpr = Math.min(2, root.devicePixelRatio || 1);
        overlay.width = Math.round(w * dpr); overlay.height = Math.round(hh * dpr);
        octx = overlay.getContext('2d');
        fit(); render();
      }
      if (root.ResizeObserver) new ResizeObserver(resize).observe(vp);
      else root.addEventListener('resize', resize);

      /* ---------- Guías, cursor y regla (canvas 2D encima) ---------- */
      function s2(wx, wy) { return view.toScreen(wx, wy); }
      function activeVps() { var s = sheet(); return s.vps.slice(0, vpCount(s.guide)); }
      function drawOverlay() {
        if (!DOC) return;
        var dpr = Math.min(2, root.devicePixelRatio || 1);
        var vw = overlay.width / dpr, vh = overlay.height / dpr;
        octx.setTransform(dpr, 0, 0, dpr, 0, 0);
        octx.clearRect(0, 0, vw, vh);
        var s = sheet(), w = W(), hh = H(), o = s2(0, 0), e = s2(w, hh);
        octx.strokeStyle = 'rgba(23,43,66,.55)'; octx.lineWidth = 1;
        octx.strokeRect(o.x + 0.5, o.y + 0.5, e.x - o.x, e.y - o.y);
        if (ui.showGuides) {
          octx.save(); octx.beginPath(); octx.rect(o.x, o.y, e.x - o.x, e.y - o.y); octx.clip();
          if (s.guide === 'grid') {
            octx.strokeStyle = 'rgba(31,95,139,.32)'; octx.lineWidth = 1; octx.beginPath();
            for (var gx = 0; gx <= w; gx += s.grid) { var p1 = s2(gx, 0), p2 = s2(gx, hh); octx.moveTo(p1.x, p1.y); octx.lineTo(p2.x, p2.y); }
            for (var gy = 0; gy <= hh; gy += s.grid) { var q1 = s2(0, gy), q2 = s2(w, gy); octx.moveTo(q1.x, q1.y); octx.lineTo(q2.x, q2.y); }
            octx.stroke();
          } else if (vpCount(s.guide)) {
            var hy = s.horizon * hh, a = s2(0, hy), b = s2(w, hy);
            octx.strokeStyle = 'rgba(168,51,111,.7)'; octx.lineWidth = 2;
            octx.beginPath(); octx.moveTo(a.x, a.y); octx.lineTo(b.x, b.y); octx.stroke();
            octx.strokeStyle = 'rgba(31,95,139,.26)'; octx.lineWidth = 1;
            var L = Math.max(vw, vh) * 3;
            activeVps().forEach(function (v) {
              var c = s2(v[0], v[1]); octx.beginPath();
              for (var ang = 0; ang < 180; ang += 7.5) {
                var r = ang * Math.PI / 180;
                octx.moveTo(c.x - Math.cos(r) * L, c.y - Math.sin(r) * L);
                octx.lineTo(c.x + Math.cos(r) * L, c.y + Math.sin(r) * L);
              }
              octx.stroke();
            });
          }
          if (s.sym !== 'no') {
            octx.strokeStyle = 'rgba(90,73,168,.65)'; octx.setLineDash([8, 6]); octx.lineWidth = 1.5; octx.beginPath();
            if (s.sym === 'v' || s.sym === 'vh') { var v1 = s2(w / 2, 0), v2 = s2(w / 2, hh); octx.moveTo(v1.x, v1.y); octx.lineTo(v2.x, v2.y); }
            if (s.sym === 'h' || s.sym === 'vh') { var h1 = s2(0, hh / 2), h2 = s2(w, hh / 2); octx.moveTo(h1.x, h1.y); octx.lineTo(h2.x, h2.y); }
            if (s.sym === 'radial' || s.sym === 'kaleido') {
              var n = (s.sym === 'kaleido' ? 2 : 1) * Math.max(2, Math.min(16, s.symN)), R = Math.max(w, hh), cc = s2(w / 2, hh / 2);
              for (var k = 0; k < n; k++) {
                var aa = 2 * Math.PI * k / n - Math.PI / 2, pe = s2(w / 2 + Math.cos(aa) * R, hh / 2 + Math.sin(aa) * R);
                octx.moveTo(cc.x, cc.y); octx.lineTo(pe.x, pe.y);
              }
            }
            octx.stroke(); octx.setLineDash([]);
          }
          octx.restore();
          if (vpCount(s.guide)) activeVps().forEach(function (v, i) {
            var c = s2(v[0], v[1]);
            octx.fillStyle = (i === ui.vpIndex && ui.tool === 'vp') ? '#5a49a8' : '#a8336f';
            octx.beginPath(); octx.arc(c.x, c.y, 9, 0, Math.PI * 2); octx.fill();
            octx.strokeStyle = '#ffffff'; octx.lineWidth = 2; octx.stroke();
            octx.fillStyle = '#ffffff'; octx.font = '700 11px system-ui,sans-serif';
            octx.textAlign = 'center'; octx.textBaseline = 'middle';
            octx.fillText(String(i + 1), c.x, c.y + 1);
          });
        }
        if (ui.selection) {
          var r2 = ui.selection, pa = s2(r2.x, r2.y), pb = s2(r2.x + r2.w, r2.y + r2.h);
          octx.setLineDash([6, 4]); octx.lineWidth = 2;
          octx.strokeStyle = '#ffffff'; octx.strokeRect(pa.x, pa.y, pb.x - pa.x, pb.y - pa.y);
          octx.strokeStyle = '#5a49a8'; octx.lineDashOffset = 5; octx.strokeRect(pa.x, pa.y, pb.x - pa.x, pb.y - pa.y);
          octx.setLineDash([]); octx.lineDashOffset = 0;
        }
        if (cursorOn) drawCursor();
        if (ui.ruler) drawRuler(vw, vh);
      }
      var cursorOn = false;
      function drawCursor() {
        var c = s2(ui.kx, ui.ky), r = Math.max(7, ui.size * 0.5 * view.scale);
        octx.save();
        octx.lineWidth = 3; octx.strokeStyle = '#ffffff';
        octx.beginPath(); octx.arc(c.x, c.y, r, 0, Math.PI * 2); octx.stroke();
        octx.lineWidth = 1.6; octx.strokeStyle = (ui.penDown || ui.shapeStart) ? '#a8336f' : '#17395c';
        octx.beginPath(); octx.arc(c.x, c.y, r, 0, Math.PI * 2);
        octx.moveTo(c.x - r - 9, c.y); octx.lineTo(c.x - r - 3, c.y);
        octx.moveTo(c.x + r + 3, c.y); octx.lineTo(c.x + r + 9, c.y);
        octx.moveTo(c.x, c.y - r - 9); octx.lineTo(c.x, c.y - r - 3);
        octx.moveTo(c.x, c.y + r + 3); octx.lineTo(c.x, c.y + r + 9);
        octx.stroke(); octx.restore();
      }
      function drawRuler(vw, vh) {
        var step = 50; while (step * view.scale < 46) step *= 2;
        octx.save();
        octx.fillStyle = 'rgba(244,247,250,.95)';
        octx.fillRect(0, 0, vw, 18); octx.fillRect(0, 0, 28, vh);
        octx.strokeStyle = '#7d93a8'; octx.lineWidth = 1; octx.beginPath();
        octx.moveTo(0, 18.5); octx.lineTo(vw, 18.5); octx.moveTo(28.5, 0); octx.lineTo(28.5, vh); octx.stroke();
        octx.fillStyle = '#17395c'; octx.font = '10px system-ui,sans-serif';
        octx.strokeStyle = '#44586c'; octx.beginPath();
        octx.textAlign = 'center'; octx.textBaseline = 'top';
        for (var x = 0; x <= W(); x += step) { var p = s2(x, 0); if (p.x > 28 && p.x < vw) { octx.moveTo(p.x, 12); octx.lineTo(p.x, 18); octx.fillText(String(x), p.x, 2); } }
        octx.textAlign = 'right';
        for (var y = 0; y <= H(); y += step) { var q = s2(0, y); if (q.y > 18 && q.y < vh) { octx.moveTo(22, q.y); octx.lineTo(28, q.y); octx.fillText(String(y), 24, q.y - 5); } }
        octx.stroke(); octx.restore();
      }

      /* ---------- Ajuste a las guías ---------- */
      function snapLine(x0, y0, x1, y1) {
        var s = sheet();
        if (!s.snap) return { pts: [x0, y0, x1, y1], snap: null };
        if (s.guide === 'grid') {
          var g = s.grid, r = function (v) { return Math.round(v / g) * g; };
          return { pts: [r(x0), r(y0), r(x1), r(y1)], snap: 'grid' };
        }
        if (!vpCount(s.guide)) return { pts: [x0, y0, x1, y1], snap: null };
        var dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy);
        if (len < 1) return { pts: [x0, y0, x1, y1], snap: null };
        var cands = [[1, 0, 'h']];
        if (s.guide !== 'p3') cands.push([0, 1, 'v']);
        activeVps().forEach(function (v, i) {
          var vx = v[0] - x0, vy = v[1] - y0, vl = Math.hypot(vx, vy);
          if (vl > 1) cands.push([vx / vl, vy / vl, 'vp' + (i + 1)]);
        });
        var best = cands[0], score = -1;
        cands.forEach(function (c) { var sc = Math.abs((dx * c[0] + dy * c[1]) / len); if (sc > score) { score = sc; best = c; } });
        var proj = dx * best[0] + dy * best[1];
        return { pts: [x0, y0, x0 + best[0] * proj, y0 + best[1] * proj], snap: best[2] };
      }

      /* ---------- Cuentas, límites del reto y evaluación ---------- */
      function markItems(s) { var out = []; s.layers.forEach(function (l) { l.items.forEach(function (it) { out.push(it); }); }); return out; }
      function marksCount(s) { var n = 0; s.layers.forEach(function (l) { n += l.items.length; }); return n; }
      function drawItems(s) { return markItems(s).filter(function (it) { return it.k === 's' || it.k === 'g'; }); }
      function countStrokes(s) {
        return drawItems(s).filter(function (it) { return !(it.k === 's' && BRUSHES[it.tool] && BRUSHES[it.tool].erase); }).length;
      }
      function coloursUsed(s) {
        var c = [];
        markItems(s).forEach(function (it) {
          if (it.k === 's' && BRUSHES[it.tool] && BRUSHES[it.tool].erase) return;
          if (!isHex(it.colour)) return;
          if (c.indexOf(it.colour) < 0) c.push(it.colour);
        });
        return c;
      }
      function toolsUsed(s) {
        var c = [];
        markItems(s).forEach(function (it) {
          var k = it.k === 's' ? it.tool : it.k === 'g' ? it.shape : it.k;
          if (c.indexOf(k) < 0) c.push(k);
        });
        return c;
      }
      function curChallenge() { return DOC.challenge ? chById(DOC.challenge) : null; }
      function limitBlock(kind, tool, colour) {
        var c = curChallenge(); if (!c) return null;
        var R = c.rules, s = sheet(), er = !!(BRUSHES[tool] && BRUSHES[tool].erase);
        if (R.onlyShapes && kind !== 'g' && !er) return t('limShapes');
        if (R.noErase && er) return t('limNoErase');
        if (R.maxStrokes && !er && countStrokes(s) >= R.maxStrokes) return t('limStrokes', { n: R.maxStrokes });
        if (R.maxColors && !er && colour) {
          var cols = coloursUsed(s);
          if (cols.indexOf(colour) < 0 && cols.length >= R.maxColors) return t('limColors', { n: R.maxColors });
        }
        return null;
      }
      function ruleLines() { return DOC.rules.split(/\n+/).filter(function (x) { return x.trim().length > 2; }).length; }
      function drawnSheets() { return DOC.sheets.filter(function (x) { return countStrokes(x) > 0; }).length; }
      function evaluate(c) {
        var R = c.rules || {}, s = sheet(), out = [];
        var n = countStrokes(s), cols = coloursUsed(s), tls = toolsUsed(s);
        function add(ok, txt) { out.push([!!ok, txt]); }
        if (R.minStrokes) add(n >= R.minStrokes, t('chkMinStrokes', { n: n, m: R.minStrokes }));
        if (R.maxStrokes) add(n >= 1 && n <= R.maxStrokes, t('chkMaxStrokes', { n: n, m: R.maxStrokes }));
        if (R.maxColors) add(cols.length >= 1 && cols.length <= R.maxColors, t('chkColors', { n: cols.length, m: R.maxColors }));
        if (R.exactColors) add(cols.length === R.exactColors, t('chkExactColors', { n: cols.length, m: R.exactColors }));
        if (R.sameHue) {
          var hs = cols.map(toHsl), ok = hs.length >= 2 && hs.every(function (a) { return a[1] > 0.12; });
          if (ok) { var base = hs[0][0]; ok = hs.every(function (a) { var dd = Math.abs(a[0] - base); return Math.min(dd, 360 - dd) <= 25; }); }
          var ls = hs.map(function (a) { return a[2]; }).sort(function (p, q) { return p - q; });
          var spread = ls.length ? ls[ls.length - 1] - ls[0] : 0;
          add(ok && spread >= 0.25, t('chkHue', { spread: Math.round(spread * 100) }));
        }
        if (R.onlyShapes) add(n > 0 && tls.every(function (k) { return SHAPES[k] || (BRUSHES[k] && BRUSHES[k].erase); }), t('chkShapes'));
        if (R.minLayers) { var used = s.layers.filter(function (l) { return l.items.length; }).length; add(used >= R.minLayers, t('chkLayers', { n: used, m: R.minLayers })); }
        if (R.sym) {
          var cnt = drawItems(s).filter(function (it) { return R.sym.indexOf(it.sym) >= 0 && (!R.symN || it.symN === R.symN); }).length;
          add(cnt >= (R.symStrokes || 3), t('chkSym', { n: cnt, m: R.symStrokes || 3,
            sym: R.sym.map(function (k) { return t('sym_' + k); }).join(' / ') + (R.symN ? ' · ' + R.symN : '') }));
        }
        if (R.snapVp) {
          var c2 = 0, vps = {};
          drawItems(s).forEach(function (it) { if (it.snap && it.snap.indexOf('vp') === 0) { c2++; vps[it.snap] = 1; } });
          add(c2 >= R.snapVp, t('chkVp', { n: c2, m: R.snapVp }));
          if (R.vps) add(Object.keys(vps).length >= R.vps, t('chkVps', { n: Object.keys(vps).length, m: R.vps }));
        }
        if (R.minSheets) add(drawnSheets() >= R.minSheets, t('chkSheets', { n: drawnSheets(), m: R.minSheets }));
        if (R.rulesN) add(ruleLines() >= R.rulesN, t('chkRules', { n: ruleLines(), m: R.rulesN }));
        if (R.alt) add(!!s.alt, t('chkAlt'));
        return out;
      }

      function colourName(hex) {
        var i = PALETTE.indexOf(hex);
        if (i >= 0) return t('colourNames').split('|')[i] || hex;
        var hsl = toHsl(hex), names = t('hueNames').split('|');
        var soft = hsl[2] > 0.8 ? t('light') : hsl[2] < 0.25 ? t('dark') : '';
        if (hsl[1] < 0.12) return (hsl[2] > 0.9 ? names[8] : hsl[2] < 0.15 ? names[9] : names[10]) + ' (' + hex + ')';
        var hue = names[Math.round(hsl[0] / 45) % 8];
        return (soft ? t('hueOrder', { h: hue, q: soft }) : hue) + ' (' + hex + ')';
      }

      /* ---------- Trazo libre ---------- */
      var stroke = null;   /* {item, live, erase, smooth} */
      function beginStroke(x, y, p, tilt) {
        var why = limitBlock('s', ui.tool, ui.colour);
        if (why) { ctx.announce(why); ctx.setStatus(why); return false; }
        if (!layer().visible) { ctx.announce(t('hiddenLayer')); ctx.setStatus(t('hiddenLayer')); return false; }
        var B = BRUSHES[ui.tool];
        var item = { k: 's', id: nid('m'), tool: ui.tool, colour: ui.colour, size: ui.size, opacity: ui.opacity,
          hardness: ui.hardness, flow: ui.flow, sym: sheet().sym, symN: sheet().symN, snap: null,
          seed: Math.floor(Math.random() * 2e9), pts: [] };
        var l = layer();
        if (B.erase) {
          var g = bake(l).getContext('2d');
          stroke = { item: item, erase: true, layerId: l.id, live: new LiveStroke(item, g, true, item.opacity), smooth: null };
        } else {
          clearLive(); showLive(true);
          stroke = { item: item, erase: false, layerId: l.id, live: new LiveStroke(item, liveCtx, false, 1), smooth: null };
          if (liveSprite) liveSprite.alpha = l.opacity * item.opacity;
        }
        addPoint(x, y, p, tilt, true);
        return true;
      }
      function addPoint(x, y, p, tilt, first) {
        if (!stroke) return;
        var it = stroke.item;
        if (it.pts.length >= MAXPTS * 4) return;
        if (!first && stroke.smooth) {
          var k = 1 - Math.max(0, Math.min(0.92, ui.stabilise));
          x = stroke.smooth[0] + (x - stroke.smooth[0]) * k;
          y = stroke.smooth[1] + (y - stroke.smooth[1]) * k;
        }
        stroke.smooth = [x, y];
        x = r1(x); y = r1(y); p = Math.round(p * 100) / 100; tilt = Math.round(tilt * 100) / 100;
        it.pts.push(x, y, p, tilt);
        stroke.live.push(x, y, p, tilt);
        if (stroke.erase) { if (textures[stroke.layerId]) textures[stroke.layerId].source.update(); }
        else if (liveTex) liveTex.source.update();
        render();
      }
      function endStroke(keep) {
        if (!stroke) return;
        var st = stroke; stroke = null;
        var l = null, ls = layers();
        for (var i = 0; i < ls.length; i++) if (ls[i].id === st.layerId) l = ls[i];
        showLive(false); clearLive();
        if (!l) { render(); return; }
        if (!keep || st.item.pts.length < 4) {
          if (st.erase) bake(l, true);
          render(); return;
        }
        l.items.push(st.item);
        bake(l, true);
        afterEdit(t('undoStroke'));
      }

      /* ---------- Formas, relleno, texto, cuentagotas ---------- */
      function commitShape(x0, y0, x1, y1) {
        var why = limitBlock('g', ui.tool, ui.colour);
        if (why) { ctx.announce(why); ctx.setStatus(why); return; }
        if (!layer().visible) { ctx.announce(t('hiddenLayer')); ctx.setStatus(t('hiddenLayer')); return; }
        var s = sheet();
        var sn = (ui.tool === 'line' || (s.guide === 'grid' && s.snap)) ? snapLine(x0, y0, x1, y1) : { pts: [x0, y0, x1, y1], snap: null };
        var it = { k: 'g', id: nid('m'), shape: ui.tool, colour: ui.colour, size: ui.size, opacity: ui.opacity,
          fill: !!ui.fillShapes && ui.tool !== 'line', sym: s.sym, symN: s.symN, snap: sn.snap,
          x0: r1(sn.pts[0]), y0: r1(sn.pts[1]), x1: r1(sn.pts[2]), y1: r1(sn.pts[3]) };
        var l = layer(); l.items.push(it); bake(l);
        afterEdit(t('undoShape'));
        ctx.announce(t('shapeDone'));
      }
      function doFill(x, y) {
        if (!layer().visible) { ctx.announce(t('hiddenLayer')); ctx.setStatus(t('hiddenLayer')); return; }
        var why = limitBlock('f', 'fill', ui.colour);
        if (why) { ctx.announce(why); ctx.setStatus(why); return; }
        var l = layer();
        l.items.push({ k: 'f', id: nid('m'), x: Math.round(x), y: Math.round(y), colour: ui.colour, opacity: ui.opacity, tol: ui.tol });
        bake(l); afterEdit(t('undoFill'));
      }
      function placeText(x, y) {
        var txt = (ui.text || '').trim();
        if (!txt) { ctx.announce(t('textHelp')); ctx.setStatus(t('textHelp')); return; }
        if (!layer().visible) { ctx.announce(t('hiddenLayer')); ctx.setStatus(t('hiddenLayer')); return; }
        var l = layer();
        l.items.push({ k: 't', id: nid('m'), x: Math.round(x), y: Math.round(y), text: txt.slice(0, 120),
          size: ui.textSize, colour: ui.colour, opacity: ui.opacity });
        bake(l); afterEdit(t('undoText'));
        ctx.announce(t('textPlaced'));
      }
      function pickColour(x, y) {
        var c = D.createElement('canvas'); c.width = 1; c.height = 1;
        var g = c.getContext('2d', { willReadFrequently: true });
        g.fillStyle = '#ffffff'; g.fillRect(0, 0, 1, 1);
        layers().forEach(function (l) {
          if (!l.visible) return;
          g.globalAlpha = l.opacity;
          g.globalCompositeOperation = CANVAS2D_BLEND[blendOf(l)] || 'source-over';
          g.drawImage(bake(l), Math.round(x), Math.round(y), 1, 1, 0, 0, 1, 1);
        });
        var d = g.getImageData(0, 0, 1, 1).data;
        setColour(rgb2hex(d[0], d[1], d[2]));
        ctx.announce(t('picked', { c: colourName(ui.colour) }));
      }

      /* ---------- Selección ---------- */
      function selPreview() {
        var s = ui.selection, src = ui.selSrc;
        if (!s || !src) { showLive(false); clearLive(); return; }
        clearLive();
        liveCtx.save(); liveCtx.setTransform(1, 0, 0, 1, 0, 0);
        liveCtx.translate(s.x + s.w / 2, s.y + s.h / 2);
        liveCtx.scale(s.fh ? -1 : 1, s.fv ? -1 : 1);
        liveCtx.drawImage(src.canvas, -s.w / 2, -s.h / 2, s.w, s.h);
        liveCtx.restore();
        if (liveTex) liveTex.source.update();
        showLive(true);
        if (liveSprite) liveSprite.alpha = layer().opacity;
      }
      function setSelection(x0, y0, x1, y1) {
        var x = Math.max(0, Math.min(x0, x1)), y = Math.max(0, Math.min(y0, y1));
        var w = Math.min(W(), Math.max(x0, x1)) - x, hh = Math.min(H(), Math.max(y0, y1)) - y;
        if (w < 3 || hh < 3) { ui.selection = null; ui.selSrc = null; showLive(false); clearLive(); render(); renderInspector(); return; }
        var rect = { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(hh), fh: false, fv: false };
        var src = D.createElement('canvas'); src.width = rect.w; src.height = rect.h;
        src.getContext('2d').drawImage(bake(layer()), rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);
        ui.selection = rect;
        ui.selSrc = { x: rect.x, y: rect.y, w: rect.w, h: rect.h, canvas: src };
        render(); renderInspector();
        ctx.announce(t('selMade', { w: rect.w, h: rect.h, x: rect.x, y: rect.y }));
      }
      function applySelection() {
        var s = ui.selection, src = ui.selSrc;
        if (!s || !src) { ctx.announce(t('selEmpty')); ctx.setStatus(t('selEmpty')); return; }
        if (s.x === src.x && s.y === src.y && s.w === src.w && s.h === src.h && !s.fh && !s.fv) { clearSelection(); return; }
        var l = layer();
        l.items.push({ k: 'x', id: nid('m'), sx: src.x, sy: src.y, sw: src.w, sh: src.h,
          dx: Math.round(s.x), dy: Math.round(s.y), dw: Math.round(s.w), dh: Math.round(s.h), fh: !!s.fh, fv: !!s.fv });
        ui.selection = null; ui.selSrc = null; showLive(false); clearLive();
        bake(l); afterEdit(t('undoSel'));
        ctx.announce(t('selApplied')); ctx.setStatus(t('selApplied'));
      }
      function deleteSelection() {
        var s = ui.selection;
        if (!s) { ctx.announce(t('selEmpty')); ctx.setStatus(t('selEmpty')); return; }
        var l = layer();
        l.items.push({ k: 'x', id: nid('m'), sx: Math.round(s.x), sy: Math.round(s.y), sw: Math.round(s.w), sh: Math.round(s.h),
          dx: -9000, dy: -9000, dw: 1, dh: 1, fh: false, fv: false });
        ui.selection = null; ui.selSrc = null; showLive(false); clearLive();
        bake(l); afterEdit(t('undoSel'));
      }
      function clearSelection() {
        ui.selection = null; ui.selSrc = null; showLive(false); clearLive();
        render(); renderInspector(); ctx.announce(t('selCleared'));
      }
      function inSel(x, y) { var s = ui.selection; return !!s && x >= s.x && y >= s.y && x <= s.x + s.w && y <= s.y + s.h; }

      /* ---------- Vista previa de forma ---------- */
      var preview = null;
      function drawShapePreview(x0, y0, x1, y1) {
        var s = sheet();
        var sn = (ui.tool === 'line' || (s.guide === 'grid' && s.snap)) ? snapLine(x0, y0, x1, y1) : { pts: [x0, y0, x1, y1] };
        preview = { x0: sn.pts[0], y0: sn.pts[1], x1: sn.pts[2], y1: sn.pts[3] };
        showLive(true); clearLive();
        var tmp = { shape: ui.tool, x0: preview.x0, y0: preview.y0, x1: preview.x1, y1: preview.y1 };
        symTransforms(s.sym, s.symN, W(), H()).forEach(function (m) {
          liveCtx.save(); liveCtx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
          liveCtx.globalAlpha = ui.opacity; liveCtx.lineWidth = ui.size; liveCtx.lineCap = 'round'; liveCtx.lineJoin = 'round';
          liveCtx.strokeStyle = ui.colour; liveCtx.fillStyle = ui.colour;
          shapePath(liveCtx, tmp);
          if (ui.fillShapes && ui.tool !== 'line') liveCtx.fill();
          liveCtx.stroke(); liveCtx.restore();
        });
        if (liveTex) liveTex.source.update();
        if (liveSprite) liveSprite.alpha = layer().opacity;
        render();
      }
      function clearShapePreview() { preview = null; if (!ui.selection) { showLive(false); clearLive(); } render(); }

      /* ---------- Puntero (Pointer Events Level 3) ---------- */
      var penSeen = false, drag = null;
      function docPt(e) {
        var r = app.canvas.getBoundingClientRect();
        return view.toWorld(e.clientX - r.left, e.clientY - r.top);
      }
      function pressureOf(e) {
        if (!ui.usePressure || e.pointerType !== 'pen') return 1;
        var p = typeof e.pressure === 'number' && e.pressure > 0 ? e.pressure : 0.5;
        return Math.max(0.05, Math.min(1, p));
      }
      function tiltOf(e) {
        if (!ui.useTilt || e.pointerType !== 'pen') return 0;
        return Math.max(0, Math.min(1, Math.hypot(e.tiltX || 0, e.tiltY || 0) / 90));
      }
      function noteInput(e) {
        var msg;
        if (e.pointerType === 'pen') {
          var p = Math.round(pressureOf(e) * 100), a = Math.round(Math.hypot(e.tiltX || 0, e.tiltY || 0));
          msg = a ? t('inputPenTilt', { p: p, a: a }) : t('inputPen', { p: p });
        } else msg = t('inputMouse');
        if (msg !== ui.input) { ui.input = msg; ctx.setStatus(msg); }
      }
      app.canvas.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'pen') penSeen = true;
        /* Nunca el dedo y el lápiz a la vez: con lápiz a la vista, los dedos solo mueven la vista. */
        if (e.pointerType === 'touch' && penSeen) return;
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        if (ui.tool === 'pan') return;
        e.preventDefault();
        try { vp.focus({ preventScroll: true }); } catch (_) { vp.focus(); }
        noteInput(e);
        var w = docPt(e); ui.kx = w.x; ui.ky = w.y; cursorOn = false;
        try { app.canvas.setPointerCapture(e.pointerId); } catch (_) {}
        if (ui.tool === 'picker') { pickColour(w.x, w.y); return; }
        if (ui.tool === 'fill') { doFill(w.x, w.y); return; }
        if (ui.tool === 'text') { placeText(w.x, w.y); return; }
        if (ui.tool === 'vp') { grabVp(w.x, w.y); drag = { kind: 'vp' }; return; }
        if (ui.tool === 'select') {
          if (ui.shapeStart) { var s0 = ui.shapeStart; ui.shapeStart = null; setSelection(s0[0], s0[1], w.x, w.y); return; }
          if (inSel(w.x, w.y)) { drag = { kind: 'move', ox: w.x - ui.selection.x, oy: w.y - ui.selection.y }; return; }
          drag = { kind: 'sel', x0: w.x, y0: w.y };
          ui.selection = null; ui.selSrc = null; showLive(false); clearLive(); render();
          return;
        }
        if (SHAPES[ui.tool]) {
          if (ui.shapeStart) { var st = ui.shapeStart; ui.shapeStart = null; clearShapePreview(); commitShape(st[0], st[1], w.x, w.y); return; }
          drag = { kind: 'shape', x0: w.x, y0: w.y, moved: false };
          return;
        }
        if (FREE.indexOf(ui.tool) >= 0 && beginStroke(w.x, w.y, pressureOf(e), tiltOf(e))) drag = { kind: 'stroke' };
      });
      app.canvas.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch' && penSeen) return;
        var w = docPt(e); ui.kx = w.x; ui.ky = w.y;
        if (!drag) { if (e.pointerType === 'pen') noteInput(e); return; }
        if (drag.kind === 'stroke') {
          var evs = (e.getCoalescedEvents && e.getCoalescedEvents()) || [];
          if (!evs.length) evs = [e];
          evs.forEach(function (ev) { var q = docPt(ev); addPoint(q.x, q.y, pressureOf(ev), tiltOf(ev)); });
          return;
        }
        if (drag.kind === 'shape') { drag.moved = true; drag.x1 = w.x; drag.y1 = w.y; drawShapePreview(drag.x0, drag.y0, w.x, w.y); return; }
        if (drag.kind === 'sel') {
          var x = Math.max(0, Math.min(drag.x0, w.x)), y = Math.max(0, Math.min(drag.y0, w.y));
          ui.selection = { x: Math.round(x), y: Math.round(y),
            w: Math.round(Math.min(W(), Math.max(drag.x0, w.x)) - x), h: Math.round(Math.min(H(), Math.max(drag.y0, w.y)) - y), fh: false, fv: false };
          render(); return;
        }
        if (drag.kind === 'move' && ui.selection) {
          ui.selection.x = Math.round(w.x - drag.ox); ui.selection.y = Math.round(w.y - drag.oy);
          selPreview(); render(); renderInspector(); return;
        }
        if (drag.kind === 'vp') { moveVpTo(w.x, w.y); return; }
      });
      function pointerUp() {
        if (!drag) return;
        var d = drag; drag = null;
        if (d.kind === 'stroke') { endStroke(true); return; }
        if (d.kind === 'shape') {
          clearShapePreview();
          if (d.moved && Math.hypot((d.x1 - d.x0), (d.y1 - d.y0)) > 3) commitShape(d.x0, d.y0, d.x1, d.y1);
          else { ui.shapeStart = [d.x0, d.y0]; ctx.announce(t('shapeStart')); ctx.setStatus(t('shapeStart')); render(); }
          return;
        }
        if (d.kind === 'sel') {
          var s = ui.selection;
          if (s && s.w > 3 && s.h > 3) setSelection(s.x, s.y, s.x + s.w, s.y + s.h);
          else { ui.selection = null; ui.shapeStart = [d.x0, d.y0]; ctx.announce(t('shapeStart')); render(); }
          return;
        }
        if (d.kind === 'move') { render(); renderInspector(); return; }
        if (d.kind === 'vp') { commitGuides(); return; }
      }
      app.canvas.addEventListener('pointerup', pointerUp);
      app.canvas.addEventListener('pointercancel', function () {
        if (drag && drag.kind === 'stroke') endStroke(false);
        drag = null; clearShapePreview();
      });

      /* ---------- Puntos de fuga ---------- */
      function grabVp(x, y) {
        var vs = activeVps(), best = 0, bd = Infinity;
        vs.forEach(function (v, i) { var d = Math.hypot(v[0] - x, v[1] - y); if (d < bd) { bd = d; best = i; } });
        ui.vpIndex = best; render(); renderInspector();
        ctx.announce(t('vpChosen', { n: best + 1 }));
      }
      function moveVpTo(x, y) {
        var s = sheet(), i = ui.vpIndex;
        if (i >= vpCount(s.guide)) return;
        s.vps[i] = [Math.round(x), Math.round(y)];
        render(); renderInspector();
      }
      function commitGuides() {
        var s = sheet(), i = ui.vpIndex;
        if (i < vpCount(s.guide)) ctx.announce(t('vpMoved', { n: i + 1, x: s.vps[i][0], y: s.vps[i][1] }));
        ctx.commit(t('undoGuide'));
      }

      /* ---------- Teclado ---------- */
      function announceCursor() {
        ctx.announce(t('cursorAt', { x: Math.round(ui.kx), y: Math.round(ui.ky), pen: ui.penDown ? t('penDown') : t('penUp') }));
      }
      function onKey(e) {
        if (!vp.contains(e.target)) return false;
        var s = sheet();
        var step = e.shiftKey ? 2 : Math.max(4, Math.round(12 / Math.max(0.25, view.scale)));
        var d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
        if (d) {
          cursorOn = true;
          if (ui.tool === 'vp' && vpCount(s.guide)) {
            var i = Math.min(ui.vpIndex, vpCount(s.guide) - 1);
            s.vps[i] = [s.vps[i][0] + d[0], s.vps[i][1] + d[1]];
            render(); renderInspector();
            ctx.announce(t('vpMoved', { n: i + 1, x: s.vps[i][0], y: s.vps[i][1] }));
            return true;
          }
          if (ui.tool === 'select' && ui.selection) {
            ui.selection.x += d[0]; ui.selection.y += d[1];
            selPreview(); render(); renderInspector();
            ctx.announce(t('selMade', { w: ui.selection.w, h: ui.selection.h, x: ui.selection.x, y: ui.selection.y }));
            return true;
          }
          ui.kx = Math.max(0, Math.min(W(), ui.kx + d[0]));
          ui.ky = Math.max(0, Math.min(H(), ui.ky + d[1]));
          if (ui.penDown && stroke) addPoint(ui.kx, ui.ky, 1, 0);
          if (ui.shapeStart && SHAPES[ui.tool]) drawShapePreview(ui.shapeStart[0], ui.shapeStart[1], ui.kx, ui.ky);
          announceCursor(); render(); return true;
        }
        if (e.key === 'Enter' || e.key === ' ') {
          if (ui.tool === 'pan' || ui.tool === 'vp') return false;
          if (ui.tool === 'picker') { pickColour(ui.kx, ui.ky); return true; }
          if (ui.tool === 'fill') { doFill(ui.kx, ui.ky); return true; }
          if (ui.tool === 'text') { placeText(ui.kx, ui.ky); return true; }
          if (ui.tool === 'select') {
            if (!ui.shapeStart) { ui.shapeStart = [ui.kx, ui.ky]; ctx.announce(t('shapeStart')); ctx.setStatus(t('shapeStart')); }
            else { var sp = ui.shapeStart; ui.shapeStart = null; setSelection(sp[0], sp[1], ui.kx, ui.ky); }
            render(); return true;
          }
          if (SHAPES[ui.tool]) {
            if (!ui.shapeStart) { ui.shapeStart = [ui.kx, ui.ky]; ctx.announce(t('shapeStart')); ctx.setStatus(t('shapeStart')); render(); }
            else { var st = ui.shapeStart; ui.shapeStart = null; clearShapePreview(); commitShape(st[0], st[1], ui.kx, ui.ky); }
            return true;
          }
          if (FREE.indexOf(ui.tool) >= 0) {
            if (!ui.penDown) { if (beginStroke(ui.kx, ui.ky, 1, 0)) { ui.penDown = true; ctx.announce(t('penDown')); ctx.setStatus(t('penDown')); } }
            else { ui.penDown = false; endStroke(true); ctx.announce(t('penUpSaved')); ctx.setStatus(t('penUp')); }
            render(); return true;
          }
          return false;
        }
        if (e.key === 'Escape') {
          if (ui.penDown || stroke || ui.shapeStart) {
            ui.penDown = false; ui.shapeStart = null;
            endStroke(false); clearShapePreview();
            ctx.announce(t('cancelled')); ctx.setStatus(t('cancelled')); render(); return true;
          }
          if (ui.selection) { clearSelection(); return true; }
          return false;
        }
        if (e.key === '[' || e.key === ']') {
          var delta = Math.max(1, Math.round(ui.size * 0.15));
          setBrushSize(ui.size + (e.key === ']' ? delta : -delta));
          ctx.announce(t('sizeSet', { n: ui.size })); ctx.setStatus(t('sizeSet', { n: ui.size })); return true;
        }
        if ((e.key === 'v' || e.key === 'V') && !e.ctrlKey && !e.metaKey && vpCount(s.guide)) {
          ui.vpIndex = (ui.vpIndex + 1) % vpCount(s.guide);
          ctx.announce(t('vpChosen', { n: ui.vpIndex + 1 })); render(); renderInspector(); return true;
        }
        return false;
      }
      vp.addEventListener('focus', function () { cursorOn = true; announceCursorStatus(); render(); });
      vp.addEventListener('blur', function () { cursorOn = false; render(); });
      function announceCursorStatus() {
        ctx.setStatus(t('cursorAt', { x: Math.round(ui.kx), y: Math.round(ui.ky), pen: ui.penDown ? t('penDown') : t('penUp') }));
      }

      /* ---------- Refrescos ---------- */
      function afterEdit(label) {
        syncSprites(); render(); renderStructure(); renderInspector(); updateSummary();
        ctx.commit(label);
      }
      function fullRefresh(doFit) {
        sizeBuffers(); dropUnused(); rebuildSprites();
        if (doFit !== false) fit();
        render(); renderStructure(); renderInspector(); updateSummary();
      }
      function updateSummary() {
        var s = sheet(), cols = coloursUsed(s), c = curChallenge();
        var used = s.layers.filter(function (l) { return l.items.length; }).length;
        ctx.setSummary(t('summary', {
          n: DOC.cur + 1, m: DOC.sheets.length, w: W(), h: H(),
          marks: marksCount(s), used: used, layers: s.layers.length, layer: layer().name,
          colours: cols.length ? cols.map(colourName).join(', ') : '—',
          sym: t('sym_' + s.sym), guide: t('guide_' + s.guide),
          challenge: c ? t(chKey(c, 'T')) : t('chFree')
        }) + (s.alt ? ' ' + s.alt : ''));
      }

      /* ---------- Estructura ---------- */
      function renderStructure() {
        var s = sheet(), nodes = [];
        nodes.push(h('h3', { text: t('series') + ' (' + DOC.sheets.length + ')' }));
        var sl = h('ul', { class: 'igs-list' });
        DOC.sheets.forEach(function (sh, i) {
          var b = h('button', { type: 'button', 'aria-current': String(i === DOC.cur) },
            h('span', { text: t('sheetN', { n: i + 1 }) }),
            h('small', { text: t('marksN', { n: marksCount(sh) }) }));
          b.addEventListener('click', function () { goSheet(i); });
          sl.appendChild(h('li', null, b));
        });
        nodes.push(sl);
        nodes.push(h('div', { class: 'igs-actions' },
          ctx.button(t('addSheet'), { icon: 'plus', onClick: function () { addSheet(false); } }),
          ctx.button(t('dupSheet'), { icon: 'copy', onClick: function () { addSheet(true); } }),
          ctx.button(t('delSheet'), { icon: 'trash', class: 'igs-danger', onClick: delSheet })));
        nodes.push(h('h3', { text: t('layers') + ' (' + s.layers.length + ')' }));
        var ll = h('ul', { class: 'igs-list' });
        for (var i = s.layers.length - 1; i >= 0; i--) (function (idx) {
          var l = s.layers[idx];
          var b = h('button', { type: 'button', 'aria-current': String(idx === s.active),
            'aria-label': l.name + ', ' + t('marksN', { n: l.items.length }) + (l.visible ? '' : ', ' + t('visible') + ': no') },
            h('span', { class: 'igd-dot', 'aria-hidden': 'true', style: 'opacity:' + (l.visible ? Math.max(0.25, l.opacity) : 0.1) }),
            h('span', { text: l.name }), h('small', { text: String(l.items.length) }));
          b.addEventListener('click', function () {
            s.active = idx;
            selLayer = (selLayer === l.id) ? null : l.id;
            renderStructure(); renderInspector(); updateSummary();
            ctx.announce(t('layerNow', { name: l.name }));
          });
          ll.appendChild(h('li', null, b));
        })(i);
        nodes.push(ll);
        nodes.push(h('div', { class: 'igs-actions' },
          ctx.button(t('addLayer'), { icon: 'plus', onClick: addLayer }),
          ctx.button(t('dupLayer'), { icon: 'copy', onClick: dupLayer }),
          ctx.button(t('mergeLayer'), { icon: 'layers', onClick: mergeLayer }),
          ctx.button(t('delLayer'), { icon: 'trash', class: 'igs-danger', onClick: delLayer })));
        ctx.setStructure(nodes);
      }

      /* ---------- Capas ---------- */
      function addLayer() {
        var s = sheet();
        if (s.layers.length >= MAXL) { ctx.announce(t('maxLayers', { n: MAXL })); ctx.setStatus(t('maxLayers', { n: MAXL })); return; }
        s.layers.splice(s.active + 1, 0, newLayer(t('layerN', { n: s.layers.length + 1 })));
        s.active += 1; selLayer = layer().id;
        rebuildSprites(); afterEdit(t('undoLayer')); ctx.announce(t('layerAdded'));
      }
      function dupLayer() {
        var s = sheet();
        if (s.layers.length >= MAXL) { ctx.announce(t('maxLayers', { n: MAXL })); ctx.setStatus(t('maxLayers', { n: MAXL })); return; }
        var l = layer();
        var copy = { id: nid('l'), name: l.name + ' ·', visible: l.visible, opacity: l.opacity, blend: l.blend,
          items: l.items.map(function (it) { var o = JSON.parse(JSON.stringify(it)); var old = o.id; o.id = nid('m'); if (images[old]) images[o.id] = images[old]; return o; }) };
        s.layers.splice(s.active + 1, 0, copy); s.active += 1; selLayer = copy.id;
        rebuildSprites(); afterEdit(t('undoLayer')); ctx.announce(t('layerDuplicated'));
      }
      function mergeLayer() {
        var s = sheet();
        if (s.active === 0) { ctx.announce(t('noMergeBelow')); ctx.setStatus(t('noMergeBelow')); return; }
        var top = s.layers[s.active], below = s.layers[s.active - 1];
        var out = D.createElement('canvas'); out.width = W(); out.height = H();
        var g = out.getContext('2d');
        g.globalAlpha = below.opacity; g.drawImage(bake(below), 0, 0);
        g.globalAlpha = top.opacity; g.globalCompositeOperation = CANVAS2D_BLEND[blendOf(top)] || 'source-over';
        g.drawImage(bake(top), 0, 0);
        var item = { k: 'img', id: nid('m'), data: out.toDataURL('image/png') };
        images[item.id] = out;
        below.items = [item]; below.opacity = 1; below.blend = 'normal';
        s.layers.splice(s.active, 1); s.active -= 1; selLayer = below.id;
        bake(below, true); dropUnused(); rebuildSprites(); afterEdit(t('undoLayer'));
        ctx.announce(t('layerMerged'));
      }
      function delLayer() {
        var s = sheet();
        if (s.layers.length <= 1) { ctx.announce(t('lastLayer')); ctx.setStatus(t('lastLayer')); return; }
        s.layers.splice(s.active, 1); s.active = Math.max(0, s.active - 1); selLayer = layer().id;
        dropUnused(); rebuildSprites(); afterEdit(t('undoLayer')); ctx.announce(t('layerDeleted'));
      }
      function moveLayer(dir) {
        var s = sheet(), i = s.active, j = i + dir;
        if (j < 0 || j >= s.layers.length) return;
        var tmp = s.layers[i]; s.layers[i] = s.layers[j]; s.layers[j] = tmp; s.active = j;
        rebuildSprites(); afterEdit(t('undoLayer')); ctx.announce(t('layerMoved'));
      }

      /* ---------- Serie ---------- */
      function goSheet(i) {
        if (i === DOC.cur) { selLayer = null; renderStructure(); renderInspector(); return; }
        DOC.cur = Math.max(0, Math.min(DOC.sheets.length - 1, i));
        selLayer = null;
        ui.selection = null; ui.selSrc = null; showLive(false); clearLive();
        rebuildSprites(); render(); renderStructure(); renderInspector(); updateSummary();
        ctx.announce(t('sheetOf', { n: DOC.cur + 1, m: DOC.sheets.length }));
      }
      function addSheet(dup) {
        if (DOC.sheets.length >= MAXS) { ctx.announce(t('maxSheets', { n: MAXS })); ctx.setStatus(t('maxSheets', { n: MAXS })); return; }
        var s;
        if (dup) {
          s = JSON.parse(JSON.stringify(sheet())); s.id = nid('s');
          s.layers.forEach(function (l) {
            l.id = nid('l');
            l.items.forEach(function (it) { var old = it.id; it.id = nid('m'); if (images[old]) images[it.id] = images[old]; });
          });
        } else s = newSheet();
        DOC.sheets.splice(DOC.cur + 1, 0, s); DOC.cur += 1; selLayer = null;
        rebuildSprites(); afterEdit(t('undoSheet'));
        ctx.announce(t('sheetAdded') + ' ' + t('sheetOf', { n: DOC.cur + 1, m: DOC.sheets.length }));
      }
      function delSheet() {
        if (DOC.sheets.length <= 1) { ctx.announce(t('lastSheet')); ctx.setStatus(t('lastSheet')); return; }
        DOC.sheets.splice(DOC.cur, 1); DOC.cur = Math.max(0, DOC.cur - 1); selLayer = null;
        dropUnused(); rebuildSprites(); afterEdit(t('undoSheet')); ctx.announce(t('sheetDeleted'));
      }

      /* ---------- Propiedades ---------- */
      var chResult = null;
      function fk(node, key) { if (node && node.input) node.input.setAttribute('data-igs-k', key); return node; }
      /* Volver a pintar Propiedades sin reentrar: al quitar un campo con el foco puesto salta su
         evento «change», que a veces pide otro repintado. Se apunta y se hace después. */
      var rendering = false, renderQueued = false;
      function renderInspector() {
        if (rendering) { renderQueued = true; return; }
        rendering = true;
        try { ctx.keepFocus(ctx.inspector, buildInspector); } finally { rendering = false; }
        if (renderQueued) { renderQueued = false; root.setTimeout(renderInspector, 0); }
      }
      function buildInspector() {
        var out = [], s = sheet(), l = null;
        if (selLayer) for (var i = 0; i < s.layers.length; i++) if (s.layers[i].id === selLayer) l = s.layers[i];
        /* El reto es la tarea principal: se ve siempre, haya o no algo seleccionado. */
        out.push.apply(out, challengeBlock());
        if (ui.selection) out.push.apply(out, selectionBlock());
        else if (l) out.push.apply(out, layerBlock(l));
        else out.push.apply(out, docBlock());
        out.push.apply(out, toolBlock());
        out.push.apply(out, colourBlock());
        out.push.apply(out, guideBlock());
        ctx.setInspector(out);
      }
      function toolBlock() {
        var out = [h('h4', { text: t('brushTitle') + ': ' + t('tool_' + ui.tool) })];
        var paints = FREE.indexOf(ui.tool) >= 0 || SHAPES[ui.tool] || ui.tool === 'fill' || ui.tool === 'text';
        if (paints) {
          out.push(fk(F.number(t('size'), ui.size, { min: 1, max: 300, step: 1, unit: t('px'), onChange: function (v) { setBrushSize(Math.round(v)); } }), 'size'));
          out.push(fk(F.range(t('opacity'), Math.round(ui.opacity * 100), { min: 5, max: 100, step: 1, unit: t('pct'), onChange: function (v) { ui.opacity = v / 100; } }), 'op'));
        }
        if (FREE.indexOf(ui.tool) >= 0) {
          out.push(fk(F.range(t('hardness'), Math.round(ui.hardness * 100), { min: 1, max: 98, step: 1, unit: t('pct'), onChange: function (v) { ui.hardness = v / 100; } }), 'hard'));
          out.push(fk(F.range(t('flow'), Math.round(ui.flow * 100), { min: 2, max: 100, step: 1, unit: t('pct'), onChange: function (v) { ui.flow = v / 100; } }), 'flow'));
          out.push(fk(F.range(t('stabilise'), Math.round(ui.stabilise * 100), { min: 0, max: 92, step: 1, unit: t('pct'), onChange: function (v) { ui.stabilise = v / 100; } }), 'stab'));
          out.push(fk(F.check(t('usePressure'), ui.usePressure, { onChange: function (v) { ui.usePressure = !!v; } }), 'press'));
          out.push(fk(F.check(t('useTilt'), ui.useTilt, { onChange: function (v) { ui.useTilt = !!v; } }), 'tilt'));
          out.push(h('p', { class: 'igs-muted', text: t('brushNote') }));
        }
        if (SHAPES[ui.tool]) out.push(fk(F.check(t('fillShapes'), ui.fillShapes, { onChange: function (v) { ui.fillShapes = !!v; } }), 'fillsh'));
        if (ui.tool === 'text') {
          out.push(fk(F.text(t('textContent'), ui.text, { max: 120, onChange: function (v) { ui.text = v; } }), 'txt'));
          out.push(fk(F.number(t('textSize'), ui.textSize, { min: 8, max: 400, step: 1, unit: t('px'), onChange: function (v) { ui.textSize = Math.round(v); } }), 'txts'));
          out.push(h('p', { class: 'igs-muted', text: t('textHelp') }));
        }
        return out;
      }
      function challengeBlock() {
        var out = [h('h4', { text: t('chTitle') })], c = curChallenge();
        if (!c) out.push(h('p', { class: 'igs-muted', text: t('chFree') + '. ' + t('chFreeDesc') }));
        else {
          out.push(h('p', { class: 'igd-ch-head' }, h('strong', { text: t(chKey(c, 'T')) }), h('span', { text: ' · ' + t('chLevel', { n: c.lv, name: t('lvl' + c.lv) }) })));
          out.push(h('p', { text: t(chKey(c, 'G')) }));
          var lim = t(chKey(c, 'L'));
          if (lim) out.push(h('ul', { class: 'igd-limits' }, lim.split('|').map(function (x) { return h('li', { text: x }); })));
          out.push(h('p', { class: 'igs-muted', text: t('chTip') + ': ' + t(chKey(c, 'H')) }));
          if (c.gen) {
            out.push(h('p', { class: 'igd-gen', text: genText || '' }));
            out.push(ctx.button(t('genBtn'), { icon: 'sparkle', onClick: generate }));
          } else out.push(ctx.button(t('chCheck'), { icon: 'check', class: 'igs-primary', onClick: runCheck }));
          out.push(ctx.button(t('chClear'), { icon: 'flag', onClick: function () { DOC.challenge = null; chResult = null; renderInspector(); updateSummary(); ctx.commit(t('undoDoc')); } }));
          if (chResult) out.push(chResult);
        }
        return out;
      }
      function docBlock() {
        var out = [h('h4', { text: t('docSection') })];
        out.push(fk(F.text(t('docTitle'), DOC.title, { max: 80, onChange: function (v) { DOC.title = v.slice(0, 80); ctx.commit(t('undoDoc')); } }), 'title'));
        out.push(fk(F.select(t('format'), DOC.format, [['h', t('format_h')], ['v', t('format_v')], ['sq', t('format_sq')]], { onChange: setFormat }), 'fmt'));
        out.push(fk(F.text(t('altLabel'), sheet().alt, { multiline: true, max: 600, onChange: function (v) { sheet().alt = v.slice(0, 600); updateSummary(); ctx.commit(t('undoDoc')); } }), 'alt'));
        out.push(h('p', { class: 'igs-muted', text: t('altHelp') }));
        out.push(fk(F.text(t('rulesLabel'), DOC.rules, { multiline: true, max: 600, onChange: function (v) { DOC.rules = v.slice(0, 600); renderInspector(); ctx.commit(t('undoDoc')); } }), 'rules'));
        out.push(h('p', { class: 'igs-muted', text: t('rulesCount', { r: ruleLines(), d: drawnSheets(), m: DOC.sheets.length }) }));
        return out;
      }
      function layerBlock(l) {
        var s = sheet(), i = s.layers.indexOf(l);
        var out = [h('h4', { text: t('layerTitle', { name: l.name }) })];
        out.push(fk(F.text(t('layerName'), l.name, { max: 40, onChange: function (v) { l.name = v.slice(0, 40) || l.name; renderStructure(); renderInspector(); updateSummary(); ctx.commit(t('undoLayer')); } }), 'lname'));
        out.push(fk(F.check(t('visible'), l.visible, { onChange: function (v) { l.visible = !!v; syncSprites(); render(); renderStructure(); updateSummary(); ctx.commit(t('undoLayer')); } }), 'lvis'));
        out.push(fk(F.range(t('layerOpacity'), Math.round(l.opacity * 100), { min: 0, max: 100, step: 1, unit: t('pct'),
          onInput: function (v) { l.opacity = v / 100; syncSprites(); render(); },
          onChange: function (v) { l.opacity = v / 100; syncSprites(); render(); renderStructure(); ctx.commit(t('undoLayer')); } }), 'lop'));
        out.push(fk(F.select(t('blend'), l.blend, BLENDS.map(function (b) { return [b, t('blend_' + b)]; }), { onChange: function (v) { l.blend = v; syncSprites(); render(); ctx.commit(t('undoLayer')); } }), 'lbl'));
        out.push(h('div', { class: 'igs-actions' },
          ctx.button(t('layerUp'), { icon: 'plus', onClick: function () { moveLayer(1); }, disabled: i >= s.layers.length - 1 }),
          ctx.button(t('layerDown'), { icon: 'minus', onClick: function () { moveLayer(-1); }, disabled: i <= 0 }),
          ctx.button(t('mergeLayer'), { icon: 'layers', onClick: mergeLayer, disabled: i === 0 }),
          ctx.button(t('delLayer'), { icon: 'trash', class: 'igs-danger', onClick: delLayer })));
        return out;
      }
      function selectionBlock() {
        var s = ui.selection, out = [h('h4', { text: t('selTitle') })];
        out.push(h('p', { class: 'igs-muted', text: t('selHelp') }));
        out.push(fk(F.number(t('selX'), s.x, { min: -2000, max: 4000, step: 1, unit: t('px'), onChange: function (v) { s.x = Math.round(v); selPreview(); render(); } }), 'sx'));
        out.push(fk(F.number(t('selY'), s.y, { min: -2000, max: 4000, step: 1, unit: t('px'), onChange: function (v) { s.y = Math.round(v); selPreview(); render(); } }), 'sy'));
        out.push(fk(F.number(t('selW'), s.w, { min: 1, max: 4000, step: 1, unit: t('px'), onChange: function (v) { s.w = Math.max(1, Math.round(v)); selPreview(); render(); } }), 'sw'));
        out.push(fk(F.number(t('selH'), s.h, { min: 1, max: 4000, step: 1, unit: t('px'), onChange: function (v) { s.h = Math.max(1, Math.round(v)); selPreview(); render(); } }), 'sh'));
        out.push(fk(F.check(t('selFlipH'), !!s.fh, { onChange: function (v) { s.fh = !!v; selPreview(); render(); } }), 'sfh'));
        out.push(fk(F.check(t('selFlipV'), !!s.fv, { onChange: function (v) { s.fv = !!v; selPreview(); render(); } }), 'sfv'));
        out.push(h('div', { class: 'igs-actions' },
          ctx.button(t('selApply'), { icon: 'check', class: 'igs-primary', onClick: applySelection }),
          ctx.button(t('selDelete'), { icon: 'erase', onClick: deleteSelection }),
          ctx.button(t('selCancel'), { icon: 'stop', onClick: clearSelection })));
        return out;
      }
      function colourBlock() {
        var out = [h('h4', { text: t('colourTitle') })];
        var pal = h('div', { class: 'igd-palette', role: 'radiogroup', 'aria-label': t('palette') });
        var inPal = PALETTE.indexOf(ui.colour);
        PALETTE.forEach(function (c, i) {
          var b = h('button', { type: 'button', role: 'radio', class: 'igd-sw', 'aria-checked': String(c === ui.colour),
            'aria-label': colourName(c), style: 'background:' + c,
            tabindex: (c === ui.colour || (inPal < 0 && i === 0)) ? '0' : '-1', dataset: { igsK: 'sw' + i } });
          b.addEventListener('click', function () { setColour(c); });
          b.addEventListener('keydown', function (e) {
            var dd = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 4, ArrowUp: -4 }[e.key];
            if (!dd) return;
            e.preventDefault();
            var j = (i + dd + PALETTE.length) % PALETTE.length;
            setColour(PALETTE[j]);
            var nb = ctx.inspector.querySelector('[data-igs-k="sw' + j + '"]');
            if (nb) nb.focus();
          });
          pal.appendChild(b);
        });
        out.push(pal);
        out.push(fk(F.color(t('customColour'), ui.colour, { onChange: function (v) { setColour(v); } }), 'col'));
        out.push(h('p', { class: 'igs-muted', text: t('coloursUsed', { n: coloursUsed(sheet()).length }) }));
        out.push(h('h4', { text: t('mixTitle') }));
        out.push(fk(F.color(t('mixA'), ui.mixA, { onChange: function (v) { ui.mixA = v; renderInspector(); } }), 'mxa'));
        out.push(fk(F.color(t('mixB'), ui.mixB, { onChange: function (v) { ui.mixB = v; renderInspector(); } }), 'mxb'));
        out.push(fk(F.range(t('mixAmount'), Math.round(ui.mixAmount * 100), { min: 0, max: 100, step: 1, unit: t('pct'),
          onInput: function (v) { ui.mixAmount = v / 100; }, onChange: function (v) { ui.mixAmount = v / 100; renderInspector(); } }), 'mxk'));
        var mixed = mixHex(ui.mixA, ui.mixB, ui.mixAmount);
        out.push(h('p', { class: 'igd-mix' }, h('span', { class: 'igd-chip', 'aria-hidden': 'true', style: 'background:' + mixed }), h('span', { text: t('mixResult', { c: colourName(mixed) }) })));
        var mb = ctx.button(t('mixUse'), { icon: 'bucket', onClick: function () { setColour(mixed); } });
        mb.setAttribute('data-igs-k', 'mixuse'); out.push(mb);
        out.push(h('h4', { text: t('valuesTitle') }));
        out.push(fk(F.color(t('valuesBase'), ui.valBase, { onChange: function (v) { ui.valBase = v; renderInspector(); } }), 'vb'));
        out.push(fk(F.color(t('valuesLightDir'), ui.valLight, { onChange: function (v) { ui.valLight = v; renderInspector(); } }), 'vl'));
        var vv = threeValues(ui.valBase, ui.valLight);
        [['light', t('valLight')], ['mid', t('valMid')], ['shadow', t('valShadow')]].forEach(function (p, i) {
          var col = vv[p[0]];
          var b = ctx.button(t('valuesUse', { name: p[1] }), { onClick: function () { setColour(col); } });
          b.classList.add('igd-value-btn');
          b.setAttribute('data-igs-k', 'val' + i);
          b.insertBefore(h('span', { class: 'igd-chip', 'aria-hidden': 'true', style: 'background:' + col }), b.firstChild);
          out.push(b);
        });
        out.push(h('p', { class: 'igs-muted', text: t('valuesNote') }));
        return out;
      }
      function guideBlock() {
        var s = sheet(), out = [h('h4', { text: t('symTitle') })];
        out.push(fk(F.select(t('sym'), s.sym, SYMS.map(function (k) { return [k, t('sym_' + k)]; }), {
          onChange: function (v) { s.sym = v; render(); renderInspector(); updateSummary(); ctx.announce(t('symChanged', { s: t('sym_' + v) })); ctx.commit(t('undoGuide')); } }), 'sym'));
        if (s.sym === 'radial' || s.sym === 'kaleido') {
          out.push(fk(F.number(t('symN'), s.symN, { min: 2, max: 16, step: 1, onChange: function (v) { s.symN = Math.max(2, Math.min(16, Math.round(v))); render(); ctx.commit(t('undoGuide')); } }), 'symn'));
        }
        out.push(fk(F.select(t('guide'), s.guide, GUIDES.map(function (k) { return [k, t('guide_' + k)]; }), {
          onChange: function (v) { s.guide = v; s.vps = defaultVps(v, s.horizon, W(), H()); ui.vpIndex = 0; render(); renderInspector(); updateSummary(); ctx.announce(t('guideChanged', { g: t('guide_' + v) })); ctx.commit(t('undoGuide')); } }), 'guide'));
        if (s.guide === 'grid') out.push(fk(F.number(t('gridSize'), s.grid, { min: 10, max: 300, step: 5, unit: t('px'), onChange: function (v) { s.grid = Math.max(10, Math.min(300, Math.round(v))); render(); ctx.commit(t('undoGuide')); } }), 'grid'));
        if (vpCount(s.guide)) {
          out.push(fk(F.range(t('horizon'), Math.round(s.horizon * 100), { min: 2, max: 98, step: 1, unit: t('pct'),
            onInput: function (v) { setHorizon(v / 100); }, onChange: function (v) { setHorizon(v / 100); renderInspector(); ctx.commit(t('undoGuide')); } }), 'hor'));
          activeVps().forEach(function (v, i) {
            out.push(fk(F.number(t('vpX', { n: i + 1 }), v[0], { min: -6000, max: 6000, step: 1, unit: t('px'),
              onChange: function (val) { s.vps[i][0] = Math.round(val); render(); ctx.commit(t('undoGuide')); } }), 'vpx' + i));
            out.push(fk(F.number(t('vpY', { n: i + 1 }), v[1], { min: -6000, max: 6000, step: 1, unit: t('px'),
              onChange: function (val) { s.vps[i][1] = Math.round(val); render(); ctx.commit(t('undoGuide')); } }), 'vpy' + i));
          });
        }
        if (vpCount(s.guide) || s.guide === 'grid') out.push(fk(F.check(t('snap'), s.snap, { onChange: function (v) { s.snap = !!v; ctx.commit(t('undoGuide')); } }), 'snap'));
        out.push(fk(F.check(t('showGuides'), ui.showGuides, { onChange: function (v) { ui.showGuides = !!v; render(); } }), 'sg'));
        out.push(fk(F.check(t('ruler'), ui.ruler, { onChange: function (v) { ui.ruler = !!v; render(); } }), 'rul'));
        out.push(h('p', { class: 'igs-muted', text: t('guideNote') }));
        return out;
      }
      function setHorizon(v) {
        var s = sheet(), old = s.horizon;
        s.horizon = Math.max(0.02, Math.min(0.98, v));
        var hy = Math.round(s.horizon * H()), oldY = old * H();
        s.vps.forEach(function (p, i) { if (i < 2 && Math.abs(p[1] - oldY) < 2.5) p[1] = hy; });
        render();
      }
      function setFormat(v) {
        if (!FORMATS[v] || v === DOC.format) return;
        DOC.format = v;
        Object.keys(canvases).forEach(function (k) { delete canvases[k]; });
        Object.keys(textures).forEach(function (k) { textures[k].destroy(true); delete textures[k]; });
        sigs = {};
        ui.kx = W() / 2; ui.ky = H() / 2;
        ui.selection = null; ui.selSrc = null; showLive(false);
        fullRefresh(true);
        ctx.commit(t('undoDoc'));
        ctx.announce(t('formatChanged')); ctx.setStatus(t('formatChanged'));
      }
      function setColour(c) {
        if (!isHex(c)) return;
        ui.colour = c; renderInspector();
        ctx.announce(t('colourNow', { c: colourName(c) }));
      }
      function setBrushSize(n) { ui.size = Math.max(1, Math.min(300, Math.round(n))); renderInspector(); render(); }
      function runCheck() {
        var c = curChallenge(); if (!c) return;
        var r = evaluate(c), allOk = r.length > 0 && r.every(function (x) { return x[0]; });
        chResult = h('div', { class: 'igd-check' },
          h('p', { class: allOk ? 'igd-ok' : 'igd-partial', text: allOk ? t('chAllOk') : t('chSome') }),
          h('ul', { class: 'igd-limits' }, r.map(function (x) { return h('li', { text: (x[0] ? '✓ ' : '· ') + x[1] }); })));
        renderInspector();
        ctx.announce((allOk ? t('chAllOk') : t('chSome')) + ' ' + r.map(function (x) { return x[1]; }).join('. '));
        ctx.setStatus(allOk ? t('chAllOk') : t('chSome'));
      }
      function generate() {
        var pools = t('genPools').split('||').map(function (p) { return p.split('|'); });
        var rnd = ctx.rng((Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0);
        function pick(a) { return a[Math.floor(rnd() * a.length)]; }
        genText = t('genOut', { a: pick(pools[0]), b: pick(pools[1]), c: pick(pools[2]) });
        renderInspector(); ctx.announce(genText); ctx.setStatus(genText);
      }

      /* ---------- Herramientas ---------- */
      ctx.setTools([
        { id: 'pencil', label: t('tool_pencil'), icon: 'pen' },
        { id: 'soft', label: t('tool_soft'), icon: 'weight' },
        { id: 'marker', label: t('tool_marker'), icon: 'line' },
        { id: 'eraser', label: t('tool_eraser'), icon: 'erase' },
        { id: 'line', label: t('tool_line'), icon: 'line' },
        { id: 'fill', label: t('tool_fill'), icon: 'bucket' },
        { id: 'select', label: t('tool_select'), icon: 'select' },
        { id: 'water', label: t('tool_water'), icon: 'wave', level: 'more' },
        { id: 'chalk', label: t('tool_chalk'), icon: 'anchor', level: 'more' },
        { id: 'air', label: t('tool_air'), icon: 'sparkle', level: 'more' },
        { id: 'picker', label: t('tool_picker'), icon: 'eyedrop', level: 'more' },
        { id: 'rect', label: t('tool_rect'), icon: 'square', level: 'more' },
        { id: 'ellipse', label: t('tool_ellipse'), icon: 'circle', level: 'more' },
        { id: 'text', label: t('tool_text'), icon: 'text', level: 'more' },
        { id: 'vp', label: t('tool_vp'), icon: 'corners', level: 'more' },
        { id: 'pan', label: t('tool_pan'), icon: 'pan', level: 'more' },
        { separator: true },
        { id: 'fitv', label: t('fitView'), icon: 'fit', action: function () { fit(); render(); } }
      ], { initial: 'pencil' });

      /* ---------- Exportaciones ---------- */
      function fileBase() { return (ctx.lang === 'en' ? 'drawing' : 'dibujo') + '-' + (slug(DOC.title) || ctx.stamp()); }
      function compositeCanvas(sheetIndex) {
        var keep = DOC.cur;
        if (sheetIndex !== undefined) DOC.cur = sheetIndex;
        var c = D.createElement('canvas'); c.width = W(); c.height = H();
        var g = c.getContext('2d');
        g.fillStyle = '#ffffff'; g.fillRect(0, 0, c.width, c.height);
        sheet().layers.forEach(function (l) {
          if (!l.visible) return;
          g.globalAlpha = l.opacity;
          g.globalCompositeOperation = CANVAS2D_BLEND[blendOf(l)] || 'source-over';
          g.drawImage(bake(l), 0, 0);
        });
        g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
        DOC.cur = keep;
        return c;
      }
      ctx.addExport(t('exportPng'), function () {
        ctx.canvasBlob(ctx.canvasWithCredit(compositeCanvas(), '#ffffff')).then(function (b) {
          ctx.download(b, fileBase() + '-' + (DOC.cur + 1) + '.png');
        });
      }, 'download');
      ctx.addExport(t('exportLayers'), function () {
        var vis = layers().filter(function (l) { return l.visible; });
        if (!vis.length) vis = layers();
        var files = [];
        vis.reduce(function (pr, l, i) {
          return pr.then(function () {
            return ctx.canvasBlob(ctx.canvasWithCredit(bake(l), 'rgba(0,0,0,0)'))
              .then(function (b) { return b.arrayBuffer(); })
              .then(function (buf) {
                files.push({ name: t('layerFile', { n: String(i + 1).padStart(2, '0'), name: slug(l.name) || 'x' }) + '.png', data: new Uint8Array(buf) });
              });
          });
        }, Promise.resolve()).then(function () {
          ctx.download(zipStore(files), fileBase() + '-' + (ctx.lang === 'en' ? 'layers' : 'capas') + '.zip');
          ctx.announce(t('zipDone', { n: files.length })); ctx.setStatus(t('zipDone', { n: files.length }));
        });
      }, 'layers');
      ctx.addExport(t('exportSvg'), function () {
        var r = buildSvg();
        if (!r.n) { ctx.announce(t('svgEmpty')); ctx.setStatus(t('svgEmpty')); return; }
        ctx.download(new Blob([r.svg], { type: 'image/svg+xml' }), fileBase() + '-' + (DOC.cur + 1) + '.svg');
        ctx.announce(t('svgDone', { n: r.n })); ctx.setStatus(t('svgDone', { n: r.n }));
      }, 'file');
      ctx.addExport(t('exportPrint'), function () {
        var pages = DOC.sheets.map(function (s, i) {
          var c = compositeCanvas(i), w = W(), hh = H();
          var svg = D.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 ' + w + ' ' + (hh + 100));
          svg.setAttribute('width', '185mm');
          svg.setAttribute('role', 'img');
          var title = t('printTitle', { title: DOC.title || t('untitled'), n: i + 1, m: DOC.sheets.length });
          svg.setAttribute('aria-label', title);
          svg.innerHTML = '<title>' + esc(title) + '</title><desc>' + esc(s.alt || '') + '</desc>' +
            '<rect width="' + w + '" height="' + (hh + 100) + '" fill="#ffffff"/>' +
            '<image x="0" y="0" width="' + w + '" height="' + hh + '" href="' + c.toDataURL('image/png') + '"/>' +
            '<text x="8" y="' + (hh + 36) + '" font-family="Atkinson Hyperlegible, Arial, sans-serif" font-size="26" fill="#17395c">' + esc(title) + '</text>' +
            '<text x="8" y="' + (hh + 70) + '" font-family="Atkinson Hyperlegible, Arial, sans-serif" font-size="20" fill="#44586c">' + esc((s.alt || '').slice(0, 110)) + '</text>' +
            '<text x="' + (w - 8) + '" y="' + (hh + 94) + '" text-anchor="end" font-family="Atkinson Hyperlegible, Arial, sans-serif" font-size="18" fill="#44586c">IRIS GREEN · irisgreen.eu</text>';
          return svg;
        });
        ctx.printPages(pages, { landscape: DOC.format === 'h' });
      }, 'file');

      function buildSvg() {
        var s = sheet(), w = W(), hh = H(), n = 0, body = '';
        s.layers.forEach(function (l) {
          if (!l.visible) return;
          var g = '';
          l.items.forEach(function (it) {
            var piece = '';
            if (it.k === 's') {
              if (it.pts.length < 8) return;
              var pts = [];
              for (var i = 0; i + 3 < it.pts.length; i += 4) pts.push(it.pts[i] + ',' + it.pts[i + 1]);
              piece = '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + esc(it.colour) + '" stroke-width="' + it.size +
                '" stroke-opacity="' + it.opacity.toFixed(2) + '" stroke-linecap="round" stroke-linejoin="round"/>';
            } else if (it.k === 'g') {
              var fill = it.fill && it.shape !== 'line' ? esc(it.colour) : 'none';
              if (it.shape === 'line') piece = '<line x1="' + it.x0 + '" y1="' + it.y0 + '" x2="' + it.x1 + '" y2="' + it.y1 + '" stroke="' + esc(it.colour) + '" stroke-width="' + it.size + '" stroke-opacity="' + it.opacity.toFixed(2) + '" stroke-linecap="round"/>';
              else if (it.shape === 'rect') piece = '<rect x="' + Math.min(it.x0, it.x1) + '" y="' + Math.min(it.y0, it.y1) + '" width="' + Math.abs(it.x1 - it.x0) + '" height="' + Math.abs(it.y1 - it.y0) + '" fill="' + fill + '" fill-opacity="' + it.opacity.toFixed(2) + '" stroke="' + esc(it.colour) + '" stroke-width="' + it.size + '" stroke-opacity="' + it.opacity.toFixed(2) + '"/>';
              else piece = '<ellipse cx="' + ((it.x0 + it.x1) / 2) + '" cy="' + ((it.y0 + it.y1) / 2) + '" rx="' + (Math.abs(it.x1 - it.x0) / 2 || 0.5) + '" ry="' + (Math.abs(it.y1 - it.y0) / 2 || 0.5) + '" fill="' + fill + '" fill-opacity="' + it.opacity.toFixed(2) + '" stroke="' + esc(it.colour) + '" stroke-width="' + it.size + '" stroke-opacity="' + it.opacity.toFixed(2) + '"/>';
            } else if (it.k === 't') {
              piece = '<text x="' + it.x + '" y="' + it.y + '" font-family="Atkinson Hyperlegible, Arial, sans-serif" font-size="' + it.size + '" fill="' + esc(it.colour) + '" fill-opacity="' + it.opacity.toFixed(2) + '">' + esc(it.text) + '</text>';
            } else return;
            var trs = (it.k === 's' || it.k === 'g') ? symTransforms(it.sym, it.symN, w, hh) : [[1, 0, 0, 1, 0, 0]];
            trs.forEach(function (m) {
              n += 1;
              g += isIdentity(m) ? piece
                : '<g transform="matrix(' + m.map(function (v) { return Math.round(v * 1e4) / 1e4; }).join(' ') + ')">' + piece + '</g>';
            });
          });
          if (g) body += '<g opacity="' + l.opacity.toFixed(2) + '" data-capa="' + esc(l.name) + '">' + g + '</g>';
        });
        if (ui.showGuides && vpCount(s.guide)) {
          var hy = s.horizon * hh;
          body += '<g stroke="#a8336f" stroke-opacity="0.5" stroke-width="2" data-guias="1"><line x1="0" y1="' + hy + '" x2="' + w + '" y2="' + hy + '"/>' +
            activeVps().map(function (v) { return '<circle cx="' + v[0] + '" cy="' + v[1] + '" r="7" fill="#a8336f" stroke="none"/>'; }).join('') + '</g>';
          n += 1;
        }
        var title = (DOC.title || t('untitled')) + ' · ' + t('sheetOf', { n: DOC.cur + 1, m: DOC.sheets.length });
        var svg = '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + (hh + 34) +
          '" viewBox="0 0 ' + w + ' ' + (hh + 34) + '" role="img" aria-label="' + esc(title) + '">' +
          '<title>' + esc(title) + '</title><desc>' + esc((s.alt ? s.alt + ' ' : '') + t('svgNote')) + '</desc>' +
          '<rect width="' + w + '" height="' + (hh + 34) + '" fill="#ffffff"/>' + body +
          '<text x="' + (w - 8) + '" y="' + (hh + 24) + '" text-anchor="end" font-family="Atkinson Hyperlegible, Arial, sans-serif" font-size="16" fill="#17395c">IRIS GREEN · irisgreen.eu</text></svg>';
        return { svg: svg, n: n };
      }

      /* ---------- Órdenes ---------- */
      ctx.command('check', t('cmdCheck'), t('chTitle'), runCheck);
      ctx.command('newsheet', t('cmdNewSheet'), t('series'), function () { addSheet(false); });
      ctx.command('addlayer', t('cmdAddLayer'), t('layers'), addLayer);
      ctx.command('fit', t('cmdFit'), '', function () { fit(); render(); });
      ctx.command('values', t('cmdValues'), t('colourTitle'), function () {
        var vv = threeValues(ui.valBase, ui.valLight);
        selLayer = null; ui.selection = null; renderInspector();
        ctx.announce(t('valuesTitle') + ': ' + [vv.light, vv.mid, vv.shadow].map(colourName).join(', '));
      });

      /* ---------- Puntos de partida ---------- */
      function strokeFrom(tool, colour, size, opacity, pts, sym, symN) {
        return { k: 's', id: nid('m'), tool: tool, colour: colour, size: size, opacity: opacity,
          hardness: BRUSHES[tool].hardness, flow: BRUSHES[tool].flow, sym: sym || 'no', symN: symN || 8,
          snap: null, seed: 1000 + seq * 37, pts: pts };
      }
      function shapeFrom(shape, colour, size, opacity, fill, x0, y0, x1, y1, snapK) {
        return { k: 'g', id: nid('m'), shape: shape, colour: colour, size: size, opacity: opacity, fill: !!fill,
          sym: 'no', symN: 8, snap: snapK || null, x0: r1(x0), y0: r1(y0), x1: r1(x1), y1: r1(y1) };
      }
      function poly(list) { var o = []; list.forEach(function (p) { o.push(r1(p[0]), r1(p[1]), 1, 0); }); return o; }
      function example(id) {
        blankDoc('h');
        var s = sheet(), w = W(), hh = H();
        if (id === 'landscape') {
          s.layers = [newLayer(t('layerBg')), newLayer(t('layerN', { n: 2 })), newLayer(t('layerN', { n: 3 }))];
          s.active = 2;
          s.layers[0].items.push(shapeFrom('rect', '#b8c2cc', 2, 1, true, 0, 0, w, hh * 0.58));
          s.layers[0].items.push(shapeFrom('ellipse', '#f2c14e', 4, 1, true, w * 0.68, hh * 0.08, w * 0.83, hh * 0.23));
          s.layers[1].items.push(shapeFrom('rect', '#6c8a2b', 3, 0.85, true, 0, hh * 0.56, w, hh * 0.79));
          s.layers[1].items.push(strokeFrom('soft', '#2e8b57', 64, 0.5, poly([[0, hh * 0.6], [w * 0.25, hh * 0.52], [w * 0.5, hh * 0.62], [w * 0.75, hh * 0.54], [w, hh * 0.6]])));
          s.layers[2].items.push(shapeFrom('rect', '#17202a', 3, 0.9, true, 0, hh * 0.79, w, hh));
          s.layers[2].items.push(strokeFrom('pencil', '#17202a', 22, 1, poly([[w * 0.2, hh * 0.98], [w * 0.2, hh * 0.62], [w * 0.17, hh * 0.5]])));
          s.layers[2].items.push(strokeFrom('pencil', '#17202a', 14, 1, poly([[w * 0.2, hh * 0.7], [w * 0.29, hh * 0.58]])));
        } else if (id === 'mandala') {
          s.sym = 'radial'; s.symN = 8; s.active = 1;
          s.layers[0].items.push(shapeFrom('rect', '#f4f7fa', 2, 1, true, 0, 0, w, hh));
          var cx = w / 2, cy = hh / 2;
          s.layers[1].items.push(strokeFrom('pencil', '#274690', 8, 1, poly([[cx, cy - 40], [cx + 26, cy - 110], [cx, cy - 180]]), 'radial', 8));
          s.layers[1].items.push(strokeFrom('marker', '#a8336f', 16, 0.8, poly([[cx + 50, cy - 130], [cx + 86, cy - 170], [cx + 130, cy - 180]]), 'radial', 8));
          s.layers[1].items.push(strokeFrom('pencil', '#1f7a8c', 6, 1, poly([[cx, cy - 230], [cx + 36, cy - 265], [cx + 80, cy - 255]]), 'radial', 8));
        } else if (id === 'street') {
          s.guide = 'p2'; s.horizon = 0.6; s.vps = defaultVps('p2', 0.6, w, hh); s.active = 1;
          var hy = s.horizon * hh;
          s.layers[0].items.push(shapeFrom('rect', '#dfe6ee', 2, 1, true, 0, 0, w, hy));
          s.layers[0].items.push(shapeFrom('rect', '#e8e1d6', 2, 1, true, 0, hy, w, hh));
          s.layers[1].items.push(shapeFrom('line', '#17202a', 5, 1, false, w * 0.45, hh * 0.24, w * 0.45, hh * 0.9));
          [[0, 0.75], [1, 0.6]].forEach(function (pair) {
            var v = s.vps[pair[0]];
            [[w * 0.45, hh * 0.24], [w * 0.45, hh * 0.9]].forEach(function (p) {
              var dx = v[0] - p[0], dy = v[1] - p[1];
              s.layers[1].items.push(shapeFrom('line', '#17202a', 3, 1, false, p[0], p[1], p[0] + dx * pair[1], p[1] + dy * pair[1], 'vp' + (pair[0] + 1)));
            });
          });
        } else if (id === 'sphere') {
          s.active = 1;
          var vv = threeValues('#1f5f8b', '#f2c14e'), R = Math.min(w, hh) * 0.28, ccx = w * 0.45, ccy = hh * 0.44;
          s.layers[0].items.push(shapeFrom('ellipse', vv.shadow, 2, 0.45, true, ccx - R * 1.5, ccy + R * 0.85, ccx + R * 1.05, ccy + R * 1.2));
          s.layers[1].items.push(shapeFrom('ellipse', vv.mid, 3, 1, true, ccx - R, ccy - R, ccx + R, ccy + R));
          s.layers[1].items.push(strokeFrom('soft', vv.shadow, R * 0.9, 0.75, poly([[ccx + R * 0.35, ccy + R * 0.3], [ccx + R * 0.1, ccy + R * 0.58], [ccx - R * 0.25, ccy + R * 0.62]])));
          s.layers[1].items.push(strokeFrom('soft', vv.light, R * 0.55, 0.85, poly([[ccx - R * 0.38, ccy - R * 0.42], [ccx - R * 0.15, ccy - R * 0.5]])));
          ui.valBase = '#1f5f8b';
        }
      }
      function applySetup(c) {
        var s = sheet(), su = c.setup || {};
        if (su.sym) s.sym = su.sym;
        if (su.symN) s.symN = su.symN;
        if (su.horizon) s.horizon = su.horizon;
        if (su.guide) { s.guide = su.guide; s.vps = defaultVps(su.guide, s.horizon, W(), H()); }
        if (su.values) ui.valBase = su.values;
        if (su.layers) { while (s.layers.length < su.layers) s.layers.push(newLayer(t('layerN', { n: s.layers.length + 1 }))); s.active = s.layers.length - 1; }
        if (su.sheets) { while (DOC.sheets.length < su.sheets) DOC.sheets.push(newSheet()); }
        if (su.tool) ui.tool = su.tool;
      }

      /* ---------- Proyecto ---------- */
      function num(v, d, lo, hi) { v = Number(v); if (!isFinite(v)) return d; return Math.max(lo, Math.min(hi, v)); }
      function cleanItem(it) {
        if (!it || typeof it !== 'object') return null;
        var id = typeof it.id === 'string' && it.id.length <= 32 ? it.id : nid('m');
        if (it.k === 's') {
          if (!BRUSHES[it.tool] || !Array.isArray(it.pts) || it.pts.length % 4 || it.pts.length > MAXPTS * 4) return null;
          return { k: 's', id: id, tool: it.tool, colour: isHex(it.colour) ? it.colour : '#17202a',
            size: num(it.size, 5, 1, 300), opacity: num(it.opacity, 1, 0.02, 1), hardness: num(it.hardness, 0.6, 0.01, 0.99),
            flow: num(it.flow, 0.8, 0.02, 1), sym: SYMS.indexOf(it.sym) >= 0 ? it.sym : 'no',
            symN: Math.round(num(it.symN, 8, 2, 16)), seed: Math.round(num(it.seed, 1, 0, 2147483647)),
            snap: typeof it.snap === 'string' ? it.snap.slice(0, 6) : null,
            pts: it.pts.map(function (v) { return num(v, 0, -1e5, 1e5); }) };
        }
        if (it.k === 'g') {
          if (!SHAPES[it.shape]) return null;
          return { k: 'g', id: id, shape: it.shape, colour: isHex(it.colour) ? it.colour : '#17202a',
            size: num(it.size, 4, 1, 300), opacity: num(it.opacity, 1, 0.02, 1), fill: !!it.fill,
            sym: SYMS.indexOf(it.sym) >= 0 ? it.sym : 'no', symN: Math.round(num(it.symN, 8, 2, 16)),
            snap: typeof it.snap === 'string' ? it.snap.slice(0, 6) : null,
            x0: num(it.x0, 0, -1e5, 1e5), y0: num(it.y0, 0, -1e5, 1e5), x1: num(it.x1, 0, -1e5, 1e5), y1: num(it.y1, 0, -1e5, 1e5) };
        }
        if (it.k === 'f') return { k: 'f', id: id, x: num(it.x, 0, -1e5, 1e5), y: num(it.y, 0, -1e5, 1e5),
          colour: isHex(it.colour) ? it.colour : '#17202a', opacity: num(it.opacity, 1, 0.02, 1), tol: num(it.tol, 36, 0, 255) };
        if (it.k === 't') return { k: 't', id: id, x: num(it.x, 0, -1e5, 1e5), y: num(it.y, 0, -1e5, 1e5),
          text: String(it.text || '').slice(0, 120), size: num(it.size, 64, 6, 400),
          colour: isHex(it.colour) ? it.colour : '#17202a', opacity: num(it.opacity, 1, 0.02, 1) };
        if (it.k === 'x') return { k: 'x', id: id, sx: num(it.sx, 0, -1e5, 1e5), sy: num(it.sy, 0, -1e5, 1e5),
          sw: num(it.sw, 1, 1, 1e5), sh: num(it.sh, 1, 1, 1e5), dx: num(it.dx, 0, -1e5, 1e5), dy: num(it.dy, 0, -1e5, 1e5),
          dw: num(it.dw, 1, 1, 1e5), dh: num(it.dh, 1, 1, 1e5), fh: !!it.fh, fv: !!it.fv };
        if (it.k === 'img') {
          if (typeof it.data !== 'string' || it.data.indexOf('data:image/png;base64,') !== 0 || it.data.length > 14e6) return null;
          return { k: 'img', id: id, data: it.data };
        }
        return null;
      }
      function validate(d) {
        if (!d || d.v !== 1 || !FORMATS[d.format] || !Array.isArray(d.sheets) || !d.sheets.length || d.sheets.length > MAXS) return false;
        if (d.challenge != null && !chById(d.challenge)) return false;
        return d.sheets.every(function (s) {
          if (!s || !Array.isArray(s.layers) || !s.layers.length || s.layers.length > MAXL) return false;
          if (!Array.isArray(s.vps) || s.vps.length > 3) return false;
          if (!s.vps.every(function (v) { return Array.isArray(v) && v.length === 2 && isFinite(v[0]) && isFinite(v[1]); })) return false;
          return s.layers.every(function (l) {
            return l && Array.isArray(l.items) && l.items.length <= 4000 && l.items.every(function (it) { return !!cleanItem(it); });
          });
        });
      }
      function restore(st) {
        var d = JSON.parse(JSON.stringify(st));
        var doc = { v: 1, title: String(d.title || '').slice(0, 80), format: FORMATS[d.format] ? d.format : 'h',
          rules: String(d.rules || '').slice(0, 600), challenge: chById(d.challenge) ? d.challenge : null, cur: 0, sheets: [] };
        d.sheets.slice(0, MAXS).forEach(function (s) {
          var ls = (Array.isArray(s.layers) ? s.layers : []).slice(0, MAXL).map(function (l) {
            return { id: typeof l.id === 'string' && l.id.length <= 32 ? l.id : nid('l'),
              name: String(l.name || '').slice(0, 40) || t('layerN', { n: 1 }),
              visible: l.visible !== false, opacity: num(l.opacity, 1, 0, 1),
              blend: BLENDS.indexOf(l.blend) >= 0 ? l.blend : 'normal',
              items: (Array.isArray(l.items) ? l.items : []).map(cleanItem).filter(Boolean) };
          });
          if (!ls.length) ls = [newLayer(t('layerBg'))];
          var vps = (Array.isArray(s.vps) ? s.vps : []).slice(0, 3).map(function (v) {
            return [Math.round(num(v && v[0], 0, -6000, 6000)), Math.round(num(v && v[1], 0, -6000, 6000))];
          });
          var horizon = num(s.horizon, 0.42, 0.02, 0.98);
          var guide = GUIDES.indexOf(s.guide) >= 0 ? s.guide : 'no';
          var def = defaultVps(guide, horizon, FORMATS[doc.format][0], FORMATS[doc.format][1]);
          while (vps.length < 3) vps.push(def[vps.length]);
          doc.sheets.push({ id: typeof s.id === 'string' && s.id.length <= 32 ? s.id : nid('s'),
            alt: String(s.alt || '').slice(0, 600),
            active: Math.max(0, Math.min(ls.length - 1, Math.round(num(s.active, 0, 0, MAXL)))),
            sym: SYMS.indexOf(s.sym) >= 0 ? s.sym : 'no', symN: Math.round(num(s.symN, 8, 2, 16)),
            guide: guide, grid: Math.round(num(s.grid, 50, 10, 300)), horizon: horizon, snap: s.snap !== false,
            vps: vps, layers: ls });
        });
        doc.cur = Math.max(0, Math.min(doc.sheets.length - 1, Math.round(num(d.cur, 0, 0, MAXS))));
        var sizeChanged = !DOC || DOC.format !== doc.format;
        DOC = doc;
        stroke = null; ui.penDown = false; ui.shapeStart = null;
        ui.selection = null; ui.selSrc = null; liveOn = false; chResult = null;
        selLayer = null;
        if (sizeChanged) {
          Object.keys(canvases).forEach(function (k) { delete canvases[k]; });
          Object.keys(textures).forEach(function (k) { textures[k].destroy(true); delete textures[k]; });
          sigs = {};
        }
        var needImg = DOC.sheets.some(function (s) { return s.layers.some(function (l) { return l.items.some(function (it) { return it.k === 'img' && !images[it.id]; }); }); });
        if (needImg) loadImages().then(function () { fullRefresh(sizeChanged); });
        else fullRefresh(sizeChanged);
      }

      /* ---------- Arranque ---------- */
      sizeBuffers();
      resize();
      selLayer = null;
      ui.kx = W() / 2; ui.ky = H() / 2;
      fullRefresh(true);

      return {
        serialize: function () { return JSON.parse(JSON.stringify(DOC)); },
        validate: validate,
        restore: restore,
        start: function (id) {
          var fmt = DOC ? DOC.format : 'h';
          if (id === 'empty') blankDoc(fmt);
          else if (String(id).indexOf('ch:') === 0) {
            var c = chById(String(id).slice(3));
            blankDoc('h');
            DOC.challenge = c ? c.id : null;
            genText = '';
            if (c) { applySetup(c); if (c.gen) generate(); }
          } else example(id);
          stroke = null; ui.penDown = false; ui.shapeStart = null;
          ui.selection = null; ui.selSrc = null; liveOn = false; chResult = null;
          ui.kx = W() / 2; ui.ky = H() / 2;
          Object.keys(canvases).forEach(function (k) { delete canvases[k]; });
          Object.keys(textures).forEach(function (k) { textures[k].destroy(true); delete textures[k]; });
          sigs = {}; selLayer = null;
          fullRefresh(true);
          if (ui.tool) ctx.selectTool(ui.tool);
        },
        onTool: function (id) {
          ui.tool = id; ui.shapeStart = null;
          if (ui.penDown) { ui.penDown = false; endStroke(true); }
          clearShapePreview();
          if (id !== 'select' && ui.selection) { ui.selection = null; ui.selSrc = null; showLive(false); clearLive(); }
          var B = BRUSHES[id];
          if (B) { ui.size = B.size; ui.opacity = B.opacity; ui.hardness = B.hardness; ui.flow = B.flow; }
          renderInspector(); render();
          ctx.announce(t('toolPicked', { t: t('tool_' + id) }));
        },
        onKey: onKey
      };
    }
  }
})(window);
