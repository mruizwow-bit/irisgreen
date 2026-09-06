
const CONF = {
  alta: ["#5a49a8", "rgba(90,73,168,0.12)"],
  moderada: ["#16708a", "rgba(31,139,168,0.12)"],
  media: ["#a8336f", "rgba(168,51,111,0.1)"],
  baja: ["#8a5a12", "rgba(196,138,55,0.16)"]
};

const TOPIC_LABELS = {
  pt: { "Autismo": "Autismo", "TDAH": "TDAH", "TOC": "TOC", "Salud mental": "Saúde mental", "Alimentación": "Alimentação", "Aprendizaje": "Aprendizagem", "Lenguaje y comunicación": "Linguagem e comunicação", "Cómo se percibe el mundo": "Como se percebe o mundo", "Enmascaramiento": "Mascaramento", "Identidad y diagnóstico": "Identidade e diagnóstico", "Estudios y trabajo": "Estudos e trabalho", "Salud física": "Saúde física", "Sueño": "Sono", "Tourette": "Tourette", "Otros perfiles": "Outros perfis", "Neurodiversidad": "Neurodiversidade" },
  en: { "Autismo": "Autism", "TDAH": "ADHD", "TOC": "OCD", "Salud mental": "Mental health", "Alimentación": "Eating", "Aprendizaje": "Learning", "Lenguaje y comunicación": "Language and communication", "Cómo se percibe el mundo": "How the world is perceived", "Enmascaramiento": "Masking", "Identidad y diagnóstico": "Identity and diagnosis", "Estudios y trabajo": "Study and work", "Salud física": "Physical health", "Sueño": "Sleep", "Tourette": "Tourette", "Otros perfiles": "Other profiles", "Neurodiversidad": "Neurodiversity" },
  es: { "Autismo": "Autismo", "TDAH": "TDAH", "TOC": "TOC", "Salud mental": "Salud mental", "Alimentación": "Alimentación", "Aprendizaje": "Aprendizaje", "Lenguaje y comunicación": "Lenguaje y comunicación", "Cómo se percibe el mundo": "Cómo se percibe el mundo", "Enmascaramiento": "Enmascaramiento", "Identidad y diagnóstico": "Identidad y diagnóstico", "Estudios y trabajo": "Estudios y trabajo", "Salud física": "Salud física", "Sueño": "Sueño", "Tourette": "Tourette", "Otros perfiles": "Otros perfiles", "Neurodiversidad": "Neurodiversidad" }
};

const DESIGNS = ["metaanalisis", "revision", "ensayo", "transversal", "cualitativo", "neuroimagen", "mixto", "guia"];
const TOPICS = ["Autismo", "TDAH", "TOC", "Ansiedad", "Dislexia", "ARFID", "Tourette", "Identidad", "Neurodiversidad", "Mutismo selectivo"];

