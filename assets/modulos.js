/* IRIS R02 · Módulos comunes de los mundos (shells) con ITEM_SAMPLE. Sin eval, sin red, sin almacenamiento. */
(function () {
  'use strict';
  var IG = window.IG, h = IG.h, D = IG.data(), L = D.lang;
  var T = function (es, en) { return L === 'es' ? es : en; };
  var items = D.items, col = function (i) { return D.color[i.color][L]; }, tam = function (i) { return D.tam[i.tam][L]; };
  var st = { f: { color: '', tam: '' }, a: 0, b: 1, seen: {}, order: items.map(function (_, i) { return i; }) };
  var app = document.getElementById('mod-app');

  function radios(name, legend, opts, key) {
    return h('fieldset', null, h('legend', { text: legend }), h('div', { class: 'row' }, [['', T('Cualquiera', 'Any')]].concat(opts).map(function (o) {
      var id = 'f-' + key + '-' + (o[0] || 'any');
      var inp = h('input', { type: 'radio', name: name, id: id, value: o[0], 'data-k': id, on: { change: function () { st.f[key] = o[0]; draw(); var n = matches().length; IG.say(n + T(' elementos coinciden.', ' items match.')); } } });
      if (st.f[key] === o[0]) inp.checked = true;
      return h('label', { for: id, class: 'btn', style: 'font-weight:400' }, inp, ' ' + o[1]);
    })));
  }
  function matches() { return items.filter(function (i) { return (!st.f.color || i.color === st.f.color) && (!st.f.tam || i.tam === st.f.tam); }); }

  function identificador() {
    var m = matches();
    return h('section', { class: 'card', 'aria-labelledby': 'h-id' }, h('h2', { id: 'h-id', style: 'font-size:26px', text: T('Identificador', 'Identifier') }),
      h('p', { text: T('Responde lo que sepas y la lista se reduce. No hay respuestas incorrectas.', 'Answer what you know and the list narrows down. There are no wrong answers.') }),
      radios('color', T('¿De qué color es?', 'What colour is it?'), Object.keys(D.color).map(function (k) { return [k, D.color[k][L]]; }), 'color'),
      radios('tam', T('¿De qué tamaño es?', 'What size is it?'), Object.keys(D.tam).map(function (k) { return [k, D.tam[k][L]]; }), 'tam'),
      h('p', { text: m.length + T(' de ', ' of ') + items.length + T(' elementos coinciden.', ' items match.') }),
      m.length ? h('ul', null, m.map(function (i) { return h('li', { text: i.id + ' · ' + col(i) + ' · ' + tam(i) }); })) : h('p', { class: 'empty', text: T('Ninguno coincide. Cambia una respuesta.', 'None match. Change an answer.') }));
  }
  function comparador() {
    function sel(id, key, label) { return h('div', { class: 'field', style: 'flex:1 1 200px' }, h('label', { for: id, text: label }), h('select', { id: id, 'data-k': id, on: { change: function (ev) { st[key] = +ev.target.value; draw(); IG.say(T('Comparando ', 'Comparing ') + items[st.a].id + T(' y ', ' and ') + items[st.b].id + '.'); } } },
      items.map(function (i, n) { var o = h('option', { value: n, text: i.id }); if (st[key] === n) o.selected = true; return o; }))); }
    var A = items[st.a], B = items[st.b];
    return h('section', { class: 'card', 'aria-labelledby': 'h-cmp' }, h('h2', { id: 'h-cmp', style: 'font-size:26px', text: T('Comparador', 'Comparer') }),
      h('div', { class: 'row' }, sel('ca', 'a', T('Primer elemento', 'First item')), sel('cb', 'b', T('Segundo elemento', 'Second item'))),
      h('div', { class: 'table-wrap', tabindex: '0', role: 'region', 'aria-label': T('Tabla de comparación', 'Comparison table') }, h('table', null, h('caption', { class: 'visually-hidden', text: T('Comparación', 'Comparison') }),
        h('thead', null, h('tr', null, h('th', { scope: 'col', text: T('Rasgo', 'Feature') }), h('th', { scope: 'col', text: A.id }), h('th', { scope: 'col', text: B.id }))),
        h('tbody', null,
          h('tr', null, h('th', { scope: 'row', text: T('Color', 'Colour') }), h('td', { text: col(A) }), h('td', { text: col(B) })),
          h('tr', null, h('th', { scope: 'row', text: T('Tamaño', 'Size') }), h('td', { text: tam(A) }), h('td', { text: tam(B) })),
          h('tr', null, h('th', { scope: 'row', text: T('Año (muestra)', 'Year (sample)') }), h('td', { text: String(A.epoca) }), h('td', { text: String(B.epoca) }))))));
  }
  function coleccion() {
    var seen = items.filter(function (i) { return st.seen[i.id]; }).length;
    return h('section', { class: 'card', 'aria-labelledby': 'h-col' }, h('h2', { id: 'h-col', style: 'font-size:26px', text: T('Colección', 'Collection') }),
      h('p', { text: seen + T(' de ', ' of ') + items.length + T(' vistos. Solo se recuerda mientras la página está abierta.', ' seen. It is only remembered while the page is open.') }),
      h('ul', { style: 'list-style:none;margin:0;padding:0', class: 'stack' }, items.map(function (i) {
        var id = 'seen-' + i.id, cb = h('input', { type: 'checkbox', id: id, 'data-k': id, on: { change: function (ev) { st.seen[i.id] = ev.target.checked; draw(); IG.say(i.id + (ev.target.checked ? T(' marcado como visto.', ' marked as seen.') : T(' desmarcado.', ' unmarked.'))); } } });
        if (st.seen[i.id]) cb.checked = true;
        return h('li', null, h('label', { for: id, class: 'btn', style: 'font-weight:400;justify-content:flex-start' }, cb, ' ' + i.id));
      })),
      h('p', { class: 'muted', text: seen < items.length ? T('Faltan: ', 'Missing: ') + items.filter(function (i) { return !st.seen[i.id]; }).map(function (i) { return i.id; }).join(', ') + '.' : T('Colección completa.', 'Collection complete.') }));
  }
  function cronologia() {
    function mv(pos, d) { var o = st.order, j = pos + d; if (j < 0 || j >= o.length) return; var t = o[pos]; o[pos] = o[j]; o[j] = t; draw(); IG.say(items[t].id + T(' ahora en la posición ', ' now in position ') + (j + 1) + '.');
      var el = document.querySelector('[data-k="' + (d < 0 ? 'up-' : 'dn-') + items[t].id + '"]'); if (el && !el.disabled) el.focus(); }
    var ok = st.order.every(function (v, i, a) { return i === 0 || items[a[i - 1]].epoca <= items[v].epoca; });
    return h('section', { class: 'card', 'aria-labelledby': 'h-cro' }, h('h2', { id: 'h-cro', style: 'font-size:26px', text: T('Cronología', 'Timeline') }),
      h('p', { text: T('Ordena de más antiguo a más reciente con los botones Subir y Bajar. No hace falta arrastrar.', 'Order from oldest to newest with the Up and Down buttons. No dragging needed.') }),
      h('ol', { class: 'items' }, st.order.map(function (v, pos) {
        var i = items[v];
        return h('li', null, h('span', { class: 't', text: i.id + ' · ' + i.epoca }),
          h('button', { class: 'btn', type: 'button', 'data-k': 'up-' + i.id, disabled: pos === 0 ? true : null, 'aria-label': T('Subir ', 'Move up ') + i.id, on: { click: function () { mv(pos, -1); } } }, T('Subir', 'Up')),
          h('button', { class: 'btn', type: 'button', 'data-k': 'dn-' + i.id, disabled: pos === st.order.length - 1 ? true : null, 'aria-label': T('Bajar ', 'Move down ') + i.id, on: { click: function () { mv(pos, 1); } } }, T('Bajar', 'Down')));
      })),
      h('p', { class: 'muted', text: ok ? T('Ordenado de más antiguo a más reciente.', 'Ordered from oldest to newest.') : T('Aún no está ordenado. Puedes seguir cuando quieras.', 'Not ordered yet. Carry on whenever you like.') }));
  }
  function draw() { IG.render(app, function () { return h('div', { class: 'stack' }, identificador(), comparador(), coleccion(), cronologia()); }); }
  draw();
})();
