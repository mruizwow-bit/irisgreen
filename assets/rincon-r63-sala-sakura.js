/* ==========================================================================
   IRIS GREEN · RINCON TRANQUILO · SALA SENSORIAL "SAKURA"  (R63 · iter 2)
   --------------------------------------------------------------------------
   Sala redonda de estimulacion sensorial, no un paisaje. Geometria REAL:
   cilindro, discos, sectores, perfiles de revolucion. Lo que se proyecta
   (el cerezo) se dibuja en el fragment como un DOSEL con estructura:
   masa de copa, ramas oscuras, racimos de flor y cielo entre medias.

   Cambios de esta iteracion, contra la referencia doble de Maria:
   1. uv de proyeccion ISOTROPO. Antes horizontal 0.62/m y vertical 3.3/m:
      un factor 5.3 que aplastaba cada flor en un guion. Era el motivo real
      de que la pared leyera como confeti.
   2. Dosel con esqueleto: campo de ramas por ruido crestado con deformacion
      de dominio, masa de copa de baja frecuencia, y la flor colgando de esa
      masa. Dos capas a distinta escala para que la copa tenga fondo y frente.
   3. Arquitectura de luz: tres aros de cove (techo, borde del oculo, zocalo).
      Son los maximos de la referencia y lo que hace que lea como sala.
   4. Suelo con gobos de petalo y reflejo vertical del tubo.
   5. Climas medidos pixel a pixel de las dos referencias.

   MARCO_NORMATIVO_TRANSVERSAL_R01. Tres estados de movimiento. Sin audio
   nuevo, sin autoplay, sin almacenamiento.
   ========================================================================== */
