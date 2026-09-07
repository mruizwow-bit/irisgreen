#!/usr/bin/env python3
from pathlib import Path

p=Path('es/vivir-fuera/index.html')
s=p.read_text()

C_EN=r'''const C_EN = [
  { region: "Europe", country: "Portugal",
    lede: "Portugal's system is well documented and is one of the closest to Spain's. Early intervention runs up to age 6, and inclusive education is organised around three levels of measures.",
    points: [
      "Early childhood: SNIPI (Decreto-Lei 281/2009) provides early intervention from birth to age 6 through the Equipas Locais de Intervenção (ELI), with a Plano Individual de Intervenção Precoce (PIIP).",
      "School: Decreto-Lei 54/2018, of 6 July, governs inclusive education with three levels of measures —universal, selective and additional—, the Relatório Técnico-Pedagógico with the family's explicit agreement, and structured teaching units for autistic pupils.",
      "In the 2022–2023 school year there were 88,682 pupils with educational needs, 7.77% of the total.",
      "Support: the Prestação Social para a Inclusão (Decreto-Lei 126-A/2017) and the subsídio de educação especial, which is incompatible with the subsídio por assistência de terceira pessoa."
    ],
    start: "Contact the ELI for your area if the child is under 6, and the school in other cases. The FPDA (Federação Portuguesa de Autismo) refers people to its member associations by area; APSA and Associação PARA publish up-to-date legislation.",
    pending: "The current amounts for the Prestação Social para a Inclusão and the subsídio de educação especial. They will be added once checked against seg-social.pt.",
    sources: "Decreto-Lei 281/2009 (SNIPI). Decreto-Lei 54/2018, de 6 de julho. Decreto-Lei 126-A/2017. DGE, frequently asked questions on DL 54/2018." },

  { region: "Europe", country: "France",
    lede: "Everything goes through one entry point: the MDPH in the department where you live. One application can open access to financial support, school assistance and the school support plan.",
    points: [
      "The MDPH (Maison Départementale des Personnes Handicapées) in each department is the single entry point for disability support.",
      "The MDPH application can open access to AEEH (support for a disabled child), AAH (for adults), AESH (school assistance) and the personalised schooling plan (PPS).",
      "France has a Stratégie nationale pour les troubles du neuro-développement 2023-2027, including coordination and referral platforms (PCO) for early diagnosis."
    ],
    start: "Start with the MDPH in your department: the application is used for several forms of support, so it is worth preparing it carefully. Autisme France is a reference organisation, and autismeinfoservice.fr provides public information.",
    pending: "Current amounts and processing times, which vary by department, and the current status of the national strategy.",
    sources: "Stratégie nationale pour les troubles du neuro-développement 2023-2027. Autisme France. Autisme Info Service." },

  { region: "Europe", country: "Germany",
    lede: "Germany separates processes that are often grouped together elsewhere: the disability card, the care grade and participation support are three different procedures handled by different offices.",
    points: [
      "The Schwerbehindertenausweis, the disability card with its markers (Merkzeichen), is issued by the Versorgungsamt.",
      "The Pflegegrad, or care grade, is recognised through long-term care insurance.",
      "Eingliederungshilfe under SGB IX covers participation support.",
      "A Schulbegleiter, or school support person, is requested from the Jugendamt or Sozialamt depending on the case."
    ],
    start: "Start with the Versorgungsamt for the disability card, because it opens access to many of the other measures. autismus Deutschland e. V. and its regional associations can explain how responsibilities are divided in each Land.",
    pending: "The exact division of responsibilities, which varies by Land.",
    sources: "SGB IX. autismus Deutschland e. V." },

  { region: "Europe", country: "Ireland",
    lede: "Ireland has something relatively unusual: an assessment with deadlines set in law. In practice, documented waiting lists exist, so it helps to know that from the outset.",
    points: [
      "The Assessment of Need under the Disability Act 2005 establishes an assessment process with statutory time limits; waiting lists are documented.",
      "Domiciliary Care Allowance is the payment for children; Disability Allowance is for adults.",
      "The AIM model operates in preschool, while schools use SNAs (Special Needs Assistants)."
    ],
    start: "Apply for an Assessment of Need, because the application date matters for the statutory timeline. AsIAm is the national autistic organisation; the Irish Society for Autism is another source of information.",
    pending: "Actual waiting times and current payment rates.",
    sources: "Disability Act 2005. AsIAm. Irish Society for Autism." },

  { region: "Europe", country: "Italy",
    lede: "In Italy, much of the system centres on one law with a familiar name: Legge 104. Recognition under that law opens access to family leave and school support.",
    points: [
      "Legge 104/1992 recognises disability status and opens access to family employment leave and support measures.",
      "At school, the insegnante di sostegno is the support teacher.",
      "The indennità di frequenza is for minors; the indennità di accompagnamento is for people who need continuous assistance."
    ],
    start: "Start with recognition under Legge 104, processed through INPS with the initial medical certificate. ANGSA and Fondazione Italiana per l'Autismo are reference organisations.",
    pending: "Current INPS payment amounts.",
    sources: "Legge 104/1992. ANGSA. Fondazione Italiana per l'Autismo." },

  { region: "Europe", country: "Switzerland and the Netherlands",
    lede: "These are two highly decentralised systems: what is available depends more on the canton or municipality where you live than on a single national route.",
    points: [
      "Switzerland: disability insurance (AI/IV) funds medical measures and specialised education, but implementation is cantonal.",
      "Netherlands: youth support is organised by the municipality under the Jeugdwet, while school support goes through the samenwerkingsverband, the local group of schools."
    ],
    start: "Ask the canton or municipality directly: in these two countries a national answer is often not specific enough to tell you what applies locally.",
    pending: "The detailed local routes still need to be checked canton by canton and municipality by municipality.",
    sources: "AI/IV (Switzerland). Jeugdwet (Netherlands)." },

  { region: "Americas", country: "Canada",
    lede: "Canada adopted its first national autism strategy in 2024, but services remain provincial and vary considerably. Federal financial measures, by contrast, are linked together.",
    points: [
      "The Framework for Autism in Canada and Canada's Autism Strategy were presented on 26 September 2024 in response to the Federal Framework on Autism Spectrum Disorder Act (2023); the National Autism Network supports implementation.",
      "Services are provincial and uneven: in Ontario, the wait-list for publicly funded services exceeded 73,000 people in October 2024.",
      "The Disability Tax Credit (DTC) is the gateway to several other federal measures.",
      "With DTC eligibility, a person may also be able to access the Registered Disability Savings Plan (RDSP), including government contributions; the Canada Disability Benefit, introduced in 2025, of up to 2,400 Canadian dollars a year for adults; and the Child Disability Benefit as a supplement to the Canada Child Benefit.",
      "Jordan's Principle covers First Nations children."
    ],
    start: "Start with the Disability Tax Credit because it is the gateway to several other federal measures. Autism Alliance of Canada, Autism Canada and provincial organisations can help with services in each province.",
    pending: "Current-year amounts and province-by-province detail.",
    sources: "Public Health Agency of Canada, Framework for Autism in Canada and Canada's Autism Strategy (26 September 2024). Federal Framework on Autism Spectrum Disorder Act (2023)." },

  { region: "Oceania", country: "Australia", news: true,
    lede: "Australia's NDIS is one of the best-known disability support systems and is going through a major change: from October 2026, some young children with low or moderate support needs move to a different programme.",
    points: [
      "The NDIS (National Disability Insurance Scheme) has about 290,000 autistic participants, its largest diagnostic group.",
      "Thriving Kids: from 1 October 2026, children aged 8 or under with developmental delay or autism and low or moderate support needs begin to receive support through this government programme, funded at 4 billion Australian dollars over five years.",
      "Full rollout is scheduled for 1 January 2028; access to the NDIS changes for this group from that date.",
      "Children with permanent and significant disability, or high support needs, remain in the NDIS.",
      "The programme was announced on 20 August 2025 and the model was published on 3 February 2026."
    ],
    start: "Start with the NDIS if the person is already a participant or has high support needs; for a young child with low or moderate support needs, follow the Thriving Kids timetable. Autism Awareness Australia, Amaze (Victoria) and Aspect publish information about the change.",
    pending: "Each timetable milestone needs to be rechecked because this is changing policy.",
    sources: "NDIS, ‘Thriving Kids’ (announced 20 August 2025; model published 3 February 2026)." },

  { region: "Oceania", country: "New Zealand",
    lede: "New Zealand created a dedicated disability ministry in 2022 and has a national autism guideline, which is relatively unusual for a small country.",
    points: [
      "Whaikaha, the Ministry of Disabled People created in 2022, coordinates support.",
      "The Aotearoa New Zealand Autism Guideline is the national autism guideline."
    ],
    start: "Start with Whaikaha. Autism New Zealand is a reference organisation, and Altogether Autism operates as an information service.",
    pending: "The current edition of the guideline and the present status of the ministry.",
    sources: "Whaikaha, Ministry of Disabled People. Aotearoa New Zealand Autism Guideline." }
];'''

