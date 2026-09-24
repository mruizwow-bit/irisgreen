/** Internal execution outcomes; not additions to the four public R39 error codes. */
export type RetrievalExecutionCode = 'REQUEST_CANCELLED' | 'REQUEST_TIMEOUT' | 'INVALID_EXECUTION_OPTIONS';
export declare const EXECUTION_CODES: readonly RetrievalExecutionCode[];
export declare class RetrievalExecutionError extends Error {
  readonly code: RetrievalExecutionCode;
  constructor(code: RetrievalExecutionCode);
}
/** Discards late results without cancelling the shared operation or its I/O. */
export declare function runRetrievalTask<T>(
  work: () => T | PromiseLike<T>,
  options: { signal?: AbortSignal; timeoutMs: number },
): Promise<T>;
