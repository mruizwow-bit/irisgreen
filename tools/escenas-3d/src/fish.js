import * as THREE from 'three';
import { TAU, clamp, smooth, canvasTexture, rnd } from './common.js';

/* ---------- Texturas del cuerpo ----------
   En la textura: la fila es la longitud (arriba = cabeza) y la columna da
   la altura en el costado: yn = cos(2πu) (1 lomo, -1 vientre). */
function bodyTexture(paint, w = 256, h = 256) {
  return canvasTexture(w, h, (c, W, H) => {
    const img = c.createImageData(W, H);
    for (let py = 0; py < H; py++) {
      const t = 1 - py / (H - 1);              // 1 cabeza … 0 cola
      for (let px = 0; px < W; px++) {
        const u = px / W, yn = Math.cos(u * TAU), side = Math.sin(u * TAU);
        const col = paint(t, yn, side, u);
        const i = (py * W + px) * 4;
        img.data[i] = col[0]; img.data[i + 1] = col[1]; img.data[i + 2] = col[2]; img.data[i + 3] = 255;
      }
    }
    c.putImageData(img, 0, 0);
  });
}
const mix = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const band = (x, a, b, soft) => smooth(a - soft, a + soft, x) * (1 - smooth(b - soft, b + soft, x));
function grain(t, yn, amp) { return (Math.sin(t * 310 + yn * 47) * Math.sin(t * 173 - yn * 91)) * amp; }

const PAINT = {
  neon: {
    color(t, yn) {
      let c = mix([228, 232, 226], [128, 138, 118], smooth(-0.2, 0.9, yn));      // vientre plateado → lomo oliva
      const red = band(yn, -0.72, -0.08, 0.07) * (1 - smooth(0.48, 0.56, t)) * smooth(0.04, 0.12, t);
      c = mix(c, [214, 38, 52], red * 0.95);
      const blue = band(yn, 0.08, 0.42, 0.06) * smooth(0.12, 0.22, t) * (1 - smooth(0.86, 0.94, t));
      c = mix(c, [40, 190, 255], blue);
      const g = grain(t, yn, 8); return [c[0] + g, c[1] + g, c[2] + g];
    },
    glow(t, yn) {
      const blue = band(yn, 0.08, 0.42, 0.06) * smooth(0.12, 0.22, t) * (1 - smooth(0.86, 0.94, t));
      const red = band(yn, -0.72, -0.08, 0.07) * (1 - smooth(0.48, 0.56, t)) * smooth(0.04, 0.12, t);
      return [20 + 20 * blue + 60 * red, 20 + 150 * blue, 20 + 230 * blue];
    }
  },
  angel: {
    color(t, yn) {
      let c = mix([232, 230, 214], [168, 166, 150], smooth(-0.3, 1, yn));
      const bars = band(t, 0.76, 0.82, 0.015) + band(t, 0.55, 0.63, 0.02) + band(t, 0.33, 0.4, 0.02) + band(t, 0.12, 0.17, 0.015) * 0.8;
      c = mix(c, [34, 32, 28], clamp(bars, 0, 1) * 0.85);
      const sheen = band(yn, 0.1, 0.5, 0.2) * 0.25;
      c = mix(c, [250, 250, 245], sheen);
      const g = grain(t, yn, 6); return [c[0] + g, c[1] + g, c[2] + g];
    }
  },
  discus: {
    color(t, yn) {
      let c = mix([214, 110, 48], [170, 72, 34], smooth(-0.6, 1, yn));
      const wave = Math.abs(Math.sin(yn * 11 + Math.sin(t * 13) * 1.2 + t * 4));
      c = mix(c, [60, 190, 200], (1 - smooth(0.05, 0.3, wave)) * 0.85);
      const bar = band(t, 0.74, 0.8, 0.02) * 0.35;
      c = mix(c, [60, 30, 20], bar);
      return c;
    }
  },
  guppy: {
    color(t, yn) {
      let c = mix([224, 222, 206], [132, 140, 118], smooth(-0.3, 0.9, yn));
      const spot = band(t, 0.18, 0.42, 0.05) * band(yn, -0.5, 0.5, 0.2);
      c = mix(c, [255, 150, 60], spot * 0.7);
      return c;
    }
  },
  cory: {
    color(t, yn) {
      let c = mix([236, 226, 204], [124, 116, 100], smooth(-0.6, 0.6, yn));
      const spots = (Math.sin(t * 60) * Math.sin(yn * 22 + t * 9)) > 0.55 ? 1 : 0;
      c = mix(c, [58, 52, 44], spots * 0.6 * smooth(-0.4, 0.2, yn));
      const g = grain(t, yn, 10); return [c[0] + g, c[1] + g, c[2] + g];
    }
  }
};

