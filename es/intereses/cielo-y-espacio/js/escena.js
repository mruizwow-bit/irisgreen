/* Cielo 3D · piloto R01 · DIBUJO.

   Canvas 2D con geometría 3D real: la cámara es una dirección de mirada y un
   campo de visión, y cada estrella es una dirección unitaria proyectada en
   perspectiva. No se usa WebGL —ni hace falta para 1.660 puntos—, así que no
   hay contexto que perder ni fallback prometido que no viaje. La decisión y su
   coste están en documentacion/DECISIONES.md.

   No hay horizonte: sin fecha, hora ni lugar no existe una transformación
   coherente que lo justifique, y no se inventa. Es una vista celeste curada. */
(function (g) {
  'use strict';
  var CFG = g.IG_CONFIG, E = g.IG_ESFERA;

  function colorPorBV(ci) {
    if (ci === null || ci === undefined) return '#DCE8F2';
    if (ci < -0.1) return '#D6E6FF';
    if (ci < 0.3) return '#E6EEFF';
    if (ci < 0.6) return '#F2EFE2';
    if (ci < 1.0) return '#F7E9C8';
    if (ci < 1.5) return '#F2DEC0';
    return '#EFCBB4';
  }
  /* El tamaño sale de la magnitud y del campo de visión: al acercarse, las
     estrellas no se hinchan sin medida, sólo se separan. */
  function radio(mag, fov) {
    var t = (CFG.ESTRELLA.mag_max - mag) / (CFG.ESTRELLA.mag_max - CFG.ESTRELLA.mag_min);
    t = Math.max(0, Math.min(1, t));
    var base = CFG.ESTRELLA.radio_min + Math.pow(t, 1.5) * (CFG.ESTRELLA.radio_max - CFG.ESTRELLA.radio_min);
    var z = Math.max(0.8, Math.min(1.8, Math.pow(55 / fov, 0.35)));
    return base * z;
  }

  function clamp01(x) { return Math.max(0, Math.min(1, x)); }
  function rgbHex(h) {
    h = (h || '#DCE8F2').replace('#','');
    return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
  }
  /* H aquí es la altura del CIELO QUE SE VE, no la del lienzo: desde R04 la
     tira de controles tapa la franja de abajo, y si el suelo y la extinción se
     calcularan sobre el lienzo entero quedarían debajo de la tira. Se verían en
     una captura del lienzo y no se verían en el teléfono. */
  function estiloAtmosferico(ci, y, H) {
    var cfg=(g.IG_R04_CIELO&&g.IG_R04_CIELO.profundidad_aire)||{inicio_rel_y:.56,atenuacion_max:.55,tinte_calido:'#F0C6A0'};
    var t=clamp01((y/H-cfg.inicio_rel_y)/(1-cfg.inicio_rel_y));
    var a=1-cfg.atenuacion_max*t;
    var c=rgbHex(colorPorBV(ci)), w=rgbHex(cfg.tinte_calido);
    var m=.48*t;
    return { color:'rgb('+Math.round(c[0]*(1-m)+w[0]*m)+','+Math.round(c[1]*(1-m)+w[1]*m)+','+Math.round(c[2]*(1-m)+w[2]*m)+')', alpha:a, t:t };
  }
  /* Hv es el alto del cielo visible y Hl el del lienzo: el suelo arranca dentro
     de lo que se ve y se prolonga hasta abajo, por detrás de la tira. */
  function dibujarSuelo(ctx,W,Hv,Hl) {
    Hl = Hl || Hv;
    var cfg=(g.IG_R04_CIELO&&g.IG_R04_CIELO.suelo_perceptual)||{alto_rel:.115};
    var y0=Hv*(1-cfg.alto_rel);
    ctx.save(); ctx.fillStyle='#020509'; ctx.beginPath(); ctx.moveTo(0,Hl); ctx.lineTo(0,y0+Hv*.012);
    ctx.bezierCurveTo(W*.18,y0-Hv*.005,W*.33,y0+Hv*.014,W*.5,y0+Hv*.004);
    ctx.bezierCurveTo(W*.67,y0-Hv*.008,W*.82,y0+Hv*.012,W,y0-Hv*.002);
    ctx.lineTo(W,Hl); ctx.closePath(); ctx.fill(); ctx.restore();
  }

  /* Registro de LO ÚLTIMO QUE SE HA DIBUJADO. No decide nada: existe para que
     se pueda comprobar desde fuera que lo que se pinta es lo mismo que sostuvo
     la decisión, en vez de fiarse de que sí. */
  var ultimo = { figuras: [], marcadas: [], puntos: [], centro: false };
  function dibujar(ctx, o) {
    ultimo = { figuras: [], marcadas: [], puntos: [], centro: false };
    var cielo = o.cielo, cam = o.camara, W = o.ancho, H = o.alto;
    /* alto del cielo visible: el lienzo menos lo que tapa la tira */
    var Hv = Math.max(80, H - (o.margenInferior || 0));
    var base = E.baseCamara(cam);
    ctx.save();
    ctx.setTransform(o.dpr, 0, 0, o.dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    var cieloGrad = ctx.createLinearGradient(0, 0, 0, Hv);
    cieloGrad.addColorStop(0, '#071321'); cieloGrad.addColorStop(0.58, '#0B1A2B'); cieloGrad.addColorStop(1, '#151A21');
    ctx.fillStyle = cieloGrad; ctx.fillRect(0, 0, W, H);
    var aire = ctx.createLinearGradient(0, Hv * 0.48, 0, Hv);
    aire.addColorStop(0, 'rgba(126,96,66,0)'); aire.addColorStop(1, 'rgba(126,96,66,0.16)');
    ctx.fillStyle = aire; ctx.fillRect(0, Hv * 0.48, W, H - Hv * 0.48);

    /* Vía Láctea: nube de densidad del catálogo, no una cinta inventada. Muy
       tenue a propósito: tiene que sugerir dónde se espesa el cielo sin tapar
       ni una estrella, porque las estrellas son lo que hay que reconocer. */
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    var rVia = 5 + 10 * Math.min(1, 55 / cam.fov);
    cielo.via.forEach(function (tramo) {
      tramo.forEach(function (p) {
        var s = E.aPantalla(p.v, cam, W, H, base);
        if (!s.delante || s.x < -40 || s.x > W + 40 || s.y < -40 || s.y > H + 40) return;
        ctx.globalAlpha = 0.0075 * (4 - p.n);
        ctx.fillStyle = '#35506E';
        ctx.beginPath();
        ctx.arc(s.x, s.y, rVia, 0, Math.PI * 2);
        ctx.fill();
      });
    });
    ctx.restore();

    /* Estrellas. */
    cielo.estrellas.forEach(function (e) {
      var s = E.aPantalla(e.v, cam, W, H, base);
      if (!s.delante || s.x < -8 || s.x > W + 8 || s.y < -8 || s.y > H + 8) return;
      var r = radio(e.mag, cam.fov);
      var atm = estiloAtmosferico(e.ci, s.y, Hv);
      ctx.globalAlpha = Math.max(0.5, Math.min(1, 1.2 - (e.mag - CFG.ESTRELLA.mag_min) / 10)) * atm.alpha;
      ctx.fillStyle = atm.color;
      ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2); ctx.fill();
      if (e.mag <= 2.5) {                       /* halo sobrio de las más claras */
        ctx.globalAlpha = 0.14;
        ctx.beginPath(); ctx.arc(s.x, s.y, r * 2.6, 0, Math.PI * 2); ctx.fill();
      }
    });
    ctx.globalAlpha = 1;

    /* Figuras: sólo la activa y, si se pide, la capa de hallazgos. Nada se
       dibuja antes de encontrarlo. */
    cielo.constelaciones.forEach(function (k) {
      if (o.estados[k.abbr] !== 'revelada') return;
      var activa = (o.activa === k.abbr);
      if (!activa && !o.capaHallazgos) return;
      ultimo.figuras.push(k.abbr);
      ctx.strokeStyle = activa ? 'rgba(238,244,248,0.78)' : 'rgba(238,244,248,0.28)';
      ctx.lineWidth = activa ? 1.5 : 1;
      ctx.beginPath();
      k.aristas.forEach(function (a) {
        var s1 = E.aPantalla(k.puntos[a[0]].v, cam, W, H, base);
        var s2 = E.aPantalla(k.puntos[a[1]].v, cam, W, H, base);
        if (!s1.delante || !s2.delante) return;
        ctx.moveTo(s1.x, s1.y); ctx.lineTo(s2.x, s2.y);
      });
      ctx.stroke();
      if (activa && k.etiqueta) {
        var se = E.aPantalla(k.etiqueta, cam, W, H, base);
        if (se.delante && se.x > 0 && se.x < W && se.y > 0 && se.y < H) {
          ctx.fillStyle = 'rgba(225,233,239,0.90)';
          ctx.font = '13px "Atkinson Hyperlegible", system-ui, sans-serif';
          ctx.textAlign = 'center'; ctx.shadowColor='rgba(0,0,0,.75)'; ctx.shadowBlur=4;
          ctx.fillText(o.idioma === 'es' ? k.nombre_es : k.nombre_en, se.x, se.y);
          ctx.shadowBlur=0;
        }
      }
    });

    /* Marcas de lo que se ha tomado: las mismas que sustentaron la evidencia. */
    var marcadas = o.marcadas || [];
    if (marcadas.length > 1) {
      ctx.strokeStyle = 'rgba(195,184,255,0.55)'; ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 5]);
      ctx.beginPath();
      marcadas.forEach(function (p, i) {
        var s = E.aPantalla(p.v, cam, W, H, base);
        if (!s.delante) return;
        if (i === 0) ctx.moveTo(s.x, s.y); else ctx.lineTo(s.x, s.y);
      });
      ctx.stroke(); ctx.setLineDash([]);
    }
    marcadas.forEach(function (p) {
      var s = E.aPantalla(p.v, cam, W, H, base);
      if (!s.delante) return;
      ultimo.marcadas.push(Math.round(p.ra * 1e4) / 1e4 + '/' + Math.round(p.dec * 1e4) / 1e4);
      ctx.strokeStyle = '#C3B8FF'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.arc(s.x, s.y, 7.5, 0, Math.PI * 2); ctx.stroke();
    });

    /* Radiantes y estrellas con planetas ya encontrados: un aro y su nombre.
       Lo que no se ha encontrado NO se dibuja. */
    (o.puntosCapa || []).forEach(function (q) {
      var s = E.aPantalla(q.v, cam, W, H, base);
      if (!s.delante) return;
      ultimo.puntos.push(q.nombre || '·');
      ctx.strokeStyle = q.hallado ? 'rgba(150,210,190,0.85)' : '#C3B8FF';
      ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(s.x, s.y, 9, 0, Math.PI * 2); ctx.stroke();
      if (q.tipo === 'radiante') {
        /* el radiante se marca con unas rayas que salen de él: así se ve que es
           el punto del que parecen venir los meteoros */
        for (var a2 = 0; a2 < 4; a2++) {
          var th = a2 * Math.PI / 2 + Math.PI / 4;
          ctx.beginPath();
          ctx.moveTo(s.x + Math.cos(th) * 12, s.y + Math.sin(th) * 12);
          ctx.lineTo(s.x + Math.cos(th) * 20, s.y + Math.sin(th) * 20);
          ctx.stroke();
        }
      }
      if (q.nombre) {
        ctx.fillStyle = 'rgba(201,213,221,0.9)';
        ctx.font = '12px "Atkinson Hyperlegible", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(q.nombre, s.x, s.y - 16);
      }
    });

    if (o.estrellaSeleccionada) {
      var ss = E.aPantalla(o.estrellaSeleccionada.v, cam, W, H, base);
      if (ss.delante) {
        ctx.strokeStyle = '#C3B8FF'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(ss.x, ss.y, 10, 0, Math.PI * 2); ctx.stroke();
      }
    }

    /* Contorno exacto de la región de evidencia: lo que se ve es lo que
       cuenta, también fuera del centro, donde el cono no es un círculo. */
    function contorno(dir, color, guiones) {
      var pts = E.contornoEvidencia(dir, cam, W, H, 56).filter(function (p) { return p.delante; });
      if (pts.length < 8) return;
      ctx.strokeStyle = color; ctx.lineWidth = 1.5;
      if (guiones) ctx.setLineDash(guiones);
      ctx.beginPath();
      pts.forEach(function (p, i) { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
      ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);
    }
    /* R04.6 · EL CÍRCULO GRANDE YA NO SE DIBUJA.
       Dibujaba el cono de evidencia alrededor de donde habías señalado: una
       circunferencia enorme y clara sobre el cielo entero, que se quedaba ahí
       y mareaba. María lo dijo y lleva razón.
       Lo que se pierde: ya no se ve en pantalla cuánta zona se ha examinado.
       Ese dato NO desaparece, sigue dicho con palabras y con número en la
       ficha, en «Zona examinada». La marca sigue existiendo como estado
       —es lo que decide qué se examina—, sólo que no se pinta.
       La marca del CENTRO sí se queda: es la ayuda del teclado, aparece sólo
       al navegar con flechas, y sin ella no se sabría dónde va a caer Intro.
       Lo guarda N07 en pruebas/navegador.js. */
    if (o.centro) {
      ultimo.centro = true;
      var dirC = E.dePantalla(E.centroVista(W, H), cam, W, H, base);
      contorno(dirC, 'rgba(195,184,255,0.55)', [5, 6]);
      ctx.strokeStyle = 'rgba(195,184,255,0.55)'; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 6, H / 2); ctx.lineTo(W / 2 + 6, H / 2);
      ctx.moveTo(W / 2, H / 2 - 6); ctx.lineTo(W / 2, H / 2 + 6);
      ctx.stroke();
    }
    /* R04: suelo perceptual genérico. Es encuadre, no horizonte local calculado. */
    dibujarSuelo(ctx, W, Hv, H);
    ctx.restore();
  }

  g.IG_ESCENA = { dibujar: dibujar, colorPorBV: colorPorBV, radio: radio,
                  ultimoDibujo: function () { return ultimo; } };
})(window);
