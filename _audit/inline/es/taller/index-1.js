
const MESA_IMG = [
  "/img/taller-mesa-dibujar.webp",
  "/img/taller-mesa-escribir.webp",
  "/img/taller-mesa-construir.webp",
  "/img/taller-mesa-sonidos.webp",
  "/img/taller-mesa-mirar.webp",
  "/img/taller-mesa-inventar.webp"
];

const STR = {
  es: {
    docTitle: "El taller — Iris Green", logoAlt: "Símbolo de Iris Green: una flor de iris",
    backToPlay: "Volver a Jugar", reading: "Lectura", readingPanel: "Lectura accesible",
    textSize: "Tamaño del texto · ", resetPanel: "Restablecer",
    tagline: "Base de conocimiento sobre neurodiversidad",
    navSituations: "Situaciones", navVideos: "Vídeos",
    eyebrow: "El taller",
    title: "Aquí se prueban cosas.",
    lede: "Se coge un reto, se hace y sale lo que salga. Vale para cualquier edad, con lo que hay en casa y en poco rato.",
    lede2: "No hay resultado correcto. No se puntúa. No se sube nada.",
    rulesTitle: "Las reglas del taller",
    rules: ["No hay resultado correcto.", "No se puntúa nada.", "No se sube nada a la web.", "Lo que se hace es de quien lo hace.", "Se puede dejar a medias.", "Se puede repetir el mismo reto muchas veces."],
    timeLabel: "Cuánto rato tengo",
    mesaLabel: "Qué me apetece",
    all: "Todo",
    times: ["Diez minutos", "Una tarde", "A ratos durante días"],
    coverAlt: "Acuarela de una mesa larga de taller. Seis personas de distintas edades trabajan a la vez: una pinta con acuarelas, otra graba sonido con un micrófono, otra monta un puente de papel, otra ordena botones por color, otra dibuja en un cuaderno y otra mira piedras y hojas con una lupa.",
    mesas: ["Dibujar", "Escribir y contar", "Construir", "Sonidos", "Mirar", "Inventar"],
    mesaNotes: [
      "Se dibuja lo que hay delante y lo que no existe.",
      "Salen historias, listas e instrucciones.",
      "Se hacen cosas con papel, cartón y lo que haya por casa.",
      "Se graba, se escucha y se inventa.",
      "Se sale a buscar y se vuelve con veinte fotos.",
      "Reglas nuevas, mapas nuevos y códigos."
    ],
    filterNote: "Elige el rato que tienes y la mesa que te apetece. Si un reto no te encaja, mira la línea «otra manera».",
    weekly: "El reto de esta semana",
    other: "Otra manera",
    yours: "Esto es tuyo. Guárdalo, tíralo o repítelo mañana.",
    count: (n) => n === 1 ? "1 reto" : n + " retos",
    empty: "Con estos filtros no hay nada. Prueba a quitar uno.",
    sheetsTitle: "Las hojas para imprimir",
    sheetsNote: "Doce hojas A4 en blanco para los retos que las necesitan.",
    soon: "Lista para imprimir", openSheets: "Abrir las doce hojas",
    sheets: ["La cuadrícula de nueve casillas", "Las cuatro viñetas", "El cuaderno de campo", "El mapa en blanco", "El tablero de seis casillas", "La ficha de criatura", "La hoja de colección", "La hoja de instrucciones", "La ficha de invento", "La hoja de ritmo", "La ficha de personaje", "La hoja libre"],
    toggles: ["Letra más separada", "Botones más grandes", "Más contraste", "Guía de lectura", "Leer en voz alta", "Reducir movimiento"]
  },
  en: {
    docTitle: "The workshop — Iris Green", logoAlt: "Iris Green symbol: an iris flower",
    backToPlay: "Back to Play", reading: "Reading", readingPanel: "Accessible reading",
    textSize: "Text size · ", resetPanel: "Reset",
    tagline: "A knowledge base on neurodiversity",
    navSituations: "Situations", navVideos: "Videos",
    eyebrow: "The workshop",
    title: "This is where you try things.",
    lede: "You take a challenge, you do it and whatever comes out, comes out. Any age, with what is already at home, in a short while.",
    lede2: "There is no right result. Nothing is scored. Nothing is uploaded.",
    rulesTitle: "The workshop rules",
    rules: ["There is no right result.", "Nothing is scored.", "Nothing is uploaded to the site.", "What you make belongs to you.", "You can leave it half done.", "You can repeat the same challenge many times."],
    timeLabel: "How long I have",
    mesaLabel: "What I feel like",
    all: "Everything",
    times: ["Ten minutes", "An afternoon", "A bit at a time over days"],
    coverAlt: "Watercolour of a long workshop table. Six people of different ages work at the same time: one paints with watercolours, one records sound with a microphone, one builds a paper bridge, one sorts buttons by colour, one draws in a notebook and one looks at stones and leaves with a magnifying glass.",
    mesas: ["Drawing", "Writing and telling", "Building", "Sounds", "Looking", "Inventing"],
    mesaNotes: [
      "You draw what is in front of you and what does not exist.",
      "Stories, lists and instructions come out.",
      "You make things with paper, cardboard and whatever is around.",
      "You record, you listen and you invent.",
      "You go out looking and come back with twenty photos.",
      "New rules, new maps and codes."
    ],
    filterNote: "Choose the time you have and the table you feel like. If a challenge does not fit you, look at the «another way» line.",
    weekly: "This week's challenge",
    other: "Another way",
    yours: "This is yours. Keep it, throw it away or do it again tomorrow.",
    count: (n) => n === 1 ? "1 challenge" : n + " challenges",
    empty: "Nothing with these filters. Try removing one.",
    sheetsTitle: "The sheets to print",
    sheetsNote: "Twelve blank A4 sheets for the challenges that need them.",
    soon: "Ready to print", openSheets: "Open the twelve sheets",
    sheets: ["The nine-square grid", "The four comic panels", "The field notebook", "The blank map", "The six-square board", "The creature sheet", "The collection sheet", "The instructions sheet", "The invention sheet", "The rhythm sheet", "The character sheet", "The free sheet"],
    toggles: ["Wider letter spacing", "Bigger buttons", "More contrast", "Reading guide", "Read aloud", "Reduce motion"]
  },
  pt: {
    docTitle: "A oficina — Iris Green", logoAlt: "Símbolo da Iris Green: uma flor de íris",
    backToPlay: "Voltar para Jogar", reading: "Leitura", readingPanel: "Leitura acessível",
    textSize: "Tamanho do texto · ", resetPanel: "Restaurar",
    tagline: "Base de conhecimento sobre neurodiversidade",
    navSituations: "Situações", navVideos: "Vídeos",
    eyebrow: "A oficina",
    title: "Aqui se experimentam coisas.",
    lede: "Você pega um desafio, faz e sai o que sair. Serve para qualquer idade, com o que já tem em casa e em pouco tempo.",
    lede2: "Não há resultado certo. Não se pontua. Não se envia nada.",
    rulesTitle: "As regras da oficina",
    rules: ["Não há resultado certo.", "Não se pontua nada.", "Não se envia nada para o site.", "O que se faz é de quem faz.", "Dá para deixar pela metade.", "Dá para repetir o mesmo desafio muitas vezes."],
    timeLabel: "Quanto tempo eu tenho",
    mesaLabel: "Do que eu tenho vontade",
    all: "Tudo",
    times: ["Dez minutos", "Uma tarde", "Aos poucos, em vários dias"],
    coverAlt: "Aquarela de uma mesa comprida de oficina. Seis pessoas de idades diferentes trabalham ao mesmo tempo: uma pinta com aquarela, outra grava som com um microfone, outra monta uma ponte de papel, outra separa botões por cor, outra desenha num caderno e outra observa pedras e folhas com uma lupa.",
    mesas: ["Desenhar", "Escrever e contar", "Construir", "Sons", "Olhar", "Inventar"],
    mesaNotes: [
      "Desenha-se o que está na frente e o que não existe.",
      "Saem histórias, listas e instruções.",
      "Fazem-se coisas com papel, papelão e o que tiver em casa.",
      "Grava-se, escuta-se e inventa-se.",
      "Sai-se para procurar e volta-se com vinte fotos.",
      "Regras novas, mapas novos e códigos."
    ],
    filterNote: "Escolha o tempo que você tem e a mesa que te dá vontade. Se um desafio não encaixar, olhe a linha «de outro jeito».",
    weekly: "O desafio desta semana",
    other: "De outro jeito",
    yours: "Isto é seu. Guarde, jogue fora ou repita amanhã.",
    count: (n) => n === 1 ? "1 desafio" : n + " desafios",
    empty: "Com estes filtros não há nada. Tente tirar um.",
    sheetsTitle: "As folhas para imprimir",
    sheetsNote: "Doze folhas A4 em branco para os desafios que precisam delas.",
    soon: "Pronta para imprimir", openSheets: "Abrir as doze folhas",
    sheets: ["A grade de nove quadros", "Os quatro quadrinhos", "O caderno de campo", "O mapa em branco", "O tabuleiro de seis casas", "A ficha de criatura", "A folha de coleção", "A folha de instruções", "A ficha de invento", "A folha de ritmo", "A ficha de personagem", "A folha livre"],
    toggles: ["Letras mais separadas", "Botões maiores", "Mais contraste", "Guia de leitura", "Ler em voz alta", "Reduzir movimento"]
  }
};

