/* Iris Green · Tus intereses · Eclipses.
   Simulador del eclipse desde cualquier lugar, calculado en el navegador con astronomy-engine 2.1.19 (Don Cross, MIT), autoalojado.
   Estrellas de fondo: HYG v4.1 (CC BY-SA 4.0), las mismas que Cielo nocturno. Sin red externa y sin evaluar código.
   Nada se mueve solo: el tiempo solo avanza si la persona lo pide. Mi colección se guarda solo en este navegador (localStorage). */
(function () {
  'use strict';
  var main = document.querySelector('main.ec'); if (!main) return;
  var EN = main.getAttribute('data-lang') === 'en';
  var T = function (es, en) { return EN ? en : es; };
  var LOC = EN ? 'en-GB' : 'es-ES';
  var KEY = 'ig-eclipses-coleccion', MARCA = 'IRIS GREEN · irisgreen.eu';
  var A = window.Astronomy;
  var D = null, STARS = [];
  var reduce = function () { return (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || document.documentElement.getAttribute('data-ig-motion') === 'off'; };
  var KIND = { total: T('total', 'total'), annular: T('anular', 'annular'), partial: T('parcial', 'partial'), anular: T('anular', 'annular'), parcial: T('parcial', 'partial'), hibrido: T('híbrido', 'hybrid'), penumbral: T('penumbral', 'penumbral') };
  var CITY_EN = { 'Sevilla': 'Seville', 'Observatorio del Teide': 'Teide Observatory' };

  /* ---------- utilidades ---------- */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k]; if (v === null || v === undefined || v === false) return;
      if (k === 'on') Object.keys(v).forEach(function (ev) { el.addEventListener(ev, v[ev]); });
      else if (k === 'text') el.textContent = v;
      else el.setAttribute(k, v === true ? '' : String(v));
    });
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i]; if (c === null || c === undefined || c === false) continue;
      (Array.isArray(c) ? c : [c]).forEach(function (x) { if (x !== null && x !== undefined && x !== false) el.appendChild(typeof x === 'string' ? document.createTextNode(x) : x); });
    }
    return el;
  }
  function num(x, d) { var s = x.toFixed(d || 0).replace('-', '−'); return EN ? s : s.replace('.', ','); }
  function pct(o) { var v = o * 100; return (v >= 99.95 && v < 100 ? num(99.9, 1) : v >= 10 ? num(v, 0) : num(v, 1)) + ' %'; }
  function say(msg) { var s = document.getElementById('cn-status'); if (!s) return; s.textContent = ''; setTimeout(function () { s.textContent = msg; }, 30); }
  function download(name, blob) { var a = h('a', { href: URL.createObjectURL(blob), download: name }); document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
  function cname(n) { return EN ? (CITY_EN[n] || n) : n; }
  function fmtTime(d, tz, secs) { return new Intl.DateTimeFormat(LOC, { timeZone: tz, hour: '2-digit', minute: '2-digit', second: secs ? '2-digit' : undefined, hour12: false }).format(d); }
  function fmtDate(d, tz) { return new Intl.DateTimeFormat(LOC, { timeZone: tz, day: 'numeric', month: 'long', year: 'numeric' }).format(d); }
  function dur(s) { s = Math.round(s); var m = Math.floor(s / 60), r = s % 60; return m ? m + ' min ' + (r < 10 ? '0' : '') + r + ' s' : r + ' s'; }
  function compass(az) { var n = EN ? ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] : ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO']; return n[Math.round(((az % 360) + 360) % 360 / 45) % 8]; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function mix(c1, c2, t) { return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)]; }
  function rgb(c, a) { return 'rgba(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ',' + (a === undefined ? 1 : a) + ')'; }
  function tzFor(lat, lon) {
    if (lat < 30 && lat > 27 && lon < -12.5 && lon > -18.5) return 'Atlantic/Canary';
    if (lat > 35 && lat < 44.2 && lon > -9.5 && lon < 4.6) return 'Europe/Madrid';
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch (e) { return 'UTC'; }
  }

  /* ---------- astronomía ---------- */
  var DEG = Math.PI / 180;
  function vec(alt, az) { var ca = Math.cos(alt * DEG); return [ca * Math.sin(az * DEG), ca * Math.cos(az * DEG), Math.sin(alt * DEG)]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function overlap(R, r, d) {           // área tapada del disco solar (fracción)
    if (d >= R + r) return 0;
    if (d <= Math.abs(R - r)) return r >= R ? 1 : (r * r) / (R * R);
    var a = r * r * Math.acos((d * d + r * r - R * R) / (2 * d * r)) + R * R * Math.acos((d * d + R * R - r * r) / (2 * d * R)) - 0.5 * Math.sqrt((-d + r + R) * (d + r - R) * (d - r + R) * (d + r + R));
    return a / (Math.PI * R * R);
  }
  function sky(date, obs) {
    var eS = A.Equator(A.Body.Sun, date, obs, true, true), eM = A.Equator(A.Body.Moon, date, obs, true, true);
    var hS = A.Horizon(date, obs, eS.ra, eS.dec, 'normal'), hM = A.Horizon(date, obs, eM.ra, eM.dec, 'normal');
    var gS = A.Horizon(date, obs, eS.ra, eS.dec), gM = A.Horizon(date, obs, eM.ra, eM.dec);
    var vS = vec(gS.altitude, gS.azimuth), vM = vec(gM.altitude, gM.azimuth);
    var e = [Math.cos(gS.azimuth * DEG), -Math.sin(gS.azimuth * DEG), 0];          // hacia la derecha (este → oeste para quien mira al sur)
    var u = [-Math.sin(gS.altitude * DEG) * Math.sin(gS.azimuth * DEG), -Math.sin(gS.altitude * DEG) * Math.cos(gS.azimuth * DEG), Math.cos(gS.altitude * DEG)];
    var dx = dot(vM, e) / DEG, dy = dot(vM, u) / DEG;
    var R = 959.63 / 3600 / eS.dist, r = Math.asin(1737.4 / (eM.dist * 149597870.7)) / DEG, d = Math.hypot(dx, dy);
    return { alt: hS.altitude, az: hS.azimuth, mAlt: hM.altitude, mAz: hM.azimuth, dx: dx, dy: dy, R: R, r: r, d: d, o: overlap(R, r, d), total: d <= r - R, ring: d <= R - r };
  }
  function eclipsesAt(lat, lon, from, to) {
    var obs = new A.Observer(lat, lon, 0), out = [], e = A.SearchLocalSolarEclipse(from, obs);
    while (e.peak.time.date < to) {
      if (Math.max(e.partial_begin.altitude, e.peak.altitude, e.partial_end.altitude) > 0) out.push(e);
      e = A.NextLocalSolarEclipse(e.peak.time, obs);
    }
    return out;
  }
  var PLANETS = [['Venus', 'Venus', 'Venus'], ['Jupiter', 'Júpiter', 'Jupiter'], ['Mercury', 'Mercurio', 'Mercury'], ['Mars', 'Marte', 'Mars'], ['Saturn', 'Saturno', 'Saturn']];
  function mlim(bright) {                // magnitud límite según la luz del cielo (log10 de la fracción de luz del día)
    var P = [[-9, 5.5], [-6.5, 3.2], [-5, 1.6], [-3.6, -3.6], [-3, -9]];
    if (bright <= P[0][0]) return P[0][1];
    for (var i = 1; i < P.length; i++) if (bright <= P[i][0]) return lerp(P[i - 1][1], P[i][1], (bright - P[i - 1][0]) / (P[i][0] - P[i - 1][0]));
    return -9;
  }

  /* ---------- estado ---------- */
  var st = { place: null, list: [], ecl: null, t: 0, frame: null, play: null, lastPhase: '' };
  var view = document.getElementById('ec-view'), ui = document.getElementById('ec-ui'), stage = document.getElementById('simulador');
  var cv, ctx, inset, ictx, corona = null;

  function fullWidth() { var z = parseFloat(getComputedStyle(main).zoom) || 1, v = (document.documentElement.clientWidth / z).toFixed(2) + 'px';
    if (document.documentElement.style.getPropertyValue('--cn-vw') !== v) document.documentElement.style.setProperty('--cn-vw', v); }
  fullWidth(); window.addEventListener('resize', function () { fullWidth(); draw(); });
  new MutationObserver(function () { fullWidth(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-ig-preferences', 'data-ig-text-enlarged'] });

  function setPlace(p, keepDate) {
    st.place = p;
    var from = new Date(Date.UTC(2024, 0, 1)), to = new Date(Date.UTC(2041, 0, 1));
    st.list = eclipsesAt(p.lat, p.lon, from, to);
    var want = keepDate || '2027-08-02', pick = null;
    st.list.forEach(function (e) { if (e.peak.time.date.toISOString().slice(0, 10) === want) pick = e; });
    if (!pick) { var now = Date.now(); pick = st.list.filter(function (e) { return e.peak.time.date.getTime() > now; })[0] || st.list[st.list.length - 1]; }
    fillEclipseSelect(pick);
    setEclipse(pick);
  }
  function setEclipse(e) {
    st.ecl = e; stop();
    var obs = new A.Observer(st.place.lat, st.place.lon, 0);
    st.obs = obs;
    st.t0 = e.partial_begin.time.date.getTime() - 12 * 60000; st.t1 = e.partial_end.time.date.getTime() + 12 * 60000;
    st.t = e.peak.time.date.getTime();
    // encuadre fijo durante todo el eclipse
    var a0 = sky(new Date(st.t0), obs), am = sky(new Date(st.t), obs), a1 = sky(new Date(st.t1), obs);
    var span = Math.abs(((a1.az - a0.az + 540) % 360) - 180);
    st.frame = { az: am.az, span: span, top: Math.max(28, Math.max(a0.alt, am.alt, a1.alt) + 14) };
    slider.min = String(st.t0); slider.max = String(st.t1); slider.value = String(st.t);
    renderInfo(); draw(); updateTime(true);
  }

  /* ---------- dibujo ---------- */
  function sizeCanvas(c, w, hgt) { var pr = Math.min(window.devicePixelRatio || 1, 2) * (parseFloat(getComputedStyle(main).zoom) || 1); if (c.width !== Math.round(w * pr) || c.height !== Math.round(hgt * pr)) { c.width = Math.round(w * pr); c.height = Math.round(hgt * pr); } return pr; }
  function hills(az) { return 1.1 + 0.9 * Math.sin(az * 0.07 + 1.3) + 0.6 * Math.sin(az * 0.23 + 0.4) + 0.35 * Math.sin(az * 0.61 + 2.1) + 0.18 * Math.sin(az * 1.7); }
  function state(t) {
    var s = sky(new Date(t), st.obs);
    var day = clamp((s.alt + 8) / 14, 0, 1); day = day * day * (3 - 2 * day);
    var L = s.total ? 1.5e-6 : Math.max(1 - s.o, 1e-5);
    var bright = Math.log10(Math.max(day * L, 1e-9) + (s.alt > -18 ? Math.pow(10, -9 + (s.alt + 18) / 18 * 3) * (1 - day) : 1e-9));
    return { s: s, day: day, L: L, bright: bright };
  }
  function skyColors(k, s) {
    var b = clamp((k.bright + 7) / 7, 0, 1);            // 0 noche · 1 pleno día
    var dayTop = [44, 110, 196], dayLow = [168, 206, 236], nightTop = [4, 9, 22], nightLow = [12, 22, 48];
    var top = mix(nightTop, dayTop, Math.pow(b, 1.4)), low = mix(nightLow, dayLow, Math.pow(b, 1.2));
    var dusk = (!s.total && s.alt < 12 && s.alt > -8) ? clamp(1 - Math.abs(s.alt - 1) / 11, 0, 1) : 0;
    if (dusk) { low = mix(low, [250, 172, 98], dusk * 0.9); top = mix(top, [70, 96, 150], dusk * 0.35 * b); }
    var glow = s.total ? 0.9 : (k.L < 0.02 ? (0.02 - k.L) / 0.02 * 0.5 : 0);
    var hor = mix(low, [226, 128, 64], glow);
    if (glow) low = mix(low, [18, 26, 52], glow * 0.6);
    return { top: top, low: low, hor: hor, b: b, glow: glow };
  }
  function draw() {
    if (!cv || !st.ecl) return;
    var box = view.getBoundingClientRect(), W = Math.max(box.width, 200), H = Math.max(box.height, 200), pr = sizeCanvas(cv, W, H);
    var g = ctx; g.setTransform(pr, 0, 0, pr, 0, 0);
    var k = state(st.t), s = k.s, col = skyColors(k, s), f = st.frame;
    var kpx = Math.min(H / (f.top + 7), W / Math.max(f.span + 30, 60)), extent = W / kpx, wide = W > 900;
    var az0 = f.az - (wide ? 0.1 * extent : 0);
    var yH = H - 7 * kpx;
    function X(az) { var d = ((az - az0 + 540) % 360) - 180; return W / 2 + d * kpx; }
    function Y(alt) { return yH - alt * kpx; }
    var grad = g.createLinearGradient(0, 0, 0, yH);
    grad.addColorStop(0, rgb(col.top)); grad.addColorStop(0.72, rgb(col.low)); grad.addColorStop(1, rgb(col.hor));
    g.fillStyle = grad; g.fillRect(0, 0, W, yH + 2);
    // estrellas y planetas cuando el cielo se oscurece
    var lim = mlim(k.bright);
    if (lim > -4.5) {
      var date = new Date(st.t);
      if (lim > -1.6) STARS.forEach(function (x) {
        if (x[2] > lim) return;
        var hz = A.Horizon(date, st.obs, x[0], x[1], 'normal'); if (hz.altitude < 0) return;
        var px = X(hz.azimuth), py = Y(hz.altitude); if (px < -5 || px > W + 5 || py < -5) return;
        var a = clamp((lim - x[2]) / 1.5, 0, 1);
        g.fillStyle = 'rgba(235,240,255,' + a.toFixed(2) + ')'; g.beginPath(); g.arc(px, py, clamp(2.4 - x[2] * 0.45, 0.6, 3), 0, 7); g.fill();
      });
      g.font = '600 12.5px system-ui, sans-serif'; g.textAlign = 'left';
      PLANETS.forEach(function (p) {
        var eq = A.Equator(A.Body[p[0]], date, st.obs, true, true), hz = A.Horizon(date, st.obs, eq.ra, eq.dec, 'normal');
        var mag = A.Illumination(A.Body[p[0]], date).mag; if (mag > lim || hz.altitude < 0) return;
        var px = X(hz.azimuth), py = Y(hz.altitude); if (px < 0 || px > W || py < 0) return;
        var a = clamp((lim - mag) / 1.2, 0, 1);
        g.fillStyle = 'rgba(255,248,225,' + a.toFixed(2) + ')'; g.beginPath(); g.arc(px, py, clamp(3.2 - mag * 0.35, 1.5, 4.6), 0, 7); g.fill();
        g.fillStyle = 'rgba(232,238,252,' + (a * 0.95).toFixed(2) + ')'; g.fillText(EN ? p[2] : p[1], px + 7, py - 5);
      });
    }
    // camino del Sol durante el eclipse
    g.strokeStyle = col.b > 0.5 ? 'rgba(255,255,255,.55)' : 'rgba(242,196,109,.55)'; g.setLineDash([3, 6]); g.lineWidth = 1.4; g.beginPath();
    for (var tt = st.t0, first = true; tt <= st.t1; tt += (st.t1 - st.t0) / 60) { var q = sky(new Date(tt), st.obs); var px = X(q.az), py = Y(q.alt); if (first) g.moveTo(px, py); else g.lineTo(px, py); first = false; }
    g.stroke(); g.setLineDash([]);
    // Sol (y Luna encima) en el cielo, con su brillo
    var sx = X(s.az), sy = Y(s.alt), rr = Math.max(s.R * kpx, 3.2);
    if (s.alt > -1) {
      var halo = s.total ? 0 : clamp(k.L, 0, 1);
      if (halo > 0.002) { var gl = g.createRadialGradient(sx, sy, 0, sx, sy, rr * (6 + 30 * Math.sqrt(halo))); var hc = s.alt < 10 ? '255,214,160' : '255,250,235'; gl.addColorStop(0, 'rgba(' + hc + ',' + (0.9 * Math.sqrt(halo)).toFixed(2) + ')'); gl.addColorStop(1, 'rgba(' + hc + ',0)'); g.fillStyle = gl; g.fillRect(sx - 400, sy - 400, 800, 800); }
      if (s.total) { var cg = g.createRadialGradient(sx, sy, rr, sx, sy, rr * 5); cg.addColorStop(0, 'rgba(235,240,255,.85)'); cg.addColorStop(1, 'rgba(235,240,255,0)'); g.fillStyle = cg; g.beginPath(); g.arc(sx, sy, rr * 5, 0, 7); g.fill(); }
      g.fillStyle = s.total ? '#0a0d14' : '#fffaf0'; g.beginPath(); g.arc(sx, sy, rr, 0, 7); g.fill();
      if (!s.total && s.o > 0) { g.fillStyle = rgb(mix(col.top, col.low, 0.3)); g.beginPath(); g.arc(sx + s.dx / s.R * rr, sy - s.dy / s.R * rr, s.r / s.R * rr, 0, 7); g.fill(); }
    }
    // horizonte con colinas
    var light = 0.08 + 0.55 * col.b, land = mix([6, 10, 16], [58, 74, 60], light);
    g.fillStyle = rgb(land); g.beginPath(); g.moveTo(0, H);
    for (var x = 0; x <= W; x += 6) { var az = az0 + (x - W / 2) / kpx; g.lineTo(x, yH - hills(az) * kpx * 0.9); }
    g.lineTo(W, H); g.closePath(); g.fill();
    g.fillStyle = 'rgba(232,238,252,' + (col.b > 0.5 ? 0.9 : 0.75) + ')'; g.font = '600 13px system-ui, sans-serif'; g.textAlign = 'center';
    [0, 45, 90, 135, 180, 225, 270, 315].forEach(function (a) { var px = X(a); if (px > 20 && px < W - 20) g.fillText(compass(a), px, H - 6 * kpx > yH + 18 ? yH + 20 : H - 8); });
    drawInset(k, col);
  }
  function makeCorona(R) {
    var n = Math.round(R * 7.4), c = document.createElement('canvas'); c.width = c.height = n; var g = c.getContext('2d'), m = n / 2;
    var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var base = g.createRadialGradient(m, m, R * 0.98, m, m, R * 2.4); base.addColorStop(0, 'rgba(255,255,255,.95)'); base.addColorStop(0.08, 'rgba(240,244,255,.55)'); base.addColorStop(0.35, 'rgba(210,220,245,.16)'); base.addColorStop(1, 'rgba(200,210,240,0)');
    g.fillStyle = base; g.fillRect(0, 0, n, n);
    g.globalCompositeOperation = 'lighter';
    for (var i = 0; i < 260; i++) {
      var ang = rnd() * Math.PI * 2, eq = Math.abs(Math.cos(ang - 0.35)), len = R * Math.min(1.4, 0.3 + rnd() * (0.5 + 1.2 * Math.pow(eq, 3))), w = R * (0.02 + rnd() * 0.07);
      var x0 = m + Math.cos(ang) * R, y0 = m + Math.sin(ang) * R, x1 = m + Math.cos(ang + (rnd() - 0.5) * 0.08) * (R + len), y1 = m + Math.sin(ang + (rnd() - 0.5) * 0.08) * (R + len);
      var lg = g.createLinearGradient(x0, y0, x1, y1); lg.addColorStop(0, 'rgba(235,240,255,' + (0.05 + rnd() * 0.09).toFixed(3) + ')'); lg.addColorStop(1, 'rgba(235,240,255,0)');
      g.strokeStyle = lg; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo((x0 + x1) / 2 + (rnd() - 0.5) * R * 0.1, (y0 + y1) / 2 + (rnd() - 0.5) * R * 0.1, x1, y1); g.stroke();
    }
    // protuberancias: pequeñas lenguas rosas en el borde
    g.globalCompositeOperation = 'source-over';
    for (var j = 0; j < 7; j++) {
      var a = rnd() * Math.PI * 2, px = m + Math.cos(a) * R * 1.01, py = m + Math.sin(a) * R * 1.01, s = R * (0.025 + rnd() * 0.04);
      var pg = g.createRadialGradient(px, py, 0, px, py, s * 1.6); pg.addColorStop(0, 'rgba(255,90,130,.95)'); pg.addColorStop(1, 'rgba(255,90,130,0)'); g.fillStyle = pg; g.beginPath(); g.ellipse(px, py, s * 1.6, s * 0.9, a, 0, 7); g.fill();
    }
    return c;
  }
  function drawInset(k, col) {
    var box = inset.getBoundingClientRect(), S = Math.max(box.width, 100), pr = sizeCanvas(inset, S, S), g = ictx, s = k.s;
    g.setTransform(pr, 0, 0, pr, 0, 0);
    var m = S / 2, R = S * 0.2, scale = R / s.R, filtered = !s.total;
    g.save(); g.beginPath(); g.arc(m, m, m, 0, 7); g.clip();
    if (s.alt < -0.6) { g.fillStyle = '#06101f'; g.fillRect(0, 0, S, S); g.fillStyle = '#cfdcf5'; g.font = '600 14px system-ui, sans-serif'; g.textAlign = 'center'; g.fillText(T('El Sol está bajo el horizonte', 'The Sun is below the horizon'), m, m); g.restore(); insetCap.textContent = T('Imagen hecha por ordenador.', 'Computer-made image.'); return; }
    var mx = m + s.dx * scale, my = m - s.dy * scale, r = s.r * scale;
    if (filtered) {
      g.fillStyle = '#000'; g.fillRect(0, 0, S, S);
      var sg = g.createRadialGradient(m, m, 0, m, m, R); sg.addColorStop(0, '#ffb347'); sg.addColorStop(0.75, '#f59a2c'); sg.addColorStop(1, '#c9661a');
      g.fillStyle = sg; g.beginPath(); g.arc(m, m, R, 0, 7); g.fill();
      g.fillStyle = '#000'; g.beginPath(); g.arc(mx, my, r, 0, 7); g.fill();
      var bead = 1 - s.o;
      if (s.r > s.R && bead < 0.004 && s.d < s.r + s.R) {      // anillo de diamante: se ve sin filtro un instante antes y después
        g.fillStyle = '#060a14'; g.fillRect(0, 0, S, S);
        if (!corona || corona.R !== R) { corona = makeCorona(R); corona.R = R; }
        g.globalAlpha = clamp(1 - bead / 0.004, 0.15, 1); g.drawImage(corona, m - corona.width / 2, m - corona.height / 2); g.globalAlpha = 1;
        g.fillStyle = '#000'; g.beginPath(); g.arc(mx, my, r, 0, 7); g.fill();
        var ang = Math.atan2(m - my, m - mx), bx = m + Math.cos(ang) * R, by = m + Math.sin(ang) * R, bs = R * (0.4 + 90 * bead);
        var dg = g.createRadialGradient(bx, by, 0, bx, by, bs); dg.addColorStop(0, 'rgba(255,255,255,1)'); dg.addColorStop(0.2, 'rgba(255,252,240,.8)'); dg.addColorStop(1, 'rgba(255,252,240,0)');
        g.fillStyle = dg; g.beginPath(); g.arc(bx, by, bs, 0, 7); g.fill();
        g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(bx - bs * 1.4, by); g.lineTo(bx + bs * 1.4, by); g.moveTo(bx, by - bs * 1.4); g.lineTo(bx, by + bs * 1.4); g.stroke();
        insetCap.textContent = T('Anillo de diamante: dura unos segundos. Con gafas hasta el momento de la totalidad. Imagen hecha por ordenador.', 'Diamond ring: it lasts a few seconds. Keep the glasses on until totality. Computer-made image.');
      } else insetCap.textContent = s.ring ? T('Anillo de fuego, visto con filtro solar. En un eclipse anular las gafas no se quitan nunca. Imagen hecha por ordenador.', 'Ring of fire, seen through a solar filter. In an annular eclipse the glasses never come off. Computer-made image.')
        : s.o > 0 ? T('Visto con gafas de eclipse o filtro solar. Imagen hecha por ordenador.', 'Seen through eclipse glasses or a solar filter. Computer-made image.')
        : T('El Sol, visto con filtro solar. Imagen hecha por ordenador.', 'The Sun, seen through a solar filter. Computer-made image.');
    } else {
      g.fillStyle = '#060a14'; g.fillRect(0, 0, S, S);
      if (!corona || corona.R !== R) { corona = makeCorona(R); corona.R = R; }
      g.drawImage(corona, m - corona.width / 2, m - corona.height / 2);
      var chrom = g.createRadialGradient(m, m, R * 0.99, m, m, R * 1.025); chrom.addColorStop(0, 'rgba(255,80,120,.9)'); chrom.addColorStop(1, 'rgba(255,80,120,0)');
      g.fillStyle = chrom; g.beginPath(); g.arc(m, m, R * 1.03, 0, 7); g.fill();
      g.fillStyle = '#020306'; g.beginPath(); g.arc(mx, my, r, 0, 7); g.fill();
      insetCap.textContent = T('Totalidad: la corona del Sol, a simple vista. Solo ahora se pueden quitar las gafas. Imagen hecha por ordenador.', 'Totality: the Sun’s corona, with the naked eye. Only now can the glasses come off. Computer-made image.');
    }
    g.restore();
    g.strokeStyle = 'rgba(214,226,248,.45)'; g.lineWidth = 1.5; g.beginPath(); g.arc(m, m, m - 1, 0, 7); g.stroke();
  }

  /* ---------- texto: qué estás viendo ---------- */
  function phaseOf(t) {
    var e = st.ecl;
    if (t < e.partial_begin.time.date.getTime()) return 'antes';
    if (t > e.partial_end.time.date.getTime()) return 'despues';
    if (e.total_begin && t >= e.total_begin.time.date.getTime() && t <= e.total_end.time.date.getTime()) return e.kind === 'annular' ? 'anillo' : 'total';
    return 'parcial';
  }
  var PHASE = {
    antes: T('Todavía no ha empezado.', 'It has not started yet.'),
    parcial: T('Fase parcial: la Luna tapa parte del Sol. Solo con gafas de eclipse.', 'Partial phase: the Moon covers part of the Sun. Only with eclipse glasses.'),
    total: T('Totalidad: el Sol está tapado del todo. Solo ahora se puede mirar sin gafas.', 'Totality: the Sun is completely covered. Only now can you look without glasses.'),
    anillo: T('Anillo: queda un aro de Sol. Siempre con gafas de eclipse.', 'Ring: a ring of Sun is left. Always with eclipse glasses.'),
    despues: T('Ya ha terminado.', 'It is over.')
  };
  var nowBox = document.getElementById('ec-now'), liveBits = {};
  function placeName() { return st.place.city ? cname(st.place.city) : T('el punto elegido', 'the chosen point') + ' (' + num(st.place.lat, 2) + '°, ' + num(st.place.lon, 2) + '°)'; }
  function renderInfo() {
    var e = st.ecl, tz = st.place.tz, dd = e.peak.time.date, kind = e.kind;
    var head = T('Eclipse ', '') + (EN ? KIND[kind].charAt(0).toUpperCase() + KIND[kind].slice(1) + ' eclipse' : KIND[kind]) + ' · ' + fmtDate(dd, tz) + ' · ' + T('desde ', 'from ') + placeName();
    var facts = [
      [T('Sol tapado en el máximo', 'Sun covered at maximum'), pct(e.obscuration)],
      [T('Empieza', 'Starts'), fmtTime(e.partial_begin.time.date, tz) + (e.partial_begin.altitude < 0 ? T(' (con el Sol aún bajo el horizonte)', ' (with the Sun still below the horizon)') : '')],
      [T('Máximo', 'Maximum'), fmtTime(dd, tz, true) + ' · ' + T('Sol a ', 'Sun at ') + num(e.peak.altitude, 0) + '°'],
      [T('Acaba', 'Ends'), fmtTime(e.partial_end.time.date, tz) + (e.partial_end.altitude < 0 ? T(' (con el Sol ya puesto)', ' (after sunset)') : '')]];
    if (e.total_begin) facts.splice(2, 0, [kind === 'annular' ? T('Anillo', 'Ring') : T('Totalidad', 'Totality'), fmtTime(e.total_begin.time.date, tz, true) + '–' + fmtTime(e.total_end.time.date, tz, true) + ' · ' + dur((e.total_end.time.date - e.total_begin.time.date) / 1000)]);
    var id = 'sol-' + dd.toISOString().slice(0, 10), past = dd.getTime() < Date.now();
    liveBits.phase = h('p', { class: 'ec-phase' }); liveBits.clock = h('dd'); liveBits.cover = h('dd'); liveBits.sun = h('dd');
    nowBox.replaceChildren(
      h('p', { class: 'cn-now-head', text: head }),
      h('dl', { class: 'cn-facts' }, facts.map(function (f) { return h('div', { class: 'cn-fact' }, h('dt', { text: f[0] }), h('dd', { text: f[1] })); })),
      h('h3', { class: 'ec-now-h', text: T('En el simulador', 'In the simulator') }),
      liveBits.phase,
      h('dl', { class: 'cn-facts' }, h('div', { class: 'cn-fact' }, h('dt', { text: T('Hora', 'Time') }), liveBits.clock), h('div', { class: 'cn-fact' }, h('dt', { text: T('Sol tapado', 'Sun covered') }), liveBits.cover), h('div', { class: 'cn-fact' }, h('dt', { text: T('Dónde está el Sol', 'Where the Sun is') }), liveBits.sun)),
      h('p', { class: 'cn-note' }, T('Horas oficiales de ese lugar (', 'Official local time there ('), tz === 'Atlantic/Canary' ? T('hora de Canarias', 'Canary Islands time') : tz === 'Europe/Madrid' ? T('hora peninsular', 'mainland Spain time') : tz, T('). Para planificar, consulta las horas del IGN. ', '). To plan, check the IGN’s times. '), h('a', { href: '#seguridad', text: T('Cómo mirarlo sin peligro', 'How to watch safely') })),
      h('div', { class: 'filters' }, mineBtn(id, past ? 'visto' : 'quiero')));
  }
  function updateTime(silent) {
    if (!st.ecl) return;
    var t = st.t, k = state(t), s = k.s, tz = st.place.tz, ph = phaseOf(t);
    out.textContent = fmtTime(new Date(t), tz, true);
    slider.setAttribute('aria-valuetext', fmtTime(new Date(t), tz, true) + ' · ' + pct(s.total ? 1 : s.o));
    if (liveBits.clock) {
      liveBits.clock.textContent = fmtTime(new Date(t), tz, true);
      liveBits.cover.textContent = s.alt < -0.6 ? T('— (el Sol no está sobre el horizonte)', '— (the Sun is not above the horizon)') : pct(s.total ? 1 : s.o);
      liveBits.sun.textContent = num(s.alt, 0) + '° ' + T('sobre el horizonte, hacia el ', 'above the horizon, towards the ') + compass(s.az);
      liveBits.phase.textContent = PHASE[ph];
    }
    cv.setAttribute('aria-label', T('Cielo simulado desde ', 'Simulated sky from ') + placeName() + ', ' + fmtTime(new Date(t), tz) + '. ' + PHASE[ph] + ' ' + T('Sol tapado: ', 'Sun covered: ') + pct(s.total ? 1 : s.o) + '.');
    if (!silent && ph !== st.lastPhase) say(PHASE[ph]);
    st.lastPhase = ph;
    draw();
  }
  function stop() { if (st.play) { clearInterval(st.play); st.play = null; } if (playBtn) { playBtn.setAttribute('aria-pressed', 'false'); playBtn.textContent = T('Avanzar el tiempo', 'Run the clock'); } }
  function start() {
    if (st.play) { stop(); say(T('Parado a las ', 'Stopped at ') + fmtTime(new Date(st.t), st.place.tz)); return; }
    if (st.t >= st.t1 - 1000) st.t = st.t0;
    playBtn.setAttribute('aria-pressed', 'true'); playBtn.textContent = T('Parar', 'Stop');
    var e = st.ecl, tb = e.total_begin ? e.total_begin.time.date.getTime() : e.peak.time.date.getTime(), te = e.total_end ? e.total_end.time.date.getTime() : tb;
    st.play = setInterval(function () {
      var near = st.t > tb - 90000 && st.t < te + 90000;
      st.t = Math.min(st.t + (near ? 3000 : 40000) * (reduce() ? 2 : 1), st.t1); slider.value = String(st.t); updateTime();
      if (st.t >= st.t1) stop();
    }, reduce() ? 200 : 100);
  }

  /* ---------- controles ---------- */
  var slider, out, playBtn, placeSel, eclSel, insetCap;
  function fillEclipseSelect(pick) {
    eclSel.replaceChildren.apply(eclSel, st.list.map(function (e, i) {
      var d = e.peak.time.date;
      return h('option', { value: String(i), selected: e === pick, text: fmtDate(d, st.place.tz) + ' · ' + KIND[e.kind] + ' · ' + pct(e.obscuration) });
    }));
  }
  function jump(which) {
    var e = st.ecl, t = which === 'b' ? e.partial_begin : which === 'e' ? e.partial_end : which === 'c' ? (e.total_begin || e.peak) : e.peak;
    st.t = t.time.date.getTime() + (which === 'c' && e.total_begin ? 1500 : 0); stop(); slider.value = String(st.t); updateTime();
  }
  function buildUI() {
    stage.classList.add('cn-live');
    cv = h('canvas', { class: 'ec-sky', role: 'img', 'aria-label': T('Cielo simulado', 'Simulated sky') }); ctx = cv.getContext('2d');
    inset = h('canvas', { class: 'ec-inset-c', 'aria-hidden': 'true' }); ictx = inset.getContext('2d');
    insetCap = h('p', { class: 'ec-inset-cap' });
    view.appendChild(cv); view.appendChild(h('figure', { class: 'ec-inset' }, inset, h('figcaption', {}, insetCap)));
    placeSel = h('select', { id: 'ec-place', on: { change: function (ev) {
      var v = ev.target.value; if (v === '_') return;
      var c = D.ciudades[+v]; setPlace({ city: c.n, lat: c.lat, lon: c.lon, tz: c.tz }, currentDate()); say(T('Eclipse desde ', 'Eclipse from ') + cname(c.n) + '.'); } } },
      D.ciudades.slice().sort(function (a, b) { return cname(a.n).localeCompare(cname(b.n), LOC); }).map(function (c) { return h('option', { value: String(D.ciudades.indexOf(c)), text: cname(c.n) }); }));
    eclSel = h('select', { id: 'ec-ecl', on: { change: function (ev) { setEclipse(st.list[+ev.target.value]); say(eclSel.options[eclSel.selectedIndex].text); } } });
    slider = h('input', { type: 'range', id: 'ec-time', step: '10000', on: { input: function (ev) { stop(); st.t = +ev.target.value; updateTime(); } } });
    out = h('output', { for: 'ec-time', class: 'ec-clock' });
    playBtn = h('button', { type: 'button', class: 'filter', 'aria-pressed': 'false', text: T('Avanzar el tiempo', 'Run the clock'), on: { click: start } });
    var geo = h('button', { type: 'button', class: 'filter', text: T('Usar mi ubicación', 'Use my location'), on: { click: function () {
      if (!navigator.geolocation) { say(T('Este navegador no da la ubicación.', 'This browser does not give the location.')); return; }
      say(T('Pidiendo la ubicación al navegador…', 'Asking the browser for the location…'));
      navigator.geolocation.getCurrentPosition(function (p) {
        var lat = Math.round(p.coords.latitude * 100) / 100, lon = Math.round(p.coords.longitude * 100) / 100;
        addPoint(lat, lon); say(T('Eclipse desde tu ubicación.', 'Eclipse from your location.'));
      }, function () { say(T('No se ha podido usar la ubicación. Elige un lugar de la lista.', 'The location could not be used. Choose a place from the list.')); }, { maximumAge: 600000, timeout: 15000 });
    } } });
    var fs = h('button', { type: 'button', class: 'filter', text: T('Pantalla completa', 'Full screen'), on: { click: function () { if (document.fullscreenElement) document.exitFullscreen(); else if (stage.requestFullscreen) stage.requestFullscreen().catch(function () {}); } } });
    document.addEventListener('fullscreenchange', function () { fs.textContent = document.fullscreenElement ? T('Salir de pantalla completa', 'Exit full screen') : T('Pantalla completa', 'Full screen'); setTimeout(draw, 60); });
    ui.replaceChildren(
      h('div', { class: 'cn-ui-row' },
        h('label', { class: 'cn-ui-field', for: 'ec-place' }, h('span', { text: T('Lugar', 'Place') }), placeSel),
        h('div', { class: 'filters' }, geo),
        h('label', { class: 'cn-ui-field ec-eclf', for: 'ec-ecl' }, h('span', { text: T('Eclipse visible desde ahí', 'Eclipse visible from there') }), eclSel)),
      h('div', { class: 'cn-ui-row' },
        h('label', { class: 'cn-ui-field ec-timef', for: 'ec-time' }, h('span', {}, T('Hora: ', 'Time: '), out), slider),
        h('div', { class: 'filters', role: 'group', 'aria-label': T('Ir a un momento', 'Go to a moment') },
          h('button', { type: 'button', class: 'filter', text: T('Inicio', 'Start'), on: { click: function () { jump('b'); } } }),
          h('button', { type: 'button', class: 'filter', text: T('Máximo', 'Maximum'), on: { click: function () { jump('c'); } } }),
          h('button', { type: 'button', class: 'filter', text: T('Final', 'End'), on: { click: function () { jump('e'); } } }), playBtn)),
      h('div', { class: 'cn-ui-row' }, h('div', { class: 'filters' }, h('button', { type: 'button', class: 'filter', text: T('Guardar imagen', 'Save image'), on: { click: saveImage } }), fs)),
      h('p', { class: 'ss-help', text: T('La hora se mueve con el deslizador o con las flechas del teclado. En el recuadro redondo, el Sol y la Luna a su tamaño real, ampliados; en el cielo grande, el horizonte hacia donde está el Sol y su camino durante el eclipse. También puedes pulsar en cualquier punto de los mapas de más abajo.',
        'Move the time with the slider or the arrow keys. In the round box, the Sun and the Moon at their real size, magnified; in the big sky, the horizon towards the Sun and its path during the eclipse. You can also press any point on the maps further down.') }));
    // mapas: pulsar un punto
    Array.prototype.forEach.call(document.querySelectorAll('.ec-mapfig'), function (fig) {
      var svg = fig.querySelector('svg'); if (!svg || !D.mapa) return;
      svg.classList.add('ec-map-live');
      svg.addEventListener('click', function (ev) {
        var r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal, x = (ev.clientX - r.left) / r.width * vb.width, y = (ev.clientY - r.top) / r.height * vb.height, M = D.mapa, lat, lon, P;
        var ins = M.inset; if (x >= ins.x && y >= ins.y) { P = ins; x -= ins.x; y -= ins.y; } else P = M;
        var c = Math.cos((P.box[1] + P.box[3]) / 2 * DEG), kk = P.w / ((P.box[2] - P.box[0]) * c);
        lon = P.box[0] + x / (c * kk); lat = P.box[3] - y / kk;
        addPoint(Math.round(lat * 100) / 100, Math.round(lon * 100) / 100, fig.getAttribute('data-map'));
        stage.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth' });
      });
    });
    cv.addEventListener('keydown', function () {});
  }
  function currentDate() { return st.ecl ? st.ecl.peak.time.date.toISOString().slice(0, 10) : '2027-08-02'; }
  function addPoint(lat, lon, date) {
    var old = placeSel.querySelector('option[value="_"]'); if (old) old.remove();
    var label = T('Punto elegido', 'Chosen point') + ' (' + num(lat, 2) + '°, ' + num(lon, 2) + '°)';
    placeSel.insertBefore(h('option', { value: '_', text: label }), placeSel.firstChild); placeSel.value = '_';
    setPlace({ city: null, lat: lat, lon: lon, tz: tzFor(lat, lon) }, date || currentDate());
    say(label + '.');
  }
  function saveImage() {
    var w = cv.width, hh = cv.height, c = document.createElement('canvas'); c.width = w; c.height = hh;
    var g = c.getContext('2d'); g.drawImage(cv, 0, 0);
    var s = Math.max(1, w / 1200), ib = inset.getBoundingClientRect(), vb = view.getBoundingClientRect(), kx = w / vb.width;
    g.save(); g.beginPath(); var ix = (ib.left - vb.left) * kx, iy = (ib.top - vb.top) * kx, is = ib.width * kx; g.arc(ix + is / 2, iy + is / 2, is / 2, 0, 7); g.clip(); g.drawImage(inset, ix, iy, is, is); g.restore();
    var grad = g.createLinearGradient(0, hh - 90 * s, 0, hh); grad.addColorStop(0, 'rgba(0,0,0,0)'); grad.addColorStop(1, 'rgba(0,0,0,.78)'); g.fillStyle = grad; g.fillRect(0, hh - 90 * s, w, 90 * s);
    g.textAlign = 'left'; g.fillStyle = '#fff'; g.font = '600 ' + Math.round(18 * s) + 'px system-ui, sans-serif';
    g.fillText(T('Eclipse del ', 'Eclipse of ') + fmtDate(st.ecl.peak.time.date, st.place.tz) + ' · ' + placeName() + ' · ' + fmtTime(new Date(st.t), st.place.tz), 18 * s, hh - 38 * s);
    g.fillStyle = '#cfd8ea'; g.font = Math.round(13 * s) + 'px system-ui, sans-serif'; g.fillText(T('Imagen hecha por ordenador con astronomy-engine. No es una fotografía.', 'Computer-made image with astronomy-engine. It is not a photograph.'), 18 * s, hh - 16 * s);
    g.textAlign = 'right'; g.fillStyle = '#fff'; g.font = '700 ' + Math.round(16 * s) + 'px system-ui, sans-serif'; g.fillText(MARCA, w - 18 * s, hh - 16 * s);
    c.toBlob(function (b) { if (b) { download('iris-green-eclipse-' + currentDate() + '.png', b); say(T('Imagen guardada.', 'Image saved.')); } }, 'image/png');
  }

  /* ---------- tablas: ordenar y «verlo desde aquí» ---------- */
  function sortable(table) {
    var ths = table.querySelectorAll('thead th');
    Array.prototype.forEach.call(ths, function (th, i) {
      var label = th.textContent; if (!label) return;
      var b = h('button', { class: 'cn-sort', type: 'button' }, label);
      b.addEventListener('click', function () {
        var dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
        Array.prototype.forEach.call(ths, function (x) { x.removeAttribute('aria-sort'); }); th.setAttribute('aria-sort', dir);
        var tb = table.tBodies[0], rows = Array.prototype.slice.call(tb.rows);
        rows.sort(function (a, c) { var A1 = a.cells[i], C = c.cells[i], va = A1.getAttribute('data-v'), vc = C.getAttribute('data-v'), r;
          if (va !== null && vc !== null) r = (isNaN(+va) || isNaN(+vc)) ? va.localeCompare(vc) : parseFloat(va) - parseFloat(vc); else r = A1.textContent.localeCompare(C.textContent, LOC); return dir === 'ascending' ? r : -r; });
        rows.forEach(function (r) { tb.appendChild(r); });
        say(T('Ordenado por ', 'Sorted by ') + label + (dir === 'ascending' ? T(', de menor a mayor.', ', ascending.') : T(', de mayor a menor.', ', descending.')));
      });
      th.replaceChildren(b);
    });
  }
  function tableTools() {
    Array.prototype.forEach.call(document.querySelectorAll('section[id^="e20"] .ec-table'), function (tbl) {
      var date = tbl.closest('section').querySelector('.ec-mapfig').getAttribute('data-map');
      Array.prototype.forEach.call(tbl.tBodies[0].rows, function (tr) {
        var th = tr.cells[0], name = th.textContent, c = D.ciudades.filter(function (x) { return cname(x.n) === name; })[0]; if (!c || !cv) return;
        th.appendChild(h('button', { type: 'button', class: 'cn-open ec-go', 'aria-label': T('Ver el eclipse desde ', 'See the eclipse from ') + name, text: T('Verlo', 'See it'), on: { click: function () {
          placeSel.value = String(D.ciudades.indexOf(c)); setPlace({ city: c.n, lat: c.lat, lon: c.lon, tz: c.tz }, date); stage.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth' }); slider.focus({ preventScroll: true }); } } }));
      });
    });
    ['ec-sol', 'ec-lun', 'ec-cat'].concat([]).forEach(function (id) { var t = document.getElementById(id); if (t) sortable(t); });
    Array.prototype.forEach.call(document.querySelectorAll('section[id^="e20"] .ec-table'), sortable);
  }
  function catalogue() {
    var box = document.getElementById('ec-cat-tools'), tbl = document.getElementById('ec-cat'); if (!box || !tbl) return;
    var f = { body: 'all', kind: 'all', dec: 'all' };
    var count = h('p', { class: 'cn-note', 'aria-live': 'polite' });
    function apply() {
      var n = 0;
      Array.prototype.forEach.call(tbl.tBodies[0].rows, function (tr) {
        var k = tr.getAttribute('data-kind').split('-'), y = +tr.getAttribute('data-y');
        var ok = (f.body === 'all' || k[0] === f.body) && (f.kind === 'all' || k[1] === f.kind) && (f.dec === 'all' || Math.floor(y / 10) * 10 === +f.dec);
        tr.hidden = !ok; if (ok) n++;
      });
      count.textContent = n + T(' eclipses', ' eclipses');
    }
    var decs = []; for (var d = 2000; d <= 2100; d += 10) decs.push(d);
    box.replaceChildren(h('div', { class: 'cn-fields' },
      h('label', { class: 'cn-field', for: 'ec-cf-b' }, h('span', { text: T('Sol o Luna', 'Sun or Moon') }), h('select', { id: 'ec-cf-b', on: { change: function (ev) { f.body = ev.target.value; apply(); } } },
        h('option', { value: 'all', text: T('Todos', 'All') }), h('option', { value: 'sol', text: T('De Sol', 'Solar') }), h('option', { value: 'luna', text: T('De Luna', 'Lunar') }))),
      h('label', { class: 'cn-field', for: 'ec-cf-k' }, h('span', { text: T('Tipo', 'Type') }), h('select', { id: 'ec-cf-k', on: { change: function (ev) { f.kind = ev.target.value; apply(); } } },
        [['all', T('Todos', 'All')], ['total', T('Total', 'Total')], ['anular', T('Anular', 'Annular')], ['hibrido', T('Híbrido', 'Hybrid')], ['parcial', T('Parcial', 'Partial')], ['penumbral', T('Penumbral', 'Penumbral')]].map(function (o) { return h('option', { value: o[0], text: o[1] }); }))),
      h('label', { class: 'cn-field', for: 'ec-cf-d' }, h('span', { text: T('Década', 'Decade') }), h('select', { id: 'ec-cf-d', on: { change: function (ev) { f.dec = ev.target.value; apply(); } } },
        h('option', { value: 'all', text: '2000–2100' }), decs.map(function (d) { return h('option', { value: String(d), text: d === 2100 ? '2100' : d + '–' + (d + 9) }); })))), count);
    apply();
  }

  /* ---------- Mi colección ---------- */
  function load() { try { var v = window.localStorage.getItem(KEY); if (v) { var d = JSON.parse(v); if (d && Array.isArray(d.visto) && Array.isArray(d.quiero)) return d; } } catch (e) {} return { visto: [], quiero: [] }; }
  var mine = load();
  function save() { try { window.localStorage.setItem(KEY, JSON.stringify(mine)); } catch (e) {} }
  function has(l, k) { return mine[l].indexOf(k) > -1; }
  function toggle(l, k) { if (has(l, k)) mine[l] = mine[l].filter(function (x) { return x !== k; }); else mine[l].push(k); save(); refreshMine(); }
  var ALL = {};
  function label(id) { var e = ALL[id]; if (!e) return id; var d = new Date(e.t); return (id.indexOf('sol') === 0 ? T('Sol', 'Sun') : T('Luna', 'Moon')) + ' · ' + fmtDate(d, 'Europe/Madrid') + ' · ' + KIND[e.k]; }
  function mineBtn(id, list) {
    var txt = list === 'visto' ? T('Lo he visto', 'I have seen it') : T('Quiero verlo', 'I want to see it');
    return h('button', { type: 'button', class: 'cn-open ec-mine', 'data-id': id, 'data-l': list, 'aria-pressed': has(list, id) ? 'true' : 'false', text: txt,
      on: { click: function () { toggle(list, id); say(label(id) + ': ' + (has(list, id) ? T('añadido a Mi colección.', 'added to My collection.') : T('quitado de Mi colección.', 'removed from My collection.'))); } } });
  }
  function refreshMine() {
    Array.prototype.forEach.call(document.querySelectorAll('.ec-mine'), function (b) { b.setAttribute('aria-pressed', has(b.getAttribute('data-l'), b.getAttribute('data-id')) ? 'true' : 'false'); });
    var app = document.getElementById('ec-mine-app'); if (!app || !D) return;
    var now = Date.now(), ids = Object.keys(ALL).sort(function (a, b) { return ALL[a].t < ALL[b].t ? -1 : 1; });
    var pick = h('select', { id: 'ec-mine-pick' },
      h('optgroup', { label: T('Ya han pasado', 'Already past') }, ids.filter(function (k) { return Date.parse(ALL[k].t) < now; }).reverse().map(function (k) { return h('option', { value: k, text: label(k) }); })),
      h('optgroup', { label: T('Todavía no han llegado', 'Still to come') }, ids.filter(function (k) { return Date.parse(ALL[k].t) >= now; }).map(function (k) { return h('option', { value: k, text: label(k) }); })));
    function add(list) { var k = pick.value; if (!has(list, k)) { mine[list].push(k); save(); } refreshMine(); var p = document.getElementById('ec-mine-pick'); if (p) { p.value = k; p.focus(); } say(label(k) + ': ' + T('añadido a Mi colección.', 'added to My collection.')); }
    function group(list, title, empty) {
      var items = mine[list].filter(function (k) { return ALL[k]; }).sort(function (a, b) { return ALL[a].t < ALL[b].t ? -1 : 1; });
      return h('fieldset', { class: 'ss-mine-group' }, h('legend', { text: title + ' (' + items.length + ')' }),
        items.length ? h('ul', { class: 'ss-mine-list' }, items.map(function (k) { return h('li', {}, h('span', { class: 'ss-mine-name', text: label(k) }),
          h('button', { type: 'button', class: 'cn-open', 'aria-label': T('Quitar ', 'Remove ') + label(k), text: T('Quitar', 'Remove'), on: { click: function () { toggle(list, k); say(label(k) + ': ' + T('quitado.', 'removed.')); var p = document.getElementById('ec-mine-pick'); if (p) p.focus(); } } })); }))
          : h('p', { class: 'cn-note', text: empty }));
    }
    var confirm = h('div', { class: 'ss-confirm', hidden: true }, h('p', { text: T('¿Seguro? Se borra todo lo que has guardado en este navegador.', 'Are you sure? Everything you have saved in this browser will be deleted.') }),
      h('div', { class: 'filters' },
        h('button', { type: 'button', class: 'filter ss-danger', text: T('Sí, borrar mi colección', 'Yes, delete my collection'), on: { click: function () { mine = { visto: [], quiero: [] }; try { window.localStorage.removeItem(KEY); } catch (e) {} refreshMine(); say(T('Mi colección está vacía.', 'My collection is empty.')); var x = document.getElementById('ec-mine-del'); if (x) x.focus(); } } }),
        h('button', { type: 'button', class: 'filter', text: T('No, dejarla como está', 'No, keep it'), on: { click: function () { confirm.hidden = true; document.getElementById('ec-mine-del').focus(); } } })));
    var file = h('input', { type: 'file', id: 'ec-mine-file', accept: 'application/json,.json', class: 'cn-file', on: { change: function (ev) {
      var fl = ev.target.files[0]; if (!fl) return;
      fl.text().then(function (t) { var d = JSON.parse(t); if (!d || !Array.isArray(d.visto) || !Array.isArray(d.quiero)) throw new Error('x');
        mine = { visto: d.visto.filter(function (k) { return ALL[k]; }), quiero: d.quiero.filter(function (k) { return ALL[k]; }) }; save(); refreshMine(); say(T('Colección abierta.', 'Collection opened.')); })
        .catch(function () { say(T('Ese archivo no es una colección de Iris Green.', 'That file is not an Iris Green collection.')); });
    } } });
    app.replaceChildren(
      h('div', { class: 'cn-fields' }, h('label', { class: 'cn-field cn-field-wide', for: 'ec-mine-pick' }, h('span', { text: T('Elige un eclipse', 'Choose an eclipse') }), pick)),
      h('div', { class: 'filters cn-mine-actions' }, h('button', { type: 'button', class: 'filter', text: T('Lo he visto', 'I have seen it'), on: { click: function () { add('visto'); } } }), h('button', { type: 'button', class: 'filter', text: T('Quiero verlo', 'I want to see it'), on: { click: function () { add('quiero'); } } })),
      group('visto', T('Eclipses que he visto', 'Eclipses I have seen'), T('Todavía ninguno.', 'None yet.')),
      group('quiero', T('Eclipses que quiero ver', 'Eclipses I want to see'), T('Todavía ninguno.', 'None yet.')),
      h('p', { class: 'cn-note', text: T('Se guarda en este navegador (almacenamiento local) hasta que lo borres. Iris Green no recibe nada.', 'It is kept in this browser (local storage) until you delete it. Iris Green receives nothing.') }),
      h('div', { class: 'filters cn-mine-actions' },
        h('button', { type: 'button', class: 'filter', text: T('Guardar en un archivo', 'Save to a file'), on: { click: function () {
          download(T('mi-coleccion-eclipses.json', 'my-eclipse-collection.json'), new Blob([JSON.stringify({ marca: MARCA, tipo: T('Iris Green · Mi colección · Eclipses', 'Iris Green · My collection · Eclipses'), fecha: new Date().toISOString().slice(0, 10), visto: mine.visto, quiero: mine.quiero }, null, 1)], { type: 'application/json' }));
          say(T('Archivo guardado.', 'File saved.')); } } }),
        h('label', { class: 'filter cn-file-label', for: 'ec-mine-file' }, file, h('span', { text: T('Abrir un archivo', 'Open a file') })),
        h('button', { type: 'button', class: 'filter', id: 'ec-mine-del', text: T('Borrar mi colección', 'Delete my collection'), on: { click: function () { confirm.hidden = false; confirm.querySelector('button').focus(); } } })),
      confirm);
  }

  /* ---------- arranque ---------- */
  function begin(d, fondo) {
    D = d;
    if (fondo && fondo.estrellas) STARS = fondo.estrellas.filter(function (s) { return s[2] <= 4.2; });
    d.solar.forEach(function (e) { ALL['sol-' + e.t.slice(0, 10)] = e; }); d.lunar.forEach(function (e) { ALL['luna-' + e.t.slice(0, 10)] = e; });
    var ok = !!A && !!(document.createElement('canvas').getContext);
    if (ok) {
      buildUI();
      var c = D.ciudades.filter(function (x) { return x.n === 'Madrid'; })[0];
      placeSel.value = String(D.ciudades.indexOf(c));
      setPlace({ city: c.n, lat: c.lat, lon: c.lon, tz: c.tz }, '2027-08-02');
    } else {
      var p = view.querySelector('.cn-stage-nojs'); if (p) p.textContent = T('Tu navegador no puede mostrar el simulador. Todos los mapas y las horas están más abajo.', 'Your browser cannot show the simulator. All the maps and times are further down.');
    }
    tableTools(); catalogue(); refreshMine();
    if (location.hash && document.getElementById(location.hash.slice(1))) setTimeout(function () { document.getElementById(location.hash.slice(1)).scrollIntoView(); }, 0);
  }
  Promise.all([
    fetch('/es/intereses/eclipses/eclipses.json', { credentials: 'same-origin' }).then(function (r) { return r.json(); }),
    fetch('/es/intereses/sistema-solar/cielo-fondo.json', { credentials: 'same-origin' }).then(function (r) { return r.json(); }).catch(function () { return null; })
  ]).then(function (res) { begin(res[0], res[1]); }).catch(function () {
    var p = view && view.querySelector('.cn-stage-nojs'); if (p) p.textContent = T('No se han podido cargar los datos. Los mapas y las tablas de abajo siguen disponibles.', 'The data could not be loaded. The maps and tables below are still available.');
  });
})();
