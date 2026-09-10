#!/usr/bin/env python3
"""Aplica la distribución editorial final de las 185 fichas de Condiciones.

La clasificación editorial y la revisión documental individual son dos estados
distintos. Este script fija A/B/C/BP/SG en ES y EN, elimina D y los híbridos
A/B y B/C, y no convierte una ficha pendiente en "revisada" si no existe un
manifiesto documental individual.
"""
from __future__ import annotations
import argparse
import difflib
import html
import json
import re
from collections import Counter
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'editorial/standards/condition-classifications-2026-09-10.json'
REPORT_DIR = ROOT / 'reports/standards'
ES_INDEX = ROOT / 'es/neurodiversidad/condiciones/index.html'
EN_INDEX = ROOT / 'en/neurodiversity/conditions/index.html'
DATE_ES = '10 de septiembre de 2026'
DATE_EN = '10 September 2026'
VALID = {'A','B','C','BP','SG'}

CARD_RE = re.compile(
    r'<a\s+class="card"(?P<attrs>[^>]*)href="(?P<href>[^"]+)"(?P<rest>[^>]*)>(?P<body>.*?)</a>',
    re.S,
)

def load_data():
    data = json.loads(DATA.read_text(encoding='utf-8'))
    entries = data['entries']
    assert data['review_date'] == '2026-09-10'
    assert len(entries) == 185
    assert len({title for title, _ in entries}) == 185
    counts = Counter(grade for _, grade in entries)
    assert counts == Counter(data['distribution'])
    assert set(counts) == VALID
    return data, entries

def plain(markup):
    return ' '.join(html.unescape(re.sub(r'<[^>]+>', '', markup)).split())

def href_to_rel(href):
    path = urlsplit(href).path
    parts = [p for p in path.split('/') if p not in ('', '.', '..')]
    for i, part in enumerate(parts):
        if part in ('es','en'):
            return '/'.join(parts[i:]).rstrip('/') + '/index.html'
    return ''

def set_attr(tag, name, value):
    if re.search(rf'\s{name}="[^"]*"', tag):
        return re.sub(rf'\s{name}="[^"]*"', f' {name}="{html.escape(value, quote=True)}"', tag, count=1)
    return tag[:-1] + f' {name}="{html.escape(value, quote=True)}">'

def grade_badge(grade, lang):
    if lang == 'es':
        label = {'BP':'BP · práctica/apoyos','SG':'SG · sin grado'}.get(grade, f'Clasificación {grade}')
    else:
        label = {'BP':'BP · practice/supports','SG':'SG · no grade'}.get(grade, f'Classification {grade}')
    return f'<span class="chip alt" data-editorial-grade="{grade}">{label}</span>'

def replace_page_badge(chips, grade, lang):
    chips = re.sub(
        r'<span class="chip alt"[^>]*>(?:Grade|Editorial|Classification|Clasificación|BP\b|SG\b|no grade).*?</span>',
        '',
        chips,
        flags=re.S | re.I,
    )
    first = re.search(r'<span class="chip"(?:\s[^>]*)?>.*?</span>', chips, flags=re.S)
    badge = grade_badge(grade, lang)
    if first:
        return chips[:first.end()] + badge + chips[first.end():]
    return chips.replace('>', '>' + badge, 1)

def classification_status(grade, lang):
    if lang == 'es':
        if grade == 'BP':
            body = (f'<strong>Clasificación editorial revisada: BP · {DATE_ES}.</strong> '
                    'Esta ficha es de práctica, derechos, seguridad o apoyos; BP no es un grado de eficacia. '
                    'La revisión documental individual de sus afirmaciones sigue pendiente.')
        elif grade == 'SG':
            body = (f'<strong>Clasificación editorial revisada: SG · {DATE_ES}.</strong> '
                    'En esta ficha no se aplica una jerarquía A/B/C. '
                    'Las afirmaciones factuales siguen sujetas a revisión documental individual.')
        else:
            body = (f'<strong>Clasificación editorial revisada: {grade} · {DATE_ES}.</strong> '
                    'La letra describe el tipo de respaldo documental asignado a esta ficha. '
                    'La revisión documental afirmación por afirmación sigue pendiente.')
    else:
        if grade == 'BP':
            body = (f'<strong>Editorial classification reviewed: BP · {DATE_EN}.</strong> '
                    'This is a practice, rights, safety or support entry; BP is not an effectiveness grade. '
                    'Its individual claim-by-claim documentary review is still pending.')
        elif grade == 'SG':
            body = (f'<strong>Editorial classification reviewed: SG · {DATE_EN}.</strong> '
                    'An A/B/C evidence hierarchy is not applied to this entry. '
                    'Factual claims remain subject to individual documentary review.')
        else:
            body = (f'<strong>Editorial classification reviewed: {grade} · {DATE_EN}.</strong> '
                    'The letter describes the type of documentary support assigned to this entry. '
                    'Its claim-by-claim documentary review is still pending.')
    return (f'<p class="ig-review-status" data-documentary-status="pending" '
            f'data-classification-review-date="2026-09-10" '
            f'data-editorial-classification="{grade}">{body}</p>')