const TEX = {};
function speciesTextures(kind) {
  if (TEX[kind]) return TEX[kind];
  const p = PAINT[kind];
  TEX[kind] = { map: bodyTexture(p.color), emissive: p.glow ? bodyTexture(p.glow, 128, 128) : null };
  return TEX[kind];
}

/* Aleta: radios finos, más opaca en la base y transparente en el borde. */
let FIN_TEX = null;
function finTexture() {
  if (FIN_TEX) return FIN_TEX;
  FIN_TEX = canvasTexture(256, 256, (c, W, H) => {
    const g = c.createRadialGradient(0, H / 2, 0, 0, H / 2, W * 1.05);
    g.addColorStop(0, 'rgba(255,255,255,0.85)'); g.addColorStop(0.7, 'rgba(255,255,255,0.45)'); g.addColorStop(1, 'rgba(255,255,255,0.12)');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = 'destination-out';
    c.strokeStyle = 'rgba(0,0,0,0.35)'; c.lineWidth = 3;
    for (let i = 0; i < 22; i++) {
      const a = -1.2 + i * (2.4 / 21);
      c.beginPath(); c.moveTo(0, H / 2); c.lineTo(Math.cos(a) * W * 1.2, H / 2 + Math.sin(a) * W * 1.2); c.stroke();
    }
  });
  return FIN_TEX;
}

function shapeGeo(points, mirrorUV = true) {
  const s = new THREE.Shape();
  s.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    if (p.length === 4) s.quadraticCurveTo(p[0], p[1], p[2], p[3]); else s.lineTo(p[0], p[1]);
  }
  const g = new THREE.ShapeGeometry(s, 16);
  g.computeBoundingBox();
  const bb = g.boundingBox, uv = g.attributes.uv, pos = g.attributes.position;
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, (pos.getX(i) - bb.min.x) / (bb.max.x - bb.min.x || 1), (pos.getY(i) - bb.min.y) / (bb.max.y - bb.min.y || 1));
  }
  return g;
}

function finMaterial(color, opacity = 0.85) {
  return new THREE.MeshStandardMaterial({
    color, map: finTexture(), transparent: true, opacity, side: THREE.DoubleSide,
    roughness: 0.5, metalness: 0.0, depthWrite: false
  });
}

/* Perfil del cuerpo a lo largo (t: 0 cola … 1 cabeza) */
const PROFILES = {
  slim:   (t) => Math.pow(Math.sin(Math.PI * clamp(t * 1.02, 0, 1)), 0.72) * (0.16 + 0.84 * smooth(0.0, 0.34, t)),
  deep:   (t) => Math.pow(Math.sin(Math.PI * clamp(t, 0, 1)), 0.85) * (0.14 + 0.86 * smooth(0.0, 0.3, t)),
  round:  (t) => Math.sqrt(Math.max(0, 1 - Math.pow(2.05 * t - 1.08, 2))) * (0.14 + 0.86 * smooth(0.0, 0.18, t)),
  flat:   (t) => Math.pow(Math.sin(Math.PI * clamp(t * 1.02, 0, 1)), 0.6) * (0.2 + 0.8 * smooth(0.0, 0.3, t))
};

function bodyGeometry(len, height, width, profile, belly = 1) {
  const g = new THREE.SphereGeometry(1, 56, 36);
  g.rotateZ(-Math.PI / 2);                       // polos en X: cabeza en +X
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const t = (x + 1) / 2, p = profile(t);
    let yy = y * height * p;
    if (y < 0) yy *= belly;
    // cabeza algo más roma y morro ligeramente hacia arriba
    const nose = smooth(0.85, 1.0, t);
    pos.setXYZ(i, x * len / 2, yy + nose * height * 0.04, z * width * p * (0.55 + 0.45 * Math.sqrt(Math.max(0, 1 - y * y))));
  }
  g.computeVertexNormals();
  return g;
}

