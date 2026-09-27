// Separate A9 bridge. Netlify Team Login is enforced before this Function.
// It reuses the existing server-side smoke credential without exposing it to the browser.
const SITE = '47b06e68-ff54-4097-8ad8-336b2d71758a';
const PATH = '/internal/n04/cloud-library/team/search';
const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer'
};
const denied = status => new Response(JSON.stringify({ error: 'library_unavailable' }), { status, headers });

export function createCloudLibraryTeamHandler({ qaHandler, env }) {
  if (typeof qaHandler !== 'function' || typeof env !== 'function') throw new TypeError('Invalid A9 team transport');
  return async (request, context) => {
    if (env('N04_TEAM_TRANSPORT_ENABLED') !== 'true' ||
        context?.site?.id !== SITE ||
        context?.deploy?.context !== 'deploy-preview' ||
        context?.deploy?.published !== false) return denied(503);

    const url = new URL(request.url);
    if (url.pathname !== PATH || url.search || request.method !== 'POST') return denied(405);
    if (request.headers.get('origin') !== url.origin ||
        request.headers.get('sec-fetch-site') !== 'same-origin') return denied(403);

    const credential = env('N04_SMOKE_TOKEN');
    if (typeof credential !== 'string' || credential.length < 32) return denied(503);

    const forwarded = new Headers({
      'content-type': request.headers.get('content-type') ?? '',
      'x-n04-smoke-token': credential
    });
    try {
      return await qaHandler(new Request(new URL('/internal/n04/cloud-library/search', url), {
        method: 'POST',
        headers: forwarded,
        body: request.body,
        signal: request.signal,
        duplex: 'half'
      }), context);
    } catch {
      return denied(503);
    }
  };
}
