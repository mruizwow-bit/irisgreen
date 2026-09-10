#!/usr/bin/env python3
"""Aplica estados públicos verificables sin inventar validaciones.

- Elimina el estado DRAFT legado de Condiciones.
- Solo publica fecha y clasificación A/B/C para fichas con manifiesto documental.
- Las demás fichas pasan a «publicado · revisión individual pendiente».
- Añade a Metodología las normas de referencia y distingue autoevaluación de certificación.

No reescribe las explicaciones de las fichas.
"""
from __future__ import annotations
import argparse
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
POLICY_PATH = ROOT / 'editorial/standards/standards.json'
REPORT_DIR = ROOT / 'reports/standards'
DATE_ES = '10 de septiembre de 2026'
DATE_EN = '10 September 2026'


def load_policy():
    data = json.loads(POLICY_PATH.read_text(encoding='utf-8'))
    assert data['policy_date'] == '2026-09-10'
    assert data['standards']['web_accessibility']['reference'] == 'ISO/IEC 40500:2025'
    assert data['standards']['web_accessibility']['target'] == 'AA'
    return data


def add_css(text: str) -> str:
    if '/assets/validacion.css' not in text:
        text = text.replace('</head>', '<link rel="stylesheet" href="/assets/validacion.css"/>\n</head>', 1)
    return text


def spanish_date(iso: str) -> str:
    y, m, d = map(int, iso.split('-'))
    months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
    return f'{d} de {months[m-1]} de {y}'


def english_date(iso: str) -> str:
    y, m, d = map(int, iso.split('-'))
    months = ['January','February','March','April','May','June','July','August','September','October','November','December']
    return f'{d} {months[m-1]} {y}'


def strip_legacy_review(text: str) -> str:
    text = re.sub(r'\s*<p class="notice">Draft entry\..*?</p>\s*', '\n', text, flags=re.S)
    text = re.sub(r'<span class="chip lil">DRAFT</span>', '', text)
    text = re.sub(r'<span class="chip alt">Grade\s+[^<]+</span>', '', text)
    text = re.sub(r'\s*<section class="sec consult"[^>]*>.*?</section>\s*', '\n', text, flags=re.S)
    return text


def set_chip_grade(text: str, grade: str | None) -> str:
    def repl(m):
        tag = m.group(0)
        tag = re.sub(r'\sdata-grado="[^"]*"', '', tag)
        if grade:
            tag = tag[:-1] + f' data-grado="{html.escape(grade, quote=True)}">'
        return tag
    return re.sub(r'<p class="chips"[^>]*>', repl, text, count=1)


def status_markup(lang: str, reviewed: dict | None) -> str:
    if reviewed:
        date = spanish_date(reviewed['review_date']) if lang == 'es' else english_date(reviewed['review_date'])
        grade = reviewed['classification']
        if lang == 'es':
            body = f'<strong>Revisado documentalmente:</strong> {date} · <strong>Clasificación editorial {grade}.</strong> Las afirmaciones de esta ficha se han vinculado a las fuentes indicadas y a sus límites.'
        else:
            body = f'<strong>Documentary review completed:</strong> {date} · <strong>Editorial classification {grade}.</strong> The claims in this entry have been mapped to the listed sources and their limitations.'
        return f'<p class="ig-review-status" data-documentary-status="reviewed" data-review-date="{reviewed["review_date"]}" data-editorial-classification="{grade}">{body}</p>'
    if lang == 'es':
        body = '<strong>Publicado · revisión documental individual pendiente.</strong> La clasificación A/B/C no se presenta como revisada hasta comprobar esta ficha afirmación por afirmación.'
    else:
        body = '<strong>Published · individual documentary review pending.</strong> An A/B/C classification is not presented as reviewed until this entry has been checked claim by claim.'
    return f'<p class="ig-review-status" data-documentary-status="pending">{body}</p>'


