/* Iris Green · Taller: utilidades del bloque interactivo. Sin dependencias, sin evaluación de código en tiempo de ejecución, sin peticiones de red. */
(function () {
  'use strict';
  
  var IG = window.IGL = {};

  /* Datos de la página: bloque JSON no ejecutable generado en build. */
  IG.data = function (id) {
    var el = document.getElementById(id || 'page-data');
    return el ? JSON.parse(el.textContent) : {};
  };

  /* Memoria de la página: no usa almacenamiento del navegador. Lo creado se conserva mientras la página
     está abierta y se guarda en un archivo propio con «Guardar archivo» del estudio de ideas. */
  var MEM = {};
  IG.store = {
    get: function (k) { return Object.prototype.hasOwnProperty.call(MEM, k) ? JSON.parse(MEM[k]) : null; },
    set: function (k, v) { MEM[k] = JSON.stringify(v); if (IG.onChange) IG.onChange(); },
    del: function (k) { delete MEM[k]; if (IG.onChange) IG.onChange(); }
  };

  /* Una sola región de estado por página (role=status, aria-live=polite). */
  IG.say = function (msg) {
    var el = document.getElementById('igl-status');
    if (!el) return;
    var span = el.querySelector('.msg') || el;
    span.textContent = '';
    window.setTimeout(function () { span.textContent = msg; }, 30);
  };

  IG.debounce = function (fn, ms) {
    var t; return function () { var a = arguments, s = this; clearTimeout(t); t = setTimeout(function () { fn.apply(s, a); }, ms); };
  };

  /* Constructor de nodos: todo el texto entra por textContent (nunca se inserta HTML con datos). */
  IG.h = function (tag, attrs) {
    var svgTags = /^(svg|g|path|circle|line|rect|text|polygon|polyline|title)$/;
    var el = svgTags.test(tag) ? document.createElementNS('http://www.w3.org/2000/svg', tag) : document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'on') { Object.keys(v).forEach(function (ev) { el.addEventListener(ev, v[ev]); }); }
      else if (k === 'text') el.textContent = v;
      else if (k === 'value') el.value = v;
      else el.setAttribute(k, v === true ? '' : String(v));
    });
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c === null || c === undefined || c === false) continue;
      if (Array.isArray(c)) c.forEach(function (x) { if (x) el.appendChild(typeof x === 'string' ? document.createTextNode(x) : x); });
      else el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return el;
  };

  /* Re-render conservando el foco: los elementos enfocables llevan data-k. */
  IG.render = function (container, buildFn) {
    var a = document.activeElement, key = a && a.getAttribute && a.getAttribute('data-k');
    var selStart = a && 'selectionStart' in a ? a.selectionStart : null;
    var node = buildFn();
    container.replaceChildren(node);
    if (key) {
      var t = container.querySelector('[data-k="' + key.replace(/"/g, '') + '"]');
      if (t) { t.focus({ preventScroll: true }); if (selStart !== null && 'setSelectionRange' in t) { try { t.setSelectionRange(selStart, selStart); } catch (e) {} } }
    }
  };

  IG.uid = function () { return Math.random().toString(36).slice(2, 9); };
  IG.clone = function (o) { return JSON.parse(JSON.stringify(o)); };
  IG.pick = function (arr, not) { if (arr.length < 2) return 0; var i; do { i = Math.floor(Math.random() * arr.length); } while (i === not); return i; };
})();


