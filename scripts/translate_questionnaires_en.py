#!/usr/bin/env python3
from pathlib import Path

p = Path('es/cuestionarios/index.html')
s = p.read_text(encoding='utf-8')

sentinel = 'const TOGGLES = ["Letra más separada", "Botones más grandes", "Más contraste", "Guía de lectura", "Leer en voz alta", "Reducir movimiento"];'
if sentinel not in s:
    raise SystemExit('No encuentro el bloque esperado de Cuestionarios; no modifico nada.')
if 'const TESTS_EN = [' in s:
    print('Cuestionarios ya contiene la traducción EN; sin cambios.')
    raise SystemExit(0)

s = s.replace(
    sentinel,
    sentinel + '''\nconst TOGGLES_EN = ["Wider letter spacing", "Larger buttons", "Higher contrast", "Reading guide", "Read aloud", "Reduce motion"];\n\nconst UI_ES = {\n  stateReady: "Disponible", stateExcluded: "No se publica", stateLoad: "Listo para cargar",\n  pendingExcluded: "Queda fuera hasta que exista una adaptación española documentada.",\n  pendingLoad: "Faltan los ítems de la versión validada para poder publicarlo. No se reescriben ni se traducen: se copian del original."\n};\nconst UI_EN = {\n  stateReady: "Available", stateExcluded: "Not published", stateLoad: "Ready to load",\n  pendingExcluded: "It remains excluded until a documented Spanish adaptation is available.",\n  pendingLoad: "The items from the validated version still need to be added before it can be published. They are not rewritten or translated: they are copied from the original."\n};\n\nconst STATIC_ES_EN = {\n  "Condiciones": "Conditions",\n  "Cuestionarios": "Questionnaires",\n  "Cuestionarios orientativos · solo adultos": "Screening questionnaires · adults only",\n  "Orientan. No diagnostican.": "They can guide you. They do not diagnose.",\n  "Tres cuestionarios en su versión española validada. Sirven para ordenar lo que ya notas y llevarlo a una consulta con algo concreto en la mano.": "Three questionnaires in their validated Spanish versions. They can help organise what you are already noticing and give you something concrete to discuss at an appointment.",\n  "Este cuestionario orienta. Ninguna puntuación diagnostica ni descarta nada. El diagnóstico lo hace un profesional con una evaluación completa.": "These questionnaires can guide you. No score diagnoses or rules anything out. Diagnosis requires a full assessment by a qualified professional.",\n  "Se calcula en tu navegador": "Calculated in your browser",\n  "Las respuestas y la puntuación no salen de tu ordenador o tu móvil. No se envía nada a ningún servidor, no se guarda al cerrar y el resultado no se puede compartir por enlace.": "Your answers and score never leave your computer or phone. Nothing is sent to a server, nothing is saved when you close the page, and the result cannot be shared by link.",\n  "Sin registro y sin prisa": "No account and no rush",\n  "No hay cuenta, ni correo, ni cookies asociadas. No hay límite de tiempo y puedes salir cuando quieras.": "There is no account, email address or questionnaire cookie. There is no time limit and you can leave whenever you want.",\n  "Solo para mayores de 18 años": "Adults aged 18 and over only",\n  "Están validados en personas adultas. Para la infancia no hay cuestionario: la ruta es «qué llevar a la valoración».": "They are validated in adults. For children, there is no questionnaire here: the route is what to take to an assessment.",\n  "Cuánto dura": "How long it takes",\n  "Umbral orientativo": "Screening threshold",\n  "Versión que se usa y licencia": "Version used and licence",\n  "Empezar el cuestionario": "Start questionnaire",\n  "Qué no vas a encontrar aquí": "What you will not find here",\n  "Sea cual sea la puntuación, el paso siguiente es el mismo:": "Whatever the score, the next step is the same:",\n  "qué llevar a la valoración": "what to take to an assessment",\n  "Última revisión: 31 de agosto de 2026.": "Last reviewed: 31 August 2026.",\n  "Base de conocimiento sobre neurodiversidad": "A knowledge base on neurodiversity",\n  "Situaciones": "Situations",\n  "Investigación": "Research",\n  "Lectura accesible": "Accessible reading",\n  "Cerrar": "Close",\n  "Tamaño del texto ·": "Text size ·",\n  "Restablecer": "Reset"\n};\nconst STATIC_EN_ES = Object.fromEntries(Object.entries(STATIC_ES_EN).map(([es,en]) => [en,es]));\n\nfunction translateQuestionnaireStatic(lang) {\n  const toEnglish = lang === "en";\n  const dict = toEnglish ? STATIC_ES_EN : STATIC_EN_ES;\n  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {\n    acceptNode(node) {\n      const parent = node.parentElement;\n      if (!parent || /^(SCRIPT|STYLE|TEXTAREA)$/i.test(parent.tagName)) return NodeFilter.FILTER_REJECT;\n      return NodeFilter.FILTER_ACCEPT;\n    }\n  });\n  const nodes = [];\n  while (walker.nextNode()) nodes.push(walker.currentNode);\n  for (const node of nodes) {\n    const raw = node.nodeValue || "";\n    const trimmed = raw.trim();\n    if (!trimmed) continue;\n    let replacement = dict[trimmed];\n    if (!replacement && toEnglish && trimmed.startsWith("Tamaño del texto · ")) replacement = "Text size · " + trimmed.slice("Tamaño del texto · ".length);\n    if (!replacement && !toEnglish && trimmed.startsWith("Text size · ")) replacement = "Tamaño del texto · " + trimmed.slice("Text size · ".length);\n    if (replacement) node.nodeValue = raw.replace(trimmed, replacement);\n  }\n  const conditions = toEnglish ? "/en/neurodiversity/conditions/" : "/es/neurodiversidad/condiciones/";\n  const situations = toEnglish ? "/en/situations/" : "/es/situaciones/";\n  document.querySelectorAll('a[href="/es/neurodiversidad/condiciones/"],a[href="/en/neurodiversity/conditions/"]').forEach(a => a.href = conditions);\n  document.querySelectorAll('a[href="/es/situaciones/"],a[href="/en/situations/"]').forEach(a => a.href = situations);\n  document.querySelectorAll('.ig-subtabs').forEach(n => n.setAttribute('aria-label', toEnglish ? 'Conditions' : 'Condiciones'));\n  document.querySelectorAll('[data-ig-reading-close]').forEach(b => b.setAttribute('aria-label', toEnglish ? 'Close' : 'Cerrar'));\n  document.title = toEnglish ? 'Screening questionnaires · Iris Green' : 'Cuestionarios orientativos · Iris Green';\n  const desc = toEnglish\n    ? 'AQ-10, CAT-Q-ES and ASRS v1.1 in their validated Spanish versions. They can guide you, not diagnose: scoring happens in your browser and nothing is sent or stored.'\n    : 'AQ-10, CAT-Q-ES y ASRS v1.1 en su versión española validada. Orientan, no diagnostican: se calculan en tu navegador, no se envía nada y no se guarda nada.';\n  const meta = document.querySelector('meta[name="description"]'); if (meta) meta.content = desc;\n  const ogt = document.querySelector('meta[property="og:title"]'); if (ogt) ogt.content = toEnglish ? 'Screening questionnaires — Iris Green' : 'Cuestionarios orientativos — Iris Green';\n  const ogl = document.querySelector('meta[property="og:locale"]'); if (ogl) ogl.content = toEnglish ? 'en_GB' : 'es_ES';\n}\n'''
)

