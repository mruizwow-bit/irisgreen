const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "es", "nea", "index.html");
const jsPath = path.join(root, "sabik", "sabik-page.js");
const cssPath = path.join(root, "sabik", "sabik-page.css");

const CORE_FILES = [
  "state.js",
  "knowledge.js",
  "language.js",
  "sabik-state.js",
  "risk.js",
  "corrections.js",
  "session.js",
  "retrieval.js",
  "intent.js",
  "decision.js",
  "response.js"
];

const DATA_PATHS = {
  concepts: "/sabik/assets/NEA/data/concepts.es.json",
  relations: "/sabik/assets/NEA/data/relations.es.json",
  fragmentsIndex: "/sabik/assets/NEA/generated/iris-fragments-index.es.json",
  actions: "/sabik/assets/NEA/data/actions.es.json",
  questions: "/sabik/assets/NEA/data/discriminating-questions.es.json",
  resources: "/sabik/assets/NEA/data/human-resources.es.json",
  corpora: "/sabik/assets/NEA/data/language-corpora.json",
  procedures: "/sabik/assets/NEA/data/procedures.es.json"
};

const results = [];

function read(relOrAbs) {
  return fs.readFileSync(relOrAbs, "utf8");
}

function assert(name, condition, detail = "") {
  results.push({ name, ok: Boolean(condition), detail });
}