def update_condition_page(path: Path, reviewed: dict | None) -> str:
    text = path.read_text(encoding='utf-8')
    lang = 'en' if path.parts[-5] == 'en' if False else None
    # Determine language from repository-relative path, not from translated page contents.
    rel = path.relative_to(ROOT).as_posix()
    lang = 'en' if rel.startswith('en/') else 'es'
    text = strip_legacy_review(text)
    text = re.sub(r'\s*<p class="ig-review-status"[^>]*>.*?</p>\s*', '\n', text, flags=re.S)
    text = set_chip_grade(text, reviewed['classification'] if reviewed else 'pendiente')
    marker = re.search(r'</p>\s*(?=<section class="sec")', text[text.find('<p class="chips"'):], flags=re.S)
    chips = re.search(r'<p class="chips"[^>]*>.*?</p>', text, flags=re.S)
    assert chips, rel
    insertion = '\n' + status_markup(lang, reviewed)
    text = text[:chips.end()] + insertion + text[chips.end():]
    if reviewed:
        text = re.sub(r'(<meta\s+content=")[0-9]{4}-[0-9]{2}-[0-9]{2}("\s+property="article:modified_time"/?>)', rf'\g<1>{reviewed["review_date"]}\2', text, count=1)
    return add_css(text)


def normalize_href(href: str) -> str:
    href = href.split('#',1)[0].split('?',1)[0]
    parts = []
    for part in href.split('/'):
        if part in ('', '.'):
            continue
        if part == '..':
            if parts: parts.pop()
        else:
            parts.append(part)
    # Relative links in these indexes start high enough that the useful suffix begins at es/ or en/.
    for i, part in enumerate(parts):
        if part in ('es','en'):
            return '/'.join(parts[i:]).rstrip('/') + '/index.html'
    return '/'.join(parts).rstrip('/') + '/index.html'


def update_cards(text: str, reviewed_map: dict, lang: str) -> str:
    card_re = re.compile(r'<a\s+class="card"(?P<attrs>[^>]*)href="(?P<href>[^"]+)"(?P<rest>[^>]*)>(?P<body>.*?)</a>', re.S)
    def repl(m):
        rel = normalize_href(m.group('href'))
        reviewed = reviewed_map.get(rel)
        body = m.group('body')
        body = re.sub(r'<span class="chip alt">(?:Grade\s+|Editorial\s+)[^<]+</span>', '', body)
        body = re.sub(r'data-grado="[^"]*"', f'data-grado="{reviewed["classification"] if reviewed else "pendiente"}"', body, count=1)
        if reviewed:
            chiprow = re.search(r'<span class="chiprow"[^>]*>', body)
            badge = f'<span class="chip alt">Editorial {reviewed["classification"]}</span>'
            if chiprow:
                body = body[:chiprow.end()] + badge + body[chiprow.end():]
            elif lang == 'en':
                first_chip = re.search(r'<span class="chip">.*?</span>', body, flags=re.S)
                if first_chip:
                    body = body[:first_chip.end()] + badge + body[first_chip.end():]
        return '<a class="card"' + m.group('attrs') + 'href="' + m.group('href') + '"' + m.group('rest') + '>' + body + '</a>'
    return card_re.sub(repl, text)


def update_index(path: Path, reviewed_map: dict) -> str:
    text = path.read_text(encoding='utf-8')
    lang = 'en' if path.relative_to(ROOT).as_posix().startswith('en/') else 'es'
    text = re.sub(r'\s*<p class="notice">All 185 entries are mounted,.*?</p>\s*', '\n', text, flags=re.S)
    text = re.sub(r'\s*<p class="notice ig-review-policy">.*?</p>\s*', '\n', text, flags=re.S)
    if lang == 'es':
        note = '<p class="notice ig-review-policy"><strong>Estado de revisión:</strong> cada ficha muestra su estado documental. Las letras A, B y C solo se presentan como revisadas cuando sus afirmaciones se han comprobado con fuentes identificadas y una fecha real.</p>'
    else:
        note = '<p class="notice ig-review-policy"><strong>Review status:</strong> each entry shows its documentary status. A, B and C are only presented as reviewed when the claims have been checked against identified sources and a real review date.</p>'
    lede = re.search(r'<p class="lede">.*?</p>', text, flags=re.S)
    assert lede, path
    text = text[:lede.end()] + '\n' + note + text[lede.end():]
    text = update_cards(text, reviewed_map, lang)
    return add_css(text)