MAP_EN=r'''const MAP_EN = [
  { country: "Uruguay", text: "Comprehensive Protection Act 18.651 (2010). Pensions and support go through BPS; certification is handled by the Comisión Nacional Honoraria de la Discapacidad." },
  { country: "Ecuador", text: "Ley Orgánica de Discapacidades (2012). The disability card is issued by the Ministry of Public Health and opens access to exemptions and the disability payment." },
  { country: "Paraguay", text: "SENADIS certifies disability and coordinates support." },
  { country: "Bolivia", text: "The disability card, with registration in the state system, and the monthly disability payment. Administration is municipal and departmental." },
  { country: "Venezuela", text: "CONAPDIS certifies disability. Support arrangements change frequently, so this needs a short, dated entry that is checked regularly." },
  { country: "Costa Rica", text: "CONAPDIS and Equal Opportunities Act 7600 (1996)." },
  { country: "Panama", text: "SENADIS and disability certification." },
  { country: "Guatemala", text: "CONADI is the coordinating body." },
  { country: "Dominican Republic", text: "CONADIS RD certifies disability and coordinates support." }
];'''

UI=r'''const LANGSTR = {
  es: {
    eyebrow:"Vivir fuera", title:"El sistema de cada país, explicado en español.",
    intro:"Si te has ido a vivir fuera, lo primero que hace falta saber es quién decide, cómo se llama la puerta de entrada y por dónde se empieza. Eso es lo que hay aquí, con la ley o el organismo que lo dice y la fecha.",
    all:"Todos", regions:["Europa","América","Oceanía"], change:"Cambio en marcha", how:"Cómo funciona", start:"Por dónde se empieza", pending:"Pendiente de completar:", reference:"Referencia",
    mapTitle:"Hispanoamérica: quién certifica en cada país", mapIntro:"De momento esto es un mapa, no un listado de cuantías: dice qué organismo certifica la discapacidad y en qué ley está. El detalle de importes y plazos se añade país a país, con su comprobación.",
    mapNote:"Donde no hay estadística oficial, la ficha lo dice con esas palabras. Decir «no hay dato oficial», con la fuente que lo confirma, es más útil que rellenar con estimaciones.",
    legal:"Esta información sirve como orientación y no tiene validez jurídica. Cada país cambia sus cuantías y sus plazos: comprueba siempre el organismo oficial indicado antes de solicitar.",
    knowledge:"Base de conocimiento sobre neurodiversidad", directory:"Directorio de ayudas", howAsk:"Cómo pedirlo", living:"Vivir fuera", support:"Ayudas", everyday:"Vida diaria", situations:"Situaciones",
    a11y:"Lectura accesible", textSize:"Tamaño del texto", reset:"Restablecer",
    toggles:["Letra más separada","Botones más grandes","Más contraste","Guía de lectura","Leer en voz alta","Reducir movimiento"]
  },
  en: {
    eyebrow:"Living abroad", title:"Each country's system, explained clearly.",
    intro:"If you have moved abroad, the first things to know are who makes the decisions, what the entry point is called and where to start. That is what this page sets out, together with the law or public body behind each route.",
    all:"All", regions:["Europe","Americas","Oceania"], change:"Change under way", how:"How it works", start:"Where to start", pending:"Still to complete:", reference:"Reference",
    mapTitle:"Latin America: who certifies disability in each country", mapIntro:"For now this is a map rather than a list of payment amounts. It shows which body certifies disability and the relevant law. Amounts and deadlines are added country by country once checked.",
    mapNote:"Where no official statistic exists, the entry says so. Saying ‘there is no official figure’, with the source that supports that statement, is more useful than filling the gap with an estimate.",
    legal:"This information is for orientation and is not legal advice. Amounts and deadlines change: always check the official body named here before applying.",
    knowledge:"Knowledge base on neurodiversity", directory:"Support directory", howAsk:"How to apply", living:"Living abroad", support:"Support", everyday:"Everyday life", situations:"Situations",
    a11y:"Accessible reading", textSize:"Text size", reset:"Reset",
    toggles:["Wider letter spacing","Bigger buttons","More contrast","Reading guide","Read aloud","Reduce motion"]
  }
};'''