function bodyMaterial(tex, uniforms, len, opts) {
  const m = new THREE.MeshStandardMaterial({
    map: tex.map, roughness: opts.rough ?? 0.42, metalness: opts.metal ?? 0.08,
    emissiveMap: tex.emissive || null, emissive: tex.emissive ? new THREE.Color(1, 1, 1) : new THREE.Color(0, 0, 0),
    emissiveIntensity: tex.emissive ? 0.55 : 0
  });
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uSwim = uniforms.uSwim;
    shader.uniforms.uAmp = uniforms.uAmp;
    shader.uniforms.uHalf = { value: len / 2 };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uSwim; uniform float uAmp; uniform float uHalf;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        float xn = transformed.x / uHalf;
        float tail = clamp((0.45 - xn) / 1.45, 0.0, 1.0);
        transformed.z += sin(uSwim - xn * 2.6) * uAmp * uHalf * tail * tail;`);
  };
  m.customProgramCacheKey = () => 'igswim';
  return m;
}

function eyes(group, x, y, z, r) {
  const white = new THREE.MeshStandardMaterial({ color: 0xd9d2b8, roughness: 0.3, metalness: 0.2 });
  const black = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.05, metalness: 0.0 });
  const gw = new THREE.SphereGeometry(r, 16, 12), gb = new THREE.SphereGeometry(r * 0.62, 16, 12);
  [1, -1].forEach((s) => {
    const w = new THREE.Mesh(gw, white); w.position.set(x, y, z * s); w.scale.set(1, 1, 0.55); group.add(w);
    const b = new THREE.Mesh(gb, black); b.position.set(x + r * 0.08, y, z * s + s * r * 0.3); b.scale.set(1, 1, 0.6); group.add(b);
  });
}

/* ---------- Construcción de cada especie ---------- */
export function makeFish(kind) {
  const uniforms = { uSwim: { value: rnd(0, TAU) }, uAmp: { value: 0.12 } };
  const group = new THREE.Group();
  const tex = speciesTextures(kind);
  let len, h, w, profile, tail, finsColor, belly = 1, opts = {};
  if (kind === 'neon') { len = 0.72; h = 0.145; w = 0.085; profile = PROFILES.slim; finsColor = 0xd8e2e6; opts = { rough: 0.32, metal: 0.18 }; }
  else if (kind === 'angel') { len = 1.35; h = 0.62; w = 0.12; profile = PROFILES.deep; finsColor = 0xe8e6d8; opts = { rough: 0.35, metal: 0.2 }; }
  else if (kind === 'discus') { len = 1.55; h = 0.78; w = 0.17; profile = PROFILES.round; finsColor = 0xd07a3c; opts = { rough: 0.4, metal: 0.1 }; }
  else if (kind === 'guppy') { len = 0.55; h = 0.13; w = 0.07; profile = PROFILES.slim; finsColor = 0xff8a3c; opts = { rough: 0.35, metal: 0.15 }; }
  else { len = 0.72; h = 0.2; w = 0.15; profile = PROFILES.flat; finsColor = 0xcfc4ad; belly = 0.55; opts = { rough: 0.6, metal: 0.05 }; }

  const body = new THREE.Mesh(bodyGeometry(len, h, w, profile, belly), bodyMaterial(tex, uniforms, len, opts));
  group.add(body);
  eyes(group, len * 0.34, h * 0.14, w * 0.62, h * (kind === 'angel' || kind === 'discus' ? 0.1 : 0.2));

  const half = len / 2;
  const fin = (pts, color, op) => new THREE.Mesh(shapeGeo(pts), finMaterial(color, op));

  // Aleta caudal (pivota en el pedúnculo)
  const caudal = new THREE.Group(); caudal.position.x = -half * 0.98; group.add(caudal);
  let tailPts;
  if (kind === 'guppy') {
    const guppyCols = [0xff7a2e, 0x2f8cff, 0xff3f7a, 0xffc93a, 0x9b5cff];
    finsColor = guppyCols[Math.floor(Math.random() * guppyCols.length)];
    tailPts = [[0, 0], [-0.1, 0.16, -0.46, 0.2], [-0.52, 0, -0.46, -0.2], [-0.1, -0.16, 0, 0]];
  } else if (kind === 'angel') tailPts = [[0, 0], [-0.1, 0.1, -0.38, 0.26], [-0.26, 0, -0.38, -0.26], [-0.1, -0.1, 0, 0]];
  else if (kind === 'discus') tailPts = [[0, 0], [-0.06, 0.08, -0.2, 0.14], [-0.16, 0, -0.2, -0.14], [-0.06, -0.08, 0, 0]];
  else tailPts = [[0, 0], [-0.06, 0.05, -0.22 * len / 0.72, 0.13 * len / 0.72], [-0.12 * len / 0.72, 0, -0.22 * len / 0.72, -0.13 * len / 0.72], [-0.06, -0.05, 0, 0]];
  const cm = fin(tailPts, finsColor, kind === 'guppy' ? 0.95 : 0.75); caudal.add(cm);

  // Dorsal y anal
  if (kind === 'angel') {
    group.add(fin([[half * 0.25, h * 0.5], [-half * 0.1, h * 1.6, -half * 0.95, h * 2.1], [-half * 0.6, h * 1.0, -half * 0.55, h * 0.35]], finsColor, 0.7));
    group.add(fin([[half * 0.25, -h * 0.5], [-half * 0.1, -h * 1.6, -half * 0.95, -h * 2.1], [-half * 0.6, -h * 1.0, -half * 0.55, -h * 0.35]], finsColor, 0.7));
    const fil = new THREE.Mesh(new THREE.PlaneGeometry(0.015, h * 2.2), finMaterial(0xf0eee2, 0.8));
    fil.position.set(half * 0.35, -h * 1.3, 0.02); fil.rotation.z = 0.25; group.add(fil);
    const fil2 = fil.clone(); fil2.position.z = -0.02; group.add(fil2);
  } else if (kind === 'discus') {
    group.add(fin([[half * 0.55, h * 0.62], [0, h * 1.12, -half * 0.8, h * 0.55], [-half * 0.75, h * 0.35]], finsColor, 0.6));
    group.add(fin([[half * 0.45, -h * 0.62], [0, -h * 1.12, -half * 0.8, -h * 0.55], [-half * 0.75, -h * 0.35]], finsColor, 0.6));
  } else if (kind === 'guppy') {
    group.add(fin([[half * 0.05, h * 0.55], [-half * 0.3, h * 1.8, -half * 0.75, h * 1.2], [-half * 0.5, h * 0.4]], finsColor, 0.9));
  } else if (kind === 'cory') {
    group.add(fin([[half * 0.15, h * 0.6], [0, h * 1.9, -half * 0.25, h * 1.5], [-half * 0.3, h * 0.55]], finsColor, 0.75));
    const barb = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.008), finMaterial(0xe6dcc6, 0.9));
    barb.position.set(half * 1.02, -h * 0.35, w * 0.3); barb.rotation.z = -0.5; group.add(barb);
    const barb2 = barb.clone(); barb2.position.z = -w * 0.3; group.add(barb2);
  } else {
    group.add(fin([[half * 0.05, h * 0.62], [-half * 0.15, h * 1.3, -half * 0.35, h * 1.1], [-half * 0.3, h * 0.5]], finsColor, 0.65));
    group.add(fin([[-half * 0.05, -h * 0.55], [-half * 0.25, -h * 1.05, -half * 0.55, -h * 0.85], [-half * 0.5, -h * 0.4]], finsColor, 0.6));
  }
  // Pectorales
  const pect = fin([[0, 0], [-0.04 * len, 0.06 * len, -0.16 * len, 0.02 * len], [-0.1 * len, -0.04 * len, 0, 0]], finsColor, 0.5);
  const pl = pect.clone(), pr = pect.clone();
  pl.position.set(half * 0.45, -h * 0.25, w * 0.75); pr.position.set(half * 0.45, -h * 0.25, -w * 0.75);
  pl.rotation.y = -0.6; pr.rotation.y = 0.6; group.add(pl); group.add(pr);

  const bendAt = (xn, swim, amp) => {
    const tail = clamp((0.45 - xn) / 1.45, 0, 1);
    return Math.sin(swim - xn * 2.6) * amp * half * tail * tail;
  };
  return {
    kind, group, len, h, uniforms, caudal, pl, pr,
    animate(swim, amp) {
      uniforms.uSwim.value = swim; uniforms.uAmp.value = amp;
      const z = bendAt(-0.98, swim, amp), z2 = bendAt(-0.9, swim, amp);
      caudal.position.z = z;
      caudal.rotation.y = Math.atan2(z - z2, half * 0.08) * 1.4;
      pl.rotation.y = -0.6 + Math.sin(swim * 1.3) * 0.25; pr.rotation.y = 0.6 - Math.sin(swim * 1.3) * 0.25;
    }
  };
}
