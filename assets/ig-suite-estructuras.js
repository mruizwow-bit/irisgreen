/* Iris Green · El taller · Estudio de estructuras (R43).
   Construir ↔ probar: colocar piezas y apoyos arrastrando, aplicar cargas y probar.
   PixiJS dibuja; el cálculo de barras (IGTCalc) da las cifras; Rapier o Planck mueven
   lo que se rompe. Todo se puede hacer también con teclado y con el panel de propiedades. */
(function (root) {
  'use strict';
  var IG = root.IGSuite; if (!IG) return;

  var SCALES = {
    maqueta: { grid: 0.05, unit: 'N', unitK: 1, lenUnit: 'cm', lenK: 100, phys: 10, th: 0.012, mats: ['palito', 'liston', 'hilo'], defMat: 'palito', maxSpanG: 30 },
    real: { grid: 1, unit: 'kN', unitK: 1000, lenUnit: 'm', lenK: 1, phys: 1, th: 0.32, mats: ['madera', 'acero', 'cable'], defMat: 'acero', maxSpanG: 60 }
  };
  var MAT_COLOR = { palito: 0xc49a6c, liston: 0x9c6b3f, hilo: 0x8d7f71, madera: 0x9c6b3f, acero: 0x5f7486, cable: 0x2f3e4c };
  var TENSION = 0x1f5f8b, COMPRESSION = 0xa0521c, BROKEN = 0xa1283c;

  function scenario(kind, o) {
    o = o || {};
    if (kind === 'gap') return { kind: 'gap', scale: 'maqueta', spanG: o.spanG || 10, depthG: 15, heightG: 12, walls: !!o.walls, cross: 'pesos' };
    if (kind === 'river') return { kind: 'river', scale: 'real', spanG: o.spanG || 12, depthG: 6, heightG: 10, walls: !!o.walls, cross: o.cross || 'coche' };
    return { kind: 'free', scale: o.scale || 'real', spanG: o.spanG || 16, depthG: 2, heightG: o.heightG || 16, walls: false, cross: 'pesos' };
  }

  IG.defineEngine('estructuras', {
    libs: ['pixi'], version: 1, fileBase: IG.lang === 'en' ? 'structure' : 'estructura',
    extraKeys: ['kEnter', 'kTest'],
    initialStart: function (para) { return { child: 'kids-bridge', teen: 'river-car', adult: 'footbridge' }[para] || 'gap'; },
    starts: function (ctx) {
      var t = ctx.t;
      return [
        { id: 'gap', title: t('startGap'), desc: t('startGapDesc'), para: 'any' },
        { id: 'kids-bridge', title: t('startKids'), desc: t('startKidsDesc'), para: 'child' },
        { id: 'river-car', title: t('startRiver'), desc: t('startRiverDesc'), para: 'teen' },
        { id: 'river-truss', title: t('startTruss'), desc: t('startTrussDesc'), para: 'teen' },
        { id: 'footbridge', title: t('startFoot'), desc: t('startFootDesc'), para: 'adult' },
        { id: 'arch', title: t('startArch'), desc: t('startArchDesc'), para: 'adult' },
        { id: 'crane', title: t('startCrane'), desc: t('startCraneDesc'), para: 'any' }
      ];
    },
    create: function (ctx) { return createStudio(ctx); }
  });

  function createStudio(ctx) {
    var t = ctx.t, h = ctx.h, num = ctx.num, PIXI = root.PIXI, Calc = root.IGTCalc;
    var vp = ctx.viewport;

    /* ---------- Estado del proyecto (lo que se guarda) ---------- */
    var S = null;
    function blank(sc) { return { v: 1, sc: sc, nodes: {}, members: [], weights: [], seq: 1, mat: SCALES[sc.scale].defMat, k: 1, mirror: false }; }
    function scale() { return SCALES[S.sc.scale]; }
    function half() { return S.sc.spanG / 2; }

    /* ---------- Estado de trabajo (no se guarda) ---------- */
    var sel = null;          /* {type:'node'|'member'|'weight', id} */
    var drag = null;         /* arrastre en curso */
    var pending = null;      /* primer punto de una pieza (clic-clic o teclado) */
    var hover = null;
    var kc = { gx: 0, gy: 0 }, kcVisible = false;
    var result = null;       /* último resultado de cálculo */
    var testing = null;      /* simulación activa */
    var showNumbers = true;

    /* ---------- PixiJS ---------- */
    var app = new PIXI.Application();
    return app.init({ antialias: true, background: '#fbfcfe', autoStart: false, resolution: Math.min(2, root.devicePixelRatio || 1), autoDensity: true,
      preference: 'webgl', width: Math.max(300, vp.clientWidth), height: Math.max(240, vp.clientHeight) }).then(function () {
      ctx.setTech('renderer', 'PixiJS ' + PIXI.VERSION + ' · ' + (app.renderer.name === 'webgpu' ? 'WebGPU' : 'WebGL'));
      app.canvas.setAttribute('aria-hidden', 'true');
      vp.appendChild(app.canvas);
      return build();
    });

    function build() {
      var layers = { grid: new PIXI.Graphics(), terrain: new PIXI.Graphics(), members: new PIXI.Graphics(), deco: new PIXI.Graphics(), nodes: new PIXI.Graphics(), over: new PIXI.Graphics(), labels: new PIXI.Container() };
      Object.keys(layers).forEach(function (k) { app.stage.addChild(layers[k]); });
      var labelPool = [], labelUsed = 0;
      function label(text, x, y, opts) {
        opts = opts || {};
        var lb = labelPool[labelUsed];
        if (!lb) { lb = new PIXI.Text({ text: '', style: { fontFamily: 'Atkinson Hyperlegible, Arial, sans-serif', fontSize: 13, fill: '#172b42', fontWeight: '700' } }); labelPool.push(lb); layers.labels.addChild(lb); }
        labelUsed += 1; lb.visible = true; lb.text = text; lb.style.fill = opts.color || '#172b42'; lb.style.fontSize = opts.size || 13;
        lb.anchor.set(opts.ax === undefined ? 0.5 : opts.ax, opts.ay === undefined ? 0.5 : opts.ay); lb.x = Math.round(x); lb.y = Math.round(y);
        return lb;
      }
      function labelsReset() { labelUsed = 0; }
      function labelsDone() { for (var i = labelUsed; i < labelPool.length; i++) labelPool[i].visible = false; }

      var view = new ctx.View2D({ scale: 40, min: 4, max: 4000, onChange: requestRender });
      var gestures = ctx.attachViewGestures(vp, view, { isPanTool: function () { return ctx.tool() === 'pan'; } });

      /* Zoom visible (además de rueda, pellizco y teclado) */
      var zoomBox = h('div', { class: 'igs-zoom' },
        ctx.button(t('zoomOut'), { icon: 'minus', onClick: function () { zoomCenter(1 / 1.25); } }),
        ctx.button(t('zoomFit'), { icon: 'fit', onClick: function () { fit(); } }),
        ctx.button(t('zoomIn'), { icon: 'plus', onClick: function () { zoomCenter(1.25); } }));
      var hud = h('div', { class: 'igs-hud', 'aria-hidden': 'true' });
      vp.append(zoomBox, hud);
      function zoomCenter(f) { view.zoomAt(vp.clientWidth / 2, vp.clientHeight / 2, f); }

      var frame = 0;
      function requestRender() { if (!frame) frame = root.requestAnimationFrame(function () { frame = 0; render(); }); }
      if (root.ResizeObserver) new ResizeObserver(function () {
        var w = Math.max(200, vp.clientWidth), hh = Math.max(200, vp.clientHeight);
        app.renderer.resize(w, hh); requestRender();
      }).observe(vp);

      /* ---------- Coordenadas ---------- */
      function g2w(gx, gy) { var g = scale().grid; return { x: gx * g, y: gy * g }; }           /* rejilla → metros */
      function sp(gx, gy) { var w = g2w(gx, gy); return view.toScreen(w.x, -w.y); }             /* rejilla → pantalla */
      function screenToGrid(sx, sy) { var w = view.toWorld(sx, sy), g = scale().grid; return { gx: Math.round(w.x / g), gy: Math.round(-w.y / g) }; }
      function fmtLen(m) { var s = scale(), v = m * s.lenK; if (Math.abs(v) < 1e-9) v = 0; return num(v, s.lenK === 1 ? 2 : 1) + ' ' + s.lenUnit; }
      function fmtPos(gx, gy) { var w = g2w(gx + half(), gy); return fmtLen(w.x) + ', ' + fmtLen(w.y); }
      function fmtForce(N) { var s = scale(); return num(Math.abs(N) / s.unitK, s.unitK === 1 ? 1 : 1) + ' ' + s.unit; }
      function fmtMass(kg) { return kg >= 1000 ? num(kg / 1000, 2) + ' t' : kg < 1 ? num(kg * 1000, kg < 0.01 ? 1 : 0) + ' g' : num(kg, kg < 10 ? 2 : 0) + ' kg'; }

      /* ---------- Terreno ---------- */
      function inGround(gx, gy) {
        var sc = S.sc, hf = half();
        if (gy < -sc.depthG) return true;
        if (sc.kind === 'free') return gy < 0;
        return gy < 0 && Math.abs(gx) > hf;
      }
      function onSurface(gx, gy) {
        var sc = S.sc, hf = half();
        if (sc.kind === 'free') return gy === 0;
        if (gy === 0 && Math.abs(gx) >= hf) return true;
        return !!sc.walls && Math.abs(gx) === hf && gy < 0 && gy >= -sc.depthG;
      }
      function inside(gx, gy) {
        var sc = S.sc, hf = half(), mx = sc.kind === 'free' ? hf : hf + Math.max(2, Math.round(sc.spanG * 0.25));
        return Math.abs(gx) <= mx && gy <= sc.heightG && gy >= -sc.depthG;
      }
      function canPlace(gx, gy) { return inside(gx, gy) && (!inGround(gx, gy) || onSurface(gx, gy)); }

      /* ---------- Nudos y piezas ---------- */
      function nodeAt(gx, gy) { var ks = Object.keys(S.nodes); for (var i = 0; i < ks.length; i++) { var n = S.nodes[ks[i]]; if (n.gx === gx && n.gy === gy) return ks[i]; } return null; }
      function newId(p) { S.seq += 1; return p + S.seq; }
      function ensureNode(gx, gy) {
        var k = nodeAt(gx, gy); if (k) return k;
        k = newId('n'); S.nodes[k] = { gx: gx, gy: gy, anchor: onSurface(gx, gy) }; return k;
      }
      function memberLen(m) { var a = S.nodes[m.a], b = S.nodes[m.b]; return Math.hypot(b.gx - a.gx, b.gy - a.gy) * scale().grid; }
      function memberIndex(id) { for (var i = 0; i < S.members.length; i++) if (S.members[i].id === id) return i; return -1; }
      function memberNumber(id) { return memberIndex(id) + 1; }
      function nodeName(k) { var n = S.nodes[k]; return t('nodeName', { pos: fmtPos(n.gx, n.gy) }) + (n.anchor ? ' · ' + t('support') : ''); }
      function memberName(m) { return t('pieceName', { n: memberNumber(m.id), mat: t('mat_' + m.mat) + (m.k > 1 ? ' ×' + m.k : ''), len: fmtLen(memberLen(m)) }); }
      function exists(a, b) { return S.members.some(function (m) { return (m.a === a && m.b === b) || (m.a === b && m.b === a); }); }
      function addMember(g1, g2, silent) {
        if (g1.gx === g2.gx && g1.gy === g2.gy) return null;
        if (!canPlace(g1.gx, g1.gy) || !canPlace(g2.gx, g2.gy)) { ctx.announce(t('cantPlace')); return null; }
        if (S.members.length >= 240) { ctx.announce(t('tooMany')); return null; }
        var a = ensureNode(g1.gx, g1.gy), b = ensureNode(g2.gx, g2.gy);
        if (exists(a, b)) { if (!silent) ctx.announce(t('exists')); return null; }
        var m = { id: newId('m'), a: a, b: b, mat: S.mat, k: S.k };
        if (scale().mats.indexOf(m.mat) < 0) m.mat = scale().defMat;
        S.members.push(m);
        if (S.mirror && S.sc.kind !== 'free') {
          var mg1 = { gx: -g1.gx, gy: g1.gy }, mg2 = { gx: -g2.gx, gy: g2.gy };
          if (!(mg1.gx === g1.gx && mg2.gx === g2.gx) && !(mg1.gx === g2.gx && mg1.gy === g2.gy && mg2.gx === g1.gx && mg2.gy === g1.gy)) {
            var ma = ensureNode(mg1.gx, mg1.gy), mb = ensureNode(mg2.gx, mg2.gy);
            if (!exists(ma, mb)) S.members.push({ id: newId('m'), a: ma, b: mb, mat: m.mat, k: m.k });
          }
        }
        return m;
      }
      function removeOrphans() {
        var used = {}; S.members.forEach(function (m) { used[m.a] = 1; used[m.b] = 1; });
        S.weights.forEach(function (w) { used[w.node] = 1; });
        Object.keys(S.nodes).forEach(function (k) { if (!used[k] && !S.nodes[k].keep) delete S.nodes[k]; });
      }
      function deleteNode(k) {
        S.members = S.members.filter(function (m) { return m.a !== k && m.b !== k; });
        S.weights = S.weights.filter(function (w) { return w.node !== k; });
        delete S.nodes[k]; removeOrphans();
      }
      function deleteMember(id) { S.members = S.members.filter(function (m) { return m.id !== id; }); removeOrphans(); }
      function weightAt(k) { for (var i = 0; i < S.weights.length; i++) if (S.weights[i].node === k) return S.weights[i]; return null; }

      /* ---------- Hit test ---------- */
      function hitNode(sx, sy, r) {
        var best = null, bd = r || 14;
        Object.keys(S.nodes).forEach(function (k) { var n = S.nodes[k], p = sp(n.gx, n.gy), d = Math.hypot(p.x - sx, p.y - sy); if (d < bd) { bd = d; best = k; } });
        return best;
      }
      function hitMember(sx, sy, r) {
        var best = null, bd = r || 9;
        S.members.forEach(function (m) {
          var a = S.nodes[m.a], b = S.nodes[m.b], pa = sp(a.gx, a.gy), pb = sp(b.gx, b.gy);
          var dx = pb.x - pa.x, dy = pb.y - pa.y, l2 = dx * dx + dy * dy || 1, u = Math.max(0, Math.min(1, ((sx - pa.x) * dx + (sy - pa.y) * dy) / l2));
          var d = Math.hypot(pa.x + u * dx - sx, pa.y + u * dy - sy); if (d < bd) { bd = d; best = m.id; }
        });
        return best;
      }

      /* ---------- Dibujo ---------- */
      function render() {
        var W = app.renderer.width / app.renderer.resolution, H = app.renderer.height / app.renderer.resolution;
        var g = layers.grid, tr = layers.terrain, mg = layers.members, dg = layers.deco, ng = layers.nodes, og = layers.over;
        [g, tr, mg, dg, ng, og].forEach(function (x) { x.clear(); });
        labelsReset();
        var sc = S.sc, hf = half(), gs = scale().grid, px = view.scale * gs;
        /* rejilla de puntos */
        if (px >= 7) {
          var tl = screenToGrid(0, 0), br = screenToGrid(W, H);
          var step = px < 14 ? 2 : 1;
          for (var gx = Math.floor(tl.gx / step) * step; gx <= br.gx; gx += step) {
            for (var gy = Math.floor(br.gy / step) * step; gy <= tl.gy; gy += step) {
              if (!inside(gx, gy) || inGround(gx, gy)) continue;
              var p = sp(gx, gy); g.circle(p.x, p.y, gx === 0 && gy === 0 ? 2.2 : 1.3);
            }
          }
          g.fill({ color: 0x8aa0b5, alpha: 0.7 });
        }
        /* terreno */
        var groundColor = sc.kind === 'gap' ? 0xd9c7a8 : 0xb9c4b0, edge = sc.kind === 'gap' ? 0x8a6d45 : 0x5d6e57;
        var deep = sp(0, -sc.depthG).y, farL = -4000, farR = 4000;
        if (sc.kind === 'free') {
          var y0 = sp(0, 0).y; tr.rect(farL, y0, farR * 2, deep - y0 + 2000).fill({ color: groundColor }); tr.moveTo(farL, y0).lineTo(farR, y0).stroke({ width: 2, color: edge });
        } else {
          var L = sp(-hf, 0), R = sp(hf, 0);
          tr.rect(farL, L.y, L.x - farL, 4000).fill({ color: groundColor }); tr.rect(R.x, R.y, farR, 4000).fill({ color: groundColor });
          if (sc.kind === 'river') { var wy = sp(0, -sc.depthG * 0.55).y; tr.rect(L.x, wy, R.x - L.x, deep - wy).fill({ color: 0x9cc3dd }); }
          tr.rect(L.x, deep, R.x - L.x, 4000).fill({ color: groundColor });
          tr.moveTo(farL, L.y).lineTo(L.x, L.y).lineTo(L.x, deep).lineTo(R.x, deep).lineTo(R.x, R.y).lineTo(farR, R.y).stroke({ width: 2, color: edge });
          if (sc.kind === 'gap') { label(t('table'), L.x - 40, L.y + 18, { color: '#5b4526', size: 12 }); label(t('table'), R.x + 40, R.y + 18, { color: '#5b4526', size: 12 }); }
          /* línea de carretera (tamaño real) */
          if (sc.scale === 'real' && sc.cross !== 'pesos') {
            for (var dx = L.x; dx < R.x; dx += 14) og.moveTo(dx, L.y).lineTo(Math.min(R.x, dx + 7), L.y);
            og.stroke({ width: 2, color: 0x8a2942, alpha: 0.75 });
          }
          /* cota del hueco */
          var cy = deep + 22; if (cy < H - 10) {
            og.moveTo(L.x, cy).lineTo(R.x, cy).stroke({ width: 1, color: 0x44586c });
            label(fmtLen(sc.spanG * gs), (L.x + R.x) / 2, cy - 10, { size: 12, color: '#44586c' });
          }
        }
        /* piezas */
        var testState = testing && testing.bodies ? testing : null;
        var util = result && result.maxUtil, forces = result && result.maxForce, brokenSet = {};
        if (result && result.cases) result.cases.forEach(function (c) { (c.broken || []).forEach(function (b) { brokenSet[b.i] = 1; }); });
        S.members.forEach(function (m, i) {
          var ends = testState ? testState.memberEnds(i) : null;
          if (testState && !ends) return;
          var a = S.nodes[m.a], b = S.nodes[m.b];
          var pa = ends ? view.toScreen(ends[0], -ends[1]) : sp(a.gx, a.gy), pb = ends ? view.toScreen(ends[2], -ends[3]) : sp(b.gx, b.gy);
          var base = MAT_COLOR[m.mat] || 0x5f7486, w = Math.max(3, Math.min(10, (m.mat === 'hilo' || m.mat === 'cable' ? 2.5 : 5) * Math.sqrt(m.k) * Math.min(1.6, view.scale * gs / 30 + 0.6)));
          var selected = sel && sel.type === 'member' && sel.id === m.id;
          if (selected) mg.moveTo(pa.x, pa.y).lineTo(pb.x, pb.y).stroke({ width: w + 8, color: 0x5a49a8, alpha: 0.35, cap: 'round' });
          if (result && util && forces && !(testState && brokenSet[i])) {
            if (brokenSet[i]) {
              dashed(mg, pa, pb, BROKEN, w, 10, 7);
              var mx = (pa.x + pb.x) / 2, my = (pa.y + pb.y) / 2;
              mg.moveTo(mx - 7, my - 7).lineTo(mx + 7, my + 7).moveTo(mx + 7, my - 7).lineTo(mx - 7, my + 7).stroke({ width: 3, color: BROKEN });
            } else {
              var f = forces[i] || 0, u = util[i] || 0, col = f >= 0 ? TENSION : COMPRESSION;
              var ww = w + Math.min(6, u * 6);
              mg.moveTo(pa.x, pa.y).lineTo(pb.x, pb.y).stroke({ width: ww, color: col, alpha: 0.35 + Math.min(0.65, u * 0.65), cap: 'round' });
              if (f < 0) mg.moveTo(pa.x, pa.y).lineTo(pb.x, pb.y).stroke({ width: 1.6, color: 0xffffff, alpha: 0.95 });
            }
          } else {
            if (m.mat === 'hilo' || m.mat === 'cable') dashed(mg, pa, pb, base, w, 8, 4);
            else mg.moveTo(pa.x, pa.y).lineTo(pb.x, pb.y).stroke({ width: w, color: base, cap: 'round' });
          }
          if (showNumbers && !testState && view.scale * gs >= 16) {
            var lx = (pa.x + pb.x) / 2, ly = (pa.y + pb.y) / 2;
            var txt = String(i + 1);
            if (result && util && !brokenSet[i] && util[i] > 0) txt += ' · ' + Math.round(util[i] * 100) + '%';
            dg.roundRect(lx - (txt.length * 3.6 + 6), ly - 9, txt.length * 7.2 + 12, 18, 9).fill({ color: 0xffffff, alpha: 0.92 }).stroke({ width: 1, color: 0x91a9bf });
            label(txt, lx, ly, { size: 12 });
          }
        });
        /* nudos */
        if (!testState) Object.keys(S.nodes).forEach(function (k) {
          var n = S.nodes[k], p = sp(n.gx, n.gy), r = Math.max(4, Math.min(8, view.scale * gs / 7));
          var selected = sel && sel.type === 'node' && sel.id === k;
          if (n.anchor) {
            ng.moveTo(p.x, p.y).lineTo(p.x - r * 1.6, p.y + r * 2.4).lineTo(p.x + r * 1.6, p.y + r * 2.4).closePath().fill({ color: 0x17395c });
            ng.moveTo(p.x - r * 2.2, p.y + r * 2.6).lineTo(p.x + r * 2.2, p.y + r * 2.6).stroke({ width: 2, color: 0x17395c });
          }
          ng.circle(p.x, p.y, r).fill({ color: 0xffffff }).stroke({ width: 2.5, color: selected ? 0x5a49a8 : 0x17395c });
          if (selected) ng.circle(p.x, p.y, r + 5).stroke({ width: 2, color: 0x5a49a8 });
          if (result && result.cases && result.cases.some(function (c) { return c.mechanismNode === k; })) ng.circle(p.x, p.y, r + 9).stroke({ width: 3, color: BROKEN });
        });
        /* pesos */
        S.weights.forEach(function (wt) {
          var n = S.nodes[wt.node]; if (!n) return;
          var pos = testState ? testState.weightPos(wt) : null;
          var p = pos ? view.toScreen(pos.x, -pos.y) : sp(n.gx, n.gy);
          var size = Math.max(16, Math.min(46, 12 + Math.sqrt(wt.kg) * 7)), top = p.y + (pos ? -size / 2 : 14);
          if (!pos) dg.moveTo(p.x, p.y).lineTo(p.x, top).stroke({ width: 2, color: 0x44586c });
          var selected = sel && sel.type === 'weight' && sel.id === wt.node;
          dg.roundRect(p.x - size / 2, top, size, size, 4).fill({ color: 0x5a49a8 }).stroke({ width: selected ? 4 : 1.5, color: selected ? 0x2e2270 : 0x3d2f86 });
          label(num(wt.kg, 2) + ' kg', p.x, top + size + 11, { size: 12, color: '#3d2f86' });
        });
        /* vehículo */
        if (testing && testing.vehicle) drawVehicle(dg, testing.vehicle);
        /* vista previa de pieza */
        var from = drag && drag.kind === 'member' ? drag.from : pending;
        var to = drag && drag.kind === 'member' ? drag.to : (pending && hover ? hover : null);
        if (from && to) {
          var a1 = sp(from.gx, from.gy), b1 = sp(to.gx, to.gy), ok = canPlace(to.gx, to.gy);
          dashed(og, a1, b1, ok ? 0x5a49a8 : BROKEN, 3, 9, 6);
          var len = Math.hypot(to.gx - from.gx, to.gy - from.gy) * gs;
          label(fmtLen(len), (a1.x + b1.x) / 2, (a1.y + b1.y) / 2 - 16, { color: '#3d2f86' });
          if (S.mirror && S.sc.kind !== 'free') { var a2 = sp(-from.gx, from.gy), b2 = sp(-to.gx, to.gy); dashed(og, a2, b2, 0x5a49a8, 2, 5, 6); }
        }
        if (pending) { var pp = sp(pending.gx, pending.gy); og.circle(pp.x, pp.y, 9).stroke({ width: 3, color: 0x5a49a8 }); }
        if (hover && !testing && !drag) { var hp = sp(hover.gx, hover.gy); og.circle(hp.x, hp.y, 6).stroke({ width: 2, color: canPlace(hover.gx, hover.gy) ? 0x5a49a8 : BROKEN, alpha: 0.8 }); }
        /* cursor de teclado */
        if (kcVisible && !testing) {
          var kp = sp(kc.gx, kc.gy);
          og.moveTo(kp.x - 14, kp.y).lineTo(kp.x - 5, kp.y).moveTo(kp.x + 5, kp.y).lineTo(kp.x + 14, kp.y).moveTo(kp.x, kp.y - 14).lineTo(kp.x, kp.y - 5).moveTo(kp.x, kp.y + 5).lineTo(kp.x, kp.y + 14)
            .stroke({ width: 3, color: 0x5a49a8 });
          og.circle(kp.x, kp.y, 11).stroke({ width: 1.5, color: 0x5a49a8 });
        }
        labelsDone();
        app.render();
        vp.dataset.igsView = [view.x.toFixed(2), view.y.toFixed(2), (view.scale * gs).toFixed(4)].join(',');
        renderHud();
      }
      function dashed(gr, a, b, color, width, on, off) {
        var dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy); if (L < 1) return;
        var ux = dx / L, uy = dy / L, d = 0;
        while (d < L) { var e = Math.min(L, d + on); gr.moveTo(a.x + ux * d, a.y + uy * d).lineTo(a.x + ux * e, a.y + uy * e); d = e + off; }
        gr.stroke({ width: width, color: color, cap: 'round' });
      }
      function drawVehicle(gr, v) {
        /* Vehículos a escala real; las ruedas están donde el cálculo pone los ejes. */
        var p = view.toScreen(v.x, -v.y), s = view.scale, type = S.sc.cross;
        var c = Math.cos(-(v.angle || 0)), sn = Math.sin(-(v.angle || 0));
        function P(x, y) { return { x: p.x + (x * c + y * sn) * s, y: p.y + (x * sn - y * c) * s }; }
        function box(x0, y0, x1, y1, fill, alpha) {
          var q = [P(x0, y0), P(x1, y0), P(x1, y1), P(x0, y1)];
          gr.moveTo(q[0].x, q[0].y).lineTo(q[1].x, q[1].y).lineTo(q[2].x, q[2].y).lineTo(q[3].x, q[3].y).closePath().fill({ color: fill, alpha: alpha || 1 }).stroke({ width: 1.5, color: 0x172b42 });
        }
        function wheel(x, r) { var q = P(x, r); gr.circle(q.x, q.y, Math.max(2.5, r * s)).fill({ color: 0x172b42 }); }
        var axles = (Calc.VEHICLES[type] || []);
        if (type === 'persona' || type === 'grupo') {
          axles.forEach(function (a) {
            var x = a.d; box(x - 0.22, 0, x + 0.22, 1.45, 0x5a49a8);
            var hq = P(x, 1.6); gr.circle(hq.x, hq.y, Math.max(2.5, 0.16 * s)).fill({ color: 0x5a49a8 }).stroke({ width: 1.5, color: 0x172b42 });
          });
          return;
        }
        if (type === 'coche') { box(-4.2, 0.3, 0, 1.0, 0x1f5f8b); box(-3.3, 1.0, -1.1, 1.5, 0x9cc3dd); }
        else if (type === 'camion') { box(-2.4, 0.4, 0, 3.0, 0x8a4b00); box(-12.4, 0.5, -2.6, 3.4, 0xb8a88a); }
        else if (type === 'tren') {
          box(-17.3, 0.5, 0, 4.0, 0x2f5d50); box(-35.3, 0.5, -17.8, 4.0, 0x6b7f73);
          for (var wx = -2.2; wx > -17; wx -= 2.6) box(wx - 1.4, 2.4, wx, 3.4, 0xd7e6f2);
        }
        axles.forEach(function (a) { wheel(a.d - (type === 'coche' ? 0.8 : 0.5), type === 'tren' ? 0.45 : 0.38); });
      }
      function renderHud() {
        ctx.clear(hud);
        var sc = S.sc;
        hud.appendChild(h('span', { text: t('sceneShort_' + sc.kind, { span: fmtLen(sc.spanG * scale().grid) }) }));
        var mode = testing ? (testing.done ? t('testDoneBadge') : t('testingBadge')) : t('tool_' + (ctx.tool() || 'member'));
        hud.appendChild(h('span', { text: mode }));
        if (result && !testing) hud.appendChild(h('span', { text: result.ok ? t('badgeOk', { u: Math.round((result.peak || 0) * 100) }) : t('badgeFail') }));
        if (S.mirror && S.sc.kind !== 'free') hud.appendChild(h('span', { text: t('mirrorOn') }));
      }

      /* ---------- Interacción con puntero ---------- */
      function local(e) { var r = vp.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
      vp.addEventListener('pointerdown', function (e) {
        if (testing || e.button > 0) return;
        vp.focus({ preventScroll: true }); kcVisible = false;
        var p = local(e), g = screenToGrid(p.x, p.y), tool = ctx.tool();
        var rad = e.pointerType === 'touch' ? 22 : 14;
        var hn = hitNode(p.x, p.y, rad), hm = hn ? null : hitMember(p.x, p.y, rad - 4);
        if (tool === 'member') {
          var start = hn ? { gx: S.nodes[hn].gx, gy: S.nodes[hn].gy } : g;
          if (pending) { finishMember(pending, start); pending = null; requestRender(); return; }
          if (!canPlace(start.gx, start.gy)) { ctx.announce(t('cantPlace')); return; }
          drag = { kind: 'member', from: start, to: start, id: e.pointerId, moved: false };
          vp.setPointerCapture(e.pointerId);
        } else if (tool === 'select') {
          if (hn) { select({ type: 'node', id: hn }); if (!S.nodes[hn].keep) { drag = { kind: 'node', node: hn, orig: { gx: S.nodes[hn].gx, gy: S.nodes[hn].gy }, id: e.pointerId }; vp.setPointerCapture(e.pointerId); } }
          else if (hm) select({ type: 'member', id: hm });
          else { var wk = hitWeight(p.x, p.y); if (wk) select({ type: 'weight', id: wk }); else select(null); }
        } else if (tool === 'support') {
          if (hn) toggleAnchor(hn); else if (onSurface(g.gx, g.gy)) { var k = ensureNode(g.gx, g.gy); S.nodes[k].anchor = true; S.nodes[k].keep = true; changed(t('supportAdded')); }
          else ctx.announce(t('supportOnlyGround'));
        } else if (tool === 'weight') {
          if (hn) addWeight(hn); else ctx.announce(t('weightNeedsNode'));
        } else if (tool === 'erase') {
          var wk2 = hitWeight(p.x, p.y);
          if (wk2) { S.weights = S.weights.filter(function (w) { return w.node !== wk2; }); removeOrphans(); changed(t('weightRemoved')); }
          else if (hm) { var mm = S.members[memberIndex(hm)]; var nm = memberName(mm); deleteMember(hm); if (sel && sel.id === hm) select(null); changed(t('deleted', { name: nm })); }
          else if (hn) { var nn = nodeName(hn); deleteNode(hn); if (sel && sel.id === hn) select(null); changed(t('deleted', { name: nn })); }
        }
        requestRender();
      });
      vp.addEventListener('pointermove', function (e) {
        if (testing) return;
        var p = local(e), g = screenToGrid(p.x, p.y);
        if (drag && drag.kind === 'member') {
          var hn = hitNode(p.x, p.y, e.pointerType === 'touch' ? 22 : 14);
          drag.to = hn ? { gx: S.nodes[hn].gx, gy: S.nodes[hn].gy } : g;
          if (drag.to.gx !== drag.from.gx || drag.to.gy !== drag.from.gy) drag.moved = true;
          requestRender(); return;
        }
        if (drag && drag.kind === 'node') {
          var n = S.nodes[drag.node];
          if ((n.gx !== g.gx || n.gy !== g.gy) && canPlace(g.gx, g.gy) && !nodeAt(g.gx, g.gy)) { n.gx = g.gx; n.gy = g.gy; n.anchor = n.anchor && onSurface(g.gx, g.gy); invalidate(); }
          requestRender(); return;
        }
        if (e.pointerType !== 'touch') { var nh = { gx: g.gx, gy: g.gy }; if (!hover || hover.gx !== nh.gx || hover.gy !== nh.gy) { hover = (ctx.tool() === 'member') ? nh : null; requestRender(); } }
      });
      function endDrag(e) {
        if (!drag) return;
        if (drag.kind === 'member') {
          if (drag.moved) finishMember(drag.from, drag.to);
          else { pending = drag.from; ctx.announce(t('startMarked')); }
        } else if (drag.kind === 'node') {
          var n = S.nodes[drag.node];
          if (n && (n.gx !== drag.orig.gx || n.gy !== drag.orig.gy)) changed(t('moved', { name: t('node'), pos: fmtPos(n.gx, n.gy) }));
        }
        drag = null; requestRender();
      }
      vp.addEventListener('pointerup', endDrag);
      vp.addEventListener('pointercancel', function () { if (drag && drag.kind === 'node') { var n = S.nodes[drag.node]; n.gx = drag.orig.gx; n.gy = drag.orig.gy; } drag = null; requestRender(); });
      vp.addEventListener('pointerleave', function () { if (hover) { hover = null; requestRender(); } });
      vp.addEventListener('focus', function () { if (vp.matches(':focus-visible')) { kcVisible = true; announceCursor(); requestRender(); } });
      vp.addEventListener('blur', function () { kcVisible = false; requestRender(); });

      function hitWeight(sx, sy) {
        var found = null;
        S.weights.forEach(function (wt) { var n = S.nodes[wt.node]; if (!n) return; var p = sp(n.gx, n.gy), size = Math.max(16, Math.min(46, 12 + Math.sqrt(wt.kg) * 7)), top = p.y + 14;
          if (sx >= p.x - size / 2 - 4 && sx <= p.x + size / 2 + 4 && sy >= top - 4 && sy <= top + size + 4) found = wt.node; });
        return found;
      }
      function finishMember(a, b) {
        var m = addMember(a, b);
        if (m) { changed(t('added', { name: memberName(m) })); select({ type: 'member', id: m.id }, true); }
      }
      function toggleAnchor(k) {
        var n = S.nodes[k];
        if (!n.anchor && !onSurface(n.gx, n.gy)) { ctx.announce(t('supportOnlyGround')); return; }
        n.anchor = !n.anchor; n.keep = n.anchor; removeOrphans(); changed(n.anchor ? t('supportAdded') : t('supportRemoved'));
      }
      function addWeight(k) {
        var w = weightAt(k);
        if (w) { select({ type: 'weight', id: k }); return; }
        S.weights.push({ node: k, kg: S.sc.scale === 'real' ? 500 : 1 }); changed(t('weightAdded')); select({ type: 'weight', id: k });
      }

      /* ---------- Teclado en el lienzo ---------- */
      function announceCursor() {
        var k = nodeAt(kc.gx, kc.gy), what;
        if (k) what = t('atNode', { n: S.members.filter(function (m) { return m.a === k || m.b === k; }).length }) + (S.nodes[k].anchor ? ', ' + t('support') : '');
        else if (inGround(kc.gx, kc.gy) && !onSurface(kc.gx, kc.gy)) what = t('atGround');
        else if (onSurface(kc.gx, kc.gy)) what = t('atSurface'); else what = t('atEmpty');
        ctx.announce(t('cursorAt', { pos: fmtPos(kc.gx, kc.gy), what: what }) + (pending ? ' · ' + t('pendingFrom', { pos: fmtPos(pending.gx, pending.gy) }) : ''));
      }
      function keyAct() {
        var tool = ctx.tool(), k = nodeAt(kc.gx, kc.gy);
        if (tool === 'member') {
          if (!pending) { if (!canPlace(kc.gx, kc.gy)) { ctx.announce(t('cantPlace')); return; } pending = { gx: kc.gx, gy: kc.gy }; ctx.announce(t('startMarked')); }
          else { var a = pending; pending = null; finishMember(a, { gx: kc.gx, gy: kc.gy }); }
        } else if (tool === 'select') {
          if (k) { select({ type: 'node', id: k }); ctx.announce(t('nodeMoveHint')); } else { var hm = hitMember(sp(kc.gx, kc.gy).x, sp(kc.gx, kc.gy).y, 10); if (hm) select({ type: 'member', id: hm }); else select(null); }
        } else if (tool === 'support') { if (k) toggleAnchor(k); else if (onSurface(kc.gx, kc.gy)) { var nk = ensureNode(kc.gx, kc.gy); S.nodes[nk].anchor = true; S.nodes[nk].keep = true; changed(t('supportAdded')); } else ctx.announce(t('supportOnlyGround')); }
        else if (tool === 'weight') { if (k) addWeight(k); else ctx.announce(t('weightNeedsNode')); }
        else if (tool === 'erase') { if (k) { var nn = nodeName(k); deleteNode(k); changed(t('deleted', { name: nn })); } }
        requestRender();
      }
      function onKey(e) {
        if (!vp.contains(e.target) || testing) {
          if (testing && (e.key === 'Escape') && vp.contains(e.target)) { stopTest(); return true; }
          return false;
        }
        var step = e.shiftKey ? 5 : 1, dir = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
        if (dir) {
          kcVisible = true;
          if (sel && sel.type === 'node' && ctx.tool() === 'select') {
            var n = S.nodes[sel.id], nx = n.gx + dir[0] * step, ny = n.gy + dir[1] * step;
            if (canPlace(nx, ny) && !nodeAt(nx, ny) && !n.keep) { n.gx = nx; n.gy = ny; n.anchor = n.anchor && onSurface(nx, ny); kc = { gx: nx, gy: ny }; invalidate(); changed(t('moved', { name: t('node'), pos: fmtPos(nx, ny) }), true); }
            else ctx.announce(t('cantMove'));
          } else {
            var gx = kc.gx + dir[0] * step, gy = kc.gy + dir[1] * step;
            if (inside(gx, gy)) { kc = { gx: gx, gy: gy }; ensureVisible(); announceCursor(); }
          }
          requestRender(); return true;
        }
        if (e.key === 'Enter' || (e.key === ' ' && ctx.tool() !== 'pan')) { kcVisible = true; keyAct(); return true; }
        if (e.key === 'Escape') { if (pending) { pending = null; ctx.announce(t('cancelled')); } else select(null); requestRender(); return true; }
        if (e.key === 'Delete' || e.key === 'Backspace') { deleteSelection(); return true; }
        if (e.key === '+' || e.key === '=') { zoomCenter(1.25); return true; }
        if (e.key === '-' || e.key === '_') { zoomCenter(0.8); return true; }
        if (e.key === '0') { fit(); return true; }
        if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey) { runTest(); return true; }
        return false;
      }
      function ensureVisible() {
        var p = sp(kc.gx, kc.gy), W = vp.clientWidth, H = vp.clientHeight, m = 40;
        if (p.x < m) view.x += m - p.x; if (p.x > W - m) view.x -= p.x - (W - m);
        if (p.y < m) view.y += m - p.y; if (p.y > H - m) view.y -= p.y - (H - m);
      }
      function deleteSelection() {
        if (!sel) return;
        if (sel.type === 'member') { var m = S.members[memberIndex(sel.id)]; if (!m) return; var nm = memberName(m); deleteMember(sel.id); select(null); changed(t('deleted', { name: nm })); }
        else if (sel.type === 'node') { if (S.nodes[sel.id] && S.nodes[sel.id].keep && !S.members.some(function (m) { return m.a === sel.id || m.b === sel.id; })) { delete S.nodes[sel.id]; select(null); changed(t('supportRemoved')); return; }
          var nn = nodeName(sel.id); deleteNode(sel.id); select(null); changed(t('deleted', { name: nn })); }
        else if (sel.type === 'weight') { var id = sel.id; S.weights = S.weights.filter(function (w) { return w.node !== id; }); removeOrphans(); select(null); changed(t('weightRemoved')); }
        requestRender();
      }

      /* ---------- Selección, estructura y propiedades ---------- */
      function select(s, quiet) {
        sel = s;
        if (s && !quiet) {
          var name = s.type === 'member' ? memberName(S.members[memberIndex(s.id)] || {}) : s.type === 'node' ? nodeName(s.id) : t('weightName', { kg: num((weightAt(s.id) || {}).kg || 0, 2) });
          ctx.announce(t('selected', { name: name }));
        }
        renderSide(); requestRender();
      }
      function invalidate() { if (result) { result = null; } }
      function changed(msg, quiet) { invalidate(); ctx.commit(msg); if (!quiet && msg) ctx.announce(msg); renderSide(); updateSummary(); requestRender(); }

      function renderSide() {
        /* Estructura */
        var list = [];
        list.push(h('h3', { text: t('pieces') + ' (' + S.members.length + ')' }));
        var ul = h('ul', { class: 'igs-list' });
        S.members.forEach(function (m, i) {
          var b = h('button', { type: 'button', 'aria-current': String(!!(sel && sel.type === 'member' && sel.id === m.id)) },
            h('span', { class: 'igs-swatch', style: 'background:#' + (MAT_COLOR[m.mat] || 0).toString(16).padStart(6, '0') }), h('span', { text: String(i + 1) + '. ' + t('mat_' + m.mat) + (m.k > 1 ? ' ×' + m.k : '') }), h('small', { text: fmtLen(memberLen(m)) }));
          b.addEventListener('click', function () { select({ type: 'member', id: m.id }); });
          ul.appendChild(h('li', null, b));
        });
        list.push(ul);
        var nk = Object.keys(S.nodes);
        list.push(h('h3', { text: t('joints') + ' (' + nk.length + ')' }));
        var ul2 = h('ul', { class: 'igs-list' });
        nk.forEach(function (k) {
          var n = S.nodes[k];
          var b = h('button', { type: 'button', 'aria-current': String(!!(sel && sel.type === 'node' && sel.id === k)) }, h('span', { text: fmtPos(n.gx, n.gy) }), n.anchor ? h('small', { text: t('support') }) : null);
          b.addEventListener('click', function () { select({ type: 'node', id: k }); kc = { gx: n.gx, gy: n.gy }; });
          ul2.appendChild(h('li', null, b));
        });
        list.push(ul2);
        if (S.weights.length) {
          list.push(h('h3', { text: t('weights') }));
          var ul3 = h('ul', { class: 'igs-list' });
          S.weights.forEach(function (w) { var n = S.nodes[w.node]; var b = h('button', { type: 'button', 'aria-current': String(!!(sel && sel.type === 'weight' && sel.id === w.node)) }, h('span', { text: num(w.kg, 2) + ' kg' }), h('small', { text: n ? fmtPos(n.gx, n.gy) : '' })); b.addEventListener('click', function () { select({ type: 'weight', id: w.node }); }); ul3.appendChild(h('li', null, b)); });
          list.push(ul3);
        }
        ctx.setStructure(list);

        /* Propiedades */
        var F = ctx.fields, out = [];
        if (sel && sel.type === 'member' && memberIndex(sel.id) >= 0) {
          var m = S.members[memberIndex(sel.id)];
          out.push(h('h4', { text: memberName(m) }));
          out.push(F.select(t('material'), m.mat, scale().mats.map(function (k) { return [k, t('mat_' + k)]; }), { onChange: function (v) { m.mat = v; S.mat = v; changed(t('materialSet', { m: t('mat_' + v) })); } }));
          out.push(h('p', { class: 'igs-muted', text: t('matInfo_' + m.mat) }));
          out.push(F.choice(t('section'), m.k, [[1, t('section_1')], [2, t('section_2')], [3, t('section_3')]], { onChange: function (v) { m.k = +v; S.k = +v; changed(t('sectionSet')); } }));
          out.push(capInfo(m));
          if (result && result.maxForce) out.push(memberResult(memberIndex(m.id)));
          out.push(h('div', { class: 'igs-actions' }, ctx.button(t('deletePiece'), { icon: 'trash', class: 'igs-danger', onClick: deleteSelection })));
        } else if (sel && sel.type === 'node' && S.nodes[sel.id]) {
          var k = sel.id, n = S.nodes[k];
          out.push(h('h4', { text: nodeName(k) }));
          var hf = half(), g = scale().grid, K = scale().lenK;
          out.push(F.number(t('posX'), +((n.gx + hf) * g * K).toFixed(3), { unit: scale().lenUnit, step: g * K, onChange: function (v) { moveNodeTo(k, Math.round(v / K / g - hf), n.gy); } }));
          out.push(F.number(t('posY'), +(n.gy * g * K).toFixed(3), { unit: scale().lenUnit, step: g * K, onChange: function (v) { moveNodeTo(k, n.gx, Math.round(v / K / g)); } }));
          if (onSurface(n.gx, n.gy)) out.push(F.check(t('isSupport'), n.anchor, { onChange: function () { toggleAnchor(k); } }));
          else out.push(h('p', { class: 'igs-muted', text: t('supportOnlyGround') }));
          out.push(h('div', { class: 'igs-actions' },
            ctx.button(weightAt(k) ? t('editWeight') : t('addWeight'), { icon: 'weight', onClick: function () { addWeight(k); } }),
            ctx.button(t('deleteJoint'), { icon: 'trash', class: 'igs-danger', onClick: deleteSelection })));
        } else if (sel && sel.type === 'weight' && weightAt(sel.id)) {
          var w = weightAt(sel.id);
          out.push(h('h4', { text: t('weightName', { kg: num(w.kg, 2) }) }));
          out.push(F.number(t('weightKg'), w.kg, { unit: 'kg', min: 0.01, max: S.sc.scale === 'real' ? 200000 : 100, step: S.sc.scale === 'real' ? 100 : 0.1, onChange: function (v) { w.kg = v; changed(t('weightSet', { kg: num(v, 2) })); } }));
          out.push(h('div', { class: 'igs-actions' }, ctx.button(t('removeWeight'), { icon: 'trash', class: 'igs-danger', onClick: deleteSelection })));
        } else {
          out.push(h('h4', { text: t('scene') }));
          out.push(h('p', { class: 'igs-muted', text: sceneText() }));
          if (S.sc.kind !== 'free') {
            var spanK = scale().grid * scale().lenK;
            out.push(F.number(t('span'), S.sc.spanG * spanK, { unit: scale().lenUnit, min: spanK * 4, max: spanK * scale().maxSpanG, step: spanK * 2, onChange: function (v) { setSpan(Math.round(v / spanK / 2) * 2); } }));
          }
          if (S.sc.kind === 'river') out.push(F.select(t('crossing'), S.sc.cross, ['persona', 'grupo', 'coche', 'camion', 'tren'].map(function (v) { return [v, t('veh_' + v)]; }), { onChange: function (v) { S.sc.cross = v; changed(t('crossingSet', { v: t('veh_' + v) })); } }));
          if (S.sc.kind !== 'free') out.push(F.check(t('wallSupports'), S.sc.walls, { onChange: function (v) { S.sc.walls = v; changed(t('wallSupports')); } }));
          out.push(h('h4', { text: t('newPieces') }));
          out.push(F.select(t('material'), S.mat, scale().mats.map(function (k2) { return [k2, t('mat_' + k2)]; }), { onChange: function (v) { S.mat = v; syncMatSelect(); ctx.announce(t('materialSet', { m: t('mat_' + v) })); renderSide(); } }));
          out.push(h('p', { class: 'igs-muted', text: t('matInfo_' + S.mat) }));
          out.push(F.check(t('mirror'), S.mirror, { onChange: function (v) { S.mirror = v; ctx.announce(v ? t('mirrorOn') : t('mirrorOff')); requestRender(); } }));
          out.push(F.check(t('showNumbers'), showNumbers, { onChange: function (v) { showNumbers = v; requestRender(); } }));
        }
        out.push(resultBlock());
        ctx.setInspector(out);
      }
      function capInfo(m) {
        var len = memberLen(m);
        var M = Calc.MATERIALS[S.sc.scale][m.mat], k = m.k || 1;
        var MM = { A: M.A * k, I: M.I * k, E: M.E, f: M.f, cap: M.cap === undefined ? undefined : M.cap * k, tensionOnly: M.tensionOnly };
        var cap = Calc.capacities(MM, len), w = M.rho * M.A * k * len;
        return h('p', { class: 'igs-muted', text: t('capInfo', { t: fmtForce(cap.t), c: cap.c > 0 ? fmtForce(cap.c) : t('nothing'), w: fmtMass(w) }) });
      }
      function moveNodeTo(k, gx, gy) {
        var n = S.nodes[k]; if (!n) return;
        if (!canPlace(gx, gy) || (nodeAt(gx, gy) && nodeAt(gx, gy) !== k)) { ctx.announce(t('cantMove')); renderSide(); return; }
        n.gx = gx; n.gy = gy; n.anchor = n.anchor && onSurface(gx, gy); changed(t('moved', { name: t('node'), pos: fmtPos(gx, gy) }));
      }
      function setSpan(g) {
        var old = S.sc.spanG; if (g === old) return;
        var d = (g - old) / 2;
        Object.keys(S.nodes).forEach(function (k) { var n = S.nodes[k]; if (n.gx <= -old / 2) n.gx -= d; else if (n.gx >= old / 2) n.gx += d; });
        S.sc.spanG = g; changed(t('spanSet', { v: fmtLen(g * scale().grid) }));
      }
      function sceneText() {
        var sc = S.sc;
        var cross = sc.kind === 'river' ? t('veh_' + sc.cross) : (S.weights.length ? S.weights.map(function (w) { return num(w.kg, 2) + ' kg'; }).join(', ') : t('noWeights'));
        return t('sceneInfo_' + sc.kind, { span: fmtLen(sc.spanG * scale().grid), cross: cross });
      }

      /* ---------- Resultados ---------- */
      function whyText(r, i) {
        var m = S.members[i]; var M = Calc.MATERIALS[S.sc.scale][m.mat];
        var brk = null; r.cases.forEach(function (c) { (c.broken || []).forEach(function (b) { if (b.i === i && !brk) brk = b; }); });
        if (!brk) return '';
        if (brk.force >= 0) return t('whyTension');
        var cap = Calc.capacities({ A: M.A * m.k, I: M.I * m.k, E: M.E, f: M.f, tensionOnly: M.tensionOnly }, memberLen(m));
        return cap.buckles ? t('whyBuckle') : t('whyCrush');
      }
      function memberResult(i) {
        var f = result.maxForce[i] || 0, u = result.maxUtil[i] || 0;
        return h('p', { class: 'igs-result', 'data-kind': u > 1 ? 'bad' : 'ok' }, h('strong', { text: t('lastTest') }),
          t('memberResult', { kind: f >= 0 ? t('kTension') : t('kCompression'), f: fmtForce(f), u: Math.round(u * 100) }));
      }
      function resultBlock() {
        var box = h('div', { class: 'igs-result-block' });
        if (!result) { box.appendChild(h('p', { class: 'igs-muted', text: t('noTestYet') })); return box; }
        var r = result, msg, kind = r.ok ? 'ok' : 'bad';
        if (r.reason === 'empty') msg = t('empty');
        else if (r.reason === 'road') msg = t('roadGap', { gaps: r.gaps.map(function (g) { return fmtLen(g[0] + half() * scale().grid) + '–' + fmtLen(g[1] + half() * scale().grid); }).join(', ') });
        else if (r.ok) msg = t('holds', { peak: Math.round(r.peak * 100) });
        else {
          var c = r.cases[r.failAt] || r.cases[0];
          if (c && c.broken && c.broken.length) {
            var b = c.broken[0];
            msg = t('breaks', { n: b.i + 1, why: whyText(r, b.i), pos: c.pos !== null && c.pos !== undefined ? t('when', { x: fmtLen(c.pos + half() * scale().grid) }) : '' }) + ' ' + (c.collapse ? t('thenFalls') : t('standsDamaged', { n: c.broken.length }));
          } else msg = t('mechanism');
        }
        box.appendChild(h('p', { class: 'igs-result', 'data-kind': kind }, h('strong', { text: r.ok ? t('resultOk') : t('resultBad') }), msg));
        if (r.members && r.members.length) {
          box.appendChild(h('p', { class: 'igs-muted', text: t('massInfo', { m: fmtMass(r.mass) }) }));
          box.appendChild(h('p', { class: 'igs-muted', text: t('legend') }));
          if (r.maxForce) {
            var tb = h('table', { class: 'igs-table' }, h('caption', { text: t('tableCap') }),
              h('thead', null, h('tr', null, h('th', { scope: 'col', text: t('thN') }), h('th', { scope: 'col', text: t('thKind') }), h('th', { scope: 'col', text: t('thForce') }), h('th', { scope: 'col', text: t('thUse') }))));
            var tbody = h('tbody');
            r.members.forEach(function (pm, i) {
              var f = r.maxForce[i] || 0, u = r.maxUtil[i] || 0;
              tbody.appendChild(h('tr', null, h('th', { scope: 'row', text: String(pm.idx + 1) }), h('td', { text: Math.abs(f) < 1e-6 ? t('kNone') : f >= 0 ? t('kTension') : t('kCompression') }),
                h('td', { class: 'igs-numcell', text: fmtForce(f) }), h('td', { class: 'igs-numcell', text: Math.round(u * 100) + ' %' })));
            });
            tb.appendChild(tbody); box.appendChild(h('div', { class: 'igs-table-wrap' }, tb));
          }
        }
        return box;
      }

      function calcModel() {
        var gs = scale().grid, hf = half(), nodes = {};
        Object.keys(S.nodes).forEach(function (k) { var n = S.nodes[k]; nodes[k] = { x: n.gx * gs, y: n.gy * gs, anchor: !!n.anchor }; });
        var load = S.sc.kind === 'river' ? { type: S.sc.cross } : { type: 'pesos', points: S.weights.map(function (w) { return { node: w.node, kg: w.kg }; }) };
        return { scale: S.sc.scale, span: S.sc.spanG * gs, nodes: nodes, members: S.members.map(function (m) { return { a: m.a, b: m.b, mat: m.mat, k: m.k }; }), load: load, noDeck: S.sc.kind !== 'river' };
      }

      /* ---------- Probar: cálculo + física ---------- */
      var testBtn = null;
      function runTest() {
        if (testing) { stopTest(); return; }
        pending = null; drag = null;
        if (!S.members.length) { result = { ok: false, reason: 'empty', cases: [] }; renderSide(); ctx.announce(t('empty')); requestRender(); return; }
        result = Calc.test(calcModel());
        renderSide(); updateSummary();
        announceResult();
        if (result.reason === 'road' || result.reason === 'loadPoint' || result.reason === 'empty') { requestRender(); return; }
        startSimulation();
      }
      function announceResult() {
        var p = ctx.app.querySelector('.igs-result-block .igs-result');
        if (p) ctx.announce(p.textContent);
      }
      function startSimulation() {
        testing = { starting: true };
        setTesting(true);
        IGPhysics.backend(IG).then(function (kind) {
          if (!testing) return;
          ctx.setTech('physics', kind === 'rapier' ? 'Rapier 0.21 (WebAssembly)' : 'Planck.js 1.5 (Box2D, JavaScript)');
          buildSimulation(kind);
        }).catch(function () { testing = null; setTesting(false); requestRender(); });
      }
      function buildSimulation(kind) {
        var sc = S.sc, s = scale(), F = s.phys, gs = s.grid, hf = half();
        var world = IGPhysics.createWorld(kind, { gravity: -9.81, velocityIterations: 24, positionIterations: 10 });
        var th = s.th * F;
        /* terreno */
        var ground = [];
        var depth = sc.depthG * gs * F, far = Math.max(40, sc.spanG * gs * F * 2);
        if (sc.kind === 'free') ground.push(world.addBody({ type: 'static', x: 0, y: -far / 2, shape: { type: 'box', w: far * 4, h: far } }));
        else {
          var hx = hf * gs * F;
          ground.push(world.addBody({ type: 'static', x: -hx - far / 2, y: -far / 2, shape: { type: 'box', w: far, h: far } }));
          ground.push(world.addBody({ type: 'static', x: hx + far / 2, y: -far / 2, shape: { type: 'box', w: far, h: far } }));
          ground.push(world.addBody({ type: 'static', x: 0, y: -depth - far / 2, shape: { type: 'box', w: hx * 2 + 2, h: far } }));
        }
        var anchorBody = world.addBody({ type: 'static', x: 0, y: 0, shape: { type: 'circle', r: 0.001 }, sensor: true });
        /* piezas */
        var bodies = [], halfLen = [];
        S.members.forEach(function (m, i) {
          var a = S.nodes[m.a], b = S.nodes[m.b];
          var ax = a.gx * gs * F, ay = a.gy * gs * F, bx = b.gx * gs * F, by = b.gy * gs * F;
          var L = Math.hypot(bx - ax, by - ay), ang = Math.atan2(by - ay, bx - ax);
          var M = Calc.MATERIALS[sc.scale][m.mat], mass = Math.max(0.05, M.rho * M.A * m.k * L / F);
          var len = Math.max(th * 0.5, L - th);
          bodies[i] = world.addBody({ type: 'dynamic', x: (ax + bx) / 2, y: (ay + by) / 2, angle: ang, shape: { type: 'box', w: len, h: th }, density: mass / (len * th) * (sc.scale === 'real' ? 0.001 : 1), friction: 0.7, group: 1, angularDamping: 0.3, linearDamping: 0.05 });
          halfLen[i] = L / 2;
        });
        /* uniones en los nudos (bisagras) */
        var joints = {};
        Object.keys(S.nodes).forEach(function (k) {
          var n = S.nodes[k], x = n.gx * gs * F, y = n.gy * gs * F;
          var ids = []; S.members.forEach(function (m, i) { if (m.a === k || m.b === k) ids.push(i); });
          for (var j = 1; j < ids.length; j++) { var jid = world.addJoint({ type: 'revolute', a: bodies[ids[0]], b: bodies[ids[j]], x: x, y: y }); (joints[ids[j]] = joints[ids[j]] || []).push(jid); }
          if (n.anchor && ids.length) world.addJoint({ type: 'revolute', a: anchorBody, b: bodies[ids[0]], x: x, y: y });
        });
        /* pesos colgados */
        var weightBodies = {};
        S.weights.forEach(function (w) {
          var n = S.nodes[w.node]; if (!n) return;
          var ids = []; S.members.forEach(function (m, i) { if (m.a === w.node || m.b === w.node) ids.push(i); });
          var x = n.gx * gs * F, y = n.gy * gs * F, size = (sc.scale === 'real' ? 0.8 : 0.06 * F) * Math.max(0.6, Math.min(2.2, Math.cbrt(w.kg / (sc.scale === 'real' ? 500 : 1))));
          var wb = world.addBody({ type: 'dynamic', x: x, y: y - size / 2 - 0.001, shape: { type: 'box', w: size, h: size }, density: w.kg / (size * size) * (sc.scale === 'real' ? 0.001 : 1), friction: 0.8, group: 1 });
          if (ids.length) world.addJoint({ type: 'revolute', a: bodies[ids[0]], b: wb, x: x, y: y });
          weightBodies[w.node] = { id: wb, size: size };
        });
        /* guion de la prueba */
        var r = result, failCase = r.ok ? -1 : (r.failAt === undefined ? 0 : r.failAt);
        var brokenIdx = []; if (failCase >= 0 && r.cases[failCase]) (r.cases[failCase].broken || []).forEach(function (b) { brokenIdx.push(b.i); });
        var vehicle = null, cases = r.cases || [];
        var reduce = ctx.reducedMotion();
        var sim = {
          world: world, t: 0, broke: false, done: false,
          memberEnds: function (i) {
            var id = bodies[i]; var p = world.get(id); if (!p) return null;
            var c = Math.cos(p.angle), s2 = Math.sin(p.angle), L2 = halfLen[i];
            return [(p.x - c * L2) / F, (p.y - s2 * L2) / F, (p.x + c * L2) / F, (p.y + s2 * L2) / F];
          },
          weightPos: function (w) { var wb = weightBodies[w.node]; if (!wb) return null; var p = world.get(wb.id); return p ? { x: p.x / F, y: (p.y + wb.size / 2) / F } : null; },
          bodies: bodies
        };
        testing = sim;
        if (sc.kind === 'river') {
          var axSpan = { persona: 0.5, grupo: 3.5, coche: 4.2, camion: 12.4, tren: 35.3 }[sc.cross] || 4;
          vehicle = { x: -hf * gs - 0.5, y: 0, angle: 0, len: axSpan };
          sim.vehicle = vehicle;
        }
        function breakNow() {
          if (sim.broke) return; sim.broke = true;
          brokenIdx.forEach(function (i) { world.removeBody(bodies[i]); bodies[i] = null; });
          if (vehicle && sc.kind === 'river') {
            var len = vehicle.len * F, hgt = ({ persona: 1.6, grupo: 1.6, coche: 1.4, camion: 3, tren: 3.5 }[sc.cross] || 1.5) * F;
            vehicle.body = world.addBody({ type: 'dynamic', x: (vehicle.x - vehicle.len / 2) * F, y: vehicle.y * F + hgt / 2 + 0.05, shape: { type: 'box', w: len, h: hgt }, density: 0.5, friction: 0.6 });
            world.setVelocity(vehicle.body, 3 * F, 0);
          }
          ctx.announce(t('simBreaks'));
        }
        var crossTime = sc.kind === 'river' ? 5 : 0, failTime = 0.6, endTime;
        if (sc.kind === 'river') {
          var frontStart = cases.length ? cases[0].pos : -hf * gs, frontEnd = cases.length ? cases[cases.length - 1].pos : hf * gs;
          var failPos = failCase >= 0 && cases[failCase] ? cases[failCase].pos : null;
          if (failPos !== null) failTime = crossTime * (failPos - frontStart) / Math.max(1e-6, frontEnd - frontStart);
          endTime = failCase >= 0 ? failTime + 3.2 : crossTime + 0.6;
          sim.vehicleAt = function (tt) { var u = Math.min(1, tt / crossTime); return frontStart + (frontEnd - frontStart) * u; };
        } else endTime = failCase >= 0 || (r.cases[0] && r.cases[0].collapse) ? 3.4 : 1.6;
        if (failCase < 0 && !(r.cases[0] && r.cases[0].collapse)) failTime = Infinity;
        if (r.cases[0] && r.cases[0].collapse && !brokenIdx.length) failTime = Infinity; /* mecanismo: cae solo */

        var dt = 1 / 120, last = 0, acc = 0;
        function advance(seconds) {
          acc += seconds;
          while (acc >= dt) {
            acc -= dt; sim.t += dt;
            if (!sim.broke && sim.t >= failTime) breakNow();
            if (vehicle && !vehicle.body) { vehicle.x = sim.vehicleAt(sim.t); vehicle.y = 0; }
            world.step(dt);
          }
          if (vehicle && vehicle.body) { var vp2 = world.get(vehicle.body); if (vp2) { var ca = Math.cos(vp2.angle), sa = Math.sin(vp2.angle), hh2 = ({ persona: 1.6, grupo: 1.6, coche: 1.4, camion: 3, tren: 3.5 }[sc.cross] || 1.5) / 2; vehicle.x = vp2.x / F + ca * vehicle.len / 2 + sa * hh2; vehicle.y = vp2.y / F + sa * vehicle.len / 2 - ca * hh2; vehicle.angle = vp2.angle; } }
        }
        function finish() {
          sim.done = true; ctx.announce(result.ok ? t('simHolds') : t('simDone'));
          setTesting(true, true); requestRender();
        }
        if (reduce) {
          /* Movimiento reducido: sin animación; se muestra directamente el estado final. */
          advance(endTime); finish(); requestRender(); return;
        }
        function loop(now) {
          if (testing !== sim) return;
          if (!last) last = now;
          var sec = Math.min(0.05, (now - last) / 1000); last = now;
          advance(sec); render();
          if (sim.t < endTime) sim.raf = root.requestAnimationFrame(loop); else finish();
        }
        sim.raf = root.requestAnimationFrame(loop);
      }
      function stopTest() {
        if (!testing) return;
        if (testing.raf) root.cancelAnimationFrame(testing.raf);
        if (testing.world) testing.world.destroy();
        testing = null; setTesting(false); ctx.announce(t('backToEdit')); requestRender();
      }
      function setTesting(on, finished) {
        if (!testBtn) return;
        testBtn.setAttribute('aria-pressed', String(!!on));
        testBtn.querySelector('.igs-btn-label').textContent = on ? t('backToEditBtn') : t('test');
        ctx.app.dataset.igsTesting = on ? (finished ? 'done' : 'running') : 'off';
        ctx.toolbar.querySelectorAll('[data-tool]').forEach(function (b) { b.disabled = !!on; });
        renderHud();
      }

      /* ---------- Herramientas ---------- */
      var matSelect = h('select', { class: 'igs-mat-select', 'aria-label': t('material') });
      function syncMatSelect() {
        ctx.clear(matSelect);
        scale().mats.forEach(function (k) { var o = h('option', { value: k, text: t('mat_' + k) }); if (k === S.mat) o.selected = true; matSelect.appendChild(o); });
      }
      matSelect.addEventListener('change', function () { S.mat = matSelect.value; ctx.announce(t('materialSet', { m: t('mat_' + S.mat) })); renderSide(); });
      var matWrap = h('label', { class: 'igs-inline-select' }, h('span', { text: t('material') }), matSelect);
      ctx.setTools([
        { id: 'member', label: t('tool_member'), icon: 'line', title: t('help_member') },
        { id: 'select', label: t('tool_select'), icon: 'select', title: t('help_select') },
        { id: 'support', label: t('tool_support'), icon: 'anchor', title: t('help_support') },
        { id: 'weight', label: t('tool_weight'), icon: 'weight', title: t('help_weight') },
        { id: 'erase', label: t('tool_erase'), icon: 'erase', title: t('help_erase') },
        { id: 'pan', label: t('tool_pan'), icon: 'pan', title: t('help_pan'), level: 'more' },
        { separator: true },
        { node: matWrap },
        { separator: true },
        { id: 'test', label: t('test'), icon: 'play', primary: true, keys: 'T', action: function () { runTest(); } }
      ], { initial: 'member' });
      testBtn = ctx.toolbar.querySelector('.igs-primary');
      testBtn.setAttribute('aria-pressed', 'false');

      /* Exportaciones reales */
      ctx.addExport(t('exportPng'), function () {
        render();
        var src = app.renderer.extract.canvas(app.stage);
        var c = ctx.canvasWithCredit(src, '#fbfcfe');
        ctx.canvasBlob(c).then(function (b) { ctx.download(b, (IG.lang === 'en' ? 'structure-' : 'estructura-') + ctx.stamp() + '.png'); });
      }, 'download');
      ctx.addExport(t('exportCsv'), function () {
        var rows = [[t('thN'), t('material'), t('section'), t('thLen') + ' (' + scale().lenUnit + ')', t('thKind'), t('thForce') + ' (' + scale().unit + ')', t('thUse') + ' (%)']];
        S.members.forEach(function (m, i) {
          var f = result && result.maxForce ? result.maxForce[i] || 0 : null, u = result && result.maxUtil ? result.maxUtil[i] || 0 : null;
          rows.push([i + 1, t('mat_' + m.mat), m.k, (memberLen(m) * scale().lenK).toFixed(3), f === null ? '' : (f >= 0 ? t('kTension') : t('kCompression')), f === null ? '' : (Math.abs(f) / scale().unitK).toFixed(2), u === null ? '' : Math.round(u * 100)]);
        });
        var csv = '﻿' + rows.map(function (r) { return r.map(function (c) { var s = String(c); return /[",;\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(IG.lang === 'en' ? ',' : ';'); }).join('\r\n');
        ctx.download(new Blob([csv], { type: 'text/csv;charset=utf-8' }), (IG.lang === 'en' ? 'structure-pieces-' : 'estructura-piezas-') + ctx.stamp() + '.csv');
      }, 'download');
      ctx.command('test', t('test'), t('help_test'), runTest);
      ctx.command('fit', t('zoomFit'), '', fit);
      ['member', 'select', 'support', 'weight', 'erase'].forEach(function (id) { ctx.command('tool-' + id, t('tool_' + id), t('help_' + id), function () { ctx.selectTool(id); vp.focus(); }); });

      function fit() {
        var sc = S.sc, gs = scale().grid, hf = half();
        var minX = -hf - Math.max(1, Math.round(hf * 0.25)), maxX = hf + Math.max(1, Math.round(hf * 0.25)), minY = -Math.min(sc.depthG, Math.max(2, Math.round(hf * 0.5))), maxY = Math.max(2, Math.round(hf * 0.5));
        Object.keys(S.nodes).forEach(function (k) { var n = S.nodes[k]; minX = Math.min(minX, n.gx - 1); maxX = Math.max(maxX, n.gx + 1); minY = Math.min(minY, n.gy - 1); maxY = Math.max(maxY, n.gy + 2); });
        view.fit({ minX: minX * gs, maxX: maxX * gs, minY: -maxY * gs, maxY: -minY * gs }, vp.clientWidth, vp.clientHeight, 36);
      }
      function updateSummary() {
        var anchors = Object.keys(S.nodes).filter(function (k) { return S.nodes[k].anchor; }).length;
        var txt = sceneText() + ' ' + t('summaryCounts', { m: S.members.length, n: Object.keys(S.nodes).length, a: anchors });
        if (result) { var rp = ctx.app.querySelector('.igs-result-block .igs-result'); if (rp) txt += ' ' + rp.textContent; }
        ctx.setSummary(txt);
      }

      /* ---------- Ejemplos de partida ---------- */
      function G(gx, gy) { return { gx: gx, gy: gy }; }
      function startProject(id) {
        stopTest(); result = null; sel = null; pending = null;
        if (id === 'kids-bridge') {
          S = blank(scenario('gap', { spanG: 10 })); S.mat = 'palito';
          addMember(G(-5, 0), G(0, 0), true); addMember(G(0, 0), G(5, 0), true);
          S.weights.push({ node: nodeAt(0, 0), kg: 2 });
        } else if (id === 'river-car') {
          S = blank(scenario('river', { spanG: 12, cross: 'coche' })); S.mat = 'acero';
        } else if (id === 'river-truss') {
          S = blank(scenario('river', { spanG: 12, cross: 'coche' })); S.mat = 'madera';
          buildPratt(6, 1);
        } else if (id === 'footbridge') {
          S = blank(scenario('river', { spanG: 18, cross: 'grupo' })); S.mat = 'madera';
        } else if (id === 'arch') {
          S = blank(scenario('river', { spanG: 30, cross: 'camion', walls: true })); S.mat = 'madera';
        } else if (id === 'crane') {
          S = blank(scenario('free', { spanG: 20, heightG: 16, scale: 'real' })); S.mat = 'acero';
          addMember(G(-6, 0), G(-6, 10), true); addMember(G(-4, 0), G(-4, 10), true); addMember(G(-6, 10), G(-4, 10), true);
          addMember(G(-6, 0), G(-4, 5), true); addMember(G(-4, 5), G(-6, 10), true); addMember(G(-4, 0), G(-6, 5), true); addMember(G(-6, 5), G(-4, 10), true);
          addMember(G(-6, 5), G(-4, 5), true);
          addMember(G(-4, 10), G(4, 10), true); addMember(G(-4, 12), G(4, 10), true); addMember(G(-6, 10), G(-4, 12), true); addMember(G(-4, 10), G(-4, 12), true);
          S.weights.push({ node: nodeAt(4, 10), kg: 800 });
        } else {
          /* R54: el estudio entra con un puente a medio montar, no con el hueco vacío. */
          S = blank(scenario('gap', { spanG: 10 })); S.mat = 'palito';
          addMember(G(-5, 0), G(-2.5, 0), true); addMember(G(-2.5, 0), G(0, 0), true);
          addMember(G(0, 0), G(2.5, 0), true); addMember(G(2.5, 0), G(5, 0), true);
          addMember(G(-5, 0), G(-2.5, 2), true); addMember(G(-2.5, 2), G(0, 2), true);
          addMember(G(0, 2), G(2.5, 2), true); addMember(G(-2.5, 0), G(-2.5, 2), true);
          addMember(G(0, 0), G(0, 2), true); addMember(G(2.5, 0), G(2.5, 2), true);
          addMember(G(-2.5, 2), G(0, 0), true);
          S.weights.push({ node: nodeAt(0, 0), kg: 2 });
        }
        syncMatSelect(); renderSide(); updateSummary(); fit(); requestRender();
      }
      function buildPratt(panels, hgt) {
        /* Celosía Pratt: cordón inferior (carretera), cordón superior, montantes y diagonales. */
        S.members = []; S.nodes = {}; S.seq = 1;
        var hf2 = half(), w = S.sc.spanG / panels, i, x;
        for (i = 0; i < panels; i++) addMember(G(-hf2 + i * w, 0), G(-hf2 + (i + 1) * w, 0), true);
        for (i = 1; i < panels - 1; i++) addMember(G(-hf2 + i * w, hgt), G(-hf2 + (i + 1) * w, hgt), true);
        addMember(G(-hf2, 0), G(-hf2 + w, hgt), true); addMember(G(hf2, 0), G(hf2 - w, hgt), true);
        for (i = 1; i < panels; i++) addMember(G(-hf2 + i * w, 0), G(-hf2 + i * w, hgt), true);
        for (i = 1; i < panels - 1; i++) { x = -hf2 + i * w; if (x < 0) addMember(G(x, hgt), G(x + w, 0), true); else addMember(G(x, 0), G(x + w, hgt), true); }
      }

      S = blank(scenario('gap'));
      syncMatSelect();

      return {
        serialize: function () { return S; },
        restore: function (st) { stopTest(); S = JSON.parse(JSON.stringify(st)); result = null; sel = null; pending = null; syncMatSelect(); renderSide(); updateSummary(); requestRender(); },
        validate: function (d) {
          if (!d || typeof d !== 'object' || !d.sc || !SCALES[d.sc.scale] || typeof d.nodes !== 'object' || !Array.isArray(d.members) || !Array.isArray(d.weights)) return false;
          if (d.members.length > 400 || Object.keys(d.nodes).length > 800) return false;
          return d.members.every(function (m) { return m && d.nodes[m.a] && d.nodes[m.b] && SCALES[d.sc.scale].mats.indexOf(m.mat) >= 0 && [1, 2, 3].indexOf(m.k) >= 0; }) &&
            Object.keys(d.nodes).every(function (k) { var n = d.nodes[k]; return n && Number.isInteger(n.gx) && Number.isInteger(n.gy) && Math.abs(n.gx) < 200 && Math.abs(n.gy) < 200; }) &&
            d.weights.every(function (w) { return w && d.nodes[w.node] && isFinite(w.kg) && w.kg > 0 && w.kg < 1e6; });
        },
        start: startProject,
        onTool: function (id) { pending = null; hover = null; renderHud(); requestRender(); },
        onKey: onKey
      };
    }
  }
})(window);
