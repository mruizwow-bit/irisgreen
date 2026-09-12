#!/usr/bin/env python3
"""Apply the approved English text for Books and the Spain/Support directory.

The Spanish source data is preserved at field level: this script only adds *_en
fields / cat_en and makes the existing directory template language-aware. It runs
at build time before prepare_initial_data.py regenerates the first-paint snapshot.
"""
from __future__ import annotations
import base64
import gzip
import json
from pathlib import Path
ROOT = Path.cwd()
DIRECTORY = ROOT / 'es/tramites/directorio/index.html'
DIRECTORY_DATA = ROOT / 'es/tramites/directorio/tramites-datos.json'
BOOKS = ROOT / 'es/libros/index.html'
_PATCH_FILES = ['ayudas-support-en-1.b64', 'ayudas-support-en-2a.b64', 'ayudas-support-en-2b.b64', 'ayudas-support-en-2c.b64', 'ayudas-support-en-2d.b64', 'ayudas-support-en-3a.b64', 'ayudas-support-en-3b.b64', 'ayudas-support-en-3c.b64', 'ayudas-support-en-3d.b64']
_PATCH_B64 = ''.join(((ROOT / 'scripts/data' / name).read_text(encoding='ascii').strip() for name in _PATCH_FILES))
PATCH = json.loads(gzip.decompress(base64.b64decode(''.join(_PATCH_B64.split()))).decode('utf-8'))
UI_KEYS = {'pageTitle': 'AYU-UI-0001', 'metaDescription': 'AYU-UI-0002', 'ogTitle': 'AYU-UI-0003', 'ogDescription': 'AYU-UI-0004', 'directoryTitle': 'AYU-UI-0005', 'intro': 'AYU-UI-0006', 'categoryLabel': 'AYU-UI-0007', 'clearFilters': 'AYU-UI-0008', 'who': 'AYU-UI-0009', 'docs': 'AYU-UI-0010', 'compatibility': 'AYU-UI-0011', 'officialLink': 'AYU-UI-0012', 'noResults': 'AYU-UI-0013', 'footerTagline': 'AYU-UI-0014', 'footerHow': 'AYU-UI-0015', 'methodology': 'AYU-UI-0016', 'readingPanel': 'AYU-UI-0017', 'searchAria': 'AYU-UI-0018', 'searchPlaceholder': 'AYU-UI-0019', 'close': 'AYU-UI-0020', 'notice': 'AYU-UI-0021', 'metaSpain': 'AYU-UI-0022', 'metaUK': 'AYU-UI-0023', 'metaBrazil': 'AYU-UI-0024', 'metaUS': 'AYU-UI-0025', 'metaWorld': 'AYU-UI-0026', 'metaReviewed': 'AYU-UI-0027', 'loadingDirectory': 'AYU-UI-0028', 'countrySpain': 'AYU-UI-0029', 'countryUK': 'AYU-UI-0030', 'countryBrazil': 'AYU-UI-0031', 'countryUS': 'AYU-UI-0032', 'countryWorld': 'AYU-UI-0033', 'allRegions': 'AYU-UI-0034', 'terrEs': 'AYU-UI-0035', 'terrBr': 'AYU-UI-0036', 'terrUs': 'AYU-UI-0037', 'terrWorld': 'AYU-UI-0038', 'terrUk': 'AYU-UI-0039', 'allEs': 'AYU-UI-0040', 'allBr': 'AYU-UI-0041', 'allUs': 'AYU-UI-0042', 'allWorld': 'AYU-UI-0043', 'allUk': 'AYU-UI-0044', 'anySupport': 'AYU-UI-0045', 'entryOne': 'AYU-UI-0046', 'entryMany': 'AYU-UI-0047', 'loading': 'AYU-UI-0048', 'viewDetails': 'AYU-UI-0049', 'moreStart': 'AYU-UI-0050', 'moreEnd': 'AYU-UI-0051'}

