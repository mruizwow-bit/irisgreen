/* Cielo y Espacio · R03 · PRODUCTO.

   Una sola entrada, un cuaderno común y varias experiencias del mismo espacio.
   Este fichero es el armazón —pantallas, idioma, movimiento, foco, guardado,
   cuaderno— y además la experiencia del cielo, que es la que estrena el motor.
   Las demás (Sistema Solar, eclipses) se registran en IG_PRODUCTO.bloques y se
   muestran en el mismo sitio, con las mismas reglas de foco y de idioma.

   EXPERIENCIA DEL CIELO.

   Observador fijo dentro de la esfera celeste: orientar, señalar, localizar,
   revelar, profundizar y volver al mismo sitio. Nada se identifica solo y nada
   se revela antes de tiempo.

   Desde R03 el cielo es uno solo con las 88 constelaciones, y la misma esfera
   sostiene varias capas de objetivos: las figuras, los radiantes de las lluvias
   y las estrellas con planetas. El recorrido ya no es una cadena: son rutas con
   criterio declarado, más un grafo de vecindad para seguir desde donde estés. */
(function (g) {
  'use strict';
  var CFG = g.IG_CONFIG, E = g.IG_ESFERA, R = g.IG_ESCENA, COPIA = g.IG_COPIA;

  /* Las rutas NO están escritas aquí: salen de los datos, con su criterio
     declarado. Encontrar fuera de ruta sigue valiendo; la ruta sólo decide qué
     se sugiere buscar a continuación. */
  function rutas() { return (cielo && cielo.meta.rutas) || []; }

  /* ---------------------------------------------------------- capas -------
     La misma esfera sostiene tres clases de objetivo. Las constelaciones son
     patrones —hace falta un trozo seguido—; los radiantes de las lluvias y las
     estrellas con planetas son PUNTOS: basta con que el punto esté dentro de la
     zona de examen y se vea. La regla de evidencia no se relaja: se aplica a lo
     que cada cosa es.

     Nada de esto se dibuja antes de encontrarlo. Un radiante marcado de
     antemano sería el spoiler que toda la experiencia evita. */
  var puntosCapa = null;
  function objetivosDePunto() {
    if (puntosCapa) return puntosCapa[estado.capa] || [];
    puntosCapa = { radiantes: [], exoplanetas: [] };
    var M = g.IG_METEOROS, X = g.IG_EXO;
    if (M) {
      M.lluvias.forEach(function (l) {
        puntosCapa.radiantes.push({
          id: l.codigo, tipo: 'radiante', datos: l,
          nombre_es: l.nombre_es, nombre_en: l.nombre_en,
          v: E.aDireccion(l.radiante.ra_horas, l.radiante.dec_grados),
          constelacion: l.constelacion_del_radiante
        });
      });
    }
    if (X) {
      X.anfitrionas.forEach(function (a) {
        /* sólo las que el cielo DIBUJA de verdad: si su estrella no entra en la
           magnitud límite del paquete, no se puede señalar y no se finge. */
        if (a.estrella_del_cielo === null || a.estrella_del_cielo === undefined) return;
        puntosCapa.exoplanetas.push({
          id: a.nombre, tipo: 'anfitriona', datos: a,
          nombre_es: a.nombre_iau || a.nombre, nombre_en: a.nombre_iau || a.nombre,
          v: E.aDireccion(a.ra_horas, a.dec_grados),
          constelacion: a.constelacion
        });
      });
    }
    return puntosCapa[estado.capa] || [];
  }
  function capaDePuntos() { return estado.capa === 'radiantes' || estado.capa === 'exoplanetas'; }
  function hallazgosDeCapa() { return P_hallazgos(estado.capa); }
  function P_hallazgos(b) {
    if (!estado.hallazgos[b]) estado.hallazgos[b] = {};
    return estado.hallazgos[b];
  }
  /* Examinar en una capa de puntos: lo que cuenta es que el punto esté dentro
     de la zona de evidencia y sea observable en pantalla. Si hay más de uno, se
     aplica la MISMA regla que con las figuras: no se revela, se ofrecen las
     opciones descritas por su sitio. */
  function examinarPuntos(punto) {
    var m = medir(), base = E.baseCamara(estado.camara);
    var dir = E.dePantalla(punto, estado.camara, m.W, m.H, base);
    var zonas = zonasOcluidas();
    var hechos = hallazgosDeCapa();
    var dentro = [];
    objetivosDePunto().forEach(function (o) {
      if (!E.enEvidencia(dir, o.v)) return;
      var s = E.aPantalla(o.v, estado.camara, m.W, m.H, base);
      if (!E.esVisible(s, m.W, m.H, zonas)) return;
      dentro.push({ o: o, sep: E.anguloEntre(dir, o.v),
                    octante: E.octanteCeleste(dir, o.v), ya: !!hechos[o.id] });
    });
    dentro.sort(function (a, b) { return a.sep - b.sep; });
    return { dir: dir, dentro: dentro };
  }
  function rutaActual() {
    var rs = rutas();
    for (var i = 0; i < rs.length; i++) if (rs[i].id === estado.ruta) return rs[i];
    return rs[0] || null;
  }
  function recorrido() {
    var r = rutaActual();
    if (!r) return [];
    if (r.miembros.length) return r.miembros;
    /* ruta libre: el cielo entero, sin orden sugerido */
    return cielo ? cielo.constelaciones.map(function (k) { return k.abbr; }) : [];
  }
  var estado = {
    pantalla: 'portada',
    camara: null,
    estados: {}, descubiertas: {}, lugares: {}, hallazgos: {},
    activa: null, capaHallazgos: false,
    localizada: null, marca: null, mensaje: null,
    panel: null, panelAbbr: null, seccion: null, estrellaSel: null,
    objetivo: null, enContextoHallazgo: false, ladoPanel: 'derecha',
    ultimoPuntos: null, plausiblesPunto: null,
    ruta: 'anclas', capa: 'constelaciones', nivelAyuda: 3,
    idioma: 'es', movimiento: 'NORMAL', movimientoExplicito: false,
    describir: false, tecladoActivo: false, ruedaArmada: false,
    ultimoExamen: null, plausibles: null
  };

  /* Bloques del producto. Cada uno dice cómo se llama, cómo se abre y cómo se
     cierra; el armazón hace lo demás. El cielo no se registra aquí: es el que
     vive en este fichero. */
  var bloques = [];
  function registrarBloque(b) { bloques.push(b); }
  function bloquePorId(id) {
    for (var i = 0; i < bloques.length; i++) if (bloques[i].id === id) return bloques[i];
    return null;
  }

  var el = {}, ctx, cielo = null, anim = null, tAnuncio = null, tResize = null;
  var ultimoFoco = null, guardadoRoto = false, tGuardado = null, tokenFicha = 0;
  /* P1-02. Si lo guardado viene de una versión posterior a la que este paquete
     entiende, no se toca: ni se escribe encima, ni se borra, ni se promete que
     se está guardando. La sesión funciona entera, pero sólo en memoria. */
  var soloLectura = false, avisoClave = null;
  var punteros = {}, gestoMulti = false, pinza = null, mqMovimiento = null;
  var focoProgramatico = false, dialogo = null, medidas = { cuadros: 0, ms: 0 };
  /* C3D-03. La retícula central es APOYO del teclado, no la metáfora. Sólo
     aparece si la última entrada real fue de teclado; un foco que mueve el
     programa no la enciende. */
  var ultimaEntrada = 'puntero';

  function t() { return COPIA[estado.idioma]; }
  function porAbbr(a) { return cielo.porAbbr[a]; }
  function nombreDe(a) { var k = porAbbr(a); return k ? (estado.idioma === 'es' ? k.nombre_es : k.nombre_en) : a; }

  /* ------------------------------------------------------- guardado ------ */
  var VERSION_GUARDADO = 1;
  function guardar() {
    if (tGuardado) { clearTimeout(tGuardado); tGuardado = null; }
    if (soloLectura) return;          /* los bytes de la versión futura se quedan como están */
    try {
      localStorage.setItem('iris-green.cielo-3d.r02', JSON.stringify({
        v: VERSION_GUARDADO, descubiertas: Object.keys(estado.descubiertas),
        lugares: estado.lugares, camara: estado.camara,
        hallazgos: estado.hallazgos, ruta: estado.ruta, ayuda: estado.nivelAyuda, capa: estado.capa,
        idioma: estado.idioma,
        movimiento: estado.movimientoExplicito ? estado.movimiento : null
      }));
    } catch (e) {
      if (!guardadoRoto) { guardadoRoto = true; avisar('aviso_guardado'); }
    }
  }
  function guardarDiferido() {
    if (tGuardado) return;
    tGuardado = setTimeout(function () { tGuardado = null; guardar(); }, 400);
  }
  function num(x, a, b) { return typeof x === 'number' && isFinite(x) && x >= a && x <= b; }
  function camaraValida(c) {
    return !!c && typeof c === 'object' && num(c.ra, 0, 24) && num(c.dec, -90, 90) &&
      num(c.fov, CFG.CAMPO_VISION.minimo, CFG.CAMPO_VISION.maximo);
  }
  function cargar() {
    var s;
    try { s = JSON.parse(localStorage.getItem('iris-green.cielo-3d.r02') || '{}'); } catch (e) { s = null; }
    /* Una versión POSTERIOR no se entiende, pero tampoco es basura: es progreso
       de alguien, guardado por una versión más nueva. No se lee —no se sabe qué
       significa— y, sobre todo, no se destruye. */
    if (s && typeof s === 'object' && typeof s.v === 'number' && isFinite(s.v) && s.v > VERSION_GUARDADO) {
      soloLectura = true;
      avisar('aviso_guardado_futuro');
      return;
    }
    if (!s || typeof s !== 'object' || s.v !== VERSION_GUARDADO) return;
    if (Array.isArray(s.descubiertas)) {
      s.descubiertas.forEach(function (a) { if (typeof a === 'string' && porAbbr(a)) estado.descubiertas[a] = true; });
    }
    if (s.lugares && typeof s.lugares === 'object') {
      Object.keys(s.lugares).forEach(function (a) {
        if (porAbbr(a) && camaraValida(s.lugares[a])) estado.lugares[a] = s.lugares[a];
      });
    }
    if (camaraValida(s.camara)) estado.camaraGuardada = { ra: s.camara.ra, dec: s.camara.dec, fov: s.camara.fov };
    if (s.hallazgos && typeof s.hallazgos === 'object') {
      Object.keys(s.hallazgos).forEach(function (b) {
        var h = s.hallazgos[b];
        if (!h || typeof h !== 'object') return;
        estado.hallazgos[b] = {};
        Object.keys(h).forEach(function (id) {
          if (typeof id === 'string' && id.length < 64) estado.hallazgos[b][id] = true;
        });
      });
    }
    if (typeof s.ruta === 'string' && s.ruta.length < 40) estado.ruta = s.ruta;
    if (s.ayuda === 1 || s.ayuda === 2 || s.ayuda === 3) estado.nivelAyuda = s.ayuda;
    if (s.capa === 'constelaciones' || s.capa === 'radiantes' || s.capa === 'exoplanetas') estado.capa = s.capa;
    if (s.idioma === 'es' || s.idioma === 'en') estado.idioma = s.idioma;
    if (typeof s.movimiento === 'string' && CFG.MOVIMIENTO[s.movimiento] !== undefined) {
      estado.movimiento = s.movimiento; estado.movimientoExplicito = true;
    }
  }

  /* -------------------------------------------------------- arranque ---- */
  function iniciar() {
    ['portada','escena','escenario','lienzo','panel','panel-titulo','panel-cuerpo',
     'btn-cerrar-panel','btn-examinar','mensaje','btn-revelar','btn-saber-mas','descripcion',
     'descripcion-region','descripcion-entorno','aviso','btn-describir','btn-fuentes','btn-borrar',
     'anuncio','sel-movimiento','btn-empezar','btn-continuar','btn-volver-portada','objetivo',
     'btn-continuar-pista','orientacion','btn-capa','btn-cuaderno','progreso-global','hero-intro','fuentes-fuera',
     'entradas','btn-cuaderno-inicio','sel-ruta','sel-ayuda','btn-seguir','sel-capa',
     'velo','dialogo','dialogo-titulo','dialogo-texto','dialogo-cancelar','dialogo-confirmar']
      .forEach(function (id) { el[id] = document.getElementById(id); });

    try { ctx = el.lienzo.getContext('2d'); } catch (e) { ctx = null; }
    if (!ctx && g.IG_ESCENA_ERROR) {
      g.IG_ESCENA_ERROR('SIN_CANVAS_2D', '2d context not granted for the sky canvas', null);
    }
    if (!ctx) {                       /* sin canvas 2D no hay cielo que dibujar */
      mostrarAviso('Este navegador no ha podido abrir el lienzo. La experiencia 2D del paquete ' +
                   'DESCUBRIMIENTO_CIELO_COMPLETO sigue siendo la vía disponible.');
      return;
    }
    if (g.matchMedia) {
      mqMovimiento = g.matchMedia('(prefers-reduced-motion: reduce)');
      var seguirSistema = function () {
        if (estado.movimientoExplicito) return;
        estado.movimiento = mqMovimiento.matches ? 'REDUCED' : 'NORMAL';
        if (el['sel-movimiento']) el['sel-movimiento'].value = estado.movimiento;
      };
      if (mqMovimiento.addEventListener) mqMovimiento.addEventListener('change', seguirSistema);
      else if (mqMovimiento.addListener) mqMovimiento.addListener(seguirSistema);
      estado.movimiento = mqMovimiento.matches ? 'REDUCED' : 'NORMAL';
    }

    cielo = E.construirCielo(g.IG_CIELO88);
    cargar();
    enlazar();
    aplicarIdioma();
    actualizarPulsados();
    /* R04 · WORLD_SCENE_FIRST: al abrir, lo primero es el cielo ocupando la
       ventana, no una portada de texto con contadores. La portada no se borra
       —sigue siendo la puerta a las tres experiencias y al cuaderno— pero pasa
       a estar detrás del botón «Volver a la portada» de la escena. Si ya había
       hallazgos guardados, se entra por donde se dejó. */
    abrirEscena(Object.keys(estado.descubiertas).length > 0);
    if (g.matchMedia && g.matchMedia('(forced-colors: active)').matches) mostrarAviso(t().aviso_forced);
  }

  /* ------------------------------------------------------- pantallas ---- */
  function enfocar(nodo) {
    if (!nodo) return;
    focoProgramatico = true;
    setTimeout(function () { focoProgramatico = false; }, 0);
    if (nodo.tabIndex < 0 && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(nodo.tagName)) {
      nodo.setAttribute('tabindex', '-1');
    }
    try { nodo.focus(); } catch (e) {}
  }
  /* Una sola gestión de pantallas para todo el producto: la portada, el cielo y
     cualquier bloque registrado. Cambiar de experiencia no pierde el cuaderno
     ni los ajustes, y el foco siempre acaba en un sitio visible. */
  function mostrarPantalla(p) {
    var cambia = estado.pantalla !== p;
    var anterior = estado.pantalla;
    estado.pantalla = p;
    tokenFicha++;
    if (cambia && anterior && anterior !== 'portada' && anterior !== 'escena') {
      var b0 = bloquePorId(anterior);
      if (b0 && b0.cerrar) b0.cerrar();
    }
    el.portada.hidden = p !== 'portada';
    el.escena.hidden = p !== 'escena';
    bloques.forEach(function (b) {
      var nodo = document.getElementById(b.seccion);
      if (nodo) nodo.hidden = (p !== b.id);
    });
    if (p === 'portada') pintarPortada();
    if (cambia && p !== 'portada' && p !== 'escena') {
      var b = bloquePorId(p);
      if (b && b.abrir) b.abrir();
    }
    if (cambia) {
      var destino = el['btn-empezar'];
      if (p === 'escena') destino = el.escenario;
      else if (p !== 'portada') {
        var b2 = bloquePorId(p);
        destino = (b2 && b2.foco && b2.foco()) || el['btn-inicio-' + p] || el['btn-empezar'];
      }
      enfocar(destino);
    }
  }
  /* La portada del producto: las experiencias, con lo que llevas encontrado en
     cada una. No obliga a recorrerlas en ningún orden. */
  function entradas() {
    var L = t();
    var capas = [];
    if (g.IG_METEOROS) capas.push({ nombre: L.capa_radiantes,
      hechos: Object.keys(estado.hallazgos.radiantes || {}).length, total: g.IG_METEOROS.total });
    if (g.IG_EXO) {
      var n = 0;
      g.IG_EXO.anfitrionas.forEach(function (a) {
        if (a.estrella_del_cielo !== null && a.estrella_del_cielo !== undefined) n++;
      });
      capas.push({ nombre: L.capa_exoplanetas,
        hechos: Object.keys(estado.hallazgos.exoplanetas || {}).length, total: n });
    }
    var lista = [{ id: 'escena', nombre: L.bloque_cielo, resumen: L.bloque_cielo_resumen,
                   hechos: Object.keys(estado.descubiertas).length,
                   total: cielo ? cielo.constelaciones.length : 0, capas: capas }];
    bloques.forEach(function (b) {
      var h = estado.hallazgos[b.id] || {};
      lista.push({ id: b.id, nombre: L[b.clave_nombre], resumen: L[b.clave_resumen],
                   hechos: Object.keys(h).length,
                   total: (b.total && b.total()) || 0 });
    });
    return lista;
  }
  function pintarPortada() {
    var L = t();
    var caja = el['entradas'];
    caja.textContent = '';
    entradas().forEach(function (e) {
      var art = document.createElement('article');
      art.className = 'ig-entrada';
      var h = document.createElement('h2');
      h.className = 'ig-entrada-titulo';
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'ig-entrada-btn';
      b.id = 'btn-inicio-' + e.id;
      b.textContent = e.nombre;
      b.addEventListener('click', function () {
        if (e.id === 'escena') abrirEscena(Object.keys(estado.descubiertas).length > 0);
        else mostrarPantalla(e.id);
      });
      h.appendChild(b); art.appendChild(h);
      var p1 = document.createElement('p');
      p1.className = 'ig-nota'; p1.textContent = e.resumen;
      art.appendChild(p1);
      var p2 = document.createElement('p');
      p2.className = 'ig-entrada-progreso';
      p2.textContent = e.total ? L.progreso_bloque(e.hechos, e.total) : '';
      art.appendChild(p2);
      (e.capas || []).forEach(function (c) {
        var p3 = document.createElement('p');
        p3.className = 'ig-entrada-progreso';
        p3.textContent = c.nombre + ': ' + L.progreso_bloque(c.hechos, c.total);
        art.appendChild(p3);
      });
      caja.appendChild(art);
    });
    /* R04 · este botón salía sin texto desde R03.1: un botón primario en
       blanco en mitad de la portada. Era un defecto, no una decisión. */
    el['btn-empezar'].textContent = Object.keys(estado.descubiertas).length
      ? L.continuar_explorando : L.empezar_explorar;
    el['btn-continuar'].textContent = L.continuar_explorando;
    el['btn-continuar'].hidden = true;
    el['btn-cuaderno-inicio'].textContent = L.cuaderno;
    var total = Object.keys(estado.descubiertas).length +
      bloques.reduce(function (s, b) { return s + Object.keys(estado.hallazgos[b.id] || {}).length; }, 0);
    el['btn-cuaderno-inicio'].hidden = total === 0;
    el['progreso-global'].textContent = total ? L.progreso_total(total) : '';
  }

  /* ----------------------------------------------------- entrar al cielo - */
  /* P2. La entrada mira a la zona de la raíz del recorrido, pero sin centrar su
     patrón: hay que buscarlo. La raíz ya NO está escrita aquí —sale de
     orden_saltos—; el desvío de entrada sigue siendo una constante declarada y
     debería pasar a los datos antes de 88/88. Con los datos actuales la raíz es
     Orión y la cámara resultante es idéntica a la de R02: lo comprueba U18. */
  function camaraInicial() {
    var raiz = recorrido()[0];
    var k = raiz ? porAbbr(raiz) : null;
    if (!k) return E.ajustarCamara({ ra: 0, dec: 0, fov: CFG.CAMPO_VISION.inicial });
    /* Punto de referencia: el centro del subpatrón documentado si lo hay, y si
       no, el ancla medida de la figura. Nunca un índice adivinado. */
    var ref = k.especial ? k.puntos[k.especial.indices[Math.floor(k.especial.indices.length / 2)]]
                         : (k.ancla ? k.puntos[k.ancla.punto_indice] : k.puntos[0]);
    var c = E.aCoordenadas(ref.v);
    var entrada = (g.IG_R04_CIELO && g.IG_R04_CIELO.entrada) || { offset_ra_horas: 0, offset_dec_grados: 0 };
    return E.ajustarCamara({ ra: (c.ra + entrada.offset_ra_horas + 24) % 24,
                             dec: c.dec + entrada.offset_dec_grados,
                             fov: CFG.CAMPO_VISION.inicial });
  }
  function abrirEscena(continuar) {
    estado.camara = (continuar && estado.camaraGuardada)
      ? { ra: estado.camaraGuardada.ra, dec: estado.camaraGuardada.dec, fov: estado.camaraGuardada.fov }
      : camaraInicial();
    E.ajustarCamara(estado.camara);
    estado.estados = {};
    Object.keys(estado.descubiertas).forEach(function (a) { estado.estados[a] = 'revelada'; });
    estado.localizada = null; estado.marca = null; estado.mensaje = null;
    estado.activa = null; estado.enContextoHallazgo = false; estado.ruedaArmada = false;
    estado.ambiguas = null;
    cerrarPanel(true);
    elegirObjetivo();
    mostrarPantalla('escena');
    redimensionar();
    var ayudaR04 = document.getElementById('ayuda-flotante');
    if (ayudaR04) { ayudaR04.hidden = false; ayudaR04.classList.remove('ig-retirada');
      clearTimeout(ayudaR04._timer); ayudaR04._timer = setTimeout(function(){ ayudaR04.classList.add('ig-retirada'); }, 5200); }
    pintarMensaje();
  }

  /* El objetivo interno se recalcula al instante; el MOSTRADO espera a que se
     vuelva a explorar a propósito. */
  function elegirObjetivo() {
    if (capaDePuntos()) {
      /* En las capas de puntos el objetivo es el siguiente sin encontrar, por
         orden de lo que más se ve: las lluvias más activas y las estrellas más
         claras primero. */
      var hechos = hallazgosDeCapa();
      var pend = objetivosDePunto().filter(function (o) { return !hechos[o.id]; });
      if (estado.capa === 'radiantes') {
        pend.sort(function (a, b) { return (b.datos.zhr || 0) - (a.datos.zhr || 0); });
      }
      estado.objetivo = pend.length ? pend[0].id : null;
      pintarObjetivo();
      return;
    }
    var r = rutaActual();
    if (r && r.tipo === 'libre') { estado.objetivo = null; pintarObjetivo(); return; }
    var pend = recorrido().filter(function (a) { return !estado.descubiertas[a]; });
    estado.objetivo = pend.length ? pend[0] : null;
    pintarObjetivo();
  }
  /* «Seguir desde aquí»: la vecina sin encontrar más cercana a lo último que se
     ha encontrado, medida sobre el grafo de vecindad. No salta a la otra punta
     del cielo: se queda donde estás. */
  function seguirDesdeAqui() {
    var base = estado.activa || estado.enContextoHallazgo;
    var k = base ? porAbbr(base) : null;
    if (!k || !k.vecinas.length) { anunciar(t().sin_vecinas); return; }
    var sig = null;
    k.vecinas.forEach(function (s) {
      if (estado.descubiertas[s.hasta]) return;
      if (!sig || s.separacion_grados < sig.separacion_grados) sig = s;
    });
    if (!sig) { anunciar(t().sin_vecinas); return; }
    estado.objetivo = sig.hasta;
    estado.enContextoHallazgo = false;
    pintarObjetivo();
    enfocar(el.escenario);
    anunciar(t().siguiente_pista);
  }
  /* La pista se compone con datos medidos, nunca con texto escrito a mano:
     la forma sale de los rasgos de la figura, y el salto —si hay desde dónde
     saltar— del grafo de vecindad. Si no se ha encontrado todavía ninguna
     vecina, se describe sólo la forma. Ninguna pista nombra su objetivo.

     Ayuda progresiva (nivel): 1 relación/forma · 2 dirección aproximada ·
     3 ancla ya aprendida. Nunca el nombre de lo que hay que encontrar. */
  function saltoDisponible(abbr) {
    var k = porAbbr(abbr);
    if (!k || !k.vecinas) return null;
    var mejor = null;
    k.vecinas.forEach(function (s) {
      if (!estado.descubiertas[s.hasta]) return;      /* sólo desde lo ya conocido */
      if (!s.hasta_estrella) return;
      /* se salta DESDE la vecina encontrada HACIA el objetivo: hay que invertir */
      var inv = E.saltoInverso(s);
      if (!mejor || inv.separacion_grados < mejor.separacion_grados) mejor = inv;
    });
    return mejor;
  }
  /* La pista de un punto: desde qué constelación ya encontrada está, cuántos
     grados y hacia dónde. Nunca dice cuál es. */
  function textoPistaPunto(id) {
    var L = t(), es = estado.idioma === 'es';
    var o = puntoPorId(estado.capa, id);
    if (!o) return '';
    var queEs = estado.capa === 'radiantes' ? L.pista_radiante : L.pista_anfitriona;
    if (estado.nivelAyuda < 2) return queEs;
    var k = o.constelacion && estado.descubiertas[o.constelacion] ? porAbbr(o.constelacion) : null;
    if (!k || !k.ancla) return queEs;
    var v = k.puntos[k.ancla.punto_indice].v;
    var sep = E.anguloEntre(v, o.v);
    var oct = E.octanteCeleste(v, o.v);
    var dir = L.octantes[oct] || L.octantes.aqui;
    var pun = L.punos(Math.max(1, Math.round(sep / 10)));
    if (estado.nivelAyuda === 2) return L.pista_direccion(Math.round(sep), dir, pun, queEs);
    return L.pista_salto(k.ancla.estrella, Math.round(sep), dir, pun, queEs);
  }
  function textoPista(abbr) {
    if (capaDePuntos()) return textoPistaPunto(abbr);
    var k = porAbbr(abbr), L = t(), es = estado.idioma === 'es';
    if (!k) return '';
    var forma = es ? k.rasgos_frase_es : k.rasgos_frase_en;
    var n = estado.nivelAyuda;
    var s = (n >= 2) ? saltoDisponible(abbr) : null;
    if (!s) return L.pista_forma(forma);
    if (n === 2) return L.pista_direccion(Math.round(s.separacion_grados),
      es ? s.direccion_es : s.direccion_en, es ? s.punos_es : s.punos_en, forma);
    return L.pista_salto(s.desde_estrella, Math.round(s.separacion_grados),
      es ? s.direccion_es : s.direccion_en, es ? s.punos_es : s.punos_en, forma);
  }
  function pintarObjetivo() {
    var L = t();
    if (estado.enContextoHallazgo) {
      el.objetivo.textContent = L.contexto_hallazgo(nombreDe(estado.enContextoHallazgo));
      el['btn-continuar-pista'].hidden = false;
      el['btn-continuar-pista'].textContent = L.continuar;
      el['btn-seguir'].hidden = false;
      el['btn-seguir'].textContent = L.seguir_desde_aqui;
      return;
    }
    el['btn-continuar-pista'].hidden = true;
    var r = rutaActual();
    if (!estado.objetivo && r && r.tipo === 'libre') el.objetivo.textContent = L.ruta_libre_texto;
    else el.objetivo.textContent = estado.objetivo ? textoPista(estado.objetivo) : L.todo_encontrado;
    el['btn-seguir'].hidden = !(estado.activa && !estado.enContextoHallazgo);
    el['btn-seguir'].textContent = L.seguir_desde_aqui;
  }
  function volverAExplorar(mueveFoco) {
    if (!estado.enContextoHallazgo) return false;
    estado.enContextoHallazgo = false;
    pintarObjetivo();
    if (mueveFoco !== false) enfocar(el.escenario);
    anunciar(t().siguiente_pista);
    return true;
  }

  /* ---------------------------------------------------------- medidas --- */
  function medir() {
    var r = el.escenario.getBoundingClientRect();
    return { W: Math.max(1, Math.round(r.width)), H: Math.max(1, Math.round(r.height)),
             dpr: Math.min(g.devicePixelRatio || 1, 2) };
  }
  function redimensionar() {
    if (!cielo || !estado.camara) return;
    var m = medir();
    el.lienzo.width = Math.round(m.W * m.dpr);
    el.lienzo.height = Math.round(m.H * m.dpr);
    pintar();
    if (estado.describir) actualizarDescripcion(false);
  }
  /* Nada se dibuja encima del cielo: la lista de oclusores existe para que la
     evidencia sepa qué NO se está viendo, y en este piloto está vacía salvo
     que algo flote sobre el lienzo. */
  /* Cuánto del lienzo tapa la tira de controles. El suelo y la profundidad del
     aire se dibujan dentro de lo que queda a la vista, no debajo de la tira. */
  function altoDeLaTira() {
    var t = document.getElementById('tira');
    if (!t || t.hidden || !el.escenario) return 0;
    var r = t.getBoundingClientRect(), b = el.escenario.getBoundingClientRect();
    if (!r.height) return 0;
    return Math.max(0, Math.min(b.height, b.bottom - r.top));
  }
  function zonasOcluidas() {
    var base = el.escenario.getBoundingClientRect(), zonas = [];
    var nodos = document.querySelectorAll('[data-occluder]');
    for (var i = 0; i < nodos.length; i++) {
      var n = nodos[i];
      if (n.hidden || n.offsetParent === null) continue;
      var r = n.getBoundingClientRect();
      if (r.right < base.left || r.left > base.right || r.bottom < base.top || r.top > base.bottom) continue;
      zonas.push({ x: r.left - base.left - 4, y: r.top - base.top - 4, w: r.width + 8, h: r.height + 8 });
    }
    return zonas;
  }
  function pintar() {
    if (!cielo || !estado.camara) return;
    var m = medir(), t0 = (g.performance || Date).now();
    R.dibujar(ctx, {
      cielo: cielo, camara: estado.camara, ancho: m.W, alto: m.H, dpr: m.dpr,
      margenInferior: altoDeLaTira(),
      estados: estado.estados, activa: estado.activa, capaHallazgos: estado.capaHallazgos,
      marca: estado.marca, centro: estado.tecladoActivo, idioma: estado.idioma,
      marcadas: (estado.localizada && estado.localizada.puntos) ? estado.localizada.puntos : [],
      puntosCapa: puntosDibujables(),
      estrellaSeleccionada: estado.estrellaSel
    });
    medidas.cuadros++; medidas.ms += (g.performance || Date).now() - t0;
    pintarOrientacion();
  }
  /* Sólo se dibuja lo que YA se ha encontrado, y lo que se está localizando.
     Marcar de antemano un radiante sería decir dónde está. */
  function puntosDibujables() {
    if (!capaDePuntos()) return [];
    var hechos = hallazgosDeCapa(), out = [];
    objetivosDePunto().forEach(function (o) {
      if (hechos[o.id]) out.push({ v: o.v, nombre: estado.idioma === 'es' ? o.nombre_es : o.nombre_en,
                                   tipo: o.tipo, hallado: true });
    });
    if (estado.localizada && estado.localizada.punto) {
      out.push({ v: estado.localizada.punto.v, nombre: null, tipo: estado.localizada.punto.tipo,
                 hallado: false });
    }
    return out;
  }
  function pintarOrientacion() {
    var L = t(), c = estado.camara;
    el.orientacion.textContent = L.orientacion_actual(
      (Math.round(c.ra * 100) / 100).toFixed(2), Math.round(c.dec), E.aperturaGrados());
  }

  /* ---------------------------------------------------------- cámara ---- */
  function cancelarAnimacion() { if (anim !== null) { cancelAnimationFrame(anim); anim = null; } }
  function congelarCamara() {
    if (anim === null) return false;
    cancelarAnimacion(); E.ajustarCamara(estado.camara); pintar();
    return true;
  }
  function irA(destino) {
    E.ajustarCamara(destino);
    cancelarAnimacion();
    var dur = CFG.MOVIMIENTO[estado.movimiento];
    if (dur <= 0) { estado.camara = destino; pintar(); trasMovimiento(); return; }
    var ini = { ra: estado.camara.ra, dec: estado.camara.dec, fov: estado.camara.fov };
    var dra = destino.ra - ini.ra;
    while (dra > 12) dra -= 24;
    while (dra < -12) dra += 24;
    var t0 = (g.performance || Date).now(), suave = estado.movimiento === 'NORMAL';
    function paso(ahora) {
      var p = Math.min(1, (ahora - t0) / dur);
      var e = suave ? 1 - Math.pow(1 - p, 3) : p;
      estado.camara.ra = (ini.ra + dra * e + 24) % 24;
      estado.camara.dec = ini.dec + (destino.dec - ini.dec) * e;
      estado.camara.fov = ini.fov + (destino.fov - ini.fov) * e;
      pintar();
      if (p < 1) anim = requestAnimationFrame(paso);
      else { anim = null; estado.camara = destino; pintar(); trasMovimiento(); }
    }
    anim = requestAnimationFrame(paso);
  }
  function trasMovimiento() {
    guardarDiferido();
    if (estado.describir) actualizarDescripcion(true);
  }
  function orientar(dra, ddec) {
    var paso = CFG.PASO_TECLADO_GRADOS * (estado.camara.fov / CFG.CAMPO_VISION.inicial);
    paso = Math.min(paso, CFG.PASO_TECLADO_GRADOS);
    var d = { ra: estado.camara.ra + dra * paso / 15 / Math.max(0.2, Math.cos(estado.camara.dec * E.GRADO)),
              dec: estado.camara.dec + ddec * paso, fov: estado.camara.fov };
    irA(E.ajustarCamara(d));
  }
  function ampliar(f, p) {
    var m = medir();
    var d = E.camaraAmpliada(estado.camara, m.W, m.H, estado.camara.fov / f, p);
    if (Math.abs(d.fov - estado.camara.fov) < 1e-9) return;
    irA(d);
  }

  /* -------------------------------------------------------- examinar ---- */
  function examinar(origen, p) {
    if (!cielo) return;
    volverAExplorar(false);
    congelarCamara();
    var m = medir();
    var punto = p || E.centroVista(m.W, m.H);

    if (origen === 'puntero') {
      var e = E.estrellaEn(cielo, estado.camara, m.W, m.H, punto, CFG.TOLERANCIA_ENTRADA_PX, zonasOcluidas());
      if (e && e.datos && e.datos.con && estado.descubiertas[e.datos.con]) { abrirEstrella(e); return; }
    }
    if (capaDePuntos()) { examinarEnCapa(punto, origen); return; }
    var hechas = {};
    Object.keys(estado.descubiertas).forEach(function (a) { hechas[a] = true; });
    var r = E.examinar(cielo, estado.camara, m.W, m.H, zonasOcluidas(), punto, hechas);
    estado.ultimoExamen = r;
    estado.marca = r.direccion;
    estado.estrellaSel = null;
    estado.plausibles = null;

    if (!r.coincide) {
      var ya = r.detalle.filter(function (d) { return d.excluida && d.sustenta; })
        .sort(function (x, y) { return y.dentro - x.dentro; })[0];
      if (ya) {
        estado.activa = ya.abbr; estado.localizada = null; estado.marca = null;
        estado.mensaje = { tipo: 'ya', abbr: ya.abbr };
      } else if (r.resultado === 'ambiguo') {
        /* C3D-02: no se identifica nada. Se dice que hay más de un patrón y se
           ofrecen las opciones DESCRITAS POR SU SITIO, nunca por su nombre.
           La orientación no se toca. */
        estado.localizada = null;
        estado.plausibles = r.plausibles;
        estado.mensaje = { tipo: 'ambiguo', n: r.plausibles.length };
      } else {
        estado.localizada = null;
        estado.mensaje = { tipo: 'neutral' };
      }
      pintarMensaje(); pintar(); anunciar(textoMensaje());
      if (estado.describir) actualizarDescripcion(false);
      return;
    }
    localizar(r.mejor.abbr, r.mejor.puntos_dentro, origen);
  }

  function examinarEnCapa(punto, origen) {
    var L = t(), r = examinarPuntos(punto);
    estado.marca = r.dir;
    estado.localizada = null; estado.plausibles = null; estado.ultimoPuntos = r;
    var nuevos = r.dentro.filter(function (d) { return !d.ya; });
    if (!r.dentro.length) {
      estado.mensaje = { tipo: 'neutral' };
    } else if (!nuevos.length) {
      estado.activa = null;
      estado.mensaje = { tipo: 'punto_ya', id: r.dentro[0].o.id, capa: estado.capa };
    } else if (nuevos.length === 1) {
      estado.localizada = { punto: nuevos[0].o, capa: estado.capa };
      estado.marca = null;
      estado.mensaje = { tipo: 'punto_localizado', id: nuevos[0].o.id, capa: estado.capa };
    } else {
      /* misma regla que con las figuras: no se revela y se describe por su sitio */
      estado.plausiblesPunto = nuevos.map(function (d) {
        return { id: d.o.id, octante: d.octante, separacion_grados: Math.round(d.sep * 10) / 10 };
      });
      estado.mensaje = { tipo: 'punto_ambiguo', n: nuevos.length };
    }
    pintarMensaje(); pintar(); anunciar(textoMensaje());
    if (estado.localizada) {
      asegurarVisible(el['btn-revelar']);
      if (origen === 'boton') el['btn-revelar'].focus();
    }
    if (estado.describir) actualizarDescripcion(false);
  }
  function revelarPunto() {
    var p = estado.localizada && estado.localizada.punto;
    if (!p) return;
    congelarCamara();
    var capa = estado.localizada.capa;
    P_hallazgos(capa)[p.id] = true;
    estado.lugares[capa + ':' + p.id] = { ra: estado.camara.ra, dec: estado.camara.dec, fov: estado.camara.fov };
    estado.localizada = null;
    estado.activa = null;
    estado.mensaje = { tipo: 'punto_revelado', id: p.id, capa: capa };
    guardar();
    pintarMensaje(); pintar();
    asegurarVisible(el['btn-saber-mas']);
    el['btn-saber-mas'].focus();
    anunciar(textoMensaje());
  }
  function puntoPorId(capa, id) {
    var guardada = estado.capa;
    estado.capa = capa;
    var lista = objetivosDePunto();
    estado.capa = guardada;
    for (var i = 0; i < lista.length; i++) if (lista[i].id === id) return lista[i];
    return null;
  }

  function localizar(abbr, puntos, origen) {
    var k = porAbbr(abbr);
    estado.localizada = { abbr: abbr, puntos: puntos };
    estado.marca = null;
    estado.mensaje = { tipo: k.especial ? k.especial.tipo : 'localizada', abbr: abbr, n: puntos.length };
    pintarMensaje(); pintar();
    asegurarVisible(el['btn-revelar']);
    if (origen === 'boton') el['btn-revelar'].focus();
    else if (origen === 'escenario') el.escenario.focus();
    anunciar(textoMensaje());
    if (estado.describir) actualizarDescripcion(false);
  }

  /* Identificar NO mueve la cámara, no centra nada y no cambia el zoom. */
  function revelar() {
    if (!estado.localizada) return;
    if (estado.localizada.punto) { revelarPunto(); return; }
    congelarCamara();
    var abbr = estado.localizada.abbr;
    estado.estados[abbr] = 'revelada';
    estado.descubiertas[abbr] = true;
    estado.activa = abbr;
    estado.lugares[abbr] = { ra: estado.camara.ra, dec: estado.camara.dec, fov: estado.camara.fov };
    estado.localizada = null;
    estado.mensaje = { tipo: 'hallada', abbr: abbr };
    estado.enContextoHallazgo = abbr;
    guardar();
    pintarMensaje(); pintar();
    elegirObjetivo();
    asegurarVisible(el['btn-saber-mas']);
    el['btn-saber-mas'].focus();
    anunciar(t().has_encontrado(nombreDe(abbr)));
  }

  function nombreDePunto(capa, id) {
    var p = puntoPorId(capa, id);
    if (!p) return id;
    return estado.idioma === 'es' ? p.nombre_es : p.nombre_en;
  }
  function textoMensaje() {
    var L = t(), m = estado.mensaje;
    if (!m) return '';
    if (m.tipo === 'punto_localizado') {
      return m.capa === 'radiantes' ? L.radiante_localizado : L.anfitriona_localizada;
    }
    if (m.tipo === 'punto_revelado') {
      return m.capa === 'radiantes' ? L.radiante_revelado(nombreDePunto(m.capa, m.id))
                                    : L.anfitriona_revelada(nombreDePunto(m.capa, m.id));
    }
    if (m.tipo === 'punto_ya') return L.punto_ya(nombreDePunto(m.capa, m.id));
    if (m.tipo === 'punto_ambiguo') return L.punto_ambiguo(m.n);
    if (m.tipo === 'neutral') {
      return estado.capa === 'radiantes' ? L.sin_radiante
           : estado.capa === 'exoplanetas' ? L.sin_anfitriona : L.sin_patron;
    }
    if (m.tipo === 'ambiguo') return L.ambiguo;
    if (m.tipo === 'cinturon') return L.encontradas_lbl + ' ' + L.es_cinturon;
    if (m.tipo === 'hiades') return L.hiades_lbl + ' ' + L.es_hiades;
    if (m.tipo === 'localizada') return L.localizado(m.n);
    if (m.tipo === 'ya') return L.ya_encontrada(nombreDe(m.abbr));
    return L.has_encontrado(nombreDe(m.abbr));
  }
  function pintarMensaje() {
    var L = t(), m = estado.mensaje;
    el.mensaje.textContent = '';
    el['btn-revelar'].hidden = true; el['btn-revelar'].textContent = '';
    el['btn-saber-mas'].hidden = true; el['btn-saber-mas'].textContent = '';
    el['btn-examinar'].hidden = false;
    if (!m) return;
    if (m.tipo === 'punto_localizado') {
      el.mensaje.textContent = textoMensaje();
      el['btn-revelar'].textContent = m.capa === 'radiantes' ? L.ver_que_lluvia : L.ver_que_estrella;
      el['btn-revelar'].hidden = false;
      el['btn-examinar'].hidden = true;
      return;
    }
    if (m.tipo === 'punto_revelado' || m.tipo === 'punto_ya') {
      el.mensaje.textContent = textoMensaje();
      el['btn-saber-mas'].textContent = L.saber_mas;
      el['btn-saber-mas'].hidden = false;
      return;
    }
    if (m.tipo === 'punto_ambiguo') {
      el.mensaje.appendChild(document.createTextNode(textoMensaje() + ' '));
      var s0 = document.createElement('span');
      s0.className = 'ig-mensaje-2'; s0.textContent = L.elige_uno;
      el.mensaje.appendChild(s0);
      var caja0 = document.createElement('span');
      caja0.className = 'ig-acciones';
      (estado.plausiblesPunto || []).forEach(function (q) {
        /* Si está justo en el punto señalado, decir «a la derecha, a 0°» sería
           ruido: se dice que está donde se está señalando. */
        var etiqueta = q.separacion_grados < 0.5
          ? L.opcion_lugar(L.octantes.aqui, 0)
          : L.opcion_lugar(L.octantes[q.octante] || L.octantes.aqui, q.separacion_grados);
        caja0.appendChild(boton(etiqueta, function () { elegirPunto(q.id); }));
      });
      el.mensaje.appendChild(caja0);
      return;
    }
    if (m.tipo === 'neutral') { el.mensaje.textContent = textoMensaje(); return; }
    if (m.tipo === 'ambiguo') {
      el.mensaje.appendChild(document.createTextNode(L.ambiguo + ' '));
      if (estado.plausibles && estado.plausibles.length) {
        var s = document.createElement('span');
        s.className = 'ig-mensaje-2';
        s.textContent = L.elige_uno;
        el.mensaje.appendChild(s);
        var caja = document.createElement('span');
        caja.className = 'ig-acciones';
        etiquetasPlausibles().forEach(function (o) {
          caja.appendChild(boton(o.texto, function () { elegirAmbigua(o.abbr); }));
        });
        el.mensaje.appendChild(caja);
      }
      return;
    }
    if (m.tipo === 'ya') {
      el.mensaje.textContent = L.ya_encontrada(nombreDe(m.abbr));
      el['btn-saber-mas'].textContent = L.saber_mas; el['btn-saber-mas'].hidden = false;
      return;
    }
    if (m.tipo === 'hallada') {
      el.mensaje.textContent = L.has_encontrado(nombreDe(m.abbr));
      el['btn-saber-mas'].textContent = L.saber_mas; el['btn-saber-mas'].hidden = false;
      return;
    }
    if (m.tipo === 'cinturon' || m.tipo === 'hiades') {
      el.mensaje.appendChild(document.createTextNode(m.tipo === 'cinturon' ? L.encontradas_lbl : L.hiades_lbl));
      var s2 = document.createElement('span');
      s2.className = 'ig-mensaje-2';
      s2.textContent = m.tipo === 'cinturon' ? L.es_cinturon : L.es_hiades;
      el.mensaje.appendChild(s2);
    } else {
      el.mensaje.textContent = L.localizado(m.n);
    }
    el['btn-revelar'].textContent = L.ver_constelacion;
    el['btn-revelar'].hidden = false;
    el['btn-examinar'].hidden = true;
  }
  /* Cada opción se describe por DÓNDE está respecto a lo que se señaló: un
     octante del cielo y una separación angular. Nada de píxeles —cambiarían
     con la pantalla— y nada de nombres —serían el spoiler que se evita. */
  function etiquetasPlausibles() {
    var L = t(), lista = (estado.plausibles || []).map(function (c) {
      return { abbr: c.abbr, dentro: c.dentro,
               texto: L.opcion_lugar(L.octantes[c.octante] || L.octantes.aqui, c.separacion_grados) };
    });
    var cuenta = {};
    lista.forEach(function (o) { cuenta[o.texto] = (cuenta[o.texto] || 0) + 1; });
    lista.forEach(function (o) {
      if (cuenta[o.texto] > 1) o.texto += ' · ' + L.n_estrellas(o.dentro);
    });
    return lista;
  }
  function elegirPunto(id) {
    var p = puntoPorId(estado.capa, id);
    if (!p) return;
    estado.plausiblesPunto = null;
    estado.localizada = { punto: p, capa: estado.capa };
    estado.marca = null;
    estado.mensaje = { tipo: 'punto_localizado', id: id, capa: estado.capa };
    pintarMensaje(); pintar();
    asegurarVisible(el['btn-revelar']);
    el['btn-revelar'].focus();
    anunciar(textoMensaje());
  }
  function elegirAmbigua(abbr) {
    var r = estado.ultimoExamen;
    if (!r) return;
    var d = r.detalle.filter(function (x) { return x.abbr === abbr; })[0];
    if (!d) return;
    estado.plausibles = null;
    localizar(abbr, d.puntos_dentro, 'boton');
  }

  /* ------------------------------------------------------------ panel --- */
  function asegurarVisible(nodo) {
    if (!nodo || nodo.hidden) return;
    var r = nodo.getBoundingClientRect();
    var alto = g.innerHeight || document.documentElement.clientHeight;
    if (r.top >= 0 && r.bottom <= alto) return;
    var falta = r.bottom - alto + 8;
    if (falta > 0) g.scrollBy(0, falta); else g.scrollBy(0, r.top - 8);
  }
  function boton(txt, fn, principal) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'ig-btn ig-pequeno' + (principal ? ' ig-primary' : '');
    b.textContent = txt;
    b.addEventListener('click', fn);
    return b;
  }
  function parrafo(txt, cls) {
    var p = document.createElement('p');
    if (cls) p.className = cls;
    p.textContent = txt; return p;
  }
  function h3(txt) { var h = document.createElement('h3'); h.textContent = txt; return h; }
  function valor(v) { return (v && typeof v === 'object' && 'motivo' in v) ? null : v; }
  function texto(v, L) { var x = valor(v); return (x === null || x === undefined || x === '') ? L.sin_dato : x; }
  /* R04.5 · texto que viene del catálogo en español. En inglés se busca en la
     tabla; si no está, se devuelve el español y el banco de idiomas lo caza. */
  function dato(v, L) {
    var x = valor(v);
    if (x === null || x === undefined || x === '') return L.sin_dato;
    if (estado.idioma === 'es') return x;
    var T = g.IG_COPIA && g.IG_COPIA.datos_en;
    return (T && T[x]) || x;
  }
  /* R04.5 · «entera», «parte», «no», «siempre» son códigos del catálogo. */
  function visibilidad(v, L) {
    var x = valor(v);
    if (x === null || x === undefined || x === '') return L.sin_dato;
    return (L.vis_valores && L.vis_valores[x]) || x;
  }
  function filas(pares) {
    var dl = document.createElement('dl');
    dl.className = 'ig-datos';
    pares.forEach(function (p) {
      var dt = document.createElement('dt'); dt.textContent = p[0];
      var dd = document.createElement('dd'); dd.textContent = p[1];
      dl.appendChild(dt); dl.appendChild(dd);
    });
    return dl;
  }
  /* C3D-08. En pantalla ancha la ficha se acopla al lado OPUESTO a lo que se
     acaba de observar, para no taparlo. En pantalla estrecha el cielo se queda
     arriba y la ficha debajo (lo decide el CSS). La orientación no cambia:
     abrir o cerrar la ficha no mueve la cámara. */
  function ladoOpuestoAlHallazgo(abbr) {
    if (!abbr || !cielo || !estado.camara) return 'derecha';
    var k = porAbbr(abbr);
    if (!k) return 'derecha';
    var m = medir();
    var centro = estado.localizada && estado.localizada.abbr === abbr && estado.localizada.puntos.length
      ? estado.localizada.puntos : null;
    var v = k.etiqueta;
    if (centro) {
      var s = { x: 0, y: 0, z: 0 };
      centro.forEach(function (q) { s.x += q.v.x; s.y += q.v.y; s.z += q.v.z; });
      v = E.unitario(s);
    }
    var p = E.aPantalla(v, estado.camara, m.W, m.H);
    if (!p.delante) return 'derecha';
    return p.x > m.W / 2 ? 'izquierda' : 'derecha';
  }
  function abrirPanel(tipo, abbr, origen) {
    if (tipo !== 'ficha') tokenFicha++;
    if (origen) ultimoFoco = origen;
    estado.panel = tipo; estado.panelAbbr = abbr || estado.panelAbbr;
    if (tipo !== 'ficha') estado.seccion = null;
    var wrap = document.querySelector('.ig-escenario-wrap');
    /* El lado se decide al abrir y se conserva mientras la ficha está abierta:
       que el cielo se mueva por detrás no debe hacerla saltar de sitio. */
    estado.ladoPanel = (tipo === 'ficha' || tipo === 'estrella')
      ? ladoOpuestoAlHallazgo(estado.panelAbbr) : 'derecha';
    construirPanel();
    el.panel.hidden = false;
    wrap.classList.add('con-panel');
    wrap.classList.toggle('panel-izquierda', estado.ladoPanel === 'izquierda');
    redimensionar();
    el.panel.focus({ preventScroll: true });
  }
  function cerrarPanel(silencioso) {
    if (!estado.panel) { return; }
    tokenFicha++;
    estado.panel = null; estado.panelAbbr = null; estado.seccion = null; estado.estrellaSel = null;
    el.panel.hidden = true;
    var wrap0 = document.querySelector('.ig-escenario-wrap');
    wrap0.classList.remove('con-panel');
    wrap0.classList.remove('panel-izquierda');
    estado.ladoPanel = 'derecha';
    redimensionar();
    if (silencioso) return;
    var vivo = ultimoFoco && document.contains(ultimoFoco) && !ultimoFoco.hidden && ultimoFoco.offsetParent !== null;
    enfocar(vivo ? ultimoFoco : el.escenario);
  }
  function abrirFicha(abbr, seccion) {
    estado.seccion = seccion || null;
    var mio = ++tokenFicha, dePantalla = estado.pantalla;
    var vigente = function () { return mio === tokenFicha && estado.pantalla === dePantalla; };
    if (g.IG_FICHA && g.IG_FICHA[abbr]) { abrirPanel('ficha', abbr, el['btn-saber-mas']); return; }
    var s = document.createElement('script');
    s.src = 'datos/fichas/' + abbr + '.js';
    s.onload = function () { if (vigente()) abrirPanel('ficha', abbr, el['btn-saber-mas']); };
    s.onerror = function () {
      if (g.IG_ESCENA_ERROR) g.IG_ESCENA_ERROR('RECURSO', 'card script failed to load', { archivo: s.src });
      if (vigente()) mostrarAviso(t().aviso_recurso);
    };
    document.head.appendChild(s);
  }
  /* Cuaderno de hallazgos: lo encontrado y DÓNDE se encontró. Volver a un
     hallazgo devuelve la misma orientación y el mismo acercamiento que tenía
     cuando se encontró; no re-centra ni reencuadra nada por su cuenta. */
  function volverAlLugar(abbr) {
    var l = estado.lugares[abbr];
    if (!l) return;
    cerrarPanel(true);
    estado.activa = abbr;
    estado.localizada = null; estado.marca = null;
    estado.mensaje = { tipo: 'ya', abbr: abbr };
    /* Volver a mirar algo ya encontrado no es acabar de encontrarlo: arriba
       vuelve la pista de lo que falta, no el contexto del hallazgo anterior. */
    estado.enContextoHallazgo = false;
    pintarObjetivo();
    pintarMensaje();
    irA(E.ajustarCamara({ ra: l.ra, dec: l.dec, fov: l.fov }));
    anunciar(t().vuelto_al_lugar(nombreDe(abbr)));
    enfocar(el.escenario);
  }
  function abrirCuaderno() {
    if (estado.panel === 'cuaderno') { cerrarPanel(); return; }
    abrirPanel('cuaderno', null, el['btn-cuaderno']);
  }
  /* Ficha de una lluvia: cuándo, desde dónde y de qué viene. Los meteoros que
     se dibujan en la escena son representación; esto son los datos. */
  function abrirFichaPunto(capa, id) {
    var L = t(), es = estado.idioma === 'es';
    var p = puntoPorId(capa, id);
    if (!p) return;
    estado.panel = 'punto'; estado.panelPunto = p; estado.panelCapa = capa;
    estado.panelAbbr = p.constelacion || null;
    estado.ladoPanel = 'derecha';
    construirPanel();
    el.panel.hidden = false;
    var wrap = document.querySelector('.ig-escenario-wrap');
    wrap.classList.add('con-panel');
    wrap.classList.remove('panel-izquierda');
    redimensionar();
    el.panel.focus({ preventScroll: true });
  }

  function abrirEstrella(e) { estado.estrellaSel = e; abrirPanel('estrella', estado.panelAbbr, null); pintar(); }

  function construirPanel() {
    var L = t(), cuerpo = el['panel-cuerpo'];
    cuerpo.textContent = '';
    el['btn-cerrar-panel'].textContent = L.cerrar;
    var acc = document.createElement('div');
    acc.className = 'ig-acciones';

    if (estado.panel === 'punto') {
      var p = estado.panelPunto, es = estado.idioma === 'es';
      if (estado.panelCapa === 'radiantes') {
        var l = p.datos;
        el['panel-titulo'].textContent = es ? l.nombre_es : l.nombre_en;
        cuerpo.appendChild(parrafo(L.lluvia_cuando(es ? l.actividad.inicio_es : l.actividad.inicio_en,
          es ? l.actividad.fin_es : l.actividad.fin_en, es ? l.actividad.maximo_es : l.actividad.maximo_en)));
        cuerpo.appendChild(filas([
          [L.lluvia_radiante_en, l.constelacion_del_radiante ? nombreDe(l.constelacion_del_radiante) : L.sin_dato],
          [L.lluvia_zhr, l.zhr === null || l.zhr === undefined ? L.lluvia_zhr_variable : String(l.zhr)],
          [L.lluvia_velocidad, l.velocidad_kms ? l.velocidad_kms + ' km/s' : L.sin_dato],
          [L.lluvia_cuerpo, (es ? l.cuerpo_origen : (l.cuerpo_origen_en || l.cuerpo_origen)) || L.lluvia_cuerpo_desconocido]
        ]));
        cuerpo.appendChild(parrafo(es ? g.IG_METEOROS.nota_radiante
          : (g.IG_METEOROS.nota_radiante_en || g.IG_METEOROS.nota_radiante), 'ig-nota'));
        cuerpo.appendChild(parrafo(es ? g.IG_METEOROS.nota_zhr
          : (g.IG_METEOROS.nota_zhr_en || g.IG_METEOROS.nota_zhr), 'ig-nota'));
        cuerpo.appendChild(parrafo(L.lluvia_fuente(g.IG_METEOROS.fuente.organismo,
          g.IG_METEOROS.fuente.consultado), 'ig-nota'));
      } else {
        var a = p.datos;
        el['panel-titulo'].textContent = a.nombre_iau || a.nombre;
        cuerpo.appendChild(parrafo(L.anfitriona_resumen(a.n_planetas,
          a.constelacion ? nombreDe(a.constelacion) : null, a.magnitud_v)));
        cuerpo.appendChild(filas([
          [L.exo_distancia, a.distancia_pc ? Math.round(a.distancia_pc * 3.26156) + ' ' + L.anios_luz : L.sin_dato],
          [L.col_tipo, a.tipo_espectral || L.sin_dato],
          [L.exo_temperatura, a.temperatura_k ? Math.round(a.temperatura_k) + ' K' : L.sin_dato]
        ]));
        var h3p = document.createElement('h3');
        h3p.textContent = L.exo_sus_planetas(a.n_planetas);
        cuerpo.appendChild(h3p);
        a.planetas.forEach(function (q) {
          var fila = document.createElement('div');
          fila.className = 'ig-cuaderno-fila';
          var h = document.createElement('h4');
          h.className = 'ig-cuaderno-nombre';
          h.textContent = q.nombre_propio ? (q.nombre_propio + ' · ' + q.nombre) : q.nombre;
          fila.appendChild(h);
          var cl = g.IG_EXO.clases[q.clase];
          fila.appendChild(parrafo(L.exo_clase(es ? cl.es : cl.en), 'ig-nota'));
          fila.appendChild(filas([
            [L.exo_radio, q.radio_tierras ? L.exo_veces_tierra(q.radio_tierras) : L.sin_dato],
            [L.exo_periodo, q.periodo_dias ? L.exo_dias(Math.round(q.periodo_dias * 10) / 10) : L.sin_dato],
            [L.exo_metodo, q.metodo || L.sin_dato],
            [L.exo_anio, q.anio || L.sin_dato]
          ]));
          cuerpo.appendChild(fila);
        });
        cuerpo.appendChild(parrafo(g.IG_EXO.regla_representacion, 'ig-nota'));
      }
      acc.appendChild(boton(L.seguir_explorando, function () { cerrarPanel(); }, true));

    } else if (estado.panel === 'cuaderno') {
      var via = recorrido();
      var hechas = via.filter(function (a) { return estado.descubiertas[a]; });
      /* También lo encontrado fuera del recorrido sugerido. */
      Object.keys(estado.descubiertas).forEach(function (a) {
        if (via.indexOf(a) < 0) hechas.push(a);
      });
      el['panel-titulo'].textContent = L.cuaderno;
      var totalTodo = hechas.length +
        ['radiantes', 'exoplanetas', 'solar', 'eclipses'].reduce(function (s, b) {
          return s + Object.keys(estado.hallazgos[b] || {}).length; }, 0);
      cuerpo.appendChild(parrafo(L.cuaderno_progreso(hechas.length, via.length), 'ig-nota'));
      if (!totalTodo) cuerpo.appendChild(parrafo(L.cuaderno_vacio, 'ig-nota'));
      if (hechas.length) {
        var hC = document.createElement('h3');
        hC.textContent = L.capa_constelaciones;
        cuerpo.appendChild(hC);
      }
      hechas.forEach(function (a) {
        var fila = document.createElement('div');
        fila.className = 'ig-cuaderno-fila';
        var h = document.createElement('h4');
        h.className = 'ig-cuaderno-nombre'; h.textContent = nombreDe(a);
        fila.appendChild(h);
        var l = estado.lugares[a];
        fila.appendChild(parrafo(l
          ? L.encontrado_en((Math.round(l.ra * 100) / 100).toFixed(2), Math.round(l.dec), Math.round(l.fov))
          : L.sin_lugar, 'ig-nota'));
        var acc2 = document.createElement('div');
        acc2.className = 'ig-acciones';
        if (l) acc2.appendChild(boton(L.volver_al_lugar, function () { volverAlLugar(a); }));
        acc2.appendChild(boton(L.saber_mas, function () { abrirFicha(a, null); }));
        fila.appendChild(acc2);
        cuerpo.appendChild(fila);
      });

      /* Lo de las demás capas y los demás bloques, en el MISMO cuaderno. */
      [['radiantes', L.capa_radiantes], ['exoplanetas', L.capa_exoplanetas]].forEach(function (par) {
        var ids = Object.keys(estado.hallazgos[par[0]] || {});
        if (!ids.length) return;
        var h = document.createElement('h3');
        h.textContent = par[1];
        cuerpo.appendChild(h);
        ids.forEach(function (id) {
          var fila = document.createElement('div');
          fila.className = 'ig-cuaderno-fila';
          var hh = document.createElement('h4');
          hh.className = 'ig-cuaderno-nombre';
          hh.textContent = nombreDePunto(par[0], id);
          fila.appendChild(hh);
          var l2 = estado.lugares[par[0] + ':' + id];
          fila.appendChild(parrafo(l2
            ? L.encontrado_en((Math.round(l2.ra * 100) / 100).toFixed(2), Math.round(l2.dec), Math.round(l2.fov))
            : L.sin_lugar, 'ig-nota'));
          var acc3 = document.createElement('div');
          acc3.className = 'ig-acciones';
          if (l2) acc3.appendChild(boton(L.volver_al_lugar, function () {
            cerrarPanel(true);
            estado.capa = par[0];
            el['sel-capa'].value = par[0];
            el['sel-ruta'].disabled = true;
            estado.mensaje = { tipo: 'punto_ya', id: id, capa: par[0] };
            pintarMensaje();
            irA(E.ajustarCamara({ ra: l2.ra, dec: l2.dec, fov: l2.fov }));
            anunciar(t().vuelto_al_lugar(nombreDePunto(par[0], id)));
            enfocar(el.escenario);
          }));
          acc3.appendChild(boton(L.saber_mas, function () { cerrarPanel(true); abrirFichaPunto(par[0], id); }));
          fila.appendChild(acc3);
          cuerpo.appendChild(fila);
        });
      });
      bloques.forEach(function (b) {
        var ids = Object.keys(estado.hallazgos[b.id] || {});
        if (!ids.length) return;
        var h = document.createElement('h3');
        h.textContent = L[b.clave_nombre];
        cuerpo.appendChild(h);
        var pp = document.createElement('p');
        pp.className = 'ig-nota';
        pp.textContent = L.cuaderno_en_bloque(ids.length);
        cuerpo.appendChild(pp);
        var acc4 = document.createElement('div');
        acc4.className = 'ig-acciones';
        acc4.appendChild(boton(L.cuaderno_ir_al_bloque(L[b.clave_nombre]), function () {
          cerrarPanel(true); mostrarPantalla(b.id);
        }));
        cuerpo.appendChild(acc4);
      });
      acc.appendChild(boton(L.cerrar, function () { cerrarPanel(); }, true));

    } else if (estado.panel === 'fuentes') {
      el['panel-titulo'].textContent = L.fuentes;
      var ul = document.createElement('ul');
      Object.keys(cielo.meta.fuentes).forEach(function (k) {
        var li = document.createElement('li'); li.textContent = dato(cielo.meta.fuentes[k], L); ul.appendChild(li);
      });
      cuerpo.appendChild(ul);
      cuerpo.appendChild(parrafo(L.cielo_nota, 'ig-nota'));
      cuerpo.appendChild(parrafo(L.cielo_ejes, 'ig-nota'));
      acc.appendChild(boton(L.cerrar, function () { cerrarPanel(); }, true));

    } else if (estado.panel === 'estrella') {
      var e = estado.estrellaSel, d = e && e.datos;
      el['panel-titulo'].textContent = (d && (d.n || d.d)) || L.estrella;
      if (!d) cuerpo.appendChild(parrafo(L.estrella_sin_datos, 'ig-nota'));
      else cuerpo.appendChild(filas([
        [L.col_designacion, d.d || L.sin_dato], [L.col_nombre, d.n || L.sin_dato],
        [L.col_magnitud, String(e.mag)],
        [L.col_distancia, d.ly ? (d.ly + ' ' + L.anios_luz) : L.sin_dato],
        [L.col_tipo, d.sp || L.sin_dato]]));
      acc.appendChild(boton(L.seguir_explorando, function () { cerrarPanel(); }, true));

    } else if (estado.panel === 'ficha') {
      var f = g.IG_FICHA[estado.panelAbbr];
      el['panel-titulo'].textContent = estado.idioma === 'es' ? f.nombre_es : f.nombre_en;
      cuerpo.appendChild(parrafo(f.denominacion_canonica + ' · ' + f.genitivo, 'ig-nota'));
      if (!estado.seccion) {
        var k = porAbbr(estado.panelAbbr);
        if (k.especial) cuerpo.appendChild(parrafo(estado.idioma === 'es'
          ? k.especial.nota : (k.especial.nota_en || k.especial.nota)));
        var idea = estado.idioma === 'es' ? valor(f.descriptor_es) : valor(f.descriptor_en);
        if (!idea) idea = estado.idioma === 'es' ? valor(f.significado_es) : valor(f.significado_en);
        if (idea) cuerpo.appendChild(parrafo(L.idea_breve(idea)));
        if (k.relacion) cuerpo.appendChild(parrafo((estado.idioma === 'es'
          ? k.relacion.nota : (k.relacion.nota_en || k.relacion.nota)) + ' ' +
          '(' + k.relacion.separacion_grados + '°, ' + L.desviacion + ' ' + k.relacion.desviacion_de_la_linea_del_cinturon_grados + '°)', 'ig-nota'));
        var detalleVista = document.createElement('details');
        var resumenVista = document.createElement('summary');
        resumenVista.textContent = L.datos_de_esta_vista;
        detalleVista.appendChild(resumenVista);
        detalleVista.appendChild(filas([
          [estado.idioma === 'es' ? 'Ascensión recta' : 'Right ascension', (Math.round(estado.camara.ra * 100) / 100).toFixed(2) + ' h'],
          [estado.idioma === 'es' ? 'Declinación' : 'Declination', Math.round(estado.camara.dec) + '°'],
          [estado.idioma === 'es' ? 'Zona examinada' : 'Examined area', Math.round(E.aperturaGrados()) + '°']
        ]));
        cuerpo.appendChild(detalleVista);
        cuerpo.appendChild(h3(L.estrellas_relevantes));
        cuerpo.appendChild(filas(f.estrellas_principales.slice(0, 3).map(function (s) {
          var n = texto(s.nombre_propio, L);
          return [n === L.sin_dato ? texto(s.designacion, L) : n, L.magnitud_valor(s.magnitud_aparente)];
        })));
        cuerpo.appendChild(h3(L.mas_detalle));
        [['reconocer', L.sec_reconocer], ['estrellas', L.sec_estrellas], ['region', L.sec_region],
         ['visibilidad', L.sec_visibilidad], ['material', L.sec_material], ['fuentes', L.sec_fuentes]]
          .forEach(function (s) { acc.appendChild(boton(s[1], function () { abrirFicha(estado.panelAbbr, s[0]); })); });
        acc.appendChild(boton(L.seguir_explorando, function () { cerrarPanel(); volverAExplorar(); }, true));
      } else {
        cuerpo.appendChild(seccion(f, estado.seccion, L));
        acc.appendChild(boton(L.volver_al_resumen, function () { abrirFicha(estado.panelAbbr, null); }));
        acc.appendChild(boton(L.seguir_explorando, function () { cerrarPanel(); volverAExplorar(); }, true));
      }
    }
    cuerpo.appendChild(acc);
  }
  function seccion(f, sec, L) {
    var box = document.createElement('div');
    if (sec === 'reconocer') {
      box.appendChild(h3(L.sec_reconocer));
      box.appendChild(parrafo(f.como_reconocerlo[estado.idioma]));
      box.appendChild(parrafo(L.derivacion_breve, 'ig-nota'));
    } else if (sec === 'estrellas') {
      box.appendChild(h3(L.sec_estrellas));
      f.estrellas_principales.slice(0, 10).forEach(function (s) {
        var n = texto(s.nombre_propio, L);
        var h = document.createElement('p');
        h.className = 'ig-estrella-nombre';
        h.textContent = n === L.sin_dato ? texto(s.designacion, L) : n;
        box.appendChild(h);
        box.appendChild(filas([
          [L.col_designacion, texto(s.designacion, L)],
          [L.col_magnitud, L.magnitud_valor(s.magnitud_aparente)],
          [L.col_distancia, valor(s.distancia_anios_luz) === null ? L.sin_dato : valor(s.distancia_anios_luz) + ' ' + L.anios_luz],
          [L.col_tipo, texto(s.tipo_espectral, L)]]));
      });
      box.appendChild(parrafo(dato(f.fuentes.estrellas, L), 'ig-nota'));
    } else if (sec === 'region') {
      box.appendChild(h3(L.sec_region));
      box.appendChild(parrafo(estado.idioma === 'es' ? f.dibujo_de_lineas.nota_es : f.dibujo_de_lineas.nota_en));
      box.appendChild(parrafo(estado.idioma === 'es' ? f.region_oficial.nota_es : f.region_oficial.nota_en));
      box.appendChild(filas([[L.r_area, f.region_oficial.area_grados_cuadrados + ' ' + L.grados_cuadrados]]));
    } else if (sec === 'visibilidad') {
      box.appendChild(h3(L.sec_visibilidad));
      var mv = valor(f.visibilidad_documentada.mejor_mes);
      box.appendChild(filas([
        [L.r_mes, mv ? (estado.idioma === 'es' ? mv.es : mv.en) : L.sin_dato],
        [L.r_peninsula, visibilidad(f.visibilidad_documentada.desde_la_peninsula, L)],
        [L.r_canarias, visibilidad(f.visibilidad_documentada.desde_canarias, L)]]));
      box.appendChild(parrafo(L.vis_nota, 'ig-nota'));
    } else if (sec === 'material') {
      box.appendChild(h3(L.sec_material));
      var img = document.createElement('img');
      img.alt = estado.idioma === 'es' ? f.material_visual.alt_es : f.material_visual.alt_en;
      img.loading = 'lazy';
      img.onerror = function () {
        if (g.IG_ESCENA_ERROR) g.IG_ESCENA_ERROR('RECURSO', 'card image failed to load', { archivo: img.src });
        img.remove(); box.appendChild(parrafo(t().aviso_recurso, 'ig-nota'));
      };
      img.src = f.material_visual.svg;
      box.appendChild(img);
      box.appendChild(parrafo(estado.idioma === 'es' ? f.material_visual.pie_es : f.material_visual.pie_en, 'ig-nota'));
    } else if (sec === 'fuentes') {
      box.appendChild(h3(L.sec_fuentes));
      var ul = document.createElement('ul');
      [f.fuentes.estrellas, f.fuentes.nombres, f.fuentes.constelaciones,
       f.fuentes.figura_r03, f.fuentes.region_oficial, f.fuentes.master_visual].forEach(function (x) {
        if (!x) return;
        var li = document.createElement('li'); li.textContent = dato(x, L); ul.appendChild(li);
      });
      box.appendChild(ul);
    }
    return box;
  }

  /* ------------------------------------------------------ descripción --- */
  var SECT = ['e', 'se', 's', 'so', 'o', 'no', 'n', 'ne'];
  function actualizarDescripcion(anunciarla) {
    if (!cielo || !estado.camara) return;
    var m = medir(), L = t();
    var base = E.baseCamara(estado.camara);
    var punto = estado.ultimoExamen ? estado.ultimoExamen.punto : E.centroVista(m.W, m.H);
    var dir = E.dePantalla(punto, estado.camara, m.W, m.H, base);
    var zonas = zonasOcluidas();
    var enZona = [], enVista = [];
    cielo.estrellas.forEach(function (e) {
      var s = E.aPantalla(e.v, estado.camara, m.W, m.H, base);
      if (!E.esVisible(s, m.W, m.H, zonas)) return;
      enVista.push({ e: e, x: s.x, y: s.y });
      if (E.enEvidencia(dir, e.v)) enZona.push({ e: e, x: s.x, y: s.y });
    });
    var brillantes = enZona.filter(function (p) { return p.e.mag <= CFG.UMBRAL_BRILLANTE; });
    var partes = [enZona.length ? L.desc_puntos(enZona.length) : L.desc_vacia];
    if (brillantes.length) partes.push(L.desc_brillantes(brillantes.length));
    var r = E.examinar(cielo, estado.camara, m.W, m.H, zonas, punto, {});
    if (r.coincide) partes.push(L.desc_forma(r.mejor.dentro));
    el['descripcion-region'].textContent = partes.join(' ');

    var cuenta = {};
    enVista.forEach(function (p) {
      if (p.e.mag > CFG.UMBRAL_BRILLANTE) return;
      if (E.enEvidencia(dir, p.e.v)) return;
      var i = ((Math.round(Math.atan2(p.y - punto.y, p.x - punto.x) / (Math.PI / 4)) % 8) + 8) % 8;
      cuenta[SECT[i]] = (cuenta[SECT[i]] || 0) + 1;
    });
    var mejor = null;
    Object.keys(cuenta).forEach(function (k) { if (!mejor || cuenta[k] > cuenta[mejor]) mejor = k; });
    el['descripcion-entorno'].textContent =
      ((mejor && cuenta[mejor] >= 2) ? L.desc_fuera(L.dir[mejor]) : L.desc_fuera_nada) +
      ' ' + L.desc_apertura(r.apertura_grados);
    if (anunciarla) anunciar(el['descripcion-region'].textContent);
  }
  function anunciar(txt) {
    if (tAnuncio) clearTimeout(tAnuncio);
    tAnuncio = setTimeout(function () {
      el.anuncio.textContent = ''; el.anuncio.textContent = txt; tAnuncio = null;
    }, 320);
  }
  function mostrarAviso(txt) { el.aviso.textContent = txt; el.aviso.hidden = false; }
  /* Un aviso que se vuelve a escribir al cambiar de idioma, en vez de quedarse
     congelado en el idioma en el que saltó. */
  function avisar(clave) { avisoClave = clave; mostrarAviso(t()[clave]); }

  /* ----------------------------------------------------------- idioma --- */
  function aplicarIdioma() {
    var L = t();
    document.documentElement.lang = L.lang;
    document.title = L.titulo_documento;
    var n = document.querySelectorAll('[data-t]');
    for (var i = 0; i < n.length; i++) {
      var k = n[i].getAttribute('data-t');
      if (typeof L[k] === 'string') n[i].textContent = L[k];
    }
    var ma = document.querySelectorAll('[data-ta]');
    for (var j = 0; j < ma.length; j++) {
      var c = ma[j].getAttribute('data-ta');
      if (L[c]) ma[j].setAttribute('aria-label', L[c]);
    }
    if (avisoClave) mostrarAviso(L[avisoClave]);
    el['btn-volver-portada'].textContent = L.volver_a_la_portada;
    el['btn-capa'].textContent = L.mis_hallazgos;
    el['btn-cuaderno'].textContent = L.cuaderno;
    if (cielo) {
      var sel = el['sel-ruta'];
      sel.textContent = '';
      rutas().forEach(function (r) {
        var o = document.createElement('option');
        o.value = r.id;
        o.textContent = estado.idioma === 'es' ? r.nombre_es : r.nombre_en;
        sel.appendChild(o);
      });
      sel.value = estado.ruta;
      el['sel-ayuda'].value = String(estado.nivelAyuda);
      el['sel-capa'].value = estado.capa;
      el['sel-ruta'].disabled = capaDePuntos();
    }
    el.escenario.setAttribute('aria-label', L.titulo);
    if (estado.pantalla === 'portada') pintarPortada();
    if (estado.pantalla === 'escena' && estado.camara) {
      pintarObjetivo(); pintarMensaje(); pintarOrientacion(); pintar();
    }
    if (estado.panel) construirPanel();
    if (estado.describir) actualizarDescripcion(false);
    bloques.forEach(function (b) { if (b.aplicarIdioma) b.aplicarIdioma(); });
  }
  function actualizarPulsados() {
    document.querySelectorAll('[data-idioma]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-idioma') === estado.idioma));
    });
    el['sel-movimiento'].value = estado.movimiento;
    el['btn-describir'].setAttribute('aria-pressed', String(estado.describir));
    el['btn-capa'].setAttribute('aria-pressed', String(estado.capaHallazgos));
  }

  /* ---------------------------------------------------------- diálogo --- */
  function abrirDialogo(op) {
    dialogo = op;
    el['dialogo-titulo'].textContent = op.titulo;
    el['dialogo-texto'].textContent = op.texto;
    el['dialogo-cancelar'].textContent = op.cancelar;
    el['dialogo-confirmar'].textContent = op.confirmar;
    el.velo.hidden = false; el.dialogo.hidden = false;
    document.querySelector('.ig-app').setAttribute('inert', '');
    enfocar(el['dialogo-cancelar']);
  }
  function cerrarDialogo(ok) {
    if (!dialogo) return;
    var op = dialogo; dialogo = null;
    el.dialogo.hidden = true; el.velo.hidden = true;
    document.querySelector('.ig-app').removeAttribute('inert');
    enfocar(op.origen && document.contains(op.origen) ? op.origen : el.escenario);
    if (ok && op.alConfirmar) op.alConfirmar();
  }
  function borrarHallazgos() {
    estado.descubiertas = {}; estado.lugares = {}; estado.estados = {};
    estado.activa = null; estado.localizada = null; estado.mensaje = null;
    estado.enContextoHallazgo = false; estado.plausibles = null; estado.ultimoExamen = null;
    if (estado.panel === 'cuaderno') cerrarPanel(true);
    /* En sólo lectura se limpia esta sesión y NO se toca lo guardado: borrar lo
       de aquí no autoriza a destruir lo de una versión que no entendemos. */
    if (!soloLectura) { try { localStorage.removeItem('iris-green.cielo-3d.r02'); } catch (e) {} }
    if (estado.pantalla === 'escena') { elegirObjetivo(); pintarMensaje(); pintar(); }
    if (estado.pantalla === 'portada') pintarPortada();
    anunciar(soloLectura ? t().borrado_hecho_solo_lectura : t().borrado_hecho);
  }

  /* ---------------------------------------------------------- eventos --- */
  function enlazar() {
    el['btn-empezar'].addEventListener('click', function () { abrirEscena(false); });
    el['btn-continuar'].addEventListener('click', function () { abrirEscena(true); });
    el['btn-volver-portada'].addEventListener('click', function () {
      cancelarAnimacion(); estado.camaraGuardada = estado.camara; guardar();
      cerrarPanel(true); mostrarPantalla('portada');
    });
    el['btn-continuar-pista'].addEventListener('click', function () { volverAExplorar(); });
    el['btn-examinar'].addEventListener('click', function () {
      /* Con el ratón, este botón examina el centro pero NO convierte el centro
         en la metáfora: la marca aparece sólo si se está usando el teclado. */
      estado.tecladoActivo = (ultimaEntrada === 'teclado');
      examinar('boton');
    });
    el['btn-examinar'].addEventListener('focus', function () {
      if (focoProgramatico || ultimaEntrada !== 'teclado') return;
      estado.tecladoActivo = true; pintar();
    });
    el['btn-revelar'].addEventListener('click', revelar);
    el['btn-saber-mas'].addEventListener('click', function () {
      var m = estado.mensaje;
      if (!m) return;
      if (m.tipo === 'punto_revelado' || m.tipo === 'punto_ya') { abrirFichaPunto(m.capa, m.id); return; }
      if (m.abbr) abrirFicha(m.abbr);
    });
    el['btn-cerrar-panel'].addEventListener('click', function () { cerrarPanel(); });
    el['btn-capa'].addEventListener('click', function () {
      estado.capaHallazgos = !estado.capaHallazgos;
      actualizarPulsados(); pintar();
      anunciar(estado.capaHallazgos ? t().capa_encendida : t().capa_apagada);
    });
    el['btn-cuaderno'].addEventListener('click', abrirCuaderno);
    el['btn-cuaderno-inicio'].addEventListener('click', function () {
      abrirEscena(true); abrirCuaderno();
    });
    el['btn-seguir'].addEventListener('click', seguirDesdeAqui);
    el['sel-capa'].addEventListener('change', function () {
      estado.capa = el['sel-capa'].value;
      estado.localizada = null; estado.plausibles = null; estado.plausiblesPunto = null;
      estado.mensaje = null; estado.activa = null; estado.enContextoHallazgo = false;
      el['sel-ruta'].disabled = capaDePuntos();
      elegirObjetivo(); pintarMensaje(); pintar(); guardar();
      anunciar(t().capa_cambiada(t()['capa_' + estado.capa]));
    });
    el['sel-ruta'].addEventListener('change', function () {
      estado.ruta = el['sel-ruta'].value;
      var r = rutaActual();
      estado.enContextoHallazgo = false;
      elegirObjetivo(); guardar();
      anunciar(t().ruta_cambiada(estado.idioma === 'es' ? r.nombre_es : r.nombre_en));
    });
    el['sel-ayuda'].addEventListener('change', function () {
      estado.nivelAyuda = parseInt(el['sel-ayuda'].value, 10) || 3;
      pintarObjetivo(); guardar();
      anunciar(t().nivel_cambiado(t()['nivel_' + estado.nivelAyuda]));
    });
    el['btn-describir'].addEventListener('click', function () {
      estado.describir = !estado.describir;
      el.descripcion.hidden = !estado.describir;
      actualizarPulsados();
      if (estado.describir) actualizarDescripcion(true);
    });
    el['btn-fuentes'].addEventListener('click', function () {
      if (estado.pantalla === 'escena') {
        if (estado.panel === 'fuentes') cerrarPanel(); else abrirPanel('fuentes', null, el['btn-fuentes']);
        return;
      }
      var caja = el['fuentes-fuera'];
      if (!caja.hidden) { caja.hidden = true; return; }
      caja.textContent = '';
      var h = document.createElement('h2');
      h.className = 'ig-h2'; h.textContent = t().fuentes;
      caja.appendChild(h);
      var ul = document.createElement('ul');
      Object.keys(cielo.meta.fuentes).forEach(function (k) {
        var li = document.createElement('li'); li.textContent = dato(cielo.meta.fuentes[k], t()); ul.appendChild(li);
      });
      caja.appendChild(ul);
      caja.appendChild(parrafo(t().cielo_nota, 'ig-nota'));
      caja.hidden = false; caja.setAttribute('tabindex', '-1'); caja.focus();
    });
    el['btn-borrar'].addEventListener('click', function () {
      var L = t();
      abrirDialogo({ titulo: L.borrar_hallazgos, texto: L.borrar_aviso,
                     confirmar: L.borrar_confirmar, cancelar: L.cancelar,
                     origen: el['btn-borrar'], alConfirmar: borrarHallazgos });
    });
    el['dialogo-cancelar'].addEventListener('click', function () { cerrarDialogo(false); });
    el['dialogo-confirmar'].addEventListener('click', function () { cerrarDialogo(true); });
    el.velo.addEventListener('click', function () { cerrarDialogo(false); });
    document.addEventListener('keydown', function (ev) {
      if (!dialogo) return;
      if (ev.key === 'Escape') { cerrarDialogo(false); ev.preventDefault(); return; }
      if (ev.key !== 'Tab') return;
      var f = [el['dialogo-cancelar'], el['dialogo-confirmar']];
      var i = f.indexOf(document.activeElement);
      enfocar(f[ev.shiftKey ? (i <= 0 ? f.length - 1 : i - 1) : (i === f.length - 1 ? 0 : i + 1)]);
      ev.preventDefault();
    }, true);

    document.querySelectorAll('[data-idioma]').forEach(function (b) {
      b.addEventListener('click', function () {
        estado.idioma = b.getAttribute('data-idioma');
        actualizarPulsados(); aplicarIdioma();
      });
    });
    el['sel-movimiento'].addEventListener('change', function () {
      estado.movimiento = el['sel-movimiento'].value;
      estado.movimientoExplicito = true;
      congelarCamara(); pintar(); guardar();
      anunciar(t().movimiento_cambiado);
    });
    document.querySelectorAll('[data-orientar]').forEach(function (b) {
      b.addEventListener('click', function () {
        var d = b.getAttribute('data-orientar');
        orientar(d === 'izquierda' ? 1 : (d === 'derecha' ? -1 : 0),
                 d === 'arriba' ? 1 : (d === 'abajo' ? -1 : 0));
        anunciar(t().vista_movida);
      });
    });
    document.querySelectorAll('[data-zoom]').forEach(function (b) {
      b.addEventListener('click', function () {
        ampliar(b.getAttribute('data-zoom') === 'acercar' ? CFG.CAMPO_VISION.paso : 1 / CFG.CAMPO_VISION.paso);
      });
    });

    el.escenario.addEventListener('keydown', function (ev) {
      var ayudaR04 = document.getElementById('ayuda-flotante'); if (ayudaR04) ayudaR04.classList.add('ig-retirada');
      if (ev.target !== el.escenario || !cielo) return;
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      var k = ev.key, hecho = true;
      if (k === 'ArrowLeft') orientar(1, 0);
      else if (k === 'ArrowRight') orientar(-1, 0);
      else if (k === 'ArrowUp') orientar(0, 1);
      else if (k === 'ArrowDown') orientar(0, -1);
      else if (k === '+' || k === '=') ampliar(CFG.CAMPO_VISION.paso);
      else if (k === '-' || k === '_') ampliar(1 / CFG.CAMPO_VISION.paso);
      else if (k === 'Enter') examinar('escenario');
      else hecho = false;
      if (hecho) { estado.tecladoActivo = true; estado.ruedaArmada = true; pintar(); ev.preventDefault(); }
    });
    /* Una tecla real —cualquiera— declara que se está usando el teclado. */
    document.addEventListener('keydown', function (ev) {
      ultimaEntrada = 'teclado';
      if (ev.key === 'Escape' && estado.panel && !dialogo) { cerrarPanel(); ev.preventDefault(); }
    }, true);
    document.addEventListener('pointerdown', function () { ultimaEntrada = 'puntero'; }, true);
    el.escenario.addEventListener('focus', function () {
      estado.tecladoActivo = (!focoProgramatico && ultimaEntrada === 'teclado');
      if (!focoProgramatico) estado.ruedaArmada = true;
      pintar();
    });
    el.escenario.addEventListener('blur', function () {
      if (document.activeElement !== el['btn-examinar']) { estado.tecladoActivo = false; pintar(); }
    });

    /* ---- puntero: arrastrar orienta, pulsar selecciona ------------------ */
    function puntoEn(ev) {
      var c = el.lienzo.getBoundingClientRect();
      return { x: ev.clientX - c.left, y: ev.clientY - c.top };
    }
    function ids() { return Object.keys(punteros); }
    function n() { return ids().length; }
    function centroDedos() {
      var c = el.lienzo.getBoundingClientRect(), xs = 0, ys = 0;
      ids().forEach(function (i) { xs += punteros[i].x; ys += punteros[i].y; });
      return { x: xs / n() - c.left, y: ys / n() - c.top };
    }
    function distDedos() {
      var k = ids();
      if (k.length < 2) return 0;
      return Math.hypot(punteros[k[0]].x - punteros[k[1]].x, punteros[k[0]].y - punteros[k[1]].y);
    }

    el.lienzo.addEventListener('pointerdown', function (ev) {
      var ayudaR04 = document.getElementById('ayuda-flotante'); if (ayudaR04) ayudaR04.classList.add('ig-retirada');
      if (ev.button !== undefined && ev.button !== 0) return;
      estado.ruedaArmada = true;
      var m = medir();
      punteros[ev.pointerId] = { x: ev.clientX, y: ev.clientY,
        inicio: { x: ev.clientX, y: ev.clientY }, arrastrado: false,
        dir: E.dePantalla(puntoEn(ev), estado.camara, m.W, m.H) };
      if (n() >= 2) { gestoMulti = true; pinza = { dist: distDedos(), fov: estado.camara.fov }; }
      try { el.lienzo.setPointerCapture(ev.pointerId); } catch (e) {}
    });

    el.lienzo.addEventListener('pointermove', function (ev) {
      var p = punteros[ev.pointerId];
      if (!p || !cielo) return;
      p.x = ev.clientX; p.y = ev.clientY;
      var m = medir();
      if (n() >= 2 && pinza) {
        var d = distDedos();
        if (pinza.dist > 10) {
          var fov = pinza.fov * (pinza.dist / Math.max(1, d));
          var c = centroDedos();
          cancelarAnimacion();
          estado.camara = E.camaraAmpliada(estado.camara, m.W, m.H, fov, c);
          pintar();
        }
        return;
      }
      if (!p.arrastrado) {
        /* Tap o arrastre se deciden por DESPLAZAMIENTO, nunca por tiempo: una
           pulsación quieta sigue siendo una pulsación aunque dure. */
        if (Math.hypot(ev.clientX - p.inicio.x, ev.clientY - p.inicio.y) < CFG.UMBRAL_ARRASTRE) return;
        p.arrastrado = true;
        el.lienzo.classList.add('orientando');
      }
      cancelarAnimacion();
      estado.camara = E.ajustarCamara(E.camaraQueLleva(estado.camara, m.W, m.H, p.dir, puntoEn(ev)));
      pintar();
    });

    function soltar(ev, cancelado) {
      var p = punteros[ev.pointerId];
      if (!p) return;
      delete punteros[ev.pointerId];
      if (n() < 2) pinza = null;
      var m = medir();
      ids().forEach(function (i) {       /* el dedo que queda empieza de cero */
        punteros[i].inicio = { x: punteros[i].x, y: punteros[i].y };
        punteros[i].arrastrado = true;
        punteros[i].dir = E.dePantalla({ x: punteros[i].x - el.lienzo.getBoundingClientRect().left,
                                         y: punteros[i].y - el.lienzo.getBoundingClientRect().top },
                                       estado.camara, m.W, m.H);
      });
      if (n() === 0) {
        el.lienzo.classList.remove('orientando');
        var fueMulti = gestoMulti;
        gestoMulti = false;
        if (cancelado || p.arrastrado || fueMulti) { trasMovimiento(); return; }
        estado.tecladoActivo = false;
        examinar('puntero', puntoEn(ev));
      }
    }
    el.lienzo.addEventListener('pointerup', function (ev) { soltar(ev, false); });
    el.lienzo.addEventListener('pointercancel', function (ev) { soltar(ev, true); });

    el.lienzo.addEventListener('wheel', function (ev) {
      if (!cielo) return;
      if (CFG.RUEDA_REQUIERE_FOCO && (document.activeElement !== el.escenario || !estado.ruedaArmada)) return;
      ev.preventDefault();
      ampliar(ev.deltaY < 0 ? CFG.CAMPO_VISION.paso : 1 / CFG.CAMPO_VISION.paso, puntoEn(ev));
    }, { passive: false });

    g.addEventListener('resize', function () {
      if (tResize) clearTimeout(tResize);
      tResize = setTimeout(function () {
        tResize = null;
        redimensionar();
        if (!estado.panel) return;
        if (el.panel.contains(document.activeElement)) return;   /* no le quites el foco a nadie */
        var antes = document.activeElement;
        construirPanel();
        if (antes && document.contains(antes) && antes.offsetParent !== null) enfocar(antes);
      }, 120);
    });
    /* Al ocultar la pestaña no queda nada corriendo: no hay bucle continuo. */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { cancelarAnimacion(); guardar(); }
    });
    g.addEventListener('pagehide', function () { cancelarAnimacion(); guardar(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (cielo && estado.camara) pintar(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();

  /* Servicios que el armazón presta a los demás bloques. Una sola fuente para
     idioma, foco, avisos, guardado y cuaderno: por eso es un producto y no
     cinco micrositios. */
  g.IG_PRODUCTO = {
    t: t,
    estado: function () { return estado; },
    anunciar: anunciar,
    enfocar: enfocar,
    mostrarPantalla: mostrarPantalla,
    abrirDialogo: abrirDialogo,
    guardar: guardar,
    guardarDiferido: guardarDiferido,
    registrarBloque: registrarBloque,
    movimiento: function () { return CFG.MOVIMIENTO[estado.movimiento]; },
    soloLectura: function () { return soloLectura; },
    ultimaEntrada: function () { return ultimaEntrada; },
    /* Un hallazgo de cualquier bloque entra en el mismo cuaderno. */
    registrarHallazgo: function (bloque, id, lugar) {
      if (!estado.hallazgos[bloque]) estado.hallazgos[bloque] = {};
      estado.hallazgos[bloque][id] = lugar || true;
      guardar();
    },
    hallazgos: function (bloque) { return estado.hallazgos[bloque] || {}; },
    zonasOcluidas: zonasOcluidas
  };

  g.IG_DEBUG = {
    estado: estado, cielo: function () { return cielo; }, medir: medir,
    hayAnimacion: function () { return anim !== null; },
    punterosActivos: function () { return Object.keys(punteros).length; },
    punterosIds: function () { return Object.keys(punteros).map(Number); },
    ocluidas: zonasOcluidas,
    medidas: function () { return { cuadros: medidas.cuadros, ms: Math.round(medidas.ms),
                                    ms_por_cuadro: medidas.cuadros ? Math.round(medidas.ms / medidas.cuadros * 100) / 100 : 0 }; },
    reiniciarMedidas: function () { medidas = { cuadros: 0, ms: 0 }; },
    examinarEn: function (p, excluir) {
      var m = medir();
      return E.examinar(cielo, estado.camara, m.W, m.H, zonasOcluidas(), p, excluir || {});
    },
    pantallaDe: function (abbr, i) {
      var m = medir(), k = cielo.porAbbr[abbr];
      var v = (i === undefined) ? k.etiqueta : k.puntos[i].v;
      return E.aPantalla(v, estado.camara, m.W, m.H);
    },
    abrirEscena: abrirEscena, abrirFichaDePrueba: abrirFicha,
    recorrido: recorrido, pistaDe: textoPista, etiquetasPlausibles: etiquetasPlausibles,
    ladoPanel: function () { return estado.ladoPanel; },
    soloLectura: function () { return soloLectura; },
    camaraInicial: camaraInicial,
    ultimaEntrada: function () { return ultimaEntrada; },
    abrirCuaderno: abrirCuaderno, volverAlLugar: volverAlLugar,
    /* R04 · repintar la escena a petición. Sólo lo usa el banco de pruebas: la
       serie larga necesita mantener el cielo vivo durante diez minutos y, sin
       esto, habría que simular miles de pulsaciones. No cambia nada de lo que
       hace el producto; es la misma función que ya se llama al mover la cámara. */
    repintar: function () { if (estado.pantalla === 'escena') pintar(); }
  };
})(window);
