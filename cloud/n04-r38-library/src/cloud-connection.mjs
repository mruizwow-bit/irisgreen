// Runs only on the private Cloud origin, behind the existing Netlify Team Login.
// This window never receives the QA credential or reads the platform session.
export function startCloudConnection({ host = globalThis.window, allowedOrigin, language = 'es' } = {}) {
  if (!/^https:\/\/[a-f0-9]{24}--irisgreen-home\.netlify\.app$/.test(allowedOrigin ?? '') || !host?.opener) return null;
  const messages = language === 'en'
    ? { ready: 'Connected. Return to Iris Green to search.', closed: 'Connection closed. You can close this window.' }
    : { ready: 'Conectado. Vuelve a Iris Green para buscar.', closed: 'Conexión cerrada. Puedes cerrar esta ventana.' };
  let port = null, stopped = false;
  const active = new Map();
  const announce = text => { const status = host.document?.getElementById('status'); if (status) status.textContent = text; };
  const send = message => { if (!stopped) port?.postMessage(message); };
  const unavailable = id => send({ type: 'sabik:response', id, status: 503,
    headers: [['content-type', 'application/json']], body: '{"error":"library_unavailable"}' });
  async function receive(event) {
    const data = event.data;
    if (!data || typeof data.id !== 'string' || !/^[1-9][0-9]{0,12}$/.test(data.id)) return;
    if (data.type === 'sabik:cancel') { active.get(data.id)?.abort(); return; }
    if (data.type !== 'sabik:query' || active.has(data.id)) return;
    if (typeof data.body !== 'string' || new TextEncoder().encode(data.body).length > 2048 || active.size >= 4) {
      unavailable(data.id); return;
    }
    const controller = new AbortController(); active.set(data.id, controller);
    const timeout = setTimeout(() => controller.abort(), 15000);
    let reader;
    try {
      const response = await host.fetch('/internal/n04/team/search', { method: 'POST',
        headers: { 'content-type': 'application/json' }, body: data.body,
        credentials: 'same-origin', mode: 'same-origin', cache: 'no-store', redirect: 'error', signal: controller.signal });
      // A renewed login challenge is never interpreted as search data.
      if (!/^application\/json(?:;|$)/i.test(response.headers.get('content-type') ?? '') || !response.body) throw new Error('Unavailable');
      reader = response.body.getReader(); const chunks = []; let bytes = 0;
      for (;;) {
        const { done, value } = await reader.read(); if (done) break;
        bytes += value.byteLength; if (bytes > 65536) throw new Error('Unavailable'); chunks.push(value);
      }
      const joined = new Uint8Array(bytes); let offset = 0;
      for (const chunk of chunks) { joined.set(chunk, offset); offset += chunk.byteLength; }
      const headers = ['content-type', 'x-sabik-code-head', 'x-sabik-library-deploy', 'x-sabik-request-outcome']
        .filter(key => response.headers.has(key)).map(key => [key, response.headers.get(key)]);
      if (!controller.signal.aborted) send({ type: 'sabik:response', id: data.id, status: response.status,
        headers, body: new TextDecoder('utf-8', { fatal: true }).decode(joined) });
    } catch { if (!controller.signal.aborted) unavailable(data.id); }
    finally {
      clearTimeout(timeout); active.delete(data.id);
      if (reader) { try { void reader.cancel().catch(() => {}); } catch {} reader.releaseLock(); }
    }
  }
  function connect(event) {
    if (stopped || port || event.origin !== allowedOrigin || event.source !== host.opener ||
        event.data?.type !== 'sabik:connect' || event.data.version !== 1 ||
        typeof event.data.nonce !== 'string' || !/^[a-f0-9-]{36}$/.test(event.data.nonce) || event.ports?.length !== 1) return;
    port = event.ports[0]; port.onmessage = receive;
    send({ type: 'sabik:connected', nonce: event.data.nonce });
    clearInterval(readyTimer); announce(messages.ready);
  }
  function stop() {
    if (stopped) return; stopped = true; clearInterval(readyTimer); clearTimeout(expiry);
    host.removeEventListener('message', connect); host.removeEventListener('pagehide', stop);
    for (const controller of active.values()) controller.abort(); active.clear(); port?.close(); port = null;
    announce(messages.closed);
  }
  const ready = () => host.opener.postMessage({ type: 'sabik:ready', version: 1 }, allowedOrigin);
  host.addEventListener('message', connect); host.addEventListener('pagehide', stop);
  const readyTimer = setInterval(ready, 500);
  const expiry = setTimeout(stop, 3600000); // Session reauthentication requires a new explicit connection.
  host.document?.getElementById('close')?.addEventListener('click', () => { stop(); host.close(); }, { once: true });
  ready();
  return Object.freeze({ stop });
}
if (typeof window !== 'undefined') {
  const config = document.querySelector('meta[name="sabik-allowed-origin"]');
  if (config) startCloudConnection({ allowedOrigin: config.content, language: document.documentElement.lang });
}
