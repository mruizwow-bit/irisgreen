const ALLOWED = new Map([
  ["/sabik-voice/capabilities", "GET"],
  ["/sabik-voice/transcribe", "POST"],
  ["/sabik-voice/synthesize", "POST"],
]);
const NO_STORE = {
  "Cache-Control": "no-store, max-age=0",
  "Pragma": "no-cache",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
};
const MAX_REQUEST_BYTES = 8 * 1024 * 1024;
const MAX_RESPONSE_BYTES = 8 * 1024 * 1024;

function unavailable(status = 503) {
  return new Response(JSON.stringify({error:"voice_unavailable"}), {
    status,
    headers:{...NO_STORE,"Content-Type":"application/json; charset=utf-8"},
  });
}
function privateOrigin() {
  const raw = String(Netlify.env.get("SABIK_VOICE_PRIVATE_ORIGIN") || "").trim();
  if (!raw) return null;
  let url;
  try { url = new URL(raw); } catch { return null; }
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) return null;
  return url.origin;
}

export default async (request) => {
  const url = new URL(request.url);
  const expectedMethod = ALLOWED.get(url.pathname);
  if (!expectedMethod || request.method !== expectedMethod || url.search) return unavailable(405);

  const origin = privateOrigin();
  if (!origin || Netlify.env.get("SABIK_VOICE_ENABLED") !== "true") return unavailable();

  let body;
  if (request.method !== "GET") {
    const bytes = await request.arrayBuffer();
    if (!bytes.byteLength || bytes.byteLength > MAX_REQUEST_BYTES) return unavailable(413);
    body = bytes;
  }

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");
  if (contentType) headers.set("content-type", contentType);
  if (accept) headers.set("accept", accept);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);
  try {
    const upstream = await fetch(origin + url.pathname, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
      signal: controller.signal,
    });
    const payload = await upstream.arrayBuffer();
    if (payload.byteLength > MAX_RESPONSE_BYTES) return unavailable(502);
    const responseHeaders = {...NO_STORE};
    const upstreamType = upstream.headers.get("content-type");
    if (upstreamType) responseHeaders["Content-Type"] = upstreamType;
    return new Response(payload, {status: upstream.status, headers: responseHeaders});
  } catch {
    return unavailable();
  } finally {
    clearTimeout(timer);
  }
};

export const config = {
  path: [
    "/sabik-voice/capabilities",
    "/sabik-voice/transcribe",
    "/sabik-voice/synthesize",
  ],
};
