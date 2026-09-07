#!/usr/bin/env python3
from pathlib import Path
import re

P=Path('es/vivir-fuera/index.html')
s=P.read_text(encoding='utf-8')

MARK='const C_EN = ['
if MARK in s:
    print('Vivir fuera ya contiene C_EN')
    raise SystemExit(0)

C_EN=r'''const C_EN = [
  { region: "Europe", country: "Portugal",
    lede: "Portugal's system is well documented and is one of the closest to the Spanish model. Early intervention runs up to age 6, and inclusive education is organised around three levels of measures.",
    points: [
      "Early childhood: SNIPI (Decree-Law 281/2009) provides early intervention from birth to age 6 through Local Intervention Teams (ELI), with an Individual Early Intervention Plan (PIIP).",
      "School: Decree-Law 54/2018 of 6 July governs inclusive education through three levels of measures —universal, selective and additional—, the Technical-Pedagogical Report with the family's explicit agreement, and structured teaching units for autistic pupils.",
      "In the 2022-2023 school year there were 88,682 pupils with educational needs, 7.77% of the total.",
      "Benefits: Prestação Social para a Inclusão (Decree-Law 126-A/2017) and the special-education allowance, which is incompatible with the allowance for assistance by a third person."
    ],
    start: "Start with your local ELI if the child is under 6, and with the school in other cases. FPDA (Federação Portuguesa de Autismo) refers families to its regional member associations; APSA and Associação PARA publish up-to-date legislation.",
    pending: "The current amounts for Prestação Social para a Inclusão and the special-education allowance. They are published here once checked against seg-social.pt.",
    sources: "Decree-Law 281/2009 (SNIPI). Decree-Law 54/2018 of 6 July. Decree-Law 126-A/2017. DGE, FAQs on Decree-Law 54/2018.",
    reviewed: "Last reviewed: 31 August 2026." },

  { region: "Europe", country: "France",
    lede: "Everything goes through one gateway: the MDPH in the department where you live. A single application can open access to financial support, school assistance and the personalised schooling plan.",
    points: [
      "The MDPH (Maison Départementale des Personnes Handicapées) in each department is the single gateway for disability support.",
      "The MDPH application covers AEEH (the allowance for a disabled child), AAH (for adults), AESH (school support staff) and the personalised schooling plan (PPS).",
      "France has a National Strategy for Neurodevelopmental Disorders 2023-2027, including coordination and referral platforms (PCO) for early diagnosis."
    ],
    start: "Start with the MDPH in your department: the same application is used for several forms of support, so it is worth preparing it carefully once. Autisme France is a national reference organisation, and Autisme Info Service provides public information.",
    pending: "Current amounts and processing times, which vary by department, and the current status of the national strategy.",
    sources: "National Strategy for Neurodevelopmental Disorders 2023-2027. Autisme France. Autisme Info Service.",
    reviewed: "Last reviewed: 31 August 2026." },

  { region: "Europe", country: "Germany",
    lede: "Germany separates processes that are often combined elsewhere: the disability card, the care grade and participation support are three different procedures handled by different offices.",
    points: [
      "The Schwerbehindertenausweis, the severe-disability card with its markers (Merkzeichen), is issued by the Versorgungsamt.",
      "The Pflegegrad, or care grade, is assessed through long-term care insurance.",
      "Eingliederungshilfe under SGB IX covers participation support.",
      "A Schulbegleiter, or school support person, is requested through the Jugendamt or Sozialamt depending on the case."
    ],
    start: "Start with the Versorgungsamt for the disability card, because it opens access to many other measures. autismus Deutschland e. V. and its regional associations can explain how responsibilities are divided in each Land.",
    pending: "The exact division of responsibilities, which varies by Land.",
    sources: "SGB IX. autismus Deutschland e. V.",
    reviewed: "Last reviewed: 31 August 2026." },

  { region: "Europe", country: "Ireland",
    lede: "Ireland has something relatively unusual: an assessment process with deadlines set by law. In practice, waiting lists are documented, so it helps to know that from the start.",
    points: [
      "The Assessment of Need under the Disability Act 2005 sets a statutory assessment process; waiting lists are documented.",
      "Domiciliary Care Allowance is the payment for children; Disability Allowance is for adults.",
      "The AIM model operates in preschool; in school, support may include SNAs (Special Needs Assistants)."
    ],
    start: "Apply for an Assessment of Need, because the application date matters for the statutory timetable. AsIAm is the national autistic organisation; the Irish Society for Autism is another reference organisation.",
    pending: "Actual current waiting times and benefit amounts.",
    sources: "Disability Act 2005. AsIAm. Irish Society for Autism.",
    reviewed: "Last reviewed: 31 August 2026." },

  { region: "Europe", country: "Italy",
    lede: "In Italy, much of the system is linked to one well-known law: Legge 104. Recognition under it opens access to family employment leave and school support.",
    points: [
      "Legge 104/1992 recognises disability status and opens access to family employment leave and support measures.",
      "At school, the insegnante di sostegno is the specialist support teacher.",
      "Indennità di frequenza is for minors; indennità di accompagnamento is for people who need continuous assistance."
    ],
    start: "Start with recognition under Legge 104, which is processed through INPS using the initial medical certificate. ANGSA and Fondazione Italiana per l'Autismo are reference organisations.",
    pending: "Current INPS payment amounts.",
    sources: "Legge 104/1992. ANGSA. Fondazione Italiana per l'Autismo.",
    reviewed: "Last reviewed: 31 August 2026." },

  { region: "Europe", country: "Switzerland and the Netherlands",
    lede: "These are two highly decentralised systems: what is available depends more on the canton or municipality where you live than on a single national route.",
    points: [
      "Switzerland: disability insurance (AI/IV) funds medical measures and specialised education, but implementation is cantonal.",
      "The Netherlands: youth support is organised by the municipality under the Jeugdwet, while school support is organised through the local samenwerkingsverband, the regional partnership of schools."
    ],
    start: "Ask the canton or municipality directly: in these two countries a national answer often does not tell you what applies locally.",
    pending: "The full local detail must be checked canton by canton and municipality by municipality.",
    sources: "AI/IV (Switzerland). Jeugdwet (Netherlands).",
    reviewed: "Last reviewed: 31 August 2026." },

  { region: "Americas", country: "Canada",
    lede: "Canada adopted its first national autism strategy in 2024, but services remain provincial and highly uneven. Federal financial supports, by contrast, are linked together.",
    points: [
      "The Framework for Autism in Canada and Canada's Autism Strategy were presented on 26 September 2024 under the Federal Framework on Autism Spectrum Disorder Act (2023); the National Autism Network supports implementation.",
      "Services are provincial and uneven: in Ontario, the waiting list for publicly funded services exceeded 73,000 people in October 2024.",
      "The Disability Tax Credit (DTC) is the gateway to several other federal supports.",
      "With DTC eligibility, people may access the Registered Disability Savings Plan (RDSP), including government contributions; the Canada Disability Benefit, from 2025, of up to CAD 2,400 a year for adults; and the Child Disability Benefit as a supplement to the Canada Child Benefit.",
      "Jordan's Principle covers First Nations children."
    ],
    start: "Start with the Disability Tax Credit, because it is the gateway to several other federal supports. Autism Alliance of Canada, Autism Canada and provincial organisations can help with province-specific services.",
    pending: "Current-year payment amounts and province-by-province details.",
    sources: "Public Health Agency of Canada, Framework for Autism in Canada and Canada's Autism Strategy (26 September 2024). Federal Framework on Autism Spectrum Disorder Act (2023).",
    reviewed: "Last reviewed: 31 August 2026." },

  { region: "Oceania", country: "Australia", news: true,
    lede: "Australia has one of the world's best-known disability support systems, the NDIS, and it is changing: from October 2026, young children with low or moderate support needs begin moving to a different programme.",
    points: [
      "The NDIS (National Disability Insurance Scheme) has around 290,000 autistic participants, the largest diagnostic group in the scheme.",
      "Thriving Kids: from 1 October 2026, children aged 8 or under with developmental delay or autism and low or moderate support needs begin receiving support through this government programme, funded at AUD 4 billion over five years.",
      "Full rollout is scheduled for 1 January 2028; from that date, NDIS access changes for this group.",
      "Children with permanent and significant disability, or high support needs, remain in the NDIS.",
      "The programme was announced on 20 August 2025 and the model was published on 3 February 2026."
    ],
    start: "Start with the NDIS if the person is already a participant or has high support needs. For a young child with low or moderate support needs, follow the Thriving Kids timetable. Autism Awareness Australia, Amaze (Victoria) and Aspect publish information about the change.",
    pending: "Each timetable milestone: this is current-affairs content and is reviewed at every relevant date.",
    sources: "NDIS, 'Thriving Kids' (announced 20 August 2025; model published 3 February 2026).",
    reviewed: "Last reviewed: 31 August 2026. Next check: October 2026." },

  { region: "Oceania", country: "New Zealand",
    lede: "New Zealand created a dedicated disability ministry in 2022 and has a national autism clinical guideline, which is relatively unusual for a small country.",
    points: [
      "Whaikaha, the Ministry of Disabled People created in 2022, coordinates support.",
      "The Aotearoa New Zealand Autism Guideline is the national clinical guideline."
    ],
    start: "Start with Whaikaha. Autism New Zealand is a reference organisation, and Altogether Autism operates as an information service.",
    pending: "The current edition of the guideline and the present status of the ministry.",
    sources: "Whaikaha, Ministry of Disabled People. Aotearoa New Zealand Autism Guideline.",
    reviewed: "Last reviewed: 31 August 2026." }
];

const MAP_EN = [
  { country: "Uruguay", text: "Comprehensive Protection Act 18.651 (2010). Pensions and support are handled through BPS; certification is through the National Honorary Disability Commission." },
  { country: "Ecuador", text: "Organic Disabilities Act (2012). The Ministry of Public Health issues the disability card, which opens access to exemptions and the benefit." },
  { country: "Paraguay", text: "SENADIS certifies disability and coordinates support." },
  { country: "Bolivia", text: "The disability card, with state registration, and the monthly benefit. Administration is municipal and departmental." },
  { country: "Venezuela", text: "CONAPDIS certifies disability. Support arrangements change frequently, so this remains a short entry with a visible date and six-month review." },
  { country: "Costa Rica", text: "CONAPDIS and Equal Opportunities Act 7600 (1996)." },
  { country: "Panama", text: "SENADIS and disability certification." },
  { country: "Guatemala", text: "CONADI is the coordinating body." },
  { country: "Dominican Republic", text: "CONADIS RD certifies disability and coordinates support." }
];

const VF_UI = {
  es: {eyebrow:"Vivir fuera",title:"El sistema de cada país, explicado en español.",lede:"Si te has ido a vivir fuera, lo primero que hace falta saber es quién decide, cómo se llama la puerta de entrada y por dónde se empieza. Eso es lo que hay aquí, con la ley o el organismo que lo dice y la fecha.",all:"Todos",regions:["Europa","América","Oceanía"],start:"Por dónde se empieza",pending:"Sin publicar todavía:",reference:"Referencia",mapTitle:"Hispanoamérica: quién certifica en cada país",mapLede:"De momento esto es un mapa, no un listado de cuantías: dice qué organismo certifica la discapacidad y en qué ley está. El detalle de importes y plazos se añade país a país, con su comprobación.",directory:"Directorio de ayudas",how:"Cómo pedirlo",living:"Vivir fuera",reading:"Lectura accesible",close:"Cerrar",size:"Tamaño del texto",reset:"Restablecer",toggles:["Letra más separada","Botones más grandes","Más contraste","Guía de lectura","Leer en voz alta","Reducir movimiento"]},
  en: {eyebrow:"Living abroad",title:"Each country's system, explained in English.",lede:"If you have moved abroad, the first things you need to know are who makes the decision, what the entry point is called and where to begin. That is what this section sets out, with the law or public body behind it and the relevant date.",all:"All",regions:["Europe","Americas","Oceania"],start:"Where to start",pending:"Not published yet:",reference:"Reference",mapTitle:"Latin America: who certifies disability in each country",mapLede:"For now this is a map, not a list of payment amounts: it identifies the body that certifies disability and the relevant law. Amounts and deadlines are added country by country after they are checked.",directory:"Support directory",how:"How to apply",living:"Living abroad",reading:"Accessible reading",close:"Close",size:"Text size",reset:"Reset",toggles:["Wider letter spacing","Bigger buttons","More contrast","Reading guide","Read aloud","Reduce motion"]}
};'''

