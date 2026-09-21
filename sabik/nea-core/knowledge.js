(() => {
  const { PUBLICABLE } = window.NEACoreState;

  const DEFAULT_PATHS = {
    concepts: "assets/NEA/data/concepts.es.json",
    relations: "assets/NEA/data/relations.es.json",
    fragmentsIndex: "assets/NEA/generated/iris-fragments-index.es.json",
    actions: "assets/NEA/data/actions.es.json",
    questions: "assets/NEA/data/discriminating-questions.es.json",
    resources: "assets/NEA/data/human-resources.es.json",
    corpora: "assets/NEA/data/language-corpora.json",
    procedures: "assets/NEA/data/procedures.es.json"
  };

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isPublicable(item) {
    return item?.editorial_status === PUBLICABLE;
  }

  async function loadJson(path) {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) {
      const error = new Error(`No se pudo cargar ${path}`);
      error.code = response.status === 404 ? "resource_unavailable" : "technical_error";
      throw error;
    }
    return response.json();
  }

  async function loadData(paths = DEFAULT_PATHS, previous = null) {
    const data = { availability: {}, fragmentsIndexMeta: previous?.fragmentsIndexMeta || null };
    // Optional data fails independently. A retry reuses only successfully loaded
    // inputs; neither a rejected promise nor a fallback is cached as success.
    await Promise.all(Object.keys(DEFAULT_PATHS).map(async (key) => {
      const required = key === "concepts" || key === "fragmentsIndex";
      const oldStatus = previous?.availability?.[key];
      if (oldStatus && ["available", "editorial_absence"].includes(oldStatus.status)) {
        data[key] = previous[key];
        data.availability[key] = { ...oldStatus };
        return;
      }
      try {
        if (!paths[key]) {
          const error = new Error(`Missing dataset path: ${key}`);
          error.code = "resource_unavailable";
          throw error;
        }
        const payload = await loadJson(paths[key]);
        const items = key === "fragmentsIndex" ? (Array.isArray(payload) ? payload : payload?.fragments)
          : key === "corpora" ? payload?.languages : payload;
        if (!Array.isArray(items) || items.some(item => !item || typeof item !== "object" || Array.isArray(item) ||
          ["aliases", "concepts"].some(field => item[field] !== undefined &&
            (!Array.isArray(item[field]) || item[field].some(value => typeof value !== "string"))) ||
          (key === "concepts" && typeof item.id !== "string") ||
          (key === "fragmentsIndex" && [item.id, item.text, item.url].some(value => typeof value !== "string")))) {
          const error = new Error(`Invalid dataset: ${key}`);
          error.code = "technical_error";
          throw error;
        }
        data[key] = key === "corpora" ? payload : items;
        data.availability[key] = { status: items.some(isPublicable) ? "available" : "editorial_absence", required };
        if (key === "fragmentsIndex" && !Array.isArray(payload)) {
          const { generated_at, source_label, language, base_url, url_count, fragment_count, skipped_count } = payload;
          data.fragmentsIndexMeta = { generated_at, source_label, language, base_url, url_count, fragment_count, skipped_count };
        }
      } catch (cause) {
        const code = cause.code === "resource_unavailable" ? cause.code : "technical_error";
        if (required) {
          const error = new Error(`Required dataset failed: ${key}`, { cause });
          error.code = code;
          error.dataset = key;
          throw error;
        }
        data[key] = key === "corpora" ? { languages: [] } : [];
        data.availability[key] = { status: code, required: false };
      }
    }));
    return data;
  }

  function unique(values) {
    return [...new Set(values.filter(Boolean))];
  }

  window.NEAKnowledge = {
    DEFAULT_PATHS,
    normalizeText,
    isPublicable,
    loadData,
    unique
  };
})();