insert_before = '\nconst NOTS = ['
tests_en = r'''
const TESTS_EN = [
  { id: "aq10", topic: "Autism", name: "AQ-10", ready: false,
    what: "Ten questions with four response options. It is the brief version NICE recommends to help identify possible autism in adults.",
    time: "2 to 3 minutes", cut: "6 or more",
    source: "Validated Spanish version by López (2020), «Tamizaje de Trastornos del Espectro Autista en adultos: una versión en español del AQ-10», with a cut-off of 6, sensitivity .89 and specificity .91. The items are taken verbatim from the appendix to the article. Instrument from the Autism Research Centre (Cambridge), free for non-commercial use with attribution." },

  { id: "catq", topic: "Camouflaging", name: "CAT-Q-ES", ready: false,
    what: "Twenty-five questions on a 1-to-7 scale, with three parts: compensation, masking and assimilation. It measures how much effort is devoted to fitting in.",
    time: "5 to 8 minutes", cut: "100 on the total score, as an informational reference",
    note: "A camouflaging score on its own does not establish whether a person is autistic. Camouflaging can be exhausting and affect wellbeing: if your score concerns you, take it to an appointment.",
    source: "Spanish cultural adaptation and validation: Conde-Pumpido Zubizarreta et al. (2025), «Camouflaging Autistic Traits Questionnaire: Cultural Adaptation, Reliability, and Validity in Autistic and Non-Autistic from Spain», with 490 adults (111 autistic and 379 non-autistic), internal consistency ω=.95 and test-retest r=.99. Original instrument by Hull et al. (2019), open access." },

  { id: "asrs", topic: "ADHD", name: "ASRS v1.1", ready: false,
    what: "The World Health Organization adult self-report questionnaire. Part A has six questions and is the screener; the remaining twelve provide context for an appointment.",
    time: "3 to 6 minutes", cut: "4 or more responses in the shaded boxes in Part A",
    note: "ADHD and autistic traits can overlap. Distinguishing them is the clinician's job, not a questionnaire's.",
    source: "Official WHO Spanish version distributed by Harvard (6Q and 18Q, Spanish for Spain and Mexico). The 6Q Screener may be used free of charge, including commercially, with attribution and without modifying the instrument." },

  { id: "raads", topic: "Autism", name: "RAADS-R", ready: false, pendingOverride: true,
    what: "Eighty questions for adults who reached adulthood without a diagnosis.",
    time: "20 to 30 minutes", cut: "65 or more in the validation study",
    note: "We do not publish it here. The original study (Ritvo et al., 2011) involved English-speaking participants and its authors specify that it was designed to be administered by a clinician during an appointment, not as an online screener. We do not use Spanish translations of unknown origin.",
    source: "Ritvo et al. (2011), international validation study. A documented Spanish adaptation has not yet been located." }
];
'''
if insert_before not in s:
    raise SystemExit('No encuentro NOTS para insertar TESTS_EN.')
