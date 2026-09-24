import * as THREE from 'three';
import { TAU, rnd, clamp, canvasTexture } from './common.js';

/* Pausa guiada: esfera de luz que crece (4 s) y se encoge (6 s) siguiendo la
   guía de la página. Un arco fino muestra cuánto queda de cada fase, para que
   el ritmo sea previsible. Sin guía en marcha, la imagen está quieta. */
export function createPause(canvas, renderer) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.set(0, 0, 10);

  // Fondo: degradado suave con los colores de Iris Green
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShaderMaterial({
    depthWrite: false,
    uniforms: { uA: { value: new THREE.Color(0x0f2a45) }, uB: { value: new THREE.Color(0x2b2a66) }, uC: { value: new THREE.Color(0x1f5f8b) } },
    vertexShader: 'varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; varying vec2 vU;
      void main(){ float r = distance(vU, vec2(0.5)); vec3 c = mix(uC, uA, smoothstep(0.0, 0.35, r)); c = mix(c, uB, smoothstep(0.25, 0.7, vU.y) * 0.45);
      gl_FragColor = vec4(c, 1.0); }`
  }));
  bg.position.z = -8; scene.add(bg);

  const uT = { value: 0 }, uBreath = { value: 0 };
  // Esfera de luz con brillo interior que fluye
  const orb = new THREE.Mesh(new THREE.SphereGeometry(1, 128, 96), new THREE.ShaderMaterial({
    transparent: true,
    uniforms: { uT, uBreath },
    vertexShader: `uniform float uT; uniform float uBreath; varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main(){ vP = position; vec3 p = position;
        vec4 mv = modelViewMatrix * vec4(p,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform float uT; uniform float uBreath; varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main(){
        float f = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);
        float rim = pow(1.0 - f, 2.5);
        float flow = 0.5 + 0.5 * sin(vP.x * 3.1 + uT * 0.35) * sin(vP.y * 2.7 - uT * 0.3) * sin(vP.z * 3.3 + uT * 0.25);
        vec3 core = mix(vec3(0.55, 0.85, 0.95), vec3(0.78, 0.72, 1.0), flow);
        vec3 c = core * (0.45 + 0.85 * pow(f, 1.2)) + vec3(0.85, 0.95, 1.0) * rim * 1.1;
        c *= 0.72 + 0.25 * uBreath;
        gl_FragColor = vec4(c, 0.92);
      }`
  }));
  scene.add(orb);

  // Halo
  const haloTex = canvasTexture(256, 256, (c, W, H) => {
    const g = c.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2);
    g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(0.25, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
  }, false);
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: haloTex, color: 0x8fd6ff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.55 }));
  halo.position.z = -0.5; scene.add(halo);

  // Arco de progreso de la fase
  const uP = { value: 0 }, uIn = { value: 1 };
  const arc = new THREE.Mesh(new THREE.RingGeometry(2.35, 2.4, 160, 1), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uP, uIn },
    vertexShader: 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `uniform float uP; uniform float uIn; varying vec2 vP;
      void main(){ float a = atan(vP.x, vP.y); a = a < 0.0 ? a + 6.2831853 : a; float k = a / 6.2831853;
        float on = step(k, uP);
        vec3 c = mix(vec3(0.6, 0.72, 0.86), mix(vec3(0.95, 0.85, 1.0), vec3(0.75, 0.95, 1.0), uIn), on);
        gl_FragColor = vec4(c, mix(0.18, 0.85, on)); }`
  }));
  scene.add(arc);

  // Ondas suaves al empezar cada fase
  const ripples = [];
  for (let i = 0; i < 3; i++) {
    const m = new THREE.Mesh(new THREE.RingGeometry(0.98, 1.0, 128), new THREE.MeshBasicMaterial({ color: 0xbfe6ff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    scene.add(m); ripples.push({ m, life: 1 });
  }
  let rip = 0;

  // Partículas alrededor
  const N = 420, pos = new Float32Array(N * 3), base = [];
  for (let i = 0; i < N; i++) {
    const a = rnd(0, TAU), r = rnd(1.4, 4.2), z = rnd(-2, 1);
    base.push({ a, r, z, s: rnd(0.02, 0.08), w: rnd(0, TAU) });
  }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const dotTex = canvasTexture(64, 64, (c, W, H) => { const g = c.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H); }, false);
  const pts = new THREE.Points(pg, new THREE.PointsMaterial({ map: dotTex, color: 0xcfe8ff, size: 0.09, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending }));
  scene.add(pts);

  let t = 0, breath = 0, lastPhase = null;
  const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(x, 0, 1));

  function update(dt, k, reduced, phase) {
    // phase: { guiding, inhale, progress }
    const moving = phase.guiding && !reduced;
    if (moving) t += dt;
    uT.value = t;
    let target;
    if (!phase.guiding) target = 0.35;
    else target = phase.inhale ? ease(phase.progress) : 1 - ease(phase.progress);
    breath = reduced ? target : breath + (target - breath) * clamp(dt * 6, 0, 1);
    uBreath.value = breath;
    const s = 1.05 + breath * 0.75;
    orb.scale.setScalar(s);
    halo.scale.setScalar(s * 5.2); halo.material.opacity = 0.38 + breath * 0.22;
    uP.value = phase.guiding ? clamp(phase.progress, 0, 1) : 0; uIn.value = phase.inhale ? 1 : 0;
    arc.visible = phase.guiding;
    const key = phase.guiding ? (phase.inhale ? 'in' : 'out') : 'idle';
    if (key !== lastPhase) { if (phase.guiding && !reduced) { const r = ripples[rip++ % ripples.length]; r.life = 0; } lastPhase = key; }
    ripples.forEach((r) => {
      if (r.life < 1) { r.life = Math.min(1, r.life + dt / 3.5); r.m.scale.setScalar(s * (1 + r.life * 1.6)); r.m.material.opacity = (1 - r.life) * 0.45; }
      else r.m.material.opacity = 0;
    });
    const p = pg.attributes.position;
    for (let i = 0; i < N; i++) {
      const b = base[i], rr = b.r * (0.85 + breath * 0.3) + (moving ? Math.sin(t * 0.4 + b.w) * 0.08 : 0), a = b.a + (moving ? t * 0.02 * (i % 2 ? 1 : -1) : 0);
      p.setXYZ(i, Math.cos(a) * rr, Math.sin(a) * rr * 0.95, b.z);
    }
    p.needsUpdate = true;
  }
  return {
    scene, camera, update, setWater() {},
    resize(w, h) { camera.aspect = w / Math.max(1, h); const fit = camera.aspect < 1 ? 1 / camera.aspect : 1; camera.position.z = 10 * fit; camera.updateProjectionMatrix(); }
  };
}
