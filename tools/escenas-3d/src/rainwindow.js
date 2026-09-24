import * as THREE from 'three';
import { NOISE_GLSL, rnd } from './common.js';

/* Lluvia en la ventana: gotas que se quedan en el cristal y otras que resbalan despacio.
   Detrás, luces desenfocadas. Las gotas actúan como pequeñas lentes (mapa de normales dibujado en un canvas). */
const MOODS = {
  blue:   { a: [0.03, 0.05, 0.11], b: [0.10, 0.16, 0.30], l1: [1.0, 0.72, 0.38], l2: [0.55, 0.75, 1.0], l3: [1.0, 0.9, 0.75] },
  green:  { a: [0.02, 0.06, 0.05], b: [0.10, 0.22, 0.18], l1: [1.0, 0.85, 0.45], l2: [0.6, 0.95, 0.75], l3: [1.0, 0.95, 0.8] },
  violet: { a: [0.06, 0.03, 0.10], b: [0.26, 0.14, 0.34], l1: [1.0, 0.6, 0.45], l2: [0.85, 0.6, 1.0], l3: [1.0, 0.82, 0.9] }
};

function dropSprite(size) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d'), img = g.createImageData(size, size), r = size / 2;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const dx = (x + 0.5 - r) / r, dy = (y + 0.5 - r) / r, d = Math.sqrt(dx * dx + dy * dy), i = (y * size + x) * 4;
    if (d >= 1) { img.data[i + 3] = 0; continue; }
    const z = Math.sqrt(1 - d * d);
    img.data[i] = 128 + dx * 127 * (1 - z * 0.3);
    img.data[i + 1] = 128 + dy * 127 * (1 - z * 0.3);
    img.data[i + 2] = 255 * z;
    img.data[i + 3] = 255 * Math.min(1, (1 - d) * 6);
  }
  g.putImageData(img, 0, 0);
  return c;
}

