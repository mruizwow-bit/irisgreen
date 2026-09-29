/* R53 · Sala 2 · Jardin de luz.
   Fibras que crecen y se cruzan alrededor de la vista, agrupadas en matas, con
   semillas de luz suspendidas. Cada fibra es una curva real convertida en cinta
   de triangulos, no un asta vertical ni un laser. */
(function (window) {
  'use strict';
  var S = window.IGSalaStage;
  if (!S) return;

  var GROUPS = 24, PER = 9, SEG = 14, SEEDS = 120;
  var MAXFIB = GROUPS * PER;

  var TINTS = [
    [0.42, 0.98, 0.72], [0.62, 0.99, 0.80], [0.80, 0.97, 0.88],
    [0.46, 0.86, 0.99], [0.92, 0.99, 0.78]
  ];

  var groups = [], seeds = [];
  (function seed() {
    var TAN = 0.56, TOP = S.GL.FLOOR_Y + 5.6;
    for (var g = 0; g < GROUPS; g++) {
      var h1 = S.GL.hash(g, 3.1), h2 = S.GL.hash(g, 7.7), h3 = S.GL.hash(g, 11.3), h4 = S.GL.hash(g, 23.3);
      var z = -(2.6 + h1 * 17.0);
      var half = (-z) * TAN;
      /* color por profundidad: lo cercano calido, lo lejano frio */
      var depth = Math.min(1, (-z) / 19.0);
      groups.push({
        x: (h2 - 0.5) * half * 2.7,
        y: TOP - h3 * 0.5,
        z: z,
        len: 3.0 + h4 * 2.4,
        ph: h3 * 6.283,
        tint: depth
      });
    }
    for (var s2 = 0; s2 < SEEDS; s2++) {
      var a1 = S.GL.hash(s2, 2.3), a2 = S.GL.hash(s2, 5.9), a3 = S.GL.hash(s2, 13.1), a4 = S.GL.hash(s2, 19.7);
      var sz = -(2.2 + a1 * 17.0), sh = (-sz) * TAN;
      seeds.push({
        x: (a2 - 0.5) * sh * 2.8,
        y: S.GL.FLOOR_Y + 0.25 + a3 * 4.6,
        z: sz,
        r: 0.030 + a4 * 0.065, ph: a4 * 6.283, rise: 0.02 + a3 * 0.05,
        tint: Math.min(1, (-sz) / 19.0)
      });
    }
  })();

  /* la fibra: una curva que sale de la mata, se dobla y se abre */
  function fibrePoint(gr, f, i, t, drift) {
    var u = i / SEG;
    var hf = S.GL.hash(gr.z * 31 + f, 4.7), hb = S.GL.hash(gr.z * 17 + f, 9.3);
    var L = gr.len * (0.62 + 0.38 * hf);
    var sway = Math.sin(t * 0.11 * drift + gr.ph + f * 1.3 + u * 1.8) * 0.12 * drift * u;
    var spread = (hf - 0.5) * 1.25 + (hb - 0.5) * 0.5 * u;
    var x = gr.x + spread + sway;
    var y = gr.y - u * L;
    var zz = gr.z + (hb - 0.5) * 0.7 + Math.sin(u * 1.6 + f) * 0.18;
    return [x, y, zz, u];
  }

  var VS = [
    '#version 300 es',
    'in vec3 aPos; in vec3 aAttr;', /* lado, avance, tono */
    'uniform mat4 uProj; uniform mat4 uView;',
    'out float vSide; out float vAlong; out vec3 vTint; out float vDepth;',
    S.GL.MIRROR_GLSL,
    'vec3 depthTint(float d){',
    ' vec3 warm = vec3(1.00, 0.36, 0.62);',
    ' vec3 mid  = vec3(0.72, 0.42, 1.00);',
    ' vec3 cool = vec3(0.26, 0.72, 1.00);',
    ' return d < 0.5 ? mix(warm, mid, d * 2.0) : mix(mid, cool, (d - 0.5) * 2.0);',
    '}',
    'void main(){',
    ' vec4 c = uView * vec4(igFlip(aPos), 1.0);',
    ' vSide = aAttr.x; vAlong = aAttr.y; vTint = depthTint(aAttr.z); vDepth = -c.z;',
    ' gl_Position = uProj * c;',
    '}'
  ].join('\n');

  var FS = [
    '#version 300 es',
    'precision highp float;',
    'in float vSide; in float vAlong; in vec3 vTint; in float vDepth;',
    'uniform float uFade; uniform float uRefl;',
    'out vec4 oCol;',
    'void main(){',
    ' float s = abs(vSide);',
    /* cuerpo de fibra: halo ancho y nucleo encendido */
    /* seccion de varilla: la superficie se curva y recibe luz, no es una linea */
    ' float round_ = sqrt(max(0.0, 1.0 - s * s));',
    ' float lit = pow(clamp(round_ * 0.75 + (1.0 - abs(vSide + 0.35)) * 0.45, 0.0, 1.0), 1.4);',
    ' float halo = pow(max(0.0, 1.0 - s), 1.15);',
    ' float core = pow(max(0.0, 1.0 - s * 2.0), 2.0);',
    /* la punta se apaga: la fibra crece, no termina de golpe */
    ' float tip = smoothstep(1.0, 0.72, vAlong) * smoothstep(0.0, 0.10, vAlong);',
    ' float far = clamp(1.0 - vDepth / 22.0, 0.0, 1.0);',
    ' vec3 col = vTint * (0.42 + 0.74 * lit) + vTint * core * 0.40;',
    ' col += vec3(1.0) * core * 0.16;',
    ' float a = clamp(halo * 1.9, 0.0, 1.0) * tip * (0.35 + 0.65 * far);',
    ' oCol = vec4(col * uFade * uRefl, a * uFade * uRefl);',
    '}'
  ].join('\n');

  var SEED_VS = [
    '#version 300 es',
    'in vec2 aCorner; in vec4 aPos; in float aTint;',
    'uniform mat4 uProj; uniform mat4 uView;',
    'out vec2 vLocal; out vec3 vTint; out float vDepth;',
    S.GL.MIRROR_GLSL,
    'vec3 depthTint(float d){',
    ' vec3 warm = vec3(1.00, 0.36, 0.62); vec3 mid = vec3(0.72, 0.42, 1.00); vec3 cool = vec3(0.26, 0.72, 1.00);',
    ' return d < 0.5 ? mix(warm, mid, d * 2.0) : mix(mid, cool, (d - 0.5) * 2.0);',
    '}',
    'void main(){',
    ' vec4 c = uView * vec4(igFlip(aPos.xyz), 1.0);',
    ' c.xy += aCorner * aPos.w;',
    ' vLocal = aCorner; vTint = depthTint(aTint); vDepth = -c.z;',
    ' gl_Position = uProj * c;',
    '}'
  ].join('\n');

  var SEED_FS = [
    '#version 300 es',
    'precision highp float;',
    'in vec2 vLocal; in vec3 vTint; in float vDepth;',
    'uniform float uFade; uniform float uRefl; out vec4 oCol;',
    'void main(){',
    ' float d = length(vLocal);',
    ' float g = pow(max(0.0, 1.0 - d), 2.6);',
    ' float c = pow(max(0.0, 1.0 - d * 3.0), 3.0);',
    ' float far = clamp(1.0 - vDepth / 22.0, 0.0, 1.0);',
    ' vec3 col = vTint * (g * 0.5 + c * 0.9) + vec3(1.0) * c * 0.3;',
    ' oCol = vec4(col * uFade * uRefl, (g * 0.55 + c) * (0.25 + 0.75 * far) * uFade * uRefl);',
    '}'
  ].join('\n');

  var WALL = { a: [0.055, 0.030, 0.115], b: [0.215, 0.095, 0.330], glow: [0.150, 0.045, 0.175], glowAt: [0.10, 0.35] };
  var FLOOR = { tint: [0.075, 0.040, 0.125], gloss: 0.80 };

  var prog = null, sprog = null, quad = null;
  var vbo = null, sbo = null, verts = null, sinst = null;

  function init(gl) {
    prog = S.GL.program(gl, VS, FS);
    sprog = S.GL.program(gl, SEED_VS, SEED_FS);
    quad = S.GL.unitQuad(gl);
    verts = new Float32Array(MAXFIB * SEG * 6 * 6);
    sinst = new Float32Array(SEEDS * 5);
    vbo = gl.createBuffer(); sbo = gl.createBuffer();
  }

  function buildFibres(ctx, nGroups) {
    var o = 0, t = ctx.t, drift = ctx.drift;
    for (var g = 0; g < nGroups; g++) {
      var gr = groups[g];
      for (var f = 0; f < PER; f++) {
        var prev = fibrePoint(gr, f, 0, t, drift);
        for (var i = 1; i <= SEG; i++) {
          var cur = fibrePoint(gr, f, i, t, drift);
          var dx = cur[0] - prev[0], dy = cur[1] - prev[1];
          var l = Math.hypot(dx, dy) || 1;
          var nx = -dy / l, ny = dx / l;
          var wPrev = 0.085 + 0.035 * (1 - prev[3]);
          var wCur = 0.085 + 0.035 * (1 - cur[3]);
          var tint = gr.tint;
          /* dos triangulos por segmento */
          var quadPts = [
            [prev[0] + nx * wPrev, prev[1] + ny * wPrev, prev[2], 1, prev[3]],
            [prev[0] - nx * wPrev, prev[1] - ny * wPrev, prev[2], -1, prev[3]],
            [cur[0] + nx * wCur, cur[1] + ny * wCur, cur[2], 1, cur[3]],
            [cur[0] + nx * wCur, cur[1] + ny * wCur, cur[2], 1, cur[3]],
            [prev[0] - nx * wPrev, prev[1] - ny * wPrev, prev[2], -1, prev[3]],
            [cur[0] - nx * wCur, cur[1] - ny * wCur, cur[2], -1, cur[3]]
          ];
          for (var q = 0; q < 6; q++) {
            var pt = quadPts[q];
            verts[o++] = pt[0]; verts[o++] = pt[1]; verts[o++] = pt[2];
            verts[o++] = pt[3]; verts[o++] = pt[4]; verts[o++] = tint;
          }
          prev = cur;
        }
      }
    }
    return o;
  }

  function draw(gl, ctx, fade) {
    var nGroups = Math.max(3, Math.round(GROUPS * (0.45 + 0.55 * ctx.quality)));
    var nSeeds = Math.max(24, Math.round(SEEDS * (0.4 + 0.6 * ctx.quality)));

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    S.GL.drawWall(gl, ctx, fade, WALL);

    var used = buildFibres(ctx, nGroups);

    function fibrePass(flip, refl) {
      prog.use();
      gl.uniformMatrix4fv(prog.u('uProj'), false, ctx.proj);
      gl.uniformMatrix4fv(prog.u('uView'), false, ctx.view);
      gl.uniform1f(prog.u('uFade'), fade);
      gl.uniform2f(prog.u('uFlip'), flip, S.GL.FLOOR_Y);
      gl.uniform1f(prog.u('uRefl'), refl);
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      var ap = prog.a('aPos'), aa = prog.a('aAttr');
      gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap, 3, gl.FLOAT, false, 24, 0); gl.vertexAttribDivisor(ap, 0);
      gl.enableVertexAttribArray(aa); gl.vertexAttribPointer(aa, 3, gl.FLOAT, false, 24, 12); gl.vertexAttribDivisor(aa, 0);
      gl.drawArrays(gl.TRIANGLES, 0, used / 6);
    }
    function seedPass(flip, refl, count) {
      sprog.use();
      gl.uniformMatrix4fv(sprog.u('uProj'), false, ctx.proj);
      gl.uniformMatrix4fv(sprog.u('uView'), false, ctx.view);
      gl.uniform1f(sprog.u('uFade'), fade);
      gl.uniform2f(sprog.u('uFlip'), flip, S.GL.FLOOR_Y);
      gl.uniform1f(sprog.u('uRefl'), refl);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      var sc = sprog.a('aCorner');
      gl.enableVertexAttribArray(sc); gl.vertexAttribPointer(sc, 2, gl.FLOAT, false, 0, 0); gl.vertexAttribDivisor(sc, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, sbo);
      var sp = sprog.a('aPos'), st = sprog.a('aTint');
      gl.enableVertexAttribArray(sp); gl.vertexAttribPointer(sp, 4, gl.FLOAT, false, 20, 0); gl.vertexAttribDivisor(sp, 1);
      gl.enableVertexAttribArray(st); gl.vertexAttribPointer(st, 1, gl.FLOAT, false, 20, 16); gl.vertexAttribDivisor(st, 1);
      gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, count);
    }

    var t = ctx.t, o = 0;
    for (var i = 0; i < nSeeds; i++) {
      var sd = seeds[i];
      var y = sd.y + (ctx.drift > 0 ? Math.sin(t * sd.rise + sd.ph) * 0.35 : 0);
      sinst[o++] = sd.x; sinst[o++] = y; sinst[o++] = sd.z;
      sinst[o++] = sd.r * (0.85 + 0.15 * Math.sin(t * 0.4 + sd.ph));
      sinst[o++] = sd.tint;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, sbo);
    gl.bufferData(gl.ARRAY_BUFFER, sinst.subarray(0, o), gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, verts.subarray(0, used), gl.DYNAMIC_DRAW);

    /* reflejo */
    fibrePass(-1.0, 0.48);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    seedPass(-1.0, 0.40, nSeeds);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    S.GL.drawFloor(gl, ctx, fade, FLOOR);

    /* escena */
    fibrePass(1.0, 1.0);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    seedPass(1.0, 1.0, nSeeds);
    gl.disable(gl.BLEND);
  }

  function dispose(gl) {
    try { if (prog) prog.free(); if (sprog) sprog.free();
      gl.deleteBuffer(quad); gl.deleteBuffer(vbo); gl.deleteBuffer(sbo); } catch (_) {}
    prog = sprog = quad = vbo = sbo = null;
  }

  /* ------------------------------------------------- escalon C · Canvas2D */
  function c2dDraw(c, ctx, fade) {
    var w = ctx.w, h = ctx.h, f = 1.0 / Math.tan(1.02 / 2), t = ctx.t;
    var g = c.createRadialGradient(w * 0.5, h * 0.45, 10, w * 0.5, h * 0.5, Math.max(w, h) * 0.8);
    g.addColorStop(0, '#0e1d1b'); g.addColorStop(1, '#040a0c');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.globalCompositeOperation = 'lighter';
    function proj(p) {
      return [w * 0.5 + (p[0] / (-p[2])) * f * h * 0.5, h * 0.5 - (p[1] / (-p[2])) * f * h * 0.5];
    }
    for (var gi = 0; gi < Math.min(groups.length, 7); gi++) {
      var gr = groups[gi], tint = TINTS[gr.tint];
      var rgb = Math.round(tint[0] * 255) + ',' + Math.round(tint[1] * 255) + ',' + Math.round(tint[2] * 255);
      for (var fi = 0; fi < PER; fi++) {
        c.beginPath();
        for (var i = 0; i <= SEG; i += 2) {
          var p = proj(fibrePoint(gr, fi, i, t, ctx.drift));
          if (i === 0) c.moveTo(p[0], p[1]); else c.lineTo(p[0], p[1]);
        }
        var far = Math.max(0, Math.min(1, 1 + gr.z / 22));
        c.strokeStyle = 'rgba(' + rgb + ',' + (0.10 * fade * (0.3 + 0.7 * far)).toFixed(3) + ')';
        c.lineWidth = Math.max(2, 26 * far); c.lineCap = 'round'; c.stroke();
        c.strokeStyle = 'rgba(' + rgb + ',' + (0.55 * fade * (0.3 + 0.7 * far)).toFixed(3) + ')';
        c.lineWidth = Math.max(1, 5 * far); c.stroke();
        c.strokeStyle = 'rgba(255,255,255,' + (0.30 * fade * far).toFixed(3) + ')';
        c.lineWidth = Math.max(0.6, 1.6 * far); c.stroke();
      }
    }
    for (var s = 0; s < Math.min(seeds.length, 60); s++) {
      var sd = seeds[s];
      var y = sd.y + (ctx.drift > 0 ? Math.sin(t * sd.rise + sd.ph) * 0.5 : 0);
      var pp = proj([sd.x, y, sd.z]);
      var r = Math.max(1, (sd.r / (-sd.z)) * f * h * 0.5 * 3.2);
      var tn = TINTS[sd.tint];
      var rg = c.createRadialGradient(pp[0], pp[1], 0, pp[0], pp[1], r);
      rg.addColorStop(0, 'rgba(255,255,255,' + (0.75 * fade).toFixed(3) + ')');
      rg.addColorStop(0.4, 'rgba(' + Math.round(tn[0] * 255) + ',' + Math.round(tn[1] * 255) + ',' + Math.round(tn[2] * 255) + ',' + (0.4 * fade).toFixed(3) + ')');
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = rg; c.beginPath(); c.arc(pp[0], pp[1], r, 0, 6.2832); c.fill();
    }
    c.globalCompositeOperation = 'source-over';
  }

  function stillDraw(c, ctx) {
    var d = ctx.drift, t = ctx.t;
    ctx.drift = 0; ctx.t = 30;
    c2dDraw(c, ctx, 1);
    ctx.drift = d; ctx.t = t;
  }

  S.register({
    id: 'jardin',
    es: 'Jardín de luz', en: 'Garden of light',
    des: 'Fibras luminosas que crecen y se cruzan alrededor, con semillas de luz suspendidas.',
    den: 'Luminous fibres growing and crossing around you, with seeds of light suspended.',
    audio: null,
    gl: { init: init, draw: draw, dispose: dispose },
    c2d: { draw: c2dDraw },
    still: { draw: stillDraw }
  });
})(window);
