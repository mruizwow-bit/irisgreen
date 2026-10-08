/* Cielo y Espacio · R03.1 · CUERPOS CON GEOMETRÍA 3D REAL.

   Corrección de Nexo sobre R03: allí los cuerpos se sombreaban píxel a píxel y
   el resultado se pegaba con drawImage. El sombreado era correcto, pero el
   cuerpo seguía siendo una imagen: al rodear el sistema no aparecía otra parte
   de la superficie. VOLUMETRIC_SHADING = TRUE, TRUE_3D_BODY_GEOMETRY = FALSE.

   Aquí cada cuerpo es una MALLA de verdad en WebGL:

     · esfera indexada con coordenadas UV reales y normales por vértice;
     · matriz de modelo propia: posición en la escena, inclinación del eje y
       rotación real del cuerpo para la fecha;
     · textura sobre esas UV, no proyectada sobre un disco;
     · normal geométrica llevada al mundo e iluminada por una luz puntual
       colocada donde está el Sol: el terminador sale de la geometría;
     · prueba de profundidad, así que los cuerpos se tapan entre sí de verdad;
     · anillos con geometría propia, que el planeta tapa por detrás y que tapan
       al planeta por delante;
     · selección por raycast contra el volumen, no por distancia en pantalla.

   Al orbitar, lo que cambia es la cámara: la superficie que se ve cambia porque
   el cuerpo está ahí, no porque se vuelva a dibujar mirando de frente.

   Sin librerías: el paquete se abre con file:// y no pide nada fuera. */