if 'const C_EN =' not in s:
    marker='\n];\n\nconst MAP = ['
    idx=s.find(marker,s.find('const C = ['))
    if idx<0:raise SystemExit('No se encontró el final de C')
    end=idx+3
    s=s[:end]+'\n\n'+C_EN+s[end:]
if 'const MAP_EN =' not in s:
    marker='\n];\n\nconst LANGSTR = {'
    idx=s.find(marker,s.find('const MAP = ['))
    if idx<0:raise SystemExit('No se encontró el final de MAP')
    end=idx+3
    s=s[:end]+'\n\n'+MAP_EN+s[end:]

# Replace the small old language-notice dictionary with the complete UI dictionary.
start=s.find('const LANGSTR = {')
end=s.find('\n};',start)
if start>=0 and end>=0:
    s=s[:start]+UI+s[end+3:]

# Template labels.
repl={
'>Vivir fuera</p>':'>{{ tEyebrow }}</p>',
'>El sistema de cada país, explicado en español.</h1>':'>{{ tTitle }}</h1>',
'>Si te has ido a vivir fuera, lo primero que hace falta saber es quién decide, cómo se llama la puerta de entrada y por dónde se empieza. Eso es lo que hay aquí, con la ley o el organismo que lo dice y la fecha.</p>':'>{{ tIntro }}</p>',
'>Cambio en marcha</span>':'>{{ tChange }}</span>',
'>Cómo funciona</div>':'>{{ tHow }}</div>',
'>Por dónde se empieza</div>':'>{{ tStart }}</div>',
'<strong>Sin publicar todavía:</strong> {{ f.pending }}':'<strong>{{ tPending }}</strong> {{ f.pending }}',
'>Referencia</div>':'>{{ tReference }}</div>',
'>Hispanoamérica: quién certifica en cada país</h2>':'>{{ tMapTitle }}</h2>',
'>De momento esto es un mapa, no un listado de cuantías: dice qué organismo certifica la discapacidad y en qué ley está. El detalle de importes y plazos se añade país a país, con su comprobación.</p>':'>{{ tMapIntro }}</p>',
'>Donde no hay estadística oficial, la ficha lo dice con esas palabras. Decir «no hay dato oficial», con la fuente que lo confirma, es más útil que rellenar con estimaciones.</p>':'>{{ tMapNote }}</p>',
'>Esta información sirve como orientación y no tiene validez jurídica. Cada país cambia sus cuantías y sus plazos: comprueba siempre el organismo oficial indicado antes de solicitar.</p>':'>{{ tLegal }}</p>',
'>Base de conocimiento sobre neurodiversidad</div>':'>{{ tKnowledge }}</div>',
'>Ayudas</a>':'>{{ tSupport }}</a>',
'>Vida diaria</a>':'>{{ tEveryday }}</a>',
'>Situaciones</a>':'>{{ tSituations }}</a>',
'>Lectura accesible</strong>':'>{{ tA11y }}</strong>',
'>Tamaño del texto · {{ fsLabel }}</div>':'>{{ tTextSize }} · {{ fsLabel }}</div>',
'>Restablecer</button><p class="ig-preference-note"':'>{{ tReset }}</button><p class="ig-preference-note"'
}
for a,b in repl.items():s=s.replace(a,b)
# Subnavigation labels and aria label.
s=s.replace('<nav class="ig-subtabs" aria-label="Ayudas"><a href="/es/tramites/directorio/">Directorio de ayudas</a><a href="/es/tramites/">Cómo pedirlo</a><a href="/es/vivir-fuera/" aria-current="page">Vivir fuera</a></nav>',
'<nav class="ig-subtabs" aria-label="{{ tSupport }}"><a href="/es/tramites/directorio/">{{ tDirectory }}</a><a href="/es/tramites/">{{ tHowAsk }}</a><a href="/es/vivir-fuera/" aria-current="page">{{ tLiving }}</a></nav>')
# Per-card review dates were identical editorial metadata, not verified per-country dates; do not display them as if independently reviewed.
s=s.replace('<div style="font-size: 14px; color: #5a6675; margin-top: 6px;">{{ f.reviewed }}</div>','')

