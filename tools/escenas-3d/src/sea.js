import * as THREE from 'three';
import { NOISE_GLSL } from './common.js';

/* Mar: olas suaves que llegan a la orilla, cielo de tarde y reflejo del sol.
   Todo procedural: cielo y agua en shaders propios. */
const MOODS = {
  blue:   { top: [0.16, 0.34, 0.62], hor: [0.78, 0.86, 0.93], sun: [1.0, 0.95, 0.82], sunY: 0.16, deep: [0.03, 0.17, 0.28], shallow: [0.10, 0.42, 0.48], sand: [0.80, 0.72, 0.58] },
  green:  { top: [0.10, 0.28, 0.40], hor: [0.72, 0.88, 0.82], sun: [1.0, 0.97, 0.86], sunY: 0.2, deep: [0.02, 0.18, 0.20], shallow: [0.08, 0.46, 0.40], sand: [0.78, 0.73, 0.60] },
  violet: { top: [0.20, 0.16, 0.42], hor: [1.0, 0.62, 0.48], sun: [1.0, 0.78, 0.52], sunY: 0.05, deep: [0.06, 0.08, 0.20], shallow: [0.24, 0.22, 0.38], sand: [0.72, 0.58, 0.52] }
};

const SKY_GLSL = /* glsl */`
uniform vec3 uTop; uniform vec3 uHor; uniform vec3 uSun; uniform vec3 uSunDir; uniform float uT;
vec3 igSky(vec3 d){
  float h = clamp(d.y, -0.2, 1.0);
  vec3 c = mix(uHor, uTop, pow(clamp(h * 1.6, 0.0, 1.0), 0.55));
  float s = max(dot(d, uSunDir), 0.0);
  c += uSun * (smoothstep(0.9993, 0.9997, s) * 3.0 + pow(s, 60.0) * 0.35 + pow(s, 6.0) * 0.08);
  // nubes suaves y lentas
  vec2 cp = d.xz / max(d.y + 0.08, 0.05) * 0.35 + vec2(uT * 0.004, 0.0);
  float cl = smoothstep(0.55, 0.85, igF2(cp * 1.3)) * smoothstep(0.0, 0.25, d.y);
  c = mix(c, mix(uHor, vec3(1.0), 0.5) * (0.85 + 0.3 * pow(s, 3.0)), cl * 0.55);
  return c;
}`;

