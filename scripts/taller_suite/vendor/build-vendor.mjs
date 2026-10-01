/* Iris Green · Receta reproducible de assets/vendor/taller (R43).
   Uso: npm install && node build-vendor.mjs [carpeta de salida]  (por defecto ./out)
   Todo sale como IIFE sin eval ni new Function (la CSP de producción no permite evaluación dinámica). */
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(process.argv[2] || 'out');
fs.mkdirSync(OUT, { recursive: true });
const nm = (p) => path.resolve('node_modules', p);
const common = { bundle: true, minify: true, format: 'iife', logLimit: 5 };

/* PixiJS 8: se incluye pixi.js/unsafe-eval (sin generación de código) y se neutraliza cualquier new Function restante. */
await esbuild.build({ ...common, entryPoints: ['src/pixi.js'], outfile: path.join(OUT, 'pixi.js') });
let pixi = fs.readFileSync(path.join(OUT, 'pixi.js'), 'utf8').replace(/new Function\(/g, '(0,globalThis.__IGNoDynamicCode)(');
pixi = 'globalThis.__IGNoDynamicCode=function(){throw new EvalError("Iris Green: código dinámico desactivado por la política de seguridad")};\n' + pixi;
fs.writeFileSync(path.join(OUT, 'pixi.js'), pixi);

await esbuild.build({ ...common, entryPoints: ['src/planck.js'], outfile: path.join(OUT, 'planck.js') });
await esbuild.build({ ...common, entryPoints: ['src/acorn.js'], outfile: path.join(OUT, 'acorn.js') });
await esbuild.build({ ...common, entryPoints: ['src/cm.js'], globalName: 'IGCodeMirror', outfile: path.join(OUT, 'codemirror.js') });

/* Rapier 2D: el paquete compat lleva el WASM en base64; se separa a rapier2d.wasm y el código lo recibe en globalThis.__IGRapierWasm. */
await esbuild.build({ ...common, entryPoints: ['src/rapier.js'], globalName: 'IGRapierMod', outfile: path.join(OUT, 'rapier2d.js') });
let rap = fs.readFileSync(path.join(OUT, 'rapier2d.js'), 'utf8');
const b64 = rap.match(/"([A-Za-z0-9+/=]{100000,})"/);
if (!b64) throw new Error('No se encontró el WASM en base64 de Rapier');
fs.writeFileSync(path.join(OUT, 'rapier2d.wasm'), Buffer.from(b64[1], 'base64'));
rap = rap.replace(/module_or_path:[\w$.]+\(\s*"[A-Za-z0-9+/=]{100000,}"\s*\)/, 'module_or_path:new Uint8Array(globalThis.__IGRapierWasm)')
  .replace(b64[0], '""');
fs.writeFileSync(path.join(OUT, 'rapier2d.js'), rap + 'window.RAPIER=IGRapierMod.default;\n');

/* Three.js (WebGPU con reserva WebGL 2) en una sola copia, con controles, exportadores y CSG. */
const webgpu = nm('three/build/three.webgpu.js');
await esbuild.build({ ...common, entryPoints: ['src/three.js'], globalName: 'THREE', outfile: path.join(OUT, 'three.js'),
  plugins: [{ name: 'three-one-copy', setup(b) { b.onResolve({ filter: /^three$/ }, () => ({ path: webgpu })); } }] });
/* three-bvh-csg todavía pasa la opción antigua maxLeafSize a three-mesh-bvh: se renombra para evitar avisos. */
fs.writeFileSync(path.join(OUT, 'three.js'), fs.readFileSync(path.join(OUT, 'three.js'), 'utf8').replace('{maxLeafSize:3,indirect:!0', '{targetLeafSize:3,indirect:!0'));

/* Tone.js: build UMD oficial tal cual. */
fs.copyFileSync(nm('tone/build/Tone.js'), path.join(OUT, 'tone.js'));

/* Blockly: núcleo + bloques + generadores JS y Python concatenados; mensajes ES/EN y medios. */
fs.writeFileSync(path.join(OUT, 'blockly.js'), ['blockly_compressed.js', 'blocks_compressed.js', 'javascript_compressed.js', 'python_compressed.js'].map((f) => fs.readFileSync(nm('blockly/' + f), 'utf8')).join(''));
fs.copyFileSync(nm('blockly/msg/es.js'), path.join(OUT, 'blockly-msg-es.js'));
fs.copyFileSync(nm('blockly/msg/en.js'), path.join(OUT, 'blockly-msg-en.js'));
fs.mkdirSync(path.join(OUT, 'blockly-media'), { recursive: true });
for (const f of fs.readdirSync(nm('blockly/media')).filter((x) => !x.endsWith('.mp3') && !x.endsWith('.wav') && !x.endsWith('.ogg'))) fs.copyFileSync(nm('blockly/media/' + f), path.join(OUT, 'blockly-media', f));
/* blockly-msg-extra.js se genera aparte con scripts/taller_suite/blockly_es_extra.py. */
console.log('Bibliotecas en', OUT);
