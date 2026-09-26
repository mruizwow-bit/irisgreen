import * as THREE from 'three';
import { NOISE_GLSL, rnd, TAU } from './common.js';

/* Cielo nocturno: estrellas, una aurora que ondula muy despacio, montañas y un lago que lo refleja. */
const MOODS = {
  blue:   { top: [0.004, 0.01, 0.035], hor: [0.02, 0.05, 0.10], a1: [0.15, 0.95, 0.65], a2: [0.25, 0.45, 1.0] },
  green:  { top: [0.004, 0.02, 0.02], hor: [0.02, 0.07, 0.06], a1: [0.25, 1.0, 0.45], a2: [0.1, 0.7, 0.8] },
  violet: { top: [0.02, 0.008, 0.04], hor: [0.07, 0.03, 0.10], a1: [0.75, 0.35, 1.0], a2: [1.0, 0.35, 0.65] }
};

const SKY = /* glsl */`
uniform float uT; uniform vec3 uTop; uniform vec3 uHor; uniform vec3 uA1; uniform vec3 uA2;
float igStars(vec3 d){
  vec2 p = vec2(atan(d.z, d.x) * 60.0, d.y * 120.0);
  vec2 id = floor(p); vec2 f = fract(p) - 0.5;
  float h = igH2(id);
  float s = step(0.965, h) * smoothstep(0.12, 0.0, length(f - (vec2(igH2(id + 1.3), igH2(id + 2.7)) - 0.5) * 0.6));
  float tw = 0.7 + 0.3 * sin(uT * (0.6 + h * 1.5) + h * 50.0);
  return s * tw * (0.4 + 1.6 * pow(igH2(id + 9.1), 6.0));
}
vec3 igAurora(vec3 d){
  if (d.y < 0.01) return vec3(0.0);
  vec3 acc = vec3(0.0);
  float jit = igH2(d.xz * 731.0 + d.y * 97.0);
  for (int i = 0; i < 48; i++){
    float fi = float(i) + jit;
    float H = 5.0 + fi * 0.85;                        // capas de altura: cortina vertical en el mundo
    vec2 P = d.xz / d.y * H;
    float z0 = -30.0 + 10.0 * sin(P.x * 0.07 + uT * 0.02) + 4.0 * sin(P.x * 0.19 - uT * 0.03) + 2.5 * sin(P.x * 0.43 + uT * 0.05);
    float dz = (P.y - z0) / 4.0;
    float band = exp(-dz * dz * 2.5);
    float streak = 0.35 + 0.65 * pow(igN2(vec2(P.x * 0.45 + uT * 0.04, 0.5)), 1.5);
    float w = exp(-fi * 0.055) * smoothstep(0.0, 3.0, fi);
    vec3 col = mix(uA1, uA2, smoothstep(8.0, 40.0, fi));
    acc += col * band * streak * w * 0.15;
  }
  return acc * smoothstep(0.02, 0.2, d.y);
}
float igRidge(float az){ return 0.012 + 0.05 * igF2(vec2(az * 2.2, 3.0)) + 0.025 * igN2(vec2(az * 9.0, 1.0)); }
vec3 igNight(vec3 d){
  float az = atan(d.z, d.x);
  vec3 c = mix(uHor, uTop, smoothstep(0.0, 0.6, d.y));
  float mw = exp(-pow(dot(d, normalize(vec3(0.6, 0.5, -0.62))) * 3.2, 2.0));   // Vía Láctea suave
  c += vec3(0.05, 0.05, 0.07) * mw * igF2(vec2(az * 6.0, d.y * 8.0));
  c += igStars(d) * vec3(0.95, 0.95, 1.0) * smoothstep(0.02, 0.15, d.y);
  c += igAurora(d);
  float ridge = igRidge(az);
  float mount = smoothstep(ridge + 0.004, ridge - 0.004, d.y);
  c = mix(c, uHor * 0.3 + uA1 * 0.012, mount);
  return c;
}`;

