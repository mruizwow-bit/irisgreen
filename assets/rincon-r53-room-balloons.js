/* R53 · Sala 1 · Mundo de globos de luz.
   Construida contra la referencia de Maria, no inventada.

   Lo que dice la referencia, medido:
   - la sala es CLARA (luminancia media 125-189 de 255), no un vacio oscuro;
   - el color vive en los cuerpos (S 0,35-0,65), no en el fondo (S 0,08-0,13);
   - el suelo se aclara con la distancia y lo mas oscuro es el suelo cercano;
   - hay arquitectura: arcos, columnas y plintos bajos que dan escala;
   - la tela tiene costuras verticales y brillo satinado, no plastico;
   - cada pieza lleva la luz DENTRO; el foco no esta fuera. */
(function (window) {
  'use strict';
  var S = window.IGSalaStage;
  if (!S) return;

  /* Muestreadas de la referencia */
  var HUES = [
    [0.855, 0.608, 0.655],   /* rosa        #da9ba7 */
    [0.914, 0.753, 0.592],   /* crema ambar #e9c097 */
    [0.639, 0.745, 0.827],   /* menta azul  #a3bed3 */
    [0.702, 0.745, 0.894],   /* lavanda     #b3bee4 */
    [0.969, 0.843, 0.725],   /* blanco calido #f7d7b9 */
    [0.800, 0.870, 0.850]    /* verde palido */
  ];

  var FLOOR_Y = S.GL.FLOOR_Y;
  var CEIL_Y = FLOOR_Y + 5.0;

  /* ---------------------------------------------------------- siembra
     La composicion NO es aleatoria. La referencia tiene jerarquia: una o dos
     piezas mandan, el resto acompana, y entre grupo y grupo hay vacio para que
     se vean el suelo y la galeria. Por eso las piezas se colocan en bandas de
     profundidad con huecos deliberados entre ellas, y los protagonistas tienen
     posicion fija en vez de salir de un hash. */
  var CAST = [
    /* kind: 0 esfera · 1 colgada con cuello · 2 apoyada · 3 pequena con hilo
       mat : 0 satinado · 1 mate · 2 translucido · 3 opalino · 4 lechoso
       rol : 2 protagonista · 1 secundaria · 0 acompanamiento

       La referencia NO es una sala con piezas repartidas: es una sala LLENA de
       cuerpos grandes que se tocan y se solapan, del suelo a la boveda. El aire
       no esta en el vacio entre piezas sueltas, esta entre masas. Por eso la
       mayoria son grandes, la forma dominante es la esfera y solo quedan dos
       calles libres para que se vean el suelo y el fondo. */

    /* --- primer plano: masas que cortan el encuadre ------------------- */
    { kind: 0, x: -3.95, y: 2.60, z:  -7.6, r: 2.04, hue: 0, mat: 2, rol: 2, op: 0.98, il: 0.96, sag: 0.06 },
    { kind: 2, x:  3.55, y: 1.60, z:  -6.6, r: 1.58, hue: 1, mat: 3, rol: 2, op: 0.99, il: 0.58, sag: 0.10 },
    { kind: 1, x: -6.15, y: 3.35, z:  -8.9, r: 1.35, hue: 3, mat: 2, rol: 1, op: 0.96, il: 0.92, sag: 0.22 },
    { kind: 0, x:  6.35, y: 3.60, z:  -8.2, r: 1.50, hue: 5, mat: 3, rol: 1, op: 0.99, il: 0.74, sag: 0.05 },
    { kind: 2, x: -1.15, y: 0.86, z:  -9.4, r: 0.85, hue: 2, mat: 3, rol: 0, op: 0.99, il: 0.52, sag: 0.06 },
    /* --- plano medio: se solapan, que es lo que llena la sala --------- */
    { kind: 0, x:  2.35, y: 3.95, z: -11.2, r: 1.41, hue: 4, mat: 2, rol: 1, op: 0.94, il: 0.94, sag: 0.04 },
    { kind: 2, x:  5.55, y: 2.03, z: -13.4, r: 1.67, hue: 1, mat: 2, rol: 1, op: 0.99, il: 0.66, sag: 0.06 },
    { kind: 1, x: -2.95, y: 4.15, z: -12.6, r: 1.17, hue: 0, mat: 3, rol: 0, op: 0.97, il: 0.80, sag: 0.20 },
    { kind: 0, x: -5.85, y: 1.45, z: -12.1, r: 1.11, hue: 5, mat: 0, rol: 0, op: 0.99, il: 0.46, sag: 0.04 },
    { kind: 2, x:  2.45, y: 1.10, z: -14.6, r: 1.09, hue: 3, mat: 1, rol: 0, op: 0.99, il: 0.30, sag: 0.05 },
    { kind: 0, x:  4.10, y: 4.55, z: -15.2, r: 1.03, hue: 2, mat: 2, rol: 0, op: 0.93, il: 0.88, sag: 0.03 },
    { kind: 1, x: -4.55, y: 3.05, z: -16.0, r: 0.92, hue: 4, mat: 0, rol: 0, op: 0.99, il: 0.62, sag: 0.18 },
    { kind: 3, x: -1.20, y: 2.35, z: -13.0, r: 0.30, hue: 1, mat: 3, rol: 0, op: 0.98, il: 0.86, sag: 0.02 },
    { kind: 0, x: -1.95, y: 1.30, z: -17.4, r: 0.75, hue: 0, mat: 4, rol: 0, op: 0.99, il: 0.40, sag: 0.03 },
    /* --- calle de aire a la izquierda entre z -17 y z -21 ------------- */
    { kind: 2, x:  6.55, y: 1.20, z: -18.3, r: 1.18, hue: 2, mat: 0, rol: 0, op: 0.99, il: 0.54, sag: 0.05 },
    { kind: 0, x:  3.20, y: 3.70, z: -19.6, r: 0.89, hue: 1, mat: 2, rol: 0, op: 0.92, il: 0.82, sag: 0.03 },
    { kind: 3, x:  1.05, y: 2.60, z: -18.8, r: 0.24, hue: 3, mat: 0, rol: 0, op: 0.99, il: 0.60, sag: 0.02 },
    /* --- fondo: mas pequenas y lavadas por el aire de la nave --------- */
    { kind: 0, x: -4.05, y: 2.20, z: -21.8, r: 0.82, hue: 4, mat: 0, rol: 0, op: 0.99, il: 0.48, sag: 0.03 },
    { kind: 1, x: -1.85, y: 4.30, z: -23.4, r: 0.77, hue: 0, mat: 2, rol: 0, op: 0.90, il: 0.78, sag: 0.16 },
    { kind: 2, x:  2.60, y: 0.72, z: -23.0, r: 0.71, hue: 2, mat: 1, rol: 0, op: 0.99, il: 0.26, sag: 0.04 },
    { kind: 0, x:  5.40, y: 2.95, z: -24.9, r: 0.68, hue: 3, mat: 3, rol: 0, op: 0.94, il: 0.58, sag: 0.02 },
    { kind: 3, x: -5.65, y: 2.50, z: -22.6, r: 0.21, hue: 1, mat: 0, rol: 0, op: 0.99, il: 0.52, sag: 0.02 },
    { kind: 2, x: -3.35, y: 0.66, z: -26.4, r: 0.43, hue: 5, mat: 4, rol: 0, op: 0.99, il: 0.22, sag: 0.02 },
    { kind: 0, x: -2.35, y: 3.10, z: -27.2, r: 0.54, hue: 4, mat: 2, rol: 0, op: 0.88, il: 0.66, sag: 0.02 },
    { kind: 1, x:  3.85, y: 4.35, z: -28.5, r: 0.50, hue: 0, mat: 3, rol: 0, op: 0.91, il: 0.50, sag: 0.12 },
    { kind: 0, x: -2.05, y: 1.55, z: -29.4, r: 0.40, hue: 2, mat: 0, rol: 0, op: 0.98, il: 0.44, sag: 0.02 },
    { kind: 3, x: -0.95, y: 2.85, z: -31.0, r: 0.17, hue: 3, mat: 3, rol: 0, op: 0.96, il: 0.46, sag: 0.02 },

    /* --- cuerpos que entran por el borde del encuadre ------------------
       No se ven enteros, y ese es el punto: un cuerpo cortado por el marco
       dice que la sala sigue fuera de la pantalla y que quien mira esta
       dentro, no delante. */
    { kind: 0, x: -5.35, y: 3.15, z:  -5.6, r: 1.56, hue: 3, mat: 2, rol: 2, op: 0.93, il: 0.94, sag: 0.05, press: 0.82, off: 1 },
    { kind: 0, x:  5.75, y: 3.25, z:  -6.6, r: 1.48, hue: 4, mat: 3, rol: 1, op: 0.92, il: 0.86, sag: 0.04, press: 0.74, off: 1 },
    { kind: 2, x: -8.35, y: 1.85, z:  -6.0, r: 1.70, hue: 0, mat: 2, rol: 1, op: 0.94, il: 0.76, sag: 0.10, press: 0.40, off: 1 },
    { kind: 1, x:  8.70, y: 2.95, z:  -6.8, r: 1.58, hue: 1, mat: 2, rol: 1, op: 0.93, il: 0.90, sag: 0.22, press: 0.55, off: 1 },

    /* --- columnas de luz: membranas verticales entre algunos vanos -----
       kind 4. No en todos los arcos: solo donde hacen falta para que la
       galeria deje de ser arquitectura y pase a ser instalacion. */
    { kind: 4, x: -6.40, y: 1.50, z: -13.4, r: 0.50, hue: 4, mat: 2, rol: 0, op: 0.78, il: 1.00, sag: 0.00, tall: 3.05 },
    { kind: 4, x:  4.35, y: 1.50, z: -20.6, r: 0.44, hue: 3, mat: 2, rol: 0, op: 0.76, il: 0.96, sag: 0.00, tall: 3.25 },
    { kind: 4, x: -2.75, y: 1.50, z: -24.2, r: 0.40, hue: 2, mat: 2, rol: 0, op: 0.74, il: 0.90, sag: 0.00, tall: 3.15 }
  ];
  var MAX = CAST.length;

  var PLINTHS = [
    { x:  3.55, z:  -6.6, r: 1.32, h: 0.26 },
    { x: -1.15, z:  -9.4, r: 0.86, h: 0.22 },
    { x:  5.55, z: -13.4, r: 1.38, h: 0.28 },
    { x:  2.45, z: -14.6, r: 0.98, h: 0.22 },
    { x:  6.55, z: -18.3, r: 1.02, h: 0.24 },
    { x: -3.35, z: -26.4, r: 0.62, h: 0.20 }
  ];
  var field = (function () {
    var a = [];
    for (var i = 0; i < MAX; i++) {
      var c = CAST[i];
      var h = function (k) { return S.GL.hash(i, k); };
      var tp = c.taper !== undefined ? c.taper : (c.kind === 1 ? 0.30 + h(3.3) * 0.26 : 0.05 + h(3.3) * 0.20);
      var pr = c.press !== undefined ? c.press : 0.32 + h(11.9) * 0.64;
      var y = c.y;
      if (c.kind === 2) {
        /* Un cuerpo apoyado se posa: no se hunde ni levita. Como la silueta ya
           no es una esfera sino una membrana inflada, la distancia del centro a
           la base depende de la presion, del peso y de la recogida, asi que hay
           que preguntarsela a la propia forma en vez de suponer un radio.
           Si no, al inflar la geometria la pieza baja del suelo y el suelo la
           recorta en recto, que es justo lo que no puede pasar. */
        /* peor caso del ciclo de respiracion: la piel cede un 2% de presion y
           el cuerpo crece un 1,2%. Si se calcula el apoyo con la presion en
           reposo, la pieza se hunde al respirar y el suelo la corta en recto. */
        var soft = 1.0 - Math.max(0, pr - 0.020);
        var rBot = (1 + soft * 0.12 + c.sag * 0.15) * (1 - tp * 0.34) * (1 - 0.06 - soft * 0.07) * 1.014;
        var sit = 0;
        for (var q = 0; q < PLINTHS.length; q++) {
          var pl = PLINTHS[q];
          if (Math.abs(pl.x - c.x) < 0.30 && Math.abs(pl.z - c.z) < 0.30) { sit = pl.h * 0.58; break; }
        }
        y = sit + c.r * rBot;
      }
      /* Variedad controlada, no ruido: cada pieza tiene su grado de inflado,
         su estrechamiento inferior y una asimetria leve. Dos globos del mismo
         lote nunca tienen la misma presion. */
      a.push({
        kind: c.kind, z: c.z, r: c.r, y0: FLOOR_Y + y,
        x0: c.x, hue: c.hue, mat: c.mat, rol: c.rol,
        op: c.op, il: c.il, sag: c.sag,
        taper: tp, asym: c.asym !== undefined ? c.asym : (h(7.1) - 0.5) * 0.18, press: pr,
        tall: c.tall || 1.0,
        gores: 9 + Math.floor(S.GL.hash(i, 27.9) * 5),
        ph: S.GL.hash(i, 13.7) * 6.283,
        /* las grandes se mueven menos: el peso se lee en la inercia */
        bob: (0.030 + S.GL.hash(i, 21.3) * 0.055) / (0.6 + c.r * 0.5),
        sway: (0.045 + S.GL.hash(i, 9.1) * 0.100) / (0.6 + c.r * 0.5),
        px: 0, py: 0, ax: 0, ay: 0
      });
    }
    return a;
  })();

  function animate(ctx, n) {
    var t = ctx.t, drift = ctx.drift;
    /* COMPOSICION VERTICAL. En una pantalla alta la sala no se recorta: se
       recompone. Las piezas suspendidas se reparten en mas altura para ocupar
       el alto disponible, porque si no quedan en una banda central con techo
       vacio arriba y suelo vacio abajo. Las apoyadas no se mueven: perderian
       el contacto con el suelo. */
    var alto = Math.max(0, Math.min(1, 1 - ctx.aspect));
    for (var i = 0; i < n; i++) {
      var b = field[i];
      var subir = (b.kind === 2) ? 0 : (b.y0 - (FLOOR_Y + 2.6)) * 0.42 * alto;
      var y = b.y0 + subir + (drift > 0 ? Math.sin(t * b.bob + b.ph) * (b.kind === 2 ? 0.02 : 0.16) * drift : 0);
      var x = b.x0 + (drift > 0 ? Math.sin(t * b.bob * 0.7 + b.ph * 1.7) * b.sway * drift : 0);
      var age = ctx.t - ctx.push.t;
      if (age < 6.5 && ctx.push.t > -90 && b.kind !== 2) {
        var sx = x / (-b.z), sy = y / (-b.z);
        var dx = sx - ctx.push.x, dy = sy - ctx.push.y;
        var k = Math.exp(-(dx * dx + dy * dy) * 2.6) * (1 - age / 6.5) * 1.4;
        b.px += (dx * k - b.px) * 0.07;
        b.py += (dy * k - b.py) * 0.07;
      } else { b.px *= 0.97; b.py *= 0.97; }
      b.ax = x + b.px * (-b.z) * 0.45;
      b.ay = y + b.py * (-b.z) * 0.25;
    }
  }

  /* ------------------------------------------------------ arquitectura */
  var ROOM_VS = [
    '#version 300 es',
    'in vec3 aPos; in vec3 aNrm; in float aShade; in float aKind;',
    'uniform mat4 uProj; uniform mat4 uView;',
    'out vec3 vNrm; out float vShade; out float vDepth; out vec3 vW; out float vKind;',
    'void main(){',
    ' vec4 c = uView * vec4(aPos, 1.0);',
    ' vNrm = aNrm; vShade = aShade; vDepth = -c.z; vW = aPos; vKind = aKind;',
    ' gl_Position = uProj * c;',
    '}'
  ].join('\n');

  var ROOM_FS = [
    '#version 300 es',
    'precision highp float;',
    /* Piedra. Un paramento resuelto con color y sombreado se lee como maqueta.
       La piedra tiene grano, estrato, manchas de zona, desgaste en el zocalo y
       aristas que no son perfectas, y responde a la luz de forma desigual. */
    'float h21r(vec2 p){ return fract(sin(dot(p, vec2(41.31, 289.07))) * 43758.5453); }',
    'float vnr(vec2 p){',
    ' vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);',
    ' float a = h21r(i), b = h21r(i + vec2(1.0, 0.0));',
    ' float c = h21r(i + vec2(0.0, 1.0)), d = h21r(i + vec2(1.0, 1.0));',
    ' return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);',
    '}',
    'float fbmr(vec2 p){',
    ' return vnr(p) * 0.52 + vnr(p * 2.07 + 5.1) * 0.28 + vnr(p * 4.13 + 11.7) * 0.20;',
    '}',
    'in vec3 vNrm; in float vShade; in float vDepth; in vec3 vW; in float vKind;',
    'uniform float uFade;',
    'out vec4 oCol;',
    'void main(){',
    ' vec3 n = normalize(vNrm);',
    /* luz alta y difusa, como en la referencia */
    ' vec3 L = normalize(vec3(-0.25, 0.86, 0.45));',
    ' float key = clamp(dot(n, L) * 0.5 + 0.5, 0.0, 1.0);',
    /* 0 paramento · 1 boveda · 2 plinto. Cada material tiene su color y su
       respuesta, que es lo que hace que la sala no sea una sola superficie */
    ' float side = clamp(vW.x / 7.0, -1.0, 1.0);',
    ' vec3 tw = mix(vec3(0.928, 0.962, 1.045), vec3(1.058, 0.972, 0.900), side * 0.5 + 0.5);',
    ' vec3 base = vKind < 0.5 ? vec3(0.672, 0.606, 0.648)',
    '           : vKind < 1.5 ? vec3(0.766, 0.706, 0.726)',
    '                         : vec3(0.664, 0.646, 0.660);',
    ' float rough = vKind < 1.5 ? 0.46 : 0.26;',
    ' vec3 col = base * tw * clamp(vShade, 0.55, 1.90) * (0.78 + rough * key);',

    /* --- materia de la piedra ------------------------------------------- */
    /* proyeccion segun la cara: los paramentos se leen en el plano yz o xy, el
       suelo y la boveda en xz. Sin esto el grano se estira en las caras */
    ' vec3 an = abs(normalize(vNrm));',
    ' vec2 uv = an.x > max(an.y, an.z) ? vW.zy : (an.y > an.z ? vW.xz : vW.xy);',
    /* grano fino, el que hace que la superficie no sea lisa */
    ' float grano = fbmr(uv * 26.0);',
    /* estratos: la piedra se deposito en capas, y eso se ve en horizontal */
    ' float estrato = fbmr(vec2(uv.x * 0.6, vW.y * 5.2)) * 0.6 + 0.4 * vnr(vec2(3.1, vW.y * 11.0));',
    /* manchas de zona: bloques distintos, humedad, edad */
    ' float zona = fbmr(uv * 1.15 + 3.7);',
    ' float mat = grano * 0.34 + estrato * 0.30 + zona * 0.36;',
    ' col *= 0.88 + 0.24 * mat;',
    /* la piedra no responde igual en toda su superficie: donde es mas densa
       devuelve un poco mas de luz */
    ' col += base * key * (grano - 0.5) * 0.10;',
    /* desgaste del zocalo: la base de un muro siempre esta mas sucia */
    ' float zocalo = 1.0 - smoothstep(0.0, 1.35, vW.y - (' + FLOOR_Y.toFixed(3) + '));',
    ' col *= 1.0 - zocalo * (0.10 + 0.10 * zona) * step(vKind, 1.5);',
    /* aristas: una piedra real no tiene el canto perfecto, se come y se aclara */
    ' float canto = pow(1.0 - abs(dot(normalize(vNrm), normalize(-vW + vec3(0.0, 2.0, 6.0)))), 3.0);',
    ' col += base * canto * 0.05 * (0.4 + 0.6 * grano);',

    /* el paramento se aclara hacia arriba y recibe rebote calido abajo */
    ' float up = clamp((vW.y - (' + FLOOR_Y.toFixed(3) + ')) / 5.0, 0.0, 1.0);',
    ' col *= 0.90 + 0.20 * up;',
    ' col += vec3(0.046, 0.030, 0.034) * pow(1.0 - up, 2.6) * step(vKind, 0.5);',
    /* el arranque de los vanos y el zocalo del deambulatorio quedan en
       penumbra: es donde una sala real tiene sus negros */
    ' col *= 1.0 - 0.46 * pow(1.0 - up, 6.0) * step(vKind, 0.5);',
    /* aire: el fondo se aclara con la distancia y da profundidad */
    ' col = mix(col, vec3(0.726, 0.690, 0.718), clamp((vDepth - 8.0) / 40.0, 0.0, 0.48));',
    ' oCol = vec4(col * uFade, 1.0);',
    '}'
  ].join('\n');

  /* ----------------------------------------------------------- cuerpos */
  var PAL = [
    ' const vec3 HUES[6] = vec3[6](',
    '  vec3(0.855,0.608,0.655), vec3(0.914,0.753,0.592), vec3(0.639,0.745,0.827),',
    '  vec3(0.702,0.745,0.894), vec3(0.969,0.843,0.725), vec3(0.800,0.870,0.850));'
  ].join('\n');

  /* El reflejo se estira mas o menos segun la pasada: dos capas con estirado
     distinto dan la veta larga del suelo pulido, no una mancha redonda. */
  var FLIP = [
    'uniform vec3 uFlip;',  /* x: 1 escena / -1 reflejo · y: suelo · z: desenfoque */
    /* El espejo es un espejo: refleja en el plano del suelo sin deformar. Lo que
       alarga el reflejo en un suelo pulido no es un estirado, es que la
       superficie no es perfecta y lo desenfoca hacia quien mira. Por eso el
       reflejo se pinta varias veces desplazado hacia abajo, no estirado. */
    'vec3 salaFlip(vec3 p){',
    ' float m = step(uFlip.x, -0.5);',
    ' float mirrored = uFlip.y - (p.y - uFlip.y) * 1.32 - uFlip.z;',
    ' return vec3(p.x, mix(p.y, mirrored, m), p.z);',
    '}'
  ].join('\n');

  var VS = [
    '#version 300 es',
    'in vec2 aCorner;',
    'in vec4 aPos;',    /* xyz + radio */
    'in vec4 aData;',   /* tipo, tono, gajos, material */
    'in vec4 aMore;',   /* opacidad, luz interior, caida, papel */
    'in vec4 aForm;',   /* estrechamiento, asimetria, presion, altura */
    'uniform mat4 uProj; uniform mat4 uView; uniform float uT;',
    FLIP,
    'out vec2 vLocal; out float vKind; out vec3 vHue; out float vGores; out float vDepth;',
    'out float vMat; out float vOp; out float vIl; out float vSag; out float vSeed; out float vR;',
    'out float vAsp; out vec3 vForm; out float vPulse;',
    'out float vWy; out float vWx; out float vWyAbs;',
    PAL,
    'void main(){',
    /* RESPIRACION. La membrana no esta quieta: el aire de dentro se mueve y la
       piel cede y vuelve. Es menos del dos por ciento del tamano, con dos
       periodos distintos por pieza, asi que ninguna respira a la vez que otra
       y el conjunto nunca cae en un pulso comun ni en un bucle reconocible. */
    ' float seed = aData.y * 3.1 + aData.z;',
    ' float br = sin(uT * (0.115 + fract(aData.y * 0.37 + aData.z * 0.11) * 0.075) + aData.z * 2.7)',
    '          + 0.55 * sin(uT * 0.0431 + aData.y * 1.9);',
    ' float breath = 1.0 + br * 0.0115;',
    /* la luz de dentro tambien late, aun mas despacio que la piel */
    ' vPulse = 0.86 + 0.14 * (0.5 + 0.5 * sin(uT * 0.0730 + aData.z * 1.3))',
    '        + 0.08 * sin(uT * 0.0193 + aData.y * 2.1);',
    ' vec3 wp = salaFlip(aPos.xyz);',
    ' vec4 c = uView * vec4(wp, 1.0);',
    /* las columnas de luz son mucho mas altas que anchas */
    ' float asp = aData.x > 3.5 ? aForm.w : 1.0;',
    ' float rad = aPos.w * breath;',
    /* SILUETA FUERA DEL EJE.
       Un cuerpo redondo no se proyecta centrado en la proyeccion de su centro:
       visto de lado, su silueta se desplaza hacia afuera y crece. Expandir el
       cuadro portador en el plano de la pantalla, centrado en el centro, deja
       corto el lado exterior y RECORTA la pieza en recto. Por eso los cuerpos
       alejados del eje se veian cortados, y tanto mas cuanto mas ancho el
       angulo de vision, que es lo que pasa en una pantalla de movil.

       Se resuelve como se debe: el cuadro se levanta sobre el disco de silueta
       del cono tangente, perpendicular a la linea de vision. Ese disco si se
       proyecta exactamente en el contorno de la pieza. */
    /* El radio FISICO del cuerpo y el margen del cuadro portador son dos cosas
       distintas: confundirlos hace que las piezas cercanas se disparen de
       tamano, porque el cono tangente se calcula con un radio que no es el
       suyo. El cono usa el radio del cuerpo; el cuadro conserva su margen. */
    ' float Rs = rad * 1.20;',
    ' float MARGEN = 2.15 / 1.20;',
    ' if(aData.x > 3.5){',
    '  c.xy += aCorner * rad * 2.15 * vec2(1.0, asp);',
    '  vWy = wp.y + aCorner.y * rad * 2.15 * asp;',
    ' } else {',
    '  float dist = max(length(c.xyz), Rs * 1.05);',
    '  float k = Rs * Rs / (dist * dist);',
    /* el centro de la silueta se acerca y el radio crece: eso es lo que hay
       que corregir. Los ejes del cuadro se dejan alineados con la pantalla,
       porque estas piezas tienen eje vertical propio y orientar el cuadro a la
       linea de vision las inclinaria. */
    '  vec3 cen = c.xyz * (1.0 - k);',
    '  float rSil = Rs / sqrt(max(1.0 - k, 0.0001));',
    '  c = vec4(cen, 1.0);',
    '  c.xy += aCorner * rSil * MARGEN;',
    /* La altura que decide donde arranca el reflejo tiene que medirse en el
       MUNDO, con el radio del cuerpo, no con el radio del disco de silueta:
       ese vive en el espacio de la camara y ya no corresponde a la altura real.
       Usarlo dejaba el desvanecido descolocado y pintaba una linea horizontal
       del color de la pieza a lo largo del borde de su cuadro. */
    '  vWy = wp.y + aCorner.y * rad * 2.15;',
    ' }',
    ' vWx = aPos.x; vWyAbs = aPos.y;',
    /* al respirar cambia tambien la presion, asi que la forma cede un poco */
    ' vForm = vec3(aForm.x, aForm.y, clamp(aForm.z - br * 0.020, 0.0, 1.0));',
    ' vLocal = aCorner * 2.15; vAsp = asp; vKind = aData.x; vHue = HUES[int(aData.y)];',
    ' vGores = aData.z; vMat = aData.w; vDepth = -c.z;',
    ' vOp = aMore.x; vIl = aMore.y; vSag = aMore.z; vSeed = seed;',
    ' vR = rad;',
    ' gl_Position = uProj * c;',
    '}'
  ].join('\n');

  var FS = [
    '#version 300 es',
    'precision highp float;',
    'in vec2 vLocal; in float vKind; in vec3 vHue; in float vGores; in float vDepth;',
    'in float vMat; in float vOp; in float vIl; in float vSag; in float vSeed; in float vR;',
    'in float vAsp; in vec3 vForm; in float vPulse;',
    'in float vWy; in float vWx; in float vWyAbs;',
    'uniform float uFade; uniform float uRefl; uniform float uFloor; uniform float uT;',
    'out vec4 oCol;',
    /* siluetas: cada tipo tiene su forma, y la caida (vSag) cambia el peso de la
       pieza, que es lo que hace que no parezcan todas el mismo globo */
    /* GEOMETRIA INFLABLE
       Un globo no es un solido recortado: es una membrana cerrada llena de aire,
       y su contorno es siempre curvo y continuo.

       La forma se describe por el ANCHO de la seccion a cada altura, que es como
       se describe de verdad un cuerpo inflado. Intentarlo en coordenadas polares
       fue un error: alli no se puede afinar una gota sin acortarla, y de ahi
       salian el pico de abajo y la lectura de seta.

       El contorno es simplemente x = +-ancho(y). El unico aplanamiento esta en
       la zona de apoyo, es pequeno, y se une al resto con un maximo suave para
       que no quede ni muesca ni arista. */
    'float perfil(float y, float kind, vec3 f){',
    ' float soft = 1.0 - f.z;',
    ' float w = sqrt(max(0.0, 1.0 - y * y));',
    /* el peso baja del ecuador y ensancha un poco por debajo */
    ' w *= 1.0 + soft * 0.16 * smoothstep(0.25, -0.55, y);',
    /* el muy inflado se redondea hacia la cupula */
    ' w *= 1.0 + (1.0 - soft) * 0.05 * smoothstep(0.0, 0.9, y);',
    ' if(kind > 0.5 && kind < 1.5){',
    /* colgante: el hombro se mantiene ancho y a partir del ecuador la tela se
       junta despacio hasta un cuello fino, rematado en un nudo pequeno */
    '  float g = smoothstep(0.30, -0.98, y);',
    '  w *= 1.0 - f.x * 1.30 * pow(g, 1.55);',
    '  w += 0.030 * exp(-pow((y + 0.90) * 7.0, 2.0));',
    ' } else {',
    /* en los demas la recogida es minima: un globo apoyado no tiene cuello */
    '  w *= 1.0 - f.x * 0.22 * smoothstep(-0.45, -1.0, y);',
    ' }',
    ' return max(w, 0.004);',
    '}',
    'float smax(float a, float b, float k){',
    ' float h = max(k - abs(a - b), 0.0) / k;',
    ' return max(a, b) + h * h * k * 0.25;',
    '}',
    /* arrugas suaves de la tela: bajan el brillo por franjas, no dibujan lineas */
    'float creases(vec2 p, float seed){',
    ' float a = sin(p.x * 5.3 + seed) * 0.5 + sin(p.y * 4.1 - seed * 1.7) * 0.5;',
    ' return a * 0.5 + 0.5;',
    '}',
    /* Espesor de la piel. Sumar senos daba una rejilla diagonal visible, como
       una mosquitera sobre el globo: los senos tienen periodo, y a frecuencia
       alta el periodo se ve. Con ruido de valor interpolado no hay direccion
       privilegiada ni repeticion reconocible. */
    'float h21(vec2 p){ return fract(sin(dot(p, vec2(41.31, 289.07))) * 43758.5453); }',
    'float vnoise(vec2 p){',
    ' vec2 i = floor(p), f = fract(p);',
    ' f = f * f * (3.0 - 2.0 * f);',
    ' float a = h21(i), b = h21(i + vec2(1.0, 0.0));',
    ' float c = h21(i + vec2(0.0, 1.0)), d = h21(i + vec2(1.0, 1.0));',
    ' return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);',
    '}',
    'float skin(vec2 p, float seed){',
    ' vec2 q = p + vec2(seed * 3.7, seed * 2.1);',
    ' return clamp(vnoise(q) * 0.62 + vnoise(q * 2.13 + 7.3) * 0.38, 0.0, 1.0);',
    '}',
    'void main(){',
    /* --- resolucion de la forma, una sola vez, y de ella sale todo --- */
    ' float halfH = 1.0 + vSag * 0.10 + vForm.z * 0.04;',
    ' float yy = vLocal.y / (vKind > 3.5 ? vAsp : halfH);',
    ' float xx = vLocal.x - vForm.y * yy;',
    ' float w, d, ux;',
    ' if(vKind > 3.5){',
    /* columna de luz: capsula alta */
    '  w = 1.0 - 0.10 * abs(yy) + 0.06 * cos(yy * 3.1416);',
    '  ux = xx / max(w, 0.05);',
    '  d = max(abs(ux), (abs(yy) - 0.86) / 0.14);',
    ' } else if(abs(yy) >= 1.0){',
/* fuera del cuerpo el campo tiene que salirse deprisa: con una pendiente
       suave el suavizado de bordes deja una franja visible justo encima y
       debajo de cada pieza, que se lee como una linea horizontal */
    '  d = 1.0 + (abs(yy) - 1.0) * 80.0; w = 0.004; ux = 2.0;',
    ' } else {',
    '  w = perfil(yy, vKind, vForm);',
    '  ux = xx / w;',
    '  d = abs(ux);',
    '  if(vKind > 1.5 && vKind < 2.5){',
    /* el cuerpo se posa sobre una zona pequena: se mezcla con el plano del
       suelo solo en los ultimos grados, con union suave */
    '   float yF = 0.9915 + vForm.z * 0.0055;',
    '   d = smax(d, (-yy) / yF, 0.10);',
    '  }',
    ' }',
    ' float aa = max(fwidth(d), 0.004);',
    ' float cov = 1.0 - smoothstep(1.0 - aa * 1.8, 1.0 + aa * 0.9, d);',
    ' if(cov <= 0.003) discard;',
    /* La pieza es un cuerpo de revolucion, asi que su normal y su espesor se
       pueden calcular exactos en vez de aproximarlos con una esfera: a la
       altura yy la seccion es un circulo de radio w, y la pendiente del perfil
       da la inclinacion de la superficie. Con la aproximacion esferica una gota
       se sombreaba como una bola, y por eso la forma no se leia. */
    ' float uc = clamp(ux, -0.9995, 0.9995);',
    ' float sinp = sqrt(max(0.0, 1.0 - uc * uc));',
    ' float pz = w * sinp;',
    ' float e = 0.02;',
    ' float dw = (vKind > 3.5) ? 0.0 :',
    '   (perfil(min(yy + e, 0.999), vKind, vForm) - perfil(max(yy - e, -0.999), vKind, vForm)) / (2.0 * e);',
    ' vec3 n = normalize(vec3(uc, -dw, max(sinp, 0.04)));',
    ' float zz = clamp(pz, 0.0, 1.0);',

    /* La luz de la sala tiene lado y temperatura: entra calida por la derecha y
       fria por la izquierda. Sin esto el mismo material se ve igual en los dos
       lados de la nave y todo queda plano. */
    ' vec3 L  = normalize(vec3(-0.34, 0.66, 0.58));',
    ' vec3 L2 = normalize(vec3( 0.78, 0.34, -0.42));',
    ' float wrap = clamp(dot(n, L) * 0.5 + 0.5, 0.0, 1.0);',
    ' float back = pow(clamp(dot(n, L2) * 0.5 + 0.5, 0.0, 1.0), 2.2);',
    ' float side = clamp(vWx / 7.0, -1.0, 1.0);',
    ' vec3 warm = vec3(1.075, 0.972, 0.872);',
    ' vec3 cool = vec3(0.912, 0.956, 1.062);',
    ' vec3 amb  = mix(cool, warm, side * 0.5 + 0.5);',

    /* MATERIAL · MEMBRANA
       Esto no es un solido de color: es una piel fina con aire y luz dentro.
       Lo que se ve depende del camino que la luz recorre por la membrana. Por
       el centro la mirada la atraviesa por lo mas fino: sale mucha luz y poco
       tinte. Hacia el borde el camino se alarga, la piel absorbe y el color se
       satura. Y el latex no tiene espesor constante: donde esta mas estirado
       transmite mas y donde se pliega transmite menos. Esa irregularidad es lo
       que separa una membrana de una ceramica pintada. */
    ' float zzc = max(zz, 0.115);',
    /* el espesor no es uniforme: donde la membrana esta mas estirada es mas
       fina y transmite mas. Un globo tiene la piel fina en la cupula y gruesa
       cerca del nudo, ademas de la irregularidad propia del latex. */
    ' float thick = 1.0 + 0.44 * (skin(vLocal * (1.7 + vR * 0.5), vSeed) - 0.5)',
    '              + 0.20 * (skin(vLocal * (5.1 + vR), vSeed * 1.7) - 0.5);',
    ' thick *= 1.0 - 0.16 * clamp(yy, 0.0, 1.0) + 0.26 * clamp(-yy, 0.0, 1.0);',
    ' float path = thick / zzc;',
    ' float over = path - 1.0;',
    ' float m = vMat;',
    ' float kAbs  = m < 0.5 ? 0.30 : (m < 1.5 ? 0.66 : (m < 2.5 ? 0.16 : (m < 3.5 ? 0.22 : 0.27)));',
    /* incluso la pieza mas cerrada deja pasar luz por lo fino: una membrana
       que no transmite nada no es una membrana, es un solido pintado */
    ' float kEmis = m < 0.5 ? 0.66 : (m < 1.5 ? 0.30 : (m < 2.5 ? 1.52 : (m < 3.5 ? 1.12 : 0.66)));',
    ' float kSheen= m < 0.5 ? 1.00 : (m < 1.5 ? 0.12 : (m < 2.5 ? 0.62 : (m < 3.5 ? 0.86 : 0.40)));',
    ' float kSeam = m < 0.5 ? 0.070 : (m < 1.5 ? 0.100 : (m < 2.5 ? 0.026 : (m < 3.5 ? 0.044 : 0.056)));',
    /* la difusa externa baja MUCHO en los translucidos: es lo que los hacia
       leer como ceramica. Un globo encendido casi no tiene cara iluminada. */
    ' float kDiff = m < 1.5 ? 0.58 : (m < 2.5 ? 0.22 : 0.34);',
    ' float kBase = m < 1.5 ? 0.54 : (m < 2.5 ? 0.12 : 0.22);',

    /* LUZ INTERIOR
       No hay una bombilla en el centro geometrico. El aire de dentro difunde,
       y la luz se acumula en dos o tres zonas que no coinciden con el centro.
       Eso es lo que hace que la pieza tenga interior y no un punto blanco. */
    /* La luz de dentro no son manchas con borde: es un volumen de aire
       iluminado. Se describe con un solo gradiente ancho, descentrado, y una
       segunda zona aun mas suave, de modo que hay gradacion interna pero
       ningun disco reconocible. Los gaussianos estrechos de antes se leian
       como circulos concentricos dentro de la pieza. */
    ' vec2 q = vec2(uc, yy * 0.86);',
    ' vec2 o1 = vec2(cos(vSeed * 2.1), sin(vSeed * 1.3)) * 0.22;',
    ' vec2 o2 = vec2(cos(vSeed * 3.7 + 2.0), sin(vSeed * 2.9 + 1.0)) * 0.34;',
    ' float r1 = clamp(length(q - o1) * 0.78, 0.0, 1.0);',
    ' float r2 = clamp(length(q - o2) * 0.62, 0.0, 1.0);',
    ' float lamp = (0.62 * (1.0 - r1 * r1) + 0.38 * pow(1.0 - r2, 1.3));',
    ' lamp = (0.16 + 0.84 * lamp) * (0.42 + 0.58 * vIl) * vPulse;',
    ' float diffuse = mix(lamp, lamp * 0.34 + 0.22, 0.18);',

    ' float atten = exp(-over * kAbs);',
    /* el tinte se acumula con el camino: casi blanco en lo fino, color en lo
       grueso. Subido de croma, porque el color de la sala vive aqui. */
    /* saturar no es oscurecer: se aparta del gris manteniendo el brillo */
    ' float hl = dot(vHue, vec3(0.2126, 0.7152, 0.0722));',
    ' vec3 deep = clamp(mix(vec3(hl), vHue, 2.45), 0.0, 1.45);',
    /* ni por lo mas fino sale luz blanca: siempre cruza membrana, y por eso
       el color vive en toda la pieza y no solo en un aro del borde */
    ' vec3 thin = mix(vec3(1.05), deep, 0.50);',
    ' vec3 tint = mix(thin, deep, clamp(over * 0.52, 0.0, 1.0));',
    ' float isCol = step(3.5, vKind);',
    /* la columna de luz no es un poste translucido: es la fuente. Emite
       casi todo lo que se ve de ella y apenas recibe de la sala. */
    ' float emis = mix(kEmis, 2.15, isCol);',
    ' float near = 0.80 + 0.56 * clamp(side * 0.5 + 0.5, 0.0, 1.0);',
    ' vec3 col = tint * atten * emis * near * mix(diffuse, 0.62 + 0.38 * diffuse, isCol);',
    /* y la sala la ilumina tambien por fuera, que es lo que le da forma */
    ' col += deep * amb * (kBase + kDiff * wrap) * 0.80 * (1.0 - isCol * 0.80);',
    /* contraluz: el borde que mira a la ventana se enciende */
    /* Contraluz: la fuente calida entra por la derecha y ATRAVIESA las piezas
       de ese lado, que es lo que las enciende de verdad. No es luz de sala:
       la arquitectura no cambia, solo se enciende el material. */
    ' float lit = 0.34 + 0.66 * clamp(side * 0.5 + 0.5, 0.0, 1.0);',
    ' col += mix(deep, warm, 0.52) * back * 0.86 * lit * (0.40 + 0.60 * vIl) * (m < 1.5 ? 0.24 : 1.0);',
    /* y al atravesarla la luz sale por el lado de sombra, mas lavada */
    ' col += mix(vHue, warm, 0.70) * pow(back, 0.55) * 0.13 * lit * (m < 1.5 ? 0.20 : 1.0);',
    /* labio del limbo: en una membrana el borde deja pasar la luz de canto y
       dibuja una linea fina y viva. Sin esto la pieza parece maciza. */
    /* EL LIMBO. En un globo la mirada atraviesa mucha membrana cerca del
       contorno, asi que ahi el color se satura y se APAGA: el borde es un
       anillo mas oscuro y mas de color, no una linea clara. Aclararlo, que es
       lo que hacia antes, es justo lo que da el aspecto de burbuja de jabon o
       de cristal. Solo la ultima franja, donde la piel se ve de canto, devuelve
       algo de luz. */
    ' float anillo = smoothstep(0.42, 0.04, zz);',
    ' col = mix(col, col * mix(vec3(0.70), deep * 0.80, 0.55), anillo * (m < 1.5 ? 0.72 : 0.95));',
    ' float canto = pow(1.0 - zz, 12.0);',
    ' col += mix(deep, vec3(1.0), 0.25) * canto * (0.26 + 0.40 * vIl) * (m < 1.5 ? 0.25 : 1.0);',

    /* BRILLO DE MEMBRANA
       Aqui estaba el fallo que hacia leer vidrio, ceramica o plastico: un
       brillo pequeno, limpio y de borde definido. El latex no se comporta asi.
       Su superficie es blanda y esta estirada de forma desigual, de modo que
       devuelve una mancha ANCHA, irregular y con la forma rota por la propia
       piel. Un punto especular duro no aparece nunca en un globo; aparece en
       una bola de cristal. */
    ' vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));',
    ' float nh = clamp(dot(n, H), 0.0, 1.0);',
    /* la microestructura del latex estirado rompe el brillo por zonas */
    ' float micro = skin(vLocal * (5.0 + vR * 1.2), vSeed * 2.3);',
    ' float warp = 0.72 + 0.56 * skin(vLocal * 2.6 + 4.0, vSeed);',
    ' float ancho = pow(nh, 2.1 * warp);',
    ' float medio = pow(nh, 6.5 * warp);',
    ' float brillo = (ancho * 0.62 + medio * 0.88) * (0.80 + 0.36 * micro);',
    ' col += mix(vHue, vec3(1.0), 0.70) * brillo * kSheen;',
    /* reflejo de la boveda: tambien ancho y deformado, no un punto */
    ' vec3 H2 = normalize(vec3(0.34, 0.86, 0.50) + vec3(0.0, 0.0, 1.0));',
    ' float nh2 = clamp(dot(n, H2), 0.0, 1.0);',
    ' col += vec3(1.0) * pow(nh2, 5.5 * warp) * 0.22 * kSheen * (0.55 + 0.45 * micro);',
    /* nacar muy leve: un globo tiene algo de iridiscencia, no un arcoiris */
    ' float irid = fract(vSeed * 0.21 + (1.0 - zz) * 0.62 + vWyAbs * 0.035);',
    ' vec3 sheenCol = 0.5 + 0.5 * cos(6.2832 * (irid + vec3(0.00, 0.33, 0.67)));',
    ' col += sheenCol * pow(1.0 - zz, 3.2) * 0.030 * kSheen * (0.4 + 0.6 * vIl);',

    /* costuras: siguen el volumen, irregulares, y casi desaparecen donde la
       pieza esta encendida, que es lo que pasa de verdad */
    ' float ang = atan(vLocal.x, max(zz, 0.02));',
    ' float g = ang / 3.14159 * vGores + sin(ang * 3.1 + vSeed) * 0.09;',
    ' float seam = abs(fract(g) - 0.5) * 2.0;',
    ' float seamLine = smoothstep(0.90, 1.0, seam) * (0.55 + 0.45 * (0.5 + 0.5 * sin(vLocal.y * 2.3 + vSeed)));',
    ' float cr = creases(vLocal * (2.4 + vR), vSeed);',
    ' col *= 1.0 - (1.0 - cr) * 0.055 * (0.4 + kSheen);',
    ' col *= 1.0 - seamLine * kSeam * (1.0 - vIl * 0.35);',
    /* sombra propia y rebote del suelo */
    ' float low = clamp(-vLocal.y, 0.0, 1.0);',
    ' col *= 1.0 - low * low * 0.20;',
    ' col += vHue * pow(low, 2.4) * 0.05;',
    ' col *= 0.95 + 0.09 * clamp(vLocal.y, 0.0, 1.0);',
    ' float far = clamp(1.0 - vDepth / 38.0, 0.0, 1.0);',
    ' col = mix(vec3(0.726, 0.690, 0.718), col, 0.52 + 0.48 * far);',
    /* recupera el croma que la exposicion alta se lleva */
    ' float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));',
    ' col = mix(vec3(lum), col, 1.62);',
    ' col = col * (1.0 + col / 3.60) / (1.0 + col);',
/* Una membrana se ve ATRAVESADA: por el centro, donde es mas fina, deja
       pasar lo que hay detras, y hacia el borde se cierra porque la mirada
       cruza mas material. Sin esto un globo es un solido de color. */
    /* se ve a traves, pero lo justo: con la piel demasiado transparente las
       piezas de detras se leian con borde nitido dentro de las de delante, y
       parecian burbujas dentro de burbujas */
    ' float kOpa = m < 0.5 ? 0.95 : (m < 1.5 ? 1.00 : (m < 2.5 ? 0.76 : (m < 3.5 ? 0.86 : 0.93)));',
    ' float body = mix(kOpa, min(1.0, kOpa + 0.46), clamp(over * 0.60, 0.0, 1.0));',
    ' float alpha = cov * vOp * body;',
    /* el reflejo solo existe por debajo del plano del suelo, y se apaga con la
       distancia: eso es lo que dibuja la veta vertical larga en vez de un
       duplicado invertido de la pieza */
    ' if(uRefl < 0.99){',
    /* el reflejo arranca en el plano del suelo, pero no de golpe: un corte seco
       ahi dibuja una linea recta bajo cada pieza, que es justo lo que delata el
       truco. Se desvanece en unos centimetros. */
    '  if(vWy > uFloor + 0.10) discard;',
    '  alpha *= smoothstep(uFloor + 0.10, uFloor - 0.16, vWy);',
    '  float dep = uFloor - vWy;',
    '  alpha *= exp(-dep * 0.070);',
    /* el suelo no es un espejo perfecto: la veta rompe el reflejo en tiras */
    '  float rough = clamp(dep * 0.22, 0.0, 1.0);',
    '  float veta = sin(vLocal.x * (6.4 - rough * 3.4) + vSeed + uT * 0.055) * 0.5 + 0.5;',
    '  float veta2 = sin(vLocal.x * 15.0 - vSeed * 2.1 - uT * 0.031) * 0.5 + 0.5;',
    '  alpha *= mix(0.55 + 0.45 * veta, 0.40 + 0.60 * veta * veta2, rough);',
    ' }',
    ' if(uRefl < 0.99){ float lr = dot(col, vec3(0.2126,0.7152,0.0722));',
    '                   col = col * (0.34 / max(lr, 0.34));',
    /* el hormigon pulido devuelve el color, no un gris: si se desatura el
       reflejo el suelo deja de participar de la sala */
    '                   float lg = dot(col, vec3(0.2126,0.7152,0.0722));',
    '                   col = mix(vec3(lg), col, 1.80) * 0.88; }',
    ' oCol = vec4(col * uFade, alpha * uFade * uRefl);',
    '}'
  ].join('\n');

  /* hilos de los que cuelgan las piezas pequenas */
  var CORD_VS = [
    '#version 300 es',
    'in vec3 aPos;',
    'uniform mat4 uProj; uniform mat4 uView; uniform float uT;',
    FLIP,
    'out float vDepth;',
    'void main(){ vec4 c = uView * vec4(salaFlip(aPos), 1.0); vDepth = -c.z; gl_Position = uProj * c; }'
  ].join('\n');
  var CORD_FS = [
    '#version 300 es',
    'precision highp float;',
    'in float vDepth; uniform float uFade; uniform float uRefl; out vec4 oCol;',
    'void main(){',
    ' float far = clamp(1.0 - vDepth / 30.0, 0.0, 1.0);',
    ' oCol = vec4(vec3(0.70, 0.64, 0.67) * uFade * uRefl, 0.20 * far * uFade * uRefl);',
    '}'
  ].join('\n');

  /* Cortinas: tela translucida colgada en algunos vanos. Filtran la luz del
     deambulatorio y separan los planos, que es lo que da profundidad a una
     galeria real en vez de una pared con recortes. */
  var CURTAIN_VS = [
    '#version 300 es',
    'in vec4 aPos;',   /* xyz + fase del pliegue */
    'in float aV;',
    'uniform mat4 uProj; uniform mat4 uView; uniform float uT;',
    'out float vFold; out float vV; out float vDepth;',
    'void main(){',
    /* el velo ondula: la tela cuelga y el aire de la sala la mueve. La
       amplitud crece hacia abajo, porque arriba esta sujeta. */
    ' vec3 w = aPos.xyz;',
    ' float hang = 1.0 - aV;',
    ' float wave = sin(uT * 0.21 + aPos.z * 0.9 + aPos.w * 6.0) * 0.055',
    '            + sin(uT * 0.087 + aPos.z * 0.4) * 0.035;',
    ' w.x += wave * hang * sign(w.x) * -1.0;',
    ' w.z += wave * 0.5 * hang;',
    ' vec4 c = uView * vec4(w, 1.0);',
    ' vFold = aPos.w + sin(uT * 0.13 + aPos.z) * 0.012; vV = aV; vDepth = -c.z;',
    ' gl_Position = uProj * c;',
    '}'
  ].join('\n');
  var CURTAIN_FS = [
    '#version 300 es',
    'precision highp float;',
    'in float vFold; in float vV; in float vDepth;',
    'uniform float uFade; out vec4 oCol;',
    'void main(){',
    ' float f = sin(vFold * 44.0) * 0.5 + 0.5;',
    ' float g = sin(vFold * 17.0 + 1.1) * 0.5 + 0.5;',
    ' float shade = 0.74 + 0.30 * f * 0.7 + 0.20 * g;',
    /* la tela se ilumina por detras: mas clara arriba, donde entra la luz */
    /* el velo esta iluminado POR DETRAS, desde el deambulatorio: por eso es
       mas claro que el muro y se lee como luz, no como tela colgada */
    ' vec3 col = vec3(1.045, 0.985, 0.972) * shade * (0.80 + 0.42 * vV);',
    ' float far = clamp(1.0 - vDepth / 34.0, 0.0, 1.0);',
    ' oCol = vec4(col * uFade, (0.62 + 0.24 * (1.0 - vV)) * (0.50 + 0.50 * far) * uFade);',
    '}'
  ].join('\n');

  /* Suelo propio de la sala. El compartido no sirve aqui: en la referencia el
     suelo construye la imagen. Primer plano oscuro, fondo claro, y vetas
     verticales largas de superficie pulida en vez de manchas redondas. */
  var FLOOR_VS = [
    '#version 300 es',
    'in vec2 aCorner;',
    'uniform mat4 uProj; uniform mat4 uView; uniform float uY;',
    'out vec3 vW; out float vDepth;',
    'void main(){',
    /* el suelo no puede sobrepasar el muro del fondo: su borde lejano quedaba
       al descubierto y dibujaba una linea horizontal que ademas se veia a
       traves de los cuerpos translucidos */
    ' float z = mix(-0.4, -41.0, aCorner.y * 0.5 + 0.5);',
    ' vec3 w = vec3(aCorner.x * (-z) * 2.2, uY, z);',
    ' vec4 c = uView * vec4(w, 1.0);',
    ' vW = w; vDepth = -c.z;',
    ' gl_Position = uProj * c;',
    '}'
  ].join('\n');
  var FLOOR_FS = [
    '#version 300 es',
    'precision highp float;',
    'in vec3 vW; in float vDepth;',
    'uniform vec3 uTint; uniform float uFade;',
    'out vec4 oCol;',
    'void main(){',
    ' float t = clamp(vDepth / 38.0, 0.0, 1.0);',
    /* lo mas oscuro de la sala es el suelo que se pisa, y lo mas claro el del
       fondo: ese recorrido es lo que da profundidad y elegancia */
    ' float lum = mix(0.30, 1.42, pow(t, 0.52));',
    /* veta del pulido: franjas largas en profundidad, finas en anchura, con
       tres escalas para que no se lea como un rayado regular */
    ' float v1 = sin(vW.x * 0.85 + 0.4) * 0.5 + 0.5;',
    ' float v2 = sin(vW.x * 3.10 - 1.2) * 0.5 + 0.5;',
    ' float v3 = sin(vW.x * 9.70 + 2.7) * 0.5 + 0.5;',
    ' float grain = v1 * 0.55 + v2 * 0.31 + v3 * 0.14;',
    ' lum *= 1.0 + (grain - 0.5) * 0.20 * (0.25 + 0.75 * (1.0 - t));',
    /* el pulido devuelve la boveda por el eje de la nave */
    ' float axis = pow(clamp(1.0 - abs(vW.x) / (vDepth * 1.25 + 0.001), 0.0, 1.0), 1.7);',
    ' vec3 col = uTint * lum + uTint * axis * 0.26 * t;',
    ' oCol = vec4(col * uFade, uFade);',
    '}'
  ].join('\n');

  /* Sombra de contacto y luz derramada. Sin la sombra las piezas flotan aunque
     esten apoyadas; sin el derrame el suelo no participa del color de la sala. */
  var BOUNCE_VS = [
    '#version 300 es',
    'in vec2 aCorner; in vec4 aPos; in vec4 aData; in vec4 aMore;',
    'uniform mat4 uProj; uniform mat4 uView; uniform float uY; uniform float uMode;',
    'out vec2 vLocal; out vec3 vHue; out float vDepth; out float vIl; out float vHigh;',
    PAL,
    'void main(){',
    ' float h = max(0.0, aPos.y - uY);',
    ' float spread = 1.0 + h * 0.34;',
    ' float rx = aPos.w * (uMode < 0.5 ? 1.12 : 0.78) * spread;',
    /* El derrame se estira hacia quien mira, pero con tope: sin el, una pieza
       grande y alta generaba una mancha de veinte metros que cruzaba la sala
       por delante de la camara y se veia como una franja recta. */
    ' float rz = min(aPos.w * (uMode < 0.5 ? 1.12 : 5.2) * spread, uMode < 0.5 ? 3.0 : 7.0);',
    ' float zc = min(aPos.z + (uMode < 0.5 ? 0.0 : rz * 0.48), -2.2);',
    ' vec3 w = vec3(aPos.x + aCorner.x * rx, uY + (uMode < 0.5 ? 0.003 : 0.006), zc + aCorner.y * rz);',
    ' vec4 c = uView * vec4(w, 1.0);',
    ' vLocal = aCorner; vHue = HUES[int(aData.y)]; vIl = aMore.y; vDepth = -c.z;',
    ' vHigh = clamp(h / 3.2, 0.0, 1.0);',
    ' gl_Position = uProj * c;',
    '}'
  ].join('\n');
  var BOUNCE_FS = [
    '#version 300 es',
    'precision highp float;',
    'in vec2 vLocal; in vec3 vHue; in float vDepth; in float vIl; in float vHigh;',
    'uniform float uFade; uniform float uMode; out vec4 oCol;',
    'void main(){',
    ' float ax = abs(vLocal.x), ay = abs(vLocal.y);',
    ' float far = clamp(1.0 - vDepth / 34.0, 0.0, 1.0);',
    ' if(uMode < 0.5){',
    /* sombra: se abre y se debilita cuanto mas alta esta la pieza */
    '  float d = length(vLocal);',
    '  float a = pow(clamp(1.0 - d, 0.0, 1.0), 2.2) * (1.0 - vHigh * 0.78);',
    '  oCol = vec4(vec3(0.0), a * 0.34 * uFade);',
    ' } else {',
    '  float a = pow(clamp(1.0 - ax, 0.0, 1.0), 1.9) * pow(clamp(1.0 - ay, 0.0, 1.0), 1.4);',
    '  oCol = vec4(vHue * uFade, a * 0.07 * (0.25 + 0.75 * vIl) * (0.25 + 0.75 * far) * uFade);',
    ' }',
    '}'
  ].join('\n');

  /* Halo: el color que la pieza derrama en el aire de alrededor. Es un cuerpo
     mayor que la pieza, muy tenue y sin borde, sumado a lo que ya hay. */
  var HALO_VS = [
    '#version 300 es',
    'in vec2 aCorner; in vec4 aPos; in vec4 aData; in vec4 aMore; in vec4 aForm;',
    'uniform mat4 uProj; uniform mat4 uView;',
    'out vec2 vLocal; out vec3 vHue; out float vIl; out float vDepth;',
    PAL,
    'void main(){',
    ' float asp = aData.x > 3.5 ? aForm.w : 1.0;',
    ' vec4 c = uView * vec4(aPos.xyz, 1.0);',
    ' c.xy += aCorner * aPos.w * 3.10 * vec2(1.0, mix(1.0, asp, 0.55));',
    ' vLocal = aCorner; vHue = HUES[int(aData.y)]; vIl = aMore.y; vDepth = -c.z;',
    ' gl_Position = uProj * c;',
    '}'
  ].join('\n');
  var HALO_FS = [
    '#version 300 es',
    'precision highp float;',
    'in vec2 vLocal; in vec3 vHue; in float vIl; in float vDepth;',
    'uniform float uFade; out vec4 oCol;',
    'void main(){',
    ' float d = length(vLocal);',
    ' if(d > 1.0) discard;',
    ' float a = pow(1.0 - d, 3.2);',
    ' float far = clamp(1.0 - vDepth / 34.0, 0.0, 1.0);',
    ' oCol = vec4(vHue * uFade, a * 0.105 * (0.25 + 0.75 * vIl) * (0.35 + 0.65 * far) * uFade);',
    '}'
  ].join('\n');

  /* ATMOSFERA
     Motas de luz suspendidas en el aire de la nave. No son un efecto de
     particulas: son lo que se ve cuando una sala grande tiene luz fuerte y
     algo de polvo, y es lo que hace que el aire exista. Van muy despacio, no
     parpadean y no se cruzan por delante de nada de forma llamativa. */
  var MOTES = 130;
  var MOTE_VS = [
    '#version 300 es',
    'in vec2 aCorner; in vec3 aSeed;',   /* van juntos en el mismo buffer */
    'uniform mat4 uProj; uniform mat4 uView; uniform float uT; uniform float uDrift;',
    'out vec2 vLocal; out float vDim; out float vDepth;',
    'void main(){',
    ' float z = -2.5 - aSeed.z * 26.0;',
    /* deriva propia: cada mota lleva su ritmo, y ninguno es multiplo de otro */
    ' float x = (aSeed.x - 0.5) * 15.0 + sin(uT * (0.021 + aSeed.y * 0.017) + aSeed.z * 9.0) * 0.55 * uDrift;',
    ' float y = ' + FLOOR_Y.toFixed(3) + ' + 0.25 + aSeed.y * 4.4',
    '         + sin(uT * (0.013 + aSeed.x * 0.011) + aSeed.y * 7.0) * 0.40 * uDrift;',
    ' vec4 c = uView * vec4(x, y, z, 1.0);',
    ' c.xy += aCorner * (0.026 + aSeed.x * 0.030);',
    ' vLocal = aCorner; vDepth = -c.z;',
    ' vDim = 0.55 + 0.45 * sin(uT * (0.037 + aSeed.z * 0.019) + aSeed.x * 6.0);',
    ' gl_Position = uProj * c;',
    '}'
  ].join('\n');
  var MOTE_FS = [
    '#version 300 es',
    'precision highp float;',
    'in vec2 vLocal; in float vDim; in float vDepth;',
    'uniform float uFade; out vec4 oCol;',
    'void main(){',
    ' float d = length(vLocal);',
    ' if(d > 1.0) discard;',
    ' float a = pow(1.0 - d, 2.4);',
    ' float far = clamp(1.0 - vDepth / 30.0, 0.0, 1.0);',
    ' oCol = vec4(vec3(1.0, 0.975, 0.945) * uFade, a * 0.38 * vDim * (0.20 + 0.80 * far) * uFade);',
    '}'
  ].join('\n');

  var FLOOR_TINT = [0.545, 0.522, 0.556];

  var prog = null, roomProg = null, cordProg = null, bounceProg = null;
  var floorProg = null, curtainProg = null, haloProg = null, moteProg = null;
  var moteBuf = null;

  /* Reloj propio del material. No se usa ctx.t directamente: se acumula el
     tiempo YA ESCALADO por el nivel de movimiento, de modo que
       normal    -> la sala respira a su ritmo,
       reducido  -> respira a un quinto, sin saltar de fase al cambiar,
       quieto    -> el reloj no avanza y la imagen queda realmente fija.
     Escalar la fase en el shader en vez del reloj daria un salto visible cada
     vez que alguien cambia de nivel, y eso es exactamente un cambio brusco. */
  var tm = 0, tPrev = null;
  function materialClock(ctx) {
    if (tPrev === null) tPrev = ctx.t;
    var dt = ctx.t - tPrev;
    tPrev = ctx.t;
    if (dt < 0 || dt > 0.5) dt = 0;          /* saltos del reloj: no se integran */
    tm += dt * ctx.drift;
    return tm;
  }
  var quad = null, inst = null, buf = null, order = null;
  var roomBuf = null, roomN = 0, cordBuf = null, cordN = 0;
  var plinthBuf = null, plinthN = 0, curtainBuf = null, curtainN = 0;
  var STRIDE = 16;

  /* La arcada es geometria, no un dibujo sobre una pared plana: cada vano se
     tesela dejando el hueco abierto, y detras hay un segundo paramento mas
     claro, asi que por los arcos se ve espacio iluminado y la sala tiene fondo. */
  var W = 8.2, BACK = -34.0, BAY = 4.6;
  var SPRING = FLOOR_Y + 2.7, HALF = 1.50;

  /* La galeria se construye con volumen: paramento con vanos, columnas exentas
     delante con basa y capitel, deambulatorio detras y cortinas translucidas
     entre algunos vanos. Sin columnas no lee como galeria, lee como pared. */
  function buildRoom(gl) {
    var STRIPS = 22;
    var v = [];
    var KIND = 0;
    function tri(p, n, sh) { v.push(p[0], p[1], p[2], n[0], n[1], n[2], sh, KIND); }
    function quad(p0, p1, p2, p3, n, sh) {
      var idx = [0, 1, 2, 2, 1, 3], pts = [p0, p1, p2, p3];
      for (var i = 0; i < 6; i++) tri(pts[idx[i]], n, sh);
    }
    function box(cx, cy, cz, sx, sy, sz, sh) {
      var x0 = cx - sx, x1 = cx + sx, y0 = cy - sy, y1 = cy + sy, z0 = cz - sz, z1 = cz + sz;
      quad([x0,y0,z1],[x1,y0,z1],[x0,y1,z1],[x1,y1,z1],[0,0,1], sh);
      quad([x1,y0,z0],[x0,y0,z0],[x1,y1,z0],[x0,y1,z0],[0,0,-1], sh*0.90);
      quad([x0,y0,z0],[x0,y0,z1],[x0,y1,z0],[x0,y1,z1],[-1,0,0], sh*0.96);
      quad([x1,y0,z1],[x1,y0,z0],[x1,y1,z1],[x1,y1,z0],[1,0,0], sh*0.84);
      quad([x0,y1,z1],[x1,y1,z1],[x0,y1,z0],[x1,y1,z0],[0,1,0], sh*1.10);
    }
    var SEG = 18;
    function ring(cx, cz, y, r) {
      var o = [];
      for (var i = 0; i <= SEG; i++) {
        var a = i / SEG * 6.283185;
        o.push([cx + Math.cos(a) * r, y, cz + Math.sin(a) * r, Math.cos(a), Math.sin(a)]);
      }
      return o;
    }
    function band(r0, r1, sh) {
      for (var i = 0; i < SEG; i++) {
        var p0 = r0[i], p1 = r0[i + 1], q0 = r1[i], q1 = r1[i + 1];
        var n0 = [p0[3], 0, p0[4]], n1 = [p1[3], 0, p1[4]];
        tri([p0[0],p0[1],p0[2]], n0, sh); tri([q0[0],q0[1],q0[2]], n0, sh); tri([p1[0],p1[1],p1[2]], n1, sh);
        tri([p1[0],p1[1],p1[2]], n1, sh); tri([q0[0],q0[1],q0[2]], n0, sh); tri([q1[0],q1[1],q1[2]], n1, sh);
      }
    }
    /* fuste con entasis: se estrecha hacia arriba como una columna de verdad */
    function cylinder(cx, cz, y0, y1, r, sh) {
      var STEPS = 7, prev = null;
      for (var i = 0; i <= STEPS; i++) {
        var f = i / STEPS, y = y0 + (y1 - y0) * f;
        var rr = r * (1.0 - 0.10 * f * f - 0.03 * Math.sin(f * 3.1416));
        var cur = ring(cx, cz, y, rr);
        if (prev) band(prev, cur, sh * (0.94 + 0.10 * f));
        prev = cur;
      }
    }
    function drum(cx, cz, y0, y1, r, sh) {
      var a = ring(cx, cz, y0, r), b = ring(cx, cz, y1, r);
      band(a, b, sh);
      for (var i = 0; i < SEG; i++) {
        tri([cx, y1, cz], [0,1,0], sh * 1.08);
        tri([b[i][0], y1, b[i][2]], [0,1,0], sh * 1.08);
        tri([b[i+1][0], y1, b[i+1][2]], [0,1,0], sh * 1.08);
      }
    }
    function profile(u) {
      var c = ((u % BAY) + BAY) % BAY - BAY * 0.5;
      if (Math.abs(c) >= HALF) return FLOOR_Y;
      return SPRING + Math.sqrt(Math.max(0, HALF * HALF - c * c));
    }

    function colonnade(sx) {
      var n = [-sx, 0, 0];
      var zFrom = -1.0, zTo = BACK, steps = STRIPS * 8;
      for (var i = 0; i < steps; i++) {
        var z0 = zFrom + (zTo - zFrom) * (i / steps);
        var z1 = zFrom + (zTo - zFrom) * ((i + 1) / steps);
        var y0 = profile(-z0), y1 = profile(-z1);
        quad([sx * W, y0, z0], [sx * W, y1, z1], [sx * W, CEIL_Y, z0], [sx * W, CEIL_Y, z1], n, 1.0);
        if (y0 > FLOOR_Y + 0.01 && Math.abs(y1 - y0) > 0.001) {
          quad([sx * W, y0, z0], [sx * (W + 0.55), y0, z0],
               [sx * W, y1, z1], [sx * (W + 0.55), y1, z1], [0, 1, 0], 0.80);
        }
      }
      quad([sx * (W + 3.6), FLOOR_Y, -1.0], [sx * (W + 3.6), FLOOR_Y, BACK],
           [sx * (W + 3.6), CEIL_Y, -1.0], [sx * (W + 3.6), CEIL_Y, BACK], n, 1.22);
      quad([sx * W, FLOOR_Y, -1.0], [sx * (W + 3.6), FLOOR_Y, -1.0],
           [sx * W, FLOOR_Y, BACK], [sx * (W + 3.6), FLOOR_Y, BACK], [0, 1, 0], 1.16);
      quad([sx * W, CEIL_Y, -1.0], [sx * (W + 3.6), CEIL_Y, -1.0],
           [sx * W, CEIL_Y, BACK], [sx * (W + 3.6), CEIL_Y, BACK], [0, 1, 0], 1.06);
      quad([sx * W, FLOOR_Y, -1.0], [sx * (W + 3.6), FLOOR_Y, -1.0],
           [sx * W, CEIL_Y, -1.0], [sx * (W + 3.6), CEIL_Y, -1.0], [0, 0, 1], 1.10);

      /* Columnas exentas: cilindros con entasis, separadas del paramento, con
         basa y capitel. Un prisma no lee como columna; el redondeo es lo que
         hace que la luz gire alrededor del fuste y la galeria tenga cuerpo. */
      for (var bn = 0; bn < 9; bn++) {
        var cz = -3.0 - bn * BAY;
        if (cz < BACK + 1.2) break;
        var cx = sx * (W - 0.92);
        var top = SPRING + HALF * 0.30;
        cylinder(cx, cz, FLOOR_Y + 0.20, top, 0.22, 1.02);
        drum(cx, cz, FLOOR_Y, FLOOR_Y + 0.20, 0.30, 1.16);
        drum(cx, cz, top, top + 0.20, 0.29, 1.24);
      }
    }
    colonnade(-1); colonnade(1);

    (function backWall() {
      var n = [0, 0, 1], steps = STRIPS * 4;
      for (var i = 0; i < steps; i++) {
        var x0 = -W + 2 * W * (i / steps), x1 = -W + 2 * W * ((i + 1) / steps);
        var y0 = profile(x0 + BAY * 0.5), y1 = profile(x1 + BAY * 0.5);
        quad([x0, y0, BACK], [x1, y1, BACK], [x0, CEIL_Y, BACK], [x1, CEIL_Y, BACK], n, 0.96);
      }
      quad([-W, FLOOR_Y, BACK - 4.2], [W, FLOOR_Y, BACK - 4.2],
           [-W, CEIL_Y, BACK - 4.2], [W, CEIL_Y, BACK - 4.2], n, 1.14);
      quad([-W, FLOOR_Y, BACK], [W, FLOOR_Y, BACK],
           [-W, FLOOR_Y, BACK - 4.2], [W, FLOOR_Y, BACK - 4.2], [0, 1, 0], 1.20);
    })();

    /* Boveda de canon rebajada con arcos fajones por vano. Un techo plano deja
       un vacio de color arriba; la boveda cierra la sala, devuelve luz y da la
       escala de una nave de museo. */
    (function vault() {
      KIND = 1;
      var RIB = 14, ZS = 150, rise = 1.55;
      for (var j = 0; j < ZS; j++) {
        var z0 = -1.0 + (BACK + 1.0) * (j / ZS);
        var z1 = -1.0 + (BACK + 1.0) * ((j + 1) / ZS);
        var fajon = function (z) {
          var c = ((-z % BAY) + BAY) % BAY - BAY * 0.5;
          return 1.0 + 0.085 * Math.exp(-(c * c) / 0.55);
        };
        var s0 = fajon(z0), s1 = fajon(z1);
        /* lucernario: banda de luz en la clave, entre fajon y fajon. Una sala
           asi se ilumina por arriba; verlo hace que la luz tenga origen. */
        var lucer = function (z) {
          var c = ((-z % BAY) + BAY) % BAY - BAY * 0.5;
          return Math.exp(-(c * c) / 0.85);
        };
        var l0 = lucer(z0), l1 = lucer(z1);
        for (var i = 0; i < RIB; i++) {
          var u0 = -1 + 2 * (i / RIB), u1 = -1 + 2 * ((i + 1) / RIB);
          var y0 = CEIL_Y + rise * Math.cos(u0 * 1.24) - rise * Math.cos(1.24);
          var y1 = CEIL_Y + rise * Math.cos(u1 * 1.24) - rise * Math.cos(1.24);
          var nx0 = Math.sin(u0 * 1.24), nx1 = Math.sin(u1 * 1.24);
          /* la boveda se aclara hacia la clave: la luz rebota y se acumula */
          var g0 = Math.exp(-(u0 * u0) / 0.16), g1 = Math.exp(-(u1 * u1) / 0.16);
          var k0 = 0.98 + 0.20 * (1.0 - Math.abs(u0)) + 0.13 * g0 * (0.45 + 0.55 * l0);
          var k1 = 0.98 + 0.20 * (1.0 - Math.abs(u1)) + 0.13 * g1 * (0.45 + 0.55 * l1);
          tri([u0 * W, y0, z0], [-nx0, -1, 0], k0 * s0);
          tri([u1 * W, y1, z0], [-nx1, -1, 0], k1 * s0);
          tri([u0 * W, y0, z1], [-nx0, -1, 0], k0 * s1);
          tri([u1 * W, y1, z0], [-nx1, -1, 0], k1 * s0);
          tri([u1 * W, y1, z1], [-nx1, -1, 0], k1 * s1);
          tri([u0 * W, y0, z1], [-nx0, -1, 0], k0 * s1);
        }
      }
      KIND = 0;
    })();

    roomN = v.length / 8;
    roomBuf = S.GL.buffer(gl, new Float32Array(v));
  }

  /* Cortinas translucidas entre algunos vanos: son tela, dejan pasar la luz y
     se pintan en el pase transparente */
  var CURTAINS = [
    { sx:  1, z:  -9.2 }, { sx: -1, z: -13.8 }, { sx:  1, z: -18.4 }, { sx: -1, z: -23.0 }
  ];
  function buildCurtains(gl) {
    var v = [], COLS = 12;
    CURTAINS.forEach(function (c) {
      var x = c.sx * (W - 0.05), top = SPRING + HALF * 0.86, bot = FLOOR_Y + 0.02;
      for (var i = 0; i < COLS; i++) {
        var z0 = c.z - HALF * 0.98 + HALF * 1.96 * (i / COLS);
        var z1 = c.z - HALF * 0.98 + HALF * 1.96 * ((i + 1) / COLS);
        var f0 = i / COLS, f1 = (i + 1) / COLS;
        var pts = [[x, bot, z0, f0], [x, bot, z1, f1], [x, top, z0, f0], [x, top, z1, f1]];
        var idx = [0, 1, 2, 2, 1, 3];
        for (var k = 0; k < 6; k++) {
          var q = pts[idx[k]];
          v.push(q[0], q[1], q[2], q[3], (q[1] - bot) / (top - bot));
        }
      }
    });
    curtainN = v.length / 5;
    curtainBuf = S.GL.buffer(gl, new Float32Array(v));
  }

  /* Plintos circulares bajos: dan escala fisica y apoyo a las piezas */




  function buildPlinths(gl) {
    var v = [], SEG = 26;
    function tri(p, n, sh) { v.push(p[0], p[1], p[2], n[0], n[1], n[2], sh, 2); }
    PLINTHS.forEach(function (pl) {
      var top = FLOOR_Y + pl.h * 0.58;
      for (var i = 0; i < SEG; i++) {
        var a0 = i / SEG * 6.283185, a1 = (i + 1) / SEG * 6.283185;
        var c0 = [Math.cos(a0), Math.sin(a0)], c1 = [Math.cos(a1), Math.sin(a1)];
        var p0 = [pl.x + c0[0] * pl.r, top, pl.z + c0[1] * pl.r];
        var p1 = [pl.x + c1[0] * pl.r, top, pl.z + c1[1] * pl.r];
        /* tapa */
        tri([pl.x, top, pl.z], [0, 1, 0], 0.88); tri(p0, [0, 1, 0], 0.88); tri(p1, [0, 1, 0], 0.88);
        /* canto */
        var b0 = [p0[0], FLOOR_Y, p0[2]], b1 = [p1[0], FLOOR_Y, p1[2]];
        var n0 = [c0[0], 0, c0[1]];
        tri(p0, n0, 0.86); tri(b0, n0, 0.86); tri(p1, n0, 0.86);
        tri(p1, n0, 0.86); tri(b0, n0, 0.86); tri(b1, n0, 0.86);
      }
    });
    plinthN = v.length / 8;
    plinthBuf = S.GL.buffer(gl, new Float32Array(v));
  }

  function init(gl) {
    prog = S.GL.program(gl, VS, FS);
    roomProg = S.GL.program(gl, ROOM_VS, ROOM_FS);
    cordProg = S.GL.program(gl, CORD_VS, CORD_FS);
    bounceProg = S.GL.program(gl, BOUNCE_VS, BOUNCE_FS);
    floorProg = S.GL.program(gl, FLOOR_VS, FLOOR_FS);
    curtainProg = S.GL.program(gl, CURTAIN_VS, CURTAIN_FS);
    haloProg = S.GL.program(gl, HALO_VS, HALO_FS);
    moteProg = S.GL.program(gl, MOTE_VS, MOTE_FS);
    /* la esquina del cuadro va en el MISMO buffer que la semilla: con el cuadro
       unitario compartido solo habria seis vertices y el resto de las motas
       leeria fuera del buffer, que es por lo que no se dibujaba ninguna */
    var mv = [], CORNERS = [[-1,-1],[1,-1],[-1,1],[-1,1],[1,-1],[1,1]];
    for (var mi = 0; mi < MOTES; mi++) {
      var sx = S.GL.hash(mi, 3.1), sy = S.GL.hash(mi, 7.7), sz = S.GL.hash(mi, 15.3);
      for (var k = 0; k < 6; k++) mv.push(CORNERS[k][0], CORNERS[k][1], sx, sy, sz);
    }
    moteBuf = S.GL.buffer(gl, new Float32Array(mv));
    quad = S.GL.unitQuad(gl);
    inst = new Float32Array(MAX * STRIDE);
    buf = gl.createBuffer();
    cordBuf = gl.createBuffer();
    order = [];
    buildRoom(gl);
    buildPlinths(gl);
    buildCurtains(gl);
  }

  /* La composicion esta decidida: no se recorta por calidad quitando piezas del
     final, porque eso se comeria el fondo y desequilibraria la sala. Se recorta
     por tamano aparente, que quita primero lo que menos pesa en la imagen. */
  function count(ctx) {
    if (ctx.quality > 0.85) return MAX;
    return Math.max(12, Math.round(MAX * (0.62 + 0.38 * ctx.quality)));
  }

  function draw(gl, ctx, fade) {
    var tClock = materialClock(ctx);
    var n = count(ctx);
    animate(ctx, n);
    order.length = 0;
    for (var i = 0; i < n; i++) order.push(i);
    order.sort(function (a, b) { return field[a].z - field[b].z; });

    for (var k = 0; k < n; k++) {
      var b = field[order[k]], o = k * STRIDE;
      inst[o] = b.ax; inst[o + 1] = b.ay; inst[o + 2] = b.z; inst[o + 3] = b.r;
      inst[o + 4] = b.kind; inst[o + 5] = b.hue; inst[o + 6] = b.gores; inst[o + 7] = b.mat;
      inst[o + 8] = b.op; inst[o + 9] = b.il; inst[o + 10] = b.sag; inst[o + 11] = b.rol;
      inst[o + 12] = b.taper; inst[o + 13] = b.asym; inst[o + 14] = b.press; inst[o + 15] = b.tall;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, inst.subarray(0, n * STRIDE), gl.DYNAMIC_DRAW);

    var cv = [];
    for (k = 0; k < n; k++) {
      var c = field[order[k]];
      if (c.kind !== 3) continue;
      cv.push(c.ax, c.ay + c.r * 0.9, c.z, c.ax, CEIL_Y, c.z);
    }
    cordN = cv.length / 3;
    if (cordN) { gl.bindBuffer(gl.ARRAY_BUFFER, cordBuf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cv), gl.DYNAMIC_DRAW); }

    var SB = STRIDE * 4;
    function instAttribs(prg) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      var ap = prg.a('aPos'), ad = prg.a('aData'), am = prg.a('aMore'), af = prg.a('aForm');
      gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap, 4, gl.FLOAT, false, SB, 0); gl.vertexAttribDivisor(ap, 1);
      gl.enableVertexAttribArray(ad); gl.vertexAttribPointer(ad, 4, gl.FLOAT, false, SB, 16); gl.vertexAttribDivisor(ad, 1);
      gl.enableVertexAttribArray(am); gl.vertexAttribPointer(am, 4, gl.FLOAT, false, SB, 32); gl.vertexAttribDivisor(am, 1);
      if (af >= 0) { gl.enableVertexAttribArray(af); gl.vertexAttribPointer(af, 4, gl.FLOAT, false, SB, 48); gl.vertexAttribDivisor(af, 1); }
    }
    function cornerAttrib(prg) {
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      var ac = prg.a('aCorner');
      gl.enableVertexAttribArray(ac); gl.vertexAttribPointer(ac, 2, gl.FLOAT, false, 0, 0); gl.vertexAttribDivisor(ac, 0);
    }
    function mvp(prg) {
      prg.use();
      gl.uniformMatrix4fv(prg.u('uProj'), false, ctx.proj);
      gl.uniformMatrix4fv(prg.u('uView'), false, ctx.view);
      gl.uniform1f(prg.u('uFade'), fade);
      gl.uniform1f(prg.u('uT'), tClock);
    }

    /* ---------------------------------------------- 1 · fondo y arquitectura */
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.depthMask(true);
    gl.clearColor(0.726, 0.690, 0.718, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.disable(gl.BLEND);

    function opaque(prg, bufId, cnt) {
      mvp(prg);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufId);
      var ap = prg.a('aPos'), an = prg.a('aNrm'), as = prg.a('aShade'), ak = prg.a('aKind');
      gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap, 3, gl.FLOAT, false, 32, 0); gl.vertexAttribDivisor(ap, 0);
      gl.enableVertexAttribArray(an); gl.vertexAttribPointer(an, 3, gl.FLOAT, false, 32, 12); gl.vertexAttribDivisor(an, 0);
      gl.enableVertexAttribArray(as); gl.vertexAttribPointer(as, 1, gl.FLOAT, false, 32, 24); gl.vertexAttribDivisor(as, 0);
      gl.enableVertexAttribArray(ak); gl.vertexAttribPointer(ak, 1, gl.FLOAT, false, 32, 28); gl.vertexAttribDivisor(ak, 0);
      gl.drawArrays(gl.TRIANGLES, 0, cnt);
    }
    opaque(roomProg, roomBuf, roomN);

    /* ------------------------------------------------------------ 2 · suelo */
    mvp(floorProg);
    gl.uniform1f(floorProg.u('uY'), FLOOR_Y);
    gl.uniform3fv(floorProg.u('uTint'), FLOOR_TINT);
    cornerAttrib(floorProg);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    opaque(roomProg, plinthBuf, plinthN);

    /* --------------------------------- 3 · luz derramada sobre el suelo */
    gl.enable(gl.BLEND);
    gl.depthMask(false);
    mvp(bounceProg);
    gl.uniform1f(bounceProg.u('uY'), FLOOR_Y);
    cornerAttrib(bounceProg);
    instAttribs(bounceProg);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform1f(bounceProg.u('uMode'), 0.0);
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, n);
    if (medio) {
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.uniform1f(bounceProg.u('uMode'), 1.0);
      gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, n);
    }

    /* ------------------------------------------------------- 4 · reflejos */
    function bodies(flip, refl, stretch) {
      mvp(prog);
      gl.uniform3f(prog.u('uFlip'), flip, FLOOR_Y, stretch);
      gl.uniform1f(prog.u('uRefl'), refl);
      gl.uniform1f(prog.u('uFloor'), FLOOR_Y);
      cornerAttrib(prog);
      instAttribs(prog);
      gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, n);
    }
    gl.disable(gl.DEPTH_TEST);
    if (rico) {
      bodies(-1.0, 0.44, 0.00); bodies(-1.0, 0.30, 0.30);
      bodies(-1.0, 0.20, 0.72); bodies(-1.0, 0.13, 1.40); bodies(-1.0, 0.08, 2.40);
    } else if (medio) {
      bodies(-1.0, 0.52, 0.10); bodies(-1.0, 0.26, 0.80); bodies(-1.0, 0.13, 1.90);
    } else {
      bodies(-1.0, 0.62, 0.30);
    }
    gl.enable(gl.DEPTH_TEST);

    /* Presupuesto: por debajo de cierta calidad se retiran primero los pases
       que menos construyen la imagen (aire, rebote, sombra) y se recortan las
       pasadas del reflejo. Bajar solo el numero de piezas desarma la
       composicion; bajar el relleno no se nota y es donde esta el coste. */
    var rico = ctx.quality > 0.55, medio = ctx.quality > 0.40;

    /* ------------------------------------------------ 4a · aire de la sala */
    if (rico) {
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.depthMask(false);
    mvp(moteProg);
    gl.uniform1f(moteProg.u('uDrift'), ctx.drift);
    gl.bindBuffer(gl.ARRAY_BUFFER, moteBuf);
    var mc = moteProg.a('aCorner'), ms = moteProg.a('aSeed');
    gl.enableVertexAttribArray(mc); gl.vertexAttribPointer(mc, 2, gl.FLOAT, false, 20, 0); gl.vertexAttribDivisor(mc, 0);
    gl.enableVertexAttribArray(ms); gl.vertexAttribPointer(ms, 3, gl.FLOAT, false, 20, 8); gl.vertexAttribDivisor(ms, 0);
    gl.drawArrays(gl.TRIANGLES, 0, MOTES * 6);
    }

    /* ------------------------------------- 4b · rebote de color en el aire
       Una pieza encendida no acaba en su contorno: tine el aire y lo que tiene
       detras. Sin esto la luz interior se queda dentro de la silueta y la sala
       no se entera de que hay luz. */
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.depthMask(false);
    if (rico) {
      mvp(haloProg);
      cornerAttrib(haloProg);
      instAttribs(haloProg);
      gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, n);
    }

    /* ------------------------------------------------------- 5 · cortinas */
    if (curtainN) {
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      mvp(curtainProg);
      gl.bindBuffer(gl.ARRAY_BUFFER, curtainBuf);
      var qp = curtainProg.a('aPos'), qv = curtainProg.a('aV');
      gl.enableVertexAttribArray(qp); gl.vertexAttribPointer(qp, 4, gl.FLOAT, false, 20, 0); gl.vertexAttribDivisor(qp, 0);
      gl.enableVertexAttribArray(qv); gl.vertexAttribPointer(qv, 1, gl.FLOAT, false, 20, 16); gl.vertexAttribDivisor(qv, 0);
      gl.drawArrays(gl.TRIANGLES, 0, curtainN);
    }

    /* --------------------------------------------------------- 6 · cuerpos */
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    bodies(1.0, 1.0, 1.0);

    if (cordN) {
      mvp(cordProg);
      gl.uniform3f(cordProg.u('uFlip'), 1.0, FLOOR_Y, 1.0);
      gl.uniform1f(cordProg.u('uRefl'), 1.0);
      gl.bindBuffer(gl.ARRAY_BUFFER, cordBuf);
      var cp = cordProg.a('aPos');
      gl.enableVertexAttribArray(cp); gl.vertexAttribPointer(cp, 3, gl.FLOAT, false, 0, 0); gl.vertexAttribDivisor(cp, 0);
      gl.drawArrays(gl.LINES, 0, cordN);
    }

    gl.depthMask(true);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
  }

  function dispose(gl) {
    try {
      if (prog) prog.free(); if (roomProg) roomProg.free(); if (cordProg) cordProg.free();
      if (bounceProg) bounceProg.free();
      if (floorProg) floorProg.free(); if (curtainProg) curtainProg.free();
      if (haloProg) haloProg.free(); if (moteProg) moteProg.free();
      gl.deleteBuffer(moteBuf);
      gl.deleteBuffer(quad); gl.deleteBuffer(buf); gl.deleteBuffer(roomBuf);
      gl.deleteBuffer(cordBuf); gl.deleteBuffer(plinthBuf); gl.deleteBuffer(curtainBuf);
    } catch (_) {}
    prog = roomProg = cordProg = bounceProg = floorProg = curtainProg = haloProg = moteProg = null;
    moteBuf = null;
    quad = buf = roomBuf = cordBuf = plinthBuf = curtainBuf = null;
  }

  /* ------------------------------------------------- escalon C · Canvas2D */
  function c2dDraw(c, ctx, fade) {
    var w = ctx.w, h = ctx.h, f = 1.0 / Math.tan(1.02 / 2);
    var g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#9c8896'); g.addColorStop(0.55, '#a4939c'); g.addColorStop(1, '#6f7280');
    c.fillStyle = g; c.fillRect(0, 0, w, h);

    var n = Math.min(field.length, 52);
    animate(ctx, n);
    var idx = []; for (var i = 0; i < n; i++) idx.push(i);
    idx.sort(function (a, b) { return field[a].z - field[b].z; });
    for (var k = 0; k < n; k++) {
      var b = field[idx[k]];
      var sx = w * 0.5 + (b.ax / (-b.z)) * f * h * 0.5;
      var sy = h * 0.5 - (b.ay / (-b.z)) * f * h * 0.5;
      var sr = (b.r / (-b.z)) * f * h * 0.5;
      if (sr < 1.2) continue;
      var hu = HUES[b.hue];
      var far = Math.max(0, Math.min(1, 1 + b.z / 30));
      function css(m, a) {
        return 'rgba(' + Math.round(Math.min(255, hu[0] * 255 * m)) + ',' + Math.round(Math.min(255, hu[1] * 255 * m)) + ',' + Math.round(Math.min(255, hu[2] * 255 * m)) + ',' + a + ')';
      }
      var rg = c.createRadialGradient(sx - sr * 0.25, sy - sr * 0.3, sr * 0.05, sx, sy, sr * 1.05);
      rg.addColorStop(0, css(1.18, 0.98 * fade));
      rg.addColorStop(0.6, css(1.0, 0.95 * fade));
      rg.addColorStop(1, css(0.82, 0.92 * fade));
      c.globalAlpha = 0.38 + 0.62 * far;
      c.fillStyle = rg;
      c.beginPath();
      if (b.kind === 1) { c.ellipse(sx, sy, sr * 0.92, sr * 1.02, 0, 0, 6.2832); }
      else { c.ellipse(sx, sy, sr * 1.02, sr * 0.94, 0, 0, 6.2832); }
      c.fill();
      c.globalAlpha = 1;
    }
  }

  function stillDraw(c, ctx) {
    var d = ctx.drift, t = ctx.t;
    ctx.drift = 0; ctx.t = 26;
    c2dDraw(c, ctx, 1);
    ctx.drift = d; ctx.t = t;
  }

  S.register({
    id: 'globos',
    es: 'Mundo de globos de luz', en: 'World of light balloons',
    des: 'Cuerpos inflables translúcidos con luz dentro, de muchos tamaños. Señala y se apartan despacio.',
    den: 'Translucent inflatable bodies lit from within, in many sizes. Point and they drift aside slowly.',
    audio: null,
    gl: { init: init, draw: draw, dispose: dispose },
    c2d: { draw: c2dDraw },
    still: { draw: stillDraw }
  });
})(window);