class Component extends DCLogic {
  state = { lang: "es", retos: null, time: -1, mesa: -1, a11y: false, fs: 17, spacing: false, controls: false, contrast: false, guide: false, speak: false, motion: false };

  componentDidMount() {
    try {
      const lang = localStorage.getItem("ig_lang");
      const use = lang && STR[lang] ? lang : "es";
      if (use !== "es") this.setState({ lang: use });
      document.documentElement.lang = use === "pt" ? "pt-BR" : use;
      document.title = STR[use].docTitle;
    } catch (e) {}
    fetch("taller-retos.json").then((r) => r.json()).then((retos) => this.setState({ retos })).catch(() => {});
  }

  componentDidUpdate() {
    clearTimeout(this._titleT);
    this._titleT = setTimeout(() => {
      const t = (STR[this.state.lang] || STR.es).docTitle;
      if (document.title !== t) document.title = t;
    }, 0);
  }

  setLang(lang) {
    try {
      document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
      localStorage.setItem("ig_lang", lang);
    } catch (e) {}
    this.setState({ lang });
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
    const all = st.retos || [];
    const rows = all.filter((r) => (st.time < 0 || r.dur === st.time) && (st.mesa < 0 || r.mesa === st.mesa));
    const txt = (r) => r[L] || r.es;

    // el reto de la semana rota los lunes
    const week = Math.floor(Date.now() / 604800000);
    const w = all.length ? all[week % all.length] : null;

    const chip = (label, on, pick) => ({
      label, pick,
      bg: on ? "#a8336f" : "#fff",
      color: on ? "#fff" : "#17395c",
      border: on ? "#a8336f" : "rgba(23,57,92,0.14)"
    });

    return {
      langButtons: [["es", "ES"], ["en", "EN"]].map(([code, label]) => ({
        label,
        bg: st.lang === code ? "#1f5f8b" : "#fff",
        color: st.lang === code ? "#fff" : "#17395c",
        border: st.lang === code ? "#1f5f8b" : "rgba(23,57,92,0.16)",
        pick: () => this.setLang(code)
      })),
      tLogoAlt: T.logoAlt, tBackToPlay: T.backToPlay, tReading: T.reading, tReadingPanel: T.readingPanel,
      tTextSize: T.textSize, tResetPanel: T.resetPanel, tTagline: T.tagline,
      tNavSituations: T.navSituations, tNavVideos: T.navVideos,
      tEyebrow: T.eyebrow, tTitle: T.title, tLede: T.lede, tLede2: T.lede2,
      tRulesTitle: T.rulesTitle, tTimeLabel: T.timeLabel, tMesaLabel: T.mesaLabel,
      tFilterNote: T.filterNote, tWeekly: T.weekly, tOther: T.other, tYours: T.yours,
      tEmpty: T.empty, tSheetsTitle: T.sheetsTitle, tSheetsNote: T.sheetsNote, tOpenSheets: T.openSheets,

      rules: T.rules.map((text) => ({ text })),
      timeChips: [chip(T.all, st.time < 0, () => this.setState({ time: -1 }))].concat(
        T.times.map((label, n) => chip(label, st.time === n, () => this.setState({ time: st.time === n ? -1 : n })))
      ),
      mesaChips: [chip(T.all, st.mesa < 0, () => this.setState({ mesa: -1 }))].concat(
        T.mesas.map((label, n) => chip(label, st.mesa === n, () => this.setState({ mesa: st.mesa === n ? -1 : n })))
      ),

      hasWeekly: !!w,
      weekly: w ? { title: txt(w).t, what: txt(w).q, meta: T.times[w.dur] + " · " + txt(w).n } : { title: "", what: "", meta: "" },

      countLabel: T.count(rows.length),
      noResults: !!st.retos && rows.length === 0,

      tCoverAlt: T.coverAlt,
      mesas: [0, 1, 2, 3, 4, 5].map((m) => ({
        name: T.mesas[m], note: T.mesaNotes[m], img: MESA_IMG[m],
        retos: rows.filter((r) => r.mesa === m).map((r) => ({
          title: txt(r).t, what: txt(r).q, needs: txt(r).n, other: txt(r).o, dur: T.times[r.dur]
        })),
        count: rows.filter((r) => r.mesa === m).length
      })).filter((m) => m.count > 0),

      sheets: T.sheets.map((name) => ({ name, state: T.soon })),

      a11yOpen: st.a11y,
      toggleA11y: () => this.setState({ a11y: !st.a11y }),
      fsUp: () => this.setReading({ fs: Math.min(st.fs + 2, 25) }),
      fsDown: () => this.setReading({ fs: Math.max(st.fs - 2, 15) }),
      fsLabel: Math.round((st.fs / 17) * 100) + "%",
      a11yToggles: ["spacing", "controls", "contrast", "guide", "speak", "motion"].map((k, n) => {
        const on = !!st[k];
        return {
          label: T.toggles[n],
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

