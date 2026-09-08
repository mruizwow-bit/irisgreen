# Inventario de ig_lang en main

Commit de main:
ff6ca0406781b6c1bd838ed0bba514f8c5b56309

## Archivos afectados
```text
es/cuestionarios/index.html
es/investigacion/index.html
es/libros/index.html
es/neurodiversidad/temas/autismo/index.html
es/recursos/juegos/cada-cerebro-su-camino/index.html
es/recursos/juegos/donde-se-fue-la-energia/index.html
es/recursos/juegos/el-archivo-de-capacidades/index.html
es/recursos/juegos/el-aula-al-reves/index.html
es/recursos/juegos/el-detective-de-los-sentidos/index.html
es/recursos/juegos/el-mapa-del-tesoro-de-casa/index.html
es/recursos/juegos/el-traductor-de-casa/index.html
es/recursos/juegos/el-traductor-de-instrucciones/index.html
es/recursos/juegos/index.html
es/recursos/juegos/la-cena-de-los-planes/index.html
es/recursos/juegos/la-consulta/index.html
es/recursos/juegos/la-maquina-de-empezar/index.html
es/recursos/juegos/las-cinco-cosas/index.html
es/recursos/juegos/palabra-misteriosa/index.html
es/sobre-iris-green/index.html
es/taller/index.html
es/tramites/directorio/index.html
es/tramites/index.html
es/videos/index.html
es/vivir-fuera/index.html
index.html
```