s = s.replace(insert_before, '\n' + tests_en + insert_before, 1)

nots_end = '''const LANGSTR = {'''
nots_en = r'''
const NOTS_EN = [
  { text: "No questionnaires for people under 18." },
  { text: "No eating-behaviour screening tools." },
  { text: "No result with a label: no ‘consistent with’ or ‘probable’. Only the score, the sourced threshold and the next step." },
  { text: "No registration, account, email address or cookie linked to the questionnaires." }
];

'''
if nots_end not in s:
    raise SystemExit('No encuentro LANGSTR para insertar NOTS_EN.')
s = s.replace(nots_end, nots_en + nots_end, 1)

s = s.replace(
'''const LANGSTR = {
  es: { aviso: "Esta página está en castellano. Los botones de idioma ya funcionan en toda la web; la traducción de esta sección está en marcha y se dice aquí para no darla por hecha." },
  en: { aviso: "This page is in Spanish. The language buttons already work across the site; translating this section is under way, and it is said here so nobody assumes it is done." },
  pt: { aviso: "Esta página está em castelhano. Os botões de idioma já funcionam em todo o site; a tradução desta seção está em andamento, e isso é dito aqui para não dar como pronta." }
};''',
'''const LANGSTR = {
  es: { aviso: "Esta página está disponible en español e inglés." },
  en: { aviso: "This page is available in Spanish and English." },
  pt: { aviso: "Esta página ainda não está disponível em português." }
};''')

s = s.replace('''  renderVals() {
    const st = this.state;
    return {''', '''  renderVals() {
    const st = this.state;
    const lang = st.lang || "es";
    const labels = lang === "en" ? UI_EN : UI_ES;
    clearTimeout(this._questionnaireLangTimer);
    this._questionnaireLangTimer = setTimeout(() => translateQuestionnaireStatic(lang), 0);
    return {''')

s = s.replace('tests: TESTS.map((t) => ({', 'tests: (lang === "en" ? TESTS_EN : TESTS).map((t) => ({')
s = s.replace('state: t.ready ? "Disponible" : t.pendingOverride ? "No se publica" : "Listo para cargar",', 'state: t.ready ? labels.stateReady : t.pendingOverride ? labels.stateExcluded : labels.stateLoad,')
s = s.replace('''pendingText: t.pendingOverride
          ? "Queda fuera hasta que exista una adaptación española documentada."
          : "Faltan los ítems de la versión validada para poder publicarlo. No se reescriben ni se traducen: se copian del original.",''', '''pendingText: t.pendingOverride ? labels.pendingExcluded : labels.pendingLoad,''')
s = s.replace('nots: NOTS,', 'nots: lang === "en" ? NOTS_EN : NOTS,')
s = s.replace('label: TOGGLES[n],', 'label: (lang === "en" ? TOGGLES_EN : TOGGLES)[n],')
s = s.replace('''  componentWillUnmount() {
    if (this._igPreferencesDisconnect) this._igPreferencesDisconnect();
  }''', '''  componentWillUnmount() {
    clearTimeout(this._questionnaireLangTimer);
    if (this._igPreferencesDisconnect) this._igPreferencesDisconnect();
  }''')

# Verify every critical transformation happened.
checks = [
    'const TESTS_EN = [', 'const NOTS_EN = [', 'translateQuestionnaireStatic(lang)',
    'tests: (lang === "en" ? TESTS_EN : TESTS).map', 'nots: lang === "en" ? NOTS_EN : NOTS',
    'label: (lang === "en" ? TOGGLES_EN : TOGGLES)[n]'
]
missing = [x for x in checks if x not in s]
if missing:
    raise SystemExit('Transformación incompleta: ' + ', '.join(missing))

p.write_text(s, encoding='utf-8')
print('Cuestionarios: interfaz y explicaciones ES/EN preparadas.')