# Render from the corresponding language dataset while keeping Spanish region keys internally for filtering.
old='''  renderVals() {\n    const st = this.state;\n    const rows = C.filter((c) => st.region === "all" || c.region === st.region);\n    const chip = (on) => ({ bg: on ? "#1f5f8b" : "#fff", color: on ? "#fff" : "#17395c", border: on ? "#1f5f8b" : "rgba(23,57,92,0.14)" });\n\n    return {'''
new='''  renderVals() {\n    const st = this.state;\n    const L = st.lang === "en" ? "en" : "es";\n    const T = LANGSTR[L];\n    const source = L === "en" ? C_EN : C;\n    const rows = source.filter((c, i) => st.region === "all" || C[i].region === st.region);\n    const chip = (on) => ({ bg: on ? "#1f5f8b" : "#fff", color: on ? "#fff" : "#17395c", border: on ? "#1f5f8b" : "rgba(23,57,92,0.14)" });\n\n    return {\n      tEyebrow:T.eyebrow,tTitle:T.title,tIntro:T.intro,tChange:T.change,tHow:T.how,tStart:T.start,tPending:T.pending,tReference:T.reference,\n      tMapTitle:T.mapTitle,tMapIntro:T.mapIntro,tMapNote:T.mapNote,tLegal:T.legal,tKnowledge:T.knowledge,tDirectory:T.directory,tHowAsk:T.howAsk,tLiving:T.living,tSupport:T.support,tEveryday:T.everyday,tSituations:T.situations,\n      tA11y:T.a11y,tTextSize:T.textSize,tReset:T.reset,'''
if old not in s:raise SystemExit('No se encontró renderVals esperado')
s=s.replace(old,new,1)