## Contextos
```text
origin/main:es/cuestionarios/index.html-358-
origin/main:es/cuestionarios/index.html-359-  setLang(l) {
origin/main:es/cuestionarios/index.html-360-    this.setState({ lang: l });
origin/main:es/cuestionarios/index.html:361:    try { localStorage.setItem("ig_lang", l); document.documentElement.lang = l === "pt" ? "pt-BR" : l; } catch (e) {}
origin/main:es/cuestionarios/index.html-362-  }
origin/main:es/cuestionarios/index.html-363-
origin/main:es/cuestionarios/index.html-364-
origin/main:es/cuestionarios/index.html-365-  componentDidMount() {
origin/main:es/cuestionarios/index.html-366-    this._igPreferencesDisconnect = window.IGPreferences.connect(this);
origin/main:es/cuestionarios/index.html-367-    try {
origin/main:es/cuestionarios/index.html:368:      const sv = localStorage.getItem("ig_lang");
origin/main:es/cuestionarios/index.html-369-      if (sv && LANGSTR[sv]) this.setState({ lang: sv });
origin/main:es/cuestionarios/index.html-370-      document.documentElement.lang = sv === "pt" ? "pt-BR" : (sv || "es");
origin/main:es/cuestionarios/index.html-371-    } catch (e) {}
--
origin/main:es/investigacion/index.html-334-    try { document.documentElement.lang = document.documentElement.lang || "es"; } catch (e) {}
origin/main:es/investigacion/index.html-335-    // Initial articles are generated from estudios-textos.json at deployment.
origin/main:es/investigacion/index.html-336-    try {
origin/main:es/investigacion/index.html:337:      const lang = localStorage.getItem("ig_lang");
origin/main:es/investigacion/index.html-338-      const use = STR[lang] ? lang : "es";
origin/main:es/investigacion/index.html-339-      if (use !== "es") this.setState({ lang: use });
origin/main:es/investigacion/index.html-340-      document.documentElement.lang = use === "pt" ? "pt-BR" : use;
--
origin/main:es/investigacion/index.html-344-  setLang(lang) {
origin/main:es/investigacion/index.html-345-    this.setState({ lang });
origin/main:es/investigacion/index.html-346-    try { document.documentElement.lang = lang === "pt" ? "pt-BR" : lang; } catch (e) {}
origin/main:es/investigacion/index.html:347:    try { localStorage.setItem("ig_lang", lang); } catch (e) {}
origin/main:es/investigacion/index.html-348-  }
origin/main:es/investigacion/index.html-349-
origin/main:es/investigacion/index.html-350-  norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
--
origin/main:es/libros/index.html-300-    this._igPreferencesDisconnect = window.IGPreferences.connect(this);
origin/main:es/libros/index.html-301-    try { document.documentElement.lang = document.documentElement.lang || "es"; } catch (e) {}
origin/main:es/libros/index.html-302-    try {
origin/main:es/libros/index.html:303:      const lang = localStorage.getItem("ig_lang");
origin/main:es/libros/index.html-304-      const use = lang && STR[lang] ? lang : "es";
origin/main:es/libros/index.html-305-      if (use !== "es") this.setState({ lang: use });
origin/main:es/libros/index.html-306-      document.documentElement.lang = use === "pt" ? "pt-BR" : use;
--
origin/main:es/libros/index.html-310-  setLang(lang) {
origin/main:es/libros/index.html-311-    try { document.documentElement.lang = lang === "pt" ? "pt-BR" : lang; } catch (e) {}
origin/main:es/libros/index.html-312-    this.setState({ lang });
origin/main:es/libros/index.html:313:    try { localStorage.setItem("ig_lang", lang); } catch (e) {}
origin/main:es/libros/index.html-314-  }
origin/main:es/libros/index.html-315-
origin/main:es/libros/index.html-316-  applyReading() {
--
origin/main:es/neurodiversidad/temas/autismo/index.html-365-    this._igPreferencesDisconnect = window.IGPreferences.connect(this);
origin/main:es/neurodiversidad/temas/autismo/index.html-366-    try { document.documentElement.lang = document.documentElement.lang || "es"; } catch (e) {}
origin/main:es/neurodiversidad/temas/autismo/index.html-367-    try {
origin/main:es/neurodiversidad/temas/autismo/index.html:368:      const lang = localStorage.getItem("ig_lang");
origin/main:es/neurodiversidad/temas/autismo/index.html-369-      const use = lang && STR[lang] ? lang : "es";
origin/main:es/neurodiversidad/temas/autismo/index.html-370-      if (use !== "es") this.setState({ lang: use });
origin/main:es/neurodiversidad/temas/autismo/index.html-371-      document.documentElement.lang = use === "pt" ? "pt-BR" : use;
--
origin/main:es/neurodiversidad/temas/autismo/index.html-375-  setLang(lang) {
origin/main:es/neurodiversidad/temas/autismo/index.html-376-    try { document.documentElement.lang = lang === "pt" ? "pt-BR" : lang; } catch (e) {}
origin/main:es/neurodiversidad/temas/autismo/index.html-377-    this.setState({ lang });
origin/main:es/neurodiversidad/temas/autismo/index.html:378:    try { localStorage.setItem("ig_lang", lang); } catch (e) {}
origin/main:es/neurodiversidad/temas/autismo/index.html-379-  }
origin/main:es/neurodiversidad/temas/autismo/index.html-380-
origin/main:es/neurodiversidad/temas/autismo/index.html-381-  applyReading() {
--
origin/main:es/recursos/juegos/cada-cerebro-su-camino/index.html-324-  componentDidMount() {
origin/main:es/recursos/juegos/cada-cerebro-su-camino/index.html-325-    this._igPreferencesDisconnect = window.IGPreferences.connect(this);
origin/main:es/recursos/juegos/cada-cerebro-su-camino/index.html-326-    try {
origin/main:es/recursos/juegos/cada-cerebro-su-camino/index.html:327:      const lang = localStorage.getItem("ig_lang");
origin/main:es/recursos/juegos/cada-cerebro-su-camino/index.html-328-      const use = lang && STR[lang] ? lang : "es";
origin/main:es/recursos/juegos/cada-cerebro-su-camino/index.html-329-      if (use !== "es") this.setState({ lang: use });
origin/main:es/recursos/juegos/cada-cerebro-su-camino/index.html-330-      document.documentElement.lang = use === "pt" ? "pt-BR" : use;
--
origin/main:es/recursos/juegos/cada-cerebro-su-camino/index.html-354-  setLang(lang) {
origin/main:es/recursos/juegos/cada-cerebro-su-camino/index.html-355-    try {
origin/main:es/recursos/juegos/cada-cerebro-su-camino/index.html-356-      document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
origin/main:es/recursos/juegos/cada-cerebro-su-camino/index.html:357:      localStorage.setItem("ig_lang", lang);
origin/main:es/recursos/juegos/cada-cerebro-su-camino/index.html-358-    } catch (e) {}
origin/main:es/recursos/juegos/cada-cerebro-su-camino/index.html-359-    this.setState({ lang });
origin/main:es/recursos/juegos/cada-cerebro-su-camino/index.html-360-  }
--
origin/main:es/recursos/juegos/donde-se-fue-la-energia/index.html-317-  componentDidMount() {
origin/main:es/recursos/juegos/donde-se-fue-la-energia/index.html-318-    this._igPreferencesDisconnect = window.IGPreferences.connect(this);
origin/main:es/recursos/juegos/donde-se-fue-la-energia/index.html-319-    try {
origin/main:es/recursos/juegos/donde-se-fue-la-energia/index.html:320:      const lang = localStorage.getItem("ig_lang");
origin/main:es/recursos/juegos/donde-se-fue-la-energia/index.html-321-      const use = lang && STR[lang] ? lang : "es";
origin/main:es/recursos/juegos/donde-se-fue-la-energia/index.html-322-      if (use !== "es") this.setState({ lang: use });
origin/main:es/recursos/juegos/donde-se-fue-la-energia/index.html-323-      document.documentElement.lang = use === "pt" ? "pt-BR" : use;
--
origin/main:es/recursos/juegos/donde-se-fue-la-energia/index.html-337-  setLang(lang) {
origin/main:es/recursos/juegos/donde-se-fue-la-energia/index.html-338-    try {
origin/main:es/recursos/juegos/donde-se-fue-la-energia/index.html-339-      document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
origin/main:es/recursos/juegos/donde-se-fue-la-energia/index.html:340:      localStorage.setItem("ig_lang", lang);
origin/main:es/recursos/juegos/donde-se-fue-la-energia/index.html-341-    } catch (e) {}
origin/main:es/recursos/juegos/donde-se-fue-la-energia/index.html-342-    this.setState({ lang });
origin/main:es/recursos/juegos/donde-se-fue-la-energia/index.html-343-  }
--
origin/main:es/recursos/juegos/el-archivo-de-capacidades/index.html-297-  componentDidMount() {
origin/main:es/recursos/juegos/el-archivo-de-capacidades/index.html-298-    this._igPreferencesDisconnect = window.IGPreferences.connect(this);
origin/main:es/recursos/juegos/el-archivo-de-capacidades/index.html-299-    try {
origin/main:es/recursos/juegos/el-archivo-de-capacidades/index.html:300:      const lang = localStorage.getItem("ig_lang");
origin/main:es/recursos/juegos/el-archivo-de-capacidades/index.html-301-      const use = lang && STR[lang] ? lang : "es";
origin/main:es/recursos/juegos/el-archivo-de-capacidades/index.html-302-      if (use !== "es") this.setState({ lang: use });
origin/main:es/recursos/juegos/el-archivo-de-capacidades/index.html-303-      document.documentElement.lang = use === "pt" ? "pt-BR" : use;
--
origin/main:es/recursos/juegos/el-archivo-de-capacidades/index.html-326-  setLang(lang) {
origin/main:es/recursos/juegos/el-archivo-de-capacidades/index.html-327-    try {
origin/main:es/recursos/juegos/el-archivo-de-capacidades/index.html-328-      document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
origin/main:es/recursos/juegos/el-archivo-de-capacidades/index.html:329:      localStorage.setItem("ig_lang", lang);
origin/main:es/recursos/juegos/el-archivo-de-capacidades/index.html-330-    } catch (e) {}
origin/main:es/recursos/juegos/el-archivo-de-capacidades/index.html-331-    this.setState({ lang });
origin/main:es/recursos/juegos/el-archivo-de-capacidades/index.html-332-  }
--
origin/main:es/recursos/juegos/el-aula-al-reves/index.html-336-  componentDidMount() {
origin/main:es/recursos/juegos/el-aula-al-reves/index.html-337-    this._igPreferencesDisconnect = window.IGPreferences.connect(this);
origin/main:es/recursos/juegos/el-aula-al-reves/index.html-338-    try {
origin/main:es/recursos/juegos/el-aula-al-reves/index.html:339:      const lang = localStorage.getItem("ig_lang");
origin/main:es/recursos/juegos/el-aula-al-reves/index.html-340-      const use = lang && STR[lang] ? lang : "es";
origin/main:es/recursos/juegos/el-aula-al-reves/index.html-341-      if (use !== "es") this.setState({ lang: use });
origin/main:es/recursos/juegos/el-aula-al-reves/index.html-342-      document.documentElement.lang = use === "pt" ? "pt-BR" : use;
--
origin/main:es/recursos/juegos/el-aula-al-reves/index.html-355-  setLang(lang) {
origin/main:es/recursos/juegos/el-aula-al-reves/index.html-356-    try {
origin/main:es/recursos/juegos/el-aula-al-reves/index.html-357-      document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
origin/main:es/recursos/juegos/el-aula-al-reves/index.html:358:      localStorage.setItem("ig_lang", lang);
origin/main:es/recursos/juegos/el-aula-al-reves/index.html-359-    } catch (e) {}
origin/main:es/recursos/juegos/el-aula-al-reves/index.html-360-    this.setState({ lang });
origin/main:es/recursos/juegos/el-aula-al-reves/index.html-361-  }
--
origin/main:es/recursos/juegos/el-detective-de-los-sentidos/index.html-299-  componentDidMount() {
origin/main:es/recursos/juegos/el-detective-de-los-sentidos/index.html-300-    this._igPreferencesDisconnect = window.IGPreferences.connect(this);
origin/main:es/recursos/juegos/el-detective-de-los-sentidos/index.html-301-    try {
origin/main:es/recursos/juegos/el-detective-de-los-sentidos/index.html:302:      const lang = localStorage.getItem("ig_lang");
origin/main:es/recursos/juegos/el-detective-de-los-sentidos/index.html-303-      const use = lang && STR[lang] ? lang : "es";
origin/main:es/recursos/juegos/el-detective-de-los-sentidos/index.html-304-      if (use !== "es") this.setState({ lang: use });
origin/main:es/recursos/juegos/el-detective-de-los-sentidos/index.html-305-      document.documentElement.lang = use === "pt" ? "pt-BR" : use;
--
origin/main:es/recursos/juegos/el-detective-de-los-sentidos/index.html-328-  setLang(lang) {
origin/main:es/recursos/juegos/el-detective-de-los-sentidos/index.html-329-    try {
origin/main:es/recursos/juegos/el-detective-de-los-sentidos/index.html-330-      document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
origin/main:es/recursos/juegos/el-detective-de-los-sentidos/index.html:331:      localStorage.setItem("ig_lang", lang);
origin/main:es/recursos/juegos/el-detective-de-los-sentidos/index.html-332-    } catch (e) {}
origin/main:es/recursos/juegos/el-detective-de-los-sentidos/index.html-333-    this.setState({ lang });
origin/main:es/recursos/juegos/el-detective-de-los-sentidos/index.html-334-  }
--
origin/main:es/recursos/juegos/el-mapa-del-tesoro-de-casa/index.html-303-  componentDidMount() {
origin/main:es/recursos/juegos/el-mapa-del-tesoro-de-casa/index.html-304-    this._igPreferencesDisconnect = window.IGPreferences.connect(this);
origin/main:es/recursos/juegos/el-mapa-del-tesoro-de-casa/index.html-305-    try {
origin/main:es/recursos/juegos/el-mapa-del-tesoro-de-casa/index.html:306:      const lang = localStorage.getItem("ig_lang");
origin/main:es/recursos/juegos/el-mapa-del-tesoro-de-casa/index.html-307-      const use = lang && STR[lang] ? lang : "es";
origin/main:es/recursos/juegos/el-mapa-del-tesoro-de-casa/index.html-308-      if (use !== "es") this.setState({ lang: use });
origin/main:es/recursos/juegos/el-mapa-del-tesoro-de-casa/index.html-309-      document.documentElement.lang = use === "pt" ? "pt-BR" : use;
--
origin/main:es/recursos/juegos/el-mapa-del-tesoro-de-casa/index.html-323-  setLang(lang) {
origin/main:es/recursos/juegos/el-mapa-del-tesoro-de-casa/index.html-324-    try {
origin/main:es/recursos/juegos/el-mapa-del-tesoro-de-casa/index.html-325-      document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
origin/main:es/recursos/juegos/el-mapa-del-tesoro-de-casa/index.html:326:      localStorage.setItem("ig_lang", lang);
origin/main:es/recursos/juegos/el-mapa-del-tesoro-de-casa/index.html-327-    } catch (e) {}
origin/main:es/recursos/juegos/el-mapa-del-tesoro-de-casa/index.html-328-    this.setState({ lang });
origin/main:es/recursos/juegos/el-mapa-del-tesoro-de-casa/index.html-329-  }
--
origin/main:es/recursos/juegos/el-traductor-de-casa/index.html-358-  componentDidMount() {
origin/main:es/recursos/juegos/el-traductor-de-casa/index.html-359-    this._igPreferencesDisconnect = window.IGPreferences.connect(this);
origin/main:es/recursos/juegos/el-traductor-de-casa/index.html-360-    try {
origin/main:es/recursos/juegos/el-traductor-de-casa/index.html:361:      const lang = localStorage.getItem("ig_lang");
origin/main:es/recursos/juegos/el-traductor-de-casa/index.html-362-      const use = lang && STR[lang] ? lang : "es";
origin/main:es/recursos/juegos/el-traductor-de-casa/index.html-363-      if (use !== "es") this.setState({ lang: use });
origin/main:es/recursos/juegos/el-traductor-de-casa/index.html-364-      document.documentElement.lang = use === "pt" ? "pt-BR" : use;
--
origin/main:es/recursos/juegos/el-traductor-de-casa/index.html-377-  setLang(lang) {
origin/main:es/recursos/juegos/el-traductor-de-casa/index.html-378-    try {
origin/main:es/recursos/juegos/el-traductor-de-casa/index.html-379-      document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
origin/main:es/recursos/juegos/el-traductor-de-casa/index.html:380:      localStorage.setItem("ig_lang", lang);
origin/main:es/recursos/juegos/el-traductor-de-casa/index.html-381-    } catch (e) {}
origin/main:es/recursos/juegos/el-traductor-de-casa/index.html-382-    this.setState({ lang });
origin/main:es/recursos/juegos/el-traductor-de-casa/index.html-383-  }
--
origin/main:es/recursos/juegos/el-traductor-de-instrucciones/index.html-347-  componentDidMount() {
origin/main:es/recursos/juegos/el-traductor-de-instrucciones/index.html-348-    this._igPreferencesDisconnect = window.IGPreferences.connect(this);
origin/main:es/recursos/juegos/el-traductor-de-instrucciones/index.html-349-    try {
origin/main:es/recursos/juegos/el-traductor-de-instrucciones/index.html:350:      const lang = localStorage.getItem("ig_lang");
origin/main:es/recursos/juegos/el-traductor-de-instrucciones/index.html-351-      const use = lang && STR[lang] ? lang : "es";
origin/main:es/recursos/juegos/el-traductor-de-instrucciones/index.html-352-      if (use !== "es") this.setState({ lang: use });
origin/main:es/recursos/juegos/el-traductor-de-instrucciones/index.html-353-      document.documentElement.lang = use === "pt" ? "pt-BR" : use;
--
origin/main:es/recursos/juegos/el-traductor-de-instrucciones/index.html-366-  setLang(lang) {
origin/main:es/recursos/juegos/el-traductor-de-instrucciones/index.html-367-    try {
origin/main:es/recursos/juegos/el-traductor-de-instrucciones/index.html-368-      document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
origin/main:es/recursos/juegos/el-traductor-de-instrucciones/index.html:369:      localStorage.setItem("ig_lang", lang);
origin/main:es/recursos/juegos/el-traductor-de-instrucciones/index.html-370-    } catch (e) {}
origin/main:es/recursos/juegos/el-traductor-de-instrucciones/index.html-371-    this.setState({ lang });
origin/main:es/recursos/juegos/el-traductor-de-instrucciones/index.html-372-  }
--
origin/main:es/recursos/juegos/index.html-594-    this._igPreferencesDisconnect = window.IGPreferences.connect(this);
origin/main:es/recursos/juegos/index.html-595-    try {
origin/main:es/recursos/juegos/index.html-596-      const qlang = new URLSearchParams(window.location.search).get("lang");
origin/main:es/recursos/juegos/index.html:597:      const savedLang = localStorage.getItem("ig_lang");
origin/main:es/recursos/juegos/index.html-598-      const use = qlang && STR[qlang] ? qlang : (savedLang && STR[savedLang] ? savedLang : "es");
origin/main:es/recursos/juegos/index.html:599:      if (qlang && STR[qlang]) localStorage.setItem("ig_lang", qlang);
origin/main:es/recursos/juegos/index.html-600-      document.documentElement.lang = use === "pt" ? "pt-BR" : use;
origin/main:es/recursos/juegos/index.html-601-      document.title = STR[use].docTitle;
origin/main:es/recursos/juegos/index.html-602-      let card = null;
--
origin/main:es/recursos/juegos/index.html-706-  setLang(lang) {
origin/main:es/recursos/juegos/index.html-707-    try {
origin/main:es/recursos/juegos/index.html-708-      document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
origin/main:es/recursos/juegos/index.html:709:      localStorage.setItem("ig_lang", lang);
origin/main:es/recursos/juegos/index.html-710-    } catch (e) {}
origin/main:es/recursos/juegos/index.html-711-    this.setState({ lang });
origin/main:es/recursos/juegos/index.html-712-  }
--
origin/main:es/recursos/juegos/la-cena-de-los-planes/index.html-353-  componentDidMount() {
origin/main:es/recursos/juegos/la-cena-de-los-planes/index.html-354-    this._igPreferencesDisconnect = window.IGPreferences.connect(this);
origin/main:es/recursos/juegos/la-cena-de-los-planes/index.html-355-    try {
origin/main:es/recursos/juegos/la-cena-de-los-planes/index.html:356:      const lang = localStorage.getItem("ig_lang");
origin/main:es/recursos/juegos/la-cena-de-los-planes/index.html-357-      const use = lang && STR[lang] ? lang : "es";
origin/main:es/recursos/juegos/la-cena-de-los-planes/index.html-358-      if (use !== "es") this.setState({ lang: use });
origin/main:es/recursos/juegos/la-cena-de-los-planes/index.html-359-      document.documentElement.lang = use === "pt" ? "pt-BR" : use;
--
origin/main:es/recursos/juegos/la-cena-de-los-planes/index.html-382-  setLang(lang) {
origin/main:es/recursos/juegos/la-cena-de-los-planes/index.html-383-    try {
origin/main:es/recursos/juegos/la-cena-de-los-planes/index.html-384-      document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
origin/main:es/recursos/juegos/la-cena-de-los-planes/index.html:385:      localStorage.setItem("ig_lang", lang);
origin/main:es/recursos/juegos/la-cena-de-los-planes/index.html-386-    } catch (e) {}
origin/main:es/recursos/juegos/la-cena-de-los-planes/index.html-387-    this.setState({ lang });
origin/main:es/recursos/juegos/la-cena-de-los-planes/index.html-388-  }
--
origin/main:es/recursos/juegos/la-consulta/index.html-338-  componentDidMount() {
origin/main:es/recursos/juegos/la-consulta/index.html-339-    this._igPreferencesDisconnect = window.IGPreferences.connect(this);
origin/main:es/recursos/juegos/la-consulta/index.html-340-    try {
origin/main:es/recursos/juegos/la-consulta/index.html:341:      const lang = localStorage.getItem("ig_lang");
origin/main:es/recursos/juegos/la-consulta/index.html-342-      const use = lang && STR[lang] ? lang : "es";
origin/main:es/recursos/juegos/la-consulta/index.html-343-      if (use !== "es") this.setState({ lang: use });
origin/main:es/recursos/juegos/la-consulta/index.html-344-      document.documentElement.lang = use === "pt" ? "pt-BR" : use;
--
origin/main:es/recursos/juegos/la-consulta/index.html-357-  setLang(lang) {
origin/main:es/recursos/juegos/la-consulta/index.html-358-    try {
origin/main:es/recursos/juegos/la-consulta/index.html-359-      document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
origin/main:es/recursos/juegos/la-consulta/index.html:360:      localStorage.setItem("ig_lang", lang);
origin/main:es/recursos/juegos/la-consulta/index.html-361-    } catch (e) {}
origin/main:es/recursos/juegos/la-consulta/index.html-362-    this.setState({ lang });
origin/main:es/recursos/juegos/la-consulta/index.html-363-  }
--
origin/main:es/recursos/juegos/la-maquina-de-empezar/index.html-309-  componentDidMount() {
origin/main:es/recursos/juegos/la-maquina-de-empezar/index.html-310-    this._igPreferencesDisconnect = window.IGPreferences.connect(this);
origin/main:es/recursos/juegos/la-maquina-de-empezar/index.html-311-    try {
origin/main:es/recursos/juegos/la-maquina-de-empezar/index.html:312:      const lang = localStorage.getItem("ig_lang");
origin/main:es/recursos/juegos/la-maquina-de-empezar/index.html-313-      const use = lang && STR[lang] ? lang : "es";
origin/main:es/recursos/juegos/la-maquina-de-empezar/index.html-314-      if (use !== "es") this.setState({ lang: use });
origin/main:es/recursos/juegos/la-maquina-de-empezar/index.html-315-      document.documentElement.lang = use === "pt" ? "pt-BR" : use;
--
origin/main:es/recursos/juegos/la-maquina-de-empezar/index.html-338-  setLang(lang) {
origin/main:es/recursos/juegos/la-maquina-de-empezar/index.html-339-    try {
origin/main:es/recursos/juegos/la-maquina-de-empezar/index.html-340-      document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
origin/main:es/recursos/juegos/la-maquina-de-empezar/index.html:341:      localStorage.setItem("ig_lang", lang);
origin/main:es/recursos/juegos/la-maquina-de-empezar/index.html-342-    } catch (e) {}
origin/main:es/recursos/juegos/la-maquina-de-empezar/index.html-343-    this.setState({ lang });
origin/main:es/recursos/juegos/la-maquina-de-empezar/index.html-344-  }
--
origin/main:es/recursos/juegos/las-cinco-cosas/index.html-321-  componentDidMount() {
origin/main:es/recursos/juegos/las-cinco-cosas/index.html-322-    this._igPreferencesDisconnect = window.IGPreferences.connect(this);
origin/main:es/recursos/juegos/las-cinco-cosas/index.html-323-    try {
origin/main:es/recursos/juegos/las-cinco-cosas/index.html:324:      const lang = localStorage.getItem("ig_lang");
origin/main:es/recursos/juegos/las-cinco-cosas/index.html-325-      const use = lang && STR[lang] ? lang : "es";
origin/main:es/recursos/juegos/las-cinco-cosas/index.html-326-      if (use !== "es") this.setState({ lang: use });
origin/main:es/recursos/juegos/las-cinco-cosas/index.html-327-      document.documentElement.lang = use === "pt" ? "pt-BR" : use;
--
origin/main:es/recursos/juegos/las-cinco-cosas/index.html-341-  setLang(lang) {
origin/main:es/recursos/juegos/las-cinco-cosas/index.html-342-    try {
origin/main:es/recursos/juegos/las-cinco-cosas/index.html-343-      document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
origin/main:es/recursos/juegos/las-cinco-cosas/index.html:344:      localStorage.setItem("ig_lang", lang);
origin/main:es/recursos/juegos/las-cinco-cosas/index.html-345-    } catch (e) {}
origin/main:es/recursos/juegos/las-cinco-cosas/index.html-346-    this.setState({ lang });
origin/main:es/recursos/juegos/las-cinco-cosas/index.html-347-  }
--
origin/main:es/recursos/juegos/palabra-misteriosa/index.html-357-  componentDidMount() {
origin/main:es/recursos/juegos/palabra-misteriosa/index.html-358-    this._igPreferencesDisconnect = window.IGPreferences.connect(this);
origin/main:es/recursos/juegos/palabra-misteriosa/index.html-359-    try {
origin/main:es/recursos/juegos/palabra-misteriosa/index.html:360:      const lang = localStorage.getItem("ig_lang");
origin/main:es/recursos/juegos/palabra-misteriosa/index.html-361-      const use = lang && STR[lang] ? lang : "es";
origin/main:es/recursos/juegos/palabra-misteriosa/index.html-362-      if (use !== "es") this.setState({ lang: use });
origin/main:es/recursos/juegos/palabra-misteriosa/index.html-363-      document.documentElement.lang = use === "pt" ? "pt-BR" : use;
--
origin/main:es/recursos/juegos/palabra-misteriosa/index.html-387-  setLang(lang) {
origin/main:es/recursos/juegos/palabra-misteriosa/index.html-388-    try {
origin/main:es/recursos/juegos/palabra-misteriosa/index.html-389-      document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
origin/main:es/recursos/juegos/palabra-misteriosa/index.html:390:      localStorage.setItem("ig_lang", lang);
origin/main:es/recursos/juegos/palabra-misteriosa/index.html-391-    } catch (e) {}
origin/main:es/recursos/juegos/palabra-misteriosa/index.html-392-    this.setState({ lang });
origin/main:es/recursos/juegos/palabra-misteriosa/index.html-393-  }
--
origin/main:es/sobre-iris-green/index.html-392-      }
origin/main:es/sobre-iris-green/index.html-393-    });
origin/main:es/sobre-iris-green/index.html-394-    try {
origin/main:es/sobre-iris-green/index.html:395:      const lang = localStorage.getItem("ig_lang");
origin/main:es/sobre-iris-green/index.html-396-      const use = lang && STR[lang] ? lang : "es";
origin/main:es/sobre-iris-green/index.html-397-      if (use !== "es") this.setState({ lang: use });
origin/main:es/sobre-iris-green/index.html-398-      document.documentElement.lang = use === "pt" ? "pt-BR" : use;
--
origin/main:es/sobre-iris-green/index.html-432-  setLang(lang) {
origin/main:es/sobre-iris-green/index.html-433-    try {
origin/main:es/sobre-iris-green/index.html-434-      document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
origin/main:es/sobre-iris-green/index.html:435:      localStorage.setItem("ig_lang", lang);
origin/main:es/sobre-iris-green/index.html-436-    } catch (e) {}
origin/main:es/sobre-iris-green/index.html-437-    this.setState({ lang });
origin/main:es/sobre-iris-green/index.html-438-  }
--
origin/main:es/taller/index.html-399-  componentDidMount() {
origin/main:es/taller/index.html-400-    this._igPreferencesDisconnect = window.IGPreferences.connect(this);
origin/main:es/taller/index.html-401-    try {
origin/main:es/taller/index.html:402:      const lang = localStorage.getItem("ig_lang");
origin/main:es/taller/index.html-403-      const use = lang && STR[lang] ? lang : "es";
origin/main:es/taller/index.html-404-      if (use !== "es") this.setState({ lang: use });
origin/main:es/taller/index.html-405-      document.documentElement.lang = use === "pt" ? "pt-BR" : use;
--
origin/main:es/taller/index.html-419-  setLang(lang) {
origin/main:es/taller/index.html-420-    try {
origin/main:es/taller/index.html-421-      document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
origin/main:es/taller/index.html:422:      localStorage.setItem("ig_lang", lang);
origin/main:es/taller/index.html-423-    } catch (e) {}
origin/main:es/taller/index.html-424-    this.setState({ lang });
origin/main:es/taller/index.html-425-  }
--
origin/main:es/tramites/directorio/index.html-242-
origin/main:es/tramites/directorio/index.html-243-  setLang(l) {
origin/main:es/tramites/directorio/index.html-244-    this.setState({ lang: l });
origin/main:es/tramites/directorio/index.html:245:    try { localStorage.setItem("ig_lang", l); document.documentElement.lang = l === "pt" ? "pt-BR" : l; } catch (e) {}
origin/main:es/tramites/directorio/index.html-246-  }
origin/main:es/tramites/directorio/index.html-247-
origin/main:es/tramites/directorio/index.html-248-
origin/main:es/tramites/directorio/index.html-249-  componentDidMount() {
origin/main:es/tramites/directorio/index.html-250-    this._igPreferencesDisconnect = window.IGPreferences.connect(this);
origin/main:es/tramites/directorio/index.html-251-    try {
origin/main:es/tramites/directorio/index.html:252:      const sv = localStorage.getItem("ig_lang");
origin/main:es/tramites/directorio/index.html-253-      if (sv && LANGSTR[sv]) this.setState({ lang: sv });
origin/main:es/tramites/directorio/index.html-254-      document.documentElement.lang = sv === "pt" ? "pt-BR" : (sv || "es");
origin/main:es/tramites/directorio/index.html-255-    } catch (e) {}
--
origin/main:es/tramites/index.html-313-    this._igPreferencesDisconnect = window.IGPreferences.connect(this);
origin/main:es/tramites/index.html-314-    try { document.documentElement.lang = document.documentElement.lang || "es"; } catch (e) {}
origin/main:es/tramites/index.html-315-    try {
origin/main:es/tramites/index.html:316:      const lang = localStorage.getItem("ig_lang");
origin/main:es/tramites/index.html-317-      const use = lang && STR[lang] ? lang : "es";
origin/main:es/tramites/index.html-318-      if (use !== "es") this.setState({ lang: use });
origin/main:es/tramites/index.html-319-      document.documentElement.lang = use === "pt" ? "pt-BR" : use;
--
origin/main:es/tramites/index.html-323-  setLang(lang) {
origin/main:es/tramites/index.html-324-    try { document.documentElement.lang = lang === "pt" ? "pt-BR" : lang; } catch (e) {}
origin/main:es/tramites/index.html-325-    this.setState({ lang });
origin/main:es/tramites/index.html:326:    try { localStorage.setItem("ig_lang", lang); } catch (e) {}
origin/main:es/tramites/index.html-327-  }
origin/main:es/tramites/index.html-328-
origin/main:es/tramites/index.html-329-  applyReading() {
--
origin/main:es/videos/index.html-404-    try {
origin/main:es/videos/index.html-405-      const raw = localStorage.getItem("ig_saved_videos");
origin/main:es/videos/index.html-406-      if (raw) this.setState({ saved: JSON.parse(raw) });
origin/main:es/videos/index.html:407:      const lang = localStorage.getItem("ig_lang");
origin/main:es/videos/index.html-408-      const use = lang && STR[lang] ? lang : "es";
origin/main:es/videos/index.html-409-      if (use !== "es") this.setState({ lang: use });
origin/main:es/videos/index.html-410-      document.documentElement.lang = use === "pt" ? "pt-BR" : use;
--
origin/main:es/videos/index.html-419-  setLang(lang) {
origin/main:es/videos/index.html-420-    try { document.documentElement.lang = lang === "pt" ? "pt-BR" : lang; } catch (e) {}
origin/main:es/videos/index.html-421-    this.setState({ lang });
origin/main:es/videos/index.html:422:    try { localStorage.setItem("ig_lang", lang); } catch (e) {}
origin/main:es/videos/index.html-423-  }
origin/main:es/videos/index.html-424-
origin/main:es/videos/index.html-425-  norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
--
origin/main:es/vivir-fuera/index.html-470-
origin/main:es/vivir-fuera/index.html-471-  setLang(l) {
origin/main:es/vivir-fuera/index.html-472-    this.setState({ lang: l });
origin/main:es/vivir-fuera/index.html:473:    try { localStorage.setItem("ig_lang", l); document.documentElement.lang = l === "pt" ? "pt-BR" : l; } catch (e) {}
origin/main:es/vivir-fuera/index.html-474-  }
origin/main:es/vivir-fuera/index.html-475-
origin/main:es/vivir-fuera/index.html-476-
origin/main:es/vivir-fuera/index.html-477-  componentDidMount() {
origin/main:es/vivir-fuera/index.html-478-    this._igPreferencesDisconnect = window.IGPreferences.connect(this);
origin/main:es/vivir-fuera/index.html-479-    try {
origin/main:es/vivir-fuera/index.html:480:      const sv = localStorage.getItem("ig_lang");
origin/main:es/vivir-fuera/index.html-481-      const active = sv === "en" ? "en" : "es";
origin/main:es/vivir-fuera/index.html-482-      this.setState({ lang: active });
origin/main:es/vivir-fuera/index.html-483-      document.documentElement.lang = active;
--
origin/main:index.html-865-    fetch("videoteca-listado.json").then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { var a = Array.isArray(j) ? j : (j && j.videos); if (a && a.length) this.setState({ vids: a.map(function (v) { return v.plataforma === "Instagram" ? i(v.name, v.tema, v.ref) : v.plataforma === "Vimeo" ? { name: v.name, tema: v.tema, source: "Vimeo", href: v.url, embed: "https://player.vimeo.com/video/" + v.ref } : y(v.name, v.tema, v.ref); }) }); }.bind(this)).catch(function () {});
origin/main:index.html-866-    window.IGSearch.load().then((entries) => this.setState({ idx: entries })).catch(() => this.setState({ searchError: true }));
origin/main:index.html-867-    try {
origin/main:index.html:868:      const saved = localStorage.getItem("ig_lang");
origin/main:index.html-869-      if (saved && STR[saved]) this.setState({ lang: saved });
origin/main:index.html-870-      document.documentElement.lang = saved === "pt" ? "pt-BR" : (saved || "es");
origin/main:index.html-871-    } catch (e) {}
--
origin/main:index.html-878-
origin/main:index.html-879-  setLang(l) {
origin/main:index.html-880-    this.setState({ lang: l });
origin/main:index.html:881:    try { localStorage.setItem("ig_lang", l); document.documentElement.lang = l === "pt" ? "pt-BR" : l; } catch (e) {}
origin/main:index.html-882-  }
origin/main:index.html-883-
origin/main:index.html-884-  persist(saved) {
```
