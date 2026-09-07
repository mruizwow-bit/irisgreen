#!/usr/bin/env python3
from pathlib import Path
import re

p=Path('index.html')
s=p.read_text()

# Keep the existing layout and behaviour. Only move hard-coded Spanish home copy
# into the existing language dictionary/render values so EN does not leave mixed text.
repls={
'''    es: {\n      navHome: "Inicio",''':'''    es: {\n      navHome: "Inicio",''',
}

# Add missing home strings to STR.es/STR.en immediately before the known footer key.
anchor_es='''      tFootAbout: "Sobre Iris Green",'''
add_es='''      intro1: "Las situaciones están contadas en primera persona, y la tuya puede estar. También puedes responder tres preguntas o mirar qué ayuda puedes pedir.",\n      translationNote: "",\n      booksSupport: "Todo lo de esta web es gratis. La pagan dos libros.",\n      booksSee: "Verlos",\n      searchTab: "Buscar",\n      askTab: "Responder 3 preguntas",\n      askForTab: "¿Qué puedo pedir?",\n      searchPlaceholder: "ruido, no consigo empezar, no consigo dormir, colegio…",\n      quickSearch: ["no soporto el ruido","me agoto con la gente","no consigo dormir","en el colegio no le entienden","me bloqueo con los papeles"],\n      startHere: "Puedes empezar por aquí",\n      allEveryday: "Todas las fichas de Vida diaria",\n      everydayDesc: "Moldes para el día a día: la compra, la cocina, el papeleo, dormir y salir de casa.",\n      allData: "Todas las cifras de Datos",\n      dataDesc: "Cifras con su población, su método y su incertidumbre en la misma frase.",\n      allSupport: "Todas las ayudas por país",\n      supportDesc: "Qué ayuda puedes pedir en tu país, con su nombre oficial y su explicación en llano.",\n'''
if anchor_es in s and 'booksSupport:' not in s:
    s=s.replace(anchor_es,add_es+anchor_es,1)

anchor_en='''      tFootAbout: "About Iris Green",'''
add_en='''      intro1: "The situations are told in the first person, and yours may be here too. You can also answer three questions or see what support you can ask for.",\n      translationNote: "",\n      booksSupport: "Everything on this website is free. Two books pay for it.",\n      booksSee: "See them",\n      searchTab: "Search",\n      askTab: "Answer 3 questions",\n      askForTab: "What can I ask for?",\n      searchPlaceholder: "noise, I can't get started, I can't sleep, school…",\n      quickSearch: ["I can't cope with the noise","being around people drains me","I can't sleep","they don't understand them at school","paperwork makes me freeze"],\n      startHere: "You can start here",\n      allEveryday: "All Everyday life guides",\n      everydayDesc: "Practical guides for daily life: shopping, cooking, paperwork, sleep and leaving home.",\n      allData: "All Data figures",\n      dataDesc: "Figures with the population measured, the method and the uncertainty stated together.",\n      allSupport: "All support by country",\n      supportDesc: "What support you can ask for in your country, with its official name and a plain-language explanation.",\n'''
if anchor_en in s and 'booksSupport: "Everything on this website' not in s:
    s=s.replace(anchor_en,add_en+anchor_en,1)

# Replace the visible hard-coded home copy with render variables.
text_replacements={
'Las situaciones están contadas en primera persona, y la tuya puede estar.<br/>También puedes responder tres preguntas o mirar qué ayuda puedes pedir.':'{{ intro1 }}',
'<p style="margin: 0 0 12px; font-size: 14px; color: #6b6479;">The sections are in Spanish. Translation is under way.</p>':'<sc-if value="{{ translationNote }}"><p style="margin: 0 0 12px; font-size: 14px; color: #6b6479;">{{ translationNote }}</p></sc-if>',
'Todo lo de esta web es gratis. La pagan dos libros. <a href="/es/libros/" style="font-weight:700;">Verlos</a>':'{{ booksSupport }} <a href="/es/libros/" style="font-weight:700;">{{ booksSee }}</a>',
'>Buscar</button>':'>{{ searchTab }}</button>',
'>Responder 3 preguntas</button>':'>{{ askTab }}</button>',
'>¿Qué puedo pedir?</button>':'>{{ askForTab }}</button>',
'placeholder="ruido, no consigo empezar, no consigo dormir, colegio…"':'sc-camel-placeholder="{{ searchPlaceholder }}"',
'Puedes empezar por aquí':'{{ startHere }}',
'Todas las fichas de Vida diaria':'{{ allEveryday }}',
'Moldes para el día a día: la compra, la cocina, el papeleo, dormir y salir de casa.':'{{ everydayDesc }}',
'Todas las cifras de Datos':'{{ allData }}',
'Cifras con su población, su método y su incertidumbre en la misma frase.':'{{ dataDesc }}',
'Todas las ayudas por país':'{{ allSupport }}',
'Qué ayuda puedes pedir en tu país, con su nombre oficial y su explicación en llano.':'{{ supportDesc }}',
}
for a,b in text_replacements.items():
    s=s.replace(a,b)

# Replace the five hard-coded quick chips with the language-specific list.
quick_pat=re.compile(r'''<div style="display: flex; flex-wrap: wrap; gap: 7px; margin: 10px 0 12px;">\s*<button[^>]*>no soporto el ruido</button>\s*<button[^>]*>me agoto con la gente</button>\s*<button[^>]*>no consigo dormir</button>\s*<button[^>]*>en el colegio no le entienden</button>\s*<button[^>]*>me bloqueo con los papeles</button>\s*</div>''',re.S)
quick='''<div style="display: flex; flex-wrap: wrap; gap: 7px; margin: 10px 0 12px;">\n          <sc-for list="{{ quickChips }}" as="c" hint-placeholder-count="5"><button sc-camel-on-click="{{ c.pick }}" style="background:#fff;border:1px solid rgba(23,57,92,.14);border-radius:999px;padding:7px 13px;cursor:pointer;font-size:14px;">{{ c.label }}</button></sc-for>\n        </div>'''
s=quick_pat.sub(quick,s,count=1)

# Add render values from STR and language-specific quick-chip handlers.
needle='''    return {\n      langButtons:'''
insert='''    const copy = STR[st.lang] || STR.es;\n    const quickChips = (copy.quickSearch || []).map((label) => ({ label, pick: () => this.setState({ q: label, tab: "search" }) }));\n    return {\n      intro1: copy.intro1, translationNote: copy.translationNote, booksSupport: copy.booksSupport, booksSee: copy.booksSee,\n      searchTab: copy.searchTab, askTab: copy.askTab, askForTab: copy.askForTab, searchPlaceholder: copy.searchPlaceholder, quickChips, startHere: copy.startHere,\n      allEveryday: copy.allEveryday, everydayDesc: copy.everydayDesc, allData: copy.allData, dataDesc: copy.dataDesc, allSupport: copy.allSupport, supportDesc: copy.supportDesc,\n      langButtons:'''
if needle in s and 'intro1: copy.intro1' not in s:
    s=s.replace(needle,insert,1)

p.write_text(s)
print('home language copy prepared')
