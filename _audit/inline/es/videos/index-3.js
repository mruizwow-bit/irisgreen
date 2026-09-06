
const YT = (id) => "https://www.youtube-nocookie.com/embed/" + id + "?rel=0&playsinline=1";
const YTW = (id) => "https://www.youtube.com/watch?v=" + id;
const VM = (id) => "https://player.vimeo.com/video/" + id;
const VMW = (id) => "https://vimeo.com/" + id;
const v = (n, t, id, tipo, nota) => ({ name: n, tema: t, source: "Vimeo", embed: VM(id), href: VMW(id), tipo: tipo || "vivencia", nota: nota || "" });
const IG = (p) => "https://www.instagram.com/" + p + "/embed/";
const thumbImg = (u) => u ? React.createElement("img", { src: u, alt: "", style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" } }) : null;
const ytThumb = (u) => (u && u.indexOf("youtube") > -1 && u.indexOf("/embed/") > -1) ? "https://i.ytimg.com/vi/" + u.split("/embed/")[1].split("?")[0] + "/hqdefault.jpg" : "";
const IGW = (p) => "https://www.instagram.com/" + p + "/";
const y = (n, t, id, tipo, nota) => ({ name: n, tema: t, source: "YouTube", embed: YT(id), href: YTW(id), tipo: tipo || "vivencia", nota: nota || "" });
const g = (n, t, p, tipo, nota) => ({ name: n, tema: t, source: "Instagram", embed: IG(p), href: IGW(p), tipo: tipo || "vivencia", nota: nota || "" });

const NOTA_BASE = {
  es: {
    vivencia: "Es la experiencia de una persona, no una pauta: lo que a ella le funcionó no es lo que hay que hacer.",
    institucional: "Lo publica una entidad. Describe casos frecuentes, no todas las formas de vivirlo.",
    divulgacion: "Es divulgación profesional: explica en general, y no sustituye la valoración de tu caso."
  },
  en: {
    vivencia: "This is one person's experience, not a set of instructions: what worked for them is not what you have to do.",
    institucional: "Published by an organisation. It describes common cases, not every way of living it.",
    divulgacion: "This is professional explanation in general terms, and it does not replace an assessment of your own case."
  },
  pt: {
    vivencia: "É a experiência de uma pessoa, não uma orientação: o que funcionou para ela não é o que se deve fazer.",
    institucional: "Publicado por uma entidade. Descreve casos frequentes, não todas as formas de viver isso.",
    divulgacion: "É divulgação profissional: explica em geral, e não substitui a avaliação do seu caso."
  }
};

const TIPOS = {
  vivencia: ["Experiencia en primera persona", "#a8336f", "rgba(168,51,111,0.1)"],
  institucional: ["Fuente institucional", "#16708a", "rgba(31,139,168,0.12)"],
  divulgacion: ["Divulgación profesional", "#5a49a8", "rgba(111,95,192,0.12)"]
};

const VIDEOS = [
  y("Dan Wilkins · Managing on the Spectrum", "Autismo", "qy_6-Zhx-i0", "vivencia", "Dan tiene un servicio de mentoría de pago. Lo decimos aquí para que lo sepas antes de ver el vídeo: lo que cuenta es su experiencia, y además vive de acompañar a otras personas con diagnóstico tardío."),
  y("Cris Edwards · su historia con la misofonía", "Misofonía", "AIM2TieReU8", "vivencia", "Cuenta su propia experiencia con la misofonía y cómo le afecta en el día a día. Menciona ideación suicida: si estás en un momento difícil, en España puedes llamar al 024. Publicado por Misophonia Research Fund."),
  y("Bob Williams · See Us. Hear Us.", "CAA", "t60K-XJWg9A", "vivencia", "Lleva más de seis décadas comunicándose con CAA. Habla de su propia vida, no de cómo se implanta un sistema: la decisión sobre qué sistema necesita cada persona se toma con profesionales. Tiene subtítulos en español."),
  y("Peter Cherry · vivir con discalculia", "Discalculia", "YsjRwpuFNiE", "vivencia", "Tiene discalculia y cuenta cómo son las matemáticas en su día a día, en el trabajo y en los estudios. Es voluntario de Dyscalculia Network, no profesional clínico."),
  v("Jules Robertson · The Kennel Grandslam", "Autismo", "174264190", "vivencia", "Cortometraje encargado por Ambitious about Autism en el que Jules, actor autista, relata episodios reales de acoso escolar que vivió él mismo."),
  y("Ioan Berry · Me and DLD", "TDL", "bXHCjk_FCI4", "vivencia", "Diagnosticado de dificultades del lenguaje desde los cinco años. Lo grabó él durante el confinamiento y cuenta qué apoyos le ayudaron y cuáles no. El TDL es de larga duración: en el vídeo no se promete ninguna cura."),
  y("Gabriela Venâncio · diagnóstico en la vida adulta", "TDAH", "2ijZqgW41q8", "vivencia", "Relato en primera persona de un diagnóstico de TDAH ya de adulta. Cuenta cómo lo vive ella, no cómo se diagnostica: la ruta clínica está en la ficha de TDAH."),
  y("Alice Moyle · pensamiento mágico", "TOC", "7YpjdG3qTmg", "vivencia", "Ella misma aclara que acompaña desde la experiencia vivida, no desde la terapia ni el coaching, y que convive con el TOC desde los dieciséis años. El tratamiento del TOC lo indica un profesional."),
  y("Ro Vitale · La Cruda", "TOC", "jS2LoXykaRw"),
  y("Jordi Rodríguez · Roca Project", "Tourette", "to77ghKeq8I"),
  y("Cate Moretti · Roca Project", "Síndrome de Down", "kR_ZyTd2PW8"),
  y("Josep Thió", "Autismo", "rEU5YZGvovc"),
  y("Abraham Ros · Más allá del rosa", "Autismo", "KOHb8-xHpOU"),
  y("Elisa Farías", "TDAH", "IZhswSOVNoc"),
  y("Yessenia y Javier · Autismo Guía", "Autismo", "6avzOjlOPeQ"),
  y("Renzo Schuller", "TDAH", "86UnZk_tRUI"),
  y("Norma Echavarría · Inesperado Podcast", "TDAH", "P1x13ntninc"),
  y("Jaume Aymar / Mind Sylenth", "TOC", "0da3Lud8aqo"),
  y("Fernando · historia de TOC", "TOC", "74KDFWp1jK8"),
  y("Lele Pons", "TOC", "utFNW9znXMU"),
  y("Tini Stoessel", "Ansiedad", "rUDlpO89isc"),
  y("María Becerra", "Ansiedad", "yNo-OBEJ-2s"),
  y("Leiva", "Ansiedad", "AR-mhLGktMs"),
  y("Beret", "Ansiedad", "TJtqJaTMbTk"),
  y("Jely Reátegui", "Ansiedad", "FXuObQT10Ew"),
  y("Felipe Silva Eltit · Inesperado Podcast", "Tourette", "Pt2v_vS2LuA"),
  y("Bianca Sáez", "Tourette", "Rl3nZwxM28w"),
  y("Wado de Pedro", "Tartamudez", "5n-svsAPUlE"),
  y("Kenya Cuevas · Se Regalan Dudas", "Identidad LGTBI+", "NdsTWfDG4n8"),
  y("Alex Orué · Se Regalan Dudas", "Identidad LGTBI+", "dtwJcwFFGIE"),
  y("Aike Martín · Les Mariquites", "Identidad LGTBI+", "mlruSqK0YM4"),
  y("Jesica y Ambar · CAMBIO", "Identidad LGTBI+", "qCM_mBpfkug"),
  y("Izan Baptista", "Identidad LGTBI+", "KKVxqJIJNcw"),
  y("Bea Is · Perú Intersex", "Identidad LGTBI+", "U9ORbTEkmE8"),
  y("Luta Cruz", "Identidad LGTBI+", "rpkHylCno1s"),
  y("Rosario Ortega", "Identidad LGTBI+", "QmxhKxJK_eU"),
  y("Paula Gonu", "Identidad LGTBI+", "dB4DzHS_P58"),
  y("Ellie Middleton · diagnóstico AuDHD", "TDAH", "u-Qtf9YAlts"),
  y("Lizi Jackson-Barrett", "TDAH", "EDLpUMjYoGY"),
  y("Orlando Bloom · Made By Dyslexia", "Dislexia y discalculia", "-_ij_ZyDwVI"),
  y("Joyce Luz · Drauzio Varella", "Tourette", "ZYAfjjHrI_A"),
  y("Amanda Ramalho · The Noite", "Autismo", "WewQesBzrmI"),
  y("Bella Ramsey · autismo e identidad", "Identidad LGTBI+", "xR1Brs76IEo"),
  y("Jessica Kellgren-Fozard · TDAH y vida queer", "Identidad LGTBI+", "BrxAnehKjZ0"),
  y("Fern Brady · autismo y bisexualidad", "Identidad LGTBI+", "URzPua45sRQ"),
  y("Hannah Gadsby · autismo y experiencia queer", "Identidad LGTBI+", "PaT__mzkHbA"),
  y("Chloé Hayden · autismo, TDAH y representación", "Autismo", "roFFvyNVWtc"),
  y("Yasmin Finney · representación trans", "Identidad LGTBI+", "8bzfJXGieng")
].map((v, n) => Object.assign({ id: "v" + n }, v));

const TEMA_KEYS = ["Autismo", "TDAH", "TOC", "Ansiedad", "Tourette", "Dislexia y discalculia", "ARFID", "Tartamudez", "Síndrome de Down", "Identidad LGTBI+"];

const STR = {
  es: {
    howToRead: "Cómo leer este vídeo:", tipos: { vivencia: "Experiencia en primera persona", institucional: "Fuente institucional", divulgacion: "Divulgación profesional" },
    all: "Todos", booksBar: "Todo aquí es gratis gracias a los libros de Iris Green", booksCta: "Leer las primeras páginas",
    navHome: "Inicio", navAsk: "¿Qué puedo pedir?", navTopics: "Temas", navBooks: "Libros", reading: "Lectura",
    readingPanel: "Lectura accesible", textSize: "Tamaño del texto", reset: "Restablecer",
    eyebrow: "Videoteca · se ven aquí mismo", title: "Aquí habla quien lo vive.",
    lede: "Aquí habla quien lo vive, en primera persona: qué le pasó, cómo lo vive y qué cambió. La explicación clínica está en las fichas. Elige un tema o busca a alguien por su nombre.",
    mix: "Casi todo lo que hay aquí es experiencia en primera persona, y unos pocos vídeos los publica una entidad. Cada uno lo dice en su etiqueta. Nada se carga hasta que pulsas: la página no pone cookies de YouTube, Instagram ni Vimeo antes de eso.",
    searchPh: "Busca una persona: Ro Vitale, Bianca, Jordi…", where: "Dónde está", play: "Ver aquí", save: "Guardar para luego",
    count: (n) => n + " vídeos", noResults: "No hay vídeos con esas palabras. Prueba con otro nombre o quita los filtros.",
    more: (n) => "Ver más vídeos (" + n + " restantes)", seeIn: "Ver en ",
    spotify: "Playlist en Spotify", spotifyTitle: "Escucha la playlist de Iris Green",
    spotifyText: "Voces, entrevistas y música elegida para acompañar la lectura. Suena en cualquier momento, mientras navegas.",
    spotifyMissing: "Playlist · en cuanto tenga el enlace suena aquí", spotifyEyebrow: "Escuchar mientras lees",
    tagline: "Base de conocimiento sobre neurodiversidad",
    toggles: ["Letra más separada", "Botones más grandes", "Más contraste", "Guía de lectura", "Leer en voz alta", "Reducir movimiento"],
    temas: { "Autismo": "Autismo", "TDAH": "TDAH", "TOC": "TOC", "Ansiedad": "Ansiedad", "Tourette": "Tourette", "Dislexia y discalculia": "Dislexia y discalculia", "ARFID": "ARFID", "Tartamudez": "Tartamudez", "Síndrome de Down": "Síndrome de Down", "Identidad LGTBI+": "Identidad LGTBI+" }
  },
  en: {
    howToRead: "How to read this video:", tipos: { vivencia: "First-person experience", institucional: "Institutional source", divulgacion: "Professional outreach" },
    all: "All", booksBar: "Everything here is free thanks to Iris Green's books", booksCta: "Read the first pages",
    navHome: "Home", navAsk: "What can I ask for?", navTopics: "Topics", navBooks: "Books", reading: "Reading",
    readingPanel: "Accessible reading", textSize: "Text size", reset: "Reset",
    eyebrow: "Video library · plays right here", title: "Here, the people who live it speak.",
    mix: "Almost everything here is first-person experience, and a few videos are published by organisations. Each one says so on its label. Nothing loads until you press play: the page sets no YouTube, Instagram or Vimeo cookies before that.",
    lede: "Here you hear from the people who live it, in the first person: what happened, how they live it and what changed. The clinical explanation is in the topic pages. Pick a topic or search for someone by name.",
    searchPh: "Search for a person: Ro Vitale, Bianca, Jordi…", where: "Where it lives", play: "Play here", save: "Save for later",
    count: (n) => n + " videos", noResults: "No videos match those words. Try another name or clear the filters.",
    more: (n) => "Show more videos (" + n + " left)", seeIn: "Watch on ",
    spotify: "Spotify playlist", spotifyTitle: "Listen to the Iris Green playlist",
    spotifyText: "Voices, interviews and music chosen to keep you company while you read. It plays while you browse.",
    spotifyMissing: "Playlist · coming as soon as I have the link", spotifyEyebrow: "Listen while you read",
    tagline: "Knowledge base on neurodiversity",
    toggles: ["Wider letter spacing", "Bigger buttons", "More contrast", "Reading guide", "Read aloud", "Reduce motion"],
    temas: { "Autismo": "Autism", "TDAH": "ADHD", "TOC": "OCD", "Ansiedad": "Anxiety", "Tourette": "Tourette's", "Dislexia y discalculia": "Dyslexia & dyscalculia", "ARFID": "ARFID", "Tartamudez": "Stuttering", "Síndrome de Down": "Down syndrome", "Identidad LGTBI+": "LGBTQ+ identity" }
  },
  pt: {
    howToRead: "Como ler este vídeo:", tipos: { vivencia: "Experiência em primeira pessoa", institucional: "Fonte institucional", divulgacion: "Divulgação profissional" },
    all: "Todos", booksBar: "Tudo aqui é gratuito graças aos livros de Iris Green", booksCta: "Ler as primeiras páginas",
    navHome: "Início", navAsk: "O que posso pedir?", navTopics: "Temas", navBooks: "Livros", reading: "Leitura",
    readingPanel: "Leitura acessível", textSize: "Tamanho do texto", reset: "Restaurar",
    eyebrow: "Videoteca · dá para ver aqui", title: "Aqui fala quem vive isso.",
    lede: "Aqui fala quem vive isso, em primeira pessoa: o que aconteceu, como vive e o que mudou. A explicação clínica está nas fichas. Escolha um tema ou busque alguém pelo nome.",
    mix: "Quase tudo aqui é experiência em primeira pessoa, e uns poucos vídeos são publicados por entidades. Cada um diz isso na etiqueta. Nada carrega até você apertar: a página não põe cookies do YouTube, do Instagram nem do Vimeo antes disso.",
    searchPh: "Busque uma pessoa: Ro Vitale, Bianca, Jordi…", where: "Onde está", play: "Ver aqui", save: "Salvar para depois",
    count: (n) => n + " vídeos", noResults: "Nenhum vídeo com essas palavras. Tente outro nome ou limpe os filtros.",
    more: (n) => "Ver mais vídeos (faltam " + n + ")", seeIn: "Ver no ",
    spotify: "Playlist no Spotify", spotifyTitle: "Ouça a playlist da Iris Green",
    spotifyText: "Vozes, entrevistas e música escolhida para acompanhar a leitura. Toca enquanto você navega.",
    spotifyMissing: "Playlist · em breve, quando tiver o link", spotifyEyebrow: "Ouvir enquanto lê",
    tagline: "Base de conhecimento sobre neurodiversidade",
    toggles: ["Letras mais separadas", "Botões maiores", "Mais contraste", "Guia de leitura", "Ler em voz alta", "Reduzir movimento"],
    temas: { "Autismo": "Autismo", "TDAH": "TDAH", "TOC": "TOC", "Ansiedad": "Ansiedade", "Tourette": "Tourette", "Dislexia y discalculia": "Dislexia e discalculia", "ARFID": "ARFID", "Tartamudez": "Gagueira", "Síndrome de Down": "Síndrome de Down", "Identidad LGTBI+": "Identidade LGBTQIA+" }
  }
};

const SPOTIFY_URL = "https://open.spotify.com/playlist/1HyAiLbZcP9mUxetb8lF72";
const SPOTIFY_EMBED = "https://open.spotify.com/embed/playlist/1HyAiLbZcP9mUxetb8lF72?utm_source=generator";

const NAVL = {
  es: [["/","Inicio"],["/es/neurodiversidad/condiciones/","Condiciones"],["/es/situaciones/","Situaciones"],["/es/biblioteca/","Vida diaria"],["/es/videos/","Vídeos"],["/es/investigacion/","Investigación"],["/es/datos/","Datos"],["/es/tramites/directorio/","Ayudas"],["/es/tramites/","Cómo pedirlo"],["/es/libros/","Libros"]],
  en: [["/","Home"],["/es/neurodiversidad/condiciones/","Conditions"],["/es/situaciones/","Situations"],["/es/biblioteca/","Everyday life"],["/es/videos/","Videos"],["/es/investigacion/","Research"],["/es/datos/","Figures"],["/es/tramites/directorio/","Support directory"],["/es/tramites/","How to ask"],["/es/libros/","Books"]],
  pt: [["/","Início"],["/es/neurodiversidad/condiciones/","Condições"],["/es/situaciones/","Situações"],["/es/biblioteca/","Vida diária"],["/es/videos/","Vídeos"],["/es/investigacion/","Pesquisa"],["/es/datos/","Dados"],["/es/tramites/directorio/","Diretório de ajudas"],["/es/tramites/","Como pedir"],["/es/libros/","Livros"]]
};

class Component extends DCLogic {
  state = { lang: "es", q: "", tema: "all", plat: "all", limit: 9, playing: null, saved: [], a11y: false, music: false, fs: 17, spacing: false, controls: false, contrast: false, guide: false, speak: false, motion: false };

  componentDidMount() {
    try {
      const n = VIDEOS.length;
      document.querySelectorAll('script[type="application/ld+json"]').forEach((s) => {
        const d = JSON.parse(s.textContent);
        if (d.numberOfItems) { d.numberOfItems = n; s.textContent = JSON.stringify(d); }
      });
    } catch (e) {}
    try { document.documentElement.lang = document.documentElement.lang || "es"; } catch (e) {}
    try {
      const raw = localStorage.getItem("ig_saved_videos");
      if (raw) this.setState({ saved: JSON.parse(raw) });
      const lang = localStorage.getItem("ig_lang");
      const use = lang && STR[lang] ? lang : "es";
      if (use !== "es") this.setState({ lang: use });
      document.documentElement.lang = use === "pt" ? "pt-BR" : use;
    } catch (e) {}
  }

  persist(saved) {
    this.setState({ saved });
    try { localStorage.setItem("ig_saved_videos", JSON.stringify(saved)); } catch (e) {}
  }

  setLang(lang) {
    try { document.documentElement.lang = lang === "pt" ? "pt-BR" : lang; } catch (e) {}
    this.setState({ lang });
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
      el.style.cssText = "position:fixed;left:0;right:0;height:46px;pointer-events:none;z-index:70;background:rgba(111,95,192,0.14);border-top:2px solid rgba(111,95,192,0.5);border-bottom:2px solid rgba(111,95,192,0.5);top:0";
      document.body.appendChild(el);
      this._gm = (e) => { el.style.top = Math.max(0, e.clientY - 23) + "px"; };
      window.addEventListener("pointermove", this._gm);
    } else if (!on && el) {
      window.removeEventListener("pointermove", this._gm);
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
    const filtered = VIDEOS.filter((v) => {
      if (st.tema !== "all" && v.tema !== st.tema) return false;
      if (st.plat !== "all" && v.source !== st.plat) return false;
      if (!words.length) return true;
      const hay = this.norm(v.name + " " + v.tema);
      return words.every((w) => hay.indexOf(w) !== -1);
    });
    const isSaved = (n) => st.saved.some((s) => s.name === n);
    const chip = (active) => ({
      bg: active ? "#6f5fc0" : "#fff",
      color: active ? "#fff" : "#17395c",
      border: active ? "#6f5fc0" : "rgba(23,57,92,0.14)"
    });

    return {
      langButtons: [["es", "ES"], ["en", "EN"]].map(([code, label]) => ({
        label,
        bg: st.lang === code ? "#17395c" : "transparent",
        color: st.lang === code ? "#fff" : "#17395c",
        pick: () => this.setLang(code)
      })),

      navLinks: (NAVL[L] || NAVL.es).filter(([href]) => href !== "/es/videos/").map(([href, label]) => ({ href, label })),

      tBooksBar: T.booksBar, tBooksCta: T.booksCta, tNavHome: T.navHome, tNavAsk: T.navAsk,
      tNavTopics: T.navTopics, tNavBooks: T.navBooks, tReading: T.reading, tReadingPanel: T.readingPanel,
      tTextSize: T.textSize, tReset: T.reset, tEyebrow: T.eyebrow, tTitle: T.title, tLede: T.lede, tMix: T.mix,
      tSearchPh: T.searchPh, tWhere: T.where, tPlay: T.play, tSave: T.save, tNoResults: T.noResults,
      tSpotify: T.spotify, tSpotifyTitle: T.spotifyTitle, tSpotifyText: T.spotifyText,
      tSpotifyMissing: T.spotifyMissing, tSpotifyEyebrow: T.spotifyEyebrow, tTagline: T.tagline, tHowToRead: T.howToRead,

      spotifyUrl: SPOTIFY_URL || "/es/videos/",
      hasSpotify: !!SPOTIFY_URL,
      noSpotify: !SPOTIFY_URL,
      spotifyEmbed: SPOTIFY_EMBED,
      hasSpotifyEmbed: !!SPOTIFY_EMBED,
      noSpotifyEmbed: !SPOTIFY_EMBED,

      q: st.q,
      onQ: (e) => this.setState({ q: e.target.value, limit: 9 }),
      temaChips: [{ key: "all", label: T.all }].concat(TEMA_KEYS.map((k) => ({ key: k, label: T.temas[k] })))
        .map((t) => Object.assign({ label: t.label, pick: () => this.setState({ tema: t.key, limit: 9 }) }, chip(st.tema === t.key))),
      platChips: [{ key: "all", label: T.all }, { key: "YouTube", label: "YouTube" }]
        .map((p) => Object.assign({ label: p.label, pick: () => this.setState({ plat: p.key, limit: 9 }) }, chip(st.plat === p.key))),

      countLabel: T.count(filtered.length),
      noResults: filtered.length === 0,
      cards: filtered.slice(0, st.limit).map((v) => ({
        name: v.name, href: v.href, src: v.embed, thumbImg: thumbImg(ytThumb(v.embed)), hasThumb: !!ytThumb(v.embed), noThumb: !ytThumb(v.embed),
        nota: v.nota || (NOTA_BASE[L] || NOTA_BASE.es)[v.tipo] || (NOTA_BASE[L] || NOTA_BASE.es).vivencia,
        hasNota: true,
        notaPropia: !!v.nota,
        notaBg: v.nota ? "rgba(23,57,92,0.05)" : "rgba(111,95,192,0.07)",
        tipoLabel: (T.tipos && T.tipos[v.tipo]) || (TIPOS[v.tipo] || TIPOS.vivencia)[0],
        tipoColor: (TIPOS[v.tipo] || TIPOS.vivencia)[1],
        tipoBg: (TIPOS[v.tipo] || TIPOS.vivencia)[2],
        meta: (T.temas[v.tema] || v.tema) + " · " + v.source,
        ratio: "16 / 9",
        playing: st.playing === v.name,
        idle: st.playing !== v.name,
        linkLabel: T.seeIn + v.source,
        savedFill: isSaved(v.name) ? "#6f5fc0" : "none",
        save: () => this.persist(isSaved(v.name) ? st.saved.filter((s) => s.name !== v.name) : st.saved.concat([{ name: v.name, url: v.href }])),
        play: () => this.setState({ playing: v.name })
      })),
      hasMore: filtered.length > st.limit,
      moreLabel: T.more(filtered.length - st.limit),
      showMore: () => this.setState({ limit: st.limit + 9 }),

      musicOpen: st.music,
      musicBg: st.music ? "rgba(29,185,84,0.22)" : "rgba(29,185,84,0.12)",
      toggleMusic: () => this.setState({ music: !st.music }),
      a11yOpen: st.a11y,
      toggleA11y: () => this.setState({ a11y: !st.a11y }),
      fsUp: () => this.setReading({ fs: Math.min(st.fs + 2, 25) }),
      fsDown: () => this.setReading({ fs: Math.max(st.fs - 2, 15) }),
      fsLabel: Math.round((st.fs / 17) * 100) + "%",
      a11yToggles: ["spacing", "controls", "contrast", "guide", "speak", "motion"].map((key, n) => {
        const on = !!st[key];
        return {
          label: T.toggles[n],
          bg: on ? "rgba(111,95,192,0.12)" : "#fff",
          border: on ? "#6f5fc0" : "rgba(23,57,92,0.16)",
          knobTrack: on ? "#6f5fc0" : "rgba(23,57,92,0.22)",
          knobLeft: on ? "16px" : "2px",
          toggle: () => this.setReading({ [key]: !on })
        };
      }),
      a11yReset: () => this.setReading({ fs: 17, spacing: false, controls: false, contrast: false, guide: false, speak: false, motion: false })
    };
  }
}

