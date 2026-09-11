/* Iris Green: un único índice y un único criterio para Home y Condiciones.
   Tolerancia de escritura (11-09-2026): equivalencias de lenguaje corriente,
   plurales y una errata por palabra. Las equivalencias viven en
   assets/buscador-equivalencias.json, no aquí: se corrige el archivo, no el código.
   Si ese archivo no carga, la búsqueda funciona exactamente como antes. */
(function () {
  'use strict';
  if (window.IGSearch) return;
  var pending;
  var equivalencias = null;   // { es: {palabra:[destinos]}, en: {...} }, ya filtradas
  var stopEs = new Set('no me con el la que de del a y o en un una lo los las al se su mi te les nos por para es son ser estoy esta este eso hay muy mas pero si ya cuando donde como todo toda'.split(' '));
  var stopEn = new Set('i me my the a an and or of to in on for with is are am be been being this that these those it its at as from by can could would should do does did have has had'.split(' '));
  var routeEn = {'/es/biblioteca':'/en/everyday-life'};
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
  /* Formas simples de singular/plural. Se prueban varias formas en vez de
     apostar por una sola raíz: etiquetas→etiqueta, instrucciones→instrucción,
     luces→luz, classes→class. Nunca se recorta por debajo de cuatro letras. */
  function formas(word) {
    word = norm(word);
    if (!word) return [];
    var out = [word];
    function add(v) { if (v.length >= 3 && out.indexOf(v) === -1) out.push(v); }
    if (word.length > 4 && /s$/.test(word)) add(word.slice(0, -1));
    if (word.length > 4 && /es$/.test(word)) add(word.slice(0, -2));
    if (word.length > 4 && /ces$/.test(word)) add(word.slice(0, -3) + 'z');
    return out;
  }
  function stem(word) {
    var fs = formas(word);
    return fs.length > 1 ? fs[fs.length - 1] : (fs[0] || '');
  }
  function mismaForma(a, b) {
    var fa = formas(a), fb = formas(b);
    return fa.some(function (x) { return fb.indexOf(x) !== -1; });
  }
  /* Distancia de una sola edición: una letra cambiada, añadida o quitada,
     o dos letras contiguas intercambiadas. Solo desde cinco letras. */
  function parecido(a, b) {
    a = norm(a); b = norm(b);
    if (a === b) return true;
    if (Math.min(a.length, b.length) < 5 || Math.abs(a.length - b.length) > 1) return false;
    if (a.length === b.length) {
      var dif = [];
      for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) dif.push(i);
      if (dif.length === 1) return true;
      return dif.length === 2 && dif[1] === dif[0] + 1 &&
        a[dif[0]] === b[dif[1]] && a[dif[1]] === b[dif[0]];
    }
    var corta = a.length < b.length ? a : b;
    var larga = a.length < b.length ? b : a;
    var i = 0, j = 0, saltos = 0;
    while (i < corta.length && j < larga.length) {
      if (corta[i] === larga[j]) { i++; j++; continue; }
      if (++saltos > 1) return false;
      j++;
    }
    return true;
  }
  function path(value) {
    try { return new URL(value, location.origin).pathname.replace(/\/+$/, '') || '/'; }
    catch (_) { return ''; }
  }
  function englishRoute(value) {
    var clean=path(value);
    return routeEn[clean] ? routeEn[clean]+'/' : value;
  }
  function source(item) { return item && item._raw ? item._raw : item; }
  function localizedRaw(item, lang) {
    var raw = source(item) || {};
    if (language(lang) !== 'en' || !raw.en || typeof raw.en !== 'object') return raw;
    var en = raw.en;
    return Object.assign({}, raw, {
      s: en.s || raw.s,
      t: en.t || raw.t,
      u: englishRoute(en.u || raw.u),
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
    var text = norm([name, raw.indexKey || '', keywords, description, raw.a || raw.area || ''].join(' '));
    return Object.assign({}, raw, {
      name: name, kind: raw.s || raw.kind || '', url: raw.u || raw.url || '',
      full: description, hint: hint, k: keywords, indexKey: raw.indexKey || name,
      area: raw.a || raw.area || '',
      _title: norm(name),
      _text: text,
      _words: text.split(' ').filter(Boolean),
      _raw: source(raw) || raw
    });
  }
  function localize(item, lang) { return prepare(localizedRaw(item, lang)); }
  /* Palabras equivalentes de una palabra escrita, ya filtradas por lo que existe
     de verdad en el contenido. Sin archivo cargado, ninguna. */
  function equivalentes(word, lang) {
    if (!equivalencias) return [];
    var tabla = equivalencias[language(lang)] || {};
    var fs = formas(word);
    for (var i = 0; i < fs.length; i++) if (tabla[fs[i]]) return tabla[fs[i]];
    return [];
  }
  function rank(items, query, lang) {
    var words = tokens(query, lang);
    if (!words.length) return items.map(function (item) { return localize(item, lang); });
    var phrase = norm(query);
    return items.map(function (item, index) {
      var value = localize(item, lang);
      var score = 0;
      var cobertura = 0;
      var via = [];
      words.forEach(function (word) {
        if (value._text.indexOf(word) !== -1) {
          score += value._title.indexOf(word) !== -1 ? 2 : 1;
          cobertura += 1;
          return;
        }
        /* Plural o singular de lo escrito: cuenta como coincidencia completa. */
        if (value._words.some(function (w) { return mismaForma(w, word); })) {
          score += 1; cobertura += 1; return;
        }
        /* Una errata: vale la mitad que escribirlo bien. */
        var conErrata = value._words.some(function (w) {
          return formas(w).some(function (fw) {
            return formas(word).some(function (fq) { return parecido(fw, fq); });
          });
        });
        if (conErrata) {
          score += 0.5; cobertura += 0.5;
          if (via.indexOf('errata') === -1) via.push('errata');
          return;
        }
        /* Palabra de cada día: también vale la mitad. */
        var hit = equivalentes(word, lang).some(function (destino) {
          return value._words.some(function (w) { return mismaForma(w, destino); });
        });
        if (hit) {
          score += 0.5; cobertura += 0.5;
          if (via.indexOf('equivalencia') === -1) via.push('equivalencia');
        }
      });
      if (score && value._title === phrase) score += 100;
      /* Primero la proporción ponderada de lo escrito que encaja; después la
         fuerza de esas coincidencias. Una coincidencia de cuatro ya no adelanta
         a tres coincidencias del mismo tipo. */
      var ajuste = cobertura / words.length;
      if (via.length) value._via = via;
      return { item: value, score: score, fit: ajuste, index: index };
    }).filter(function (hit) { return hit.score > 0; })
      .sort(function (a, b) { return b.fit - a.fit || b.score - a.score || a.index - b.index; })
      .map(function (hit) { return hit.item; });
  }
  /* Descarta las equivalencias cuyo destino no aparece en ninguna ficha: una
     errata en el archivo de datos no puede alterar la búsqueda en silencio. */
  function filtrarEquivalencias(tablas, items) {
    var existentes = { es: new Set(), en: new Set() };
    ['es', 'en'].forEach(function (lang) {
      items.forEach(function (item) {
        localize(item, lang)._words.forEach(function (w) {
          formas(w).forEach(function (f) { existentes[lang].add(f); });
        });
      });
    });
    var salida = {};
    ['es', 'en'].forEach(function (lang) {
      var origen = tablas && tablas[lang];
      if (!origen || typeof origen !== 'object') return;
      var tabla = {};
      Object.keys(origen).forEach(function (clave) {
        var destinos = Array.isArray(origen[clave]) ? origen[clave] : [];
        var utiles = destinos.filter(function (d) {
          return formas(d).some(function (f) { return existentes[lang].has(f); });
        });
        if (utiles.length) tabla[norm(clave)] = utiles;
      });
      salida[lang] = tabla;
    });
    return salida;
  }
  function cargarEquivalencias(items) {
    return fetch('/assets/buscador-equivalencias.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) { if (data) equivalencias = filtrarEquivalencias(data, items); })
      .catch(function () { equivalencias = null; });
  }
  function load() {
    if (pending) return pending;
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 10000);
    pending = fetch('/buscador.json', { signal: controller.signal, cache: 'no-cache' })
      .then(function (response) {
        if (!response.ok) throw new Error('No se ha podido cargar el índice (' + response.status + ').');
        return response.json();
      }).then(function (data) {
        if (!Array.isArray(data)) throw new Error('El índice no tiene el formato esperado.');
        var seen = new Set();
        var items = data.filter(function (item) {
          if (!item || typeof item.t !== 'string' || typeof item.u !== 'string' || !item.u.startsWith('/')) return false;
          var key = path(item.u);
          if (seen.has(key)) return false;
          seen.add(key); return true;
        }).map(prepare);
        /* Las equivalencias son una ayuda, no un requisito: si tardan o fallan,
           la búsqueda ya está lista. */
        return cargarEquivalencias(items).then(function () { return items; });
      }).catch(function (error) { pending = null; throw error; })
      .finally(function () { clearTimeout(timeout); });
    return pending;
  }
  window.IGSearch = Object.freeze({ load: load, rank: rank, norm: norm, path: path, prepare: prepare, localize: localize, stem: stem, formas: formas });
})();
