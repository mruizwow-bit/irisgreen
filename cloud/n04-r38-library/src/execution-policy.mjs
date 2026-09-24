import { retrievalFailureCode } from './sabik-retrieval.mjs';

const EXECUTION_CODES = Object.freeze(new Set([
  'RETRIEVAL_CANCELLED',
  'RETRIEVAL_TIMEOUT',
]));

class RetrievalExecutionError extends Error {
  constructor(code) {
    super(code);
    this.name = 'RetrievalExecutionError';
    Object.defineProperty(this, 'code', { value: code, enumerable: true });
  }
}

const executionError = code => new RetrievalExecutionError(code);

function isAbortSignalLike(signal) {
  return signal === undefined || (signal !== null && typeof signal === 'object' &&
    typeof signal.aborted === 'boolean' && typeof signal.addEventListener === 'function' &&
    typeof signal.removeEventListener === 'function');
}

export function mapRetrievalError(error) {
  if (error instanceof RetrievalExecutionError && EXECUTION_CODES.has(error.code)) return error.code;
  return retrievalFailureCode(error);
}

export function runRetrievalTask(work, { signal, timeoutMs } = {}) {
  if (typeof work !== 'function') return Promise.reject(new TypeError('INVALID_RETRIEVAL_WORK'));
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return Promise.reject(new RangeError('INVALID_RETRIEVAL_TIMEOUT'));
  if (!isAbortSignalLike(signal)) return Promise.reject(new TypeError('INVALID_RETRIEVAL_SIGNAL'));
  if (signal?.aborted) return Promise.reject(executionError('RETRIEVAL_CANCELLED'));

  return new Promise((resolve, reject) => {
    const requestController = new AbortController();
    let settled = false;
    let timer;

    const cleanup = () => {
      if (timer !== undefined) {
        clearTimeout(timer);
        timer = undefined;
      }
      signal?.removeEventListener('abort', onCallerAbort);
    };

    const settle = (ok, value) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (ok) resolve(value);
      else reject(value);
    };

    const stopWaiting = code => {
      if (settled) return;
      settle(false, executionError(code));
      // This signal is request-scoped. Shared immutable library loading must not
      // be wired to it by callers. If underlying I/O ignores AbortSignal, this
      // still cancels only the caller's wait and late completion is discarded.
      requestController.abort();
    };

    function onCallerAbort() {
      stopWaiting('RETRIEVAL_CANCELLED');
    }

    signal?.addEventListener('abort', onCallerAbort, { once: true });
    timer = setTimeout(() => stopWaiting('RETRIEVAL_TIMEOUT'), timeoutMs);

    // Invocation is deferred so the timeout/listener policy is installed first.
    // A work implementation that blocks synchronously cannot be made cancelable
    // by AbortSignal and is outside this contract.
    const task = Promise.resolve().then(() => work({ signal: requestController.signal }));
    task.then(
      value => settle(true, value),
      error => settle(false, executionError(mapRetrievalError(error))),
    );
  });
}
