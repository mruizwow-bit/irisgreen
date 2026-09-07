/* Iris Green: un único índice y un único criterio para Home y Condiciones. */
(function () {
  'use strict';
  if (window.IGSearch) return;
  var pending;
  var stop = new Set('no me con el la que de del a y o en un una lo los las al se su mi te les nos por para es son ser estoy esta este eso hay muy mas pero si ya cuando donde como todo toda'.split(' '));
  function norm(value) {
    return String(value == null ? '' : value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  }
  function tokens(query) {
    var all = norm(query).split(/\s+/).filter(Boolean);
    var useful = all.filter(function (word) { return !stop.has(word); });
    return useful.length ? useful : all;
  }
  function path(value) {
    try { return new URL(value, location.origin).pathname.replace(/\/+$/, '') || '/'; }
    catch (_) { return ''; }
  }
  function prepare(raw) {
    var description = String(raw.d || raw.full || raw.hint || '');
    var name = String(raw.t || raw.name || '');
    var keywords = Array.isArray(raw.k) ? raw.k.join(' ') : String(raw.k || '');
    var hint = description.length > 120 ? description.slice(0, 117).replace(/[\s,;:.]+$/, '') + '…' : description;
    return Object.assign({}, raw, {
      name: name, kind: raw.s || raw.kind || '', url: raw.u || raw.url || '',
      full: description, hint: hint, k: keywords, indexKey: raw.indexKey || name,
      area: raw.a || raw.area || '',
      _title: norm(name),
      _text: norm([name, raw.indexKey || '', keywords, description, raw.a || raw.area || ''].join(' '))
    });
  }
  function rank(items, query) {
    var words = tokens(query);
    if (!words.length) return items.slice();
    var phrase = norm(query);
    return items.map(function (item, index) {
      var value = item._text === undefined ? prepare(item) : item;
      var score = 0;
      words.forEach(function (word) {
        if (value._text.indexOf(word) !== -1) score += value._title.indexOf(word) !== -1 ? 2 : 1;
      });
      if (score && value._title === phrase) score += 100;
      return { item: value, score: score, index: index };
    }).filter(function (hit) { return hit.score > 0; })
      .sort(function (a, b) { return b.score - a.score || a.index - b.index; })
      .map(function (hit) { return hit.item; });
  }
  function load() {
    if (pending) return pending;
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 10000);
    pending = fetch('/buscador.json', { signal: controller.signal })
      .then(function (response) {
        if (!response.ok) throw new Error('No se ha podido cargar el índice (' + response.status + ').');
        return response.json();
      }).then(function (data) {
        if (!Array.isArray(data)) throw new Error('El índice no tiene el formato esperado.');
        var seen = new Set();
        return data.filter(function (item) {
          if (!item || typeof item.t !== 'string' || typeof item.u !== 'string' || !item.u.startsWith('/')) return false;
          var key = path(item.u);
          if (seen.has(key)) return false;
          seen.add(key); return true;
        }).map(prepare);
      }).catch(function (error) { pending = null; throw error; })
      .finally(function () { clearTimeout(timeout); });
    return pending;
  }
  window.IGSearch = Object.freeze({ load: load, rank: rank, norm: norm, path: path, prepare: prepare });
})();