STANDARDS_ES = '''<section class="sec" id="normas-y-estados"><h2>Normas y estados de revisión</h2>
<p>La accesibilidad técnica de la web se evalúa internamente frente a <strong>ISO/IEC 40500:2025</strong>, que incorpora WCAG 2.2. El objetivo es el nivel AA. La evaluación se documenta siguiendo WCAG-EM 2.0 y se contrasta, cuando corresponde, con UNE-EN 301549:2022.</p>
<p>La redacción se revisa con los principios y directrices de <strong>ISO 24495-1:2023</strong> para lenguaje claro. Esto no convierte automáticamente un texto en Lectura Fácil.</p>
<p>La expresión <strong>Lectura Fácil validada</strong> solo se utiliza después de realizar la fase de validación con personas con dificultades de comprensión lectora prevista en UNE 153101:2018 EX y UNE 153102:2018 EX.</p>
<p>La expresión <strong>evaluación interna de conformidad</strong> no significa «certificado por ISO». ISO no realiza la certificación de esta web. Si en el futuro existe una certificación externa, se identificará la entidad certificadora y su alcance.</p>
<p>Para el contenido, los estados son «Publicado · revisión documental individual pendiente», «Revisado documentalmente» con fecha real, o «Revisión documental necesaria tras actualización». Las letras A, B y C son una clasificación editorial del respaldo documental; no son categorías ISO ni GRADE y no garantizan eficacia.</p>
</section>'''

STANDARDS_EN = '''<section class="sec" id="normas-y-estados"><h2>Standards and review status</h2>
<p>Technical web accessibility is assessed internally against <strong>ISO/IEC 40500:2025</strong>, which incorporates WCAG 2.2. The target is Level AA. Evaluation is documented using WCAG-EM 2.0 and, where relevant, cross-checked against UNE-EN 301549:2022.</p>
<p>Writing is reviewed using the principles and guidelines of <strong>ISO 24495-1:2023</strong> for plain language. This does not automatically make a text Easy Read.</p>
<p>The wording <strong>validated Easy Read</strong> is only used after completing the validation phase with people who have reading-comprehension difficulties required by UNE 153101:2018 EX and UNE 153102:2018 EX.</p>
<p><strong>Internal conformance assessment</strong> does not mean “certified by ISO”. ISO does not certify this website. If an external certification is obtained in future, the certification body and scope will be identified.</p>
<p>Content status is either “Published · individual documentary review pending”, “Documentary review completed” with a real date, or “Documentary review required after update”. A, B and C are an editorial classification of documentary support; they are not ISO or GRADE categories and do not guarantee effectiveness.</p>
</section>'''


def inject_before_revision(markup: str, section: str) -> str:
    markup = re.sub(r'\s*<section class="sec" id="normas-y-estados">.*?</section>\s*', '\n', markup, flags=re.S)
    needle = '<section class="sec" id="revision">'
    assert needle in markup
    return markup.replace(needle, section + '\n' + needle, 1)