def ui_strings():
    out = {'es': {}, 'en': {}}
    for key, item_id in UI_KEYS.items():
        item = PATCH['ui'][item_id]
        out['es'][key] = item['texto']
        out['en'][key] = item['texto_en']
    return out

def replace_once(text: str, old: str, new: str, label: str) -> str:
    if new in text:
        return text
    count = text.count(old)
    if count != 1:
        raise ValueError(f'{label}: expected 1 occurrence, found {count}')
    return text.replace(old, new, 1)

def apply_data():
    data = json.loads(DIRECTORY_DATA.read_text(encoding='utf-8'))
    if len(data.get('es', [])) != PATCH['_meta']['spain_records']:
        raise ValueError(f"Spain record count changed: {len(data.get('es', []))}")
    current_ids = [row.get('id') for row in data['es']]
    if len(current_ids) != len(set(current_ids)):
        raise ValueError('Duplicate Spain support IDs')
    if set(current_ids) != set(PATCH['records']):
        missing = sorted(set(current_ids) - set(PATCH['records']))
        extra = sorted(set(PATCH['records']) - set(current_ids))
        raise ValueError(f'Spain translation IDs differ; missing={missing[:8]} extra={extra[:8]}')
    original = {row['id']: dict(row) for row in data['es']}
    for row in data['es']:
        additions = PATCH['records'][row['id']]
        for key, value in additions.items():
            row[key] = value
        cat = row.get('cat', '')
        if cat not in PATCH['categories']:
            raise ValueError(f'Missing category translation: {cat!r}')
        row['cat_en'] = PATCH['categories'][cat]
    for row in data['es']:
        before = original[row['id']]
        for key, value in before.items():
            if row.get(key) != value:
                raise ValueError(f"Spanish/source field changed: {row['id']} {key}")
    total = sum((len(v) for v in data.values() if isinstance(v, list)))
    if total != 2425:
        raise ValueError(f'Directory record count changed: {total}; review translated UI count before publishing')
    DIRECTORY_DATA.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