export function createRainWindow(canvas, renderer) {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const DW = 640; let DH = 360;
  const dmap = document.createElement('canvas'); dmap.width = DW; dmap.height = DH;
  const dctx = dmap.getContext('2d');
  const sprite = dropSprite(64);
  const tex = new THREE.CanvasTexture(dmap); tex.minFilter = THREE.LinearFilter; tex.generateMipmaps = false;
  let mood = MOODS.blue, moodName = 'blue';
  const U = {
    uT: { value: 0 }, uDrops: { value: tex }, uAspect: { value: 16 / 9 },
    uA: { value: new THREE.Vector3(...mood.a) }, uB: { value: new THREE.Vector3(...mood.b) },
    uL1: { value: new THREE.Vector3(...mood.l1) }, uL2: { value: new THREE.Vector3(...mood.l2) }, uL3: { value: new THREE.Vector3(...mood.l3) }
  };
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    uniforms: U, depthWrite: false, depthTest: false,
    vertexShader: 'varying vec2 vU; void main(){ vU = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: NOISE_GLSL + /* glsl */`
      uniform float uT; uniform sampler2D uDrops; uniform float uAspect;
      uniform vec3 uA; uniform vec3 uB; uniform vec3 uL1; uniform vec3 uL2; uniform vec3 uL3;
      varying vec2 vU;
      vec3 lights(vec2 p, float blur, float scale, float seed){
        vec3 acc = vec3(0.0);
        vec2 g = p * scale; vec2 id = floor(g);
        for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){
          vec2 c = id + vec2(float(i), float(j));
          float h = igH2(c + seed);
          if (h < 0.45) continue;
          vec2 o = vec2(igH2(c + seed + 3.1), igH2(c + seed + 7.7));
          vec2 pos = c + o;
          pos.x += sin(uT * 0.05 + h * 30.0) * 0.08;
          float r = mix(0.22, 0.48, igH2(c + seed + 1.3));
          float d = length(g - pos);
          float disc = 1.0 - smoothstep(r * (1.0 - blur), r, d);
          disc *= 0.75 + 0.25 * smoothstep(r * 0.2, r, d);   // borde algo más marcado, como en fotos
          float tw = 0.85 + 0.15 * sin(uT * (0.2 + h) + h * 40.0);
          vec3 col = h > 0.8 ? uL3 : (h > 0.62 ? uL1 : uL2);
          acc += col * disc * tw * mix(0.35, 0.8, h);
        }
        return acc;
      }
      vec3 scene(vec2 uv, float blur){
        vec2 p = vec2(uv.x * uAspect, uv.y);
        vec3 c = mix(uA, uB, smoothstep(0.0, 1.0, uv.y) * 0.6 + igF2(p * 1.5 + uT * 0.01) * 0.4);
        c += lights(p, blur, 3.0, 0.0) * 1.15;
        c += lights(p + 13.0, blur, 5.5, 5.0) * 0.55;
        c += lights(p + 31.0, blur, 1.6, 9.0) * 0.6 * smoothstep(0.7, 0.2, uv.y);
        return c;
      }
      void main(){
        vec4 d = texture2D(uDrops, vec2(vU.x, 1.0 - vU.y));
        float m = d.a;
        vec2 n = (d.rg - 0.5) * 2.0;
        vec3 outside = scene(vU, 0.85);
        float fog = 0.06 + 0.05 * igF2(vU * vec2(uAspect, 1.0) * 3.0);
        outside = mix(outside, uB * 1.3 + 0.03, fog);
        vec2 luv = vU - n * 0.05;                          // la gota invierte y concentra lo que hay detrás
        vec3 inside = scene(luv, 0.25) * 1.15;
        inside += pow(max(0.0, n.y * -0.7 + n.x * -0.3), 6.0) * 0.35;   // brillo de la gota
        inside *= 0.85 + 0.15 * d.b;
        vec3 c = mix(outside, inside, m);
        c *= 1.0 - smoothstep(0.6, 1.25, length((vU - 0.5) * vec2(1.2, 1.0))) * 0.35;
        gl_FragColor = vec4(c, 1.0);
      }`
  }));
  scene.add(quad);

  // Gotas
  let still = [], sliders = [];
  function addStill(n) { for (let i = 0; i < n; i++) still.push({ x: rnd(0, DW), y: rnd(0, DH), r: Math.pow(Math.random(), 2.5) * 7 + 1.3, life: rnd(20, 90) }); }
  function newSlider(top) { return { x: rnd(10, DW - 10), y: top ? rnd(-40, -5) : rnd(0, DH * 0.8), r: rnd(7, 12), v: 0, hold: rnd(1, 7), wob: rnd(0, 6), trail: 0 }; }
  function init() { still = []; addStill(420); sliders = []; for (let i = 0; i < 14; i++) sliders.push(newSlider(false)); }
  init();
  let t = 0, acc = 0;
  function draw() {
    dctx.clearRect(0, 0, DW, DH);
    for (const s of still) dctx.drawImage(sprite, s.x - s.r, s.y - s.r, s.r * 2, s.r * 2);
    for (const s of sliders) {
      dctx.drawImage(sprite, s.x - s.r, s.y - s.r * 1.15, s.r * 2, s.r * 2.3);
    }
    tex.needsUpdate = true;
  }
  function step(dt) {
    for (let i = still.length - 1; i >= 0; i--) { still[i].life -= dt; if (still[i].life <= 0) still.splice(i, 1); }
    if (still.length < 420) addStill(Math.min(6, 420 - still.length));
    for (const s of sliders) {
      if (s.hold > 0) { s.hold -= dt; continue; }
      s.v = Math.min(s.v + dt * 30, 26 + s.r * 2);
      const dy = s.v * dt; s.y += dy; s.wob += dt * 1.3; s.x += Math.sin(s.wob) * dt * 3;
      s.trail += dy;
      if (s.trail > 7) { s.trail = 0; still.push({ x: s.x + rnd(-1.5, 1.5), y: s.y - s.r * 1.6, r: rnd(1.2, 2.6), life: rnd(8, 30) }); }
      // limpia las gotas pequeñas que encuentra
      for (let i = still.length - 1; i >= 0; i--) { const o = still[i]; if (Math.abs(o.x - s.x) < s.r && o.y > s.y - 2 && o.y < s.y + s.r) { still.splice(i, 1); s.r = Math.min(13, s.r + 0.05); } }
      if (Math.random() < dt * 0.15) s.hold = rnd(0.5, 3);   // a veces se para un momento
      if (s.y - s.r > DH + 10) Object.assign(s, newSlider(true));
    }
  }
  function update(dt, k, reduced) {
    t += dt * k; U.uT.value = t;
    const sp = reduced ? 0.35 : 1;
    acc += dt;
    step(dt * k * sp);
    if (acc > 1 / 30) { acc = 0; draw(); }   // el mapa de gotas se redibuja a 30 imágenes por segundo
  }
  function setWater(name) {
    if (name === moodName) return; moodName = name; mood = MOODS[name] || MOODS.blue;
    U.uA.value.set(...mood.a); U.uB.value.set(...mood.b); U.uL1.value.set(...mood.l1); U.uL2.value.set(...mood.l2); U.uL3.value.set(...mood.l3);
  }
  for (let i = 0; i < 30; i++) step(0.1);
  draw();
  return {
    scene, camera, update, setWater,
    resize(w, h) {
      U.uAspect.value = w / Math.max(1, h);
      const nh = Math.round(DW / U.uAspect.value);
      if (nh !== DH && nh > 50 && nh < 2000) { DH = nh; dmap.height = DH; tex.dispose(); init(); for (let i = 0; i < 30; i++) step(0.1); draw(); }
    }
  };
}