export function createSea(canvas, renderer) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 400);
  camera.position.set(0, 1.55, 9);
  camera.lookAt(0, 1.2, -40);
  let mood = MOODS.blue, moodName = 'blue';
  const uT = { value: 0 };
  const U = {
    uT, uTop: { value: new THREE.Vector3(...mood.top) }, uHor: { value: new THREE.Vector3(...mood.hor) },
    uSun: { value: new THREE.Vector3(...mood.sun) }, uSunDir: { value: new THREE.Vector3(0.2, mood.sunY, -1).normalize() },
    uDeep: { value: new THREE.Vector3(...mood.deep) }, uShallow: { value: new THREE.Vector3(...mood.shallow) }, uSand: { value: new THREE.Vector3(...mood.sand) }
  };

  const sky = new THREE.Mesh(new THREE.SphereGeometry(300, 48, 24), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, uniforms: U,
    vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: NOISE_GLSL + SKY_GLSL + 'varying vec3 vD; void main(){ gl_FragColor = vec4(igSky(normalize(vD)), 1.0); }'
  }));
  scene.add(sky);

  // Olas: suma de ondas tipo Gerstner, lentas
  const WAVES = /* glsl */`
  uniform float uT;
  vec3 igWave(vec2 p, out vec3 n){
    vec3 o = vec3(0.0); vec3 dx = vec3(1.0, 0.0, 0.0), dz = vec3(0.0, 0.0, 1.0);
    vec4 W[5];
    W[0] = vec4(0.10, 0.98, 0.038, 0.22);
    W[1] = vec4(-0.35, 0.94, 0.030, 0.37);
    W[2] = vec4(0.55, 0.83, 0.018, 0.61);
    W[3] = vec4(-0.8, 0.6, 0.010, 1.05);
    W[4] = vec4(0.25, 0.97, 0.008, 1.6);
    for (int i = 0; i < 5; i++){
      vec2 d = normalize(W[i].xy); float a = W[i].z * 6.0, k = W[i].w; float w = sqrt(9.8 * k) * 0.55;
      float f = k * dot(d, p) + w * uT;
      float q = 0.55 / (k * a * 5.0 + 1.0);
      o.x += q * a * d.x * cos(f); o.z += q * a * d.y * cos(f); o.y += a * sin(f);
      dx += vec3(-q * d.x * d.x * a * k * sin(f), d.x * a * k * cos(f), -q * d.x * d.y * a * k * sin(f));
      dz += vec3(-q * d.x * d.y * a * k * sin(f), d.y * a * k * cos(f), -q * d.y * d.y * a * k * sin(f));
    }
    n = normalize(cross(dz, dx));
    return o;
  }`;
  const oceanGeo = new THREE.PlaneGeometry(260, 250, 320, 260); oceanGeo.rotateX(-Math.PI / 2); oceanGeo.translate(0, 0, -122);
  const ocean = new THREE.Mesh(oceanGeo, new THREE.ShaderMaterial({
    uniforms: U,
    vertexShader: NOISE_GLSL + WAVES + /* glsl */`
      varying vec3 vW; varying vec3 vN; varying float vShore;
      void main(){
        vec3 p = position; vec3 n;
        float shoreK = smoothstep(4.5, -6.0, p.z);             // olas más bajas cerca de la orilla
        vec3 o = igWave(p.xz, n);
        p += o * mix(0.25, 1.0, shoreK);
        n = normalize(mix(vec3(0.0, 1.0, 0.0), n, mix(0.35, 1.0, shoreK)));
        vec4 w = modelMatrix * vec4(p, 1.0); vW = w.xyz; vN = n; vShore = p.z;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: NOISE_GLSL + SKY_GLSL + /* glsl */`
      uniform vec3 uDeep; uniform vec3 uShallow;
      varying vec3 vW; varying vec3 vN; varying float vShore;
      void main(){
        vec3 V = normalize(cameraPosition - vW);
        vec2 q = vW.xz * 0.35 + vec2(uT * 0.05, uT * 0.03);
        vec3 n = normalize(vN + vec3(igN2(q * 3.0) - 0.5, 0.0, igN2(q * 3.0 + 7.3) - 0.5) * 0.18);
        float fres = 0.02 + 0.98 * pow(1.0 - max(dot(n, V), 0.0), 5.0);
        vec3 R = reflect(-V, n); R.y = abs(R.y);
        vec3 refl = igSky(R);
        float depth = smoothstep(4.0, -20.0, vShore);
        vec3 body = mix(uShallow, uDeep, depth);
        body += uSun * 0.05 * max(dot(n, uSunDir), 0.0);
        vec3 c = mix(body, refl, clamp(fres, 0.0, 1.0));
        float glit = pow(max(dot(reflect(-uSunDir, n), V), 0.0), 380.0) * 5.0;
        c += uSun * glit;
        // espuma de la ola que rompe cerca de la orilla
        float br = sin(vShore * 1.2 + uT * 0.9);
        float foam = smoothstep(0.82, 0.98, br) * smoothstep(-3.5, 3.0, vShore) * smoothstep(0.35, 0.7, igF2(vW.xz * 1.5 + uT * 0.1));
        c = mix(c, vec3(0.93, 0.96, 0.97), foam * 0.8);
        float dist = length(vW - cameraPosition);
        c = mix(c, igSky(normalize(vec3(-V.x, 0.02, -V.z))), smoothstep(40.0, 180.0, dist));
        gl_FragColor = vec4(c, 1.0);
      }`
  }));
  scene.add(ocean);

  // Arena con la lámina de agua que sube y baja
  const sandGeo = new THREE.PlaneGeometry(80, 16, 200, 60); sandGeo.rotateX(-Math.PI / 2); sandGeo.translate(0, 0, 8);
  { const p = sandGeo.attributes.position; for (let i = 0; i < p.count; i++) { const z = p.getZ(i); p.setY(i, (z - 3.5) * 0.07); } sandGeo.computeVertexNormals(); }
  const sand = new THREE.Mesh(sandGeo, new THREE.ShaderMaterial({
    uniforms: U,
    vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: NOISE_GLSL + SKY_GLSL + /* glsl */`
      uniform vec3 uSand; uniform vec3 uShallow;
      varying vec3 vW;
      void main(){
        float grain = igN2(vW.xz * 40.0) * 0.08 + igF2(vW.xz * 0.8) * 0.12;
        vec3 c = uSand * (0.9 + grain);
        float cyc = uT * 0.18;
        float front = 3.2 + 2.3 * (0.5 + 0.5 * sin(cyc)) + (igF2(vec2(vW.x * 0.25, cyc)) - 0.5) * 1.2;   // hasta dónde llega el agua
        float wet = smoothstep(front + 1.8, front - 0.2, vW.z);
        c = mix(c, c * 0.62, wet);                                        // arena mojada, más oscura
        float sheet = smoothstep(front + 0.05, front - 0.6, vW.z);
        vec3 water = mix(uShallow * 1.3, uHor * 0.85, 0.35);
        float rip = igN2(vW.xz * vec2(3.0, 6.0) + vec2(0.0, uT * 0.6));
        c = mix(c, mix(c * 0.75, water, 0.5) + rip * 0.05, sheet * 0.7);
        float foam = smoothstep(0.45, 0.0, abs(vW.z - front)) * (0.55 + 0.45 * igF2(vW.xz * 2.2 + uT * 0.2));
        c = mix(c, vec3(0.95, 0.97, 0.98), foam * 0.75);
                gl_FragColor = vec4(c, 1.0);
      }`
  }));
  scene.add(sand);

  let t = 0;
  function update(dt, k, reduced) {
    t += dt * k * 0.9; uT.value = t;
    if (!reduced) { camera.position.y = 1.55 + Math.sin(t * 0.12) * 0.05; camera.lookAt(Math.sin(t * 0.03) * 1.2, 1.2, -40); }
  }
  function setWater(name) {
    if (name === moodName) return; moodName = name; mood = MOODS[name] || MOODS.blue;
    U.uTop.value.set(...mood.top); U.uHor.value.set(...mood.hor); U.uSun.value.set(...mood.sun);
    U.uSunDir.value.set(0.2, mood.sunY, -1).normalize(); U.uDeep.value.set(...mood.deep); U.uShallow.value.set(...mood.shallow); U.uSand.value.set(...mood.sand);
  }
  update(0, 1, true);
  return {
    scene, camera, update, setWater,
    resize(w, h) { camera.aspect = w / Math.max(1, h); camera.fov = camera.aspect < 1.2 ? 65 : 45; camera.updateProjectionMatrix(); }
  };
}