(function (g) {
  'use strict';
  var M = g.IG_MATRIZ;

  var VS_CUERPO = [
    '#version 300 es',
    'in vec3 posicion;',
    'in vec3 normal;',
    'in vec2 uv;',
    'uniform mat4 modelo;',
    'uniform mat4 vistaProyeccion;',
    'uniform mat3 normalModelo;',
    'out vec3 vNormal;',
    'out vec3 vMundo;',
    'out vec2 vUv;',
    'void main() {',
    '  vec4 p = modelo * vec4(posicion, 1.0);',
    '  vMundo = p.xyz;',
    '  vNormal = normalize(normalModelo * normal);',
    '  vUv = uv;',
    '  gl_Position = vistaProyeccion * p;',
    '}'
  ].join('\n');

  var FS_CUERPO = [
    '#version 300 es',
    'precision highp float;',
    'in vec3 vNormal;',
    'in vec3 vMundo;',
    'in vec2 vUv;',
    'uniform sampler2D mapa;',
    'uniform int tieneMapa;',
    'uniform vec3 colorBase;',
    'uniform vec3 luz;',
    'uniform vec3 ojo;',
    'uniform int emisor;',
    'uniform float suelo;',
    'uniform int bloqueadoresN;',
    'uniform vec4 bloqueadores[16];',
    'out vec4 color;',
    'void main() {',
    '  vec3 base = tieneMapa == 1 ? texture(mapa, vUv).rgb : colorBase;',
    '  vec3 n = normalize(vNormal);',
    '  if (emisor == 1) {',
    /* el Sol emite: lo que se ve es oscurecimiento de limbo, que es real */
    '    vec3 v = normalize(ojo - vMundo);',
    '    float mu = max(dot(n, v), 0.0);',
    '    float k = 0.45 + 0.55 * pow(mu, 0.45);',
    '    color = vec4(base * k, 1.0);',
    '    return;',
    '  }',
    /* luz puntual donde está el Sol: el terminador es dónde n·l cruza cero */
    '  vec3 l = normalize(luz - vMundo);',
    '  float lam = max(dot(n, l), 0.0);',
    '  if (lam > 0.0 && bloqueadoresN > 0) {',
    '    float maxT = length(luz - vMundo);',
    '    for (int bi=0; bi<16; bi++) {',
    '      if (bi >= bloqueadoresN) break;',
    '      vec3 cc = bloqueadores[bi].xyz; float rr = bloqueadores[bi].w;',
    '      vec3 oc = cc - vMundo; float tca = dot(oc, l);',
    '      float d2 = dot(oc, oc) - tca*tca;',
    '      if (tca > 0.001 && tca < maxT && d2 < rr*rr) { lam *= 0.06; break; }',
    '    }',
    '  }',
    '  float k = suelo + (1.0 - suelo) * lam;',
    '  color = vec4(base * k, 1.0);',
    '}'
  ].join('\n');

  var VS_SIMPLE = [
    '#version 300 es',
    'in vec3 posicion;',
    'uniform mat4 modelo;',
    'uniform mat4 vistaProyeccion;',
    'out vec3 vMundo;',
    'void main() {',
    '  vec4 p = modelo * vec4(posicion, 1.0);',
    '  vMundo = p.xyz;',
    '  gl_Position = vistaProyeccion * p;',
    '}'
  ].join('\n');

  var FS_ANILLO = [
    '#version 300 es',
    'precision highp float;',
    'in vec3 vMundo;',
    'uniform vec3 color;',
    'uniform float alfa;',
    'uniform vec3 centro;',
    'uniform float r0;',
    'uniform float r1;',
    'out vec4 salida;',
    'void main() {',
    '  float d = length(vMundo - centro);',
    '  float t = clamp((d - r0) / max(0.0001, r1 - r0), 0.0, 1.0);',
    /* bandas: el anillo no es una franja lisa, tiene huecos */
    '  float banda = 0.72 + 0.28 * sin(t * 26.0);',
    '  float borde = smoothstep(0.0, 0.06, t) * (1.0 - smoothstep(0.93, 1.0, t));',
    '  salida = vec4(color * banda, alfa * borde);',
    '}'
  ].join('\n');

  var FS_LINEA = [
    '#version 300 es',
    'precision highp float;',
    'in vec3 vMundo;',
    'uniform vec3 color;',
    'uniform float alfa;',
    'out vec4 salida;',
    'void main() { salida = vec4(color, alfa); }'
  ].join('\n');

  /* ------------------------------------------------------------ malla ---- */
  /* Esfera por paralelos y meridianos: posiciones, normales (que en una esfera
     de radio 1 son la propia posición) y UV equirectangulares, que es justo el
     formato de los mapas de superficie.

     El eje de la esfera es +Z, el mismo eje que el norte de la eclíptica en la
     escena, para que una oblicuidad de 23,4° signifique de verdad 23,4° sobre
     el plano y no un número aplicado a un eje cualquiera. v = 0 cae en el polo
     norte, que es donde lo ponen los mapas equirectangulares; u = 0 es el
     meridiano de origen del cuerpo. */
  function esferaUV(filas, columnas) {
    var pos = [], nor = [], uv = [], idx = [];
    for (var f = 0; f <= filas; f++) {
      var v = f / filas, phi = v * Math.PI;
      for (var c = 0; c <= columnas; c++) {
        var u = c / columnas, theta = u * Math.PI * 2;
        var x = Math.sin(phi) * Math.cos(theta);
        var y = Math.sin(phi) * Math.sin(theta);
        var z = Math.cos(phi);
        pos.push(x, y, z);
        nor.push(x, y, z);
        uv.push(u, v);
      }
    }
    for (var f2 = 0; f2 < filas; f2++) {
      for (var c2 = 0; c2 < columnas; c2++) {
        var a = f2 * (columnas + 1) + c2, b = a + columnas + 1;
        idx.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
    return { pos: new Float32Array(pos), nor: new Float32Array(nor),
             uv: new Float32Array(uv), idx: new Uint32Array(idx),
             vertices: pos.length / 3, triangulos: idx.length / 3 };
  }
  function anilloPlano(segmentos) {
    /* un anillo de radio interior 1 y exterior 2 en el plano XY —el ecuador del
       cuerpo—; la escala, la inclinación y la posición las pone la matriz de
       modelo de cada planeta */
    var pos = [], idx = [];
    for (var i = 0; i <= segmentos; i++) {
      var a = i / segmentos * Math.PI * 2;
      var cx = Math.cos(a), cy = Math.sin(a);
      pos.push(cx, cy, 0, cx * 2, cy * 2, 0);
    }
    for (var j = 0; j < segmentos; j++) {
      var o = j * 2;
      idx.push(o, o + 1, o + 2, o + 1, o + 3, o + 2);
    }
    return { pos: new Float32Array(pos), idx: new Uint32Array(idx),
             vertices: pos.length / 3, triangulos: idx.length / 3 };
  }
  function circulo(segmentos) {
    var pos = [];
    for (var i = 0; i <= segmentos; i++) {
      var a = i / segmentos * Math.PI * 2;
      pos.push(Math.cos(a), Math.sin(a), 0);
    }
    return { pos: new Float32Array(pos), vertices: pos.length / 3 };
  }

  /* --------------------------------------------------------- contexto ---- */
  var gl = null, lienzo = null, perdido = false;
  var prog = {}, buf = {}, vao = {}, texturas = {}, malla = {};
  var info = { disponible: false, motivo: null, renderizador: null, version: null };
  var gpuTimer = null, gpuMuestras = [];

  function compilar(tipo, fuente) {
    var s = gl.createShader(tipo);
    gl.shaderSource(s, fuente);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw new Error('shader: ' + gl.getShaderInfoLog(s));
    }
    return s;
  }
  function programa(vs, fs) {
    var p = gl.createProgram();
    gl.attachShader(p, compilar(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compilar(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      throw new Error('programa: ' + gl.getProgramInfoLog(p));
    }
    var u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < n; i++) {
      var nombre = gl.getActiveUniform(p, i).name;
      u[nombre] = gl.getUniformLocation(p, nombre);
      if (/\[0\]$/.test(nombre)) u[nombre.replace(/\[0\]$/, '')] = u[nombre];
    }
    return { p: p, u: u };
  }

  /* ¿Quién va a dibujar esto? Se pregunta antes, con un contexto de 1×1 que se
     tira, porque la respuesta cambia una decisión: el suavizado de bordes es
     casi gratis en una tarjeta y cuesta el doble cuando lo resuelve la CPU. Si
     no hay tarjeta, se dibuja sin suavizado y SE DICE. No se finge ni lo uno ni
     lo otro. */
  var SOFTWARE = /swiftshader|llvmpipe|softpipe|basic render|software/i;
  function quienDibuja() {
    try {
      var c = document.createElement('canvas');
      c.width = 1; c.height = 1;
      var g2 = c.getContext('webgl2');
      if (!g2) return null;
      var dbg = g2.getExtension('WEBGL_debug_renderer_info');
      return dbg ? g2.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : g2.getParameter(g2.RENDERER);
    } catch (e) { return null; }
  }

  var porSoftware = false, suavizado = true;
  function iniciar(canvas) {
    lienzo = canvas;
    var quien = quienDibuja();
    porSoftware = !!(quien && SOFTWARE.test(quien));
    suavizado = !porSoftware;
    try {
      gl = canvas.getContext('webgl2', { antialias: suavizado, alpha: false, depth: true,
                                         preserveDrawingBuffer: true });
    } catch (e) { gl = null; }
    if (!gl) {
      info = { disponible: false, motivo: 'este navegador no ha dado un contexto WebGL 2' };
      if (g.IG_ESCENA_ERROR) {
        g.IG_ESCENA_ERROR('SIN_WEBGL2', 'webgl2 context not granted',
          { dibuja: quien || null, por_software: porSoftware });
      }
      return info;
    }
    canvas.addEventListener('webglcontextlost', function (ev) {
      ev.preventDefault(); perdido = true;
      if (g.IG_ESCENA_ERROR) g.IG_ESCENA_ERROR('CONTEXTO_PERDIDO', 'webgl2 context lost', null);
      if (g.IG_CUERPOS3D.alPerderContexto) g.IG_CUERPOS3D.alPerderContexto();
    });
    canvas.addEventListener('webglcontextrestored', function () {
      perdido = false; construir();
      if (g.IG_CUERPOS3D.alRecuperarContexto) g.IG_CUERPOS3D.alRecuperarContexto();
    });
    construir();
    gpuTimer = g.IG_R04_GPUTimer ? new g.IG_R04_GPUTimer(gl) : null;
    var dbg = gl.getExtension('WEBGL_debug_renderer_info');
    info = { disponible: true, motivo: null,
             por_software: porSoftware, suavizado_de_bordes: suavizado,
             version: gl.getParameter(gl.VERSION),
             renderizador: dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
             vendedor: dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
             malla: { vertices: malla.esfera.vertices, triangulos: malla.esfera.triangulos,
                      filas: FILAS, columnas: COLUMNAS,
                      niveles: NIVELES.map(function (n, i) {
                        return { filas: n.filas, columnas: n.columnas,
                                 triangulos: malla.esferas[i].triangulos,
                                 hasta_px_de_radio: n.hasta }; }) } };
    return info;
  }

  /* Tres mallas del mismo cuerpo, de más a menos detalle. No es un truco de
     rendimiento a costa de la verdad: la geometría es la misma esfera, y lo que
     cambia es en cuántos trozos se parte. Un cuerpo que ocupa diez píxeles no
     necesita 16.384 triángulos, y uno que llena la pantalla sí. Se elige por el
     tamaño que de verdad tiene en pantalla, medido, no por quién es. */
  var NIVELES = [{ filas: 16, columnas: 32, hasta: 14 },
                 { filas: 32, columnas: 64, hasta: 70 },
                 { filas: 64, columnas: 128, hasta: Infinity }];
  var FILAS = NIVELES[NIVELES.length - 1].filas, COLUMNAS = NIVELES[NIVELES.length - 1].columnas;
  function subirMalla(nombre, m, conNormales) {
    var a = {};
    a.vao = gl.createVertexArray();
    gl.bindVertexArray(a.vao);
    a.pos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, a.pos);
    gl.bufferData(gl.ARRAY_BUFFER, m.pos, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    if (conNormales) {
      a.nor = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, a.nor);
      gl.bufferData(gl.ARRAY_BUFFER, m.nor, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(1);
      gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
      a.uv = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, a.uv);
      gl.bufferData(gl.ARRAY_BUFFER, m.uv, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(2);
      gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
    }
    if (m.idx) {
      a.idx = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, a.idx);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, m.idx, gl.STATIC_DRAW);
      a.n = m.idx.length;
    } else {
      a.n = m.vertices;
    }
    gl.bindVertexArray(null);
    vao[nombre] = a;
  }

  function construir() {
    prog.cuerpo = programa(VS_CUERPO, FS_CUERPO);
    prog.anillo = programa(VS_SIMPLE, FS_ANILLO);
    prog.linea = programa(VS_SIMPLE, FS_LINEA);
    malla.esferas = NIVELES.map(function (n, i) {
      var m = esferaUV(n.filas, n.columnas);
      subirMalla('esfera' + i, m, true);
      return m;
    });
    malla.esfera = malla.esferas[malla.esferas.length - 1];
    malla.anillo = anilloPlano(160);
    malla.circulo = circulo(128);
    subirMalla('anillo', malla.anillo, false);
    subirMalla('circulo', malla.circulo, false);
    texturas = {};
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
  }

  function subirTextura(id, imagen) {
    if (!gl || perdido || !imagen || !imagen.complete || !imagen.naturalWidth) return false;
    if (texturas[id]) return true;
    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagen);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
    texturas[id] = t;
    return true;
  }
  function tieneTextura(id) { return !!texturas[id]; }

  /* ------------------------------------------------- matriz de un cuerpo -
     Traslación a su sitio, inclinación del eje y rotación propia. El orden
     importa: primero gira sobre su eje, luego se inclina, luego se coloca. */
  function modeloDe(c) {
    var T = M.trasladar(c.centro[0], c.centro[1], c.centro[2]);
    var I = M.rotarX(c.inclinacion || 0);   /* oblicuidad: inclina el eje +Z */
    var R = M.rotarZ(c.giro || 0);          /* rotación propia sobre su eje */
    var f = Math.max(0, Math.min(0.2, c.achatamiento || 0));
    var S = M.escalar3(c.radio, c.radio, c.radio * (1 - f));
    return M.multiplicar(M.multiplicar(T, I), M.multiplicar(R, S));
  }

  function dibujar(escena) {
    if (!gl || perdido) return null;
    var gpuT = gpuTimer && gpuTimer.disponible() ? gpuTimer.iniciar('cuerpos-r04') : null;
    var W = lienzo.width, H = lienzo.height;
    gl.viewport(0, 0, W, H);
    gl.clearColor(0.024, 0.043, 0.086, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var cam = escena.camara;
    var proy = M.perspectiva(cam.fov, W / H, cam.cerca || 0.05, cam.lejos || 20000);
    var vista = M.mirarDesde(cam.ojo, cam.centro, cam.arriba || [0, 1, 0]);
    var VP = M.multiplicar(proy, vista);

    /* órbitas primero: geometría de verdad, no un sprite de fondo */
    gl.useProgram(prog.linea.p);
    gl.uniformMatrix4fv(prog.linea.u.vistaProyeccion, false, VP);
    gl.uniform3fv(prog.linea.u.color, [0.55, 0.65, 0.75]);
    gl.uniform1f(prog.linea.u.alfa, 0.22);
    gl.bindVertexArray(vao.circulo.vao);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    (escena.orbitas || []).forEach(function (o) {
      gl.uniformMatrix4fv(prog.linea.u.modelo, false,
        M.multiplicar(M.trasladar(0, 0, 0), M.escalar(o.radio)));
      gl.drawArrays(gl.LINE_STRIP, 0, vao.circulo.n);
    });
    gl.depthMask(true);
    gl.disable(gl.BLEND);

    /* los cuerpos: una malla real cada uno */
    gl.useProgram(prog.cuerpo.p);
    gl.uniformMatrix4fv(prog.cuerpo.u.vistaProyeccion, false, VP);
    gl.uniform3fv(prog.cuerpo.u.luz, escena.luz);
    gl.uniform3fv(prog.cuerpo.u.ojo, cam.ojo);
    gl.uniform1i(prog.cuerpo.u.mapa, 0);
    var dibujados = 0, triangulos = 0, nivelActual = -1, fuera = 0;
    /* cuántos píxeles de radio ocupa un cuerpo: de ahí sale qué malla se usa */
    var mitadAlto = H / 2 / Math.tan(cam.fov / 2);
    var mirando = M.normalizar(M.restar(cam.centro, cam.ojo));
    var radioPantalla = Math.sqrt(W * W + H * H) / 2;
    escena.cuerpos.forEach(function (c) {
      var dx = c.centro[0] - cam.ojo[0], dy = c.centro[1] - cam.ojo[1], dz = c.centro[2] - cam.ojo[2];
      var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      var px = dist > c.radio ? c.radio / dist * mitadAlto : 1e9;
      /* lo que no entra en el cuadro no se dibuja: ni lo que queda detrás de la
         cámara ni lo que cae fuera por los lados. No cambia nada de lo que se
         ve; sólo deja de pagarse lo que no se ve. */
      if (px < 1e8) {
        var ad = M.punto([dx, dy, dz], mirando);
        if (ad <= 0 ? dist > c.radio : false) { fuera++; return; }
        var p = proyectarCon(VP, c.centro, W, H);
        if (p && Math.hypot(p.x - W / 2, p.y - H / 2) > radioPantalla + px * 1.6) { fuera++; return; }
      }
      var nivel = 0;
      while (nivel < NIVELES.length - 1 && px > NIVELES[nivel].hasta) nivel++;
      if (nivel !== nivelActual) { gl.bindVertexArray(vao['esfera' + nivel].vao); nivelActual = nivel; }
      var modelo = modeloDe(c);
      gl.uniformMatrix4fv(prog.cuerpo.u.modelo, false, modelo);
      gl.uniformMatrix3fv(prog.cuerpo.u.normalModelo, false, M.normal3(modelo));
      gl.uniform1i(prog.cuerpo.u.emisor, c.emisor ? 1 : 0);
      gl.uniform1f(prog.cuerpo.u.suelo, c.emisor ? 0 : 0.055);
      gl.uniform3fv(prog.cuerpo.u.colorBase, c.color || [0.48, 0.55, 0.65]);
      /* Sólo entran en el bucle del sombreador los cuerpos que de verdad
         PUEDEN tapar la luz de éste: los que están entre la luz y él, y cuya
         sombra pasa lo bastante cerca. Rodeando a Saturno eso baja de 18
         candidatos a casi ninguno sin cambiar un píxel: lo que se descarta no
         proyectaba sombra sobre este cuerpo. */
      var bl = [];
      if (escena.sombrasMutuas) {
        var lx = c.centro[0] - escena.luz[0], ly = c.centro[1] - escena.luz[1], lz = c.centro[2] - escena.luz[2];
        var ld = Math.sqrt(lx * lx + ly * ly + lz * lz) || 1;
        lx /= ld; ly /= ld; lz /= ld;
        escena.cuerpos.forEach(function (o) {
          if (o === c || o.emisor || bl.length >= 64 /* 16 bloqueadores × 4 componentes */) return;
          var ox = o.centro[0] - escena.luz[0], oy = o.centro[1] - escena.luz[1], oz = o.centro[2] - escena.luz[2];
          var t = ox * lx + oy * ly + oz * lz;          /* cuánto avanza hacia el cuerpo */
          if (t <= 0 || t >= ld + c.radio) return;      /* detrás de la luz o pasado el cuerpo */
          var px = ox - lx * t, py = oy - ly * t, pz = oz - lz * t;
          if (Math.sqrt(px * px + py * py + pz * pz) > o.radio + c.radio) return;  /* la sombra no roza */
          bl.push(o.centro[0], o.centro[1], o.centro[2], o.radio);
        });
      }
      gl.uniform1i(prog.cuerpo.u.bloqueadoresN, bl.length / 4);
      if (bl.length) gl.uniform4fv(prog.cuerpo.u.bloqueadores, new Float32Array(bl));
      var t = texturas[c.textura];
      gl.uniform1i(prog.cuerpo.u.tieneMapa, t ? 1 : 0);
      if (t) { gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, t); }
      gl.drawElements(gl.TRIANGLES, vao['esfera' + nivelActual].n, gl.UNSIGNED_INT, 0);
      dibujados++;
      triangulos += malla.esferas[nivelActual].triangulos;
    });

    /* anillos: geometría propia, con profundidad. El planeta tapa la mitad de
       atrás y la mitad de delante tapa al planeta, porque están en el espacio,
       no porque se dibujen en dos trozos. */
    var conAnillo = escena.cuerpos.filter(function (c) { return c.anillo; });
    if (conAnillo.length) {
      gl.useProgram(prog.anillo.p);
      gl.uniformMatrix4fv(prog.anillo.u.vistaProyeccion, false, VP);
      gl.bindVertexArray(vao.anillo.vao);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.disable(gl.CULL_FACE);
      conAnillo.forEach(function (c) {
        var a = c.anillo;
        var T = M.trasladar(c.centro[0], c.centro[1], c.centro[2]);
        var I = M.rotarX(c.inclinacion || 0);
        var S = M.escalar(c.radio * a.r0);
        gl.uniformMatrix4fv(prog.anillo.u.modelo, false, M.multiplicar(M.multiplicar(T, I), S));
        gl.uniform3fv(prog.anillo.u.color, a.color || [0.88, 0.84, 0.72]);
        gl.uniform1f(prog.anillo.u.alfa, a.alfa === undefined ? 0.85 : a.alfa);
        gl.uniform3fv(prog.anillo.u.centro, c.centro);
        gl.uniform1f(prog.anillo.u.r0, c.radio * a.r0);
        gl.uniform1f(prog.anillo.u.r1, c.radio * (a.r1 || a.r0 * 2));
        gl.drawElements(gl.TRIANGLES, vao.anillo.n, gl.UNSIGNED_INT, 0);
      });
      gl.enable(gl.CULL_FACE);
      gl.disable(gl.BLEND);
    }
    gl.bindVertexArray(null);
    if (gpuTimer && gpuT) gpuTimer.terminar(gpuT);
    if (gpuTimer) { var gm = gpuTimer.leer(); if (gm.length) { gpuMuestras = gpuMuestras.concat(gm.map(function(x){return x.ms;})); if (gpuMuestras.length > 1200) gpuMuestras.splice(0, gpuMuestras.length-1200); } }
    return { cuerpos: dibujados, triangulos: triangulos, fuera_del_cuadro: fuera };
  }

  /* ------------------------------------------------------------ raycast --
     Se lanza un rayo desde la cámara a través del píxel y se corta contra el
     VOLUMEN de cada cuerpo. Gana el más cercano: lo que está delante tapa. */
  function rayoDePixel(escena, px, py, W, H) {
    var cam = escena.camara;
    var f = M.normalizar(M.restar(cam.centro, cam.ojo));
    var der = M.normalizar(M.cruz(f, cam.arriba || [0, 1, 0]));
    var arr = M.cruz(der, f);
    var alto = Math.tan(cam.fov / 2);
    var x = (2 * px / W - 1) * alto * (W / H);
    var y = (1 - 2 * py / H) * alto;
    return { origen: cam.ojo,
             dir: M.normalizar([f[0] + der[0] * x + arr[0] * y,
                                f[1] + der[1] * x + arr[1] * y,
                                f[2] + der[2] * x + arr[2] * y]) };
  }
  function aLocalDeCuerpo(v, c) {
    var x=v[0], y=v[1], z=v[2];
    var ci=Math.cos(-(c.inclinacion||0)), si=Math.sin(-(c.inclinacion||0));
    var y1=y*ci-z*si, z1=y*si+z*ci, x1=x;
    var cg=Math.cos(-(c.giro||0)), sg=Math.sin(-(c.giro||0));
    var x2=x1*cg-y1*sg, y2=x1*sg+y1*cg;
    var p=1-Math.max(0,Math.min(.2,c.achatamiento||0));
    return [x2,y2,z1/Math.max(.001,p)];
  }
  function cortarElipsoide(rayo,c) {
    var oc=aLocalDeCuerpo(M.restar(rayo.origen,c.centro),c), d=aLocalDeCuerpo(rayo.dir,c);
    var A=M.punto(d,d), B=2*M.punto(oc,d), C=M.punto(oc,oc)-c.radio*c.radio;
    var disc=B*B-4*A*C; if(disc<0)return null; var q=Math.sqrt(disc);
    var t1=(-B-q)/(2*A), t2=(-B+q)/(2*A); return t1>0?t1:(t2>0?t2:null);
  }
  function cortarEsfera(rayo, centro, radio) {
    var oc = M.restar(rayo.origen, centro);
    var b = 2 * M.punto(oc, rayo.dir);
    var c = M.punto(oc, oc) - radio * radio;
    var disc = b * b - 4 * c;
    if (disc < 0) return null;
    var r = Math.sqrt(disc);
    var t1 = (-b - r) / 2, t2 = (-b + r) / 2;
    var t = t1 > 0 ? t1 : (t2 > 0 ? t2 : null);
    return t;
  }
  function raycast(escena, px, py, W, H) {
    var rayo = rayoDePixel(escena, px, py, W, H);
    var mejor = null;
    escena.cuerpos.forEach(function (c) {
      var t = c.achatamiento ? cortarElipsoide(rayo, c) : cortarEsfera(rayo, c.centro, c.radio);
      if (t !== null && (!mejor || t < mejor.t)) {
        var p = [rayo.origen[0] + rayo.dir[0] * t, rayo.origen[1] + rayo.dir[1] * t,
                 rayo.origen[2] + rayo.dir[2] * t];
        mejor = { id: c.id, t: t, punto: p, cuerpo: c };
      }
    });
    return mejor;
  }

  /* ---------------------------------------------------------- proyectar --
     Del mundo a la pantalla, con la misma cámara que dibuja. Sirve para poner
     un rótulo donde está el cuerpo y para que las pruebas midan su disco sin
     adivinar: el radio en píxeles sale de la geometría proyectada, no de una
     constante. */
  function proyectarCon(VP, p, W, H) {
    var o = M.aplicar4(VP, [p[0], p[1], p[2], 1]);
    if (!(o[3] > 1e-9)) return null;
    return { x: (o[0] / o[3] * 0.5 + 0.5) * W, y: (1 - (o[1] / o[3] * 0.5 + 0.5)) * H };
  }
  function matrizVP(escena, W, H) {
    var cam = escena.camara;
    var proy = M.perspectiva(cam.fov, W / H, cam.cerca || 0.05, cam.lejos || 20000);
    return M.multiplicar(proy, M.mirarDesde(cam.ojo, cam.centro, cam.arriba || [0, 0, 1]));
  }
  function proyectar(escena, p, W, H) {
    var o = M.aplicar4(matrizVP(escena, W, H), [p[0], p[1], p[2], 1]);
    if (!(o[3] > 1e-9)) return null;
    return { x: (o[0] / o[3] * 0.5 + 0.5) * W, y: (1 - (o[1] / o[3] * 0.5 + 0.5)) * H,
             profundidad: o[3] };
  }
  function enPantalla(escena, cuerpo, W, H) {
    var c = proyectar(escena, cuerpo.centro, W, H);
    if (!c) return null;
    /* un punto del limbo: se desplaza el centro perpendicularmente a la línea
       de visión, así que lo que se mide es el radio de verdad del volumen */
    var cam = escena.camara;
    var f = M.normalizar(M.restar(cuerpo.centro, cam.ojo));
    var der = M.normalizar(M.cruz(f, cam.arriba || [0, 0, 1]));
    var b = proyectar(escena, [cuerpo.centro[0] + der[0] * cuerpo.radio,
                              cuerpo.centro[1] + der[1] * cuerpo.radio,
                              cuerpo.centro[2] + der[2] * cuerpo.radio], W, H);
    return { x: c.x, y: c.y, profundidad: c.profundidad,
             radio: b ? Math.hypot(b.x - c.x, b.y - c.y) : 0 };
  }

  /* Qué longitud del cuerpo mira a la cámara ahora mismo. Sirve para demostrar
     que al orbitar se ve OTRA parte de la superficie, no la misma. */
  function longitudHaciaLaCamara(c, ojo) {
    var d = M.normalizar(M.restar(ojo, c.centro));
    /* deshacer la inclinación (sobre X) y el giro (sobre Z): la dirección pasa
       al sistema del propio cuerpo, donde u = 0 es su meridiano de origen */
    var ci = Math.cos(-(c.inclinacion || 0)), si = Math.sin(-(c.inclinacion || 0));
    var x1 = d[0], y1 = d[1] * ci - d[2] * si, z1 = d[1] * si + d[2] * ci;
    var cg = Math.cos(-(c.giro || 0)), sg = Math.sin(-(c.giro || 0));
    var x2 = x1 * cg - y1 * sg, y2 = x1 * sg + y1 * cg;
    var lon = Math.atan2(y2, x2) * 180 / Math.PI;
    return { longitud: (lon + 360) % 360,
             latitud: Math.asin(Math.max(-1, Math.min(1, z1))) * 180 / Math.PI,
             /* la dirección en el sistema del cuerpo: dos cámaras dan dos
                vectores, y el ángulo entre ellos es cuánta superficie distinta
                se ha puesto de cara. Vale igual para un cuerpo con el eje
                tumbado, donde la longitud sola engaña. */
             direccion: [x2, y2, z1] };
  }

  g.IG_CUERPOS3D = {
    iniciar: iniciar, dibujar: dibujar, raycast: raycast, subirTextura: subirTextura,
    tieneTextura: tieneTextura, longitudHaciaLaCamara: longitudHaciaLaCamara,
    proyectar: proyectar, enPantalla: enPantalla,
    info: function () { return info; },
    perdido: function () { return perdido; },
    estadisticasDeMalla: function () {
      return { vertices: malla.esfera ? malla.esfera.vertices : 0,
               triangulos: malla.esfera ? malla.esfera.triangulos : 0,
               indices: vao.esfera2 ? vao.esfera2.n : 0,
               filas: FILAS, columnas: COLUMNAS,
               niveles: malla.esferas ? malla.esferas.map(function (m, i) {
                 return { filas: NIVELES[i].filas, columnas: NIVELES[i].columnas,
                          vertices: m.vertices, triangulos: m.triangulos,
                          indices: vao['esfera' + i] ? vao['esfera' + i].n : 0,
                          hasta_px_de_radio: NIVELES[i].hasta }; }) : [],
               anillo_triangulos: malla.anillo ? malla.anillo.triangulos : 0,
               atributos: ['posicion', 'normal', 'uv'],
               dibujo: 'drawElements(TRIANGLES)' };
    },
    /* Píxeles tal como han quedado en el búfer, en coordenadas de lienzo
       (origen arriba a la izquierda). Es lo que permite medir el terminador y la
       oclusión sobre lo dibujado, en vez de creérselo. */
    leerPixeles: function (x, y, w, h) {
      if (!gl || perdido) return null;
      var d = new Uint8Array(w * h * 4);
      gl.readPixels(x, lienzo.height - (y + h), w, h, gl.RGBA, gl.UNSIGNED_BYTE, d);
      /* readPixels devuelve de abajo arriba: se le da la vuelta por filas */
      var o = new Uint8Array(w * h * 4);
      for (var f = 0; f < h; f++) {
        o.set(d.subarray((h - 1 - f) * w * 4, (h - f) * w * 4), f * w * 4);
      }
      return o;
    },
    tamano: function () { return lienzo ? { W: lienzo.width, H: lienzo.height } : null; },
    /* Espera a que el dibujo esté de verdad terminado. Sin esto, cronometrar
       `dibujar` mide lo que tarda en MANDAR las órdenes, no lo que tarda en
       hacerse, y sale un número bonito que no significa nada. */
    terminar: function () { if (gl && !perdido) gl.finish(); },
    contexto: function () { return gl; },
    gpuR04: function () { return { disponible: !!(gpuTimer && gpuTimer.disponible()), muestras_ms: gpuMuestras.slice() }; }
  };
})(window);
