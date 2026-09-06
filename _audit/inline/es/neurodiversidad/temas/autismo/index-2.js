
const YT = (id) => "https://www.youtube-nocookie.com/embed/" + id + "?rel=0&playsinline=1";
const IG = (p) => "https://www.instagram.com/" + p + "/embed/";

const VIDEOS = [
  { id: "dan", name: "Dan Wilkins · Managing on the Spectrum", source: "YouTube", src: YT("qy_6-Zhx-i0") },
  { id: "josep", name: "Josep Thió", source: "YouTube", src: YT("rEU5YZGvovc") },
  { id: "abraham", name: "Abraham Ros · Más allá del rosa", source: "YouTube", src: YT("KOHb8-xHpOU") }
];

const STR = {
  es: {
    booksBar: "Todo aquí es gratis gracias a los libros de Iris Green", booksCta: "Leer las primeras páginas",
    navHome: "Inicio", navVideos: "Vídeos", navAsk: "¿Qué puedo pedir?", navBooks: "Libros", navTopics: "Temas",
    reading: "Lectura", readingPanel: "Lectura accesible", textSize: "Tamaño del texto", reset: "Restablecer",
    eyebrow: "Tema", topicName: "Autismo",
    lede: "Una forma de percibir, de comunicarse y de estar con los demás. Cada persona autista es, antes que nada, una persona: lo que cambia es cómo le llega el mundo y qué necesita de él.",
    jumps: [["#que-es", "Qué es"], ["#como-se-nota", "Cómo se nota"], ["#que-ayuda", "Qué ayuda"], ["#escuchar", "Escuchar a alguien"], ["#pedir", "Qué puedo pedir"]],
    whatTitle: "Qué es, en claro",
    what1: "El autismo está presente desde el nacimiento y tiene que ver con cómo llega la información de los sentidos, cómo se organiza la comunicación y cuánta energía cuesta lo social.",
    what2: "Cada persona autista es distinta. Dos personas con el mismo diagnóstico pueden necesitar cosas opuestas: por eso aquí se habla de situaciones concretas y no de perfiles cerrados.",
    signsTitle: "Cómo se nota en el día a día",
    signsLede: "Cuatro escenas frecuentes. Lo que se ve por fuera casi nunca es lo que está pasando por dentro.",
    scenes: [
      ["En una tienda o un centro comercial", "Se tapa los oídos, quiere salir, se enfada por algo pequeño.", "El ruido, la luz y la gente se han ido sumando sin pausa durante veinte minutos.", "Salir antes del límite, no después. Acordar una señal para irse sin discutir."],
      ["En clase o en una reunión", "Parece que no atiende o que está en otro sitio.", "Está usando casi toda su energía en filtrar sonidos, mirar a la cara y sostener la postura.", "Permitir no mirar a los ojos, dar la información también por escrito, avisar de los cambios."],
      ["Al final del día", "Estalla o se apaga del todo por algo mínimo.", "Ha aguantado y disimulado durante horas. Lo pequeño es solo lo último que llegó.", "Un rato de silencio real sin preguntas, y revisar qué se puede quitar del día siguiente."],
      ["Con la comida o la ropa", "Rechaza texturas, siempre lo mismo, quita etiquetas.", "No es capricho: la textura llega mucho más intensa de lo que llegaría a otra persona.", "Ampliar despacio y sin castigo. Respetar lo que ya funciona como base segura."]
    ],
    helpTitle: "Qué ayuda y qué no",
    doLabel: "Ayuda", avoidLabel: "Mejor evitar",
    dos: ["Avisar de los cambios antes de que ocurran.", "Dar la información por escrito, además de hablada.", "Bajar el ruido y la luz antes de pedir algo importante.", "Aceptar los movimientos que calman (balanceo, manos, objetos).", "Preguntar qué necesita en lugar de suponerlo."],
    donts: ["Obligar a mirar a los ojos.", "Interpretar la sobrecarga como mala educación.", "Quitar de golpe las rutinas que sostienen el día.", "Hablar de la persona en tercera persona estando delante.", "Premiar el disimulo: aparentar que todo va bien pasa factura después."],
    videosTitle: "Escuchar a quien lo vive", allVideos: "Ver la videoteca completa →", play: "Ver aquí",
    askTitle: "¿Qué puedo pedir?", askText: "Apoyos en el colegio, ajustes en el trabajo, valoración o ayudas, según dónde vivas.",
    bookTitle: "Autismo en la vida diaria", bookText: "La guía en papel, escena por escena. Sostiene esta web.",
    researchTitle: "Qué dice la investigación", researchText: "Publicaciones científicas explicadas en claro, con la fuente a la vista.",
    footnote: "Esta página informa y orienta. No diagnostica ni sustituye a un profesional. Las fuentes y los criterios de revisión están en la metodología.",
    tagline: "Base de conocimiento sobre neurodiversidad",
    toggles: ["Letra más separada", "Botones más grandes", "Más contraste", "Guía de lectura", "Leer en voz alta", "Reducir movimiento"]
  },
  en: {
    booksBar: "Everything here is free thanks to Iris Green's books", booksCta: "Read the first pages",
    navHome: "Home", navVideos: "Videos", navAsk: "What can I ask for?", navBooks: "Books", navTopics: "Topics",
    reading: "Reading", readingPanel: "Accessible reading", textSize: "Text size", reset: "Reset",
    eyebrow: "Topic", topicName: "Autism",
    lede: "A way of perceiving, communicating and being with others. Every autistic person is, first of all, a person: what differs is how the world arrives and what they need from it.",
    jumps: [["#que-es", "What it is"], ["#como-se-nota", "How it shows"], ["#que-ayuda", "What helps"], ["#escuchar", "Hear someone"], ["#pedir", "What to ask for"]],
    whatTitle: "What it is, in plain words",
    what1: "Autism is a way the brain works, present from birth. It changes how sensory information arrives, how communication is organised and how much energy social situations take.",
    what2: "Every autistic person is different. Two people with the same diagnosis may need opposite things: that is why this page talks about concrete situations, not fixed profiles.",
    signsTitle: "How it shows in everyday life",
    signsLede: "Four common scenes. What you see from outside is almost never what is happening inside.",
    scenes: [
      ["In a shop or a mall", "Covering their ears, wanting to leave, getting angry over something small.", "Noise, light and people have been adding up with no break for twenty minutes.", "Leave before the limit, not after. Agree on a signal to go without arguing."],
      ["In class or in a meeting", "Looks like they are not paying attention.", "Almost all their energy goes into filtering sound, facing people and holding posture.", "Allow no eye contact, give information in writing too, warn about changes."],
      ["At the end of the day", "Explodes or shuts down completely over something tiny.", "They have coped and masked for hours. The small thing is just the last one to arrive.", "Real silence with no questions, then review what can be removed from tomorrow."],
      ["With food or clothes", "Rejects textures, always the same food, cuts off labels.", "It is not fussiness: the texture arrives far more intensely than it would for someone else.", "Widen slowly and without punishment. Respect what already works as a safe base."]
    ],
    helpTitle: "What helps and what does not",
    doLabel: "Helps", avoidLabel: "Better avoided",
    dos: ["Warn about changes before they happen.", "Give information in writing as well as spoken.", "Lower noise and light before asking something important.", "Accept the movements that soothe (rocking, hands, objects).", "Ask what they need instead of assuming."],
    donts: ["Forcing eye contact.", "Reading overload as bad manners.", "Removing the routines that hold the day together.", "Talking about the person in the third person in front of them.", "Rewarding masking: looking fine has a cost later."],
    videosTitle: "Hear the people who live it", allVideos: "See the full video library →", play: "Play here",
    askTitle: "What can I ask for?", askText: "School support, adjustments at work, assessment or benefits, depending on where you live.",
    bookTitle: "Autism in Everyday Life", bookText: "The printed guide, scene by scene. It keeps this site running.",
    researchTitle: "What research says", researchText: "Scientific publications explained in plain words, with the source in sight.",
    footnote: "This page informs and orients. It does not diagnose and does not replace a professional. Sources and review criteria are in the methodology.",
    tagline: "Knowledge base on neurodiversity",
    toggles: ["Wider letter spacing", "Bigger buttons", "More contrast", "Reading guide", "Read aloud", "Reduce motion"]
  },
  pt: {
    booksBar: "Tudo aqui é gratuito graças aos livros de Iris Green", booksCta: "Ler as primeiras páginas",
    navHome: "Início", navVideos: "Vídeos", navAsk: "O que posso pedir?", navBooks: "Livros", navTopics: "Temas",
    reading: "Leitura", readingPanel: "Leitura acessível", textSize: "Tamanho do texto", reset: "Restaurar",
    eyebrow: "Tema", topicName: "Autismo",
    lede: "Uma forma de perceber, de comunicar e de estar com os outros. Cada pessoa autista é, antes de tudo, uma pessoa: o que muda é como o mundo chega e o que ela precisa dele.",
    jumps: [["#que-es", "O que é"], ["#como-se-nota", "Como aparece"], ["#que-ayuda", "O que ajuda"], ["#escuchar", "Ouvir alguém"], ["#pedir", "O que pedir"]],
    whatTitle: "O que é, em linguagem clara",
    what1: "O autismo é uma forma de funcionamento do cérebro presente desde o nascimento. Muda como chega a informação dos sentidos, como se organiza a comunicação e quanta energia custa o social.",
    what2: "Cada pessoa autista é diferente. Duas pessoas com o mesmo diagnóstico podem precisar de coisas opostas: por isso aqui falamos de situações concretas, não de perfis fechados.",
    signsTitle: "Como aparece no dia a dia",
    signsLede: "Quatro cenas frequentes. O que se vê de fora quase nunca é o que está acontecendo por dentro.",
    scenes: [
      ["Numa loja ou shopping", "Tapa os ouvidos, quer sair, irrita-se com algo pequeno.", "Ruído, luz e gente vêm se somando sem pausa há vinte minutos.", "Sair antes do limite, não depois. Combinar um sinal para ir sem discutir."],
      ["Na aula ou numa reunião", "Parece que não presta atenção.", "Quase toda a energia vai para filtrar sons, olhar para as pessoas e manter a postura.", "Permitir não olhar nos olhos, dar a informação também por escrito, avisar das mudanças."],
      ["No fim do dia", "Explode ou se apaga por completo por algo mínimo.", "Aguentou e disfarçou por horas. O pequeno é só o último que chegou.", "Um tempo de silêncio real sem perguntas e rever o que pode sair do dia seguinte."],
      ["Com a comida ou a roupa", "Rejeita texturas, sempre a mesma comida, tira etiquetas.", "Não é frescura: a textura chega muito mais intensa do que chegaria a outra pessoa.", "Ampliar devagar e sem castigo. Respeitar o que já funciona como base segura."]
    ],
    helpTitle: "O que ajuda e o que não",
    doLabel: "Ajuda", avoidLabel: "Melhor evitar",
    dos: ["Avisar das mudanças antes que aconteçam.", "Dar a informação por escrito, além de falada.", "Baixar o ruído e a luz antes de pedir algo importante.", "Aceitar os movimentos que acalmam (balanço, mãos, objetos).", "Perguntar o que precisa em vez de supor."],
    donts: ["Obrigar a olhar nos olhos.", "Ler a sobrecarga como falta de educação.", "Tirar de uma vez as rotinas que sustentam o dia.", "Falar da pessoa na terceira pessoa na frente dela.", "Premiar o disfarce: parecer bem cobra depois."],
    videosTitle: "Ouvir quem vive isso", allVideos: "Ver a videoteca completa →", play: "Ver aqui",
    askTitle: "O que posso pedir?", askText: "Apoios na escola, ajustes no trabalho, avaliação ou auxílios, conforme onde você vive.",
    bookTitle: "Autismo na vida diária", bookText: "O guia impresso, cena por cena. Sustenta este site.",
    researchTitle: "O que diz a pesquisa", researchText: "Publicações científicas explicadas em linguagem clara, com a fonte à vista.",
    footnote: "Esta página informa e orienta. Não diagnostica nem substitui um profissional. As fontes e os critérios de revisão estão na metodologia.",
    tagline: "Base de conhecimento sobre neurodiversidade",
    toggles: ["Letras mais separadas", "Botões maiores", "Mais contraste", "Guia de leitura", "Ler em voz alta", "Reduzir movimento"]
  }
};