const STR = {
  es: {
    all: "Todos", navHome: "Inicio", navVideos: "Vídeos", navAsk: "Ayudas", navBooks: "Libros",
    reading: "Lectura", readingPanel: "Lectura accesible", textSize: "Tamaño del texto", reset: "Restablecer",
    method: "Metodología", tagline: "Base de conocimiento sobre neurodiversidad",
    eyebrow: "Investigación, con contexto",
    title: "Un estudio no es la ciencia entera.",
    lede: "Reunimos estudios, revisiones y metaanálisis y explicamos qué se investigó, qué se encontró, qué no permite concluir y dónde está la fuente original. Cada ficha muestra el diseño, el tamaño de la muestra y nuestro nivel de certeza.",
    searchPh: "sueño, estigma, prevalencia, tics, enmascaramiento…",
    byDesign: "Tipo de estudio", byTopic: "Tema",
    count: (n) => n + (n === 1 ? " publicación" : " publicaciones"),
    noResults: "No hay publicaciones con esas palabras. Prueba con otro término o quita los filtros.",
    reference: "Referencia y DOI", means: "Qué significa", spanishTitle: "", details: "Ver la lectura crítica", close: "Cerrar",
    studied: "Qué se estudió", cannot: "Qué NO permite concluir", limits: "Limitaciones y riesgo de sesgo",
    howTitle: "Cómo leemos el nivel de certeza",
    howText: "Usamos los cuatro niveles de certeza de GRADE (alta, moderada, baja, muy baja) tal como los emplea Cochrane, pero aplicados a la afirmación concreta que publicamos: es una valoración editorial, no una evaluación GRADE formal de novo. Depende del diseño, la consistencia, el riesgo de sesgo, la precisión y de cuánta inferencia causal exige la frase.",
    gradeNote: "Adaptación editorial inspirada en GRADE. Una escala de cribado no diagnostica; una correlación no demuestra causa; una experiencia vivida no es una prevalencia.",
    revision: "Última revisión de esta página: 1 de septiembre de 2026 · 120 publicaciones.",
    designs: { metaanalisis: "Metaanálisis", revision: "Revisión sistemática", ensayo: "Ensayo aleatorizado", transversal: "Estudio de corte transversal (una foto en un momento)", cualitativo: "Estudio cualitativo", neuroimagen: "Neuroimagen", mixto: "Métodos mixtos", guia: "Guía clínica" },
    confs: { alta: "Certeza alta", moderada: "Certeza moderada", media: "Certeza baja", baja: "Certeza muy baja" },
    levels: [
      ["alta", "Es muy poco probable que nueva investigación cambie esta conclusión."],
      ["moderada", "Nueva investigación podría matizarla, pero la dirección es estable."],
      ["media", "Nueva investigación puede cambiarla. Útil, no concluyente."],
      ["baja", "Cualquier conclusión es provisional: exploratorio o muestras muy pequeñas."]
    ]
  },
  en: {
    all: "All", navHome: "Home", navVideos: "Videos", navAsk: "Support", navBooks: "Books",
    reading: "Reading", readingPanel: "Accessible reading", textSize: "Text size", reset: "Reset",
    method: "Methodology", tagline: "Knowledge base on neurodiversity",
    eyebrow: "Research, with context",
    title: "One study is not the whole of science.",
    lede: "We bring together studies, reviews and meta-analyses and explain what was investigated, what was found, what cannot be concluded and where the original source is. Each entry shows its design, sample size and our certainty level.",
    searchPh: "sleep, stigma, prevalence, tics, masking…",
    byDesign: "Study design", byTopic: "Topic",
    count: (n) => n + (n === 1 ? " publication" : " publications"),
    noResults: "No publications match those words. Try another term or clear the filters.",
    reference: "Reference and DOI", means: "What it means", spanishTitle: "Spanish title: ", details: "See the critical reading", close: "Close",
    studied: "What was studied", cannot: "What it does NOT prove", limits: "Limitations and risk of bias",
    howTitle: "How we read the certainty level",
    howText: "The certainty level is an editorial judgement about the specific claim we publish, not a formal GRADE assessment. It depends on design, consistency, risk of bias, precision and how much causal inference the sentence requires.",
    gradeNote: "Editorial adaptation inspired by GRADE. A screening scale does not diagnose; a correlation does not prove cause; lived experience is not a prevalence. The study texts are, for now, in Spanish.",
    revision: "This page last reviewed: 31 August 2026 · 120 publications.",
    designs: { metaanalisis: "Meta-analysis", revision: "Systematic review", ensayo: "Randomised trial", transversal: "Cross-sectional study", cualitativo: "Qualitative study", neuroimagen: "Neuroimaging", mixto: "Mixed methods", guia: "Clinical guideline" },
    confs: { alta: "High certainty", moderada: "Moderate certainty", media: "Low certainty", baja: "Very low certainty" },
    levels: [
      ["alta", "Further research is very unlikely to change this conclusion."],
      ["moderada", "Further research could refine it, but the direction is stable."],
      ["media", "Further research may well change it. Useful, not conclusive."],
      ["baja", "Any conclusion is provisional: exploratory or very small samples."]
    ]
  },
  pt: {
    all: "Todos", navHome: "Início", navVideos: "Vídeos", navAsk: "Ajudas", navBooks: "Livros",
    reading: "Leitura", readingPanel: "Leitura acessível", textSize: "Tamanho do texto", reset: "Restaurar",
    method: "Metodologia", tagline: "Base de conhecimento sobre neurodiversidade",
    eyebrow: "Pesquisa, com contexto",
    title: "Um estudo não é a ciência inteira.",
    lede: "Reunimos estudos, revisões e metanálises e explicamos o que foi investigado, o que foi encontrado, o que não permite concluir e onde está a fonte original. Cada ficha mostra o desenho, o tamanho da amostra e o nosso nível de certeza.",
    searchPh: "sono, estigma, prevalência, tiques, camuflagem…",
    byDesign: "Tipo de estudo", byTopic: "Tema",
    count: (n) => n + (n === 1 ? " publicação" : " publicações"),
    noResults: "Nenhuma publicação com essas palavras. Tente outro termo ou limpe os filtros.",
    reference: "Referência e DOI", means: "O que significa", spanishTitle: "Título em espanhol: ", details: "Ver a leitura crítica", close: "Fechar",
    studied: "O que foi estudado", cannot: "O que NÃO demonstra", limits: "Limitações e risco de viés",
    howTitle: "Como lemos o nível de certeza",
    howText: "A certeza é uma valoração editorial sobre a afirmação concreta que publicamos, não uma avaliação GRADE formal. Depende do desenho, da consistência, do risco de viés, da precisão e de quanta inferência causal a frase exige.",
    gradeNote: "Adaptação editorial inspirada no GRADE. Uma escala de triagem não diagnostica; uma correlação não prova causa; uma experiência vivida não é uma prevalência. Os textos dos estudos estão, por enquanto, em espanhol.",
    revision: "Última revisão desta página: 31 de agosto de 2026 · 120 publicações.",
    designs: { metaanalisis: "Metanálise", revision: "Revisão sistemática", ensayo: "Ensaio randomizado", transversal: "Estudo transversal (uma foto num momento)", cualitativo: "Estudo qualitativo", neuroimagen: "Neuroimagem", mixto: "Métodos mistos", guia: "Diretriz clínica" },
    confs: { alta: "Certeza alta", moderada: "Certeza moderada", media: "Certeza baixa", baja: "Certeza muito baixa" },
    levels: [
      ["alta", "É muito improvável que novas pesquisas mudem esta conclusão."],
      ["moderada", "Novas pesquisas podem matizá-la, mas a direção é estável."],
      ["media", "Novas pesquisas podem mudá-la. Útil, não conclusiva."],
      ["baja", "Qualquer conclusão é provisória: exploratório ou amostras muito pequenas."]
    ]
  }
};

