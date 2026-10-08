/* Cielo 3D · piloto R01 · GEOMETRÍA DE LA ESFERA CELESTE.

   UNA sola transformación de coordenadas celestes a direcciones, usada por el
   dibujo, la selección, los marcadores y las figuras. Funciona igual en el
   navegador y en Node, para poder probarla sin navegador.

   CONVENCIÓN DE EJES (ecuatorial, diestra):
     x → ascensión recta 0 h sobre el ecuador
     y → ascensión recta 6 h sobre el ecuador
     z → polo norte celeste
   El observador está DENTRO de la esfera y mira hacia fuera, así que la
   ascensión recta crece hacia la IZQUIERDA de la pantalla, como a simple vista
   mirando al cielo con el norte arriba. Esto se comprueba con coordenadas
   reales en las pruebas unitarias; no se da por supuesto.                    */
(function (g) {
  'use strict';
  var CFG = (typeof require === 'function' && typeof module !== 'undefined')
    ? require('./config.js') : g.IG_CONFIG;

  var GRADO = Math.PI / 180;
  function limitar(v, a, b) { return v < a ? a : (v > b ? b : v); }

  /* --------------------------------------------------- direcciones -------- */
  function aDireccion(raHoras, decGrados) {
    var r = raHoras * 15 * GRADO, d = decGrados * GRADO, c = Math.cos(d);
    return { x: c * Math.cos(r), y: c * Math.sin(r), z: Math.sin(d) };
  }
  function aCoordenadas(v) {
    var ra = Math.atan2(v.y, v.x) / GRADO / 15;
    if (ra < 0) ra += 24;
    return { ra: ra, dec: Math.asin(limitar(v.z, -1, 1)) / GRADO };
  }
  function punto(a, b) { return a.x * b.x + a.y * b.y + a.z * b.z; }
  function cruz(a, b) {
    return { x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x };
  }
  function unitario(v) {
    var n = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1;
    return { x: v.x / n, y: v.y / n, z: v.z / n };
  }
  function anguloEntre(a, b) { return Math.acos(limitar(punto(a, b), -1, 1)) / GRADO; }

  /* ------------------------------------------------------- cámara --------- */
  /* La cámara es sólo una dirección de mirada y un campo de visión. No hay
     posición: el observador no se mueve. No hay roll: el norte celeste queda
     siempre hacia arriba. */
  function baseCamara(cam) {
    var f = aDireccion(cam.ra, cam.dec);
    var polo = { x: 0, y: 0, z: 1 };
    /* derecha = f × polo: para f sobre el ecuador da la dirección de AR
       DECRECIENTE, es decir, el este queda a la izquierda. */
    var d = cruz(f, polo);
    if (Math.abs(d.x) + Math.abs(d.y) + Math.abs(d.z) < 1e-9) d = { x: 0, y: 1, z: 0 };
    var r = unitario(d);
    var u = unitario(cruz(r, f));
    return { f: f, r: r, u: u };
  }
  function escala(cam, W, H) {
    return (H / 2) / Math.tan(cam.fov / 2 * GRADO);
  }
  /* Proyección en perspectiva desde el centro de la esfera. Lo que queda por
     detrás del observador no se dibuja ni cuenta como observado. */
  function aPantalla(v, cam, W, H, base) {
    var b = base || baseCamara(cam);
    var z = punto(v, b.f);
    if (z <= 1e-6) return { x: 0, y: 0, delante: false, z: z };
    var k = escala(cam, W, H);
    return { x: W / 2 + punto(v, b.r) / z * k, y: H / 2 - punto(v, b.u) / z * k,
             delante: true, z: z };
  }
  function dePantalla(p, cam, W, H, base) {
    var b = base || baseCamara(cam);
    var k = escala(cam, W, H);
    var a = (p.x - W / 2) / k, c = (H / 2 - p.y) / k;
    return unitario({ x: b.f.x + b.r.x * a + b.u.x * c,
                      y: b.f.y + b.r.y * a + b.u.y * c,
                      z: b.f.z + b.r.z * a + b.u.z * c });
  }
  function centroVista(W, H) { return { x: W / 2, y: H / 2 }; }

  /* Orientar hacia una dirección manteniendo un punto de la pantalla quieto:
     así la rueda y la pinza amplían alrededor de lo señalado, no del centro. */
  /* Orientar de modo que una dirección del cielo caiga en un punto concreto de
     la pantalla: así el cielo sigue al dedo al arrastrar, y la rueda y la pinza
     amplían alrededor de lo señalado y no del centro. Se resuelve en unas
     pocas pasadas; el error queda por debajo de un píxel. */
  function camaraQueLleva(cam, W, H, direccion, destino, fovNuevo) {
    var nueva = { ra: cam.ra, dec: cam.dec,
                  fov: limitar(fovNuevo === undefined ? cam.fov : fovNuevo,
                               CFG.CAMPO_VISION.minimo, CFG.CAMPO_VISION.maximo) };
    for (var i = 0; i < 4; i++) {
      var actual = dePantalla(destino, nueva, W, H);
      var c1 = aCoordenadas(actual), c2 = aCoordenadas(direccion);
      var dra = c2.ra - c1.ra;
      while (dra > 12) dra -= 24;
      while (dra < -12) dra += 24;
      nueva.ra = (nueva.ra + dra + 24) % 24;
      nueva.dec = limitar(nueva.dec + (c2.dec - c1.dec), -CFG.DEC_MAXIMA, CFG.DEC_MAXIMA);
    }
    return nueva;
  }
  function camaraAmpliada(cam, W, H, fovNuevo, p) {
    var fov = limitar(fovNuevo, CFG.CAMPO_VISION.minimo, CFG.CAMPO_VISION.maximo);
    if (!p) return { ra: cam.ra, dec: cam.dec, fov: fov };
    return camaraQueLleva(cam, W, H, dePantalla(p, cam, W, H), p, fov);
  }
  function ajustarCamara(cam) {
    cam.ra = ((cam.ra % 24) + 24) % 24;
    cam.dec = limitar(cam.dec, -CFG.DEC_MAXIMA, CFG.DEC_MAXIMA);
    cam.fov = limitar(cam.fov, CFG.CAMPO_VISION.minimo, CFG.CAMPO_VISION.maximo);
    return cam;
  }

  /* -------------------------------------------------- evidencia ----------- */
  /* La región que sustenta una identificación es un CONO de radio angular fijo
     alrededor de la dirección señalada. No depende del tamaño de la pantalla,
     del campo de visión ni del tamaño del objetivo. */
  function aperturaRadioGrados() { return CFG.EVIDENCIA.apertura_radio_grados; }
  function aperturaGrados() { return Math.round(CFG.EVIDENCIA.apertura_radio_grados * 2 * 10) / 10; }
  function enEvidencia(direccionPunto, v) {
    return anguloEntre(direccionPunto, v) <= CFG.EVIDENCIA.apertura_radio_grados;
  }
  /* Contorno del cono en pantalla: se muestrean direcciones del borde y se
     proyectan. Es exacto, también fuera del centro, donde el cono no se ve
     como una circunferencia. */
  function contornoEvidencia(dir, cam, W, H, n) {
    var base = baseCamara(cam), pasos = n || 48;
    var eje = dir;
    var aux = Math.abs(eje.z) < 0.9 ? { x: 0, y: 0, z: 1 } : { x: 1, y: 0, z: 0 };
    var e1 = unitario(cruz(eje, aux)), e2 = unitario(cruz(eje, e1));
    var a = CFG.EVIDENCIA.apertura_radio_grados * GRADO;
    var ca = Math.cos(a), sa = Math.sin(a), out = [];
    for (var i = 0; i < pasos; i++) {
      var t = i / pasos * 2 * Math.PI;
      var v = unitario({ x: eje.x * ca + (e1.x * Math.cos(t) + e2.x * Math.sin(t)) * sa,
                         y: eje.y * ca + (e1.y * Math.cos(t) + e2.y * Math.sin(t)) * sa,
                         z: eje.z * ca + (e1.z * Math.cos(t) + e2.z * Math.sin(t)) * sa });
      out.push(aPantalla(v, cam, W, H, base));
    }
    return out;
  }

  /* Octante tal como se ve en pantalla —el norte celeste siempre arriba, la
     ascensión recta creciendo hacia la izquierda—, calculado sobre direcciones
     del cielo. No depende del tamaño de la pantalla ni del acercamiento, así
     que sirve para describir dónde está algo sin usar píxeles. */
  var OCTANTES = ['derecha', 'arriba_derecha', 'arriba', 'arriba_izquierda',
                  'izquierda', 'abajo_izquierda', 'abajo', 'abajo_derecha'];
  function octanteCeleste(desde, hasta) {
    var a = desde, t = hasta;
    var este = unitario(cruz({ x: 0, y: 0, z: 1 }, a));
    if (!isFinite(este.x)) este = { x: 0, y: 1, z: 0 };
    var norte = unitario(cruz(a, este));
    var e = punto(t, este), n = punto(t, norte);
    var k = Math.round(Math.atan2(n, -e) / (Math.PI / 4));
    return OCTANTES[((k % 8) + 8) % 8];
  }

  /* Un salto medido se lee en los dos sentidos: de A a B y de B a A. La
     separación es la misma; la dirección, la contraria. */
  var OPUESTO = { derecha: 'izquierda', izquierda: 'derecha', arriba: 'abajo', abajo: 'arriba',
                  arriba_derecha: 'abajo_izquierda', abajo_izquierda: 'arriba_derecha',
                  arriba_izquierda: 'abajo_derecha', abajo_derecha: 'arriba_izquierda' };
  var OCT_ES = ['la derecha', 'arriba a la derecha', 'arriba', 'arriba a la izquierda',
                'la izquierda', 'abajo a la izquierda', 'abajo', 'abajo a la derecha'];
  var OCT_EN = ['to the right', 'to the upper right', 'straight up', 'to the upper left',
                'to the left', 'to the lower left', 'straight down', 'to the lower right'];
  function saltoInverso(s) {
    var k = ((s.octante + 4) % 8 + 8) % 8;
    return { desde: s.hasta, hasta: s.desde,
             desde_estrella: s.hasta_estrella, hasta_estrella: s.desde_estrella,
             separacion_grados: s.separacion_grados, octante: k,
             direccion_es: OCT_ES[k], direccion_en: OCT_EN[k],
             punos_es: s.punos_es, punos_en: s.punos_en, derivacion: s.derivacion };
  }

  /* Una sola definición de «observado»: delante de la cámara, dentro del
     recuadro y fuera de lo que tape la interfaz. */
  function esVisible(s, W, H, zonas) {
    if (!s.delante) return false;
    if (!(s.x >= 0 && s.x <= W && s.y >= 0 && s.y <= H)) return false;
    for (var i = 0; i < zonas.length; i++) {
      var r = zonas[i];
      if (s.x >= r.x && s.x <= r.x + r.w && s.y >= r.y && s.y <= r.y + r.h) return false;
    }
    return true;
  }

  /* Mayor trozo SEGUIDO del dibujo entre los puntos tomados. */
  function mayorTrozo(k, dentro) {
    var set = {}, i;
    for (i = 0; i < dentro.length; i++) set[dentro[i]] = true;
    var visto = {}, mejor = 0;
    for (i = 0; i < dentro.length; i++) {
      if (visto[dentro[i]]) continue;
      var pila = [dentro[i]], n = 0;
      visto[dentro[i]] = true;
      while (pila.length) {
        var x = pila.pop(); n++;
        var vs = (k.vecinosObs || k.vecinos)[x] || [];
        for (var j = 0; j < vs.length; j++) {
          if (set[vs[j]] && !visto[vs[j]]) { visto[vs[j]] = true; pila.push(vs[j]); }
        }
      }
      if (n > mejor) mejor = n;
    }
    return mejor;
  }

  /* El mínimo semántico sale de la figura y de su subpatrón documentado, no de
     un número redondo, y NO se rebaja porque algo quede oculto. */
  function minimoSemantico(k) {
    if (k.especial) return k.especial.minimo;
    return Math.max(2, Math.min(CFG.EVIDENCIA.minimo_puntos, k.minimoPosible || k.puntos.length));
  }

  /* P1-01. Un punto de figura que NO se dibuja no puede sostener nada. El
     dibujante recorre las estrellas del catálogo; el motor recorría todos los
     puntos de la figura, incluidos los que no tienen estrella asociada porque
     su estrella queda por debajo de la magnitud límite del paquete. Desde R02.1
     esos puntos quedan fuera de TODA evidencia: no se cuentan, no suman al
     mínimo, no entran en el trozo seguido y no se marcan en pantalla.

     La figura aprobada se sigue dibujando entera: no se toca ningún master
     para esconder el hueco. Lo que cambia es qué puede sostener una
     identificación. */
  function esObservable(q) { return q.estrella !== null && q.estrella !== undefined; }

  function construirCielo(datos) {
    var estrellas = datos.estrellas.map(function (e, i) {
      return { i: i, ra: e[0], dec: e[1], mag: e[2], ci: e[3],
               datos: e[4] || null, v: aDireccion(e[0], e[1]) };
    });
    var via = (datos.via_lactea || []).map(function (t) {
      return t.map(function (p) { return { v: aDireccion(p[0], p[1]), n: p[2] }; });
    });
    var cons = datos.constelaciones.map(function (k) {
      var puntos = k.puntos.map(function (p) {
        var q = { ra: p[0], dec: p[1], estrella: p[2], v: aDireccion(p[0], p[1]) };
        q.observable = esObservable(q);
        return q;
      });
      var vecinos = puntos.map(function () { return []; });
      k.aristas.forEach(function (a) {
        if (vecinos[a[0]].indexOf(a[1]) < 0) vecinos[a[0]].push(a[1]);
        if (vecinos[a[1]].indexOf(a[0]) < 0) vecinos[a[1]].push(a[0]);
      });
      /* Adyacencia SÓLO entre puntos observables. No se puentea por encima de
         un punto que no se dibuja: si dos estrellas sólo estaban unidas a
         través de él, para la evidencia no están unidas. */
      var vecinosObs = puntos.map(function (q, i) {
        if (!q.observable) return [];
        return vecinos[i].filter(function (j) { return puntos[j].observable; });
      });
      var observables = [];
      puntos.forEach(function (q, i) { if (q.observable) observables.push(i); });
      var o = {
        abbr: k.abbr, zona: k.zona, latin: k.latin, genitivo: k.genitivo,
        nombre_es: k.nombre_es, nombre_en: k.nombre_en,
        etiqueta: aDireccion(k.etiqueta[0], k.etiqueta[1]),
        puntos: puntos, aristas: k.aristas, vecinos: vecinos,
        vecinosObs: vecinosObs, observables: observables,
        no_observables: puntos.length - observables.length,
        especial: k.especial || null, relacion: k.relacion_con_orion || null,
        area: k.area_grados_cuadrados, n6: k.n6,
        /* Rasgos medidos, ancla, salto y pista vienen DE LOS DATOS: la interfaz
           no los escribe a mano ni los deduce al vuelo. */
        rasgos: k.rasgos || null, ancla: k.ancla || null,
        salto: k.salto || null, pista: k.pista || null,
        /* R03: vecindad medida, rutas y frases de rasgos vienen de los datos */
        vecinas: k.vecinas || [], region: k.region || null, zodiacal: !!k.zodiacal,
        mes: k.mes || null, significado_es: k.significado_es || null,
        significado_en: k.significado_en || null,
        rasgos_frase_es: k.rasgos_frase_es || null, rasgos_frase_en: k.rasgos_frase_en || null,
        puntos_no_observables: k.puntos_no_observables || []
      };
      /* Mayor trozo seguido que de verdad cabe en la apertura: a una figura
         cuyos trazos miden más que la zona no se le pueden exigir tres. */
      o.minimoPosible = trozoQueCabe(o);
      return o;
    });
    return {
      meta: datos, estrellas: estrellas, via: via, constelaciones: cons,
      porAbbr: cons.reduce(function (m, c) { m[c.abbr] = c; return m; }, {})
    };
  }

  function trozoQueCabe(k) {
    var a = CFG.EVIDENCIA.apertura_radio_grados, mejor = 1;
    function cabe(idxs) {
      var s = { x: 0, y: 0, z: 0 };
      idxs.forEach(function (i) { s.x += k.puntos[i].v.x; s.y += k.puntos[i].v.y; s.z += k.puntos[i].v.z; });
      var c = unitario(s);
      return idxs.every(function (i) { return anguloEntre(c, k.puntos[i].v) <= a; });
    }
    for (var i = 0; i < k.puntos.length; i++) {
      if (!k.puntos[i].observable) continue;
      var vs = (k.vecinosObs || k.vecinos)[i] || [];
      for (var x = 0; x < vs.length; x++) {
        var j = vs[x];
        if (j < i) continue;
        if (cabe([i, j]) && mejor < 2) mejor = 2;
        var ws = (k.vecinosObs || k.vecinos)[j] || [];
        for (var y = 0; y < ws.length; y++) {
          var l = ws[y];
          if (l === i) continue;
          if (cabe([i, j, l])) return 3;
        }
      }
    }
    return Math.max(2, mejor);
  }

  /* ---------------------------------------------------- examinar ---------- */
  function examinar(cielo, cam, W, H, ocluidas, p, excluir) {
    var base = baseCamara(cam);
    var c = p || centroVista(W, H);
    var dir = dePantalla(c, cam, W, H, base);
    var zonas = ocluidas || [];
    var detalle = [];

    cielo.constelaciones.forEach(function (k) {
      var objetivo = k.especial
        ? k.especial.indices.map(function (i) { return k.puntos[i]; })
        : k.puntos;
      var dentroIdx = [], puntosDentro = [], visibles = 0, sx = 0, sy = 0;
      var detras = 0, fuera = 0, tapados = 0, ocultosEnZona = 0, noRenderizados = 0;
      objetivo.forEach(function (q, i) {
        /* P1-01: sin estrella dibujada no hay nada que observar. Se cuenta
           aparte para que el recorte quede declarado, no escondido. */
        if (!q.observable) { noRenderizados++; return; }
        var s = aPantalla(q.v, cam, W, H, base);
        var dentroDelCono = enEvidencia(dir, q.v);
        if (!esVisible(s, W, H, zonas)) {
          if (!s.delante) detras++;
          else if (!(s.x >= 0 && s.x <= W && s.y >= 0 && s.y <= H)) fuera++;
          else tapados++;
          if (dentroDelCono) ocultosEnZona++;
          return;
        }
        visibles++;
        if (dentroDelCono) {
          dentroIdx.push(k.especial ? k.especial.indices[i] : i);
          puntosDentro.push(q); sx += s.x; sy += s.y;
        }
      });
      var dentro = dentroIdx.length;
      var minimo = minimoSemantico(k);
      var trozo = k.especial ? dentro : mayorTrozo(k, dentroIdx);
      /* Hacia dónde queda este patrón respecto a lo señalado, en el cielo. Se
         usa para poder describirlo sin nombrarlo y SIN píxeles. */
      var centroDentro = null;
      if (dentro) {
        var s3 = { x: 0, y: 0, z: 0 };
        puntosDentro.forEach(function (q) { s3.x += q.v.x; s3.y += q.v.y; s3.z += q.v.z; });
        centroDentro = unitario(s3);
      }
      detalle.push({
        abbr: k.abbr, zona: k.zona, dentro: dentro, visibles: visibles,
        total: objetivo.length, observables: objetivo.length - noRenderizados,
        minimo_semantico: minimo, mayor_trozo: trozo,
        puntos_dentro: puntosDentro,
        octante: centroDentro ? octanteCeleste(dir, centroDentro) : null,
        separacion_grados: centroDentro ? Math.round(anguloEntre(dir, centroDentro) * 10) / 10 : null,
        ocultos: { detras_de_la_camara: detras, fuera_de_pantalla: fuera,
                   tras_interfaz: tapados, en_la_zona: ocultosEnZona,
                   no_renderizados: noRenderizados },
        /* Hace falta el mínimo del patrón, SEGUIDO y observable. Ocultar parte
           de la figura no rebaja lo que hace falta para nombrarla, y recortarla
           con el borde de la pantalla tampoco la vuelve más clara. */
        sustenta: visibles >= minimo && trozo >= minimo,
        excluida: !!(excluir && excluir[k.abbr])
      });
    });

    /* C3D-02. Gana quien tenga más puntos de figura dentro de la MISMA región
       del cielo, con una ventaja clara. Si no la hay, NO se resuelve: ni por
       proximidad en píxeles —que cambiaría con el tamaño de la pantalla— ni de
       ninguna otra forma. Se dice que hay varios y se deja elegir. */
    var cand = detalle.filter(function (d) { return !d.excluida && d.sustenta; })
      .sort(function (a, b) { return b.dentro - a.dentro; });

    var mejor = null, resultado = 'ninguno', plausibles = [];
    if (cand.length === 1) { mejor = cand[0]; resultado = 'unico'; }
    else if (cand.length > 1) {
      if (cand[0].dentro >= CFG.EVIDENCIA.ventaja_minima * cand[1].dentro) {
        mejor = cand[0]; resultado = 'unico';
      } else {
        plausibles = cand.filter(function (d) {
          return d.dentro * CFG.EVIDENCIA.ventaja_minima >= cand[0].dentro;
        });
        resultado = 'ambiguo';
      }
    }
    return {
      coincide: !!mejor, resultado: resultado,
      mejor: mejor ? { abbr: mejor.abbr, zona: mejor.zona, dentro: mejor.dentro,
                       visibles: mejor.visibles, total: mejor.total,
                       minimo_semantico: mejor.minimo_semantico, mayor_trozo: mejor.mayor_trozo,
                       puntos_dentro: mejor.puntos_dentro, octante: mejor.octante,
                       especial: !!(cielo.porAbbr[mejor.abbr].especial) } : null,
      plausibles: plausibles.map(function (d) {
        return { abbr: d.abbr, dentro: d.dentro, octante: d.octante,
                 separacion_grados: d.separacion_grados };
      }),
      direccion: dir, punto: { x: c.x, y: c.y },
      apertura_grados: aperturaGrados(), apertura_radio_grados: aperturaRadioGrados(),
      evidencia_recortada: detalle.some(function (d) { return d.ocultos.en_la_zona > 0; }),
      recorte: detalle.filter(function (d) { return d.ocultos.en_la_zona > 0; })
        .map(function (d) {
          var o = d.ocultos;
          return { abbr: d.abbr, ocultos_en_la_zona: o.en_la_zona,
                   motivo: o.detras_de_la_camara ? 'detrás de la cámara'
                         : (o.tras_interfaz ? 'interfaz' : 'fuera de pantalla') };
        }),
      candidatas: cand.length, detalle: detalle
    };
  }

  function estrellaEn(cielo, cam, W, H, p, tol, ocluidas) {
    var base = baseCamara(cam), zonas = ocluidas || [];
    var mejor = null, dm = tol || CFG.TOLERANCIA_ENTRADA_PX;
    cielo.estrellas.forEach(function (e) {
      var s = aPantalla(e.v, cam, W, H, base);
      if (!esVisible(s, W, H, zonas)) return;
      var d = Math.sqrt(Math.pow(s.x - p.x, 2) + Math.pow(s.y - p.y, 2));
      if (d <= dm) { dm = d; mejor = e; }
    });
    return mejor;
  }

  var API = {
    GRADO: GRADO, limitar: limitar,
    aDireccion: aDireccion, aCoordenadas: aCoordenadas,
    punto: punto, cruz: cruz, unitario: unitario, anguloEntre: anguloEntre,
    baseCamara: baseCamara, escala: escala, aPantalla: aPantalla, dePantalla: dePantalla,
    centroVista: centroVista, camaraAmpliada: camaraAmpliada, camaraQueLleva: camaraQueLleva,
    ajustarCamara: ajustarCamara,
    aperturaGrados: aperturaGrados, aperturaRadioGrados: aperturaRadioGrados,
    enEvidencia: enEvidencia, contornoEvidencia: contornoEvidencia, esVisible: esVisible,
    mayorTrozo: mayorTrozo, minimoSemantico: minimoSemantico, trozoQueCabe: trozoQueCabe,
    octanteCeleste: octanteCeleste, esObservable: esObservable,
    saltoInverso: saltoInverso,
    construirCielo: construirCielo, examinar: examinar, estrellaEn: estrellaEn
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  if (g) g.IG_ESFERA = API;
})(typeof window !== 'undefined' ? window : null);
