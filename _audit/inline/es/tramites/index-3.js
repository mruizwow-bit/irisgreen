
const NEEDS = ["colegio", "trabajo", "diagnostico", "economica", "terapia"];
const COUNTRIES = ["es", "mx", "ar", "cl", "otro"];
const WHOS = ["yo", "hijo", "adulto"];

const PEDIR = {
  colegio: {
    es: [["Informe psicopedagógico", "Lo hace el equipo de orientación del colegio. Sin él casi no se puede pedir nada más."], ["Adaptaciones en clase", "Más tiempo, examen en otro formato, sitio con menos ruido."], ["Dictamen de escolarización", "Solo si se valoran apoyos específicos o cambiar de modalidad."]],
    mx: [["Evaluación psicopedagógica (USAER)", "La solicita la escuela. Da acceso al equipo de apoyo USAER."], ["Ajustes razonables en el aula", "Están reconocidos por la Ley General de Educación."]],
    ar: [["Proyecto Pedagógico Individual (PPI)", "Se acuerda entre escuela, familia y equipo tratante."], ["Maestra o maestro de apoyo a la inclusión", "Suele pedir certificado del equipo que atiende a la persona."]],
    cl: [["Programa de Integración Escolar (PIE)", "Necesita evaluación diagnóstica integral del colegio."], ["Decreto 83: adecuaciones curriculares", "Permite ajustar objetivos y forma de evaluar."]],
    otro: [["Pide la evaluación por escrito", "Con fecha y copia. Casi todos los sistemas empiezan ahí."], ["Busca la ley de inclusión educativa de tu país", "El nombre cambia; el derecho suele existir."]]
  },
  trabajo: {
    es: [["Ajustes razonables", "Se piden a la empresa. No hace falta contar todo tu diagnóstico."], ["Certificado de discapacidad", "Desde el 33% abre bonificaciones y reserva de puesto."], ["Adaptación del puesto por prevención de riesgos", "Vía poco conocida y suele ir más rápido."]],
    mx: [["Ajustes razonables", "Pídelos por escrito a Recursos Humanos."]],
    ar: [["Certificado Único de Discapacidad (CUD)", "Da acceso a cupo laboral y coberturas."]],
    cl: [["Ley 21.015 de inclusión laboral", "Obliga a reservar el 1% en empresas de 100 personas o más."]],
    otro: [["Petición escrita de ajustes", "Explica qué te cuesta y qué necesitas, no tu diagnóstico."]]
  },
  diagnostico: {
    es: [["Derivación desde el médico de cabecera", "Pide constancia por escrito si te la niegan."], ["Unidad de salud mental o neuropediatría", "La espera suele ser larga. Pide el número de tu solicitud."], ["Valoración privada con informe", "Pregunta antes si sirve para el colegio o el trabajo."]],
    mx: [["Valoración en centro de salud", "Pide la hoja de referencia."]],
    ar: [["Turno con equipo interdisciplinario", "Es el paso necesario para el CUD."]],
    cl: [["Evaluación en CESFAM o COSAM", "Se entra por el consultorio."]],
    otro: [["Empieza por atención primaria", "Es la puerta de entrada en casi todos los sistemas."]]
  },
  economica: {
    es: [["Prestación por hijo con discapacidad", "Es compatible con otras ayudas familiares."], ["Grado de discapacidad del 33% o más", "Da deducciones, transporte y ocio."], ["Ayudas de tu comunidad autónoma", "Cambian mucho: revisa la de la tuya."]],
    mx: [["Pensión para personas con discapacidad", "Requisitos por edad y estado."]],
    ar: [["Asignación por hijo con discapacidad (ANSES)", "Necesita CUD vigente."]],
    cl: [["Subsidio de discapacidad mental", "Se pide con la inscripción en el Registro Nacional."]],
    otro: [["Busca el registro nacional de discapacidad", "Suele ser el paso previo a cualquier ayuda."]]
  },
  terapia: {
    es: [["Terapia por la vía pública", "Pregunta por psicología clínica infantil o de adultos."], ["Atención temprana (0 a 6 años)", "Gratuita y prioritaria. Se pide desde pediatría."], ["Ayudas para tratamiento privado", "Algunas comunidades y mutuas devuelven parte."]],
    mx: [["Centros de rehabilitación", "Cuotas ajustadas a ingresos."]],
    ar: [["Cobertura por Ley 24.901", "Con CUD, la obra social debe cubrir las prestaciones."]],
    cl: [["Salud mental en atención primaria", "Se entra por el consultorio."]],
    otro: [["Pregunta qué cubre tu seguro o sistema público", "Y pide la negativa por escrito si la hay."]]
  }
};

