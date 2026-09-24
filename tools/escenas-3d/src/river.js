import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { NOISE_GLSL, rnd, TAU, fbm3, rayTexture, canvasTexture } from './common.js';

/* Río en el bosque: agua que corre entre piedras, hierba que se mece, árboles, luz entre las hojas
   y alguna hoja que cae y se va con la corriente. */
const MOODS = {
  blue:   { skyT: 0x8fb9d8, skyH: 0xdbe7e2, fog: 0xa9c3c2, sun: 0xfff1d6, leaf: [0x2f6b3a, 0x3f7d3f, 0x4f8a45, 0x2a5e3c], grass: [0.24, 0.45, 0.20], water: [0.05, 0.20, 0.19], fall: 0x9c8a3c },
  green:  { skyT: 0x7fb6e0, skyH: 0xe8f0dc, fog: 0xb9d0b0, sun: 0xfff6dc, leaf: [0x3b7d32, 0x4e9a3a, 0x5eaa44, 0x2f6a2e], grass: [0.30, 0.55, 0.22], water: [0.06, 0.22, 0.16], fall: 0x8faa3c },
  violet: { skyT: 0x6b5f9e, skyH: 0xf1c7a8, fog: 0xc7a7a4, sun: 0xffd2a0, leaf: [0xb85c2a, 0xd08a33, 0x9e3f2a, 0x7a6a2a], grass: [0.42, 0.40, 0.20], water: [0.10, 0.14, 0.20], fall: 0xd07a2a }
};
const cx = (z) => 1.3 * Math.sin(z * 0.09) + 0.5 * Math.sin(z * 0.23 + 1.0);   // centro del cauce
const HALF = 2.4;                                                            // medio ancho del agua