def update_page(path, grade, lang):
    text = path.read_text(encoding='utf-8')
    m = re.search(r'<p class="chips"[^>]*>.*?</p>', text, flags=re.S)
    assert m, path
    chips = m.group(0)
    opening_match = re.match(r'<p class="chips"[^>]*>', chips)
    assert opening_match
    opening = opening_match.group(0)
    opening2 = set_attr(opening, 'data-grado', grade)
    chips = opening2 + chips[len(opening):]
    chips = replace_page_badge(chips, grade, lang)
    text = text[:m.start()] + chips + text[m.end():]

    status = re.search(r'<p class="ig-review-status"[^>]*>.*?</p>', text, flags=re.S)
    if status:
        existing = status.group(0)
        if 'data-documentary-status="reviewed"' in existing:
            open_status = re.match(r'<p class="ig-review-status"[^>]*>', existing)
            assert open_status
            new_open = set_attr(open_status.group(0), 'data-editorial-classification', grade)
            existing = new_open + existing[open_status.end():]
            text = text[:status.start()] + existing + text[status.end():]
        else:
            text = text[:status.start()] + classification_status(grade, lang) + text[status.end():]
    else:
        insert = re.search(r'<p class="chips"[^>]*>.*?</p>', text, flags=re.S)
        assert insert
        text = text[:insert.end()] + '\n' + classification_status(grade, lang) + text[insert.end():]

    text = re.sub(
        r'(<meta\s+content=")[0-9]{4}-[0-9]{2}-[0-9]{2}("\s+property="article:modified_time"/?>)',
        r'\g<1>2026-09-10\2',
        text,
        count=1,
    )
    return text

def extract_en_rel(es_text):
    for tag in re.findall(r'<link\b[^>]*>', es_text, flags=re.S | re.I):
        if re.search(r'hreflang="en"', tag, flags=re.I):
            href = re.search(r'href="([^"]+)"', tag, flags=re.I)
            if href:
                rel = href_to_rel(href.group(1))
                if rel.startswith('en/'):
                    return rel
    raise AssertionError('No EN hreflang found')

def titles_match(expected, actual):
    e = expected.casefold().replace(' / bullying','')
    a = actual.casefold().replace(' / bullying','')
    if e == a:
        return True
    return difflib.SequenceMatcher(None, e, a).ratio() >= 0.72

def update_es_index(text, entries):
    seen = []
    route_grade = {}
    ordinal = 0
    def repl(m):
        nonlocal ordinal
        assert ordinal < len(entries)
        expected_title, grade = entries[ordinal]
        body = m.group('body')
        strong = re.search(r'<strong>(.*?)</strong>', body, flags=re.S)
        assert strong, ordinal
        actual_title = plain(strong.group(1))
        assert titles_match(expected_title, actual_title), (ordinal + 1, expected_title, actual_title)
        route = href_to_rel(m.group('href'))
        assert route.startswith('es/neurodiversidad/condiciones/'), route
        assert route not in route_grade
        route_grade[route] = grade
        seen.append((actual_title, grade))
        body = re.sub(r'<span class="chip alt"[^>]*>.*?</span>', '', body, flags=re.S)
        chiprow = re.search(r'<span class="chiprow"[^>]*>', body)
        assert chiprow, (ordinal + 1, actual_title)
        opening = set_attr(chiprow.group(0), 'data-grado', grade)
        body = body[:chiprow.start()] + opening + grade_badge(grade, 'es') + body[chiprow.end():]
        ordinal += 1
        return '<a class="card"' + m.group('attrs') + 'href="' + m.group('href') + '"' + m.group('rest') + '>' + body + '</a>'
    out = CARD_RE.sub(repl, text)
    assert ordinal == len(entries) == 185
    return out, route_grade, seen

def update_en_index(text, en_route_grade):
    matched = set()
    def repl(m):
        route = href_to_rel(m.group('href'))
        grade = en_route_grade.get(route)
        if not grade:
            return m.group(0)
        body = re.sub(r'<span class="chip alt"[^>]*>.*?</span>', '', m.group('body'), flags=re.S)
        first = re.search(r'<span class="chip"(?:\s[^>]*)?>.*?</span>', body, flags=re.S)
        assert first, route
        body = body[:first.end()] + grade_badge(grade, 'en') + body[first.end():]
        original_open = m.group(0)[:m.group(0).find('>')+1]
        original_open = set_attr(original_open, 'data-grado', grade)
        matched.add(route)
        return original_open + body + '</a>'
    out = CARD_RE.sub(repl, text)
    assert matched == set(en_route_grade), (len(matched), len(en_route_grade), sorted(set(en_route_grade)-matched)[:10])
    return out

