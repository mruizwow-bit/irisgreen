/* R46-CLAUDE · Salas inmersivas · un espacio alrededor, no tres paneles.
   En escritorio el rayo entra en una caja: fondo, laterales en perspectiva y
   suelo con luz baja; el dibujo es un unico campo tridimensional, asi que la
   imagen continua de una pared a otra sin costura.
   En movil la misma escena se envuelve sobre una sola superficie curva.
   Sin camara, sin microfono, sin orientacion, sin reconocimiento, sin geolocalizacion,
   sin seguimiento corporal, sin biometria, sin guardar gestos, sin puntuacion. */
(function (window, document) {
  'use strict';

  var ROOMS = [
    { id: 'globos',      es: 'Mundo de globos de luz', en: 'World of light balloons',
      des: 'Estás dentro de un campo de volúmenes suaves que flotan',
      den: 'You are inside a field of soft floating volumes', k: 0 },
    { id: 'jardin',      es: 'Jardín de luz',          en: 'Garden of light',
      des: 'Formas orgánicas luminosas y polvo de luz en capas',
      den: 'Luminous organic forms and light dust in layers', k: 1 },
    { id: 'papel',       es: 'Papel y viento',         en: 'Paper and wind',
      des: 'Hojas de papel translúcido suspendidas, luz cálida',
      den: 'Suspended translucent paper sheets, warm light', k: 2 },
    { id: 'nubes',       es: 'Dentro de una nube',     en: 'Inside a cloud',
      des: 'Volúmenes blandos alrededor y luz que los atraviesa',
      den: 'Soft volumes all around with light passing through', k: 3 },
    { id: 'respiracion', es: 'Respiración del espacio', en: 'The space breathing',
      des: 'El espacio entero se expande y se recoge contigo',
      den: 'The whole space expands and gathers with you', k: 4 }
  ];

  var LEVELS = {
    suave:  { gain: 0.86, speed: 0.62, warp: 0.70 },
    normal: { gain: 1.12, speed: 1.00, warp: 1.00 }
  };

  var VERT = '#version 300 es\nin vec2 aPos; void main(){ gl_Position=vec4(aPos,0.0,1.0); }';

  /* Nave abierta, no una caja. El suelo llega hasta un horizonte lejano, por
     encima queda volumen libre y hay formas suspendidas a distintas
     profundidades. Sin techo, sin paredes cerca, sin esquinas sobre la cabeza. */
  /* Nave abierta y fabricada. No imita la naturaleza: eso ya lo dan los
     Paisajes en video real. Aqui hay globos, farolillos, papel, luz y color,
     que es lo que hace una sala inmersiva de verdad. Suelo hasta el horizonte,
     volumen libre arriba, sin techo ni paredes cerca. */
  /* INSTALACION, NO PAISAJE.
     No hay suelo, ni horizonte, ni cielo: eso seria mirar un paisaje y de eso ya
     se ocupan los Paisajes en video real. Aqui la persona esta DENTRO de un
     campo de volumenes repartidos en profundidad, delante, detras y alrededor.
     Los cuerpos se componen de lejos a cerca, asi que se tapan entre si y hay
     paralaje real; los mas cercanos salen del encuadre, que es lo que hace que
     no parezca una pantalla. */
  var FRAG = [
    '#version 300 es',
    'precision highp float;',
    'out vec4 oCol;',
    'uniform vec2 uRes; uniform float uT; uniform float uV;',
    'uniform int uRoom; uniform int uWrap;',
    'uniform float uGain; uniform float uSpeed; uniform float uWarp;',
    'uniform vec2 uPoint; uniform float uPointT; uniform float uFade;',
    'const int N = 56;',
    'uniform int uCount;',
    'float h21(vec2 p){ p=fract(p*vec2(0.1031,0.1030)); p+=dot(p,p.yx+33.33); return fract((p.x+p.y)*p.x); }',
    'float n21(vec2 x){ vec2 i=floor(x),f=fract(x); f=f*f*(3.0-2.0*f);',
    ' return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y); }',
    'float fbm(vec2 p){ float a=0.5,s=0.0; mat2 m=mat2(0.86,0.51,-0.51,0.86);',
    ' for(int i=0;i<4;i++){ s+=a*n21(p); p=m*p*2.02; a*=0.5; } return s; }',

    /* ---- el aire de la sala. Sin horizonte, sin suelo, sin cielo ---- */
    'vec3 airA(int r){',
    ' if(r==0) return vec3(0.165,0.205,0.330);',
    ' if(r==1) return vec3(0.030,0.075,0.095);',
    ' if(r==2) return vec3(0.135,0.100,0.090);',
    ' if(r==3) return vec3(0.115,0.165,0.265);',
    ' return vec3(0.135,0.120,0.235); }',
    'vec3 airB(int r){',
    ' if(r==0) return vec3(0.470,0.500,0.660);',
    ' if(r==1) return vec3(0.090,0.235,0.245);',
    ' if(r==2) return vec3(0.455,0.360,0.265);',
    ' if(r==3) return vec3(0.380,0.470,0.610);',
    ' return vec3(0.470,0.360,0.520); }',
    'vec3 bodyHue(int r,float s){',
    ' if(r==0){ if(s<0.20) return vec3(0.99,0.72,0.78);',
    '           if(s<0.40) return vec3(0.72,0.86,0.99);',
    '           if(s<0.60) return vec3(0.99,0.93,0.72);',
    '           if(s<0.80) return vec3(0.74,0.95,0.82);',
    '           return vec3(0.85,0.76,0.98); }',
    ' if(r==1) return mix(vec3(0.42,0.98,0.72),vec3(0.72,0.95,0.99),s);',
    ' if(r==2) return mix(vec3(1.00,0.94,0.82),vec3(0.99,0.82,0.62),s);',
    ' if(r==3) return mix(vec3(0.96,0.97,1.00),vec3(0.86,0.90,0.98),s);',
    ' if(s<0.34) return vec3(0.99,0.78,0.82);',
    ' if(s<0.67) return vec3(0.78,0.88,1.00);',
    ' return vec3(0.99,0.93,0.78); }',

    'vec3 airField(vec2 uv,float t,float v,int r){',
    ' float d=length(uv*vec2(0.92,1.0));',
    ' vec3 col=mix(airB(r),airA(r),smoothstep(0.10,1.75,d));',
    ' col+=airB(r)*0.16*(1.0-smoothstep(0.0,1.25,length(uv-vec2(-0.35,0.32))));',
    ' float soft=fbm(uv*1.25+vec2(t*0.010,-t*0.008));',
    ' col*=0.86+0.30*soft;',
    ' if(r==4){',
    /* paredes de luz que se abren y se recogen con el ciclo */
    '  float wall=0.5+0.5*cos(d*3.1 - v*3.14159*1.7 - t*0.05);',
    '  col+=bodyHue(4,0.5)*pow(wall,1.7)*(0.10+0.15*v); }',
    ' return col; }',

    'void main(){',
    ' vec2 uv=(gl_FragCoord.xy*2.0-uRes)/min(uRes.x,uRes.y);',
    ' float t=uT*uSpeed;',
    ' float fov=(uWrap==1)?1.10:0.86;',
    ' int r=uRoom;',
    ' vec3 col=airField(uv,t,uV,r);',
    ' vec3 atmo=mix(airB(r),airA(r),0.42)*1.02;',
    ' vec3 glow=vec3(0.0);',
    ' vec3 L=normalize(vec3(-0.46,0.58,0.66));',
    /* el puntero mueve el punto de vista: paralaje, no scroll */
    ' vec2 look=uPoint*0.16;',
    ' float pushAge=(uPointT>0.0)?(uT-uPointT):99.0;',
    ' float pushK=(pushAge<6.0)?(1.0-pushAge/6.0):0.0;',
    /* de lejos a cerca: los cuerpos se tapan y el mas cercano sale del cuadro */
    ' for(int i=0;i<N;i++){ if(i>=uCount) break; float fi=float(i);',
    '  float q=fi/float(N-1);',
    '  float s1=h21(vec2(fi,float(r)*7.0+1.0));',
    '  float s2=h21(vec2(fi*3.1+5.0,float(r)*2.0+9.0));',
    '  float s3=h21(vec2(fi*1.7+11.0,float(r)+3.0));',
    '  float s4=h21(vec2(fi*5.7+21.0,float(r)*3.0+2.0));',
    '  float z=-(0.70+pow(1.0-q,2.25)*22.0);',
    '  float aspw=max(1.0,(uRes.x/uRes.y)/1.5);',
    '  float spread=1.55*(-z)+1.2;',
    '  float x=(s2-0.5)*spread*aspw, y=(s3-0.5)*spread*0.82;',
    '  float rad=0.0; float aspect=1.0; float ang=0.0; float kind=0.0;',
    '  if(r==0){',
    '   y+=mod(s4*16.0+t*(0.10+s1*0.14), 16.0)-8.0;',
    '   x+=sin(t*0.05+fi*1.7)*0.55;',
    '   rad=(0.34+s1*1.15)*(0.55+0.45*(-z)/22.0);',
    '  } else if(r==1){',
    /* tallos de luz y polvo luminoso */
    '   kind=(s1<0.55)?1.0:0.0;',
    '   y+=sin(t*0.055+fi*1.1)*0.30;',
    '   x+=sin(t*0.040+fi*2.3)*0.42;',
    '   if(kind>0.5){ rad=(0.85+s3*1.60)*(0.55+0.45*(-z)/22.0); aspect=0.055+0.045*s2; ang=sin(t*0.030+fi)*0.16+(s2-0.5)*0.40; }',
    '   else { rad=(0.075+s3*0.115)*(0.6+0.5*(-z)/22.0); }',
    '  } else if(r==2){',
    /* hojas de papel grandes, giradas, translucidas */
    '   y+=sin(t*0.048+fi*1.3)*0.55+mod(s4*14.0+t*0.055,14.0)-7.0;',
    '   x+=sin(t*0.037+fi*2.1)*0.75;',
    '   rad=(0.85+s1*1.70)*(0.55+0.45*(-z)/22.0);',
    '   aspect=0.42+0.95*abs(sin(t*0.042+fi*1.9));',
    '   ang=s2*6.2832+sin(t*0.026+fi)*0.34;',
    '  } else if(r==3){',
    '   if(-z<1.35) continue;',
    '   x=(s4-0.5)*spread*aspw; y=(s1-0.5)*spread*0.86;',
    /* volumenes blandos: muchos, grandes y muy difusos */
    '   y+=sin(t*0.030+fi*0.9)*0.45;',
    '   x+=t*0.055*(0.4+s1)-floor((t*0.055*(0.4+s1)+spread*0.5)/spread)*spread;',
    '   rad=(0.78+s1*1.55)*(0.55+0.45*(-z)/22.0);',
    '   aspect=0.70+0.22*s3;',
    '  } else {',
    '   y+=mod(s4*15.0+t*(0.045+s1*0.055),15.0)-7.5;',
    '   x+=sin(t*0.035+fi*1.4)*0.6;',
    '   rad=(0.62+s1*1.45)*(0.55+0.45*(-z)/22.0)*(1.0+0.30*uV);',
    '  }',
    '  if(r==4){ float br=1.0+0.13*uV; x*=br; y*=br; }',
    '  vec2 sc=(vec2(x,y)+look*(-z)*0.22)/(-z)/fov;',
    '  float sr=rad/(-z)/fov;',
    /* al senalar, los cuerpos se apartan despacio. Nada mas */
    '  if(pushK>0.0){ vec2 dl=sc-uPoint; float dd=length(dl)+0.0001;',
    '   sc+=normalize(dl)*exp(-dd*dd*2.2)*0.30*pushK; }',
    '  vec2 rel=(uv-sc)/max(sr,0.0004);',
    '  if(kind<0.5||r!=1){ if(aspect!=1.0){',
    '    vec2 rr=vec2(rel.x*cos(ang)-rel.y*sin(ang), rel.x*sin(ang)+rel.y*cos(ang));',
    '    rr.x/=max(aspect,0.05); rel=rr; } }',
    '  else { vec2 rr=vec2(rel.x*cos(ang)-rel.y*sin(ang), rel.x*sin(ang)+rel.y*cos(ang));',
    '    rr.x/=max(aspect,0.05); rel=rr; }',
    '  float d=length(rel);',
    '  if(r==1&&kind>0.5){ rel.x+=0.16*rel.y*rel.y*sign(sin(fi*2.3)); }',
    '  if(r==2){ vec2 ab=abs(rel); d=pow(pow(ab.x,6.0)+pow(ab.y,6.0),1.0/6.0); }',
    '  if(r==3){ float an=atan(rel.y,rel.x);',
    '   float wob=0.80+0.34*fbm(vec2(an*1.7+fi*3.1, t*0.020+fi));',
    '   wob+=0.14*fbm(vec2(an*4.3-fi, t*0.016));',
    '   d=length(rel)/max(wob,0.35); }',
    '  if(d>2.2) continue;',
    '  vec3 hue=bodyHue(r,s1);',
    '  float far=clamp(1.0+z/24.0,0.0,1.0);',
    '  float aa=max(fwidth(d),0.008);',
    '  float zz=sqrt(max(0.0,1.0-min(d,0.9999)*min(d,0.9999)));',
    '  vec3 n=normalize(vec3(rel,max(zz,0.08)));',
    '  float key=smoothstep(-0.45,0.95,dot(n,L));',
    '  float cov=0.0; vec3 body=hue;',
    '  if(r==3){',
    /* volumen blando de algodon: es un objeto, no vapor. Borde irregular,
       luz por arriba y sombra azulada por abajo, sin brillo especular */
    '   cov=(1.0-smoothstep(0.80,1.06,d))*0.55+(1.0-smoothstep(1.0-aa*2.4,1.0+aa*1.2,d))*0.45;',
    '   float top=clamp(0.5-rel.y*0.80,0.0,1.0);',
    '   float wrapl=smoothstep(-0.70,0.95,dot(n,L));',
    '   float lump=fbm(rel*2.1+vec2(t*0.012,fi));',
    '   body=hue*(0.30+0.46*wrapl+0.46*top*top);',
    '   body*=0.90+0.20*lump;',
    '   body=mix(body, vec3(0.42,0.52,0.70)*0.55, clamp(0.42-top*0.42,0.0,1.0));',
    '   body+=hue*pow(1.0-zz,2.4)*0.14;',
    '  } else if(r==1&&kind<0.5){',
    '   cov=0.0;',
    '   glow+=hue*(exp(-d*d*1.9)*0.16+exp(-d*d*9.0)*0.30)*(0.30+0.70*far);',
    '  } else if(r==2){',
    /* papel: translucido, se ve lo que hay detras y las capas se oscurecen */
    '   cov=(1.0-smoothstep(1.0-aa*1.8,1.0+aa*0.8,d))*0.36;',
    '   float grain=0.95+0.09*fbm(rel*3.4+fi);',
    '   float fold=0.80+0.34*clamp(0.5-rel.y*0.5,0.0,1.0);',
    '   body=hue*(0.62+0.46*key)*grain*fold;',
    '   float edge=smoothstep(0.78,1.0,d)-smoothstep(1.0,1.04,d);',
    '   body+=hue*clamp(edge,0.0,1.0)*0.55;',
    '  } else {',
    '   cov=1.0-smoothstep(1.0-aa*1.8,1.0+aa*0.8,d);',
    '   body=hue*(0.34+0.62*key);',
    '   body+=hue*pow(1.0-zz,2.6)*0.24;',
    /* luz interna: el cuerpo no es opaco, tiene algo encendido dentro */
    '   body+=hue*pow(clamp(1.0-d,0.0,1.0),2.4)*0.26;',
    '   body+=vec3(1.0)*pow(clamp(dot(n,L),0.0,1.0),9.0)*0.10;',
    '  }',
    '  if(r==1&&kind>0.5){',
    '   float core=exp(-d*d*11.0);',
    '   float halo=exp(-d*d*1.35);',
    '   float tip=clamp(1.0-abs(rel.y)*0.55,0.0,1.0);',
    '   glow+=hue*(halo*0.20+core*0.46)*tip*(0.32+0.68*far);',
    '   glow+=vec3(1.0)*core*0.12*tip*far;',
    '   continue; }',
    '  if(cov<=0.002) continue;',
    /* atmosfera: lo lejano se funde con el aire de la sala */
    '  vec3 shown=mix(atmo,body,0.28+0.72*far);',
    '  col=mix(col,shown,cov);',
    ' }',
    ' col+=glow;',
    /* onda lenta opcional */
    ' if(uPointT>0.0){ float age=uT-uPointT;',
    '  if(age<7.0){ float dd=length(uv-uPoint);',
    '   float rw=age*0.17; float ring=exp(-pow((dd-rw)*6.5,2.0))*(1.0-age/7.0);',
    '   col+=airB(r)*ring*0.16; } }',
    ' float vig=1.0-smoothstep(0.95,2.30,length(uv*vec2(0.90,1.0)));',
    ' col*=mix(0.84,1.0,vig);',
    ' col*=uGain;',
    ' col=1.0-exp(-col*1.32);',
    ' float lum=dot(col,vec3(0.2126,0.7152,0.0722));',
    ' col=clamp(mix(vec3(lum),col,1.26),0.0,1.0);',
    ' col=pow(max(col,0.0),vec3(0.94));',
    ' float d2=(h21(gl_FragCoord.xy+floor(uT*24.0))-0.5)/255.0;',
    ' oCol=vec4(clamp(col+d2,0.0,1.0)*uFade,1.0);',
    '}'
  ].join('\n');

  function compile(gl, type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
    return s;
  }

  function create(host, opts) {
    opts = opts || {};
    var listeners = {};
    var canvas = document.createElement('canvas');
    canvas.className = 'r46-room-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(canvas);

    var gl = null;
    try {
      gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, powerPreference: 'low-power' });
    } catch (e) { gl = null; }

    var levelName = opts.level === 'normal' ? 'normal' : 'suave';
    var lv = LEVELS[levelName];
    var roomIdx = 0, raf = 0, running = false, t0 = 0, accrued = 0;
    var wrap = !!opts.wrap, breathValue = 0.5, fade = 0, fadeFrom = 0, fadeDir = 0;
    var pointer = [0, 0], pointerT = -1, reduced = false, destroyed = false;
    /* calidad adaptativa: si el dispositivo no llega, bajan los cuerpos antes
       que la fluidez. Nunca al reves. */
    var COUNT_MAX = 56, COUNT_MIN = 14;
    var count = opts.count || (wrap ? 20 : 30);
    var fpsAcc = 0, fpsN = 0, lastFrame = 0, quality = { count: count, drops: 0 };
    try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) {}

    function emit(n, d) { (listeners[n] || []).forEach(function (f) { try { f(d); } catch (_) {} }); }

    var pr = null, U = {};
    if (gl) {
      var vs = compile(gl, gl.VERTEX_SHADER, VERT), fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      if (vs && fs) {
        pr = gl.createProgram();
        gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
        if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) pr = null;
      }
      if (pr) {
        gl.useProgram(pr);
        var buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        var loc = gl.getAttribLocation(pr, 'aPos');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        ['uRes', 'uT', 'uV', 'uRoom', 'uWrap', 'uGain', 'uSpeed', 'uWarp', 'uPoint', 'uPointT', 'uFade', 'uCount']
          .forEach(function (k) { U[k] = gl.getUniformLocation(pr, k); });
      }
    }

    function size() {
      var r = host.getBoundingClientRect();
      /* la escena es blanda: no gana nada con densidad extra de pixel y si
         pierde fluidez en equipos modestos */
      var dpr = Math.min(window.devicePixelRatio || 1, wrap ? 1.0 : 1.15);
      var w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
      /* presupuesto de pixeles: en pantallas muy grandes el coste crece con el
         area y la escena es blanda, asi que se dibuja a menos resolucion y el
         navegador la escala. Se nota en el coste, no en la imagen. */
      var BUDGET = 2300000, px = w * h;
      if (px > BUDGET) {
        var k = Math.sqrt(BUDGET / px);
        w = Math.max(1, Math.round(w * k)); h = Math.max(1, Math.round(h * k));
      }
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    }

    function draw(t) {
      size();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U.uRes, canvas.width, canvas.height);
      gl.uniform1f(U.uT, t);
      gl.uniform1f(U.uV, breathValue);
      gl.uniform1i(U.uRoom, ROOMS[roomIdx].k);
      gl.uniform1i(U.uWrap, wrap ? 1 : 0);
      gl.uniform1f(U.uGain, lv.gain);
      gl.uniform1f(U.uSpeed, reduced ? lv.speed * 0.32 : lv.speed);
      gl.uniform1f(U.uWarp, lv.warp);
      gl.uniform2f(U.uPoint, pointer[0], pointer[1]);
      gl.uniform1f(U.uPointT, pointerT);
      gl.uniform1f(U.uFade, fade);
      gl.uniform1i(U.uCount, count);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function frame(now) {
      raf = 0;
      if (destroyed || !running) return;
      if (lastFrame) {
        var dt = now - lastFrame;
        if (dt > 0 && dt < 500) { fpsAcc += dt; fpsN++; }
        if (fpsN >= 20) {
          var avg = fpsAcc / fpsN;
          fpsAcc = 0; fpsN = 0;
          if (avg > 24 && count > COUNT_MIN) { count = Math.max(COUNT_MIN, count - 8); quality.drops++; }
          else if (avg < 13 && count < (wrap ? 40 : COUNT_MAX)) { count = Math.min(wrap ? 40 : COUNT_MAX, count + 6); }
          quality.count = count; quality.avgMs = Math.round(avg * 10) / 10;
          emit('quality', quality);
        }
      }
      lastFrame = now;
      var t = accrued + (now - t0) / 1000;
      if (fadeDir === 1) { fade = Math.min(1, (now - fadeFrom) / 2600); if (fade >= 1) fadeDir = 0; }
      if (fadeDir === -1) {
        fade = Math.max(0, 1 - (now - fadeFrom) / 2600);
        if (fade <= 0.001) { running = false; emit('state', { state: 'stopped' }); return; }
      }
      draw(t);
      raf = window.requestAnimationFrame(frame);
    }

    function onVis() {
      if (document.hidden && running) api.pause();
      else if (!document.hidden && api._auto) api.start();
    }

    function ripple(x, y) {
      var r = host.getBoundingClientRect();
      var m = Math.min(r.width, r.height);
      pointer = [((x - r.left) * 2 - r.width) / m, -(((y - r.top) * 2 - r.height) / m)];
      pointerT = accrued + (performance.now() - t0) / 1000;
    }

    var api = {
      rooms: ROOMS,
      supported: !!pr,
      room: function () { return ROOMS[roomIdx]; },
      setRoom: function (id) {
        for (var i = 0; i < ROOMS.length; i++) if (ROOMS[i].id === id) { roomIdx = i; break; }
        emit('room', { room: ROOMS[roomIdx].id });
        return api;
      },
      setWrap: function (on) { wrap = !!on; if (wrap && count > 40) count = 40; return api; },
      setLevel: function (n) { levelName = LEVELS[n] ? n : 'suave'; lv = LEVELS[levelName]; return api; },
      setBreath: function (v) { breathValue = v < 0 ? 0 : (v > 1 ? 1 : v); return api; },
      /* onda lenta opcional: raton, tacto o tecla. No se guarda nada. */
      rippleAt: ripple,
      rippleCentre: function () { pointer = [0, 0]; pointerT = accrued + (performance.now() - t0) / 1000; return api; },
      start: function () {
        if (!pr || running) return api;
        running = true; api._auto = true;
        t0 = performance.now();
        if (fade < 1) { fadeDir = 1; fadeFrom = t0; }
        if (!raf) raf = window.requestAnimationFrame(frame);
        emit('state', { state: 'running' });
        return api;
      },
      pause: function () {
        if (!running) return api;
        accrued += (performance.now() - t0) / 1000;
        running = false;
        if (raf) { window.cancelAnimationFrame(raf); raf = 0; }
        emit('state', { state: 'paused' });
        return api;
      },
      stop: function () {
        if (!running) { fade = 0; return api; }
        api._auto = false; fadeDir = -1; fadeFrom = performance.now();
        return api;
      },
      /* QA: un fotograma concreto sin animar */
      quality: function () { return quality; },
      setCount: function (n) { count = Math.max(1, Math.min(COUNT_MAX, n | 0)); quality.count = count; return api; },
      frameAt: function (t, v) { if (!pr) return api; breathValue = v == null ? breathValue : v; fade = 1; draw(t); return api; },
      resize: function () { if (pr) size(); return api; },
      on: function (n, f) { (listeners[n] = listeners[n] || []).push(f); return api; },
      destroy: function () {
        destroyed = true; running = false;
        if (raf) { window.cancelAnimationFrame(raf); raf = 0; }
        document.removeEventListener('visibilitychange', onVis);
        try {
          if (pr) { gl.deleteProgram(pr); }
          var e = gl && gl.getExtension('WEBGL_lose_context'); if (e) e.loseContext();
        } catch (_) {}
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        listeners = {};
      }
    };

    document.addEventListener('visibilitychange', onVis);
    return api;
  }

  window.IGSalas46 = {
    create: create,
    rooms: ROOMS,
    levels: LEVELS,
    kind: 'R46_IMMERSIVE_ROOMS',
    sensors: {
      camera: false, microphone: false, geolocation: false, deviceOrientation: false,
      bodyTracking: false, biometrics: false, recognition: false,
      storesGestures: false, scoring: false, rewards: false, tasks: false
    }
  };
})(window, document);
