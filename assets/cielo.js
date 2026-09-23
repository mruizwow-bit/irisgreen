/* IRIS R02 · Cielo nocturno (piloto). Solo datos SAMPLE. Sin eval, sin red.
   Regla dura (addendum R44 §8 / D14): REAL_SKY_LAYER y DRAWING_LAYER separados.
   - Un punto creado por la persona es SIEMPRE { layer: 'DRAWING', kind: 'own' } y nunca recibe star/starRef.
   - La creación de puntos NO consulta la distancia a ningún marcador.
   - El único vínculo con un marcador es { kind: 'ref', starRef } creado por la acción explícita
     «Usar en mi constelación» de la ficha. Es una referencia separada, no un punto propio. */
(function () {
  'use strict';
  var IG = window.IG, h = IG.h, D = IG.data(), L = D.lang, KEY = 'ig-cielo-r02';
  var T = function (es, en) { return L === 'es' ? es : en; };
  var W = 1000, H = 600, STARS = D.stars, CONSTS = D.consts;
  var byId = {}; STARS.forEach(function (s, i) { byId[s.id] = i; });

  function blankDraft() { return { seq: [], links: [], auto: true, name: '', nextOwn: 1 }; }
  var saved = IG.store.get(KEY) || {};
  var st = { mode: 'explore', lines: true, help: false, z: 1, cx: W / 2, cy: H / 2, sel: null, cursor: { x: W / 2, y: H / 2 },
             draft: saved.draft || blankDraft(), mine: saved.mine || [] };
  var hist = [];
  var app = document.getElementById('sky-app'), mineApp = document.getElementById('mine-app');

  function persist() { IG.store.set(KEY, { draft: st.draft, mine: st.mine }); }
  function commit(fn, msg) { hist.push(IG.clone({ draft: st.draft, mine: st.mine })); if (hist.length > 80) hist.shift(); fn(); persist(); draw(); if (msg) IG.say(msg); }
  function undo() { var p = hist.pop(); if (!p) { IG.say(T('Nada que deshacer.', 'Nothing to undo.')); return; } st.draft = p.draft; st.mine = p.mine; persist(); draw(); IG.say(T('Último cambio deshecho.', 'Last change undone.')); }

  /* ---- vista ---- */
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function view() { var vw = W / st.z, vh = H / st.z; st.cx = clamp(st.cx, vw / 2, W - vw / 2); st.cy = clamp(st.cy, vh / 2, H - vh / 2); return { x: st.cx - vw / 2, y: st.cy - vh / 2, w: vw, h: vh }; }
  function zoom(nz, msg) { st.z = clamp(Math.round(nz * 10) / 10, 1, 6); draw(); IG.say(msg || T('Zoom ', 'Zoom ') + st.z.toFixed(1) + '×.'); }
  function pan(dx, dy) { var v = view(); st.cx += dx * v.w * 0.15; st.cy += dy * v.h * 0.15; draw(); IG.say(T('Cielo desplazado. Ningún punto ha cambiado.', 'Sky moved. No point has changed.')); }
  function reframe() { st.z = 1; st.cx = W / 2; st.cy = H / 2; draw(); IG.say(T('Cielo reencuadrado.', 'Sky reframed.')); }

  /* ---- modelo de dibujo (DRAWING_LAYER) ---- */
  function addOwnPoint(x, y) {
    // Punto propio: coordenadas exactas donde lo pone la persona. Sin búsqueda de marcadores cercanos.
    commit(function () {
      var d = st.draft, n = d.seq.length, id = 'P' + d.nextOwn++;
      d.seq.push({ kind: 'own', layer: 'DRAWING', id: id, x: Math.round(x), y: Math.round(y) });
      if (d.auto && n > 0) d.links.push([n - 1, n]);
    }, T('Punto propio ', 'Own point ') + 'P' + st.draft.nextOwn + T(' creado', ' created') + (st.draft.auto && st.draft.seq.length ? T(', unido al anterior', ', joined to the previous one') : '') + '. ' + T('Total: ', 'Total: ') + (st.draft.seq.length + 1) + '.');
  }
  function addRef(starIdx) {
    // Única vía de vínculo: acción explícita desde la ficha. Se guarda como referencia separada.
    var s = STARS[starIdx], d = st.draft, last = d.seq[d.seq.length - 1];
    if (last && last.kind === 'ref' && last.starRef === s.id) { IG.say(s.id + T(' ya es el último vértice.', ' is already the last vertex.')); return; }
    commit(function () { var n = d.seq.length; d.seq.push({ kind: 'ref', layer: 'DRAWING', starRef: s.id }); if (d.auto && n > 0) d.links.push([n - 1, n]); },
      T('Referencia explícita a ', 'Explicit reference to ') + s.id + T(' añadida a tu constelación. Tu constelación no cambia el marcador.', ' added to your constellation. Your constellation does not change the marker.'));
    st.mode = 'draw'; draw();
  }
  function vxy(v) { if (v.kind === 'ref') { var s = STARS[byId[v.starRef]]; return { x: s.x, y: s.y }; } return { x: v.x, y: v.y }; }
  function vlabel(v, i) { return (i + 1) + ' · ' + (v.kind === 'ref' ? T('Referencia explícita a ', 'Explicit reference to ') + v.starRef + T(' (marcador de muestra)', ' (sample marker)') : T('Punto propio ', 'Own point ') + v.id + ' · x ' + v.x + ', y ' + v.y); }

  /* ---- SVG ---- */
  function sky() {
    var v = view(), k = 1 / st.z;
    var svg = h('svg', { viewBox: v.x + ' ' + v.y + ' ' + v.w + ' ' + v.h, 'aria-hidden': 'true', focusable: 'false', preserveAspectRatio: 'xMidYMid slice' });
    svg.appendChild(h('rect', { x: 0, y: 0, width: W, height: H, fill: '#070B1A' }));
    var real = h('g', { 'data-layer': 'REAL_SKY_LAYER' });
    if (st.lines) CONSTS.forEach(function (c) { c.links.forEach(function (l) { var a = STARS[l[0]], b = STARS[l[1]]; real.appendChild(h('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: '#8FA3E0', 'stroke-width': 1.5 * k })); }); });
    STARS.forEach(function (s, i) {
      var r = (2 + s.tier * 1.6) * Math.sqrt(k) * 1.4;
      if (i === st.sel) real.appendChild(h('circle', { cx: s.x, cy: s.y, r: r + 9 * k, fill: 'none', stroke: '#FFD166', 'stroke-width': 2.5 * k }));
      real.appendChild(h('circle', { cx: s.x, cy: s.y, r: r, fill: '#FFF4D6' }));
      real.appendChild(h('path', { d: 'M' + (s.x - r * 2) + ',' + s.y + 'H' + (s.x + r * 2) + 'M' + s.x + ',' + (s.y - r * 2) + 'V' + (s.y + r * 2), stroke: '#FFF4D6', 'stroke-width': 0.8 * k, opacity: 0.8 }));
    });
    svg.appendChild(real);
    var draw_ = h('g', { 'data-layer': 'DRAWING_LAYER' });
    function drawFig(d, saved) {
      d.links.forEach(function (l) { var a = vxy(d.seq[l[0]]), b = vxy(d.seq[l[1]]); draw_.appendChild(h('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: '#7FE3D0', 'stroke-width': 3 * k, 'stroke-dasharray': (8 * k) + ' ' + (6 * k) })); });
      d.seq.forEach(function (p) {
        var c = vxy(p);
        if (p.kind === 'ref') draw_.appendChild(h('circle', { cx: c.x, cy: c.y, r: 13 * k, fill: 'none', stroke: '#7FE3D0', 'stroke-width': 2 * k, 'stroke-dasharray': (3 * k) + ' ' + (3 * k) }));
        else {
          var q = 8 * k; draw_.appendChild(h('path', { d: 'M' + c.x + ',' + (c.y - q) + 'L' + (c.x + q) + ',' + c.y + 'L' + c.x + ',' + (c.y + q) + 'L' + (c.x - q) + ',' + c.y + 'Z', fill: 'none', stroke: '#7FE3D0', 'stroke-width': 2.2 * k }));
          if (!saved) draw_.appendChild(h('text', { x: c.x + q + 4 * k, y: c.y + q + 8 * k, fill: '#7FE3D0', 'font-size': 13 * k, 'font-family': 'JetBrains Mono, monospace' }, p.id));
        }
      });
    }
    st.mine.forEach(function (m) { drawFig(m, true); });
    drawFig(st.draft, false);
    if (st.mode === 'draw' && st.kbCursor) {
      var cx = st.cursor.x, cy = st.cursor.y, q = 12 * k;
      draw_.appendChild(h('path', { d: 'M' + (cx - q) + ',' + cy + 'H' + (cx + q) + 'M' + cx + ',' + (cy - q) + 'V' + (cy + q), stroke: '#FFD166', 'stroke-width': 2 * k }));
    }
    svg.appendChild(draw_);
    return svg;
  }

  /* hit-test SOLO para explorar (seleccionar un marcador). Nunca se usa al crear puntos. */
  function hitStarForExplore(p) { var best = null, bd = 18 / st.z; STARS.forEach(function (s, i) { var d = Math.hypot(s.x - p.x, s.y - p.y); if (d < bd) { bd = d; best = i; } }); return best; }
  function toSky(box, ev) { var r = box.getBoundingClientRect(), v = view(); var sc = Math.max(r.width / v.w, r.height / v.h), ox = (r.width - v.w * sc) / 2, oy = (r.height - v.h * sc) / 2; return { x: v.x + (ev.clientX - r.left - ox) / sc, y: v.y + (ev.clientY - r.top - oy) / sc }; }
  function select(i, center) {
    if (i === null) { st.sel = null; draw(); IG.say(T('Selección quitada.', 'Selection cleared.')); return; }
    st.sel = i; if (center) { st.cx = STARS[i].x; st.cy = STARS[i].y; }
    draw(); var s = STARS[i]; IG.say(T('Seleccionado ', 'Selected ') + s.id + (s.con ? ' · ' + s.con : '') + T('. Ficha actualizada.', '. Card updated.'));
  }

  function skyBox() {
    var drag = null;
    var box = h('div', { class: 'skybox', tabindex: '0', role: 'application', 'data-k': 'sky', 'aria-roledescription': T('mapa del cielo', 'sky map'),
      'aria-label': T('Cielo de muestra, modo ', 'Sample sky, ') + (st.mode === 'draw' ? T('dibujar', 'draw mode') : T('explorar', 'explore mode')) + ', zoom ' + st.z.toFixed(1) + '×. ' + T('La Lista del cielo ofrece la misma información.', 'The Sky list gives the same information.'),
      'aria-describedby': 'sky-keys',
      on: {
        pointerdown: function (ev) { drag = { x: ev.clientX, y: ev.clientY, cx: st.cx, cy: st.cy, moved: false }; box.setPointerCapture(ev.pointerId); },
        pointermove: function (ev) { if (!drag) return; var dx = ev.clientX - drag.x, dy = ev.clientY - drag.y; if (Math.hypot(dx, dy) > 6) drag.moved = true; if (drag.moved) { var r = box.getBoundingClientRect(), v = view(), sc = Math.max(r.width / v.w, r.height / v.h); st.cx = drag.cx - dx / sc; st.cy = drag.cy - dy / sc; var svg = box.querySelector('svg'), vv = view(); svg.setAttribute('viewBox', vv.x + ' ' + vv.y + ' ' + vv.w + ' ' + vv.h); } },
        pointerup: function (ev) {
          if (!drag) return; var moved = drag.moved; drag = null;
          if (moved) { draw(); IG.say(T('Cielo desplazado. Ningún punto ha cambiado.', 'Sky moved. No point has changed.')); return; }
          var p = toSky(box, ev);
          if (st.mode === 'draw') { st.kbCursor = false; addOwnPoint(p.x, p.y); }        // D14: sin consultar marcadores
          else { var i = hitStarForExplore(p); select(i, false); }
        },
        wheel: function (ev) { ev.preventDefault(); zoom(st.z * (ev.deltaY < 0 ? 1.25 : 0.8)); },
        keydown: function (ev) {
          var k = ev.key, arrows = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
          if (arrows[k]) {
            ev.preventDefault();
            if (st.mode === 'draw' && !ev.shiftKey) { st.kbCursor = true; var step = 10 / st.z; st.cursor.x = clamp(st.cursor.x + arrows[k][0] * step, 0, W); st.cursor.y = clamp(st.cursor.y + arrows[k][1] * step, 0, H); draw(); }
            else pan(arrows[k][0], arrows[k][1]);
          } else if (k === '+' || k === '=') { ev.preventDefault(); zoom(st.z * 1.25); }
          else if (k === '-') { ev.preventDefault(); zoom(st.z * 0.8); }
          else if (k === '0') { ev.preventDefault(); reframe(); }
          else if (st.mode === 'explore' && (k === 'n' || k === 'N')) { ev.preventDefault(); select(st.sel === null ? 0 : (st.sel + 1) % STARS.length, true); }
          else if (st.mode === 'explore' && (k === 'p' || k === 'P')) { ev.preventDefault(); select(st.sel === null ? STARS.length - 1 : (st.sel - 1 + STARS.length) % STARS.length, true); }
          else if (k === 'Escape') { ev.preventDefault(); select(null); }
          else if (st.mode === 'draw' && (k === 'Enter' || k === ' ')) { ev.preventDefault(); st.kbCursor = true; addOwnPoint(st.cursor.x, st.cursor.y); } // D14: sin búsqueda de marcadores cercanos
          else if (st.mode === 'draw' && (k === 'Backspace' || ((ev.ctrlKey || ev.metaKey) && (k === 'z' || k === 'Z')))) { ev.preventDefault(); undo(); }
        }
      } }, sky());
    return box;
  }

  /* ---- ficha (REAL_SKY_LAYER · SAMPLE) ---- */
  function ficha() {
    if (st.sel === null) return h('section', { class: 'card', 'aria-labelledby': 'h-ficha' }, h('h2', { id: 'h-ficha', style: 'font-size:24px', text: T('Ninguna estrella elegida', 'No star chosen') }),
      h('p', { class: 'muted', text: T('Elige un marcador en el cielo (o pulsa N con el foco en el cielo) o en la Lista del cielo.', 'Choose a marker in the sky (or press N with focus on the sky) or in the Sky list.') }));
    var s = STARS[st.sel];
    function row(dt, dd, help) { return h('div', null, h('dt', { text: dt }), help ? h('dd', { class: 'hint', text: help }) : null, h('dd', { text: dd })); }
    return h('section', { class: 'card', 'aria-labelledby': 'h-ficha' },
      h('p', { class: 'tag', text: T('Ficha · datos de muestra', 'Card · sample data') }),
      h('h2', { id: 'h-ficha', style: 'font-size:24px', text: s.id }),
      h('h3', { text: T('Qué estás viendo', 'What you are looking at') }),
      h('p', { text: T('Un marcador de muestra', 'A sample marker') + (s.con ? T(' de ', ' in ') + s.con : '') + T('. No es una estrella real.', '. It is not a real star.') }),
      h('h3', { text: T('Datos', 'Data') }),
      h('dl', { class: 'facts' },
        row(T('Magnitud aparente', 'Apparent magnitude'), s.mag_sample, T('Cuánto brilla vista desde la Tierra. Un número más bajo significa más brillo.', 'How bright it looks from Earth. A lower number means brighter.')),
        row(T('Tipo espectral', 'Spectral type'), s.spect_sample, T('Clase según su luz; indica su temperatura.', 'Class based on its light; it shows its temperature.')),
        row(T('Distancia', 'Distance'), s.dist_sample + (s.fiable ? '' : T(' · distancia incierta: la medida tiene demasiado error.', ' · uncertain distance: the measurement has too much error.')), null)),
      h('h3', { text: T('Dónde está', 'Where it is') }),
      h('dl', { class: 'facts' }, row(T('Constelación', 'Constellation'), s.con || T('Sin constelación', 'No constellation')),
        row(T('AR / Dec J2000 (muestra)', 'RA / Dec J2000 (sample)'), s.ra_sample + ' / ' + s.dec_sample + T(' · proyección de diseño, no astronómica', ' · design projection, not astronomical'))),
      h('h3', { text: T('Curiosidad', 'Fact') }),
      h('p', null, (L === 'es' ? s.curiosidad.texto_es : s.curiosidad.texto_en) + ' ', h('span', { class: 'muted', text: T('Fuente: ', 'Source: ') + s.curiosidad.fuente })),
      h('div', { class: 'culture' }, h('h3', { text: T('En la cultura', 'In culture') }), h('p', { text: L === 'es' ? s.cultura_es : s.cultura_en })),
      h('h3', { text: T('Fuente', 'Source') }),
      h('p', { class: 'muted', text: 'DATASET_SAMPLE_R02 · ' + T('sin datos reales hasta el contrato de procedencia y licencia (D2)', 'no real data until the provenance and licence contract (D2)') }),
      h('div', { class: 'row' },
        h('button', { class: 'btn', type: 'button', 'data-k': 'prev', on: { click: function () { select((st.sel - 1 + STARS.length) % STARS.length, true); } } }, T('Anterior', 'Previous')),
        h('button', { class: 'btn', type: 'button', 'data-k': 'next', on: { click: function () { select((st.sel + 1) % STARS.length, true); } } }, T('Siguiente', 'Next')),
        h('button', { class: 'btn primary', type: 'button', 'data-k': 'use-in-draw', on: { click: function () { addRef(st.sel); } } }, T('Usar en mi constelación', 'Use in my constellation'))),
      h('p', { class: 'hint', text: T('«Usar en mi constelación» añade una referencia a este marcador. Tu dibujo sigue siendo tuyo y el marcador no cambia.', '"Use in my constellation" adds a reference to this marker. Your drawing stays yours and the marker does not change.') }));
  }

  /* ---- panel de dibujo ---- */
  function drawPanel() {
    var d = st.draft;
    return h('section', { class: 'card', 'aria-labelledby': 'h-draw' },
      h('p', { class: 'tag', text: T('Hecho por ti', 'Made by you') }),
      h('h2', { id: 'h-draw', style: 'font-size:24px', text: T('Tu constelación', 'Your constellation') }),
      h('p', { class: 'hint', text: T('Toca el cielo, o usa las flechas e Intro con el foco en el cielo, para poner tus puntos. Tus puntos nunca son estrellas reales, aunque estén cerca de un marcador.', 'Tap the sky, or use the arrows and Enter with focus on the sky, to place your points. Your points are never real stars, even when they are close to a marker.') }),
      h('div', { class: 'row' },
        h('button', { class: 'btn', type: 'button', 'data-k': 'auto', 'aria-pressed': d.auto ? 'true' : 'false', on: { click: function () { commit(function () { d.auto = !d.auto; }, d.auto ? T('Unir automáticamente: no.', 'Join automatically: off.') : T('Unir automáticamente: sí.', 'Join automatically: on.')); } } }, T('Unir automáticamente', 'Join automatically')),
        h('button', { class: 'btn', type: 'button', 'data-k': 'join2', on: { click: function () { var n = d.seq.length; if (n < 2) { IG.say(T('Hacen falta dos vértices.', 'Two vertices are needed.')); return; } commit(function () { d.links.push([n - 2, n - 1]); }, T('Últimos dos vértices unidos.', 'Last two vertices joined.')); } } }, T('Unir los dos últimos', 'Join the last two')),
        h('button', { class: 'btn', type: 'button', 'data-k': 'close', on: { click: function () { var n = d.seq.length; if (n < 3) { IG.say(T('Hacen falta tres vértices para cerrar.', 'Three vertices are needed to close.')); return; } commit(function () { d.links.push([n - 1, 0]); }, T('Figura cerrada.', 'Shape closed.')); } } }, T('Cerrar figura', 'Close shape')),
        h('button', { class: 'btn', type: 'button', 'data-k': 'dundo', on: { click: undo } }, T('Deshacer', 'Undo')),
        h('button', { class: 'btn ghost', type: 'button', 'data-k': 'dclear', on: { click: function () { commit(function () { st.draft = blankDraft(); }, T('Dibujo vaciado. Puedes deshacerlo.', 'Drawing cleared. You can undo it.')); } } }, T('Vaciar', 'Clear'))),
      d.seq.length ? h('ol', { class: 'items', 'aria-label': T('Vértices de tu constelación', 'Vertices of your constellation') }, d.seq.map(function (v, i) { return h('li', null, h('span', { class: 't', text: vlabel(v, i) })); }))
                   : h('p', { class: 'empty', text: T('Aún no hay vértices.', 'No vertices yet.') }),
      h('div', { class: 'field' }, h('label', { for: 'cname', text: T('Nombre de tu constelación', 'Name of your constellation') }),
        h('input', { type: 'text', id: 'cname', 'data-k': 'cname', value: d.name, on: { input: function (ev) { d.name = ev.target.value; persist(); } } })),
      h('p', { class: 'err', role: 'alert', id: 'err-draw' }),
      h('button', { class: 'btn primary', type: 'button', 'data-k': 'dsave', on: { click: function () {
        var err = d.seq.length < 2 ? T('Hacen falta al menos dos vértices.', 'At least two vertices are needed.') : !d.links.length ? T('Une al menos dos vértices.', 'Join at least two vertices.') : !d.name.trim() ? T('Ponle un nombre antes de guardar.', 'Give it a name before saving.') : '';
        document.getElementById('err-draw').textContent = err; if (err) return;
        commit(function () { var m = IG.clone(d); m.id = IG.uid(); st.mine.push(m); st.draft = blankDraft(); }, T('Constelación guardada en Mis constelaciones.', 'Constellation saved in My constellations.')); } } }, T('Guardar', 'Save')));
  }

  function controls() {
    function b(k, lab, aria, fn) { return h('button', { class: 'btn', type: 'button', 'data-k': k, 'aria-label': aria, on: { click: fn } }, lab); }
    return h('div', { class: 'row', role: 'group', 'aria-label': T('Mover y ampliar el cielo', 'Move and zoom the sky') },
      b('pl', '←', T('Mover el cielo a la izquierda', 'Move the sky left'), function () { pan(-1, 0); }),
      b('pu', '↑', T('Mover el cielo arriba', 'Move the sky up'), function () { pan(0, -1); }),
      b('pd', '↓', T('Mover el cielo abajo', 'Move the sky down'), function () { pan(0, 1); }),
      b('pr', '→', T('Mover el cielo a la derecha', 'Move the sky right'), function () { pan(1, 0); }),
      b('zo', '−', T('Alejar', 'Zoom out'), function () { zoom(st.z * 0.8); }),
      h('span', { class: 'tag', text: st.z.toFixed(1) + '×' }),
      b('zi', '+', T('Acercar', 'Zoom in'), function () { zoom(st.z * 1.25); }),
      h('button', { class: 'btn', type: 'button', 'data-k': 'rf', on: { click: reframe } }, T('Reencuadrar', 'Reframe')));
  }

  function draw() {
    IG.render(app, function () {
      var modes = h('div', { class: 'row', role: 'group', 'aria-label': T('Modo', 'Mode') },
        h('button', { class: 'btn', type: 'button', 'data-k': 'm-explore', 'aria-pressed': st.mode === 'explore' ? 'true' : 'false', on: { click: function () { st.mode = 'explore'; draw(); IG.say(T('Modo explorar.', 'Explore mode.')); } } }, T('Explorar', 'Explore')),
        h('button', { class: 'btn', type: 'button', 'data-k': 'm-draw', 'aria-pressed': st.mode === 'draw' ? 'true' : 'false', on: { click: function () { st.mode = 'draw'; draw(); IG.say(T('Modo dibujar. Tus puntos siempre son tuyos.', 'Draw mode. Your points are always yours.')); } } }, T('Dibujar', 'Draw')),
        h('button', { class: 'btn', type: 'button', 'data-k': 'lines', 'aria-pressed': st.lines ? 'true' : 'false', on: { click: function () { st.lines = !st.lines; draw(); IG.say(st.lines ? T('Líneas de muestra visibles.', 'Sample lines shown.') : T('Líneas de muestra ocultas.', 'Sample lines hidden.')); } } }, T('Líneas de constelación', 'Constellation lines')),
        h('button', { class: 'btn', type: 'button', 'data-k': 'help', 'aria-expanded': st.help ? 'true' : 'false', 'aria-controls': 'sky-keys', on: { click: function () { st.help = !st.help; draw(); } } }, T('Ayuda de teclado', 'Keyboard help')));
      var keys = h('div', { id: 'sky-keys', class: st.help ? 'card' : 'visually-hidden' },
        h('p', { text: T('Con el foco en el cielo: flechas mueven el cielo; + y − cambian el zoom; 0 reencuadra; N y P eligen el marcador siguiente o anterior; Esc quita la selección.', 'With focus on the sky: arrows move the sky; + and − zoom; 0 reframes; N and P choose the next or previous marker; Esc clears the selection.') }),
        h('p', { text: T('En modo dibujar: las flechas mueven la mira, Mayús + flechas mueven el cielo, Intro o Espacio ponen un punto propio, Retroceso deshace.', 'In draw mode: arrows move the crosshair, Shift + arrows move the sky, Enter or Space place an own point, Backspace undoes.') }));
      var legend = h('ul', { class: 'legend', 'aria-label': T('Leyenda', 'Legend') },
        h('li', null, h('svg', { width: 18, height: 18, viewBox: '-9 -9 18 18', 'aria-hidden': 'true' }, h('circle', { r: 5, fill: '#FFF4D6' })), T('Marcador de muestra (círculo relleno)', 'Sample marker (filled circle)')),
        h('li', null, h('svg', { width: 18, height: 18, viewBox: '-9 -9 18 18', 'aria-hidden': 'true' }, h('path', { d: 'M0,-7L7,0L0,7L-7,0Z', fill: 'none', stroke: '#7FE3D0', 'stroke-width': 2 })), T('Tu punto propio (rombo hueco)', 'Your own point (hollow diamond)')),
        h('li', null, h('svg', { width: 18, height: 18, viewBox: '-9 -9 18 18', 'aria-hidden': 'true' }, h('circle', { r: 7, fill: 'none', stroke: '#7FE3D0', 'stroke-width': 2, 'stroke-dasharray': '2 2' })), T('Tu referencia a un marcador (anillo discontinuo)', 'Your reference to a marker (dashed ring)')),
        h('li', null, h('svg', { width: 24, height: 10, viewBox: '0 0 24 10', 'aria-hidden': 'true' }, h('line', { x1: 0, y1: 5, x2: 24, y2: 5, stroke: '#8FA3E0', 'stroke-width': 1.5 })), T('Línea de muestra (fina, continua)', 'Sample line (thin, solid)')),
        h('li', null, h('svg', { width: 24, height: 10, viewBox: '0 0 24 10', 'aria-hidden': 'true' }, h('line', { x1: 0, y1: 5, x2: 24, y2: 5, stroke: '#7FE3D0', 'stroke-width': 3, 'stroke-dasharray': '5 3' })), T('Tu línea (gruesa, discontinua)', 'Your line (thick, dashed)')));
      return h('div', { class: 'stack' }, modes, keys,
        h('p', { class: 'hint', text: st.mode === 'draw' ? T('Dibujar: toca el cielo para poner un punto propio. Arrastra para mover el cielo.', 'Draw: tap the sky to place an own point. Drag to move the sky.') : T('Explorar: toca un marcador para ver su ficha. Arrastra para mover el cielo.', 'Explore: tap a marker to see its card. Drag to move the sky.') }),
        h('div', { class: 'sky-layout' }, h('div', { class: 'sky-stage' }, skyBox(), controls(), legend), h('div', { class: 'sky-panel' }, ficha(), drawPanel())));
    });
    drawMine();
  }

  function drawMine() {
    IG.render(mineApp, function () {
      if (!st.mine.length) return h('p', { class: 'empty', text: T('Todavía no has guardado constelaciones en esta sesión.', 'You have not saved any constellations in this session yet.') });
      return h('ul', { class: 'items' }, st.mine.map(function (m, i) {
        var own = m.seq.filter(function (v) { return v.kind === 'own'; }).length, refs = m.seq.length - own;
        return h('li', null, h('span', { class: 't', text: m.name + ' · ' + own + T(' puntos propios, ', ' own points, ') + refs + T(' referencias explícitas', ' explicit references') }),
          h('button', { class: 'btn ghost', type: 'button', 'data-k': 'mdel-' + m.id, 'aria-label': T('Eliminar ', 'Delete ') + m.name, on: { click: function () { commit(function () { st.mine.splice(i, 1); }, T('Constelación eliminada. Puedes deshacerlo.', 'Constellation deleted. You can undo it.')); } } }, T('Eliminar', 'Delete')));
      }));
    });
  }

  /* ---- Lista del cielo: búsqueda con recuento anunciado (D04) ---- */
  var q = document.getElementById('q'), count = document.getElementById('q-count'), rows = document.querySelectorAll('#star-rows tr');
  rows.forEach(function (tr) {
    var id = tr.getAttribute('data-id'), cell = tr.querySelector('.js-cell');
    cell.appendChild(h('button', { class: 'btn', type: 'button', 'aria-label': T('Ver ficha de ', 'See card for ') + id, on: { click: function () { st.mode = 'explore'; select(byId[id], true); var f = document.getElementById('h-ficha'); if (f) { f.setAttribute('tabindex', '-1'); f.focus(); } } } }, T('Ver ficha', 'See card')));
  });
  var announce = IG.debounce(function (msg) { IG.say(msg); }, 500);
  q.addEventListener('input', function () {
    var v = q.value.trim().toLowerCase(), n = 0;
    rows.forEach(function (tr) { var hit = !v || tr.textContent.toLowerCase().indexOf(v) >= 0; tr.hidden = !hit; if (hit) n++; });
    var msg = n + T(' de ', ' of ') + STARS.length + T(' marcadores coinciden', ' markers match') + (n ? '.' : T('. Prueba con un número, como 03, o con SAMPLE_B.', '. Try a number, such as 03, or SAMPLE_B.'));
    count.textContent = msg; announce(msg);
  });

  draw();
})();