export function createRiver(canvas, renderer) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 300);
  camera.position.set(0, 1.7, 9.5); camera.lookAt(0, 0.2, -12);
  let mood = MOODS.blue, moodName = 'blue';
  scene.fog = new THREE.Fog(mood.fog, 18, 75);
  const uT = { value: 0 };

  const skyU = { uTop: { value: new THREE.Color(mood.skyT) }, uHor: { value: new THREE.Color(mood.skyH) } };
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(200, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false, uniforms: skyU,
    vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform vec3 uTop; uniform vec3 uHor; varying vec3 vD; void main(){ gl_FragColor = vec4(mix(uHor, uTop, smoothstep(0.0, 0.5, vD.y)), 1.0); }'
  })));
  const hemi = new THREE.HemisphereLight(0xdfeee0, 0x3a4a2a, 1.1); scene.add(hemi);
  const sun = new THREE.DirectionalLight(mood.sun, 1.6); sun.position.set(-8, 14, -6); scene.add(sun);

  // Terreno: orillas con hierba y cauce de piedras
  const tGeo = new THREE.PlaneGeometry(70, 90, 180, 220); tGeo.rotateX(-Math.PI / 2); tGeo.translate(0, 0, -30);
  const col = new Float32Array(tGeo.attributes.position.count * 3);
  function heightAt(x, z) {
    const d = Math.abs(x - cx(z));
    const bank = THREE.MathUtils.smoothstep(d, HALF - 0.4, HALF + 2.8) * 1.1 + THREE.MathUtils.smoothstep(d, 6, 22) * 3.5;
    const n = (fbm3(x * 0.25, 0, z * 0.25) - 0.5) * (0.4 + THREE.MathUtils.smoothstep(d, 3, 10) * 1.2);
    const bed = d < HALF ? -0.35 + (d / HALF) * 0.2 : 0;
    return bank + n + bed;
  }
  {
    const p = tGeo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i), y = heightAt(x, z); p.setY(i, y);
      const d = Math.abs(x - cx(z)), g = THREE.MathUtils.smoothstep(d, HALF + 0.2, HALF + 1.4), v = 0.7 + fbm3(x * 0.6, 1, z * 0.6, 3) * 0.55;
      const stone = [0.2 * v, 0.19 * v, 0.15 * v], grass = mood.grass.map((c) => c * v);
      for (let k = 0; k < 3; k++) col[i * 3 + k] = stone[k] + (grass[k] - stone[k]) * g;
    }
    tGeo.setAttribute('color', new THREE.BufferAttribute(col, 3)); tGeo.computeVertexNormals();
  }
  const terrain = new THREE.Mesh(tGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 })); scene.add(terrain);
  function recolor() {
    const p = tGeo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i), d = Math.abs(x - cx(z)), g = THREE.MathUtils.smoothstep(d, HALF + 0.2, HALF + 1.4), v = 0.7 + fbm3(x * 0.6, 1, z * 0.6, 3) * 0.55;
      const stone = [0.2 * v, 0.19 * v, 0.15 * v], grass = mood.grass.map((c) => c * v);
      for (let k = 0; k < 3; k++) col[i * 3 + k] = stone[k] + (grass[k] - stone[k]) * g;
    }
    tGeo.attributes.color.needsUpdate = true;
  }

  // Piedras en el agua y en la orilla
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x7a776c, roughness: 0.85 });
  const mossMat = new THREE.MeshStandardMaterial({ color: 0x5b6a3a, roughness: 0.95 });
  const rocksU = [];
  function rock(x, z, s, sy, moss) {
    const g = mergeVertices(new THREE.IcosahedronGeometry(1, 4)), p = g.attributes.position, seed = rnd(0, 50);
    for (let i = 0; i < p.count; i++) {
      const v = new THREE.Vector3(p.getX(i), p.getY(i), p.getZ(i));
      v.multiplyScalar(0.75 + fbm3(v.x * 1.3 + seed, v.y * 1.3, v.z * 1.3, 4) * 0.55); v.y *= sy; p.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    const inW = Math.abs(x - cx(z)) < HALF; const m = new THREE.Mesh(g, moss ? mossMat : rockMat); m.position.set(x, inW ? -0.3 : heightAt(x, z) - 0.1, z); m.scale.setScalar(s); m.rotation.y = rnd(0, TAU); scene.add(m);
    return m;
  }
  [[0.4, 3.0, 0.45], [-1.2, -1.5, 0.6], [1.6, -5.5, 0.5], [0.2, -9.0, 0.7], [-0.9, -14, 0.55], [1.5, 1.0, 0.3]].forEach(([dx, z, s]) => {
    const x = cx(z) + dx; rock(x, z, s, 0.55, false); rocksU.push(new THREE.Vector3(x, z, s));
  });
  for (let i = 0; i < 16; i++) { const z = rnd(-40, 7), side = i % 2 ? 1 : -1; rock(cx(z) + side * rnd(HALF + 0.1, HALF + 1.2), z, rnd(0.3, 0.8), 0.6, Math.random() < 0.5); }

  // Agua
  const wGeo = new THREE.PlaneGeometry(1, 1, 30, 200); wGeo.rotateX(-Math.PI / 2);
  {
    const p = wGeo.attributes.position;
    for (let i = 0; i < p.count; i++) { const u = p.getX(i), v = p.getZ(i); const z = 9 - (v + 0.5) * 70; p.setXYZ(i, cx(z) + u * (HALF * 2 + 0.6), -0.12, z); }
    wGeo.computeVertexNormals();
  }
  const WU = {
    uT, uWater: { value: new THREE.Vector3(...mood.water) }, uSky: { value: new THREE.Color(mood.skyH) }, uSun: { value: new THREE.Color(mood.sun) },
    uRocks: { value: rocksU.map((r) => new THREE.Vector3(r.x, r.y, r.z)) }, uFogC: { value: new THREE.Color(mood.fog) }
  };
  const water = new THREE.Mesh(wGeo, new THREE.ShaderMaterial({
    uniforms: WU, transparent: true, side: THREE.DoubleSide, depthWrite: false,
    vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: NOISE_GLSL + /* glsl */`
      uniform float uT; uniform vec3 uWater; uniform vec3 uSky; uniform vec3 uSun; uniform vec3 uRocks[6]; uniform vec3 uFogC;
      varying vec3 vW;
      void main(){
        vec2 q = vec2(vW.x * 1.6, vW.z * 0.9 - uT * 1.1);     // la corriente viene hacia ti
        vec2 q2 = vec2(vW.x * 3.1 + 5.0, vW.z * 1.7 - uT * 1.6);
        float h1 = igF2(q), h2 = igN2(q2);
        vec3 n = normalize(vec3((igF2(q + vec2(0.05, 0.0)) - h1) * 6.0 + (h2 - 0.5) * 0.3, 1.0, (igF2(q + vec2(0.0, 0.05)) - h1) * 6.0));
        vec3 V = normalize(cameraPosition - vW);
        float fres = 0.04 + 0.96 * pow(1.0 - max(dot(n, V), 0.0), 5.0);
        vec3 c = mix(uWater, uSky, clamp(fres, 0.0, 0.55));
        vec3 L = normalize(vec3(-0.45, 0.8, -0.35));
        c += uSun * pow(max(dot(reflect(-L, n), V), 0.0), 120.0) * 1.6;
        float foam = 0.0;
        for (int i = 0; i < 6; i++){
          vec3 r = uRocks[i];
          float d = length((vW.xz - r.xy) * vec2(1.0, 0.6)) - r.z * 0.9;
          float tail = smoothstep(0.0, 2.5, vW.z - r.y) * smoothstep(3.5, 0.0, vW.z - r.y) * smoothstep(r.z * 1.2, 0.0, abs(vW.x - r.x));
          foam += smoothstep(0.25, 0.0, d) * 0.8 + tail * 0.3;
        }
        foam *= 0.55 + 0.45 * igN2(q2 * 2.0);
        c = mix(c, vec3(0.92, 0.96, 0.96), clamp(foam, 0.0, 0.8));
        float a = mix(0.42, 0.9, fres) + foam * 0.35;
        float fogK = smoothstep(18.0, 75.0, length(vW - cameraPosition));
        c = mix(c, uFogC, fogK);
        gl_FragColor = vec4(c, clamp(a, 0.0, 1.0));
      }`
  }));
  water.renderOrder = 2; scene.add(water);

  // Hierba que se mece
  const blade = new THREE.PlaneGeometry(0.04, 0.42, 1, 4); blade.translate(0, 0.21, 0);
  { const p = blade.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i) / 0.42; p.setX(i, p.getX(i) * (1 - y * 0.9)); } }
  const grassU = { uT, uCol: { value: new THREE.Vector3(...mood.grass) }, uFogC: { value: new THREE.Color(mood.fog) } };
  const NG = 22000;
  const grass = new THREE.InstancedMesh(blade, new THREE.ShaderMaterial({
    side: THREE.DoubleSide, uniforms: grassU,
    vertexShader: /* glsl */`
      uniform float uT; varying float vY; varying float vS; varying float vF;
      void main(){
        vec3 p = position; vY = uv.y;
        vec4 w0 = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0); vS = fract(w0.x * 13.1 + w0.z * 7.3);
        float sway = sin(uT * 1.1 + w0.x * 0.7 + w0.z * 0.5) * 0.12 + sin(uT * 2.3 + w0.z) * 0.04;
        vec4 w = instanceMatrix * vec4(p, 1.0);
        w.x += sway * vY * vY; w.z += sway * 0.5 * vY * vY;
        vec4 ww = modelMatrix * w; vF = smoothstep(18.0, 75.0, length(ww.xyz - cameraPosition));
        gl_Position = projectionMatrix * viewMatrix * ww;
      }`,
    fragmentShader: 'uniform vec3 uCol; uniform vec3 uFogC; varying float vY; varying float vS; varying float vF; void main(){ vec3 c = uCol * (0.55 + vY * 0.7) * (0.85 + vS * 0.3); gl_FragColor = vec4(mix(c, uFogC, vF), 1.0); }'
  }), NG);
  {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), pos = new THREE.Vector3();
    let n = 0;
    while (n < NG) {
      const z = 9 - Math.pow(Math.random(), 1.6) * 44, x = rnd(-13, 13), d = Math.abs(x - cx(z));
      if (d < HALF + 0.3) continue;
      pos.set(x, heightAt(x, z) - 0.02, z); q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rnd(0, TAU));
      const k = rnd(0.6, 1.2) * (d < HALF + 1.5 ? 1.25 : 1); s.set(k, k * rnd(0.6, 1.4), k);
      m.compose(pos, q, s); grass.setMatrixAt(n++, m);
    }
  }
  scene.add(grass);

  // Árboles: tronco y copa hecha de muchas «tarjetas» de hojas (textura dibujada aquí)
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3a2c, roughness: 0.95 });
  const trunkGeo = new THREE.CylinderGeometry(0.1, 0.2, 1, 10, 4); trunkGeo.translate(0, 0.5, 0);
  { const p = trunkGeo.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i); p.setX(i, p.getX(i) + Math.sin(y * 3.0) * 0.03); } trunkGeo.computeVertexNormals(); }
  function leafTexture(cols) {
    return canvasTexture(256, 256, (c, W, H) => {
      c.clearRect(0, 0, W, H);
      for (let i = 0; i < 260; i++) {
        const a = Math.random() * TAU, r = Math.sqrt(Math.random()) * 105, x = W / 2 + Math.cos(a) * r, y = H / 2 + Math.sin(a) * r;
        c.save(); c.translate(x, y); c.rotate(rnd(0, TAU));
        c.fillStyle = cols[(Math.random() * cols.length) | 0]; c.globalAlpha = 1;
        c.beginPath(); c.ellipse(0, 0, rnd(7, 12), rnd(3.5, 6), 0, 0, TAU); c.fill();
        c.fillStyle = 'rgba(255,255,255,0.12)'; c.beginPath(); c.ellipse(-2, -1, rnd(3, 5), 1.5, 0, 0, TAU); c.fill();
        c.restore();
      }
    });
  }
  const hex = (n) => '#' + n.toString(16).padStart(6, '0');
  const leafTex = leafTexture(mood.leaf.map(hex));
  const cardMat = new THREE.MeshStandardMaterial({ map: leafTex, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.85 });
  const cardGeo = new THREE.PlaneGeometry(1, 1);
  const trees = [];
  for (let i = 0; i < 46; i++) { const z = rnd(-60, 4), side = i % 2 ? 1 : -1, x = cx(z) + side * rnd(HALF + 3, 20); trees.push([x, z, rnd(4.5, 9)]); }
  const PER = 70;
  const cards = new THREE.InstancedMesh(cardGeo, cardMat, trees.length * PER);
  const crowns = [];
  {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), sc = new THREE.Vector3(), pos = new THREE.Vector3(), colr = new THREE.Color();
    let n = 0;
    trees.forEach(([x, z, h]) => {
      const y0 = heightAt(x, z) - 0.1;
      const tr = new THREE.Mesh(trunkGeo, trunkMat); tr.position.set(x, y0, z); tr.scale.set(h * 0.17, h * 0.7, h * 0.17); scene.add(tr);
      const cy = y0 + h * 0.72, rx = h * 0.32, ry = h * 0.36;
      for (let k = 0; k < PER; k++) {
        const u = rnd(-1, 1), a = rnd(0, TAU), rr = Math.cbrt(Math.random());
        pos.set(x + Math.cos(a) * Math.sqrt(1 - u * u) * rx * rr, cy + u * ry * rr, z + Math.sin(a) * Math.sqrt(1 - u * u) * rx * rr);
        e.set(rnd(-0.6, 0.6), rnd(0, TAU), rnd(-0.6, 0.6)); q.setFromEuler(e);
        const s = h * rnd(0.26, 0.4); sc.set(s, s, s);
        m.compose(pos, q, sc); cards.setMatrixAt(n, m);
        const shade = 0.6 + 0.4 * (u * 0.5 + 0.5); colr.setRGB(shade, shade, shade); cards.setColorAt(n, colr);
        n++;
      }
    });
  }
  scene.add(cards);
  // Luz entre las hojas
  const rayTex = rayTexture();
  const rays = [];
  for (let i = 0; i < 5; i++) {
    const r = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 14), new THREE.MeshBasicMaterial({ map: rayTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.12, color: mood.sun, fog: false }));
    r.position.set(rnd(-6, 6), 5, rnd(-18, -4)); r.rotation.z = 0.45; r.rotation.y = rnd(-0.3, 0.3); scene.add(r); rays.push(r);
  }
  // Hojas que caen
  const NL = 24;
  const leafGeo = new THREE.PlaneGeometry(0.14, 0.09);
  const leafMat = new THREE.MeshStandardMaterial({ color: mood.fall, side: THREE.DoubleSide, roughness: 0.8 });
  const leaves = new THREE.InstancedMesh(leafGeo, leafMat, NL); scene.add(leaves);
  const L = [];
  function newLeaf(anyY) { const z = rnd(-25, 6); return { x: cx(z) + rnd(-6, 6), y: anyY ? rnd(0, 5) : rnd(4, 5.5), z, rx: rnd(0, TAU), ry: rnd(0, TAU), vx: rnd(-0.2, 0.2), onWater: false, ph: rnd(0, TAU) }; }
  for (let i = 0; i < NL; i++) L.push(newLeaf(true));
  const lm = new THREE.Matrix4(), lq = new THREE.Quaternion(), le = new THREE.Euler(), ls = new THREE.Vector3(1, 1, 1), lp = new THREE.Vector3();

  let t = 0;
  function update(dt, k, reduced) {
    t += dt * k; uT.value = t;
    const kd = dt * k;
    for (let i = 0; i < NL; i++) {
      const f = L[i];
      if (!f.onWater) {
        f.y -= kd * 0.45; f.x += Math.sin(t * 0.8 + f.ph) * kd * 0.3 + f.vx * kd; f.rx += kd * 1.2; f.ry += kd * 0.7;
        const d = Math.abs(f.x - cx(f.z)), ground = d < HALF ? -0.1 : heightAt(f.x, f.z);
        if (f.y <= ground + 0.02) { if (d < HALF) { f.onWater = true; f.y = -0.1; f.rx = -Math.PI / 2; } else L[i] = newLeaf(false); }
      } else {
        f.z += kd * 1.1; f.x += (cx(f.z) - f.x) * kd * 0.05 + Math.sin(t + f.ph) * kd * 0.1; f.ry += kd * 0.3;
        if (f.z > 10) L[i] = newLeaf(false);
      }
      le.set(f.rx, f.ry, 0); lq.setFromEuler(le); lp.set(f.x, f.y, f.z); lm.compose(lp, lq, ls); leaves.setMatrixAt(i, lm);
    }
    leaves.instanceMatrix.needsUpdate = true;
    rays.forEach((r, i) => { r.material.opacity = 0.09 + 0.04 * Math.sin(t * 0.2 + i * 1.7); });
    if (!reduced) { camera.position.x = Math.sin(t * 0.04) * 0.4; camera.lookAt(0, 0.2, -12); }
  }
  function setWater(name) {
    if (name === moodName) return; moodName = name; mood = MOODS[name] || MOODS.blue;
    skyU.uTop.value.set(mood.skyT); skyU.uHor.value.set(mood.skyH); scene.fog.color.set(mood.fog); sun.color.set(mood.sun);
    WU.uWater.value.set(...mood.water); WU.uSky.value.set(mood.skyH); WU.uSun.value.set(mood.sun); WU.uFogC.value.set(mood.fog);
    grassU.uCol.value.set(...mood.grass); grassU.uFogC.value.set(mood.fog); cardMat.map.dispose(); cardMat.map = leafTexture(mood.leaf.map(hex)); cardMat.needsUpdate = true; leafMat.color.set(mood.fall);
    rays.forEach((r) => r.material.color.set(mood.sun)); recolor();
  }
  update(0.016, 1, true);
  return {
    scene, camera, update, setWater,
    resize(w, h) { camera.aspect = w / Math.max(1, h); camera.fov = camera.aspect < 1.2 ? 70 : 50; camera.updateProjectionMatrix(); }
  };
}