# Insert the English dataset immediately before MAP, without touching Spanish data.
s=s.replace('\nconst MAP = [', '\n'+C_EN+'\n\nconst MAP = [', 1)

# Replace the old notice-only language object with a real UI object reference.
s=re.sub(r'const LANGSTR = \{.*?\n\};\n\n\nclass Component', 'const LANGSTR = { es:{aviso:""}, en:{aviso:""} };\n\nclass Component', s, count=1, flags=re.S)

# Template: only replace literal UI labels with reactive values.
repls={
'>Vivir fuera</p>': '>{{ tEyebrow }}</p>',
'>El sistema de cada país, explicado en español.</h1>': '>{{ tTitle }}</h1>',
'>Si te has ido a vivir fuera, lo primero que hace falta saber es quién decide, cómo se llama la puerta de entrada y por dónde se empieza. Eso es lo que hay aquí, con la ley o el organismo que lo dice y la fecha.</p>': '>{{ tLede }}</p>',
'>Por dónde se empieza</div>': '>{{ tStart }}</div>',
'<strong>Sin publicar todavía:</strong>': '<strong>{{ tPending }}</strong>',
'>Referencia</div>': '>{{ tReference }}</div>',
'>Hispanoamérica: quién certifica en cada país</h2>': '>{{ tMapTitle }}</h2>',
'>De momento esto es un mapa, no un listado de cuantías: dice qué organismo certifica la discapacidad y en qué ley está. El detalle de importes y plazos se añade país a país, con su comprobación.</p>': '>{{ tMapLede }}</p>',
'>Directorio de ayudas</a>': '>{{ tDirectory }}</a>',
'>Cómo pedirlo</a>': '>{{ tHow }}</a>',
'>Vivir fuera</a>': '>{{ tLiving }}</a>',
'>Lectura accesible</strong>': '>{{ tReading }}</strong>',
'aria-label="Cerrar"': 'sc-camel-aria-label="{{ tClose }}"',
'>Tamaño del texto · {{ fsLabel }}</div>': '>{{ tSize }} · {{ fsLabel }}</div>',
'>Restablecer</button>': '>{{ tReset }}</button>'
}
for a,b in repls.items():
    if a not in s: print('WARN literal not found:', a[:60])
    s=s.replace(a,b)