s=s.replace('''      langAviso: (LANGSTR[this.state.lang || "es"] || LANGSTR.es).aviso,\n\n      chips: [{ key: "all", label: "Todos" }].concat(REGIONS.map((r) => ({ key: r, label: r })))\n        .map((r) => Object.assign({ label: r.label, pick: () => this.setState({ region: r.key }) }, chip(st.region === r.key))),''',
'''      chips: [{ key: "all", label: T.all }].concat(REGIONS.map((r,i) => ({ key: r, label: T.regions[i] })))\n        .map((r) => Object.assign({ label: r.label, pick: () => this.setState({ region: r.key }) }, chip(st.region === r.key))),''')
s=s.replace('''        sources: c.sources, reviewed: c.reviewed\n      })),\n\n      showMap: st.region === "all" || st.region === "América",\n      mapRows: MAP,''',
'''        sources: c.sources\n      })),\n\n      showMap: st.region === "all" || st.region === "América",\n      mapRows: L === "en" ? MAP_EN : MAP,''')
s=s.replace('''          label: TOGGLES[n],''','''          label: T.toggles[n],''')

# Only ES and EN are supported on this page now; stale PT preference falls back to ES rather than producing a mixed page.
s=s.replace('''      if (sv && LANGSTR[sv]) this.setState({ lang: sv });\n      document.documentElement.lang = sv === "pt" ? "pt-BR" : (sv || "es");''',
'''      const active = sv === "en" ? "en" : "es";\n      this.setState({ lang: active });\n      document.documentElement.lang = active;''')

p.write_text(s)
print('Vivir fuera: full ES/EN content and interface prepared; source claims unchanged, translation only')
