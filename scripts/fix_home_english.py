#!/usr/bin/env python3
from pathlib import Path

p=Path('index.html')
s=p.read_text()

# Expand the existing home STR object. These are interface/home-copy strings only;
# search result content itself comes from the single bilingual buscador.json.
es_old='''    lede: "Escríbelo como lo dirías en voz alta.",\n    directo: "O entra directo a un tema",\n    escuchar: "Escuchar a quien lo vive",\n    empiezo: "¿Por dónde empiezo?",\n    soloEs: "Las secciones están en castellano. La traducción está en marcha."'''
es_new='''    lede: "Escríbelo como lo dirías en voz alta.",\n    hero2: "Las situaciones están contadas en primera persona, y la tuya puede estar. También puedes responder tres preguntas o mirar qué ayuda puedes pedir.",\n    directo: "O entra directo a un tema",\n    escuchar: "Escuchar a quien lo vive",\n    empiezo: "¿Por dónde empiezo?",\n    soloEs: "",\n    booksMessage: "Todo lo de esta web es gratis. La pagan dos libros.", booksSee: "Verlos",\n    tabs: ["Buscar", "Responder 3 preguntas", "¿Qué puedo pedir?"],\n    suggestions: ["no soporto el ruido", "me agoto con la gente", "no consigo dormir", "en el colegio no le entienden", "me bloqueo con los papeles"],\n    startHere: "Puedes empezar por aquí"'''
if es_old in s:s=s.replace(es_old,es_new,1)

en_old='''    lede: "Write it as you would say it out loud.",\n    directo: "Or go straight to a topic",\n    escuchar: "Hear from the people who live it",\n    empiezo: "Where do I start?",\n    soloEs: "The sections are in Spanish. Translation is under way."'''
en_new='''    lede: "Write it as you would say it out loud.",\n    hero2: "The situations are told in the first person, and yours may be here too. You can also answer three questions or see what support you can ask for.",\n    directo: "Or go straight to a topic",\n    escuchar: "Hear from the people who live it",\n    empiezo: "Where do I start?",\n    soloEs: "",\n    booksMessage: "Everything on this website is free. Two books pay for it.", booksSee: "See them",\n    tabs: ["Search", "Answer 3 questions", "What can I ask for?"],\n    suggestions: ["I can't cope with the noise", "being around people drains me", "I can't sleep", "they don't understand them at school", "paperwork makes me freeze"],\n    startHere: "You can start here"'''
if en_old in s:s=s.replace(en_old,en_new,1)

# The Portuguese block remains as-is; PT-BR is not being re-enabled by this change.

# Visible book-support message must follow the selected language.
s=s.replace('''<p id="ig-books-message" style="margin:0 0 24px; font-size:16px; line-height:1.6; color:#17395c;">Todo lo de esta web es gratis. La pagan dos libros. <a href="/es/libros/" style="font-weight:700; text-decoration:underline; text-underline-offset:3px;">Verlos</a></p>''',
'''<p id="ig-books-message" style="margin:0 0 24px; font-size:16px; line-height:1.6; color:#17395c;">{{ tBooksMessage }} <a href="/es/libros/" style="font-weight:700; text-decoration:underline; text-underline-offset:3px;">{{ tBooksSee }}</a></p>''')

