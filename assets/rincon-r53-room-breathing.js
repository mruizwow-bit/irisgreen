/* R53 · Sala 5 · Respiracion del espacio.
   Arquitectura, no cuerpos: portales y anillos luminosos que se alejan en
   profundidad, membranas translucidas entre ellos y lineas de suelo y techo.
   Todo el conjunto se abre y se recoge con el ciclo de la bola, asi que en una
   captura fija no se parece en nada a Globos. */
(function (window) {
  'use strict';
  var S = window.IGSalaStage;
  if (!S) return;

  var RINGS = 14, SEGS = 64;

  var rings = [];
  (function seed() {
    for (var i = 0; i < RINGS; i++) {
      var u = i / (RINGS - 1);
      var h1 = S.GL.hash(i, 4.3), h2 = S.GL.hash(i, 9.9);
      var h3 = S.GL.hash(i, 15.1), h4 = S.GL.hash(i, 21.7);
      rings.push({
        z: -(1.8 + u * u * 26.0),
        /* cada portal se desplaza de su vecino: no es un tunel, es una hilera
           de piezas por las que se pasa */
        cx: (h3 - 0.5) * (0.9 + u * 3.4),
        cy: S.GL.FLOOR_Y + (1.25 + u * 2.3 + h1 * 0.25) * 0.84 + (h4 - 0.5) * 0.5,
        tilt: (h3 - 0.5) * 0.55,
        r: 0.95 + u * 2.2 + h1 * 0.30,
        /* alternan aro y portal: el portal es lo que hace que lea arquitectura */
        portal: (i % 3) === 1,
        round: 0.20 + h2 * 0.30,
        w: 0.022 + h1 * 0.012,
        ph: u * 3.0,
        tint: (i % 4) === 0 ? 1 : 0,
        membrane: (i % 2) === 0
      });
    }
  })();

  /* contorno del anillo: circulo o portal de esquinas redondeadas */
  function outline(rg, k, R) {
    var a = k / SEGS * 6.283185;
    var x, y;
    if (!rg.portal) { x = Math.cos(a) * R; y = Math.sin(a) * R * 0.86; }
    else {
      var cx = Math.cos(a), sy = Math.sin(a), p = 4.0;
      var m = Math.pow(Math.pow(Math.abs(cx), p) + Math.pow(Math.abs(sy), p), 1 / p);
      x = cx / m * R; y = sy / m * R * 0.80;
    }
    var ct = Math.cos(rg.tilt), st = Math.sin(rg.tilt);
    return [rg.cx + x * ct - y * st, rg.cy + x * st + y * ct];
  }

  var VS = [
    '#version 300 es',
    'in vec3 aPos; in vec3 aAttr;', /* borde, avance, tono */
    'uniform mat4 uProj; uniform mat4 uView;',
    S.GL.MIRROR_GLSL,
    'out float vEdge; out float vAlong; out float vTint; out float vDepth;',
    'void main(){',
    ' vec4 c = uView * vec4(igFlip(aPos), 1.0);',
    ' vEdge = aAttr.x; vAlong = aAttr.y; vTint = aAttr.z; vDepth = -c.z;',
    ' gl_Position = uProj * c;',
    '}'
  ].join('\n');

  var FS = [
    '#version 300 es',
    'precision highp float;',
    'in float vEdge; in float vAlong; in float vTint; in float vDepth;',
    'uniform float uFade; uniform float uV; uniform float uRefl;',
    'out vec4 oCol;',
    'void main(){',
    ' float s = abs(vEdge);',
    ' float round_ = sqrt(max(0.0, 1.0 - s * s));',
    ' float lit = pow(clamp(round_, 0.0, 1.0), 1.2);',
    ' float body = pow(max(0.0, 1.0 - s), 1.0);',
    ' float core = pow(max(0.0, 1.0 - s * 2.0), 2.2);',
    ' vec3 warm = vec3(1.00, 0.86, 0.72), cool = vec3(0.70, 0.86, 1.00);',
    ' vec3 tint = mix(cool, warm, vTint);',
    /* la luz sube y baja con el ciclo, sin cambiar de sitio */
    ' float pulse = 0.72 + 0.46 * uV;',
    ' vec3 col = (tint * (0.42 + 0.72 * lit) + tint * core * 0.45) * pulse;',
    ' col += vec3(1.0) * core * 0.16 * pulse;',
    ' float far = clamp(1.0 - vDepth / 30.0, 0.0, 1.0);',
    ' float a = clamp(body * 1.8, 0.0, 1.0) * (0.30 + 0.70 * far);',
    ' oCol = vec4(col * uFade * uRefl, a * uFade * uRefl);',
    '}'
  ].join('\n');

  var MEM_VS = [
    '#version 300 es',
    'in vec3 aPos; in vec2 aUv;',
    'uniform mat4 uProj; uniform mat4 uView;',
    S.GL.MIRROR_GLSL,
    'out vec2 vUv; out float vDepth;',
    'void main(){ vec4 c = uView * vec4(igFlip(aPos),1.0); vUv=aUv; vDepth=-c.z; gl_Position = uProj * c; }'
  ].join('\n');
  var MEM_FS = [
    '#version 300 es',
    'precision highp float;',
    'in vec2 vUv; in float vDepth; uniform float uFade; uniform float uV; uniform float uRefl; out vec4 oCol;',
    'void main(){',
    ' float d = length(vUv);',
    ' float film = smoothstep(1.0, 0.25, d);',
    ' float far = clamp(1.0 - vDepth / 30.0, 0.0, 1.0);',
    ' vec3 col = mix(vec3(0.20,0.26,0.44), vec3(0.62,0.72,0.95), film * (0.4 + 0.6 * uV));',
    ' oCol = vec4(col * uFade * uRefl, film * 0.62 * (0.25 + 0.75 * far) * uFade * uRefl);',
    '}'
  ].join('\n');

  var WALL = { a: [0.045, 0.055, 0.115], b: [0.150, 0.190, 0.330], glow: [0.075, 0.085, 0.150], glowAt: [0.0, 0.30] };
  var FLOOR = { tint: [0.060, 0.072, 0.135], gloss: 0.82 };

  var prog = null, memp = null, quad = null;
  var vbo = null, mbo = null, verts = null, mverts = null;

  function init(gl) {
    prog = S.GL.program(gl, VS, FS);
    memp = S.GL.program(gl, MEM_VS, MEM_FS);
    quad = S.GL.unitQuad(gl);
    verts = new Float32Array(RINGS * SEGS * 6 * 6);
    mverts = new Float32Array(RINGS * SEGS * 3 * 5);
    vbo = gl.createBuffer(); mbo = gl.createBuffer();
  }

  /* La cinta se empalma: cada punto usa la normal promediada de sus dos
     tramos vecinos. Encadenar cuadros independientes dejaba muescas en cada
     union, que es lo que se veia como rayas oscuras sobre el aro. */
  function build(ctx, n) {
    var o = 0, mo = 0, t = ctx.t, v = ctx.v, drift = ctx.drift;
    var pts = new Array(SEGS), nrm = new Array(SEGS);
    for (var i = 0; i < n; i++) {
      var rg = rings[i];
      var breath = 1 + 0.17 * v + 0.03 * Math.sin(t * 0.10 * drift + rg.ph);
      var R = rg.r * breath;
      var w = rg.w * R * breath * (1 + 0.45 * v);

      for (var k = 0; k < SEGS; k++) pts[k] = outline(rg, k, R);
      for (k = 0; k < SEGS; k++) {
        var pv = pts[(k - 1 + SEGS) % SEGS], nx2 = pts[(k + 1) % SEGS];
        var ax = pts[k][0] - pv[0], ay = pts[k][1] - pv[1];
        var bx = nx2[0] - pts[k][0], by = nx2[1] - pts[k][1];
        var al = Math.hypot(ax, ay) || 1, bl = Math.hypot(bx, by) || 1;
        var nxs = (-ay / al) + (-by / bl), nys = (ax / al) + (bx / bl);
        var nl = Math.hypot(nxs, nys) || 1;
        nrm[k] = [nxs / nl, nys / nl];
      }
      for (k = 0; k < SEGS; k++) {
        var k2 = (k + 1) % SEGS;
        var p0 = pts[k], p1 = pts[k2], n0 = nrm[k], n1 = nrm[k2];
        var q = [
          [p0[0] + n0[0] * w, p0[1] + n0[1] * w, 1],
          [p0[0] - n0[0] * w, p0[1] - n0[1] * w, -1],
          [p1[0] + n1[0] * w, p1[1] + n1[1] * w, 1],
          [p1[0] + n1[0] * w, p1[1] + n1[1] * w, 1],
          [p0[0] - n0[0] * w, p0[1] - n0[1] * w, -1],
          [p1[0] - n1[0] * w, p1[1] - n1[1] * w, -1]
        ];
        for (var j = 0; j < 6; j++) {
          verts[o++] = q[j][0]; verts[o++] = q[j][1]; verts[o++] = rg.z;
          verts[o++] = q[j][2]; verts[o++] = k / SEGS; verts[o++] = rg.tint;
        }
        if (rg.membrane) {
          var tri = [
            [rg.cx, rg.cy, rg.z, 0, 0],
            [p0[0], p0[1], rg.z, (p0[0] - rg.cx) / R, (p0[1] - rg.cy) / R],
            [p1[0], p1[1], rg.z, (p1[0] - rg.cx) / R, (p1[1] - rg.cy) / R]
          ];
          for (var m = 0; m < 3; m++) {
            mverts[mo++] = tri[m][0]; mverts[mo++] = tri[m][1]; mverts[mo++] = tri[m][2];
            mverts[mo++] = tri[m][3]; mverts[mo++] = tri[m][4];
          }
        }
      }
    }
    return [o, mo];
  }

  function draw(gl, ctx, fade) {
    var n = Math.max(6, Math.round(RINGS * (0.5 + 0.5 * ctx.quality)));
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    S.GL.drawWall(gl, ctx, fade, WALL);

    var used = build(ctx, n);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, verts.subarray(0, used[0]), gl.DYNAMIC_DRAW);
    if (used[1] > 0) {
      gl.bindBuffer(gl.ARRAY_BUFFER, mbo);
      gl.bufferData(gl.ARRAY_BUFFER, mverts.subarray(0, used[1]), gl.DYNAMIC_DRAW);
    }

    function pass(flip, refl) {
      if (used[1] > 0) {
        memp.use();
        gl.uniformMatrix4fv(memp.u('uProj'), false, ctx.proj);
        gl.uniformMatrix4fv(memp.u('uView'), false, ctx.view);
        gl.uniform1f(memp.u('uFade'), fade); gl.uniform1f(memp.u('uV'), ctx.v);
        gl.uniform2f(memp.u('uFlip'), flip, S.GL.FLOOR_Y);
        gl.uniform1f(memp.u('uRefl'), refl);
        gl.bindBuffer(gl.ARRAY_BUFFER, mbo);
        var mp = memp.a('aPos'), mu = memp.a('aUv');
        gl.enableVertexAttribArray(mp); gl.vertexAttribPointer(mp, 3, gl.FLOAT, false, 20, 0); gl.vertexAttribDivisor(mp, 0);
        gl.enableVertexAttribArray(mu); gl.vertexAttribPointer(mu, 2, gl.FLOAT, false, 20, 12); gl.vertexAttribDivisor(mu, 0);
        gl.drawArrays(gl.TRIANGLES, 0, used[1] / 5);
      }
      prog.use();
      gl.uniformMatrix4fv(prog.u('uProj'), false, ctx.proj);
      gl.uniformMatrix4fv(prog.u('uView'), false, ctx.view);
      gl.uniform1f(prog.u('uFade'), fade); gl.uniform1f(prog.u('uV'), ctx.v);
      gl.uniform2f(prog.u('uFlip'), flip, S.GL.FLOOR_Y);
      gl.uniform1f(prog.u('uRefl'), refl);
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      var ap = prog.a('aPos'), aa = prog.a('aAttr');
      gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap, 3, gl.FLOAT, false, 24, 0); gl.vertexAttribDivisor(ap, 0);
      gl.enableVertexAttribArray(aa); gl.vertexAttribPointer(aa, 3, gl.FLOAT, false, 24, 12); gl.vertexAttribDivisor(aa, 0);
      gl.drawArrays(gl.TRIANGLES, 0, used[0] / 6);
    }
    pass(-1.0, 0.45);
    S.GL.drawFloor(gl, ctx, fade, FLOOR);
    pass(1.0, 1.0);
    gl.disable(gl.BLEND);
  }

  function dispose(gl) {
    try { if (prog) prog.free(); if (memp) memp.free();
      gl.deleteBuffer(quad); gl.deleteBuffer(vbo); gl.deleteBuffer(mbo); } catch (_) {}
    prog = memp = quad = vbo = mbo = null;
  }

  /* ------------------------------------------------- escalon C · Canvas2D */
  function c2dDraw(c, ctx, fade) {
    var w = ctx.w, h = ctx.h, f = 1.0 / Math.tan(1.02 / 2), t = ctx.t, v = ctx.v;
    var g = c.createRadialGradient(w * 0.5, h * 0.5, 10, w * 0.5, h * 0.5, Math.max(w, h) * 0.8);
    g.addColorStop(0, '#171d33'); g.addColorStop(1, '#05060f');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.globalCompositeOperation = 'lighter';
    for (var i = rings.length - 1; i >= 0; i--) {
      var rg = rings[i];
      var breath = 1 + 0.17 * v + 0.03 * Math.sin(t * 0.10 * ctx.drift + rg.ph);
      var R = rg.r * breath;
      var far = Math.max(0, Math.min(1, 1 + rg.z / 30));
      var tint = rg.tint ? '255,220,184' : '180,220,255';
      c.beginPath();
      for (var k = 0; k <= SEGS; k += 2) {
        var p = outline(rg, k, R);
        var sx = w * 0.5 + (p[0] / (-rg.z)) * f * h * 0.5;
        var sy = h * 0.5 - (p[1] / (-rg.z)) * f * h * 0.5;
        if (k === 0) c.moveTo(sx, sy); else c.lineTo(sx, sy);
      }
      c.closePath();
      var pulse = 0.72 + 0.46 * v;
      c.strokeStyle = 'rgba(' + tint + ',' + (0.10 * fade * pulse * (0.2 + 0.8 * far)).toFixed(3) + ')';
      c.lineWidth = Math.max(3, 30 * far); c.stroke();
      c.strokeStyle = 'rgba(' + tint + ',' + (0.55 * fade * pulse * (0.2 + 0.8 * far)).toFixed(3) + ')';
      c.lineWidth = Math.max(1, 5 * far); c.stroke();
      c.strokeStyle = 'rgba(255,255,255,' + (0.30 * fade * pulse * far).toFixed(3) + ')';
      c.lineWidth = Math.max(0.6, 1.6 * far); c.stroke();
    }
    c.globalCompositeOperation = 'source-over';
  }

  function stillDraw(c, ctx) {
    var d = ctx.drift, t = ctx.t;
    ctx.drift = 0; ctx.t = 18;
    c2dDraw(c, ctx, 1);
    ctx.drift = d; ctx.t = t;
  }

  S.register({
    id: 'respiracion',
    es: 'Respiración del espacio', en: 'The space breathing',
    des: 'Una estructura de portales luminosos que se abre y se recoge con el ritmo de la bola.',
    den: 'A structure of luminous portals that opens and gathers with the ball’s rhythm.',
    audio: 'cuencos',
    gl: { init: init, draw: draw, dispose: dispose },
    c2d: { draw: c2dDraw },
    still: { draw: stillDraw }
  });
})(window);
