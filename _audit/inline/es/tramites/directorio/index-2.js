
const TOGGLES = ["Letra más separada", "Botones más grandes", "Más contraste", "Guía de lectura", "Leer en voz alta", "Reducir movimiento"];

const REGIONS = ["all", "Europa", "Asia y Eurasia", "África", "Norteamérica", "Centroamérica", "Sudamérica", "Caribe", "Oceanía"];

const LANGSTR = {
  es: { aviso: "Esta página está en castellano. Los botones de idioma ya funcionan en toda la web; la traducción de esta sección está en marcha y se dice aquí para no darla por hecha." },
  en: { aviso: "This page is in Spanish. The language buttons already work across the site; translating this section is under way, and it is said here so nobody assumes it is done." },
  pt: { aviso: "Esta página está em castelhano. Os botões de idioma já funcionam em todo o site; a tradução desta seção está em andamento, e isso é dito aqui para não dar como pronta." }
};


class Component extends DCLogic {
  state = { lang: "es", data: null, country: "es", region: "all", terr: "all", cat: "all", q: "", limit: 12, open: null, a11y: false, music: false, fs: 17, spacing: false, controls: false, contrast: false, guide: false, speak: false, motion: false };

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
    fetch("tramites-datos.json")
      .then((r) => r.json())
      .then((data) => this.setState({ data }))
      .catch(() => this.setState({ data: { es: [], uk: [], br: [], us: [], mundo: [] } }));
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
    let all = st.data ? (st.data[st.country] || []) : [];
    if (st.country === "mundo" && st.region !== "all") all = all.filter((f) => f.region === st.region);
    const terrs = [];
    const cats = [];
    all.forEach((f) => {
      if (terrs.indexOf(f.terr) === -1) terrs.push(f.terr);
      if (cats.indexOf(f.cat) === -1) cats.push(f.cat);
    });
    cats.sort((a, b) => a.localeCompare(b, "es"));
    if (st.country === "mundo") terrs.sort((a, b) => a.localeCompare(b, "es"));

    const words = this.norm(st.q).trim().split(/\s+/).filter(Boolean);
    const rows = all.filter((f) => {
      if (st.terr !== "all" && f.terr !== st.terr) return false;
      if (st.cat !== "all" && f.cat !== st.cat) return false;
      if (!words.length) return true;
      const hay = this.norm([f.name, f.que, f.quien, f.tags, f.cat, f.terr].join(" "));
      return words.every((w) => hay.indexOf(w) !== -1);
    });

    const chip = (active) => ({
      bg: active ? "#1f8ba8" : "#fff",
      color: active ? "#fff" : "#17395c",
      border: active ? "#1f8ba8" : "rgba(23,57,92,0.14)"
    });

    return {
      langButtons: [["es", "ES"], ["en", "EN"], ["pt", "PT-BR"]].map(([code, label]) => ({
        label,
        pick: () => this.setLang(code),
        bg: (this.state.lang || "es") === code ? "#17395c" : "#fff",
        color: (this.state.lang || "es") === code ? "#fff" : "#17395c",
        border: (this.state.lang || "es") === code ? "#17395c" : "rgba(23,57,92,0.16)"
      })),
      langAviso: (LANGSTR[this.state.lang || "es"] || LANGSTR.es).aviso,

      metaLine: st.data
        ? "España " + (st.data.es || []).length + " · Reino Unido " + (st.data.uk || []).length + " · Brasil " + (st.data.br || []).length + " · Estados Unidos " + (st.data.us || []).length + " · resto del mundo " + (st.data.mundo || []).length + " · última revisión 31/08/2026"
        : "Cargando el directorio…",

      countryChips: [["es", "España"], ["uk", "Reino Unido"], ["br", "Brasil"], ["us", "Estados Unidos"], ["mundo", "Resto del mundo"]].map(([code, label]) => Object.assign({
        label,
        pick: () => this.setState({ country: code, terr: "all", cat: "all", region: "all", limit: 12, open: null })
      }, chip(st.country === code))),

      isWorld: st.country === "mundo",
      regionChips: REGIONS.map((r) => Object.assign({
        label: r === "all" ? "Todas las regiones" : r,
        pick: () => this.setState({ region: r, terr: "all", limit: 12, open: null })
      }, chip(st.region === r))),

      terrLabel: st.country === "es" ? "Comunidad o ciudad autónoma" : st.country === "br" ? "Estado o Distrito Federal" : st.country === "us" ? "Estado o nivel federal" : st.country === "mundo" ? "País" : "Nación",
      terr: st.terr,
      cat: st.cat,
      onTerr: (e) => this.setState({ terr: e.target.value, limit: 12 }),
      onCat: (e) => this.setState({ cat: e.target.value, limit: 12 }),
      terrOptions: [{ value: "all", label: st.country === "es" ? "Toda España" : st.country === "br" ? "Todo Brasil" : st.country === "us" ? "Todo Estados Unidos" : st.country === "mundo" ? "Todos los países" : "Todo el Reino Unido" }]
        .concat(terrs.map((t) => ({ value: t, label: t }))),
      catOptions: [{ value: "all", label: "Cualquier tipo de ayuda" }]
        .concat(cats.map((c) => ({ value: c, label: c }))),

      q: st.q,
      onQ: (e) => this.setState({ q: e.target.value, limit: 12 }),
      filtered: st.terr !== "all" || st.cat !== "all" || st.q.trim().length > 0,
      clearFilters: () => this.setState({ terr: "all", cat: "all", q: "", limit: 12 }),

      countLabel: st.data ? rows.length + (rows.length === 1 ? " ficha" : " fichas") : "Cargando…",
      noResults: !!st.data && rows.length === 0,

      cards: rows.slice(0, st.limit).map((f) => {
        const open = st.open === f.id;
        return {
          name: f.name, terr: f.terr, cat: f.cat, que: f.que, cuantia: f.cuantia,
          quien: f.quien, docs: f.docs, obs: f.obs, org: f.org, fuente: f.fuente,
          open,
          btnLabel: open ? "Cerrar" : "Ver los detalles",
          btnBg: open ? "#1f8ba8" : "#fff",
          btnColor: open ? "#fff" : "#17395c",
          btnBorder: open ? "#1f8ba8" : "rgba(23,57,92,0.18)",
          toggle: () => this.setState({ open: open ? null : f.id })
        };
      }),
      hasMore: rows.length > st.limit,
      moreLabel: "Ver más fichas (" + Math.max(0, rows.length - st.limit) + " restantes)",
      showMore: () => this.setState({ limit: st.limit + 12 }),

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
          label: TOGGLES[n],
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