(function (window) {
  'use strict';
  var S = window.IGSalaStage;
  if (!S) return;

  var FLOOR_Y = S.GL.FLOOR_Y;
  var RADIO = 7.4;
  var CENTRO_Z = -6.6;
  var TECHO = FLOOR_Y + 4.5;
  var CUPULA_R = 3.3;

  var COVE_TECHO = FLOOR_Y + 4.06;   /* aro alto, union pared-techo */
  var COVE_ZOCALO = FLOOR_Y + 0.46;  /* banda curva baja */
  var ESC = 1.55;                    /* celdas de gobo por metro */

  /* La proyeccion Sakura ya no se dibuja por fragmento: son masters horneados
     fuera de linea (tools/r63-dosel). Aqui solo se mapean.
     REPS = 2 vueltas del panoramico alrededor del cilindro. Con 2048 px por
     vuelta y 23 m de desarrollo salen 88 px/m; quien mira ve unos 120 grados,
     o sea 15,5 m sobre 1440 px de pantalla, que es casi 1:1. Con REPS mayor se
     notaria la repeticion sin ganar nitidez. */
  var REPS = 2.0;
  var DOSEL_TOP = FLOOR_Y + 4.06;
  var DOSEL_ALT = 3.66;

  var F = function (x) { return x.toFixed(3); };

  /* ------------------------------------------------------------ climas
     Medidos zona a zona sobre las dos referencias. No son el albedo: son el
     PIXEL FINAL al que tiene que llegar el render. El albedo se deduce de
     ahi dividiendo por la ganancia, y la exposicion se ajusta midiendo. */
  var CLIMA = {
    claro: {
      cielo:   [0.651, 0.773, 0.898],
      pared:   [0.880, 0.760, 0.745],
      techo:   [0.790, 0.575, 0.550],
      suelo:   [0.800, 0.540, 0.570],
      mueble:  [0.910, 0.695, 0.710],
      metal:   [0.720, 0.560, 0.575],
      cove:    [1.000, 0.815, 0.760],
      tubo:    [0.985, 0.700, 0.870],
      esfera:  [1.000, 0.925, 0.970],
      flor:    [[1.000, 0.760, 0.820], [1.000, 0.905, 0.930], [0.985, 0.820, 0.870]],
      rama:    [0.330, 0.215, 0.250],
      ambiente:[0.845, 0.615, 0.655],
      amb:     0.86,   /* ganancia ambiente */
      gTubo:   0.55, gEsf: 0.40, gCove: 0.62,
      key:     'light',
      expo:    0.90, sat: 1.72, relleno: 0.085, emis: 1.02, masaK: 1.02, esfBril: 1.34,
      proyAmb: 1.24,
      nieblaF: 0.30
    },
    navy: {
      cielo:   [0.133, 0.082, 0.298],
      pared:   [0.330, 0.290, 0.480],
      techo:   [0.230, 0.195, 0.355],
      suelo:   [0.215, 0.135, 0.295],
      mueble:  [0.545, 0.485, 0.665],
      metal:   [0.330, 0.285, 0.430],
      cove:    [0.870, 0.720, 0.980],
      tubo:    [0.930, 0.505, 0.930],
      esfera:  [1.000, 0.885, 1.000],
      flor:    [[0.700, 0.330, 0.520], [0.820, 0.590, 0.720], [0.520, 0.320, 0.640]],
      rama:    [0.085, 0.062, 0.150],
      ambiente:[0.300, 0.240, 0.440],
      amb:     0.54,
      gTubo:   1.15, gEsf: 0.95, gCove: 1.05,
      key:     'navy',
      expo:    0.80, sat: 1.50, relleno: 0.045, emis: 1.45, masaK: 0.78, esfBril: 1.00,
      proyAmb: 1.18,
      nieblaF: 0.15
    }
  };

  function clima() {
    var oscuro = false;
    try {
      var b = document.body;
      oscuro = b.getAttribute('data-ig-theme') === 'navy' ||
               b.getAttribute('data-ig-theme') === 'dark' ||
               b.getAttribute('data-ig-r42-family') === 'quiet';
    } catch (_) {}
    return oscuro ? CLIMA.navy : CLIMA.claro;
  }

  /* ------------------------------------------------------ dosel de cerezo
     Un cerezo proyectado no es una nube de flores sueltas. Tiene, de fondo a
     frente: cielo, masa de copa, ramas oscuras, y racimos de flor colgando de
     esa masa. Si falta el esqueleto, lee como confeti. */
  var DOSEL_GLSL = [
    'float h21(vec2 p){ return fract(sin(dot(p, vec2(41.31, 289.07))) * 43758.5453); }',
    'float vnoise(vec2 p){',
    ' vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);',
    ' return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x),',
    '            mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y);',
    '}',
    'float fbm(vec2 p){',
    ' float s = 0.0, a = 0.5;',
    ' for(int i = 0; i < 3; i++){ s += a * vnoise(p); p *= 2.07; a *= 0.5; }',
    ' return s / 0.875;',
    '}',
    /* campo de ramas: ruido crestado con deformacion de dominio. El maximo de
       tres escalas da tronco, rama y ramilla; grueso lleva la escala gruesa
       para engordar el trazo cerca del tronco. */
    'float ramaje(vec2 p, out float grueso){',
    /* anisotropia antes de nada: el ruido crestado isotropo da lazos cerrados,
       que leen como vena o como grieta. Estirado, lee como rama. */
    ' vec2 pa = p * vec2(0.55, 1.50);',
    ' vec2 w = pa + vec2(vnoise(pa * 0.36 + 11.3), vnoise(pa * 0.36 + 31.7)) * 1.7 - 0.85;',
    ' float r1 = 1.0 - abs(vnoise(w * 0.46) * 2.0 - 1.0);',
    ' float r2 = 1.0 - abs(vnoise(w * 1.05 + 7.0) * 2.0 - 1.0);',
    ' float r3 = 1.0 - abs(vnoise(w * 2.30 + 19.0) * 2.0 - 1.0);',
    ' grueso = r1;',
    ' return max(max(r1, r2 * 0.94), r3 * 0.86);',
    '}',
    /* una flor de cinco petalos centrada en el origen de su celda */
    'float flor(vec2 q, float giro, float tam){',
    ' float a = atan(q.y, q.x) + giro;',
    ' float r = length(q) / max(tam, 0.001);',
    ' float lob = 0.60 + 0.40 * pow(abs(cos(a * 2.5)), 0.62);',
    ' float d = r / lob;',
    ' float petalo = 1.0 - smoothstep(0.84, 1.01, d);',
    ' float centro = 1.0 - smoothstep(0.0, 0.22, r);',
    ' return clamp(petalo * 0.90 + centro * 0.50, 0.0, 1.0);',
    '}',
    /* racimos: dos escalas de celda irregular, flor por celda */
    'vec2 floracion(vec2 uv, float densidad){',
    ' vec2 acc = vec2(0.0);',
    ' for(int k = 0; k < 2; k++){',
    '  float esc = k == 0 ? 1.0 : 2.05;',
    '  vec2 g = uv * esc;',
    '  vec2 cel = floor(g);',
    '  for(int j = -1; j <= 1; j++){',
    '   for(int i = -1; i <= 1; i++){',
    '    vec2 c = cel + vec2(float(i), float(j));',
    '    float s1 = h21(c + 3.1), s2 = h21(c + 7.7), s3 = h21(c + 15.3);',
    '    if(s3 > densidad) continue;',
    '    vec2 pos = c + vec2(0.16 + 0.68 * s1, 0.16 + 0.68 * s2);',
    '    float f = flor(g - pos, s1 * 6.283, 0.21 + 0.40 * s2 * s2);',
    '    acc.y = mix(acc.y, s2, step(acc.x, f));',
    '    acc.x = max(acc.x, f);',
    '   }',
    '  }',
    ' }',
    ' return acc;',
    '}',
  ].join('\n');

  /* ------------------------------------------------------------- la sala */
  var SALA_VS = [
    '#version 300 es',
    'in vec3 aPos; in vec3 aNrm; in vec2 aInfo;',
    'uniform mat4 uProj; uniform mat4 uView;',
    'out vec3 vW; out vec3 vN; out float vTipo; out float vV; out float vDepth;',
    'void main(){',
    ' vec4 c = uView * vec4(aPos, 1.0);',
    ' vW = aPos; vN = aNrm; vTipo = aInfo.x; vV = aInfo.y; vDepth = -c.z;',
    ' gl_Position = uProj * c;',
    '}'
  ].join('\n');

  var SALA_FS = [
    '#version 300 es',
    'precision highp float;',
    'in vec3 vW; in vec3 vN; in float vTipo; in float vV; in float vDepth;',
    'uniform vec3 uCielo; uniform vec3 uPared; uniform vec3 uTecho; uniform vec3 uSuelo;',
    'uniform vec3 uMueble; uniform vec3 uMetal; uniform vec3 uCove;',
    'uniform vec3 uFlorA; uniform vec3 uFlorB; uniform vec3 uFlorC; uniform vec3 uRama;',
    'uniform vec3 uTubo; uniform vec3 uEsfera; uniform vec3 uAmbiente;',
    'uniform vec3 uLuz1; uniform vec3 uLuz2; uniform vec3 uLuz3; uniform vec3 uLuz4;',
    'uniform vec3 uCam;',
    'uniform float uFade; uniform float uT; uniform float uAmb; uniform float uExpo;',
    'uniform float uGTubo; uniform float uGEsf; uniform float uGCove; uniform float uEmis;',
    'uniform float uVivo;',   /* 0 en REDUCIDO: se apaga la respiracion del cove */
    'uniform float uNiebla; uniform float uDetalle; uniform float uSat; uniform float uRelleno;',
    DOSEL_GLSL,
    'uniform sampler2D uTexPared; uniform sampler2D uTexOculo;',
    'uniform float uTexOK; uniform float uProyAmb;',
    'out vec4 oCol;',

    /* luz de aro: el punto mas cercano del anillo hace de fuente puntual */
    'vec3 aro(vec3 p, vec3 n, float rad, float alt, float gan){',
    ' vec2 d = p.xz - vec2(0.0, CZ);',
    ' float L = max(length(d), 0.001);',
    ' vec3 q = vec3(d.x / L * rad, alt, CZ + d.y / L * rad);',
    ' vec3 a = q - p; float dd = length(a);',
    ' float k = max(dot(n, a / max(dd, 0.01)), 0.0) / (1.0 + dd * dd * 0.62);',
    ' return uCove * k * gan;',
    '}',

    'void main(){',
    ' vec3 n = normalize(vN);',
    ' vec3 base; float luz = 0.0; vec3 emis = vec3(0.0);',
    ' vec2 uv = vec2(0.0); float esDosel = 0.0; float esSuelo = 0.0;',
    ' float pan = uT * 0.0045;',

    ' if(vTipo < 0.5){',
    /* pared cilindrica: master panoramico, periodico, REPS vueltas. El pan
       lento es el movimiento de la proyeccion, no de la sala. */
    '  float ang = atan(vW.z - CZ, vW.x);',
    '  float u = (ang / 6.2831853 + 0.5) * REPS + pan * 0.16;',
    '  float v = (DTOP - vW.y) / DALT;',
    '  vec3 tx = texture(uTexPared, vec2(u, clamp(v, 0.002, 0.998))).rgb;',
    '  float dentro = smoothstep(-0.020, 0.028, v) * (1.0 - smoothstep(0.972, 1.020, v));',
    '  base = mix(uPared, mix(uCielo, tx, uTexOK), dentro);',
    '  esDosel = uTexOK * dentro;',
    ' } else if(vTipo < 1.5){',
    '  base = uSuelo; esSuelo = 1.0;',
    ' } else if(vTipo < 2.5){',
    '  base = uTecho;',
    ' } else if(vTipo < 3.5){',
    /* oculo: otra ventana del mismo master, en composicion radial */
    '  float ca = cos(pan * 0.30), sa = sin(pan * 0.30);',
    '  vec2 q = vec2(vW.x, vW.z - CZ) / CUP;',
    '  q = vec2(q.x * ca - q.y * sa, q.x * sa + q.y * ca) * 0.5 + 0.5;',
    '  vec3 tx = texture(uTexOculo, clamp(q, 0.002, 0.998)).rgb;',
    '  base = mix(uCielo * 0.52, tx, uTexOK);',
    '  esDosel = uTexOK;',
    ' } else if(vTipo < 4.5){',
    '  base = uMueble;',
    ' } else if(vTipo < 5.5){',
    '  base = uCove; emis = uCove * (0.86 + 0.14 * sin(uT * 0.11 + vW.y) * uVivo);',
    ' } else {',
    '  base = uMetal;',
    ' }',

    /* La flor que brilla derrama un poco de luz sobre si misma. Es lo unico
       que queda del camino emisivo: el dibujo viene ya del master. */
    ' luz = max(0.0, dot(base, vec3(0.30, 0.55, 0.15)) - 0.52) * esDosel;',

    /* --- luz: ambiente del clima, cuatro fuentes reales y tres aros */
    ' float luzFac = mix(1.0, 0.30, esDosel);',
    ' vec3 col = base * mix(uAmb, uProyAmb, esDosel);',
    ' vec3 a1 = uLuz1 - vW; float d1 = length(a1);',
    ' vec3 a2 = uLuz2 - vW; float d2 = length(a2);',
    ' vec3 a3 = uLuz3 - vW; float d3 = length(a3);',
    ' vec3 a4 = uLuz4 - vW; float d4 = length(a4);',
    ' float k1 = max(dot(n, a1 / max(d1, 0.01)), 0.0) / (1.0 + d1 * d1 * 0.13);',
    ' float k2 = max(dot(n, a2 / max(d2, 0.01)), 0.0) / (1.0 + d2 * d2 * 0.34);',
    ' float k3 = max(dot(n, a3 / max(d3, 0.01)), 0.0) / (1.0 + d3 * d3 * 0.40);',
    ' float k4 = max(dot(n, a4 / max(d4, 0.01)), 0.0) / (1.0 + d4 * d4 * 0.44);',
    ' col += base * uTubo * k1 * uGTubo * 2.9 * luzFac;',
    ' col += base * uEsfera * (k2 + k3 * 0.7 + k4 * 0.6) * uGEsf * 2.3 * luzFac;',
    ' col += base * aro(vW, n, RAD - 0.10, CVT, uGCove * 3.40) * luzFac;',
    ' col += base * aro(vW, n, RAD - 0.10, CVZ, uGCove * 4.10) * luzFac;',
    ' col += base * aro(vW, n, CUP, TEC + 0.06, uGCove * 2.00) * luzFac;',
    ' col += base * uAmbiente * uRelleno;',
    ' col += base * luz * 0.85;',
    ' col += emis * uEmis;',

    /* --- suelo: gobos de petalo, derrame de las fuentes y reflejos */
    ' if(esSuelo > 0.5){',
    '  vec2 guv = vec2(vW.x, vW.z - CZ) * 0.60 + vec2(pan * 2.0, 0.0);',
    '  vec2 gc = floor(guv); float gob = 0.0; float gt = 0.0;',
    '  for(int j = -1; j <= 1; j++){',
    '   for(int i = -1; i <= 1; i++){',
    '    vec2 c = gc + vec2(float(i), float(j));',
    '    float s1 = h21(c + 5.9), s2 = h21(c + 12.4), s3 = h21(c + 21.8);',
    '    if(s3 > 0.56) continue;',
    '    vec2 pos = c + vec2(0.14 + 0.72 * s1, 0.14 + 0.72 * s2);',
    '    float f = flor(guv - pos, s1 * 6.283, 0.25 + 0.20 * s2);',
    '    gt = mix(gt, s2, step(gob, f)); gob = max(gob, f);',
    '   }',
    '  }',
    '  vec3 gtono = gt < 0.5 ? uFlorA : uFlorB;',
    '  float rr = length(vec2(vW.x, vW.z - CZ));',
    '  col += gtono * gob * 1.70 * (1.0 - smoothstep(4.8, RAD, rr) * 0.30);',
    '  col += uTubo * exp(-length(vW.xz - uLuz1.xz) * 0.58) * 0.40 * uGTubo;',
    '  col += mix(uEsfera, uTubo, 0.45) * exp(-length(vW.xz - uLuz2.xz) * 0.72) * 0.62 * uGEsf;',
    '  col += mix(uEsfera, uTubo, 0.45) * exp(-length(vW.xz - uLuz3.xz) * 0.88) * 0.42 * uGEsf;',
    '  col += mix(uEsfera, uTubo, 0.45) * exp(-length(vW.xz - uLuz4.xz) * 0.95) * 0.30 * uGEsf;',
    /* reflejo: el rayo camara->suelo espejado. Si pasa cerca del eje del tubo,
       ese punto devuelve el tubo. Un suelo pulido no estira, difumina, asi que
       la anchura crece con la distancia recorrida. */
    '  vec2 vd = normalize(vW.xz - uCam.xz);',
    '  vec2 rel1 = uLuz1.xz - vW.xz;',
    '  float t1 = dot(rel1, vd); float p1 = length(rel1 - vd * t1);',
    '  float an1 = 0.30 + t1 * 0.16;',
    '  col += uTubo * step(0.0, t1) * exp(-(p1 * p1) / max(an1 * an1, 0.01)) * exp(-t1 * 0.30) * 0.62 * uGTubo;',
    '  vec2 rel2 = uLuz2.xz - vW.xz;',
    '  float t2 = dot(rel2, vd); float p2 = length(rel2 - vd * t2);',
    '  float an2 = 0.34 + t2 * 0.22;',
    '  col += uEsfera * step(0.0, t2) * exp(-(p2 * p2) / max(an2 * an2, 0.01)) * exp(-t2 * 0.75) * 0.34 * uGEsf;',
    '  float veta = fbm(vec2(vW.x * 1.3, (vW.z - CZ) * 0.42));',
    '  col *= 0.90 + 0.20 * veta;',
    ' }',

    /* aire de la sala: lo lejano se lava hacia el ambiente, nunca a negro */
    ' float lejos = clamp((vDepth - 3.0) / 21.0, 0.0, 1.0);',
    ' col = mix(col, uAmbiente * 0.80, lejos * uNiebla);',
    ' col *= uExpo;',
    ' col = col * (1.0 + col / 2.9) / (1.0 + col);',
    ' col = mix(vec3(dot(col, vec3(0.2126, 0.7152, 0.0722))), col, uSat);',
    ' oCol = vec4(max(col, 0.0) * uFade, 1.0);',
    '}'
  ].join('\n');

  /* --------------------------------------------- tubo de burbujas, esferas
     El tubo es el objeto mas reconocible de una sala sensorial. En la
     referencia no lleva burbujas redondas: lleva flor blanca suspendida que
     sube despacio. Se dibuja dentro del cilindro translucido. */
  var LUZ_VS = [
    '#version 300 es',
    'in vec3 aPos; in vec3 aNrm; in vec2 aInfo;',
    'uniform mat4 uProj; uniform mat4 uView;',
    'out vec3 vW; out vec3 vN; out float vTipo; out float vV; out float vDepth;',
    'void main(){',
    ' vec4 c = uView * vec4(aPos, 1.0);',
    ' vW = aPos; vN = aNrm; vTipo = aInfo.x; vV = aInfo.y; vDepth = -c.z;',
    ' gl_Position = uProj * c;',
    '}'
  ].join('\n');

  var LUZ_FS = [
    '#version 300 es',
    'precision highp float;',
    'in vec3 vW; in vec3 vN; in float vTipo; in float vV; in float vDepth;',
    'uniform vec3 uTubo; uniform vec3 uEsfera; uniform vec3 uFlorB; uniform vec3 uMetal;',
    'uniform float uFade; uniform float uT; uniform float uDrift; uniform float uEsfBril;',
    DOSEL_GLSL,
    'out vec4 oCol;',
    'void main(){',
    ' vec3 n = normalize(vN);',
    ' if(vTipo < 0.5){',
    /* --- tubo: agua iluminada. El canto es mas denso porque el rayo atraviesa
       mas agua; el centro deja ver el fondo. */
    '  float borde = 1.0 - abs(n.z);',
    '  vec3 col = uTubo * (0.70 + 0.46 * borde) * (0.86 + 0.26 * (1.0 - vV));',
    /* flor suspendida: rejilla en (angulo, altura) que sube despacio */
    '  float ang = atan(n.z, n.x);',
    '  vec2 tuv = vec2(ang * 1.10, vV * 7.2 - uT * 0.085);',
    '  vec2 cel = floor(tuv); float fl = 0.0;',
    '  for(int j = -1; j <= 1; j++){',
    '   for(int i = -1; i <= 1; i++){',
    '    vec2 c = cel + vec2(float(i), float(j));',
    '    float s1 = h21(c + 2.3), s2 = h21(c + 9.4), s3 = h21(c + 17.1);',
    '    if(s3 > 0.50) continue;',
    '    vec2 pos = c + vec2(0.18 + 0.64 * s1, 0.18 + 0.64 * s2);',
    '    fl = max(fl, flor(tuv - pos, s1 * 6.283, 0.13 + 0.12 * s2));',
    '   }',
    '  }',
    '  col += vec3(1.0, 0.95, 0.99) * clamp(fl, 0.0, 1.0) * 0.72;',
    '  col += uTubo * 0.26 * smoothstep(0.50, 1.0, borde);',
    '  oCol = vec4(col * uFade, (0.74 + 0.26 * borde) * uFade);',
    ' } else if(vTipo < 1.5){',
    /* --- esfera de luz: nucleo quemado, caida suave hacia el canto */
    '  float centro = abs(n.z);',
    '  vec3 col = mix(uEsfera, uTubo, 0.20) * (0.56 + 0.44 * centro * centro) * (0.90 + 0.14 * n.y) * uEsfBril;',
    '  oCol = vec4(col * uFade, uFade);',
    ' } else {',
    /* --- metal cepillado de la base del tubo */
    '  float f = 1.0 - abs(n.z);',
    '  vec3 col = uMetal * (0.64 + 0.52 * f) + uTubo * 0.10;',
    '  oCol = vec4(col * uFade, uFade);',
    ' }',
    '}'
  ].join('\n');

  /* ------------------------------------------------------------ petalos
     Caen del proyector, no de un arbol: pocos, lentos y fuera de foco. */
  var PETAL_VS = [
    '#version 300 es',
    'in vec2 aCorner; in vec4 aSeed;',
    'uniform mat4 uProj; uniform mat4 uView; uniform float uT; uniform float uDrift;',
    'out vec2 vLocal; out float vTono; out float vDepth; out float vDif;',
    'void main(){',
    ' float alto = 4.3;',
    ' float y = mod(aSeed.y * alto - uT * 0.17 * uDrift, alto);',
    ' float ang = aSeed.x * 6.283;',
    ' float rad = 1.0 + aSeed.z * 6.0;',
    ' float bal = sin(uT * 0.21 * uDrift + aSeed.w * 8.0) * 0.34;',
    ' vec3 w = vec3(cos(ang) * rad + bal, SUE + 0.05 + y, sin(ang) * rad + CZ);',
    ' vec4 c = uView * vec4(w, 1.0);',
    ' float giro = uT * (0.26 + aSeed.w * 0.28) * uDrift + aSeed.x * 6.283;',
    ' vec2 e = aCorner * (0.034 + aSeed.z * 0.034);',
    ' float ca = cos(giro * 0.4), sa = sin(giro * 0.4);',
    ' vec2 rot = vec2(e.x * ca - e.y * sa, e.x * sa + e.y * ca);',
    ' rot.x *= 0.35 + 0.65 * abs(sin(giro * 0.5));',
    ' c.xy += rot;',
    ' vLocal = aCorner; vTono = aSeed.w; vDepth = -c.z;',
    /* fuera de foco: lo muy cercano se abre en bokeh, como en la referencia */
    ' vDif = 1.0 - smoothstep(1.2, 3.4, -c.z);',
    ' gl_Position = uProj * c;',
    '}'
  ].join('\n');

  var PETAL_FS = [
    '#version 300 es',
    'precision highp float;',
    'in vec2 vLocal; in float vTono; in float vDepth; in float vDif;',
    'uniform vec3 uFlorA; uniform vec3 uFlorB; uniform vec3 uFlorC; uniform float uFade;',
    'out vec4 oCol;',
    'void main(){',
    ' float y = vLocal.y;',
    ' float w = sqrt(max(0.0, 1.0 - y * y)) * (0.52 + 0.48 * smoothstep(-1.0, 0.25, y));',
    ' w *= 1.0 - 0.30 * smoothstep(0.45, 1.0, y);',
    ' float d = abs(vLocal.x) / max(w, 0.02);',
    ' float aa = max(fwidth(d), 0.03) + vDif * 0.85;',
    ' float cov = (1.0 - smoothstep(1.0 - aa, 1.0 + aa, d)) * (1.0 - smoothstep(0.94 - vDif * 0.5, 1.0, abs(y)));',
    ' if(cov <= 0.01) discard;',
    ' vec3 tono = vTono < 0.38 ? uFlorA : (vTono < 0.72 ? uFlorB : uFlorC);',
    ' oCol = vec4(tono * uFade, cov * (0.82 - vDif * 0.36) * uFade);',
    '}'
  ].join('\n');

  /* ============================================================ geometria */
  var salaProg = null, luzProg = null, petalProg = null;
  var salaBuf = null, salaN = 0, luzBuf = null, luzN = 0, petalBuf = null, petalN = 0;

  /* DOS COMPOSICIONES, no un recorte.
     La camara del stage abre el campo vertical cuando la pantalla es estrecha,
     y eso cierra el horizontal: a 390 el semiangulo cae de unos 45 grados a
     unos 21. Con la colocacion de escritorio el tubo se queda literalmente
     fuera de cuadro. En vertical las piezas se acercan al eje y se adelantan,
     para que sigan leyendose sala, tubo, asiento y profundidad. */
  var DISPOS = {
    ancho: {
      tubo: [4.00, CENTRO_Z + 0.40], tuboR: 0.30,
      esf: [[-3.05, 0.38, CENTRO_Z + 0.55, 0.38],
            [-2.35, 0.26, CENTRO_Z + 1.35, 0.26],
            [-1.55, 0.22, CENTRO_Z - 0.55, 0.22]],
      puf: [0.10, CENTRO_Z + 0.30, 1.80, 0.44],
      coj: [0.10, CENTRO_Z + 0.30, 0.98, 0.58],
      est: [[-3.30, CENTRO_Z - 0.60, 1.30], [4.20, CENTRO_Z - 1.50, 1.24]]
    },
    estrecho: {
      tubo: [1.50, CENTRO_Z + 2.20], tuboR: 0.26,
      esf: [[-1.35, 0.32, CENTRO_Z + 2.60, 0.32],
            [-0.95, 0.23, CENTRO_Z + 3.15, 0.23],
            [-1.30, 0.20, CENTRO_Z + 1.10, 0.20]],
      puf: [0.05, CENTRO_Z - 0.20, 1.62, 0.42],
      coj: [0.05, CENTRO_Z - 0.20, 0.88, 0.55],
      est: [[-1.85, CENTRO_Z - 1.30, 1.15], [1.95, CENTRO_Z - 1.80, 1.10]]
    }
  };
  var disp = DISPOS.ancho, dispNom = 'ancho';
  var TUBO_R = 0.30;
  var LUZ1 = [0, 0, 0], LUZ2 = [0, 0, 0], LUZ3 = [0, 0, 0], LUZ4 = [0, 0, 0];

  function aplicarDispos(nom) {
    dispNom = nom;
    disp = DISPOS[nom];
    TUBO_R = disp.tuboR;
    var e = disp.esf;
    LUZ1 = [disp.tubo[0], FLOOR_Y + 1.95, disp.tubo[1]];
    LUZ2 = [e[0][0], FLOOR_Y + e[0][1], e[0][2]];
    LUZ3 = [e[1][0], FLOOR_Y + e[1][1], e[1][2]];
    LUZ4 = [e[2][0], FLOOR_Y + e[2][1], e[2][2]];
  }
  aplicarDispos('ancho');
  var TAU = Math.PI * 2;

  /* cuerpo de revolucion con normales calculadas del perfil. Con dos anillos
     y normal plana un puf sale facetado y parece de carton: hace falta
     derivar la normal del perfil, no del sector. */
  function revolucion(v, tri, cx, cz, perfil, NU, NA, tipo) {
    function P(u) { return perfil(Math.max(0, Math.min(1, u))); }
    function N2(u) {
      var e = 0.004, a = P(u - e), b = P(u + e);
      var dr = b[0] - a[0], dy = b[1] - a[1];
      var L = Math.sqrt(dy * dy + dr * dr) || 1;
      return [-dy / L, dr / L];
    }
    for (var p = 0; p < NU; p++) {
      var u0 = p / NU, u1 = (p + 1) / NU;
      var A = P(u0), B = P(u1), na = N2(u0), nb = N2(u1);
      for (var q = 0; q < NA; q++) {
        var t0 = q / NA * TAU, t1 = (q + 1) / NA * TAU;
        var c0 = Math.cos(t0), s0 = Math.sin(t0), c1 = Math.cos(t1), s1 = Math.sin(t1);
        var p00 = [cx + c0 * A[0], A[1], cz + s0 * A[0]];
        var p10 = [cx + c1 * A[0], A[1], cz + s1 * A[0]];
        var p01 = [cx + c0 * B[0], B[1], cz + s0 * B[0]];
        var p11 = [cx + c1 * B[0], B[1], cz + s1 * B[0]];
        var n00 = [c0 * na[0], na[1], s0 * na[0]], n10 = [c1 * na[0], na[1], s1 * na[0]];
        var n01 = [c0 * nb[0], nb[1], s0 * nb[0]], n11 = [c1 * nb[0], nb[1], s1 * nb[0]];
        tri(p00, n00, tipo, u0); tri(p10, n10, tipo, u0); tri(p01, n01, tipo, u1);
        tri(p01, n01, tipo, u1); tri(p10, n10, tipo, u0); tri(p11, n11, tipo, u1);
      }
    }
  }

  /* perfil de cojin: plano arriba, canto lleno, sin base cortada en recto */
  function perfilCojin(r, h, planitud) {
    var pl = planitud || 0.40;
    return function (u) {
      var ang = u * Math.PI, s = Math.sin(ang), c = Math.cos(ang);
      var R = r * Math.pow(Math.abs(s), pl);
      var sg = c >= 0 ? 1 : -1;
      var Y = FLOOR_Y + h * 0.5 + h * 0.5 * sg * Math.pow(Math.abs(c), 0.70);
      return [R, Y];
    };
  }

  function construir(gl) {
    var v = [];
    function tri(p, n, tipo, vv) { v.push(p[0], p[1], p[2], n[0], n[1], n[2], tipo, vv); }
    function quad(a, b, c, d, n, tipo, v0, v1) {
      tri(a, n, tipo, v0); tri(b, n, tipo, v0); tri(c, n, tipo, v1);
      tri(c, n, tipo, v1); tri(b, n, tipo, v0); tri(d, n, tipo, v1);
    }
    var SEG = 72, i, a0, a1;

    /* pared cilindrica, vista por dentro */
    for (i = 0; i < SEG; i++) {
      a0 = i / SEG * TAU; a1 = (i + 1) / SEG * TAU;
      var x0 = Math.cos(a0) * RADIO, z0 = Math.sin(a0) * RADIO + CENTRO_Z;
      var x1 = Math.cos(a1) * RADIO, z1 = Math.sin(a1) * RADIO + CENTRO_Z;
      quad([x0, FLOOR_Y, z0], [x1, FLOOR_Y, z1], [x0, TECHO, z0], [x1, TECHO, z1],
           [-Math.cos(a0), 0, -Math.sin(a0)], 0, 0, 1);
    }

    /* suelo */
    for (i = 0; i < SEG; i++) {
      a0 = i / SEG * TAU; a1 = (i + 1) / SEG * TAU;
      tri([0, FLOOR_Y, CENTRO_Z], [0, 1, 0], 1, 0);
      tri([Math.cos(a0) * RADIO, FLOOR_Y, Math.sin(a0) * RADIO + CENTRO_Z], [0, 1, 0], 1, 0);
      tri([Math.cos(a1) * RADIO, FLOOR_Y, Math.sin(a1) * RADIO + CENTRO_Z], [0, 1, 0], 1, 0);
    }

    /* techo plano con hueco circular, cupula elevada y faldon luminoso */
    for (i = 0; i < SEG; i++) {
      a0 = i / SEG * TAU; a1 = (i + 1) / SEG * TAU;
      var cx0 = Math.cos(a0), cz0 = Math.sin(a0), cx1 = Math.cos(a1), cz1 = Math.sin(a1);
      quad([cx0 * CUPULA_R, TECHO, cz0 * CUPULA_R + CENTRO_Z],
           [cx1 * CUPULA_R, TECHO, cz1 * CUPULA_R + CENTRO_Z],
           [cx0 * RADIO, TECHO, cz0 * RADIO + CENTRO_Z],
           [cx1 * RADIO, TECHO, cz1 * RADIO + CENTRO_Z], [0, -1, 0], 2, 0, 0);
      /* disco de la cupula, ligeramente abombado */
      tri([0, TECHO + 0.52, CENTRO_Z], [0, -1, 0], 3, 0);
      tri([cx0 * CUPULA_R, TECHO + 0.08, cz0 * CUPULA_R + CENTRO_Z], [0, -1, 0], 3, 0);
      tri([cx1 * CUPULA_R, TECHO + 0.08, cz1 * CUPULA_R + CENTRO_Z], [0, -1, 0], 3, 0);
      /* faldon del oculo: es cove, no techo. Es el aro que brilla. */
      quad([cx0 * CUPULA_R, TECHO, cz0 * CUPULA_R + CENTRO_Z],
           [cx1 * CUPULA_R, TECHO, cz1 * CUPULA_R + CENTRO_Z],
           [cx0 * CUPULA_R, TECHO + 0.08, cz0 * CUPULA_R + CENTRO_Z],
           [cx1 * CUPULA_R, TECHO + 0.08, cz1 * CUPULA_R + CENTRO_Z],
           [-cx0, 0, -cz0], 5, 0, 0);
    }

    /* aros de cove. Son los maximos de la referencia: sin ellos la sala no
       tiene rango y no lee como sala sensorial, sino como render plano. */
    function aroLuz(rad, y, alto, haciaDentro) {
      for (var k = 0; k < SEG; k++) {
        var b0 = k / SEG * TAU, b1 = (k + 1) / SEG * TAU;
        var q0 = [Math.cos(b0), Math.sin(b0)], q1 = [Math.cos(b1), Math.sin(b1)];
        var nn = haciaDentro ? [-q0[0], 0, -q0[1]] : [0, -1, 0];
        quad([q0[0] * rad, y - alto, q0[1] * rad + CENTRO_Z],
             [q1[0] * rad, y - alto, q1[1] * rad + CENTRO_Z],
             [q0[0] * rad, y + alto, q0[1] * rad + CENTRO_Z],
             [q1[0] * rad, y + alto, q1[1] * rad + CENTRO_Z], nn, 5, 0, 0);
      }
    }
    aroLuz(RADIO - 0.05, COVE_TECHO, 0.022, true);    /* aro alto de pared */
    aroLuz(RADIO - 0.05, COVE_ZOCALO, 0.028, true);   /* banda curva baja */
    /* segundo aro concentrico en el plano del techo */
    for (i = 0; i < SEG; i++) {
      a0 = i / SEG * TAU; a1 = (i + 1) / SEG * TAU;
      var m0 = [Math.cos(a0), Math.sin(a0)], m1 = [Math.cos(a1), Math.sin(a1)];
      var ri = 5.26, ro = 5.33;
      quad([m0[0] * ri, TECHO - 0.012, m0[1] * ri + CENTRO_Z],
           [m1[0] * ri, TECHO - 0.012, m1[1] * ri + CENTRO_Z],
           [m0[0] * ro, TECHO - 0.012, m0[1] * ro + CENTRO_Z],
           [m1[0] * ro, TECHO - 0.012, m1[1] * ro + CENTRO_Z], [0, -1, 0], 5, 0, 0);
    }

    /* mobiliario blando */
    revolucion(v, tri, disp.puf[0], disp.puf[1], perfilCojin(disp.puf[2], disp.puf[3], 0.24), 18, 72, 4);
    revolucion(v, tri, disp.coj[0], disp.coj[1], perfilCojin(disp.coj[2], disp.coj[3], 0.26), 16, 60, 4);
    for (var q = 0; q < disp.est.length; q++) {
      revolucion(v, tri, disp.est[q][0], disp.est[q][1],
                 perfilCojin(disp.est[q][2], 0.24, 0.22), 14, 60, 4);
    }

    salaN = v.length / 8;
    salaBuf = S.GL.buffer(gl, new Float32Array(v));
  }

  function construirLuces(gl) {
    var v = [];
    function tri(p, n, tipo, vv) { v.push(p[0], p[1], p[2], n[0], n[1], n[2], tipo, vv); }

    /* columna de agua */
    var y0 = FLOOR_Y + 0.54, y1 = TECHO - 0.34, SEGT = 40;
    for (var i = 0; i < SEGT; i++) {
      var a0 = i / SEGT * TAU, a1 = (i + 1) / SEGT * TAU;
      var c0 = [Math.cos(a0), Math.sin(a0)], c1 = [Math.cos(a1), Math.sin(a1)];
      var A = [LUZ1[0] + c0[0] * TUBO_R, y0, LUZ1[2] + c0[1] * TUBO_R];
      var B = [LUZ1[0] + c1[0] * TUBO_R, y0, LUZ1[2] + c1[1] * TUBO_R];
      var C = [LUZ1[0] + c0[0] * TUBO_R, y1, LUZ1[2] + c0[1] * TUBO_R];
      var D = [LUZ1[0] + c1[0] * TUBO_R, y1, LUZ1[2] + c1[1] * TUBO_R];
      var n0 = [c0[0], 0, c0[1]], n1 = [c1[0], 0, c1[1]];
      tri(A, n0, 0, 0); tri(B, n1, 0, 0); tri(C, n0, 0, 1);
      tri(C, n0, 0, 1); tri(B, n1, 0, 0); tri(D, n1, 0, 1);
    }
    /* base y remate metalicos: el tubo apoya en algo, no flota */
    revolucion(v, tri, LUZ1[0], LUZ1[2], function (u) {
      var R = 0.42 * (u < 0.06 ? u / 0.06 : 1.0);
      return [R, FLOOR_Y + 0.56 * (1.0 - u)];
    }, 8, 40, 2);
    var yc = TECHO - 0.34;
    revolucion(v, tri, LUZ1[0], LUZ1[2], function (u) {
      var R = 0.38 * (u < 0.10 ? u / 0.10 : 1.0);
      return [R, yc + 0.26 * (1.0 - u)];
    }, 8, 40, 2);

    /* esferas de luz apoyadas en el suelo */
    function esfera(c, r) {
      revolucion(v, tri, c[0], c[2], function (u) {
        var ang = u * Math.PI;
        return [r * Math.sin(ang), c[1] + r * 0.90 * Math.cos(ang)];
      }, 18, 30, 1);
    }
    esfera(LUZ2, disp.esf[0][3]); esfera(LUZ3, disp.esf[1][3]); esfera(LUZ4, disp.esf[2][3]);

    luzN = v.length / 8;
    luzBuf = S.GL.buffer(gl, new Float32Array(v));
  }

  var PETALOS_NORMAL = 170;
  var PETALOS_REDUCIDO = 64;

  function construirPetalos(gl) {
    var v = [], CORNERS = [[-1,-1],[1,-1],[-1,1],[-1,1],[1,-1],[1,1]], N = PETALOS_NORMAL;
    for (var i = 0; i < N; i++) {
      var s = [S.GL.hash(i, 3.1), S.GL.hash(i, 7.7), S.GL.hash(i, 15.3), S.GL.hash(i, 23.9)];
      for (var c = 0; c < 6; c++) v.push(CORNERS[c][0], CORNERS[c][1], s[0], s[1], s[2], s[3]);
    }
    petalN = N * 6;
    petalBuf = S.GL.buffer(gl, new Float32Array(v));
  }

  /* constantes compartidas por todos los shaders de la sala */
  var CONST_GLSL = [
    'const float CZ = ' + F(CENTRO_Z) + ';',
    'const float RAD = ' + F(RADIO) + ';',
    'const float SUE = ' + F(FLOOR_Y) + ';',
    'const float TEC = ' + F(TECHO) + ';',
    'const float CUP = ' + F(CUPULA_R) + ';',
    'const float ESC = ' + F(ESC) + ';',
    'const float CVT = ' + F(COVE_TECHO) + ';',
    'const float CVZ = ' + F(COVE_ZOCALO) + ';',
    'const float REPS = ' + F(REPS) + ';',
    'const float DTOP = ' + F(DOSEL_TOP) + ';',
    'const float DALT = ' + F(DOSEL_ALT) + ';'
  ].join('\n');

  /* Las constantes van DESPUES de la linea de precision: en el fragment de
     GLSL ES 3.00 float no tiene precision por defecto, y declarar antes un
     const float es error de compilacion. En el vertex no hace falta. */
  function conConst(src) {
    var marca = 'precision highp float;';
    var m = src.indexOf(marca);
    if (m >= 0) {
      var e = m + marca.length;
      return src.slice(0, e) + '\n' + CONST_GLSL + src.slice(e);
    }
    var i = src.indexOf('\n');
    return src.slice(0, i + 1) + CONST_GLSL + '\n' + src.slice(i + 1);
  }

  /* ------------------------------------------------ masters de proyeccion
     Recursos first-party generados en tools/r63-dosel. Se cargan los del clima
     en uso y los del otro solo si el tema cambia: no tiene sentido descargar
     los cuatro de entrada. Se intenta webp y se cae a jpg. */
  var BASE = (function () {
    try {
      if (window.IG_R63_BASE) return window.IG_R63_BASE;
      var sc = document.currentScript && document.currentScript.src;
      if (sc) return sc.replace(/[^/]*$/, '').replace(/assets\/$/, '') + 'img/';
    } catch (_) {}
    return '/img/';
  })();

  var texCache = {};   /* clave -> {tex:WebGLTexture|null, estado:1|2|3} */
  var glRef = null;
  var avisado = {};
  function aviso(m) {
    if (avisado[m]) return;
    avisado[m] = 1;
    try { console.warn('[IrisGreen] ' + m); } catch (_) {}
  }

  function subirTextura(gl, im, repetirX) {
    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, repetirX ? gl.REPEAT : gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    /* sin anisotropia la pared se emborrona en rasante, que es justo el angulo
       con el que se ve casi toda la sala */
    var ext = gl.getExtension('EXT_texture_filter_anisotropic');
    if (ext) {
      var m = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
      gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, m));
    }
    gl.bindTexture(gl.TEXTURE_2D, null);
    return t;
  }

  function pedir(gl, cual, clima) {
    var clave = cual + '-' + clima;
    var e = texCache[clave];
    if (e) return e;
    e = texCache[clave] = { tex: null, img: null, estado: 1 };
    var raiz = BASE + 'r63-sakura-dosel-' + cual + '-' + clima;
    var im = new Image();
    im.decoding = 'async';
    var reintento = false;
    im.onload = function () {
      e.img = im;
      if (!gl) { e.estado = 2; if (S.GL.repintar) S.GL.repintar(); return; }
      try {
        e.tex = subirTextura(gl, im, cual === 'pared');
        e.estado = 2;
        /* SIN_MOVIMIENTO pinta un solo fotograma: si el master llega despues,
           hay que pedir el repintado o la pared se queda lisa para siempre */
        if (S.GL.repintar) S.GL.repintar();
      } catch (err) {
        e.estado = 3;
        aviso('Sakura: el master ' + clave + ' no se pudo subir a la GPU (' +
              (err && err.name) + '). La sala se queda con su cielo liso.');
      }
    };
    im.onerror = function () {
      if (!reintento) { reintento = true; im.src = raiz + '.jpg'; return; }
      e.img = null;
      e.estado = 3;   /* sin master: la sala se queda con su cielo liso */
      aviso('Sakura: no se pudo cargar el master ' + clave + '.');
      if (S.GL.repintar) S.GL.repintar();
    };
    im.src = raiz + '.webp';
    return e;
  }

  function init(gl) {
    glRef = gl;
    salaProg = S.GL.program(gl, conConst(SALA_VS), conConst(SALA_FS));
    luzProg = S.GL.program(gl, conConst(LUZ_VS), conConst(LUZ_FS));
    petalProg = S.GL.program(gl, conConst(PETAL_VS), conConst(PETAL_FS));
    construir(gl); construirLuces(gl); construirPetalos(gl);
    var c0 = clima();
    pedir(gl, 'pared', c0.key); pedir(gl, 'oculo', c0.key);
  }

  /* reloj de material: acumula tiempo YA escalado por el nivel de movimiento.
     Escalar la fase dentro del shader da un salto al cambiar de nivel. */
  var tm = 0, tPrev = null;
  function reloj(ctx) {
    if (tPrev === null) tPrev = ctx.t;
    var dt = ctx.t - tPrev; tPrev = ctx.t;
    if (dt < 0 || dt > 0.5) dt = 0;
    tm += dt * ctx.drift;
    return tm;
  }

  /* posicion de la camara en mundo: cam = -R^T t de la matriz de vista.
     Hace falta para el reflejo del suelo; sin ella el reflejo no sabe hacia
     donde alargarse y vuelve a salir como una banda recta. */
  var camTmp = new Float32Array(3);
  function camaraDe(m) {
    camTmp[0] = -(m[0] * m[12] + m[1] * m[13] + m[2] * m[14]);
    camTmp[1] = -(m[4] * m[12] + m[5] * m[13] + m[6] * m[14]);
    camTmp[2] = -(m[8] * m[12] + m[9] * m[13] + m[10] * m[14]);
    return camTmp;
  }

  function atrib(gl, prog, stride, lista) {
    for (var i = 0; i < lista.length; i++) {
      var a = prog.a(lista[i][0]);
      if (a < 0) continue;
      gl.enableVertexAttribArray(a);
      gl.vertexAttribPointer(a, lista[i][1], gl.FLOAT, false, stride, lista[i][2]);
      gl.vertexAttribDivisor(a, 0);
    }
  }

  function draw(gl, ctx, fade) {
    var t = reloj(ctx), cl = clima();

    /* si la pantalla cambia de forma se rehace la colocacion: un coste por
       giro de pantalla, no por fotograma */
    var quiere = (ctx.aspect != null && ctx.aspect < 1.02) ? 'estrecho' : 'ancho';
    if (quiere !== dispNom) {
      aplicarDispos(quiere);
      try {
        if (salaBuf) gl.deleteBuffer(salaBuf);
        if (luzBuf) gl.deleteBuffer(luzBuf);
      } catch (_) {}
      construir(gl); construirLuces(gl);
    }
    var q = (ctx.quality === undefined || ctx.quality === null) ? 1 : ctx.quality;
    var det = q > 0.78 ? 1.0 : (q > 0.52 ? 0.55 : 0.0);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.depthMask(true);
    gl.clearColor(cl.ambiente[0] * 0.55, cl.ambiente[1] * 0.55, cl.ambiente[2] * 0.55, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.disable(gl.BLEND);

    salaProg.use();
    gl.uniformMatrix4fv(salaProg.u('uProj'), false, ctx.proj);
    gl.uniformMatrix4fv(salaProg.u('uView'), false, ctx.view);
    gl.uniform3fv(salaProg.u('uCam'), ctx.eye && ctx.eye.length === 3 ? ctx.eye : camaraDe(ctx.view));
    gl.uniform1f(salaProg.u('uFade'), fade);
    gl.uniform1f(salaProg.u('uT'), t);
    gl.uniform1f(salaProg.u('uAmb'), cl.amb);
    gl.uniform1f(salaProg.u('uExpo'), cl.expo);
    gl.uniform1f(salaProg.u('uGTubo'), cl.gTubo);
    gl.uniform1f(salaProg.u('uGEsf'), cl.gEsf);
    gl.uniform1f(salaProg.u('uGCove'), cl.gCove);
    gl.uniform1f(salaProg.u('uNiebla'), cl.nieblaF);
    gl.uniform1f(salaProg.u('uDetalle'), det);
    gl.uniform1f(salaProg.u('uSat'), cl.sat);
    gl.uniform1f(salaProg.u('uRelleno'), cl.relleno);
    gl.uniform1f(salaProg.u('uEmis'), cl.emis);
    gl.uniform1f(salaProg.u('uVivo'), ctx.motion === 'normal' ? 1.0 : 0.0);
    gl.uniform1f(salaProg.u('uMasaK'), cl.masaK);
    gl.uniform1f(salaProg.u('uProyAmb'), cl.proyAmb);

    var ep = pedir(gl, 'pared', cl.key), eo = pedir(gl, 'oculo', cl.key);
    var listo = (ep.estado === 2 && eo.estado === 2) ? 1 : 0;
    gl.uniform1f(salaProg.u('uTexOK'), listo);
    if (listo) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, ep.tex);
      gl.uniform1i(salaProg.u('uTexPared'), 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, eo.tex);
      gl.uniform1i(salaProg.u('uTexOculo'), 1);
      gl.activeTexture(gl.TEXTURE0);
    }
    gl.uniform3fv(salaProg.u('uCielo'), cl.cielo);
    gl.uniform3fv(salaProg.u('uPared'), cl.pared);
    gl.uniform3fv(salaProg.u('uTecho'), cl.techo);
    gl.uniform3fv(salaProg.u('uSuelo'), cl.suelo);
    gl.uniform3fv(salaProg.u('uMueble'), cl.mueble);
    gl.uniform3fv(salaProg.u('uMetal'), cl.metal);
    gl.uniform3fv(salaProg.u('uCove'), cl.cove);
    gl.uniform3fv(salaProg.u('uFlorA'), cl.flor[0]);
    gl.uniform3fv(salaProg.u('uFlorB'), cl.flor[1]);
    gl.uniform3fv(salaProg.u('uFlorC'), cl.flor[2]);
    gl.uniform3fv(salaProg.u('uRama'), cl.rama);
    gl.uniform3fv(salaProg.u('uTubo'), cl.tubo);
    gl.uniform3fv(salaProg.u('uEsfera'), cl.esfera);
    gl.uniform3fv(salaProg.u('uAmbiente'), cl.ambiente);
    gl.uniform3fv(salaProg.u('uLuz1'), LUZ1);
    gl.uniform3fv(salaProg.u('uLuz2'), LUZ2);
    gl.uniform3fv(salaProg.u('uLuz3'), LUZ3);
    gl.uniform3fv(salaProg.u('uLuz4'), LUZ4);
    gl.bindBuffer(gl.ARRAY_BUFFER, salaBuf);
    atrib(gl, salaProg, 32, [['aPos', 3, 0], ['aNrm', 3, 12], ['aInfo', 2, 24]]);
    gl.drawArrays(gl.TRIANGLES, 0, salaN);

    /* esferas y metal opacos, tubo translucido: van despues de la sala */
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    luzProg.use();
    gl.uniformMatrix4fv(luzProg.u('uProj'), false, ctx.proj);
    gl.uniformMatrix4fv(luzProg.u('uView'), false, ctx.view);
    gl.uniform1f(luzProg.u('uFade'), fade);
    gl.uniform1f(luzProg.u('uT'), t);
    gl.uniform1f(luzProg.u('uDrift'), ctx.drift);
    gl.uniform3fv(luzProg.u('uTubo'), cl.tubo);
    gl.uniform3fv(luzProg.u('uEsfera'), cl.esfera);
    gl.uniform3fv(luzProg.u('uFlorB'), cl.flor[1]);
    gl.uniform3fv(luzProg.u('uMetal'), cl.metal);
    gl.uniform1f(luzProg.u('uEsfBril'), cl.esfBril);
    gl.bindBuffer(gl.ARRAY_BUFFER, luzBuf);
    atrib(gl, luzProg, 32, [['aPos', 3, 0], ['aNrm', 3, 12], ['aInfo', 2, 24]]);
    gl.drawArrays(gl.TRIANGLES, 0, luzN);

    /* petalos en el aire */
    gl.depthMask(false);
    petalProg.use();
    gl.uniformMatrix4fv(petalProg.u('uProj'), false, ctx.proj);
    gl.uniformMatrix4fv(petalProg.u('uView'), false, ctx.view);
    gl.uniform1f(petalProg.u('uFade'), fade);
    gl.uniform1f(petalProg.u('uT'), t);
    gl.uniform1f(petalProg.u('uDrift'), ctx.drift);
    gl.uniform3fv(petalProg.u('uFlorA'), cl.flor[0]);
    gl.uniform3fv(petalProg.u('uFlorB'), cl.flor[1]);
    gl.uniform3fv(petalProg.u('uFlorC'), cl.flor[2]);
    gl.bindBuffer(gl.ARRAY_BUFFER, petalBuf);
    atrib(gl, petalProg, 24, [['aCorner', 2, 0], ['aSeed', 4, 8]]);
    /* menos instancias en REDUCIDO: es una diferencia de cuantas cosas se
       mueven, no de lo rapido que se mueven */
    var petalesN = ctx.motion === 'normal'
      ? petalN
      : Math.min(petalN, PETALOS_REDUCIDO * 6);
    gl.drawArrays(gl.TRIANGLES, 0, petalesN);

    gl.depthMask(true);
    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
  }

  function dispose(gl) {
    try {
      [salaProg, luzProg, petalProg].forEach(function (p) { if (p) p.free(); });
      [salaBuf, luzBuf, petalBuf].forEach(function (b) { if (b) gl.deleteBuffer(b); });
    } catch (_) {}
    try {
      Object.keys(texCache).forEach(function (k) {
        if (texCache[k].tex) gl.deleteTexture(texCache[k].tex);
      });
    } catch (_) {}
    texCache = {};
    salaProg = luzProg = petalProg = null;
    salaBuf = luzBuf = petalBuf = null;
  }

  /* ------------------------------------------------- escalon C · Canvas2D
     Consume los mismos masters que el escalon B. Un fallback rosa con petalos
     no es esta sala: el cerezo tiene que seguir siendo reconocible, el clima
     tiene que ser el mismo y la composicion tiene que ser la misma. */
  function c2dDraw(c, ctx, fade) {
    var w = ctx.w, h = ctx.h, cl = clima(), t = (ctx.t || 0) * (ctx.drift || 0);
    var estrecho = w < h * 1.02;
    function css(v, a) {
      return 'rgba(' + Math.round(v[0] * 255) + ',' + Math.round(v[1] * 255) + ',' +
             Math.round(v[2] * 255) + ',' + (a === undefined ? 1 : a) + ')';
    }
    var ep = pedir(null, 'pared', cl.key), eo = pedir(null, 'oculo', cl.key);

    /* fondo: techo, pared y suelo del clima */
    var g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, css(cl.techo));
    g.addColorStop(0.40, css(cl.pared));
    g.addColorStop(0.66, css(cl.pared));
    g.addColorStop(1, css(cl.suelo));
    c.fillStyle = g; c.fillRect(0, 0, w, h);

    var yTecho = h * (estrecho ? 0.44 : 0.40);
    var yZocalo = h * (estrecho ? 0.72 : 0.735);

    /* --- oculo: elipse en el techo con su master dentro */
    var ocx = w * 0.5, ocy = h * (estrecho ? 0.215 : 0.205);
    var orx = w * (estrecho ? 0.40 : 0.265), ory = h * (estrecho ? 0.135 : 0.155);
    c.save();
    c.beginPath(); c.ellipse(ocx, ocy, orx, ory, 0, 0, TAU); c.clip();
    if (eo.img) c.drawImage(eo.img, ocx - orx, ocy - ory, orx * 2, ory * 2);
    else { c.fillStyle = css(cl.cielo); c.fillRect(ocx - orx, ocy - ory, orx * 2, ory * 2); }
    c.restore();
    c.strokeStyle = css(cl.cove, 0.92 * fade);
    c.lineWidth = Math.max(1.5, h * 0.005);
    c.beginPath(); c.ellipse(ocx, ocy, orx, ory, 0, 0, TAU); c.stroke();

    /* --- pared: ventana del panoramico, con la curva de la sala */
    c.save();
    c.beginPath();
    c.moveTo(0, yTecho);
    c.quadraticCurveTo(w * 0.5, yTecho + h * 0.055, w, yTecho);
    c.lineTo(w, yZocalo);
    c.quadraticCurveTo(w * 0.5, yZocalo + h * 0.055, 0, yZocalo);
    c.closePath(); c.clip();
    if (ep.img) {
      var desp = (t * 3.2) % ep.img.width;
      var alto = yZocalo - yTecho + h * 0.06;
      c.drawImage(ep.img, -desp, yTecho, ep.img.width * (w / ep.img.width) * 1.0, alto);
      c.drawImage(ep.img, -desp + w, yTecho, w, alto);
    } else {
      c.fillStyle = css(cl.cielo); c.fillRect(0, yTecho, w, yZocalo - yTecho + h * 0.06);
    }
    c.restore();

    /* --- aros de cove */
    c.strokeStyle = css(cl.cove, 0.95 * fade);
    c.lineWidth = Math.max(1.5, h * 0.006);
    [yTecho, yZocalo].forEach(function (y) {
      c.beginPath();
      c.moveTo(0, y); c.quadraticCurveTo(w * 0.5, y + h * 0.055, w, y); c.stroke();
    });

    /* --- suelo: derrame y petalos proyectados */
    var sg = c.createRadialGradient(w * 0.5, yZocalo + h * 0.05, 10, w * 0.5, h, h * 0.75);
    sg.addColorStop(0, css(cl.tubo, 0.26 * fade));
    sg.addColorStop(1, css(cl.suelo, 0));
    c.fillStyle = sg; c.fillRect(0, yZocalo, w, h - yZocalo);
    for (var i = 0; i < 34; i++) {
      var s1 = S.GL.hash(i, 3.1), s2 = S.GL.hash(i, 7.7), s3 = S.GL.hash(i, 15.3);
      var py = yZocalo + h * 0.04 + s2 * (h - yZocalo) * 0.95;
      var pr = (h - yZocalo) * (0.030 + s3 * 0.045) * (0.6 + 1.2 * s2);
      c.fillStyle = css(cl.flor[s3 < 0.5 ? 0 : 1], (0.42 + 0.40 * s3) * fade);
      petalo5(c, s1 * w, py, pr, s1 * 6.283);
    }

    /* --- mobiliario */
    function cojin(cx, cy, rx, ry) {
      var sg2 = c.createRadialGradient(cx, cy + ry * 0.72, 2, cx, cy + ry * 0.72, rx * 1.22);
      sg2.addColorStop(0, 'rgba(0,0,0,' + (0.20 * fade) + ')');
      sg2.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = sg2;
      c.beginPath(); c.ellipse(cx, cy + ry * 0.72, rx * 1.22, ry * 0.85, 0, 0, TAU); c.fill();
      var mg = c.createLinearGradient(0, cy - ry, 0, cy + ry);
      mg.addColorStop(0, css(cl.mueble, 0.99 * fade));
      mg.addColorStop(1, css([cl.mueble[0] * 0.72, cl.mueble[1] * 0.72, cl.mueble[2] * 0.76], 0.99 * fade));
      c.fillStyle = mg;
      c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, TAU); c.fill();
    }
    var fw = estrecho ? 0.30 : 0.21;
    cojin(w * 0.5, h * 0.865, h * fw * 0.95, h * 0.066);
    cojin(w * 0.5, h * 0.822, h * fw * 0.44, h * 0.032);
    if (!estrecho) {
      cojin(w * 0.16, h * 0.828, h * 0.115, h * 0.034);
      cojin(w * 0.86, h * 0.808, h * 0.105, h * 0.031);
    }

    /* --- esferas de luz */
    [[0.10, 0.880, 0.055], [0.185, 0.912, 0.037], [0.285, 0.862, 0.028]].forEach(function (e) {
      var ex = w * (estrecho ? e[0] * 0.75 : e[0]), ey = h * e[1], er = h * e[2];
      var rg = c.createRadialGradient(ex - er * 0.3, ey - er * 0.3, er * 0.1, ex, ey, er * 2.4);
      rg.addColorStop(0, css(cl.esfera, 0.95 * fade));
      rg.addColorStop(0.42, css(cl.tubo, 0.30 * fade));
      rg.addColorStop(1, css(cl.tubo, 0));
      c.fillStyle = rg;
      c.beginPath(); c.ellipse(ex, ey, er * 2.4, er * 2.4, 0, 0, TAU); c.fill();
      c.fillStyle = css(cl.esfera, 0.96 * fade);
      c.beginPath(); c.ellipse(ex, ey, er, er * 0.92, 0, 0, TAU); c.fill();
    });

    /* --- tubo de burbujas */
    var tx = w * (estrecho ? 0.76 : 0.805), tw = Math.max(14, w * (estrecho ? 0.10 : 0.055));
    var ty0 = yTecho + h * 0.015, ty1 = h * 0.845;
    var tg = c.createLinearGradient(tx - tw / 2, 0, tx + tw / 2, 0);
    tg.addColorStop(0, css(cl.tubo, 0.55 * fade));
    tg.addColorStop(0.40, css(cl.tubo, 1.0 * fade));
    tg.addColorStop(0.62, css(cl.esfera, 0.98 * fade));
    tg.addColorStop(1, css(cl.tubo, 0.55 * fade));
    c.fillStyle = tg; c.fillRect(tx - tw / 2, ty0, tw, ty1 - ty0);
    /* charco de luz del tubo sobre el suelo */
    var pg2 = c.createRadialGradient(tx, ty1 + h * 0.03, 4, tx, ty1 + h * 0.03, tw * 3.2);
    pg2.addColorStop(0, css(cl.tubo, 0.42 * fade));
    pg2.addColorStop(1, css(cl.tubo, 0));
    c.fillStyle = pg2;
    c.beginPath(); c.ellipse(tx, ty1 + h * 0.03, tw * 3.2, tw * 1.5, 0, 0, TAU); c.fill();
    c.fillStyle = css(cl.metal, 0.98 * fade);
    c.beginPath(); c.ellipse(tx, ty1 + h * 0.038, tw * 0.80, h * 0.017, 0, 0, TAU); c.fill();
    c.fillRect(tx - tw * 0.80, ty1, tw * 1.60, h * 0.038);
    c.fillRect(tx - tw * 0.68, ty0 - h * 0.026, tw * 1.36, h * 0.028);
    for (var b = 0; b < 7; b++) {
      var bs = S.GL.hash(b, 11.3);
      var by = ty1 - ((bs + t * 0.010) % 1) * (ty1 - ty0);
      c.fillStyle = 'rgba(255,252,255,' + (0.72 * fade) + ')';
      petalo5(c, tx + (bs - 0.5) * tw * 0.42, by, tw * 0.17, bs * 6.283);
    }

    /* --- petalos en el aire */
    for (var k = 0; k < 40; k++) {
      var h1 = S.GL.hash(k, 3.7), h2 = S.GL.hash(k, 9.1), h3 = S.GL.hash(k, 19.3);
      var yy = ((h2 + t * 0.011 * (0.6 + h3)) % 1.0) * h * 0.92;
      c.globalAlpha = (0.28 + 0.40 * h3) * fade;
      c.fillStyle = css(cl.flor[h3 < 0.4 ? 0 : 2]);
      c.beginPath();
      c.ellipse(h1 * w, yy, 2 + h3 * 4, 3 + h3 * 6, h1 * 3.14, 0, TAU);
      c.fill();
    }
    c.globalAlpha = 1;
  }

  /* silueta de cinco petalos, para que el gobo del suelo no sea un circulo */
  function petalo5(c, cx, cy, r, giro) {
    c.beginPath();
    for (var i = 0; i <= 44; i++) {
      var a = i / 44 * TAU;
      var rr = r * (0.60 + 0.40 * Math.pow(Math.abs(Math.cos((a + giro) * 2.5)), 0.62));
      var x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * 0.62;
      if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
    }
    c.closePath(); c.fill();
  }

  function stillDraw(c, ctx) {
    var d = ctx.drift, t = ctx.t;
    ctx.drift = 0; ctx.t = 22;
    c2dDraw(c, ctx, 1);
    ctx.drift = d; ctx.t = t;
  }

  S.register({
    id: 'sakura',
    es: 'Sakura', en: 'Sakura',
    des: 'Una sala redonda con el cerezo proyectado en la cúpula y en la pared, luz de color y sitio donde sentarse.',
    den: 'A round room with cherry blossom projected on the dome and walls, coloured light and somewhere to sit.',
    audio: null,
    gl: { init: init, draw: draw, dispose: dispose },
    c2d: { draw: c2dDraw },
    still: { draw: stillDraw }
  });
})(window);
