/* R37 projects explicit functional actions onto the exact current Web PNGs. */
(() => {
  'use strict';
  const motion = window.SabikMotionR37;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const masters = new Map();
  let current = {interaction: 'espera', protection: 'normal', lowIntensity: false};
  let controller;
  function readyMaster(state) {
    if (!masters.has(state)) {
      const image = new Image();
      image.src = '/sabik/assets/web-r01/web_' + state + '.png';
      const decoded = image.decode().then(() => image.src).catch(error => { masters.delete(state); throw error; });
      masters.set(state, decoded);
    }
    return masters.get(state);
  }
  function preferences() {
    return {motionLevel: document.querySelector('#sabik-motion-level')?.value || 'NORMAL',
      systemReduced: media.matches, globalOff: document.documentElement.dataset.igMotion === 'off', lowIntensity: current.lowIntensity};
  }
  function ensureController() {
    if (controller) return controller;
    const visual = document.querySelector('#sabik-hologram');
    const master = document.querySelector('#sabik-web-master');
    if (!visual || !master || !motion) return null;
    controller = motion.createController({element: master, load: readyMaster, preferences,
      apply(src, state) { master.src = src; visual.dataset.webAsset = state.toUpperCase(); },
      describe(state, level, active) {
        visual.dataset.webState = state.toUpperCase();
        visual.dataset.motionLevel = level;
        visual.dataset.motionActive = String(active);
        const help = document.querySelector('#sabik-motion-help');
        const en = document.documentElement.lang.startsWith('en');
        if (help) help.textContent = ({NORMAL: en ? 'Brief motion only when needed.' : 'Movimiento breve solo cuando hace falta.',
          REDUCIDO: en ? 'Reduced motion is active.' : 'Movimiento reducido activado.',
          SIN_MOVIMIENTO: en ? 'Motion is off.' : 'Movimiento desactivado.'})[level];
      }});
    controller.setSabikState('presente', {force: true, static: true});
    return controller;
  }
  function render(next) {
    if (next) current = next;
    const c = ensureController();
    if (c) return c.setSabikState(motion.project(current), {reason: 'functional-projection'});
  }
  function contextChange() {
    const c = ensureController();
    if (!c) return;
    const to = motion.project({...current, interaction: 'espera'});
    if (to === 'pausa' || ['error', 'retrieving', 'composing'].includes(current.operation) || current.protection === 'riesgo' || (current.safety && current.safety !== 'normal')) return render();
    return c.setSabikState('transicion', {to, reason: 'explicit-context-change', force: true});
  }
  window.SabikWebPresentation = Object.freeze({render, contextChange,
    setSabikState(state, options) { return ensureController()?.setSabikState(state, options); },
    snapshot() { return ensureController()?.snapshot(); }});
  window.setSabikState = (state, options) => window.SabikWebPresentation.setSabikState(state, options);
  function refresh() { return ensureController()?.refresh(); }
  document.addEventListener('DOMContentLoaded', () => {
    ensureController();
    for (const state of motion.STATES) readyMaster(state).catch(() => {});
    document.querySelector('#sabik-motion-level')?.addEventListener('change', refresh);
  }, {once: true});
  media.addEventListener('change', refresh);
  new MutationObserver(refresh).observe(document.documentElement, {attributes: true, attributeFilter: ['data-ig-motion']});
})();
