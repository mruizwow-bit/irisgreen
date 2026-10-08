/* Iris Green · web completa R02
   Sin red, sin dependencias y sin marcos. Funciona desde file://.
   La navegación va escrita en el HTML: este archivo sólo añade comportamiento. */
(function () {
  'use strict';

  var IG = window.IG = {};
  var IDIOMA = document.body.getAttribute('data-idioma') || 'es';

  var T = {
    es: {
      ninguno: 'Ninguno coincide', uno: '1 ', varios: ' ',
      sinIndice: 'El buscador no está disponible ahora mismo.',
      resultados: 'resultados', resultado: 'resultado',
      escribe: 'Escribe algo para buscar.',
      noHay: 'No encuentro nada con esas palabras.',
      sabik: 'Sabik todavía no está conectado, así que no puedo responderte aquí. Puedes buscar o entrar por las áreas.',
      tramitesTodos: 'Se muestran todos los trámites.',
      tramitesFiltro: 'Se muestran los trámites de ',
      tramitesNinguno: 'Ningún trámite coincide con lo que has elegido.',
      pasoDe: 'Paso %1 de %2',
      malPaso: 'Ese va más adelante. Prueba otro.',
      bienPaso: 'Bien. Paso %1 colocado: %3. Ahora busca el paso %2.',
      completo: 'Ya está: la secuencia completa, con los %2 pasos en orden.',
      reinicio: 'Empezamos otra vez. Busca el paso 1.',
      guardado: 'Ajuste guardado en este navegador.',
      temporal: 'Cambio temporal: este navegador no deja guardarlo, así que se pierde al cambiar de página, al recargar o al cerrar.',
      delSistema: 'Tu sistema pide menos movimiento, así que se parte de ahí.'
    },
    en: {
      ninguno: 'None match', uno: '1 ', varios: ' ',
      sinIndice: 'Search is not available right now.',
      resultados: 'results', resultado: 'result',
      escribe: 'Type something to search.',
      noHay: 'I cannot find anything with those words.',
      sabik: 'Sabik is not connected yet, so I cannot answer you here. You can search or go in through the areas.',
      tramitesTodos: 'Showing every item.',
      tramitesFiltro: 'Showing items for ',
      tramitesNinguno: 'Nothing matches what you chose.',
      pasoDe: 'Step %1 of %2',
      malPaso: 'That one comes later. Try another.',
      bienPaso: 'Good. Step %1 placed: %3. Now look for step %2.',
      completo: 'That is it: the whole sequence, all %2 steps in order.',
      reinicio: 'Starting again. Look for step 1.',
      guardado: 'Setting saved in this browser.',
      temporal: 'Temporary change: this browser does not allow saving it, so it is lost when you move to another page, reload or close.',
      delSistema: 'Your system asks for less motion, so that is the starting point.'
    }
  }[IDIOMA] || {};

  function texto(clave, a, b, c) {
    return (T[clave] || clave).replace('%1', a).replace('%2', b).replace('%3', c);
  }

  var PARADAS = ('a al algo ante antes como con contra cual cuando de del desde donde dos el ella ellas ellos en ' +
    'entre era eres es esa ese eso esta este esto ha hace hacer hasta la las le les lo los me mi mis mucho muy no ' +
    'nos o os otra otro para pero poco por porque que qué quien se sin sobre su sus también tanto te tengo ti tu ' +
    'tus un una uno unos y ya about after all also am an and any are as at be been but by can do does for from ' +
    'had has have how i if in into is it its my of on or our out over some than that the their them then there ' +
    'these they this to too up us was we were what when where which who why will with you your').split(' ');

  function normalizar(t) {
    return (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function partir(t) {
    return normalizar(t).split(/[^a-z0-9ñ]+/)
      .filter(function (p) { return p.length > 2 && PARADAS.indexOf(p) === -1; });
  }

  /* El parámetro q puede venir mal codificado: nunca debe tumbar la página. */
  function consultaDeLaUrl() {
    var crudo = (location.search.match(/[?&]q=([^&]*)/) || [])[1];
    if (!crudo) { return ''; }
    crudo = crudo.replace(/\+/g, ' ');
    try { return decodeURIComponent(crudo); } catch (e) { return crudo; }
  }

  /* ---------- menú móvil ---------- */
  IG.menu = function () {
    var boton = document.querySelector('[data-menu-boton]');
    var panel = document.querySelector('[data-menu-panel]');
    var cerrar = document.querySelector('[data-menu-cerrar]');
    if (!boton || !panel) { return; }
    var fondo = function () {
      return Array.prototype.filter.call(
        document.querySelectorAll('.cabecera__fila, .ruta, main, .pie'),
        function (n) { return !panel.contains(n) && !n.contains(panel); });
    };
    var foco = function () {
      return Array.prototype.filter.call(
        panel.querySelectorAll('a[href], button:not([disabled])'),
        function (n) { return n.offsetParent !== null; });
    };
    function abrir(si, devolverFoco) {
      panel.setAttribute('data-abierto', si ? 'true' : 'false');
      boton.setAttribute('aria-expanded', si ? 'true' : 'false');
      fondo().forEach(function (n) {
        if (si) { n.setAttribute('inert', ''); n.setAttribute('aria-hidden', 'true'); }
        else { n.removeAttribute('inert'); n.removeAttribute('aria-hidden'); }
      });
      document.documentElement.style.overflow = si ? 'hidden' : '';
      if (si) { var f = foco(); if (f.length) { f[0].focus(); } }
      else if (devolverFoco === 'escritorio') {
        /* el botón Menú desaparece en escritorio: el foco va al área actual del menú,
           y si no hay, al primer enlace de área visible. Nunca al body. */
        var visibles = Array.prototype.filter.call(
          panel.querySelectorAll('.nav__enlace'), function (n) { return n.offsetParent !== null; });
        var actual = visibles.filter(function (n) { return n.hasAttribute('aria-current'); });
        var destino = actual[0] || visibles[0] || document.querySelector('.marca');
        if (destino) { destino.focus({ preventScroll: true }); }
      }
      else if (devolverFoco !== false && boton.offsetParent !== null) { boton.focus(); }
    }
    boton.addEventListener('click', function () {
      abrir(panel.getAttribute('data-abierto') !== 'true');
    });
    if (cerrar) { cerrar.addEventListener('click', function () { abrir(false); }); }
    document.addEventListener('keydown', function (e) {
      if (panel.getAttribute('data-abierto') !== 'true') { return; }
      if (e.key === 'Escape') { abrir(false); return; }
      if (e.key !== 'Tab') { return; }
      var f = foco();
      if (!f.length) { return; }
      var primero = f[0], ultimo = f[f.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    });
    document.addEventListener('focusin', function (e) {
      if (panel.getAttribute('data-abierto') === 'true' && !panel.contains(e.target)) {
        var f = foco(); if (f.length) { f[0].focus(); }
      }
    });
    /* al pasar a escritorio el botón Menú desaparece: no se le devuelve el foco */
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1100 && panel.getAttribute('data-abierto') === 'true') {
        abrir(false, 'escritorio');
      }
    });
  };

  /* ---------- filtros de catálogo ---------- */
  IG.filtros = function () {
    document.querySelectorAll('[data-catalogo]').forEach(function (zona) {
      var busqueda = zona.querySelector('[data-busqueda]');
      var chips = Array.prototype.slice.call(zona.querySelectorAll('.chip[data-etiqueta]'));
      var tarjetas = Array.prototype.slice.call(zona.querySelectorAll('[data-ficha]'));
      var cuenta = zona.querySelector('[data-cuenta]');
      var vacio = zona.querySelector('[data-vacio]');
      /* hay más de un botón de limpiar: el de arriba y el del estado vacío */
      var limpiadores = Array.prototype.slice.call(zona.querySelectorAll('[data-limpiar]'));
      var singular = zona.getAttribute('data-singular') || '';
      var plural = zona.getAttribute('data-plural') || '';

      function aplicar() {
        var consulta = partir(busqueda ? busqueda.value : '');
        var activas = chips.filter(function (c) { return c.getAttribute('aria-pressed') === 'true'; })
          .map(function (c) { return c.getAttribute('data-etiqueta'); });
        var vistos = 0;
        tarjetas.forEach(function (t) {
          var etiquetas = (t.getAttribute('data-etiquetas') || '').split(' ');
          var cuerpo = normalizar(t.textContent);
          var coincide = consulta.every(function (p) { return cuerpo.indexOf(p) !== -1; }) &&
            activas.every(function (e) { return etiquetas.indexOf(e) !== -1; });
          t.hidden = !coincide;
          if (coincide) { vistos++; }
        });
        if (cuenta) {
          cuenta.textContent = vistos === 0 ? (T.ninguno + ' ' + plural).trim()
            : vistos + ' ' + (vistos === 1 ? singular : plural);
        }
        if (vacio) { vacio.hidden = vistos !== 0; }
      }
      if (busqueda) {
        busqueda.addEventListener('input', aplicar);
        var q = consultaDeLaUrl();
        if (q) { busqueda.value = q; }
      }
      chips.forEach(function (c) {
        c.addEventListener('click', function () {
          c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
          aplicar();
        });
      });
      limpiadores.forEach(function (b) {
        b.addEventListener('click', function () {
          if (busqueda) { busqueda.value = ''; }
          chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
          aplicar();
          if (busqueda) { busqueda.focus(); }
        });
      });
      aplicar();
    });
  };

  /* ---------- buscador real sobre el índice generado ---------- */
  IG.buscador = function () {
    var zona = document.querySelector('[data-buscador]');
    if (!zona) { return; }
    var campo = zona.querySelector('[data-busqueda-sitio]');
    var lista = zona.querySelector('[data-resultados]');
    var estado = zona.querySelector('[data-estado]');
    var aviso = zona.querySelector('[data-sin-indice]');
    var formulario = zona.querySelector('form');
    var indice = window.IG_INDICE;

    if (!indice || !indice.length) {
      if (aviso) { aviso.hidden = false; }
      if (estado) { estado.textContent = T.sinIndice; }
      return;
    }

    function puntuar(entrada, consulta) {
      var p = 0;
      consulta.forEach(function (t) {
        if (entrada.ct.indexOf(t) !== -1) { p += 6; }
        if (entrada.ch.indexOf(t) !== -1) { p += 3; }
        if (entrada.cx.indexOf(t) !== -1) { p += 1; }
      });
      return p;
    }

    function pintar(cadena) {
      var consulta = partir(cadena);
      lista.innerHTML = '';
      if (!consulta.length) {
        estado.textContent = T.escribe;
        return;
      }
      var hallazgos = indice.map(function (e) { return { e: e, p: puntuar(e, consulta) }; })
        .filter(function (x) { return x.p > 0; })
        .sort(function (a, b) { return b.p - a.p; })
        .slice(0, 12);
      if (!hallazgos.length) {
        estado.textContent = T.noHay;
        if (aviso) { aviso.hidden = true; }
        return;
      }
      estado.textContent = hallazgos.length + ' ' +
        (hallazgos.length === 1 ? T.resultado : T.resultados);
      hallazgos.forEach(function (x) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.className = 'tarjeta tarjeta--enlace';
        a.href = x.e.r;
        var area = document.createElement('span');
        area.className = 'etiqueta';
        area.textContent = x.e.a || 'Iris Green';
        var tit = document.createElement('span');
        tit.className = 'tarjeta__titulo';
        tit.textContent = x.e.t;
        var des = document.createElement('span');
        des.className = 'tarjeta__texto';
        des.textContent = x.e.d;
        a.appendChild(area); a.appendChild(tit); a.appendChild(des);
        li.appendChild(a);
        lista.appendChild(li);
      });
    }

    if (formulario) {
      formulario.addEventListener('submit', function (e) { e.preventDefault(); pintar(campo.value); });
    }
    campo.addEventListener('input', function () { pintar(campo.value); });
    var q = consultaDeLaUrl();
    if (q) { campo.value = q; }
    pintar(campo.value);
  };

  /* ---------- secuencia de pasos (apoyos de vida diaria) ---------- */
  IG.secuencia = function () {
    var tablero = document.querySelector('[data-secuencia]');
    if (!tablero) { return; }
    var piezas = Array.prototype.slice.call(tablero.querySelectorAll('[data-paso]'));
    var huecos = tablero.querySelector('[data-huecos]');
    var mensaje = tablero.querySelector('[data-mensaje]');
    var progreso = tablero.querySelector('[data-progreso]');
    var reiniciar = tablero.querySelector('[data-reiniciar]');
    var total = piezas.length;
    var siguiente = 1;

    function decir(t) { if (mensaje) { mensaje.textContent = t; } }
    function pintarProgreso() {
      if (progreso) { progreso.textContent = texto('pasoDe', Math.min(siguiente, total), total); }
    }
    piezas.forEach(function (p) {
      p.addEventListener('click', function () {
        var n = parseInt(p.getAttribute('data-paso'), 10);
        var nombre = p.getAttribute('data-nombre') || '';
        if (p.getAttribute('data-colocado') === 'true') { return; }
        if (n !== siguiente) { decir(T.malPaso); return; }
        p.setAttribute('data-colocado', 'true');
        p.setAttribute('aria-disabled', 'true');
        if (!p.querySelector('[data-marca]')) {
          var marca = document.createElement('span');
          marca.className = 'etiqueta';
          marca.setAttribute('data-marca', '');
          marca.textContent = (IDIOMA === 'en' ? 'Placed as step ' : 'Colocado en el puesto ') + n;
          p.appendChild(marca);
        }
        if (huecos) {
          var hueco = huecos.querySelector('[data-hueco="' + n + '"]');
          if (hueco) { hueco.textContent = nombre; hueco.setAttribute('data-lleno', 'true'); }
        }
        siguiente++;
        pintarProgreso();
        /* el aviso dice qué paso se ha colocado y cuál toca: no repite la misma frase */
        decir(siguiente > total ? texto('completo', '', total)
                                : texto('bienPaso', n, siguiente, nombre));
      });
    });
    if (reiniciar) {
      reiniciar.addEventListener('click', function () {
        siguiente = 1;
        piezas.forEach(function (p) {
          p.removeAttribute('data-colocado');
          p.removeAttribute('aria-disabled');
          var m = p.querySelector('[data-marca]');
          if (m) { m.remove(); }
        });
        if (huecos) {
          huecos.querySelectorAll('[data-hueco]').forEach(function (h) {
            h.textContent = h.getAttribute('data-vacio') || ''; h.removeAttribute('data-lleno');
          });
        }
        pintarProgreso();
        decir(T.reinicio);
        if (piezas[0]) { piezas[0].focus(); }
      });
    }
    pintarProgreso();
  };

  /* ---------- directorio de trámites: el filtro filtra de verdad ---------- */
  IG.tramites = function () {
    var zona = document.querySelector('[data-tramites]');
    if (!zona) { return; }
    var comunidad = zona.querySelector('[data-comunidad]');
    var tipo = zona.querySelector('[data-tipo]');
    var filas = Array.prototype.slice.call(zona.querySelectorAll('tbody tr'));
    var estado = zona.querySelector('[data-estado-tramites]');
    var vacio = zona.querySelector('[data-vacio-tramites]');

    function aplicar() {
      var c = comunidad ? comunidad.value : '';
      var t = tipo ? tipo.value : '';
      var vistas = 0;
      filas.forEach(function (f) {
        var fc = f.getAttribute('data-comunidad') || '';
        var ft = f.getAttribute('data-tipo') || '';
        var ok = (!c || fc === c || fc === 'estatal') && (!t || ft === t);
        f.hidden = !ok;
        if (ok) { vistas++; }
      });
      if (estado) {
        estado.textContent = vistas === 0 ? T.tramitesNinguno
          : (c ? T.tramitesFiltro + c + '.' : T.tramitesTodos) + ' ' + vistas;
      }
      if (vacio) { vacio.hidden = vistas !== 0; }
    }
    [comunidad, tipo].forEach(function (s) { if (s) { s.addEventListener('change', aplicar); } });
    var boton = zona.querySelector('[data-aplicar]');
    if (boton) { boton.addEventListener('click', aplicar); }
    aplicar();
  };

  /* ---------- Sabik: responde que no está conectado, no se queda mudo ---------- */
  IG.sabik = function () {
    var zona = document.querySelector('[data-sabik]');
    if (!zona) { return; }
    var boton = zona.querySelector('[data-preguntar]');
    var respuesta = zona.querySelector('[data-respuesta]');
    if (!boton || !respuesta) { return; }
    boton.addEventListener('click', function () {
      respuesta.textContent = T.sabik;
      respuesta.hidden = false;
    });
  };

  /* ---------- ajustes: movimiento con control real y persistencia ---------- */
  IG.ajustes = function () {
    var zona = document.querySelector('[data-ajustes]');
    if (!zona) { return; }
    var opciones = Array.prototype.slice.call(zona.querySelectorAll('[name="movimiento"]'));
    var aviso = zona.querySelector('[data-aviso-ajustes]');

    /* la opción marcada es la que está en vigor: lo guardado, y si no hay nada,
       lo que pida el sistema */
    var almacenado = null;
    try { almacenado = window.localStorage.getItem('ig-movimiento'); } catch (e) { }
    if (['normal', 'reduced', 'none'].indexOf(almacenado) === -1) { almacenado = null; }
    var delSistema = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var vigente = almacenado || (delSistema ? 'reduced' : 'normal');
    document.documentElement.setAttribute('data-movimiento', vigente);
    if (!almacenado && delSistema && aviso) { aviso.textContent = T.delSistema; }

    opciones.forEach(function (o) {
      o.checked = o.value === vigente;
      o.addEventListener('change', function () {
        if (!o.checked) { return; }
        document.documentElement.setAttribute('data-movimiento', o.value);
        var seGuardo = false;
        try {
          window.localStorage.setItem('ig-movimiento', o.value);
          seGuardo = window.localStorage.getItem('ig-movimiento') === o.value;
        } catch (e) { seGuardo = false; }
        /* sólo se dice «guardado» si de verdad se ha guardado */
        if (aviso) { aviso.textContent = seGuardo ? T.guardado : T.temporal; }
      });
    });
  };

  /* ---------- la página pendiente mantiene el tema del que se viene ---------- */
  IG.experiencia = function () {
    var zona = document.querySelector('[data-experiencia]');
    if (!zona) { return; }
    var tema = (location.search.match(/[?&]tema=([a-z]+)/) || [])[1];
    if (tema !== 'cielo' && tema !== 'peces') { return; }
    var nombres = {
      es: { cielo: 'Cielo nocturno', peces: 'Vida marina' },
      en: { cielo: 'Night sky', peces: 'Marine life' }
    }[IDIOMA] || { cielo: 'Cielo nocturno', peces: 'Vida marina' };
    var cual = zona.querySelector('[data-cual]');
    if (cual) {
      cual.textContent = (IDIOMA === 'en' ? 'This is where ' : 'Aquí es donde se abre ') +
        nombres[tema] + (IDIOMA === 'en' ? ' will open.' : '.');
    }
    var retorno = zona.querySelector('[data-retorno]');
    if (retorno) {
      Array.prototype.forEach.call(retorno.querySelectorAll('a'), function (a) {
        var suyo = a.getAttribute('href') === tema + '.html';
        if (!suyo) { a.remove(); }
        else { a.className = 'boton'; }
      });
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    IG.menu();
    IG.filtros();
    IG.buscador();
    IG.secuencia();
    IG.tramites();
    IG.sabik();
    IG.ajustes();
    IG.experiencia();
  });
})();
