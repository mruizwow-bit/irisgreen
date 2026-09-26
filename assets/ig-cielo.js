/* Iris Green · Tus intereses · Cielo nocturno.
   Mapa del cielo, fichas de las 88 constelaciones, estrellas con nombre y Mi cielo.
   Datos abiertos (HYG v4.1 CC BY-SA 4.0, IAU WGSN, d3-celestial). Sin red externa y sin evaluar código.
   Mi cielo se guarda solo en este navegador (localStorage): se puede borrar y guardar en un archivo. */
(function () {
  'use strict';
  var main = document.querySelector('main.cn'); if (!main) return;
  var EN = main.getAttribute('data-lang') === 'en';
  var T = function (es, en) { return EN ? en : es; };
  var KEY = 'ig-cielo-mis-listas';
  var MESES = EN ? ['January','February','March','April','May','June','July','August','September','October','November','December']
                 : ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  var SUN_RA = [19.8, 21.9, 23.6, 1.5, 3.5, 5.6, 7.6, 9.6, 11.5, 13.4, 15.4, 17.5];
  var VIS = EN ? { siempre: 'Always, never sets', entera: 'Whole', parte: 'Partly', no: 'Not visible' }
               : { siempre: 'Siempre, no se pone', entera: 'Entera', parte: 'En parte', no: 'No se ve' };
  var COLOR = EN ? { O: 'blue', B: 'blue-white', A: 'white', F: 'yellow-white', G: 'yellow', K: 'orange', M: 'red' }
                 : { O: 'azul', B: 'azul blanca', A: 'blanca', F: 'blanca amarillenta', G: 'amarilla', K: 'naranja', M: 'roja' };
  var D, CONS, BY, STARS, NAMED;
  var mine = load();

  /* ---------- utilidades ---------- */
  function h(tag, attrs) {
    var svg = /^(svg|g|path|circle|line|text|rect|polygon|polyline|title)$/.test(tag);
    var el = svg ? document.createElementNS('http://www.w3.org/2000/svg', tag) : document.createElement(tag);
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
  function num(x, d) { if (x === null || x === undefined) return '—'; if (d) { var s = x.toFixed(d); return EN ? s : s.replace('.', ','); } return thousands(Math.round(x)); }
  function thousands(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, EN ? ',' : '.'); }
  function mag(x) { return x === null || x === undefined ? '—' : (EN ? x.toFixed(2) : x.toFixed(2).replace('.', ',')); }
  function sp(s) { if (!s) return '—'; var c = COLOR[s.charAt(0).toUpperCase()]; return c ? s + ' · ' + c : s; }
  function cname(c) { return EN ? c.latin : c.es; }
  function say(msg) { var s = document.getElementById('cn-status'); if (!s) return; s.textContent = ''; setTimeout(function () { s.textContent = msg; }, 30); }
  function norm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function valid(d) { return d && Array.isArray(d.cs) && Array.isArray(d.cv) && Array.isArray(d.ss); }
  function load() {
    try { var v = window.localStorage.getItem(KEY); if (v) { var d = JSON.parse(v); if (valid(d)) return d; } } catch (e) {}
    try { var o = window.sessionStorage.getItem(KEY); if (o) { var d2 = JSON.parse(o); if (valid(d2)) { window.localStorage.setItem(KEY, o); window.sessionStorage.removeItem(KEY); return d2; } } } catch (e) {}   // listas de la versión anterior
    return { cs: [], cv: [], ss: [] };
  }
  function save() { try { window.localStorage.setItem(KEY, JSON.stringify(mine)); } catch (e) {} }
  function has(list, k) { return mine[list].indexOf(k) > -1; }
  function toggle(list, k) { if (has(list, k)) mine[list] = mine[list].filter(function (x) { return x !== k; }); else mine[list].push(k); save(); }

  /* ---------- astronomía sencilla ---------- */
  function altitude(raH, dec, lstH, lat) {
    var ha = (lstH - raH) * 15 * Math.PI / 180, d = dec * Math.PI / 180, p = lat * Math.PI / 180;
    return Math.asin(Math.sin(p) * Math.sin(d) + Math.cos(p) * Math.cos(d) * Math.cos(ha)) * 180 / Math.PI;
  }
  function rel(v, ra) { return ((v - ra + 36) % 24) - 12; }   // AR relativa al punto, entre −12 y 12 h
  function inRing(ra, dec, ring) {
    var n = ring.length, sum = 0, i, j;
    for (i = 0; i < n; i++) { var d = ring[(i + 1) % n][0] - ring[i][0]; if (d > 12) d -= 24; if (d < -12) d += 24; sum += d; }
    if (Math.abs(sum) > 12) {              // el anillo rodea un polo: se mira de qué lado del borde queda el punto
      var north = ring.reduce(function (s, p) { return s + p[1]; }, 0) > 0, cross = null;
      for (i = 0; i < n; i++) {
        var a = ring[i], c = ring[(i + 1) % n], xa = rel(a[0], ra), xc = rel(c[0], ra);
        if (Math.abs(xa - xc) > 12) continue;
        if ((xa <= 0 && xc >= 0) || (xa >= 0 && xc <= 0)) { var t = xa === xc ? 0 : -xa / (xc - xa); var dc = a[1] + t * (c[1] - a[1]); cross = cross === null ? dc : (north ? Math.min(cross, dc) : Math.max(cross, dc)); }
      }
      return cross !== null && (north ? dec >= cross : dec <= cross);
    }
    var inside = false;
    for (i = 0, j = n - 1; i < n; j = i++) {
      var xi = rel(ring[i][0], ra), yi = ring[i][1], xj = rel(ring[j][0], ra), yj = ring[j][1];
      if (Math.abs(xi - xj) > 12) return false;      // el anillo está al otro lado del cielo
      if (((yi > dec) !== (yj > dec)) && (0 < (xj - xi) * (dec - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  }
  function conAt(ra, dec) {
    for (var i = 0; i < CONS.length; i++) {
      var c = CONS[i];
      for (var r = 0; r < c.bounds.length; r++) if (inRing(ra, dec, c.bounds[r])) return c;
    }
    if (dec > 86) return BY.UMi; if (dec < -82) return BY.Oct;
    return null;
  }

  /* ---------- mapa ---------- */
  var W = 1200, H = 600;
  var view = { x: 0, y: 0, w: W, h: H }, opts = { lines: true, bounds: false, names: true, lim: 6 }, sel = null, touched = null, night = null;
  function X(ra) { return (24 - ra) / 24 * W; }
  function Y(dec) { return (90 - dec) / 180 * H; }
  function segs(pts) {                     // parte las líneas que cruzan 0 h
    var out = [], cur = [];
    pts.forEach(function (p, i) {
      if (i && Math.abs(p[0] - pts[i - 1][0]) > 12) { if (cur.length > 1) out.push(cur); cur = []; }
      cur.push(p);
    });
    if (cur.length > 1) out.push(cur);
    return out;
  }
  function pathOf(lines) {
    var d = '';
    lines.forEach(function (l) { segs(l).forEach(function (s) { d += 'M' + s.map(function (p) { return X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1); }).join('L'); }); });
    return d;
  }
  function ringPath(rings) {
    var d = '';
    rings.forEach(function (r) { segs(r.concat([r[0]])).forEach(function (s) { d += 'M' + s.map(function (p) { return X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1); }).join('L'); }); });
    return d;
  }
  function starColor(ci) {
    if (ci === null) return '#ffffff';
    if (ci < 0) return '#cfe0ff'; if (ci < 0.3) return '#e8f0ff'; if (ci < 0.6) return '#ffffff'; if (ci < 1.0) return '#fff2d6'; if (ci < 1.4) return '#ffdcae'; return '#ffc49a';
  }
  var svg, gStars, gLines, gBounds, gNames, gSel, gGrid, info, mapBox;
  function drawMap() {
    var z = W / view.w;
    svg.setAttribute('viewBox', view.x.toFixed(1) + ' ' + view.y.toFixed(1) + ' ' + view.w.toFixed(1) + ' ' + view.h.toFixed(1));
    gStars.replaceChildren(); var k = Math.pow(z, 0.55);
    for (var i = 0; i < STARS.length; i++) {
      var s = STARS[i]; if (s[2] > opts.lim) break;
      gStars.appendChild(h('circle', { cx: X(s[0]).toFixed(1), cy: Y(s[1]).toFixed(1), r: (Math.max(0.5, (6.6 - s[2]) * 0.62) / k).toFixed(2), fill: starColor(s[3]) }));
    }
    gLines.setAttribute('display', opts.lines ? '' : 'none');
    gBounds.setAttribute('display', opts.bounds ? '' : 'none');
    gNames.replaceChildren();
    if (opts.names) CONS.forEach(function (c) {
      var lit = night && night.indexOf(c.abbr) > -1;
      gNames.appendChild(h('text', { x: X(c.label[0]).toFixed(1), y: Y(c.label[1]).toFixed(1), 'font-size': (11 / z).toFixed(2), 'text-anchor': 'middle', fill: sel === c ? '#f2c46d' : lit ? '#bfe6c8' : '#aebfe0' }, cname(c)));
    });
    gSel.replaceChildren();
    if (sel) {
      gSel.appendChild(h('path', { d: ringPath(sel.bounds), fill: 'rgba(242,196,109,.08)', stroke: '#f2c46d', 'stroke-width': (1.6 / z).toFixed(2) }));
      gSel.appendChild(h('path', { d: pathOf(sel.lines), fill: 'none', stroke: '#f2c46d', 'stroke-width': (2 / z).toFixed(2) }));
    }
    if (touched) gSel.appendChild(h('circle', { cx: X(touched[0]), cy: Y(touched[1]), r: (7 / z).toFixed(2), fill: 'none', stroke: '#f2c46d', 'stroke-width': (1.6 / z).toFixed(2) }));
    gLines.setAttribute('stroke-width', (1 / z).toFixed(2)); gBounds.setAttribute('stroke-width', (0.8 / z).toFixed(2));
    gBounds.setAttribute('stroke-dasharray', (3 / z).toFixed(2) + ' ' + (3 / z).toFixed(2));
    var zl = document.getElementById('cn-zoom-level'); if (zl) zl.textContent = T('Aumento: ', 'Zoom: ') + '×' + (Math.round(z * 10) / 10);
  }
  function clampView() {
    view.w = Math.min(W, Math.max(W / 12, view.w)); view.h = view.w / 2;
    view.x = Math.min(W - view.w, Math.max(0, view.x)); view.y = Math.min(H - view.h, Math.max(0, view.y));
  }
  function zoom(f, cx, cy) {
    if (cx === undefined) { cx = view.x + view.w / 2; cy = view.y + view.h / 2; }
    view.w /= f; view.h = view.w / 2; view.x = cx - view.w / 2; view.y = cy - view.h / 2; clampView(); drawMap();
  }
  function pan(dx, dy) { view.x += dx * view.w; view.y += dy * view.h; clampView(); drawMap(); }
  function focusCon(c) {
    var xs = [], ys = [];
    c.bounds.forEach(function (r) { r.forEach(function (p) { xs.push(X(p[0])); ys.push(Y(p[1])); }); });
    var minx = Math.min.apply(null, xs), maxx = Math.max.apply(null, xs);
    if (maxx - minx > W / 2) { minx = 0; maxx = W; }            // cruza 0 h o rodea un polo
    var w = Math.max((maxx - minx) * 1.6, (Math.max.apply(null, ys) - Math.min.apply(null, ys)) * 3.2, W / 12);
    view.w = w; view.h = w / 2; view.x = (minx + maxx) / 2 - w / 2; view.y = (Math.min.apply(null, ys) + Math.max.apply(null, ys)) / 2 - view.h / 2;
    clampView();
  }
  function starLabel(s) { return (s[6] ? s[6] + ' (' + s[5] + ')' : s[5]); }
  function showInfo(ra, dec) {
    var c = conAt(ra, dec), best = null, bd = 1e9, rad = view.w / W * 18;
    for (var i = 0; i < STARS.length; i++) {
      var s = STARS[i]; if (s[2] > opts.lim) break;
      var dx = X(s[0]) - X(ra), dy = Y(s[1]) - Y(dec), dd = dx * dx + dy * dy;
      if (dd < bd && dd < rad * rad) { bd = dd; best = s; }
    }
    touched = best ? [best[0], best[1]] : null;
    if (c) sel = c;
    drawMap();
    info.replaceChildren(
      best ? h('div', { class: 'cn-info-star' }, h('p', { class: 'cn-info-t', text: starLabel(best) }),
        h('p', { text: T('Magnitud ', 'Magnitude ') + mag(best[2]) + ' · ' + (best[7] ? thousands(best[7]) + T(' años luz', ' light years') : T('distancia sin dato', 'distance unknown')) + ' · ' + sp(best[8]) })) : null,
      c ? h('div', { class: 'cn-info-con' }, h('p', { class: 'cn-info-t', text: T('Constelación: ', 'Constellation: ') + cname(c) }),
        h('button', { class: 'bajar cn-btn', type: 'button', on: { click: function () { openFicha(c, true); } } }, T('Ver su ficha', 'See its entry'))) : null);
    say((best ? starLabel(best) + '. ' : '') + (c ? T('Constelación ', 'Constellation ') + cname(c) + '.' : ''));
  }
  function buildMap() {
    var app = document.getElementById('cn-map-app'); if (!app) return;
    svg = h('svg', { class: 'cn-map', viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-labelledby': 'cn-map-title', tabindex: '0', preserveAspectRatio: 'xMidYMid meet' },
      h('title', { id: 'cn-map-title', text: T('Mapa de todo el cielo con las 88 constelaciones. Con el foco aquí, las flechas mueven el mapa y + y − cambian el aumento. Los mismos datos están en las tablas de esta página.',
        'Map of the whole sky with the 88 constellations. With focus here, arrow keys move the map and + and − change the zoom. The same data are in the tables on this page.') }),
      h('rect', { x: 0, y: 0, width: W, height: H, fill: '#0e1a33' }));
    gGrid = h('g', { stroke: 'rgba(174,191,224,.16)', 'stroke-width': 0.6, fill: 'none' });
    for (var r = 0; r <= 24; r += 2) gGrid.appendChild(h('line', { x1: X(r), y1: 0, x2: X(r), y2: H }));
    for (var d = -60; d <= 60; d += 30) gGrid.appendChild(h('line', { x1: 0, y1: Y(d), x2: W, y2: Y(d), 'stroke-dasharray': d === 0 ? null : '4 4' }));
    gBounds = h('g', { stroke: 'rgba(174,191,224,.45)', fill: 'none' });
    gLines = h('g', { stroke: 'rgba(143,167,214,.85)', fill: 'none', 'stroke-linecap': 'round' });
    CONS.forEach(function (c) { gLines.appendChild(h('path', { d: pathOf(c.lines) })); gBounds.appendChild(h('path', { d: ringPath(c.bounds) })); });
    gStars = h('g'); gNames = h('g', { 'font-family': 'Atkinson Hyperlegible, system-ui, sans-serif' }); gSel = h('g');
    svg.appendChild(gGrid); svg.appendChild(gBounds); svg.appendChild(gLines); svg.appendChild(gStars); svg.appendChild(gSel); svg.appendChild(gNames);
    svg.addEventListener('click', function (ev) {
      var pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
      var p = pt.matrixTransform(svg.getScreenCTM().inverse());
      showInfo(24 - p.x / W * 24, 90 - p.y / H * 180);
    });
    svg.addEventListener('keydown', function (ev) {
      var m = { ArrowLeft: [-0.15, 0], ArrowRight: [0.15, 0], ArrowUp: [0, -0.15], ArrowDown: [0, 0.15] }[ev.key];
      if (m) { ev.preventDefault(); pan(m[0], m[1]); return; }
      if (ev.key === '+' || ev.key === '=') { ev.preventDefault(); zoom(1.5); } else if (ev.key === '-' || ev.key === '_') { ev.preventDefault(); zoom(1 / 1.5); }
    });
    function tgl(key, label) {
      return h('button', { class: 'filter', type: 'button', 'aria-pressed': opts[key] ? 'true' : 'false', on: { click: function (ev) { opts[key] = !opts[key]; ev.currentTarget.setAttribute('aria-pressed', opts[key] ? 'true' : 'false'); drawMap(); } } }, label);
    }
    var limSel = h('select', { id: 'cn-lim', on: { change: function (ev) { opts.lim = +ev.target.value; drawMap(); say(T('Estrellas hasta la magnitud ', 'Stars down to magnitude ') + ev.target.value + '.'); } } },
      [[2, T('Solo las más brillantes (hasta 2)', 'Only the brightest (to 2)')], [3, T('Hasta la magnitud 3 (cielo de ciudad)', 'To magnitude 3 (city sky)')], [4, T('Hasta la 4 (afueras)', 'To 4 (suburbs)')], [5, T('Hasta la 5 (campo)', 'To 5 (countryside)')], [6, T('Hasta la 6 (cielo muy oscuro)', 'To 6 (very dark sky)')]]
        .map(function (o) { var op = h('option', { value: o[0], text: o[1] }); if (o[0] === opts.lim) op.selected = true; return op; }));
    var conSel = h('select', { id: 'cn-go', on: { change: function (ev) { var c = BY[ev.target.value]; if (!c) return; sel = c; touched = null; focusCon(c); drawMap(); say(T('Mapa centrado en ', 'Map centred on ') + cname(c) + '.'); } } },
      [h('option', { value: '', text: T('Elige una…', 'Choose one…') })].concat(CONS.slice().sort(function (a, b) { return cname(a).localeCompare(cname(b), EN ? 'en' : 'es'); }).map(function (c) { return h('option', { value: c.abbr, text: cname(c) }); })));
    var mesSel = h('select', { id: 'cn-mes' }, MESES.map(function (m, i) { var o = h('option', { value: i, text: m }); if (i === new Date().getMonth()) o.selected = true; return o; }));
    var lugSel = h('select', { id: 'cn-lugar' }, [h('option', { value: '40.4', text: T('la Península (40° N)', 'mainland Spain (40° N)') }), h('option', { value: '28.3', text: T('Canarias (28° N)', 'the Canary Islands (28° N)') })]);
    var nightOut = h('div', { class: 'cn-night-out', id: 'cn-night-out' });
    function tonight() {
      var m = +mesSel.value, lat = +lugSel.value, lst = (SUN_RA[m] + 10) % 24;
      var list = CONS.map(function (c) { return { c: c, alt: altitude(c.label[0], c.label[1], lst, lat) }; }).filter(function (x) { return x.alt > 15; }).sort(function (a, b) { return b.alt - a.alt; });
      night = list.map(function (x) { return x.c.abbr; }); drawMap();
      nightOut.replaceChildren(h('p', { text: T('Hacia las 22 h de ' + MESES[m] + ', desde ' + lugSel.options[lugSel.selectedIndex].text + ', hay ' + list.length + ' constelaciones altas en el cielo (más de 15° sobre el horizonte). De más alta a más baja:',
          'At about 10 pm in ' + MESES[m] + ', from ' + lugSel.options[lugSel.selectedIndex].text + ', ' + list.length + ' constellations are high in the sky (more than 15° above the horizon). From highest to lowest:') }),
        h('ul', { class: 'cn-chips' }, list.map(function (x) { return h('li', null, h('button', { class: 'filter', type: 'button', on: { click: function () { openFicha(x.c, true); } } }, cname(x.c) + ' · ' + Math.round(x.alt) + '°')); })));
      say(T(list.length + ' constelaciones altas hacia las 22 h.', list.length + ' constellations high at about 10 pm.'));
    }
    info = h('div', { class: 'cn-info', 'aria-live': 'off' }, h('p', { class: 'cn-note', text: T('Pulsa una estrella o una constelación del mapa.', 'Press a star or a constellation on the map.') }));
    mapBox = h('div', { class: 'cn-map-box' }, svg);
    app.replaceChildren(
      h('div', { class: 'cn-controls' },
        h('div', { class: 'filters', role: 'group', 'aria-label': T('Mover y aumentar el mapa', 'Move and zoom the map') },
          h('button', { class: 'filter', type: 'button', 'aria-label': T('Aumentar', 'Zoom in'), on: { click: function () { zoom(1.5); } } }, '+'),
          h('button', { class: 'filter', type: 'button', 'aria-label': T('Reducir', 'Zoom out'), on: { click: function () { zoom(1 / 1.5); } } }, '−'),
          h('button', { class: 'filter', type: 'button', 'aria-label': T('Mover a la izquierda', 'Move left'), on: { click: function () { pan(-0.25, 0); } } }, '←'),
          h('button', { class: 'filter', type: 'button', 'aria-label': T('Mover arriba', 'Move up'), on: { click: function () { pan(0, -0.25); } } }, '↑'),
          h('button', { class: 'filter', type: 'button', 'aria-label': T('Mover abajo', 'Move down'), on: { click: function () { pan(0, 0.25); } } }, '↓'),
          h('button', { class: 'filter', type: 'button', 'aria-label': T('Mover a la derecha', 'Move right'), on: { click: function () { pan(0.25, 0); } } }, '→'),
          h('button', { class: 'filter', type: 'button', on: { click: function () { view = { x: 0, y: 0, w: W, h: H }; sel = null; touched = null; drawMap(); say(T('Todo el cielo.', 'Whole sky.')); } } }, T('Todo el cielo', 'Whole sky')),
          h('span', { class: 'cn-note', id: 'cn-zoom-level' })),
        h('div', { class: 'filters', role: 'group', 'aria-label': T('Qué se ve en el mapa', 'What the map shows') },
          tgl('lines', T('Figuras', 'Figures')), tgl('bounds', T('Límites oficiales', 'Official boundaries')), tgl('names', T('Nombres', 'Names'))),
        h('div', { class: 'cn-fields' },
          h('label', { class: 'cn-field', for: 'cn-lim' }, h('span', { text: T('Estrellas', 'Stars') }), limSel),
          h('label', { class: 'cn-field', for: 'cn-go' }, h('span', { text: T('Ir a una constelación', 'Go to a constellation') }), conSel))),
      mapBox, info,
      h('div', { class: 'cn-night' },
        h('h3', { text: T('¿Qué se ve esta noche?', 'What can I see tonight?') }),
        h('div', { class: 'cn-fields' },
          h('label', { class: 'cn-field', for: 'cn-mes' }, h('span', { text: T('Mes', 'Month') }), mesSel),
          h('label', { class: 'cn-field', for: 'cn-lugar' }, h('span', { text: T('Desde', 'From') }), lugSel),
          h('div', { class: 'cn-field cn-field-btn' }, h('button', { class: 'bajar cn-btn', type: 'button', on: { click: tonight } }, T('Ver qué hay en el cielo', 'See what is in the sky')))),
        nightOut));
    if (window.innerWidth < 700) {        // en pantallas pequeñas se empieza con aumento, en la parte del cielo de este mes
      var lst0 = (SUN_RA[new Date().getMonth()] + 10) % 24;
      view.w = W / 2.5; view.h = view.w / 2; view.x = X(lst0) - view.w / 2; view.y = Y(25) - view.h / 2; clampView();
    }
    drawMap();
  }

  /* ---------- tabla de constelaciones y fichas ---------- */
  var conFilter = { q: '', pen: 'all', mes: 'all', mine: 'all' };
  function applyCons() {
    var rows = document.querySelectorAll('#cn-cons-table tbody tr'), n = 0;
    Array.prototype.forEach.call(rows, function (tr) {
      var c = BY[tr.getAttribute('data-abbr')];
      var ok = (!conFilter.q || norm(c.es + ' ' + c.latin + ' ' + c.abbr + ' ' + c.en + ' ' + c.gen).indexOf(conFilter.q) > -1)
        && (conFilter.pen === 'all' || (conFilter.pen === 'si' ? c.pen !== 'no' : c.pen === conFilter.pen))
        && (conFilter.mes === 'all' || String(c.mes) === conFilter.mes)
        && (conFilter.mine === 'all' || (conFilter.mine === 'sabe' ? has('cs', c.abbr) : conFilter.mine === 'nosabe' ? !has('cs', c.abbr) : has('cv', c.abbr)));
      tr.hidden = !ok; if (ok) n++;
    });
    var out = document.getElementById('cn-cons-count'); if (out) out.textContent = n + T(' de 88 constelaciones', ' of 88 constellations');
    return n;
  }
  function sortable(table, onSorted) {
    var ths = table.querySelectorAll('thead th');
    Array.prototype.forEach.call(ths, function (th, i) {
      var label = th.textContent;
      var b = h('button', { class: 'cn-sort', type: 'button' }, label);
      b.addEventListener('click', function () {
        var dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
        Array.prototype.forEach.call(ths, function (x) { x.removeAttribute('aria-sort'); });
        th.setAttribute('aria-sort', dir);
        var tb = table.tBodies[0], rows = Array.prototype.slice.call(tb.rows);
        rows.sort(function (a, c) {
          var A = a.cells[i], C = c.cells[i];
          var va = A.getAttribute('data-v'), vc = C.getAttribute('data-v'), r;
          if (va !== null && vc !== null) r = parseFloat(va) - parseFloat(vc); else r = A.textContent.localeCompare(C.textContent, EN ? 'en' : 'es');
          return dir === 'ascending' ? r : -r;
        });
        rows.forEach(function (r) { tb.appendChild(r); });
        say(T('Ordenado por ', 'Sorted by ') + label + (dir === 'ascending' ? T(', de menor a mayor.', ', ascending.') : T(', de mayor a menor.', ', descending.')));
        if (onSorted) onSorted();
      });
      th.replaceChildren(b);
    });
  }
  function select(id, label, options, onchange) {
    return h('label', { class: 'cn-field', for: id }, h('span', { text: label }),
      h('select', { id: id, on: { change: function (ev) { onchange(ev.target.value); } } }, options.map(function (o) { return h('option', { value: o[0], text: o[1] }); })));
  }
  function buildConsTools() {
    var tools = document.getElementById('cn-cons-tools'); if (!tools) return;
    var q = h('input', { id: 'cn-cons-q', type: 'search', autocomplete: 'off', placeholder: T('Orión, Ursa, Cyg…', 'Orion, Ursa, Cyg…'),
      on: { input: function (ev) { conFilter.q = norm(ev.target.value.trim()); say(applyCons() + T(' constelaciones.', ' constellations.')); } } });
    tools.replaceChildren(h('div', { class: 'cn-fields' },
      h('label', { class: 'cn-field cn-field-wide', for: 'cn-cons-q' }, h('span', { text: T('Buscar por nombre, nombre oficial o abreviatura', 'Search by name, official name or abbreviation') }), q),
      select('cn-f-pen', T('Desde la Península', 'From mainland Spain'), [['all', T('Todas', 'All')], ['si', T('Se ven entera o en parte', 'Whole or partly visible')], ['siempre', T('Siempre sobre el horizonte', 'Always above the horizon')], ['no', T('No se ven', 'Not visible')]], function (v) { conFilter.pen = v; say(applyCons() + T(' constelaciones.', ' constellations.')); }),
      select('cn-f-mes', T('Mejor mes', 'Best month'), [['all', T('Todos', 'Any')]].concat(MESES.map(function (m, i) { return [String(i), m]; })), function (v) { conFilter.mes = v; say(applyCons() + T(' constelaciones.', ' constellations.')); }),
      select('cn-f-mine', T('Mi cielo', 'My sky'), [['all', T('Todas', 'All')], ['sabe', T('Las que me sé', 'The ones I know')], ['nosabe', T('Las que aún no me sé', 'The ones I don’t know yet')], ['visto', T('Las que he visto', 'The ones I have seen')]], function (v) { conFilter.mine = v; say(applyCons() + T(' constelaciones.', ' constellations.')); })),
      h('p', { class: 'cn-note', id: 'cn-cons-count', 'aria-live': 'off' }));
    var table = document.getElementById('cn-cons-table');
    Array.prototype.forEach.call(table.tBodies[0].rows, function (tr) {
      var c = BY[tr.getAttribute('data-abbr')];
      tr.cells[0].appendChild(h('button', { class: 'cn-open', type: 'button', 'aria-label': T('Abrir la ficha de ', 'Open the entry for ') + cname(c), on: { click: function () { openFicha(c, false); } } }, T('Ficha', 'Entry')));
    });
    sortable(table);
    applyCons();
  }
  function fact(label, value) { return h('div', { class: 'cn-fact' }, h('dt', { text: label }), h('dd', { text: value })); }
  function miniMap(c) {
    var ra = [], de = [];
    c.bounds.forEach(function (r) { r.forEach(function (p) { ra.push(p[0]); de.push(p[1]); }); });
    var cra = c.label[0], w = 0;
    ra.forEach(function (x) { var d = Math.abs(((x - cra + 36) % 24) - 12); if (d > w) w = d; });
    var polar = w > 6;
    var dmin = Math.min.apply(null, de), dmax = Math.max.apply(null, de), pad = 2;
    var cosd = Math.cos(((dmin + dmax) / 2) * Math.PI / 180);
    function px(r) { var d = ((r - cra + 36) % 24) - 12; return -d * 15 * (polar ? 0.25 : cosd); }
    var xs = ra.map(px), minx = Math.min.apply(null, xs) - pad, maxx = Math.max.apply(null, xs) + pad;
    var vb = [minx, -(dmax + pad), maxx - minx, (dmax - dmin) + 2 * pad];
    var s = Math.max(vb[2], vb[3]) / 100;
    var g = h('svg', { class: 'cn-mini', viewBox: vb.join(' '), role: 'img', 'aria-label': T('Figura y límites de ', 'Figure and boundaries of ') + cname(c) },
      h('rect', { x: vb[0], y: vb[1], width: vb[2], height: vb[3], fill: '#0e1a33' }));
    c.bounds.forEach(function (r) { g.appendChild(h('polygon', { points: r.map(function (p) { return px(p[0]).toFixed(2) + ',' + (-p[1]).toFixed(2); }).join(' '), fill: 'rgba(242,196,109,.06)', stroke: 'rgba(174,191,224,.55)', 'stroke-width': s * 0.5, 'stroke-dasharray': s * 1.2 + ' ' + s * 1.2 })); });
    c.lines.forEach(function (l) { g.appendChild(h('polyline', { points: l.map(function (p) { return px(p[0]).toFixed(2) + ',' + (-p[1]).toFixed(2); }).join(' '), fill: 'none', stroke: '#f2c46d', 'stroke-width': s * 0.6, 'stroke-linecap': 'round' })); });
    STARS.forEach(function (st) {
      if (st[4] !== c.abbr) return;
      g.appendChild(h('circle', { cx: px(st[0]).toFixed(2), cy: (-st[1]).toFixed(2), r: (Math.max(0.35, (6.6 - st[2]) * 0.38) * s).toFixed(2), fill: starColor(st[3]) }));
      if (st[6] && st[2] < 3.2) g.appendChild(h('text', { x: (px(st[0]) + s * 2.2).toFixed(2), y: (-st[1] + s * 1).toFixed(2), 'font-size': (s * 3.4).toFixed(2), fill: '#dfe7f7', 'font-family': 'Atkinson Hyperlegible, system-ui, sans-serif' }, st[6]));
    });
    return g;
  }
  function openFicha(c, fromMap) {
    var box = document.getElementById('cn-ficha'); if (!box) return;
    var list = STARS.filter(function (s) { return s[4] === c.abbr; });
    var named = NAMED.filter(function (n) { return n.con === c.abbr; });
    var markBtn = function (listKey, on, off) {
      return h('button', { class: 'filter', type: 'button', 'aria-pressed': has(listKey, c.abbr) ? 'true' : 'false', on: { click: function (ev) {
        toggle(listKey, c.abbr); var p = has(listKey, c.abbr); ev.currentTarget.setAttribute('aria-pressed', p ? 'true' : 'false'); ev.currentTarget.textContent = p ? on : off;
        say(cname(c) + ': ' + (p ? on : T('quitada de Mi cielo', 'removed from My sky')) + '.'); drawMine(); applyCons(); } } }, has(listKey, c.abbr) ? on : off);
    };
    var cardHref = D.cromos[c.abbr] ? (EN ? '/en/interests/' : '/es/intereses/') + '#cromo-constelaciones-' + D.cromos[c.abbr] : null;
    var rows = list.map(function (s) {
      return h('tr', null, h('th', { scope: 'row', text: s[5] }), h('td', { text: s[6] || '—' }), h('td', { 'data-v': s[2], text: mag(s[2]) }),
        h('td', { 'data-v': s[7] || 999999, text: s[7] ? thousands(s[7]) : '—' }), h('td', { text: sp(s[8]) }));
    });
    var tbl = h('table', { class: 'cn-table' }, h('caption', { class: 'cn-cap-in', text: T('Las ' + list.length + ' estrellas de ' + c.es + ' que se ven a simple vista (hasta la magnitud 6), de más brillante a menos', 'The ' + list.length + ' naked-eye stars in ' + c.latin + ' (to magnitude 6), brightest first') }),
      h('thead', null, h('tr', null, [T('Designación', 'Designation'), T('Nombre', 'Name'), T('Magnitud', 'Magnitude'), T('Distancia (años luz)', 'Distance (light years)'), T('Tipo espectral · color', 'Spectral type · colour')].map(function (x) { return h('th', { scope: 'col', text: x }); }))),
      h('tbody', null, rows));
    box.replaceChildren(h('article', { class: 'cn-ficha', 'aria-labelledby': 'cn-ficha-h' },
      h('div', { class: 'cn-ficha-head' },
        h('div', null, h('p', { class: 'etiqueta', text: T('Ficha de constelación', 'Constellation entry') }), h('h3', { id: 'cn-ficha-h', text: cname(c) }),
          h('p', { class: 'latino', text: EN ? c.en + ' · ' + c.abbr : c.latin + ' · ' + c.abbr })),
        h('div', { class: 'filters' }, markBtn('cs', T('Me la sé', 'I know it'), T('Marcar: me la sé', 'Mark: I know it')), markBtn('cv', T('La he visto', 'I have seen it'), T('Marcar: la he visto', 'Mark: I have seen it')),
          VIVO.showInSky ? h('button', { class: 'filter', type: 'button', on: { click: function () { VIVO.showInSky(c); } } }, T('Buscarla en el cielo', 'Find it in the sky')) : null,
          h('button', { class: 'filter', type: 'button', on: { click: function () { sel = c; touched = null; focusCon(c); drawMap(); document.getElementById('mapa').scrollIntoView(); var m = document.querySelector('.cn-map'); if (m) m.focus({ preventScroll: true }); say(T('Mapa centrado en ', 'Map centred on ') + cname(c) + '.'); } } }, T('Ver en el mapa completo', 'Show on the full map')),
          h('button', { class: 'filter', type: 'button', on: { click: function () { box.replaceChildren(); var row = document.getElementById('c-' + c.abbr); var b = row && row.querySelector('.cn-open'); if (b) b.focus(); } } }, T('Cerrar ficha', 'Close entry')))),
      h('div', { class: 'cn-ficha-body' }, miniMap(c),
        h('dl', { class: 'cn-facts' },
          fact(T('Qué representa', 'What it shows'), EN ? c.en : c.sig_es),
          fact(T('Genitivo (para nombrar sus estrellas)', 'Genitive (used to name its stars)'), c.gen + (c.bright ? ' · ' + T('por ejemplo, ', 'for example, ') + c.bright.d.split(' ')[0] + ' ' + c.gen : '')),
          fact(T('Área', 'Area'), thousands(c.area) + T(' grados cuadrados · puesto ' + c.rank + ' de 88', ' square degrees · rank ' + c.rank + ' of 88')),
          fact(T('Declinación', 'Declination'), T('de ', 'from ') + num(c.dmin, 1) + '° ' + T('a ', 'to ') + num(c.dmax, 1) + '°'),
          fact(T('Mejor mes', 'Best month'), MESES[c.mes] + T(', hacia las 22 h', ', at about 10 pm')),
          fact(T('Desde la Península (40° N)', 'From mainland Spain (40° N)'), VIS[c.pen]),
          fact(T('Desde Canarias (28° N)', 'From the Canary Islands (28° N)'), VIS[c.can]),
          fact(T('Estrellas a simple vista', 'Naked-eye stars'), String(c.n6)),
          fact(T('Estrellas con nombre oficial', 'Stars with an official name'), named.length ? named.map(function (n) { return n.n; }).join(', ') : T('ninguna', 'none')),
          fact(T('La más brillante', 'The brightest'), c.bright ? (c.bright.n ? c.bright.n + ' (' + c.bright.d + ')' : c.bright.d) + ' · ' + T('magnitud ', 'magnitude ') + mag(c.bright.mag) : '—'))),
      cardHref ? h('p', null, h('a', { class: 'bajar', href: cardHref }, T('Leer su cromo: cómo encontrarla, qué es y su historia', 'Read its card: how to find it, what it is and its history'))) : null,
      h('div', { class: 'cn-table-wrap', role: 'region', tabindex: '0', 'aria-label': T('Estrellas de ', 'Stars in ') + cname(c) }, tbl)));
    sortable(tbl);
    box.focus({ preventScroll: true });
    box.scrollIntoView({ block: 'start' });
    if (!fromMap) { sel = c; drawMap(); }
    say(T('Ficha de ', 'Entry for ') + cname(c) + '.');
  }

  /* ---------- estrellas con nombre ---------- */
  var stFilter = { q: '', con: 'all', eye: false, mine: 'all' };
  function applyStars() {
    var rows = document.querySelectorAll('#cn-stars-table tbody tr'), n = 0;
    Array.prototype.forEach.call(rows, function (tr, i) {
      var s = NAMED[+tr.getAttribute('data-i')];
      var ok = (!stFilter.q || norm(s.n + ' ' + s.d + ' ' + s.con + ' ' + (BY[s.con] ? BY[s.con].es + ' ' + BY[s.con].latin : '') + ' ' + s.o_es + ' ' + s.o_en).indexOf(stFilter.q) > -1)
        && (stFilter.con === 'all' || s.con === stFilter.con)
        && (!stFilter.eye || (s.mag !== null && s.mag <= 6))
        && (stFilter.mine === 'all' || (stFilter.mine === 'sabe' ? has('ss', s.n) : !has('ss', s.n)));
      tr.hidden = !ok; if (ok) n++;
    });
    var out = document.getElementById('cn-stars-count'); if (out) out.textContent = n + T(' de ', ' of ') + NAMED.length + T(' estrellas', ' stars');
    return n;
  }
  function buildStarsTools() {
    var tools = document.getElementById('cn-stars-tools'); if (!tools) return;
    var table = document.getElementById('cn-stars-table');
    Array.prototype.forEach.call(table.tBodies[0].rows, function (tr, i) {
      tr.setAttribute('data-i', i);
      var s = NAMED[i];
      var b = h('button', { class: 'cn-open', type: 'button', 'aria-pressed': has('ss', s.n) ? 'true' : 'false', 'aria-label': T('Me la sé: ', 'I know it: ') + s.n,
        on: { click: function (ev) { toggle('ss', s.n); var p = has('ss', s.n); ev.currentTarget.setAttribute('aria-pressed', p ? 'true' : 'false'); ev.currentTarget.textContent = p ? T('Me la sé ✓', 'I know it ✓') : T('Me la sé', 'I know it'); say(s.n + (p ? T(': me la sé.', ': I know it.') : T(': quitada.', ': removed.'))); drawMine(); } } },
        has('ss', s.n) ? T('Me la sé ✓', 'I know it ✓') : T('Me la sé', 'I know it'));
      tr.cells[0].appendChild(b);
    });
    var conOpts = [['all', T('Todas', 'All')]].concat(CONS.slice().sort(function (a, b) { return cname(a).localeCompare(cname(b), EN ? 'en' : 'es'); }).filter(function (c) { return c.named; }).map(function (c) { return [c.abbr, cname(c) + ' (' + c.named + ')']; }));
    var eye = h('input', { type: 'checkbox', id: 'cn-f-eye', on: { change: function (ev) { stFilter.eye = ev.target.checked; say(applyStars() + T(' estrellas.', ' stars.')); } } });
    tools.replaceChildren(h('div', { class: 'cn-fields' },
      h('label', { class: 'cn-field cn-field-wide', for: 'cn-stars-q' }, h('span', { text: T('Buscar por nombre, designación, constelación u origen', 'Search by name, designation, constellation or origin') }),
        h('input', { id: 'cn-stars-q', type: 'search', autocomplete: 'off', placeholder: T('Sirio, Betelgeuse, árabe…', 'Sirius, Betelgeuse, Arabic…'), on: { input: function (ev) { stFilter.q = norm(ev.target.value.trim()); say(applyStars() + T(' estrellas.', ' stars.')); } } })),
      select('cn-f-con', T('Constelación', 'Constellation'), conOpts, function (v) { stFilter.con = v; say(applyStars() + T(' estrellas.', ' stars.')); }),
      select('cn-f-smine', T('Mi cielo', 'My sky'), [['all', T('Todas', 'All')], ['sabe', T('Las que me sé', 'The ones I know')], ['nosabe', T('Las que aún no me sé', 'The ones I don’t know yet')]], function (v) { stFilter.mine = v; say(applyStars() + T(' estrellas.', ' stars.')); }),
      h('label', { class: 'cn-check', for: 'cn-f-eye' }, eye, h('span', { text: T('Solo las que se ven a simple vista', 'Only naked-eye stars') }))),
      h('p', { class: 'cn-note', id: 'cn-stars-count' }));
    sortable(table);
    applyStars();
  }

  /* ---------- Mi cielo ---------- */
  function drawMine() {
    var app = document.getElementById('cn-mine-app'); if (!app) return;
    function bar(n, total, label) {
      return h('div', { class: 'cn-prog' }, h('p', null, h('strong', { text: n + T(' de ', ' of ') + total }), ' ' + label),
        h('div', { class: 'cn-bar', role: 'img', 'aria-label': Math.round(n / total * 100) + ' %' }, h('span', { style: 'width:' + (n / total * 100).toFixed(1) + '%' })));
    }
    var eyeNamed = NAMED.filter(function (s) { return s.mag !== null && s.mag <= 6; }).length;
    var knownEye = NAMED.filter(function (s) { return has('ss', s.n) && s.mag !== null && s.mag <= 6; }).length;
    var chips = function (keys, getName, list) {
      if (!keys.length) return h('p', { class: 'cn-note', text: T('Todavía ninguna.', 'None yet.') });
      return h('ul', { class: 'cn-chips' }, keys.map(function (k) { return h('li', null, h('span', { class: 'pill', text: getName(k) })); }));
    };
    makeConfirm();
    var file = h('input', { type: 'file', id: 'cn-file', accept: 'application/json,.json', hidden: true, tabindex: '-1', 'aria-hidden': 'true', on: { change: function (ev) {
      var f = ev.target.files && ev.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var d = JSON.parse(r.result);
          if (!d || !Array.isArray(d.cs) || !Array.isArray(d.cv) || !Array.isArray(d.ss)) throw new Error('formato');
          mine = { cs: d.cs.filter(function (k) { return BY[k]; }), cv: d.cv.filter(function (k) { return BY[k]; }), ss: d.ss.filter(function (n) { return NAMED.some(function (s) { return s.n === n; }); }) };
          save(); drawMine(); refreshMarks(); applyCons(); applyStars(); say(T('Lista abierta.', 'List opened.'));
        } catch (e) { say(T('Ese archivo no es una lista de Mi cielo.', 'That file is not a My sky list.')); }
      };
      r.readAsText(f);
    } } });
    app.replaceChildren(
      h('div', { class: 'cn-progs' },
        bar(mine.cs.length, 88, T('constelaciones que me sé', 'constellations I know')),
        bar(mine.cv.length, 88, T('constelaciones que he visto', 'constellations I have seen')),
        bar(knownEye, eyeNamed, T('estrellas con nombre que se ven a simple vista y me sé', 'naked-eye named stars I know')),
        bar(mine.ss.length, NAMED.length, T('estrellas con nombre que me sé, en total', 'named stars I know, in total'))),
      h('h3', { text: T('Constelaciones que me sé', 'Constellations I know') }), chips(mine.cs, function (k) { return cname(BY[k]); }),
      h('h3', { text: T('Constelaciones que he visto', 'Constellations I have seen') }), chips(mine.cv, function (k) { return cname(BY[k]); }),
      h('h3', { text: T('Estrellas que me sé', 'Stars I know') }), chips(mine.ss, function (n) { return n; }),
      h('div', { class: 'filters cn-mine-actions' },
        h('button', { class: 'bajar cn-btn', type: 'button', on: { click: function () {
          var blob = new Blob([JSON.stringify({ marca: 'IRIS GREEN · irisgreen.eu', tipo: 'Iris Green · Mi cielo', cs: mine.cs, cv: mine.cv, ss: mine.ss }, null, 1)], { type: 'application/json' });
          var a = h('a', { href: URL.createObjectURL(blob), download: T('mi-cielo.json', 'my-sky.json') }); document.body.appendChild(a); a.click();
          setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); say(T('Lista guardada en un archivo.', 'List saved to a file.'));
        } } }, T('Guardar mi lista en un archivo', 'Save my list to a file')),
        h('button', { class: 'bajar cn-btn', type: 'button', on: { click: function () { file.click(); } } }, T('Abrir una lista guardada', 'Open a saved list')), file,
        h('button', { class: 'bajar cn-btn', type: 'button', on: { click: function () { window.print(); } } }, T('Imprimir', 'Print')),
        h('button', { class: 'bajar cn-btn', type: 'button', id: 'cn-mine-del', on: { click: function () { confirmBox.hidden = false; confirmBox.querySelector('button').focus(); } } }, T('Borrar mi lista', 'Delete my list'))),
      confirmBox);
  }
  var confirmBox = null;
  function makeConfirm() {
    confirmBox = h('div', { class: 'cn-confirm', hidden: true },
      h('p', { text: T('¿Seguro? Se borra todo lo que has marcado en Mi cielo en este navegador.', 'Are you sure? Everything you have marked in My sky in this browser will be deleted.') }),
      h('div', { class: 'filters' },
        h('button', { class: 'bajar cn-btn cn-danger', type: 'button', on: { click: function () {
          mine = { cs: [], cv: [], ss: [] }; try { window.localStorage.removeItem(KEY); } catch (e) {}
          drawMine(); refreshMarks(); applyCons(); applyStars(); say(T('Mi cielo está vacío.', 'My sky is empty.')); var b = document.getElementById('cn-mine-del'); if (b) b.focus();
        } } }, T('Sí, borrar mi lista', 'Yes, delete my list')),
        h('button', { class: 'bajar cn-btn', type: 'button', on: { click: function () { confirmBox.hidden = true; var b = document.getElementById('cn-mine-del'); if (b) b.focus(); } } }, T('No, dejarla como está', 'No, keep it'))));
    return confirmBox;
  }
  function refreshMarks() {
    Array.prototype.forEach.call(document.querySelectorAll('#cn-stars-table tbody tr'), function (tr) {
      var s = NAMED[+tr.getAttribute('data-i')], b = tr.querySelector('.cn-open'); if (!b) return;
      var p = has('ss', s.n); b.setAttribute('aria-pressed', p ? 'true' : 'false'); b.textContent = p ? T('Me la sé ✓', 'I know it ✓') : T('Me la sé', 'I know it');
    });
  }

  /* ---------- puente con el cielo en directo ---------- */
  var VIVO = { EN: EN, T: T, h: h, say: say, mag: mag, thousands: thousands, sp: sp,
    conAt: function (ra, dec) { return conAt(ra, dec); }, openFicha: function (c) { openFicha(c, false); } };

  /* ---------- arranque ---------- */
  fetch('/es/intereses/cielo/cielo.json', { credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (d) {
    D = d; CONS = d.constelaciones; STARS = d.estrellas; NAMED = d.nombres; BY = {};
    CONS.forEach(function (c) { BY[c.abbr] = c; });
    if (window.IGCieloVivo) window.IGCieloVivo.start(D, VIVO);
    setTimeout(function () { buildMap();
      var hash = decodeURIComponent(location.hash.slice(1));
      if (hash.indexOf('c-') === 0 && BY[hash.slice(2)]) openFicha(BY[hash.slice(2)], false);
      setTimeout(function () { buildConsTools();
        setTimeout(function () { buildStarsTools(); drawMine(); }, 0);
      }, 0);
    }, 0);
  }).catch(function () { say(T('No se ha podido cargar el cielo. Las tablas siguen disponibles.', 'The sky could not be loaded. The tables are still available.')); });
})();
