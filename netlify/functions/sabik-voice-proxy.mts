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
const EXPECTED_TTS = {
  es: {
    model_id: "SABIK_ES_MASTER_V1_ICL",
    model_sha256: "38fc7fc51c5e776e840414b6fd443962e9411b9654888fd7913e4da643cb857c",
  },
  en: {
    model_id: "SABIK_EN_MASTER_V2_ICL",
    model_sha256: "38fc7fc51c5e776e840414b6fd443962e9411b9654888fd7913e4da643cb857c",
  },
};
const MAX_REQUEST_BYTES = 8 * 1024 * 1024;
const MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
const REVIEW_PRIVATE_ORIGIN = "https://sublime-ripe-authorized-climb.trycloudflare.com";
const EXPECTED_SITE_NAME = "irisgreen-home";

function unavailable(status = 503) {
  return new Response(JSON.stringify({error:"voice_unavailable"}), {
    status,
    headers:{...NO_STORE,"Content-Type":"application/json; charset=utf-8"},
  });
}

function reviewFallbackAllowed(context: any) {
  return context?.deploy?.context === "branch-deploy"
    && String(Netlify.env.get("SITE_NAME") || "") === EXPECTED_SITE_NAME;
}

function privateOrigin(context: any) {
  let raw = String(Netlify.env.get("SABIK_VOICE_PRIVATE_ORIGIN") || "").trim();
  if (!raw && reviewFallbackAllowed(context)) raw = REVIEW_PRIVATE_ORIGIN;
  if (!raw) return null;
  let url;
  try { url = new URL(raw); } catch { return null; }
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) return null;
  return url.origin;
}

function voiceEnabled(context: any) {
  if (Netlify.env.get("SABIK_VOICE_ENABLED") === "true") return true;
  return reviewFallbackAllowed(context);
}

function validCapabilities(raw: any) {
  if (!raw || raw.schema !== "iris-green/sabik-voice-runtime/v1") return false;
  const privacy = raw.privacy || {};
  if (privacy.no_store !== true || privacy.persist_audio !== false || privacy.persist_transcript !== false) return false;
  const stt = raw.stt || {};
  if (stt.self_hosted !== true || !Array.isArray(stt.languages) || !stt.languages.includes("es") || !stt.languages.includes("en")) return false;
  for (const lang of ["es","en"] as const) {
    const actual = raw.tts?.[lang];
    const expected = EXPECTED_TTS[lang];
    if (!actual || actual.self_hosted !== true || actual.model_id !== expected.model_id || actual.model_sha256 !== expected.model_sha256) return false;
  }
  return true;
}

async function verifiedCapabilities(origin: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(origin + "/sabik-voice/capabilities", {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: {Accept:"application/json"},
    });
    if (!response.ok) return null;
    const type = response.headers.get("content-type") || "";
    if (!/^application\/json(?:;|$)/i.test(type)) return null;
    const payload = await response.json();
    return validCapabilities(payload) ? payload : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export default async (request: Request, context: any) => {
  const url = new URL(request.url);
  const expectedMethod = ALLOWED.get(url.pathname);
  if (!expectedMethod || request.method !== expectedMethod || url.search) return unavailable(405);

  const origin = privateOrigin(context);
  if (!origin || !voiceEnabled(context)) return unavailable();

  const capabilities = await verifiedCapabilities(origin);
  if (!capabilities) return unavailable();

  if (url.pathname === "/sabik-voice/capabilities") {
    return new Response(JSON.stringify(capabilities), {
      status: 200,
      headers:{...NO_STORE,"Content-Type":"application/json; charset=utf-8"},
    });
  }

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
