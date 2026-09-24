import * as THREE from 'three';
import { TAU, rnd, canvasTexture } from './common.js';

/* Cortina de fibra óptica de sala sensorial: cientos de hilos que caen desde
   el techo, con luz que recorre cada hilo y puntas brillantes. */
const PALETTES = {
  blue:   [[0.2, 0.6, 1.0], [0.55, 0.35, 1.0], [0.1, 0.9, 0.9]],
  green:  [[0.2, 1.0, 0.6], [0.9, 1.0, 0.3], [0.1, 0.8, 0.9]],
  violet: [[0.75, 0.35, 1.0], [1.0, 0.4, 0.75], [0.35, 0.5, 1.0]]
};

export function createFibre(canvas, renderer) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x04050b);
  const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.1, 60);
  camera.position.set(0, 3.2, 12); camera.lookAt(0, 3.4, 0);

  const uT = { value: 0 };
  const uA = { value: new THREE.Vector3() }, uB = { value: new THREE.Vector3() }, uC = { value: new THREE.Vector3() };

  const N = 420, SEG = 26, TOP = 8.2;
  const pos = new Float32Array(N * SEG * 2 * 3), kk = new Float32Array(N * SEG * 2), hue = new Float32Array(N * SEG * 2), phs = new Float32Array(N * SEG * 2);
  const tips = new Float32Array(N * 3), tipHue = new Float32Array(N), tipPh = new Float32Array(N);
  let o = 0;
  const strands = [];
  for (let i = 0; i < N; i++) {
    // origen en un haz del techo; caen abriéndose en forma de cortina
    const a = rnd(0, TAU), r0 = Math.sqrt(Math.random()) * 0.35;
    const sx = Math.cos(a) * r0, sz = Math.sin(a) * r0;
    const spread = rnd(-5.5, 5.5), depth = rnd(-2.5, 2.5), len = rnd(6.5, 8.2), h = Math.random(), ph = rnd(0, TAU);
    strands.push({ sx, sz, spread, depth, len });
    const pt = (k) => {
      const y = TOP - k * len;
      const bend = Math.pow(k, 1.6);
      return [sx + spread * bend * (0.3 + 0.7 * k), y, sz + depth * bend * 0.8];
    };
    for (let s = 0; s < SEG; s++) {
      for (let e = 0; e < 2; e++) {
        const k = (s + e) / SEG, p = pt(k);
        pos[o * 3] = p[0]; pos[o * 3 + 1] = p[1]; pos[o * 3 + 2] = p[2]; kk[o] = k; hue[o] = h; phs[o] = ph; o++;
      }
    }
    const e = pt(1); tips[i * 3] = e[0]; tips[i * 3 + 1] = e[1]; tips[i * 3 + 2] = e[2]; tipHue[i] = h; tipPh[i] = ph;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aK', new THREE.BufferAttribute(kk, 1));
  g.setAttribute('aH', new THREE.BufferAttribute(hue, 1));
  g.setAttribute('aPh', new THREE.BufferAttribute(phs, 1));
  const colorFn = `
    uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; uniform float uT;
    vec3 pal(float x){ x = fract(x); return x < 0.333 ? mix(uA, uB, x * 3.0) : x < 0.666 ? mix(uB, uC, (x - 0.333) * 3.0) : mix(uC, uA, (x - 0.666) * 3.0); }`;
  const lineMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uT, uA, uB, uC },
    vertexShader: `uniform float uT; attribute float aK; attribute float aH; attribute float aPh; varying float vK; varying float vH; varying float vPh;
      void main(){ vK = aK; vH = aH; vPh = aPh; vec3 p = position;
        p.x += sin(uT * 0.35 + aPh) * 0.12 * aK * aK; p.z += cos(uT * 0.3 + aPh) * 0.1 * aK * aK;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }`,
    fragmentShader: `${colorFn} varying float vK; varying float vH; varying float vPh;
      void main(){ vec3 c = pal(vH * 0.35 + uT * 0.02);
        float pulse = 0.55 + 0.45 * smoothstep(0.7, 1.0, sin(vK * 9.0 - uT * 0.6 + vPh));
        gl_FragColor = vec4(c * (0.12 + 0.35 * vK) * pulse, 1.0); }`
  });
  const lines = new THREE.LineSegments(g, lineMat); scene.add(lines);

  const tg = new THREE.BufferGeometry();
  tg.setAttribute('position', new THREE.BufferAttribute(tips, 3));
  tg.setAttribute('aH', new THREE.BufferAttribute(tipHue, 1));
  tg.setAttribute('aPh', new THREE.BufferAttribute(tipPh, 1));
  const tipMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uT, uA, uB, uC, uSize: { value: 16 } },
    vertexShader: `uniform float uT; uniform float uSize; attribute float aH; attribute float aPh; varying float vH; varying float vPh;
      void main(){ vH = aH; vPh = aPh; vec3 p = position; p.x += sin(uT * 0.35 + aPh) * 0.12; p.z += cos(uT * 0.3 + aPh) * 0.1;
        vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_PointSize = uSize * (8.0 / -mv.z); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `${colorFn} varying float vH; varying float vPh;
      void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d);
        float tw = 0.7 + 0.3 * sin(uT * 0.8 + vPh * 3.0);
        vec3 c = pal(vH * 0.35 + uT * 0.02) * a * tw + vec3(1.0) * pow(a, 6.0) * 0.6;
        gl_FragColor = vec4(c, 1.0); }`
  });
  scene.add(new THREE.Points(tg, tipMat));

  // Suelo con reflejo de la luz y el cabezal del techo
  const glow = canvasTexture(256, 256, (c, W, H) => { const gr = c.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2); gr.addColorStop(0, 'rgba(255,255,255,0.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = gr; c.fillRect(0, 0, W, H); }, false);
  const floorGlow = new THREE.Mesh(new THREE.PlaneGeometry(16, 7), new THREE.MeshBasicMaterial({ map: glow, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.35 }));
  floorGlow.rotation.x = -Math.PI / 2; floorGlow.position.y = -0.2; scene.add(floorGlow);
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, 0.35, 32), new THREE.MeshBasicMaterial({ color: 0x151822 }));
  head.position.y = TOP + 0.15; scene.add(head);

  let t = 0, palName = null;
  function setWater(name) {
    if (name === palName) return; palName = name;
    const p = PALETTES[name] || PALETTES.blue;
    uA.value.set(...p[0]); uB.value.set(...p[1]); uC.value.set(...p[2]);
    floorGlow.material.color.setRGB(...p[0]);
  }
  setWater('blue');
  function update(dt, k, reduced) {
    t += dt * k; uT.value = t;
    if (!reduced) { camera.position.x = Math.sin(t * 0.04) * 1.2; camera.lookAt(0, 3.4, 0); }
  }
  return {
    scene, camera, update, setWater,
    resize(w, h) { camera.aspect = w / Math.max(1, h); camera.fov = camera.aspect < 1.2 ? 62 : 40; camera.updateProjectionMatrix(); tipMat.uniforms.uSize.value = Math.max(10, Math.min(22, h / 30)); }
  };
}
