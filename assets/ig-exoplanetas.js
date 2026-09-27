/* Iris Green · Tus intereses · Exoplanetas.
   Controles del mapa 3D, «Qué estás viendo» con el sistema dibujado a escala, buscador de los 6.366 planetas y Mi colección.
   Datos: NASA Exoplanet Archive (consulta 24/09/2026). Sin red externa y sin evaluar código.
   Mi colección se guarda solo en este navegador (localStorage) y se puede borrar o guardar en un archivo. */
(function () {
  'use strict';
  var main = document.querySelector('main.ex'); if (!main) return;
  var EN = main.getAttribute('data-lang') === 'en';
  var T = function (es, en) { return EN ? en : es; };
  var KEY = 'ig-exoplanetas-coleccion', MARCA = 'IRIS GREEN · irisgreen.eu', LY = 3.26156;
  var D, S, P, BYH = [], MAP = null, FONDO = null;
  var FAMOUS = ['Proxima Cen', 'TRAPPIST-1', '51 Peg', 'PSR B1257+12', 'HD 209458', 'HR 8799', 'Kepler-16', 'KOI-351', 'HD 160691', 'HD 149143', 'GJ 486', "Teegarden's Star", "Barnard's star", 'K2-18', 'WASP-39'];
  var MET = EN ? ['Transit', 'Radial velocity', 'Gravitational microlensing', 'Direct imaging', 'Transit timing variations', 'Eclipse timing variations', 'Orbital brightness modulation', 'Pulsar timing', 'Astrometry', 'Pulsation timing variations', 'Disk kinematics']
               : ['Tránsito', 'Velocidad radial', 'Microlente gravitatoria', 'Imagen directa', 'Variaciones en el tiempo de tránsito', 'Variaciones en el tiempo de eclipse', 'Modulación del brillo', 'Tiempo de un púlsar', 'Astrometría', 'Variaciones en las pulsaciones', 'Movimiento del disco'];
  var reduce = function () { return (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || document.documentElement.getAttribute('data-ig-motion') === 'off'; };

  /* ---------- utilidades ---------- */
  function h(tag, attrs) {
    var svg = /^(svg|g|path|circle|rect|text|title|line)$/.test(tag);
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
  function thousands(s) { return s.replace(/\B(?=(\d{3})+(?!\d))/g, EN ? ',' : '.'); }
  function num(x, d) { if (x === null || x === undefined || isNaN(x)) return '—'; var s = Math.abs(x).toFixed(d || 0), p = s.split('.'); return (x < 0 ? '−' : '') + thousands(p[0]) + (p[1] ? (EN ? '.' : ',') + p[1] : ''); }
  function smart(x) { if (x === null || x === undefined) return '—'; return x >= 100 ? num(x) : x >= 10 ? num(x, 1) : x >= 1 ? num(x, 2) : num(x, 3); }
  function say(msg) { var s = document.getElementById('cn-status'); if (!s) return; s.textContent = ''; setTimeout(function () { s.textContent = msg; }, 30); }
  function norm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function download(name, blob) { var a = h('a', { href: URL.createObjectURL(blob), download: name }); document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
  function starName(i) { var s = S[i]; return s[12] ? s[12] : s[0]; }
  function starLabel(i) { var s = S[i]; return s[12] ? s[12] + ' (' + s[0] + ')' : s[0]; }
  function conName(k) { var c = D.constelaciones[k]; return c ? (EN ? c[1] : c[0]) : '—'; }
  function hexcol(t) {
    t = t || 5200; var k = Math.max(1500, Math.min(t, 40000)) / 100, r, g, b;
    if (k <= 66) { r = 255; g = 99.4708 * Math.log(k) - 161.1196; b = k <= 19 ? 0 : 138.5177 * Math.log(k - 10) - 305.0448; } else { r = 329.6987 * Math.pow(k - 60, -0.1332); g = 288.1222 * Math.pow(k - 60, -0.0755); b = 255; }
    var c = function (v) { v = Math.round(Math.max(0, Math.min(255, v))); return (v < 16 ? '0' : '') + v.toString(16); };
    return '#' + c(r) + c(g) + c(b);
  }
  function starColorName(t) {
    if (!t) return null;
    if (t < 3700) return T('roja', 'red'); if (t < 5200) return T('naranja', 'orange'); if (t < 6000) return T('amarilla', 'yellow');
    if (t < 7500) return T('blanca amarillenta', 'yellow-white'); if (t < 10000) return T('blanca', 'white'); return T('azul blanca', 'blue-white');
  }

  /* ---------- Mi colección ---------- */
  function load() { try { var v = window.localStorage.getItem(KEY); if (v) { var d = JSON.parse(v); if (d && Array.isArray(d.fav) && Array.isArray(d.sabe)) return d; } } catch (e) {} return { fav: [], sabe: [] }; }
  var mine = load();
  function save() { try { window.localStorage.setItem(KEY, JSON.stringify(mine)); } catch (e) {} }
  function has(l, k) { return mine[l].indexOf(k) > -1; }
  function toggle(l, k) { if (has(l, k)) mine[l] = mine[l].filter(function (x) { return x !== k; }); else mine[l].push(k); save(); refreshMine(); }

  /* ---------- dibujo de un sistema a escala ---------- */
  function systemSvg(hi) {
    var s = S[hi], ps = BYH[hi].slice().sort(function (a, b) { return (P[a][6] || 9e9) - (P[b][6] || 9e9); });
    var L = s[5] && s[4] ? s[5] * s[5] * Math.pow(s[4] / 5772, 4) : null, hz = L ? [0.95 * Math.sqrt(L), 1.67 * Math.sqrt(L)] : null;
    var amax = Math.max.apply(null, ps.map(function (i) { return P[i][6] || 0; }).concat(hz ? [hz[1]] : [0])) || 1;
    var W = 640, H = 170, x0 = 36, sx = function (a) { return x0 + a / amax * (W - x0 - 30); };
    var svg = h('svg', { class: 'ex-sys', viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': T('Órbitas a escala de ', 'Orbits to scale of ') + starLabel(hi) });
    if (hz) svg.appendChild(h('rect', { x: sx(hz[0]).toFixed(1), y: 18, width: Math.max(sx(hz[1]) - sx(hz[0]), 1.5).toFixed(1), height: H - 60, class: 'ex-hz', rx: 4 })),
      svg.appendChild(h('text', { x: ((sx(hz[0]) + sx(hz[1])) / 2).toFixed(1), y: 14, class: 'ex-ax', 'text-anchor': 'middle', text: T('zona templada aproximada', 'approximate temperate zone') }));
    svg.appendChild(h('circle', { cx: x0, cy: (H - 40) / 2 + 9, r: 12, fill: hexcol(s[4]) }));
    svg.appendChild(h('path', { d: 'M' + x0 + ' ' + (H - 30) + 'H' + (W - 30), class: 'ex-grid' }));
    var step = Math.pow(10, Math.floor(Math.log10(amax / 4 || 1)));
    [1, 2, 5, 10].some(function (m) { if (amax / (step * m) <= 5) { step *= m; return true; } return false; });
    for (var k = step; k <= amax + 1e-9; k += step) {
      svg.appendChild(h('path', { d: 'M' + sx(k).toFixed(1) + ' ' + (H - 34) + 'v8', class: 'ex-grid' }));
      svg.appendChild(h('text', { x: sx(k).toFixed(1), y: H - 12, class: 'ex-ax', 'text-anchor': 'middle', text: num(k, k < 1 ? 2 : k < 10 ? 1 : 0) + ' ' + T('ua', 'au') }));
    }
    var missing = 0;
    ps.forEach(function (i, j) {
      var p = P[i]; if (!p[6]) { missing++; return; }
      var r = Math.min(3 + Math.pow(p[7] || 1, 0.6) * 1.8, 16), cy = (H - 40) / 2 + 9 + (ps.length < 3 ? 0 : (j % 2 ? 10 : -10));
      svg.appendChild(h('circle', { cx: sx(p[6]).toFixed(1), cy: cy, r: r.toFixed(1), class: 'ex-pl' }, h('title', { text: p[0] })));
      svg.appendChild(h('text', { x: sx(p[6]).toFixed(1), y: (cy - r - 4).toFixed(1), class: 'ex-pl-t', 'text-anchor': 'middle', text: p[0].split(' ').pop() }));
    });
    return { svg: svg, missing: missing };
  }

  /* ---------- Qué estás viendo ---------- */
  var current = -1;
  function renderNow(hi) {
    var box = document.getElementById('ex-now'); if (!box) return;
    current = hi;
    if (hi < 0) {
      box.replaceChildren(h('p', { class: 'cn-now-head', text: T('El Sol y las estrellas con planetas', 'The Sun and the stars with planets') }),
        h('p', { class: 'cn-note', text: T('Pulsa una estrella en el mapa, búscala por su nombre o elige un sistema de la lista.', 'Press a star on the map, search for it by name or choose a system from the list.') }));
      return;
    }
    var s = S[hi], ly = s[3] ? s[3] * LY : null, sysd = systemSvg(hi), rows = BYH[hi].slice().sort(function (a, b) { return (P[a][6] || 9e9) - (P[b][6] || 9e9); });
    var facts = [[T('Constelación', 'Constellation'), conName(s[11])], [T('Distancia', 'Distance'), ly ? num(ly, ly < 100 ? 1 : 0) + T(' años luz', ' light years') : '—'],
      [T('Estrella', 'Star'), [s[7], s[4] ? num(s[4]) + ' K' : null, starColorName(s[4])].filter(Boolean).join(' · ') || '—'],
      [T('Tamaño de la estrella', 'Star size'), s[5] ? smart(s[5]) + T(' veces el radio del Sol', ' times the Sun’s radius') : '—'],
      [T('A simple vista', 'Naked eye'), s[8] !== null ? (s[8] <= 6 ? T('Sí', 'Yes') + ' · ' + T('magnitud ', 'magnitude ') + num(s[8], 1) : T('No', 'No') + ' · ' + T('magnitud ', 'magnitude ') + num(s[8], 1)) : '—']];
    if (s[9] > 1) facts.push([T('Estrellas en el sistema', 'Stars in the system'), String(s[9])]);
    var fav = h('button', { type: 'button', class: 'cn-open ex-fav', 'aria-pressed': has('fav', s[0]) ? 'true' : 'false', 'data-host': s[0], text: T('Sistema favorito', 'Favourite system'),
      on: { click: function () { toggle('fav', s[0]); say(starLabel(hi) + ': ' + (has('fav', s[0]) ? T('añadido a Mi colección.', 'added to My collection.') : T('quitado de Mi colección.', 'removed from My collection.'))); } } });
    var tbl = h('table', { class: 'cn-table ex-ptable' }, h('caption', { class: 'cn-vh', text: T('Planetas de ', 'Planets of ') + starLabel(hi) }),
      h('thead', {}, h('tr', {}, [T('Planeta', 'Planet'), T('Radio (Tierra = 1)', 'Radius (Earth = 1)'), T('Masa (Tierra = 1)', 'Mass (Earth = 1)'), T('Vuelta (días)', 'Orbit (days)'), T('Distancia a la estrella (ua)', 'Distance from star (au)'), T('Temperatura (°C)', 'Temperature (°C)'), T('Método', 'Method'), T('Año', 'Year'), T('Me lo sé', 'I know it')].map(function (x) { return h('th', { scope: 'col', text: x }); }))),
      h('tbody', {}, rows.map(function (i) {
        var p = P[i];
        return h('tr', {}, h('th', { scope: 'row' }, p[0], p[12] ? h('span', { class: 'ex-nom', text: p[12] }) : null), h('td', { text: smart(p[7]) }), h('td', { text: smart(p[8]) }), h('td', { text: smart(p[5]) }),
          h('td', { text: smart(p[6]) }), h('td', { text: p[10] ? num(p[10] - 273.15) : '—' }), h('td', { text: MET[p[2]] }), h('td', { text: String(p[3]) }), h('td', {}, mineBtn(p[0])));
      })));
    box.replaceChildren(
      h('div', { class: 'ex-now-head' }, h('p', { class: 'cn-now-head', text: starLabel(hi) }), fav),
      h('p', { text: rows.length === 1 ? T('Tiene 1 planeta confirmado.', 'It has 1 confirmed planet.') : T('Tiene ' + rows.length + ' planetas confirmados.', 'It has ' + rows.length + ' confirmed planets.') }),
      h('dl', { class: 'cn-facts' }, facts.map(function (f) { return h('div', { class: 'cn-fact' }, h('dt', { text: f[0] }), h('dd', { text: f[1] })); })),
      h('figure', { class: 'ex-sysfig' }, sysd.svg, h('figcaption', { class: 'cn-note', text: T('Órbitas a escala. Los planetas no están a escala entre sí: el círculo crece con su radio. La franja verde es la zona templada aproximada.', 'Orbits to scale. The planets are not to scale with each other: the circle grows with their radius. The green band is the approximate temperate zone.') + (sysd.missing ? ' ' + T(sysd.missing + ' sin distancia conocida a la estrella.', sysd.missing + ' with no known distance from the star.') : '') })),
      h('div', { class: 'cn-table-wrap', role: 'region', 'aria-label': T('Planetas de ', 'Planets of ') + starLabel(hi), tabindex: '0' }, tbl));
  }
  function mineBtn(pl) {
    return h('button', { type: 'button', class: 'cn-open ex-sabe', 'data-pl': pl, 'aria-pressed': has('sabe', pl) ? 'true' : 'false', 'aria-label': T('Me sé ', 'I know ') + pl, text: has('sabe', pl) ? '✓' : '+',
      on: { click: function () { toggle('sabe', pl); say(pl + ': ' + (has('sabe', pl) ? T('marcado como aprendido.', 'marked as known.') : T('desmarcado.', 'unmarked.'))); } } });
  }

  /* ---------- mapa: controles ---------- */
  var ui = document.getElementById('ex-ui'), view = document.getElementById('ex-view'), labels = document.getElementById('ex-labels'), stage = document.getElementById('mapa');
  var fwBusy = false;
  function fullWidth() { if (fwBusy) return; fwBusy = true; var z = parseFloat(getComputedStyle(main).zoom) || 1, v = (document.documentElement.clientWidth / z).toFixed(2) + 'px';
    if (document.documentElement.style.getPropertyValue('--cn-vw') !== v) document.documentElement.style.setProperty('--cn-vw', v); setTimeout(function () { fwBusy = false; }, 0); }
  fullWidth(); window.addEventListener('resize', fullWidth);
  new MutationObserver(fullWidth).observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'data-ig-preferences', 'data-ig-text-enlarged'] });
  function select(i) {
    if (MAP) MAP.select(i);
    renderNow(i);
    view.setAttribute('aria-label', T('Mapa en 3D de las estrellas con planetas. ', '3D map of the stars with planets. ') + (i >= 0 ? T('Elegida: ', 'Selected: ') + starLabel(i) : T('Centrado en el Sol.', 'Centred on the Sun.')));
    if (i >= 0) say(starLabel(i) + ': ' + BYH[i].length + T(' planetas.', ' planets.'));
  }
  var filt = { m: 'all', y: 2026, q: '' };
  function applyFilters() {
    var mask = null;
    if (filt.m !== 'all') { mask = new Uint8Array(S.length); P.forEach(function (p) { if (String(p[2]) === filt.m || (filt.m === 'es' && ESF.indexOf(p[4]) > -1) || (filt.m === 'nom' && (p[12] || S[p[1]][12]))) mask[p[1]] = 1; }); }
    if (MAP) { MAP.setMask(mask); MAP.setYear(filt.y); }
    var c = 0; S.forEach(function (s, i) { if ((!mask || mask[i]) && FIRST[i] <= filt.y) c++; });
    var el = document.getElementById('ex-count'); if (el) el.textContent = num(c) + T(' estrellas en el mapa', ' stars on the map');
    return c;
  }
  var FIRST = [], ESF = [];
  var playT = null;
  function buildUI() {
    stage.classList.add('cn-live'); view.tabIndex = 0; view.setAttribute('role', 'img'); view.setAttribute('aria-label', T('Mapa en 3D de las estrellas con planetas. Centrado en el Sol.', '3D map of the stars with planets. Centred on the Sun.')); view.setAttribute('aria-describedby', 'ex-help');
    var q = h('input', { type: 'search', id: 'ex-q', autocomplete: 'off', list: 'ex-q-list', placeholder: 'TRAPPIST-1, Proxima, Kepler-186…' });
    var dl = h('datalist', { id: 'ex-q-list' }, FAMOUS.map(function (k) { var i = HI[k]; return h('option', { value: starName(i) }); }));
    function go() { var i = findStar(q.value); if (i >= 0) { select(i); } else say(T('No encuentro esa estrella. Prueba con el nombre de la estrella o del planeta.', 'I cannot find that star. Try the star’s or the planet’s name.')); }
    q.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); go(); } });
    var met = h('select', { id: 'ex-met', on: { change: function (ev) { filt.m = ev.target.value; say(num(applyFilters()) + T(' estrellas en el mapa.', ' stars on the map.')); } } },
      h('option', { value: 'all', text: T('Todas las estrellas', 'All stars') }), h('option', { value: 'es', text: T('Descubiertas desde España', 'Discovered from Spain') }), h('option', { value: 'nom', text: T('Con nombre propio', 'With a proper name') }),
      MET.map(function (m, k) { return h('option', { value: String(k), text: T('Método: ', 'Method: ') + m }); }));
    var yr = h('input', { type: 'range', id: 'ex-year', min: '1992', max: '2026', step: '1', value: '2026', on: { input: function (ev) { filt.y = +ev.target.value; yrOut.textContent = ev.target.value; applyFilters(); } } });
    var yrOut = h('output', { for: 'ex-year', class: 'ex-yr', text: '2026' });
    var play = h('button', { type: 'button', class: 'filter', 'aria-pressed': 'false', text: T('Ver cómo se descubrieron', 'Watch how they were found'), on: { click: function () {
      if (playT) { stopPlay(); return; }
      play.setAttribute('aria-pressed', 'true'); play.textContent = T('Parar', 'Stop');
      filt.y = 1992; yr.value = '1992'; yrOut.textContent = '1992'; applyFilters();
      playT = setInterval(function () { if (filt.y >= 2026) { stopPlay(); return; } filt.y++; yr.value = String(filt.y); yrOut.textContent = String(filt.y); applyFilters(); }, reduce() ? 1200 : 650);
    } } });
    function stopPlay() { clearInterval(playT); playT = null; play.setAttribute('aria-pressed', 'false'); play.textContent = T('Ver cómo se descubrieron', 'Watch how they were found'); say(T('Hasta ', 'Up to ') + filt.y + ': ' + num(applyFilters()) + T(' estrellas.', ' stars.')); }
    var scale = h('select', { id: 'ex-scale', on: { change: function (ev) { MAP.setScale(ev.target.value); note.textContent = NOTE[ev.target.value]; say(NOTE[ev.target.value]); } } },
      h('option', { value: 'comprimida', text: T('Distancia comprimida', 'Compressed distance') }), h('option', { value: 'real', text: T('Distancia real', 'True distance') }));
    var NOTE = { comprimida: T('Distancia comprimida: las estrellas lejanas se acercan para verlas todas a la vez. Las direcciones son las reales.', 'Compressed distance: far stars are brought closer so that all of them show at once. Directions are real.'),
      real: T('Distancia real: cada estrella a su distancia de verdad. Las más lejanas quedan muy lejos: acércate o elige una.', 'True distance: each star at its real distance. The farthest ones are very far: zoom in or choose one.') };
    var note = h('p', { class: 'ss-scale-note', text: NOTE.comprimida });
    function btn(t, a, fn) { return h('button', { type: 'button', class: 'filter ss-icon', 'aria-label': a, title: a, text: t, on: { click: fn } }); }
    var fs = h('button', { type: 'button', class: 'filter', text: T('Pantalla completa', 'Full screen'), on: { click: function () { if (document.fullscreenElement) document.exitFullscreen(); else if (stage.requestFullscreen) stage.requestFullscreen().catch(function () {}); } } });
    document.addEventListener('fullscreenchange', function () { fs.textContent = document.fullscreenElement ? T('Salir de pantalla completa', 'Exit full screen') : T('Pantalla completa', 'Full screen'); });
    ui.replaceChildren(
      h('div', { class: 'cn-ui-row' },
        h('label', { class: 'cn-ui-field ex-qf', for: 'ex-q' }, h('span', { text: T('Buscar una estrella o un planeta', 'Search for a star or a planet') }), q), dl,
        h('div', { class: 'filters' }, h('button', { type: 'button', class: 'filter', text: T('Buscar', 'Search'), on: { click: go } }), h('button', { type: 'button', class: 'filter', text: T('Volver al Sol', 'Back to the Sun'), on: { click: function () { MAP.home(); renderNow(-1); say(T('Centrado en el Sol.', 'Centred on the Sun.')); } } })),
        h('label', { class: 'cn-ui-field', for: 'ex-met' }, h('span', { text: T('Mostrar', 'Show') }), met),
        h('label', { class: 'cn-ui-field', for: 'ex-scale' }, h('span', { text: T('Vista', 'View') }), scale)),
      note,
      h('div', { class: 'cn-ui-row' },
        h('label', { class: 'cn-ui-field ex-yf', for: 'ex-year' }, h('span', {}, T('Descubiertas hasta el año ', 'Discovered up to the year '), yrOut), yr),
        h('div', { class: 'filters' }, play), h('span', { id: 'ex-count', class: 'ss-when' })),
      h('div', { class: 'cn-ui-row' },
        h('div', { class: 'filters', role: 'group', 'aria-label': T('Mover la vista', 'Move the view') },
          btn('←', T('Girar a la izquierda', 'Turn left'), function () { MAP.rotate(0.25, 0); }), btn('→', T('Girar a la derecha', 'Turn right'), function () { MAP.rotate(-0.25, 0); }),
          btn('↑', T('Mirar desde más arriba', 'Look from higher up'), function () { MAP.rotate(0, 0.2); }), btn('↓', T('Mirar desde más abajo', 'Look from lower down'), function () { MAP.rotate(0, -0.2); }),
          btn('+', T('Acercar', 'Zoom in'), function () { MAP.zoom(1.4); }), btn('−', T('Alejar', 'Zoom out'), function () { MAP.zoom(1 / 1.4); })),
        h('div', { class: 'filters' }, h('button', { type: 'button', class: 'filter', text: T('Guardar imagen', 'Save image'), on: { click: saveImage } }), fs)),
      h('p', { class: 'ss-help', id: 'ex-help', text: T('Con el teclado: pon el foco en el mapa y usa las flechas para girar y + y − para acercar o alejar. Para acercar con la rueda del ratón, pulsa antes en el mapa. Los círculos marcan 10, 100, 1.000 y 10.000 años luz en el plano de la Vía Láctea; la línea marrón señala hacia su centro.',
        'With the keyboard: put the focus on the map and use the arrow keys to turn and + and − to zoom. To zoom with the mouse wheel, click on the map first. The circles mark 10, 100, 1,000 and 10,000 light years in the plane of the Milky Way; the brown line points to its centre.') }));
    view.addEventListener('keydown', function (ev) {
      var k = ev.key, done = true;
      if (k === 'ArrowLeft') MAP.rotate(0.12, 0); else if (k === 'ArrowRight') MAP.rotate(-0.12, 0); else if (k === 'ArrowUp') MAP.rotate(0, 0.1); else if (k === 'ArrowDown') MAP.rotate(0, -0.1);
      else if (k === '+' || k === '=') MAP.zoom(1.25); else if (k === '-' || k === '_') MAP.zoom(0.8); else done = false;
      if (done) ev.preventDefault();
    });
    view.addEventListener('wheel', function (ev) { if (document.activeElement !== view && !document.fullscreenElement) ev.stopPropagation(); }, true);
  }
  var HI = {};
  function findStar(q) {
    var n = norm(q.trim()); if (!n) return -1;
    for (var i = 0; i < S.length; i++) if (norm(S[i][0]) === n || (S[i][12] && norm(S[i][12]) === n)) return i;
    for (var j = 0; j < P.length; j++) if (norm(P[j][0]) === n || (P[j][12] && norm(P[j][12]) === n)) return P[j][1];
    for (var m = 0; m < P.length; m++) if (norm(P[m][0]).indexOf(n + ' ') === 0) return P[m][1];
    for (var k = 0; k < S.length; k++) if (norm(S[k][0]).indexOf(n) === 0 || (S[k][12] && norm(S[k][12]).indexOf(n) === 0)) return k;
    return -1;
  }
  function saveImage() {
    if (!MAP) return;
    var src = MAP.snapshot(), w = src.width, hh = src.height, c = document.createElement('canvas'); c.width = w; c.height = hh;
    var g = c.getContext('2d'); g.drawImage(src, 0, 0); var s = Math.max(1, w / 1200), box = view.getBoundingClientRect(), kx = w / box.width, ky = hh / box.height;
    g.font = '600 ' + Math.round(13 * s) + 'px system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'top';
    Array.prototype.forEach.call(labels.children, function (el) { if (el.hidden) return; var r = el.getBoundingClientRect(); g.fillStyle = 'rgba(0,0,0,.6)'; g.fillText(el.textContent, (r.left + r.width / 2 - box.left) * kx + s, (r.top - box.top) * ky + 4 * s); g.fillStyle = '#e8eefc'; g.fillText(el.textContent, (r.left + r.width / 2 - box.left) * kx, (r.top - box.top) * ky + 3 * s); });
    var grad = g.createLinearGradient(0, hh - 90 * s, 0, hh); grad.addColorStop(0, 'rgba(0,0,0,0)'); grad.addColorStop(1, 'rgba(0,0,0,.75)'); g.fillStyle = grad; g.fillRect(0, hh - 90 * s, w, 90 * s);
    g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.fillStyle = '#fff'; g.font = '600 ' + Math.round(18 * s) + 'px system-ui, sans-serif';
    g.fillText((current >= 0 ? starLabel(current) + ' · ' : '') + T('Estrellas con planetas', 'Stars with planets') + ' · ' + T('hasta ', 'up to ') + filt.y, 18 * s, hh - 38 * s);
    g.fillStyle = '#cfd8ea'; g.font = Math.round(13 * s) + 'px system-ui, sans-serif'; g.fillText(T('Imagen hecha por ordenador con datos del NASA Exoplanet Archive. ', 'Computer image with data from the NASA Exoplanet Archive. ') + (document.getElementById('ex-scale').value === 'real' ? T('Distancia real.', 'True distance.') : T('Distancia comprimida.', 'Compressed distance.')), 18 * s, hh - 16 * s);
    g.textAlign = 'right'; g.fillStyle = '#fff'; g.font = '700 ' + Math.round(16 * s) + 'px system-ui, sans-serif'; g.fillText(MARCA, w - 18 * s, hh - 16 * s);
    c.toBlob(function (b) { if (b) { download('iris-green-' + T('exoplanetas', 'exoplanets') + '.png', b); say(T('Imagen guardada.', 'Image saved.')); } }, 'image/png');
  }

  /* ---------- todos los exoplanetas: buscador, orden y páginas ---------- */
  var all = { q: '', m: 'all', sort: 'n', dir: 1, page: 0 }, PER = 50;
  function allApp() {
    var app = document.getElementById('ex-all-app'); if (!app) return;
    var q = h('input', { type: 'search', id: 'ex-all-q', autocomplete: 'off', on: { input: function (ev) { all.q = norm(ev.target.value.trim()); all.page = 0; draw(); } } });
    var m = h('select', { id: 'ex-all-m', on: { change: function (ev) { all.m = ev.target.value; all.page = 0; draw(); } } }, h('option', { value: 'all', text: T('Todos los métodos', 'All methods') }), MET.map(function (x, k) { return h('option', { value: String(k), text: x }); }));
    var srt = h('select', { id: 'ex-all-s', on: { change: function (ev) { var v = ev.target.value.split(':'); all.sort = v[0]; all.dir = +v[1]; all.page = 0; draw(); } } },
      [['n:1', T('Nombre (A–Z)', 'Name (A–Z)')], ['y:-1', T('Más recientes', 'Newest')], ['y:1', T('Más antiguos', 'Oldest')], ['d:1', T('Más cercanos', 'Closest')], ['d:-1', T('Más lejanos', 'Farthest')], ['r:1', T('Más pequeños', 'Smallest')], ['r:-1', T('Más grandes', 'Largest')], ['P:1', T('Vuelta más corta', 'Shortest orbit')]].map(function (o) { return h('option', { value: o[0], text: o[1] }); }));
    var out = h('div', { id: 'ex-all-out' }), pager = h('div', { class: 'filters ex-pager' }), info = h('p', { class: 'cn-note', 'aria-live': 'polite' });
    app.replaceChildren(h('div', { class: 'cn-fields' }, h('label', { class: 'cn-field cn-field-wide', for: 'ex-all-q' }, h('span', { text: T('Buscar', 'Search') }), q),
      h('label', { class: 'cn-field', for: 'ex-all-m' }, h('span', { text: T('Método', 'Method') }), m), h('label', { class: 'cn-field', for: 'ex-all-s' }, h('span', { text: T('Ordenar por', 'Sort by') }), srt)), info, out, pager);
    function key(i) { var p = P[i], s = S[p[1]]; return all.sort === 'n' ? p[0].toLowerCase() : all.sort === 'y' ? p[3] : all.sort === 'd' ? (s[3] || 1e9) : all.sort === 'r' ? (p[7] || 1e9) : (p[5] || 1e12); }
    function draw() {
      var ids = [];
      for (var i = 0; i < P.length; i++) {
        var p = P[i], s = S[p[1]];
        if (all.m !== 'all' && String(p[2]) !== all.m) continue;
        if (all.q && norm(p[0]).indexOf(all.q) < 0 && norm(s[0]).indexOf(all.q) < 0 && !(p[12] && norm(p[12]).indexOf(all.q) > -1) && !(s[12] && norm(s[12]).indexOf(all.q) > -1)) continue;
        ids.push(i);
      }
      ids.sort(function (a, b) { var x = key(a), y = key(b); return (x < y ? -1 : x > y ? 1 : 0) * all.dir; });
      var pages = Math.max(1, Math.ceil(ids.length / PER)); all.page = Math.min(all.page, pages - 1);
      var slice = ids.slice(all.page * PER, all.page * PER + PER);
      info.textContent = num(ids.length) + T(' planetas', ' planets') + (ids.length ? ' · ' + T('página ', 'page ') + (all.page + 1) + T(' de ', ' of ') + pages : '');
      out.replaceChildren(h('div', { class: 'cn-table-wrap', role: 'region', 'aria-label': T('Exoplanetas encontrados', 'Exoplanets found'), tabindex: '0' },
        h('table', { class: 'cn-table ex-ptable' }, h('caption', { class: 'cn-vh', text: T('Exoplanetas encontrados', 'Exoplanets found') }),
          h('thead', {}, h('tr', {}, [T('Planeta', 'Planet'), T('Estrella', 'Star'), T('Distancia (años luz)', 'Distance (light years)'), T('Radio (Tierra = 1)', 'Radius (Earth = 1)'), T('Vuelta (días)', 'Orbit (days)'), T('Método', 'Method'), T('Año', 'Year'), T('En el mapa', 'On the map')].map(function (x) { return h('th', { scope: 'col', text: x }); }))),
          h('tbody', {}, slice.map(function (i) {
            var p = P[i], s = S[p[1]];
            return h('tr', {}, h('th', { scope: 'row' }, p[0], p[12] ? h('span', { class: 'ex-nom', text: p[12] }) : null), h('td', { text: starLabel(p[1]) }), h('td', { text: s[3] ? num(s[3] * LY, s[3] * LY < 100 ? 1 : 0) : '—' }),
              h('td', { text: smart(p[7]) }), h('td', { text: smart(p[5]) }), h('td', { text: MET[p[2]] }), h('td', { text: String(p[3]) }),
              h('td', {}, MAP ? h('button', { type: 'button', class: 'cn-open', text: T('Ver en el mapa', 'See on the map'), 'aria-label': T('Ver ', 'See ') + p[0] + T(' en el mapa', ' on the map'), on: { click: function () { select(p[1]); stage.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth' }); view.focus({ preventScroll: true }); } } }) : null));
          })))));
      pager.replaceChildren(
        h('button', { type: 'button', class: 'filter', disabled: all.page === 0, text: T('‹ Anteriores', '‹ Previous'), on: { click: function () { all.page--; draw(); info.focus && info.focus(); } } }),
        h('button', { type: 'button', class: 'filter', disabled: all.page >= pages - 1, text: T('Siguientes ›', 'Next ›'), on: { click: function () { all.page++; draw(); } } }));
    }
    draw();
  }

  /* ---------- tablas ordenables ---------- */
  function sortable(table) {
    var ths = table.querySelectorAll('thead th');
    Array.prototype.forEach.call(ths, function (th, i) {
      var label = th.textContent; if (!label) return;
      var b = h('button', { class: 'cn-sort', type: 'button' }, label);
      b.addEventListener('click', function () {
        var dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
        Array.prototype.forEach.call(ths, function (x) { x.removeAttribute('aria-sort'); }); th.setAttribute('aria-sort', dir);
        var tb = table.tBodies[0], rows = Array.prototype.slice.call(tb.rows);
        rows.sort(function (a, c) { var A = a.cells[i], C = c.cells[i], va = A.getAttribute('data-v'), vc = C.getAttribute('data-v'), r; if (va !== null && vc !== null) r = parseFloat(va) - parseFloat(vc); else r = A.textContent.localeCompare(C.textContent, EN ? 'en' : 'es'); return dir === 'ascending' ? r : -r; });
        rows.forEach(function (r) { tb.appendChild(r); });
        say(T('Ordenado por ', 'Sorted by ') + label + (dir === 'ascending' ? T(', de menor a mayor.', ', ascending.') : T(', de mayor a menor.', ', descending.')));
      });
      th.replaceChildren(b);
    });
  }

  /* ---------- Mi colección ---------- */
  function refreshMine() {
    Array.prototype.forEach.call(document.querySelectorAll('.ex-fav'), function (b) { b.setAttribute('aria-pressed', has('fav', b.getAttribute('data-host')) ? 'true' : 'false'); });
    Array.prototype.forEach.call(document.querySelectorAll('.ex-sabe'), function (b) { var k = b.getAttribute('data-pl'), on = has('sabe', k); b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.textContent = on ? '✓' : '+'; });
    var app = document.getElementById('ex-mine-app'); if (!app || !D) return;
    var favs = mine.fav.filter(function (k) { return HI[k] !== undefined; }), sabe = mine.sabe.filter(function (k) { return PI[k] !== undefined; });
    var confirm = h('div', { class: 'ss-confirm', hidden: true }, h('p', { text: T('¿Seguro? Se borra todo lo que has guardado en este navegador.', 'Are you sure? Everything you have saved in this browser will be deleted.') }),
      h('div', { class: 'filters' },
        h('button', { type: 'button', class: 'filter ss-danger', text: T('Sí, borrar mi colección', 'Yes, delete my collection'), on: { click: function () { mine = { fav: [], sabe: [] }; try { window.localStorage.removeItem(KEY); } catch (e) {} refreshMine(); say(T('Mi colección está vacía.', 'My collection is empty.')); var f = document.getElementById('ex-mine-del'); if (f) f.focus(); } } }),
        h('button', { type: 'button', class: 'filter', text: T('No, dejarla como está', 'No, keep it'), on: { click: function () { confirm.hidden = true; document.getElementById('ex-mine-del').focus(); } } })));
    var file = h('input', { type: 'file', id: 'ex-mine-file', accept: 'application/json,.json', class: 'cn-file', on: { change: function (ev) {
      var f = ev.target.files[0]; if (!f) return;
      f.text().then(function (t) { var d = JSON.parse(t); if (!d || !Array.isArray(d.fav) || !Array.isArray(d.sabe)) throw new Error('x');
        mine = { fav: d.fav.filter(function (k) { return HI[k] !== undefined; }), sabe: d.sabe.filter(function (k) { return PI[k] !== undefined; }) }; save(); refreshMine(); say(T('Colección abierta.', 'Collection opened.')); })
        .catch(function () { say(T('Ese archivo no es una colección de Iris Green.', 'That file is not an Iris Green collection.')); });
    } } });
    app.replaceChildren(
      h('div', { class: 'cn-progs' },
        h('div', { class: 'cn-prog' }, h('p', {}, h('strong', { text: num(favs.length) }), ' ' + T('sistemas favoritos', 'favourite systems'))),
        h('div', { class: 'cn-prog' }, h('p', {}, h('strong', { text: num(sabe.length) + ' / ' + num(P.length) }), ' ' + T('planetas que me sé', 'planets I know')), h('div', { class: 'cn-bar', 'aria-hidden': 'true' }, h('span', { style: 'width:' + Math.max(sabe.length / P.length * 100, sabe.length ? 0.5 : 0).toFixed(2) + '%' })))),
      h('h3', { text: T('Mis sistemas favoritos', 'My favourite systems') }),
      favs.length ? h('ul', { class: 'cn-chips' }, favs.map(function (k) { var i = HI[k]; return h('li', {}, h('button', { type: 'button', class: 'filter', text: starLabel(i), on: { click: function () { select(i); stage.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth' }); } } })); }))
        : h('p', { class: 'cn-note', text: T('Todavía ninguno. Elige una estrella en el mapa y pulsa «Sistema favorito».', 'None yet. Choose a star on the map and press “Favourite system”.') }),
      h('h3', { text: T('Planetas que me sé', 'Planets I know') }),
      sabe.length ? h('ul', { class: 'cn-chips' }, sabe.map(function (k) { return h('li', {}, h('span', { class: 'pill', text: k })); }))
        : h('p', { class: 'cn-note', text: T('Todavía ninguno. En la tabla de planetas de una estrella, pulsa «+».', 'None yet. In a star’s planet table, press “+”.') }),
      h('p', { class: 'cn-note', text: T('Se guarda en este navegador (almacenamiento local) hasta que lo borres. Iris Green no recibe nada.', 'It is kept in this browser (local storage) until you delete it. Iris Green receives nothing.') }),
      h('div', { class: 'filters cn-mine-actions' },
        h('button', { type: 'button', class: 'filter', text: T('Guardar en un archivo', 'Save to a file'), on: { click: function () {
          download(T('mi-coleccion-exoplanetas.json', 'my-exoplanet-collection.json'), new Blob([JSON.stringify({ marca: MARCA, tipo: T('Iris Green · Mi colección · Exoplanetas', 'Iris Green · My collection · Exoplanets'), fecha: new Date().toISOString().slice(0, 10), fav: mine.fav, sabe: mine.sabe }, null, 1)], { type: 'application/json' }));
          say(T('Archivo guardado.', 'File saved.')); } } }),
        h('label', { class: 'filter cn-file-label', for: 'ex-mine-file' }, file, h('span', { text: T('Abrir un archivo', 'Open a file') })),
        h('button', { type: 'button', class: 'filter', id: 'ex-mine-del', text: T('Borrar mi colección', 'Delete my collection'), on: { click: function () { confirm.hidden = false; confirm.querySelector('button').focus(); } } })),
      confirm);
  }
  var PI = {};

  /* ---------- fichas de sistemas: botones ---------- */
  function fichaTools() {
    Array.prototype.forEach.call(document.querySelectorAll('.ex-ficha-tools'), function (box) {
      var i = +box.getAttribute('data-host'), s = S[i];
      var kids = [];
      if (MAP) kids.push(h('button', { type: 'button', class: 'filter', text: T('Verlo en el mapa', 'See it on the map'), on: { click: function () { select(i); stage.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth' }); view.focus({ preventScroll: true }); } } }));
      kids.push(h('button', { type: 'button', class: 'cn-open ex-fav', 'data-host': s[0], 'aria-pressed': has('fav', s[0]) ? 'true' : 'false', text: T('Sistema favorito', 'Favourite system'), on: { click: function () { toggle('fav', s[0]); } } }));
      box.replaceChildren.apply(box, kids);
    });
  }

  /* ---------- arranque ---------- */
  function start(d) {
    D = d; S = d.estrellas; P = d.planetas;
    S.forEach(function (s, i) { HI[s[0]] = i; BYH[i] = []; FIRST[i] = 9999; });
    P.forEach(function (p, i) { PI[p[0]] = i; BYH[p[1]].push(i); if (p[3] < FIRST[p[1]]) FIRST[p[1]] = p[3]; });
    d.instalaciones.forEach(function (f, k) { if (/Calar Alto|Roque de los Muchachos|Teide/.test(f)) ESF.push(k); });
    ['ex-names', 'ex-eye'].forEach(function (id) { var t = document.getElementById(id); if (t) sortable(t); });
    Array.prototype.forEach.call(document.querySelectorAll('#espana .ex-ptable, .ex-ficha .ex-ptable, .ex-met-table'), sortable);
    allApp(); refreshMine(); renderNow(-1);
    var launch = h('button', { type: 'button', class: 'filter', text: T('Abrir vista interactiva', 'Open interactive view') });
    ui.replaceChildren(launch);
    var prompt = view.querySelector('.cn-stage-nojs');
    if (prompt) prompt.textContent = T('Abre la vista interactiva cuando quieras. Las fichas y tablas ya están disponibles.', 'Open the interactive view whenever you want. Entries and tables are already available.');
    launch.addEventListener('click', function () {
      launch.disabled = true;
      launch.textContent = T('Cargando vista…', 'Loading view…');
      var script = document.createElement('script');
      script.src = '/assets/ig-exoplanetas-3d.js';
      script.onload = function () {
      var canGL = (function () { try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; } })();
    if (window.IGExoplanetas3D && canGL) {
      buildUI();
      D.fondo = FONDO;
      MAP = window.IGExoplanetas3D.start(D, { T: T, host: view, labels: labels, reduce: reduce, famous: FAMOUS.map(function (k) { return HI[k]; }).filter(function (i) { return i !== undefined; }),
        starName: starName, select: select, fail: fail, ringText: function (ly) { return num(ly) + T(' años luz', ' light years'); } });
      if (MAP) applyFilters();
    } else fail();

        if (stage.classList.contains('cn-live')) {
          var poster = view.querySelector('.ig-scene-poster'); if (poster) poster.remove();
          view.focus({ preventScroll: true });
        } else { launch.hidden = true; }
      };
      script.onerror = function () {
        launch.disabled = false; launch.textContent = T('Volver a cargar la vista', 'Try loading the view again');
        if (prompt) prompt.textContent = T('No se pudo cargar la vista. Puedes volver a intentarlo o leer las fichas.', 'The view could not load. You can try again or read the entries.');
        script.remove();
      };
      document.head.appendChild(script);
    });
    fichaTools(); refreshMine();
    if (location.hash && document.getElementById(location.hash.slice(1))) setTimeout(function () { document.getElementById(location.hash.slice(1)).scrollIntoView(); }, 0);
  }
  function fail() {
    stage.classList.remove('cn-live');
    var p = view.querySelector('.cn-stage-nojs'); if (p) p.textContent = T('Tu navegador no puede mostrar el mapa en 3D (necesita WebGL). Todos los datos están más abajo.', 'Your browser cannot show the 3D map (it needs WebGL). All the data are further down.');
  }
  Promise.all([
    fetch('/es/intereses/exoplanetas/exoplanetas.json', { credentials: 'same-origin' }).then(function (r) { return r.json(); }),
    fetch('/es/intereses/sistema-solar/cielo-fondo.json', { credentials: 'same-origin' }).then(function (r) { return r.json(); }).catch(function () { return null; })
  ]).then(function (res) { FONDO = res[1]; start(res[0]); }).catch(function () {
    var p = view && view.querySelector('.cn-stage-nojs'); if (p) p.textContent = T('No se han podido cargar los datos. Las tablas de abajo siguen disponibles.', 'The data could not be loaded. The tables below are still available.');
  });
})();
