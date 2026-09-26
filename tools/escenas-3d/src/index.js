import { makeRenderer } from './common.js';
import { createAquarium } from './aquarium.js';
import { createBubbleTube } from './bubbletube.js';
import { createPause } from './pause.js';
import { createJellies } from './jelly.js';
import { createFibre } from './fibre.js';
import { createSea } from './sea.js';
import { createRainWindow } from './rainwindow.js';
import { createNight } from './night.js';
import { createRiver } from './river.js';

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
  const MAKERS = { aquarium: createAquarium, pause: createPause, jellies: createJellies, fibre: createFibre, sea: createSea, rain: createRainWindow, night: createNight, river: createRiver, bubbles: createBubbleTube };
  const world = (MAKERS[kind] || createBubbleTube)(canvas, renderer);
  let lastIdle = 0;
  // Calidad adaptable: si el dispositivo va lento, se baja la resolución interna (no cambia lo que se ve, solo la nitidez)
  let pr = dpr, acc = 0, cnt = 0;
  function adapt(dt) {
    acc += dt; cnt++;
    if (cnt < 45 && acc < 1.5) return;
    const avg = acc / cnt; acc = 0; cnt = 0;
    const next = avg > 0.045 ? Math.max(0.75, pr * 0.8) : avg < 0.022 ? Math.min(dpr, pr * 1.15) : pr;
    if (Math.abs(next - pr) > 0.05) { pr = next; renderer.setPixelRatio(pr); fit(); }
  }
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
    const raw = (now - last) / 1000; const dt = Math.min(0.05, raw); last = now;
    if (!document.hidden) {
      const phase = opts.phase ? opts.phase() : null;
      const idle = phase && !phase.guiding;
      if (!idle || now - lastIdle > 400) {
        lastIdle = now;
        if (opts.color) world.setWater(opts.color());
        world.update(dt, opts.speed ? opts.speed() : 1, opts.reduced(), phase);
        if (!idle) adapt(raw);
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
  function poke(x, y) { if (alive && world.poke) world.poke(x, y); }
  return { stop, poke, canPoke: !!world.poke };
}

window.IGScenes3D = { supported, start };
