
const TOGGLES = ["Letra más separada", "Botones más grandes", "Más contraste", "Guía de lectura", "Leer en voz alta", "Reducir movimiento"];

const TESTS = [
  { id: "aq10", topic: "Autismo", name: "AQ-10", ready: false,
    what: "Diez preguntas con cuatro opciones de respuesta. Es la versión breve que NICE recomienda para identificar en personas adultas.",
    time: "2 o 3 minutos", cut: "6 o más",
    source: "Versión española validada por López (2020), «Tamizaje de Trastornos del Espectro Autista en adultos: una versión en español del AQ-10», con punto de corte 6, sensibilidad .89 y especificidad .91. Los ítems se toman literalmente del anexo del artículo. Instrumento del Autism Research Centre (Cambridge), de uso libre no comercial citando la fuente." },

  { id: "catq", topic: "Camuflaje", name: "CAT-Q-ES", ready: false,
    what: "Veinticinco preguntas en una escala del 1 al 7, con tres partes: la compensación, el enmascaramiento y la asimilación. Mide cuánto esfuerzo se dedica a encajar.",
    time: "5 a 8 minutos", cut: "100 en la puntuación total, como referencia divulgativa",
    note: "Una puntuación de camuflaje, por sí sola, no establece si una persona es autista. El camuflaje agota y afecta al bienestar: si tu puntuación te preocupa, llévala a la consulta.",
    source: "Adaptación cultural y validación española: Conde-Pumpido Zubizarreta y cols. (2025), «Camouflaging Autistic Traits Questionnaire: Cultural Adaptation, Reliability, and Validity in Autistic and Non-Autistic from Spain», con 490 adultos (111 autistas y 379 no autistas), consistencia interna ω=.95 y test-retest r=.99. Instrumento original de Hull y cols. (2019), en acceso abierto." },

  { id: "asrs", topic: "TDAH", name: "ASRS v1.1", ready: false,
    what: "El cuestionario autoinformado de la Organización Mundial de la Salud. La parte A tiene seis preguntas y es el cribado; las doce restantes aportan contexto para la consulta.",
    time: "3 a 6 minutos", cut: "4 o más respuestas en las casillas marcadas de la parte A",
    note: "Los rasgos del TDAH y del autismo se solapan. Distinguirlos es trabajo del profesional, no de un cuestionario.",
    source: "Versión española oficial de la OMS distribuida por Harvard (6Q y 18Q, español para España y México). El 6Q Screener puede usarse gratuitamente, incluso con fines comerciales, citando la fuente y sin modificar el instrumento." },

  { id: "raads", topic: "Autismo", name: "RAADS-R", ready: false, pendingOverride: true,
    what: "Ochenta preguntas para personas adultas que llegaron a la vida adulta sin diagnóstico.",
    time: "20 a 30 minutos", cut: "65 o más en el estudio de validación",
    note: "No lo publicamos. El estudio original (Ritvo y cols., 2011) se hizo con participantes angloparlantes y sus autores especifican que se diseñó para administrarlo un profesional en consulta, no como cribado en línea. No usamos traducciones españolas de procedencia desconocida.",
    source: "Ritvo y cols. (2011), estudio internacional de validación. Pendiente de localizar una adaptación española documentada." }
];

const NOTS = [
  { text: "Ningún cuestionario para menores de 18 años." },
  { text: "Ningún cribado de conducta alimentaria." },
  { text: "Ningún resultado con etiqueta: nada de «compatible con» ni «probable». Solo la puntuación, el umbral con su fuente y el paso siguiente." },
  { text: "Ningún registro, cuenta, correo ni cookie ligados a los cuestionarios." }
];

const LANGSTR = {
  es: { aviso: "Esta página está en castellano. Los botones de idioma ya funcionan en toda la web; la traducción de esta sección está en marcha y se dice aquí para no darla por hecha." },
  en: { aviso: "This page is in Spanish. The language buttons already work across the site; translating this section is under way, and it is said here so nobody assumes it is done." },
  pt: { aviso: "Esta página está em castelhano. Os botões de idioma já funcionam em todo o site; a tradução desta seção está em andamento, e isso é dito aqui para não dar como pronta." }
};


class Component extends DCLogic {
  state = { lang: "es", a11y: false, fs: 17, spacing: false, controls: false, contrast: false, guide: false, speak: false, motion: false };

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
    return {
      langButtons: [["es", "ES"], ["en", "EN"]].map(([code, label]) => ({
        label,
        pick: () => this.setLang(code),
        bg: (this.state.lang || "es") === code ? "#17395c" : "#fff",
        color: (this.state.lang || "es") === code ? "#fff" : "#17395c",
        border: (this.state.lang || "es") === code ? "#17395c" : "rgba(23,57,92,0.16)"
      })),
      langAviso: (LANGSTR[this.state.lang || "es"] || LANGSTR.es).aviso,

      tests: TESTS.map((t) => ({
        name: t.name, topic: t.topic, what: t.what, time: t.time, cut: t.cut, source: t.source,
        hasNote: !!t.note, note: t.note || "",
        state: t.ready ? "Disponible" : t.pendingOverride ? "No se publica" : "Listo para cargar",
        stateColor: t.ready ? "#0e6480" : t.pendingOverride ? "#a8336f" : "#8a5a12",
        stateBg: t.ready ? "rgba(14,100,128,0.12)" : t.pendingOverride ? "rgba(168,51,111,0.1)" : "rgba(196,138,55,0.18)",
        border: t.ready ? "rgba(90,73,168,0.3)" : "rgba(23,57,92,0.1)",
        ready: t.ready,
        pending: !t.ready,
        pendingText: t.pendingOverride
          ? "Queda fuera hasta que exista una adaptación española documentada."
          : "Faltan los ítems de la versión validada para poder publicarlo. No se reescriben ni se traducen: se copian del original.",
        start: () => {}
      })),
      nots: NOTS,

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

