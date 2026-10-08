/* Cielo y Espacio · R03 · EL SISTEMA SOLAR.

   Un espacio que se mira desde fuera y se gira con la mano, no un carrusel de
   fichas. Mismo contrato que el cielo: EXPLORAR → LOCALIZAR → REVELAR.

   Qué es cada cosa, declarado:
     · los números de las fichas son los medidos y publicados      · REAL_DATA
     · las posiciones salen de los elementos orbitales publicados  · CALCULATION
     · los tamaños y las distancias en pantalla NO son a escala    · SIMULATION

   Si estuviera a escala, los planetas serían invisibles. Se dice, no se finge. */
(function (g) {
  'use strict';
  var P = null;                       /* servicios del producto, al registrarse */
  var CFG = g.IG_CONFIG;
  var D = g.IG_SOLAR;
  var el = {}, ctx = null, motor = null, anim = null;
  /* La vista ES la cámara: acimut, elevación, acercamiento y a quién rodea.
     objetivo = null es el sistema entero; un id es ese cuerpo. */
  var vista = { azimut: 0.6, elevacion: 0.62, escala: 1, objetivo: null };
  var estado = {
    localizado: null, revelado: null, activo: null, mensaje: null,
    centrado: null, tecladoActivo: false, panel: null, panelId: null
  };
  var punteros = {}, pinza = null, arrastrando = false;
  var medidas = { cuadros: 0, ms: 0 };

  var GRADO = Math.PI / 180;
  function t() { return P.t(); }
  function idioma() { return P.estado().idioma; }

  /* ------------------------------------------------- posiciones · CALCULATION
     Elementos keplerianos de la NASA/JPL (y del MPC para los enanos), resueltos
     para la fecha de hoy. No es una efeméride de precisión: sirve para entender
     dónde está cada cuerpo respecto a los demás. */
  function diasDesdeJ2000(fecha) { return (fecha.getTime() / 86400000) + 2440587.5 - 2451545.0; }
  function kepler(M, e) {
    var E = M + e * Math.sin(M), i;
    for (i = 0; i < 8; i++) {
      var d = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
      E -= d;
      if (Math.abs(d) < 1e-10) break;
    }
    return E;
  }
  function posicionJPL(c, T) {
    /* el = [a, da, e, de, I, dI, L, dL, wbar, dwbar, O, dO] por siglo juliano */
    var q = c.elementos;
    var a = q[0] + q[1] * T, e = q[2] + q[3] * T, I = (q[4] + q[5] * T) * GRADO;
    var L = (q[6] + q[7] * T) * GRADO, wb = (q[8] + q[9] * T) * GRADO, O = (q[10] + q[11] * T) * GRADO;
    var w = wb - O, M = L - wb;
    M = ((M + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
    var E = kepler(M, e);
    var xv = a * (Math.cos(E) - e), yv = a * Math.sqrt(1 - e * e) * Math.sin(E);
    var v = Math.atan2(yv, xv), r = Math.sqrt(xv * xv + yv * yv);
    var u = v + w;
    return { x: r * (Math.cos(O) * Math.cos(u) - Math.sin(O) * Math.sin(u) * Math.cos(I)),
             y: r * (Math.sin(O) * Math.cos(u) + Math.cos(O) * Math.sin(u) * Math.cos(I)),
             z: r * Math.sin(u) * Math.sin(I), r: r };
  }
  function posicionMPC(c, jd) {
    var q = c.orbita_mpc;
    var M = (q.M + q.n * (jd - q.epoca_jd)) * GRADO;
    M = ((M + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
    var e = q.e, E = kepler(M, e), a = q.a;
    var xv = a * (Math.cos(E) - e), yv = a * Math.sqrt(1 - e * e) * Math.sin(E);
    var v = Math.atan2(yv, xv), r = Math.sqrt(xv * xv + yv * yv);
    var I = q.i * GRADO, O = q.node * GRADO, u = v + q.peri * GRADO;
    return { x: r * (Math.cos(O) * Math.cos(u) - Math.sin(O) * Math.sin(u) * Math.cos(I)),
             y: r * (Math.sin(O) * Math.cos(u) + Math.cos(O) * Math.sin(u) * Math.cos(I)),
             z: r * Math.sin(u) * Math.sin(I), r: r };
  }
  function posiciones(fecha) {
    var T = diasDesdeJ2000(fecha) / 36525.0, jd = diasDesdeJ2000(fecha) + 2451545.0;
    var out = {};
    D.cuerpos.forEach(function (c) {
      if (c.id === 'sol') { out[c.id] = { x: 0, y: 0, z: 0, r: 0 }; return; }
      if (c.elementos) out[c.id] = posicionJPL(c, T);
      else if (c.orbita_mpc) out[c.id] = posicionMPC(c, jd);
      else out[c.id] = { x: 0, y: 0, z: 0, r: 0 };
    });
    return out;
  }

  /* --------------------------------------------- la escena 3D · SIMULATION
     Dos compresiones declaradas, las dos necesarias para que esto se pueda
     mirar: las distancias al Sol van por logaritmo —de 0,39 ua a 68 ua en la
     misma pantalla— y los radios por una potencia, para que Mercurio no sea un
     punto mientras Júpiter se sale. Ni una ni otra son a escala, y se dice.

     Lo que NO está comprimido ni simulado es la GEOMETRÍA. Cada cuerpo es una
     esfera de verdad en el mundo, con su radio, su eje inclinado por la
     oblicuidad publicada, su rotación de hoy y su textura envuelta sobre UV
     reales. La cámara mira ese mundo en perspectiva y orbita a su alrededor.
     No hay disco sombreado, ni sprite, ni esfera rasterizada pegada con
     drawImage: eso era R03 y es exactamente lo que había que quitar.

     Marco del mundo: x e y en el plano de la eclíptica, z al norte de la
     eclíptica. El eje de las esferas es +Z, así que una oblicuidad de 23,4°
     significa de verdad 23,4° sobre el plano. */
  var RADIO_SOL = 20;                   /* unidades de mundo, no píxeles */
  /* Campo estrecho y cámara lejos: la perspectiva sigue siendo perspectiva
     —los cuerpos de delante se ven mayores que los de detrás— pero sin que el
     de delante se coma la pantalla. */
  var FOV = 26 * (Math.PI / 180);
  var DIST_SISTEMA = 1150;
  var ELEV_MAX = 1.45;

  function radioMundo(c) {
    if (c.tipo === 'estrella') return RADIO_SOL;
    var d = (c.datos && c.datos.diametro) || 1000;
    return Math.max(2.4, Math.pow(d / 12756, 0.42) * 7.2);
  }
  /* Distancia comprimida: log(1 + r/r0), con r0 para que la órbita de Mercurio
     quede fuera del cuerpo del Sol y la de Eris siga cabiendo. */
  function distanciaMundo(r) {
    if (r <= 0) return 0;
    return 34 + Math.log(1 + r / 0.22) * 52;
  }
  function medir() {
    var r = el.escenario.getBoundingClientRect();
    return { W: Math.max(1, Math.round(r.width)), H: Math.max(1, Math.round(r.height)),
             dpr: Math.min(g.devicePixelRatio || 1, 2) };
  }
  /* La dirección al cuerpo se conserva entera —la posición angular sale de los
     elementos orbitales— y sólo se comprime el módulo. */
  function comprimir(p) {
    var r = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
    if (r <= 1e-9) return [0, 0, 0];
    var f = distanciaMundo(r) / r;
    return [p.x * f, p.y * f, p.z * f];
  }

  /* Fase de rotación REAL para hoy: W = W0 + Ẇ·d, el modelo IAU que trae el
     catálogo. No hay giro automático —el KEEP lo prohíbe—: el cuerpo enseña la
     cara que de verdad enseña hoy, quieta. Al cambiar de día cambia, y eso es
     lo que se mide en el oráculo de rotación. */
  function faseDeRotacion(c) {
    if (!c.rotacion || c.rotacion.length < 4) return 0;
    var d = diasDesdeJ2000(FECHA || new Date());
    return ((c.rotacion[2] + c.rotacion[3] * d) % 360) * GRADO;
  }

  /* Anillos: los que hay, como son. Saturno de 1,24 a 2,27 radios, anchos y
     claros; Júpiter, Urano y Neptuno estrechos y oscuros. No se le pone a todos
     el anillo de Saturno. La malla va de r0 a 2·r0 y el borde visible lo marca
     r1, así que un anillo estrecho se ve estrecho. */
  var ANILLOS = {
    saturno: { r0: 1.24, r1: 2.27, color: [0.886, 0.843, 0.722], alfa: 0.80 },
    jupiter: { r0: 1.40, r1: 1.71, color: [0.72, 0.70, 0.68], alfa: 0.18 },
    urano:   { r0: 1.64, r1: 2.00, color: [0.74, 0.80, 0.84], alfa: 0.26 },
    neptuno: { r0: 1.69, r1: 2.54, color: [0.70, 0.75, 0.82], alfa: 0.20 }
  };
  function anilloDe(c) {
    if (!(c.datos && c.datos.anillos)) return null;
    return ANILLOS[c.id] || { r0: 1.45, r1: 1.75, color: [0.74, 0.76, 0.80], alfa: 0.22 };
  }

  var POS = null, FECHA = null, ESC = null, ultimoDibujo = null;
  function lunasDe(id) {
    return D.lunas.filter(function (m) { return m.planeta === id; });
  }
  function verLunasDe(c) {
    if (!c.lunas_conocidas) return false;
    if (vista.objetivo === c.id || vista.escala >= 2.2) return true;
    /* y también si lo que se está rodeando es una luna suya: hay que
       construirla para poder ponerse a su lado */
    if (vista.objetivo && vista.objetivo.indexOf('luna:') === 0) {
      return lunasDe(c.id).some(function (m) { return 'luna:' + m.id === vista.objetivo; });
    }
    return false;
  }
  /* Las lunas son esferas de verdad también, en el plano del ecuador de su
     cuerpo, mirándolo de cara. Su distancia y su fase son representación
     (SIMULATION, declarado en los datos): el semieje real comprimido y un
     ángulo sacado del periodo, porque la fase absoluta no se conoce aquí. */
  function lunasEnEscena(c, centro, radio, incl) {
    var d0 = diasDesdeJ2000(FECHA), out = [];
    var ci = Math.cos(incl), si = Math.sin(incl);
    lunasDe(c.id).forEach(function (mm, i) {
      var rl = radio + 6 + Math.pow((mm.semieje_km || 100000) / 1000, 0.33) * 2.2 + i * 1.6;
      var faseR04 = g.IG_R04_FISICA && g.IG_R04_FISICA.faseOrbital ? g.IG_R04_FISICA.faseOrbital(mm.id, FECHA) : null;
      var a = faseR04 === null ? (mm.periodo_dias ? ((d0 / mm.periodo_dias) * Math.PI * 2 + i) : i * 1.1) : faseR04 * GRADO;
      if (faseR04 === null && mm.retrograda) a = -a;
      /* misma ley de radios que los planetas: una sola compresión declarada
         para todo el bloque, no una por tipo de cuerpo */
      var rm = Math.max(1.1, Math.pow(((mm.radio_km || 400) * 2) / 12756, 0.42) * 7.2);
      out.push({
        id: 'luna:' + mm.id,
        c: { id: 'luna:' + mm.id, tipo: 'luna', es: { nombre: mm.es }, en: { nombre: mm.en },
             textura: mm.textura, datos: { diametro: (mm.radio_km || 0) * 2 },
             _luna: mm, _de: c },
        centro: [centro[0] + Math.cos(a) * rl,
                 centro[1] + Math.sin(a) * rl * ci,
                 centro[2] + Math.sin(a) * rl * si],
        radio: rm, textura: mm.textura, emisor: false,
        inclinacion: incl, giro: a + Math.PI,     /* acoplada: misma cara al planeta */
        color: [0.58, 0.58, 0.60], anillo: null, luna: true, de: c.id
      });
    });
    return out;
  }

  /* Quién se queda al rodear: el cuerpo elegido y sus lunas; si lo elegido es
     una luna, ella y el cuerpo al que pertenece, para que se vea de quién es. */
  function soloElObjetivo(cuerpos) {
    var raiz = vista.objetivo;
    cuerpos.forEach(function (x) { if (x.id === raiz && x.luna) raiz = x.de; });
    return cuerpos.filter(function (x) {
      return x.id === raiz || x.de === raiz;
    });
  }
  function cuerpoDeEscena(id) {
    if (!ESC) return null;
    for (var i = 0; i < ESC.cuerpos.length; i++) if (ESC.cuerpos[i].id === id) return ESC.cuerpos[i];
    return null;
  }
  /* La cámara orbita de verdad: acimut alrededor del eje de la eclíptica,
     elevación sobre el plano y distancia al objetivo. El objetivo es el sistema
     entero o un cuerpo concreto; cuando es un cuerpo, moverse enseña otra parte
     de su superficie porque la cámara se ha movido alrededor del volumen. */
  function camaraDe(cuerpos, m) {
    var o = null;
    if (vista.objetivo) {
      for (var i = 0; i < cuerpos.length; i++) if (cuerpos[i].id === vista.objetivo) o = cuerpos[i];
    }
    var centro = o ? o.centro : [0, 0, 0];
    var dist = o ? Math.max(o.radio * 1.9, o.radio * 9.5 / vista.escala)
                 : DIST_SISTEMA / vista.escala;
    var ce = Math.cos(vista.elevacion), se = Math.sin(vista.elevacion);
    var ojo = [centro[0] + dist * ce * Math.cos(vista.azimut),
               centro[1] + dist * ce * Math.sin(vista.azimut),
               centro[2] + dist * se];
    return { ojo: ojo, centro: centro, arriba: [0, 0, 1], fov: FOV,
             cerca: Math.max(0.01, dist * 0.004), lejos: dist * 4 + 4000,
             distancia: dist, objetivo: vista.objetivo };
  }

  function construirEscena(m) {
    if (!POS) { FECHA = new Date(); POS = posiciones(FECHA); }
    var cuerpos = [], orbitas = [];
    D.cuerpos.forEach(function (c) {
      var p = POS[c.id], centro = comprimir(p);
      var r = radioMundo(c), d = c.datos || {};
      var incl = (d.oblicuidad || 0) * GRADO;
      cuerpos.push({ id: c.id, c: c, centro: centro, radio: r, textura: c.textura,
                     emisor: c.id === 'sol', inclinacion: incl, giro: faseDeRotacion(c),
                     color: c.id === 'sol' ? [0.965, 0.855, 0.541] : [0.482, 0.549, 0.651],
                     anillo: anilloDe(c), luna: false,
                     achatamiento: (g.IG_R04_FISICA && g.IG_R04_FISICA.achatamiento[c.id]) ? g.IG_R04_FISICA.achatamiento[c.id].f : 0 });
      var rr = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
      if (c.id !== 'sol' && rr > 0) orbitas.push({ radio: distanciaMundo(rr) });
      if (verLunasDe(c)) cuerpos = cuerpos.concat(lunasEnEscena(c, centro, r, incl));
    });
    var sol = null;
    cuerpos.forEach(function (x) { if (x.id === 'sol') sol = x; });
    var luz = sol ? sol.centro : [0, 0, 0];
    if (vista.objetivo) {
      /* Al rodear un cuerpo se dibuja ESE cuerpo y sus lunas, y nada más. Con
         las distancias comprimidas, dejar a Saturno en el cuadro mientras se
         rodea la Tierra diría que está al lado, y no lo está. La luz sigue
         saliendo de donde está el Sol aunque el Sol no se dibuje. */
      cuerpos = soloElObjetivo(cuerpos);
      orbitas = [];
    }
    return { camara: camaraDe(cuerpos, m), luz: luz,
             cuerpos: cuerpos, orbitas: orbitas, fecha: FECHA,
             objetivo: vista.objetivo, sombrasMutuas: !!vista.objetivo };
  }

  /* ----------------------------------------------------------- texturas --
     Embebidas si están —así se pueden subir a la GPU con file:// sin que el
     lienzo quede manchado— y si no, del archivo suelto. Si no hay textura, el
     cuerpo se dibuja con su color base: no se inventa una superficie. */
  var imagenes = {};
  function fuenteDe(ruta) {
    var tex = g.IG_SOLAR_TEX;
    return (tex && tex[ruta]) || ruta;
  }
  function imagen(ruta) {
    if (!ruta) return null;
    if (imagenes[ruta] !== undefined) return imagenes[ruta];
    var im = new Image();
    im.onload = function () { g.IG_CUERPOS3D.subirTextura(ruta, im); pintar(); };
    im.onerror = function () { imagenes[ruta] = null; };
    im.src = fuenteDe(ruta);
    imagenes[ruta] = im;
    return im;
  }
  function subirTexturasDe(escena) {
    escena.cuerpos.forEach(function (c) {
      if (!c.textura || g.IG_CUERPOS3D.tieneTextura(c.textura)) return;
      var im = imagen(c.textura);
      if (im && im.complete && im.naturalWidth) g.IG_CUERPOS3D.subirTextura(c.textura, im);
    });
  }

  /* ------------------------------------------------------------- pintar --
     Dos lienzos apilados: abajo la geometría 3D en WebGL, encima una capa 2D
     con los rótulos, el cerco de selección y la mira del teclado. La capa de
     encima no dibuja ni un cuerpo: los cuerpos son malla. */
  function pintar() {
    if (!el.lienzo) return;
    var m = medir(), t0 = (g.performance || Date).now();
    var W = Math.round(m.W * m.dpr), H = Math.round(m.H * m.dpr);
    if (el.lienzo.width !== W || el.lienzo.height !== H) { el.lienzo.width = W; el.lienzo.height = H; }
    if (el.capa.width !== W || el.capa.height !== H) { el.capa.width = W; el.capa.height = H; }
    ESC = construirEscena(m);
    var info = g.IG_CUERPOS3D.info();
    if (!info.disponible || g.IG_CUERPOS3D.perdido()) { sinWebGL(m, W, H); return; }
    subirTexturasDe(ESC);
    ultimoDibujo = g.IG_CUERPOS3D.dibujar(ESC);
    pintarCapa(m, W, H);
    medidas.cuadros++; medidas.ms += (g.performance || Date).now() - t0;
    pintarOrientacion();
  }
  function pintarCapa(m, W, H) {
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.scale(m.dpr, m.dpr);
    var hechos = P.hallazgos('solar');
    ESC.cuerpos.forEach(function (o) {
      var s = g.IG_CUERPOS3D.enPantalla(ESC, o, W, H);
      if (!s) return;
      var x = s.x / m.dpr, y = s.y / m.dpr, r = s.radio / m.dpr;
      if (x < -120 || y < -120 || x > m.W + 120 || y > m.H + 120) return;
      if (estado.activo === o.id || estado.localizado === o.id) {
        ctx.strokeStyle = '#C3B8FF'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.arc(x, y, r + 7, 0, Math.PI * 2); ctx.stroke();
      }
      if (!o.luna && hechos[o.id]) {
        ctx.fillStyle = 'rgba(201,213,221,0.85)';
        ctx.font = '12px "Atkinson Hyperlegible", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(o.c[idioma()].nombre, x, y - r - 10);
      }
    });
    if (estado.tecladoActivo) {
      ctx.strokeStyle = 'rgba(195,184,255,0.75)'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(m.W / 2, m.H / 2, 16, 0, Math.PI * 2); ctx.stroke();
    }
  }
  /* Sin WebGL no se finge volumen con un dibujo plano: se dice que falta. */
  function sinWebGL(m, W, H) {
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.scale(m.dpr, m.dpr);
      ctx.fillStyle = '#060B16'; ctx.fillRect(0, 0, m.W, m.H);
      ctx.fillStyle = '#C9D5DD'; ctx.textAlign = 'center';
      ctx.font = '14px "Atkinson Hyperlegible", system-ui, sans-serif';
      envolver(ctx, t().solar_sin_webgl, m.W - 60).forEach(function (linea, i) {
        ctx.fillText(linea, m.W / 2, m.H / 2 - 20 + i * 20);
      });
    }
    pintarOrientacion();
  }
  function envolver(c, texto, ancho) {
    var pal = texto.split(' '), lineas = [], linea = '';
    pal.forEach(function (p) {
      var pr = linea ? linea + ' ' + p : p;
      if (c.measureText(pr).width > ancho && linea) { lineas.push(linea); linea = p; }
      else linea = pr;
    });
    if (linea) lineas.push(linea);
    return lineas;
  }
  function pintarOrientacion() {
    var L = t();
    var az = Math.round(((vista.azimut / GRADO) % 360 + 360) % 360);
    var elv = Math.round(vista.elevacion / GRADO);
    var esc = (Math.round(vista.escala * 100) / 100).toFixed(2);
    var o = vista.objetivo ? cuerpoDeEscena(vista.objetivo) : null;
    if (o && ESC) {
      var v = g.IG_CUERPOS3D.longitudHaciaLaCamara(o, ESC.camara.ojo);
      el.orientacion.textContent = L.solar_orientacion_cuerpo(
        o.c[idioma()].nombre, az, elv, Math.round(v.longitud), esc);
    } else {
      el.orientacion.textContent = L.solar_orientacion(az, elv, esc);
    }
    pintarMotor();
  }
  /* Con qué se está dibujando, dicho en la interfaz. Si el navegador resuelve
     por software, se lee ahí: no se presenta como rendimiento de GPU. */
  function pintarMotor() {
    if (!el.motor) return;
    var info = g.IG_CUERPOS3D.info();
    if (!info.disponible) { el.motor.textContent = t().solar_sin_webgl; return; }
    el.motor.textContent = t().solar_motor(!!info.por_software);
  }

  /* ------------------------------------------------------------- DOM ----- */
  function nodo(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto !== undefined) n.textContent = texto;
    return n;
  }
  function construir() {
    var L = t(), raiz = document.getElementById('solar');
    raiz.textContent = '';

    var cab = nodo('div', 'ig-escena-cab');
    el.volver = nodo('button', 'ig-btn ig-pequeno', L.volver_a_la_portada);
    el.volver.type = 'button';
    el.volver.addEventListener('click', function () { P.mostrarPantalla('portada'); });
    el.orientacion = nodo('p', 'ig-nota');
    el.motor = nodo('p', 'ig-nota');
    el.motor.id = 'solar-motor';
    cab.appendChild(el.volver); cab.appendChild(el.orientacion); cab.appendChild(el.motor);
    raiz.appendChild(cab);

    var fila = nodo('div', 'ig-objetivo-fila');
    el.objetivo = nodo('p', 'ig-objetivo');
    fila.appendChild(el.objetivo);
    raiz.appendChild(fila);

    var wrap = nodo('div', 'ig-escenario-wrap');
    el.escenario = nodo('div', 'ig-escenario');
    el.escenario.id = 'solar-escenario';
    el.escenario.tabIndex = 0;
    el.escenario.setAttribute('role', 'group');
    el.escenario.setAttribute('aria-label', L.bloque_solar);
    el.escenario.setAttribute('aria-describedby', 'solar-ayuda');
    /* el lienzo de abajo es el de WebGL: ahí están los cuerpos, que son malla */
    el.lienzo = document.createElement('canvas');
    el.lienzo.id = 'solar-lienzo';
    el.lienzo.className = 'ig-apilado';
    el.lienzo.setAttribute('aria-hidden', 'true');
    el.escenario.appendChild(el.lienzo);
    /* y el de encima sólo lleva rótulos, cerco y mira: ni un cuerpo */
    el.capa = document.createElement('canvas');
    el.capa.id = 'solar-capa';
    el.capa.className = 'ig-apilado ig-capa';
    el.capa.setAttribute('aria-hidden', 'true');
    el.escenario.appendChild(el.capa);
    var ayuda = nodo('p', 'ig-sr', L.solar_area_ayuda);
    ayuda.id = 'solar-ayuda';
    el.escenario.appendChild(ayuda);
    wrap.appendChild(el.escenario);

    el.panel = nodo('aside', 'ig-panel');
    el.panel.id = 'solar-panel';
    el.panel.hidden = true;
    el.panel.setAttribute('data-occluder', '');
    el.panel.setAttribute('role', 'region');
    el.panel.setAttribute('tabindex', '-1');
    var pc = nodo('div', 'ig-panel-cab');
    el.panelTitulo = nodo('h2', null, '');
    el.panelTitulo.id = 'solar-panel-titulo';
    el.panel.setAttribute('aria-labelledby', 'solar-panel-titulo');
    el.cerrarPanel = nodo('button', 'ig-btn ig-pequeno', L.cerrar);
    el.cerrarPanel.type = 'button';
    el.cerrarPanel.addEventListener('click', function () { cerrarPanel(); });
    pc.appendChild(el.panelTitulo); pc.appendChild(el.cerrarPanel);
    el.panel.appendChild(pc);
    el.panelCuerpo = nodo('div', 'ig-panel-cuerpo');
    el.panelCuerpo.id = 'solar-panel-cuerpo';
    el.panel.appendChild(el.panelCuerpo);
    wrap.appendChild(el.panel);
    raiz.appendChild(wrap);

    var bandeja = nodo('div', 'ig-bandeja');
    el.examinar = nodo('button', 'ig-btn ig-primary', L.solar_examinar);
    el.examinar.type = 'button';
    el.examinar.addEventListener('click', function () {
      estado.tecladoActivo = P.ultimaEntrada() === 'teclado';
      examinarCentro();
    });
    el.mensaje = nodo('p', 'ig-mensaje');
    el.revelar = nodo('button', 'ig-btn', '');
    el.revelar.type = 'button'; el.revelar.hidden = true;
    el.revelar.addEventListener('click', revelar);
    el.saberMas = nodo('button', 'ig-btn', '');
    el.saberMas.type = 'button'; el.saberMas.hidden = true;
    el.saberMas.addEventListener('click', function () { if (estado.activo) abrirFicha(estado.activo); });
    /* Rodear: la cámara pasa a orbitar ESE cuerpo. Es la vía sin arrastrar. */
    el.rodear = nodo('button', 'ig-btn', '');
    el.rodear.type = 'button'; el.rodear.hidden = true;
    el.rodear.addEventListener('click', function () { if (estado.activo) rodear(estado.activo); });
    el.alSistema = nodo('button', 'ig-btn', '');
    el.alSistema.type = 'button'; el.alSistema.hidden = true;
    el.alSistema.addEventListener('click', function () { alSistema(); });
    bandeja.appendChild(el.examinar); bandeja.appendChild(el.mensaje);
    bandeja.appendChild(el.revelar); bandeja.appendChild(el.saberMas);
    bandeja.appendChild(el.rodear); bandeja.appendChild(el.alSistema);
    raiz.appendChild(bandeja);

    var sec = nodo('div', 'ig-secundarios');
    sec.setAttribute('role', 'group');
    sec.appendChild(nodo('span', 'ig-etiqueta', L.controles_alternativos));
    [['izquierda', '←', L.solar_girar_izquierda], ['derecha', '→', L.solar_girar_derecha],
     ['arriba', '↑', L.solar_inclinar_arriba], ['abajo', '↓', L.solar_inclinar_abajo],
     ['acercar', '+', L.acercar], ['alejar', '−', L.alejar]].forEach(function (b) {
      var btn = nodo('button', 'ig-mando', b[1]);
      btn.type = 'button';
      btn.setAttribute('aria-label', b[2]);
      btn.addEventListener('click', function () { mando(b[0]); });
      sec.appendChild(btn);
    });
    el.listaCuerpos = nodo('button', 'ig-btn ig-pequeno', L.solar_lista);
    el.listaCuerpos.type = 'button';
    el.listaCuerpos.addEventListener('click', abrirLista);
    sec.appendChild(el.listaCuerpos);
    raiz.appendChild(sec);
    return raiz;
  }

  /* --------------------------------------------------------- examinar ---- */
  /* El punto se resuelve contra el VOLUMEN: un rayo desde la cámara por ese
     píxel, cortado contra la esfera de cada cuerpo, y gana el impacto más
     cercano —lo que está delante tapa—. Si el rayo del centro no corta nada, se
     prueban ocho rayos más en un anillo de 14 px, para que un cuerpo pequeño no
     exija precisión de cirujano. Siguen siendo rayos contra la esfera: no hay
     tolerancia por distancia en pantalla, y si ningún rayo corta, no hay cuerpo. */
  var ASISTENCIA_PX = 14;
  function cuerpoEn(punto) {
    if (!ESC) pintar();
    if (!ESC) return null;
    var m = medir(), W = el.lienzo.width, H = el.lienzo.height;
    var h = g.IG_CUERPOS3D.raycast(ESC, punto.x * m.dpr, punto.y * m.dpr, W, H);
    if (h) return h.cuerpo;
    var mejor = null;
    for (var i = 0; i < 8; i++) {
      var a = i / 8 * Math.PI * 2;
      var q = g.IG_CUERPOS3D.raycast(ESC, (punto.x + Math.cos(a) * ASISTENCIA_PX) * m.dpr,
                                          (punto.y + Math.sin(a) * ASISTENCIA_PX) * m.dpr, W, H);
      if (q && (!mejor || q.t < mejor.t)) mejor = q;
    }
    return mejor ? mejor.cuerpo : null;
  }
  function examinarEn(punto) {
    var o = cuerpoEn(punto);
    estado.localizado = null;
    if (!o) {
      estado.mensaje = { tipo: 'nada' };
      pintarMensaje(); pintar(); P.anunciar(t().solar_nada);
      return;
    }
    var hechos = P.hallazgos('solar');
    if (hechos[o.c.id]) {
      estado.activo = o.c.id;
      estado.mensaje = { tipo: 'ya', id: o.c.id };
      pintarMensaje(); pintar(); P.anunciar(textoMensaje());
      return;
    }
    estado.localizado = o.c.id;
    estado.mensaje = { tipo: 'localizado', id: o.c.id };
    pintarMensaje(); pintar(); P.anunciar(textoMensaje());
  }
  function examinarCentro() {
    var m = medir();
    examinarEn({ x: m.W / 2, y: m.H / 2 });
  }
  /* Lo que se puede decir SIN nombrarlo: lo que se ve y lo que se mide. */
  function descripcion(c) {
    var L = t(), d = c.datos || {};
    var orden = D.cuerpos.filter(function (x) { return x.id !== 'sol' && x.datos && x.datos.dist_sol; })
      .sort(function (a, b) { return a.datos.dist_sol - b.datos.dist_sol; })
      .map(function (x) { return x.id; }).indexOf(c.id) + 1;
    return L.solar_descripcion({
      estrella: c.tipo === 'estrella',
      orden: orden,
      anillos: !!d.anillos,
      lunas: d.lunas_nasa || c.lunas_conocidas || 0,
      mayor_que_la_tierra: d.diametro > 12756,
      enano: c.tipo === 'planeta enano' || c.tipo === 'enano'
    });
  }
  function textoMensaje() {
    var L = t(), m = estado.mensaje;
    if (!m) return '';
    if (m.tipo === 'nada') return L.solar_nada;
    var c = porId(m.id);
    if (m.tipo === 'ya') return L.solar_ya(c[idioma()].nombre);
    if (m.tipo === 'revelado') return L.solar_revelado(c[idioma()].nombre);
    return descripcion(c);
  }
  function pintarMensaje() {
    var L = t(), m = estado.mensaje;
    el.mensaje.textContent = textoMensaje();
    el.revelar.hidden = !(m && m.tipo === 'localizado');
    el.revelar.textContent = L.solar_ver_cual_es;
    el.saberMas.hidden = !(m && (m.tipo === 'revelado' || m.tipo === 'ya'));
    el.saberMas.textContent = L.saber_mas;
    el.examinar.hidden = !!(m && m.tipo === 'localizado');
    el.rodear.hidden = !(estado.activo && vista.objetivo !== estado.activo);
    el.rodear.textContent = L.solar_rodear;
    el.alSistema.hidden = !vista.objetivo;
    el.alSistema.textContent = L.solar_al_sistema_boton;
  }
  function porId(id) {
    for (var i = 0; i < D.cuerpos.length; i++) if (D.cuerpos[i].id === id) return D.cuerpos[i];
    return null;
  }
  function revelar() {
    if (!estado.localizado) return;
    var id = estado.localizado;
    estado.activo = id; estado.localizado = null;
    estado.mensaje = { tipo: 'revelado', id: id };
    P.registrarHallazgo('solar', id, true);
    pintarMensaje(); pintar();
    P.anunciar(t().solar_revelado(porId(id)[idioma()].nombre));
    el.saberMas.focus();
  }

  function mando(q) {
    if (q === 'izquierda') vista.azimut -= 6 * GRADO;
    else if (q === 'derecha') vista.azimut += 6 * GRADO;
    else if (q === 'arriba') vista.elevacion = Math.min(ELEV_MAX, vista.elevacion + 4 * GRADO);
    else if (q === 'abajo') vista.elevacion = Math.max(-ELEV_MAX, vista.elevacion - 4 * GRADO);
    else if (q === 'acercar') vista.escala = Math.min(14, vista.escala * 1.25);
    else if (q === 'alejar') vista.escala = Math.max(0.45, vista.escala / 1.25);
    pintar();
    P.anunciar(t().vista_movida);
  }
  /* Rodear un cuerpo: lo que se mueve es la CÁMARA, que pasa a orbitar ese
     cuerpo. Al girar aparece otra parte de su superficie porque el cuerpo tiene
     volumen y está ahí, no porque se vuelva a dibujar mirando de frente. */
  function rodear(id) {
    if (!id) return;
    vista.objetivo = id; vista.escala = 1;
    /* La cámara se coloca de entrada en el lado iluminado, un poco de lado para
       que el terminador entre en el cuadro. Es dónde se pone la cámara, no de
       dónde viene la luz: la luz sigue saliendo del Sol, y si desde ahí el
       cuerpo está de noche, de noche se ve. */
    var o0 = cuerpoDeEscena(id);
    if (o0 && id !== 'sol') {
      var dx = -o0.centro[0], dy = -o0.centro[1];
      if (dx || dy) vista.azimut = Math.atan2(dy, dx) + 38 * GRADO;
      vista.elevacion = 0.3;
    }
    estado.activo = id; estado.localizado = null;
    pintar(); pintarMensaje();
    P.anunciar(t().solar_rodeando(nombreDe(id)));
  }
  function alSistema() {
    vista.objetivo = null; vista.escala = 1;
    pintar(); pintarMensaje();
    P.anunciar(t().solar_al_sistema);
  }
  function nombreDe(id) {
    var o = cuerpoDeEscena(id), c = o ? o.c : porId(id);
    return c ? c[idioma()].nombre : id;
  }
  function enlazar() {
    el.escenario.addEventListener('keydown', function (ev) {
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      var k = ev.key, hecho = true;
      if (k === 'ArrowLeft') mando('izquierda');
      else if (k === 'ArrowRight') mando('derecha');
      else if (k === 'ArrowUp') mando('arriba');
      else if (k === 'ArrowDown') mando('abajo');
      else if (k === '+' || k === '=') mando('acercar');
      else if (k === '-' || k === '_') mando('alejar');
      else if (k === 'Enter') { estado.tecladoActivo = true; examinarCentro(); }
      else if (k === 'o' || k === 'O') { if (estado.activo) rodear(estado.activo); }
      else if (k === 'v' || k === 'V') { if (vista.objetivo) alSistema(); }
      else hecho = false;
      if (hecho) { if (k !== 'Enter') estado.tecladoActivo = true; pintar(); ev.preventDefault(); }
    });
    el.escenario.addEventListener('focus', function () {
      estado.tecladoActivo = (P.ultimaEntrada() === 'teclado');
      pintar();
    });
    el.escenario.addEventListener('blur', function () { estado.tecladoActivo = false; pintar(); });

    function puntoEn(ev) {
      var c = el.lienzo.getBoundingClientRect();
      return { x: ev.clientX - c.left, y: ev.clientY - c.top };
    }
    el.lienzo.addEventListener('pointerdown', function (ev) {
      if (ev.button !== undefined && ev.button !== 0) return;
      punteros[ev.pointerId] = { x: ev.clientX, y: ev.clientY,
        inicio: { x: ev.clientX, y: ev.clientY }, arrastrado: false };
      var ids = Object.keys(punteros);
      if (ids.length >= 2) {
        pinza = { dist: Math.hypot(punteros[ids[0]].x - punteros[ids[1]].x,
                                   punteros[ids[0]].y - punteros[ids[1]].y), escala: vista.escala };
      }
      try { el.lienzo.setPointerCapture(ev.pointerId); } catch (e) {}
    });
    el.lienzo.addEventListener('pointermove', function (ev) {
      var p = punteros[ev.pointerId];
      if (!p) return;
      var ids = Object.keys(punteros);
      p.x = ev.clientX; p.y = ev.clientY;
      if (ids.length >= 2 && pinza) {
        var d = Math.hypot(punteros[ids[0]].x - punteros[ids[1]].x,
                           punteros[ids[0]].y - punteros[ids[1]].y);
        if (pinza.dist > 10) {
          vista.escala = Math.max(0.45, Math.min(14, pinza.escala * d / pinza.dist));
          pintar();
        }
        return;
      }
      if (!p.arrastrado) {
        if (Math.hypot(ev.clientX - p.inicio.x, ev.clientY - p.inicio.y) < CFG.UMBRAL_ARRASTRE) return;
        p.arrastrado = true;
        el.lienzo.classList.add('orientando');
        p.ult = { x: p.inicio.x, y: p.inicio.y };
      }
      /* arrastrar gira: la escena sigue a la mano */
      var dx = ev.clientX - p.ult.x, dy = ev.clientY - p.ult.y;
      p.ult = { x: ev.clientX, y: ev.clientY };
      vista.azimut += dx * 0.006;
      vista.elevacion = Math.max(-ELEV_MAX, Math.min(ELEV_MAX, vista.elevacion - dy * 0.004));
      pintar();
    });
    function soltar(ev, cancelado) {
      var p = punteros[ev.pointerId];
      if (!p) return;
      delete punteros[ev.pointerId];
      var ids = Object.keys(punteros);
      if (ids.length < 2) pinza = null;
      ids.forEach(function (i) { punteros[i].arrastrado = true; punteros[i].ult = { x: punteros[i].x, y: punteros[i].y }; });
      if (ids.length === 0) {
        el.lienzo.classList.remove('orientando');
        if (!cancelado && !p.arrastrado) { estado.tecladoActivo = false; examinarEn(puntoEn(ev)); }
      }
    }
    el.lienzo.addEventListener('pointerup', function (ev) { soltar(ev, false); });
    el.lienzo.addEventListener('pointercancel', function (ev) { soltar(ev, true); });
    el.lienzo.addEventListener('wheel', function (ev) {
      if (document.activeElement !== el.escenario) return;
      ev.preventDefault();
      vista.escala = Math.max(0.45, Math.min(14, vista.escala * (ev.deltaY < 0 ? 1.25 : 0.8)));
      pintar();
    }, { passive: false });
    g.addEventListener('resize', function () { if (!document.getElementById('solar').hidden) pintar(); });
  }

  /* ------------------------------------------------- lista, para teclado -- */
  function abrirLista() {
    var L = t();
    abrirPanel(L.solar_lista, function (cuerpo) {
      var hechos = P.hallazgos('solar');
      D.cuerpos.forEach(function (c) {
        var fila = document.createElement('div');
        fila.className = 'ig-cuaderno-fila';
        var h = document.createElement('h3');
        h.className = 'ig-cuaderno-nombre';
        /* sin spoiler: lo no revelado se describe, no se nombra */
        h.textContent = hechos[c.id] ? c[idioma()].nombre : descripcion(c);
        fila.appendChild(h);
        var acc = document.createElement('div');
        acc.className = 'ig-acciones';
        var b1 = nodo('button', 'ig-btn', hechos[c.id] ? L.saber_mas : L.solar_ver_cual_es);
        b1.type = 'button';
        b1.addEventListener('click', function () {
          if (hechos[c.id]) { abrirFicha(c.id); return; }
          estado.localizado = c.id;
          revelar();
          cerrarPanel();
        });
        acc.appendChild(b1);
        fila.appendChild(acc);
        cuerpo.appendChild(fila);
      });
    });
  }

  /* -------------------------------------------------------------- panel --- */
  var ultimoFoco = null;
  function abrirPanel(titulo, llenar) {
    el.panelTitulo.textContent = titulo;
    el.panelCuerpo.textContent = '';
    llenar(el.panelCuerpo);
    el.panel.hidden = false;
    document.querySelector('#solar .ig-escenario-wrap').classList.add('con-panel');
    estado.panel = titulo;
    pintar();
    el.panel.focus({ preventScroll: true });
  }
  function cerrarPanel() {
    if (el.panel.hidden) return;
    el.panel.hidden = true;
    document.querySelector('#solar .ig-escenario-wrap').classList.remove('con-panel');
    estado.panel = null;
    pintar();
    P.enfocar(el.escenario);
  }

  function filas(pares) {
    var dl = document.createElement('dl');
    dl.className = 'ig-datos';
    pares.forEach(function (p) {
      if (p[1] === null || p[1] === undefined || p[1] === '') return;
      var dt = document.createElement('dt'); dt.textContent = p[0];
      var dd = document.createElement('dd'); dd.textContent = p[1];
      dl.appendChild(dt); dl.appendChild(dd);
    });
    return dl;
  }
  function parrafo(txt, cls) {
    var q = document.createElement('p');
    if (cls) q.className = cls;
    q.textContent = txt;
    return q;
  }
  function abrirFicha(id) {
    var L = t(), c = porId(id), ib = idioma();
    if (!c) return;
    abrirPanel(c[ib].nombre, function (cuerpo) {
      var x = c[ib], d = c.datos || {};
      cuerpo.appendChild(parrafo(x.tipo, 'ig-nota'));
      cuerpo.appendChild(parrafo(x.resumen));
      if (x.aspecto) cuerpo.appendChild(parrafo(x.aspecto));
      (x.destaca || []).slice(0, 3).forEach(function (s) { cuerpo.appendChild(parrafo('· ' + s)); });
      cuerpo.appendChild(filas([
        [L.sol_diametro, d.diametro ? d.diametro.toLocaleString(ib === 'es' ? 'es-ES' : 'en-GB') + ' km' : null],
        [L.sol_distancia, d.dist_sol ? d.dist_sol + (c.id === 'sol' ? '' : ' ' + L.sol_millones_km) : null],
        [L.sol_periodo, d.periodo_d ? (d.periodo_d >= 1000
            ? (Math.round(d.periodo_d / 365.25 * 10) / 10) + ' ' + L.sol_anios
            : d.periodo_d + ' ' + L.sol_dias) : null],
        [L.sol_temperatura, (d.temp !== undefined && d.temp !== null) ? d.temp + ' °C' : null],
        [L.sol_lunas_n, c.lunas_conocidas || null]
      ]));
      var vistaDetalle = document.createElement('details');
      var vistaResumen = document.createElement('summary');
      vistaResumen.textContent = t().datos_de_esta_vista;
      vistaDetalle.appendChild(vistaResumen);
      var az = Math.round(((vista.azimut / GRADO) % 360 + 360) % 360);
      var elv = Math.round(vista.elevacion / GRADO);
      var esc = (Math.round(vista.escala * 100) / 100).toFixed(2);
      var vv = ESC ? g.IG_CUERPOS3D.longitudHaciaLaCamara(cuerpoDeEscena(c.id), ESC.camara.ojo) : null;
      vistaDetalle.appendChild(filas([
        [ib === 'es' ? 'Giro alrededor del cuerpo' : 'Turn around the body', az + '°'],
        [ib === 'es' ? 'Altura de la vista' : 'View height', elv + '°'],
        [ib === 'es' ? 'Longitud visible' : 'Visible longitude', vv ? Math.round(vv.longitud) + '°' : null],
        [ib === 'es' ? 'Acercamiento' : 'Zoom', '×' + esc]
      ]));
      cuerpo.appendChild(vistaDetalle);
      /* B03 · sus lunas: relación con el cuerpo principal, sin tabla dominante */
      var ms = lunasDe(c.id);
      if (ms.length) {
        var h3 = document.createElement('h3');
        h3.textContent = L.sol_sus_lunas(ms.length, c.lunas_conocidas);
        cuerpo.appendChild(h3);
        ms.forEach(function (mm) {
          var fila = document.createElement('div');
          fila.className = 'ig-cuaderno-fila';
          var h = document.createElement('h4');
          h.className = 'ig-cuaderno-nombre';
          h.textContent = mm[ib] || mm.es;
          fila.appendChild(h);
          fila.appendChild(parrafo(L.sol_luna_datos(
            mm.radio_km ? Math.round(mm.radio_km * 2).toLocaleString(ib === 'es' ? 'es-ES' : 'en-GB') : null,
            mm.periodo_dias, mm.retrograda, mm.descubierta), 'ig-nota'));
          if (mm.radio_km) {
            var comp = mm.radio_km * 2 / 3475;
            fila.appendChild(parrafo(L.sol_comparar_luna(comp >= 1
              ? (Math.round(comp * 10) / 10) : Math.round(comp * 100) / 100), 'ig-nota'));
          }
          cuerpo.appendChild(fila);
        });
      }
      if (c.textura_es_recreacion) cuerpo.appendChild(parrafo(L.sol_recreacion, 'ig-nota'));
      cuerpo.appendChild(parrafo(L.sol_estado_factual, 'ig-nota'));
      var cred = c.textura_credito;
      if (cred && cred.autor) {
        /* R04.5 · autor y licencia vienen del catálogo en español. */
        var T = idioma() === 'es' ? null : (g.IG_COPIA && g.IG_COPIA.datos_en);
        var au = (T && T[cred.autor]) || cred.autor;
        var li = cred.licencia ? ((T && T[cred.licencia]) || cred.licencia) : '';
        cuerpo.appendChild(parrafo(L.sol_credito + ' ' + au + (li ? ' · ' + li : ''), 'ig-nota'));
      }
    });
  }

  /* ------------------------------------------------------- registro ------ */
  function abrir() {
    if (!el.escenario) { construir(); enlazar(); }
    actualizarTextos();
    /* geometría abajo, rótulos arriba */
    if (!motor) {
      motor = g.IG_CUERPOS3D.iniciar(el.lienzo);
      g.IG_CUERPOS3D.alPerderContexto = function () { pintarMotor(); };
      g.IG_CUERPOS3D.alRecuperarContexto = function () { imagenes = {}; pintar(); };
    }
    try { ctx = el.capa.getContext('2d'); } catch (e) { ctx = null; }
    POS = null;                         /* recalcular posiciones para hoy */
    redimensionar();
    estado.mensaje = null;
    pintarMensaje();
    pintar();
  }
  function cerrar() { cerrarPanel(); }
  function redimensionar() {
    if (!el.lienzo) return;
    var m = medir(), W = Math.round(m.W * m.dpr), H = Math.round(m.H * m.dpr);
    el.lienzo.width = W; el.lienzo.height = H;
    el.capa.width = W; el.capa.height = H;
  }
  function actualizarTextos() {
    var L = t();
    if (!el.volver) return;
    el.volver.textContent = L.volver_a_la_portada;
    el.examinar.textContent = L.solar_examinar;
    el.listaCuerpos.textContent = L.solar_lista;
    el.objetivo.textContent = L.solar_objetivo;
    el.cerrarPanel.textContent = L.cerrar;
    el.escenario.setAttribute('aria-label', L.bloque_solar);
    pintarMensaje();
    if (el.motor) pintarMotor();
  }

  function cuandoListo() {
    if (!g.IG_PRODUCTO) { setTimeout(cuandoListo, 10); return; }
    P = g.IG_PRODUCTO;
    P.registrarBloque({
      id: 'solar', seccion: 'solar',
      clave_nombre: 'bloque_solar', clave_resumen: 'bloque_solar_resumen',
      abrir: abrir, cerrar: cerrar,
      aplicarIdioma: actualizarTextos,
      foco: function () { return el.escenario; },
      total: function () { return D ? D.cuerpos.length : 0; }
    });
  }
  if (D) cuandoListo();

  /* Dónde cae un cuerpo en pantalla ahora mismo, PROYECTADO desde su geometría,
     para que las pruebas midan su disco sin adivinar. Leer no es inyectar. */
  function posicionEnPantalla(id) {
    var m = medir(), caja = el.lienzo.getBoundingClientRect();
    var o = cuerpoDeEscena(id);
    if (!o && ESC === null) { pintar(); o = cuerpoDeEscena(id); }
    if (!o) return null;
    var s = g.IG_CUERPOS3D.enPantalla(ESC, o, el.lienzo.width, el.lienzo.height);
    if (!s) return null;
    return { x: s.x / m.dpr, y: s.y / m.dpr, radio: s.radio / m.dpr,
             x_dispositivo: s.x, y_dispositivo: s.y, radio_dispositivo: s.radio,
             dpr: m.dpr, W: m.W, H: m.H, left: caja.left, top: caja.top };
  }

  g.IG_SOLAR_VISTA = {
    vista: vista, posiciones: posiciones, pintar: pintar,
    posicionEnPantalla: posicionEnPantalla,
    medidas: function () { return { cuadros: medidas.cuadros, ms: Math.round(medidas.ms),
      ms_por_cuadro: medidas.cuadros ? Math.round(medidas.ms / medidas.cuadros * 100) / 100 : 0 }; },
    reiniciarMedidas: function () { medidas = { cuadros: 0, ms: 0 }; },
    estado: estado, fecha: function () { return FECHA; },
    /* lo que los oráculos necesitan poder medir, no creer */
    escena: function () { return ESC; },
    cuerpo: function (id) { return cuerpoDeEscena(id); },
    motor: function () { return g.IG_CUERPOS3D.info(); },
    malla: function () { return g.IG_CUERPOS3D.estadisticasDeMalla(); },
    ultimoDibujo: function () { return ultimoDibujo; },
    caraVisible: function (id) {
      var o = cuerpoDeEscena(id);
      return o && ESC ? g.IG_CUERPOS3D.longitudHaciaLaCamara(o, ESC.camara.ojo) : null;
    },
    tocar: function (x, y) {
      var o = cuerpoEn({ x: x, y: y });
      return o ? o.id : null;
    },
    rodear: rodear, alSistema: alSistema,
    fijarFecha: function (f) { FECHA = f ? new Date(f) : null; POS = FECHA ? posiciones(FECHA) : null; },
    hayTextura: function (ruta) { return g.IG_CUERPOS3D.tieneTextura(ruta); }
  };
})(window);
