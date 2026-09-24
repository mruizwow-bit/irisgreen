/* R37 presentation only. PR #207 is a technical donor; S0 and PNGs stay intact. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.SabikMotionR37 = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';
  const STATES = Object.freeze(['presente', 'orientar', 'transicion', 'pausa', 'confirmar']);
  const LEVELS = Object.freeze(['NORMAL', 'REDUCIDO', 'SIN_MOVIMIENTO']);
  const TOKENS = Object.freeze({
    NORMAL: Object.freeze({
      presente: {duration: 0, x: 0, y: 0, rotate: 0, scale: 1},
      orientar: {duration: 380, x: -1.6, y: .7, rotate: 2.2, scale: .992},
      transicion: {duration: 500, x: 1, y: -.5, rotate: -2.8, scale: .975},
      pausa: {duration: 300, x: .3, y: -.3, rotate: .5, scale: 1.025},
      confirmar: {duration: 320, x: 0, y: -.2, rotate: 0, scale: .975}
    }),
    REDUCIDO: Object.freeze({
      presente: {duration: 0, x: 0, y: 0, rotate: 0, scale: 1},
      orientar: {duration: 140, x: -.4, y: 0, rotate: 0, scale: 1},
      transicion: {duration: 160, x: .2, y: 0, rotate: 0, scale: .995},
      pausa: {duration: 140, x: 0, y: 0, rotate: 0, scale: 1.005},
      confirmar: {duration: 140, x: 0, y: 0, rotate: 0, scale: .995}
    })
  });
  for (const mode of Object.values(TOKENS)) for (const token of Object.values(mode)) Object.freeze(token);
  const IDENTITY = 'translate(0%, 0%) rotate(0deg) scale(1)';
  function valid(value, allowed, name) {
    if (!allowed.includes(value)) throw new RangeError('Invalid Sabik ' + name);
    return value;
  }
  function effectiveLevel({motionLevel = 'NORMAL', systemReduced = false, globalOff = false, lowIntensity = false} = {}) {
    valid(motionLevel, LEVELS, 'motion level');
    if (globalOff || lowIntensity || motionLevel === 'SIN_MOVIMIENTO') return 'SIN_MOVIMIENTO';
    return systemReduced || motionLevel === 'REDUCIDO' ? 'REDUCIDO' : 'NORMAL';
  }
  function project(input = {}) {
    if (input.protection === 'riesgo' || (input.safety && input.safety !== 'normal')) return 'presente';
    if (['error', 'retrieving', 'composing'].includes(input.operation)) return 'presente';
    if (input.interaction === 'pausa' || input.operation === 'paused') return 'pausa';
    if (['correccion', 'aclaracion'].includes(input.interaction)) return 'orientar';
    if (input.interaction === 'contexto') return 'transicion';
    if (input.interaction === 'confirmacion') return 'confirmar';
    if (input.operation === 'awaiting_clarification') return 'orientar';
    // Retrieval, composing, ordinary responses, errors, safety and voice do not animate.
    return 'presente';
  }
  function transition(from, to, level) {
    valid(from, STATES, 'state'); valid(to, STATES, 'state'); valid(level, LEVELS, 'motion level');
    const token = TOKENS[level === 'SIN_MOVIMIENTO' ? 'REDUCIDO' : level][to];
    const duration = from === to || level === 'SIN_MOVIMIENTO' ? 0 : token.duration;
    const emphasis = `translate(${token.x}%, ${token.y}%) rotate(${token.rotate}deg) scale(${token.scale})`;
    const keyframes = to === 'transicion'
      ? [{transform: IDENTITY}, {transform: emphasis, offset: .4}, {transform: IDENTITY}]
      : [{transform: emphasis}, {transform: IDENTITY}];
    return {from, to, level, keyframes, duration, easing: level === 'NORMAL' ? 'cubic-bezier(.2,.7,.3,1)' : 'ease-out', iterations: 1, fill: 'none'};
  }
  function createController({element, load, apply, describe = () => {}, preferences = () => ({})}) {
    let state = 'presente', requested = 'presente', level = 'NORMAL', active = null, revision = 0, hold = false;
    const pending = new Map();
    function cancel() {
      ++revision;
      if (active) { active.onfinish = null; active.oncancel = null; active.cancel(); active = null; }
      for (const resolve of pending.values()) resolve({cancelled: true});
      pending.clear();
      describe(state, level, false);
    }
    function setSabikState(next, options = {}) {
      valid(next, STATES, 'state');
      const nextLevel = effectiveLevel({...options, ...preferences(), motionLevel: options.motionLevel ?? preferences().motionLevel ?? 'NORMAL'});
      const destination = options.to ?? 'presente';
      valid(destination, STATES, 'destination');
      if (destination === 'transicion' || destination === 'confirmar') throw new RangeError('A transition destination must be stable');
      if (next === requested && nextLevel === level && !options.force && Boolean(options.hold) === hold) return Promise.resolve({unchanged: true, state});
      const from = state;
      cancel(); const ticket = revision;
      requested = next; level = nextLevel; hold = Boolean(options.hold);
      describe(next, level, false);
      return new Promise(resolve => {
        pending.set(ticket, resolve);
        const finish = result => { if (pending.delete(ticket)) resolve(result); };
        const complete = async () => {
          if (ticket !== revision) return;
          if (active) { active.onfinish = null; active.oncancel = null; active.cancel(); active = null; }
          if (!hold && (next === 'confirmar' || next === 'transicion')) {
            const finalState = next === 'confirmar' ? 'presente' : destination;
            try {
              const asset = await load(finalState);
              if (ticket !== revision) return;
              apply(asset, finalState); state = requested = finalState;
            } catch (_) { /* Keep the last successfully decoded master. */ }
          }
          describe(state, level, false); finish({state, cancelled: false});
        };
        Promise.resolve().then(() => load(next)).then(asset => {
          if (ticket !== revision) return;
          apply(asset, next); state = next;
          const spec = transition(from, next, level);
          if (options.static || spec.duration === 0 || typeof element.animate !== 'function') { complete(); return; }
          try {
            active = element.animate(spec.keyframes, {duration: spec.duration, easing: spec.easing, iterations: 1, fill: 'none'});
            describe(state, level, true);
            active.onfinish = complete;
            active.oncancel = () => { active = null; describe(state, level, false); finish({cancelled: true, state}); };
          } catch (_) { complete(); }
        }).catch(() => {
          if (ticket !== revision) return;
          requested = state; describe(state, level, false); finish({state, assetUnavailable: true});
        });
      });
    }
    return Object.freeze({setSabikState, cancel,
      refresh: () => setSabikState(state, {hold, force: true, static: true}),
      snapshot: () => ({state, requested, level, active: Boolean(active), hold})});
  }
  return Object.freeze({STATES, LEVELS, TOKENS, effectiveLevel, project, transition, createController});
});
