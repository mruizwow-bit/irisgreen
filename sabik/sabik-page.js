(() => {
  const CORE_SCRIPTS = [
    "/sabik/nea-core/state.js",
    "/sabik/nea-core/knowledge.js",
    "/sabik/nea-core/language.js",
    "/sabik/nea-core/sabik-state.js",
    "/sabik/nea-core/risk.js",
    "/sabik/nea-core/corrections.js",
    "/sabik/nea-core/session.js",
    "/sabik/nea-core/retrieval.js",
    "/sabik/nea-core/intent.js",
    "/sabik/nea-core/decision.js",
    "/sabik/nea-core/response.js",
    "/sabik/nea-core.js"
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

  const state = {
    data: null,
    session: null,
    lastInput: "",
    lastPlan: null,
    coreReady: false,
    paused: false
  };

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
      document.head.appendChild(script);
    });
  }

  async function loadCore() {
    for (const src of CORE_SCRIPTS) {
      await loadScript(src);
    }
    if (!window.NEACoreV1) throw new Error("NEA Core v1 no está disponible.");
    state.session = window.NEACoreV1.createSessionState();
    state.coreReady = true;
  }

  function text(selector, value) {
    const node = document.querySelector(selector);
    if (node) node.textContent = value;
  }

  function ensurePanelPlacement() {
    const composition =
      document.querySelector(".sabik-home-with-panel") ||
      document.querySelector(".sabik-iris-root") ||
      document.querySelector(".sabik-iris-composition");
    const panel = document.querySelector(".sabik-panel");
    if (!composition || !panel || panel.parentElement === composition) return;
    composition.appendChild(panel);
  }

  function normalizeCognitiveState(value) {
    const allowed = new Set(["NucleoBase", "Hiperfoco", "Sobrecarga", "Vinculo", "VozInterior", "Creatividad"]);
    return allowed.has(value) ? value : "NucleoBase";
  }

  function applySabikVisual(sabikState, interaction = "espera") {
    const hologram = document.querySelector("#sabik-hologram");
    if (!hologram) return;
    const lowIntensity = Boolean(sabikState && sabikState.low_intensity);
    hologram.dataset.cognitiveState = normalizeCognitiveState(sabikState && sabikState.cognitive_state);
    hologram.dataset.interactionState = interaction;
    hologram.dataset.protectionState = sabikState && sabikState.protection === "riesgo" ? "riesgo" : "normal";
    hologram.dataset.lowIntensity = String(lowIntensity);
  }

  function syncLowIntensityButton(sabikState) {
    const button = document.querySelector("#sabik-low");
    if (!button) return;
    const lowIntensity = Boolean(sabikState && sabikState.low_intensity);
    button.textContent = lowIntensity ? "Subir intensidad" : "Bajar intensidad";
    button.setAttribute("aria-pressed", String(lowIntensity));
  }

  function syncPauseButton(paused) {
    const button = document.querySelector("#sabik-clear");
    if (!button) return;
    button.textContent = paused ? "Reanudar" : "Parar";
    button.setAttribute("aria-pressed", String(paused));
  }

  function setStatus(message, visual = "base") {
    text("#sabik-status-text", message);
    const presence = document.querySelector("#sabik-presence");
    if (presence) presence.dataset.state = visual;
  }

  function visualState(sabikState) {
    if (!sabikState) return "base";
    if (sabikState.protection === "riesgo") return "risk";
    if (sabikState.visual_presence === "minima" || sabikState.visual_presence === "estatica") return "minimal";
    return "base";
  }

  function renderSabikState(sabikState, fallbackText, interaction = "espera") {
    if (interaction !== "pausa") {
      state.paused = false;
      syncPauseButton(false);
    }
    document.body.classList.toggle("sabik-low-stim", Boolean(sabikState && sabikState.low_intensity));
    applySabikVisual(sabikState, interaction);
    syncLowIntensityButton(sabikState);
    setStatus(fallbackText, visualState(sabikState));
  }

  function setLoading(isLoading) {
    const submit = document.querySelector("#sabik-submit");
    if (submit) submit.disabled = isLoading;
    if (isLoading) {
      state.paused = false;
      syncPauseButton(false);
      applySabikVisual(state.session && state.session.sabik_state, "procesando");
      setStatus("Sabik está buscando en Iris Green.", "minimal");
    }
  }

  function clearSources() {
    const list = document.querySelector("#sabik-sources");
    const title = document.querySelector("#sabik-source-title");
    if (!list || !title) return;
    while (list.firstChild) list.removeChild(list.firstChild);
    title.hidden = true;
  }

  // Texto del enlace: la ruta de la ficha, no la URL completa, que rompe la columna.
  // Cuando el Core exponga source_titles, este enlace mostrará el título de la ficha.
  function readableSource(url) {
    try {
      return new URL(url, location.origin).pathname;
    } catch (_) {
      return url;
    }
  }

  function renderSources(plan) {
    clearSources();
    const list = document.querySelector("#sabik-sources");
    const title = document.querySelector("#sabik-source-title");
    if (!list || !title || !plan.source_urls.length) return;
    title.hidden = false;
    plan.source_urls.forEach((url) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = url;
      link.textContent = readableSource(url);
      item.appendChild(link);
      list.appendChild(item);
    });
  }

  function renderPlan(plan) {
    state.lastPlan = plan;
    const output = document.querySelector("#sabik-output");
    const answer = document.querySelector("#sabik-answer");
    const notice = document.querySelector("#sabik-notice");
    if (!output || !answer || !notice) return;

    output.hidden = false;
    answer.className = "sabik-answer";
    if (plan.type === "risk_accompaniment" || plan.type === "ambiguous_risk_clarification") {
      answer.classList.add("is-risk");
      renderSabikState(plan.sabik_state, "Sabik mantiene acompañamiento y escucha.", "respuesta");
    } else if (plan.type === "insufficient_information") {
      answer.classList.add("is-warning");
      renderSabikState(plan.sabik_state, "Sabik no tiene fuente suficiente.", "respuesta");
    } else {
      renderSabikState(plan.sabik_state, "Sabik ha preparado una respuesta.", "respuesta");
    }
    // La fuente va abajo como enlace: el texto no la repite en crudo.
    answer.textContent = window.NEACoreV1.renderControlledText(plan)
      .replace(/\s*Fuente:\s*\S+\s*$/, "")
      .trim();
    // La memoria ya se dice bajo el campo; aquí solo el límite, si lo hay.
    notice.textContent = plan.limits_notice || "";
    renderSources(plan);
  }

  async function ensureData() {
    if (!state.coreReady) await loadCore();
    if (!state.data) state.data = await window.NEACoreV1.loadData(DATA_PATHS);
  }

  async function runNeed(value) {
    await ensureData();
    const result = window.NEACoreV1.buildResponsePlan(value, state.session, state.data);
    state.session = result.session;
    renderPlan(result.plan);
  }

  function bind() {
    const form = document.querySelector("#sabik-form");
    const input = document.querySelector("#sabik-input");
    const output = document.querySelector("#sabik-output");
    const answer = document.querySelector("#sabik-answer");
    const notice = document.querySelector("#sabik-notice");

    if (!form || !input || !output || !answer || !notice) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const value = input.value.trim();
      if (!value) return;
      state.lastInput = value;
      try {
        setLoading(true);
        await runNeed(value);
      } catch (error) {
        output.hidden = false;
        answer.className = "sabik-answer is-warning";
        answer.textContent = "No he podido cargar los datos locales de Sabik.";
        notice.textContent = error.message;
        setStatus("Sabik encontró un error técnico.", "minimal");
      } finally {
        setLoading(false);
      }
    });

    document.querySelector("#sabik-low")?.addEventListener("click", () => {
      if (!state.coreReady) return;
      const isLowIntensity = Boolean(state.session && state.session.sabik_state && state.session.sabik_state.low_intensity);
      state.session = window.NEACoreV1.setSessionPreferences(state.session, {
        low_intensity: !isLowIntensity
      });
      renderSabikState(
        state.session.sabik_state,
        isLowIntensity ? "Intensidad normal activada." : "Baja intensidad activada."
      );
    });

    document.querySelector("#sabik-clear")?.addEventListener("click", () => {
      if (!window.NEACoreV1) return;
      if (state.paused) {
        state.paused = false;
        syncPauseButton(false);
        applySabikVisual(state.session && state.session.sabik_state, "espera");
        setStatus("Sabik vuelve a estar disponible.", "base");
        text("#sabik-state-label", "Disponible");
        return;
      }
      input.value = "";
      output.hidden = true;
      clearSources();
      state.session = window.NEACoreV1.createSessionState();
      state.lastInput = "";
      state.lastPlan = null;
      state.paused = true;
      syncLowIntensityButton(state.session.sabik_state);
      syncPauseButton(true);
      applySabikVisual(state.session.sabik_state, "pausa");
      setStatus("Sabik queda en pausa. No se ha guardado historial.", "minimal");
    });

    document.querySelector("#sabik-shorter")?.addEventListener("click", async () => {
      if (!state.coreReady) return;
      state.session = window.NEACoreV1.setSessionPreferences(state.session, {
        response_length: "short",
        max_options: 1
      });
      if (state.lastInput) await runNeed(state.lastInput);
      else renderSabikState(state.session.sabik_state, "Respuesta más corta activada.");
    });

    document.querySelector("#sabik-not-this")?.addEventListener("click", () => {
      if (!state.coreReady) return;
      state.session = window.NEACoreV1.registerPlanRejection(state.session, state.lastPlan, "no_es_esto");
      output.hidden = false;
      answer.className = "sabik-answer";
      answer.textContent = "Entendido. Retiro esta vía. Puedes escribir una corrección concreta.";
      notice.textContent = "La corrección explícita pesa más que la inferencia.";
      clearSources();
      renderSabikState(state.session.sabik_state, "Sabik espera una corrección.", "correccion");
    });

    document.querySelector("#sabik-other-way")?.addEventListener("click", async () => {
      if (!state.coreReady) return;
      state.session = window.NEACoreV1.registerPlanRejection(state.session, state.lastPlan, "buscar_otra_via");
      if (state.lastPlan && state.lastPlan.fragments_used && state.lastPlan.fragments_used.length && state.lastInput) {
        await runNeed(state.lastInput);
        return;
      }
      output.hidden = false;
      answer.className = "sabik-answer";
      answer.textContent = "Para buscar por otra vía necesito una aclaración breve: qué quieres retirar o probar ahora.";
      notice.textContent = "No repito la misma respuesta si no hay una vía real que cambiar.";
      clearSources();
      renderSabikState(state.session.sabik_state, "Sabik necesita una aclaración para cambiar de vía.", "correccion");
    });

    document.querySelector("#sabik-toggle")?.addEventListener("click", (event) => {
      const button = event.currentTarget;
      const panel = document.querySelector(".sabik-panel");
      const widgetBody = document.querySelector("#sabik-widget-body");
      const collapsed = !panel.classList.contains("is-collapsed");
      panel.classList.toggle("is-collapsed", collapsed);
      if (widgetBody) widgetBody.hidden = collapsed;
      button.setAttribute("aria-expanded", String(!collapsed));
      button.textContent = collapsed ? "Mostrar" : "Ocultar";
      if (!collapsed) state.paused = false;
      applySabikVisual(state.session && state.session.sabik_state, collapsed ? "pausa" : "espera");
      // Plegado, el estado vive en la cabecera: es lo único que queda visible.
      text("#sabik-state-label", collapsed ? "Oculto" : "Disponible");
      if (!collapsed) setStatus("Estoy aquí si quieres ayuda.");
    });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    ensurePanelPlacement();
    bind();
    try {
      await loadCore();
      renderSabikState(state.session.sabik_state, "Estoy aquí si quieres ayuda.");
    } catch (error) {
      setStatus("Sabik no pudo cargar el Core.", "minimal");
      text("#sabik-notice", error.message);
    }
  });
})();
