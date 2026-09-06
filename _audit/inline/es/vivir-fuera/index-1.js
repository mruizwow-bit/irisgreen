
const TOGGLES = ["Letra más separada", "Botones más grandes", "Más contraste", "Guía de lectura", "Leer en voz alta", "Reducir movimiento"];
const REGIONS = ["Europa", "América", "Oceanía"];

const C = [
  { region: "Europa", country: "Portugal",
    lede: "El sistema portugués está bien documentado y es de los más cercanos al español. La intervención temprana llega hasta los 6 años y la educación inclusiva se organiza en tres niveles de medidas.",
    points: [
      "Primera infancia: el SNIPI (Decreto-Lei 281/2009) da intervención precoz de 0 a 6 años a través de las Equipas Locais de Intervenção (ELI), con un Plano Individual de Intervenção Precoce (PIIP).",
      "Colegio: el Decreto-Lei 54/2018, de 6 de julio, rige la educación inclusiva con tres niveles de medidas —universales, selectivas y adicionales—, el Relatório Técnico-Pedagógico con la conformidad expresa de la familia, y las unidades de enseñanza estructurada para el alumnado autista.",
      "En el curso 2022-2023 había 88.682 alumnos con necesidades educativas, el 7,77 % del total.",
      "Ayudas: la Prestação Social para a Inclusão (Decreto-Lei 126-A/2017) y el subsídio de educação especial, incompatible con el subsídio por assistência de terceira pessoa."
    ],
    start: "Por la ELI de tu zona si el niño o la niña tiene menos de 6 años, y por el centro escolar en el resto de casos. La FPDA (Federação Portuguesa de Autismo) deriva a sus asociaciones federadas por zona; la APSA y la Associação PARA publican la legislación al día.",
    pending: "Las cuantías de la Prestação Social para a Inclusão y del subsídio de educação especial. Se publican cuando estén comprobadas en seg-social.pt.",
    sources: "Decreto-Lei 281/2009 (SNIPI). Decreto-Lei 54/2018, de 6 de julho. Decreto-Lei 126-A/2017. DGE, preguntas frecuentes del DL 54/2018.",
    reviewed: "Última revisión: 31 de agosto de 2026." },

  { region: "Europa", country: "Francia",
    lede: "Todo pasa por una sola puerta: la MDPH del departamento donde vives. Un único expediente abre las ayudas económicas, el acompañante escolar y el proyecto de escolarización.",
    points: [
      "La MDPH (Maison Départementale des Personnes Handicapées) de cada departamento es la puerta única de los apoyos.",
      "El dossier MDPH abre la AEEH (la ayuda por hijo con discapacidad), la AAH (para personas adultas), el AESH (el acompañante escolar) y el proyecto personalizado de escolarización (PPS).",
      "Existe una Stratégie nationale pour les troubles du neuro-développement 2023-2027, con plataformas de coordinación y orientación (PCO) para el diagnóstico temprano."
    ],
    start: "Por la MDPH de tu departamento: el expediente es el mismo para todo, así que conviene prepararlo una vez y bien. Autisme France es la asociación de referencia, y autismeinfoservice.fr da información pública.",
    pending: "Las cuantías y los plazos, que varían por departamento, y el estado actual de la estrategia nacional.",
    sources: "Stratégie nationale pour les troubles du neuro-développement 2023-2027. Autisme France. Autisme Info Service.",
    reviewed: "Última revisión: 31 de agosto de 2026." },

  { region: "Europa", country: "Alemania",
    lede: "El sistema alemán separa cosas que en España van juntas: el carné de discapacidad, el grado de cuidados y los apoyos de participación son tres trámites distintos, en tres oficinas distintas.",
    points: [
      "El Schwerbehindertenausweis, el carné de discapacidad con sus distintivos (Merkzeichen), lo emite el Versorgungsamt.",
      "El Pflegegrad, el grado de cuidados, lo reconoce el seguro de dependencia.",
      "La Eingliederungshilfe del SGB IX cubre los apoyos de participación.",
      "El Schulbegleiter, el acompañante escolar, se pide al Jugendamt o al Sozialamt según el caso."
    ],
    start: "Por el Versorgungsamt para el carné, porque abre buena parte de lo demás. autismus Deutschland e. V. y sus asociaciones regionales orientan sobre el reparto en cada Land.",
    pending: "El reparto exacto de competencias, que cambia por Land.",
    sources: "SGB IX. autismus Deutschland e. V.",
    reviewed: "Última revisión: 31 de agosto de 2026." },

  { region: "Europa", country: "Irlanda",
    lede: "Irlanda tiene algo poco frecuente: una evaluación con plazos fijados por ley. En la práctica hay listas de espera documentadas, y conviene saberlo desde el principio.",
    points: [
      "El Assessment of Need de la Disability Act 2005 establece una evaluación con plazos legales; las listas de espera están documentadas.",
      "La Domiciliary Care Allowance es la ayuda para menores; la Disability Allowance, para personas adultas.",
      "En la etapa preescolar funciona el modelo AIM; en el colegio, los SNA (Special Needs Assistants)."
    ],
    start: "Solicitando el Assessment of Need, porque la fecha de solicitud cuenta para los plazos legales. AsIAm es la organización autista nacional; también está la Irish Society for Autism.",
    pending: "Los plazos reales y las cuantías vigentes.",
    sources: "Disability Act 2005. AsIAm. Irish Society for Autism.",
    reviewed: "Última revisión: 31 de agosto de 2026." },

  { region: "Europa", country: "Italia",
    lede: "En Italia casi todo cuelga de una sola ley con nombre propio: la Legge 104. El reconocimiento que da es el que abre los permisos laborales de la familia y el apoyo escolar.",
    points: [
      "La Legge 104/1992 reconoce el handicap y abre los permisos laborales de la familia y los apoyos.",
      "En el colegio, el insegnante di sostegno es el profesorado de apoyo.",
      "La indennità di frequenza es para menores; la indennità di accompagnamento, para quien necesita acompañamiento continuo."
    ],
    start: "Por el reconocimiento de la Legge 104, que se tramita a través del INPS con el certificado médico introductorio. ANGSA y la Fondazione Italiana per l'Autismo son las asociaciones de referencia.",
    pending: "Las cuantías del INPS.",
    sources: "Legge 104/1992. ANGSA. Fondazione Italiana per l'Autismo.",
    reviewed: "Última revisión: 31 de agosto de 2026." },

  { region: "Europa", country: "Suiza y Países Bajos",
    lede: "Dos sistemas muy descentralizados: lo que existe depende del cantón o del municipio donde vives, más que del país.",
    points: [
      "Suiza: el seguro de invalidez (AI/IV) financia las medidas médicas y la pedagogía especializada, pero la aplicación es cantonal.",
      "Países Bajos: el apoyo juvenil va por el municipio (Jeugdwet) y el escolar por el samenwerkingsverband, la agrupación de centros de la zona."
    ],
    start: "Preguntando directamente en el cantón o en el ayuntamiento: en estos dos países la respuesta nacional no sirve de mucho.",
    pending: "Todo el detalle: hay que verificarlo cantón a cantón y municipio a municipio.",
    sources: "AI/IV (Suiza). Jeugdwet (Países Bajos).",
    reviewed: "Última revisión: 31 de agosto de 2026." },

  { region: "América", country: "Canadá",
    lede: "Canadá aprobó su primera estrategia nacional de autismo en 2024, pero los servicios siguen siendo provinciales y muy desiguales. Las ayudas económicas, en cambio, son federales y encadenadas.",
    points: [
      "El Framework for Autism in Canada y la Canada's Autism Strategy se presentaron el 26 de septiembre de 2024, en cumplimiento de la Federal Framework on Autism Spectrum Disorder Act (2023); la National Autism Network los pone en marcha.",
      "Los servicios son provinciales y desiguales: en Ontario, la lista de espera de los servicios financiados superaba las 73.000 personas en octubre de 2024.",
      "El Disability Tax Credit (DTC) es la llave del resto: sin él no se accede a lo demás.",
      "Con el DTC se abren el Registered Disability Savings Plan (RDSP), con aportaciones estatales; el Canada Disability Benefit, desde 2025, de hasta 2.400 dólares al año para personas adultas; y el Child Disability Benefit, como suplemento del Canada Child Benefit.",
      "El Jordan's Principle cubre a la infancia de las Primeras Naciones."
    ],
    start: "Por el Disability Tax Credit, porque es la llave de todas las demás ayudas federales. Autism Alliance of Canada, Autism Canada y las sociedades provinciales orientan sobre los servicios de cada provincia.",
    pending: "Las cuantías del año en curso y el detalle provincia a provincia.",
    sources: "Public Health Agency of Canada, Framework for Autism in Canada y Canada's Autism Strategy (26 de septiembre de 2024). Federal Framework on Autism Spectrum Disorder Act (2023).",
    reviewed: "Última revisión: 31 de agosto de 2026." },

  { region: "Oceanía", country: "Australia", news: true,
    lede: "Australia tiene el sistema de apoyos más conocido del mundo, el NDIS, y está en pleno cambio: desde octubre de 2026 la infancia pequeña con apoyos bajos o moderados pasa a un programa distinto.",
    points: [
      "El NDIS (National Disability Insurance Scheme) tiene unos 290.000 participantes autistas: el mayor grupo diagnóstico del sistema.",
      "Thriving Kids: desde el 1 de octubre de 2026, los menores de 8 años o menos con retraso del desarrollo o autismo y necesidades de apoyo bajas o moderadas empiezan a recibir apoyo por este programa estatal, dotado con 4.000 millones de dólares en cinco años.",
      "El despliegue completo es el 1 de enero de 2028; desde esa fecha cambia el acceso al NDIS para ese grupo.",
      "Los menores con discapacidad permanente y significativa, o con altas necesidades de apoyo, siguen en el NDIS.",
      "Se anunció el 20 de agosto de 2025 y el modelo se publicó el 3 de febrero de 2026."
    ],
    start: "Por el NDIS si la persona ya está dentro o tiene altas necesidades de apoyo; si es criatura pequeña con apoyos bajos o moderados, conviene seguir el calendario de Thriving Kids. Autism Awareness Australia, Amaze (Victoria) y Aspect informan del cambio.",
    pending: "Cada hito del calendario: es contenido de actualidad y se revisa en cada fecha.",
    sources: "NDIS, «Thriving Kids» (anuncio del 20 de agosto de 2025; modelo publicado el 3 de febrero de 2026).",
    reviewed: "Última revisión: 31 de agosto de 2026. Se revisa en octubre de 2026." },

  { region: "Oceanía", country: "Nueva Zelanda",
    lede: "Nueva Zelanda creó en 2022 un ministerio propio para las personas con discapacidad y tiene una guía clínica nacional de autismo, poco frecuente en un país pequeño.",
    points: [
      "Whaikaha, el Ministry of Disabled People creado en 2022, coordina los apoyos.",
      "La Aotearoa New Zealand Autism Guideline es la guía clínica nacional."
    ],
    start: "Por Whaikaha. Autism New Zealand es la asociación de referencia, y Altogether Autism funciona como servicio de información.",
    pending: "La edición vigente de la guía y el estado actual del ministerio.",
    sources: "Whaikaha, Ministry of Disabled People. Aotearoa New Zealand Autism Guideline.",
    reviewed: "Última revisión: 31 de agosto de 2026." }
];

