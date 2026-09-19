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
      throw new Error(`No se pudo cargar ${path}`);
    }
    return response.json();
  }

  function normalizeFragmentsIndex(payload) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.fragments)) return payload.fragments;
    return [];
  }

  async function loadData(paths = DEFAULT_PATHS) {
    const [
      concepts,
      relations,
      fragmentsPayload,
      actions,
      questions,
      resources,
      corpora,
      procedures
    ] = await Promise.all([
      loadJson(paths.concepts),
      loadJson(paths.relations),
      loadJson(paths.fragmentsIndex),
      loadJson(paths.actions),
      loadJson(paths.questions),
      loadJson(paths.resources),
      loadJson(paths.corpora),
      loadJson(paths.procedures)
    ]);

    return {
      concepts,
      relations,
      fragmentsIndex: normalizeFragmentsIndex(fragmentsPayload),
      fragmentsIndexMeta: Array.isArray(fragmentsPayload) ? null : {
        generated_at: fragmentsPayload.generated_at,
        source_label: fragmentsPayload.source_label,
        language: fragmentsPayload.language,
        base_url: fragmentsPayload.base_url,
        url_count: fragmentsPayload.url_count,
        fragment_count: fragmentsPayload.fragment_count,
        skipped_count: fragmentsPayload.skipped_count
      },
      actions,
      questions,
      resources,
      corpora,
      procedures
    };
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
