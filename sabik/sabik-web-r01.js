/* R52 · approved moving Sabik presence restored from sabik-preview@fc5cdfc2f978c85033de2b07c34309f8a4a7bd18.
   R37 remains only as the B3 transition/state projector. It no longer swaps static PNG masters. */
(() => {
  'use strict';
  const motion = window.SabikMotionR37;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = {interaction:'espera', protection:'normal', lowIntensity:false, operation:'idle'};
  let controller = null, bodyObserver = null, panelObserver = null, resultObserver = null;

  function nodes() {
    return {
      visual: document.querySelector('#sabik-hologram'),
      body: document.querySelector('#sabik-widget-body'),
      panel: document.querySelector('.sabik-panel'),
      results: document.querySelector('#sabik-results')
    };
  }
  function preferences() {
    return {
      motionLevel: document.querySelector('#sabik-motion-level')?.value || 'NORMAL',
      systemReduced: media.matches,
      globalOff: document.documentElement.dataset.igMotion === 'off',
      lowIntensity: false
    };
  }
  function motionCopy(level) {
    const en = document.documentElement.lang.startsWith('en');
    return ({
      NORMAL: en ? 'Gentle continuous motion.' : 'Movimiento suave y continuo.',
      REDUCIDO: en ? 'Reduced motion is active.' : 'Movimiento reducido activado.',
      SIN_MOVIMIENTO: en ? 'Motion is off.' : 'Movimiento desactivado.'
    })[level];
  }
  function describe(state, level, active) {
    const {visual} = nodes();
    if (!visual) return;
    visual.dataset.webState = state.toUpperCase();
    visual.dataset.motionLevel = level;
    visual.dataset.motionActive = String(active);
    const help = document.querySelector('#sabik-motion-help');
    if (help) help.textContent = motionCopy(level);
  }
  function ensureController() {
    if (controller) return controller;
    const {visual} = nodes();
    if (!visual || !motion) return null;
    controller = motion.createController({
      element: visual,
      load: state => Promise.resolve(state),
      preferences,
      apply(_asset, state) { visual.dataset.webState = state.toUpperCase(); },
      describe
    });
    controller.setSabikState('presente', {force:true, static:true});
    syncFunctionalData();
    syncRenderActivity();
    observeRuntime();
    return controller;
  }
  function syncFunctionalData() {
    const {visual, results} = nodes();
    if (!visual) return;
    const processing = results?.getAttribute('aria-busy') === 'true' ||
      ['retrieving','composing'].includes(current.operation);
    visual.dataset.operation = processing ? 'processing' : 'idle';
    visual.dataset.protectionState =
      current.protection === 'riesgo' || (current.safety && current.safety !== 'normal') ? 'riesgo' : 'normal';
    visual.dataset.lowIntensity = String(Boolean(current.lowIntensity));
  }
  function syncRenderActivity() {
    const {visual, body, panel} = nodes();
    if (!visual) return false;
    const inactive = document.hidden || Boolean(body?.hidden) || Boolean(panel?.hidden) ||
      Boolean(panel?.classList.contains('is-collapsed'));
    visual.dataset.renderActive = String(!inactive);
    return !inactive;
  }
  function observeRuntime() {
    const {body, panel, results} = nodes();
    if (body && !bodyObserver) {
      bodyObserver = new MutationObserver(syncRenderActivity);
      bodyObserver.observe(body, {attributes:true, attributeFilter:['hidden']});
    }
    if (panel && !panelObserver) {
      panelObserver = new MutationObserver(syncRenderActivity);
      panelObserver.observe(panel, {attributes:true, attributeFilter:['hidden','class']});
    }
    if (results && !resultObserver) {
      resultObserver = new MutationObserver(syncFunctionalData);
      resultObserver.observe(results, {attributes:true, attributeFilter:['aria-busy','data-retrieval-state']});
    }
  }
  function render(next) {
    if (next) current = {...current, ...next};
    syncFunctionalData();
    const c = ensureController();
    return c?.setSabikState(motion.project(current), {reason:'functional-projection'});
  }
  function contextChange() {
    const c = ensureController();
    if (!c) return;
    const to = motion.project({...current, interaction:'espera'});
    if (to === 'pausa' || ['error','retrieving','composing'].includes(current.operation) ||
        current.protection === 'riesgo' || (current.safety && current.safety !== 'normal')) return render();
    return c.setSabikState('transicion', {to, reason:'explicit-context-change', force:true});
  }
  function handleVoiceEvent(type) {
    const allowed = new Set(['voice-start','voice-end','voice-cancel','voice-error']);
    if (!allowed.has(type)) throw new RangeError('Invalid Sabik voice visual event');
    const {visual} = nodes();
    if (!visual) return false;
    visual.dataset.voiceActive = String(type === 'voice-start');
    return visual.dataset.voiceActive === 'true';
  }
  function setVoiceActive(active) { return handleVoiceEvent(active ? 'voice-start' : 'voice-end'); }
  function refresh() {
    syncFunctionalData();
    syncRenderActivity();
    return ensureController()?.refresh();
  }

  window.SabikWebPresentation = Object.freeze({
    render, contextChange,
    setSabikState(state, options) { return ensureController()?.setSabikState(state, options); },
    handleVoiceEvent, setVoiceActive, refresh,
    snapshot() {
      const {visual} = nodes();
      return {
        ...(ensureController()?.snapshot() || {}),
        renderActive: visual?.dataset.renderActive === 'true',
        operation: visual?.dataset.operation || 'idle',
        voiceActive: visual?.dataset.voiceActive === 'true'
      };
    }
  });
  window.setSabikState = (state, options) => window.SabikWebPresentation.setSabikState(state, options);

  for (const type of ['voice-start','voice-end','voice-cancel','voice-error']) {
    document.addEventListener(type, () => handleVoiceEvent(type));
    document.addEventListener('sabik:' + type, () => handleVoiceEvent(type));
  }
  function boot() {
    ensureController();
    document.querySelector('#sabik-motion-level')?.addEventListener('change', refresh);
    syncRenderActivity();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true});
  else boot();

  document.addEventListener('visibilitychange', syncRenderActivity);
  window.addEventListener('pagehide', () => {
    const {visual} = nodes();
    if (visual) visual.dataset.renderActive = 'false';
  });
  media.addEventListener('change', refresh);
  new MutationObserver(refresh).observe(document.documentElement, {
    attributes:true, attributeFilter:['data-ig-motion']
  });
})();