# Keep one index. The three fixed rows get English variants in the same object;
# conditions/situations are localised from buscador.json.
old_fijas='''      var FIJAS = [\n        { name: "Todas las fichas de Vida diaria", kind: "Vida diaria", url: "/es/biblioteca/", hint: "Moldes para el día a día: la compra, la cocina, el papeleo, dormir y salir de casa.", area: "" },\n        { name: "Todas las cifras de Datos", kind: "Datos", url: "/es/datos/", hint: "Cifras con su población, su método y su incertidumbre en la misma frase.", area: "" },\n        { name: "Todas las ayudas por país", kind: "Ayudas", url: "/es/tramites/directorio/", hint: "Qué ayuda puedes pedir en tu país, con su nombre oficial y su explicación en llano.", area: "" }\n      ];'''
new_fijas='''      var FIJAS = [\n        { name: "Todas las fichas de Vida diaria", kind: "Vida diaria", url: "/es/biblioteca/", hint: "Moldes para el día a día: la compra, la cocina, el papeleo, dormir y salir de casa.", area: "", en:{s:"Everyday life",t:"All Everyday life guides",u:"/es/biblioteca/",d:"Practical guides for daily life: shopping, cooking, paperwork, sleep and leaving home."} },\n        { name: "Todas las cifras de Datos", kind: "Datos", url: "/es/datos/", hint: "Cifras con su población, su método y su incertidumbre en la misma frase.", area: "", en:{s:"Data",t:"All Data figures",u:"/es/datos/",d:"Figures with the population measured, the method and the uncertainty stated together."} },\n        { name: "Todas las ayudas por país", kind: "Ayudas", url: "/es/tramites/directorio/", hint: "Qué ayuda puedes pedir en tu país, con su nombre oficial y su explicación en llano.", area: "", en:{s:"Support",t:"All support by country",u:"/es/tramites/directorio/",d:"What support you can ask for in your country, with its official name and a plain-language explanation."} }\n      ];'''
if old_fijas in s:s=s.replace(old_fijas,new_fijas,1)

s=s.replace('''    return window.IGSearch.rank(fondo, this.state.q).slice(0, 9);''','''    return window.IGSearch.rank(fondo, this.state.q, this.state.lang).slice(0, 9);''')
s=s.replace('''    const results = this.search();''','''    const results = this.search().map((r) => window.IGSearch.localize ? window.IGSearch.localize(r, L) : r);''')
s=s.replace('''      tHero2: X("Las situaciones están contadas en primera persona, y la tuya puede estar. También puedes responder tres preguntas o mirar qué ayuda puedes pedir."),''','''      tHero2: T.hero2,''')
s=s.replace('''      tLede: T.lede, tDirecto: T.directo, tEscuchar: T.escuchar, tEmpiezo: T.empiezo, tSoloEs: T.soloEs,\n      tabs: [tab("search", X("Buscar")), tab("quiz", X("Responder 3 preguntas")), tab("pedir", X("¿Qué puedo pedir?"))],''','''      tLede: T.lede, tDirecto: T.directo, tEscuchar: T.escuchar, tEmpiezo: T.empiezo, tSoloEs: T.soloEs,\n      tBooksMessage: T.booksMessage, tBooksSee: T.booksSee,\n      tabs: [tab("search", T.tabs[0]), tab("quiz", T.tabs[1]), tab("pedir", T.tabs[2])],''')
s=s.replace('''      listaLabel: st.q.trim() ? X("Resultados para") + " «" + st.q.trim() + "»" : X("Puedes empezar por aquí"),''','''      listaLabel: st.q.trim() ? X("Resultados para") + " «" + st.q.trim() + "»" : T.startHere,''')
s=s.replace('''      suggestions: ["no soporto el ruido", "me agoto con la gente", "no consigo dormir", "en el colegio no le entienden", "me bloqueo con los papeles"].map((label) => ({\n        label: X(label), pick: () => this.setState({ q: label })\n      })),''','''      suggestions: T.suggestions.map((label) => ({\n        label, pick: () => this.setState({ q: label })\n      })),''')

# No empty translation notice should reserve a visible line.
s=s.replace('''      <p style="margin: 0 0 26px; font-size: 14.5px; color: #5a6675; max-width: 640px;">{{ tSoloEs }}</p>''','''      <sc-if value="{{ tSoloEs }}"><p style="margin: 0 0 26px; font-size: 14.5px; color: #5a6675; max-width: 640px;">{{ tSoloEs }}</p></sc-if>''')

p.write_text(s)
print('home English presentation wired to existing language state and single search index')
