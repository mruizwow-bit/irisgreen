/* Iris Green · Tus intereses · Planetas y sistema solar.
   Controles de la vista en 3D, «Dónde están hoy», comparador de tamaños, tabla ordenable y Mi colección.
   Datos: NASA, JPL, IAU y Minor Planet Center (ver «Fuentes y créditos»). Sin red externa y sin evaluar código.
   Mi colección se guarda solo en este navegador (localStorage) y se puede borrar o guardar en un archivo. */
(function () {
  'use strict';
  var main = document.querySelector('main.ss'); if (!main) return;
  var EN = main.getAttribute('data-lang') === 'en';
  var T = function (es, en) { return EN ? en : es; };
  var KEY = 'ig-sistema-solar-coleccion';
  var MARCA = 'IRIS GREEN · irisgreen.eu';
  var R = Math.PI / 180, AU = 149597870.7;
  var D, BY = {}, MOONS = {}, FONDO = null, VIEW = null;
  var reduce = function () { return (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || document.documentElement.getAttribute('data-ig-motion') === 'off' || document.documentElement.getAttribute('data-ig-system-motion') === 'reduce'; };

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
  function thousands(s) { return s.replace(/\B(?=(\d{3})+(?!\d))/g, EN ? ',' : '.'); }
  function num(x, d) {
    if (x === null || x === undefined || isNaN(x)) return '—';
    var s = Math.abs(x).toFixed(d || 0), p = s.split('.');
    return (x < 0 ? '−' : '') + thousands(p[0]) + (p[1] ? (EN ? '.' : ',') + p[1] : '');
  }
  function say(msg) { var s = document.getElementById('cn-status'); if (!s) return; s.textContent = ''; setTimeout(function () { s.textContent = msg; }, 30); }
  function nameOf(id) { if (BY[id]) return BY[id][EN ? 'en' : 'es'].nombre; var m = MOONS[id]; return m ? (EN ? m.en : m.es) : id; }
  function fmtDate(d) { return d.toLocaleDateString(EN ? 'en-GB' : 'es-ES', { day: 'numeric', month: 'long', year: 'numeric' }); }
  function fmtTime(d) { return d.toLocaleTimeString(EN ? 'en-GB' : 'es-ES', { hour: '2-digit', minute: '2-digit' }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function isoDate(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function isoTime(d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function download(name, blob) { var a = h('a', { href: URL.createObjectURL(blob), download: name }); document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); }

  /* ---------- astronomía (la misma que la vista en 3D) ---------- */
  function mod(x, m) { return ((x % m) + m) % m; }
  function jd(date) { return date.getTime() / 86400000 + 2440587.5; }
  function rotOrbit(xp, yp, I, Om, w) {
    var cw = Math.cos(w), sw = Math.sin(w), cO = Math.cos(Om), sO = Math.sin(Om), cI = Math.cos(I), sI = Math.sin(I);
    return [(cw * cO - sw * sO * cI) * xp + (-sw * cO - cw * sO * cI) * yp, (cw * sO + sw * cO * cI) * xp + (-sw * sO + cw * cO * cI) * yp, (sw * sI) * xp + (cw * sI) * yp];
  }
  function orbitXYZ(a, e, I, Om, w, M) {
    var E = M + e * Math.sin(M);
    for (var i = 0; i < 12; i++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    return rotOrbit(a * (Math.cos(E) - e), a * Math.sqrt(1 - e * e) * Math.sin(E), I, Om, w);
  }
  function helio(c, date) {
    var J = jd(date), T_ = (J - 2451545) / 36525;
    if (c.el) {
      var el = c.el, a = el[0] + el[1] * T_, e = el[2] + el[3] * T_, I = (el[4] + el[5] * T_) * R, L = el[6] + el[7] * T_, vp = el[8] + el[9] * T_, Om = (el[10] + el[11] * T_) * R;
      return orbitXYZ(a, e, I, Om, (vp - Om / R) * R, (mod(L - vp + 180, 360) - 180) * R);
    }
    var o = c.orbita_mpc; if (!o) return [0, 0, 0];
    return orbitXYZ(o.a, o.e, o.i * R, o.node * R, o.peri * R, (o.M + o.n * (J - o.epoca_jd)) * R);
  }
  function moonGeo(date) {
    var T_ = (jd(date) - 2451545) / 36525;
    var lam = 218.32 + 481267.881 * T_ + 6.29 * Math.sin((135.0 + 477198.87 * T_) * R) - 1.27 * Math.sin((259.3 - 413335.36 * T_) * R) + 0.66 * Math.sin((235.7 + 890534.22 * T_) * R)
      + 0.21 * Math.sin((269.9 + 954397.74 * T_) * R) - 0.19 * Math.sin((357.5 + 35999.05 * T_) * R) - 0.11 * Math.sin((186.5 + 966404.03 * T_) * R);
    var bet = 5.13 * Math.sin((93.3 + 483202.02 * T_) * R) + 0.28 * Math.sin((228.2 + 960400.89 * T_) * R) - 0.28 * Math.sin((318.3 + 6003.15 * T_) * R) - 0.17 * Math.sin((217.6 - 407332.21 * T_) * R);
    var dist = 385001 - 20905 * Math.cos((134.963 + 477198.8676 * T_) * R), cb = Math.cos(bet * R);
    return { v: [cb * Math.cos(lam * R), cb * Math.sin(lam * R), Math.sin(bet * R)], lam: lam, km: dist };
  }
  var EPS = 23.43928 * R;
  function eclToRaDec(v) {
    var x = v[0], y = v[1] * Math.cos(EPS) - v[2] * Math.sin(EPS), z = v[1] * Math.sin(EPS) + v[2] * Math.cos(EPS), r = Math.hypot(x, y, z);
    return { ra: mod(Math.atan2(y, x) / R / 15, 24), dec: Math.asin(z / r) / R };
  }
  /* constelación de un punto (límites oficiales de la IAU, mismos datos que Cielo nocturno) */
  function rel(v, ra) { return ((v - ra + 36) % 24) - 12; }
  function inRing(ra, dec, ring) {
    var n = ring.length, sum = 0, i, j;
    for (i = 0; i < n; i++) { var d = ring[(i + 1) % n][0] - ring[i][0]; if (d > 12) d -= 24; if (d < -12) d += 24; sum += d; }
    if (Math.abs(sum) > 12) {
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
      if (Math.abs(xi - xj) > 12) return false;
      if (((yi > dec) !== (yj > dec)) && (0 < (xj - xi) * (dec - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  }
  function conAt(ra, dec) {
    if (!FONDO) return null;
    var L = FONDO.limites;
    for (var k in L) { for (var r = 0; r < L[k].length; r++) if (inRing(ra, dec, L[k][r])) return FONDO.nombres[k][EN ? 1 : 0]; }
    return null;
  }

  /* ---------- Mi colección (localStorage, solo en este navegador) ---------- */
  function load() { try { var v = window.localStorage.getItem(KEY); if (v) { var d = JSON.parse(v); if (d && d.visto && d.sabe) return d; } } catch (e) {} return { visto: [], sabe: [] }; }
  var mine = load();
  function save() { try { window.localStorage.setItem(KEY, JSON.stringify(mine)); } catch (e) {} }
  function has(list, k) { return mine[list].indexOf(k) > -1; }
  function toggle(list, k) { if (has(list, k)) mine[list] = mine[list].filter(function (x) { return x !== k; }); else mine[list].push(k); save(); refreshMine(); }

  /* ---------- escenario en 3D ---------- */
  var stage = document.getElementById('sistema'), view = document.getElementById('ss-view'), ui = document.getElementById('ss-ui'), labels = document.getElementById('ss-labels');
  var fwBusy = false;
  function fullWidth() {   // ancho de la ventana en las unidades de <main> (Lectura puede ampliar <main> con zoom)
    if (fwBusy) return; fwBusy = true;
    var z = parseFloat(getComputedStyle(main).zoom) || 1;
    var v = (document.documentElement.clientWidth / z).toFixed(2) + 'px'; if (document.documentElement.style.getPropertyValue('--cn-vw') !== v) document.documentElement.style.setProperty('--cn-vw', v);
    setTimeout(function () { fwBusy = false; }, 0);
  }
  fullWidth(); window.addEventListener('resize', fullWidth);
  new MutationObserver(fullWidth).observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'data-ig-preferences', 'data-ig-text-enlarged'] });

  var ui_ = {};
  var SPEEDS = [[3600, T('1 hora por segundo', '1 hour per second')], [86400, T('1 día por segundo', '1 day per second')], [604800, T('1 semana por segundo', '1 week per second')],
    [2629800, T('1 mes por segundo', '1 month per second')], [31557600, T('1 año por segundo', '1 year per second')]];
  var ORDER = ['interior', 'sistema', 'exterior', 'sol', 'mercurio', 'venus', 'tierra', 'luna', 'marte', 'fobos', 'deimos', 'ceres', 'jupiter', 'io', 'europa', 'ganimedes', 'calisto',
    'saturno', 'mimas', 'encelado', 'tetis', 'dione', 'rea', 'titan', 'japeto', 'urano', 'miranda', 'ariel', 'umbriel', 'titania', 'oberon', 'neptuno', 'triton', 'pluton', 'caronte', 'haumea', 'makemake', 'eris'];
  var VIEWS = { interior: T('Los planetas interiores', 'The inner planets'), sistema: T('Hasta Júpiter y Saturno', 'Out to Jupiter and Saturn'), exterior: T('Todo el sistema solar', 'The whole Solar System') };
  function label(o) {
    var el = h('span', { class: 'ss-lbl' + (o.kind === 'luna' ? ' ss-lbl-moon' : '') + (o.kind === 'enano' ? ' ss-lbl-dwarf' : ''), text: nameOf(o.id) });
    el.hidden = true;
    el.addEventListener('click', function () { VIEW && VIEW.goTo(o.id); });
    labels.appendChild(el);
    return el;
  }
  function describe(id) {
    if (VIEWS[id]) return VIEWS[id];
    return nameOf(id);
  }
  function onFocus(id) {
    if (ui_.go) ui_.go.value = id;
    var date = VIEW ? VIEW.getDate() : new Date();
    view.setAttribute('aria-label', T('Vista en 3D del sistema solar: ', '3D view of the Solar System: ') + describe(id) + ', ' + fmtDate(date) + '.');
    renderNow(id);
    say(describe(id));
  }
  var lastNow = 0;
  function onTime(date, playing) {
    var t = Date.now();
    if (playing && t - lastNow < 400) return;
    lastNow = t;
    if (ui_.date) { ui_.date.value = isoDate(date); ui_.time.value = isoTime(date); }
    if (ui_.when) ui_.when.textContent = fmtDate(date) + ' · ' + fmtTime(date);
    if (!playing) { renderHoy(date); if (VIEW) renderNow(VIEW.focus()); }
  }
  function fail() {
    stage.classList.remove('cn-live');
    var p = view.querySelector('.cn-stage-nojs'); if (p) p.textContent = T('Tu navegador no puede mostrar la vista en 3D (necesita WebGL). Todas las fichas y los datos están más abajo.', 'Your browser cannot show the 3D view (it needs WebGL). All the entries and data are further down.');
  }

  function buildUI() {
    stage.classList.add('cn-live');
    view.tabIndex = 0; view.setAttribute('role', 'img');
    view.setAttribute('aria-describedby', 'ss-help');
    var go = h('select', { id: 'ss-go', on: { change: function (ev) { VIEW.goTo(ev.target.value); } } },
      h('optgroup', { label: T('Vistas', 'Views') }, ['interior', 'sistema', 'exterior'].map(function (k) { return h('option', { value: k, text: VIEWS[k] }); })),
      h('optgroup', { label: T('El Sol y los planetas', 'The Sun and the planets') }, ['sol', 'mercurio', 'venus', 'tierra', 'marte', 'jupiter', 'saturno', 'urano', 'neptuno'].map(function (k) { return h('option', { value: k, text: nameOf(k) }); })),
      h('optgroup', { label: T('Planetas enanos', 'Dwarf planets') }, ['ceres', 'pluton', 'haumea', 'makemake', 'eris'].map(function (k) { return h('option', { value: k, text: nameOf(k) }); })),
      h('optgroup', { label: T('Lunas', 'Moons') }, ORDER.filter(function (k) { return MOONS[k]; }).map(function (k) { return h('option', { value: k, text: nameOf(k) + ' · ' + nameOf(MOONS[k].planeta) }); })));
    ui_.go = go;
    function step(dir) { var i = ORDER.indexOf(VIEW.focus()); i = (i + dir + ORDER.length) % ORDER.length; VIEW.goTo(ORDER[i]); }
    var date = h('input', { type: 'date', id: 'ss-date', min: '1800-01-01', max: '2050-12-31', on: { change: setDateFromInputs } });
    var time = h('input', { type: 'time', id: 'ss-time', on: { change: setDateFromInputs } });
    ui_.date = date; ui_.time = time;
    function setDateFromInputs() {
      if (!date.value) return;
      var p = date.value.split('-'), q = (time.value || '22:00').split(':');
      var d = new Date(+p[0], +p[1] - 1, +p[2], +q[0], +q[1]);
      if (isNaN(d)) return;
      VIEW.setDate(d); onTime(d, false); say(fmtDate(d) + ', ' + fmtTime(d));
    }
    var speed = h('select', { id: 'ss-speed' }, SPEEDS.map(function (s, i) { return h('option', { value: String(s[0]), text: s[1], selected: i === 1 }); }));
    var back = null;
    var play = h('button', { type: 'button', class: 'filter', 'aria-pressed': 'false', text: T('Avanzar el tiempo', 'Move time forward'), on: { click: function () {
      var on = play.getAttribute('aria-pressed') !== 'true'; setPlay(on);
    } } });
    function setPlay(on) {
      play.setAttribute('aria-pressed', on ? 'true' : 'false');
      play.textContent = on ? T('Parar el tiempo', 'Stop time') : T('Avanzar el tiempo', 'Move time forward');
      VIEW.setPlay(on ? (+speed.value) * (back && back.checked ? -1 : 1) : 0);
      if (!on) onTime(VIEW.getDate(), false);
      say(on ? T('El tiempo avanza.', 'Time is moving.') : T('Tiempo parado: ', 'Time stopped: ') + fmtDate(VIEW.getDate()));
    }
    speed.addEventListener('change', function () { if (play.getAttribute('aria-pressed') === 'true') setPlay(true); });
    var now = h('button', { type: 'button', class: 'filter', text: T('Ahora', 'Now'), on: { click: function () { var d = new Date(); VIEW.setDate(d); onTime(d, false); say(T('Ahora: ', 'Now: ') + fmtDate(d) + ', ' + fmtTime(d)); } } });
    var scale = h('select', { id: 'ss-scale', on: { change: function (ev) { VIEW.setScale(ev.target.value); scaleNote.textContent = SCALE_NOTE[ev.target.value]; say(SCALE_NOTE[ev.target.value]); } } },
      h('option', { value: 'clara', text: T('Para verlo todo', 'To see everything') }), h('option', { value: 'real', text: T('Escala real', 'True scale') }));
    var SCALE_NOTE = { clara: T('Tamaños y distancias ajustados para que se vea todo: no están a escala.', 'Sizes and distances adjusted so that everything shows: they are not to scale.'),
      real: T('Escala real: tamaños y distancias en la misma proporción. De lejos, los planetas son puntos: elige uno para acercarte.', 'True scale: sizes and distances in the same proportion. From afar the planets are dots: choose one to go close.') };
    var scaleNote = h('p', { class: 'ss-scale-note', text: SCALE_NOTE.clara });
    function check(id, text, on, fn) { var i = h('input', { type: 'checkbox', id: id, checked: on, on: { change: function () { fn(i.checked); } } }); return h('label', { class: 'cn-check ss-check', for: id }, i, h('span', { text: text })); }
    function btn(text, aria, fn) { return h('button', { type: 'button', class: 'filter ss-icon', 'aria-label': aria, title: aria, text: text, on: { click: fn } }); }
    var fs = h('button', { type: 'button', class: 'filter', text: T('Pantalla completa', 'Full screen'), on: { click: function () {
      if (document.fullscreenElement) document.exitFullscreen(); else if (stage.requestFullscreen) stage.requestFullscreen().catch(function () {});
    } } });
    document.addEventListener('fullscreenchange', function () { fs.textContent = document.fullscreenElement ? T('Salir de pantalla completa', 'Exit full screen') : T('Pantalla completa', 'Full screen'); });
    var shot = h('button', { type: 'button', class: 'filter', text: T('Guardar imagen', 'Save image'), on: { click: saveImage } });
    ui_.when = h('span', { class: 'ss-when' });
    ui.replaceChildren(
      h('div', { class: 'cn-ui-row' },
        h('label', { class: 'cn-ui-field', for: 'ss-go' }, h('span', { text: T('Ir a', 'Go to') }), go),
        h('div', { class: 'filters' }, btn('‹', T('Anterior', 'Previous'), function () { step(-1); }), btn('›', T('Siguiente', 'Next'), function () { step(1); })),
        h('label', { class: 'cn-ui-field', for: 'ss-scale' }, h('span', { text: T('Vista', 'View') }), scale),
        h('div', { class: 'filters' }, check('ss-orb', T('Órbitas', 'Orbits'), true, function (v) { VIEW.setOrbits(v); }), check('ss-names', T('Nombres', 'Names'), true, function (v) { VIEW.setNames(v); }))),
      scaleNote,
      h('div', { class: 'cn-ui-row' },
        h('label', { class: 'cn-ui-field', for: 'ss-date' }, h('span', { text: T('Fecha', 'Date') }), date),
        h('label', { class: 'cn-ui-field', for: 'ss-time' }, h('span', { text: T('Hora', 'Time') }), time),
        h('div', { class: 'filters' }, now, play),
        h('label', { class: 'cn-ui-field', for: 'ss-speed' }, h('span', { text: T('Velocidad', 'Speed') }), speed),
        h('div', { class: 'filters' }, check('ss-back', T('Hacia atrás', 'Backwards'), false, function () { if (play.getAttribute('aria-pressed') === 'true') setPlay(true); }))),
      h('div', { class: 'cn-ui-row' },
        h('div', { class: 'filters', role: 'group', 'aria-label': T('Mover la vista', 'Move the view') },
          btn('←', T('Girar a la izquierda', 'Turn left'), function () { VIEW.rotate(0.25, 0); }), btn('→', T('Girar a la derecha', 'Turn right'), function () { VIEW.rotate(-0.25, 0); }),
          btn('↑', T('Mirar desde más arriba', 'Look from higher up'), function () { VIEW.rotate(0, 0.2); }), btn('↓', T('Mirar desde más abajo', 'Look from lower down'), function () { VIEW.rotate(0, -0.2); }),
          btn('+', T('Acercar', 'Zoom in'), function () { VIEW.zoom(1.4); }), btn('−', T('Alejar', 'Zoom out'), function () { VIEW.zoom(1 / 1.4); })),
        h('div', { class: 'filters' }, shot, fs)),
      h('p', { class: 'ss-help', id: 'ss-help', text: T('Con el teclado: pon el foco en la vista y usa las flechas para girar, + y − para acercar o alejar, y Av Pág y Re Pág para pasar de un cuerpo a otro. Para acercar con la rueda del ratón, pulsa antes en la vista. Nada se mueve solo: el tiempo solo avanza si pulsas «Avanzar el tiempo».',
        'With the keyboard: put the focus on the view and use the arrow keys to turn, + and − to zoom, and Page Down and Page Up to move from one body to the next. To zoom with the mouse wheel, click on the view first. Nothing moves by itself: time only moves if you press “Move time forward”.') }));
    back = document.getElementById('ss-back');
    view.addEventListener('keydown', function (ev) {
      var k = ev.key, done = true;
      if (k === 'ArrowLeft') VIEW.rotate(0.12, 0); else if (k === 'ArrowRight') VIEW.rotate(-0.12, 0);
      else if (k === 'ArrowUp') VIEW.rotate(0, 0.1); else if (k === 'ArrowDown') VIEW.rotate(0, -0.1);
      else if (k === '+' || k === '=') VIEW.zoom(1.25); else if (k === '-' || k === '_') VIEW.zoom(0.8);
      else if (k === 'PageDown') step(1); else if (k === 'PageUp') step(-1);
      else done = false;
      if (done) ev.preventDefault();
    });
    // la vista no captura la rueda del ratón si no está en foco (para no atrapar el desplazamiento de la página)
    view.addEventListener('wheel', function (ev) { if (document.activeElement !== view && !document.fullscreenElement) ev.stopPropagation(); }, true);
  }

  /* imagen con marca de agua */
  function saveImage() {
    if (!VIEW) return;
    var src = VIEW.snapshot(), w = src.width, hh = src.height;
    var c = document.createElement('canvas'); c.width = w; c.height = hh;
    var g = c.getContext('2d'); g.drawImage(src, 0, 0);
    var s = Math.max(1, w / 1200), pad_ = 18 * s;
    // nombres visibles en la imagen
    var box = view.getBoundingClientRect(), kx = w / box.width, ky = hh / box.height;
    g.font = (600 * 1) + ' ' + Math.round(13 * s) + 'px system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'top';
    Array.prototype.forEach.call(labels.children, function (el) {
      if (el.hidden) return;
      var r = el.getBoundingClientRect(); g.fillStyle = 'rgba(0,0,0,.6)'; g.fillText(el.textContent, (r.left + r.width / 2 - box.left) * kx + s, (r.top - box.top) * ky + 3 * s + s);
      g.fillStyle = '#e8eefc'; g.fillText(el.textContent, (r.left + r.width / 2 - box.left) * kx, (r.top - box.top) * ky + 3 * s);
    });
    var d = VIEW.getDate(), cap1 = describe(VIEW.focus()) + ' · ' + fmtDate(d) + ' · ' + fmtTime(d);
    var cap2 = T('Imagen hecha por ordenador, no es una fotografía. ', 'Computer image, not a photograph. ') + (document.getElementById('ss-scale').value === 'real' ? T('Escala real.', 'True scale.') : T('Tamaños y distancias no están a escala.', 'Sizes and distances are not to scale.'));
    g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    var grad = g.createLinearGradient(0, hh - 90 * s, 0, hh); grad.addColorStop(0, 'rgba(0,0,0,0)'); grad.addColorStop(1, 'rgba(0,0,0,.75)');
    g.fillStyle = grad; g.fillRect(0, hh - 90 * s, w, 90 * s);
    g.fillStyle = '#ffffff'; g.font = '600 ' + Math.round(18 * s) + 'px system-ui, sans-serif'; g.fillText(cap1, pad_, hh - 38 * s);
    g.fillStyle = '#cfd8ea'; g.font = Math.round(13 * s) + 'px system-ui, sans-serif'; g.fillText(cap2, pad_, hh - 16 * s);
    g.textAlign = 'right'; g.fillStyle = '#ffffff'; g.font = '700 ' + Math.round(16 * s) + 'px system-ui, sans-serif'; g.fillText(MARCA, w - pad_, hh - 16 * s);
    c.toBlob(function (b) { if (b) { download('iris-green-' + T('sistema-solar', 'solar-system') + '-' + VIEW.focus() + '-' + isoDate(d) + '.png', b); say(T('Imagen guardada.', 'Image saved.')); } }, 'image/png');
  }

  /* ---------- Qué estás viendo ---------- */
  function distances(id, date) {
    var c = BY[id]; if (!c || id === 'sol') return null;
    var p = helio(c, date), e = helio(BY.tierra, date);
    return { sol: Math.hypot(p[0], p[1], p[2]), tierra: id === 'tierra' ? 0 : Math.hypot(p[0] - e[0], p[1] - e[1], p[2] - e[2]) };
  }
  function renderNow(id) {
    var box = document.getElementById('ss-now'); if (!box) return;
    var date = VIEW ? VIEW.getDate() : new Date();
    if (VIEWS[id]) {
      box.replaceChildren(h('p', { class: 'cn-now-head', text: VIEWS[id] }),
        h('p', { class: 'cn-note', text: T('Elige un planeta, un planeta enano o una luna en «Ir a», o púlsalo en la vista.', 'Choose a planet, a dwarf planet or a moon in “Go to”, or press it in the view.') }));
      return;
    }
    var c = BY[id], m = MOONS[id], kids = [];
    if (c) {
      var x = c[EN ? 'en' : 'es'], d = distances(id, date);
      kids.push(h('p', { class: 'cn-now-head' }, x.nombre + ' · ' + x.tipo.toLowerCase()), h('p', { text: x.resumen }));
      var facts = [[T('Diámetro', 'Diameter'), num(c.datos.diametro) + ' km']];
      if (d) { facts.push([T('Distancia al Sol hoy', 'Distance from the Sun today'), num(d.sol * AU / 1e6, 1) + T(' millones de km', ' million km')]); if (id !== 'tierra') facts.push([T('Distancia a la Tierra hoy', 'Distance from the Earth today'), num(d.tierra * AU / 1e6, 1) + T(' millones de km · la luz tarda ', ' million km · light takes ') + lightTime(d.tierra)]); }
      if (id !== 'sol') facts.push([T('Lunas conocidas', 'Known moons'), num(c.lunas)]);
      kids.push(h('dl', { class: 'cn-facts' }, facts.map(function (f) { return h('div', { class: 'cn-fact' }, h('dt', { text: f[0] }), h('dd', { text: f[1] })); })));
      kids.push(h('p', {}, h('a', { href: '#' + id, text: T('Ver la ficha completa', 'See the full entry') })));
    } else if (m) {
      kids.push(h('p', { class: 'cn-now-head' }, (EN ? m.en : m.es) + ' · ' + T('luna de ', 'moon of ') + (m.planeta === 'tierra' ? T('la Tierra', 'the Earth') : nameOf(m.planeta))));
      if (m['texto_' + (EN ? 'en' : 'es')]) kids.push(h('p', { text: m['texto_' + (EN ? 'en' : 'es')] }));
      var f2 = [];
      if (m.radio) f2.push([T('Diámetro', 'Diameter'), num(m.radio * 2) + ' km']);
      if (m.a) f2.push([T('Distancia a su planeta', 'Distance from its planet'), num(m.a) + ' km']);
      if (m.periodo) f2.push([T('Vuelta a su planeta', 'Once round its planet'), num(m.periodo, 2) + T(' días', ' days')]);
      if (m.descubierta) f2.push([T('Descubierta', 'Discovered'), m.descubierta + (m.descubridor ? ' · ' + m.descubridor : '')]);
      if (id === 'luna') { var g = moonGeo(date); f2.push([T('Distancia a la Tierra hoy', 'Distance from the Earth today'), num(g.km) + ' km']); }
      kids.push(h('dl', { class: 'cn-facts' }, f2.map(function (f) { return h('div', { class: 'cn-fact' }, h('dt', { text: f[0] }), h('dd', { text: f[1] })); })));
      if (id !== 'luna') kids.push(h('p', { class: 'cn-note', text: T('Su posición en la órbita es aproximada: la distancia y el periodo son los reales.', 'Its position along the orbit is approximate: the distance and period are real.') }));
      kids.push(h('p', {}, h('a', { href: '#luna-' + id, text: T('Verla en la tabla de lunas', 'See it in the moons table') })));
    }
    box.replaceChildren.apply(box, kids);
  }
  function lightTime(au) {
    var s = au * AU / 299792.458;
    if (s < 60) return num(s, 1) + ' s';
    if (s < 3600) return num(Math.floor(s / 60)) + ' min ' + num(Math.round(s % 60)) + ' s';
    return num(Math.floor(s / 3600)) + ' h ' + num(Math.round((s % 3600) / 60)) + ' min';
  }

  /* ---------- Dónde están hoy ---------- */
  var SEE = {
    mercurio: 'eye', venus: 'eye', marte: 'eye', jupiter: 'eye', saturno: 'eye', urano: 'bino', neptuno: 'tele', ceres: 'bino', pluton: 'big', haumea: 'big', makemake: 'big', eris: 'big'
  };
  function visibility(id, date) {
    var p = helio(BY[id], date), e = helio(BY.tierra, date), g = [p[0] - e[0], p[1] - e[1], p[2] - e[2]], s = [-e[0], -e[1], -e[2]];
    var elong = Math.acos((g[0] * s[0] + g[1] * s[1] + g[2] * s[2]) / Math.hypot(g[0], g[1], g[2]) / Math.hypot(s[0], s[1], s[2])) / R;
    var lamP = Math.atan2(g[1], g[0]) / R, lamS = Math.atan2(s[1], s[0]) / R, east = mod(lamP - lamS, 360) < 180;
    var how = SEE[id], txt;
    if (elong < 15) txt = T('No se ve: está casi detrás del Sol.', 'Not visible: it is almost behind the Sun.');
    else if (id === 'mercurio' || id === 'venus') txt = east ? T('Al anochecer, bajo por el oeste.', 'At dusk, low in the west.') : T('Al amanecer, bajo por el este.', 'At dawn, low in the east.');
    else if (elong > 150) txt = T('Toda la noche.', 'All night.');
    else if (east) txt = T('Al anochecer y en la primera parte de la noche.', 'At dusk and in the first part of the night.');
    else txt = T('En la segunda parte de la noche y al amanecer.', 'In the second part of the night and at dawn.');
    if (id === 'mercurio' && elong >= 15 && elong < 18) txt += T(' Difícil: muy cerca del horizonte.', ' Hard: very close to the horizon.');
    var inst = { eye: T('A simple vista', 'Naked eye'), bino: T('Con prismáticos', 'With binoculars'), tele: T('Con telescopio', 'With a telescope'), big: T('Solo con telescopios grandes', 'Only with large telescopes') }[how];
    return { elong: elong, txt: txt, inst: inst, rd: eclToRaDec(g), dist: Math.hypot(g[0], g[1], g[2]), sol: Math.hypot(p[0], p[1], p[2]) };
  }
  function renderHoy(date) {
    var app = document.getElementById('ss-hoy-app'); if (!app || !D) return;
    var ids = ['mercurio', 'venus', 'marte', 'jupiter', 'saturno', 'urano', 'neptuno', 'ceres', 'pluton', 'haumea', 'makemake', 'eris'];
    var head = [T('Cuerpo', 'Body'), T('Distancia al Sol (ua)', 'Distance from the Sun (au)'), T('Distancia a la Tierra (millones de km)', 'Distance from the Earth (million km)'), T('La luz tarda', 'Light takes'),
      T('Constelación', 'Constellation'), T('Separación del Sol', 'Angle from the Sun'), T('Cuándo se ve (desde España)', 'When you can see it (from Spain)'), T('Cómo', 'How')];
    var rows = ids.map(function (id) {
      var v = visibility(id, date), con = conAt(v.rd.ra, v.rd.dec);
      return h('tr', {}, h('th', { scope: 'row' }, h('a', { href: '#' + id, text: nameOf(id) })), h('td', { 'data-v': v.sol, text: num(v.sol, 2) }), h('td', { 'data-v': v.dist, text: num(v.dist * AU / 1e6, 1) }),
        h('td', { text: lightTime(v.dist) }), h('td', { text: con || '—' }), h('td', { 'data-v': v.elong, text: num(v.elong) + '°' }), h('td', { text: v.txt }), h('td', { text: v.inst }));
    });
    var mg = moonGeo(date), mrd = eclToRaDec(mg.v), e = helio(BY.tierra, date), lamS = Math.atan2(-e[1], -e[0]) / R, el = mod(mg.lam - lamS, 360), fase = (1 - Math.cos(el * R)) / 2;
    var faseTxt = fase < 0.03 ? T('Luna nueva: no se ve.', 'New moon: not visible.') : fase > 0.97 ? T('Luna llena: toda la noche.', 'Full moon: all night.') : (el < 180 ? T('Creciente: por la tarde y al anochecer.', 'Waxing: in the afternoon and evening.') : T('Menguante: de madrugada y por la mañana.', 'Waning: late at night and in the morning.'));
    rows.unshift(h('tr', {}, h('th', { scope: 'row' }, h('a', { href: '#luna-luna', text: T('Luna', 'Moon') })), h('td', { text: '1,00'.replace(',', EN ? '.' : ',') }), h('td', { 'data-v': mg.km / AU, text: num(mg.km / 1e6, 3) }), h('td', { text: lightTime(mg.km / AU) }),
      h('td', { text: conAt(mrd.ra, mrd.dec) || '—' }), h('td', { text: num(Math.min(el, 360 - el)) + '°' }), h('td', { text: faseTxt + ' ' + T('Iluminada al ', 'Lit ') + num(fase * 100) + ' %' }), h('td', { text: T('A simple vista', 'Naked eye') })));
    var cap = T('Dónde está cada cuerpo el ', 'Where each body is on ') + fmtDate(date) + T(' a las ', ' at ') + fmtTime(date);
    app.replaceChildren(
      h('p', { class: 'cn-cap', 'aria-hidden': 'true', text: cap }),
      h('div', { class: 'cn-table-wrap', role: 'region', 'aria-labelledby': 'ss-hoy-cap', tabindex: '0' },
        h('table', { class: 'cn-table' }, h('caption', { id: 'ss-hoy-cap', class: 'cn-vh', text: cap }), h('thead', {}, h('tr', {}, head.map(function (x) { return h('th', { scope: 'col', text: x }); }))), h('tbody', {}, rows))),
      h('p', { class: 'cn-note', text: T('«Cuándo se ve» es orientativo: depende también de la altura sobre el horizonte, del tiempo y de la luz de la ciudad. La separación del Sol es el ángulo entre el Sol y el cuerpo visto desde la Tierra.',
        '“When you can see it” is a guide: it also depends on the height above the horizon, the weather and city lights. The angle from the Sun is the angle between the Sun and the body as seen from the Earth.') }),
      h('p', {}, h('a', { class: 'bajar', href: EN ? '/en/interests/night-sky/#cielo' : '/es/intereses/cielo/#cielo', text: T('Míralos en el cielo de esta noche, en Cielo nocturno', 'See them in tonight’s sky, in Night sky') })));
  }

  /* ---------- fichas: botones ---------- */
  function fichaTools() {
    Array.prototype.forEach.call(document.querySelectorAll('.ss-ficha-tools'), function (box) {
      var id = box.getAttribute('data-body');
      var kids = [];
      if (VIEW) kids.push(h('button', { type: 'button', class: 'filter', text: T('Verlo en 3D', 'See it in 3D'), on: { click: function () { VIEW.goTo(id); stage.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth' }); view.focus({ preventScroll: true }); } } }));
      if (id !== 'sol') {
        kids.push(mineBtn('visto', id), mineBtn('sabe', id));
      }
      box.replaceChildren.apply(box, kids);
    });
  }
  function mineBtn(list, id) {
    var b = h('button', { type: 'button', class: 'cn-open ss-mine-btn', 'data-list': list, 'data-id': id, 'aria-pressed': has(list, id) ? 'true' : 'false',
      text: list === 'visto' ? T('Lo he visto en el cielo', 'I have seen it in the sky') : T('Me sé su ficha', 'I know its entry'),
      on: { click: function () { toggle(list, id); say(nameOf(id) + ': ' + (has(list, id) ? T('añadido a Mi colección.', 'added to My collection.') : T('quitado de Mi colección.', 'removed from My collection.'))); } } });
    return b;
  }

  /* ---------- comparador ---------- */
  var ART = { tierra: ['la Tierra', 'the Earth'], luna: ['la Luna', 'the Moon'], sol: ['el Sol', 'the Sun'] };
  function art(id) { return ART[id] ? ART[id][EN ? 1 : 0] : nameOf(id); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function comparer() {
    var app = document.getElementById('ss-cmp-app'); if (!app) return;
    var list = D.cuerpos.map(function (c) { return [c.id, nameOf(c.id), c.datos.diametro]; }).concat(D.lunas.filter(function (m) { return m.radio && m.radio > 150 && D.texturas[m.id]; }).map(function (m) { return [m.id, (EN ? m.en : m.es), m.radio * 2]; }));
    var DI = {}; list.forEach(function (x) { DI[x[0]] = x; });
    function sel(id, lab, val) { return h('label', { class: 'cn-field', for: id }, h('span', { text: lab }), h('select', { id: id, on: { change: draw } }, list.map(function (x) { return h('option', { value: x[0], text: x[1], selected: x[0] === val }); }))); }
    var out = h('div', { class: 'ss-cmp-duo' }), txt = h('p', { class: 'ss-cmp-txt', 'aria-live': 'polite' });
    app.replaceChildren(h('h3', { text: T('Compara dos', 'Compare two') }), h('div', { class: 'cn-fields' }, sel('ss-cmp-a', T('Primero', 'First'), 'jupiter'), sel('ss-cmp-b', T('Segundo', 'Second'), 'tierra')), out, txt);
    function img(id, px) {
      var src = BY[id] ? '/img/intereses/sistema-solar/' + id + '.webp' : (D.texturas[id] ? '/img/intereses/sistema-solar/lunas/' + id + '.webp' : null);
      return h('figure', { class: 'ss-cmp-item' }, h('img', { src: src, alt: '', width: Math.max(2, Math.round(px)), height: Math.max(2, Math.round(px)), style: 'width:' + Math.max(2, px).toFixed(1) + 'px;height:' + Math.max(2, px).toFixed(1) + 'px' }), h('figcaption', { text: DI[id][1] + ' · ' + num(DI[id][2]) + ' km' }));
    }
    function draw() {
      var a = document.getElementById('ss-cmp-a').value, b = document.getElementById('ss-cmp-b').value, A = DI[a], B = DI[b];
      var big = Math.max(A[2], B[2]), W = Math.min(out.clientWidth || 600, 640) * 0.6;
      out.replaceChildren(img(a, A[2] / big * W), img(b, B[2] / big * W));
      var r = A[2] / B[2], s, n;
      if (a === b) s = T('Es el mismo.', 'It is the same one.');
      else if (r >= 1) { n = Math.round(r * r * r); s = cap(art(a)) + T(' es ', ' is ') + num(r, r < 10 ? 2 : 1) + T(' veces más ancho que ', ' times as wide as ') + art(b) + '. ' + T('Dentro de ' + art(a) + ' cabrían unos ' + num(n) + ' cuerpos del tamaño de ' + art(b) + '.', 'About ' + num(n) + ' bodies the size of ' + art(b) + ' would fit inside ' + art(a) + '.'); }
      else { n = Math.round(1 / (r * r * r)); s = cap(art(a)) + T(' mide el ', ' is ') + num(r * 100, r < 0.1 ? 1 : 0) + T(' % del ancho de ', '% of the width of ') + art(b) + '. ' + T('Dentro de ' + art(b) + ' cabrían unos ' + num(n) + ' cuerpos del tamaño de ' + art(a) + '.', 'About ' + num(n) + ' bodies the size of ' + art(a) + ' would fit inside ' + art(b) + '.'); }
      txt.textContent = s;
    }
    draw();
  }

  /* ---------- tabla ordenable ---------- */
  function sortable(table) {
    var ths = table.querySelectorAll('thead th');
    Array.prototype.forEach.call(ths, function (th, i) {
      var label = th.textContent, b = h('button', { class: 'cn-sort', type: 'button' }, label);
      b.addEventListener('click', function () {
        var dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
        Array.prototype.forEach.call(ths, function (x) { x.removeAttribute('aria-sort'); });
        th.setAttribute('aria-sort', dir);
        var tb = table.tBodies[0], rows = Array.prototype.slice.call(tb.rows);
        rows.sort(function (a, c) {
          var A = a.cells[i], C = c.cells[i], va = A.getAttribute('data-v'), vc = C.getAttribute('data-v'), r;
          if (va !== null && vc !== null) r = parseFloat(va) - parseFloat(vc); else r = A.textContent.localeCompare(C.textContent, EN ? 'en' : 'es');
          return dir === 'ascending' ? r : -r;
        });
        rows.forEach(function (r) { tb.appendChild(r); });
        say(T('Ordenado por ', 'Sorted by ') + label + (dir === 'ascending' ? T(', de menor a mayor.', ', ascending.') : T(', de mayor a menor.', ', descending.')));
      });
      th.replaceChildren(b);
    });
  }

  /* ---------- Mi colección ---------- */
  var ALL = [];
  function refreshMine() {
    Array.prototype.forEach.call(document.querySelectorAll('.ss-mine-btn'), function (b) { b.setAttribute('aria-pressed', has(b.getAttribute('data-list'), b.getAttribute('data-id')) ? 'true' : 'false'); });
    var app = document.getElementById('ss-mine-app'); if (!app || !D) return;
    var groups = [
      [T('Planetas', 'Planets'), ['mercurio', 'venus', 'tierra', 'marte', 'jupiter', 'saturno', 'urano', 'neptuno']],
      [T('Planetas enanos', 'Dwarf planets'), ['ceres', 'pluton', 'haumea', 'makemake', 'eris']],
      [T('Lunas principales', 'Main moons'), ORDER.filter(function (k) { return MOONS[k]; })]];
    function bar(n, tot, text) { return h('div', { class: 'cn-prog' }, h('p', {}, h('strong', { text: num(n) + ' / ' + num(tot) }), ' ' + text), h('div', { class: 'cn-bar', 'aria-hidden': 'true' }, h('span', { style: 'width:' + (tot ? n / tot * 100 : 0).toFixed(1) + '%' }))); }
    var visto = mine.visto.filter(function (k) { return ALL.indexOf(k) > -1; }).length, sabe = mine.sabe.filter(function (k) { return ALL.indexOf(k) > -1; }).length;
    var confirm = h('div', { class: 'ss-confirm', hidden: true },
      h('p', { text: T('¿Seguro? Se borra todo lo que has marcado en este navegador.', 'Are you sure? Everything you have marked in this browser will be deleted.') }),
      h('div', { class: 'filters' },
        h('button', { type: 'button', class: 'filter ss-danger', text: T('Sí, borrar mi colección', 'Yes, delete my collection'), on: { click: function () { mine = { visto: [], sabe: [] }; try { window.localStorage.removeItem(KEY); } catch (e) {} refreshMine(); say(T('Mi colección está vacía.', 'My collection is empty.')); var f = document.getElementById('ss-mine-del'); if (f) f.focus(); } } }),
        h('button', { type: 'button', class: 'filter', text: T('No, dejarla como está', 'No, keep it'), on: { click: function () { confirm.hidden = true; document.getElementById('ss-mine-del').focus(); } } })));
    var file = h('input', { type: 'file', id: 'ss-mine-file', accept: 'application/json,.json', class: 'cn-file', on: { change: function (ev) {
      var f = ev.target.files[0]; if (!f) return;
      f.text().then(function (t) {
        var d = JSON.parse(t);
        if (!d || !Array.isArray(d.visto) || !Array.isArray(d.sabe)) throw new Error('x');
        mine = { visto: d.visto.filter(function (k) { return ALL.indexOf(k) > -1; }), sabe: d.sabe.filter(function (k) { return ALL.indexOf(k) > -1; }) }; save(); refreshMine();
        say(T('Colección abierta.', 'Collection opened.'));
      }).catch(function () { say(T('Ese archivo no es una colección de Iris Green.', 'That file is not an Iris Green collection.')); });
    } } });
    app.replaceChildren(
      h('div', { class: 'cn-progs' }, bar(visto, ALL.length, T('he visto en el cielo', 'seen in the sky')), bar(sabe, ALL.length, T('me sé', 'I know'))),
      h('div', { class: 'ss-mine-groups' }, groups.map(function (g) {
        return h('fieldset', { class: 'ss-mine-group' }, h('legend', { text: g[0] }),
          h('ul', { class: 'ss-mine-list' }, g[1].map(function (k) {
            return h('li', {}, h('span', { class: 'ss-mine-name', text: nameOf(k) + (MOONS[k] ? ' · ' + nameOf(MOONS[k].planeta) : '') }), mineBtn('visto', k), mineBtn('sabe', k));
          })));
      })),
      h('p', { class: 'cn-note', text: T('Se guarda en este navegador (almacenamiento local) hasta que lo borres. Iris Green no recibe nada.', 'It is kept in this browser (local storage) until you delete it. Iris Green receives nothing.') }),
      h('div', { class: 'filters cn-mine-actions' },
        h('button', { type: 'button', class: 'filter', text: T('Guardar en un archivo', 'Save to a file'), on: { click: function () {
          var blob = new Blob([JSON.stringify({ marca: MARCA, tipo: T('Iris Green · Mi colección · Planetas y sistema solar', 'Iris Green · My collection · Planets and the Solar System'), fecha: new Date().toISOString().slice(0, 10), visto: mine.visto, sabe: mine.sabe }, null, 1)], { type: 'application/json' });
          download(T('mi-coleccion-sistema-solar.json', 'my-solar-system-collection.json'), blob); say(T('Archivo guardado.', 'File saved.'));
        } } }),
        h('label', { class: 'filter cn-file-label', for: 'ss-mine-file' }, file, h('span', { text: T('Abrir un archivo', 'Open a file') })),
        h('button', { type: 'button', class: 'filter', id: 'ss-mine-del', text: T('Borrar mi colección', 'Delete my collection'), on: { click: function () { confirm.hidden = false; confirm.querySelector('button').focus(); } } })),
      confirm);
  }

  /* ---------- arranque ---------- */
  function start(d) {
    D = d;
    D.cuerpos.forEach(function (c) { BY[c.id] = c; });
    D.lunas.forEach(function (m) { MOONS[m.id] = m; });
    ALL = ['mercurio', 'venus', 'tierra', 'marte', 'jupiter', 'saturno', 'urano', 'neptuno', 'ceres', 'pluton', 'haumea', 'makemake', 'eris'].concat(ORDER.filter(function (k) { return MOONS[k]; }));
    var t = document.getElementById('ss-data-table'); if (t) sortable(t);
    Array.prototype.forEach.call(document.querySelectorAll('.ss-moon-table'), sortable);
    comparer(); refreshMine();
    var now = new Date();
    renderHoy(now);
    var launch = h('button', { type: 'button', class: 'filter', text: T('Abrir vista interactiva', 'Open interactive view') });
    ui.replaceChildren(launch);
    var prompt = view.querySelector('.cn-stage-nojs');
    if (prompt) prompt.textContent = T('Abre la vista interactiva cuando quieras. Las fichas y tablas ya están disponibles.', 'Open the interactive view whenever you want. Entries and tables are already available.');
    launch.addEventListener('click', function () {
      launch.disabled = true;
      launch.textContent = T('Cargando vista…', 'Loading view…');
      var script = document.createElement('script');
      script.src = '/assets/ig-sistema-solar-3d.js';
      script.onload = function () {
      var canGL = (function () { try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; } })();
    if (window.IGSistemaSolar3D && canGL) {
      buildUI();
      D.fondo = FONDO;
      VIEW = window.IGSistemaSolar3D.start(D, { EN: EN, T: T, host: view, labels: labels, reduce: reduce, fail: fail, label: label, onFocus: onFocus, onTime: onTime,
        date: function () { return now; }, img: function (f) { return '/img/intereses/sistema-solar/' + f; } });
      if (VIEW) onTime(now, false);
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
    fichaTools();
    if (location.hash && document.getElementById(location.hash.slice(1))) setTimeout(function () { document.getElementById(location.hash.slice(1)).scrollIntoView(); }, 0);
  }
  Promise.all([
    fetch('/es/intereses/sistema-solar/sistema-solar.json', { credentials: 'same-origin' }).then(function (r) { return r.json(); }),
    fetch('/es/intereses/sistema-solar/cielo-fondo.json', { credentials: 'same-origin' }).then(function (r) { return r.json(); }).catch(function () { return null; })
  ]).then(function (res) { FONDO = res[1]; start(res[0]); }).catch(function () {
    var p = view && view.querySelector('.cn-stage-nojs'); if (p) p.textContent = T('No se han podido cargar los datos. Las fichas y las tablas de abajo siguen disponibles.', 'The data could not be loaded. The entries and tables below are still available.');
  });
})();
