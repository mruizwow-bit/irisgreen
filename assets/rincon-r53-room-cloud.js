/* R53 · Sala 4 · Dentro de una nube.
   Masas escultoricas blandas: cada masa son varios lobulos que se funden en un
   solo cuerpo mediante union suave, con luz que atraviesa el material.
   No hay cielo, ni horizonte, ni niebla: el fondo es la luz neutra de una sala
   de exposicion. */
(function (window) {
  'use strict';
  var S = window.IGSalaStage;
  if (!S) return;

  var MASSES = 15, LOBES = 6;

  var masses = [];
  (function seed() {
    var TAN = 0.56;
    for (var i = 0; i < MASSES; i++) {
      var h1 = S.GL.hash(i, 3.7), h2 = S.GL.hash(i, 8.3), h3 = S.GL.hash(i, 12.9), h4 = S.GL.hash(i, 17.1);
      var z, R;
      if (i < 2) { z = -(4.2 + h1 * 1.8); R = 1.00 + h2 * 0.60; }
      else { z = -(6.5 + h1 * 13.0); R = 0.95 + h2 * 1.5; }
      var half = (-z) * TAN;
      var lobes = [];
      for (var l = 0; l < LOBES; l++) {
        var a = S.GL.hash(i * 31 + l, 5.1), b = S.GL.hash(i * 31 + l, 9.7), c = S.GL.hash(i * 31 + l, 14.3);
        lobes.push({
          ox: (a - 0.5) * 1.5, oy: (b - 0.5) * 1.0, oz: (c - 0.5) * 0.9,
          r: 0.52 + a * 0.55, ph: b * 6.283, sp: 0.10 + c * 0.16
        });
      }
      masses.push({
        x: (h3 - 0.5) * half * 2.9,
        y: S.GL.FLOOR_Y + 0.85 + h4 * 4.6,
        z: z, R: R, lobes: lobes,
        ph: h2 * 6.283, rise: 0.012 + h4 * 0.030
      });
    }
  })();

  var VS = [
    '#version 300 es',
    'in vec2 aCorner;',
    'uniform mat4 uProj; uniform mat4 uView; uniform vec4 uMass;',
    S.GL.MIRROR_GLSL,
    'out vec2 vLocal; out float vDepth; out vec3 vView;',
    'void main(){',
    ' vec4 c = uView * vec4(igFlip(uMass.xyz), 1.0);',
    ' c.xy += aCorner * uMass.w;',
    ' vLocal = aCorner; vDepth = -c.z; vView = c.xyz;',
    ' gl_Position = uProj * c;',
    '}'
  ].join('\n');

  var FS = [
    '#version 300 es',
    'precision highp float;',
    'in vec2 vLocal; in float vDepth; in vec3 vView;',
    'uniform vec4 uLobes[6];',   /* xy = centro relativo, z = profundidad relativa, w = radio */
    'uniform int uCount; uniform float uFade; uniform float uSoft; uniform float uRefl;',
    'out vec4 oCol;',
    /* Union suave: los lobulos dejan de ser bolas y pasan a ser un cuerpo.
       El gradiente sale del mismo bucle en forma analitica, de modo que no hacen
       falta cuatro muestreos extra por pixel. */
    'vec3 fieldAndGrad(vec2 p){',
    ' float h = 0.0; vec2 g = vec2(0.0);',
    ' for(int i = 0; i < 6; i++){',
    '  if(i >= uCount) break;',
    '  vec2 d = p - uLobes[i].xy;',
    '  float r2 = uLobes[i].w * uLobes[i].w;',
    '  float f = 1.0 - dot(d, d) / r2;',
    '  if(f > 0.0){ h += f * f; g += -4.0 * f * d / r2; }',
    ' }',
    ' return vec3(h, g);',
    '}',
    'void main(){',
    ' vec3 hg = fieldAndGrad(vLocal);',
    ' float h = hg.x;',
    ' float aa = max(fwidth(h), 0.004);',
    ' float cov = smoothstep(0.30 - aa * 1.6, 0.30 + aa * 1.6, h);',
    ' if(cov <= 0.002) discard;',
    /* la altura del campo hace de espesor y el gradiente da la normal */
    ' float thick = clamp((h - 0.30) * 1.1, 0.0, 1.0);',
    ' vec3 n = normalize(vec3(-hg.y * 0.055, -hg.z * 0.055, 0.55 + thick * 0.9));',
    ' vec3 L = normalize(vec3(-0.34, 0.80, 0.50));',
    ' float key = clamp(dot(n, L), 0.0, 1.0);',
    ' float wrap = clamp(dot(n, L) * 0.5 + 0.5, 0.0, 1.0);',
    /* la luz atraviesa el material: lo fino se enciende por dentro */
    ' float through = pow(1.0 - thick, 2.0) * 0.85;',
    ' vec3 body = vec3(0.985, 0.975, 0.965);',
    ' vec3 shade = vec3(0.560, 0.575, 0.620);',
    ' vec3 col = mix(shade, body, 0.20 + 0.66 * wrap);',
    ' col += body * pow(key, 2.2) * 0.30;',
    ' col += vec3(1.00, 0.97, 0.92) * through * 0.30;',
    ' float far = clamp(1.0 - vDepth / 22.0, 0.0, 1.0);',
    ' col = mix(vec3(0.430, 0.470, 0.580), col, 0.34 + 0.66 * far);',
    ' oCol = vec4(col * uFade * uRefl, cov * uFade * uSoft * uRefl);',
    '}'
  ].join('\n');

  var WALL = { a: [0.215, 0.250, 0.360], b: [0.620, 0.560, 0.640], glow: [0.180, 0.150, 0.120], glowAt: [0.05, 0.62] };
  var FLOOR = { tint: [0.145, 0.150, 0.190], gloss: 0.70 };

  var prog = null, quad = null, lobeBuf = new Float32Array(LOBES * 4);

  function init(gl) {
    prog = S.GL.program(gl, VS, FS);
    quad = S.GL.unitQuad(gl);
  }

  function draw(gl, ctx, fade) {
    var n = Math.max(4, Math.round(MASSES * (0.45 + 0.55 * ctx.quality)));
    var t = ctx.t, drift = ctx.drift;

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    S.GL.drawWall(gl, ctx, fade, WALL);

    var order = [];
    for (var i = 0; i < n; i++) order.push(i);
    order.sort(function (a, b) { return masses[a].z - masses[b].z; });

    function pass(flip, refl) {
      prog.use();
      gl.uniformMatrix4fv(prog.u('uProj'), false, ctx.proj);
      gl.uniformMatrix4fv(prog.u('uView'), false, ctx.view);
      gl.uniform1f(prog.u('uFade'), fade);
      gl.uniform1f(prog.u('uSoft'), ctx.level === 'normal' ? 1.0 : 0.92);
      gl.uniform1i(prog.u('uCount'), LOBES);
      gl.uniform2f(prog.u('uFlip'), flip, S.GL.FLOOR_Y);
      gl.uniform1f(prog.u('uRefl'), refl);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      var ac = prog.a('aCorner');
      gl.enableVertexAttribArray(ac); gl.vertexAttribPointer(ac, 2, gl.FLOAT, false, 0, 0); gl.vertexAttribDivisor(ac, 0);
      for (var k = 0; k < order.length; k++) {
        var m = masses[order[k]];
        var yy = m.y + (drift > 0 ? Math.sin(t * m.rise * 6.0 + m.ph) * 0.42 : 0);
        var extent = 0;
        for (var l = 0; l < LOBES; l++) {
          var lo = m.lobes[l];
          var br = Math.sin(t * lo.sp * drift + lo.ph);
          var ox = lo.ox + br * 0.06 * drift;
          var oy = lo.oy + Math.cos(t * lo.sp * 0.8 * drift + lo.ph) * 0.05 * drift;
          var r = lo.r * (1 + 0.05 * br * drift);
          lobeBuf[l * 4] = ox; lobeBuf[l * 4 + 1] = oy; lobeBuf[l * 4 + 2] = lo.oz; lobeBuf[l * 4 + 3] = r;
          extent = Math.max(extent, Math.hypot(ox, oy) + r);
        }
        var pad = (extent + 0.22);
        for (var q = 0; q < LOBES; q++) {
          lobeBuf[q * 4] /= pad; lobeBuf[q * 4 + 1] /= pad; lobeBuf[q * 4 + 3] /= pad;
        }
        gl.uniform4f(prog.u('uMass'), m.x, yy, m.z, m.R * pad);
        gl.uniform4fv(prog.u('uLobes[0]'), lobeBuf);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    }
    pass(-1.0, 0.42);
    S.GL.drawFloor(gl, ctx, fade, FLOOR);
    pass(1.0, 1.0);
    gl.disable(gl.BLEND);
  }

  function dispose(gl) {
    try { if (prog) prog.free(); gl.deleteBuffer(quad); } catch (_) {}
    prog = quad = null;
  }

  /* ------------------------------------------------- escalon C · Canvas2D */
  function c2dDraw(c, ctx, fade) {
    var w = ctx.w, h = ctx.h, f = 1.0 / Math.tan(1.02 / 2), t = ctx.t;
    var g = c.createRadialGradient(w * 0.5, h * 0.12, 10, w * 0.5, h * 0.55, Math.max(w, h) * 0.95);
    g.addColorStop(0, '#c2c2c0'); g.addColorStop(1, '#6d6f77');
    c.fillStyle = g; c.fillRect(0, 0, w, h);

    var order = []; for (var i = 0; i < Math.min(masses.length, 8); i++) order.push(i);
    order.sort(function (a, b) { return masses[a].z - masses[b].z; });
    for (var k = 0; k < order.length; k++) {
      var m = masses[order[k]];
      var yy = m.y + (ctx.drift > 0 ? Math.sin(t * m.rise * 6.0 + m.ph) * 0.55 : 0);
      var far = Math.max(0, Math.min(1, 1 + m.z / 22));
      for (var l = 0; l < LOBES; l++) {
        var lo = m.lobes[l];
        var X = m.x + lo.ox * m.R, Y = yy + lo.oy * m.R, Z = m.z + lo.oz * m.R;
        var sx = w * 0.5 + (X / (-Z)) * f * h * 0.5;
        var sy = h * 0.5 - (Y / (-Z)) * f * h * 0.5;
        var sr = (lo.r * m.R / (-Z)) * f * h * 0.5;
        if (sr < 1) continue;
        var rg = c.createRadialGradient(sx - sr * 0.30, sy - sr * 0.45, sr * 0.06, sx, sy, sr * 1.05);
        rg.addColorStop(0, 'rgba(252,250,246,' + (0.95 * fade).toFixed(3) + ')');
        rg.addColorStop(0.6, 'rgba(226,227,230,' + (0.88 * fade).toFixed(3) + ')');
        rg.addColorStop(1, 'rgba(160,164,176,' + (0.80 * fade).toFixed(3) + ')');
        c.globalAlpha = 0.35 + 0.65 * far;
        c.fillStyle = rg; c.beginPath(); c.arc(sx, sy, sr, 0, 6.2832); c.fill();
        c.globalAlpha = 1;
      }
    }
  }

  function stillDraw(c, ctx) {
    var d = ctx.drift, t = ctx.t;
    ctx.drift = 0; ctx.t = 22;
    c2dDraw(c, ctx, 1);
    ctx.drift = d; ctx.t = t;
  }

  S.register({
    id: 'nubes',
    es: 'Dentro de una nube', en: 'Inside a cloud',
    des: 'Masas blandas de gran tamaño que te rodean, con la luz atravesando el material.',
    den: 'Large soft masses surrounding you, with light passing through the material.',
    audio: null,
    gl: { init: init, draw: draw, dispose: dispose },
    c2d: { draw: c2dDraw },
    still: { draw: stillDraw }
  });
})(window);