const MAP = [
  { country: "Uruguay", text: "La Ley 18.651 de protección integral (2010). Las pensiones y los apoyos van por el BPS; el certificado, por la Comisión Nacional Honoraria de la Discapacidad." },
  { country: "Ecuador", text: "La Ley Orgánica de Discapacidades (2012). El carné de discapacidad lo emite el Ministerio de Salud Pública y abre las exoneraciones y el bono." },
  { country: "Paraguay", text: "La SENADIS certifica la discapacidad y coordina los apoyos." },
  { country: "Bolivia", text: "El carnet de discapacidad, con registro estatal, y el bono mensual. La gestión es municipal y departamental." },
  { country: "Venezuela", text: "El CONAPDIS certifica. La situación de los apoyos cambia con frecuencia: ficha corta, con la fecha visible y revisión cada seis meses." },
  { country: "Costa Rica", text: "El CONAPDIS y la Ley 7600 de igualdad de oportunidades (1996)." },
  { country: "Panamá", text: "La SENADIS y la certificación de la discapacidad." },
  { country: "Guatemala", text: "El CONADI, como ente coordinador." },
  { country: "República Dominicana", text: "El CONADIS RD certifica y coordina." }
];

const LANGSTR = {
  es: { aviso: "Esta página está en castellano. Los botones de idioma ya funcionan en toda la web; la traducción de esta sección está en marcha y se dice aquí para no darla por hecha." },
  en: { aviso: "This page is in Spanish. The language buttons already work across the site; translating this section is under way, and it is said here so nobody assumes it is done." },
  pt: { aviso: "Esta página está em castelhano. Os botões de idioma já funcionam em todo o site; a tradução desta seção está em andamento, e isso é dito aqui para não dar como pronta." }
};


