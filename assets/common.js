/* IRIS R02 · núcleo común. Sin dependencias, sin evaluación de código en tiempo de ejecución, sin peticiones de red. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var IG = window.IG = {};

  /* Datos de la página: bloque JSON no ejecutable generado en build. */
  IG.data = function (id) {
    var el = document.getElementById(id || 'page-data');
    return el ? JSON.parse(el.textContent) : {};
  };

  /* Almacenamiento efímero por pestaña (sessionStorage), claves ig-*. */
  IG.store = {
    get: function (k) { try { var v = sessionStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento: sigue en memoria */ } },
    del: function (k) { try { sessionStorage.removeItem(k); } catch (e) {} }
  };

  /* Una sola región de estado por página (role=status, aria-live=polite). */
  IG.say = function (msg) {
    var el = document.getElementById('status');
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
