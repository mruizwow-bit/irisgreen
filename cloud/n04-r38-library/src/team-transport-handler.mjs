// Team Login is enforced by Netlify BEFORE this Function. This is not a public
// visitor-auth solution. Deployment requires verifying private/all contexts.
const SITE = '47b06e68-ff54-4097-8ad8-336b2d71758a';
const PATH = '/internal/n04/team/search';
const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' };
const denied = status => new Response(JSON.stringify({ error: 'library_unavailable' }), { status, headers });
export function createTeamTransportHandler({ qaHandler, env }) {
  if (typeof qaHandler !== 'function' || typeof env !== 'function') throw new TypeError('Invalid team transport');
  return async (request, context) => {
    if (env('N04_TEAM_TRANSPORT_ENABLED') !== 'true' || context?.site?.id !== SITE ||
        context?.deploy?.context !== 'deploy-preview' || context.deploy.published !== false) return denied(503);
    const url = new URL(request.url);
    if (url.pathname === '/sabik-connect' && request.method === 'GET') {
      const origin = env('N04_WEB_ALLOWED_ORIGIN');
      if (!/^https:\/\/(?:[a-f0-9]{24}|deploy-preview-[1-9][0-9]*)--irisgreen-home\.netlify\.app$/.test(origin ?? '')) return denied(503);
      const en = url.searchParams.get('lang') === 'en';
      const title = en ? 'Sabik private connection' : 'Conexión privada de Sabik';
      const status = en ? 'Connecting to Iris Green…' : 'Conectando con Iris Green…';
      const close = en ? 'Close connection' : 'Cerrar conexión';
      return new Response(`<!doctype html><html lang="${en ? 'en' : 'es'}"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="sabik-allowed-origin" content="${origin}"><title>${title}</title><script type="module" src="/sabik-connect.mjs"></script><main><h1>${title}</h1><p id="status" role="status">${status}</p><p>${en ? 'Keep this window open while searching. Access is limited to the Iris Green team.' : 'Mantén esta ventana abierta mientras buscas. El acceso está limitado al equipo de Iris Green.'}</p><button id="close" type="button">${close}</button></main></html>`, {
        headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8',
          'Cross-Origin-Opener-Policy': 'unsafe-none',
          'Content-Security-Policy': `default-src 'none'; script-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors ${origin}` },
      });
    }
    if (url.pathname !== PATH || url.search || request.method !== 'POST') return denied(405);
    // CSRF checks complement the platform session; Origin is not authentication.
    if (request.headers.get('origin') !== url.origin || request.headers.get('sec-fetch-site') !== 'same-origin') return denied(403);
    const credential = env('N04_SMOKE_TOKEN');
    if (typeof credential !== 'string' || credential.length < 32) return denied(503);
    const forwarded = new Headers({ 'content-type': request.headers.get('content-type') ?? '', 'x-n04-smoke-token': credential });
    try {
      const response = await qaHandler(new Request(new URL('/internal/n04/library/search', url), {
        method: 'POST', headers: forwarded, body: request.body, signal: request.signal, duplex: 'half',
      }), context);
      return response;
    } catch { return denied(503); }
  };
}
