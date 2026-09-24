// Private team connection. Activation requires approval of the Cloud relay.
// The Netlify session stays in its own top-level window; no credential is read.
const VERSION = 1;
const MAX_RESPONSE = 65536;
const failure = code => Object.assign(new Error(code), { code });
export function createAuthorizedTransport({ cloudOrigin, window: host = globalThis.window,
  connectionTimeoutMs = 60000, requestTimeoutMs = 20000 } = {}) {
  if (!/^https:\/\/[a-f0-9]{24}--sabik-asistente\.netlify\.app$/.test(cloudOrigin ?? '') ||
      !host || !Number.isInteger(connectionTimeoutMs) || connectionTimeoutMs < 1 ||
      !Number.isInteger(requestTimeoutMs) || requestTimeoutMs < 1) throw new TypeError('Invalid connection configuration');
  let peer = null, port = null, connecting = null, stopConnecting = null, serial = 0;
  const pending = new Map();
  function disconnect() {
    stopConnecting?.(); stopConnecting = null;
    for (const [id, entry] of [...pending]) {
      try { port?.postMessage({ type: 'sabik:cancel', id }); } catch {}
      entry.finish(failure('REQUEST_CANCELLED'));
    }
    port?.close(); port = null; peer?.close(); peer = null; connecting = null;
  }
  function connect(language = 'es') {
    if (port && peer && !peer.closed) return Promise.resolve();
    if (connecting) return connecting;
    disconnect();
    peer = host.open(`${cloudOrigin}/sabik-connect?lang=${language === 'en' ? 'en' : 'es'}`, '_blank', 'popup,width=520,height=420');
    if (!peer) return Promise.reject(failure('LIBRARY_UNAVAILABLE'));
    const attempt = new Promise((resolve, reject) => {
      let offered = false, channel = null, settled = false;
      const nonce = host.crypto.randomUUID();
      const cleanup = () => { clearTimeout(timer); clearInterval(closed); host.removeEventListener('message', ready); stopConnecting = null; };
      const finish = error => {
        if (settled) return; settled = true; cleanup();
        if (error) { channel?.port1.close(); channel?.port2.close(); peer?.close(); peer = null; reject(error); }
        else resolve();
      };
      const ready = event => {
        if (event.origin !== cloudOrigin || event.source !== peer || event.data?.type !== 'sabik:ready' ||
            event.data.version !== VERSION || offered) return;
        offered = true; channel = new host.MessageChannel();
        channel.port1.onmessage = message => {
          if (message.data?.type !== 'sabik:connected' || message.data.nonce !== nonce) return;
          port = channel.port1; port.onmessage = receive; finish();
        };
        try { peer.postMessage({ type: 'sabik:connect', version: VERSION, nonce }, cloudOrigin, [channel.port2]); }
        catch { finish(failure('LIBRARY_UNAVAILABLE')); }
      };
      host.addEventListener('message', ready);
      const timer = setTimeout(() => finish(failure('REQUEST_TIMEOUT')), connectionTimeoutMs);
      const closed = setInterval(() => { if (peer?.closed) finish(failure('REQUEST_CANCELLED')); }, 200);
      stopConnecting = () => finish(failure('REQUEST_CANCELLED'));
    });
    connecting = attempt;
    const clear = () => { if (connecting === attempt) connecting = null; };
    attempt.then(clear, clear);
    return connecting;
  }
  function waitForConnection(signal) {
    const attempt = connect();
    if (!signal) return attempt;
    // Abort this consumer immediately, without closing another consumer's login.
    return new Promise((resolve, reject) => {
      const abort = () => { signal.removeEventListener('abort', abort); reject(failure('REQUEST_CANCELLED')); };
      signal.addEventListener('abort', abort, { once: true });
      attempt.then(value => { signal.removeEventListener('abort', abort); resolve(value); },
        error => { signal.removeEventListener('abort', abort); reject(error); });
      if (signal.aborted) abort();
    });
  }
  function receive(event) {
    const data = event.data;
    if (!data || data.type !== 'sabik:response') return;
    const entry = pending.get(data.id); if (!entry) return;
    if (!Number.isInteger(data.status) || data.status < 200 || data.status > 599 ||
        typeof data.body !== 'string' || new TextEncoder().encode(data.body).length > MAX_RESPONSE ||
        !Array.isArray(data.headers) || data.headers.some(pair => !Array.isArray(pair) || pair.length !== 2 ||
          !['content-type','x-sabik-code-head','x-sabik-library-deploy','x-sabik-request-outcome'].includes(pair[0]) || typeof pair[1] !== 'string')) {
      entry.finish(failure('LIBRARY_UNAVAILABLE')); return;
    }
    try { entry.finish(null, new Response(data.body, { status: data.status, headers: data.headers })); }
    catch { entry.finish(failure('LIBRARY_UNAVAILABLE')); }
  }
  async function transport(request, { signal } = {}) {
    if (signal?.aborted) throw failure('REQUEST_CANCELLED');
    const body = JSON.stringify({ q: request?.query, ...(request?.limit === undefined ? {} : { limit: request.limit }),
      ...(request?.libraryVersion === undefined ? {} : { version: request.libraryVersion }) });
    if (new TextEncoder().encode(body).length > 2048) throw failure('INVALID_RETRIEVAL_QUERY');
    // connect() should be called from an explicit user gesture before the first
    // query. Automatic fallback remains within the initiating search gesture.
    await waitForConnection(signal);
    if (signal?.aborted) throw failure('REQUEST_CANCELLED');
    return new Promise((resolve, reject) => {
      const id = String(++serial); let finished = false;
      const cancel = code => { try { port?.postMessage({ type: 'sabik:cancel', id }); } catch {} finish(failure(code)); };
      const onAbort = () => cancel('REQUEST_CANCELLED');
      const finish = (error, value) => {
        if (finished) return; finished = true; clearTimeout(timer); clearInterval(closed);
        signal?.removeEventListener('abort', onAbort); pending.delete(id);
        if (error) reject(error); else resolve(value);
      };
      const timer = setTimeout(() => cancel('REQUEST_TIMEOUT'), requestTimeoutMs);
      const closed = setInterval(() => { if (peer?.closed) cancel('REQUEST_CANCELLED'); }, 200);
      pending.set(id, { finish }); signal?.addEventListener('abort', onAbort, { once: true });
      if (signal?.aborted) { onAbort(); return; }
      try { port.postMessage({ type: 'sabik:query', id, body }); }
      catch { finish(failure('LIBRARY_UNAVAILABLE')); }
    });
  }
  return Object.freeze({ transport, connect, disconnect });
}
