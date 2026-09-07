/* Iris Green: un único índice y un único criterio para Home y Condiciones. */
(function () {
  'use strict';
  if (window.IGSearch) return;
  var pending;
  var stopEs = new Set('no me con el la que de del a y o en un una lo los las al se su mi te les nos por para es son ser estoy esta este eso hay muy mas pero si ya cuando donde como todo toda'.split(' '));
  var stopEn = new Set('i me my the a an and or of to in on for with is are am be been being this that these those it its at as from by can could would should do does did have has had'.split(' '));
  function norm(value) {
    return String(value == null ? '' : value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  }
  function language(value) {
    var raw = String(value || document.documentElement.lang || 'es').toLowerCase();
    return raw.indexOf('en') === 0 ? 'en' : 'es';
  }
  function tokens(query, lang) {
    var all = norm(query).split(/\s+/).filter(Boolean);
    var stop = language(lang) === 'en' ? stopEn : stopEs;
    var useful = all.filter(function (word) { return !stop.has(word); });
    return useful.length ? useful : all;
  }
  function path(value) {
    try { return new URL(value, location.origin).pathname.replace(/\/+$/, '') || '/'; }
    catch (_) { return ''; }
  }
  function source(item) { return item && item._raw ? item._raw : item; }
  function localizedRaw(item, lang) {
    var raw = source(item) || {};
    if (language(lang) !== 'en' || !raw.en || typeof raw.en !== 'object') return raw;
    var en = raw.en;
    return Object.assign({}, raw, {
      s: en.s || raw.s,
      t: en.t || raw.t,
      u: en.u || raw.u,
      d: en.d || raw.d,
      a: Object.prototype.hasOwnProperty.call(en, 'a') ? en.a : raw.a,
      k: Object.prototype.hasOwnProperty.call(en, 'k') ? en.k : raw.k,
      indexKey: en.indexKey || en.t || raw.indexKey || raw.t
    });
  }
  function prepare(raw) {
    raw = raw || {};
    var description = String(raw.d || raw.full || raw.hint || '');
    var name = String(raw.t || raw.name || '');
    var keywords = Array.isArray(raw.k) ? raw.k.join(' ') : String(raw.k || '');
    var hint = description.length > 120 ? description.slice(0, 117).replace(/[\s,;:.]+$/, '') + '…' : description;
    return Object.assign({}, raw, {
      name: name, kind: raw.s || raw.kind || '', url: raw.u || raw.url || '',
      full: description, hint: hint, k: keywords, indexKey: raw.indexKey || name,
      area: raw.a || raw.area || '',
      _title: norm(name),
      _text: norm([name, raw.indexKey || '', keywords, description, raw.a || raw.area || ''].join(' ')),
      _raw: source(raw) || raw
    });
  }
  function localize(item, lang) { return prepare(localizedRaw(item, lang)); }
  function rank(items, query, lang) {
    var words = tokens(query, lang);
    if (!words.length) return items.map(function (item) { return localize(item, lang); });
    var phrase = norm(query);
    return items.map(function (item, index) {
      var value = localize(item, lang);
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
  window.IGSearch = Object.freeze({ load: load, rank: rank, norm: norm, path: path, prepare: prepare, localize: localize });
})();
