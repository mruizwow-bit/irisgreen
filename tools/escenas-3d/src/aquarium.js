import * as THREE from 'three';
import { TAU, rnd, clamp, lerp, addCaustics, canvasTexture, fbm3, bubbleMaterial, rayTexture } from './common.js';
import { makeFish } from './fish.js';

const WATERS = {
  blue:   { fog: 0x1d5877, top: 0x6fc0e0, deep: 0x082a40, caus: [0.55, 0.62, 0.55], sun: 0xfff3dc, hemi: 0x8fd0ee },
  green:  { fog: 0x1f5a4c, top: 0x86cdb0, deep: 0x082c24, caus: [0.55, 0.6, 0.45], sun: 0xf6ffdc, hemi: 0xa6e0c0 },
  violet: { fog: 0x2d2a66, top: 0x9c95e0, deep: 0x0d0b2c, caus: [0.5, 0.48, 0.62], sun: 0xf0e8ff, hemi: 0xb8b0ff }
};
const TANK = { x: 11, yTop: 8.6, zBack: -5, zFront: 3.2, floor: 0 };

export function createAquarium(canvas, renderer) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.1, 80);
  camera.position.set(0, 4.1, 13.2);
  const lookAt = new THREE.Vector3(0, 3.5, -0.8);
  camera.lookAt(lookAt);

  const shared = { uTime: { value: 0 }, uCausColor: { value: new THREE.Color(0.55, 0.62, 0.55) } };
  let water = WATERS.blue;
  scene.fog = new THREE.FogExp2(water.fog, 0.048);

  /* Fondo: degradado vertical en una esfera grande */
  const bgMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { uTop: { value: new THREE.Color(water.top) }, uDeep: { value: new THREE.Color(water.deep) }, uTime: shared.uTime },
    vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `uniform vec3 uTop; uniform vec3 uDeep; uniform float uTime; varying vec3 vP;
      void main(){ float h = clamp(normalize(vP).y * 1.6 + 0.35, 0.0, 1.0); vec3 c = mix(uDeep, uTop, pow(h, 1.4));
      gl_FragColor = vec4(c, 1.0); }`
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(40, 32, 16), bgMat));

  /* Luces */
  const hemi = new THREE.HemisphereLight(water.hemi, 0x8a7a5a, 1.1); scene.add(hemi);
  const sun = new THREE.DirectionalLight(water.sun, 2.4); sun.position.set(-3, 14, 6); scene.add(sun);
  const fill = new THREE.DirectionalLight(0x9fd8ff, 0.5); fill.position.set(6, 3, 10); scene.add(fill);

  /* Arena con dunas suaves */
  const sandTex = canvasTexture(512, 512, (c, W, H) => {
    c.fillStyle = '#cdb893'; c.fillRect(0, 0, W, H);
    for (let i = 0; i < 26000; i++) {
      const v = Math.random();
      c.fillStyle = v < 0.45 ? `rgba(110,90,62,${0.18 + Math.random() * 0.25})` : v < 0.9 ? `rgba(245,236,214,${0.2 + Math.random() * 0.3})` : `rgba(60,55,50,${0.3})`;
      const r = Math.random() * 1.8 + 0.4; c.fillRect(Math.random() * W, Math.random() * H, r, r);
    }
  });
  sandTex.wrapS = sandTex.wrapT = THREE.RepeatWrapping; sandTex.repeat.set(6, 4);
  const sandGeo = new THREE.PlaneGeometry(34, 22, 170, 110); sandGeo.rotateX(-Math.PI / 2);
  { const p = sandGeo.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); p.setY(i, (fbm3(x * 0.18, 0, z * 0.25) - 0.5) * 0.9 + Math.max(0, -z - 2) * 0.12); } sandGeo.computeVertexNormals(); }
  const sand = new THREE.Mesh(sandGeo, addCaustics(new THREE.MeshStandardMaterial({ map: sandTex, roughness: 0.95, metalness: 0, color: 0xb8a88c }), shared, 0.55, 1.35));
  sand.position.set(0, 0, 0); scene.add(sand);

  /* Rocas */
  const rockMat = addCaustics(new THREE.MeshStandardMaterial({ color: 0x77736b, roughness: 0.88, metalness: 0.02, flatShading: false }), shared, 0.22, 2.6);
  function rock(x, z, s, sy) {
    const g = new THREE.IcosahedronGeometry(1, 5), p = g.attributes.position, seed = rnd(0, 50);
    for (let i = 0; i < p.count; i++) {
      const v = new THREE.Vector3(p.getX(i), p.getY(i), p.getZ(i));
      const n = fbm3(v.x * 1.4 + seed, v.y * 1.4, v.z * 1.4, 5);
      v.multiplyScalar(0.75 + n * 0.55); v.y *= sy; if (v.y < -0.2) v.y = -0.2 + (v.y + 0.2) * 0.2;
      p.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, rockMat); m.position.set(x, 0.1 * s, z); m.scale.setScalar(s); m.rotation.y = rnd(0, TAU); scene.add(m);
    return m;
  }
  rock(-5.8, -1.2, 1.25, 0.72); rock(-4.5, -2.2, 0.8, 0.9); rock(3.2, -0.6, 1.0, 0.65); rock(6.8, -2.6, 1.5, 0.85); rock(1.2, -3.4, 0.7, 0.8); rock(-1.8, 0.8, 0.45, 0.6);

  /* Tronco con musgo */
  const woodMat = addCaustics(new THREE.MeshStandardMaterial({ color: 0x5a3e28, roughness: 0.85 }), shared, 0.18, 2.6);
  const branch = (pts, r0) => {
    const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
    const g = new THREE.TubeGeometry(curve, 48, r0, 10, false), pos = g.attributes.position;
    // afinar hacia la punta
    const segs = 48, radial = 11;
    for (let i = 0; i <= segs; i++) {
      const k = 1 - (i / segs) * 0.75, c = curve.getPointAt(i / segs);
      for (let j = 0; j < radial; j++) {
        const idx = i * radial + j; if (idx >= pos.count) continue;
        const v = new THREE.Vector3(pos.getX(idx), pos.getY(idx), pos.getZ(idx)).sub(c).multiplyScalar(k).add(c);
        pos.setXYZ(idx, v.x, v.y, v.z);
      }
    }
    g.computeVertexNormals(); scene.add(new THREE.Mesh(g, woodMat));
    return curve;
  };
  const trunk = branch([[-3.6, 0.1, -1.4], [-2.2, 0.8, -1.8], [-1.0, 2.3, -2.4], [-0.2, 4.0, -2.9], [0.3, 5.4, -3.2]], 0.34);
  branch([[-1.2, 2.1, -2.3], [0.4, 2.8, -2.0], [1.8, 3.9, -2.2], [2.6, 4.6, -2.5]], 0.18);
  branch([[-2.6, 0.6, -1.6], [-4.0, 1.3, -2.2], [-5.0, 2.4, -2.8]], 0.16);
  {
    const mossMat = new THREE.MeshStandardMaterial({ color: 0x3f6a2c, roughness: 1 });
    const mg = new THREE.IcosahedronGeometry(0.045, 0);
    const moss = new THREE.InstancedMesh(mg, mossMat, 900), m4 = new THREE.Matrix4(), q = new THREE.Quaternion();
    for (let i = 0; i < 900; i++) {
      const p = trunk.getPointAt(Math.random() * 0.85);
      m4.compose(new THREE.Vector3(p.x + rnd(-0.26, 0.26), p.y + rnd(0.12, 0.3), p.z + rnd(-0.26, 0.26)), q.setFromEuler(new THREE.Euler(rnd(0, 3), rnd(0, 3), 0)), new THREE.Vector3(1, 1, 1).multiplyScalar(rnd(0.6, 1.4)));
      moss.setMatrixAt(i, m4);
    }
    scene.add(moss);
  }

  /* ---------- Plantas con movimiento en el shader ---------- */
  function swayMaterial(colorLow, colorHigh, amp, opts = {}) {
    const m = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide, roughness: 0.6, metalness: 0, ...opts });
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = shared.uTime; shader.uniforms.uLow = { value: new THREE.Color(colorLow) }; shader.uniforms.uHigh = { value: new THREE.Color(colorHigh) }; shader.uniforms.uAmp = { value: amp };
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nattribute float aPhase; attribute float aHue; uniform float uTime; uniform float uAmp; varying float vH; varying float vHue;')
        .replace('#include <begin_vertex>', `#include <begin_vertex>
          vH = uv.y; vHue = aHue;
          float bend = uv.y * uv.y;
          transformed.x += sin(uTime * 0.7 + aPhase + uv.y * 2.0) * uAmp * bend;
          transformed.z += cos(uTime * 0.55 + aPhase * 1.3 + uv.y * 1.5) * uAmp * 0.6 * bend;`);
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform vec3 uLow; uniform vec3 uHigh; varying float vH; varying float vHue;')
        .replace('#include <color_fragment>', '#include <color_fragment>\n  diffuseColor.rgb *= mix(uLow, uHigh, smoothstep(0.0, 1.0, vH)) * (0.85 + 0.3 * vHue);');
    };
    m.customProgramCacheKey = () => 'igsway' + colorLow + colorHigh + amp;
    return m;
  }
  function instanced(geo, mat, n, place) {
    const mesh = new THREE.InstancedMesh(geo, mat, n);
    const phase = new Float32Array(n), hue = new Float32Array(n), m4 = new THREE.Matrix4();
    for (let i = 0; i < n; i++) { place(m4, i); mesh.setMatrixAt(i, m4); phase[i] = rnd(0, TAU); hue[i] = Math.random(); }
    geo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phase, 1));
    geo.setAttribute('aHue', new THREE.InstancedBufferAttribute(hue, 1));
    scene.add(mesh); return mesh;
  }
  const Q = new THREE.Quaternion(), E = new THREE.Euler(), V = new THREE.Vector3(), SC = new THREE.Vector3();

  // Vallisneria (cintas largas al fondo)
  const valGeo = new THREE.PlaneGeometry(1, 1, 1, 14); valGeo.translate(0, 0.5, 0);
  { const p = valGeo.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i); p.setX(i, p.getX(i) * (1 - y * 0.7)); } }
  instanced(valGeo, swayMaterial(0x2e6a3a, 0x86c070, 0.9), 150, (m4, i) => {
    const x = rnd(-12, 12), z = rnd(-5.2, -3.2);
    m4.compose(V.set(x, 0, z), Q.setFromEuler(E.set(0, rnd(-0.8, 0.8), rnd(-0.08, 0.08))), SC.set(rnd(0.12, 0.2), rnd(4.5, 8.2), 1));
  });

  // Espadas del Amazonas (rosetas)
  const leafGeo = new THREE.PlaneGeometry(1, 1, 4, 10); leafGeo.translate(0, 0.5, 0);
  { const p = leafGeo.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i), x = p.getX(i); p.setX(i, x * Math.sin(Math.PI * Math.min(1, y * 1.05)) * 1.0); p.setZ(i, -y * y * 0.35 + Math.abs(x) * 0.08); } leafGeo.computeVertexNormals(); }
  const swordCenters = [[-7.8, -1.6], [4.6, -1.8], [8.9, -0.6], [-2.8, -0.2]];
  instanced(leafGeo, swayMaterial(0x2c6a34, 0x7fc062, 0.12), swordCenters.length * 16, (m4, i) => {
    const c = swordCenters[Math.floor(i / 16)], a = (i % 16) / 16 * TAU + rnd(-0.2, 0.2);
    Q.setFromEuler(E.set(rnd(0.35, 0.75), a, 0, 'YXZ'));
    m4.compose(V.set(c[0], 0, c[1]), Q, SC.set(rnd(0.45, 0.6), rnd(1.7, 2.6), 1));
  });

  // Plantas de tallo (hojitas en pares)
  const stemLeaf = new THREE.PlaneGeometry(0.34, 0.1, 2, 1);
  const stems = [[-9.6, -2.4, 1], [-6.6, -3.2, 0], [-0.8, -3.6, 1], [5.6, -3.0, 0], [9.8, -3.4, 1], [2.4, -2.8, 0], [-4.2, -3.8, 0]];
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x4a6a34, roughness: 0.8 });
  stems.forEach(([sx, sz, red]) => {
    const n = 3 + Math.floor(Math.random() * 3), perStem = 28;
    for (let s = 0; s < n; s++) {
      const hgt = 3.6 + s * 0.5, st = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.025, hgt, 5), red ? new THREE.MeshStandardMaterial({ color: 0x7a3a2a, roughness: 0.8 }) : stemMat);
      st.position.set(sx + s * 0.28 - n * 0.14, hgt / 2 + 0.1, sz + (s % 2) * 0.2); scene.add(st);
    }
    instanced(stemLeaf.clone(), swayMaterial(red ? 0x6a4a2a : 0x3a7a38, red ? 0xd8563e : 0x9ad26a, 0.35), n * perStem, (m4, i) => {
      const s = Math.floor(i / perStem), k = (i % perStem) / perStem;
      const hgt = rnd(3.2, 5.2) * 0 + (3.6 + s * 0.5) * k;
      Q.setFromEuler(E.set(0, (i % 2) * Math.PI + (i * 1.3) % 1 * 0.6, (i % 2 ? 1 : -1) * 0.35));
      m4.compose(V.set(sx + s * 0.28 - n * 0.14 + Math.sin(k * 5) * 0.05, 0.1 + hgt, sz + (s % 2) * 0.2), Q, SC.set(1 - k * 0.3, 1, 1));
    });
  });

  // Césped delante
  const bladeGeo = new THREE.PlaneGeometry(0.035, 1, 1, 3); bladeGeo.translate(0, 0.5, 0);
  instanced(bladeGeo, swayMaterial(0x2f6a30, 0x8ccd62, 0.05), 4200, (m4, i) => {
    const cl = Math.floor(i / 300), cx = -10 + cl * 1.6 + rnd(-0.6, 0.6), cz = rnd(0.2, 2.8);
    m4.compose(V.set(cx + rnd(-0.7, 0.7), -0.05, cz), Q.setFromEuler(E.set(rnd(-0.2, 0.2), rnd(0, TAU), rnd(-0.25, 0.25))), SC.set(1, rnd(0.18, 0.42), 1));
  });

  /* Haces de luz */
  const rayMat = new THREE.MeshBasicMaterial({ map: rayTexture(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, opacity: 0.22, side: THREE.DoubleSide });
  const rays = [];
  for (let i = 0; i < 7; i++) {
    const r = new THREE.Mesh(new THREE.PlaneGeometry(rnd(1.2, 2.4), 12), rayMat.clone());
    r.position.set(-10 + i * 3.3 + rnd(-0.6, 0.6), 4.2, rnd(-4, -1)); r.rotation.z = -0.25; r.userData.ph = rnd(0, TAU);
    scene.add(r); rays.push(r);
  }

  /* Superficie vista desde abajo */
  const surfMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
    uniforms: { uTime: shared.uTime },
    vertexShader: 'varying vec3 vW; void main(){ vW = (modelMatrix * vec4(position,1.0)).xyz; gl_Position = projectionMatrix * viewMatrix * vec4(vW,1.0); }',
    fragmentShader: `uniform float uTime; varying vec3 vW;
      ${'' /* reutiliza el patrón */}
      float c2(vec2 p, float t){ vec2 q = p + 0.6*vec2(sin(p.y*1.3+t*0.8), sin(p.x*1.1-t*0.6)); float s = sin(q.x*2.0)+sin(q.y*2.0)+sin((q.x+q.y)*1.4+t*0.5); float c = 1.0 - smoothstep(0.0,0.6,abs(s)); return c*c; }
      void main(){ float c = c2(vW.xz*1.4, uTime*1.1); float fade = smoothstep(-8.0, 3.0, vW.z); gl_FragColor = vec4(vec3(0.75,0.9,1.0) * (0.06 + c*0.22) * fade, 1.0); }`
  });
  const surf = new THREE.Mesh(new THREE.PlaneGeometry(40, 14, 1, 1), surfMat); surf.rotation.x = Math.PI / 2; surf.position.set(0, TANK.yTop + 0.2, -1); scene.add(surf);

  /* Burbujas del difusor */
  const NB = 160, bubbleMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 16, 12), bubbleMaterial(), NB);
  const bubbles = []; for (let i = 0; i < NB; i++) bubbles.push({ y: rnd(0, 8.5), x: 0, z: 0, r: rnd(0.025, 0.07), v: rnd(0.9, 1.6), w: rnd(0, TAU) });
  scene.add(bubbleMesh);
  const stone = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.18, 20), new THREE.MeshStandardMaterial({ color: 0x565a5e, roughness: 0.9 }));
  stone.position.set(8.2, 0.25, -2.2); scene.add(stone);

  /* Partículas en suspensión */
  const NP = 500, ppos = new Float32Array(NP * 3);
  for (let i = 0; i < NP; i++) { ppos[i * 3] = rnd(-12, 12); ppos[i * 3 + 1] = rnd(0, 9); ppos[i * 3 + 2] = rnd(-5, 4); }
  const pgeo = new THREE.BufferGeometry(); pgeo.setAttribute('position', new THREE.BufferAttribute(ppos, 3));
  const motes = new THREE.Points(pgeo, new THREE.PointsMaterial({ color: 0xfffbe8, size: 0.035, transparent: true, opacity: 0.55, depthWrite: false }));
  scene.add(motes);

  /* ---------- Peces ---------- */
  const fish = [];
  function add(kind, x, y, z) {
    const f = makeFish(kind);
    f.pos = new THREE.Vector3(x, y, z); f.vel = new THREE.Vector3(rnd(-1, 1), 0, rnd(-0.3, 0.3));
    f.swim = rnd(0, TAU); f.wander = rnd(0, TAU); f.rest = 0;
    f.speed = { neon: 1.25, angel: 0.55, discus: 0.45, guppy: 0.95, cory: 0.35 }[kind] * rnd(0.85, 1.15);
    f.group.position.copy(f.pos); scene.add(f.group); fish.push(f); return f;
  }
  const schoolT = new THREE.Vector3(0, 4, -1), schoolC = new THREE.Vector3(0, 4, -1);
  for (let i = 0; i < 34; i++) add('neon', rnd(-3, 3), rnd(2.8, 5.4), rnd(-2.5, 1));
  add('angel', -3, 5, -1.5); add('angel', 2.5, 4.4, -0.8);
  add('discus', 4.5, 3.2, -1.2);
  for (let i = 0; i < 6; i++) add('guppy', rnd(-8, 8), rnd(5.5, 7.5), rnd(-2, 1.5));
  for (let i = 0; i < 4; i++) { const c = add('cory', rnd(-6, 6), 0.35, rnd(-0.5, 1.8)); c.vel.set(rnd(-0.3, 0.3), 0, 0); }

  const ORIGIN = new THREE.Vector3(), dirV = new THREE.Vector3(), TURN = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
  const tmpQ = new THREE.Quaternion(), tmpM = new THREE.Matrix4(), UP = new THREE.Vector3(0, 1, 0), desired = new THREE.Vector3(), sep = new THREE.Vector3();
  function steer(f, dt) {
    const p = f.pos, v = f.vel;
    desired.set(0, 0, 0);
    if (f.kind === 'neon') {
      desired.copy(schoolC).sub(p).multiplyScalar(0.18);
      // separación y alineación con vecinos
      sep.set(0, 0, 0); let n = 0; const ali = new THREE.Vector3();
      for (const o of fish) {
        if (o === f || o.kind !== 'neon') continue;
        const d = p.distanceTo(o.pos);
        if (d < 0.75) { sep.add(p.clone().sub(o.pos).multiplyScalar((0.75 - d) * 5)); }
        if (d < 1.4) { ali.add(o.vel); n++; }
      }
      desired.add(sep); if (n) desired.add(ali.multiplyScalar(0.4 / n));
    } else if (f.kind === 'cory') {
      if (f.rest > 0) { f.rest -= dt; v.multiplyScalar(0.92); return; }
      f.wander += rnd(-1, 1) * dt * 2;
      desired.set(Math.cos(f.wander), 0, Math.sin(f.wander) * 0.4);
      if (Math.random() < dt * 0.3) f.rest = rnd(1.5, 4);
    } else {
      f.wander += rnd(-1, 1) * dt * 0.9;
      desired.set(Math.cos(f.wander), Math.sin(f.wander * 0.7) * 0.25, Math.sin(f.wander * 0.6) * 0.35);
    }
    // límites del acuario
    const lim = TANK.x - 1.2;
    if (p.x > lim) desired.x -= (p.x - lim) * 2; if (p.x < -lim) desired.x += (-lim - p.x) * 2;
    const yMin = f.kind === 'cory' ? 0.3 : 1.4, yMax = f.kind === 'cory' ? 0.45 : TANK.yTop - 0.9;
    if (p.y > yMax) desired.y -= (p.y - yMax) * 2; if (p.y < yMin) desired.y += (yMin - p.y) * 2;
    if (p.z > TANK.zFront - 0.8) desired.z -= (p.z - TANK.zFront + 0.8) * 2; if (p.z < TANK.zBack + 1.2) desired.z += (TANK.zBack + 1.2 - p.z) * 2;
    desired.normalize().multiplyScalar(f.speed);
    v.lerp(desired, clamp(dt * 1.2, 0, 1));
    if (f.kind === 'cory') { v.y = 0; p.y = lerp(p.y, 0.38, 0.1); }
  }

  let t = 0, camSway = 0;
  function update(dt, k, reduced) {
    t += dt * k; shared.uTime.value = t;
    if (Math.random() < dt * k * 0.2) schoolT.set(rnd(-7, 7), rnd(2.4, 6.2), rnd(-3, 1));
    schoolC.lerp(schoolT, clamp(dt * k * 0.25, 0, 1));
    for (const f of fish) {
      steer(f, dt * k);
      f.pos.addScaledVector(f.vel, dt * k);
      f.group.position.copy(f.pos);
      const sp = f.vel.length();
      if (sp > 0.02) {
        dirV.copy(f.vel).normalize(); dirV.y = clamp(dirV.y, -0.35, 0.35); dirV.normalize();
        tmpM.lookAt(ORIGIN, dirV, UP);
        tmpQ.setFromRotationMatrix(tmpM).multiply(TURN);            // el modelo mira hacia +X
        f.group.quaternion.slerp(tmpQ, clamp(dt * k * 2.5, 0, 1));
      }
      f.swim += dt * k * (5 + sp * 6);
      f.animate(f.swim, 0.06 + Math.min(0.12, sp * 0.08));
    }
    // burbujas
    for (let i = 0; i < NB; i++) {
      const b = bubbles[i]; b.y += b.v * dt * k; if (b.y > TANK.yTop) { b.y = 0.3; b.w = rnd(0, TAU); }
      b.x = stone.position.x + Math.sin(b.y * 2.2 + b.w) * 0.12 * (0.3 + b.y * 0.08); b.z = stone.position.z + Math.cos(b.y * 1.7 + b.w) * 0.1;
      const s = b.r * (1 + b.y * 0.04);
      tmpM.makeScale(s, s * 0.9, s).setPosition(b.x, b.y, b.z); bubbleMesh.setMatrixAt(i, tmpM);
    }
    bubbleMesh.instanceMatrix.needsUpdate = true;
    const pp = pgeo.attributes.position;
    for (let i = 0; i < NP; i++) { let y = pp.getY(i) + Math.sin(t * 0.3 + i) * 0.002 * k; pp.setY(i, y); pp.setX(i, pp.getX(i) + Math.cos(t * 0.2 + i * 0.7) * 0.0015 * k); }
    pp.needsUpdate = true;
    rays.forEach((r) => { r.material.opacity = 0.14 + Math.sin(t * 0.35 + r.userData.ph) * 0.08; r.position.x += Math.sin(t * 0.1 + r.userData.ph) * 0.002; });
    if (!reduced) { camSway += dt * 0.08; camera.position.x = Math.sin(camSway) * 0.6; camera.position.y = 4.3 + Math.sin(camSway * 0.7) * 0.15; camera.lookAt(lookAt); }
  }

  function setWater(name) {
    const w = WATERS[name] || WATERS.blue; if (w === water) return; water = w;
    scene.fog.color.set(w.fog); bgMat.uniforms.uTop.value.set(w.top); bgMat.uniforms.uDeep.value.set(w.deep);
    shared.uCausColor.value.setRGB(...w.caus); hemi.color.set(w.hemi); sun.color.set(w.sun);
  }
  setWater('blue'); water = null; setWater('blue');

  // calentar: repartir peces antes del primer fotograma
  for (let i = 0; i < 90; i++) update(1 / 30, 1, true);

  return {
    scene, camera, update, setWater,
    resize(w, h) { camera.aspect = w / Math.max(1, h); camera.fov = camera.aspect < 1.2 ? 55 : 40; camera.updateProjectionMatrix(); }
  };
}
