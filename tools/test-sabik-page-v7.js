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
    "V7-001 manual search remains independent from Sabik",
    /<form[^>]+class="sabik-search"[^>]+action="\/es\/biblioteca\/"[^>]+method="get"/u.test(html) &&
      /id="sabik-manual-search"[^>]+name="q"/u.test(html) &&
      !pageJs.includes("#sabik-manual-search"),
    "manual search must submit to Iris Green without Sabik JS"
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
      window.NEACoreV1.normalizeText(html).includes("no guarda historial en v1") &&
      !html.includes("id=\"sabik-no-save\"") &&
      !html.includes("aria-pressed"),
    "v1 has no persistence toggle"
  );

  const baseSession = window.NEACoreV1.createSessionState();
  const lowSession = window.NEACoreV1.setSessionPreferences(baseSession, {
    response_length: "short",
    max_options: 1
  });
  assert(
    "V7-004 lower intensity does not invent Sobrecarga",
    lowSession.cognitive_state === baseSession.cognitive_state &&
      lowSession.sabik_state.low_intensity === true,
    `cognitive_state=${lowSession.cognitive_state}`
  );

  const normalInfo = window.NEACoreV1.buildResponsePlan("Que es el autismo?", baseSession, data).plan;
  const shortInfo = window.NEACoreV1.buildResponsePlan("Que es el autismo?", lowSession, data).plan;
  const normalText = window.NEACoreV1.renderControlledText(normalInfo);
  const shortText = window.NEACoreV1.renderControlledText(shortInfo);
  assert(
    "V7-005 shorter changes length, not source route",
    paragraphCount(shortText) <= paragraphCount(normalText) &&
      normalInfo.source_urls[0] === shortInfo.source_urls[0],
    `normal=${paragraphCount(normalText)} short=${paragraphCount(shortText)}`
  );

  assert(
    "V7-006 Parar clears interaction and keeps page usable",
    pageJs.includes("state.session = window.NEACoreV1.createSessionState();") &&
      pageJs.includes("output.hidden = true;") &&
      !/(localStorage|sessionStorage|indexedDB|document\.cookie)/u.test(pageJs),
    "Parar must reset session-only state without persistent storage"
  );

  const correction = window.NEACoreV1.buildResponsePlan("No es el ruido, es decidir demasiadas cosas", baseSession, data).plan;
  assert(
    "V7-007 explicit correction vetoes the corrected route",
    correction.type === "correction_acknowledged" &&
      correction.vetoed_concepts.includes("ruido") &&
      !correction.concepts_used.includes("ruido"),
    `type=${correction.type}`
  );

  const risk = window.NEACoreV1.buildResponsePlan("Tengo pensamientos suicidas", baseSession, data).plan;
  assert(
    "V7-008 risk replaces ordinary retrieval with accompaniment",
    risk.type === "risk_accompaniment" &&
      risk.normal_flow_disabled === true &&
      risk.communication_open === true &&
      risk.fragments_used.length === 0 &&
      risk.source_urls.length === 0,
    `type=${risk.type}`
  );

  assert(
    "V7-009 rendered sources match approved evidence",
    normalInfo.evidence.length > 0 &&
      normalInfo.source_urls.length > 0 &&
      normalInfo.evidence.every((item) => normalInfo.source_urls.includes(item.source_url)) &&
      normalInfo.fragments_used.every((fragmentId) => normalInfo.evidence.some((item) => item.fragment_id === fragmentId)),
    "source_urls and evidence must refer to the same approved fragments"
  );

  assert(
    "V7-010 Sabik can be hidden while Iris Green remains available",
    html.includes("id=\"sabik-toggle\"") &&
      html.includes("aria-controls=\"sabik-widget-body\"") &&
      css.includes(".sabik-panel.is-collapsed .sabik-widget-body") &&
      pageJs.includes("sabik-panel-collapsed") &&
      html.includes("id=\"sabik-manual-search\""),
    "collapse must affect only Sabik widget body"
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