const STR = {
  es: {
    booksBar: "Todo aquí es gratis gracias a los libros de Iris Green", booksCta: "Leer las primeras páginas",
    navHome: "Inicio", navVideos: "Vídeos", navTopics: "Temas", navBooks: "Libros", reading: "Lectura",
    readingPanel: "Lectura accesible", textSize: "Tamaño del texto", reset: "Restablecer",
    eyebrow: "Derechos y trámites", title: "¿Qué puedo pedir y cómo se llama?",
    lede: "Elige lo que necesitas, dónde vives y para quién es. Te decimos qué existe, con qué nombre pedirlo y en qué orden.",
    needLabel: "Lo que necesito", countryLabel: "Dónde vivo", whoLabel: "Para quién es",
    stepsTitle: "Pídelo en este orden", done: "Marcar como hecho", directory: "Ver las 2.422 fichas del directorio →",
    disclaimer: "Esta guía orienta. No sustituye a un servicio jurídico ni a los servicios sociales de tu zona.",
    progress: (a, b) => a + " de " + b + " pasos marcados",
    letterTitle: "Carta lista para enviar", letterText: "Cópiala, cambia lo que esté entre corchetes y envíala por escrito. Guarda siempre una copia con fecha.",
    copy: "Copiar la carta", copied: "Copiada ✓", tagline: "Base de conocimiento sobre neurodiversidad",
    needs: { colegio: "Apoyos en el colegio o instituto", trabajo: "Ajustes en el trabajo", diagnostico: "Una valoración o diagnóstico", economica: "Ayuda económica", terapia: "Terapia o intervención" },
    countries: { es: "España", mx: "México", ar: "Argentina", cl: "Chile", otro: "Otro país" },
    whos: { yo: "Para mí", hijo: "Para mi hijo o hija", adulto: "Para un familiar adulto" },
    toggles: ["Letra más separada", "Botones más grandes", "Más contraste", "Guía de lectura", "Leer en voz alta", "Reducir movimiento"],
    letterFor: { yo: "para mí", hijo: "para mi hijo/a [nombre]", adulto: "para mi familiar [nombre]" },
    letterBody: (need, who) => "A la atención de [centro / empresa / servicio]\n\nMe dirijo a ustedes para solicitar por escrito " + need + " " + who + ".\n\nMotivo: [describe en una o dos frases qué ocurre y qué dificulta].\nLo que pido concretamente: [enumera aquí lo que necesitas].\n\nAgradezco que me confirmen por escrito la recepción de esta solicitud y el plazo de respuesta.\n\n[Nombre y apellidos] · [DNI o identificación] · [fecha]\n[Teléfono] · [correo]"
  },
  en: {
    booksBar: "Everything here is free thanks to Iris Green's books", booksCta: "Read the first pages",
    navHome: "Home", navVideos: "Videos", navTopics: "Topics", navBooks: "Books", reading: "Reading",
    readingPanel: "Accessible reading", textSize: "Text size", reset: "Reset",
    eyebrow: "Rights and paperwork", title: "What can I ask for, and what is it called?",
    lede: "Pick what you need, where you live and who it is for. We tell you what exists, what to call it and in which order to ask.",
    needLabel: "What I need", countryLabel: "Where I live", whoLabel: "Who it is for",
    stepsTitle: "Ask in this order", done: "Mark as done", directory: "See all 2,422 directory entries →",
    disclaimer: "This is guidance. It does not replace legal advice or your local social services.",
    progress: (a, b) => a + " of " + b + " steps ticked",
    letterTitle: "Letter ready to send", letterText: "Copy it, change what is inside brackets and send it in writing. Always keep a dated copy.",
    copy: "Copy the letter", copied: "Copied ✓", tagline: "Knowledge base on neurodiversity",
    needs: { colegio: "Support at school", trabajo: "Adjustments at work", diagnostico: "An assessment or diagnosis", economica: "Financial support", terapia: "Therapy or intervention" },
    countries: { es: "Spain", mx: "Mexico", ar: "Argentina", cl: "Chile", otro: "Another country" },
    whos: { yo: "For me", hijo: "For my child", adulto: "For an adult relative" },
    toggles: ["Wider letter spacing", "Bigger buttons", "More contrast", "Reading guide", "Read aloud", "Reduce motion"],
    letterFor: { yo: "for myself", hijo: "for my child [name]", adulto: "for my relative [name]" },
    letterBody: (need, who) => "To [school / employer / service]\n\nI am writing to formally request " + need + " " + who + ".\n\nReason: [describe in one or two sentences what happens and what it makes hard].\nWhat I am asking for: [list it here].\n\nPlease confirm in writing that you received this request and the time frame for a reply.\n\n[Full name] · [ID number] · [date]\n[Phone] · [email]"
  },
  pt: {
    booksBar: "Tudo aqui é gratuito graças aos livros de Iris Green", booksCta: "Ler as primeiras páginas",
    navHome: "Início", navVideos: "Vídeos", navTopics: "Temas", navBooks: "Livros", reading: "Leitura",
    readingPanel: "Leitura acessível", textSize: "Tamanho do texto", reset: "Restaurar",
    eyebrow: "Direitos e trâmites", title: "O que posso pedir e como se chama?",
    lede: "Escolha o que precisa, onde vive e para quem é. Dizemos o que existe, com que nome pedir e em que ordem.",
    needLabel: "O que preciso", countryLabel: "Onde vivo", whoLabel: "Para quem é",
    stepsTitle: "Peça nesta ordem", done: "Marcar como feito", directory: "Ver as 2.422 fichas do diretório →",
    disclaimer: "Este guia orienta. Não substitui assessoria jurídica nem os serviços sociais da sua região.",
    progress: (a, b) => a + " de " + b + " passos marcados",
    letterTitle: "Carta pronta para enviar", letterText: "Copie, troque o que está entre colchetes e envie por escrito. Guarde sempre uma cópia com data.",
    copy: "Copiar a carta", copied: "Copiada ✓", tagline: "Base de conhecimento sobre neurodiversidade",
    needs: { colegio: "Apoios na escola", trabajo: "Ajustes no trabalho", diagnostico: "Uma avaliação ou diagnóstico", economica: "Ajuda financeira", terapia: "Terapia ou intervenção" },
    countries: { es: "Espanha", mx: "México", ar: "Argentina", cl: "Chile", otro: "Outro país" },
    whos: { yo: "Para mim", hijo: "Para meu filho ou filha", adulto: "Para um familiar adulto" },
    toggles: ["Letras mais separadas", "Botões maiores", "Mais contraste", "Guia de leitura", "Ler em voz alta", "Reduzir movimento"],
    letterFor: { yo: "para mim", hijo: "para meu filho/a [nome]", adulto: "para meu familiar [nome]" },
    letterBody: (need, who) => "Ao [escola / empresa / serviço]\n\nVenho solicitar por escrito " + need + " " + who + ".\n\nMotivo: [descreva em uma ou duas frases o que acontece e o que dificulta].\nO que peço concretamente: [liste aqui].\n\nPeço a confirmação por escrito do recebimento deste pedido e do prazo de resposta.\n\n[Nome completo] · [documento] · [data]\n[Telefone] · [e-mail]"
  }
};

