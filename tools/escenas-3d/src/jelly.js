import * as THREE from 'three';
import { TAU, rnd, clamp, canvasTexture } from './common.js';

/* Acuario de medusas luna: campanas translúcidas que laten despacio,
   brazos orales y tentáculos que ondulan, luz de fondo cambiante y nieve marina. */
const LIGHT = {
  blue:   { top: 0x1c4f86, deep: 0x02060f, glow: [0.55, 0.8, 1.0], rim: [0.75, 0.9, 1.0] },
  green:  { top: 0x14605a, deep: 0x020a09, glow: [0.5, 1.0, 0.85], rim: [0.75, 1.0, 0.9] },
  violet: { top: 0x4a2a86, deep: 0x05030f, glow: [0.85, 0.65, 1.0], rim: [1.0, 0.8, 1.0] }
};

export function createJellies(canvas, renderer) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.1, 80);
  camera.position.set(0, 0, 14);
  let light = LIGHT.blue;
  scene.fog = new THREE.FogExp2(light.deep, 0.028);

  const uT = { value: 0 };
  const uGlow = { value: new THREE.Color().setRGB(...light.glow) };
  const uRim = { value: new THREE.Color().setRGB(...light.rim) };

  const bgMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { uTop: { value: new THREE.Color(light.top) }, uDeep: { value: new THREE.Color(light.deep) }, uT },
    vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `uniform vec3 uTop; uniform vec3 uDeep; uniform float uT; varying vec3 vP;
      void main(){ vec3 n = normalize(vP); float h = clamp(n.y * 1.1 + 0.55, 0.0, 1.0);
        float wave = 0.08 * sin(n.x * 5.0 + uT * 0.2) * sin(n.y * 3.0 - uT * 0.15);
        vec3 c = mix(uDeep, uTop, pow(h, 1.6) + wave);
        gl_FragColor = vec4(c, 1.0); }`
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(40, 32, 16), bgMat));

  /* Campana: media esfera aplanada con el borde ondulado */
  const bellGeo = new THREE.SphereGeometry(1, 72, 28, 0, TAU, 0, Math.PI * 0.55);
  { const p = bellGeo.attributes.position; for (let i = 0; i < p.count; i++) { p.setY(i, p.getY(i) * 0.62); } bellGeo.computeVertexNormals(); }
  const bellMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    uniforms: { uT, uGlow, uRim, uPulse: { value: 0 } },
    vertexShader: `uniform float uPulse; varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main(){ vP = position; vec3 p = position;
        float edge = 1.0 - clamp(p.y / 0.62, 0.0, 1.0);
        p.xz *= 1.0 - uPulse * 0.22 * edge;           // la campana se cierra
        p.y *= 1.0 + uPulse * 0.18;
        p.y += sin(atan(p.z, p.x) * 8.0) * 0.02 * edge;   // borde festoneado
        vec4 mv = modelViewMatrix * vec4(p, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uGlow; uniform vec3 uRim; varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main(){
        float f = 1.0 - abs(dot(normalize(vN), normalize(vV)));
        float rim = pow(f, 2.4);
        // cuatro gónadas en forma de herradura (medusa luna)
        float a = atan(vP.z, vP.x); float r = length(vP.xz);
        float ring = smoothstep(0.08, 0.0, abs(r - 0.32 - 0.05 * cos(a * 4.0))) * (0.5 + 0.5 * cos(a * 4.0));
        float body = 0.13 + 0.16 * (1.0 - r);
        vec3 c = uGlow * body + uRim * rim * 0.95 + vec3(1.0, 0.85, 0.95) * ring * 0.55;
        gl_FragColor = vec4(c, 1.0); }`
  });

  /* Brazos orales: cintas con ondulación */
  const armGeo = new THREE.PlaneGeometry(0.22, 2.6, 1, 24); armGeo.translate(0, -1.3, 0);
  const armMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    uniforms: { uT, uGlow },
    vertexShader: `uniform float uT; varying float vY; varying vec2 vU;
      void main(){ vU = uv; vec3 p = position; float k = -p.y / 2.6; vY = k;
        p.x += sin(uT * 1.2 + k * 5.0) * 0.18 * k; p.z += cos(uT * 0.9 + k * 4.0) * 0.12 * k;
        p.x *= 1.0 + sin(k * 18.0 + uT) * 0.25;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }`,
    fragmentShader: `uniform vec3 uGlow; varying float vY; varying vec2 vU;
      void main(){ float edge = 1.0 - abs(vU.x - 0.5) * 2.0; float a = (1.0 - vY) * edge * 0.55;
        gl_FragColor = vec4(uGlow * a * 0.6 + vec3(0.9, 0.8, 1.0) * a * 0.15, 1.0); }`
  });

  /* Tentáculos: líneas finas alrededor del borde */
  function tentacles(n) {
    const seg = 18, pos = new Float32Array(n * seg * 2 * 3), kk = new Float32Array(n * seg * 2), ph = new Float32Array(n * seg * 2);
    let o = 0;
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU, x = Math.cos(a) * 0.97, z = Math.sin(a) * 0.97, len = rnd(1.6, 3.2), phase = rnd(0, TAU);
      for (let s = 0; s < seg; s++) {
        for (let e = 0; e < 2; e++) {
          const k = (s + e) / seg;
          pos[o * 3] = x; pos[o * 3 + 1] = -k * len; pos[o * 3 + 2] = z; kk[o] = k; ph[o] = phase; o++;
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aK', new THREE.BufferAttribute(kk, 1));
    g.setAttribute('aPh', new THREE.BufferAttribute(ph, 1));
    return g;
  }
  const tenMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uT, uGlow, uPulse: { value: 0 } },
    vertexShader: `uniform float uT; uniform float uPulse; attribute float aK; attribute float aPh; varying float vK;
      void main(){ vK = aK; vec3 p = position;
        p.xz *= 1.0 - uPulse * 0.2;
        p.x += sin(uT * 0.9 + aPh + aK * 4.0) * 0.35 * aK; p.z += cos(uT * 0.7 + aPh + aK * 3.0) * 0.3 * aK;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }`,
    fragmentShader: `uniform vec3 uGlow; varying float vK; void main(){ gl_FragColor = vec4(uGlow * (1.0 - vK) * 0.4, 1.0); }`
  });

  const jellies = [];
  for (let i = 0; i < 9; i++) {
    const g = new THREE.Group();
    const bm = bellMat.clone(); bm.uniforms = { uT, uGlow, uRim, uPulse: { value: 0 } };
    const bell = new THREE.Mesh(bellGeo, bm); g.add(bell);
    for (let a = 0; a < 4; a++) {
      const arm = new THREE.Mesh(armGeo, armMat); arm.rotation.y = a / 4 * TAU + 0.4; arm.position.y = 0.05; g.add(arm);
    }
    const tm = tenMat.clone(); tm.uniforms = { uT, uGlow, uPulse: bm.uniforms.uPulse };
    g.add(new THREE.LineSegments(tentacles(40), tm));
    const s = rnd(0.55, 1.15);
    g.scale.setScalar(s);
    g.position.set(-8.5 + (i % 5) * 4.2 + rnd(-1, 1), (i % 2 ? 2.6 : -2.2) + rnd(-1.2, 1.2), rnd(-8, 1.5));
    g.rotation.z = rnd(-0.35, 0.35); g.rotation.x = rnd(0.2, 0.55);
    scene.add(g);
    jellies.push({ push: new THREE.Vector3(), g, pulse: bm.uniforms.uPulse, ph: rnd(0, TAU), per: rnd(3.2, 4.6), drift: new THREE.Vector3(rnd(-0.08, 0.08), 0, rnd(-0.03, 0.03)), s });
  }

  /* Nieve marina */
  const N = 900, pp = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { pp[i * 3] = rnd(-16, 16); pp[i * 3 + 1] = rnd(-9, 9); pp[i * 3 + 2] = rnd(-14, 6); }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  const dot = canvasTexture(32, 32, (c, W, H) => { const g = c.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H); }, false);
  const snow = new THREE.Points(pg, new THREE.PointsMaterial({ map: dot, size: 0.07, color: 0xcfe6ff, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }));
  scene.add(snow);

  let t = 0;
  function update(dt, k, reduced) {
    t += dt * k; uT.value = t;
    for (const j of jellies) {
      const cyc = ((t + j.ph) % j.per) / j.per;
      const contract = cyc < 0.35 ? Math.sin(cyc / 0.35 * Math.PI * 0.5) : Math.cos((cyc - 0.35) / 0.65 * Math.PI * 0.5);
      j.pulse.value = contract;
      const up = new THREE.Vector3(0, 1, 0).applyEuler(j.g.rotation);
      const thrust = (cyc < 0.35 ? 0.55 : 0.08) - 0.1;
      j.g.position.addScaledVector(up, thrust * dt * k * 0.9 * j.s);
      j.g.position.addScaledVector(j.drift, dt * k);
      j.g.position.addScaledVector(j.push, dt); j.push.multiplyScalar(Math.max(0, 1 - dt * 0.8));
      j.g.rotation.z += Math.sin(t * 0.1 + j.ph) * 0.0006 * k;
      if (j.g.position.y > 7) j.g.position.y = -7; if (j.g.position.y < -7.5) j.g.position.y = 7;
      if (j.g.position.x > 11) j.g.position.x = -11; if (j.g.position.x < -11) j.g.position.x = 11;
    }
    const p = pg.attributes.position;
    for (let i = 0; i < N; i++) { let y = p.getY(i) - 0.05 * dt * k; if (y < -9) y = 9; p.setY(i, y); }
    p.needsUpdate = true;
    if (!reduced) { camera.position.x = Math.sin(t * 0.03) * 0.8; camera.lookAt(0, 0, 0); }
  }
  function setWater(name) {
    const l = LIGHT[name] || LIGHT.blue; if (l === light) return; light = l;
    bgMat.uniforms.uTop.value.set(l.top); bgMat.uniforms.uDeep.value.set(l.deep); scene.fog.color.set(l.deep);
    uGlow.value.setRGB(...l.glow); uRim.value.setRGB(...l.rim);
  }
  for (let i = 0; i < 60; i++) update(1 / 30, 1, true);
  return {
    scene, camera, update, setWater,
    poke(x, y) {
      const P = new THREE.Vector3();
      for (const j of jellies) {
        P.copy(j.g.position).project(camera);
        const dx = (P.x + 1) / 2 - x, dy = (1 - P.y) / 2 - y, d = Math.hypot(dx * camera.aspect, dy);
        if (d < 0.28) { const f = (0.28 - d) * 9; j.push.x += Math.sign(dx || 0.01) * f; j.push.y += -Math.sign(dy || 0.01) * f * 0.6; }
      }
    },
    resize(w, h) { camera.aspect = w / Math.max(1, h); camera.fov = camera.aspect < 1.2 ? 60 : 42; camera.updateProjectionMatrix(); }
  };
}