export function createNight(canvas, renderer) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 16 / 9, 0.1, 500);
  camera.position.set(0, 1.4, 6);
  camera.lookAt(0, 4.5, -30);
  let mood = MOODS.blue, moodName = 'blue';
  const U = { uT: { value: 0 }, uTop: { value: new THREE.Vector3(...mood.top) }, uHor: { value: new THREE.Vector3(...mood.hor) }, uA1: { value: new THREE.Vector3(...mood.a1) }, uA2: { value: new THREE.Vector3(...mood.a2) } };
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(300, 64, 32), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, uniforms: U,
    vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: NOISE_GLSL + SKY + 'varying vec3 vD; void main(){ vec3 d = normalize(vD); gl_FragColor = vec4(igNight(d), 1.0); }'
  })));
  // Lago que refleja el cielo, con ondas muy suaves
  const lakeGeo = new THREE.PlaneGeometry(400, 300); lakeGeo.rotateX(-Math.PI / 2); lakeGeo.translate(0, 0, -140);
  scene.add(new THREE.Mesh(lakeGeo, new THREE.ShaderMaterial({
    uniforms: U,
    vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: NOISE_GLSL + SKY + /* glsl */`
      varying vec3 vW;
      void main(){
        vec3 V = normalize(vW - cameraPosition);
        vec2 q = vW.xz * 0.3;
        vec2 rip = vec2(igN2(q * 2.0 + vec2(uT * 0.08, 0.0)) - 0.5, igN2(q * 2.0 + vec2(3.3, uT * 0.06)) - 0.5);
        vec3 R = normalize(vec3(V.x + rip.x * 0.03, -V.y, V.z + rip.y * 0.03));
        float fres = 0.45 + 0.55 * pow(1.0 - abs(V.y), 3.0);
        vec3 c = igNight(R) * fres * 0.85 + uHor * 0.15;
        gl_FragColor = vec4(c, 1.0);
      }`
  })));
  // Orilla con pinos en silueta
  const pineMat = new THREE.MeshBasicMaterial({ color: 0x03050a });
  const shore = new THREE.Group(); scene.add(shore);
    for (const side of [-1, 1]) {
    const bank = new THREE.Mesh(new THREE.CircleGeometry(1, 40), pineMat);
    bank.rotation.x = -Math.PI / 2; bank.scale.set(13, 6.5, 1); bank.position.set(side * 16.5, 0.02, -2.2); shore.add(bank);
  }
  const cone = new THREE.ConeGeometry(1, 1, 7);
  for (let i = 0; i < 26; i++) {
    const side = i % 2 ? 1 : -1, x = side * rnd(4.2, 15), z = rnd(-5, 0.5), hgt = rnd(2.5, 6.5);
    const tree = new THREE.Group();
    for (let k = 0; k < 4; k++) { const m = new THREE.Mesh(cone, pineMat); const s = hgt * (0.42 - k * 0.08); m.scale.set(s * 0.55, hgt * 0.38, s * 0.55); m.position.y = hgt * (0.3 + k * 0.2); tree.add(m); }
    tree.position.set(x, 0, z); shore.add(tree);
  }
  // Luciérnagas lejanas no: solo quietud. Algunas estrellas fugaces muy de vez en cuando.
  const shootGeo = new THREE.BufferGeometry(); shootGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
  const shootMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
  const shoot = new THREE.Line(shootGeo, shootMat); scene.add(shoot);
  let shootT = -1, next = rnd(20, 40), sx = 0, sy = 0, sz = 0, wantX = null;
  let t = 0;
  function update(dt, k, reduced) {
    t += dt * k; U.uT.value = t;
    if (!reduced || wantX !== null || shootT >= 0) {
      if (!reduced) { camera.position.x = Math.sin(t * 0.02) * 0.6; camera.lookAt(0, 4.5, -30); }
      if (!reduced || wantX !== null) next -= dt;
      if (next <= 0 && shootT < 0) { shootT = 0; next = rnd(25, 60); sx = wantX === null ? rnd(-60, 20) : (wantX - 0.5) * 160 - 20; wantX = null; sy = rnd(60, 90); sz = -150; }
      if (shootT >= 0) {
        shootT += dt; const a = shootT / 1.2, p = shootGeo.attributes.position;
        p.setXYZ(0, sx + a * 40, sy - a * 14, sz); p.setXYZ(1, sx + a * 40 - 10, sy - a * 14 + 3.5, sz); p.needsUpdate = true;
        shootMat.opacity = Math.sin(Math.min(1, a) * Math.PI) * 0.7;
        if (a >= 1) { shootT = -1; shootMat.opacity = 0; }
      }
    }
  }
  function setWater(name) {
    if (name === moodName) return; moodName = name; mood = MOODS[name] || MOODS.blue;
    U.uTop.value.set(...mood.top); U.uHor.value.set(...mood.hor); U.uA1.value.set(...mood.a1); U.uA2.value.set(...mood.a2);
  }
  return {
    scene, camera, update, setWater,
    poke(x) { if (shootT < 0) { next = 0; wantX = x; } },
    resize(w, h) { camera.aspect = w / Math.max(1, h); camera.fov = camera.aspect < 1.2 ? 75 : 55; camera.updateProjectionMatrix(); }
  };
}
