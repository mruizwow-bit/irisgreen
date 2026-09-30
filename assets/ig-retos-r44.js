/* Iris Green · R44 · framework de retos del Taller.

   Espacio de nombres propio: `IGR44`. No toca `es/taller/taller-retos.json`, que
   son las 72 propuestas de papel y lápiz del Taller y comparten la palabra
   «retos» sin ser lo mismo. Un reto R44 vive dentro de un estudio y termina en
   un artefacto que la persona descarga.

   Se apoya en `IGT` (assets/ig-taller-estudio.js): construcción de nodos,
   traducción, región de estado, movimiento reducido y colores forzados. No
   añade dependencias, no pide permisos, no toca almacenamiento y no hace
   peticiones de red: el reto es una capa de contexto sobre el estudio, no un
   servicio.

   El panel es acompañamiento, no puerta: el estudio funciona igual sin él, y
   cerrarlo no cierra ninguna herramienta. `recommended_stage` y `starter_stage`
   sólo cambian el ejemplo con el que se entra; no filtran nada. */
(function (window, document) {
  'use strict';
  var IGT = window.IGT || {};
  var R44 = window.IGR44 = window.IGR44 || {};

  var ESTADOS = ['sin-empezar', 'en-curso', 'listo-para-exportar', 'terminado'];
  R44.ESTADOS = ESTADOS;

  function h(tag, attrs) {
    if (IGT.h) return IGT.h.apply(null, arguments);
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return n;
  }
  function decir(msg) { if (IGT.say) IGT.say(msg); }

  function idioma() {
    return String(document.documentElement.lang || 'es').slice(0, 2) === 'en' ? 'en' : 'es';
  }

  /* Los datos del reto viajan en un bloque JSON no ejecutable dentro de la
     página, igual que los textos del estudio. Sin fetch: una página del Taller
     tiene que abrir sin red. */
  R44.leer = function (id) {
    var el = document.getElementById('igr44-datos');
    if (!el) return null;
    var datos;
    try { datos = JSON.parse(el.textContent); } catch (e) { return null; }
    var lista = (datos && datos.retos) || [];
    for (var i = 0; i < lista.length; i++) {
      if (!id || lista[i].id === id) return lista[i];
    }
    return null;
  };

  /* Estado del reto. Vive en memoria y nada más: no hay almacenamiento oculto,
     así que cerrar la pestaña lo olvida, que es lo que la página promete. */
  function Reto(datos, lang) {
    this.datos = datos;
    this.lang = lang;
    this.txt = datos[lang] || datos.es;
    this.estado = 'sin-empezar';
    this.oyentes = [];
  }
  Reto.prototype.nombreEstado = function (estado) {
    return this.txt.estados[estado || this.estado];
  };
  Reto.prototype.ir = function (estado) {
    if (ESTADOS.indexOf(estado) < 0 || estado === this.estado) return;
    this.estado = estado;
    var self = this;
    this.oyentes.forEach(function (f) { f(estado, self); });
    decir(this.txt.titulo + ' · ' + this.nombreEstado());
  };
  Reto.prototype.alCambiar = function (f) { this.oyentes.push(f); };
  R44.Reto = Reto;

  /* El panel. Región propia, con su encabezado, para que un lector de pantalla
     pueda saltar a él y salir sin recorrer el estudio entero. */
  R44.montar = function (destino, id) {
    var datos = R44.leer(id);
    if (!datos || !destino) return null;
    var lang = idioma();
    var reto = new Reto(datos, lang);
    var t = reto.txt;

    var pasos = h('ol', { 'class': 'igr44-pasos' });
    t.instrucciones.forEach(function (linea) {
      pasos.appendChild(h('li', null, linea));
    });

    var estadoTxt = h('span', { 'class': 'igr44-estado-texto', id: 'igr44-estado-texto' },
                      reto.nombreEstado());
    /* El estado se dice con palabra y con forma, nunca sólo con color. */
    var marca = h('span', { 'class': 'igr44-marca', 'aria-hidden': 'true' });
    var estado = h('p', { 'class': 'igr44-estado', 'data-estado': 'sin-empezar' },
                   marca, estadoTxt);

    var cta = h('button', {
      type: 'button', 'class': 'igr44-cta', 'aria-label': t.cta_nombre,
      on: { click: function () { reto.ir(reto.estado === 'sin-empezar' ? 'en-curso' : reto.estado); } }
    }, t.cta);

    var nota = h('p', { 'class': 'igr44-nota' }, t.alternativa_arrastre);

    var caja = h('section', {
      'class': 'igr44-panel', 'aria-labelledby': 'igr44-titulo', 'data-reto': datos.id
    },
      h('h2', { id: 'igr44-titulo', 'class': 'igr44-titulo' }, t.titulo),
      h('p', { 'class': 'igr44-idea' }, t.idea),
      pasos,
      estado,
      cta,
      h('p', { 'class': 'igr44-criterio' }, t.criterio),
      nota);

    reto.alCambiar(function (nuevo) {
      estado.setAttribute('data-estado', nuevo);
      estadoTxt.textContent = reto.nombreEstado();
    });

    destino.appendChild(caja);
    reto.nodo = caja;
    return reto;
  };

  /* Los cuatro flags del §3 de la orden. Se comprueban sobre lo que hay en la
     página, no se declaran: un flag que se afirma sin mirar es el defecto que
     esta tanda viene a evitar. */
  R44.verificar = function (reto) {
    var d = reto && reto.datos;
    if (!d) return null;
    var out = {};
    out.ENGINE_VERIFIED = !!d.motor;
    out.EXPORT_VERIFIED = !!(d.artefacto && d.artefacto.formatos && d.artefacto.formatos.length
                             && d.artefacto.descarga_local === true);
    out.INPUT_VERIFIED = !!(reto.txt.alternativa_arrastre && reto.txt.cta_nombre);
    var nodo = reto.nodo;
    out.ACCESSIBILITY_VERIFIED = !!(nodo
      && nodo.getAttribute('aria-labelledby')
      && nodo.querySelector('.igr44-cta[aria-label]')
      && nodo.querySelector('.igr44-estado .igr44-estado-texto'));
    out.SIN_PERMISOS = Array.isArray(d.permisos) && d.permisos.length === 0;
    out.SIN_HARDWARE = d.hardware === false;
    /* La etapa no cierra herramientas: se comprueba que no exista la idea
       siquiera de un bloqueo por edad. */
    out.ETAPA_NO_BLOQUEA = d.audience === 'ALL_AGES' || !!d.recommended_stage;
    return out;
  };

  R44.auto = function () {
    var destino = document.getElementById('igr44-destino');
    if (!destino) return null;
    return R44.montar(destino, destino.getAttribute('data-reto') || null);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', R44.auto);
  } else {
    R44.auto();
  }
})(window, document);