# Use the actual selected language for datasets and labels.
s=s.replace('const rows = C.filter((c) => st.region === "all" || c.region === st.region);',
'''const english = (st.lang || "es") === "en";
    const sourceCards = english ? C_EN : C;
    const rows = sourceCards.filter((c) => st.region === "all" || c.region === st.region);
    const ui = VF_UI[english ? "en" : "es"];''')

old='''      chips: [{ key: "all", label: "Todos" }].concat(REGIONS.map((r) => ({ key: r, label: r })))
        .map((r) => Object.assign({ label: r.label, pick: () => this.setState({ region: r.key }) }, chip(st.region === r.key))),'''
new='''      tEyebrow: ui.eyebrow, tTitle: ui.title, tLede: ui.lede,
      tStart: ui.start, tPending: ui.pending, tReference: ui.reference,
      tMapTitle: ui.mapTitle, tMapLede: ui.mapLede,
      tDirectory: ui.directory, tHow: ui.how, tLiving: ui.living,
      tReading: ui.reading, tClose: ui.close, tSize: ui.size, tReset: ui.reset,

      chips: [{ key: "all", label: ui.all }].concat(ui.regions.map((label, i) => ({ key: english ? ["Europe","Americas","Oceania"][i] : REGIONS[i], label })))
        .map((r) => Object.assign({ label: r.label, pick: () => this.setState({ region: r.key }) }, chip(st.region === r.key))),'''