function iglStart(lang) {
  var IG = window.IGL, h = IG.h, D = IG.data('igl-data-' + lang), L = lang, KEY = 'ig-taller-lab-' + lang;
  var T = function (es, en) { return L === 'es' ? es : en; };
  var tx = function (o) { return o[L]; };

  var TEMAS = Object.keys(D.temas);
  function bank(src, tema) { return (src.libre || []).concat(tema !== 'libre' && src[tema] ? src[tema] : []); }
  function blank() {
    return {
      mesa: 'historias', modo: 'sencillo', tema: 'libre', cuaderno: [],
      historias: { idx: { personaje: 0, lugar: 0, objeto: 0, situacion: 0 }, locks: {}, text: '' },
      ysi: { i: 0, own: '', answers: [], hints: false },
      inventa: { a: 0, b: 1, name: '', para: '', como: '', mejora: -1 },
      forma: { shapes: [], sel: -1, title: '', reto: 0 },
      usos: { obj: 0, list: [], dir: -1 },
      pov: { scene: 0, active: 0, texts: {} }
    };
  }
  var S = IG.store.get(KEY) || blank();
  var hist = {};           // pila de deshacer por mesa (en memoria)
  var editing = null;      // edición en línea en ¿Y si…?
  var confirmReset = false, confirmClear = false;
  var lab = document.getElementById('lab-app'), cuad = document.getElementById('cuaderno-app');

  function save() { IG.store.set(KEY, S); }
  function commit(mesa, fn, msg) {
    (hist[mesa] = hist[mesa] || []).push(IG.clone(S[mesa]));
    if (hist[mesa].length > 60) hist[mesa].shift();
    fn(S[mesa]); save(); draw(); if (msg) IG.say(msg);
  }
  function undo() {
    var st = hist[S.mesa]; if (!st || !st.length) { IG.say(T('Nada que deshacer.', 'Nothing to undo.')); return; }
    S[S.mesa] = st.pop(); save(); draw(); IG.say(T('Último cambio deshecho.', 'Last change undone.'));
  }
  function setErr(id, msg) { var el = document.getElementById(id); if (el) el.textContent = msg || ''; }
  function mesaInfo(k) { for (var i = 0; i < D.mesas.length; i++) if (D.mesas[i].k === k) return D.mesas[i]; }
  function addNote(n) { n.id = IG.uid(); S.cuaderno.unshift(n); save(); drawCuaderno(); IG.say(T('Guardado en Mi cuaderno.', 'Saved in My notebook.')); }

  /* ---------- cabecera del laboratorio: mesas, modo, tema ---------- */
  function head() {
    var mesas = h('ul', { class: 'mesas', 'aria-label': T('Actividades', 'Activities') },
      D.mesas.map(function (m) {
        return h('li', null, h('button', { class: 'btn', type: 'button', 'data-k': 'mesa-' + m.k, 'aria-pressed': S.mesa === m.k ? 'true' : 'false',
          on: { click: function () { S.mesa = m.k; confirmReset = false; save(); draw(); IG.say(T('Actividad ', 'Activity ') + m.n + ': ' + tx(m) + '.'); } } },
          svgIcon(m.g), h('span', null, h('span', { class: 'n', text: T('ACTIVIDAD ', 'ACTIVITY ') + m.n }), tx(m))));
      }));
    var modo = h('fieldset', null, h('legend', { text: T('Cantidad de piezas', 'Number of pieces') }),
      h('div', { class: 'row' }, [['sencillo', T('Sencillo', 'Simple')], ['mas', T('Más piezas', 'More pieces')]].map(function (o) {
        return h('button', { class: 'btn', type: 'button', 'data-k': 'modo-' + o[0], 'aria-pressed': S.modo === o[0] ? 'true' : 'false',
          on: { click: function () { S.modo = o[0]; save(); draw(); IG.say(T('Modo: ', 'Mode: ') + o[1] + '.'); } } }, o[1]);
      })));
    var tema = h('div', { class: 'field', style: 'max-width:320px' },
      h('label', { for: 'tema', text: T('Tema de las piezas', 'Theme of the pieces') }),
      h('select', { id: 'tema', 'data-k': 'tema', on: { change: function (ev) { S.tema = ev.target.value; resetIdx(); save(); draw(); IG.say(T('Tema: ', 'Theme: ') + tx(D.temas[S.tema]) + '.'); } } },
        TEMAS.map(function (k) { var o = h('option', { value: k, text: tx(D.temas[k]) }); if (k === S.tema) o.selected = true; return o; })),
      null);
    return h('div', { class: 'stack' }, mesas, h('div', { class: 'row', style: 'align-items:flex-start;gap:16px' }, modo, tema));
  }
  function resetIdx() {
    S.historias.idx = { personaje: 0, lugar: 0, objeto: 0, situacion: 0 }; S.historias.locks = {};
    S.ysi.i = 0; S.inventa.a = 0; S.inventa.b = 1; S.usos.obj = 0; S.pov.scene = 0; S.pov.active = 0;
  }
  function svgIcon(d) { return h('svg', { width: 26, height: 26, viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false' },
    h('path', { d: d, fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })); }

  function mesaHeader(m) {
    var hasHist = hist[m.k] && hist[m.k].length;
    var reset = confirmReset
      ? h('div', { class: 'row', role: 'group', 'aria-label': T('Confirmar reinicio', 'Confirm reset') },
          h('span', { text: T('¿Empezar de nuevo esta actividad?', 'Start this activity again?') }),
          h('button', { class: 'btn primary', type: 'button', 'data-k': 'reset-yes', on: { click: function () { confirmReset = false; commit(m.k, function (o) { var b = blank()[m.k]; Object.keys(o).forEach(function (k) { delete o[k]; }); Object.assign(o, b); }, T('Actividad en blanco. Puedes deshacerlo.', 'Activity cleared. You can undo it.')); } } }, T('Sí, empezar de nuevo', 'Yes, start again')),
          h('button', { class: 'btn', type: 'button', 'data-k': 'reset-no', on: { click: function () { confirmReset = false; draw(); IG.say(T('No se ha borrado nada.', 'Nothing was cleared.')); } } }, T('No, seguir', 'No, keep going')))
      : h('button', { class: 'btn ghost', type: 'button', 'data-k': 'reset', on: { click: function () { confirmReset = true; draw(); } } }, T('Empezar de nuevo', 'Start again'));
    return h('div', { class: 'row', style: 'justify-content:space-between;align-items:flex-end' },
      h('div', { class: 'stack', style: 'gap:6px;max-width:62ch' }, h('p', { class: 'eyebrow', text: T('Actividad ', 'Activity ') + m.n }),
        h('h3', { id: 'h-mesa', text: tx(m) }), h('p', { text: m['ins_' + L] })),
      h('div', { class: 'row' }, h('button', { class: 'btn', type: 'button', 'data-k': 'undo', disabled: hasHist ? null : true, on: { click: undo } }, T('Deshacer', 'Undo')), reset));
  }

  /* ---------- T01 Laboratorio de historias ---------- */
  function historias() {
    var st = S.historias, cats = S.modo === 'mas' ? ['personaje', 'lugar', 'objeto', 'situacion'] : ['personaje', 'lugar', 'situacion'];
    var cards = cats.map(function (c) {
      var b = bank(D.t01[c], S.tema), i = st.idx[c] % b.length, lock = !!st.locks[c], lab = tx(D.t01_labels[c]);
      return h('li', { class: 'card' + (lock ? ' fixed' : '') },
        h('p', { class: 'tag', text: lab + (lock ? T(' · fijada', ' · kept') : '') }),
        h('p', { class: 'val', text: tx(b[i]) }),
        h('div', { class: 'row' },
          h('button', { class: 'btn', type: 'button', 'data-k': 'otra-' + c, disabled: lock ? true : null, 'aria-label': T('Otra opción de ', 'Another option for ') + lab.toLowerCase(),
            on: { click: function () { commit('historias', function (o) { o.idx[c] = IG.pick(b, i); }, lab + T(': nueva pieza. ¿Qué cambia ahora en tu historia?', ': new piece. What changes in your story now?')); } } }, T('Otra', 'Another')),
          h('button', { class: 'btn', type: 'button', 'data-k': 'fijar-' + c, 'aria-pressed': lock ? 'true' : 'false', 'aria-label': T('Fijar ', 'Keep ') + lab.toLowerCase(),
            on: { click: function () { commit('historias', function (o) { o.locks[c] = !lock; }, lab + (lock ? T(': suelta.', ': released.') : T(': fijada.', ': kept.'))); } } }, T('Fijar', 'Keep'))));
    });
    var allLocked = cats.every(function (c) { return st.locks[c]; });
    return h('div', { class: 'stack' },
      h('ul', { class: 'grid', style: 'list-style:none;margin:0;padding:0', 'aria-label': T('Piezas de la historia', 'Story pieces') }, cards),
      h('div', { class: 'row' }, h('button', { class: 'btn', type: 'button', 'data-k': 'barajar', on: { click: function () {
        if (allLocked) { IG.say(T('Todas las piezas están fijadas. Suelta alguna para barajar.', 'All pieces are kept. Release one to shuffle.')); return; }
        commit('historias', function (o) { cats.forEach(function (c) { if (!o.locks[c]) o.idx[c] = IG.pick(bank(D.t01[c], S.tema), o.idx[c]); }); }, T('Piezas no fijadas cambiadas.', 'Unkept pieces changed.')); } } }, T('Barajar lo que no está fijado', 'Shuffle what is not kept'))),
      h('div', { class: 'field' }, h('label', { for: 't01-text', text: T('Tu historia (escribirla es opcional; también puedes contarla en voz alta)', 'Your story (writing is optional; you can also tell it out loud)') }),
        h('textarea', { id: 't01-text', 'data-k': 't01-text', value: st.text, on: { input: function (ev) { st.text = ev.target.value; save(); } } })),
      h('p', { class: 'err', role: 'alert', id: 'err-t01' }),
      h('div', { class: 'row' }, h('button', { class: 'btn primary', type: 'button', 'data-k': 't01-save', on: { click: function () {
        if (!st.text.trim()) { setErr('err-t01', T('Escribe al menos una frase antes de guardar.', 'Write at least one sentence before saving.')); return; }
        setErr('err-t01', ''); var pcs = cats.map(function (c) { return tx(bank(D.t01[c], S.tema)[st.idx[c] % bank(D.t01[c], S.tema).length]); }).join(' · ');
        addNote({ mesa: 'historias', title: T('Historia', 'Story'), text: pcs + '\n\n' + st.text }); } } }, T('Guardar en Mi cuaderno', 'Save in My notebook'))));
  }

  /* ---------- T02 ¿Y si…? ---------- */
  function ysi() {
    var st = S.ysi, b = bank(D.t02, S.tema), prem = st.own.trim() ? st.own : tx(b[st.i % b.length]);
    var list = h('ol', { class: 'items', 'aria-label': T('Mis respuestas', 'My answers') }, st.answers.map(function (a, i) {
      if (editing === i) {
        return h('li', null, h('label', { class: 'visually-hidden', for: 'edit-' + i, text: T('Editar respuesta ', 'Edit answer ') + (i + 1) }),
          h('input', { type: 'text', id: 'edit-' + i, 'data-k': 'edit-' + i, value: a, class: 't',
            on: { keydown: function (ev) { if (ev.key === 'Escape') { editing = null; draw(); IG.say(T('Edición cancelada.', 'Edit cancelled.')); } if (ev.key === 'Enter') doSave(i, ev.target.value); } } }),
          h('button', { class: 'btn primary', type: 'button', 'data-k': 'edit-ok-' + i, on: { click: function () { doSave(i, document.getElementById('edit-' + i).value); } } }, T('Guardar', 'Save')),
          h('button', { class: 'btn', type: 'button', 'data-k': 'edit-no-' + i, on: { click: function () { editing = null; draw(); } } }, T('Cancelar', 'Cancel')));
      }
      return h('li', null, h('span', { class: 't', text: a }),
        h('button', { class: 'btn', type: 'button', 'data-k': 'ed-' + i, 'aria-label': T('Editar respuesta ', 'Edit answer ') + (i + 1), on: { click: function () { editing = i; draw(); var el = document.getElementById('edit-' + i); if (el) el.focus(); } } }, T('Editar', 'Edit')),
        h('button', { class: 'btn', type: 'button', 'data-k': 'del-' + i, 'aria-label': T('Quitar respuesta ', 'Remove answer ') + (i + 1), on: { click: function () { commit('ysi', function (o) { o.answers.splice(i, 1); }, T('Respuesta quitada.', 'Answer removed.')); focusK('ysi-in'); } } }, T('Quitar', 'Remove')));
    }));
    function doSave(i, v) { v = v.trim(); if (!v) return; editing = null; commit('ysi', function (o) { o.answers[i] = v; }, T('Respuesta cambiada.', 'Answer changed.')); }
    function add() {
      var el = document.getElementById('ysi-in'), v = el.value.trim();
      if (!v) { setErr('err-t02', T('Escribe una respuesta antes de añadirla.', 'Write an answer before adding it.')); return; }
      setErr('err-t02', ''); commit('ysi', function (o) { o.answers.push(v); }, T('Respuesta añadida. Tienes ', 'Answer added. You have ') + (st.answers.length + 1) + T(' respuestas.', ' answers.'));
      focusK('ysi-in');
    }
    return h('div', { class: 'stack' },
      h('div', { class: 'card' }, h('p', { class: 'tag', text: st.own.trim() ? T('Tu pregunta', 'Your question') : T('Pregunta', 'Question') }), h('p', { class: 'val', text: prem }),
        h('div', { class: 'row' }, h('button', { class: 'btn', type: 'button', 'data-k': 'ysi-otra', on: { click: function () { commit('ysi', function (o) { o.own = ''; o.i = IG.pick(b, o.i); }, T('Nueva pregunta.', 'New question.')); } } }, T('Otra pregunta', 'Another question')),
          h('button', { class: 'btn', type: 'button', 'data-k': 'ysi-hints', 'aria-expanded': st.hints ? 'true' : 'false', 'aria-controls': 'ysi-hints-list', on: { click: function () { st.hints = !st.hints; save(); draw(); } } }, T('Piensa en…', 'Think about…'))),
        st.hints ? h('ul', { id: 'ysi-hints-list' }, D.t02_hints.map(function (x) { return h('li', { text: tx(x) }); })) : null),
      h('div', { class: 'field' }, h('label', { for: 'ysi-own', text: T('O escribe tu propia pregunta «¿Y si…?» (opcional)', 'Or write your own "What if…?" question (optional)') }),
        h('input', { type: 'text', id: 'ysi-own', 'data-k': 'ysi-own', value: st.own, on: { change: function (ev) { commit('ysi', function (o) { o.own = ev.target.value; }, T('Pregunta propia guardada.', 'Own question saved.')); } } })),
      h('div', { class: 'field' }, h('label', { for: 'ysi-in', text: T('Una respuesta', 'An answer') }),
        h('div', { class: 'row', style: 'flex-wrap:nowrap' }, h('input', { type: 'text', id: 'ysi-in', 'data-k': 'ysi-in', on: { keydown: function (ev) { if (ev.key === 'Enter') add(); } } }),
          h('button', { class: 'btn primary', type: 'button', 'data-k': 'ysi-add', on: { click: add } }, T('Añadir', 'Add')))),
      h('p', { class: 'err', role: 'alert', id: 'err-t02' }),
      h('p', { text: st.answers.length ? T('Tienes ', 'You have ') + st.answers.length + T(' respuestas.', ' answers.') : T('Aún no hay respuestas. No hay una correcta: vale cualquiera.', 'No answers yet. There is no right one: any answer is fine.') , class: st.answers.length ? '' : 'empty' }),
      list,
      h('div', { class: 'row' }, h('button', { class: 'btn primary', type: 'button', 'data-k': 't02-save', disabled: st.answers.length ? null : true, on: { click: function () { addNote({ mesa: 'ysi', title: prem, text: st.answers.map(function (a, i) { return (i + 1) + '. ' + a; }).join('\n') }); } } }, T('Guardar en Mi cuaderno', 'Save in My notebook'))));
  }

  /* ---------- T03 Inventa algo nuevo ---------- */
  function inventa() {
    var st = S.inventa, b = bank(D.t03, S.tema), A = tx(b[st.a % b.length]), B = tx(b[st.b % b.length]);
    function other(not) { var i = IG.pick(b, not); if (i === not) i = (not + 1) % b.length; return i; }
    function field(id, lab, key, area) {
      var attrs = { id: id, 'data-k': id, value: st[key], on: { input: function (ev) { st[key] = ev.target.value; save(); } } };
      return h('div', { class: 'field' }, h('label', { for: id, text: lab }), area ? h('textarea', attrs) : h('input', Object.assign({ type: 'text' }, attrs)));
    }
    return h('div', { class: 'stack' },
      h('ul', { class: 'grid', style: 'list-style:none;margin:0;padding:0', 'aria-label': T('Combinación', 'Combination') },
        h('li', { class: 'card' }, h('p', { class: 'tag', text: 'A' }), h('p', { class: 'val', text: A }),
          h('button', { class: 'btn', type: 'button', 'data-k': 'inv-a', on: { click: function () { commit('inventa', function (o) { var n = other(o.a); if (n === o.b) n = other(n); o.a = n; }, T('Cambiado A.', 'A changed.')); } } }, T('Cambiar A', 'Change A'))),
        h('li', { class: 'card' }, h('p', { class: 'tag', text: 'B' }), h('p', { class: 'val', text: B }),
          h('button', { class: 'btn', type: 'button', 'data-k': 'inv-b', on: { click: function () { commit('inventa', function (o) { var n = other(o.b); if (n === o.a) n = other(n); o.b = n; }, T('Cambiado B.', 'B changed.')); } } }, T('Cambiar B', 'Change B')))),
      h('div', { class: 'row' }, h('button', { class: 'btn', type: 'button', 'data-k': 'inv-otra', on: { click: function () { commit('inventa', function (o) { o.a = other(o.a); o.b = other(o.a); if (o.b === o.a) o.b = (o.a + 1) % b.length; }, T('Otra combinación.', 'Another combination.')); } } }, T('Otra combinación', 'Another combination'))),
      field('inv-name', T('Nombre del invento', 'Name of the invention'), 'name'),
      field('inv-para', T('Para qué sirve (opcional)', 'What it is for (optional)'), 'para', true),
      field('inv-como', T('Cómo funciona (opcional)', 'How it works (optional)'), 'como', true),
      h('div', { class: 'row' }, h('button', { class: 'btn', type: 'button', 'data-k': 'inv-mejora', on: { click: function () { commit('inventa', function (o) { o.mejora = (o.mejora + 1) % D.t03_mejora.length; }, tx(D.t03_mejora[(st.mejora + 1) % D.t03_mejora.length])); } } }, T('Mejóralo', 'Improve it'))),
      st.mejora >= 0 ? h('p', { class: 'card', text: tx(D.t03_mejora[st.mejora]) }) : null,
      h('p', { class: 'err', role: 'alert', id: 'err-t03' }),
      h('div', { class: 'row' }, h('button', { class: 'btn primary', type: 'button', 'data-k': 't03-save', on: { click: function () {
        if (!st.name.trim()) { setErr('err-t03', T('Ponle un nombre al invento antes de guardarlo.', 'Give the invention a name before saving it.')); focusK('inv-name'); return; }
        setErr('err-t03', ''); addNote({ mesa: 'inventa', title: st.name, text: A + ' + ' + B + (st.para ? '\n' + T('Para: ', 'For: ') + st.para : '') + (st.como ? '\n' + T('Cómo: ', 'How: ') + st.como : '') }); } } }, T('Guardar en Mi cuaderno', 'Save in My notebook'))));
  }

  /* ---------- T04 Transforma la forma ---------- */
  var GRID = 9, CELL = 40;
  function shapeName(s) { return tx(D.shapes[s.t]); }
  function describe(s, i) {
    return (i + 1) + '. ' + shapeName(s) + ', ' + tx(D.fills[s.c]) + ', ' + T('fila ', 'row ') + (s.r + 1) + ', ' + T('columna ', 'column ') + (s.col + 1) +
      (s.rot ? ', ' + T('girada ', 'turned ') + s.rot + '°' : '') + (s.sc !== 1 ? ', ' + T('tamaño ', 'size ') + Math.round(s.sc * 100) + '%' : '') + (s.flip ? ', ' + T('reflejada', 'mirrored') : '');
  }
  function shapeSvg(s, sel) {
    var x = s.col * CELL + CELL / 2, y = s.r * CELL + CELL / 2;
    return h('path', { d: D.shapes[s.t].d, fill: D.fills[s.c].c, stroke: sel ? '#17395c' : 'none', 'stroke-width': sel ? 3 : 0, 'stroke-dasharray': sel ? '6 4' : null,
      transform: 'translate(' + x + ' ' + y + ') rotate(' + s.rot + ') scale(' + (s.flip ? -s.sc : s.sc) * 0.5 + ' ' + s.sc * 0.5 + ')' });
  }
  function formaSvgMarkup(shapes) {
    var svg = h('svg', { viewBox: '0 0 360 360', 'aria-hidden': 'true', focusable: 'false' });
    shapes.forEach(function (s) { svg.appendChild(shapeSvg(s, false)); });
    return svg;
  }
  function forma() {
    var st = S.forma, sel = st.shapes[st.sel], mas = S.modo === 'mas';
    function act(fn, msg) { if (!sel) { IG.say(T('Primero elige una pieza de la lista.', 'First choose a piece from the list.')); return; } commit('forma', function (o) { fn(o.shapes[o.sel]); }, msg); }
    function move(dr, dc) { act(function (s) { s.r = Math.max(0, Math.min(GRID - 1, s.r + dr)); s.col = Math.max(0, Math.min(GRID - 1, s.col + dc)); }, T('Pieza movida.', 'Piece moved.')); }
    var svg = h('svg', { viewBox: '0 0 360 360', 'aria-hidden': 'true', focusable: 'false' });
    for (var g = 1; g < GRID; g++) { svg.appendChild(h('line', { x1: g * CELL, y1: 0, x2: g * CELL, y2: 360, stroke: '#dfe6ef', 'stroke-width': 1 })); svg.appendChild(h('line', { x1: 0, y1: g * CELL, x2: 360, y2: g * CELL, stroke: '#dfe6ef', 'stroke-width': 1 })); }
    st.shapes.forEach(function (s, i) { var p = shapeSvg(s, i === st.sel); p.addEventListener('click', function () { st.sel = i; save(); draw(); IG.say(T('Pieza ', 'Piece ') + (i + 1) + T(' elegida.', ' chosen.')); }); p.style.cursor = 'pointer'; svg.appendChild(p); });
    var canvas = h('div', { class: 'canvas', role: 'group', tabindex: '0', 'data-k': 'canvas', 'aria-label': T('Lienzo. Con el foco aquí: las flechas mueven la pieza elegida, R la gira, + y − cambian el tamaño.', 'Canvas. With focus here: arrows move the chosen piece, R turns it, + and − change its size.'), 'aria-describedby': 'forma-desc',
      on: { keydown: function (ev) {
        var k = ev.key, map = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
        if (map[k]) { ev.preventDefault(); move(map[k][0], map[k][1]); }
        else if (k === 'r' || k === 'R') { ev.preventDefault(); act(function (s) { s.rot = (s.rot + 45) % 360; }, T('Girada 45°.', 'Turned 45°.')); }
        else if (k === '+' || k === '=') { ev.preventDefault(); act(function (s) { s.sc = Math.min(2, +(s.sc + 0.25).toFixed(2)); }, T('Más grande.', 'Bigger.')); }
        else if (k === '-') { ev.preventDefault(); act(function (s) { s.sc = Math.max(0.5, +(s.sc - 0.25).toFixed(2)); }, T('Más pequeña.', 'Smaller.')); }
      } } }, svg);
    var desc = h('div', { class: 'stack', style: 'gap:8px' }, h('h4', { id: 'forma-desc-h', text: T('Qué hay en el dibujo', 'What is in the drawing') }),
      st.shapes.length ? h('ul', { class: 'pieces', id: 'forma-desc', style: 'list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px' }, st.shapes.map(function (s, i) {
        return h('li', null, h('button', { class: 'btn', type: 'button', 'data-k': 'piece-' + i, 'aria-pressed': i === st.sel ? 'true' : 'false', on: { click: function () { st.sel = i; save(); draw(); IG.say(T('Pieza ', 'Piece ') + (i + 1) + T(' elegida.', ' chosen.')); } } }, describe(s, i) + (i === st.sel ? T(' (elegida)', ' (chosen)') : '')));
      })) : h('p', { class: 'empty', id: 'forma-desc', text: T('El lienzo está vacío. Añade una forma para empezar.', 'The canvas is empty. Add a shape to start.') }));
    var adders = h('div', { class: 'row', role: 'group', 'aria-label': T('Añadir pieza', 'Add piece') }, Object.keys(D.shapes).map(function (k) {
      return h('button', { class: 'btn', type: 'button', 'data-k': 'add-' + k, 'aria-label': T('Añadir ', 'Add ') + tx(D.shapes[k]).toLowerCase(), on: { click: function () {
        if (st.shapes.length >= 12) { IG.say(T('Máximo 12 piezas.', 'Maximum 12 pieces.')); return; }
        commit('forma', function (o) { o.shapes.push({ t: k, r: 4, col: 4, rot: 0, sc: 1, flip: false, c: o.shapes.length % D.fills.length }); o.sel = o.shapes.length - 1; }, tx(D.shapes[k]) + T(' añadido en el centro.', ' added in the centre.')); } } },
        h('svg', { width: 22, height: 22, viewBox: '-50 -50 100 100', 'aria-hidden': 'true', focusable: 'false' }, h('path', { d: D.shapes[k].d, fill: 'currentColor' })), tx(D.shapes[k]));
    }));
    var tools = h('div', { class: 'row', role: 'group', 'aria-label': T('Cambiar la pieza elegida', 'Change the chosen piece') },
      h('button', { class: 'btn', type: 'button', 'data-k': 'mv-l', 'aria-label': T('Mover a la izquierda', 'Move left'), on: { click: function () { move(0, -1); } } }, '←'),
      h('button', { class: 'btn', type: 'button', 'data-k': 'mv-u', 'aria-label': T('Mover arriba', 'Move up'), on: { click: function () { move(-1, 0); } } }, '↑'),
      h('button', { class: 'btn', type: 'button', 'data-k': 'mv-d', 'aria-label': T('Mover abajo', 'Move down'), on: { click: function () { move(1, 0); } } }, '↓'),
      h('button', { class: 'btn', type: 'button', 'data-k': 'mv-r', 'aria-label': T('Mover a la derecha', 'Move right'), on: { click: function () { move(0, 1); } } }, '→'),
      h('button', { class: 'btn', type: 'button', 'data-k': 'rot', on: { click: function () { act(function (s) { s.rot = (s.rot + 45) % 360; }, T('Girada 45°.', 'Turned 45°.')); } } }, T('Girar', 'Turn')),
      h('button', { class: 'btn', type: 'button', 'data-k': 'big', on: { click: function () { act(function (s) { s.sc = Math.min(2, +(s.sc + 0.25).toFixed(2)); }, T('Más grande.', 'Bigger.')); } } }, T('Agrandar', 'Enlarge')),
      h('button', { class: 'btn', type: 'button', 'data-k': 'small', on: { click: function () { act(function (s) { s.sc = Math.max(0.5, +(s.sc - 0.25).toFixed(2)); }, T('Más pequeña.', 'Smaller.')); } } }, T('Achicar', 'Shrink')),
      mas ? h('button', { class: 'btn', type: 'button', 'data-k': 'flip', on: { click: function () { act(function (s) { s.flip = !s.flip; }, T('Reflejada.', 'Mirrored.')); } } }, T('Reflejar', 'Mirror')) : null,
      mas ? h('button', { class: 'btn', type: 'button', 'data-k': 'color', on: { click: function () { act(function (s) { s.c = (s.c + 1) % D.fills.length; }, T('Color cambiado.', 'Colour changed.')); } } }, T('Color', 'Colour')) : null,
      h('button', { class: 'btn', type: 'button', 'data-k': 'rm', on: { click: function () { if (!sel) { IG.say(T('Primero elige una pieza de la lista.', 'First choose a piece from the list.')); return; } commit('forma', function (o) { o.shapes.splice(o.sel, 1); o.sel = o.shapes.length ? 0 : -1; }, T('Pieza quitada.', 'Piece removed.')); } } }, T('Quitar pieza', 'Remove piece')));
    return h('div', { class: 'stack' },
      h('div', { class: 'card' }, h('p', { class: 'tag', text: T('Reto (opcional)', 'Challenge (optional)') }), h('p', { class: 'val', text: tx(D.t04_retos[st.reto % D.t04_retos.length]) }),
        h('div', null, h('button', { class: 'btn', type: 'button', 'data-k': 'reto', on: { click: function () { commit('forma', function (o) { o.reto = IG.pick(D.t04_retos, o.reto); }, T('Otro reto.', 'Another challenge.')); } } }, T('Otro reto', 'Another challenge')))),
      adders,
      h('div', { class: 'canvas-wrap' }, canvas, desc),
      tools,
      h('div', { class: 'field' }, h('label', { for: 'forma-title', text: T('¿Qué ves? Ponle un título', 'What do you see? Give it a title') }),
        h('input', { type: 'text', id: 'forma-title', 'data-k': 'forma-title', value: st.title, on: { input: function (ev) { st.title = ev.target.value; save(); } } })),
      h('p', { class: 'err', role: 'alert', id: 'err-t04' }),
      h('div', { class: 'row' }, h('button', { class: 'btn primary', type: 'button', 'data-k': 't04-save', on: { click: function () {
        if (!st.shapes.length) { setErr('err-t04', T('Añade al menos una pieza.', 'Add at least one piece.')); return; }
        if (!st.title.trim()) { setErr('err-t04', T('Ponle un título antes de guardar.', 'Give it a title before saving.')); focusK('forma-title'); return; }
        setErr('err-t04', ''); addNote({ mesa: 'forma', title: st.title, text: st.shapes.map(describe).join('\n'), shapes: IG.clone(st.shapes) }); } } }, T('Guardar en Mi cuaderno', 'Save in My notebook'))));
  }

  /* ---------- T05 Muchos usos ---------- */
  function usos() {
    var st = S.usos, b = bank(D.t05, S.tema), obj = tx(b[st.obj % b.length]);
    var groups = {}; st.list.forEach(function (u) { groups[u.g] = 1; });
    function add() {
      var el = document.getElementById('uso-in'), g = +document.getElementById('uso-g').value, v = el.value.trim();
      if (!v) { setErr('err-t05', T('Escribe un uso antes de añadirlo.', 'Write a use before adding it.')); return; }
      setErr('err-t05', ''); var n = st.list.length + 1, ng = Object.keys(Object.assign({}, groups, (function () { var o = {}; o[g] = 1; return o; })())).length;
      commit('usos', function (o) { o.list.push({ t: v, g: g }); }, T('Uso añadido. ', 'Use added. ') + n + T(' usos en ', ' uses in ') + ng + T(' grupos.', ' groups.'));
      focusK('uso-in');
    }
    return h('div', { class: 'stack' },
      h('div', { class: 'card' }, h('p', { class: 'tag', text: T('Objeto', 'Object') }), h('p', { class: 'val', text: obj }),
        h('div', { class: 'row' }, h('button', { class: 'btn', type: 'button', 'data-k': 'uso-otro', on: { click: function () { commit('usos', function (o) { o.obj = IG.pick(b, o.obj); o.list = []; o.dir = -1; }, T('Otro objeto. La lista empieza de nuevo; puedes deshacerlo.', 'Another object. The list starts again; you can undo it.')); } } }, T('Otro objeto', 'Another object')),
          h('button', { class: 'btn', type: 'button', 'data-k': 'uso-dir', on: { click: function () { commit('usos', function (o) { o.dir = (o.dir + 1) % D.t05_dirs.length; }, tx(D.t05_dirs[(st.dir + 1) % D.t05_dirs.length])); } } }, T('Prueba otra dirección', 'Try another direction'))),
        st.dir >= 0 ? h('p', { text: tx(D.t05_dirs[st.dir]) }) : null),
      h('div', { class: 'row', style: 'align-items:flex-end' },
        h('div', { class: 'field', style: 'flex:2 1 240px' }, h('label', { for: 'uso-in', text: T('Un uso', 'A use') }), h('input', { type: 'text', id: 'uso-in', 'data-k': 'uso-in', on: { keydown: function (ev) { if (ev.key === 'Enter') add(); } } })),
        h('div', { class: 'field', style: 'flex:1 1 160px' }, h('label', { for: 'uso-g', text: T('Grupo (opcional)', 'Group (optional)') }), h('select', { id: 'uso-g', 'data-k': 'uso-g' }, D.t05_groups.map(function (g, i) { return h('option', { value: i, text: tx(g) }); }))),
        h('button', { class: 'btn primary', type: 'button', 'data-k': 'uso-add', on: { click: add } }, T('Añadir', 'Add'))),
      h('p', { class: 'err', role: 'alert', id: 'err-t05' }),
      h('p', { class: st.list.length ? '' : 'empty', text: st.list.length ? st.list.length + T(' usos en ', ' uses in ') + Object.keys(groups).length + T(' grupos.', ' groups.') : T('Sin usos todavía. Empieza por el más obvio y luego aléjate de él.', 'No uses yet. Start with the obvious one, then move away from it.') }),
      h('ol', { class: 'items', 'aria-label': T('Usos', 'Uses') }, st.list.map(function (u, i) {
        return h('li', null, h('span', { class: 't', text: u.t + ' · ' + tx(D.t05_groups[u.g]) }),
          h('button', { class: 'btn', type: 'button', 'data-k': 'uso-del-' + i, 'aria-label': T('Quitar uso ', 'Remove use ') + (i + 1), on: { click: function () { commit('usos', function (o) { o.list.splice(i, 1); }, T('Uso quitado.', 'Use removed.')); focusK('uso-in'); } } }, T('Quitar', 'Remove')));
      })),
      h('div', { class: 'row' }, h('button', { class: 'btn primary', type: 'button', 'data-k': 't05-save', disabled: st.list.length ? null : true, on: { click: function () { addNote({ mesa: 'usos', title: obj, text: st.list.map(function (u, i) { return (i + 1) + '. ' + u.t + ' (' + tx(D.t05_groups[u.g]) + ')'; }).join('\n') }); } } }, T('Guardar en Mi cuaderno', 'Save in My notebook'))));
  }

  /* ---------- T06 Cambia el punto de vista (patrón ARIA Tabs) ---------- */
  function pov() {
    var st = S.pov, b = bank(D.t06, S.tema), sc = b[st.scene % b.length], m = sc.miradas;
    var tabs = h('div', { role: 'tablist', 'aria-label': T('Miradas', 'Viewpoints') }, m.map(function (x, i) {
      var has = (st.texts[st.scene + '-' + i] || '').trim();
      return h('button', { role: 'tab', class: 'btn', type: 'button', id: 'tab-' + i, 'data-k': 'tab-' + i, 'aria-selected': i === st.active ? 'true' : 'false', 'aria-controls': 'panel-pov', tabindex: i === st.active ? '0' : '-1',
        on: { click: function () { st.active = i; save(); draw(); }, keydown: function (ev) {
          var n = m.length, j = null; if (ev.key === 'ArrowRight') j = (i + 1) % n; if (ev.key === 'ArrowLeft') j = (i - 1 + n) % n; if (ev.key === 'Home') j = 0; if (ev.key === 'End') j = n - 1;
          if (j !== null) { ev.preventDefault(); st.active = j; save(); draw(); focusK('tab-' + j); } } } },
        tx(x) + (has ? T(' · con texto', ' · has text') : T(' · vacía', ' · empty')));
    }));
    var key = st.scene + '-' + st.active;
    var panel = h('div', { role: 'tabpanel', id: 'panel-pov', 'aria-labelledby': 'tab-' + st.active, class: 'stack' },
      h('div', { class: 'field' }, h('label', { for: 'pov-text', text: tx(m[st.active]) + '. ' + tx(D.t06_q) }),
        h('textarea', { id: 'pov-text', 'data-k': 'pov-text', value: st.texts[key] || '', on: { input: function (ev) { st.texts[key] = ev.target.value; save(); } } })));
    var filled = m.map(function (x, i) { return { l: tx(x), t: (st.texts[st.scene + '-' + i] || '').trim() }; }).filter(function (o) { return o.t; });
    return h('div', { class: 'stack' },
      h('div', { class: 'card' }, h('p', { class: 'tag', text: T('Escena', 'Scene') }), h('p', { text: tx(sc) }),
        h('div', null, h('button', { class: 'btn', type: 'button', 'data-k': 'pov-otra', on: { click: function () { commit('pov', function (o) { o.scene = IG.pick(b, o.scene); o.active = 0; }, T('Otra escena. Tus textos de la anterior se conservan.', 'Another scene. Your texts from the previous one are kept.')); } } }, T('Otra escena', 'Another scene')))),
      tabs, panel,
      h('h4', { text: T('Comparar miradas', 'Compare viewpoints') }),
      filled.length ? h('ul', { class: 'items' }, filled.map(function (o) { return h('li', null, h('span', { class: 't' }, h('strong', { text: o.l + ': ' }), o.t)); })) : h('p', { class: 'empty', text: T('Escribe en alguna mirada para compararlas aquí.', 'Write in a viewpoint to compare them here.') }),
      h('div', { class: 'row' }, h('button', { class: 'btn primary', type: 'button', 'data-k': 't06-save', disabled: filled.length ? null : true, on: { click: function () { addNote({ mesa: 'pov', title: T('Puntos de vista', 'Viewpoints'), text: tx(sc) + '\n\n' + filled.map(function (o) { return o.l + ': ' + o.t; }).join('\n') }); } } }, T('Guardar en Mi cuaderno', 'Save in My notebook'))));
  }

  var BUILD = { historias: historias, ysi: ysi, inventa: inventa, forma: forma, usos: usos, pov: pov };
  function focusK(k) { window.setTimeout(function () { var el = document.querySelector('[data-k="' + k + '"]'); if (el) el.focus(); }, 0); }

  function draw() {
    var m = mesaInfo(S.mesa);
    IG.render(lab, function () {
      return h('div', { class: 'stack' }, head(), h('section', { class: 'stack', 'aria-labelledby': 'h-mesa' }, mesaHeader(m), BUILD[S.mesa]()));
    });
    drawCuaderno();
  }

  /* ---------- Mi cuaderno ---------- */
  function drawCuaderno() {
    IG.render(cuad, function () {
      if (!S.cuaderno.length) return h('p', { class: 'empty', text: T('Todavía no has guardado nada. Lo que guardes en las actividades aparecerá aquí mientras tengas abierta esta página.', 'You have not saved anything yet. What you save in the activities will appear here while this page is open.') });
      return h('div', { class: 'stack' }, h('p', { text: S.cuaderno.length === 1 ? T('1 cosa guardada en esta página.', '1 thing saved on this page.') : S.cuaderno.length + T(' cosas guardadas en esta página.', ' things saved on this page.') }),
        h('ul', { style: 'list-style:none;margin:0;padding:0', class: 'stack' }, S.cuaderno.map(function (n) {
          var mi = mesaInfo(n.mesa);
          return h('li', { class: 'note', id: 'note-' + n.id },
            h('p', { class: 'tag', text: tx(mi) }), h('h3', { text: n.title }),
            n.shapes ? (function () { var s = formaSvgMarkup(n.shapes); s.setAttribute('aria-hidden', 'true'); return s; })() : null,
            h('pre', { text: n.text }),
            h('div', { class: 'row no-print' },
              h('button', { class: 'btn', type: 'button', 'data-k': 'copy-' + n.id, on: { click: function () { copy(n); } } }, T('Copiar texto', 'Copy text')),
              h('button', { class: 'btn', type: 'button', 'data-k': 'print-' + n.id, on: { click: function () { printNote(n.id); } } }, T('Imprimir', 'Print')),
              h('button', { class: 'btn ghost', type: 'button', 'data-k': 'rm-' + n.id, on: { click: function () { S.cuaderno = S.cuaderno.filter(function (x) { return x.id !== n.id; }); save(); drawCuaderno(); IG.say(T('Quitado de Mi cuaderno.', 'Removed from My notebook.')); focusK('h-cuaderno'); } } }, T('Quitar', 'Remove'))));
        })));
    });
  }
  function copy(n) {
    var text = n.title + '\n\n' + n.text;
    function ok() { IG.say(T('Texto copiado.', 'Text copied.')); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fallback); else fallback();
    function fallback() { var t = h('textarea', { value: text, 'aria-hidden': 'true', style: 'position:fixed;left:-9999px' }); document.body.appendChild(t); t.select(); try { document.execCommand('copy'); ok(); } catch (e) { IG.say(T('No se ha podido copiar. Selecciona el texto a mano.', 'Could not copy. Select the text manually.')); } t.remove(); }
  }
  function printNote(id) {
    document.body.classList.add('printing-note');
    var el = document.getElementById('note-' + id); if (el) el.classList.add('print-target');
    window.addEventListener('afterprint', function done() { document.body.classList.remove('printing-note'); if (el) el.classList.remove('print-target'); window.removeEventListener('afterprint', done); });
    window.print();
  }

  /* ---------- borrar sesión (confirmación en la página, sin confirm()) ---------- */
  var clearBtn = document.getElementById('clear-session');
  clearBtn.addEventListener('click', function () {
    var box = document.getElementById('session-alert');
    if (!confirmClear) { confirmClear = true; clearBtn.textContent = T('Pulsa otra vez para borrar todo', 'Press again to clear everything'); box.textContent = T('Se borrará todo lo de esta página, también Mi cuaderno.', 'Everything on this page will be deleted, including My notebook.'); return; }
    confirmClear = false; clearBtn.textContent = T('Borrar todo lo de esta página', 'Clear everything on this page'); box.textContent = '';
    IG.store.del(KEY); S = blank(); hist = {}; draw(); IG.say(T('Todo borrado.', 'Everything cleared.'));
  });

  IG._undo = undo;
  draw();
}

/* Bloque «Prueba aquí mismo» del Taller de Iris Green.
   Se monta dentro de la página existente, sigue su idioma (atributo lang) y no crea cabecera, menú ni pie propios.
   Sin red y sin evaluar código. Lo creado vive solo en la memoria de la página. */
(function () {
  'use strict';
  var IG = window.IGL, h = IG.h;
  var TXT = {
    es: { eyebrow: 'Para hacer aquí', title: 'Prueba aquí mismo', lede: 'Seis actividades para crear en la pantalla. Cambia piezas, escribe, dibuja con formas. No hay respuesta buena y no se puntúa.',
          priv: 'Lo que hagas se queda en esta página mientras la tengas abierta. No se envía a ningún sitio. Para conservarlo, usa «Guardar archivo».',
          start: 'Elige una actividad y empieza. Todo se puede deshacer.', clear: 'Borrar todo lo de esta página', cuad: 'Mi cuaderno',
          cuadNote: 'Lo que guardas desde las actividades. Puedes copiarlo o imprimirlo.' },
    en: { eyebrow: 'To do here', title: 'Try it right here', lede: 'Six activities to create on screen. Change pieces, write, draw with shapes. There is no right answer and nothing is scored.',
          priv: 'What you make stays on this page while it is open. It is not sent anywhere. To keep it, use “Save file”.',
          start: 'Choose an activity and start. Everything can be undone.', clear: 'Clear everything on this page', cuad: 'My notebook',
          cuadNote: 'What you save from the activities. You can copy it or print it.' }
  };
  var cur = null;
  function lang() { return (document.documentElement.getAttribute('lang') || 'es').slice(0, 2) === 'en' ? 'en' : 'es'; }
  function build(root) {
    var l = lang(), t = TXT[l];
    root.replaceChildren(
      h('section', { class: 'igl', 'aria-labelledby': 'igl-h' },
        h('p', { class: 'igl-eyebrow', text: t.eyebrow }),
        h('h2', { id: 'igl-h', class: 'igl-h2', text: t.title }),
        h('p', { class: 'igl-lede', text: t.lede }),
        h('p', { class: 'igl-priv' }, h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false' },
            h('path', { d: 'M6 11V8a6 6 0 0112 0v3M5 11h14v10H5z', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })), t.priv),
        h('p', { id: 'igl-status', class: 'igl-status', role: 'status', 'aria-live': 'polite' }, h('span', { class: 'msg', text: t.start })),
        h('div', { id: 'lab-app', class: 'igl-lab' }),
        h('section', { id: 'cuaderno', class: 'igl-cuaderno', 'aria-labelledby': 'h-cuaderno' },
          h('h3', { id: 'h-cuaderno', tabindex: '-1', text: t.cuad }),
          h('p', { class: 'igl-note', text: t.cuadNote }),
          h('div', { id: 'cuaderno-app' }),
          h('div', { class: 'row no-print' }, h('button', { class: 'btn ghost', type: 'button', id: 'clear-session', 'data-k': 'clear-session', text: t.clear })),
          h('p', { class: 'err', role: 'alert', id: 'session-alert' }))));
    cur = l; iglStart(l);
  }
  function mount() {
    var root = document.getElementById('igl-mount');
    if (!root) return;
    if (!root.firstChild || cur !== lang()) build(root);
  }
  IG.remount = function () { var root = document.getElementById('igl-mount'); if (root) build(root); };
  document.addEventListener('keydown', function (ev) {
    var t = ev.target.tagName;
    if (!ev.target.closest || !ev.target.closest('.igl')) return;
    if ((ev.ctrlKey || ev.metaKey) && (ev.key === 'z' || ev.key === 'Z') && t !== 'INPUT' && t !== 'TEXTAREA') { ev.preventDefault(); IG._undo && IG._undo(); }
  });
  new MutationObserver(function () { mount(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'], childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