class Component extends DCLogic {
  state = { lang: "es", region: "all", a11y: false, fs: 17, spacing: false, controls: false, contrast: false, guide: false, speak: false, motion: false };

  setLang(l) {
    this.setState({ lang: l });
    try { localStorage.setItem("ig_lang", l); document.documentElement.lang = l === "pt" ? "pt-BR" : l; } catch (e) {}
  }


  componentDidMount() {
    try {
      const sv = localStorage.getItem("ig_lang");
      if (sv && LANGSTR[sv]) this.setState({ lang: sv });
      document.documentElement.lang = sv === "pt" ? "pt-BR" : (sv || "es");
    } catch (e) {}
    try { document.documentElement.lang = document.documentElement.lang || "es"; } catch (e) {}
  }

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
    u.lang = "es-ES";
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
    const rows = C.filter((c) => st.region === "all" || c.region === st.region);
    const chip = (on) => ({ bg: on ? "#1f5f8b" : "#fff", color: on ? "#fff" : "#17395c", border: on ? "#1f5f8b" : "rgba(23,57,92,0.14)" });

    return {
      langButtons: [["es", "ES"], ["en", "EN"]].map(([code, label]) => ({
        label,
        pick: () => this.setLang(code),
        bg: (this.state.lang || "es") === code ? "#17395c" : "#fff",
        color: (this.state.lang || "es") === code ? "#fff" : "#17395c",
        border: (this.state.lang || "es") === code ? "#17395c" : "rgba(23,57,92,0.16)"
      })),
      langAviso: (LANGSTR[this.state.lang || "es"] || LANGSTR.es).aviso,

      chips: [{ key: "all", label: "Todos" }].concat(REGIONS.map((r) => ({ key: r, label: r })))
        .map((r) => Object.assign({ label: r.label, pick: () => this.setState({ region: r.key }) }, chip(st.region === r.key))),

      cards: rows.map((c) => ({
        region: c.region, country: c.country, lede: c.lede,
        isNews: !!c.news,
        points: c.points.map((text) => ({ text })),
        start: c.start,
        hasPending: !!c.pending, pending: c.pending || "",
        sources: c.sources, reviewed: c.reviewed
      })),

      showMap: st.region === "all" || st.region === "América",
      mapRows: MAP,

      a11yOpen: st.a11y,
      toggleA11y: () => this.setState({ a11y: !st.a11y }),
      fsUp: () => this.setReading({ fs: Math.min(st.fs + 2, 25) }),
      fsDown: () => this.setReading({ fs: Math.max(st.fs - 2, 15) }),
      fsLabel: Math.round((st.fs / 17) * 100) + "%",
      a11yToggles: ["spacing", "controls", "contrast", "guide", "speak", "motion"].map((k, n) => {
        const on = !!st[k];
        return {
          label: TOGGLES[n],
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

