/* Iris Green · Cielo nocturno · el cielo en directo.
   Planetario en canvas: el cielo que se ve desde un lugar de España a una hora concreta,
   con horizonte, Vía Láctea, estrellas con su color, Luna con su fase y planetas.
   Nada se mueve solo: la vista cambia cuando la persona arrastra, pulsa o usa el teclado.
   Cálculos: posiciones J2000 (HYG), tiempo sidéreo medio, elementos keplerianos aproximados del JPL
   para los planetas y fórmulas de baja precisión para la Luna (error de ~1°, suficiente para mirar). */
(function () {
  'use strict';
  var R = Math.PI / 180;
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function mod(x, m) { return ((x % m) + m) % m; }

  /* ---------- tiempo y astronomía ---------- */
  function jd(date) { return date.getTime() / 86400000 + 2440587.5; }
  function lstHours(date, lonDeg) { var d = jd(date) - 2451545.0; return mod(18.697374558 + 24.06570982441908 * d + lonDeg / 15, 24); }
  var EPS = 23.43928 * R;
  function eclToEq(x, y, z) { return [x, y * Math.cos(EPS) - z * Math.sin(EPS), y * Math.sin(EPS) + z * Math.cos(EPS)]; }
  function vecToRaDec(v) { var r = Math.hypot(v[0], v[1], v[2]); return { ra: mod(Math.atan2(v[1], v[0]) / R / 15, 24), dec: Math.asin(v[2] / r) / R, r: r }; }
  var EL = {   // a, e, I, L, varpi, Omega y sus variaciones por siglo (JPL, 1800–2050)
    mercurio: [0.38709927, 0.00000037, 0.20563593, 0.00001906, 7.00497902, -0.00594749, 252.25032350, 149472.67411175, 77.45779628, 0.16047689, 48.33076593, -0.12534081],
    venus: [0.72333566, 0.00000390, 0.00677672, -0.00004107, 3.39467605, -0.00078890, 181.97909950, 58517.81538729, 131.60246718, 0.00268329, 76.67984255, -0.27769418],
    tierra: [1.00000261, 0.00000562, 0.01671123, -0.00004392, -0.00001531, -0.01294668, 100.46457166, 35999.37244981, 102.93768193, 0.32327364, 0, 0],
    marte: [1.52371034, 0.00001847, 0.09339410, 0.00007882, 1.84969142, -0.00813131, -4.55343205, 19140.30268499, -23.94362959, 0.44441088, 49.55953891, -0.29257343],
    jupiter: [5.20288700, -0.00011607, 0.04838624, -0.00013253, 1.30439695, -0.00183714, 34.39644051, 3034.74612775, 14.72847983, 0.21252668, 100.47390909, 0.20469106],
    saturno: [9.53667594, -0.00125060, 0.05386179, -0.00050991, 2.48599187, 0.00193609, 49.95424423, 1222.49362201, 92.59887831, -0.41897216, 113.66242448, -0.28867794]
  };
  function helio(k, T) {
    var e = EL[k], a = e[0] + e[1] * T, ec = e[2] + e[3] * T, I = (e[4] + e[5] * T) * R, L = e[6] + e[7] * T, vp = e[8] + e[9] * T, Om = (e[10] + e[11] * T) * R;
    var M = mod(L - vp + 180, 360) - 180, w = (vp - Om / R) * R, Mr = M * R, E = Mr + ec * Math.sin(Mr);
    for (var i = 0; i < 8; i++) E = E - (E - ec * Math.sin(E) - Mr) / (1 - ec * Math.cos(E));
    var xp = a * (Math.cos(E) - ec), yp = a * Math.sqrt(1 - ec * ec) * Math.sin(E);
    var cw = Math.cos(w), sw = Math.sin(w), cO = Math.cos(Om), sO = Math.sin(Om), cI = Math.cos(I), sI = Math.sin(I);
    return [(cw * cO - sw * sO * cI) * xp + (-sw * cO - cw * sO * cI) * yp, (cw * sO + sw * cO * cI) * xp + (-sw * sO + cw * cO * cI) * yp, (sw * sI) * xp + (cw * sI) * yp];
  }
  function bodies(date) {
    var T = (jd(date) - 2451545.0) / 36525, earth = helio('tierra', T), out = {};
    ['mercurio', 'venus', 'marte', 'jupiter', 'saturno'].forEach(function (k) {
      var p = helio(k, T); out[k] = vecToRaDec(eclToEq(p[0] - earth[0], p[1] - earth[1], p[2] - earth[2]));
    });
    out.sol = vecToRaDec(eclToEq(-earth[0], -earth[1], -earth[2]));
    var lam = 218.32 + 481267.881 * T + 6.29 * Math.sin((135.0 + 477198.87 * T) * R) - 1.27 * Math.sin((259.3 - 413335.36 * T) * R) + 0.66 * Math.sin((235.7 + 890534.22 * T) * R)
      + 0.21 * Math.sin((269.9 + 954397.74 * T) * R) - 0.19 * Math.sin((357.5 + 35999.05 * T) * R) - 0.11 * Math.sin((186.5 + 966404.03 * T) * R);
    var bet = 5.13 * Math.sin((93.3 + 483202.02 * T) * R) + 0.28 * Math.sin((228.2 + 960400.89 * T) * R) - 0.28 * Math.sin((318.3 + 6003.15 * T) * R) - 0.17 * Math.sin((217.6 - 407332.21 * T) * R);
    var cb = Math.cos(bet * R);
    out.luna = vecToRaDec(eclToEq(cb * Math.cos(lam * R), cb * Math.sin(lam * R), Math.sin(bet * R)));
    var sunLon = Math.atan2(-earth[1], -earth[0]) / R, elong = mod(lam - sunLon, 360);
    out.luna.fase = (1 - Math.cos(elong * R)) / 2; out.luna.creciente = elong < 180;
    return out;
  }

  /* ---------- lugares ---------- */
  var PLACES = [
    ['madrid', 'Madrid', 40.42, -3.70], ['barcelona', 'Barcelona', 41.39, 2.17], ['valencia', 'València', 39.47, -0.38], ['sevilla', 'Sevilla', 37.39, -5.99],
    ['bilbao', 'Bilbao', 43.26, -2.93], ['coruna', 'A Coruña', 43.36, -8.41], ['zaragoza', 'Zaragoza', 41.65, -0.88], ['malaga', 'Málaga', 36.72, -4.42],
    ['palma', 'Palma', 39.57, 2.65], ['laspalmas', 'Las Palmas de Gran Canaria', 28.12, -15.43], ['tenerife', 'Santa Cruz de Tenerife', 28.46, -16.25],
    ['teide', 'Observatorio del Teide', 28.30, -16.51], ['ceuta', 'Ceuta', 35.89, -5.32], ['melilla', 'Melilla', 35.29, -2.94]
  ];

  window.IGCieloVivo = { start: function (D, api) {
    var EN = api.EN, T = api.T;
    var host = document.getElementById('cn-sky'), ui = document.getElementById('cn-sky-ui'), nowBox = document.getElementById('cn-now-app');
    if (!host || !ui) return;
    var stage = host.closest('.cn-stage');
    stage.classList.add('cn-live');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* vectores de estrellas */
    function unit(ra, dec) { var a = ra * 15 * R, d = dec * R, c = Math.cos(d); return [c * Math.cos(a), c * Math.sin(a), Math.sin(d)]; }
    var SV = D.estrellas.map(function (s) { var u = unit(s[0], s[1]); return { x: u[0], y: u[1], z: u[2], m: s[2], ci: s[3], con: s[4], d: s[5], n: s[6], ly: s[7], sp: s[8] }; });
    D.debiles.forEach(function (s) { var u = unit(s[0], s[1]); SV.push({ x: u[0], y: u[1], z: u[2], m: s[2], ci: s[3] }); });
    var MW = D.via_lactea.map(function (p) { var u = unit(p[0], p[1]); return [u[0], u[1], u[2], p[2]]; });
    var LINES = D.constelaciones.map(function (c) { return { c: c, segs: c.lines.map(function (l) { return l.map(function (p) { return unit(p[0], p[1]); }); }) }; });
    var LABELS = D.constelaciones.map(function (c) { var u = unit(c.label[0], c.label[1]); return { c: c, x: u[0], y: u[1], z: u[2] }; });

    /* estado */
    var st = { place: PLACES[0], date: null, az: 180, alt: 28, fov: 100, lines: true, names: true, planets: true, sky: 6.5, sel: null, hit: null };
    if (window.innerWidth < 760) { st.fov = 75; st.alt = 32; }
    (function initDate() { var d = new Date(); var sun = bodies(d).sol; var h = horiz(sun.ra, sun.dec, d, st.place); if (h.alt > -12) { d.setHours(22, 0, 0, 0); if (new Date().getHours() >= 22) d.setDate(d.getDate() + 1); } st.date = d; })();

    /* horizontales */
    var M = null;   // matriz ecuatorial → (este, norte, arriba)
    function matrix(date, place) {
      var L = lstHours(date, place[3]) * 15 * R, cL = Math.cos(L), sL = Math.sin(L), p = place[2] * R, cp = Math.cos(p), sp = Math.sin(p);
      return [[-sL, cL, 0], [-sp * cL, -sp * sL, cp], [cp * cL, cp * sL, sp]];
    }
    function toH(x, y, z, m) { m = m || M; return [m[0][0] * x + m[0][1] * y + m[0][2] * z, m[1][0] * x + m[1][1] * y + m[1][2] * z, m[2][0] * x + m[2][1] * y + m[2][2] * z]; }
    function horiz(ra, dec, date, place) { var u = unit(ra, dec), h = toH(u[0], u[1], u[2], matrix(date, place)); return { alt: Math.asin(clamp(h[2], -1, 1)) / R, az: mod(Math.atan2(h[0], h[1]) / R, 360) }; }
    function fromH(e, n, u) {           // inversa (la matriz es ortogonal: se usa la traspuesta)
      return [M[0][0] * e + M[1][0] * n + M[2][0] * u, M[0][1] * e + M[1][1] * n + M[2][1] * u, M[0][2] * e + M[1][2] * n + M[2][2] * u];
    }

    /* cámara (proyección estereográfica) */
    var W = 0, H = 0, DPR = 1, S = 1, F, Rt, U;
    function camera() {
      var a = st.az * R, b = st.alt * R;
      F = [Math.sin(a) * Math.cos(b), Math.cos(a) * Math.cos(b), Math.sin(b)];
      Rt = [Math.cos(a), -Math.sin(a), 0];
      U = [-Math.sin(a) * Math.sin(b), -Math.cos(a) * Math.sin(b), Math.cos(b)];
      S = (W / 2) / (2 * Math.tan(st.fov * R / 4));
    }
    function proj(h, lim) {
      var vz = h[0] * F[0] + h[1] * F[1] + h[2] * F[2];
      if (vz < (lim === undefined ? -0.2 : lim)) return null;
      var k = 2 / (1 + Math.max(vz, -0.9));
      return [W / 2 + k * (h[0] * Rt[0] + h[1] * Rt[1] + h[2] * Rt[2]) * S, H / 2 - k * (h[0] * U[0] + h[1] * U[1] + h[2] * U[2]) * S];
    }
    function unproj(px, py) {
      var X = (px - W / 2) / S, Y = (H / 2 - py) / S, r2 = X * X + Y * Y, vz = (4 - r2) / (4 + r2), f = (1 + vz) / 2;
      var vx = X * f, vy = Y * f;
      return [vx * Rt[0] + vy * U[0] + vz * F[0], vx * Rt[1] + vy * U[1] + vz * F[1], vx * Rt[2] + vy * U[2] + vz * F[2]];
    }
    function hAz(az, alt) { var a = az * R, b = alt * R; return [Math.sin(a) * Math.cos(b), Math.cos(a) * Math.cos(b), Math.sin(b)]; }

    /* horizonte: colinas genéricas (no es un lugar real) */
    function hill(az) {
      var a = az * R;
      return 0.9 + 0.8 * Math.sin(a * 3 + 1.3) + 0.55 * Math.sin(a * 7 + 0.4) + 0.3 * Math.sin(a * 13 + 2.1) + 0.18 * Math.sin(a * 29 + 0.7);
    }
    function hill2(az) { var a = az * R; return 0.25 + 0.35 * Math.sin(a * 5 + 2.2) + 0.2 * Math.sin(a * 17 + 1.1) + 0.12 * Math.sin(a * 41); }

    /* color de las estrellas por índice B−V */
    function starRGB(ci) {
      if (ci === null || ci === undefined) ci = 0.6;
      var t = clamp((ci + 0.3) / 2.2, 0, 1);
      var stops = [[155, 180, 255], [202, 216, 255], [248, 247, 255], [255, 244, 234], [255, 210, 161], [255, 180, 110]];
      var f = t * (stops.length - 1), i = Math.floor(f), g = f - i, a = stops[i], b = stops[Math.min(i + 1, stops.length - 1)];
      return [Math.round(a[0] + (b[0] - a[0]) * g), Math.round(a[1] + (b[1] - a[1]) * g), Math.round(a[2] + (b[2] - a[2]) * g)];
    }
    function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
    function rgb(c, al) { return 'rgba(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ',' + (al === undefined ? 1 : al) + ')'; }
    function skyColors(sunAlt) {        // cénit y horizonte según la altura del Sol
      var P = [[-90, [2, 4, 12], [9, 17, 38]], [-18, [2, 4, 12], [9, 17, 38]], [-12, [6, 12, 34], [26, 40, 82]], [-6, [16, 34, 78], [92, 88, 120]], [-2, [38, 70, 128], [214, 142, 96]], [3, [62, 118, 190], [178, 206, 236]], [90, [54, 110, 188], [170, 204, 238]]];
      for (var i = 0; i < P.length - 1; i++) if (sunAlt <= P[i + 1][0]) { var t = (sunAlt - P[i][0]) / (P[i + 1][0] - P[i][0]); return { z: mix(P[i][1], P[i + 1][1], t), h: mix(P[i][2], P[i + 1][2], t) }; }
      return { z: P[P.length - 1][1], h: P[P.length - 1][2] };
    }
    function limitMag(sunAlt) {
      var tw = sunAlt < -18 ? 6.5 : sunAlt < -12 ? 4.5 + (sunAlt + 12) / -6 * 2 : sunAlt < -6 ? 2 + (sunAlt + 6) / -6 * 2.5 : sunAlt < 0 ? -1 + (sunAlt) / -6 * 3 : -3;
      return Math.min(tw, st.sky);
    }

    /* sprites */
    function sprite(size, inner, outer) {
      var c = document.createElement('canvas'); c.width = c.height = size; var g = c.getContext('2d');
      var gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      gr.addColorStop(0, inner); gr.addColorStop(1, outer); g.fillStyle = gr; g.fillRect(0, 0, size, size); return c;
    }
    var MWS = sprite(64, 'rgba(214,220,240,0.6)', 'rgba(214,220,240,0)');
    var GLOW = sprite(64, 'rgba(255,255,255,0.9)', 'rgba(255,255,255,0)');

    /* canvas */
    var cv = document.createElement('canvas');
    cv.className = 'cn-sky-canvas'; cv.tabIndex = 0; cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', T('Cielo nocturno. Usa los controles para elegir lugar y hora.', 'Night sky. Use the controls to choose a place and time.'));
    host.replaceChildren(cv);
    var ctx = cv.getContext('2d');
    function resize() {
      var r = host.getBoundingClientRect(); DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(300, r.width); H = Math.max(300, r.height);
      cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); cv.style.width = W + 'px'; cv.style.height = H + 'px';
      draw();
    }
    function fullWidth() {   // ancho de la ventana en las unidades de <main> (Lectura puede ampliar <main> con zoom)
      var m = document.querySelector('main'), z = m ? parseFloat(getComputedStyle(m).zoom) || 1 : 1;
      var v = (document.documentElement.clientWidth / z).toFixed(2) + 'px'; if (document.documentElement.style.getPropertyValue('--cn-vw') !== v) document.documentElement.style.setProperty('--cn-vw', v);
    }

    var B = null, sunH = null, drawn = [], queued = false;
    function draw() {
      queued = false;
      if (!W) return;
      M = matrix(st.date, st.place); camera();
      B = bodies(st.date);
      var sunU = unit(B.sol.ra, B.sol.dec), sh = toH(sunU[0], sunU[1], sunU[2]); sunH = sh;
      var sunAlt = Math.asin(sh[2]) / R, lim = limitMag(sunAlt), col = skyColors(sunAlt);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      // cielo: degradado del horizonte al cénit
      var ph = proj(hAz(st.az, 0), -1) || [W / 2, H], pz = proj([0, 0, 1], -1) || [W / 2, -H];
      var g = ctx.createLinearGradient(ph[0], ph[1], pz[0], pz[1]);
      g.addColorStop(0, rgb(col.h)); g.addColorStop(0.35, rgb(mix(col.h, col.z, 0.65))); g.addColorStop(1, rgb(col.z));
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // resplandor del crepúsculo hacia el Sol
      if (sunAlt > -18 && sunAlt < 8) {
        var sp = proj(hAz(mod(Math.atan2(sh[0], sh[1]) / R, 360), 0), -0.95);
        if (sp) { var k = clamp((sunAlt + 18) / 18, 0, 1), rg = ctx.createRadialGradient(sp[0], sp[1], 0, sp[0], sp[1], S * 1.6);
          rg.addColorStop(0, 'rgba(255,170,110,' + (0.55 * k) + ')'); rg.addColorStop(1, 'rgba(255,170,110,0)'); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H); }
      }
      var night = clamp((-sunAlt - 4) / 14, 0, 1);
      drawn = [];
      // Vía Láctea
      if (night > 0.05 && st.sky >= 5) {
        var mwA = night * (st.sky >= 6.5 ? 1 : st.sky >= 5.5 ? 0.55 : 0.3), sz = S * 0.022;
        ctx.globalCompositeOperation = 'lighter';
        for (var i = 0; i < MW.length; i++) {
          var p = MW[i], h = toH(p[0], p[1], p[2]); if (h[2] < -0.02) continue;
          var q = proj(h, 0); if (!q || q[0] < -40 || q[0] > W + 40 || q[1] < -40 || q[1] > H + 40) continue;
          var ext = clamp(h[2] * 4, 0.15, 1);
          ctx.globalAlpha = (0.014 + p[3] * 0.014) * mwA * ext;
          var s2 = S * 0.045 * 2 / (1 + (F[0] * h[0] + F[1] * h[1] + F[2] * h[2]));
          ctx.drawImage(MWS, q[0] - s2, q[1] - s2, s2 * 2, s2 * 2);
        }
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      }
      // líneas de las constelaciones
      var zf = 100 / st.fov;
      if (st.lines) {
        LINES.forEach(function (L) {
          var on = st.sel === L.c;
          ctx.strokeStyle = on ? 'rgba(242,196,109,.95)' : 'rgba(150,178,226,' + (0.28 + 0.1 * night) + ')';
          ctx.lineWidth = on ? 2 : 1;
          ctx.beginPath();
          L.segs.forEach(function (seg) {
            var prev = null;
            seg.forEach(function (u) { var h = toH(u[0], u[1], u[2]), q = h[2] > -0.05 ? proj(h) : null; if (q && prev) ctx.lineTo(q[0], q[1]); else if (q) ctx.moveTo(q[0], q[1]); prev = q; });
          });
          ctx.stroke();
        });
      }
      // estrellas
      var base = Math.pow(zf, 0.35);
      for (var j = 0; j < SV.length; j++) {
        var s = SV[j]; if (s.m > lim + 0.3) continue;
        var hs = toH(s.x, s.y, s.z); if (hs[2] < -0.01) continue;
        var qs = proj(hs); if (!qs || qs[0] < -5 || qs[0] > W + 5 || qs[1] < -5 || qs[1] > H + 5) continue;
        var altS = Math.asin(hs[2]) / R, extn = altS < 20 ? 0.35 + 0.65 * altS / 20 : 1;   // la atmósfera las apaga cerca del horizonte
        var bright = clamp((lim + 1.2 - s.m) / 3.2, 0.22, 1) * extn;
        var r = Math.max(0.7, (6.9 - s.m) * 0.42) * base;
        var c = starRGB(s.ci);
        if (s.m < 3.2) { var gs = r * (5.2 - s.m); ctx.globalAlpha = (s.m < 1.5 ? 0.32 : 0.16) * bright; ctx.drawImage(GLOW, qs[0] - gs, qs[1] - gs, gs * 2, gs * 2); ctx.globalAlpha = 1; }
        ctx.fillStyle = rgb(c, bright);
        ctx.beginPath(); ctx.arc(qs[0], qs[1], r, 0, 6.2832); ctx.fill();
        if (s.d) drawn.push({ x: qs[0], y: qs[1], s: s, alt: altS, az: mod(Math.atan2(hs[0], hs[1]) / R, 360) });
      }
      // planetas y Luna
      if (st.planets) {
        var PL = [['venus', T('Venus', 'Venus'), -4.2, [255, 250, 232]], ['jupiter', T('Júpiter', 'Jupiter'), -2.4, [255, 240, 214]], ['marte', T('Marte', 'Mars'), 0.6, [255, 170, 120]],
                  ['saturno', T('Saturno', 'Saturn'), 0.7, [245, 226, 184]], ['mercurio', T('Mercurio', 'Mercury'), 0.2, [232, 224, 208]]];
        PL.forEach(function (pl) {
          var b = B[pl[0]], u = unit(b.ra, b.dec), hp = toH(u[0], u[1], u[2]); if (hp[2] < -0.01) return;
          var qp = proj(hp); if (!qp || pl[2] > lim + 1) return;
          var rp = Math.max(1.6, (6.9 - pl[2]) * 0.42) * base, gp = rp * 5;
          ctx.globalAlpha = 0.35; ctx.drawImage(GLOW, qp[0] - gp, qp[1] - gp, gp * 2, gp * 2); ctx.globalAlpha = 1;
          ctx.fillStyle = rgb(pl[3]); ctx.beginPath(); ctx.arc(qp[0], qp[1], rp, 0, 6.2832); ctx.fill();
          label(pl[1], qp[0] + rp + 5, qp[1] + 4, 'rgba(255,236,200,.95)', 13);
          drawn.push({ x: qp[0], y: qp[1], planet: pl[1], key: pl[0], alt: Math.asin(hp[2]) / R, az: mod(Math.atan2(hp[0], hp[1]) / R, 360), dist: b.r });
        });
        var mo = B.luna, mu = unit(mo.ra, mo.dec), hm = toH(mu[0], mu[1], mu[2]);
        if (hm[2] > -0.01) {
          var qm = proj(hm);
          if (qm) {
            var rm = Math.max(7, 0.26 * R * S * 2 / (1 + (F[0] * hm[0] + F[1] * hm[1] + F[2] * hm[2])));
            var gm = rm * 6; ctx.globalAlpha = 0.25 + 0.35 * mo.fase; ctx.drawImage(GLOW, qm[0] - gm, qm[1] - gm, gm * 2, gm * 2); ctx.globalAlpha = 1;
            // dirección hacia el Sol en la pantalla
            var toward = [hm[0] + (sh[0] - hm[0]) * 0.02, hm[1] + (sh[1] - hm[1]) * 0.02, hm[2] + (sh[2] - hm[2]) * 0.02];
            var qt = proj(toward, -1) || [qm[0] + 1, qm[1]], ang = Math.atan2(qt[1] - qm[1], qt[0] - qm[0]);
            ctx.save(); ctx.translate(qm[0], qm[1]); ctx.rotate(ang);
            ctx.fillStyle = 'rgba(40,44,60,.92)'; ctx.beginPath(); ctx.arc(0, 0, rm, 0, 6.2832); ctx.fill();
            ctx.fillStyle = '#f4f1e6'; ctx.beginPath();
            ctx.arc(0, 0, rm, -Math.PI / 2, Math.PI / 2, false);           // mitad iluminada, hacia el Sol
            var tx = rm * (1 - 2 * mo.fase);                               // terminador
            ctx.ellipse(0, 0, Math.abs(tx), rm, 0, Math.PI / 2, -Math.PI / 2, tx > 0);
            ctx.fill(); ctx.restore();
            label(T('Luna', 'Moon'), qm[0] + rm + 6, qm[1] + 4, 'rgba(255,248,230,.95)', 13);
            drawn.push({ x: qm[0], y: qm[1], moon: true, alt: Math.asin(hm[2]) / R, az: mod(Math.atan2(hm[0], hm[1]) / R, 360), r: rm });
          }
        }
      }
      // nombres
      if (st.names) {
        LABELS.forEach(function (l) {
          var h = toH(l.x, l.y, l.z); if (h[2] < 0.03) return; var q = proj(h, 0.2); if (!q) return;
          var on = st.sel === l.c;
          label((EN ? l.c.latin : l.c.es).toUpperCase(), q[0], q[1], on ? 'rgba(242,196,109,1)' : 'rgba(176,196,236,' + (0.55 + 0.25 * night) + ')', on ? 13 : 11, true, 0.12);
        });
        var nm = 1.6 + Math.log2(zf) * 1.2;
        drawn.forEach(function (d) { if (d.s && d.s.n && d.s.m < nm && d.s.m <= lim) label(d.s.n, d.x + 6, d.y - 5, 'rgba(236,240,250,.85)', 12); });
      }
      if (st.hit) { ctx.strokeStyle = 'rgba(242,196,109,.95)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(st.hit.x, st.hit.y, 11, 0, 6.2832); ctx.stroke(); }
      // suelo
      ground(night);
      // puntos cardinales
      var CARD = EN ? ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] : ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
      CARD.forEach(function (t, i) { var q = proj(hAz(i * 45, -2.5), 0.1); if (q && q[0] > 10 && q[0] < W - 10 && q[1] < H - 6) label(t, q[0], q[1] + 14, i % 2 ? 'rgba(210,222,240,.7)' : 'rgba(242,214,150,.95)', i % 2 ? 12 : 15, true); });
      if (sunAlt > -2) { ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.font = '600 15px "Atkinson Hyperlegible", system-ui, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(T('Es de día: el Sol no deja ver las estrellas. Cambia la hora a la noche.', 'It is daytime: the Sun hides the stars. Change the time to night.'), W / 2, H - 22); ctx.textAlign = 'left'; }
      describe();
    }
    function label(t, x, y, color, size, center, spacing) {
      ctx.font = (size || 12) + 'px "Atkinson Hyperlegible", system-ui, sans-serif';
      if ('letterSpacing' in ctx) ctx.letterSpacing = spacing ? (spacing * (size || 12)) + 'px' : '0px';
      ctx.textAlign = center ? 'center' : 'left';
      ctx.fillStyle = 'rgba(2,6,16,.55)'; ctx.fillText(t, x + 1, y + 1);
      ctx.fillStyle = color; ctx.fillText(t, x, y);
      ctx.textAlign = 'left'; if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
    }
    function ground(night) {
      var day = 1 - night, far = rgb(mix([12, 18, 32], [58, 74, 88], day)), near = rgb(mix([4, 7, 13], [34, 46, 52], day));
      // 1) el horizonte es un círculo en la proyección: el suelo queda a un lado
      var p1 = proj(hAz(st.az - 90, 0), -1), p2 = proj(hAz(st.az, 0), -1), p3 = proj(hAz(st.az + 90, 0), -1);
      if (p1 && p2 && p3) {
        var ax = p1[0], ay = p1[1], bx = p2[0], by = p2[1], cx = p3[0], cy = p3[1];
        var d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
        ctx.fillStyle = near; ctx.beginPath();
        if (Math.abs(d) < 1e-6) {                       // línea recta: el suelo es lo de abajo
          var yl = Math.min(ay, cy); ctx.rect(0, yl, W, H - yl);
        } else {
          var ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d;
          var uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d;
          var rr = Math.hypot(ax - ux, ay - uy), nad = proj([0, 0, -1], -0.999), inside = nad ? Math.hypot(nad[0] - ux, nad[1] - uy) < rr : false;
          if (rr > 2e5) { var y0 = Math.min(ay, cy); ctx.rect(0, y0, W, H - y0); }
          else if (inside) ctx.arc(ux, uy, rr, 0, 6.2832);
          else { ctx.rect(0, 0, W, H); ctx.arc(ux, uy, rr, 0, 6.2832, true); }
        }
        ctx.fill('evenodd');
      }
      // 2) colinas sobre el horizonte, a trozos pequeños para que no se deformen
      function strip(fn, fill) {
        ctx.fillStyle = fill;
        for (var a = 0; a < 360; a += 3) {
          var hs = [hAz(a, fn(a)), hAz(a + 3.2, fn(a + 3.2)), hAz(a + 3.2, -1.5), hAz(a, -1.5)], ok = true, pts = [];
          for (var i = 0; i < 4; i++) { var vz = hs[i][0] * F[0] + hs[i][1] * F[1] + hs[i][2] * F[2]; if (vz < -0.5) { ok = false; break; } pts.push(proj(hs[i], -0.5)); }
          if (!ok) continue;
          ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); ctx.lineTo(pts[1][0], pts[1][1]); ctx.lineTo(pts[2][0], pts[2][1]); ctx.lineTo(pts[3][0], pts[3][1]); ctx.closePath(); ctx.fill();
        }
      }
      strip(hill, far); strip(hill2, near);
      // resplandor bajo en el horizonte (contaminación lumínica suave)
      var q0 = proj(hAz(st.az, 0), -0.9);
      if (q0 && night > 0.3) { var gl = ctx.createLinearGradient(0, q0[1] - S * 0.25, 0, q0[1]); gl.addColorStop(0, 'rgba(90,110,150,0)'); gl.addColorStop(1, 'rgba(90,110,150,' + (st.sky < 5 ? 0.22 : 0.08) + ')'); ctx.fillStyle = gl; ctx.fillRect(0, q0[1] - S * 0.25, W, S * 0.25); }
    }
    function queue() { if (!queued) { queued = true; requestAnimationFrame(draw); } }

    /* descripción de lo que se ve (texto para todas las personas y para lectores de pantalla) */
    var DIRS = EN ? ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'] : ['norte', 'noreste', 'este', 'sureste', 'sur', 'suroeste', 'oeste', 'noroeste'];
    function dirName(az) { return DIRS[Math.round(mod(az, 360) / 45) % 8]; }
    function fmtTime(d) { return d.toLocaleString(EN ? 'en-GB' : 'es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
    var descTimer = null;
    function inView() {
      var out = [];
      LABELS.forEach(function (l) { var h = toH(l.x, l.y, l.z); if (h[2] < 0.05) return; var q = proj(h, 0.2); if (q && q[0] > 0 && q[0] < W && q[1] > 0 && q[1] < H) out.push({ c: l.c, alt: Math.asin(h[2]) / R }); });
      return out.sort(function (a, b) { return b.alt - a.alt; });
    }
    function describe() {
      clearTimeout(descTimer);
      descTimer = setTimeout(function () {
        var list = inView(), sunAlt = Math.asin(sunH[2]) / R;
        var vis = [];
        if (st.planets) ['venus', 'jupiter', 'marte', 'saturno', 'mercurio'].forEach(function (k) { var b = B[k], h = horiz(b.ra, b.dec, st.date, st.place); if (h.alt > 3) vis.push({ k: k, alt: h.alt, az: h.az }); });
        var moon = horiz(B.luna.ra, B.luna.dec, st.date, st.place);
        var names = { venus: T('Venus', 'Venus'), jupiter: T('Júpiter', 'Jupiter'), marte: T('Marte', 'Mars'), saturno: T('Saturno', 'Saturn'), mercurio: T('Mercurio', 'Mercury') };
        var head = T('Mirando al ', 'Looking ') + dirName(st.az) + T(', a ', ', ') + Math.round(st.alt) + T('° sobre el horizonte, desde ', '° above the horizon, from ') + st.place[1] + ', ' + fmtTime(st.date) + '.';
        cv.setAttribute('aria-label', T('Cielo en directo. ', 'Live sky. ') + head + ' ' + T('Constelaciones a la vista: ', 'Constellations in view: ') + (list.length ? list.map(function (x) { return EN ? x.c.latin : x.c.es; }).join(', ') : T('ninguna', 'none')) + '.');
        if (!nowBox) return;
        var phase = Math.round(B.luna.fase * 100);
        nowBox.replaceChildren(
          api.h('p', { class: 'cn-now-head', text: head }),
          api.h('p', { class: 'cn-note', text: (sunAlt > -6 ? T('El Sol está a ', 'The Sun is ') + Math.round(sunAlt) + T('° del horizonte: todavía hay luz.', '° from the horizon: there is still light.') + ' ' : '')
            + (moon.alt > 0 ? T('Luna sobre el horizonte, hacia el ', 'Moon above the horizon, towards the ') + dirName(moon.az) + ', ' + T('iluminada al ', 'lit ') + phase + ' %' + (B.luna.creciente ? T(' y creciendo.', ' and waxing.') : T(' y menguando.', ' and waning.')) : T('La Luna está bajo el horizonte.', 'The Moon is below the horizon.'))
            + (vis.length ? ' ' + T('Planetas a la vista: ', 'Planets up: ') + vis.map(function (v) { return names[v.k] + ' (' + dirName(v.az) + ', ' + Math.round(v.alt) + '°)'; }).join(', ') + '.' : '') }),
          list.length ? api.h('ul', { class: 'cn-chips' }, list.map(function (x) { return api.h('li', null, api.h('button', { class: 'filter', type: 'button', on: { click: function () { st.sel = x.c; queue(); api.openFicha(x.c); } } }, (EN ? x.c.latin : x.c.es) + ' · ' + Math.round(x.alt) + '°')); }))
            : api.h('p', { class: 'cn-note', text: T('No hay ninguna constelación a la vista en esta dirección.', 'No constellation in view in this direction.') }));
      }, 250);
    }

    /* interacción */
    var drag = null, pointers = {};
    cv.addEventListener('pointerdown', function (ev) {
      cv.setPointerCapture(ev.pointerId); pointers[ev.pointerId] = [ev.clientX, ev.clientY];
      drag = { x: ev.clientX, y: ev.clientY, az: st.az, alt: st.alt, moved: false, fov: st.fov, d0: null };
      var ids = Object.keys(pointers); if (ids.length === 2) { var a = pointers[ids[0]], b = pointers[ids[1]]; drag.d0 = Math.hypot(a[0] - b[0], a[1] - b[1]); drag.fov = st.fov; }
    });
    cv.addEventListener('pointermove', function (ev) {
      if (!drag || !pointers[ev.pointerId]) return; pointers[ev.pointerId] = [ev.clientX, ev.clientY];
      var ids = Object.keys(pointers);
      if (ids.length === 2 && drag.d0) { var a = pointers[ids[0]], b = pointers[ids[1]]; st.fov = clamp(drag.fov * drag.d0 / Math.hypot(a[0] - b[0], a[1] - b[1]), 15, 140); drag.moved = true; queue(); return; }
      var dx = ev.clientX - drag.x, dy = ev.clientY - drag.y; if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
      var k = st.fov / W;
      st.az = mod(drag.az - dx * k, 360); st.alt = clamp(drag.alt + dy * k, -10, 90); queue();
    });
    function end(ev) {
      delete pointers[ev.pointerId];
      if (drag && !drag.moved && ev.type === 'pointerup') pick(ev);
      if (!Object.keys(pointers).length) { drag = null; }
    }
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    cv.addEventListener('wheel', function (ev) { ev.preventDefault(); st.fov = clamp(st.fov * (ev.deltaY > 0 ? 1.12 : 1 / 1.12), 15, 140); queue(); }, { passive: false });
    cv.addEventListener('keydown', function (ev) {
      var step = st.fov / 12, used = true;
      if (ev.key === 'ArrowLeft') st.az = mod(st.az - step, 360); else if (ev.key === 'ArrowRight') st.az = mod(st.az + step, 360);
      else if (ev.key === 'ArrowUp') st.alt = clamp(st.alt + step, -10, 90); else if (ev.key === 'ArrowDown') st.alt = clamp(st.alt - step, -10, 90);
      else if (ev.key === '+' || ev.key === '=') st.fov = clamp(st.fov / 1.25, 15, 140); else if (ev.key === '-' || ev.key === '_') st.fov = clamp(st.fov * 1.25, 15, 140);
      else used = false;
      if (used) { ev.preventDefault(); queue(); announceView(); }
    });
    var annT = null;
    function announceView() { clearTimeout(annT); annT = setTimeout(function () { api.say(T('Mirando al ', 'Looking ') + dirName(st.az) + ', ' + Math.round(st.alt) + '°.'); }, 700); }
    var card = null;
    function pick(ev) {
      var r = cv.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top, best = null, bd = 18 * 18;
      drawn.forEach(function (d) { var dd = (d.x - x) * (d.x - x) + (d.y - y) * (d.y - y); var lim = d.moon ? Math.max(bd, d.r * d.r * 1.4) : bd; if (dd < lim && (!best || dd < best.dd)) best = { d: d, dd: dd }; });
      var h = unproj(x, y), e = fromH(h[0], h[1], h[2]), ra = mod(Math.atan2(e[1], e[0]) / R / 15, 24), dec = Math.asin(clamp(e[2], -1, 1)) / R;
      var c = h[2] > 0 ? api.conAt(ra, dec) : null;
      st.hit = best ? { x: best.d.x, y: best.d.y } : null; if (c) st.sel = c; queue();
      showCard(best ? best.d : null, c, h[2] <= 0);
    }
    function showCard(d, c, isGround) {
      var lines = [];
      if (d && d.s) lines.push(api.h('p', { class: 'cn-pop-t', text: d.s.n ? d.s.n + ' · ' + d.s.d : d.s.d }),
        api.h('p', { text: T('Magnitud ', 'Magnitude ') + api.mag(d.s.m) + ' · ' + (d.s.ly ? api.thousands(d.s.ly) + T(' años luz', ' light years') : T('distancia sin dato', 'distance unknown')) }),
        api.h('p', { text: api.sp(d.s.sp) }),
        api.h('p', { text: T('Altura ', 'Altitude ') + Math.round(d.alt) + '° · ' + T('hacia el ', 'towards the ') + dirName(d.az) }));
      else if (d && d.planet) lines.push(api.h('p', { class: 'cn-pop-t', text: d.planet }),
        api.h('p', { text: T('Planeta. Está a ', 'Planet. It is ') + (EN ? d.dist.toFixed(2) : d.dist.toFixed(2).replace('.', ',')) + T(' unidades astronómicas de la Tierra (1 UA = distancia de la Tierra al Sol).', ' astronomical units from Earth (1 AU = distance from Earth to the Sun).') }),
        api.h('p', { text: T('Altura ', 'Altitude ') + Math.round(d.alt) + '° · ' + T('hacia el ', 'towards the ') + dirName(d.az) }));
      else if (d && d.moon) lines.push(api.h('p', { class: 'cn-pop-t', text: T('La Luna', 'The Moon') }),
        api.h('p', { text: T('Iluminada al ', 'Lit ') + Math.round(B.luna.fase * 100) + ' %' + (B.luna.creciente ? T(', creciente', ', waxing') : T(', menguante', ', waning')) + '.' }),
        api.h('p', { text: T('Altura ', 'Altitude ') + Math.round(d.alt) + '° · ' + T('hacia el ', 'towards the ') + dirName(d.az) }));
      else if (isGround) lines.push(api.h('p', { text: T('Eso es el suelo. Arrastra hacia abajo o usa las flechas para mirar más arriba.', 'That is the ground. Drag down or use the arrow keys to look higher.') }));
      if (c) lines.push(api.h('p', { class: 'cn-pop-c', text: T('Constelación: ', 'Constellation: ') + (EN ? c.latin : c.es) }),
        api.h('button', { class: 'filter', type: 'button', on: { click: function () { api.openFicha(c); } } }, T('Ver su ficha completa', 'See its full entry')));
      if (!lines.length) return;
      if (!card) { card = api.h('div', { class: 'cn-pop', role: 'group', 'aria-label': T('Lo que has pulsado', 'What you pressed') }); stage.appendChild(card); }
      card.replaceChildren.apply(card, [api.h('button', { class: 'cn-pop-x', type: 'button', 'aria-label': T('Cerrar', 'Close'), on: { click: function () { card.remove(); card = null; st.hit = null; queue(); cv.focus(); } } }, '×')].concat(lines));
      api.say(lines.map(function (n) { return n.textContent; }).join(' '));
    }

    /* controles */
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function dateVal(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
    function timeVal(d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
    var placeSel = api.h('select', { id: 'cn-v-place', on: { change: function (ev) { st.place = PLACES.filter(function (p) { return p[0] === ev.target.value; })[0]; queue(); api.say(T('Cielo desde ', 'Sky from ') + st.place[1] + '.'); } } },
      PLACES.map(function (p) { return api.h('option', { value: p[0], text: p[1] }); }));
    var dateIn = api.h('input', { type: 'date', id: 'cn-v-date', value: dateVal(st.date), on: { change: function (ev) { var v = ev.target.value.split('-'); if (v.length !== 3) return; st.date.setFullYear(+v[0], +v[1] - 1, +v[2]); queue(); } } });
    var timeIn = api.h('input', { type: 'time', id: 'cn-v-time', value: timeVal(st.date), on: { change: function (ev) { var v = ev.target.value.split(':'); if (v.length < 2) return; st.date.setHours(+v[0], +v[1], 0, 0); queue(); } } });
    function shift(mins, say) { st.date = new Date(st.date.getTime() + mins * 60000); dateIn.value = dateVal(st.date); timeIn.value = timeVal(st.date); queue(); if (say !== false) api.say(fmtTime(st.date) + '.'); }
    var playing = null, playBtn;
    function play() {
      if (playing) { clearInterval(playing); playing = null; playBtn.textContent = T('Ver pasar la noche', 'Watch the night go by'); playBtn.setAttribute('aria-pressed', 'false'); api.say(T('Parado.', 'Stopped.')); return; }
      playBtn.textContent = T('Parar', 'Stop'); playBtn.setAttribute('aria-pressed', 'true'); api.say(T('El tiempo avanza. Pulsa Parar cuando quieras.', 'Time is moving on. Press Stop whenever you like.'));
      playing = setInterval(function () { shift(reduce ? 30 : 2, false); }, reduce ? 1000 : 50);
    }
    playBtn = api.h('button', { class: 'filter', type: 'button', 'aria-pressed': 'false', on: { click: play } }, T('Ver pasar la noche', 'Watch the night go by'));
    function look(az, name) { st.az = az; st.alt = 28; st.fov = Math.max(st.fov, 90); queue(); api.say(T('Mirando al ', 'Looking ') + name + '.'); }
    function tgl(key, text) { return api.h('button', { class: 'filter', type: 'button', 'aria-pressed': st[key] ? 'true' : 'false', on: { click: function (ev) { st[key] = !st[key]; ev.currentTarget.setAttribute('aria-pressed', st[key] ? 'true' : 'false'); queue(); } } }, text); }
    var skySel = api.h('select', { id: 'cn-v-sky', on: { change: function (ev) { st.sky = +ev.target.value; queue(); } } },
      [[6.5, T('Montaña, sin luces (se ven hasta 6,5)', 'Mountains, no lights (down to 6.5)')], [5.5, T('Campo (hasta 5,5)', 'Countryside (to 5.5)')], [4.5, T('Pueblo (hasta 4,5)', 'Village (to 4.5)')], [3, T('Ciudad (hasta 3)', 'City (to 3)')]]
        .map(function (o) { return api.h('option', { value: o[0], text: o[1] }); }));
    var fs = api.h('button', { class: 'filter', type: 'button', on: { click: function () {
      if (document.fullscreenElement) document.exitFullscreen(); else if (stage.requestFullscreen) stage.requestFullscreen().catch(function () {});
    } } }, T('Pantalla completa', 'Full screen'));
    document.addEventListener('fullscreenchange', function () { fs.textContent = document.fullscreenElement ? T('Salir de pantalla completa', 'Exit full screen') : T('Pantalla completa', 'Full screen'); setTimeout(resize, 60); });
    var DN = EN ? [['N', 'North', 0], ['E', 'East', 90], ['S', 'South', 180], ['W', 'West', 270]] : [['N', 'norte', 0], ['E', 'este', 90], ['S', 'sur', 180], ['O', 'oeste', 270]];
    ui.replaceChildren(
      api.h('div', { class: 'cn-ui-row' },
        api.h('label', { class: 'cn-ui-field', for: 'cn-v-place' }, api.h('span', { text: T('Desde', 'From') }), placeSel),
        api.h('label', { class: 'cn-ui-field', for: 'cn-v-date' }, api.h('span', { text: T('Día', 'Date') }), dateIn),
        api.h('label', { class: 'cn-ui-field', for: 'cn-v-time' }, api.h('span', { text: T('Hora', 'Time') }), timeIn),
        api.h('div', { class: 'filters', role: 'group', 'aria-label': T('Cambiar la hora', 'Change the time') },
          api.h('button', { class: 'filter', type: 'button', on: { click: function () { shift(-60); } } }, T('−1 h', '−1 h')),
          api.h('button', { class: 'filter', type: 'button', on: { click: function () { shift(60); } } }, T('+1 h', '+1 h')),
          api.h('button', { class: 'filter', type: 'button', on: { click: function () { st.date = new Date(); shift(0); } } }, T('Ahora', 'Now')),
          playBtn)),
      api.h('div', { class: 'cn-ui-row' },
        api.h('div', { class: 'filters', role: 'group', 'aria-label': T('Mirar hacia', 'Look towards') }, DN.map(function (d) { return api.h('button', { class: 'filter', type: 'button', 'aria-label': T('Mirar al ', 'Look ') + d[1], on: { click: function () { look(d[2], d[1]); } } }, d[0]); }),
          api.h('button', { class: 'filter', type: 'button', on: { click: function () { st.alt = 90; st.fov = 140; queue(); api.say(T('Mirando hacia arriba: todo el cielo.', 'Looking straight up: the whole sky.')); } } }, T('Arriba', 'Up'))),
        api.h('div', { class: 'filters', role: 'group', 'aria-label': T('Aumento', 'Zoom') },
          api.h('button', { class: 'filter', type: 'button', 'aria-label': T('Acercar', 'Zoom in'), on: { click: function () { st.fov = clamp(st.fov / 1.35, 15, 140); queue(); } } }, '+'),
          api.h('button', { class: 'filter', type: 'button', 'aria-label': T('Alejar', 'Zoom out'), on: { click: function () { st.fov = clamp(st.fov * 1.35, 15, 140); queue(); } } }, '−')),
        api.h('div', { class: 'filters', role: 'group', 'aria-label': T('Qué se dibuja', 'What is drawn') }, tgl('lines', T('Figuras', 'Figures')), tgl('names', T('Nombres', 'Names')), tgl('planets', T('Luna y planetas', 'Moon and planets'))),
        api.h('label', { class: 'cn-ui-field', for: 'cn-v-sky' }, api.h('span', { text: T('Cielo', 'Sky') }), skySel),
        fs));
    cv.addEventListener('focus', function () { api.say(T('Cielo en directo. Flechas para mirar alrededor, + y − para acercar o alejar. Arrastra con el ratón o con el dedo.', 'Live sky. Arrow keys to look around, + and − to zoom. Drag with the mouse or your finger.')); });

    /* abrir una constelación desde las fichas */
    api.showInSky = function (c) {
      var hc = horiz(c.label[0], c.label[1], st.date, st.place);
      st.sel = c; st.az = hc.az; st.alt = clamp(hc.alt, 5, 80); st.fov = 70; queue();
      stage.scrollIntoView({ block: 'start' }); cv.focus({ preventScroll: true });
      var msg;
      if (hc.alt > 0) msg = (EN ? c.latin : c.es) + T(' está a ', ' is ') + Math.round(hc.alt) + T('° sobre el horizonte, hacia el ', '° above the horizon, towards the ') + dirName(hc.az) + '.';
      else {
        var rise = null;
        for (var m = 10; m <= 1440; m += 10) { var dt = new Date(st.date.getTime() + m * 60000); if (horiz(c.label[0], c.label[1], dt, st.place).alt > 5) { rise = dt; break; } }
        msg = (EN ? c.latin : c.es) + T(' está bajo el horizonte a esta hora.', ' is below the horizon at this time.') + (rise ? ' ' + T('Empieza a verse hacia las ', 'It starts to be visible at about ') + rise.toLocaleTimeString(EN ? 'en-GB' : 'es-ES', { hour: '2-digit', minute: '2-digit' }) + T(' (usa +1 h o cambia la hora).', ' (use +1 h or change the time).') : ' ' + T('Desde aquí no llega a verse.', 'It never rises from here.'));
      }
      api.say(msg);
      if (nowBox) { var note = api.h('p', { class: 'cn-now-head', text: msg }); setTimeout(function () { nowBox.insertBefore(note, nowBox.firstChild); }, 400); }
    };

    fullWidth();
    window.addEventListener('resize', fullWidth);
    new MutationObserver(function () { fullWidth(); resize(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'data-ig-preferences', 'data-ig-text-enlarged'] });
    if (window.ResizeObserver) new ResizeObserver(function () { resize(); }).observe(host); else window.addEventListener('resize', resize);
    resize();
  } };
})();