def add_distribution_note(text, lang):
    text = re.sub(r'\s*<p class="ig-classification-distribution".*?</p>\s*', '\n', text, flags=re.S)
    if lang == 'es':
        note = (f'<p class="ig-classification-distribution"><strong>Clasificación editorial revisada el {DATE_ES}:</strong> '
                '21 A · 40 B · 44 C · 54 BP · 26 SG. Ya no se usan D, A/B ni B/C.</p>')
    else:
        note = (f'<p class="ig-classification-distribution"><strong>Editorial classification reviewed on {DATE_EN}:</strong> '
                '21 A · 40 B · 44 C · 54 BP · 26 SG. D, A/B and B/C are no longer used.</p>')
    anchor = re.search(r'<p class="notice ig-review-policy">.*?</p>', text, flags=re.S)
    if anchor:
        return text[:anchor.end()] + '\n' + note + text[anchor.end():]
    lede = re.search(r'<p class="lede">.*?</p>', text, flags=re.S)
    assert lede
    return text[:lede.end()] + '\n' + note + text[lede.end():]

def patch_methodology(text):
    es_old = ('<section class="sec" id="limites"><h2>Las etiquetas A, B y C</h2>\n'
              '<p>Algunas fichas utilizan estas letras para describir el respaldo recogido en la página: <strong>A</strong>, una guía clínica o revisión sistemática; <strong>B</strong>, documentos institucionales o estudios individuales; <strong>C</strong>, propuestas prácticas que no se presentan como resultados de investigación.</p>\n'
              '<p>Estas etiquetas deben leerse junto con las referencias y sus límites. No equivalen a una evaluación GRADE, una revisión clínica independiente ni una garantía de eficacia. La calidad de una explicación no queda resumida en una sola letra.</p>\n'
              '</section>')
    es_new = ('<section class="sec" id="limites"><h2>Clasificación editorial A, B, C, BP y SG</h2>\n'
              '<p><strong>A</strong> indica respaldo principal en guías clínicas vigentes, revisiones sistemáticas o síntesis de alto nivel pertinentes. <strong>B</strong> indica respaldo principal en documentación institucional, consensos o estudios revisados por pares. <strong>C</strong> indica que existe investigación, pero es emergente, limitada, heterogénea o indirecta para algunas afirmaciones.</p>\n'
              '<p><strong>BP</strong> identifica fichas de práctica, derechos, seguridad o apoyos y no es un grado de eficacia. <strong>SG</strong> significa que no se aplica una jerarquía A/B/C, por ejemplo en identidades o definiciones no terapéuticas. Las afirmaciones factuales de estas fichas siguen necesitando fuentes.</p>\n'
              '<p>La clasificación editorial se revisó para las 185 fichas el 10 de septiembre de 2026: 21 A, 40 B, 44 C, 54 BP y 26 SG. D, A/B y B/C dejaron de utilizarse.</p>\n'
              '<p>Estas etiquetas deben leerse junto con las referencias y sus límites. No equivalen a una evaluación GRADE, una revisión clínica independiente ni una garantía de eficacia.</p>\n'
              '</section>')
    if es_old in text:
        text = text.replace(es_old, es_new, 1)
    elif 'Clasificación editorial A, B, C, BP y SG' not in text:
        raise AssertionError('Bloque ES de clasificación no reconocido')

    trans = re.search(r'(<script id="method-translations" type="application/json">)(.*?)(</script>)', text, flags=re.S)
    assert trans
    data = json.loads(trans.group(2))
    en_old = ('<section class="sec" id="limites"><h2>The A, B and C labels</h2>\n'
              '<p>Some entries use these letters to describe the supporting material cited on the page: <strong>A</strong>, a clinical guideline or systematic review; <strong>B</strong>, institutional documents or individual studies; <strong>C</strong>, practical suggestions that are not presented as research findings.</p>\n'
              '<p>These labels should be read alongside the references and their limitations. They do not amount to a GRADE assessment, an independent clinical review or a guarantee of effectiveness. The quality of an explanation cannot be summed up in a single letter.</p>\n'
              '</section>')
    en_new = ('<section class="sec" id="limites"><h2>Editorial classification A, B, C, BP and SG</h2>\n'
              '<p><strong>A</strong> means the main support comes from current clinical guidelines, systematic reviews or other relevant high-level syntheses. <strong>B</strong> means the main support comes from institutional documents, consensus material or peer-reviewed studies. <strong>C</strong> means relevant research exists but is emerging, limited, heterogeneous or indirect for some claims.</p>\n'
              '<p><strong>BP</strong> identifies practice, rights, safety or support entries and is not an effectiveness grade. <strong>SG</strong> means an A/B/C hierarchy is not applied, for example to identities or non-therapeutic definitions. Factual claims in these entries still require sources.</p>\n'
              '<p>The editorial classification of all 185 entries was reviewed on 10 September 2026: 21 A, 40 B, 44 C, 54 BP and 26 SG. D, A/B and B/C are no longer used.</p>\n'
              '<p>These labels must be read with their references and limitations. They are not a GRADE assessment, an independent clinical review or a guarantee of effectiveness.</p>\n'
              '</section>')
    if en_old in data['main']:
        data['main'] = data['main'].replace(en_old, en_new, 1)
    elif 'Editorial classification A, B, C, BP and SG' not in data['main']:
        raise AssertionError('Bloque EN de clasificación no reconocido')
    packed = json.dumps(data, ensure_ascii=False).replace('</', '<\\/')
    text = text[:trans.start(2)] + packed + text[trans.end(2):]

    text = text.replace(
        'Las letras A, B y C son una clasificación editorial del respaldo documental; no son categorías ISO ni GRADE y no garantizan eficacia.',
        'A, B y C clasifican el respaldo documental; BP identifica práctica, derechos, seguridad o apoyos; SG indica que no se aplica una jerarquía A/B/C. Ninguna de estas etiquetas es una categoría ISO o GRADE ni garantiza eficacia.'
    )
    text = text.replace(
        'A, B and C are an editorial classification of documentary support; they are not ISO or GRADE categories and do not guarantee effectiveness.',
        'A, B and C classify documentary support; BP identifies practice, rights, safety or support; SG means an A/B/C hierarchy is not applied. None of these labels is an ISO or GRADE category or a guarantee of effectiveness.'
    )
    return text