const NAVL = {
  es: [["/","Inicio"],["/es/neurodiversidad/condiciones/","Condiciones"],["/es/situaciones/","Situaciones"],["/es/biblioteca/","Vida diaria"],["/es/videos/","Vídeos"],["/es/investigacion/","Investigación"],["/es/datos/","Datos"],["/es/tramites/directorio/","Ayudas"],["/es/tramites/","Cómo pedirlo"],["/es/libros/","Libros"]],
  en: [["/","Home"],["/es/neurodiversidad/condiciones/","Conditions"],["/es/situaciones/","Situations"],["/es/biblioteca/","Everyday life"],["/es/videos/","Videos"],["/es/investigacion/","Research"],["/es/datos/","Figures"],["/es/tramites/directorio/","Support directory"],["/es/tramites/","How to ask"],["/es/libros/","Books"]],
  pt: [["/","Início"],["/es/neurodiversidad/condiciones/","Condições"],["/es/situaciones/","Situações"],["/es/biblioteca/","Vida diária"],["/es/videos/","Vídeos"],["/es/investigacion/","Pesquisa"],["/es/datos/","Dados"],["/es/tramites/directorio/","Diretório de ajudas"],["/es/tramites/","Como pedir"],["/es/libros/","Livros"]]
};

class Component extends DCLogic {
  state = { lang: "es", playing: null, a11y: false, music: false, fs: 17, spacing: false, controls: false, contrast: false, guide: false, speak: false, motion: false };

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

