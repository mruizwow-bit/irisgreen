/* R46-CLAUDE · Respirar · bola con volumen, núcleo, halo controlado y profundidad.
   Escalones: A WebGPU/WGSL · B WebGL2 · C Canvas2D · D estática accesible.
   Nada empieza solo. Sin destellos. Sin háptica. Sin telemetría. */
(function (window, document) {
  'use strict';

  /* ATMOSFERA DE LA ESCENA · excepcion documentada (norma de tokens, punto 9.2)
     Decision de Maria del 29/09/2026: la escena de Respirar conserva su propia
     atmosfera oscura en LIGHT y en DARK NAVY. No es superficie de interfaz: es
     el arte de la experiencia, y su oscuridad es parte de lo que hace. El
     chrome que la rodea si cambia con el tema global.

     Estos tres colores son, por tanto, color propio de arte y no hardcodes de
     interfaz. No hay ningun otro color de interfaz sin token en este fichero. */
  var ATMOSFERA = {
    cerca: [0.075, 0.125, 0.161],   /* #13202a · el aire junto a la bola */
    lejos: [0.039, 0.059, 0.078],   /* #0a0f14 · el fondo, oscuro pero no negro */
    veloCSS: 'rgba(10,15,20,'
  };
  function css(c) {
    return 'rgb(' + Math.round(c[0] * 255) + ',' + Math.round(c[1] * 255) + ',' + Math.round(c[2] * 255) + ')';
  }

  var PATTERNS = {
    watch: { inhale: 0, exhale: 0, period: 16, guided: false },
    '4-6': { inhale: 4, exhale: 6, period: 10, guided: true },
    '6-6': { inhale: 6, exhale: 6, period: 12, guided: true }
  };

  var LEVELS = {
    suave:  { amp: 0.085, halo: 0.34, noise: 0.55, core: 0.86, steps: 10 },
    normal: { amp: 0.135, halo: 0.50, noise: 0.85, core: 1.00, steps: 14 }
  };

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function smooth(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }

  /* ---------------------------------------------------------------- ciclo */
  function Cycle(pattern) {
    this.set(pattern);
    this.t = 0;
    this.phase = 'idle';
  }
  Cycle.prototype.set = function (p) {
    this.p = PATTERNS[p] ? p : 'watch';
    this.cfg = PATTERNS[this.p];
  };
  /* devuelve 0..1 de forma continua y predecible: sin saltos, sin rebotes */
  Cycle.prototype.value = function (elapsed) {
    var c = this.cfg;
    if (!c.guided) {
      this.phase = 'watch';
      return 0.5 - 0.5 * Math.cos((elapsed / c.period) * Math.PI * 2);
    }
    var t = elapsed % c.period;
    if (t < c.inhale) { this.phase = 'in'; return smooth(t / c.inhale); }
    this.phase = 'out';
    return 1 - smooth((t - c.inhale) / c.exhale);
  };
  Cycle.prototype.remaining = function (elapsed) {
    var c = this.cfg;
    if (!c.guided) return null;
    var t = elapsed % c.period;
    return t < c.inhale ? (c.inhale - t) : (c.period - t);
  };

  /* ------------------------------------------------------------- shaders */
  var COMMON_GLSL = [
    'float h31(vec3 p){p=fract(p*0.3183099+vec3(0.11,0.27,0.43));p*=17.0;',
    ' return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}',
    'float n31(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.0-2.0*f);',
    ' return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x),mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x),f.y),',
    '            mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x),mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x),f.y),f.z);}',
    'float fbm(vec3 p){return 0.58*n31(p)+0.28*n31(p*2.03)+0.14*n31(p*4.11);}'
  ].join('\n');

  var VERT = [
    '#version 300 es',
    'in vec2 aPos; void main(){ gl_Position = vec4(aPos,0.0,1.0); }'
  ].join('\n');

  /* Cuerpo compartido por GLSL y WGSL. Esfera analitica en espacio de pantalla:
     borde suavizado por derivadas, terminador real, translucidez hacia el nucleo,
     oclusion inferior que da peso, y compresion suave de altas luces para que
     ninguna variacion pueda llegar a destello. */
  var FRAG = [
    '#version 300 es',
    'precision highp float;',
    'out vec4 oCol;',
    'uniform vec2 uRes; uniform float uT; uniform float uV;',
    'uniform float uAmp; uniform float uHalo; uniform float uNoise; uniform float uCore;',
    'uniform int uSteps; uniform float uFade;',
    COMMON_GLSL,
    'const vec3 SHADOW = vec3(0.036,0.098,0.150);',
    'const vec3 BODY   = vec3(0.216,0.451,0.596);',
    'const vec3 LIT    = vec3(0.718,0.855,0.933);',
    'const vec3 CORE   = vec3(0.925,0.965,1.000);',
    'const vec3 WARM   = vec3(0.886,0.827,0.918);',
    'uniform vec3 uBgA; uniform vec3 uBgB;',
    'void main(){',
    ' vec2 uv=(gl_FragCoord.xy*2.0-uRes)/min(uRes.x,uRes.y);',
    ' float R=0.44*(1.0+uAmp*uV);',
    /* fondo oscuro suave, con una fuente difusa arriba a la izquierda */
    ' float bgd=length(uv*vec2(0.86,1.0));',
    ' vec3 col=mix(uBgB,uBgA,smoothstep(0.05,1.45,bgd));',
    ' col+=uBgB*0.22*(1.0-smoothstep(0.0,1.10,length(uv-vec2(-0.42,0.46))));',
    /* apoyo: sombra elíptica bajo la bola */
    ' vec2 fl=(uv-vec2(0.04,-R*1.30))*vec2(1.30,4.30);',
    ' col=mix(col,uBgA*0.46,clamp(exp(-dot(fl,fl)*2.35)*(0.66+0.16*uV),0.0,0.74));',
    /* esfera */
    ' float rr=length(uv)/R;',
    ' float aa=max(fwidth(rr),0.0008);',
    ' float mask=1.0-smoothstep(1.0-aa*1.6,1.0+aa*0.6,rr);',
    /* halo: estrecho, acotado, sin aditividad libre */
    ' float outd=max(rr-1.0,0.0);',
    ' float halo=exp(-outd*4.6)*0.155+exp(-outd*1.25)*0.042;',
    ' col+=mix(BODY,LIT,0.42)*halo*uHalo*(0.62+0.38*uV)*(1.0-mask);',
    ' if(mask>0.0){',
    '  float rc=min(rr,0.99995);',
    '  float z=sqrt(max(0.0,1.0-rc*rc));',
    '  vec3 n=normalize(vec3(uv/R,z));',
    '  vec3 L=normalize(vec3(-0.54,0.56,0.42));',
    '  float ndl=dot(n,L);',
    /* terminador real pero blando: nada de borde duro, nada de plano */
    '  float key=smoothstep(-0.32,0.98,ndl);',
    '  float wrap=smoothstep(-0.85,0.75,ndl);',
    /* peso: la parte baja recibe menos luz rebotada */
    '  float ao=mix(0.46,1.0,smoothstep(-0.95,0.45,n.y));',
    /* volumen interno: densidad lenta, jamas rapida */
    '  vec3 q=vec3(uv/R,z)*1.85+vec3(0.0,uT*0.024,uT*0.015);',
    '  float f=fbm(q)-0.5;',
    '  float dens=clamp(0.5+uNoise*f*0.9,0.0,1.0);',
    /* translucidez: la luz entra y el centro se ve por dentro */
    '  float thick=pow(1.0-rc,1.45);',
    '  float sss=thick*(0.42+0.58*wrap)*(0.82+0.36*dens);',
    /* nucleo: desplazado un poco hacia la luz, estable */
    '  float cd=clamp(1.0-length(uv-vec2(-R*0.24,R*0.21))/(R*1.02),0.0,1.0);',
    '  float core=pow(cd,2.55)*uCore*(0.34+0.20*uV);',
    /* limbo frio, amplitud baja */
    '  float rim=pow(1.0-z,3.6)*0.30;',
    '  vec3 s=mix(SHADOW,BODY,wrap*0.88);',
    '  s=mix(s,LIT,key*0.72);',
    '  s*=ao;',
    '  s+=mix(BODY,LIT,0.60)*sss*0.52;',
    '  s+=mix(CORE,WARM,0.22)*core;',
    '  s+=mix(BODY,LIT,0.30)*rim;',
    '  col=mix(col,s,mask);',
    ' }',
    /* compresion solo de altas luces: conserva el medio tono, impide estallidos */
    ' col=1.0-exp(-col*1.28);',
    ' col=pow(max(col,0.0),vec3(0.94));',
    ' float dith=(h31(vec3(gl_FragCoord.xy,floor(uT*24.0)))-0.5)/255.0;',
    ' oCol=vec4(clamp(col+dith,0.0,1.0)*uFade,1.0);',
    '}'
  ].join('\n');

  /* ------------------------------------------------------------- WebGL2 */
  function makeGL(canvas) {
    var gl = null;
    try {
      gl = canvas.getContext('webgl2', {
        alpha: false, antialias: false, depth: false, stencil: false,
        powerPreference: 'low-power', preserveDrawingBuffer: false
      });
    } catch (e) { return null; }
    if (!gl) return null;

    function sh(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
      return s;
    }
    var vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    var pr = gl.createProgram();
    gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
    gl.useProgram(pr);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var U = {};
    ['uRes', 'uT', 'uV', 'uAmp', 'uHalo', 'uNoise', 'uCore', 'uSteps', 'uFade', 'uBgA', 'uBgB'].forEach(function (k) {
      U[k] = gl.getUniformLocation(pr, k);
    });

    return {
      tier: 'B', label: 'WebGL2',
      draw: function (w, h, t, v, lv, fade) {
        gl.viewport(0, 0, w, h);
        gl.uniform2f(U.uRes, w, h);
        gl.uniform1f(U.uT, t); gl.uniform1f(U.uV, v);
        gl.uniform1f(U.uAmp, lv.amp); gl.uniform1f(U.uHalo, lv.halo);
        gl.uniform1f(U.uNoise, lv.noise); gl.uniform1f(U.uCore, lv.core);
        gl.uniform1i(U.uSteps, lv.steps); gl.uniform1f(U.uFade, fade);
        gl.uniform3fv(U.uBgA, ATMOSFERA.lejos); gl.uniform3fv(U.uBgB, ATMOSFERA.cerca);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      },
      destroy: function () {
        try {
          gl.deleteProgram(pr); gl.deleteBuffer(buf);
          var e = gl.getExtension('WEBGL_lose_context'); if (e) e.loseContext();
        } catch (_) {}
      }
    };
  }

  /* ------------------------------------------------------------ Canvas2D */
  function makeC2D(canvas) {
    var ctx = null;
    try { ctx = canvas.getContext('2d', { alpha: false }); } catch (e) { return null; }
    if (!ctx) return null;

    return {
      tier: 'C', label: 'Canvas2D',
      draw: function (w, h, t, v, lv, fade) {
        var cx = w / 2, cy = h / 2, m = Math.min(w, h);
        var R = m * 0.22 * (1 + lv.amp * v);

        /* fondo oscuro suave con fuente difusa arriba a la izquierda */
        var bg = ctx.createRadialGradient(cx - m * 0.21, cy - m * 0.23, m * 0.02, cx, cy, m * 0.78);
        bg.addColorStop(0, css(ATMOSFERA.cerca)); bg.addColorStop(1, css(ATMOSFERA.lejos));
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

        /* sombra de contacto: da apoyo y profundidad */
        ctx.save();
        ctx.translate(cx + R * 0.05, cy + R * 1.30);
        ctx.scale(1, 0.30);
        var fg = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 1.05);
        fg.addColorStop(0, 'rgba(3,6,9,' + (0.66 + 0.16 * v).toFixed(3) + ')');
        fg.addColorStop(1, 'rgba(3,6,9,0)');
        ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(0, 0, R * 1.05, 0, 6.2832); ctx.fill();
        ctx.restore();

        /* halo estrecho y acotado */
        var hg = ctx.createRadialGradient(cx, cy, R * 0.98, cx, cy, R * 1.80);
        hg.addColorStop(0, 'rgba(120,170,202,' + (0.13 * lv.halo * (0.62 + 0.38 * v)).toFixed(3) + ')');
        hg.addColorStop(0.45, 'rgba(120,170,202,' + (0.04 * lv.halo).toFixed(3) + ')');
        hg.addColorStop(1, 'rgba(120,170,202,0)');
        ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(cx, cy, R * 1.80, 0, 6.2832); ctx.fill();

        ctx.save();
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.clip();

        /* cuerpo: luz desplazada hacia arriba-izquierda */
        var lx = cx - R * 0.42, ly = cy - R * 0.44;
        var g = ctx.createRadialGradient(lx, ly, R * 0.04, cx, cy, R * 1.32);
        g.addColorStop(0.00, '#cfe3f0');
        g.addColorStop(0.30, '#9fc1d7');
        g.addColorStop(0.62, '#5a8aa9');
        g.addColorStop(1.00, '#14313f');
        ctx.fillStyle = g; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

        /* terminador: la cara opuesta a la luz pierde intensidad de forma continua */
        var sx = cx + R * 0.58, sy = cy + R * 0.60;
        var sg = ctx.createRadialGradient(sx, sy, R * 0.10, sx, sy, R * 1.65);
        sg.addColorStop(0, 'rgba(6,20,30,0.60)');
        sg.addColorStop(0.55, 'rgba(6,20,30,0.20)');
        sg.addColorStop(1, 'rgba(6,20,30,0)');
        ctx.fillStyle = sg; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

        /* volumen interno: dos densidades muy lentas */
        for (var i = 0; i < 2; i++) {
          var a = t * (0.021 + i * 0.009) + i * 2.1;
          var ox = cx + Math.cos(a) * R * 0.22, oy = cy + Math.sin(a * 0.81) * R * 0.19;
          var vg = ctx.createRadialGradient(ox, oy, 0, ox, oy, R * 0.66);
          vg.addColorStop(0, 'rgba(226,238,247,' + (0.055 * lv.noise).toFixed(3) + ')');
          vg.addColorStop(1, 'rgba(226,238,247,0)');
          ctx.fillStyle = vg; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
        }

        /* nucleo: desplazado hacia la luz, estable */
        var nx = cx - R * 0.24, ny = cy - R * 0.21;
        var cg = ctx.createRadialGradient(nx, ny, 0, nx, ny, R * 1.02);
        cg.addColorStop(0, 'rgba(238,246,253,' + (0.30 * lv.core * (0.34 + 0.20 * v) / 0.54).toFixed(3) + ')');
        cg.addColorStop(0.5, 'rgba(238,246,253,' + (0.05 * lv.core).toFixed(3) + ')');
        cg.addColorStop(1, 'rgba(238,246,253,0)');
        ctx.fillStyle = cg; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

        /* limbo frio de amplitud baja */
        var rg = ctx.createRadialGradient(cx, cy, R * 0.82, cx, cy, R);
        rg.addColorStop(0, 'rgba(150,196,222,0)');
        rg.addColorStop(1, 'rgba(150,196,222,0.16)');
        ctx.fillStyle = rg; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
        ctx.restore();

        if (fade < 1) {
          ctx.fillStyle = ATMOSFERA.veloCSS + (1 - fade).toFixed(3) + ')';
          ctx.fillRect(0, 0, w, h);
        }
      },
      destroy: function () {}
    };
  }

  /* -------------------------------------------------------- WebGPU (WGSL) */
  var WGSL = [
    'struct U { res: vec2<f32>, t: f32, v: f32, amp: f32, halo: f32, noise: f32, core: f32, steps: f32, fade: f32 };',
    '@group(0) @binding(0) var<uniform> u: U;',
    '@vertex fn vs(@builtin(vertex_index) i: u32) -> @builtin(position) vec4<f32> {',
    '  var p = array<vec2<f32>,3>(vec2<f32>(-1.0,-1.0), vec2<f32>(3.0,-1.0), vec2<f32>(-1.0,3.0));',
    '  return vec4<f32>(p[i], 0.0, 1.0);',
    '}',
    'fn h31(pin: vec3<f32>) -> f32 {',
    '  var p = fract(pin * 0.3183099 + vec3<f32>(0.11,0.27,0.43));',
    '  p = p * 17.0;',
    '  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));',
    '}',
    'fn n31(x: vec3<f32>) -> f32 {',
    '  let i = floor(x); var f = fract(x); f = f * f * (3.0 - 2.0 * f);',
    '  let a = mix(mix(h31(i), h31(i+vec3<f32>(1.0,0.0,0.0)), f.x), mix(h31(i+vec3<f32>(0.0,1.0,0.0)), h31(i+vec3<f32>(1.0,1.0,0.0)), f.x), f.y);',
    '  let b = mix(mix(h31(i+vec3<f32>(0.0,0.0,1.0)), h31(i+vec3<f32>(1.0,0.0,1.0)), f.x), mix(h31(i+vec3<f32>(0.0,1.0,1.0)), h31(i+vec3<f32>(1.0,1.0,1.0)), f.x), f.y);',
    '  return mix(a, b, f.z);',
    '}',
    'fn fbm(p: vec3<f32>) -> f32 { return 0.58*n31(p) + 0.28*n31(p*2.03) + 0.14*n31(p*4.11); }',
    '@fragment fn fs(@builtin(position) fc: vec4<f32>) -> @location(0) vec4<f32> {',
    '  let SHADOW = vec3<f32>(0.036,0.098,0.150);',
    '  let BODY   = vec3<f32>(0.216,0.451,0.596);',
    '  let LIT    = vec3<f32>(0.718,0.855,0.933);',
    '  let CORE   = vec3<f32>(0.925,0.965,1.000);',
    '  let WARM   = vec3<f32>(0.886,0.827,0.918);',
    '  let BG_A   = vec3<f32>(0.039,0.059,0.078);',
    '  let BG_B   = vec3<f32>(0.075,0.125,0.161);',
    '  let px = vec2<f32>(fc.x, u.res.y - fc.y);',
    '  let uv = (px * 2.0 - u.res) / min(u.res.x, u.res.y);',
    '  let R = 0.44 * (1.0 + u.amp * u.v);',
    '  let bgd = length(uv * vec2<f32>(0.86,1.0));',
    '  var col = mix(BG_B, BG_A, smoothstep(0.05, 1.45, bgd));',
    '  col = col + vec3<f32>(0.020,0.028,0.034) * (1.0 - smoothstep(0.0, 1.10, length(uv - vec2<f32>(-0.42,0.46))));',
    '  let fl = (uv - vec2<f32>(0.04, -R * 1.30)) * vec2<f32>(1.30, 4.30);',
    '  col = mix(col, BG_A * 0.14, clamp(exp(-dot(fl,fl) * 2.35) * (0.66 + 0.16 * u.v), 0.0, 0.74));',
    '  let rr = length(uv) / R;',
    '  let aa = max(fwidth(rr), 0.0008);',
    '  let mask = 1.0 - smoothstep(1.0 - aa * 1.6, 1.0 + aa * 0.6, rr);',
    '  let outd = max(rr - 1.0, 0.0);',
    '  let halo = exp(-outd * 4.6) * 0.155 + exp(-outd * 1.25) * 0.042;',
    '  col = col + mix(BODY, LIT, 0.42) * halo * u.halo * (0.62 + 0.38 * u.v) * (1.0 - mask);',
    '  if (mask > 0.0) {',
    '    let rc = min(rr, 0.99995);',
    '    let z = sqrt(max(0.0, 1.0 - rc * rc));',
    '    let n = normalize(vec3<f32>(uv / R, z));',
    '    let L = normalize(vec3<f32>(-0.54, 0.56, 0.42));',
    '    let ndl = dot(n, L);',
    '    let key = smoothstep(-0.32, 0.98, ndl);',
    '    let wrap = smoothstep(-0.85, 0.75, ndl);',
    '    let ao = mix(0.46, 1.0, smoothstep(-0.95, 0.45, n.y));',
    '    let q = vec3<f32>(uv / R, z) * 1.85 + vec3<f32>(0.0, u.t * 0.024, u.t * 0.015);',
    '    let f = fbm(q) - 0.5;',
    '    let dens = clamp(0.5 + u.noise * f * 0.9, 0.0, 1.0);',
    '    let thick = pow(1.0 - rc, 1.45);',
    '    let sss = thick * (0.42 + 0.58 * wrap) * (0.82 + 0.36 * dens);',
    '    let cd = clamp(1.0 - length(uv - vec2<f32>(-R * 0.24, R * 0.21)) / (R * 1.02), 0.0, 1.0);',
    '    let core = pow(cd, 2.55) * u.core * (0.34 + 0.20 * u.v);',
    '    let rim = pow(1.0 - z, 3.6) * 0.30;',
    '    var sc = mix(SHADOW, BODY, wrap * 0.88);',
    '    sc = mix(sc, LIT, key * 0.72);',
    '    sc = sc * ao;',
    '    sc = sc + mix(BODY, LIT, 0.60) * sss * 0.52;',
    '    sc = sc + mix(CORE, WARM, 0.22) * core;',
    '    sc = sc + mix(BODY, LIT, 0.30) * rim;',
    '    col = mix(col, sc, mask);',
    '  }',
    '  col = vec3<f32>(1.0) - exp(-col * 1.28);',
    '  col = pow(max(col, vec3<f32>(0.0)), vec3<f32>(0.94));',
    '  let dith = (h31(vec3<f32>(fc.xy, floor(u.t * 24.0))) - 0.5) / 255.0;',
    '  return vec4<f32>(clamp(col + dith, vec3<f32>(0.0), vec3<f32>(1.0)) * u.fade, 1.0);',
    '}'
  ].join('\n');

  function makeGPU(canvas) {
    if (!navigator.gpu) return Promise.resolve(null);
    return navigator.gpu.requestAdapter({ powerPreference: 'low-power' }).then(function (ad) {
      if (!ad) return null;
      return ad.requestDevice().then(function (dev) {
        var ctx = canvas.getContext('webgpu');
        if (!ctx) return null;
        var fmt = navigator.gpu.getPreferredCanvasFormat();
        ctx.configure({ device: dev, format: fmt, alphaMode: 'opaque' });
        var mod = dev.createShaderModule({ code: WGSL });
        var pipe = dev.createRenderPipeline({
          layout: 'auto',
          vertex: { module: mod, entryPoint: 'vs' },
          fragment: { module: mod, entryPoint: 'fs', targets: [{ format: fmt }] },
          primitive: { topology: 'triangle-list' }
        });
        var ubo = dev.createBuffer({ size: 48, usage: window.GPUBufferUsage.UNIFORM | window.GPUBufferUsage.COPY_DST });
        var bind = dev.createBindGroup({
          layout: pipe.getBindGroupLayout(0),
          entries: [{ binding: 0, resource: { buffer: ubo } }]
        });
        var data = new Float32Array(12);
        var lost = false;
        dev.lost.then(function () { lost = true; });
        return {
          tier: 'A', label: 'WebGPU',
          lost: function () { return lost; },
          draw: function (w, h, t, v, lv, fade) {
            if (lost) return;
            data[0] = w; data[1] = h; data[2] = t; data[3] = v;
            data[4] = lv.amp; data[5] = lv.halo; data[6] = lv.noise; data[7] = lv.core;
            data[8] = lv.steps; data[9] = fade;
            dev.queue.writeBuffer(ubo, 0, data.buffer, 0, 48);
            var enc = dev.createCommandEncoder();
            var pass = enc.beginRenderPass({
              colorAttachments: [{
                view: ctx.getCurrentTexture().createView(),
                clearValue: { r: 0.043, g: 0.066, b: 0.086, a: 1 },
                loadOp: 'clear', storeOp: 'store'
              }]
            });
            pass.setPipeline(pipe); pass.setBindGroup(0, bind); pass.draw(3);
            pass.end();
            dev.queue.submit([enc.finish()]);
          },
          destroy: function () { try { ubo.destroy(); dev.destroy(); } catch (_) {} }
        };
      });
    }).catch(function () { return null; });
  }

  /* -------------------------------------------------------- D · estática */
  function makeStatic(host) {
    var el = document.createElement('div');
    el.className = 'r46-breath-static';
    el.setAttribute('role', 'img');
    host.appendChild(el);
    return {
      tier: 'D', label: 'Estática',
      isStatic: true,
      setValue: function (v) { el.style.setProperty('--r46-v', v.toFixed(3)); },
      draw: function () {},
      destroy: function () { if (el.parentNode) el.parentNode.removeChild(el); }
    };
  }

  /* ------------------------------------------------------------ pantalla */
  function prefersReduced() {
    try {
      if (window.IGPreferences && window.IGPreferences.system && window.IGPreferences.system().reducedMotion) return true;
      if (window.IGPreferences && window.IGPreferences.get && window.IGPreferences.get().motion) return true;
    } catch (_) {}
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }
  function saveData() {
    try { return !!(navigator.connection && navigator.connection.saveData); } catch (e) { return false; }
  }

  /* --------------------------------------------------------- orquestador */
  function create(host, opts) {
    opts = opts || {};
    var listeners = {};
    var canvas = null, engine = null, raf = 0;
    var running = false, paused = false;
    var startedAt = 0, accrued = 0, fade = 1, fadeFrom = 0, fadeDir = 0;
    var cycle = new Cycle(opts.pattern || 'watch');
    var level = LEVELS[opts.level === 'normal' ? 'normal' : 'suave'];
    var levelName = opts.level === 'normal' ? 'normal' : 'suave';
    var duration = opts.duration || 0;
    /* Tres estados reales. Si la persona no elige, manda la preferencia del
       sistema, y se sigue escuchando: un cambio despues de montar se aplica. */
    var explicitMotion = opts.motion && ['normal', 'reducido', 'quieto'].indexOf(opts.motion) >= 0 ? opts.motion : null;
    var motion = explicitMotion || (prefersReduced() ? 'quieto' : 'normal');
    var destroyed = false;
    var lastPhase = '';

    function emit(n, d) { (listeners[n] || []).forEach(function (f) { try { f(d); } catch (_) {} }); }

    function sizeCanvas() {
      if (!canvas) return;
      var r = host.getBoundingClientRect();
      var cap = engine && engine.tier === 'C' ? 1.5 : 2;
      var dpr = Math.min(window.devicePixelRatio || 1, cap);
      var w = Math.max(1, Math.round(r.width * dpr));
      var h = Math.max(1, Math.round(r.height * dpr));
      var BUDGET = 3300000, px = w * h;
      if (px > BUDGET) {
        var k = Math.sqrt(BUDGET / px);
        w = Math.max(1, Math.round(w * k)); h = Math.max(1, Math.round(h * k));
      }
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    }

    function frame(now) {
      raf = 0;
      if (destroyed || !engine) return;
      if (!running || paused) return;
      var elapsed = (accrued + (now - startedAt) / 1000) * (motion === 'reducido' ? 0.55 : 1);

      if (duration > 0 && elapsed >= duration) {
        if (fadeDir !== -1) { fadeDir = -1; fadeFrom = now; }
      }
      if (fadeDir === -1) {
        fade = clamp(1 - (now - fadeFrom) / 4500, 0, 1);
        if (fade <= 0.001) { finish(); return; }
      } else if (fadeDir === 1) {
        fade = clamp((now - fadeFrom) / 2200, 0, 1);
        if (fade >= 1) { fade = 1; fadeDir = 0; }
      }

      var v = cycle.value(elapsed);
      if (motion === 'reducido') v = 0.5 + (v - 0.5) * 0.30;

      if (engine.isStatic) engine.setValue(v);
      else { sizeCanvas(); engine.draw(canvas.width, canvas.height, elapsed, v, level, fade); }

      if (cycle.phase !== lastPhase) { lastPhase = cycle.phase; emit('phase', { phase: cycle.phase }); }
      emit('tick', {
        elapsed: elapsed, value: v, phase: cycle.phase,
        remaining: duration > 0 ? Math.max(0, duration - elapsed) : null,
        inPhase: cycle.remaining(elapsed)
      });
      raf = window.requestAnimationFrame(frame);
    }

    function finish() {
      running = false; paused = false; fade = 1; fadeDir = 0; accrued = 0;
      if (raf) { window.cancelAnimationFrame(raf); raf = 0; }
      if (engine && !engine.isStatic) { sizeCanvas(); engine.draw(canvas.width, canvas.height, 0, 0, level, 1); }
      emit('end', {});
    }

    function onVisibility() {
      if (document.hidden) { if (running && !paused) api.pause(true); }
      else if (running && paused && api._autoPaused) api.resume();
    }

    var api = {
      tier: null, label: '', motion: motion, _autoPaused: false,

      ready: function () {
        canvas = document.createElement('canvas');
        canvas.className = 'r46-breath-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        host.appendChild(canvas);

        var wantStatic = opts.forceTier === 'D';
        if (wantStatic) {
          canvas.remove(); canvas = null;
          engine = makeStatic(host);
          api.tier = engine.tier; api.label = engine.label;
          return Promise.resolve(api);
        }
        var chain = Promise.resolve(null);
        if (opts.forceTier !== 'B' && opts.forceTier !== 'C' && !saveData()) {
          chain = makeGPU(canvas);
        }
        return chain.then(function (e) {
          if (!e && opts.forceTier !== 'C') e = makeGL(canvas);
          if (!e) e = makeC2D(canvas);
          if (!e) {
            canvas.remove(); canvas = null;
            e = makeStatic(host);
          }
          engine = e; api.tier = e.tier; api.label = e.label;
          if (canvas) { sizeCanvas(); engine.draw(canvas.width, canvas.height, 0, 0, level, 1); }
          return api;
        });
      },

      start: function () {
        if (destroyed || running) return api;
        if (motion === 'quieto') {
          running = true; paused = false; fade = 1;
          api.frame(7, 0.62);
          emit('state', { state: 'still' });
          emit('phase', { phase: 'watch' });
          return api;
        }
        running = true; paused = false; accrued = 0; lastPhase = '';
        fade = 0; fadeDir = 1; fadeFrom = performance.now();
        startedAt = performance.now();
        if (!raf) raf = window.requestAnimationFrame(frame);
        emit('state', { state: 'running' });
        return api;
      },
      setMotion: function (m, fromSystem) {
        if (['normal', 'reducido', 'quieto'].indexOf(m) < 0) return api;
        if (!fromSystem) explicitMotion = m;
        motion = m; api.motion = m;
        if (m === 'quieto') {
          if (raf) { window.cancelAnimationFrame(raf); raf = 0; }
          fade = 1; api.frame(7, 0.62);
          emit('phase', { phase: 'watch' });
        } else if (running && !paused && !raf) {
          startedAt = performance.now(); raf = window.requestAnimationFrame(frame);
        }
        emit('motion', { motion: m, explicit: !!explicitMotion });
        return api;
      },
      getMotion: function () { return motion; },
      followsSystem: function () { return !explicitMotion; },
      pause: function (auto) {
        if (!running || paused) return api;
        paused = true; api._autoPaused = !!auto;
        accrued += (performance.now() - startedAt) / 1000;
        if (raf) { window.cancelAnimationFrame(raf); raf = 0; }
        emit('state', { state: 'paused', auto: !!auto });
        return api;
      },
      resume: function () {
        if (!running || !paused) return api;
        paused = false; api._autoPaused = false;
        startedAt = performance.now();
        if (!raf) raf = window.requestAnimationFrame(frame);
        emit('state', { state: 'running' });
        return api;
      },
      stop: function () { if (running) finish(); return api; },
      setPattern: function (p) { cycle.set(p); lastPhase = ''; emit('pattern', { pattern: cycle.p }); return api; },
      getPattern: function () { return cycle.p; },
      setLevel: function (n) { levelName = LEVELS[n] ? n : 'suave'; level = LEVELS[levelName]; return api; },
      getLevel: function () { return levelName; },
      setDuration: function (s) { duration = s > 0 ? s : 0; return api; },
      on: function (n, f) { (listeners[n] = listeners[n] || []).push(f); return api; },
      isRunning: function () { return running && !paused; },
      /* QA: dibuja un fotograma concreto sin animar (verificacion y capturas) */
      frame: function (t, v) {
        if (!engine) return api;
        if (engine.isStatic) { engine.setValue(v); return api; }
        sizeCanvas();
        engine.draw(canvas.width, canvas.height, t || 0, clamp(v || 0, 0, 1), level, 1);
        return api;
      },
      resize: function () {
        if (!canvas || !engine || engine.isStatic) return;
        sizeCanvas();
        if (!running) engine.draw(canvas.width, canvas.height, 0, 0, level, 1);
      },
      destroy: function () {
        destroyed = true; running = false;
        if (raf) { window.cancelAnimationFrame(raf); raf = 0; }
        document.removeEventListener('visibilitychange', onVisibility);
        if (api._teardownPrefs) api._teardownPrefs();
        if (engine) { try { engine.destroy(); } catch (_) {} engine = null; }
        if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
        canvas = null; listeners = {};
      }
    };

    function onPrefChange() {
      if (explicitMotion) return;
      var next = prefersReduced() ? 'quieto' : 'normal';
      if (next !== motion) api.setMotion(next, true);
    }
    var mq = null, bodyObs = null;
    try {
      mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.addEventListener) mq.addEventListener('change', onPrefChange);
      else if (mq.addListener) mq.addListener(onPrefChange);
    } catch (_) {}
    try {
      bodyObs = new MutationObserver(onPrefChange);
      bodyObs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    } catch (_) {}
    api._teardownPrefs = function () {
      try { if (mq) { if (mq.removeEventListener) mq.removeEventListener('change', onPrefChange); else if (mq.removeListener) mq.removeListener(onPrefChange); } } catch (_) {}
      try { if (bodyObs) bodyObs.disconnect(); } catch (_) {}
    };
    api.motion = motion;

    document.addEventListener('visibilitychange', onVisibility);
    return api;
  }

  window.IGBola46 = {
    create: create,
    patterns: PATTERNS,
    levels: LEVELS,
    Cycle: Cycle,
    prefersReduced: prefersReduced,
    kind: 'R46_BREATH_ENGINE',
    tiers: [
      { tier: 'A', tech: 'WebGPU / WGSL' },
      { tier: 'B', tech: 'WebGL2 / GLSL ES 3.00' },
      { tier: 'C', tech: 'Canvas2D' },
      { tier: 'D', tech: 'Estática accesible' }
    ]
  };
})(window, document);