def run(check=False):
    data, entries = load_data()
    staged = {}
    es_text = ES_INDEX.read_text(encoding='utf-8')
    es_text, es_route_grade, titles = update_es_index(es_text, entries)
    staged[ES_INDEX] = add_distribution_note(es_text, 'es')

    en_route_grade = {}
    for es_rel, grade in es_route_grade.items():
        es_path = ROOT / es_rel
        assert es_path.is_file(), es_rel
        current_es = es_path.read_text(encoding='utf-8')
        en_rel = extract_en_rel(current_es)
        assert en_rel not in en_route_grade, en_rel
        en_route_grade[en_rel] = grade
        staged[es_path] = update_page(es_path, grade, 'es')
        en_path = ROOT / en_rel
        assert en_path.is_file(), en_rel
        staged[en_path] = update_page(en_path, grade, 'en')

    assert len(es_route_grade) == len(en_route_grade) == 185
    en_text = update_en_index(EN_INDEX.read_text(encoding='utf-8'), en_route_grade)
    staged[EN_INDEX] = add_distribution_note(en_text, 'en')

    method = ROOT / 'es/metodologia/index.html'
    staged[method] = patch_methodology(method.read_text(encoding='utf-8'))

    changed = [p for p, new in staged.items() if p.read_text(encoding='utf-8') != new]
    if check:
        assert not changed, 'Distribución editorial desactualizada: ' + ', '.join(str(p.relative_to(ROOT)) for p in changed[:20])
        print(json.dumps({'checked': True, 'entries':185, 'distribution':data['distribution']}, ensure_ascii=False))
        return

    for path, new in staged.items():
        if path in changed:
            path.write_text(new, encoding='utf-8')

    es_after = ES_INDEX.read_text(encoding='utf-8')
    grades = re.findall(r'class="chiprow"[^>]*data-grado="(A|B|C|BP|SG)"', es_after)
    assert len(grades) == 185
    assert Counter(grades) == Counter(data['distribution'])
    assert not re.search(r'data-grado="(?:D|A/B|B/C|sin grado|pendiente)"', es_after)

    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    report = {
        'classification_review_date':'2026-09-10',
        'entries_es':185,
        'entries_en':185,
        'distribution':data['distribution'],
        'legacy_hybrid_or_d_values_remaining_in_es_index':False,
        'individual_documentary_review_kept_separate':True,
        'changed_files':len(changed),
        'title_alignment':titles,
    }
    (REPORT_DIR/'condition-classification-application.json').write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8'
    )
    print(json.dumps({k:v for k,v in report.items() if k!='title_alignment'}, ensure_ascii=False))

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--check', action='store_true')
    run(ap.parse_args().check)
