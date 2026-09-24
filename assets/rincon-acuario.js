/* Rincón tranquilo · Acuario.
   Un acuario plantado de agua dulce dibujado en la página: tetras neón en banco,
   escalares, discos, guppys y corydoras sobre la arena; plantas que se mecen,
   luz del agua, burbujas del difusor y partículas en suspensión.
   Sin imágenes externas, sin red y sin guardar nada. */
(function (window) {
  'use strict';
  var TAU = Math.PI * 2;
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }

  var WATER = {
    blue:   { top: '#3f8fb4', mid: '#1f5f86', deep: '#0c2f4a', tint: 'rgba(120,200,235,', sand: ['#d9c7a3', '#b59f7a'], light: 'rgba(255,255,235,' },
    green:  { top: '#4f9a86', mid: '#2a6a5a', deep: '#0f3530', tint: 'rgba(160,230,190,', sand: ['#d4c49b', '#a99570'], light: 'rgba(245,255,225,' },
    violet: { top: '#6f6bb8', mid: '#3d3a86', deep: '#161540', tint: 'rgba(190,175,255,', sand: ['#c9bfb0', '#958a7c'], light: 'rgba(240,230,255,' }
  };

  function create(canvas) {
    var ctx = canvas.getContext('2d');
    var W = 1, H = 1, dpr = 1, S = 1;
    var t = 0, water = WATER.blue;
    var sandCanvas = document.createElement('canvas'), sctx = sandCanvas.getContext('2d');
    var caus = document.createElement('canvas'), cctx = caus.getContext('2d');
    var CW = 160, CH = 90; caus.width = CW; caus.height = CH;
    var cimg = cctx.createImageData(CW, CH);
    var floorY = 0;

    var plants = [], rocks = [], fish = [], bubbles = [], motes = [], wood = null, school = null;

    function layout() {
      floorY = H * 0.8;
      S = Math.max(0.55, Math.min(W / 900, H / 520));
      buildSand();
      plants = []; rocks = [];
      var i;
      // Fondo: vallisneria alta
      for (i = 0; i < 26; i++) plants.push({ kind: 'val', x: rnd(0, W), base: floorY - rnd(2, 10) * S, h: rnd(.45, .78) * H, w: rnd(4, 7) * S, ph: rnd(0, TAU), z: 0, c: rnd(0, 1) });
      // Rocas
      for (i = 0; i < 5; i++) rocks.push({ x: rnd(.08, .92) * W, y: floorY + rnd(4, 14) * S, rx: rnd(34, 70) * S, ry: rnd(20, 38) * S, c: rnd(0, 1), rot: rnd(-.3, .3) });
      rocks.sort(function (a, b) { return a.y - b.y; });
      // Plano medio: espadas del Amazonas
      for (i = 0; i < 4; i++) plants.push({ kind: 'sword', x: rnd(.1, .9) * W, base: floorY + rnd(2, 8) * S, h: rnd(.2, .3) * H, leaves: 9 + (i % 3), ph: rnd(0, TAU), z: 1 });
      // Plantas de tallo (verdes y rojizas)
      for (i = 0; i < 7; i++) plants.push({ kind: 'stem', x: rnd(.04, .96) * W, base: floorY + rnd(0, 6) * S, h: rnd(.3, .5) * H, ph: rnd(0, TAU), z: 1, red: i % 3 === 0, n: 2 + (i % 3) });
      // Primer plano: césped
      for (i = 0; i < 520; i++) plants.push({ kind: 'grass', x: (Math.floor(i / 40) + .5) / 13 * W + rnd(-34, 34) * S, base: H - rnd(0, (H - floorY) * .55), h: rnd(10, 26) * S, ph: rnd(0, TAU), z: 2, c: rnd(0, 1) });
      wood = { x: W * rnd(.25, .6), y: floorY + 6 * S };
    }

    function buildSand() {
      sandCanvas.width = Math.max(1, Math.round(W)); sandCanvas.height = Math.max(1, Math.round(H - floorY + 20));
      var sh = sandCanvas.height, g = sctx.createLinearGradient(0, 0, 0, sh);
      g.addColorStop(0, water.sand[0]); g.addColorStop(1, water.sand[1]);
      sctx.clearRect(0, 0, W, sh);
      sctx.save(); sctx.beginPath(); sctx.moveTo(0, sh);
      for (var sx = 0; sx <= W + 10; sx += 10) sctx.lineTo(sx, 12 + Math.sin(sx * .008) * 7 + Math.sin(sx * .023 + 1) * 3);
      sctx.lineTo(W, sh); sctx.closePath(); sctx.clip();
      sctx.fillStyle = g; sctx.fillRect(0, 0, W, sh);
      var edge = sctx.createLinearGradient(0, 0, 0, 40); edge.addColorStop(0, 'rgba(0,30,50,.35)'); edge.addColorStop(1, 'rgba(0,30,50,0)');
      for (var i = 0; i < W * sh / 18; i++) {
        var l = Math.random();
        sctx.fillStyle = l < .5 ? 'rgba(90,70,45,' + rnd(.08, .22) + ')' : 'rgba(255,250,235,' + rnd(.08, .25) + ')';
        var r = rnd(.5, 1.6);
        sctx.fillRect(Math.random() * W, Math.random() * sh, r, r);
      }
      for (i = 0; i < 40; i++) {
        var px = Math.random() * W, py = rnd(6, sh), pr = rnd(2, 5);
        var pg = sctx.createRadialGradient(px - pr * .3, py - pr * .3, 0, px, py, pr);
        pg.addColorStop(0, 'rgba(240,230,210,.9)'); pg.addColorStop(1, 'rgba(120,100,80,.9)');
        sctx.fillStyle = pg; sctx.beginPath(); sctx.ellipse(px, py, pr * 1.3, pr, 0, 0, TAU); sctx.fill();
      }
      sctx.fillStyle = edge; sctx.fillRect(0, 0, W, 40);
      sctx.restore();
    }

    /* ---------- Peces ---------- */
    var SPECIES = {
      neon:   { len: 34, speed: 46, depth: [.25, .62] },
      angel:  { len: 84, speed: 20, depth: [.2, .55] },
      discus: { len: 80, speed: 16, depth: [.3, .6] },
      guppy:  { len: 38, speed: 34, depth: [.12, .45] },
      cory:   { len: 46, speed: 14, depth: [.94, .99] }
    };
    function makeFish(kind, x, y, z) {
      var sp = SPECIES[kind];
      return {
        kind: kind, x: x, y: y, z: z,
        vx: rnd(-1, 1), vy: rnd(-.2, .2), face: 1, faceT: 1,
        len: sp.len * rnd(.88, 1.12), speed: sp.speed * rnd(.85, 1.15),
        ph: rnd(0, TAU), wander: rnd(0, TAU), rest: 0,
        hue: rnd(0, 1)
      };
    }
    function populate() {
      fish = [];
      var i, cx = W * rnd(.3, .7), cy = H * .42;
      school = { x: cx, y: cy, tx: cx, ty: cy };
      for (i = 0; i < 22; i++) fish.push(makeFish('neon', cx + rnd(-80, 80) * S, cy + rnd(-40, 40) * S, rnd(.55, 1)));
      fish.push(makeFish('angel', W * .3, H * .35, .95));
      fish.push(makeFish('angel', W * .65, H * .45, .8));
      fish.push(makeFish('discus', W * .5, H * .5, .9));
      for (i = 0; i < 4; i++) fish.push(makeFish('guppy', rnd(.1, .9) * W, rnd(.15, .4) * H, rnd(.7, 1)));
      for (i = 0; i < 3; i++) { var c = makeFish('cory', rnd(.15, .85) * W, floorY + rnd(6, 16) * S, 1); fish.push(c); }
      fish.forEach(function (f) { f.face = f.faceT = f.vx >= 0 ? 1 : -1; });
    }

    function steer(f, dt, k) {
      var sp = SPECIES[f.kind], L = f.len * S * f.z;
      var minY = H * .08 + L * .5, maxY = floorY - L * .3;
      var tx, ty;
      if (f.kind === 'neon') {
        tx = school.x + Math.cos(f.wander) * 70 * S; ty = school.y + Math.sin(f.wander * 1.3) * 34 * S;
        f.wander += dt * k * .5;
      } else if (f.kind === 'cory') {
        minY = floorY + 2 * S; maxY = H - 10 * S;
        if (f.rest > 0) { f.rest -= dt * k; f.vx *= .9; f.vy *= .9; return; }
        f.wander += rnd(-1, 1) * dt * 2; tx = f.x + Math.cos(f.wander) * 80 * S; ty = floorY + 18 * S + Math.sin(f.wander) * 10 * S;
        if (Math.random() < dt * .25) f.rest = rnd(1.5, 4);
      } else {
        f.wander += rnd(-1, 1) * dt * .8;
        tx = f.x + Math.cos(f.wander) * 120 * S; ty = f.y + Math.sin(f.wander) * 40 * S;
      }
      var margin = 60 * S;
      if (f.x < margin) tx = f.x + 200 * S; if (f.x > W - margin) tx = f.x - 200 * S;
      if (f.y < minY) ty = f.y + 60 * S; if (f.y > maxY) ty = f.y - 60 * S;
      var dx = tx - f.x, dy = (ty - f.y) * .6, d = Math.hypot(dx, dy) || 1;
      var v = sp.speed * S * (f.kind === 'neon' ? 1 : .8);
      f.vx = lerp(f.vx, dx / d * v, clamp(dt * k * .9, 0, 1));
      f.vy = lerp(f.vy, dy / d * v * .5, clamp(dt * k * .9, 0, 1));
      if (f.kind === 'neon') {
        fish.forEach(function (o) {
          if (o === f || o.kind !== 'neon') return;
          var ox = f.x - o.x, oy = f.y - o.y, od = ox * ox + oy * oy, lim = 18 * S;
          if (od < lim * lim && od > .01) { f.vx += ox / Math.sqrt(od) * 10 * S * dt; f.vy += oy / Math.sqrt(od) * 10 * S * dt; }
        });
      }
    }

    function update(dt, k) {
      t += dt * k;
      if (school && Math.random() < dt * k * .25) { school.tx = rnd(.18, .82) * W; school.ty = rnd(.25, .6) * H; }
      if (school) { school.x = lerp(school.x, school.tx, dt * k * .25); school.y = lerp(school.y, school.ty, dt * k * .25); }
      fish.forEach(function (f) {
        steer(f, dt, k);
        f.x += f.vx * dt * k; f.y += f.vy * dt * k;
        var want = f.vx >= 0 ? 1 : -1;
        if (Math.abs(f.vx) > 4 * S) f.faceT = want;
        f.face = lerp(f.face, f.faceT, clamp(dt * k * 2.2, 0, 1));
        f.ph += dt * k * (4 + Math.hypot(f.vx, f.vy) / (8 * S));
      });
      if (Math.random() < dt * k * 6) bubbles.push({ x: W * .9 + rnd(-6, 6) * S, y: floorY - 6 * S, r: rnd(1.5, 4.5) * S, v: rnd(40, 70) * S, w: rnd(0, TAU) });
      bubbles.forEach(function (b) { b.y -= b.v * dt * k; b.x += Math.sin(b.y * .05 + b.w) * .4; });
      bubbles = bubbles.filter(function (b) { return b.y > H * .06; });
      motes.forEach(function (m) { m.x += m.vx * dt * k; m.y += m.vy * dt * k; if (m.x < 0) m.x = W; if (m.x > W) m.x = 0; if (m.y < 0) m.y = H; if (m.y > H) m.y = 0; });
    }

    /* ---------- Dibujo ---------- */
    function drawWater() {
      var g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, water.top); g.addColorStop(.45, water.mid); g.addColorStop(1, water.deep);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // haces de luz
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < 6; i++) {
        var x = W * (i / 6 + .05) + Math.sin(t * .15 + i * 1.7) * 30 * S, w = (60 + 40 * Math.sin(i * 2.3)) * S;
        var lg = ctx.createLinearGradient(0, 0, 0, floorY);
        lg.addColorStop(0, water.light + '0.10)'); lg.addColorStop(1, water.light + '0)');
        ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + w, 0); ctx.lineTo(x + w * 2.2 + 80 * S, floorY); ctx.lineTo(x + w * .8 + 80 * S, floorY); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }

    function drawCaustics(y0, y1, alpha) {
      var d = cimg.data, tt = t * .9, p = 0;
      for (var y = 0; y < CH; y++) {
        for (var x = 0; x < CW; x++) {
          var u = x / CW * 9, v = y / CH * 5;
          var s = Math.sin(u * 1.3 + tt) + Math.sin(v * 1.7 - tt * .8 + u * .6) + Math.sin((u - v) * 1.1 + tt * 1.2) + Math.sin(u * .5 + v * 2.2 - tt * .5);
          var c = 1 - clamp(Math.abs(s) * 1.6, 0, 1);
          c = c * c * c * 255;
          d[p] = 255; d[p + 1] = 255; d[p + 2] = 235; d[p + 3] = c; p += 4;
        }
      }
      cctx.putImageData(cimg, 0, 0);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = alpha; ctx.imageSmoothingEnabled = true;
      ctx.drawImage(caus, 0, y0, W, y1 - y0);
      ctx.restore();
    }

    function drawSurface() {
      var g = ctx.createLinearGradient(0, 0, 0, H * .07);
      g.addColorStop(0, 'rgba(255,255,255,.28)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H * .07);
      ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 1.2 * S;
      ctx.beginPath();
      for (var x = 0; x <= W; x += 8) { var y = H * .035 + Math.sin(x * .02 + t * 1.2) * 2 * S + Math.sin(x * .05 - t) * 1.2 * S; if (x) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
      ctx.stroke();
    }

    function drawVal(p) {
      var segs = 10, sway = Math.sin(t * .7 + p.ph) * 26 * S, x0 = p.x, y0 = p.base;
      var dark = p.c < .5;
      ctx.beginPath();
      var pts = [];
      for (var i = 0; i <= segs; i++) {
        var f = i / segs, y = y0 - p.h * f;
        var x = x0 + sway * f * f + Math.sin(t * 1.1 + p.ph + f * 3) * 5 * S * f;
        pts.push([x, y, p.w * (1 - f * .85)]);
      }
      ctx.moveTo(pts[0][0] - pts[0][2], pts[0][1]);
      for (i = 1; i <= segs; i++) ctx.lineTo(pts[i][0] - pts[i][2], pts[i][1]);
      for (i = segs; i >= 0; i--) ctx.lineTo(pts[i][0] + pts[i][2], pts[i][1]);
      ctx.closePath();
      var g = ctx.createLinearGradient(0, y0, 0, y0 - p.h);
      g.addColorStop(0, dark ? 'rgba(40,90,55,.85)' : 'rgba(60,120,70,.85)');
      g.addColorStop(1, dark ? 'rgba(90,150,90,.55)' : 'rgba(130,190,110,.55)');
      ctx.fillStyle = g; ctx.fill();
    }

    function drawSword(p) {
      for (var i = 0; i < p.leaves; i++) {
        var a = -Math.PI / 2 + (i / (p.leaves - 1) - .5) * 1.7 + Math.sin(t * .6 + p.ph + i) * .05;
        var len = p.h * (0.6 + 0.4 * Math.sin(i * 1.7 + 1) * Math.sin(i * 1.7 + 1));
        var bx = p.x, by = p.base;
        var ex = bx + Math.cos(a) * len, ey = by + Math.sin(a) * len;
        var mx = bx + Math.cos(a) * len * .55 + Math.cos(a + Math.PI / 2) * len * .02, my = by + Math.sin(a) * len * .55;
        var wd = len * .12;
        var nx = Math.cos(a + Math.PI / 2) * wd, ny = Math.sin(a + Math.PI / 2) * wd;
        var g = ctx.createLinearGradient(bx, by, ex, ey);
        g.addColorStop(0, '#2f6b3a'); g.addColorStop(1, '#6fb35c');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.moveTo(bx, by);
        ctx.quadraticCurveTo(mx + nx, my + ny, ex, ey);
        ctx.quadraticCurveTo(mx - nx, my - ny, bx, by);
        ctx.fill();
        ctx.strokeStyle = 'rgba(210,240,170,.35)'; ctx.lineWidth = 1 * S;
        ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(mx, my, ex, ey); ctx.stroke();
      }
    }

    function drawStem(p) {
      for (var sidx = 0; sidx < p.n; sidx++) {
        var off = (sidx - (p.n - 1) / 2) * 9 * S, h = p.h * (1 - sidx * .12);
        var sway = Math.sin(t * .6 + p.ph + sidx) * 16 * S;
        var steps = 14;
        ctx.strokeStyle = p.red ? 'rgba(150,70,60,.9)' : 'rgba(70,120,60,.9)'; ctx.lineWidth = 1.6 * S;
        ctx.beginPath(); ctx.moveTo(p.x + off, p.base);
        ctx.quadraticCurveTo(p.x + off + sway * .4, p.base - h * .5, p.x + off + sway, p.base - h); ctx.stroke();
        for (var i = 1; i <= steps; i++) {
          var f = i / steps, x = p.x + off + sway * f * f * .9 + sway * .1 * f, y = p.base - h * f;
          var lw = (8 - f * 3) * S, col = p.red ? (f > .55 ? 'rgba(205,90,70,.9)' : 'rgba(120,130,70,.9)') : (f > .6 ? 'rgba(140,200,100,.9)' : 'rgba(80,150,70,.9)');
          ctx.fillStyle = col;
          ctx.beginPath(); ctx.ellipse(x - lw * .7, y, lw, lw * .38, -.35, 0, TAU); ctx.fill();
          ctx.beginPath(); ctx.ellipse(x + lw * .7, y, lw, lw * .38, .35, 0, TAU); ctx.fill();
        }
      }
    }

    function drawGrass(p) {
      var sway = Math.sin(t * .9 + p.ph) * 3 * S;
      ctx.strokeStyle = p.c < .5 ? 'rgba(70,140,70,.9)' : 'rgba(110,175,90,.9)';
      ctx.lineWidth = 2 * S; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(p.x, p.base); ctx.quadraticCurveTo(p.x + sway * .5, p.base - p.h * .5, p.x + sway, p.base - p.h); ctx.stroke();
    }

    function drawRock(r) {
      var g = ctx.createRadialGradient(-r.rx * .35, -r.ry * .55, r.ry * .15, 0, 0, r.rx * 1.1);
      g.addColorStop(0, r.c < .5 ? '#a7a39a' : '#9c8f80'); g.addColorStop(.6, r.c < .5 ? '#6d6a64' : '#6b5f52'); g.addColorStop(1, '#3a352f');
      ctx.fillStyle = g;
      ctx.save(); ctx.translate(r.x, r.y); ctx.rotate(r.rot);
      ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(r.rx * .1, r.ry * .45, r.rx * 1.05, r.ry * .25, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(-r.rx, r.ry * .4);
      ctx.bezierCurveTo(-r.rx * 1.05, -r.ry * .5, -r.rx * .4, -r.ry * 1.1, r.rx * .1, -r.ry);
      ctx.bezierCurveTo(r.rx * .7, -r.ry * .95, r.rx * 1.05, -r.ry * .2, r.rx, r.ry * .4);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    function drawWood() {
      if (!wood) return;
      ctx.save(); ctx.translate(wood.x, wood.y);
      var g = ctx.createLinearGradient(0, -60 * S, 0, 10 * S);
      g.addColorStop(0, '#8a6a4a'); g.addColorStop(1, '#3d2a1b');
      ctx.fillStyle = g; ctx.strokeStyle = 'rgba(30,20,10,.5)'; ctx.lineWidth = 1 * S;
      ctx.beginPath();
      ctx.moveTo(-130 * S, 8 * S); ctx.bezierCurveTo(-80 * S, -10 * S, -30 * S, -20 * S, 10 * S, -60 * S);
      ctx.bezierCurveTo(30 * S, -85 * S, 55 * S, -120 * S, 70 * S, -150 * S);
      ctx.lineTo(80 * S, -146 * S);
      ctx.bezierCurveTo(70 * S, -110 * S, 50 * S, -70 * S, 30 * S, -40 * S);
      ctx.bezierCurveTo(60 * S, -45 * S, 100 * S, -60 * S, 130 * S, -90 * S);
      ctx.lineTo(136 * S, -84 * S);
      ctx.bezierCurveTo(100 * S, -40 * S, 60 * S, -15 * S, 40 * S, 8 * S);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // musgo sobre el tronco
      for (var m = 0; m < 26; m++) {
        var mf = m / 26, mx = lerp(-110, 60, mf) * S, my = lerp(0, -120, mf * mf) * S + Math.sin(m) * 6 * S;
        ctx.fillStyle = m % 2 ? 'rgba(70,120,50,.8)' : 'rgba(100,150,60,.75)';
        ctx.beginPath(); ctx.arc(mx, my, (4 + (m % 3)) * S, 0, TAU); ctx.fill();
      }
      ctx.restore();
    }

    /* Cuerpo genérico: perfil superior e inferior con Bézier, x de -0.5 (cola) a 0.5 (boca) */
    function bodyPath(L, hTop, hBot, headRound) {
      ctx.beginPath();
      ctx.moveTo(-.5 * L, 0);
      ctx.bezierCurveTo(-.3 * L, -hTop * .55, .05 * L, -hTop, .32 * L, -hTop * .7);
      ctx.bezierCurveTo(.46 * L, -hTop * .45 * headRound, .52 * L, -hTop * .1, .5 * L, 0);
      ctx.bezierCurveTo(.5 * L, hBot * .25, .4 * L, hBot * .75, .2 * L, hBot * .85);
      ctx.bezierCurveTo(-.05 * L, hBot, -.32 * L, hBot * .5, -.5 * L, 0);
      ctx.closePath();
    }
    function eye(x, y, r) {
      ctx.fillStyle = '#e9e2cf'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
      ctx.fillStyle = '#1a1510'; ctx.beginPath(); ctx.arc(x + r * .1, y, r * .62, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.beginPath(); ctx.arc(x + r * .3, y - r * .3, r * .22, 0, TAU); ctx.fill();
    }
    function finFan(x, y, a0, a1, len, colorA, colorB, wav) {
      var g = ctx.createRadialGradient(x, y, 0, x, y, len);
      g.addColorStop(0, colorA); g.addColorStop(1, colorB);
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, y);
      var n = 10;
      for (var i = 0; i <= n; i++) {
        var a = lerp(a0, a1, i / n), l = len * (1 + Math.sin(i * 1.3 + wav) * .05);
        ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
      }
      ctx.closePath(); ctx.fill();
    }
    function gloss(L, h) {
      var g = ctx.createLinearGradient(0, -h, 0, h * .2);
      g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.35, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(.05 * L, -h * .35, L * .38, h * .28, 0, 0, TAU); ctx.fill();
      var sh = ctx.createLinearGradient(0, -h, 0, 0);
      sh.addColorStop(0, 'rgba(0,20,30,.28)'); sh.addColorStop(1, 'rgba(0,20,30,0)');
      ctx.fillStyle = sh; ctx.fillRect(-L * .6, -h * 1.2, L * 1.2, h * .9);
    }
    function tailFork(L, h, beat, colorA, colorB) {
      var tx = -.5 * L, spread = h * (1 + beat * .15), len = L * .32 * (1 - Math.abs(beat) * .25);
      var g = ctx.createLinearGradient(tx, 0, tx - len, 0);
      g.addColorStop(0, colorA); g.addColorStop(1, colorB);
      ctx.fillStyle = g; ctx.beginPath();
      ctx.moveTo(tx + L * .04, 0);
      ctx.quadraticCurveTo(tx - len * .5, -spread * .4 + beat * h * .2, tx - len, -spread + beat * h * .3);
      ctx.quadraticCurveTo(tx - len * .6, beat * h * .2, tx - len, spread + beat * h * .3);
      ctx.quadraticCurveTo(tx - len * .5, spread * .4 + beat * h * .2, tx + L * .04, 0);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = .8 * S;
      for (var r = -2; r <= 2; r++) { ctx.beginPath(); ctx.moveTo(tx + L * .02, 0); ctx.lineTo(tx - len * .95, r / 2 * spread * .9 + beat * h * .3); ctx.stroke(); }
    }

    function drawNeon(f, L) {
      var h = L * .2, beat = Math.sin(f.ph);
      tailFork(L, h * .9, beat, 'rgba(210,220,225,.55)', 'rgba(210,220,225,.15)');
      bodyPath(L, h, h * .95, 1);
      var g = ctx.createLinearGradient(0, -h, 0, h);
      g.addColorStop(0, 'rgba(150,160,150,.95)'); g.addColorStop(.5, 'rgba(215,220,215,.95)'); g.addColorStop(1, 'rgba(240,238,230,.95)');
      ctx.fillStyle = g; ctx.fill();
      ctx.save(); bodyPath(L, h, h * .95, 1); ctx.clip();
      // franja roja inferior trasera
      var rg = ctx.createLinearGradient(-.5 * L, 0, .15 * L, 0);
      rg.addColorStop(0, 'rgba(220,40,50,.95)'); rg.addColorStop(1, 'rgba(220,40,50,0)');
      ctx.fillStyle = rg; ctx.fillRect(-.5 * L, h * .05, L * .75, h);
      // franja azul iridiscente
      var shimmer = .75 + .25 * Math.sin(t * 2 + f.hue * 6);
      var bg = ctx.createLinearGradient(0, -h * .45, 0, h * .05);
      bg.addColorStop(0, 'rgba(60,220,255,0)'); bg.addColorStop(.5, 'rgba(40,200,255,' + shimmer + ')'); bg.addColorStop(1, 'rgba(20,120,220,0)');
      ctx.fillStyle = bg; ctx.fillRect(-.42 * L, -h * .5, L * .82, h * .6);
      ctx.fillStyle = bg; ctx.fillRect(-.42 * L, -h * .5, L * .82, h * .6);
      gloss(L, h);
      ctx.restore();
      eye(.34 * L, -h * .15, h * .32);
    }

    function drawAngel(f, L) {
      var h = L * .42, beat = Math.sin(f.ph * .6);
      // aletas dorsal y anal largas
      ctx.fillStyle = 'rgba(220,225,215,.55)';
      ctx.beginPath(); ctx.moveTo(.1 * L, -h * .8); ctx.quadraticCurveTo(-.15 * L, -h * 1.6, -.55 * L + beat * 3, -h * 2.1); ctx.quadraticCurveTo(-.3 * L, -h * 1.1, -.3 * L, -h * .45); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(.1 * L, h * .8); ctx.quadraticCurveTo(-.15 * L, h * 1.6, -.55 * L - beat * 3, h * 2.1); ctx.quadraticCurveTo(-.3 * L, h * 1.1, -.3 * L, h * .45); ctx.closePath(); ctx.fill();
      // filamentos ventrales
      ctx.strokeStyle = 'rgba(235,235,225,.6)'; ctx.lineWidth = 1.2 * S;
      ctx.beginPath(); ctx.moveTo(.18 * L, h * .5); ctx.quadraticCurveTo(.05 * L, h * 1.5, -.1 * L + beat * 4, h * 2.3); ctx.stroke();
      tailFork(L * .9, h * .7, beat, 'rgba(220,225,215,.55)', 'rgba(220,225,215,.1)');
      // cuerpo en disco
      ctx.beginPath();
      ctx.moveTo(.5 * L, 0);
      ctx.bezierCurveTo(.45 * L, -h * .5, .2 * L, -h * .95, 0, -h * .9);
      ctx.bezierCurveTo(-.25 * L, -h * .8, -.45 * L, -h * .3, -.48 * L, 0);
      ctx.bezierCurveTo(-.45 * L, h * .3, -.25 * L, h * .8, 0, h * .9);
      ctx.bezierCurveTo(.2 * L, h * .95, .45 * L, h * .5, .5 * L, 0);
      ctx.closePath();
      var g = ctx.createLinearGradient(0, -h, 0, h);
      g.addColorStop(0, '#b9b7a4'); g.addColorStop(.5, '#e9e6d6'); g.addColorStop(1, '#cfcbb8');
      ctx.fillStyle = g; ctx.fill();
      ctx.save(); ctx.clip();
      ctx.fillStyle = 'rgba(30,28,25,.75)';
      [.3, .02, -.3].forEach(function (bx, i) { ctx.beginPath(); ctx.ellipse(bx * L, 0, L * (i === 1 ? .06 : .045), h, 0, 0, TAU); ctx.fill(); });
      gloss(L, h * .9);
      ctx.restore();
      eye(.33 * L, -h * .15, h * .13);
    }

    function drawDiscus(f, L) {
      var h = L * .5, beat = Math.sin(f.ph * .5);
      ctx.fillStyle = 'rgba(200,120,60,.5)';
      ctx.beginPath(); ctx.ellipse(-.02 * L, 0, L * .55, h * 1.08, 0, 0, TAU); ctx.fill();
      tailFork(L * .7, h * .45, beat, 'rgba(210,140,70,.6)', 'rgba(210,140,70,.1)');
      ctx.beginPath(); ctx.ellipse(0, 0, L * .48, h * .95, 0, 0, TAU);
      var g = ctx.createRadialGradient(L * .1, -h * .3, h * .1, 0, 0, L * .55);
      g.addColorStop(0, '#f2a25a'); g.addColorStop(1, '#b8582a');
      ctx.fillStyle = g; ctx.fill();
      ctx.save(); ctx.clip();
      ctx.strokeStyle = 'rgba(70,200,210,.7)'; ctx.lineWidth = 2.2 * S;
      for (var i = -5; i <= 5; i++) {
        ctx.beginPath();
        for (var x = -L * .5; x <= L * .5; x += 3) { var y = i * h * .17 + Math.sin(x * .12 + i) * h * .05; if (x === -L * .5) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(90,40,20,.35)'; ctx.fillRect(.2 * L, -h, L * .06, h * 2);
      gloss(L, h * .9);
      ctx.restore();
      eye(.32 * L, -h * .1, h * .12);
    }

    function drawGuppy(f, L) {
      var h = L * .2, beat = Math.sin(f.ph);
      var hues = [['rgba(255,140,40,.9)', 'rgba(40,120,255,.55)'], ['rgba(240,70,110,.9)', 'rgba(255,200,60,.55)'], ['rgba(60,170,255,.9)', 'rgba(200,90,255,.55)']];
      var hc = hues[Math.floor(f.hue * 3) % 3];
      var tx = -.45 * L, spread = L * .38 * (1 + beat * .1), tl = L * .7 * (1 - Math.abs(beat) * .2);
      var g = ctx.createRadialGradient(tx, 0, 0, tx, 0, tl);
      g.addColorStop(0, hc[0]); g.addColorStop(1, hc[1]);
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(tx + 2, 0);
      ctx.quadraticCurveTo(tx - tl * .4, -spread, tx - tl, -spread * .7 + beat * 3);
      ctx.quadraticCurveTo(tx - tl * 1.08, beat * 3, tx - tl, spread * .7 + beat * 3);
      ctx.quadraticCurveTo(tx - tl * .4, spread, tx + 2, 0); ctx.fill();
      bodyPath(L, h, h * 1.05, 1);
      var bg = ctx.createLinearGradient(0, -h, 0, h);
      bg.addColorStop(0, '#8d9a8a'); bg.addColorStop(1, '#dcdcd0');
      ctx.fillStyle = bg; ctx.fill();
      ctx.save(); bodyPath(L, h, h * 1.05, 1); ctx.clip();
      ctx.fillStyle = hc[0]; ctx.globalAlpha = .5; ctx.beginPath(); ctx.ellipse(-.15 * L, 0, L * .14, h * .5, 0, 0, TAU); ctx.fill();
      ctx.globalAlpha = 1; gloss(L, h);
      ctx.restore();
      eye(.34 * L, -h * .15, h * .33);
    }

    function drawCory(f, L) {
      var h = L * .26, beat = Math.sin(f.ph * 1.3);
      tailFork(L, h * .8, beat * .6, 'rgba(180,170,150,.7)', 'rgba(180,170,150,.15)');
      finFan(-.05 * L, -h * .8, -Math.PI * .75, -Math.PI * .35, h * 1.1, 'rgba(170,160,140,.8)', 'rgba(170,160,140,.2)', t);
      bodyPath(L, h, h * .7, 1.2);
      var g = ctx.createLinearGradient(0, -h, 0, h);
      g.addColorStop(0, '#7b7466'); g.addColorStop(.6, '#b7ae98'); g.addColorStop(1, '#e8e0cc');
      ctx.fillStyle = g; ctx.fill();
      ctx.save(); bodyPath(L, h, h * .7, 1.2); ctx.clip();
      ctx.fillStyle = 'rgba(50,45,40,.55)';
      for (var i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(-.35 * L + i * L * .09, -h * .2 + (i % 2) * h * .3, h * .12, 0, TAU); ctx.fill(); }
      gloss(L, h);
      ctx.restore();
      ctx.strokeStyle = 'rgba(220,210,190,.8)'; ctx.lineWidth = 1 * S;
      ctx.beginPath(); ctx.moveTo(.48 * L, h * .3); ctx.lineTo(.56 * L, h * .6); ctx.moveTo(.46 * L, h * .35); ctx.lineTo(.52 * L, h * .7); ctx.stroke();
      eye(.32 * L, -h * .25, h * .2);
    }

    function drawFish(f) {
      var L = f.len * S * f.z;
      ctx.save();
      ctx.translate(f.x, f.y + Math.sin(f.ph * .3) * 1.5 * S);
      var tilt = clamp(f.vy / (60 * S), -.25, .25);
      ctx.rotate(tilt * f.faceT);
      ctx.scale(f.face, 1);
      // lejanía: más transparente y teñido por el agua
      ctx.globalAlpha = lerp(.55, 1, (f.z - .5) * 2);
      if (f.kind === 'neon') drawNeon(f, L);
      else if (f.kind === 'angel') drawAngel(f, L);
      else if (f.kind === 'discus') drawDiscus(f, L);
      else if (f.kind === 'guppy') drawGuppy(f, L);
      else drawCory(f, L);
      ctx.restore();
    }

    function drawBubbles() {
      bubbles.forEach(function (b) {
        ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 1 * S;
        ctx.fillStyle = 'rgba(255,255,255,.12)';
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.beginPath(); ctx.arc(b.x - b.r * .35, b.y - b.r * .35, b.r * .25, 0, TAU); ctx.fill();
      });
      // difusor
      ctx.fillStyle = '#5b5f63'; ctx.beginPath(); ctx.ellipse(W * .9, floorY - 3 * S, 10 * S, 4 * S, 0, 0, TAU); ctx.fill();
    }

    function drawMotes() {
      ctx.fillStyle = 'rgba(255,255,240,.35)';
      motes.forEach(function (m) { ctx.fillRect(m.x, m.y, m.r, m.r); });
    }

    function vignette() {
      var g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .3, W / 2, H / 2, Math.max(W, H) * .75);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,10,20,.45)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }

    function draw() {
      drawWater();
      drawCaustics(0, floorY, .05);
      plants.forEach(function (p) { if (p.kind === 'val') drawVal(p); });
      // peces lejanos detrás de las rocas
      var fog = ctx.createLinearGradient(0, 0, 0, floorY);
      fog.addColorStop(0, 'rgba(0,0,0,0)'); fog.addColorStop(1, water.tint + '0.22)');
      ctx.fillStyle = fog; ctx.fillRect(0, 0, W, floorY);
      fish.forEach(function (f) { if (f.z < .75 && f.kind !== 'cory') drawFish(f); });
      ctx.globalAlpha = .18; ctx.fillStyle = water.mid; ctx.fillRect(0, 0, W, floorY); ctx.globalAlpha = 1;
      ctx.drawImage(sandCanvas, 0, floorY - 10);
      drawCaustics(floorY - 10, H, .22);
      drawWood();
      rocks.forEach(drawRock);
      plants.forEach(function (p) { if (p.kind === 'sword') drawSword(p); else if (p.kind === 'stem') drawStem(p); });
      fish.forEach(function (f) { if (f.z >= .75 || f.kind === 'cory') drawFish(f); });
      drawBubbles();
      plants.forEach(function (p) { if (p.kind === 'grass') drawGrass(p); });
      drawMotes();
      drawSurface();
      vignette();
    }

    function resize(w, h, ratio) {
      var oW = W, oH = H;
      W = Math.max(1, w); H = Math.max(1, h); dpr = ratio || 1;
      if (fish.length && (oW !== W || oH !== H)) {
        var sx = W / oW, sy = H / oH;
        fish.forEach(function (f) { f.x *= sx; f.y *= sy; f.vx *= sx; f.vy *= sy; });
        if (school) { school.x *= sx; school.y *= sy; school.tx *= sx; school.ty *= sy; }
        bubbles = [];
      }
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layout();
      if (!fish.length) populate();
      motes = [];
      for (var i = 0; i < 70; i++) motes.push({ x: rnd(0, W), y: rnd(0, H), r: rnd(.8, 1.8) * S, vx: rnd(-3, 3) * S, vy: rnd(-2, 2) * S });
    }

    return {
      resize: resize,
      setWater: function (name) { var w = WATER[name] || WATER.blue; if (w !== water) { water = w; buildSand(); } },
      frame: function (dt, k) { update(dt, k); draw(); },
      warm: function (sec) { for (var i = 0; i < sec * 30; i++) update(1 / 30, 1); }
    };
  }

  window.IGAquarium = { create: create };
}(window));