function localPathFromUrl(url) {
  const clean = String(url).replace(/^https?:\/\/127\.0\.0\.1:8127/u, "").replace(/^https?:\/\/localhost:8127/u, "");
  return path.join(root, clean.replace(/^\//u, ""));
}

function installCore() {
  global.window = global;
  global.structuredClone = global.structuredClone || ((value) => JSON.parse(JSON.stringify(value)));
  global.fetch = async (url) => {
    const file = localPathFromUrl(url);
    return {
      ok: fs.existsSync(file),
      async json() {
        return JSON.parse(read(file));
      }
    };
  };
  CORE_FILES.forEach((file) => {
    require(path.join(root, "sabik", "nea-core", file));
  });
  require(path.join(root, "sabik", "nea-core.js"));
}

function paragraphCount(text) {
  return String(text || "").split(/\n{2,}/u).filter(Boolean).length;
}

async function run() {
  const html = read(htmlPath);
  const pageJs = read(jsPath);
  const css = read(cssPath);

  installCore();
  const data = await window.NEACoreV1.loadData(DATA_PATHS);

  assert(
    "V7-001 current Iris Green home remains independent from Sabik",
    html.includes("class=\"site-header\"") &&
      html.includes("class=\"brand\"") &&
      html.includes("id=\"search-form\"") &&
      html.includes("id=\"q\"") &&
      html.includes("Empieza por lo que te pasa") &&
      html.includes("data-section=\"situaciones\"") &&
      html.includes("data-section=\"vida\"") &&
      html.includes("data-section=\"ayudas\"") &&
      html.includes("/assets/navigation-approved.css") &&
      html.includes("/assets/navigation-approved.js") &&
      !pageJs.includes("#q") &&
      !pageJs.includes("search-form") &&
      !html.includes("class=\"ig-uh\"") &&
      !html.includes("Escríbelo como lo dirías en voz alta"),
    "Iris shell/search must be the approved current home, not an old ig-* shell or Sabik-owned search"
  );

  assert(
    "V7-002 Sabik starts with a neutral need prompt",
    html.includes("for=\"sabik-input\"") &&
      window.NEACoreV1.normalizeText(html).includes("que necesitas") &&
      /id="sabik-output"[^>]+hidden/u.test(html),
    "initial UI must not assume a need or show a response"
  );

  assert(
    "V7-003 no-memory state is informational, not a persistence switch",
    html.includes("id=\"sabik-memory-note\"") &&
      window.NEACoreV1.normalizeText(html).includes("no guarda historial entre sesiones") &&
      !html.includes("id=\"sabik-no-save\"") &&
      !/<button[^>]+id="sabik-[^"]*"[^>]+aria-pressed/u.test(html),
    "no persistence toggle should be shown"
  );

  const baseSession = window.NEACoreV1.createSessionState();
  const lowSession = window.NEACoreV1.setSessionPreferences(baseSession, {
    low_intensity: true
  });
  const shortSession = window.NEACoreV1.setSessionPreferences(baseSession, {
    response_length: "short",
    max_options: 1
  });
  assert(
    "V7-004 lower intensity does not invent Sobrecarga",
    lowSession.cognitive_state === baseSession.cognitive_state &&
      lowSession.sabik_state.low_intensity === true,
    `cognitive_state=${lowSession.cognitive_state}`
  );
  assert(
    "V7-005 shorter preference does not lower Sabik presence",
    shortSession.cognitive_state === baseSession.cognitive_state &&
      shortSession.sabik_state.low_intensity === false &&
      shortSession.sabik_state.visual_presence === baseSession.sabik_state.visual_presence,
    `short_presence=${shortSession.sabik_state.visual_presence} low=${shortSession.sabik_state.low_intensity}`
  );

  const normalInfo = window.NEACoreV1.buildResponsePlan("Que es el autismo?", baseSession, data).plan;
  const shortInfo = window.NEACoreV1.buildResponsePlan("Que es el autismo?", shortSession, data).plan;
  const normalText = window.NEACoreV1.renderControlledText(normalInfo);
  const shortText = window.NEACoreV1.renderControlledText(shortInfo);
  assert(
    "V7-006 shorter changes length, not source route",
    paragraphCount(shortText) <= paragraphCount(normalText) &&
      normalInfo.source_urls[0] === shortInfo.source_urls[0],
    `normal=${paragraphCount(normalText)} short=${paragraphCount(shortText)}`
  );

  assert(
    "V7-007 pause and explicit reset are separate S1 actions",
    pageJs.includes('control("PAUSE_ASSISTANT"') &&
      pageJs.includes('control("RESUME_ASSISTANT"') &&
      pageJs.includes('control("RESET_SESSION"') &&
      html.includes('id="sabik-reset-session"') &&
      !/(localStorage|sessionStorage|indexedDB|document\.cookie)/u.test(pageJs),
    "Issue #150: pause preserves the session; only explicit reset clears it. Behavior is tested in test-sabik-s1.js."
  );

  const correction = window.NEACoreV1.buildResponsePlan("No es el ruido, es decidir demasiadas cosas", baseSession, data).plan;
  assert(
    "V7-008 explicit correction vetoes the corrected route",
    correction.type === "correction_acknowledged" &&
      correction.vetoed_concepts.includes("ruido") &&
      !correction.concepts_used.includes("ruido"),
    `type=${correction.type}`
  );

  const risk = window.NEACoreV1.buildResponsePlan("Tengo pensamientos suicidas", baseSession, data).plan;
  assert(
    "V7-009 risk replaces ordinary retrieval with accompaniment",
    risk.type === "risk_accompaniment" &&
      risk.normal_flow_disabled === true &&
      risk.communication_open === true &&
      risk.fragments_used.length === 0 &&
      risk.source_urls.length === 0,
    `type=${risk.type}`
  );

  assert(
    "V7-010 rendered sources match approved evidence",
    normalInfo.evidence.length > 0 &&
      normalInfo.source_urls.length > 0 &&
      normalInfo.evidence.every((item) => normalInfo.source_urls.includes(item.source_url)) &&
      normalInfo.fragments_used.every((fragmentId) => normalInfo.evidence.some((item) => item.fragment_id === fragmentId)),
    "source_urls and evidence must refer to the same approved fragments"
  );

  assert(
    "V7-011 Sabik can be hidden while Iris Green remains available",
      html.includes("id=\"sabik-toggle\"") &&
      html.includes("aria-controls=\"sabik-widget-body\"") &&
      html.includes("class=\"sabik-panel\"") &&
      css.includes(".sabik-panel.is-collapsed .sabik-widget-body") &&
      css.includes(".sabik-panel.is-collapsed .sabik-identity") &&
      css.includes("white-space: nowrap") &&
      !pageJs.includes("sabik-panel-collapsed") &&
      !css.includes("body.sabik-panel-collapsed") &&
      !html.includes("body.sabik-panel-collapsed") &&
      html.includes("id=\"search-form\"") &&
      html.includes("id=\"q\""),
    "collapse must affect only Sabik, keep the button readable, and avoid global body layout side effects"
  );

  assert(
    "V7-012 Sabik uses layered 2D/2.5D assets, not Meshy GLB",
    html.includes("id=\"sabik-hologram\"") &&
      html.includes("src=\"/sabik/assets/sabik-base-640.webp\"") &&
      html.includes("class=\"sabik-back\"") &&
      html.includes("class=\"sabik-front\"") &&
      !html.includes("sabik-hologram-v1.png") &&
      !html.includes(".glb") &&
      css.includes("isolation: isolate") &&
      css.includes("#rings-back") &&
      css.includes("#rings-front") &&
      css.includes("624.4px 609.4px"),
    "Sabik visual must use measured inline SVG orbits plus one measured base raster, without model swapping"
  );

  assert(
    "V7-013 Sabik does not embed SVG layers as img files",
    html.includes("class=\"sabik-back\"") &&
      html.includes("class=\"sabik-front\"") &&
      !/<img[^>]+\.svg/u.test(html),
    "orbits must be inline SVG so rings and dots remain addressable by CSS/JS"
  );

  assert(
    "V7-014 Sabik exposes all measured ring ids",
    Array.from({ length: 12 }, (_, index) => `id=\"ring-${index + 1}\"`).every((id) => html.includes(id)),
    "ring-1 through ring-12 must exist in the inline SVG"
  );

  assert(
    "V7-015 Sabik keeps one base raster across states",
    html.includes("src=\"/sabik/assets/sabik-base-640.webp\"") &&
      !/sabik-hologram[\s\S]{0,300}\.src\s*=/u.test(pageJs) &&
      !pageJs.includes("setAttribute(\"src\"") &&
      !pageJs.includes("sabik-base-640"),
    "states may change visual parameters, not swap the avatar base image"
  );

  assert(
    "V7-016 reduced motion stops measured orbit groups",
    css.includes("@media (prefers-reduced-motion: reduce)") &&
      css.includes("#rings-back") &&
      css.includes("#rings-front") &&
      css.includes("animation: none !important"),
    "prefers-reduced-motion must remove continuous motion from the measured orbit layers"
  );

  assert(
    "V7-017 cognitive states do not drive Sabik visual presence",
    html.includes('data-cognitive-state="NucleoBase"') &&
      pageJs.includes("normalizeCognitiveState") &&
      pageJs.includes("dataset.cognitiveState") &&
      !css.includes("data-cognitive-state"),
    "cognitive_state may be carried for audit, but CSS must not style the hologram from inferred state"
  );

  assert(
    "V7-018 low intensity is a modifier and keeps cognitive state",
    lowSession.cognitive_state === baseSession.cognitive_state &&
      lowSession.sabik_state.low_intensity === true &&
      css.includes('[data-low-intensity="true"]'),
    `cognitive_state=${lowSession.cognitive_state}`
  );

  assert(
    "V7-019 processing and pause are functional visual states",
      pageJs.includes('applySabikVisual(state.session && state.session.sabik_state, "procesando")') &&
      pageJs.includes('applySabikVisual(state.session.sabik_state, "pausa")') &&
      pageJs.includes("state.paused = true;") &&
      pageJs.includes("state.paused = false;") &&
      pageJs.includes("syncPauseButton(true)") &&
      pageJs.includes("syncPauseButton(false)") &&
      pageJs.includes('button.textContent = paused ? "Reanudar" : "Parar"') &&
      css.includes('[data-interaction-state="procesando"]') &&
      css.includes('[data-interaction-state="pausa"]') &&
      css.includes("--sabik-layer-speed: 72s;") &&
      css.includes("--sabik-wave-opacity: .42;"),
    "Enviar and Parar must affect functional motion, pause must stay gently alive, and Reanudar must recover"
  );

  assert(
    "V7-020 risk visual is stable, not alarm red",
    css.includes('[data-protection-state="riesgo"]') &&
      !/sabik-hologram[\s\S]{0,400}#(?:f00|ff0000|8f1d1d|d00)/iu.test(css) &&
      !css.includes("blink") &&
      !css.includes("shake"),
    "risk must simplify and stabilize the hologram without alarm colors or effects"
  );

  assert(
    "V7-021 reduced motion removes continuous orbital movement",
    css.includes("@media (prefers-reduced-motion: reduce)") &&
      css.includes(".sabik-hologram *") &&
      css.includes("animation: none !important"),
    "reduced motion must stop continuous rotation and pulsing"
  );

  assert(
    "V7-022 Sabik ignores passive behavioral signals",
    !/addEventListener\(\s*["'](?:keydown|keyup|input|beforeinput|composition|scroll|mousemove|pointermove|touchmove|visibilitychange|deviceorientation)["']/u.test(pageJs) &&
      !/(getUserMedia|SpeechRecognition|webkitSpeechRecognition)/u.test(pageJs),
    "visual changes may only come from Core state, explicit buttons/forms, or functional interaction"
  );

  const shortPreferenceOnly = window.NEACoreV1.buildResponsePlan("Quiero informacion corta sobre apoyos", lowSession, data);
  const tooManyOptions = window.NEACoreV1.buildResponsePlan("Hay demasiadas opciones aqui", baseSession, data);
  assert(
    "V7-023 preferences and loose words do not infer Sobrecarga",
    shortPreferenceOnly.session.cognitive_state === baseSession.cognitive_state &&
      tooManyOptions.session.cognitive_state === baseSession.cognitive_state,
    `short=${shortPreferenceOnly.session.cognitive_state} loose=${tooManyOptions.session.cognitive_state}`
  );

  assert(
    "V7-024 Sabik preview page is noindex until approved for publication",
    html.includes('name="robots"') &&
      html.includes('content="noindex,follow"') &&
      !html.includes('content="index,follow"'),
    "the preview page must not be indexable while Sabik remains under review"
  );

  assert(
    "V7-025 Sabik CSS is panel-scoped and does not restyle Iris home",
    !/(^|\n)html,\s*\r?\nbody\s*\{/u.test(css) &&
      !/(^|\n)body\s*\{[\s\S]{0,180}background\s*:/u.test(css) &&
      !/(^|\n)a\s*\{/u.test(css) &&
      css.includes(".sabik-panel {") &&
      css.includes(".sabik-panel button"),
    "Sabik CSS must not redefine global body, link, or page background styles"
  );

  const headIndex = html.indexOf('class="sabik-widget-head"');
  const bodyIndex = html.indexOf('id="sabik-widget-body"');
  const hologramIndex = html.indexOf('id="sabik-hologram"');
  assert(
    "V7-026 canonical hologram stays in the panel body",
    headIndex >= 0 &&
      bodyIndex > headIndex &&
      hologramIndex > bodyIndex &&
      !html.slice(headIndex, bodyIndex).includes('id="sabik-hologram"') &&
      html.includes('class="sabik-head-mark"'),
    "the full canonical hologram must not be reduced to the header identity mark"
  );

  assert(
    "V7-027 Sabik has living motion and voice waves",
      css.includes("--sabik-layer-speed: 36s;") &&
      css.includes("sabikAvatarBreath") &&
      css.includes("sabikVoiceRipple") &&
      css.includes("sabikPresenceWave") &&
      css.includes('[data-interaction-state="procesando"]') &&
      css.includes("--sabik-layer-speed: 14s;") &&
      css.includes("--sabik-wave-speed: 1.35s;") &&
      css.includes('.sabik-layered-avatar[data-interaction-state="pausa"]') &&
      css.includes("--sabik-layer-speed: 72s;") &&
      css.includes("--sabik-base-pulse-speed: 6.2s;") &&
      css.includes('[data-protection-state="riesgo"],') &&
      css.includes("--sabik-layer-motion: paused;") &&
      css.includes('[data-low-intensity="true"]') &&
      css.includes("--sabik-layer-speed: 52s;") &&
      css.includes("--sabik-base-pulse-speed: 5.8s;") &&
      css.includes("--sabik-wave-opacity: .42;") &&
      css.includes("body.sabik-low-stim .sabik-hologram") &&
      css.includes("opacity: .96;"),
    "base motion and voice waves must be visible; low intensity softens instead of killing Sabik"
  );

  assert(
    "V7-028 low intensity is explicit and reversible",
    pageJs.includes("low_intensity: !isLowIntensity") &&
      pageJs.includes('button.textContent = lowIntensity ? "Subir intensidad" : "Bajar intensidad"') &&
      pageJs.includes('button.setAttribute("aria-pressed", String(lowIntensity))') &&
      pageJs.includes("Intensidad normal activada."),
    "Bajar intensidad must toggle back to normal instead of permanently dimming Sabik"
  );

  const failures = results.filter((item) => !item.ok);
  results.forEach((item) => {
    console.log(`${item.ok ? "PASS" : "FAIL"} ${item.name}${item.detail ? ` - ${item.detail}` : ""}`);
  });
  console.log(`\n${results.length - failures.length}/${results.length} validations passed`);
  if (failures.length) process.exitCode = 1;
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
