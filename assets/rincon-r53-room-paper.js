/* R53 · Sala 3 · Papel y viento.
   Hojas finas de dos caras: malla deformada con pliegue y curvatura, borde
   visible que recoge la luz, translucidez que deja ver lo que hay detras y
   oscurece donde las capas se solapan, y una brisa muy lenta.
   La geometria se deforma en la CPU porque asi el orden de profundidad, que es
   lo que da el solape correcto, es siempre exacto. */
(function (window) {
  'use strict';
  var S = window.IGSalaStage;
  if (!S) return;

  var SHEETS = 34, GRID = 6;
  var VERTS_PER = GRID * GRID * 6;

  var sheets = [];
  (function seed() {
    var TAN = 0.56;
    for (var i = 0; i < SHEETS; i++) {
      var h1 = S.GL.hash(i, 2.9), h2 = S.GL.hash(i, 6.1), h3 = S.GL.hash(i, 10.7),
          h4 = S.GL.hash(i, 15.3), h5 = S.GL.hash(i, 19.9), h6 = S.GL.hash(i, 25.1);
      var z, size;
      if (i < 2) { z = -(3.6 + h1 * 1.6); size = 0.95 + h2 * 0.55; }
      else { z = -(5.0 + h1 * 14.0); size = 0.70 + h2 * 1.35; }
      var half = (-z) * TAN;
      sheets.push({
        x: (h3 - 0.5) * half * 3.1,
        y0: S.GL.FLOOR_Y + 0.60 + h4 * 5.0,
        z: z,
        w: size, h: size * (0.68 + h5 * 0.55),
        yaw: h5 * 6.283, pitch: (h6 - 0.5) * 1.1, roll: (h3 - 0.5) * 1.4,
        ph: h4 * 6.283,
        fold: 0.16 + h6 * 0.30,
        warm: h1,
        fall: 0.020 + h5 * 0.045
      });
    }
  })();

  function rot(p, yaw, pitch, roll) {
    var cy = Math.cos(yaw), sy = Math.sin(yaw);
    var cp = Math.cos(pitch), sp = Math.sin(pitch);
    var cr = Math.cos(roll), sr = Math.sin(roll);
    var x = p[0] * cr - p[1] * sr, y = p[0] * sr + p[1] * cr, z = p[2];
    var y2 = y * cp - z * sp, z2 = y * sp + z * cp;
    var x2 = x * cy + z2 * sy, z3 = -x * sy + z2 * cy;
    return [x2, y2, z3];
  }

  function sheetPoint(sh, u, v, t, drift) {
    var ph = sh.ph + t * 0.16 * drift;
    /* pliegue y curvatura: dos ondas cruzadas de amplitud distinta */
    var zz = sh.fold * Math.sin(u * 2.3 + ph) * (1 - v * v * 0.35)
           + sh.fold * 0.55 * Math.sin(v * 1.7 - ph * 0.7);
    var p = [u * sh.w, v * sh.h, zz];
    var wob = Math.sin(t * 0.07 * drift + sh.ph) * 0.20 * drift;
    return rot(p, sh.yaw + wob, sh.pitch + wob * 0.5, sh.roll);
  }

  var VS = [
    '#version 300 es',
    'in vec3 aPos; in vec3 aNrm; in vec3 aUvw;', /* u, v, calidez */
    'uniform mat4 uProj; uniform mat4 uView;',
    S.GL.MIRROR_GLSL,
    'out vec3 vNrm; out vec2 vUv; out float vWarm; out float vDepth;',
    'void main(){',
    ' vec4 c = uView * vec4(igFlip(aPos), 1.0);',
    ' vNrm = mat3(uView) * aNrm;',
    ' vUv = aUvw.xy; vWarm = aUvw.z; vDepth = -c.z;',
    ' gl_Position = uProj * c;',
    '}'
  ].join('\n');

  var FS = [
    '#version 300 es',
    'precision highp float;',
    'in vec3 vNrm; in vec2 vUv; in float vWarm; in float vDepth;',
    'uniform float uFade; uniform float uRefl; out vec4 oCol;',
    'void main(){',
    ' vec3 n = normalize(vNrm);',
    ' bool front = gl_FrontFacing;',
    ' if(!front) n = -n;',
    ' vec3 L = normalize(vec3(-0.40, 0.62, 0.68));',
    ' float diff = clamp(dot(n, L), 0.0, 1.0);',
    /* el papel deja pasar luz: la cara de atras no es negra, es mas calida */
    ' float trans = pow(clamp(dot(-n, L), 0.0, 1.0), 1.6);',
    ' vec3 paper = mix(vec3(1.00,0.945,0.86), vec3(0.99,0.84,0.66), vWarm);',
    ' vec3 col = paper * (0.30 + 0.62 * diff);',
    ' col += paper * trans * 0.42;',
    ' if(!front) col *= 0.88;',
    /* borde: la fibra del papel recoge la luz en el canto */
    ' vec2 e = min(vUv, vec2(1.0) - vUv);',
    ' float edge = 1.0 - smoothstep(0.0, 0.055, min(e.x, e.y));',
    ' col += paper * edge * 0.45;',
    ' float far = clamp(1.0 - vDepth / 20.0, 0.0, 1.0);',
    ' col = mix(vec3(0.190,0.140,0.105), col, 0.32 + 0.68 * far);',
    ' float a = (0.44 + 0.26 * edge) * (0.42 + 0.58 * far);',
    ' oCol = vec4(col * uFade * uRefl, a * uFade * uRefl);',
    '}'
  ].join('\n');

  var WALL = { a: [0.205, 0.115, 0.075], b: [0.560, 0.330, 0.170], glow: [0.230, 0.130, 0.055], glowAt: [-0.30, 0.42] };
  var FLOOR = { tint: [0.145, 0.085, 0.055], gloss: 0.76 };

  var prog = null, quad = null, vbo = null, verts = null, idx = null;

  function init(gl) {
    prog = S.GL.program(gl, VS, FS);
    quad = S.GL.unitQuad(gl);
    verts = new Float32Array(SHEETS * VERTS_PER * 9);
    vbo = gl.createBuffer();
    idx = [];
  }

  /* La malla se calcula por vertice y no por cara: asi el pliegue se lee
     continuo y no como facetas de un poliedro. */
  var gp = null, gn = null;
  function sheetGrid(sh, t, drift) {
    var N = GRID + 1, e = 0.035;
    if (!gp) { gp = new Float32Array(N * N * 3); gn = new Float32Array(N * N * 3); }
    for (var j = 0; j < N; j++) {
      for (var i = 0; i < N; i++) {
        var u = i / GRID * 2 - 1, v = j / GRID * 2 - 1, o = (j * N + i) * 3;
        var p = sheetPoint(sh, u, v, t, drift);
        gp[o] = p[0]; gp[o+1] = p[1]; gp[o+2] = p[2];
        var pu = sheetPoint(sh, u + e, v, t, drift), mu = sheetPoint(sh, u - e, v, t, drift);
        var pv = sheetPoint(sh, u, v + e, t, drift), mv = sheetPoint(sh, u, v - e, t, drift);
        var ax = pu[0]-mu[0], ay = pu[1]-mu[1], az = pu[2]-mu[2];
        var bx = pv[0]-mv[0], by = pv[1]-mv[1], bz = pv[2]-mv[2];
        var nx = ay*bz - az*by, ny = az*bx - ax*bz, nz = ax*by - ay*bx;
        var nl = Math.hypot(nx, ny, nz) || 1;
        gn[o] = nx/nl; gn[o+1] = ny/nl; gn[o+2] = nz/nl;
      }
    }
  }

  function build(ctx, n) {
    var o = 0, t = ctx.t, drift = ctx.drift, N = GRID + 1;
    idx.length = 0;
    for (var i = 0; i < n; i++) idx.push(i);
    idx.sort(function (a, b) { return sheets[a].z - sheets[b].z; });

    for (var k = 0; k < n; k++) {
      var sh = sheets[idx[k]];
      var yOff = drift > 0 ? ((t * sh.fall) % 3.2) : 0;
      sheetGrid(sh, t, drift);
      for (var gy = 0; gy < GRID; gy++) {
        for (var gx = 0; gx < GRID; gx++) {
          var c00 = (gy * N + gx) * 3, c10 = (gy * N + gx + 1) * 3;
          var c01 = ((gy + 1) * N + gx) * 3, c11 = ((gy + 1) * N + gx + 1) * 3;
          var corners = [c00, c10, c01, c11];
          var uvs = [
            [gx / GRID, gy / GRID], [(gx + 1) / GRID, gy / GRID],
            [gx / GRID, (gy + 1) / GRID], [(gx + 1) / GRID, (gy + 1) / GRID]
          ];
          var tri = [0, 1, 2, 2, 1, 3];
          for (var q = 0; q < 6; q++) {
            var j = tri[q], c = corners[j];
            verts[o++] = sh.x + gp[c];
            verts[o++] = sh.y0 + gp[c+1] - yOff;
            verts[o++] = sh.z + gp[c+2];
            verts[o++] = gn[c]; verts[o++] = gn[c+1]; verts[o++] = gn[c+2];
            verts[o++] = uvs[j][0]; verts[o++] = uvs[j][1]; verts[o++] = sh.warm;
          }
        }
      }
    }
    return o;
  }

  function draw(gl, ctx, fade) {
    var n = Math.max(7, Math.round(SHEETS * (0.4 + 0.6 * ctx.quality)));
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    S.GL.drawWall(gl, ctx, fade, WALL);

    var used = build(ctx, n);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, verts.subarray(0, used), gl.DYNAMIC_DRAW);

    function pass(flip, refl) {
      prog.use();
      gl.uniformMatrix4fv(prog.u('uProj'), false, ctx.proj);
      gl.uniformMatrix4fv(prog.u('uView'), false, ctx.view);
      gl.uniform1f(prog.u('uFade'), fade);
      gl.uniform2f(prog.u('uFlip'), flip, S.GL.FLOOR_Y);
      gl.uniform1f(prog.u('uRefl'), refl);
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      var ap = prog.a('aPos'), an = prog.a('aNrm'), au = prog.a('aUvw');
      gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap, 3, gl.FLOAT, false, 36, 0); gl.vertexAttribDivisor(ap, 0);
      gl.enableVertexAttribArray(an); gl.vertexAttribPointer(an, 3, gl.FLOAT, false, 36, 12); gl.vertexAttribDivisor(an, 0);
      gl.enableVertexAttribArray(au); gl.vertexAttribPointer(au, 3, gl.FLOAT, false, 36, 24); gl.vertexAttribDivisor(au, 0);
      gl.drawArrays(gl.TRIANGLES, 0, used / 9);
    }
    pass(-1.0, 0.44);
    S.GL.drawFloor(gl, ctx, fade, FLOOR);
    pass(1.0, 1.0);
    gl.disable(gl.BLEND);
  }

  function dispose(gl) {
    try { if (prog) prog.free(); gl.deleteBuffer(quad); gl.deleteBuffer(vbo); } catch (_) {}
    prog = quad = vbo = null;
  }

  /* ------------------------------------------------- escalon C · Canvas2D */
  function c2dDraw(c, ctx, fade) {
    var w = ctx.w, h = ctx.h, f = 1.0 / Math.tan(1.02 / 2), t = ctx.t;
    var g = c.createRadialGradient(w * 0.34, h * 0.28, 10, w * 0.5, h * 0.5, Math.max(w, h) * 0.85);
    g.addColorStop(0, '#3c2e22'); g.addColorStop(1, '#16110e');
    c.fillStyle = g; c.fillRect(0, 0, w, h);

    var order = []; for (var i = 0; i < Math.min(sheets.length, 16); i++) order.push(i);
    order.sort(function (a, b) { return sheets[a].z - sheets[b].z; });
    for (var k = 0; k < order.length; k++) {
      var sh = sheets[order[k]];
      var yOff = ctx.drift > 0 ? ((t * sh.fall) % 3.2) : 0;
      var pts = [];
      var edgeU = [[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]];
      for (var e = 0; e < edgeU.length; e++) {
        var p = sheetPoint(sh, edgeU[e][0], edgeU[e][1], t, ctx.drift);
        var X = sh.x + p[0], Y = sh.y0 + p[1] - yOff, Z = sh.z + p[2];
        pts.push([w * 0.5 + (X / (-Z)) * f * h * 0.5, h * 0.5 - (Y / (-Z)) * f * h * 0.5]);
      }
      var far = Math.max(0, Math.min(1, 1 + sh.z / 20));
      var warmA = Math.round(255 * (1 - sh.warm * 0.10));
      var warmB = Math.round(232 - sh.warm * 60);
      var warmC = Math.round(210 - sh.warm * 90);
      c.beginPath();
      c.moveTo(pts[0][0], pts[0][1]);
      for (var q = 1; q < pts.length; q++) c.lineTo(pts[q][0], pts[q][1]);
      c.closePath();
      c.fillStyle = 'rgba(' + warmA + ',' + warmB + ',' + warmC + ',' + (0.42 * fade * (0.4 + 0.6 * far)).toFixed(3) + ')';
      c.fill();
      c.strokeStyle = 'rgba(255,246,232,' + (0.34 * fade * far).toFixed(3) + ')';
      c.lineWidth = Math.max(0.8, 2.0 * far);
      c.stroke();
    }
  }

  function stillDraw(c, ctx) {
    var d = ctx.drift, t = ctx.t;
    ctx.drift = 0; ctx.t = 26;
    c2dDraw(c, ctx, 1);
    ctx.drift = d; ctx.t = t;
  }

  S.register({
    id: 'papel',
    es: 'Papel y viento', en: 'Paper and wind',
    des: 'Hojas de papel suspendidas que se mueven con una brisa muy lenta y dejan pasar la luz.',
    den: 'Suspended paper sheets moving in a very slow breeze, letting the light through.',
    audio: 'viento',
    gl: { init: init, draw: draw, dispose: dispose },
    c2d: { draw: c2dDraw },
    still: { draw: stillDraw }
  });
})(window);
