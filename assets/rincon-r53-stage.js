/* R53-CLAUDE · Salas inmersivas · escenario compartido.
   Lo comun: contexto, camara, paralaje, ciclo de vida, gestor de calidad,
   preferencias de movimiento y adaptador de audio.
   Lo propio de cada sala (geometria, movimiento, luz e interaccion) vive en su
   modulo. Aqui no hay ninguna decision visual de sala. */
(function (window, document) {
  'use strict';

  /* ------------------------------------------------------------ matrices */
  function ident() {
    return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
  }
  function perspective(out, fovy, aspect, near, far) {
    var f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
    out[0]=f/aspect; out[1]=0; out[2]=0; out[3]=0;
    out[4]=0; out[5]=f; out[6]=0; out[7]=0;
    out[8]=0; out[9]=0; out[10]=(far+near)*nf; out[11]=-1;
    out[12]=0; out[13]=0; out[14]=2*far*near*nf; out[15]=0;
    return out;
  }
  function lookAt(out, ex, ey, ez, cx, cy, cz) {
    var zx=ex-cx, zy=ey-cy, zz=ez-cz;
    var l=Math.hypot(zx,zy,zz)||1; zx/=l; zy/=l; zz/=l;
    /* x = normalizar(producto vectorial de arriba por z), con arriba = (0,1,0) */
    var xx = zz, xy = 0, xz = -zx;
    l = Math.hypot(xx,xy,xz)||1; xx/=l; xy/=l; xz/=l;
    var yx=zy*xz-zz*xy, yy=zz*xx-zx*xz, yz=zx*xy-zy*xx;
    out[0]=xx; out[1]=yx; out[2]=zx; out[3]=0;
    out[4]=xy; out[5]=yy; out[6]=zy; out[7]=0;
    out[8]=xz; out[9]=yz; out[10]=zz; out[11]=0;
    out[12]=-(xx*ex+xy*ey+xz*ez);
    out[13]=-(yx*ex+yy*ey+yz*ez);
    out[14]=-(zx*ex+zy*ey+zz*ez);
    out[15]=1;
    return out;
  }
  function mul(out, a, b) {
    for (var i = 0; i < 4; i++) {
      var ai0=a[i], ai1=a[i+4], ai2=a[i+8], ai3=a[i+12];
      out[i]    = ai0*b[0]  + ai1*b[1]  + ai2*b[2]  + ai3*b[3];
      out[i+4]  = ai0*b[4]  + ai1*b[5]  + ai2*b[6]  + ai3*b[7];
      out[i+8]  = ai0*b[8]  + ai1*b[9]  + ai2*b[10] + ai3*b[11];
      out[i+12] = ai0*b[12] + ai1*b[13] + ai2*b[14] + ai3*b[15];
    }
    return out;
  }

  /* ------------------------------------------------------------ ayudas GL */
  function shader(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      var log = gl.getShaderInfoLog(s);
      gl.deleteShader(s);
      throw new Error('shader: ' + log);
    }
    return s;
  }
  function program(gl, vs, fs) {
    var p = gl.createProgram();
    gl.attachShader(p, shader(gl, gl.VERTEX_SHADER, vs));
    gl.attachShader(p, shader(gl, gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      throw new Error('link: ' + gl.getProgramInfoLog(p));
    }
    var cache = {};
    return {
      p: p,
      use: function () { gl.useProgram(p); return this; },
      u: function (n) { if (!(n in cache)) cache[n] = gl.getUniformLocation(p, n); return cache[n]; },
      a: function (n) { return gl.getAttribLocation(p, n); },
      free: function () { try { gl.deleteProgram(p); } catch (_) {} }
    };
  }
  function buffer(gl, data, usage) {
    var b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage || gl.STATIC_DRAW);
    return b;
  }
  /* cuadrado unidad, base de todos los cuerpos que se dibujan como lamina */
  function unitQuad(gl) {
    return buffer(gl, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]));
  }
  function hash(i, s) {
    var x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
    return x - Math.floor(x);
  }


  /* --------------------------------------------- arquitectura compartida
     Las instalaciones de referencia no flotan en el vacio: tienen suelo, y ese
     suelo devuelve la imagen. Aqui el suelo es una superficie real con reflejo,
     y el fondo es un muro que lleva luz y color en vez de ser negro. */
  var FLOOR_Y = -1.70;

  var MIRROR_GLSL = [
    'uniform vec2 uFlip;',  /* x: 1 escena, -1 reflejo · y: altura del suelo */
    'vec3 igFlip(vec3 p){',
    ' float m = step(uFlip.x, -0.5);',
    ' return vec3(p.x, mix(p.y, 2.0 * uFlip.y - p.y, m), p.z);',
    '}'
  ].join('\n');

  var FLOOR_VS = [
    '#version 300 es',
    'in vec2 aCorner;',
    'uniform mat4 uProj; uniform mat4 uView; uniform float uY; uniform vec2 uSpan;',
    'out vec3 vW; out float vDepth;',
    'void main(){',
    ' float z = mix(uSpan.x, uSpan.y, aCorner.y * 0.5 + 0.5);',
    ' float x = aCorner.x * (-z) * 2.2;',
    ' vec3 w = vec3(x, uY, z);',
    ' vec4 c = uView * vec4(w, 1.0);',
    ' vW = w; vDepth = -c.z;',
    ' gl_Position = uProj * c;',
    '}'
  ].join('\n');

  var FLOOR_FS = [
    '#version 300 es',
    'precision highp float;',
    'in vec3 vW; in float vDepth;',
    'uniform vec3 uTint; uniform float uFade; uniform float uGloss;',
    'out vec4 oCol;',
    'void main(){',
    /* el material del suelo: oscuro, pulido y con una veladura que crece con la distancia */
    ' float far = clamp(1.0 - vDepth / 46.0, 0.0, 1.0);',
    ' float sheen = pow(clamp(1.0 - abs(vW.x) / (vDepth * 1.6 + 0.001), 0.0, 1.0), 2.2);',
    ' vec3 col = uTint * (0.30 + 0.55 * far) + uTint * sheen * 0.35;',
    ' col += uTint * 2.2 * pow(1.0 - far, 6.0);',
    /* opacidad baja cerca: ahi el reflejo manda. Al fondo el suelo se cierra */
    ' float a = mix(1.0 - uGloss, 0.92, 1.0 - far);',
    ' oCol = vec4(col * uFade, a * uFade);',
    '}'
  ].join('\n');

  var WALL_VS = '#version 300 es\nin vec2 aCorner; out vec2 vUv; void main(){ vUv=aCorner; gl_Position=vec4(aCorner,0.9995,1.0); }';
  var WALL_FS = [
    '#version 300 es',
    'precision highp float;',
    'in vec2 vUv; uniform vec3 uA; uniform vec3 uB; uniform vec3 uGlow; uniform vec2 uGlowAt;',
    'uniform float uFade; out vec4 oCol;',
    'void main(){',
    ' float d = length((vUv - vec2(0.0, 0.10)) * vec2(0.80, 1.0));',
    ' vec3 col = mix(uB, uA, smoothstep(0.05, 1.45, d));',
    ' col += uGlow * (1.0 - smoothstep(0.0, 1.05, length(vUv - uGlowAt)));',
    ' oCol = vec4(col * uFade, 1.0);',
    '}'
  ].join('\n');

  var floorProg = null, wallProg = null, archQuad = null, archGl = null;
  function archInit(gl) {
    if (archGl === gl && floorProg) return;
    archGl = gl;
    floorProg = program(gl, FLOOR_VS, FLOOR_FS);
    wallProg = program(gl, WALL_VS, WALL_FS);
    archQuad = unitQuad(gl);
  }
  /* muro de fondo: lleva el color de la sala, nunca es negro plano */
  function drawWall(gl, ctx, fade, o) {
    archInit(gl);
    wallProg.use();
    gl.bindBuffer(gl.ARRAY_BUFFER, archQuad);
    var a = wallProg.a('aCorner');
    gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0); gl.vertexAttribDivisor(a, 0);
    gl.uniform3fv(wallProg.u('uA'), o.a);
    gl.uniform3fv(wallProg.u('uB'), o.b);
    gl.uniform3fv(wallProg.u('uGlow'), o.glow || [0, 0, 0]);
    gl.uniform2fv(wallProg.u('uGlowAt'), o.glowAt || [-0.4, 0.45]);
    gl.uniform1f(wallProg.u('uFade'), fade);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  /* suelo: se dibuja entre el reflejo y la escena */
  function drawFloor(gl, ctx, fade, o) {
    archInit(gl);
    floorProg.use();
    gl.bindBuffer(gl.ARRAY_BUFFER, archQuad);
    var a = floorProg.a('aCorner');
    gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0); gl.vertexAttribDivisor(a, 0);
    gl.uniformMatrix4fv(floorProg.u('uProj'), false, ctx.proj);
    gl.uniformMatrix4fv(floorProg.u('uView'), false, ctx.view);
    gl.uniform1f(floorProg.u('uY'), FLOOR_Y);
    gl.uniform2f(floorProg.u('uSpan'), -1.0, -52.0);
    gl.uniform3fv(floorProg.u('uTint'), o.tint);
    gl.uniform1f(floorProg.u('uGloss'), o.gloss == null ? 0.72 : o.gloss);
    gl.uniform1f(floorProg.u('uFade'), fade);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  /* Salas que cargan recursos en diferido avisan por aqui cuando el recurso
     ya esta listo. Hace falta porque SIN_MOVIMIENTO pinta una sola vez. */
  var vivas = [];
  function repintarVivas() {
    for (var i = 0; i < vivas.length; i++) { try { vivas[i](); } catch (_) {} }
  }

  var GL = {
    repintar: repintarVivas,
    program: program, buffer: buffer, unitQuad: unitQuad,
    hash: hash, ident: ident, perspective: perspective, lookAt: lookAt, mul: mul,
    MIRROR_GLSL: MIRROR_GLSL, FLOOR_Y: FLOOR_Y,
    drawWall: drawWall, drawFloor: drawFloor
  };

  /* --------------------------------------------------- estado de movimiento */
  var MOTION = ['normal', 'reducido', 'quieto'];
  function systemReduced() {
    try {
      if (window.IGPreferences && window.IGPreferences.system && window.IGPreferences.system().reducedMotion) return true;
      if (window.IGPreferences && window.IGPreferences.get && window.IGPreferences.get().motion) return true;
    } catch (_) {}
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) {}
    return false;
  }

  /* ------------------------------------------------------------- registro */
  var ROOMS = [];
  function register(room) { ROOMS.push(room); return room; }
  function rooms() { return ROOMS.slice(); }
  function byId(id) {
    for (var i = 0; i < ROOMS.length; i++) if (ROOMS[i].id === id) return ROOMS[i];
    return ROOMS[0] || null;
  }

  /* ------------------------------------------------------------ escenario */
  function create(host, opts) {
    opts = opts || {};
    var listeners = {};
    function emit(n, d) { (listeners[n] || []).forEach(function (f) { try { f(d); } catch (_) {} }); }

    var canvas = document.createElement('canvas');
    canvas.className = 'r53-room-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(canvas);

    var gl = null, c2d = null, tier = 'D';
    /* Gancho de QA: permite forzar el escalon para poder fotografiar C y D.
       No lo usa la interfaz; solo la bateria de pruebas. */
    var forced = opts.forceTier || window.IG_R53_FORCE_TIER || null;
    try {
      if (forced === 'C' || forced === 'D') throw new Error('tier forzado');
      gl = canvas.getContext('webgl2', {
        alpha: false, antialias: true, depth: true, premultipliedAlpha: false,
        powerPreference: 'low-power', preserveDrawingBuffer: false
      });
    } catch (_) { gl = null; }
    if (gl) tier = 'B';
    else {
      try { c2d = canvas.getContext('2d', { alpha: false }); } catch (_) { c2d = null; }
      tier = c2d ? (forced === 'D' ? 'D' : 'C') : 'D';
    }

    var room = null, built = false;
    var raf = 0, running = false, t0 = 0, accrued = 0, lastNow = 0;
    var fade = 0, fadeDir = 0, fadeFrom = 0;
    var destroyed = false;

    /* preferencia explicita de la persona; si no la hay, manda el sistema */
    var explicitMotion = opts.motion && MOTION.indexOf(opts.motion) >= 0 ? opts.motion : null;
    var motion = explicitMotion || (systemReduced() ? 'quieto' : 'normal');

    var level = opts.level === 'normal' ? 'normal' : 'suave';
    var quality = 1, fpsAcc = 0, fpsN = 0, downgrades = 0, lastMs = 0;

    var pointer = { x: 0, y: 0, active: false };
    var push = { x: 0, y: 0, t: -99 };
    var breath = 0.5;

    var proj = ident(), view = ident(), viewProj = ident();

    var ctx = {
      gl: null, w: 1, h: 1, dpr: 1, aspect: 1,
      t: 0, dt: 0, v: 0.5,
      motion: motion, speed: 1, drift: 1, quality: 1, level: level, tDrift: 0,
      pointer: pointer, push: push,
      pass: 'scene', floorY: FLOOR_Y,
      proj: proj, view: view, viewProj: viewProj,
      eye: [0, 0, 0],
      GL: GL
    };

    function sizeCanvas() {
      var r = host.getBoundingClientRect();
      var cap = tier === 'C' ? 1 : 1.25;
      var dpr = Math.min(window.devicePixelRatio || 1, cap);
      var w = Math.max(1, Math.round(r.width * dpr));
      var h = Math.max(1, Math.round(r.height * dpr));
      var BUDGET = 2400000, px = w * h;
      if (px > BUDGET) { var k = Math.sqrt(BUDGET / px); w = Math.max(1, Math.round(w * k)); h = Math.max(1, Math.round(h * k)); }
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        if (gl && room && room.gl && room.gl.resize) { try { room.gl.resize(gl, ctx); } catch (_) {} }
      }
      ctx.w = w; ctx.h = h; ctx.dpr = dpr; ctx.aspect = w / h;
    }

    /* Los atributos y sus divisores persisten en el contexto: si no se limpian
       entre salas, una sala hereda el estado de la anterior y dibuja mal o no
       dibuja. Se limpian antes de cada fotograma. */
    var MAXATTR = 8;
    function resetAttribs() {
      if (!gl) return;
      if (MAXATTR === 8) {
        try { MAXATTR = Math.min(16, gl.getParameter(gl.MAX_VERTEX_ATTRIBS) || 8); } catch (_) { MAXATTR = 8; }
      }
      for (var i = 0; i < MAXATTR; i++) {
        try { gl.disableVertexAttribArray(i); gl.vertexAttribDivisor(i, 0); } catch (_) {}
      }
    }

    function camera() {
      /* La mirada se desplaza muy poco: paralaje, no camara de juego.

         Ademas de responder al puntero, la sala tiene DERIVA PROPIA: sin ella,
         quien no mueve el raton ve una imagen fija con sonido encima, y una
         instalacion sensorial no es eso. La deriva se hace con sumas de senos
         de periodos inconmensurables (unos 170 y 440 segundos), de modo que no
         se repite de forma reconocible y nadie percibe un bucle.

         El avance en z es minimo y es lo que da profundidad viva: el paralaje
         entre los cuerpos cercanos y el fondo aparece solo, sin mover la
         cabeza. */
      /* la deriva usa un reloj YA escalado por el nivel de movimiento: si se
         escalara solo la amplitud, pasar a 'quieto' daria un tiron */
      var t = ctx.tDrift, d = ctx.drift > 0 ? 1 : 0;
      var dx = (Math.sin(t * 0.0370) * 0.62 + Math.sin(t * 0.01430 + 1.7) * 0.38) * 0.115 * d;
      var dy = (Math.sin(t * 0.0231 + 0.5) * 0.60 + Math.sin(t * 0.00910 + 2.3) * 0.40) * 0.062 * d;
      var dz = (Math.sin(t * 0.0117 + 1.1) * 0.70 + Math.sin(t * 0.00457 + 0.4) * 0.30) * 0.42 * d;
      var ax = (pointer.active ? pointer.x * 0.26 : 0) + dx;
      var ay = (pointer.active ? pointer.y * 0.16 : 0) + dy;
      if (ctx.motion !== 'normal') { ax *= 0.35; ay *= 0.35; }
      /* ENCUADRE VERTICAL. Con el angulo vertical fijo, una pantalla de movil
         deja un campo horizontal de unos 32 grados frente a los 87 de
         escritorio: se ve una rendija central y el techo ocupa media pantalla.
         Eso es la composicion de escritorio recortada, que es justo lo que no
         puede hacerse. En vertical se abre el angulo y se baja la mirada, de
         modo que la sala se recompone en vez de recortarse. */
      var vert = Math.max(0, Math.min(1, 1 - ctx.aspect));
      var fov = 1.02 + 0.62 * vert;
      var mira = ay * 2.0 + 1.35 - 1.62 * vert;
      perspective(proj, fov, ctx.aspect, 0.1, 120);
      /* en vertical la mirada se acerca, para que los cuerpos grandes entren en
         cuadro en vez de quedar recortados por los lados */
      lookAt(view, ax * 0.55, ay * 0.55 + 0.10 - 0.22 * vert, dz, ax * 3.2, mira, -8 + 2.6 * vert);
      mul(viewProj, proj, view);
      ctx.eye[0] = ax * 0.55; ctx.eye[1] = ay * 0.55 + 0.1 - 0.18 * vert; ctx.eye[2] = dz;
    }

    function ensureBuilt() {
      if (!room) return false;
      if (built) return true;
      if (tier === 'B' && room.gl) {
        try { room.gl.init(gl, ctx); built = true; }
        catch (e) {
          /* si el programa de la sala no compila, se baja de escalon en vez de
             decirle a la persona que su equipo no sirve */
          /* Y se DICE. Una bajada de escalon en silencio es lo peor de los dos
             mundos: la persona ve algo distinto y nadie se entera de por que.
             Ya me paso una vez con un shader que no compilaba. */
          var motivo = String(e && e.message || e);
          try {
            console.warn('[IrisGreen] Salas: el escalon B (WebGL2) no arranca en "' +
                         (room && room.id) + '". Se sirve el escalon siguiente. Motivo: ' + motivo);
          } catch (_) {}
          emit('tierdown', { from: 'B', reason: motivo });
          gl = null;
          try { c2d = canvas.getContext('2d', { alpha: false }); } catch (_) { c2d = null; }
          tier = c2d ? 'C' : 'D';
        }
      }
      if (!built && tier === 'C' && room.c2d) built = true;
      if (!built && room.still) { tier = 'D'; built = true; }
      if (!built && room.c2d) { tier = 'C'; built = true; }
      ctx.gl = gl;
      emit('tier', { tier: tier, room: room.id });
      return built;
    }

    function drawOnce(t) {
      sizeCanvas();
      camera();
      ctx.t = t;
      var dtd = t - (ctx._tp === undefined ? t : ctx._tp);
      ctx._tp = t;
      if (dtd < 0 || dtd > 0.5) dtd = 0;
      ctx.tDrift = (ctx.tDrift || 0) + dtd * ctx.drift;
      ctx.v = breath;
      ctx.level = level;
      ctx.quality = quality;
      ctx.speed = ctx.motion === 'normal' ? 1 : (ctx.motion === 'reducido' ? 0.34 : 0);
      ctx.drift = ctx.motion === 'normal' ? 1 : (ctx.motion === 'reducido' ? 0.22 : 0);
      if (tier === 'B' && gl) {
        gl.viewport(0, 0, ctx.w, ctx.h);
        resetAttribs();
        room.gl.draw(gl, ctx, fade);
      } else if (tier === 'C' && c2d && room.c2d) {
        room.c2d.draw(c2d, ctx, fade);
      } else if (c2d && room.still) {
        room.still.draw(c2d, ctx);
      }
    }

    function frame(now) {
      raf = 0;
      if (destroyed || !running) return;
      if (lastNow) {
        var dt = now - lastNow;
        /* El limite de 500 ms se comia justo los fotogramas que habia que
           detectar: en un equipo lento ningun fotograma entraba en la ventana,
           fpsN no llegaba nunca al umbral y la calidad no bajaba jamas. Cuanto
           peor iba, menos reaccionaba. Ahora solo se descartan los saltos que no
           son de dibujo (pestana oculta, equipo suspendido), y la ventana se
           cierra tambien por tiempo, no solo por numero de fotogramas: si cada
           uno tarda un segundo, esperar veinticuatro es esperar medio minuto. */
        if (dt > 0 && dt < 3000) { fpsAcc += dt; fpsN++; }
        if (fpsN >= 24 || (fpsN >= 3 && fpsAcc >= 1500)) {
          var avg = fpsAcc / fpsN; fpsAcc = 0; fpsN = 0; lastMs = Math.round(avg * 10) / 10;
          if (avg > 26 && quality > 0.3) {
            /* si va muy por encima del presupuesto se baja de golpe, no de
               escalon en escalon, para no tardar diez segundos en reaccionar */
            var paso = avg > 90 ? 0.35 : 0.18;
            quality = Math.max(0.3, quality - paso); downgrades++;
          } else if (avg < 13 && quality < 1) { quality = Math.min(1, quality + 0.12); }
          emit('quality', { quality: Math.round(quality * 100) / 100, ms: lastMs, downgrades: downgrades });
        }
      }
      lastNow = now;
      var t = accrued + (now - t0) / 1000;
      if (fadeDir === 1) { fade = Math.min(1, (now - fadeFrom) / 2400); if (fade >= 1) fadeDir = 0; }
      if (fadeDir === -1) {
        fade = Math.max(0, 1 - (now - fadeFrom) / 2400);
        if (fade <= 0.001) { running = false; emit('state', { state: 'stopped' }); return; }
      }
      drawOnce(t);
      raf = window.requestAnimationFrame(frame);
    }

    /* SIN_MOVIMIENTO: una imagen terminada y ni un solo fotograma mas */
    function paintStill() {
      if (!ensureBuilt()) return;
      fade = 1;
      if (tier === 'B' && gl && room.gl) { drawOnce(opts.stillTime == null ? 34 : opts.stillTime); }
      else {
        sizeCanvas();
        if (c2d && room.still) room.still.draw(c2d, ctx);
        else if (c2d && room.c2d) { ctx.speed = 0; ctx.drift = 0; room.c2d.draw(c2d, ctx, 1); }
      }
    }

    function stopRaf() { if (raf) { window.cancelAnimationFrame(raf); raf = 0; } }

    /* repintado a peticion de la sala, solo si no hay bucle en marcha */
    function repintarSiParado() {
      if (!built) return;
      if (running && raf && ctx.motion !== 'quieto') return;
      paintStill();
    }
    vivas.push(repintarSiParado);

    /* --------------------------------------- escuchar cambios de preferencia */
    var mq = null;
    function onPrefChange() {
      if (explicitMotion) return;
      var next = systemReduced() ? 'quieto' : 'normal';
      if (next !== motion) api.setMotion(next, true);
    }
    try {
      mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.addEventListener) mq.addEventListener('change', onPrefChange);
      else if (mq.addListener) mq.addListener(onPrefChange);
    } catch (_) {}
    var bodyObs = null;
    try {
      bodyObs = new MutationObserver(onPrefChange);
      bodyObs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    } catch (_) {}

    function onVis() {
      if (document.hidden) { if (running) { stopRaf(); } }
      else if (running && !raf && ctx.motion !== 'quieto') { t0 = performance.now() - accrued * 1000; raf = window.requestAnimationFrame(frame); }
    }
    document.addEventListener('visibilitychange', onVis);

    var api = {
      tier: function () { return tier; },
      supported: true,
      rooms: rooms,
      room: function () { return room; },

      setRoom: function (id) {
        var next = byId(id);
        if (!next || next === room) { if (next) { room = next; } return api; }
        if (room && built && tier === 'B' && gl && room.gl && room.gl.dispose) {
          try { room.gl.dispose(gl); } catch (_) {}
        }
        room = next; built = false;
        ensureBuilt();
        emit('room', { room: room.id, audio: room.audio || null });
        if (ctx.motion === 'quieto') paintStill();
        return api;
      },

      setMotion: function (m, fromSystem) {
        if (MOTION.indexOf(m) < 0) return api;
        if (!fromSystem) explicitMotion = m;
        motion = m; ctx.motion = m;
        emit('motion', { motion: m, explicit: !!explicitMotion });
        if (m === 'quieto') { stopRaf(); paintStill(); }
        else if (running && !raf) { t0 = performance.now(); accrued = ctx.t; raf = window.requestAnimationFrame(frame); }
        return api;
      },
      motion: function () { return ctx.motion; },
      followsSystem: function () { return !explicitMotion; },

      setLevel: function (n) { level = n === 'normal' ? 'normal' : 'suave'; ctx.level = level; return api; },
      setBreath: function (v) { breath = v < 0 ? 0 : (v > 1 ? 1 : v); return api; },

      pointerAt: function (clientX, clientY) {
        var r = host.getBoundingClientRect();
        var m = Math.min(r.width, r.height) || 1;
        pointer.x = ((clientX - r.left) * 2 - r.width) / m;
        pointer.y = -(((clientY - r.top) * 2 - r.height) / m);
        pointer.active = true;
        return api;
      },
      pointerOut: function () { pointer.active = false; return api; },
      pushAt: function (x, y) {
        if (x == null) { push.x = 0; push.y = 0; }
        else { api.pointerAt(x, y); push.x = pointer.x; push.y = pointer.y; }
        push.t = ctx.t;
        return api;
      },

      start: function () {
        if (!ensureBuilt() || running) return api;
        running = true;
        if (ctx.motion === 'quieto') { fade = 1; paintStill(); emit('state', { state: 'still' }); return api; }
        t0 = performance.now(); accrued = 0; lastNow = 0;
        fade = 0; fadeDir = 1; fadeFrom = t0;
        if (!raf) raf = window.requestAnimationFrame(frame);
        emit('state', { state: 'running' });
        return api;
      },
      stop: function () {
        if (!running) { fade = 0; return api; }
        if (ctx.motion === 'quieto') { running = false; emit('state', { state: 'stopped' }); return api; }
        fadeDir = -1; fadeFrom = performance.now();
        return api;
      },
      isRunning: function () { return running; },
      resize: function () { if (!built) return api; sizeCanvas(); if (!running || ctx.motion === 'quieto') paintStill(); return api; },

      /* QA: un fotograma concreto, sin animar */
      freeze: function (t, v) {
        if (!ensureBuilt()) return api;
        stopRaf();
        if (v != null) breath = v;
        fade = 1;
        drawOnce(t == null ? 34 : t);
        return api;
      },
      report: function () {
        return {
          tier: tier, room: room ? room.id : null, motion: ctx.motion,
          quality: Math.round(quality * 100) / 100, frameMs: lastMs, downgrades: downgrades,
          canvas: ctx.w + 'x' + ctx.h
        };
      },

      on: function (n, f) { (listeners[n] = listeners[n] || []).push(f); return api; },

      destroy: function () {
        var iv = vivas.indexOf(repintarSiParado);
        if (iv >= 0) vivas.splice(iv, 1);
        destroyed = true; running = false; stopRaf();
        document.removeEventListener('visibilitychange', onVis);
        try { if (mq) { if (mq.removeEventListener) mq.removeEventListener('change', onPrefChange); else if (mq.removeListener) mq.removeListener(onPrefChange); } } catch (_) {}
        try { if (bodyObs) bodyObs.disconnect(); } catch (_) {}
        if (room && tier === 'B' && gl && room.gl && room.gl.dispose) { try { room.gl.dispose(gl); } catch (_) {} }
        try { var e = gl && gl.getExtension('WEBGL_lose_context'); if (e) e.loseContext(); } catch (_) {}
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        listeners = {};
      }
    };

    ctx.motion = motion;
    return api;
  }

  window.IGSalaStage = {
    create: create,
    register: register,
    rooms: rooms,
    byId: byId,
    GL: GL,
    motionStates: MOTION,
    kind: 'R53_ROOM_STAGE'
  };
})(window, document);
