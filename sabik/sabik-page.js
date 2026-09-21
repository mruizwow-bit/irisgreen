(() => {
  const CORE_SCRIPTS = [
    "/sabik/nea-core/sabik-browser-adapter.js",
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
    failedInput: "",
    lastPlan: null,
    coreReady: false,
    paused: false,
    machine: null,
    presentation: null,
    adapter: null,
    corePromise: null,
    dataPromise: null,
    pending: false,
    controlBusy: false,
    generation: 0
  };
  const EN = {
    "Sabik": "Sabik",
    "IA": "AI",
    "Asistente de Iris Green": "Iris Green assistant",
    "Disponible": "Available",
    "En pausa": "Paused",
    "Oculto": "Hidden",
    "Ocultar": "Hide",
    "Mostrar": "Show",
    "¿Qué necesitas?": "What do you need?",
    "Hasta 2000 caracteres. Enter añade una línea; Ctrl+Enter envía.": "Up to 2000 characters. Enter adds a line; Ctrl+Enter sends.",
    "Enviar": "Send",
    "Bajar intensidad": "Lower intensity",
    "Subir intensidad": "Raise intensity",
    "Más corto": "Shorter",
    "No me preguntes": "Do not ask me questions",
    "Dame una opción": "Give me one option",
    "Explícamelo de otra forma": "Explain it another way",
    "Reintentar carga de datos": "Retry loading data",
    "Algunos datos opcionales no están disponibles. La búsqueda básica sigue funcionando.": "Some optional data is unavailable. Basic search still works.",
    "Preferencia de respuesta aplicada.": "Response preference applied.",
    "Pausar Sabik": "Pause Sabik",
    "Reanudar": "Resume",
    "Empezar de nuevo": "Start again",
    "No es esto": "Not this",
    "Buscar por otra vía": "Try another approach",
    "Escribir otra consulta": "Write another question",
    "Respuesta de Sabik": "Sabik response",
    "De dónde sale": "Sources",
    "Si esta respuesta no encaja": "If this response does not fit",
    "Sabik, esfera holográfica iris y lavanda": "Sabik, iris and lavender holographic sphere",
    "Ejemplo: cuando vuelvo de comprar no puedo con nadie": "Example: when I get back from shopping, I cannot cope with anyone",
    "La consulta supera los 2000 caracteres. Acórtala para enviarla; tu texto se conserva.": "Your question exceeds 2000 characters. Shorten it to send; your text is kept.",
    "Puedo buscar en Iris Green y explicarlo más simple. No hago diagnósticos.": "I can search Iris Green and explain things more simply. I do not diagnose.",
    "No guarda historial entre sesiones.": "No conversation history is kept between sessions.",
    "Sabik puede cometer errores. Comprueba la información importante en las fuentes oficiales.": "Sabik can make mistakes. Check important information against official sources.",
    "Estoy aquí si quieres ayuda.": "I am here if you would like help.",
    "Sabik está buscando en Iris Green.": "Sabik is searching Iris Green.",
    "Sabik mantiene acompañamiento y escucha.": "Sabik continues to offer support and listen.",
    "Sabik no tiene fuente suficiente.": "Sabik does not have sufficient source information.",
    "Sabik ha preparado una respuesta.": "Sabik has prepared a response.",
    "Respuesta de Sabik disponible.": "Sabik response available.",
    "No he podido cargar los datos locales. Puedes volver a enviar tu consulta.": "I could not load the local data. You can send your question again.",
    "Intensidad normal activada.": "Normal intensity enabled.",
    "Baja intensidad activada.": "Low intensity enabled.",
    "Esta acción no está disponible en el estado actual.": "This action is not available in the current state.",
    "Sabik está en pausa. Tu entrada y tu respuesta siguen aquí.": "Sabik is paused. Your input and response are still here.",
    "Sabik está en pausa.": "Sabik is paused.",
    "Sabik vuelve a estar disponible.": "Sabik is available again.",
    "Conversación reiniciada. Puedes escribir una nueva consulta.": "Conversation restarted. You can write a new question.",
    "Conversación reiniciada.": "Conversation restarted.",
    "Respuesta más corta activada.": "Shorter responses enabled.",
    "Entendido. Retiro esta vía. Puedes escribir una corrección concreta.": "Understood. I will withdraw this approach. You can write a specific correction.",
    "La corrección explícita pesa más que la inferencia.": "An explicit correction takes precedence over an inference.",
    "Sabik espera una corrección.": "Sabik is waiting for a correction.",
    "Para buscar por otra vía necesito una aclaración breve: qué quieres retirar o probar ahora.": "To try another approach, I need a brief clarification: what would you like to withdraw or try now?",
    "No repito la misma respuesta si no hay una vía real que cambiar.": "I will not repeat the same response if there is no different approach to try.",
    "Sabik necesita una aclaración para cambiar de vía.": "Sabik needs clarification to try another approach.",
    "Sabik no pudo cargar el Core.": "Sabik could not load its local engine.",
    "Sabik no pudo iniciarse. Puedes seguir usando la navegación de Iris Green.": "Sabik could not start. You can still use Iris Green navigation."
  };
  const uiStrings = new Map();
  const uiAttributes = [];
  const pageLanguage = () => document.documentElement.lang.toLowerCase().startsWith("en") ? "en" : "es";
  const translate = value => pageLanguage() === "en" ? (EN[value] || value) : value;
  function uiText(node, value) {
    if (!node) return;
    uiStrings.set(node, value);
    node.removeAttribute("lang");
    node.textContent = translate(value);
  }
  function localizePanel() {
    const panel = document.querySelector(".sabik-panel");
    panel.lang = pageLanguage();
    document.querySelector("#sabik-content-language").hidden = pageLanguage() !== "en";
    for (const [node, value] of uiStrings) node.textContent = translate(value);
    for (const item of uiAttributes) item.node.setAttribute(item.name, translate(item.value));
  }
  function bindPanelLanguage() {
    const panel = document.querySelector(".sabik-panel");
    const selectors = "#sabik-widget-title, .sabik-badge, .sabik-subtitle, #sabik-state-label, #sabik-status-text, .sabik-capability, label[for='sabik-input'], #sabik-input-help, #sabik-input-error, #sabik-output-title, #sabik-source-title, .sabik-memory-note, .sabik-limits, button";
    for (const node of panel.querySelectorAll(selectors)) {
      if (node.id !== "sabik-content-language") uiText(node, node.textContent);
    }
    for (const node of [panel, ...panel.querySelectorAll('[aria-label], [placeholder]')]) {
      for (const name of ['aria-label', 'placeholder']) if (node.hasAttribute(name)) uiAttributes.push({node,name,value:node.getAttribute(name)});
    }
    localizePanel();
    let previous = pageLanguage();
    new MutationObserver(() => {
      if (pageLanguage() === previous) return;
      previous = pageLanguage();
      // Clear the old brief status instead of replaying it in another language.
      document.querySelector('#sabik-announcement').replaceChildren();
      localizePanel();
    }).observe(document.documentElement, {attributes:true,attributeFilter:['lang']});
  }
  const INPUT_LIMIT = 2000;
  const canPause = () => state.machine && ["ready", "retrieving", "composing", "presenting", "awaiting_clarification"].includes(state.machine.operation);
  const unavailable = () => !state.coreReady || state.paused || state.pending || state.controlBusy;

  function focus(selector) {
    const node = document.querySelector(selector);
    if (!node || node.hidden || node.disabled) return;
    node.focus({ preventScroll: true });
    node.scrollIntoView({ block: "nearest" });
  }

  function announce(message) {
    const complete = translate(message).replace(/\s+/gu, " ").trim();
    if (!complete) return;
    const region = document.querySelector("#sabik-announcement");
    if (region) region.replaceChildren(document.createTextNode(complete));
  }

  function syncControls() {
    const disabled = unavailable();
    for (const id of ["low", "shorter", "not-this", "other-way"]) {
      const node = document.querySelector(`#sabik-${id}`);
      if (node) node.disabled = disabled;
    }
    // S4 actions keep native focus while pending; their handlers still guard reentry.
    for (const id of ["no-questions", "one-option", "rephrase", "retry-data"]) {
      const node = document.querySelector(`#sabik-${id}`);
      if (!node) continue;
      node.disabled = !state.coreReady || state.paused || state.controlBusy;
      if (state.pending && !node.disabled) node.setAttribute("aria-disabled", "true");
      else node.removeAttribute("aria-disabled");
    }
    const submit = document.querySelector("#sabik-submit");
    if (submit) {
      // Pending must not blur Send. The submit handler's state guard blocks retries.
      submit.disabled = !state.coreReady || state.paused || state.controlBusy;
      if (state.pending && !submit.disabled) submit.setAttribute("aria-disabled", "true");
      else submit.removeAttribute("aria-disabled");
    }
    const pause = document.querySelector("#sabik-clear");
    const resume = document.querySelector("#sabik-resume");
    if (pause) { pause.hidden = state.paused; pause.disabled = !state.coreReady || state.controlBusy || !canPause(); }
    if (resume) { resume.hidden = !state.paused; resume.disabled = !state.coreReady || state.controlBusy; }
    const reset = document.querySelector("#sabik-reset-session");
    if (reset) reset.disabled = !state.coreReady || state.controlBusy || state.machine.operation === "booting";
    const toggle = document.querySelector("#sabik-toggle");
    if (toggle) toggle.disabled = !state.coreReady || state.controlBusy;
    const panel = document.querySelector(".sabik-panel");
    if (panel && state.presentation) {
      panel.dataset.operation = state.presentation.operation;
      panel.dataset.visibility = state.machine.visibility;
    }
    const output = document.querySelector("#sabik-output");
    if (output) output.setAttribute("aria-busy", String(state.pending));
  }

  async function dispatch(event) {
    const next = await state.adapter.dispatch(event);
    state.machine = next.state;
    state.presentation = next.presentation;
    state.paused = state.presentation.operation === "paused";
    syncPauseButton(state.paused);
    syncControls();
  }

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
    if (!state.corePromise) state.corePromise = (async () => {
      for (const src of CORE_SCRIPTS) await loadScript(src);
      if (!window.NEACoreV1) throw new Error("NEA Core v1 no está disponible.");
      state.adapter = await window.SabikBrowserAdapter.create();
      state.machine = state.adapter.initial.state;
      state.session = window.NEACoreV1.createSessionState();
      await dispatch({ type: "BOOT_OK" });
      state.coreReady = true;
      syncControls();
    })();
    return state.corePromise;
  }

  function text(selector, value) {
    const node = document.querySelector(selector);
    uiText(node, value);
  }

  function ensurePanelPlacement() {
    // The accessible source order is authored in HTML; never reorder by script.
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
    uiText(button, lowIntensity ? "Subir intensidad" : "Bajar intensidad");
    button.setAttribute("aria-pressed", String(lowIntensity));
  }

  function syncPauseButton(paused) {
    const button = document.querySelector("#sabik-clear");
    if (!button) return;
    uiText(button, "Pausar Sabik");
    button.hidden = paused;
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
    if (state.paused) interaction = "pausa";
    document.body.classList.toggle("sabik-low-stim", Boolean(sabikState && sabikState.low_intensity));
    applySabikVisual(sabikState, interaction);
    syncLowIntensityButton(sabikState);
    setStatus(fallbackText, visualState(sabikState));
  }

  function setLoading(isLoading) {
    state.pending = isLoading;
    syncControls();
    if (isLoading) {
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
    uiStrings.delete(answer);
    uiStrings.delete(notice);
    answer.lang = "es";
    notice.lang = "es";
    answer.textContent = window.NEACoreV1.renderControlledText(plan)
      .replace(/\s*Fuente:\s*\S+\s*$/, "")
      .trim();
    // La memoria ya se dice bajo el campo; aquí solo el límite, si lo hay.
    notice.textContent = plan.limits_notice || "";
    renderSources(plan);
  }

  async function ensureData() {
    if (!state.coreReady) await loadCore();
    if (!state.dataPromise) state.dataPromise = window.NEACoreV1.loadData(DATA_PATHS, state.data).catch((error) => {
      state.dataPromise = null;
      throw error;
    });
    state.data = await state.dataPromise;
  }

  function renderDataAvailability() {
    const degraded = Object.values(state.data.availability || {}).some(item =>
      ["technical_error", "resource_unavailable"].includes(item.status));
    const note = document.querySelector("#sabik-data-notice");
    note.hidden = !degraded;
    uiText(note, degraded ? "Algunos datos opcionales no están disponibles. La búsqueda básica sigue funcionando." : "");
    document.querySelector("#sabik-retry-data").hidden = !degraded;
  }

  async function runNeed(value, conversationControl = null) {
    if (unavailable()) return;
    const generation = ++state.generation;
    // Lock synchronously, before any await: disabled styling is not a mutex.
    setLoading(true);
    const current = () => generation === state.generation && !state.paused;
    let finalStatus = "";
    try {
      if (state.machine.operation === "error") await dispatch({ type: "RETRY" });
      if (!current()) return;
      await dispatch({ type: "SUBMIT" });
      await ensureData();
      if (!current()) return;
      renderDataAvailability();
      const result = conversationControl
        ? window.NEACoreV1.applyResponseControl(state.session, state.lastPlan, conversationControl, state.data)
        : window.NEACoreV1.buildResponsePlan(value, state.session, state.data);
      // S1 maps only the existing ordinary lifecycle. Risk classification and
      // editorial output are unchanged; safety integration belongs to S3.
      if (result.plan.type === "insufficient_information") await dispatch({ type: "RETRIEVAL_EMPTY" });
      else {
        await dispatch({ type: "RETRIEVAL_OK" });
        if (!current()) return;
        if (result.plan.type === "clarifying_question") await dispatch({ type: "ASK_CLARIFICATION" });
        else await dispatch({ type: "RESPONSE_READY", dialogue: "information" });
      }
      if (!current()) return;
      state.session = result.session;
      state.lastInput = result.session.topic_query || value;
      state.failedInput = "";
      renderPlan(result.plan);
      finalStatus = "Respuesta de Sabik disponible.";
    } catch (error) {
      if (!current()) return;
      await dispatch({ type: "TECHNICAL_ERROR" });
      if (!current()) return;
      state.failedInput = value;
      const message = "No he podido cargar los datos locales. Puedes volver a enviar tu consulta.";
      setStatus(message, "minimal");
      document.querySelector("#sabik-output").hidden = false;
      const answer = document.querySelector("#sabik-answer");
      answer.className = "sabik-answer is-warning";
      uiText(answer, message);
      uiText(document.querySelector("#sabik-notice"), "");
      clearSources();
      document.querySelector("#sabik-retry-data").hidden = false;
      finalStatus = message;
    } finally {
      if (generation === state.generation) {
        setLoading(false);
        if (finalStatus && current()) announce(finalStatus);
      }
    }
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
      if (!value || unavailable()) return;
      const tooLong = Array.from(input.value).length > INPUT_LIMIT;
      const error = document.querySelector("#sabik-input-error");
      error.hidden = !tooLong;
      input.setAttribute("aria-invalid", String(tooLong));
      if (tooLong) {
        focus("#sabik-input");
        announce(error.textContent);
        return;
      }
      await runNeed(value);
    });
    input.addEventListener("input", () => {
      if (Array.from(input.value).length <= INPUT_LIMIT) {
        input.setAttribute("aria-invalid", "false");
        document.querySelector("#sabik-input-error").hidden = true;
      }
    });
    document.querySelector("#sabik-write-again")?.addEventListener("click", () => focus("#sabik-input"));
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        form.requestSubmit();
      }
    });

    document.querySelector("#sabik-low")?.addEventListener("click", () => {
      if (unavailable()) return;
      const isLowIntensity = Boolean(state.session && state.session.sabik_state && state.session.sabik_state.low_intensity);
      state.session = window.NEACoreV1.setSessionPreferences(state.session, {
        low_intensity: !isLowIntensity
      });
      renderSabikState(
        state.session.sabik_state,
        isLowIntensity ? "Intensidad normal activada." : "Baja intensidad activada."
      );
    });

    async function control(event, after) {
      if (!state.coreReady || state.controlBusy) return;
      state.controlBusy = true;
      ++state.generation;
      syncControls();
      try {
        await dispatch({ type: event });
        state.pending = false;
        after();
      } catch (_) {
        announce("Esta acción no está disponible en el estado actual.");
      } finally {
        state.controlBusy = false;
        syncControls();
      }
    }
    document.querySelector("#sabik-clear")?.addEventListener("click", async () => {
      if (!canPause()) return;
      await control("PAUSE_ASSISTANT", () => {
        applySabikVisual(state.session.sabik_state, "pausa");
        text("#sabik-state-label", "En pausa");
        setStatus("Sabik está en pausa. Tu entrada y tu respuesta siguen aquí.");
        announce("Sabik está en pausa.");
      });
      focus("#sabik-resume");
    });
    document.querySelector("#sabik-resume")?.addEventListener("click", async () => {
      if (!state.paused) return;
      await control("RESUME_ASSISTANT", () => {
        applySabikVisual(state.session.sabik_state, "espera");
        text("#sabik-state-label", "Disponible");
        setStatus("Sabik vuelve a estar disponible.");
        announce("Sabik vuelve a estar disponible.");
      });
      focus("#sabik-clear");
    });
    document.querySelector("#sabik-reset-session")?.addEventListener("click", async () => {
      await control("RESET_SESSION", () => {
      input.value = "";
      output.hidden = true;
      uiText(answer, "");
      uiText(notice, "");
      document.querySelector("#sabik-input-error").hidden = true;
      input.setAttribute("aria-invalid", "false");
      clearSources();
      const preferences = state.session.session_preferences;
      state.session = window.NEACoreV1.createSessionState();
      state.session = window.NEACoreV1.setSessionPreferences(state.session, preferences);
      state.lastInput = "";
      state.failedInput = "";
      state.lastPlan = null;
      syncLowIntensityButton(state.session.sabik_state);
      applySabikVisual(state.session.sabik_state, "espera");
      text("#sabik-state-label", "Disponible");
      setVisibility();
      setStatus("Conversación reiniciada. Puedes escribir una nueva consulta.");
      announce("Conversación reiniciada.");
      });
      focus("#sabik-input");
    });

    document.querySelector("#sabik-shorter")?.addEventListener("click", async () => {
      if (unavailable()) return;
      state.session = window.NEACoreV1.setSessionPreferences(state.session, {
        response_length: "short"
      });
      if (state.lastPlan) await runNeed(state.lastInput, "shorter");
      else renderSabikState(state.session.sabik_state, "Respuesta más corta activada.");
    });

    for (const [id, action] of [["no-questions", "no_questions"], ["one-option", "one_option"], ["rephrase", "rephrase"]]) {
      document.querySelector(`#sabik-${id}`)?.addEventListener("click", async () => {
        if (unavailable()) return;
        if (state.lastPlan) await runNeed(state.lastInput, action);
        else {
          state.session = window.NEASession.applyConversationControl(state.session, null, action);
          setStatus("Preferencia de respuesta aplicada.");
        }
      });
    }
    document.querySelector("#sabik-retry-data")?.addEventListener("click", async (event) => {
      if (unavailable()) return;
      const button = event.currentTarget;
      state.dataPromise = null;
      const value = state.failedInput || state.lastInput || input.value.trim();
      if (value) await runNeed(value);
      if (button.hidden && !unavailable() && state.machine.visibility === "expanded" &&
          [button, document.body].includes(document.activeElement)) focus("#sabik-input");
    });

    document.querySelector("#sabik-not-this")?.addEventListener("click", () => {
      if (unavailable()) return;
      if (["risk_accompaniment", "ambiguous_risk_clarification"].includes(state.lastPlan?.type)) return;
      state.session = window.NEACoreV1.registerPlanRejection(state.session, state.lastPlan, "no_es_esto");
      output.hidden = false;
      answer.className = "sabik-answer";
      uiText(answer, "Entendido. Retiro esta vía. Puedes escribir una corrección concreta.");
      uiText(notice, "La corrección explícita pesa más que la inferencia.");
      clearSources();
      renderSabikState(state.session.sabik_state, "Sabik espera una corrección.", "correccion");
    });

    document.querySelector("#sabik-other-way")?.addEventListener("click", async () => {
      if (unavailable()) return;
      if (["risk_accompaniment", "ambiguous_risk_clarification"].includes(state.lastPlan?.type)) return;
      state.session = window.NEACoreV1.registerPlanRejection(state.session, state.lastPlan, "buscar_otra_via");
      if (state.lastPlan && state.lastPlan.fragments_used && state.lastPlan.fragments_used.length && state.lastInput) {
        await runNeed(state.session.current_need || state.lastInput);
        return;
      }
      output.hidden = false;
      answer.className = "sabik-answer";
      uiText(answer, "Para buscar por otra vía necesito una aclaración breve: qué quieres retirar o probar ahora.");
      uiText(notice, "No repito la misma respuesta si no hay una vía real que cambiar.");
      clearSources();
      renderSabikState(state.session.sabik_state, "Sabik necesita una aclaración para cambiar de vía.", "correccion");
    });

    function setVisibility() {
      const button = document.querySelector("#sabik-toggle");
      const panel = document.querySelector(".sabik-panel");
      const widgetBody = document.querySelector("#sabik-widget-body");
      const collapsed = state.machine.visibility === "collapsed";
      panel.classList.toggle("is-collapsed", collapsed);
      if (widgetBody) widgetBody.hidden = collapsed;
      button.setAttribute("aria-expanded", String(!collapsed));
      uiText(button, collapsed ? "Mostrar" : "Ocultar");
      // Plegado, el estado vive en la cabecera: es lo único que queda visible.
      text("#sabik-state-label", collapsed ? "Oculto" : state.paused ? "En pausa" : "Disponible");
    }
    async function toggleVisibility() {
      if (!state.coreReady || state.controlBusy) return;
      state.controlBusy = true;
      syncControls();
      try {
        await dispatch({ type: state.machine.visibility === "collapsed" ? "EXPAND" : "COLLAPSE" });
        setVisibility();
      } finally {
        state.controlBusy = false;
        syncControls();
        focus("#sabik-toggle");
      }
    }
    document.querySelector("#sabik-toggle")?.addEventListener("click", toggleVisibility);
    document.querySelector(".sabik-panel")?.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && state.machine && state.machine.visibility === "expanded") {
        event.preventDefault();
        toggleVisibility();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    ensurePanelPlacement();
    bindPanelLanguage();
    bind();
    syncControls();
    try {
      await loadCore();
      renderSabikState(state.session.sabik_state, "Estoy aquí si quieres ayuda.");
    } catch (error) {
      setStatus("Sabik no pudo cargar el Core.", "minimal");
      announce("Sabik no pudo iniciarse. Puedes seguir usando la navegación de Iris Green.");
    }
  });
})();