def apply_directory_ui():
    text = DIRECTORY.read_text(encoding='utf-8')
    text = text.replace('2.422 fichas de ayudas', '2.425 fichas de ayudas')
    ui = ui_strings()
    dirstr = 'const DIRSTR = ' + json.dumps(ui, ensure_ascii=False, separators=(',', ':')) + ';\n\n'
    if 'const DIRSTR = ' not in text:
        text = replace_once(text, 'const LANGSTR = {', dirstr + 'const LANGSTR = {', 'insert DIRSTR')
    static_replacements = [('>Directorio de ayudas y trámites</p>', '>{{ tDirectoryTitle }}</p>', 'directory title'), ('>Todo lo que puedes pedir, con su nombre oficial.</h1>', '>{{ tIntro }}</h1>', 'directory intro'), ('placeholder="comedor, autismo, luz, transporte, cuidados, universidad…"', 'aria-label="{{ tSearchAria }}" placeholder="{{ tSearchPlaceholder }}"', 'search accessible text'), ('>Lo que necesito\n          <sc-raw-select', '>{{ tCategoryLabel }}\n          <sc-raw-select', 'category label'), ('>Quitar los filtros</button>', '>{{ tClearFilters }}</button>', 'clear filters'), ('>Quién puede pedirlo</div>', '>{{ tWho }}</div>', 'who label'), ('>Qué papeles suelen pedir</div>', '>{{ tDocs }}</div>', 'docs label'), ('>Compatibilidad</div>', '>{{ tCompatibility }}</div>', 'compatibility label'), ('>Ir a la página oficial</a>', '>{{ tOfficialLink }}</a>', 'official link'), ('>No hay fichas con esas palabras. Prueba con otra palabra o quita los filtros.</p>', '>{{ tNoResults }}</p>', 'no results'), ('>Base de conocimiento sobre neurodiversidad</div>', '>{{ tFooterTagline }}</div>', 'footer tagline'), ('>Cómo pedirlo paso a paso</a>', '>{{ tFooterHow }}</a>', 'footer how'), ('>Metodología</a>', '>{{ tMethodology }}</a>', 'methodology'), ('id="ig-reading-title">Lectura accesible</strong>', 'id="ig-reading-title">{{ tReadingPanel }}</strong>', 'reading panel title'), ('aria-label="Cerrar" style="margin-left: auto;', 'aria-label="{{ tClose }}" style="margin-left: auto;', 'reading panel close')]
    for old, new, label in static_replacements:
        text = replace_once(text, old, new, label)
    set_lang_old = '  setLang(l) {\n    this.setState({ lang: l });\n    try { localStorage.setItem("ig_lang", l); document.documentElement.lang = l === "en" ? "en" : "es"; } catch (e) {}\n  }\n'
    set_lang_new = '  setLang(l) {\n    this.setState({ lang: l });\n    try { localStorage.setItem("ig_lang", l); document.documentElement.lang = l === "en" ? "en" : "es"; } catch (e) {}\n    this.syncHead(l);\n  }\n\n  syncHead(l) {\n    const T = DIRSTR[l === "en" ? "en" : "es"];\n    try { document.title = T.pageTitle; } catch (e) {}\n    const setMeta = (selector, value) => {\n      try { const el = document.querySelector(selector); if (el) el.setAttribute("content", value); } catch (e) {}\n    };\n    setMeta(\'meta[name="description"]\', T.metaDescription);\n    setMeta(\'meta[property="og:title"]\', T.ogTitle);\n    setMeta(\'meta[property="og:description"]\', T.ogDescription);\n  }\n'
    text = replace_once(text, set_lang_old, set_lang_new, 'language/head method')
    mount_anchor = '    try { document.documentElement.lang = document.documentElement.lang || "es"; } catch (e) {}\n    fetch("tramites-datos.json")'
    mount_new = '    try { document.documentElement.lang = document.documentElement.lang || "es"; } catch (e) {}\n    try { this.syncHead(localStorage.getItem("ig_lang") || "es"); } catch (e) { this.syncHead("es"); }\n    fetch("tramites-datos.json")'
    text = replace_once(text, mount_anchor, mount_new, 'initial translated head')
    rv_anchor = '  renderVals() {\n    const st = this.state;\n    let all = st.data ? (st.data[st.country] || []) : [];'
    rv_new = '  renderVals() {\n    const st = this.state;\n    const L = st.lang === "en" ? "en" : "es";\n    const T = DIRSTR[L];\n    const val = (f, key) => (L === "en" && f && f[key + "_en"]) ? f[key + "_en"] : ((f && f[key]) || "");\n    let all = st.data ? (st.data[st.country] || []) : [];'
    text = replace_once(text, rv_anchor, rv_new, 'render language context')
    lists_old = '    const terrs = [];\n    const cats = [];\n    all.forEach((f) => {\n      if (terrs.indexOf(f.terr) === -1) terrs.push(f.terr);\n      if (cats.indexOf(f.cat) === -1) cats.push(f.cat);\n    });'
    lists_new = '    const terrs = [];\n    const cats = [];\n    const catLabels = {};\n    all.forEach((f) => {\n      if (terrs.indexOf(f.terr) === -1) terrs.push(f.terr);\n      if (cats.indexOf(f.cat) === -1) cats.push(f.cat);\n      if (f.cat_en) catLabels[f.cat] = f.cat_en;\n    });'
    text = replace_once(text, lists_old, lists_new, 'category label map')
    text = replace_once(text, 'const hay = this.norm([f.name, f.que, f.quien, f.tags, f.cat, f.terr].join(" "));', 'const hay = this.norm([f.name, val(f, "que"), val(f, "quien"), val(f, "tags"), val(f, "cat"), f.terr].join(" "));', 'English search fields')
    return_anchor = '    return {\n      langButtons: [["es", "ES"], ["en", "EN"]].map(([code, label]) => ({'
    return_new = '    return {\n      tDirectoryTitle: T.directoryTitle, tIntro: T.intro,\n      tCategoryLabel: T.categoryLabel, tClearFilters: T.clearFilters,\n      tWho: T.who, tDocs: T.docs, tCompatibility: T.compatibility,\n      tOfficialLink: T.officialLink, tNoResults: T.noResults,\n      tFooterTagline: T.footerTagline, tFooterHow: T.footerHow, tMethodology: T.methodology,\n      tReadingPanel: T.readingPanel, tSearchAria: T.searchAria, tSearchPlaceholder: T.searchPlaceholder, tClose: T.close,\n      langButtons: [["es", "ES"], ["en", "EN"]].map(([code, label]) => ({'
    text = replace_once(text, return_anchor, return_new, 'return UI translations')
    meta_old = '      metaLine: st.data\n        ? "España " + (IG_INITIAL._counts.es) + " · Reino Unido " + (IG_INITIAL._counts.uk) + " · Brasil " + (IG_INITIAL._counts.br) + " · Estados Unidos " + (IG_INITIAL._counts.us) + " · resto del mundo " + (IG_INITIAL._counts.mundo) + " · última revisión 31/08/2026"\n        : "Cargando el directorio…",'
    meta_new = '      metaLine: st.data\n        ? T.metaSpain + (IG_INITIAL._counts.es) + " · " + T.metaUK + (IG_INITIAL._counts.uk) + " · " + T.metaBrazil + (IG_INITIAL._counts.br) + " · " + T.metaUS + (IG_INITIAL._counts.us) + " · " + T.metaWorld + (IG_INITIAL._counts.mundo) + " · " + T.metaReviewed\n        : T.loadingDirectory,'
    text = replace_once(text, meta_old, meta_new, 'translated count line')
    chips_old = '      countryChips: [["es", "España"], ["uk", "Reino Unido"], ["br", "Brasil"], ["us", "Estados Unidos"], ["mundo", "Resto del mundo"]].map(([code, label]) => Object.assign({'
    chips_new = '      countryChips: [["es", T.countrySpain], ["uk", T.countryUK], ["br", T.countryBrazil], ["us", T.countryUS], ["mundo", T.countryWorld]].map(([code, label]) => Object.assign({'
    text = replace_once(text, chips_old, chips_new, 'country labels')
    text = replace_once(text, 'label: r === "all" ? "Todas las regiones" : r,', 'label: r === "all" ? T.allRegions : r,', 'all regions')
    text = replace_once(text, 'terrLabel: st.country === "es" ? "Comunidad o ciudad autónoma" : st.country === "br" ? "Estado o Distrito Federal" : st.country === "us" ? "Estado o nivel federal" : st.country === "mundo" ? "País" : "Nación",', 'terrLabel: st.country === "es" ? T.terrEs : st.country === "br" ? T.terrBr : st.country === "us" ? T.terrUs : st.country === "mundo" ? T.terrWorld : T.terrUk,', 'territory labels')
    text = replace_once(text, 'terrOptions: [{ value: "all", label: st.country === "es" ? "Toda España" : st.country === "br" ? "Todo Brasil" : st.country === "us" ? "Todo Estados Unidos" : st.country === "mundo" ? "Todos los países" : "Todo el Reino Unido" }]', 'terrOptions: [{ value: "all", label: st.country === "es" ? T.allEs : st.country === "br" ? T.allBr : st.country === "us" ? T.allUs : st.country === "mundo" ? T.allWorld : T.allUk }]', 'territory all options')
    cat_old = '      catOptions: [{ value: "all", label: "Cualquier tipo de ayuda" }]\n        .concat(cats.map((c) => ({ value: c, label: c }))),'
    cat_new = '      catOptions: [{ value: "all", label: T.anySupport }]\n        .concat(cats.map((c) => ({ value: c, label: L === "en" ? (catLabels[c] || c) : c }))),'
    text = replace_once(text, cat_old, cat_new, 'category options')
    text = replace_once(text, 'countLabel: st.data ? rows.length + (rows.length === 1 ? " ficha" : " fichas") : "Cargando…",', 'countLabel: st.data ? rows.length + (rows.length === 1 ? T.entryOne : T.entryMany) : T.loading,', 'count label')
    card_old = '          name: f.name, terr: f.terr, cat: f.cat, que: f.que, cuantia: f.cuantia,\n          quien: f.quien, docs: f.docs, obs: f.obs, org: f.org, fuente: f.fuente,\n          open,\n          btnLabel: open ? "Cerrar" : "Ver los detalles",'
    card_new = '          name: f.name, terr: f.terr, cat: val(f, "cat"), que: val(f, "que"), cuantia: val(f, "cuantia"),\n          quien: val(f, "quien"), docs: val(f, "docs"), obs: val(f, "obs"), org: f.org, fuente: f.fuente,\n          open,\n          btnLabel: open ? T.close : T.viewDetails,'
    text = replace_once(text, card_old, card_new, 'translated cards')
    text = replace_once(text, 'moreLabel: "Ver más fichas (" + Math.max(0, rows.length - st.limit) + " restantes)",', 'moreLabel: T.moreStart + Math.max(0, rows.length - st.limit) + T.moreEnd,', 'more label')
    DIRECTORY.write_text(text, encoding='utf-8')