if old not in s: raise SystemExit('chips block not found')
s=s.replace(old,new,1)

s=s.replace('showMap: st.region === "all" || st.region === "América",\n      mapRows: MAP,',
'''showMap: st.region === "all" || st.region === (english ? "Americas" : "América"),
      mapRows: english ? MAP_EN : MAP,''',1)

s=s.replace('label: TOGGLES[n],','label: ui.toggles[n],',1)

# Keep state/filter coherent when switching languages and update metadata.
old_set='''  setLang(l) {
    this.setState({ lang: l });
    try { localStorage.setItem("ig_lang", l); document.documentElement.lang = l === "pt" ? "pt-BR" : l; } catch (e) {}
  }'''
new_set='''  setLang(l) {
    const lang = l === "en" ? "en" : "es";
    this.setState({ lang, region: "all" });
    try {
      localStorage.setItem("ig_lang", lang);
      document.documentElement.lang = lang;
      document.title = lang === "en" ? "Living abroad: each country's system · Iris Green" : "Vivir fuera: el sistema de cada país, en español · Iris Green";
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.content = lang === "en" ? "How neurodivergence and disability support works in Portugal, France, Germany, Ireland, Italy, Canada, Australia and other countries, explained in English." : "Cómo funcionan los apoyos a la neurodivergencia en Portugal, Francia, Alemania, Irlanda, Italia, Canadá, Australia y otros países, explicado en español para familias hispanohablantes emigradas.";
    } catch (e) {}
  }'''
if old_set not in s: raise SystemExit('setLang block not found')
s=s.replace(old_set,new_set,1)

# On load, accept only the languages genuinely implemented on this page.
s=s.replace('if (sv && LANGSTR[sv]) this.setState({ lang: sv });\n      document.documentElement.lang = sv === "pt" ? "pt-BR" : (sv || "es");',
'''if (sv === "en" || sv === "es") this.setState({ lang: sv });
      document.documentElement.lang = sv === "en" ? "en" : "es";''',1)

# Ensure we did not accidentally drop the Spanish source dataset.
assert 'country: "Portugal"' in s and 'country: "France"' in s and 'const C_EN = [' in s
P.write_text(s,encoding='utf-8')
print('Vivir fuera: English content added without replacing the Spanish dataset.')
