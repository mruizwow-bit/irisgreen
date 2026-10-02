/* Iris Green · Juegos · runtime de sala.

   `ROOM_GAMES_S0_DATA_SPLIT_PASS_RUNTIME_WIRING_PENDING`. Esto es el cableado
   que faltaba: una pantalla que abre **un** juego sin traerse el catálogo.

   Cómo encaja. El motor `juegos-iris.js` lee `window.IG_JUEGOS_DATA` al
   arrancar y, si el hash es `#juego-<slug>`, abre ese juego directamente. Este
   archivo va **antes** que el motor y le deja los datos puestos: las
   taxonomías sueltas —1,8 KB— más el único juego que la página ha cargado.
   No hace falta ningún cargador dinámico: la página de sala incluye el archivo
   de su juego como un `<script>` más, y `defer` conserva el orden.

   Lo que añade encima del motor son las reglas de sala del plan:

     - **no recuerda nada**: no se toca almacenamiento, y se comprueba;
     - **vuelve al principio sola** tras un rato sin tocar, porque la siguiente
       persona llega en un minuto y no debe encontrarse la partida anterior.

   Lo que NO hace, y conviene saberlo: la vuelta al principio es una recarga de
   la página. Sin *service worker* —hoy el sitio no tiene— esa recarga necesita
   que el navegador pueda revalidar. En una sala sin red, la primera carga
   funciona y la vuelta automática puede no funcionar. Está anotado en el plan
   como lo que decide si hace falta un *service worker*. */
(function (window, document) {
  'use strict';
  var SALA = window.IG_SALA = window.IG_SALA || {};

  /* Minutos sin tocar antes de volver al principio. Generoso a propósito: en
     el plan, «sin reloj» es una regla, y nadie debe sentir que le corre
     prisa. Esto no es un temporizador de partida, es una limpieza entre
     visitas. */
  var INACTIVIDAD_MS = 4 * 60 * 1000;

  function slug() {
    var app = document.getElementById('jg-app');
    return (app && app.getAttribute('data-juego-sala')) || '';
  }

  SALA.preparar = function () {
    var s = slug();
    if (!s) return null;
    var juego = (window.IG_JUEGO || {})[s];
    var taxo = window.IG_JUEGOS_TAXO;
    if (!juego || !taxo) return null;

    /* El motor espera el catálogo entero. Se lo damos con un solo juego
       dentro: la misma forma, 297 veces más pequeña. `links` va vacío porque
       enlaza rutinas imprimibles con juegos y en una sala no hay nada que
       imprimir. */
    var D = {
      cats: taxo.cats, etapas: taxo.etapas, tipos: taxo.tipos,
      atrib: taxo.atrib, marca: taxo.marca,
      juegos: [juego], links: [],
      pictos: window.IG_PICTOS || {}
    };
    window.IG_JUEGOS_DATA = D;

    /* El motor abre solo el juego cuyo slug esté en el hash. Se lo ponemos
       antes de que arranque, para que la sala no empiece nunca en el
       catálogo. */
    if ((window.location.hash || '') !== '#juego-' + s) {
      try { window.location.hash = '#juego-' + s; } catch (e) { }
    }
    SALA.juego = juego;
    return D;
  };

  /* Vuelta al principio. No se guarda nada por el camino: lo que hizo una
     persona no puede quedar a la vista de la siguiente. */
  SALA.vigilarInactividad = function (ms) {
    var espera = ms || INACTIVIDAD_MS, t = null, parado = false;
    function reiniciar() {
      if (parado) return;
      try { window.location.reload(); } catch (e) { }
    }
    function tocar() {
      if (t) window.clearTimeout(t);
      t = window.setTimeout(reiniciar, espera);
    }
    ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach(function (ev) {
      document.addEventListener(ev, tocar, { passive: true });
    });
    tocar();
    SALA.detener = function () { parado = true; if (t) window.clearTimeout(t); };
    return { tocar: tocar };
  };

  SALA.preparar();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { SALA.vigilarInactividad(); });
  } else {
    SALA.vigilarInactividad();
  }
})(window, document);
