import * as THREE from 'three';
import { TAU, rnd, clamp, canvasTexture, bubbleMaterial } from './common.js';

const COLORS = { blue: 0x3aa8ff, green: 0x38e0a6, violet: 0xa27bff };

/* Tubo de burbujas de sala sensorial: habitación en penumbra, columna de agua
   iluminada desde la base y burbujas que suben despacio. */
export function createBubbleTube(canvas, renderer) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070b16);
  const camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.1, 60);
  camera.position.set(0, 4.4, 15); camera.lookAt(0, 4.3, 0);

  const uColor = { value: new THREE.Color(COLORS.blue) };
  const uTime = { value: 0 };

  // Pared y suelo con el reflejo de la luz
  const glowTex = canvasTexture(256, 256, (c, W, H) => {
    const g = c.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
  }, false);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(40, 20), new THREE.MeshStandardMaterial({ color: 0x151a26, roughness: 0.95 }));
  wall.position.set(0, 8, -4); scene.add(wall);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 20), new THREE.MeshStandardMaterial({ color: 0x0e1119, roughness: 0.55, metalness: 0.1 }));
  floor.rotation.x = -Math.PI / 2; scene.add(floor);
  const wallGlow = new THREE.Mesh(new THREE.PlaneGeometry(12, 16), new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.35 }));
  wallGlow.position.set(0, 5, -3.95); scene.add(wallGlow);
  const floorGlow = new THREE.Mesh(new THREE.PlaneGeometry(9, 5), new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.55 }));
  floorGlow.rotation.x = -Math.PI / 2; floorGlow.position.y = 0.01; scene.add(floorGlow);

  const light = new THREE.PointLight(COLORS.blue, 30, 18, 1.6); light.position.set(0, 1.2, 0.5); scene.add(light);
  const light2 = new THREE.PointLight(COLORS.blue, 12, 14, 1.6); light2.position.set(0, 6, 0.8); scene.add(light2);
  scene.add(new THREE.AmbientLight(0x223044, 0.6));

  const R = 1.05, H = 8.4, Y0 = 0.7;
  // Agua iluminada
  const waterMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uColor, uTime },
    vertexShader: 'varying vec3 vP; varying vec3 vN; varying vec3 vV; void main(){ vP = position; vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
    fragmentShader: `uniform vec3 uColor; uniform float uTime; varying vec3 vP; varying vec3 vN; varying vec3 vV;
      void main(){
        float h = (vP.y + ${(H / 2).toFixed(2)}) / ${H.toFixed(2)};
        float fall = mix(1.0, 0.35, pow(h, 0.8));
        float facing = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);
        float core = pow(facing, 1.6);
        float ripple = 0.9 + 0.1 * sin(vP.y * 3.0 - uTime * 1.5 + vP.x * 4.0);
        vec3 c = uColor * (0.25 + core * 1.1) * fall * ripple;
        gl_FragColor = vec4(c, 0.78);
      }`
  });
  const waterM = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.96, R * 0.96, H, 64, 1, true), waterMat);
  waterM.position.y = Y0 + H / 2; scene.add(waterM);
  // Vidrio: bordes brillantes y reflejo
  const glassMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uColor },
    vertexShader: 'varying vec3 vN; varying vec3 vV; varying vec3 vP; void main(){ vP = position; vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
    fragmentShader: `uniform vec3 uColor; varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main(){ float f = 1.0 - clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);
        float rim = pow(f, 3.0) * 0.9;
        float streak = smoothstep(0.62, 0.7, vN.x) * (1.0 - smoothstep(0.7, 0.8, vN.x)) * 0.35 + smoothstep(-0.5,-0.45,vN.x)*(1.0-smoothstep(-0.45,-0.4,vN.x))*0.15;
        gl_FragColor = vec4(vec3(rim) * mix(vec3(1.0), uColor, 0.4) + vec3(streak), 1.0); }`
  });
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(R, R, H, 64, 1, true), glassMat);
  glass.position.y = Y0 + H / 2; scene.add(glass);
  // Base y tapa
  const metal = new THREE.MeshStandardMaterial({ color: 0x1b1f28, roughness: 0.35, metalness: 0.8 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.35, R * 1.45, Y0, 48), metal); base.position.y = Y0 / 2; scene.add(base);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.12, R * 1.12, 0.3, 48), metal); cap.position.y = Y0 + H + 0.15; scene.add(cap);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(R * 1.02, 0.05, 12, 64), new THREE.MeshBasicMaterial({ color: COLORS.blue }));
  ring.rotation.x = Math.PI / 2; ring.position.y = Y0 + 0.02; scene.add(ring);

  // Burbujas en racimos
  const NB = 220, bmat = bubbleMaterial();
  const bmesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 20, 14), bmat, NB); scene.add(bmesh);
  const bubbles = [];
  function spawn(b, y) {
    const a = rnd(0, TAU), rr = Math.sqrt(Math.random()) * R * 0.55;
    b.x = Math.cos(a) * rr; b.z = Math.sin(a) * rr; b.y = y ?? Y0 + rnd(0, 0.3);
    b.r = Math.random() < 0.15 ? rnd(0.16, 0.28) : rnd(0.04, 0.12); b.v = 0.9 + (0.3 - b.r) * 1.8; b.w = rnd(0, TAU);
  }
  for (let i = 0; i < NB; i++) { const b = {}; spawn(b, Y0 + rnd(0, H)); bubbles.push(b); }
  const M = new THREE.Matrix4();

  let t = 0;
  function update(dt, k) {
    t += dt * k; uTime.value = t;
    for (let i = 0; i < NB; i++) {
      const b = bubbles[i];
      b.y += b.v * dt * k;
      if (b.y > Y0 + H - b.r) spawn(b);
      const x = b.x + Math.sin(b.y * 1.6 + b.w) * 0.12, z = b.z + Math.cos(b.y * 1.3 + b.w) * 0.1;
      const wob = 1 + Math.sin(t * 6 + b.w) * 0.06;
      M.makeScale(b.r * wob, b.r / wob * 0.92, b.r * wob).setPosition(clamp(x, -R * 0.8, R * 0.8), b.y, clamp(z, -R * 0.8, R * 0.8));
      bmesh.setMatrixAt(i, M);
    }
    bmesh.instanceMatrix.needsUpdate = true;
    const pulse = 0.9 + Math.sin(t * 0.6) * 0.1;
    light.intensity = 30 * pulse; wallGlow.material.opacity = 0.32 * pulse;
  }
  function setColor(name) {
    const c = COLORS[name] || COLORS.blue;
    uColor.value.set(c); light.color.set(c); light2.color.set(c); ring.material.color.set(c);
    wallGlow.material.color.set(c); floorGlow.material.color.set(c); bmat.uniforms.uTint.value.set(c).lerp(new THREE.Color(1, 1, 1), 0.55);
  }
  setColor('blue');
  for (let i = 0; i < 30; i++) update(1 / 30, 1);
  return {
    scene, camera, update, setWater: setColor,
    resize(w, h) { camera.aspect = w / Math.max(1, h); camera.fov = camera.aspect < 1.2 ? 60 : 38; camera.updateProjectionMatrix(); }
  };
}