const TOGGLES = {
  es: ["Letra más separada", "Botones más grandes", "Más contraste", "Guía de lectura", "Leer en voz alta", "Reducir movimiento"],
  en: ["Wider letter spacing", "Bigger buttons", "More contrast", "Reading guide", "Read aloud", "Reduce motion"],
  pt: ["Letras mais separadas", "Botões maiores", "Mais contraste", "Guia de leitura", "Ler em voz alta", "Reduzir movimento"]
};

const NAVL = {
  es: [["/","Inicio"],["/es/neurodiversidad/condiciones/","Condiciones"],["/es/situaciones/","Situaciones"],["/es/biblioteca/","Vida diaria"],["/es/videos/","Vídeos"],["/es/investigacion/","Investigación"],["/es/datos/","Datos"],["/es/tramites/directorio/","Ayudas"],["/es/tramites/","Cómo pedirlo"],["/es/libros/","Libros"]],
  en: [["/","Home"],["/es/neurodiversidad/condiciones/","Conditions"],["/es/situaciones/","Situations"],["/es/biblioteca/","Everyday life"],["/es/videos/","Videos"],["/es/investigacion/","Research"],["/es/datos/","Figures"],["/es/tramites/directorio/","Support directory"],["/es/tramites/","How to ask"],["/es/libros/","Books"]],
  pt: [["/","Início"],["/es/neurodiversidad/condiciones/","Condições"],["/es/situaciones/","Situações"],["/es/biblioteca/","Vida diária"],["/es/videos/","Vídeos"],["/es/investigacion/","Pesquisa"],["/es/datos/","Dados"],["/es/tramites/directorio/","Diretório de ajudas"],["/es/tramites/","Como pedir"],["/es/libros/","Livros"]]
};

class Component extends DCLogic {
  state = { data: null, lang: "es", q: "", design: "all", topic: "all", open: null, a11y: false, music: false, fs: 17, spacing: false, controls: false, contrast: false, guide: false, speak: false, motion: false };