const NAVL = {
  es: [["/","Inicio"],["/es/neurodiversidad/condiciones/","Condiciones"],["/es/situaciones/","Situaciones"],["/es/biblioteca/","Vida diaria"],["/es/videos/","Vídeos"],["/es/investigacion/","Investigación"],["/es/datos/","Datos"],["/es/tramites/directorio/","Ayudas"],["/es/tramites/","Cómo pedirlo"],["/es/libros/","Libros"]],
  en: [["/","Home"],["/es/neurodiversidad/condiciones/","Conditions"],["/es/situaciones/","Situations"],["/es/biblioteca/","Everyday life"],["/es/videos/","Videos"],["/es/investigacion/","Research"],["/es/datos/","Figures"],["/es/tramites/directorio/","Support directory"],["/es/tramites/","How to ask"],["/es/libros/","Books"]],
  pt: [["/","Início"],["/es/neurodiversidad/condiciones/","Condições"],["/es/situaciones/","Situações"],["/es/biblioteca/","Vida diária"],["/es/videos/","Vídeos"],["/es/investigacion/","Pesquisa"],["/es/datos/","Dados"],["/es/tramites/directorio/","Diretório de ajudas"],["/es/tramites/","Como pedir"],["/es/libros/","Livros"]]
};

class Component extends DCLogic {
  state = { lang: "es", need: "colegio", country: "es", who: "yo", checked: {}, copied: false, a11y: false, music: false, fs: 17, spacing: false, controls: false, contrast: false, guide: false, speak: false, motion: false };

