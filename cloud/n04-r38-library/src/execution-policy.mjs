// Per-request result ownership only: this wrapper never aborts shared storage or index work.
import { SabikRetrievalError, retrievalFailureCode } from './sabik-retrieval.mjs';

export const EXECUTION_CODES = Object.freeze([
  'REQUEST_CANCELLED', 'REQUEST_TIMEOUT', 'INVALID_EXECUTION_OPTIONS',
]);
export class RetrievalExecutionError extends Error {
  constructor(code) {
    const safe = EXECUTION_CODES.includes(code) ? code : 'INVALID_EXECUTION_OPTIONS';
    super(safe); this.name = 'RetrievalExecutionError'; this.code = safe;
  }
}
const abortedGetter = Object.getOwnPropertyDescriptor(AbortSignal.prototype, 'aborted').get;
const addListener = EventTarget.prototype.addEventListener;
const removeListener = EventTarget.prototype.removeEventListener;
const isAborted = signal => signal !== undefined && abortedGetter.call(signal);
function checkedOptions(work, options) {
  if (typeof work !== 'function' || options === null || typeof options !== 'object' ||
      ![Object.prototype, null].includes(Object.getPrototypeOf(options))) throw new Error();
  const descriptors = Object.getOwnPropertyDescriptors(options);
  if (Reflect.ownKeys(descriptors).some(key => !['signal', 'timeoutMs'].includes(key) ||
      !('value' in descriptors[key]))) throw new Error();
  const timeoutMs = descriptors.timeoutMs?.value;
  const signal = descriptors.signal?.value;
  // Node clamps larger delays to 1 ms; reject them instead of silently changing policy.
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 2147483647) throw new Error();
  if (signal !== undefined) isAborted(signal); // Native brand check without reading reason.
  return { signal, timeoutMs };
}

/**
 * Bound one consumer's result without passing cancellation into the shared loader.
 * timeoutMs is mandatory. Cancellation and deadline expiry discard late outcomes;
 * they do not claim to stop I/O or preempt synchronous JavaScript.
 */
export function runRetrievalTask(work, options) {
  return new Promise((resolve, reject) => {
    let signal; let timeoutMs;
    try { ({ signal, timeoutMs } = checkedOptions(work, options)); }
    catch { reject(new RetrievalExecutionError('INVALID_EXECUTION_OPTIONS')); return; }
    if (isAborted(signal)) { reject(new RetrievalExecutionError('REQUEST_CANCELLED')); return; }
    const deadline = performance.now() + timeoutMs;
    let settled = false; let timer;
    function finish(error, value) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (signal !== undefined) removeListener.call(signal, 'abort', onAbort);
      if (error) reject(error); else resolve(value);
    }
    function onAbort() { finish(new RetrievalExecutionError('REQUEST_CANCELLED')); }
    function onTimeout() { finish(new RetrievalExecutionError('REQUEST_TIMEOUT')); }
    function stopped() {
      if (settled) return true;
      if (isAborted(signal)) { onAbort(); return true; }
      // Also check completion time when synchronous work delays the timer callback.
      if (performance.now() >= deadline) { onTimeout(); return true; }
      return false;
    }
    timer = setTimeout(onTimeout, timeoutMs);
    if (signal !== undefined) addListener.call(signal, 'abort', onAbort, { once: true });
    // Attach both outcome handlers before starting work; a late rejection is consumed.
    Promise.resolve().then(() => {
      if (!stopped()) return work(); // Deliberately zero arguments, never a shared signal.
    }).then(value => {
      if (!stopped()) finish(null, value);
    }, error => {
      if (stopped()) return;
      let code = 'LIBRARY_UNAVAILABLE';
      try { code = retrievalFailureCode(error); } catch { /* Do not expose foreign errors. */ }
      finish(new SabikRetrievalError(code));
    });
  });
}