def update_methodology(path: Path) -> str:
    text = path.read_text(encoding='utf-8')
    text = add_css(text)
    # Spanish main.
    main_m = re.search(r'(<main id="main" class="methodology-page"[^>]*>)(.*?)(</main>)', text, flags=re.S)
    assert main_m
    es_main = inject_before_revision(main_m.group(2), STANDARDS_ES)
    es_main = re.sub(r'<time datetime="2026-09-\d{2}">Actualización editorial de esta página:.*?</time>', f'<time datetime="2026-09-10">Actualización editorial de esta página: {DATE_ES}.</time>', es_main)
    text = text[:main_m.start(2)] + es_main + text[main_m.end(2):]
    # Embedded English version.
    script_m = re.search(r'(<script id="method-translations" type="application/json">)(.*?)(</script>)', text, flags=re.S)
    assert script_m
    data = json.loads(script_m.group(2))
    data['main'] = inject_before_revision(data['main'], STANDARDS_EN)
    data['main'] = re.sub(r'<time datetime="2026-09-\d{2}">Editorial update to this page:.*?</time>', f'<time datetime="2026-09-10">Editorial update to this page: {DATE_EN}.</time>', data['main'])
    data['meta']['es']['date'] = f'Actualización editorial de esta página: {DATE_ES}.'
    data['meta']['en']['date'] = f'Editorial update to this page: {DATE_EN}.'
    packed = json.dumps(data, ensure_ascii=False).replace('</', '<\\/')
    text = text[:script_m.start(2)] + packed + text[script_m.end(2):]
    text = re.sub(r'"dateModified":"2026-09-\d{2}"', '"dateModified":"2026-09-10"', text, count=1)
    return text


def update_accessibility_page(path: Path) -> str:
    text = add_css(path.read_text(encoding='utf-8'))
    if 'id="normas-referencia"' not in text:
        block = '''<section class="sec" id="normas-referencia"><h2>Normas de referencia</h2><p>La referencia internacional para la accesibilidad web es ISO/IEC 40500:2025, que incorpora WCAG 2.2. Iris Green utiliza el nivel AA como objetivo y documenta la evaluación con WCAG-EM 2.0. UNE-EN 301549:2022 se utiliza como referencia complementaria para requisitos TIC en el contexto europeo.</p><p>Mientras queden criterios sin comprobar o corregir, la web no se presenta como certificada ni como plenamente conforme. La fecha y el alcance de una autoevaluación superada solo se publican después de cerrar las comprobaciones correspondientes.</p></section>'''
        needle = '<h2>Informar de una dificultad</h2>'
        assert needle in text
        text = text.replace(needle, block + '\n' + needle, 1)
    return text


def run(check=False):
    policy = load_policy()
    reviewed = policy['reviewed_entries']
    staged = {}
    es_root = ROOT/'es/neurodiversidad/condiciones'
    en_root = ROOT/'en/neurodiversity/conditions'
    condition_pages = [p for root in (es_root,en_root) for p in root.rglob('index.html') if p != root/'index.html']
    for path in condition_pages:
        rel = path.relative_to(ROOT).as_posix()
        staged[path] = update_condition_page(path, reviewed.get(rel))
    for path in (es_root/'index.html', en_root/'index.html'):
        staged[path] = update_index(path, reviewed)
    staged[ROOT/'es/metodologia/index.html'] = update_methodology(ROOT/'es/metodologia/index.html')
    staged[ROOT/'es/lectura-accesible/index.html'] = update_accessibility_page(ROOT/'es/lectura-accesible/index.html')
    changed = [p for p,s in staged.items() if p.read_text(encoding='utf-8') != s]
    if check:
        assert not changed, 'Salidas de validación desactualizadas: ' + ', '.join(str(p.relative_to(ROOT)) for p in changed[:20])
        return
    for p,s in staged.items():
        if p in changed:
            p.write_text(s, encoding='utf-8')
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    report = {
        'policy_date': policy['policy_date'],
        'condition_pages': len(condition_pages),
        'reviewed_pages': sum(1 for p in condition_pages if p.relative_to(ROOT).as_posix() in reviewed),
        'pending_pages': sum(1 for p in condition_pages if p.relative_to(ROOT).as_posix() not in reviewed),
        'draft_wording_removed_from_public_conditions': True,
        'classification_only_claimed_as_reviewed_when_manifest_exists': True,
        'iso_certification_claimed': False,
        'changed_files': [p.relative_to(ROOT).as_posix() for p in changed]
    }
    (REPORT_DIR/'status-application.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False))


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--check', action='store_true')
    run(ap.parse_args().check)