  componentDidMount() {
    try { document.documentElement.lang = document.documentElement.lang || "es"; } catch (e) {}
    try {
      const lang = localStorage.getItem("ig_lang");
      const use = lang && STR[lang] ? lang : "es";
      if (use !== "es") this.setState({ lang: use });
      document.documentElement.lang = use === "pt" ? "pt-BR" : use;
    } catch (e) {}
  }

  setLang(lang) {
    try { document.documentElement.lang = lang === "pt" ? "pt-BR" : lang; } catch (e) {}
    this.setState({ lang });
    try { localStorage.setItem("ig_lang", lang); } catch (e) {}
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
      el.style.cssText = "position:fixed;left:0;right:0;height:46px;pointer-events:none;z-index:70;background:rgba(111,95,192,0.14);border-top:2px solid rgba(111,95,192,0.5);border-bottom:2px solid rgba(111,95,192,0.5);top:0";
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
    const rows = (PEDIR[st.need] || {})[st.country] || [];
    const key = st.need + "-" + st.country;
    const checkedSet = st.checked[key] || [];
    const letter = T.letterBody(T.needs[st.need].toLowerCase(), T.letterFor[st.who]);

    return {
      langButtons: [["es", "ES"], ["en", "EN"], ["pt", "PT-BR"]].map(([code, label]) => ({
        label,
        bg: st.lang === code ? "#17395c" : "transparent",
        color: st.lang === code ? "#fff" : "#17395c",
        pick: () => this.setLang(code)
      })),

      navLinks: (NAVL[L] || NAVL.es).filter(([href]) => href !== "/es/tramites/").map(([href, label]) => ({ href, label })),

      tBooksBar: T.booksBar, tBooksCta: T.booksCta, tNavHome: T.navHome, tNavVideos: T.navVideos,
      tNavTopics: T.navTopics, tNavBooks: T.navBooks, tReading: T.reading, tReadingPanel: T.readingPanel,
      tTextSize: T.textSize, tReset: T.reset, tEyebrow: T.eyebrow, tTitle: T.title, tLede: T.lede,
      tNeedLabel: T.needLabel, tCountryLabel: T.countryLabel, tWhoLabel: T.whoLabel,
      tStepsTitle: T.stepsTitle, tDone: T.done, tDisclaimer: T.disclaimer, tTagline: T.tagline, tDirectory: T.directory,
      tLetterTitle: T.letterTitle, tLetterText: T.letterText,

      need: st.need, country: st.country, who: st.who,
      onNeed: (e) => this.setState({ need: e.target.value }),
      onCountry: (e) => this.setState({ country: e.target.value }),
      onWho: (e) => this.setState({ who: e.target.value }),
      needOptions: NEEDS.map((v) => ({ value: v, label: T.needs[v] })),
      countryOptions: COUNTRIES.map((v) => ({ value: v, label: T.countries[v] })),
      whoOptions: WHOS.map((v) => ({ value: v, label: T.whos[v] })),

      heading: T.needs[st.need] + " · " + T.countries[st.country],
      items: rows.map((r, n) => {
        const on = checkedSet.indexOf(n) !== -1;
        return {
          n: n + 1, name: r[0], detail: r[1],
          checkBg: on ? "#1f8ba8" : "#fff",
          checkBorder: on ? "#1f8ba8" : "rgba(23,57,92,0.2)",
          checkColor: on ? "#fff" : "transparent",
          check: () => {
            const next = Object.assign({}, st.checked);
            next[key] = on ? checkedSet.filter((x) => x !== n) : checkedSet.concat([n]);
            this.setState({ checked: next });
          }
        };
      }),
      progressLabel: T.progress(checkedSet.length, rows.length),

      letter,
      copyLabel: st.copied ? T.copied : T.copy,
      copyLetter: () => {
        try { navigator.clipboard.writeText(letter); } catch (e) {}
        this.setState({ copied: true });
        setTimeout(() => this.setState({ copied: false }), 2200);
      },

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
          label: T.toggles[n],
          bg: on ? "rgba(111,95,192,0.12)" : "#fff",
          border: on ? "#6f5fc0" : "rgba(23,57,92,0.16)",
          knobTrack: on ? "#6f5fc0" : "rgba(23,57,92,0.22)",
          knobLeft: on ? "16px" : "2px",
          toggle: () => this.setReading({ [k]: !on })
        };
      }),
      a11yReset: () => this.setReading({ fs: 17, spacing: false, controls: false, contrast: false, guide: false, speak: false, motion: false })
    };
  }
}

