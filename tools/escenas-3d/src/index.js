import { makeRenderer } from './common.js';
import { createAquarium } from './aquarium.js';
import { createBubbleTube } from './bubbletube.js';
import { createPause } from './pause.js';

/* Punto de entrada: window.IGScenes3D.start(kind, canvas, opciones)
   opciones: { speed(), color(), reduced() }  →  { stop() } */
function supported() {
  try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); }
  catch (e) { return false; }
}

function start(kind, canvas, opts) {
  const renderer = makeRenderer(canvas);
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  renderer.setPixelRatio(dpr);
  const world = kind === 'aquarium' ? createAquarium(canvas, renderer) : kind === 'pause' ? createPause(canvas, renderer) : createBubbleTube(canvas, renderer);
  let lastIdle = 0;
  let raf = 0, last = performance.now(), alive = true;
  function fit() {
    const r = canvas.parentElement.getBoundingClientRect();
    renderer.setSize(Math.max(1, r.width), Math.max(1, r.height), false);
    world.resize(r.width, r.height);
  }
  fit();
  const ro = window.ResizeObserver ? new ResizeObserver(fit) : null;
  if (ro) ro.observe(canvas.parentElement);
  function frame(now) {
    if (!alive) return;
    if (!canvas.isConnected) { stop(); return; }
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!document.hidden) {
      const phase = opts.phase ? opts.phase() : null;
      const idle = phase && !phase.guiding;
      if (!idle || now - lastIdle > 400) {
        lastIdle = now;
        if (opts.color) world.setWater(opts.color());
        world.update(dt, opts.speed ? opts.speed() : 1, opts.reduced(), phase);
        renderer.render(world.scene, world.camera);
      }
    }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  function stop() {
    if (!alive) return; alive = false;
    cancelAnimationFrame(raf); if (ro) ro.disconnect();
    world.scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { Object.values(m).forEach((v) => { if (v && v.isTexture) v.dispose(); }); m.dispose(); });
    });
    renderer.dispose();
    if (renderer.forceContextLoss) renderer.forceContextLoss();
  }
  return { stop };
}

window.IGScenes3D = { supported, start };