    return {
      langButtons: [["es", "ES"], ["en", "EN"], ["pt", "PT-BR"]].map(([code, label]) => ({
        label,
        bg: st.lang === code ? "#17395c" : "transparent",
        color: st.lang === code ? "#fff" : "#17395c",
        pick: () => this.setLang(code)
      })),

      navLinks: (NAVL[L] || NAVL.es).filter(([href]) => href !== "/es/neurodiversidad/condiciones/autismo/").map(([href, label]) => ({ href, label })),

      tBooksBar: T.booksBar, tBooksCta: T.booksCta, tNavHome: T.navHome, tNavVideos: T.navVideos,
      tNavAsk: T.navAsk, tNavBooks: T.navBooks, tNavTopics: T.navTopics, tReading: T.reading,
      tReadingPanel: T.readingPanel, tTextSize: T.textSize, tReset: T.reset,
      tEyebrow: T.eyebrow, tTopicName: T.topicName, tLede: T.lede,
      tWhatTitle: T.whatTitle, tWhat1: T.what1, tWhat2: T.what2,
      tSignsTitle: T.signsTitle, tSignsLede: T.signsLede,
      tHelpTitle: T.helpTitle, tDo: T.doLabel, tAvoid: T.avoidLabel,
      tVideosTitle: T.videosTitle, tAllVideos: T.allVideos, tPlay: T.play,
      tAskTitle: T.askTitle, tAskText: T.askText, tBookTitle: T.bookTitle, tBookText: T.bookText,
      tResearchTitle: T.researchTitle, tResearchText: T.researchText,
      tFootnote: T.footnote, tTagline: T.tagline,

      jumpLinks: T.jumps.map((j) => ({ href: j[0], label: j[1] })),
      scenes: T.scenes.map((s) => ({ where: s[0], seen: s[1], happening: s[2], helps: s[3] })),
      dos: T.dos.map((text) => ({ text })),
      donts: T.donts.map((text) => ({ text })),

      videos: VIDEOS.map((v) => ({
        name: v.name, src: v.src,
        meta: T.topicName + " · " + v.source,
        ratio: v.source === "Instagram" ? "9 / 14" : "16 / 9",
        playing: st.playing === v.id,
        idle: st.playing !== v.id,
        play: () => this.setState({ playing: v.id })
      })),

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

