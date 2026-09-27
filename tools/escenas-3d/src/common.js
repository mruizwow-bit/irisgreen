import * as THREE from 'three';

export const TAU = Math.PI * 2;
export const rnd = (a, b) => a + Math.random() * (b - a);
export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

/* Patrón de luz del agua (propio): senos con deformación de dominio, en crestas finas. */
export const CAUSTIC_GLSL = /* glsl */`
float igCaustic(vec2 p, float t){
  vec2 q = p;
  q += 0.60 * vec2(sin(p.y * 1.30 + t * 0.80), sin(p.x * 1.10 - t * 0.60));
  q += 0.30 * vec2(sin(q.y * 2.70 - t * 1.10), sin(q.x * 2.30 + t * 0.90));
  float s = sin(q.x * 2.0) + sin(q.y * 2.0) + sin((q.x + q.y) * 1.4 + t * 0.5);
  float c = 1.0 - smoothstep(0.0, 0.45, abs(s));
  return c * c * c;
}`;

/* Añade luz del agua animada a un material estándar. */
export function addCaustics(material, uniforms, strength = 1.0, scale = 0.55) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uCausColor = uniforms.uCausColor;
    shader.uniforms.uCausK = { value: strength };
    shader.uniforms.uCausScale = { value: scale };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vIgW;\nvarying vec3 vIgN;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvIgW = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvIgN = normalize(mat3(modelMatrix) * objectNormal);');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uTime; uniform vec3 uCausColor; uniform float uCausK; uniform float uCausScale;\nvarying vec3 vIgW; varying vec3 vIgN;\n' + CAUSTIC_GLSL)
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n  float igUp = clamp(vIgN.y * 0.8 + 0.2, 0.0, 1.0);\n  totalEmissiveRadiance += uCausColor * igCaustic(vIgW.xz * uCausScale + vIgW.y * 0.15, uTime) * uCausK * igUp;');
  };
  material.customProgramCacheKey = () => 'igcaus' + strength + '_' + scale;
  return material;
}

export function canvasTexture(w, h, paint, srgb = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d'); paint(ctx, w, h);
  const tex = new THREE.CanvasTexture(c);
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/* Ruido de valor 3D barato para deformar rocas y arena. */
function hash3(x, y, z) { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); }
export function noise3(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  let r = 0;
  for (let dx = 0; dx < 2; dx++) for (let dy = 0; dy < 2; dy++) for (let dz = 0; dz < 2; dz++) {
    const h = hash3(xi + dx, yi + dy, zi + dz);
    r += h * (dx ? u : 1 - u) * (dy ? v : 1 - v) * (dz ? w : 1 - w);
  }
  return r;
}
export function fbm3(x, y, z, oct = 4) { let a = 0.5, s = 0; for (let i = 0; i < oct; i++) { s += a * noise3(x, y, z); x *= 2.03; y *= 2.03; z *= 2.03; a *= 0.5; } return s; }

/* Burbuja: esfera con brillo en el borde y un reflejo. */
export function bubbleMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTint: { value: new THREE.Color(0.85, 0.95, 1.0) }, uOpacity: { value: 1 } },
    vertexShader: /* glsl */`
      varying vec3 vN; varying vec3 vV;
      void main(){
        vec4 mv = modelViewMatrix * instanceMatrix * vec4(position,1.0);
        vN = normalize(normalMatrix * mat3(instanceMatrix) * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      uniform vec3 uTint; uniform float uOpacity;
      varying vec3 vN; varying vec3 vV;
      void main(){
        float f = 1.0 - clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);
        float rim = pow(f, 2.2);
        vec3 l = normalize(vec3(-0.4, 0.7, 0.6));
        float spec = pow(max(dot(reflect(-l, normalize(vN)), normalize(vV)), 0.0), 40.0);
        vec3 c = uTint * (rim * 0.9 + 0.04) + vec3(spec * 1.4);
        gl_FragColor = vec4(c * uOpacity, 1.0);
      }`
  });
}

/* Haz de luz vertical con degradado. */
export function rayTexture() {
  return canvasTexture(64, 256, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(255,255,240,0.55)'); g.addColorStop(0.6, 'rgba(255,255,240,0.18)'); g.addColorStop(1, 'rgba(255,255,240,0)');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    const s = c.getImageData(0, 0, w, h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const k = Math.sin(Math.PI * x / (w - 1)); const i = (y * w + x) * 4 + 3; s.data[i] = s.data[i] * k * k;
    }
    c.putImageData(s, 0, 0);
  });
}

export function makeRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'low-power' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  return renderer;
}

/* Ruido 2D/3D en GLSL (propio, valor + fbm) para cielo, agua y auroras. */
export const NOISE_GLSL = /* glsl */`
float igH2(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float igN2(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(igH2(i), igH2(i + vec2(1.0, 0.0)), u.x), mix(igH2(i + vec2(0.0, 1.0)), igH2(i + vec2(1.0, 1.0)), u.x), u.y); }
float igF2(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++){ s += a * igN2(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return s; }
`;