  componentDidMount() {
    try { document.documentElement.lang = document.documentElement.lang || "es"; } catch (e) {}
    fetch("estudios-textos.json").then((r) => r.json()).then((data) => this.setState({ data })).catch(() => this.setState({ data: [] }));
    try {
      const lang = localStorage.getItem("ig_lang");
      const use = STR[lang] ? lang : "es";
      if (use !== "es") this.setState({ lang: use });
      document.documentElement.lang = use === "pt" ? "pt-BR" : use;
    } catch (e) {}
  }

  setLang(lang) {
    this.setState({ lang });
    try { document.documentElement.lang = lang === "pt" ? "pt-BR" : lang; } catch (e) {}
    try { localStorage.setItem("ig_lang", lang); } catch (e) {}
  }

  norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }

  applyReading(s) {
    const b = document.body, h = document.documentElement;
    if (!b) return;
    b.style.zoom = (s.fs / 17).toFixed(3);
    b.style.lineHeight = s.spacing ? "1.9" : "";
    b.style.letterSpacing = s.spacing ? "0.045em" : "";
    b.style.wordSpacing = s.spacing ? "0.12em" : "";
    h.dataset.igControls = s.controls ? "big" : "";
    h.dataset.igContrast = s.contrast ? "on" : "";
    h.dataset.igMotion = s.motion ? "off" : "";
    this.setGuide(s.guide);
    this.setSpeak(s.speak);
  }

  setGuide(on) {
    let el = document.getElementById("ig-guide");
    if (on && !el) {
      el = document.createElement("div");
      el.id = "ig-guide";
      el.style.cssText = "position:fixed;left:0;right:0;height:46px;pointer-events:none;z-index:70;background:rgba(90,73,168,0.14);border-top:2px solid rgba(90,73,168,0.5);border-bottom:2px solid rgba(90,73,168,0.5);top:0";
      document.body.appendChild(el);
      this._gm = (e) => { el.style.top = Math.max(0, e.clientY - 23) + "px"; };
      window.addEventListener("mousemove", this._gm);
    } else if (!on && el) {
      window.removeEventListener("mousemove", this._gm);
      el.remove();
    }
  }

  setSpeak(on) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if (!on) return;
    const main = document.querySelector("main");
    const u = new SpeechSynthesisUtterance((main ? main.innerText : "").slice(0, 4000));
    u.lang = { es: "es-ES", en: "en-GB", pt: "pt-BR" }[this.state.lang] || "es-ES";
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  }

  setReading(patch) {
    const st = this.state;
    const next = Object.assign({ fs: st.fs, spacing: st.spacing, controls: st.controls, contrast: st.contrast, guide: st.guide, speak: st.speak, motion: st.motion }, patch);
    this.setState(next);
    this.applyReading(next);
  }

  renderVals() {
    const st = this.state;
    const L = STR[st.lang] ? st.lang : "es";
    const T = STR[L];
    const words = this.norm(st.q).trim().split(/\s+/).filter(Boolean);

    const all = st.data || [];
    const rows = all.filter((s) => {
      if (st.design !== "all" && s.designKey !== st.design) return false;
      if (st.topic !== "all" && s.topic !== st.topic) return false;
      if (!words.length) return true;
      const hay = this.norm([s.titleEs, s.titleOrig, s.authors, s.topic, s.heading, s.means, s.notProven, (s.text || []).join(" ")].join(" "));
      return words.every((w) => hay.indexOf(w) !== -1);
    });

    const chip = (active) => ({
      bg: active ? "#5a49a8" : "#fff",
      color: active ? "#fff" : "#17395c",
      border: active ? "#5a49a8" : "rgba(23,57,92,0.14)"
    });

    return {
      langButtons: [["es", "ES"], ["en", "EN"]].map(([code, label]) => ({
        label,
        bg: L === code ? "#17395c" : "transparent",
        color: L === code ? "#fff" : "#17395c",
        pick: () => this.setLang(code)
      })),

      navLinks: (NAVL[L] || NAVL.es).filter(([href]) => href !== "/es/investigacion/").map(([href, label]) => ({ href, label })),

      tNavHome: T.navHome, tNavVideos: T.navVideos, tNavAsk: T.navAsk, tNavBooks: T.navBooks,
      tReading: T.reading, tReadingPanel: T.readingPanel, tTextSize: T.textSize, tReset: T.reset,
      tEyebrow: T.eyebrow, tTitle: T.title, tLede: T.lede, tSearchPh: T.searchPh,
      tByDesign: T.byDesign, tByTopic: T.byTopic, tNoResults: T.noResults, tReference: T.reference,
      tCannot: T.cannot, tMeans: T.means,
      tHowTitle: T.howTitle, tHowText: T.howText, tGradeNote: T.gradeNote,
      tRevision: T.revision, tTagline: T.tagline, tMethod: T.method,

      q: st.q,
      onQ: (e) => this.setState({ q: e.target.value }),
      designChips: [{ key: "all", label: T.all }].concat(DESIGNS.map((d) => ({ key: d, label: T.designs[d] })))
        .map((d) => Object.assign({ label: d.label, pick: () => this.setState({ design: d.key }) }, chip(st.design === d.key))),
      topicChips: [{ key: "all", label: T.all }].concat(TOPICS.map((t) => ({ key: t, label: (TOPIC_LABELS[L] || TOPIC_LABELS.es)[t] || t })))
        .map((t) => Object.assign({ label: t.label, pick: () => this.setState({ topic: t.key }) }, chip(st.topic === t.key))),

      countLabel: st.data ? T.count(rows.length) : "…",
      noResults: rows.length === 0,

      cards: rows.map((s) => {
        const c = CONF[s.conf] || CONF.media;
        const nSample = (L === "en" ? s.sample_en : L === "pt" ? s.sample_pt : s.sample) || "";
        return {
          heading: L === "es" ? s.heading : s.titleOrig,
          titleEs: L === "es" ? s.titleEs : T.spanishTitle + s.titleEs,
          titleOrig: s.titleOrig,
          authors: (L === "en" ? s.authors_en : L === "pt" ? s.authors_pt : s.authors) || s.authors,
          year: s.year, authorLine: ((L === "en" ? s.authors_en : L === "pt" ? s.authors_pt : s.authors) || s.authors) + (s.year ? " · " + s.year : ""),
          topic: TOPIC_LABELS[L][s.topic] || s.topic,
          design: T.designs[s.designKey] || s.design,
          nLabel: nSample,
          hasSample: !!nSample,
          confLabel: T.confs[s.conf], confColor: c[0], confBg: c[1],
          paragraphs: (s.text || []).map((p, i) => ({ key: "p" + i, text: p })),
          means: s.means, notProven: s.notProven,
          reference: ((L === "en" ? s.authors_en : L === "pt" ? s.authors_pt : s.authors) || s.authors) + (s.year ? " (" + s.year + ")" : "") + ". " + s.titleOrig + ". " + (T.designs[s.designKey] || s.design) + (nSample ? ", " + nSample : "") + ". " + (s.doi || "")
        };
      }),

      levels: T.levels.map(([k, text]) => ({ label: T.confs[k], color: CONF[k][0], bg: CONF[k][1], text })),

      musicOpen: st.music,
      musicBg: st.music ? "rgba(29,185,84,0.22)" : "rgba(29,185,84,0.12)",
      toggleMusic: () => this.setState({ music: !st.music }),
      a11yOpen: st.a11y,
      toggleA11y: () => this.setState({ a11y: !st.a11y }),
      fsUp: () => this.setReading({ fs: Math.min(st.fs + 2, 25) }),
      fsDown: () => this.setReading({ fs: Math.max(st.fs - 2, 15) }),
      fsLabel: Math.round((st.fs / 17) * 100) + "%",
      a11yToggles: ["spacing", "controls", "contrast", "guide", "speak", "motion"].map((k, n) => {
        const on = !!st[k];
        return {
          label: (TOGGLES[L] || TOGGLES.es)[n],
          bg: on ? "rgba(90,73,168,0.12)" : "#fff",
          border: on ? "#5a49a8" : "rgba(23,57,92,0.16)",
          knobTrack: on ? "#5a49a8" : "rgba(23,57,92,0.22)",
          knobLeft: on ? "16px" : "2px",
          toggle: () => this.setReading({ [k]: !on })
        };
      }),
      a11yReset: () => this.setReading({ fs: 17, spacing: false, controls: false, contrast: false, guide: false, speak: false, motion: false })
    };
  }
}