def apply_books():
    text = BOOKS.read_text(encoding='utf-8')
    es_p1 = 'Cada libro sigue un proceso editorial definido. Parte de una escritura original, que después se adapta siguiendo criterios de lenguaje claro y lectura fácil. El texto pasa por una corrección profesional antes de su publicación.'
    es_p2 = 'Las ilustraciones son realizadas por una ilustradora profesional y las ediciones en otros idiomas cuentan con traductores especializados, para conservar con la mayor fidelidad posible el sentido, el tono y la claridad del texto original.'
    en_p1 = 'Each book follows a defined editorial process. It begins with original writing, which is then adapted according to clear language and easy-to-read principles. The text undergoes professional editing before publication.'
    en_p2 = 'The illustrations are created by a professional illustrator, and editions in other languages are prepared by specialist translators to preserve, as faithfully as possible, the meaning, tone, and clarity of the original text.'
    text = replace_once(text, 'creditsTitle: "Quién hace qué",', 'creditsTitle: "Proceso editorial",', 'Spanish editorial title')
    text = replace_once(text, 'credits: "Los libros los escribe Iris Green, desde lo que ocurre en su casa, y los adapta ella misma a lectura fácil. La corrección profesional es de Natalia. Las ilustraciones, de Mary. Las traducciones, de Patricia, Wataru e Iris.",', 'credits: ' + json.dumps(es_p1 + '\n\n' + es_p2, ensure_ascii=False) + ',', 'Spanish editorial text')
    text = replace_once(text, 'creditsTitle: "Who does what",', 'creditsTitle: "Editorial Process",', 'English editorial title')
    text = replace_once(text, 'credits: "The books are written by Iris Green, out of what happens in her own home, and she adapts them to easy read herself. Professional proofreading is by Natalia. Illustrations by Mary. Translations by Patricia, Wataru and Iris.",', 'credits: ' + json.dumps(en_p1 + '\n\n' + en_p2, ensure_ascii=False) + ',', 'English editorial text')
    text = replace_once(text, 'text-wrap: pretty;">{{ tCredits }}</p>', 'text-wrap: pretty; white-space: pre-line;">{{ tCredits }}</p>', 'editorial paragraph breaks')
    BOOKS.write_text(text, encoding='utf-8')

def main():
    expected = {'ui_items': 51, 'spain_records': 258, 'spain_fields': 1548, 'category_labels': 15, 'total_translations': 1614}
    if PATCH['_meta'] != expected:
        raise ValueError('Unexpected translation package metadata')
    apply_data()
    apply_directory_ui()
    apply_books()
    print(json.dumps({'support_translations': 1614, 'spain_records': 258, 'directory_total': 2425, 'books_editorial_process': ['es', 'en'], 'portuguese_books_untouched': True}, ensure_ascii=False))
if __name__ == '__main__':
    main()
